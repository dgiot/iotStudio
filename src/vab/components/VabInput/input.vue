<template>
  <div>
    <input
      ref="uploader"
      type="file"
      style="display: none"
      :accept="accept"
      @change="doUpload($event)"
    />
    <div v-if="fileFlag">
      <i
        class="el-icon-close"
        style="position: relative; top: 20px; left: 101px"
        @click="remove"
      ></i>
      <img :src="url" style="width: 100px; height: 100px" />
    </div>
  </div>
</template>

<script>
  import { UploadImg } from '@/api/File'
  export default {
    name: 'VabInput',
    components: {},
    props: {
      accept: {
        type: String,
        default: 'image/*',
      },
    },
    data() {
      return {
        fileFlag: false, //是否上传成功
        url: '', //上传后的文件url
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
      doUpload(event) {
        let file = event.target.files[0]
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
            //将生成的url传递给父组件
            this.$emit('fileInfo', res)
            console.log('上传成功的回调', res)
          })
          .catch((e) => {
            console.log('出错了', e)
          })
      },
      //文件删除操作
      remove() {
        this.url = ''
        this.$emit('removeSuccess', {
          url: this.url,
        })
        this.fileFlag = false
      },
      //通过refs调用上传组件
      trigger() {
        this.$refs.uploader.click()
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
