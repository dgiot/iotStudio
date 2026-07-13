"""
embedded_pg.py — 嵌入式 PostgreSQL 管理器
==========================================
策略:
  1. 检测本地 PG 是否已运行 (Linux system PG / WSL PG / 其他)
  2. 已运行 → 直接连接
  3. 未运行 → 尝试启动嵌入式 PG (initdb + pg_ctl)
  4. 都没有 → 返回 None，调用方 fallback SQLite

用法:
  mgr = EmbeddedPG()
  dsn = mgr.ensure()       # → "postgresql://user:pass@host:port/db" or None
  mgr.stop()               # 仅停止嵌入式实例，不碰外部 PG
"""
import os, sys, subprocess, socket, logging, time, shutil
from pathlib import Path
from typing import Optional

log = logging.getLogger("embedded_pg")

PG_DEFAULT_PORTS = [15432]  # 独立端口, 不影响原生 PG :5432 和 parse-server :7432
PG_DATA = Path(os.path.join(os.path.dirname(__file__), "..", "data", "pgdata"))
PG_PORT = 15432
PG_DB = "parse"
PG_USER = "dgiot"
PG_PASS = "dgiot123"


def _tcp_ping(host: str, port: int, timeout: float = 1.0) -> bool:
    """TCP 探活 — PG 端口是否可达"""
    try:
        s = socket.create_connection((host, port), timeout=timeout)
        s.close()
        return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False


def _find_pg_ctl() -> Optional[str]:
    """查找 pg_ctl 二进制"""
    # 常见路径
    candidates = [
        "/usr/bin/pg_ctl",                          # Linux system
        "/usr/local/pgsql/bin/pg_ctl",              # Custom install
        "/usr/lib/postgresql/*/bin/pg_ctl",         # Debian/Ubuntu
        "C:\\Program Files\\PostgreSQL\\*\\bin\\pg_ctl.exe",  # Windows
        shutil.which("pg_ctl") or "",
    ]
    for c in candidates:
        if "*" in c:
            # glob expansion
            import glob as g
            matches = sorted(g.glob(c))
            if matches:
                return matches[0]
        elif c and os.path.exists(c):
            return c
    return None


class EmbeddedPG:
    """嵌入式 PostgreSQL 管理器"""

    def __init__(self, host: str = "127.0.0.1", port: int = PG_PORT,
                 db: str = PG_DB, user: str = PG_USER, password: str = PG_PASS):
        self.host = host
        self.port = port
        self.db = db
        self.user = user
        self.password = password
        self._proc: Optional[subprocess.Popen] = None
        self._managed = False        # 是否由我们启动的（关闭时需要 stop）
        self._dsn: Optional[str] = None

    @property
    def dsn(self) -> Optional[str]:
        return self._dsn

    def ensure(self) -> Optional[str]:
        """确保 PG 可用，返回 DSN 或 None"""

        # 1. 检查已知端口
        for p in PG_DEFAULT_PORTS:
            if _tcp_ping(self.host, p, timeout=0.5):
                self._dsn = f"postgresql://{self.user}:{self.password}@{self.host}:{p}/{self.db}"
                log.info(f"[embedded_pg] 发现运行中 PG :{p}")
                self._managed = False
                return self._dsn

        # 2. 尝试启动嵌入式 PG
        pg_ctl = _find_pg_ctl()
        if not pg_ctl:
            log.warning("[embedded_pg] 未找到 pg_ctl，无法启动嵌入式 PG")
            return None

        log.info(f"[embedded_pg] 启动嵌入式 PG (pg_ctl={pg_ctl})")

        try:
            # initdb (如果数据目录不存在)
            if not (PG_DATA / "PG_VERSION").exists():
                PG_DATA.mkdir(parents=True, exist_ok=True)
                subprocess.run(
                    [pg_ctl.replace("pg_ctl", "initdb"), "-D", str(PG_DATA),
                     "--auth=trust", "--encoding=UTF8", "--locale=C"],
                    capture_output=True, timeout=60, check=True,
                )
                # 配置: 端口 + 监听地址
                conf = PG_DATA / "postgresql.conf"
                conf_text = conf.read_text()
                conf_text = conf_text.replace("#port = 5432", f"port = {self.port}")
                conf_text = conf_text.replace("#listen_addresses = 'localhost'",
                                               "listen_addresses = '127.0.0.1'")
                conf.write_text(conf_text)
                # pg_hba.conf: 允许本地密码认证
                hba = PG_DATA / "pg_hba.conf"
                hba_text = hba.read_text()
                if "md5" not in hba_text:
                    hba_text += "\nhost all all 127.0.0.1/32 md5\n"
                    hba.write_text(hba_text)

            # pg_ctl start
            result = subprocess.run(
                [pg_ctl, "-D", str(PG_DATA), "-l", str(PG_DATA / "pg.log"), "start"],
                capture_output=True, timeout=30,
            )
            if result.returncode != 0:
                log.error(f"[embedded_pg] pg_ctl start failed: {result.stderr.decode()}")
                return None

            # 等待 PG 就绪
            for _ in range(30):
                if _tcp_ping(self.host, self.port, timeout=0.5):
                    self._dsn = f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.db}"
                    self._managed = True
                    log.info(f"[embedded_pg] 嵌入式 PG 已启动 :{self.port}")
                    return self._dsn
                time.sleep(0.5)

            log.error("[embedded_pg] PG 启动超时")
            return None

        except subprocess.TimeoutExpired:
            log.error("[embedded_pg] PG 启动超时")
            return None
        except Exception as e:
            log.error(f"[embedded_pg] 启动失败: {e}")
            return None

    def stop(self):
        """停止嵌入式 PG (仅限由我们启动的)"""
        if not self._managed:
            return

        pg_ctl = _find_pg_ctl()
        if pg_ctl:
            try:
                subprocess.run(
                    [pg_ctl, "-D", str(PG_DATA), "stop"],
                    capture_output=True, timeout=15,
                )
                log.info("[embedded_pg] 已停止")
            except Exception as e:
                log.warning(f"[embedded_pg] 停止失败: {e}")

        self._proc = None
        self._managed = False
        self._dsn = None


# ═══════════════════════════════════════════
# 全局实例
# ═══════════════════════════════════════════

_embedded: Optional[EmbeddedPG] = None


def ensure_pg() -> Optional[str]:
    """全局快捷: 确保 PG 可用 → 返回 DSN"""
    global _embedded
    if _embedded is None:
        _embedded = EmbeddedPG()
    return _embedded.ensure()


def stop_pg():
    global _embedded
    if _embedded:
        _embedded.stop()
        _embedded = None
