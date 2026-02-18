# LexisNexis API Documentation

This document provides details on the LexisNexis API wrapper service used in the KYC application. This service facilitates screening of persons and entities against global watchlists, sanctions, and PEP lists using LexisNexis Bridger Insight or similar backend systems.

**Base URL**: `http://localhost:8002`

## Authentication
The wrapper service manages authentication with the upstream LexisNexis provider. The frontend client does not need to provide specific credentials.

---

## Endpoints

### 1. Screen Person
Perform a screening check for an individual.

- **URL**: `/api/v1/screen/person`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body (`PersonScreenRequest`)**
```json
{
  "referenceId": "string",  // Unique client-generated ID
  "fullName": "string",     // Classification name
  "firstName": "string",    // Optional
  "lastName": "string",     // Optional
  "dob": "YYYY-MM-DD",      // Optional
  "nationality": "string",  // Optional ISO country code
  "country": "string",      // Optional residence country
  "address": {
    "street": "string",
    "city": "string",
    "country": "string"
  }
}
```

**Response Structure (`ScreeningResult`)**
```json
{
  "screeningId": "string",
  "referenceId": "string",
  "status": "COMPLETED|PENDING|FAILED",
  "matches": [
    {
      "matchId": "string",
      "score": number, // 0-100
      "name": "string",
      "riskLevel": "HIGH|MEDIUM|LOW",
      "categories": ["PEP", "SANCTIONS", ...],
      "source": {
        "listName": "string",
        "listType": "string"
      }
    }
  ],
  "highestRiskLevel": "HIGH|MEDIUM|LOW|UNKNOWN"
}
```

### 2. Screen Entity
Perform a screening check for a business or organization.

- **URL**: `/api/v1/screen/entity`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body (`EntityScreenRequest`)**
```json
{
  "referenceId": "string",
  "entityName": "string",
  "country": "string",
  "registrationNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "country": "string"
  }
}
```

**Response Structure (`ScreeningResult`)**
Same as Screen Person.

### 3. Batch Screen
Submit a batch of person and/or entity screening requests.

- **URL**: `/api/v1/screen/batch`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body (`BatchScreenRequest`)**
```json
{
  "persons": [ { ...PersonScreenRequest } ],
  "entities": [ { ...EntityScreenRequest } ]
}
```

**Response Structure (`BatchScreeningResult`)**
```json
{
  "batchId": "string",
  "totalScreened": number,
  "results": [ { ...ScreeningResult } ],
  "createdAt": "string"
}
```

---

## Enums and Types

### Risk Level
- `HIGH`
- `MEDIUM`
- `LOW`
- `UNKNOWN`

### Match Categories
- `PEP` (Politically Exposed Person)
- `SANCTIONS`
- `ADVERSE_MEDIA`
- `FINANCIAL_REGULATOR`
- `LAW_ENFORCEMENT`
- `OTHER`

For full TypeScript definitions, refer to `frontend/src/types/lexisnexis.ts`.
