# 大庆采油厂 IO 服务器与作业区全貌

> 整理日期: 2026-07-13
> 数据来源: pcapng抓包(95K报文) + Oracle 61K测点 + PDB逆向(140文件)

---

## 一、网络拓扑

```
                         互联网
                           │
                     ┌─────┴─────┐
                     │  企业内网   │
                     └─────┬─────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    11.66.12.129      11.66.12.130     11.66.12.131
    Oracle 11g         pSpace 6.0       IO服务器
    :1521              :9004 :80        (Windows Server 2016)
    DQYTPROD           :8889(A11)       ┌─ CommBridge :53001 (191 RTU)
                                        ├─ IOMan ×36 (OPC DA + A11)
                                        ├─ IoMonitor (GUI+OLEDB)
                                        └─ IoCommit ×7 (→Oracle)
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    11.248.195-205    11.249.34-80     11.250.x
    RTU (Modbus)      RTU (Modbus)     RTU (Modbus)
    约100台            约76台           约15台

                    DCS/OPC DA 端点:
         ┌──────────┬──────────┬──────────┬──────────┬──────────┐
    172.23.9.3  172.23.9.23  172.26.6.3  172.23.18.194  172.21.14.192
    DCS-A      DCS-B       DCS-C       DCS-D          DCS-E
    RSLinx     RSLinx      WinCC?      RSLinx         RSLinx
```

## 二、物理布局

### 南4联合站 (131 IO服务器所在)
- 位置: 采油二厂第四作业区
- 机柜: 南4联合站机房
- 服务器: 11.66.12.131 (Windows Server 2016)
- 数据流: 南4联合站 → 采油二厂第四作业区信息中心

### 北9注水站 / 北15联合站 / 萨北21站
- 位置: 采油三厂第八作业区
- 数据流: → 采油三厂第八作业区信息中心

## 三、采集系统

### 三路采集

| 通道 | 进程 | 目标 | 协议 | 测点数 |
|------|------|------|------|--------|
| Modbus TCP | CommBridge (PID 19240) | 191 RTU | 专有TCP :53001 | 4,567 |
| OPC DA | IOMan ×5 | 5 DCS端点 | DCOM :135 | 26,081 |
| A11 | IOMan ×7 | pSpace :8889 | A11 TCP | -- |

### CommBridge 专有协议
```
帧格式: Seq(1B)+Flags(4B)+Len(1B)+Slave(1B)+Func(1B)+Data(N)
注册: 0xAA + SlaveID + ASCII_DeviceID + 0x0D
心跳: 0x00
验证: 95,326报文, 异常率0.017%
```

### 设备类型 (12种保护装置)
```
0x00: DSL-31A 断路器 (20ch)
0x10: DST-31A 变压器差动 (15ch)
0x20: DBPA-31A 备用电源 (13ch)
0x30: DSB-31A 变压器后备 (20ch)
0x40: 电动机保护 (19ch)
0x50: DST-22D 变压器差动 (20ch)
0x60: DSB-22D 变压器后备 (20ch)
0x70: DSL-24D 断路器 (20ch)
0x80: DGP-11 变压器差动 (21ch)
0x90: DGP-12 变压器后备 (24ch)
0xA0: DGP-13 接地保护 (22ch)
0xB0: DMP-31A 电动机 (19ch)
```

### Modbus RTU 井分布 (54口井, CY1C8K站)
```
井号模式: B1V{区块}V{井号}  (如: B1V361V601)
每口井: 约23通道 (GYS/ZWG/ZYG/TGP/ADL/BDL/CDL/ADY/BDY/CDY...)
```

### OPC DA 站点分布
| 站点 | 测点数 | 类型 | 主要测点 |
|------|--------|------|----------|
| DX8ZRZ | 2,209 | 联合站 | 变频器(AYD/FTV/FVx) |
| DX6PZ | 3,106 | 联合站 | 报警/频率(ALA/AFR/AFT) |
| DX5ZRZ | 2,568 | 联合站 | 报警/阀门(ALA/BEL/DEA) |
| XZ202TP | 976 | 脱水站 | 开关量(ABx/ACCx) |
| SYZ105ZYTWZ | ~400 | 注水站 | 阀门/传感器(VEx/SFEx) |
| SY217Z1-4 | ~250 | 注水站 | 阀门/压力(VPx/VEx) |
| XZ208Z1-4 | ~350 | 注水站 | 温度/开关(TWT/CFT/CST) |
| JB1V2 | 969 | 遥信 | 报警/阀门(ALA/VAL/VBU) |

## 四、数据流

```
RTU ──TCP :53001──→ CommBridge ──WM_COPYDATA──→ IoMonitor ──OLEDB──→ Oracle
                                                                    ↓
DCS ──DCOM :135───→ IOMan ──psAPI──→ pSpace(IoProject) ──IoCommit──→ Oracle
                                                                    ↓
A11 ──TCP :8889───→ IOMan ──psAPI──→ pSpace ──────────IoCommit─────→ Oracle
                                                                    ↓
                                                              dgiot_lite
                                                          (WinRM→VBS/ADO)
```

## 五、dgiot_lite 接入

| 协议 | 方案 | 状态 |
|------|------|------|
| Modbus TCP | commbridge_server.exe替换CommBridge | :53002就绪, 待切换 |
| OPC DA | Oracle SYS_POINTRELATION_STATION | 26,081点已接入 |
| pSpace实时 | psAPISDK.dll直连 | 等认证 |

## 六、组织架构

```
采油二厂 ─── 第四作业区 ─── 南4联合站 (131)
                              ├─ 191口油井 (RTU)
                              ├─ 5个DCS控制站
                              └─ 注水站/脱水站

采油三厂 ─── 第八作业区 ─── 北9注水站
                              ├─ 北15联合站
                              └─ 萨北21站
```

## 七、关键配置文件

| 文件 | 路径 | 内容 |
|------|------|------|
| Device.ini | E:\IO ServerOnLine\ | 12设备类型+数据公式 |
| IoChannelCfg.ini | 同上 | 通道参数 (3 CommBridge设备) |
| SqlFilSet.ini | 同上 | Oracle连接配置 |
| IoMonitor.ini | 同上 | CommitRealSpan=300ms |
| pSpace.xml | E:\...\Data Servers\pSpace\ | pSpace服务器配置 |

## 八、凭证汇总

| 系统 | 地址 | 用户 | 密码 |
|------|------|------|------|
| WinRM | 11.66.12.131:5985 | administrator | GKYWB-5991792$1c8k |
| Oracle | 11.66.12.129:1521/orcl | DQYTPROD | DQYTA11_pass |
| pSpace | 11.66.12.130:9004 | admin | admin888 |
| IOFileServer | 131:7001 | admin | admin888 |
