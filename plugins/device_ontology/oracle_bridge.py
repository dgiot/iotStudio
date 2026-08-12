"""
Oracle Bridge — 通过 131 WinRM + 32-bit VBS/ADO 查询 Oracle 11g 生产数据

数据源: INDUSTRYPROD @ 192.168.10.129:1521/orcl
中继:    IO-SERVER-01 (192.168.10.131) WinRM → VBS/ADO → Oracle

架构:
  dgiot_lite (本机) ──WinRM──→ 131 cscript 32-bit ──ADO──→ Oracle :1521

表概览:
  SYS_SINGLE_WELL_BASE_INFO    966 rows   单井基础信息
  SYS_DEVICE_RUN_DETAILS_HIST  233,269   设备运行历史
  SYS_POINTRELATION_WELL       4,567    测点-井关系
  PC_FD_PUMPJACK_FDYNA_DIA_T   4,814,635 抽油机功图诊断
"""
import os
import time
from typing import Optional, List, Dict, Any
from dataclasses import dataclass

import winrm


# ═══════════════════════════════════════════════════════════
# 配置
# ═══════════════════════════════════════════════════════════

@dataclass
class OracleConfig:
    host: str = "192.168.10.131"
    port: int = 5985
    username: str = "administrator"
    password: str = r"CHANGEME"
    oracle_uid: str = "INDUSTRYPROD"
    oracle_pwd: str = "INDUSTRYA11_pass"
    oracle_dsn: str = "192.168.10.129/orcl"
    timeout: int = 30


# ═══════════════════════════════════════════════════════════
# VBS 脚本模板
# ═══════════════════════════════════════════════════════════

VBS_TEMPLATE = r'''Dim conn, rs
On Error Resume Next
Set conn = CreateObject("ADODB.Connection")
conn.ConnectionTimeout = {timeout} : conn.CommandTimeout = {timeout}
conn.Open "Provider=OraOLEDB.Oracle.1;Password={pwd};User ID={uid};Data Source={dsn}"
If Err.Number <> 0 Then
    WScript.Echo "ERR:CONNECT:" & Err.Description
    WScript.Quit 1
End If
WScript.Echo "OK:CONNECTED"

{sql_blocks}

conn.Close
WScript.Echo "OK:DONE"
'''

SQL_BLOCK_TEMPLATE = '''Dim colCount, colNames, i, rowIdx
WScript.Echo "BLOCK:{label}"
On Error Resume Next
Set rs = conn.Execute("{sql}")
If Err.Number <> 0 Then
    WScript.Echo "ERR:SQL:" & Err.Description
    Err.Clear
Else
    colCount = rs.Fields.Count
    ReDim colNames(colCount - 1)
    For i = 0 To colCount - 1
        colNames(i) = rs.Fields(i).Name
        WScript.Echo "COL:" & colNames(i)
    Next
    WScript.Echo "ROWS_START"
    rowIdx = 0
    Do While Not rs.EOF
        For i = 0 To colCount - 1
            If IsNull(rs.Fields(i).Value) Then
                WScript.Echo "V:" & colNames(i) & "="
            Else
                WScript.Echo "V:" & colNames(i) & "=" & rs.Fields(i).Value
            End If
        Next
        WScript.Echo "ROW_END"
        rowIdx = rowIdx + 1
        rs.MoveNext
    Loop
    rs.Close
    WScript.Echo "ROWS_DONE"
End If
'''


# ═══════════════════════════════════════════════════════════
# 查询引擎
# ═══════════════════════════════════════════════════════════

