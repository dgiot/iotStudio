<template>
  <div
    :class="className"
    :style="{ height: height, width: width }"
  />
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
      // chartData: {
      //   type: Array,
      //   required: true
      // }
    },
    data() {
      return {
        chart: null,
        sidebarElm: null,
      }
    },
    // watch: {
    //   chartData: {
    //     deep: true,
    //     handler(val) {
    //       this.setOptions(val);
    //     }
    //   }
    // },
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
      setOptions() {
        var data = [100, 80, 60, 40]
        var titlename = ['拱墅区', '余杭区', '西湖区', '江干区']
        var valdata = [683, 523, 240, 234]
        //   var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448"];
        this.chart.setOption({
          // backgroundColor: "#0e2147",
          xAxis: {
            show: false,
          },
          yAxis: [
            {
              show: true,
              data: titlename,
              inverse: true,
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: 'black',
                formatter: function (value, index) {
                  return [value].join('\n')
                },
                show: true,
                margin: -10,
                align: 'left',
                verticalAlign: 'bottom',
                padding: [0, 0, 15, 0],
                fontSize: 16,
                rich: {
                  lg: {
                    backgroundColor: '#339911',
                    color: 'green',
                    borderRadius: 10,
                    align: 'center',
                    width: 15,
                    height: 15,
                  },
                },
              },
            },
            // 数字显示大小
            {
              show: true,
              inverse: true,
              data: valdata,
              axisLabel: {
                textStyle: {
                  fontSize: 20,
                  color: '#339911',
                },
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '条',
              type: 'bar',
              yAxisIndex: 0,
              data: data,
              barWidth: 30,
              itemStyle: {
                normal: {
                  barBorderRadius: 30,
                  color: function (value) {
                    return (
                      '#' +
                      (
                        '00000' +
                        ((Math.random() * 16777215 + 0.5) >> 0).toString(16)
                      ).slice(-6)
                    )
                  },
                },
              },
              label: {
                normal: {
                  show: false,
                  position: 'inside',
                  formatter: '{c}%',
                },
              },
            },
            {
              name: '框',
              type: 'bar',
              yAxisIndex: 1,
              barGap: '-100%',
              data: [100, 100, 100, 100],
              barWidth: 30,
              itemStyle: {
                normal: {
                  color: 'none',
                  borderColor: '#cccccc',
                  // function(value) {
                  //   return (
                  //     "#" +
                  //     (
                  //       "00000" +
                  //       ((Math.random() * 16777215 + 0.5) >> 0).toString(16)
                  //     ).slice(-6)
                  //   );
                  // },
                  margin: [10, 0],
                  borderWidth: 2,
                  barBorderRadius: 15,
                },
              },
            },
          ],
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions()
      },
    },
  }
</script>
