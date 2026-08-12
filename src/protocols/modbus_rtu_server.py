"""
Modbus RTU over TCP 服务器 — 对标 dgiot_modbus_rtu_server.erl (562行)
同时作为通道插件注册 (一个通道 = 一个插件)

架构:
  现场 RS-485 设备 → DTU(串口转网口) → TCP → 本服务器(:20110)
                                                   ↓ raw Modbus RTU 帧
                                             modbus_rtu decoder → thing_model

注册模式 (对标 Erlang):
  RegisterByIp      — 用客户端 IP 作为设备标识
  RegisterByPort    — 用服务器端口号作为设备标识后缀
  RegisterByRegular — 用注册报文正则匹配识别设备 (默认)

数据流:
  TCP connect → 注册报文匹配 → register_client → 后续帧 = Modbus RTU raw data
  → EventBus("dtu.raw_frame") → modbus_rtu decoder → $dg/thing/{product}/{devaddr}/properties/report

改进 (vs Erlang):
  - asyncio 原生 (Erlang gen_tcp→gen_statem)
  - 可配置帧分隔符 (timeout-based 粘包处理)
  - 内置 DTU 模拟器 (测试用)
  - ChannelManager 集成
"""
import asyncio, logging, re, struct, time
from typing import Dict, Optional, Tuple
from dataclasses import dataclass, field

log = logging.getLogger("modbus_rtu_server")

# ═══════════════════════════════════════════
# 配置模型
# ═══════════════════════════════════════════

@dataclass
class DTUClient:
    """已注册的 DTU 客户端 — 对标 TCPState"""
    writer: asyncio.StreamWriter
    peername: str
    devaddr: str = ""           # 设备地址 (DTU标识)
    product_id: str = ""        # 产品 ID
    device_id: str = ""         # MD5 生成的 Device objectId
    registered: bool = False    # 是否已注册
    connected_at: float = 0.0

# ═══════════════════════════════════════════
# 服务器
# ═══════════════════════════════════════════

