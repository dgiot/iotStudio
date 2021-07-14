<!--
* @Author: h7ml
* @Date: 2021-07-14 10:23:01
* @LastEditors:
* @LastEditTime: 2021-07-14 10:23:01
* @Description:
* @FilePath: src\vab\components\VabChart\index.vue
* @DocumentLink: https://v-charts.js.org/#/line
-->

<template>
  <div id="vabChart">
    <ve-line
      v-if="type == 'line'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-histogram
      v-else-if="type == 'histogram'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-bar
      v-else-if="type == 'bar'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-pie
      v-else-if="type == 'pie'"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-ring
      v-else-if="type == 'ring'"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-waterfall
      v-else-if="type == 'waterfall'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-funnel
      v-else-if="type == 'funnel'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-radar
      v-else-if="type == 'radar'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-map
      v-else-if="type == 'map'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-sankey
      v-else-if="type == 'sankey'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-heatmap
      v-else-if="type == 'heatmap'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-scatter
      v-else-if="type == 'scatter'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-gauge
      v-else-if="type == 'gauge'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-tree
      v-else-if="type == 'tree'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-liquidfill
      v-else-if="type == 'liquidfill'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-wordcloud
      v-else-if="type == 'wordcloud'"
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
    <ve-candle
      v-else
      :extend="extend"
      :data="data"
      :height="height"
      :set-option-opts="setOptionOpts"
      :settings="settings"
      :data-zoom="datazoom"
      :toolbox="toolbox"
      :loading="loading"
      :after-config="afterConfig"
      :data-empty="dataEmpty"
    />
  </div>
</template>
<script>
  export default {
    name: 'VabChart',
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
          identifier: []
          columns: []
          rows: []
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
