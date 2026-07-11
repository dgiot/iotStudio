from winrm.protocol import Protocol
import time
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, err, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()
r = run('netsh trace start capture=yes tracefile=C:\Users\Administrator\rem_cap.etl maxsize=80 persistent=no 2>&1')
print('Start:', r[:300])
if 'Running' in r:
    time.sleep(10)
    print('Stop:', run('netsh trace stop 2>&1')[:200])
    ps = r'powershell -c "tracerpt C:\Users\Administrator\rem_cap.etl -o C:\Users\Administrator\rem_cap.csv -of CSV 2>&1; Get-Content C:\Users\Administrator\rem_cap.csv -Encoding UTF8 | Select-String 8889,53001 | Select -First 5"'
    print('Parse:', run(ps)[:500])
p.close_shell(shell)
