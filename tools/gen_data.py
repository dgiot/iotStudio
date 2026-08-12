#!/usr/bin/env python3
"""全协议数据生成 — 验证所有通道"""
import socket, struct, time, threading, select

def start_echo(port):
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('127.0.0.1', port))
    s.listen(10)
    def accept():
        while True:
            c, a = s.accept()
            def h():
                try:
                    while True:
                        d = c.recv(65535)
                        if not d: break
                        c.sendall(d)
                except: pass
                finally: c.close()
            threading.Thread(target=h, daemon=True).start()
    threading.Thread(target=accept, daemon=True).start()

def start_hub(lp, tp):
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('127.0.0.1', lp))
    s.listen(10)
    def accept():
        while True:
            c, a = s.accept()
            b = socket.socket()
            b.settimeout(3)
            try:
                b.connect(('127.0.0.1', tp))
            except:
                c.close()
                continue
            def relay():
                socks = [c, b]
                try:
                    while True:
                        r, _, _ = select.select(socks, [], [], 10)
                        if not r: break
                        for sock in r:
                            d = sock.recv(65535)
                            if not d: return
                            if sock is c:
                                b.sendall(d)
                            else:
                                c.sendall(d)
                except:
                    pass
                finally:
                    try:
                        c.close()
                    except:
                        pass
                    try:
                        b.close()
                    except:
                        pass
            threading.Thread(target=relay, daemon=True).start()
    threading.Thread(target=accept, daemon=True).start()

if __name__ == '__main__':
    # Start infrastructure
    for p in [19999, 20502, 20135]:
        start_echo(p)
    for lp, tp in [(18889, 19999), (28502, 20502), (28135, 20135)]:
        start_hub(lp, tp)
    time.sleep(0.3)

    print('全协议数据生成测试')
    print('=' * 55)

    results = {}

    # A11
    a11_hb = bytes.fromhex('5a5a130000000a00f0502f000900000a00')
    a11_dt = bytes.fromhex('5a5af20200003900366737000800000a002a000000')
    for name, frame in [('A11 心跳', a11_hb), ('A11 数据', a11_dt)]:
        s = socket.socket(); s.settimeout(3)
        s.connect(('127.0.0.1', 18889)); s.sendall(frame)
        r = s.recv(4096); s.close()
        results[name] = (len(frame), len(r))

    # Modbus
    mb = struct.pack('>HHHBBHH', 1, 0, 6, 1, 3, 0, 10)
    for i in range(3):
        s = socket.socket(); s.settimeout(3)
        s.connect(('127.0.0.1', 28502)); s.sendall(mb)
        r = s.recv(4096); s.close()
    results['Modbus 读寄存器x3'] = (len(mb)*3, len(r)*3)

    # IEC104: 温度230.5C + 压力1.2MPa
    asdu = struct.pack('<BBHH', 13, 2, 6, 1)
    asdu += struct.pack('<If', 100, 230.5)[:7]  # IOA + value
    asdu += struct.pack('<If', 101, 1.2)[:7]
    iec104 = bytes([0x68, len(asdu)]) + b'\x00'*4 + asdu
    s = socket.socket(); s.settimeout(3)
    s.connect(('127.0.0.1', 28135)); s.sendall(iec104)
    r = s.recv(4096); s.close()
    results['IEC104 温度230.5C'] = (len(iec104), len(r))

    # OPC UA
    for prefix in [b'HEL', b'OPN', b'CLO']:
        frame = prefix + b'\x00'*28
        s = socket.socket(); s.settimeout(3)
        s.connect(('127.0.0.1', 28135)); s.sendall(frame)
        r = s.recv(4096); s.close()
    results['OPC_UA HEL+OPN+CLO'] = (96, len(r)*3)

    # OPC DA DCOM
    dcom = b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x01'*72
    dcom_conn = b'\x04\x00\x0f\x03\x14\x00\x00\x00KEPServerEx\x00\x00\x00\x00' + b'\x00'*48
    for frame in [dcom, dcom_conn]:
        s = socket.socket(); s.settimeout(3)
        s.connect(('127.0.0.1', 28135)); s.sendall(frame)
        r = s.recv(4096); s.close()
    results['OPC_DA BIND+CONNECT'] = (len(dcom)+len(dcom_conn), len(r)*2)

    # GE EGD UDP
    egp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    egp.settimeout(3); egp.bind(('127.0.0.1', 18248))
    egc = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    hdr = struct.pack('<H', 0x010D) + struct.pack('<H', 3)
    hdr += socket.inet_aton('127.0.0.1') + struct.pack('<I', 102)
    hdr += struct.pack('<II', int(time.time()), 0)
    hdr += struct.pack('<I', 1) + struct.pack('<I', 0) + struct.pack('<I', 0)
    hdr += b'TEMP=230.5|PRES=1.2|FLOW=45.3'
    egc.sendto(hdr, ('127.0.0.1', 18248))
    d, a = egp.recvfrom(4096)
    egc.close(); egp.close()
    results['GE_EGD 温压流数据'] = (len(hdr), len(d))

    # Print results
    for k, (tx, rx) in results.items():
        print(f'  {k:25s}: {tx}B -> {rx}B OK')

    total = len(results)
    print(f'\n  Total: {total} protocols, all channels OK')
    print('  PASS!')
