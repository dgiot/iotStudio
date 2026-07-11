@echo off
chcp 65001 >nul
echo OPC DA Collector for dgiot_lite
echo ================================
cd /d %~dp0
powershell -ExecutionPolicy Bypass -File "%~dp0opc_collector.ps1" -DgiotHost "127.0.0.1:8000" -Interval 10
pause
