<template>
  <div
    ref="custom-table"
    class="devproduct devproduct-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      top="1vh"
      :title="formConfig.uid"
    >
      <vab-parser
        :dba-table="DbaTable"
        :productid="productid"
        :form-config="formConfig"
        :parserindex="editIndex"
        :dict="parserDict"
        @ParserSave="saveParse"
      />
      <!--      <span slot="footer" class="dialog-footer">-->
      <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--        <el-button type="primary" @click.native="dialogVisible = false">-->
      <!--          确 定-->
      <!--        </el-button>-->
      <!--      </span>-->
    </el-dialog>
    <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
    <el-dialog v-drag-dialog append-to-body :visible.sync="parserView">
      <f-render v-model="formConfig" :config="formConfig" pure />
    </el-dialog>

    <div class="prosecond">
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form
            label-width="100px"
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
            @submit.native.prevent
          >
            <el-form-item :label="$translateTitle('resource.category')">
              <div class="border-panel">
                <el-select
                  v-model="formInline.category"
                  size="mini"
                  clearable
                  placeholder="请选择"
                  @clear="clearCategory"
                >
                  <el-option
                    v-for="(item, index) in categoryList"
                    :key="index"
                    :label="item.name"
                    :value="item.objectId"
                    @click.native="categoryChange(item)"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item :label="$translateTitle('alert.product name')">
              <el-input
                v-model="queryForm.name"
                clearable
                size="mini"
                style="width: 90%"
                :placeholder="$translateTitle('product.searchproductname')"
              >
                <el-button
                  slot="append"
                  size="mini"
                  icon="el-icon-search"
                  style="padding: 0 !important; margin: 0 !important"
                  @click="queryProduttemp({})"
                />
              </el-input>
            </el-form-item>
          </el-form>

          <el-button
            type="primary"
            size="mini"
            @click="$refs['templet'].showEdit()"
          >
            {{ $translateTitle('product.Product template') }}
          </el-button>
          <el-button
            v-show="!$loadsh.isEmpty(productDetail)"
            size="mini"
            type="primary"
            @click="isFullscreen = !isFullscreen"
          >
            <vab-icon
              :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
            />
            {{
              isFullscreen
                ? $translateTitle('alert.Exit Full Screen')
                : $translateTitle('alert.full screen')
            }}
          </el-button>
        </vab-query-form-top-panel>
      </vab-query-form>
      <el-row :gutter="24">
        <el-col :xs="12" :sm="6" :md="5" :lg="4" :xl="3">
          <ul
            class="infinite-list"
            :style="{ height: tableHeight + 'px' }"
            style="overflow: auto"
          >
            <li
              v-for="(item, index) in categorysonList"
              :key="index"
              disabled
              class="infinite-list-item"
              @click.stop="categorysonChange(item, index)"
            >
              <el-link :type="linkType == index ? 'success' : ''">
                {{ item.name }}&nbsp;&nbsp;&nbsp;
              </el-link>
              <el-button
                type="primary"
                plain
                class="el-icon-plus"
                size="mini"
                @click.stop="addproducttemp(item)"
              />
            </li>
          </ul>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="4" :xl="3">
          <div class="protable">
            <el-table
              ref="multipleTable"
              v-loading="listLoading"
              highlight-current-row
              :height="tableHeight"
              size="medium"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              :data="proTableData"
              style="width: 100%"
              @row-click="StepsListRowClick"
            >
              <el-table-column
                sortable
                show-overflow-tooltip
                :label="$translateTitle('product.productname')"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="elpagination" style="margin-top: 20px">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              :page-size="length"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="productSizeChange"
              @current-change="productCurrentChange"
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="13" :lg="16" :xl="18">
          <profile-descriptions
            ref="ProfileDescription"
            :table-type="tableType"
            :product-id="productId"
            :things="things"
            :dict-table-list="dictTableList"
            :decoder-table-list="decoderTableList"
            :product-detail="productDetail"
            :parser-table-list="parserTableList"
            :table-loading="tableLoading"
          />
        </el-col>
      </el-row>
    </div>
    <profile-drawer
      ref="drawer"
      :parser-tables="parserTables"
      :parser-table="parserTable"
    />
    <profile-dict
      ref="dict"
      :data-list="dataList"
      :allunit="allunit"
      :tempparam="tempparams"
      :title-dict="title_dict_edit_dialog"
      :edit-flag="edit_dict_temp_dialog"
      :rules="dictrules"
      :title-temp-dialog="title_temp_dialog"
      :dict-visible="dictVisible"
      :parser-table="parserTable"
    />
    <product-templet ref="templet" @fetch-data="queryProduttemp({})" />
    <el-drawer
      append-to-body
      :title="moduleTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      size="50%"
      top="5vh"
    >
      <div class="devproduct-prodialog-content">
        <!--产品信息-->
        <div class="contentone">
          <el-form ref="form" label-width="150px" :model="form" :rules="rules">
            <el-form-item
              :label="$translateTitle('product.Producttemplatename')"
              prop="name"
            >
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>

            <el-form-item
              :label="$translateTitle('product.classification')"
              prop="netType"
            >
              <el-input v-model="form.netType" readonly />
            </el-form-item>
            <el-form-item :label="$translateTitle('menu.icon')" prop="icon">
              <div v-if="imageUrl">
                <img :src="imageUrl" class="avatar" />
                <el-button
                  type="danger"
                  size="mini"
                  style="vertical-align: text-bottom"
                  @click.stop="deleteImgsrc"
                >
                  删除
                </el-button>
              </div>
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
                @click="uploadCkick"
              />
              <form
                ref="uploadform"
                method="POST"
                enctype="multipart/form-data"
                style="position: absolute; visibility: hidden"
              >
                <input
                  type="file"
                  style="
                    position: relative;
                    z-index: 5;
                    width: 100px;
                    height: 100px;
                    cursor: pointer;
                    opacity: 0;
                  "
                  @change="upload($event)"
                />
              </form>
              <br />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('developer.describe')"
              prop="desc"
            >
              <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="devproduct-prodialog-footer">
        <el-button type="primary" @click.native="submitForm()">
          {{ $translateTitle('developer.determine') }}
        </el-button>
        <el-button @click="handleCloseDialogForm()">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import { queryCategory } from '@/api/Category'
  const context = require.context('./component/profile', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })
  import { mapGetters } from 'vuex'
  import { getProduct, putProduct } from '@/api/Product'
  import { getAllunit } from '@/api/Dict/index'
  import { export_txt_to_zip } from '@/utils/Export2Zip.js'
  import { getServer } from '@/api/Role/index'
  import { postDict } from '@/api/Dict'
  import { getHashClass } from '@/api/Hash'
  import { getTable } from '@/api/Dba'
  import {
    getProductTemplet,
    postProductTemplet,
    putProductTemplet,
    queryProductTemplet,
  } from '@/api/ProductTemplet'
  import { ImportParse } from '@/api/Export'
  import { uuid } from '@/utils'

  export default {
    components: { ...res_components },
    props: {},
    data() {
      return {
        tableHeight: this.$baseTableHeight(0),
        dataList: [{}],
        dictrules: {},
        isFullscreen: false,
        things: [],
        tableType: 'things',
        multipleTable: [],
        productDetail: {
          decoder: { code: '' },
          thing: { properties: [] },
          config: { parser: [], profile: [], basedate: { params: [] } },
        },
        linkType: 0,
        productOptions: [],
        DbaTable: [],
        parserView: false,
        parserTable: false,
        parserType: '',
        parserTables: [],
        parserTableList: [],
        dictTableList: [],
        decoderTableList: {},
        productConfig: {},
        parserFromId: '',
        dialogVisible: false,
        moduleTitle: this.$translateTitle('product.createproducttemplate'),
        allunit: [],
        productInfo: {},
        edit_dict_temp_dialog: false,
        title_dict_edit_dialog: '新增字典数据',
        tempparams: {
          name: '',
          identifier: '',
          type: '',
          order: 0,
          address: '',
          bytes: '',
          default: 0,
          required: false,
          readonly: true,
          specs: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          struct: {},
          unit: '',
        },
        elactiveName: 'Table',
        elactiveName1: 'Table1',
        editDictTempId: '',
        title_temp_dialog: '',
        dictTempForm: {},
        rule: [],
        dictVisible: false,
        listLoading: false,
        tableLoading: false,
        custom_row: {},
        custom_status: 'add',
        hashkey: '',
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        length: 10,
        total: 0,
        start: 0,
        activeName: 'first',
        formInline: {
          productname: '',
          category: '',
        },
        uploadHeaders: {
          sessionToken: Cookies.get('access_token'),
        },
        uploadAction: '',
        uploadData: {},
        fileList: [],
        productId: '',
        productIdentifier: '',
        proTableData: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        importDialogShow: false,
        form: {
          name: '',
          decoder: {},
          thing: {},
          config: {},
          nodeType: 0,
          netType: '',
          icon: '',
        },
        formPro: {
          name: '',
          url: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入产品',
              trigger: 'blur',
            },
          ],
        },
        option: [],
        ruleoptions: [],
        channel: [
          {
            label: '蜂窝(2G/3G/4G)(直连)',
            value: 'CELLULAR',
          },
          {
            label: 'NB-IOT通道',
            value: 'NB-IOT',
          },
          {
            label: 'BLE(低功耗蓝牙)',
            value: 'Bluetooth',
          },
          {
            label: '5G通道(直连)',
            value: '5G',
          },
          {
            label: 'WIFI通道(直连)',
            value: 'WIFI',
          },
          {
            label: 'ZigBee通道',
            value: 'ZigBee',
          },
          {
            label: 'Modbus',
            value: 'Modbus',
          },
          {
            label: 'LoRa(WAN)(直连)',
            value: 'LoRaWAN',
          },
          {
            label: 'OPC UA',
            value: ' OPC UA',
          },
          {
            label: 'ZETA通道',
            value: 'ZETA',
          },
          {
            label: '网线连接(直连)',
            value: '网线连接',
          },
          {
            label: '自定义',
            value: 'OTHER',
          },
        ],
        imageUrl: '',
        productid: '',
        parserDict: [],
        formConfig: {},
        editIndex: 0,
        Parserzh: '',
        parseren: '',
        loading: false,
        allApps: [],
        categoryList: [],
        categorysonList: [],
        queryForm: {
          name: '',
        },
        categoryListOptions: [],
        fileServer: '',
        access_token: '',
        projectid: '',
        allTableDate: [],
        showTree: false,
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
        roleTree: 'user/roleTree',
      }),
    },
    watch: {
      productDetail: {
        handler(productDetail) {
          this.$nextTick(function () {
            productDetail?.thing?.properties
              ? this.properties(productDetail.thing.properties)
              : ''
          })
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {
      // alert('father')
      const { project = '' } = this.$route.query
      this.formInline.productname = project
      this.categorylist()
      this.featchTable()
      this.queryProduttemp({})
    },
    methods: {
      async doUpload(event) {
        const parseFile = event.target.files[0]
        const loading = this.$baseColorfullLoading(3)
        try {
          const res = await ImportParse('Product', parseFile)
          loading.close()
          console.log('eresresrror', res)
          this.$message.success(``)
        } catch (error) {
          loading.close()
          console.log('error', error)
          this.$message.error(`${error}`)
        }
        this.$baseEventBus.$emit('reload-router-view')
      },
      async categorylist() {
        const parsms = {
          order: 'createdAt',
          keys: 'count(*)',
          where: { level: { $in: [0, 1] } },
        }
        const { results } = await queryCategory(parsms)
        this.categoryList = results
        this.categoryChange({ name: '所有领域' })
        console.log('this', this.categoryList)
      },
      async StepsListRowClick(params) {
        var productDetail = {}
        var isLoading = true
        try {
          const loading = true
            ? (isLoading = false)
            : this.$baseColorfullLoading()
          const res = await getProductTemplet(params.objectId)
          productDetail = _.merge(res, {
            decoder: { code: '' },
            thing: { properties: [] },
            config: { parser: [], profile: [], basedate: { params: [] } },
          })
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          if (isLoading) loading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
        // console.clear()
        console.log('productDetail', productDetail)
        this.productId = params.objectId
        this.productDetail = productDetail
        this.$refs.ProfileDescription.productDetail = productDetail
      },
      clearCategory() {
        this.linkType = -1
        this.queryProduttemp({})
      },
      categoryChange(data) {
        const loading = this.$baseColorfullLoading()
        let params = {
          order: 'createdAt',
          where: {},
        }
        if (data.name == '所有领域') {
          params.where = { level: { $gte: 1 } }
          queryCategory(params).then((res) => {
            this.categorysonList = res.results
          })
        } else {
          params.where = {
            parent: {
              className: 'Category',
              objectId: data.objectId,
              __type: 'Pointer',
            },
          }
          queryCategory(params).then((res) => {
            this.categorysonList = res.results
            this.categorysonList.push(data)
          })
        }
        loading.close()
      },
      categorysonChange(data, index) {
        this.linkType = index
        this.queryProduttemp({ category: data.objectId })
      },
      addproducttemp(data) {
        this.form.netType = data.name
        this.form.category = data.objectId
        this.dialogFormVisible = true
      },
      async queryProduttemp(args) {
        const loading = this.$baseColorfullLoading()
        let params = {
          order: '-createdAt',
          keys: 'count(*)',
          where: {
            category: args.category ? args.category : { $ne: null },
            name: this.queryForm.name
              ? { $regex: this.queryForm.name, $options: 'i' }
              : { $ne: null },
          },
        }
        try {
          const { results = [], count = 0 } = await queryProductTemplet(params)
          loading.close()
          this.proTableData = results
          this.total = count
        } catch (error) {
          loading.close()
          console.log(error)
          this.$message.error(`${error}`)
        }
      },
      properties(things, type = 'things') {
        this.tableLoading = true
        console.log(things)
        this.things = things
        this.tableType = type
        setTimeout(() => (this.tableLoading = false), 1200)
      },
      previewParse(row) {
        this.parserView = true
        this.formConfig = row
        console.log('previewParse', row)
      },
      addParse(row) {
        row.push({
          name: this.parserType + 'name',
          enname: this.parserType + 'English Name',
          uid: uuid(6),
          config: {},
          type: this.parserType,
          identifier: 'identifier',
          visible: true,
          table: 'Device',
          class: 'profile',
          description: this.parserType + 'description',
        })
        this.saveParse(row, -1, false)
      },
      editParse(index, row) {
        console.log(row)
        this.formConfig = row
        this.editIndex = index
        this.parserTable = false
        // const el = document.getElementsByClassName('parserTable')[0]
        // el.style.display = 'none'
        this.$nextTick(() => {
          this.dialogVisible = true
        })
      },
      deleteParse(uid, index, rows) {
        console.log('uid', uid)
        rows.forEach((e, i) => {
          if (e.uid == uid) {
            rows.splice(i, 1)
          }
          console.log('rows', rows)
        })
        // rows.splice(index, 1)
        this.saveParse(rows, -1, false)
      },
      editorParser(config, type, flag) {
        const { objectId, thing = {} } = this.productDetail
        console.log('flag', flag)
        // this.tableLoading = true
        // setTimeout(() => (this.tableLoading = false), 800)
        var _sourceDict = []
        var _sourceModule = []
        var _sourceField = []
        this.productid = objectId
        this.parserFromId = objectId
        this.editDictTempId = objectId
        this.parserType = type
        this.tableType = type
        this.productConfig = config
        var isArr = ['parser', 'profile', 'basedate.params']
        if (isArr.includes(type)) {
          console.log('type', type)
          this.parserTable = flag
          this.parserTables = this.productDetail.config[`${this.tableType}`]
          this.parserTableList = this.productDetail.config[`${this.tableType}`]
          this.dictTableList = this.productConfig.config.basedate.params || []
        }
        if (type == 'basedate.params') {
          this.parserTable = false
          this.editorDict(config)
          this.dictVisible = flag ? true : false
        }
        console.log(
          'this.parserTableList',
          this.parserTableList,
          this.parserTables,
          this.tableType
        )
        if (this.productDetail?.basedate?.params?.length) {
          this.productDetail.basedate.params.forEach((_dict) => {
            _sourceDict.push({
              field: _dict.identifier,
              label: _dict.name,
              default: _dict.default,
            })
          })
        }
        if (thing?.properties?.length) {
          thing.properties.forEach((_thing) => {
            _sourceModule.push({
              field: _thing.identifier,
              label: _thing.name,
              default: _thing.default || '',
            })
          })
        }
        localStorage.setItem('_sourceDict', JSON.stringify(_sourceDict))
        localStorage.setItem('_sourceModule', _sourceModule)
        localStorage.setItem('_sourceField', _sourceField)
        this.decoderTableList = {}
        console.log(' this.tableType ', this.tableType)
      },
      async saveParse(list, type = -1, mark = true) {
        console.log('this.productConfig', this.productConfig)
        const parserType = this.productConfig[`${this.parserType}`]
        if (type + 1 > 0) {
          parserType[type] = _.merge({}, list)
        } else {
          this.productConfig[`${this.parserType}`] = list
        }
        console.log('this.productConfig', this.productConfig, parserType)
        try {
          const res = await putProduct(this.parserFromId, {
            config: this.productConfig.config,
          })
          this.$message.success(
            this.$translateTitle('user.Save the template successfully')
          )
          this.dialogVisible = false
          if (mark) {
            this.parserTable = false
            this.queryProduttemp({})
          }
        } catch (e) {
          this.$message.error(
            this.$translateTitle('user.Save the template error') + `${e}`
          )
          console.log(e, 'eeee')
        }
        console.log(list)
      },
      async featchTable() {
        try {
          const { results: table = [] } = await getTable()
          this.DbaTable = table
        } catch (error) {
          console.log(error)
          this.$message.error(`${error}`)
        }
        console.log(this.DbaTable)
      },
      uploadCkick() {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      fileInfo(info) {
        console.log('info', info)
        this.imageUrl = info.url
        this.loading = false
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 200)
        this.allunit = results.concat([])
      },
      onJsonSave(formName, dictTempForm) {
        console.log('this.$refs', this.$refs.dict)
        // 点击保存触发
        // console.log("onJsonSave", this.dictTempForm.params);
        this.$refs.dict.$refs[formName].validate((valid) => {
          console.log(this.editDictTempId)
          if (valid) this.put_Dict_temp(this.editDictTempId, dictTempForm)
        })
      },
      async put_Dict_temp(editDictId, row) {
        console.log(row)
        const {
          config = {
            basedate: {},
          },
        } = this.productInfo
        config.basedate = row
        const params = {
          config: config,
        }
        const { updatedAt } = await putProduct(editDictId, params)
        if (updatedAt != undefined) {
          this.dictVisible = false
          this.$message('字典数据更新成功')
        } else {
          this.$message('字典数据更新失败')
        }
      },
      changeNode(val, first) {
        if (first != 0) {
          this.form.netType = ''
        }

        if (val == 0) {
          this.channel = [
            {
              label: '蜂窝(2G/3G/4G)',
              value: 'CELLULAR',
            },
            {
              label: 'NB-IOT通道',
              value: 'NB-IOT',
            },
            {
              label: 'BLE(低功耗蓝牙)',
              value: 'Bluetooth',
            },
            {
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'ZigBee通道',
              value: 'ZigBee',
            },
            {
              label: 'LoRa(WAN)',
              value: 'LoRaWAN',
            },
            {
              label: 'Modbus',
              value: 'Modbus',
            },
            {
              label: 'OPC UA',
              value: ' OPC UA',
            },
            {
              label: 'ZETA通道',
              value: 'ZETA',
            },
            {
              label: '网线连接',
              value: '网线连接',
            },

            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        } else {
          this.channel = [
            {
              label: '蜂窝(2G/3G/4G)',
              value: 'CELLULAR',
            },
            {
              label: '5G通道',
              value: '5G',
            },
            {
              label: 'WIFI通道',
              value: 'WIFI',
            },
            {
              label: 'NB-IOT通道',
              value: 'NB-IOT',
            },
            {
              label: 'LoRaWAN',
              value: 'LoRaWAN',
            },
            {
              label: '网线连接',
              value: '网线连接',
            },
            {
              label: '自定义',
              value: 'OTHER',
            },
          ]
        }
      },
      selectApp(val) {
        if (!val) {
          return
        }
        getServer(val).then((resultes) => {
          if (resultes) {
            this.fileServer = resultes.file
            this.access_token = resultes.access_token
          }
        })
      },
      deleteImgsrc() {
        // event.stopPropagation()
        this.imageUrl = ''
      },
      handleClose() {
        this.dialogFormVisible = false
      },
      // 关闭dialog 事件
      handleCloseDialogForm() {
        this.dialogFormVisible = false
        // 重置表单
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      },
      submitForm() {
        const setAcl = {}
        setAcl['*'] = {
          read: true,
          write: true,
        }
        var params = {
          name: this.form.name,
          category: this.form.category,
          netType: this.form.netType,
          icon: this.imageUrl,
          desc: this.form.desc,
          ACL: setAcl,
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.custom_status === 'add') {
              console.log('params', params)
              postProductTemplet(params).then((res) => {
                if (res.objectId) {
                  this.$message({
                    type: 'success',
                    message: '产品模板创建成功',
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '产品模板创建失败',
                  })
                }
                this.dialogFormVisible = false
              })
            } else {
              putProductTemplet('objectId', params).then((res) => {
                if (res.objectId) {
                  this.$message({
                    type: 'success',
                    message: '产品模板修改成功',
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: '产品模板修改失败',
                  })
                }
                this.dialogFormVisible = false
              })
            }
          } else {
            this.$message('必填项未填')
          }
        })
      },
      productSizeChange(val) {
        this.length = val
        this.queryProduttemp({})
      },
      productCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.queryProduttemp({})
      },
      async blackDict(hashkey, data) {
        const params = {
          data: data,
          key: hashkey,
          type: 'Product',
        }
        const res = await postDict(params)
        if (res) {
          this.$message({
            type: 'success',
            message: '备份成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: `备份失败`,
          })
        }
      },
      async CloneData(row) {
        const data = {
          category: row.attributes.category,
          devType: row.attributes.devType,
          name: row.attributes.name,
          thing: row.attributes.thing,
        }
        const { objectId, code } = await getHashClass('Product', data)
        if (code == 200) {
          this.blackDict(objectId, data)
        }
      },
      // 克隆组态
      proudctClone(row) {
        row.attributes.config.cloneState = true
        row.attributes.config.cloneState = true
        const config = row
        const res = putProduct(row.id, config)
        if (res) {
          this.CloneData(row)
        }
      },
      // 编辑组态
      proudctEdit(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        // 为了兼容性,暂时传两个相同的值
        var url = `${topoUrl}/#?drawProudctid=${row.objectId}&proudctid=${row.objectId}`
        localStorage.setItem('rowId', row.objectId)
        window.open(url, '__blank')
      },
      proudctView(row) {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        // 为了兼容性,暂时传两个相同的值
        var url = `${topoUrl}/#/views/${row.objectId}`
        window.open(url, '__blank')
      },
      // 跳转到组态大屏
      goTopoview() {
        var topoUrl = window.location.origin + '/spa'
        const { NODE_ENV } = process.env
        if (NODE_ENV == 'development') {
          topoUrl = this.$globalConfig.localTopoUrl
        } else {
          topoUrl = window.location.origin + '/spa'
        }
        var url = `${topoUrl}/#/view`
        window.open(url, '__blank')
      },
      lockingParse(uid, index, rows) {
        const { disable = false } = rows[`${index}`]
        rows[`${index}`].disable = !disable
        this.saveParse(rows, -1, false)
      },
      // 导出
      exportpro() {
        if (this.allTableDate) {
          export_txt_to_zip(JSON.stringify(this.allTableDate), 'Dict', 'Dict')
        } else {
          this.$message({
            type: 'warning',
            message: '数据为空,无法导出',
          })
        }
      },
    },
  }
