# KYC Vantage API Wrappers

A modern Python + React application providing unified API wrappers for UK regulatory, company, and compliance data sources.

## Overview

This project provides FastAPI-based wrapper APIs for four essential data sources:

1. **FCA (Financial Conduct Authority) Register API** - Query FCA-regulated firms and individuals
2. **Companies House API** - Search and retrieve UK company information
3. **Dun & Bradstreet (D&B)** - Company credit and financial data
4. **LexisNexis** - AML/KYC screening for persons and entities

## Project Structure

```
kyc-vantage-apis/
├── backend/                      # FCA & Companies House API server (Port 8000)
│   ├── main.py                  # API endpoints
│   ├── fca_client.py            # FCA API client
│   └── companies_house_client.py
├── D&B API/                      # Dun & Bradstreet API Wrapper (Port 8001)
├── LexisNexis API/               # LexisNexis API Wrapper (Port 8002)
├── frontend/                     # React UI (Vite)
│   └── src/
│       ├── App.tsx              # Main dashboard
│       ├── components/          # React components
│       ├── api/                 # Frontend API clients
│       └── types/               # TypeScript definitions
├── docs/                         # Detailed API Documentation
│   ├── fca.md
│   ├── companieshouse.md
│   ├── dnb.md
│   └── lexisnexis.md
└── test-harness-ui/              # Legacy testing UI
```

## Setup & Running

### 1. Main Backend (FCA & Companies House)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Server runs on: `http://localhost:8000`

### 2. D&B API Service
```bash
cd "D&B API"
# Install dependencies if required (check individual folder)
# Run the service (command depends on implementation, typically python or node)
```
Server runs on: `http://localhost:8001`

### 3. LexisNexis API Service
```bash
cd "LexisNexis API"
# Install dependencies if required
# Run the service
```
Server runs on: `http://localhost:8002`

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
UI runs on: `http://localhost:5173`

## API Configuration

### FCA & Companies House
See `backend/.env` configuration in the backend folder.

### D&B and LexisNexis
These services are currently configured to run locally on specific ports. Refer to their respective directories for detailed configuration.

## Documentation

Detailed documentation for each API endpoint is available in the `docs/` directory:

- [FCA API Docs](docs/fca.md)
- [Companies House API Docs](docs/companieshouse.md)
- [Dun & Bradstreet API Docs](docs/dnb.md)
- [LexisNexis API Docs](docs/lexisnexis.md)

## Features

- 🎨 Premium "Cyborg" UI with glassmorphism
- 🔍 Unified search across multiple providers
- 📊 Comprehensive data retrieval:
    - **FCA**: Permissions, Regulators, Individuals
    - **Companies House**: Officers, Filing History, PSC
    - **D&B**: Financials, Analytics, Risk Scores
    - **LexisNexis**: Screening matches, Risk Levels
- 🔐 Secure API key management
- ⚡ Fast async API calls
- 🌐 CORS-enabled for frontend integration

