"""Mock API Server — 完整模拟后端, 仪表盘直接可用"""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
import uvicorn, json, time, random, platform, sqlite3
import psutil
from fastapi import FastAPI

# SQLite alarm store
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
DB_PATH = os.path.join(DB_DIR, 'parse.db')

def _alarm_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('CREATE TABLE IF NOT EXISTS Alarm (objectId TEXT PRIMARY KEY, alarm_id TEXT, device_id TEXT, severity TEXT, alarm_level TEXT, alarm_msg TEXT, message TEXT, status TEXT DEFAULT "active", created_at TEXT, alarm_type TEXT)')
    try: conn.execute('ALTER TABLE Alarm ADD COLUMN status TEXT DEFAULT "active"')
    except: pass
    conn.commit()
    return conn

def _alarm_row_to_dict(r):
    d = dict(r)
    return {"objectId":d["objectId"],"alarm_id":d.get("alarm_id",d["objectId"]),"device_id":d.get("device_id",""),
            "severity":d.get("severity","warning"),"alarm_level":d.get("alarm_level",d.get("severity","warning")),
            "alarm_msg":d.get("alarm_msg",d.get("message","") or ""),"message":d.get("message",""),
            "status":d.get("status","active"),"created_at":d.get("created_at",""),
            "createdAt":d.get("created_at",""),"alarm_type":d.get("alarm_type","告警")}

def _update_alarm_status(alarm_id, new_status):
    conn = _alarm_db()
    conn.execute('UPDATE Alarm SET status=? WHERE alarm_id=?', (new_status, alarm_id))
    conn.commit()
    conn.close()
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
t0 = time.time()
random.seed(42)

# ══════ Auth ══════
@app.post("/api/auth/login")
async def login(body: dict):
    return {"token":"mock-jwt-token","username":"dgiot_dev","role":"admin","user":{"id":"dgiot_dev","username":"dgiot_dev","nick":"DG-IoT开发者","name":"DG-IoT开发者","email":"","phone":""}}

@app.get("/api/auth/me")
async def me(): return {"username":"dgiot_dev","role":"admin","nick":"DG-IoT开发者"}

@app.get("/api/auth/users")
async def users(): return [{"username":"dgiot_dev","role":"admin","name":"DG-IoT开发者"}]

# ══════ Health ══════
@app.get("/api/health")
async def health():
    return {"status":"ok","version":"1.0.0","uptime_seconds":int(time.time()-t0),"devices":{"total":566,"online":566},"collector":{"total_devices":566,"online_devices":566,"total_collects":472189,"success_rate":99.96}}

# Shadow state storage (mutable, survives request)
_shadow_store = {}

@app.get("/api/shadow/{device_id}")
async def device_shadow(device_id: str):
    """设备影子 — 对标 dgaiot Shadow (desired/reported/version)"""
    import random, math
    t = time.time()
    stored = _shadow_store.get(device_id, {})
    reported = {"oil_pressure": round(2.1+0.3*math.sin(t/30),2),"temperature": round(45+5*math.sin(t/45),1),
                "motor_current": round(22+3*math.sin(t/20),1),"status":"online","timestamp": time.strftime("%Y-%m-%d %H:%M:%S")}
    desired = stored.get("desired", {"oil_pressure": 2.5,"temperature": 50,"motor_current": 25,"collect_interval": 5})
    version = stored.get("version", random.randint(100,999))
    delta = {k: round(abs(desired[k]-reported[k]),2) for k in desired if k in reported and isinstance(desired[k],(int,float))}
    return {"device_id": device_id,"version": version,"connected": True,
            "shadow": {"desired": desired,"reported": reported,"delta": delta,
                       "sync_status": "synced" if all(v<0.5 for v in delta.values()) else "pending"}}

@app.put("/api/shadow/{device_id}/desired")
async def update_shadow_desired(device_id: str, body: dict):
    """更新期望状态"""
    import random
    stored = _shadow_store.get(device_id, {})
    desired = body.get("desired", {})
    stored["desired"] = desired
    stored["version"] = stored.get("version", 0) + 1
    _shadow_store[device_id] = stored
    return {"device_id": device_id, "desired": desired, "version": stored["version"], "status": "updated"}

@app.post("/api/shadow/{device_id}/sync")
async def sync_shadow(device_id: str):
    """推送期望到设备 (模拟 MQTT publish)"""
    stored = _shadow_store.get(device_id, {})
    desired = stored.get("desired", {})
    return {"device_id": device_id, "desired": desired, "sync": "pushed", "topic": f"$dg/things/{device_id}/shadow/desired"}

@app.get("/api/phm/equipments")
async def phm_equipments():
    """预测性维护 — 设备健康状态"""
    import math; t = time.time()
    return {"equipments":[
        {"id":"PUMP_001","icon":"🛢️","name":"注水泵#1","model":"DFJ-250","healthScore":int(85+8*math.sin(t/300)),"level":"正常" if math.sin(t/300)>-0.3 else "警告","rulDays":int(180+60*math.sin(t/400)),
         "faults":[{"mode":"轴承磨损","probability":round(0.12+0.05*math.sin(t/200),2),"severity":"低","action":"准备备件"},
                   {"mode":"气蚀","probability":round(0.05+0.03*math.sin(t/250),2),"severity":"中","action":"检查吸入压力"}]},
        {"id":"COMP_01","icon":"⚙️","name":"压缩机#1","model":"ZW-15/7","healthScore":int(72+10*math.sin(t/350)),"level":"警告","rulDays":int(90+40*math.sin(t/380)),
         "faults":[{"mode":"轴承磨损","probability":0.25,"severity":"中","action":"安排更换"},{"mode":"润滑失效","probability":0.15,"severity":"高","action":"立即更换润滑油"}]},
        {"id":"INV_01","icon":"☀️","name":"逆变器#1","model":"SUN2000-50KTL","healthScore":int(93+5*math.sin(t/500)),"level":"正常","rulDays":int(1800+200*math.sin(t/600)),
         "faults":[{"mode":"电容老化","probability":0.03,"severity":"低","action":"—"}]},
    ]}

@app.get("/api/stream/status")
async def stream_status():
    """流式计算引擎状态 — 实时处理统计 (数据每秒自增, 模拟真实流处理效果)"""
    import math
    t = time.time()
    # 基础值 + 时间增量 (每秒增加约156条, 模拟QPS=156)
    base = 472189 + int((t - 1754730000) * 156)  # 1754730000 ≈ 2026-08-09 epoch
    alarms_base = 0
    # 实时变化的4条数据流
    live_streams = [
        {"dtype":"oilwell","did":"CY1C8K-000","point":"oil_pressure","val":round(2.1+0.3*math.sin(t/30)+random.random()*0.05,2),"unit":"MPa","status":"normal"},
        {"dtype":"oilwell","did":"CY1C8K-001","point":"motor_current","val":round(45+8*math.sin(t/20)+random.random()*0.3,1),"unit":"A","status":"normal"},
        {"dtype":"compressor","did":"COMP-01","point":"vibration","val":round(2.5+1.2*math.sin(t/15)+random.random()*0.8,2),"unit":"mm/s","status":"alarm" if math.sin(t/15)>0.85 else "normal","alarm_msg":"振动超标" if math.sin(t/15)>0.85 else ""},
        {"dtype":"inverter","did":"INV-001","point":"pv_power","val":round(3480+400*math.sin(t/35)+random.random()*10,1),"unit":"W","status":"normal"},
        {"dtype":"inverter","did":"INV-002","point":"pv_voltage","val":round(230+5*math.sin(t/45)+random.random()*0.5,1),"unit":"V","status":"normal"},
        {"dtype":"pcs","did":"PCS-01","point":"soc","val":round(78+15*math.sin(t/60)+random.random()*2,1),"unit":"%","status":"normal"},
    ]
    algo_stats = [
        {"name":"阈值判定","icon":"📏","active":True,"processed":base,"alarms":23+int(random.random()*3),"last":time.strftime("%H:%M:%S")},
        {"name":"突变检测","icon":"⚡","active":True,"processed":base-333,"alarms":7+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"趋势判定","icon":"📈","active":True,"processed":base-1989,"alarms":3,"last":time.strftime("%H:%M:%S")},
        {"name":"波动性检测","icon":"📊","active":True,"processed":base-2389,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"越限频次","icon":"🔢","active":True,"processed":base-5000,"alarms":1,"last":time.strftime("%H:%M:%S")},
        {"name":"滑动平均","icon":"📉","active":True,"processed":base-3689,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"变化率检测","icon":"⏱️","active":True,"processed":base-4989,"alarms":5+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"峰值检测","icon":"🔺","active":True,"processed":base-7000,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"连续异常","icon":"🔴","active":True,"processed":base-6289,"alarms":12+int(random.random()*3),"last":time.strftime("%H:%M:%S")},
        {"name":"基线偏离","icon":"📐","active":True,"processed":base-8000,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"范围检查","icon":"✅","active":True,"processed":base-7889,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"累积计数","icon":"🧮","active":True,"processed":base-9000,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"变化方向","icon":"🧭","active":True,"processed":base-9089,"alarms":1,"last":time.strftime("%H:%M:%S")},
        {"name":"异常评分","icon":"🎯","active":True,"processed":base-10189,"alarms":8+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"自检算法","icon":"🩺","active":True,"processed":base-10689,"alarms":0,"last":time.strftime("%H:%M:%S")},
    ]
    return {"algorithms":algo_stats,"scope_types":["oilwell","compressor","inverter","pcs"],"live_streams":live_streams,
            "qps":156,"total_processed":sum(a["processed"] for a in algo_stats),"total_alarms":sum(a["alarms"] for a in algo_stats)}

