# dgiot_lite — 运行状态

> 最后更新: 2026-07-12 · CommBridge 逆向工程阶段

## 项目整体状态

| 模块 | 状态 | 说明 |
|------|------|------|
| HTTP API | ✅ 运行中 | http://localhost:8000 |
| 数据存储 | ✅ SQLite | TDengine 远端不可达时降级 |
| 协议适配 | ✅ 4+1 | Modbus TCP/RTU, OPC UA, IEC104, A11 |
| Oracle 管线 | ✅ 生产中 | WinRM 中继 → 81行/秒, 延迟700-1200ms |
| MQTT 推送 | ✅ | Mosquitto :1883, dgiot/# |
| WebSocket | ✅ | :8000/ws, 替代10s轮询 |
| 前端(Vue3) | ✅ | 20+视图, Element Plus |
| CommBridge 逆向 | ⚠️ 80% | 架构/公式已确认, 帧头尾魔数待定 |
| CommBridge 接管 | 📋 规划中 | 见 COMMBRIDGE_TAKEOVER_PLAN.md |

## 131 IO 服务器 (11.66.12.131)

| 模块 | 状态 | 细节 |
|------|------|------|
| CommBridge.exe | ✅ 运行中 | PID 19240, 191 RTU 连接, :53001 |
| IOMan.exe (OPC DA) | ✅ 5实例 | 172.23.9.x 5台 DCS |
| IOMan.exe (A11) | ✅ 7实例 | 11.66.12.130:8889 |
| IoMonitor.exe | ✅ 运行中 | GUI + Oracle OLEDB |
| Oracle | ✅ 可读 | 44,977 测点, 4.8M 功图记录 |
| pSpace | ⚠️ 不可直连 | FSmartWorx Web API 需认证 |

## 逆向工程产出 (reverse/commbridge/)

| 产出 | 大小 | 状态 |
|------|------|------|
| CommBridge.exe + PDB | 155KB + 484KB | ✅ 已下载 |
| GPRSDLL.dll | 1.38MB | ✅ 已下载 (待Ghidra分析) |
| anycomm.dll | 413KB | ✅ 已下载 |
| HPSocket.dll | 1.73MB | ✅ 已下载 |
| Device.ini | 39KB | ✅ 已解析 (12设备类型+数据公式) |
| 全部 DLL (140文件) | ~50MB | ✅ 已下载 |
| PDB 符号分类 | 12文件, 4732函数 | ✅ 已完成 |
| 协议分析报告 | COMMBRIDGE_PROTOCOL_REPORT.md | ✅ 已完成 |
| DTU_DQQY DTUAPI.dll | 24KB | ✅ 已下载+strings分析 |

## 方案C部署 (2026-07-12)

| 项目 | 状态 | 详情 |
|------|------|------|
| commbridge_server.exe | ✅ 运行中 | PID 13500, :53002, 内存26MB稳定 |
| 位置 | 131 | C:\Users\Administrator\commbridge_server.exe |
| 日志 | 正常 | C:\Users\Administrator\commbridge.log |
| 巡检 | 30分钟 | 自动检查进程/端口/内存/错误 |

## 巡检 Loop (v1.0)

| 项目 | 状态 |
|------|------|
| 脚本 | `tools/loop_131_monitor.py` |
| 频率 | 每30分钟 (7分/37分) |
| 验证 | 进程PID + 端口 + 协议帧 + 连接数 |
| 证据 | `logs/monitor_131.jsonl` |
| 升级 | 连续3次异常→建议重启 |

## 数据管线

| 管线 | 测点数 | 间隔 | 状态 |
|------|--------|------|------|
| Modbus RTU | 4,567 | 300s | ✅ Oracle |
| OPC DA (DX/JB/Z) | 26,081 | 600s | ✅ Oracle |
| Run Rate | 966井 | 60s | ✅ Oracle |

## 日报 2026-07-13 08:04

### 平台
- 设备: 270 台
- 遥测: 251502 条
- 告警: 81 活跃
- 管线: 运行中

### Loop 巡检 (24h)
- 平台: 7次, 7OK/0FAIL
- 131:  8次, 1OK/7FAIL, 状态=DOWN

### Git
- 24h提交: 0 个

