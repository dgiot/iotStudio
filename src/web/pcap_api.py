"""PCAP 文件读取 API — 用 scapy 解析 pcap/pcapng"""
import os
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/pcap", tags=["pcap"])

PCAP_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "pcap")

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
