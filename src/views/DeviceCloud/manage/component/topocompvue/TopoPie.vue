<template>
  <div
    class="topoPie"
    :style="{
      width: comp.width + 'px',
      height: comp.height + 'px',
    }"
  >
    <ve-pie
      :data="chartData"
      :extend="extend"
      height="100%"
      :settings="chartSettings"
      width="100%"
    />
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getCardDevice, getDabDevice, getDevice } from '@/api/Device/index.js'
  // import { simpleDataConverter } from 'v-charts-v2/lib/converter'
  export default {
    name: 'TopoPie',
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
        type: 'pie',
        // radius: comp.width * 0.4,
        // labelAlias: {
        //   PV: '访问用户',
        //   Order: '下单用户',
        // },
      }

      this.extend = {
        series: {
          type: 'pie',
          radius: ['20%', '50%'],
          itemStyle: {
            borderRadius: 2,
            borderColor: '#fff',
            borderWidth: 1,
          },
          left: 10,
          right: 0,
          top: '-30%',
          // offsetY: 10,
          // showAllSymbol: true,
          // symbol: 'none', //去掉圆点
          // smooth: true,
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
        // grid: {
        //   left: 10,
        //   right: 0,
        //   top: 0,
        //   width: '96%',
        //   height: '90%',
        // },
      }
      return {
        top: 10,
        chartData: {
          columns: ['名称', '数量'],
          rows: [
            { 名称: '产品', 数量: 8 },
            { 名称: '设备', 数量: 0 },
            { 名称: '告警数', 数量: 15 },
          ],
        },
        timer: '',
      }
    },
    computed: {
      ...mapGetters({
        _product_count: 'dashboard/_product_count', //产品数量
        _dev_count: 'dashboard/_dev_count', //设备总数
        _dev_online_count: 'dashboard/_dev_online_count', //在线
        _dev_off_count: 'dashboard/_dev_off_count', //离线
      }),
    },
    created() {
      this.chartData = {
        columns: ['名称', '数量'],
        rows: [
          { 名称: '设备总数', 数量: this._dev_count },
          { 名称: '在线设备', 数量: this._dev_online_count },
          { 名称: '离线设备', 数量: this._dev_off_count },
        ],
      }
      // this.top = 100 - this.comp.height * 0.1
    },
    mounted() {
      // this.queryChart(this.$route.query.deviceid)
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
            console.log(res, 'res charts')
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
            console.log('this.chartData', this.chartData)
            this.loading = false
            this.dataEmpty = false
          })
          .catch((e) => {
            console.log(e)
            this.loading = false
            // this.$baseColorfullLoading().close()
          })
      },
    },
  }
</script>
<style scoped></style>
