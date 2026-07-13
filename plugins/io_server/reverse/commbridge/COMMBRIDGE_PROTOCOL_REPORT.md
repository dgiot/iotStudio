# CommBridge 专有协议深度分析报告

> 分析日期: 2026-07-12
> 分析对象: CommBridge.exe (E:\IO ServerOnLine, 11.66.12.131)
> 文件版本: 155,789 bytes, MD5=bc015b634cf75f789cf6676404ce58bf
> PDB 版本: 484,352 bytes, MD5=0cc2feb050a67f1ea928e907824258a6

---

## 1. 系统架构总览

### 1.1 组件关系

```
                    RTU Devices (191 units)
                    ~~~~~~~~~~~~~~~~~~~~~~~~
      11.248.195.x ~ 11.248.205.x | GPRS/DTU
                                  |
                         :53001 (TCP)
                                  |
                    ==============|==============
                    CommBridge.exe (MFC 消息泵)
                    |        |         |        |
               anycomm.dll  ComDll  port_*.dll  GPRSDLL.dll
               (协议核心)   (注册表) (TCP/UDP)  (GPRS协议栈)
                    |        |         |        |
               HPSocket.dll           CB_NetClient
               (HP-Socket TCP/UDP库)  (UDP通信)
                    |
               ws2_32.dll (Winsock)
                    |
          =========|========= IO Server 边界
          |
     IoMonitor.exe (监控)   IoMan.exe (管理)
          |                      |
     WM_COPYDATA IPC        Oracle DB (DQYTPROD)
```

### 1.2 模块职责

| 组件 | 职责 |
|------|------|
| CommBridge.exe | MFC 主框架, 消息分发, 崩溃处理 |
| anycomm.dll | 协议解释器, 通道管理, 配置读写 |
| GPRSDLL.dll (1.38MB) | GPRS CDMA 协议栈, DTU 管理 |
| AL_GPRS_ DLL.dll | 备选 GPRS 协议栈 |
| HPSocket.dll (1.7MB) | HP-Socket 高性能 TCP/UDP, SSL支持 |
| CB_NetClient.dll | UDP 客户端模块 |
| port_TCPServer.dll | TCP 服务器 (send/recv/accept/listen) |
| port_TCPClient.dll | TCP 客户端 (send/recv/connect) |
| port_ACEServer.dll | ACE 框架 TCP 服务器 |
| ComDll.dll | 注册表操作 (COM 注册) |
| ioapi.dll | IO 数据通道 API, ADO 数据库接口 |

### 1.3 关键配置

```
IoChannelCfg.ini:
  [COMMBRIDGE] DEV_COUNT = 3   # 每个IO服务器管理3个CommBridge设备
  [TCPCLIENT] CHN_COUNT = 1    # 1个TCP客户端通道
  [TIMEOUT] IO = 30            # IO超时30秒
  [OPEN_CHANNEL_SPACE_TIME] TCPCHANNEL = 10  # 通道打开间隔10秒

SqlFilSet.ini:
  Oracle DB: DQYTPROD / dqyta11_PASS @ orcl
  SQL执行周期: 1000ms
  任务分配周期: 5ms
  ADO连接数: 4

IOFileServer.ini:
  IOFileServer端口: 7001
  IOconfig端口: 6582
  用户: admin / admin888

RedunndancyCfg.ini:
  冗余IP: 196.168.65.102
  接收端口: 6000, 发送端口: 6001
  超时: 1500ms x 3次
```

---

## 2. PDB 符号导出的核心类层次

### 2.1 GPRS/通信主机类

```
CGPRS_TCP_Host           -- TCP 通信主机 (监听:53001)
CGPRS_UDP_Host           -- UDP 通信主机
CGPRS_Channel            -- GPRS 数据通道
CGPRSHost / CGPRSChannel -- (PDB 存储的基类引用)

类结构推测:
  CGPRS_Host (基类)
  ├── CGPRS_TCP_Host     -- TCP 模式
  └── CGPRS_UDP_Host     -- UDP 模式

  CChannel (基类)
  ├── CGPRS_Channel      -- GPRS 通道
  └── CClientChannel     -- 客户端通道
```

### 2.2 通道管理类

