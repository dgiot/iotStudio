<!--
  EmptyView — 外链菜单项兜底视图
  url 型插件（外部服务）的菜单项点击后在新窗口打开（见 Sidebar external 分支），
  本视图仅为路由匹配兜底，提示用户从侧栏菜单打开。
-->
<template>
  <div class="empty">
    <el-empty description="外部服务页面：请从侧栏菜单点击打开（新窗口）" />
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
}
</style>
