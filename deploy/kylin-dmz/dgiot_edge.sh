#!/bin/bash
# ============================================================
# DG-IoT 边缘中枢 — Kylin DMZ 一键部署启动
# 用法: bash dgiot_edge.sh [start|stop|status|simulate]
# ============================================================
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="${PYTHON:-python3}"
LOG_DIR="$DIR/logs"
mkdir -p "$LOG_DIR"

# 配置 — 按 DMZ 环境调整
export EDGE_PORT=${EDGE_PORT:-9100}
export EDGE_API_PORT=${EDGE_API_PORT:-9101}
export MQTT_HOST=${MQTT_HOST:-127.0.0.1}
export MQTT_PORT=${MQTT_PORT:-1883}
export TDENGINE_HOST=${TDENGINE_HOST:-192.168.10.167}
export TDENGINE_PORT=${TDENGINE_PORT:-6041}
export SIM_SCALE=${SIM_SCALE:-20}

PID_FILE="$DIR/dgiot_edge.pid"

# ═══════════════════════════════════════
start() {
    echo "=== DG-IoT 边缘中枢 — 启动 ==="
    echo "  TCP: :$EDGE_PORT  API: :$EDGE_API_PORT"
    echo "  MQTT: $MQTT_HOST:$MQTT_PORT"
    echo "  TDengine: $TDENGINE_HOST:$TDENGINE_PORT"

    # 检查 Python
    if ! command -v $PYTHON &>/dev/null; then
        echo "ERROR: $PYTHON not found. Install: yum install python3"
        exit 1
    fi

    # 安装依赖 (静默)
    $PYTHON -c "import paho.mqtt.client" 2>/dev/null || {
        echo "Installing paho-mqtt..."
        $PYTHON -m pip install paho-mqtt --quiet 2>/dev/null || true
    }

    # 启动边缘中枢核心
    nohup $PYTHON "$DIR/edge_hub_kylin.py" \
        --tcp-port $EDGE_PORT \
        --api-port $EDGE_API_PORT \
        --mqtt-host $MQTT_HOST \
        --mqtt-port $MQTT_PORT \
        >> "$LOG_DIR/edge_hub.log" 2>&1 &

    echo $! > "$PID_FILE"
    sleep 2

    if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "  Edge Hub PID: $(cat $PID_FILE)"
        echo "  API: http://localhost:$EDGE_API_PORT/api/hub/health"
        echo "  日志: $LOG_DIR/edge_hub.log"
    else
        echo "  ERROR: 启动失败, 查看日志"
        cat "$LOG_DIR/edge_hub.log" 2>/dev/null | tail -10
        exit 1
    fi
}

stop() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 $PID 2>/dev/null; then
            kill $PID && echo "Stopped PID $PID"
        fi
        rm -f "$PID_FILE"
    fi
    # 清理残留
    pkill -f "edge_hub_kylin.py" 2>/dev/null || true
}

status() {
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "Edge Hub: RUNNING (PID $(cat $PID_FILE))"
        curl -s "http://localhost:$EDGE_API_PORT/api/hub/health" 2>/dev/null || echo "  API: unreachable"
    else
        echo "Edge Hub: STOPPED"
    fi
}

simulate() {
    echo "=== 启动模拟设备 ($SIM_SCALE 台) ==="
    nohup $PYTHON "$DIR/simulate_devices.py" \
        --count $SIM_SCALE \
        --api "http://127.0.0.1:$EDGE_API_PORT" \
        >> "$LOG_DIR/simulator.log" 2>&1 &
    echo "  Simulator PID: $!"
    echo "  日志: $LOG_DIR/simulator.log"
}

case "${1:-start}" in
    start)    start ;;
    stop)     stop ;;
    restart)  stop; sleep 1; start ;;
    status)   status ;;
    simulate) simulate ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|simulate}"
        exit 1
        ;;
esac
