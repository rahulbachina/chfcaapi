# D&B Direct 2.0 FastAPI Service

A production-ready FastAPI wrapper for the Dun & Bradstreet (D&B) Direct 2.0 REST API. This service provides clean, well-documented endpoints for accessing D&B company data, with built-in authentication token management, error handling, and mock data support for development and testing.

## Features

- ✅ **Complete API Coverage**: Company search, detailed profiles, financial statements, and analytics
- ✅ **Smart Token Management**: Automatic 24-hour token refresh with thread-safe caching
- ✅ **Mock Data Mode**: Realistic mock responses based on official D&B documentation
- ✅ **Interactive Documentation**: Auto-generated Swagger UI and ReDoc
- ✅ **Production Ready**: Docker support, health checks, CORS, and comprehensive error handling
- ✅ **Type Safe**: Full Pydantic validation for requests and responses

## Quick Start

### Prerequisites

- Python 3.11+
- D&B Direct 2.0 credentials (or use mock mode for testing)

### Installation

1. **Clone or navigate to the project directory**

```bash
cd "c:\Users\rahul\Desktop\Ardonagh Client\D&B API"
```

2. **Create a virtual environment**

```bash
python -m venv venv
```

3. **Activate the virtual environment**

```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies**

```bash
pip install -r requirements.txt
```

5. **Configure environment variables**

```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your settings (or keep USE_MOCK_DATA=true for testing)
```

6. **Run the application**

```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, access the interactive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
```http
GET /health
```

Returns service status and configuration.

### Company Search
```http
GET /api/v1/companies/search?subject_name=GORMAN%20MANUFACTURING&country_iso_code=US&territory_name=CA
```

Search for companies and retrieve D-U-N-S numbers.

**Parameters:**
- `subject_name` (required): Company name to search for
- `country_iso_code` (optional, default: US): ISO Alpha-2 country code
- `territory_name` (optional): State/territory code
- `match_type` (optional, default: Advanced): Match type (Basic or Advanced)

### Company Profile
```http
GET /api/v1/companies/{duns}/profile?product_code=DCP_STD
```

Get detailed company profile.

**Parameters:**
- `duns` (required): D-U-N-S number
- `product_code` (optional, default: DCP_STD): Product code (DCP_STD, DCP_PREM)

**Test D-U-N-S**: 804735132 (Gorman Manufacturing Company, Inc.)

### Financial Statements
```http
GET /api/v1/companies/{duns}/financials
```

Retrieve detailed financial statements including balance sheet and income statement.

### Analytics
```http
GET /api/v1/companies/{duns}/analytics
```

Get predictive analytics and risk scores for a company.

## Usage Examples

### Python (httpx)

```python
import httpx

base_url = "http://localhost:8000"

# Search for a company
response = httpx.get(
    f"{base_url}/api/v1/companies/search",
    params={
        "subject_name": "GORMAN MANUFACTURING",
        "country_iso_code": "US",
        "territory_name": "CA"
    }
)
print(response.json())

# Get company profile
duns = "804735132"
response = httpx.get(f"{base_url}/api/v1/companies/{duns}/profile")
print(response.json())

# Get financial statements
response = httpx.get(f"{base_url}/api/v1/companies/{duns}/financials")
print(response.json())

# Get analytics
response = httpx.get(f"{base_url}/api/v1/companies/{duns}/analytics")
print(response.json())
```

### cURL

```bash
# Search for a company
curl "http://localhost:8000/api/v1/companies/search?subject_name=GORMAN%20MANUFACTURING&country_iso_code=US&territory_name=CA"

# Get company profile
curl "http://localhost:8000/api/v1/companies/804735132/profile"

# Get financial statements
curl "http://localhost:8000/api/v1/companies/804735132/financials"

# Get analytics
curl "http://localhost:8000/api/v1/companies/804735132/analytics"
```

## Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

### Key Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `USE_MOCK_DATA` | Enable mock data mode | `true` |
| `DNB_USERNAME` | D&B API username | `mock_user` |
| `DNB_PASSWORD` | D&B API password | `mock_password` |
| `DNB_ENVIRONMENT` | Environment (sandbox/production) | `sandbox` |
| `PORT` | Server port | `8000` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Mock Data Mode

The service includes realistic mock data based on D&B's official documentation. This allows you to:

- Test and develop without D&B credentials
- Demonstrate the API to stakeholders
- Build integrations before production access

To enable mock mode (default):
```bash
USE_MOCK_DATA=true
```

To use real D&B API:
```bash
USE_MOCK_DATA=false
DNB_USERNAME=your_actual_username
DNB_PASSWORD=your_actual_password
```

## Docker Deployment

### Build and run with Docker Compose

```bash
docker-compose up -d
```

The API will be available at `http://localhost:8000`

### Build Docker image manually

```bash
docker build -t dnb-api .
docker run -p 8000:8000 -e USE_MOCK_DATA=true dnb-api
```

## Project Structure

```
D&B API/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication & token management
│   ├── dnb_client.py        # D&B API client
│   ├── models.py            # Pydantic models
│   ├── config.py            # Configuration management
│   ├── utils.py             # Helper functions
│   ├── exceptions.py        # Custom exceptions
│   └── mock_data.py         # Mock data responses
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error responses:

```json
{
  "error": {
    "error_code": "SC001",
    "message": "Authentication failed",
    "severity": "Fatal"
  },
  "timestamp": "2026-02-16T08:30:00Z"
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `SC001` | Authentication failed or token expired | 401 |
| `NF001` | Resource not found | 404 |
| `RL001` | Rate limit exceeded | 429 |
| `SU001` | Service unavailable | 503 |

## Authentication

The service automatically manages D&B authentication tokens:

1. **Token Acquisition**: Automatically obtains token on first request
2. **Token Caching**: Stores token for 24-hour validity period
3. **Auto Refresh**: Refreshes token before expiration
4. **Error Recovery**: Handles token expiration and re-authentication

You don't need to manage tokens manually - the service handles everything!

## Development

### Running in development mode

```bash
python -m app.main
```

The server will run with auto-reload enabled.

### Testing with Swagger UI

1. Navigate to http://localhost:8000/docs
2. Try the `/health` endpoint first
3. Test company search with "GORMAN MANUFACTURING"
4. Use D-U-N-S 804735132 for profile/financials/analytics

## Production Considerations

When deploying to production:

1. **Set `USE_MOCK_DATA=false`** and provide real credentials
2. **Configure CORS** appropriately (not `*`)
3. **Set `DEBUG=false`**
4. **Use environment-specific secrets management**
5. **Monitor rate limits** (QPS enforcement)
6. **Implement logging aggregation**
7. **Set up health check monitoring**

## Troubleshooting

### Account Locked (SC001)

After 3 failed authentication attempts, your D&B account will lock. Contact D&B support to unlock.

### Rate Limit Exceeded (RL001)

D&B enforces Queries Per Second (QPS) limits. Reduce request frequency or contact D&B to increase your limit.

### Token Expired

The service automatically refreshes tokens. If you see this error, check your credentials and network connectivity.

## Support

For D&B API issues:
- D&B Documentation: https://docs.dnb.com/direct/2.0/en-US
- D&B Support: Contact your D&B representative

For this service:
- Check the logs for detailed error information
- Review the Swagger documentation at `/docs`
- Ensure environment variables are correctly configured

## License

This is a wrapper service for the D&B Direct 2.0 API. You must have a valid D&B Direct subscription to use the production API.

---

**Built with FastAPI** | **Powered by D&B Direct 2.0**
