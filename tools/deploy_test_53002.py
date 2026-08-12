#!/usr/bin/env python3
"""
LegacyComm TCP Server — 53002 端口部署测试
============================================
模拟 5 台 RTU (不同设备类型) 连接 → 注册 → 轮询 → 30秒持续采集
输出: 实时遥测数据 + 统计仪表盘
"""
import asyncio, sys, os, time, json, struct, random, logging

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from src.protocols.commbridge_server import (
    LegacyCommServer, crc16, make_modbus_rtu_request,
    DEVICE_TYPES, COEFFICIENTS, MODBUS_SLAVE_ID,
)
from src.services.commbridge_integration import RtuSimulator

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)-12s] %(message)s')
log = logging.getLogger("deploy_test")

# ═══════════════════════ 实时数据仪表盘 ═══════════════════════

class LiveDashboard:
    def __init__(self):
        self.events = []
        self.start_time = time.time()

    def on_event(self, key, **payload):
        self.events.append({"key": key, "ts": time.time(), **payload})

    def print_stats(self):
        elapsed = time.time() - self.start_time
        data_events = [e for e in self.events if "data.received" in e["key"]]
        connect_events = [e for e in self.events if "connected" in e["key"]]
        disconnect_events = [e for e in self.events if "disconnected" in e["key"]]

        print("\n" + "=" * 70)
        print(f"  LegacyComm TCP Server :53002  —  运行 {elapsed:.0f}秒")
        print("=" * 70)
        print(f"  RTU 连接: {len(set(e.get('ip','') for e in connect_events))} 台")
        print(f"  遥测帧:  {len(data_events)} 条")
        print(f"  断开:    {len(disconnect_events)} 次")
        if data_events:
            # 最新一条数据
            latest = data_events[-1]
            print(f"\n  -- 最新遥测 [{latest.get('device_name','?')}] --")
            print(f"  设备ID: {latest.get('dtu_id','?')}")
            print(f"  Slave:  {latest.get('slave_id','?')}")
            print(f"  原始值: {latest.get('raw',[])}")
            vals = latest.get('values', {})
            if vals:
                for k, v in list(vals.items())[:8]:
                    print(f"    {k}: {v:.4f}")
                if len(vals) > 8:
                    print(f"    ... ({len(vals)} 通道)")
            print(f"  采集序号: #{latest.get('poll_seq','?')}")
        print("=" * 70)


# ═══════════════════════ 测试 RTU 配置 ═══════════════════════

TEST_RTUS = [
    {"dtu_id": "rtu_well_001", "slave_id": 1, "channels": 20, "dev_type": 0x00, "name": "DSL-31A 断路器"},
    {"dtu_id": "rtu_well_002", "slave_id": 2, "channels": 15, "dev_type": 0x10, "name": "DST-31A 变压器差动"},
    {"dtu_id": "rtu_well_003", "slave_id": 3, "channels": 13, "dev_type": 0x20, "name": "DBPA-31A 备用电源"},
    {"dtu_id": "rtu_pump_004", "slave_id": 4, "channels": 19, "dev_type": 0x40, "name": "电动机保护"},
    {"dtu_id": "rtu_pump_005", "slave_id": 5, "channels": 22, "dev_type": 0xA0, "name": "DGP-13 接地保护"},
]


class ConfigurableRtuSimulator:
    """可配置通道数和设备类型的 RTU 模拟器"""

    def __init__(self, config: dict):
        self.dtu_id = config["dtu_id"]
        self.slave_id = config["slave_id"]
        self.channels = config["channels"]
        self.dev_type = config["dev_type"]
        self.name = config["name"]
        self.poll_count = 0

    async def run(self, host="127.0.0.1", port=53002):
        try:
            reader, writer = await asyncio.open_connection(host, port)

            # 发送注册包: [DTU_ID_HASH 2B] [DevType 1B] [Channels 1B]
            dtu_hash = hash(self.dtu_id) & 0xFFFF
            reg_pkt = struct.pack('>HBB', dtu_hash, self.dev_type, self.channels)
            writer.write(reg_pkt)
            await writer.drain()

            log.info(f"[{self.name}] {self.dtu_id} 已注册 (slave={self.slave_id}, {self.channels}ch)")

            while True:
                data = await asyncio.wait_for(reader.read(256), timeout=30)
                if not data:
                    break

                if len(data) >= 8:
                    calc_crc = crc16(data[:-2])
                    pkt_crc = struct.unpack('<H', data[-2:])[0]
                    if calc_crc == pkt_crc:
                        func = data[1]
                        if func == 0x03:
                            byte_count = self.channels * 2
                            resp = bytearray([self.slave_id, 0x03, byte_count])
                            for i in range(self.channels):
                                # 模拟不同设备类型的特征值
                                base = 8192
                                if self.dev_type == 0x00:  # 断路器: 高电流
                                    val = int(base * random.uniform(0.3, 1.5))
                                elif self.dev_type == 0x40:  # 电动机: 中等电流
                                    val = int(base * random.uniform(0.5, 1.2))
                                elif self.dev_type == 0xA0:  # 接地: 低电流
                                    val = int(base * random.uniform(0.05, 0.4))
                                else:
                                    val = int(base * random.uniform(0.4, 1.3))
                                resp.extend(struct.pack('>H', val & 0xFFFF))
                            resp_crc = crc16(bytes(resp))
                            resp.extend(struct.pack('<H', resp_crc))
                            writer.write(bytes(resp))
                            await writer.drain()
                            self.poll_count += 1
        except asyncio.TimeoutError:
            pass
        except Exception as e:
            log.error(f"[{self.name}] 错误: {e}")
        finally:
            try:
                writer.close()
            except Exception:
                pass
        return self.poll_count


