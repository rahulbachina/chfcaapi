"""Pydantic models for D&B API requests and responses"""

from pydantic import BaseModel, Field
from typing import Any, Union, Optional
from datetime import datetime


# ============================================================================
# Common Models
# ============================================================================

class TransactionDetail(BaseModel):
    """Transaction detail for D&B requests"""
    ApplicationTransactionID: str
    ServiceTransactionID: str
    TransactionTimestamp: str


class TransactionResult(BaseModel):
    """Transaction result from D&B responses"""
    SeverityText: Optional[str] = None
    ResultID: str
    ResultText: str
    ResultMessage: Optional[dict[str, Any]] = None


# ============================================================================
# Authentication Models
# ============================================================================

class AuthenticationDetail(BaseModel):
    """Authentication details"""
    Token: str


class AuthenticationResponse(BaseModel):
    """Response from authentication endpoint"""
    TransactionDetail: TransactionDetail
    TransactionResult: TransactionResult
    AuthenticationDetail: Optional[AuthenticationDetail] = None


# ============================================================================
# Company Search Models
# ============================================================================

class CompanySearchRequest(BaseModel):
    """Request model for company search"""
    subject_name: str = Field(..., description="Company name to search for")
    country_iso_code: str = Field(default="US", description="ISO Alpha-2 country code")
    territory_name: Optional[str] = Field(None, description="State/territory code")
    match_type: str = Field(default="Advanced", description="Match type: Basic or Advanced")
    
    class Config:
        json_schema_extra = {
            "example": {
                "subject_name": "GORMAN MANUFACTURING",
                "country_iso_code": "US",
                "territory_name": "CA",
                "match_type": "Advanced"
            }
        }


class OrganizationPrimaryName(BaseModel):
    """Organization primary name"""
    OrganizationName: str
    

class OrganizationName(BaseModel):
    """Organization name details"""
    OrganizationPrimaryName: list[OrganizationPrimaryName]


class PrimaryAddress(BaseModel):
    """Primary address information"""
    StreetAddressLine: list[dict[str, str]] | None = None
    PrimaryTownName: Optional[str] = None
    CountryISOAlpha2Code: Optional[str] = None
    PostalCode: Optional[str] = None
    TerritoryAbbreviatedName: Optional[str] = None


class Location(BaseModel):
    """Location information"""
    PrimaryAddress: PrimaryAddress


class Organization(BaseModel):
    """Organization information from search"""
    DUNSNumber: str
    OrganizationName: OrganizationName
    PrimaryAddress: PrimaryAddress
    MatchQualityInformation: Optional[dict[str, Any]] = None


class MatchCandidate(BaseModel):
    """Match candidate from search results"""
    Organization: Organization
    MatchGrade: Optional[str] = None
    ConfidenceCode: Optional[int] = None


class MatchResponse(BaseModel):
    """Response from company match/search"""
    TransactionDetail: TransactionDetail
    TransactionResult: TransactionResult
    MatchCandidate: Optional[list[MatchCandidate]] = None


# ============================================================================
# Company Profile Models
# ============================================================================

class CompanyProfileRequest(BaseModel):
    """Request model for company profile"""
    duns: str = Field(..., description="D-U-N-S number")
    product_code: str = Field(default="DCP_STD", description="Product code (DCP_STD, DCP_PREM)")


class Telecommunication(BaseModel):
    """Telecommunication details"""
    TelecommunicationNumber: str
    TelecommunicationNumberType: Optional[str] = None


class FinancialStatement(BaseModel):
    """Financial statement summary"""
    StatementDate: Optional[str] = None
    Currency: Optional[str] = None
    Revenue: Optional[float] = None
    NetIncome: Optional[float] = None
    TotalAssets: Optional[float] = None


class CompanyProfile(BaseModel):
    """Detailed company profile"""
    DUNSNumber: str
    OrganizationName: OrganizationName
    PrimaryAddress: PrimaryAddress
    Telecommunication: Optional[list[Telecommunication]] = None
    EmployeeQuantity: Optional[int] = None
    SalesRevenueAmount: Optional[float] = None
    StockExchangeDetails: Optional[dict[str, Any]] = None
    FinancialStatement: Optional[list[FinancialStatement]] = None
    BusinessDescription: Optional[str] = None
    OperatingStatusText: Optional[str] = None
    StartDate: Optional[str] = None


class CompanyProfileResponse(BaseModel):
    """Response from company profile endpoint"""
    TransactionDetail: TransactionDetail
    TransactionResult: TransactionResult
    Organization: CompanyProfile


# ============================================================================
# Financial Statements Models
# ============================================================================

class BalanceSheet(BaseModel):
    """Balance sheet information"""
    TotalAssets: Optional[float] = None
    TotalLiabilities: Optional[float] = None
    NetWorth: Optional[float] = None
    CurrentAssets: Optional[float] = None
    CurrentLiabilities: Optional[float] = None


class IncomeStatement(BaseModel):
    """Income statement information"""
    Revenue: Optional[float] = None
    GrossProfit: Optional[float] = None
    OperatingIncome: Optional[float] = None
    NetIncome: Optional[float] = None
    EBITDA: Optional[float] = None


class FinancialStatementDetail(BaseModel):
    """Detailed financial statement"""
    StatementDate: str
    Currency: str
    BalanceSheet: Optional[BalanceSheet] = None
    IncomeStatement: Optional[IncomeStatement] = None
    FiscalYear: Optional[int] = None


class FinancialStatementsResponse(BaseModel):
    """Response from financial statements endpoint"""
    TransactionDetail: TransactionDetail
    TransactionResult: TransactionResult
    DUNSNumber: str
    FinancialStatements: list[FinancialStatementDetail]


# ============================================================================
# Analytics Models
# ============================================================================

class RiskScore(BaseModel):
    """Risk score information"""
    ScoreType: str
    ScoreValue: int
    ScoreDate: str
    RiskLevel: str
    ScoreDescription: Optional[str] = None


class PredictiveIndicator(BaseModel):
    """Predictive indicator"""
    IndicatorType: str
    IndicatorValue: str | float
    IndicatorDescription: Optional[str] = None


class AnalyticsResponse(BaseModel):
    """Response from analytics endpoint"""
    TransactionDetail: TransactionDetail
    TransactionResult: TransactionResult
    DUNSNumber: str
    RiskScores: list[RiskScore]
    PredictiveIndicators: Optional[list[PredictiveIndicator]] = None


# ============================================================================
# Health Check Model
# ============================================================================

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    timestamp: str
    mock_mode: bool
    dnb_environment: str


# ============================================================================
# Error Response Model
# ============================================================================

class ErrorDetail(BaseModel):
    """Error detail"""
    error_code: Optional[str] = None
    message: str
    severity: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: ErrorDetail
    timestamp: str