class OracleBridge:
    """通过 131 VBS/ADO 查询 Oracle"""

    # 模块级单例 WinRM 会话 (避免多会话 NTLM MIC 冲突)
    _shared_session = None
    _shared_lock = None

    def __init__(self, config: OracleConfig = None):
        self.cfg = config or OracleConfig()
        self._cache: Dict[str, Any] = {}

    @staticmethod
    def _ensure_lock():
        if OracleBridge._shared_lock is None:
            import threading
            OracleBridge._shared_lock = threading.RLock()  # 可重入锁

    @property
    def session(self):
        # 注意: 调用方 (query, query_multi) 已经持有 _shared_lock
        if OracleBridge._shared_session is None:
            for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
                os.environ.pop(k, None)
            os.environ['NO_PROXY'] = f'{self.cfg.host},11.*,172.*'
            os.environ['no_proxy'] = f'{self.cfg.host},11.*,172.*'

            OracleBridge._shared_session = winrm.Session(
                f'http://{self.cfg.host}:{self.cfg.port}/wsman',
                auth=(self.cfg.username, self.cfg.password),
                transport='ntlm',
                read_timeout_sec=self.cfg.timeout + 30
            )
        return OracleBridge._shared_session

    # ── 底层: 发 VBS, 运行, 解析 ──
    def _run_vbs(self, vbs_code: str) -> str:
        """在 131 上运行 VBS 并返回 stdout"""
        # 写入 VBS 文件
        ps_script = f'''$vbs = @'
{vbs_code}
'@
[System.IO.File]::WriteAllText("D:/temp/_qb.vbs", $vbs)
Write-Host "VBS_OK"
'''
        r = self.session.run_ps(ps_script)
        # 执行
        r = self.session.run_cmd('C:/Windows/SysWOW64/cscript.exe //Nologo D:/temp/_qb.vbs')
        return r.std_out.decode('gbk', errors='ignore').strip()

    def _parse_output(self, output: str) -> Dict[str, Any]:
        """解析 VBS 输出为结构化数据"""
        results = {}
        current_block = None
        current_cols = []
        current_rows = []
        current_row = {}

        for line in output.split('\n'):
            line = line.strip()
            if not line:
                continue

            if line == 'OK:CONNECTED':
                continue
            elif line == 'OK:DONE':
                break
            elif line.startswith('ERR:'):
                results['_error'] = line[4:]
                break
            elif line.startswith('BLOCK:'):
                if current_block and current_rows:
                    results[current_block] = {
                        'columns': current_cols,
                        'rows': current_rows,
                        'count': len(current_rows)
                    }
                current_block = line[6:]
                current_cols = []
                current_rows = []
            elif line.startswith('COL:'):
                current_cols.append(line[4:])
            elif line == 'ROWS_START':
                current_row = {}
            elif line.startswith('V:'):
                kv = line[2:].split('=', 1)
                if len(kv) == 2:
                    current_row[kv[0]] = kv[1]
            elif line == 'ROW_END':
                current_rows.append(current_row)
                current_row = {}
            elif line == 'ROWS_DONE':
                pass  # end marker

        # 保存最后一个 block
        if current_block and current_rows:
            results[current_block] = {
                'columns': current_cols,
                'rows': current_rows,
                'count': len(current_rows)
            }

        return results

    # ── 上层 API ──
    def query(self, sql: str, label: str = "q") -> dict:
        """执行单条 SQL 查询 (线程安全)"""
        OracleBridge._ensure_lock()
        with OracleBridge._shared_lock:
            sql_escaped = sql.replace('"', '""')
            block = SQL_BLOCK_TEMPLATE.format(
                label=label,
                sql=sql_escaped
            )
            vbs = VBS_TEMPLATE.format(
                timeout=self.cfg.timeout,
                pwd=self.cfg.oracle_pwd,
                uid=self.cfg.oracle_uid,
                dsn=self.cfg.oracle_dsn,
                sql_blocks=block
            )
            output = self._run_vbs(vbs)
        results = self._parse_output(output)
        return results.get(label, {'columns': [], 'rows': [], 'count': 0})

    def query_multi(self, queries: Dict[str, str]) -> Dict[str, dict]:
        """批量查询（一次连接完成多 SQL）"""
        blocks = '\n'.join(
            SQL_BLOCK_TEMPLATE.format(label=label, sql=sql.replace('"', '""'))
            for label, sql in queries.items()
        )
        vbs = VBS_TEMPLATE.format(
            timeout=self.cfg.timeout,
            pwd=self.cfg.oracle_pwd,
            uid=self.cfg.oracle_uid,
            dsn=self.cfg.oracle_dsn,
            sql_blocks=blocks
        )
        output = self._run_vbs(vbs)
        return self._parse_output(output)

    def get_wells(self, limit: int = 100) -> dict:
        """查询单井信息"""
        return self.query(
            f"SELECT * FROM (SELECT ID, RES_NAME, FREQUENCY, CREATE_TIME "
            f"FROM SYS_SINGLE_WELL_BASE_INFO ORDER BY CREATE_TIME DESC) "
            f"WHERE rownum <= {limit}",
            label="wells"
        )

    def get_run_rate(self) -> dict:
        """查询最新运行率"""
        return self.query(
            "SELECT * FROM (SELECT INSERT_TIME, TODAY_RUN_RATE "
            "FROM SYS_DEVICE_RUN_DETAILS_HIST ORDER BY INSERT_TIME DESC) "
            "WHERE rownum <= 1",
            label="run_rate"
        )

    def get_points(self, limit: int = 100) -> dict:
        """查询测点关系"""
        return self.query(
            f"SELECT * FROM (SELECT POINT_ID, POINT_LONGNAME, DESCRIBE, RES_ID, WELLPOINT_NAME "
            f"FROM SYS_POINTRELATION_WELL ORDER BY POINT_ID) WHERE rownum <= {limit}",
            label="points"
        )

    def get_counts(self) -> dict:
        """查询所有关键表行数"""
        tables = [
            "SYS_SINGLE_WELL_BASE_INFO",
            "SYS_DEVICE_RUN_DETAILS_HIST",
            "SYS_POINTRELATION_WELL",
            "PC_FD_PUMPJACK_FDYNA_DIA_T",
            "TOURWELL_RECORD_DETAIL",
            "ALARM_HISTORY_DUMP",
        ]
        stats = {}
        for t in tables:
            r = self.query(f"SELECT count(*) AS cnt FROM {t}", label=f"cnt_{t}")
            rows = r.get('rows', [])
            stats[t] = int(rows[0].get('CNT', 0)) if rows else 0
        return stats

    # ── 解析测点路径 → 本体 5 层 ──
    def parse_point_path(self, point_longname: str) -> dict:
        """
        解析 POINT_LONGNAME: /DEVICE_D/WELL_001/STATION_01WELL_001GYS
        → {site, well, station, point_code}

        本体映射:
            DEVICE_D    → Site    (采油PLANT_A_SITE_D)
            WELL_001 → Device  (井号)
            STATION_01   → Station (计量间)
            GYS/ZYG... → Point   (测点类型)
        """
        parts = point_longname.strip('/').split('/')
        result = {'raw': point_longname, 'parts': parts}

        if len(parts) >= 1:
            result['site'] = parts[0]

        if len(parts) >= 2:
            result['well'] = parts[1]

        if len(parts) >= 3:
            # parts[2] = STATION_01WELL_001GYS
            # 提取计量间和测点代码
            station_point = parts[2]
            result['station_point'] = station_point
            # 尝试从站-井-测点复合字段中提取
            well = result.get('well', '')
            if well and station_point.startswith(well):
                result['point_code'] = station_point[len(well):]
            elif station_point.startswith('JD'):
                # 以 JD 开头的是计量间编号
                result['station'] = station_point[:8]  # STATION_01
                rest = station_point[8:]
                if well and rest.startswith(well):
                    result['point_code'] = rest[len(well):]
                else:
                    result['point_code'] = rest

        return result

    # ── 健康检查 ──
    def ping(self) -> Dict[str, Any]:
        """测试连接是否正常"""
        start = time.time()
        result = self.query("SELECT 'pong' AS msg, SYSDATE AS now FROM dual", label="ping")
        elapsed = time.time() - start
        rows = result.get('rows', [])
        return {
            'ok': len(rows) > 0 and rows[0].get('MSG') == 'pong',
            'elapsed_ms': round(elapsed * 1000),
            'server_time': rows[0].get('NOW', '') if rows else '',
            'error': result.get('_error', '')
        }

    def __del__(self):
        self.close()

    def close(self):
        self._session = None
        self._cache.clear()


