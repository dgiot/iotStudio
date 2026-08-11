# IO 服务器采集规律与品性分析

> 目标: 边缘中枢下发采集指令前，摸清现有 IO 服务的节奏、资源余量和冲突边界
> 来源: pcapng(95K报文) + IoMonitor.ini + SqlFilSet.ini + Device.ini + 现场观察

---

## 一、采集节拍 — 谁在什么频率采

```
进程          采集对象            间隔       数据量/次      提交周期
═══════════════════════════════════════════════════════════════
CommBridge    191 RTU             1s         20寄存器      实时(300ms)
OPC_FC×5      5 DCS              实时       订阅推送       实时(300ms)  
A11×7         pSpace :8889        1-5s      变长帧         实时(300ms)
IoCommit×7    Oracle批量写        批处理     15000点/批     300ms(实时)
                                                         500ms(历史)
```

### 时序约束 (IoMonitor.ini)

| 参数 | 值 | 含义 |
|------|-----|------|
| CommitRealSpan | 300ms | 实时数据提交间隔 |
| CommitHisSpan | 500ms | 历史数据提交间隔 |
| CommitTagOnce | 15000 | 单次提交点数上限 |
| MaxTagCount | 100万 | 总标签数上限 |
| DataDelay | 5ms | IO提交延迟 |

### SQL 执行周期 (SqlFilSet.ini)

| 参数 | 值 |
|------|-----|
| EXECUTECYC | 1000ms |
| TASKALLOCATIONCYC | 2-5ms |
| ADOCOUNT | 1-4 |

---

## 二、资源占用 — 有多少余量

### CommBridge.exe (PID 19240)

```
内存:    26MB
CPU:     0% (基于 tasklist CPU Time)
TCP连接: 191 × ESTABLISHED
端口:    53001 (TCP, 仅绑定 11.66.12.131)
网络:    每RTU ~100B/s × 191 = ~19KB/s 上行
         每RTU ~12B/次查询 × 191 = ~2.3KB/s 下行
```

### IOMan.exe ×36

```
每个进程: ~10-20MB
总内存:   ~500MB
OPC DA:   5个DCOM连接 (订阅模式, 非轮询)
A11:      7个TCP连接 (轮询模式)
Modbus:   24个进程 (通过CommBridge)
```

### IoMonitor.exe (PID 18400)

```
内存:    ~50MB
数据库:  OLEDB连接池 (ADOCOUNT=1-4)
写库:    300ms批量提交
```

### 余量评估

| 资源 | 使用 | 上限 | 余量 |
|------|------|------|------|
| TCP连接 | 191+12=203 | 65535 | 充足 |
| CPU | <5% | 100% | 充足 |
| 内存 | ~1.2GB | 未知 | 中等 |
| Oracle连接 | 4 ADO | 许可限制 | 紧张 |
| CommBridge吞吐 | ~20KB/s | 网卡100M | 充足 |

---

## 三、采集冲突边界 — 什么是安全的下发时机

### 不能碰的

```
1. CommBridge :53001  → 191 RTU 的查询节奏不能打断
   后果: RTU断线→IoMonitor告警→Oracle数据缺失

2. OPC DA DCOM 连接 → 5个DCS端点不能重连
   后果: DCOM超时→IOMan崩溃(有dump历史)

3. Oracle OLEDB 连接池 → ADOCOUNT=1时不能抢占
   后果: IoCommit写库失败→数据丢失

4. A11 :8889 通道 → 7个IOMan进程共用
   后果: 采集数据延迟→实时监控断流
```

### 安全的下发策略

```
✅ 可下发时段:
  - CommitRealSpan间隙 (300ms的80%空闲)
  - CommBridge查询间隔末尾 (1s轮询的最后200ms)
  - SQL EXECUTECYC 间隙 (1000ms的非执行窗口)

✅ 可下发的通道:
  - dgiot :53002 (独立端口, 不影响 :53001)
  - 直连 Oracle 读操作 (只读, 不竞争写锁)
  - 新增 TCP 连接 (端口余量充足)

❌ 不可下发的通道:
  - CommBridge :53001 (会干扰RTU轮询)
  - DCOM :135 (会触发DCS安全策略)
  - OLEDB 写操作 (会竞争IoCommit)
```

---

## 四、点位信息全量

### Modbus RTU (SYS_POINTRELATION_WELL)

```
总数:   4,567 点
井数:   54 口 (B1VxxxVxxx 格式)
每井:   约23 通道
站:     CY1C8K (南4联合站)
设备:   12种保护装置 (DSL-31A ~ DMP-31A)

典型井 B1V24VE35 (RES_ID=8038):
  测点: RCV,ZHL,DWL,UWL,DCV,UCV,CHC,SLV,CPV,TGP,GYS,ZWG,ZYG
```

### OPC DA (SYS_POINTRELATION_STATION)

```
总数:   26,081 点
DX遥测: 16,372 (DX8ZRZ/DX6PZ/DX5ZRZ联合站)
JB遥信: 915    (阀门/报警状态)
Z注水:  8,794  (SYZ105ZYTWZ/SY217/XZ208注水站)

DX8ZRZ: 变频器(AYD/FTV/FVx)
DX6PZ:  报警/频率(ALA/AFR/AFT)  
XZ202TP: 开关量(ABx/ACCx)
```

### pSpace 历史 (CY1C7K)

```
pSpace tags: 16,663 点
pSpace wells: 1,032 口
```

---

## 五、完整关联关系

```
南4联合站 (CY1C8K)
│
├── CommBridge :53001
│   └── 191 RTU (11.248-250.x)
│       └── 54 口井 (SYS_POINTRELATION_WELL)
│           └── 12 种保护装置 (Device.ini)
│               └── 7 个 ChangeData 公式
│
├── OPC DA (5 DCS端点)
│   └── IOMan ×5 → Kepware OPC Server
│       └── DX8ZRZ/DX6PZ/DX5ZRZ (联合站)
│           └── 26,081 测点
│
├── A11 (7 IOMan)
│   └── pSpace :8889
│       └── CY1C7K 历史数据
│           └── 16,663 tags
│
├── IoMonitor
│   └── Oracle DQYTPROD
│       ├── 实时: CommitRealSpan=300ms
│       └── 历史: CommitHisSpan=500ms
│
└── dgiot_lite :53002 (待命)
    └── 协议兼容, 独立端口, 不影响生产
```

## 六、边缘中枢下发指令的安全边界

```
安全指令类型:
  ✅ 查询: GET  /api/classes/Device  → 读Oracle, 无副作用
  ✅ 遥测: GET  /api/telemetry/{id}/{point} → 读时序库
  ✅ 扫描: dgiot :53002 协议查询 → 独立通道
  ✅ 统计: Oracle COUNT/GROUP → 只读

危险指令类型:
  ❌ 写入: POST/PUT/DELETE Device → 通过IoCommit竞争
  ❌ 控制: Modbus Write Register → 可能写错RTU
  ❌ 重连: DCOM Reconnect → 触发DCS安全策略
  ❌ 批量: 大批SQL查询 → 竞争OLEDB连接池

建议:
  1. 所有写操作限制在 dgiot :53002 通道
  2. Oracle 查询通过 WinRM 中继, 不直连 OLEDB
  3. 下发频率限制在 CommBridge 轮询间隙 (200ms窗口)
  4. 批量操作限流: 每次<100条, 间隔>5s
```
