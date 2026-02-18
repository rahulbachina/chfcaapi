"""D&B API Client"""

import logging
from typing import Any, Dict, Optional

from app.config import settings
from app.auth import token_manager
from app.exceptions import (
    DNBAPIError,
    DNBNotFoundError,
    DNBServiceUnavailableError,
    DNBRateLimitError
)
from app.mock_data import (
    get_mock_company_search_response,
    get_mock_company_profile,
    get_mock_financial_statements,
    get_mock_analytics
)
from app.utils import build_transaction_detail

logger = logging.getLogger(__name__)


class DNBClient:
    """Client for D&B Direct 2.0 API"""
    
    def __init__(self):
        self.base_url = settings.dnb_base_url
        self.api_version = settings.dnb_api_version
        self.use_mock = settings.use_mock_data
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for D&B API requests"""
        token = token_manager.token
        return {
            "Authorization": token,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    async def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to D&B API"""
        
        if self.use_mock:
            # Return mock data - actual implementation would be in specific methods
            logger.info(f"Mock mode: {method} {endpoint}")
            return {}
        
        # Real API call would go here when credentials are available
        import httpx
        
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    params=params,
                    json=json_data,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 401:
                    # Token expired, invalidate and retry
                    token_manager.invalidate_token()
                    raise DNBAPIError("Authentication token expired", "SC001")
                elif response.status_code == 404:
                    raise DNBNotFoundError("Resource not found")
                elif response.status_code == 429:
                    raise DNBRateLimitError("Rate limit exceeded")
                elif response.status_code >= 500:
                    raise DNBServiceUnavailableError("D&B service unavailable")
                else:
                    raise DNBAPIError(f"API request failed with status {response.status_code}")
        
        except httpx.RequestError as e:
            logger.error(f"Request error: {str(e)}")
            raise DNBServiceUnavailableError(f"Failed to connect to D&B API: {str(e)}")
    
    async def search_companies(
        self,
        subject_name: str,
        country_iso_code: str = "US",
        territory_name: Optional[str] = None,
        match_type: str = "Advanced"
    ) -> Dict[str, Any]:
        """Search for companies and get D-U-N-S numbers"""
        
        logger.info(f"Searching for company: {subject_name}")
        
        if self.use_mock:
            return get_mock_company_search_response(subject_name)
        
        # Real API call
        endpoint = f"/V{self.api_version}/organizations"
        params = {
            "CountryISOAlpha2Code": country_iso_code,
            "SubjectName": subject_name,
            "match": "true",
            "MatchTypeText": match_type
        }
        
        if territory_name:
            params["TerritoryName"] = territory_name
        
        return await self._make_request("GET", endpoint, params=params)
    
    async def get_company_profile(
        self,
        duns: str,
        product_code: str = "DCP_STD"
    ) -> Dict[str, Any]:
        """Get detailed company profile"""
        
        logger.info(f"Getting company profile for D-U-N-S: {duns}")
        
        if self.use_mock:
            return get_mock_company_profile(duns)
        
        # Real API call
        endpoint = f"/V{self.api_version}/organizations/{duns}/products/{product_code}"
        return await self._make_request("GET", endpoint)
    
    async def get_financial_statements(self, duns: str) -> Dict[str, Any]:
        """Get financial statements for a company"""
        
        logger.info(f"Getting financial statements for D-U-N-S: {duns}")
        
        if self.use_mock:
            return get_mock_financial_statements(duns)
        
        # Real API call would use appropriate endpoint
        endpoint = f"/V{self.api_version}/organizations/{duns}/financials"
        return await self._make_request("GET", endpoint)
    
    async def get_analytics(self, duns: str) -> Dict[str, Any]:
        """Get predictive analytics and risk scores"""
        
        logger.info(f"Getting analytics for D-U-N-S: {duns}")
        
        if self.use_mock:
            return get_mock_analytics(duns)
        
        # Real API call would use appropriate endpoint
        endpoint = f"/V{self.api_version}/organizations/{duns}/analytics"
        return await self._make_request("GET", endpoint)


# Global client instance
dnb_client = DNBClient()
