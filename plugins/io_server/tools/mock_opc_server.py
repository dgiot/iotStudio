#!/usr/bin/env python3
"""
Mock OPC DA Server — 模拟 RTDB/OPC 服务，本地可测试
=========================================================
模拟一个多设备的 OPC 数据源，支持:
  - 设备注册/握手 (模拟 DTU 上线)
  - Modbus 轮询响应 (模拟 RTU 回复)
  - 持续生成遥测数据 (含随机波动)
  - 记录完整交互报文

用法:
  python mock_opc_server.py              # 默认 :502
  python mock_opc_server.py --port 502   # 指定端口
"""
import socket, struct, threading, time, random, json, math
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# 设备配置 (对标 Device.ini 的 12 种设备类型)
DEVICES = {
    "02204060100": {"name": "线路保护A1", "devtype": "00", "channels": 20,
                     "base_vals": [5.0, 0.5, 220.0, 1000.0, 0.95, 50.0, 0, 220.0, 25.0, 0],
                     "change": [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192, 1, 1, 1, 1]},
    "02204060111": {"name": "变压器保护B3", "devtype": "10", "channels": 15,
                     "base_vals": [3.2, 0.3, 380.0, 800.0, 0.92, 50.1, 220.0, 0, 30.0, 0],
                     "change": [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192, 1, 1, 1, 1]},
    "02204060200": {"name": "电动机保护M2", "devtype": "40", "channels": 19,
                     "base_vals": [8.5, 0.8, 6.3, 1500.0, 0.88, 49.9, 0, 0, 45.0, 0],
                     "change": [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192, 1, 1, 1, 1]},
}

# Modbus function codes
MB_READ_HOLDING = 0x03
MB_READ_INPUT = 0x04

packet_log = []


def log_packet(direction, addr, data, note=""):
    """记录交互报文"""
    record = {
        "ts": datetime.now().isoformat(timespec="milliseconds"),
        "dir": direction,
        "addr": addr,
        "hex": data.hex() if isinstance(data, bytes) else data,
        "len": len(data),
        "note": note,
    }
    packet_log.append(record)
    hex_str = data.hex() if isinstance(data, bytes) else str(data)
    print(f"  [{record['ts'][11:]}] {direction} {addr}: {hex_str[:80]}{'...' if len(hex_str)>80 else ''} {note}")


def generate_telemetry(dev_id, channel_idx):
    """生成单个通道的遥测值 — 带缓慢漂移和随机噪声"""
    dev = DEVICES.get(dev_id)
    if not dev or channel_idx >= len(dev["base_vals"]):
        return 0

    base = dev["base_vals"][channel_idx]
    change = dev["change"][channel_idx]

    # 添加 ±5% 漂移 + 随机噪声
    drift = math.sin(time.time() / 60 + channel_idx) * 0.03
    noise = random.gauss(0, 0.01)
    physical = base * (1 + drift + noise)

    # 转换为原始 Modbus 寄存器值 (16-bit)
    raw = int(physical / change)
    raw = max(0, min(65535, raw))
    return raw, round(physical, 4)


def handle_modbus_request(conn, addr, data):
    """处理 Modbus RTU/TCP 请求"""
    if len(data) < 8:
        return None

    txn_id = data[0:2]
    proto_id = data[2:4]
    length = struct.unpack(">H", data[4:6])[0]
    unit_id = data[6]
    func_code = data[7]

    if func_code == MB_READ_HOLDING or func_code == MB_READ_INPUT:
        start_addr = struct.unpack(">H", data[8:10])[0]
        reg_count = struct.unpack(">H", data[10:12])[0]

        # 4 字节对齐: 起始地址 / 4 = channel_idx
        channel_idx = start_addr // 4
        dev_id = f"02204060{100 + start_addr % 20:03d}"  # 模拟设备ID映射

        # 优先用实际设备
        actual_dev = list(DEVICES.keys())[channel_idx % len(DEVICES)]

        values = []
        for i in range(reg_count):
            raw, phys = generate_telemetry(actual_dev, (channel_idx + i) % 10)
            values.append(raw)

        # 构造 Modbus 响应
        byte_count = reg_count * 2
        resp = txn_id + proto_id + struct.pack(">H", 3 + byte_count)
        resp += bytes([unit_id, func_code, byte_count])
        for v in values:
            resp += struct.pack(">H", v)

        log_packet("SEND", f"{addr[0]}:{addr[1]}", resp,
                    f"Dev={actual_dev} Ch={channel_idx} Regs={reg_count} Raw={values[:3]}...")
        return resp

    # 不支持的功能码 → 异常响应
    err_resp = txn_id + proto_id + struct.pack(">H", 3) + bytes([unit_id, func_code | 0x80, 0x01])
    return err_resp


