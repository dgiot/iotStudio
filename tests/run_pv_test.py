"""Wrapper to run PV closed-loop test."""
import subprocess, sys, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)

SVN_DIR = os.path.join(os.path.dirname(PROJECT_DIR), "svn_work")
TEST_SCRIPT = os.path.join(SVN_DIR, "项目投标", "汇川", "03_技术方案", "04-模拟环境", "pv_closed_loop.py")

result = subprocess.run(
    [sys.executable, "-X", "utf8", TEST_SCRIPT],
    capture_output=True, timeout=60,
    cwd=os.path.dirname(TEST_SCRIPT)
)
stdout = result.stdout.decode("utf-8", errors="replace")
stderr = result.stderr.decode("utf-8", errors="replace")

# Write to file to avoid console encoding issues
result_file = os.path.join(SCRIPT_DIR, "pv_result.txt")
with open(result_file, "w", encoding="utf-8") as f:
    f.write(stdout)
    if stderr:
        f.write("\n\n=== STDERR ===\n")
        f.write(stderr)
    f.write(f"\n\nEXIT CODE: {result.returncode}")

# Print summary line only
lines = stdout.strip().splitlines()
for line in lines[-10:]:
    # Strip emojis for console
    safe = line.encode("ascii", errors="replace").decode("ascii")
    print(safe)
print(f"EXIT: {result.returncode}")
print(f"Full output: {result_file}")
