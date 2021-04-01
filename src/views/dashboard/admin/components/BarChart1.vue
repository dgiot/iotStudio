<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
  // import * as echarts from 'echarts'
  // require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'
  import { regionData } from 'element-china-area-data'

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
      regionpdata: {
        type: Object,
        default: () => {
          return {
            xdata: [],
            data: [],
            title: '',
            formatter: '',
            name: '',
            color: '',
          }
        },
      },
    },
    data() {
      return {
        chart: null,
      }
    },
    watch: {
      regionpdata: {
        deep: true,
        handler(val) {
          this.initChart(val)
        },
      },
    },
    mounted() {
      this.initChart(this.regionpdata)
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
      initChart(regionpdata) {
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: regionpdata.formatter,
          },
          grid: {
            //   top:20,
            left: '10%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: regionpdata.xdata,
              axisTick: {
                alignWithLabel: true,
                show: false,
              },
              //   axisLabel:{
              //         interval:0,//横轴信息全部显示
              //         rotate:-30,//-30度角倾斜显示
              //     },
            },
          ],
          legend: {
            data: [regionpdata.title],
            textStyle: {
              color: '#ffffff',
            },
          },
          yAxis: [
            {
              name: regionpdata.name,
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
              name: regionpdata.title,
              type: 'bar',
              stack: 'vistors',
              barWidth: '40%',
              data: regionpdata.data,
              itemStyle: {
                normal: {
                  color: regionpdata.color,
                },
              },

              animationDuration,
            },
            // {
            //   name: 'pageB',
            //   type: 'bar',
            //   stack: 'vistors',
            //   barWidth: '60%',
            //   data: [80, 52, 200, 334, 390, 330, 220],
            //   animationDuration
            // }
          ],
        })
      },
    },
  }
</script>
