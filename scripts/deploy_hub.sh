#!/bin/bash
# ============================================================================
# DG-IoT Hub - minimal one-click deploy for openEuler / Kylin (LF, ASCII only)
# Reference: gitee.com/dgaiot/dgaiot dgiot_single_deploy.sh (simplified)
#
# Philosophy: install ONLY what is necessary.
#   - NO docker required (native build)
#   - NO repo clobbering (never touches /etc/yum.repos.d)
#   - NO optional stack (ollama/milvus/dify/parse-server/redis/report/n2n/wifi)
#   - REUSES existing TDengine(6030/6041) and PostgreSQL if present
#   - IDEMPOTENT: re-running skips completed steps
# Ports used by hub: 1883/8883(tcp-mqtt) 8083/8084(ws) 18083(dashboard)
# ============================================================================
set -uo pipefail

TAG="${TAG:-v4.9.3}"
SRC="${SRC:-/opt/dgiot-4.4}"
DEST="${DEST:-/data/dgiot}"
LOG=/root/dgiot-deploy.log
GITEE_MIRROR="https://gitee.com/fastdgiot"

GREEN='\033[1;32m'; YELLOW='\033[33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[skip]${NC} $*"; }
die()  { echo -e "${RED}[fail]${NC} $*"; exit 1; }
log()  { echo "[$(date +%F_%T)] $*" >> "$LOG"; }

# ---------------------------------------------------------------- [1/7] env
detect_env() {
  [ "$(id -u)" = "0" ] || die "run as root"
  . /etc/os-release 2>/dev/null
  say "system: ${NAME:-unknown} ${VERSION_ID:-} $(uname -m)"
  # port pre-flight: conflict with EXISTING services is fatal before build
  RUNNING_DIR=""
  for p in 1883 8083 8084 18083; do
    if ss -tln 2>/dev/null | grep -q ":$p "; then
      pid=$(ss -tlnp 2>/dev/null | grep ":$p " | grep -oE 'pid=[0-9]+' | head -1 | cut -d= -f2)
      if [ -n "$pid" ] && readlink "/proc/$pid/exe" 2>/dev/null | grep -q beam; then
        RUNNING_DIR=$(readlink "/proc/$pid/cwd" 2>/dev/null)
        warn "port $p served by a running dgiot hub (beam pid $pid, cwd $RUNNING_DIR)"
      else
        die "port $p already in use by another service - resolve conflict first"
      fi
    fi
  done
}

# ---------------------------------------------------------------- [2/7] deps
install_deps() {
  local need=""
  for t in git gcc make cmake; do command -v $t >/dev/null || need="$need $t"; done
  if [ -n "$need" ]; then
    say "installing toolchain:$need"
    if command -v dnf >/dev/null; then dnf install -y $need >>"$LOG" 2>&1
    elif command -v yum >/dev/null; then yum install -y $need >>"$LOG" 2>&1
    else die "no dnf/yum and missing:$need"; fi
  fi
  if ! command -v erl >/dev/null; then
    say "installing erlang"
    if command -v dnf >/dev/null; then dnf install -y erlang >>"$LOG" 2>&1
    elif command -v yum >/dev/null; then yum install -y erlang >>"$LOG" 2>&1
    else die "erlang missing and no package manager"; fi
  fi
  OTPV=$(erl -noshell -eval 'io:format("~s",[erlang:system_info(otp_release)]),halt().' 2>/dev/null)
  say "erlang OTP $OTPV (hub tested on OTP24; OTP25+ needs script adjustments)"
}

# ---------------------------------------------------------------- [3/7] source
fetch_source() {
  if [ -d "$SRC/.git" ]; then warn "source exists at $SRC"; return; fi
  say "cloning dgiiot/dgiot $TAG"
  git clone --depth 1 --branch "$TAG" https://gitee.com/dgiiot/dgiot.git "$SRC" >>"$LOG" 2>&1 \
    || die "clone failed (gitee reachable?)"
}

