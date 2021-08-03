<template>
  <div class="things-parse">
    <el-row :gutter="24">
      <el-col :span="4">
        <el-table
          ref="singleTable"
          :data="AllDict"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="objectId" label="ID" />
          <!-- <el-table-column prop="name" label="产品名称" /> -->
          <el-table-column
            prop="name"
            :label="$translateTitle('task.productname')"
          />
        </el-table>
      </el-col>
      <el-col :span="20">
        <!-- <el-tab-pane label="物解析" name="fourth"> -->
        <div class="protolheader">
          <el-form
            ref="thingsParseModel"
            :inline="true"
            :model="thingsParseModel"
            :rules="thingsParseRules"
          >
            <el-form-item
              :label="$translateTitle('product.protocolname')"
              prop="name"
            >
              <el-input
                v-model="thingsParseModel.name"
                :placeholder="$translateTitle('product.protocolname')"
              />
            </el-form-item>
            <el-form-item :label="$translateTitle('plugins.version')">
              <el-input
                v-model="thingsParseModel.version"
                :placeholder="$translateTitle('plugins.version')"
              />
            </el-form-item>
            <el-form-item :label="$translateTitle('developer.describe')">
              <el-input
                v-model="thingsParseModel.desc"
                :placeholder="$translateTitle('developer.describe')"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="subAce('thingsParseModel', true)"
              >
                {{ $translateTitle('product.preservation') }}
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="subAce1('thingsParseModel')"
              >
                <!-- 设为公共 -->
                {{ $translateTitle('product.setaspublic') }}
              </el-button>
              <el-button type="primary" size="small" @click="chaxun">
                {{ $translateTitle('product.publicagreementlibrary') }}
              </el-button>
              <el-button type="primary" size="small" @click="protol">
                {{ $translateTitle('product.compile') }}
              </el-button>
              <el-button type="success" size="small" @click="updatesubdialog">
                <!-- 热加载 -->
                {{ $translateTitle('product.thermalloading') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--通道热加载-->
        <!-- <el-dialog
  :append-to-body="true"
          :visible.sync="protoldialog"
          :close-on-click-modal="false"
          title="通道热加载"
          width="50%"
        > -->
        <el-dialog
          :append-to-body="true"
          :visible.sync="protoldialog"
          :close-on-click-modal="false"
          :title="$translateTitle('product.tdthermalloading')"
          width="50%"
        >
          <el-table
            ref="multipleTable"
            :data="protolchannel"
            :row-class-name="getChannelEnable"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              :label="$translateTitle('developer.channelnumber')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.objectId }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$translateTitle('developer.channelname')">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$translateTitle('developer.channeladdr')">
              <template slot-scope="scope">
                <span>{{ 'channel/' + scope.row.objectId }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$translateTitle('developer.channeltype')">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">
                  {{ $translateTitle('developer.collectionchannel') }}
                </span>
                <span v-else>
                  {{ $translateTitle('developer.resourcechannel') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$translateTitle('developer.servicetype')">
              <template slot-scope="scope">
                <span>{{ scope.row.cType }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button type="primary" @click="updateAllChannel">确定</el-button> -->
            <el-button type="primary" @click="updateAllChannel">
              <!-- 确定 -->
              {{ $translateTitle('developer.determine') }}
            </el-button>
          </div>
        </el-dialog>
        <!--公共协议库弹窗-->
        <el-dialog
          :append-to-body="true"
          :title="$translateTitle('product.publicagreementlibrary')"
          :visible.sync="dialogTableVisible"
          :close-on-click-modal="false"
          width="50%"
        >
          <el-table
            :data="gridData"
            style="width: 100%; margin-top: 20px; text-align: center"
          >
            <el-table-column
              :label="$translateTitle('product.protocolname')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.data.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$translateTitle('plugins.version')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.data.version }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$translateTitle('developer.describe')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.data.desc }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="创建时间" align="center"> -->
            <el-table-column
              :label="$translateTitle('application.createtime')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ utc2beijing(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$translateTitle('developer.operation')"
              align="center"
              width="200"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editordata(scope.row)"
                >
                  {{ $translateTitle('product.clone') }}
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deletedata(scope.row.ObjectId)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="elpagination" style="padding: 20px 0">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              :page-size="decoderlength"
              :total="decodertotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="decoderSizeChange"
              @current-change="devicerCurrentChange"
            />
          </div>
        </el-dialog>
        <div v-if="AllDict">
          <div style="background: #ffffff">
            <label id="plug-name" />
          </div>
          <pre
            id="editor"
            class="ace_editor"
            style="min-height: 600px; margin-bottom: 0"
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
            style="min-height: 300px; margin-top: 0; margin-bottom: 0"
          ><textarea class="ace_text-input" /></pre>
        </div>
      </el-col>
    </el-row>
    <!-- </el-tab-pane> -->
  </div>
</template>
<script>
  import { getDeviceCountByProduct } from '@/api/Device/index'
  import { getChannelCountByProduct } from '@/api/Channel/index'
  import { getAllunit, getDictCount } from '@/api/Dict/index'
  import { queryProduct } from '@/api/Product/index'
  var isupdatetrue = ''
  var editor
  var editor2
  var setdata = ''
  import { Compile, subupadte } from '@/api/System/index.js'
  export default {
    name: 'ThingsParse',
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
        currentRow: null,
        AllDict: [],
        productName: '',
        form: {
          Productname: '',
          ProductKey: '',
          ProductAll: 0,
        },
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
      editor2.session.setMode('ace/mode/text') // 设置语言
      editor2.setTheme('ace/theme/monokai') // 设置主题
      editor2.setReadOnly(true)
      editor2.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true, // 设置自动提示
      })
      this.Industry()
      this.getAllunit()
      this.getAllDict()
      if (this.$route.query.activeName) {
        this.activeName = this.$route.query.activeName
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val
        this.$refs.singleTable.setCurrentRow(val)
        this.getProDetail(val.objectId)
      },
      async getAllDict() {
        const params = {
          where: { category: { $nin: ['Evidence'] } },
          order: 'updatedAt', // -updatedAt  updatedAt
        }
        const { results } = await queryProduct(params)
        if (results) {
          this.AllDict = results
          this.handleCurrentChange(results[0])
        }
      },
      async Industry() {
        this.option = []
        const { results } = await this.$getIndustry('category', 100)
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
        this.$get_object('Product', productId).then((response) => {
          if (response) {
            console.log('response', response.decoder)
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
              this.$baseMessage('暂无decoder,将显示默认值', 'warning', false)
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
        this.thingsParseModel.name = row.data.name
        this.thingsParseModel.version = row.data.version
        this.thingsParseModel.desc = row.data.desc
        this.thingsParseModel.resource = row.data.enable
        editor.setValue(Base64.decode(row.data.code))
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
            this.$update_object('Product', this.productId, params).then(
              (res) => {
                if (this.issub == false) {
                  this.$message({
                    type: 'success',
                    message: '保存成功',
                  })
                  if (istrue == true) {
                    isupdatetrue += '保存成功'
                    editor2.setValue(isupdatetrue)
                  }
                } else {
                }
                this.issub = true
              }
            )
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
                'data.name': this.thingsParseModel.name,
                'data.version': this.thingsParseModel.version,
              },
            }
            this.$query_object('Dict', params).then((response) => {
              if (response.results && response.results.length >= 1) {
                this.$message('此协议版本已存在')
                return
              } else {
                this.$get_object('Product', this.productId).then((response) => {
                  if (response) {
                    var obj = {
                      name: this.thingsParseModel.name,
                      version: this.thingsParseModel.version,
                      code: Base64.encode(editor.getValue()),
                      desc: this.thingsParseModel.desc,
                    }
                    const params = {
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
                })
              }
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
        if (row.isEnable == true) {
          return 'green_active'
        } else {
          return 'red_active'
        }
      },
      deletedata(ObjectId) {
        this.$del_object('Dict', ObjectId).then((resultes) => {
          if (resultes) {
            this.$message('成功删除')
            this.chaxun()
          }
        })
      },
      // 热加载弹窗
      updatesubdialog() {
        this.protoldialog = true
        const type = '1'
        const product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        getChannelCountByProduct(10, 0, product, type)
          .then((res) => {
            if (res.count > 0) {
              this.protolchannel = res.results
              this.$refs.multipleTable.toggleAllSelection()
            } else {
              this.protolchannel = {}
              this.$refs.multipleTable.toggleAllSelection()
            }
          })
          .catch((err) => {
            console.log(err)
            this.$baseMessage('请求出错', err.error, 3000)
          })
      },
      chaxun() {
        const params = {
          skip: this.decoderstart,
          limit: this.decoderlength,
          order: '-createdAt',
          where: {
            type: 'decoder',
          },
        }
        this.$query_object('Dict', params).then((res) => {
          if (res) {
            this.decodertotal = res.count
            this.dialogTableVisible = true
            this.gridData = res.results
          }
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
<style rel="stylesheet/scss" lang="scss">
  .things-parse {
    width: 100%;
    margin: 40px;

    .ace_editor {
      margin-right: 80px;
    }
  }
</style>
