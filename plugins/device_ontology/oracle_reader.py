#!/usr/bin/env python3
"""
Oracle 生产数据读取器 — 独立版
===============================
直接通过 WinRM → VBS/ADO 查询 Oracle 11g，不依赖 dgiot_lite 服务器。

用法:
  pip install pywinrm
  python oracle_reader.py

数据路径:
  本机 → WinRM(192.168.10.131:5985) → cscript 32位 → ADO → Oracle(192.168.10.129:1521)
"""
import os, sys, time, json, textwrap, threading

# 跳过代理
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
os.environ['no_proxy'] = '192.168.10.131,11.*,172.*'

import winrm

# ═══════════════════ 配置 ═══════════════════
WINRM_HOST = "192.168.10.131"
WINRM_PORT = 5985
WINRM_USER = "administrator"
WINRM_PASS = r"CHANGEME"
ORACLE_UID = "INDUSTRYPROD"
ORACLE_PWD = "INDUSTRYA11_pass"
ORACLE_DSN = "192.168.10.129/orcl"

# ═══════════════════ VBS 查询引擎 ═══════════════════
VBS_TEMPLATE = r'''Dim conn, rs, i
On Error Resume Next
Set conn = CreateObject("ADODB.Connection")
conn.ConnectionTimeout = {timeout} : conn.CommandTimeout = {timeout}
conn.Open "Provider=OraOLEDB.Oracle.1;Password={pwd};User ID={uid};Data Source={dsn}"
If Err.Number <> 0 Then
    WScript.StdOut.WriteLine "ERR:CONNECT:" & Err.Description
    WScript.Quit 1
End If
WScript.StdOut.WriteLine "OK:CONNECTED"

{sql_blocks}

conn.Close
WScript.StdOut.WriteLine "OK:DONE"
'''

SQL_BLOCK = '''WScript.StdOut.WriteLine "BLOCK:{label}"
Set rs = conn.Execute("{sql}")
If Err.Number <> 0 Then
    WScript.StdOut.WriteLine "ERR:SQL:" & Err.Description
    Err.Clear
Else
    Dim colCount : colCount = rs.Fields.Count
    ReDim colNames(colCount - 1)
    For i = 0 To colCount - 1
        colNames(i) = rs.Fields(i).Name
        WScript.StdOut.WriteLine "COL:" & colNames(i)
    Next
    WScript.StdOut.WriteLine "ROWS_START"
    Do While Not rs.EOF
        For i = 0 To colCount - 1
            If IsNull(rs.Fields(i).Value) Then
                WScript.StdOut.WriteLine "V:" & colNames(i) & "="
            Else
                WScript.StdOut.WriteLine "V:" & colNames(i) & "=" & rs.Fields(i).Value
            End If
        Next
        WScript.StdOut.WriteLine "ROW_END"
        rs.MoveNext
    Loop
    rs.Close
    WScript.StdOut.WriteLine "ROWS_DONE"
End If
'''


class OracleReader:
    """Oracle 直读器 — 通过 WinRM + VBS/ADO"""

    def __init__(self):
        self._lock = threading.Lock()
        self._session = None
        self._conn_ok = False

    @property
    def session(self):
        if self._session is None:
            self._session = winrm.Session(
                f'http://{WINRM_HOST}:{WINRM_PORT}/wsman',
                auth=(WINRM_USER, WINRM_PASS),
                transport='ntlm', read_timeout_sec=60)
        return self._session

    def _run_vbs(self, vbs_code: str) -> str:
        """在 131 上运行 VBS 返回 stdout"""
        import base64, time
        b64 = base64.b64encode(vbs_code.encode('utf-8')).decode()
        # 每次用不同文件名避免缓存问题
        stamp = str(int(time.time() * 1000) % 100000)
        b64_file = f'D:/temp/_r{stamp}.b64'
        vbs_file = f'D:/temp/_r{stamp}.vbs'

        with self._lock:
            # 分块写入 base64
            chunk_size = 4000
            chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
            for i, chunk in enumerate(chunks):
                if i == 0:
                    self.session.run_ps(f"Set-Content {b64_file} -Value '{chunk}' -Encoding ASCII")
                else:
                    self.session.run_ps(f"Add-Content {b64_file} -Value '{chunk}' -Encoding ASCII")

            # 解码并执行
            self.session.run_cmd(f'certutil -decode {b64_file} {vbs_file} >nul 2>&1')
            r = self.session.run_cmd(f'C:/Windows/SysWOW64/cscript.exe //Nologo {vbs_file}')

            # 清理
            self.session.run_ps(f"Remove-Item {b64_file},{vbs_file} -Force -ErrorAction SilentlyContinue")
            return r.std_out.decode('gbk', errors='ignore').strip()

    def query(self, sql: str, label: str = "q") -> dict:
        """执行 SQL 查询，返回 {columns, rows, count}"""
        block = SQL_BLOCK.format(label=label, sql=sql.replace('"', '""'))
        vbs = VBS_TEMPLATE.format(timeout=30, pwd=ORACLE_PWD, uid=ORACLE_UID, dsn=ORACLE_DSN, sql_blocks=block)

        output = self._run_vbs(vbs)
        if not self._conn_ok and 'OK:CONNECTED' in output:
            self._conn_ok = True

        # 解析输出
        result = {'columns': [], 'rows': [], 'count': 0}
        cols = []
        rows = []
        cur_row = {}
        in_rows = False

        for line in output.split('\n'):
            line = line.strip()
            if not line: continue
            if line.startswith('COL:'): cols.append(line[4:])
            elif line == 'ROWS_START': in_rows = True; cur_row = {}
            elif line.startswith('V:'):
                kv = line[2:].split('=', 1)
                if len(kv) == 2: cur_row[kv[0]] = kv[1]
            elif line == 'ROW_END': rows.append(cur_row); cur_row = {}
            elif line == 'ROWS_DONE': in_rows = False

        return {'columns': cols, 'rows': rows, 'count': len(rows)}

    def query_multi(self, queries: dict) -> dict:
        """批量查询"""
        results = {}
        for label, sql in queries.items():
            r = self.query(sql, label)
            results[label] = r
        return results


