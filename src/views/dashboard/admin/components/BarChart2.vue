<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  // import * as echarts from 'echarts'
  // require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'

  const animationDuration = 6000

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
      persondata: {
        type: Object,
        default: () => {
          ;[]
        },
      },
    },
    data() {
      return {
        chart: null,
      }
    },
    watch: {
      persondata: {
        deep: true,
        handler(val) {
          this.initChart(val)
        },
      },
    },
    mounted() {
      this.initChart(this.persondata)
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
      initChart(persondata) {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            //   formatter: '{a} <br/>{b} : {c}个'
          },
          grid: {
            top: 20,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
          },
          // title:{
          //   text:'日用量趋势'
          // },
          xAxis: [
            {
              name: '(家)',
              type: 'value',
              boundaryGap: [0, 0.01],
              axisTick: {
                alignWithLabel: true,
                show: false,
              },
            },
          ],
          legend: {
            data: ['水泵企业数量', '上市企业数量'],
            textStyle: {
              color: '#ffffff',
            },
          },
          yAxis: [
            {
              type: 'category',
              data: [
                '2012年',
                '2013年',
                '2014年',
                '2015年',
                '2016年',
                '2017年',
              ],
              inverse: true,
              axisTick: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '水泵企业数量',
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: persondata.data,
              itemStyle: {
                normal: {
                  color: '#0066FF',
                },
              },
              animationDuration,
            },
            {
              name: '上市企业数量',
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: [2, 2, 2, 2, 3, 4],
              itemStyle: {
                normal: {
                  color: '#33FFFF',
                },
              },
              animationDuration,
            },
          ],
        })
      },
    },
  }
</script>
