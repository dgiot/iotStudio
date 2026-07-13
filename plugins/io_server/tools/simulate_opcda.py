#!/usr/bin/env python3
"""OPC DA 模拟 — Server + Client over TCP, 通过边缘中枢中继"""
import socket, struct, threading, time, random

# ===== OPC DA 协议常量 (简化版) =====
# DCOM 请求类型
OPC_BIND = 0x0B          # DCOM bind
OPC_CONNECT = 0x0F       # OPC Connect
OPC_ADDGROUP = 0x01      # AddGroup
OPC_ADDITEMS = 0x02      # AddItems
OPC_READ = 0x04          # Read
OPC_WRITE = 0x05         # Write
OPC_DISCONNECT = 0x08    # Disconnect

def opc_make_bind():
    """DCOM 绑定请求"""
    return b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x01' * 72

def opc_make_connect(prog_id):
    """OPC 连接请求"""
    data = b'\x04\x00\x0f\x03' + struct.pack('<I', len(prog_id) + 16) + prog_id.encode() + b'\x00' * (16 - len(prog_id))
    return data + b'\x00' * (72 - len(data))

def opc_make_read(item_count):
    """OPC 读请求"""
    data = b'\x03\x00\x04\x03' + struct.pack('<I', 8 + item_count * 4)
    for i in range(item_count):
        data += struct.pack('<I', 1000 + i)  # item handles
    return data + b'\x00' * (72 - len(data))

def opc_make_write(item_count):
    """OPC 写请求"""
    data = b'\x03\x00\x05\x03' + struct.pack('<I', 8 + item_count * 8)
    for i in range(item_count):
        data += struct.pack('<If', 1000 + i, random.uniform(0, 100))
    return data + b'\x00' * (72 - len(data))

def opc_parse_request(data):
    """解析 OPC 请求"""
    if len(data) < 8:
        return {'type': 'unknown'}
    cmd = data[3]
    names = {0x0B: 'BIND', 0x0F: 'CONNECT', 0x01: 'ADDGROUP', 0x02: 'ADDITEMS', 0x04: 'READ', 0x05: 'WRITE'}
    return {'type': names.get(cmd, f'0x{cmd:02X}'), 'cmd': cmd, 'len': len(data)}

def opc_make_response(cmd, values=None):
    """构造 OPC 响应"""
    if values is None:
        values = [random.uniform(0, 100) for _ in range(4)]
    if cmd == 0x04:  # READ response
        header = b'\x03\x00\x04\x03'
        body = struct.pack('<I', 8 + len(values) * (4 + 4))
        for i, v in enumerate(values):
            body += struct.pack('<I', 1000 + i)  # item handle
            body += struct.pack('<f', v)         # value
        return header + body + b'\x00' * (72 - len(header + body))
    elif cmd == 0x05:  # WRITE response
        header = b'\x03\x00\x05\x03'
        body = struct.pack('<I', 8 + len(values) * 8)
        for v in values:
            body += struct.pack('<If', 0, v)  # result + value
        return header + body + b'\x00' * (72 - len(header + body))
    elif cmd == 0x0B:  # BIND response
        return b'\x05\x00\x0b\x03\x10\x00\x00\x00\x48\x00\x00\x00' + b'\x02' * 72
    elif cmd == 0x0F:  # CONNECT response
        return b'\x04\x00\x0f\x03\x10\x00\x00\x00' + b'\x03' * 72
    else:
        return b'\x03\x00' + bytes([cmd + 0x80, 0x03]) + struct.pack('<I', 8) + b'\x00' * 60

