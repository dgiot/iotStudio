<template>
  <div class="center">
    <div class="dgiot-doc-header">
      <vab-query-form>
        <vab-query-form-left-panel />
        <vab-query-form-right-panel>
          <el-form
            ref="form"
            :inline="true"
            label-width="0"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="save(value)"
              >
                {{ $translateTitle('button.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
    </div>
    <div id="vditor" :key="setKey" name="description"></div>
  </div>
</template>
<script>
  import { getArticle, putArticle } from '@/api/Article'
  export default {
    name: 'VabVditor',
    props: {
      value: {
        type: String,
        required: false,
        default: '111',
      },
    },
    data() {
      return {
        queryForm: {
          name: '',
        },
        height: this.$baseTableHeight(0),
        setKey: moment(new Date()).valueOf(),
        contentEditor: {},
      }
    },
    watch: {
      value(v) {
        console.warn(
          v,
          'vditorvditorvditorvditorvditorvditorvditorvditorvditorvditor'
        )
        this.createVditor()
      },
    },
    mounted() {},
    methods: {
      async save(value) {
        try {
          const loading = this.$baseColorfullLoading()
          const params = {
            data: this.contentEditor.getValue(),
          }
          this.$baseMessage(
            this.$translateTitle('user.update completed'),
            'success',
            'vab-hey-message-success'
          )
          const res = await putArticle(this.$route.query.article, params)
          loading.close()
          console.warn(this.contentEditor.getValue(), value)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      createVditor() {
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
          mode: 'sv',
          toolbar: [
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
            // 'record',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'edit-mode',
            // 'content-theme',
            'code-theme',
            'export',
            {
              name: 'more',
              toolbar: ['fullscreen', 'both', 'preview', 'info', 'help'],
            },
          ],
          after: () => {
            this.contentEditor.setValue(this.value)
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  //@import 'https://unpkg.com/vditor@3.8.6/src/assets/scss/index.scss';
  @import 'https://unpkg.com/vditor@3.8.6/dist/index.css';
  .dgiot-doc-header {
    margin-top: 10px;
  }
  #vditor {
    height: calc(100vh - #{$base-top-bar-height}* 2.7 - 64px);
  }
</style>
