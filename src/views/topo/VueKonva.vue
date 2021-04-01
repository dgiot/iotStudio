<template>
  <div class="konva">
    <el-row :gutter="24">
      <el-col :span="18">
        <v-stage ref="Konvaref" :config="configKonva">
          <v-layer>
            <v-image
              ref="image"
              :config="{
                image: configimage,
              }"
            />
            <!-- <v-ellipse ref="ellipse" :config="configellipse" />  -->
            <v-rect ref="rect" :config="configrect2" />
            <v-rect ref="rect" :config="configrect1" />
            <v-circle ref="stage" :config="configCircle" />
            <v-text ref="text" :config="configText" />
            <v-text ref="text" :config="configText1" />
            <v-wedge ref="text" :config="configWedge" />
            <v-text ref="text" :config="configText2" />
            <v-text ref="text" :config="configText3" />
          </v-layer>
        </v-stage>
      </el-col>
      <el-col :span="6">
        <vue-json-editor
          v-model="configCircle"
          :mode="'code'"
          lang="zh"
          @has-error="onError"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import vueJsonEditor from 'vue-json-editor'
  import { randomHexColor, randomNum } from '@/utils'
  export default {
    components: {
      vueJsonEditor,
    },
    data() {
      return {
        configKonva: {
          width: 700,
          height: 400,
        },
        configCircle: {
          id: 'testId',
          x: 60,
          y: 130,
          radius: 7.5,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 0.5,
        },
        configrect1: {
          x: 60,
          y: 130,
          width: 10,
          height: 27,
          offsetX: 5,
          offsetY: 30,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 0.5,
          draggable: true,
          id: '1',
        },
        configrect2: {
          x: 60,
          y: 130,
          width: 10,
          height: 73,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 0.5,
          offsetX: 5,
          offsetY: 100,
          draggable: true,
          id: '2',
        },
        configText: {
          x: 10,
          y: 276,
          text: 'temperature:',
          fotsize: 20,
          fontFamily: 'Calibri',
          fill: 'red',
        },
        configText1: {
          x: 80,
          y: 276,
          text: '27℃',
          fotsize: 20,
          fontFamily: 'Calibri',
          fill: 'black',
        },
        configWedge: {
          x: 10,
          y: 300,
          radius: 50,
          angle: 60,
          fill: 'rgb(59, 131, 189)',
        },
        configText2: {
          x: 10,
          y: 360,
          text: 'opening:',
          fotsize: 20,
          fontFamily: 'Calibri',
          fill: 'red',
        },
        configText3: {
          x: 80,
          y: 360,
          text: '16.7%',
          fotsize: 20,
          fontFamily: 'Calibri',
          fill: 'black',
        },
        configimage: null,
      }
    },
    created() {
      let img = new window.Image()
      img.width = 692
      img.height = 519
      img.src =
        'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/konva/assets/taiti.png'
      img.onload = () => {
        // set image only when it is loaded
        this.configimage = img
      }
    },
    mounted() {
      this.setStyle()
    },
    methods: {
      // 动态设置konvajs宽高
      setStyle() {
        let el = document.getElementsByClassName('konvajs-content')[0]
        el.style.width = '100vh'
        el.style.height = '(100vh - #{$base-top-bar-height}'
        console.log(el.style)
      },
      onError() {
        this.$message('非Json数据类型')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .konva {
    .grid-content {
      margin: 20px auto;
      text-align: center;
    }
  }
</style>
