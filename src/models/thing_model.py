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
}


def get_product_model(device_type: str) -> dict:
    """获取设备类型的物模型"""
    return THING_MODEL.get(device_type, {})


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
