from winrm.protocol import Protocol; import base64, os, sys

def upload_file(local_path, remote_path):
    p = Protocol(endpoint="http://11.66.12.131:5985/wsman", transport="ntlm",
        username="administrator", password=r"GKYWB-5991792$1c8k")
    shell = p.open_shell()
    def run(cmd):
        cid = p.run_command(shell, cmd)
        out, _, _ = p.get_command_output(shell, cid)
        return out.decode("gbk", errors="ignore").strip()
    
    with open(local_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    
    tmp = remote_path.replace("\\", "/") + ".b64"
    for i in range(0, len(b64), 2000):
        op = ">" if i == 0 else ">>"
        run(f"echo {b64[i:i+2000]} {op} {tmp} 2>&1")
    r = run(f"certutil -decode {tmp} {remote_path.replace(chr(92),chr(47))} 2>&1")
    ok = "success" in r.lower() or not r
    print(f"{os.path.basename(local_path)}: OK" if ok else f"FAIL: {r[:100]}")
    p.close_shell(shell)
    return ok

local = sys.argv[1]
remote = sys.argv[2]
upload_file(local, remote)

if len(sys.argv) > 3 and sys.argv[3] == "--register":
    p = Protocol(endpoint="http://11.66.12.131:5985/wsman", transport="ntlm",
        username="administrator", password=r"GKYWB-5991792$1c8k")
    shell = p.open_shell()
    def run(cmd):
        cid = p.run_command(shell, cmd)
        out, _, _ = p.get_command_output(shell, cid)
        return out.decode("gbk", errors="ignore").strip()
    rremote = remote.replace(chr(92), chr(47))
    run(f"C:/Windows/SysWOW64/regsvr32.exe /s {rremote} 2>&1")
    print("Registered")
    for pid in ["OPC.Automation.1","OPC.Automation","OPCAutomation.OPCServer"]:
        r = run(f"powershell -c "try{{=New-Object -ComObject {pid}; Write-Host {pid}=OK}}catch{{}}"")
        if r.strip(): print(r.strip())
    p.close_shell(shell)