def handle_dtu_handshake(conn, addr, data):
    """处理 DTU 注册握手 — 模拟 LegacyComm 协议"""
    text = data.decode('ascii', errors='ignore') if isinstance(data, bytes) else str(data)
    log_packet("RECV", f"{addr[0]}:{addr[1]}", data, "DTU handshake")

    # 简单回显确认
    if len(data) >= 13:
        # 格式: aa + 01 + 12-byte-device-id + 0d (推测)
        resp = bytes([0xAA, data[1] ^ 0x01]) + data[2:13] + bytes([0x0D])
    else:
        resp = data[:1] + bytes([data[1] ^ 0x01 if len(data) > 1 else 0x55]) + data[2:] + bytes([0x0D])

    log_packet("SEND", f"{addr[0]}:{addr[1]}", resp, "DTU ACK")
    return resp


class MockOPCServer:
    """Mock OPC DA / Modbus TCP 服务器"""

    def __init__(self, host="0.0.0.0", port=502):
        self.host = host
        self.port = port
        self.running = False
        self.sock = None

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        self.running = True
        print(f"Mock OPC Server listening on {self.host}:{self.port}")
        print(f"  Devices: {len(DEVICES)} configured")
        print(f"  Log: {LOG_DIR / 'mock_opc_packets.jsonl'}")
        print()

        while self.running:
            try:
                conn, addr = self.sock.accept()
                print(f"\n--- New connection: {addr[0]}:{addr[1]} ---")
                t = threading.Thread(target=self._handle_client, args=(conn, addr), daemon=True)
                t.start()
            except socket.timeout:
                continue
            except Exception as e:
                if self.running:
                    print(f"Accept error: {e}")

    def _handle_client(self, conn, addr):
        conn.settimeout(30)
        buffer = b""
        try:
            while self.running:
                try:
                    chunk = conn.recv(4096)
                    if not chunk:
                        break
                    buffer += chunk
                    log_packet("RECV", f"{addr[0]}:{addr[1]}", chunk)

                    # Modbus TCP: 最小 8 字节 (MBAP header + func)
                    while len(buffer) >= 8:
                        # 检测包类型
                        if buffer[0] == 0xAA:
                            # DTU 注册
                            resp = handle_dtu_handshake(conn, addr, buffer[:16])
                            buffer = buffer[16:] if len(buffer) >= 16 else b""
                            if resp:
                                conn.send(resp)
                        else:
                            # Modbus TCP
                            length = struct.unpack(">H", buffer[4:6])[0]
                            total = 6 + length
                            if len(buffer) < total:
                                break  # 不完整，等更多数据
                            pkt = buffer[:total]
                            buffer = buffer[total:]
                            resp = handle_modbus_request(conn, addr, pkt)
                            if resp:
                                conn.send(resp)

                except socket.timeout:
                    # 发送心跳数据 (主动推送模拟)
                    dev_id = random.choice(list(DEVICES.keys()))
                    raw, phys = generate_telemetry(dev_id, random.randint(0, 9))
                    push_msg = f"TELEMETRY|{dev_id}|ch{random.randint(0,9)}|{phys}|{raw}\r\n"
                    try:
                        conn.send(push_msg.encode())
                        log_packet("SEND", f"{addr[0]}:{addr[1]}", push_msg.strip(), "PUSH")
                    except:
                        break
                    continue

        except Exception as e:
            print(f"  Client {addr}: {e}")
        finally:
            print(f"  --- Disconnected: {addr[0]}:{addr[1]} ---")
            conn.close()

    def stop(self):
        self.running = False
        if self.sock:
            self.sock.close()
        # 保存报文日志
        log_file = LOG_DIR / "mock_opc_packets.jsonl"
        with open(log_file, 'w') as f:
            for p in packet_log:
                f.write(json.dumps(p, ensure_ascii=False) + '\n')
        print(f"\nPacket log saved: {log_file} ({len(packet_log)} packets)")


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=502, help="TCP port (default: 502)")
    args = ap.parse_args()

    server = MockOPCServer(port=args.port)
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()
        print("Server stopped")


if __name__ == "__main__":
    main()
