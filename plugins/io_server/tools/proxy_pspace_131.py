"""
在 131 上部署 TCP 代理，截获 RTDB 协议帧
131 → proxy :19999 → 130:8889 → 记录所有帧 → 转发
"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# Python proxy script to run on 131
proxy_py = r'''
import socket, threading, time, struct

LOG = []
TARGET = ("192.168.10.130", 8889)
LISTEN = ("0.0.0.0", 19999)

def handle_client(conn, addr):
    try:
        target = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        target.settimeout(30)
        target.connect(TARGET)

        def forward(src, dst, label):
            while True:
                try:
                    data = src.recv(4096)
                    if not data: break
                    ts = time.strftime("%H:%M:%S")
                    LOG.append({"ts": ts, "dir": label, "hex": data.hex(), "len": len(data)})
                    dst.send(data)
                except: break

        t1 = threading.Thread(target=forward, args=(conn, target, "C2S"), daemon=True)
        t2 = threading.Thread(target=forward, args=(target, conn, "S2C"), daemon=True)
        t1.start(); t2.start()
        t1.join(timeout=30); t2.join(timeout=30)
    except: pass
    finally:
        conn.close()

srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
srv.bind(LISTEN)
srv.listen(1)
srv.settimeout(20)
print(f"Proxy {LISTEN} -> {TARGET}")

try:
    conn, addr = srv.accept()
    print(f"Client: {addr}")
    handle_client(conn, addr)
except socket.timeout:
    pass

# Dump captured frames
import json
with open(r"C:\Users\Administrator\rtdb_frames.json", "w") as f:
    json.dump(LOG, f, indent=2)
print(f"Frames: {len(LOG)}")
for i, pkt in enumerate(LOG[:20]):
    h = " ".join(pkt["hex"][j:j+2] for j in range(0, min(len(pkt["hex"]), 80), 2))
    print(f"  [{pkt['ts']}] {pkt['dir']:3s} | {h}")
'''

# Encode and transfer
b64 = base64.b64encode(proxy_py.encode()).decode()
r = s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\proxy_rtdb.py', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

# Run the proxy (它只会接受1个连接用于测试)
print("Starting proxy on 131...")
r = s.run_cmd('C:\\Users\\Administrator\\opc_portable\\python.exe C:\\Users\\Administrator\\proxy_rtdb.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('ERR:', err[:300])

# Check captured frames
print("\n=== RTDB frames captured ===")
r = s.run_cmd('type C:\\Users\\Administrator\\rtdb_frames.json 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip()[:2000])
