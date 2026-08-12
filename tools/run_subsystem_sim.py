#!/usr/bin/env python3
"""快捷启动: 设备完整性子系统模拟器"""
import os, sys, subprocess
script = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "..", "..", "svn_work", "项目投标", "某工业基地", "08_交付", "设备完整性", "04-模拟环境", "subsystem_simulator.py")
script = os.path.normpath(script)
if os.path.exists(script):
    os.execv(sys.executable, [sys.executable, script] + sys.argv[1:])
else:
    print(f"模拟器未找到: {script}")
    print("请先在设备完整性项目中配置模拟环境")

