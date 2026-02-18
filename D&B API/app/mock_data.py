"""Mock data for D&B API responses"""

from datetime import datetime, timezone
from app.utils import generate_transaction_id, get_iso_timestamp


def get_mock_auth_response(success: bool = True) -> dict:
    """Get mock authentication response"""
    transaction_detail = {
        "ApplicationTransactionID": generate_transaction_id(),
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
    
    if success:
        return {
            "TransactionDetail": transaction_detail,
            "TransactionResult": {
                "ResultID": "CM000",
                "ResultText": "Success",
                "ResultMessage": {
                    "ResultDescription": "Success"
                }
            },
            "AuthenticationDetail": {
                "Token": "MOCK_TOKEN_" + generate_transaction_id()[:16]
            }
        }
    else:
        return {
            "TransactionDetail": transaction_detail,
            "TransactionResult": {
                "SeverityText": "Fatal",
                "ResultID": "SC001",
                "ResultText": "Your user credentials are invalid. Please contact your D&B Representative.",
                "ResultMessage": {
                    "ResultDescription": "Invalid user credentials."
                }
            }
        }


def get_mock_company_search_response(company_name: str) -> dict:
    """Get mock company search/match response"""
    transaction_detail = {
        "ApplicationTransactionID": "REST",
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
    
    # Default to Gorman Manufacturing if searching for it
    if "GORMAN" in company_name.upper():
        return {
            "MatchResponse": {
                "TransactionDetail": transaction_detail,
                "TransactionResult": {
                    "ResultID": "CM000",
                    "ResultText": "Success"
                },
                "MatchCandidate": [
                    {
                        "Organization": {
                            "DUNSNumber": "804735132",
                            "OrganizationName": {
                                "OrganizationPrimaryName": [
                                    {"OrganizationName": "GORMAN MANUFACTURING COMPANY, INC."}
                                ]
                            },
                            "PrimaryAddress": {
                                "StreetAddressLine": [
                                    {"LineText": "492 KOLLER ST"}
                                ],
                                "PrimaryTownName": "SAN FRANCISCO",
                                "CountryISOAlpha2Code": "US",
                                "PostalCode": "94110",
                                "TerritoryAbbreviatedName": "CA"
                            },
                            "MatchQualityInformation": {
                                "ConfidenceCode": 10,
                                "MatchGradeText": "A"
                            }
                        },
                        "MatchGrade": "A",
                        "ConfidenceCode": 10
                    }
                ]
            }
        }
    
    # Generic company response
    return {
        "MatchResponse": {
            "TransactionDetail": transaction_detail,
            "TransactionResult": {
                "ResultID": "CM000",
                "ResultText": "Success"
            },
            "MatchCandidate": [
                {
                    "Organization": {
                        "DUNSNumber": "123456789",
                        "OrganizationName": {
                            "OrganizationPrimaryName": [
                                {"OrganizationName": company_name.upper()}
                            ]
                        },
                        "PrimaryAddress": {
                            "StreetAddressLine": [
                                {"LineText": "123 MAIN ST"}
                            ],
                            "PrimaryTownName": "NEW YORK",
                            "CountryISOAlpha2Code": "US",
                            "PostalCode": "10001",
                            "TerritoryAbbreviatedName": "NY"
                        },
                        "MatchQualityInformation": {
                            "ConfidenceCode": 8,
                            "MatchGradeText": "B"
                        }
                    },
                    "MatchGrade": "B",
                    "ConfidenceCode": 8
                }
            ]
        }
    }


def get_mock_company_profile(duns: str) -> dict:
    """Get mock company profile response"""
    transaction_detail = {
        "ApplicationTransactionID": "REST",
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
    
    # Gorman Manufacturing profile
    if duns == "804735132":
        return {
            "OrderProductResponse": {
                "TransactionDetail": transaction_detail,
                "TransactionResult": {
                    "ResultID": "CM000",
                    "ResultText": "Success"
                },
                "OrderProductResponseDetail": {
                    "InquiryDetail": {
                        "DUNSNumber": "804735132"
                    },
                    "Product": {
                        "Organization": {
                            "DUNSNumber": "804735132",
                            "OrganizationName": {
                                "OrganizationPrimaryName": [
                                    {"OrganizationName": "GORMAN MANUFACTURING COMPANY, INC."}
                                ]
                            },
                            "PrimaryAddress": {
                                "StreetAddressLine": [
                                    {"LineText": "492 KOLLER ST"}
                                ],
                                "PrimaryTownName": "SAN FRANCISCO",
                                "CountryISOAlpha2Code": "US",
                                "PostalCode": "94110",
                                "TerritoryAbbreviatedName": "CA"
                            },
                            "Telecommunication": [
                                {
                                    "TelecommunicationNumber": "4155551234",
                                    "TelecommunicationNumberType": "Telephone"
                                }
                            ],
                            "EmployeeQuantity": 250,
                            "SalesRevenueAmount": 45000000.00,
                            "BusinessDescription": "Manufacturer of precision metal components and assemblies for aerospace and defense industries.",
                            "OperatingStatusText": "Active",
                            "StartDate": "1985-03-15",
                            "StockExchangeDetails": {
                                "StockExchangeName": "NASDAQ",
                                "StockTickerSymbol": "GORM"
                            },
                            "FinancialStatement": [
                                {
                                    "StatementDate": "2023-12-31",
                                    "Currency": "USD",
                                    "Revenue": 45000000.00,
                                    "NetIncome": 3500000.00,
                                    "TotalAssets": 28000000.00
                                }
                            ]
                        }
                    }
                }
            }
        }
    
    # Generic company profile
    return {
        "OrderProductResponse": {
            "TransactionDetail": transaction_detail,
            "TransactionResult": {
                "ResultID": "CM000",
                "ResultText": "Success"
            },
            "OrderProductResponseDetail": {
                "InquiryDetail": {
                    "DUNSNumber": duns
                },
                "Product": {
                    "Organization": {
                        "DUNSNumber": duns,
                        "OrganizationName": {
                            "OrganizationPrimaryName": [
                                {"OrganizationName": "SAMPLE COMPANY INC."}
                            ]
                        },
                        "PrimaryAddress": {
                            "StreetAddressLine": [
                                {"LineText": "100 BUSINESS PARK DR"}
                            ],
                            "PrimaryTownName": "CHICAGO",
                            "CountryISOAlpha2Code": "US",
                            "PostalCode": "60601",
                            "TerritoryAbbreviatedName": "IL"
                        },
                        "Telecommunication": [
                            {
                                "TelecommunicationNumber": "3125551234",
                                "TelecommunicationNumberType": "Telephone"
                            }
                        ],
                        "EmployeeQuantity": 150,
                        "SalesRevenueAmount": 25000000.00,
                        "BusinessDescription": "Provider of business services and solutions.",
                        "OperatingStatusText": "Active",
                        "StartDate": "2000-01-01"
                    }
                }
            }
        }
    }


def get_mock_financial_statements(duns: str) -> dict:
    """Get mock financial statements response"""
    transaction_detail = {
        "ApplicationTransactionID": "REST",
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
    
    return {
        "TransactionDetail": transaction_detail,
        "TransactionResult": {
            "ResultID": "CM000",
            "ResultText": "Success"
        },
        "DUNSNumber": duns,
        "FinancialStatements": [
            {
                "StatementDate": "2023-12-31",
                "Currency": "USD",
                "FiscalYear": 2023,
                "BalanceSheet": {
                    "TotalAssets": 28000000.00,
                    "TotalLiabilities": 12000000.00,
                    "NetWorth": 16000000.00,
                    "CurrentAssets": 15000000.00,
                    "CurrentLiabilities": 5000000.00
                },
                "IncomeStatement": {
                    "Revenue": 45000000.00,
                    "GrossProfit": 18000000.00,
                    "OperatingIncome": 5500000.00,
                    "NetIncome": 3500000.00,
                    "EBITDA": 7200000.00
                }
            },
            {
                "StatementDate": "2022-12-31",
                "Currency": "USD",
                "FiscalYear": 2022,
                "BalanceSheet": {
                    "TotalAssets": 25000000.00,
                    "TotalLiabilities": 11000000.00,
                    "NetWorth": 14000000.00,
                    "CurrentAssets": 13000000.00,
                    "CurrentLiabilities": 4500000.00
                },
                "IncomeStatement": {
                    "Revenue": 42000000.00,
                    "GrossProfit": 16800000.00,
                    "OperatingIncome": 5000000.00,
                    "NetIncome": 3200000.00,
                    "EBITDA": 6500000.00
                }
            }
        ]
    }


def get_mock_analytics(duns: str) -> dict:
    """Get mock analytics/risk scores response"""
    transaction_detail = {
        "ApplicationTransactionID": "REST",
        "ServiceTransactionID": generate_transaction_id(),
        "TransactionTimestamp": get_iso_timestamp()
    }
    
    return {
        "TransactionDetail": transaction_detail,
        "TransactionResult": {
            "ResultID": "CM000",
            "ResultText": "Success"
        },
        "DUNSNumber": duns,
        "RiskScores": [
            {
                "ScoreType": "Commercial Credit Score",
                "ScoreValue": 75,
                "ScoreDate": get_iso_timestamp(),
                "RiskLevel": "Low-Medium",
                "ScoreDescription": "Score ranges from 1-100, with higher scores indicating lower risk"
            },
            {
                "ScoreType": "Financial Stress Score",
                "ScoreValue": 1250,
                "ScoreDate": get_iso_timestamp(),
                "RiskLevel": "Low",
                "ScoreDescription": "Score ranges from 1001-1875, with higher scores indicating lower financial stress"
            },
            {
                "ScoreType": "Delinquency Score",
                "ScoreValue": 85,
                "ScoreDate": get_iso_timestamp(),
                "RiskLevel": "Low",
                "ScoreDescription": "Probability of severe delinquency in next 12 months"
            }
        ],
        "PredictiveIndicators": [
            {
                "IndicatorType": "Payment Trend",
                "IndicatorValue": "Stable",
                "IndicatorDescription": "Payment behavior has been consistent over the past 12 months"
            },
            {
                "IndicatorType": "Industry Risk",
                "IndicatorValue": "Medium",
                "IndicatorDescription": "Industry shows moderate volatility"
            },
            {
                "IndicatorType": "Growth Indicator",
                "IndicatorValue": 7.5,
                "IndicatorDescription": "Year-over-year revenue growth percentage"
            }
        ]
    }
