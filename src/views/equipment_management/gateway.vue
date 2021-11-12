<template>
  <div class="gateway">
    <el-card
      class="wayheader"
      shadow="always"
    >
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
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;

    .wayheader {
      width: 100%;
      height: 400px;

      .wayheaderone {
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        padding: 15px;
        background: #67c23a;

        .oneheader {
          display: inline-block;
          width: 200px;
          height: 50px;
          margin: 0 auto;
          font-size: 16px;
          line-height: 50px;
          color: white;
          text-align: center;
          background: #409eff;
        }

        .twoheader {
          display: inline-block;
          width: 200px;
          height: 50px;
          margin: 0 auto;
          margin-left: 100px;
          font-size: 14px;
          line-height: 50px;
          text-align: center;
          background: #909399;
        }

        .threeheader {
          display: inline-block;
          width: 300px;
          height: 50px;
          margin: 0 auto;
          margin-left: 100px;
          font-size: 14px;
          line-height: 50px;
          text-align: center;
          background: #909399;
        }
      }
    }
  }
</style>
