#!/usr/bin/env python3
"""导入 PROJECT_TAGPAR 完整映射 → parse.db + 边缘中枢"""
import sys, sqlite3, json, time
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from src.storage.oracle_bridge import OracleBridge

BATCH_SIZE = 500
bridge = OracleBridge()

# ═══════════════════════════════════
# 1. 创建本地表
# ═══════════════════════════════════
db = sqlite3.connect(str(ROOT / "data" / "parse.db"))
now = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")

db.executescript("""
CREATE TABLE IF NOT EXISTS tag_definition (
    objectId TEXT PRIMARY KEY,
    driver_name TEXT,
    device_longname TEXT,
    device_id TEXT,
    well_name TEXT,
    tag_name TEXT,
    longname TEXT,
    link TEXT,
    tag_desc TEXT,
    tag_type TEXT,
    data_type TEXT,
    range_max REAL,
    range_min REAL,
    unit TEXT,
    station TEXT,
    data TEXT,
    createdAt TEXT,
    updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS data_source (
    objectId TEXT PRIMARY KEY,
    driver_name TEXT,
    device_count INTEGER,
    tag_count INTEGER,
    data TEXT,
    createdAt TEXT,
    updatedAt TEXT
);
""")

# ═══════════════════════════════════
# 2. 从 Oracle 分批导入
# ═══════════════════════════════════
print("=== Importing PROJECT_TAGPAR ===")

# Get total count
r = bridge.query("SELECT COUNT(*) as CNT FROM PROJECT_TAGPAR")
total = int(r['rows'][0]['CNT'])
print(f"Total: {total} tags")

# Get distinct drivers
r = bridge.query("SELECT DRIVERNAME, COUNT(*) as CNT, COUNT(DISTINCT DEVICELONGNAME) as DEVICES FROM PROJECT_TAGPAR GROUP BY DRIVERNAME")
drivers = {}
for row in r['rows']:
    drv = row['DRIVERNAME'] or 'unknown'
    drivers[drv] = {'count': int(row['CNT']), 'devices': int(row['DEVICES'])}
    print(f"  {drv}: {drivers[drv]['devices']} devices, {drivers[drv]['count']} tags")

# Import in batches
imported = 0
for offset in range(0, total, BATCH_SIZE):
    sql = f"""
        SELECT * FROM (
            SELECT a.*, ROWNUM rn FROM (
                SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK,
                       TAGDESC, TAGTYPE, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM,
                       ENGINEERINGUNIT
                FROM PROJECT_TAGPAR
                WHERE ROWNUM <= {offset + BATCH_SIZE}
                ORDER BY DRIVERNAME, DEVICELONGNAME
            ) a WHERE ROWNUM <= {BATCH_SIZE}
        ) WHERE rn > {offset}
    """
    # Actually, let's use ROWNUM differently for paging
    sql = f"""
        SELECT DRIVERNAME, DEVICELONGNAME, NAME, LONGNAME, LINK,
               TAGDESC, TAGTYPE, DATATYPE, RANGEMAXIMUM, RANGEMINIMUM,
               ENGINEERINGUNIT
        FROM PROJECT_TAGPAR
    """
    if offset == 0:
        r = bridge.query(sql)
        all_rows = r.get('rows', [])
        print(f"  Fetched {len(all_rows)} rows")
        break  # Got all rows in one query

if not all_rows:
    print("Failed to fetch rows")
    sys.exit(1)

print(f"\nProcessing {len(all_rows)} rows...")
for row in all_rows:
    drv = row.get('DRIVERNAME', '') or ''
    dev_long = row.get('DEVICELONGNAME', '') or ''
    name = row.get('NAME', '') or ''
    longname = row.get('LONGNAME', '') or ''
    link = row.get('LINK', '') or ''
    desc = row.get('TAGDESC', '') or ''
    ttype = row.get('TAGTYPE', '') or ''
    dtype = row.get('DATATYPE', '') or ''
    rmax = row.get('RANGEMAXIMUM', '') or '0'
    rmin = row.get('RANGEMINIMUM', '') or '0'
    unit = row.get('ENGINEERINGUNIT', '') or ''

    # Parse device
    if '\\' in dev_long:
        parts = dev_long.split('\\')
        dev_id = parts[0]
        well = parts[1] if len(parts) > 1 else ''
    else:
        dev_id = dev_long
        well = ''

    # Parse station from longname
    station = ''
    if longname.startswith('/'):
        parts = longname.split('/')
        if len(parts) > 1:
            station = parts[1]

    oid = f"tag_{drv}_{dev_id}_{name}"[:100]

    db.execute("""INSERT OR IGNORE INTO tag_definition
        (objectId, driver_name, device_longname, device_id, well_name,
         tag_name, longname, link, tag_desc, tag_type, data_type,
         range_max, range_min, unit, station, data, createdAt, updatedAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (oid, drv, dev_long, dev_id, well, name, longname, link, desc,
         ttype, dtype, float(rmax) if rmax else 0, float(rmin) if rmin else 0,
         unit, station, json.dumps({}, ensure_ascii=False), now, now))

    imported += 1
    if imported % 5000 == 0:
        db.commit()
        print(f"  {imported}/{len(all_rows)} ({100*imported//len(all_rows)}%)")

db.commit()

# ═══════════════════════════════════
# 3. 数据源汇总
# ═══════════════════════════════════
for drv, info in drivers.items():
    db.execute("""INSERT OR REPLACE INTO data_source
        (objectId, driver_name, device_count, tag_count, data, createdAt, updatedAt)
        VALUES (?,?,?,?,?,?,?)""",
        (f"ds_{drv}", drv, info['devices'], info['count'],
         json.dumps({}, ensure_ascii=False), now, now))

db.commit()

# ═══════════════════════════════════
# 4. 验证
# ═══════════════════════════════════
cnt = db.execute("SELECT COUNT(*) FROM tag_definition").fetchone()[0]
dev_cnt = db.execute("SELECT COUNT(DISTINCT device_id) FROM tag_definition").fetchone()[0]
ds_cnt = db.execute("SELECT COUNT(*) FROM data_source").fetchone()[0]

print(f"\n=== Import Complete ===")
print(f"  tag_definition: {cnt} rows")
print(f"  distinct devices: {dev_cnt}")
print(f"  data_source: {ds_cnt} rows")
print(f"\n  Drivers:")
for row in db.execute("SELECT driver_name, device_count, tag_count FROM data_source").fetchall():
    print(f"    {row[0]:20s} {row[1]:4d} devices  {row[2]:6d} tags")

db.close()
print("\nDone")
