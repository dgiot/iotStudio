"""
Parse Server 集成初始化脚本
===========================
1. 启动嵌入式 PostgreSQL (无安装，端口 7432)
2. 启动 Parse Server (Node.js, 端口 1337)
3. 创建 Schema (23个 DG-IoT 标准类)
4. 种子数据: 默认租户 + 油液监测租户 + 用户 + 菜单
"""
import json, os, sys, time, subprocess, urllib.request, urllib.error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARSE_DIR = os.path.join(BASE_DIR, "parse-server")
PARSE_URL = "http://127.0.0.1:1337/parse"
APP_ID = "ddc9ac052450367e4a03c4056c21bff8"
MASTER_KEY = "b59551ab147d580a84272044b2139fbd"

HEADERS = {
    "X-Parse-Application-Id": APP_ID,
    "X-Parse-Master-Key": MASTER_KEY,
    "Content-Type": "application/json",
}


def api(method: str, path: str, body: dict = None) -> dict:
    """调用 Parse REST API"""
    url = PARSE_URL + path
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        r = urllib.request.urlopen(req, timeout=30)
        return json.loads(r.read()) if r.status != 204 else {}
    except urllib.error.HTTPError as e:
        print(f"  ⚠ {method} {path} → {e.code} {e.reason}")
        return {}


def wait_parse(timeout: int = 30) -> bool:
    """等待 Parse Server 就绪"""
    for i in range(timeout):
        try:
            r = urllib.request.urlopen(PARSE_URL + "/health", timeout=3)
            if r.status == 200:
                print(f"✅ Parse Server ready (wait {i}s)")
                return True
        except:
            time.sleep(1)
    return False


def start_postgres():
    """启动嵌入式 PostgreSQL"""
    try:
        from pg_embedded import EmbeddedPostgres
        pg = EmbeddedPostgres(
            data_dir=os.path.join(BASE_DIR, "data", "pgdata"),
            port=7432,
            username="postgres",
            password="postgres",
            database="parse",
        )
        pg.start()
        print("✅ PostgreSQL 7432 ready")
        return pg
    except ImportError:
        print("⚠ pg_embedded 未安装，尝试 pip install pg-embedded")
        print("  或手动启动 PostgreSQL 在 127.0.0.1:7432")
        return None


