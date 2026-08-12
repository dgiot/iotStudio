#!/usr/bin/env python3
# ============================================================
# iotStudio — 一键启动全部协议模拟器
# 启动: python run_all.py
# ============================================================
"""
5 协议模拟器总览:
  Modbus RTU   Server   COM*       三相电表
  Modbus TCP   Server   :502       光伏逆变器
  Modbus TCP   Server   :1502      储能PCS
  Modbus TCP   Server   :2502      充电桩
  IEC 104      Server   :2404      储能PCS 从站
  OPC UA       Server   :4840      充电桩+环境传感器
  OPC DA       DataSrc  :9090      光储充数据源(HTTP)

注: Modbus RTU 需串口，单独启动: python modbus_rtu_server.py --port COM2
"""
import asyncio
import logging
import sys
import os
import threading

sys.path.insert(0, os.path.dirname(__file__))
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("sim-all")

BANNER = """
+==========================================================+
|         iotStudio — 全协议模拟器                          |
+==========================================================+
| Modbus TCP  Server   :502       光伏逆变器                 |
| Modbus TCP  Server   :1502      储能PCS                    |
| Modbus TCP  Server   :2502      充电桩                     |
| IEC 104     Server   :2404      储能PCS 从站               |
| OPC UA      Server   :4840      充电桩+环境传感器           |
| OPC DA      DataSrc  :9090      光储充数据源(HTTP)          |
+==========================================================+
| Modbus RTU  Server   单独启动    COM*  三相电表              |
+==========================================================+
"""


async def main():
    print(BANNER)
    tasks = []
    started = 0

    # 1. Modbus TCP
    try:
        from modbus_tcp_server import ModbusSimServer
        tasks.append(asyncio.create_task(ModbusSimServer().start(), name="modbus-tcp"))
        started += 1; logger.info(f"[{started}] Modbus TCP → :502 :1502 :2502")
    except Exception as e:
        logger.error(f"Modbus TCP 失败: {e}")

    # 2. IEC 104
    try:
        from iec104_server import IEC104Slave
        tasks.append(asyncio.create_task(IEC104Slave().start(), name="iec104"))
        started += 1; logger.info(f"[{started}] IEC 104 → :2404")
    except Exception as e:
        logger.error(f"IEC 104 失败: {e}")

    # 3. OPC UA
    try:
        from opcua_server import OPCUASimServer
        tasks.append(asyncio.create_task(OPCUASimServer().start(), name="opcua"))
        started += 1; logger.info(f"[{started}] OPC UA → :4840")
    except ImportError:
        logger.warning("[--] OPC UA 跳过: pip install asyncua")
    except Exception as e:
        logger.error(f"OPC UA 失败: {e}")

    # 4. OPC DA (HTTP, 始终可用)
    try:
        from http.server import HTTPServer
        from opcda_server import OPCDADataSource, SIM_ITEMS
        src = OPCDADataSource()

        import json as _json
        class _Handler(__import__('http.server').server.BaseHTTPRequestHandler):
            def do_GET(self):
                path = self.path.strip("/")
                if path in ("", "list"):
                    self._send({"items": src.list_items("*")})
                elif path.startswith("read/"):
                    vals, quals, stamps = src.read(path[5:].split(","))
                    self._send({"values": vals, "qualities": quals, "timestamps": stamps})
                else:
                    self._send(src.get_item_info(path))
            def do_POST(self):
                body = _json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
                self._send({"ok": src.write(body.get("item",""), body.get("value",0))})
            def _send(self, data):
                self.send_response(200); self.send_header("Content-Type","application/json")
                self.end_headers(); self.wfile.write(_json.dumps(data,ensure_ascii=False).encode())
            def log_message(self, *a): pass

        httpd = HTTPServer(("0.0.0.0", 9090), _Handler)
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        started += 1; logger.info(f"[{started}] OPC DA → :9090 (HTTP, {len(SIM_ITEMS)} 项)")
    except Exception as e:
        logger.error(f"OPC DA 失败: {e}")

    # RTU 提示
    logger.info(f"[--] Modbus RTU: python modbus_rtu_server.py --port COM2 (需com0com虚拟串口)")
    logger.info(f"共启动 {started} 个模拟器, 按 Ctrl+C 停止")

    await asyncio.gather(*tasks, return_exceptions=True)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n全部模拟器已停止")
