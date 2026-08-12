"""
DG-IoT Schema 对齐 — Device / Product / Channel / ProductTemplet
=================================================================
字段名严格对齐 DG-IoT Parse Server schemas.json。
parse_lite 用 data JSON 列存储所有字段，固定列只有 objectId/ACL/createdAt/updatedAt。
Pointer 用 {"__type":"Pointer","className":"X","objectId":"id"}
Relation 用 {"__type":"Relation","className":"X"}
"""

# ==================== Device (21 fields) ====================
DEVICE_FIELDS = {
    "devaddr":       {"type": "String",  "required": True,  "desc": "设备地址(唯一)"},
    "name":          {"type": "String",  "required": False, "desc": "设备名称"},
    "product":       {"type": "Pointer", "targetClass": "Product", "required": True, "desc": "所属产品"},
    "parentId":      {"type": "Pointer", "targetClass": "Device", "desc": "父设备(网关/DTU)"},
    "ip":            {"type": "String",  "desc": "IP地址"},
    "address":       {"type": "String",  "desc": "物理地址"},
    "location":      {"type": "GeoPoint","desc": "经纬度"},
    "isEnable":      {"type": "Boolean", "desc": "是否启用"},
    "status":        {"type": "String",  "desc": "online/offline/alarm"},
    "lastOnlineTime":{"type": "Number",  "desc": "最后在线时间戳"},
    "state":         {"type": "Number",  "desc": "0=正常 1=告警"},
    "deviceSecret":  {"type": "String",  "desc": "设备密钥"},
    "basedata":      {"type": "Object",  "desc": "基础数据(厂商/型号/序列号)"},
    "content":       {"type": "Object",  "desc": "采集内容定义"},
    "profile":       {"type": "Object",  "desc": "设备档案/扩展属性"},
    "route":         {"type": "Object",  "desc": "路由信息"},
    "detail":        {"type": "Object",  "desc": "详情"},
    "tenant_id":     {"type": "String",  "desc": "多租户隔离"},
}

# ==================== Product (24 fields) ====================
PRODUCT_FIELDS = {
    "devType":           {"type": "String",  "required": True, "desc": "设备类型标识"},
    "name":              {"type": "String",  "required": True, "desc": "产品名称"},
    "productIdentifier": {"type": "String",  "desc": "产品标识符"},
    "productSecret":     {"type": "String",  "desc": "产品密钥"},
    "category":          {"type": "Pointer", "targetClass": "Category", "desc": "产品分类"},
    "producttemplet":    {"type": "Pointer", "targetClass": "ProductTemplet", "desc": "物模型模板"},
    "children":          {"type": "Relation","targetClass": "Product", "desc": "子产品"},
    "icon":              {"type": "String",  "desc": "图标"},
    "desc":              {"type": "String",  "desc": "描述"},
    "config":            {"type": "Object",  "desc": "配置JSON"},
    "thing":             {"type": "Object",  "desc": "物模型定义(属性/服务/事件)"},
    "decoder":           {"type": "Object",  "desc": "解码器配置"},
    "content":           {"type": "Object",  "desc": "内容"},
    "profile":           {"type": "Object",  "desc": "产品档案"},
    "channel":           {"type": "Object",  "desc": "默认通道配置"},
    "nodeType":          {"type": "Number",  "desc": "节点类型 0=直连 1=网关子设备"},
    "netType":           {"type": "String",  "desc": "网络类型 wifi/cellular/ethernet/lora"},
    "dynamicReg":        {"type": "Boolean", "desc": "是否动态注册"},
    "topics":            {"type": "Object",  "desc": "MQTT Topic模板"},
    "serverCallbackModel":{"type": "Array",  "desc": "服务回调模型"},
    "tenant_id":         {"type": "String",  "desc": "多租户隔离"},
}

# ==================== Channel (13 fields) ====================
CHANNEL_FIELDS = {
    "cType":    {"type": "String",  "required": True, "desc": "通道类型(modbus_tcp/opcua/iec104/http_rest/...)"},
    "name":     {"type": "String",  "required": True, "desc": "通道名称"},
    "type":     {"type": "String",  "desc": "子类型"},
    "product":  {"type": "Relation","targetClass": "Product", "desc": "关联产品"},
    "isEnable": {"type": "Boolean", "desc": "是否启用"},
    "status":   {"type": "String",  "desc": "running/stopped/error"},
    "config":   {"type": "Object",  "desc": "通道配置(host/port/interval/...)"},
    "desc":     {"type": "String",  "desc": "描述"},
    "data":     {"type": "Object",  "desc": "扩展数据"},
    "tenant_id":{"type": "String",  "desc": "多租户隔离"},
}

