#!/usr/bin/env python3
"""抓包分析独立服务 — 端口 8765，不冲突"""
import struct, time, json, threading, os, sys
from collections import defaultdict
from http.server import HTTPServer, BaseHTTPRequestHandler

# ===== 全局状态 =====
packets = []  # 报文列表
flows = {}    # flow_key → info
capturing = False
cap_thread = None
PORT = 8765

def parse_mbap_plus(data):
    """解析协议帧: A11(5a5a) / jjZZ / Modbus TCP / IEC104"""
    if len(data) < 4:
        return {"proto": "raw", "len": len(data)}
    # 1. A11 CNPC 帧 (5a5a 帧头, 2B LE length)
    if data[0:2] == b'\x5a\x5a' and len(data) >= 6:
        flen = int.from_bytes(data[2:4], 'little')
        p = {"proto": "A11", "len": len(data), "frame_len": flen}
        if len(data) >= 10:
            p["flags"] = data[4:8].hex(' ')
            p["msg_type"] = f'0x{int.from_bytes(data[8:10],"little"):04X}'
        # 搜索内嵌 jjZZ
        jj = data.find(b'\x6a\x6a\x5a\x5a')
        if jj >= 0:
            p["jjzz_offset"] = jj
            if len(data) >= jj + 8:
                p["a11_type"] = f'0x{int.from_bytes(data[jj+4:jj+6],"little"):04X}'
        return p
    # 2. jjZZ 魔术字 (裸 A11 帧)
    if data[0:4] == b'\x6a\x6a\x5a\x5a' or data[7:11] == b'\x6a\x6a\x5a\x5a':
        p = {"proto": "A11-jjZZ", "len": len(data)}
        pos = data.find(b'\x6a\x6a\x5a\x5a')
        if pos >= 0 and len(data) >= pos + 8:
            p["msg_type"] = f'0x{int.from_bytes(data[pos+4:pos+6],"little"):04X}'
            p["msg_sub"] = f'0x{int.from_bytes(data[pos+6:pos+8],"little"):04X}'
        if pos >= 7:
            p["tid"] = int.from_bytes(data[pos-7:pos-5], 'big')
            p["slave"] = data[pos-1]
        return p
    # 3. DCE/RPC (OPC DA)
    if data[0] == 0x05 and data[1] == 0x00 and len(data) >= 12:
        pkt_types = {0:'Request',1:'Ping',2:'Response',3:'Fault',11:'Bind',12:'Bind_ack',14:'AlterContext'}
        p = {"proto": "OPC-DA", "len": len(data), "rpc_ver": "5.0"}
        if len(data) >= 3: p["pkt_type"] = pkt_types.get(data[2], f'0x{data[2]:02X}')
        if len(data) >= 10: p["frag_len"] = int.from_bytes(data[8:10], 'little')
        return p
    # 4. IEC104
    if data[0] == 0x68:
        return {"proto": "IEC104", "len": len(data), "apdu_len": data[1]}
    # 4. Modbus TCP (严格校验 PID + FC)
    if len(data) >= 8:
        pid = int.from_bytes(data[2:4], 'big')
        uid = data[6]
        fc = data[7]
        fc_names = {1:'读线圈',2:'读离散',3:'读保持寄存器',4:'读输入寄存器',5:'写单线圈',6:'写单寄存',15:'写多线圈',16:'写多寄存'}
        if pid == 0 and uid <= 247 and fc in fc_names:
            tid = int.from_bytes(data[0:2], 'big')
            p = {"proto": "Modbus", "len": len(data), "tid": tid, "slave": uid, "fc": fc, "fc_name": fc_names[fc]}
            if fc in (1,2,3,4) and len(data) >= 12:
                p["addr"] = int.from_bytes(data[8:10], 'big'); p["count"] = int.from_bytes(data[10:12], 'big')
            elif fc == 6 and len(data) >= 12:
                p["addr"] = int.from_bytes(data[8:10], 'big'); p["value"] = int.from_bytes(data[10:12], 'big')
            return p
    return {"proto": "unknown", "len": len(data)}

