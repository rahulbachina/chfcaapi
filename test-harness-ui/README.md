# KYC API Test Harness UI

A React Next.js application for testing D&B and LexisNexis API integrations, built to match the Vantage KYC Automation Test Harness design.

## Features

### ✨ D&B Integration
- Company search by name and country
- Detailed company profiles with:
  - Basic information (DUNS, status, employees, revenue)
  - Financial statements (balance sheet, income statement)
  - Risk analytics and predictive indicators
- Grid-based results display
- Interactive detail modals

### ✨ LexisNexis Integration
- Person screening against sanctions, PEP, and adverse media lists
- Entity screening for businesses
- Risk level indicators (HIGH/MEDIUM/LOW)
- Match categories (PEP, Sanctions, Adverse Media, etc.)
- Detailed match information with scores

### ✨ UI/UX
- Clean, professional design matching the provided mockup
- Sidebar navigation
- Tab-based interface with disabled states for live integrations
- Responsive grid layouts
- Loading states and error handling
- Color-coded risk indicators

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **UI Components**: Custom components with Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed (for backend APIs)
- Both D&B and LexisNexis backend APIs running

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_DNB_API_URL=http://localhost:8000
   NEXT_PUBLIC_LEXISNEXIS_API_URL=http://localhost:8001
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running Backend APIs

### D&B API (Port 8000)

```bash
cd "../D&B API"
python -m uvicorn app.main:app --reload --port 8000
```

API Documentation: http://localhost:8000/docs

### LexisNexis API (Port 8001)

```bash
cd "../LexisNexis API"
python -m uvicorn app.main:app --reload --port 8001
```

API Documentation: http://localhost:8001/docs

## Project Structure

```
test-harness-ui/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Main page with tab navigation
│   └── globals.css         # Global styles
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── TabNavigation.tsx   # Tab switcher
│   ├── CompanyCard.tsx     # Company result card
│   ├── SearchBar.tsx       # Search input component
│   ├── dnb/
│   │   ├── DNBTab.tsx      # D&B main interface
│   │   └── DNBDetailModal.tsx  # Company detail modal
│   └── lexisnexis/
│       ├── LexisNexisTab.tsx   # LexisNexis main interface
│       └── LexisNexisResults.tsx  # Screening results
├── lib/
│   └── api/
│       ├── dnb.ts          # D&B API client
│       └── lexisnexis.ts   # LexisNexis API client
├── types/
│   ├── dnb.ts              # D&B TypeScript types
│   └── lexisnexis.ts       # LexisNexis TypeScript types
└── .env.local              # Environment configuration
```

## Usage

### Testing D&B API

1. Navigate to the "Dun & Bradstreet" tab
2. Select a country from the dropdown
3. Enter a company name (e.g., "Barclays")
4. Click "Search Companies"
5. Click "View Details" on any result to see full profile

### Testing LexisNexis API

1. Navigate to the "LexisNexis" tab
2. Choose between "Person Screening" or "Entity Screening"
3. Fill in the required fields
4. Click "Screen Person" or "Screen Entity"
5. Review the results with risk indicators and match details

## Design Features

- **Primary Color**: Blue (#3B82F6)
- **Risk Indicators**: 
  - 🔴 RED for HIGH risk
  - 🟡 YELLOW for MEDIUM risk
  - 🟢 GREEN for LOW risk
- **Disabled Tabs**: Companies House and FCA Register (already live in production)
- **Responsive Design**: Works on desktop, tablet, and mobile

## API Configuration

Both backend APIs are configured to run in **mock mode** by default, which means:
- No real API credentials required
- Mock data is returned for all requests
- Safe for testing and development

To use real APIs, update the backend `.env` files with actual credentials.

## Building for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_DNB_API_URL` | D&B API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_LEXISNEXIS_API_URL` | LexisNexis API base URL | `http://localhost:8001` |

## License

This project is part of the Vantage KYC Automation Test Harness.

## Support

For issues or questions, please contact the development team.
