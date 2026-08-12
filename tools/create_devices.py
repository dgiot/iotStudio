"""一键创建设备 — 从 ontology_device → Device 表"""
import sqlite3, json, time, subprocess
db = sqlite3.connect(r'D:\ai\dgiot_lite\data\parse.db')
now = time.strftime('%Y-%m-%dT%H:%M:%S.000Z')

created = 0
for row in db.execute("""
    SELECT DISTINCT od.objectId, od.name, od.type, od.protocol, od.channel_id, od.data
    FROM ontology_device od
    WHERE od.objectId NOT IN (SELECT objectId FROM Device)
"""):
    oid, name, dtype, proto, ch, data_str = row
    try: odata = json.loads(data_str) if data_str else {}
    except: odata = {}
    dev_data = {
        "device_name": name or oid, "device_type": dtype, "protocol": proto,
        "channel": ch, "devaddr": oid,
        "station": odata.get("station", "DEVICE_D"), "manufacturer": "OilField",
        "model": dtype, "status": "online"
    }
    db.execute("INSERT OR IGNORE INTO Device (objectId, data, ACL, createdAt, updatedAt) VALUES (?,?,?,?,?)",
        (oid, json.dumps(dev_data, ensure_ascii=False), '*', now, now))
    created += 1

db.commit()
total = db.execute("SELECT COUNT(*) FROM Device").fetchone()[0]
db.close()
print(f"Created: {created}, Device table: {total} total")

# Restart platform
out = subprocess.run(['netstat', '-ano'], capture_output=True, text=True).stdout
for line in out.splitlines():
    if ':8000' in line and 'LISTENING' in line:
        pid = line.strip().split()[-1]
        subprocess.run(['taskkill', '/F', '/PID', pid], capture_output=True)
        print(f"Killed PID {pid}")

subprocess.Popen(['python', '-m', 'uvicorn', 'src.main:app', '--host', '0.0.0.0', '--port', '8000'],
                 cwd=r'D:\ai\dgiot_lite')
print("Platform restarted on :8000")
print("Verify: http://127.0.0.1:8000/api/devices?page_size=5")