</script>
<style scoped lang="scss">
  .devproduct {
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
      color: #f19944;
      background-color: #fdf3ea;
    }
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    .infinite-list {
      padding: 0;
      margin: 0;
      list-style: none;
      .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        margin: 10px;
        color: #7dbcfc;
        cursor: pointer;
        background: #e8f3fe;
      }
    }
  }

  .devproduct ::v-deep .el-dialog__wrapper .el-dialog__header,
    //.devproduct ::v-deep .el-dialog__wrapper .el-dialog__close {
    //  display: none;
    //}
  .devproduct .parserTable {
    display: block;
    text-align: center;
  }
  .devproduct ::v-deep .el-dialog {
    margin: 0 auto;
  }
  .devproduct .el-tabs__header {
    margin: 0;
  }

  .devproduct .el-tabs__item {
    height: 50px;
    margin: 0;
    margin-top: 20px;
    font-family: auto;
    font-size: 16px;
    line-height: 50px;
  }

  .devproduct .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .devproduct .el-tab-pane {
    background: #ffffff;
  }

  .devproduct .procontent,
  .devproduct .prosecond {
    box-sizing: border-box;
    width: 100%;
  }

  .devproduct .el-dialog {
    margin-top: 5vh;
  }

  .devproduct .el-dialog .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }

  .devproduct .el-dialog .el-cascader,
  .devproduct .el-dialog .el-select {
    width: 100%;
  }

  .devproduct .el-dialog .el-form {
    box-sizing: border-box;
    padding: 0 10px;
  }

  .devproduct .el-dialog .el-form .el-form-item {
    margin-bottom: 5px;
  }

  .devproduct .el-dialog .el-form .el-form-item__content {
    margin-left: 10px;
    clear: both;
  }

  .devproduct .avatar-uploader {
    display: inline-block;
  }

  .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    width: 150px;
    height: 150px;
    font-size: 28px;
    line-height: 150px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }

  .avatar {
    display: block;
    width: 150px;
    height: 150px;
  }

  /* .devproduct .el-icon-close{
    position:absolute;
    right:0;
  } */
</style>
