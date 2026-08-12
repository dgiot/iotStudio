@echo off
chcp 65001 >nul
title pythonIot 物联网平台

echo.
echo ╔══════════════════════════════════════════╗
echo ║   光储充微电网物联网平台  V1.0           ║
echo ║   DGIOT LLC (Dallas, TX)              ║
echo ╚══════════════════════════════════════════╝
echo.
echo   管理后台: http://localhost:8000
echo   API文档:  http://localhost:8000/docs
echo.
echo   按 Ctrl+C 停止
echo.

cd /d "%~dp0"
python run.py
pause
