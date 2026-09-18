#!/usr/bin/env python3
"""audit_ontology.py — DLAS 本体审计 (dgaiot Loop2)

七项检查 (feedforward + feedback):
  1. 实体完整性  — 四层实体：**声明** vs 从本体实测      [判定]
  2. 关系覆盖率  — 声明的关系 vs 本体实际关系矩阵        [判定]
  3. 规则覆盖    — 本体规则覆盖四层                     [判定]
  4. 地址冲突    — Modbus/寄存器地址重复检测             [判定·基线不驱动]
  5. 缺失元数据  — 实体缺少 mandatory 字段               [判定]
  6. 升级建议    — scene_upgrade 候选                   [**INFO·非判定**]
  7. OWL 导出    — 本体可序列化验证                     [判定]

输出: JSON → stdout (Loop 消费)
状态: memory/dgaiot-ontology-loop.md

═══ 2026-09-16 订正：三个「没有执行者的判据」═══

本文件原先有**三个 check 无论现场是什么样都报 PASS** —— 它们的 `status` 是字面量
`'PASS'`，而它们「数」的东西是**自己写死的名单长度**（`len(['servers','dcs',...])`）。
函数确实被调用了、返回了、被计进 `summary['pass']`，
所以**在报告里它与真判据长得一模一样** —— 这正是「判据必须指到执行它的那行代码」
要防的东西：一个没有执行者的判据不是弱判据，是**装饰**。

订正后：
  · 声明移到模块级常量 `DECLARED_LAYERS` / `DECLARED_RELATIONS`，**标明是期望不是实测**；
  · 实测一律走 `$ONTOLOGY_DIR/io_ontology.py` 的 `IOOntology`；
  · 读不到输入 ⇒ `SKIP`（计入 `summary['unchecked']`），**绝不用声明的长度冒充实测**；
  · 顶层 `status` 只有在 **unchecked == 0** 时才可能 PASS（跳过必报红）。

═══ 订正时实测到的两处漂移（不是猜的，是跑出来的）═══

`audit_ontology.py` 与 `io_ontology.py` 各写了一份**四层实体表**，且已经不一致 ——
「同一事实两处、无同步机制」在本文件里是现成的：

  · Data 层：本文件声明 10 个（含 Device/Channel/Point/Product），
    而 `IOOntology.get_entities()` 自己那份只有 6 个；
  · 本文件声明的 22 个实体名里，只有 5 个（servers/processes/protocols/data_sources/ports）
    能在 `io_ontology.json` 的实际集合里找到；其余 17 个（dcs→实为 dcs_endpoints、
    rtu→rtu_networks、wireless→wireless_terminals、opc_tags、s7_tags、Device、Channel、
    Point、Product、scales、Alarm、Rule、events、Task、_Role、_User）**在数据里不存在**；
  · 本文件声明的 6 条关系（`Device→Channel` …）与 `get_relations()` 返回的 8 条
    （`connectsTo`/`manages`/`writesTo`/`displays`）**一条都对不上**。

⇒ 这些数字**只在本文件里自洽**，所以订正前它们永远「通过」。订正后它们会如实报缺口。

★ 首段把 stdout/stderr 两个流都钉成 UTF-8，是**防御性**的，不是修一个已观测到的崩溃：
  本脚本的 stdout 是 JSON 契约，内含中文，而 Windows 控制台的编码取决于
  `PYTHONIOENCODING` / 代码页 —— 消费方按什么解码无从约定。钉死之后，
  **输出编码成为契约的一部分**。本仓为此撞过五次（`print("✅ …")` 在 GBK 控制台上抛
  `UnicodeEncodeError`，而那句恰在**成功路径**上 ⇒ 一次成功的操作以退出码 1 收场，
  信号反着读），故按「新增脚本的第一个动作」办。本文件现有输出串恰好都在 GBK 内，
  所以今天不崩 —— 但那是一句关于**当前文案**的偶然事实，不是纪律。
"""
import json, sys, os, tempfile
from pathlib import Path
from datetime import datetime, timezone, timedelta

# ── Windows 控制台代码页陷阱（见 docstring 末）──
# stdout 是本脚本的 JSON 契约，stderr 是给人看的；**两个流都要**。
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding='utf-8')
    except Exception:
        pass

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

