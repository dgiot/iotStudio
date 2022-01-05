<template>
  <div class="right-chart-2">
    <div class="rc1-header">月度耗电变化</div>

    <div class="rc1-chart-container">
      <!-- <div class="left">
        <div class="number">267</div>
        <div>设备运行总数</div>
      </div> -->

      <dv-charts class="right" :option="option" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightChart2',
    data() {
      return {
        option: {
          legend: {
            data: ['设备完好率'],
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
              '10/07',
              '10/08',
              '10/09',
              '10/10',
              '10/11',
              '10/12',
              '10/13',
              '10/14',
              '10/15',
            ],
            boundaryGap: false,
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
              formatter({ value }) {
                return value.toFixed(2)
              },
            },
            axisTick: {
              show: false,
            },
            min: 95,
            max: 100,
            interval: 0.5,
          },
          series: [
            {
              data: [
                99.56, 99.66, 99.84, 99.22, 99.11, 99.45, 99.44, 99.81, 99.84,
                99.32, 99.14, 99.45, 99.15, 99.45, 99.64, 99.89,
              ],
              type: 'line',
              name: '月度用电变化',
              smooth: true,
              lineArea: {
                show: true,
                gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)'],
              },
              linePoint: {
                radius: 4,
                style: {
                  fill: '#00db95',
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
  .right-chart-2 {
    width: 100%;
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

    // .left {
    //   width: 40%;
    //   font-size: 16px;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: center;
    //   align-items: center;

    //   .number {
    //     font-size: 34px;
    //     color: #096dd9;
    //     font-weight: bold;
    //     margin-bottom: 30px;
    //   }
    // }

    .right {
      flex: 1;
      padding-bottom: 20px;
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
</style>
