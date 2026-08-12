"""
IO 服务器扫描通道 — WinRM CONNECT
==================================
一个 IO 服务器 = 一个通道实例。自注册为插件。

用法 (配置文件驱动):
  POST /api/channels/ch_io_131/start    → 扫描
  GET  /api/channels/ch_io_131/health   → 结果
  POST /api/channels/ch_io_131/stop     → 断开

配置 JSON (io_config.json):
  {"ip":"192.168.10.131","user":"admin","password":"xxx",
   "vendor":"force|opc|rockwell","ports":"8889 502 135"}
"""
import os, sys, json, logging, asyncio
from typing import Optional, Dict

log = logging.getLogger("io_scanner")

# 需要哪个通道就配置哪个
DEFAULT_VENDOR = "force|opc|rslinx|iomonitor|rockwell|factory|wonderware|intouch|ifix|wincc|kepware|matrikon|siemens|modicon|mitsubishi|omron|beckhoff|codesys"
DEFAULT_PORTS  = "8889 502 135 53001 4840 4841 102 44818 2222 9600"


class IOScannerChannel:
    """WinRM 扫描通道 — 对标 dgiot_channelx"""

    def __init__(self, channel_id: str, config: dict = None):
        self.channel_id = channel_id
        self.config = config or {}
        self.status = "stopped"
        self._session = None
        self._report: Dict = {}

    # ── 通道生命周期 ──

    async def init(self, **kwargs):
        """建立 WinRM 连接"""
        try:
            import winrm
        except ImportError:
            log.error("[io_scanner] pywinrm 未安装")
            return False

        ip   = self.config.get("ip", "")
        port = self.config.get("port", 5985)
        user = self.config.get("user", "")
        pwd  = self.config.get("password", "")
        transport = self.config.get("transport", "ntlm")

        if not ip or not user:
            log.error(f"[io_scanner] 缺少配置: ip/user")
            return False

        os.environ.pop('HTTP_PROXY', None)
        os.environ.pop('HTTPS_PROXY', None)
        os.environ['NO_PROXY'] = ip

        try:
            self._session = winrm.Session(
                f"http://{ip}:{port}/wsman",
                auth=(user, pwd),
                transport=transport,
                read_timeout_sec=60,
            )
            self.status = "connected"
            log.info(f"[io_scanner] WinRM → {ip}:{port}")
            return True
        except Exception as e:
            log.error(f"[io_scanner] 连接失败: {e}")
            self.status = "error"
            return False

    async def handle_message(self, msg) -> Optional[dict]:
        """处理扫描指令"""
        action = msg.get("action", "scan") if isinstance(msg, dict) else "scan"
        if action == "scan":
            return await self._do_scan()
        if action == "whoami":
            return {"whoami": self._cmd("whoami")}
        return {"status": self.status}

    async def handle_event(self, event: str, **payload) -> Optional[dict]:
        return None

    async def stop(self):
        self._session = None
        self.status = "stopped"

    def snapshot(self) -> dict:
        return {
            "channel_id": self.channel_id,
            "status": self.status,
            "config": {k: v for k, v in self.config.items() if k != "password"},
            "report_keys": list(self._report.keys())[:10],
        }

    # ── 扫描逻辑 ──

    async def _do_scan(self) -> dict:
        if not self._session:
            return {"error": "not connected"}

        self.status = "scanning"
        self._report = {"ip": self.config.get("ip"), "scanned_at": ""}

        # 用 asyncio.to_thread 避免阻塞 (pywinrm 是同步的)
        try:
            result = await asyncio.to_thread(self._run_scan)
            self._report = result
            self.status = "done"
            log.info(f"[io_scanner] {self.config.get('ip')} 扫描完成")
            return result
        except Exception as e:
            self.status = "error"
            log.error(f"[io_scanner] 扫描失败: {e}")
            return {"error": str(e)}

    def _run_scan(self):
        s = self._session
        vendor = self.config.get("vendor", DEFAULT_VENDOR)
        ports  = self.config.get("ports", DEFAULT_PORTS)

        r = {}
        r['hostname']   = self._cmd('hostname').strip()
        r['os']         = self._cmd('ver').strip()
        r['processes']  = self._ps(f"Get-Process | Where-Object {{ $_.ProcessName -match '{vendor}' }} | Select Name,Id | Format-Table -AutoSize")
        r['services']   = self._cmd(f'sc query state= all 2>nul | findstr /i "{vendor.replace("|", " ")}"')
        r['software_x64'] = self._ps(f"Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {{$_.DisplayName -match '{vendor}'}} | Select DisplayName | Format-List")
        r['software_x86'] = self._ps(f"Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {{$_.DisplayName -match '{vendor}'}} | Select DisplayName | Format-List")
        r['ports']       = self._cmd(f'netstat -an 2>nul | findstr "{ports}"')
        r['opc_appids']  = self._ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes\\AppID' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -match 'OPC|OpcRcw|Automation|ServerList'} | ForEach-Object {$_.PSChildName}")
        r['opc_progids'] = self._ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -like 'OPC.*'} | Select -First 30 PSChildName")
        r['opc_dlls']    = self._cmd('cmd /c "dir C:\\Windows\\System32\\opc*.dll C:\\Windows\\SysWOW64\\opc*.dll 2>nul"')

        # 驱动盘
        for drive in self.config.get("drives", ["D:"]):
            result = self._cmd(f'cmd /c "dir /b {drive}\\ 2>nul"')
            if result and '(empty)' not in result:
                r[f'drive_{drive[0]}'] = result

        return r

    def _ps(self, script):
        try:
            r = self._session.run_ps(script)
            out = r.std_out.decode('gbk', errors='ignore').strip()
            err = r.std_err.decode('gbk', errors='ignore').strip()
            return (out + '\n' + err).strip()[:5000] or '(empty)'
        except Exception as e:
            return f'ERR: {e}'

    def _cmd(self, command):
        try:
            r = self._session.run_cmd(command)
            out = r.std_out.decode('gbk', errors='ignore').strip()
            err = r.std_err.decode('gbk', errors='ignore').strip()
            return (out + '\n' + err).strip()[:5000] or '(empty)'
        except Exception as e:
            return f'ERR: {e}'


# ═══════════════════════════════════════════
# 自注册为通道插件
# ═══════════════════════════════════════════

def _register_plugin():
    try:
        from ..channel_registry import register_channel_plugin, CType

        register_channel_plugin(
            channel_id="ch_io_scanner",
            cType=CType.CONNECT,
            name="IO服务器扫描器 (WinRM)",
            version="1.0",
            description="通用 IO 服务器扫描 — WinRM 连接 → 进程/服务/软件/OPC/端口 全量扫描",
            config={
                "ip": "", "port": 5985, "user": "", "password": "",
                "transport": "ntlm",
                "vendor": DEFAULT_VENDOR,
                "ports": DEFAULT_PORTS,
                "drives": ["D:", "E:"],
                "isEnable": False,  # 默认关闭, 需要时开启
            },
            adapter=IOScannerChannel,
            protocol="winrm-scanner",
        )
        log.info("[io_scanner] 插件已注册: ch_io_scanner")
    except Exception as e:
        log.warning(f"[io_scanner] 插件注册失败: {e}")


_register_plugin()
