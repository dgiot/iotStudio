"""检查 telemetry.db 数据"""
import sqlite3, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "telemetry.db")
if not os.path.exists(db_path):
    print(f"{db_path} NOT FOUND")
else:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    cur = conn.cursor()

    # inv_01 latest
    cur.execute("SELECT device_id, point_id, value, ts FROM telemetry WHERE device_id='inv_01' ORDER BY ts DESC LIMIT 10")
    rows = cur.fetchall()
    print("=== inv_01 latest 10 rows ===")
    for r in rows:
        print(f"  {r[0]}.{r[1]} = {r[2]} @ {r[3]}")

    print()
    cur.execute("SELECT DISTINCT device_id FROM telemetry ORDER BY device_id")
    devs = cur.fetchall()
    print(f"=== All devices ({len(devs)}) ===")
    for d in devs:
        cur.execute("SELECT COUNT(*), MAX(ts) FROM telemetry WHERE device_id=?", (d[0],))
        cnt, ts = cur.fetchone()
        print(f"  {d[0]}: {cnt} points, latest={ts}")

    conn.close()
