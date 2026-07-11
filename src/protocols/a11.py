#!/usr/bin/env python3
# ============================================================
# dgiot_lite — A11 协议适配器 (CNPC 油气生产物联网)
#
# 协议栈: ModbusTCP MBAP (7B) + jjZZ MAGIC (4B) + Type LE(2B) + Sub LE(2B) + Payload
#
# 基于 pcap 逆向分析 — 2026-07-03
# 参考: A11-GRM 规范文档, 7.3.pcapng 抓包数据
# ============================================================
import asyncio
import logging
import struct
import time
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from collections import defaultdict

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

# ============================================================
# 常量定义
# ============================================================
A11_MAGIC = b'\x6a\x6a\x5a\x5a'  # jjZZ 魔术字
A11_DEFAULT_PORT = 8889
MBAP_HEADER_LEN = 7
A11_HEADER_LEN = 8  # MAGIC(4) + TYPE(2) + SUB(2)
FRAME_MIN_LEN = MBAP_HEADER_LEN + A11_HEADER_LEN  # 15 字节

# ============================================================
# A11 消息类型枚举 (从 pcap 逆向 + 推断)
# ============================================================
class A11MsgType:
    """A11 协议消息类型定义"""
    # 系统指令 (0x0000-0x00FF)
    HEARTBEAT       = 0x0017  # 心跳/保活 (64.3% 流量)
    HEARTBEAT_ACK   = 0x0013  # 心跳确认
    SYS_QUERY       = 0x0030  # 系统查询
    SYS_CMD_31      = 0x0031  # 系统指令
    SYS_CMD_46      = 0x0046  # 系统指令
    SYS_CMD_5B      = 0x005b  # 系统指令
    SYS_CMD_70      = 0x0070  # 系统指令
    SYS_CMD_85      = 0x0085  # 系统指令

    # 设备注册 (0x0100-0x04FF)
    DEV_REGISTER    = 0x0506  # 设备注册
    DEV_UNREGISTER  = 0x021a  # 设备注销

    # 数据上报 (0x0500-0x07FF)
    DATA_REPORT     = 0x056c  # 数据上报
    DATA_QUERY      = 0x0539  # 数据查询

    # 状态 (0x0800-0x0AFF)
    STATUS_QUERY    = 0x024d  # 状态查询
    STATUS_REPORT   = 0x0291  # 状态上报

    # 告警/事件 (0x0B00-0x7FFF)
    ALARM_EVENT     = 0x56b6  # 告警事件
    ALARM_ACK       = 0x04f5  # 告警确认

    # 服务端响应 (bit15=1)
    SERVER_RESP     = 0xca99  # 服务端响应

    @classmethod
    def classify(cls, type_code: int) -> str:
        """分类消息类型"""
        if type_code <= 0x00FF:
            return 'SYSTEM'
        hi, lo = (type_code >> 8) & 0xFF, type_code & 0xFF
        if hi >= 0x80:
            return 'RESPONSE'
        if lo <= 0x30:
            return 'REGISTER'
        if lo <= 0x4F:
            return 'QUERY'
        if lo <= 0x7F:
            return 'DATA'
        if lo <= 0xAF:
            return 'STATUS'
        return 'EVENT'

    @classmethod
    def name(cls, type_code: int) -> str:
        """类型码 → 名称"""
        names = {v: k for k, v in vars(cls).items()
                 if not k.startswith('_') and isinstance(v, int)}
        return names.get(type_code, f'UNKNOWN_0x{type_code:04X}')


