import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 10000 })

export const getOntologyFull = () => api.get('/ontology/full')
export const getOntologyLayer = (layer) => api.get(`/ontology/layer/${layer}`)
export const getOntologyStats = () => api.get('/ontology/stats')
export const getGraphData = () => api.get('/graph/data')
export const getEntities = () => api.get('/entities')
export const getEntitiesExcel = () => api.get('/entities/excel')
export const getEntityLayers = () => api.get('/entities/layers')

export const getRelations = () => api.get('/relations')
export const getRelationsExcel = () => api.get('/relations/excel')

export const getConstraints = () => api.get('/constraints')
export const getConstraintsExcel = () => api.get('/constraints/excel')
export const getConstraintGroups = () => api.get('/constraints/groups')

export const getReport = () => api.get('/report')
export const getExcelGraph = () => api.get('/graph/excel-graph')

// 标签数据
export const getTagsStats = () => api.get('/tags/stats')
export const getTagsPointTypes = () => api.get('/tags/point-types')
export const getTagsWells = (params = {}) => api.get('/tags/wells', { params })
export const getTagsMetering = (params = {}) => api.get('/tags/metering-stations', { params })
export const queryTags = (params = {}) => api.get('/tags/query', { params })
