# ============================================================
# scripts/audit_ontology.py — 「判据必须有执行者」的对平测试
# ============================================================
"""这份脚本原先有**三个 check 无论现场是什么样都报 PASS**：

    · 它们的 `status` 是字面量 `'PASS'`；
    · 它们「数」的东西是**自己写死的名单长度**（`len(['servers','dcs',...])`）；
    · 函数确实被调用、确实返回、确实被计进 `summary['pass']` ——
      所以**在报告里它与真判据长得一模一样**。

同一份报告里另有一个相反方向的病：`check_address_collisions` 把 2 条「已知可接受」
的冲突写死并让它们参与状态计算 ⇒ 恒非空 ⇒ **顶层 status 恒 WARN、退出码恒非 0**。
一个永远红的判据与一个永远绿的判据同样没用。

本文件钉四件事，每件都对应上面一个具体缺陷：

  1. **读不到输入 ⇒ SKIP，不是 PASS**（负控；同时是覆盖新增 check 的总闸）
  2. **喂什么数据报什么数**（正对照 —— 原实现在这里必然失败）
  3. **全绿是可能的**（原实现永不可能 PASS）
  4. **常量之间的比较不许出现**（结构性负控 —— 死分支的指纹）

★ 真件 `io_ontology.py` **不在本仓**（在部署方的 `$ONTOLOGY_DIR`），所以判据
  只能靠「喂受控数据、看它读不读」来证明它有执行者 —— 这恰好也是唯一能证明的
  方式：**一个不读输入的判据，喂任何数据都返回同一个结果。**
"""
import ast
import importlib
import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
SRC = SCRIPTS / "audit_ontology.py"


# ── 受控的「实测来源」──

def _write_fake_ontology(dirpath, *, entities, relations, rule_layers):
    """写一份可配置的 io_ontology.py。

    这是本组用例的**唯一实测来源**。脚本顶部的 `_load_ontology()` 会
    `from io_ontology import IOOntology`，而 `$ONTOLOGY_DIR` 已被它插到 sys.path[0]，
    所以写在这里的假件会被真的 import 进来。
    """
    src = (
        "import json\n"
        "class IOOntology:\n"
        "    def __init__(self, db_path='io_server.db'):\n"
        "        self.rules = [{'id': 'R1', 'layer': l} for l in %s]\n"
        "    def get_entities(self):\n"
        "        return json.loads(%s)\n"
        "    def get_relations(self):\n"
        "        return json.loads(%s)\n"
        "    def get_rules(self):\n"
        "        return [{'id': r['id'], 'name': 'n', 'layer': r['layer'],\n"
        "                 'action': 'A', 'severity': 'W'} for r in self.rules]\n"
        "    def export_owl(self, path='io_ontology.owl'):\n"
        "        return {'path': path, 'classes': 4}\n"
    ) % (repr(rule_layers), repr(json.dumps(entities)), repr(json.dumps(relations)))
    (dirpath / "io_ontology.py").write_text(src, encoding="utf-8")


def _load(dirpath, monkeypatch, *, thing_model=True):
    """以 `dirpath` 为 `$ONTOLOGY_DIR` 载入 audit_ontology。

    ⚠️ 模块级代码在 import 时就读 `ONTOLOGY_DIR`（缺则 `sys.exit(2)`），
    所以**必须先设 env 再 import**，且每个用例都要重新载入 ——
    用一个 module 级 fixture 会让「换个数据源」这件事根本做不到。
    """
    monkeypatch.setenv("ONTOLOGY_DIR", str(dirpath))
    monkeypatch.setenv("MEMORY_DIR", str(dirpath / "_mem"))
    if thing_model:
        (dirpath / "thing_model.json").write_text(
            json.dumps({"properties": []}), encoding="utf-8")
    if str(SCRIPTS) not in sys.path:
        sys.path.insert(0, str(SCRIPTS))
    sys.modules.pop("audit_ontology", None)
    sys.modules.pop("io_ontology", None)      # 假件换了，缓存必须清
    return importlib.import_module("audit_ontology")


@pytest.fixture(autouse=True)
def _drop_module_cache():
    """用例之间不许互相借到上一份假 io_ontology。"""
    yield
    sys.modules.pop("audit_ontology", None)
    sys.modules.pop("io_ontology", None)


# ── 造数据的小工具 ──

def _full_entities(mod, rows):
    """声明的每个实体名都在，各 `rows` 行。"""
    return {layer: {name: [{"i": i} for i in range(rows)] for name in names}
            for layer, names in mod.DECLARED_LAYERS.items()}


