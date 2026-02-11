# KYC Vantage API Wrappers

A modern Python + React application providing unified API wrappers for UK regulatory and company data sources.

## Overview

This project provides FastAPI-based wrapper APIs for two essential UK data sources:

1. **FCA (Financial Conduct Authority) Register API** - Query FCA-regulated firms and individuals
2. **Companies House API** - Search and retrieve UK company information

## Project Structure

```
kyc-vantage-apis/
├── backend/                      # FastAPI server
│   ├── main.py                  # API endpoints
│   ├── fca_client.py            # FCA API client
│   ├── companies_house_client.py # Companies House API client
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # API credentials (not in repo)
├── frontend/                     # React UI (Vite)
│   └── src/
│       ├── App.tsx              # Main dashboard
│       └── index.css            # Design system
└── CH Swagger json/             # Companies House API specification
    └── swagger.json
```

## Setup & Running

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Server runs on: `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
UI runs on: `http://localhost:5173`

## API Configuration

### FCA Register API Credentials

The FCA Register API requires:
1. **Registration**: Sign up at https://register.fca.org.uk/Developer/s/
2. **API Key Activation**: Contact RegisterAPISupport@fca.org.uk to activate your API key
3. **Environment Variables**: Add to `backend/.env`:
   ```
   FCA_EMAIL="your@email.com"
   FCA_KEY="your_api_key"
   ```

#### Current FCA Status
⚠️ The API key provided returns `404 Not Found` for all endpoints. This typically means:
- The API key needs activation by FCA support
- The account is pending approval
- The API endpoints may have changed

**Next Steps**: Contact RegisterAPISupport@fca.org.uk with your API credentials to request activation.

### Companies House API Credentials

The Companies House API requires:
1. **Registration**: Create an account at https://developer.company-information.service.gov.uk/
2. **API Key**: Generate an API key from your developer account
3. **Environment Variables**: Add to `backend/.env`:
   ```
   COMPANIES_HOUSE_API_KEY="your_api_key"
   ```

**Authentication**: Companies House uses HTTP Basic Authentication with the API key as the username and empty password.

## API Endpoints

### FCA Register Endpoints

**Base URL**: `http://localhost:8000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Search for firms and individuals |
| `/firm/{frn}` | GET | Get firm details by FRN |
| `/firm/{frn}/individuals` | GET | Get firm's associated individuals |
| `/firm/{frn}/permissions` | GET | Get firm's regulatory permissions |
| `/firm/{frn}/address` | GET | Get firm's addresses |
| `/firm/{frn}/requirements` | GET | Get firm's regulatory requirements |
| `/firm/{frn}/regulators` | GET | Get firm's regulators |
| `/firm/{frn}/passports` | GET | Get firm's passporting information |
| `/firm/{frn}/disciplinary` | GET | Get firm's disciplinary history |
| `/firm/{frn}/waivers` | GET | Get firm's regulatory waivers |
| `/firm/{frn}/names` | GET | Get firm's trading names |

**Query Parameters for `/search`**:
- `q` (required): Search query
- `type` (optional): Type of search ("firm" or "individual", default: "firm")
- `per_page` (optional): Results per page (default: 10)

### Companies House Endpoints

**Base URL**: `http://localhost:8000/api/companies`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Search for UK companies |
| `/{company_number}` | GET | Get comprehensive company details |

**Query Parameters for `/search`**:
- `q` (required): Company search query
- `per_page` (optional): Results per page (default: 10)

**Company Details Response** includes:
- Company profile (name, status, type, jurisdiction, addresses)
- Officers (directors, secretaries)
- Filing history
- Persons with Significant Control (PSC)

## Features

- 🎨 Premium "Cyborg" UI with glassmorphism
- 🔍 Real-time search for firms, individuals, and companies
- 📊 Comprehensive data retrieval from both FCA and Companies House
- 🔐 Secure API key management via environment variables
- ⚡ Fast async API calls with httpx
- 🎭 Mock data fallback for demonstration (FCA only)
- 🌐 CORS-enabled for frontend integration
