from winrm.protocol import Protocol
import time
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()

# Stop old
run('netsh trace stop')
time.sleep(1)
# Start with TCPIP provider for packet payload capture
r = run('netsh trace start capture=yes provider=Microsoft-Windows-TCPIP tracefile=C:/Users/Administrator/rem_cap2.etl maxsize=80 persistent=no')
print('Start:', r[:200])
if 'Running' in r:
    time.sleep(20)
    run('netsh trace stop')
    # Convert to text
    r2 = run('tracerpt C:/Users/Administrator/rem_cap2.etl -o C:/Users/Administrator/rem_cap2.csv -of CSV')
    # Look for port 8889 (A11) or 502 (Modbus) in output
    r3 = run('powershell -c "Get-Content C:/Users/Administrator/rem_cap2.csv -Encoding UTF8 | Select-String 8889,502"')
    print('Matches:', len(r3.splitlines()) if r3 else 0)
    if r3: print(r3[:800])
p.close_shell(shell)
