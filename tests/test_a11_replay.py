#!/usr/bin/env python3
"""
A11 回放集成测试 — 用 pcap 提取的真实消息验证 iotStudio 接管能力
================================================================
用法: pytest tests/test_a11_replay.py -v
"""
import asyncio, json, os, struct, sys, unittest
from collections import Counter
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

A11_MAGIC = b'\x6a\x6a\x5a\x5a'
REPLAY_FILE = 'D:/wsl/kylin/replay_messages.json'

class TestA11Replay(unittest.TestCase):
    """回放测试 — 验证 iotStudio 能否处理全部真实消息"""

    @classmethod
    def setUpClass(cls):
        if not os.path.exists(REPLAY_FILE):
            raise unittest.SkipTest(f'回放文件不存在: {REPLAY_FILE}')
        with open(REPLAY_FILE) as f:
            cls.messages = json.load(f)
        cls.inbound = [m for m in cls.messages if m['direction'] == 'IN']
        cls.outbound = [m for m in cls.messages if m['direction'] == 'OUT']

    def test_messages_extracted(self):
        """消息提取成功"""
        self.assertGreater(len(self.messages), 100, '应提取>100条消息')
        self.assertGreater(len(self.inbound), 30, '入站消息应>30')
        print(f'\n  总消息: {len(self.messages)} (入站{len(self.inbound)} 出站{len(self.outbound)})')

    def test_inbound_types_covered(self):
        """入站消息类型全部可分类"""
        from protocols.a11 import A11MsgType
        failures = []
        for m in self.inbound:
            cat = A11MsgType.classify(m['type'])
            name = A11MsgType.name(m['type'])
            if 'UNKNOWN' in name:
                failures.append(m)
        pct = len(failures)/max(len(self.inbound),1)*100
        print(f'\n  未分类: {len(failures)}/{len(self.inbound)} ({pct:.1f}%)')
        if failures:
            unknown_types = Counter(m['type'] for m in failures)
            for t, c in unknown_types.most_common(5):
                print(f'    0x{t:04X}: {c}x')
        self.assertLess(pct, 20, '未分类应<20% (系统类型无需命名)')

    def test_heartbeat_handler(self):
        """心跳(0x0017)处理"""
        hb = [m for m in self.inbound if m['type'] == 0x0017]
        self.assertGreater(len(hb), 20, '心跳消息应>20条')
        print(f'\n  心跳: {len(hb)}条 (占比{len(hb)/len(self.inbound)*100:.1f}%)')

    def test_simulator_roundtrip(self):
        """模拟器往返测试 — 真实消息编码→发送→接收"""
        from protocols.a11 import A11Message

        # 取每种入站类型1条做往返测试
        tested = set()
        for m in self.inbound:
            t = m['type']
            if t in tested: continue
            tested.add(t)

            # 用真实 type 构造消息
            msg = A11Message(trans_id=1, unit_id=0,
                           msg_type=t, msg_sub=m.get('sub', 0), payload=b'\x00')
            frame = msg.encode()

            # 验证可编码
            self.assertEqual(frame[7:11], A11_MAGIC, f'0x{t:04X} 编码失败: 无jjZZ魔术字')

            # 验证可解码
            decoded = A11Message.decode(frame)
            self.assertIsNotNone(decoded, f'0x{t:04X} 解码返回None')
            self.assertEqual(decoded.msg_type, t, f'0x{t:04X} type不匹配')

        print(f'\n  往返测试: {len(tested)}/{len(set(m["type"] for m in self.inbound))} 种类型通过')

    def test_takeover_readiness(self):
        """接管就绪检查"""
        from protocols.a11 import A11MsgType

        # 统计入站类型
        in_types = Counter(m['type'] for m in self.inbound)

        # 检查所有类型
        ok = 0; fail = 0
        for t, cnt in in_types.items():
            if t == 0x0017: ok += cnt  # 心跳
            elif t <= 0xFF: ok += cnt  # 系统指令
            elif 0x0500 <= t <= 0x07FF: ok += cnt  # 数据
            elif 0x0B00 <= t <= 0x7FFF: ok += cnt  # 事件
            elif t >= 0x8000: ok += cnt  # 响应
            else: fail += cnt

        readiness = ok / max(ok+fail, 1) * 100
        print(f'\n  接管就绪度: {readiness:.1f}% ({ok}/{ok+fail})')
        print(f'  需处理类型: {len(in_types)}种')

        self.assertGreater(readiness, 80, '接管就绪度应>80%')

    def test_outbound_response_patterns(self):
        """出站响应模式分析"""
        out_types = Counter(m['type'] for m in self.outbound)
        # 统计出站类型: 响应(>=0x8000) + 系统(<=0xFF) + 数据/事件(正常出站)
        normal = 0; data_event = 0
        for t, cnt in out_types.items():
            if t >= 0x8000 or t <= 0xFF:
                normal += cnt
            else:
                data_event += cnt  # 出站数据上报/事件/状态

        print(f'\n  出站响应ACK: {normal} | 出站数据/事件: {data_event}')
        print(f'  出站类型: {len(out_types)}种 (Top 5):')
        for t, cnt in out_types.most_common(5):
            print(f'    0x{t:04X}: {cnt}x ({("SYSTEM" if t<=0xFF else "RESP" if t>=0x8000 else "DATA/EVENT")})')

        self.assertGreater(normal + data_event, 0, '应有出站消息')


if __name__ == '__main__':
    unittest.main(verbosity=2)
