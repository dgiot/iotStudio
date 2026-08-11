@echo off
echo === dgiot_lite 一键部署 ===

echo [1/4] 构建前端...
cd /d D:\ai\dgiot_lite\frontend-vue
call npx vite build --outDir dist 2>&1 | find "built"
if %errorlevel% neq 0 (echo build FAIL && exit /b 1)

echo [2/4] 部署前端到云端...
scp -r dist\* root@81.69.19.157:/usr/share/nginx/html/dgiot-lite/
echo [3/4] 部署后端到云端...
scp mock_server.py root@81.69.19.157:/data/dgiot/
scp -r src\* root@81.69.19.157:/data/dgiot/src/
echo [4/4] 重启云端服务...
ssh root@81.69.19.157 "fuser -k 8000/tcp 2>nul; sleep 1; cd /data/dgiot && nohup python3 mock_server.py --port 8000 > /tmp/dgiot.log 2>&1 & /data/dgiot/nginx/sbin/nginx -s reload 2>nul || /data/dgiot/nginx/sbin/nginx -c /data/dgiot/nginx/conf/nginx.conf 2>nul"

echo === 验证 ===
timeout /t 3 /nobreak >nul
curl -s http://dev.dgiotcloud.cn:5180/api/health
echo.
echo === 完成 ===
start http://dev.dgiotcloud.cn:5180
