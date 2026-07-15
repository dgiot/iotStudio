@echo off
echo ============================================
echo   DG-IoT 边缘代理 — 一键启动
echo ============================================
echo.

REM 1. 启动边缘代理 (FastAPI :8000)
echo [1] Starting edge agent :8000...
start "Edge-Agent" python -m uvicorn src.main:app --host 0.0.0.0 --port 8000
timeout /t 3 /nobreak >nul

REM 2. 启动模拟环境 (IO Server :53002-18889)
echo [2] Starting IO simulator...
start "IO-Sim" python plugins/io_server/tools/dev_env.py --scale 10
timeout /t 5 /nobreak >nul

REM 3. 验证
echo [3] Verifying...
python -c "
import urllib.request, socket, json
# Edge Agent
try:
    r=urllib.request.urlopen('http://127.0.0.1:8000/api/health',timeout=3)
    d=json.loads(r.read())
    print(f'  [OK] Edge Agent :8000 — {d[\"devices\"][\"total\"]} devices')
except: print('  [FAIL] Edge Agent :8000')

# IO Sim
for p, name in [(53002,'CommBridge'),(9002,'IoMonitor'),(9003,'IoCommit'),
                 (18889,'pSpace'),(13500,'OPC DA'),(502,'Modbus')]:
    try:
        s=socket.create_connection(('127.0.0.1',p),timeout=1); s.close()
        print(f'  [OK] {name} :{p}')
    except: print(f'  [OFF] {name} :{p}')
"

echo.
echo ============================================
echo   边缘代理已就绪
echo   Platform: http://localhost:8000
echo   Admin:    http://localhost:8000/docs
echo   Ontology: http://localhost:8000/ontology.html
echo ============================================
pause
