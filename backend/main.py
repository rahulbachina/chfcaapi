from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fca_client import FcaClient
from companies_house_client import CompaniesHouseClient
import uvicorn

app = FastAPI(title="FCA Register API Wrapper")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fca_client = FcaClient()
ch_client = CompaniesHouseClient()

@app.get("/api/search")
async def search(q: str, type: str = "firm", per_page: int = 10):
    try:
        return await fca_client.search(q, type, per_page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}")
async def firm_details(frn: int):
    try:
        details = await fca_client.get_firm_details(frn)
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/individuals")
async def firm_individuals(frn: int):
    try:
        return await fca_client.get_firm_individuals(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/permissions")
async def firm_permissions(frn: int):
    try:
        return await fca_client.get_firm_permissions(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/address")
async def firm_address(frn: int):
    try:
        return await fca_client.get_firm_address(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/requirements")
async def firm_requirements(frn: int):
    try:
        return await fca_client.get_firm_requirements(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/regulators")
async def firm_regulators(frn: int):
    try:
        return await fca_client.get_firm_regulators(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/passports")
async def firm_passports(frn: int):
    try:
        return await fca_client.get_firm_passports(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/disciplinary")
async def firm_disciplinary(frn: int):
    try:
        return await fca_client.get_firm_disciplinary(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/waivers")
async def firm_waivers(frn: int):
    try:
        return await fca_client.get_firm_waivers(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/firm/{frn}/names")
async def firm_names(frn: int):
    try:
        return await fca_client.get_firm_names(frn)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Companies House Routes
@app.get("/api/companies/search")
async def search_companies(q: str, per_page: int = 10):
    try:
        data = await ch_client.search_companies(q, per_page)
        return data
    except Exception as e:
        print(f"Companies House Search Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/companies/{company_number}")
async def company_details(company_number: str):
    try:
        profile = await ch_client.get_company_profile(company_number)
        officers = await ch_client.get_company_officers(company_number)
        history = await ch_client.get_filing_history(company_number)
        psc = await ch_client.get_company_psc(company_number)
        return {
            "profile": profile,
            "officers": officers,
            "filing_history": history,
            "psc": psc
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
