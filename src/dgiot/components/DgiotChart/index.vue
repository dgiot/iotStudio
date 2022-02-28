<!--
* @Author: h7ml
* @Date: 2021-07-14 10:23:01
* @LastEditors:
* @LastEditTime: 2021-07-14 10:23:01
* @Description:
* @FilePath: src\dgiot\components\DgiotChart\index.vue
* @DocumentLink: https://v-charts.js.org/#/line
-->

<template>
  <div id="dgiotChart">
    <ve-line
      v-if="type == 'line'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-histogram
      v-else-if="type == 'histogram'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-bar
      v-else-if="type == 'bar'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-pie
      v-else-if="type == 'pie'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-ring
      v-else-if="type == 'ring'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-waterfall
      v-else-if="type == 'waterfall'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-funnel
      v-else-if="type == 'funnel'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-radar
      v-else-if="type == 'radar'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-map
      v-else-if="type == 'map'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-sankey
      v-else-if="type == 'sankey'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-heatmap
      v-else-if="type == 'heatmap'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-scatter
      v-else-if="type == 'scatter'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-gauge
      v-else-if="type == 'gauge'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-tree
      v-else-if="type == 'tree'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-liquidfill
      v-else-if="type == 'liquidfill'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-wordcloud
      v-else-if="type == 'wordcloud'"
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
    <ve-candle
      v-else
      :after-config="afterConfig"
      :data="data"
      :data-empty="dataEmpty"
      :data-zoom="datazoom"
      :extend="extend"
      :height="height"
      :loading="loading"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :toolbox="toolbox"
    />
  </div>
</template>
<script>
  export default {
    name: 'DgiotChart',
    components: {},
    props: {
      type: {
        type: String,
        default: 'line',
      },
      extend: {
        type: Object,
        default: () => ({
          // 可滚动属性
          series: {
            barMaxWidth: 35,
          },
          dataZoom: [
            {
              type: 'inside',
            },
          ],
          grid: {
            right: 40,
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} %',
              },
            },
          ],
        }),
      },
      data: {
        type: Object,
        default: () => {
          ;[]
        },
      },
      settings: {
        type: Object,
        default: () => {},
      },
      datazoom: {
        type: Object,
        default: () => {
          ;[{ type: 'slider' }]
        },
      },
      toolbox: {
        type: Object,
        default: () => {},
      },
      setOptionOpts: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      afterConfig: {
        type: Function,
        default: function (options) {
          options.tooltip.showDelay = 500
          return options
        },
      },
      dataEmpty: {
        type: Boolean,
        default: false,
      },
      height: {
        type: String,
        default: '400px',
      },
    },
    mounted() {},
    methods: {},
  }
</script>
