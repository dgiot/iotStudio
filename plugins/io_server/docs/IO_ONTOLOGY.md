# IO 服务器逆向工程本体 — DLAS 四层模型 v3.0

> 数据源: pcapng(95K报文) + Oracle(61K测点) + PDB(4732符号) + 199文件全量精读
> 更新: 2026-07-13 · 含 DeviceStruct 反编译 + SqlFilSet + OPCClientCfg

---

## Step 1: 盘点到齐 — 实体发现

### Data 层: 服务器 & 设备

| 实体 | 数量 | 关键标识 |
|------|------|----------|
| IO 服务器 | 1台 | 192.168.10.131 (Win2016, E:\IO ServerOnLine\\) |
| RTDB 服务器 | 1台 | 192.168.10.130 (FSmartWorx :80, psAPI :9004, A11 :8889) |
| Oracle 11g | 1台 | 192.168.10.129:1521/orcl (INDUSTRYPROD) |
| RTU (Modbus) | 191台 | 11.248-250.x, 主动连接 :53001 |
| DCS 端点 (OPC DA) | 5台 | 192.168.10.23/.23, 172.26.6.3, 192.168.10.23, 172.21.14.192 |
| OPC Server | Kepware 4.x | CLSID: 6E6170F0-FF2D-11D2-8087-00105AA8F840 |
| 油井 | 966口 | B1VxxxVxxx 格式, 54口在 pcapng |
| 注水站 | 4+ | DX6PZ/DX5ZRZ/DX8ZRZ/XZ202TP/SYZ105ZYTWZ... |

### Data 层: 软件模块 (199文件)

| 模块 | 路径 | 大小 | 职责 |
|------|------|------|------|
| LegacyComm.exe | 根目录 | 155KB | MFC主框架, Modbus TCP网关 |
| GPRSDLL.dll | 根目录 | 1.38MB | GPRS/CDMA协议栈 |
| AnyComm.dll | 根目录 | 413KB | HP-Socket TCP/UDP |
| HPSocket.dll | 根目录 | 1.73MB | TCP/UDP高性能库 |
| psAPISDK.dll | 根目录 | 3.5MB | RTDB SDK (3525导出) |
| IoMan.exe | 根目录 | 299KB | IO管理器 (36实例) |
| IoMonitor.exe | 根目录 | - | 监控+Oracle写库 |
| IoProject.exe | 根目录 | - | RTDB核心调度 |
| Ioapi.dll | IM_A11_RTU/ | 107KB | ADO数据库接口 |
| DTU_*/DTUAPI.dll | DTU/ (16目录) | ~25KB/个 | 各厂商DTU协议适配 |

### Data 层: 配置文件

| 文件 | 内容 | 关键发现 |
|------|------|----------|
| Device.ini | 12种保护装置 + ChangeData公式 | 标定基准 8192(0x2000) |
| IoChannelCfg.ini | 3个LegacyComm通道 | DEV_COUNT=3 |
| SqlFilSet.ini | Oracle连接 + SQL路径 | EXECUTECYC=1000ms, ADOCOUNT=1 |
| IoMonitor.ini | 提交时序 | CommitRealSpan=300ms, CommitHisSpan=500ms |
| OPCClientCfg.ini | OPC Server ProgID→CLSID | Kepware KEPServerEx V4 |
| DeviceStruct.txt | OPC设备参数结构体 | 17字段 (IP/ProgID/CLSID/刷新时间...) |
| DefinedStruct.txt | OPC点项结构体 | 15字段 (变量名/类型/读写属性...) |
| Cfg.ini | IM_A11_RTU 驱动配置 | RTU采集通道参数 |
| SaveMessage.ini | OPC日志记录 | INTERVAL=5s, SIZE=20MB |

### Data 层: 崩溃历史

| 模块 | dump次数 | 时间跨度 |
|------|---------|----------|
| AdoInterface | 8次 | 2022-10-18 ~ 2023-03-06 |
| LegacyComm | 5次 | 2022~2023 |

### Logic 层: 进程架构

