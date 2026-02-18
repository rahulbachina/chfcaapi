"""FastAPI application for D&B Direct 2.0 API"""

import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.dnb_client import dnb_client
from app.models import (
    CompanySearchRequest,
    HealthCheckResponse,
    ErrorResponse,
    ErrorDetail
)
from app.exceptions import (
    DNBAPIError,
    DNBAuthenticationError,
    DNBNotFoundError,
    DNBRateLimitError,
    DNBServiceUnavailableError
)
from app.utils import get_iso_timestamp

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting D&B API Service")
    logger.info(f"Mock mode: {settings.use_mock_data}")
    logger.info(f"Environment: {settings.dnb_environment}")
    yield
    logger.info("Shutting down D&B API Service")


# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(",") if settings.cors_origins != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(DNBAuthenticationError)
async def authentication_error_handler(request, exc: DNBAuthenticationError):
    """Handle authentication errors"""
    return JSONResponse(
        status_code=401,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "Fatal"
            },
            "timestamp": get_iso_timestamp()
        }
    )


@app.exception_handler(DNBNotFoundError)
async def not_found_error_handler(request, exc: DNBNotFoundError):
    """Handle not found errors"""
    return JSONResponse(
        status_code=404,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "Error"
            },
            "timestamp": get_iso_timestamp()
        }
    )


@app.exception_handler(DNBRateLimitError)
async def rate_limit_error_handler(request, exc: DNBRateLimitError):
    """Handle rate limit errors"""
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "Error"
            },
            "timestamp": get_iso_timestamp()
        }
    )


@app.exception_handler(DNBServiceUnavailableError)
async def service_unavailable_error_handler(request, exc: DNBServiceUnavailableError):
    """Handle service unavailable errors"""
    return JSONResponse(
        status_code=503,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "Error"
            },
            "timestamp": get_iso_timestamp()
        }
    )


@app.exception_handler(DNBAPIError)
async def api_error_handler(request, exc: DNBAPIError):
    """Handle general API errors"""
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "Error"
            },
            "timestamp": get_iso_timestamp()
        }
    )


# Health check endpoint
@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint
    
    Returns the service status and configuration information.
    """
    return HealthCheckResponse(
        status="healthy",
        version=settings.api_version,
        timestamp=get_iso_timestamp(),
        mock_mode=settings.use_mock_data,
        dnb_environment=settings.dnb_environment
    )


# Company search endpoint
@app.get("/api/v1/companies/search", tags=["Companies"])
async def search_companies(
    subject_name: str = Query(..., description="Company name to search for"),
    country_iso_code: str = Query("US", description="ISO Alpha-2 country code"),
    territory_name: str | None = Query(None, description="State/territory code"),
    match_type: str = Query("Advanced", description="Match type: Basic or Advanced")
):
    """
    Search for companies and retrieve D-U-N-S numbers
    
    This endpoint performs a company match/search operation to find D-U-N-S numbers
    for companies matching the search criteria.
    
    **Example:**
    ```
    GET /api/v1/companies/search?subject_name=GORMAN%20MANUFACTURING&country_iso_code=US&territory_name=CA
    ```
    """
    try:
        result = await dnb_client.search_companies(
            subject_name=subject_name,
            country_iso_code=country_iso_code,
            territory_name=territory_name,
            match_type=match_type
        )
        return result
    except DNBAPIError as e:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in company search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Company profile endpoint
@app.get("/api/v1/companies/{duns}/profile", tags=["Companies"])
async def get_company_profile(
    duns: str,
    product_code: str = Query("DCP_STD", description="Product code (DCP_STD, DCP_PREM)")
):
    """
    Get detailed company profile
    
    Retrieve comprehensive company information including business details,
    contact information, financials, and more.
    
    **Example:**
    ```
    GET /api/v1/companies/804735132/profile?product_code=DCP_STD
    ```
    
    **Test D-U-N-S Numbers:**
    - 804735132: Gorman Manufacturing Company, Inc. (test company)
    """
    try:
        result = await dnb_client.get_company_profile(duns=duns, product_code=product_code)
        return result
    except DNBAPIError as e:
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting company profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Financial statements endpoint
@app.get("/api/v1/companies/{duns}/financials", tags=["Financials"])
async def get_financial_statements(duns: str):
    """
    Get financial statements
    
    Retrieve detailed financial statements including balance sheet and income statement.
    
    **Example:**
    ```
    GET /api/v1/companies/804735132/financials
    ```
    """
    try:
        result = await dnb_client.get_financial_statements(duns=duns)
        return result
    except DNBAPIError as e:
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting financial statements: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Analytics endpoint
@app.get("/api/v1/companies/{duns}/analytics", tags=["Analytics"])
async def get_analytics(duns: str):
    """
    Get predictive analytics and risk scores
    
    Retrieve risk scores, predictive indicators, and analytics for a company.
    
    **Example:**
    ```
    GET /api/v1/companies/804735132/analytics
    ```
    """
    try:
        result = await dnb_client.get_analytics(duns=duns)
        return result
    except DNBAPIError as e:
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint
    
    Returns basic API information and links to documentation.
    """
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "description": settings.api_description,
        "documentation": "/docs",
        "health_check": "/health",
        "mock_mode": settings.use_mock_data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
