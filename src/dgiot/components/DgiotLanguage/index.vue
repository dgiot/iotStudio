<!--
 * @Author: h7ml
 * @Date: 2021-03-12 12:02:44
 * @LastEditTime: 2021-03-15 15:31:35
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\dgiot\components\DgiotLanguage\index.vue
 * @Description:
-->
<template>
  <el-dropdown v-if="theme.showLanguage" @command="handleCommand">
    <dgiot-icon icon="translate" :style="{ color: router ? '#1890ff' : '' }" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文简体</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
        <el-dropdown-item command="jp">日本語</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import getPageTitle from '@/utils/vue/pageTitle'

  export default {
    name: 'DgiotLanguage',
    computed: {
      router: function () {
        return this.$route.path == '/login' || this.$route.path == '/register'
      },
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      ...mapActions({
        changeLanguage: 'settings/changeLanguage',
      }),
      handleCommand(command) {
        this.changeLanguage(command)
        this.$i18n.locale = command
        document.title = getPageTitle(this.$route.meta.title)
      },
    },
  }
</script>
<style scoped>
  .language {
    cursor: pointer;
  }
</style>
