# DG-IoT 核心本体 — 从 Erlang 源码精读

> 来源: `dgaiot/apps/` (dgiot_parse, dgiot_device, dgiot_ontology, dgiot_task)
> 更新: 2026-07-13

---

## 一、实体关系图

```
┌─────────────────────────────────────────────────────┐
│                     _User                           │
│  objectId, username, password, email, phone, role   │
└──────┬──────────────────────────────────────────────┘
       │ sessionToken (dgiot_parse_auth)
       │ departmentToken (部门上下文)
       ├──→ _Role (角色树)
       │      ├──→ Menu (导航菜单)
       │      ├──→ View (页面视图)
       │      └──→ Rule (权限规则)
       │
       └──→ ACL (Access Control List)
              ├── read: true/false
              └── write: true/false

┌─────────────────────────────────────────────────────┐
│                   Product                           │
│  objectId, devType, name, category, icon, netType   │
│  + thing (物模型):                                   │
│      properties[] — 测点定义                          │
│      events[]     — 告警/事件定义                      │
│      services[]   — 可调用命令                         │
│      tags[]       — 标签定义                          │
│  + defaults: {ct_ratio, pt_ratio, interval}         │
└──────┬──────────────────────────────────────────────┘
       │ Product创建时自动生成:
       ├──→ Channel (dgiot_product_channel:save_channel)
       ├──→ TDChannel (时序数据通道)
       └──→ TaskChannel (任务队列)

┌─────────────────────────────────────────────────────┐
│                    Device                           │
│  objectId = hash(ProductId + devaddr)              │
│  devaddr, name, product(→ProductId), ip, status    │
│  brand, devModel, basedata, ACL                     │
└──────┬──────────────────────────────────────────────┘
       │ dgiot_device_manager:create_device
       │ dgiot_device_channel (缓存通道, 订阅Product变更)
       │
       └──→ Shadow (dgiot_task/dgiot_shadow.erl)
              ├── 状态机: init→auth→online→normal/alarm→offline
              └── 心跳超时→自动离线

┌─────────────────────────────────────────────────────┐
│                   Channel                           │
│  cType, name, status, config, product(→ProductId)   │
│  behavior: dgiot_channelx (Erlang gen_statem)       │
└──────┬──────────────────────────────────────────────┘
       ├── dgiot_bridge (协议适配层)
       │     ├── Modbus TCP/RTU
       │     ├── OPC UA/DA
       │     ├── MQTT
       │     └── HTTP
       │
       └── dgiot_task (数据管线)
             └── dgiot_task_worker: 采集→解码→写TDengine→推MQTT
```

## 二、关键交互流程

### 2.1 Product创建 → 自动生成通道

```erlang
% dgiot_product.erl
save(Product) ->
    dgiot_data:insert(?DGIOT_PRODUCT, ProductId, Product),
    dgiot_product_channel:save_channel(ProductId),     % 采集通道
    dgiot_product_channel:save_tdchannel(ProductId),   % 时序通道
    dgiot_product_channel:save_taskchannel(ProductId), % 任务通道
    hook_topic(Product).                               % MQTT主题
```

### 2.2 Device创建 → 关联Product + 生成ID

```erlang
% dgiot_device_manager.erl
create_device(#{
    <<"product">> := ProductId,
    <<"devaddr">> := DevAddr,
    ...
}) ->
    DeviceId = dgiot_parse_id:get_deviceid(ProductId, DevAddr),
    % DeviceId = hash("Device" + ProductId + DevAddr) → 确定性唯一
    ...
```

### 2.3 采集流程: Device → Channel → Bridge → Task

```erlang
% dgiot_device_channel.erl (缓存通道, 订阅Parse变更)
init/3 → handle_init → 订阅 <<"Device">> 表的 create/update/delete
handle_event → Product变更 → 更新设备列表
handle_message → 采集数据 → dgiot_bridge:send → dgiot_task:process
```

### 2.4 权限: Role树 → Menu → ACL

```erlang
% dgiot_role.erl
get_role(Class, RoleId) → Roles
get_childrole(RoleId) → [子角色]
get_acls(RoleId) → [ACL列表]
get_menus_role(RoleId) → [Menu列表]
get_views_role(RoleId) → [View列表]

% dgiot_parse_utils.erl — 导航
get_navigation_by_result(Menus, Roles) → 
    遍历 Menu 表, 按角色过滤, 生成导航树
```

## 三、Parse 表映射 (对应 parse.db)

| Parse 表 | Erlang 模块 | 用途 |
|----------|------------|------|
| **Product** | dgiot_product.erl | 产品类型 (含thing物模型) |
| **Device** | dgiot_device.erl | 设备实例 |
| **Channel** | dgiot_device_channel.erl | 采集通道 |
| **_User** | dgiot_parse_auth.erl | 用户认证 |
| **_Role** | dgiot_role.erl | 角色树 |
| **Menu** | dgiot_parse_utils.erl | 导航菜单 |
| **View** | dgiot_role.erl | 页面视图 |
| **Rule** | dgiot_role.erl | 权限规则 |
| **Notification** | dgiot_parse_hook.erl | 通知/消息 |
| **Alarm** | dgiot_parse_hook.erl | 告警事件 |
| **Telemetry** | dgiot_tdengine (TSDB) | 时序数据 |

## 四、dgiot_lite 对标

| DG-IoT (Erlang) | dgiot_lite (Python) | 对齐状态 |
|-----------------|---------------------|---------|
| dgiot_product.erl | Product表 + thing字段 | ✅ JSON data |
| dgiot_device.erl | Device表 + devaddr | ✅ |
| dgiot_device_channel | Channel表 + cType | ✅ |
| dgiot_parse_auth | /api/login + sessionToken | ✅ |
| dgiot_role.erl | _Role表 | ✅ |
| dgiot_parse_hook | parse_hooks.py | ✅ |
| dgiot_parse_rest | parse_router.py | ✅ |
| dgiot_bridge | commbridge_server.py | ✅ |
| dgiot_task | oracle_pipeline.py | ✅ |
| dgiot_shadow | shadow.py | ✅ |
| dgiot_ontology | IO_ONTOLOGY.md | ✅ |
| Menu (导航) | 前端 router.config | ✅ |
| Department (部门) | departmentToken | ⏳ |
| ETS 内存缓存 | Product ETS → Python dict | ⏳ |
