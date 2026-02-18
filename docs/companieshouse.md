# Companies House API Documentation

This document provides details on the Companies House API wrapper service used in the KYC application. This service facilitates searching for and retrieving detailed company information from the official UK Companies House register.

**Base URL**: `http://localhost:8000`

## Endpoints

### 1. Search Companies
Search for UK companies by name or company number.

- **URL**: `/api/companies/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (Required): The search query (company name or registration number).

**Response Structure**
```json
{
  "items": [
    {
      "title": "string",
      "company_number": "string",
      "company_status": "active|dissolved|liquidation|closed",
      "company_type": "ltd|plc|llp|...",
      "address_snippet": "string",
      "date_of_creation": "YYYY-MM-DD",
      "description": "string",
      // ... additional search fields
    }
  ],
  "kind": "search#companies",
  "total_results": number
}
```

### 2. Get Company Details
Retrieve comprehensive details for a specific company, including profile, officers, and filing history.

- **URL**: `/api/companies/{companyNumber}`
- **Method**: `GET`
- **Path Parameters**:
  - `companyNumber`: The 8-digit company registration number.

**Response Structure**
```json
{
  "profile": {
    "company_name": "string",
    "company_number": "string",
    "company_status": "string",
    "type": "string",
    "registered_office_address": {
      "address_line_1": "string",
      "address_line_2": "string",
      "locality": "string",
      "postal_code": "string",
      "country": "string"
    },
    "sic_codes": ["string"],
    "date_of_creation": "YYYY-MM-DD"
    // ... additional profile fields
  },
  "officers": {
    "items": [
      {
        "name": "string",
        "officer_role": "director|secretary|...",
        "appointed_on": "YYYY-MM-DD",
        "nationality": "string",
        "occupation": "string",
        // ... additional officer fields
      }
    ]
  },
  "psc": {
    "items": [
      {
        "name": "string",
        "nature_of_control": ["string"],
        // ... additional PSC fields
      }
    ]
  },
  "filing_history": {
    "items": [
      {
        "date": "YYYY-MM-DD",
        "type": "string",
        "description": "string",
        "category": "string"
        // ... additional filing fields
      }
    ]
  }
}
```

---

## Notes
- This API aggregates multiple endpoints from the official Companies House API (profile, officers, persons with significant control, filing history) into a single response for the `/api/companies/{companyNumber}` endpoint.
- Authentication with Companies House is handled by the backend service.
