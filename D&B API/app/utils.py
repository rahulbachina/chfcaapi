"""Utility functions for D&B API service"""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
import time
from functools import wraps


def generate_transaction_id() -> str:
    """Generate a unique transaction ID"""
    return str(uuid.uuid4())


def get_iso_timestamp() -> str:
    """Get current timestamp in ISO 8601 format"""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_dnb_error_code(error_code: str) -> Dict[str, Any]:
    """Parse D&B error code and return error details"""
    error_map = {
        "SC001": {
            "severity": "Fatal",
            "description": "Invalid user credentials or expired token",
            "action": "Re-authenticate or contact D&B support"
        },
        "CM000": {
            "severity": "Success",
            "description": "Request completed successfully",
            "action": None
        },
        "NF001": {
            "severity": "Error",
            "description": "Resource not found",
            "action": "Verify the requested resource exists"
        },
        "RL001": {
            "severity": "Error",
            "description": "Rate limit exceeded",
            "action": "Reduce request frequency"
        }
    }
    
    return error_map.get(error_code, {
        "severity": "Unknown",
        "description": f"Unknown error code: {error_code}",
        "action": "Contact support"
    })


def retry_with_backoff(max_retries: int = 3, backoff_factor: float = 2.0):
    """Decorator to retry function with exponential backoff"""
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries >= max_retries:
                        raise
                    wait_time = backoff_factor ** retries
                    time.sleep(wait_time)
            return None
        return wrapper
    return decorator


def format_duns(duns: str) -> str:
    """Format D-U-N-S number (remove hyphens, ensure 9 digits)"""
    cleaned = duns.replace("-", "").strip()
    if len(cleaned) == 9 and cleaned.isdigit():
        return cleaned
    raise ValueError(f"Invalid D-U-N-S number format: {duns}")


def build_transaction_detail(app_transaction_id: Optional[str] = None) -> Dict[str, Any]:
    """Build transaction detail object for D&B requests"""
    return {
        "ApplicationTransactionID": app_transaction_id or generate_transaction_id(),
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
