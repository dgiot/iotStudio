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
        default: '420px',
      },
      regionpdata: {
        type: Object,
        default: () => {
          return {
            xdata: [],
            data: [],
            alldata: [],
            title1: '',
            title2: '',
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
            left: '2%',
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
            data: [regionpdata.title1, regionpdata.title2],
            textStyle: {
              color: '#ffffff',
            },
          },
          yAxis: [
            {
              name: '员工数量(人)',
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
              name: regionpdata.title2,
              type: 'bar',
              stack: 'vistors',
              barWidth: '40%',
              data: regionpdata.alldata,
              animationDuration,
            },
            {
              name: regionpdata.title1,
              type: 'bar',
              stack: 'vistors',
              barWidth: '40%',
              barGap: '-100%', // 添加此配置项即为重叠效果
              data: regionpdata.data,
              lineStyle: {
                color: '#555',
              },
              animationDuration,
            },
          ],
        })
      },
    },
  }
</script>
