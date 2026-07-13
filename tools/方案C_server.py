#!/usr/bin/env python3
"""
方案C 生产服务器 — 开发机运行, 131端口转发, 准备方案D切换
=================================================================
长期运行模式:
  - asyncio TCP Server :53002
  - 131 portproxy: 53002 → 11.66.191.155:53002
  - 完整日志 + 状态 API
  - 支持方案D逐个RTU切换

方案D 切换流程:
  1. 确认 RTU 列表 (从 Oracle 获取)
  2. 选一台测试 RTU → 改连 :53002 (通过 DTU 管理平台/远程配置)
  3. 对比 Oracle 数据 vs dgiot_lite 直采 → 偏差 < 0.1%
  4. 扩大切换范围 → 最终全部切到 :53002
  5. 停 CommBridge (保持回退能力)

用法:
  python tools/方案C_server.py              # 前台运行
  python tools/方案C_server.py --daemon     # 后台运行
  python tools/方案C_server.py --status     # 查看状态
"""
import asyncio, sys, os, time, json, logging, signal
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from src.protocols.commbridge_server import CommBridgeServer, DEVICE_TYPES, COEFFICIENTS

# ═══════════════════════ 配置 ═══════════════════════

HOST = "0.0.0.0"
PORT = 53002
LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(name)-14s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / "commbridge_server.log", encoding='utf-8'),
        logging.StreamHandler(sys.stdout),
    ]
)
log = logging.getLogger("方案C")

# ═══════════════════════ 统计收集器 ═══════════════════════

class StatsCollector:
    def __init__(self):
        self.start_time = time.time()
        self.total_connections = 0
        self.total_disconnections = 0
        self.total_polls = 0
        self.total_errors = 0
        self.rtu_stats = {}  # dtu_id -> {polls, errors, last_seen, values}

    def emit(self, key, **payload):
        dtu_id = payload.get('dtu_id', '?')

        if 'connected' in key:
            self.total_connections += 1
            self.rtu_stats[dtu_id] = {
                'polls': 0, 'errors': 0,
                'connected_at': time.time(),
                'last_seen': time.time(),
                'values': {},
            }
            log.info(f"[CONNECT] {dtu_id} @ {payload.get('ip','?')} "
                     f"(#{self.total_connections})")

        elif 'data.received' in key:
            self.total_polls += 1
            if dtu_id in self.rtu_stats:
                self.rtu_stats[dtu_id]['polls'] += 1
                self.rtu_stats[dtu_id]['last_seen'] = time.time()
                self.rtu_stats[dtu_id]['values'] = payload.get('values', {})

        elif 'disconnected' in key:
            self.total_disconnections += 1
            if dtu_id in self.rtu_stats:
                r = self.rtu_stats[dtu_id]
                duration = time.time() - r['connected_at']
                log.info(f"[DISCONNECT] {dtu_id} polls={r['polls']} "
                         f"errors={r['errors']} uptime={duration:.0f}s")

    def status(self):
        elapsed = time.time() - self.start_time
        active = sum(1 for r in self.rtu_stats.values()
                    if time.time() - r['last_seen'] < 60)
        return {
            'uptime': round(elapsed, 0),
            'connections_total': self.total_connections,
            'disconnections_total': self.total_disconnections,
            'polls_total': self.total_polls,
            'errors_total': self.total_errors,
            'active_rtus': active,
            'rtu_details': {
                dtu_id: {
                    'polls': r['polls'],
                    'last_seen': round(time.time() - r['last_seen'], 0),
                    'sample': {k: round(v, 4) for k, v in list(r['values'].items())[:5]},
                }
                for dtu_id, r in self.rtu_stats.items()
                if time.time() - r['last_seen'] < 300
            }
        }

stats = StatsCollector()

# ═══════════════════════ 预注册设备 (从 Oracle 加载) ═══════════════════════

# 方案D 切换用: 维护一个 RTU 迁移清单
MIGRATION_PLAN = {
    # "dtu_id": {"oracle_device_name": "xxx", "status": "commbridge|dgiot_lite|testing"}
}

def load_devices_from_oracle():
    """从 Oracle 加载 Standard_Umodbus 设备列表"""
    try:
        sys.path.insert(0, str(Path(__file__).parent.parent))
        from oracle_reader import OracleReader
        reader = OracleReader()
        r = reader.query(
            "SELECT DEVNAME, DEVADDR, DEVICEINDEX, PARAM "
            "FROM PROJECT_DEVICEPAR WHERE DEVTYPE='Standard_Umodbus'"
        )
        for row in r.get('rows', []):
            devname = row.get('DEVNAME', '')
            devaddr = row.get('DEVADDR', '')
            if devname:
                MIGRATION_PLAN[devname] = {
                    'oracle_addr': devaddr,
                    'device_index': row.get('DEVICEINDEX', ''),
                    'status': 'commbridge',  # 初始都在 CommBridge
                }
        log.info(f"从 Oracle 加载了 {len(MIGRATION_PLAN)} 台设备到迁移清单")
    except Exception as e:
        log.warning(f"Oracle 加载失败 (将用空清单): {e}")

# ═══════════════════════ 主服务 ═══════════════════════

async def main():
    print("=" * 70)
    print("  方案C — dgiot_lite CommBridge TCP Server")
    print(f"  监听: {HOST}:{PORT}")
    print(f"  转发: 11.66.12.131:{PORT} → 11.66.191.155:{PORT}")
    print(f"  日志: {LOG_DIR / 'commbridge_server.log'}")
    print("=" * 70)

    # 加载设备
    load_devices_from_oracle()

    # 启动服务器
    server = CommBridgeServer(
        event_bus=stats,
        port=PORT,
        host=HOST,
        poll_interval=1.0,
        heartbeat_timeout=120,
        max_connections=200,
    )

    # 注册已知设备配置
    for dtu_id, cfg in MIGRATION_PLAN.items():
        server.register_device(dtu_id, {
            'oracle_addr': cfg.get('oracle_addr', ''),
            'status': cfg.get('status', 'commbridge'),
        })

    await server.start()
    log.info(f"Server 已启动 — 等待 RTU 连接")

    # 定期状态报告
    tick = 0
    try:
        while True:
            await asyncio.sleep(60)
            tick += 1
            s = stats.status()
            log.info(f"[STATUS #{tick}] active={s['active_rtus']} "
                     f"polls={s['polls_total']} errors={s['errors_total']} "
                     f"uptime={s['uptime']}s")
    except KeyboardInterrupt:
        log.info("收到停止信号")
    finally:
        await server.stop()
        log.info("Server 已停止")


if __name__ == "__main__":
    asyncio.run(main())
