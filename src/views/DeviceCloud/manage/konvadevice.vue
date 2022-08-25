<template>
  <div class="konvadevice">
    <div class="konva_wrap">
      <topopreview v-if="topoFlag" ref="topo" />
      <div v-if="vueFlag">
        <div
          v-for="(comp, index) in vueComponents"
          :key="index"
          class="vue_component"
          :style="{
            left: comp.x + 'px',
            top: comp.y + 'px',
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        >
          <topo-line
            v-if="comp.type == 'line'"
            :comp="comp"
            :style="{
              width: comp.width + 'px',
              height: comp.height + 'px',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import topoLine from './component/topocompvue/TopoLine'
  import topopreview from '@/views/CloudFunction/topo/index'
  export default {
    name: 'KonvaDetails',
    components: {
      topopreview,
      topoLine,
    },
    data() {
      return {
        topoFlag: true,
        vueFlag: false,
        vueComponents: [],
      }
    },
    mounted() {
      console.log('111111111')
      this.$dgiotBus.$off('vueComponent')
      this.$dgiotBus.$on('vueComponent', async (list, flag) => {
        this.vueComponents = list
        this.vueFlag = flag
      })
    },
  }
</script>
<style lang="scss" scoped>
  .konvadevice {
    box-sizing: border-box !important;
    position: relative;
    .konva_wrap {
      margin: 0 auto;
      .vue_component {
        position: absolute;
        z-index: 99999;
        // background-color: #0077b8;
      }
    }
  }
</style>
