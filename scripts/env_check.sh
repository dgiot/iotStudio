#!/usr/bin/env bash
# env_check.sh -- does THIS environment match the fact standard (requirements.lock)?
#
# Why: requirements.txt pins nothing (25 lines, all ">="), so two machines installed on
# different days silently diverge (tonight: starlette/httpx drift turned 8 endpoint tests
# into TypeError). This script fails fast instead of producing misleading red tests.
#
# usage: env_check.sh [path-to-requirements.lock] [path-to-python]
# exit : 0 = matches, 3 = drift detected, 2 = cannot check
#
# 2026-10-05 (REQ-DEV-004 · DEV-B/166 入库版)：把两处**机器相关**的默认值改成可移植的 ——
#   LOCK 默认 → 仓库根下的 requirements.lock（按脚本自身位置推导）
#   PY   默认 → 仓库 .venv/bin/python（存在时），否则 python3
# 其余逻辑与原版本逐字一致（142 用 coord/env_check.sh 复跑过 drift 0 ✓）。
set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCK="${1:-$REPO_ROOT/requirements.lock}"
PY="${2:-}"
[ -z "$PY" ] && { if [ -x "$REPO_ROOT/.venv/bin/python" ]; then PY="$REPO_ROOT/.venv/bin/python"; else PY=python3; fi; }
[ -r "$LOCK" ] || { echo "env_check: lock not readable: $LOCK"; exit 2; }

echo "env_check"
echo "  lock : $LOCK"
echo "  interp: $PY ($($PY -V 2>&1))"
echo "  host : $(hostname) ($(uname -sr))"

# python version recorded in the lock header must match
WANT_PY=$(grep -oE 'Python [0-9]+\.[0-9]+\.[0-9]+' "$LOCK" | head -1 | awk '{print $2}')
GOT_PY=$($PY -c 'import sys;print("%d.%d.%d"%sys.version_info[:3])' 2>/dev/null)
if [ -n "$WANT_PY" ] && [ "$WANT_PY" != "$GOT_PY" ]; then
  echo "  [DRIFT] python: want $WANT_PY got $GOT_PY"
  PY_BAD=1
else
  echo "  [OK]    python: $GOT_PY"
  PY_BAD=0
fi

# every pinned package in the lock must be present at the same version
bad=0; checked=0; missing=0
while IFS= read -r line; do
  case "$line" in ''|\#*) continue;; esac
  name="${line%%==*}"; want="${line##*==}"
  want="${want%%;*}"                     # strip markers
  got=$("$PY" - "$name" <<'PY' 2>/dev/null
import importlib.metadata as md, sys
try:
    print(md.version(sys.argv[1]))
except Exception:
    print("")
PY
)
  checked=$((checked+1))
  if [ -z "$got" ]; then
    missing=$((missing+1)); echo "  [MISS]  $name (want $want)"
  elif [ "$got" != "$want" ]; then
    bad=$((bad+1)); echo "  [DRIFT] $name: want $want got $got"
  fi
done < "$LOCK"

echo "  checked=$checked  drift=$bad  missing=$missing"
if [ "$bad" -gt 0 ] || [ "$missing" -gt 0 ] || [ "$PY_BAD" -gt 0 ]; then
  echo "  => ENVIRONMENT DOES NOT MATCH THE LOCK -- fix before trusting any test result"
  echo "     remedy: (in a fresh venv)  pip install -r $LOCK"
  exit 3
fi
echo "  => MATCHES the fact standard"
exit 0
