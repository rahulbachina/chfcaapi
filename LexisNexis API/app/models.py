"""Vendor-agnostic Pydantic models for sanctions screening API"""

from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime
from enum import Enum


# ============================================================================
# Enums
# ============================================================================

class RiskLevel(str, Enum):
    """Risk level classification"""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNKNOWN = "UNKNOWN"


class ScreeningStatus(str, Enum):
    """Screening status"""
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    FAILED = "FAILED"


class MatchCategory(str, Enum):
    """Match category types"""
    PEP = "PEP"  # Politically Exposed Person
    SANCTIONS = "SANCTIONS"
    ADVERSE_MEDIA = "ADVERSE_MEDIA"
    FINANCIAL_REGULATOR = "FINANCIAL_REGULATOR"
    LAW_ENFORCEMENT = "LAW_ENFORCEMENT"
    OTHER = "OTHER"


# ============================================================================
# Request Models
# ============================================================================

class Address(BaseModel):
    """Address information"""
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postalCode: Optional[str] = None


class Identifier(BaseModel):
    """Document or ID number"""
    type: str = Field(..., description="ID type (passport, national_id, tax_id, etc.)")
    number: str = Field(..., description="ID number")
    country: Optional[str] = Field(None, description="Issuing country")


class PersonScreenRequest(BaseModel):
    """Request to screen an individual person"""
    referenceId: str = Field(..., description="Your internal reference ID")
    fullName: str = Field(..., description="Full name of the person")
    firstName: Optional[str] = Field(None, description="First name")
    lastName: Optional[str] = Field(None, description="Last name")
    dob: Optional[str] = Field(None, description="Date of birth (YYYY-MM-DD)")
    nationality: Optional[str] = Field(None, description="Nationality (ISO country code)")
    country: Optional[str] = Field(None, description="Country of residence")
    address: Optional[Address] = None
    identifiers: Optional[List[Identifier]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "referenceId": "CUST-12345",
                "fullName": "Vladimir Putin",
                "firstName": "Vladimir",
                "lastName": "Putin",
                "dob": "1952-10-07",
                "nationality": "RU",
                "country": "RU"
            }
        }


class EntityScreenRequest(BaseModel):
    """Request to screen a business entity"""
    referenceId: str = Field(..., description="Your internal reference ID")
    entityName: str = Field(..., description="Business entity name")
    country: Optional[str] = Field(None, description="Country of registration")
    registrationNumber: Optional[str] = Field(None, description="Business registration number")
    address: Optional[Address] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "referenceId": "ENT-67890",
                "entityName": "Acme Corporation",
                "country": "US",
                "registrationNumber": "123456789"
            }
        }


class BatchScreenRequest(BaseModel):
    """Request to screen multiple subjects"""
    persons: Optional[List[PersonScreenRequest]] = None
    entities: Optional[List[EntityScreenRequest]] = None


# ============================================================================
# Response Models
# ============================================================================

class MatchSource(BaseModel):
    """Source of the match"""
    listName: str = Field(..., description="Name of the screening list")
    listType: str = Field(..., description="Type of list (SANCTIONS, PEP, etc.)")
    country: Optional[str] = Field(None, description="Country associated with the list")


class Match(BaseModel):
    """Individual match result"""
    matchId: str = Field(..., description="Unique match identifier")
    score: int = Field(..., description="Match score (0-100)")
    name: str = Field(..., description="Matched name")
    aliases: Optional[List[str]] = Field(None, description="Known aliases")
    categories: List[str] = Field(..., description="Match categories (PEP, SANCTIONS, etc.)")
    riskLevel: RiskLevel = Field(..., description="Risk level assessment")
    source: MatchSource = Field(..., description="Source information")
    dob: Optional[str] = Field(None, description="Date of birth if available")
    nationality: Optional[str] = Field(None, description="Nationality if available")
    description: Optional[str] = Field(None, description="Additional details")
    lastUpdated: Optional[str] = Field(None, description="Last update date")


class ScreeningResult(BaseModel):
    """Complete screening result"""
    screeningId: str = Field(..., description="Unique screening identifier")
    referenceId: str = Field(..., description="Your reference ID")
    status: ScreeningStatus = Field(..., description="Screening status")
    subject: Union[PersonScreenRequest, EntityScreenRequest] = Field(..., description="Screened subject")
    matches: List[Match] = Field(default_factory=list, description="List of matches found")
    matchCount: int = Field(..., description="Total number of matches")
    highestRiskLevel: RiskLevel = Field(..., description="Highest risk level found")
    createdAt: str = Field(..., description="Screening timestamp")
    processingTime: Optional[float] = Field(None, description="Processing time in seconds")


class BatchScreeningResult(BaseModel):
    """Batch screening result"""
    batchId: str = Field(..., description="Batch identifier")
    totalScreened: int = Field(..., description="Total subjects screened")
    results: List[ScreeningResult] = Field(..., description="Individual screening results")
    createdAt: str = Field(..., description="Batch timestamp")


# ============================================================================
# Monitoring Models
# ============================================================================

class MonitoringSetupRequest(BaseModel):
    """Request to setup ongoing monitoring"""
    referenceId: str = Field(..., description="Your reference ID")
    subject: Union[PersonScreenRequest, EntityScreenRequest] = Field(..., description="Subject to monitor")
    frequency: str = Field(default="daily", description="Monitoring frequency (daily, weekly, monthly)")


class MonitoringAlert(BaseModel):
    """Monitoring alert"""
    alertId: str = Field(..., description="Alert identifier")
    monitoringId: str = Field(..., description="Monitoring session ID")
    referenceId: str = Field(..., description="Your reference ID")
    alertType: str = Field(..., description="Type of alert")
    newMatches: List[Match] = Field(..., description="New matches found")
    alertDate: str = Field(..., description="Alert timestamp")


# ============================================================================
# Utility Models
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    timestamp: str
    mock_mode: bool
    soap_available: bool


class ErrorDetail(BaseModel):
    """Error detail"""
    error_code: Optional[str] = None
    message: str
    severity: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: ErrorDetail
    timestamp: str


class ScreeningListInfo(BaseModel):
    """Information about available screening lists"""
    listName: str
    listType: str
    description: str
    country: Optional[str] = None
    lastUpdated: Optional[str] = None
