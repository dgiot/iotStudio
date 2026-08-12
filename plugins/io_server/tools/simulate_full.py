#!/usr/bin/env python3
"""DMZ边缘中枢 — 三协议全模拟测试"""
import socket, struct, select, threading, time, sys

# ===== 配置 =====
MOCK_A11_IO = ('127.0.0.1', 19999)     # A11 IO 模拟
MOCK_MODBUS_RTU = ('127.0.0.1', 20502)  # Modbus RTU 模拟
HUB_A11_PORT = 8889     # A11 代理端口
HUB_MODBUS_PORT = 8502  # Modbus 代理端口
# OPC DA: 需 Matrikon 模拟器, 暂跳过

results = {'A11': [], 'Modbus': [], 'OPC': 'SKIP'}

# ===== 1. A11 IO 模拟 =====
def start_a11_io():
    srv = socket.socket(); srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(MOCK_A11_IO); srv.listen(5)
    def accept():
        while True:
            c, a = srv.accept()
            def h():
                try:
                    while True:
                        d = c.recv(65535)
                        if not d: break
                        c.sendall(d)  # echo
                except: pass
                c.close()
            threading.Thread(target=h, daemon=True).start()
    threading.Thread(target=accept, daemon=True).start()
    return srv

# ===== 2. Modbus RTU 模拟 =====
def start_modbus_rtu():
    srv = socket.socket(); srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(MOCK_MODBUS_RTU); srv.listen(5)
    def accept():
        while True:
            c, a = srv.accept()
            def h():
                try:
                    while True:
                        d = c.recv(65535)
                        if not d: break
                        # Modbus 响应: 原样echo (模拟测试)
                        c.sendall(d)
                except: pass
                c.close()
            threading.Thread(target=h, daemon=True).start()
    threading.Thread(target=accept, daemon=True).start()
    return srv

# ===== 3. 边缘中枢 (通用TCP中继) =====
def start_hub(listen_port, target_host, target_port, name, result_key):
    psrv = socket.socket()
    psrv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    psrv.bind(('127.0.0.1', listen_port))
    psrv.listen(10)
    print(f'  [{name}] :{listen_port} -> {target_host}:{target_port}')
    stats = {'sessions': 0, 'ok': 0, 'fail': 0}
    def relay(client, addr):
        backend = socket.socket()
        try:
            backend.settimeout(3)
            backend.connect((target_host, target_port))
        except:
            client.close(); stats['fail'] += 1; return
        stats['sessions'] += 1
        socks = [client, backend]
        try:
            while True:
                r, _, _ = select.select(socks, [], [], 10)
                if not r: break
                for sock in r:
                    d = sock.recv(65535)
                    if not d:
                        other = socks[1] if socks[0] is sock else socks[0]
                        try: other.close()
                        except: pass
                        return
                    if sock is client:
                        backend.sendall(d)
                    else:
                        client.sendall(d)
        except: pass
        finally:
            try: client.close()
            except: pass
            try: backend.close()
            except: pass
    def accept_loop():
        while True:
            c, a = psrv.accept()
            threading.Thread(target=relay, args=(c, a), daemon=True).start()
    threading.Thread(target=accept_loop, daemon=True).start()
    return psrv, stats

# ===== 4. 客户端模拟 =====
def run_client(name, port, frames, result_key):
    ok = 0
    total = len(frames)
    for i, f in enumerate(frames):
        try:
            s = socket.socket(); s.settimeout(5)
            s.connect(('127.0.0.1', port))
            s.sendall(f)
            r = s.recv(65535)
            s.close()
            ok += (1 if len(r) > 0 else 0)
        except Exception as e:
            pass
        time.sleep(0.15)
    results[result_key].append(ok)
    print(f'  [{name}] {ok}/{total} OK')

# ===== Main =====
if __name__ == '__main__':
    print('=' * 55)
    print('  DMZ 边缘中枢 — 全协议模拟测试')
    print('=' * 55)

    # 启动模拟服务器
    print('\n[模拟后端]')
    aio = start_a11_io()
    mrtu = start_modbus_rtu()
    time.sleep(0.2)

    # 启动边缘中枢
    print('\n[边缘中枢]')
    a11_hub, a11_stats = start_hub(HUB_A11_PORT, MOCK_A11_IO[0], MOCK_A11_IO[1], 'A11', 'A11')
    mb_hub, mb_stats = start_hub(HUB_MODBUS_PORT, MOCK_MODBUS_RTU[0], MOCK_MODBUS_RTU[1], 'Modbus', 'Modbus')
    time.sleep(0.5)

    # 预热连接
    try:
        s = socket.socket(); s.settimeout(2)
        s.connect(('127.0.0.1', HUB_A11_PORT)); s.close()
        s = socket.socket(); s.settimeout(2)
        s.connect(('127.0.0.1', HUB_MODBUS_PORT)); s.close()
    except: pass
    time.sleep(0.2)

    # A11 测试帧
    a11_frames = [
        bytes.fromhex('5a5a130000000a00f0502f000900000a00'),
        bytes.fromhex('5a5a1d0000000a00f0502f000900800a00000000'),
        bytes.fromhex('5a5ab2040100260062f02f000900000a000000'),
    ] * 2  # 6帧

    # Modbus 测试帧 (标准读保持寄存器)
    mb_frames = [
        bytes.fromhex('00010000000601030000000a'),  # 读10个寄存器
        bytes.fromhex('00020000000601100000000a'),  # 读10个寄存器
        bytes.fromhex('000300000006011000000005'),  # 读5个寄存器
    ] * 2

    # 运行客户端
    print('\n[客户端测试]')
    threads = [
        threading.Thread(target=run_client, args=('IoCommit-1', HUB_A11_PORT, a11_frames, 'A11')),
        threading.Thread(target=run_client, args=('IoCommit-2', HUB_A11_PORT, a11_frames, 'A11')),
        threading.Thread(target=run_client, args=('ModbusCli-1', HUB_MODBUS_PORT, mb_frames, 'Modbus')),
        threading.Thread(target=run_client, args=('ModbusCli-2', HUB_MODBUS_PORT, mb_frames, 'Modbus')),
    ]
    for t in threads: t.start()
    for t in threads: t.join(timeout=20)

    # 结果
    a11_total = sum(results['A11'])
    a11_max = len(a11_frames) * 2  # 2 clients
    mb_total = sum(results['Modbus'])
    mb_max = len(mb_frames) * 2

    sep = '=' * 55
    print(f'\n{sep}')
    print(f'  结果:')
    print(f'  A11:     {a11_total}/{a11_max} ({a11_stats["sessions"]} sessions)')
    print(f'  Modbus:  {mb_total}/{mb_max} ({mb_stats["sessions"]} sessions)')
    print(f'  OPC DA:  {results["OPC"]} (需Matrikon OPC模拟器)')
    all_ok = a11_total == a11_max and mb_total == mb_max
    print(f'  总评:    {"PASS" if all_ok else "PARTIAL"}')
    print(sep)

    aio.close(); mrtu.close(); a11_hub.close(); mb_hub.close()
