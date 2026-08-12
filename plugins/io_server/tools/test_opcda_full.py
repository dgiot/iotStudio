#!/usr/bin/env python3
"""OPC DA 全协议测试 — BIND/CONNECT/ADDGROUP/ADDITEMS/READ/WRITE/DISCONNECT"""
import socket, struct, threading, time

class OPCSimServer:
    """模拟 OPC DA Server — 完整协议响应"""
    def __init__(self, port=20135):
        self.port = port
        self.tags = {1000+i: round(50 + i * 0.5, 2) for i in range(64)}
        self.groups = {}
        self.items = {}
        self.group_id = 0

    def start(self):
        srv = socket.socket()
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(('127.0.0.1', self.port)); srv.listen(5)
        def accept():
            while True:
                c, a = srv.accept()
                threading.Thread(target=self._handle, args=(c,), daemon=True).start()
        threading.Thread(target=accept, daemon=True).start()
        return srv

    def _handle(self, client):
        try:
            while True:
                data = client.recv(65535)
                if not data: break
                resp = self._respond(data)
                if resp: client.sendall(resp)
        except:
            pass
        finally:
            client.close()

    def _respond(self, data):
        if len(data) < 4: return None
        cmd = data[3] if len(data) > 3 else 0

        if cmd == 0x0B:  # BIND
            return b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x02'*72

        elif cmd == 0x0F:  # CONNECT
            return b'\x04\x00\x0f\x03\x10\x00\x00\x00' + b'\x03'*72

        elif cmd == 0x01:  # ADDGROUP
            self.group_id += 1
            gid = struct.pack('<I', self.group_id)
            return b'\x02\x00\x01\x83\x10\x00\x00\x00' + gid + b'\x05'*64

        elif cmd == 0x02:  # ADDITEMS
            count = min((len(data)-8)//4, 4)
            handles = []
            for i in range(count):
                h = 2000 + i
                self.items[h] = self.tags.get(1000+i, 0)
                handles.append(h)
            body = struct.pack('<I', count)
            for h in handles:
                body += struct.pack('<I', h) + b'\x00' * 4
            return b'\x02\x00\x02\x83' + struct.pack('<I', 8 + len(body)) + body + b'\x00'*32

        elif cmd == 0x04:  # READ
            count = min((len(data)-8)//4, 4) if len(data) > 8 else 4
            body = b''
            for i in range(count):
                h = 2000 + i
                v = struct.pack('<f', self.items.get(h, 0.0))
                body += struct.pack('<IHH', h, 0, 0) + v
            return b'\x03\x00\x04\x83' + struct.pack('<I', 8 + len(body)) + body + b'\x00'*16

        elif cmd == 0x05:  # WRITE
            return b'\x03\x00\x05\x83\x08\x00\x00\x00' + b'\x06'*64

        elif cmd == 0x08:  # DISCONNECT
            return b'\x04\x00\x08\x83\x08\x00\x00\x00' + b'\x07'*64

        return None

# ===== 客户端测试序列 =====
def test_opc_full(port):
    results = []
    s = socket.socket(); s.settimeout(5)
    try:
        s.connect(('127.0.0.1', port))

        # 1. BIND
        s.sendall(b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x01'*72)
        r = s.recv(1024)
        results.append(('BIND', len(r) > 0))

        # 2. CONNECT
        s.sendall(b'\x04\x00\x0f\x03\x14\x00\x00\x00' + b'KEPware.KEPServerEx.V4\x00\x00\x00\x00' + b'\x00'*48)
        r = s.recv(1024)
        results.append(('CONNECT', len(r) > 0))

        # 3. ADDGROUP
        s.sendall(b'\x02\x00\x01\x03\x10\x00\x00\x00' + b'\x01'*72)
        r = s.recv(1024)
        results.append(('ADDGROUP', len(r) > 8))

        # 4. ADDITEMS
        data = b'\x02\x00\x02\x03' + struct.pack('<I', 20)
        data += struct.pack('<I', 1000) + b'\x00'*4
        data += struct.pack('<I', 1001) + b'\x00'*4
        data += b'\x00'*52
        s.sendall(data)
        r = s.recv(1024)
        results.append(('ADDITEMS(2)', len(r) > 8))

        # 5. READ
        data = b'\x03\x00\x04\x03' + struct.pack('<I', 12)
        data += struct.pack('<I', 2000) + struct.pack('<I', 2001)
        data += b'\x00'*60
        s.sendall(data)
        r = s.recv(1024)
        results.append(('READ', len(r) > 12))

        # 6. WRITE
        data = b'\x03\x00\x05\x03' + struct.pack('<I', 16)
        data += struct.pack('<If', 2000, 42.5) + struct.pack('<If', 2001, 99.0)
        data += b'\x00'*44
        s.sendall(data)
        r = s.recv(1024)
        results.append(('WRITE', len(r) > 0))

        # 7. DISCONNECT
        s.sendall(b'\x04\x00\x08\x03\x08\x00\x00\x00' + b'\x00'*64)
        r = s.recv(1024)
        results.append(('DISCONNECT', len(r) > 0))

    except Exception as e:
        results.append(('ERROR', False))
    finally:
        s.close()
    return results

# ===== Hub relay test =====
if __name__ == '__main__':
    print('=' * 55)
    print('  OPC DA 全协议测试')
    print('=' * 55)

    # Server
    server = OPCSimServer(20135)
    server.start()
    time.sleep(0.3)

    # Hub relay
    import select
    psrv = socket.socket(); psrv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    psrv.bind(('127.0.0.1', 28135)); psrv.listen(10)
    def hub_accept():
        while True:
            c, a = psrv.accept()
            b = socket.socket(); b.settimeout(3)
            try: b.connect(('127.0.0.1', 20135))
            except: c.close(); continue
            def relay():
                socks = [c, b]
                try:
                    while True:
                        r, _, _ = select.select(socks, [], [], 10)
                        if not r: break
                        for sock in r:
                            d = sock.recv(65535)
                            if not d:
                                return
                            if sock is c: b.sendall(d)
                            else: c.sendall(d)
                except: pass
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
    threading.Thread(target=hub_accept, daemon=True).start()
    time.sleep(0.3)

    print('\n直连测试:')
    r1 = test_opc_full(20135)
    for op, ok in r1:
        status = '[OK]' if ok else '[FAIL]'
        print(f'  {status} {op}')

    print('\n通过Hub中继:')
    r2 = test_opc_full(28135)
    for op, ok in r2:
        status = '[OK]' if ok else '[FAIL]'
        print(f'  {status} {op}')

    d_ok = sum(1 for _, ok in r1 if ok)
    h_ok = sum(1 for _, ok in r2 if ok)
    total = len(r1)
    print(f'\n直连: {d_ok}/{total}  中继: {h_ok}/{total}')
    print('PASS!' if d_ok == total and h_ok == total else 'PARTIAL')
    psrv.close()