# ── 声明（**期望值，不是实测值**）──
#
# ⚠️ 这两个常量是「四层实体表」和「必需关系表」的**声明**。它们曾经被当成实测值
# 直接报出去（`len(entities)` 数的是这个 list 自己），所以无论现场是什么样都
# 报 PASS。现在它们只作为**比对基准**：实测从 IOOntology 读，两边对差。
# 读不到实测 ⇒ SKIP，**不许把这个名单的长度当成测量结果**。
DECLARED_LAYERS = {
    'Data':    ['servers', 'dcs', 'rtu', 'wireless', 'opc_tags', 's7_tags',
                 'Device', 'Channel', 'Point', 'Product'],
    'Logic':   ['processes', 'protocols', 'scales', 'Alarm', 'Rule'],
    'Action':  ['data_sources', 'events', 'ports', 'Task'],
    'Security':['_Role', '_User', 'servers'],
}

DECLARED_RELATIONS = [
    ('Device', 'Channel'), ('Device', 'Product'), ('Device', 'Point'),
    ('Point', 'Product'), ('Channel', 'Product'), ('User', 'Role'),
]

# ── 地址冲突基线（**带理由，不驱动状态**）──
#
# 原先把这 2 条写死在 `known_collisions` 里，再让 `all_collisions = known + new`
# 参与状态计算 ⇒ `all_collisions` 恒非空 ⇒ status 恒为 WARN ⇒ **本脚本永远不可能
# 报 PASS、退出码永远非 0**。一个永远红的判据与一个永远绿的判据同样没用。
#
# 形制同 `_organize/scan_iotstudio.py` 的基线：**每清一条命中必须往基线写理由**。
# 这里的 2 条经人工判定为可接受（slaveid 存在时可区分），写清理由后不再驱动状态；
# 一旦哪条理由不再成立，就从基线里删掉它，它会重新变红。
ADDRESS_BASELINE = {
    '40404': '变频运行频率 / 运行频率 共用地址，slaveid 01/02 区分 —— 已判定可接受',
    '40406': '变频故障状态 / 故障类型 共用地址，slaveid 01/04 区分 —— 已判定可接受',
}

# ═══════════════════════════════════════════
# 取实测值（失败一律 SKIP，不兜底）
# ═══════════════════════════════════════════

def _load_ontology():
    """从 $ONTOLOGY_DIR 载入 IOOntology。

    返回 `(onto, None)` 或 `(None, 理由)`。**不许兜底成空对象** ——
    「取不到」与「取到 0 个」在报告里必须长得不一样，否则接口一挂，
    报告会显示「本体是空的」，而那是一句完全不同的话。
    """
    if not IO_ONTOLOGY.exists():
        return None, f'{IO_ONTOLOGY} 不存在 —— 实测值取不到'
    sys.path.insert(0, str(ONTOLOGY_DIR))
    try:
        from io_ontology import IOOntology
    except Exception as e:
        return None, f'import io_ontology 失败: {type(e).__name__}: {e}'
    try:
        return IOOntology(), None
    except Exception as e:
        return None, f'IOOntology() 构造失败: {type(e).__name__}: {e}'


def _skipped(name, why, **extra):
    """判定型 check 取不到输入时的统一形态。

    `SKIP` 不是 PASS、也不是 ERROR：它说的是「**这一项没被检验**」。
    `run_audit` 会把它计进 `summary['unchecked']`，并让顶层 status 不许 PASS。
    """
    return {'check': name, 'status': 'SKIP', 'reason': why, **extra}


# ═══════════════════════════════════════════
# 检查逻辑
# ═══════════════════════════════════════════

