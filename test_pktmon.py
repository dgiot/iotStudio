from winrm.protocol import Protocol
import time, os
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()

# Check if pktmon is available
r = run('pktmon /? 2>&1')
print('pktmon:', r[:300] if 'pktmon' in r.lower() or 'start' in r.lower() else 'NOT FOUND')
p.close_shell(shell)
