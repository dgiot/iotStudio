<template>
  <div class="konva">
    <el-row :gutter="24">
      <el-col :span="20">
        <div id="container" ref="container"></div>
      </el-col>
      <el-col :span="4">
        <el-input v-model="text" placeholder="请输入你要修改的内容">
          <template slot="append">
            <el-button
              type="primary"
              plain
              :disabled="!text.length"
              @click="_setText(text)"
            >
              setText
            </el-button>
          </template>
        </el-input>
        <el-button
          type="warning"
          icon="el-icon-document-add"
          circle
          @click="_addRect"
        >
          绘制rete
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { randomHexColor, randomNum, uuid } from '@/utils'
  import createText from '@/utils/konva/createText'
  import createRect from '@/utils/konva/createRect'
  import setText from '@/utils/konva/setText'
  export default {
    data() {
      return {
        layer: new Konva.Layer(),
        simpleText: {},
        stage: {},
        text: '',
      }
    },
    mounted() {
      this.createKonva()
    },
    methods: {
      // 新增rect
      _addRect() {
        let rect = createRect(
          randomNum(10, 300),
          randomNum(10, 300),
          randomNum(10, 300),
          randomNum(10, 300),
          randomHexColor(),
          randomNum(10, 300),
          {
            x: randomNum(10, 300),
            y: randomNum(10, 300),
          },
          true,
          uuid(5)
        )
        this.layer.add(rect)
        this.stage.add(this.layer)
      },
      // 设置文本
      async _setText(text) {
        const { tween } = await setText(this.stage.find('#_text')[0], text)
        this.$message('手動修改成功')
      },
      // js 绘制
      createKonva() {
        this.stage = new Konva.Stage({
          container: 'container',
          width: '340',
          height: '300',
          id: '_container',
        })

        this.simpleText = createText()
        this.layer.add(this.simpleText)
        // add the layer to the stage
        // this.stage 必须放在最后面
        this.stage.add(this.layer)
      },
      // 动态设置konvajs宽高
      onError() {
        this.$message('非Json数据类型')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .konva {
    width: 100%;
    height: 100%;
    background: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png')
      no-repeat;
    background-size: 100% 100%;
    .grid-content {
      margin: 20px auto;
      text-align: center;
    }
  }
</style>
