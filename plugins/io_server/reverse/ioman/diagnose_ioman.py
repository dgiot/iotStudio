"""快速诊断: IOMan 启动需要什么"""
import ctypes, struct, subprocess, time, os, sys
from ctypes import wintypes
from pathlib import Path

DIR = Path(r"D:\ai\io服务器分析\IO ServerOnLine")

kernel32 = ctypes.windll.kernel32
user32 = ctypes.windll.user32

# 正确类型
LPVOID = ctypes.c_void_p
HANDLE = wintypes.HANDLE
DWORD = wintypes.DWORD
LONG_PTR = ctypes.c_longlong if struct.calcsize("P") == 8 else ctypes.c_long
ULONG_PTR = wintypes.WPARAM
SIZE_T = ctypes.c_size_t

# 设置正确的 argtypes 避免 64→32 溢出
kernel32.CreateFileMappingA.argtypes = [HANDLE, LPVOID, DWORD, DWORD, DWORD, wintypes.LPCSTR]
kernel32.CreateFileMappingA.restype = HANDLE
kernel32.MapViewOfFile.argtypes = [HANDLE, DWORD, DWORD, DWORD, SIZE_T]
kernel32.MapViewOfFile.restype = LPVOID
kernel32.OpenFileMappingA.argtypes = [DWORD, wintypes.BOOL, wintypes.LPCSTR]
kernel32.OpenFileMappingA.restype = HANDLE

kernel32.CreateMutexA.argtypes = [LPVOID, wintypes.BOOL, wintypes.LPCSTR]
kernel32.CreateMutexA.restype = HANDLE
kernel32.CreateEventA.argtypes = [LPVOID, wintypes.BOOL, wintypes.BOOL, wintypes.LPCSTR]
kernel32.CreateEventA.restype = HANDLE

PAGE_READWRITE = 0x04
FILE_MAP_ALL_ACCESS = 0x000F001F
INVALID_HANDLE = HANDLE(-1).value  # 64-bit -1 as HANDLE

# ═══════════════════════════════════════════
# Step 1: 创建共享内存
# ═══════════════════════════════════════════
print("=== [1] Shared Memory ===")
results = {}
for name in [r"Global\psGuardMMapFile", r"Global\psTrayMMapFile",
             r"Global\IO12345678", r"Global\IO_RTDB"]:
    h = kernel32.CreateFileMappingA(
        wintypes.HANDLE(-1).value,  # INVALID_HANDLE_VALUE as 32-bit compatible
        None, PAGE_READWRITE, 0, 65536, name.encode()
    )
    err = kernel32.GetLastError()
    if h:
        p = kernel32.MapViewOfFile(h, FILE_MAP_ALL_ACCESS, 0, 0, 65536)
        results[name] = (h, p)
        print(f"  {name}: CREATED (h=0x{h:08X}, buf=0x{p:016X})")
    else:
        print(f"  {name}: FAILED err={err}")

# ═══════════════════════════════════════════
# Step 2: 创建互斥体/事件
# ═══════════════════════════════════════════
print("\n=== [2] Mutex/Event ===")
for i in range(4):
    for prefix, func in [("mutex recv ", kernel32.CreateMutexA),
                          ("CMutualEvent", kernel32.CreateEventA)]:
        name = f"Global\\{prefix}{i:X}" if "recv" in prefix else f"Global\\{prefix}{i}"
        h = func(None, False, name.encode())
        print(f"  {name}: {'OK' if h else 'FAIL'}")

# ═══════════════════════════════════════════
# Step 3: 创建模拟 IoMonitor 窗口
# ═══════════════════════════════════════════
print("\n=== [3] Mock IoMonitor Window ===")
WM_COPYDATA = 0x004A
msg_log = []

WNDPROC = ctypes.WINFUNCTYPE(LONG_PTR, HANDLE, ctypes.c_uint, wintypes.WPARAM, wintypes.LPARAM)

class COPYDATASTRUCT(ctypes.Structure):
    _fields_ = [
        ("dwData", LONG_PTR),
        ("cbData", DWORD),
        ("lpData", LPVOID),
    ]