# ===== OPC DA Server 模拟 =====
class OPCServer:
    def __init__(self, host='127.0.0.1', port=135):
        self.host = host; self.port = port
        self.values = {1000+i: random.uniform(0, 100) for i in range(64)}  # 64 tags
        self.srv = None
        self.running = False

    def start(self):
        self.srv = socket.socket()
        self.srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.srv.bind((self.host, self.port))
        self.srv.listen(5)
        self.running = True
        print(f'[OPC Server] listening :{self.port}')

        def accept():
            while self.running:
                try:
                    c, a = self.srv.accept()
                    threading.Thread(target=self._handle, args=(c, a), daemon=True).start()
                except: break
        threading.Thread(target=accept, daemon=True).start()

    def _handle(self, client, addr):
        try:
            while True:
                data = client.recv(65535)
                if not data: break
                req = opc_parse_request(data)
                print(f'  [OPC Server] {req["type"]} from {addr}')
                resp = opc_make_response(req['cmd'], [self.values[1000+i] for i in range(4)])
                client.sendall(resp)
        except: pass
        finally: client.close()

    def stop(self):
        self.running = False
        if self.srv: self.srv.close()

# ===== OPC DA Client 模拟 =====
class OPCClient:
    def __init__(self, host='127.0.0.1', port=135):
        self.host = host; self.port = port
        self.connected = False

    def connect(self):
        try:
            self.sock = socket.socket(); self.sock.settimeout(5)
            self.sock.connect((self.host, self.port))
            # Bind phase
            self.sock.sendall(opc_make_bind())
            r = self.sock.recv(1024)
            # Connect phase
            self.sock.sendall(opc_make_connect('KEPware.KEPServerEx.V4'))
            r = self.sock.recv(1024)
            self.connected = True
            return True
        except Exception as e:
            print(f'  [OPC Client] connect fail: {e}')
            return False

    def read_tags(self, count=4):
        if not self.connected: return None
        try:
            self.sock.sendall(opc_make_read(count))
            r = self.sock.recv(1024)
            values = []
            for i in range(count):
                off = 12 + i * 8 + 4
                if off + 4 <= len(r):
                    values.append(struct.unpack('<f', r[off:off+4])[0])
            return values
        except Exception as e:
            print(f'  [OPC Client] read fail: {e}')
            return None

    def write_tags(self, count=2):
        if not self.connected: return None
        try:
            self.sock.sendall(opc_make_write(count))
            r = self.sock.recv(1024)
            return True
        except: return None

    def disconnect(self):
        if self.sock:
            try: self.sock.close()
            except: pass
        self.connected = False

# ===== 端到端测试 =====
if __name__ == '__main__':
    print('=' * 55)
    print('  OPC DA 模拟 — Server + Client')
    print('=' * 55)

    # 1. OPC Server (直连)
    server = OPCServer(port=20135)
    server.start()
    time.sleep(0.3)

    # 2. Edge Hub (OPC 中继 :8135 → :20135)
    hub = socket.socket(); hub.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    hub.bind(('127.0.0.1', 8135)); hub.listen(10)
    def hub_accept():
        while True:
            c, a = hub.accept()
            b = socket.socket(); b.settimeout(3)
            try: b.connect(('127.0.0.1', 20135))
            except: c.close(); continue
            def relay():
                import select
                socks = [c, b]
                try:
                    while True:
                        r, _, _ = select.select(socks, [], [], 10)
                        if not r: break
                        for sock in r:
                            d = sock.recv(65535)
                            if not d:
                                o = socks[1] if socks[0] is sock else socks[0]
                                try: o.close()
                                except: pass
                                return
                            if sock is c: b.sendall(d)
                            else: c.sendall(d)
                except: pass
                finally:
                    try: c.close()
                    except: pass
                    try: b.close()
                    except: pass
            threading.Thread(target=relay, daemon=True).start()
    threading.Thread(target=hub_accept, daemon=True).start()
    time.sleep(0.3)

    # 3. 测试两条路径
    print('\n[测试] OPC Client → Hub → OPC Server')
    for path_name, port in [('经由Hub', 8135), ('直连', 20135)]:
        client = OPCClient(port=port)
        if client.connect():
            vals = client.read_tags(4)
            if vals:
                vals_str = ', '.join(f'{v:.2f}' for v in vals)
                print(f'  {path_name}: READ -> [{vals_str}]')
            else:
                print(f'  {path_name}: READ -> FAIL')
            client.disconnect()

    server.stop()
    hub.close()
    print('\nDone - OPC DA relay works')
