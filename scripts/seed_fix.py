"""种子修复 — 测点地址匹配模拟器"""
import httpx, asyncio

POINTS = {
    'inv_01': [('voltage_a','A相电压','0','float32','V',1.0,210,270),('current_a','A相电流','2','float32','A',1.0,0,30),('active_power','有功功率','4','float32','W',1.0,0,5000),('power_factor','功率因数','6','float32','',1.0,0.8,1.0),('temp_inverter','逆变器温度','8','float32','C',1.0,20,80),('daily_energy','日发电量','10','float32','Wh',1.0,0,999999),('dc_voltage','直流电压','16','float32','V',1.0,600,1000)],
    'pcs_01': [('dc_voltage','直流电压','0','float32','V',1.0,600,850),('dc_current','直流电流','2','float32','A',1.0,-200,200),('ac_power','交流功率','4','float32','kW',1.0,-125,125),('soc','电池SOC','6','float32','%',1.0,10,100),('battery_temp','电池温度','8','float32','C',1.0,15,45)],
    'charger_01': [('voltage_out','输出电压','0','float32','V',1.0,200,750),('current_out','输出电流','2','float32','A',1.0,0,200),('power_out','输出功率','4','float32','kW',1.0,0,120),('energy_charged','充电电量','6','float32','kWh',1.0,0,10000),('gun_temp','枪头温度','8','float32','C',1.0,10,70)],
}

async def fix():
    async with httpx.AsyncClient(timeout=30) as c:
        B='http://localhost:8000'
        for did, pts in POINTS.items():
            # 删旧测点重建
            try: await c.delete(f'{B}/api/devices/{did}')
            except: pass
            # 重建设备
            devs = {'inv_01':{'device_id':'inv_01','device_name':'光伏逆变器#1','device_type':'inverter','protocol':'modbus_tcp','comm_params':{'host':'127.0.0.1','port':502,'slave_id':1}},
                    'pcs_01':{'device_id':'pcs_01','device_name':'储能PCS#1','device_type':'pcs','protocol':'modbus_tcp','comm_params':{'host':'127.0.0.1','port':1502,'slave_id':1}},
                    'charger_01':{'device_id':'charger_01','device_name':'直流快充桩#1','device_type':'charger','protocol':'modbus_tcp','comm_params':{'host':'127.0.0.1','port':2502,'slave_id':1}}}
            await c.post(f'{B}/api/devices', json=devs[did])
            body = [{'device_id':did,'point_id':p[0],'point_name':p[1],'protocol_addr':p[2],'data_type':p[3],'unit':p[4],'scale':p[5],'register_type':'3','collect_interval':5,'alarm_low':p[6],'alarm_high':p[7]} for p in pts]
            r = await c.post(f'{B}/api/devices/{did}/points/batch', json=body)
            print(f'{did}: {r.status_code} {len(body)}pts')
        r = await c.get(f'{B}/api/stats')
        print(f'Collector: {r.json()["total_devices"]} devices')

asyncio.run(fix())
