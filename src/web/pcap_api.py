"""PCAP 文件读取 API — 用 scapy 解析 pcap/pcapng"""
import os, tempfile
from fastapi import APIRouter, Query, UploadFile, File

router = APIRouter(prefix="/api/pcap", tags=["pcap"])

PCAP_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "pcap")

@router.post("/upload")
async def upload_pcap(file: UploadFile = File(...), limit: int = Query(200)):
    """上传 pcap 文件并解析"""
    try:
        from scapy.all import rdpcap, IP, TCP, UDP, Raw
        from scapy.utils import PcapReader
    except ImportError:
        return {"error": "scapy not installed"}

    # Save uploaded file to temp
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pcapng")
    tmp.write(await file.read())
    tmp.close()

    packets = []
    count = 0
    try:
        for pkt in PcapReader(tmp.name):
            if count >= limit: break
            info = {"id": count + 1, "sz": len(pkt), "hex": "", "dir": "RX", "msg": "RAW", "proto": "TCP"}
            if IP in pkt:
                info["src"] = pkt[IP].src
                info["dst"] = pkt[IP].dst
                info["time"] = f"{pkt.time:.6f}" if hasattr(pkt, 'time') else ""
                if TCP in pkt:
                    info["src"] = f"{info['src']}:{pkt[TCP].sport}"
                    info["dst"] = f"{info['dst']}:{pkt[TCP].dport}"
                    payload = bytes(pkt[TCP].payload)
                    if payload:
                        info["sz"] = len(payload)
                        info["hex"] = payload[:200].hex()
                        if payload[:2] == b'\x5a\x5a':
                            info["msg"] = f"0x{int.from_bytes(payload[8:10],'little'):04X}" if len(payload)>=10 else "A11"
                            info["proto"] = "A11"
                            info["info"] = "A11帧"
                        elif len(payload)>=8 and payload[2:4]==b'\x00\x00' and payload[7] in (1,2,3,4,5,6,15,16):
                            fcs = {1:'读线圈',3:'读保持寄存器',4:'读输入寄存器',6:'写单寄存',16:'写多寄存'}
                            info["msg"] = "Modbus"
                            info["proto"] = "Modbus"
                            info["info"] = fcs.get(payload[7], f'FC{payload[7]}')
                        elif payload[0]==0x05 and len(payload)>=12:
                            info["msg"] = "OPC-DA"
                            info["proto"] = "OPC-DA"
                            info["info"] = "DCE/RPC请求"
                elif UDP in pkt:
                    info["src"] = f"{info['src']}:{pkt[UDP].sport}"
                    info["dst"] = f"{info['dst']}:{pkt[UDP].dport}"
                    info["msg"] = "UDP"
                    info["proto"] = "UDP"
                if '11.66.12.131' in str(info.get('src','')):
                    info["dir"] = "TX"
            packets.append(info)
            count += 1
    except Exception as e:
        return {"error": str(e), "packets": packets, "total": count}
    finally:
        try: os.unlink(tmp.name)
        except: pass

    return {"filename": file.filename, "packets": packets, "total": count}

@router.get("/list")
def list_pcaps():
    """列出可用的 pcap 文件"""
    os.makedirs(PCAP_DIR, exist_ok=True)
    files = []
    for f in sorted(os.listdir(PCAP_DIR)):
        if f.endswith(('.pcap', '.pcapng', '.cap')):
            fp = os.path.join(PCAP_DIR, f)
            files.append({"name": f, "size_mb": round(os.path.getsize(fp) / (1024*1024), 1)})
    return {"files": files}

@router.get("/read/{filename}")
def read_pcap(filename: str, skip: int = Query(0), limit: int = Query(50)):
    """读取 pcap 文件, 返回解析后的报文列表"""
    fp = os.path.join(PCAP_DIR, filename)
    if not os.path.exists(fp):
        return {"error": "File not found", "filename": filename}

    try:
        from scapy.all import rdpcap, IP, TCP, UDP, Raw
        from scapy.utils import PcapReader
    except ImportError:
        return {"error": "scapy not installed", "filename": filename}

    packets = []
    count = 0
    try:
        for pkt in PcapReader(fp):
            if count < skip:
                count += 1; continue
            if count >= skip + limit:
                break

            info = {"id": count + 1, "sz": len(pkt), "hex": "", "dir": "RX", "msg": "RAW"}
            if IP in pkt:
                info["src"] = pkt[IP].src
                info["dst"] = pkt[IP].dst
                info["len"] = pkt[IP].len
                # Determine direction: 131 is our capture point
                if '11.66.12.131' in str(pkt[IP].src):
                    info["dir"] = "TX"
                elif '11.66.12.130' in str(pkt[IP].dst):
                    info["dir"] = "TX"
                elif info["src"].startswith('11.') or info["src"].startswith('172.'):
                    info["dir"] = "RX"

            # Extract payload and classify protocol
            payload = bytes(pkt)
            info["hex"] = payload.hex()[:200]
            if TCP in pkt:
                sport = pkt[TCP].sport
                dport = pkt[TCP].dport
                info["src"] = f"{info['src']}:{sport}"
                info["dst"] = f"{info['dst']}:{dport}"
                tcp_payload = bytes(pkt[TCP].payload)
                if tcp_payload:
                    # A11: 5a5a magic
                    if tcp_payload[:2] == b'\x5a\x5a' and len(tcp_payload) >= 6:
                        flen = int.from_bytes(tcp_payload[2:4], 'little')
                        mtype = int.from_bytes(tcp_payload[8:10], 'little') if len(tcp_payload) >= 10 else 0
                        info["msg"] = f"0x{mtype:04X}"
                        info["proto"] = "A11"
                        info["hex"] = tcp_payload[:200].hex()
                    # Modbus: MBAP header
                    elif len(tcp_payload) >= 8 and tcp_payload[2:4] == b'\x00\x00':
                        info["msg"] = "Modbus"
                        info["proto"] = "Modbus"
                        info["hex"] = tcp_payload[:80].hex()
                    # OPC-DA: DCE/RPC
                    elif tcp_payload[0] == 0x05 and len(tcp_payload) >= 12:
                        info["msg"] = "OPC-DA"
                        info["proto"] = "OPC-DA"
                        info["hex"] = tcp_payload[:200].hex()
                    else:
                        info["msg"] = "TCP"
                        info["hex"] = tcp_payload[:100].hex()
                else:
                    info["msg"] = "TCP"
                info["sz"] = len(tcp_payload) if tcp_payload else len(pkt)
            elif UDP in pkt:
                info["msg"] = "UDP"
            info["dir"] = info.get("dir", "RX")

            packets.append(info)
            count += 1

    except Exception as e:
        return {"error": str(e), "filename": filename, "packets": packets, "total": count}

    return {"filename": filename, "packets": packets, "total": count, "skip": skip, "limit": limit}
