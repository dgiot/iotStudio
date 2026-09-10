"""DemoSimDriver - a fake protocol driver proving the plugin contract.

Synthesizes deterministic point values (sinusoid + point id offset), so
the full acquisition loop can be exercised without any hardware.
"""
import math
import time

from src.protocols.base import BaseProtocolAdapter, PointValue


class DemoSimDriver(BaseProtocolAdapter):
    async def connect(self) -> bool:
        self._connected = True
        return True

    async def disconnect(self) -> None:
        self._connected = False

    async def read_points(self, points):
        now = time.time()
        out = []
        for p in points:
            offset = sum(ord(c) for c in str(p.get("point_id", ""))) % 10
            out.append(PointValue(
                device_id=self.device_id,
                point_id=p.get("point_id", ""),
                point_name=p.get("point_name", p.get("point_id", "")),
                value=round(50.0 + 10.0 * math.sin(now / 30) + offset, 2),
                data_type="float32",
                unit=p.get("unit"),
            ))
        return out

    async def write_point(self, point, value) -> bool:
        # demo driver accepts writes and echoes them into extra state
        self.config.extra.setdefault("written", []).append(
            {point.get("point_id", ""): value})
        return True
