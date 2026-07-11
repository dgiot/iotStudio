#!/usr/bin/env python3
""" dgiot_lite — 内置微型 MQTT Broker (asyncio TCP)
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
                    cid=self._parse_connect(body) or cid; self._clients[w]=cid
                    w.write(b'\x20\x02\x00\x00'); await w.drain()
                elif ctrl==PUBLISH:
                    tlen=struct.unpack('>H',body[0:2])[0]; topic=body[2:2+tlen].decode(); payload=body[2+tlen:]
                    await self._relay(topic,payload,w)
                elif ctrl==SUBSCRIBE:
                    ts=self._parse_subscribe(body)
                    for t,q in ts:
                        if t not in self._subs: self._subs[t]=set()
                        self._subs[t].add(w)
                    suback=b'\x90\x03'+struct.pack('>H',struct.unpack('>H',body[0:2])[0])+bytes([0]*len(ts))
                    w.write(suback); await w.drain()
                elif ctrl==PINGREQ: w.write(b'\xd0\x00'); await w.drain()
                elif ctrl==DISCONNECT: break
        except (asyncio.IncompleteReadError,ConnectionResetError): pass
        finally: self._cleanup(w)

    def _parse_connect(self,d):
        try:
            plen=struct.unpack('>H',d[0:2])[0]; off=2+plen+1+1+2
            clen=struct.unpack('>H',d[off:off+2])[0]
            return d[off+2:off+2+clen].decode(errors='replace') or None
        except: return None

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
        self._clients.pop(w,None)
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
