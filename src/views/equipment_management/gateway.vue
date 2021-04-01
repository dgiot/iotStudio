<template>
  <div class="gateway">
    <el-card shadow="always" class="wayheader">
      <div class="wayheaderone">
        <span class="oneheader">网络设备</span>
        <span class="twoheader">网络层级:{{ cengji }}</span>
        <span class="threeheader" />
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cengji: 2,
      }
    },
    mounted() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .gateway {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    box-sizing: border-box;
    .wayheader {
      height: 400px;
      width: 100%;
      .wayheaderone {
        height: 80px;
        width: 100%;
        background: #67c23a;
        padding: 15px;
        box-sizing: border-box;
        .oneheader {
          display: inline-block;
          height: 50px;
          width: 200px;
          background: #409eff;
          line-height: 50px;
          text-align: center;
          margin: 0 auto;
          color: white;
          font-size: 16px;
        }
        .twoheader {
          display: inline-block;
          height: 50px;
          width: 200px;
          background: #909399;
          line-height: 50px;
          text-align: center;
          margin: 0 auto;
          margin-left: 100px;
          font-size: 14px;
        }
        .threeheader {
          display: inline-block;
          height: 50px;
          width: 300px;
          background: #909399;
          line-height: 50px;
          text-align: center;
          margin: 0 auto;
          margin-left: 100px;
          font-size: 14px;
        }
      }
    }
  }
</style>
