"""FastAPI application for LexisNexis Bridger XG SOAP-to-REST API"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes import router
from app.exceptions import LexisNexisAPIError
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
    # Startup
    logger.info("Starting LexisNexis Bridger XG API Service")
    logger.info(f"Mock mode: {settings.use_mock_data}")
    logger.info(f"Environment: {settings.bridger_environment}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down LexisNexis Bridger XG API Service")


# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(LexisNexisAPIError)
async def lexisnexis_exception_handler(request: Request, exc: LexisNexisAPIError):
    """Handle LexisNexis API exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "error_code": exc.error_code,
                "message": exc.message,
                "severity": "ERROR"
            },
            "timestamp": get_iso_timestamp()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "error_code": "INTERNAL_ERROR",
                "message": str(exc),
                "severity": "ERROR"
            },
            "timestamp": get_iso_timestamp()
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Service health check"""
    return {
        "status": "healthy",
        "version": settings.api_version,
        "timestamp": get_iso_timestamp(),
        "mock_mode": settings.use_mock_data,
        "soap_available": True if settings.use_mock_data else False  # Would check SOAP connection in real mode
    }


# Include API routes
app.include_router(router, prefix="/api/v1", tags=["Screening"])


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
