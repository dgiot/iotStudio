<template>
  <div class="konva">
    <el-row :gutter="20">
      <el-col :span="8">
        <v-stage ref="stage" :config="configKonva">
          <v-layer>
            <v-circle :config="configCircle" />
          </v-layer>
        </v-stage>
        <el-button type="primary" plain @click="getRefJson">
          getRefJson
        </el-button>
        <el-button type="success" plain @click="setRefJson">
          setRefJson
        </el-button>
      </el-col>
      <el-col :span="8">
        <vue-json-editor
          v-model="configCircle"
          :mode="'code'"
          lang="zh"
          @has-error="onError"
        />
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <h3>说明：</h3>
          <p>getRefJson: 获取当前节点的json数据</p>
          <p>setRefJson：随机设置节点数据</p>
          <p>修改中间的json,图表会实时更新</p>
          <p>
            当前案列为圆图：文档
            https://konvajs.org/docs/shapes/Circle.html#page-title
          </p>
          <p>每个不同图形的json参数也不同</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import vueJsonEditor from 'vue-json-editor'
  import { randomHexColor, randomNum } from '@/utils'
  export default {
    components: { vueJsonEditor },
    data() {
      return {
        configKonva: {
          width: 200,
          height: 200,
        },
        configCircle: {
          id: 'testId',
          x: 100,
          y: 100,
          radius: 70,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
        },
      }
    },
    methods: {
      onError() {
        this.$message('非Json数据类型')
      },
      getRefJson() {
        const el = this.$refs['stage']
        console.log(el.getNode().cache())
        let toJSON = el.getStage().toJSON()
        this.$message(toJSON)

        // console.log(el.create())
      },
      setRefJson() {
        this.configCircle = {
          id: 'testId111',
          x: randomNum(0, 100),
          y: randomNum(0, 100),

          radius: randomNum(0, 100),
          fill: randomHexColor(),
          stroke: randomHexColor(),
          strokeWidth: randomNum(0, 100),
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .konva {
    .grid-content {
      text-align: center;
      margin: 20px auto;
    }
  }
</style>
