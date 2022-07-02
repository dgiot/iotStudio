<template>
  <div class="center">
    <el-form
      v-show="flagType !== 'preview'"
      :key="Form.objectId"
      class="demo-form-inline"
      :inline="true"
      :model="Form"
    >
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <div id="vditor" style="width: 400vh" :title="title" />
    <el-empty v-show="value == 'temp'" :image-size="200" />
  </div>
</template>
<script>
  import { putArticle } from '@/api/Article'
  import Vditor from 'vditor'
  // import 'vditor/src/assets/less/index.less'
  import 'vditor/dist/index.css'
  import { mapGetters } from 'vuex'
  import store from '@/store'
  export default {
    name: 'DgiotVditor',
    props: {
      value: {
        type: String,
        required: false,
        default: 'temp',
      },
      ruleForm: {
        type: Object,
        required: false,
        default() {
          return {}
        },
      },
      title: {
        type: String,
        required: false,
        default: '',
      },
      type: {
        type: String,
        required: false,
        default: 'preview',
      },
      objectId: {
        type: String,
        required: false,
        default: 'temp',
      },
    },
    data() {
      return {
        Form: this.ruleForm,
        flagType: this.type,
        queryForm: {
          name: '',
        },
        height: this.$baseTableHeight(0),
        contentEditor: {},
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
      }),
    },
    watch: {
      objectId(v) {
        this.Form.name = this.ruleForm.name
        this.createVditor()
      },
    },
    mounted() {},
    methods: {
      async save() {
        try {
          const loading = this.$baseColorfullLoading()
          const params = {
            data: this.contentEditor.getValue(),
          }
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'dgiot-hey-message-success'
          )
          const res = await putArticle(this.objectId, params)
          loading.close()
          dgiotlog.warn(this.contentEditor.getValue())
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      createVditor() {
        const { NODE_ENV = 'development' } = process.env
        this.Form = this.ruleForm
        // this.$set(Form, 'name', this.ruleForm.name)
        this.contentEditor = new Vditor('vditor', {
          // height: this.height,
          placeholder: '此处为话题内容……',
          theme: 'classic',
          counter: {
            enable: true,
            type: 'markdown',
          },
          preview: {
            delay: 0,
            hljs: {
              style: 'monokai',
              lineNumber: true,
            },
          },
          tab: '\t',
          typewriterMode: true,
          toolbarConfig: {
            pin: true,
          },
          cache: {
            enable: false,
          },
          mode: 'ir',
          toolbar: [
            'upload',
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            'record',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            'content-theme',
            'code-theme',
            'export',
            'fullscreen',
            'both',
            'preview',
            'info',
            'help',
          ],
          // https://ld246.com/article/1549638745630#options-upload
          upload: {
            headers: {
              'Sec-Fetch-Site': 'same-origin',
            },
            multiple: false,
            accept: 'image/*,.mp3, .wav, .rar',
            token: this.token,
            url:
              NODE_ENV == 'development'
                ? `${process.env.VUE_APP_URL}/upload`
                : location.origin + '/upload',
            linkToImgUrl: '/api/upload/fetch',
            extraData: {
              auth_token: this.token,
              scene: 'app',
              code: '',
              path: 'dgiot_file/docs/',
              output: 'json',
              submit: 'upload',
            },
            fieldName: 'file',
            filename(name) {
              return name
                .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
                .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
                .replace('/\\s/g', '')
            },
          },
          height: '100%',
          width: ' 155vh',
          value:
            '由于跨域问题，可前往[完整示例](https://ld246.com/guide/markdown)进行体验，前往 [API](https://ld246.com/article/1549638745630#options-upload) 进行了解。当然也欢迎在下方进行留言。',
          after: () => {
            this.contentEditor.setValue(this.value)
          },
        })

        console.log(this.contentEditor, this.Form.name)
      },
    },
  }
</script>
<style lang="scss">
  .dgiot-doc-header {
    margin-top: 10px;
  }

  #vditor {
    width: 100vh;
    height: calc(100vh - #{$base-top-bar-height} * 2.7 - 64px) !important;
  }
  .vditor-toolbar--pin,
  .vditor-reset {
    padding-left: 20px !important;
  }
  //.vditor-preview {
  //  height: 100vh !important;
  //}
</style>
