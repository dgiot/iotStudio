#!/usr/bin/env python3
"""本地 IO 接管模拟 — 单进程端到端验证"""
import socket, struct, select, threading, time, os, sys

# ===== 配置 =====
MOCK_IO_PORT = 19999      # 模拟原IO
PROXY_PORT = 8889          # 代理监听
REAL_A11 = True            # True=用真实5a5a帧, False=用普通数据

# ===== 1. 模拟原IO服务器 =====
def start_mock_io():
    srv = socket.socket()
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(('127.0.0.1', MOCK_IO_PORT))
    srv.listen(5)
    print(f'[MockIO] :{MOCK_IO_PORT} started')
    def accept():
        while True:
            c, a = srv.accept()
            def handle():
                try:
                    while True:
                        d = c.recv(65535)
                        if not d: break
                        c.sendall(d)  # echo back
                except: pass
                c.close()
            threading.Thread(target=handle, daemon=True).start()
    threading.Thread(target=accept, daemon=True).start()
    return srv

# ===== 2. 代理 =====
def start_proxy(target_host, target_port, proxy_port):
    psrv = socket.socket()
    psrv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    psrv.bind(('127.0.0.1', proxy_port))
    psrv.listen(10)
    print(f'[Proxy] :{proxy_port} -> {target_host}:{target_port}')

    stats = {'sessions': 0, 'rx': 0, 'tx': 0, 'rx_bytes': 0, 'tx_bytes': 0}

    def relay(client, addr):
        backend = socket.socket()
        try:
            backend.settimeout(3)
            backend.connect((target_host, target_port))
        except:
            print(f'  [WARN] backend {target_host}:{target_port} unreachable')
            client.close(); return

        stats['sessions'] += 1
        socks = [client, backend]
        try:
            while True:
                r, _, _ = select.select(socks, [], [], 30)
                if not r: break
                for sock in r:
                    data = sock.recv(65535)
                    if not data:
                        other = socks[1] if socks[0] is sock else socks[0]
                        try: other.close()
                        except: pass
                        return
                    if sock is client:
                        backend.sendall(data)
                        # A11 frame detection
                        buf = data
                        while len(buf) >= 6:
                            pos = buf.find(b'\x5a\x5a')
                            if pos < 0: break
                            flen = struct.unpack('<H', buf[pos+2:pos+4])[0] + 2
                            if flen > len(buf): break
                            stats['rx'] += 1
                            stats['rx_bytes'] += flen
                            buf = buf[pos+flen:]
                    else:
                        client.sendall(data)
                        buf = data
                        while len(buf) >= 6:
                            pos = buf.find(b'\x5a\x5a')
                            if pos < 0: break
                            flen = struct.unpack('<H', buf[pos+2:pos+4])[0] + 2
                            if flen > len(buf): break
                            stats['tx'] += 1
                            stats['tx_bytes'] += flen
                            buf = buf[pos+flen:]
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

# ===== 3. IoCommit 模拟客户端 =====
def run_client(name, frames, proxy_port):
    results = []
    for i, frame in enumerate(frames):
        try:
            s = socket.socket(); s.settimeout(5)
            s.connect(('127.0.0.1', proxy_port))
            s.sendall(frame)
            r = s.recv(65535)
            s.close()
            mt = f'0x{struct.unpack("<H", frame[8:10])[0]:04X}' if len(frame)>=10 and REAL_A11 else 'RAW'
            ok = len(r) > 0
            results.append(ok)
            status = 'OK' if ok else 'FAIL'
            print(f'  [{name}] {mt} {len(frame)}B -> {len(r)}B {status}')
        except Exception as e:
            results.append(False)
            print(f'  [{name}] frame {i} ERROR: {e}')
        time.sleep(0.2)
    return results

# ===== Main =====
if __name__ == '__main__':
    print('=' * 55)
    print('  IO 接管 - 本地模拟测试')
    print('=' * 55)

    # Start Mock IO
    mock = start_mock_io()
    time.sleep(0.2)

    # Start Proxy
    proxy, stats = start_proxy('127.0.0.1', MOCK_IO_PORT, PROXY_PORT)
    time.sleep(0.3)

    # Test data
    if REAL_A11:
        frames = [
            bytes.fromhex('5a5a130000000a00f0502f000900000a00'),       # heartbeat query 17B
            bytes.fromhex('5a5a1d0000000a00f0502f000900800a00000000'), # heartbeat resp 29B
            bytes.fromhex('5a5ab2040100260062f02f000900000a000000'),   # device list 19B
            bytes.fromhex('5a5a1d0000000a0063f02f000900000a00'),       # ack 29B
            bytes.fromhex('5a5a260000000a00366637000800000a00'),        # data query 17B
            bytes.fromhex('5a5af20200003900366737000800000a002a000000'),# data resp 21B
        ]
    else:
        frames = [f'TEST_FRAME_{i}'.encode() for i in range(6)]

    print(f'\n[Test] {len(frames)} frames, 2 clients')
    print()

    # Run clients
    all_results = []
    threads = []
    for i in range(2):
        t = threading.Thread(
            target=lambda n=i: all_results.extend(run_client(f'IoCommit-{n+1}', frames, PROXY_PORT)))
        threads.append(t)
        t.start()

    for t in threads:
        t.join(timeout=30)

    # Results
    total_ok = sum(all_results)
    total = len(all_results)
    print()
    print('=' * 55)
    print(f'  结果: {total_ok}/{total} 帧 OK')
    print(f'  代理会话: {stats["sessions"]}')
    print(f'  RX 帧: {stats["rx"]}  TX 帧: {stats["tx"]}')
    print(f'  RX 字节: {stats["rx_bytes"]}  TX 字节: {stats["tx_bytes"]}')

    if REAL_A11:
        expected_sessions = 2
        expected_frames = len(frames) * 2
    else:
        expected_sessions = 2
        expected_frames = 6

    if total_ok == total and stats['sessions'] >= expected_sessions:
        print(f'  => 模拟成功!')
    else:
        print(f'  => 部分失败, 需检查')
    print('=' * 55)

    # Cleanup
    mock.close()
    proxy.close()
