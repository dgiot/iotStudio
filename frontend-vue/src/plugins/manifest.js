/**
 * 插件清单 — 控制部署哪些功能模块
 *
 * 部署时只需注释不需要的插件
 * 打包时 tree-shaking 自动裁剪
 */
export const MANIFEST = {
  // 核心（必选）
  core:    true,   // AppLayout / 登录 / 仪表盘

  // 设备管理
  device:  true,   // 设备列表 · 产品管理

  // 工业组态
  hmi:     true,   // HMI 组态视图

  // 数据分析
  data:    true,   // 遥测 · 告警 · 流计算 · PHM

  // 网络诊断
  network: true,   // 报文解析 · 通道管理 · 边缘代理

  // 调试工具
  tool:    true,   // MQTT 调试 · 设备模拟

  // 系统管理
  system:  true,   // 系统概览 · 运维 · 用户

  // 边缘中枢联调
  hub:     true,   // 边缘中枢桥接 · 数据推送

  // 未来扩展
  // scada: false,    // SCADA 全功能组态
  // report: false,   // 报表引擎
  // video: false,    // 视频监控
  // ai: false,       // AI 模型管理
}

export function isEnabled(name) {
  return MANIFEST[name] === true
}
