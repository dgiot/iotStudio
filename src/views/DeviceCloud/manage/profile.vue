<template>
  <div
    ref="custom-table"
    class="devproduct devproduct-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <!--选择告警类别下拉框-->
    <el-dialog
      :append-to-body="true"
      center
      title="选择告警类型"
      :visible.sync="Notification.show"
      width="30%"
    >
      <span>
        <el-radio v-model="Notification.detail.radio" label="start">
          告警产生
        </el-radio>
        <el-radio v-model="Notification.detail.radio" label="stop">
          告警恢复
        </el-radio>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Notification.show = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="createdNotification(Notification.detail)"
        >
          创 建
        </el-button>
      </span>
    </el-dialog>

    <!--添加物模型弹窗-->
    <el-dialog
      :append-to-body="true"
      :before-close="wmxhandleClose"
      :close-on-click-modal="false"
      :title="wmxSituation + '自定义属性'"
      top="5vh"
      :visible.sync="wmxdialogVisible"
      width="60%"
    >
      <dgiot-wmx
        ref="sizeForm"
        :size-form1="sizeForm"
        @addDas="addDas"
        @addDomain="addDomain"
        @removeDas="removeDas"
        @removeDomain="removeDomain"
        @submitForm="submitFormwmx"
        @wmxhandleClose="wmxhandleClose"
      />
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('product.viewobjectmodel')"
      :visible.sync="schemadialogVisible"
    >
      <div>
        <div style="background: #ffffff">
          <label id="plug-name" />
        </div>
        <pre id="editor1" class="ace_editor" style="min-height: 400px"><textarea
          class='ace_text-input'
          style='overflow:scroll'
        /></pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height: 30px">
        <el-button type="primary" @click="preserve">
          <!-- 更新 -->
          {{ $translateTitle('equipment.update') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :title="formConfig.uid"
      :visible.sync="amisVisible"
      width="75%"
    >
      <dgiot-views :view-form="viewForm" />
    </el-dialog>
    <el-dialog v-drag-dialog append-to-body :visible.sync="parserView">
      <f-render v-model="formConfig" :config="formConfig" pure />
    </el-dialog>

    <div class="prosecond">
      <dgiot-query-form>
        <dgiot-query-form-top-panel>
          <el-form
            class="demo-form-inline"
            :inline="true"
            label-width="100px"
            :model="formInline"
            @submit.native.prevent
          >
            <el-form-item :label="$translateTitle('resource.category')">
              <div class="border-panel">
                <el-select
                  v-model="formInline.category"
                  clearable
                  placeholder="请选择"
                  size="mini"
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
                :placeholder="$translateTitle('product.searchproductname')"
                size="mini"
                style="width: 90%"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  size="mini"
                  style="padding: 0 !important; margin: 0 !important"
                  @click="queryProduttemp({})"
                />
              </el-input>
            </el-form-item>
          </el-form>

          <el-button
            v-show="!$lodash.isEmpty(productDetail)"
            size="mini"
            type="primary"
            @click="isFullscreen = !isFullscreen"
          >
            <dgiot-icon
              :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
            />
            {{
              isFullscreen
                ? $translateTitle('alert.Exit Full Screen')
                : $translateTitle('alert.full screen')
            }}
          </el-button>
        </dgiot-query-form-top-panel>
      </dgiot-query-form>
      <el-row :gutter="24">
        <el-col :lg="4" :md="5" :sm="6" :xl="3" :xs="4">
          <ul
            class="infinite-list"
            style="overflow: auto"
            :style="{ height: tableHeight + 'px' }"
          >
            <li
              v-for="(item, index) in categorysonList"
              :key="index"
              class="infinite-list-item"
              disabled
              @click.stop="categorysonChange(item)"
            >
              <el-link :type="linkType == item.name ? 'success' : ''">
                {{ item.name }}&nbsp;&nbsp;&nbsp;
              </el-link>
              <el-button
                class="el-icon-plus"
                plain
                size="mini"
                type="text"
                @click.stop="addproducttemp(item)"
              />
            </li>
          </ul>
        </el-col>
        <el-col :lg="5" :md="6" :sm="6" :xl="3" :xs="4">
          <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :cell-style="{ 'text-align': 'center' }"
            :data="proTableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :height="tableHeight"
            highlight-current-row
            size="medium"
            style="width: 100%"
            @row-click="StepsListRowClick"
          >
            <el-table-column
              :label="$translateTitle('product.productname')"
              prop="name"
              show-overflow-tooltip
              sortable
              width="auto"
            />
            <el-table-column
              fixed="right"
              :label="$translateTitle('developer.operation')"
              width="auto"
            >
              <template #default="{ row }">
                <el-button
                  class="el-icon-edit"
                  :title="$translateTitle('developer.delete')"
                  type="text"
                  @click.stop="editproducttemp(row)"
                />
                <el-button
                  class="el-icon-delete"
                  style="color: red"
                  :title="$translateTitle('developer.delete')"
                  type="text"
                  @click.stop="deleteproducttemp(row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="elpagination" style="margin-top: 20px">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-size="length"
              :page-sizes="[10, 20, 30, 50]"
              :total="total"
              @current-change="productCurrentChange"
              @size-change="productSizeChange"
            />
          </div> -->
        </el-col>
        <el-col :lg="15" :md="13" :sm="12" :xl="18" :xs="16">
          <profile-descriptions
            ref="ProfileDescription"
            :decoder-table-list="decoderTableList"
            :dict-table-list="dictTableList"
            :parser-table-list="parserTableList"
            :product-detail="productDetail"
            :product-id="producttempId"
            :table-loading="tableLoading"
            :table-type="tableType"
            :thing-key="thingKey"
            :things="things"
          />
        </el-col>
      </el-row>
    </div>
    <profile-drawer
      ref="drawer"
      :parser-table="parserTable"
      :parser-tables="parserTables"
    />
    <profile-dict
      ref="dict"
      :allunit="allunit"
      :data-list="dataList"
      :dict-visible="dictVisible"
      :edit-flag="edit_dict_temp_dialog"
      :parser-table="parserTable"
      :rules="dictrules"
      :tempparam="tempparams"
      :title-dict="title_dict_edit_dialog"
      :title-temp-dialog="title_temp_dialog"
    />
    <product-templet ref="templet" @fetch-data="queryProduttemp({})" />
    <el-drawer
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal="false"
      size="50%"
      :title="moduleTitle"
      top="5vh"
      :visible.sync="dialogFormVisible"
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
            <el-form-item :label="$translateTitle('product.classification')">
              <el-input
                v-model="form.categoryname"
                :disabled="addflag"
                :placeholder="$translateTitle('product.pleaseselectyourcate')"
                @focus="showTree = !showTree"
              />
              <div v-if="showTree">
                <el-tree
                  :data="categorytree"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                />
              </div>
            </el-form-item>
            <el-form-item :label="$translateTitle('menu.icon')" prop="icon">
              <div v-if="imageUrl">
                <img class="avatar" :src="$FileServe + imageUrl" />
                <el-button
                  size="mini"
                  style="vertical-align: text-bottom"
                  type="danger"
                  @click.stop="deleteImgsrc"
                >
                  删除
                </el-button>
              </div>
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
                @click="uploadCkick('producttemp_ico')"
              />
              <form
                ref="uploadform"
                enctype="multipart/form-data"
                method="POST"
                style="position: absolute; visibility: hidden"
              >
                <input
                  style="
                    position: relative;
                    z-index: 5;
                    width: 100px;
                    height: 100px;
                    cursor: pointer;
                    opacity: 0;
                  "
                  type="file"
                  @change="upload($event)"
                />
              </form>
              <br />
            </el-form-item>
            <dgiot-input
              ref="uploadFinish"
              :params="inputParams"
              @fileInfo="fileInfo"
              @files="files"
            />
            <el-form-item
              :label="$translateTitle('developer.describe')"
              prop="desc"
            >
              <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="devproduct-prodialog-footer" style="text-align: center">
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
<!--eslint-disable-->
<script>
  import { queryCategory } from '@/api/Category'
  import { mapGetters, mapMutations } from 'vuex'
  import { putProduct } from '@/api/Product'
  import { getAllunit } from '@/api/Dict/index'
  import { export_txt_to_zip } from '@/utils/file/export2zip.js'
  import { getServer } from '@/api/Role/index'
  import { postDict } from '@/api/Dict'
  import { getHashClass } from '@/api/Hash'
  import { getTable } from '@/api/Dba'
  import {
    delProductTemplet,
    getProductTemplet,
    postProductTemplet,
    putProductTemplet,
    queryProductTemplet,
  } from '@/api/ProductTemplet'
  import { ImportParse } from '@/api/Export'
  import { uuid } from '@/utils'
  import wmxdetail from './component/wmxdetail'
  import { setTimeout } from 'timers'
  import { post_tree } from '@/api/Logs'
  import dgiotViews from '@/views/CloudFunction/lowcode'

  const context = require.context('./component/profile', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })

  var editor1
  export default {
    components: {
      dgiotViews,
      ...res_components,
      'dgiot-wmx': wmxdetail,
    },
    props: {},
    data() {
      return {
        Notification: {
          show: false,
          detail: {},
        },
        amisVisible: false,
        viewForm: {},
        tableHeight: this.$baseTableHeight(0),
        dataList: [{}],
        dictrules: {},
        isFullscreen: false,
        things: [],
        tableType: 'things',
        multipleTable: [],
        thingKey: moment(new Date()).valueOf().toString(),
        productDetail: {
          decoder: { code: '' },
          thing: { properties: [] },
          config: {
            parser: [],
            profile: [],
            basedate: { params: [] },
          },
        },
        linkType: '',
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
        producttempId: '',
        productIdentifier: '',
        proTableData: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        importDialogShow: false,
        categorytree: [],
        inputParams: {},
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
        parserDict: [],
        formConfig: {},
        editIndex: 0,
        Parserzh: '',
        parseren: '',
        loading: false,
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
        addflag: true,
        //物模型
        wmxdialogVisible: false,
        schemadialogVisible: false,
        wmxSituation: '新增',
        modifyIndex: -1,
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
        roleTree: 'user/roleTree',
        sizeForm: 'konva/sizeForm',
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
      this.$baseEventBus.$off('showNotificationSettings')
      this.$baseEventBus.$on('showNotificationSettings', (rows) => {
        console.debug(rows)
        //  显示告警类型下拉框
        this.Notification = { show: true, detail: rows }
      })
      this.$baseEventBus.$off('profileDialog')
      this.$baseEventBus.$on(
        'profileDialog',
        ({ config, type, flag, productInfo, parserType }) => {
          console.log(config, type, flag, productInfo, parserType)
          this.productDetail = productInfo
          this.productInfo = productInfo
          this.parserType = type
          this.productConfig = _.merge({ basedate: { params: {} } }, config)
          this.editorParser(config, type, flag)
        }
      )
      this.$baseEventBus.$off('profileAmisDialog')
      this.$baseEventBus.$on('profileAmisDialog', ({ config, productInfo }) => {
        this.amisVisible = true
        this.viewForm = {
          showRow: true,
          class: 'Product',
          type: 'notification',
          key: this.$route.query.id,
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
      })
      const { project = '' } = this.$route.query
      this.formInline.productname = project
      this.querycategorylist()
      this.featchTable()
      this.queryProduttemp({})
    },
    methods: {
      async createdNotification(row) {
        await console.log(row)
        await this.$router.push({
          path: '/rules_engine/addengine',
          query: {
            productid: this.$route.query.id,
            uid: row.objectId,
            title: '编辑',
            type:
              'Notification_' +
              this.Notification.detail.radio +
              '_' +
              this.$route.query.id,
          },
        })
      },
      async doUpload(event) {
        const parseFile = event.target.files[0]
        const loading = this.$baseColorfullLoading(3)
        try {
          const res = await ImportParse('Product', parseFile)
          loading.close()
          dgiotlog.log('eresresrror', res)
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$translateTitle(
              'user.Save the template successfully'
            ),
            type: 'success',
          })
        } catch (error) {
          loading.close()
          dgiotlog.log('error', error)
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
        this.$dgiotBus.$emit('reload-router-view')
      },
      async querycategorylist() {
        const parsms = {
          order: 'createdAt',
          keys: 'count(*)',
          where: { level: { $in: [0, 1] } },
        }
        const { results } = await queryCategory(parsms)
        this.categoryList = results
        if (results && this.$route.fullPath == '/dashboard/profile') {
          this.$nextTick(() => {
            this.categoryChange({ name: '所有领域' })
          })
        }
      },
      async StepsListRowClick(params) {
        this.$dgiotBus.$off('monaco-save')
        var productDetail = {}
        var isLoading = true
        try {
          // eslint-disable-next-line no-constant-condition
          const loading = true
            ? (isLoading = false)
            : this.$baseColorfullLoading()
          const res = await getProductTemplet(params.objectId)
          productDetail = _.merge(res, {
            decoder: { code: '' },
            thing: { properties: [] },
            config: {
              parser: [],
              profile: [],
              basedate: { params: [] },
            },
          })
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'dgiot-hey-message-success'
          )
          if (isLoading) loading.close()
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
        // console.clear()
        dgiotlog.log('productDetail', productDetail)
        this.producttempId = params.objectId
        this.productDetail = productDetail
        this.$refs.ProfileDescription.productDetail = productDetail
      },
      clearCategory() {
        this.linkType = ''
        this.queryProduttemp({})
      },
      categoryChange(data) {
        this.linkType = data.name
        const loading = this.$baseColorfullLoading()
        this.categorysonList = []
        let params = {
          order: 'createdAt',
          include: 'parent',
          where: {},
        }
        if (data.name == '所有领域') {
          params.where = { level: { $gte: 1 } }
          queryCategory(params).then((res) => {
            this.categorysonList = res.results
          })
          this.queryProduttemp({})
        } else {
          params.where = {
            parent: data.objectId,
          }
          queryCategory(params).then((res) => {
            // this.categorysonList.push(data)
            this.categorysonList = [data].concat(res.results)
            var categorys = []
            this.categorysonList.forEach((son) => {
              categorys.push(son.objectId)
            })
            this.queryProduttemp({ categorys: { $in: categorys } })
          })
        }
        loading.close()
      },
      categorysonChange(data) {
        this.linkType = data.name
        this.queryProduttemp({ category: data.objectId })
      },
      addproducttemp(data) {
        this.fetchData()
        this.addflag = true
        this.form = {
          name: '',
          decoder: {},
          thing: {},
          config: {},
          nodeType: 0,
          netType: '',
          categoryname: data.name,
          categoryid: data.objectId,
        }
        this.dialogFormVisible = true
        this.producttempId = moment(new Date()).valueOf().toString()
      },
      editproducttemp(row) {
        dgiotlog.log('row', row)
        this.fetchData()
        this.addflag = false
        this.form = row
        this.producttempId = row.objectId
        this.$set(
          this.form,
          'categoryname',
          row.category ? row.category.name : ''
        )
        this.$set(
          this.form,
          'categoryid',
          row.category ? row.category.objectId : ''
        )
        this.dialogFormVisible = true
      },
      deleteproducttemp(row) {
        delProductTemplet(row.objectId).then((res) => {
          if (res) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '产品模板删除成功',
            })
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'error',
              message: '产品模板删除失败',
            })
          }
          this.queryProduttemp({ category: row.category.objectId })
        })
      },
      handleNodeClick(data) {
        this.$set(this.form, 'categoryid', data.objectId)
        this.$set(this.form, 'categoryname', data.name)
        this.showTree = !this.showTree
      },
      async fetchData() {
        let name = this.queryForm.name.length
          ? '{ "$regex": "' + this.queryForm.name + '"}'
          : '{ "$ne": "null" }'
        let params = {
          class: 'Category',
          filter:
            '{"order": "createdAt","keys":["parent","name","level"],"where":{"level": {"$gte": 1}, "name":' +
            name +
            '}}',
          parent: 'parent',
        }
        const { results = [] } = await post_tree(params)
        this.categorytree = results
      },
      async queryProduttemp(args) {
        // const loading = this.$baseColorfullLoading()
        let params = {
          order: '-createdAt',
          keys: 'count(*)',
          include: 'category,name',
          where: {},
        }
        this.queryForm.name
          ? (params.where.name = {
              $regex: this.queryForm.name,
            })
          : ''
        args.category ? (params.where.category = args.category) : ''
        args.categorys ? (params.where.category = args.categorys) : ''
        try {
          const { results = [], count = 0 } = await queryProductTemplet(params)
          // loading.close()
          this.proTableData = results
          this.total = count
        } catch (error) {
          // loading.close()
          dgiotlog.log(error)
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
      },
      properties(things, type = 'things') {
        this.tableLoading = true
        this.things = things
        this.tableType = type
        setTimeout(() => (this.tableLoading = false), 1200)
      },
      previewParse(row) {
        this.parserView = true
        this.formConfig = row
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
        dgiotlog.log(row)
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
        dgiotlog.log('uid', uid)
        rows.forEach((e, i) => {
          if (e.uid == uid) {
            rows.splice(i, 1)
          }
          dgiotlog.log('rows', rows)
        })
        // rows.splice(index, 1)
        this.saveParse(rows, -1, false)
      },
      editorParser(config, type, flag) {
        console.log('config', config, config, type, flag)
        const { objectId, thing = {} } = this.productDetail
        var _sourceDict = []
        var _sourceModule = []
        var _sourceField = []
        this.producttempId = objectId
        this.parserFromId = objectId
        this.editDictTempId = objectId
        this.parserType = type
        this.tableType = type
        this.productConfig = _.merge({ basedate: { params: {} } }, config)
        dgiotlog.log(
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
        dgiotlog.log('this.tableType ', this.tableType)
      },
      async saveParse(list, type = -1, mark = true) {
        const parserType = this.productConfig.config[`${this.parserType}`]
        if (type + 1 > 0) {
          parserType[type] = _.merge({}, list)
        } else {
          this.productConfig.config[`${this.parserType}`] = list
        }
        try {
          const res = await putProduct(this.parserFromId, {
            config: this.productConfig.config,
          })
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$translateTitle(
              'user.Save the template successfully'
            ),
            type: 'success',
          })
          this.dialogVisible = false
          if (mark) {
            this.parserTable = false
            this.queryProduttemp({})
          }
        } catch (e) {
          this.$baseMessage(
            this.$translateTitle('user.Save the template error') + `${e}`,
            'error',
            'dgiot-hey-message-error'
          )
          dgiotlog.log(e, 'eeee')
        }
        dgiotlog.log(list)
      },
      async featchTable() {
        this.setTreeFlag(false)
        try {
          const { results: table = [] } = await getTable()
          this.DbaTable = table
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
        // dgiotlog.log(this.DbaTable)
      },
      uploadCkick(type) {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'producttemp/ico/',
          filename: `${this.producttempId}.${type}`,
        }
      },
      fileInfo(info) {
        dgiotlog.log('info', info)
        this.imageUrl = info.path
        this.loading = false
      },
      files(file, type) {
        this.inputParams.filename = `${this.producttempId}.${type}`
        this.inputParams.file = file
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 200)
        this.allunit = results.concat([])
      },
      onJsonSave(formName, dictTempForm) {
        dgiotlog.log('this.$refs', this.$refs.dict)
        // 点击保存触发
        // dgiotlog.log("onJsonSave", this.dictTempForm.params);
        this.$refs.dict.$refs[formName].validate((valid) => {
          dgiotlog.log(this.editDictTempId)
          if (valid) this.put_Dict_temp(this.editDictTempId, dictTempForm)
        })
      },
      async put_Dict_temp(editDictId, row) {
        dgiotlog.log(row)
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
          category: {
            objectId: this.form.categoryid,
            __type: 'Pointer',
            className: 'Category',
          },
          icon: this.imageUrl ? this.imageUrl : '',
          desc: this.form.desc ? this.form.desc : '',
          content: {},
          profile: {},
          // 以上两个参数加了可能会出错。出错请在数据库自己加
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.addflag) {
              params.ACL = setAcl
              dgiotlog.log('params', params)
              postProductTemplet(params).then((res) => {
                if (res.objectId) {
                  this.$message({
                    type: 'success',
                    showClose: true,
                    duration: 2000,
                    message: '产品模板创建成功',
                  })
                } else {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: 'error',
                    message: '产品模板创建失败',
                  })
                }
                this.queryProduttemp({ category: this.form.categoryid })
                this.dialogFormVisible = false
              })
            } else {
              putProductTemplet(this.producttempId, params).then((res) => {
                dgiotlog.log('resresresres', res)
                if (res.updatedAt) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: 'success',
                    message: '产品模板修改成功',
                  })
                } else {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: 'error',
                    message: '产品模板修改失败',
                  })
                }
                this.queryProduttemp({ category: this.form.categoryid })
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
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '备份成功',
          })
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
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
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '数据为空,无法导出',
          })
        }
      },
      // 物模型
      ...mapMutations({
        setSizeForm: 'konva/setSizeForm',
        setTreeFlag: 'settings/setTreeFlag',
      }),
      getFormOrginalData() {
        return {
          devicetype: this.devicetype,
          strategy: '20',
          resource: 1,
          identifier: '',
          dis: '0X10',
          dinumber: 'null',
          type: 'int',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          isshow: true,
          unit: '',
          string: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          specs: {},
          precision: 3,
          round: 'all',
          struct: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          rate: 1,
          offset: 0,
          order: 0,
          protocol: 'normal',
          operatetype: 'readCoils',
          originaltype: 'int',
          slaveid: '0X10',
          collection: '%s',
          control: '%d',
          nobound: [],
          editdatatype: false,
          iscount: '0',
          countstrategy: 20,
          countround: 'all',
          countcollection: '%s',
          daslist: [],
        }
      },
      createProperty() {
        this.setSizeForm(this.getFormOrginalData())
        this.wmxdialogVisible = true
        this.wmxSituation = '新增'
      },
      wmxhandleClose() {
        this.$refs['sizeForm'].resource.disabled = false
        this.wmxdialogVisible = false
        this.setSizeForm(this.getFormOrginalData())
      },
      // 删除枚举型
      removeDomain(item) {
        var index = this.sizeForm.struct.indexOf(item)
        if (index !== -1) {
          this.sizeForm.struct.splice(index, 1)
        }
      },
      addDomain() {
        this.sizeForm.struct.push({
          attribute: '',
          attributevalue: '',
        })
      },
      deletewmx(index) {
        this.productDetail.thing.properties.splice(index, 1)
        let data = {
          thing: { properties: this.productDetail.thing.properties },
        }
        putProductTemplet(this.producttempId, data)
          .then((res) => {
            if (res.updatedAt) {
              this.$message({
                type: 'success',
                showClose: true,
                duration: 2000,
                message: '删除成功',
              })
            } else {
              this.$message({
                type: 'warning',
                showClose: true,
                duration: 2000,
                message: '删除失败',
              })
            }
          })
          .catch((e) => {
            dgiotlog.log(e)
          })
      },
      wmxDataFill(rowData, index) {
        this.modifyIndex = index
        this.wmxdialogVisible = true
        this.wmxSituation = '编辑'
        var obj = {}
        var daslist = []
        rowData.dataType.das.forEach((val) => {
          daslist.push({
            addr: val,
          })
        })
        // 提交之前需要先判断类型
        if (
          ['float', 'double', 'int', 'long'].indexOf(rowData.dataType.type) !=
          -1
        ) {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            daslist: daslist,
            endnumber: this.$objGet(rowData, 'dataType.specs.max'),
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            precision: this.$objGet(rowData, 'dataType.specs.precision'),
            // : rowData.dataForm.
            dis: this.$objGet(rowData, 'dataForm.address'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            collection: '',
            control: '',
            strategy: '',
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            editdatatype: true,
          }
          if (rowData.dataForm) {
            obj.collection = rowData.dataForm.collection
            obj.control = rowData.dataForm.control
            obj.strategy = rowData.dataForm.strategy
          }
        } else if (rowData.dataType.type == 'bool') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            true: rowData.dataType.specs[1],
            false: rowData.dataType.specs[0],
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: false,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'image') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            imagevalue: rowData.dataType.imagevalue,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: false,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'enum') {
          var structArray = []
          for (const key in rowData.dataType.specs) {
            structArray.push({
              attribute: key,
              attributevalue: rowData.dataType.specs[key],
            })
          }
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            specs: rowData.dataType.specs,
            struct: structArray,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'struct') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            struct: rowData.dataType.specs,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            identifier: rowData.dataForm == undefined ? '' : rowData.identifier,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'text') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            string: rowData.dataType.size,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            order: this.$objGet(rowData, 'dataForm.order'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'date') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            order: this.$objGet(rowData, 'dataForm.order'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            editdatatype: true,
          }
        } else if (rowData.dataType.type == 'geopoint') {
          obj = {
            name: rowData.name,
            devicetype: rowData.devicetype,
            type: rowData.dataType.type,
            gpstype: rowData.dataType.gpstype,
            collection:
              rowData.dataForm == undefined ? '' : rowData.dataForm.collection,
            control:
              rowData.dataForm == undefined ? '' : rowData.dataForm.control,
            strategy:
              rowData.dataForm == undefined ? '' : rowData.dataForm.strategy,
            daslist: daslist,
            startnumber: this.$objGet(rowData, 'dataType.specs.min'),
            step: this.$objGet(rowData, 'dataType.specs.step'),
            unit: this.$objGet(rowData, 'dataType.specs.unit'),
            round: this.$objGet(rowData, 'dataForm.round'),
            dis: this.$objGet(rowData, 'dataForm.address'),
            order: this.$objGet(rowData, 'dataForm.order'),
            dinumber: this.$objGet(rowData, 'dataForm.data'),
            rate: this.$objGet(rowData, 'dataForm.rate'),
            offset: this.$objGet(rowData, 'dataForm.offset'),
            protocol: this.$objGet(rowData, 'dataForm.protocol'),
            operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
            originaltype: this.$objGet(rowData, 'dataForm.originaltype'),
            slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
            iscount: this.$objGet(rowData, 'dataForm.iscount'),
            countstrategy: this.$objGet(rowData, 'dataForm.countstrategy'),
            countround: this.$objGet(rowData, 'dataForm.countround'),
            countcollection: this.$objGet(rowData, 'dataForm.countcollection'),
            required: true,
            ico: rowData.ico,
            isread: rowData.accessMode,
            isshow: rowData.isshow,
            identifier: rowData.identifier,
            editdatatype: true,
          }
        }
        obj.protocol = rowData.dataForm.protocol
        this.setSizeForm(obj)
        this.$nextTick(async () => {
          await this.$refs['sizeForm'].queryResource()
          // 保证子组件已经挂载完成）
          // if (this.$refs['sizeForm'])
          this.$refs['sizeForm'].resource.value = rowData.dataForm.protocol
          this.$refs['sizeForm'].resource.disabled = rowData.dataForm.protocol
            .length
            ? true
            : false
          // this.$refs['sizeForm'].changeResource(this.$refs['sizeForm'].resource.value)

          this.$refs['sizeForm'].resource.arrlist = rowData.dataSource
          this.$nextTick(() => {
            this.$refs['sizeForm'].resource.data.forEach((resource, index) => {
              // resource[index].arr = []
              // resource[index].obj = {}
              if (this.$refs['sizeForm'].resource.value === resource.cType) {
                console.info(resource, 'success cType')
                console.info(rowData.dataSource, 'rowData.dataSource')
                for (var o in rowData.dataSource) {
                  for (var j in resource.obj) {
                    if (o === j) resource.obj[o] = rowData.dataSource[j]
                  }
                }
                console.info(resource.obj, 'set resource.obj')
                this.$refs['sizeForm'].resource.addchannel = resource.obj
              }
              this.$refs['sizeForm'].resource.changeData = rowData.dataSource
              if (resource.cType == rowData.dataForm.protocol) {
                console.log(resource, 'success')
              }
            })
          })

          // this.$refs['sizeForm'].resource.arrlist.map((item) => {
          //   //  这里过滤掉 showname 为ico的
          //   obj[item.showname] = item.default.length > 0 ? item.default : ''
          //   this.$refs['sizeForm'].resource.addchannel = obj
          //   this.$refs['sizeForm'].resource.addchannel = rowData.dataForm
          //   // 校验 还需处理
          //   // if (item.required) {
          //   //   if (item.type == 'string' || item.type == 'integer') {
          //   //     sizerule[item.showname] = [
          //   //       {
          //   //         required: true,
          //   //         trigger: 'blur',
          //   //       },
          //   //     ]
          //   //   } else {
          //   //     sizerule[item.showname] = [
          //   //       {
          //   //         required: true,
          //   //         trigger: 'change',
          //   //       },
          //   //     ]
          //   //   }
          //   // }
          // })
          console.log('refs sizeForm', this.$refs['sizeForm']) // 子组件的实例
        })
      },
      addDas() {
        this.sizeForm.daslist.push({
          addr: '',
        })
      },
      removeDas(item) {
        var index = this.sizeForm.daslist.indexOf(item)
        if (index !== -1) {
          this.sizeForm.daslist.splice(index, 1)
        }
      },
      // 物模型提交
      submitFormwmx(sizeForm) {
        var das = []
        sizeForm.daslist.map((items) => {
          var newval = items['addr']
          das.push(newval)
        })
        dgiotlog.log('sizeForm', sizeForm)
        var obj = {
          name: sizeForm.name,
          devicetype: sizeForm.devicetype,
          dataForm: {
            round: sizeForm.round,
            data: sizeForm.dinumber,
            address: sizeForm.dis,
            rate: sizeForm.rate,
            offset: sizeForm.offset,
            order: sizeForm.order,
            protocol: sizeForm.protocol,
            operatetype: sizeForm.operatetype,
            originaltype: sizeForm.originaltype,
            slaveid: sizeForm.slaveid,
            collection: sizeForm.collection,
            control: sizeForm.control,
            strategy: sizeForm.strategy,
            iscount: sizeForm.iscount,
            countstrategy: sizeForm.countstrategy,
            countround: sizeForm.countround,
            countcollection: sizeForm.countcollection,
          },
          ico: sizeForm.ico,
          required: true,
          accessMode: sizeForm.isread,
          isshow: sizeForm.isshow,
          identifier: sizeForm.identifier,
        }
        // 提交之前需要先判断类型
        if (
          sizeForm.type == 'float' ||
          sizeForm.type == 'double' ||
          sizeForm.type == 'int' ||
          sizeForm.type == 'long'
        ) {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                max: sizeForm.endnumber,
                min: sizeForm.startnumber,
                step: sizeForm.step,
                precision: Number(sizeForm.precision),
                unit: sizeForm.unit == '' ? '' : sizeForm.unit,
              },
              das: das,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'image') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              imagevalue: sizeForm.imagevalue,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'bool') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              specs: {
                0: sizeForm.false,
                1: sizeForm.true,
              },
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'enum') {
          var specs = {}
          sizeForm.struct.map((items) => {
            var newkey = items['attribute']
            specs[newkey] = items['attributevalue']
          })
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              specs: specs,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'struct') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              specs: sizeForm.struct,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'text') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              size: sizeForm.string,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'date') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'geopoint') {
          obj1 = {
            dataType: {
              das: das,
              type: sizeForm.type.toLowerCase(),
              gpstype: sizeForm.gpstype,
              specs: {},
            },
          }
          Object.assign(obj, obj1)
        }
        delete obj.index
        dgiotlog.log('obj', obj)
        // 检测到
        // if (this.wmxSituation == '新增') {
        // dgiotlog.log("新增");
        if (this.wmxSituation == '新增') {
          // dgiotlog.log("新增");
          this.productDetail.thing.properties.unshift(obj)
        } else if (this.wmxSituation == '编辑') {
          // dgiotlog.log("编辑", obj);
          this.productDetail.thing.properties[this.modifyIndex] = obj
          this.thingKey = moment(new Date()).valueOf().toString()
        }
        dgiotlog.log(this.wmxSituation, this.productDetail.thing.properties)
        let data = {
          thing: { properties: this.productDetail.thing.properties },
        }
        putProductTemplet(this.producttempId, data).then((res) => {
          if (res.updatedAt) {
            this.$message({
              type: 'success',
              showClose: true,
              duration: 2000,
              message: this.wmxSituation + '成功',
            })
            // this.getProDetail()
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              duration: 2000,
              message: this.wmxSituation + '失败',
            })
          }
        })
        // }
        this.wmxdialogVisible = false
      },
      // 查看物模型模板
      checkschema() {
        this.schemadialogVisible = true
        setTimeout(() => {
          editor1 = ace.edit('editor1')
          editor1.session.setMode('ace/mode/json') // 设置语言
          editor1.setTheme('ace/theme/eclipse') // 设置主题
          editor1.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true, // 设置自动提示
          })
          editor1.setValue(JSON.stringify(this.productDetail.thing, null, 4))
        }, 1)
      },
      preserve() {
        const params = {
          thing: JSON.parse(editor1.getValue()),
        }
        putProductTemplet(this.producttempId, params).then((res) => {
          this.$message({
            type: 'success',
            showClose: true,
            duration: 2000,
            message: this.wmxSituation + '成功',
          })
        })
        this.schemadialogVisible = false
      },
      //组态
      goKonva(id) {
        this.$router.push({
          path: '/Topo?productid',
          query: {
            productid: id,
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
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
