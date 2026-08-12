#!/usr/bin/env python3
# ============================================================
# dgiot_lite — Modbus RTU over TCP 桥接模拟器
# 在 TCP 端口上模拟 RTU 帧格式，解决 Windows 无串口问题
# 启动: python modbus_rtu_tcp_bridge.py
# ============================================================
import asyncio, logging, struct, math, time
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext, ModbusSequentialDataBlock
from pymodbus.server import ModbusTcpServer
from pymodbus.device import ModbusDeviceIdentification

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("rtu-bridge")

def float_to_regs(v): b=struct.pack('>f',v); return struct.unpack('>HH',b)

async def update_registers(hr, interval=1):
    while True:
        t=time.time()
        vals={
            0x0000:230.0+3*math.sin(t*0.1),    # A相电压
            0x0002:15.2+3*math.sin(t*0.15),     # A相电流
            0x0004:3480+500*math.sin(t*0.08),   # 有功功率
            0x0012:152340+(t%86400)*0.01,       # 正向电量
        }
        for addr,val in vals.items():
            hi,lo=float_to_regs(val)
            hr.setValues(addr,[hi]);hr.setValues(addr+1,[lo])
        await asyncio.sleep(interval)

async def main():
    hr=ModbusSequentialDataBlock(0,[0]*100)
    ctx=ModbusSlaveContext(hr=hr,ir=ModbusSequentialDataBlock(0,[0]*100),co=ModbusSequentialDataBlock(0,[0]*100),di=ModbusSequentialDataBlock(0,[0]*100))
    srv_ctx=ModbusServerContext(slaves={1:ctx},single=False)
    identity=ModbusDeviceIdentification();identity.VendorName="dgiot_lite";identity.ProductName="RTU电表模拟器";identity.Version="V1.0"
    server=ModbusTcpServer(context=srv_ctx,identity=identity,address=("0.0.0.0",503))
    asyncio.create_task(update_registers(hr))
    logger.info("Modbus RTU 桥接模拟器 -> 0.0.0.0:503 (电表)")
    await server.serve_forever()

if __name__=="__main__":
    print("Modbus RTU 桥接模拟器 -> :503")
    try: asyncio.run(main())
    except KeyboardInterrupt: print("已停止")
