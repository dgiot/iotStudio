from winrm.protocol import Protocol
import time
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()

# Stop old trace
run('netsh trace stop')
time.sleep(1)

# Start fresh
r = run('netsh trace start capture=yes tracefile=C:/Users/Administrator/rem_cap.etl maxsize=80 persistent=no')
print('Start:', r[:200])
time.sleep(20)
run('netsh trace stop')

# Convert ETL -> CSV
r = run('tracerpt C:/Users/Administrator/rem_cap.etl -o C:/Users/Administrator/rem_cap.csv -of CSV')
print('Tracerpt done')

# Show first 500 chars of CSV to understand format  
r = run('powershell -c "Get-Content C:/Users/Administrator/rem_cap.csv -Encoding UTF8 -First 30"')
print('CSV sample:')
print(r[:1500])
p.close_shell(shell)
