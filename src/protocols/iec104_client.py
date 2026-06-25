# ============================================================
# pythonIot — IEC 60870-5-104 协议客户端（主站）
# ============================================================
"""
IEC 104 协议轻量实现

支持:
  - 总召 (C_IC_NA_1)
  - 时钟同步 (C_CS_NA_1)
  - 遥测接收: M_ME_NA_1(9), M_ME_NB_1(11), M_ME_NC_1(13)
  - 遥信接收: M_SP_NA_1(1), M_DP_NA_1(3)
  - 遥控命令: C_SC_NA_1(45)

APCI 帧格式 (I帧):
  Start(0x68) | Len | Len | 0x68 | Control(4B) | ASDU | ...

Control 域 (I帧):
  SendSeq(2B) | RecvSeq(2B)
  序列号范围: 0 ~ 32767

参考: IEC 60870-5-104:2006
"""
import asyncio
import logging
import struct
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

# ASDU 类型标识
TYPE_ID_MAP = {
    1:   "M_SP_NA_1",       # 单点遥信
    3:   "M_DP_NA_1",       # 双点遥信
    9:   "M_ME_NA_1",       # 归一化遥测值
    11:  "M_ME_NB_1",       # 标度化遥测值
    13:  "M_ME_NC_1",       # 短浮点遥测值
    30:  "M_SP_TB_1",       # 带时标单点遥信
    31:  "M_DP_TB_1",       # 带时标双点遥信
    36:  "M_ME_TF_1",       # 带时标短浮点遥测值
    45:  "C_SC_NA_1",       # 单点遥控命令
    46:  "C_DC_NA_1",       # 双点遥控命令
    100: "C_IC_NA_1",       # 总召命令
    103: "C_CS_NA_1",       # 时钟同步
}

# 传输原因
CAUSE_MAP = {
    1:  "periodic",          # 周期
    2:  "background",        # 背景
    3:  "spontaneous",       # 突发
    4:  "init",              # 初始化
    5:  "request",           # 请求
    20: "general_interrogation",  # 总召
}