def check_entity_completeness():
    """1. 实体完整性 —— **声明** vs **实测**

    ⚠️ 原实现：`layers` 是字面量，返回的 `entities: len(entities)` 数的是那个
    list 自己的长度，`status: 'PASS'` 是字面量 ⇒ **不读任何输入，恒 PASS**。

    现在：声明留在 `DECLARED_LAYERS`，实测走 `IOOntology.get_entities()`，
    逐层逐表报「声明了几个、实测几行、哪些声明在实测里找不到」。
    """
    onto, why = _load_ontology()
    if onto is None:
        return _skipped('entity_completeness', why,
                        declared_layers={k: len(v) for k, v in DECLARED_LAYERS.items()})
    try:
        measured = onto.get_entities()          # {layer: {table: [row, ...]}}
    except Exception as e:
        # io_ontology 的 query() 不吞异常（`self.db.execute(...).fetchall()`），
        # 所以「声明的表在库里不存在」会在这里抛 sqlite3.OperationalError。
        return _skipped('entity_completeness',
                        f'get_entities() 抛 {type(e).__name__}: {e}',
                        declared_layers={k: len(v) for k, v in DECLARED_LAYERS.items()})

    counts, missing, total = {}, {}, 0
    for layer, names in DECLARED_LAYERS.items():
        got = measured.get(layer) or {}
        counts[layer] = {n: len(got.get(n) or []) for n in names}
        total += sum(counts[layer].values())
        miss = [n for n in names if n not in got]
        if miss:
            missing[layer] = miss

    declared_total = sum(len(v) for v in DECLARED_LAYERS.values())

    # 域为空不许打通过：实测 0 行时，「找不到缺口」是因为**什么都没量到**。
    if total == 0:
        return {'check': 'entity_completeness', 'status': 'WARN',
                'declared_total': declared_total, 'measured_total': 0,
                'counts': counts, 'layers_missing': missing,
                'note': '实测 0 行 —— 域为空，不许据此打通过'}

    status = 'PASS' if not missing else 'WARN'
    return {'check': 'entity_completeness', 'status': status,
            'declared_total': declared_total, 'measured_total': total,
            'counts': counts, 'layers_missing': missing}


def check_relation_coverage():
    """2. 关系覆盖率 —— **声明** vs 本体实际关系矩阵

    ⚠️ 原实现：`required_relations` 是字面量 6 条，`status: 'PASS'` 是字面量，
    `required: len(required_relations)` 数的是那个 list 自己 ⇒ 恒 PASS。

    现在拿 `get_relations()` 的实际矩阵去比对：声明里的 (from, to) 能否在
    实际关系的两端找到对应。找不到的逐条列出来。
    """
    onto, why = _load_ontology()
    if onto is None:
        return _skipped('relation_coverage', why,
                        declared=[f'{a}→{b}' for a, b in DECLARED_RELATIONS])
    try:
        rels = onto.get_relations()
    except Exception as e:
        return _skipped('relation_coverage',
                        f'get_relations() 抛 {type(e).__name__}: {e}',
                        declared=[f'{a}→{b}' for a, b in DECLARED_RELATIONS])
    if not rels:
        return {'check': 'relation_coverage', 'status': 'WARN',
                'declared': [f'{a}→{b}' for a, b in DECLARED_RELATIONS],
                'measured_total': 0,
                'note': '实测 0 条关系 —— 域为空，不许据此打通过'}

    def _has(a, b):
        for r in rels:
            f, t = str(r.get('from', '')), str(r.get('to', ''))
            if a.lower() in f.lower() and b.lower() in t.lower():
                return True
        return False

    missing = [f'{a}→{b}' for a, b in DECLARED_RELATIONS if not _has(a, b)]
    return {'check': 'relation_coverage',
            'status': 'PASS' if not missing else 'WARN',
            'declared': [f'{a}→{b}' for a, b in DECLARED_RELATIONS],
            'measured_total': len(rels),
            'relations_missing': missing,
            'measured_sample': [f"{r.get('from')} --[{r.get('relation')}]--> {r.get('to')}"
                                for r in rels[:3]]}


