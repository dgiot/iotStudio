<template>
  <div class="echarts" />
</template>

<script>
  // import * as echarts from 'echarts'
  import theme from './theme/vab-echarts-theme.json'
  import debounce from 'lodash/debounce'
  import { addListener, removeListener } from 'resize-detector'

  const INIT_TRIGGERS = ['theme', 'initOptions', 'autoResize']
  const REWATCH_TRIGGERS = ['manualUpdate', 'watchShallow']

  export default {
    props: {
      options: {
        type: Object,
        default: () => {},
      },
      theme: {
        type: [String, Object],
        default: () => {},
      },
      initOptions: {
        type: Object,
        default: () => {},
      },
      group: {
        type: String,
        default: '',
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
      watchShallow: {
        type: Boolean,
        default: false,
      },
      manualUpdate: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        lastArea: 0,
      }
    },
    watch: {
      group(group) {
        this.chart.group = group
      },
    },
    created() {
      this.initOptionsWatcher()
      INIT_TRIGGERS.forEach((prop) => {
        this.$watch(
          prop,
          () => {
            this.refresh()
          },
          { deep: true }
        )
      })
      REWATCH_TRIGGERS.forEach((prop) => {
        this.$watch(prop, () => {
          this.initOptionsWatcher()
          this.refresh()
        })
      })
    },
    mounted() {
      if (this.options) {
        echarts.registerTheme('vab-echarts-theme', theme)
        this.init()
      }
    },
    activated() {
      if (this.autoResize) {
        this.chart && this.chart.resize()
      }
    },
    destroyed() {
      if (this.chart) {
        this.destroy()
      }
    },
    methods: {
      mergeOptions(options, notMerge, lazyUpdate) {
        if (this.manualUpdate) {
          this.manualOptions = options
        }
        if (!this.chart) {
          this.init(options)
        } else {
          this.delegateMethod('setOption', options, notMerge, lazyUpdate)
        }
      },
      appendData(params) {
        this.delegateMethod('appendData', params)
      },
      resize(options) {
        this.delegateMethod('resize', options)
      },
      dispatchAction(payload) {
        this.delegateMethod('dispatchAction', payload)
      },
      convertToPixel(finder, value) {
        return this.delegateMethod('convertToPixel', finder, value)
      },
      convertFromPixel(finder, value) {
        return this.delegateMethod('convertFromPixel', finder, value)
      },
      containPixel(finder, value) {
        return this.delegateMethod('containPixel', finder, value)
      },
      showLoading(type, options) {
        this.delegateMethod('showLoading', type, options)
      },
      hideLoading() {
        this.delegateMethod('hideLoading')
      },
      getDataURL(options) {
        return this.delegateMethod('getDataURL', options)
      },
      getConnectedDataURL(options) {
        return this.delegateMethod('getConnectedDataURL', options)
      },
      clear() {
        this.delegateMethod('clear')
      },
      dispose() {
        this.delegateMethod('dispose')
      },
      delegateMethod(name, ...args) {
        if (!this.chart) {
          this.init()
        }
        return this.chart[name](...args)
      },
      delegateGet(methodName) {
        if (!this.chart) {
          this.init()
        }
        return this.chart[methodName]()
      },
      getArea() {
        return this.$el.offsetWidth * this.$el.offsetHeight
      },
      init(options) {
        if (this.chart) {
          return
        }
        const chart = echarts.init(this.$el, this.theme, this.initOptions)
        if (this.group) {
          chart.group = this.group
        }
        chart.setOption(
          options || this.manualOptions || this.options || {},
          true
        )
        Object.keys(this.$listeners).forEach((event) => {
          const handler = this.$listeners[event]
          if (event.indexOf('zr:') === 0) {
            chart.getZr().on(event.slice(3), handler)
          } else {
            chart.on(event, handler)
          }
        })
        if (this.autoResize) {
          this.lastArea = this.getArea()
          this.__resizeHandler = debounce(
            () => {
              if (this.lastArea === 0) {
                this.mergeOptions({}, true)
                this.resize()
                this.mergeOptions(
                  this.options || this.manualOptions || {},
                  true
                )
              } else {
                this.resize()
              }
              this.lastArea = this.getArea()
            },
            100,
            { leading: true }
          )
          addListener(this.$el, this.__resizeHandler)
        }
        Object.defineProperties(this, {
          width: {
            configurable: true,
            get: () => {
              return this.delegateGet('getWidth')
            },
          },
          height: {
            configurable: true,
            get: () => {
              return this.delegateGet('getHeight')
            },
          },
          isDisposed: {
            configurable: true,
            get: () => {
              return !!this.delegateGet('isDisposed')
            },
          },
          computedOptions: {
            configurable: true,
            get: () => {
              return this.delegateGet('getOption')
            },
          },
        })
        this.chart = chart
      },
      initOptionsWatcher() {
        if (this.__unwatchOptions) {
          this.__unwatchOptions()
          this.__unwatchOptions = null
        }
        if (!this.manualUpdate) {
          this.__unwatchOptions = this.$watch(
            'options',
            (val, oldVal) => {
              if (!this.chart && val) {
                this.init()
              } else {
                this.chart.setOption(val, val !== oldVal)
              }
            },
            { deep: !this.watchShallow }
          )
        }
      },
      destroy() {
        if (this.autoResize) {
          removeListener(this.$el, this.__resizeHandler)
        }
        this.dispose()
        this.chart = null
      },
      refresh() {
        if (this.chart) {
          this.destroy()
          this.init()
        }
      },
    },
    connect(group) {
      if (typeof group !== 'string') {
        group = group.map((chart) => chart.chart)
      }
      echarts.connect(group)
    },
    disconnect(group) {
      echarts.disConnect(group)
    },
    getMap(mapName) {
      return echarts.getMap(mapName)
    },
    registerMap(mapName, geoJSON, specialAreas) {
      echarts.registerMap(mapName, geoJSON, specialAreas)
    },
    graphic: echarts.graphic,
  }
</script>
<style>
  .echarts {
    width: 600px;
    height: 400px;
  }
</style>
