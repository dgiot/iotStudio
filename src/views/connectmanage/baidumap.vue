<template>
  <div class="baidumap">
    <el-button @click="test">测试</el-button>
    <div id="map" ref="map" class="map" style="height: 1000px" />
  </div>
</template>
<script>
  // import 'echarts/extension/bmap/bmap'
  import linesData from './data.json'
  export default {
    data() {
      return {
        chart: this.$echarts.ECharts,
        bmap: {},
        mapZoom: 6,
        scatterSeries: [],
        linesSeries: [],
        effectScatterSeries: [],
        trainIcon: `path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z`,
      }
    },
    mounted() {
      this.initMap([])
    },
    methods: {
      test() {
        this.initMap(linesData)
      },
      initMap(origindata) {
        // echarts配置
        this.getLineSeries(origindata)
        this.getScatterSeries(origindata)
        origindata.length == 0
          ? (this.effectScatterSeries = [])
          : this.getEffectScatterSeries(origindata)
        this.chart = this.$echarts.init(this.$refs.map)
        this.chart.setOption({
          animation: false,
          legend: {
            orient: 'vertical',
            top: 30,
            left: 30,
            data: linesData.map((v) => v.name),
            textStyle: {
              color: '#222222',
            },
            selectedMode: 'multiple',
          },
          bmap: {
            // 加载 bmap 组件
            center: [104.114129, 37.550339],
            zoom: 6, // 地图当前的缩放比例
            roam: true, // 开启鼠标缩放和平移漫游
            scaleLimit: { min: 6, max: 12 }, // echarts设置地图最小最大缩放比例的接口不起作用，要使用百度地图的接口设置
          },
          series: [
            ...this.linesSeries, // 带有起点和终点信息的线数据的绘制
            ...this.scatterSeries, // 散点（气泡）图
            ...this.effectScatterSeries, // 带有涟漪特效动画的散点（气泡）图
          ],
        })
        // 获取百度地图实例，使用百度地图自带的控件
        this.bmap = this.chart.getModel().getComponent('bmap').getBMap()
        this.bmap.setMinZoom(6) // 设置地图最小缩放比例
        this.bmap.setMaxZoom(12) // 设置地图最大缩放比例
        // this.bmap.addControl(new BMap.MapTypeControl({ mapTypes: [] })) // 不显示地图右上方的控件
        this.bmap.addControl(
          new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
        ) // 在左下角显示比例尺控件
        const _this = this
        // 监听地图比例缩放， 可以根据缩放等级控制某些图标的显示
        this.bmap.addEventListener('zoomend', function () {
          _this.mapZoom = _this.bmap.getZoom()
        })
        this.bmap.setMapStyleV2({
          styleId: '7b93b720528698c2c2cfe0294dd45eed',
        })
      },
      getLineSeries(data) {
        const series = []
        data.forEach((line) => {
          series.push({
            name: line.name,
            type: 'lines',
            coordinateSystem: 'bmap', // 使用百度地图的坐标系
            silent: true, // 图形不响应和触发鼠标事件
            polyline: true,
            lineStyle: { color: line.primaryColor },
            z: 3,
            data: [
              {
                // 浅色底线
                coords: line.stations.map((v, index) => v.value),
                lineStyle: {
                  // 单个数据（单条线）的样式设置。
                  normal: {
                    type: 'solid',
                    color: line.bgColor,
                    width: 4,
                    opacity: 0.6,
                  },
                },
              },
            ],
          })
        })
        this.linesSeries = series
      },
      getScatterSeries(data) {
        const series = []
        data.forEach((line) => {
          series.push({
            name: line.name,
            type: 'scatter',
            coordinateSystem: 'bmap',
            symbol: 'circle',
            symbolSize: 10,
            z: 4,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                color: '#777777',
                show: true,
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: '#FFFFFF',
                borderColor: '#777777',
                borderWidth: 2,
              },
            },
            data: line.stations,
          })
        })

        this.scatterSeries = series
      },
      // 涟漪图标显示
      getEffectScatterSeries(data) {
        const series = []
        const points = [data[0].stations[data[0].stations.length - 1]]
        const lengdata = points.map((train) => {
          const formatter = `{p2|${train.name}}
                              {p3|\n当前位置：${train.name}}`
          return {
            name: train.name,
            itemStyle: {
              normal: {
                color: 'red',
              },
              emphasis: {
                color: 'red',
              },
            },
            label: {
              normal: {
                formatter,
                rich: {
                  img: {
                    backgroundColor: {
                      image: train.screenshot,
                    },
                  },
                },
              },
            },
            value: train.value,
          }
        })
        series.push({
          name: '路径',
          type: 'effectScatter', // 带有涟漪特效动画的散点（气泡）图
          coordinateSystem: 'bmap',
          symbol: this.trainIcon, // 使用自定义的SVG图标
          symbolSize: [20, 20],
          legendHoverLink: true,
          z: 20,
          effectType: 'ripple',
          rippleEffect: {
            period: 2, // 涟漪特效的动画周期
            scale: 5, // 涟漪特效动画中波纹的最大缩放比例
            brushType: 'fill', // 涟漪特效的波纹绘制方式
          },
          label: {
            // 鼠标浮动到特效点上时会显示标签
            normal: {
              show: false,
              position: ['500%', '300%'],
              distance: 20,
              color: '#222222',
              align: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
              padding: 20,
              shadowColor: 'rgba(0,0,0,0.16)',
              shadowBlur: 6,
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              width: 200,
              rich: {
                // 富文本标签样式
                p2: {
                  fontSize: 16,
                  color: '#222222',
                  fontWeight: 'bolder',
                  lineHeight: 40,
                },
                p3: {
                  fontSize: 14,
                  color: '#222222',
                  lineHeight: 18,
                },
              },
            },
            emphasis: {
              show: true,
            },
          },
          data: lengdata,
        })
        // }
        //   })
        this.effectScatterSeries = series
      },
    },
  }
</script>
<style scoped></style>
