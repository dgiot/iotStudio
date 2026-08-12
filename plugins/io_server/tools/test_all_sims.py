#!/usr/bin/env python3
"""全协议模拟器验证 — A11/Modbus/IEC104/OPC_UA/OPC_DA/GE_EGD"""
import socket, struct, time, threading
results = {}

def check(name, ok):
    results[name] = ok
    s = 'PASS' if ok else 'FAIL'
    print(f'  [{s}] {name}')

# ===== 1. A11 =====
a11_frame = bytes.fromhex('5a5a130000000a00f0502f000900000a00')
s = socket.socket(); s.settimeout(3)
s.connect(('127.0.0.1', 18889)); s.sendall(a11_frame)
r = s.recv(4096); s.close()
check('A11 5a5a帧往返', len(r) > 0)

# ===== 2. Modbus TCP =====
mb_frame = struct.pack('>HHHBBHH', 1, 0, 6, 1, 3, 0, 10)
s = socket.socket(); s.settimeout(3)
s.connect(('127.0.0.1', 28502)); s.sendall(mb_frame)
r = s.recv(4096); s.close()
check('Modbus FC03读寄存器', len(r) > 0)

# ===== 3. IEC 104 =====
asdu = struct.pack('<BBHH', 13, 1, 6, 1) + struct.pack('<I', 100)[:3] + struct.pack('<f', 230.5)
iec104 = bytes([0x68, len(asdu)]) + b'\x00'*4 + asdu
s = socket.socket(); s.settimeout(3)
s.connect(('127.0.0.1', 28135)); s.sendall(iec104)
r = s.recv(4096); s.close()
check('IEC104 短浮点遥测', len(r) > 0)

# ===== 4. OPC UA =====
for name, prefix in [('HEL', b'HEL'), ('OPN', b'OPN'), ('CLO', b'CLO')]:
    frame = prefix + b'\x00' * 28
    s = socket.socket(); s.settimeout(3)
    s.connect(('127.0.0.1', 28135)); s.sendall(frame)
    r = s.recv(4096); s.close()
check(f'OPC UA {name.decode()}消息', len(r) > 0)

# ===== 5. OPC DA (DCOM) =====
dcom_bind = b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x01'*72
s = socket.socket(); s.settimeout(3)
s.connect(('127.0.0.1', 28135)); s.sendall(dcom_bind)
r = s.recv(4096); s.close()
check('OPC DA DCOM BIND', len(r) > 0)

dcom_connect = b'\x04\x00\x0f\x03\x14\x00\x00\x00KEPServerEx\x00\x00\x00\x00' + b'\x00'*48
s = socket.socket(); s.settimeout(3)
s.connect(('127.0.0.1', 28135)); s.sendall(dcom_connect)
r = s.recv(4096); s.close()
check('OPC DA DCOM CONNECT', len(r) > 0)

# ===== 6. GE Fanuc EGD =====
egp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
egp.settimeout(3)
egp.bind(('127.0.0.1', 18247))
egc = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
hdr = struct.pack('<H', 0x010D)
hdr += struct.pack('<H', 1)
hdr += socket.inet_aton('127.0.0.1')
hdr += struct.pack('<I', 100)
hdr += struct.pack('<II', int(time.time()), 0)
hdr += struct.pack('<I', 1) + struct.pack('<I', 0) + struct.pack('<I', 0)
hdr += b'DG_EGD_DATA'
egc.sendto(hdr, ('127.0.0.1', 18247))
d, a = egp.recvfrom(4096)
egc.close(); egp.close()
check('GE EGD UDP数据包', len(d) > 32 and d[32:].startswith(b'DG_EGD_DATA'))

# ===== Summary =====
total = len(results)
passed = sum(1 for v in results.values() if v)
sep = '=' * 50
print(f'\n{sep}')
print(f'  {passed}/{total} PASS')
print(f'  ALL PASSED' if passed == total else f'  {total-passed} FAILED')
print(sep)
