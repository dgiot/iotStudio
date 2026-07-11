from winrm.protocol import Protocol
p = Protocol(endpoint="http://11.66.12.131:5985/wsman", transport="ntlm",
    username="administrator", password=r"GKYWB-5991792$1c8k")
shell = p.open_shell()
def run(cmd):
    cid = p.run_command(shell, cmd)
    out, _, _ = p.get_command_output(shell, cid)
    return out.decode("gbk", errors="ignore").strip()
r = run('powershell -c "Get-ChildItem -Path C:/Users -Recurse -Filter *.pcapng -ErrorAction SilentlyContinue | Select FullName,Length | Format-List"')
print("Found:", r[:800])
p.close_shell(shell)
