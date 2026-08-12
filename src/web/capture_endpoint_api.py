"""采集端点管理 API"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/capture", tags=["capture-endpoints"])

class CaptureEndpointModel(BaseModel):
    name: str
    host: str
    port: int = 5985
    username: str = "administrator"
    password: str = ""
    method: str = "winrm"

@router.get("/endpoints")
def list_endpoints():
    try:
        from ..parse_lite import parse_query
        r = parse_query("CaptureEndpoint", {})
        return {"endpoints": r.get("results", [])}
    except: return {"endpoints": []}

@router.post("/endpoints")
def create_endpoint(body: CaptureEndpointModel):
    from ..parse_lite import parse_create
    return parse_create("CaptureEndpoint", body.model_dump())

@router.delete("/endpoints/{oid}")
def delete_endpoint(oid: str):
    from ..parse_lite import parse_delete
    return parse_delete("CaptureEndpoint", oid)
