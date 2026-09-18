# 外部驱动插件配方（新增协议 = 装插件）

引擎只认契约不认实现。契约见 `src/protocols/base.py`：
`connect / disconnect / read_points / write_point / health_check`。
注册时类立即校验，字符串类名在使用时严格校验 —— 违规一律响亮报错，
绝不静默降级。

## ⚠️ 两条安装路径：entry_points 尚未接线

`plugin_registry` 提供**两条**装载路径，但**只有第一条接进了启动**：

| 路径 | 函数 | 启动时是否调用 |
|---|---|---|
| 目录扫描（点分前缀形） | `plugin_registry.discover(directory, prefix)` | ✅ `src/main.py:2252-2254` |
| setuptools entry_points | `plugin_registry.discover_entry_points(group)` | ❌ **无生产调用方** |

本文件此前写「`python run.py` 时 `discover_entry_points` 自动发现」——
**那是假的**：该函数全树只被 `tests/test_driver_plugins.py:130` 调用。
`pip install` 一个 entry_points 形式的驱动包**不会**被引擎装载。

```
★ 实测复现（2026-09-17）：
  grep -rn "discover_entry_points" --include=*.py .
  → src/plugin_registry.py:138  定义
  → tests/test_driver_plugins.py:130  唯一调用方
  → 生产代码 0 处
```

**要不要把它接进启动，是架构决定，未决** —— 接法至少有两种（在
`main.py` 的 `_discover` 之后追加一次；或让 `discover()` 内部合并两路），
取舍在于「装错包导致启动失败」的风险由谁承担。**在裁决之前，本目录的
样例请按下面第一条路径用。**

## 可用的路径：目录扫描

把驱动包放进 `src/protocols` / `src/services` / `src/push` 之下，
或在 `main.py:2252` 那三行旁追加自己的目录，**两个参数形制必须分别给对**：

```python
_discover("src/protocols", "src.protocols")   # ① 路径形  ② 点分形
```

给错任一形制**都不报错**：路径对而前缀错 → 逐模块 `ModuleNotFoundError`
被 `except` 吞进 `failed` 报告；两个都错 → 目录不存在，直接返回空报告。
三种情形都长得像「这个目录里没有插件」。

## 本目录的样例

包名 `iotstudio_demo_driver`，entry point 名 `demo_sim`
（`pyproject.toml:9`）—— 即无硬件正弦信号驱动的最小可用样例。
注意它是 entry_points 形式的，因此**当下只被测试覆盖，不会被引擎装载**。
