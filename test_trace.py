from winrm.protocol import Protocol
import time
p = Protocol(endpoint="http://11.66.12.131:5985/wsman", transport="ntlm",
    username="administrator", password=r"GKYWB-5991792$1c8k")
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, err, _ = p.get_command_output(shell, cid)
    return out.decode("gbk", errors="ignore").strip()
r = run("netsh trace start capture=yes tracefile=C:/Users/Administrator/rem_cap.etl maxsize=80 persistent=no 2>&1")
print("Start:", r[:300])
if "Running" in r:
    time.sleep(10)
    print("Stop:", run("netsh trace stop 2>&1")[:200])
p.close_shell(shell)