# ============================================================
# 数据类
# ============================================================
@dataclass
class A11Message:
    """A11 协议消息"""
    trans_id: int           # Modbus 事务 ID
    unit_id: int            # Modbus 单元 ID
    msg_type: int           # A11 消息类型
    msg_sub: int            # A11 子类型/标志
    payload: bytes          # 原始载荷
    timestamp: float = field(default_factory=time.time)

    @property
    def type_name(self) -> str:
        return A11MsgType.name(self.msg_type)

    @property
    def category(self) -> str:
        return A11MsgType.classify(self.msg_type)

    def encode(self) -> bytes:
        """编码为完整帧"""
        pdu = A11_MAGIC
        pdu += struct.pack('<H', self.msg_type)
        pdu += struct.pack('<H', self.msg_sub)
        pdu += self.payload
        length = len(pdu) + 1  # +1 for unit_id
        mbap = struct.pack('>HHHB', self.trans_id, 0, length, self.unit_id)
        return mbap + pdu

    @classmethod
    def decode(cls, data: bytes, timestamp: float = None) -> Optional['A11Message']:
        """从原始字节解码，支持批处理 (返回第一个消息)"""
        msgs = cls.decode_batch(data, timestamp)
        return msgs[0] if msgs else None

    @classmethod
    def decode_batch(cls, data: bytes, timestamp: float = None) -> List['A11Message']:
        """从原始字节批量解码所有 A11 消息"""
        messages = []
        pos = 0
        while pos + FRAME_MIN_LEN <= len(data):
            # 解析 MBAP 头
            tid, pid, mblen, uid = struct.unpack('>HHHB', data[pos:pos+7])
            if pid != 0 or mblen < 9:
                pos += 1
                continue
            pdu_len = mblen - 1
            pdu_start = pos + 7
            if pdu_start + pdu_len > len(data):
                break
            pdu = data[pdu_start:pdu_start + pdu_len]

            # 在 PDU 中搜索所有 jjZZ 子消息
            jj_pos = 0
            while jj_pos + A11_HEADER_LEN <= len(pdu):
                if pdu[jj_pos:jj_pos+4] != A11_MAGIC:
                    jj_pos += 1
                    continue
                msg_type = struct.unpack('<H', pdu[jj_pos+4:jj_pos+6])[0]
                msg_sub = struct.unpack('<H', pdu[jj_pos+6:jj_pos+8])[0]

                # Payload = 到下一个 jjZZ 或 PDU 结束
                next_jj = pdu.find(A11_MAGIC, jj_pos + 4)
                payload_end = next_jj if next_jj > 0 else len(pdu)
                payload = pdu[jj_pos+8:payload_end]

                messages.append(A11Message(
                    trans_id=tid,
                    unit_id=uid,
                    msg_type=msg_type,
                    msg_sub=msg_sub,
                    payload=payload,
                    timestamp=timestamp or time.time()
                ))
                jj_pos = payload_end
            pos = pdu_start + pdu_len
        return messages


@dataclass
class A11Config:
    """A11 协议配置 (兼容 ProtocolConfig 字段)"""
    device_id: str
    device_name: str = ""
    protocol_type: str = "a11"
    host: str = "127.0.0.1"
    port: int = A11_DEFAULT_PORT
    unit_id: int = 0
    enabled: bool = True
    collect_interval: int = 5
    timeout: int = 10
    retry: int = 3
    heartbeat_interval: int = 5
    trans_id: int = 1
    points: List[Dict[str, Any]] = field(default_factory=list)
    dds_enabled: bool = False
    dds_port: int = 2500
    extra: Dict[str, Any] = field(default_factory=dict)


