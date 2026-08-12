#!/usr/bin/env python3
# ============================================================
# dgiot_lite — 物模型定义
# 来源: dgiot_collector/src/core/device.py POINTS + point_mapping 模式
# ============================================================
"""标准化物模型 — 点位模板 + 分类 + 校验"""

# 光储充物模型: 设备类型 → 点位列表
THING_MODEL = {
    "inverter": {
        "product_name": "光伏逆变器",
        "points": {
            "pv_power":       {"name": "有功功率",    "unit": "W",   "type": "float32", "category": "electrical", "min": 0,    "max": 5000,  "default": 0},
            "pv_voltage_a":   {"name": "A相电压",     "unit": "V",   "type": "float32", "category": "electrical", "min": 200,  "max": 270,  "default": 230},
            "pv_current_a":   {"name": "A相电流",     "unit": "A",   "type": "float32", "category": "electrical", "min": 0,    "max": 30,   "default": 15},
            "pv_frequency":   {"name": "频率",        "unit": "Hz",  "type": "float32", "category": "electrical", "min": 49.5, "max": 50.5, "default": 50.0},
            "pv_pf":          {"name": "功率因数",    "unit": "",    "type": "float32", "category": "electrical", "min": 0.8,  "max": 1.0,  "default": 0.98},
            "pv_temp":        {"name": "逆变器温度",  "unit": "°C",  "type": "float32", "category": "temperature","min": 20,   "max": 80,   "default": 45},
            "pv_daily_energy":{"name": "日发电量",    "unit": "kWh", "type": "float32", "category": "energy",     "min": 0,    "max": 99999,"default": 0},
            "pv_dc_voltage":  {"name": "直流电压",    "unit": "V",   "type": "float32", "category": "electrical", "min": 600,  "max": 1000, "default": 800},
            "pv_dc_current":  {"name": "直流电流",    "unit": "A",   "type": "float32", "category": "electrical", "min": 0,    "max": 10,   "default": 4},
            "pv_status":      {"name": "运行状态",    "unit": "",    "type": "int16",   "category": "status",     "min": 0,    "max": 2,    "default": 1},
        }
    },
    "pcs": {
        "product_name": "储能PCS",
        "points": {
            "pcs_soc":        {"name": "SOC",         "unit": "%",   "type": "float32", "category": "battery",    "min": 0,    "max": 100,  "default": 75},
            "pcs_soh":        {"name": "SOH",         "unit": "%",   "type": "float32", "category": "battery",    "min": 80,   "max": 100,  "default": 98},
            "pcs_power":      {"name": "有功功率",    "unit": "W",   "type": "float32", "category": "electrical", "min": -5000,"max": 5000, "default": 0},
            "pcs_voltage":    {"name": "交流电压",    "unit": "V",   "type": "float32", "category": "electrical", "min": 200,  "max": 250,  "default": 230},
            "pcs_current":    {"name": "交流电流",    "unit": "A",   "type": "float32", "category": "electrical", "min": -25,  "max": 25,   "default": 10},
            "pcs_temp":       {"name": "电芯温度",    "unit": "°C",  "type": "float32", "category": "temperature","min": 20,   "max": 50,   "default": 35},
            "pcs_status":     {"name": "充放电状态",  "unit": "",    "type": "int16",   "category": "status",     "min": 0,    "max": 3,    "default": 2},
        }
    },
    "charger": {
        "product_name": "充电桩",
        "points": {
            "charger_status": {"name": "充电状态",    "unit": "",    "type": "int16",   "category": "status",     "min": 0,    "max": 3,    "default": 0},
            "charger_power":  {"name": "充电功率",    "unit": "kW",  "type": "float32", "category": "electrical", "min": 0,    "max": 60,   "default": 0},
            "charger_voltage":{"name": "输出电压",    "unit": "V",   "type": "float32", "category": "electrical", "min": 350,  "max": 430,  "default": 380},
            "charger_current":{"name": "输出电流",    "unit": "A",   "type": "float32", "category": "electrical", "min": 0,    "max": 80,   "default": 0},
            "charger_energy": {"name": "累计充电量",  "unit": "kWh", "type": "float32", "category": "energy",     "min": 0,    "max": 999999,"default": 0},
            "charger_temp":   {"name": "模块温度",    "unit": "°C",  "type": "float32", "category": "temperature","min": 20,   "max": 60,   "default": 40},
        }
    },
    "meter": {
        "product_name": "电表",
        "points": {
            "meter_voltage_a": {"name": "A相电压",    "unit": "V",   "type": "float32", "category": "electrical", "min": 200, "max": 270, "default": 230},
            "meter_current_a": {"name": "A相电流",    "unit": "A",   "type": "float32", "category": "electrical", "min": 0,   "max": 30,  "default": 15},
            "meter_power":     {"name": "有功功率",    "unit": "W",   "type": "float32", "category": "electrical", "min": 0,   "max": 5000,"default": 0},
            "meter_energy_pos":{"name": "正向有功电量","unit": "kWh", "type": "float32", "category": "energy",     "min": 0,   "max": 999999,"default":0},
            "meter_frequency": {"name": "频率",        "unit": "Hz",  "type": "float32", "category": "electrical", "min": 49.5,"max": 50.5,"default": 50},
        }
    },
    "sensor": {
        "product_name": "环境传感器",
        "points": {
            "env_temp":        {"name": "环境温度",    "unit": "°C",   "type": "float32", "category": "temperature","min": -20, "max": 50, "default": 25},
            "env_humidity":    {"name": "湿度",        "unit": "%",    "type": "float32", "category": "environment","min": 0,   "max": 100,"default": 65},
            "env_irradiance":  {"name": "辐照度",      "unit": "W/m²", "type": "float32", "category": "environment","min": 0,   "max": 1200,"default": 800},
            "env_wind_speed":  {"name": "风速",        "unit": "m/s",  "type": "float32", "category": "environment","min": 0,   "max": 15, "default": 3},
        }
    },
    # === 工业园设备 (来自 shixu 项目2) ===
    "oilwell": {
        "product_name": "抽油机井",
        "points": {
            "oil_pressure":     {"name": "油压",       "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 25, "default": 8.5},
            "casing_pressure":  {"name": "套压",       "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 25, "default": 6.2},
            "back_pressure":    {"name": "回压",       "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 10, "default": 1.5},
            "wellhead_temp":    {"name": "井口油温",   "unit": "°C",  "type": "float32", "category": "temperature","min":0, "max":120, "default": 65},
            "suspension_load":  {"name": "悬点载荷",   "unit": "KN",  "type": "float32", "category": "electrical", "min": 0, "max": 120, "default": 45},
            "displacement":     {"name": "位移",       "unit": "m",   "type": "float32", "category": "electrical", "min": 0, "max": 10,  "default": 2.5},
            "stroke_count":     {"name": "冲次",       "unit": "次/min","type":"float32","category": "status",     "min": 0, "max": 12,  "default": 6},
            "motor_current_a":  {"name": "A相电流",    "unit": "A",   "type": "float32", "category": "electrical", "min": 0, "max": 100, "default": 28},
            "motor_voltage_a":  {"name": "A相电压",    "unit": "V",   "type": "float32", "category": "electrical", "min":200,"max":250, "default": 228},
            "motor_power":      {"name": "电机功率",   "unit": "kW",  "type": "float32", "category": "electrical", "min": 0, "max": 55,  "default": 22},
            "oil_temp":         {"name": "出油温度",   "unit": "°C",  "type": "float32", "category": "temperature","min":0, "max":100, "default": 55},
            "run_status":       {"name": "运行状态",   "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 3,   "default": 1},
        }
    },
    "rtu": {
        "product_name": "RTU采集终端",
        "points": {
            "rtu_ai1":          {"name": "模拟量1",    "unit": "mA",  "type": "float32", "category": "electrical", "min": 4, "max": 20, "default": 12},
            "rtu_ai2":          {"name": "模拟量2",    "unit": "mA",  "type": "float32", "category": "electrical", "min": 4, "max": 20, "default": 12},
            "rtu_ai3":          {"name": "模拟量3",    "unit": "mA",  "type": "float32", "category": "electrical", "min": 4, "max": 20, "default": 12},
            "rtu_ai4":          {"name": "模拟量4",    "unit": "mA",  "type": "float32", "category": "electrical", "min": 4, "max": 20, "default": 12},
            "rtu_di1":          {"name": "数字量1",    "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 1,  "default": 0},
            "rtu_di2":          {"name": "数字量2",    "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 1,  "default": 0},
            "rtu_comm_status":  {"name": "通讯状态",   "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 1,  "default": 1},
            "rtu_signal":       {"name": "信号强度",   "unit": "dBm", "type": "float32", "category": "electrical", "min":-120,"max":-50,"default":-75},
        }
    },
    "compressor": {
        "product_name": "离心压缩机",
        "points": {
            "comp_suction_p":   {"name": "入口压力",   "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 10, "default": 3.5},
            "comp_discharge_p": {"name": "出口压力",   "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 25, "default": 15},
            "comp_suction_t":   {"name": "入口温度",   "unit": "°C",  "type": "float32", "category": "temperature","min":-10,"max":80, "default": 30},
            "comp_discharge_t": {"name": "出口温度",   "unit": "°C",  "type": "float32", "category": "temperature","min": 0, "max":150, "default": 90},
            "comp_vibration_x": {"name": "X向振动",    "unit": "mm/s","type":"float32", "category": "status",     "min": 0, "max": 25, "default": 3.5},
            "comp_vibration_y": {"name": "Y向振动",    "unit": "mm/s","type":"float32", "category": "status",     "min": 0, "max": 25, "default": 4.2},
            "comp_rpm":         {"name": "转速",       "unit": "rpm", "type": "float32", "category": "status",     "min": 0, "max":12000,"default":8300},
            "comp_lube_p":      {"name": "润滑油压",   "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 2,  "default": 0.8},
            "comp_lube_t":      {"name": "润滑油温",   "unit": "°C",  "type": "float32", "category": "temperature","min":20,"max":80, "default": 45},
            "comp_seal_p":      {"name": "密封气压差", "unit": "kPa", "type": "float32", "category": "electrical", "min": 0, "max": 500,"default": 200},
            "comp_status":      {"name": "运行状态",   "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 5,  "default": 1},
        }
    },
    "pipeline": {
        "product_name": "集输管线",
        "points": {
            "pipe_inlet_p":     {"name": "进站压力",   "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 10, "default": 2.5},
            "pipe_outlet_p":    {"name": "出站压力",   "unit": "MPa", "type": "float32", "category": "electrical", "min": 0, "max": 10, "default": 4.0},
            "pipe_flow_rate":   {"name": "瞬时流量",   "unit": "m³/h","type":"float32", "category": "electrical", "min": 0, "max": 500,"default": 120},
            "pipe_total_flow":  {"name": "累计流量",   "unit": "m³",  "type": "float32", "category": "energy",     "min": 0, "max":999999,"default":0},
            "pipe_temp":        {"name": "介质温度",   "unit": "°C",  "type": "float32", "category": "temperature","min":-10,"max":80,"default": 40},
            "pipe_density":     {"name": "密度",       "unit": "kg/m³","type":"float32","category": "electrical", "min": 600,"max":1000,"default":850},
            "pipe_cathodic":    {"name": "阴极保护电位","unit":"V",   "type": "float32", "category": "electrical", "min":-2, "max": 0,  "default":-0.85},
            "pipe_leak_alarm":  {"name": "泄漏报警",   "unit": "",    "type": "int16",   "category": "status",     "min": 0, "max": 1,  "default": 0},
        }
    },
    "oilfield_rtu": {
        "product_name": "工厂RTU (G1-G8全量142点)",
        "points": {},
    },
}


def get_product_model(device_type: str) -> dict:
    """获取设备类型的物模型"""
    if device_type == "oilfield_rtu":
        return _load_oilfield_rtu_model()
    return THING_MODEL.get(device_type, {})


def _load_oilfield_rtu_model() -> dict:
    """从 shixu JSON 加载工业园 RTU 142 点物模型（带缓存）"""
    import os, json
    json_path = os.environ.get(
        "OILFIELD_MODEL_JSON",
        r"D:\n2n\system\git\shixu\config\iot_model_final_new.json"
    )
    # 缓存：运行时只需加载一次
    if not hasattr(_load_oilfield_rtu_model, '_cache'):
        _load_oilfield_rtu_model._cache = None
    if _load_oilfield_rtu_model._cache is not None:
        return _load_oilfield_rtu_model._cache

    try:
        if not os.path.exists(json_path):
            result = _get_builtin_oilfield_model()
        else:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            points = {}
            for p in data.get("properties", []):
                pid = p["identifier"]
                dtype = p.get("dataType", {}).get("type", "float")
                points[pid] = {
                    "name": p.get("name", pid),
                    "unit": p.get("dataType", {}).get("specs", {}).get("unit", ""),
                    "type": "float32" if dtype == "float" else "int16",
                    "category": "electrical",
                    "min": 0, "max": 9999,
                    "register_addr": p.get("dataForm", {}).get("address", ""),
                    "group_id": p.get("group_id", 0),
                }
            result = {"product_name": "工厂RTU (G1-G8, {}点)".format(len(points)), "points": points}
    except Exception:
        result = _get_builtin_oilfield_model()

    _load_oilfield_rtu_model._cache = result
    return result


def _get_builtin_oilfield_model() -> dict:
    """内置精简井口模型（复用 THING_MODEL['oilwell'] 点位定义）"""
    oilwell = THING_MODEL.get("oilwell", {}).get("points", {})
    return {
        "product_name": "工厂RTU (内置模板)",
        "points": {k: dict(v) for k, v in oilwell.items()},
    }


def get_point_definition(device_type: str, point_id: str) -> dict:
    """获取单个点位定义"""
    product = THING_MODEL.get(device_type, {})
    return product.get("points", {}).get(point_id, {})


def validate_point_value(device_type: str, point_id: str, value: float) -> bool:
    """校验点位值是否在合理范围"""
    pt = get_point_definition(device_type, point_id)
    if not pt:
        return False
    vmin = pt.get("min", float('-inf'))
    vmax = pt.get("max", float('inf'))
    return vmin <= value <= vmax
