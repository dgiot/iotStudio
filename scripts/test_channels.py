import sys; sys.path.insert(0, '.')
from src.channel_registry import register_channel_plugin, CType, ChannelManager
print('channel_registry:', 'OK')

from src.channel_bootstrap import bootstrap_channels, shutdown_channels
print('bootstrap:', 'OK')

# 测试插件自注册
from src.protocols.modbus_rtu_server import ModbusRtuTcpServer, DTUSimulator
print('rtu_server:', ModbusRtuTcpServer.__name__)
print('dtu_simulator:', DTUSimulator.__name__)

from src.services.mqtt_broker import MiniMqttBroker, start_builtin_broker
print('mqtt_broker:', MiniMqttBroker.__name__)

# 检查注册的通道
channels = ChannelManager.list_all()
print(f'\nRegistered channels: {len(channels)}')
for ch in channels:
    print(f"  {ch['channel_id']:20s} {ch['cType']:12s} {ch['name']}")

print('\nALL PASS')
