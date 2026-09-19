#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""插件台账 —— 四套插件机制的归一化视图（命令行正门）

用法:
    python scripts/plugin_ledger.py              # 只读当前已装载状态
    python scripts/plugin_ledger.py --load       # 先装载 A 层插件再报告
    python scripts/plugin_ledger.py --json       # 出 JSON，给别的脚本吃

为什么需要 --load:
    src/plugin_runtime 的模块级单例 `runtime` 在 import 时**不装载**任何插件
    （装载发生在宿主 lifespan 里的 load_all()）。本脚本是独立进程，不 --load
    的话 A 层读出来是空的 —— 那**不是**「A 层没有插件」，是「没启动」。
    两种情形必须分得开，所以默认不替你启动，宁可报表上写「未读」。
    --load 会真的执行 plugins/*/plugin.py，与宿主启动做的事完全相同。
"""
import sys
import json
import argparse
from pathlib import Path

# Windows 控制台默认 GBK，本脚本往 stdout 写中文 + 表格字符。
# 不 reconfigure 的话，成功路径上的最后一句 print 会抛 UnicodeEncodeError ⇒
# 一次成功的操作以退出码 1 收场（信号反着读）。两个流都要。
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

_REPO = Path(__file__).resolve().parent.parent
if str(_REPO) not in sys.path:
    sys.path.insert(0, str(_REPO))

from src import plugin_ledger  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description="iotStudio 插件台账")
    ap.add_argument("--load", action="store_true",
                    help="先装载 A 层插件 (会执行 plugins/*/plugin.py，与宿主启动一致)")
    ap.add_argument("--json", action="store_true", help="输出 JSON")
    args = ap.parse_args()

    if args.load:
        # 装载 B/C 层 (模块级自注册) 与 A 层。
        # ★ discover(directory, prefix) 两个参数**必须分别给对形制**：
        #   directory 是路径形 ("src/protocols")，prefix 是点分形 ("src.protocols")。
        #   给错任一个，它都不会报错 —— 路径对/前缀错会逐个 ModuleNotFoundError
        #   被 except 吞成 failed，两个都错则目录不存在直接返回空报告。
        #   三种情形都长得像「这个目录里没有插件」。照抄 main.py:2252-2254。
        from src.plugin_registry import discover
        for path_form, dot_form in (("src/protocols", "src.protocols"),
                                    ("src/services", "src.services"),
                                    ("src/push", "src.push")):
            discover(path_form, dot_form)
        from src import channel_bootstrap  # noqa: F401  通道模块自注册
        from src.plugin_runtime import runtime
        runtime.load_all()

    report = plugin_ledger.collect()

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(plugin_ledger.render(report))

    # 退出码: 0 = 台账干净，3 = 有缺口 (与上库门禁同约定：3 ≠ 绿灯)
    return 3 if report["gaps"] else 0


if __name__ == "__main__":
    sys.exit(main())
