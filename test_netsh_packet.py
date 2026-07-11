from winrm.protocol import Protocol
import time
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()

# List available providers and scenarios
r = run('netsh trace show scenarios 2>&1')
print('Scenarios:', r[:500])

# Try NetConnection scenario which includes packet capture
run('netsh trace stop')
time.sleep(1)
r = run('netsh trace start scenario=NetConnection capture=yes tracefile=C:/Users/Administrator/rem_pkt.etl maxsize=80 persistent=no 2>&1')
print('\nStart:', r[:300])
p.close_shell(shell)
