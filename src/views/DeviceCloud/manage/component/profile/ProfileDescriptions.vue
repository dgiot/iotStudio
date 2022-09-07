<template>
  <div :key="productId">
    <a-tabs default-active-key="物模型" type="card" @change="handletabs">
      <a-tab-pane key="物模型" :disabled="!productId" tab="物模型">
        <dgiot-query-form-left-panel>
          <el-button
            :disabled="!productId"
            size="small"
            type="primary"
            @click.native="checkschema"
          >
            {{ $translateTitle('product.viewobjectmodel') }}
          </el-button>
          <!-- 新增自定义属性 -->
          <el-button
            :disabled="!productId"
            size="small"
            type="primary"
            @click.native="createProperty"
          >
            {{ $translateTitle('product.newobjectmodel') }}
          </el-button>
        </dgiot-query-form-left-panel>
        <el-table
          :key="tableType"
          v-loading="tableLoading"
          border
          :cell-style="{ 'text-align': 'center' }"
          :data="
            tableType == 'things'
              ? things
              : tableType == 'profile' || tableType == 'parser'
              ? parserTableList
              : tableType == 'basedate.params'
              ? dictTableList
              : []
          "
          :header-cell-style="{ 'text-align': 'center' }"
          highlight-current-row
          row-key="objectId"
          size="medium"
          style="width: 100%"
        >
          <div v-if="tableType == 'things'" :key="tableType + thingKey">
            <el-table-column
              align="center"
              :label="$translateTitle('product.order')"
              prop="dataForm.order"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.Rounds')"
              prop="dataForm.round"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.Strategy')"
              prop="dataForm.strategy"
              show-overflow-tooltip
              sortable
              width="auto"
            />

            <el-table-column
              align="center"
              :label="$translateTitle('product.protocol')"
              prop="dataForm.protocol"
              show-overflow-tooltip
              sortable
              width="auto"
            />

            <el-table-column
              align="center"
              :label="$translateTitle('product.identifier')"
              prop="identifier"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.functionname')"
              prop="name"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.datatype')"
              prop="dataType.type"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              fixed="right"
              :label="$translateTitle('product.datadefinition')"
              prop="dataType.type"
              show-overflow-tooltip
              sortable
              width="auto"
            >
              <template #default="{ row }">
                <span
                  v-if="
                    row.dataType.specs &&
                    (row.dataType.type == 'double' ||
                      row.dataType.type == 'float' ||
                      row.dataType.type == 'int')
                  "
                >
                  {{
                    $translateTitle('product.rangeofvalues') +
                    row.dataType.specs.min +
                    '~' +
                    row.dataType.specs.max
                  }}
                </span>
                <span v-else-if="row.dataType.type == 'string'">
                  {{
                    $translateTitle('product.datalength') +
                    ':' +
                    row.dataType.size +
                    $translateTitle('product.byte')
                  }}
                </span>
                <span v-else-if="row.dataType.type != 'struct'">
                  {{ row.dataType.specs }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              :label="$translateTitle('developer.operation')"
              min-width="240"
              width="auto"
            >
              <template #default="{ row, $index }">
                <el-button
                  size="mini"
                  type="danger"
                  @click.native="deletewmx($index)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click.native="wmxDataFill(row, $index)"
                >
                  <!-- 编辑 -->
                  {{ $translateTitle('task.Edit') }}
                </el-button>
              </template>
            </el-table-column>
          </div>
          <div v-else-if="tableType == 'profile' || tableType == 'parser'">
            <el-table-column
              align="center"
              label="uid"
              prop="uid"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.chinesetitle')"
              prop="name"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <el-popover placement="top" trigger="hover">
                  <p>
                    {{ $translateTitle('product.englishtitle') }}:
                    {{ row.enname }}
                  </p>
                  <p>
                    {{ $translateTitle('developer.describe') }}:
                    {{ row.description }}
                  </p>
                  <p>
                    {{ $translateTitle('product.identifier') }}:
                    {{ row.identifier }}
                  </p>
                  <p>
                    {{ $translateTitle('developer.describe') }}:
                    {{ row.description }}
                  </p>
                  <p>
                    {{ $translateTitle('product.Table Name') }}:
                    {{ row.table }}
                  </p>
                  <p>
                    {{ $translateTitle('product.class') }}:
                    {{ row.field }}
                  </p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">
                      {{ row.name }}
                    </el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('product.functionaltypes')"
              prop="type"
              show-overflow-tooltip
              sortable
            />
          </div>
          <div v-else>
            <el-empty :image-size="200" />
          </div>
        </el-table>
      </a-tab-pane>
      <a-tab-pane key="解码器" :disabled="!productId" tab="解码器">
        <div :style="{ height: $baseTableHeight(0) + 'px', overflow: 'auto' }">
          <el-form
            class="demo-form-inline"
            :inline="true"
            :model="decoderInfo"
            size="mini"
          >
            <el-form-item label="解码器标题">
              <el-input v-model="decoderInfo.title" placeholder="解码器标题" />
            </el-form-item>
            <el-form-item>
              <el-button
                effect="dark"
                :type="decodeType == 'post' ? 'success' : 'info'"
                @click.native="savecodes"
              >
                {{
                  decodeType == 'post'
                    ? $translateTitle('button.add')
                    : $translateTitle('button.edit')
                }}
              </el-button>
            </el-form-item>
          </el-form>
          <dgiot-monaco-plus
            ref="dgiotCodes"
            :codes="ace_editor"
            :lang="'proto'"
            :read-only="true"
            :theme="'vs-dark'"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="低代码" :disabled="!productId" tab="低代码">
        <dgiot-views :view-form="viewForm" />
      </a-tab-pane>
      <a-tab-pane key="组态" :disabled="!productId" tab="组态">
        <el-empty :image-size="200" />
      </a-tab-pane>
      <a-tab-pane key="规则" :disabled="!productId" tab="规则">
        <el-empty :image-size="200" />
      </a-tab-pane>
      <a-tab-pane key="字典" :disabled="!productId" tab="字典">
        <dgiot-dict :dict-form="dictForm" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  import { queryDict, putDict, postDict } from '@/api/Dict/index'
  import { mapGetters, mapMutations } from 'vuex'
  import moment from 'moment'
  import { putProductTemplet } from '@/api/ProductTemplet'
  import dgiotViews from '@/views/CloudFunction/lowcode'
  import dgiotDict from '@/views/CloudFunction/dict'
  export default {
    name: 'ProfileDescriptions',
    components: {
      dgiotViews,
      dgiotDict,
    },
    props: {
      thingKey: {
        required: true,
        type: String,
        default: '',
      },
      productId: {
        required: true,
        type: String,
        default: '',
      },
      tableLoading: {
        required: false,
        type: Boolean,
        default: false,
      },
      dictTableList: {
        required: false,
        type: Array,
        default: () => [],
      },
      decoderTableList: {
        required: false,
        type: Object,
        default: () => {},
      },
      parserTableList: {
        required: false,
        type: Array,
        default: () => [],
      },
      things: {
        required: false,
        type: Array,
        default: () => [],
      },
      tableType: {
        required: true,
        type: String,
        default: '',
      },
    },
    data() {
      return {
        dialogTopoVisible: false,
        lowcodeLen: 0,
        dictLen: 0,
        viewForm: {},
        dictForm: {},
        amisconfig: [],
        amisForm: {},
        dialogTableVisible: false,
        dialogDictVisible: false,
        key: moment(new Date()).valueOf(),
        editType: 0,
        amisJsonPlus: '',
        ace_editor: '',
        decoderInfo: {},
        decodeType: 'put',
        codeFlag: false,
        amisFlag: false,
        activeName: 'first',
        productDetail: {
          decoder: { code: '' },
          thing: { properties: [] },
          config: {
            parser: [],
            profile: [],
            amis: [],
            basedate: { params: [] },
          },
        },
      }
    },
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
    watch: {
      amisJson: {
        deep: true,
        handler(val) {
          this.amisJsonPlus = JSON.stringify(val)
        },
      },
    },
    mounted() {
      this.$dgiotBus.$off('monaco-save')
      this.$dgiotBus.$off('lowcodeLen')
      this.$dgiotBus.$on('lowcodeLen', (length) => {
        this.lowcodeLen = length
      })
      this.$dgiotBus.$off('dictLen')
      this.$dgiotBus.$on('dictLen', (length) => {
        this.dictLen = length
      })
    },
    destroyed: function () {
      this.$dgiotBus.$off('monaco-save')
    },
    methods: {
      async handletabs(tabs) {
        this.viewForm = {
          class: 'ProductTemplet',
          type: 'amis',
          key: this.productId,
          title: '',
          disabled: true,
          data: {
            type: 'page',
            initApi: {
              url: 'iotapi/classes/Device/parse_objectid',
              method: 'get',
              adaptor:
                'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
              headers: {
                store: 'localStorage',
                dgiotReplace: 'parse_objectid',
              },
              dataType: 'json',
            },
            body: [
              {
                type: 'form',
                api: {
                  method: 'put',
                  url: 'iotapi/classes/Device/parse_objectid',
                  headers: {
                    store: 'localStorage',
                    dgiotReplace: 'parse_objectid',
                  },
                  dataType: 'json',
                  requestAdaptor:
                    'return {\r\n    ' +
                    '...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
                },
                body: [
                  {
                    type: 'input-text',
                    label: '设备名称',
                    name: 'name',
                  },
                ],
              },
            ],
          },
          hiddenRow: ['class', 'key', 'createdAt'],
        }
        this.dictForm = {
          class: 'ProductTemplet',
          type: '',
          key: this.productId,
          title: '',
          disabled: true,
          data: {
            params: [],
          },
          hiddenRow: ['class', 'key', 'createdAt'],
        }
        switch (tabs) {
          case '物模型':
            await this.featProperties(this.productDetail.thing.properties)
            break
          case '解码器':
            await this.$dgiotBus.$off('monaco-save')
            await this.queryDecoder(this.productId)
            break
          case '低代码':
            break
          case '组态':
            await this.topoView()
            break
          case '规则':
            this.openRule()
            break
          case '字典':
            this.openDict()
            break
        }
      },
      async queryDecoder(codeid) {
        const { results } = await queryDict({
          limit: 1,
          where: {
            key: codeid,
            type: 'decoder',
          },
        })
        this.decodeType = results.length == 0 ? 'post' : 'put'
        // 首先查一下是否存在解码器
        this.ace_editor =
          this.decodeType == 'put'
            ? Base64.decode(results[0].data.decoder)
            : Base64.decode(
                'Ly8gY29weSBmcm9tOiBodHRwczovL2dycGMuaW8vZG9jcy93aGF0LWlzLWdycGMvaW50cm9kdWN0aW9uLwoKCnN5bnRheCA9ICJwcm90bzMiOwoKb3B0aW9uIGphdmFfbXVsdGlwbGVfZmlsZXMgPSB0cnVlOwpvcHRpb24gamF2YV9wYWNrYWdlID0gImlvLmdycGMuZXhhbXBsZXMuZGxpbmsiOwpvcHRpb24gamF2YV9vdXRlcl9jbGFzc25hbWUgPSAiRGxpbmtQcm90byI7Cm9wdGlvbiBvYmpjX2NsYXNzX3ByZWZpeCA9ICJkbGluayI7CgpwYWNrYWdlIGRnaW90OwoKLy8gVGhlIGRsaW5rIHNlcnZpY2UgZGVmaW5pdGlvbi4Kc2VydmljZSBEbGluayB7CiAgLy8gU2VuZHMgYSBncmVldGluZwogIHJwYyBTYXlIZWxsbyAoSGVsbG9SZXF1ZXN0KSByZXR1cm5zIChIZWxsb1JlcGx5KSB7fQoKICAvLyBJZiB0aGUgcmVxdWVzdGVkIHNlcnZpY2UgaXMgdW5rbm93biwgdGhlIGNhbGwgd2lsbCBmYWlsIHdpdGggc3RhdHVzCiAgLy8gTk9UX0ZPVU5ELgogIHJwYyBDaGVjayhIZWFsdGhDaGVja1JlcXVlc3QpIHJldHVybnMgKEhlYWx0aENoZWNrUmVzcG9uc2UpOwoKICAvLyBQZXJmb3JtcyBhIHdhdGNoIGZvciB0aGUgc2VydmluZyBzdGF0dXMgb2YgdGhlIHJlcXVlc3RlZCBzZXJ2aWNlLgogIC8vIFRoZSBzZXJ2ZXIgd2lsbCBpbW1lZGlhdGVseSBzZW5kIGJhY2sgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhlIGN1cnJlbnQKICAvLyBzZXJ2aW5nIHN0YXR1cy4gIEl0IHdpbGwgdGhlbiBzdWJzZXF1ZW50bHkgc2VuZCBhIG5ldyBtZXNzYWdlIHdoZW5ldmVyCiAgLy8gdGhlIHNlcnZpY2UncyBzZXJ2aW5nIHN0YXR1cyBjaGFuZ2VzLgogIC8vCiAgLy8gSWYgdGhlIHJlcXVlc3RlZCBzZXJ2aWNlIGlzIHVua25vd24gd2hlbiB0aGUgY2FsbCBpcyByZWNlaXZlZCwgdGhlCiAgLy8gc2VydmVyIHdpbGwgc2VuZCBhIG1lc3NhZ2Ugc2V0dGluZyB0aGUgc2VydmluZyBzdGF0dXMgdG8KICAvLyBTRVJWSUNFX1VOS05PV04gYnV0IHdpbGwgKm5vdCogdGVybWluYXRlIHRoZSBjYWxsLiAgSWYgYXQgc29tZQogIC8vIGZ1dHVyZSBwb2ludCwgdGhlIHNlcnZpbmcgc3RhdHVzIG9mIHRoZSBzZXJ2aWNlIGJlY29tZXMga25vd24sIHRoZQogIC8vIHNlcnZlciB3aWxsIHNlbmQgYSBuZXcgbWVzc2FnZSB3aXRoIHRoZSBzZXJ2aWNlJ3Mgc2VydmluZyBzdGF0dXMuCiAgLy8KICAvLyBJZiB0aGUgY2FsbCB0ZXJtaW5hdGVzIHdpdGggc3RhdHVzIFVOSU1QTEVNRU5URUQsIHRoZW4gY2xpZW50cwogIC8vIHNob3VsZCBhc3N1bWUgdGhpcyBtZXRob2QgaXMgbm90IHN1cHBvcnRlZCBhbmQgc2hvdWxkIG5vdCByZXRyeSB0aGUKICAvLyBjYWxsLiAgSWYgdGhlIGNhbGwgdGVybWluYXRlcyB3aXRoIGFueSBvdGhlciBzdGF0dXMgKGluY2x1ZGluZyBPSyksCiAgLy8gY2xpZW50cyBzaG91bGQgcmV0cnkgdGhlIGNhbGwgd2l0aCBhcHByb3ByaWF0ZSBleHBvbmVudGlhbCBiYWNrb2ZmLgogIHJwYyBXYXRjaChIZWFsdGhDaGVja1JlcXVlc3QpIHJldHVybnMgKHN0cmVhbSBIZWFsdGhDaGVja1Jlc3BvbnNlKTsKCn0KCi8vIFRoZSByZXF1ZXN0IG1lc3NhZ2UgY29udGFpbmluZyB0aGUgdXNlcidzIG5hbWUuCm1lc3NhZ2UgSGVsbG9SZXF1ZXN0IHsKICBzdHJpbmcgbmFtZSA9IDE7Cn0KCi8vIFRoZSByZXNwb25zZSBtZXNzYWdlIGNvbnRhaW5pbmcgdGhlIGdyZWV0aW5ncwptZXNzYWdlIEhlbGxvUmVwbHkgewogIHN0cmluZyBtZXNzYWdlID0gMTsKfQoKCm1lc3NhZ2UgSGVhbHRoQ2hlY2tSZXF1ZXN0IHsKICBzdHJpbmcgc2VydmljZSA9IDE7Cn0KCm1lc3NhZ2UgSGVhbHRoQ2hlY2tSZXNwb25zZSB7CiAgZW51bSBTZXJ2aW5nU3RhdHVzIHsKICAgIFVOS05PV04gPSAwOwogICAgU0VSVklORyA9IDE7CiAgICBOT1RfU0VSVklORyA9IDI7CiAgICBTRVJWSUNFX1VOS05PV04gPSAzOyAgLy8gVXNlZCBvbmx5IGJ5IHRoZSBXYXRjaCBtZXRob2QuCiAgfQogIFNlcnZpbmdTdGF0dXMgc3RhdHVzID0gMTsKfQ'
              )
        this.decoderInfo =
          results.length > 0 ? results[0] : { title: codeid + '的解码器' }
        this.$nextTick(() => {
          this.$dgiotBus.$on('monaco-save', async (data) => {
            const params = {
              data: { decoder: Base64.encode(data) },
              class: 'Product',
              title: this.decoderInfo.title,
              type: 'decoder',
              key: this.productId,
            }
            if (this.decodeType == 'post') {
              const res = await postDict(params)
              this.$message({
                showClose: true,
                duration: 2000,
                message: `${this.$translateTitle(
                  'user.Save the template successfully'
                )}`,
                type: 'success',
              })
            } else {
              const { msg } = await putDict(this.decoderInfo.objectId, params)
            }
          })
        })
        // monaco-save bus 事件，这里将解码器的代码编码后提交到库
      },
      openView() {
        this.dialogTableVisible = true
      },
      topoView() {
        this.dialogTopoVisible = true
      },
      openRule() {},
      openDict() {
        // this.feateditorParser(this.productDetail, 'parser', true)
        this.dialogDictVisible = true
      },
      savecodes() {
        if (!this.productId) return false
        else {
          // fix refs.editor.getValue()
          this.$refs.dgiotCodes.save(
            this.$refs.dgiotCodes.$refs.monacoEditor.editor.getValue()
          )
          this.decodeType = 'put'
        }
      },
      async saveAmis(productId, amisconfig, productDetail) {
        const mergeAmis = _.merge(this.productDetail, {
          config: { amis: amisconfig },
        })
        dgiotlog.log(productId, amisconfig, productDetail, mergeAmis)
        const res = await putProductTemplet(productId, {
          config: this.productDetail.config,
        })
        this.$baseMessage(
          this.$translateTitle('alert.Data request successfully'),
          'success',
          'dgiot-hey-message-success'
        )
        this.amisFlag = false
      },
      addAmis() {
        // const amis = {
        //   date: moment(new Date()).valueOf(),
        //   description: `${moment(new Date()).format(
        //     'YYYY-MM-DD HH:mm:ss'
        //   )} 新增低代码`,
        //   json: {
        //     type: 'page',
        //     title: `${moment(new Date()).format(
        //       'YYYY-MM-DD HH:mm:ss'
        //     )} 新增低代码`,
        //     body: [
        //       {
        //         type: 'chart',
        //         config: {
        //           xAxis: {
        //             type: 'category',
        //             data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        //           },
        //           yAxis: {
        //             type: 'value',
        //           },
        //           series: [
        //             {
        //               data: [820, 932, 901, 934, 1290, 1330, 1320],
        //               type: 'line',
        //             },
        //           ],
        //         },
        //         replaceChartOption: true,
        //       },
        //       {
        //         label: '组合穿梭器',
        //         type: 'tabs-transfer',
        //         name: 'a',
        //         sortable: true,
        //         searchable: true,
        //         options: [
        //           {
        //             label: '成员',
        //             selectMode: 'tree',
        //             children: [
        //               {
        //                 label: '法师',
        //                 children: [
        //                   {
        //                     label: '诸葛亮',
        //                     value: 'zhugeliang',
        //                   },
        //                 ],
        //               },
        //               {
        //                 label: '战士',
        //                 children: [
        //                   {
        //                     label: '曹操',
        //                     value: 'caocao',
        //                   },
        //                   {
        //                     label: '钟无艳',
        //                     value: 'zhongwuyan',
        //                   },
        //                 ],
        //               },
        //               {
        //                 label: '打野',
        //                 children: [
        //                   {
        //                     label: '李白',
        //                     value: 'libai',
        //                   },
        //                   {
        //                     label: '韩信',
        //                     value: 'hanxin',
        //                   },
        //                   {
        //                     label: '云中君',
        //                     value: 'yunzhongjun',
        //                   },
        //                 ],
        //               },
        //             ],
        //           },
        //           {
        //             label: '用户',
        //             selectMode: 'chained',
        //             children: [
        //               {
        //                 label: '法师',
        //                 children: [
        //                   {
        //                     label: '诸葛亮',
        //                     value: 'zhugeliang2',
        //                   },
        //                 ],
        //               },
        //               {
        //                 label: '战士',
        //                 children: [
        //                   {
        //                     label: '曹操',
        //                     value: 'caocao2',
        //                   },
        //                   {
        //                     label: '钟无艳',
        //                     value: 'zhongwuyan2',
        //                   },
        //                 ],
        //               },
        //               {
        //                 label: '打野',
        //                 children: [
        //                   {
        //                     label: '李白',
        //                     value: 'libai2',
        //                   },
        //                   {
        //                     label: '韩信',
        //                     value: 'hanxin2',
        //                   },
        //                   {
        //                     label: '云中君',
        //                     value: 'yunzhongjun2',
        //                   },
        //                 ],
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //     subTitle: '副标题',
        //     remark: '标题提示信息',
        //   },
        //   type: 'add',
        // }
        // if (this.amisconfig?.length) {
        //   this.amisconfig.every((item) => {
        //     dgiotlog.log(item)
        //     if (item.type == 'add') {
        //       dgiotlog.log(item)
        //       this.$message.warning('请设计上一条低代码数据')
        //       return false
        //     } else {
        //       this.amisconfig.unshift(amis)
        //     }
        //   })
        // } else {
        //   this.amisconfig = [amis]
        // }
      },
      handleEdit(index, row) {
        this.amisForm = row
        this.editType = index
        dgiotlog.log(index, row)
        this.set_amisJson(row.json)
        this.amisFlag = true
      },
      handleDelete(index, row) {
        dgiotlog.log(index, row)
        this.amisconfig.splice(index, 1)
      },
      cancelForm() {
        this.amisconfig[this.editType].json = this.amisJson
        if (this.amisconfig[this.editType].type == 'add')
          this.amisconfig[this.editType].type = 'edit'
        this.amisFlag = false
      },
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      seeDecoder(productDetail) {
        const { decoder = {} } = productDetail
        this.dialogTableVisible = false
        this.dialogDictVisible = false
        this.codeFlag = !this.codeFlag
        this.ace_editor = Base64.decode(decoder.code)
        // editor.gotoLine(editor.session.getLength())
      },
      featProperties(params) {
        dgiotlog.log(params)
        this.codeFlag = false
        this.dialogTableVisible = false
        this.dialogDictVisible = false
        this.$parent.$parent.$parent.properties(params)
      },
      feateditorParser(config, type, flag) {
        this.codeFlag = false
        this.dialogTableVisible = false
        this.dialogDictVisible = false
        this.$parent.$parent.$parent.editorParser(config, type, flag)
      },
      createProperty() {
        this.$parent.$parent.$parent.createProperty()
      },
      deletewmx(row) {
        this.$parent.$parent.$parent.deletewmx(row)
      },
      wmxDataFill(rowData, index) {
        this.$parent.$parent.$parent.wmxDataFill(rowData, index)
      },
      goKonva(objectId) {
        this.$parent.$parent.$parent.goKonva(objectId)
      },
      checkschema() {
        this.$parent.$parent.$parent.checkschema()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>
