<template>
  <div :key="productId">
    <el-descriptions
      border
      class="margin-top"
      :column="2"
      :content-style="{ 'text-align': 'left' }"
      :label-style="{ 'text-align': 'center' }"
    >
      <!--      <el-descriptions-item :label="$translateTitle('home.category')">-->
      <!--        {{ productDetail.netType }}-->
      <!--      </el-descriptions-item>-->
      <!--      <el-descriptions-item :label="$translateTitle('product.nodetype')">-->
      <!--        <span v-if="productDetail.nodeType == 1">-->
      <!--          {{ $translateTitle('product.gateway') }}-->
      <!--        </span>-->
      <!--        <span v-if="productDetail.nodeType == 0">-->
      <!--          {{ $translateTitle('product.equipment') }}-->
      <!--        </span>-->
      <!--      </el-descriptions-item>-->
      <el-descriptions-item>
        <template slot="label">
          <el-link
            type="success"
            @click.native="feateditorParser(productDetail, 'things', false)"
          >
            {{ $translateTitle('product.physicalmodel') }}
          </el-link>
        </template>
        <el-link
          :disabled="productDetail.thing.properties.length ? false : true"
          :type="productDetail.thing.properties.length ? 'success' : 'default'"
          @click.native="featProperties(productDetail.thing.properties)"
        >
          {{ productDetail.thing.properties.length || 0 }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="false"
        :label="$translateTitle('product.parser')"
      >
        <template slot="label">
          <el-link
            type="success"
            @click.native="feateditorParser(productDetail, 'parser', true)"
          >
            {{ $translateTitle('product.parser') }}
          </el-link>
        </template>
        <el-link
          :type="productDetail.config.parser.length ? 'success' : 'default'"
          @click.native="feateditorParser(productDetail, 'parser', false)"
        >
          {{ productDetail.config.parser.length || 0 }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item v-if="false">
        <template slot="label">
          <el-link
            type="success"
            @click.native="feateditorParser(productDetail, 'profile', true)"
          >
            {{ $translateTitle('product.profile') }}
          </el-link>
        </template>
        <el-link
          type="primary"
          @click.native="feateditorParser(productDetail, 'profile', false)"
        >
          {{ productDetail.config.profile.length || 0 }}
        </el-link>
      </el-descriptions-item>
      <!--      组态完善之后再加-->
      <el-descriptions-item v-if="false">
        <template slot="label">
          <el-link
            type="warning"
            @click.native="goKonva(productDetail.objectId)"
          >
            {{ $translateTitle('concentrator.konva') }}
          </el-link>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            :disabled="!productDetail.decoder.code.length"
            type="primary"
            @click.native="seeDecoder(productDetail)"
          >
            {{ $translateTitle('product.decoder') }}
          </el-link>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            :disabled="productId.length != 10"
            type="success"
            @click.native="openView"
          >
            {{ $translateTitle('product.lowcode') }}
          </el-link>
        </template>
        <el-link
          :disabled="productId.length != 10"
          type="success"
          @click.native="openView"
        >
          {{ lowcodeLen }}
        </el-link>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <el-link
            :disabled="productId.length != 10"
            type="success"
            @click.native="openDict"
          >
            {{ $translateTitle('product.dict') }}
          </el-link>
        </template>
        <el-link
          :disabled="productId.length != 10"
          type="success"
          @click.native="openDict"
        >
          {{ dictLen }}
        </el-link>
      </el-descriptions-item>
    </el-descriptions>
    <vab-query-form
      v-show="
        productId.length == 10 &&
        !dialogTableVisible &&
        tableType == 'things' &&
        !dialogDictVisible
      "
    >
      <vab-query-form-left-panel>
        <el-button size="small" type="primary" @click.native="checkschema">
          {{ $translateTitle('product.viewobjectmodel') }}
        </el-button>
        <!-- 新增自定义属性 -->
        <el-button size="small" type="primary" @click.native="createProperty">
          {{ $translateTitle('product.newobjectmodel') }}
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <div v-if="dialogTableVisible" style="margin-top: 10px">
      <dgiot-views :view-form="viewForm" />
    </div>
    <!--   字典 -->
    <div v-if="dialogDictVisible" style="margin-top: 10px">
      <dgiot-dict :dict-form="dictForm" />
    </div>
    <el-table
      v-if="!codeFlag && !dialogTableVisible && !dialogDictVisible"
      :key="tableType"
      v-loading="tableLoading"
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
      height="60vh"
      highlight-current-row
      size="medium"
      style="width: 100%"
    >
      <div v-if="tableType == 'things'" :key="tableType + thingKey">
        <el-table-column type="expand">
          <template
            v-if="row.dataType.type == 'struct'"
            slot-scope="scope"
            class="opentable"
          >
            <el-table
              :data="row.dataType.specs"
              style="box-sizing: border-box; width: 60%; text-align: center"
            >
              <el-table-column
                align="center"
                :label="$translateTitle('product.identifier')"
              >
                <template slot-scope="scope1">
                  <span>{{ scope1.row.identifier }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$translateTitle('product.functionaltypes')"
              >
                <span>
                  {{ $translateTitle('product.attribute') }}
                </span>
              </el-table-column>

              <el-table-column
                align="center"
                :label="$translateTitle('product.functionname')"
                prop="name"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('product.datadefinition')"
              />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('product.order')"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.order }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('product.Rounds')"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.round }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$translateTitle('product.Strategy')"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{ row.dataForm.strategy }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$translateTitle('product.protocol')"
          sortable
          width="80"
        >
          <template #default="{ row }">
            {{
              row.dataForm && row.dataForm.protocol ? row.dataForm.protocol : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('product.functionaltypes')"
          sortable
          width="120"
        >
          <span>{{ $translateTitle('product.attribute') }}</span>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$translateTitle('product.identifier')"
          prop="identifier"
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('product.functionname')"
          prop="name"
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('product.datatype')"
          sortable
        >
          <template #default="{ row }">
            <span>{{ row.dataType.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('product.datadefinition')"
          sortable
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
            <span v-else-if="row.dataType.type == 'date'" />
            <span v-else-if="row.dataType.type != 'struct'">
              {{ row.dataType.specs }}
            </span>
            <span v-else />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('developer.operation')"
          width="160"
        >
          <template #default="{ row }">
            <el-button
              size="mini"
              type="danger"
              @click.native="deletewmx(scope.$index)"
            >
              {{ $translateTitle('developer.delete') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click.native="wmxDataFill(row.scope.$index)"
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
    <vab-editor
      v-else-if="codeFlag"
      v-model="ace_editor"
      lang="erlang"
      style="height: 500px"
      theme="monokai"
    />
    <el-empty v-else :image-size="200" />
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
      productId: {
        deep: true,
        handler(val) {
          if (val.length == 10)
            this.viewForm = {
              class: 'ProductTemplet',
              type: 'amis',
              key: val,
              title: '',
              disabled: true,
              data: {},
              hiddenRow: ['class', 'key', 'createdAt'],
            }
          this.dictForm = {
            class: 'ProductTemplet',
            type: '',
            key: val,
            title: '',
            disabled: true,
            data: {},
            hiddenRow: ['class', 'key', 'createdAt'],
          }
          console.log('viewForm', this.viewForm)
          console.log('dictForm', this.dictForm)
        },
      },
    },
    mounted() {
      this.$baseEventBus.$off('lowcodeLen')
      this.$baseEventBus.$on('lowcodeLen', (length) => {
        this.lowcodeLen = length
      })
      this.$baseEventBus.$off('dictLen')
      this.$baseEventBus.$on('dictLen', (length) => {
        this.dictLen = length
      })
    },
    methods: {
      openView() {
        this.dialogTableVisible = true
        this.dialogDictVisible = false
        console.log('this.dialogTableVisible', this.dialogTableVisible)
        console.log('this.dialogDictVisible', this.dialogDictVisible)
      },
      openDict() {
        this.dialogDictVisible = true
        this.dialogTableVisible = false
      },
      async saveAmis(productId, amisconfig, productDetail) {
        const mergeAmis = _.merge(this.productDetail, {
          config: { amis: amisconfig },
        })
        console.log(productId, amisconfig, productDetail, mergeAmis)
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
        //     console.log(item)
        //     if (item.type == 'add') {
        //       console.log(item)
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
        console.log(index, row)
        this.set_amisJson(row.json)
        this.amisFlag = true
      },
      handleDelete(index, row) {
        console.log(index, row)
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
        console.log(ace, 'ace', this.ace_editor)
        const { decoder = {} } = productDetail
        this.codeFlag = !this.codeFlag
        this.ace_editor = Base64.decode(decoder.code)
        // editor.gotoLine(editor.session.getLength())
      },
      featProperties(params) {
        console.log(params)
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