```
CChannel                 -- 通道抽象基类
CChannelInfor            -- 通道信息
CChannelSearch           -- 通道搜索
CClientChannel           -- 客户端通道
CheckChannelStatus       -- 通道状态检查
ChannelCanSend           -- 通道可发送判断
ChannelIsOpen            -- 通道打开判断
OpenChannel / CloseChannel
OnChannelMsg             -- 通道消息处理
AddChannelInfo           -- 添加通道信息
GetChannel / GetChannelInfo
```

### 2.3 DTU 注册类

```
CRegister                -- DTU 注册管理
  ├── Login(HWND, char*, int)     -- DTU 登录认证
  ├── Logout(HWND)                -- DTU 登出
  └── FindWindowA(const char*)    -- 查找窗口

CLoginDlg                -- 登录对话框
DTUSendData              -- DTU 数据发送
DTU_ID                   -- DTU 标识

DTU 协议模块 (E:\IO ServerOnLine\DTU\ 子目录):
  DTU_SUNWAY             -- Sunway/桑威 DTU
  DTU_SUNWAY_MULTIPORT   -- Sunway 多端口
  DTU_SUNWAY_UDP         -- Sunway UDP
  DTU_WEIPU              -- Weipu/威普 DTU
  DTU_BHYN               -- 北京华源
  DTU_HONGDIAN           -- 宏电
  DTU_FOUR_FAITH         -- 四信
  DTU_InHand             -- 映翰通
  DTU_LANDI              -- 蓝迪
  DTU_ETUNG              -- 易通
  DTU_FENGSHI            -- 丰石
  DTU_CAIMAO             -- 彩猫
  DTU_DQQY               -- 大庆油田专用
  DTU_DLHB_HJT212        -- 环保 HJ212 协议
```

### 2.4 回调函数

```
CB_OnAcceptConnect       -- 接受连接回调
CB_OnDisconnect          -- 断开连接回调
CB_OnSendData            -- 发送数据回调
CB_OnInit                -- 初始化回调
CB_OnTimeOut             -- 超时回调 (Timer)
```

### 2.5 数据处理函数

```
FormatDataBuf            -- 格式化数据缓冲区
AddRecivSendInfo         -- 添加收发信息
ReadTcpPar / ReadUdpPar  -- 读取 TCP/UDP 参数
GetPrivateData           -- 获取私有数据
InitHost / InitDll       -- 主机/DLL 初始化
LoadChannel              -- 加载通道配置
CommBridgeErrorLog       -- 错误日志
MyExceptionFilter        -- 全局异常过滤
```

---

## 3. PE 导入表网络 API 完整列表

### 3.1 网络相关 API 分布

| DLL | 网络函数 | 用途 |
|-----|----------|------|
| ws2_32.dll | 39 (含WSASend/WSARecv) | HP-Socket TCP/UDP (高性能) |
| ws2_32.dll | 14 | port_TCPServer 直接Winsock |
| ws2_32.dll | 12 | port_TCPClient 直接Winsock |
| ws2_32.dll | 12 | AL_GPRS_ DLL GPRS协议栈 |
| ws2_32.dll | 7 | port_ACEServer ACE框架 |
| wsock32.dll | 27 | GPRSDLL 传统 Winsock |
| hpsocket.dll | 4 | anycomm.dll 通过 HP-Socket |
| cb_netclient.dll | 2 | anycomm.dll UDP 通信 |
| mswsock.dll | 1 | ACE 扩展 AcceptEx |

### 3.2 关键 Windows API

```
WSASend / WSARecv        -- 异步 TCP 数据收发 (HPSocket)
WSASendTo / WSARecvFrom  -- 异步 UDP 数据收发
send / recv              -- 同步数据收发
sendto / recvfrom        -- UDP 数据收发 (anycomm/GPRSDLL)
select                   -- I/O 多路复用 (anycomm UDP)
accept / listen / bind   -- TCP 服务器
connect                  -- TCP 客户端
WSAAsyncSelect           -- 异步事件选择 (GPRSDLL)
ioctlsocket              -- socket I/O 控制
setsockopt / getsockopt  -- socket 选项
GetAcceptExSockaddrs     -- ACE AcceptEx 扩展
CancelIo                 -- I/O 取消 (ACE)
```

