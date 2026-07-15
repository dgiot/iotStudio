import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
os.environ.setdefault('PARSE_PG_DSN', 'postgresql://dgiot:dgiot123@127.0.0.1:7432/parse')
from parse_db import reset_backend
reset_backend()
from parse_lite import parse_query
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 20
skip = int(sys.argv[2]) if len(sys.argv) > 2 else 0
r = parse_query("Device", {"limit": limit, "skip": skip})

def extract(d):
    """Extract device fields from Parse-compatible JSON data column"""
    oid = d.get("objectId", "")
    # Parse JSON data column if present
    data = d.get("data", {})
    if isinstance(data, str):
        try: data = json.loads(data)
        except: data = {}
    return {
        "device_id": data.get("devaddr", oid),
        "device_name": data.get("device_name", data.get("name", oid)),
        "devaddr": data.get("devaddr", oid),
        "name": data.get("name", data.get("device_name", oid)),
        "device_type": data.get("device_type", ""),
        "protocol": data.get("protocol", ""),
        "ip": data.get("ip", ""),
        "status": data.get("status", "offline"),
        "station_id": data.get("station_id", data.get("station", "")),
        "manufacturer": data.get("manufacturer", ""),
        "model": data.get("model", ""),
        "product": data.get("product"),
        "productName": data.get("productName", data.get("device_type", "")),
    }

print(json.dumps({
    "total": r.get("count", 0),
    "page": skip // limit + 1 if limit else 1,
    "page_size": limit,
    "devices": [extract(d) for d in r.get("results", [])]
}, ensure_ascii=False, default=str))
