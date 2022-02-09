<template>
  <div class="right-chart-1">
    <div class="rc1-header">生产线指标趋势</div>

    <div class="rc1-chart-container">
      <!-- <div class="left">
        <div class="number">262</div>
        <div>设备运行总数</div>
      </div> -->

      <dv-charts class="right" :option="option" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightChart1',
    data() {
      return {
        option: {
          legend: {
            data: [
              {
                name: '主线电压',
                color: '#00baff',
              },
              {
                name: '主线电流',
                color: '#ff5ca9',
              },
              {
                name: '车间温度',
                color: '#3de7c9',
              },
              {
                name: '系统压力',
                color: '#f5d94e',
              },
            ],
            textStyle: {
              fill: '#fff',
            },
          },
          xAxis: {
            data: [
              '10/01',
              '10/02',
              '10/03',
              '10/04',
              '10/05',
              '10/06',
              '10/07',
            ],
            axisLine: {
              style: {
                stroke: '#999',
              },
            },
            axisLabel: {
              style: {
                fill: '#999',
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            data: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              style: {
                stroke: '#999',
              },
            },
            axisLabel: {
              style: {
                fill: '#999',
              },
            },
            axisTick: {
              show: false,
            },
            min: 0,
            max: 8,
          },
          series: [
            {
              name: '主线电压',
              data: [2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5],
              type: 'bar',
              barStyle: {
                fill: 'rgba(0, 186, 255, 0.4)',
              },
            },
            {
              name: '主线电流',
              data: [2.5, 3.5, 6.5, 6.5, 7.5, 6.5, 2.5],
              type: 'line',
              lineStyle: {
                stroke: '#ff5ca9',
              },
              linePoint: {
                radius: 4,
                style: {
                  fill: '#ff5ca9',
                  stroke: 'transparent',
                },
              },
            },
            {
              name: '车间温度',
              data: [1.3, 2.3, 5.3, 5.3, 6.3, 5.3, 1.3],
              type: 'line',
              smooth: true,
              lineArea: {
                show: true,
                gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)'],
              },
              lineStyle: {
                lineDash: [5, 5],
              },
              linePoint: {
                radius: 4,
                style: {
                  fill: '#00db95',
                },
              },
            },
            {
              data: [0.2, 1.2, 4.2, 4.2, 5.2, 4.2, 0.2],
              type: 'line',
              name: '系统压力',
              lineArea: {
                show: true,
                gradient: [
                  'rgba(245, 217, 79, 0.8)',
                  'rgba(245, 217, 79, 0.2)',
                ],
              },
              lineStyle: {
                stroke: '#f5d94e',
              },
              linePoint: {
                radius: 4,
                style: {
                  fill: '#f5d94e',
                  stroke: 'transparent',
                },
              },
            },
          ],
        },
      }
    },
  }
</script>

<style lang="scss">
  .right-chart-1 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .rc1-header {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      text-indent: 20px;
      margin-top: 10px;
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
        font-size: 16px;
        color: #096dd9;
        font-weight: bold;
        margin-bottom: 30px;
      }
    }

    .right {
      flex: 1;
      padding-bottom: 20px;
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
</style>
