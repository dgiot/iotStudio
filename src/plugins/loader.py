# ============================================================
# PluginLoader — 自动发现并注册全部协议适配器
# 对标 dgiot dgiot_bridge 的插件加载行为
# 启动时调用 register_all() 即可
# ============================================================
import logging
from .registry import registry

log = logging.getLogger("plugin.loader")

def register_all():
    """注册全部已实现的协议插件

    每个协议提供 create_xxx(ProtocolConfig) -> BaseProtocolAdapter 工厂函数
    """

    # ─── Modbus 系列 ───
    try:
        from protocols.modbus_tcp import ModbusTcpAdapter
        registry.register("modbus_tcp", "Modbus TCP", factory=lambda c: ModbusTcpAdapter(c),
                          default_port=502, category="protocol",
                          description="Modbus TCP · 10家网关厂家 · 动态感知")
    except ImportError: pass

    try:
        from protocols.modbus_rtu import ModbusRtuAdapter
        registry.register("modbus_rtu", "Modbus RTU", factory=lambda c: ModbusRtuAdapter(c),
                          default_port=0, category="protocol",
                          description="Modbus RTU 串口 · RS485/RS232")
    except ImportError: pass

    try:
        from protocols.modbus_native import ModbusNativeAdapter
        registry.register("modbus_native", "Modbus 原生", factory=lambda c: ModbusNativeAdapter(c),
                          default_port=502, category="protocol",
                          description="Modbus 原生并行采集")
    except ImportError: pass

    # ─── OPC 系列 ───
    try:
        from protocols.opcda_client import OpcDaClient
        registry.register("opcda", "OPC DA", factory=lambda c: OpcDaClient(c.config),
                          default_port=135, category="protocol",
                          description="OPC DA DCOM · RSLinx/Matrikon · 26081点")
    except ImportError: pass

    try:
        from protocols.opcua import OpcUaAdapter
        registry.register("opcua", "OPC UA", factory=lambda c: OpcUaAdapter(c),
                          default_port=4840, category="protocol",
                          description="OPC UA · WinCC/KEPServer · 安全通道")
    except ImportError: pass

    # ─── 电力规约 ───
    try:
        from protocols.iec104 import Iec104Adapter
        registry.register("iec104", "IEC104", factory=lambda c: Iec104Adapter(c),
                          default_port=2404, category="protocol",
                          description="IEC 60870-5-104 · 电力远动规约")
    except ImportError: pass

    # ─── A11 专有 ───
    try:
        from protocols.a11 import A11Protocol
        registry.register("a11", "A11专有", factory=lambda c: A11Protocol(c.extra),
                          default_port=8889, category="protocol",
                          description="中石油A11 · pSpace :8889 · 16663 tags")
    except ImportError: pass

    # ─── 消息/传输 ───
    try:
        from protocols.bogan_mqtt import BoganMqttAdapter
        registry.register("mqtt", "MQTT", factory=lambda c: BoganMqttAdapter(c),
                          default_port=1883, category="protocol",
                          description="MQTT · dgiot Broker · 千万级接入")
    except ImportError: pass

    try:
        from protocols.http_rest import HttpRestAdapter
        registry.register("http_rest", "HTTP REST", factory=lambda c: HttpRestAdapter(c),
                          default_port=80, category="protocol",
                          description="HTTP REST API · GET/POST 轮询")
    except ImportError: pass

    # ─── 视频/媒体 ───
    try:
        from protocols.video_rtsp import RtspAdapter
        registry.register("rtsp", "RTSP视频", factory=lambda c: RtspAdapter(c.config),
                          default_port=554, category="protocol",
                          description="RTSP · H.264/H.265 · 摄像头视频流")
    except ImportError: pass

    # ─── 边缘通道 ───
    try:
        from protocols.commbridge_server import CommBridgeAdapter
        registry.register("commbridge", "CommBridge", factory=lambda c: CommBridgeAdapter(c),
                          default_port=53001, category="protocol",
                          description="CommBridge · 边缘透传 · 191 RTU")
    except ImportError: pass

    try:
        from protocols.edge_hub_channel import EdgeHubChannel
        registry.register("edge_hub", "边缘中枢", factory=lambda c: EdgeHubChannel(c),
                          default_port=53002, category="protocol",
                          description="边缘中枢 MQTT 聚合通道")
    except ImportError: pass

    try:
        from protocols.io_scanner_channel import IoScannerChannel
        registry.register("io_scan", "IO扫描", factory=lambda c: IoScannerChannel(c),
                          default_port=0, category="protocol",
                          description="IO服务器远程扫描 · WinRM · 进程发现")
    except ImportError: pass

    # ─── 厂商通道 (10家) ───
    try:
        from protocols.gateway_vendors import create_vendor_channels
        for name, factory, desc in create_vendor_channels():
            key = f"vendor_{name}"
            registry.register(key, f"{name}网关", factory=factory,
                              category="vendor", description=desc)
    except ImportError: pass

    # ─── 专业系统 ───
    try:
        from protocols.phm_platform import PhmPlatformAdapter
        registry.register("phm", "PHM预测维护", factory=lambda c: PhmPlatformAdapter(c),
                          category="protocol", description="预测性维护 · 设备健康评估")
    except ImportError: pass

    try:
        from protocols.youyeyun import YouyeyunAdapter
        registry.register("youyeyun", "优也云", factory=lambda c: YouyeyunAdapter(c),
                          category="protocol", description="优也云工业互联网平台")
    except ImportError: pass

    try:
        from protocols.zhiwei_phm import ZhiweiPhmAdapter
        registry.register("zhiwei_phm", "智维PHM", factory=lambda c: ZhiweiPhmAdapter(c),
                          category="protocol", description="智维科技 PHM 平台")
    except ImportError: pass

    log.info(f"PluginLoader: {len(registry._plugins)} protocols registered")
    return registry.list_all()
