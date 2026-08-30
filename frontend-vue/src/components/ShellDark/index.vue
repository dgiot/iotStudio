<!--
  Shell — DGAIOT IOT 底座统一布局（左侧菜单 · 插件模式 · 业务系统风格）

  业务系统化设计（2026-08-31 改版，防 PPT 化）：
  - 图标一律线性 SVG（stroke 1.6 · 16px），不用 emoji
  - 品牌区纯色小方块 + 首字，无渐变无阴影
  - 导航紧凑（小字距/细分割/左条选中态）
  - 侧栏纯色 + 细边框，无装饰性渐变

  配置项：
    logo    品牌字（默认取 title 首字符，'auto' 或省略即自动）
    title   工程名称
    tagline 口径副标题（一句话，写演示口径）
    tabs    业务导航 [{ key, label, icon? }]  icon=SVG 池 key（见 ICONS），缺省按序取池
    plugins 底座功能入口 [{ key, icon, label, url?, tab? }]  icon 同上
            url  → 外链服务（新标签打开：本体图谱/DSH 工具族）
            tab  → 内置物联网功能（切到工程内通用视图：设备/产品/通道管理）
    active  当前激活 tab
    version 版本号（侧栏底部）
    demo    演示口径标注（侧栏底部）
  emit:
    change  业务 tab 切换
-->
<template>
  <div class="shell">
    <aside class="side">
      <div class="brand">
        <span class="logo">{{ logoChar }}</span>
        <div class="bt">
          <h1>{{ title }}</h1>
          <p v-if="tagline">{{ tagline }}</p>
        </div>
      </div>
      <div class="nav">
        <template v-if="tabs.length">
          <div class="grp">业务导航</div>
          <button v-for="(t, i) in tabs" :key="t.key" :class="{ on: active === t.key }" @click="$emit('change', t.key)">
            <svg v-if="iconOf(t.icon || ICONS[i % ICONS.length])" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, di) in iconOf(t.icon || ICONS[i % ICONS.length])" :key="di" :d="d" />
            </svg>
            <span v-else class="ic-emoji">{{ t.icon || ICONS[i % ICONS.length] }}</span>
            <span class="lb">{{ t.label }}</span>
          </button>
        </template>
        <template v-if="plugins && plugins.length">
          <div class="grp">IOT 底座</div>
          <!-- v-for 提升到 template：v-if 与 v-for 同元素会触发 Vue 3 编译提升（a.p.url 运行时 TypeError） -->
          <template v-for="p in plugins" :key="p.key">
            <a v-if="p.url" :href="p.url" target="_blank" class="plug">
              <svg v-if="iconOf(p.icon)" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path v-for="(d, di) in iconOf(p.icon)" :key="di" :d="d" />
              </svg>
              <span v-else class="ic-emoji">{{ p.icon }}</span>
              <span class="lb">{{ p.label }}</span>
            </a>
            <button v-else :class="{ on: active === p.tab }" class="plug" @click="$emit('change', p.tab)">
              <svg v-if="iconOf(p.icon)" class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path v-for="(d, di) in iconOf(p.icon)" :key="di" :d="d" />
              </svg>
              <span v-else class="ic-emoji">{{ p.icon }}</span>
              <span class="lb">{{ p.label }}</span>
            </button>
          </template>
        </template>
      </div>
      <div class="side-foot">
        <div class="v">v{{ version }}</div>
        <div class="d"><i></i>{{ demo }}</div>
      </div>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ICONS, ICON_KEYS } from '../../assets/base-icons.js'

const ICON_ORDER = ICON_KEYS
const props = defineProps({
  logo: { type: String, default: 'auto' },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  tabs: { type: Array, required: true },
  plugins: { type: Array, default: () => [] },
  active: { type: String, required: true },
  version: { type: String, default: '1.0.0' },
  demo: { type: String, default: '全部数据为演示数据' },
})
defineEmits(['change'])
const iconOf = (key) => ICONS[key]
const logoChar = computed(() => props.logo && props.logo !== 'auto' ? props.logo : props.title.trim().charAt(0))
</script>

<style scoped>
.shell { display: flex; min-height: 100vh; }
.side {
  width: 216px; flex-shrink: 0;
  background: #161b22;
  border-right: 1px solid #21262d;
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
}
.brand { display: flex; align-items: center; gap: 10px; padding: 14px 14px 12px; border-bottom: 1px solid #21262d; }
.logo {
  width: 30px; height: 30px; border-radius: 6px; font-size: 15px; font-weight: 700;
  color: #fff; background: #1f6feb; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Microsoft YaHei', system-ui, sans-serif;
}
.bt { min-width: 0; }
.brand h1 { font-size: 14px; color: #e6edf3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand p { font-size: 10px; color: #6e7681; margin-top: 2px; line-height: 1.5; }
.nav { flex: 1; overflow-y: auto; padding: 8px 8px 16px; display: flex; flex-direction: column; gap: 1px; }
.grp {
  font-size: 11px; color: #6e7681; letter-spacing: 1px;
  margin: 10px 8px 4px;
}
.nav button, .nav a.plug {
  display: flex; align-items: center; gap: 8px;
  background: transparent; border: none; border-radius: 6px;
  padding: 7px 10px; font-size: 13px; color: #8b949e; cursor: pointer;
  text-align: left; text-decoration: none; transition: all .15s;
  position: relative;
}
.nav button:hover, .nav a.plug:hover { background: #21262d; color: #e6edf3; }
.nav button.on {
  background: rgba(31, 111, 235, .12); color: #58a6ff; font-weight: 600;
}
.nav button.on::before {
  content: ''; position: absolute; left: 0; top: 22%; bottom: 22%; width: 3px;
  background: #1f6feb; border-radius: 2px;
}
.ic { width: 16px; height: 16px; flex-shrink: 0; }
.ic-emoji { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
.lb { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.side-foot {
  border-top: 1px solid #21262d; padding: 9px 14px; font-size: 10px; color: #484f58;
  line-height: 1.7;
}
.side-foot .v { margin-bottom: 1px; }
.side-foot .d { display: flex; align-items: center; gap: 5px; }
.side-foot .d i { width: 6px; height: 6px; border-radius: 50%; background: #d29922; display: inline-block; }
.main { flex: 1; min-width: 0; padding: 24px 28px; }
@media (max-width: 900px) {
  .side { width: 60px; }
  .bt, .grp, .lb, .side-foot { display: none; }
  .brand { justify-content: center; padding: 12px 8px; }
  .nav { align-items: center; }
  .nav button, .nav a.plug { justify-content: center; padding: 9px; }
  .main { padding: 16px; }
}
</style>
