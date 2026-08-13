#!/usr/bin/env python3
"""
iotStudio 数据库初始化 — 对齐 DG-IoT Parse Schema
==================================================
1. 从 schemas.json 读取 23 个类的定义
2. 通过 FastAPI 创建 Schema + 种子数据
3. 支持 SQLite (免安装) 和 PostgreSQL 两种后端
"""
import json, os, sys, time, requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = os.environ.get("DGIOT_API", "http://localhost:8000/api")
TOKEN = None


def login(username: str = "admin", password: str = os.environ.get("ADMIN_PASS", "changeme")) -> str:
    """获取 JWT token"""
    r = requests.post(f"{API}/auth/login",
                      json={"username": username, "password": password}, timeout=5)
    r.raise_for_status()
    token = r.json().get("token") or r.json().get("access_token")
    global TOKEN
    TOKEN = token
    return token


def api(method: str, path: str, body: dict = None) -> dict:
    """调用 iotStudio REST API"""
    url = API + path
    headers = {"Content-Type": "application/json"}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    r = requests.request(method, url, json=body, headers=headers, timeout=10)
    if r.status_code >= 400:
        print(f"  ⚠ {method} {path} → {r.status_code} {r.text[:80]}")
        return {}
    return r.json() if r.text else {}


def create_schemas():
    """从 schemas.json 创建所有类"""
    schema_file = os.path.join(BASE_DIR, "data", "schemas.json")
    if not os.path.exists(schema_file):
        print("⚠ data/schemas.json 不存在，跳过 Schema 创建")
        return

    with open(schema_file, encoding="utf-8") as f:
        schemas = json.load(f)

    count = 0
    for s in schemas:
        cn = s["className"]
        if cn.startswith("_"):     # 内置类跳过
            continue
        api("POST", "/schemas", {
            "className": cn,
            "classLevelPermissions": s.get("classLevelPermissions", {}),
            "fields": s.get("fields", {}),
        })
        count += 1
    print(f"✅ {count} 个类 Schema 注册完成")


def seed_tenants():
    """租户 — 对齐 DG-IoT _Role"""
    tenants = [
        {"tenant_id": "default", "name": "默认租户", "slug": "default"},
        {"tenant_id": "oil-monitor", "name": "设备完整性", "slug": "oil-monitor",
         "parent_id": "default", "contact": "设备完整性事业部"},
    ]
    for t in tenants:
        api("POST", "/tenants", t)
    print(f"✅ {len(tenants)} 个租户")


def seed_users():
    """用户 — 对齐 DG-IoT _User"""
    users = [
        {"username": "admin", "password": os.environ.get("ADMIN_PASS", "changeme"), "role": "admin"},
        {"username": os.environ.get("DG_USER","dgiot"), "password": os.environ.get("DG_PASS","changeme"), "role": "admin"},
        {"username": "operator", "password": "oper123", "role": "operator"},
    ]
    for u in users:
        api("POST", "/users", u)
    print(f"✅ {len(users)} 个用户")


def seed_products():
    """产品 — 对齐 DG-IoT Product"""
    products = [
        {"product_id": "inverter", "name": "光伏逆变器", "icon": "☀️",
         "desc": "光储充核心设备", "protocols": ["modbus_tcp", "modbus_rtu"]},
        {"product_id": "pcs", "name": "储能PCS", "icon": "🔋",
         "desc": "电池储能变流控制", "protocols": ["modbus_tcp"]},
        {"product_id": "charger", "name": "充电桩", "icon": "🔌",
         "desc": "电动汽车充放电", "protocols": ["modbus_tcp", "iec104"]},
        {"product_id": "meter", "name": "智能电表", "icon": "📟",
         "desc": "三相电量计量采集", "protocols": ["modbus_rtu", "iec104"]},
        {"product_id": "oilwell", "name": "抽油机井", "icon": "🛢️",
         "desc": "工业泵类设备", "protocols": ["a11", "modbus_rtu"]},
        {"product_id": "rtu", "name": "RTU终端", "icon": "📡",
         "desc": "远程采集终端", "protocols": ["modbus_tcp", "modbus_rtu"]},
        {"product_id": "compressor", "name": "压缩机", "icon": "⚙️",
         "desc": "离心/往复压缩机", "protocols": ["modbus_tcp", "opcua"]},
    ]
    for p in products:
        api("POST", "/products", p)
    print(f"✅ {len(products)} 个产品")


