# ============================================================
# pythonIot — Parse Server 关系存储适配器
# ============================================================
import asyncio
import logging
from datetime import datetime, timezone
from types import SimpleNamespace
from typing import Any, Dict, List, Optional

import httpx

from ..config import cfg

logger = logging.getLogger(__name__)


def _to_obj(data: Dict) -> SimpleNamespace:
    """将字典转为点号访问对象，兼容 SQLAlchemy model 风格"""
    if data is None:
        return None
    return SimpleNamespace(**data)


class ParseStore:
    """Parse Server REST API 存储适配

    替代 PostgreSQL，通过 Parse Server REST API 存储
    设备、测点、告警、推送目标

    参考: https://docs.parseplatform.org/rest/guide/
    """

    def __init__(self):
        self.base_url = "http://localhost:1337/parse"
        self.app_id = "af690d0aca8ab2b99be9e98a2de65547"
        self.master_key = "9a3898f4a24854f020db6ea1177e1b8b"
        self._client: Optional[httpx.AsyncClient] = None
        self._connected = False
        self._sqlite_lock = asyncio.Lock()  # 防 SQLite 并发死锁

    # ===== 生命周期 =====

    async def connect(self) -> bool:
        # 单机模式：直接使用 SQLite
        if getattr(cfg, 'storage_mode', 'parse') == 'sqlite':
            logger.info("[storage] 单机模式，使用 SQLite")
            return await self._fallback_connect()

        try:
            self._client = httpx.AsyncClient(timeout=15.0)
            resp = await self._client.get(
                f"{self.base_url}/health",
                headers=self._headers(),
            )
            if resp.status_code == 200:
                self._connected = True
                logger.info("[parse] 连接成功 localhost:1337/parse")
                return True
            else:
                logger.warning(f"[parse] 健康检查返回 {resp.status_code}")
                return False
        except Exception as e:
            logger.error(f"[parse] 连接失败: {e}")
            logger.info("[parse] 降级使用 SQLite")
            return await self._fallback_connect()

    async def _fallback_connect(self) -> bool:
        """降级 SQLite"""
        import os
        from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
        from ..models.device import Base
        os.makedirs(cfg.data_dir, exist_ok=True)
        self._sqlite_engine = create_async_engine(f"sqlite+aiosqlite:///{cfg.sqlite_path}")
        self._sqlite_factory = async_sessionmaker(self._sqlite_engine, class_=AsyncSession)
        async with self._sqlite_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        self._use_sqlite = True
        logger.info("[sqlite] 降级模式已启用")
        return True

    async def close(self):
        if self._client:
            await self._client.aclose()

    @property
    def connected(self) -> bool:
        return self._connected or getattr(self, '_use_sqlite', False)

    # ===== HTTP 工具 =====

    def _headers(self) -> Dict[str, str]:
        return {
            "X-Parse-Application-Id": self.app_id,
            "X-Parse-Master-Key": self.master_key,
            "Content-Type": "application/json",
        }

    async def _post(self, class_name: str, data: Dict) -> Dict:
        resp = await self._client.post(
            f"{self.base_url}/classes/{class_name}",
            headers=self._headers(),
            json=data,
        )
        resp.raise_for_status()
        return resp.json()

    async def _get(self, class_name: str, where: Optional[Dict] = None,
                   limit: int = 100, order: str = "-createdAt") -> List[Dict]:
        params = {"limit": limit, "order": order}
        if where:
            params["where"] = _json_str(where)
        resp = await self._client.get(
            f"{self.base_url}/classes/{class_name}",
            headers=self._headers(),
            params=params,
        )
        resp.raise_for_status()
        return resp.json().get("results", [])

    async def _get_one(self, class_name: str, object_id: str) -> Optional[Dict]:
        resp = await self._client.get(
            f"{self.base_url}/classes/{class_name}/{object_id}",
            headers=self._headers(),
        )
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return resp.json()

    async def _put(self, class_name: str, object_id: str, data: Dict) -> Dict:
        resp = await self._client.put(
            f"{self.base_url}/classes/{class_name}/{object_id}",
            headers=self._headers(),
            json=data,
        )
        resp.raise_for_status()
        return resp.json()

    async def _delete(self, class_name: str, object_id: str):
        resp = await self._client.delete(
            f"{self.base_url}/classes/{class_name}/{object_id}",
            headers=self._headers(),
        )
        if resp.status_code not in (200, 404):
            resp.raise_for_status()

    # ===== Device =====

    async def create_device(self, device_data: Dict[str, Any]) -> Dict:
        """创建设备，device_id 作为唯一标识"""
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_create("Device", device_data)
        body = _to_parse(device_data)
        result = await self._post("Device", body)
        logger.info(f"[parse] 设备创建: {device_data.get('device_id')}")
        return _to_obj(_from_parse(result))

    async def get_device(self, device_id: str) -> Optional[Dict]:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_get("Device", device_id)
        results = await self._get("Device", {"devaddr": device_id}, limit=1)
        return _to_obj(_from_parse(results[0])) if results else None

    async def list_devices(self, station_id: Optional[str] = None,
                           device_type: Optional[str] = None,
                           page: int = 1, page_size: int = 20):
        """列出设备，支持分页。返回 (items, total)"""
        if getattr(self, '_use_sqlite', False):
            filters = {}
            if station_id: filters['station_id'] = station_id
            if device_type: filters['device_type'] = device_type
            items = await self._sqlite_list("Device", **filters)
            total = len(items)
            start = (page - 1) * page_size
            return items[start:start + page_size], total

        where = {}
        if station_id:
            where["station_id"] = station_id
        if device_type:
            where["devType"] = device_type

        # 先查总数
        count_params = {"limit": 0, "count": 1}
        if where:
            count_params["where"] = _json_str(where)
        resp = await self._client.get(
            f"{self.base_url}/classes/Device",
            headers=self._headers(),
            params=count_params,
        )
        resp.raise_for_status()
        total = resp.json().get("count", 0)

        # 查分页数据
        skip = (page - 1) * page_size
        params = {"limit": page_size, "skip": skip, "order": "-createdAt"}
        if where:
            params["where"] = _json_str(where)
        resp = await self._client.get(
            f"{self.base_url}/classes/Device",
            headers=self._headers(),
            params=params,
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])
        return [_to_obj(_from_parse(r)) for r in results], total

    async def update_device_status(self, device_id: str, status: str):
        """更新设备状态"""
        if getattr(self, '_use_sqlite', False):
            return
        results = await self._get("Device", {"devaddr": device_id}, limit=1)
        if results:
            await self._put("Device", results[0]["objectId"], {"status": status})

    async def delete_device(self, device_id: str):
        """删除设备及其测点"""
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_delete("Device", device_id)
        # 先找到 Parse objectId
        results = await self._get("Device", {"devaddr": device_id}, limit=1)
        if results:
            await self._delete("Device", results[0]["objectId"])
            logger.info(f"[parse] 设备删除: {device_id}")

    # ===== DataPoint =====

    async def create_points_batch(self, points: List[Dict[str, Any]]) -> int:
        count = 0
        for p in points:
            await self._create_point(p)
            count += 1
        return count

    async def _create_point(self, point_data: Dict[str, Any]) -> Dict:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_create("DataPoint", point_data)
        body = _to_parse(point_data)
        result = await self._post("DataPoint", body)
        return _to_obj(_from_parse(result))

    async def list_points(self, device_id: str) -> List[Dict]:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_list("DataPoint", device_id=device_id)
        results = await self._get("DataPoint", {"devaddr": device_id}, limit=1000)
        return [_to_obj(_from_parse(r)) for r in results]

    async def get_point(self, point_id: str) -> Optional[Dict]:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_get("DataPoint", point_id)
        results = await self._get("DataPoint", {"point_id": point_id}, limit=1)
        return _to_obj(_from_parse(results[0])) if results else None

    # ===== AlarmRecord =====

    async def create_alarm(self, alarm_data: Dict[str, Any]) -> Dict:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_create("AlarmRecord", alarm_data)
        body = _to_parse(alarm_data)
        result = await self._post("AlarmRecord", body)
        return _to_obj(_from_parse(result))

    async def list_alarms(self, status: Optional[str] = "active", limit: int = 100) -> List[Dict]:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_list("AlarmRecord", status=status)
        results = await self._get("AlarmRecord", {"status": status}, limit=limit)
        return [_to_obj(_from_parse(r)) for r in results]

    async def update_alarm(self, alarm_id: str, update: Dict[str, Any]) -> bool:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_update("AlarmRecord", alarm_id, update)
        results = await self._get("AlarmRecord", {"alarm_id": alarm_id}, limit=1)
        if results:
            await self._put("AlarmRecord", results[0]["objectId"], update)
            return True
        return False

    # ===== PushTarget =====

    async def list_push_targets(self) -> List[Dict]:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_list("PushTarget")
        results = await self._get("PushTarget", limit=100)
        return [_to_obj(_from_parse(r)) for r in results]

    async def create_push_target(self, data: Dict[str, Any]) -> Dict:
        if getattr(self, '_use_sqlite', False):
            return await self._sqlite_create("PushTarget", data)
        body = _to_parse(data)
        result = await self._post("PushTarget", body)
        return _to_obj(_from_parse(result))

    # ===== SQLite 降级实现 =====

    async def _sqlite_create(self, table: str, data: Dict) -> Dict:
        from ..models.device import Device, DataPoint, AlarmRecord, PushTarget
        async with self._sqlite_lock, self._sqlite_factory() as s:
            cls = {"Device": Device, "DataPoint": DataPoint,
                   "AlarmRecord": AlarmRecord, "PushTarget": PushTarget}[table]
            obj = cls(**data)
            s.add(obj)
            await s.commit()
            await s.refresh(obj)
            return _to_obj(_sqlite_to_dict(obj))

    async def _sqlite_get(self, table: str, key_id: str) -> Optional[Dict]:
        from ..models.device import Device, DataPoint, AlarmRecord
        from sqlalchemy import select
        async with self._sqlite_lock, self._sqlite_factory() as s:
            cls = {"Device": Device, "DataPoint": DataPoint, "AlarmRecord": AlarmRecord}[table]
            id_col = {"Device": "device_id", "DataPoint": "point_id", "AlarmRecord": "alarm_id"}[table]
            stmt = select(cls).where(getattr(cls, id_col) == key_id)
            result = await s.execute(stmt)
            obj = result.scalar_one_or_none()
            return _to_obj(_sqlite_to_dict(obj)) if obj else None

    async def _sqlite_list(self, table: str, **filters) -> List[Dict]:
        from ..models.device import Device, DataPoint, AlarmRecord, PushTarget
        from sqlalchemy import select
        async with self._sqlite_lock, self._sqlite_factory() as s:
            cls = {"Device": Device, "DataPoint": DataPoint,
                   "AlarmRecord": AlarmRecord, "PushTarget": PushTarget}[table]
            stmt = select(cls)
            for k, v in filters.items():
                if v and hasattr(cls, k):
                    stmt = stmt.where(getattr(cls, k) == v)
            result = await s.execute(stmt)
            items = [_to_obj(_sqlite_to_dict(r)) for r in result.scalars().all()]

        # Fallback: 从 parse.db 读取（Devices/Points 存在 Parse 格式表中）
        if not items and table in ("Device", "DataPoint"):
            try:
                import sqlite3, json, os as _os
                parse_path = str(cfg.data_dir) + "/parse.db"
                if _os.path.exists(parse_path):
                    pdb = sqlite3.connect(parse_path)
                    pdb.row_factory = sqlite3.Row
                    if table == "Device":
                        cur = pdb.execute("SELECT objectId, data, createdAt, updatedAt FROM Device")
                        for row in cur.fetchall():
                            data = json.loads(row["data"]) if row["data"] else {}
                            if filters:
                                skip = False
                                for k, v in filters.items():
                                    fv = data.get(k)
                                    if fv is not None and fv != v:
                                        skip = True; break
                                if skip: continue
                            obj = dict(data)
                            obj["objectId"] = row["objectId"]
                            items.append(_to_obj(_from_parse(obj)))
                    elif table == "DataPoint":
                        # 先查 ontology_point
                        cur = pdb.execute("SELECT * FROM ontology_point")
                        for row in cur.fetchall():
                            reg_raw = row["register"] or ""
                            try:
                                reg = json.loads(reg_raw) if reg_raw.startswith("{") else {}
                            except:
                                reg = {}
                            if not reg and reg_raw.startswith("0x"):
                                reg = {"address": int(reg_raw, 16), "type": "uint16"}
                            d = {
                                "device_id": row["device_id"],
                                "point_id": row["objectId"],
                                "point_name": row["name"] or "pt_"+str(row["objectId"]),
                                "protocol_addr": str(reg.get("address", 0)) if isinstance(reg,dict) else "0",
                                "data_type": reg.get("type", "uint16") if isinstance(reg,dict) else "uint16",
                                "unit": row["unit"] or "",
                                "scale": 1.0, "offset": 0.0,
                                "dead_zone": 0.0, "collect_interval": 5,
                                "enabled": True,
                            }
                            items.append(_to_obj(d))

                        # 被查询的 device_id 如果在 ontology_point 中无记录，生成默认 Modbus 点
                        dev_id_filter = filters.get("device_id") if filters else None
                        if dev_id_filter:
                            has_pts = any(getattr(it, 'device_id', None) == dev_id_filter for it in items)
                            if not has_pts:
                                default_pts = [
                                    ("Ia", "40001", "float32", "A"),
                                    ("Ib", "40003", "float32", "A"),
                                    ("Ic", "40005", "float32", "A"),
                                    ("Ua", "40007", "float32", "V"),
                                    ("Ub", "40009", "float32", "V"),
                                    ("Uc", "40011", "float32", "V"),
                                    ("P", "40013", "float32", "kW"),
                                ]
                                for pname, addr, dtype, unit in default_pts:
                                    d = {
                                        "device_id": dev_id_filter,
                                        "point_id": f"{dev_id_filter}_{pname}",
                                        "point_name": pname,
                                        "protocol_addr": addr,
                                        "data_type": dtype,
                                        "unit": unit,
                                        "scale": 1.0, "offset": 0.0,
                                        "dead_zone": 0.0, "collect_interval": 5,
                                        "enabled": True,
                                    }
                                    items.append(_to_obj(d))
                    pdb.close()
            except Exception as ex:
                logger.warning(f"[parse] parse.db fallback failed: {ex}")
        return items

    async def _sqlite_delete(self, table: str, key_id: str):
        from ..models.device import Device
        from sqlalchemy import select, delete
        async with self._sqlite_lock, self._sqlite_factory() as s:
            stmt = select(Device).where(Device.device_id == key_id)
            result = await s.execute(stmt)
            obj = result.scalar_one_or_none()
            if obj:
                await s.delete(obj)
                await s.commit()

    async def _sqlite_update(self, table: str, key_id: str, update_data: Dict) -> bool:
        from ..models.device import AlarmRecord
        from sqlalchemy import select
        async with self._sqlite_lock, self._sqlite_factory() as s:
            stmt = select(AlarmRecord).where(AlarmRecord.alarm_id == key_id)
            result = await s.execute(stmt)
            obj = result.scalar_one_or_none()
            if obj:
                for k, v in update_data.items():
                    setattr(obj, k, v)
                await s.commit()
                return True
        return False