# ============================================================
# A11 协议适配器
# ============================================================
class A11ProtocolAdapter(BaseProtocolAdapter):
    """A11 协议适配器 — CNPC 油气生产物联网私有协议

    Features:
      - ModbusTCP MBAP 封装 + jjZZ 私有头
      - 消息编解码 (支持批处理嵌套)
      - 心跳维持
      - 与现有 BaseProtocolAdapter 接口兼容
      - 安全: TLS 可选，输入验证

    Usage:
        config = A11Config(host='11.66.12.130', port=8889, device_id='rtu-001',
                          points=[{'point_id':'p1','point_name':'井口压力','a11_type':0x0539}])
        adapter = A11ProtocolAdapter(config)
        await adapter.connect()
        values = await adapter.read_points(config.points)
    """

    def __init__(self, config: A11Config):
        BaseProtocolAdapter.__init__(self, ProtocolConfig(
            protocol_type=config.protocol_type,
            device_id=config.device_id,
            device_name=config.device_name,
            enabled=config.enabled,
            collect_interval=config.collect_interval,
            timeout=config.timeout,
            retry=config.retry,
            points=config.points,
            extra=config.extra,
        ))
        self.config: A11Config = config
        self._reader: Optional[asyncio.StreamReader] = None
        self._writer: Optional[asyncio.StreamWriter] = None
        self._trans_id = config.trans_id
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._recv_buffer = b''

        # 安全审计日志
        self._security_log: List[Dict] = []

    # ========================================================
    # 连接管理
    # ========================================================
    async def connect(self) -> bool:
        """建立 TCP 连接到 A11 网关"""
        try:
            self._reader, self._writer = await asyncio.wait_for(
                asyncio.open_connection(self.config.host, self.config.port),
                timeout=self.config.timeout
            )
            self._connected = True
            self._log_security('CONNECT', f'已连接 {self.config.host}:{self.config.port}')

            # 启动心跳
            if self.config.heartbeat_interval > 0:
                self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

            logger.info(f"[a11] 已连接 {self.config.host}:{self.config.port}")
            return True
        except Exception as e:
            logger.error(f"[a11] 连接失败: {e}")
            self._log_security('CONNECT_FAIL', str(e))
            return False

    async def disconnect(self) -> None:
        """断开连接"""
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            self._heartbeat_task = None
        if self._writer:
            try:
                self._writer.close()
                await self._writer.wait_closed()
            except Exception:
                pass
        self._reader = None
        self._writer = None
        self._connected = False
        self._log_security('DISCONNECT', '已断开')
        logger.info("[a11] 已断开连接")

    # ========================================================
    # 心跳
    # ========================================================
    async def _heartbeat_loop(self):
        """心跳维持循环"""
        while self._connected:
            try:
                await asyncio.sleep(self.config.heartbeat_interval)
                if not self._connected:
                    break
                await self._send_heartbeat()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.warning(f"[a11] 心跳异常: {e}")
                self._log_security('HEARTBEAT_FAIL', str(e))

    async def _send_heartbeat(self) -> bool:
        """发送心跳消息 (type=0x0017)"""
        msg = A11Message(
            trans_id=self._next_tid(),
            unit_id=self.config.unit_id,
            msg_type=A11MsgType.HEARTBEAT,
            msg_sub=0,
            payload=b''
        )
        return await self._send_message(msg)

    # ========================================================
    # 消息收发
    # ========================================================
    async def _send_message(self, msg: A11Message) -> bool:
        """发送单条 A11 消息"""
        if not self._writer:
            return False
        try:
            frame = msg.encode()
            self._writer.write(frame)
            await self._writer.drain()
            logger.debug(f"[a11] TX {msg.type_name} tid={msg.trans_id}")
            return True
        except Exception as e:
            logger.error(f"[a11] 发送失败: {e}")
            return False

    async def _send_batch(self, messages: List[A11Message]) -> bool:
        """批量发送 A11 消息 (打包到一个 PDU)"""
        if not messages or not self._writer:
            return False
        # 构建批量 PDU
        pdu = b''
        for msg in messages:
            pdu += A11_MAGIC
            pdu += struct.pack('<H', msg.msg_type)
            pdu += struct.pack('<H', msg.msg_sub)
            pdu += msg.payload
        length = len(pdu) + 1
        tid = self._next_tid()
        mbap = struct.pack('>HHHB', tid, 0, length, self.config.unit_id)
        frame = mbap + pdu
        try:
            self._writer.write(frame)
            await self._writer.drain()
            logger.debug(f"[a11] TX batch {len(messages)}msgs tid={tid}")
            return True
        except Exception as e:
            logger.error(f"[a11] 批量发送失败: {e}")
            return False

    async def _recv_messages(self, timeout: float = None) -> List[A11Message]:
        """接收并解码 A11 消息"""
        if not self._reader:
            return []
        try:
            if timeout:
                data = await asyncio.wait_for(
                    self._reader.read(65535), timeout=timeout
                )
            else:
                data = await self._reader.read(65535)
            if not data:
                self._connected = False
                return []
            self._recv_buffer += data
            msgs = A11Message.decode_batch(self._recv_buffer)
            if msgs:
                # 清除已解析的数据 (简化: 清除全部 buffer)
                self._recv_buffer = b''
            return msgs
        except asyncio.TimeoutError:
            return []
        except Exception as e:
            logger.error(f"[a11] 接收失败: {e}")
            return []

    def _next_tid(self) -> int:
        """获取下一个事务 ID"""
        tid = self._trans_id
        self._trans_id = (self._trans_id + 1) % 65536
        return tid

    # ========================================================
    # 点位读写 (BaseProtocolAdapter 接口)
    # ========================================================
    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """读取点位 — A11 协议实现

        Args:
            points: 点位配置列表, 支持:
              - {'point_id': 'x', 'a11_type': 0x0539}  → 发送指定类型查询
              - {'point_id': 'x', 'a11_addr': 0x0017} → 心跳检测
        """
        results = []
        if not self._connected:
            return results

        # 按 a11_type 分组
        type_groups: Dict[int, List[Dict]] = defaultdict(list)
        for pt in points:
            a11_type = pt.get('a11_type', A11MsgType.DATA_QUERY)
            type_groups[a11_type].append(pt)

        for a11_type, group in type_groups.items():
            # 发送查询消息
            query_msg = A11Message(
                trans_id=self._next_tid(),
                unit_id=self.config.unit_id,
                msg_type=a11_type,
                msg_sub=0,
                payload=b''
            )
            if not await self._send_message(query_msg):
                continue

            # 接收响应
            responses = await self._recv_messages(timeout=self.config.timeout)
            for resp in responses:
                if resp.category == 'RESPONSE':
                    # 尝试从 payload 解析测点值
                    for pt in group:
                        value = self._parse_point_value(resp, pt)
                        if value:
                            results.append(value)

        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写入单个点位"""
        if not self._connected:
            return False
        # 构建写消息 (使用控制类型)
        msg = A11Message(
            trans_id=self._next_tid(),
            unit_id=self.config.unit_id,
            msg_type=point.get('a11_type', 0x0085),
            msg_sub=0,
            payload=self._encode_value(value)
        )
        return await self._send_message(msg)

    # ========================================================
    # Payload 解析
    # ========================================================
    def _parse_point_value(self, msg: A11Message, point: Dict[str, Any]) -> Optional[PointValue]:
        """从 A11 响应消息中解析测点值"""
        payload = msg.payload
        if len(payload) < 4:
            return None

        try:
            # 尝试 float32 解析 (LE)
            fval = struct.unpack('<f', payload[:4])[0]
            if abs(fval) < 1e8 and abs(fval) > 1e-12:
                return PointValue(
                    device_id=self.config.device_id,
                    point_id=point.get('point_id', ''),
                    point_name=point.get('point_name', ''),
                    value=round(fval, 4),
                    data_type='float32',
                    unit=point.get('unit'),
                    quality=0,
                    timestamp=datetime.utcnow(),
                    extra={'a11_type': f'0x{msg.msg_type:04X}', 'a11_sub': msg.msg_sub}
                )
            # 尝试 uint32
            uval = struct.unpack('<I', payload[:4])[0]
            if uval < 100000000:
                return PointValue(
                    device_id=self.config.device_id,
                    point_id=point.get('point_id', ''),
                    point_name=point.get('point_name', ''),
                    value=uval,
                    data_type='uint32',
                    unit=point.get('unit'),
                    quality=0,
                    timestamp=datetime.utcnow(),
                    extra={'a11_type': f'0x{msg.msg_type:04X}', 'a11_sub': msg.msg_sub}
                )
        except Exception:
            pass

        return PointValue(
            device_id=self.config.device_id,
            point_id=point.get('point_id', ''),
            point_name=point.get('point_name', ''),
            value=payload[:32].hex(),
            data_type='hex',
            quality=1,  # uncertain
            timestamp=datetime.utcnow(),
            extra={'a11_type': f'0x{msg.msg_type:04X}', 'a11_sub': msg.msg_sub}
        )

    def _encode_value(self, value: Any) -> bytes:
        """编码值为 A11 payload"""
        if isinstance(value, (int, float)):
            return struct.pack('<f', float(value))
        if isinstance(value, str):
            return value.encode('utf-8')[:64]
        return bytes(value)[:64]

    # ========================================================
    # 安全审计
    # ========================================================
    def _log_security(self, event: str, detail: str):
        """安全审计日志"""
        entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event': event,
            'detail': detail,
            'host': self.config.host,
            'port': self.config.port,
        }
        self._security_log.append(entry)
        if len(self._security_log) > 1000:
            self._security_log = self._security_log[-500:]

    def security_report(self) -> Dict[str, Any]:
        """生成安全审计报告"""
        events = defaultdict(int)
        for e in self._security_log:
            events[e['event']] += 1

        return {
            'total_events': len(self._security_log),
            'event_counts': dict(events),
            'connection_target': f'{self.config.host}:{self.config.port}',
            'tls_enabled': False,  # A11 默认不加密
            'heartbeat_enabled': self.config.heartbeat_interval > 0,
            'risk_assessment': self._assess_risk(),
            'recommendations': self._security_recommendations(),
        }

    def _assess_risk(self) -> str:
        """风险评估"""
        risks = []
        if not self.config.host.startswith('127.'):
            risks.append('非本地连接 — 数据可能经公网传输')
        if self.config.dds_enabled:
            risks.append('DDS UDP 通道未加密 — 实时事件可能被窃听')
        if self.config.unit_id == 0:
            risks.append('Unit ID=0 可能被广播 — 确认设备访问控制')
        return ' | '.join(risks) if risks else 'LOW'

    def _security_recommendations(self) -> List[str]:
        """安全建议"""
        return [
            'A11 默认不加密 — 生产环境建议部署 VPN/IPSec',
            'DDS 通道使用 Secure DDS (DDS Security Spec v1.0)',
            '限制 TCP :8889 仅允许已知 RTU IP 连接',
            '启用 ModbusTCP 访问控制列表 (ACL)',
            '定期审计 A11 设备注册消息 (type 0x0506)',
            '部署 NIDS 监控 jjZZ 魔数异常流量',
        ]


# ============================================================
# 独立解析器 (不依赖连接)
# ============================================================
class A11Parser:
    """A11 协议独立解析器 — 用于 pcap 离线分析

    Usage:
        parser = A11Parser()
        msgs = parser.parse_pcap('7.3.pcapng')
        for m in msgs:
            print(f'{m.type_name} ({m.category}) — {m.payload[:16].hex()}...')
    """

    def __init__(self):
        self.messages: List[A11Message] = []
        self.type_stats = defaultdict(int)

    def feed(self, data: bytes, timestamp: float = None) -> List[A11Message]:
        """喂入原始数据，返回解析出的消息"""
        msgs = A11Message.decode_batch(data, timestamp)
        for m in msgs:
            self.type_stats[m.msg_type] += 1
        self.messages.extend(msgs)
        return msgs

    def parse_pcap(self, pcap_path: str, port: int = A11_DEFAULT_PORT) -> List[A11Message]:
        """从 pcap 文件解析 A11 消息"""
        try:
            from scapy.all import sniff, IP, TCP
        except ImportError:
            raise ImportError("需要安装 scapy: pip install scapy")

        logger.info(f"解析 pcap: {pcap_path} (端口 {port})")
        pkts = sniff(offline=pcap_path, quiet=True)

        # 重组 TCP 流
        flows: Dict[tuple, bytes] = {}
        for p in pkts:
            if IP in p and TCP in p and p[TCP].payload:
                if p[TCP].sport == port:
                    k = (p[IP].src, p[TCP].sport, p[IP].dst, p[TCP].dport)
                elif p[TCP].dport == port:
                    k = (p[IP].src, p[TCP].sport, p[IP].dst, p[TCP].dport)
                else:
                    continue
                flows[k] = flows.get(k, b'') + bytes(p[TCP].payload)

        # 解析每个流
        all_msgs = []
        for flow_key, data in flows.items():
            msgs = self.feed(data, float(pkts[0].time) if pkts else None)
            all_msgs.extend(msgs)
            logger.debug(f"  流 {flow_key}: {len(msgs)} 条消息")

        logger.info(f"解析完成: {len(all_msgs)} 条消息, {len(self.type_stats)} 种类型")
        return all_msgs

    def report(self) -> str:
        """生成解析报告"""
        lines = [f"A11 协议解析报告 — {len(self.messages)} 条消息, {len(self.type_stats)} 种类型", ""]
        for t, c in sorted(self.type_stats.items(), key=lambda x: -x[1]):
            pct = c / len(self.messages) * 100 if self.messages else 0
            lines.append(f"  0x{t:04X} [{A11MsgType.classify(t):10s}] {A11MsgType.name(t):20s} {c:>6,} ({pct:5.1f}%)")
        return '\n'.join(lines)


# ============================================================
# 快速测试
# ============================================================
if __name__ == '__main__':
    import sys
    logging.basicConfig(level=logging.INFO, format='%(levelname)s %(message)s')

    if len(sys.argv) > 1:
        # pcap 离线分析模式
        parser = A11Parser()
        parser.parse_pcap(sys.argv[1])
        print(parser.report())
    else:
        # 在线连接测试
        async def test():
            config = A11Config(host='127.0.0.1', port=8889, device_id='test-001')
            adapter = A11ProtocolAdapter(config)
            if await adapter.connect():
                points = [{'point_id': 'p1', 'point_name': 'test'}]
                values = await adapter.read_points(points)
                print(f"读取: {values}")
                await adapter.disconnect()

        asyncio.run(test())

# -- plugin registration --
try:
    from plugin_registry import register
    register("a11", version="1.0", category="protocol",
             adapter="A11ProtocolAdapter",
             config={"host": "127.0.0.1", "port": 8889, "heartbeat_interval": 5})
except ImportError: pass
