# ============================================================
# iotStudio — 博感 MQTT TLV 协议适配器 (智能螺栓/声振温)
# ============================================================
"""
博感 GU100X 网关 MQTT 协议适配器。

设备:
  - SA210 无线螺栓松动传感器 (BLE → GU100X → MQTT)
  - SVT 振动温度传感器
  - CM301 声振温传感器

MQTT 连接:
  Broker: dev.dgiotcloud.cn:1883
  上行 Topic: iot/v3/gw/{gw_mac}/dev/{dev_mac}/message/up

TLV 协议格式 (消息类型 0x10):
  Type 0xA0: 设备 MAC (6B)
  Type 0x40: 松动角度 (Int16 LE, 0.01°)
  Type 0x20: 温度 (Uint16 LE, 0.1°C)
  Type 0x50: 电池电压 (Uint16 LE, 0.01V)
  Type 0x51: 振动RMS (Uint16 LE, 0.001g)

配置示例 (config.extra):
{
    "broker": "dev.dgiotcloud.cn",
    "port": 1883,
    "client_id": "iotStudio_bogan",
    "subscribe_topics": ["iot/v3/gw/+/+/message/up"],
    "gw_mac": "eca24a560c89",           # 可选: 只处理指定网关
    "devices": {
        "eca24a560c89": {               # 设备MAC → 测点映射
            "device_id": "bolt_01",
            "device_name": "北1-2-螺栓1号"
        }
    }
}
"""
import asyncio
import json
import logging
import struct
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

# ===== TLV 解码器 =====

def _parse_tlv(data: bytes) -> Dict[str, Any]:
    """解析博感 TLV 二进制数据 → 字典"""
    result = {}
    i = 0
    while i < len(data):
        t = data[i]
        i += 1
        if i >= len(data):
            break
        # Type 编码: 高2位 = 长度类别
        if t <= 0x1F:
            # 状态码/标志位: 1字节值
            val = data[i]
            i += 1
        elif t <= 0x5F:
            # 短值: 2字节小端
            if i + 2 > len(data):
                break
            val = struct.unpack_from("<H", data, i)[0]
            i += 2
            # Int16 处理 (负值)
            if t in (0x40,):  # 角度 (signed)
                val = val if val < 0x8000 else val - 0x10000
        elif t <= 0x9F:
            # 长值: 4字节
            if i + 4 > len(data):
                break
            val = struct.unpack_from("<I", data, i)[0]
            i += 4
        elif t <= 0xBF:
            # MAC地址: 6字节
            if i + 6 > len(data):
                break
            val = data[i:i+6].hex()
            i += 6
        elif t <= 0xDF:
            # 长数据: 12字节
            if i + 12 > len(data):
                break
            val = data[i:i+12].hex()
            i += 12
        else:
            # 变长: 下一字节是长度
            length = data[i]
            i += 1
            if i + length > len(data):
                break
            val = data[i:i+length].hex()
            i += length
        result[t] = val
    return result


def _tlv_to_points(tlv: Dict[int, Any], device_id: str) -> List[PointValue]:
    """TLV 字典 → PointValue 列表"""
    results = []
    ts = datetime.now(timezone.utc)

    # 0x20 = 温度
    if 0x20 in tlv:
        results.append(PointValue(
            device_id=device_id, point_id="temperature",
            point_name="温度", value=round(tlv[0x20] * 0.1, 1),
            data_type="float32", unit="°C", timestamp=ts,
        ))
    # 0x40 = 松动角度
    if 0x40 in tlv:
        results.append(PointValue(
            device_id=device_id, point_id="angle",
            point_name="松动角度", value=round(tlv[0x40] * 0.01, 2),
            data_type="float32", unit="°", timestamp=ts,
        ))
    # 0x50 = 电池电压
    if 0x50 in tlv:
        results.append(PointValue(
            device_id=device_id, point_id="battery",
            point_name="电池电压", value=round(tlv[0x50] * 0.01, 2),
            data_type="float32", unit="V", timestamp=ts,
        ))
    # 0x51 = 振动RMS
    if 0x51 in tlv:
        results.append(PointValue(
            device_id=device_id, point_id="vibration_rms",
            point_name="振动RMS", value=round(tlv[0x51] * 0.001, 3),
            data_type="float32", unit="g", timestamp=ts,
        ))
    # 0x52 = 振动峰值
    if 0x52 in tlv:
        results.append(PointValue(
            device_id=device_id, point_id="vibration_peak",
            point_name="振动峰值", value=round(tlv[0x52] * 0.001, 3),
            data_type="float32", unit="g", timestamp=ts,
        ))

    return results


