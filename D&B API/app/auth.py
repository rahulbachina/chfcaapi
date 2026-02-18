"""Authentication module for D&B API"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.config import settings
from app.exceptions import DNBAuthenticationError, DNBTokenExpiredError
from app.utils import build_transaction_detail
from app.mock_data import get_mock_auth_response

logger = logging.getLogger(__name__)


class TokenManager:
    """Manages D&B authentication tokens"""
    
    def __init__(self):
        self._token: Optional[str] = None
        self._token_expiry: Optional[datetime] = None
        self._failed_attempts: int = 0
        self._max_failed_attempts: int = 3
    
    @property
    def token(self) -> str:
        """Get current valid token, refresh if needed"""
        if self._is_token_valid():
            return self._token
        
        # Token expired or doesn't exist, get new one
        return self._refresh_token()
    
    def _is_token_valid(self) -> bool:
        """Check if current token is still valid"""
        if not self._token or not self._token_expiry:
            return False
        
        # Check if token has expired (with 5 minute buffer)
        buffer = timedelta(minutes=5)
        return datetime.now(timezone.utc) < (self._token_expiry - buffer)
    
    def _refresh_token(self) -> str:
        """Refresh authentication token"""
        if self._failed_attempts >= self._max_failed_attempts:
            raise DNBAuthenticationError(
                "Account locked due to multiple failed authentication attempts. "
                "Please contact D&B support."
            )
        
        try:
            logger.info("Requesting new authentication token")
            
            if settings.use_mock_data:
                # Use mock authentication
                response_data = get_mock_auth_response(success=True)
                
                if response_data.get("AuthenticationDetail"):
                    self._token = response_data["AuthenticationDetail"]["Token"]
                    self._token_expiry = datetime.now(timezone.utc) + timedelta(
                        seconds=settings.token_refresh_interval
                    )
                    self._failed_attempts = 0
                    logger.info("Successfully obtained mock authentication token")
                    return self._token
                else:
                    raise DNBAuthenticationError("Mock authentication failed")
            
            else:
                # Real D&B authentication would go here
                # This will be implemented when you get credentials
                import httpx
                
                headers = {
                    "x-dnb-user": settings.dnb_username,
                    "x-dnb-pwd": settings.dnb_password,
                    "Content-Type": "application/json"
                }
                
                body = {
                    "TransactionDetail": build_transaction_detail()
                }
                
                with httpx.Client() as client:
                    response = client.post(
                        settings.dnb_auth_url,
                        headers=headers,
                        json=body,
                        timeout=30.0
                    )
                    
                    if response.status_code == 200:
                        # Extract token from Authorization header
                        token = response.headers.get("Authorization")
                        if token:
                            self._token = token
                            self._token_expiry = datetime.now(timezone.utc) + timedelta(
                                seconds=settings.token_refresh_interval
                            )
                            self._failed_attempts = 0
                            logger.info("Successfully obtained authentication token")
                            return self._token
                    
                    # Authentication failed
                    self._failed_attempts += 1
                    raise DNBAuthenticationError(
                        f"Authentication failed with status {response.status_code}"
                    )
        
        except Exception as e:
            self._failed_attempts += 1
            logger.error(f"Authentication error: {str(e)}")
            raise DNBAuthenticationError(f"Failed to obtain authentication token: {str(e)}")
    
    def invalidate_token(self):
        """Invalidate current token (force refresh on next request)"""
        logger.info("Invalidating current token")
        self._token = None
        self._token_expiry = None
    
    def reset_failed_attempts(self):
        """Reset failed authentication attempts counter"""
        self._failed_attempts = 0


# Global token manager instance
token_manager = TokenManager()
