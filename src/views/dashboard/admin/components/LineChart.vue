template>
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
        default: '370px',
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
            actualData: [],
            title: '1',
            max: 0,
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
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        },
      },
    },
    mounted() {
      const dom = document.getElementsByClassName('chart')[0]
      dom.style.width = window.innerWidth * 0.4 - 120 + 'px'
      this.initChart()
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            dom.style.width = window.innerWidth * 0.4 - 120 + 'px'
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
        this.sidebarResizeHandler,
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
      setOptions({
        expectedData,
        actualData,
        title,
        max,
      } = {}) {
        this.chart.setOption({
          xAxis: {
            data: actualData,
            boundaryGap: false,
            axisTick: {
              show: false,
            },
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
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
            axisTick: {
              show: false,
            },
          },
          legend: {
            data: ['数据'],
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false,
              },
              magicType: {
                show: true,
                type: ['line', 'bar'],
              },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: 50,
              handleSize: 8,
            },
            {
              type: 'inside',
              start: 0,
              end: 50,
            },
          ],
          visualMap: {
            // 区间内控制显示颜色 折线点的颜色变化
            show: false,
            dimension: 1,
            pieces: [
              {
                gte: 0,
                lte: max,
                color: 'green', // 表示0-36.9之间的数值，是这个#7EF57C颜色，大于这个140，则#ff0000颜色。
              },
            ],
            outOfRange: {
              color: 'red',
            },
          },
          series: [
            {
              name: '数据',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2,
                  },
                  areaStyle: {
                    // 折线图区域颜色线性渐变显示
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#7CF5A2',
                        },
                        {
                          offset: 0.6,
                          color: '#7EF57C',
                        },
                        {
                          offset: 1,
                          color: '#fff',
                        },
                      ]),
                    },
                  },
                },
              },
              markLine: {
                silent: false,
                data: [
                  {
                    name: '告警线',
                    yAxis: max,
                    label: {
                      show: 'true',
                      position: 'middle',
                      formatter: `${title}最大${max}`,
                    },
                  },
                ],
              },
              smooth: true,
              type: 'line',
              data: expectedData,
              animationDuration: 2800,
              animationEasing: 'cubicInOut',
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
