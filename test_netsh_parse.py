from winrm.protocol import Protocol
import time
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()

time.sleep(25)
run('netsh trace stop')

# Convert and find A11 traffic
r = run('tracerpt C:/Users/Administrator/rem_pkt.etl -o C:/Users/Administrator/rem_pkt.csv -of CSV -summary C:/Users/Administrator/rem_pkt.xml 2>&1')
print('Tracerpt done')
# Search for A11 (8889) or Modbus patterns
r = run('powershell -c "Get-Content C:/Users/Administrator/rem_pkt.csv -Encoding UTF8 | Select-String 8889,502,5a5a | Select -First 10"')
print('Results:', len(r.splitlines()) if r else 0)
print(r[:1500] if r else 'No matches')
p.close_shell(shell)
