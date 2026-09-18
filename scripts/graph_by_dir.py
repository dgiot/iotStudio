# ============================================================
# graphify 产物: 按顶层目录重聚类出一版 HTML
# ============================================================
"""`graphify export html` 出的图是**社区视图**, 但社区太细 —— 本仓实测 5087 个节点
被切成 262 个社区, 图上就是 262 个圈一字排开, 等于没分组。

本脚本换一个分组维度: **顶层目录** (src / frontend-vue / tests / scripts / ...).
约 13 类, 一屏能看完, 跨目录的耦合一眼可见。

## 为什么不改 graphify

不用改。`graphify.exporters.html.to_html(G, communities, ...)` 的 communities
是**入参**, 调用方给什么它就用什么建 meta 图 (html.py:427-443)。graphify 自己
在节点数 > 5000 时走的也是这条路径, 只是它喂的是 Louvain 社区。
我们喂目录分组即可 —— graphify 升级不会覆盖本脚本。

## 用法

    # 必须用装 graphify 的那个解释器 (见 graphify-out/.graphify_python)
    "$(cat graphify-out/.graphify_python)" scripts/graph_by_dir.py

产物写到 `graphify-out/graph-by-dir.html`, **不覆盖** `graph.html`。

## 自检

节点必须**一个不漏**地被分进某个目录 —— 漏掉的节点不会出现在 meta 图里,
是静默丢失 (html.py:433 对 `cu is None` 的边直接跳过)。所以下面断言
`覆盖数 == G.number_of_nodes()`, 不等就报错退出, 不出一份缺角的图。
"""
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

import json
from collections import OrderedDict
from pathlib import Path

BS = chr(92)          # 反斜杠: 写成 chr(92) 免得被各层 shell/heredoc 吃掉一层

# 与 graphify cli.py:2815 的默认一致。显式传进去才会走聚合路径
# (html.py:422 `if node_limit is not None`), 不传就退化成「节点太多, 报错」。
NODE_LIMIT = 5000


def bucket(data: dict) -> str:
    """归属哪个目录。三类: 真目录 / 根目录下的散件 / 没有源文件。"""
    sf = (data.get("source_file") or "").replace(BS, "/").strip()
    if not sf:
        # 语义抽取出来的概念节点 (concept / rationale) 常常没有源文件
        return "(无源文件)"
    if "/" not in sf:
        # run.py / README.md 这种直接躺在根目录的
        return "(根目录散件)"
    return sf.split("/")[0]


def main() -> int:
    repo = Path(__file__).resolve().parents[1]
    out_dir = repo / "graphify-out"
    graph_path = out_dir / "graph.json"
    if not graph_path.exists():
        print(f"找不到 {graph_path} —— 先跑一次 graphify", file=sys.stderr)
        return 1

    from networkx.readwrite import json_graph

    raw = json.loads(graph_path.read_text(encoding="utf-8"))
    if "links" not in raw and "edges" in raw:
        raw = dict(raw, links=raw["edges"])
    try:
        G = json_graph.node_link_graph(raw, edges="links")
    except TypeError:                       # networkx < 3.4 没有 edges 参数
        G = json_graph.node_link_graph(raw)
    if isinstance(raw.get("hyperedges"), list):
        G.graph["hyperedges"] = raw["hyperedges"]

    # 按 G 自己的节点对象分组 —— 不从 raw 读, 免得节点 id 类型对不上
    groups: "OrderedDict[str, list]" = OrderedDict()
    for nid, data in G.nodes(data=True):
        groups.setdefault(bucket(data), []).append(nid)

    # 自检: 一个不漏。漏掉的节点是静默丢失, 不是报错
    covered = sum(len(v) for v in groups.values())
    if covered != G.number_of_nodes():
        print(f"分组漏了 {G.number_of_nodes() - covered} 个节点, 中止", file=sys.stderr)
        return 1

    ordered = sorted(groups.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    communities = {i: members for i, (_name, members) in enumerate(ordered)}
    labels = {i: name for i, (name, _members) in enumerate(ordered)}

    print(f"{G.number_of_nodes()} 节点 / {G.number_of_edges()} 边 → {len(ordered)} 个目录分组")
    for i, (name, members) in enumerate(ordered):
        print(f"  [{i:2}] {name:22} {len(members):5}")

    from graphify.exporters.html import to_html

    target = out_dir / "graph-by-dir.html"
    written = to_html(G, communities, str(target),
                      community_labels=labels, node_limit=NODE_LIMIT)
    if not written:
        print("to_html 返回 False —— 没写成", file=sys.stderr)
        return 1
    if not target.exists() or target.stat().st_size == 0:
        print(f"产物 {target} 不存在或为空", file=sys.stderr)
        return 1
    print(f"\nwrote {target}  ({target.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
