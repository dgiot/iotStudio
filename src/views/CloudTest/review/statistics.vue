<!--
* @Author: dext7r
* @Date: 2021-12-22 19:29:21
* @LastEditors: dext7r
* @LastEditTime: 2021-12-22 19:29:21
* @Description: 证据统计组件
* @FilePath: src\views\CloudTest\review\statistics.vue
* @DocumentLink:
-->
<template>
  <div class="statistics-content">
    <div class="statistics-content-chart">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-divider>历史数据</el-divider>
          <dgiot-chart
            ref="charts"
            :after-config="afterConfig"
            :data="chartData"
            :data-empty="dataEmpty"
            :data-zoom="chartDataZoom"
            :extend="chartExtend"
            :loading="loading"
            :set-option-opts="false"
            :settings="chartSettings"
            :toolbox="toolbox"
            :type="params.style"
          />
        </el-col>
        <el-col :span="12">
          <el-divider>存储的数据</el-divider>
          <el-tabs v-model="activeName">
            <el-tab-pane label="存储的数据" name="first">
              <el-table
                :key="historyEvidence.length"
                border
                :data="historyEvidence"
                style="min-height: 530px"
              >
                <el-table-column
                  v-for="(item, index) in historycolumns"
                  :key="index"
                  align="center"
                  :label="$translateTitle(`cloudTest.${item.label}`)"
                  :prop="item.prop"
                  show-overflow-tooltip
                  sortable
                  width="auto"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane
              :label="$translateTitle('equipment.chart')"
              name="second"
            >
              <el-card>
                <el-image
                  :key="drawxnqxPath"
                  :preview-src-list="[$FileServe + drawxnqxPath]"
                  :src="$FileServe + drawxnqxPath"
                >
                  <div slot="error" class="image-slot">
                    <el-image
                      class="dgiot-data-empty"
                      :src="
                        require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                      "
                    />
                  </div>
                </el-image>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div class="chartOther">
        <el-row :gutter="20">
          <el-col
            v-for="(item, index) in chartData.child"
            v-show="item.columns[1] != '日期'"
            :key="index"
            :md="md"
            :sm="sm"
            :xl="xl"
            :xs="xs"
          >
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{ item.columns[1] }} : {{ item.unit }}</span>

                <el-button-group
                  style="float: right; padding: 3px 0"
                  type="text"
                >
                  <el-button
                    icon="el-icon-full-screen"
                    @click.native="toggleCardRow(index, xs, sm, md, xl)"
                  />
                </el-button-group>
              </div>

              <dgiot-chart
                ref="charts"
                :after-config="afterConfig"
                :data="chartData.child[index]"
                :data-empty="dataEmpty"
                :data-zoom="chartDataZoom"
                :extend="chartExtend"
                height="300px"
                :legend-visible="false"
                :loading="loading"
                :set-option-opts="false"
                :settings="chartSettings"
                :toolbox="toolbox"
                :type="params.style"
              />
            </el-card>
          </el-col>
          <el-col v-show="!chartData.child" :span="24">
            <dgiot-empty />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getDevice, getDabDevice } from '@/api/Device'
  import { postDrawxnqx } from '@/api/Evidence'
  export default {
    name: 'Statistics',
    components: {},
    props: {
      evidenceId: {
        type: String,
        default: '',
        require: true,
      },
    },
    data() {
      this.toolbox = {
        orient: 'vertical',
        right: -5,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          magicType: {
            type: [
              'line',
              'bar',
              'histogram',
              'pie',
              'ring',
              'waterfall',
              'funnel',
              'radar',
              'heatmap',
              'scatter',
              'candle',
              'stack',
            ],
          },
          dataView: {
            show: true,
            readOnly: false,
          },
          saveAsImage: { show: true },
          restore: { show: true },
        },
      }
      this.chartExtend = {
        series: {
          barMaxWidth: 35,
        },
        dataZoom: [
          // 鼠标滚轮滚动
          // {
          //   type: 'inside',
          // },
          // 坐标轴滚动
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 10,
            end: 90, //初始化滚动条
          },
        ],
        grid: {
          right: 40,
        },
      }
      return {
        activeName: 'first',
        drawxnqxPath: '',
        xl: 6,
        xs: 24,
        sm: 24,
        md: 12,
        historyEvidence: [],
        historycolumns: [],
        params: {
          _function: 'last',
          style: '',
          number: 1,
          interval: 'm',
          datetimerange: '',
          keys: '*',
          limit: 100,
          endTime: new Date(),
          startTime: new Date().getTime() - 3600 * 1000 * 24 * 7,
        },
        chartSettings: {},
        chartDataZoom: [{ type: 'slider' }],
        dataEmpty: true,
        chartData: {
          identifier: [],
          columns: [],
          rows: [],
        },
        loading: true,
        infoData: {},
      }
    },
    computed: {
      ...mapGetters({
        Device: 'settings/device',
        chartType: 'product/chartType',
      }),
    },
    mounted() {
      this.params.style = chartType[0].type
      // this.evidence(this.evidenceId)
    },
    methods: {
      resizeTheChart() {
        let charts = this.$refs[`charts`]
        if (charts instanceof Array) {
          charts.forEach((chart) => {
            chart.$children[0].resize()
          })
        } else charts.$children[0].resize()
      },
      afterConfig(options) {
        options.tooltip.showDelay = 500
        return options
      },
      /**
       * @Author:
       * @Date: 2021-12-23 18:38:28
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async toggleCardRow(index, xs, sm, md, xl) {
        try {
          this.sm = sm == 24 ? 12 : 24
          this.md = md == 12 ? 24 : 12
          this.xl = xl == 6 ? 12 : 6
          this.xs = xs == 24 ? 12 : 24
          this.$nextTick((_) => {
            this.resizeTheChart()
          })
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dext7r
       * @Date: 2021-12-22 19:50:29
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async evidence(evidenceId) {
        try {
          const res = await getDevice(evidenceId)
          this.infoData = res
          const {
            profile = {
              endtime: moment(Number(endTime)).valueOf(),
              drawxnqxPath: '',
            },
            parentId = {},
          } = res
          this.params.startTime = profile.starttime
          this.params.endTime = profile.endtime
          this.historycolumns = profile.historicaldatacolumns ?? []
          this.historyEvidence = profile.historicaldata ?? []
          this.drawxnqxPath = profile.drawxnqxPath
          await this.queryStatistics(parentId.objectId)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dext7r
       * @Date: 2021-12-22 19:44:00
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async queryStatistics(evidenceId) {
        const {
          interval,
          keys,
          limit,
          number,
          style,
          _function,
          startTime,
          endTime = moment(new Date()).format('x'),
        } = this.params
        let params = {
          starttime: moment(Number(startTime)).valueOf(),
          endtime: moment(Number(endTime)).valueOf(),
          interval: number + interval,
          keys: keys,
          limit: limit,
          function: _function,
          style: style,
        }
        try {
          const loading = this.$baseColorfullLoading()
          const { chartData = {} } = await getDabDevice(evidenceId, params)
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'dgiot-hey-message-success'
          )
          loading.close()
          this.chartData = chartData
          this.loading = false
          if (!_.isEmpty(chartData)) this.dataEmpty = false
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .statistics-container {
    width: 100%;
    height: 100%;
    //&-container {
    //  width: 100%;
    //  height: 100%;
    //  &-chart {
    //    height: 400px;
    //  }
    //}
  }
</style>
