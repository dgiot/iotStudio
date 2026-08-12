# ============================================================
# iotStudio — RTSP 视频流协议适配器 (海康NVR/ONVIF摄像头)
# ============================================================
"""
RTSP 视频流协议适配器，用于从海康 NVR 或 ONVIF 摄像头拉取视频流。

配置示例 (config.extra):
{
    "rtsp_url": "rtsp://user:pass@127.0.0.1:554/Streaming/Channels/101",
    "snapshot_interval": 30,        # 截图间隔(秒)
    "output_dir": "data/snapshots", # 截图保存目录
    "camera_name": "北1-2球机",
    "ptz_http": {                   # 海康 ISAPI PTZ (可选)
        "host": "127.0.0.1",
        "port": 80,
        "user": "admin",
        "pass": "password"
    }
}

海康 NVR RTSP 流地址格式:
    rtsp://{user}:{pass}@{nvr_ip}:554/Streaming/Channels/{channel}01
    通道 101=第1路主码流, 102=第1路子码流, 201=第2路主码流...
"""
import asyncio
import logging
import os
import time
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False


class RtspVideoAdapter(BaseProtocolAdapter):
    """RTSP 视频流适配器 — 拉流 + 截图 + 流状态监控"""

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self._cap: Optional[cv2.VideoCapture] = None
        self._last_frame: Optional[Any] = None
        self._last_snapshot_ts: float = 0
        self._frame_count: int = 0
        self._fps: float = 0
        self._fps_start: float = 0
        self._health_status = {"ok": False, "msg": "未连接"}

    async def connect(self) -> bool:
        """连接 RTSP 流"""
        if not HAS_CV2:
            logger.error("[rtsp] OpenCV 未安装")
            return False

        rtsp_url = self.config.extra.get("rtsp_url", "")
        if not rtsp_url:
            logger.error(f"[rtsp] {self.device_id} 未配置 rtsp_url")
            return False

        try:
            loop = asyncio.get_running_loop()
            ok = await loop.run_in_executor(None, self._open_stream, rtsp_url)
            if ok:
                self._connected = True
                self._fps_start = time.time()
                logger.info(f"[rtsp] {self.device_id} 连接成功")
            else:
                logger.error(f"[rtsp] {self.device_id} 无法打开 RTSP 流")
            return ok
        except Exception as e:
            logger.error(f"[rtsp] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    def _open_stream(self, rtsp_url: str) -> bool:
        """在 executor 线程中打开 RTSP 流（OpenCV 阻塞操作）"""
        self._cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)
        # 降低延迟
        self._cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        self._cap.set(cv2.CAP_PROP_FPS, 15)
        return self._cap.isOpened()

    async def disconnect(self) -> None:
        """释放 RTSP 流"""
        if self._cap:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, self._release)
        self._cap = None
        self._connected = False

    def _release(self):
        """释放 OpenCV 资源（executor 线程）"""
        try:
            if self._cap:
                self._cap.release()
        except Exception:
            pass

    async def is_connected(self) -> bool:
        if not self._cap:
            return False
        try:
            loop = asyncio.get_running_loop()
            ok = await loop.run_in_executor(None, lambda: self._cap.isOpened())
            self._connected = ok
            return ok
        except Exception:
            self._connected = False
            return False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """读取视频流状态并截图

        返回测点:
            stream_online  — 流是否在线 (1/0)
            fps           — 当前帧率
            frame_width   — 画面宽度
            frame_height  — 画面高度
            snapshot_ts   — 最近截图时间戳
        """
        if not self._cap or not self._connected:
            await self.connect()
            if not self._connected:
                return []

        extra = self.config.extra
        snapshot_interval = extra.get("snapshot_interval", 30)
        output_dir = extra.get("output_dir", "data/snapshots")

        results = []
        loop = asyncio.get_running_loop()

        try:
            # 读取一帧 (在 executor 中运行以避免阻塞事件循环)
            ret, frame = await loop.run_in_executor(None, self._grab_frame)

            if ret and frame is not None:
                self._last_frame = frame
                self._frame_count += 1
                h, w = frame.shape[:2]

                # 计算实时 FPS
                now = time.time()
                elapsed = now - self._fps_start
                if elapsed >= 2.0:  # 每2秒更新一次FPS
                    self._fps = self._frame_count / elapsed
                    self._frame_count = 0
                    self._fps_start = now

                # 定时截图
                snapshot_path = ""
                if now - self._last_snapshot_ts >= snapshot_interval:
                    snapshot_path = await loop.run_in_executor(
                        None, self._save_snapshot, frame, output_dir
                    )
                    self._last_snapshot_ts = now

                # 组装测点
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id="stream_online",
                    point_name="视频流在线",
                    value=1, data_type="uint16", unit="",
                ))
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id="fps", point_name="帧率",
                    value=round(self._fps, 1), data_type="float32", unit="fps",
                ))
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id="frame_width", point_name="画面宽度",
                    value=w, data_type="uint16", unit="px",
                ))
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id="frame_height", point_name="画面高度",
                    value=h, data_type="uint16", unit="px",
                ))
                if snapshot_path:
                    results.append(PointValue(
                        device_id=self.device_id,
                        point_id="snapshot_path", point_name="截图路径",
                        value=snapshot_path, data_type="string", unit="",
                    ))

                self._health_status = {"ok": True, "msg": f"流正常 {w}x{h} @{self._fps:.1f}fps"}
            else:
                # 读取失败
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id="stream_online",
                    point_name="视频流在线",
                    value=0, data_type="uint16", unit="",
                ))
                self._health_status = {"ok": False, "msg": "流读取失败"}
                self._connected = False

        except Exception as e:
            logger.warning(f"[rtsp] {self.device_id} 读取失败: {e}")
            self._health_status = {"ok": False, "msg": str(e)}
            self._connected = False

        return results

    def _grab_frame(self) -> Tuple[bool, Optional[Any]]:
        """读取一帧（在 executor 线程中执行）"""
        if self._cap is None or not self._cap.isOpened():
            return False, None
        ret, frame = self._cap.read()
        if not ret:
            # 尝试重连
            try:
                self._cap.release()
            except Exception:
                pass
            return False, None
        return True, frame

    def _save_snapshot(self, frame: Any, output_dir: str) -> str:
        """保存截图到磁盘（在 executor 线程中执行）"""
        try:
            os.makedirs(output_dir, exist_ok=True)
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{self.device_id}_{ts}.jpg"
            filepath = os.path.join(output_dir, filename)
            cv2.imwrite(filepath, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            return filepath
        except Exception as e:
            logger.warning(f"[rtsp] 截图保存失败: {e}")
            return ""

    async def read_holding(self, addr: int, count: int = 1,
                           slave_id: Optional[int] = None) -> Optional[list]:
        return None

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写操作 — 海康 ISAPI 云台控制（需配置 ptz_http）"""
        ptz = self.config.extra.get("ptz_http", {})
        if not ptz:
            logger.warning(f"[rtsp] {self.device_id} 未配置 ptz_http")
            return False

        import httpx
        cmd_map = {
            "left": "action=start&code=Left&arg1=1&arg2=0&arg3=0",
            "right": "action=start&code=Right&arg1=1&arg2=0&arg3=0",
            "up": "action=start&code=Up&arg1=1&arg2=0&arg3=0",
            "down": "action=start&code=Down&arg1=1&arg2=0&arg3=0",
            "stop": "action=stop&code=Left&arg1=0&arg2=0&arg3=0",
            "zoom_in": "action=start&code=ZoomIn&arg1=1&arg2=0&arg3=0",
            "zoom_out": "action=start&code=ZoomOut&arg1=1&arg2=0&arg3=0",
            "preset_1": "action=start&code=toPreset&arg1=1&arg2=0&arg3=0",
        }
        cmd = cmd_map.get(str(value).lower())
        if not cmd:
            logger.warning(f"[rtsp] 未知云台命令: {value}")
            return False

        try:
            auth = (ptz.get("user", "admin"), ptz.get("pass", ""))
            url = f"http://{ptz['host']}:{ptz.get('port',80)}/ISAPI/PTZCtrl/channels/1/{cmd}"
            async with httpx.AsyncClient(timeout=5, auth=auth) as client:
                resp = await client.get(url)
                return resp.status_code < 400
        except Exception as e:
            logger.warning(f"[rtsp] 云台控制失败: {e}")
            return False

    async def health(self) -> dict:
        """健康检查"""
        return {
            "ok": self._health_status["ok"] and self._connected,
            "msg": self._health_status["msg"],
            "fps": round(self._fps, 1),
        }


# -- 插件注册 --
try:
    from ..plugin_registry import register
    register("video_rtsp", version="1.0", category="protocol",
             adapter="RtspVideoAdapter",
             config={
                 "rtsp_url": "rtsp://user:pass@nvr:554/Streaming/Channels/101",
                 "snapshot_interval": 30,
                 "ptz_http": {"host": "", "port": 80, "user": "admin", "pass": ""},
             })
except ImportError:
    pass
