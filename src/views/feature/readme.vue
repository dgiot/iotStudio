<template>
  <el-card>
    <el-alert :closable="false" :title="title" type="success" />
  </el-card>
</template>
<script>
  export default {
    name: 'Readme',
    data() {
      return {
        title: '新功能测试界面，为了方便开发新功能/测试时不重启页面的统一配置',
      }
    },
  }
</script>
<style lang="scss" scoped></style>
