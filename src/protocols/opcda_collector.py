"""
OPC DA 数据采集器 — 在 Windows 上运行，通过 DCOM 连接 OPC 服务器
依赖: pywin32 (win32com.client)
部署: 拷贝到 131 的 C:\temp\ 运行
"""
import time, json, urllib.request, sys
from datetime import datetime

# 配置
DGIOT_API = "http://127.0.0.1:8000/api"  # iotStudio 地址（131 本地回环）
POLL_INTERVAL = 10  # 采集间隔（秒）

# OPC 服务器列表
OPC_SERVERS = [
    {"name": "RSLinx OPC Server", "host": "192.168.10.23", "tags": []},
    {"name": "RSLinx OPC Server", "host": "192.168.10.23", "tags": []},
]


def list_opc_servers():
    """列出可用的 OPC 服务器"""
    try:
        import pythoncom
        pythoncom.CoInitialize()
        import win32com.client
        opc = win32com.client.Dispatch("OPC.ServerList.1")
        return list(opc.List())
    except Exception as e:
        print(f"[OPC] List servers failed: {e}")
        return []


def connect_opc(server_name, host=None):
    """连接 OPC 服务器"""
    import pythoncom
    pythoncom.CoInitialize()
    import win32com.client
    opc = win32com.client.Dispatch("OPC.Automation.1")
    if host:
        opc.Connect(server_name, host)
    else:
        opc.Connect(server_name)
    return opc


def read_tags(opc, tags):
    """读取标签值"""
    try:
        values = opc.Read(tags)
        return [
            {"tag": t, "value": v[0], "quality": v[1], "time": str(v[2])}
            for t, v in zip(tags, values)
        ]
    except Exception as e:
        print(f"[OPC] Read failed: {e}")
        return []


def push_to_dgiot(data, device_id="opc_da_gateway"):
    """推送数据到 iotStudio"""
    try:
        req = urllib.request.Request(
            f"{DGIOT_API}/devices/{device_id}/telemetry",
            data=json.dumps({"points": data}).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"[OPC] Push failed: {e}")


def scan_and_collect():
    """主循环：扫描 OPC 服务器 → 连接 → 读取 → 推送"""
    print(f"[OPC] Starting OPC DA collector, push to {DGIOT_API}")

    # 1. 列出所有服务器
    servers = list_opc_servers()
    print(f"[OPC] Found {len(servers)} OPC servers: {servers}")

    for srv_name in servers[:5]:  # 最多连接5个
        try:
            print(f"[OPC] Connecting to {srv_name}...")
            opc = connect_opc(srv_name)

            # 浏览标签
            opc_browse = opc.CreateBrowser()
            opc_browse.ShowBranches()
            branches = opc_browse.GetBranches()
            print(f"[OPC] {srv_name} branches: {branches}")

            # 读第一层标签
            opc_browse.ShowLeafs()
            tags = list(opc_browse.GetLeafs())[:20]  # 最多20个标签
            print(f"[OPC] {srv_name} tags ({len(tags)}): {tags[:5]}...")

            if tags:
                values = read_tags(opc, tags)
                print(f"[OPC] Sample values: {values[:3]}")
                push_to_dgiot(values, srv_name.replace(" ", "_").replace(".", "_"))

            opc.Disconnect()
        except Exception as e:
            print(f"[OPC] {srv_name} failed: {e}")


if __name__ == "__main__":
    scan_and_collect()
