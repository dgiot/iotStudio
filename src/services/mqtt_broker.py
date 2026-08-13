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
                hdr=await r.readexactly(2); ctrl=(hdr[0]>>4)&0x0F; rlen=hdr[1]
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
                    suback=b'\x90'+struct.pack('>B',2+len(ok))+struct.pack('>H',pid)+bytes(ok)
                    w.write(suback); await w.drain()
                elif ctrl==PINGREQ: w.write(b'\xd0\x00'); await w.drain()
                elif ctrl==DISCONNECT: break
        except (asyncio.IncompleteReadError,ConnectionResetError): pass
        finally: self._cleanup(w)

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

    async def _relay(self,topic,payload,sender):
        pt=topic.split('/'); tp=''
        for i,p in enumerate(pt):
            tp=(tp+'/'+p).lstrip('/')
            if tp in self._subs:
                for w in list(self._subs[tp]):
                    if w is sender: continue
                    try:
                        t=topic.encode(); pl=struct.pack('>H',len(t))+t+payload
                        w.write(bytes([PUBLISH<<4,len(pl)])+pl); await w.drain()
                    except: pass
        # # wildcard
        if '#' in self._subs:
            for w in list(self._subs['#']):
                if w is sender: continue
                try:
                    t=topic.encode(); pl=struct.pack('>H',len(t))+t+payload
                    w.write(bytes([PUBLISH<<4,len(pl)])+pl); await w.drain()
                except: pass

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