# ═══════════════════════════════════════════════════════════
# 快捷函数
# ═══════════════════════════════════════════════════════════

_bridge: Optional[OracleBridge] = None


def get_bridge() -> OracleBridge:
    global _bridge
    if _bridge is None:
        _bridge = OracleBridge()
    return _bridge


if __name__ == "__main__":
    b = OracleBridge()
    print("=== PING ===")
    print(b.ping())
    print()

    print("=== RUN RATE ===")
    print(b.get_run_rate())
    print()

    print("=== WELLS (first 5) ===")
    r = b.get_wells(5)
    for row in r.get('rows', [])[:5]:
        print(f"  {row.get('ID','?')[:16]}... | {row.get('RES_NAME','?')} | freq={row.get('FREQUENCY','?')}")
    print()

    print("=== POINTS (first 5) ===")
    r = b.get_points(5)
    for row in r.get('rows', [])[:5]:
        path = row.get('POINT_LONGNAME', '')
        parsed = b.parse_point_path(path)
        print(f"  {row['POINT_ID']} | {path}")
        print(f"    → {parsed}")
    print()

    print("=== COUNTS ===")
    r = b.get_counts()
    for k, v in r.items():
        if 'rows' in v:
            print(f"  {k}: {v['rows'][0].get('CNT','?')} rows")
    print()

    b.close()
    print("Done.")
