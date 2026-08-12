#!/usr/bin/env python3
"""
RTDB OPC DA 自主采集器 — 指定 Tag ID 读取实时数据
=====================================================
基于 psAPISDK.dll (32-bit) + ctypes

用法:
  # 需要 32 位 Python!
  C:/Python311-32/python.exe tools/rtdb_collector.py

  # 读取指定 Tag ID
  C:/Python311-32/python.exe tools/rtdb_collector.py --ids 5000,5001,5002

  # 扫描活跃 Tag
  C:/Python311-32/python.exe tools/rtdb_collector.py --scan

连接: 192.168.10.130:8889 (RTDB IO Server)
凭据: admin / INDUSTRYA11_pass
"""
import ctypes, os, struct, sys, time, json, argparse
from datetime import datetime

DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ═══════════════════════════════════════
# PS_DATA 内存布局 (pack=4, 实测)
# ═══════════════════════════════════════
# Offset 0-3:  Time.Seconds (uint32 LE)
# Offset 4-7:  Time.NanoSec (uint32 LE)
# Offset 8-11: DataType (uint32, =11)
# Offset 12-15: reserved
# Offset 16-19: Float value (float32 LE)
# Offset 20-23: Quality (uint32, 0xC0=GOOD)
PS_DATA_SIZE = 24
FLOAT_OFFSET = 16
TS_OFFSET = 0

class PSpaceCollector:
    def __init__(self, host="192.168.10.130", port=8889, user="admin", pwd="INDUSTRYA11_pass"):
        self.host = host
        self.port = port
        self.user = user
        self.pwd = pwd
        self.handle = None
        self.dll = None

    def connect(self):
        os.add_dll_directory(DIR)
        self.dll = ctypes.CDLL("psAPISDK.dll")
        d = self.dll

        d.psAPI_Common_StartAPI.restype = ctypes.c_int32
        ret = d.psAPI_Common_StartAPI()
        if ret != 0:
            raise Exception(f"StartAPI failed: {ret}")

        d.psAPI_Server_Connect.argtypes = [ctypes.c_char_p]*3 + [ctypes.POINTER(ctypes.c_uint16)]
        d.psAPI_Server_Connect.restype = ctypes.c_int32

        target = f"{self.host}:{self.port}".encode()
        self.handle = ctypes.c_uint16(0xFFFF)
        ret = d.psAPI_Server_Connect(target, self.user.encode(), self.pwd.encode(),
                                      ctypes.byref(self.handle))
        if ret != 0:
            d.psAPI_Commom_GetErrorDesc.argtypes = [ctypes.c_int32]
            d.psAPI_Commom_GetErrorDesc.restype = ctypes.c_char_p
            err = d.psAPI_Commom_GetErrorDesc(ret).decode("gbk", "ignore")
            raise Exception(f"Connect failed: {err} (ret={ret})")

        d.psAPI_Real_ReadList.argtypes = [ctypes.c_uint16, ctypes.c_uint32,
            ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p]
        d.psAPI_Real_ReadList.restype = ctypes.c_int32

        return self.handle.value

    def read(self, tag_ids):
        """读取一批 Tag 的实时值, 返回 [{tag_id, value, timestamp, quality}]"""
        n = len(tag_ids)
        ids_arr = (ctypes.c_uint32 * n)(*tag_ids)
        ppV = ctypes.c_void_p(0)
        ppE = ctypes.c_void_p(0)

        ret = self.dll.psAPI_Real_ReadList(self.handle, n, ids_arr,
                                            ctypes.byref(ppV), ctypes.byref(ppE))
        if ret != 0 or not ppV.value:
            return []

        raw = ctypes.string_at(ppV.value, n * PS_DATA_SIZE)
        results = []
        for i in range(n):
            off = i * PS_DATA_SIZE
            ts_sec = struct.unpack("<I", raw[off+TS_OFFSET:off+TS_OFFSET+4])[0]
            value = struct.unpack("<f", raw[off+FLOAT_OFFSET:off+FLOAT_OFFSET+4])[0]
            quality = raw[off+20]
            results.append({
                "tag_id": tag_ids[i],
                "value": round(value, 6),
                "timestamp": datetime.fromtimestamp(ts_sec).isoformat(),
                "quality": "GOOD" if (quality & 0xC0) == 0xC0 else f"0x{quality:02X}",
            })
        return results

    def scan(self, start=1, end=20000, step=100):
        """扫描活跃 Tag ID 范围"""
        active = []
        for tid in range(start, end + 1, step):
            results = self.read([tid])
            if results and abs(results[0]["value"]) > 0.001:
                active.append(results[0])
        return active

    def disconnect(self):
        if self.dll and self.handle:
            self.dll.psAPI_Server_Disconnect.argtypes = [ctypes.c_uint16]
            self.dll.psAPI_Server_Disconnect.restype = ctypes.c_int32
            self.dll.psAPI_Server_Disconnect(self.handle)
            self.dll.psAPI_Common_StopAPI()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids", help="Tag IDs, comma-separated")
    ap.add_argument("--scan", action="store_true", help="Scan for active tags")
    ap.add_argument("--start", type=int, default=1)
    ap.add_argument("--end", type=int, default=20000)
    ap.add_argument("--step", type=int, default=100)
    args = ap.parse_args()

    collector = PSpaceCollector()
    try:
        h = collector.connect()
        print(f"Connected: handle=0x{h:04X}")

        if args.ids:
            tag_ids = [int(x.strip()) for x in args.ids.split(",")]
            results = collector.read(tag_ids)
            print(f"\n{'Tag ID':<8} {'Value':>12} {'Timestamp':<22} {'Quality'}")
            print("-" * 58)
            for r in results:
                print(f"{r['tag_id']:<8} {r['value']:>12.4f} {r['timestamp']:<22} {r['quality']}")

        elif args.scan:
            print(f"Scanning {args.start}-{args.end} step={args.step}...")
            active = collector.scan(args.start, args.end, args.step)
            print(f"\nFound {len(active)} active tags:")
            for r in active:
                print(f"  ID={r['tag_id']:6d} val={r['value']:10.4f} Q={r['quality']}")

        else:
            # Default: read known good tags
            print("No --ids specified. Reading default tags (5000-5500)...")
            results = collector.read([5000, 5001, 5002, 5500, 5501, 5502])
            for r in results:
                print(f"  ID={r['tag_id']:6d} val={r['value']:10.4f} ts={r['timestamp'][:19]} Q={r['quality']}")

    finally:
        collector.disconnect()
        print("Disconnected")

if __name__ == "__main__":
    main()
