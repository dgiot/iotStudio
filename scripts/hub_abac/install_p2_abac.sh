#!/bin/bash
# ============================================================================
# P2 ABAC installer - one-shot, idempotent (WSL openEuler, lab hub)
# Installs the PDP-backed ACL face:
#   1. copy dgiot_pdp_acl.erl into dgiot_dlink source + patch the ACL tail
#   2. rebar compile, copy beams into the RUNNING release, restart broker
#   3. seed ABAC policies + start the PDP server (setsid, loopback :8383)
# ============================================================================
set -e
SRC=/opt/dgiot-4.4
DEST=/data/dgiot
ASSETS=/mnt/d/ai/github/iotStudio/scripts/hub_abac

echo "== [1/5] install Erlang PDP face =="
cp "$ASSETS/dgiot_pdp_acl.erl" "$SRC/apps/dgiot_dlink/src/proctol/dgiot_pdp_acl.erl"
python3 - "$SRC/apps/dgiot_dlink/src/proctol/dgiot_mqtt_acl.erl" <<'EOF'
import sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
old = "check_acl(_ClientInfo, _PubSub, _Topic, _NoMatchAction, _Params) ->\n    ok."
new = ("check_acl(ClientInfo, PubSub, Topic, _NoMatchAction, _Params) ->\n"
       "    %% P2 ABAC: doctrine dgiot/ namespace -> attribute PDP (hot-reload)\n"
       "    dgiot_pdp_acl:check(PubSub, Topic, ClientInfo).")
if new in s:
    print("   patch already applied")
elif old in s:
    open(p, "w", encoding="utf-8").write(s.replace(old, new, 1))
    print("   patched dgiot_mqtt_acl tail clause")
else:
    print("   WARNING: tail clause not found - inspect manually")
EOF

echo "== [2/5] compile dgiot_dlink =="
cd "$SRC"
./rebar3 as emqx compile 2>&1 | tail -2
BB=_build/emqx/lib/dgiot_dlink/ebin
ls "$BB/dgiot_pdp_acl.beam" "$BB/dgiot_mqtt_acl.beam" >/dev/null || { echo "beams missing"; exit 1; }

echo "== [3/5] install beams into running release =="
EBIN=$(ls -d "$DEST"/lib/dgiot_dlink-*/ebin | head -1)
cp "$BB/dgiot_pdp_acl.beam" "$BB/dgiot_mqtt_acl.beam" "$EBIN/"
echo "   beams -> $EBIN"

echo "== [4/5] restart broker (one-time code install; policy changes never need this) =="
"$DEST/bin/emqx" stop >/dev/null 2>&1 || true
sleep 3
(cd "$DEST" && HOME="$DEST" ./bin/emqx start >> "$DEST/log/pdp_install.log" 2>&1)
sleep 8
"$DEST/bin/emqx" ping | grep -q pong || { echo "hub ping failed"; exit 1; }
echo "   hub ping=pong"

echo "== [5/5] seed policies + start PDP (setsid, loopback :8383) =="
mkdir -p "$DEST/data" "$DEST/log"
cp "$ASSETS/abac_policies.seed.json" "$DEST/data/abac_policies.json"
if ss -tln | grep -q ':8383 '; then
  echo "   PDP already running"
else
  ABAC_POLICIES_PATH="$DEST/data/abac_policies.json" \
    setsid nohup python3 /mnt/d/ai/github/iotStudio/scripts/abac_pdp.py \
    >> "$DEST/log/pdp.log" 2>&1 < /dev/null &
  sleep 3
fi
timeout 4 curl -4 -s -o /dev/null -w "   PDP health: %{http_code}\n" http://127.0.0.1:8383/health
ss -tln | grep -q ':8383 ' && echo "   PDP UP (:8383)" || { echo "   PDP DOWN"; exit 1; }
echo "== P2 ABAC face installed =="
