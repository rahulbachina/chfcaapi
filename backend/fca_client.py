import httpx
import os
from dotenv import load_dotenv

load_dotenv()

class FcaClient:
    BASE_URL = "https://register.fca.org.uk/services/V0.1"
    
    def __init__(self):
        self.email = os.getenv("FCA_EMAIL")
        self.key = os.getenv("FCA_KEY")
        self.headers = {
            "X-AUTH-EMAIL": self.email,
            "X-AUTH-KEY": self.key,
            "Content-Type": "application/json"
        }

    async def get(self, endpoint: str, params: dict = None):
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = f"{self.BASE_URL}/{endpoint}"
            response = await client.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()

    async def search(self, query: str, type: str = "firm", per_page: int = 10):
        # The Laravel package uses 'Search?q='+search+'&type='+type+'&per_page='+perPage
        return await self.get("Search", params={"q": query, "type": type, "per_page": per_page})

    async def get_firm_details(self, frn: int):
        return await self.get(f"Firm/{frn}")

    async def get_firm_individuals(self, frn: int):
        return await self.get(f"Firm/{frn}/Individuals")

    async def get_firm_permissions(self, frn: int):
        return await self.get(f"Firm/{frn}/Permissions")

    async def get_firm_address(self, frn: int):
        return await self.get(f"Firm/{frn}/Address")
    
    async def get_firm_requirements(self, frn: int):
        return await self.get(f"Firm/{frn}/Requirements")
    
    async def get_firm_regulators(self, frn: int):
        return await self.get(f"Firm/{frn}/Regulators")
    
    async def get_firm_passports(self, frn: int):
        return await self.get(f"Firm/{frn}/Passports")
    
    async def get_firm_disciplinary(self, frn: int):
        return await self.get(f"Firm/{frn}/DisciplinaryHistory")
    
    async def get_firm_waivers(self, frn: int):
        return await self.get(f"Firm/{frn}/Waivers")
    
    async def get_firm_names(self, frn: int):
        return await self.get(f"Firm/{frn}/Names")
    
    async def get_individual_details(self, irn: str):
        return await self.get(f"Individuals/{irn}")
