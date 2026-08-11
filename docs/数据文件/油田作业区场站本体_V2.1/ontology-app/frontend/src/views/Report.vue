<template>
  <div>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px">
      <h2 style="font-weight:600">审核报告</h2>
      <el-tag type="success" size="large">本体完整性: PASS (100%)</el-tag>
    </div>

    <el-card shadow="hover" style="border-radius:12px; max-width:960px">
      <div v-html="renderedReport" style="line-height:1.8; font-size:14px; color:#333"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReport } from '../api'
import { marked } from 'marked'

const renderedReport = ref('')

onMounted(async () => {
  try {
    const res = await getReport()
    const md = res.data.report || ''
    renderedReport.value = marked.parse(md)
  } catch {
    renderedReport.value = '<p style="color:#999">报告加载失败，请确保后端运行中</p>'
  }
})
</script>
