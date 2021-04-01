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
        default: '250px',
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
      chartData: {
        type: Object,
        required: true,
        default: () => {
          return {
            expectedData: [],
            expectedData1: [],
            actualData: [],
            title: '1',
          }
        },
      },
    },
    data() {
      return {
        chart: null,
        sidebarElm: null,
      }
    },
    // 不需要watch,watch会影响首次（如果在tabs中）渲染
    //   watch: {
    //     chartData: {
    //       deep: true,
    //       handler(val) {
    //          this.setOptions(val)
    //       }
    //     },
    //   },
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
      setOptions({ expectedData1, actualData, title } = {}) {
        this.chart.setOption({
          xAxis: {
            data: actualData,
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            //   axisLine:{
            //     lineStyle:{
            //         color:'#fff',
            //         // width:1,//这里是为了突出显示加上的
            //     }
            //   }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,

            containLabel: true,
          },
          title: {
            text: title,
            textStyle: {
              color: 'black',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            padding: [5, 10],
          },
          yAxis: {
            name: '单位(%)',
            axisTick: {
              show: false,
            },
            //   axisLine:{
            //     lineStyle:{
            //         color:'#fff',
            //         // width:1,//这里是为了突出显示加上的
            //     }
            //   }
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
          legend: {
            data: ['企业内销比重'],
            textStyle: {
              color: '#ffffff',
            },
          },
          series: [
            //     {
            //   name: '新产品产值率',
            //   symbol: 'circle',
            //   symbolSize: 10,
            //   itemStyle: {
            //     normal: {
            //       color: '#dda38f',
            //       lineStyle: {
            //         color: '#dda38f',
            //         width: 2,
            //         type: 'dashed',
            //       },
            //     //   areaStyle: {
            //     //     color: '#FF005A'
            //     //   }
            //     }
            //   },
            //   smooth: true,
            //   type: 'line',
            //   data: expectedData,
            //   animationDuration: 2800,
            // //   animationEasing: 'cubicInOut',

            // },
            {
              name: '企业内销比重',
              symbol: 'circle',
              symbolSize: 10,
              itemStyle: {
                normal: {
                  color: '#fffff',
                  lineStyle: {
                    color: '#33FF00',
                    width: 2,
                    type: 'dashed',
                  },
                  //   areaStyle: {
                  //     color: '#FF005A'
                  //   }
                },
              },
              //   smooth: true,
              type: 'line',
              data: expectedData1,
              animationDuration: 2800,
              //   animationEasing: 'cubicInOut'
            },
          ],
        })
      },
      initChart() {
        setTimeout(() => {
          this.chart = echarts.init(this.$el, 'macarons')
          this.setOptions(this.chartData)
        }, 1000)
      },
    },
  }
</script>
