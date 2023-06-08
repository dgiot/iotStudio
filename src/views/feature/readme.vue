<template>
  <el-alert :title="title" type="success" />
</template>
<script>
  export default {
    name: 'Readme',
    props: {
      title: {
        required: false,
        default:
          '新功能测试界面，为了方便开发新功能/测试时不重启页面的统一配置',
        type: String,
      },
    },
    data() {
      return {}
    },
  }
</script>
<style lang="scss" scoped></style>
