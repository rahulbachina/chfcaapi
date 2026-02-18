"""Utility functions for LexisNexis API service"""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
import time
from functools import wraps


def generate_screening_id() -> str:
    """Generate a unique screening ID"""
    return f"SCR-{uuid.uuid4()}"


def generate_monitoring_id() -> str:
    """Generate a unique monitoring ID"""
    return f"MON-{uuid.uuid4()}"


def get_iso_timestamp() -> str:
    """Get current timestamp in ISO 8601 format"""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def format_soap_date(date_str: Optional[str]) -> Optional[str]:
    """Format date for SOAP requests (YYYY-MM-DD)"""
    if not date_str:
        return None
    
    # Handle various input formats
    try:
        # Try ISO format first
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.strftime("%Y-%m-%d")
    except:
        # Return as-is if already in correct format
        return date_str


def calculate_match_score(raw_score: Any) -> int:
    """
    Normalize match score to 0-100 range
    
    Different SOAP services return scores in different ranges:
    - Some use 0-100
    - Some use 0-1000
    - Some use 0.0-1.0
    """
    try:
        score = float(raw_score)
        
        # If score is between 0-1, multiply by 100
        if 0 <= score <= 1:
            return int(score * 100)
        
        # If score is between 0-1000, divide by 10
        if score > 100:
            return int(score / 10)
        
        # Already in 0-100 range
        return int(score)
    except:
        return 0


def sanitize_input(text: Optional[str]) -> Optional[str]:
    """Sanitize input text for SOAP requests"""
    if not text:
        return None
    
    # Remove potentially problematic characters
    sanitized = text.strip()
    # Remove XML special characters if needed
    sanitized = sanitized.replace('<', '').replace('>', '')
    
    return sanitized


def retry_soap_call(max_retries: int = 3, backoff_factor: float = 2.0):
    """Decorator to retry SOAP calls with exponential backoff"""
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            retries = 0
            last_exception = None
            
            while retries < max_retries:
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    retries += 1
                    
                    if retries >= max_retries:
                        raise last_exception
                    
                    wait_time = backoff_factor ** retries
                    time.sleep(wait_time)
            
            raise last_exception
        
        return wrapper
    return decorator


def parse_soap_fault(fault: Any) -> Dict[str, str]:
    """Parse SOAP fault into readable error"""
    try:
        return {
            "code": str(fault.code) if hasattr(fault, 'code') else "UNKNOWN",
            "message": str(fault.message) if hasattr(fault, 'message') else str(fault),
            "detail": str(fault.detail) if hasattr(fault, 'detail') else None
        }
    except:
        return {
            "code": "UNKNOWN",
            "message": str(fault),
            "detail": None
        }