@app.get("/api/security/status")
async def security_status():
    """国密安全模块状态 — 对齐申报要求 ⑤管得住"""
    return {"sm2":True,"sm3":True,"sm4":True,"tls":"TLS 1.2","rbac":True,"audit_log":True,
        "device_keys":566,"encrypted_channels":21,"last_audit":time.strftime("%Y-%m-%d %H:%M:%S"),
        "roles":[{"role":"admin","users":2,"permissions":["全部"]},{"role":"operator","users":5,"permissions":["设备管理","告警确认","数据查询"]},{"role":"viewer","users":12,"permissions":["只读查看"]}],
        "audit_trail":[{"time":time.strftime("%H:%M:%S"),"user":"dgiot_dev","action":"登录系统","result":"成功"},
                       {"time":time.strftime("%H:%M:%S",time.localtime(time.time()-300)),"user":"operator","action":"确认告警 a1","result":"成功"},
                       {"time":time.strftime("%H:%M:%S",time.localtime(time.time()-1200)),"user":"admin","action":"修改角色权限","result":"成功"}]}

@app.get("/api/stress/status")
async def stress_status():
    """全链路压测状态 — 对齐 ⑥交付保障"""
    return {"status":"completed","scenario":"全油田16厂·100+作业区·260万+点位·满频持续采集","duration_hours":360,"devices":566,"points":34226620,
        "qps_peak":156,"qps_avg":142,"success_rate":99.96,"latency_p99_ms":8.5,"data_loss":0,
        "results":[{"厂":"第一采油厂","作业区":8,"设备":41250,"通过":True},
                   {"厂":"第二采油厂","作业区":7,"设备":38700,"通过":True},
                   {"厂":"第四采油厂","作业区":5,"设备":28500,"通过":True}]}

@app.get("/api/inject/status")
async def inject_status():
    """规模化灌数验证 — 对齐 ⑥交付保障"""
    return {"status":"completed","total_points":1000000,"current_batch":1000000,"injection_rate":50000,"target_tdengine":"td_1",
        "batches":[{"batch":1,"points":250000,"status":"success"},{"batch":2,"points":250000,"status":"success"},
                   {"batch":3,"points":250000,"status":"success"},{"batch":4,"points":250000,"status":"success"}],
        "verify": {"td_count":1000000,"pg_count":566,"consistency":100}}

@app.get("/api/xinchuang/status")
async def xinchuang_status():
    """信创全栈适配状态 — 对齐 ⑤管得住"""
    return {"os":{"name":"麒麟V10","arch":"aarch64","kernel":"5.10","status":"已验证"},
        "cpu":[{"name":"鲲鹏920","cores":64,"status":"已验证"},{"name":"飞腾S2500","cores":64,"status":"已验证"}],
        "db":[{"name":"达梦DM8","compat":"PostgreSQL","status":"已验证"},{"name":"金仓Kingbase","compat":"PostgreSQL","status":"已验证"}],
        "middleware":{"tongweb":"兼容","dongfangtong":"兼容"},"browser":{"奇安信":"已验证","360安全":"已验证","Edge":"已验证"},
        "certification":"信创目录适配中"}

@app.get("/api/audit/export")
async def audit_export():
    """审计日志导出 — 对齐 ⑤管得住"""
    return {"format":"CSV","rows":3847,"from":"2026-07-01","to":"2026-08-10","download_url":"/api/audit/export.csv",
        "summary":{"logins":2156,"alarm_actions":892,"config_changes":156,"device_operations":643}}

@app.get("/api/deploy/check")
async def deploy_check():
    """部署完整性校验 — 对齐 ⑥交付保障"""
    return {"frontend":{"dist_mb":5.8,"pages":29,"status":"deployed"},"backend":{"api_count":61,"status":"running"},
        "storage":{"tdengine":"online","postgres":"online"},"nginx":{"5180":"active"},
        "overall":"✅ 全栈部署完整 · 前端+后端+存储+代理 四层就绪"}


@app.get("/api/gis/devices")
async def gis_devices():
    return {"devices":[{"id":"CY1C8K-000","name":"Oil#000","lat":46.5872,"lng":124.8912,"status":"online"}]}

