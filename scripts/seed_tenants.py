"""租户种子数据 — 默认租户 + 油液监测租户 + 设备导入"""
import sqlite3, os, sys, json
from datetime import datetime
from pathlib import Path

# 仓根入 sys.path —— Python 3 跑脚本时 sys.path[0] 是脚本所在目录，仓根不在其中，
# 故裸 `from src.config import cfg` 必抛 ModuleNotFoundError。
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import cfg
from src.models.device import init_db

# 库路径与表结构各只有一处事实源：cfg.sqlite_path（src/config.py，已归一为绝对
# 路径，跨 cwd 稳定）与 src/models/device.py 的 6 个模型。本脚本不再自带第二份。
DB_PATH = cfg.sqlite_path


def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def ensure_tables():
    """建 local.db 的表 —— 走 src/models/device.py 的模型（唯一事实源）。

    原先本函数自带一份 DDL，与 models/device.py 的 6 个模型是同一批表的**第二份
    定义**，两份各自腐烂过：tenants 少 parent_id、user_roles 整张表缺失 —— 都是在
    业务端点 500 之后才被发现的。现在只剩模型一处。
    （服务自身的建表在 src/main.py 的 lifespan，与本函数同一个 init_db。）

    ⚠️ create_all 只建**缺的表**，不改已存在的表（不做 migration）——
    给已有的库加列仍需手工 ALTER，本轮未解决。
    """
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    init_db("sqlite:///" + DB_PATH.replace("\\", "/")).dispose()


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
            "manufacturer": "演示厂商",
            "model": "S2MX46 液压油",
            "install_location": "破碎机油站-1号液压站",
            "comm_params": json.dumps({
                "vendor": "vendor_oil",
                "uuid": "6bf6f220-d5bb-11ed-b812-ed5ae62e5bad",
                "token_env": "VENDOR_OIL_TOKEN",
                "interval_sec": 300,
            }),
        },
        {
            "device_id": "oil_gear2_system",
            "device_name": "2号齿轮系统",
            "device_type": "compressor",
            "station_id": "演示组",
            "protocol": "http_rest",
            "manufacturer": "演示厂商",
            "model": "齿轮油320 齿轮油",
            "install_location": "演示组-2号齿轮箱",
            "comm_params": json.dumps({
                "vendor": "vendor_oil",
                "uuid": "2e8cc4a0-35c9-11ee-b812-ed5ae62e5bad",
                "token_env": "VENDOR_OIL_TOKEN",
                "interval_sec": 300,
            }),
        },
    ]
    for d in devices:
        # 原先这里传的是 (d["device_id"], "device_name" not in d) or d, now, now)：
        # 那个 2 元组恒真（非空元组的真值恒为 True）⇒ `or d` 永不求值 ⇒ 实际只供给
        # 3 个参数而语句要 11 个，实测
        #   sqlite3.ProgrammingError: uses 11, and there are 3 supplied
        # 本脚本的 __main__ 走到这一行必炸 —— 所以连它前面的 "默认租户" 也从没落库
        # （实测 tenants 表 0 行）。改成命名参数，与上面 devices 字典的键一一对应。
        conn.execute("""
            INSERT OR REPLACE INTO devices
            (tenant_id, device_id, device_name, device_type, station_id, protocol,
             manufacturer, model, install_location, comm_params, status, enabled, created_at, updated_at)
            VALUES ('oil-monitor', :device_id, :device_name, :device_type, :station_id, :protocol,
                    :manufacturer, :model, :install_location, :comm_params, 'offline', 1, :now, :now)
        """, {**d, "now": now})
    conn.commit()
    print(f"✅ 导入 {len(devices)} 台油液监测设备")


if __name__ == "__main__":
    ensure_tables()          # 自己开会话建表，再取连接灌数据
    conn = get_db()
    seed_default_tenant(conn)
    seed_oil_tenant(conn)
    import_oil_devices(conn)
    conn.close()
    print("🎉 租户种子完成")
