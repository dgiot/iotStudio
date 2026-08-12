#!/usr/bin/env python3
"""下载 DTU DLL 文件并本地分析 strings"""
import os, sys, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session(
    'http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)

# 下载目标 DTU DLL
targets = [
    ('DTU_DQQY/DTUAPI.dll', '某工业基地专用'),
    ('DTU_SUNWAY/DTUAPI.dll', '桑威'),
    ('DTU_HONGDIAN/DTUAPI.dll', '宏电'),
]

local_dir = r'D:\ai\dgiot_lite\reverse\commbridge\dtu_dlls'
os.makedirs(local_dir, exist_ok=True)

base = r'E:\IO ServerOnLine\DTU'

for dll_path, desc in targets:
    full_path = f'{base}\\{dll_path.replace("/", "\\\\")}'
    local_name = dll_path.replace('/', '_')
    local_path = os.path.join(local_dir, local_name)

    print(f'\n=== {desc}: {dll_path} ===')

    # 上传 certutil 编码
    b64_remote = f'C:\\Users\\Administrator\\{local_name}.b64'
    r = s.run_cmd(f'certutil -encode "{full_path}" {b64_remote}')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    if 'The system cannot find' in out:
        print(f'  FILE NOT FOUND: {full_path}')
        continue

    # 下载 base64
    r = s.run_ps(f'Get-Content {b64_remote} -Raw')
    b64 = r.std_out.decode('gbk', errors='ignore')
    lines = [l for l in b64.split('\n') if l.strip() and not l.strip().startswith('---')]
    data = base64.b64decode(''.join(lines))
    with open(local_path, 'wb') as f:
        f.write(data)
    print(f'  已下载: {len(data)} bytes -> {local_path}')

    # 提取 strings (Python 本地分析)
    strings = []
    for i in range(len(data)):
        # 查找ASCII可打印字符串(>=4字符)
        if 0x20 <= data[i] <= 0x7E:
            end = i
            while end < len(data) and 0x20 <= data[end] <= 0x7E:
                end += 1
            if end - i >= 4:
                s = data[i:end].decode('ascii', errors='ignore')
                strings.append(s)
                i = end

    # 过滤感兴趣的字符串
    keywords = ['DTU', 'ID', 'IMEI', 'REG', 'LOGIN', 'HEART', 'PORT', 'IP',
                'TCP', 'UDP', 'SEND', 'RECV', 'DATA', 'AT+', 'MODBUS', 'CRC',
                'SLAVE', 'ADDR', 'USER', 'PASS', 'AUTH', 'KEEP', 'ALIVE']
    interesting = [s for s in strings if any(kw in s.upper() for kw in keywords)]

    with open(local_path + '.strings.txt', 'w', encoding='utf-8') as f:
        f.write(f'Total strings: {len(strings)}\n')
        f.write(f'Interesting: {len(interesting)}\n\n')
        f.write('=== All strings ===\n')
        for s in strings[:500]:
            f.write(f'  {s}\n')
        f.write('\n=== Interesting ===\n')
        for s in interesting:
            f.write(f'  {s}\n')

    print(f'  Strings: 总数{len(strings)}, 相关{len(interesting)}')
    print(f'  已保存到: {local_path}.strings.txt')

    # 显示最相关的
    if interesting:
        print(f'  Top strings:')
        for s in interesting[:20]:
            print(f'    {s}')
