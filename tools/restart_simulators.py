#!/usr/bin/env python3
"""重启全部模拟器 + 验证端口"""
import subprocess, sys, time, os, signal, socket

def port_open(host, port, timeout=2):
    s = socket.socket()
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.close()
        return True
    except: return False

# Kill ALL python processes that are simulators
os.system("taskkill /F /PID 20388 2>nul")
os.system("taskkill /F /PID 26676 2>nul")
os.system("taskkill /F /PID 10912 2>nul")
time.sleep(2)

# Start simulators
proc = subprocess.Popen(
    [sys.executable, 'simulators/run_all.py'],
    cwd='D:/ai/dgiot_lite',
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    text=True
)
time.sleep(5)

# Print output and check ports
for _ in range(5):
    try:
        line = proc.stdout.readline()
        if line: print(line.strip())
    except: break

print(f"\nSimulator PID: {proc.pid}")
for port, name in [(502,"Modbus TCP 逆变器"), (1502,"Modbus TCP PCS"),
                    (2502,"Modbus TCP 充电桩"), (2404,"IEC 104"),
                    (4840,"OPC UA"), (9090,"OPC DA"), (8889,"A11")]:
    ok = port_open("127.0.0.1", port)
    print(f"  {'✅' if ok else '❌'} {name} :{port}")
