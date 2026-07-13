#!/usr/bin/env python3
"""
CommBridge TCP Server — PyInstaller 入口
==========================================
打包命令: pyinstaller --onefile --name commbridge_server entry_commbridge.py
部署: 上传到 131, 运行 commbridge_server.exe (后台)

端口: 53002 (不影响 CommBridge:53001)
日志: commbridge.log (同目录)
"""
import asyncio, sys, os, time, logging, json
from pathlib import Path

# 添加 src 到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# already in project root

from src.protocols.commbridge_server import CommBridgeServer, DEVICE_TYPES, COEFFICIENTS

# ═══════════════ 配置 ═══════════════
HOST = os.environ.get("CB_HOST", "0.0.0.0")
PORT = int(os.environ.get("CB_PORT", "53002"))
LOG_FILE = os.environ.get("CB_LOG", os.path.join(os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else os.path.dirname(__file__), "commbridge.log"))

# ═══════════════ 日志 ═══════════════
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE, encoding='utf-8'),
        logging.StreamHandler(sys.stdout),
    ]
)
log = logging.getLogger("commbridge")

# ═══════════════ 统计 ═══════════════
start_time = time.time()
stats = {"connects": 0, "disconnects": 0, "polls": 0, "errors": 0, "rtus": {}}

class Collector:
    def emit(self, key, **kw):
        dtu = kw.get('dtu_id', '?')
        if 'connected' in key:
            stats['connects'] += 1
            stats['rtus'][dtu] = {'polls': 0, 'errors': 0, 'since': time.time()}
            log.info(f"[CONNECT] {dtu} @ {kw.get('ip','?')} (total:{stats['connects']})")
        elif 'data.received' in key:
            stats['polls'] += 1
            if dtu in stats['rtus']:
                stats['rtus'][dtu]['polls'] += 1
        elif 'disconnected' in key:
            stats['disconnects'] += 1
            p = stats['rtus'].pop(dtu, {}).get('polls', 0)
            log.info(f"[DISCONNECT] {dtu} polls={p} (total:{stats['disconnects']})")

    def status(self):
        elapsed = time.time() - start_time
        return {
            'uptime_seconds': round(elapsed),
            'connects': stats['connects'],
            'disconnects': stats['disconnects'],
            'polls': stats['polls'],
            'active_rtus': sum(1 for r in stats['rtus'].values() if time.time() - r.get('since', 0) < 120),
        }

collector = Collector()

# ═══════════════ 主函数 ═══════════════
async def run():
    log.info(f"CommBridge TCP Server starting on {HOST}:{PORT}")
    log.info(f"Log: {LOG_FILE}")

    server = CommBridgeServer(
        event_bus=collector,
        port=PORT,
        host=HOST,
        poll_interval=1.0,
        heartbeat_timeout=120,
        max_connections=200,
    )
    await server.start()
    log.info(f"Server started — listening on {HOST}:{PORT}")

    # 定期状态
    tick = 0
    while True:
        await asyncio.sleep(60)
        tick += 1
        s = collector.status()
        log.info(f"[STATUS #{tick}] uptime={s['uptime_seconds']}s "
                 f"active={s['active_rtus']} polls={s['polls']}")
        # 写状态文件
        status_path = os.path.join(os.path.dirname(LOG_FILE), 'commbridge_status.json')
        try:
            with open(status_path, 'w') as f:
                json.dump(s, f)
        except:
            pass

def main():
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        log.info("Stopped by user")
    except Exception as e:
        log.error(f"Fatal: {e}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