```
IoProject.exe (PID 5096)     ← RTDB Core, 总调度
    │
    ├── LegacyComm.exe (PID 19240)   ← TCP网关, 191 RTU
    │       └── DTU/ (16种DTU协议插件)
    │
    ├── IOMan.exe ×5 (OPC_FC_Client) ← OPC DA DCOM → 5 DCS
    │       └── IO Servers/OPC_FC_Client/
    │           ├── IoDevCfg.dll     ← 设备配置引擎
    │           ├── AliasFile.txt    ← Tag别名
    │           └── DeviceStruct.txt ← 设备参数结构体
    │
    ├── IOMan.exe ×24 (IM_A11_RTU)   ← Modbus RTU via LegacyComm
    │       └── IO Servers/IM_A11_RTU/
    │           ├── RTUSql/          ← SQL执行引擎
    │           └── Cfg.ini          ← 采集参数
    │
    ├── IOMan.exe ×7 (A11)           ← A11 TCP → :8889
    │
    ├── IoMonitor.exe (PID 18400)    ← GUI监视 + Oracle OLEDB
    │
    └── IoCommit.exe ×7              ← 批量写Oracle
```

### Logic 层: 协议

| 协议 | 帧格式 | 验证 |
|------|--------|------|
| **LegacyComm TCP** | Seq(1B)+Flags(4B)+Len(1B)+Slave(1B)+Func(1B)+Data(N) | 95K报文, 异常率0.017% |
| **注册包** | 0xAA + SlaveID + ASCII_DeviceID + 0x0D | 2211包, 413种设备ID |
| **心跳** | 0x00 (单字节) | 10873包 |
| **float32数据** | ByteCount%4==0 → float32工程值 | 67% |
| **int16数据** | ByteCount%2==0 → int16原始值 | 33% |

### Logic 层: 数据公式 (Device.ini ChangeData)

| 系数 | 值 | 公式 | 适用 |
|------|-----|------|------|
| C0 | 170/8192 | Ia,Ib,Ic,Ua,Ub,Uc | 电流/电压 |
| C1 | 8.5/8192 | Iac | 接地电流 |
| C2 | 170/8192 | Uphase | 相电压 |
| C3 | 170×8.5/8192 | P | 有功功率 |
| C4 | 1/8192 | cosφ | 功率因数 |
| C5 | 2/8192 | F=50+Y×2/8192 | 频率 |
| C6-9 | 1 | 直通 | 状态量 |

### Logic 层: 12种保护装置

| 编码 | 名称 | 通道数 | 典型测点 |
|------|------|--------|----------|
| 0x00 | DSL-31A 断路器 | 20 | Ia,Ib,Ic,Ua,Ub,Uc,P,cosφ |
| 0x10 | DST-31A 变压器差动 | 15 | Ia,Ib,Ic(差动),Ua,Ub,Uc |
| 0x20 | DBPA-31A 备用电源 | 13 | 电压,开关状态 |
| 0x30 | DSB-31A 变压器后备 | 20 | 同断路器 |
| 0x40 | 电动机保护 | 19 | Ia,Ib,Ic,U,转速 |
| 0x50 | DST-22D 变压器差动 | 20 | 同0x10 |
| 0x60 | DSB-22D 变压器后备 | 20 | 同0x30 |
| 0x70 | DSL-24D 断路器 | 20 | 同0x00 |
| 0x80 | DGP-11 变压器差动 | 21 | 差动保护 |
| 0x90 | DGP-12 变压器后备 | 24 | 后备保护 |
| 0xA0 | DGP-13 接地保护 | 22 | 接地电流,零序 |
| 0xB0 | DMP-31A 电动机 | 19 | 同0x40 |

### Action 层: 数据流

```
RTU ──TCP:53001──→ LegacyComm ──WM_COPYDATA──→ IoMonitor ──OLEDB──→ Oracle
 DCS ──DCOM:135──→ OPC_FC_Client ──psAPI──→ RTDB ──IoCommit──→ Oracle
 A11 ──TCP:8889───→ IM_A11_RTU ──psAPI─────→ RTDB ──IoCommit──→ Oracle
                                                                    ↓
                                                              dgiot_lite
                                                          (WinRM→VBS/ADO)
```

### Security 层

