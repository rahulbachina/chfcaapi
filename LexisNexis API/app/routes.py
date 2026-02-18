"""REST API routes for sanctions screening"""

import logging
from fastapi import APIRouter, HTTPException, Query
from typing import List

from app.models import (
    PersonScreenRequest,
    EntityScreenRequest,
    BatchScreenRequest,
    ScreeningResult,
    BatchScreeningResult,
    MonitoringSetupRequest,
    MonitoringAlert,
    ScreeningListInfo
)
from app.providers.bridger_soap import bridger_client
from app.exceptions import LexisNexisAPIError
from app.utils import generate_screening_id, generate_monitoring_id, get_iso_timestamp

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/screen/person", response_model=ScreeningResult)
async def screen_person(request: PersonScreenRequest):
    """
    Screen an individual person against sanctions, PEP, and adverse media lists
    
    - **referenceId**: Your internal reference ID
    - **fullName**: Full name of the person
    - **dob**: Date of birth (optional, improves accuracy)
    - **nationality**: Nationality (optional)
    - **country**: Country of residence (optional)
    """
    try:
        logger.info(f"Person screening request: {request.referenceId}")
        
        # Convert request to dict for SOAP client
        payload = request.model_dump()
        
        # Call SOAP service
        soap_response = await bridger_client.screen_person(payload)
        
        # Normalize SOAP response to REST format
        result = bridger_client.normalize_person_response(soap_response, payload)
        
        return result
        
    except LexisNexisAPIError as e:
        logger.error(f"Screening error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Screening failed: {str(e)}")


@router.post("/screen/entity", response_model=ScreeningResult)
async def screen_entity(request: EntityScreenRequest):
    """
    Screen a business entity against sanctions and watchlists
    
    - **referenceId**: Your internal reference ID
    - **entityName**: Business entity name
    - **country**: Country of registration (optional)
    - **registrationNumber**: Business registration number (optional)
    """
    try:
        logger.info(f"Entity screening request: {request.referenceId}")
        
        payload = request.model_dump()
        
        # Call SOAP service
        soap_response = await bridger_client.screen_entity(payload)
        
        # Normalize response
        result = bridger_client.normalize_entity_response(soap_response, payload)
        
        return result
        
    except LexisNexisAPIError as e:
        logger.error(f"Screening error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Screening failed: {str(e)}")


@router.post("/screen/batch", response_model=BatchScreeningResult)
async def screen_batch(request: BatchScreenRequest):
    """
    Screen multiple persons and/or entities in a single batch
    
    - **persons**: List of persons to screen
    - **entities**: List of entities to screen
    """
    try:
        logger.info("Batch screening request")
        
        payload = request.model_dump()
        
        # Call SOAP batch service
        soap_response = await bridger_client.batch_screen(payload)
        
        # For mock mode, normalize the response
        batch_data = soap_response.get("BatchScreeningResponse", {})
        
        return {
            "batchId": batch_data.get("BatchId", f"BATCH-{generate_screening_id()}"),
            "totalScreened": batch_data.get("TotalScreened", 0),
            "results": [],  # Would normalize individual results here
            "createdAt": get_iso_timestamp()
        }
        
    except LexisNexisAPIError as e:
        logger.error(f"Batch screening error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch screening failed: {str(e)}")


@router.get("/screen/{screening_id}", response_model=ScreeningResult)
async def get_screening_result(screening_id: str):
    """
    Retrieve a previous screening result by ID
    
    - **screening_id**: The screening ID returned from a previous screening request
    """
    # In a real implementation, this would retrieve from database
    raise HTTPException(status_code=501, detail="Result retrieval not yet implemented")


@router.get("/lists", response_model=List[ScreeningListInfo])
async def get_screening_lists():
    """
    Get list of available screening lists (OFAC, EU, UN, PEP, etc.)
    """
    try:
        lists = await bridger_client.get_screening_lists()
        return lists
    except Exception as e:
        logger.error(f"Failed to get screening lists: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/monitoring/setup")
async def setup_monitoring(request: MonitoringSetupRequest):
    """
    Setup ongoing monitoring for a person or entity
    
    - **referenceId**: Your internal reference ID
    - **subject**: Person or entity to monitor
    - **frequency**: Monitoring frequency (daily, weekly, monthly)
    """
    try:
        monitoring_id = generate_monitoring_id()
        
        return {
            "monitoringId": monitoring_id,
            "referenceId": request.referenceId,
            "status": "ACTIVE",
            "frequency": request.frequency,
            "createdAt": get_iso_timestamp()
        }
        
    except Exception as e:
        logger.error(f"Monitoring setup failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/monitoring/alerts")
async def get_monitoring_alerts(
    monitoring_id: str = Query(..., description="Monitoring session ID")
):
    """
    Get monitoring alerts for a monitoring session
    
    - **monitoring_id**: The monitoring ID from setup_monitoring
    """
    # In real implementation, would retrieve from database
    raise HTTPException(status_code=501, detail="Alert retrieval not yet implemented")


@router.delete("/monitoring/{monitoring_id}")
async def stop_monitoring(monitoring_id: str):
    """
    Stop ongoing monitoring for a subject
    
    - **monitoring_id**: The monitoring ID to stop
    """
    return {
        "monitoringId": monitoring_id,
        "status": "STOPPED",
        "stoppedAt": get_iso_timestamp()
    }
