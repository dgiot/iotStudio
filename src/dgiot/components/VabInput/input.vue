<template>
  <div>
    <input
      ref="uploader"
      :accept="accept"
      style="display: none"
      type="file"
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
      params: {
        type: Object,
        required: false,
        default: function () {
          return {}
        },
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
        const name = event.target.files[0].name
        const type = name.split('.').pop().toLowerCase()
        this.$emit('files', file, type)
        const params = this.params
        dgiotlog.log('extension', params)
        try {
          UploadImg(params)
            .then((res) => {
              //将生成的url传递给父组件
              res.data.path =
                res.data.path + `?timestamp=${new Date().getTime()}`
              res.data.timestamp = new Date().getTime()
              res.data.Date = new Date()
              this.$emit('fileInfo', res.data)
              dgiotlog.log('上传成功的回调', res.data)
            })
            .catch((e) => {
              dgiotlog.log('出错了', e)
            })
        } catch (e) {
          dgiotlog.log(e)
        }
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
