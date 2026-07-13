@echo off
REM 批量扫描 pSpace Tag ID 空间 — 每次30秒间隔避免限流
REM 用法: scan_all_tags.bat > tag_map.txt
set PYTHON=C:\Python311-32\python.exe
set TOOL=D:\ai\dgiot_lite\tools\pspace_collector.py

echo === pSpace Tag ID 全量扫描 ===
echo Started: %date% %time%
echo.

REM 分批次读取: 每批3个Tag，间隔30秒
FOR /L %%B IN (1000,500,20000) DO (
    set /a A=%%B
    set /a B=%%B+1
    set /a C=%%B+2
    echo [%time%] Reading %A%,%B%,%C%...
    %PYTHON% %TOOL% --ids "%A%,%B%,%C%" 2>nul
    echo.
    timeout /t 30 /nobreak >nul
)
echo Done: %date% %time%