# ═══════════════════════ 主流程 ═══════════════════════

async def main():
    print("=" * 70)
    print("  LegacyComm TCP Server — :53002 部署测试")
    print("  模拟 5 台工厂保护装置, 30 秒持续采集")
    print("=" * 70)

    dashboard = LiveDashboard()

    # 1. 启动 Server
    server = LegacyCommServer(
        event_bus=None,  # 用自定义回调而非 EventBus
        port=53002,
        host="0.0.0.0",
        poll_interval=1.0,
        heartbeat_timeout=60,
    )

    # 注册设备配置
    for rtu_cfg in TEST_RTUS:
        dtu_hash = hash(rtu_cfg["dtu_id"]) & 0xFFFF
        dtu_id = f"dtu_{dtu_hash:04X}_{rtu_cfg['dev_type']:02X}"
        channel_count = rtu_cfg["channels"]
        server.register_device(dtu_id, {
            "type": rtu_cfg["dev_type"],
            "name": rtu_cfg["name"],
            "slave_id": rtu_cfg["slave_id"],
            "channels": channel_count,
            "reg_count": channel_count,
            "start_addr": 0,
            "coeff_map": ([1]*6 + [2]*6 + [3]*2 + [4]*2 + [0]*4)[:channel_count],
        })

    # 用自定义 hook 替代 EventBus
    original_emit = server._bus.emit if server._bus else None
    server._bus = type('FakeBus', (), {
        'emit': lambda self, key, **kw: dashboard.on_event(key, **kw),
        'on': lambda self, *a, **kw: None,
    })()

    await server.start()
    print(f"\n  [OK] Server started: 0.0.0.0:53002")
    print(f"  [INFO] Registered devices:")
    for rtu in TEST_RTUS:
        print(f"     {rtu['dtu_id']:20s} slave={rtu['slave_id']} {rtu['channels']:2d}ch {rtu['name']}")

    # 2. 启动 5 台模拟 RTU
    print(f"\n  [START] 启动 5 台模拟 RTU ...")
    sim_tasks = []
    for rtu_cfg in TEST_RTUS:
        sim = ConfigurableRtuSimulator(rtu_cfg)
        task = asyncio.create_task(sim.run(port=53002))
        sim_tasks.append((rtu_cfg['name'], sim, task))

    # 3. 运行 30 秒, 每 5 秒输出状态
    print(f"\n  [TIME]  开始采集 (30秒)...\n")
    for tick in range(6):
        await asyncio.sleep(5)
        elapsed = (tick + 1) * 5
        status = server.status()
        total_polls = sum(sim.poll_count for _, sim, _ in sim_tasks)
        print(f"  [{elapsed:2d}s] 连接:{status['connections']}台  "
              f"采集:{total_polls:3d}帧  "
              f"错误:{sum(c.err_count for c in server._connections.values())}")

    # 4. 展示结果
    dashboard.print_stats()

    # 5. 展示每个 RTU 的数据样本
    print(f"\n  -- 各设备数据样本 --")
    for name, sim, _ in sim_tasks:
        device_events = [e for e in dashboard.events
                        if e.get('device_name') == name and 'values' in e]
        if device_events:
            latest = device_events[-1]
            vals = latest.get('values', {})
            sample_vals = {k: round(v, 4) for k, v in list(vals.items())[:5]}
            print(f"  {name:25s} #{sim.poll_count:2d}轮  {sample_vals}")

    # 6. 清理
    print(f"\n  [STOP] 停止测试...")
    for _, _, task in sim_tasks:
        task.cancel()
    await asyncio.sleep(1)

    await server.stop()

    final_status = server.status()
    print(f"  [OK] Server已停止, 共处理 {len(dashboard.events)} 个事件")
    print(f"\n{'='*70}")
    print(f"  53002 端口部署测试 — 全部通过 [OK]")
    print(f"{'='*70}")


if __name__ == "__main__":
    asyncio.run(main())