def check_rule_coverage():
    """3. 规则四层覆盖

    ★ 这条**本来就是真判据**（真 import、真读 `get_rules()`），保留。

    但名称要诚实：`io_ontology.py` 里那些「规则」是 **Python lambda 列表**
    （`self.rules = [{... 'condition': lambda v: ...}]`），不是 SWRL。
    本 check 判的是「规则覆盖了几层」，与它是不是 SWRL 无关 ——
    所以这里的措辞一律用「规则」，不写 SWRL。
    """
    onto, why = _load_ontology()
    if onto is None:
        return _skipped('rule_coverage', why)
    try:
        rules = onto.get_rules()
    except Exception as e:
        return _skipped('rule_coverage', f'get_rules() 抛 {type(e).__name__}: {e}')

    if not rules:
        return {'check': 'rule_coverage', 'status': 'WARN',
                'total': 0, 'note': '实测 0 条规则 —— 域为空，不许据此打通过'}

    layers_covered = set(r.get('layer') for r in rules)
    expected = {'Data', 'Logic', 'Action', 'Security'}
    missing = expected - layers_covered

    return {'check': 'rule_coverage',
            'status': 'WARN' if missing else 'PASS',
            'total': len(rules),
            'layers_covered': sorted(x for x in layers_covered if x),
            'layers_missing': sorted(missing),
            'suggestion': f'Add rules for layers: {sorted(missing)}' if missing else None}


def check_address_collisions():
    """4. 寄存器地址冲突检测

    ⚠️ 原实现把 2 条「已知可接受」的冲突写死在 `known_collisions` 里，再让它
    参与状态计算 ⇒ `all_collisions` 恒非空 ⇒ **status 恒为 WARN**、退出码恒非 0。
    一个永远红的判据会训练人忽略它。

    现在：可接受的进 `ADDRESS_BASELINE`（**带理由**、**不驱动状态**），
    状态只由**新增**冲突驱动；基线条目仍如实列在 `baseline` 里备查。
    """
    # ⚠️ 表不在 ⇒ SKIP，不是 PASS。原先会掉到下面返回 PASS（「没有新增冲突」）——
    # 而「没找到冲突」是因为**压根没读表**。空域打通过，与恒真是同一个病的两面。
    if not THING_MODEL.exists():
        return _skipped('address_collisions',
                        f'{THING_MODEL} 不存在 —— 没有可比对的地址表')

    new_collisions = []
    try:
        with open(THING_MODEL, encoding='utf-8') as f:
            model = json.load(f)
        addr_map = {}
        for prop in model.get('properties', []):
            addr = prop.get('address')
            if addr:
                addr_map.setdefault(str(addr), []).append(prop.get('identifier', '?'))
        for addr, ids in addr_map.items():
            if len(ids) > 1 and addr not in ADDRESS_BASELINE:
                new_collisions.append({
                    'addr': addr, 'params': ids, 'severity': 'WARN',
                    'note': 'new collision detected',
                })
    except Exception as e:
        return _skipped('address_collisions',
                        f'thing_model.json 读不动: {type(e).__name__}: {e}')

    return {'check': 'address_collisions',
            'status': 'WARN' if new_collisions else 'PASS',
            'new': len(new_collisions),
            'collisions': new_collisions,
            'baseline': [{'addr': a, 'why': w} for a, w in sorted(ADDRESS_BASELINE.items())]}


def check_metadata_completeness():
    """5. 缺失元数据"""
    if not THING_MODEL.exists():
        return _skipped('metadata', f'{THING_MODEL} 不存在')

    try:
        with open(THING_MODEL, encoding='utf-8') as f:
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
    """6. 升级建议 —— **INFO，不是判定**

    ⚠️ 原实现 `status: 'PASS'` + `count: len(suggestions)`，而 `suggestions`
    是 3 条字面量 ⇒ 与那三个恒真判据同族。但它比它们更根本的问题不是「恒真」，
    是**它根本不是判据**：一个只会吐出预置建议的函数，没有可失败的条件。

    所以它的 status 改成 `INFO` —— `run_audit` **不把它计进 pass**，
    它也就不再需要假装自己检验过什么。（同一轮删掉了原先那个恒假死分支：
    `if 'Security' not in ('Data','Logic','Action','Security'): pass`
    —— 条件恒为 False，那段 `pass` 从来没执行过。）
    """
    suggestions = [
        {'type': 'AUTO_RESPONSE', 'desc': '变频故障状态→自动复位命令',
         'trigger': 'fault_status > 0', 'action': 'reset_command_send'},
        {'type': 'TREND_DETECT', 'desc': '运行频率突降→sudden_change告警',
         'trigger': 'freq_drop > 20% in 60s', 'action': 'trend_sudden_change'},
        {'type': 'CORRELATION', 'desc': '电流+频率联合异常→保护动作',
         'trigger': 'current > 2x AND freq < 25Hz', 'action': 'protect_trigger'},
    ]
    return {'check': 'upgrade_suggestions', 'status': 'INFO',
            'count': len(suggestions), 'suggestions': suggestions,
            'note': '非判定型：预置建议清单，无可失败条件，不计入 pass'}


