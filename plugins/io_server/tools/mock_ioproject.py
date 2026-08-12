#!/usr/bin/env python3
"""
Mock IoProject — 模拟 IoProject 的 IPC 环境，启动 IOMan 并观察交互报文

模拟内容:
  1. 注册 IoMonitor 窗口类 (FindWindowA 可查)
  2. 创建 Global\ 命名共享内存
  3. 创建互斥体/事件 (CMutualEvent)
  4. 启动 IOMan.exe 并捕获其行为
  5. 记录 WM_COPYDATA 报文
"""
import ctypes, struct, subprocess, time, os, sys, json, threading
from ctypes import wintypes
from pathlib import Path

DIR = Path(r"D:\ai\io服务器分析\IO ServerOnLine")

# ═══════════════════════════════════════════════════════════
# Win32 API
# ═══════════════════════════════════════════════════════════
kernel32 = ctypes.windll.kernel32
user32 = ctypes.windll.user32

WM_COPYDATA = 0x004A
WM_DESTROY = 0x0002
CW_USEDEFAULT = 0x80000000

# Shared memory
PAGE_READWRITE = 0x04
FILE_MAP_ALL_ACCESS = 0x000F001F
INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value

# Window class
class WNDCLASSEXA(ctypes.Structure):
    _fields_ = [
        ("cbSize", ctypes.c_uint),
        ("style", ctypes.c_uint),
        ("lpfnWndProc", ctypes.c_void_p),
        ("cbClsExtra", ctypes.c_int),
        ("cbWndExtra", ctypes.c_int),
        ("hInstance", ctypes.c_void_p),
        ("hIcon", ctypes.c_void_p),
        ("hCursor", ctypes.c_void_p),
        ("hbrBackground", ctypes.c_void_p),
        ("lpszMenuName", ctypes.c_char_p),
        ("lpszClassName", ctypes.c_char_p),
        ("hIconSm", ctypes.c_void_p),
    ]

class COPYDATASTRUCT(ctypes.Structure):
    _fields_ = [
        ("dwData", ctypes.c_void_p),
        ("cbData", ctypes.c_uint),
        ("lpData", ctypes.c_void_p),
    ]

# Message log
msg_log = []

def create_shared_memory(name, size=65536):
    """创建 Global\ 命名共享内存"""
    full_name = f"Global\\{name}"
    try:
        h = kernel32.CreateFileMappingA(
            INVALID_HANDLE_VALUE, None, PAGE_READWRITE,
            0, size, full_name.encode()
        )
        if h:
            # 先尝试 OpenFileMapping 检查是否已存在
            err = kernel32.GetLastError()
            existed = (err == 183)  # ERROR_ALREADY_EXISTS
            buf = kernel32.MapViewOfFile(h, FILE_MAP_ALL_ACCESS, 0, 0, size)
            return h, buf, existed
    except:
        pass
    return None, None, False

def create_mutex(name):
    """创建命名互斥体"""
    full_name = f"Global\\{name}"
    h = kernel32.CreateMutexA(None, False, full_name.encode())
    return h

def create_event(name):
    """创建命名事件"""
    full_name = f"Global\\{name}"
    h = kernel32.CreateEventA(None, False, False, full_name.encode())
    return h


# ═══════════════════════════════════════════════════════════
# Mock 窗口过程
# ═══════════════════════════════════════════════════════════
WNDPROC = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, ctypes.c_uint,
                              ctypes.c_void_p, ctypes.c_void_p)

@WNDPROC
def mock_wnd_proc(hwnd, msg, wparam, lparam):
    if msg == WM_COPYDATA:
        cds = COPYDATASTRUCT.from_address(lparam)
        data_bytes = ctypes.string_at(cds.lpData, cds.cbData)
        record = {
            "time": time.strftime("%H:%M:%S.%f")[:-3],
            "dwData": hex(cds.dwData) if cds.dwData else "0",
            "cbData": cds.cbData,
            "hex": data_bytes.hex() if cds.cbData < 1024 else f"{data_bytes[:512].hex()}...({cds.cbData} bytes)",
            "ascii": data_bytes.decode('gbk', errors='replace') if all(32 <= b < 127 or b in (10, 13) for b in data_bytes) else "(binary)",
        }
        msg_log.append(record)
        print(f"  [WM_COPYDATA] dwData={record['dwData']} cbData={cds.cbData} "
              f"hex={data_bytes[:64].hex()}{'...' if cds.cbData > 64 else ''}")
        return 1
    elif msg == WM_DESTROY:
        user32.PostQuitMessage(0)
        return 0
    return user32.DefWindowProcA(hwnd, msg, wparam, lparam)


