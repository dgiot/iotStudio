<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  // import * as echarts from 'echarts'
  // require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'
  import { format } from 'path'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart',
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '250px',
      },
    },
    data() {
      return {
        chart: null,
      }
    },
    mounted() {
      this.initChart()
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}亿<br/>占当年销售额：{d}%',
          },
          legend: {
            left: 'vertical',
            bottom: '10',
            data: ['2012年', '2013年', '2014年', '2015年', '2016年', '2017年'],
            textStyle: {
              color: '#ffffff',
            },
          },
          // calculable: true,
          //  grid: {
          //   top:100,
          //   left: '2%',
          //   right: '2%',
          //   bottom: '3%',
          //   containLabel: true
          // },
          series: [
            {
              name: '科技投入占比',
              type: 'pie',
              // roseType: 'radius',//饼图形状扇形
              // radius: '55%',
              radius: ['50%', '60%'],
              center: ['50%', '38%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: `近六年共计18.1亿元`,
                },
                // emphasis: {
                //     show: true,
                //     textStyle: {
                //         fontSize: '30',
                //         fontWeight: 'bold'
                //     }
                // }
              },
              data: [
                { value: 2.8, name: '2012年' },
                { value: 2.9, name: '2013年' },
                { value: 2.9, name: '2014年' },
                { value: 3, name: '2015年' },
                { value: 3.2, name: '2016年' },
                { value: 3.3, name: '2017年' },
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600,
            },
          ],
        })
      },
    },
  }
</script>