---

## 4. DTU 注册协议推理

### 4.1 设备注册流程

基于 PDB 中 CRegister::Login/Logout 和 DTU_ID 的分析，推测注册流程如下：

```
RTU/DTU                   CommBridge:53001
  |                             |
  |=== TCP 连接建立 ============>|
  |                             |
  |=== 注册请求 ================>|
  |   [DTU_ID] [IMEI/SN]       |   CRegister::Login
  |   [认证数据]                |   验证 DTU 身份
  |                             |
  |<== 注册确认 ================|
  |   [结果代码]                |
  |   [通道ID分配]              |   从 Device.ini 获取设备类型
  |                             |   创建 CChannel
  |                             |
  |   ==== 进入正常通信模式 ====>|
  |   [Modbus 帧 + 封装]        |
  |   [心跳包]                  |   CGPRS_Channel::Send
  |                             |
  |   ... 在线运行 ...          |
  |                             |
  |   ==== 正常断开/超时 =======>|
  |                             |   CB_OnDisconnect
  |                             |   CRegister::Logout
```

### 4.2 DTU 协议模块

DTU 各型号有独立的协议驱动模块，位于 `E:\IO ServerOnLine\DTU\` 目录：

| 模块 | 厂商 | 特性 |
|------|------|------|
| DTU_SUNWAY | 桑威/申威 | 标准GPRS DTU, TCP/UDP双模 |
| DTU_SUNWAY_MULTIPORT | 桑威多端口 | 多TCP连接 |
| DTU_SUNWAY_UDP | 桑威UDP | 纯UDP模式 |
| DTU_WEIPU | 威普 | 工业级DTU |
| DTU_BHYN | 北京华源 | 电力专用 |
| DTU_HONGDIAN | 宏电 | 通用GPRS DTU |
| DTU_FOUR_FAITH | 四信 | 工业无线DTU |
| DTU_InHand | 映翰通 | 智能DTU |
| DTU_LANDI | 蓝迪 | GPRS DTU |
| DTU_ETUNG | 易通 | 通用DTU |
| DTU_FENGSHI | 丰石 | GPRS DTU |
| DTU_CAIMAO | 彩猫 | DTU模块 |
| DTU_DQQY | 大庆油田专用 | 定制协议 |
| DTU_DLHB_HJT212 | 环保HJ212 | 环保部标准 |

值得注意的是 **DRIVER.back 是 ZIP 压缩包**，内包含 `IO Servers/Standard_Umodbus/`，说明底层使用**标准 Modbus UDP 传输协议**。

---

## 5. 数据帧结构推理

### 5.1 设备数据

Device.ini 定义了12种油田保护装置，每种都有固定的数据通道映射：

```
设备类型表:
  0x00: DSL-31A 断路器       (20通道)
  0x10: DST-31A 变压器差动    (15通道)
  0x20: DBPA-31A 备用电源    (13通道)
  0x30: DSB-31A 变压器备用   (20通道)
  0x40: 电机保护             (19通道)
  0x50: DST-22D 变压器差动   (20通道)
  0x60: DSB-22D 变压器备用   (20通道)
  0x70: DSL-24D 断路器       (20通道)
  0x80: DGP-11 变压器差动    (21通道)
  0x90: DGP-12 变压器备用    (24通道)
  0xA0: DGP-13 接地保护      (22通道)
  0xB0: DMP-31A/DST-31A 电机(19通道)

数据公式 (8192=0x2000 的标定电压):
  电流 Ia/Ib/Ic:     Y * 170 / 8192 (A)
  接地电流 Iac:      Y * 8.5 / 8192 (A)
  相电压 Ua/Ub/Uc:   Y * 170 / 8192 (V)
  有功功率 P:        Y * 170 * 8.5 / 8192 (W)
  功率因数 cosA:     Y / 8192
  频率 F:            50 + Y * 2 / 8192 (Hz)
  
  Y = 16位有符号原始值 (范围 -8192~+8191)
