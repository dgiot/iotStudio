<template>
  <div class="left-chart-1">
    <div class="lc1-header">分类统计销量</div>
    <!-- <div class="lc1-details">设备运行总数<span>430</span></div> -->
    <dv-capsule-chart class="lc1-chart" :config="config" />
    <dv-decoration-2 style="height: 10px" />
  </div>
</template>

<script>
  export default {
    name: 'LeftChart1',
    data() {
      return {
        config: {
          data: [
            {
              name: '产品系列1',
              value: 167,
            },
            {
              name: '产品系列2',
              value: 67,
            },
            {
              name: '产品3',
              value: 123,
            },
            {
              name: '产品4',
              value: 55,
            },
            {
              name: '其他',
              value: 98,
            },
          ],
          colors: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          unit: '件',
        },
      }
    },
  }
</script>

<style lang="scss">
  .left-chart-1 {
    width: 100%;
    height: 30%;
    display: flex;
    flex-grow: 0;
    flex-direction: column;

    .lc1-header {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      text-indent: 20px;
      margin-top: 10px;
    }

    .lc1-details {
      height: 40px;
      font-size: 16px;
      display: flex;
      align-items: center;
      text-indent: 20px;

      span {
        color: #096dd9;
        font-weight: bold;
        font-size: 35px;
        margin-left: 20px;
      }
    }

    .lc1-chart {
      flex: 1;
    }
  }
</style>
