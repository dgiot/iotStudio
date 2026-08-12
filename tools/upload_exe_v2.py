#!/usr/bin/env python3
"""上传 EXE 到 131 — v2: 分段文件 + copy /b 拼接"""
import os, sys, base64, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

EXE_PATH = r'D:\ai\dgiot_lite\dist\commbridge_server.exe'
REMOTE_DIR = r'C:\Users\Administrator\cbsrv_parts'

s = winrm.Session(
    'http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=300, operation_timeout_sec=250)

# 创目录
s.run_cmd(f'mkdir {REMOTE_DIR} 2>nul')

# 直接上传原始EXE，分片（不用base64，用certutil分段）
# 方案: 用 PowerShell [IO.File]::WriteAllBytes 写分片

with open(EXE_PATH, 'rb') as f:
    exe_data = f.read()

total_size = len(exe_data)
print(f'EXE: {total_size/1024/1024:.1f} MB')

# 分成 500KB 一段，每段用 base64 + certutil 单独上传
CHUNK = 500 * 1024
parts = []
for i in range(0, total_size, CHUNK):
    chunk = exe_data[i:i+CHUNK]
    b64 = base64.b64encode(chunk).decode()
    parts.append(b64)

print(f'Parts: {len(parts)} x ~{CHUNK/1024:.0f} KB')

# 上传每个 part
part_files = []
for idx, b64_part in enumerate(parts):
    part_b64_path = REMOTE_DIR + f'\\part_{idx:03d}.b64'
    part_exe_path = REMOTE_DIR + f'\\part_{idx:03d}.bin'

    # 直接通过 PS WriteAllBytes 写 base64 字符串
    # 先尝试用 certutil 方式: 直接用 PS 写 base64 文件
    ps_script = (
        f"$b64 = '{b64_part}'; "
        f"[IO.File]::WriteAllText('{part_b64_path}', $b64, [Text.Encoding]::ASCII)"
    )
    r = s.run_ps(ps_script)
    err = r.std_err.decode('gbk', errors='ignore').strip()

    if err and 'CLIXML' not in err:
        print(f'  Part {idx}: ERR writing b64: {err[:100]}')
        continue

    # certutil decode
    r = s.run_cmd(f'certutil -decode {part_b64_path} {part_exe_path}')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    if 'successfully' in out.lower() or '成功' in out:
        part_files.append(part_exe_path)
        print(f'  Part {idx}: OK ({len(chunk)/1024:.0f} KB)')
    else:
        print(f'  Part {idx}: FAIL decode')

    # 清理 b64
    s.run_cmd(f'del {part_b64_path}')

# 拼接
if part_files:
    print(f'\nJoining {len(part_files)} parts...')
    files_list = ' + '.join(part_files)
    final_path = r'C:\Users\Administrator\commbridge_server.exe'
    s.run_cmd(f'copy /b {files_list} {final_path}')

    # 验证
    r = s.run_cmd(f'dir {final_path}')
    info = r.std_out.decode('gbk', errors='ignore').strip()
    print(f'\nResult:\n{info}')

    # 清理 parts
    for pf in part_files:
        s.run_cmd(f'del {pf}')
    s.run_cmd(f'rmdir {REMOTE_DIR}')

    print('\nUpload complete!')
else:
    print('\nFAILED: no parts uploaded')
