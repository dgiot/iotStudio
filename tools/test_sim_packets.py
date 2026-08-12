#!/usr/bin/env python3
"""模拟发包测试 — Modbus + OPC DA + DTU LegacyComm"""
import socket, struct, time

print("=" * 55)
print("  IO 模拟器发包测试")
print("=" * 55)

# ═══ Modbus TCP :502 ═══
print("\n[1] Modbus TCP (:502)")
try:
    s = socket.socket(); s.settimeout(3); s.connect(('127.0.0.1', 502))
    # ReadHR: Unit=1, Start=0, Count=4
    req = struct.pack('>HHH', 1, 0, 6) + bytes([1, 3, 0, 0, 0, 4])
    s.send(req)
    resp = s.recv(256); s.close()
    vals = [struct.unpack('>H', resp[9+i*2:11+i*2])[0] for i in range(4)]
    print(f"  REQ:  {req.hex()}")
    print(f"  RESP: {resp.hex()}")
    print(f"  Ia = {vals[0]*170/8192:.2f} A")
    print(f"  Ib = {vals[1]*170/8192:.2f} A")
    print(f"  Ua = {vals[2]*170/8192:.1f} V")
    print(f"  P  = {vals[3]} W")
except Exception as e:
    print(f"  FAIL: {e}")

# ═══ OPC DA :13500 ═══
print("\n[2] OPC DA (:13500)")
try:
    s = socket.socket(); s.settimeout(3); s.connect(('127.0.0.1', 13500))
    items = '02204060100.Ia;02204060100.Ua;02105100097.Ia'
    req = struct.pack('>HH', len(items)+4, 0x0001) + items.encode()
    s.send(req)
    resp = s.recv(512); s.close()
    for pair in resp[4:].decode().split(';'):
        if '=' in pair:
            k, v = pair.split('=')
            print(f"  {k} = {v}")
except Exception as e:
    print(f"  FAIL: {e}")

# ═══ DTU LegacyComm :53002 ═══
print("\n[3] DTU 注册 (:53002)")
try:
    s = socket.socket(); s.settimeout(3); s.connect(('127.0.0.1', 53002))
    s.send(bytes([0xAA, 0x01]) + b'02204060100' + bytes([0x0D]))
    # Wait for poll
    time.sleep(3)
    try:
        resp = s.recv(256)
        if len(resp) >= 8 and resp[7] == 3:
            print(f"  收到 Modbus 查询: Slave={resp[6]} Func=0x{resp[7]:02X}")
            # Respond
            vals = bytes([4]) + struct.pack('>HH', 240, 488)
            reply = struct.pack('>BIBBB', resp[0], 0, 3+len(vals), resp[6], 3) + vals
            s.send(reply)
            print(f"  发送响应: Ia=240 Ib=488")
    except socket.timeout:
        print("  查询超时(正常—模拟器可能还没轮询)")
    s.close()
except Exception as e:
    print(f"  FAIL: {e}")

print("\n" + "=" * 55)
print("  测试完成")
print("=" * 55)
