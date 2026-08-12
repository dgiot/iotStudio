# ontology-builder — 本体论工程技能

> 本体论是场景智能化的**设计图纸**，IoT给AI**真实世界**，AI读图纸+看世界=判断。

## 核心理念

```
本体论 (Ontology)  = 场景智能化的设计图纸
    ├── Data层:    这张图长什么样（252实体 · 实体关系）
    ├── Logic层:   图上什么是危险（15条SWRL规则）
    ├── Action层:  危险怎么办（处置策略）
    └── Security层:谁有权看（ACL/CLP）

IoT (真实世界)     = 此刻这个世界实际是什么样的
    └── 脑电/视频/水电气网实时流

AI (大脑)          = 读图纸 + 看世界 = 判断
    └── "图纸上基线是X，IoT信号偏离Y → 应激态"
```

**这个类比为什么强：**
- 评审（企业专家≥50%）大概率没写过本体论，但人人都理解"图纸 vs 现实"
- "图纸+现实→判断" = 可解释（AI告诉你"图纸第几条规则触发了"）
- 干掉"本体论像过时专家系统"的质疑 — 这不是专家系统，是**场景智能化的设计规范**

## IoT 层 — 场景智能化的真实世界

> IoT 给本体注入实时血液：本体图纸是"这个人正常的血压基线是 120/80"，IoT 告诉 AI "此刻是 160/100"。

### 协议矩阵 (dgiot_lite 已覆盖)

| 协议 | 端口 | 采集方向 | 工业场景 |
|------|------|----------|----------|
| **Modbus TCP** | 502/1502/2502 | 读写寄存器 | 光伏逆变器、储能PCS、充电桩 |
| **Modbus RTU** | 串口 | RS485轮询 | 电表、传感器 |
| **IEC 104** | 2404 | 遥测遥信 | 电力远动、储能PCS |
| **OPC UA** | 4840 | 订阅/轮询 | 充电桩、PLC统一架构 |
| **OPC DA** | 9090 (COM) | Windows COM/DCOM | 光储充数据源（IO服务器） |
| **A11 CNPC** | 8889 | 行业私有协议 | 油气田RTU（142测点） |
| **MQTT** | 1883 | 发布/订阅 | 边缘中枢、DG-IoT推送 |
| **HTTP REST** | 80/443 | API轮询 | 第三方平台对接 |

### 数据管道

```
模拟器/真实设备
    ↓ 协议适配 (src/protocols/)
采集引擎 (src/services/collector.py)   ← on_data 回调链
    ├── TDengine / SQLite 时序存储    ← batch_insert 合并写入
    ├── 告警引擎 (AlarmEngine)         ← 阈值+规则评估
    ├── 安全管道 (SafetyPipeline)      ← ESD/互锁/权限
    ├── 推送引擎 (PushEngine)          ← MQTT/HTTP 上行
    ├── PHM 健康评估                   ← 故障模式概率
    └── WebSocket 广播                 ← 实时推前端
```

### 边缘中枢架构 (Edge Hub Alignment)

```
IO服务器 (131/130)                    dgiot_lite (本机)
┌──────────────┐                    ┌─────────────────┐
│ WinRM采集    │ ── MQTT Bridge ──→ │  Parse 本体存储  │
│ A11采集      │ ── TCP :8889 ───→ │  TDengine 时序库  │
│ OPC DA采集   │ ── COM :135  ───→ │  规则引擎         │
│ Oracle管道   │ ── JDBC :1521 ─→  │  告警/PHM         │
└──────────────┘                    │  前端 (Vue3 SPA)  │
                                    └─────────────────┘
```

### IoT 数据特征 (与本体的对照)

| 本体图纸 (静态) | IoT 数据 (动态) | AI 判断 |
|----------------|-----------------|--------|
| 设备类型=逆变器 | 此刻 Ia=45.2A | 运行正常 |
| 告警规则=Ia>100A | 实时 Ia=112A | 过流告警 |
| 基线：温度<65°C | 实时温度=72°C | 散热异常 |
| 健康度基线=0.95 | 最近趋势=-0.12/天 | 衰退预警 |

## 四层本体模型 (对齐 dgiot_ontology.erl)

| 层 | 实体 | 说明 |
|----|------|------|
| 层1 | **Site** | 物理站点 — 采油厂/井场/变电站 |
| 层2 | **Gateway / Channel** | 边缘网关/协议通道 — IO服务器、Modbus通道 |
| 层3 | **Device** | RTU/传感器/执行器 |
| 层4 | **Point** | 测点 — 物模型 identifier，产品内唯一 |

MQTT Topic 标准：`$dg/thing/{product_id}/{product_id}_{devaddr}/properties/report`

## 与本工程的关系

- 本体引擎位于 `src/ontology.py` — 四层模型（Site→Gateway→Device→Point）
- 关联 parse_lite 持久化 + SWRL 规则推理
- 与 `dgiot_collector/` 的 IO 服务器本体扫描联动（`system_api.py` WinRM 采集 → 自动注册）

## 触发场景

- 写方案文档、评审PPT、论文时需要解释本体论价值
- 设计新的物模型 / 设备模板 / 测点映射
- 调试 SWRL 规则推理链路
- 与 DG-IoT 主平台做本体同步

## 参考

- 内存文件: [[ontology-scenario-intelligence]] — 设计图纸类比原文
- `D:\ai\dgiot_lite\src\ontology.py` — 四层引擎实现
- `D:\ai\dgiot_lite\src\web\system_api.py` — WinRM 本体自动扫描
