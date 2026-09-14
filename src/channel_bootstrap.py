"""
通道启动 — 从插件注册表加载所有通道
=====================================
一个通道 = 一个插件: 每个模块导入时自动调用 register_channel_plugin()

启动流程:
  1. 导入所有通道插件模块 (触发 __register_plugin__)
  2. bootstrap() → ChannelManager.start_all() → 只启动 enabled 的
  3. shutdown()  → ChannelManager.stop_all()

控制:
  POST /api/channels/{id}/start   → 手动启动
  POST /api/channels/{id}/stop    → 手动停止
  POST /api/plugins/{name}/disable → 禁用 + 停止通道
  POST /api/plugins/{name}/enable  → 启用 + 启动通道
"""
import logging
from .channel_registry import ChannelManager

log = logging.getLogger("channel.bootstrap")

# 通道状态引用
_channels_state = {}


def _discover_plugins():
    """导入所有通道插件模块 (触发自注册)"""
    modules = [
        # 服务类通道
        "src.services.mqtt_broker",            # ch_mqtt_broker
        # 协议类通道
        "src.protocols.modbus_rtu_server",      # ch_dtu_server
        # 更多协议/服务模块在此添加
    ]
    for mod_name in modules:
        try:
            __import__(mod_name)
        except ImportError as e:
            log.debug(f"[bootstrap] 模块不可用: {mod_name} ({e})")


async def bootstrap_channels(app_config=None):
    """启动所有已注册且 enabled 的通道"""
    # 1. 发现插件
    _discover_plugins()

    # 2. 手动注册未自注册的通道 (向后兼容)
    _register_fallback_channels(app_config)

    # 3. 启动全部 enabled 通道
    results = await ChannelManager.start_all()
    health = ChannelManager.health()
    log.info(f"[bootstrap] 通道启动完成: {health['running']}/{health['total']} running")
    return results


async def shutdown_channels():
    """停止所有通道"""
    results = await ChannelManager.stop_all()
    log.info("[bootstrap] 通道已全部停止")
    return results


def get_channel_health():
    return ChannelManager.health()


# ═══════════════════════════════════════════
# 回退通道 (尚未自注册的模块)
# ═══════════════════════════════════════════

def _push_outlets() -> dict:
    """当前装配的推送出口 (target_id → 推送器类名)

    单独抽出来是为了让测试能替换掉对 main 的依赖 —— 顺带也把"main 里到底
    装了什么"收成一个口子，通道侧只问这一处。延迟导入是因为 main 是在
    模块级 import channel_bootstrap 的（lifespan 里），这里反向引用要等
    调用时才安全。
    """
    try:
        from .main import push_engine
        return push_engine.outlets()
    except Exception as e:  # noqa: BLE001 - 取不到清单不该让通道启动整个失败
        log.warning(f"[bootstrap] 取推送出口清单失败: {e}")
        return {}