| 系统 | 认证方式 | 凭据 |
|------|----------|------|
| WinRM :5985 | NTLM | administrator / CHANGEME |
| Oracle :1521 | OLEDB | INDUSTRYPROD / industrya11_PASS |
| RTDB :9004 | psAPI | admin / admin888 |
| DCOM :135 | CoInitializeSecurity | DCS侧授权 |

---

## Step 2: 连线成网 — 关系矩阵

### 设备→井→站 映射

```
RTU设备ID (02204060100)
    ├── 井 B1V24VE35 (RES_ID=8038) → 15个测点 (RCV,ZHL,DWL,UWL,DCV,UCV,CHC,SLV,TGP,GYS,ZWG,ZYG...)
    └── 井 B1V4VSE31 (RES_ID=8044) → DSTATUS

OPC DA 站点:
    DX8ZRZ → 2209测点 (变频器 AYD/FTV/FVx)
    DX6PZ  → 3106测点 (报警/频率 ALA/AFR/AFT)
    XZ202TP → 976测点 (开关量 ABx/ACCx)

注水站:
    SYZ105ZYTWZ → ~400测点 (阀门/传感器 VEx/SFEx)
    SY217Z1-4   → ~250测点 (阀门/压力 VPx/VEx)
    XZ208Z1-4   → ~350测点 (温度/开关 TWT/CFT/CST)
```

### 软件→硬件 映射

```
LegacyComm.exe ←──→ port_TCPServer.dll ←──→ 网卡 192.168.10.131
IOMan.exe      ←──→ psAPISDK.dll       ←──→ 192.168.10.130:9004
IoCommit.exe   ←──→ oraOLEDB            ←──→ 192.168.10.129:1521
IOMan.exe      ←──→ OPC Core Components ←──→ DCS :135 (DCOM)
```

---

## Step 3: 设卡立规 — 约束定义

### 时序约束

| 约束 | 阈值 | 来源 |
|------|------|------|
| RTU 轮询间隔 | 1000ms | IoMonitor |
| OPC 刷新时间 | 设备参数 [164] | DeviceStruct |
| 数据提交(实时) | 300ms | IoMonitor.ini |
| 数据提交(历史) | 500ms | IoMonitor.ini |
| 提交批次大小 | 15000点 | IoMonitor.ini |
| SQL 执行周期 | 1000ms | SqlFilSet.ini |
| LegacyComm 超时 | 30s | IoChannelCfg.ini |
| dgiot TCP 超时 | 120s | commbridge_server.py |

### 数据校验约束 (dgiot_lite L2)

| 层级 | 检查项 | 判定 |
|------|--------|------|
| L1 | 帧Len匹配 | abs(expected-actual)≤2 |
| L2 | 值范围 | 0-500A/100-400V/0-300kW |
| L3 | 三相平衡 | Imax-Imin/Iavg<25% |
| L4 | 历时一致 | delta<50% |
| L5 | Oracle对标 | |A-B|/A<1% |

---

## 补充发现 v4.0 — IoProject 进程编排 & 共享内存 IPC (2026-07-13)

### IOMan 命令行格式（从 wmic 进程快照提取）

```
IOMan.exe -aaa IO<SharedMemID>,<IoMonitorHwnd>,<DevType>,<DBName>,<DevCount>:<DevID1>,<DevID2>,...

实例1 (Modbus, type=1): -aaa IO7CEE918,3B6C0B5C,1,IOCommitDB0,10:02012170058,02105100097,...
实例2 (OPC, type=0):    -aaa IO7CEE898,3B6C0B5C,0,IOCommitDB0,10:02110080028,02110110045,...
```

**参数解析**（出自 IOMan.exe 字符串 `IO%X,%X,%d,`）:
| 字段 | 格式 | 含义 |
|------|------|------|
| SharedMemID | `IO%08X` | 共享内存唯一ID（Global命名空间） |
| IoMonitorHwnd | `%08X` | IoMonitor窗口句柄（WM_COPYDATA IPC） |
| DevType | `%d` | 0=OPC DA采集, 1=Modbus RTU采集 |
| DBName | `string` | IOCommit数据库编号（IOCommitDB0） |
| DevCount | `int` | 设备数量 |
| DevIDs | `long,...` | 设备ID列表（从Oracle PROJECT_IODATASOURCE） |

