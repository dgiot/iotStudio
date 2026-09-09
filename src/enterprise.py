"""企业数据源连接器 (P1) — httpx 双向通道

边缘 Foundry 叙事的关键一环:
  PULL  企业 REST/ERP 端点 → 边缘本体对象 (与 /aip/objects/import 同形状)
  PUSH  边缘本体快照      → 中枢侧 DataHub (元数据上报)

安全纪律:
  - 仅 http/https, 拒绝 URL 内嵌凭证 (user:pass@) — 凭证一律走环境变量引用
  - 超时 10s, 不跟随重定向; 连接失败作为结果返回, 不向上抛 (审计友好)
  - 测试经 httpx.MockTransport 注入, 全程零真实网络
"""
from __future__ import annotations

import os
import time
from typing import Any, Dict, List, Optional

import httpx

_LAYER_TABLES = ("sites", "gateways", "channels", "devices",
                 "points", "constraints", "datasources")
_TIMEOUT = httpx.Timeout(10.0)


def register_objects(engine, objects: List[dict]) -> Dict[str, int]:
    """注册对象列表到本体 — 与 /aip/objects/import 同形状: {id, layer, name?, props?}

    kwargs 按 dataclass 实际字段过滤 (Gateway/DataSource 无 name 字段,
    无条件传 name 会 TypeError) — 企业端点/导入端点共用。
    """
    import dataclasses
    from .ontology import Site, Gateway, Channel, Device, Point, Constraint, DataSource
    classes = {"site": Site, "gateway": Gateway, "channel": Channel,
               "device": Device, "point": Point, "constraint": Constraint,
               "datasource": DataSource}
    tables = {name: getattr(engine, name) for name in _LAYER_TABLES}
    counts = {"created": 0, "updated": 0, "errors": 0, "error_details": []}
    for obj in objects:
        try:
            layer = obj.get("layer", "")
            cls = classes.get(layer)
            if cls is None:
                counts["errors"] += 1
                continue
            valid = {f.name: f for f in dataclasses.fields(cls)}
            kwargs = {"id": obj["id"]}
            if "name" in valid:
                kwargs["name"] = obj.get("name", "")
            for k, v in (obj.get("props", {}) or {}).items():
                if k in valid:
                    kwargs[k] = v
            # 必填无默认字段兜底 (当前全部为 str: gateway.ip/site, device.channel,
            # point.device, constraint.rule, channel.protocol/gateway, datasource.type)
            for fname, f in valid.items():
                if fname not in kwargs and f.default is dataclasses.MISSING \
                        and f.default_factory is dataclasses.MISSING:
                    kwargs[fname] = ""
            kwargs = {k: v for k, v in kwargs.items() if k in valid}
            table = tables[layer + "s"]  # 层级名 → 表名 (device→devices)
            if obj["id"] in table:
                counts["updated"] += 1
            else:
                counts["created"] += 1
            engine.register(cls(**kwargs))
        except Exception as e:
            counts["errors"] += 1
            if len(counts["error_details"]) < 5:
                counts["error_details"].append(f"{obj.get('id', '?')}: {type(e).__name__}: {e}")
    return counts


class EnterpriseConnector:
    """企业数据源连接器 — 引擎只读挂载, 注册走 engine.register (R1 词表纪律不变)"""

    def __init__(self, engine, client: Optional[httpx.AsyncClient] = None):
        self.engine = engine
        self._client = client  # None → 惰性自建 (测试注入 MockTransport)

    # ── 内部 ──

    async def _acquire(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=_TIMEOUT, follow_redirects=False)
        return self._client

    async def dispose(self):
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    def _ds(self, ds_id: str):
        ds = self.engine.datasources.get(ds_id)
        if ds is None:
            raise ValueError(f"数据源 {ds_id} 未找到")
        return ds

    @staticmethod
    def _base_url(ds) -> str:
        conn = (ds.connection or "").strip()
        low = conn.lower()
        if not low.startswith(("http://", "https://")):
            raise ValueError(f"数据源 {ds.id} 非企业 HTTP 类型 (connection 需 http/https)")
        netloc = conn.split("/")[2]  # http(s)://<netloc>/...
        if "@" in netloc:
            raise ValueError("URL 内嵌凭证被拒绝 — 凭证必须走环境变量引用")
        return conn.rstrip("/")

    @staticmethod
    def _layer_tables(engine) -> Dict[str, dict]:
        return {name: getattr(engine, name) for name in _LAYER_TABLES}

    def _register_objects(self, objects: List[dict]) -> Dict[str, int]:
        return register_objects(self.engine, objects)

    # ── PULL: 企业端点 → 边缘本体 ──

    async def pull_metadata(self, ds_id: str, path: str = "/api/metadata",
                            limit: int = 200) -> Dict[str, Any]:
        ds = self._ds(ds_id)
        base = self._base_url(ds)
        result: Dict[str, Any] = {"source": ds_id, "direction": "pull", "endpoint": base + path}
        try:
            client = await self._acquire()
            resp = await client.get(base + path)
            result["http_status"] = resp.status_code
            if resp.status_code != 200:
                ds.status = "error"
                result["status"] = "error"
                result["detail"] = f"HTTP {resp.status_code}"
                return result
            payload = resp.json()
            objects = payload.get("objects", []) if isinstance(payload, dict) else payload
            if not isinstance(objects, list):
                raise ValueError("响应需为 objects 数组或对象列表")
            objects = objects[:limit]
            counts = self._register_objects(objects)
            ds.status = "connected"
            ds.tables = sorted({o["layer"] for o in objects if o.get("layer")})
            ds.tag_count = len(objects)
            result.update(status="ok", requested=len(objects), **counts)
        except ValueError:
            raise
        except Exception as e:  # httpx.ConnectError / json 解析等 — 结果化, 不上抛
            ds.status = "error"
            result.update(status="error", detail=f"{type(e).__name__}: {e}")
        return result

    # ── PUSH: 边缘本体快照 → 中枢 DataHub ──

    def snapshot(self, ds_id: str) -> Dict[str, Any]:
        """本体快照 — 上报载荷 (元数据口径, 不含遥测原始值)"""
        ds = self._ds(ds_id)
        h = self.engine.health()["counts"]
        return {
            "source": ds_id,
            "source_type": ds.type,
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "entity_counts": h,
            "objects": [
                {"id": eid, "layer": lname}
                for lname, table in self._layer_tables(self.engine).items()
                for eid in table
            ],
        }

    async def push_metadata(self, ds_id: str, hub_url: str,
                            token_env: Optional[str] = None) -> Dict[str, Any]:
        ds = self._ds(ds_id)
        if not hub_url.lower().startswith(("http://", "https://")):
            raise ValueError("hub_url 需 http/https")
        result: Dict[str, Any] = {"source": ds_id, "direction": "push", "hub": hub_url}
        try:
            payload = self.snapshot(ds_id)
            headers = {"Content-Type": "application/json"}
            if token_env:
                token = os.environ.get(token_env)
                if token:
                    headers["Authorization"] = f"Bearer {token}"
            client = await self._acquire()
            resp = await client.post(hub_url, json=payload, headers=headers)
            result["http_status"] = resp.status_code
            ds.status = "connected" if resp.status_code < 300 else "error"
            result["status"] = "ok" if resp.status_code < 300 else "error"
            result["sent_objects"] = len(payload["objects"])
        except ValueError:
            raise
        except Exception as e:
            ds.status = "error"
            result.update(status="error", detail=f"{type(e).__name__}: {e}")
        return result
