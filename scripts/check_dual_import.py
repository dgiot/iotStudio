"""Dual-import registration proof: flat (run.py) and package (CI) paths
are verified in SEPARATE processes - one registry instance per process."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FLAT_PROBE = """
import sys
sys.path.insert(0, "src")
import protocols.a11, protocols.iec104, protocols.modbus_tcp
import plugin_registry as reg
names = sorted(p["name"] for p in reg.list_all("protocol"))
assert {"a11", "iec104", "modbus_tcp"} <= set(names), names
cls = reg.resolve_adapter("modbus_tcp")
assert cls.__name__ == "ModbusTCPAdapter"
print("FLAT OK:", names)
"""

PKG_PROBE = """
import src.protocols.a11, src.protocols.iec104, src.protocols.modbus_tcp
from src import plugin_registry as reg
names = sorted(p["name"] for p in reg.list_all("protocol"))
assert {"a11", "iec104", "modbus_tcp"} <= set(names), names
cls = reg.resolve_adapter("modbus_tcp")
assert cls.__name__ == "ModbusTCPAdapter"
print("PKG OK:", names)
"""

for label, probe in (("flat", FLAT_PROBE), ("package", PKG_PROBE)):
    r = subprocess.run([sys.executable, "-c", probe], cwd=str(ROOT),
                       capture_output=True, text=True)
    tail = (r.stdout or r.stderr).strip().splitlines()[-1:] or ["<no output>"]
    print(f"[{label}] rc={r.returncode} {tail[0]}")
    if r.returncode != 0:
        sys.exit(r.returncode)
print("DUAL-IMPORT-REGISTRATION OK")
