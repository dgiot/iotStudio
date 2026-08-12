"""
psAPI OPC DA 主动采集器 — 32位 EXE 入口
===========================================
用 ctypes 调 psAPISDK.dll, 连 RTDB 读 OPC 数据

打包: 32位 Python + PyInstaller
  pyinstaller --onefile --name opc_collector opc_psapi_collector.py
"""
import ctypes, struct, time, json, sys, os

DLL_PATH = r"E:\IO ServerOnLine\psAPISDK.dll"

def load_dll():
    dll = ctypes.CDLL(DLL_PATH)
    dll.psAPI_Common_StartAPI.restype = ctypes.c_int
    dll.psAPI_Server_Connect.restype = ctypes.c_int
    dll.psAPI_Real_ReadList.restype = ctypes.c_int
    return dll

def try_connect(dll, ip: str, port: int, user: str, pwd: str):
    """尝试各种参数组合连接 RTDB"""
    # 方式1: 纯数字参数 (IOMan反汇编显示8个整数)
    print(f"StartAPI: {dll.psAPI_Common_StartAPI(b'')}")

    # IOMan push序列: 0x0A(10), 0x05(5), 0x56(86), eax...
    # 可能是 {port, timeout, mode, ...} 结构体
    combos = [
        (10, 5, 86, 0, 0, 0, 0, 0),
        (port, 0, 0, 0, 0, 0, 0, 0),
        (0, port, 0, 0, 0, 0, 0, 0),
        (0, 9004, 0, 0, 5000, 0, 0, 0),
    ]

    for combo in combos:
        ret = dll.psAPI_Server_Connect(*combo)
        if ret == 0:
            print(f"Connect {combo}: SUCCESS!")
            return ret
        elif ret != -19998:
            print(f"Connect {combo}: {ret}")

    return -1

def main():
    print(f"Python: {struct.calcsize('P')*8}bit")
    print(f"DLL: {DLL_PATH}")

    dll = load_dll()

    # RTDB 配置 (从 Oracle PROJECT_IODATASOURCE)
    ip = "192.168.10.130"
    port = 8889
    user = "admin"
    pwd = "INDUSTRYA11_pass"

    handle = try_connect(dll, ip, port, user, pwd)

    if handle >= 0:
        print(f"Connected! Handle={handle}")
        # 尝试读数据
        # psAPI_Real_ReadList(handle, tag_ids, count, result_buf)
        print("Ready to read OPC data via psAPI")
    else:
        print("All connect attempts failed")

    # 试 Net_ConnectServer (带结构体)
    print("\nTrying Net_ConnectServer...")
    # 从 psAPISDK 导出表找到 mangled name 对应的函数
    # ?Net_ConnectServer@@YGHPAUpsConnectPara@@PAG@Z
    try:
        net_connect = dll["?Net_ConnectServer@@YGHPAUpsConnectPara@@PAG@Z"]
        net_connect.restype = ctypes.c_int
    except:
        print("Net_ConnectServer not found in exports")

    print("Done")

if __name__ == "__main__":
    main()