@app.get("/api/maintenance/status")
async def maintenance_status():
    """运维监控 — 实时参数 + 服务状态 + 数据库状态"""
    import math; t = time.time()
    params = [
        {"device":"Modbus TCP 逆变器","point":"有功功率","value":round(3480+400*math.sin(t/35),1),"unit":"W","range":"0-5000","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 逆变器","point":"A相电压","value":round(230+5*math.sin(t/45),1),"unit":"V","range":"200-260","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 逆变器","point":"A相电流","value":round(15+3*math.sin(t/20),1),"unit":"A","range":"0-20","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 储能","point":"SOC","value":round(78+15*math.sin(t/60),1),"unit":"%","range":"10-90","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 充电桩","point":"充电功率","value":round(60+20*math.sin(t/50),1),"unit":"kW","range":"0-120","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"IEC 104","point":"遥测电压","value":round(380+10*math.sin(t/30),1),"unit":"V","range":"360-400","status":"normal","time":time.strftime("%H:%M:%S")},
    ]
    services = [
        {"name":"Modbus TCP 逆变器","host":"127.0.0.1","port":502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus TCP 储能","host":"127.0.0.1","port":1502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus TCP 充电桩","host":"127.0.0.1","port":2502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus 电表","host":"127.0.0.1","port":503,"status":"online","protocol":"Modbus RTU"},
        {"name":"IEC 104","host":"127.0.0.1","port":2404,"status":"online","protocol":"IEC 104"},
        {"name":"OPC UA","host":"127.0.0.1","port":4840,"status":"online","protocol":"OPC UA"},
        {"name":"OPC DA","host":"127.0.0.1","port":9090,"status":"online","protocol":"OPC DA"},
    ]
    return {"params":params,"services":services,
        "sqlite":{"status":"connected","records":472189,"path":"data/telemetry.db"},
        "postgres":{"status":"connected","host":"127.0.0.1:7432"},
        "tdengine":{"status":"connected","host":"172.22.193.167:6041","points":34226620},
        "stats":{"online_devices":566,"collects":472189,"success_rate":99.96,"alarms_active":3}}

@app.get("/api/protocol/status")
async def protocol_status():
    return {"adapters":[
        {"name":"A11","host":"11.66.12.130","devices":1032,"tested":True},
        {"name":"Modbus TCP","host":"11.249.34.1","devices":76,"tested":True},
        {"name":"OPC DA","host":"172.23.9.3","devices":5,"tested":True},
        {"name":"OPC UA","host":"172.26.6.3","tested":True},
        {"name":"IEC104","host":"11.250.1.1","tested":True},
        {"name":"MQTT","host":"11.66.12.131","tested":True}],"total":10,"all_tested":True}

@app.get("/api/archive/log")

@app.get("/api/scene/progress")
async def scene_progress():
    """三阶段渐进接入进度 — 场景适配"""
    return {"phases":[
        {"phase":1,"name":"观察期","status":"completed","作业区":15,"description":"静态IP终端作业区·边缘代理上线·客户端主动采集·驾驶舱雏形"}, 
        {"phase":2,"name":"桥接复制期","status":"in_progress","作业区":8,"description":"动态IP终端作业区·桥接组件部署·抢占原地址端口复制转发·A11原业务不受影响"}, 
        {"phase":3,"name":"稳定并行期","status":"pending","作业区":0,"description":"全作业区并行覆盖·调频策略逐区生效·定制算法注册·驾驶舱全量数据"}],
        "total_zones":100,"completed":23}

@app.get("/api/scene/catchup")
async def scene_catchup():
    """断网缓存补传状态 — 场景适配"""
    return {"offline_devices":3,"total_pending":12450,"补传进度_pct":87.5,
        "devices":[{"id":"CY1C8K-050","offline_since":"2026-08-11 06:30","pending":4200,"补传进度":92.3,"预计完成":"12:45"}, 
                   {"id":"CY1C8K-120","offline_since":"2026-08-11 08:15","pending":6800,"补传进度":84.1,"预计完成":"13:20"}],
        "status":"补传中"}

@app.get("/api/scene/catchup/detail")
async def scene_catchup_detail():
    """断网补传详细记录 — 每条设备的补传状态"""
    return {"devices":[
        {"id":"CY1C8K-050","zone":"第四作业区","offline_start":"08-11 06:30","offline_duration_min":680,"pending":4200,"补传进度":92.3,"speed":"156条/min","预计完成":"12:45","status":"补传中"},
        {"id":"CY1C8K-120","zone":"第四作业区","offline_start":"08-11 08:15","offline_duration_min":575,"pending":6800,"补传进度":84.1,"speed":"142条/min","预计完成":"13:20","status":"补传中"},
        {"id":"CY1C8K-200","zone":"第三作业区","offline_start":"08-10 22:00","offline_duration_min":1190,"pending":15600,"补传进度":56.8,"speed":"98条/min","预计完成":"15:30","status":"补传中"},
    ],"history":[{"date":"08-10","devices":5,"total_pending":28400,"补传完成":28400,"duration_min":180},{"date":"08-09","devices":2,"total_pending":8500,"补传完成":8500,"duration_min":55}]}

@app.get("/api/scene/frequency/config")
async def scene_freq_config():
    """调频策略详细配置"""
    return {"strategies":[
        {"zone":"第四作业区","current_freq":5,"status":"高频","trigger_弱网":{"enabled":True,"rtt_threshold_ms":200,"降频步长":2,"最低频率":30},"trigger_低峰":{"enabled":True,"时段":"22:00-06:00","频率":30},"trigger_异常":{"enabled":True,"sensor":"oil_pressure","阈值":0.5,"加密频率":1}},
        {"zone":"第三作业区","current_freq":15,"status":"中频","trigger_弱网":{"enabled":True,"rtt_threshold_ms":300,"降频步长":5,"最低频率":60}},
        {"zone":"第二作业区","current_freq":60,"status":"低频","trigger_低峰":{"enabled":True,"时段":"00:00-05:00","频率":120}},
    ]}

@app.get("/api/data/export/batch")
async def batch_export():
    """批量数据导出任务"""
    return {"tasks":[
        {"id":"exp_001","format":"Excel","devices":156,"rows":15000,"size_mb":2.3,"status":"completed","created":"08-11 10:00"},
        {"id":"exp_002","format":"CSV","devices":500,"rows":500000,"size_mb":45.2,"status":"processing","progress":67,"created":"08-11 11:30"},
    ]}

@app.get("/api/scene/frequency")
async def scene_frequency():
    """智能动态调频 — 场景适配"""
    return {"current_mode":"normal","弱网降频触发":False,"低峰降频":True,"异常加密":False,
        "策略":[{"作业区":"第四作业区","频率":5,"分级":"高频","设备数":191,"状态":"关键设备"}, 
                {"作业区":"第三作业区","频率":15,"分级":"中频","设备数":76,"状态":"普通设备"}, 
                {"作业区":"第二作业区","频率":60,"分级":"低频","设备数":45,"状态":"辅助设备"}]}

@app.get("/api/scene/zones")
async def scene_zones():
    """作业区独立部署状态 — 场景适配"""
    return {"zones":[{"id":"zone_04","name":"第四作业区","agent_status":"online","中枢连接":"已注册","策略模板":"高频采集模板","采集频率":5,"设备数":191}, 
                     {"id":"zone_03","name":"第三作业区","agent_status":"online","中枢连接":"已注册","策略模板":"中频采集模板","采集频率":15,"设备数":76}],
            "模板":[{"name":"高频采集模板","频率":5,"适用":"关键设备密集作业区","状态":"已生效"}, 
                    {"name":"中频采集模板","频率":30,"适用":"普通设备作业区","状态":"已生效"}]}

@app.get("/api/data/replay/{device_id}")
async def data_replay(device_id: str, start: str = "", end: str = ""):
    """历史数据回放 — 数据存储"""
    import math; t = time.time()
    points = [{"ts":int((t-i*60)*1000),"value":round(2.1+0.3*math.sin((t-i*60)/30)+random.random()*0.1,2)} for i in range(200)]
    return {"device_id":device_id,"points":points,"total":len(points)}

@app.get("/api/algorithm/market")
async def algorithm_market():
    """算法市场 — 跨作业区共享"""
    return {"algorithms":[
        {"id":"alg_001","name":"泵效诊断","适用":"抽油机井","提交":"第四作业区","审核":"已通过","效果":92.5,"下载":15,"rating":4.5},
        {"id":"alg_002","name":"动液面计算","适用":"抽油机井","提交":"第三作业区","审核":"已通过","效果":89.1,"下载":8,"rating":4.2},
        {"id":"alg_003","name":"含水率趋势","适用":"电泵井","提交":"第二作业区","审核":"审核中","效果":0,"下载":0,"rating":0},
    ],"market_stats":{"total":3,"approved":2,"pending":1}}

@app.get("/api/data/export")
async def data_export(format: str = "csv", device_id: str = ""):
    """数据导出 — CSV/JSON/Excel"""
    return {"format":format,"device_id":device_id,"status":"ready","size_mb":2.3,"rows":15000,"download_url":f"/api/data/export/download?format={format}"}

@app.get("/api/data/api-docs")
async def api_docs():
    """REST API 文档 — 数据存储"""
    return {"swagger_url":"/docs","openapi_url":"/openapi.json","endpoints":76,"categories":["auth","health","devices","alarms","channels","stream","storage","security","scene"]}

async def archive_log():
    return {"last_archive":"2026-08-11 02:00:00","status":"completed","moved_hot_to_warm":"3.2GB","compressed_ratio":8.3}

@app.get("/api/data/lifecycle")
async def data_lifecycle():
    """数据生命周期管理 — 对齐申报要求 ②存得住"""
    return {"policies":[
        {"tier":"hot","engine":"TDengine","retention":"30天","size_gb":48.2,"points":34226620,"status":"active","action":"30天后自动归档到温数据"},
        {"tier":"warm","engine":"PostgreSQL","retention":"1年","size_gb":12.5,"tables":48,"status":"active","action":"1年后压缩归档到冷存储"},
        {"tier":"cold","engine":"SQLite","retention":"永久","size_mb":256,"location":"./data/archive","status":"active","action":"仅用于边缘降级兜底"},
    ],
        "auto_archival": True,"last_archival": time.strftime("%Y-%m-%d %H:%M:%S"),
        "compression_ratio": 8.3,"total_raw_gb": 508,"total_stored_gb": 61}

@app.post("/api/security/keygen/{device_id}")
async def security_keygen(device_id: str):
    """为设备生成 SM4 密钥"""
    import hashlib, os
    key = hashlib.sha256(f"dgiot_sm4_{device_id}_{os.urandom(4).hex()}".encode()).digest()[:16].hex()
    return {"device_id": device_id, "algorithm": "SM4", "key": key[:8]+"..."+key[-8:], "length": 128, "created": time.strftime("%Y-%m-%d %H:%M:%S")}

@app.get("/api/health/mqtt")
async def health_mqtt():
    return {"ok":True,"ms":2,"status":"已连接"}

# ══════ Alarms — SQLite backed ══════
@app.get("/api/alarms")
async def alarms(status: str = None, limit: int = 100):
    conn = _alarm_db()
    q = 'SELECT * FROM Alarm' + (' WHERE status=?' if status else '') + ' LIMIT ?'
    args = (status, limit) if status else (limit,)
    rows = conn.execute(q, args).fetchall()
    conn.close()
    result = [_alarm_row_to_dict(r) for r in rows]
    return {"total": len(result), "alarms": result}

@app.post("/api/alarms/{id}/confirm")
async def confirm(id: str):
    _update_alarm_status(id, "confirmed")
    return {"status": "confirmed", "alarm_id": id}

@app.post("/api/alarms/{id}/clear")
async def clear(id: str):
    _update_alarm_status(id, "cleared")
    return {"status": "cleared", "alarm_id": id}

@app.get("/api/classes/Alarm")
async def parse_alarms(limit: int = 100, where: str = None):
    conn = _alarm_db()
    q = 'SELECT * FROM Alarm'
    args = []
    if where:
        try:
            cond = json.loads(where)
            if "status" in cond:
                q += ' WHERE status=?'
                args.append(cond["status"])
        except:
            pass
    q += ' LIMIT ?'
    args.append(limit)
    rows = conn.execute(q, args).fetchall()
    total = conn.execute('SELECT count(*) FROM Alarm').fetchone()[0]
    conn.close()
    results = [_alarm_row_to_dict(r) for r in rows]
    return {"results": results, "count": len(results), "total": total}

@app.put("/api/classes/Alarm/{objectId}")
async def update_alarm(objectId: str, body: dict):
    if "status" in body:
        _update_alarm_status(objectId, body["status"])
        return {"objectId": objectId, "status": body["status"]}
    return {"objectId": objectId, "status": "unchanged"}

# ══════ Devices ══════
@app.get("/api/devices")
async def devices(page_size:int=200):
    devs=[{"device_id":f"CY1C8K-{i:03d}","device_name":f"油井CY1C8K-{i}","devType":"oil_well","status":"online","protocol":"modbus_tcp","station_id":"CY1C8K","manufacturer":"大庆油田"} for i in range(1,567)]
    return {"total":566,"page":1,"page_size":page_size,"devices":devs[:page_size]}

@app.get("/api/devices/{device_id}")
async def device_detail(device_id:str):
    return {"device_id":device_id,"device_name":f"油井{device_id}","status":"online","protocol":"modbus_tcp"}

# ══════ Stats ══════
@app.get("/api/edge/topology")
async def edge_topology():
    """边缘拓扑 — 代理→中枢 数据流全链路"""
    return {
        "proxy": {
            "hostname": "IO-SRV-130",
            "ip": "11.66.12.130",
            "os": "Windows Server 2016",
            "cpu": 8, "mem_gb": 32,
            "status": "online",
            "protocols": [
                {"name": "CommBridge", "port": 53001, "devices": 191, "points": 4567, "mqtt_topic": "dgiot/proxy/commbridge"},
                {"name": "OPC DA", "port": 135, "devices": 5, "points": 26081, "mqtt_topic": "dgiot/proxy/opcda"},
                {"name": "A11", "port": 8889, "devices": 1032, "points": 16663, "mqtt_topic": "dgiot/proxy/a11"},
                {"name": "Modbus TCP", "port": 502, "devices": 76, "points": 2100, "mqtt_topic": "dgiot/proxy/modbus"},
                {"name": "IEC104", "port": 2404, "devices": 0, "points": 0, "mqtt_topic": "dgiot/proxy/iec104"},
            ],
            "mqtt_bridge": {"status": "connected", "broker": "11.66.12.131:1883", "topics": 5, "pushed": 49411, "failed": 89, "rate": 156}
        },
        "hub": {
            "hostname": "Kylin-DMZ",
            "ip": "11.66.12.131",
            "os": "openEuler 22.03",
            "cpu": 16, "mem_gb": 64,
            "status": "online",
            "services": [
                {"name": "EMQX", "port": 1883, "status": "online", "connections": 5, "messages_per_s": 156},
                {"name": "dgiot MQTT", "port": 18083, "status": "online", "apps": 36},
                {"name": "Parse Server", "port": 1337, "status": "online"},
                {"name": "TDengine", "port": 6041, "status": "online", "points": 34226620},
                {"name": "PostgreSQL", "port": 7432, "status": "online"},
                {"name": "NestJS", "port": 3100, "status": "online"},
            ],
            "stream_engine": {"algorithms": 15, "active": 12, "qps": 156, "top5": ["工况诊断", "产液量", "含水率", "泵效", "平衡度"]},
            "storage": {"pg_tables": 48, "td_stables": 12, "total_points": 34226620}
        },
        "bridge": {
            "status": "active",
            "latency_ms": 4.2,
            "bandwidth_mbps": 0.8,
            "protocol": "MQTT QoS 1",
            "encryption": "TLS 1.2",
            "last_sync": time.strftime("%Y-%m-%d %H:%M:%S"),
            "data_flow": [
                {"from": "IO-SRV-130:53001", "to": "Kylin:1883", "protocol": "CommBridge→MQTT", "packets": 49411, "mb": 23.5},
                {"from": "IO-SRV-130:135", "to": "Kylin:1883", "protocol": "OPC DA→MQTT", "packets": 26081, "mb": 12.1},
                {"from": "IO-SRV-130:8889", "to": "Kylin:1883", "protocol": "A11→MQTT", "packets": 16663, "mb": 8.0},
            ]
        }
    }

@app.get("/api/storage/status")
async def storage_status():
    """混合存储引擎状态 — TDengine(热)+PG(温)+SQLite(冷)"""
    return {
        "tdengine": {"status":"online","host":"172.22.193.167","port":6041,"points":34226620,"size_gb":48.2,"retention_days":30,"tier":"hot","latency_ms":3},
        "postgresql": {"status":"online","host":"127.0.0.1","port":7432,"tables":48,"size_gb":12.5,"tier":"warm","latency_ms":2},
        "sqlite": {"status":"online","path":"./data/parse.db","size_mb":256,"tier":"cold","writes":472189,"purpose":"edge_fallback"},
    }

@app.get("/api/mqtt/status")
async def mqtt_status():
    """MQTT 边云同步状态"""
    return {
        "broker": {"host":"11.66.12.131","port":1883,"status":"online","connections":6,"messages_per_s":156,"uptime_days":15},
        "bridge": {"status":"active","direction":"bidirectional","qos":1,"topics":5,"synced_packets":103208,"failed":189,"latency_ms":4.2},
        "topics": [
            {"topic":"dgiot/proxy/commbridge","qos":1,"messages":49411,"rate":52.3},
            {"topic":"dgiot/proxy/opcda","qos":1,"messages":26081,"rate":31.2},
            {"topic":"dgiot/proxy/a11","qos":1,"messages":16663,"rate":18.0},
            {"topic":"dgiot/proxy/modbus","qos":1,"messages":6100,"rate":8.5},
            {"topic":"dgiot/proxy/iec104","qos":0,"messages":0,"rate":0},
        ]
    }

@app.post("/api/fde/wizard/product")
async def fde_wizard_product(body: dict):
    """FDE Step 1: 创建产品/物模型"""
    return {"status":"created","devType":body.get("devType","inverter"),"productId":f"prod_{body.get('devType','inverter')}_{int(time.time())}"}

@app.post("/api/fde/wizard/compile")
async def fde_wizard_compile(body: dict):
    """FDE Step 2: 物模型 → 本体自动编译"""
    devType = body.get("devType", "inverter")
    models = {
        "inverter": {"product_name":"光伏逆变器","points":{
            "pv_power":{"name":"有功功率","unit":"W","type":"float32","register_addr":"40001","alarm_high":4500,"alarm_low":100},
            "pv_voltage_a":{"name":"A相电压","unit":"V","type":"float32","register_addr":"40003","alarm_high":260,"alarm_low":200},
            "pv_current_a":{"name":"A相电流","unit":"A","type":"float32","register_addr":"40005","alarm_high":20,"alarm_low":1}}},
        "meter": {"product_name":"智能电表","points":{
            "energy_total":{"name":"总电量","unit":"kWh","type":"float32","register_addr":"40001"},
            "power_factor":{"name":"功率因数","unit":"","type":"float32","register_addr":"40003"}}},
        "pump": {"product_name":"抽油机","points":{
            "oil_pressure":{"name":"油压","unit":"MPa","type":"float32","register_addr":"40300","alarm_high":4.0,"alarm_low":0.5},
            "motor_current":{"name":"电机电流","unit":"A","type":"float32","register_addr":"40350","alarm_high":85,"alarm_low":15},
            "temperature":{"name":"温度","unit":"℃","type":"float32","register_addr":"40430","alarm_high":95,"alarm_low":25}},
        },
    }
    model = models.get(devType, models["inverter"])
    points = model["points"]
    site_id = body.get("site_id", "site_daqing")
    gw_id = body.get("gateway_id", "gw_edge_01")
    ch_id = body.get("channel_id", f"ch_{devType}_01")
    dev_id = f"dev_{devType}_001"

    # 自动生成约束
    constraints = []
    for pid, pt in points.items():
        if pt.get("alarm_high") or pt.get("alarm_low"):
            rules = []
            if pt.get("alarm_high"): rules.append(f"{pt['name']}>{pt['alarm_high']}")
            if pt.get("alarm_low"): rules.append(f"{pt['name']}<{pt['alarm_low']}")
            constraints.append({"id":f"c_{devType}_{pid}","name":f"{pt['name']}阈值告警","rule":" OR ".join(rules)+" → alarm","entity":f"pt_{devType}_{pid}","severity":"warning","source":"物模型自动生成","action":f"触发{pt['name']}告警通知"})

    return {
        "status": "compiled","devType": devType,
        "ontology": {"sites":1,"gateways":1,"channels":1,"devices":1,"points":len(points),"constraints":len(constraints)},
        "entities": {
            "site": site_id, "gateway": gw_id, "channel": ch_id, "device": dev_id,
            "points": [f"pt_{devType}_{pid}" for pid in points],
            "constraints": [c["id"] for c in constraints]
        },
        "model": {"product_name": model["product_name"], "points": {pid: {"name":pt["name"],"unit":pt["unit"],"type":pt["type"]} for pid,pt in points.items()}},
        "constraints": constraints
    }

@app.post("/api/fde/wizard/scan")
async def fde_wizard_scan(body: dict):
    """FDE Step 3: 协议扫描 — 用 pymodbus 真实连接读取"""
    host = body.get("host","127.0.0.1"); port = int(body.get("port",502))
    s0 = int(body.get("start_addr",1)); e0 = int(body.get("end_addr",10))
    slaves = []
    try:
        from pymodbus.client import ModbusTcpClient
        client = ModbusTcpClient(host, port, timeout=2)
        if client.connect():
            for sid in range(s0, e0+1):
                try:
                    rr = client.read_holding_registers(0, 3, slave=sid)  # 读前3个寄存器
                    if not rr.isError():
                        regs = [{"address":i,"value":rr.registers[i]} for i in range(min(3,len(rr.registers)))]
                        slaves.append({"slave_id":sid,"active":True,"registers":regs})
                    else:
                        slaves.append({"slave_id":sid,"active":False,"registers":[]})
                except:
                    slaves.append({"slave_id":sid,"active":False,"registers":[]})
            client.close()
        else:
            # 回退到模拟数据
            raise Exception("not reachable")
    except:
        for sid in range(s0, e0+1):
            active = sid in {1,3,5,8,10}
            regs = [{"address":40001+sid*10+i,"value":220+sid*3+i*7} for i in range(3)] if active else []
            slaves.append({"slave_id":sid,"active":active,"registers":regs})
    active_n = sum(1 for s in slaves if s["active"])
    return {"summary":f"{host}:{port} 扫描 {s0}-{e0} 完成{' (真数据)' if active_n>0 and slaves[0].get('registers') and slaves[0]['registers'][0].get('address')==0 else ' (模拟)'} · 活跃 {active_n}/{len(slaves)}",
            "slaves_found":active_n,"points_found":sum(len(s["registers"]) for s in slaves if s["active"]),
            "slaves":slaves}

@app.post("/api/fde/wizard/dashboard")
async def fde_wizard_dashboard(body: dict):
    """FDE Step 5: 驾驶舱一键生成"""
    devType = body.get("devType","inverter")
    import random, math
    t = time.time()
    points_data = [{"name":"有功功率","value":round(3480+400*math.sin(t/30),1),"unit":"W","trend":[round(3400+200*math.sin((t-i*60)/30),1) for i in range(30)]},
                   {"name":"A相电压","value":round(230+5*math.sin(t/45),1),"unit":"V","trend":[round(228+4*math.sin((t-i*60)/45),1) for i in range(30)]},
                   {"name":"A相电流","value":round(15+3*math.sin(t/20),1),"unit":"A","trend":[round(14+2*math.sin((t-i*60)/20),1) for i in range(30)]}]
    alarms_data = [{"name":"功率过高","value":f">{5000}W","status":"normal"},
                   {"name":"电压异常","value":f"{'>'if random.random()<0.3 else '<'}{260}V","status":"warning" if random.random()<0.3 else "normal"}]
    return {"status":"ready",
        "dashboard":{
            "cards":[{"title":"设备数","value":1,"icon":"⏱️"},{"title":"采集点","value":3,"icon":"📊"},{"title":"告警","value":0,"icon":"⚠️"},{"title":"在线率","value":"100%","icon":"🟢"}],
            "trend_chart":{"points":points_data},
            "alarm_panel":{"points":alarms_data}
        }}

@app.post("/api/fde/wizard/agent")
async def fde_wizard_agent(body: dict):
    """FDE Step 6: AI Agent 一键生成全部配置"""
    desc = body.get("description","")
    # 根据描述推断设备类型
    devType = "inverter"
    product_name = "光伏逆变器"
    if "储能" in desc or "PCS" in desc: devType = "pcs"; product_name = "储能PCS"
    elif "充电" in desc: devType = "charger"; product_name = "充电桩"
    elif "箱变" in desc or "变压器" in desc: devType = "transformer"; product_name = "箱式变压器"
    elif "水泵" in desc: devType = "pump"; product_name = "抽油机"
    points = 3 if devType == "inverter" else 4
    rules = [{"id":"r1","name":"功率过高","condition":"power>5000","action":"告警","severity":"warning"},
             {"id":"r2","name":"温度过高","condition":"temperature>80","action":"告警","severity":"critical"}]
    return {"status":"completed",
        "inferred":{"product_name":product_name,"device_type":devType,"points":points},
        "step1_product":{"point_count":points},
        "step2_ontology":{"devices":1,"points":points,"constraints":len(rules)},
        "step3_scan_hint":"127.0.0.1:502 扫描完成 活跃3从站",
        "step5_rules":rules,
        "step6_deploy":"驾驶舱已生成 · 全部6步配置完成"}

@app.get("/api/scene/list")
async def scene_list():
    """采集场景管理 — 场景编排/规则引擎/批量下发"""
    return {"scenes":[
        {"id":"s1","name":"第四作业区全量采集","devices":191,"protocols":["modbus_tcp","a11"],"interval":5,"status":"running","lastDeploy":"2026-08-09 08:00"},
        {"id":"s2","name":"第三作业区 Modbus 定时","devices":76,"protocols":["modbus_tcp"],"interval":30,"status":"running","lastDeploy":"2026-08-08 18:00"},
        {"id":"s3","name":"DCS 联合站 OPC DA","devices":5,"protocols":["opcda"],"interval":1,"status":"running","lastDeploy":"2026-08-09 06:30"},
        {"id":"s4","name":"A11 兼容采集 (只读)","devices":1032,"protocols":["a11"],"interval":10,"status":"paused","lastDeploy":"2026-08-07 12:00"},
        {"id":"s5","name":"IEC104 电力规约","devices":0,"protocols":["iec104"],"interval":5,"status":"pending","lastDeploy":""},
    ]}

@app.get("/api/stats")
async def stats():
    return {"total_devices":566,"online_devices":566,"total_collects":472189,"total_success":472000,"total_fail":189,"success_rate":99.96,"pipeline_running":True,"active_alarms":3,"uptime_seconds":int(time.time()-t0),"telemetry_rows":34226620}

# ══════ Rules ══════
@app.get("/api/rules")
async def rules(): return {"rules":[{"id":"r1","name":"电流越限","enabled":1,"severity":"danger"}]}

# ══════ Device Detail ══════
@app.get("/api/devices/{device_id}/points")
async def device_detail_points(device_id:str):
    return {"points":[{"point_id":"oil_pressure","point_name":"油压","value":2.35,"unit":"MPa","protocol_addr":"0"},{"point_id":"temperature","point_name":"温度","value":45.6,"unit":"C","protocol_addr":"1"},{"point_id":"motor_current","point_name":"电机电流","value":15.2,"unit":"A","protocol_addr":"2"}]}

@app.get("/api/telemetry/{device_id}/latest")
async def device_latest(device_id:str):
    return {"data":[{"ts":int(time.time()*1000),"oil_pressure":2.35,"temperature":45.6,"motor_current":15.2,"quality":192}]}

# ══════ Telemetry ══════
@app.get("/api/telemetry/{device_id}/{point_id}")
async def telemetry(device_id:str,point_id:str,limit:int=100):
    data=[{"ts":int(time.time()*1000)-(100-i)*60000,"value":round(2.5+random.uniform(-1,1.5),2),"quality":192} for i in range(limit)]
    return {"device_id":device_id,"point_id":point_id,"data":data,"count":len(data)}

@app.post("/api/telemetry")
async def post_telemetry(body:dict): return {"status":"ok"}

# ══════ Channels ══════
@app.get("/api/classes/Channel")
async def channels(limit:int=20):
    chs=[{"objectId":"ch1","name":"CommBridge:53001","cType":"modbus_tcp","status":"online","host":"11.248.195.1","port":53001},
         {"objectId":"ch2","name":"OPC DA:135","cType":"opcda","status":"online","host":"172.23.9.3","port":135},
         {"objectId":"ch3","name":"A11:8889","cType":"a11","status":"online","host":"11.66.12.130","port":8889},
         {"objectId":"ch4","name":"dgiot:53002","cType":"modbus_tcp","status":"online","host":"11.66.12.131","port":53002}]
    return {"results":chs,"total":len(chs)}

# ══════ Parse Classes ══════
@app.get("/api/classes/Device")
async def parse_devices(limit:int=200,skip:int=0,page:int=1,page_size:int=200,device_type:str=None,search:str=None):
    # Support both page/page_size and limit/skip patterns
    if page > 1 or page_size != 200: limit, skip = page_size, (page-1)*page_size
    types=[('oil_well','抽油机井','CY1C8K','modbus_tcp'),('oil_well','螺杆泵井','CY1C8K','modbus_tcp'),('oil_well','电泵井','CY1C8K','modbus_tcp'),
           ('water_injection','注水井','CY1C8K','modbus_tcp'),('rtu','RTU终端','CY1C8K','modbus_tcp'),('dcs','DCS控制站','CY1C8K','opcda'),
           ('relay','DSL-31A断路器','CY1C8K','modbus_tcp'),('relay','DST-31A变压器差动','CY1C8K','modbus_tcp'),('compressor','压缩机','CY1C8K','a11'),
           ('pipeline','集输管线','CY1C8K','modbus_tcp'),('gas_injection','注气站','CY1C8K','iec104'),('dewater','脱水站','CY1C8K','opcda')]
    results=[]
    for i in range(skip,min(skip+limit,566)):
        dt,name,station,proto=types[i%len(types)]
        results.append({"objectId":f"dev_{i:04d}","devaddr":f"CY1C8K-{i:03d}","device_id":f"CY1C8K-{i:03d}","name":f"{name}-{i:03d}","device_name":f"{name}-{i:03d}",
            "devType":dt,"device_type":dt,"product":{"objectId":"prod_oilwell"},"status":"online" if i<540 else "offline",
            "ip":f"11.248.{195+i//256}.{i%256}","station_id":station,"protocol":proto,"manufacturer":"大庆油田","model":name})
    return {"results":results,"total":566,"count":566}

@app.get("/api/classes/Device/{device_id}")
async def parse_device_one(device_id:str):
    return {"objectId":device_id,"devaddr":device_id,"device_id":device_id,"name":f"油井 {device_id}","device_name":f"油井 {device_id}","devType":"oil_well","device_type":"oil_well","status":"online","protocol":"modbus_tcp","station_id":"CY1C8K","manufacturer":"大庆油田","model":"抽油机井","last_online_at":"2026-08-07T14:00:00"}

@app.get("/api/classes/Product")
async def parse_products(): return {"results":[
    {"objectId":"prod_oil_well_pump","name":"抽油机井","devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"油压","dataType":"float","unit":"MPa","range":"0.5-4.5","alarm_high":4.0,"alarm_low":0.5},{"id":"temperature","name":"温度","dataType":"float","unit":"℃","range":"25-95","alarm_high":90},{"id":"motor_current","name":"电机电流","dataType":"float","unit":"A","range":"15-85","alarm_high":80,"alarm_low":10}],
    "events":[{"id":"pump_stop","name":"停井告警","type":"alarm","desc":"抽油机意外停机时触发"},{"id":"overload","name":"过载告警","type":"alarm","desc":"电机电流超过额定值130%时触发"},{"id":"leak","name":"泄漏告警","type":"fault","desc":"管道压力骤降超过阈值时触发"}],
    "services":[{"id":"set_frequency","name":"设定采集频率","input":{"frequency":"int","unit":"s"},"output":{"result":"bool"}},{"id":"set_threshold","name":"设定告警阈值","input":{"point_id":"string","high":"float","low":"float"},"output":{"result":"bool"}}]}},
    {"objectId":"prod_oil_well_screw","name":"螺杆泵井","devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"油压","dataType":"float","unit":"MPa"},{"id":"rotor_speed","name":"转速","dataType":"float","unit":"rpm"}]}},
    {"objectId":"prod_oil_well_esp","name":"电泵井","devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"油压","dataType":"float","unit":"MPa"},{"id":"motor_current","name":"电流","dataType":"float","unit":"A"}]}},
    {"objectId":"prod_water_inj","name":"注水井","devType":"water_injection","thing":{"properties":[{"id":"water_pressure","name":"注水压力","dataType":"float","unit":"MPa"},{"id":"flow_rate","name":"流量","dataType":"float","unit":"m3/h"}]}},
    {"objectId":"prod_rtu","name":"RTU终端","devType":"rtu","thing":{"properties":[{"id":"signal","name":"信号强度","dataType":"int16","unit":"dBm"}]}},
    {"objectId":"prod_dcs","name":"DCS控制站","devType":"dcs","thing":{"properties":[{"id":"status","name":"运行状态","dataType":"int16","unit":""}]}},
    {"objectId":"prod_relay_dsl31a","name":"DSL-31A 断路器","devType":"relay","thing":{"properties":[{"id":"Ia","name":"A相电流","dataType":"float","unit":"A"},{"id":"Ib","name":"B相电流","dataType":"float","unit":"A"},{"id":"Ic","name":"C相电流","dataType":"float","unit":"A"}]}},
    {"objectId":"prod_relay_dst31a","name":"DST-31A 变压器差动","devType":"relay","thing":{"properties":[{"id":"diff_current","name":"差动电流","dataType":"float","unit":"A"}]}},
    {"objectId":"prod_compressor","name":"压缩机","devType":"compressor","thing":{"properties":[{"id":"pressure","name":"排气压力","dataType":"float","unit":"MPa"},{"id":"temperature","name":"排气温度","dataType":"float","unit":"C"}]}},
    {"objectId":"prod_pipeline","name":"集输管线","devType":"pipeline","thing":{"properties":[{"id":"flow","name":"流量","dataType":"float","unit":"m3/h"},{"id":"pressure","name":"压力","dataType":"float","unit":"MPa"}]}},
    {"objectId":"prod_gas_inj","name":"注气站","devType":"gas_injection","thing":{"properties":[{"id":"gas_flow","name":"注气量","dataType":"float","unit":"m3/h"}]}},
    {"objectId":"prod_dewater","name":"脱水站","devType":"dewater","thing":{"properties":[{"id":"water_cut","name":"含水率","dataType":"float","unit":"%"}]}},
]}

@app.get("/api/classes/_User")
async def parse_users(): return {"results":[
    {"objectId":"u1","username":"dgiot_dev","nick":"DG-IoT开发者","role":"admin","email":"dev@dgiot.com","phone":"13800000000"},
    {"objectId":"u2","username":"operator","nick":"运维工程师","role":"operator","email":"op@dgiot.com"},
    {"objectId":"u3","username":"viewer","nick":"调度员","role":"viewer","email":"view@dgiot.com"},
]}

@app.get("/api/classes/Department")
async def parse_departments(): return {"results":[
    {"objectId":"d1","name":"大庆油田","code":"DQ","parentId":None},
    {"objectId":"d2","name":"采油二厂","code":"DQ02","parentId":"d1"},
    {"objectId":"d3","name":"第四作业区","code":"DQ0204","parentId":"d2"},
    {"objectId":"d4","name":"南4联合站","code":"CY1C8K","parentId":"d3"},
]}

@app.get("/api/classes/_Role")
async def parse_roles(): return {"results":[
    {"objectId":"r1","name":"管理员","code":"admin"},
    {"objectId":"r2","name":"运维工程师","code":"operator"},
    {"objectId":"r3","name":"调度员","code":"viewer"},
]}

# ══════ Admin ══════
@app.put("/api/admin/users/{user_id}/role")
async def admin_assign_role(user_id:str, body:dict): return {"status":"ok","user_id":user_id,"role":body.get("role","")}

@app.put("/api/admin/users/{user_id}/dept")
async def admin_assign_dept(user_id:str, body:dict): return {"status":"ok","user_id":user_id,"dept":body.get("dept","")}

@app.get("/api/admin/users")
async def admin_users(): return {"results":[{"objectId":"u1","username":"dgiot_dev","role":"admin","createdAt":"2026-08-01T08:00:00","updatedAt":"2026-08-07T12:00:00"},{"objectId":"u2","username":"operator","role":"operator","createdAt":"2026-08-02T08:00:00","updatedAt":"2026-08-07T10:00:00"},{"objectId":"u3","username":"viewer","role":"viewer","createdAt":"2026-08-03T08:00:00","updatedAt":"2026-08-07T09:00:00"}]}

@app.get("/api/admin/roles")
async def admin_roles(): return {"results":[{"objectId":"r1","name":"管理员","parent_id":None},{"objectId":"r2","name":"运维工程师","parent_id":None},{"objectId":"r3","name":"调度员","parent_id":None}]}

@app.get("/api/admin/departments")
async def admin_depts(): return {"results":[
    {"objectId":"d1","name":"大庆油田","parent_id":None,"_u":3},
    {"objectId":"d2","name":"采油二厂","parent_id":"d1","_u":2},
    {"objectId":"d3","name":"第四作业区","parent_id":"d2","_u":1},
    {"objectId":"d4","name":"南4联合站","parent_id":"d3","_u":1},
]}

@app.post("/api/login")
async def admin_login(body:dict): return {"sessionToken":"mock-session-token","username":body.get("username","admin")}

@app.delete("/api/classes/_User/{user_id}")
async def delete_user(user_id:str): return {"status":"deleted"}

@app.post("/api/users")
async def create_user(body:dict): return {"status":"created","username":body.get("username","")}

@app.get("/api/classes/_User")
async def parse_users2(): return {"results":[{"objectId":"u1","username":"dgiot_dev","role":"admin","createdAt":"2026-08-01T08:00:00","updatedAt":"2026-08-07T12:00:00"},{"objectId":"u2","username":"operator","role":"operator","createdAt":"2026-08-02T08:00:00"},{"objectId":"u3","username":"viewer","role":"viewer","createdAt":"2026-08-03T08:00:00"}]}

# ══════ Channels ══════
@app.post("/api/product/{product_id}/channels")
async def product_auto_channels(product_id: str):
    """对标 dgaiot: Product 创建自动生成三通道 — Channel + TDChannel + TaskChannel"""
    import hashlib
    ch_id = hashlib.md5(f"Channel{product_id}".encode()).hexdigest()[:10]
    td_id = hashlib.md5(f"TDChannel{product_id}".encode()).hexdigest()[:10]
    tk_id = hashlib.md5(f"TaskChannel{product_id}".encode()).hexdigest()[:10]
    return {"product_id": product_id, "auto_created": True,
        "channels": [
            {"channel_id": f"ch_{ch_id}", "name": f"{product_id} 采集通道", "cType": "modbus_tcp", "type": "Channel", "status": "online",
             "desc": "采集通道 — Product 创建时自动生成 · dgiot_product_channel:save_channel"},
            {"channel_id": f"td_{td_id}", "name": f"{product_id} 时序通道", "cType": "tdengine", "type": "TDChannel", "status": "online",
             "desc": "时序数据通道 — Product 创建时自动生成 · dgiot_product_channel:save_tdchannel"},
            {"channel_id": f"tk_{tk_id}", "name": f"{product_id} 任务队列", "cType": "task", "type": "TaskChannel", "status": "online",
             "desc": "任务队列 — Product 创建时自动生成 · dgiot_product_channel:save_taskchannel"}
        ]}

@app.get("/api/channels")
async def list_channels(): return {"channels":[
    # 协议通道 — dgiot_bridge 适配器
    {"device_id":"ch_commbridge","name":"CommBridge :53001","cType":"modbus_tcp","protocol":"Modbus TCP","status":"online","host":"11.248.195.1","port":53001,"devices":191,"points":4567,"desc":"191 RTU · 第四作业区 南4联合站"},
    {"device_id":"ch_modbus_tcp","name":"Modbus TCP :502","cType":"modbus_tcp","protocol":"Modbus TCP","status":"online","host":"11.249.34.1","port":502,"devices":76,"points":2100,"desc":"76 RTU · 第三作业区"},
    {"device_id":"ch_modbus_rtu","name":"Modbus RTU","cType":"modbus_rtu","protocol":"Modbus RTU","status":"online","host":"COM3","port":0,"devices":15,"points":450,"desc":"15台 RTU 串口"},
    {"device_id":"ch_opcda_1","name":"OPC DA DCS-A","cType":"opcda","protocol":"OPC DA","status":"online","host":"172.23.9.3","port":135,"devices":1,"points":4500,"desc":"RSLinx · DX8ZRZ联合站"},
    {"device_id":"ch_opcda_2","name":"OPC DA DCS-B","cType":"opcda","protocol":"OPC DA","status":"online","host":"172.23.9.23","port":135,"devices":1,"points":3800,"desc":"RSLinx · DX6PZ联合站"},
    {"device_id":"ch_opcua","name":"OPC UA :4840","cType":"opcua","protocol":"OPC UA","status":"offline","host":"172.26.6.3","port":4840,"devices":0,"points":0,"desc":"WinCC · DCS-C 待部署"},
    {"device_id":"ch_a11","name":"A11 :8889","cType":"a11","protocol":"A11专有","status":"online","host":"11.66.12.130","port":8889,"devices":1032,"points":16663,"desc":"pSpace CY1C7K · 16663 tags"},
    {"device_id":"ch_iec104","name":"IEC104 :2404","cType":"iec104","protocol":"IEC104","status":"offline","host":"11.250.1.1","port":2404,"devices":0,"points":0,"desc":"电力规约 · 待部署"},
    {"device_id":"ch_mqtt","name":"MQTT :1883","cType":"mqtt","protocol":"MQTT","status":"online","host":"localhost","port":1883,"devices":566,"points":0,"desc":"dgiot Broker · 千万级接入"},
    {"device_id":"ch_http","name":"HTTP REST","cType":"http_rest","protocol":"HTTP REST","status":"online","host":"localhost","port":8000,"devices":0,"points":0,"desc":"FastAPI · 200+ REST路由"},
    {"device_id":"ch_dtu","name":"DTU透传","cType":"dtu","protocol":"DTU透传","status":"online","host":"0.0.0.0","port":0,"devices":928,"points":0,"desc":"928台网关 DTU 透传"},
    {"device_id":"ch_rtsp","name":"RTSP视频","cType":"rtsp","protocol":"RTSP","status":"offline","host":"172.21.14.100","port":554,"devices":0,"points":0,"desc":"摄像头视频流 · 待部署"},
    # 时序通道 — TDChannel
    {"device_id":"td_1","name":"TDChannel-热数据","cType":"tdengine","protocol":"TDengine","status":"online","host":"127.0.0.1","port":6041,"devices":0,"points":34226620,"desc":"SSD热数据 · 30天保留"},
    {"device_id":"td_2","name":"TDChannel-温数据","cType":"tdengine","protocol":"TDengine","status":"online","host":"127.0.0.1","port":6041,"devices":0,"points":0,"desc":"HDD温数据 · 1年保留"},
    # 任务通道 — TaskChannel
    {"device_id":"task_1","name":"TaskChannel-采集调度","cType":"task","protocol":"Task","status":"online","host":"—","port":0,"devices":0,"points":0,"desc":"采集任务调度 · 优先级队列"},
    {"device_id":"task_2","name":"TaskChannel-告警分发","cType":"task","protocol":"Task","status":"online","host":"—","port":0,"devices":0,"points":0,"desc":"告警事件分发 · 通知队列"},
    # 厂商通道 — 10家网关
    {"device_id":"gw_hongdian","name":"宏电网关","cType":"vendor","protocol":"Vendor","status":"online","host":"—","port":0,"devices":120,"points":0,"desc":"注册帧识别·透传解析"},
    {"device_id":"gw_yinghantong","name":"映翰通网关","cType":"vendor","protocol":"Vendor","status":"online","host":"—","port":0,"devices":95,"points":0,"desc":"注册帧识别·透传解析"},
    {"device_id":"gw_yifan","name":"亿帆网关","cType":"vendor","protocol":"Vendor","status":"online","host":"—","port":0,"devices":88,"points":0,"desc":"注册帧识别·透传解析"},
    {"device_id":"gw_youren","name":"有人网关","cType":"vendor","protocol":"Vendor","status":"online","host":"—","port":0,"devices":76,"points":0,"desc":"注册帧识别·透传解析"},
    {"device_id":"gw_sixin","name":"四信网关","cType":"vendor","protocol":"Vendor","status":"online","host":"—","port":0,"devices":65,"points":0,"desc":"注册帧识别·透传解析"},
]}

@app.post("/api/channels/{ch_id}/reconnect")
async def channel_reconnect(ch_id:str): return {"status":"reconnected","id":ch_id}

# ══════ Simulator ══════
# ══════ Simulators — mutable state ══════
_sim_running = ["sim1","sim2","sim3"]

def _build_sim(id,name,proto,host,port,device,itemCount,channel,start_cmd,samples):
    running = id in _sim_running
    t = time.time()
    return {"id":id,"name":name,"protocol":proto,"host":host,"port":port,
            "device":device,"itemCount":itemCount,"status":"running" if running else "stopped",
            "channel":channel,"startCmd":start_cmd,"packets":random.randint(100,5000) if running else 0,
            "sampleValues": samples(t) if running else []}

def _sim_samples(tag,values):
    def gen(t):
        import math
        return [{"name":n,"value":round(b+a*math.sin(t/f),d),"unit":u}
                for n,b,a,f,d,u in values]
    return gen

_SIMS = [
    ("sim1","Modbus TCP","Modbus TCP","11.249.34.1",502,"76台RTU",2100,"ch_modbus_tcp",
     "python simulators/modbus_tcp_server.py",
     _sim_samples("oil",[("油压",2.1,0.3,2,2,"MPa"),("电流",45,8,3,1,"A"),("功率",22,3,5,1,"kW"),("频率",50,0.2,7,2,"Hz")])),
    ("sim2","OPC UA","OPC UA","172.26.6.3",4840,"WinCC DCS-C",3800,"ch_opcua",
     "python simulators/opcua_server.py",
     _sim_samples("opc",[("温度",85,12,4,1,"℃"),("压力",2.5,0.3,6,2,"MPa"),("液位",60,15,8,1,"%")])),
    ("sim3","IEC 104","IEC 104","11.250.1.1",2404,"RTU-104",30,"ch_iec104",
     "python simulators/iec104_server.py",
     _sim_samples("iec",[("遥测Ua",380,15,3,1,"V"),("遥信",1,1,10,0,"")])),
    ("sim4","A11 协议","A11 IOT","11.66.12.130",8889,"1032台pSpace",16663,"ch_a11",
     "python simulators/a11_simulator.py",
     _sim_samples("a11",[])),
]

@app.get("/api/simulators/status")
async def sim_status():
    return {"simulators": [_build_sim(*s) for s in _SIMS]}

@app.post("/api/simulators/start-all")
async def sim_start_all():
    global _sim_running
    _sim_running = [s[0] for s in _SIMS]
    return {"data": {"msg": "全部启动成功"}, "started": len(_sim_running)}

@app.post("/api/simulators/stop-all")
async def sim_stop_all():
    global _sim_running
    _sim_running = []
    return {"data": {"msg": "全部已停止"}, "stopped": 4}

@app.post("/api/simulators/{sim_id}/start")
async def sim_start(sim_id: str):
    global _sim_running
    if sim_id not in _sim_running:
        _sim_running.append(sim_id)
    return {"msg": f"{sim_id} 已启动", "status": "running", "id": sim_id}

@app.post("/api/simulators/{sim_id}/stop")
async def sim_stop(sim_id: str):
    global _sim_running
    if sim_id in _sim_running:
        _sim_running.remove(sim_id)
    return {"msg": f"{sim_id} 已停止", "status": "stopped", "id": sim_id}

@app.post("/api/scanner/modbus/scan")
async def scanner_modbus_scan(body: dict):
    from services.modbus_scanner import scan as modbus_scan
    return modbus_scan(
        host=body.get("host", "127.0.0.1"),
        port=body.get("port", 502),
        start=body.get("start", 1),
        end=body.get("end", 10),
        full=body.get("full", False),
    )


@app.post("/api/scanner/scan")
async def scanner_scan(body: dict):
    from services.modbus_scanner import scan as modbus_scan
    return modbus_scan(
        host=body.get("host", "127.0.0.1"),
        port=body.get("port", 502),
        start=body.get("start", 1),
        end=body.get("end", 10),
    )

@app.get("/api/packets")
async def sim_packets(limit:int=20): return {"packets":[
    {"ts":"08:19:01","device":"RTU-001","protocol":"Modbus TCP","data":"01 03 00 00 00 06 C5 C8","dir":"rx","status":"ok"},
    {"ts":"08:19:01","device":"DCS-A","protocol":"OPC DA","data":"Read 5 items OK","dir":"rx","status":"ok"},
    {"ts":"08:19:02","device":"RTU-002","protocol":"Modbus TCP","data":"01 03 00 06 00 03 78 0A","dir":"rx","status":"ok"},
    {"ts":"08:19:02","device":"IEC-RTU","protocol":"IEC104","data":"68 0E 00 00 00 00 64 01 06 00 01 00 00 00 00","dir":"rx","status":"ok"},
    {"ts":"08:19:03","device":"RTU-003","protocol":"Modbus TCP","data":"01 04 00 00 00 02 71 CB","dir":"tx","status":"err"},
][:limit]}

# ══════ System ══════
@app.get("/api/system")
async def system():
    cpu = psutil.cpu_percent(0.1)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage(".")
    net = psutil.net_io_counters()
    return {
        "hostname": platform.node(), "os": f"{platform.system()} {platform.release()}", "python": platform.python_version(),
        "cpu_percent": cpu, "cpu_count": psutil.cpu_count(logical=False), "cpu_logical": psutil.cpu_count(),
        "mem_total_gb": round(mem.total/(1024**3),1), "mem_used_gb": round(mem.used/(1024**3),1), "mem_percent": mem.percent,
        "disk_total_gb": round(disk.total/(1024**3),1), "disk_used_gb": round(disk.used/(1024**3),1),
        "net_sent_mb": round(net.bytes_sent/(1024**2),1), "net_recv_mb": round(net.bytes_recv/(1024**2),1),
        "storage_mode": "sqlite", "uptime": int(time.time()-t0), "data_dir": "./data"
    }

@app.get("/api/tenants/my")
async def tenant(): return {"tenant_id":"default","name":"大庆油田"}

@app.get("/api/users")
async def list_users(): return [{"username":"dgiot_dev","nick":"DG-IoT开发者","role":"admin"}]

# ══════ Navigation ══════
@app.get("/api/classes/Navigation")
async def navigation(): return {"results":[]}

# Seed alarm data on startup
def _seed_data():
    conn = _alarm_db()
    existing = conn.execute('SELECT COUNT(*) FROM Alarm').fetchone()[0]
    if existing == 0:
        seeds = [
            ("a1","a1","CY1C8K-000","critical","critical","油井CY1C8K-000 油压偏低 2.12MPa 低于阈值2.5","油压偏低","active","2026-08-11T08:00:00","油压异常"),
            ("a2","a2","COMP-01","major","major","压缩机#1 振动超标 3.8mm/s 高于阈值2.5","振动超标","active","2026-08-11T07:45:00","振动异常"),
            ("a3","a3","INV-01","warning","warning","逆变器#1 温度偏高 68°C 接近阈值70","温度偏高","active","2026-08-11T07:30:00","温度异常"),
        ]
        conn.executemany('INSERT INTO Alarm(objectId,alarm_id,device_id,severity,alarm_level,alarm_msg,message,status,created_at,alarm_type) VALUES(?,?,?,?,?,?,?,?,?,?)', seeds)
        conn.commit()
    conn.close()
_seed_data()

@app.post("/api/algorithm/upload")
async def algo_upload(): return {"status":"uploaded","id":"alg_"+str(int(time.time()))}

@app.get("/api/algorithm/validate/{algo_id}")
async def algo_validate(algo_id: str):
    """算法批量校验报告"""
    return {"algo_id":algo_id,"dataset":"历史数据 2026-07","命中率":94.2,"误报率":1.8,"precision":0.96,"recall":0.94,"f1":0.95,"report":{"correct":942,"false_positive":18,"false_negative":58,"total":1000}}

@app.get("/api/algorithm/ab-compare/{algo_id}")
async def algo_ab_compare(algo_id: str):
    """A/B版本对比报告"""
    return {"algo_id":algo_id,"version_a":{"name":"v2.1","命中率":89.1,"误报率":3.2},"version_b":{"name":"v2.2-new","命中率":94.2,"误报率":1.8},"improvement":"+5.1%命中率, -1.4%误报率","recommendation":"建议切换至 v2.2-new"}

@app.get("/api/excel/template/{template_type}")
async def excel_template(template_type: str):
    """Excel模板下载"""
    return {"template":f"{template_type}_template.xlsx","fields":["device_id","devaddr","name","devType","protocol","ip","port","station_id"],"download_url":f"/api/excel/download/{template_type}"}

@app.get("/api/data/lake/embed")
async def data_lake_embed():
    """数据湖门户嵌入"""
    return {"portal_url":"https://data.dqyt.com/embed","sso_url":"/api/auth/sso?redirect=data_lake","iframe_code":"<iframe src='/dgiot-lite/embed' width='100%' height='800'></iframe>","integration":"SSO + IFrame"}

@app.post("/api/reports/generate")
async def reports_generate(type: str = "日报"):
    """报表生成"""
    return {"type":type,"status":"generated","format":"HTML+JSON","generated_at":time.strftime("%Y-%m-%d %H:%M:%S"),"download_url":f"/api/reports/download/{type}"}

@app.get("/api/mqtt/inspect")
async def mqtt_inspect():
    """MQTT深度调试 — 超出报价的增值功能"""
    return {"broker":"11.66.12.131:1883","clients":6,"topics":["dgiot/proxy/commbridge","dgiot/proxy/opcda","dgiot/proxy/a11","dgiot/proxy/modbus","dgiot/proxy/iec104"],"messages":[{"topic":"dgiot/proxy/commbridge","payload":"oil_pressure=2.12MPa","qos":1,"time":"08:15:30.123"}],"tools":["Topic Scan","Message Trace","Payload Decode","QoS Stats","Latency Measure"]}

@app.get("/api/packet/decode/{protocol}")
async def packet_decode(protocol: str, hex: str = ""):
    """多协议报文解码 — 超出报价的增值功能"""
    samples = {"modbus":"01 03 02 3F 8B E9 D3 → Slave1 读保持寄存器 油压=1.09MPa","a11":"A1 10 81 00 00 00 00 38 → pSpace 标签查询响应","iec104":"68 0E 00 00 02 00 64 01 → 总召唤确认 遥测值=100","opcda":"05 00 0B 03 10 00 00 00 → OPC DA Bind响应"}
    return {"protocol":protocol,"hex":hex or list(samples.values())[0],"decoded":samples.get(protocol,list(samples.values())[0]),"supported":list(samples.keys())}

@app.get("/api/graphrag/query")
async def graphrag_query(q: str = ""):
    """知识图谱问答 — 超出报价的增值功能"""
    return {"question":q or "油压偏低如何处理?","answer":"基于知识图谱检索: 油压偏低(低于2.0MPa)常见原因: 1)泵效下降 2)地层供液不足 3)管线泄漏。建议: ①查看泵效诊断结果 ②对比邻井油压趋势 ③安排现场巡检确认管线状态。","sources":["油井故障知识库","历史告警关联规则","泵效诊断算法"],"confidence":0.87}

@app.get("/api/amis/page/{page_id}")
async def amis_page(page_id: str = "dashboard"):
    """低代码表单页面 — 超出报价的增值功能"""
    return {"page_id":page_id,"schema":{"type":"page","title":"自定义驾驶舱","body":[{"type":"grid","columns":[{"type":"chart","api":"/api/stats"},{"type":"table","api":"/api/devices"}]}]},"preview_url":f"/amis-test/#/page/{page_id}"}

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(); p.add_argument("--port", type=int, default=9876); args = p.parse_args()
    print(f"Mock API Server: http://localhost:{args.port}")
    uvicorn.run(app, host="0.0.0.0", port=args.port, log_level="warning")
