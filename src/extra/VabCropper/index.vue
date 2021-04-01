<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="头像裁剪"
    width="470px"
  >
    <el-alert
      title="未保存到数据库，请放心使用，刷新后即可还原到原有状态"
      type="success"
    />
    <el-row>
      <el-col :span="24">
        <vab-cropper-beta
          ref="vabCropper"
          :options="options"
          :origin-img="slide.oriUrl"
          :preview-img="slide.preUrl"
          @get-vab-cropper="getCropper(arguments)"
        />
      </el-col>
    </el-row>
    <template #footer>
      <div>
        <el-button type="primary" @click="upload">上传并保存</el-button>
        <el-upload
          :auto-upload="false"
          :on-change="onChange"
          accept="image/jpeg,image/gif,image/png"
          action="#"
          list-type="picture-card"
        >
          <template #default>
            <el-button type="primary">选择图片</el-button>
          </template>
        </el-upload>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import 'vab-cropper/dist/vab-cropper.css'
  import VabCropperBeta from 'vab-cropper'
  import { mapActions } from 'vuex'

  export default {
    name: 'VabCropper',
    components: { VabCropperBeta },
    data() {
      return {
        dialogVisible: false,
        value: '',
        options: {
          width: 220,
          height: 220,
        },
        slide: {
          oriUrl:
            'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/cropper_images/user.gif',
          preUrl:
            'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/cropper_images/user.gif',
        },
        timer: null,
      }
    },
    methods: {
      ...mapActions({
        setAvatar: 'user/setAvatar',
      }),
      getCropper(argument) {
        if (this.timer) clearInterval(this.timer)
        this.timer = setTimeout(() => {
          this.slide.preUrl = argument[0]
          this.value = argument[0]
          this.setAvatar(argument[0])
        }, 10)
      },
      onChange(file) {
        this.$refs['vabCropper'].cancelCropper()
        this.slide = {
          oriUrl: file.url,
          preUrl: file.url,
        }
        this.$refs['vabCropper'].drawImg()
      },
      upload() {
        this.setAvatar(this.value)
        this.$baseMessage(
          '模拟保存成功',
          'success',
          false,
          'vab-hey-message-success'
        )
        this.dialogVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    @media only screen and (max-width: 767px) {
      .vab-cropper-canvas {
        display: block;
        float: none;
        margin: 0 auto;
      }
      .vab-cropper-preview {
        display: none;
      }
    }

    .el-textarea {
      margin-top: $base-margin;
    }

    .el-dialog__footer {
      height: 72px;

      &:before {
        display: block;
        clear: both;
        content: '';
      }

      > div {
        > div {
          display: inline;

          .el-upload-list {
            display: none;
          }

          .el-upload--picture-card {
            float: right;
            width: auto;
            height: $base-input-height;
            line-height: $base-input-height;
            vertical-align: middle;
            background-color: transparent;
            border: 0;
            border-radius: 0;
          }
        }

        .el-button {
          float: right;
          margin-left: 10px;
        }
      }
    }
  }
</style>
