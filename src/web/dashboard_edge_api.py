"""
边缘 Dashboard API — 从 shixu dashboard_api.py 同步
=====================================================
扫码统计 / Modbus采集指标 / 管线吞吐 / 流式计算
"""
from fastapi import APIRouter
import time, random

router = APIRouter(prefix="/api/edge", tags=["Edge Dashboard"])

# 模拟实时统计 (生产对接 commbridge_server.stats)
_edge = {
    'modbus_tcp': {'sent': 0, 'received': 0, 'errors': 0, 'timeouts': 0, 'reconnects': 0},
    'modbus_rtu': {'sent': 0, 'received': 0, 'errors': 0},
    'opc_da': {'sent': 0, 'received': 0, 'errors': 0},
    'scan': {'total': 0, 'success': 0, 'failed': 0, 'avg_ms': 0, 'last': None},
    'pipeline': {'rate': 99.95, 'latency_ms': 45, 'throughput': 2500000, 'writes': 0, 'errors': 0},
    'devices': {'total': 270, 'online': 268, 'offline': 2},
}

def _tick():
    for s in [_edge['modbus_tcp'], _edge['modbus_rtu']]:
        s['sent'] += random.randint(10, 200)
        s['received'] += random.randint(10, 200)
        if random.random() < 0.01: s['errors'] += 1
        if random.random() < 0.005: s['timeouts'] += 1
    _edge['scan']['total'] += random.randint(1, 5)
    _edge['scan']['success'] += random.randint(1, 5)
    _edge['scan']['avg_ms'] = round(random.uniform(5, 35), 1)
    _edge['pipeline']['writes'] += random.randint(2000, 20000)

@router.get("/scan")
async def edge_scan():
    _tick()
    return {
        "scanner": {"running": True, "protocol": "Modbus TCP/IPv6双栈"},
        "stats": _edge['scan'],
        "slaves": [
            {"ip": f"11.248.195.{72+i}", "port": 502, "slave_id": i % 20 + 1,
             "device_type": "oilwell", "found_points": random.randint(10, 23)}
            for i in range(8)
        ],
        "devices": _edge['devices'],
    }

@router.get("/pipeline")
async def edge_pipeline():
    return {
        "pipeline": _edge['pipeline'],
        "modbus_tcp": _edge['modbus_tcp'],
        "modbus_rtu": _edge['modbus_rtu'],
        "opc_da": _edge['opc_da'],
    }
