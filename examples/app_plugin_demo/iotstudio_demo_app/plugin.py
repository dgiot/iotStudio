# ============================================================
# A 层应用插件最小样板: demo_app — 工具 (tool)
# ============================================================
# 与 B 层驱动插件 (examples/driver_plugin_demo) 并列的第二种形制:
#
#   B 层  iotstudio.drivers   entry point 指向 **类**   (BaseProtocolAdapter 子类)
#   A 层  iotstudio.apps      entry point 指向 **模块** (本文件), 模块自带清单
#
# A 层为什么不指向类: 应用插件不是「一个适配器」, 是「一组注册」——
# 它要登记若干 tool/action/profile/端点, 这些是模块级动作, 由 apply(ctx) 收口。
# 拿类来表达反而要凭空造一个只有静态方法的壳。
#
# 本文件是**可运行的样板**, 不是示意: tests/test_app_plugin_package.py 会对它跑判据。

from importlib.metadata import version as _dist_version, PackageNotFoundError


def _resolve_version() -> str:
    """包版本 —— 唯一来源是 pyproject.toml 的 [project].version。

    不在这里手写第二份: 手写的那份不会跟着包升级走, 而两种值长得一模一样。

    ⚠️ 回落值是 **0.0.0+src 而不是 "1.0"**: 缺省的病根是「不可辨」不是「有默认值」——
    一个看着像真值的 "1.0" 会让「没装」与「装的是 1.0」给出同一个观测。

    ⚠️ 判据要打桩**这个函数**, 别靠「环境里恰好没装」: `pip install
    --no-build-isolation <本地目录>` 会在**源码树里**留下 `.egg-info/`,
    而 importlib.metadata 扫的是 sys.path 上的 dist-info/egg-info、不是
    「这个模块从哪 import 来的」—— 于是「没装」也可能读出真版本。
    """
    try:
        return _dist_version("iotstudio-demo-app")
    except PackageNotFoundError:
        return "0.0.0+src"


__version__ = _resolve_version()


PLUGIN_MANIFEST = {
    # ⚠️ 这个 name 与**模块目录名** (iotstudio_demo_app) 故意不同 ——
    #    「插件叫什么」是产品级标识 (它进 /api/plugins、进菜单、进安装命令),
    #    不该被 Python 的包目录名绑住。Python 自己也分开 dist name / module name。
    #    若将来底座要求「清单名 == 目录名」, 那是底座那条判据要放宽, 不是这里改名。
    "name": "demo_app",
    "version": __version__,
    "capabilities": ["tool"],
    "description": "A 层应用插件最小样板 —— 一个工具 + 一个端点",
}


def apply(ctx):
    """登记本插件的能力 —— 宿主装载时调用, 返回 disposer 列表。

    ctx 是宿主给的唯一接口, 插件**不 import 底座的任何模块** ——
    这样底座换 web 框架 / 换存储都不会碎掉插件 (与 iframe 那条解耦同源)。
    """

    def echo(text: str = "") -> dict:
        """最小工具: 回显。真实插件在这里接自己的业务。"""
        return {"echo": text, "from": PLUGIN_MANIFEST["name"],
                "version": __version__}

    ctx.register_tool("demo_echo", echo,
                      description="回显入参 (样板插件)")

    def _health(req):
        return {"ok": True, "plugin": PLUGIN_MANIFEST["name"],
                "version": __version__}

    # 端点挂在 /api/plugin/demo_app/... (底座统一分发, 插件不自起 HTTP 服务)
    ctx.route("GET", "/health", _health, description="插件自检")

    return []
