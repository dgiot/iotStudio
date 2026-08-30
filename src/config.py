# ============================================================
# pythonIot — 配置管理
# ============================================================
import os
import sys
import yaml
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, Dict, Any


def _get_base_dir() -> Path:
    """项目根目录——兼容 PyInstaller 冻结和开发模式"""
    if getattr(sys, 'frozen', False):
        # PyInstaller 打包: exe 同目录（方便用户放置 config.yaml）
        return Path(sys.executable).parent
    return Path(__file__).resolve().parent.parent

BASE_DIR = _get_base_dir()


def load_yaml(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


class DBConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 5432
    user: str = "postgres"
    password: str = "postgres"
    database: str = "iot_platform"

    @property
    def url(self) -> str:
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

    @property
    def sync_url(self) -> str:
        return f"postgresql+psycopg2://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"


class TDEngineConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 6030
    user: str = "root"
    password: str = "taosdata"
    database: str = "iot_telemetry"


class MQTTConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 1883
    username: str = ""
    password: str = ""
    client_id: str = "pythonIot-pusher"
    builtin_broker_port: int = 21883  # 内置 Mini MQTT Broker 端口，避免与 EMQX :1883 冲突


class AppConfig(BaseModel):
    model_config = {"extra": "allow"}  # 允许 yaml 中额外字段
    title: str = "光储充微电网物联网平台"
    version: str = "4.3.7"
    host: str = "0.0.0.0"
    port: int = 8000
    db: DBConfig = DBConfig()
    tdengine: TDEngineConfig = TDEngineConfig()
    mqtt: MQTTConfig = MQTTConfig()
    log_level: str = "INFO"
    data_dir: str = str(BASE_DIR / "data")
    sqlite_path: str = str(BASE_DIR / "data" / "local.db")

    @classmethod
    def _find_config(cls, path: Optional[str] = None) -> Optional[str]:
        """查找 config.yaml —— 兼容 PyInstaller/开发模式"""
        if path:
            return path
        env_path = os.getenv("IOT_CONFIG")
        if env_path:
            return env_path
        # 搜索顺序: exe 同目录 → _MEIPASS 打包目录 → BASE_DIR
        search = [str(Path(sys.executable).parent / "config.yaml") if getattr(sys, 'frozen', False) else None,
                  str(Path(getattr(sys, '_MEIPASS', '')) / "config.yaml") if getattr(sys, 'frozen', False) else None,
                  str(BASE_DIR / "config.yaml")]
        for p in search:
            if p and os.path.exists(p):
                return p
        return None

    @classmethod
    def from_yaml(cls, path: Optional[str] = None) -> "AppConfig":
        found = cls._find_config(path)
        if found and os.path.exists(found):
            data = load_yaml(found)
            return cls(**data)
        return cls()

    @classmethod
    def from_env(cls) -> "AppConfig":
        """从环境变量加载（Docker 模式）"""
        return cls(
            db=DBConfig(
                host=os.getenv("PG_HOST", "127.0.0.1"),
                port=int(os.getenv("PG_PORT", "5432")),
                user=os.getenv("PG_USER", "postgres"),
                password=os.getenv("PG_PASSWORD", "postgres"),
                database=os.getenv("PG_DB", "iot_platform"),
            ),
            tdengine=TDEngineConfig(
                host=os.getenv("TD_HOST", "127.0.0.1"),
                port=int(os.getenv("TD_PORT", "6030")),
                user=os.getenv("TD_USER", "root"),
                password=os.getenv("TD_PASSWORD", "taosdata"),
                database=os.getenv("TD_DB", "iot_telemetry"),
            ),
            mqtt=MQTTConfig(
                host=os.getenv("MQTT_HOST", "127.0.0.1"),
                port=int(os.getenv("MQTT_PORT", "1883")),
                username=os.getenv("MQTT_USER", ""),
                password=os.getenv("MQTT_PASSWORD", ""),
            ),
        )


# 全局配置实例
cfg = AppConfig.from_yaml()
