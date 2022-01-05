<template>
  <div class="right-chart-1">
    <div class="rc1-header">目标1达成度</div>

    <div class="rc1-chart-container">
      <div class="right">
        <dv-water-level-pond
          :config="config"
          style="width: 150px; height: 200px"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightChart1',
    data() {
      return {
        config: {
          data: [66],
        },
      }
    },
  }
</script>

<style lang="scss">
  .right-chart-1 {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .rc1-header {
      font-size: 16px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }

    .rc1-chart-container {
      flex: 1;
      display: flex;
    }

    .left {
      width: 30%;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .number {
        font-size: 34px;
        color: #096dd9;
        font-weight: bold;
        margin-bottom: 30px;
      }
    }

    .right {
      flex: 1;
      padding-bottom: 20px;
      padding-right: 20px;
      padding-left: 40px;
      box-sizing: border-box;
    }
  }
</style>
