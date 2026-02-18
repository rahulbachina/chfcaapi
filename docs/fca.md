# FCA API Documentation

This document provides details on the Financial Conduct Authority (FCA) API wrapper service used in the KYC application. This service aggregates data from the official FCA Register API to provide comprehensive insights into regulated firms.

**Base URL**: `http://localhost:8000`

## Endpoints

### 1. Search Register
Search for firms or individuals by name or reference number (FRN/IRN).

- **URL**: `/api/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q` (Required): The search query (name or reference number).

**Response Structure**
```json
{
  "Data": [
    {
      "URL": "string",
      "Status": "string",
      "Reference Number": "string",
      "Type of business or Individual": "Firm",
      "Name": "string"
    }
  ],
  "Message": "string" // Optional error message
}
```

### 2. Get Firm Details
Retrieve core details for a specific firm.

- **URL**: `/api/firm/{frn}`
- **Method**: `GET`
- **Path Parameters**:
  - `frn`: Firm Reference Number (6 or 7 digits).

**Response Structure**
```json
{
  "Data": [
    {
      "Organisation Name": "string",
      "Status": "string",
      "FRN": "string",
      "Business Type": "string",
      "Client Money Permission": "string",
      // ... additional detail fields
    }
  ]
}
```

### 3. Get Firm Attributes
The following endpoints retrieve specific attributes for a firm using its FRN. All use the `GET` method and return a standard response wrapper containing a `Data` array or object.

| Endpoint | Description |
| :--- | :--- |
| `/api/firm/{frn}/individuals` | List of approved persons and key individuals. |
| `/api/firm/{frn}/permissions` | List of regulated activities the firm is authorized to perform. |
| `/api/firm/{frn}/address` | Registered office and contact addresses. |
| `/api/firm/{frn}/requirements` | Specific restrictions or requirements placed on the firm. |
| `/api/firm/{frn}/regulators` | Details of regulators overseeing the firm. |
| `/api/firm/{frn}/passports` | Passporting rights for the EEA. |
| `/api/firm/{frn}/disciplinary` | Disciplinary history and regulatory actions. |
| `/api/firm/{frn}/waivers` | Waivers and exclusions from standard rules. |
| `/api/firm/{frn}/names` | Trading names and other aliases. |

**Common Response Wrapper**
```json
{
  "Data": [...] // Array of objects or object with keys
}
```

---

## Notes
- The API serves as a pass-through to the official FCA API, dealing with authentication and rate limiting.
- Data availability depends on the public information provided by the FCA.
