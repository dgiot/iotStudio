<template>
  <div class="things-parse">
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('product.newapi')"
      :visible.sync="apiDialog"
      width="30%"
    >
      <el-form
        ref="formLabelAlign"
        label-position="left"
        label-width="170px"
        :model="formLabelAlign"
        :rules="rules"
        size="mini"
      >
        <!-- <el-form-item label="模块名称" prop="name"> -->
        <el-form-item
          :label="$translateTitle('plugins.modulename')"
          prop="name"
        >
          <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <!-- <el-form-item label="编程语言" prop="language"> -->
        <el-form-item
          :label="$translateTitle('plugins.programinglanguage')"
          prop="language"
        >
          <!-- <el-select v-model="formLabelAlign.language" placeholder="活动区域"> -->
          <el-select
            v-model="formLabelAlign.language"
            :placeholder="$translateTitle('resource.zoneofaction')"
          >
            <el-option
              v-for="item in formLabelAlign.languageList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          @click="submitFormApi('formLabelAlign')"
        >
          <!-- 创建 -->
          {{ $translateTitle('developer.create') }}
        </el-button>
        <el-button size="mini" @click="apiDialog = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
      </span>
    </el-dialog>
    <el-row :gutter="24">
      <el-col :span="7">
        <el-button type="primary" @click.native="addApi">
          <!-- 新增Api -->
          {{ $translateTitle('product.newapi') }}
        </el-button>
        <el-table
          ref="singleTable"
          :data="AllDict"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <!-- <el-table-column align="center" label="类型" width="100"> -->
          <el-table-column
            align="center"
            :label="$translateTitle('rule.Type')"
            width="100"
          >
            <template #default="{ row }">
              <span style="margin-left: 10px">{{ row.type }}</span>
            </template>
          </el-table-column>
          <!-- ----------------------which mod--------------------------------- -->
          <!-- ----------------------which mod--------------------------------- -->
          <!-- ----------------------which mod--------------------------------- -->
          <!-- ----------------------which mod--------------------------------- -->
          <el-table-column
            align="center"
            label="mod"
            :show-overflow-tooltip="true"
            width="120"
          >
            <template #default="{ row }">
              <span style="margin-left: 10px">{{ row.mod }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center"> -->
          <el-table-column
            align="center"
            :label="$translateTitle('task.Operation')"
          >
            <template #default="{ row, $index }">
              <!-- <el-button
                size="mini"
                title="调测"
                @click="handleTest($index, row.type, row.mod)"
              > -->
              <el-button
                size="mini"
                :title="$translateTitle('rule.testnewequipment')"
                @click="handleTest($index, row.type, row.mod)"
              >
                <dgiot-icon icon="bug-line" />
              </el-button>
              <!-- <el-button
                size="mini"
                type="primary"
                title="发布"
                @click="
                  handleRelease($index, row.type, row.mod)
                "
              > -->
              <el-button
                size="mini"
                :title="$translateTitle('product.pub')"
                type="primary"
                @click="handleRelease($index, row.type, row.mod)"
              >
                <dgiot-icon icon="run-line" />
              </el-button>
              <!-- <el-button
                size="mini"
                type="danger"
                title="下架"
                @click="
                  handleDelete($index, row.type, row.mod)
                "
              > -->
              <el-button
                size="mini"
                :title="$translateTitle('equipment.Offtheshelf')"
                type="danger"
                @click="handleDelete($index, row.type, row.mod)"
              >
                <dgiot-icon icon="delete-bin-2-fill" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="17">
        <!-- <el-tab-pane label="物解析" name="fourth"> -->
        <div class="protolheader">
          <el-tabs v-model="activeName" size="mini">
            <!-- <el-tab-pane label="设计" name="design"> -->
            <el-tab-pane
              :label="$translateTitle('product.Design')"
              name="design"
            >
              <VabJsonEditor ref="jsonEdit" v-model="itemSwagger" />
            </el-tab-pane>
            <!-- <el-tab-pane label="编码" name="code"> -->
            <el-tab-pane :label="$translateTitle('product.code')" name="code">
              <el-form
                ref="thingsParseModel"
                :inline="true"
                :model="thingsParseModel"
                :rules="thingsParseRules"
              />
              <div>
                <div style="background: #ffffff">
                  <label id="plug-name" />
                </div>
                <pre
                  id="editor"
                  class="ace_editor"
                  style="min-height: 480px; margin-bottom: 0"
                ><textarea class="ace_text-input" /></pre>
                <div style="background: #ffffff">
                  <label id="plug-name" />
                </div>
                <div
                  style="
                    padding: 5px;
                    margin-right: 80px;
                    color: #c2be9e;
                    background: #272822;
                    border-top: 1px solid #dddddd;
                  "
                >
                  <span>{{ $translateTitle('product.controloutput') }}</span>
                </div>
                <pre
                  id="editor2"
                  class="ace_editor"
                  style="min-height: 200px; margin-top: 0; margin-bottom: 0"
                ><textarea class="ace_text-input" /></pre>
              </div>
            </el-tab-pane>

            <!-- <el-tab-pane label="测试" name="swagger"> -->
            <el-tab-pane :label="$translateTitle('rule.Test')" name="swagger">
              <iframe height="700vh" :src="swaggerPath" width="100%" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <!-- </el-tab-pane> -->
  </div>
</template>
<script>
  import { getAllunit, queryDict } from '@/api/Dict/index'
  import { getDeviceCountByProduct } from '@/api/Device/index'
  import { getChannelCountByProduct } from '@/api/Channel/index'
  // const Base64 = require('js-base64').Base64
  import {
    delExproto,
    getExproto,
    postExproto,
    putExproto,
  } from '@/api/Exproto/index'
  import { Compile, subupadte } from '@/api/System/index.js'

  var isupdatetrue = ''
  var editor
  var editor1
  var editor2
  var editorgraphql
  var editor5
  var editor6
  var subdialog
  var editormodel
  var editorcreate
  var editorinsert
  var editorsubtable
  var channelrow = {}
  var setdata = ''
  var isallchannel = false

  export default {
    name: 'ThingsParse',
    components: {},
    props: {},
    data() {
      var validCode = (rule, value, callback) => {
        const reg = /[0-9a-zA-Z]/
        if (!reg.test(value)) {
          callback(new Error('协议名称由数字和字母组合'))
        } else {
          callback()
        }
      }

      return {
        fullscreenLoading: false,
        rules: {
          name: [
            {
              required: true,
              validator: validCode,
              trigger: 'blur',
            },
          ],
          language: [
            {
              required: true,
              message: '请选择编程语言',
              trigger: 'change',
            },
          ],
        },
        labelPosition: 'right',
        formLabelAlign: {
          languageList: ['python', 'java', 'ruby'],
          language: 'python',
          name: '',
          region: '',
          type: '',
        },
        apiDialog: false,
        activeName: 'design',
        itemSwagger: {},
        currentRow: null,
        AllDict: [],
        productName: '',
        form: {
          Productname: '',
          ProductKey: '',
          ProductAll: 0,
        },
        swaggerPath: process.env.VUE_APP_URL + '/swagger/#/',
        decoderstart: 0,
        decodertotal: 0,
        decoderlength: 10,
        protolchannel: [],
        productdetail: {},
        thingsParseModel: {
          name: '',
          version: '',
          desc: '',
          resource: false,
        },
        thingsParseRules: {
          name: [
            {
              required: true,
              message: '请输入协议名称',
              trigger: 'blur',
            },
            {
              validator: validCode,
              trigger: 'blur',
            },
          ],
        },
        dialogTableVisible: false,
        gridData: [],
        protoldialog: false,
      }
    },
    computed: {
      tableFilterData() {
        return null
      },
    },
    mounted() {
      // editor编辑器使用
      editor2 = ace.edit('editor2')
      editor2.session.setMode('ace/mode/python') // 设置语言
      editor2.setTheme('ace/theme/monokai') // 设置主题
      editor2.setReadOnly(true)
      editor2.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      // this.Industry();
      // this.getAllunit();
      this.getAllDict()
      this.setPath()
      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      }
    },
    methods: {
      setPath() {
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV !== 'development') {
          this.swaggerPath = location.origin + '/swagger/#/'
        }
      },
      // 李宏杰新增   下架api
      handleDelete(index, type, mod) {
        this.$confirm('确认要下架该api吗？')
          .then(async (_) => {
            const res = await delExproto({
              type: type,
              mod: mod,
              version: 'debug',
            })
            if (res) this.AllDict.splice(index, 1)
          })
          .catch((_) => {})
      },

      // 调试api
      async handleTest(index, Rtype, mod) {
        const data = {
          code: Base64.encode(editor.getValue()),
          mod: mod,
          swagger: JSON.parse(this.itemSwagger),
          type: Rtype,
        }
        const { results } = await putExproto(data)
        if (results) {
          editor2.setValue(Base64.decode(results))
          this.$message({
            showClose: true,
            message: '调测api成功',
            type: 'success',
          })
        } else {
          console.log(e)
          this.$message.error('api有错误,请检查')
        }
      },

      // 发布api
      async handleRelease(index, Rtype, mod) {
        const params = {
          code: Base64.encode(editor.getValue()),
          mod: mod,
          swagger: JSON.parse(this.itemSwagger),
          type: Rtype,
        }
        const res = await postExproto(params)
        if (res) {
          this.$message({
            showClose: true,
            message: '发布api成功',
            type: 'success',
          })
        } else {
          this.$message.error('api有错误,请检查')
        }
      },
      /**
       *
       * @param addApi
       */
      addApi() {
        this.apiDialog = true
      },
      /**
       *
       * @param 提交创建的接口
       */
      submitFormApi(form) {
        this.$refs[form].validate(async (_valid) => {
          const languageList = {
            python:
              'IyBjb2Rpbmc9dXRmOAppbXBvcnQgb3MKCmRlZiBwb3N0KGFyZ3Msc2Vzc2lvbixlbnYpOgogICAgI2JvZHkgPSBqc29uLmxvYWRzKGJhc2U2NC5iNjRkZWNvZGUoYXJncykuZGVjb2RlKCJ1dGYtOCIpKQogICAgI3ByaW50KGJvZHkpCiAgICAjc3RyYm9keSA9ICd7fScuZm9ybWF0KGJvZHkpCiAgICAjZW5ib2R5ID0gIGJhc2U2NC5iNjRlbmNvZGUoc3RyYm9keS5lbmNvZGUoJ3V0Zi04JykpCiAgICAjcHJpbnQoZW5ib2R5KQogICAgI3N0YXRlID0ganNvbi5sb2FkcyhiYXNlNjQuYjY0ZGVjb2RlKGVudikuZGVjb2RlKCJ1dGYtOCIpKQogICAgI3ByaW50KHN0YXRlKQogICAgIyByZXN0dXJsID0gc3RhdGVbJ3JvbGVzJ11bMF1bJ3RhZyddWydhcHBjb25maWcnXVsncmVzdCddCiAgICAjIHByaW50KHJlc3R1cmwpCiAgICAjIHMuaGVhZGVycy51cGRhdGUoeyJzZXNzaW9uVG9rZW4iOiBzZXNzaW9uLCAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSkKICAgICMgcnQgPSBzLmdldCgne30vY2xhc3Nlcy9EZXZpY2U/b3JkZXI9Y3JlYXRlZEF0JmxpbWl0PTEwJnNraXA9MCcuZm9ybWF0KHJlc3R1cmwpLAogICAgIyAgICAgICAgICAgICAgcGFyYW1zPXsnb3JkZXInOiAnY3JlYXRlZEF0JywgfSkKICAgICMgZm9yIHJvdyBpbiAocnQuanNvbigpWydyZXN1bHRzJ10pOgogICAgIyAgICAgcHJpbnQocm93KQogICAgcHJpbnQoYXJncykKICAgIHByaW50KHNlc3Npb24pCiAgICBwcmludChlbnYpCiAgICByZXR1cm4gYXJncwoKZGVmIG1haW4oKToKICAgICN7Im5hbWUiOiJzaHV3YSJ9CiAgICBhcmd2cyA9ICdleUp1WVcxbElqb2ljMmgxZDJFaWZRPT0nCiAgICByZXR1cm4gIHBvc3QoYXJndnMsICdzZXNzaW9uJywnZW52JykKCmRlZiBleGl0KCk6CiAgICBvcy5fZXhpdCgwKQoKaWYgX19uYW1lX18gPT0gIl9fbWFpbl9fIjoKICAgIG1haW4oKQ==',
            java: '',
            ruby: '',
          }
          const pythonName = '/python_' + this.formLabelAlign.name
          const Params = {
            code: languageList[this.formLabelAlign.language],
            mod: this.formLabelAlign.name,
            swagger: {
              definitions: {},
              paths: {
                '/python_hello': {
                  post: {
                    description: 'Python测试API',
                    parameters: [
                      {
                        description: '生成报告',
                        in: 'body',
                        name: 'data',
                        required: true,
                        schema: {
                          properties: {
                            name: {
                              description: '姓名',
                              example: 'shuwa',
                              required: true,
                              type: 'string',
                            },
                          },
                          type: 'object',
                        },
                      },
                    ],
                    responses: {
                      200: {
                        description: 'Returns operation status',
                      },
                      400: {
                        description: 'Bad Request',
                      },
                      401: {
                        description: 'Unauthorized',
                      },
                      403: {
                        description: 'Forbidden',
                      },
                      500: {
                        description: 'Server Internal error',
                      },
                    },
                    summary: 'Python测试API',
                    tags: ['EXPROTO'],
                  },
                },
              },
              tags: [
                {
                  description: '扩展编程',
                  name: 'EXPROTO',
                },
              ],
            },

            type: this.formLabelAlign.language,
          }
          if (_valid) {
            const res = await getExproto(Params)
            if (res) {
              this.apiDialog = false
              this.$message({
                type: 'success',
                message: '新增api成功',
              })
              this.getAllDict()
            } else {
              this.$message({
                type: 'error',
                message: '新增api失败' + e,
              })
            }
          }
        })
      },
      handleCurrentChange(val) {
        console.log(val, 'val')
        const { swagger = {} } = val
        this.itemSwagger = swagger
        // this.currentRow = val.code;
        // this.$refs.singleTable.setCurrentRow(val.code);
        editor = ace.edit('editor')
        editor.session.setMode('ace/mode/python') // 设置语言
        editor.setTheme('ace/theme/monokai') // 设置主题
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })
        editor.setValue(Base64.decode(val.code))
        editor.gotoLine(editor.session.getLength())
        // this.getProDetail(val.objectId);
      },
      toggle(type) {
        console.log(type)
      },
      async getAllDict() {
        const { results } = await getExproto({
          type: 'python',
          mod: 'all',
          version: 'debug',
        })
        if (results) {
          this.AllDict = results
          console.log(this.AllDict)
          if (this.AllDict.length) {
            this.handleCurrentChange(results[0])
          }
        }
      },
      async Industry() {
        this.option = []
        const parsms = {
          limit: 1000,
          where: {
            'data.key': 'category',
          },
        }
        const { results } = await queryDict(parsms)
        results.map((items) => {
          var obj = {}
          obj.value = items.type
          obj.label = items.data.CategoryName
          obj.id = items.data.Id
          obj.parentid = items.data.SuperId
          this.option.push(obj)
        })
      },
      // 得到产品详情
      getProDetail(productId) {
        // console.log('===')
        this.productId = productId
        editor = ace.edit('editor')
        editor.session.setMode('ace/mode/erlang') // 设置语言
        editor.setTheme('ace/theme/monokai') // 设置主题
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true, // 设置自动提示
        })

        // editor6 = ace.edit("editor6");
        // editor6.session.setMode("ace/mode/json"); // 设置语言
        // editor6.setTheme("ace/theme/twilight"); // 设置主题
        // editor6.setOptions({
        //   enableBasicAutocompletion: true,
        //   enableSnippets: true,
        //   enableLiveAutocompletion: true // 设置自动提示
        // });
        this.$get_object('Product', productId).then((response) => {
          if (response) {
            this.productName = response.name
            for (var key in response) {
              this.productdetail[key] = response[key]
            }
            this.option.map((items) => {
              if (this.productdetail.category == items.value) {
                this.productdetail.category = items.label
              }
            })
            this.productdetail.createdAt = this.utc2beijing(response.createdAt)
            this.productdetail.id = response.id
            this.dynamicReg = response.dynamicReg
            this.productdetail.isshow = 0
            this.form.Productname = response.name
            this.ProductSecret = response.productSecret
            this.form.Productkey = this.productId
            // window.location.origin
            this.productimg = response.icon
            if (response.decoder) {
              setdata = response.decoder.code
              this.thingsParseModel.name = response.decoder.name
              this.thingsParseModel.version = response.decoder.version
              this.thingsParseModel.desc = response.decoder.desc
            } else {
              setdata =
                'JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4='
            }
            if (!this.productdetail.thing) {
              this.productdetail.thing = {
                properties: [],
              }
            }

            this.wmxData = this.productdetail.thing.properties.filter(
              (item) => {
                return item.name && item.dataType
              }
            )

            editor.setValue(Base64.decode(setdata))

            editor.gotoLine(editor.session.getLength())
            // editor6.setValue(JSON.stringify(this.productdetail.thing, null, 4));

            this.queryDeviceCount(this.productId)
          }
        })
      },
      // 查询设备总数
      async queryDeviceCount(productId) {
        this.form.ProductAll = await getDeviceCountByProduct(productId)
      },
      editordata(row) {
        this.thingsParseModel.name = row.attributes.data.name
        this.thingsParseModel.version = row.attributes.data.version
        this.thingsParseModel.desc = row.attributes.data.desc
        this.thingsParseModel.resource = row.attributes.data.enable
        editor.setValue(Base64.decode(row.attributes.data.code))
        this.dialogTableVisible = false
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 100)
        this.allunit = results.concat([])
        this.allunit.unshift({
          data: {
            Name: '无',
            Symbol: '',
          },
        })
      },
      subAce(thingsParseModel, istrue) {
        this.$refs[thingsParseModel].validate((valid) => {
          if (valid) {
            var obj = {
              name: thingsParseModel.name,
              version: thingsParseModel.version,
              code: Base64.encode(editor.getValue()),
              desc: thingsParseModel.desc,
            }
            const params = {
              decoder: obj,
            }
            this.$update_object('Product', this.productId, params)
              .then((res) => {
                if (this.issub == false) {
                  this.$message({
                    type: 'success',
                    message: '保存成功',
                  })
                  if (istrue == true) {
                    isupdatetrue += '保存成功'
                    editor2.setValue(isupdatetrue)
                  }
                }
                this.issub = true
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            this.$message({
              type: 'warning',
              message: '输入格式有误',
            })
          }
        })
      },
      subAce1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              where: {
                'data.name': this.formInline.name,
                'data.version': this.formInline.version,
              },
            }
            this.$query_object('Dict', params)
              .then((response) => {
                if (response.results && response.results.length >= 1) {
                  this.$message('此协议版本已存在')
                  return
                } else {
                  this.$get_object('Product', this.productId).then(
                    (response) => {
                      if (response) {
                        var obj = {
                          name: this.formInline.name,
                          version: this.formInline.version,
                          code: Base64.encode(editor.getValue()),
                          desc: this.formInline.desc,
                        }
                        const params = {
                          key:
                            this.formInline.name +
                            ':' +
                            this.formInline.version,
                          type: 'decoder',
                          data: obj,
                          ACL: response.ACL,
                        }
                        this.$create_object('Dict', params)
                          .then((resultes) => {
                            if (resultes.error) {
                              this.$message({
                                type: 'error',
                                message: resultes.error,
                              })
                            } else {
                              this.$message({
                                type: 'success',
                                message: '保存到公共协议库成功',
                              })
                            }
                          })
                          .catch((e) => {
                            console.log(e)
                          })
                      }
                    }
                  )
                }
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            this.$message({
              type: 'warning',
              message: '输入格式有误',
            })
          }
        })
      },
      decoderSizeChange(val) {
        this.decoder.length = val
        this.chaxun()
      },
      devicerCurrentChange(val) {
        this.decoderstart = (val - 1) * this.decoderlength
        this.chaxun()
      },
      updateAllChannel() {
        if (this.multipleSelection.length == 0) {
          this.protoldialog = false
        } else {
          var arr = []
          this.multipleSelection.map((item) => {
            arr.push(
              new Promise((reslove, reject) => {
                return subupadte(item.id, 'update')
                  .then((resultes) => {
                    if (resultes) {
                      reslove(resultes)
                    }
                  })
                  .catch((error) => {
                    reject(error)
                  })
              })
            )
          })
          Promise.all(arr)
            .then((data) => {
              this.$message({
                message: '热加载成功',
                type: 'success',
              })
              if (data.length == this.multipleSelection.length) {
                this.protoldialog = false
              }
            })
            .catch((error) => {
              this.$message({
                message: error,
                type: 'error',
              })
            })
        }
      },
      // 通道全选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      getChannelEnable(row, rowIndex) {
        if (row.row.attributes.isEnable == true) {
          return 'green_active'
        } else {
          return 'red_active'
        }
      },
      deletedata(objectId) {
        this.$del_object('Dict', objectId)
          .then((resultes) => {
            if (resultes) {
              this.$message('成功删除')
              this.chaxun()
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 热加载弹窗
      async updatesubdialog() {
        this.protoldialog = true
        const type = '1'
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        getChannelCountByProduct(
          this.channellength,
          this.channelstart,
          product,
          type
        )
          .then((res) => {
            this.protolchannel = res.results
            this.$refs.multipleTable.toggleAllSelection()
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      chaxun() {
        const params = {
          count: 'objectId',
          skip: this.decoderstart,
          limit: this.decoderlength,
          where: {
            type: 'decoder',
          },
        }
        this.dialogTableVisible = true
        this.$query_object('Dict', params)
          .then((res) => {
            if (res) {
              this.decodertotal = res.count
              this.gridData = res.results
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      // 协议编辑
      protol() {
        var log = ''
        Compile(Base64.encode(editor.getValue()))
          .then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '编译成功',
              })
              log = '编译成功' + res.mod + '\r\n'
              this.warningeditror = res.warnings
              this.warningeditror.map((items) => {
                log += items + '\r\n'
              })
              isupdatetrue += log
              editor2.setValue(isupdatetrue)
            }
          })
          .catch((error) => {
            this.warningeditror = error.error
            this.warningeditror.map((items) => {
              log += items + '\r\n'
            })
            isupdatetrue += log
            editor2.setValue(isupdatetrue)
          })
      },
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .things-parse {
    width: 100%;
    margin: 20px;

    .ace_editor {
      margin-right: 80px;
    }
  }
</style>
