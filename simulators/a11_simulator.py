#!/usr/bin/env python3
"""
A11 协议模拟器 — 模拟 DG-IoT 网关行为
======================================
基于 7.3.pcapng 逆向的协议格式，可独立运行

用法:
  # 启动模拟器 (默认 :8889)
  python simulators/a11_simulator.py

  # 自定义端口
  python simulators/a11_simulator.py --port 18889

  # 从 pcap 加载真实消息回放
  python simulators/a11_simulator.py --replay D:/wsl/kylin/7.3.pcapng
"""

import asyncio
import struct
import time
import sys
import os
import argparse
import logging
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger('a11-sim')

# ===== A11 协议常量 =====
A11_MAGIC = b'\x6a\x6a\x5a\x5a'
A11_DEFAULT_PORT = 8889

@dataclass
class A11Msg:
    trans_id: int = 1; unit_id: int = 0
    msg_type: int = 0x0017; msg_sub: int = 0
    payload: bytes = b''
    def encode(self) -> bytes:
        pdu = A11_MAGIC + struct.pack('<HH', self.msg_type, self.msg_sub) + self.payload
        return struct.pack('>HHHB', self.trans_id, 0, len(pdu)+1, self.unit_id) + pdu
    @classmethod
    def decode(cls, data: bytes) -> Optional['A11Msg']:
        if len(data) < 15 or data[7:11] != A11_MAGIC: return None
        tid, pid, mblen, uid = struct.unpack('>HHHB', data[:7])
        t = struct.unpack('<H', data[11:13])[0]
        s = struct.unpack('<H', data[13:15])[0]
        return cls(tid, uid, t, s, data[15:15+mblen-9])

