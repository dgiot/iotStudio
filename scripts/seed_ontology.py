#!/usr/bin/env python3
"""
本体种子数据 — 基于 2026-07-11 131 IO服务器 WinRM 深度扫描
将 25 实体·20 关系·6 约束 写入 parse_lite 本体表

用法: python scripts/seed_ontology.py [--clear]
      --clear  清空已有本体数据后重新导入
"""
import sys, os, io
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

# Fix GBK encoding on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from ontology import build_131_ontology


def seed(clear: bool = False):
    engine = build_131_ontology()

    # 校验
    v = engine.validate()
    if not v["valid"]:
        print(f"⚠️  Ontology validation issues: {v['issues']}")
    else:
        print(f"✅ Ontology validation PASSED")

    print(f"\n📊 Ontology stats:")
    h = engine.health()
    for k, v in h["counts"].items():
        print(f"   {k}: {v}")

    # 同步到 SQLite
    if clear:
        from parse_lite import get_db
        db = get_db()
        for t in ["ontology_site", "ontology_gateway", "ontology_channel",
                   "ontology_device", "ontology_point", "ontology_constraint",
                   "ontology_datasource"]:
            db.execute(f"DELETE FROM {t}")
        db.commit()
        db.close()
        print("\n🗑️  Cleared existing ontology data")

    result = engine.sync_to_parse("default")
    print(f"\n💾 Synced to parse_lite: {result}")

    # 打印树形结构
    tree = engine.tree("industry_c1")
    print(f"\n🌳 Site tree: {len(tree)} site(s)")
    for site in tree:
        for gw in site.get("gateways", []):
            print(f"   └─ Gateway: {gw['hostname']} ({gw['ip']}) [{gw['status']}]")
            for ch in gw.get("channels", []):
                print(f"      ├─ Channel: {ch['name']} [{ch['protocol']}] ({ch['status']})")
                for dev in ch.get("devices", []):
                    print(f"      │  └─ Device: {dev['name']} ({dev['type']})")
                    for pt in dev.get("points", []):
                        print(f"      │     └─ Point: {pt['name']} ({pt['unit']}) {pt.get('alarm','')}")

    # 打印约束
    print(f"\n📏 Constraints ({len(engine.constraints)}):")
    for c in engine.constraints.values():
        print(f"   [{c.severity.upper():7s}] {c.name}")
        print(f"              rule: {c.rule[:80]}...")

    # 打印 MQTT 路径示例
    print(f"\n📡 MQTT paths:")
    for pt in list(engine.points.values())[:3]:
        path = engine.get_path(pt.id)
        print(f"   {path}/data")

    print(f"\n✅ Ontology seed complete!")
    return engine


if __name__ == "__main__":
    clear = "--clear" in sys.argv
    seed(clear)
