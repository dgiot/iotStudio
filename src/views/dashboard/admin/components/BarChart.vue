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
      barchartdata: {
        type: Array,
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
      barchartdata: {
        deep: true,
        handler(val) {
          this.initChart(val)
        },
      },
    },
    mounted() {
      this.initChart(this.barchartdata)
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
      initChart(barchartdata) {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{a} <br/>{b} : {c}%',
          },
          grid: {
            // top:20,
            left: '5%',
            right: '2%',
            bottom: '7%',
            containLabel: true,
          },
          xAxis: [
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
              axisTick: {
                alignWithLabel: true,
                show: false,
              },
            },
          ],
          legend: {
            data: ['销售增长'],
            textStyle: {
              color: '#ffffff',
            },
          },
          yAxis: [
            {
              name: '销售增长(%)',
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#fff', // 坐标值得具体的颜色
                },
              },
              nameTextStyle: {
                color: '#ffffff',
                padding: 10,
                fontSize: 14,
              },
            },
          ],
          series: [
            {
              name: '销售增长',
              type: 'bar',
              // stack: 'vistors',
              barWidth: '40%',
              itemStyle: {
                normal: {
                  color: '#e67070',
                },
              },
              data: barchartdata.data,
              animationDuration,
            },
            // {
            //   name: 'pageB',
            //   type: 'bar',
            //   // stack: 'vistors',
            //   // barWidth: '40%',
            //   data: [80, 52, 200, 334, 390, 330, 220],
            //   animationDuration
            // }
          ],
        })
      },
    },
  }
</script>
