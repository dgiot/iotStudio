#!/usr/bin/env python3
"""Direct import from Oracle PROJECT_TAGPAR → parse.db"""
import sys, sqlite3, json, time
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
from src.storage.oracle_bridge import OracleBridge

bridge = OracleBridge()
db = sqlite3.connect(str(ROOT / "data" / "parse.db"))
now = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")

db.executescript("""
CREATE TABLE IF NOT EXISTS tag_definition (
    objectId TEXT PRIMARY KEY, driver_name TEXT, device_longname TEXT,
    device_id TEXT, well_name TEXT, tag_name TEXT, longname TEXT,
    tag_desc TEXT, data_type TEXT, range_max REAL, range_min REAL,
    unit TEXT, station TEXT, data TEXT, createdAt TEXT, updatedAt TEXT
)""")

SEP = "\\"

def insert_rows(rows, label=""):
    n = 0
    for row in rows:
        drv_n = str(row.get('DRIVERNAME','') or '')
        dev_long = str(row.get('DEVICELONGNAME','') or '')
        name = str(row.get('NAME','') or '')
        longname = str(row.get('LONGNAME','') or '')
        desc = str(row.get('TAGDESC','') or '')
        dtype = str(row.get('DATATYPE','') or '')
        rmax = str(row.get('RANGEMAXIMUM','') or '0')
        rmin = str(row.get('RANGEMINIMUM','') or '0')
        unit = str(row.get('ENGINEERINGUNIT','') or '')

        dev_id = dev_long.split(SEP)[0] if SEP in dev_long else dev_long
        well = dev_long.split(SEP)[1] if SEP in dev_long and len(dev_long.split(SEP)) > 1 else ''
        station = longname.split('/')[1] if longname.startswith('/') and len(longname.split('/')) > 1 else ''
        oid = f"{drv_n}_{dev_id}_{name}"[:200]

        db.execute("""INSERT OR REPLACE INTO tag_definition
            (objectId, driver_name, device_longname, device_id, well_name,
             tag_name, longname, tag_desc, data_type, range_max, range_min,
             unit, station, data, createdAt, updatedAt)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (oid, drv_n, dev_long, dev_id, well, name, longname, desc,
             dtype, float(rmax) if rmax else 0, float(rmin) if rmin else 0,
             unit, station, '{}', now, now))
        n += 1
    db.commit()
    return n

# Small tables first
for drv in ['IM_A11_RTU', 'Standard_Umodbus']:
    sql = f"SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK, TAGDESC, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM, ENGINEERINGUNIT FROM PROJECT_TAGPAR WHERE DRIVERNAME='{drv}'"
    r = bridge.query(sql)
    rows = r.get('rows', [])
    n = insert_rows(rows)
    print(f"{drv}: {n} tags imported")

# OPC_FC_Client — per device
print("OPC_FC_Client devices:")
r_devs = bridge.query("SELECT DISTINCT DEVICELONGNAME FROM PROJECT_TAGPAR WHERE DRIVERNAME='OPC_FC_Client'")
devices = [str(d['DEVICELONGNAME']) for d in r_devs.get('rows', [])]
print(f"  {len(devices)} devices total")

opc_total = 0
for i, dev in enumerate(devices):
    sql = f"SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK, TAGDESC, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM, ENGINEERINGUNIT FROM PROJECT_TAGPAR WHERE DRIVERNAME='OPC_FC_Client' AND DEVICELONGNAME='{dev}'"
    r = bridge.query(sql)
    rows = r.get('rows', [])
    n = insert_rows(rows)
    opc_total += n
    if (i+1) % 5 == 0:
        db.commit()
        print(f"  [{i+1}/{len(devices)}] {dev}: {n} tags (total={opc_total})")
    time.sleep(0.5)

db.commit()

# Device records
db.execute("""INSERT OR REPLACE INTO ontology_device
    (objectId, name, channel_id, type, protocol, slave_id, manufacturer, model, status, points, data, createdAt, updatedAt)
    SELECT DISTINCT td.device_id, COALESCE(td.well_name, td.device_id),
        CASE td.driver_name WHEN 'OPC_FC_Client' THEN 'ch_opc_da' WHEN 'IM_A11_RTU' THEN 'ch_dtu' ELSE 'ch_modbus_tcp' END,
        td.driver_name,
        CASE td.driver_name WHEN 'OPC_FC_Client' THEN 'OPC DA' WHEN 'IM_A11_RTU' THEN 'A11 RTU' ELSE 'Modbus RTU' END,
        1, 'OilField', 'Well', 'online',
        (SELECT COUNT(*) FROM tag_definition t2 WHERE t2.device_id=td.device_id)||' points',
        json_object('driver', td.driver_name, 'station', td.station),
        td.createdAt, td.updatedAt
    FROM tag_definition td GROUP BY td.device_id""")
db.commit()

tags = db.execute("SELECT COUNT(*) FROM tag_definition").fetchone()[0]
devs = db.execute("SELECT COUNT(*) FROM ontology_device").fetchone()[0]
print(f"\n=== DONE: {tags} tags, {devs} devices ===")
for row in db.execute("SELECT driver_name, COUNT(*) as c, COUNT(DISTINCT device_id) as d FROM tag_definition GROUP BY driver_name"):
    print(f"  {row[0]:20s} {row[2]:4d} devices  {row[1]:6d} tags")
db.close()