def _register_fallback_channels(app_config=None):
    """尚未迁移到自注册的通道, 在此手动创建"""
    from .config import cfg
    from .channel_registry import make_channel, CType
    _cfg = app_config or cfg

    registered = set(ChannelManager._instances.keys())

    # ── MQTT ↔ EventBus 桥接 (BRIDGE) ──
    if "ch_mqtt_bridge" not in registered:
        async def start_bridge():
            import paho.mqtt.client as mqtt
            mqtt_host = getattr(_cfg.mqtt, 'host', '127.0.0.1')
            mqtt_port = getattr(_cfg.mqtt, 'port', 1883)
            client = mqtt.Client(client_id="dgiot_bridge")

            def on_msg(client, userdata, msg):
                try:
                    # 必须用 `bus` 单例 —— 原先是 `EventBus()` 新建实例，
                    # 那个实例的 _hooks 永远是空的，emit 进去等于丢进垃圾桶。
                    # 而且变量名还叫 bus，看着跟单例一模一样，谁读都发现不了。
                    from .eventbus import bus
                    topic = msg.topic
                    parts = topic.split('/')
                    evt = "mqtt." + parts[-1] if len(parts) > 1 else "mqtt.message"
                    bus.emit(evt, topic=topic, payload=msg.payload.decode(errors='replace')[:4096])
                except Exception:
                    pass

            client.on_message = on_msg
            client.connect_async(mqtt_host, mqtt_port)
            client.subscribe("dgiot/#")
            client.loop_start()
            _channels_state['mqtt_bridge_client'] = client

        async def stop_bridge():
            client = _channels_state.pop('mqtt_bridge_client', None)
            if client:
                client.loop_stop()
                client.disconnect()

        make_channel("ch_mqtt_bridge", CType.BRIDGE, "MQTT ↔ EventBus 桥接",
                     config={"host": _cfg.mqtt.host, "port": _cfg.mqtt.port},
                     on_start=start_bridge, on_stop=stop_bridge,
                     protocol="mqtt", endpoint=f"{_cfg.mqtt.host}:{_cfg.mqtt.port}")

    # ── DG-IoT 边缘中枢上报 (AGENT) ──
    if "ch_dgiot_push" not in registered:
        async def start_push():
            # 这里以前 new 一个 DGIoTBridge 塞进 _channels_state 就完事：
            # 不连接、不推送，通道列表照样显示 "running"。
            # 真正的 dlink 上行出口是 EdgeHubPusher，由 PushEngine 按 PG 里的
            # `edge_hub` 推送目标装配 —— 那就如实反映那件事：装配了才 running，
            # 没装配就报错。通道列表是用来判断"链路通没通"的，不是装饰。
            hubs = [t for t, cls in _push_outlets().items()
                    if cls == "EdgeHubPusher"]
            if not hubs:
                raise RuntimeError(
                    "未装配 dlink 上行出口 —— 请添加一条 edge_hub 推送目标 "
                    "(主题 $dg/thing/{productId}/{devaddr}/properties/report)")
            _channels_state['edge_hub_targets'] = hubs

        async def stop_push():
            # 不能写成 `lambda: _channels_state.pop(...)` —— lambda 会把弹出的
            # 对象当返回值，channel_registry 那边 `await ch._on_stop()` 拿到一个
            # 对象就抛 "object can't be awaited"，每次关闭都记一条 ERROR。
            # 收尾函数必须是 async 且返回 None。
            _channels_state.pop('edge_hub_targets', None)

        make_channel("ch_dgiot_push", CType.AGENT, "边缘中枢 dlink 上报",
                     config={"host": _cfg.mqtt.host, "port": _cfg.mqtt.port},
                     on_start=start_push, on_stop=stop_push,
                     protocol="mqtt-dlink", target="edge-dmz")

    # ── Modbus TCP (CONNECT) ──
    if "ch_modbus_tcp" not in registered:
        make_channel("ch_modbus_tcp", CType.CONNECT, "Modbus TCP 采集",
                     config={"default_port": 502, "timeout": 3, "unit_id": 1},
                     protocol="modbus-tcp")

    # ── Modbus RTU 串口 (SERIAL) ──
    if "ch_modbus_rtu" not in registered:
        make_channel("ch_modbus_rtu", CType.SERIAL, "Modbus RTU 串口采集",
                     config={"port": "COM3", "baudrate": 9600, "parity": "N",
                             "stopbits": 1, "bytesize": 8, "timeout": 3},
                     protocol="modbus-rtu")

    # ── WinRM 远程 IO 管理 (CONNECT) ──
    if "ch_winrm" not in registered:
        make_channel("ch_winrm", CType.CONNECT, "WinRM 远程 IO 管理",
                     config={"host": "edge-io-server", "port": 5985,
                             "auth": "negotiate", "username": "administrator"},
                     protocol="winrm-http", endpoint="edge-io-server:5985")

    # ── Oracle 管道 (POLL) ──
    if "ch_oracle" not in registered:
        make_channel("ch_oracle", CType.POLL, "Oracle 数据出口",
                     config={"source": "Oracle", "sink": "TDengine+MQTT"},
                     protocol="jdbc")

    # ── FastAPI HTTP (LISTEN) — 由 uvicorn 管理 ──
    if "ch_api_server" not in registered:
        make_channel("ch_api_server", CType.LISTEN, "FastAPI HTTP 服务",
                     config={"host": _cfg.host, "port": _cfg.port},
                     protocol="http-rest", endpoint=f"{_cfg.host}:{_cfg.port}")