def sniffer(ports, iface=None):
    """抓包线程 — TCP 流重组 + 帧提取"""
    global capturing, packets, flows
    stream_bufs = {}  # flow_key → bytes buffer
    try:
        from scapy.all import sniff, Raw, TCP, IP
        def handle(pkt):
            if not pkt.haslayer(TCP) or not pkt.haslayer(Raw): return
            sp, dp = pkt[TCP].sport, pkt[TCP].dport
            if sp not in ports and dp not in ports: return
            direction = 'RX' if sp in ports else 'TX'
            src = f"{pkt[IP].src}:{sp}"; dst = f"{pkt[IP].dst}:{dp}"
            flow_key = f"{src}→{dst}" if sp in ports else f"{dst}→{src}"
            raw = bytes(pkt[Raw].load)
            if len(raw) < 6: return
            # TCP 流重组
            buf = stream_bufs.get(flow_key, b'') + raw
            stream_bufs[flow_key] = buf
            # 从缓冲区提取完整帧 (MBAP头: len在 bytes 4-6)
            while len(buf) >= 7:
                mblen = int.from_bytes(buf[4:6], 'big') + 6
                if mblen > len(buf) or mblen < 7:
                    break  # 不完整，等待更多数据
                frame = buf[:mblen]; buf = buf[mblen:]
                parsed = parse_mbap_plus(frame)
                entry = {"ts": time.time(), "dir": direction, "src": src, "dst": dst,
                    "len": len(frame), "proto": parsed["proto"], "parsed": parsed,
                    "hex": frame[:80].hex(' ') + ('...' if len(frame) > 80 else '')}
                packets.append(entry)
                if len(packets) > 2000: packets[:] = packets[-1000:]
                if flow_key not in flows:
                    flows[flow_key] = {"src": src, "dst": dst, "packets": 0, "bytes": 0, "proto": "", "first": time.time(), "last": 0}
                flows[flow_key]["packets"] += 1
                flows[flow_key]["bytes"] += len(frame)
                flows[flow_key]["proto"] = flows[flow_key]["proto"] or parsed["proto"]
                flows[flow_key]["last"] = time.time()
            stream_bufs[flow_key] = buf
        kwargs = {"prn": handle, "store": False}
        if iface: kwargs["iface"] = iface
        sniff(**kwargs)
    except Exception as e:
        print(f"[sniffer] {e}")
    finally:
        capturing = False

