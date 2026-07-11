# dgiot_lite 文档

```
docs/
├── src/02-技术方案/
│   └── 采集系统技术方案.tex     ← 唯一技术方案源码
├── pdf/02-技术方案/
│   └── 采集系统技术方案.pdf     ← 编译输出 (18页)
├── screenshots/                 ← 平台截图
├── data/
└── README.md
```

## 相关文档 (dgiot_collector)

| 文档 | 路径 |
|------|------|
| 报文实例分析 | `../dgiot_collector/docs/02_部署环境/报文实例分析.md` |
| 开发环境网络配置 | `../dgiot_collector/docs/02_部署环境/开发环境网络配置.md` |
| 设备清单 (Modbus+OPC) | `../dgiot_collector/docs/03_数据配置/设备清单_Modbus_OPC.md` |

## 编译

```bash
cd docs/src/02-技术方案
xelatex -interaction=nonstopmode 采集系统技术方案.tex
xelatex -interaction=nonstopmode 采集系统技术方案.tex
cp 采集系统技术方案.pdf ../../pdf/02-技术方案/
```
