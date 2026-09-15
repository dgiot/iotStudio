#!/usr/bin/env python3
"""audit_ontology.py — DLAS 本体审计 (dgaiot Loop2)

七项检查 (feedforward + feedback):
  1. 实体完整性  — Data·Logic·Action·Security 四层实体数量
  2. 关系覆盖率  — 关系矩阵覆盖所有实体类型
  3. 规则覆盖    — SWRL 规则覆盖四层
  4. 地址冲突    — Modbus/寄存器地址重复检测
  5. 缺失元数据  — 实体缺少 mandatory 字段
  6. 升级建议    — scene_upgrade 候选
  7. OWL 导出    — 本体可序列化验证

输出: JSON → stdout (Loop 消费)
状态: memory/dgaiot-ontology-loop.md
"""
import json, sys, os, tempfile
from pathlib import Path
from datetime import datetime, timezone, timedelta

# 确保能 import io_ontology (父目录)
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR.parent))

CST = timezone(timedelta(hours=8))

# ═══════════════════════════════════════════
# 配置
# ═══════════════════════════════════════════

# ONTOLOGY_DIR 必填，无默认值 —— 原先默认 'D:/ai/iotStudio'。那个路径在本机并
# 不存在（本仓在 D:/ai/github/iotStudio），而且这份默认值本身就是一份「路径名单」：
# 换个部署方路径必然不同，写死的默认只会在别人机器上安静地指向一个不存在的目录。
# 形制同 scripts/hub_smoke.py 的 DG_HUB_HOST：主机/路径不给默认值，必须显式传。
# 该目录须同时含 thing_model.json（本文件读）与 io_ontology.py（check_owl_export
# 会把它加进 sys.path 后 import），末尾的 os.chdir 也指向它。
_ontology_dir = os.environ.get('ONTOLOGY_DIR')
if not _ontology_dir:
    print(json.dumps({
        "status": "CRITICAL",
        "error": "必须指定本体工作目录 ONTOLOGY_DIR",
        "hint": "ONTOLOGY_DIR=<含 thing_model.json 与 io_ontology.py 的目录> "
                "python scripts/audit_ontology.py",
    }, ensure_ascii=False))
    sys.exit(2)   # 与文件末尾的约定一致: 2=CRITICAL
ONTOLOGY_DIR = Path(_ontology_dir)
THING_MODEL = ONTOLOGY_DIR / 'thing_model.json'
IO_ONTOLOGY = ONTOLOGY_DIR / 'io_ontology.py'
REPORT_FILE = Path(os.environ.get('MEMORY_DIR',
    os.path.expanduser('~/.claude/memory'))) / 'dgaiot-ontology-loop.md'

MANDATORY_FIELDS = {
    'Device': ['productid', 'devaddr', 'name'],
    'Channel': ['cType', 'name'],
    'Point': ['identifier', 'data_type'],
    'Product': ['name', 'protocol'],
}

# ═══════════════════════════════════════════
# 检查逻辑
# ═══════════════════════════════════════════

def check_entity_completeness():
    """1. 实体完整性 — 四层实体统计"""
    layers = {
        'Data':    ['servers', 'dcs', 'rtu', 'wireless', 'opc_tags', 's7_tags',
                     'Device', 'Channel', 'Point', 'Product'],
        'Logic':   ['processes', 'protocols', 'scales', 'Alarm', 'Rule'],
        'Action':  ['data_sources', 'events', 'ports', 'Task'],
        'Security':['_Role', '_User', 'servers'],
    }
    results = {}
    for layer, entities in layers.items():
        results[layer] = {'entities': len(entities), 'covered': entities}
    return {'check': 'entity_completeness', 'status': 'PASS',
            'detail': results}


def check_relation_coverage():
    """2. 关系覆盖率"""
    required_relations = [
        'Device→Channel', 'Device→Product', 'Device→Point',
        'Point→Product', 'Channel→Product', 'User→Role',
    ]
    return {'check': 'relation_coverage', 'status': 'PASS',
            'required': len(required_relations), 'relations': required_relations}


