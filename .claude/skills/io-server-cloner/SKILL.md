# IO Server Cloner — 生产IO服务器 1:1 克隆模拟环境构建

## 触发

用户提到"克隆IO服务器"、"搭建模拟环境"、"1:1模拟"、"离线调测环境"时使用。

## 目标

给定一台生产IO服务器（IP可达、WinRM可连），在本地构建一个**完全离线、1:1比例**的模拟环境，用于：
- 离线开发调测
- 协议分析和验证
- 采集器功能测试
- 新人学习平台架构

## 五阶段流程

### 阶段1：侦察（只读，不破坏）

```powershell
# 1.1 进程快照 — 搞清楚运行了什么
wmic process get ProcessId,Name,CommandLine /format:csv

# 1.2 网络快照 — 搞清楚连了谁
netstat -ano | findstr "ESTABLISHED LISTENING"

# 1.3 提取设备列表 — 从 IOMan 命令行参数
wmic process where "name='IOMan.exe'" get CommandLine
# 格式: -aaa IO<SharedMemID>,<Hwnd>,<Type>,<DBName>,<Count>:<DevID1>,<DevID2>,...

# 1.4 配置文件
dir /s /b *.ini *.cfg *.txt  # IO ServerOnLine 目录
type Device.ini              # 设备类型定义
type IoChannelCfg.ini        # 通道配置
```

**关键输出**：
- `IOMan 命令行` → 真实设备 ID 列表 + 类型
- `Device.ini` → 12种设备类型 + 通道映射 + 转换系数
- `netstat` → 服务器端口拓扑

### 阶段2：协议捕获

```powershell
# 2.1 netsh trace 被动抓包
netsh trace start capture=yes tracefile=C:\Users\Administrator\cap.etl
timeout /t 300
netsh trace stop

# 2.2 转文本分析
netsh trace convert cap.etl dump=txt
```

**关键输出**：TCP连接拓扑、协议帧结构、数据频率

### 阶段3：配置提取

从二进制/文本中提取：

| 来源 | 提取内容 |
|------|---------|
| IOMan wmic 输出 | 设备ID → 类型映射 |
| Device.ini | 每类型通道数、系数、量程 |
| IoChannelCfg.ini | 通道打开间隔、超时 |
| Event.txt | 设备ID格式、IP前缀 |
| IOMan.exe strings | 协议格式 (`IO%X,%X,%d,`) |

### 阶段4：构建模拟

按真实拓扑1:1构建Python mock服务：

```python
# 核心模板
class MockService:
    def __init__(self, port):
        self.sock = socket.socket(...)
        self.sock.bind(("0.0.0.0", port))
        self.sock.listen(50)

    def handle(self, conn, addr):
        # 按逆向的协议格式处理请求
        data = conn.recv(4096)
        # 解析协议 → 生成模拟数据 → 返回响应
```

**必须模拟的服务**（按真实端口比例）：
1. **数据源层** — pSpace/OPC/Modbus 服务器
2. **桥接层** — CommBridge (DTU透传)
3. **汇聚层** — IoMonitor (数据中转)
4. **持久层** — IoCommit (数据写入)
5. **编排层** — IoProject (进程管理)

**数据引擎** — 按设备类型生成带物理量纲的遥测值：
```python
# Device.ini ChangeData 转换
物理值 = 原始值 × Coefficient[i]
Coefficient = [170/8192, 8.5/8192, 170/8192, ...]
# 叠加缓慢漂移 + 高斯噪声模拟真实工况
```

### 阶段5：验证

```python
# 5.1 连通性
for port in [502, 53002, 9002, 9003, 18889, 13500]:
    assert can_connect("127.0.0.1", port)

# 5.2 协议握手
assert modbus_read_holding("127.0.0.1", 502, unit=1, addr=0, count=4)

# 5.3 数据管线
assert commbridge_poll("127.0.0.1", 53002) → IoMonitor → IoCommit

# 5.4 规模验证
assert len(online_rtus) == len(device_ids)
```

## 产物清单

一次完整的克隆产生以下文件：

```
tools/
├── dev_env.py              # 一键启动全栈模拟
├── mock_opc_server.py      # Modbus TCP 模拟
├── probe_pspace_proto.py   # pSpace 协议探测 + 模拟
├── simulate_131_fullscale.py # 全量设备模拟
└── run_commbridge_local.py # CommBridge 协议模拟

logs/
├── 131_fullscale_packets.jsonl  # 报文日志
└── dev_env_stats.jsonl           # 运行统计
```

## 操作原则

- ✅ WinRM 只读查询
- ✅ netsh trace 被动抓包
- ✅ strings 静态分析二进制
- ✅ Python socket 模拟
- ❌ 不安装/重启/停服
- ❌ 不写生产配置/注册表
- ❌ 不用生产数据做压力测试
