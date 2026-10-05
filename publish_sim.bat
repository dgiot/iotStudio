@echo off
echo ============================================
echo   DG-IoT IO Server Simulator Publish
echo ============================================
echo.

REM 1. 启动模拟环境
echo [1] Starting IO Server Simulator...
start "edge-sim" python plugins/io_server/tools/dev_env.py --scale 10

REM 2. 等待启动
timeout /t 5 /nobreak >nul

REM 3. 验证
echo [2] Verifying services...
python -c "import socket; ports=[53002,9002,9003,9001,18889,13500,502]; [print(f'  :{p} OK' if socket.create_connection(('127.0.0.1',p),timeout=1) else f'  :{p} FAIL') for p in ports]"

echo.
echo [3] Simulator published:
echo   GENERIC_LEGACY_PROTO :53002
echo   GENERIC_HMI  :9002
echo   GENERIC_SVC_COMMIT   :9003
echo   GENERIC_SVC_PROJECT  :9001
echo   RTDB     :18889
echo   OPC DA     :13500
echo   Modbus     :502
echo.
echo ============================================
echo   Published. Access at localhost ports above.
echo ============================================
pause