# ==================== ProductTemplet (物模型模板, 16 fields) ====================
TEMPLET_FIELDS = {
    "name":     {"type": "String",  "desc": "模板名称"},
    "id":       {"type": "String",  "desc": "模板ID"},
    "icon":     {"type": "String",  "desc": "图标"},
    "desc":     {"type": "String",  "desc": "描述"},
    "category": {"type": "Pointer", "targetClass": "Category", "desc": "分类"},
    "thing":    {"type": "Object",  "desc": "物模型(属性/服务/事件定义)"},
    "config":   {"type": "Object",  "desc": "模板配置"},
    "decoder":  {"type": "Object",  "desc": "解码器"},
    "content":  {"type": "Object",  "desc": "内容"},
    "profile":  {"type": "Object",  "desc": "档案"},
    "nodeType": {"type": "Number",  "desc": "节点类型"},
    "netType":  {"type": "String",  "desc": "网络类型"},
    "tenant_id":{"type": "String",  "desc": "多租户隔离"},
}

# ==================== 种子数据 ====================
SEED_PRODUCTS = [
    {"objectId": "inverter", "devType": "inverter", "name": "光伏逆变器",
     "icon": "☀️", "desc": "光储充核心设备", "nodeType": 0, "netType": "ethernet"},
    {"objectId": "pcs", "devType": "pcs", "name": "储能PCS",
     "icon": "🔋", "desc": "电池储能变流控制", "nodeType": 0, "netType": "ethernet"},
    {"objectId": "charger", "devType": "charger", "name": "充电桩",
     "icon": "🔌", "desc": "电动汽车充放电", "nodeType": 0, "netType": "ethernet"},
    {"objectId": "meter", "devType": "meter", "name": "智能电表",
     "icon": "📟", "desc": "三相电量计量采集", "nodeType": 1, "netType": "cellular"},
    {"objectId": "oilwell", "devType": "oilwell", "name": "抽油机井",
     "icon": "🛢️", "desc": "工业园工业设备", "nodeType": 1, "netType": "cellular"},
    {"objectId": "rtu", "devType": "rtu", "name": "RTU终端",
     "icon": "📡", "desc": "远程采集终端", "nodeType": 1, "netType": "cellular"},
    {"objectId": "compressor", "devType": "compressor", "name": "压缩机",
     "icon": "⚙️", "desc": "离心/往复压缩机", "nodeType": 0, "netType": "ethernet"},
    {"objectId": "sensor", "devType": "sensor", "name": "环境传感器",
     "icon": "🌡️", "desc": "温湿度/辐照/风速", "nodeType": 1, "netType": "lora"},
]

SEED_CHANNELS = [
    {"objectId": "ch_vendor_oilmon", "cType": "http_rest", "name": "🛢 油液监测",
     "isEnable": True, "status": "stopped",
     "config": {"host": "vendor_oilmon.com", "port": 443, "interval": 300},
     "desc": "有叶云油液传感器平台", "tenant_id": "oil-monitor"},
    {"objectId": "ch_boiler", "cType": "modbus_tcp", "name": "🔥 锅炉能效",
     "isEnable": True, "status": "stopped",
     "config": {"host": "127.0.0.1", "port": 502, "slave_id": 1},
     "desc": "锅炉房能效监测", "tenant_id": "default"},
    {"objectId": "ch_vib", "cType": "http_rest", "name": "📊 声振温",
     "isEnable": True, "status": "stopped",
     "config": {"host": "127.0.0.1", "port": 8500},
     "desc": "知微PHM声振温传感器", "tenant_id": "default"},
    {"objectId": "ch_bolt", "cType": "mqtt", "name": "🔩 智能螺栓",
     "isEnable": True, "status": "stopped",
     "config": {"host": "127.0.0.1", "port": 1883, "topic": "bolt/+"},
     "desc": "博感MQTT螺栓预紧力", "tenant_id": "default"},
    {"objectId": "ch_video", "cType": "rtsp", "name": "📷 视频监控",
     "isEnable": True, "status": "stopped",
     "config": {"host": "127.0.0.1", "port": 554},
     "desc": "海康NVR视频流", "tenant_id": "default"},
    {"objectId": "ch_tdlas", "cType": "modbus_tcp", "name": "⛽ TDLAS 气体检测",
     "isEnable": True, "status": "stopped",
     "config": {"host": "127.0.0.1", "port": 502, "slave_id": 1},
     "desc": "激光光谱气体分析", "tenant_id": "default"},
]
