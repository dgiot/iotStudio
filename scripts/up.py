from winrm.protocol import Protocol; import base64, sys
p = Protocol(endpoint='http://11.66.12.131:5985/wsman', transport='ntlm',
    username='administrator', password=r'GKYWB-5991792$1c8k')
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode('gbk', errors='ignore').strip()
local = sys.argv[1]
remote = sys.argv[2]
with open(local, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
run(f'powershell -c "Remove-Item {remote} -Force -ErrorAction SilentlyContinue"')
for i in range(0, len(b64), 2000):
    op = ">" if i == 0 else ">>"
    run(f'echo {b64[i:i+2000]} {op} D:/temp/_b64.txt 2>&1')
run('certutil -decode D:/temp/_b64.txt ' + remote + ' 2>&1')
r = run('powershell -ExecutionPolicy Bypass -File ' + remote + ' 2>&1')
print(r if r else 'NO OUTPUT')
p.close_shell(shell)
