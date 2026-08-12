"""在 131 上启动自定义 IOMan 实例 — 自主选择采集参数"""
import os, time, sys
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# User-configurable parameters
CUSTOM_SHARED_ID = 'IOCUSTOM01'
HWND = '3B6C0B5C'  # IoMonitor HWND
DEVTYPE = '0'       # 0=OPC, 1=Modbus
DBNAME = 'IOCommitDB0'
DEVICES = sys.argv[1] if len(sys.argv) > 1 else '02204060100,02204060111'
dev_list = DEVICES.split(',')
COUNT = str(len(dev_list))

cmdline = f'-aaa {CUSTOM_SHARED_ID},{HWND},{DEVTYPE},{DBNAME},{COUNT}:{DEVICES}'
print(f'Custom IOMan: {cmdline}')

# Check IoMonitor status
print('\n=== IoMonitor ===')
r = s.run_cmd('tasklist /FI "IMAGENAME eq IoMonitor.exe" /FO CSV 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip())

# Check IOMan count before
r = s.run_cmd('tasklist /FI "IMAGENAME eq IOMan.exe" 2>nul | find /c "IOMan"')
before = r.std_out.decode('gbk', errors='ignore').strip()
print(f'\nIOMan count before: {before}')

# Launch custom IOMan
print(f'\nLaunching...')
launch_cmd = f'cd /d "E:\\IO ServerOnLine" && start /b IOMan.exe {cmdline} > C:\\Users\\Administrator\\ioman_custom.log 2>&1'
r = s.run_cmd(launch_cmd)
time.sleep(5)

# Verify
r = s.run_cmd('tasklist /FI "IMAGENAME eq IOMan.exe" 2>nul | find /c "IOMan"')
after = r.std_out.decode('gbk', errors='ignore').strip()
print(f'IOMan count after: {after}')

# Check log
log_cmd = 'cmd /c "type C:\\Users\\Administrator\\ioman_custom.log 2>nul"'
r = s.run_cmd(log_cmd)
log = r.std_out.decode('gbk', errors='ignore').strip()
print(f'\nIOMan log:')
print(log[:1000] if log else '(empty)')

# Check if IOMan is still running
r = s.run_cmd('tasklist /FI "IMAGENAME eq IOMan.exe" /FO CSV /V 2>nul | findstr /C:"IOCUSTOM"')
custom = r.std_out.decode('gbk', errors='ignore').strip()
print(f'\nCustom IOMan running: {custom if custom else \"NO\"}')
