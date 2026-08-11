# dgaiot 核心本体

> 来源: dgaiot Erlang/OTP 源码 + COMPONENTS.md + Kylin 部署包
> 对应: D:\ai\kylin\workspace\dgiot-kylin\

---

## 一、五层服务架构

```
层4 网关  Nginx :80 → / Vite /api NestJS /parse Parse /dashboard DG-IOT /tdengine TDengine
层3 接入  DG-IOT(EMQX引擎) :1883 MQTT :8083 WS :8081 HTTP-API :18083 Dashboard
         Vite :5173 前端SPA
         36个OTP应用: 协议适配(Modbus/OPC/DTU) · 规则引擎(15算法)· 流式计算 · 告警闭环(8模块)
层2 业务  NestJS :3100 → Parse REST API
层1 数据  Parse :1337 → PG :7432
层0 存储  PG :7432 持久 · TDengine :6041 时序
```

## 二、Parse 核心类

| 类 | 说明 | 关键字段 |
|----|------|---------|
| **Product** | 产品类型(含thing物模型) | objectId, devType, name, thing{properties[],events[],services[]} |
| **Device** | 设备实例 | objectId=hash(ProductId+devaddr), devaddr, name, product, ip, status |
| **Channel** | 采集通道(Product创建自动生成) | cType, name, status, config, product |
| **TDChannel** | 时序数据通道 | Product创建自动生成 |
| **TaskChannel** | 任务队列 | Product创建自动生成 |
| **_User** | 用户认证 | objectId, username, password, email, phone, role |
| **_Role** | 角色树 | name, code, children |
| **Menu** | 导航菜单 | name, path, icon, group, order |
| **View** | 页面视图 | name, path |
| **Rule** | 权限规则 | name, class, action, acl |
| **Navigation** | 动态导航 | group, order, path |
| **Alarm** | 告警事件 | device_id, severity, message, status, created_at |
| **Telemetry** | 时序数据(TSDB) | device_id, point_id, ts, value, quality |
| **Department** | 组织部门 | name, code, parent_id |
| **Shadow** | 设备影子 | device_id, desired, reported, version |

## 三、通道体系 (dgiot_channel)

```
Product 创建
    │
    ├── dgiot_product_channel:save_channel(ProductId)
    │     └── Channel (采集通道)
    │           cType: modbus_tcp | opcda | a11 | iec104 | mqtt | http_rest
    │           config: {host, port, interval, slave_id, ...}
    │
    ├── dgiot_product_channel:save_tdchannel(ProductId)
    │     └── TDChannel (时序通道)
    │           └── → TDengine 写入
    │
    └── dgiot_product_channel:save_taskchannel(ProductId)
          └── TaskChannel (任务队列)
                └── → 异步任务分发
```

### 协议适配器 (dgiot_bridge)

| 协议 | Erlang行为 | 端口 | 数据类型 |
|------|-----------|------|---------|
| Modbus TCP | dgiot_modbus | 502 | 寄存器 |
| Modbus RTU | dgiot_modbus_rtu | — | 寄存器 |
| OPC UA | dgiot_opcua | 4840 | 节点 |
| OPC DA | dgiot_opcda | 135 | DCOM |
| IEC104 | dgiot_iec104 | 2404 | 遥测遥信 |
| MQTT | dgiot_mqtt | 1883 | Topic |
| HTTP | dgiot_http | 80 | REST |
| DTU透传 | dgiot_dtu | 动态 | 透传 |
| A11 | dgiot_a11 | 8889 | 专有 |

## 四、数据管线 (dgiot_task)

```
Device → Channel → dgiot_bridge:send → dgiot_task:process
                                              │
                              ┌───────────────┼───────────────┐
                              │               │               │
                        解码(protocol)   写TDengine     推MQTT
                         dgiot_parse    dgiot_tdengine  dgiot_mqtt
```

## 五、权限体系

```
_User → sessionToken → ACL检查
  │
_Role → 角色树 → Menu · View · Rule
  │
Product/Device → ACL (read/write per object)
```

## 六、设备状态机 (Shadow)

```
init → auth → online → normal
                 │        │
                 │        └── alarm (告警状态)
                 │
                 └── offline (心跳超时)
```

## 七、启动依赖链

```
T=0s  PG :7432 + TDengine :6041
T=3s  DG-IOT (EMQX引擎) 独立启动 · 36 OTP应用
T=4s  Parse :1337 (依赖PG)
T=10s NestJS :3100 (依赖Parse)
T=12s Vite :5173 + Nginx :80
```

## 八、与 dgiot_lite 对比

| dgaiot (Erlang) | dgiot_lite (Python) | 通道管理对齐 |
|-----------------|---------------------|-------------|
| EMQX MQTT Broker | mock dgiot | ✅ |
| Parse Server | parse_lite.py (40K) | ✅ |
| Channel (采集通道) | ChannelView + protocols/ | ✅ |
| dgiot_bridge (协议适配) | protocols/ 11文件 | ✅ |
| dgiot_task (数据管线) | collector.py + oracle_pipeline.py | ✅ |
| Shadow (设备状态机) | shadow.py | ✅ |
| Product (物模型) | ProductsView + thing_model.py | ✅ |
| 36个OTP应用 | 19个Python模块 | ⚠️简化 |