def _matching_relations(mod):
    """与 `DECLARED_RELATIONS` 一一对得上的关系矩阵。"""
    return [{"from": a, "relation": "r", "to": b, "via": ""}
            for a, b in mod.DECLARED_RELATIONS]


def _green(mod, dirpath, rows=1):
    """写一份让所有判定项都绿的来源。"""
    _write_fake_ontology(dirpath,
                         entities=_full_entities(mod, rows),
                         relations=_matching_relations(mod),
                         rule_layers=["Data", "Logic", "Action", "Security"])


def _by_check(rep):
    return {c["check"]: c for c in rep["checks"]}


def _passed(rep):
    return [c["check"] for c in rep["checks"] if c["status"] == "PASS"]


# ═══════════════════════════════════════════
# 1. 负控：读不到输入 ⇒ SKIP，不是 PASS（兼新增 check 的总闸）
# ═══════════════════════════════════════════

def test_no_source_at_all_means_nothing_passes(tmp_path, monkeypatch):
    """★ 负控 + **总闸**：`$ONTOLOGY_DIR` 是个空目录。

    原实现在这种情况下**照样报 entity_completeness / relation_coverage = PASS**
    —— 因为它们压根不读输入。现在每一个判定型 check 都必须是 SKIP，
    而且顶层 status 不许是 PASS。

    ★ 这条同时是**给后来者准备的总闸**：今后新加的 check 只要从 `$ONTOLOGY_DIR`
      取数，就会被它自动覆盖 —— 一个 `status` 写成字面量的新 check 在空目录下
      仍会报 PASS，于是 `_passed(rep) == []` 当场变红。
    """
    mod = _load(tmp_path, monkeypatch, thing_model=False)
    rep = mod.run_audit()
    by = _by_check(rep)

    for name in ("entity_completeness", "relation_coverage", "rule_coverage",
                 "address_collisions", "metadata", "owl_export"):
        assert by[name]["status"] == "SKIP", \
            f"{name} 读不到任何输入，却报了 {by[name]['status']}"

    assert _passed(rep) == [], f"空目录下不该有任何 PASS，实际: {_passed(rep)}"
    assert rep["status"] != "PASS"
    # ★ 跳过的必须**点名**计进 unchecked，不能只报一个数
    assert {"entity_completeness", "relation_coverage"} <= set(rep["summary"]["unchecked"])


def test_missing_steps_are_skipped_not_failed(tmp_path, monkeypatch):
    """`io_ontology.py` 在、`thing_model.json` 不在 ⇒ 只有依赖它的那两项 SKIP。

    「取不到」与「取到 0」在报告里必须长得不一样：前者是 SKIP，后者是 WARN。
    """
    mod = _load(tmp_path, monkeypatch, thing_model=False)
    _green(mod, tmp_path)
    rep = mod.run_audit()
    by = _by_check(rep)

    assert by["entity_completeness"]["status"] == "PASS"     # 有源 ⇒ 真判
    assert by["metadata"]["status"] == "SKIP"                # 无表 ⇒ 没检验
    assert by["address_collisions"]["status"] == "SKIP"
    assert rep["status"] != "PASS"                           # 有未检验项 ⇒ 不许绿
    assert set(rep["summary"]["unchecked"]) == {"metadata", "address_collisions"}


# ═══════════════════════════════════════════
# 2. 正对照：喂什么数据报什么数
# ═══════════════════════════════════════════

@pytest.mark.parametrize("rows", [1, 3, 7])
def test_entity_counts_follow_the_measured_data(tmp_path, monkeypatch, rows):
    """★ 正对照 —— **原实现在这里必然失败**。

    原实现报的 `entities` 是 `len(['servers','dcs',...])`，即**它自己写死的名单长度**：
    喂 1 行、3 行、7 行，它都返回同一个数。这条测的就是「它到底读不读输入」。
    """
    mod = _load(tmp_path, monkeypatch)
    _write_fake_ontology(tmp_path,
                         entities=_full_entities(mod, rows),
                         relations=_matching_relations(mod),
                         rule_layers=["Data", "Logic", "Action", "Security"])
    c = _by_check(mod.run_audit())["entity_completeness"]

    declared_total = sum(len(v) for v in mod.DECLARED_LAYERS.values())
    assert c["declared_total"] == declared_total          # 声明是常数
    assert c["measured_total"] == declared_total * rows   # ★ 实测随输入变
    assert c["status"] == "PASS"
    assert not c["layers_missing"]


