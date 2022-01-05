<template>
  <div id="left-chart-2">
    <div class="left-chart-2" style="width: 100%; height: 10%">
      <div class="lc2-header" style="width: 50%">出口压力</div>
      <div class="lc2-details" style="width: 50%">频率</div>
    </div>
    <div class="left-chart-2" style="width: 100%; height: 90%">
      <dv-active-ring-chart
        :config="config"
        style="width: 50%; height: 200px"
      />
      <dv-charts
        class="lc2-chart"
        :option="option"
        style="width: 50%; height: 200px"
      />
    </div>
    <dv-decoration-2 style="height: 10px" />
  </div>
</template>

<script>
  export default {
    name: 'LeftChart2',
    data() {
      return {
        option: {
          series: [
            {
              type: 'pie',
              data: [
                { name: '产品大类1', value: 93 },
                { name: '大类2', value: 32 },
                { name: '分类3', value: 65 },
                { name: '分类4', value: 44 },
                { name: '其他', value: 52 },
              ],
              radius: ['45%', '65%'],
              insideLabel: {
                show: true,
              },
              outsideLabel: {
                show: false,
              },
              // },
              // outsideLabel: {
              //   labelLineEndLength: 0,
              //   // formatter: "{percent}%\n{name}",
              //   // style: {
              //   //   fontSize: 14,
              //   //   fill: "#fff",
              //   // },
              // },
            },
          ],
          color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
        },
        config: {
          data: [
            {
              name: '时尚彩壳',
              value: 55,
            },
            {
              name: '青春彩壳',
              value: 120,
            },
            {
              name: '华为系列',
              value: 78,
            },
            {
              name: '小米系列',
              value: 66,
            },
            {
              name: '苹果系列',
              value: 80,
            },
          ],
          digitalFlopStyle: {
            fontSize: 12,
            fill: '#fff',
          },
        },
      }
    },
  }
</script>

<style lang="scss">
  #left-chart-2 {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
  }
  .left1piechart {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .left-chart-2 {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: row;

    .lc2-header {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      text-indent: 30px;
      margin-top: 10px;
    }

    .lc2-details {
      height: 40px;
      font-size: 16px;
      display: flex;
      align-items: center;
      text-indent: 30px;

      span {
        color: #096dd9;
        font-weight: bold;
        font-size: 35px;
        margin-left: 20px;
      }
    }

    .lc2-chart {
      height: calc(~'100% - 80px');
    }
  }
</style>