class BoganMqttAdapter(BaseProtocolAdapter):
    """博感 MQTT TLV 协议适配器 — 订阅网关数据并解析为测点"""

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self._client: Optional[Any] = None
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._running = False
        self._data_queue: asyncio.Queue = asyncio.Queue()
        self._device_map: Dict[str, str] = {}  # mac → device_id
        self._reverse_map: Dict[str, str] = {}  # device_id → mac
        self._gw_filter: str = ""

    async def connect(self) -> bool:
        """连接 MQTT Broker 并订阅 topic"""
        import paho.mqtt.client as mqtt

        extra = self.config.extra
        broker = extra.get("broker", "dev.dgiotcloud.cn")
        port = extra.get("port", 1883)
        client_id = extra.get("client_id", f"iotStudio_bogan_{self.device_id}")

        # 设备映射
        devices = extra.get("devices", {})
        for mac, info in devices.items():
            did = info.get("device_id", f"bogan_{mac}")
            self._device_map[mac] = did
            self._reverse_map[did] = mac

        self._gw_filter = extra.get("gw_mac", "").lower()
        self._loop = asyncio.get_running_loop()

        try:
            self._client = mqtt.Client(client_id=client_id)
            self._client.on_connect = self._on_connect
            self._client.on_message = self._on_message
            self._client.on_disconnect = self._on_disconnect

            self._client.connect_async(broker, port, keepalive=60)
            self._client.loop_start()
            self._connected = True
            logger.info(f"[bogan_mqtt] {self.device_id} 连接中 {broker}:{port}")
            return True
        except Exception as e:
            logger.error(f"[bogan_mqtt] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    def _on_connect(self, client, userdata, flags, rc):
        """MQTT 连接回调"""
        topics = self.config.extra.get("subscribe_topics",
                                       ["iot/v3/gw/+/+/message/up"])
        for topic in topics:
            client.subscribe(topic, qos=0)
            logger.info(f"[bogan_mqtt] 已订阅 {topic}")

    def _on_disconnect(self, client, userdata, rc):
        """MQTT 断线回调"""
        logger.warning(f"[bogan_mqtt] {self.device_id} 断线 rc={rc}")
        if self._loop and not self._loop.is_closed():
            self._loop.call_soon_threadsafe(
                asyncio.create_task, self._reconnect()
            )

    async def _reconnect(self):
        """重连"""
        self._connected = False
        await asyncio.sleep(5)
        try:
            if self._client:
                self._client.reconnect()
        except Exception:
            pass

    def _on_message(self, client, userdata, msg):
        """MQTT 消息回调 — 解析 TLV 并放入队列"""
        try:
            # 从 topic 提取网关MAC和设备MAC
            # iot/v3/gw/{gw_mac}/dev/{dev_mac}/message/up
            parts = msg.topic.split("/")
            if len(parts) < 8:
                return

            gw_mac = parts[3].lower()
            dev_mac = parts[5].lower()

            # 网关过滤
            if self._gw_filter and gw_mac != self._gw_filter:
                return

            # 解析消息类型 (首字节)
            if len(msg.payload) < 1:
                return
            msg_type = msg.payload[0]

            device_id = self._device_map.get(dev_mac, f"bogan_{dev_mac}")

            if msg_type == 0x10:
                # 传感器数据上报
                tlv = _parse_tlv(msg.payload[1:])
                points = _tlv_to_points(tlv, device_id)
                if points:
                    self._loop.call_soon_threadsafe(
                        self._data_queue.put_nowait, points
                    )

            elif msg_type == 0x1E:
                # 网关掉线
                points = [PointValue(
                    device_id=device_id, point_id="online",
                    point_name="在线状态", value=0,
                    data_type="uint16", unit="",
                )]
                self._loop.call_soon_threadsafe(
                    self._data_queue.put_nowait, points
                )

            elif msg_type == 0x3F:
                # Pong → 响应心跳
                pass

        except Exception as e:
            logger.warning(f"[bogan_mqtt] 消息解析失败: {e}")

    async def disconnect(self) -> None:
        """断开 MQTT 连接"""
        self._running = False
        if self._client:
            self._client.loop_stop()
            self._client.disconnect()
            self._client = None
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """从队列消费 MQTT 数据"""
        results = []
        try:
            while not self._data_queue.empty():
                batch = self._data_queue.get_nowait()
                results.extend(batch)
        except asyncio.QueueEmpty:
            pass
        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """下行命令 — 发送 Pong 或配置"""
        if not self._client or not self._connected:
            return False

        mac = self._reverse_map.get(point.get("point_id", ""), "")
        if not mac:
            logger.warning(f"[bogan_mqtt] 未知设备: {point.get('point_id')}")
            return False

        try:
            topic = f"iot/v3/gw/{self._gw_filter}/dev/{mac}/message/down"
            # Pong 响应 (0x3F)
            payload = bytes([0x3F])
            self._client.publish(topic, payload, qos=0)
            return True
        except Exception as e:
            logger.warning(f"[bogan_mqtt] 写入失败: {e}")
            return False

    async def read_holding(self, addr: int, count: int = 1,
                           slave_id: Optional[int] = None) -> Optional[list]:
        return None

    async def health(self) -> dict:
        return {
            "ok": self._connected,
            "msg": "MQTT 已连接" if self._connected else "未连接",
            "queue_size": self._data_queue.qsize(),
        }


# -- 插件注册 --
try:
    from ..plugin_registry import register
    register("bogan_mqtt", version="1.0", category="protocol",
             adapter="BoganMqttAdapter",
             config={
                 "broker": "dev.dgiotcloud.cn",
                 "port": 1883,
                 "subscribe_topics": ["iot/v3/gw/+/+/message/up"],
             })
except ImportError:
    pass
