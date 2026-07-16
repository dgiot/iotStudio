#!/usr/bin/env python3
"""快捷启动: 有叶云油液数据采集器"""
import os, sys
script = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "..", "..", "svn_work", "项目投标", "大庆油田", "08_交付", "设备完整性", "04-模拟环境", "youyeyun_collector.py"))
if os.path.exists(script):
    os.execv(sys.executable, [sys.executable, script] + sys.argv[1:])
else:
    print(f"采集器未找到: {script}")

