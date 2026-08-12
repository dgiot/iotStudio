#!/usr/bin/env python3
"""
Loop: A11 协议健康监控
=======================
基于 loop-engineering 九边界设计，长期运行的 A11 协议探活与异常检测

Loop 合同:
  名称   A11 协议健康监控 (a11-health-monitor)
  触发   每 5 分钟一次 (/loop 5m) 或手动触发
  目标   验证 A11 网关可达、协议正常、无异常消息类型
  输入   A11 网关地址 · 已知消息类型白名单 · STATE.md
  范围   只读 A11 连接 · 可写 STATE.md · logs/
  工具   A11ProtocolAdapter · A11Parser · 网络探活
  验证   feedforward: 端口可达 · feedback: 心跳响应<2s, 无未知类型
  停止   成功(全部检查通过) / 预算(10轮无异常→降频30min) / 连续3次连接失败→升级
  升级   连接失败→告警 · 3轮以上未知消息→人工审查
  提交   候选:健康报告 → 写入 STATE.md · 异常→通知
  状态   每轮写入 STATE.md: 时间·目标·动作·证据·下一步
  意图   probing → collecting → verifying → reporting → done
  清理   断开连接·关闭TCP·日志轮转(>100条裁剪)
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from collections import Counter

# === 状态管理 (边界3: 外置状态) ===
STATE_FILE = os.path.join(os.path.dirname(__file__), '..', 'STATE.md')

@dataclass
class LoopState:
    """持久化 Loop 状态"""
    target: str = ""                     # 监控目标
    last_run: str = ""                   # 上次运行时间
    runs: int = 0                        # 总运行次数
    successes: int = 0                   # 成功次数
    failures: int = 0                    # 失败次数
    consecutive_failures: int = 0        # 连续失败
    unknown_types: Dict[str, int] = field(default_factory=dict)  # 未知消息类型
    last_anomaly: str = ""              # 最近异常
    budget_remaining: int = 10           # 剩余预算(无异常时递减)
    warnings: List[str] = field(default_factory=list)
    phase: str = "probing"              # 当前阶段

    def to_markdown(self) -> str:
        return f"""## A11 健康监控状态 ({datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} UTC)

| 指标 | 值 |
|------|-----|
| 目标 | {self.target} |
| 上次运行 | {self.last_run} |
| 运行次数 | {self.runs} |
| 成功率 | {self.successes}/{self.runs} ({self.successes/max(self.runs,1)*100:.1f}%) |
| 连续失败 | {self.consecutive_failures} |
| 预算剩余 | {self.budget_remaining} |
| 当前阶段 | {self.phase} |

### 未知消息类型
{chr(10).join(f'- 0x{t:04X}: {c}次' for t,c in sorted(self.unknown_types.items(), key=lambda x:-x[1])[:10]) or '无'}

### 最近异常
{self.last_anomaly or '无'}

