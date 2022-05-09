<template>
  <div class="devproduct devproduct-container">
    <dgiot-input ref="uploadFinish" @fileInfo="fileInfo" />
    <div class="prosecond">
      <el-form
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
        size="small"
      >
        <el-form-item :label="$translateTitle('product.classification')">
          <el-select
            v-model="queryForm.category"
            :placeholder="$translateTitle('task.Select')"
            style="width: 100%"
            @change="handleCateSearch"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.objectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.productname"
            clearable
            :placeholder="$translateTitle('product.searchproductname')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProduct(0)">
            {{ $translateTitle('developer.search') }}
          </el-button>
        </el-form-item>
        <el-form-item style="float: right; text-align: right">
          <el-button type="primary" @click="addproduct">
            {{ $translateTitle('product.createproduct') }}
          </el-button>
          <el-button type="primary" @click="exportpro">
            {{ $translateTitle('product.exportpro') }}
          </el-button>
          <el-button type="primary" @click="handleImport()">
            {{ $translateTitle('product.importpro') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="protable">
        <el-table
          v-loading="listLoading"
          :cell-style="{ 'text-align': 'center' }"
          :data="tableData"
          :header-cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
        >
          <el-table-column
            label="ProductID"
            prop="objectId"
            show-overflow-tooltip
            sortable
          />
          <el-table-column :label="$translateTitle('product.productname')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$translateTitle('product.productgrouping')">
            <template #default="{ row }">
              <span>{{ row.netType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('product.addingtime')"
            width="180"
          >
            <template #default="{ row }">
              <span>{{ utc2beijing(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$translateTitle('developer.operation')"
            width="340"
          >
            <template #default="{ row, $index }">
              <el-button
                size="mini"
                type="primary"
                :underline="false"
                @click="deviceToDetail(row)"
              >
                {{ $translateTitle('product.config') }}
              </el-button>

              <el-button size="mini" @click="goKonva(row.objectId)">
                {{ $translateTitle('concentrator.konva') }}
              </el-button>

              <el-button
                size="mini"
                type="success"
                :underline="false"
                @click="editorProduct(row)"
              >
                {{ $translateTitle('concentrator.edit') }}
              </el-button>
              <el-popover
                :ref="`popover-${$index}`"
                placement="top"
                style="margin-left: 10px"
                width="300"
              >
                <p>确定删除这个{{ row.name }}产品吗？</p>
                <div style="margin: 0; text-align: right">
                  <el-button
                    size="mini"
                    @click="scope._self.$refs[`popover-${$index}`].doClose()"
                  >
                    {{ $translateTitle('developer.cancel') }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="makeSure(scope, $index)"
                  >
                    {{ $translateTitle('developer.determine') }}
                  </el-button>
                </div>
                <el-button slot="reference" size="mini" type="danger">
                  {{ $translateTitle('developer.delete') }}
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="elpagination" style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="length"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @current-change="productCurrentChange"
          @size-change="productSizeChange"
        />
      </div>
    </div>
    <div class="devproduct-prodialog">
      <!-- 创建产品对话框 ###-->
      <el-drawer
        :before-close="handleClose"
        :close-on-click-modal="false"
        size="60%"
        :title="moduleTitle"
        top="5vh"
        :visible.sync="dialogFormVisible"
      >
        <div class="devproduct-prodialog-content">
          <!--产品信息-->
          <div class="contentone">
            <div style="display: flex">
              <span>
                {{ $translateTitle('product.productinformation') }}
              </span>
              <p
                style="
                  flex-grow: 2;
                  width: auto;
                  height: 1px;
                  margin: 10px;
                  border-top: 1px dashed #dddddd;
                "
              />
            </div>

            <el-form
              ref="form"
              :label-width="
                $translateTitle('product.productname') == '产品名称'
                  ? '120px'
                  : '160px'
              "
              :model="form"
              :rules="rules"
            >
              <el-form-item
                :label="$translateTitle('product.productname')"
                prop="name"
              >
                <el-input v-model="form.name" autocomplete="off" />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.productgrouping')"
                prop="devType"
              >
                <el-input v-model="form.devType" autocomplete="off" />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('product.classification')"
                prop="category"
              >
                <el-select v-model="form.category" placeholder="请选择">
                  <el-option
                    style="height: auto; padding: 0"
                    :value="treeDataValue"
                  >
                    <el-tree
                      ref="workGroup"
                      :data="categoryTreeData"
                      default-expand-all
                      :expand-on-click-node="false"
                      node-key="index"
                    >
                      <div slot-scope="{ node, data }" class="custom-tree-node">
                        <span
                          :class="{
                            selected: false,
                          }"
                          @click="handleCateClick(node, data)"
                        >
                          {{ node.label }}
                        </span>
                      </div>
                    </el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$translateTitle('developer.applicationtype')"
                prop="relationApp"
              >
                <el-input
                  v-model="form.relationApp"
                  :disabled="custom_status == 'edit' && form.relationApp != ''"
                  :placeholder="$translateTitle('product.pleaseselectyourapp')"
                  readonly
                  @focus="showTree = !showTree"
                />
                <div v-if="showTree">
                  <el-tree
                    :data="allApps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                  />
                </div>
              </el-form-item>
              <el-form-item :label="$translateTitle('menu.icon')" prop="icon">
                <div v-if="imageUrl">
                  <img class="avatar" :src="imageUrl" />
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
                  @click="uploadCkick"
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
          <el-button type="primary" @click="submitForm()">
            {{ $translateTitle('developer.determine') }}
          </el-button>
          <el-button @click="handleCloseDialogForm()">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
        </div>
      </el-drawer>
    </div>
    <!--    <DgiotRender v-show="false" :config="config" :loading="true" />-->
  </div>
</template>
<script>
  import { uuid } from '@/utils'
  import { mapGetters } from 'vuex'
  import { delProduct, getProduct, putProduct } from '@/api/Product'
  import { getAllunit } from '@/api/Dict/index'
  import { queryDevice } from '@/api/Device/index'
  import { getServer } from '@/api/Role/index'
  import { postDict } from '@/api/Dict'
  import { getHashClass } from '@/api/Hash'
  import { ExportParse, ImportParse } from '@/api/Export'
  import { queryProductTemplet } from '@/api/ProductTemplet'
  import { queryCategory } from '@/api/Category'
  import { post_tree } from '@/api/Logs'

  const context = require.context('./component/profile', true, /\.vue$/)
  let res_components = {}
  context.keys().forEach((fileName) => {
    let comp = context(fileName)
    res_components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
  })

  export default {
    components: {},
    data() {
      return {
        selectedRow: {},
        tableData: [],
        allTemp: [],
        category: [],
        descriptions: {
          tableType: 'things',
          things: [],
          productId: '',
          dictTableList: [],
          decoderTableList: {},
          productDetail: {
            decoder: { code: '' },
            thing: { properties: [] },
            config: {
              parser: [],
              profile: [],
              basedate: { params: [] },
            },
          },
          parserTableList: [],
          tableLoading: false,
        },
        queryForm: {
          name: '',
          category: '',
          productId: '',
          productFlag: false,
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limt: 10,
          skip: 0,
          total: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
        cascaderDrawer: false,
        drawerWidth: Number($(window).width()) - 240,
        height: this.$baseTableHeight(0),
        config: {},
        dataList: [{}],
        parserView: false,
        parserTable: false,
        parserTableList: { parser: [] },
        parserFromId: '',
        dialogVisible: false,
        moduleTitle: this.$translateTitle('product.createproduct'),
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
          registersnumber: '',
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
          inactivevalue: '',
          activevalue: '',
        },
        elactiveName: 'Table',
        elactiveName1: 'Table1',
        editDictTempId: '',
        title_temp_dialog: '',
        dictTempForm: '',
        rule: [],
        dictVisible: false,
        listLoading: false,
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
        },
        uploadHeaders: {
          sessionToken: Cookies.get('access_token'),
        },
        uploadAction: '',
        uploadData: {},
        fileList: [],
        proTableData: [],
        dialogFormVisible: false,
        importDialogShow: false,
        cType: '',
        treeDataValue: '',
        categoryTreeData: [],
        curCatementId: '',
        form: {
          type: 1,
          storageStrategy: '',
          name: '',
          category: '',
          nodeType: 3,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
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
          devType: [
            {
              required: true,
              message: '请输入产品标识，用于区分不同设备',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请选择所属分类',
              trigger: 'change',
            },
          ],
          nodeType: [
            {
              required: true,
              message: '请选择节点类型',
              trigger: 'change',
            },
          ],
          netType: [
            {
              required: true,
              message: '请选择联网方式',
              trigger: 'change',
            },
          ],
          relationApp: [
            {
              required: true,
              message: '请选择产品可见角色',
              trigger: 'change',
            },
          ],
        },
        option: [],
        ruleoptions: [],
        dialogProfile: false,
        imageUrl: '',
        selectfromtype: '',
        productid: '',
        parserDict: [],
        formConfig: {},
        editIndex: 0,
        Parserzh: '',
        parseren: '',
        loading: false,
        allApps: [],
        categoryList: [],
        fileServer: '',
        access_token: '',
        projectid: '',
        projectName: '',
        allTableDate: [],
        showTree: false,
        showcateTree: false,
        multipleSelection: [],
      }
    },
    computed: {
      ...mapGetters({
        token: 'user/token',
        roleTree: 'user/roleTree',
      }),
    },
    mounted() {
      this.queryProdut({})
      this.categorytree()
      this.categorylist()
      this.searchProduct(0)
    },
    beforeDestroy() {
      this.projectName = ''
    },
    methods: {
      async handleIconClick(ev) {
        this.dialogProfile = !this.dialogProfile
        await this.$refs.dialogProfile.StepsListRowClick(this.selectedRow)
      },
      handleCateClick(node, data) {
        dgiotlog.log('node', node)
        dgiotlog.log('data', data)
        this.form.category = data.objectId
        this.curCatementId = data.name
      },
      async queryProdut(args) {
        const categorys = args.categorys
        const loading = this.$baseColorfullLoading()
        if (!args.limit) {
          args = this.queryForm
        }
        dgiotlog.log('args', args)
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          where: {},
        }
        args.name ? (params.where.name = { $regex: args.name }) : ''
        categorys ? (params.where.category = { $in: categorys }) : ''
        dgiotlog.log('params', params)
        try {
          const { results = [], count = 0 } = await queryProductTemplet(params)
          loading.close()
          this.tableData = results
          this.queryForm.total = count
        } catch (error) {
          loading.close()
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },
      goKonva(id) {
        this.$router.push({
          path: '/Topo?productid',
          query: {
            productid: id,
          },
        })
      },
      uploadCkick() {
        this.loading = true
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },
      fileInfo(info) {
        dgiotlog.log('info', info)
        this.imageUrl = info.url
        this.loading = false
      },
      async getAllunit() {
        this.allunit = []
        const { results } = await getAllunit('unit', 200)
        this.allunit = results.concat([])
      },
      submitEnum() {
        if (this.tempparams.type == 'Enum') {
          this.tempparams.specs.map((items) => {
            var newkey = items['attribute']
            this.tempparams.struct[newkey] = items['attributevalue']
          })
        }
      },
      // 添加枚举型
      addDomain() {
        this.tempparams.specs.push({
          attribute: '',
          attributevalue: '',
        })
      },
      // 删除枚举型
      removeDomain(item) {
        var index = this.tempparams.specs.indexOf(item)
        if (index !== -1) {
          this.tempparams.specs.splice(index, 1)
        }
      },
      delRow(index, rows) {
        rows.splice(index, 1)
        // this.onJsonSave("dictTempForm");
      },
      editRow(row, index, params) {
        this.editIndexId = index
        this.title_dict_edit_dialog = '修改字典数据'
        this.edit_dict_temp_dialog = true
        this.tempparams = row
      },
      closeDict() {
        this.edit_dict_temp_dialog = !this.edit_dict_temp_dialog
        // this.$refs.tempparams.resetFields()
      },
      onJsonSave(formName) {
        // 点击保存触发
        // dgiotlog.log("onJsonSave", this.dictTempForm.params);
        this.$refs[formName].validate((valid) => {
          dgiotlog.log(this.editDictTempId)
          if (valid) {
            this.put_Dict_temp(this.editDictTempId, this.dictTempForm)
          }
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
      submitFormTempDict() {
        this.submitEnum()
        this.edit_dict_temp_dialog = false
        if (this.editIndexId != undefined) {
          this.dictTempForm.params[this.editIndexId] = this.tempparams
          this.$message('编辑成功')
        } else {
          this.dictTempForm.params.push(this.tempparams)
          this.$message('新增成功')
        }
      },
      opendialog(name) {
        this.$nextTick(() => {
          this.$refs[name].clearValidate()
        })
      },
      tempTypeChange(value) {
        if (value == 'bool') {
          this.tempparams.default = true
          this.tempparams.default = true
        } else if (value == 'int') {
          this.tempparams.default = 0
        } else {
          this.tempparams.default = undefined
        }
      },
      addRow(tabs) {
        this.editIndexId = undefined
        this.title_dict_edit_dialog = '新增字典数据'
        this.edit_dict_temp_dialog = true
        this.tempparams = {
          name: '',
          identifier: '',
          type: '',
          order: 0,
          address: '',
          bytes: '',
          registersnumber: '',
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
          collection: '%s',
          setting: '%s',
          unit: '',
        }
      },
      onError() {
        this.$message('非Json数据类型')
      },
      handleNodeClick(data) {
        dgiotlog.log(data, 'data')
        this.$set(this.form, 'relationApp', data.name)
        this.showTree = !this.showTree
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
      treeData(paramData) {
        const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parent.objectId
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parent.objectId == 0 // 返回第一层
        })
      },
      deleteImgsrc() {
        // event.stopPropagation()
        this.imageUrl = ''
      },
      dataURItoBlob(dataURI) {
        // base64 解码
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], {
          type: mimeString,
        })
      },
      submitUpload() {
        // this.uploadAction = Cookies.get('apiserver') + '/product?appid=' + Cookies.get("appids");

        this.uploadAction = '/product'
        // this.uploadAction = 'http://cad.iotn2n.com:5080/product?appid=' + Cookies.get("appids");

        this.$nextTick(() => {
          // dgiotlog.log('uploadHeaders',this.uploadHeaders);

          this.uploadData.appid = Cookies.get('appids')
          // this.uploadData.key = "key";
          this.$refs.fileUpload.submit()
        })
      },
      handleUploadSuccess(response, file, fileList) {
        // dgiotlog.log('### Success response', response)
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: '产品导入成功',
        })
        this.importDialogShow = false
        this.$refs['uploadProForm'].resetFields()
        this.searchProduct()
      },
      handleUploadError(err, file, fileList) {
        this.$message({
          showClose: true,
          duration: 2000,
          showClose: true,
          message: err,
        })
      },
      handleChange(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
        }
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date // 2017-03-31 16:02:06
      },
      async searchProduct(start) {
        try {
          this.listLoading = true
          if (start == 0) this.start = 0

          var category = []
          const parsms = {
            count: 'objectId',
            order: '-updatedAt',
            limit: this.length,
            skip: this.start,
            where: {},
          }
          this.formInline.productname
            ? (parsms.where.name = { $regex: this.formInline.productname })
            : ''
          const { results = [], count = 0 } = await this.$query_object(
            'Product',
            parsms
          )
          // dgiotlog.log("results", results)
          if (results) {
            results.map((items) => {
              if (
                items.category != '' &&
                items.category &&
                items.devType != 'report'
              ) {
                category.push(items.category)
              }
            })
            this.listLoading = false
            this.proTableData = results
            this.total = count
            // this.$dgiotBus.$emit('MqttSubscribe', {
            //   topic: this.$route.name,
            // })
          }
          this.getApps()
        } catch (error) {
          this.listLoading = false
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      getApps() {
        this.allApps = this.roleTree
      },
      handleClose() {
        this.dialogFormVisible = false
      },
      // 选择产品模板
      chooseTemplate(row) {
        dgiotlog.log('row', row)
        this.selectedRow = row
        this.form.category = row.category
        this.cascaderDrawer = !this.cascaderDrawer
      },
      // 关闭dialog 事件
      handleCloseDialogForm() {
        this.dialogFormVisible = false
        // 重置表单
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      },
      properties(things, type = 'things') {
        this.descriptions.tableLoading = true
        dgiotlog.log(things)
        this.descriptions.things = things
        this.descriptions.tableType = type
        setTimeout(() => (this.descriptions.tableLoading = false), 1200)
      },
      // 添加产品弹窗
      addproduct() {
        this.custom_status = 'add'
        // return false
        this.moduleTitle = this.$translateTitle('product.createproduct')
        this.imageUrl = ''
        this.handleNodeClick(this.allApps[0])
        this.form = {
          name: '',
          type: 1,
          category: '',
          nodeType: 3,
          desc: '',
          netType: ' ',
          devType: '',
          productSecret: '',
          relationApp: this.allApps[0].name,
          roles: [],
        }
        this.dialogFormVisible = true
      },
      getParent(id, origin, returnarr) {
        origin.map((item) => {
          if (id == item.id) {
            returnarr.unshift(item.value)
            this.getParent(item.parentid, origin, returnarr)
          } else if (item.parentid == 0 && item.id == id) {
            returnarr.unshift(item.value)
          }
        })
        this.form.category = returnarr[0]
        return returnarr
      },
      // 查找Industry父级
      getIndustryParent(type, originarr) {
        originarr.map((item) => {
          if (item.value == type) {
            this.getParent(item.id, originarr, [])
          }
        })
      },
      async editorParser(ObjectId) {
        this.parserFromId = ObjectId
        try {
          const {
            config = {
              parser: [],
            },
            thing = {},
          } = await getProduct(ObjectId)
          this.parserTableList = config
          dgiotlog.log(this.parserTableList)
          this.parserDict = _.merge(thing, config)
        } catch (e) {
          this.parserTableList = { parser: [] }
          dgiotlog.log('eeeeeeeeeeeee', e)
        }
        this.parserTable = true
      },
      editParse(index, row) {
        this.formConfig = row
        this.editIndex = index
        this.dialogVisible = true
      },
      async saveParse(list, type = -1) {
        if (type + 2 > 0) {
          this.parserTableList.parser[type] = _.merge({}, list)
        }
        try {
          const res = await putProduct(this.parserFromId, {
            config: type + 2 > 0 ? this.parserTableList : list,
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
          this.parserTable = false
        } catch (e) {
          this.$message.error(
            this.$translateTitle('user.Save the template error') + `${e}`
          )
          dgiotlog.log(e, 'eeee')
        }
        dgiotlog.log(list)
      },
      previewParse(row) {
        this.parserView = true
        this.formConfig = row
        dgiotlog.log('previewParse', row)
      },
      addParse(row) {
        row['parser'].push({
          name: uuid(6),
          enname: uuid(6),
          config: {},
        })
      },
      deleteParse(index, rows) {
        rows.splice(index, 1)
      },
      async editorDict(ObjectId) {
        this.getAllunit()
        const row = await getProduct(ObjectId)
        const { config = { basedate: {} } } = row
        this.productInfo = row
        dgiotlog.log(' this.parserDict', this.parserDict)
        this.editDictTempId = ObjectId
        this.dictTempForm = {
          name: '',
          cType: '',
          enable: '1',
          description: '',
          params: [],
        }
        this.title_temp_dialog = '创建字典模板'
        dgiotlog.log(config)
        if (config.basedate && config.basedate.name) {
          this.title_temp_dialog = '修改字典模板'
          this.dictTempForm = config.basedate
        }
        this.rule = {
          name: [
            {
              required: true,
              message: '请输入字典模板名称',
              trigger: 'blur',
            },
          ],
          cType: [
            {
              required: true,
              message: '请输入字典模板类型',
              trigger: 'blur',
            },
          ],
          enable: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'change',
            },
          ],
        }
        dgiotlog.log(this.dictTempForm, 'config')
        this.dictVisible = true
      },
      editorProduct(row) {
        this.imageUrl = ''
        this.moduleTitle = this.$translateTitle('product.editproduct')
        this.custom_status = 'edit'
        this.custom_row = row
        // this.form.roles = [];
        // this.form.relationApp = ''
        this.dialogFormVisible = true
        this.productid = row.objectId
        this.getIndustryParent(row.category, this.categoryList)
        this.form.desc = row.desc
        this.form.name = row.name
        this.form.nodeType = row.nodeType
        this.form.netType = row.netType
        this.form.devType = row.devType
        this.form.productSecret = row.productSecret
        if (row.icon) {
          this.imageUrl = row.icon
        }
        let rows = []
        for (var key in row.ACL) {
          rows.push(key)
          if (key.includes('role')) {
            dgiotlog.log(key, 'key')
            this.form.relationApp = key ? key.substr(5) : ''
          }
        }
      },
      async categorylist() {
        const parsms = {
          order: 'createdAt',
          keys: 'count(*)',
          where: { level: { $in: [0, 1] } },
        }
        const { results } = await queryCategory(parsms)
        this.categoryList = results
        dgiotlog.log('this', this.categoryList)
      },
      async categorytree() {
        let name = this.queryForm.name.length
          ? '{ "$regex": "' + this.queryForm.name + '"}'
          : '{ "$ne": "null" }'
        this.listLoading = true
        let params = {
          class: 'Category',
          filter:
            '{"order": "createdAt","keys":["parent","name","level"],"where":{"level": {"$gte": 1}, "name":' +
            name +
            '}}',
          parent: 'parent',
        }
        dgiotlog.log(params)
        const { results = [] } = await post_tree(params)
        this.categoryTreeData = results
        this.listLoading = false
      },
      handleCateSearch(objectId) {
        this.queryForm.category = objectId
        this.showcateTree = !this.showcateTree
        if (objectId == 'a60a85475a') {
          this.queryProdut({})
        } else {
          let params = {
            keys: 'objectId',
            where: {
              parent: {
                className: 'Category',
                objectId: objectId,
                __type: 'Pointer',
              },
            },
          }
          queryCategory(params).then((res) => {
            const ids = []
            ids.push(objectId)
            res.results.forEach((result) => {
              ids.push(result.objectId)
            })
            dgiotlog.log('ids', ids)
            this.queryProdut({ categorys: ids })
          })
        }
      },
      submitForm() {
        var params = {}
        var initparams = {
          name: this.form.name,
          nodeType: this.form.nodeType,
          netType: this.form.netType,
          icon: this.imageUrl,
          devType: this.form.devType,
          desc: this.form.desc,
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.custom_status === 'add') {
            } else {
            }
          } else {
            this.$message('必填项未填')
          }
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
          this.$message.error(`${error}`)
        }
        this.$dgiotBus.$emit('reload-router-view')
      },
      async createProduct(params) {
        const res = await this.$create_object('Product', params)
        if (res.objectId) {
          this.initQuery('产品创建成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
            showClose: true,
            duration: 2000,
          })
        }
      },
      async editProduct(data) {
        const res = await this.$update_object(
          'Product',
          this.custom_row.objectId,
          data
        )
        if (res.updatedAt) {
          this.initQuery('产品修改成功', 'success')
        } else {
          this.$message({
            type: 'error',
            message: res.error,
            showClose: true,
            duration: 2000,
          })
        }
      },
      initQuery(msg, type) {
        this.$message({
          type: type || 'info',
          message: msg,
          showClose: true,
          duration: 2000,
        })
        this.dialogFormVisible = false
        this.resetProductForm()
        this.$refs['form'].resetFields()
        this.searchProduct()
      },
      resetProductForm() {
        this.form = {
          name: '',
          category: '',
          nodeType: 3,
          desc: '',
          netType: '',
          devType: '',
          productSecret: '',
          roles: [],
          relationApp: '',
        }
        this.imageUrl = ''
      },
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/detailproduct',
          query: {
            id: row.objectId,
          },
        })
      },
      GoTodevices(row) {
        this.$router.push({
          path: '/roles/thing',
          query: {
            productid: row.objectId,
          },
        })
      },
      /* el-popover点击关闭*/
      makeSure(scope, $index) {
        const params = {
          count: 'objectId',
          skip: 0,
          limit: 1,
          where: {
            product: row.objectId,
          },
        }
        queryDevice(params).then((results) => {
          if (results.count > 0) {
            this.$message('请先删除该产品下设备')
            return
          } else {
            delProduct(row.objectId).then((response) => {
              if (response) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                  showClose: true,
                  duration: 2000,
                })
                scope._self.$refs[`popover-${$index}`].doClose()
                this.searchProduct()
              }
            })
          }
        })
      },
      productSizeChange(val) {
        this.length = val
        this.searchProduct()
      },
      productCurrentChange(val) {
        this.start = (val - 1) * this.length
        this.searchProduct()
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
            showClose: true,
            duration: 2000,
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
      async handleImport() {
        await this.$refs.uploader.click()
      },
      // 导出
      async exportpro() {
        const loading = this.$baseColorfullLoading(2)
        try {
          const res = await ExportParse('Product', {})
          loading.close()
          this.$convertRes2Blob(res)
          // this.$message.success(`${res}`)
        } catch (error) {
          loading.close()
          this.$message.error(`${error}`)
        }
      },
    },
  }
