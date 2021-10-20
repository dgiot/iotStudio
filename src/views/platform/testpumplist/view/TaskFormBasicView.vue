<template>
  <div class="TaskFormBasic">
    <!--  <table class="verify-info">
                  <tr>
                    <th>测试结果</th>
                    <th>产品名称</th>
                    <th>型号</th>
                    <th>报告号</th>
                    <th>测试项目</th>
                  </tr>

                  <tr>
                    <td>{{ addDetectionTaskform.task_name }}</td>
                    <td>{{ addDetectionTaskform.reportId }}</td>
                    <td>{{ addDetectionTaskform.endtime }}</td>
                    <td>{{ addDetectionTaskform.starttime }}</td>
                    <td>{{ addDetectionTaskform.selectDefault }}</td>
                  </tr>
    </table>
 -->

    <el-form
      ref="formRef"
      disabled
      label-width="120px"
      :model="addDetectionTaskform"
      :rules="formRule"
    >
      <el-divider
        content-position="left"
        style="color: blue"
      >
        检测任务基本信息
      </el-divider>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item
              label="任务名称："
              prop="task_name"
            >
              <el-input
                v-model="addDetectionTaskform.task_name"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 修改为新增的reportId  -->

            <!-- 该字段并不真的使用 -->
            <el-form-item
              label="质检项目"
              prop="reportId"
            >
              <el-select
                v-model="addDetectionTaskform.selectDefault"
                style="width: 100%"
                @change="changeReport"
              >
                <el-option
                  v-for="(item, index) in addDetectionTaskform.reportList"
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
            <el-form-item
              label="开始时间："
              prop="starttime"
            >
              <el-date-picker
                v-model="addDetectionTaskform.starttime"
                type="datetime"
                value-format="timestamp"
              />
            </el-form-item>

            <el-form-item
              label="结束时间："
              prop="endtime"
            >
              <el-date-picker
                v-model="addDetectionTaskform.endtime"
                type="datetime"
                value-format="timestamp"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-divider
        content-position="left"
        style="color: blue"
      >
        检测资源信息
      </el-divider>

      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple" />
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item
              label="测试台体"
              prop="bedname"
            >
              <el-select
                v-model="addDetectionTaskform.bedIndex"
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
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'TaskFormBasic',
    data() {
      return {
        test: 'aaaa',
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
        standard: {},
        addDetectionTaskform: {
          endtime: '',
          starttime: '',
          bedIndex: 0,
          entrust: '', // 请选择委托方
          entrustphone: '', // 委托人联系方式
          task_name: '',
          reportId: '',
          selectDefault: 0,

          selectedInsectionItem: {},
          selectedBedItem: {},
        },
        formRule: {
          task_name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          bedIndex: [
            { required: true, message: '请选择测试台体', trigger: 'change' },
          ],
          endtime: [
            { required: true, message: '请选择结束时间', trigger: 'change' },
          ],
          starttime: [
            { required: true, message: '请选择开始时间', trigger: 'change' },
          ],
        },
        modulelist: [], // 检测标准列表
        reportTaskid: '', // 编辑时的任务ID
        departmentname: '', // 单位名称
        laboratoryname: '', // 实验室名称

        departmentpump: [], // 泵单位列表
        departmentlaboratory: [], // 实验室列表
        testbedlist: [], // 测试台体数列
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
      this.getStandard()

      // 台体
      this.getTestBedDevices()

      this.$baseEventBus.$on('taskdialog', this.resetForm)
      this.$baseEventBus.$on('edit', this.fillEditData)
    },
    beforeDestroy() {
      this.$baseEventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['formRef'].resetFields()

        this.getStandard()
      },
      fillFormData(datas) {
        Object.assign(this.addDetectionTaskform, datas)
      },
      fillEditData(row) {
        // 循环查找index

        this.$axiosWen
          .get('iotapi/classes/Device', {
            params: {
              include: 'product',
              order: '-createdAt',
              where: {},
            },
          })
          .then((response) => {
            if (response && response.results) {
              this.testbedlist = response.results.filter((item) => {
                if (item.product) {
                  return item.product.devType == 'shuwa_iot_hub'
                  // return item.product.devType
                }
              })
              this.testbedlist.forEach((item, index) => {
                if (item.name == row.basedata.bedname) {
                  this.addDetectionTaskform.bedIndex = index
                  // break
                  return false
                }
              })
            }
          })
          .catch(function (error) {
            console.log('Device err', error)
          })

        this.addDetectionTaskform = {
          task_name: row.name,
          reportList: this.addDetectionTaskform.reportList,
          reportId: row.basedata.reportId,
          bedIndex: this.addDetectionTaskform.bedIndex,
          endtime: row.basedata.endtime,
          starttime: row.basedata.starttime,
          selectDefault: this.addDetectionTaskform.selectDefault,
        }

        /*       this.resetformula()
      const tempFormulaData = row.basedata.formula

      for (const key in tempFormulaData) {
        if (tempFormulaData.hasOwnProperty(key)) {
          this.formulaForm[key] = tempFormulaData[key]
        }
      }
       */
      },
      getFormData() {
        return new Promise((resolve, reject) => {
          this.$refs['formRef'].validate((valid) => {
            if (valid) {
              const dataObj = {
                reportId: this.selectedInsectionItem.objectId,
                insectionName: this.selectedInsectionItem.name,
                reportList: this.addDetectionTaskform.reportList,
                endtime: this.addDetectionTaskform.endtime,
                starttime: this.addDetectionTaskform.starttime,
                bedname: this.selectedBedItem.name,
                bedaddr: this.selectedBedItem.devaddr, // 台体的地址 devaddr

                devType: this.selectedInsectionItem.devType, // 非baseData
                name: this.addDetectionTaskform.task_name, // 非baseData
              }

              resolve(dataObj)
            } else {
              this.$message.error('有必填项未填写 !')
              reject(null)
            }
          })
        })
      },
      resetformula() {
        this.formulaForm = {
          n: '', // 额度转速
          density: '', // 水密度(查表)
          g: '', // 重力加速度
          d1: '', // 进口测压处管径
          d2: '', // 出口测压处管径
          z1: '', // 进口压力表中心到基准面高度
          z2: '', // 出口压力表中心到基准面高度
          c1: '', // 进口扬程修正系数
          c2: '', // 出口扬程修正系数
          c3: '', // 进口扬程损失修正系数
          C4: '', // 进口扬程损失修正系数
        }
      },
      changeReport(index) {
        this.selectedInsectionItem = this.addDetectionTaskform.reportList[index]

        /*    this.addDetectionTaskform.reportList.map(item => {
        if (item.id == val) {
          this.standard = val;
        }
      }); */
      },
      changeBed(index) {
        this.selectedBedItem = this.testbedlist[index]
      },

      getStandard() {
        /*      var InspectionStandard = Parse.Object.extend("InspectionStandard");
      var inspectionstandard = new Parse.Query(InspectionStandard);
      inspectionstandard.find().then(
        resultes => {
          if (resultes) {
            this.modulelist = resultes;
          }
        }
      );
 */
        this.$axiosWen
          .get('iotapi/classes/Product', {
            params: {
              where: {
                category: 'Evidence',
                nodeType: 1,
              },
              order: '-updatedAt', // -updatedAt  updatedAt
            },
          })
          .then((response) => {
            if (response) {
              this.addDetectionTaskform.reportList = response.results
              this.addDetectionTaskform.selectDefault = 0
              this.selectedInsectionItem = response.results[0]
            }
          })
      },
      getTestBedDevices() {
        this.$axiosWen
          .get('iotapi/classes/Device', {
            params: {
              include: 'product',
              order: '-createdAt',
              where: {},
            },
          })
          .then((response) => {
            if (response && response.results) {
              this.testbedlist = response.results.filter((item) => {
                if (item.product) {
                  return item.product.devType == 'shuwa_iot_hub'
                }
              })
              this.selectedBedItem = this.testbedlist[0]
            }
          })
          .catch(function (error) {
            console.log('Device err', error)
          })
      },
    },
  }
</script>
<style lang="scss"></style>
