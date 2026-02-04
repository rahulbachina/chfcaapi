# FCA Register Tool - Python Port

A modern Python + React application for querying the Financial Conduct Authority (FCA) Register.

## Project Structure

```
FCA tool/
├── backend/          # FastAPI server
│   ├── main.py      # API endpoints
│   ├── fca_client.py # FCA API client
│   └── .env         # API credentials
└── frontend/        # React UI (Vite)
    └── src/
        ├── App.tsx  # Main dashboard
        └── index.css # Design system
```

## Setup & Running

### Backend
```bash
cd backend
pip install fastapi uvicorn httpx python-dotenv
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

## FCA API Credentials

The FCA Register API requires:
1. **Registration**: Sign up at https://register.fca.org.uk/Developer/s/
2. **API Key Activation**: Contact RegisterAPISupport@fca.org.uk to activate your API key
3. **Environment Variables**: Add to `backend/.env`:
   ```
   FCA_EMAIL="your@email.com"
   FCA_KEY="your_api_key"
   ```

### Current Status
⚠️ The API key provided returns `404 Not Found` for all endpoints. This typically means:
- The API key needs activation by FCA support
- The account is pending approval
- The API endpoints may have changed

**Next Steps**: Contact RegisterAPISupport@fca.org.uk with your API credentials to request activation.

## Features

- 🎨 Premium "Cyborg" UI with glassmorphism
- 🔍 Real-time search for firms and individuals
- 📊 Detailed firm information (permissions, addresses, individuals)
- 🎭 Mock data fallback for demonstration
- ⚡ Fast async API calls with httpx
