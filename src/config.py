# ============================================================
# pythonIot — 配置管理
# ============================================================
import os
import yaml
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, Dict, Any


BASE_DIR = Path(__file__).resolve().parent.parent


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


class AppConfig(BaseModel):
    title: str = "光储充微电网物联网平台"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 8000
    db: DBConfig = DBConfig()
    tdengine: TDEngineConfig = TDEngineConfig()
    mqtt: MQTTConfig = MQTTConfig()
    log_level: str = "INFO"
    data_dir: str = str(BASE_DIR / "data")
    sqlite_path: str = str(BASE_DIR / "data" / "local.db")

    @classmethod
    def from_yaml(cls, path: Optional[str] = None) -> "AppConfig":
        if path is None:
            path = os.getenv("IOT_CONFIG", str(BASE_DIR / "config.yaml"))
        if os.path.exists(path):
            data = load_yaml(path)
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
