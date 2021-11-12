<!--
* @Author: h7ml
* @Date: 2021-11-08 17:17:58
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:17:58
* @Description: 检测任务
* @FilePath: src\views\CloudTest\Task\index.vue
* @DocumentLink:
-->
<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <div class="components">
      <vab-dialog :show.sync="activePopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.add')
          }}{{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-form
            ref="ruleForm"
            class="demo-ruleForm"
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
          >
            <el-form-item
              :label="$translateTitle('cloudTest.Template name')"
              prop="name"
            >
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.category')"
              prop="category"
            >
              <el-input v-model="ruleForm.category" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Trade Names')"
              prop="factory"
              required
            >
              <el-input v-model="ruleForm.factory" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('cloudTest.Template file')"
              prop="file"
              required
            >
              <!--              <el-input v-model="ruleForm.name" />-->
              <el-upload
                :key="momentKey"
                ref="upload"
                v-model="ruleForm.file"
                accept=".doc,.docx"
                action="string"
                :before-upload="onBeforeUploadImage"
                class="upload-demo"
                :file-list="fileList"
                :http-request="UploadImage"
                :limit="1"
                list-type="text"
                :on-change="fileChange"
              >
                <el-button slot="trigger" size="small" type="primary">
                  {{ $translateTitle('application.selectfile') }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="submitForm('ruleForm')">
            {{ $translateTitle('product.createnow') }}
          </el-button>
          <el-button @click="resetForm('ruleForm')">
            {{ $translateTitle('zetadevices.reset') }}
          </el-button>
        </div>
      </vab-dialog>
      <vab-dialog :show.sync="tempPopShow">
        <h3 slot="title">
          {{ $translateTitle('cloudTest.report template') }}
        </h3>
        <div class="content">
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :border="border"
            :data="tempList"
            :height="$baseTableHeight(3)"
            :size="lineHeight"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.number')"
              show-overflow-tooltip
              width="80"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.Template name')"
              prop="name"
              show-overflow-tooltip
              width="auto"
            />
            <el-table-column
              align="center"
              :label="$translateTitle('cloudTest.Template content')"
              width="auto"
            >
              <template #default="{ row }">
                <el-image
                  :preview-src-list="[`${$FileServe + row.icon}`]"
                  :src="$FileServe + row.icon"
                  style="width: 40px; height: 40px"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              flex="right"
              :label="$translateTitle(`product.Template management`)"
              show-overflow-tooltip
              width="auto"
            >
              <template #default="{ row }">
                <el-button type="success" @click="handlekonva(row)">
                  {{ $translateTitle(`developer.mapping`) }}
                </el-button>
                <el-button type="warning" @click="handleDelete(row, 1)">
                  {{ $translateTitle(`cloudTest.delete`) }}
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="vab-data-empty"
                :src="
                  require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                "
              />
            </template>
          </el-table>
        </div>
      </vab-dialog>
    </div>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-select
              v-model="queryForm.name"
              multiple
              :placeholder="
                $translateTitle('cloudTest.Please select review status')
              "
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="fetchData(queryForm)"
            >
              {{ $translateTitle('cloudTest.search') }}
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              {{ $translateTitle('cloudTest.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <!--        <div class="stripe-panel">-->
        <!--          <el-checkbox v-model="stripe">-->
        <!--            {{ $translateTitle('cloudTest.Zebra pattern') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <!--        <div class="border-panel">-->
        <!--          <el-checkbox v-model="border">-->
        <!--            {{ $translateTitle('cloudTest.frame') }}-->
        <!--          </el-checkbox>-->
        <!--        </div>-->
        <el-button
          style="margin: 0 10px 10px 0 !important"
          type="primary"
          @click="clickFullScreen"
        >
          <vab-icon
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          {{ $translateTitle('cloudTest.full screen') }}
        </el-button>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">
              {{ $translateTitle('cloudTest.medium') }}
            </el-radio>
            <el-radio label="small">
              {{ $translateTitle('cloudTest.small') }}
            </el-radio>
            <el-radio label="mini">
              {{ $translateTitle('cloudTest.mini') }}
            </el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <vab-icon icon="line-height" />
              {{ $translateTitle('cloudTest.size') }}
            </el-button>
          </template>
        </el-popover>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable :list="columns" v-bind="dragOptions">
              <div v-for="(item, index) in columns" :key="item + index">
                <vab-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ $translateTitle(`cloudTest.${item.label}`) }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 0 10px 0 !important"
              type="primary"
            >
              {{ $translateTitle('cloudTest.Draggable column') }}
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-row :gutter="24">
      <el-col
        :lg="collapse ? 4 : 2"
        :md="collapse ? 4 : 2"
        :sm="collapse ? 10 : 2"
        :xl="collapse ? 4 : 2"
        :xs="collapse ? 8 : 2"
      >
        <vab-role-tree class="vab-role-tree" />
      </el-col>
      <el-col
        :lg="collapse ? 20 : 22"
        :md="collapse ? 20 : 22"
        :sm="collapse ? 14 : 22"
        :xl="collapse ? 21 : 22"
        :xs="collapse ? 16 : 22"
      >
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :border="border"
          :data="list"
          :height="height"
          :size="lineHeight"
          :stripe="stripe"
        >
          <el-table-column
            align="center"
            :label="$translateTitle('cloudTest.number')"
            show-overflow-tooltip
            width="95"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            align="center"
            :label="$translateTitle(`cloudTest.${item.label}`)"
            :prop="item.prop"
            show-overflow-tooltip
            :sortable="item.sortable"
            :width="item.width"
          />

          <el-table-column
            align="center"
            :label="$translateTitle(`deviceLog.status`)"
            show-overflow-tooltip
            width="185"
          >
            <template #default="{ row }">
              <el-tag
                effect="dark"
                :type="
                  ['success', 'info', 'warning', 'danger'][
                    row.basedata.testStatus
                  ] || 0
                "
              >
                {{
                  [
                    $translateTitle('product.notstarted'),
                    $translateTitle('product.testing'),
                    $translateTitle('product.finishtest'),
                  ][row.basedata.testStatus] ||
                  $translateTitle('product.notested')
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle(`cloudTest.operate`)"
            show-overflow-tooltip
            width="185"
          >
            <template #default="{ row }">
              <el-button type="success" @click="handleManagement(row)">
                {{ $translateTitle(`product.Template management`) }}
              </el-button>
              <el-button type="warning" @click="handleDelete(row, 0)">
                {{ $translateTitle(`cloudTest.delete`) }}
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="vab-data-empty"
              :src="
                require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
              "
            />
          </template>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page.sync="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :page-sizes="queryForm.pageSizes"
      :total="queryForm.total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { queryDevice } from '@/api/Device'
  import { postReportFile } from '@/api/Platform'
  import TableEdit from '@/views/Empty/tableEdit'
  import VabDraggable from 'vuedraggable'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Index',
    components: {
      VabDraggable,
      TableEdit,
    },
    data() {
      const validateFile = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传文件'))
        } else {
          callback()
        }
      }
      return {
        options: [
          {
            value: 'Underreview',
            label: '审核中',
          },
          {
            value: 'finishreview',
            label: '审核完成',
          },
        ],
        fileList: [],
        momentKey: moment(new Date()).valueOf(),
        ruleForm: {
          file: null,
          name: '',
          category: '',
          factory: '',
          date2: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入模板名称',
              trigger: 'blur',
            },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请输入所属品类',
              trigger: 'blur',
            },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
              trigger: 'blur',
            },
          ],
          factory: [
            {
              required: true,
              message: '请输入厂商名称',
              trigger: 'blur',
            },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
              trigger: 'blur',
            },
          ],
          file: [
            {
              validator: validateFile,
              trigger: 'blur',
            },
          ],
        },
        activePopShow: false,
        tempPopShow: false,
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) - 20,
        stripe: true,
        lineHeight: 'medium',
        checkList: [
          'Inspection number',
          'mission name',
          'Inspection template',
          'Trade Names',
          'Creation time',
          'Starting time',
          'end time',
        ],
        columns: [
          {
            label: 'Inspection number',
            width: 'auto',
            prop: 'basedata.BasicInfo.bianhao',
            sortable: true,
            disableCheck: true,
          },
          {
            label: 'mission name',
            width: 'auto',
            prop: 'name',
            sortable: true,
          },
          {
            label: 'Inspection template',
            width: 'auto',
            prop: 'basedata.bedname',
            sortable: true,
          },
          {
            label: 'Creation time',
            width: 'auto',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: 'Starting time',
            width: 'auto',
            prop: 'basedata.starttime',
            sortable: true,
          },
          {
            label: 'end time',
            width: 'auto',
            prop: 'basedata.endtime',
            sortable: true,
          },
        ],
        list: [],
        tempList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        temprow: {},
        queryForm: {
          pageSizes: [10, 20, 30, 50],
          limit: 10,
          order: '-createdAt',
          keys: 'count(*)',
          total: 0,
          skip: 0,
          pageNo: 1,
          pageSize: 10,
          name: ['审核中', '审核完成'],
        },
      }
    },
    computed: {
      ...mapGetters({
        language: 'settings/language',
        collapse: 'settings/collapse',
      }),
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {
      language: {
        deep: true,
        limit: true,
        handler(val) {
          console.error(val)
        },
      },
    },
    created() {
      this.fetchData(this.queryForm)
    },
    methods: {
      onBeforeUploadImage(file) {
        const docxType = [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ]
        console.error(
          file,
          file.size,
          file.size / 1024 / 1024 < 30,
          docxType.includes(file.type),
          file.type
        )
        const isIMAGE = docxType.includes(file.type)
        const isLt30M = file.size / 1024 / 1024 < 30
        if (!isIMAGE) {
          this.$message.error('上传文件只能是doc/docx格式!')
        }
        if (!isLt30M) {
          this.$message.error('上传文件大小不能超过 30MB!')
        }
        this.momentKey = moment(new Date()).valueOf()
        return isIMAGE && isLt30M
      },
      UploadImage(param) {
        console.error(param, 'param')
        this.ruleForm.file = param.file
      },
      fileChange(file) {
        this.$refs.upload.clearFiles() //清除文件对象
        this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
        this.fileList = [
          {
            name: file.name,
            url: file.url,
          },
        ] // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handlePreview(file) {
        console.log(file)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const formData = new FormData()
            const configTemp = {
              identifier: 'inspectionReportTemp',
              client: this.ruleForm.factory,
            }
            formData.append('devType', this.ruleForm.category)
            formData.append('name', this.ruleForm.name)
            formData.append('config', JSON.stringify(configTemp))
            formData.append('file', this.ruleForm.file)
            const loading = this.$baseColorfullLoading(1)
            try {
              const { result } = await postReportFile(formData)
              console.log(result)
              this.$message.success(
                this.$translateTitle('cloudTest.Template created successfully')
              )
              this.activePopShow = false
              this.fetchData(this.queryForm)
            } catch (e) {
              this.$message.error(
                this.$translateTitle('cloudTest.Template creation failed')
              )
            }
            loading.close()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      sizeChange(val) {
        this.queryForm.limit = val
        this.fetchData(this.queryForm)
      },
      currentChange(val) {
        this.queryForm.skip = (val - 1) * this.queryForm.limit
        this.fetchData(this.queryForm)
      },
      resetForm(formName) {
        this.ruleForm.file = null
        this.fileList = []
        this.$refs[formName].resetFields()
      },
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 210
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      handleAdd() {
        // this.$refs['edit'].showEdit()
        this.activePopShow = true
      },
      handlekonva(row) {
        // 取证类型模板跳转到组态
        this.$router.push({
          path: '/Topo',
          query: {
            productid: row.objectId,
            icon: row.icon,
            type: 'Evidence',
          },
        })
      },
      async handleManagement(row) {
        this.temprow = row
        const params = {
          limit: 50,
          skip: 0,
          keys: 'count(*)',
          where: {
            devType: this.temprow.devType,
            nodeType: 0,
          },
          order: 'createdAt',
        }
        const loading = this.$baseColorfullLoading(1)
        try {
          const { count = 0, results } = await queryDevice(params)
          this.tempList = results
        } catch (e) {}
        this.tempPopShow = true
        loading.close()
      },
      handleDelete(row, flag) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const res = await delProduct(row.objectId)
            this.$baseMessage(
              this.$translateTitle('successfully deleted'),
              'success',
              'vab-hey-message-success'
            )
            flag == 0
              ? await this.fetchData(this.queryForm)
              : await this.handleManagement(this.temprow)
          }
        )
      },
      async fetchData(args) {
        const params = {
          limit: args.limit,
          order: args.order,
          skip: this.queryForm.name.length ? 0 : args.skip,
          keys: args.keys,
          where: {
            // name: this.queryForm.name
            //   ? { $regex: this.queryForm.name }
            //   : { $ne: null },
            'basedata.identifier': 'inspectionReportTemp',
            // nodeType: 1,
          },
        }
        this.listLoading = true
        const tempList = {
          results: [
            {
              objectId: '0ac4f9eb2f',
              createdAt: '2021-04-29T14:31:28.274Z',
              updatedAt: '2021-10-30T07:28:16.718Z',
              basedata: {
                name: 'taskInfo',
                index: 0,
                layer: {
                  width: 600,
                  height: 850,
                  backColor: '#eee',
                  backgroundImage: '',
                  widthHeightRatio: '',
                },
                client: ['电动泵'],
                remark: '',
                bedaddr: '9f7c90228fff',
                bedname: '南方泵业台体',
                endtime: 1618884000000,
                deviceid: '',
                reportId: '633e7fa7d6',
                BasicInfo: {
                  guige: '/',
                  pizun: '',
                  wendu: '',
                  beizhu: '/',
                  daqiya: '',
                  dengji: '/',
                  shenhe: '',
                  taishu: '/',
                  xiaolv: '/',
                  bianhao: 'BB2021042-(1)',
                  bianzhi: '',
                  lianxidh: '',
                  scdwAdrr: '/',
                  wtdwAdrr: '/',
                  chanpinxh: '/',
                  jianceren: '',
                  pizhunren: '',
                  shenheren: '',
                  chuchangbh: '/',
                  qianfaData: '',
                  shengchanN: '/',
                  shiyanName: '/',
                  chanpinName: '/',
                  chouyangNum: '',
                  daoyangData: '',
                  dynamicTags: [],
                  jianyanData: '',
                  jianyanyiju: '',
                  yangpinName: '管道式离心泵',
                  chouyangAddr: '/',
                  chouyangAdrr: '厂成品库',
                  chouyangData: '',
                  weituodanwei: '/',
                  chouyangjishu: '0',
                  yanshoudengji: '',
                  chanpinbianhao: '/',
                  jianyanxingzhi: '委托校验',
                  shengchangData: '',
                  shiyanDateTime: '',
                  songyangdanwei: '/',
                  jianyanbiaozhun: '/',
                  songyangDateTime: '',
                  yangpinzhuangtai: '',
                },
                groupname: '南方泵业',
                starttime: 1618880400000,
                components: [],
                identifier: 'inspectionReportTemp',
                reportList: [
                  {
                    ACL: {
                      'role:方威检测室': {
                        read: true,
                        write: true,
                      },
                    },
                    desc: '0',
                    icon: '',
                    name: '南方泵业管道循环泵',
                    config: {
                      name: '南方泵业管道循环泵',
                      index: 0,
                      layer: {
                        width: 600,
                        height: 850,
                        backColor: '#eee',
                        backgroundImage: '',
                        widthHeightRatio: '',
                      },
                      client: ['电动泵'],
                      deviceid: '',
                      components: [],
                      identifier: 'inspectionReportTemp',
                    },
                    devType: '管道循环泵',
                    category: 'Evidence',
                    children: {
                      __type: 'Relation',
                      className: 'Product',
                    },
                    nodeType: 1,
                    objectId: '633e7fa7d6',
                    createdAt: '2021-04-29T03:52:10.368Z',
                    updatedAt: '2021-04-29T03:52:10.368Z',
                    productSecret: 'c6b084b31bfe5553c0a4a4eae76bf6e3',
                  },
                  {
                    ACL: {
                      'role:方威检测室': {
                        read: true,
                        write: true,
                      },
                    },
                    desc: '0',
                    icon: '',
                    name: '南方家用泵',
                    config: {
                      name: '南方家用泵',
                      index: 0,
                      layer: {
                        width: 600,
                        height: 850,
                        backColor: '#eee',
                        backgroundImage: '',
                        widthHeightRatio: '',
                      },
                      client: '潜水泵',
                      deviceid: '',
                      components: [],
                      identifier: 'a28b149a-0f31-fe7d-cadc-0be47faf8a8d',
                    },
                    devType: '潜水泵',
                    category: 'Evidence',
                    children: {
                      __type: 'Relation',
                      className: 'Product',
                    },
                    nodeType: 1,
                    objectId: 'c5f31fa3a4',
                    createdAt: '2021-01-12T12:18:59.570Z',
                    updatedAt: '2021-01-12T12:18:59.570Z',
                    productSecret: 'productSecret',
                  },
                ],
                testStatus: 2,
                TestSetting: {
                  BasicSetting: {
                    AcceptParam: {
                      tHf: 0.1,
                      tQz: 0.16,
                      tp_up: 0.16,
                      te_down: -0.05,
                      th_down: 0,
                      tq_down: 0,
                    },
                    dengji_test: '2U',
                    testPrecision: '1',
                  },
                  FormulaSetting: { SpeedConversionFormula: 'GB/t3216-2016' },
                  ParameterSetting: {
                    SumAverage: false,
                    RemoveMaxMinGetAverage: false,
                  },
                  StabilitySetting: {
                    Speed: 'GB/T3216-2016',
                    FlowHeadEfficiency: 'GB/T3216-2016',
                  },
                  QualifiedConditionsSetting: {
                    QualifiedConditions: 'GB/T3216-2016',
                  },
                },
                verifyStatus: 0,
                insectionName: '南方泵业管道循环泵',
                PrescribedPoint: {
                  H1: '',
                  H2: '',
                  H3: '',
                  Q1: '',
                  Q2: '',
                  Q3: '',
                  tR: '',
                  rpm: '',
                  DJXL: '',
                  NpRC: '',
                  NpshG: '',
                  glysG: '',
                  point: '',
                  glysRC: '',
                  qishi1: '',
                  qishi2: '',
                  qishi3: '',
                  temzcG: '',
                  xiaolv1: '',
                  xiaolv2: '',
                  xiaolv3: '',
                  zhougv1: '',
                  zhougv2: '',
                  zhougv3: '',
                  zhendongG: '',
                  pointDataArr: [],
                },
                SouthPrescribedPoint: {
                  H1: '',
                  H2: '',
                  H3: '',
                  Q1: '',
                  Q2: '',
                  Q3: '',
                  tR: '',
                  rpm: '',
                  DJXL: '',
                  NpRC: '',
                  NpshG: '',
                  glysG: '',
                  point: '',
                  glysRC: '',
                  qishi1: '',
                  qishi2: '',
                  qishi3: '',
                  temzcG: '',
                  xiaolv1: '',
                  xiaolv2: '',
                  xiaolv3: '',
                  zhougv1: '',
                  zhougv2: '',
                  zhougv3: '',
                  zhendongG: '',
                  pointDataArr: [],
                },
              },
              detail: {
                desc: '南方泵业管道循环泵检测',
                brand: '数蛙桌面采集网关',
                batchId: {
                  batch_name: '2021429',
                  createdtime: 1619706688,
                },
                devModel: 'SW_WIN_CAPTURE',
                isEnable: true,
              },
              devaddr: 'a4889298366f',
              ip: '',
              isEnable: true,
              name: '南方泵业管道循环泵检测',
              product: {
                objectId: '633e7fa7d6',
                __type: 'Pointer',
                className: 'Product',
              },
              status: 'ONLINE',
              ACL: {
                'role:方威检测室': {
                  read: true,
                  write: true,
                },
              },
            },
            {
              objectId: 'd19ed1c4c0',
              createdAt: '2021-01-12T12:25:15.088Z',
              updatedAt: '2021-04-21T03:58:48.584Z',
              basedata: {
                name: 'taskInfo',
                remark: '',
                bedaddr: '9f7c90228fff',
                bedname: '南方泵业台体',
                endtime: 1610157600000,
                reportId: 'c5f31fa3a4',
                BasicInfo: {
                  name: '南方泵业集团',
                  guige: 'IG40-100',
                  pizun: '霍林',
                  wendu: '33',
                  beizhu: '/',
                  daqiya: '1',
                  dengji: '样品状态完好，适于检验',
                  shenhe: '唐炜炜',
                  taishu: '1',
                  xiaolv: '76',
                  bianhao: '2021GJW00198',
                  bianzhi: '刘晓冬',
                  xinghao: '6',
                  lianxidh: '0571-86390083',
                  scdwAdrr: '杭州市余杭区仁和街道',
                  wtdwAdrr: '杭州市余杭区仁和街道',
                  chanpinxh: 'IG40-100',
                  jianceren: '李少清',
                  pizhunren: '霍林',
                  shenheren: '唐炜炜',
                  chuchangbh: '201217',
                  qianfaData: '2021-01-10T16:00:00.000Z',
                  shengchanN: '南方泵业集团',
                  shiyanName: '王国军',
                  chanpinName: '中开泵',
                  chouyangNum: '1',
                  daoyangData: '2021-01-09T16:00:00.000Z',
                  dynamicTags: ['流量计', '温度计', '压力变送器'],
                  jianyanData: '2021-01-10T16:00:00.000Z',
                  jianyanyiju:
                    'JB/T 6878-2006、GB/T 3216-2016、GB/T 29531-2013、GB/T 29529-2013',
                  yangpinName: '中开泵',
                  chouyangAddr: '南方泵业集团',
                  chouyangAdrr: '厂成品库',
                  chouyangData: '2021-01-04T16:00:00.000Z',
                  weituodanwei: '南方泵业集团',
                  chouyangjishu: '10',
                  yanshoudengji: '2B',
                  chanpinbianhao: '2101084523',
                  jianyanxingzhi: '委托校验',
                  shengchangData: '2020-12-16T16:00:00.000Z',
                  shiyanDateTime: '2021-01-10T16:00:00.000Z',
                  songyangdanwei: '南方泵业集团',
                  chuchangbianhao: '8',
                  jianyanbiaozhun: '/',
                  songyangDateTime: '2021-01-09T16:00:00.000Z',
                  yangpinzhuangtai: '样品状态完好，适于检验',
                },
                groupname: '南方泵业',
                starttime: 1610154000000,
                identifier: 'inspectionReportTemp',
                reportList: [
                  {
                    ACL: {
                      'role:方威检测室': {
                        read: true,
                        write: true,
                      },
                    },
                    desc: '0',
                    icon: '',
                    name: '南方家用泵',
                    config: {
                      name: '南方家用泵',
                      index: 0,
                      layer: {
                        width: 600,
                        height: 850,
                        backColor: '#eee',
                        backgroundImage: '',
                        widthHeightRatio: '',
                      },
                      client: '潜水泵',
                      deviceid: '',
                      components: [],
                      identifier: 'a28b149a-0f31-fe7d-cadc-0be47faf8a8d',
                    },
                    devType: '潜水泵',
                    category: 'Evidence',
                    children: {
                      __type: 'Relation',
                      className: 'Product',
                    },
                    nodeType: 1,
                    objectId: 'c5f31fa3a4',
                    createdAt: '2021-01-12T12:18:59.570Z',
                    updatedAt: '2021-01-12T12:18:59.570Z',
                    productSecret: 'productSecret',
                  },
                ],
                testStatus: 1,
                TestSetting: {
                  BasicSetting: {
                    AcceptParam: {
                      tHf: 0.05,
                      tQz: 0.08,
                      tp_up: 0.08,
                      te_down: -0.05,
                      th_down: -0.05,
                      tq_down: -0.08,
                    },
                    dengji_test: '2B',
                    testPrecision: '2',
                  },
                  FormulaSetting: { SpeedConversionFormula: 'GB/t3216-2016' },
                  ParameterSetting: {
                    SumAverage: false,
                    AverageNumber: '15',
                    AcquisitionCycle: '30',
                    RemoveMaxMinGetAverage: false,
                    HeightOfSubmersiblePump: '0.5',
                    GravitationalAcceleration: '9.81',
                  },
                  StabilitySetting: {
                    Speed: 'GB/T3216-2016',
                    FlowHeadEfficiency: 'GB/T3216-2016',
                  },
                  QualifiedConditionsSetting: {
                    QualifiedConditions: 'GB/T3216-2016',
                  },
                },
                verifyStatus: 0,
                insectionName: '南方家用泵',
                PrescribedPoint: {
                  H1: '',
                  H2: '43',
                  H3: '',
                  Q1: '',
                  Q2: '10',
                  Q3: '',
                  tR: '0.05',
                  rpm: '2950',
                  DJXL: '',
                  NpRC: '0.01',
                  NpshG: '2',
                  gddxl: '72',
                  glysG: '0.86',
                  point: '',
                  glysRC: '0.08',
                  qishi1: '',
                  qishi2: '2',
                  qishi3: '',
                  temzcG: '35',
                  xiaolv1: '',
                  xiaolv2: '72',
                  xiaolv3: '',
                  zhougv1: '',
                  zhougv2: '2200',
                  zhougv3: '',
                  zhendongG: '4.5',
                  pointDataArr: [],
                },
                SouthPrescribedPoint: {
                  H1: '',
                  H2: '43',
                  H3: '',
                  Q1: '',
                  Q2: '10',
                  Q3: '',
                  tR: '0.05',
                  rpm: '2950',
                  DJXL: '',
                  NpRC: '0.01',
                  NpshG: '2',
                  gddxl: '72',
                  glysG: '0.86',
                  point: '',
                  glysRC: '0.08',
                  qishi1: '',
                  qishi2: '2',
                  qishi3: '',
                  temzcG: '35',
                  xiaolv1: '',
                  xiaolv2: '72',
                  xiaolv3: '',
                  zhougv1: '',
                  zhougv2: '2200',
                  zhougv3: '',
                  zhendongG: '4.5',
                  pointDataArr: [],
                },
              },
              detail: {
                desc: '南方泵业家用泵检测',
                brand: '数蛙桌面采集网关',
                batchId: {
                  batch_name: '2021112',
                  createdtime: 1610454315,
                },
                devModel: 'SW_WIN_CAPTURE',
                isEnable: true,
              },
              devaddr: 'cf4f2e4c63e2',
              ip: '',
              isEnable: true,
              name: '南方泵业家用泵检测',
              product: {
                objectId: 'c5f31fa3a4',
                __type: 'Pointer',
                className: 'Product',
              },
              status: 'ONLINE',
              ACL: {
                'role:方威检测室': {
                  read: true,
                  write: true,
                },
              },
            },
          ],
        }
        const { count = 0, results = [] } = await queryDevice(params)
        this.list = results.length ? results : tempList.results
        results.forEach((item) => {
          item.basedata.endtime = moment(item.basedata.endtime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.basedata.starttime = moment(item.basedata.starttime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
        // this.list = results
        this.queryForm.total = count
        this.listLoading = false
      },
    },
  }
</script>