### IoProject → IOMan 进程编排机制

```
IoProject.exe (不依赖psAPI — 纯Win32 MFC)
    │
    │ CreateProcess("IOMan.exe -aaa IO<id>,<hwnd>,<type>,...")
    │
    ├── IOMan ×18 (type=1, Modbus RTU via LegacyComm)
    ├── IOMan ×5  (type=0, OPC DA DCOM → 172.23.9.x)
    ├── IOMan ×7  (type=0, OPC DA DCOM → 172.28.5.x)
    └── IOMan ×6  (A11 TCP → :8889)

IPC: Global\ 命名共享内存 + CMutualEvent + Windows消息(WM_COPYDATA)
关键DLL: iomem.dll (IO端口读写), psAPISDK.dll (RTDB客户端)
```

### 依赖链（根因分析）

```
RTDB Server (130:8889, 必需!)
    ↑ psAPI TCP协议
IoMonitor.exe (可启动 ✅, PID 304, 32MB, 不依赖RTDB启动但无法connect)
    ↑ FindWindow + 共享内存
IoProject.exe (退出code=0 — 找不到IoMonitor窗口时静默退出)
    ↑ CreateProcess
IOMan.exe (退出code=0 — ConnectEx返回-19998 "未初始化")
    ↑ psAPI
RTDB Server ← 无法得知协议帧格式
```

**关键发现**: IoProject.exe/ComeBridge.exe 不依赖 psAPI，可独立运行。IoMonitor.exe 可启动但不连RTDB则无功能。所有 psAPI 依赖项 (IOMan/IoCommit) 需要 RTDB 服务运行才能初始化。

### 本地模拟环境 1:1 映射

| 生产实体 | 本地模拟 | 状态 |
|---------|---------|------|
| LegacyComm.exe :53001 | Python CB :53002 | ✅ 真二进制可跑 |
| IoMonitor.exe | Python :9002 | ✅ 真二进制可启动 |
| IoCommit×7 | Python :9003 | ✅ |
| IoProject | Python :9001 | ✅ |
| RTDB :8889 | Python mock :18889 | ✅ 协议模拟 |
| OPC DA DCOM :135 | Python :13500 | ✅ |
| Modbus :502 | Python :502 | ✅ |
| IOMan×36 | Python 采集器 | ✅ 内嵌 |
| RTU×191 | RTU模拟器 | ✅ 5-100台可配 |
| Oracle 11g | SQLite/内存 | ✅ |

### RTDB 协议探测结论

| 方法 | 结果 |
|------|------|
| psAPISDK.dll (32bit) ctypes 加载 | ✅ 成功 |
| psAPI_Common_StartAPI("") | ✅ ret=0 |
| psAPI_Server_Connect(任意参数) | ❌ ret=-19998 (未初始化) |
| psAPI_Server_ConnectEx(130:8889) | ❌ ret=-19998 或 Segfault |
| 直接socket探测 130:8889 | ❌ 发任何数据即关闭连接 |
| netsh trace 30s抓包 | ✅ 7路TCP, 10MB, 无payload |

**结论**: RTDB 使用专有二进制协议，需要 SDK 头文件获取结构体定义才能正确调用。CSDN 上有 6.0.1.9 版 C# 开发包（含头文件/静态库）。在此之前使用纯 Python socket mock。

### 完整设备清单（20台 IOMan 设备 + LegacyComm RTU）

从 IOMan 命令行提取：
```
02012170058, 02105100097, 02105110008, 02106290043, 02106290052,
02106290085, 02107010048, 02107030091, 02107190091, 02110080020,
02110080028, 02110110045, DEVICE_ID_PLACEHOLDER, 02110150030, DEVICE_ID_PLACEHOLDER2,
02110150046, 02110160086, 02111260034, 02111270046, 02111270058
```

## Step 4: 闭环验证