def test_declared_entities_absent_from_the_data_are_reported(tmp_path, monkeypatch):
    """声明了却在数据里找不到的名字，必须逐条报出来。

    这里喂的是**真 `io_ontology.json` 的集合形状**（servers / processes /
    data_sources / dcs_endpoints / rtu_networks / ports / protocols /
    wireless_terminals）—— 与声明的 22 个名字只有 5 个对得上。
    原实现对此一无所知，因为它从不读数据。
    """
    mod = _load(tmp_path, monkeypatch)
    real_shape = {
        "Data":   {"servers": [{}], "dcs_endpoints": [{}],
                   "rtu_networks": [], "wireless_terminals": [{}] * 31},
        "Logic":  {"processes": [{}] * 5, "protocols": [{}] * 5},
        "Action": {"data_sources": [{}] * 9, "ports": [{}] * 12},
        "Security": {"servers": [{}]},
    }
    _write_fake_ontology(tmp_path, entities=real_shape,
                         relations=_matching_relations(mod),
                         rule_layers=["Data", "Logic", "Action", "Security"])
    c = _by_check(mod.run_audit())["entity_completeness"]

    assert c["status"] == "WARN", "声明与实测对不上，不该报 PASS"
    miss = {n for names in c["layers_missing"].values() for n in names}
    for gone in ("opc_tags", "s7_tags", "Device", "Channel", "Point", "Product",
                 "scales", "Alarm", "Rule", "events", "Task", "_Role", "_User"):
        assert gone in miss, f"{gone} 在数据里不存在，却没被报出来"


def test_declared_relations_are_compared_against_the_real_matrix(tmp_path, monkeypatch):
    """真关系矩阵是 connectsTo / manages / writesTo / displays，
    与声明的 `Device→Channel` 这一组**一条都对不上**。"""
    mod = _load(tmp_path, monkeypatch)
    # ⚠️ **实例名一律是占位，别换成现场真名。** 本仓是公开提交副本
    #（见 CLAUDE.md「禁止把内部文档、客户数据、凭证写入本仓库」）。
    # 本用例要证的是**关系类型**与声明的对不上 —— 三条断言只看条数
    #（`measured_total == 4`、`relations_missing == 6`），与实例名一点关系没有。
    # 2026-09-16 上库门禁实测：原先把现场软件清单抄进来，被「现场软件栈指纹」逮到
    #（`tests/test_audit_ontology.py:233`），而**被它测的 `scripts/audit_ontology.py`
    # 一个现场实词都没有** —— 也就是说那几行是纯粹的复制品，删掉不丢任何判据。
    real_matrix = [
        {"from": "gw-01", "relation": "connectsTo", "to": "ctrl-a/b", "via": "OPC DA/DCOM"},
        {"from": "proj-01", "relation": "manages", "to": "gw-01 gw-02", "via": "SDK"},
        {"from": "gw-01", "relation": "writesTo", "to": "hist-01", "via": "TNS :1521"},
        {"from": "hmi-01", "relation": "displays", "to": "alarms", "via": "GUI"},
    ]
    _write_fake_ontology(tmp_path, entities=_full_entities(mod, 1),
                         relations=real_matrix,
                         rule_layers=["Data", "Logic", "Action", "Security"])
    c = _by_check(mod.run_audit())["relation_coverage"]

    assert c["status"] == "WARN"
    assert len(c["relations_missing"]) == len(mod.DECLARED_RELATIONS)
    assert c["measured_total"] == len(real_matrix)     # 报的是实测条数，不是声明条数


# ═══════════════════════════════════════════
# 3. 全绿是可能的（原实现永不可能）
# ═══════════════════════════════════════════

def test_top_level_can_actually_reach_pass(tmp_path, monkeypatch):
    """★ 正对照：**PASS 是可达的**。

    原实现把 2 条「已知可接受」的地址冲突写死并让它们参与状态计算 ⇒
    `all_collisions` 恒非空 ⇒ status 恒 WARN ⇒ 退出码恒非 0。
    一个永远红的判据会训练人忽略它 —— 所以「能报绿」本身要立判据。
    """
    mod = _load(tmp_path, monkeypatch)
    _green(mod, tmp_path)
    rep = mod.run_audit()

    assert rep["status"] == "PASS", f"应当可达绿，实际 {rep['status']}: {rep['summary']}"
    assert rep["summary"]["unchecked"] == []
    assert rep["summary"]["critical"] == 0 and rep["summary"]["error"] == 0


