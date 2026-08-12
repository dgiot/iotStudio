#!/usr/bin/env python3
"""
本地 LegacyComm 全链路模拟
===========================
启动 commbridge_server → 接入 mock RTU → 观察真实协议交互
基于 7.10.pcapng 逆向的协议格式
"""
import asyncio, struct, time, random, math, json, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
LOG_DIR = ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)

from src.protocols.commbridge_server import (
    LegacyCommServer, parse_registration, build_read_query,
    parse_response, parse_reg_values, apply_formula, COEFFICIENTS
)

packets = []

def log_pkt(direction, data, note=""):
    ts = time.strftime("%H:%M:%S.%f")[:-3]
    hex_str = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 50), 2))
    if len(data) > 50:
        hex_str += f" (+{len(data)-50}B)"
    line = f"[{ts}] {direction:6s} | {hex_str}"
    if note:
        line += f"  | {note}"
    print(f"  {line}")
    packets.append({"ts": ts, "dir": direction, "hex": data.hex(), "note": note})

# ═══════════════════════════════════════════════
# Mock RTU — 模拟真实的 RTU 设备
# ═══════════════════════════════════════════════
class MockRTU:
    """模拟一个真实的 RTU 设备:
    1. TCP 连接到 LegacyComm
    2. 发送 DTU 注册帧
    3. 响应 Modbus 查询 (返回带漂移的遥测值)"""
    def __init__(self, device_id: str, slave_id: int, base_values: list):
        self.device_id = device_id
        self.slave_id = slave_id
        self.base_values = base_values  # 物理量基准值

    async def connect_and_run(self, host="127.0.0.1", port=53002):
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(host, port), timeout=5)
        except Exception as e:
            print(f"  [RTU:{self.device_id}] Connect failed: {e}")
            return

        addr = writer.get_extra_info('peername')
        print(f"  [RTU:{self.device_id}] Connected to {addr}")

        # Phase 1: 发送 DTU 注册帧
        reg_frame = bytes([0xAA, self.slave_id]) + self.device_id.encode() + bytes([0x0D])
        writer.write(reg_frame)
        await writer.drain()
        log_pkt(f"RTU->", reg_frame, f"REGISTER {self.device_id} slave={self.slave_id}")

        # Phase 2: 响应查询
        seq = 0
        try:
            while True:
                data = await asyncio.wait_for(reader.read(256), timeout=15)
                if not data:
                    break

                # 心跳
                if len(data) == 1 and data[0] == 0x00:
                    log_pkt(f"<-SRV", data, "HEARTBEAT")
                    continue

                log_pkt(f"<-SRV", data, f"QUERY len={len(data)}")

                # 解析查询
                parsed = parse_response(data)
                if not parsed:
                    continue

                seq = parsed['seq']
                func = parsed['func']
                query_data = parsed['data']

                # 解析查询参数
                if func in (0x03, 0x04) and len(query_data) >= 4:
                    start_addr = struct.unpack(">H", query_data[0:2])[0]
                    quantity = struct.unpack(">H", query_data[2:4])[0]
                    reg_count = min(quantity, len(self.base_values))

                    # 生成带漂移的遥测值 (int16 原始值)
                    raw_vals = []
                    for i in range(reg_count):
                        ch_idx = (start_addr // 2 + i) % len(self.base_values)
                        base = self.base_values[ch_idx]
                        drift = math.sin(time.time() / 30 + ch_idx) * 0.02
                        noise = random.gauss(0, 0.005)
                        phys = base * (1 + drift + noise)
                        # 转 int16 原始值 (用系数0的反算)
                        if abs(COEFFICIENTS[0]) > 0:
                            raw = int(phys / COEFFICIENTS[0])
                        else:
                            raw = int(phys * 100)
                        raw = max(-32768, min(32767, raw))
                        if raw < 0:
                            raw += 65536
                        raw_vals.append(raw & 0xFFFF)

                    # 构造响应帧
                    byte_count = quantity * 2
                    payload = bytes([byte_count])
                    for v in raw_vals:
                        payload += struct.pack(">H", v)

                    resp = struct.pack(">BIBB", seq, 0, 2 + len(payload), self.slave_id)
                    resp += bytes([func]) + payload

                    writer.write(resp)
                    await writer.drain()
                    log_pkt(f"RTU->", resp, f"RESP Fn={func} Addr={start_addr} Qty={quantity} Vals={raw_vals[:3]}...")

        except asyncio.TimeoutError:
            print(f"  [RTU:{self.device_id}] Idle timeout")
        except Exception as e:
            print(f"  [RTU:{self.device_id}] Error: {e}")
        finally:
            writer.close()
            print(f"  [RTU:{self.device_id}] Disconnected")

# ═══════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════
async def main():
    print("=" * 60)
    print("LegacyComm 全链路模拟 — 真实协议")
    print("=" * 60)
    print()

    # 1. 启动 LegacyComm Server
    server = LegacyCommServer(port=53002, poll_interval=1.5, heartbeat_timeout=30)
    await server.start()
    print(f"  [SRV] LegacyCommServer :53002 started\n")

    # 2. 注册设备配置
    for dev_id, cfg in [
        ("02012170058", {"reg_count": 20, "start_addr": 0, "type": 0x00}),
        ("02105100097", {"reg_count": 15, "start_addr": 0, "type": 0x10}),
        ("02204060100", {"reg_count": 20, "start_addr": 0, "type": 0x00}),
    ]:
        server.register_device(dev_id, cfg)

    # 3. 启动 mock RTU 客户端 (模拟3台真实设备)
    rtus = [
        MockRTU("02012170058", 1, [5.0, 0.5, 220.0, 1000.0, 0.95, 50.0, 0.0, 220.0, 25.0, 0.0]),
        MockRTU("02105100097", 2, [3.2, 0.3, 380.0, 800.0, 0.92, 50.1, 220.0, 0.0, 30.0, 0.0]),
        MockRTU("02204060100", 3, [4.8, 0.4, 10.2, 48.0, 0.93, 49.9, 0.0, 10.5, 20.0, 0.0]),
    ]

    tasks = [asyncio.create_task(rtu.connect_and_run()) for rtu in rtus]
    await asyncio.sleep(1)

    # 4. 观察运行 15 秒
    print("\n  --- Running (15s observation) ---\n")
    for i in range(5):
        await asyncio.sleep(3)
        status = server.status()
        print(f"  [STATUS] connections={status['connections']} rtus={len(status['rtus'])}")

    # 5. 查看状态
    print(f"\n  --- Final Status ---")
    for rtu_info in server.status()["rtus"]:
        print(f"    {rtu_info['dtu_id']}: polls={rtu_info['polls']} errors={rtu_info['errors']}")

    # 6. 清理
    print(f"\n  Stopping...")
    for t in tasks:
        t.cancel()
    await server.stop()

    print(f"\n  {len(packets)} packets captured")
    with open(LOG_DIR / "commbridge_local_packets.jsonl", "w") as f:
        for p in packets:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    print(f"  Log: logs/commbridge_local_packets.jsonl")

if __name__ == "__main__":
    asyncio.run(main())
