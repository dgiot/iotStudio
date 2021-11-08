<template>
  <el-container>
    <el-aside
      v-show="treeState"
      width="300px"
    >
      <RoleTree ref="roleTreeRef" />
    </el-aside>
    <el-main>
      <div class="inspection">
        <el-tabs type="border-card">
          <el-tab-pane :label="'审核中(' + total + ')'">
            <el-row>
              <el-col :span="12">
&nbsp;
              </el-col>
              <el-col
                :span="12"
                style="text-align: right"
              />
            </el-row>

            <div class="tasklist">
              <el-table
                border
                :data="
                  taskList.undoneData.slice(
                    (currentPage - 1) * PageSize,
                    currentPage * PageSize
                  )
                "
                stripe
              >
                <el-table-column
                  label="id"
                  type="index"
                />

                <el-table-column
                  align="center"
                  label="检验/试验编号"
                  prop="basedata.inspection_number"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="任务名称"
                  prop="name"
                />

                <el-table-column
                  align="center"
                  label="质检项目"
                  prop="basedata.insectionName"
                />

                <el-table-column
                  align="center"
                  label="测试台体"
                  prop="basedata.bedname"
                  width="150"
                />

                <el-table-column
                  align="center"
                  label="开始时间"
                  prop="$timestampToTime(scope.row.basedata.starttime)}"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $timestampToTime(scope.row.basedata.starttime) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="结束时间"
                  prop="$timestampToTime(scope.row.basedata.endtime)}"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $timestampToTime(scope.row.basedata.endtime) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="创建日期"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="状态"
                  width="160"
                >
                  <template slot-scope="scope">
                    <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                    <span v-if="scope.row.basedata.verifyStatus > 0">
                      {{
                        ['', '审核通过', '审核不通过'][
                          scope.row.basedata.verifyStatus
                        ]
                      }}
                    </span>

                    <span v-else>
                      {{
                        ['未测试', '正在测试', '待审核'][
                          scope.row.basedata.testStatus
                        ] || '未测试'
                      }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="报告操作"
                  width="200"
                >
                  <template slot-scope="scope">
                    <!-- testStatus = 1代表完成 , 为了排列整齐 开始以后,完成按钮一直显示, 状态不等于1 就禁用 -->

                    <el-button
                      :disabled="scope.row.basedata.testStatus != 2"
                      icon="el-icon-document"
                      size="mini"
                      type="success"
                      @click="beforGetTestReport(scope.row.objectId, scope.row)"
                    >
                      下载报告
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="数据操作"
                  width="320"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click="evidenceView(scope.row)"
                    >
                      查 证
                    </el-button>

                    <el-button
                      size="small"
                      type="primary"
                      @click="examineVerify(scope.row)"
                    >
                      审 核
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div style="margin-top: 20px">
                <el-pagination
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-size="pagesize"
                  :page-sizes="pageSizes"
                  :total="totalCount"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="'审核完成(' + total1 + ')'">
            <el-table
              border
              :data="
                taskList.doneData.slice(
                  (currentPage - 1) * PageSize,
                  currentPage * PageSize
                )
              "
              stripe
            >
              <el-table-column
                label="id"
                type="index"
              />

              <el-table-column
                align="center"
                label="检验/试验编号"
                prop="basedata.inspection_number"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="任务名称"
                prop="name"
                width="150"
              />

              <el-table-column
                align="center"
                label="质检项目"
                prop="basedata.insectionName"
                width="200"
              />

              <el-table-column
                align="center"
                label="测试台体"
                prop="basedata.bedname"
                width="150"
              />

              <el-table-column
                align="center"
                label="开始时间"
                prop="$timestampToTime(scope.row.basedata.starttime)}"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.starttime) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="结束时间"
                prop="$timestampToTime(scope.row.basedata.endtime)}"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.endtime) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="创建日期"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="状态"
                width="160"
              >
                <template slot-scope="scope">
                  <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                  <span v-if="scope.row.basedata.verifyStatus > 0">
                    {{
                      ['', '审核通过', '审核不通过'][
                        scope.row.basedata.verifyStatus
                      ]
                    }}
                  </span>

                  <span v-else>
                    {{
                      ['未测试', '正在测试', '待审核'][
                        scope.row.basedata.testStatus
                      ] || '未测试'
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="报告操作"
                width="200"
              >
                <template slot-scope="scope">
                  <!-- testStatus = 1代表完成 , 为了排列整齐 开始以后,完成按钮一直显示, 状态不等于1 就禁用 -->

                  <el-button
                    :disabled="scope.row.basedata.testStatus != 2"
                    icon="el-icon-document"
                    size="mini"
                    type="success"
                    @click="beforGetTestReport(scope.row.objectId, scope.row)"
                  >
                    下载报告
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="数据操作"
                width="320"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="evidenceView(scope.row)"
                  >
                    查 证
                  </el-button>

                  <el-button
                    size="small"
                    type="primary"
                    @click="examineVerify(scope.row)"
                  >
                    审 核
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="pagesize"
                :page-sizes="pageSizes"
                :total="total1"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-dialog
          :append-to-body="true"
          :close-on-click-modal="false"
          title="测试报告生成"
          :visible.sync="testReportDialog"
          width="40%"
        >
          <el-form
            class="demo-form-inline"
            :inline="true"
            :model="exportObj"
          >
            <el-form-item label="报告语言">
              <el-select v-model="exportObj.lang">
                <el-option
                  label="中文"
                  value="zh"
                />
                <el-option
                  label="英文"
                  value="en"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click.native="getTestReport"
              >
                确定
              </el-button>
            </el-form-item>
          </el-form>

          <p style="text-align: center">
            <a
              v-show="testReportUrl && testReportUrl.length > 0"
              ref="downLink"
              class="report-link"
              :download="getfileName(testReportUrl)"
              :href="hostUrl + testReportUrl"
            >
              {{ getfileName(testReportUrl) }}
            </a>
            <br />
            <br />
          </p>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import { mapGetters } from 'vuex'

  import RoleTree from '@/views/platform/tasktlist/pumplist/RoleTree'

  export default {
    name: 'ExamineList',
    components: {
      RoleTree,
    },
    data() {
      return {
        reportRow: {},
        pumpusetype: [
          '计量泵',
          '给水泵',
          '排水泵',
          '疏水泵',
          '喷灌泵',
          '增压泵',
          '排污泵',
        ],
        pumpmodel: [
          '离心泵',
          '潜水泵',
          '混流泵',
          '螺杆泵',
          '轴流泵',
          '旋涡泵',
          '电动泵',
          '蒸汽泵',
          '齿轮泵',
          '罗茨泵',
          '滑片泵',
          '喷射泵',
          '升液泵',
          '电磁泵',
        ],
        lookupFormOngoing: {
          user: '',
          region: '',
          name: '',
          department: '',
          standard: '',
          factory: '',
          starttime: '',
          endtime: '',
        },
        taskList: {
          undoneData: [],
          doneData: [],
        },
        pagesize: 10,
        start: 0,
        total: 0,
        standard: {},
        addDetectionTaskform: {},
        pickerOptionsStart: {
          disabledDate: (time) => {
            const endDateVal = this.lookupFormOngoing.endtime
            if (endDateVal) {
              return (
                time.getTime() > new Date(endDateVal).getTime() ||
                time.getTime() < Date.now() - 8.64e7
              )
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          },
        },

        pickerOptionsEnd1: {
          disabledDate: (time) => {
            const beginDateVal = this.lookupFormOngoing.starttime
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              )
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          },
        },
        endedtaskList: [],
        pagesize1: 10,
        start1: 0,
        total1: 0,
        dialogtext: '新增',
        lookupFormEnded: {
          user: '',
          region: '',
          name: '',
          department: '',
          standard: '',
          factory: '',
          starttime: '',
          endtime: '',
        },
        modulelist: [], // 检测标准列表
        reportTaskid: '', // 编辑时的任务ID
        departmentname: '', // 单位名称
        laboratoryname: '', // 实验室名称

        departmentpump: [], // 泵单位列表
        departmentlaboratory: [], // 实验室列表
        activeTab: 'basicInfo',
        importData: {
          id: '', // 20120516
        },
        classname: '',
        downloadUrl: '',
        testReportUrl: '',
        fileDownloadDialog: false,
        testReportDialog: false,
        exportObj: {
          classname: '',
          options: ['Device', 'Product', 'Evidence'],
          lang: 'zh',
          radioValue: 'Product',
          radioNum: 0,
          radioOption: [
            { text: '1. 质检项目', id: 'Product', num: 0 },
            { text: '2. 质检任务', id: 'Device', num: 1 },
            { text: '3. 取证数据', id: 'Evidence', num: 2 },
            { text: '4. 取证文件', id: 'File', num: 3 },
          ],
        },
        type: 'Evidence',
        paramsObj: {},
        fullscreen: false,
        setWidth: '70%',
        setHeight: '60%',
        setTop: '3vh',
        flag: false,
        showStep: false,
        active: 0,
        exportRow: {},
        importList: [],
        currentImportPage: 1,
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
        resTempArray: [],
        testResult: {},

        imgArr: [],
        reportIdArr: [],
        tempObj: [],
        upLoading: false,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1,
        PageSize: 10,
        totalCount: 0,
      }
    },
    computed: {
      ...mapGetters(['treeState']),
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
      // currentTestData: {
      //   set() {},
      //   get() {
      //     if (this.allResultList && this.allResultList.length > 0) {
      //       this.resTempArray = this.allResultList[this.allResultListIndex][
      //         'data'
      //       ]
      //     }
      //     eventBus.$emit('itemChange', this.resTempArray)

      //     return this.resTempArray
      //   },
      // },
    },
    created() {},
    mounted() {
      console.log('hostUrl ###', this.hostUrl)

      this.getTasktable()
    },
    methods: {
      beforeStartTestTask() {
        this.$refs['taskStartFormRef'].validate((valid) => {
          if (valid) {
            this.startTestTask()
          }
        })
      },
      startTestTask() {
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
            vcaddr: this.finishRow.devaddr, // 台体地址
          })
          .then((response) => {
            if (response) {
              console.log({ mesaage: 'task 操作成功' })
              this.updateTaskStatus()
            }
            loading.close()
          })
          .catch((err) => {
            console.log({ mesaage: 'task 操作失败' })
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
          .put('/classes/Device/' + this.finishRow.objectId, postData)
          .then((response) => {
            this.triviaHandle('更新', response)
          })
      },
      getDataTable() {
        this.$axiosWen
          .get('/classes/pump/' + this.currentRow.datatable, {
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
      stopTask() {
        this.$axiosWen
          .delete('/task/' + this.finishRow.devaddr)
          .then((response) => {
            if (response) {
              console.log({ mesaage: 'task 已停止 ' })
            }
            loading.close()
          })
          .catch((err) => {
            console.log({ mesaage: 'task 停止失败' })
            loading.close()
          })
      },
      getLaboratoryAndCompany() {
        this.$axiosWen
          .get('/classes/Authentication', {
            params: {
              where: { status: 'Pass' },
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

        this.$axiosWen.get('/classes/Laboratory').then((response) => {
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
      getTasktable(issearch) {
        if (issearch == 0) {
          this.start = 0
        }
        // eslint-disable-next-line no-unused-vars
        const where = {}
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        where['basedata.identifier'] = 'inspectionReportTemp'

        this.$axiosWen
          .get('/classes/Device', {
            params: {
              // include: "product",
              order: '-createdAt',
              // key:'',
              where: JSON.stringify(where),
            },
          })
          .then((response) => {
            loading.close()
            if (response && response.results) {
              const res = response.results
              const undoneData = []
              const doneData = []
              res.forEach((item) => {
                if (item.basedata.verifyStatus) {
                  doneData.push(item)
                } else {
                  undoneData.push(item)
                }
              })
              this.taskList.undoneData = undoneData
              this.taskList.doneData = doneData
            } else {
              this.taskList = []
            }
            this.total = this.taskList.undoneData.length
            this.totalCount = this.taskList.undoneData.length
            this.total1 = this.taskList.doneData.length
          })
          // eslint-disable-next-line handle-callback-err
          .catch((err) => {
            loading.close()
          })
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
      taskDetail(id, testbedid) {
        this.$router.push({
          path: '/inspection/reportdetail',
          query: {
            id: id,
            testbedid: testbedid,
          },
        })
      },
      handleCurrentImportChange(data) {
        this.currentRow = data
      },
      handleCurrentResultChange(data) {
        this.currentResultRow = data
      },
      triviaHandle(text, response) {
        if (response) {
          this.$message({
            message: text + '成功',
            type: 'success',
          })
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
      clientView(row, index) {
        var vm = this

        const where = {
          status: row.id,
        }
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
      evidenceView(row) {
        this.$store.commit('updateCurrentTask', row)
        this.$router.push({
          path: '/inspection/verify',
          query: {
            taskid: row.objectId,
          },
        })
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
      beforGetTestReport(objectId, row) {
        this.reportRow = row
        this.testReportUrl = ''
        this.testReportDialog = true
        this.currentObjectId = objectId
      },
      changeHandle() {
        this.$refs.upload.submit()
      },
      getTestReport() {
        console.log(this.testReportDialog, this.exportRow)
      },
      // objectId
      // getTestReport() {
      //   const loading = this.$loading({
      //     background: "rgba(0, 0, 0, 0.5)"
      //   });

      //   this.$axiosWen
      //     .get("/pump_report/" + this.currentObjectId, {
      //       params: {
      //         lang: this.exportObj.lang // en
      //       },
      //       timeout: 16000
      //     })
      //     .then(res => {
      //       loading.close();
      //       if (res) {
      //         this.testReportUrl = res.path;
      //       }
      //     })
      //     .catch(() => {
      //       loading.close();
      //     });
      // },
      createTempLink(res) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = window.URL.createObjectURL(new Blob([res]))
        link.setAttribute('download', 'excel.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      handleFullScreen(flag) {
        this.flag = !flag
        if (this.flag) {
          this.setWidth = '100%'
          this.setHeight = document.body.clientWidth + 'px'
          this.setTop = '0'
          this.$refs.dialog.$el.getElementsByClassName(
            'el-dialog'
          )[0].style.height = '100%'
        } else {
          this.setWidth = '70%'
          this.setHeight = '60%'
          this.setTop = '3vh'
          this.$refs.dialog.$el.getElementsByClassName(
            'el-dialog'
          )[0].style.height = this.$refs.dialog.$el.style.height
        }
      },
    },
  }
</script>
<style scope>
  .inspection {
    box-sizing: border-box;
    min-height: 875px;
    padding: 20px;
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
</style>
<style lang="scss">
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