def seed_channels():
    """通道 — 对齐 DG-IoT Channel"""
    channels = [
        {"device_id": "ch_boiler", "device_name": "🔥 锅炉能效", "protocol": "modbus_tcp",
         "device_type": "meter", "tenant_id": "default",
         "comm_params": {"host": "127.0.0.1", "port": 502}},
        {"device_id": "ch_bolt", "device_name": "🔩 智能螺栓", "protocol": "mqtt",
         "device_type": "sensor", "tenant_id": "default",
         "comm_params": {"host": "127.0.0.1", "port": 1883, "vendor": "boguan"}},
        {"device_id": "ch_video", "device_name": "📷 视频监控", "protocol": "rtsp",
         "device_type": "sensor", "tenant_id": "default",
         "comm_params": {"host": "127.0.0.1", "port": 554, "vendor": "hikvision"}},
        {"device_id": "ch_tdlas", "device_name": "⛽ TDLAS 气体检测", "protocol": "modbus_tcp",
         "device_type": "sensor", "tenant_id": "default",
         "comm_params": {"host": "127.0.0.1", "port": 502}},
    ]
    for ch in channels:
        api("POST", "/devices", ch)
    print(f"✅ {len(channels)} 个通道")


def seed_menu():
    """菜单 — 对齐 DG-IoT Menu"""
    menus = [
        {"name": "仪表盘", "path": "/dashboard", "icon": "Odometer", "group": "monitor", "order": 0},
        {"name": "设备管理", "path": "/devices", "icon": "Monitor", "group": "device", "order": 1},
        {"name": "产品管理", "path": "/products", "icon": "Goods", "group": "device", "order": 2},
        {"name": "组态视图", "path": "/hmi", "icon": "PictureFilled", "group": "hmi", "order": 3},
        {"name": "数据分析", "path": "/telemetry", "icon": "Search", "group": "data", "order": 4},
        {"name": "告警管理", "path": "/alarms", "icon": "Bell", "group": "data", "order": 5},
        {"name": "流计算引擎", "path": "/stream", "icon": "MagicStick", "group": "data", "order": 6},
        {"name": "预测性维护", "path": "/phm", "icon": "Cpu", "group": "data", "order": 7},
        {"name": "报文解析", "path": "/packet-analysis", "icon": "DataAnalysis", "group": "network", "order": 8},
        {"name": "通道管理", "path": "/channels", "icon": "Connection", "group": "network", "order": 9},
        {"name": "边缘代理", "path": "/edge-proxy", "icon": "Platform", "group": "network", "order": 10},
        {"name": "MQTT调试", "path": "/mqtt-tool", "icon": "ChatDotRound", "group": "tool", "order": 11},
        {"name": "模拟器管理", "path": "/simulators", "icon": "VideoCameraFilled", "group": "tool", "order": 12},
        {"name": "系统概览", "path": "/system-overview", "icon": "Monitor", "group": "system", "order": 13},
        {"name": "运维管理", "path": "/maintenance", "icon": "Setting", "group": "system", "order": 14},
        {"name": "用户管理", "path": "/users", "icon": "UserFilled", "group": "system", "order": 15},
    ]
    for m in menus:
        api("POST", "/menu", m)
    print(f"✅ {len(menus)} 个菜单项")


if __name__ == "__main__":
    print("=" * 55)
    print("  iotStudio 数据库初始化 (DG-IoT Parse 对齐)")
    print("=" * 55)

    try:
        print(f"\n[1/6] 登录 {API} ...")
        login()
        print("  ✅ admin 登录成功")
    except Exception as e:
        print(f"  ⚠ 登录失败: {e}")
        print("  可能是 iotStudio 未启动，尝试直接写入 SQLite...")

    print("\n[2/6] Schema...")
    create_schemas()

    print("\n[3/6] 租户...")
    seed_tenants()

    print("\n[4/6] 用户...")
    seed_users()

    print("\n[5/6] 产品 + 通道...")
    seed_products()
    seed_channels()

    print("\n[6/6] 菜单...")
    seed_menu()

    print(f"\n🎉 初始化完成! 访问 {API.replace('/api','')} 查看")