| 验证项 | 方法 | 证据 | 状态 |
|--------|------|------|------|
| LegacyComm协议帧 | 95K报文全量 | 异常率0.017% | ✅ |
| RTU注册包格式 | 2211包, 413种ID | 全部0xAA+ASCII+0x0D | ✅ |
| float32/int16识别 | ByteCount%4 | 67%/33% | ✅ |
| 数据公式验证 | 170/8192标定 | CT变比30:1→PF=0.77 | ✅ |
| Oracle点位映射 | SYS_POINTRELATION→TAGPAR | 54口井×23通道 | ✅ |
| OPC设备配置 | DeviceStruct反编译 | 17字段结构体验证 | ✅ |
| SQL执行链路 | SqlFilSet.ini | EXECUTECYC 1000ms→Oracle | ✅ |
| 崩溃历史 | 13个dump文件 | AdoInterface×8, LegacyComm×5 | ✅ |
| dgiot Server替代 | 真实注册包回放 | 查询帧格式一致 | ✅ |

---
> 数据源: pcapng(584MB) + Oracle(61K点) + PDB(4732符号) + 199文件(全量精读)
> 新发现: OPCClientCfg(Kepware CLSID) + DeviceStruct(17字段) + SqlFilSet(执行链路) + 崩溃dump(13个)

---

## OPC DA 数据访问 — 五条路径全景 (2026-07-13)

> 核心目标: **自主选择参数读取 OPC DA 实时数据** — 指定设备ID+Tag名, 读取当前值

### 路径对比

| # | 路径 | 访问层 | 实时性 | 离线 | 状态 |
|---|------|--------|:---:|:---:|:---:|
| ① | Python mock 全栈模拟 | 本地 socket | 准实时 | ✅ | ✅ 已验证 |
| ② | dgiot_lite Oracle 管线 | SQL 同步 | 历史 | ❌ 需131 | ✅ 油气数据已通 |
| ③ | psAPISDK.dll → RTDB | 共享内存/TCP | 实时 | ❌ 需130 | ❌ Connect阻塞 |
| ④ | IoProject 启动自定义 IOMan | 进程注入 | 实时 | ❌ 需131 | ⬜ 待验证 |
| ⑤ | DCOM 直连 Kepware OPC DA | WinRM中转 | 实时 | ❌ 需131 | ⬜ WinRM脚本就绪 |

### 路径①: Python Mock 全栈模拟 ⭐推荐离线开发

```bash
python tools/dev_env.py --scale 20
```

```
本机 127.0.0.1:
  LegacyComm  :53002  ← DTU/RTU
  IoMonitor   :9002   ← 数据汇聚
  IoCommit    :9003   ← 数据写入
  OPC DA      :13500  ← OPC 数据源
  RTDB      :18889  ← RTDB 数据源
  Modbus TCP  :502    ← 直连轮询
```

**选择参数**: 修改 `REAL_DEVICES` 字典或 `--scale N`
**适用**: 离线开发、协议验证、采集器测试
**局限**: 数据为模拟值, 非真实场站读数

### 路径②: dgiot_lite Oracle 管线

```
131 Oracle (INDUSTRYPROD) → WinRM / VBS / ADO → dgiot_lite :8000 /api/devices
```

当前已同步: 274 设备 · 261,488 遥测行 (油气 `oil_field_industry`)
待扩展: IOCommitDB 表结构 → IO 设备遥测

**选择参数**: 修改 `oracle_pipeline.py` 中的 SQL 查询表名
**适用**: 历史趋势分析、批量导入
**局限**: 分钟级延迟, 非实时

### 路径③: psAPISDK.dll → RTDB (TCP:8889)

```
Python (32bit) → ctypes → psAPISDK.dll → Net_Init → ConnectEx → SubscribeAndRead
                                         ↑ 成功     ↑ -19998
```

**已确认**:
- 32 位 Python 加载 DLL ✅
- `psAPI_Common_StartAPI("")` return 0 ✅
- `Net_Init(NULL,NULL,0)` return 0 ✅
- 3525 导出函数全量枚举 ✅
- `psAPI_Server_Connect*` 全部返回 -19998 ❌

**阻塞原因**: RTDB 私有二进制协议, 服务端 130:8889 不发任何握手数据即关闭连接
**解除方法**: 获取 RTDB 6.0.1.9 SDK 头文件 (`psConnectPara` 结构体定义)
**CSDN 链接**: https://blog.csdn.net/websocket5live/article/details/161912273