</script>
<style lang="scss">
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    width: 80px !important;
    height: 80px !important;
    font-size: 28px;
    line-height: 80px !important;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #cccccc;
  }

  .avatar {
    display: block;
    width: 80px !important;
    height: 80px !important;
  }
</style>
<style lang="scss" scoped>
  .devproduct {
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    &-prodialog {
      margin-left: 52px;

      &-content {
        margin: auto 30px;
      }

      &-footer {
        text-align: center;
      }
    }
  }

  .devproduct ::v-deep .el-dialog__wrapper .el-dialog__header,
    //.devproduct ::v-deep .el-dialog__wrapper .el-dialog__close {
    //  display: none;
    //}
  .devproduct .parserTable {
    display: block;
  }

  .devproduct ::v-deep {
    .el-dialog {
      margin: 0 auto;
    }

    .devproduct .el-tabs__header {
      margin: 0;
    }

    .devproduct ::v-deep .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }

    .devproduct ::v-deep .el-tabs__content {
      box-sizing: border-box;
      padding: 20px;
      background: #f4f4f4;
    }

    .devproduct ::v-deep .el-tab-pane {
      background: #ffffff;
    }

    .devproduct ::v-deep .procontent,
    .devproduct ::v-deep .prosecond {
      box-sizing: border-box;
      width: 100%;
    }

    .devproduct ::v-deep .el-dialog {
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
  }

  /* .devproduct .el-icon-close{
position:absolute;
right:0;
} */
</style>
