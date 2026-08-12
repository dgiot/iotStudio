#!/usr/bin/env python3
"""导入 PROJECT_TAGPAR → parse.db (分批拉取)"""
import sys, sqlite3, json, time
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
from src.storage.oracle_bridge import OracleBridge

bridge = OracleBridge()
db = sqlite3.connect(str(ROOT / "data" / "parse.db"))
now = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")

# Create tables
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

# Get counts per driver (for batching)
r = bridge.query("SELECT DRIVERNAME, COUNT(*) as CNT FROM PROJECT_TAGPAR GROUP BY DRIVERNAME")
drivers = [(row['DRIVERNAME'] or '', int(row['CNT'])) for row in r['rows']]
total = sum(c for _, c in drivers)
print(f"Total: {total} tags from {len(drivers)} drivers")

# Import per driver in batches
BATCH = 500
imported = 0

for drv, drv_total in drivers:
    print(f"\n{drv}: {drv_total} tags")
    dev_count_sql = f"SELECT COUNT(DISTINCT DEVICELONGNAME) as D FROM PROJECT_TAGPAR WHERE DRIVERNAME='{drv}'"
    r = bridge.query(dev_count_sql)
    dev_count = int(r['rows'][0]['D']) if r.get('rows') else 0

    # Register data source
    db.execute("""INSERT OR REPLACE INTO data_source (objectId, driver_name, device_count, tag_count, data, createdAt, updatedAt)
        VALUES (?,?,?,?,?,?,?)""",
        (f"ds_{drv}", drv, dev_count, drv_total, '{}', now, now))

    # Pull data in batches
    for offset in range(0, drv_total, BATCH):
        sql = f"""
            SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK,
                   TAGDESC, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM, ENGINEERINGUNIT
            FROM (
                SELECT t.*, ROWNUM rn FROM (
                    SELECT * FROM PROJECT_TAGPAR
                    WHERE DRIVERNAME='{drv}'
                    ORDER BY DEVICELONGNAME, NAME
                ) t WHERE ROWNUM <= {offset + BATCH}
            ) WHERE rn > {offset}
        """
        r = bridge.query(sql)
        rows = r.get('rows', [])

        for row in rows:
            drv_n = row.get('DRIVERNAME','') or ''
            dev_long = row.get('DEVICELONGNAME','') or ''
            name = row.get('NAME','') or ''
            longname = row.get('LONGNAME','') or ''
            desc = row.get('TAGDESC','') or ''
            dtype = row.get('DATATYPE','') or ''
            rmax = row.get('RANGEMAXIMUM','') or '0'
            rmin = row.get('RANGEMINIMUM','') or '0'
            unit = row.get('ENGINEERINGUNIT','') or ''

            # Parse device and station
            dev_id = dev_long.split('\\')[0] if '\\' in dev_long else dev_long
            well = dev_long.split('\\')[1] if '\\' in dev_long and len(dev_long.split('\\')) > 1 else ''
            station = longname.split('/')[1] if longname.startswith('/') and len(longname.split('/')) > 1 else ''

            oid = f"{drv_n}_{dev_id}_{name}"[:120]
            db.execute("""INSERT OR IGNORE INTO tag_definition
                (objectId, driver_name, device_longname, device_id, well_name,
                 tag_name, longname, tag_desc, data_type, range_max, range_min,
                 unit, station, data, createdAt, updatedAt)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (oid, drv_n, dev_long, dev_id, well, name, longname, desc,
                 dtype, float(rmax) if rmax else 0, float(rmin) if rmin else 0,
                 unit, station, '{}', now, now))
            imported += 1

        db.commit()
        pct = min(100, 100 * (offset + len(rows)) // drv_total)
        print(f"  {offset+len(rows)}/{drv_total} ({pct}%) — {imported} total imported")

# Create device records from tag_definition
print("\n=== Creating device records ===")
db.execute("""
    INSERT OR IGNORE INTO ontology_device
    (objectId, name, channel_id, type, protocol, slave_id, manufacturer, model, status, points, data, createdAt, updatedAt)
    SELECT DISTINCT
        td.device_id,
        COALESCE(td.well_name, td.device_id) as name,
        CASE td.driver_name
            WHEN 'OPC_FC_Client' THEN 'ch_opc_da'
            WHEN 'IM_A11_RTU' THEN 'ch_dtu'
            ELSE 'ch_modbus_tcp'
        END as channel_id,
        td.driver_name as type,
        CASE td.driver_name
            WHEN 'OPC_FC_Client' THEN 'OPC DA'
            WHEN 'IM_A11_RTU' THEN 'A11 RTU'
            ELSE 'Modbus RTU'
        END as protocol,
        1 as slave_id,
        'OilField' as manufacturer,
        'Well' as model,
        'online' as status,
        (SELECT COUNT(*) FROM tag_definition t2 WHERE t2.device_id = td.device_id) || ' points' as points,
        json_object('driver', td.driver_name, 'station', td.station) as data,
        td.createdAt,
        td.updatedAt
    FROM tag_definition td
    WHERE td.device_id NOT IN (SELECT objectId FROM ontology_device)
    GROUP BY td.device_id
""")
db.commit()

devs = db.execute("SELECT COUNT(*) FROM ontology_device").fetchone()[0]
tags = db.execute("SELECT COUNT(*) FROM tag_definition").fetchone()[0]
print(f"\n=== Done ===")
print(f"  ontology_device: {devs} rows")
print(f"  tag_definition: {tags} rows")
print(f"  data_source: {db.execute('SELECT COUNT(*) FROM data_source').fetchone()[0]} rows")
db.close()