# ===== 模拟器 =====
class A11Simulator:
    """A11 协议模拟器 — 模拟 DG-IoT 网关"""

    def __init__(self, host='0.0.0.0', port=A11_DEFAULT_PORT):
        self.host = host; self.port = port
        self.server: Optional[asyncio.Server] = None
        self.clients: Dict[int, asyncio.StreamWriter] = {}
        self.stats = defaultdict(int)
        self.replay_msgs: List[A11Msg] = []

    # ---- 消息工厂 ----
    def make_heartbeat(self, tid=1) -> A11Msg:
        """心跳响应 — type=0x0017, 含模拟采样值"""
        import random
        temp = random.uniform(25.0, 35.0)    # 模拟温度 25-35°C
        press = random.uniform(0.5, 2.5)      # 模拟压力 0.5-2.5 MPa
        payload = struct.pack('<ff', temp, press)
        return A11Msg(tid, 0, 0x0017, 0, payload)

    def make_register_ack(self, tid=1) -> A11Msg:
        """设备注册确认 — type=0x0506 → 响应 0xca99"""
        return A11Msg(tid, 0, 0xca99, 0, b'\x01\x00\x00\x00')

    def make_data_response(self, tid=1) -> A11Msg:
        """数据查询响应 — 返回模拟测点值"""
        import random
        data = struct.pack('<fff',
            random.uniform(25.0, 35.0),      # 温度
            random.uniform(0.5, 2.5),         # 压力
            random.uniform(10.0, 50.0))        # 流量
        return A11Msg(tid, 0, 0x0539, 0, data)

    def make_alarm(self, tid=1) -> A11Msg:
        """告警消息"""
        payload = b'\x01' + struct.pack('<f', 85.5)  # 高温告警
        return A11Msg(tid, 0, 0x56b6, 0, payload)

    def make_response(self, tid, original_type) -> A11Msg:
        """通用响应"""
        return A11Msg(tid, 0, 0xca99, 0, b'\x00\x00')

    # ---- 回复策略 ----
    def handle_message(self, msg: A11Msg) -> Optional[A11Msg]:
        """根据收到的消息类型决定回复"""
        t = msg.msg_type

        if t == 0x0017:   # 心跳
            return self.make_heartbeat(msg.trans_id)
        elif t == 0x0506:  # 注册
            return self.make_register_ack(msg.trans_id)
        elif t in (0x0539, 0x056c):  # 数据查询
            return self.make_data_response(msg.trans_id)
        elif t in (0x56b6, 0x04b2, 0x04f5, 0x5ec4):  # 告警/事件 → ACK
            return A11Msg(msg.trans_id, 0, 0xca99, 0, b'\x01')
        elif t == 0x0030:  # 系统查询
            return self.make_response(msg.trans_id, t)
        elif t <= 0xff:    # 系统指令 → ACK
            return A11Msg(msg.trans_id, 0, 0xca99, 0, b'\x00')
        elif t >= 0x8000:  # 服务端响应 → 不应答
            return None
        # 未知类型 → 通用 ACK
        return A11Msg(msg.trans_id, 0, 0xca99, 0, b'\x00')

    # ---- 客户端处理 ----
    async def handle_client(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        addr = writer.get_extra_info('peername')
        cid = id(writer)
        logger.info(f'[连接] {addr}')
        buffer = b''

        try:
            while True:
                data = await reader.read(65535)
                if not data:
                    break
                buffer += data

                # 解析 A11 消息
                while len(buffer) >= 15:
                    msg = A11Msg.decode(buffer)
                    if msg is None:
                        # 跳过1字节继续找
                        buffer = buffer[1:]
                        continue

                    msg_len = struct.unpack('>H', buffer[4:6])[0] + 6
                    if len(buffer) < msg_len:
                        break

                    self.stats[f'rx_0x{msg.msg_type:04x}'] += 1
                    logger.debug(f'  RX 0x{msg.msg_type:04X} tid={msg.trans_id}')

                    # 生成回复
                    reply = self.handle_message(msg)
                    if reply:
                        frame = reply.encode()
                        writer.write(frame)
                        await writer.drain()
                        self.stats[f'tx_0x{reply.msg_type:04x}'] += 1
                        logger.debug(f'  TX 0x{reply.msg_type:04X} tid={reply.trans_id}')

                    buffer = buffer[msg_len:]

        except Exception as e:
            logger.error(f'[{addr}] 异常: {e}')
        finally:
            logger.info(f'[断开] {addr}')
            try: writer.close()
            except: pass

    # ---- 回放模式 ----
    async def replay_from_pcap(self, pcap_path: str):
        """从 pcap 文件回放 A11 消息"""
        try:
            from scapy.all import sniff, IP, TCP
        except ImportError:
            logger.error("回放模式需要 scapy: pip install scapy")
            return

        logger.info(f'从 pcap 加载: {pcap_path}')
        pkts = sniff(offline=pcap_path, quiet=True)
        for p in pkts:
            if IP in p and TCP in p and p[TCP].payload:
                if p[TCP].dport == 8889:
                    msgs = self._parse_stream(bytes(p[TCP].payload))
                    self.replay_msgs.extend(msgs)

        logger.info(f'加载 {len(self.replay_msgs)} 条消息用于回放')
        self.stats['replay_loaded'] = len(self.replay_msgs)

    def _parse_stream(self, data: bytes) -> List[A11Msg]:
        msgs = []
        pos = 0
        while pos + 15 <= len(data):
            if data[pos+7:pos+11] == A11_MAGIC:
                tid, pid, mblen, uid = struct.unpack('>HHHB', data[pos:pos+7])
                if pid == 0 and 9 <= mblen <= 4096:
                    t = struct.unpack('<H', data[pos+11:pos+13])[0]
                    s = struct.unpack('<H', data[pos+13:pos+15])[0]
                    msgs.append(A11Msg(tid, uid, t, s, data[pos+15:pos+6+mblen]))
                    pos += 6 + mblen
                    continue
            pos += 1
        return msgs

    # ---- 启动/停止 ----
    async def start(self):
        self.server = await asyncio.start_server(
            self.handle_client, self.host, self.port)
        logger.info(f'[A11模拟器] 监听 {self.host}:{self.port}')
        logger.info(f'  支持: 心跳(0x0017) 注册(0x0506) 数据(0x0539) 告警(0x56b6)')

    async def stop(self):
        if self.server:
            self.server.close()
            await self.server.wait_closed()
        logger.info(f'[A11模拟器] 已停止. 统计: {dict(self.stats)}')


# ===== 测试客户端 =====
async def test_client(host='127.0.0.1', port=A11_DEFAULT_PORT):
    """测试客户端 — 连接模拟器并验证协议"""
    logger.info(f'[测试] 连接 {host}:{port}...')
    reader, writer = await asyncio.open_connection(host, port)

    tests = [
        ('心跳', A11Msg(1, 0, 0x0017, 0, b''), 'HEARTBEAT'),
        ('注册', A11Msg(2, 0, 0x0506, 0, b'\x01\x00'), 'REGISTER'),
        ('数据查询', A11Msg(3, 0, 0x0539, 0, b'\x00\x01\x00\x00'), 'DATA'),
        ('系统查询', A11Msg(4, 0, 0x0030, 0, b''), 'SYSTEM'),
        ('告警', A11Msg(5, 0, 0x56b6, 0, b'\x01\x55\x55\x00\x00'), 'ALARM'),
    ]

    results = []
    for name, msg, expected in tests:
        frame = msg.encode()
        writer.write(frame)
        await writer.drain()
        logger.info(f'  发送 {name} (0x{msg.msg_type:04X})...')

        try:
            resp = await asyncio.wait_for(reader.read(4096), timeout=3.0)
            decoded = A11Msg.decode(resp)
            if decoded:
                ok = 'OK' if decoded.msg_type in (0x0017, 0xca99, 0x0539) else f'type=0x{decoded.msg_type:04X}'
                results.append((name, True, ok))
                logger.info(f'    回复: {ok} len={len(resp)}')
            else:
                results.append((name, False, f'decode failed: {resp[:20].hex()}'))
        except asyncio.TimeoutError:
            results.append((name, False, 'timeout (no response)'))

    writer.close()
    await writer.wait_closed()

    # 结果汇总
    sep = '=' * 50
    print(f'\n{sep}')
    print('  A11 模拟器测试结果')
    print(sep)
    passed = 0
    for name, ok, detail in results:
        status = 'OK' if ok else 'FAIL'
        print(f'  [{status}] {name:10s} — {detail}')
        if ok: passed += 1
    print(f'  通过: {passed}/{len(results)}')
    return passed == len(results)


# ===== 入口 =====
if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='A11 协议模拟器')
    ap.add_argument('--port', type=int, default=A11_DEFAULT_PORT)
    ap.add_argument('--host', default='0.0.0.0')
    ap.add_argument('--replay', help='从 pcap 加载消息回放')
    ap.add_argument('--test', action='store_true', help='自测模式')
    args = ap.parse_args()

    async def main():
        sim = A11Simulator(args.host, args.port)
        if args.replay:
            await sim.replay_from_pcap(args.replay)
        await sim.start()

        if args.test:
            await asyncio.sleep(0.5)
            ok = await test_client('127.0.0.1', args.port)
            result = '全部通过' if ok else '有失败'
            print(f'\n模拟测试: {result}')
        else:
            print(f'\n模拟器已启动: {args.host}:{args.port}')
            print('按 Ctrl+C 停止')
            try:
                await asyncio.Event().wait()
            except KeyboardInterrupt:
                pass

        await sim.stop()

    asyncio.run(main())
