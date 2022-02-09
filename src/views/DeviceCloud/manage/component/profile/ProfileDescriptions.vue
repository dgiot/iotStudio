<template>
  <div :key="productId">
    <a-tabs default-active-key="物模型" s type="card" @change="handletabs">
      <a-tab-pane key="物模型" tab="物模型">
        <vab-query-form-left-panel>
          <el-button size="small" type="primary" @click.native="checkschema">
            {{ $translateTitle('product.viewobjectmodel') }}
          </el-button>
          <!-- 新增自定义属性 -->
          <el-button size="small" type="primary" @click.native="createProperty">
            {{ $translateTitle('product.newobjectmodel') }}
          </el-button>
        </vab-query-form-left-panel>
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
      <a-tab-pane key="解码器" tab="解码器">
        <vab-monaco-plus
          ref="monacoCode"
          :codes="ace_editor"
          :lang="'json'"
          :read-only="true"
          :theme="'vs-dark'"
        />
      </a-tab-pane>
      <a-tab-pane key="低代码" tab="低代码">
        <dgiot-views :view-form="viewForm" />
      </a-tab-pane>
      <a-tab-pane key="组态" tab="组态">
        <el-empty :image-size="200" />
      </a-tab-pane>
      <a-tab-pane key="规则" tab="规则">
        <el-empty :image-size="200" />
      </a-tab-pane>
      <a-tab-pane key="字典" tab="字典">
        <dgiot-dict :dict-form="dictForm" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
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
      this.$dgiotBus.$off('lowcodeLen')
      this.$dgiotBus.$on('lowcodeLen', (length) => {
        this.lowcodeLen = length
      })
      this.$dgiotBus.$off('dictLen')
      this.$dgiotBus.$on('dictLen', (length) => {
        this.dictLen = length
      })
    },
    methods: {
      async handletabs(tabs) {
        console.log('handletabs', tabs)
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
                    'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
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
            console.log('ace_editor', this.ace_editor)
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
          'vab-hey-message-success'
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
        dgiotlog.log(ace, 'ace', this.ace_editor)
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
