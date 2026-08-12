#!/usr/bin/env python3
"""持续发包 — 模拟生产环境 24x7 数据流"""
import socket, struct, time, threading, random

def sender(port, frame, interval, label):
    count = 0
    while True:
        try:
            s = socket.socket(); s.settimeout(3)
            s.connect(('127.0.0.1', port))
            s.sendall(frame)
            r = s.recv(4096)
            s.close()
            count += 1
            if count % 100 == 0:
                print(f'  [{label}] {count} pkts sent ({len(frame)}B each)')
        except:
            pass
        time.sleep(interval)

if __name__ == '__main__':
    print('持续发包中... Ctrl+C 停止')
    print('=' * 50)

    senders = [
        # (port, frame, interval_sec, label)
        (18889, bytes.fromhex('5a5a130000000a00f0502f000900000a00'), 1.0, 'A11心跳'),
        (18889, bytes.fromhex('5a5af20200003900366737000800000a002a000000'), 3.0, 'A11数据'),
        (28502, struct.pack('>HHHBBHH', 1, 0, 6, 1, 3, 0, 10), 2.0, 'Modbus'),
        (28135, bytes([0x68, 0x0d]) + b'\x00'*4 + struct.pack('<BBHH',13,1,6,1) + struct.pack('<If',100,230.5)[:7], 2.0, 'IEC104'),
        (28135, b'HEL' + b'\x00'*28, 5.0, 'OPC_UA_HEL'),
        (28135, b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x01'*72, 4.0, 'OPC_DA'),
    ]

    for port, frame, interval, label in senders:
        threading.Thread(target=sender, args=(port, frame, interval, label), daemon=True).start()
        print(f'  [{label}] :{port} every {interval}s')

    # GE EGD UDP
    def egd_sender():
        count = 0
        egc = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        while True:
            hdr = struct.pack('<H', 0x010D) + struct.pack('<H', count)
            hdr += socket.inet_aton('127.0.0.1') + struct.pack('<I', 100)
            hdr += struct.pack('<II', int(time.time()), 0)
            hdr += struct.pack('<I', 1) + struct.pack('<I', 0) + struct.pack('<I', 0)
            hdr += f'TEMP={230.5+random.random():.1f}|PRES={1.2+random.random():.2f}'.encode()
            egc.sendto(hdr, ('127.0.0.1', 18246))
            count += 1
            if count % 100 == 0:
                print(f'  [GE_EGD] {count} pkts sent (UDP)')
            time.sleep(3000)
    threading.Thread(target=egd_sender, daemon=True).start()
    print(f'  [GE_EGD] UDP every 3000ms')

    print(f'\n  总计 {len(senders)+1} 条数据流, 持续运行')
    print('=' * 50)

    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        print('\n停止')
