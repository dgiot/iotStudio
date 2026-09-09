# Edge Onboarding — 设备接入 → 物模型映射 → 推送验证

多源输入 → 点表提取 → 物模型映射 → 模拟采集 → 推送回环 的边缘侧标准化管线。
对应中枢侧技能：dgaiot 仓库 `skills/fde-ontology`（本技能的下游）。

## 触发条件

- "接入设备" / "新增设备类型" / "设备建模"
- "新增协议" / "写采集插件" / "接 Modbus/OPC/IEC104"
- "点表映射" / "采集配置" / "测点规划"
- "推送验证" / "链路冒烟" / "数据没到中枢"

## 输入源 → 提取器

| 输入 | 格式 | 提取内容 | 产出 |
|------|------|---------|------|
| 寄存器表 | .xlsx | 地址·功能码·类型·量程·单位 | thing_model.properties[] |
| OPC 节点树 | .xml / 浏览导出 | namespace·节点路径·数据类型 | 点位清单[] |
| MQTT 样例报文 | .json/.txt | 主题结构·payload 字段 | topic 规划 + 映射规则 |
| IEC 104 点表 | .csv/.xlsx | 信息体地址·ASDU 类型·缩放 | 点位清单[] |
| 运行日志 | .log | 实际地址·测点名·采集周期 | 校验后的采集配置 |
| 设备台账 | .docx/.xlsx | 设备名·型号·协议·从站号 | Device[] + Gateway[] |

## 工作流

```
Phase 1: EXTRACT   从寄存器表/节点树提取点位 → thing_model（属性/类型/单位/量程）
Phase 2: MAP       物模型 → MQTT 主题映射（dgiot/{site}/{gateway}/{device}/{point}/data）
                   命名审核：小写下划线、单位用 SI、禁中文键名
Phase 3: COLLECT   写/配采集插件（plugins/）→ simulators/ 起对应模拟器 → 观察推送日志
Phase 4: PUSH      hub_smoke.py 验证中枢回环（dgiot/# 订阅确认）
Phase 5: VERIFY    中枢侧确认（EMQX dashboard 18083 / TDengine 落库）→ 本体实例化（中枢技能接管）
```

## 验收标准

- 每个测点有：类型、单位、量程、采集周期、失败重试策略
- 模拟器数据可在中枢 TDengine 查到（表名 = 设备实例）
- 推送失败有本地缓冲，恢复后补传
- 新增协议只动 plugins/，不改 src/ 核心管道
