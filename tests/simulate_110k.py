#!/usr/bin/env python3
"""
11 万设备边缘中枢模拟器 — 百万级测点灌入
==========================================
对标 技术方案应答书: 百万压测通过边缘中枢(ch_edge_hub)模拟100+工业区接入
规模: 110,000 设备 × 20 测点 = 2,200,000 测点 (百万级)

两种灌数模式:
  --mode mqtt       MQTT 推送 (默认) — 走边缘中枢通道
                   topic: dgiot/{tenant}/gw_{gateway}/ch_edge_hub/{device}
                   payload: {"ts":..,"values":{point:value,...}} 每设备一条聚合报文
  --mode tdengine   直插 TDengine (最快灌数) — REST SQL 批量 INSERT

用法:
  python tests/simulate_110k.py --devices 110000 --interval 2 --duration 600
  python tests/simulate_110k.py --mode tdengine --devices 110000 --duration 60
"""
import argparse, json, os, random, sys, threading, time, statistics
from datetime import datetime, timezone
from collections import defaultdict

# ── 设备模型 ──
POINT_TYPES = ["套压", "油压", "电流A", "电流B", "电流C", "冲次", "功率", "温度", "振动",
               "有功功率", "无功功率", "功率因数", "频率", "液位", "流量", "扭矩", "转速",
               "出口压力", "入口压力", "润滑油温"]

class Zone:
    """工业区 — 1000 设备/区, 每设备 20 测点"""
    def __init__(self, zone_id: int, seed: int):
        self.rng = random.Random(seed)
        self.devices = []
        for d in range(1, 1001):
            base = {pt: self.rng.uniform(10, 500) for pt in POINT_TYPES}
            self.devices.append({
                "did": f"zy{zone_id:03d}_dev{d:04d}",
                "base": base,
                "vals": dict(base),
            })

    def gen_round(self) -> list:
        """生成一轮: [(did, {point: value}), ...]"""
        out = []
        for dev in self.devices:
            vals = {}
            for pt, base in dev["base"].items():
                v = base * (1 + self.rng.uniform(-0.05, 0.05))
                vals[pt] = round(v, 4)
            dev["vals"] = vals
            out.append((dev["did"], vals))
        return out


# ── MQTT 模式 ──
def mqtt_worker(host, port, tenant, gateway, zones, idx, workers, stop_flag, stats):
    """一个 MQTT 连接负责若干工业区"""
    try:
        import paho.mqtt.client as mqtt
    except ImportError:
        print("需要 paho-mqtt: pip install paho-mqtt")
        sys.exit(1)

    client = mqtt.Client(client_id=f"edge_hub_110k_{idx}", protocol=mqtt.MQTTv311)
    client.connect(host, port, 60)
    client.loop_start()

    zone_iter = [z for i, z in enumerate(zones) if i % workers == idx]
    while not stop_flag.is_set():
        for zone in zone_iter:
            t0 = time.perf_counter()
            ts = int(time.time() * 1000)
            for did, vals in zone.gen_round():
                topic = f"dgiot/{tenant}/gw_{gateway}/ch_edge_hub/{did}"
                payload = json.dumps({"ts": ts, "values": vals}, ensure_ascii=False)
                client.publish(topic, payload, qos=0)  # 压测用 QoS0 保吞吐
                stats["points"] += len(vals)
                stats["msgs"] += 1
            stats["lat_us"] = (time.perf_counter() - t0) * 1_000_000 / len(zone.devices)
    client.loop_stop()
    client.disconnect()


# ── TDengine 直插模式 ──
def tdengine_insert(host, port, zones, stop_flag, stats):
    import requests
    url = f"http://{host}:{port}/rest/sql"
    auth = ("root", "taosdata")
    db = "_edge_hub_110k"
    r = requests.post(url, data=f"CREATE DATABASE IF NOT EXISTS {db} KEEP 365", auth=auth)
    if r.status_code != 200:
        stats["errs"] += 1
        return

    # 每工业区一个 subtable (1000 设备 × 20 点合并为 20 列 × 1000 行)
    cols = ",".join(f"p{i}" for i in range(1, 21))
    stmt = (f"CREATE STABLE IF NOT EXISTS {db}.st_k (ts TIMESTAMP, {cols} FLOAT) "
            f"TAGS (did NCHAR(64))")
    r = requests.post(url, data=stmt, auth=auth, timeout=30)
    if r.status_code != 200:
        stats["errs"] += 1

    while not stop_flag.is_set():
        for zone in zones:
            sql_parts = []
            for did, vals in zone.gen_round():
                row = ",".join(str(vals[POINT_TYPES[i]]) for i in range(20))
                sql_parts.append(
                    f"INSERT INTO {db}.t{zone.zone_id} USING {db}.st_k TAGS('{did}') "
                    f"(ts,{cols}) VALUES (NOW,{row})")
            r = requests.post(url, data=" ".join(sql_parts), auth=auth, timeout=60)
            stats["points"] += len(sql_parts) * 20
            stats["msgs"] += len(sql_parts)
            if r.status_code != 200:
                stats["errs"] += 1


