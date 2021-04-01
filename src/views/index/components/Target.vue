<template>
  <div class="target">
    <el-card class="target-card1" shadow="hover">
      <template #header>
        <vab-icon icon="body-scan-line" />
        小目标
      </template>
      <vab-chart
        :init-options="initOptions"
        :options="options"
        theme="vab-echarts-theme"
        class="target-echart1"
      />
    </el-card>
    <el-card class="target-card2" shadow="hover">
      <template #header>
        <span>
          <vab-icon icon="money-cny-box-line" />
          销售额
        </span>
      </template>
      <vab-chart
        :init-options="initOptions"
        :options="options2"
        theme="vab-echarts-theme"
        class="target-echart2"
      />
    </el-card>
  </div>
</template>

<script>
  import VabChart from '@/extra/VabChart'

  export default {
    components: {
      VabChart,
    },
    data() {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      return {
        initOptions: {
          renderer: 'svg',
        },
        options: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '0%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              splitLine: {
                show: false,
              },
              type: 'value',
              show: false,
            },
          ],
          yAxis: [
            {
              splitLine: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              type: 'category',
              axisTick: {
                show: false,
              },
              data: [
                '莱山区',
                '高新区',
                '芝罘区',
                '牟平区',
                '蓬莱区',
                '开发区',
              ],
            },
          ],
          series: [
            {
              name: '目标',
              type: 'bar',
              barWidth: 25,
              label: {
                show: true,
                position: 'right',
                color: '#1890FF',
                fontSize: 14,
                formatter: ({ data }) => {
                  return `${data}亿元`
                },
              },
              itemStyle: {
                borderRadius: [0, 5, 5, 0],
                color: new VabChart.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  ['#3ED572', '#399efd'].map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
              data: [320, 302, 341, 374, 390, 650],
            },
          ],
        },
        options2: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '4%',
            left: '2%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
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
              name: '销售额',
              type: 'line',
              data: [
                1905,
                1020,
                3330,
                512,
                4463,
                2214,
                3330,
                5412,
                1205,
                820,
                5330,
                1112,
              ],
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
  .target {
    margin-bottom: $base-margin;
  }

  ::v-deep {
    .target-echart1 {
      width: 100%;
      height: 290px;
    }

    .target-echart2 {
      width: 100%;
      height: 205px;
    }
  }
</style>
