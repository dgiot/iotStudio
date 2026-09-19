# iotStudio 协议适配器 — 由 plugin_runtime 自动发现（@protocol 装饰器注册）
#
# 这里**故意不写** `try: from . import <模块>`。
#
# 原先有两行这样的 import，指向两个在本仓根本不存在的模块 —— 它们永远走
# except，看着像「可选协议」，实际是空转；同时把两个具体的模块名钉死在底座
# 代码里。底座不该知道装的是谁：那是名单，不是机制。
#
# 形制对齐 dgiot 的 data/loaded_plugins.tmpl —— 清单是数据，不进代码：
#   · 本仓协议：main.py 启动时 _discover("src/protocols", "src.protocols") 自动扫描
#   · 第三方协议：部署方经 IOTSTUDIO_PLUGIN_PATH 提供（见 src/plugin_runtime.py）
