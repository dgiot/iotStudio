#!/usr/bin/env python3
""" iotStudio — 内置微型 MQTT Broker (asyncio TCP)
    支持: CONNECT/CONNACK, PUBLISH, SUBSCRIBE, PINGREQ/PINGRESP
    端口 1883, 纯 TCP, 无外部依赖
"""
import asyncio, struct, logging
from typing import Dict, Set, Optional

logger = logging.getLogger(__name__)
CONNECT, CONNACK, PUBLISH, SUBSCRIBE, SUBACK, PINGREQ, PINGRESP, DISCONNECT = 1,2,3,8,9,12,13,14

class MiniMqttBroker:
    def __init__(self, host="0.0.0.0", port=1883):
        self.host=host; self.port=port
        self._server=None; self._running=False
        self._subs: Dict[str, Set[asyncio.StreamWriter]]={}
        self._clients: Dict[asyncio.StreamWriter, str]={}
        self._roles: Dict[asyncio.StreamWriter, str]={}  # writer→role 用于ACL
        self._sessions: Dict[str, dict]={}  # sessionToken→{username,role}

    def _validate_session(self, username: str, password: str) -> Optional[str]:
        """验证 sessionToken, 返回 role 或 None"""
        import sqlite3, json
        try:
            db = sqlite3.connect('data/parse.db')
            rows = db.execute(
                'SELECT objectId, data FROM _User WHERE data LIKE ?',
                (f'%"sessionToken":"{password}"%',)
            ).fetchall()
            db.close()
            for oid, data in rows:
                d = json.loads(data)
                if d.get('sessionToken') == password:
                    role = d.get('role', 'user')
                    self._sessions[password] = {'username': d.get('username', oid), 'role': role}
                    logger.info(f"[mqtt-auth] {d.get('username')} authenticated, role={role}")
                    return role
        except Exception as e:
            logger.warning(f"[mqtt-auth] validation error: {e}")
        return None

    def _acl_check(self, topic: str, role: str) -> bool:
        """topic ACL: admin全通, 其他只读#read topic"""
        if role == 'admin':
            return True
        # oil-monitor: 只能读井口数据
        if role == 'oil-monitor':
            return 'oilwell' in topic or 'dgiot/stat' in topic or 'dgiot/#' in topic
        # 默认只读
        return topic.startswith('dgiot/')

    async def start(self):
        try:
            self._server=await asyncio.start_server(self._handle,self.host,self.port)
            self._running=True
            logger.info(f"[mqtt-broker] TCP:{self.port} 已启动")
        except OSError as e: logger.warning(f"[mqtt-broker] 端口占用: {e}")

    async def stop(self):
        if not self._running: return
        self._running=False
        if self._server: self._server.close(); await self._server.wait_closed()
        for w in list(self._clients):
            try: w.close()
            except: pass
        self._clients.clear(); self._subs.clear()
        logger.info("[mqtt-broker] 已停止")

    async def _handle(self, r: asyncio.StreamReader, w: asyncio.StreamWriter):
        cid=f"anon_{id(w)}"
        try:
            while self._running:
                first=await r.readexactly(1); ctrl=(first[0]>>4)&0x0F
                rlen=0; mult=1                     # MQTT 剩余长度 varint
                while True:
                    b=(await r.readexactly(1))[0]
                    rlen+=(b&0x7F)*mult; mult*=128
                    if not b&0x80: break
                body=await r.readexactly(rlen) if rlen>0 else b''
                if ctrl==CONNECT:
                    cid, user, pwd = self._parse_connect(body)
                    cid = cid or f"anon_{id(w)}"
                    if user and pwd:
                        role = self._validate_session(user, pwd)
                        if role:
                            self._roles[w] = role
                            logger.info(f"[mqtt] {cid} auth OK role={role}")
                        else:
                            logger.warning(f"[mqtt] {cid} auth FAIL")
                    self._clients[w]=cid
                    # CONNACK: session_present=0, return_code=0
                    w.write(b'\x20\x02\x00\x00'); await w.drain()
                elif ctrl==PUBLISH:
                    tlen=struct.unpack('>H',body[0:2])[0]; topic=body[2:2+tlen].decode(); payload=body[2+tlen:]
                    await self._relay(topic,payload,w)
                elif ctrl==SUBSCRIBE:
                    ts=self._parse_subscribe(body)
                    role = self._roles.get(w, 'anonymous')
                    ok = []
                    for t,q in ts:
                        if self._acl_check(t, role):
                            if t not in self._subs: self._subs[t]=set()
                            self._subs[t].add(w)
                            ok.append(0)  # granted QoS
                        else:
                            ok.append(0x80)  # failure
                            logger.warning(f"[mqtt-acl] {self._clients.get(w)} denied topic={t}")
                    pid=struct.unpack('>H',body[0:2])[0]
                    body_ack=struct.pack('>H',pid)+bytes(ok)
                    suback=b'\x90'+self._varint(len(body_ack))+body_ack
                    w.write(suback); await w.drain()
                elif ctrl==PINGREQ: w.write(b'\xd0\x00'); await w.drain()
                elif ctrl==DISCONNECT: break
        except (asyncio.IncompleteReadError,ConnectionResetError): pass
        finally: self._cleanup(w)

    @staticmethod
    def _varint(n: int) -> bytes:
        """MQTT 剩余长度编码 (≥128 字节必须 varint, 单字节会产出非法帧)"""
        out = b""
        while True:
            d = n % 128; n //= 128
            if n:
                out += bytes([d | 0x80])
            else:
                return out + bytes([d])

    def _parse_connect(self,d):
        try:
            plen=struct.unpack('>H',d[0:2])[0]; off=2+plen
            flags=d[off] if off<len(d) else 0; off+=1
            keepalive=struct.unpack('>H',d[off:off+2])[0]; off+=2
            clen=struct.unpack('>H',d[off:off+2])[0]; off+=2
            cid=d[off:off+clen].decode(errors='replace') or None; off+=clen
            user, pwd = None, None
            if flags & 0x80 and off<len(d):  # username
                ulen=struct.unpack('>H',d[off:off+2])[0]; off+=2
                user=d[off:off+ulen].decode(errors='replace'); off+=ulen
            if flags & 0x40 and off<len(d):  # password
                plen2=struct.unpack('>H',d[off:off+2])[0]; off+=2
                pwd=d[off:off+plen2].decode(errors='replace')
            return cid, user, pwd
        except: return None, None, None

    def _parse_subscribe(self,d):
        ts=[]; off=2
        while off<len(d):
            tl=struct.unpack('>H',d[off:off+2])[0]; t=d[off+2:off+2+tl].decode(errors='replace')
            q=d[off+2+tl] if off+2+tl<len(d) else 0; ts.append((t,q)); off+=2+tl+1
        return ts

    @staticmethod
    def _match(filt: str, topic: str) -> bool:
        """MQTT 标准通配匹配: '+' 单层, '#' 多层尾部 (含父级)"""
        f = filt.split('/'); t = topic.split('/')
        for i, seg in enumerate(f):
            if seg == '#':
                return True                      # 匹配剩余全部层级 (含 dgiot/# ↔ dgiot 本身)
            if i >= len(t):
                return False
            if seg != '+' and seg != t[i]:
                return False
        return len(f) == len(t)

    async def _relay(self, topic, payload, sender):
        # 订阅过滤器数量为 mini 规模, 直接全量匹配 (标准 MQTT 通配语义)
        for filt, writers in list(self._subs.items()):
            if not self._match(filt, topic):
                continue
            for w in list(writers):
                if w is sender:
                    continue
                try:
                    t = topic.encode(); pl = struct.pack('>H', len(t)) + t + payload
                    w.write(bytes([PUBLISH << 4]) + self._varint(len(pl)) + pl); await w.drain()
                except Exception:
                    pass

    def _cleanup(self,w):
        self._clients.pop(w,None); self._roles.pop(w,None)
        for ws in self._subs.values(): ws.discard(w)
        try: w.close()
        except: pass

_broker=None
async def start_builtin_broker(host="0.0.0.0",port=1883):
    global _broker
    if _broker and _broker._running: return
    _broker=MiniMqttBroker(host,port); await _broker.start()

async def stop_builtin_broker():
    global _broker
    if _broker: await _broker.stop(); _broker=None

# ── 自注册为通道插件 ──
def _register_mqtt_broker_plugin():
    try:
        from src.channel_registry import register_channel_plugin, CType
        async def _start():
            await start_builtin_broker("0.0.0.0", 21883)
        register_channel_plugin(
            channel_id="ch_mqtt_broker", cType=CType.LISTEN,
            name="内置 MQTT Broker", version="1.0",
            description="asyncio TCP MQTT Broker, 支持 sessionToken 认证 + ACL",
            config={"host": "0.0.0.0", "port": 21883, "isEnable": True},
            on_start=_start, on_stop=stop_builtin_broker,
            protocol="mqtt", endpoint="0.0.0.0:21883",
        )
    except Exception as e:
        logger.warning(f"[mqtt_broker] 插件注册失败: {e}")

_register_mqtt_broker_plugin()
