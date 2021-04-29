<!-- 组件说明 -->
<template>
  <div>
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
        <el-input v-model="bachgroundurl" placeholder="">
          <el-button
            slot="append"
            type="primary"
            class="el-icon-upload2"
            style="cursor: pointer"
            @click="upload"
          />
        </el-input>
        <el-button type="primary" @click="updataImg(bachgroundurl)">
          更新背景
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  // import x from ''
  export default {
    name: 'Operation',
    components: {},
    props: {
      img: {
        type: String,
        default: '',
      },
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
        bachgroundurl: this.img,
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
      updataImg(img) {
        // 触发父组件更新事件
        this.$emit('upImg', img)
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
