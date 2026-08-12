from src.parse_lite import *
db = get_db()
tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print(f"parse_lite.py SQLite — {len(tables)} tables")
for t in tables:
    print(f"  {t[0]}")
users = db.execute("SELECT count(*) FROM _User").fetchone()
print(f"Users: {users[0]}")
devices = db.execute("SELECT count(*) FROM Device").fetchone()
print(f"Devices: {devices[0]}")
alarms = db.execute("SELECT count(*) FROM Alarm").fetchone()
print(f"Alarms: {alarms[0]}")
