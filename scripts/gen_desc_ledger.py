#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gen_desc_ledger.py — 从本仓导出图派生《描述项台账》(GB/T 48000.3 附录A)

**它解决什么**

表A.1 给实体类型列了 8 个描述项，其中三项 **OWL 装不下**：

    #2 名称(Name)  —— 硬造会踩元建模；且 owl:AnnotationProperty 不在表A.2 的
                      TypeofTerms 枚举里（该枚举只有 ObjectProperty / DatatypeProperty）
    #5 属性集      —— 可由 rdfs:domain 反查派生，另写一份必然漂移
    #7 子类        —— 可由 rdfs:subClassOf 反查派生，同理

⇒ 这三项落本台账，由 tests/test_ontology_metadata.py **交叉核验**：
   台账里的值与图里派生的真值，必须逐字相同。

**台账不是事实源 —— 图才是。** 本文件只派生，不判断；判断在测试里。

**安全边界**：导出图里含现场个体（站点/网关/设备的 id 与部分字段值）。
本文件只遍历 **类** 与 **属性** 两类主语；产物只含这两类主语上的槽位，**不含个体主语本身**。
**取值侧不在此保证** —— 逐格对一下谁守哪一格（射程别读大了）：
  · `域(表2-5)/值域(表2-6)/父类(表1-6)/等价类(表1-8)` **四格装对象**（对象可以是任何节点，包括个体）→ 由
    `tests/test_ontology_metadata.py::test_非xsd的域_值域_父类_等价类必须指向本图的类` 守；
  · `子类(表1-7)` **一格装主语**（取 `g.subjects(RDFS.subClassOf, c)`，与 `父类` 的取法相反）→ 由
    `tests/test_ontology_metadata.py::test_带rdfs_subClassOf的主语必须是本图的类` 守；
  · `Label` / `Definition` **两格装字面量** → **本器不保证这两格的取值**（没有执行者）。
图在内存里构造（读 export_owl() 的返回串），**不落任何 .owl 文件**。

用法：
    python scripts/gen_desc_ledger.py            # 写 vocab/desc_ledger.tsv
    python scripts/gen_desc_ledger.py --check    # 只比对不写（一致 0 / 漂移 1 / 缺文件 2）
    python scripts/gen_desc_ledger.py --counts   # 只打印计数，不打印任何名字