class Handler(BaseHTTPRequestHandler):
    def _json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Content-Length',str(len(body))); self.end_headers(); self.wfile.write(body)
    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
    def do_OPTIONS(self):
        self.send_response(200); self._cors_headers(); self.end_headers()
    def do_GET(self):
        path = self.path.split('?')[0]
        params = {k:v for k,v in [p.split('=') for p in self.path.split('?')[1].split('&') if '=' in p]} if '?' in self.path else {}
        if path == '/api/packets':
            limit = int(params.get('limit', 50))
            self._json({"total": len(packets), "packets": packets[-limit:]})
        elif path == '/api/flows':
            fl = sorted(flows.values(), key=lambda f: -f["packets"])
            self._json({"total": len(fl), "flows": fl})
        elif path == '/api/status':
            self._json({"capturing": capturing, "packets": len(packets), "flows": len(flows), "port": PORT})
        elif path == '/':
            self.send_response(200); self.send_header('Content-Type','text/html'); self.end_headers()
            self.wfile.write(b'<html><body><h2>Capture Server</h2><a href="/api/status">status</a> | <a href="/api/packets">packets</a> | <a href="/api/flows">flows</a></body></html>')
        else: self._json({"error":"not found", "path": path}, 404)
    def do_POST(self):
        global capturing, cap_thread, packets, flows
        path = self.path.split('?')[0]
        if path == '/api/start':
            if capturing: self._json({"status":"error","msg":"already running"}); return
            ports = [8889, 502, 2404, 4840]
            iface = None
            try:
                body_len = int(self.headers.get('Content-Length', 0))
                if body_len > 0:
                    body = json.loads(self.rfile.read(body_len))
                    if 'ports' in body: ports = body['ports']
                    if 'iface' in body: iface = body['iface']
            except: pass
            packets = []; flows = {}
            capturing = True
            cap_thread = threading.Thread(target=sniffer, args=(ports, iface), daemon=True)
            cap_thread.start()
            self._json({"status":"ok","msg":f"抓包 {ports}","ports":ports})
        elif path == '/api/stop':
            capturing = False
            self._json({"status":"ok","packets":len(packets)})
        elif path == '/api/clear':
            packets.clear(); flows.clear()
            self._json({"status":"ok","msg":"已清空"})
        elif path == '/api/import-pcap':
            body_len = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(body_len))
            file_path = body.get('file', '')
            port = body.get('port', 8889)
            max_pkts = body.get('limit', 500)
            try:
                from scapy.all import PcapReader, Raw, TCP, IP
                reader = PcapReader(file_path)
                stream_bufs = {}
                count = 0
                for pkt in reader:
                    if count >= max_pkts: break
                    if not pkt.haslayer(TCP) or not pkt.haslayer(Raw): continue
                    if pkt[TCP].sport != port and pkt[TCP].dport != port: continue
                    raw = bytes(pkt[Raw].load)
                    if len(raw) < 4: continue
                    src = f"{pkt[IP].src}:{pkt[TCP].sport}"
                    dst = f"{pkt[IP].dst}:{pkt[TCP].dport}"
                    flow_key = f"{src}->{dst}" if pkt[TCP].sport == port else f"{dst}->{src}"
                    direction = 'RX' if pkt[TCP].sport == port else 'TX'
                    # TCP 流重组
                    buf = stream_bufs.get(flow_key, b'') + raw
                    stream_bufs[flow_key] = buf
                    while len(buf) >= 7:
                        mblen = int.from_bytes(buf[4:6], 'big') + 6
                        if mblen > len(buf) or mblen < 7: break
                        frame = buf[:mblen]; buf = buf[mblen:]
                        parsed = parse_mbap_plus(frame)
                        packets.append({"ts": time.time(), "dir": direction, "src": src, "dst": dst,
                            "len": len(frame), "proto": parsed["proto"], "parsed": parsed,
                            "hex": frame[:80].hex(' ') + ('...' if len(frame) > 80 else '')})
                        count += 1
                        if flow_key not in flows:
                            flows[flow_key] = {"src": src, "dst": dst, "packets": 0, "bytes": 0, "proto": "", "first": time.time(), "last": 0}
                        flows[flow_key]["packets"] += 1
                        flows[flow_key]["bytes"] += len(frame)
                        flows[flow_key]["proto"] = flows[flow_key]["proto"] or parsed["proto"]
                        flows[flow_key]["last"] = time.time()
                    stream_bufs[flow_key] = buf
                self._json({"status":"ok","imported":count,"flows":len(flows),"packets":len(packets)})
            except Exception as e:
                self._json({"status":"error","msg":str(e)})
        elif path == '/api/inject':
            content_len = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_len))
            raw = bytes.fromhex(body.get('hex','').replace(' ',''))
            if raw:
                p = parse_mbap_plus(raw)
                packets.append({"ts": time.time(), "dir": body.get('dir','RX'), "src": body.get('src','inject'), "dst": body.get('dst','inject'),
                    "len": len(raw), "proto": p["proto"], "parsed": p, "hex": raw.hex(' ')})
                self._json({"status":"ok","proto":p["proto"]})
            else: self._json({"status":"error","msg":"invalid hex"})
        else: self._json({"error":"not found", "path": path}, 404)
    def log_message(self, *a): pass

if __name__ == '__main__':
    print(f"[capture] 抓包分析服务 :{PORT}")
    HTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
