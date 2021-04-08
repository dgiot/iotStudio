<template>
  <div>
    <!--文件上传入口-->
    <div class="uploadfile">
      <el-upload
        ref="upload"
        action=""
        class="upload-demo"
        :http-request="beforeUpload"
        :before-upload="beforeUpload"
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
        @click="submitUpload"
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
      title="提示"
      :visible="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <span>文件上传成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { upload } from '@/api/Proxy/index'

  export default {
    name: 'UploadFile',
    props: {
      url: {
        type: String,
        default: '',
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
    methods: {
      beforeUpload(file) {
        let fd = new FormData()
        fd.append('file', file)
        let config = {
          onUploadProgress: (progressEvent) => {
            //progressEvent.loaded:已上传文件大小
            //progressEvent.total:被上传文件的总大小
            let complete =
              (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
            this.percentage = complete
            if (this.percentage >= 100) {
              this.dialogVisible = true
            }
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        console.log('upload', this.url)
        upload(fd, this.url)
          .then((res) => {
            console.log(res)
          })
          .catch((e) => {
            console.log(e)
          })
        // this.$axios
        //   .post(this.url, fd, config)
        //   .then((res) => {})
        //   .catch((err) => {})
      },
      handleExceed() {},
      submitUpload() {
        this.loading = true
        this.tips = '正在上传中。。。'
        this.$refs.upload.submit()
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
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-top: -100px;
    margin-left: -100px;
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
