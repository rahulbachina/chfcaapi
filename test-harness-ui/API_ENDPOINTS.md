# API Endpoints Reference

This document lists the upstream API endpoints used by the KYC API services.

## Dun & Bradstreet Direct 2.0 API

**Base URL**: `https://direct.dnb.com`
**Authentication URL**: `https://direct.dnb.com/Authentication/V2.0/`

### Endpoints (REST)

| Feature | Method | Endpoint Path | Description |
|---------|--------|---------------|-------------|
| **Company Search** | `GET` | `/V5.0/organizations` | Search for companies by name and country |
| **Company Profile** | `GET` | `/V5.0/organizations/{duns}/products/{product_code}` | Retrieve detailed company profile (Product Code: `DCP_STD`) |
| **Financials** | `GET` | `/V5.0/organizations/{duns}/financials` | Retrieve financial statements |
| **Analytics** | `GET` | `/V5.0/organizations/{duns}/analytics` | Retrieve risk scores and predictive analytics |

---

## LexisNexis Bridger Insight XG

**Service Type**: SOAP Web Service
**WSDL URL**: `https://sandbox.lexisnexis.com/bridger/ScreeningService?wsdl`

### SOAP Actions

| Feature | SOAP Action | Description |
|---------|-------------|-------------|
| **Person Screening** | `RunSearch` | Screen an individual against Sanctions, PEP, and Adverse Media lists |
| **Entity Screening** | `RunEntitySearch` | Screen a business entity against Sanctions lists |
| **Batch Screening** | `BatchScreen` | Screen multiple individuals/entities in a single request |
| **Get Lists** | `GetAvailableLists` | Retrieve available screening lists configuration |

---

## Local API Wrappers

The local services act as proxies to these upstream endpoints:

- **D&B Wrapper**: `http://localhost:8000`
- **LexisNexis Wrapper**: `http://localhost:8001`
