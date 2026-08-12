@echo off
chcp 65001 >nul
title 131 模拟开发环境 — DG-IoT
cd /d "%~dp0"
python dev_env.py
pause
