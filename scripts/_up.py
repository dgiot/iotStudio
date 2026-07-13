from winrm.protocol import Protocol
import base64, sys
p = Protocol(endpoint="http://11.66.12.131:5985/wsman", transport="ntlm",
    username="administrator", password=r"GKYWB-5991792$1c8k")
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode("gbk", errors="ignore").strip()

local = sys.argv[1]
remote = sys.argv[2]
with open(local, "rb") as f:
    b64 = base64.b64encode(f.read()).decode()
t = remote.replace("\\", "/") + ".b64"
for i in range(0, len(b64), 2000):
    op = ">" if i == 0 else ">>"
    run(f"echo {b64[i:i+2000]} {op} {t} 2>&1")
run(f"certutil -decode {t} {remote.replace(chr(92), chr(47))} 2>&1")
print("Uploaded")
p.close_shell(shell)
