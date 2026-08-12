@echo off
chcp 65001 >nul
title 协议模拟器 — Modbus TCP / IEC104 / OPC UA

echo.
echo ╔══════════════════════════════════════════╗
echo ║   物联网协议模拟器 — 全启动              ║
echo ╠══════════════════════════════════════════╣
echo ║  Modbus TCP  ── :502  光伏逆变器         ║
echo ║  Modbus TCP  ── :1502 储能PCS            ║
echo ║  Modbus TCP  ── :2502 充电桩             ║
echo ║  IEC 104     ── :2404 储能PCS(站控层)    ║
echo ║  OPC UA      ── :4840 充电桩+环境传感器   ║
echo ╚══════════════════════════════════════════╝
echo.
echo   按 Ctrl+C 停止全部
echo.

cd /d "%~dp0"
python simulators/run_all.py
pause
