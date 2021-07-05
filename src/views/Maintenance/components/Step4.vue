<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">{{ detail }}</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">{{ step }}</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {
      detail: {
        type: Object,
        default: () => {},
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        activeName: 'first',
      }
    },
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
