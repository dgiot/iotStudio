#!/usr/bin/env python3
"""重放真实 RTU 注册包到 commbridge_server :53002, 验证协议兼容性"""
import socket, time

# 从 7.10.pcapng 提取的真实 RTU 首包 (注册包)
REAL_PACKETS = [
    (bytes.fromhex('aa0130323230343036303130300d'), 'RTU 02204060100 slave=1'),
    (bytes.fromhex('aa0130323230343036303038360d'), 'RTU 02204060086 slave=1'),
    (bytes.fromhex('aa0130323230343031303039340d'), 'RTU 02204010094 slave=1'),
    (bytes.fromhex('aa0130323230333137303134340d'), 'RTU 02203170144 slave=1'),
    (bytes.fromhex('aa0232313030313038303030390d'), 'RTU 21001080009 slave=2'),
]

print("=" * 70)
print("  Replaying REAL RTU registration packets to :53002")
print("=" * 70)

for data, desc in REAL_PACKETS:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(3)
        sock.connect(('127.0.0.1', 53002))

        # 发送真实注册包: AA + slave + ASCII_ID + 0D
        slave_id = data[1]
        device_id = data[2:-1].decode('ascii', errors='ignore')

        print(f"\n[{desc}]")
        print(f"  Sent: {data.hex(' ')}")
        print(f"  Frame: 0xAA | slave={slave_id} | ID='{device_id}' | 0x0D")

        sock.send(data)
        time.sleep(1.2)
        sock.settimeout(2)

        try:
            response = sock.recv(256)
            if response:
                print(f"  RESP: {len(response)}B HEX: {response[:40].hex(' ')}")
                # 解析 Server 发出的查询帧
                # 格式: Seq(1B) + Flags(4B) + Len(1B) + Slave(1B) + Func(1B) + Data
                if len(response) >= 8:
                    seq = response[0]
                    data_len = response[5]
                    s = response[6]
                    f = response[7] if len(response) > 7 else 0
                    fn = {1:'读线圈',2:'读离散',3:'读保持',4:'读输入',5:'写线圈',6:'写寄存器'}.get(f, hex(f))
                    print(f"  Query: Seq=0x{seq:02X} Len={data_len} Slave={s} Func={f}({fn})")

                    if f == 3 and len(response) >= 10:
                        import struct
                        addr = struct.unpack('>H', response[8:10])[0]
                        qty = struct.unpack('>H', response[10:12])[0] if len(response) >= 12 else 0
                        print(f"         ReadHolding addr={addr} qty={qty}")
            else:
                print(f"  RESP: <empty>")
        except socket.timeout:
            print(f"  RESP: TIMEOUT (server did not query within 2s)")

        sock.close()
    except ConnectionRefusedError:
        print(f"  ERR: Connection refused - is server running on :53002?")
        break
    except Exception as e:
        print(f"  ERR: {e}")

    time.sleep(0.5)

# Summary
print(f"\n" + "=" * 70)
print("  协议兼容性分析")
print("=" * 70)
print("""
Real protocol (from pcapng):
  Registration: 0xAA + SlaveID(1B) + ASCII_DeviceID + 0x0D
  Data frames:  Seq(1B) + Flags(4B) + Len(1B) + Slave(1B) + Func(1B) + Data(N)
  Heartbeat:    0x00 (single byte)

Our server currently:
  Registration: expects [DTU_ID_HASH(2B)] [DevType(1B)] [Channels(1B)]
  Queries:      standard Modbus RTU: Slave+Func+Addr+Qty+CRC16

GAP: Our server's query format and registration format differ from LegacyComm's!
""")
