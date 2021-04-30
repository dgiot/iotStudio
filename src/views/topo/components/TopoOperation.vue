<!-- 组件说明 -->
<template>
  <div class="operation">
    <el-tabs v-model="activeName">
      <div class="unvisible">
        <el-upload
          ref="upload"
          class="upload-demo"
          style="display: none"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <el-tab-pane label="配置" name="setting">
        <!-- <el-input v-model="bachgroundurl" placeholder="">
          <el-button
            slot="append"
            type="primary"
            class="el-icon-upload2"
            style="cursor: pointer"
            @click="upload"
          />
        </el-input> -->
        <!-- <el-button size="mini" type="primary" @click="updataImg(bachgroundurl)">
          更新背景
        </el-button>
        <el-button size="mini" type="primary" @click="clearImg()">
          {{ isVisible ? '隐藏' : '显示' }}背景
        </el-button> -->
        <el-form
          style="color: black"
          size="mini"
          label-width="80px"
          :model="Shapeconfig"
        >
          <el-form-item
            v-for="(item, index) in Shapeconfig"
            v-show="isShowItem(`${index}`)"
            :key="index"
            :label="index"
          >
            <el-input
              v-if="isShowLable(`${index}`)"
              v-model="Shapeconfig[index]"
              style="width: 80%"
              :disabled="isdisabled(`${index}`)"
            />
            <el-radio
              v-else
              v-model="Shapeconfig[index]"
              :label="Shapeconfig[index]"
            >
              {{ Shapeconfig[index] }}
            </el-radio>
          </el-form-item>
          <el-form-item v-if="Shapeconfig.id">
            <el-button type="primary" @click="saveKonvaitem(Shapeconfig)">
              {{ $translateTitle('developer.determine') }}
            </el-button>
            <el-button type="primary" @click="showJson = !showJson">
              {{ $translateTitle('developer.json') }}
            </el-button>
          </el-form-item>
        </el-form>
        <vue-json-editor
          v-show="showJson"
          v-model="Shapeconfig"
          :mode="'code'"
          lang="zh"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import vueJsonEditor from 'vue-json-editor'
  export default {
    name: 'Operation',
    components: { vueJsonEditor },
    props: {
      stopMqtt: {
        type: Boolean,
        default: false,
      },
      drawerflag: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        disableLable: ['id'],
        hideLable: ['draggable'],
        ShowItem: ['container'],
        isVisible: true,
        showJson: false,
        fileList: [
          {
            name: 'food.jpeg',
            url:
              'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url:
              'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
        Shapeconfig: {},
        bachgroundurl: '',
        activeName: 'setting',
      }
    },
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      isShowItem(lable) {
        return !this.ShowItem.includes(lable)
      },
      isdisabled(lable) {
        return this.disableLable.includes(lable)
      },
      isShowLable(disabled) {
        return !this.hideLable.includes(disabled)
      },
      updataImg(img) {
        // 触发父组件更新事件
        this.$emit('upImg', img)
      },
      saveKonvaitem(config) {
        // 触发父组件更新事件
        this.$emit('upconfig', config)
      },
      clearImg() {
        this.isVisible = !this.isVisible
        this.$emit('clearImg', this.isVisible)
      },
      upload() {
        this.$refs['upload'].$children[0].$refs.input.click()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .operation {
    height: calc(100vh - #{$base-top-bar-height}* 4 - 25px);
    margin-left: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    color: wheat;
  }
</style>
