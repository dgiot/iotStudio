<template>
  <div id="left-chart-4">
    <dv-charts
      :option="config"
      style="width: 100%; height: 100%; margin: 0 auto"
    />
  </div>
</template>

<script>
  export default {
    name: 'CenterChart1',
    props: {
      detailInfo: {
        type: Object,
        default() {
          return {
            lineColor: '',
            yData: [],
            yName: '',
            xData: [],
          }
        },
      },
    },
    data() {
      return {
        config: {
          grid: {
            top: '15%',
            bottom: '15%',
            Left: '10%',
            Right: '10%',
          },
          xAxis: {
            name: '时间',
            data: [
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '23:00',
              '23:20',
              '23:50',
              '01:50',
            ],
            nameTextStyle: {
              fill: '#fff',
              fontSize: 10,
            },
            axisLine: {
              style: {
                stroke: '#fff',
                lineWidth: 1,
              },
            },
            axisLabel: {
              style: {
                fill: '#fff',
                fontSize: 10,
                rotate: 0,
              },
            },
          },
          yAxis: {
            name: this.detailInfo.yName,
            data: 'value',
            nameTextStyle: {
              fill: '#fff',
              fontSize: 10,
            },
            axisLine: {
              style: {
                stroke: '#fff',
                lineWidth: 1,
              },
            },
            axisLabel: {
              style: {
                fill: '#fff',
                fontSize: 10,
                rotate: 0,
              },
            },
            splitLine: {
              show: false,
            },
          },

          series: [
            {
              data: this.detailInfo.yData,
              type: 'line',
              smooth: true,
              lineStyle: {
                lineWidth: 1,
                stroke: this.detailInfo.lineColor,
                // color: 'FF0000',
              },
              lineArea: {
                show: true,
                gradient: ['#fff', this.detailInfo.lineColor],
              },
            },
          ],
        },
      }
    },
  }
</script>
<style lang="scss">
  #left-chart-4 {
    width: 94%;
    height: 50%;
    display: flex;
    // background-color: #0f599a;
    flex-direction: column;
    border-radius: 10px;
  }
</style>
