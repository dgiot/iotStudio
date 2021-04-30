<template>
  <div class="topo-editor">
    <WresizePanel3 class="full-height">
      <template #left>
        <TopoToolbox ref="topoToolbox" class="topo-toolbox" />
      </template>

      <template #center>
        <TopoMain ref="topoMain" class="topo-main" />
      </template>

      <template #right>
        <TopoProperties ref="topoProperties" class="topo-properties" />
      </template>
    </WresizePanel3>
  </div>
</template>

<script>
  import WresizePanel3 from '@/components/panel/WresizePanel3'
  import TopoToolbox from '@/components/Topo/TopoToolbox'
  import TopoMain from '@/components/Topo/TopoMain'
  import TopoProperties from '@/components/Topo/TopoProperties'

  export default {
    name: 'TopoEditor',
    components: {
      WresizePanel3,
      TopoToolbox,
      TopoMain,
      TopoProperties,
    },
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .topo-editor {
    position: relative;
    width: 100%;
    height: calc(100vh - 210px);
    padding: 10px;
    background-color: #eee;

    .topo-toolbox {
      width: 100%;
      height: 100%;
    }

    .topo-main {
      width: 100%;
      height: 100%;
    }

    .topo-properties {
      width: 100%;
      height: 100%;
    }
  }
</style>
