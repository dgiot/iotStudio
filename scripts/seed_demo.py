#!/usr/bin/env python3
"""Demo seed: default tenant (7 devices) + oil-monitor tenant (2 devices)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
from parse_lite import parse_create, parse_query, ensure_table

ensure_table("Device"); ensure_table("Channel")

# Default tenant
for d in [
    {"objectId":"inv_01","devaddr":"inv_01","name":"1号逆变器","device_type":"inverter","ip":"192.168.1.11","protocol":"modbus_tcp","isEnable":True,"status":"online","basedata":{"manufacturer":"华为","model":"SUN2000-50KTL"},"tenant_id":"default"},
    {"objectId":"inv_02","devaddr":"inv_02","name":"2号逆变器","device_type":"inverter","ip":"192.168.1.12","protocol":"modbus_tcp","isEnable":True,"status":"online","basedata":{"manufacturer":"华为","model":"SUN2000-30KTL"},"tenant_id":"default"},
    {"objectId":"pcs_01","devaddr":"pcs_01","name":"储能PCS-1","device_type":"pcs","ip":"192.168.1.21","protocol":"modbus_tcp","isEnable":True,"status":"online","basedata":{"manufacturer":"阳光电源","model":"SC2500HV"},"tenant_id":"default"},
    {"objectId":"charger_01","devaddr":"charger_01","name":"充电桩-1号","device_type":"charger","ip":"192.168.1.31","protocol":"modbus_tcp","isEnable":True,"status":"offline","basedata":{"manufacturer":"特来电","model":"TCDZ-DC"},"tenant_id":"default"},
    {"objectId":"meter_main","devaddr":"meter_main","name":"主变压器电表","device_type":"meter","ip":"192.168.1.100","protocol":"iec104","isEnable":True,"status":"online","basedata":{"manufacturer":"威胜","model":"DTSD341"},"tenant_id":"default"},
    {"objectId":"boiler_01","devaddr":"boiler_01","name":"1号锅炉","device_type":"compressor","ip":"192.168.2.11","protocol":"modbus_tcp","isEnable":True,"status":"online","basedata":{"manufacturer":"方快锅炉","model":"WNS6-1.25"},"tenant_id":"default"},
    {"objectId":"rtu_north","devaddr":"rtu_north","name":"北区RTU","device_type":"rtu","ip":"192.168.3.1","protocol":"modbus_rtu","isEnable":True,"status":"alarm","basedata":{"manufacturer":"安控科技","model":"SuperE50"},"tenant_id":"default"},
]:
    parse_create("Device", d)

# Oil tenant
for d in [
    {"objectId":"oil_ccs1_hyd","devaddr":"oil_ccs1_hyd","name":"CCS-1液压系统","device_type":"compressor","protocol":"http_rest","isEnable":True,"status":"online","basedata":{"manufacturer":"有叶云","model":"S2MX46"},"tenant_id":"oil-monitor"},
    {"objectId":"oil_gear2","devaddr":"oil_gear2","name":"2号齿轮系统","device_type":"compressor","protocol":"http_rest","isEnable":True,"status":"online","basedata":{"manufacturer":"有叶云","model":"壳牌320"},"tenant_id":"oil-monitor"},
]:
    parse_create("Device", d)

# Channels
for ch in [
    {"objectId":"ch_modbus","cType":"modbus_tcp","name":"Modbus TCP","isEnable":True,"status":"running","config":{"host":"0.0.0.0","port":502},"tenant_id":"default"},
    {"objectId":"ch_iec104","cType":"iec104","name":"IEC 104","isEnable":True,"status":"running","config":{"host":"127.0.0.1","port":2404},"tenant_id":"default"},
    {"objectId":"ch_youyeyun","cType":"http_rest","name":"油液监测","isEnable":True,"status":"stopped","config":{"host":"youyeyun.com","port":443},"tenant_id":"oil-monitor"},
    {"objectId":"ch_boiler","cType":"modbus_tcp","name":"锅炉能效","isEnable":True,"status":"stopped","config":{"host":"192.168.2.11","port":502},"tenant_id":"default"},
    {"objectId":"ch_vib","cType":"http_rest","name":"声振温","isEnable":True,"status":"stopped","config":{"host":"127.0.0.1","port":8500},"tenant_id":"default"},
    {"objectId":"ch_bolt","cType":"mqtt","name":"智能螺栓","isEnable":False,"status":"stopped","config":{"host":"127.0.0.1","port":1883},"tenant_id":"default"},
]:
    parse_create("Channel", ch)

d = parse_query("Device",{}); c = parse_query("Channel",{})
print(f"Seeded: {d['count']} devices, {c['count']} channels")
