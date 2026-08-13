# ============================================================
# iotStudio — 设备模型 (多租户)
# ============================================================
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import (
    Column, Integer, String, DateTime, JSON, Float, Boolean, Text,
    create_engine, ForeignKey
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Tenant(Base):
    """租户/组织 — 对齐 DG-IoT _Role 模型
    DG-IoT 用 Parse _Role 做多租户隔离:
      - name = 岗位/角色名称 (同时作为租户标识)
      - parent_role = 上级角色 (支持层级)
      - users = 关联用户列表
      - ACL = 数据访问控制
    """
    __tablename__ = "tenants"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, comment="租户唯一标识")
    name: Mapped[str] = mapped_column(String(128), comment="租户/岗位名称")          # ≡ _Role.name
    slug: Mapped[str] = mapped_column(String(64), unique=True, comment="短标识")
    parent_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, comment="上级租户 (层级)")  # ≡ _Role.roles
    contact: Mapped[Optional[str]] = mapped_column(String(128), comment="联系人")
    phone: Mapped[Optional[str]] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(16), default="active", comment="active/disabled")
    max_devices: Mapped[int] = mapped_column(Integer, default=1000, comment="设备上限")
    max_users: Mapped[int] = mapped_column(Integer, default=50)
    extra: Mapped[Optional[Dict]] = mapped_column(JSON, comment="扩展配置")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserRole(Base):
    """用户-租户关联 — 对齐 DG-IoT _Role.users"""
    __tablename__ = "user_roles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, comment="用户ID")
    tenant_id: Mapped[str] = mapped_column(String(64), index=True, comment="租户/角色ID")  # ≡ _Role.users relation
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, comment="是否该租户管理员")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Device(Base):
    """设备信息表"""
    __tablename__ = "devices"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True, default="default", comment="所属租户")
    device_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, comment="设备唯一标识")
    device_name: Mapped[str] = mapped_column(String(128), comment="设备名称")
    device_type: Mapped[str] = mapped_column(String(32), index=True, comment="设备类型: inverter/pcs/charger/meter/sensor")
    station_id: Mapped[str] = mapped_column(String(64), index=True, comment="所属场站")
    protocol: Mapped[str] = mapped_column(String(32), comment="采集协议: modbus_rtu/modbus_tcp/iec104/opcua")

    # 通讯参数
    comm_params: Mapped[Optional[Dict]] = mapped_column(JSON, comment="通讯参数 JSON")
    # 设备属性
    manufacturer: Mapped[Optional[str]] = mapped_column(String(128), comment="厂商")
    model: Mapped[Optional[str]] = mapped_column(String(128), comment="型号")
    serial_number: Mapped[Optional[str]] = mapped_column(String(128), comment="序列号")
    install_location: Mapped[Optional[str]] = mapped_column(String(256), comment="安装位置")

    # 运行状态
    status: Mapped[str] = mapped_column(String(16), default="offline", comment="online/offline/alarm/maintenance")
    last_online_at: Mapped[Optional[datetime]] = mapped_column(DateTime, comment="最后在线时间")

    enabled: Mapped[bool] = mapped_column(Boolean, default=True, comment="是否启用采集")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    extra: Mapped[Optional[Dict]] = mapped_column(JSON, comment="扩展字段")


class DataPoint(Base):
    """采集点位表"""
    __tablename__ = "data_points"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    point_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, comment="点位唯一标识")
    device_id: Mapped[str] = mapped_column(String(64), index=True, comment="关联设备")
    point_name: Mapped[str] = mapped_column(String(128), comment="点位名称")
    point_group: Mapped[str] = mapped_column(String(64), default="default", comment="点位分组")

    # 协议相关
    protocol_addr: Mapped[str] = mapped_column(String(256), comment="协议地址")
    register_type: Mapped[Optional[str]] = mapped_column(String(32), comment="寄存器类型 (modbus)")
    data_type: Mapped[str] = mapped_column(String(32), default="float32", comment="数据类型")
    byte_order: Mapped[str] = mapped_column(String(16), default="big", comment="字节序")

    # 数值处理
    scale: Mapped[float] = mapped_column(Float, default=1.0, comment="缩放系数")
    offset: Mapped[float] = mapped_column(Float, default=0.0, comment="偏移量")
    unit: Mapped[Optional[str]] = mapped_column(String(32), comment="单位")
    dead_zone: Mapped[float] = mapped_column(Float, default=0.0, comment="死区值")

    # 采集配置
    collect_interval: Mapped[int] = mapped_column(Integer, default=5, comment="采集周期(秒)")
    enabled: Mapped[bool] = mapped_column(Boolean, default=True, comment="是否启用")

    # 告警阈值
    alarm_high: Mapped[Optional[float]] = mapped_column(Float, comment="告警上限")
    alarm_low: Mapped[Optional[float]] = mapped_column(Float, comment="告警下限")
    alarm_high_high: Mapped[Optional[float]] = mapped_column(Float, comment="告警上上限")
    alarm_low_low: Mapped[Optional[float]] = mapped_column(Float, comment="告警下下限")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    extra: Mapped[Optional[Dict]] = mapped_column(JSON, comment="扩展字段")


class AlarmRecord(Base):
    """告警记录表"""
    __tablename__ = "alarm_records"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    alarm_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    device_id: Mapped[str] = mapped_column(String(64), index=True)
    point_id: Mapped[Optional[str]] = mapped_column(String(64))

    alarm_type: Mapped[str] = mapped_column(String(32), comment="告警类型: threshold/rate/status")
    alarm_level: Mapped[str] = mapped_column(String(8), comment="P0/P1/P2")
    alarm_msg: Mapped[str] = mapped_column(String(512), comment="告警描述")
    alarm_value: Mapped[Optional[float]] = mapped_column(Float, comment="触发值")
    threshold_value: Mapped[Optional[float]] = mapped_column(Float, comment="阈值")

    status: Mapped[str] = mapped_column(String(16), default="active", comment="active/confirmed/cleared")
    confirmed_by: Mapped[Optional[str]] = mapped_column(String(64))
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    cleared_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PushTarget(Base):
    """数据推送目标"""
    __tablename__ = "push_targets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    target_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    target_name: Mapped[str] = mapped_column(String(128))
    target_type: Mapped[str] = mapped_column(String(16), comment="mqtt/http")
    endpoint: Mapped[str] = mapped_column(String(512), comment="目标地址")
    config: Mapped[Optional[Dict]] = mapped_column(JSON, comment="详细配置")
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


# ===== 同步引擎（用于创建表） =====
def init_db(connection_string: str):
    engine = create_engine(connection_string)
    Base.metadata.create_all(engine)
    print("Tables created successfully.")
    return engine
