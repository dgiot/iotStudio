#!/usr/bin/env python3
"""导入 PROJECT_TAGPAR → parse.db (ROW_NUMBER 分页)"""
import sys, sqlite3, json, time
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
from src.storage.oracle_bridge import OracleBridge

bridge = OracleBridge()
db = sqlite3.connect(str(ROOT / "data" / "parse.db"))
now = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")

# Ensure tables
db.executescript("""
CREATE TABLE IF NOT EXISTS tag_definition (
    objectId TEXT PRIMARY KEY, driver_name TEXT, device_longname TEXT,
    device_id TEXT, well_name TEXT, tag_name TEXT, longname TEXT,
    tag_desc TEXT, data_type TEXT, range_max REAL, range_min REAL,
    unit TEXT, station TEXT, data TEXT, createdAt TEXT, updatedAt TEXT
);
CREATE TABLE IF NOT EXISTS data_source (
    objectId TEXT PRIMARY KEY, driver_name TEXT, device_count INTEGER,
    tag_count INTEGER, data TEXT, createdAt TEXT, updatedAt TEXT
);
""")

BATCH = 500
imported = 0

for drv in ['IM_A11_RTU', 'Standard_Umodbus', 'OPC_FC_Client']:
    # Get count
    r = bridge.query(f"SELECT COUNT(*) as CNT FROM PROJECT_TAGPAR WHERE DRIVERNAME='{drv}'")
    total = int(r['rows'][0]['CNT'])
    r_dev = bridge.query(f"SELECT COUNT(DISTINCT DEVICELONGNAME) as D FROM PROJECT_TAGPAR WHERE DRIVERNAME='{drv}'")
    dev_count = int(r_dev['rows'][0]['D'])

    # Data source
    db.execute("""INSERT OR REPLACE INTO data_source (objectId, driver_name, device_count, tag_count, data, createdAt, updatedAt)
        VALUES (?,?,?,?,?,?,?)""", (f"ds_{drv}", drv, dev_count, total, '{}', now, now))
    db.commit()

    print(f"\n{drv}: {total} tags, {dev_count} devices")

    for offset in range(0, total, BATCH):
        sql = f"""
            SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK,
                   TAGDESC, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM, ENGINEERINGUNIT
            FROM (
                SELECT t.*, ROW_NUMBER() OVER (ORDER BY DEVICELONGNAME, NAME) as rn
                FROM PROJECT_TAGPAR t
                WHERE DRIVERNAME='{drv}'
            ) WHERE rn > {offset} AND rn <= {offset + BATCH}
        """
        r = bridge.query(sql)
        rows = r.get('rows', [])
        batch_ok = 0
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

            dev_id = dev_long.split('\\')[0] if '\\' in dev_long else dev_long
            well = dev_long.split('\\')[1] if '\\' in dev_long and len(dev_long.split('\\')) > 1 else ''
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
            batch_ok += 1
        db.commit()
        imported += batch_ok
        pct = min(100, (offset + len(rows)) * 100 // total)
        print(f"  {offset+len(rows)}/{total} ({pct}%) batch={batch_ok} total={imported}")

# Device records
print("\n=== Creating device records ===")
db.execute("""
    INSERT OR REPLACE INTO ontology_device
    (objectId, name, channel_id, type, protocol, slave_id, manufacturer, model, status, points, data, createdAt, updatedAt)
    SELECT DISTINCT
        td.device_id,
        COALESCE(td.well_name, td.device_id) as name,
        CASE td.driver_name WHEN 'OPC_FC_Client' THEN 'ch_opc_da' WHEN 'IM_A11_RTU' THEN 'ch_dtu' ELSE 'ch_modbus_tcp' END,
        td.driver_name,
        CASE td.driver_name WHEN 'OPC_FC_Client' THEN 'OPC DA' WHEN 'IM_A11_RTU' THEN 'A11 RTU' ELSE 'Modbus RTU' END,
        1, 'OilField', 'Well', 'online',
        (SELECT COUNT(*) FROM tag_definition t2 WHERE t2.device_id = td.device_id) || ' points',
        json_object('driver', td.driver_name, 'station', td.station),
        td.createdAt, td.updatedAt
    FROM tag_definition td
    GROUP BY td.device_id
""")
db.commit()

devs = db.execute("SELECT COUNT(*) FROM ontology_device").fetchone()[0]
tags = db.execute("SELECT COUNT(*) FROM tag_definition").fetchone()[0]
print(f"\nDone: {devs} devices, {tags} tags")
db.close()