def start_parse_server():
    """启动 Parse Server (Node.js)"""
    node_bin = os.path.join(PARSE_DIR, "script", "node", "bin", "node.exe")
    if not os.path.exists(node_bin):
        node_bin = os.path.join(PARSE_DIR, "script", "node", "bin", "node")
    if not os.path.exists(node_bin):
        print("⚠ 未找到 Node.js 二进制，尝试系统 node...")
        node_bin = "node"

    server_js = os.path.join(PARSE_DIR, "server", "index.js")
    env = os.environ.copy()
    env["DATABASE"] = "postgres://postgres:postgres@127.0.0.1:7432/parse"
    env["SERVER_PORT"] = "1337"
    env["SERVER_PATH"] = "/parse"
    env["DASHBOARD_STATUS"] = "true"
    env["DASHBOARD_PATH"] = "/dashboard"
    env["DASHBOARD_HTTP"] = "true"

    proc = subprocess.Popen(
        [node_bin, server_js],
        cwd=PARSE_DIR, env=env,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    print(f"✅ Parse Server PID={proc.pid}")
    return proc


def create_schemas():
    """创建 23 个 DG-IoT 标准类 Schema"""
    schemas_file = os.path.join(PARSE_DIR, "priv", "json", "schemas.json")
    if not os.path.exists(schemas_file):
        # 从 DG-IoT 复制的 schema 文件
        schemas_file = os.path.join(BASE_DIR, "data", "schemas.json")
    if not os.path.exists(schemas_file):
        print("⚠ schemas.json 未找到，跳过 Schema 创建")
        return

    with open(schemas_file, encoding="utf-8") as f:
        schemas = json.load(f)

    for s in schemas:
        cn = s["className"]
        if cn.startswith("_"):
            continue  # 内置类不需要创建
        body = {"className": cn, "classLevelPermissions": s.get("classLevelPermissions", {})}
        api("POST", "/schemas", body)
        print(f"  ✓ {cn}")

    print(f"✅ {len(schemas)} classes registered")


def seed_data():
    """种子数据 — 租户 + 角色 + 用户 + 菜单"""
    # === 租户 (DG-IoT _Role) ===
    tenants = [
        {"objectId": "default", "name": "默认租户", "alias": "default"},
        {"objectId": "oil-monitor", "name": "设备完整性", "alias": "oil-monitor"},
    ]
    for t in tenants:
        api("POST", "/roles", t)
    print("✅ 租户创建完成")

    # === 用户 (DG-IoT _User) ===
    users = [
        {"username": "admin", "password": "admin123", "role": "admin", "name": "管理员"},
        {"username": "dgiot", "password": "dgiot123", "role": "admin", "name": "DG-IoT管理员"},
    ]
    for u in users:
        api("POST", "/users", u)
    print("✅ 用户创建完成")

    # === 菜单 (DG-IoT Menu) ===
    menus = [
        {"objectId": "m_dashboard", "name": "仪表盘", "path": "/dashboard", "icon": "Odometer"},
        {"objectId": "m_devices", "name": "设备管理", "path": "/devices", "icon": "Monitor"},
        {"objectId": "m_products", "name": "产品管理", "path": "/products", "icon": "Goods"},
        {"objectId": "m_hmi", "name": "组态视图", "path": "/hmi", "icon": "PictureFilled"},
        {"objectId": "m_telemetry", "name": "数据分析", "path": "/telemetry", "icon": "Search"},
        {"objectId": "m_alarms", "name": "告警管理", "path": "/alarms", "icon": "Bell"},
        {"objectId": "m_stream", "name": "流计算引擎", "path": "/stream", "icon": "MagicStick"},
        {"objectId": "m_phm", "name": "预测性维护", "path": "/phm", "icon": "Cpu"},
        {"objectId": "m_packet", "name": "报文解析", "path": "/packet-analysis", "icon": "DataAnalysis"},
        {"objectId": "m_channels", "name": "通道管理", "path": "/channels", "icon": "Connection"},
        {"objectId": "m_edge", "name": "边缘代理", "path": "/edge-proxy", "icon": "Platform"},
        {"objectId": "m_mqtt", "name": "MQTT调试", "path": "/mqtt-tool", "icon": "ChatDotRound"},
        {"objectId": "m_sim", "name": "模拟器管理", "path": "/simulators", "icon": "VideoCameraFilled"},
        {"objectId": "m_sys", "name": "系统概览", "path": "/system-overview", "icon": "Monitor"},
        {"objectId": "m_maint", "name": "运维管理", "path": "/maintenance", "icon": "Setting"},
        {"objectId": "m_users", "name": "用户管理", "path": "/users", "icon": "UserFilled"},
    ]
    for m in menus:
        api("POST", "/classes/Menu", m)
    print(f"✅ {len(menus)} 个菜单项创建完成")

    # === 通道 (Channel) ===
    channels = [
        {"objectId": "ch_youyeyun", "name": "🛢 油液监测", "protocol": "http_rest",
         "addr": "youyeyun.com", "port": 443, "enabled": True, "tenant_id": "oil-monitor"},
        {"objectId": "ch_boiler", "name": "🔥 锅炉能效", "protocol": "modbus_tcp",
         "addr": "127.0.0.1", "port": 502, "enabled": True, "tenant_id": "default"},
        {"objectId": "ch_vib", "name": "📊 声振温", "protocol": "http_rest",
         "addr": "127.0.0.1", "port": 8500, "enabled": True, "tenant_id": "default"},
        {"objectId": "ch_bolt", "name": "🔩 智能螺栓", "protocol": "mqtt",
         "addr": "127.0.0.1", "port": 1883, "enabled": True, "tenant_id": "default"},
        {"objectId": "ch_video", "name": "📷 视频监控", "protocol": "rtsp",
         "addr": "127.0.0.1", "port": 554, "enabled": True, "tenant_id": "default"},
        {"objectId": "ch_tdlas", "name": "⛽ TDLAS 气体检测", "protocol": "modbus_tcp",
         "addr": "127.0.0.1", "port": 502, "enabled": True, "tenant_id": "default"},
    ]
    for ch in channels:
        api("POST", "/classes/Channel", ch)
    print(f"✅ {len(channels)} 个通道创建完成")


if __name__ == "__main__":
    print("=" * 60)
    print("  DG-IoT Parse Server 初始化")
    print("=" * 60)

    # 1. PostgreSQL
    print("\n[1/4] 启动 PostgreSQL...")
    pg = start_postgres()
    time.sleep(2)

    # 2. Parse Server
    print("\n[2/4] 启动 Parse Server...")
    ps = start_parse_server()

    if not wait_parse(20):
        print("❌ Parse Server 启动超时")
        sys.exit(1)

    # 3. Schema
    print("\n[3/4] 创建 Schema...")
    create_schemas()

    # 4. Seed
    print("\n[4/4] 种子数据...")
    seed_data()

    print("\n" + "=" * 60)
    print("  🎉 初始化完成!")
    print(f"  Parse:      {PARSE_URL}")
    print(f"  Dashboard:  http://127.0.0.1:1337/dashboard")
    print(f"  GraphQL:    http://127.0.0.1:1337/graphql")
    print("=" * 60)

    if ps:
        ps.wait()
