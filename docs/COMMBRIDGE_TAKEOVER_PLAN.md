# CommBridge 接管计划

> 目标: 用 dgiot_lite 替换 CommBridge.exe, 直接采集 191 台 RTU
> 策略: 先并行 (Oracle桥接), 再切换 (dgiot_lite TCP Server)

---

## 一、现状

```
                         当前架构
┌──────────┐   TCP:53001   ┌──────────────┐   WM_COPYDATA   ┌────────────┐   OLEDB   ┌──────────┐
│ 191 RTU  │ ────────────→ │ CommBridge   │ ──────────────→ │ IoMonitor  │ ────────→ │  Oracle  │
│ 11.248.x │  主动连接      │ (MFC C++)    │   IPC消息       │ (力控)      │           │ 11.66... │
└──────────┘               └──────────────┘                 └────────────┘           └──────────┘
                                                                                           │
                                                                                   WinRM │ VBS/ADO
                                                                                         ↓
                                                                                  ┌──────────┐
                                                                                  │ dgiot_lite│
                                                                                  │  (当前)    │
                                                                                  └──────────┘
```

## 二、目标架构

```
                         目标架构
┌──────────┐   TCP:53001   ┌──────────────┐   直写    ┌──────────────┐   MQTT   ┌──────────┐
│ 191 RTU  │ ────────────→ │  dgiot_lite  │ ────────→ │  TDengine    │ ───────→ │  DG-IoT  │
│ 11.248.x │  主动连接      │  TCP Server  │           │  PostgreSQL  │          │  主平台   │
└──────────┘               └──────────────┘           └──────────────┘          └──────────┘
                                  │
                          WebSocket :8000/ws
                                  ↓
                          ┌──────────────┐
                          │  Vue3 前端   │
                          │  实时监控    │
                          └──────────────┘
```

## 三、分阶段实施

### 阶段 1: Oracle 桥接 (✅ 已完成)

```
RTU → CommBridge → IoMonitor → Oracle → dgiot_lite
```

**文件**: `oracle_reader.py`, `src/storage/oracle_bridge.py`, `src/services/oracle_pipeline.py`

**指标**:
- 吞吐: 81 行/秒
- 延迟: 700-1200ms
- 2,622 次采集, 244,258 条遥测

### 阶段 2: 协议精确确定 (📋 进行中)

**任务**: Ghidra/IDA 逆向 GPRSDLL.dll 确定精确帧格式

**目标函数**:
1. `DSSendData(unsigned int, unsigned short, unsigned char*)` — 数据发送
2. `CB_OnReceiveID` — DTU 注册接收
3. `FormatDataBuf` — 数据格式化
4. `AddRecivSendInfo` — 收发记录

**待确认**:
- [ ] 帧头魔数 (推测 0xAAAA 或 0x55AA)
- [ ] 帧尾魔数 (推测 0x55AA 或 0xAAAA)
- [ ] CRC16 覆盖范围 (整个帧 vs 仅数据体)
- [ ] DTU 注册握手完整流程
- [ ] 心跳包格式和间隔

### 阶段 3: dgiot_lite TCP Server 实现

**需要实现的模块**:

```python
# src/protocols/commbridge_server.py

class CommBridgeServer:
    """CommBridge 兼容 TCP Server"""
    
    async def start(self, host='0.0.0.0', port=53001):
        """启动 TCP 服务器, 替代 CommBridge"""
        
    async def handle_rtu(self, reader, writer):
        """处理单个 RTU 连接"""
        # 1. DTU 注册握手
        dtu_id = await self.dtu_register(reader, writer)
        
        # 2. 查找设备配置 (设备类型, 通道数, 转换系数)
        config = self.device_registry.get(dtu_id)
        
        # 3. Modbus RTU 轮询
        while True:
            await self.poll_modbus(writer, config)
            data = await self.read_response(reader, config)
            
            # 4. 数据转换
            values = self.apply_formula(data, config)
            
            # 5. 存储 + 推送
            await self.store_and_push(dtu_id, values)
```

**依赖已有模块**:
- `src/eventbus.py` — 事件总线 (数据到达事件)
- `src/shadow.py` — 设备影子 (状态管理)
- `src/channel_base.py` — @protocol 装饰器注册
- `src/models/thing_model.py` — 物模型

### 阶段 4: 数据公式实现

```python
# 基于 Device.ini ChangeData[]
COEFFICIENTS = {
    0: 170 / 8192,           # 0.020751953125 — 电流/电压
    1: 8.5 / 8192,           # 0.00103759765625 — 接地电流
    2: 170 / 8192,           # 0.020751953125 — 相电压
    3: 170 * 8.5 / 8192,     # 0.1763916015625 — 有功功率
    4: 1 / 8192,             # 0.0001220703125 — 功率因数
    5: 2 / 8192,             # 0.000244140625 — 频率偏移
    6: 1, 7: 1, 8: 1, 9: 1  # 直通
}

def apply_formula(raw_value_16bit, coef_index):
    """Y × ChangeData[i]"""
    return raw_value_16bit * COEFFICIENTS[coef_index]
```

### 阶段 5: 切换与验证

1. **并行运行**: dgiot_lite 监听 :53002, 新 RTU 接入测试
2. **数据对比**: Oracle 读数 vs dgiot_lite 直采, 偏差 < 0.1%
3. **切换**: 停 CommBridge, dgiot_lite 接管 :53001
4. **回退**: 随时可切回 CommBridge

## 四、风险与缓解

| 风险 | 概率 | 缓解 |
|------|------|------|
| 帧格式不精确 | 中 | Ghidra 静态分析确认 |
| DTU 厂商协议差异 | 高 | 实现最常用 3-4 种, 其余逐个适配 |
| 191 并发连接性能 | 低 | Python asyncio 轻松支持 |
| 生产中断 | 低 | 并行运行+随时回退 |
| RTU 配置不可改 | 高 | 完全模拟 CommBridge 行为, RTU 无感知 |

## 五、已下载资产

| 文件 | 大小 | 用途 |
|------|------|------|
| CommBridge.exe | 155KB | 主程序, 入口点分析 |
| CommBridge.pdb | 484KB | 4,732 函数符号, 类层次 |
| GPRSDLL.dll | 1.38MB | **Ghidra 重点分析目标** |
| anycomm.dll | 413KB | HP-Socket 协议层 |
| Device.ini | 39KB | 12 设备类型 + 数据公式 |
| DTU_DQQY/DTUAPI.dll | 24KB | 大庆油田定制 DTU |
| 其余 DLL (135个) | ~48MB | 完整运行环境 |

> 下一步: `reverse/commbridge/GHIDRA_ANALYSIS.md` — GPRSDLL.dll 深度逆向
