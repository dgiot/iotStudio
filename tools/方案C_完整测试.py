#!/usr/bin/env python3
"""方案C完整测试: 开发机Server ← 131端口转发 ← RTU模拟"""
import asyncio, sys, os, time, base64

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from src.protocols.commbridge_server import LegacyCommServer

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

# ═══════ Monitor ═══════
class Monitor:
    events = []
    def emit(self, key, **kw):
        self.events.append((key, kw))
        vs = kw.get('values', {})
        s = ', '.join(f'{k}={v:.2f}' for k,v in list(vs.items())[:3])
        print(f'  [SRV] {key.split(".")[-1]:20s} {kw.get("dtu_id","?"):16s} | {s}')

monitor = Monitor()

async def run_server():
    srv = LegacyCommServer(event_bus=monitor, port=53002, host='0.0.0.0')
    await srv.start()
    print('[SRV] READY on :53002\n')
    await asyncio.sleep(45)
    await srv.stop()
    return srv

# ═══════ Upload PS1 to 131 ═══════
def upload_and_run():
    ps1_path = os.path.join(os.path.dirname(__file__), 'rtu_field_sim.ps1')
    with open(ps1_path, 'rb') as f:
        ps1_content = f.read()

    b64_content = base64.b64encode(ps1_content).decode()

    s = winrm.Session(
        'http://127.0.0.1:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

    # Step 1: Write base64 to file
    b64_file = r'C:\Users\Administrator\rtu_sim.b64'
    ps1_file = r'C:\Users\Administrator\rtu_sim.ps1'

    # Use chunked writing to avoid command line limits
    chunk_size = 4000
    # First clear the file
    s.run_cmd(f'echo. > {b64_file}')
    for i in range(0, len(b64_content), chunk_size):
        chunk = b64_content[i:i+chunk_size]
        # Use PowerShell to append
        ps_cmd = f"Add-Content -Path '{b64_file}' -Value '{chunk}' -NoNewline"
        s.run_ps(ps_cmd)

    # Step 2: Decode
    s.run_cmd(f'certutil -decode {b64_file} {ps1_file}')
    time.sleep(1)

    # Step 3: Run
    print('[WINRM] Running RTU simulator on 131...')
    r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\rtu_sim.ps1')
    output = r.std_out.decode('gbk', errors='ignore').strip()
    print(output)
    return output

# ═══════ Main ═══════
async def main():
    print("=" * 70)
    print("  方案C: 开发机 :53002 ← 131端口转发 ← RTU")
    print("=" * 70)

    # Start server
    srv_task = asyncio.create_task(run_server())
    await asyncio.sleep(2)

    # Run RTU sim on 131
    output = upload_and_run()

    await asyncio.sleep(3)

    # Stats
    data_events = [e for e in monitor.events if 'data.received' in e[0]]
    print(f"\n{'='*70}")
    print(f"  方案C 测试结果")
    print(f"{'='*70}")
    print(f"  Server事件: {len(monitor.events)}")
    print(f"  遥测数据:   {len(data_events)} 条")

    if data_events:
        for i, (key, kw) in enumerate(data_events):
            vals = kw.get('values', {})
            items = list(vals.items())[:3]
            s = ', '.join(f'{k}={v:.2f}' for k,v in items)
            print(f"    #{i+1}: {kw.get('dtu_id','?')} | {s}")

    # Cleanup portproxy
    s = winrm.Session(
        'http://127.0.0.1:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)
    s.run_cmd(r'netsh interface portproxy delete v4tov4 listenport=53002 listenaddress=127.0.0.1')
    print("\n  端口转发已清理")
    print("  方案C测试完成!")

    srv_task.cancel()
    try: await srv_task
    except: pass

asyncio.run(main())
