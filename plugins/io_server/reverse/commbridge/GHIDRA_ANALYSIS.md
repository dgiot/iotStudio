# LegacyComm 协议确定报告 — 基于逆向工程

> 分析日期: 2026-07-12
> 方法: PDB符号 + PE导出/导入 + 代码段反汇编 + 魔数搜索 + 帧类型常量提取
> 目标: 确定精确帧格式以编写 dgiot_lite 兼容 TCP Server

---

## 1. 传输层：纯原始 TCP 流（PUSH 模式）

### 证据链

| 证据 | 来源 |
|------|------|
| `HP_Create_TcpServer` (非 `TcpPackServer`) | anycomm.dll 导入表 |
| `HP_Create_TcpClient` (非 `TcpPackClient`) | anycomm.dll 导入表 |
| `sendto()` / `recvfrom()` 存在 (UDP支持) | anycomm.dll 导入表 |
| `closesocket()` / `connect()` | anycomm.dll 导入表 |

**结论**: LegacyComm 使用 HP-Socket 的 **PUSH 模式**（原始字节流），不添加任何自动帧头/帧尾。数据直接是 Modbus RTU 帧在 TCP 流上传输。

### HP-Socket 三种模式对比

```
TcpServer/PUSH:  应用发送原始字节, HP-Socket 不做任何加工
TcpPackServer:   应用发送 [HEADER(WSABUF)] + [BODY], HP-Socket 自动组装
TcpPullServer:   应用主动 Pull, HP-Socket 分发

LegacyComm 选择: TcpServer/PUSH = 原始流
```

## 2. 协议层：Modbus RTU over TCP (无额外封装)

### 帧格式

```
RTU → LegacyComm (上行数据):
  [Modbus RTU Response Frame]
  = [SlaveAddr(1B)] [FuncCode(1B)] [ByteCount(1B)] [Data(N)] [CRC16(2B)]

LegacyComm → RTU (下行查询):
  [Modbus RTU Request Frame]
  = [SlaveAddr(1B)] [FuncCode(1B)] [StartAddr(2B)] [Quantity(2B)] [CRC16(2B)]
```

### 帧类型常量 (从代码段提取)

| 帧类型码 | 代码出现次数 | 推测含义 |
|---------|------------|---------|
| 0x01 | 91次 | 遥测数据帧 (最频繁) |
| 0x04 | 23次 | 心跳响应/ACK |
| 0x03 | 9次 | 心跳请求 |
| 0x02 | 7次 | 注册请求 |
| 0x10 | 4次 | 遥控命令/写寄存器 |
| 0x0A | 4次 | (未知) |
| 0x08 | 3次 | (可能是配置帧) |
| 0x20 | 2次 | (未知) |
| 0x18 | 2次 | (未知) |

**重要**: 代码中 **未找到 0xAAAA、0x55AA 作为立即数常量**，确认没有额外的二进制帧头/帧尾。

## 3. DTU 注册流程

### PDB 函数调用链

```
RTU TCP连接 → CB_OnAcceptConnect → OnNewConnection
RTU 发注册包 → CB_OnReceiveID → OnReceiveID → CRegister::Login(device_id)
注册成功   → 分配 CChannel → 开始 Modbus 轮询
RTU 断开   → CB_OnDisconnect → CRegister::Logout
```

### 注册包格式推测

基于 `modem_data_t` 结构体（来自 GPRSDLL.dll 导出）:
```c
struct modem_data_t {
    unsigned int modem_id;       // DTU ID
    unsigned short data_length;  // 数据长度
    unsigned char* data;         // 原始数据
    // ... 可能包含更多字段
};
```

`DSGetNextData(modem_data_t*, unsigned short)` — 第二个参数是 unsigned short，可能是设备标识或端口号。

## 4. 数据处理流程

```
DSGetNextData() 六阶段流水线:
  Stage 1: ENTER GET NEXT DATA 1! — 等待数据到达
  Stage 2: ENTER GET NEXT DATA 2! — 读取帧头/类型
  Stage 3: ENTER GET NEXT DATA 3! — 读取数据体
  Stage 4: ENTER GET NEXT DATA 4! — CRC 校验
  Stage 5: ENTER GET NEXT DATA 5! — 数据转换/格式化
  Stage 6: ENTER GET NEXT DATA 6! — 分发到 IOManager

DSGetNextData() → FormatDataBuf() → AddRecivSendInfo() → RecvMsgFromIoProject()
```

## 5. 数据转换公式

来自 Device.ini ChangeData[]:
```
物理值 = 原始值(int16) × Coefficient

Coefficient[0] = 170/8192 = 0.020751953125  (电流/电压)
Coefficient[1] = 8.5/8192 = 0.00103759765625 (接地电流)
Coefficient[2] = 170/8192                      (相电压)
Coefficient[3] = 170×8.5/8192 = 0.1763916015625 (有功功率)
Coefficient[4] = 1/8192 = 0.0001220703125      (功率因数)
Coefficient[5] = 2/8192 = 0.000244140625       (频率: 50+Y×2/8192)
Coefficient[6-9] = 1                           (直通)
```

## 6. 设备类型表

```
0x00: DSL-31A 断路器       (20通道) — 速断/过流/重合闸保护
0x10: DST-31A 变压器差动   (15通道)
0x20: DBPA-31A 备用电源    (13通道)
0x30: DSB-31A 变压器后备   (20通道)
0x40: 电动机保护           (19通道)
0x50: DST-22D 变压器差动   (20通道)
0x60: DSB-22D 变压器后备   (20通道)
0x70: DSL-24D 断路器       (20通道)
0x80: DGP-11 变压器差动    (21通道)
0x90: DGP-12 变压器后备    (24通道)
0xA0: DGP-13 接地保护      (22通道)
0xB0: DMP-31A 电动机       (19通道)
```

## 7. dgiot_lite 接管实现要点

### 7.1 TCP Server
```python
# 使用 asyncio.start_server, 监听 0.0.0.0:53001
# 替代 HP_Create_TcpServer + PUSH 模式
```

### 7.2 DTU 注册
```python
# 接受连接后, 等待 RTU 发送注册消息
# 实现了 CRegister::Login 等价逻辑
# 通过 IP + DTU ID 识别设备
```

### 7.3 Modbus 轮询
```python
# 在 TCP 连接上发送标准 Modbus RTU 帧 (含 CRC16)
# func 0x03 (读保持寄存器)
# 按 Device.ini 的通道配置确定读取数量和起始地址
```

### 7.4 数据转换
```python
# raw_value × Coefficient[channel_mapping]
# 16位有符号整数 → 浮点物理值
```

## 8. 残余未知项

| 未知项 | 可能值 | 优先级 |
|--------|--------|--------|
| DTU 注册包精确格式 | 可能是纯二进制设备ID, 或 IP-映射 | 高 |
| 心跳间隔 | 推测 30-60s | 中 |
| 是否有 IP 白名单 | 很可能有 (只接受 11.248/249/250.x) | 高 |
| 最大并发连接数 | 191 (当前) + 余量 | 低 |

> 下一步: 基于此规范编写 `src/protocols/commbridge_server.py`