class ModbusRtuTcpServer:
    """Modbus RTU over TCP 服务器 — 对标 dgiot_modbus_rtu_server"""

    def __init__(self, config: dict = None):
        cfg = config or {}
        self.port = cfg.get("port", 20110)
        self.host = cfg.get("host", "0.0.0.0")
        self.regtype = cfg.get("regtype", "RegisterByRegular")
        self.regular = cfg.get("regular", "")         # 注册报文正则 (通配符)
        self.dtutype = cfg.get("dtutype", "DGIOT")    # DTU 厂商
        self.product_id = cfg.get("product_id", "")
        self.frame_timeout = cfg.get("frame_timeout", 0.5)  # 帧间超时 (秒)
        self.max_frame_size = cfg.get("max_frame_size", 256)  # 最大 Modbus RTU 帧

        self._server: Optional[asyncio.Server] = None
        self._clients: Dict[str, DTUClient] = {}   # peername → DTUClient
        self._running = False

    # ── 生命周期 ──

    async def start(self):
        self._server = await asyncio.start_server(
            self._handle_connection, self.host, self.port)
        self._running = True
        log.info(f"[rtu_server] 启动 :{self.port} regtype={self.regtype}")

    async def stop(self):
        self._running = False
        if self._server:
            self._server.close()
            await self._server.wait_closed()
        # 断开所有客户端
        for client in list(self._clients.values()):
            try:
                client.writer.close()
            except Exception:
                pass
        self._clients.clear()
        log.info("[rtu_server] 已停止")

    # ── 连接处理 ──

    async def _handle_connection(self, reader: asyncio.StreamReader,
                                  writer: asyncio.StreamWriter):
        peername = f"{writer.get_extra_info('peername')}"
        client = DTUClient(writer=writer, peername=peername,
                           connected_at=time.time())
        self._clients[peername] = client
        log.info(f"[rtu_server] 连接: {peername}")

        try:
            # ── 对标 Erlang init/2: 首次数据 = 注册报文 ──
            buf = b''
            while self._running:
                try:
                    data = await asyncio.wait_for(
                        reader.read(self.max_frame_size),
                        timeout=self.frame_timeout + 30)  # 连接超时 30s
                except asyncio.TimeoutError:
                    break

                if not data:
                    break

                buf += data
                hex_buf = buf.hex()
                log.debug(f"[rtu_server] {peername} recv {len(data)}B total={len(buf)}B hex={hex_buf[:40]}...")

                # 处理注册 (未注册客户端的第一包数据)
                if not client.registered:
                    result = await self._handle_registration(buf, client)
                    if result:
                        client.registered = True
                        log.info(f"[rtu_server] {peername} 注册成功 devaddr={client.devaddr}")
                        buf = b''  # 注册报文已消费
                    else:
                        log.warning(f"[rtu_server] {peername} 注册失败, 报文不匹配")
                        buf = b''
                    continue

                # 已注册: 处理数据帧
                while len(buf) >= 4:  # 最小 Modbus RTU 帧: addr+func+2crc
                    frame, buf = self._extract_frame(buf)
                    if frame:
                        await self._handle_frame(frame, client)
                    else:
                        break

        except (ConnectionResetError, asyncio.IncompleteReadError, OSError):
            pass
        finally:
            await self._handle_disconnect(client)

    # ── 注册处理 (对标 handle_info {tcp, Buff} register=false) ──

    async def _handle_registration(self, buff: bytes, client: DTUClient) -> bool:
        """处理 DTU 注册报文, 返回是否注册成功"""
        if self.regtype == "RegisterByIp":
            return await self._register_by_ip(client)

        elif self.regtype == "RegisterByPort":
            return await self._register_by_port(buff, client)

        elif self.regtype == "RegisterByRegular":
            return await self._register_by_regular(buff, client)

        else:
            log.warning(f"[rtu_server] 未知注册类型: {self.regtype}")
            return False

    async def _register_by_ip(self, client: DTUClient) -> bool:
        """IP 注册: 用客户端 IP 作为 devaddr"""
        ip = client.peername.split(":")[0].strip("()'")
        client.devaddr = ip.replace(".", "_")
        client.product_id = self.product_id or "default"
        await self._do_register(client)
        return True

    async def _register_by_port(self, buff: bytes, client: DTUClient) -> bool:
        """端口注册: devaddr = 报文 + "-" + 服务器端口"""
        try:
            ascii_buff = self._to_ascii(buff)
        except Exception:
            return False

        if not ascii_buff:
            return False

        client.devaddr = f"{ascii_buff}-{self.port}"
        client.product_id = self.product_id or "default"
        await self._do_register(client)
        return True

    async def _register_by_regular(self, buff: bytes, client: DTUClient) -> bool:
        """正则注册: 用正则匹配注册报文 (对标 process_regular_registration_packet)"""
        try:
            ascii_buff = self._to_ascii(buff)
        except Exception:
            return False

        if not ascii_buff:
            return False

        # 将通配符模式转为正则 (Erlang: modbus_util:convert_pattern)
        pattern = self._pattern_to_regex(self.regular) if self.regular else r".*"
        log.debug(f"[rtu_server] 正则匹配: pattern={pattern} buff={ascii_buff}")

        if not re.match(pattern, ascii_buff):
            return False

        # 按 "-" 分割取第一部分作为产品名
        parts = ascii_buff.split("-")
        product_name = parts[0] if parts else ascii_buff

        # 匹配产品 (简化: 使用配置的 product_id, 或从报文推断)
        client.product_id = self.product_id or product_name
        client.devaddr = ascii_buff
        await self._do_register(client)
        return True

    async def _do_register(self, client: DTUClient):
        """执行设备注册 — 对标 dgiot_modbus:register_client"""
        # 生成 MD5 device_id (对标 dgiot_parse_id:get_deviceid)
        client.device_id = self._make_device_id(client.product_id, client.devaddr)

        # 推送注册事件
        from ..eventbus import EventBus
        bus = EventBus()
        bus.emit("dtu.device_registered",
                 devaddr=client.devaddr,
                 product_id=client.product_id,
                 device_id=client.device_id,
                 peername=client.peername)

        log.info(f"[rtu_server] 设备注册: devaddr={client.devaddr} "
                 f"product={client.product_id} device={client.device_id}")

    # ── 数据帧处理 (对标 handle_info {tcp, Buff} register=true) ──

    async def _handle_frame(self, frame: bytes, client: DTUClient):
        """处理已注册设备的 Modbus RTU 数据帧"""
        hex_frame = frame.hex()
        log.debug(f"[rtu_server] {client.devaddr} frame: {hex_frame[:40]}...")

        # 构建 Things (对标 build_data_things)
        things = {
            "raw_data": frame,
            "data_type": "modbus_rtu",
            "product_id": client.product_id,
            "dtu_addr": client.devaddr,
            "channel_id": f"ch_dtu_{self.port}",
            "timestamp": int(time.time() * 1000),
        }

        # 推送到 EventBus → 后续由 modbus_rtu decoder + task channel 处理
        from ..eventbus import EventBus
        bus = EventBus()
        bus.emit("dtu.raw_frame", **things)

        # 对标 Erlang: send_to_task_channel → $dg/thing/{product}/{devaddr}/properties/report
        topic = (f"$dg/thing/{client.product_id}/"
                 f"{client.devaddr}/properties/report")
        bus.emit("task.channel_report",
                 topic=topic,
                 device_id=client.device_id,
                 product_id=client.product_id,
                 devaddr=client.devaddr,
                 things=things)

    # ── 断开处理 (对标 terminate/2) ──

    async def _handle_disconnect(self, client: DTUClient):
        log.info(f"[rtu_server] 断开: {client.peername} devaddr={client.devaddr}")
        self._clients.pop(client.peername, None)

        if client.registered:
            from ..eventbus import EventBus
            bus = EventBus()
            bus.emit("dtu.device_disconnected",
                     devaddr=client.devaddr,
                     product_id=client.product_id,
                     device_id=client.device_id)

        try:
            client.writer.close()
        except Exception:
            pass

    # ── 工具函数 ──

    def _extract_frame(self, buf: bytes) -> Tuple[Optional[bytes], bytes]:
        """从缓冲区提取一个完整 Modbus RTU 帧
        Modbus RTU 帧格式: [addr 1B][func 1B][data N bytes][crc 2B]
        最小帧长度: 4 bytes
        帧间识别: 通过 CRC 校验或固定长度
        """
        if len(buf) < 4:
            return None, buf

        # 简化: 读取首字节(addr) + 功能码判断长度
        func = buf[1]
        if func in (0x01, 0x02, 0x03, 0x04):
            # 读寄存器: addr+func+byte_count+data+crc
            expected_data_len = buf[2] if len(buf) > 2 else 0
            frame_len = 3 + expected_data_len + 2  # addr+func+byte+data+crc
        elif func in (0x05, 0x06):
            frame_len = 8  # 写单个: addr+func+reg+val+crc
        elif func in (0x0F, 0x10):
            frame_len = 8  # 写多个: 最小长度 (实际由 data 长度定)
            if len(buf) > 6:
                frame_len = 7 + buf[6]  # addr+func+reg+count+byte+data+crc
        elif func == 0x17:
            frame_len = 11  # Read/Write: addr+func+read_reg+read_count+write_reg+write_count+byte+data+crc
        else:
            # 未知功能码: 尝试 CRC 校验
            frame_len = self._guess_frame_by_crc(buf)

        if frame_len > len(buf):
            return None, buf  # 帧不完整, 等待更多数据

        frame = buf[:frame_len]

        # CRC 校验 (简单验证)
        if len(frame) >= 4:
            calculated_crc = self._crc16(frame[:-2])
            received_crc = struct.unpack('<H', frame[-2:])[0]
            if calculated_crc != received_crc:
                log.debug(f"[rtu_server] CRC mismatch: calc={calculated_crc:04x} recv={received_crc:04x}")
                # CRC 不匹配可能是粘包, 尝试偏移
                return None, buf[1:]  # 跳过一个字节重试

        return frame, buf[frame_len:]

    def _guess_frame_by_crc(self, buf: bytes) -> int:
        """通过 CRC 校验推测帧长度 (粘包处理)"""
        # 最小 4 bytes, 最大 256 bytes
        for frame_len in range(4, min(len(buf), self.max_frame_size) + 1):
            frame = buf[:frame_len]
            crc = self._crc16(frame[:-2])
            received = struct.unpack('<H', frame[-2:])[0]
            if crc == received:
                return frame_len
        return len(buf)  # 未找到, 返回全部

    @staticmethod
    def _crc16(data: bytes) -> int:
        """Modbus CRC-16"""
        crc = 0xFFFF
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 1:
                    crc = (crc >> 1) ^ 0xA001
                else:
                    crc >>= 1
        return crc & 0xFFFF

    @staticmethod
    def _to_ascii(buff: bytes) -> str:
        """将 bytes 转为 ASCII (hex decode if needed) — 对标 Erlang is_hex_string"""
        try:
            # 尝试 hex decode (Erlang: dgiot_utils:hex_to_binary)
            return bytes.fromhex(buff.decode('ascii', errors='ignore')).decode('ascii', errors='ignore')
        except Exception:
            return buff.decode('ascii', errors='ignore')

    @staticmethod
    def _pattern_to_regex(pattern: str) -> str:
        """将通配符模式转为正则 (对标 Erlang: modbus_util:convert_pattern)
        ** → .*  ,  * → [^-]* (不含横杠)"""
        p = pattern.replace("**", "___DOUBLE_STAR___")
        p = p.replace("*", "[^-]*")
        p = p.replace("___DOUBLE_STAR___", ".*")
        p = p.replace("-", r"\-")  # 横杠本身是字面量
        return "^" + p + "$"

    @staticmethod
    def _make_device_id(product_id: str, devaddr: str) -> str:
        """生成 MD5 设备 ID — 对标 dgiot_parse_id:get_deviceid"""
        import hashlib
        digest = hashlib.md5(f"Device{product_id}{devaddr}".encode()).hexdigest()
        return digest[:10]  # 对标 Erlang: 取前10位 hex

    def snapshot(self) -> dict:
        return {
            "port": self.port,
            "regtype": self.regtype,
            "clients": len(self._clients),
            "registered": sum(1 for c in self._clients.values() if c.registered),
            "running": self._running,
        }


