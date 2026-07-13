#!/usr/bin/env python3
"""
通用 IO 服务器扫描器
================================
用法: python scan_io.py io_config.json
      python scan_io.py --ip 11.66.12.131 --user admin --pass xxx

配置只需 5 项:
  ip, user, password  (必须)
  vendor_keywords     (可选, 默认扫常见品牌)
  target_ports        (可选, 默认扫常见工控端口)
"""
import os, sys, json, argparse

def load_config(args):
    """从命令行或配置文件加载"""
    cfg = {
        'ip': '127.0.0.1', 'port': 5985, 'transport': 'ntlm',
        'user': '', 'password': '',
        'vendor_keywords': 'force|opc|rslinx|iomonitor|factory|rockwell|harmony|wonderware|intouch|ifix|wincc|kepware|matrikon|siemens|ab|modicon|mitsubishi|omron|schneider|beckhoff|wago|codesys',
        'target_ports': '8889 502 135 53001 4840 4841 102 44818 2222 9600 5000',
        'scan_drives': ['C:', 'D:', 'E:'],
        'scan_dirs': ['Program Files', 'Program Files (x86)'],
    }

    if args.config:
        with open(args.config) as f:
            cfg.update(json.load(f))

    for k in ('ip', 'user', 'password', 'transport'):
        if getattr(args, k, None):
            cfg[k] = getattr(args, k)

    return cfg


def scan(cfg):
    """核心扫描逻辑 — WinRM"""
    os.environ['NO_PROXY'] = cfg['ip']
    import winrm

    s = winrm.Session(
        f"http://{cfg['ip']}:{cfg['port']}/wsman",
        auth=(cfg['user'], cfg['password']),
        transport=cfg['transport'],
        read_timeout_sec=60,
    )

    def ps(script):
        try:
            r = s.run_ps(script)
            return (r.std_out.decode('gbk', errors='ignore') + '\n' +
                    r.std_err.decode('gbk', errors='ignore')).strip()[:5000]
        except Exception as e: return f'ERR: {e}'

    def cmd(command):
        try:
            r = s.run_cmd(command)
            return (r.std_out.decode('gbk', errors='ignore') + '\n' +
                    r.std_err.decode('gbk', errors='ignore')).strip()[:5000]
        except Exception as e: return f'ERR: {e}'

    report = {'ip': cfg['ip'], 'hostname': '', 'os': '', 'processes': [],
              'services': [], 'software': [], 'ports': [], 'opc': [],
              'directories': {}, 'raw': {}}

    # 1. Host info
    report['hostname'] = cmd('hostname').strip()
    report['os'] = cmd('ver').strip()

    # 2. Scan drives
    for drive in cfg['scan_drives']:
        result = cmd(f'cmd /c "dir /b {drive}\\ 2>nul"')
        if result and '(empty)' not in result:
            report['directories'][drive] = result.strip()

    # 3. Processes (vendor keywords)
    keywords = cfg['vendor_keywords']
    result = ps(f"Get-Process | Where-Object {{ $_.ProcessName -match '{keywords}' }} | Select Name,Id | Format-Table -AutoSize")
    report['raw']['processes'] = result

    # 4. Services
    result = cmd(f'sc query state= all 2>nul | findstr /i "{keywords.replace("|", " ")}"')
    report['raw']['services'] = result

    # 5. Installed software (x64 + x86)
    for arch, hive in [('x64', 'SOFTWARE'), ('x86', 'SOFTWARE\\WOW6432Node')]:
        result = ps(f"Get-ItemProperty 'HKLM:\\{hive}\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {{$_.DisplayName -match '{keywords}'}} | Select DisplayName | Format-List")
        report['raw'][f'software_{arch}'] = result

    # 6. OPC AppIDs + ProgIDs
    result = ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes\\AppID' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -match 'OPC|OpcRcw|Automation|ServerList'} | ForEach-Object {$_.PSChildName}")
    report['raw']['opc_appids'] = result

    result = ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -like 'OPC.*'} | Select -First 30 PSChildName")
    report['raw']['opc_progids'] = result

    # 7. Listening ports
    result = cmd(f'netstat -an 2>nul | findstr "{cfg["target_ports"]}"')
    report['raw']['ports'] = result

    # 8. OPC DLLs
    result = cmd('cmd /c "dir C:\\Windows\\System32\\opc*.dll C:\\Windows\\SysWOW64\\opc*.dll 2>nul"')
    report['raw']['opc_dlls'] = result

    return report


def main():
    parser = argparse.ArgumentParser(description='通用 IO 服务器扫描器')
    parser.add_argument('config', nargs='?', help='配置文件 (JSON)')
    parser.add_argument('--ip', help='IO 服务器 IP')
    parser.add_argument('--user', help='WinRM 用户名')
    parser.add_argument('--password', help='WinRM 密码')
    parser.add_argument('--transport', default='ntlm', help='认证方式')
    parser.add_argument('-o', '--output', help='输出文件 (JSON)')
    args = parser.parse_args()

    if not args.config and not args.ip:
        parser.print_help()
        print('\n最少参数: --ip 11.66.12.131 --user admin --pass xxx')
        return

    cfg = load_config(args)
    if not cfg['user'] or not cfg['password']:
        print('ERROR: 需要 --user 和 --password')
        return

    print(f'扫描 {cfg["ip"]}:{cfg["port"]} ...')
    report = scan(cfg)

    j = json.dumps(report, indent=2, ensure_ascii=False)
    print(j)
    if args.output:
        with open(args.output, 'w') as f:
            f.write(j)
        print(f'\nSaved: {args.output}')


if __name__ == '__main__':
    main()
