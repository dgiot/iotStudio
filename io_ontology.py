#!/usr/bin/env python3
"""IO 服务器本体 — SWRL 规则引擎 + 实时执行"""
import json, time, sqlite3, threading
from collections import defaultdict

# ===== 1. 知识图谱 (骨架) =====
class IOOntology:
    def __init__(self, db_path='io_server.db'):
        self.db = sqlite3.connect(db_path)
        self.db.row_factory = sqlite3.Row
        self.rules = []
        self.state = defaultdict(dict)
        self.load_rules()

    def query(self, sql, params=()):
        return [dict(r) for r in self.db.execute(sql, params).fetchall()]

    # ===== 2. SWRL 规则引擎 (大脑) =====
    def load_rules(self):
        """加载约束规则"""
        self.rules = [
            # 设备约束
            {
                'id': 'R001', 'name': '载荷超限告警',
                'layer': 'Logic',
                'condition': lambda v: v.get('parameter') == '最大载荷' and v.get('value', 0) > 100,
                'action': 'ALARM', 'severity': 'WARNING',
                'msg': '设备 {device} 最大载荷 {value} 超过阈值 100'
            },
            {
                'id': 'R002', 'name': '电流不平衡保护',
                'layer': 'Logic',
                'condition': lambda v: v.get('parameter') == '最大下行电流' and v.get('value', 0) > 20,
                'action': 'PROTECT', 'severity': 'DANGER',
                'msg': '设备 {device} 下行电流 {value}A 超过20A, 触发保护'
            },
            # 通信约束
            {
                'id': 'R003', 'name': 'CommBridge 通道监控',
                'layer': 'Logic',
                'condition': lambda v: '打开CommBridge通道失败' in str(v),
                'action': 'ALARM', 'severity': 'ERROR',
                'msg': 'CommBridge 通道故障: {device}'
            },
            # 采集约束
            {
                'id': 'R004', 'name': '采集成功率监控',
                'layer': 'Logic',
                'condition': lambda v: v.get('success_rate', 100) < 50,
                'action': 'ALARM', 'severity': 'WARNING',
                'msg': '设备 {device} 采集成功率降至 {value}%'
            },
            # 安全约束
            {
                'id': 'R005', 'name': '生产网只读保护',
                'layer': 'Security',
                'condition': lambda v: v.get('operation') in ('install', 'reboot', 'stop_service'),
                'action': 'BLOCK', 'severity': 'FATAL',
                'msg': '生产网禁止操作: {operation}'
            },
            # DCOM 约束
            {
                'id': 'R006', 'name': 'DCOM 权限检测',
                'layer': 'Security',
                'condition': lambda v: v.get('status') == 'DCOM拒绝',
                'action': 'REPORT', 'severity': 'INFO',
                'msg': 'DCS {device} 需配置 DCOMCNFG 授权'
            },
        ]

    def evaluate(self, event):
        """评估事件是否触发规则"""
        triggered = []
        for rule in self.rules:
            try:
                if rule['condition'](event):
                    msg = rule['msg'].format(**event) if isinstance(event, dict) else rule['msg']
                    triggered.append({
                        'rule': rule['id'],
                        'name': rule['name'],
                        'action': rule['action'],
                        'severity': rule['severity'],
                        'layer': rule['layer'],
                        'msg': msg,
                        'time': time.time()
                    })
            except Exception as e:
                pass
        return triggered

    # ===== 3. 实时执行 (神经) =====
    def monitor_events(self, callback=None, interval=5):
        """从数据库轮询实时事件"""
        last_id = 0
        while True:
            try:
                events = self.query('SELECT * FROM events WHERE id > ?', (last_id,))
                for e in events:
                    triggered = self.evaluate(e)
                    if triggered and callback:
                        callback(e, triggered)
                    last_id = max(last_id, e['id'])
                # 模拟实时数据更新
                self.simulate_data()
            except Exception as ex:
                pass
            time.sleep(interval)

    def simulate_data(self):
        """模拟实时数据(本地测试用)"""
        import random
        devices = self.query('SELECT terminal_id FROM wireless')
        for d in random.sample(devices, min(3, len(devices))):
            tid = d['terminal_id']
            event = {
                'device': tid,
                'parameter': random.choice(['最大载荷', '最大下行电流']),
                'value': round(random.uniform(10, 120), 2),
                'time': time.time()
            }
            triggered = self.evaluate(event)
            if triggered:
                for t in triggered:
                    print(f"[{t['severity']}] {t['name']}: {t['msg']}")

    # ===== 4. 查询接口 =====
    def get_entities(self, layer=None):
        """获取实体列表"""
        tables = {
            'Data': ['servers', 'dcs', 'rtu', 'wireless', 'opc_tags', 's7_tags'],
            'Logic': ['processes', 'protocols', 'scales'],
            'Action': ['data_sources', 'events', 'ports'],
            'Security': ['servers'],
        }
        if layer and layer in tables:
            result = {}
            for t in tables[layer]:
                result[t] = self.query(f'SELECT * FROM {t}')
            return result
        return {l: self.get_entities(l) for l in tables}

    def get_relations(self):
        """获取关系矩阵"""
        return [
            {'from': 'IOMan×36', 'relation': 'connectsTo', 'to': 'DCS-A/B/C/D/E', 'via': 'OPC DA/DCOM'},
            {'from': 'IOMan×36', 'relation': 'connectsTo', 'to': '206 RTU', 'via': 'Modbus TCP :53001'},
            {'from': 'IOMan×36', 'relation': 'connectsTo', 'to': 'pSpace A11', 'via': 'A11 5a5a :8889'},
            {'from': 'IoProject', 'relation': 'manages', 'to': 'IOMan×36 IoCommit×7 CommBridge', 'via': 'pSpace SDK'},
            {'from': 'IoCommit×7', 'relation': 'writesTo', 'to': 'Oracle 功图库', 'via': 'TNS :1521'},
            {'from': 'CommBridge', 'relation': 'manages', 'to': '31 无线终端', 'via': 'GPRS/CDMA'},
            {'from': 'IoMonitor', 'relation': 'displays', 'to': '实时事件', 'via': 'GUI'},
            {'from': '开发机', 'relation': 'connectsTo', 'to': 'IO服务器', 'via': 'WinRM :5985'},
        ]

    def get_rules(self):
        """获取规则列表"""
        return [{'id': r['id'], 'name': r['name'], 'layer': r['layer'],
                 'action': r['action'], 'severity': r['severity']} for r in self.rules]

    def trace(self, from_entity, to_entity):
        """追踪实体间路径"""
        relations = self.get_relations()
        # BFS 搜索
        from queue import Queue
        q = Queue()
        q.put((from_entity, []))
        visited = set()
        while not q.empty():
            current, path = q.get()
            if to_entity.lower() in current.lower():
                return path + [current]
            if current in visited: continue
            visited.add(current)
            for r in relations:
                if current.lower() in r['from'].lower():
                    q.put((r['to'], path + [f"{current} --[{r['relation']}]--> {r['to']}"]))
                if current.lower() in r['to'].lower():
                    q.put((r['from'], path + [f"{r['from']} --[{r['relation']}]--> {current}"]))
        return None

    def export_owl(self, path='io_ontology.owl'):
        """导出 OWL RDF/XML 格式"""
        import xml.etree.ElementTree as ET
        NS = 'http://www.w3.org/2002/07/owl#'
        RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        BASE = 'http://dgiot.io/ontology#'

        root = ET.Element(f'{{{RDF}}}RDF', {
            f'xmlns:owl': NS,
            f'xmlns:rdf': RDF,
            f'xml:base': BASE,
        })

        ontology = ET.SubElement(root, f'{{{NS}}}Ontology', {f'{{{RDF}}}about': ''})
        ET.SubElement(ontology, f'{{{RDF}}}label').text = 'IO Server Ontology'

        # 添加类
        for cls in ['Server', 'Process', 'DataSource', 'DCS', 'RTU', 'Port', 'Protocol', 'WirelessTerminal']:
            c = ET.SubElement(root, f'{{{NS}}}Class', {f'{{{RDF}}}about': f'#{cls}'})
            ET.SubElement(c, f'{{{RDF}}}label').text = cls

        # 添加实例
        servers = self.query('SELECT * FROM servers')
        for s in servers:
            inst = ET.SubElement(root, f'{{{NS}}}NamedIndividual', {
                f'{{{RDF}}}about': f'#server_{s["id"]}'
            })
            ET.SubElement(inst, f'{{{RDF}}}type', {f'{{{RDF}}}resource': '#Server'})
            for key in ['ip', 'hostname', 'role']:
                if s.get(key):
                    ET.SubElement(inst, BASE + key).text = str(s[key])

        tree = ET.ElementTree(root)
        tree.write(path, encoding='utf-8', xml_declaration=True)
        return f'OWL exported: {path}'

if __name__ == '__main__':
    onto = IOOntology()

    # 验证
    print(f'实体: {sum(len(v) for v in onto.get_entities("Data").values())} (Data层)')
    print(f'关系: {len(onto.get_relations())} 条')
    print(f'规则: {len(onto.rules)} 条')

    # 追踪
    path = onto.trace('开发机', 'Oracle')
    print(f'\n追踪: 开发机 → Oracle')
    for step in path: print(f'  {step}')

    # 导出 OWL
    print(f'\n{onto.export_owl()}')

    # 测试规则
    print('\n=== SWRL 规则测试 ===')
    test_events = [
        {'device': '02110120089', 'parameter': '最大载荷', 'value': 86.07},
        {'device': '02110150041', 'parameter': '最大下行电流', 'value': 15.28},
        {'device': 'CommBridge-236', 'msg': '打开CommBridge通道失败，编号236'},
        {'operation': 'install'},
    ]
    for e in test_events:
        results = onto.evaluate(e)
        for r in results:
            print(f"  [{r['severity']}] {r['name']}: {truncate(r['msg'],80)}")
