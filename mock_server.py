"""Mock API Server 鈥?瀹屾暣妯℃嫙鍚庣, 浠〃鐩樼洿鎺ュ彲鐢?""
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
            "createdAt":d.get("created_at",""),"alarm_type":d.get("alarm_type","鍛婅")}

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

# 鈺愨晲鈺愨晲鈺愨晲 Auth 鈺愨晲鈺愨晲鈺愨晲
@app.post("/api/auth/login")
async def login(body: dict):
    return {"token":"mock-jwt-token","username":"dgiot_dev","role":"admin","user":{"id":"dgiot_dev","username":"dgiot_dev","nick":"DG-IoT寮€鍙戣€?,"name":"DG-IoT寮€鍙戣€?,"email":"","phone":""}}

@app.get("/api/auth/me")
async def me(): return {"username":"dgiot_dev","role":"admin","nick":"DG-IoT寮€鍙戣€?}

@app.get("/api/auth/users")
async def users(): return [{"username":"dgiot_dev","role":"admin","name":"DG-IoT寮€鍙戣€?}]

# 鈺愨晲鈺愨晲鈺愨晲 Health 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/health")
async def health():
    return {"status":"ok","version":"4.3.7","uptime_seconds":int(time.time()-t0),"devices":{"total":566,"online":566},"collector":{"total_devices":566,"online_devices":566,"total_collects":472189,"success_rate":99.96}}

# Shadow state storage (mutable, survives request)
_shadow_store = {}

@app.get("/api/shadow/{device_id}")
async def device_shadow(device_id: str):
    """璁惧褰卞瓙 鈥?瀵规爣 dgaiot Shadow (desired/reported/version)"""
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
    """鏇存柊鏈熸湜鐘舵€?""
    import random
    stored = _shadow_store.get(device_id, {})
    desired = body.get("desired", {})
    stored["desired"] = desired
    stored["version"] = stored.get("version", 0) + 1
    _shadow_store[device_id] = stored
    return {"device_id": device_id, "desired": desired, "version": stored["version"], "status": "updated"}

@app.post("/api/shadow/{device_id}/sync")
async def sync_shadow(device_id: str):
    """鎺ㄩ€佹湡鏈涘埌璁惧 (妯℃嫙 MQTT publish)"""
    stored = _shadow_store.get(device_id, {})
    desired = stored.get("desired", {})
    return {"device_id": device_id, "desired": desired, "sync": "pushed", "topic": f"$dg/things/{device_id}/shadow/desired"}

# Device Commands
@app.post("/api/command/{device_id}")
async def device_command(device_id: str, body: dict):
    """Send command to device via MQTT"""
    cmd = body.get("command", "ping")
    params = body.get("params", {})
    return {"device_id": device_id, "command": cmd, "params": params,
            "status": "sent", "topic": f"$dg/things/{device_id}/command"}

@app.get("/api/command/history")
async def command_history(device_id: str = None):
    return {"commands": [
        {"id":1,"device":"DEVICE_D-001","cmd":"restart","status":"ok","time":"2026-08-12 10:00"},
        {"id":2,"device":"RTU-112","cmd":"set_interval","params":{"v":30},"status":"ok","time":"2026-08-12 09:55"},
    ], "total": 2}

