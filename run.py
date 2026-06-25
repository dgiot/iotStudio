# ============================================================
# pythonIot — 启动入口
# ============================================================
import uvicorn
from src.config import cfg

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=cfg.host,
        port=cfg.port,
        reload=False,
        log_level=cfg.log_level.lower(),
    )
