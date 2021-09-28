<template>
  <!-- dialog -->
  <div>
    <div class="dialog-mian">
      <el-dialog
        :append-to-body="true"
        :visible.sync="add_taskdialog"
        width="40%"
      >
        <el-form
          ref="task_form"
          :model="task_form"
          :rules="formRule"
          label-width="120px"
        >
          <el-divider content-position="left" style="color: blue">
            <!-- 基本信息 -->
            {{ $translateTitle('concentrator.basicinformation') }}
          </el-divider>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <!-- <el-form-item label="任务名称：" prop="name"> -->
                <el-form-item
                  :label="$translateTitle('task.Taskname')"
                  prop="name"
                >
                  <el-input
                    v-model="task_form.name"
                    :placeholder="
                      $translateTitle('product.enter1') +
                      $translateTitle('task.Taskname')
                    "
                  />
                </el-form-item>
                <!-- <el-form-item
                  label="报告模板"
                  prop="basedata.info.testContent.name"
                > -->
                <el-form-item
                  :label="$translateTitle('developer.Reporttemplate')"
                  prop="basedata.info.testContent.name"
                >
                  <el-select
                    v-model="task_form.basedata.info.testContent.name"
                    :placeholder="$translateTitle('developer.Reporttemplate')"
                    style="width: 100%"
                    @change="changeReport"
                  >
                    <el-option
                      v-for="(item, index) in reportList"
                      :key="index"
                      :label="item.name"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <!--右边的地方-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <!-- 开始时间 -->
                <el-form-item
                  :label="$translateTitle('task.starttime') + ':'"
                  prop="basedata.info.starttime"
                >
                  <el-date-picker
                    v-model="task_form.basedata.info.starttime"
                    type="datetime"
                    value-format="timestamp"
                  />
                </el-form-item>
                <!-- 结束时间： -->
                <el-form-item
                  :label="$translateTitle('task.endttime') + ':'"
                  prop="basedata.info.endtime"
                >
                  <el-date-picker
                    v-model="task_form.basedata.info.endtime"
                    type="datetime"
                    value-format="timestamp"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple" />
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <!-- <el-form-item label="测试台体" prop="bedname"> -->
                <el-form-item
                  :label="$translateTitle('product.testplatform')"
                  prop="bedname"
                >
                  <el-select
                    v-model="task_form.basedata.info.devInfo.name"
                    style="width: 100%"
                    :placeholder="
                      $translateTitle('task.Select') +
                      $translateTitle('product.testplatform')
                    "
                    @change="changeBed"
                  >
                    <!-- item.objectId -->
                    <el-option
                      v-for="(item, index) in testbedlist"
                      :key="index"
                      :label="item.name"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <!-- <el-form-item label="任务模板" prop="bedname"> -->
                <el-form-item
                  :label="$translateTitle('task.Tasktemplate')"
                  prop="bedname"
                >
                  <el-input v-model="task_form.basedata.info.inspnumber" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add_taskdialog = false">
            <!-- 取消 -->
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="submiTask('task_form')">
            <!-- 确定 -->
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div class="inspection">
      <el-tabs type="border-card">
        <!-- <el-tab-pane :label="'审核中(' + total + ')'"> -->
        <!-- $translateTitle('product.Underreview') -->
        <el-tab-pane
          :label="$translateTitle('product.Underreview') + '(' + total + ')'"
        >
          <el-row>
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="12" style="text-align: right">
              <p>
                <el-button
                  type="primary"
                  size="medium"
                  icon="el-icon-plus"
                  @click="add_taskdialog = true"
                >
                  <!-- 新增任务 -->
                  {{ $translateTitle('product.Newtasks') }}
                </el-button>
              </p>
            </el-col>
          </el-row>

          <div class="tasklist">
            <el-table :data="taskList.undoneData" stripe border>
              <el-table-column type="index" label="id" />
              <!-- <el-table-column label="任务模板" align="center" prop="basedata.inspection_number" /> -->

              <!-- <el-table-column
                label="检验/试验编号"
                align="center"
                prop="basedata.inspection_number"
              > -->
              <el-table-column
                :label="$translateTitle('product.Inspectiontestnumber')"
                align="center"
                prop="basedata.inspection_number"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="name"
                :label="$translateTitle('task.Taskname')"
                align="center"
              />
              <!-- 报告模板 -->
              <el-table-column
                prop="basedata.insectionName"
                :label="$translateTitle('developer.Reporttemplate')"
                align="center"
              />
              <!-- 测试台体 -->
              <el-table-column
                prop="basedata.bedname"
                :label="$translateTitle('product.testplatform')"
                align="center"
                width="150"
              />
              <!-- 开始时间 -->
              <el-table-column
                :label="$translateTitle('task.starttime')"
                prop="$timestampToTime(scope.row.basedata.starttime)}"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.starttime) }}
                  </span>
                </template>
              </el-table-column>
              <!-- 结束时间 -->
              <el-table-column
                :label="$translateTitle('task.endtime')"
                prop="$timestampToTime(scope.row.basedata.endtime)}"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.endtime) }}
                  </span>
                </template>
              </el-table-column>
              <!-- 创建日期 -->
              <el-table-column
                :label="$translateTitle('application.createtime')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                  </span>
                </template>
              </el-table-column>

              <!-- <el-table-column label="状态" align="center" width="160"> -->
              <el-table-column
                :label="$translateTitle('equipment.state')"
                align="center"
                width="160"
              >
                <template slot-scope="scope">
                  <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                  <span v-if="scope.row.basedata.verifyStatus > 0">
                    <!-- {{
                      ['', '审核通过', '审核不通过'][
                        scope.row.basedata.verifyStatus
                      ]
                    }} -->
                    {{
                      [
                        '',
                        $translateTitle('product.Approved'),
                        $translateTitle('product.notapproved'),
                      ][scope.row.basedata.verifyStatus]
                    }}
                  </span>

                  <span v-else>
                    <!-- {{
                      ['未开始', '正在测试', '测试完成'][
                        scope.row.basedata.testStatus
                      ] || '未测试'
                    }} -->
                    {{
                      [
                        $translateTitle('product.notstarted'),
                        $translateTitle('product.testing'),
                        $translateTitle('product.finishtest'),
                      ][scope.row.basedata.testStatus] ||
                      $translateTitle('product.notested')
                    }}
                  </span>
                </template>
              </el-table-column>

              <!-- <el-table-column align="center" label="报告操作" width="240"> -->
              <el-table-column
                align="center"
                :label="$translateTitle('product.Reportoperation')"
                width="240"
              >
                <template slot-scope="scope">
                  <!-- <span v-if="userRoles.org_type != '中心厂家检测员' "> -->
                  <el-button
                    v-show="scope.row.basedata.testStatus == 1"
                    type="success"
                    size="mini"
                    @click="clientView(scope.row, scope.$index)"
                  >
                    <!-- 取证 -->
                    {{ $translateTitle('product.obtainevidence') }}
                  </el-button>

                  <el-button
                    v-show="scope.row.basedata.testStatus == 2"
                    :disabled="!scope.row.basedata.hasReport"
                    type="success"
                    style="margin-left: 20px"
                    size="mini"
                    @click="stepfun(scope.row)"
                  >
                    <!-- 导出 -->
                    {{ $translateTitle('product.export') }}
                  </el-button>

                  <el-button
                    v-show="scope.row.basedata.testStatus == 0"
                    size="mini"
                    @click="showTaskStartBox(scope.row)"
                  >
                    <!-- 开始 -->
                    {{ $translateTitle('task.start') }}
                  </el-button>

                  <!-- testStatus = 2 代表完成 -->

                  <el-button
                    v-show="
                      scope.row.basedata.testStatus > 0 &&
                      scope.row.basedata.testStatus < 2
                    "
                    type="primary"
                    size="mini"
                    @click="beforeFinish(scope.row)"
                  >
                    <!-- 完成 -->
                    {{ $translateTitle('product.finish') }}
                  </el-button>

                  <!-- <el-tooltip
                    class="item"
                    effect="dark"
                    content="生成报告以后才能导出"
                    placement="top-start"
                  > -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      $translateTitle(
                        'product.Reportgenerationcannotbeexported'
                      )
                    "
                    placement="top-start"
                  >
                    <el-button
                      v-show="scope.row.basedata.testStatus == 2"
                      size="mini"
                      icon="el-icon-document"
                      @click="beforGetTestReport(scope.row)"
                    >
                      <!-- 报告 -->
                      {{ $translateTitle('product.report') }}
                    </el-button>
                  </el-tooltip>

                  <!-- </span> -->
                </template>
              </el-table-column>

              <el-table-column width="320" align="center">
                <template slot-scope="scope">
                  <el-dropdown>
                    <el-button size="small">
                      <!-- 更多操作 -->
                      {{ $translateTitle('task.moreoperations') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :disabled="scope.row.basedata.testStatus == 2"
                        @click.native="editorClient(scope.row)"
                      >
                        <!-- 编辑 -->
                        {{ $translateTitle('developer.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="deleteClient(scope.row.objectId)"
                      >
                        <!-- 删除 -->
                        {{ $translateTitle('developer.delete') }}
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="examineVerify(scope.row)"
                      >
                        <!-- 详情 -->
                        {{ $translateTitle('product.details') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
              <el-pagination
                :page-sizes="pageSizes"
                :page-size="pagesize"
                :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane
          :label="$translateTitle('product.finishreview') + '(' + total1 + ')'"
        >
          <el-table :data="taskList.doneData" stripe border>
            <el-table-column type="index" label="id" />
            <!-- <el-table-column label="任务模板" align="center" prop="basedata.inspection_number" /> -->

            <el-table-column
              :label="$translateTitle('product.Inspectiontestnumber')"
              align="center"
              prop="basedata.inspection_number"
            >
              <template slot-scope="scope">
                <span>
                  {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                </span>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="name" label="任务名称" align="center" /> -->
            <el-table-column
              prop="name"
              :label="$translateTitle('protaskduct.Taskname')"
              align="center"
            />
            <el-table-column
              prop="basedata.insectionName"
              :label="$translateTitle('developer.Reporttemplate')"
              align="center"
            />

            <el-table-column
              prop="basedata.bedname"
              :label="$translateTitle('product.testplatform')"
              align="center"
              width="150"
            />

            <el-table-column
              :label="$translateTitle('task.starttime')"
              prop="$timestampToTime(scope.row.basedata.starttime)}"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{ $timestampToTime(scope.row.basedata.starttime) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$translateTitle('task.endtime')"
              prop="$timestampToTime(scope.row.basedata.endtime)}"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{ $timestampToTime(scope.row.basedata.endtime) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$translateTitle('application.createtime')"
              align="center"
            >
              <template slot-scope="scope">
                <span>
                  {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="状态" align="center" width="160">
              <template slot-scope="scope">
                <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                <span v-if="scope.row.basedata.verifyStatus > 0">
                  {{
                    [
                      '',
                      $translateTitle('product.Approved'),
                      $translateTitle('product.notapproved'),
                    ][scope.row.basedata.verifyStatus]
                  }}
                </span>

                <span v-else>
                  {{
                    [
                      $translateTitle('product.notstarted'),
                      $translateTitle('product.testing'),
                      $translateTitle('product.finishtest'),
                    ][scope.row.basedata.testStatus] ||
                    $translateTitle('product.notested')
                  }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              v-if="userRoles.org_type != '中心厂家检测员'"
              :label="$translateTitle('product.Dataoperation')"
              width="320"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteClient(scope.row.objectId)"
                >
                  <!-- 删除 -->
                  {{ $translateTitle('developer.delete') }}
                </el-button>

                <el-button
                  type="success"
                  style="margin-left: 20px"
                  size="mini"
                  @click="stepfun(scope.row)"
                >
                  <!-- 导出 -->
                  {{ $translateTitle('product.export') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px">
            <el-pagination
              :page-sizes="pageSizes"
              :page-size="pagesize"
              :total="total1"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import {
    queryDevice,
    getDevice,
    editDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  import { queryProduct } from '@/api/Product'
  export default {
    name: 'Insection',
    components: {},
    data() {
      return {
        productId: '',
        testbedlist: [],
        groupList: ['南方泵业', '利欧泵业'],
        reportList: [], // 报告模板
        task_form: {
          basedata: {
            info: {
              identification: 'pump', // 标识
              testStatus: 0, // 0 未开始 1 正在测试, 2 测试完成,
              verifyStatus: 0, // 0 未审核 1 审核通过 2 审核不通过
              testContent: {
                name: '',
                config: '',
                objectId: '',
              }, // 报告模板信息
              inspnumber: '', // 任务模板
              devInfo: {
                name: '',
                config: '',
                objectId: '',
              }, // 测试台体信息
              starttime: new Date().getTime(),
              endtime: new Date().getTime() + 3600 * 1000 * 24 * 2, // 设置为两天后
            },
            config: {},
            docxInfo: {},
            startDox: false,
            templateUrl: '',
            reportconfig: [],
          },
          name: '', // 任务名称
          reportId: '',
          devaddr: '',
          detail: {},
          route: {},
          status: 'OFFLINE',
          isEnable: false,
        },
        formRule: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          bedIndex: [
            { required: true, message: '请选择测试台体', trigger: 'change' },
          ],
          'basedata.info.testContent.name': [
            { required: true, message: '请选择报告模板', trigger: 'change' },
          ],
          'basedata.info.endtime': [
            { required: true, message: '请选择结束时间', trigger: 'change' },
          ],
          'basedata.info.starttime': [
            { required: true, message: '请选择开始时间', trigger: 'change' },
          ],
        },
        add_taskdialog: false,
        taskList: {
          undoneData: [],
          doneData: [],
        },
        pagesize: 10,
        start: 0,
        total: 0,
        standard: {},
        taskdialog: false,
        pagesize1: 10,
        start1: 0,
        total1: 0,
        dialogtext: '新增',
        setTop: '3vh',
        flag: false,
        showStep: false,
        active: 0,
        exportRow: {},
        importList: [],
        currentImportPage: 1,
        importDataBox: false,
        currentRow: {},
        currentResultRow: {},
        beforFinishBox: false,
        resultList: [],
        finishRow: {},
        fileimportDialog: false,
        datatableAll: [],

        datatableResult: [],
        xssdtableResult: [],
        qssdtableResult: [],
        allResultList: [],
        allResultListIndex: 0,

        testDataBox: false,
        finishConfirmDialog: false,
        resTempArray: [],
        testResult: {},
        activeStep: 1,
        imgArr: [],
        reportIdArr: [],
        tempObj: [],
        DeviceObj: [],
        fileList: [],
        dialogUpZip: false,
        upLoading: false,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1,
        PageSize: 10,
        totalCount: 0,
        taskStartForm: {
          starttime: '',
          endtime: '',
        },
        userRoles: {},
      }
    },
    computed: {
      ...mapGetters({
        role: 'acl/role',
      }),
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
      hostUrl: function () {
        if (this.$globalConfig.serverURL.substr(0, 1) == '/') {
          return window.location.origin
        } else {
          return this.$globalConfig.serverURL.replace(/\/iotapi/g, '')
        }
      },
    },
    mounted() {
      this.userRoles = this.role
      this.getTestBedDevices()
      this.getTasktable()
      this.getStandard()
    },
    methods: {
      // 提交任务报告
      submiTask(form) {
        console.log(form, this.$aclObj)
        console.log(this.task_form)

        // const {} = this.task_form
        const paramsObj = {
          ACL: this.$aclObj,
          basedata: this.task_form.basedata,
          detail: this.task_form.detail,
          route: this.task_form.route,
          isEnable: this.task_form.isEnable,
          name: this.task_form.name,
          status: this.task_form.status,
          devaddr: this.task_form.name,
          product: {
            __type: 'Pointer',
            className: 'Product',
            objectId: this.productId,
          },
        }
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            const res = await postDevice(paramsObj)
            if (res) {
              this.$message({
                type: 'success',
                mesaage: '新建设备成功',
              })
              this.getTasktable()
              this.add_taskdialog = false
            } else {
              this.$message({
                type: 'success',
                mesaage: '新建设备失败,请检查参数',
              })
            }
          }
        })
      },
      async getStandard() {
        const params = {
          where: {
            // category: 'Evidence',
            // nodeType: 1,
          },
          order: '-updatedAt', // -updatedAt  updatedAt
        }

        const { results } = await queryProduct(params)
        this.reportList = results
      },
      async getTestBedDevices() {
        let params = {
          include: 'product',
          order: '-createdAt',
          where: {},
        }
        const { results = [] } = await queryDevice(params)
        if (results) {
          this.testbedlist = results.filter((item) => {
            if (item.product) {
              return item.product.devType == 'shuwa_iot_hub'
              // return item.product.devType
            }
          })
          this.selectedBedItem = this.testbedlist[0]
        }
      },
      changeReport(index) {
        console.log(index)
        this.selectedInsectionItem = this.reportList[index]
        this.task_form.basedata.info.testContent.name =
          this.reportList[index].name
        this.task_form.basedata.info.testContent.objectId =
          this.reportList[index].objectId
      },
      changeBed(index) {
        this.selectedBedItem = this.testbedlist[index]
        console.log(this.testbedlist[index])
        this.productId = this.testbedlist[index].product.objectId
        this.task_form.basedata.info.devInfo.name = this.testbedlist[index].name
        this.task_form.basedata.info.devInfo.objectId =
          this.testbedlist[index].objectId
        console.log(
          '  this.productId ',
          this.productId,
          this.task_form.basedata.info.devInfo.name
        )
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      changeHandle() {
        this.$refs.upload.submit()
      },
      handleUploadFile(params) {
        // 取出上传文件的扩展名
        var fileName = params.file.name
        var index = fileName.lastIndexOf('.')
        var ext = fileName.substr(index + 1)
        if (ext === 'zip') {
          this.upLoading = true
          const formdata = new FormData()
          formdata.append('file', params.file)
          formdata.append('output', 'json')
          formdata.append('path', this.$Cookies.get('appids'))
          formdata.append('scene', this.$Cookies.get('appids'))
          formdata.append('auth_token', this.$Cookies.get('access_token_pump')) // 下面是要传递的参数
          this.$http
            .post(this.$Cookies.get('fileserver'), formdata, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => {
              const src = this.$objGet(res, 'body.src')
              if (src) {
                this.$axiosWen
                  .put('/report', {
                    path: src,
                  })
                  .then((res) => {
                    this.fileList = []
                    this.upLoading = false
                    this.$message({
                      message: '文件导入成功',
                      type: 'success',
                    })
                    this.dialogUpZip = false
                    this.getTasktable()
                  })
              } else {
                this.upLoading = false
                this.$message({
                  message: '文件导入失败',
                })
              }
            })
        } else {
          this.$message.warning('只能上传zip结尾的文件')
          this.fileList = []
        }
      },
      examineVerify(row) {
        this.$store.commit('updateCurrentTask', row)
        this.$router.push({
          path: '/inspection/examineVerify',
          query: {
            taskid: row.objectId,
          },
        })
      },
      goNext() {
        this.allResultListIndex += 1
      },

      goPrev() {
        this.allResultListIndex -= 1
      },
      showTaskStartBox(row) {
        this.finishRow = row

        this.taskStartForm.starttime = this.finishRow.basedata.starttime
        this.taskStartForm.endtime = this.finishRow.basedata.endtime

        this.taskStartDialog = true
      },
      beforeStartTestTask() {
        this.$refs['taskStartFormRef'].validate((valid) => {
          if (valid) {
            this.startTestTask()
          }
        })
      },
      startTestTask() {
        // console.log(this.finishRow)
        // return false
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .put('/task', {
            appdata: {
              reportId: this.finishRow.objectId,
            },
            // channelId: "H5JTFwdCwT", //通过get_task 获取 可不传
            end_time: this.$utc2beijing(this.taskStartForm.endtime), // "2020-08-28 10:35:10",
            start_time: this.$utc2beijing(this.taskStartForm.starttime), // "2020-03-26 10:35:10",
            // vcaddr: this.finishRow.devaddr //台体地址
            vcaddr: this.finishRow.basedata.bedaddr, // 台体地址
          })
          .then((response) => {
            if (response) {
              console.log({
                mesaage: 'task 操作成功',
              })
              this.taskStartDialog = false
              this.updateTaskStatus()
            }
            loading.close()
          })
          .catch((err) => {
            console.log({
              mesaage: 'task 操作失败',
            })
            loading.close()
          })
      },
      updateTaskStatus() {
        // 更新状态

        const postData = {
          basedata: this.finishRow.basedata,
        }

        postData.basedata.testStatus = 1 // 测试中
        this.$axiosWen
          .put('iotapi/classes/Device/' + this.finishRow.objectId, postData)
          .then((response) => {
            this.triviaHandle('更新', response)
          })
      },
      updateReportStatus() {
        // 更新是否已经生成报告的状态
        const postData = {
          basedata: this.finishRow.basedata,
        }
        // postData.reportdoc,postData.reportpdf
        this.testReportUrl = this.finishRow.basedata.reportdoc
        console.log('this.testReportUrl', this.testReportUrl)
        postData.basedata.hasReport = true // 已经生成报告
        this.$axiosWen
          .put('iotapi/classes/Device/' + this.finishRow.objectId, postData)
          .then((response) => {
            this.getTasktable()
          })
      },
      beforeFinish(row) {
        console.log(row)
        this.finishRow = row
        /*      var where = {
        test_number: this.$objGet(this.finishRow, "basedata.BasicInfo.bianhao")
      }; */
        var databaseId =
          this.$objGet(this.finishRow, 'basedata.BasicInfo.databaseId') + ''
        var where = {
          reportid: this.$objGet(this.finishRow, 'basedata.BasicInfo.bianhao'),
        }

        if (!databaseId) {
          this.goFinish()
          // 如果获取不到databaseId 就直接设置报告操作为完成
          // this.$message({
          //   message: '没有数据库ID',
          //   offset: 500,
          //   duration: 1000
          // })

          return
        }

        /* let product_name = this.$objGet(this.finishRow,'basedata.BasicInfo.name')
      if(product_name){
          where.product_name = product_name
      } */

        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        // .get("/pump_result/3997​",{

        // path 必须是字符串 否则会被浏览器转义 !!

        this.$axiosWen
          .get('/pump_result/' + databaseId, {
            params: {
              reportid: this.$objGet(
                this.finishRow,
                'basedata.BasicInfo.bianhao'
              ),
            },
          })
          .then((res) => {
            // this.beforFinishBox = true;
            loading.close()

            // datatable，xssdtable，qssdtable

            this.testResult = res.test_result

            var datatableResult = [],
              xssdtableResult = [],
              qssdtableResult = []

            if (res) {
              if (res.datatable) {
                datatableResult = res.datatable
              }
              if (res.xssdtable) {
                xssdtableResult = res.xssdtable
              }
              if (res.qssdtable) {
                qssdtableResult = res.qssdtable
              }
              var allResultListTemp = [
                ...datatableResult,
                ...xssdtableResult,
                ...qssdtableResult,
              ]

              // allResultListTemp = allResultListTemp.reverse()
              // JSON.parse(JSON.stringify( allResultListTemp))

              this.allResultList = allResultListTemp.reverse()

              if (this.allResultList.length > 0) {
                this.showTestDataBox()
              } else {
                this.$message({
                  message: '未找到实验数据',
                })
              }
            } else {
              this.allResultList = []
            }
          })
          .catch(() => {
            this.$message({
              message: '接口异常',
            })
            loading.close()
          })

        // 表

        // this.currentRow.datatable

        // datatable: "d20200722134205"
      },
      getDataTable() {
        this.$axiosWen
          .get('iotapi/classes/pump/' + this.currentRow.datatable, {
            params: {
              order: '-id',
              skip: 0,
              limit: 10000,
            },
          })
          .then((res) => {
            if (res && res.results) {
              this.datatableAll = res.results
            } else {
              this.datatableAll = []
            }
          })
      },
      getfileName(upath) {
        const file_name = upath.replace(/(.*\/)*([^.]+).*/gi, '$2')

        const fileExt = upath.replace(/.+\./, '')

        // JSON.stringify

        // var fileExtension = upath.substring(upath.lastIndexOf('.') + 1);

        return file_name + '.' + fileExt
      },
      goFinish() {
        // 更新状态

        const postData = {
          basedata: this.finishRow.basedata,
        }
        postData.basedata.testStatus = 2 // 已完成

        try {
          var currentResultRow = this.allResultList[this.allResultListIndex]

          switch (currentResultRow.name.replace(/[0-9]/gi, '')) {
            case 'data':
              postData.basedata.datatable = currentResultRow.data
              break
            case 'xssd':
              postData.basedata.xssdtable = currentResultRow.data
              break
            case 'qssd':
              postData.basedata.qssdtable = currentResultRow.data
              break
            default:
              break
          }
        } catch (error) {
          this.$message({
            message: '数据处理有误',
          })
        }

        // postData.basedata.ReportResult = this.currentResultRow;

        this.$axiosWen
          .put('iotapi/classes/Device/' + this.finishRow.objectId, postData)
          .then((response) => {
            this.testDataBox = false
            this.finishConfirmDialog = false
            this.triviaHandle('更新', response)

            this.stopTask()
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      stopTask() {
        this.$axiosWen
          .delete('/task/' + this.finishRow.devaddr)
          .then((response) => {
            if (response) {
              console.log({
                mesaage: 'task 已停止 ',
              })
            }
            loading.close()
          })
          .catch((err) => {
            console.log({
              mesaage: 'task 停止失败',
            })
            loading.close()
          })
      },
      taskExport() {
        this.classname = 'Device' // Product , Evidence

        const postData = {}

        this.$axiosWen({
          url: '/export_data?classname=' + this.exportObj.classname,
          method: 'post',
          responseType: 'blob',
          data: postData,
        }).then((response) => {
          this.download(response)
        })
      },
      taskImport() {
        // this.$refs.fileInt.click();
        this.dialogUpZip = true
      },
      // 下载文件
      download(data) {
        if (!data) {
          return
        }
        this.fileDownloadDialog = true

        const url = window.URL.createObjectURL(new Blob([data]))

        this.downloadUrl = url

        this.$nextTick(() => {
          this.$refs['downLink'].click()
        })
      },
      typeTestHandleClose() {
        console.log('typeTestDialog close')

        this.typeTestDialog = false
      },
      // 初始化实验室
      getDepartmentLaboratory(val, laboratoryid, testbedid) {
        // eslint-disable-next-line no-undef
        var Department = Parse.Object.extend('PumpDepartment')
        // eslint-disable-next-line no-undef
        var department = new Parse.Query(Department)
        department.equalTo('org_type', '实验室')
        department.equalTo('ParentId', val)
        department.find().then((resultes) => {
          this.departmentlaboratory = resultes
          if (laboratoryid) {
            this.laboratorySelect(laboratoryid, testbedid)
          }
        })
      },
      // 得到泵单位
      getDepartmentPump() {
        // eslint-disable-next-line no-undef
        var Department = Parse.Object.extend('PumpDepartment')
        // eslint-disable-next-line no-undef
        var department = new Parse.Query(Department)
        department.equalTo('org_type', '泵单位')
        department.find().then((resultes) => {
          this.departmentpump = resultes
        })
      },
      // 检测单位选择,并取相应的实验室列表
      pumpDepartmentSelect(val, laboratoryid, testbedid) {
        this.departmentpump.map((item) => {
          if (item.id == val) {
            this.departmentname = item.attributes.name
          }
        })
        this.getDepartmentLaboratory(val, laboratoryid, testbedid)
      },
      getLaboratoryAndCompany() {
        this.$axiosWen
          .get('iotapi/classes/Authentication', {
            params: {
              where: {
                status: 'Pass',
              },
            },
          })
          .then((response) => {
            if (response) {
              var list = response.results
              /*   var list = response.results.filter((item) => {
                      return (item.auditDateFMT != undefined && item.auditDateFMT !='')
                    });   */
              list.forEach((item, index, arr) => {
                // this.LaboAndComList.push = response.results
                // 检验单位列表push
                if (item.empower) {
                  this.departmentpump.push({
                    id: item.empower.businessname,
                    name: item.empower.businessname,
                  })
                }
              })
            }
          })

        this.$axiosWen.get('iotapi/classes/Laboratory').then((response) => {
          if (response) {
            var list = response.results
            list.forEach((item, index, arr) => {
              if (item.laboratory) {
                // 实验室列表push
                this.departmentlaboratory.push({
                  id: item.objectId,
                  name: item.laboratory.name,
                })
              }
            })
          }
        })
      },
      async getTasktable(issearch) {
        if (issearch == 0) {
          this.start = 0
        }
        // eslint-disable-next-line no-unused-vars
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })
        let params = {
          // include: "product",
          order: '-createdAt',
          // key:'',
          where: { 'basedata.info.identification': 'pump' },
        }
        const { results } = await queryDevice(params)
        loading.close()
        if (results.length) {
          const undoneData = []
          const doneData = []
          results.forEach((item) => {
            if (item.basedata.info.verifyStatus) {
              doneData.push(item)
            } else {
              undoneData.push(item)
            }
          })
          console.log(doneData)
          console.log(doneData)
          this.taskList.undoneData = undoneData
          this.taskList.doneData = doneData
        } else {
          this.taskList = []
        }

        this.total = this.taskList.undoneData
          ? this.taskList.undoneData.length
          : 0
        this.totalCount = this.taskList.undoneData
          ? this.taskList.undoneData.length
          : 0
        this.total1 = this.taskList.doneData ? this.taskList.doneData.length : 0
        console.log(this.taskList)
      },
      handleSizeChange(val) {
        this.PageSize = val
        this.currentPage = 1
      },
      handleCurrentChange(val) {
        this.currentPage = val
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 已结束任务
      getTasktableEnded(issearch) {
        if (issearch == 0) {
          this.start = 0
        }
      },
      // 编辑任务
      editorClient(row) {
        this.reportTaskid = row.objectId
      },
      triviaHandle(text, response) {
        if (response) {
          this.$message({
            message: text + '成功',
            type: 'success',
          })
          // this.$refs[formName].resetFields();
          this.taskdialog = false
          this.getTasktable()
        } else {
          this.$message(text + '失败')
        }
      },
      // 时间校验
      enddata() {
        if (this.lookupFormOngoing.endtime <= this.lookupFormOoing.starttime) {
          this.$message.warning('任务结束时间要小于开始时间')
          this.lookupFormOngoing.endtime = ''
        }
        if (this.lookupFormOngoing.endtime < Date.now() - 2000) {
          this.$message.warning('任务结束时间要大于当前时间')
          this.lookupFormOngoing.endtime = ''
        }
      },
      testdata() {
        if (
          this.lookupFormOngoing.endtime <= this.lookupFormOngoing.starttime &&
          this.lookupFormOngoing.endtime != '' &&
          this.lookupFormOngoing.endtime != null
        ) {
          this.$message.warning('任务开始时间要小于结束时间')
          this.lookupFormOngoing.starttime = ''
        }
        if (this.lookupFormOngoing.starttime < Date.now() - 2000) {
          this.$message.warning('任务开始时间要大于当前时间')
          this.lookupFormOngoing.starttime = ''
        }
      },
      deleteClient(reportId) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await delDevice(reportId)
          this.$message({
            type: 'warning',
            message: '已删除这条数据',
          })
          setTimeout(() => {
            this.getTasktable()
          }, 1000)
        })
      },
      clientView(row, index) {
        // 上传照片,绘制不是在这里
        // #topoUrl
        if (this.$globalConfig.serverURL.substr(0, 1) == '/') {
          var topoUrl = window.location.origin + '/spa'
        } else {
          var topoUrl = this.$globalConfig.localTopoUrl
        }

        window.open(
          `${topoUrl}/#/portal?reportTask=${row.objectId}&index=${index}`,
          '_blank'
        )
      },
      beforGetTestReport(row) {
        this.finishRow = row
        this.testReportUrl = ''
        this.testReportDialog = true
        this.currentObjectId = row.objectId
      },
      stepfun(row) {
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .get('/report', {
            params: {
              id: row.objectId,
            },
          })
          .then((res) => {
            if (res && res.url) {
              const linkTemp = document.createElement('a')
              linkTemp.style.display = 'none'
              var fileName = ''
              const resUrl = res.url
              linkTemp.href = this.fileDomain + resUrl.split('1250')[1]
              console.log('fileUrl', linkTemp.href)
              console.log('fileDomain', this.fileDomain)
              linkTemp.setAttribute('download', fileName)
              document.body.appendChild(linkTemp)
              linkTemp.click()
              document.body.removeChild(linkTemp)
            } else {
              this.$message({
                message: '导出失败',
              })
            }
            loading.close()
          })
          .catch((err) => {
            loading.close()
            console.log('err /report ', err)
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .inspection {
    box-sizing: border-box;
    min-height: 875px;
    background-size: cover;
  }

  .inspection .el-dropdown-link {
    cursor: pointer;
    /* color: #409EFF; */
  }

  pre {
    padding: 5px;
    outline: 1px solid #ccc;
  }
  table.test-result {
    width: 100%;
    text-align: center;

    tr {
      line-height: 28px;
    }
  }

  .inspection .el-select {
    width: 100%;
  }

  .inspection .el-date-editor.el-input {
    width: 100%;
  }

  .inspection .el-form--inline .el-date-editor.el-input {
    width: 100%;
  }

  .inspection .el-cascader {
    width: 100%;
  }

  .inspection .el-divider__text.is-left {
    font-size: 16px;
    color: blue;
  }

  a.report-link {
    color: #409eff;
  }

  a.report-link:hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 1350px) {
    .inspection .el-col {
      width: 100%;
    }
  }

  .inspection .el-dialog__body {
    padding: 10px 20px;
  }
</style>
