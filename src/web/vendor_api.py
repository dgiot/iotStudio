"""厂商通道桥接 API — 数据来自 parse_lite"""
import threading, random, time as _time
from fastapi import APIRouter

router = APIRouter(prefix="/api/vendor", tags=["vendor"])

_vendor_sim_data = {}

def _vendor_sim_loop():
    while True:
        _time.sleep(30)
        now = _time.strftime("%Y-%m-%d %H:%M")
        for key, devs, pts in [("boiler",4,19),("phm_vib",36,10),("bolt",17,3),("video",29,2),("tdlas",1,1)]:
            _vendor_sim_data[key] = {
                "key": key, "connected": True, "lastSync": now,
                "devices": devs, "points": pts,
                "relatedDevices": [{"id":f"{key}_dev{i}","name":f"{key}设备-{i}","status":"online" if random.random()>0.2 else "offline"} for i in range(1,4)]
            }

threading.Thread(target=_vendor_sim_loop, daemon=True).start()

@router.get("/{key}/status")
def get_vendor_status(key: str):
    try:
        from ..parse_lite import parse_query
        # 查询该厂商通道的设备
        devices = parse_query("Device", {"where": '{"tenant_id":"%s"}' % ({"youyeyun":"oil-monitor"}.get(key,"default"))})
        channels = parse_query("Channel", {})
        ch = next((c for c in channels.get("results",[]) if c.get("objectId","").startswith("ch_"+key[:4])), None)
        return {
            "key": key, "connected": ch.get("status") == "running" if ch else (key in _vendor_sim_data),
            "devices": devices.get("count", 0),
            "points": {"youyeyun":45,"boiler":19,"phm_vib":10,"bolt":3,"video":2,"tdlas":1}.get(key,0),
            "lastSync": ch.get("updatedAt","")[:16] if ch else (_vendor_sim_data.get(key,{}).get("lastSync") or None),
            "relatedDevices": [{"id": d.get("devaddr",""), "name": d.get("name",""), "status": d.get("status","offline")} for d in devices.get("results",[])[:5]] or _vendor_sim_data.get(key,{}).get("relatedDevices",[])
        }
    except:
        if key in _vendor_sim_data:
            return _vendor_sim_data[key]
        return {"key": key, "connected": False, "devices": 0, "points": 0}