# ===== 工具函数 =====

def _json_str(obj: Any) -> str:
    import json
    return json.dumps(obj)


# Parse → dgiot_lite 字段映射
_PARSE_FIELD_MAP = {
    "devaddr": "device_id",
    "name": "device_name",
    "isEnable": "enabled",
    "devType": "device_type",
    "status": "status",
    "product": "product",
    "detail": "detail",
}

_DGIOT_DEFAULTS = {
    "device_id": "",
    "device_name": "",
    "enabled": True,
    "status": "online",
    "device_type": "default",
    "protocol": "modbus_tcp",
    "station_id": "default",
    "comm_params": {},
    "manufacturer": "",
    "model": "",
    "install_location": "",
    "last_online_at": None,
    "collect_interval": 5,
    "register_type": "3",
    "data_type": "float32",
    "scale": 1.0,
    "offset": 0.0,
    "unit": "",
    "alarm_high": None,
    "alarm_low": None,
    "alarm_high_high": None,
    "alarm_low_low": None,
    "dead_zone": 0.0,
    "enabled": True,
    "point_id": "",
    "point_name": "",
    "protocol_addr": "",
    "alarm_id": "",
    "alarm_type": "threshold",
    "alarm_level": "P1",
    "alarm_msg": "",
    "target_id": "",
    "target_name": "",
    "target_type": "mqtt",
    "endpoint": "",
    "config": {},
}