def test_address_baseline_is_reported_but_does_not_drive_status(tmp_path, monkeypatch):
    """基线仍如实列出（备查），但**不驱动状态**。

    形制同 `_organize/scan_iotstudio.py`：每清一条命中必须往基线写理由。
    哪条理由不再成立，就从基线里删掉它 —— 它会重新变红。
    """
    mod = _load(tmp_path, monkeypatch)
    _green(mod, tmp_path)
    c = _by_check(mod.run_audit())["address_collisions"]

    assert c["status"] == "PASS"          # 没有**新增**冲突
    assert c["new"] == 0
    assert c["baseline"], "基线不许空 —— 空了就等于把历史判定悄悄丢了"
    assert all(entry["why"] for entry in c["baseline"]), "基线条目必须带理由"


def test_new_address_collision_does_turn_it_red(tmp_path, monkeypatch):
    """★ 负控（对着基线那条的正控）：真出现新冲突时必须红。"""
    mod = _load(tmp_path, monkeypatch)
    _green(mod, tmp_path)
    (tmp_path / "thing_model.json").write_text(json.dumps({"properties": [
        {"identifier": "a", "address": "49999"},
        {"identifier": "b", "address": "49999"},
    ]}), encoding="utf-8")
    c = _by_check(mod.run_audit())["address_collisions"]

    assert c["status"] == "WARN"
    assert [x["addr"] for x in c["collisions"]] == ["49999"]


# ═══════════════════════════════════════════
# 4. 「域为空不许打通过」
# ═══════════════════════════════════════════

def test_empty_measurement_is_not_a_pass(tmp_path, monkeypatch):
    """实测 0 行 —— 找不到缺口是因为**什么都没量到**，不是因为没问题。"""
    mod = _load(tmp_path, monkeypatch)
    _write_fake_ontology(tmp_path, entities=_full_entities(mod, 0),
                         relations=_matching_relations(mod),
                         rule_layers=["Data", "Logic", "Action", "Security"])
    c = _by_check(mod.run_audit())["entity_completeness"]

    assert c["measured_total"] == 0
    assert c["status"] == "WARN"
    assert "域为空" in c["note"]


def test_empty_relation_matrix_is_not_a_pass(tmp_path, monkeypatch):
    mod = _load(tmp_path, monkeypatch)
    _write_fake_ontology(tmp_path, entities=_full_entities(mod, 1),
                         relations=[],
                         rule_layers=["Data", "Logic", "Action", "Security"])
    c = _by_check(mod.run_audit())["relation_coverage"]
    assert c["status"] == "WARN" and c["measured_total"] == 0


def test_no_rules_is_not_a_pass(tmp_path, monkeypatch):
    mod = _load(tmp_path, monkeypatch)
    _write_fake_ontology(tmp_path, entities=_full_entities(mod, 1),
                         relations=_matching_relations(mod), rule_layers=[])
    c = _by_check(mod.run_audit())["rule_coverage"]
    assert c["status"] == "WARN" and c["total"] == 0


# ═══════════════════════════════════════════
# 5. 建议清单是 INFO —— 它不是判据
# ═══════════════════════════════════════════

def test_upgrade_suggestions_is_info_and_never_counted_as_pass(tmp_path, monkeypatch):
    """一条只会吐预置建议的函数**没有可失败的条件**，所以它不是判据。

    原实现给它 `status: 'PASS'`，于是它被计进 `summary['pass']` —— 报告顶上
    那个「通过几项」里混着一个从来没检验过任何东西的项。现在它是 INFO。
    """
    mod = _load(tmp_path, monkeypatch)
    _green(mod, tmp_path)
    rep = mod.run_audit()
    c = _by_check(rep)["upgrade_suggestions"]

    assert c["status"] == "INFO"
    assert "upgrade_suggestions" not in _passed(rep)
    assert rep["summary"]["info"] == 1
    # pass 计数必须等于真 PASS 的条数 —— 不许把 INFO 悄悄并进去
    assert rep["summary"]["pass"] == len(_passed(rep))


# ═══════════════════════════════════════════
# 6. 归因：掐断 loader，正好静默那四项
# ═══════════════════════════════════════════

