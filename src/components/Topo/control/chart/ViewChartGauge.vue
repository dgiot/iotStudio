<template>
  <div ref="chartView" class="view-chart-gauge">Click to bind data.</div>
</template>

<script>
  import BaseView from '../View'

  export default {
    name: 'ViewChartGauge',
    extends: BaseView,
    props: {},
    data() {
      return {
        echart: null,
        eventValue: '0.00',
        eventUnit: '',
        option: {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%',
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: {
                formatter: '{value}%',
              },
              data: [
                {
                  value: 50,
                  name: '完成率',
                },
              ],
            },
          ],
        },
      }
    },
    watch: {
      detail: function (newVal) {
        this.setOption(this.option)
      },
    },
    mounted() {
      if (this.editMode) {
        this.$nextTick(function () {
          this.setOption(this.option)
        })
      }
    },
    methods: {
      setOption(option) {
        if (this.echart) {
          this.echart.dispose()
        }
        let view = this.$refs.chartView
        this.echart = echarts.init(view)
        this.echart.setOption(option)
      },
      onResize() {
        if (this.echart) {
          this.echart.resize()
        }
      },
      updateView() {
        this.setOption(this.option)
      },
    },
  }
</script>

<style lang="scss">
  .view-chart-gauge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>
