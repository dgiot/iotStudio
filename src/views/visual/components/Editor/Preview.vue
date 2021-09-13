<template>
  <div v-if="show" class="bg">
    <el-button class="close" @click="close">关闭</el-button>
    <div class="canvas-container">
      <div
        class="canvas"
        :style="{
          width: changeStyleWithScale(canvasStyleData.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }"
      >
        <ComponentWrapper
          v-for="(item, index) in componentData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { getStyle } from '@/views/visual/utils/style'
  import { mapState } from 'vuex'
  import ComponentWrapper from './ComponentWrapper'
  import { changeStyleWithScale } from '@/views/visual/utils/translate'

  export default {
    components: { ComponentWrapper },
    model: {
      prop: 'show',
      event: 'change',
    },
    props: {
      show: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    // computed: mapState(['componentData', 'canvasStyleData']),
    computed: {
      ...mapState({
        componentData: (state) => state.visual.curComponent,
        canvasStyleData: (state) => state.visual.canvasStyleData,
      }),
    },
    methods: {
      changeStyleWithScale,

      getStyle,

      close() {
        this.$emit('change', false)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: auto;
    background: rgb(0, 0, 0, 0.5);

    .canvas-container {
      width: calc(100% - 40px);
      height: calc(100% - 120px);
      overflow: auto;

      .canvas {
        position: relative;
        margin: auto;
        background: #fff;
      }
    }

    .close {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
</style>