def test_cutting_the_loader_silences_exactly_the_checks_that_use_it(tmp_path, monkeypatch):
    """★ 负控：数据齐备，但把唯一的本体入口掐断。

    四个依赖 `_load_ontology()` 的 check 必须同时倒下 —— 这证明它们的结论
    **确实经过那一个入口**，而不是各报各的。另两项读的是 `thing_model.json`
    （**另一个来源，不是漏网**），所以它们照旧 —— 归因必须精确，
    把「不受影响」一律说成「漏检」也是一种误读。

    （空目录那条 `test_no_source_at_all_means_nothing_passes` 才是覆盖全部
      判定项的总闸；本条只管归因。）
    """
    mod = _load(tmp_path, monkeypatch)
    _green(mod, tmp_path)                       # 数据全在
    monkeypatch.setattr(mod, "_load_ontology", lambda: (None, "stub: 掐断实测来源"))
    rep = mod.run_audit()
    by = _by_check(rep)

    for name in ("entity_completeness", "relation_coverage",
                 "rule_coverage", "owl_export"):
        assert by[name]["status"] == "SKIP", f"{name} 没走 loader，却报了 {by[name]['status']}"

    assert by["metadata"]["status"] == "PASS"            # 来源是 thing_model.json
    assert by["address_collisions"]["status"] == "PASS"  # 同上
    assert set(rep["summary"]["unchecked"]) == {
        "entity_completeness", "relation_coverage", "rule_coverage", "owl_export"}
    assert rep["status"] != "PASS"


def test_source_is_the_script_we_think_it_is(tmp_path, monkeypatch):
    """正对照（对判据自己）：上面那些断言确实作用在 `scripts/audit_ontology.py` 上。

    没有这条，把被测文件换成一个永远返回空报告的桩，上面全组照样绿。
    """
    mod = _load(tmp_path, monkeypatch)
    assert Path(mod.__file__).resolve() == SRC.resolve()
    assert SRC.exists()


# ═══════════════════════════════════════════
# 7. 结构性负控：死分支的指纹
# ═══════════════════════════════════════════

def _is_static(node):
    """这个表达式是不是**与现场无关**？—— 字面量，或字面量组成的元组/列表/集合。

    ⚠️ 原实现在 `('Data','Logic','Action','Security')` 上翻过一次车：它是
    `ast.Tuple` 而**不是** `ast.Constant`，只认 `Constant` 的判据会放它过去
    （本条的第一版就是这么写的，靠 M3 变异测试才逮到 —— 「判据自己坏了要报红」
    这句在写这条判据的时候又应验了一次）。
    """
    if isinstance(node, ast.Constant):
        return True
    if isinstance(node, (ast.Tuple, ast.List, ast.Set)):
        return all(_is_static(e) for e in node.elts)
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub, ast.Not)):
        return _is_static(node.operand)
    return False


def test_no_statically_decidable_condition():
    """★ 结构性负控：**代码里不许出现两边都是字面量的比较** —— 那恒真或恒假。

    原 `check_upgrade_suggestions` 里有一句

        if 'Security' not in ('Data','Logic','Action','Security'): pass

    条件恒为 False，那段 `pass` 从来没执行过，注释还自称 placeholder。
    真要判「某层在不在四层里」，两边都不该是字面量。

    ⚠️ 本条**不**管 `'status': 'PASS'` 这类常量 —— 那个由行为总闸
    （`test_no_source_at_all_means_nothing_passes`）管：语法上分不清
    「被 `except` 守卫的常量」与「凭空写死的常量」，行为上分得清。
    """
    tree = ast.parse(SRC.read_text(encoding="utf-8"))
    dead = sorted({n.lineno for n in ast.walk(tree)
                   if isinstance(n, ast.Compare)
                   and _is_static(n.left)
                   and n.comparators
                   and all(_is_static(c) for c in n.comparators)})
    assert dead == [], f"第 {dead} 行是两边都为字面量的比较 —— 条件与现场无关"


# ═══════════════════════════════════════════
# 8. 输出契约：stdout 是 JSON，且编码被钉死
# ═══════════════════════════════════════════

def test_missing_ontology_dir_exits_2_with_parseable_json():
    """无 `ONTOLOGY_DIR` ⇒ exit 2，且 stdout 仍是一份**能 parse 的 JSON**。

    docstring 承诺「输出: JSON → stdout (Loop 消费)」。首段把两个流钉成 UTF-8，
    所以即使环境声明的是 GBK，输出字节仍按 UTF-8 写出 —— **编码是契约的一部分**。
    """
    env = {k: v for k, v in os.environ.items() if k != "ONTOLOGY_DIR"}
    env["PYTHONIOENCODING"] = "gbk"      # 模拟非 UTF-8 控制台
    p = subprocess.run([sys.executable, str(SRC)],
                       capture_output=True, env=env, cwd=str(ROOT))

    assert p.returncode == 2, \
        f"exit={p.returncode}\nstderr={p.stderr.decode('utf-8', 'replace')}"
    payload = json.loads(p.stdout.decode("utf-8"))     # ★ 按 UTF-8 解，必须解得开
    assert payload["status"] == "CRITICAL"
    assert "ONTOLOGY_DIR" in payload["error"]
