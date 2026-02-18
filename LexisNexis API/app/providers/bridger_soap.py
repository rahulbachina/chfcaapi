"""
LexisNexis Bridger XG SOAP Client

⚠️ THIS IS THE ONLY FILE THAT KNOWS ABOUT LEXISNEXIS
All other files are vendor-agnostic and can work with any provider
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from app.config import settings
from app.exceptions import (
    SOAPConnectionError,
    SOAPAuthenticationError,
    SOAPTimeoutError,
    InvalidWSDLError,
    ScreeningError
)
from app.utils import (
    generate_screening_id,
    generate_monitoring_id,
    get_iso_timestamp,
    calculate_match_score,
    sanitize_input,
    format_soap_date
)
from app.mock_data import (
    get_mock_person_screening_high_risk,
    get_mock_person_screening_medium_risk,
    get_mock_person_screening_no_match,
    get_mock_entity_screening_sanctions,
    get_mock_entity_screening_no_match,
    get_mock_batch_screening,
    get_mock_monitoring_alert,
    get_mock_screening_lists
)
from app.models import RiskLevel

logger = logging.getLogger(__name__)


class BridgerSOAPClient:
    """
    SOAP client for LexisNexis Bridger XG
    
    This is the ONLY class that contains vendor-specific logic.
    To switch providers, create a new provider class with the same interface.
    """
    
    def __init__(self):
        self.wsdl_url = settings.bridger_wsdl
        self.username = settings.bridger_username
        self.password = settings.bridger_password
        self.timeout = settings.soap_timeout
        self.use_mock = settings.use_mock_data
        self.client = None
        
        if not self.use_mock:
            self._initialize_soap_client()
    
    def _initialize_soap_client(self):
        """Initialize SOAP client with zeep"""
        try:
            from zeep import Client
            from zeep.transports import Transport
            from requests import Session
            from requests.auth import HTTPBasicAuth
            
            # Create session with authentication
            session = Session()
            session.auth = HTTPBasicAuth(self.username, self.password)
            
            # Create transport with timeout
            transport = Transport(session=session, timeout=self.timeout)
            
            # Create SOAP client
            self.client = Client(wsdl=self.wsdl_url, transport=transport)
            
            logger.info(f"SOAP client initialized successfully: {self.wsdl_url}")
            
        except Exception as e:
            logger.error(f"Failed to initialize SOAP client: {str(e)}")
            raise InvalidWSDLError(f"Failed to initialize SOAP client: {str(e)}")
    
    async def screen_person(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Screen a person via SOAP
        
        Args:
            payload: Person screening data
            
        Returns:
            SOAP response (will be normalized later)
        """
        logger.info(f"Screening person: {payload.get('fullName')}")
        
        if self.use_mock:
            # Return mock data based on name
            full_name = payload.get("fullName", "").upper()
            reference_id = payload.get("referenceId", "")
            
            # High-risk names
            if "PUTIN" in full_name or "KIM JONG" in full_name:
                return get_mock_person_screening_high_risk(payload.get("fullName"), reference_id)
            
            # Medium-risk names
            elif "FRAUD" in full_name or "CRIMINAL" in full_name:
                return get_mock_person_screening_medium_risk(payload.get("fullName"), reference_id)
            
            # Clean
            else:
                return get_mock_person_screening_no_match(reference_id)
        
        # Real SOAP call
        try:
            # ⚠️ Method name depends on your WSDL
            # Common names: RunSearch, Search, Screening, SubmitSearch
            
            soap_request = {
                "FullName": sanitize_input(payload.get("fullName")),
                "FirstName": sanitize_input(payload.get("firstName")),
                "LastName": sanitize_input(payload.get("lastName")),
                "DOB": format_soap_date(payload.get("dob")),
                "Nationality": payload.get("nationality"),
                "Country": payload.get("country"),
                "ReferenceId": payload.get("referenceId")
            }
            
            # Remove None values
            soap_request = {k: v for k, v in soap_request.items() if v is not None}
            
            # Make SOAP call
            response = self.client.service.RunSearch(soap_request)
            
            return response
            
        except Exception as e:
            logger.error(f"SOAP person screening failed: {str(e)}")
            raise ScreeningError(f"Person screening failed: {str(e)}")
    
    async def screen_entity(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Screen a business entity via SOAP"""
        logger.info(f"Screening entity: {payload.get('entityName')}")
        
        if self.use_mock:
            entity_name = payload.get("entityName", "").upper()
            reference_id = payload.get("referenceId", "")
            
            # Sanctioned entities
            if "ROSNEFT" in entity_name or "GAZPROM" in entity_name or "BANK OF" in entity_name:
                return get_mock_entity_screening_sanctions(payload.get("entityName"), reference_id)
            
            # Clean
            else:
                return get_mock_entity_screening_no_match(reference_id)
        
        # Real SOAP call
        try:
            soap_request = {
                "EntityName": sanitize_input(payload.get("entityName")),
                "Country": payload.get("country"),
                "RegistrationNumber": payload.get("registrationNumber"),
                "ReferenceId": payload.get("referenceId")
            }
            
            soap_request = {k: v for k, v in soap_request.items() if v is not None}
            
            response = self.client.service.RunEntitySearch(soap_request)
            
            return response
            
        except Exception as e:
            logger.error(f"SOAP entity screening failed: {str(e)}")
            raise ScreeningError(f"Entity screening failed: {str(e)}")
    
    async def batch_screen(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Batch screening via SOAP"""
        logger.info("Processing batch screening")
        
        if self.use_mock:
            return get_mock_batch_screening()
        
        # Real SOAP batch call
        try:
            response = self.client.service.BatchScreen(payload)
            return response
        except Exception as e:
            logger.error(f"SOAP batch screening failed: {str(e)}")
            raise ScreeningError(f"Batch screening failed: {str(e)}")
    
    async def get_screening_lists(self) -> List[Dict[str, Any]]:
        """Get available screening lists"""
        if self.use_mock:
            return get_mock_screening_lists()
        
        try:
            response = self.client.service.GetAvailableLists()
            return response
        except Exception as e:
            logger.error(f"Failed to get screening lists: {str(e)}")
            return []
    
    # ========================================================================
    # Normalization Layer - Convert SOAP XML to REST JSON
    # ========================================================================
    
    def normalize_person_response(self, soap_response: Dict[str, Any], subject: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize SOAP person screening response to vendor-agnostic format
        
        This is where we handle different SOAP response structures
        """
        screening_data = soap_response.get("ScreeningResponse", {})
        
        matches = self._parse_matches(screening_data.get("Matches", []))
        
        # Determine highest risk level
        highest_risk = RiskLevel.LOW
        if matches:
            risk_levels = [m["riskLevel"] for m in matches]
            if RiskLevel.HIGH in risk_levels:
                highest_risk = RiskLevel.HIGH
            elif RiskLevel.MEDIUM in risk_levels:
                highest_risk = RiskLevel.MEDIUM
        
        return {
            "screeningId": screening_data.get("ScreeningId", generate_screening_id()),
            "referenceId": screening_data.get("ReferenceId", subject.get("referenceId")),
            "status": screening_data.get("Status", "COMPLETED"),
            "subject": subject,
            "matches": matches,
            "matchCount": len(matches),
            "highestRiskLevel": highest_risk,
            "createdAt": get_iso_timestamp(),
            "processingTime": screening_data.get("ProcessingTime")
        }
    
    def normalize_entity_response(self, soap_response: Dict[str, Any], subject: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize SOAP entity screening response"""
        # Same structure as person for now
        return self.normalize_person_response(soap_response, subject)
    
    def _parse_matches(self, soap_matches: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Parse and normalize SOAP matches
        
        Handles different field names and structures from different WSDL versions
        """
        normalized_matches = []
        
        for match in soap_matches:
            # Determine risk level based on categories and score
            categories = match.get("Categories", [])
            score = calculate_match_score(match.get("Score", 0))
            
            risk_level = self._determine_risk_level(categories, score)
            
            normalized_match = {
                "matchId": match.get("EntityId", f"MATCH-{generate_screening_id()}"),
                "score": score,
                "name": match.get("Name", ""),
                "aliases": match.get("Aliases", []),
                "categories": categories,
                "riskLevel": risk_level,
                "source": {
                    "listName": match.get("ListName", "Unknown"),
                    "listType": match.get("ListType", "OTHER"),
                    "country": match.get("Country")
                },
                "dob": match.get("DOB"),
                "nationality": match.get("Nationality"),
                "description": match.get("Description"),
                "lastUpdated": match.get("LastUpdated")
            }
            
            normalized_matches.append(normalized_match)
        
        return normalized_matches
    
    def _determine_risk_level(self, categories: List[str], score: int) -> RiskLevel:
        """Determine risk level based on categories and score"""
        # High risk: Sanctions or high-score PEP
        if "SANCTIONS" in categories:
            return RiskLevel.HIGH
        
        if "PEP" in categories and score >= 90:
            return RiskLevel.HIGH
        
        # Medium risk: PEP or adverse media
        if "PEP" in categories or "ADVERSE_MEDIA" in categories:
            return RiskLevel.MEDIUM
        
        # Low risk: Other categories or low scores
        if score >= 70:
            return RiskLevel.MEDIUM
        
        return RiskLevel.LOW


# Global client instance
bridger_client = BridgerSOAPClient()
