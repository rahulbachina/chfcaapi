# Dun & Bradstreet (D&B) API Documentation

This document provides details on the D&B API wrapper service used in the KYC application. This service acts as a proxy/wrapper around the official Dun & Bradstreet API, simplifying the integration for company search and data enrichment.

**Base URL**: `http://localhost:8001`

## Authentication
Currently, the wrapper service handles authentication internally. No specific headers are required from the frontend client other than standard content-type headers.

---

## Endpoints

### 1. Search Companies
Search for companies using criteria such as name, country, and match type.

- **URL**: `/api/v1/companies/search`
- **Method**: `GET`
- **Query Parameters**:
  - `subject_name` (Required): The name of the company to search for.
  - `country_iso_code` (Optional): ISO 2-character country code (e.g., "GB", "US").
  - `territory_name` (Optional): Name of the territory/state.
  - `match_type` (Optional): The matching algorithm to use. Default is "Advanced".

**Response Structure (`DNBMatchResponse`)**
```json
{
  "TransactionDetail": { ... },
  "TransactionResult": { ... },
  "MatchCandidate": [
    {
      "Organization": {
        "DUNSNumber": "string",
        "OrganizationName": {
          "OrganizationPrimaryName": [{ "OrganizationName": "string" }]
        },
        "PrimaryAddress": {
          "StreetAddressLine": [{ "LineText": "string" }],
          "PrimaryTownName": "string",
          "CountryISOAlpha2Code": "string",
          "PostalCode": "string"
        }
      },
      "MatchGrade": "string",
      "ConfidenceCode": number
    }
  ]
}
```

### 2. Get Company Profile
Retrieve the standard company profile for a specific DUNS number.

- **URL**: `/api/v1/companies/{duns}/profile`
- **Method**: `GET`
- **Path Parameters**:
  - `duns`: The 9-digit DUNS number of the company.
- **Query Parameters**:
  - `product_code` (Optional): The product code for the profile. Default is "DCP_STD".

**Response Structure (`DNBCompanyProfileResponse`)**
```json
{
  "TransactionDetail": { ... },
  "TransactionResult": { ... },
  "Organization": {
    "DUNSNumber": "string",
    "OrganizationName": { ... },
    "PrimaryAddress": { ... },
    "BusinessDescription": "string",
    "EmployeeQuantity": number,
    "SalesRevenueAmount": number
    // ... additional profile fields
  }
}
```

### 3. Get Financial Statements
Retrieve financial statements (balance sheet, income statement) for a company.

- **URL**: `/api/v1/companies/{duns}/financials`
- **Method**: `GET`
- **Path Parameters**:
  - `duns`: The 9-digit DUNS number.

**Response Structure (`DNBFinancialStatementsResponse`)**
```json
{
  "DUNSNumber": "string",
  "FinancialStatements": [
    {
      "StatementDate": "string",
      "Currency": "string",
      "BalanceSheet": {
        "TotalAssets": number,
        "TotalLiabilities": number,
        "NetWorth": number
      },
      "IncomeStatement": {
        "Revenue": number,
        "NetIncome": number
      }
    }
  ]
}
```

### 4. Get Analytics
Retrieve analytics data such as risk scores and predictive indicators.

- **URL**: `/api/v1/companies/{duns}/analytics`
- **Method**: `GET`
- **Path Parameters**:
  - `duns`: The 9-digit DUNS number.

**Response Structure (`DNBAnalyticsResponse`)**
```json
{
  "DUNSNumber": "string",
  "RiskScores": [
    {
      "ScoreType": "string",
      "ScoreValue": number,
      "RiskLevel": "string",
      "ScoreDescription": "string"
    }
  ],
  "PredictiveIndicators": [
    {
      "IndicatorType": "string",
      "IndicatorValue": "string|number"
    }
  ]
}
```

---

## Types Reference
For full TypeScript definitions, refer to `frontend/src/types/dnb.ts`.