"""
import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from rdflib import Graph, RDF, RDFS, OWL          # noqa: E402

from src.ontology import build_edge_ontology      # noqa: E402

LEDGER = ROOT / "vocab" / "desc_ledger.tsv"

# 表A.3 基本数据类型 → 本图谱允许的 xsd 载体（映射表为内部核读件，不在本仓）
TYPE_MAP = {
    "xsd:boolean": "布尔型",
    "xsd:string": "文本型",
    "xsd:decimal": "数值型", "xsd:integer": "数值型", "xsd:int": "数值型",
    "xsd:float": "数值型", "xsd:double": "数值型",
    "xsd:anyURI": "统一资源链接",
}
ALLOWED_RANGES = set(TYPE_MAP)

COLUMNS = ["种类", "Name", "IRI", "Label", "Definition",
           "属性集(表1-5)", "父类(表1-6)", "子类(表1-7)", "等价类(表1-8)",
           "域(表2-5)", "值域(表2-6)", "属性类型(表2-7)", "标准数据类型(5.5)",
           "Name/属性集/子类 是否 OWL 原生"]

NONE = "（无）"

# 末列：说清「哪几项不在 OWL 里」。不写的话，读的人会以为图里全有 ——
# 这正是 check_desc_items.py 退 3 时那段「覆盖面前提」要防的事。
NOTE_CLASS = "否 — 名称/属性集/子类 三项落本台账（OWL 无原生槽位）；父类与等价类为 OWL 原生，派生后交叉核验"
NOTE_PROP = "否 — 名称落本台账；域/值域/属性类型为 OWL 原生"


def local(uri) -> str:
    """IRI → 局部名。台账里所有 Name 都走这里，不手工截。"""
    s = str(uri)
    return s.rsplit("#", 1)[-1].rsplit("/", 1)[-1]


def _joined(g, s, p, none=NONE) -> str:
    vals = sorted(str(o) for o in g.objects(s, p))
    return " | ".join(vals) if vals else none


def graph_of(engine=None) -> Graph:
    """当前源码的导出图。

    ⚠️ 走**公开出口** export_owl()（返回 XML 串，不落盘），不用私有 _rdf_graph()：
    台账要描述的是**序列化产物**。序列化器若丢了东西，这份台账必须跟着产物走 ——
    否则台账描述的是一份谁也不看的中间态。
    """
    eng = engine or build_edge_ontology()
    return Graph().parse(data=eng.export_owl(), format="xml")


def derive(g: Graph):
    """图 → 台账行。列名见 COLUMNS。

    只遍历 **类** 与 **属性** 两类主语。**不遍历个体** —— 个体里是现场数据。
    """
    classes = sorted({s for s in g.subjects(RDF.type, OWL.Class)
                      if local(s) != "Thing"}, key=str)
    declared = sorted(set(g.subjects(RDF.type, OWL.ObjectProperty)) |
                      set(g.subjects(RDF.type, OWL.DatatypeProperty)), key=str)

    rows = []
    for c in classes:
        pset = sorted(local(p) for p in declared
                      if c in set(g.objects(p, RDFS.domain)))
        rows.append({
            "种类": "类",
            "Name": local(c),
            "IRI": str(c),
            "Label": _joined(g, c, RDFS.label),
            "Definition": _joined(g, c, RDFS.comment),
            "属性集(表1-5)": ", ".join(pset) if pset else NONE,
            "父类(表1-6)": ", ".join(sorted(local(x) for x in g.objects(c, RDFS.subClassOf))) or NONE,
            "子类(表1-7)": ", ".join(sorted(local(x) for x in g.subjects(RDFS.subClassOf, c))) or NONE,
            "等价类(表1-8)": ", ".join(sorted(local(x) for x in g.objects(c, OWL.equivalentClass))) or NONE,
            "域(表2-5)": "", "值域(表2-6)": "", "属性类型(表2-7)": "",
            "标准数据类型(5.5)": "",
            "Name/属性集/子类 是否 OWL 原生": NOTE_CLASS,
        })

    for p in declared:
        is_obj = (p, RDF.type, OWL.ObjectProperty) in g
        rngs = sorted(str(r) for r in g.objects(p, RDFS.range))
        kinds = []
        for r in rngs:
            if "XMLSchema#" in r:
                pref = "xsd:" + local(r)
                kinds.append(TYPE_MAP.get(pref, "⚠️超出5类:" + pref))
            else:
                kinds.append("（不适用 — 值域是类）")
        rows.append({
            "种类": "属性",
            "Name": local(p),
            "IRI": str(p),
            "Label": _joined(g, p, RDFS.label),
            "Definition": _joined(g, p, RDFS.comment),
            "属性集(表1-5)": "", "父类(表1-6)": "", "子类(表1-7)": "", "等价类(表1-8)": "",
            "域(表2-5)": ", ".join(sorted(local(x) for x in g.objects(p, RDFS.domain))) or NONE,
            "值域(表2-6)": ", ".join(local(r) for r in rngs) or NONE,
            "属性类型(表2-7)": "owl:ObjectProperty" if is_obj else "owl:DatatypeProperty",
            "标准数据类型(5.5)": ", ".join(dict.fromkeys(kinds)) if kinds else NONE,
            "Name/属性集/子类 是否 OWL 原生": NOTE_PROP,
        })
    return rows


def write(rows, path=LEDGER) -> Path:
    path = Path(path)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, delimiter="\t", lineterminator="\n")
        w.writeheader()
        for r in rows:
            w.writerow(r)
    return path


def read(path=LEDGER):
    with open(path, encoding="utf-8") as f:
        return list(csv.DictReader(f, delimiter="\t"))


def diff(rows, onfile) -> list:
    """逐格比对。返回差异串列表（空 = 一致）。这是防「台账漂移」的那条判据。"""
    out = []
    if len(rows) != len(onfile):
        out.append("行数不同: 图派生 %d 行 / 台账 %d 行" % (len(rows), len(onfile)))
    for i, (a, b) in enumerate(zip(rows, onfile), start=2):   # 表头占第 1 行
        for col in COLUMNS:
            if (a.get(col) or "") != (b.get(col) or ""):
                out.append("第%d行 %s.%s: 图=%r 台账=%r"
                           % (i, a.get("种类"), a.get("Name"), a.get(col), b.get(col)))
    return out


def counts(rows):
    n_cls = sum(1 for r in rows if r["种类"] == "类")
    return n_cls, len(rows) - n_cls


def main():
    ap = argparse.ArgumentParser(description="从导出图派生描述项台账")
    ap.add_argument("--check", action="store_true", help="只比对不写：一致 0 / 漂移 1 / 缺文件 2")
    ap.add_argument("--counts", action="store_true", help="只打印计数，不打印任何名字")
    args = ap.parse_args()

    rows = derive(graph_of())
    n_cls, n_prp = counts(rows)

    if args.counts:
        print("类=%d · 属性=%d · 合计=%d" % (n_cls, n_prp, len(rows)))
        return 0

    if args.check:
        if not LEDGER.exists():
            print("找不到台账: %s（先跑 python scripts/gen_desc_ledger.py）" % LEDGER)
            return 2
        d = diff(rows, read())
        if d:
            for line in d:
                print("❌ " + line)
            print("共 %d 处漂移 —— 台账与图说的不是同一件事。" % len(d))
            return 1
        print("✅ 台账与图一致（类=%d · 属性=%d）" % (n_cls, n_prp))
        return 0

    write(rows)
    print("已写 %s（类=%d · 属性=%d）" % (LEDGER, n_cls, n_prp))
    return 0


if __name__ == "__main__":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.exit(main())