```

### 5.2 推测的帧结构

基于 `AddRecivSendInfo`, `FormatDataBuf`, `ReadTcpPar`, `CB_OnSendData` 等函数和已知的数据公式，推测 TCP 帧结构如下：

```
┌─────────────────────────────────────────────────────┐
│                   TCP 帧结构                         │
├─────────────────────────────────────────────────────┤
│ 字段        | 长度  | 说明                          │
├─────────────|-------|-------------------------------│
│ FrameHead   | 2B    | 帧头标志 (0xAAAA/0x55AA?)    │
│ DeviceID    | 2B    | RTU/DTU 设备编号             │
│ DevType     | 1B    | 设备类型 (0x00~0xB0)         │
│ FrameType   | 1B    | 帧类型 (注册/心跳/数据/命令) │
│ Length      | 2B    | 数据体长度 (大端)            │
│ Data        | N     | 数据体                        │
│ CRC16       | 2B    | Modbus CRC-16 (整个帧)       │
│ FrameTail   | 2B    | 帧尾标志 (0x55AA/0xAAAA?)    │
└─────────────|-------|-------------------------------┘

数据体 (Data) 对于遥测帧:
┌─────────────────────────────────────────────────────┐
│ 字段      | 长度   | 说明                            │
│-----------|--------|---------------------------------│
│ Channel[] | 2B/个  | 各通道的原始16位整数            │
│           |        | (数量 = ChannelNum)             │
│ Event     | 2B     | 事件位图 (按位)                 │
│ Alarm     | 4B     | 告警位图 (按位)                 │
│ Timestamp | 4B     | 时间戳 (Unix时间或BCD编码)      │
└─────────────────────────────────────────────────────┘
```

### 5.3 可能的帧类型 (FrameType)

```
0x01: 注册请求 (Login)
0x02: 注册响应 (Acknowledge)
0x03: 心跳 (Heartbeat/Ping)
0x04: 心跳响应 (Pong)
0x10: 遥测数据 (Telemetry/Report)
0x11: 遥测响应 (ACK)
0x20: 遥控命令 (Control/Write)
0x21: 遥控响应 (Control Response)
0x30: 校时 (Time Sync)
0x31: 校时响应
0x40: 参数设置 (Parameter Set)
0x41: 参数设置响应
```

### 5.4 Modbus 帧封装方式

基于 `Standard_Umodbus`（标准 Modbus UDP Transport）和 GPRS DTU 的特性，推测有两种模式：

**模式 A -- UDP 封装 (Standard_Umodbus)**
```
UDP 报文:
┌──────────────────────────────────────┐
│ DTU 头部 (4-8B)  | Modbus RTU 帧    │
│ [DTU_ID][seq]    | [slave][fc][..]  │
└──────────────────────────────────────┘

Modbus RTU PDU:
  [SlaveAddr=1B] [FuncCode=1B] [Data=N] [CRC16=2B]
```

**模式 B -- TCP 流封装 (GPRS DTU)**
```
TCP 流 (端口 53001):
┌──────────────────────────────────────────────┐
│ 帧头 | DTU_ID | 长度 | Modbus_RTU | CRC | 帧尾│
└──────────────────────────────────────────────┘
```

---

## 6. 与 IoMonitor 的 IPC 协议

CommBridge 使用 `WM_COPYDATA` 与 IoMonitor 通信（`CMainFrame::OnCopyData`）：

```
WM_COPYDATA 数据结构:
  COPYDATASTRUCT.dwData = 消息类型ID
  COPYDATASTRUCT.cbData = 数据长度
  COPYDATASTRUCT.lpData = 序列化的通道数据
  
消息类型推测:
  MSG_CHANNEL_DATA   = 0x0001  (遥测数据上报)
  MSG_DEVICE_STATUS  = 0x0002  (设备状态变化)
  MSG_ALARM_EVENT    = 0x0003  (告警事件)
  MSG_COMMAND_REPLY  = 0x0004  (命令回复)
