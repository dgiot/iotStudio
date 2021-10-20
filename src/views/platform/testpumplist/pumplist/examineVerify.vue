<template>
  <div class="examine-verify">
    <h3 style="text-align: center">
      任务详情
    </h3>
    <!--     <el-tabs v-model="activeName">
      <el-tab-pane label="审核详情" name="first"> -->
    <el-row :gutter="20">
      <el-col :span="14">
        <div>
          <TaskFormBasicView ref="TaskFormBasicRef" />
        </div>

        <div v-if="groupname == '南方泵业'">
          <el-tabs
            v-model="activeTab"
            type="card"
          >
            <el-tab-pane
              label="基本信息"
              name="basicInfoView"
            >
              <SouthBasicInfoView ref="SouthBasicInfoView" />
            </el-tab-pane>
            <el-tab-pane
              label="规定点信息"
              name="prescribedPointView"
            >
              <SouthPrescribedPointView ref="SouthPrescribedPointView" />
            </el-tab-pane>

            <el-tab-pane
              label="测试设置"
              name="TestSettingView"
            >
              <TestSettingView ref="TestSettingRef" />
            </el-tab-pane>
          </el-tabs>
        </div>

        <div v-if="groupname == '利欧泵业'">
          <el-tabs
            v-model="activeTab"
            type="card"
          >
            <el-tab-pane
              label="基本信息"
              name="basicInfoView"
            >
              <BasicInfoView ref="BasicInfoRef" />
            </el-tab-pane>
            <el-tab-pane
              label="台位信息"
              name="tableInfoView"
            >
              <TableInfoView ref="TableInfoRef" />
            </el-tab-pane>
            <el-tab-pane
              label="规定点信息"
              name="prescribedPointView"
            >
              <PrescribedPointView ref="PrescribedPointRef" />
            </el-tab-pane>

            <el-tab-pane
              label="测试设置"
              name="TestSettingView"
            >
              <TestSettingView ref="TestSettingRef" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content">
          <PerformanceDataCurveView />
        </div>

        <el-row :gutter="24">
          <el-col
            :offset="2"
            :span="20"
          >
            <div>
              <h3 style="text-align: center">
                实验数据
              </h3>
              <el-table
                ref="importListTable"
                :cell-style="headClass"
                :data="currentTestData"
                :header-cell-style="headClass"
                size="mini"
                style="width: 100%; height: 53vh"
              >
                <!-- <el-table-column prop="id" label="ID" /> -->

                <el-table-column
                  label="流量"
                  prop="Q2"
                />

                <el-table-column
                  label="扬程"
                  prop="H2"
                />
                <el-table-column
                  label="功率"
                  prop="W2"
                />
                <el-table-column
                  label="效率"
                  prop="Eff"
                />
              </el-table>
              <div
                v-show="userRoles.org_type != '中心厂家检测员'"
                style="padding: 20px; text-align: center"
              >
                <!-- size="medium" -->

                <el-button
                  :disabled="currentTestData.verifyStatus == 1"
                  plain
                  type="primary"
                  @click="gotoTopo"
                >
                  下一步
                </el-button>

                <el-button
                  :disabled="currentTestData.verifyStatus == 1"
                  plain
                  type="primary"
                  @click="examine()"
                >
                  {{
                    currentTestData.verifyStatus == 0
                      ? '未审核'
                      : currentTestData.verifyStatus == 1
                        ? '审核通过'
                        : currentTestData.verifyStatus == 2
                          ? 1
                          : '审核不通过'
                  }}
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--       </el-tab-pane>
      <el-tab-pane label="审核报告" name="second">
        <div class="tab_left">
          <el-tabs tab-position="left">
            <el-tab-pane
              v-for="item in reportArr"
              :key="item.objectId"
              :label="item.basedata.index + ''"
            >
              <div
                :style="
                {backgroundImage:'url('+fileDomain + item.basedata.layer.backgroundImage+')'}"
                class="imgBox"/>
            </el-tab-pane>
          </el-tabs>
        </div>
     </el-tab-pane>
    </el-tabs> -->

    <!--审核弹窗-->
    <el-dialog
      :append-to-body="true"
      title="审核"
      :visible.sync="verifyDialogVisible"
      width="40%"
    >
      <div>
        <el-form
          ref="verifyFormRef"
          label-width="100px"
          :model="verifyForm"
          :rules="verifyFormRules"
        >
          <el-form-item
            label="审核状态"
            prop="status"
          >
            <el-radio-group v-model="verifyForm.status">
              <!-- <el-radio :label="0">待审核</el-radio> -->
              <el-radio :label="2">
                审核未通过
              </el-radio>
              <el-radio :label="1">
                审核通过
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="审核意见"
            prop="remark"
          >
            <el-input
              v-model="verifyForm.remark"
              :rows="4"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="verifyDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="submitVerify()"
        >
          提 交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  import SouthBasicInfoView from '@/views/platform/testpumplist/view/south/BasicInfo'
  import SouthPrescribedPointView from '@/views/platform/testpumplist/view/south/PrescribedPoint'

  import BasicInfoView from '@/views/platform/testpumplist/view/BasicInfoView'
  import TableInfoView from '@/views/platform/testpumplist/view/TableInfoView'
  import PrescribedPointView from '@/views/platform/testpumplist/view/PrescribedPointView'
  import TestSettingView from '@/views/platform/testpumplist/view/TestSettingView'

  import TaskFormBasicView from '@/views/platform/testpumplist/view/TaskFormBasicView'

  import PerformanceDataCurveView from '@/views/platform/testpumplist/view/PerformanceDataCurveView'

  export default {
    name: 'ExamineVerify',
    components: {
      SouthBasicInfoView,
      SouthPrescribedPointView,
      BasicInfoView,
      TableInfoView,
      PrescribedPointView,
      TestSettingView,
      TaskFormBasicView,
      PerformanceDataCurveView,
    },
    data() {
      return {
        activeTab: 'basicInfoView',
        groupname: '',
        verifyDialogVisible: false,
        verifyForm: {
          status: 1,
          remark: '',
        },
        verifyFormRules: {
          status: [
            { required: true, message: '请选择审核状态', trigger: 'change' },
          ],
          remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
        },
        currentTestData: [],
        activeName: 'first',
        reportArr: [],
        userRoles: {},
      }
    },
    computed: {
      taskid: function () {
        return this.$route.query.taskid
      },
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
      ...mapState({
        currentTask: (state) => state.deviceData.currentTask,
      }),
    },
    created() {},
    mounted() {
      if (!this.currentTask || !this.currentTask.basedata) {
        this.$router.push({ path: '/inspection/examineVerify' })
        return
      }

      this.userRoles = JSON.parse(localStorage.getItem('roles'))

      var basedataTemp = this.currentTask.basedata

      setTimeout(() => {
        var testDataTable =
          basedataTemp.datatable ||
          basedataTemp.xssdtable ||
          basedataTemp.qssdtable

        this.$baseEventBus.$emit('testData', testDataTable)
      }, 200)

      this.fillAllTabFormFromRow(this.currentTask)
    },
    beforeDestroy() {
      // this.$baseEventBus.$off("chartClick", this.chartClickHnadle);
    },
    methods: {
      headClass() {
        return 'text-align:center'
      },
      fillAllTabFormFromRow(row) {
        this.groupname = row.basedata.groupname
          ? row.basedata.groupname
          : '利欧泵业'
        this.getReport(row.objectId)
        if (row.basedata.xssdtable == undefined) {
          row.basedata.xssdtable = []
        }
        row.basedata.xssdtable['verifyStatus'] = row.basedata.verifyStatus
        this.currentTestData = row.basedata.xssdtable
        this.$nextTick(() => {
          if (row.basedata.groupname) {
            switch (row.basedata.groupname) {
              case '南方泵业':
                this.$refs['SouthPrescribedPointView'].fillFormData(
                  row.basedata.PrescribedPoint
                )
                this.$refs['SouthBasicInfoView'].fillFormData(
                  row.basedata.BasicInfo
                )
                break
              case '利欧泵业':
                this.$refs['PrescribedPointRef'].fillFormData(
                  row.basedata.PrescribedPoint
                )
                this.$refs['BasicInfoRef'].fillFormData(row.basedata.BasicInfo)
                this.$refs['TableInfoRef'].fillFormData(row.basedata.TableInfo)
                break

              default:
                console.log(row.basedata.groupname)
                break
            }
          } else {
            this.$refs['PrescribedPointRef'].fillFormData(
              row.basedata.PrescribedPoint
            )
            this.$refs['BasicInfoRef'].fillFormData(row.basedata.BasicInfo)
            this.$refs['TableInfoRef'].fillFormData(row.basedata.TableInfo)
          }
        })

        this.$refs['TaskFormBasicRef'].fillEditData(row)
      },
      examine() {
        this.verifyDialogVisible = true
      },
      submitVerify() {
        const postData = {
          basedata: this.currentTask.basedata,
        }

        postData.basedata.verifyStatus = this.verifyForm.status
        postData.basedata.remark = this.verifyForm.remark

        console.log('postData.basedata ## ', postData.basedata)

        // return

        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })
        // 更新状态
        this.$axiosWen
          .put('/classes/Device/' + this.currentTask.objectId, postData)
          .then((response) => {
            loading.close()
            if (response) {
              this.$message({
                message: '审核成功',
                type: 'success',
              })
              this.taskdialog = false
              this.$router.push({ path: '/inspection/examineVerify' })
            } else {
              this.$message('审核失败')
            }
          })
          .catch((err) => {
            loading.close()
          })
      },
      gotoTopo() {
        // #topoUrl
        if (this.$globalConfig.serverURL.substr(0, 1) == '/') {
          var topoUrl = window.location.origin + '/spa'
        } else {
          var topoUrl = this.$globalConfig.localTopoUrl
        }

        window.open(
          `${topoUrl}/#/portal?reportTask=${this.currentTask.objectId}&index=0`,
          '_blank'
        )
      },
      // 获取检测报告
      getReport(reportId) {
        const where = {
          parentId: {
            __type: 'Pointer',
            className: 'Device',
            objectId: reportId,
          },
        }
        this.$axiosWen
          .get('/classes/Device/', {
            params: {
              where: JSON.stringify(where),
              order: 'createdAt', // -createdAt
              // order: "basedata.index"
            },
          })
          .then((res) => {
            this.reportArr = res.results
          })
          .catch((e) => {
            console.log(e)
          })
      },
    },
  }
</script>
<style lang="scss">
  .tab_left {
    height: 800px;
    ::v-deep .el-tabs--left {
      height: 100%;
      .el-tab-pane {
        height: 800px;
      }
      .el-tabs__nav-scroll {
        .is-left {
          height: 120px;
          line-height: 120px;
        }
      }
    }
  }
  .imgBox {
    width: 600px;
    height: 800px;
    background-size: 100%;
  }
  .examine-verify {
    height: 100%;
    margin: 20px;
    table.verify-info {
      width: 100%;
      text-align: center;
      border-collapse: collapse;

      tr {
        line-height: 28px;
      }
    }
  }
</style>
