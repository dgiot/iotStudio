<template>
  <div class="order">
    <el-card class="order-card1" shadow="hover">
      <template #header>
        <vab-icon icon="shopping-bag-2-line" />
        商品
      </template>
      <el-row class="order-card1-content">
        <el-col :span="8">
          <p>已售数量</p>
          <h1>
            <vab-count
              :decimals="countConfig.decimals"
              :duration="countConfig.duration"
              :end-val="countConfig.endVal"
              :prefix="countConfig.prefix"
              :separator="countConfig.separator"
              :start-val="countConfig.startVal"
              :suffix="countConfig.suffix"
            />
          </h1>
        </el-col>
        <el-col :span="8">
          <p>待售数量</p>
          <h1>
            <vab-count
              :decimals="countConfig.decimals"
              :duration="countConfig.duration"
              :end-val="countConfig.endVal"
              :prefix="countConfig.prefix"
              :separator="countConfig.separator"
              :start-val="countConfig.startVal"
              :suffix="countConfig.suffix"
            />
          </h1>
        </el-col>
        <el-col :span="8">
          <p>好评度</p>
          <h1>99%</h1>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="order-card2" shadow="hover">
      <template #header>
        <span>
          <vab-icon icon="list-unordered" />
          订单
        </span>
      </template>
      <el-row class="order-card2-content">
        <el-col :span="12">
          <p>已完成订单</p>
          <h1>
            <vab-count
              :decimals="countConfig.decimals"
              :duration="countConfig.duration"
              :end-val="countConfig.endVal * 1.5"
              :prefix="countConfig.prefix"
              :separator="countConfig.separator"
              :start-val="countConfig.startVal"
              :suffix="countConfig.suffix"
            />
          </h1>
        </el-col>
        <el-col :span="12">
          <p>计划完成订单</p>
          <h1>
            <vab-count
              :decimals="countConfig.decimals"
              :duration="countConfig.duration"
              :end-val="countConfig.endVal * 2.5"
              :prefix="countConfig.prefix"
              :separator="countConfig.separator"
              :start-val="countConfig.startVal"
              :suffix="countConfig.suffix"
            />
          </h1>
        </el-col>
        <el-col :span="24">
          <vab-chart
            :init-options="initOptions"
            :options="options"
            theme="vab-echarts-theme"
            class="order-chart"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import VabChart from '@/extra/VabChart'
  import VabCount from '@/extra/VabCount'

  export default {
    components: { VabCount, VabChart },
    data() {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      return {
        countConfig: {
          startVal: 0,
          endVal: _.random(1000, 6000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 5000,
        },
        initOptions: {
          renderer: 'svg',
        },
        options: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            left: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: ['1季度', '2季度', '3季度', '4季度'],
              axisLine: {
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
                color: '#556677',
                fontSize: 12,
                margin: 15,
              },
              axisPointer: {
                label: {
                  padding: [0, 0, 10, 0],
                  margin: 15,
                  fontSize: 12,
                  backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#33c0cd',
                      },
                      {
                        offset: 1,
                        color: '#33c0cd',
                      },
                    ],
                    global: false,
                  },
                },
              },
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisLabel: {
                color: '#556677',
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '已完成订单',
              type: 'line',
              data: [1345, 2100, 1330, 2901],
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new VabChart.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: '#9effff',
                  },
                  {
                    offset: 1,
                    color: '#9E87FF',
                  },
                ]),
                shadowColor: 'rgba(158,135,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                color: colorList[0],
                borderColor: colorList[0],
              },
            },
            {
              name: '未完成订单',
              type: 'line',
              data: [1905, 1020, 3330, 512],
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new VabChart.graphic.LinearGradient(1, 1, 0, 0, [
                  {
                    offset: 0,
                    color: '#73DD39',
                  },
                  {
                    offset: 1,
                    color: '#73DDFF',
                  },
                ]),
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                color: colorList[1],
                borderColor: colorList[1],
              },
            },
          ],
        },
      }
    },
  }
</script>

<style lang="scss" scoped>
  .order {
    &-card1 {
      height: 200px;
      background: linear-gradient(to right, #60b2fb, #6485f6);

      &-content {
        text-align: center;
      }

      ::v-deep {
        .el-card {
          &__header,
          &__body {
            color: $base-color-white !important;
          }
        }
      }
    }

    &-card2 {
      height: 490px;

      &-content {
        text-align: center;

        .order-chart {
          width: 100%;
          height: 345px;
        }
      }
    }

    margin-bottom: $base-margin;
  }
</style>
