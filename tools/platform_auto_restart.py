#!/usr/bin/env python3
"""本地平台自恢复 — 检测崩溃后自动重启"""
import subprocess, time, sys

def check():
    import urllib.request
    try:
        r = urllib.request.urlopen("http://127.0.0.1:8000/api/health", timeout=5)
        return r.status == 200
    except: return False

if __name__ == '__main__':
    if not check():
        print(f"[{time.strftime('%H:%M:%S')}] DOWN — restarting...")
        # 只杀占用8000端口的进程，避免误伤其他Python
        subprocess.run('for /f "tokens=5" %a in (\'netstat -ano ^| findstr :8000 ^| findstr LISTENING\') do taskkill /F /PID %a 2>nul', shell=True, capture_output=True)
        time.sleep(2)
        subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"],
            cwd="D:/ai/dgiot_lite")
        time.sleep(5)
        if check(): print("RECOVERED")
        else: print("STILL DOWN")
    else:
        print(f"[{time.strftime('%H:%M:%S')}] OK")
