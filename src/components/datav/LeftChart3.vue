<template>
  <div class="left-chart-3">
    <div class="lc3-header">订单实时轮播</div>
    <!-- <div class="lc3-details">设备运行总数<span>245</span></div> -->
    <dv-scroll-board :config="config" />
  </div>
</template>

<script>
  export default {
    name: 'LeftChart3',
    data() {
      return {
        config: {
          data: [
            ['液晶显示器', '月累计：4起'],
            ['收费键盘', '月累计：3起'],
            ['车牌识别仪', '月累计：3起'],
            ['自动栏杆机', '月累计：3起'],
            ['称重仪表盘', '月累计：2起'],
            ['门架机柜空调', '月累计：1起'],
          ],
          index: true,
          columnWidth: [30, 100],
          align: ['center'],
          oddRowBGC: 'rgba(9, 37, 50, 0.4)',
          evenRowBGC: 'rgba(10, 32, 50, 0.3)',
        },
      }
    },
  }
</script>

<style lang="scss">
  .left-chart-3 {
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: column;

    .lc3-header {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      text-indent: 20px;
      margin-top: 10px;
    }

    .lc3-details {
      height: 20px;
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

    .lc3-chart {
      flex: 1;
    }
  }
</style>
