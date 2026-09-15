# ============================================================
# pythonIot — 启动入口
# ============================================================
import sys, os, io, traceback, time
from pathlib import Path
import argparse

# 命令行覆盖 —— 无参数时行为与从前完全一致（全部回落到 config.yaml）。
# 装配脚本要在一台机器上按指定端口起多个实例，不能为此各写一份 config.yaml。
_ap = argparse.ArgumentParser(
    prog="run.py", description="DG-IoT iotStudio 启动器（不传参则用 config.yaml）")
_ap.add_argument("--host", default=None, help="覆盖 config.yaml 的 host")
_ap.add_argument("--port", type=int, default=None, help="覆盖 config.yaml 的 port")
_ap.add_argument("--no-browser", action="store_true",
                 help="不自动打开浏览器（服务端 / 无人值守装配时用）")
_ARGS, _ = _ap.parse_known_args()

# ===== 启动日志（窗口闪退时可通过此文件排查） =====
_LOG_DIR = Path(sys.executable).parent / "logs" if getattr(sys, 'frozen', False) else Path(__file__).parent / "logs"
_LOG_DIR.mkdir(exist_ok=True)
_LOG_FILE = _LOG_DIR / f"startup_{time.strftime('%Y%m%d_%H%M%S')}.log"

class _TeeOutput:
    """同时输出到控制台和日志文件"""
    def __init__(self, filepath, original):
        self.f = open(filepath, 'w', encoding='utf-8')
        self.original = original
    def write(self, data):
        self.f.write(data); self.f.flush()
        self.original.write(data)
    def flush(self):
        self.f.flush(); self.original.flush()
    def isatty(self):
        return self.original.isatty() if hasattr(self.original, 'isatty') else False

sys.stdout = _TeeOutput(_LOG_FILE, sys.stdout)
sys.stderr = _TeeOutput(_LOG_FILE, sys.stderr)

print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] iotStudio 启动...")
print(f"  exe={sys.executable}")
print(f"  cwd={os.getcwd()}")
print(f"  log={_LOG_FILE}")

try:
    import threading, subprocess, webbrowser
    import uvicorn
    from src.config import cfg
    from src.main import app

    host = _ARGS.host or cfg.host
    port = _ARGS.port or cfg.port
    print(f"  host={host}:{port}")
    print(f"  storage={getattr(cfg, 'storage_mode', 'parse')}")
    print(f"  data_dir={cfg.data_dir}")
    if _ARGS.host or _ARGS.port:
        print(f"  (命令行覆盖 config.yaml 的 host={cfg.host} port={cfg.port})")
    sys.stdout.flush()

    # 启动 Chrome 全屏（延迟 3 秒等 uvicorn 就绪）
    def _launch_browser():
        time.sleep(3)
        url = f"http://127.0.0.1:{port}"
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        ]
        for cp in chrome_paths:
            if os.path.exists(cp):
                subprocess.Popen([cp, f"--app={url}", "--start-fullscreen", "--disable-infobars"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"  Chrome 已启动: {url}")
                return
        webbrowser.open(url)
        print(f"  默认浏览器已打开: {url}")

    if not _ARGS.no_browser:
        threading.Thread(target=_launch_browser, daemon=True).start()

    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
        log_level=cfg.log_level.lower(),
    )
except Exception as e:
    traceback.print_exc()
    err = str(e)
    if '10048' in err or 'address already in use' in err.lower():
        print(f"\n  ⚠ 端口 {_ARGS.port or 'config.yaml 指定值'} 已被占用，请先关闭已运行的实例\n")
    else:
        print(f"\n  启动失败: {err}\n")
    print(f"  详细日志: {_LOG_FILE}")
    os.system("pause")
    sys.exit(1)