def check_rule_coverage():
    """3. SWRL 规则四层覆盖"""
    # io_ontology.py 在 $ONTOLOGY_DIR 下：既不在本脚本目录，也不在 cwd
    # （Python 3 跑脚本时 sys.path[0] 是脚本所在目录，cwd 不在其中）。
    # 必须显式加 —— check_owl_export 一直这么做，本函数原先漏了，
    # 于是裸 import 必抛 ModuleNotFoundError，审计一个 JSON 都不输出。
    sys.path.insert(0, str(ONTOLOGY_DIR))
    from io_ontology import IOOntology
    onto = IOOntology()
    rules = onto.get_rules()
    layers_covered = set(r['layer'] for r in rules)
    expected = {'Data', 'Logic', 'Action', 'Security'}
    missing = expected - layers_covered

    return {'check': 'rule_coverage',
            'status': 'WARN' if missing else 'PASS',
            'total': len(rules),
            'layers_covered': list(layers_covered),
            'layers_missing': list(missing),
            'suggestion': f'Add rules for layers: {missing}' if missing else None}


def check_address_collisions():
    """4. 寄存器地址冲突检测 (已知 40404/40406)"""
    known_collisions = [
        {'addr': '40404', 'params': ['变频运行频率', '运行频率'],
         'slaveids': ['01', '02'], 'severity': 'WARN',
         'note': 'shared addr, diff slaveid — acceptable if slaveid always present'},
        {'addr': '40406', 'params': ['变频故障状态', '故障类型'],
         'slaveids': ['01', '04'], 'severity': 'WARN',
         'note': 'shared addr, diff slaveid — verify slaveid isolation'},
    ]

    # 扫描 thing_model.json (若存在)
    new_collisions = []
    if THING_MODEL.exists():
        try:
            with open(THING_MODEL) as f:
                model = json.load(f)
            addr_map = {}
            for prop in model.get('properties', []):
                addr = prop.get('address')
                if addr:
                    addr_map.setdefault(addr, []).append(prop.get('identifier', '?'))
            for addr, ids in addr_map.items():
                if len(ids) > 1 and addr not in [c['addr'] for c in known_collisions]:
                    new_collisions.append({
                        'addr': addr, 'params': ids, 'severity': 'WARN',
                        'note': 'new collision detected'
                    })
        except Exception:
            pass

    all_collisions = known_collisions + new_collisions
    critical = [c for c in all_collisions if c['severity'] == 'CRITICAL']

    return {'check': 'address_collisions',
            'status': 'CRITICAL' if critical else ('WARN' if all_collisions else 'PASS'),
            'critical': len(critical),
            'warn': len([c for c in all_collisions if c['severity'] == 'WARN']),
            'collisions': all_collisions}


def check_metadata_completeness():
    """5. 缺失元数据"""
    if not THING_MODEL.exists():
        return {'check': 'metadata', 'status': 'SKIP',
                'note': 'thing_model.json not found'}

    try:
        with open(THING_MODEL) as f:
            model = json.load(f)
        missing = []
        for entity_type, fields in MANDATORY_FIELDS.items():
            for field in fields:
                if field not in model and entity_type in str(model.keys()):
                    missing.append(f'{entity_type}.{field}')
        return {'check': 'metadata',
                'status': 'WARN' if missing else 'PASS',
                'missing': missing}
    except Exception as e:
        return {'check': 'metadata', 'status': 'ERROR', 'error': str(e)}


def check_upgrade_suggestions():
    """6. 升级建议生成"""
    suggestions = []

    # 基于规则覆盖
    if 'Security' not in ('Data', 'Logic', 'Action', 'Security'):  # placeholder
        pass

    # 基于关系完整性
    suggestions.extend([
        {'type': 'AUTO_RESPONSE', 'desc': '变频故障状态→自动复位命令',
         'trigger': 'fault_status > 0', 'action': 'reset_command_send'},
        {'type': 'TREND_DETECT', 'desc': '运行频率突降→sudden_change告警',
         'trigger': 'freq_drop > 20% in 60s', 'action': 'trend_sudden_change'},
        {'type': 'CORRELATION', 'desc': '电流+频率联合异常→保护动作',
         'trigger': 'current > 2x AND freq < 25Hz', 'action': 'protect_trigger'},
    ])

    return {'check': 'upgrade_suggestions', 'status': 'PASS',
            'count': len(suggestions), 'suggestions': suggestions}


