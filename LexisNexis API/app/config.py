"""Configuration management for LexisNexis API service"""

from pydantic_settings import BaseSettings
from typing import Literal, Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # LexisNexis Bridger XG Configuration
    bridger_wsdl: str = "https://sandbox.lexisnexis.com/bridger/ScreeningService?wsdl"
    bridger_username: str = "mock_user"
    bridger_password: str = "mock_password"
    bridger_environment: Literal["sandbox", "production"] = "sandbox"
    
    # Mock Mode
    use_mock_data: bool = True
    
    # SOAP Configuration
    soap_timeout: int = 30  # seconds
    soap_retry_attempts: int = 3
    
    # API Configuration
    api_title: str = "LexisNexis Bridger XG Sanctions API"
    api_description: str = "FastAPI wrapper for LexisNexis Bridger XG SOAP services"
    api_version: str = "1.0.0"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8001
    debug: bool = True
    
    # Logging
    log_level: str = "INFO"
    
    # CORS
    cors_origins: str = "*"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
