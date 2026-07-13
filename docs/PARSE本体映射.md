# Parse 数据模型 — 本体映射

> 将 parse.db 的 JSON 表结构映射到 DLAS 四层物理世界
> 更新: 2026-07-13

---

## 一、表 → 本体实体映射

| Parse 表 | DLAS 层 | 物理实体 | 关系 |
|----------|---------|----------|------|
| **Product** | Data | 产品类型 (逆变器/PCS/充电桩/油井) | 1 Product → N Device |
| **ProductTemplet** | Logic | 产品模板 (通道模板/协议/测点定义) | 1 Product → 1 Template |
| **Device** | Data | 物理设备 (油井/逆变器/电表) | N Device → 1 Station |
| **Channel** | Logic | 采集通道 (Modbus/OPC/HTTP) | 1 Channel → N Device |
| **Alarm** | Action | 告警事件 | N Alarm → 1 Device |
| **_User** | Security | 用户/角色 | 用户 → 权限 → 设备 |
| **Telemetry** | Data | 测点时序值 | N Telemetry → 1 Device |

## 二、JSON Schema 定义

### Product (产品类型)
```json
{
  "objectId": "oilwell",
  "name": "抽油机",
  "devType": "oilwell"
}
```
→ 本体映射: 设备大类, 对应 DG-IoT 的 Product

### Device (设备实例)
```json
{
  "devaddr": "oilwell_0003",        // 设备唯一ID → 对应 RTU 设备ID
  "name": "井2-27-阳3",             // 井号
  "device_type": "oilwell",         // FK → Product.objectId
  "protocol": "modbus_tcp",         // FK → Channel.cType (隐式)
  "ip": "11.248.203.240",           // RTU IP
  "status": "online",               // 状态机: online/offline/alarm
  "isEnable": true,
  "station_id": "CY1C8K",           // FK → Station (IO_ONTOLOGY)
  "basedata": {
    "manufacturer": "大庆油田",
    "model": "CYJ10-4.2-53HB",
    "ct_ratio": 30,                 // CT变比
    "pt_ratio": 1                   // PT变比
  },
  "tenant_id": "default"
}
```
→ 本体映射: 1 Device ↔ 1 油井 (IO_ONTOLOGY B1VxxxVxxx)

### Channel (采集通道)
```json
{
  "cType": "modbus_tcp",            // 通道类型 → 协议
  "name": "CommBridge通道",
  "status": "running",
  "config": {
    "host": "11.66.12.131",
    "port": 53001,
    "devices": ["oilwell_0000", ...], // 管辖的设备列表
    "poll_interval": 1.0
  }
}
```
→ 本体映射: 1 Channel ↔ 1 IOMan 进程 / CommBridge

### Alarm (告警)
```json
{
  "device_id": "oilwell_0003",
  "title": "A相过流",
  "severity": "danger",             // danger/warning/info
  "status": "active",               // active/cleared
  "message": "Ia=456A > 400A限值",
  "source": "L2_range_check"
}
```

## 三、本体关系图

```
Product (oilwell)                  IO_ONTOLOGY
    │                                  │
    │ devType                           │
    ↓                                  │
ProductTemplet ──→ 测点模板              │
    │ (A,B,C相电流电压/功率/套压/冲程)     │
    ↓                                  │
Device (oilwell_0003) ──────────→ 井 (B1V24VE35)
    │ devaddr=oilwell_0003             │ RES_ID=8038
    │ ip=11.248.203.240                │
    │ station_id=CY1C8K ────────→ 站 (南4联合站)    
    │ protocol=modbus_tcp              │
    ↓                                  ↓
Channel (CommBridge通道) ────→ CommBridge.exe :53001
    │ config.port=53001               │ 191 RTU
    │ config.host=11.66.12.131        │
    ↓                                  ↓
Telemetry ──→ Oracle SYS_POINTRELATION_WELL (4567点)
    │                                    │
    │ values: {Ia:13.27, Ua:235.3...}   │ ChangeData[0-9]
    ↓                                    ↓
Alarm ──→ IoMonitor 告警显示
```

## 四、缺失的本体映射

| 缺失项 | 影响 | 建议 |
|--------|------|------|
| **Point (测点定义)** | 不知道设备有哪些测点 | 加 Point 表, FK→Product |
| **Station (场站)** | station_id 是裸字符串 | 加 Station 表, FK→tenant |
| **Product→Device FK** | device_type 仅是字符串匹配 | 加显式 productId FK |
| **Device→Channel FK** | 无显式关联 | Channel.config.devices 数组 |
| **测点公式** | ChangeData 在 IO_ONTOLOGY 不在 Parse | 加 Formula 表关联 Point |
| **CT/PT 变比** | 在 basedata 里但不参与计算 | 加 TransformRatio 字段到 Point |

## 五、DG-IoT 中枢对接映射

| dgiot_lite Parse 表 | DG-IoT 中枢 | 同步方式 |
|---------------------|-------------|----------|
| Device | /iotapi/classes/Device | EdgeHubPusher.push_device |
| Telemetry | /iotapi/classes/Telemetry | EdgeHubPusher.push_telemetry |
| Alarm | /iotapi/classes/Alarm | EdgeHubPusher.push_alarm |
| Channel | /iotapi/classes/Channel | EdgeHubPusher.push_device(channel config) |
