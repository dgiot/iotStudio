#!/usr/bin/env python3
"""psAPI ctypes 结构体逆向 — 传 psConnectPara 尝试连接"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# 用Python ctypes传结构体 — 比P/Invoke更灵活
script = r'''
import ctypes, struct

dll = ctypes.CDLL(r"E:\IO ServerOnLine\psAPISDK.dll")
dll.psAPI_Common_StartAPI.restype = ctypes.c_int
dll.psAPI_Server_Connect.restype = ctypes.c_int

print("StartAPI:", dll.psAPI_Common_StartAPI(b""))

# 猜测 psConnectPara 结构体布局
# 从 IOMan 反汇编: push 0x0A(10), 0x05(5), 0x56(86), eax...
# 可能是: {server[64], port, user[32], pwd[32], timeout, mode, ...}

class PsConnectPara(ctypes.Structure):
    _fields_ = [
        ("server", ctypes.c_char * 64),
        ("port", ctypes.c_int),
        ("user", ctypes.c_char * 32),
        ("password", ctypes.c_char * 32),
        ("timeout", ctypes.c_int),
        ("mode", ctypes.c_int),
        ("flags", ctypes.c_int),
        ("reserved", ctypes.c_int * 4),
    ]

cfg = PsConnectPara()
cfg.server = b"11.66.12.130"
cfg.port = 9004
cfg.user = b"admin"
cfg.password = b"admin888"
cfg.timeout = 10
cfg.mode = 5

# 尝试不同大小的结构体
for size in [160, 200, 240, 280]:
    buf = ctypes.create_string_buffer(size)
    ctypes.memmove(buf, ctypes.addressof(cfg), min(size, ctypes.sizeof(cfg)))
    try:
        ret = dll.psAPI_Server_Connect(ctypes.cast(buf, ctypes.c_void_p).value)
        print(f"Connect(size={size}): {ret}")
        if ret == 0: print(f"  SUCCESS!")
    except Exception as e:
        print(f"Connect(size={size}): crash - {e}")

# 也试试空指针
print(f"Connect(NULL): {dll.psAPI_Server_Connect(0)}")

# 试试 Net_ConnectServer
try:
    dll2 = ctypes.CDLL(r"E:\\\\IO ServerOnLine\\\\psAPISDK.dll")
    # ?Net_ConnectServer@@YGHPAUpsConnectPara@@PAG@Z
    # 需要导出的 mangled name
    print("Net_ConnectServer not directly callable")
except: pass

print("Done")
'''

b64 = base64.b64encode(script.encode('utf-8')).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\psapi_s.py', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\psapi_s.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err: print('ERR:', err[:500])
