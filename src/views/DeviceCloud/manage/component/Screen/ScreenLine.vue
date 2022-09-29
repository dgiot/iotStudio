<template>
  <div class="topoLine" :style="{ width: '100%', height: '100%' }">
    <ve-line
      :data="chartData"
      :extend="extend"
      height="100%"
      :settings="chartSettings"
      width="100%"
    />
  </div>
</template>

<script>
  import { getCardDevice, getDabDevice, getDevice } from '@/api/Device/index.js'
  // import { simpleDataConverter } from 'v-charts-v2/lib/converter'
  export default {
    name: 'TopoLine',
    props: {
      comp: {
        type: Object,
        default: () => ({
          type: 'line',
          width: 200,
          hieght: 120,
        }),
      },
    },
    data() {
      this.chartSettings = {
        labelAlias: {
          PV: '访问用户',
          Order: '下单用户',
        },
      }
      this.extend = {
        series: {
          type: 'line',
          showAllSymbol: true,
          symbol: 'none', //去掉圆点
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0, // 0% 位置颜色
                color: '#055b7a',
              },
              {
                offset: 0.5,
                color: '#1a518b',
              },
              {
                offset: 1, // 100% 位置颜色
                color: '#1d718f',
              },
            ]), //区域颜色
          },
          // center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 2,
            borderColor: '#fff',
            borderWidth: 1,
          },
          // left: 10,
          // right: 0,
          // top: '-30%',
          // offsetY: 10,
          // showAllSymbol: true,
          // symbol: 'none', //去掉圆点
        },
        legend: {
          textStyle: {
            color: '#fff',
          },
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        grid: {
          left: 10,
          right: 0,
          bottom: 0,
          width: '96%',
          height: '90%',
        },
        dataZoom: [
          {
            type: 'inside', //允许鼠标滚动缩放数据,数据为动态时关闭
          },
        ],
      }
      return {
        chartData: {
          columns: ['date', '湿度', '温度'],
          rows: [
            { date: '2022-08-15', 湿度: 94 },
            { date: '2022-08-16', 湿度: 94, 温度: 31 },
            { date: '2022-08-17', 湿度: 80, 温度: 36 },
            { date: '2022-08-18', 湿度: 65, 温度: 37.5 },
            { date: '2022-08-19', 湿度: 78, 温度: 35.5 },
            { date: '2022-08-28', 湿度: 87, 温度: 38 },
            { date: '2022-09-18', 湿度: 76.5, 温度: 37.5 },
          ],
        },
        timer: '',
      }
    },
    mounted() {
      // this.queryChart(this.$route.query.deviceid)
      // this.timer = setInterval(() => {
      //   console.log('这是line vcharts')
      //   // console.log('this.$route.query', this.$route.query)
      //   this.chartData.rows[0].湿度 = Math.round(Math.random() * 20 + 40)
      //   this.chartData.rows[1].湿度 = Math.round(Math.random() * 50 + 30)
      //   this.chartData.rows[2].湿度 = Math.round(Math.random() * 10 + 50)
      // }, 1000)
    },
    destroyed() {
      // clearInterval(this.timer)
    },
    methods: {
      async queryChart(deviceid) {
        let endtime = new Date().getTime()
        let starttime = endtime - 1000 * 60 * 60 * 24 * 7
        let params = {
          starttime: starttime,
          endtime: endtime,
          interval: '30m',
          keys: '*',
          limit: 50,
          function: 'last',
          style: 'line',
        }
        await getDabDevice(deviceid, params)
          .then((res) => {
            // this.$baseColorfullLoading().close()
            if (res?.chartData?.rows.length > 0) {
              const { chartData = {} } = res
              this.chartData = chartData
              this.$nextTick(() => {
                setTimeout(() => {
                  this.loading = true
                  this.toggleChart('line')
                }, 1000)
              })
            }
            this.loading = false
            this.dataEmpty = false
          })
          .catch((e) => {
            this.loading = false
            // this.$baseColorfullLoading().close()
          })
      },
    },
  }
</script>
<style scoped></style>