**关键导出函数**:
```
Net_Init(callback1, callback2, flags)       → 网络层初始化
Net_ConnectServer(psConnectPara*, wchar_t*) → 连接远程RTDB
Net_SendMsgData(handle, ACE_Message_Block*) → 发送消息
psAPI_Real_NewSubscribeAndRead(...)          → 订阅+读取
psAPI_Real_ReadList(...)                     → 批量读标签订阅
psAPI_Real_Write(...)                        → 写标签值
psAPI_Alarm_*. Subscribe/Query              → 告警订阅
psAPI_His_Read*. ReadProcessed/Raw          → 历史数据
```

### 路径④: IoProject 启动自定义 IOMan

```
WinRM → 131: IoProject.exe 已连接 IoMonitor(Hwnd:3B6C0B5C)
       → 启动新 IOMan.exe -aaa IOCUSTOM01,3B6C0B5C,0,IOCommitDB0,2:02204060100,02105100097
       → IOMan 连接 RTDB → 采数据 → WM_COPYDATA → IoMonitor → Oracle
```

**命令格式** (已验证):
```
IOMan.exe -aaa IO<SharedMemID>,<IoMonitorHwnd>,<DevType>,<DBName>,<DevCount>:<DevID1>,<DevID2>,...
```

**现有 8 个 IOMan 实例** (type=0 为 OPC, type=1 为 Modbus):
```
PID 4288: type=1 IO7CEE918 → 02012170058~02110080020 (10设备)
PID 7176: type=0 IO7CEE898 → 02110080028~02111270058 (10设备)
PID 13248: type=0 IO7CEDF98 → 02111290042~02203310103 (10设备)
PID 4472: type=0 IO7CEDC98 → 02203310133~02204010134 (10设备)
PID 7876: type=0 IO7CEE298 → 02204010137~02204020062 (10设备)
PID 7524: type=0 IO7CEE998 → 02204020143~02204060028 (10设备)
PID 5508: type=0 IO7CEEB98 → 02204060029~21001080001 (10设备)
PID ?:    type=0 IO7CEE798 → 21001080002~... (10设备)
```

**风险**: 生产机启动新进程, 共享内存+IOCommitDB可能冲突
**工具**: `tools/launch_custom_ioman.py`

### 路径⑤: DCOM 直连 Kepware OPC DA

```
本地 → WinRM → 131 → DCOM(:135) → Kepware(192.168.10.23/9.23, CLSID:6E6170F0-...)
                                   → GetOPCServers() → Connect(ProgID)
                                   → OPCGroups.Add → OPCItems.AddItems(tags)
                                   → SyncRead → 返回值
```

**OPC DA 标准流程**:
```
1. CoInitializeEx(COINIT_MULTITHREADED)
2. CoGetClassObject(CLSID, CLSCTX_REMOTE_SERVER, host) → IOPCServer
3. GetOPCServers() → ProgID 列表
4. Connect(ProgID)
5. OPCGroups.Add("name") → Group
6. OPCItems.AddItems(count, tag_names) → ServerHandles
7. SyncRead(OPCDevice, count, server_handles) → (ItemID, Value, Quality, Timestamp)
```

**Tag 命名规则** (推测): `设备ID.测点名` 如 `02204060100.Ia`
**工具**: `tools/opc_da_test.py` (WinRM 中转脚本就绪, base64 传输待修复)
**已知 DCS 端点**:
| IP | 功能 | CLSID |
|------|------|-------|
| 192.168.10.23 | Kepware OPC DA | 6E6170F0-FF2D-11D2-8087-00105AA8F840 |
| 192.168.10.23 | Kepware OPC DA | 同上 |
| 172.26.6.3 | Kepware OPC DA | 同上 |
| 172.28.5.200 | OPC DA (10+ DCOM连接) | 待确认 |
| 192.168.10.23 | OPC DA | 待确认 |

### 推荐策略

```
开发调试 → 路径① (离线 mock, 零依赖)
历史查询 → 路径② (Oracle 管线,分钟级)
实时采集 → 路径④ (IoProject 启动IOMan) 或 路径⑤ (DCOM直连)
          → 路径③ 等拿到SDK头文件后解锁
```
