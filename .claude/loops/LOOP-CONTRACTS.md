# dgiot_lite Loop 合同

## Loop 1: 系统健康巡检 · 评分 9.3 · ⭐ 建议首发

```
名称    边缘中枢 + 前端全栈健康度巡检
触发    每 30 分钟 / 或手动 "/loop health"
目标    检查 Mock :9876 · Vite :19999 · Kylin 7服务 · 关键API，异常时报告
输入    .claude/memory/ STATE.md
范围    只读 · 可写 STATE.md
工具    curl, netstat, powershell dgiot-mgr.ps1 status
验证    feedforward: 端口存活检查 · feedback: API返回200+数据
停止    成功(全绿→记录)/ 连续3次全绿→降频至2h / 异常→升级
升级    任一服务不可达→交给人
提交    巡检结果→ STATE.md
状态    1-2轮即可写回，无需等待完整周期
```

## Loop 2: 对外文档敏感词扫描 · 评分 8.8

```
名称    对外材料敏感词自动扫描
触发    每次 PDF 编译后 / 每日一次
目标    扫描对外/ 目录全部 tex/md/xlsx，零命中报告
输入    对外/ 目录
范围    只读 · 可写 STATE.md
工具    grep, python+openpyxl
验证    feedforward: 扫描覆盖全部文件 · feedback: 命中=0
停止    成功(零命中)/ 命中>0→升级给人
升级    任何命中→交给人修复
提交    扫描结果→ STATE.md
```

## Loop 3: 前端构建验证 · 评分 8.5

```
名称    前端 Vite build 自检
触发    每次 router/views 文件变更后
目标    npx vite build 零错误
输入    frontend-vue/src/ 变更文件
范围    只读源码 · 可写 STATE.md
工具    npx vite build, git diff
验证    feedforward: git diff 确认变更范围 · feedback: build exit code=0
停止    成功(build pass)/ 失败→升级
升级    build 失败→交给人
提交    构建结果→ STATE.md
```
