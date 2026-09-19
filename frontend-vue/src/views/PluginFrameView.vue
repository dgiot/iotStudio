<!--
  PluginFrameView — 插件应用宿主（通用）

  用途：把**仓外插件**的页面嵌进底座布局里打开，而不是新窗口跳出去。
  侧栏、顶栏都还在，插件页看起来就是底座自己的一个应用。

  为什么是 iframe 而不是动态 import 组件：
    插件与底座**彻底解耦**是这套插件体系最值钱的一条 —— 插件自己构建、
    自己发版、自己起服务，底座升级不碎插件，插件挂掉不连累底座。
    动态 import 远程 ESM 会把插件的构建产物与底座的 Vue / Element Plus
    **版本焊死**，等于每加一个插件都要处理一次版本耦合 ——
    那样「增加一个插件」就不再是轻动作了。iframe 保住了这条解耦，
    代价是跨页面通信要走 postMessage（目前不需要）。

  路由约定：`/plugin/:name`。菜单覆写里 `embed: true` 的项走这条路由，
  没有 embed 的仍走老路子（Sidebar 的 <a target="_blank"> 新窗口）。

  ⚠️ URL 只从 `GET /api/admin/menus` 取，**不从路由 query 取**：
    query 是用户可改的，拿它当 iframe src 等于给底座开一个
    「嵌任意站点」的口子（钓鱼/点击劫持）。覆写是 admin 写的，可信。

  两种来源，按顺序取：
    ① 覆写里写了 `external` → 用它（插件自带服务的老形制，跨域）
    ② 没写 `external` 但 `embed: true` → 推底座同源的 `/api/plugin/<包名>/`
       （端口统一之后的形制：插件不再占端口，页面由底座发）
  ②比①好：同源意味着没有跨域、没有端口要记，插件页与底座共享登录态。
-->
<template>
  <div class="plugin-frame">
    <div class="pf-bar">
      <span class="pf-dot" :class="err ? 'bad' : ''" />
      <span class="pf-title">{{ title || name }}</span>
      <span class="pf-url">{{ url }}</span>
      <el-button size="small" :disabled="!url" @click="reload">刷新</el-button>
      <el-button size="small" type="primary" plain :disabled="!url" @click="openExternal">
        新窗口打开
      </el-button>
    </div>

    <div v-if="url" class="pf-body">
      <!-- key 换值即强制重建 iframe（刷新用；改 src 不会重载同源页） -->
      <iframe :key="nonce" :src="url" class="pf-iframe" frameborder="0"
              referrerpolicy="no-referrer" />
    </div>
    <el-empty v-else :description="err || '正在解析插件地址…'" class="pf-empty" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getMenus } from '../api/admin.js'

const route = useRoute()
const url = ref('')
const title = ref('')
const err = ref('')
const nonce = ref(0)

const name = computed(() => route.params.name || '')

async function resolve() {
  url.value = ''
  err.value = ''
  try {
    const r = await getMenus()
    const rows = r?.results || []
    // 按当前路由 path 精确匹配覆写行 —— 与 AppLayout 的菜单构造同一个数据源
    const row = rows.find(o => o.path === route.path)
    if (!row) {
      err.value = `没有 ${route.path} 的菜单覆写 —— 插件未接入或已删除`
      return
    }
    if (row.external) {
      url.value = row.external
    } else if (row.embed && name.value) {
      // 端口统一：插件页由底座在 /api/plugin/<包名>/ 发，同源、无需端口。
      // 覆写里只有 path 里有包名 —— name 取自路由参数 /plugin/:name，
      // 而路由是底座静态定义的，用户改不了。
      url.value = `/api/plugin/${encodeURIComponent(name.value)}/`
    } else {
      err.value = `${route.path} 的覆写里 external 为空，且不是 embed 型 —— 没有可打开的地址`
      return
    }
    title.value = row.title || ''
  } catch (e) {
    err.value = `读取菜单覆写失败：${e?.message || e}`
  }
}

function reload() { nonce.value++ }

function openExternal() {
  if (url.value) window.open(url.value, '_blank', 'noopener')
}

onMounted(resolve)
watch(() => route.path, resolve)
</script>

<style scoped>
.plugin-frame {
  display: flex;
  flex-direction: column;
  /* 与 EmptyView 同口径：内容区 = 视口 - 顶栏 */
  height: calc(100vh - 64px);
}
.pf-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
  background: var(--el-fill-color-blank, #fff);
  flex: 0 0 auto;
}
.pf-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #67c23a; flex: 0 0 auto;
}
.pf-dot.bad { background: #f56c6c; }
.pf-title { font-weight: 600; font-size: 14px; flex: 0 0 auto; }
.pf-url {
  color: var(--el-text-color-secondary, #909399);
  font-size: 12px;
  flex: 1 1 auto;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.pf-body { flex: 1 1 auto; min-height: 0; }
.pf-iframe { width: 100%; height: 100%; border: 0; display: block; }
.pf-empty { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; }
</style>