# dgiot_lite → Parse 反向字段映射
_PARSE_REVERSE_MAP = {v: k for k, v in _PARSE_FIELD_MAP.items()}


def _to_parse(data: Dict) -> Dict:
    """转换 dgiot_lite 字段名 → Parse 格式"""
    result = {}
    for k, v in data.items():
        if v is None:
            continue
        mapped = _PARSE_REVERSE_MAP.get(k, k)
        if isinstance(v, datetime):
            result[mapped] = {"__type": "Date", "iso": v.isoformat()}
        elif isinstance(v, dict):
            result[mapped] = v
        elif isinstance(v, (int, float, str, bool)):
            result[mapped] = v
        else:
            result[mapped] = str(v)
    result["product"] = "dgiot_lite"
    return result


def _parse_date(v: Any) -> Optional[datetime]:
    """解析 Parse 日期"""
    if isinstance(v, str):
        try: return datetime.fromisoformat(v.replace("Z", "+00:00"))
        except: return None
    if isinstance(v, dict) and v.get("__type") == "Date":
        try: return datetime.fromisoformat(v["iso"].replace("Z", "+00:00"))
        except: return None
    return None


def _from_parse(pobj: Dict) -> Dict:
    """转换 Parse 格式 → dgiot_lite 字段名"""
    result = dict(_DGIOT_DEFAULTS)  # 先填默认值
    for k, v in pobj.items():
        if k in ("ACL", "className", "updatedAt", "__type"):
            continue
        if k == "createdAt":
            result["created_at"] = _parse_date(v)
            continue
        if isinstance(v, dict) and v.get("__type") == "Date":
            try:
                result["last_online_at"] = datetime.fromisoformat(v["iso"].replace("Z", "+00:00"))
            except (ValueError, KeyError):
                pass
            continue
        # 字段映射
        mapped = _PARSE_FIELD_MAP.get(k, k)
        result[mapped] = v
    # objectId 保留用于 Parse CRUD，无 device_id 时兜底
    if "objectId" in pobj:
        result["objectId"] = pobj["objectId"]
        if not result.get("device_id"):
            result["device_id"] = pobj["objectId"]
    if not result.get("device_name"):
        result["device_name"] = result["device_id"]
    return result


def _sqlite_to_dict(obj) -> Dict:
    """SQLAlchemy 对象 → 字典"""
    result = {}
    for col in obj.__table__.columns:
        result[col.name] = getattr(obj, col.name)
    return result