# ═══════════════════════════════════════════
# 自注册为通道插件 (一个通道 = 一个插件)
# ═══════════════════════════════════════════

def _register_plugin():
    """模块导入时自动注册为通道插件"""
    _server: Optional[ModbusRtuTcpServer] = None

    async def _start():
        nonlocal _server
        cfg = {"port": 20110, "regtype": "RegisterByRegular", "dtutype": "DGIOT"}
        _server = ModbusRtuTcpServer(cfg)
        await _server.start()

    async def _stop():
        if _server:
            await _server.stop()

    def _health():
        if _server:
            return _server.snapshot()
        return {"status": "not_started"}

    try:
        from ..channel_registry import register_channel_plugin, CType
        register_channel_plugin(
            channel_id="ch_dtu_server",
            cType=CType.DTU,
            name="DTU 透传服务器 (Modbus RTU over TCP)",
            version="1.0",
            description="Modbus RTU over TCP 透传服务器, 对标 dgiot_modbus_rtu_server. "
                        "支持 RegisterByIp/RegisterByPort/RegisterByRegular 三种注册模式",
            config={
                "port": 20110,
                "regtype": "RegisterByRegular",
                "regular": "",
                "dtutype": "DGIOT",
                "isEnable": True,
            },
            on_start=_start,
            on_stop=_stop,
            on_health=_health,
            protocol="modbus-rtu-over-tcp",
            endpoint="0.0.0.0:20110",
        )
        log.info("[modbus_rtu_server] 插件已注册: ch_dtu_server")
    except Exception as e:
        log.warning(f"[modbus_rtu_server] 插件注册失败: {e}")


