<template>
  <el-card class="authorization" shadow="hover">
    <template #header>
      <vab-icon icon="bar-chart-2-line" />
      授权数
      <el-tag class="card-header-tag" type="warning">周</el-tag>
    </template>
    <vab-chart
      :init-options="initOptions"
      :options="options"
      theme="vab-echarts-theme"
    />
    <div class="bottom">
      <span>
        授权数:
        <vab-count
          :decimals="countConfig.decimals"
          :duration="countConfig.duration"
          :end-val="countConfig.endVal"
          :prefix="countConfig.prefix"
          :separator="countConfig.separator"
          :start-val="countConfig.startVal"
          :suffix="countConfig.suffix"
        />
        <el-tag class="card-footer-tag" type="success">倒计时 {{ n }}s</el-tag>
      </span>
    </div>
  </el-card>
</template>

<script>
  import VabChart from '@/extra/VabChart'
  import VabCount from '@/extra/VabCount'

  export default {
    components: {
      VabChart,
      VabCount,
    },
    data() {
      return {
        timer: null,
        n: 5,
        countConfig: {
          startVal: 0,
          endVal: _.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        initOptions: {
          renderer: 'svg',
        },
        // 授权数
        options: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '5%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '授权数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
              itemStyle: {
                borderRadius: [2, 2, 0, 0],
                color: new VabChart.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  ['#88D1FF', '#1890FF'].map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
            },
          ],
        },
      }
    },
    beforeUnmount() {
      this.timer = null
      clearInterval(this.timer)
    },
    mounted() {
      this.timer = setInterval(() => {
        if (this.n > 0) {
          this.n--
        } else {
          this.options.series[0].type = _.sample(
            _.pull(['line', 'bar', 'scatter'], [this.options.series[0].type])
          )
          this.n = 5
        }
      }, 1000)
    },
  }
</script>
