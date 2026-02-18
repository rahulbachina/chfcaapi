"""Mock SOAP responses for LexisNexis Bridger XG"""

from app.utils import generate_screening_id, get_iso_timestamp
from typing import Dict, Any


def get_mock_person_screening_high_risk(full_name: str, reference_id: str) -> Dict[str, Any]:
    """Get mock SOAP response for high-risk person (PEP/Sanctions match)"""
    return {
        "ScreeningResponse": {
            "ScreeningId": generate_screening_id(),
            "ReferenceId": reference_id,
            "Status": "COMPLETED",
            "Matches": [
                {
                    "EntityId": "PEP-RU-001",
                    "Score": 95,
                    "Name": full_name,
                    "Aliases": ["Vladimir Vladimirovich Putin"],
                    "Categories": ["PEP", "SANCTIONS"],
                    "ListName": "OFAC SDN List",
                    "ListType": "SANCTIONS",
                    "Country": "RU",
                    "DOB": "1952-10-07",
                    "Nationality": "RU",
                    "Description": "President of the Russian Federation. Designated under Executive Order 14024.",
                    "LastUpdated": "2024-02-24"
                },
                {
                    "EntityId": "PEP-RU-002",
                    "Score": 93,
                    "Name": full_name,
                    "Aliases": [],
                    "Categories": ["PEP"],
                    "ListName": "World-Check PEP Database",
                    "ListType": "PEP",
                    "Country": "RU",
                    "DOB": "1952-10-07",
                    "Nationality": "RU",
                    "Description": "Head of State - Russia",
                    "LastUpdated": "2024-01-15"
                }
            ],
            "ProcessingTime": 1.23
        }
    }


def get_mock_person_screening_medium_risk(full_name: str, reference_id: str) -> Dict[str, Any]:
    """Get mock SOAP response for medium-risk person (Adverse Media)"""
    return {
        "ScreeningResponse": {
            "ScreeningId": generate_screening_id(),
            "ReferenceId": reference_id,
            "Status": "COMPLETED",
            "Matches": [
                {
                    "EntityId": "AM-001",
                    "Score": 72,
                    "Name": full_name,
                    "Aliases": [],
                    "Categories": ["ADVERSE_MEDIA"],
                    "ListName": "Adverse Media Database",
                    "ListType": "ADVERSE_MEDIA",
                    "Country": "US",
                    "DOB": None,
                    "Nationality": None,
                    "Description": "Involved in financial fraud investigation (2023)",
                    "LastUpdated": "2023-11-20"
                }
            ],
            "ProcessingTime": 0.89
        }
    }


def get_mock_person_screening_no_match(reference_id: str) -> Dict[str, Any]:
    """Get mock SOAP response for clean person (no matches)"""
    return {
        "ScreeningResponse": {
            "ScreeningId": generate_screening_id(),
            "ReferenceId": reference_id,
            "Status": "COMPLETED",
            "Matches": [],
            "ProcessingTime": 0.45
        }
    }


def get_mock_entity_screening_sanctions(entity_name: str, reference_id: str) -> Dict[str, Any]:
    """Get mock SOAP response for sanctioned entity"""
    return {
        "ScreeningResponse": {
            "ScreeningId": generate_screening_id(),
            "ReferenceId": reference_id,
            "Status": "COMPLETED",
            "Matches": [
                {
                    "EntityId": "ENT-SANC-001",
                    "Score": 98,
                    "Name": entity_name,
                    "Aliases": ["Rosneft Oil Company"],
                    "Categories": ["SANCTIONS"],
                    "ListName": "EU Sanctions List",
                    "ListType": "SANCTIONS",
                    "Country": "RU",
                    "DOB": None,
                    "Nationality": None,
                    "Description": "Russian state-owned oil company. Subject to EU sanctions.",
                    "LastUpdated": "2024-03-01"
                },
                {
                    "EntityId": "ENT-SANC-002",
                    "Score": 96,
                    "Name": entity_name,
                    "Aliases": [],
                    "Categories": ["SANCTIONS"],
                    "ListName": "OFAC SDN List",
                    "ListType": "SANCTIONS",
                    "Country": "RU",
                    "DOB": None,
                    "Nationality": None,
                    "Description": "Designated under sectoral sanctions",
                    "LastUpdated": "2024-02-15"
                }
            ],
            "ProcessingTime": 1.05
        }
    }


def get_mock_entity_screening_no_match(reference_id: str) -> Dict[str, Any]:
    """Get mock SOAP response for clean entity"""
    return {
        "ScreeningResponse": {
            "ScreeningId": generate_screening_id(),
            "ReferenceId": reference_id,
            "Status": "COMPLETED",
            "Matches": [],
            "ProcessingTime": 0.52
        }
    }


def get_mock_batch_screening() -> Dict[str, Any]:
    """Get mock SOAP response for batch screening"""
    return {
        "BatchScreeningResponse": {
            "BatchId": f"BATCH-{generate_screening_id()}",
            "TotalScreened": 3,
            "Results": [
                get_mock_person_screening_no_match("BATCH-001"),
                get_mock_person_screening_medium_risk("John Smith", "BATCH-002"),
                get_mock_entity_screening_no_match("BATCH-003")
            ]
        }
    }


def get_mock_monitoring_alert() -> Dict[str, Any]:
    """Get mock SOAP response for monitoring alert"""
    return {
        "MonitoringAlert": {
            "AlertId": f"ALERT-{generate_screening_id()}",
            "MonitoringId": "MON-12345",
            "ReferenceId": "CUST-67890",
            "AlertType": "NEW_MATCH",
            "NewMatches": [
                {
                    "EntityId": "NEW-SANC-001",
                    "Score": 88,
                    "Name": "Monitored Person",
                    "Aliases": [],
                    "Categories": ["SANCTIONS"],
                    "ListName": "UN Sanctions List",
                    "ListType": "SANCTIONS",
                    "Country": "KP",
                    "DOB": None,
                    "Nationality": "KP",
                    "Description": "Recently added to UN sanctions list",
                    "LastUpdated": get_iso_timestamp()
                }
            ],
            "AlertDate": get_iso_timestamp()
        }
    }


def get_mock_screening_lists() -> list:
    """Get mock list of available screening lists"""
    return [
        {
            "ListName": "OFAC SDN List",
            "ListType": "SANCTIONS",
            "Description": "US Office of Foreign Assets Control Specially Designated Nationals",
            "Country": "US",
            "LastUpdated": "2024-03-01"
        },
        {
            "ListName": "EU Sanctions List",
            "ListType": "SANCTIONS",
            "Description": "European Union Consolidated Sanctions List",
            "Country": "EU",
            "LastUpdated": "2024-02-28"
        },
        {
            "ListName": "UN Sanctions List",
            "ListType": "SANCTIONS",
            "Description": "United Nations Security Council Sanctions List",
            "Country": "UN",
            "LastUpdated": "2024-02-25"
        },
        {
            "ListName": "World-Check PEP Database",
            "ListType": "PEP",
            "Description": "Politically Exposed Persons Database",
            "Country": None,
            "LastUpdated": "2024-03-05"
        },
        {
            "ListName": "Adverse Media Database",
            "ListType": "ADVERSE_MEDIA",
            "Description": "Global adverse media screening",
            "Country": None,
            "LastUpdated": "2024-03-06"
        }
    ]