_register_plugin()


# ═══════════════════════════════════════════
# DTU 模拟器 (对标 dgiot_modbus_dtu_simulator.erl)
# ═══════════════════════════════════════════

class DTUSimulator:
    """DTU 模拟器 — 测试用"""

    def __init__(self, host="127.0.0.1", port=20110):
        self.host = host
        self.port = port
        self._reader = None
        self._writer = None

    async def connect(self) -> bool:
        """连接到 Modbus RTU 服务器"""
        try:
            self._reader, self._writer = await asyncio.open_connection(
                self.host, self.port)
            log.info(f"[dtu_sim] 已连接 {self.host}:{self.port}")
            return True
        except Exception as e:
            log.error(f"[dtu_sim] 连接失败: {e}")
            return False

    async def send_registration(self, dev_id="wrj_dm_zqy"):
        """发送注册报文 (对标 Erlang: wrj_dm_zqy)"""
        if not self._writer:
            return False
        data = dev_id.encode()
        self._writer.write(data)
        await self._writer.drain()
        log.info(f"[dtu_sim] 注册报文: {dev_id}")
        return True

    async def send_raw_frame(self, hex_str: str):
        """发送原始 Modbus RTU 帧 (hex string)"""
        if not self._writer:
            return False
        data = bytes.fromhex(hex_str.replace(" ", ""))
        self._writer.write(data)
        await self._writer.drain()
        log.debug(f"[dtu_sim] 数据帧: {len(data)}B")
        return True

    async def send_report_data(self):
        """发送传感器上报数据 (对标 Erlang test data)"""
        return await self.send_raw_frame(
            "0103600C190E130311003902B20002088000000000000000000000"
            "0000006A009E9FB505920000000000000000000000000000000000"
            "0000000000000000000000000000000000002FFDEDF1F8868AF700"
            "0000000000000000000000000000004365000000007DB3"
        )

    async def disconnect(self):
        if self._writer:
            self._writer.close()
            try:
                await self._writer.wait_closed()
            except Exception:
                pass
        log.info("[dtu_sim] 已断开")

    async def test_full_flow(self):
        """完整测试流程 (对标 test_full_flow)"""
        log.info("[dtu_sim] === 完整测试流程 ===")
        if not await self.connect():
            return False
        await asyncio.sleep(0.5)
        await self.send_registration("wrj_dm_zqy")
        await asyncio.sleep(1.0)
        await self.send_report_data()
        await asyncio.sleep(1.0)
        await self.disconnect()
        log.info("[dtu_sim] === 测试完成 ===")
        return True
