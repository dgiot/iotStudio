# ============================================================
# pythonIot 鈥?閰嶇疆绠＄悊
# ============================================================
import os
import sys
import yaml
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, Dict, Any


def _get_base_dir() -> Path:
    """椤圭洰鏍圭洰褰?鈥?鍏煎 PyInstaller 鍐荤粨鍜屽紑鍙戞ā寮?""
    if getattr(sys, 'frozen', False):
        # PyInstaller 鎵撳寘: exe 鍚岀洰褰曪紙鏂逛究鐢ㄦ埛鏀剧疆 config.yaml锛?        return Path(sys.executable).parent
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
    builtin_broker_port: int = 21883  # 鍐呯疆 Mini MQTT Broker 绔彛锛岄伩鍏嶄笌 EMQX :1883 鍐茬獊


class AppConfig(BaseModel):
    model_config = {"extra": "allow"}  # 鍏佽 yaml 涓澶栧瓧娈?    title: str = "鍏夊偍鍏呭井鐢电綉鐗╄仈缃戝钩鍙?
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
        """鏌ユ壘 config.yaml 鈥?鍏煎 PyInstaller/寮€鍙戞ā寮?""
        if path:
            return path
        env_path = os.getenv("IOT_CONFIG")
        if env_path:
            return env_path
        # 鎼滅储椤哄簭: exe 鍚岀洰褰?鈫?_MEIPASS 鎵撳寘鐩綍 鈫?BASE_DIR
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
        """浠庣幆澧冨彉閲忓姞杞斤紙Docker 妯″紡锛?""
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


# 鍏ㄥ眬閰嶇疆瀹炰緥
cfg = AppConfig.from_yaml()