# ---------------------------------------------------------------- [4/7] patches
apply_patches() {
  cd "$SRC" || die "no source dir"
  # 4a. transitive deps pinned to github: rewrite to fastdgiot gitee mirrors
  for org in emqx ninenines erlef extend g-andrade garret-smith kafka4beam kellymclaughlin maxmind uwiger; do
    git config --global url."$GITEE_MIRROR/".insteadOf "https://github.com/$org/" 2>/dev/null
  done
  # 4b. tag/version header sync (team tags ahead of header)
  local tagv="${TAG#v}"
  if [ -f include/emqx_release.hrl ] && ! grep -q "$tagv" include/emqx_release.hrl; then
    sed -i "s/{opensource, \"[^\"]*\"}/{opensource, \"$tagv\"}/" include/emqx_release.hrl
    say "version header synced to $tagv"
  fi
  # 4c. strip enterprise plugins (open-source build must not require them)
  sed -i '/{enable_plugin_dgiot_uav, true}/d; /^[ ,]*dgiot_uav\s*$/d' rebar.config.erl 2>/dev/null
  sed -i '/{dgiot_uav,/d' data/loaded_plugins.tmpl 2>/dev/null
  # 4d. rebar3 pinned for OTP24, fetched from gitee
  export OTP_VSN=24
  if [ ! -x ./rebar3 ]; then bash scripts/ensure-rebar3.sh >>"$LOG" 2>&1 || die "rebar3 fetch failed"; fi
  say "patches applied (github->gitee rewrite / version sync / enterprise stripped)"
}

# ---------------------------------------------------------------- [5/7] build
build_hub() {
  cd "$SRC"
  if ls _build/emqx/rel/emqx/bin/emqx >/dev/null 2>&1; then warn "release already built"; return; fi
  say "building (deps grind + make, 15-40 min; log: $LOG)"
  local rc=1 i
  for i in $(seq 1 15); do
    timeout 300 ./rebar3 get-deps >>"$LOG" 2>&1 && break
    log "get-deps pass $i failed, retry"
    sleep 10
  done
  for i in $(seq 1 5); do
    echo "=== MAKE $i ===" >> "$LOG"
    timeout 3600 make >>"$LOG" 2>&1 && { rc=0; break; }
    log "make pass $i failed, retry"
    sleep 10
  done
  [ $rc -eq 0 ] || die "build failed - see $LOG"
  say "build done"
}

# ---------------------------------------------------------------- [6/7] install
install_release() {
  if [ -x "$DEST/bin/emqx" ]; then warn "release installed at $DEST"; return; fi
  say "installing release to $DEST"
  mkdir -p "$DEST"
  cp -a "$SRC/_build/emqx/rel/emqx/." "$DEST/"
  # systemd if available (real machines); nohup fallback (WSL without systemd)
  if command -v systemctl >/dev/null && systemctl is-system-running >/dev/null 2>&1; then
    cat > /etc/systemd/system/dgiot.service <<EOF
[Unit]
Description=DG-IoT hub (emqx ${TAG})
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
Environment=HOME=$DEST
ExecStart=/bin/sh $DEST/bin/emqx start
ExecStop=/bin/sh $DEST/bin/emqx stop
Restart=always
StartLimitBurst=3
StartLimitIntervalSec=60

[Install]
WantedBy=multi-user.target
EOF
    systemctl daemon-reload && systemctl enable dgiot >>"$LOG" 2>&1
    say "systemd unit installed (dgiot.service)"
  else
    say "no systemd (WSL?) - use: nohup $DEST/bin/emqx start"
  fi
}

# ---------------------------------------------------------------- [7/7] start
start_verify() {
  if "$DEST/bin/emqx" ping >/dev/null 2>&1; then warn "hub already running (from $DEST)"
  elif [ -n "${RUNNING_DIR:-}" ] && "$RUNNING_DIR/bin/emqx" ping >/dev/null 2>&1; then
    warn "hub already running from $RUNNING_DIR (install-only mode)"
  else
    say "starting hub"
    (cd "$DEST" && HOME="$DEST" ./bin/emqx start >>"$LOG" 2>&1) || die "start failed"
    sleep 10
  fi
  "$DEST/bin/emqx" ping >/dev/null 2>&1 || die "hub not responding"
  say "hub is UP (ping=pong)"
  ss -tln 2>/dev/null | grep -oE ':(1883|8883|8083|8084|18083) ' | sort -u | tr -d ' :' \
    | while read -r p; do say "  listening: $p"; done
  echo "=================================================="
  echo " DG-IoT hub deployed:  MQTT tcp://$(hostname -I | awk '{print $1}'):1883"
  echo " dashboard:            http://$(hostname -I | awk '{print $1}'):18083"
  echo " verify from edge:     python hub_smoke.py  (iotStudio/scripts)"
  echo "=================================================="
}

detect_env
install_deps
fetch_source
apply_patches
build_hub
install_release
start_verify