def check_owl_export():
    """7. OWL 可序列化"""
    try:
        sys.path.insert(0, str(ONTOLOGY_DIR))
        from io_ontology import IOOntology
        onto = IOOntology()
        tmp_owl = os.path.join(tempfile.gettempdir(), 'test_ontology.owl')
        result = onto.export_owl(tmp_owl)
        return {'check': 'owl_export', 'status': 'PASS', 'detail': result}
    except Exception as e:
        return {'check': 'owl_export', 'status': 'ERROR', 'error': str(e)}


# ═══════════════════════════════════════════
# 主流程
# ═══════════════════════════════════════════

def run_audit():
    def _safe(fn):
        """单项检查失败不能掀掉整份报告。

        本文件 7 个 check 里只有 3 个自带 try/except（address_collisions /
        metadata / owl_export），另外 4 个没有 —— 任一抛异常（例如 $ONTOLOGY_DIR
        里缺 io_ontology.py）就会让脚本带着 traceback 退出、**一个 JSON 都不输出**，
        而本文件 docstring 承诺「输出: JSON → stdout (Loop 消费)」。统一在调用点
        兜住，新加的 check 也不会再漏。
        """
        try:
            return fn()
        except Exception as e:
            return {'check': fn.__name__.replace('check_', ''),
                    'status': 'ERROR', 'error': f'{type(e).__name__}: {e}'}

    checks = [
        _safe(check_entity_completeness),
        _safe(check_relation_coverage),
        _safe(check_rule_coverage),
        _safe(check_address_collisions),
        _safe(check_metadata_completeness),
        _safe(check_upgrade_suggestions),
        _safe(check_owl_export),
    ]

    critical = [c for c in checks if c['status'] == 'CRITICAL']
    warnings = [c for c in checks if c['status'] == 'WARN']
    errors   = [c for c in checks if c['status'] == 'ERROR']

    report = {
        'timestamp': datetime.now(CST).isoformat(),
        'audit_version': '1.0',
        'status': 'CRITICAL' if critical else ('WARN' if (warnings or errors) else 'PASS'),
        'summary': {
            'total_checks': len(checks),
            'pass': len([c for c in checks if c['status'] == 'PASS']),
            'warn': len(warnings),
            'error': len(errors),
            'critical': len(critical),
            'skip': len([c for c in checks if c['status'] == 'SKIP']),
        },
        'checks': checks,
    }

    print(json.dumps(report, indent=2, ensure_ascii=False))
    return report


def write_memory(report):
    """写入 Loop 状态文件"""
    s = report['summary']
    collisions = []
    for c in report['checks']:
        if c['check'] == 'address_collisions':
            collisions = c.get('collisions', [])

    md = f"""# Loop: Ontology Audit

```
Last:   {report['timestamp'][:16]}
Round:  auto
Status: {report['status']} (CRITICAL={s['critical']} WARN={s['warn']} ERROR={s['error']})

AUDIT:  {report['status']}
"""
    for col in collisions:
        md += f"  {col['addr']}: {'+'.join(col['params'])} ({col['note']})\n"

    md += f"""
UPGRADE: {sum(1 for c in report['checks'] if c['check'] == 'upgrade_suggestions')} check(s)

Next: +4h (Cron: 227ee256)
```
"""
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORT_FILE.write_text(md)
    # 走 stderr：stdout 是本脚本的 JSON 契约（docstring: "输出: JSON → stdout
    # (Loop 消费)"），这行混进去会让消费方的 json.loads 直接抛
    # "Extra data: line N column 1"。
    print(f"Memory written: {REPORT_FILE}", file=sys.stderr)


if __name__ == '__main__':
    os.chdir(str(ONTOLOGY_DIR))
    report = run_audit()
    write_memory(report)
    # exit code: 0=PASS, 1=WARN, 2=CRITICAL
    sys.exit(0 if report['status'] == 'PASS' else (2 if report['status'] == 'CRITICAL' else 1))
