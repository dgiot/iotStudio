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
    name: 'LeftChart4',
    data() {
      return {
        config: {
          // color: '#fff',
          title: {
            text: '耗电量',
            style: {
              fill: '#fff',
              fontSize: 17,
              fontWeight: 'bold',
              textAlign: 'center',
              textBaseline: 'bottom',
            },
          },
          xAxis: {
            name: '月份',
            nameGap: 5,
            data: ['5月份', '6月份', '7月份', '8月份', '9月份'],
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
            name: '电量',
            data: 'value',
            // nameGap: 5,
            nameTextStyle: {
              fill: '#fff',
              fontSize: 10,
            },
            axisLine: {
              style: {
                stroke: '#fff',
                lineWidth: 2,
              },
            },
            axisLabel: {
              style: {
                fill: '#fff',
                fontSize: 8,
                rotate: 0,
              },
            },
          },
          series: [
            {
              data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
              type: 'bar',
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
    height: 40%;
    display: flex;
    // background-color: #0f599a;
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
  .left-chart-4 {
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
