<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  // import * as echarts from 'echarts'
  // require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'

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
        default: '350px',
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
      chartData: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        chart: null,
        sidebarElm: null,
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        },
      },
    },
    mounted() {
      this.initChart()
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      }

      // 监听侧边栏的变化
      this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.sidebarElm &&
        this.sidebarElm.addEventListener(
          'transitionend',
          this.sidebarResizeHandler
        )
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHandler)
      }

      this.sidebarElm &&
        this.sidebarElm.removeEventListener(
          'transitionend',
          this.sidebarResizeHandler
        )

      this.chart.dispose()
      this.chart = null
    },
    methods: {
      sidebarResizeHandler(e) {
        if (e.propertyName === 'width') {
          this.__resizeHandler()
        }
      },
      setOptions(chartData) {
        this.chart.setOption({
          backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
            {
              offset: 0,
              color: '#f7f8fa',
            },
            {
              offset: 1,
              color: '#cdd0d5',
            },
          ]),
          title: {
            text: '1990 与 2015 年各国家人均寿命与 GDP',
          },
          legend: {
            right: 10,
            data: ['1990', '2015'],
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed',
              },
            },
            scale: true,
          },
          series: [
            {
              name: '1990',
              data: chartData[0],
              type: 'scatter',
              symbolSize: function (data) {
                return Math.sqrt(data[2]) / 5e2
              },
              label: {
                emphasis: {
                  show: true,
                  formatter: function (param) {
                    return param.data[3]
                  },
                  position: 'top',
                },
              },
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(120, 36, 50, 0.5)',
                  shadowOffsetY: 5,
                  color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                    {
                      offset: 0,
                      color: 'rgb(251, 118, 123)',
                    },
                    {
                      offset: 1,
                      color: 'rgb(204, 46, 72)',
                    },
                  ]),
                },
              },
            },
            {
              name: '2015',
              data: chartData[1],
              type: 'scatter',
              symbolSize: function (data) {
                return Math.sqrt(data[2]) / 5e2
              },
              label: {
                emphasis: {
                  show: true,
                  formatter: function (param) {
                    return param.data[3]
                  },
                  position: 'top',
                },
              },
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(25, 100, 150, 0.5)',
                  shadowOffsetY: 5,
                  color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                    {
                      offset: 0,
                      color: 'rgb(129, 227, 238)',
                    },
                    {
                      offset: 1,
                      color: 'rgb(25, 183, 207)',
                    },
                  ]),
                },
              },
            },
          ],
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
    },
  }
</script>
