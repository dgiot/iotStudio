#!/usr/bin/env python3
"""A11 协议适配器单元测试"""
import sys, os, struct, asyncio, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from protocols.a11 import (
    A11Message, A11MsgType, A11Parser,
    A11Config, A11ProtocolAdapter
)

A11_MAGIC = b'\x6a\x6a\x5a\x5a'


class TestA11Message(unittest.TestCase):
    """消息编解码测试"""

    def test_encode_decode_roundtrip(self):
        """编解码往返"""
        msg = A11Message(trans_id=1, unit_id=0,
                         msg_type=A11MsgType.HEARTBEAT, msg_sub=0, payload=b'hello')
        frame = msg.encode()
        # MBAP(7) + jjZZ(4) + type(2) + sub(2) + payload(5) = 20
        self.assertEqual(len(frame), 20)
        # 验证 MBAP
        tid, pid, length, uid = struct.unpack('>HHHB', frame[:7])
        self.assertEqual(tid, 1)
        self.assertEqual(pid, 0)
        self.assertEqual(uid, 0)
        # 验证 jjZZ
        self.assertEqual(frame[7:11], A11_MAGIC)
        # 解码
        decoded = A11Message.decode(frame)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded.msg_type, A11MsgType.HEARTBEAT)
        self.assertEqual(decoded.payload, b'hello')

    def test_batch_decode(self):
        """批处理解码 — 单 PDU 含 2 条消息"""
        pdu = (A11_MAGIC + struct.pack('<HH', 0x0017, 0) + b'data1' +
               A11_MAGIC + struct.pack('<HH', 0x0539, 0) + b'data2')
        length = len(pdu) + 1
        frame = struct.pack('>HHHB', 1, 0, length, 0) + pdu
        msgs = A11Message.decode_batch(frame)
        self.assertEqual(len(msgs), 2)
        self.assertEqual(msgs[0].type_name, 'HEARTBEAT')
        self.assertEqual(msgs[0].payload, b'data1')
        self.assertEqual(msgs[1].type_name, 'DATA_QUERY')
        self.assertEqual(msgs[1].payload, b'data2')

    def test_invalid_frame(self):
        """无效帧返回 None"""
        self.assertIsNone(A11Message.decode(b'garbage_data_no_magic'))
        self.assertIsNone(A11Message.decode(b'\x00' * 30))

    def test_type_classification(self):
        """类型分类"""
        tests = [
            (0x0017, 'SYSTEM'), (0x0506, 'REGISTER'), (0x0539, 'QUERY'),
            (0x024d, 'QUERY'), (0x0291, 'STATUS'), (0x56b6, 'EVENT'),
            (0xca99, 'RESPONSE'),
        ]
        for t, expected_cat in tests:
            self.assertEqual(A11MsgType.classify(t), expected_cat,
                             f'0x{t:04X} should be {expected_cat}')


class TestA11Config(unittest.TestCase):
    """配置测试"""

    def test_default_config(self):
        c = A11Config(device_id='test-001')
        self.assertEqual(c.device_id, 'test-001')
        self.assertEqual(c.host, '127.0.0.1')
        self.assertEqual(c.port, 8889)
        self.assertEqual(c.protocol_type, 'a11')
        self.assertEqual(c.heartbeat_interval, 5)

    def test_custom_config(self):
        c = A11Config(device_id='rtu-oil-001', host='192.168.10.130',
                      port=8889, unit_id=1, heartbeat_interval=10,
                      dds_enabled=True)
        self.assertEqual(c.host, '192.168.10.130')
        self.assertEqual(c.unit_id, 1)
        self.assertEqual(c.heartbeat_interval, 10)
        self.assertTrue(c.dds_enabled)


class TestA11Parser(unittest.TestCase):
    """解析器测试"""

    def test_feed_single_message(self):
        parser = A11Parser()
        pdu = A11_MAGIC + struct.pack('<HH', 0x0017, 0) + b'\x00' * 4
        frame = struct.pack('>HHHB', 1, 0, len(pdu)+1, 0) + pdu
        msgs = parser.feed(frame)
        self.assertEqual(len(msgs), 1)
        self.assertEqual(parser.type_stats[0x0017], 1)

    def test_empty_feed(self):
        parser = A11Parser()
        msgs = parser.feed(b'garbage')
        self.assertEqual(len(msgs), 0)
        self.assertEqual(len(parser.type_stats), 0)


class TestA11ProtocolAdapter(unittest.TestCase):
    """适配器集成测试 (模拟连接)"""

    def test_adapter_creation(self):
        config = A11Config(device_id='test-001', host='127.0.0.1', port=9999)
        adapter = A11ProtocolAdapter(config)
        self.assertEqual(adapter.config.device_id, 'test-001')
        self.assertFalse(adapter._connected)

    def test_security_report(self):
        config = A11Config(device_id='test-001', host='192.168.10.130')
        adapter = A11ProtocolAdapter(config)
        report = adapter.security_report()
        self.assertIn('total_events', report)
        self.assertIn('risk_assessment', report)
        self.assertIn('recommendations', report)
        self.assertTrue(len(report['recommendations']) >= 3)


class TestA11Integration(unittest.TestCase):
    """集成测试 — 用 pcap 数据"""

    @classmethod
    def setUpClass(cls):
        cls.pcap_path = 'D:/wsl/kylin/7.3.pcapng'
        if not os.path.exists(cls.pcap_path):
            raise unittest.SkipTest(f'pcap not found: {cls.pcap_path}')

    def test_parse_pcap(self):
        parser = A11Parser()
        msgs = parser.parse_pcap(self.pcap_path)
        self.assertGreater(len(msgs), 100, 'Should parse >100 messages')
        self.assertGreater(len(parser.type_stats), 10, 'Should find >10 types')

    def test_heartbeat_present(self):
        parser = A11Parser()
        parser.parse_pcap(self.pcap_path)
        self.assertIn(A11MsgType.HEARTBEAT, parser.type_stats,
                      '0x0017 heartbeat must be present')
        self.assertGreater(parser.type_stats[A11MsgType.HEARTBEAT], 100,
                           'Heartbeat should be >100 messages')

    def test_decode_all_types(self):
        """所有类型都能正确分类"""
        parser = A11Parser()
        parser.parse_pcap(self.pcap_path)
        for t in parser.type_stats:
            cat = A11MsgType.classify(t)
            self.assertIn(cat, ['SYSTEM', 'REGISTER', 'QUERY', 'DATA',
                                'STATUS', 'EVENT', 'RESPONSE'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
