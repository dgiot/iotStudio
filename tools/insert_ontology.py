"""IO 服务器本体 → parse.db 入库"""
import sqlite3, json, time
from pathlib import Path

ROOT = Path(__file__).parent.parent
db = sqlite3.connect(str(ROOT / "data" / "parse.db"))
now = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")

# Site
db.execute("""INSERT OR IGNORE INTO ontology_site
    (objectId,name,type,location,description,data,createdAt,updatedAt)
    VALUES (?,?,?,?,?,?,?,?)""",
    ("site_industry", "INDUSTRY_IO", "OilField", "192.168.1.0/24",
     "RTDB=130:8889, Oracle=129:1521, RTU=191, OPC=5",
     json.dumps({"rtdb": "127.0.0.1:8889", "rtu_count": 191}), now, now))

# Gateway
db.execute("""INSERT OR IGNORE INTO ontology_gateway
    (objectId,name,ip,site_id,hostname,os,status,installed,channels,notes,data,createdAt,updatedAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    ("gw_cb_131", "LegacyComm_DTU", "127.0.0.1", "site_industry",
     "win-nj7vp96r2nm", "Win2016", "online", "2021", "5",
     "DTU gateway, 191 RTU",
     json.dumps({"port": 53001, "protocol": "DTU Modbus"}), now, now))

# Channels
for oid, name, proto, ep, cfg, devs in [
    ("ch_modbus_tcp", "Modbus_TCP", "Modbus TCP", ":502", "modbus", "56"),
    ("ch_opc_da", "OPC_DA", "OPC DA DCOM", "192.168.10.23:135", "dcom", "10"),
    ("ch_rtdb", "RTDB", "RTDB psAPI", "127.0.0.1:8889", "psapi", "100+"),
    ("ch_dtu", "DTU", "DTU Transparent", ":53001", "serial", "191"),
    ("ch_oracle", "Oracle", "Oracle ADO", "192.168.1.129:1521", "oracle", "0"),
]:
    db.execute("""INSERT OR IGNORE INTO ontology_channel
        (objectId,name,gateway_id,protocol,endpoint,status,config,devices,data,createdAt,updatedAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (oid, name, "gw_cb_131", proto, ep, "online", cfg, devs, "{}", now, now))

# Devices
devices = [
    ("02012170058", "DSL-31A_Breaker58", "ch_modbus_tcp", "DSL-31A", "Modbus", 1),
    ("02105100097", "DST-31A_Transf97", "ch_modbus_tcp", "DST-31A", "Modbus", 2),
    ("02106290043", "DSB-31A_Backup43", "ch_modbus_tcp", "DSB-31A", "Modbus", 3),
    ("02107010048", "Motor_Prot48", "ch_modbus_tcp", "Motor", "Modbus", 4),
    ("02110080020", "DGP-13_Ground20", "ch_opc_da", "DGP-13", "OPC", 1),
    ("02110080028", "DSL-31A_Breaker28", "ch_opc_da", "DSL-31A", "OPC", 2),
    ("02110110045", "DST-31A_Transf45", "ch_opc_da", "DST-31A", "OPC", 3),
    ("DEVICE_ID_PLACEHOLDER", "DBPA-31A_ATSE89", "ch_opc_da", "DBPA-31A", "OPC", 4),
    ("02110150030", "DSB-31A_Backup30", "ch_opc_da", "DSB-31A", "OPC", 5),
    ("02110160086", "Motor_Prot86", "ch_opc_da", "Motor", "OPC", 6),
    ("02111270058", "DBPA-31A_ATSE58", "ch_opc_da", "DBPA-31A", "OPC", 7),
    ("02204060100", "DSL-31A_BreakerA1", "ch_opc_da", "DSL-31A", "OPC", 8),
    ("02204060111", "DST-31A_TransfB3", "ch_opc_da", "DST-31A", "OPC", 9),
]
for did, name, ch, dtype, proto, sid in devices:
    db.execute("""INSERT OR IGNORE INTO ontology_device
        (objectId,name,channel_id,type,protocol,slave_id,manufacturer,model,status,points,data,createdAt,updatedAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (did, name, ch, dtype, proto, sid,
         "NARI-Relays", "RCS-9000", "online",
         "Ia,Ib,Ic,Ua,Ub,Uc,P,Q,cos,F",
         json.dumps({"source": "IOMan_wmic"}), now, now))

# Points
point_defs = [
    ("Ia", "相电流A", "A", "0x0000"), ("Ua", "相电压A", "kV", "0x0006"),
    ("P", "有功功率", "kW", "0x000C"), ("cos", "功率因数", "", "0x000E"),
    ("F", "频率", "Hz", "0x0010"),
]
for did, _, _, _, _, _ in devices[:3]:
    for pt, desc, unit, reg in point_defs:
        db.execute("""INSERT OR IGNORE INTO ontology_point
            (objectId,name,device_id,unit,description,register,alarm,range_min,range_max,category,data,createdAt,updatedAt)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (f"{did}.{pt}", pt, did, unit, desc, reg,
             json.dumps({"hi": 9999, "lo": 0}), 0, 9999, "telemetry",
             json.dumps({"coeff": "170/8192"}), now, now))

# Constraints
for cid, name, rule, entity, sev, src, action in [
    ("C_L1", "L1_Frame", "abs(expected-actual)<=2", "ALL", "danger", "commbridge_server.py", "丢帧丢弃"),
    ("C_L2", "L2_Range", "I:0-500A,U:100-400V,P:0-300kW", "ALL", "danger", "RANGES", "超限告警"),
    ("C_L3", "L3_3Phase", "(Imax-Imin)/Iavg<25%", "ALL", "danger", "cross_validate", "三相不平衡告警"),
    ("C_L4", "L4_Temporal", "delta<50%", "ALL", "warn", "cross_validate", "可疑值标记"),
    ("C_L5", "L5_Oracle", "|A-B|/A<1%", "ALL", "danger", "Oracle对比", "数据源异常"),
    ("C_coeff", "ChangeData", "Y*Coefficient[i], base=8192", "ALL", "info", "Device.ini", "工程值转换"),
    ("C_ro", "Production_RO", "禁止安装/重启/停服", "gateway", "critical", "production-rules", "只读操作"),
    ("C_hb", "Heartbeat", "30s超时", "LegacyComm", "warn", "IoChannelCfg.ini", "断开重连"),
]:
    db.execute("""INSERT OR IGNORE INTO ontology_constraint
        (objectId,name,rule,entity,severity,source,action,enabled,data,createdAt,updatedAt)
        VALUES (?,?,?,?,?,?,?,1,?,?,?)""",
        (cid, name, rule, entity, sev, src, action, "{}", now, now))

# DataSources
for oid, gw, typ, conn, status, tags, data in [
    ("ds_rtdb", "gw_cb_131", "RTDB 6.0.1.9", "127.0.0.1:8889", "connected", 5000,
     json.dumps({"sdk": "6.0.1.9", "exports": 3525, "user": "admin", "handle": "uint16"})),
    ("ds_oracle", "gw_cb_131", "Oracle 11g", "192.168.1.129:1521/INDUSTRYPROD", "connected", 0,
     json.dumps({"tables": ["TAGPAR", "SYS_POINTRELATION"]})),
    ("ds_opc", "gw_cb_131", "Kepware OPC DA", "192.168.10.23:135", "connected", 1000,
     json.dumps({"clsid": "6E6170F0-FF2D-11D2-8087-00105AA8F840"})),
]:
    db.execute("""INSERT OR IGNORE INTO ontology_datasource
        (objectId,gateway_id,type,connection,status,tag_count,data,createdAt,updatedAt)
        VALUES (?,?,?,?,?,?,?,?,?)""",
        (oid, gw, typ, conn, status, tags, data, now, now))

# Relations
for rid, jdata in [
    ("rel_cb", json.dumps({"source": "02012170058", "target": "gw_cb_131", "label": "monitors", "desc": "RTU->LegacyComm"})),
    ("rel_imon", json.dumps({"source": "gw_cb_131", "target": "site_industry", "label": "forwards", "desc": "CB->IoMonitor"})),
    ("rel_rtdb", json.dumps({"source": "ch_rtdb", "target": "ds_rtdb", "label": "subscribes", "desc": "IOMan->RTDB"})),
    ("rel_opc", json.dumps({"source": "ds_rtdb", "target": "ds_opc", "label": "bridges", "desc": "RTDB->OPC DA"})),
    ("rel_dgiot", json.dumps({"source": "dgiot_lite", "target": "site_industry", "label": "replaces", "desc": "dgiot替代IoMonitor"})),
]:
    db.execute("""INSERT OR IGNORE INTO Relation (objectId,data,ACL,createdAt,updatedAt)
        VALUES (?,?,'*',?,?)""", (rid, jdata, now, now))

db.commit()

print("[OK] parse.db updated:")
for t in ["ontology_site", "ontology_gateway", "ontology_channel", "ontology_device",
          "ontology_point", "ontology_constraint", "ontology_datasource", "Relation"]:
    cnt = db.execute(f"SELECT count(*) FROM {t}").fetchone()[0]
    print(f"  {t}: {cnt} rows")
db.close()
print("Done")
