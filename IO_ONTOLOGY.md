# IO 服务器本体论 — DLAS 四层模型

> 基于 ontology-builder 方法论 · 2026-07-11

## Step 1: 盘点到齐（实体发现）

### Data 层 — 物理世界

| 实体类别 | 数量 | 实例 |
|---------|------|------|
| 服务器 | 5 | 11.66.12.131(IO), 130(pSpace), 129(Oracle), 113.78(DMZ), 191.155(开发机) |
| 网卡 | 6 | Intel X520 ×4 + X722 ×4 |
| DCS 端点 | 5 | 172.23.9.3(DCS-A), 172.23.18.194(DCS-B), 172.26.6.3(DCS-C), 172.21.14.192(DCS-D), 172.28.5.200(DCS-E) |
| RTU 设备 | 206 | 11.248.x(139台), 11.249.x(89台), 11.250.x(72台) |
| 无线终端 | 31 | GPRS/CDMA 终端 (CommBridge 管理) |
| GCU331 发电机组 | 1 | S7-200 PLC, 11个OPC标签 |

### Logic 层 — 规则引擎

| 实体类别 | 数量 | 说明 |
|---------|------|------|
| pSpace 进程 | 5类×46实例 | IoProject(1), IOMan(36), IoMonitor(1), CommBridge(1), IoCommit(7) |
| 协议解析器 | 5 | A11, Modbus TCP, OPC DA, Oracle TNS, HDLC+TLS |
| 量程公式 | 5 | Ia=Y×170/8192, Ua=Y×170/8192, P=Y×170×8.5×√3/8192, cosφ=Y/8192, F=50+Y×2/8192 |
| 保护装置类型 | 12 | DSL-31A, DST-31A, DBPA-31A, DSB-31A, DGP-11/12/13, 电动机保护等 |

### Action 层 — 执行闭环

| 实体类别 | 数量 | 说明 |
|---------|------|------|
| 数据采集通道 | 9 | Modbus RTU, OPC DA(5路), A11, CommBridge, S7-TCP |
| 告警事件 | 57 | Device.ini 定义的告警字符串 (CPU故障, RAM故障, EEPROM故障等) |
| 保护事件 | 11-16 | 速断动作, 延时速断, 过流动作, 重合闸等 |
| 数据库提交 | IoCommit×7 | 实时300ms/历史500ms 批量写入 Oracle |

### Security 层 — 权限与合规

| 实体类别 | 说明 |
|---------|------|
| 认证 | WinRM administrator, Oracle DQYTPROD |
| DCOM 安全 | 5个DCS端点均拒绝远程OPC调用 |
| 操作约束 | 只读抓包, 禁止安装, 禁止停服 |
| 网络隔离 | 开发机双网卡, 企业内网通过路由隔离 |

## Step 2: 连线成网（关系建模）

```
IOMan ×36 ──[OPC DA/DCOM]──→ DCS-A/B/C/D/E (RSLinx/WinCC)
IOMan ×36 ──[Modbus TCP]──→ 206台 RTU (11.248/249/250.x)
IOMan ×36 ──[A11 5a5a]──→ pSpace A11 (11.66.12.130:8889)
IoProject ──[pSpace API]──→ IOMan ×36
IoMonitor ──[GUI事件]──→ 实时数据展示
CommBridge ──[GPRS/CDMA]──→ 31台无线终端
IoCommit ×7 ──[Oracle TNS]──→ 功图库 (11.66.12.129:1521)
开发机 ──[WinRM:5985]──→ IO服务器 (11.66.12.131)
开发机 ──[netsh trace]──→ 抓包分析
```

### 关系矩阵 (N×N)

| 源→目标 | IOMan | IoProject | IoCommit | CommBridge | DCS | RTU | Oracle |
|---------|-------|-----------|----------|------------|-----|-----|--------|
| IOMan | - | reportsTo | - | - | connectsTo | connectsTo | - |
| IoProject | manages | - | dispatchesTo | manages | - | - | - |
| IoCommit | - | receivesFrom | - | - | - | - | writesTo |
| CommBridge | - | reportsTo | - | - | - | - | - |

## Step 3: 设卡立规（约束定义）

### 采集约束

| 约束 | 阈值 | 来源 |
|------|------|------|
| Modbus 采集间隔 | 1000ms | IoMonitor 配置 |
| 命令间隔时间 | 60s | IoMonitor 配置 |
| 数据提交间隔 | 实时300ms / 历史500ms | IoMonitor.ini |
| 提交标签数 | 15000/批 | IoMonitor.ini |
| 总标签数 | 100万 | IoMonitor.ini |

### 设备约束

| 约束 | 条件 | 动作 |
|------|------|------|
| 最大载荷超限 | > 额定载荷 × 1.2 | 告警 + 写数据库 |
| 电流异常 | 三相不平衡 > 15% | 保护跳闸 |
| CommBridge 通道失败 | 连接失败 | 重试 + 日志 |
| CPU 故障 | 自检异常 | 告警 + 停机 |

### 安全约束

| 约束 | 规则 |
|------|------|
| 生产网操作 | 只读抓包, 禁止安装/停服/写入 |
| WinRM 访问 | 仅 administrator, 端口 5985 |
| DCOM 连接 | 需 DCOMCNFG 授权, 当前全部拒绝 |
| Oracle 访问 | DQYTPROD, 密码加密存储 |

## Step 4: 闭环验证

| 验证项 | 状态 | 证据 |
|--------|------|------|
| Modbus 数据采集 | ✅ | 206台 RTU 真实报文, 模拟器已运行 |
| A11 协议解析 | ✅ | 93913帧 (7.10), 34130帧 (7.3) |
| OPC DA 旁路 | ⚠️ | 72923帧可识别, DCOM 拒绝直连 |
| Oracle 连接 | ⚠️ | 32位OLEDB已通, 密码待确认 |
| 实时事件 | ✅ | IoMonitor GUI 每秒输出载荷/电流值 |
| psAPI SDK | ⚠️ | StartAPI=0, 其他函数签名待文档 |

---
> 方法论: ontology-builder DLAS 四步法
> 数据源: io_server.db (14表, 109记录)
> 交付物: io_ontology.json + IO_ONTOLOGY.md + io_server.db
