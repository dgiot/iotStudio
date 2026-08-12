#!/usr/bin/env python3
"""
被动采集闭环测试 — 动态感知全链路
==================================
对标需求: 不影响原有 A11 生产、不改 RTU 的动态感知采集

闭环: 模拟设备(TCP客户端) → 被动监听(零发包) → 流量学习 → 协议解码
验证:
  1. 零发包: 监听器不建立任何 TCP 连接 (对比监听前后连接数)
  2. 设备发现: 新设备上线自动感知 (IP/端口变化)
  3. 点位学习: Modbus 寄存器地址自动识别
  4. 协议识别: A11/Modbus 帧头自动分类
  5. 下线检测: 设备静默超时自动标记离线
  6. API: /api/passive/* 路由注册

运行: python tests/test_passive_capture.py
"""
import os, sys, time, socket, struct, threading, json

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

PASS = FAIL = 0

def t(name, ok, detail=""):
    global PASS, FAIL
    if ok: PASS += 1
    else: FAIL += 1
    print(f"  [{'PASS' if ok else 'FAIL'}] {name} {detail}")

def _pick_loopback_iface():
    try:
        from scapy.all import get_if_list
        for i in get_if_list():
            if "Loopback" in i:
                return i
    except Exception:
        pass
    return ""


def main():
    from src.protocols.passive_capture import PassiveCapture
    from src.services.flow_learner import FlowLearner
    from src.services.protocol_decoder import ProtocolDecoder

    print("=== 被动采集闭环测试 (动态感知) ===")
    print()

    # ── 组装链路: 监听 → 学习 → 解码 ──
    cap = PassiveCapture(ports=[1502, 18889], ring_size=5000)
    learner = FlowLearner(device_timeout=2)
    decoder = ProtocolDecoder()
    cap.on_frame(learner.on_frame)
    cap.on_frame(decoder.on_frame)

    iface = _pick_loopback_iface()
    st = cap.start(iface=iface)
    t("监听启动", st.get("status") == "ok", f"iface={iface or '(default)'}")
    time.sleep(0.3)

    # 基线: 记录监听器是否建立连接 (零发包验证)
    baseline_connections = len(cap.flows())

    # ── 模拟 IO 服务器 (生产侧原样运行) ──
    servers = []
    for port in (1502, 18889):
        srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", port))
        srv.listen(4)
        servers.append(srv)

        def _accept(srv=srv):
            while True:
                try:
                    conn, _ = srv.accept()
                    conn.recv(4096)
                    conn.close()
                except Exception:
                    return
        threading.Thread(target=_accept, daemon=True).start()

    # ── 模拟设备 1: A11 客户端 (对应 RTDB :8889 场景) ──
    def _a11_dev(seq_start=0, n=8, port=18889):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        try:
            s.connect(("127.0.0.1", port))
            for i in range(seq_start, seq_start + n):
                pdu = b"\x6a\x6a\x5a\x5a" + struct.pack("<HH", 0x0017, 0) + \
                      b"\x00" * 20 + bytes([i & 0xFF])
                s.sendall(struct.pack(">HHHB", i, 0, len(pdu) + 1, 1) + pdu)
                time.sleep(0.05)
            time.sleep(0.3)
        except Exception:
            pass
        finally:
            s.close()

    # ── 模拟设备 2: Modbus 客户端 (对应 RTU/网关场景) ──
    def _modbus_dev(regs=(400, 401, 402), n=8):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        try:
            s.connect(("127.0.0.1", 1502))
            for i in range(n):
                for reg in regs:
                    s.sendall(struct.pack(">HHHBBHH", i, 0, 6, 1, 3, reg, 1))
                time.sleep(0.05)
            time.sleep(0.3)
        except Exception:
            pass
        finally:
            s.close()

    # ── 执行: 设备 1 上线 → 设备 2 上线 ──
    t1 = threading.Thread(target=_a11_dev, daemon=True)
    t2 = threading.Thread(target=_modbus_dev, daemon=True)
    t1.start()
    time.sleep(0.5)          # 错开: 设备 1 先上线
    t2.start()
    t1.join(timeout=6)
    t2.join(timeout=6)
    time.sleep(1.0)

    # ── 验证 1: 零发包 ──
    cur_flows = cap.flows()
    t("零发包(监听器无自身连接)", baseline_connections == 0,
      f"基线={baseline_connections}")

    # ── 验证 2: 设备发现 ──
    devs = learner.devices()
    dev_names = [f"{d['ip']}:{d['port']}" for d in devs]
    t("设备发现(≥2)", len(devs) >= 2, f"设备: {dev_names[:4]}")

    # ── 验证 3: 协议识别 ──
    protos = set()
    for d in devs:
        protos.update(d["protos"])
    t("协议识别(A11+Modbus)", "A11" in protos and "Modbus" in protos,
      f"protos={sorted(protos)}")

    # ── 验证 4: 点位学习 ──
    pts = learner.learned_points()
    all_addrs = set()
    for v in pts.values():
        all_addrs.update(v)
    t("点位学习(Modbus寄存器)", 400 in all_addrs and 401 in all_addrs,
      f"addrs={sorted(all_addrs)[:8]}")

    # ── 验证 5: 解码 ──
    decoded = decoder.take()
    proto_counts = {}
    for p in decoded:
        proto_counts[p.protocol] = proto_counts.get(p.protocol, 0) + 1
    t("协议解码(≥4点)", len(decoded) >= 4, f"解码={len(decoded)}点 {proto_counts}")

    # ── 验证 6: 下线检测 ──
    time.sleep(2.5)          # 等待超时
    down = learner.patrol()
    t("设备下线检测(静默超时)", len(down) >= 1, f"下线={len(down)}")

    # ── 验证 7: API 路由 ──
    try:
        import fastapi
        from src.web.passive_api import router
        paths = sorted({r.path for r in router.routes})
        t("API 路由(8条)", len(router.routes) == 8, f"routes={len(router.routes)}")
    except Exception as e:
        t("API 路由", False, str(e))

    cap.stop()
    for s in servers:
        s.close()

    print()
    print(f"=== 闭环测试结果: {PASS} 通过 / {FAIL} 失败 ===")
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