class IEC104Client(BaseProtocolAdapter):
    """IEC 104 主站客户端

    config.extra:
    {
        "host": "192.168.1.200",
        "port": 2404,
        "common_addr": 1,        # 公共地址
        "originator_addr": 0,
        "w": 8,                  # 最大未确认 I 帧数
        "t1": 15,                # 发送超时(秒)
        "t2": 10,                # 确认超时(秒)
        "t3": 20,                # 空闲测试超时(秒)
    }
    """

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self._reader: Optional[asyncio.StreamReader] = None
        self._writer: Optional[asyncio.StreamWriter] = None
        self._send_seq = 0
        self._recv_seq = 0
        self._w = 8
        self._unconfirmed = 0
        self._data_queue: asyncio.Queue = asyncio.Queue()
        self._recv_task: Optional[asyncio.Task] = None
        self._gi_active = False

    async def connect(self) -> bool:
        host = self.config.extra.get("host", "127.0.0.1")
        port = self.config.extra.get("port", 2404)
        try:
            self._reader, self._writer = await asyncio.wait_for(
                asyncio.open_connection(host, port),
                timeout=self.config.timeout
            )
            # 发送 STARTDT
            await self._send_u_frame(b'\x07')
            # 发送总召
            await self._send_general_interrogation()
            self._connected = True
            self._recv_task = asyncio.create_task(self._recv_loop())
            logger.info(f"[iec104] {self.device_id} 连接成功 {host}:{port}")
            return True
        except Exception as e:
            logger.error(f"[iec104] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self._writer:
            # 发送 STOPDT
            try:
                await self._send_u_frame(b'\x13')
            except Exception:
                pass
            self._writer.close()
            await self._writer.wait_closed()
        if self._recv_task:
            self._recv_task.cancel()
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """从数据队列中提取目标点位的最新值"""
        results = []
        point_map = {p.get("point_id"): p for p in points}

        # 非阻塞读取队列中所有数据
        while not self._data_queue.empty():
            try:
                pv = self._data_queue.get_nowait()
                if pv.point_id in point_map or pv.point_id == "":
                    results.append(pv)
            except asyncio.QueueEmpty:
                break

        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """发送遥控命令 C_SC_NA_1"""
        try:
            ioa = point.get("protocol_addr", 0)
            if isinstance(ioa, str):
                ioa = int(ioa) if ioa.isdigit() else 0
            ca = self.config.extra.get("common_addr", 1)
            cmd = int(value)  # 0=分, 1=合

            asdu = struct.pack('<BBHBB',
                               45,            # C_SC_NA_1
                               1,             # 元素数量=1
                               0x06_00,       # 传输原因=6(激活)
                               ca & 0xFF,     # 公共地址(低字节)
                               ioa & 0xFF,    # 信息体地址(低字节)
                               )
            asdu += struct.pack('<B', 0x80 | cmd)  # S/E=1, SCS=0(执行), CMD
            await self._send_i_frame(asdu)
            return True
        except Exception as e:
            logger.error(f"[iec104] 遥控失败: {e}")
            return False

    # ===== 帧处理 =====

    async def _send_i_frame(self, asdu: bytes) -> None:
        """发送 I 帧"""
        ctrl = struct.pack('<HH', self._send_seq << 1, self._recv_seq << 1)
        length = 4 + len(asdu)
        frame = b'\x68' + bytes([length, length]) + b'\x68' + ctrl + asdu
        self._writer.write(frame)
        await self._writer.drain()
        self._send_seq = (self._send_seq + 1) % 32768
        self._unconfirmed += 1

    async def _send_u_frame(self, cmd: bytes) -> None:
        """发送 U 帧"""
        frame = b'\x68\x04\x04\x68' + cmd + b'\x00\x00'
        self._writer.write(frame)
        await self._writer.drain()

    async def _send_s_frame(self) -> None:
        """发送 S 帧（确认）"""
        ctrl = struct.pack('<H', 0x01 | (self._recv_seq << 1))
        frame = b'\x68\x04\x04\x68' + ctrl + b'\x00\x00'
        self._writer.write(frame)
        await self._writer.drain()

    async def _send_general_interrogation(self) -> None:
        """发送总召命令"""
        ca = self.config.extra.get("common_addr", 1)
        asdu = struct.pack('<BBHB',
                           100,           # C_IC_NA_1
                           1,             # 元素数量
                           0x1400,        # 传输原因=20(总召)
                           ca & 0xFF,
                           )
        asdu += b'\x00\x14'  # 信息体地址 + QOI=20(总召)
        await self._send_i_frame(asdu)
        logger.info(f"[iec104] {self.device_id} 发送总召")

    async def _recv_loop(self) -> None:
        """接收消息循环"""
        buffer = b''
        while self._connected:
            try:
                data = await asyncio.wait_for(self._reader.read(4096), timeout=1)
                if not data:
                    logger.warning(f"[iec104] {self.device_id} 连接断开")
                    self._connected = False
                    return
                buffer += data
                while len(buffer) >= 2:
                    if buffer[0] != 0x68:
                        buffer = buffer[1:]
                        continue
                    if len(buffer) < 2:
                        break
                    apdu_len = buffer[1]
                    if len(buffer) < apdu_len + 2:
                        break
                    frame = buffer[:apdu_len + 2]
                    buffer = buffer[apdu_len + 2:]
                    await self._parse_frame(frame)
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"[iec104] recv error: {e}")
                self._connected = False
                return

    async def _parse_frame(self, frame: bytes) -> None:
        """解析 APDU 帧"""
        if len(frame) < 6:
            return

        ctrl = struct.unpack('<H', frame[4:6])[0]
        frame_type = ctrl & 0x03

        if frame_type == 0:  # I 帧
            recv_seq = (ctrl >> 1) & 0x7FFF
            self._recv_seq = (recv_seq + 1) % 32768
            asdu = frame[8:]
            if asdu:
                await self._parse_asdu(asdu)
        elif frame_type == 1:  # S 帧
            pass
        elif frame_type == 3:  # U 帧 (STARTDT_CONF=0x0B, STOPDT_CONF=0x23)
            pass

    async def _parse_asdu(self, asdu: bytes) -> None:
        """解析 ASDU"""
        if len(asdu) < 6:
            return

        type_id = asdu[0]
        num_elements = asdu[1] & 0x7F
        sq = (asdu[1] & 0x80) != 0  # 是否序列
        cause = struct.unpack('<H', asdu[2:4])[0]
        cause_type = cause & 0x3F
        common_addr = asdu[4] | ((asdu[5] & 0xFF) << 8)
        payload = asdu[6:]

        type_name = TYPE_ID_MAP.get(type_id, f"UNKNOWN({type_id})")

        if type_id == 100:  # 总召确认
            logger.info(f"[iec104] 总召确认 received")
            return

        if type_id in (9, 11, 13, 36):  # 遥测
            await self._parse_measurement(type_id, num_elements, sq, common_addr, payload)
        elif type_id in (1, 3, 30, 31):  # 遥信
            await self._parse_signal(type_id, num_elements, sq, common_addr, payload)

    async def _parse_measurement(self, type_id: int, n: int, sq: bool, ca: int, payload: bytes):
        """解析遥测值 (IOA=3B + Value + QDS)"""
        # M_ME_NC_1(13): IOA(3) + float(4) + QDS(1) = 8 bytes
        elem_size = 8 if type_id == 13 else (3 if type_id in (9, 11) else 5)
        for i in range(n):
            offset = i * elem_size
            if offset + elem_size > len(payload):
                break
            ioa = struct.unpack('<I', payload[offset:offset + 3] + b'\x00')[0]
            if type_id == 13:
                raw = struct.unpack('<f', payload[offset + 3:offset + 7])[0]
                await self._data_queue.put(PointValue(
                    device_id=self.device_id,
                    point_id=f"ioa_{ioa}",
                    point_name=f"IOA_{ioa}",
                    value=round(raw, 4),
                    data_type="float32",
                    timestamp=datetime.now(timezone.utc),
                ))

    async def _parse_signal(self, type_id: int, n: int, sq: bool, ca: int, payload: bytes):
        """解析遥信值"""
        elem_size = 1 if type_id == 1 else 2
        for i in range(n):
            offset = i * (elem_size + 2)  # IOA(2) + 值
            if offset + 2 > len(payload):
                break
            ioa = struct.unpack('<H', payload[offset:offset + 2])[0]
            val = payload[offset + 2] & 0x01 if type_id == 1 else payload[offset + 2] & 0x03
            await self._data_queue.put(PointValue(
                device_id=self.device_id,
                point_id=f"ioa_{ioa}",
                point_name=f"IOA_{ioa}",
                value=val,
                data_type="bool",
                timestamp=datetime.now(timezone.utc),
            ))