```

---

## 7. 关键结论

### 7.1 协议总结

CommBridge 是一个**多协议 GPRS DTU 网关**，核心职能：

1. **监听端口 53001 (TCP)**: 接受 191+ 台 RTU 设备通过 GPRS DTU 连接
2. **多 DTU 厂商兼容**: 通过 `DTU\` 目录下的协议驱动模块适配不同品牌 DTU
3. **Modbus 传输**: 底层使用 Modbus RTU over TCP/UDP (`Standard_Umodbus`)
4. **专有帧封装**: DTU ID + 帧头帧尾 + CRC16 的专有封装
5. **数据存储**: 通过 ADO 接口写入 Oracle 数据库 (DQYTPROD)
6. **IPC 上报**: 通过 WM_COPYDATA 将实时数据推送给 IoMonitor

### 7.2 与 dgiot_lite 的集成点

1. **端口 53001 协议实现**: 需要实现 DTU 注册+Modbus RTU 帧解析
2. **CRC16 校验**: Modbus CRC-16 (多项式 0x8005)
3. **DTU 注册流程**: 实现 CRegister::Login/Logout 等价逻辑
4. **数据公式**: 实现 `Y * 170 / 8192` 等转换公式
5. **多设备类型**: 支持 Device.ini 中的 12 种设备类型配置

### 7.3 待确认事项

- 帧头/帧尾的具体魔数 (0xAAAA/0x55AA 为推测,需抓包确认)
- CRC16 范围: 是整个帧还是仅数据体
- DTU 注册的具体握手协议细节
- 与各 DTU 厂商的具体 AT 指令交互
- 具体 Oracle 表结构

---

## 附录 A: 下载文件清单

| 文件 | 大小 | MD5 |
|------|------|-----|
| CommBridge.exe | 155,789 | bc015b634cf75f789cf6676404ce58bf |
| CommBridge.pdb | 484,352 | 0cc2feb050a67f1ea928e907824258a6 |
| anycomm.dll | 413,755 | a1f204e70b1871e84e4cb03464d015c2 |
| ComDll.dll | 45,056 | 6d8fd95e5ef3b07edc71137e21f5d4e1 |
| GPRSDLL.dll | 1,380,417 | a6199e84105a30b6d4f197b6f736ebea |
| HPSocket.dll | 1,734,144 | 74860f790b4d7b8786ef96fd858459ca |
| ioapi.dll | 106,573 | 98902e39079a4323dc331406c6b20927 |
| Device.ini | 39,078 | e2067ddeeb9b986ccca65dbec5ed6130 |
| IoChannelCfg.ini | 419 | b1de461a573e1e2ec002f115515f35cc |
| SqlFilSet.ini | 256 | 9c9da3a772d2d3e4b5a37afcbef7656d |
| IOMan.pdb | 1,975,296 | fe5a5e3c477cf49328dcbcd8e2696115 |
| IoMonitor.pdb | 2,999,296 | cb3d0f6e2e4352acf706fc54dd83a5b6 |
| Driver.back (ZIP) | 12,483 | 925364c89236fd6e88fc1a8a1678bef5 |
| port_TCPServer.dll | 32,768 | 66388350fe708476c5b83b65156b8ad3 |
| port_TCPClient.dll | 28,672 | f8e1dfc741b703660c8f794211eec1d7 |

(共 140 个文件, 详见 downloaded/manifest.json)

## 附录 B: 相关源文件

所有分析输出保存在: `D:\ai\dgiot_lite\reverse\commbridge\`

| 文件 | 说明 |
|------|------|
| commbridge_strings_all.txt | CommBridge.exe 全部字符串 (1053条) |
| pdb_all_functions.txt | PDB 中提取的函数名 (4732个) |
| pdb_cat_network.txt | 网络相关符号 (254个) |
| pdb_cat_dtu.txt | DTU 相关符号 (69个) |
| pdb_cat_protocol.txt | 协议相关符号 (141个) |
| pdb_cat_io.txt | IO 相关符号 (395个) |
| pdb_cat_config.txt | 配置相关符号 (122个) |
| pdb_cat_serial.txt | 串口相关符号 (49个) |
| pdb_cat_modbus.txt | Modbus 相关符号 (49个) |
| pdb_cat_gprs.txt | GPRS 相关符号 (61个) |
| pdb_cat_timer.txt | 定时器相关符号 (19个) |
| commbridge_pe_analysis.json | PE 结构分析 |

## 附录 C: Oracle 数据库连接

```
Provider=OraOLEDB.Oracle.1
Password=dqyta11_PASS
User ID=DQYTPROD
Data Source=orcl

SQL执行路径: F:\TRANgo\IO ServerOnLine\IO Servers\IM_A11_RTU\RTUSql\
```
