# LexisNexis Bridger XG FastAPI Service

A production-ready FastAPI service that wraps LexisNexis Bridger XG SOAP services and exposes clean REST endpoints for sanctions screening, PEP checks, and adverse media monitoring.

## 🎯 Key Features

- **SOAP-to-REST Translation**: Consumes SOAP services, exposes REST API
- **Vendor-Agnostic Design**: Easy to swap providers (only `providers/bridger_soap.py` is vendor-specific)
- **Mock Mode**: Full mock SOAP responses for development without credentials
- **Comprehensive Screening**: Person, entity, and batch screening
- **Risk Assessment**: Automatic risk level classification (HIGH/MEDIUM/LOW)
- **Multiple Lists**: OFAC, EU, UN sanctions, PEP, adverse media

## 📋 Prerequisites

- Python 3.11+
- LexisNexis Bridger XG WSDL URL and credentials (optional for mock mode)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials (or leave as mock mode)
```

### 3. Run the Service

```bash
# Run with Python
python -m app.main

# Or with uvicorn
uvicorn app.main:app --reload --port 8001
```

### 4. Access Documentation

Open your browser to:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
- **Health Check**: http://localhost:8001/health

## 📡 API Endpoints

### Screening Endpoints

#### Screen Person
```http
POST /api/v1/screen/person
Content-Type: application/json

{
  "referenceId": "CUST-12345",
  "fullName": "Vladimir Putin",
  "dob": "1952-10-07",
  "nationality": "RU",
  "country": "RU"
}
```

#### Screen Entity
```http
POST /api/v1/screen/entity
Content-Type: application/json

{
  "referenceId": "ENT-67890",
  "entityName": "Rosneft",
  "country": "RU",
  "registrationNumber": "123456789"
}
```

#### Batch Screening
```http
POST /api/v1/screen/batch
Content-Type: application/json

{
  "persons": [...],
  "entities": [...]
}
```

#### Get Screening Lists
```http
GET /api/v1/lists
```

### Monitoring Endpoints

#### Setup Monitoring
```http
POST /api/v1/monitoring/setup
Content-Type: application/json

{
  "referenceId": "CUST-12345",
  "subject": {...},
  "frequency": "daily"
}
```

## 🧪 Mock Mode

The service includes comprehensive mock data for testing without LexisNexis credentials.

### Mock Scenarios

**High-Risk Matches** (PEP + Sanctions):
- Names containing: "Putin", "Kim Jong"
- Returns: OFAC SDN + World-Check PEP matches

**Medium-Risk Matches** (Adverse Media):
- Names containing: "Fraud", "Criminal"
- Returns: Adverse media matches

**Sanctioned Entities**:
- Names containing: "Rosneft", "Gazprom", "Bank of"
- Returns: EU + OFAC sanctions matches

**Clean Results**:
- Any other names
- Returns: No matches

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BRIDGER_WSDL` | LexisNexis WSDL URL | sandbox URL |
| `BRIDGER_USERNAME` | API username | mock_user |
| `BRIDGER_PASSWORD` | API password | mock_password |
| `USE_MOCK_DATA` | Enable mock mode | true |
| `SOAP_TIMEOUT` | SOAP request timeout (seconds) | 30 |
| `PORT` | Server port | 8001 |

## 🏗️ Architecture

### SOAP-to-REST Flow

```
Client Request (REST JSON)
    ↓
FastAPI Endpoint (routes.py)
    ↓
Vendor-Agnostic Model (models.py)
    ↓
SOAP Provider (bridger_soap.py) ← ONLY vendor-specific file
    ↓
SOAP Request (XML)
    ↓
LexisNexis Bridger XG
    ↓
SOAP Response (XML)
    ↓
Normalization Layer
    ↓
REST JSON Response
```

### Vendor Isolation

- **99% vendor-agnostic**: Only `app/providers/bridger_soap.py` contains LexisNexis logic
- **Easy to swap**: Create `app/providers/other_vendor.py` to switch providers
- **Consistent API**: REST endpoints never change

## 🔌 Integrating Real WSDL

When you receive LexisNexis credentials:

### 1. Update `.env`

```env
BRIDGER_WSDL=https://your-actual-wsdl-url
BRIDGER_USERNAME=your_username
BRIDGER_PASSWORD=your_password
USE_MOCK_DATA=false
```

### 2. Update SOAP Method Names

Edit `app/providers/bridger_soap.py` and update method names based on your WSDL:

```python
# Common method name variations:
# - RunSearch
# - Search
# - Screening
# - SubmitSearch

response = self.client.service.YourActualMethodName(soap_request)
```

### 3. Test & Adjust

```bash
# Restart the service
python -m app.main

# Test with real data
curl -X POST http://localhost:8001/api/v1/screen/person \
  -H "Content-Type: application/json" \
  -d '{"referenceId": "TEST-001", "fullName": "Test Person"}'
```

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📊 Response Format

### Screening Result

```json
{
  "screeningId": "SCR-abc123",
  "referenceId": "CUST-12345",
  "status": "COMPLETED",
  "subject": {...},
  "matches": [
    {
      "matchId": "PEP-RU-001",
      "score": 95,
      "name": "Vladimir Putin",
      "categories": ["PEP", "SANCTIONS"],
      "riskLevel": "HIGH",
      "source": {
        "listName": "OFAC SDN List",
        "listType": "SANCTIONS",
        "country": "RU"
      },
      "description": "President of the Russian Federation..."
    }
  ],
  "matchCount": 1,
  "highestRiskLevel": "HIGH",
  "createdAt": "2024-03-15T10:30:00Z",
  "processingTime": 1.23
}
```

## 🔍 Troubleshooting

### SOAP Connection Issues

```python
# Check WSDL accessibility
curl https://your-wsdl-url

# Enable debug logging
LOG_LEVEL=DEBUG
```

### Authentication Errors

- Verify username/password in `.env`
- Check if credentials work with SOAP UI
- Ensure WSDL URL is correct

### Timeout Errors

```env
# Increase timeout
SOAP_TIMEOUT=60
```

## 🧩 Project Structure

```
LexisNexis API/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── models.py            # Vendor-agnostic models
│   ├── routes.py            # REST endpoints
│   ├── exceptions.py        # Custom exceptions
│   ├── utils.py             # Helper functions
│   ├── mock_data.py         # Mock SOAP responses
│   └── providers/
│       ├── __init__.py
│       └── bridger_soap.py  # LexisNexis SOAP client
├── requirements.txt
├── .env
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📝 License

Proprietary - Ardonagh Client

## 🤝 Support

For issues or questions, contact your development team.

---

**Note**: This service runs independently on port **8001** (D&B API runs on port 8000).
