"""Custom exceptions for D&B API service"""

from typing import Optional


class DNBAPIError(Exception):
    """Base exception for D&B API errors"""
    
    def __init__(self, message: str, error_code: str | None = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class DNBAuthenticationError(DNBAPIError):
    """Exception raised for authentication failures"""
    
    def __init__(self, message: str = "Authentication failed", error_code: str = "SC001"):
        super().__init__(message, error_code)


class DNBTokenExpiredError(DNBAPIError):
    """Exception raised when authentication token expires"""
    
    def __init__(self, message: str = "Authentication token has expired"):
        super().__init__(message, "SC001")


class DNBRateLimitError(DNBAPIError):
    """Exception raised when rate limit is exceeded"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, "RL001")


class DNBServiceUnavailableError(DNBAPIError):
    """Exception raised when D&B service is unavailable"""
    
    def __init__(self, message: str = "D&B service is currently unavailable"):
        super().__init__(message, "SU001")


class DNBNotFoundError(DNBAPIError):
    """Exception raised when requested resource is not found"""
    
    def __init__(self, message: str = "Requested resource not found"):
        super().__init__(message, "NF001")


class DNBValidationError(DNBAPIError):
    """Exception raised for validation errors"""
    
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, "VE001")