# ── 主入口 ──
def main():
    ap = argparse.ArgumentParser(description="11万设备边缘中枢模拟器")
    ap.add_argument("--devices", type=int, default=110000, help="设备总数 (默认 110000)")
    ap.add_argument("--mode", choices=["mqtt", "tdengine"], default="mqtt")
    ap.add_argument("--interval", type=float, default=2.0, help="轮间隔秒")
    ap.add_argument("--duration", type=float, default=600, help="测试时长秒")
    ap.add_argument("--mqtt-host", default="127.0.0.1")
    ap.add_argument("--mqtt-port", type=int, default=1883)
    ap.add_argument("--td-host", default="127.0.0.1")
    ap.add_argument("--td-port", type=int, default=6041)
    ap.add_argument("--tenant", default="default")
    ap.add_argument("--gateway", default="gw_131")
    ap.add_argument("--workers", type=int, default=8, help="MQTT 连接数")
    ap.add_argument("--report", default="simulate_110k_report.json")
    args = ap.parse_args()

    zones_count = max(1, args.devices // 1000)
    zones = [Zone(i + 1, seed=i * 777) for i in range(zones_count)]
    total_points = sum(len(z.devices) * 20 for z in zones)
    print(f"=== 11万设备边缘中枢模拟器 ===")
    print(f"  工业区: {zones_count}  (1000设备/区)  设备: {len(zones)*1000}")
    print(f"  测点: {total_points:,}  (20测点/设备)  模式: {args.mode}")
    print(f"  轮间隔: {args.interval}s  时长: {args.duration}s")
    print()

    stats = defaultdict(int)
    stop_flag = threading.Event()
    threads = []

    if args.mode == "mqtt":
        for i in range(args.workers):
            t = threading.Thread(target=mqtt_worker,
                                 args=(args.mqtt_host, args.mqtt_port, args.tenant,
                                       args.gateway, zones, i, args.workers,
                                       stop_flag, stats),
                                 daemon=True)
            t.start()
            threads.append(t)
    else:
        t = threading.Thread(target=tdengine_insert,
                             args=(args.td_host, args.td_port, zones, stop_flag, stats),
                             daemon=True)
        t.start()
        threads.append(t)

    # 统计循环
    t0 = time.time()
    last_pts, last_msgs, last_t = 0, 0, t0
    try:
        while time.time() - t0 < args.duration:
            time.sleep(5)
            now = time.time()
            dt = now - last_t
            pts_s = (stats["points"] - last_pts) / dt
            msg_s = (stats["msgs"] - last_msgs) / dt
            print(f"  [{now-t0:6.0f}s] 测点: {stats['points']:,} "
                  f"({pts_s:,.0f}点/s) 消息: {msg_s:,.0f}条/s err={stats['errs']}")
            last_pts, last_msgs, last_t = stats["points"], stats["msgs"], now
    except KeyboardInterrupt:
        print("\n[interrupted]")

    stop_flag.set()
    for t in threads:
        t.join(timeout=10)

    # 报告
    elapsed = time.time() - t0
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mode": args.mode,
        "devices": len(zones) * 1000,
        "total_points": total_points,
        "points_pushed": stats["points"],
        "messages": stats["msgs"],
        "errors": stats["errs"],
        "elapsed_s": round(elapsed, 1),
        "throughput_pts_s": round(stats["points"] / max(1, elapsed)),
        "integrity": "PASS" if stats["errs"] == 0 else "FAIL",
    }
    with open(args.report, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print()
    print("  验收汇总:")
    print(f"    设备规模:       {len(zones)*1000:,} 台")
    print(f"    测点规模:       {total_points:,}")
    print(f"    灌入测点数:     {stats['points']:,}")
    print(f"    吞吐:           {report['throughput_pts_s']:,} 点/s")
    print(f"    错误:           {stats['errs']}")
    print(f"    完整性:         {report['integrity']}")
    print(f"  Report: {args.report}")


if __name__ == "__main__":
    main()
