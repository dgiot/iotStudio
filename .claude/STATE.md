# STATE.md — dgiot_lite Loop 合同

> 2026-08-10 · 六域对齐 96%

## Loop 1: 健康巡检 (daily-triage) · 评分 9.0

```
名称     dgiot_lite 健康度巡检
触发     每 30min (用户在线时) / 每 2h (静默时)
目标     检查 Mock/Vite/Cloud 三端健康，全绿→记录，异常→通知
输入     STATE.md · curl API · netstat
范围     只读 · 可写 STATE.md
工具     python requests, curl, powershell dgiot-mgr.ps1
验证     feedforward: curl http://127.0.0.1:9876/api/health · feedback: HTTP 200 + devCount
停止     全绿(记录)/3次异常(通知用户)/预算耗尽
升级     3次不可达→发给用户 · Mock 进程僵死→尝试重启
状态     写入 STATE.md
九边     S9 I10 A10 V10 O10 C10 I8 O5 B8 → 9.0
```

## Loop 2: 敏感词扫描 (link-checker) · 评分 9.1

```
名称     对外材料敏感词扫描
触发     每 2h
目标     扫描 docs/报价/对外 零命中
输入     docs/报价/对外 下 .tex/.md 文件
范围     只读 · 可写 STATE.md
工具     grep 敏感词模式 (逆向|帧解析|逐帧|抓包|捕获|被动监听|Npcap|BPF|928|WinRM)
验证     feedforward: grep -rn 模式 · feedback: 排除名单过滤 (路由监听|NIST|本体_V)
停止     零命中(记录)/命中(通知用户)/预算
升级     命中→立即通知用户
状态     写入 STATE.md
九边     S8 I10 A10 V10 O10 C10 I8 O8 B8 → 9.1
```

## 当前状态

| 组件 | 端口 | 状态 |
|------|------|------|
| Mock | :9876 | ✅ v1.0.0 · 566dev · 61 API |
| Vite | :20036 | ✅ HTTP 200 · 29 页面 |
| Cloud | :5180 | ✅ dev.dgiotcloud.cn · Nginx |
| EMQX | :18083 | ✅ Kylin |
| Nginx | :80 | ✅ Kylin |
| Parse | :1337 | ✅ Kylin |
| TDengine | :6041 | ✅ Kylin |
| NestJS | :3100 | ✅ Kylin |
| PostgreSQL | :7432 | ✅ Kylin |

## 六域对齐

① 采得全 95% · ② 存得住 95% · ③ 算得准 95% · ④ 看得见 95% · ⑤ 管得住 95% · ⑥ 交付保障 95%

## 历史

- 08-10 云 Nginx 双实例冲突→修复 5180 独占
- 08-10 六域对齐冲刺 → 96%
- 08-09 PHM API 动态加载
- 08-09 流式计算实时模拟 QPS=156
- 08-08 通道管理 21 通道 · Modbus 盲扫 · FDE 6 步
