#!/usr/bin/env python3
# ============================================================
# dgiot_lite — OPC DA Server 模拟器
# 基于 Pyro5 + OpenOPC-DA Gateway 模式
# 启动: python opcda_server.py
# ============================================================
"""
OPC DA 模拟数据源 — 提供模拟设备数据项。

方式一 (推荐): 配合 Matrikon OPC Simulation Server (免费)
  1. 下载安装: https://www.matrikonopc.com/opc-drivers/opc-simulation-server/
  2. 默认 ProgID: "Matrikon.OPC.Simulation.1"
  3. 内置项: Random.Int1~Int4, Random.Real4~Real8, Saw-toothed.Int1~Int2 等
  4. dgiot_lite 直接连接即可

方式二: 本脚本作为 Pyro5 远程数据源
  启动后提供 Pyro5 对象，OpenOPC-DA Gateway 可连接
  模拟: 光伏/储能/充电桩 数据项
"""
import math
import random
import sys
import time
from datetime import datetime
from typing import Any, Dict, List, Tuple

try:
    import Pyro5.api
    HAS_PYRO = True
except ImportError:
    HAS_PYRO = False


# ===== 模拟数据项 =====
class OPCItemSimulator:
    """单个数据项模拟器"""

    def __init__(self, name: str, base: float, amp: float = 0, vtype: str = "float",
                 unit: str = "", vmin: float = 0, vmax: float = 99999, trend: str = "drift"):
        self.name = name
        self.base = base
        self.amp = amp
        self.vtype = vtype
        self.unit = unit
        self.vmin = vmin
        self.vmax = vmax
        self.trend = trend
        self._phase = random.uniform(0, math.pi * 2)
        self._value = base

    def update(self):
        """更新值"""
        t = time.time()
        self._phase += 0.05
        noise = random.gauss(0, abs(self.base) * 0.01 + 0.1)

        if self.trend == "sin":
            self._value = self.base + self.amp * math.sin(self._phase) + noise
        elif self.trend == "drift":
            self._value = self._value * 0.95 + self.base * 0.05 + noise
        elif self.trend == "ramp":
            self._value = self._value + self.amp * 0.1 + noise
        else:
            self._value = self.base + noise

        self._value = max(self.vmin, min(self.vmax, self._value))
        return self._value

    @property
    def value(self):
        if self.vtype == "int":
            return int(self._value)
        elif self.vtype == "bool":
            return self._value > (self.vmax + self.vmin) / 2
        return round(self._value, 4)


# ===== 光储充数据项模板 =====
SIM_ITEMS = {
    # 光伏逆变器
    "Solar.PV.Power":          OPCItemSimulator("光伏有功功率", 3500, 500, "float", "W", 0, 5000, "sin"),
    "Solar.PV.Voltage":        OPCItemSimulator("交流电压", 230, 5, "float", "V", 210, 250, "drift"),
    "Solar.PV.Current":        OPCItemSimulator("交流电流", 15.2, 3, "float", "A", 0, 30, "sin"),
    "Solar.PV.DailyEnergy":    OPCItemSimulator("日发电量", 150, 20, "float", "kWh", 0, 99999, "ramp"),
    "Solar.PV.Temperature":    OPCItemSimulator("逆变器温度", 45, 5, "float", "°C", 20, 80, "drift"),
    "Solar.PV.Efficiency":     OPCItemSimulator("逆变器效率", 98.2, 1, "float", "%", 90, 99.9, "drift"),
    "Solar.PV.Status":         OPCItemSimulator("运行状态", 1, 0, "int", "", 0, 2, "none"),
    "Solar.PV.Irradiance":     OPCItemSimulator("辐照度", 800, 200, "float", "W/m²", 0, 1200, "sin"),

    # 储能PCS
    "Storage.PCS.SOC":          OPCItemSimulator("SOC", 75, 10, "float", "%", 0, 100, "drift"),
    "Storage.PCS.SOH":          OPCItemSimulator("SOH", 98.2, 0.3, "float", "%", 80, 100, "drift"),
    "Storage.PCS.Power":        OPCItemSimulator("有功功率", 2500, 800, "float", "W", -5000, 5000, "sin"),
    "Storage.PCS.Voltage":      OPCItemSimulator("交流电压", 230, 3, "float", "V", 210, 250, "drift"),
    "Storage.PCS.Current":      OPCItemSimulator("交流电流", 10.8, 3, "float", "A", 0, 25, "sin"),
    "Storage.PCS.Temperature":  OPCItemSimulator("电芯温度", 35, 2, "float", "°C", 20, 50, "drift"),
    "Storage.PCS.Status":       OPCItemSimulator("充放电状态", 2, 0, "int", "", 0, 3, "none"),

    # 充电桩
    "Charger.EV.Power":         OPCItemSimulator("充电功率", 30, 20, "float", "kW", 0, 60, "sin"),
    "Charger.EV.Voltage":       OPCItemSimulator("输出电压", 380, 5, "float", "V", 350, 430, "drift"),
    "Charger.EV.Current":       OPCItemSimulator("输出电流", 45, 25, "float", "A", 0, 80, "sin"),
    "Charger.EV.Energy":        OPCItemSimulator("累计充电量", 28500, 120, "float", "kWh", 0, 999999, "ramp"),
    "Charger.EV.Temperature":   OPCItemSimulator("模块温度", 40, 3, "float", "°C", 20, 60, "drift"),
    "Charger.EV.Status":        OPCItemSimulator("充电状态", 1, 0, "int", "", 0, 3, "none"),
    "Charger.EV.Locked":        OPCItemSimulator("枪锁", 1, 0, "bool", "", 0, 1, "none"),
}


