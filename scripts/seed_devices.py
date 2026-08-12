"""种子数据 — 6设备 + 56测点"""
import httpx, asyncio

DEVICES = [
    {'device_id':'inv_01','device_name':'光伏逆变器#1','device_type':'inverter','station_id':'station_01','protocol':'modbus_tcp','manufacturer':'华为','model':'SUN2000-50KTL','comm_params':{'host':'127.0.0.1','port':502,'slave_id':1}},
    {'device_id':'pcs_01','device_name':'储能PCS#1','device_type':'pcs','station_id':'station_01','protocol':'modbus_tcp','manufacturer':'阳光电源','model':'SG1250UD','comm_params':{'host':'127.0.0.1','port':1502,'slave_id':1}},
    {'device_id':'charger_01','device_name':'直流快充桩#1','device_type':'charger','station_id':'station_01','protocol':'modbus_tcp','manufacturer':'星星充电','model':'DDC-120kW','comm_params':{'host':'127.0.0.1','port':2502,'slave_id':1}},
    {'device_id':'meter_01','device_name':'三相智能电表#1','device_type':'meter','station_id':'station_01','protocol':'modbus_rtu','manufacturer':'威胜','model':'DTSD341','comm_params':{'host':'127.0.0.1','port':503,'slave_id':1}},
    {'device_id':'pcs_iec104','device_name':'IEC104储能PCS','device_type':'pcs','station_id':'station_01','protocol':'iec104','manufacturer':'南瑞继保','model':'PCS-9567','comm_params':{'host':'127.0.0.1','port':2404}},
    {'device_id':'charger_opcua','device_name':'OPCUA充电桩','device_type':'charger','station_id':'station_01','protocol':'opcua','manufacturer':'特来电','model':'TEL-240kW','comm_params':{'endpoint':'opc.tcp://127.0.0.1:4840'}},
]

POINTS = {
    'inv_01': [
        ('voltage_a','A相电压','4001','float32','V',1.0,220,260),
        ('voltage_b','B相电压','4003','float32','V',1.0,220,260),
        ('current_a','A相电流','4007','float32','A',0.1,0,100),
        ('power_total','总功率','4011','float32','kW',0.1,0,55),
        ('daily_energy','日发电量','4013','float32','kWh',0.1,0,500),
        ('temp_inverter','逆变器温度','4015','float32','C',0.1,20,85),
        ('frequency','电网频率','4017','float32','Hz',0.01,49.5,50.5),
        ('efficiency','转换效率','4019','float32','%',0.1,90,99),
    ],
    'pcs_01': [
        ('soc','电池SOC','301','float32','%',0.1,10,100),
        ('soh','电池SOH','303','float32','%',0.1,80,100),
        ('dc_voltage','直流电压','305','float32','V',0.1,600,850),
        ('dc_current','直流电流','307','float32','A',0.1,-200,200),
        ('ac_power','交流功率','309','float32','kW',0.1,-125,125),
        ('battery_temp','电池温度','311','float32','C',0.1,15,45),
        ('charge_energy','充电电量','313','float32','kWh',0.1,0,10000),
        ('discharge_energy','放电电量','315','float32','kWh',0.1,0,10000),
    ],
    'charger_01': [
        ('voltage_out','输出电压','201','float32','V',0.1,200,750),
        ('current_out','输出电流','203','float32','A',0.1,0,200),
        ('power_out','输出功率','205','float32','kW',0.1,0,120),
        ('energy_charged','充电电量','207','float32','kWh',0.1,0,10000),
        ('gun_temp','枪头温度','209','float32','C',0.1,10,70),
        ('module_temp','模块温度','211','float32','C',0.1,20,80),
    ],
    'meter_01': [
        ('voltage_a','A相电压','101','float32','V',0.1,220,240),
        ('voltage_b','B相电压','103','float32','V',0.1,220,240),
        ('current_a','A相电流','105','float32','A',0.01,0,60),
        ('active_power','有功功率','109','float32','kW',0.01,0,30),
        ('total_energy','总有功电量','113','float32','kWh',0.1,0,99999),
        ('pf','功率因数','115','float32','',0.001,0.8,1.0),
    ],
    'pcs_iec104': [
        ('active_power','有功功率','1001','float32','MW',0.01,0,5),
        ('reactive_power','无功功率','1003','float32','Mvar',0.01,0,2),
        ('voltage_bus','母线电压','1005','float32','kV',0.01,10,35),
        ('frequency','频率','1007','float32','Hz',0.01,49.5,50.5),
        ('breaker_status','断路器状态','2001','int16','',1,0,1),
        ('protection_signal','保护信号','2003','int16','',1,0,1),
    ],
    'charger_opcua': [
        ('dc_voltage','直流电压','ns=2;s=Charger.DC.Voltage','float32','V',1,200,750),
        ('dc_current','直流电流','ns=2;s=Charger.DC.Current','float32','A',1,0,200),
        ('dc_power','直流功率','ns=2;s=Charger.DC.Power','float32','kW',1,0,240),
        ('energy_delivered','充电电量','ns=2;s=Charger.Energy.Delivered','float32','kWh',1,0,99999),
        ('ambient_temp','环境温度','ns=2;s=Env.Temperature','float32','C',1,-10,50),
        ('humidity','环境湿度','ns=2;s=Env.Humidity','float32','%',1,0,100),
    ],
}

async def seed():
    async with httpx.AsyncClient(timeout=30) as c:
        BASE = 'http://localhost:8000'
        for d in DEVICES:
            r = await c.post(f'{BASE}/api/devices', json=d)
            print(f'  {d["device_id"]}: {r.status_code}')
        for did, pts in POINTS.items():
            body = [{'device_id':did,'point_id':p[0],'point_name':p[1],'protocol_addr':p[2],'data_type':p[3],'unit':p[4],'scale':p[5],'register_type':'3','collect_interval':5,'alarm_low':p[6],'alarm_high':p[7]} for p in pts]
            r = await c.post(f'{BASE}/api/devices/{did}/points/batch', json=body)
            print(f'  {did}: {r.status_code} {len(body)}pts')
        r = await c.get(f'{BASE}/api/devices')
        print(f'Done: {r.json()["total"]} devices')

asyncio.run(seed())
