# ============================================================
# pythonIot — PostgreSQL 关系存储
# ============================================================
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from ..config import cfg, DBConfig
from ..models.device import Base, Device, DataPoint, AlarmRecord, PushTarget

logger = logging.getLogger(__name__)


class PostgresStore:
    """PostgreSQL 关系数据存储

    基于 SQLAlchemy async engine
    """

    def __init__(self, config: Optional[DBConfig] = None):
        self.config = config or cfg.db
        self.engine = None
        self._session_factory: Optional[async_sessionmaker] = None

    async def connect(self) -> bool:
        try:
            self.engine = create_async_engine(
                self.config.url,
                echo=False,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True,
            )
            self._session_factory = async_sessionmaker(self.engine, class_=AsyncSession)

            # 创建表
            async with self.engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            logger.info(f"[postgres] 连接成功 {self.config.host}:{self.config.port}/{self.config.database}")
            return True
        except Exception as e:
            logger.error(f"[postgres] 连接失败: {e}")
            logger.info("[postgres] 降级使用 SQLite")
            return await self._fallback_connect()

    async def _fallback_connect(self) -> bool:
        """降级 SQLite（用于无 PG 环境）"""
        import os
        from sqlalchemy.ext.asyncio import create_async_engine as ce
        os.makedirs(cfg.data_dir, exist_ok=True)
        self.engine = ce(f"sqlite+aiosqlite:///{cfg.sqlite_path}")
        self._session_factory = async_sessionmaker(self.engine, class_=AsyncSession)
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("[sqlite] 降级模式已启用")
        return True

    @property
    def session(self) -> AsyncSession:
        if self._session_factory is None:
            raise RuntimeError("数据库未连接，请先调用 connect()")
        return self._session_factory()

    # ===== Device =====

    async def create_device(self, device_data: Dict[str, Any]) -> Device:
        async with self.session as s:
            dev = Device(**device_data)
            s.add(dev)
            await s.commit()
            await s.refresh(dev)
            return dev

    async def get_device(self, device_id: str) -> Optional[Device]:
        async with self.session as s:
            stmt = select(Device).where(Device.device_id == device_id)
            r = await s.execute(stmt)
            return r.scalar_one_or_none()

    async def list_devices(self, station_id: Optional[str] = None,
                           device_type: Optional[str] = None) -> List[Device]:
        async with self.session as s:
            stmt = select(Device)
            if station_id:
                stmt = stmt.where(Device.station_id == station_id)
            if device_type:
                stmt = stmt.where(Device.device_type == device_type)
            r = await s.execute(stmt)
            return list(r.scalars().all())

    async def update_device_status(self, device_id: str, status: str) -> None:
        async with self.session as s:
            stmt = select(Device).where(Device.device_id == device_id)
            r = await s.execute(stmt)
            dev = r.scalar_one_or_none()
            if dev:
                dev.status = status
                dev.last_online_at = datetime.utcnow() if status == "online" else dev.last_online_at
                dev.updated_at = datetime.utcnow()
                await s.commit()

    # ===== DataPoint =====

    async def create_points_batch(self, points: List[Dict[str, Any]]) -> int:
        async with self.session as s:
            for p in points:
                if "point_id" not in p:
                    continue
                pt = DataPoint(**p)
                s.add(pt)
            await s.commit()
            return len(points)

    async def list_points(self, device_id: str) -> List[DataPoint]:
        async with self.session as s:
            r = await s.execute(select(DataPoint).where(DataPoint.device_id == device_id))
            return list(r.scalars().all())

    # ===== Alarm =====

    async def create_alarm(self, alarm_data: Dict[str, Any]) -> AlarmRecord:
        async with self.session as s:
            a = AlarmRecord(**alarm_data)
            s.add(a)
            await s.commit()
            await s.refresh(a)
            return a

    async def list_alarms(self, status: Optional[str] = "active", limit: int = 100) -> List[AlarmRecord]:
        async with self.session as s:
            stmt = select(AlarmRecord).order_by(AlarmRecord.created_at.desc()).limit(limit)
            if status:
                stmt = stmt.where(AlarmRecord.status == status)
            r = await s.execute(stmt)
            return list(r.scalars().all())

    async def update_alarm_status(self, alarm_id: str, status: str, operator: str = "") -> None:
        async with self.session as s:
            r = await s.execute(select(AlarmRecord).where(AlarmRecord.alarm_id == alarm_id))
            a = r.scalar_one_or_none()
            if a:
                a.status = status
                if status == "confirmed":
                    a.confirmed_by = operator
                    a.confirmed_at = datetime.utcnow()
                elif status == "cleared":
                    a.cleared_at = datetime.utcnow()
                await s.commit()

    # ===== PushTarget =====

    async def list_push_targets(self) -> List[PushTarget]:
        async with self.session as s:
            r = await s.execute(select(PushTarget).where(PushTarget.enabled == True))
            return list(r.scalars().all())

    async def close(self) -> None:
        if self.engine:
            await self.engine.dispose()