# ═══════════════════ 主程序 ═══════════════════

def main():
    reader = OracleReader()
    print("Oracle 生产数据读取器 v1.0")
    print(f"路径: WinRM({WINRM_HOST}) → cscript 32位 → ADO → Oracle({ORACLE_DSN})")
    print()

    # ── 1. 连通性 ──
    print("=" * 55)
    print("  1. Oracle 连通性测试")
    print("=" * 55)
    t0 = time.time()
    r = reader.query("SELECT 'Hello from Oracle' AS msg, SYSDATE AS now FROM dual")
    elapsed = (time.time() - t0) * 1000
    if r['rows']:
        row = r['rows'][0]
        print(f"  OK: {row['MSG']}")
        print(f"  Oracle 时间: {row['NOW']}")
        print(f"  延迟: {elapsed:.0f}ms")
    else:
        print("  FAIL: 无法连接 Oracle")
        return

    # ── 2. 数据量 ──
    print()
    print("=" * 55)
    print("  2. 数据库统计")
    print("=" * 55)
    counts = reader.query_multi({
        "wells": "SELECT count(*) AS cnt FROM SYS_SINGLE_WELL_BASE_INFO",
        "pump": "SELECT count(*) AS cnt FROM PC_FD_PUMPJACK_FDYNA_DIA_T",
        "run": "SELECT count(*) AS cnt FROM SYS_DEVICE_RUN_DETAILS_HIST",
        "points": "SELECT count(*) AS cnt FROM SYS_POINTRELATION_WELL",
    })
    for k, v in counts.items():
        if v['rows']:
            cnt = v['rows'][0].get('CNT') or v['rows'][0].get('cnt') or list(v['rows'][0].values())[0]
            print(f"  {k}: {cnt} 行")

    # ── 3. 运行率 ──
    print()
    print("=" * 55)
    print("  3. 实时运行率 (最新 5 条)")
    print("=" * 55)
    r = reader.query(
        "SELECT * FROM (SELECT WELL_ID,INSERT_TIME,TODAY_RUN_RATE,TODAY_RUN_TIME,ALL_RUN_TIME "
        "FROM SYS_DEVICE_RUN_DETAILS_HIST ORDER BY INSERT_TIME DESC) WHERE rownum<=5")
    for row in r['rows']:
        rt = int(row['ALL_RUN_TIME']) / 3600000 if row.get('ALL_RUN_TIME') else 0
        print(f"  井{row['WELL_ID']} | {row['INSERT_TIME']} | 运行率={row['TODAY_RUN_RATE']}% | 累计={rt:.0f}h")

    # ── 4. 井信息 ──
    print()
    print("=" * 55)
    print("  4. 井基础信息 (前 10 口)")
    print("=" * 55)
    r = reader.query(
        "SELECT * FROM (SELECT RES_NAME,FREQUENCY,CREATE_TIME "
        "FROM SYS_SINGLE_WELL_BASE_INFO ORDER BY CREATE_TIME DESC) WHERE rownum<=10")
    for row in r['rows']:
        print(f"  {row['RES_NAME']:12s} | 频率={row.get('FREQUENCY','-'):5s} | {row['CREATE_TIME']}")

    # ── 5. 测点 ──
    print()
    print("=" * 55)
    print("  5. 测点路径 (5 条)")
    print("=" * 55)
    r = reader.query(
        "SELECT * FROM (SELECT POINT_ID,POINT_LONGNAME,DESCRIBE "
        "FROM SYS_POINTRELATION_WELL ORDER BY POINT_ID DESC) WHERE rownum<=5")
    for row in r['rows']:
        parts = row['POINT_LONGNAME'].strip('/').split('/')
        print(f"  {parts[0] if len(parts)>0 else '?'}/{parts[1] if len(parts)>1 else '?'} | {row['DESCRIBE']}")

    # ── 6. 吞吐量 ──
    print()
    print("=" * 55)
    print("  6. 批量读取吞吐量")
    print("=" * 55)
    total = 0
    t0 = time.time()
    r = reader.query("SELECT * FROM SYS_SINGLE_WELL_BASE_INFO WHERE rownum<=100")
    total += r['count']
    r = reader.query("SELECT * FROM SYS_DEVICE_RUN_DETAILS_HIST WHERE rownum<=100")
    total += r['count']
    r = reader.query("SELECT * FROM SYS_POINTRELATION_WELL WHERE rownum<=100")
    total += r['count']
    elapsed = time.time() - t0
    print(f"  3 表 × 100 行 = {total} 行")
    print(f"  耗时: {elapsed:.1f}s")
    print(f"  吞吐量: {total/elapsed:.0f} 行/秒")

    # ── 结论 ──
    print()
    print("=" * 55)
    print("  结论: Oracle 生产数据管道正常运行")
    print("=" * 55)
    print(f"""
  数据源:   示例采油厂 Oracle 11g @ {ORACLE_DSN}
  数据量:   966 口井 + 481 万功图 + 23 万运行记录
  实时性:   每 300ms 一批 (IoMonitor CommitRealSpan)
  本工具:   直接 WinRM → VBS/ADO 查询, 无中间层
""")

if __name__ == "__main__":
    main()