def check_owl_export():
    """7. OWL 可序列化"""
    onto, why = _load_ontology()
    if onto is None:
        return _skipped('owl_export', why)
    try:
        tmp_owl = os.path.join(tempfile.gettempdir(), 'test_ontology.owl')
        result = onto.export_owl(tmp_owl)
        return {'check': 'owl_export', 'status': 'PASS', 'detail': result}
    except Exception as e:
        return {'check': 'owl_export', 'status': 'ERROR',
                'error': f'{type(e).__name__}: {e}'}


# ═══════════════════════════════════════════
# 主流程
# ═══════════════════════════════════════════

def run_audit():
    def _safe(fn):
        """单项检查失败不能掀掉整份报告。

        本文件 7 个 check 里只有 3 个自带 try/except，另外 4 个没有 ——
        任一抛异常（例如 $ONTOLOGY_DIR 里缺 io_ontology.py）就会让脚本带着
        traceback 退出、**一个 JSON 都不输出**，而本文件 docstring 承诺
        「输出: JSON → stdout (Loop 消费)」。统一在调用点兜住，新加的 check 也不会再漏。
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
    skipped  = [c for c in checks if c['status'] == 'SKIP']
    passed   = [c for c in checks if c['status'] == 'PASS']

    # ★ 顶层 status 只有在 **unchecked == 0** 时才可能 PASS。
    # 「跳过的必计入 unchecked 并硬报红」—— 一个没被检验的判定项，
    # 与一个检验通过了的判定项，在报告顶上不能长得一样。
    if critical:
        status = 'CRITICAL'
    elif warnings or errors or skipped:
        status = 'WARN'
    else:
        status = 'PASS'

    report = {
        'timestamp': datetime.now(CST).isoformat(),
        'audit_version': '2.0',
        'status': status,
        'summary': {
            'total_checks': len(checks),
            'pass': len(passed),
            'warn': len(warnings),
            'error': len(errors),
            'critical': len(critical),
            'skip': len(skipped),
            'unchecked': [c['check'] for c in skipped],   # ★ 名字，不只是个数
            'info': len([c for c in checks if c['status'] == 'INFO']),
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

    unchecked = s.get('unchecked') or []
    md = f"""# Loop: Ontology Audit

```
Last:   {report['timestamp'][:16]}
Round:  auto
Status: {report['status']} (CRITICAL={s['critical']} WARN={s['warn']} ERROR={s['error']} \
SKIP={s['skip']} INFO={s['info']})

AUDIT:  {report['status']}
"""
    if unchecked:
        md += f"UNCHECKED: {', '.join(unchecked)}  ← 这几项没被检验，不是通过\n"
    for col in collisions:
        md += f"  {col['addr']}: {'+'.join(col['params'])} ({col['note']})\n"

    md += f"""
UPGRADE: {s['info']} info-only check(s) (不计入 pass)

Next: +4h (Cron: 227ee256)
```
"""
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORT_FILE.write_text(md, encoding='utf-8')
    # 走 stderr：stdout 是本脚本的 JSON 契约（docstring: "输出: JSON → stdout
    # (Loop 消费)"），这行混进去会让消费方的 json.loads 直接抛
    # "Extra data: line N column 1"。
    print(f"Memory written: {REPORT_FILE}", file=sys.stderr)


if __name__ == '__main__':
    os.chdir(str(ONTOLOGY_DIR))
    report = run_audit()
    write_memory(report)
    # exit code: 0=PASS, 1=WARN(含 SKIP/ERROR/INFO), 2=CRITICAL
    sys.exit(0 if report['status'] == 'PASS' else (2 if report['status'] == 'CRITICAL' else 1))
