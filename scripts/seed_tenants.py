"""租户种子数据 — 默认租户 + 油液监测租户 + 设备导入"""
import sqlite3, os, sys, json, uuid
from datetime import datetime

# 强制使用 SQLite（种子脚本不需要 PG）
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "local.db")


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def ensure_tables(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS tenants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT UNIQUE NOT NULL, name TEXT, slug TEXT UNIQUE,
            contact TEXT, phone TEXT, status TEXT DEFAULT 'active',
            max_devices INTEGER DEFAULT 1000, max_users INTEGER DEFAULT 50,
            extra TEXT, created_at TEXT
        );
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            device_id TEXT UNIQUE NOT NULL, device_name TEXT, device_type TEXT,
            station_id TEXT, protocol TEXT, comm_params TEXT,
            manufacturer TEXT, model TEXT, serial_number TEXT,
            install_location TEXT, status TEXT DEFAULT 'offline',
            enabled INTEGER DEFAULT 1,
            last_online_at TEXT, created_at TEXT, updated_at TEXT, extra TEXT
        );
    """)
    conn.commit()


def seed_default_tenant(conn):
    now = datetime.utcnow().isoformat()
    conn.execute("""
        INSERT OR IGNORE INTO tenants (tenant_id, name, slug, contact, status, max_devices, max_users, created_at)
        VALUES ('default', '默认租户', 'default', 'admin', 'active', 99999, 999, ?)
    """, (now,))
    conn.commit()
    print("✅ 默认租户")


def seed_oil_tenant(conn):
    now = datetime.utcnow().isoformat()
    conn.execute("""
        INSERT OR IGNORE INTO tenants (tenant_id, name, slug, contact, status, max_devices, max_users, created_at)
        VALUES ('oil-monitor', '设备完整性', 'oil-monitor', '设备完整性事业部', 'active', 200, 20, ?)
    """, (now,))
    conn.commit()
    print("✅ 油液监测租户")


def import_oil_devices(conn):
    """导入 oil-monitor 设备到油液监测租户"""
    now = datetime.utcnow().isoformat()
    devices = [
        {
            "device_id": "oil_ccs1_hydraulic",
            "device_name": "CCS-1液压系统",
            "device_type": "compressor",
            "station_id": "破碎机油站",
            "protocol": "http_rest",
            "manufacturer": "有叶云",
            "model": "S2MX46 液压油",
            "install_location": "破碎机油站-1号液压站",
            "comm_params": json.dumps({
                "vendor": "youyeyun",
                "uuid": "6bf6f220-d5bb-11ed-b812-ed5ae62e5bad",
                "token_env": "YOUYEYUN_TOKEN",
                "interval_sec": 300,
            }),
        },
        {
            "device_id": "oil_gear2_system",
            "device_name": "2号齿轮系统",
            "device_type": "compressor",
            "station_id": "演示组",
            "protocol": "http_rest",
            "manufacturer": "有叶云",
            "model": "壳牌320 齿轮油",
            "install_location": "演示组-2号齿轮箱",
            "comm_params": json.dumps({
                "vendor": "youyeyun",
                "uuid": "2e8cc4a0-35c9-11ee-b812-ed5ae62e5bad",
                "token_env": "YOUYEYUN_TOKEN",
                "interval_sec": 300,
            }),
        },
    ]
    for d in devices:
        conn.execute("""
            INSERT OR REPLACE INTO devices
            (tenant_id, device_id, device_name, device_type, station_id, protocol,
             manufacturer, model, install_location, comm_params, status, enabled, created_at, updated_at)
            VALUES ('oil-monitor', :did, :name, :dtype, :station, :proto,
                    :vendor, :model, :location, :comm, 'offline', 1, ?, ?)
        """, (d["device_id"], "device_name" not in d) or d, now, now)
    conn.commit()
    print(f"✅ 导入 {len(devices)} 台油液监测设备")


if __name__ == "__main__":
    conn = get_db()
    ensure_tables(conn)
    seed_default_tenant(conn)
    seed_oil_tenant(conn)
    import_oil_devices(conn)
    conn.close()
    print("🎉 租户种子完成")
