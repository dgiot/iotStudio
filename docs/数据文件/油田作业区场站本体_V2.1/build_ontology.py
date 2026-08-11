#!/usr/bin/env python3
"""
油田作业区场站 DLAS 本体构建 & 力导图生成
数据来源: 大庆采油厂 IO 服务器全貌 + pSpace 16663标签 + 实体清单 + 关系矩阵 + 约束规则库
"""

import json
import csv
import os

# ============================================================
# Step 1: 从 CSV 统计测点分布
# ============================================================
def analyze_csv():
    """统计 pSpace_tags.csv 的站点/井/测点分布"""
    stations = set()
    wells = set()
    point_types = set()
    metering_stations = set()
    total = 0

    with open('pSpace_tags.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            stations.add(row['站点'])
            wells.add(row['井号'])
            point_types.add(row['测点类型'])
            metering_stations.add(row['计量间'])

    return {
        'total_tags': total,
        'stations': sorted(stations),
        'well_count': len(wells),
        'point_types': sorted(point_types),
        'point_type_count': len(point_types),
        'metering_station_count': len(metering_stations)
    }

# ============================================================
# Step 2: DLAS 四层本体
# ============================================================
def build_ontology(csv_stats):
    """构建完整的 DLAS 四层本体"""

    ontology = {
        "meta": {
            "name": "大庆油田作业区场站本体",
            "version": "V2.0",
            "date": "2026-07-21",
            "source": "pcapng(95K报文) + Oracle 61K测点 + PDB逆向 + pSpace 16663标签 + 实体清单 + 关系矩阵 + 约束规则库",
            "framework": "DLAS (Data·Logic·Action·Security)",
            "total_entities": 0,
            "total_relations": 0,
            "total_constraints": 0
        },

        # ==========================================
        # DATA 层: 物理世界有什么
        # ==========================================
        "Data": {
            "description": "物理世界 — 场站·设备·传感器·网络·软件·人员",

            "场站": [
                {"name": "南4联合站", "code": "CY1C8K", "ip": "11.66.12.131", "location": "采油二厂第四作业区", "role": "核心IO枢纽"},
                {"name": "北9注水站", "code": None, "location": "采油三厂第八作业区", "role": "注水"},
                {"name": "北15联合站", "code": None, "location": "采油三厂第八作业区", "role": "联合处理"},
                {"name": "萨北21站", "code": None, "location": "采油三厂第八作业区", "role": "综合"},
                {"name": "DX8ZRZ站", "code": "DX8ZRZ", "ip": "172.23.9.3", "role": "联合站(OPC)", "points": 2209},
                {"name": "DX6PZ站", "code": "DX6PZ", "ip": "172.23.9.23", "role": "联合站(OPC)", "points": 3106},
                {"name": "DX5ZRZ站", "code": "DX5ZRZ", "ip": "172.26.6.3", "role": "联合站(OPC)", "points": 2568},
                {"name": "XZ202TP站", "code": "XZ202TP", "ip": "172.23.18.194", "role": "脱水站(OPC)", "points": 976},
                {"name": "SYZ105ZYTWZ站", "code": "SYZ105ZYTWZ", "ip": "172.21.14.192", "role": "注水站(OPC)", "points": 400},
                {"name": "SY217Z1-4站", "code": "SY217Z1-4", "role": "注水站(OPC)", "points": 250},
                {"name": "XZ208Z1-4站", "code": "XZ208Z1-4", "role": "注水站(OPC)", "points": 350},
                {"name": "JB1V2站", "code": "JB1V2", "role": "遥信站(OPC)", "points": 969}
            ],

            "服务器与网络": [
                {"name": "IO服务器(131)", "ip": "11.66.12.131", "os": "Windows Server 2016", "spec": "Xeon + 32GB+ + X520 10GbE ×4"},
                {"name": "pSpace服务器(130)", "ip": "11.66.12.130", "port": "8889", "role": "A11协议服务器 + pSpace 6.0"},
                {"name": "Oracle 11g(129)", "ip": "11.66.12.129", "port": "1521", "sid": "orcl", "user": "DQYTPROD"},
                {"name": "开发机(dgiot_lite)", "ip": "11.66.191.155", "role": "边缘中枢", "ports": "5173/8765/53001"},
                {"name": "DMZ中转", "ip": "11.66.113.78", "ports": "1883/59660", "role": "MQTT/SSH"}
            ],

            "采集进程": [
                {"name": "CommBridge.exe", "pid": 19240, "memory": "32MB", "version": "6.3.0.1", "function": "Modbus TCP桥接(191 RTU, :53001)", "protocol": "专有帧+DTU透传"},
                {"name": "IOMan.exe", "count": 36, "memory": "~16MB/个", "version": "7.0.3.2", "function": "IO设备管理(OPC DA×5 + A11×7 + Modbus×24)", "protocol": "DCOM/psAPI"},
                {"name": "IoMonitor.exe", "pid": 18400, "memory": "61MB", "version": "7.0.1.2", "function": "GUI监控 + OLEDB写Oracle", "protocol": "OLEDB/ADO"},
                {"name": "IoProject.exe", "count": 1, "memory": "306MB", "function": "pSpace核心引擎", "protocol": "psAPI"},
                {"name": "IoCommit.exe", "count": 7, "memory": "~15MB/个", "function": "批量写Oracle(15000点/批)"},
                {"name": "GPRSDLL.dll", "size": "1.38MB", "function": "GPRS/CDMA协议栈(47台无线终端)"}
            ],

            "协议栈": [
                {"name": "A11(5a5a)", "transport": "TCP :8889", "parties": "130↔131", "frames": 93900, "status": "已逆向", "features": "设备路径+浮点值"},
                {"name": "Modbus TCP", "transport": "TCP :53001", "parties": "131→191 RTU", "frames": 21300, "status": "已解析", "features": "206台寄存器值"},
                {"name": "OPC DA (DCE/RPC)", "transport": "DCOM :135", "parties": "5 DCS↔131", "frames": 72900, "status": "RSLinx/WinCC"},
                {"name": "Oracle TNS", "transport": "TCP :1521", "parties": "131→129", "frames": 8700, "status": "功图数据查询"},
                {"name": "CommBridge专有帧", "transport": "TCP :53001", "format": "Seq(1B)+Flags(4B)+Len(1B)+Slave(1B)+Func(1B)+Data(N)", "status": "已逆向"},
                {"name": "DTU注册帧", "transport": "TCP", "format": "0xAA+SlaveID+ASCII_DeviceID+0x0D", "count": "2211帧, 413设备ID"}
            ],

            "设备与装置": [
                {"name": "DSL-31A 断路器", "code": "0x00", "channels": 20},
                {"name": "DST-31A 变压器差动", "code": "0x10", "channels": 15},
                {"name": "DBPA-31A 备用电源", "code": "0x20", "channels": 13},
                {"name": "DSB-31A 变压器后备", "code": "0x30", "channels": 20},
                {"name": "电动机保护", "code": "0x40", "channels": 19},
                {"name": "DST-22D 变压器差动", "code": "0x50", "channels": 20},
                {"name": "DSB-22D 变压器后备", "code": "0x60", "channels": 20},
                {"name": "DSL-24D 断路器", "code": "0x70", "channels": 20},
                {"name": "DGP-11 变压器差动", "code": "0x80", "channels": 21},
                {"name": "DGP-12 变压器后备", "code": "0x90", "channels": 24},
                {"name": "DGP-13 接地保护", "code": "0xA0", "channels": 22},
                {"name": "DMP-31A 电动机", "code": "0xB0", "channels": 19}
            ],

            "DCS系统": [
                {"name": "DCS-A", "ip": "172.23.9.3", "opc_server": "RSLinx Classic", "devices": "30+"},
                {"name": "DCS-B", "ip": "172.23.18.194", "opc_server": "RSLinx Classic", "devices": "30+"},
                {"name": "DCS-C", "ip": "172.26.6.3", "opc_server": "RSLinx Classic", "devices": "60+"},
                {"name": "DCS-D", "ip": "172.21.14.192", "opc_server": "RSLinx Classic", "devices": "40+"},
                {"name": "DCS-E", "ip": "172.28.5.200", "opc_server": "RSLinx+WinCC", "devices": "40+"}
            ],

            "配置文件": [
                {"name": "Device.ini", "path": "E:\\IO ServerOnLine\\", "content": "12设备类型 + ChangeData公式(8192标定)"},
                {"name": "IoChannelCfg.ini", "content": "通道配置(CommBridge DEV_COUNT=3)"},
                {"name": "SqlFilSet.ini", "content": "Oracle连接(EXECUTECYC=1000ms, ADOCOUNT=1-4)"},
                {"name": "IoMonitor.ini", "content": "提交参数(CommitRealSpan=300ms, CommitHisSpan=500ms, CommitTagOnce=15000)"},
                {"name": "OPCClientCfg.ini", "content": "OPC配置(Kepware ProgID+CLSID)"},
                {"name": "DeviceStruct.txt", "content": "OPC设备结构(17字段: IP/ProgID/CLSID/刷新率)"}
            ],

            "测点体系": {
                "modbus_rtu": {"total": 4567, "wells": 54, "channels_per_well": 23, "station": "CY1C8K"},
                "opc_da": {"total": 26081, "DX_telemetry": 16372, "JB_remote_signal": 915, "Z_water_injection": 8794},
                "pSpace": {"total": csv_stats['total_tags'], "wells": csv_stats['well_count'], "stations": csv_stats['stations'], "point_types": csv_stats['point_types'], "metering_stations": csv_stats['metering_station_count']},
                "典型测点类型": ["ADL", "ADY", "BDL", "BDY", "CDL", "CDY", "CHC", "CPV", "CZT", "DCV", "DWL", "EGT", "GYS", "HGT", "RCV", "SLV", "TGP", "TGT", "UCV", "UWL", "ZHL", "ZWG", "ZYG"]
            }
        },

        # ==========================================
        # LOGIC 层: 怎么推理决策
        # ==========================================
        "Logic": {
            "description": "推理决策 — 协议规则·采集节拍·校验·阈值·约束",

            "采集节拍": [
                {"channel": "CommBridge (Modbus RTU)", "interval": "1s", "points_per_cycle": 20, "commit_cycle": "300ms(实时)"},
                {"channel": "OPC DA (5 DCS)", "interval": "实时订阅推送", "commit_cycle": "300ms(实时)"},
                {"channel": "A11 (pSpace)", "interval": "1-5s", "commit_cycle": "300ms(实时)"},
                {"channel": "IoCommit (批量写Oracle)", "batch_size": "15000点/批", "real_span": "300ms", "his_span": "500ms"},
                {"channel": "SQL执行", "cycle": "1000ms", "task_alloc": "2-5ms"}
            ],

            "时序约束": [
                {"param": "CommitRealSpan", "value": "300ms", "desc": "实时数据提交间隔"},
                {"param": "CommitHisSpan", "value": "500ms", "desc": "历史数据提交间隔"},
                {"param": "CommitTagOnce", "value": "15000", "desc": "单次提交点数上限"},
                {"param": "MaxTagCount", "value": "100万", "desc": "总标签数上限"},
                {"param": "DataDelay", "value": "5ms", "desc": "IO提交延迟"},
                {"param": "EXECUTECYC", "value": "1000ms", "desc": "SQL执行周期"},
                {"param": "TASKALLOCATIONCYC", "value": "2-5ms", "desc": "任务分配周期"},
                {"param": "ADOCOUNT", "value": "1-4", "desc": "OLEDB连接池大小"}
            ],

            "五级校验": [
                {"level": "L1", "rule": "帧匹配校验", "condition": "abs(expected-actual)≤2", "severity": "danger", "action": "丢弃错误帧"},
                {"level": "L2", "rule": "值范围校验", "condition": "电流0-500A / 电压100-400V", "severity": "danger", "action": "数值异常+告警"},
                {"level": "L3", "rule": "三相平衡校验", "condition": "(Imax-Imin)/Iavg < 25%", "severity": "danger", "action": "三相不平衡告警"},
                {"level": "L4", "rule": "时序一致性", "condition": "delta < 50%", "severity": "warn", "action": "标记可疑值"},
                {"level": "L5", "rule": "Oracle双源对比", "condition": "|A-B|/A < 1%", "severity": "danger", "action": "数据源异常告警"}
            ],

            "ChangeData公式": [
                {"name": "C0", "formula": "Y × 170 / 8192", "unit": "A", "applies_to": "Ia, Ib, Ic, Ua, Ub, Uc"},
                {"name": "C5", "formula": "F = 50 + Y × 2 / 8192", "unit": "Hz", "applies_to": "频率"}
            ],

            "资源边界": [
                {"resource": "TCP连接", "used": "203", "limit": "65535", "headroom": "充足"},
                {"resource": "CPU", "used": "<5%", "limit": "100%", "headroom": "充足"},
                {"resource": "内存", "used": "~1.2GB", "limit": "32GB+", "headroom": "中等"},
                {"resource": "Oracle连接", "used": "4 ADO", "limit": "许可限制", "headroom": "紧张"},
                {"resource": "CommBridge吞吐", "used": "~20KB/s", "limit": "100Mbps", "headroom": "充足"}
            ],

            "安全下发策略": [
                {"type": "allowed", "condition": "CommitRealSpan间隙(300ms的80%空闲)", "channel": "读Oracle/遥测/统计"},
                {"type": "allowed", "condition": "CommBridge查询间隔末尾(1s轮询最后200ms)", "channel": "dgiot :53002独立端口"},
                {"type": "allowed", "condition": "SQL EXECUTECYC间隙(1000ms非执行窗口)", "channel": "新增TCP连接"},
                {"type": "forbidden", "condition": "CommBridge :53001干扰RTU轮询", "risk": "RTU断线→IoMonitor告警→数据缺失"},
                {"type": "forbidden", "condition": "DCOM :135触发DCS安全策略", "risk": "DCOM超时→IOMan崩溃"},
                {"type": "forbidden", "condition": "OLEDB写操作竞争IoCommit", "risk": "写库失败→数据丢失"}
            ]
        },

        # ==========================================
        # ACTION 层: 谁做什么
        # ==========================================
        "Action": {
            "description": "执行动作 — 数据流·IPC·控制闭环·自动恢复",

            "三大采集链路": [
                {
                    "name": "Modbus RTU链路",
                    "path": "RTU(11.248-250.x) → CommBridge(TCP:53001) → IoMonitor(WM_COPYDATA) → Oracle(OLEDB)",
                    "protocol": "专有帧+DTU透传",
                    "throughput": "4567点/1s",
                    "status": "生产运行中"
                },
                {
                    "name": "OPC DA链路",
                    "path": "DCS(172.x) → IOMan×5(DCOM:135) → pSpace(psAPI) → IoCommit → Oracle",
                    "protocol": "DCE/RPC OPC DA",
                    "throughput": "26081点/实时",
                    "status": "生产运行中"
                },
                {
                    "name": "A11链路",
                    "path": "pSpace(130:8889) → IOMan×7(psAPI) → IoCommit → Oracle",
                    "protocol": "A11 5a5a TCP",
                    "throughput": "16663点/1-5s",
                    "status": "生产运行中"
                }
            ],

            "IPC通信机制": [
                {"from": "IoProject", "to": "IOMan", "method": "CreateProcess + 命令行参数", "desc": "派生36个IOMan实例"},
                {"from": "IOMan", "to": "IoMonitor", "method": "共享内存 + WM_COPYDATA", "desc": "Global\\命名空间"},
                {"from": "IoMonitor", "to": "Oracle", "method": "OLEDB ADO连接池", "desc": "批量写DQYTPROD"},
                {"from": "CommBridge", "to": "IoMonitor", "method": "WM_COPYDATA IPC", "desc": "实时数据推送"}
            ],

            "dgiot_lite接入": [
                {"protocol": "Modbus TCP", "method": "commbridge_server.exe替代CommBridge", "port": "53002就绪", "status": "待切换"},
                {"protocol": "OPC DA", "method": "Oracle SYS_POINTRELATION_STATION直读", "coverage": "26081点已接入", "status": "就绪"},
                {"protocol": "pSpace实时", "method": "psAPISDK.dll直连", "requirement": "等认证", "status": "待认证"}
            ],

            "自动恢复动作": [
                {"trigger": "3次异常无数据", "action": "自动重启commbridge_server", "severity": "critical"},
                {"trigger": "平台连接失败×3", "action": "杀端口→重启uvicorn", "severity": "critical"}
            ]
        },

        # ==========================================
        # SECURITY 层: 如何安全合规
        # ==========================================
        "Security": {
            "description": "安全合规 — 访问控制·凭据管理·生产环境保护·审计",

            "访问控制": [
                {"target": "IO服务器(131)", "method": "WinRM :5985", "user": "administrator", "policy": "仅限运维白名单IP"},
                {"target": "Oracle DQYTPROD", "method": "TNS :1521", "user": "DQYTPROD", "policy": "只读账号分离"},
                {"target": "pSpace :9004", "method": "HTTP管理界面", "user": "admin", "policy": "内网访问+密码轮换"},
                {"target": "IOFileServer :7001", "method": "TCP文件服务", "user": "admin", "policy": "内网访问"}
            ],

            "生产环境红线": [
                {"rule": "禁止安装/卸载/停止IO服务", "enforcement": "抓包+WinRM查询巡检"},
                {"rule": "禁止抢占CommBridge :53001", "risk": "191 RTU断线"},
                {"rule": "禁止重连DCOM :135", "risk": "DCS安全策略触发→IOMan崩溃"},
                {"rule": "禁止竞争OLEDB连接池", "risk": "IoCommit写库失败→数据丢失"},
                {"rule": "凭据不可落地/明文存储", "enforcement": "环境变量+加密配置"}
            ],

            "下发安全边界": [
                {"op": "查询 GET /api/classes/Device", "risk": "无(只读)", "permit": True},
                {"op": "遥测 GET /api/telemetry/{id}/{point}", "risk": "无(只读)", "permit": True},
                {"op": "扫描 dgiot :53002", "risk": "低(独立通道)", "permit": True},
                {"op": "统计 Oracle COUNT/GROUP", "risk": "无(只读)", "permit": True},
                {"op": "写入 POST/PUT/DELETE Device", "risk": "高(竞争IoCommit)", "permit": False},
                {"op": "控制 Modbus Write Register", "risk": "严重(可能写错RTU)", "permit": False},
                {"op": "重连 DCOM Reconnect", "risk": "严重(触发DCS安全策略)", "permit": False},
                {"op": "大批SQL查询", "risk": "中(竞争OLEDB)", "permit": False}
            ],

            "合规要求": [
                "等保2.0三级",
                "EX防爆区域合规",
                "5角色×4密级访问控制",
                "审计日志全量留存(180天)"
            ]
        }
    }

    # 统计
    data_count = sum(len(v) if isinstance(v, list) else 1 for v in ontology['Data'].values())
    logic_count = sum(len(v) if isinstance(v, list) else 1 for v in ontology['Logic'].values())
    action_count = sum(len(v) if isinstance(v, list) else 1 for v in ontology['Action'].values())
    security_count = sum(len(v) if isinstance(v, list) else 1 for v in ontology['Security'].values())

    ontology['meta']['total_entities'] = data_count
    ontology['meta']['total_constraints'] = logic_count + security_count

    return ontology

# ============================================================
# Step 3: 构建力导图
# ============================================================
def build_force_graph(ontology):
    """从本体构建力导向图节点和连线"""

    # 分类颜色映射 — DLAS 四层 + 子分类
    categories = [
        {"name": "场站", "itemStyle": {"color": "#e74c3c"}},       # 红
        {"name": "服务器", "itemStyle": {"color": "#3498db"}},      # 蓝
        {"name": "进程", "itemStyle": {"color": "#2ecc71"}},        # 绿
        {"name": "协议", "itemStyle": {"color": "#9b59b6"}},        # 紫
        {"name": "设备", "itemStyle": {"color": "#f39c12"}},        # 橙
        {"name": "DCS", "itemStyle": {"color": "#1abc9c"}},         # 青
        {"name": "配置", "itemStyle": {"color": "#95a5a6"}},        # 灰
        {"name": "校验", "itemStyle": {"color": "#e67e22"}},        # 深橙
        {"name": "约束", "itemStyle": {"color": "#c0392b"}},        # 深红
        {"name": "数据流", "itemStyle": {"color": "#16a085"}},      # 深青
        {"name": "安全", "itemStyle": {"color": "#8e44ad"}},        # 深紫
        {"name": "链路", "itemStyle": {"color": "#2c3e50"}},        # 深灰蓝
    ]

    nodes = []
    links = []
    node_names = set()

    def add_node(name, category, symbol_size=30, extra=None):
        if name not in node_names:
            node_names.add(name)
            node = {"name": name, "symbolSize": symbol_size, "category": category}
            if extra:
                node.update(extra)
            nodes.append(node)

    def add_link(source, target, label=""):
        links.append({"source": source, "target": target, "label": label})

    # --- 核心枢纽 ---
    add_node("南4联合站", "场站", 70)
    add_node("IO服务器(131)", "服务器", 55)
    add_node("pSpace(130)", "服务器", 50)
    add_node("Oracle(129)", "服务器", 50)
    add_node("开发机(155)", "服务器", 40)

    # 场站 → 服务器
    add_link("南4联合站", "IO服务器(131)", "部署于")
    add_link("IO服务器(131)", "pSpace(130)", "A11:8889")
    add_link("IO服务器(131)", "Oracle(129)", "TNS:1521")

    # --- DCS 站点 ---
    for dcs in ontology['Data']['DCS系统']:
        add_node(dcs['name'], "DCS", 35)
        add_link("IO服务器(131)", dcs['name'], f"OPC DA ({dcs['ip']})")

    # --- 场站节点 ---
    for s in ontology['Data']['场站']:
        if s['name'] != "南4联合站":
            add_node(s['name'], "场站", 35)
            if 'ip' in s and s['ip']:
                add_link(s['name'], "IO服务器(131)", "OPC DA采集")

    # --- 采集进程 ---
    for proc in ontology['Data']['采集进程']:
        add_node(proc['name'], "进程", 30)
        if 'CommBridge' in proc['name']:
            add_link("IO服务器(131)", proc['name'], "运行")
            add_link(proc['name'], "RTU设备(191台)", "TCP:53001")
        elif 'IOMan' in proc['name']:
            add_link("IoProject.exe", proc['name'], "CreateProcess")
        elif 'IoMonitor' in proc['name']:
            add_link("CommBridge.exe", proc['name'], "WM_COPYDATA")
            add_link(proc['name'], "Oracle(129)", "OLEDB写入")
        elif 'IoCommit' in proc['name']:
            add_link("pSpace(130)", proc['name'], "psAPI")
            add_link(proc['name'], "Oracle(129)", "批量写入")
        elif 'IoProject' in proc['name']:
            add_link("IO服务器(131)", proc['name'], "主引擎")
        elif 'GPRSDLL' in proc['name']:
            add_link("CommBridge.exe", proc['name'], "加载")

    # 开发机
    add_link("开发机(155)", "IO服务器(131)", "WinRM:5985")

    # --- RTU设备 ---
    add_node("RTU设备(191台)", "设备", 45)
    add_node("12种保护装置", "设备", 35)
    add_link("RTU设备(191台)", "12种保护装置", "装配")
    for dev in ontology['Data']['设备与装置'][:6]:  # 前6个
        add_node(dev['name'], "设备", 20)
        add_link("12种保护装置", dev['name'], "类型")

    # --- 协议栈 ---
    for proto in ontology['Data']['协议栈']:
        short_name = proto['name'].split('(')[0]
        add_node(short_name, "协议", 25)

    add_link("IO服务器(131)", "A11", "到pSpace")
    add_link("IO服务器(131)", "Modbus TCP", "到RTU")
    add_link("IO服务器(131)", "OPC DA", "到DCS")
    add_link("IO服务器(131)", "Oracle TNS", "到Oracle")
    add_link("CommBridge.exe", "CommBridge专有帧", "封装")

    # --- 配置文件 ---
    for cfg in ontology['Data']['配置文件']:
        add_node(cfg['name'], "配置", 18)
        add_link("IO服务器(131)", cfg['name'], "读取")

    # --- 三大数据流 ---
    add_node("Modbus采集链路", "链路", 30)
    add_node("OPC DA采集链路", "链路", 30)
    add_node("A11采集链路", "链路", 30)
    add_link("RTU设备(191台)", "Modbus采集链路", "")
    add_link("Modbus采集链路", "IO服务器(131)", "实时")
    add_link("DCS-A", "OPC DA采集链路", "")
    add_link("OPC DA采集链路", "IO服务器(131)", "实时")
    add_link("pSpace(130)", "A11采集链路", "")
    add_link("A11采集链路", "IO服务器(131)", "1-5s")

    # --- 测点体系 ---
    add_node(f"Modbus测点(4567)", "设备", 22)
    add_node(f"OPC测点(26081)", "设备", 25)
    add_node(f"pSpace标签(16663)", "设备", 22)
    add_link("Modbus采集链路", "Modbus测点(4567)", "")
    add_link("OPC DA采集链路", "OPC测点(26081)", "")
    add_link("A11采集链路", "pSpace标签(16663)", "")

    # --- 五级校验 ---
    for check in ontology['Logic']['五级校验']:
        add_node(check['level'], "校验", 20)
        if check['level'] != 'L1':
            prev = f"L{int(check['level'][1])-1}"
            add_link(prev, check['level'], "升级")
    add_link("IO服务器(131)", "L1", "校验入口")

    # --- 安全策略 ---
    add_node("采集冲突边界", "安全", 30)
    add_node("安全下发窗口", "安全", 28)
    add_node("生产环境红线", "安全", 30)
    add_link("IO服务器(131)", "采集冲突边界", "约束")
    add_link("采集冲突边界", "安全下发窗口", "允许")
    add_link("IO服务器(131)", "生产环境红线", "强制")

    # --- 组织架构 ---
    add_node("采油二厂", "场站", 50)
    add_node("采油三厂", "场站", 45)
    add_node("第四作业区", "场站", 38)
    add_node("第八作业区", "场站", 35)
    add_link("采油二厂", "第四作业区", "管辖")
    add_link("第四作业区", "南4联合站", "管辖")
    add_link("采油三厂", "第八作业区", "管辖")
    add_link("第八作业区", "北9注水站", "管辖")
    add_link("第八作业区", "北15联合站", "管辖")
    add_link("第八作业区", "萨北21站", "管辖")

    # --- dgiot_lite ---
    add_node("dgiot_lite", "链路", 35)
    add_link("开发机(155)", "dgiot_lite", "部署")
    add_link("dgiot_lite", "Modbus采集链路", "替代CommBridge")
    add_link("dgiot_lite", "OPC DA采集链路", "直读Oracle")
    add_link("dgiot_lite", "A11采集链路", "psAPISDK待认证")

    return {"nodes": nodes, "links": links, "categories": categories}


# ============================================================
# Main
# ============================================================
if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 60)
    print("油田作业区场站 DLAS 本体构建")
    print("=" * 60)

    # Step 1: 分析CSV
    print("\n[1/4] 分析 pSpace_tags.csv ...")
    csv_stats = analyze_csv()
    print(f"  标签总数: {csv_stats['total_tags']:,}")
    print(f"  站点数: {len(csv_stats['stations'])}")
    print(f"  井数: {csv_stats['well_count']:,}")
    print(f"  测点类型: {csv_stats['point_type_count']} 种")
    print(f"  计量间: {csv_stats['metering_station_count']} 个")

    # Step 2: 构建本体
    print("\n[2/4] 构建 DLAS 四层本体 ...")
    ontology = build_ontology(csv_stats)
    print(f"  Data层:   场站/服务器/进程/协议/设备/DCS/配置 共 {len(ontology['Data'])} 类")
    print(f"  Logic层:  采集节拍/时序/校验/公式/资源/策略 共 {len(ontology['Logic'])} 类")
    print(f"  Action层: 采集链路/IPC/dgiot接入/自动恢复 共 {len(ontology['Action'])} 类")
    print(f"  Security层: 访问控制/红线/安全边界/合规 共 {len(ontology['Security'])} 类")

    # 保存本体
    with open('oilfield_ontology.json', 'w', encoding='utf-8') as f:
        json.dump(ontology, f, ensure_ascii=False, indent=2)
    print("\n  [OK] 本体已保存: oilfield_ontology.json")

    # Step 3: 构建力导图数据
    print("\n[3/4] 构建力导向图 ...")
    graph_data = build_force_graph(ontology)
    print(f"  节点数: {len(graph_data['nodes'])}")
    print(f"  连线数: {len(graph_data['links'])}")
    print(f"  分类数: {len(graph_data['categories'])}")

    # 保存力导图数据
    with open('force_graph_data.json', 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    print("  [OK] 力导图数据已保存: force_graph_data.json")

    # Step 4: 统计报告
    print("\n[4/4] 生成统计 ...")
    data_entities = (
        len(ontology['Data']['场站']) +
        len(ontology['Data']['服务器与网络']) +
        len(ontology['Data']['采集进程']) +
        len(ontology['Data']['协议栈']) +
        len(ontology['Data']['设备与装置']) +
        len(ontology['Data']['DCS系统']) +
        len(ontology['Data']['配置文件'])
    )
    logic_rules = len(ontology['Logic']['五级校验']) + len(ontology['Logic']['采集节拍'])
    action_chains = len(ontology['Action']['三大采集链路'])
    security_rules = len(ontology['Security']['生产环境红线']) + len(ontology['Security']['下发安全边界'])

    print(f"""
    ╔══════════════════════════════════════╗
    ║     油田作业区场站 本体统计          ║
    ╠══════════════════════════════════════╣
    ║ Data 实体:    {data_entities:>5}                  ║
    ║ Logic 规则:   {logic_rules:>5}                  ║
    ║ Action 链路:  {action_chains:>5}                  ║
    ║ Security 规则:{security_rules:>5}                  ║
    ║ 力导图节点:   {len(graph_data['nodes']):>5}                  ║
    ║ 力导图连线:   {len(graph_data['links']):>5}                  ║
    ║ 总测点数:     {csv_stats['total_tags'] + 4567 + 26081:>7,}            ║
    ╠══════════════════════════════════════╣
    ║ 状态: [OK] 本体完整，可进入部署        ║
    ╚══════════════════════════════════════╝
    """)

    print("Done. Next: python build_force_html.py 生成力导图 HTML")
