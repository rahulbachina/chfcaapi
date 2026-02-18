"""Custom exceptions for LexisNexis API service"""

from typing import Optional


class LexisNexisAPIError(Exception):
    """Base exception for LexisNexis API errors"""
    
    def __init__(self, message: str, error_code: Optional[str] = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class SOAPConnectionError(LexisNexisAPIError):
    """Exception raised when SOAP service is unavailable"""
    
    def __init__(self, message: str = "Failed to connect to SOAP service"):
        super().__init__(message, "SOAP_CONNECTION_ERROR")


class SOAPAuthenticationError(LexisNexisAPIError):
    """Exception raised for SOAP authentication failures"""
    
    def __init__(self, message: str = "SOAP authentication failed"):
        super().__init__(message, "SOAP_AUTH_ERROR")


class SOAPTimeoutError(LexisNexisAPIError):
    """Exception raised when SOAP request times out"""
    
    def __init__(self, message: str = "SOAP request timed out"):
        super().__init__(message, "SOAP_TIMEOUT")


class InvalidWSDLError(LexisNexisAPIError):
    """Exception raised when WSDL cannot be parsed"""
    
    def __init__(self, message: str = "Invalid or inaccessible WSDL"):
        super().__init__(message, "INVALID_WSDL")


class ScreeningError(LexisNexisAPIError):
    """Exception raised for screening operation errors"""
    
    def __init__(self, message: str = "Screening operation failed"):
        super().__init__(message, "SCREENING_ERROR")


class ValidationError(LexisNexisAPIError):
    """Exception raised for input validation errors"""
    
    def __init__(self, message: str = "Input validation failed"):
        super().__init__(message, "VALIDATION_ERROR")