# ===== Pyro5 远程对象 =====
@Pyro5.api.expose
class OPCDADataSource:
    """OPC DA 模拟数据源 (Pyro5)"""

    def __init__(self):
        self.items: Dict[str, OPCItemSimulator] = dict(SIM_ITEMS)
        self._running = False

    def list_items(self, path: str = "*") -> List[str]:
        """列出所有数据项"""
        if path == "*":
            return list(self.items.keys())
        return [k for k in self.items if k.startswith(path)]

    def read(self, item_paths: List[str]) -> Tuple[List, List, List]:
        """读取一组项 → (values, qualities, timestamps)"""
        values, quals, stamps = [], [], []
        now = datetime.now().isoformat()

        for path in item_paths:
            item = self.items.get(path)
            if item:
                item.update()
                values.append(item.value)
                quals.append(192)  # OPC_QUALITY_GOOD
                stamps.append(now)
            else:
                values.append(0)
                quals.append(0)  # OPC_QUALITY_BAD
                stamps.append(now)

        return values, quals, stamps

    def write(self, item_path: str, value: Any) -> bool:
        """写入一个项"""
        item = self.items.get(item_path)
        if item:
            item.base = float(value)
            return True
        return False

    def get_item_info(self, item_path: str) -> Dict:
        """获取项信息"""
        item = self.items.get(item_path)
        if item:
            return {"name": item.name, "type": item.vtype, "unit": item.unit}
        return {}


def start_pyro_server(host="0.0.0.0", port=9099):
    """启动 Pyro5 服务器"""
    if not HAS_PYRO:
        print("Pyro5 未安装: pip install Pyro5")
        return None

    daemon = Pyro5.server.Daemon(host=host, port=port)
    uri = daemon.register(OPCDADataSource, "dgiot.opcda.simulator")
    print(f"  Pyro5 URI: {uri}")
    print(f"  连接: pyrolite://{host}:{port}/dgiot.opcda.simulator")
    return daemon


def start_http_server(host="0.0.0.0", port=9090):
    """启动 HTTP REST 接口 (可选)"""
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import json

    src = OPCDADataSource()

    class HTTPOPCHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            path = self.path.strip("/")
            if path == "" or path == "list":
                items = src.list_items("*")
                self._json({"items": items})
            elif path.startswith("read/"):
                item_paths = path[5:].split(",")
                vals, quals, stamps = src.read(item_paths)
                self._json({"values": vals, "qualities": quals, "timestamps": stamps})
            else:
                info = src.get_item_info(path)
                self._json(info)

        def do_POST(self):
            content_len = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_len))
            path = body.get("item", body.get("path", ""))
            value = body.get("value", 0)
            ok = src.write(path, value)
            self._json({"ok": ok})

        def _json(self, data):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode())

        def log_message(self, format, *args):
            pass

    server = HTTPServer((host, port), HTTPOPCHandler)
    print(f"  HTTP API: http://{host}:{port}/")
    print(f"    GET /list          → 列出所有项")
    print(f"    GET /read/item1,item2 → 读取项值")
    return server


def print_info():
    """打印推荐方案"""
    print("""
╔══════════════════════════════════════════════════════╗
║       dgiot_lite — OPC DA 模拟数据源                 ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  方式一 (推荐): Matrikon OPC Simulation Server        ║
║    下载 → 安装 → ProgID: "Matrikon.OPC.Simulation.1" ║
║    dgiot_lite 直接连接，无需本脚本                    ║
║                                                      ║
║  方式二: 本脚本 HTTP API (已启动)                     ║
║    模拟设备数据通过 HTTP 接口暴露                     ║
║                                                      ║
║  模拟数据项: 19 个                                     ║
║    光伏: 功率/电压/电流/发电量/温度/效率/辐照度/状态    ║
║    储能: SOC/SOH/功率/电压/电流/温度/状态              ║
║    充电: 功率/电压/电流/电量/温度/状态/枪锁             ║
╚══════════════════════════════════════════════════════╝
""")


if __name__ == "__main__":
    import threading

    print_info()

    # 启动 HTTP 服务器 (始终可用)
    http_thread = threading.Thread(
        target=lambda: start_http_server("0.0.0.0", 9090).serve_forever(),
        daemon=True
    )
    http_thread.start()
    print(f"  [HTTP] 数据源已启动 → http://localhost:9090/list")

    # 尝试启动 Pyro5 (如果可用)
    if HAS_PYRO:
        try:
            pyro_thread = threading.Thread(
                target=lambda: start_pyro_server().requestLoop(),
                daemon=True
            )
            pyro_thread.start()
            print(f"  [Pyro5] 数据源已启动 → pyrolite://localhost:9099/dgiot.opcda.simulator")
        except Exception as e:
            print(f"  [Pyro5] 启动失败: {e}")

    print("\n  按 Ctrl+C 停止\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nOPC DA 模拟器已停止")
