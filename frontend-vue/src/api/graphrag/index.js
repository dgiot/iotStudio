/**
 * GraphRAG API — 知识图谱问答接口
 *
 * 后端: src/web/graphrag_api.py → /api/graphrag/*
 */
import request from '../request'

export default {
  /** 引擎状态 */
  status: () => request({ url: '/graphrag/status', method: 'get' }),

  /** 自然语言问答 */
  ask: (question, opts = {}) => request({
    url: '/graphrag/ask',
    method: 'post',
    data: {
      question,
      mode: opts.mode || 'auto',
      level: opts.level || 'site',
      entity_id: opts.entity_id || null,
    },
  }),

  /** 流式问答 (SSE) */
  askStream: (question, opts = {}) => {
    const params = new URLSearchParams()
    // SSE 通过原生 fetch 实现，axios 不支持流
    return fetch('/api/graphrag/ask/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, mode: opts.mode || 'auto', level: opts.level || 'site' }),
    })
  },

  /** 实体上下文 */
  context: (entityId) => request({ url: `/graphrag/context/${entityId}`, method: 'get' }),

  /** 社区摘要 */
  summary: (level = 'site', entityId) => request({
    url: `/graphrag/summary/${level}`,
    method: 'get',
    params: entityId ? { entity_id: entityId } : {},
  }),

  /** 子图导出 */
  subgraph: (entityId, depth = 2) => request({
    url: `/graphrag/subgraph/${entityId}`,
    method: 'get',
    params: { depth },
  }),

  /** 实体搜索 */
  search: (q, topK = 10, mode = 'semantic') => request({
    url: '/graphrag/search',
    method: 'get',
    params: { q, top_k: topK, mode },
  }),

  /** 语义搜索 + LLM 重排序 */
  semanticSearch: (q, topK = 10, rerank = true) => request({
    url: '/graphrag/search/semantic',
    method: 'get',
    params: { q, top_k: topK, rerank },
  }),

  /** 本体树 */
  tree: (siteId) => request({
    url: '/graphrag/tree',
    method: 'get',
    params: siteId ? { site_id: siteId } : {},
  }),

  /** 本体完整性校验 */
  healthCheck: () => request({ url: '/graphrag/health-check', method: 'get' }),

  // ── 实时数据 ──

  /** 增强上下文 (含实时遥测) */
  liveContext: (entityId) => request({ url: `/graphrag/live/context/${entityId}`, method: 'get' }),

  /** 设备实时快照 */
  liveSnapshot: (deviceId) => request({ url: `/graphrag/live/snapshot/${deviceId}`, method: 'get' }),

  /** 通道实时聚合 */
  liveChannel: (channelId) => request({ url: `/graphrag/live/channel/${channelId}`, method: 'get' }),

  /** 单测点最新值 */
  livePoint: (pointId) => request({ url: `/graphrag/live/point/${pointId}`, method: 'get' }),

  /** 测点历史趋势 */
  trend: (pointId, opts = {}) => request({
    url: `/graphrag/live/trend/${pointId}`,
    method: 'get',
    params: {
      hours: opts.hours,
      time_range: opts.time_range,
    },
  }),

  /** 一键播种遥测数据 */
  seedTelemetry: () => request({ url: '/graphrag/live/seed', method: 'post' }),

  // ── 告警诊断 ──

  /** 告警自动诊断 */
  analyzeAlarm: (entityId, alarmData) => request({
    url: '/graphrag/alarm/analyze',
    method: 'post',
    data: { entity_id: entityId, ...alarmData },
  }),

  // ── OWL/RDF ──

  /** 导出 OWL 本体 */
  owl: () => request({ url: '/graphrag/ontology.owl', method: 'get' }),

  /** SPARQL 查询 */
  sparql: (query) => request({
    url: '/graphrag/sparql',
    method: 'post',
    data: { query },
  }),

  // ── AIP 运维 ──

  /** 运维大屏 */
  aipDashboard: () => request({ url: '/graphrag/aip/dashboard', method: 'get' }),

  /** 对象浏览器 */
  aipObjects: (params = {}) => request({
    url: '/graphrag/aip/objects',
    method: 'get',
    params,
  }),

  /** 对象详情 */
  aipObjectDetail: (entityId) => request({ url: `/graphrag/aip/objects/${entityId}`, method: 'get' }),

  /** 创建本体对象 */
  aipCreateObject: (data) => request({
    url: '/graphrag/aip/objects/create',
    method: 'post',
    data,
  }),

  /** 更新本体对象 */
  aipUpdateObject: (entityId, data) => request({
    url: `/graphrag/aip/objects/${entityId}`,
    method: 'put',
    data,
  }),

  /** 删除本体对象 */
  aipDeleteObject: (entityId) => request({
    url: `/graphrag/aip/objects/${entityId}`,
    method: 'delete',
  }),

  /** 执行运维动作 */
  aipExecuteAction: (action, targetId, params) => request({
    url: '/graphrag/aip/actions/execute',
    method: 'post',
    data: { action, target_id: targetId, params },
  }),

  /** What-if 分析 */
  aipScenarioAnalyze: (entityId, change) => request({
    url: '/graphrag/aip/scenarios/analyze',
    method: 'post',
    data: { entity_id: entityId, change },
  }),

  /** Pipeline Monitor */
  aipPipeline: () => request({ url: '/graphrag/aip/pipeline', method: 'get' }),

  /** Code Console */
  aipConsole: (code, timeout = 5) => request({
    url: '/graphrag/aip/console',
    method: 'post',
    data: { code, timeout },
  }),

  /** 系统健康 */
  aipHealth: () => request({ url: '/graphrag/aip/health', method: 'get' }),

  /** LLM 测试 */
  llmTest: () => request({ url: '/graphrag/llm/test', method: 'get' }),
}