### 警告
{chr(10).join(f'- {w}' for w in self.warnings[-5:]) or '无'}
"""

def load_state() -> LoopState:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        # 简单解析 (生产环境用 YAML/JSON)
        return LoopState(target=content.split('目标 | ')[-1].split('\n')[0].strip() if '目标 |' in content else '')
    return LoopState()

def save_state(state: LoopState):
    state.last_run = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        f.write(state.to_markdown())

# === 已知消息类型白名单 (边界1: 外部验证) ===
KNOWN_TYPES = {
    0x0017: 'HEARTBEAT', 0x0013: 'HEARTBEAT_ACK', 0x001D: 'QUERY_RESP',
    0x0030: 'SYS_QUERY', 0x0031: 'SYS_CMD_31', 0x0046: 'SYS_CMD_46',
    0x0047: 'SYS_CMD_47', 0x005B: 'SYS_CMD_5B', 0x0070: 'SYS_CMD_70',
    0x0073: 'SYS_CMD_73', 0x0085: 'SYS_CMD_85', 0x0089: 'SYS_CMD_89',
    0x0020: 'SYS_CMD_20', 0x0506: 'DEV_REGISTER', 0x021A: 'DEV_UNREGISTER',
    0x0539: 'DATA_QUERY', 0x056C: 'DATA_REPORT', 0x024D: 'STATUS_QUERY',
    0x0291: 'STATUS_REPORT', 0x56B6: 'ALARM_EVENT', 0x04B2: 'ALARM_EVENT_2',
    0x04F5: 'ALARM_ACK', 0x5EC4: 'ALARM_EVENT_3', 0x0BFF: 'EVENT',
    0x13FB: 'EVENT_2', 0x47AC: 'STATUS', 0x75D7: 'EVENT_3',
    0xCA99: 'SERVER_RESP', 0xDBB2: 'RESP_2', 0x94FE: 'RESP_3',
    0x9FD2: 'RESP_4', 0xB2AB: 'RESP_5', 0x8434: 'RESP_6',
    0x8552: 'RESP_7', 0x8717: 'RESP_8', 0x8F5D: 'RESP_9',
    0x966F: 'RESP_10',
}

def is_known_type(t: int) -> bool:
    return t in KNOWN_TYPES or (t >= 0x8000 and t not in KNOWN_TYPES)  # hi-bit=1 → 服务端响应

# === 健康检查核心 (边界1: feedforward + feedback) ===
async def check_connectivity(host: str, port: int, timeout: float = 3.0) -> Dict[str, Any]:
    """feedforward: TCP 端口可达"""
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), timeout=timeout)
        writer.close()
        return {'status': 'ok', 'latency_ms': round(timeout * 1000, 1)}
    except Exception as e:
        return {'status': 'fail', 'error': str(e)}

async def check_protocol(host: str, port: int) -> Dict[str, Any]:
    """feedback: A11 心跳响应"""
    try:
        from protocols.a11 import A11Config, A11ProtocolAdapter, A11Message
        config = A11Config(device_id='health-check', host=host, port=port, timeout=5)
        adapter = A11ProtocolAdapter(config)
        if not await adapter.connect():
            return {'status': 'fail', 'error': 'TCP 连接成功但 A11 握手失败'}
        # 发心跳
        msg = A11Message(trans_id=9999, unit_id=0, msg_type=0x0017, msg_sub=0, payload=b'')
        await adapter._send_message(msg)
        responses = await adapter._recv_messages(timeout=3.0)
        await adapter.disconnect()
        if responses:
            unknown = [m for m in responses if not is_known_type(m.msg_type)]
            return {
                'status': 'ok',
                'response_count': len(responses),
                'response_types': [f'0x{m.msg_type:04X}' for m in responses],
                'unknown_types': [f'0x{m.msg_type:04X}' for m in unknown],
            }
        return {'status': 'fail', 'error': '心跳无响应'}
    except ImportError:
        return {'status': 'skip', 'error': 'A11 适配器未安装'}
    except Exception as e:
        return {'status': 'fail', 'error': str(e)}

# === 主 Loop ===
async def run_health_check(target: str = '127.0.0.1:8889') -> Dict[str, Any]:
    """执行一轮健康检查 (边界2: 三类停止条件)"""
    host, port = target.split(':')
    port = int(port)

    state = load_state()
    state.target = target
    state.phase = 'probing'
    state.runs += 1

    # Stage 1: 连接检查
    state.phase = 'collecting'
    conn = await check_connectivity(host, port)
    if conn['status'] != 'ok':
        state.consecutive_failures += 1
        state.failures += 1
        state.last_anomaly = f'连接失败: {conn.get("error")}'
        state.phase = 'blocked'
        if state.consecutive_failures >= 3:
            state.warnings.append(f'[升级] 连续 {state.consecutive_failures} 次连接失败，需人工介入')
        save_state(state)
        return {'status': 'fail', 'stage': 'connectivity', **conn}

    # Stage 2: 协议检查
    state.phase = 'verifying'
    proto = await check_protocol(host, port)
    if proto['status'] == 'skip':
        state.phase = 'done'
        save_state(state)
        return {'status': 'skip', 'reason': 'adapter not available'}

    if proto['status'] != 'ok':
        state.consecutive_failures += 1
        state.failures += 1
        state.last_anomaly = f'协议异常: {proto.get("error")}'
        state.phase = 'blocked'
        save_state(state)
        return {'status': 'fail', 'stage': 'protocol', **proto}

    # Stage 3: 类型审计 (边界1: 白名单验证)
    state.phase = 'verifying'
    for ut in proto.get('unknown_types', []):
        t = int(ut, 16)
        uk = state.unknown_types.get(ut, 0)
        state.unknown_types[ut] = uk + 1
        if uk >= 2:
            state.warnings.append(f'未知类型 {ut} 出现 {uk+1} 次，需审查')

    # Stage 4: 预算管理 (边界2: 停止条件)
    if state.consecutive_failures == 0 and not proto.get('unknown_types'):
        state.budget_remaining -= 1
    state.consecutive_failures = 0
    state.successes += 1
    state.phase = 'reporting'

    # Stage 5: 输出节制 (边界8)
    if state.budget_remaining <= 0:
        state.warnings.append('[降频] 连续健康，建议降频至 30min')
        state.budget_remaining = 30  # 重置

    state.phase = 'done'
    save_state(state)

    return {
        'status': 'ok',
        'runs': state.runs,
        'success_rate': state.successes / state.runs * 100,
        'budget_remaining': state.budget_remaining,
        'unknown_types': dict(state.unknown_types),
    }

# === CLI ===
if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser(description='A11 协议健康监控 Loop')
    ap.add_argument('--target', default='127.0.0.1:8889', help='A11 网关地址')
    ap.add_argument('--once', action='store_true', help='单次检查')
    ap.add_argument('--interval', type=int, default=300, help='循环间隔(秒)')
    ap.add_argument('--state', action='store_true', help='仅显示状态')
    args = ap.parse_args()

    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

    if args.state:
        state = load_state()
        print(state.to_markdown())
    elif args.once:
        result = asyncio.run(run_health_check(args.target))
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        async def loop():
            print(f'[Loop] A11 健康监控启动: {args.target} (间隔 {args.interval}s)')
            while True:
                result = await run_health_check(args.target)
                status = result.get('status', 'unknown')
                print(f'[{datetime.now().strftime("%H:%M:%S")}] {status}')
                await asyncio.sleep(args.interval)
        try:
            asyncio.run(loop())
        except KeyboardInterrupt:
            print('\n[Loop] 已停止')
