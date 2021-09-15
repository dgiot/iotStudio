<template>
  <div>
    <!--文件上传入口-->
    <div class="uploadfile">
      <el-upload
        ref="upload"
        action=""
        class="upload-demo"
        :before-upload="FileRequest"
        :accept="accept"
        drag
        :auto-upload="false"
        :on-exceed="handleExceed"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击选择文件</em>
        </div>
      </el-upload>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click.native="submitUpload"
      >
        上传
      </el-button>
    </div>
    <!--遮罩层-->
    <div v-if="loading" class="loading">
      <h4 class="tips">{{ tips }}</h4>
      <!--进度条-->
      <el-progress
        type="line"
        :percentage="percentage"
        class="progress"
        :show-text="true"
      />
    </div>
    <!--上传完成提示对话框-->
    <el-dialog
      :append-to-body="true"
      title="提示"
      :visible="dialogVisible"
      width="30%"
    >
      <span>文件上传成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { UploadImg } from '@/api/File'
  export default {
    name: 'VabUploadFile',
    props: {
      accept: {
        type: String,
        default: 'image/*',
      },
    },
    data() {
      return {
        loading: false,
        percentage: 0,
        tips: '',
        dialogVisible: false,
      }
    },
    computed: {},
    methods: {
      //http-request的钩子
      FileRequest(file) {
        console.log('file', file)
        let config = {
          onUploadProgress: (progressEvent) => {
            //progressEvent.loaded:已上传文件大小
            //progressEvent.total:被上传文件的总大小
            let complete =
              (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
            this.percentage = complete
            // if (this.percentage >= 100) {
            //   this.dialogVisible = true
            // }
          },
          headers: {
            proxy: true, // 是否开启代理
            produrl: '/dgiotproxy/shuwa_file/', // 开启代理后的真实上传路径
            devurl: 'group1/',
            'Content-Type': 'multipart/form-data',
          },
        }
        UploadImg(file, config)
          .then((res) => {
            this.loading = false
            this.$emit('fileInfo', res.data)
            console.log('上传成功的回调', res)
          })
          .catch((e) => {
            this.loading = false
            console.log('出错了', e)
          })
      },
      handleExceed() {},
      submitUpload() {
        const fileList = this.$refs.upload.fileList
        if (fileList.length) {
          this.loading = true
          this.tips = '正在上传中。。。'
          this.$refs.upload.submit()
        } else {
          this.$message.error('请先上传图片')
          return
        }
      },
      ensure() {
        this.dialogVisible = false
        this.loading = false
      },
    },
  }
</script>

<style scoped>
  .uploadfile {
    /* position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-top: -100px;
    margin-left: -100px; */
  }
  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    opacity: 0.8;
  }
  .progress {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-top: -100px;
    margin-left: -100px;
  }
  .tips {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -100px;
    color: #409eff;
  }
</style>