@app.get("/api/phm/equipments")
async def phm_equipments():
    """棰勬祴鎬х淮鎶?鈥?璁惧鍋ュ悍鐘舵€?""
    import math; t = time.time()
    return {"equipments":[
        {"id":"PUMP_001","icon":"馃洟锔?,"name":"娉ㄦ按娉?1","model":"DFJ-250","healthScore":int(85+8*math.sin(t/300)),"level":"姝ｅ父" if math.sin(t/300)>-0.3 else "璀﹀憡","rulDays":int(180+60*math.sin(t/400)),
         "faults":[{"mode":"杞存壙纾ㄦ崯","probability":round(0.12+0.05*math.sin(t/200),2),"severity":"浣?,"action":"鍑嗗澶囦欢"},
                   {"mode":"姘旇殌","probability":round(0.05+0.03*math.sin(t/250),2),"severity":"涓?,"action":"妫€鏌ュ惛鍏ュ帇鍔?}]},
        {"id":"COMP_01","icon":"鈿欙笍","name":"鍘嬬缉鏈?1","model":"ZW-15/7","healthScore":int(72+10*math.sin(t/350)),"level":"璀﹀憡","rulDays":int(90+40*math.sin(t/380)),
         "faults":[{"mode":"杞存壙纾ㄦ崯","probability":0.25,"severity":"涓?,"action":"瀹夋帓鏇存崲"},{"mode":"娑︽粦澶辨晥","probability":0.15,"severity":"楂?,"action":"绔嬪嵆鏇存崲娑︽粦娌?}]},
        {"id":"INV_01","icon":"鈽€锔?,"name":"閫嗗彉鍣?1","model":"SUN2000-50KTL","healthScore":int(93+5*math.sin(t/500)),"level":"姝ｅ父","rulDays":int(1800+200*math.sin(t/600)),
         "faults":[{"mode":"鐢靛鑰佸寲","probability":0.03,"severity":"浣?,"action":"鈥?}]},
    ]}

@app.get("/api/stream/status")
async def stream_status():
    """娴佸紡璁＄畻寮曟搸鐘舵€?鈥?瀹炴椂澶勭悊缁熻 (鏁版嵁姣忕鑷, 妯℃嫙鐪熷疄娴佸鐞嗘晥鏋?"""
    import math
    t = time.time()
    # 鍩虹鍊?+ 鏃堕棿澧為噺 (姣忕澧炲姞绾?56鏉? 妯℃嫙QPS=156)
    base = 472189 + int((t - 1754730000) * 156)  # 1754730000 鈮?2026-08-09 epoch
    alarms_base = 0
    # 瀹炴椂鍙樺寲鐨?鏉℃暟鎹祦
    live_streams = [
        {"dtype":"oilwell","did":"DEVICE_D-000","point":"oil_pressure","val":round(2.1+0.3*math.sin(t/30)+random.random()*0.05,2),"unit":"MPa","status":"normal"},
        {"dtype":"oilwell","did":"DEVICE_D-001","point":"motor_current","val":round(45+8*math.sin(t/20)+random.random()*0.3,1),"unit":"A","status":"normal"},
        {"dtype":"compressor","did":"COMP-01","point":"vibration","val":round(2.5+1.2*math.sin(t/15)+random.random()*0.8,2),"unit":"mm/s","status":"alarm" if math.sin(t/15)>0.85 else "normal","alarm_msg":"鎸姩瓒呮爣" if math.sin(t/15)>0.85 else ""},
        {"dtype":"inverter","did":"INV-001","point":"pv_power","val":round(3480+400*math.sin(t/35)+random.random()*10,1),"unit":"W","status":"normal"},
        {"dtype":"inverter","did":"INV-002","point":"pv_voltage","val":round(230+5*math.sin(t/45)+random.random()*0.5,1),"unit":"V","status":"normal"},
        {"dtype":"pcs","did":"PCS-01","point":"soc","val":round(78+15*math.sin(t/60)+random.random()*2,1),"unit":"%","status":"normal"},
    ]
    algo_stats = [
        {"name":"闃堝€煎垽瀹?,"icon":"馃搹","active":True,"processed":base,"alarms":23+int(random.random()*3),"last":time.strftime("%H:%M:%S")},
        {"name":"绐佸彉妫€娴?,"icon":"鈿?,"active":True,"processed":base-333,"alarms":7+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"瓒嬪娍鍒ゅ畾","icon":"馃搱","active":True,"processed":base-1989,"alarms":3,"last":time.strftime("%H:%M:%S")},
        {"name":"娉㈠姩鎬ф娴?,"icon":"馃搳","active":True,"processed":base-2389,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"瓒婇檺棰戞","icon":"馃敘","active":True,"processed":base-5000,"alarms":1,"last":time.strftime("%H:%M:%S")},
        {"name":"婊戝姩骞冲潎","icon":"馃搲","active":True,"processed":base-3689,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"鍙樺寲鐜囨娴?,"icon":"鈴憋笍","active":True,"processed":base-4989,"alarms":5+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"宄板€兼娴?,"icon":"馃敽","active":True,"processed":base-7000,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"杩炵画寮傚父","icon":"馃敶","active":True,"processed":base-6289,"alarms":12+int(random.random()*3),"last":time.strftime("%H:%M:%S")},
        {"name":"鍩虹嚎鍋忕","icon":"馃搻","active":True,"processed":base-8000,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"鑼冨洿妫€鏌?,"icon":"鉁?,"active":True,"processed":base-7889,"alarms":0,"last":time.strftime("%H:%M:%S")},
        {"name":"绱Н璁℃暟","icon":"馃М","active":True,"processed":base-9000,"alarms":int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"鍙樺寲鏂瑰悜","icon":"馃Л","active":True,"processed":base-9089,"alarms":1,"last":time.strftime("%H:%M:%S")},
        {"name":"寮傚父璇勫垎","icon":"馃幆","active":True,"processed":base-10189,"alarms":8+int(random.random()*2),"last":time.strftime("%H:%M:%S")},
        {"name":"鑷绠楁硶","icon":"馃┖","active":True,"processed":base-10689,"alarms":0,"last":time.strftime("%H:%M:%S")},
    ]
    return {"algorithms":algo_stats,"scope_types":["oilwell","compressor","inverter","pcs"],"live_streams":live_streams,
            "qps":156,"total_processed":sum(a["processed"] for a in algo_stats),"total_alarms":sum(a["alarms"] for a in algo_stats)}

@app.get("/api/security/status")
async def security_status():
    """鍥藉瘑瀹夊叏妯″潡鐘舵€?鈥?瀵归綈鐢虫姤瑕佹眰 鈶ょ寰椾綇"""
    return {"sm2":True,"sm3":True,"sm4":True,"tls":"TLS 1.2","rbac":True,"audit_log":True,
        "device_keys":566,"encrypted_channels":21,"last_audit":time.strftime("%Y-%m-%d %H:%M:%S"),
        "roles":[{"role":"admin","users":2,"permissions":["鍏ㄩ儴"]},{"role":"operator","users":5,"permissions":["璁惧绠＄悊","鍛婅纭","鏁版嵁鏌ヨ"]},{"role":"viewer","users":12,"permissions":["鍙鏌ョ湅"]}],
        "audit_trail":[{"time":time.strftime("%H:%M:%S"),"user":"dgiot_dev","action":"鐧诲綍绯荤粺","result":"鎴愬姛"},
                       {"time":time.strftime("%H:%M:%S",time.localtime(time.time()-300)),"user":"operator","action":"纭鍛婅 a1","result":"鎴愬姛"},
                       {"time":time.strftime("%H:%M:%S",time.localtime(time.time()-1200)),"user":"admin","action":"淇敼瑙掕壊鏉冮檺","result":"鎴愬姛"}]}

@app.get("/api/stress/status")
async def stress_status():
    """鍏ㄩ摼璺帇娴嬬姸鎬?鈥?瀵归綈 鈶ヤ氦浠樹繚闅?""
    return {"status":"completed","scenario":"鍏ㄦ补鐢?6鍘偮?00+浣滀笟鍖郝?60涓?鐐逛綅路婊￠鎸佺画閲囬泦","duration_hours":360,"devices":566,"points":34226620,
        "qps_peak":156,"qps_avg":142,"success_rate":99.96,"latency_p99_ms":8.5,"data_loss":0,
        "results":[{"鍘?:"绗竴閲囨补鍘?,"浣滀笟鍖?:8,"璁惧":41250,"閫氳繃":True},
                   {"鍘?:"绗簩閲囨补鍘?,"浣滀笟鍖?:7,"璁惧":38700,"閫氳繃":True},
                   {"鍘?:"绗洓閲囨补鍘?,"浣滀笟鍖?:5,"璁惧":28500,"閫氳繃":True}]}

@app.get("/api/inject/status")
async def inject_status():
    """瑙勬ā鍖栫亴鏁伴獙璇?鈥?瀵归綈 鈶ヤ氦浠樹繚闅?""
    return {"status":"completed","total_points":1000000,"current_batch":1000000,"injection_rate":50000,"target_tdengine":"td_1",
        "batches":[{"batch":1,"points":250000,"status":"success"},{"batch":2,"points":250000,"status":"success"},
                   {"batch":3,"points":250000,"status":"success"},{"batch":4,"points":250000,"status":"success"}],
        "verify": {"td_count":1000000,"pg_count":566,"consistency":100}}

@app.get("/api/xinchuang/status")
async def xinchuang_status():
    """淇″垱鍏ㄦ爤閫傞厤鐘舵€?鈥?瀵归綈 鈶ょ寰椾綇"""
    return {"os":{"name":"楹掗簾V10","arch":"aarch64","kernel":"5.10","status":"宸查獙璇?},
        "cpu":[{"name":"椴查箯920","cores":64,"status":"宸查獙璇?},{"name":"椋炶吘S2500","cores":64,"status":"宸查獙璇?}],
        "db":[{"name":"杈炬ⅵDM8","compat":"PostgreSQL","status":"宸查獙璇?},{"name":"閲戜粨Kingbase","compat":"PostgreSQL","status":"宸查獙璇?}],
        "middleware":{"tongweb":"鍏煎","dongfangtong":"鍏煎"},"browser":{"濂囧畨淇?:"宸查獙璇?,"360瀹夊叏":"宸查獙璇?,"Edge":"宸查獙璇?},
        "certification":"淇″垱鐩綍閫傞厤涓?}

@app.get("/api/audit/export")
async def audit_export():
    """瀹¤鏃ュ織瀵煎嚭 鈥?瀵归綈 鈶ょ寰椾綇"""
    return {"format":"CSV","rows":3847,"from":"2026-07-01","to":"2026-08-10","download_url":"/api/audit/export.csv",
        "summary":{"logins":2156,"alarm_actions":892,"config_changes":156,"device_operations":643}}

@app.get("/api/deploy/check")
async def deploy_check():
    """閮ㄧ讲瀹屾暣鎬ф牎楠?鈥?瀵归綈 鈶ヤ氦浠樹繚闅?""
    return {"frontend":{"dist_mb":5.8,"pages":29,"status":"deployed"},"backend":{"api_count":61,"status":"running"},
        "storage":{"tdengine":"online","postgres":"online"},"nginx":{"5180":"active"},
        "overall":"鉁?鍏ㄦ爤閮ㄧ讲瀹屾暣 路 鍓嶇+鍚庣+瀛樺偍+浠ｇ悊 鍥涘眰灏辩华"}


@app.get("/api/gis/devices")
async def gis_devices():
    return {"devices":[{"id":"DEVICE_D-000","name":"Oil#000","lat":46.5872,"lng":124.8912,"status":"online"}]}

@app.get("/api/maintenance/status")
async def maintenance_status():
    """杩愮淮鐩戞帶 鈥?瀹炴椂鍙傛暟 + 鏈嶅姟鐘舵€?+ 鏁版嵁搴撶姸鎬?""
    import math; t = time.time()
    params = [
        {"device":"Modbus TCP 閫嗗彉鍣?,"point":"鏈夊姛鍔熺巼","value":round(3480+400*math.sin(t/35),1),"unit":"W","range":"0-5000","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 閫嗗彉鍣?,"point":"A鐩哥數鍘?,"value":round(230+5*math.sin(t/45),1),"unit":"V","range":"200-260","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 閫嗗彉鍣?,"point":"A鐩哥數娴?,"value":round(15+3*math.sin(t/20),1),"unit":"A","range":"0-20","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 鍌ㄨ兘","point":"SOC","value":round(78+15*math.sin(t/60),1),"unit":"%","range":"10-90","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"Modbus TCP 鍏呯數妗?,"point":"鍏呯數鍔熺巼","value":round(60+20*math.sin(t/50),1),"unit":"kW","range":"0-120","status":"normal","time":time.strftime("%H:%M:%S")},
        {"device":"IEC 104","point":"閬ユ祴鐢靛帇","value":round(380+10*math.sin(t/30),1),"unit":"V","range":"360-400","status":"normal","time":time.strftime("%H:%M:%S")},
    ]
    services = [
        {"name":"Modbus TCP 閫嗗彉鍣?,"host":"127.0.0.1","port":502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus TCP 鍌ㄨ兘","host":"127.0.0.1","port":1502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus TCP 鍏呯數妗?,"host":"127.0.0.1","port":2502,"status":"online","protocol":"Modbus TCP"},
        {"name":"Modbus 鐢佃〃","host":"127.0.0.1","port":503,"status":"online","protocol":"Modbus RTU"},
        {"name":"IEC 104","host":"127.0.0.1","port":2404,"status":"online","protocol":"IEC 104"},
        {"name":"OPC UA","host":"127.0.0.1","port":4840,"status":"online","protocol":"OPC UA"},
        {"name":"OPC DA","host":"127.0.0.1","port":9090,"status":"online","protocol":"OPC DA"},
    ]
    return {"params":params,"services":services,
        "sqlite":{"status":"connected","records":472189,"path":"data/telemetry.db"},
        "postgres":{"status":"connected","host":"127.0.0.1:7432"},
        "tdengine":{"status":"connected","host":"192.168.10.167:6041","points":34226620},
        "stats":{"online_devices":566,"collects":472189,"success_rate":99.96,"alarms_active":3}}

@app.get("/api/protocol/status")
async def protocol_status():
    return {"adapters":[
        {"name":"A11","host":"192.168.10.130","devices":1032,"tested":True},
        {"name":"Modbus TCP","host":"11.249.34.1","devices":76,"tested":True},
        {"name":"OPC DA","host":"192.168.10.23","devices":5,"tested":True},
        {"name":"OPC UA","host":"172.26.6.3","tested":True},
        {"name":"IEC104","host":"11.250.1.1","tested":True},
        {"name":"MQTT","host":"192.168.10.131","tested":True}],"total":10,"all_tested":True}

@app.get("/api/archive/log")

@app.get("/api/scene/progress")
async def scene_progress():
    """涓夐樁娈垫笎杩涙帴鍏ヨ繘搴?鈥?鍦烘櫙閫傞厤"""
    return {"phases":[
        {"phase":1,"name":"瑙傚療鏈?,"status":"completed","浣滀笟鍖?:15,"description":"闈欐€両P缁堢浣滀笟鍖郝疯竟缂樹唬鐞嗕笂绾柯峰鎴风涓诲姩閲囬泦路椹鹃┒鑸遍洀褰?}, 
        {"phase":2,"name":"妗ユ帴澶嶅埗鏈?,"status":"in_progress","浣滀笟鍖?:8,"description":"鍔ㄦ€両P缁堢浣滀笟鍖郝锋ˉ鎺ョ粍浠堕儴缃猜锋姠鍗犲師鍦板潃绔彛澶嶅埗杞彂路A11鍘熶笟鍔′笉鍙楀奖鍝?}, 
        {"phase":3,"name":"绋冲畾骞惰鏈?,"status":"pending","浣滀笟鍖?:0,"description":"鍏ㄤ綔涓氬尯骞惰瑕嗙洊路璋冮绛栫暐閫愬尯鐢熸晥路瀹氬埗绠楁硶娉ㄥ唽路椹鹃┒鑸卞叏閲忔暟鎹?}],
        "total_zones":100,"completed":23}

@app.get("/api/scene/catchup")
async def scene_catchup():
    """鏂綉缂撳瓨琛ヤ紶鐘舵€?鈥?鍦烘櫙閫傞厤"""
    return {"offline_devices":3,"total_pending":12450,"琛ヤ紶杩涘害_pct":87.5,
        "devices":[{"id":"DEVICE_D-050","offline_since":"2026-08-11 06:30","pending":4200,"琛ヤ紶杩涘害":92.3,"棰勮瀹屾垚":"12:45"}, 
                   {"id":"DEVICE_D-120","offline_since":"2026-08-11 08:15","pending":6800,"琛ヤ紶杩涘害":84.1,"棰勮瀹屾垚":"13:20"}],
        "status":"琛ヤ紶涓?}

@app.get("/api/scene/catchup/detail")
async def scene_catchup_detail():
    """鏂綉琛ヤ紶璇︾粏璁板綍 鈥?姣忔潯璁惧鐨勮ˉ浼犵姸鎬?""
    return {"devices":[
        {"id":"DEVICE_D-050","zone":"绗洓浣滀笟鍖?,"offline_start":"08-11 06:30","offline_duration_min":680,"pending":4200,"琛ヤ紶杩涘害":92.3,"speed":"156鏉?min","棰勮瀹屾垚":"12:45","status":"琛ヤ紶涓?},
        {"id":"DEVICE_D-120","zone":"绗洓浣滀笟鍖?,"offline_start":"08-11 08:15","offline_duration_min":575,"pending":6800,"琛ヤ紶杩涘害":84.1,"speed":"142鏉?min","棰勮瀹屾垚":"13:20","status":"琛ヤ紶涓?},
        {"id":"DEVICE_D-200","zone":"绗笁浣滀笟鍖?,"offline_start":"08-10 22:00","offline_duration_min":1190,"pending":15600,"琛ヤ紶杩涘害":56.8,"speed":"98鏉?min","棰勮瀹屾垚":"15:30","status":"琛ヤ紶涓?},
    ],"history":[{"date":"08-10","devices":5,"total_pending":28400,"琛ヤ紶瀹屾垚":28400,"duration_min":180},{"date":"08-09","devices":2,"total_pending":8500,"琛ヤ紶瀹屾垚":8500,"duration_min":55}]}

@app.get("/api/scene/frequency/config")
async def scene_freq_config():
    """璋冮绛栫暐璇︾粏閰嶇疆"""
    return {"strategies":[
        {"zone":"绗洓浣滀笟鍖?,"current_freq":5,"status":"楂橀","trigger_寮辩綉":{"enabled":True,"rtt_threshold_ms":200,"闄嶉姝ラ暱":2,"鏈€浣庨鐜?:30},"trigger_浣庡嘲":{"enabled":True,"鏃舵":"22:00-06:00","棰戠巼":30},"trigger_寮傚父":{"enabled":True,"sensor":"oil_pressure","闃堝€?:0.5,"鍔犲瘑棰戠巼":1}},
        {"zone":"绗笁浣滀笟鍖?,"current_freq":15,"status":"涓","trigger_寮辩綉":{"enabled":True,"rtt_threshold_ms":300,"闄嶉姝ラ暱":5,"鏈€浣庨鐜?:60}},
        {"zone":"绗簩浣滀笟鍖?,"current_freq":60,"status":"浣庨","trigger_浣庡嘲":{"enabled":True,"鏃舵":"00:00-05:00","棰戠巼":120}},
    ]}

@app.get("/api/data/export/batch")
async def batch_export():
    """鎵归噺鏁版嵁瀵煎嚭浠诲姟"""
    return {"tasks":[
        {"id":"exp_001","format":"Excel","devices":156,"rows":15000,"size_mb":2.3,"status":"completed","created":"08-11 10:00"},
        {"id":"exp_002","format":"CSV","devices":500,"rows":500000,"size_mb":45.2,"status":"processing","progress":67,"created":"08-11 11:30"},
    ]}

@app.get("/api/scene/frequency")
async def scene_frequency():
    """鏅鸿兘鍔ㄦ€佽皟棰?鈥?鍦烘櫙閫傞厤"""
    return {"current_mode":"normal","寮辩綉闄嶉瑙﹀彂":False,"浣庡嘲闄嶉":True,"寮傚父鍔犲瘑":False,
        "绛栫暐":[{"浣滀笟鍖?:"绗洓浣滀笟鍖?,"棰戠巼":5,"鍒嗙骇":"楂橀","璁惧鏁?:191,"鐘舵€?:"鍏抽敭璁惧"}, 
                {"浣滀笟鍖?:"绗笁浣滀笟鍖?,"棰戠巼":15,"鍒嗙骇":"涓","璁惧鏁?:76,"鐘舵€?:"鏅€氳澶?}, 
                {"浣滀笟鍖?:"绗簩浣滀笟鍖?,"棰戠巼":60,"鍒嗙骇":"浣庨","璁惧鏁?:45,"鐘舵€?:"杈呭姪璁惧"}]}

@app.get("/api/scene/zones")
async def scene_zones():
    """浣滀笟鍖虹嫭绔嬮儴缃茬姸鎬?鈥?鍦烘櫙閫傞厤"""
    return {"zones":[{"id":"zone_04","name":"绗洓浣滀笟鍖?,"agent_status":"online","涓灑杩炴帴":"宸叉敞鍐?,"绛栫暐妯℃澘":"楂橀閲囬泦妯℃澘","閲囬泦棰戠巼":5,"璁惧鏁?:191}, 
                     {"id":"zone_03","name":"绗笁浣滀笟鍖?,"agent_status":"online","涓灑杩炴帴":"宸叉敞鍐?,"绛栫暐妯℃澘":"涓閲囬泦妯℃澘","閲囬泦棰戠巼":15,"璁惧鏁?:76}],
            "妯℃澘":[{"name":"楂橀閲囬泦妯℃澘","棰戠巼":5,"閫傜敤":"鍏抽敭璁惧瀵嗛泦浣滀笟鍖?,"鐘舵€?:"宸茬敓鏁?}, 
                    {"name":"涓閲囬泦妯℃澘","棰戠巼":30,"閫傜敤":"鏅€氳澶囦綔涓氬尯","鐘舵€?:"宸茬敓鏁?}]}

@app.get("/api/data/replay/{device_id}")
async def data_replay(device_id: str, start: str = "", end: str = ""):
    """鍘嗗彶鏁版嵁鍥炴斁 鈥?鏁版嵁瀛樺偍"""
    import math; t = time.time()
    points = [{"ts":int((t-i*60)*1000),"value":round(2.1+0.3*math.sin((t-i*60)/30)+random.random()*0.1,2)} for i in range(200)]
    return {"device_id":device_id,"points":points,"total":len(points)}

@app.get("/api/algorithm/market")
async def algorithm_market():
    """绠楁硶甯傚満 鈥?璺ㄤ綔涓氬尯鍏变韩"""
    return {"algorithms":[
        {"id":"alg_001","name":"娉垫晥璇婃柇","閫傜敤":"鎶芥补鏈轰簳","鎻愪氦":"绗洓浣滀笟鍖?,"瀹℃牳":"宸查€氳繃","鏁堟灉":92.5,"涓嬭浇":15,"rating":4.5},
        {"id":"alg_002","name":"鍔ㄦ恫闈㈣绠?,"閫傜敤":"鎶芥补鏈轰簳","鎻愪氦":"绗笁浣滀笟鍖?,"瀹℃牳":"宸查€氳繃","鏁堟灉":89.1,"涓嬭浇":8,"rating":4.2},
        {"id":"alg_003","name":"鍚按鐜囪秼鍔?,"閫傜敤":"鐢垫车浜?,"鎻愪氦":"绗簩浣滀笟鍖?,"瀹℃牳":"瀹℃牳涓?,"鏁堟灉":0,"涓嬭浇":0,"rating":0},
    ],"market_stats":{"total":3,"approved":2,"pending":1}}

@app.get("/api/data/export")
async def data_export(format: str = "csv", device_id: str = ""):
    """鏁版嵁瀵煎嚭 鈥?CSV/JSON/Excel"""
    return {"format":format,"device_id":device_id,"status":"ready","size_mb":2.3,"rows":15000,"download_url":f"/api/data/export/download?format={format}"}

@app.get("/api/data/api-docs")
async def api_docs():
    """REST API 鏂囨。 鈥?鏁版嵁瀛樺偍"""
    return {"swagger_url":"/docs","openapi_url":"/openapi.json","endpoints":76,"categories":["auth","health","devices","alarms","channels","stream","storage","security","scene"]}

async def archive_log():
    return {"last_archive":"2026-08-11 02:00:00","status":"completed","moved_hot_to_warm":"3.2GB","compressed_ratio":8.3}

@app.get("/api/data/lifecycle")
async def data_lifecycle():
    """鏁版嵁鐢熷懡鍛ㄦ湡绠＄悊 鈥?瀵归綈鐢虫姤瑕佹眰 鈶″瓨寰椾綇"""
    return {"policies":[
        {"tier":"hot","engine":"TDengine","retention":"30澶?,"size_gb":48.2,"points":34226620,"status":"active","action":"30澶╁悗鑷姩褰掓。鍒版俯鏁版嵁"},
        {"tier":"warm","engine":"PostgreSQL","retention":"1骞?,"size_gb":12.5,"tables":48,"status":"active","action":"1骞村悗鍘嬬缉褰掓。鍒板喎瀛樺偍"},
        {"tier":"cold","engine":"SQLite","retention":"姘镐箙","size_mb":256,"location":"./data/archive","status":"active","action":"浠呯敤浜庤竟缂橀檷绾у厹搴?},
    ],
        "auto_archival": True,"last_archival": time.strftime("%Y-%m-%d %H:%M:%S"),
        "compression_ratio": 8.3,"total_raw_gb": 508,"total_stored_gb": 61}

@app.post("/api/security/keygen/{device_id}")
async def security_keygen(device_id: str):
    """涓鸿澶囩敓鎴?SM4 瀵嗛挜"""
    import hashlib, os
    key = hashlib.sha256(f"dgiot_sm4_{device_id}_{os.urandom(4).hex()}".encode()).digest()[:16].hex()
    return {"device_id": device_id, "algorithm": "SM4", "key": key[:8]+"..."+key[-8:], "length": 128, "created": time.strftime("%Y-%m-%d %H:%M:%S")}

@app.get("/api/health/mqtt")
async def health_mqtt():
    return {"ok":True,"ms":2,"status":"宸茶繛鎺?}

# 鈺愨晲鈺愨晲鈺愨晲 Alarms 鈥?SQLite backed 鈺愨晲鈺愨晲鈺愨晲
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

# 鈺愨晲鈺愨晲鈺愨晲 Devices 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/devices")
async def devices(page_size:int=200):
    devs=[{"device_id":f"DEVICE_D-{i:03d}","device_name":f"娌逛簳DEVICE_D-{i}","devType":"oil_well","status":"online","protocol":"modbus_tcp","station_id":"DEVICE_D","manufacturer":"澶у簡娌圭敯"} for i in range(1,567)]
    return {"total":566,"page":1,"page_size":page_size,"devices":devs[:page_size]}

@app.get("/api/devices/{device_id}")
async def device_detail(device_id:str):
    return {"device_id":device_id,"device_name":f"娌逛簳{device_id}","status":"online","protocol":"modbus_tcp"}

# 鈺愨晲鈺愨晲鈺愨晲 Stats 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/edge/topology")
async def edge_topology():
    """杈圭紭鎷撴墤 鈥?浠ｇ悊鈫掍腑鏋?鏁版嵁娴佸叏閾捐矾"""
    return {
        "proxy": {
            "hostname": "IO-SRV-130",
            "ip": "192.168.10.130",
            "os": "Windows Server 2016",
            "cpu": 8, "mem_gb": 32,
            "status": "online",
            "protocols": [
                {"name": "LegacyComm", "port": 53001, "devices": 191, "points": 4567, "mqtt_topic": "dgiot/proxy/commbridge"},
                {"name": "OPC DA", "port": 135, "devices": 5, "points": 26081, "mqtt_topic": "dgiot/proxy/opcda"},
                {"name": "A11", "port": 8889, "devices": 1032, "points": 16663, "mqtt_topic": "dgiot/proxy/a11"},
                {"name": "Modbus TCP", "port": 502, "devices": 76, "points": 2100, "mqtt_topic": "dgiot/proxy/modbus"},
                {"name": "IEC104", "port": 2404, "devices": 0, "points": 0, "mqtt_topic": "dgiot/proxy/iec104"},
            ],
            "mqtt_bridge": {"status": "connected", "broker": "192.168.10.131:1883", "topics": 5, "pushed": 49411, "failed": 89, "rate": 156}
        },
        "hub": {
            "hostname": "edge-dmz",
            "ip": "192.168.10.131",
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
            "stream_engine": {"algorithms": 15, "active": 12, "qps": 156, "top5": ["宸ュ喌璇婃柇", "浜ф恫閲?, "鍚按鐜?, "娉垫晥", "骞宠　搴?]},
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
                {"from": "IO-SRV-130:53001", "to": "Kylin:1883", "protocol": "LegacyComm鈫扢QTT", "packets": 49411, "mb": 23.5},
                {"from": "IO-SRV-130:135", "to": "Kylin:1883", "protocol": "OPC DA鈫扢QTT", "packets": 26081, "mb": 12.1},
                {"from": "IO-SRV-130:8889", "to": "Kylin:1883", "protocol": "A11鈫扢QTT", "packets": 16663, "mb": 8.0},
            ]
        }
    }

@app.get("/api/storage/status")
async def storage_status():
    """娣峰悎瀛樺偍寮曟搸鐘舵€?鈥?TDengine(鐑?+PG(娓?+SQLite(鍐?"""
    return {
        "tdengine": {"status":"online","host":"192.168.10.167","port":6041,"points":34226620,"size_gb":48.2,"retention_days":30,"tier":"hot","latency_ms":3},
        "postgresql": {"status":"online","host":"127.0.0.1","port":7432,"tables":48,"size_gb":12.5,"tier":"warm","latency_ms":2},
        "sqlite": {"status":"online","path":"./data/parse.db","size_mb":256,"tier":"cold","writes":472189,"purpose":"edge_fallback"},
    }

@app.get("/api/mqtt/status")
async def mqtt_status():
    """MQTT 杈逛簯鍚屾鐘舵€?""
    return {
        "broker": {"host":"192.168.10.131","port":1883,"status":"online","connections":6,"messages_per_s":156,"uptime_days":15},
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
    """FDE Step 1: 鍒涘缓浜у搧/鐗╂ā鍨?""
    return {"status":"created","devType":body.get("devType","inverter"),"productId":f"prod_{body.get('devType','inverter')}_{int(time.time())}"}

@app.post("/api/fde/wizard/compile")
async def fde_wizard_compile(body: dict):
    """FDE Step 2: 鐗╂ā鍨?鈫?鏈綋鑷姩缂栬瘧"""
    devType = body.get("devType", "inverter")
    models = {
        "inverter": {"product_name":"鍏変紡閫嗗彉鍣?,"points":{
            "pv_power":{"name":"鏈夊姛鍔熺巼","unit":"W","type":"float32","register_addr":"40001","alarm_high":4500,"alarm_low":100},
            "pv_voltage_a":{"name":"A鐩哥數鍘?,"unit":"V","type":"float32","register_addr":"40003","alarm_high":260,"alarm_low":200},
            "pv_current_a":{"name":"A鐩哥數娴?,"unit":"A","type":"float32","register_addr":"40005","alarm_high":20,"alarm_low":1}}},
        "meter": {"product_name":"鏅鸿兘鐢佃〃","points":{
            "energy_total":{"name":"鎬荤數閲?,"unit":"kWh","type":"float32","register_addr":"40001"},
            "power_factor":{"name":"鍔熺巼鍥犳暟","unit":"","type":"float32","register_addr":"40003"}}},
        "pump": {"product_name":"鎶芥补鏈?,"points":{
            "oil_pressure":{"name":"娌瑰帇","unit":"MPa","type":"float32","register_addr":"40300","alarm_high":4.0,"alarm_low":0.5},
            "motor_current":{"name":"鐢垫満鐢垫祦","unit":"A","type":"float32","register_addr":"40350","alarm_high":85,"alarm_low":15},
            "temperature":{"name":"娓╁害","unit":"鈩?,"type":"float32","register_addr":"40430","alarm_high":95,"alarm_low":25}},
        },
    }
    model = models.get(devType, models["inverter"])
    points = model["points"]
    site_id = body.get("site_id", "site_daqing")
    gw_id = body.get("gateway_id", "gw_edge_01")
    ch_id = body.get("channel_id", f"ch_{devType}_01")
    dev_id = f"dev_{devType}_001"

    # 鑷姩鐢熸垚绾︽潫
    constraints = []
    for pid, pt in points.items():
        if pt.get("alarm_high") or pt.get("alarm_low"):
            rules = []
            if pt.get("alarm_high"): rules.append(f"{pt['name']}>{pt['alarm_high']}")
            if pt.get("alarm_low"): rules.append(f"{pt['name']}<{pt['alarm_low']}")
            constraints.append({"id":f"c_{devType}_{pid}","name":f"{pt['name']}闃堝€煎憡璀?,"rule":" OR ".join(rules)+" 鈫?alarm","entity":f"pt_{devType}_{pid}","severity":"warning","source":"鐗╂ā鍨嬭嚜鍔ㄧ敓鎴?,"action":f"瑙﹀彂{pt['name']}鍛婅閫氱煡"})

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
    """FDE Step 3: 鍗忚鎵弿 鈥?鐢?pymodbus 鐪熷疄杩炴帴璇诲彇"""
    host = body.get("host","127.0.0.1"); port = int(body.get("port",502))
    s0 = int(body.get("start_addr",1)); e0 = int(body.get("end_addr",10))
    slaves = []
    try:
        from pymodbus.client import ModbusTcpClient
        client = ModbusTcpClient(host, port, timeout=2)
        if client.connect():
            for sid in range(s0, e0+1):
                try:
                    rr = client.read_holding_registers(0, 3, slave=sid)  # 璇诲墠3涓瘎瀛樺櫒
                    if not rr.isError():
                        regs = [{"address":i,"value":rr.registers[i]} for i in range(min(3,len(rr.registers)))]
                        slaves.append({"slave_id":sid,"active":True,"registers":regs})
                    else:
                        slaves.append({"slave_id":sid,"active":False,"registers":[]})
                except:
                    slaves.append({"slave_id":sid,"active":False,"registers":[]})
            client.close()
        else:
            # 鍥為€€鍒版ā鎷熸暟鎹?            raise Exception("not reachable")
    except:
        for sid in range(s0, e0+1):
            active = sid in {1,3,5,8,10}
            regs = [{"address":40001+sid*10+i,"value":220+sid*3+i*7} for i in range(3)] if active else []
            slaves.append({"slave_id":sid,"active":active,"registers":regs})
    active_n = sum(1 for s in slaves if s["active"])
    return {"summary":f"{host}:{port} 鎵弿 {s0}-{e0} 瀹屾垚{' (鐪熸暟鎹?' if active_n>0 and slaves[0].get('registers') and slaves[0]['registers'][0].get('address')==0 else ' (妯℃嫙)'} 路 娲昏穬 {active_n}/{len(slaves)}",
            "slaves_found":active_n,"points_found":sum(len(s["registers"]) for s in slaves if s["active"]),
            "slaves":slaves}

@app.post("/api/fde/wizard/dashboard")
async def fde_wizard_dashboard(body: dict):
    """FDE Step 5: 椹鹃┒鑸变竴閿敓鎴?""
    devType = body.get("devType","inverter")
    import random, math
    t = time.time()
    points_data = [{"name":"鏈夊姛鍔熺巼","value":round(3480+400*math.sin(t/30),1),"unit":"W","trend":[round(3400+200*math.sin((t-i*60)/30),1) for i in range(30)]},
                   {"name":"A鐩哥數鍘?,"value":round(230+5*math.sin(t/45),1),"unit":"V","trend":[round(228+4*math.sin((t-i*60)/45),1) for i in range(30)]},
                   {"name":"A鐩哥數娴?,"value":round(15+3*math.sin(t/20),1),"unit":"A","trend":[round(14+2*math.sin((t-i*60)/20),1) for i in range(30)]}]
    alarms_data = [{"name":"鍔熺巼杩囬珮","value":f">{5000}W","status":"normal"},
                   {"name":"鐢靛帇寮傚父","value":f"{'>'if random.random()<0.3 else '<'}{260}V","status":"warning" if random.random()<0.3 else "normal"}]
    return {"status":"ready",
        "dashboard":{
            "cards":[{"title":"璁惧鏁?,"value":1,"icon":"鈴憋笍"},{"title":"閲囬泦鐐?,"value":3,"icon":"馃搳"},{"title":"鍛婅","value":0,"icon":"鈿狅笍"},{"title":"鍦ㄧ嚎鐜?,"value":"100%","icon":"馃煝"}],
            "trend_chart":{"points":points_data},
            "alarm_panel":{"points":alarms_data}
        }}

@app.post("/api/fde/wizard/agent")
async def fde_wizard_agent(body: dict):
    """FDE Step 6: AI Agent 涓€閿敓鎴愬叏閮ㄩ厤缃?""
    desc = body.get("description","")
    # 鏍规嵁鎻忚堪鎺ㄦ柇璁惧绫诲瀷
    devType = "inverter"
    product_name = "鍏変紡閫嗗彉鍣?
    if "鍌ㄨ兘" in desc or "PCS" in desc: devType = "pcs"; product_name = "鍌ㄨ兘PCS"
    elif "鍏呯數" in desc: devType = "charger"; product_name = "鍏呯數妗?
    elif "绠卞彉" in desc or "鍙樺帇鍣? in desc: devType = "transformer"; product_name = "绠卞紡鍙樺帇鍣?
    elif "姘存车" in desc: devType = "pump"; product_name = "鎶芥补鏈?
    points = 3 if devType == "inverter" else 4
    rules = [{"id":"r1","name":"鍔熺巼杩囬珮","condition":"power>5000","action":"鍛婅","severity":"warning"},
             {"id":"r2","name":"娓╁害杩囬珮","condition":"temperature>80","action":"鍛婅","severity":"critical"}]
    return {"status":"completed",
        "inferred":{"product_name":product_name,"device_type":devType,"points":points},
        "step1_product":{"point_count":points},
        "step2_ontology":{"devices":1,"points":points,"constraints":len(rules)},
        "step3_scan_hint":"127.0.0.1:502 鎵弿瀹屾垚 娲昏穬3浠庣珯",
        "step5_rules":rules,
        "step6_deploy":"椹鹃┒鑸卞凡鐢熸垚 路 鍏ㄩ儴6姝ラ厤缃畬鎴?}

@app.get("/api/scene/list")
async def scene_list():
    """閲囬泦鍦烘櫙绠＄悊 鈥?鍦烘櫙缂栨帓/瑙勫垯寮曟搸/鎵归噺涓嬪彂"""
    return {"scenes":[
        {"id":"s1","name":"绗洓浣滀笟鍖哄叏閲忛噰闆?,"devices":191,"protocols":["modbus_tcp","a11"],"interval":5,"status":"running","lastDeploy":"2026-08-09 08:00"},
        {"id":"s2","name":"绗笁浣滀笟鍖?Modbus 瀹氭椂","devices":76,"protocols":["modbus_tcp"],"interval":30,"status":"running","lastDeploy":"2026-08-08 18:00"},
        {"id":"s3","name":"DCS 鑱斿悎绔?OPC DA","devices":5,"protocols":["opcda"],"interval":1,"status":"running","lastDeploy":"2026-08-09 06:30"},
        {"id":"s4","name":"A11 鍏煎閲囬泦 (鍙)","devices":1032,"protocols":["a11"],"interval":10,"status":"paused","lastDeploy":"2026-08-07 12:00"},
        {"id":"s5","name":"IEC104 鐢靛姏瑙勭害","devices":0,"protocols":["iec104"],"interval":5,"status":"pending","lastDeploy":""},
    ]}

@app.get("/api/stats")
async def stats():
    return {"total_devices":566,"online_devices":566,"total_collects":472189,"total_success":472000,"total_fail":189,"success_rate":99.96,"pipeline_running":True,"active_alarms":3,"uptime_seconds":int(time.time()-t0),"telemetry_rows":34226620}

# 鈺愨晲鈺愨晲鈺愨晲 Rules 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/rules")
async def rules(): return {"rules":[{"id":"r1","name":"鐢垫祦瓒婇檺","enabled":1,"severity":"danger"}]}

# 鈺愨晲鈺愨晲鈺愨晲 Device Detail 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/devices/{device_id}/points")
async def device_detail_points(device_id:str):
    return {"points":[{"point_id":"oil_pressure","point_name":"娌瑰帇","value":2.35,"unit":"MPa","protocol_addr":"0"},{"point_id":"temperature","point_name":"娓╁害","value":45.6,"unit":"C","protocol_addr":"1"},{"point_id":"motor_current","point_name":"鐢垫満鐢垫祦","value":15.2,"unit":"A","protocol_addr":"2"}]}

@app.get("/api/telemetry/{device_id}/latest")
async def device_latest(device_id:str):
    return {"data":[{"ts":int(time.time()*1000),"oil_pressure":2.35,"temperature":45.6,"motor_current":15.2,"quality":192}]}

# 鈺愨晲鈺愨晲鈺愨晲 Telemetry 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/telemetry/{device_id}/{point_id}")
async def telemetry(device_id:str,point_id:str,limit:int=100):
    data=[{"ts":int(time.time()*1000)-(100-i)*60000,"value":round(2.5+random.uniform(-1,1.5),2),"quality":192} for i in range(limit)]
    return {"device_id":device_id,"point_id":point_id,"data":data,"count":len(data)}

@app.post("/api/telemetry")
async def post_telemetry(body:dict): return {"status":"ok"}

# 鈺愨晲鈺愨晲鈺愨晲 Channels 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/classes/Channel")
async def channels(limit:int=20):
    chs=[{"objectId":"ch1","name":"LegacyComm:53001","cType":"modbus_tcp","status":"online","host":"11.248.195.1","port":53001},
         {"objectId":"ch2","name":"OPC DA:135","cType":"opcda","status":"online","host":"192.168.10.23","port":135},
         {"objectId":"ch3","name":"A11:8889","cType":"a11","status":"online","host":"192.168.10.130","port":8889},
         {"objectId":"ch4","name":"dgiot:53002","cType":"modbus_tcp","status":"online","host":"192.168.10.131","port":53002}]
    return {"results":chs,"total":len(chs)}

# 鈺愨晲鈺愨晲鈺愨晲 Parse Classes 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/classes/Device")
async def parse_devices(limit:int=200,skip:int=0,page:int=1,page_size:int=200,device_type:str=None,search:str=None):
    # Support both page/page_size and limit/skip patterns
    if page > 1 or page_size != 200: limit, skip = page_size, (page-1)*page_size
    types=[('oil_well','鎶芥补鏈轰簳','DEVICE_D','modbus_tcp'),('oil_well','铻烘潌娉典簳','DEVICE_D','modbus_tcp'),('oil_well','鐢垫车浜?,'DEVICE_D','modbus_tcp'),
           ('water_injection','娉ㄦ按浜?,'DEVICE_D','modbus_tcp'),('rtu','RTU缁堢','DEVICE_D','modbus_tcp'),('dcs','DCS鎺у埗绔?,'DEVICE_D','opcda'),
           ('relay','DSL-31A鏂矾鍣?,'DEVICE_D','modbus_tcp'),('relay','DST-31A鍙樺帇鍣ㄥ樊鍔?,'DEVICE_D','modbus_tcp'),('compressor','鍘嬬缉鏈?,'DEVICE_D','a11'),
           ('pipeline','闆嗚緭绠＄嚎','DEVICE_D','modbus_tcp'),('gas_injection','娉ㄦ皵绔?,'DEVICE_D','iec104'),('dewater','鑴辨按绔?,'DEVICE_D','opcda')]
    results=[]
    for i in range(skip,min(skip+limit,566)):
        dt,name,station,proto=types[i%len(types)]
        results.append({"objectId":f"dev_{i:04d}","devaddr":f"DEVICE_D-{i:03d}","device_id":f"DEVICE_D-{i:03d}","name":f"{name}-{i:03d}","device_name":f"{name}-{i:03d}",
            "devType":dt,"device_type":dt,"product":{"objectId":"prod_oilwell"},"status":"online" if i<540 else "offline",
            "ip":f"11.248.{195+i//256}.{i%256}","station_id":station,"protocol":proto,"manufacturer":"澶у簡娌圭敯","model":name})
    return {"results":results,"total":566,"count":566}

@app.get("/api/classes/Device/{device_id}")
async def parse_device_one(device_id:str):
    return {"objectId":device_id,"devaddr":device_id,"device_id":device_id,"name":f"娌逛簳 {device_id}","device_name":f"娌逛簳 {device_id}","devType":"oil_well","device_type":"oil_well","status":"online","protocol":"modbus_tcp","station_id":"DEVICE_D","manufacturer":"澶у簡娌圭敯","model":"鎶芥补鏈轰簳","last_online_at":"2026-08-07T14:00:00"}

@app.get("/api/classes/Product")
async def parse_products(): return {"results":[
    {"objectId":"prod_oil_well_pump","name":"鎶芥补鏈轰簳","devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"娌瑰帇","dataType":"float","unit":"MPa","range":"0.5-4.5","alarm_high":4.0,"alarm_low":0.5},{"id":"temperature","name":"娓╁害","dataType":"float","unit":"鈩?,"range":"25-95","alarm_high":90},{"id":"motor_current","name":"鐢垫満鐢垫祦","dataType":"float","unit":"A","range":"15-85","alarm_high":80,"alarm_low":10}],
    "events":[{"id":"pump_stop","name":"鍋滀簳鍛婅","type":"alarm","desc":"鎶芥补鏈烘剰澶栧仠鏈烘椂瑙﹀彂"},{"id":"overload","name":"杩囪浇鍛婅","type":"alarm","desc":"鐢垫満鐢垫祦瓒呰繃棰濆畾鍊?30%鏃惰Е鍙?},{"id":"leak","name":"娉勬紡鍛婅","type":"fault","desc":"绠￠亾鍘嬪姏楠ら檷瓒呰繃闃堝€兼椂瑙﹀彂"}],
    "services":[{"id":"set_frequency","name":"璁惧畾閲囬泦棰戠巼","input":{"frequency":"int","unit":"s"},"output":{"result":"bool"}},{"id":"set_threshold","name":"璁惧畾鍛婅闃堝€?,"input":{"point_id":"string","high":"float","low":"float"},"output":{"result":"bool"}}]}},
    {"objectId":"prod_oil_well_screw","name":"铻烘潌娉典簳","devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"娌瑰帇","dataType":"float","unit":"MPa"},{"id":"rotor_speed","name":"杞€?,"dataType":"float","unit":"rpm"}]}},
    {"objectId":"prod_oil_well_esp","name":"鐢垫车浜?,"devType":"oil_well","thing":{"properties":[{"id":"oil_pressure","name":"娌瑰帇","dataType":"float","unit":"MPa"},{"id":"motor_current","name":"鐢垫祦","dataType":"float","unit":"A"}]}},
    {"objectId":"prod_water_inj","name":"娉ㄦ按浜?,"devType":"water_injection","thing":{"properties":[{"id":"water_pressure","name":"娉ㄦ按鍘嬪姏","dataType":"float","unit":"MPa"},{"id":"flow_rate","name":"娴侀噺","dataType":"float","unit":"m3/h"}]}},
    {"objectId":"prod_rtu","name":"RTU缁堢","devType":"rtu","thing":{"properties":[{"id":"signal","name":"淇″彿寮哄害","dataType":"int16","unit":"dBm"}]}},
    {"objectId":"prod_dcs","name":"DCS鎺у埗绔?,"devType":"dcs","thing":{"properties":[{"id":"status","name":"杩愯鐘舵€?,"dataType":"int16","unit":""}]}},
    {"objectId":"prod_relay_dsl31a","name":"DSL-31A 鏂矾鍣?,"devType":"relay","thing":{"properties":[{"id":"Ia","name":"A鐩哥數娴?,"dataType":"float","unit":"A"},{"id":"Ib","name":"B鐩哥數娴?,"dataType":"float","unit":"A"},{"id":"Ic","name":"C鐩哥數娴?,"dataType":"float","unit":"A"}]}},
    {"objectId":"prod_relay_dst31a","name":"DST-31A 鍙樺帇鍣ㄥ樊鍔?,"devType":"relay","thing":{"properties":[{"id":"diff_current","name":"宸姩鐢垫祦","dataType":"float","unit":"A"}]}},
    {"objectId":"prod_compressor","name":"鍘嬬缉鏈?,"devType":"compressor","thing":{"properties":[{"id":"pressure","name":"鎺掓皵鍘嬪姏","dataType":"float","unit":"MPa"},{"id":"temperature","name":"鎺掓皵娓╁害","dataType":"float","unit":"C"}]}},
    {"objectId":"prod_pipeline","name":"闆嗚緭绠＄嚎","devType":"pipeline","thing":{"properties":[{"id":"flow","name":"娴侀噺","dataType":"float","unit":"m3/h"},{"id":"pressure","name":"鍘嬪姏","dataType":"float","unit":"MPa"}]}},
    {"objectId":"prod_gas_inj","name":"娉ㄦ皵绔?,"devType":"gas_injection","thing":{"properties":[{"id":"gas_flow","name":"娉ㄦ皵閲?,"dataType":"float","unit":"m3/h"}]}},
    {"objectId":"prod_dewater","name":"鑴辨按绔?,"devType":"dewater","thing":{"properties":[{"id":"water_cut","name":"鍚按鐜?,"dataType":"float","unit":"%"}]}},
]}

@app.get("/api/classes/_User")
async def parse_users(): return {"results":[
    {"objectId":"u1","username":"dgiot_dev","nick":"DG-IoT寮€鍙戣€?,"role":"admin","email":"dev@dgiot.com","phone":"13800000000"},
    {"objectId":"u2","username":"operator","nick":"杩愮淮宸ョ▼甯?,"role":"operator","email":"op@dgiot.com"},
    {"objectId":"u3","username":"viewer","nick":"璋冨害鍛?,"role":"viewer","email":"view@dgiot.com"},
]}

@app.get("/api/classes/Department")
async def parse_departments(): return {"results":[
    {"objectId":"d1","name":"澶у簡娌圭敯","code":"DQ","parentId":None},
    {"objectId":"d2","name":"閲囨补浜屽巶","code":"DQ02","parentId":"d1"},
    {"objectId":"d3","name":"绗洓浣滀笟鍖?,"code":"DQ0204","parentId":"d2"},
    {"objectId":"d4","name":"鍗?鑱斿悎绔?,"code":"DEVICE_D","parentId":"d3"},
]}

@app.get("/api/classes/_Role")
async def parse_roles(): return {"results":[
    {"objectId":"r1","name":"绠＄悊鍛?,"code":"admin"},
    {"objectId":"r2","name":"杩愮淮宸ョ▼甯?,"code":"operator"},
    {"objectId":"r3","name":"璋冨害鍛?,"code":"viewer"},
]}

# 鈺愨晲鈺愨晲鈺愨晲 Admin 鈺愨晲鈺愨晲鈺愨晲
@app.put("/api/admin/users/{user_id}/role")
async def admin_assign_role(user_id:str, body:dict): return {"status":"ok","user_id":user_id,"role":body.get("role","")}

@app.put("/api/admin/users/{user_id}/dept")
async def admin_assign_dept(user_id:str, body:dict): return {"status":"ok","user_id":user_id,"dept":body.get("dept","")}

@app.get("/api/admin/users")
async def admin_users(): return {"results":[{"objectId":"u1","username":"dgiot_dev","role":"admin","createdAt":"2026-08-01T08:00:00","updatedAt":"2026-08-07T12:00:00"},{"objectId":"u2","username":"operator","role":"operator","createdAt":"2026-08-02T08:00:00","updatedAt":"2026-08-07T10:00:00"},{"objectId":"u3","username":"viewer","role":"viewer","createdAt":"2026-08-03T08:00:00","updatedAt":"2026-08-07T09:00:00"}]}

@app.get("/api/admin/roles")
async def admin_roles(): return {"results":[{"objectId":"r1","name":"绠＄悊鍛?,"parent_id":None},{"objectId":"r2","name":"杩愮淮宸ョ▼甯?,"parent_id":None},{"objectId":"r3","name":"璋冨害鍛?,"parent_id":None}]}

@app.get("/api/admin/departments")
async def admin_depts(): return {"results":[
    {"objectId":"d1","name":"澶у簡娌圭敯","parent_id":None,"_u":3},
    {"objectId":"d2","name":"閲囨补浜屽巶","parent_id":"d1","_u":2},
    {"objectId":"d3","name":"绗洓浣滀笟鍖?,"parent_id":"d2","_u":1},
    {"objectId":"d4","name":"鍗?鑱斿悎绔?,"parent_id":"d3","_u":1},
]}

@app.post("/api/login")
async def admin_login(body:dict): return {"sessionToken":"mock-session-token","username":body.get("username","admin")}

@app.delete("/api/classes/_User/{user_id}")
async def delete_user(user_id:str): return {"status":"deleted"}

@app.post("/api/users")
async def create_user(body:dict): return {"status":"created","username":body.get("username","")}

@app.get("/api/classes/_User")
async def parse_users2(): return {"results":[{"objectId":"u1","username":"dgiot_dev","role":"admin","createdAt":"2026-08-01T08:00:00","updatedAt":"2026-08-07T12:00:00"},{"objectId":"u2","username":"operator","role":"operator","createdAt":"2026-08-02T08:00:00"},{"objectId":"u3","username":"viewer","role":"viewer","createdAt":"2026-08-03T08:00:00"}]}

# 鈺愨晲鈺愨晲鈺愨晲 Channels 鈺愨晲鈺愨晲鈺愨晲
@app.post("/api/product/{product_id}/channels")
async def product_auto_channels(product_id: str):
    """瀵规爣 dgaiot: Product 鍒涘缓鑷姩鐢熸垚涓夐€氶亾 鈥?Channel + TDChannel + TaskChannel"""
    import hashlib
    ch_id = hashlib.md5(f"Channel{product_id}".encode()).hexdigest()[:10]
    td_id = hashlib.md5(f"TDChannel{product_id}".encode()).hexdigest()[:10]
    tk_id = hashlib.md5(f"TaskChannel{product_id}".encode()).hexdigest()[:10]
    return {"product_id": product_id, "auto_created": True,
        "channels": [
            {"channel_id": f"ch_{ch_id}", "name": f"{product_id} 閲囬泦閫氶亾", "cType": "modbus_tcp", "type": "Channel", "status": "online",
             "desc": "閲囬泦閫氶亾 鈥?Product 鍒涘缓鏃惰嚜鍔ㄧ敓鎴?路 dgiot_product_channel:save_channel"},
            {"channel_id": f"td_{td_id}", "name": f"{product_id} 鏃跺簭閫氶亾", "cType": "tdengine", "type": "TDChannel", "status": "online",
             "desc": "鏃跺簭鏁版嵁閫氶亾 鈥?Product 鍒涘缓鏃惰嚜鍔ㄧ敓鎴?路 dgiot_product_channel:save_tdchannel"},
            {"channel_id": f"tk_{tk_id}", "name": f"{product_id} 浠诲姟闃熷垪", "cType": "task", "type": "TaskChannel", "status": "online",
             "desc": "浠诲姟闃熷垪 鈥?Product 鍒涘缓鏃惰嚜鍔ㄧ敓鎴?路 dgiot_product_channel:save_taskchannel"}
        ]}

@app.get("/api/channels")
async def list_channels(): return {"channels":[
    # 鍗忚閫氶亾 鈥?dgiot_bridge 閫傞厤鍣?    {"device_id":"ch_commbridge","name":"LegacyComm :53001","cType":"modbus_tcp","protocol":"Modbus TCP","status":"online","host":"11.248.195.1","port":53001,"devices":191,"points":4567,"desc":"191 RTU 路 绗洓浣滀笟鍖?鍗?鑱斿悎绔?},
    {"device_id":"ch_modbus_tcp","name":"Modbus TCP :502","cType":"modbus_tcp","protocol":"Modbus TCP","status":"online","host":"11.249.34.1","port":502,"devices":76,"points":2100,"desc":"76 RTU 路 绗笁浣滀笟鍖?},
    {"device_id":"ch_modbus_rtu","name":"Modbus RTU","cType":"modbus_rtu","protocol":"Modbus RTU","status":"online","host":"COM3","port":0,"devices":15,"points":450,"desc":"15鍙?RTU 涓插彛"},
    {"device_id":"ch_opcda_1","name":"OPC DA DCS-A","cType":"opcda","protocol":"OPC DA","status":"online","host":"192.168.10.23","port":135,"devices":1,"points":4500,"desc":"RSLinx 路 DX8ZRZ鑱斿悎绔?},
    {"device_id":"ch_opcda_2","name":"OPC DA DCS-B","cType":"opcda","protocol":"OPC DA","status":"online","host":"192.168.10.23","port":135,"devices":1,"points":3800,"desc":"RSLinx 路 DX6PZ鑱斿悎绔?},
    {"device_id":"ch_opcua","name":"OPC UA :4840","cType":"opcua","protocol":"OPC UA","status":"offline","host":"172.26.6.3","port":4840,"devices":0,"points":0,"desc":"WinCC 路 DCS-C 寰呴儴缃?},
    {"device_id":"ch_a11","name":"A11 :8889","cType":"a11","protocol":"A11涓撴湁","status":"online","host":"192.168.10.130","port":8889,"devices":1032,"points":16663,"desc":"RTDB DEVICE_C 路 16663 tags"},
    {"device_id":"ch_iec104","name":"IEC104 :2404","cType":"iec104","protocol":"IEC104","status":"offline","host":"11.250.1.1","port":2404,"devices":0,"points":0,"desc":"鐢靛姏瑙勭害 路 寰呴儴缃?},
    {"device_id":"ch_mqtt","name":"MQTT :1883","cType":"mqtt","protocol":"MQTT","status":"online","host":"localhost","port":1883,"devices":566,"points":0,"desc":"dgiot Broker 路 鍗冧竾绾ф帴鍏?},
    {"device_id":"ch_http","name":"HTTP REST","cType":"http_rest","protocol":"HTTP REST","status":"online","host":"localhost","port":8000,"devices":0,"points":0,"desc":"FastAPI 路 200+ REST璺敱"},
    {"device_id":"ch_dtu","name":"DTU閫忎紶","cType":"dtu","protocol":"DTU閫忎紶","status":"online","host":"0.0.0.0","port":0,"devices":928,"points":0,"desc":"928鍙扮綉鍏?DTU 閫忎紶"},
    {"device_id":"ch_rtsp","name":"RTSP瑙嗛","cType":"rtsp","protocol":"RTSP","status":"offline","host":"172.21.14.100","port":554,"devices":0,"points":0,"desc":"鎽勫儚澶磋棰戞祦 路 寰呴儴缃?},
    # 鏃跺簭閫氶亾 鈥?TDChannel
    {"device_id":"td_1","name":"TDChannel-鐑暟鎹?,"cType":"tdengine","protocol":"TDengine","status":"online","host":"127.0.0.1","port":6041,"devices":0,"points":34226620,"desc":"SSD鐑暟鎹?路 30澶╀繚鐣?},
    {"device_id":"td_2","name":"TDChannel-娓╂暟鎹?,"cType":"tdengine","protocol":"TDengine","status":"online","host":"127.0.0.1","port":6041,"devices":0,"points":0,"desc":"HDD娓╂暟鎹?路 1骞翠繚鐣?},
    # 浠诲姟閫氶亾 鈥?TaskChannel
    {"device_id":"task_1","name":"TaskChannel-閲囬泦璋冨害","cType":"task","protocol":"Task","status":"online","host":"鈥?,"port":0,"devices":0,"points":0,"desc":"閲囬泦浠诲姟璋冨害 路 浼樺厛绾ч槦鍒?},
    {"device_id":"task_2","name":"TaskChannel-鍛婅鍒嗗彂","cType":"task","protocol":"Task","status":"online","host":"鈥?,"port":0,"devices":0,"points":0,"desc":"鍛婅浜嬩欢鍒嗗彂 路 閫氱煡闃熷垪"},
    # 鍘傚晢閫氶亾 鈥?10瀹剁綉鍏?    {"device_id":"gw_hongdian","name":"瀹忕數缃戝叧","cType":"vendor","protocol":"Vendor","status":"online","host":"鈥?,"port":0,"devices":120,"points":0,"desc":"娉ㄥ唽甯ц瘑鍒烽€忎紶瑙ｆ瀽"},
    {"device_id":"gw_yinghantong","name":"鏄犵堪閫氱綉鍏?,"cType":"vendor","protocol":"Vendor","status":"online","host":"鈥?,"port":0,"devices":95,"points":0,"desc":"娉ㄥ唽甯ц瘑鍒烽€忎紶瑙ｆ瀽"},
    {"device_id":"gw_yifan","name":"浜垮竼缃戝叧","cType":"vendor","protocol":"Vendor","status":"online","host":"鈥?,"port":0,"devices":88,"points":0,"desc":"娉ㄥ唽甯ц瘑鍒烽€忎紶瑙ｆ瀽"},
    {"device_id":"gw_youren","name":"鏈変汉缃戝叧","cType":"vendor","protocol":"Vendor","status":"online","host":"鈥?,"port":0,"devices":76,"points":0,"desc":"娉ㄥ唽甯ц瘑鍒烽€忎紶瑙ｆ瀽"},
    {"device_id":"gw_sixin","name":"鍥涗俊缃戝叧","cType":"vendor","protocol":"Vendor","status":"online","host":"鈥?,"port":0,"devices":65,"points":0,"desc":"娉ㄥ唽甯ц瘑鍒烽€忎紶瑙ｆ瀽"},
]}

@app.post("/api/channels/{ch_id}/reconnect")
async def channel_reconnect(ch_id:str): return {"status":"reconnected","id":ch_id}

# 鈺愨晲鈺愨晲鈺愨晲 Simulator 鈺愨晲鈺愨晲鈺愨晲
# 鈺愨晲鈺愨晲鈺愨晲 Simulators 鈥?mutable state 鈺愨晲鈺愨晲鈺愨晲
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
    ("sim1","Modbus TCP","Modbus TCP","11.249.34.1",502,"76鍙癛TU",2100,"ch_modbus_tcp",
     "python simulators/modbus_tcp_server.py",
     _sim_samples("oil",[("娌瑰帇",2.1,0.3,2,2,"MPa"),("鐢垫祦",45,8,3,1,"A"),("鍔熺巼",22,3,5,1,"kW"),("棰戠巼",50,0.2,7,2,"Hz")])),
    ("sim2","OPC UA","OPC UA","172.26.6.3",4840,"WinCC DCS-C",3800,"ch_opcua",
     "python simulators/opcua_server.py",
     _sim_samples("opc",[("娓╁害",85,12,4,1,"鈩?),("鍘嬪姏",2.5,0.3,6,2,"MPa"),("娑蹭綅",60,15,8,1,"%")])),
    ("sim3","IEC 104","IEC 104","11.250.1.1",2404,"RTU-104",30,"ch_iec104",
     "python simulators/iec104_server.py",
     _sim_samples("iec",[("閬ユ祴Ua",380,15,3,1,"V"),("閬ヤ俊",1,1,10,0,"")])),
    ("sim4","A11 鍗忚","A11 IOT","192.168.10.130",8889,"1032鍙皃Space",16663,"ch_a11",
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
    return {"data": {"msg": "鍏ㄩ儴鍚姩鎴愬姛"}, "started": len(_sim_running)}

@app.post("/api/simulators/stop-all")
async def sim_stop_all():
    global _sim_running
    _sim_running = []
    return {"data": {"msg": "鍏ㄩ儴宸插仠姝?}, "stopped": 4}

@app.post("/api/simulators/{sim_id}/start")
async def sim_start(sim_id: str):
    global _sim_running
    if sim_id not in _sim_running:
        _sim_running.append(sim_id)
    return {"msg": f"{sim_id} 宸插惎鍔?, "status": "running", "id": sim_id}

@app.post("/api/simulators/{sim_id}/stop")
async def sim_stop(sim_id: str):
    global _sim_running
    if sim_id in _sim_running:
        _sim_running.remove(sim_id)
    return {"msg": f"{sim_id} 宸插仠姝?, "status": "stopped", "id": sim_id}

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

# 鈺愨晲鈺愨晲鈺愨晲 System 鈺愨晲鈺愨晲鈺愨晲
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
async def tenant(): return {"tenant_id":"default","name":"澶у簡娌圭敯"}

@app.get("/api/users")
async def list_users(): return [{"username":"dgiot_dev","nick":"DG-IoT寮€鍙戣€?,"role":"admin"}]

# 鈺愨晲鈺愨晲鈺愨晲 Navigation 鈺愨晲鈺愨晲鈺愨晲
@app.get("/api/classes/Navigation")
async def navigation(): return {"results":[]}

# Seed alarm data on startup
def _seed_data():
    conn = _alarm_db()
    existing = conn.execute('SELECT COUNT(*) FROM Alarm').fetchone()[0]
    if existing == 0:
        seeds = [
            ("a1","a1","DEVICE_D-000","critical","critical","娌逛簳DEVICE_D-000 娌瑰帇鍋忎綆 2.12MPa 浣庝簬闃堝€?.5","娌瑰帇鍋忎綆","active","2026-08-11T08:00:00","娌瑰帇寮傚父"),
            ("a2","a2","COMP-01","major","major","鍘嬬缉鏈?1 鎸姩瓒呮爣 3.8mm/s 楂樹簬闃堝€?.5","鎸姩瓒呮爣","active","2026-08-11T07:45:00","鎸姩寮傚父"),
            ("a3","a3","INV-01","warning","warning","閫嗗彉鍣?1 娓╁害鍋忛珮 68掳C 鎺ヨ繎闃堝€?0","娓╁害鍋忛珮","active","2026-08-11T07:30:00","娓╁害寮傚父"),
        ]
        conn.executemany('INSERT INTO Alarm(objectId,alarm_id,device_id,severity,alarm_level,alarm_msg,message,status,created_at,alarm_type) VALUES(?,?,?,?,?,?,?,?,?,?)', seeds)
        conn.commit()
    conn.close()
_seed_data()

@app.post("/api/algorithm/upload")
async def algo_upload(): return {"status":"uploaded","id":"alg_"+str(int(time.time()))}

@app.get("/api/algorithm/validate/{algo_id}")
async def algo_validate(algo_id: str):
    """绠楁硶鎵归噺鏍￠獙鎶ュ憡"""
    return {"algo_id":algo_id,"dataset":"鍘嗗彶鏁版嵁 2026-07","鍛戒腑鐜?:94.2,"璇姤鐜?:1.8,"precision":0.96,"recall":0.94,"f1":0.95,"report":{"correct":942,"false_positive":18,"false_negative":58,"total":1000}}

@app.get("/api/algorithm/ab-compare/{algo_id}")
async def algo_ab_compare(algo_id: str):
    """A/B鐗堟湰瀵规瘮鎶ュ憡"""
    return {"algo_id":algo_id,"version_a":{"name":"v2.1","鍛戒腑鐜?:89.1,"璇姤鐜?:3.2},"version_b":{"name":"v2.2-new","鍛戒腑鐜?:94.2,"璇姤鐜?:1.8},"improvement":"+5.1%鍛戒腑鐜? -1.4%璇姤鐜?,"recommendation":"寤鸿鍒囨崲鑷?v2.2-new"}

@app.get("/api/excel/template/{template_type}")
async def excel_template(template_type: str):
    """Excel妯℃澘涓嬭浇"""
    return {"template":f"{template_type}_template.xlsx","fields":["device_id","devaddr","name","devType","protocol","ip","port","station_id"],"download_url":f"/api/excel/download/{template_type}"}

@app.get("/api/data/lake/embed")
async def data_lake_embed():
    """鏁版嵁婀栭棬鎴峰祵鍏?""
    return {"portal_url":"https://data.industry.com/embed","sso_url":"/api/auth/sso?redirect=data_lake","iframe_code":"<iframe src='/dgiot-lite/embed' width='100%' height='800'></iframe>","integration":"SSO + IFrame"}

@app.get("/api/reports/generate")
@app.post("/api/reports/generate")
async def reports_generate(type: str = "鏃ユ姤"):
    """鎶ヨ〃鐢熸垚"""
    return {"type":type,"status":"generated","format":"HTML+JSON","generated_at":time.strftime("%Y-%m-%d %H:%M:%S"),"download_url":f"/api/reports/download/{type}"}

@app.get("/api/mqtt/inspect")
async def mqtt_inspect():
    """MQTT娣卞害璋冭瘯 鈥?瓒呭嚭鎶ヤ环鐨勫鍊煎姛鑳?""
    return {"broker":"192.168.10.131:1883","clients":6,"topics":["dgiot/proxy/commbridge","dgiot/proxy/opcda","dgiot/proxy/a11","dgiot/proxy/modbus","dgiot/proxy/iec104"],"messages":[{"topic":"dgiot/proxy/commbridge","payload":"oil_pressure=2.12MPa","qos":1,"time":"08:15:30.123"}],"tools":["Topic Scan","Message Trace","Payload Decode","QoS Stats","Latency Measure"]}

@app.get("/api/packet/decode/{protocol}")
async def packet_decode(protocol: str, hex: str = ""):
    """澶氬崗璁姤鏂囪В鐮?鈥?瓒呭嚭鎶ヤ环鐨勫鍊煎姛鑳?""
    samples = {"modbus":"01 03 02 3F 8B E9 D3 鈫?Slave1 璇讳繚鎸佸瘎瀛樺櫒 娌瑰帇=1.09MPa","a11":"A1 10 81 00 00 00 00 38 鈫?RTDB 鏍囩鏌ヨ鍝嶅簲","iec104":"68 0E 00 00 02 00 64 01 鈫?鎬诲彫鍞ょ‘璁?閬ユ祴鍊?100","opcda":"05 00 0B 03 10 00 00 00 鈫?OPC DA Bind鍝嶅簲"}
    return {"protocol":protocol,"hex":hex or list(samples.values())[0],"decoded":samples.get(protocol,list(samples.values())[0]),"supported":list(samples.keys())}

@app.get("/api/graphrag/query")
async def graphrag_query(q: str = ""):
    """鐭ヨ瘑鍥捐氨闂瓟 鈥?瓒呭嚭鎶ヤ环鐨勫鍊煎姛鑳?""
    return {"question":q or "娌瑰帇鍋忎綆濡備綍澶勭悊?","answer":"鍩轰簬鐭ヨ瘑鍥捐氨妫€绱? 娌瑰帇鍋忎綆(浣庝簬2.0MPa)甯歌鍘熷洜: 1)娉垫晥涓嬮檷 2)鍦板眰渚涙恫涓嶈冻 3)绠＄嚎娉勬紡銆傚缓璁? 鈶犳煡鐪嬫车鏁堣瘖鏂粨鏋?鈶″姣旈偦浜曟补鍘嬭秼鍔?鈶㈠畨鎺掔幇鍦哄贰妫€纭绠＄嚎鐘舵€併€?,"sources":["娌逛簳鏁呴殰鐭ヨ瘑搴?,"鍘嗗彶鍛婅鍏宠仈瑙勫垯","娉垫晥璇婃柇绠楁硶"],"confidence":0.87}

@app.get("/api/amis/page/{page_id}")
async def amis_page(page_id: str = "dashboard"):
    """浣庝唬鐮佽〃鍗曢〉闈?鈥?瓒呭嚭鎶ヤ环鐨勫鍊煎姛鑳?""
    return {"page_id":page_id,"schema":{"type":"page","title":"鑷畾涔夐┚椹惰埍","body":[{"type":"grid","columns":[{"type":"chart","api":"/api/stats"},{"type":"table","api":"/api/devices"}]}]},"preview_url":f"/amis-test/#/page/{page_id}"}

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(); p.add_argument("--port", type=int, default=9876); args = p.parse_args()
    print(f"Mock API Server: http://localhost:{args.port}")
    uvicorn.run(app, host="0.0.0.0", port=args.port, log_level="warning")
