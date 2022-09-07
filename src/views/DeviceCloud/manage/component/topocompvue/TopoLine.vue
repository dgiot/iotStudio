<template>
  <div
    class="topoLine"
    :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
  >
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
      }
      return {
        chartData: {
          columns: ['date', '数据'],
          rows: [
            { date: '2022-08-16', 数据: 0 },
            { date: '2022-08-17', 数据: 0 },
            { date: '2022-08-18', 数据: 0 },
          ],
        },
        timer: '',
      }
    },
    mounted() {
      this.queryChart(this.$route.query.deviceid)
      // this.timer = setInterval(() => {
      //   console.log('这是line vcharts')
      //   console.log('this.$route.query', this.$route.query)
      //   this.chartData.rows[0].temp = Math.round(Math.random() * 20 + 20)
      //   this.chartData.rows[1].temp = Math.round(Math.random() * 50 + 10)
      //   this.chartData.rows[2].temp = Math.round(Math.random() * 10 + 20)
      // }, 1000)
    },
    destroyed() {
      clearInterval(this.timer)
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
