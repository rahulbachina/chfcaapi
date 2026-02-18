import httpx
import os
import base64
from dotenv import load_dotenv

load_dotenv()

class CompaniesHouseClient:
    # Production endpoint for Live applications
    BASE_URL = "https://api.company-information.service.gov.uk"
    
    def __init__(self):
        self.api_key = os.getenv("COMPANIES_HOUSE_API_KEY")

    async def get(self, endpoint: str, params: dict = None):
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{self.BASE_URL}/{endpoint.lstrip('/')}"
            # Companies House uses Basic Auth with the API key as the username and no password.
            auth = (self.api_key, "") if self.api_key else None
            response = await client.get(url, auth=auth, params=params)
            response.raise_for_status()
            return response.json()

    async def search_companies(self, query: str, items_per_page: int = 10):
        return await self.get("search/companies", params={"q": query, "items_per_page": items_per_page})

    async def get_company_profile(self, company_number: str):
        return await self.get(f"company/{company_number}")

    async def get_company_officers(self, company_number: str):
        return await self.get(f"company/{company_number}/officers")

    async def get_filing_history(self, company_number: str):
        return await self.get(f"company/{company_number}/filing-history")

    async def get_company_psc(self, company_number: str):
        return await self.get(f"company/{company_number}/persons-with-significant-control")

    async def get_document(self, document_id: str):
        """
        Fetches a document (PDF) from the Companies House Document API.
        This involves a 2-step process:
        1. Request the document metadata to get the download URL.
        2. Follow the redirect/fetch the actual content from the download URL.
        """
        # Document API Base URL
        DOC_API_URL = "https://document-api.company-information.service.gov.uk"
        
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
             # Basic Auth
            auth = (self.api_key, "") if self.api_key else None
            
            # Step 1: Get metadata which contains the download link
            metadata_url = f"{DOC_API_URL}/document/{document_id}/content"
            
            # The Accept: application/pdf header tells the API to return the binary PDF
            response = await client.get(
                metadata_url,
                auth=auth,
                headers={"Accept": "application/pdf"}
            )
            
            # Use raise_for_status to catch 404s/403s
            response.raise_for_status()
            
            return response.content
