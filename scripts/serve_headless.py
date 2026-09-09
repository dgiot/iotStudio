"""无头启动入口 (run.py 会弹浏览器, 冒烟/演示用)"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from src.config import cfg
from src.main import app

uvicorn.run(app, host=cfg.host, port=cfg.port, log_level="warning")
