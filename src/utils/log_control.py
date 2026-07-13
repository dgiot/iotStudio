"""
dgiot 日志节制引擎 (Python 移植)
=================================
对标 Erlang dgiot_log_control — 策略余额制 + 频率控制
高频场景下，宁可静默也不刷屏。
"""
import time, threading, logging
from collections import defaultdict

_tls = threading.local()

def _b():
    if not hasattr(_tls, 'b'):
        _tls.b = {'counts': defaultdict(int), 'limits': {}, 'intervals': {}, 'disabled': set(), 'off': False, 'tags': {}}
    return _tls.b

# ═══ 核心 ═══

def should_log(module: str, level: str = 'INFO') -> bool:
    """七层检查链"""
    b = _b()
    if b['off']: return False
    if module in b['disabled']: return False
    if level in b['disabled']: return False
    # 频率控制
    ikey = f'int:{module}'
    if ikey in b['intervals']:
        now = time.time()
        if now - b['intervals'][ikey] < b['intervals'].get(f'{ikey}:sec', 60):
            return False
        b['intervals'][ikey] = now
    # 策略余额
    key = f'cnt:{module}'
    limit = b['limits'].get(key, b['limits'].get('default', 100))
    if b['counts'][key] >= limit:
        return False
    b['counts'][key] += 1
    return True

# ═══ API ═══

def set_limit(module: str, n: int):
    _b()['limits'][f'cnt:{module}'] = n

def set_default_limit(n: int):
    _b()['limits']['default'] = n

def add_balance(module: str, n: int):
    _b()['counts'][f'cnt:{module}'] = max(0, _b()['counts'][f'cnt:{module}'] - n)

def set_interval(module: str, seconds: float):
    b = _b(); b['intervals'][f'int:{module}'] = 0; b['intervals'][f'int:{module}:sec'] = seconds

def disable_level(lvl: str): _b()['disabled'].add(lvl.upper())
def disable_module(mod: str): _b()['disabled'].add(mod)
def off(): _b()['off'] = True
def on(): _b()['off'] = False
def reset(): _tls.b = {'counts': defaultdict(int), 'limits': {}, 'intervals': {}, 'disabled': set(), 'off': False, 'tags': {}}
def set_tag(slot: int, v: str): _b()['tags'][f'tag{slot}'] = str(v)
def tags() -> str: return ''.join(f'[{_b()["tags"].get(f"tag{i}","")}]' for i in range(6) if _b()['tags'].get(f'tag{i}'))

# ═══ 场景模板 ═══

def tcp_mode(station='', ip='', port=0):
    reset(); set_limit('commbridge', 20); set_interval('commbridge', 10); disable_level('DEBUG')
    if station: set_tag(0, station)
    if ip: set_tag(2, ip); set_tag(3, str(port))

def shadow_mode(device='', station=''):
    reset(); set_limit('shadow', 100)
    if device: set_tag(0, device)
    if station: set_tag(1, station)

def prod_mode():
    reset(); set_limit('*', 5); disable_level('DEBUG'); disable_level('INFO'); set_interval('*', 300); set_default_limit(3)