@WNDPROC
def wnd_proc(hwnd, msg, wparam, lparam):
    if msg == WM_COPYDATA:
        cds = COPYDATASTRUCT.from_address(lparam)
        data = ctypes.string_at(cds.lpData, cds.cbData)
        print(f"  [WM_COPYDATA] dwData=0x{cds.dwData:08X} cbData={cds.cbData}")
        print(f"    hex={data[:128].hex()}")
        try:
            text = data.decode('gbk', errors='replace')
            if any(32 <= ord(c) < 127 for c in text):
                print(f"    text={text[:200]}")
        except: pass
        msg_log.append({"dwData": cds.dwData, "cbData": cds.cbData, "hex": data.hex()})
        return 1
    return user32.DefWindowProcW(hwnd, msg, wparam, lparam)

class WNDCLASSEXW(ctypes.Structure):
    _fields_ = [
        ("cbSize", ctypes.c_uint),
        ("style", ctypes.c_uint),
        ("lpfnWndProc", WNDPROC),
        ("cbClsExtra", ctypes.c_int),
        ("cbWndExtra", ctypes.c_int),
        ("hInstance", HANDLE),
        ("hIcon", HANDLE),
        ("hCursor", HANDLE),
        ("hbrBackground", HANDLE),
        ("lpszMenuName", wintypes.LPCWSTR),
        ("lpszClassName", wintypes.LPCWSTR),
        ("hIconSm", HANDLE),
    ]

hInstance = kernel32.GetModuleHandleW(None)
hwnds = {}

for cls_name in ["IoMonitor", "Static"]:
    wc = WNDCLASSEXW()
    wc.cbSize = ctypes.sizeof(WNDCLASSEXW)
    wc.lpfnWndProc = wnd_proc
    wc.hInstance = hInstance
    wc.hCursor = user32.LoadCursorW(0, 32512)  # IDC_ARROW
    wc.hbrBackground = 16  # COLOR_WINDOW + 1
    wc.lpszClassName = cls_name

    atom = user32.RegisterClassExW(ctypes.byref(wc))
    if atom:
        hwnd = user32.CreateWindowExW(0, cls_name, cls_name, 0,
                                       0, 0, 400, 300, 0, 0, hInstance, 0)
        hwnds[cls_name] = hwnd
        print(f"  '{cls_name}': atom={atom} hwnd=0x{hwnd:08X}")
    else:
        err = kernel32.GetLastError()
        # 如果已注册就用 FindWindow
        if err == 1410:  # ERROR_CLASS_ALREADY_EXISTS
            hwnd = user32.FindWindowW(cls_name, None)
            hwnds[cls_name] = hwnd
            print(f"  '{cls_name}': found existing hwnd=0x{hwnd:08X}" if hwnd else f"  '{cls_name}': not found")
        else:
            print(f"  '{cls_name}': RegisterClassEx FAILED err={err}")

# ═══════════════════════════════════════════
# Step 4: 启动 IOMan
# ═══════════════════════════════════════════
print("\n=== [4] Launch IOMan ===")
hwnd_val = list(hwnds.values())[0] or 0
shared_id = 0x12345678
dev_ids = ["02204060100", "02204060111", "02204060200"]
cmd_args = f"IO{shared_id:08X},{hwnd_val:08X},1,IOCommitDB0,{len(dev_ids)}:{','.join(dev_ids)}"
cmd = [str(DIR / "IOMan.exe"), "-aaa", cmd_args]
print(f"  {cmd_args}")

p = subprocess.Popen(cmd, cwd=str(DIR), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(f"  PID: {p.pid}")

# ═══════════════════════════════════════════
# Step 5: 消息循环
# ═══════════════════════════════════════════
print("\n=== [5] Message Loop (10s) ===")
msg = wintypes.MSG()
start = time.time()
while time.time() - start < 10:
    ret = p.poll()
    if ret is not None:
        print(f"  IOMan exited code={ret} after {time.time()-start:.1f}s")
        break
    # PeekMessage non-blocking
    if user32.PeekMessageW(ctypes.byref(msg), 0, 0, 0, 1):
        user32.TranslateMessage(ctypes.byref(msg))
        user32.DispatchMessageW(ctypes.byref(msg))
    time.sleep(0.02)

if p.poll() is None:
    p.kill()
    print("  IOMan killed after 10s")

print(f"\n=== Results: {len(msg_log)} WM_COPYDATA messages ===")
for m in msg_log:
    print(f"  dwData=0x{m['dwData']:08X} cbData={m['cbData']}")

# Cleanup
for hwnd in hwnds.values():
    if hwnd:
        user32.DestroyWindow(hwnd)
