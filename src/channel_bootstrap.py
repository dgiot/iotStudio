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
                    from .eventbus import EventBus
                    bus = EventBus()
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
            from .push.dgiot_pusher import DGIoTBridge
            bridge = DGIoTBridge({
                "host": _cfg.mqtt.host, "port": _cfg.mqtt.port,
                "username": _cfg.mqtt.username, "password": _cfg.mqtt.password,
                "product_id": "dgiot_lite",
            })
            _channels_state['dgiot_bridge'] = bridge

        make_channel("ch_dgiot_push", CType.AGENT, "边缘中枢 dlink 上报",
                     config={"host": _cfg.mqtt.host, "port": _cfg.mqtt.port},
                     on_start=start_push, on_stop=lambda: _channels_state.pop('dgiot_bridge', None),
                     protocol="mqtt-dlink", target="Kylin-DMZ")

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
                     config={"host": "131-io-server", "port": 5985,
                             "auth": "negotiate", "username": "administrator"},
                     protocol="winrm-http", endpoint="131-io-server:5985")

    # ── Oracle 管道 (POLL) ──
    if "ch_oracle_pipe" not in registered:
        async def start_oracle():
            try:
                from .services.oracle_pipeline import OraclePipeline
                pipe = OraclePipeline()
                _channels_state['oracle_pipeline'] = pipe
                await pipe.start()
            except ImportError:
                log.info("[ch_oracle_pipe] 模块不可用, skip")

        async def stop_oracle():
            pipe = _channels_state.pop('oracle_pipeline', None)
            if pipe:
                await pipe.stop()

        make_channel("ch_oracle_pipe", CType.POLL, "Oracle 数据管道",
                     config={"source": "Oracle", "sink": "TDengine+MQTT"},
                     on_start=start_oracle, on_stop=stop_oracle,
                     protocol="oracle-jdbc")

    # ── FastAPI HTTP (LISTEN) — 由 uvicorn 管理 ──
    if "ch_api_server" not in registered:
        make_channel("ch_api_server", CType.LISTEN, "FastAPI HTTP 服务",
                     config={"host": _cfg.host, "port": _cfg.port},
                     protocol="http-rest", endpoint=f"{_cfg.host}:{_cfg.port}")