# ═══════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════
def main():
    print("=== Mock IoProject — IOMan IPC Observer ===\n")

    # 1. Create shared memory (psGuardMMapFile is what RTDB SDK checks)
    print("[1] Creating shared memory...")
    for name, size in [("psGuardMMapFile", 65536), ("psTrayMMapFile", 4096),
                       ("IO12345678", 65536),  # matches our test ID
                       ]:
        h, buf, existed = create_shared_memory(name, size)
        status = "existed" if existed else ("created" if h else "FAILED")
        print(f"  Global\\{name}: {status} ({size} bytes)")

    # 2. Create sync objects
    print("\n[2] Creating sync objects...")
    for i in range(4):
        create_mutex(f"CMutualEvent{i}")
        create_event(f"CMutualEvent{i}")
    print(f"  Created 4x mutex + 4x event")

    # 3. Register mock IoMonitor window
    print("\n[3] Registering mock IoMonitor window...")
    hInstance = kernel32.GetModuleHandleA(None)

    # Try several possible class names that IOMan might search for
    class_names = ["IoMonitor", "#32770", "Afx:400000:8:10011:0:0", "AfxFrameOrView42s"]
    hwnds = {}
    for cls_name in class_names:
        try:
            wnd_class = WNDCLASSEXA()
            wnd_class.cbSize = ctypes.sizeof(WNDCLASSEXA)
            wnd_class.lpfnWndProc = ctypes.cast(mock_wnd_proc, ctypes.c_void_p)
            wnd_class.hInstance = hInstance
            wnd_class.lpszClassName = cls_name.encode()

            atom = user32.RegisterClassExA(ctypes.byref(wnd_class))
            if atom:
                hwnd = user32.CreateWindowExA(
                    0, cls_name.encode(), cls_name.encode(),
                    0, 0, 0, 400, 300,
                    None, None, hInstance, None
                )
                if hwnd:
                    hwnds[cls_name] = hwnd
                    print(f"  Window '{cls_name}': hwnd=0x{hwnd:08X}")
                else:
                    print(f"  Window '{cls_name}': RegisterClass OK but CreateWindow failed ({kernel32.GetLastError()})")
        except Exception as e:
            print(f"  Window '{cls_name}': {e}")

    # Get the primary hwnd for command line
    primary_hwnd = list(hwnds.values())[0] if hwnds else 1
    print(f"  Using primary hwnd=0x{primary_hwnd:08X}")

    # 4. Launch IOMan
    print("\n[4] Launching IOMan.exe...")
    shared_mem_id = 0x12345678
    dev_ids = ["02204060100", "02204060111", "02204060200"]
    cmd_args = (
        f"IO{shared_mem_id:08X},{primary_hwnd:08X},1,IOCommitDB0,{len(dev_ids)}:{','.join(dev_ids)}"
    )
    cmd = [str(DIR / "IOMan.exe"), "-aaa", cmd_args]
    print(f"  CMD: {' '.join(cmd)}")

    try:
        p = subprocess.Popen(
            cmd, cwd=str(DIR),
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        )
        print(f"  Started PID: {p.pid}")

        # 5. Message loop — process WM_COPYDATA for up to 10s
        print("\n[5] Listening for WM_COPYDATA (10s timeout)...")
        msg = ctypes.wintypes.MSG()
        start = time.time()
        while time.time() - start < 10:
            # Check if IOMan exited
            ret = p.poll()
            if ret is not None:
                print(f"  IOMan exited with code {ret} after {time.time()-start:.1f}s")
                break

            # Pump messages (non-blocking)
            if user32.PeekMessageA(ctypes.byref(msg), 0, 0, 0, 1):  # PM_REMOVE
                user32.TranslateMessage(ctypes.byref(msg))
                user32.DispatchMessageA(ctypes.byref(msg))

            time.sleep(0.05)

        if p.poll() is None:
            print(f"  IOMan still running after 10s — killing")
            p.kill()

    except Exception as e:
        print(f"  Error: {e}")

    # Summary
    print(f"\n[6] Results: {len(msg_log)} WM_COPYDATA messages captured")
    if msg_log:
        for i, m in enumerate(msg_log):
            print(f"  [{i}] {m['time']} dwData={m['dwData']} cbData={m['cbData']}")
            print(f"      hex={m['hex'][:120]}")

    # Cleanup
    for hwnd in hwnds.values():
        user32.DestroyWindow(hwnd)
    print("\nDone")


if __name__ == "__main__":
    main()
