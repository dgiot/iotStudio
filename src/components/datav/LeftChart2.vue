<template>
  <div id="left-chart-2">
    <div class="left-chart-2" style="width: 100%; height: 80%">
      <!-- <dv-active-ring-chart
        :config="config"
        style="width: 90%; height: 100px; margin: 0 auto"
      /> -->
      <dv-charts
        :option="option"
        style="width: 90%; height: 100px; margin: 0 auto"
      />
      <!-- <dv-charts
        class="lc2-chart"
        :option="option"
        style="width: 50%; height: 200px"
      /> -->
    </div>
    <div class="left-chart-2" style="width: 100%; height: 20%">
      <span class="lc2-header" style="margin: 0 auto">出口压力</span>
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
              type: 'gauge',
              color: '#fff',
              radius: '80%',
              data: [
                {
                  name: 'itemA',
                  value: 54,
                  gradient: ['#4cc0ef', '#031636'],
                },
              ],
              max: 120,
              axisLabel: {
                formatter: '{value}',
                style: {
                  color: '#fff',
                  fontSize: 8,
                  rotate: 0,
                },
              },
              pointer: {
                style: {
                  // 可以调节scale的值放大缩小指针
                  scale: [1, 1],
                  fill: '#ccc',
                },
              },
              details: {
                show: true,
                offset: [0, 20],
                formatter: '{value}', //展示的具体值
                style: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: '#fff',
                },
              },
              animationCurve: 'easeOutBack',
            },
          ],
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
    width: 50%;
    // height: 30%;
    display: flex;
    background-color: #0f599a;
    flex-direction: column;
    border-radius: 10px;
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
      // text-indent: 30px;
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
