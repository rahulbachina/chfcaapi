"""Configuration management for D&B API service"""

from pydantic_settings import BaseSettings
from typing import Literal, Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # D&B API Configuration
    dnb_username: str = "mock_user"
    dnb_password: str = "mock_password"
    dnb_environment: Literal["sandbox", "production"] = "sandbox"
    dnb_api_version: str = "5.0"
    dnb_auth_version: str = "2.0"
    
    # Mock Mode
    use_mock_data: bool = True
    
    # API Configuration
    api_title: str = "D&B Direct 2.0 API Service"
    api_description: str = "FastAPI wrapper for Dun & Bradstreet Direct 2.0 REST API"
    api_version: str = "1.0.0"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # Token Management
    token_refresh_interval: int = 86400  # 24 hours in seconds
    
    # Rate Limiting
    rate_limit_qps: int = 10  # Queries per second
    
    # Logging
    log_level: str = "INFO"
    
    # CORS
    cors_origins: str = "*"
    
    # Redis (Optional)
    redis_url: Optional[str] = None
    
    @property
    def dnb_base_url(self) -> str:
        """Get D&B base URL based on environment"""
        if self.dnb_environment == "sandbox":
            return "https://direct.dnb.com"
        return "https://direct.dnb.com"
    
    @property
    def dnb_auth_url(self) -> str:
        """Get D&B authentication URL"""
        return f"{self.dnb_base_url}/Authentication/V{self.dnb_auth_version}/"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
