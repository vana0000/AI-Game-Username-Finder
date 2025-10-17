from fastapi import APIRouter, HTTPException
from app.services.username_api import check_username_availability

router = APIRouter(prefix="/usernames", tags=["Usernames"])

@router.get("/check")
def check_username(username:str):
    return check_username_availability(username)

    if result.get("error"):
        raise HTTPException(status_code=502, detail=result["error"])
    return result