<template>
  <div class="TestSetting">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="TestSettingObj"
      label-width="120px"
    >
      <el-row>
        <el-col :span="8">
          <p>检测精度</p>
          <el-radio
            v-model="TestSettingObj.BasicSetting.testPrecision"
            label="1"
          >
            一级
          </el-radio>
          <el-radio
            v-model="TestSettingObj.BasicSetting.testPrecision"
            label="2"
          >
            二级
          </el-radio>
          <el-radio
            v-model="TestSettingObj.BasicSetting.testPrecision"
            label="3"
          >
            三级
          </el-radio>
        </el-col>
      </el-row>

      <el-divider content-position="left" style="color: blue">
        合格条件设置
      </el-divider>

      <el-row :gutter="24">
        <el-col :span="3">
          <p>容差级别</p>

          <el-select
            v-model="TestSettingObj.BasicSetting.dengji_test"
            size="small"
            placeholder="请选择"
            @change="toleranceChange"
          >
            <el-option
              v-for="(item, index) in levelOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-form-item label="合格条件">
            <el-select
              v-model="qConditions"
              allow-create
              @change="qConditionsChange"
            >
              <el-option label="GB/T3216-2016" value="GB/T3216-2016" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <div class="num-wrap">
            <span class="txt-label">tQ:</span>
            <input
              v-model="curentConditonObj.tQz"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
            <span class="txt-label">tH:</span>

            <input
              v-model="curentConditonObj.tHf"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
            <span class="txt-label">t η:</span>

            <input
              v-model="curentConditonObj.tp_up"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
          </div>

          <div class="num-wrap">
            <span class="txt-label">tQ:</span>

            <input
              v-model="curentConditonObj.tq_down"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
            <span class="txt-label">tH:</span>

            <input
              v-model="curentConditonObj.th_down"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
            <span class="txt-label">t η:</span>

            <input
              v-model="curentConditonObj.te_down"
              :disabled="qConditions != 'other'"
              class="num-inp"
              type="number"
            />
            % &nbsp;&nbsp;
          </div>
        </el-col>
      </el-row>

      <el-divider content-position="left" style="color: blue">
        稳定条件设置
      </el-divider>

      <el-row>
        <el-form-item label="流量,扬程,效率">
          <el-select
            v-model="TestSettingObj.StabilitySetting.FlowHeadEfficiency"
            allow-create
          >
            <el-option label="GB/T3216-2016" value="GB/T3216-2016" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="转速">
          <el-select v-model="TestSettingObj.StabilitySetting.Speed">
            <el-option label="GB/T3216-2016" value="GB/T3216-2016" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-row>

      <el-divider content-position="left" style="color: blue">
        波动范围设置
      </el-divider>

      <el-row>
        <el-form-item label="波动范围当前值">
          <el-input
            v-model="TestSettingObj.FluctuationSetting.CurrentValue"
            type="text"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-form-item label="波动范围设定值">
          <el-input
            v-model="TestSettingObj.FluctuationSetting.SetValue"
            type="text"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

        <el-button size="small">同步</el-button>
      </el-row>

      <el-divider content-position="left" style="color: blue">
        参数设置
      </el-divider>
      <el-row>
        <!-- <el-col :span="12"> -->
        <el-form-item label="重力加速度">
          <el-input
            v-model="TestSettingObj.ParameterSetting.GravitationalAcceleration"
            size="small"
          />
        </el-form-item>
        <!-- </el-col> -->

        <el-form-item label="进水管阻力损失">
          <el-input
            v-model="TestSettingObj.ParameterSetting.InletPipeResistanceLoss"
            size="small"
          />
        </el-form-item>

        <el-form-item label="潜水泵安装高度">
          <el-input
            v-model="TestSettingObj.ParameterSetting.HeightOfSubmersiblePump"
            size="small"
          />
        </el-form-item>

        <el-form-item label="平均次数">
          <el-input
            v-model="TestSettingObj.ParameterSetting.AverageNumber"
            size="small"
          />
        </el-form-item>

        <el-form-item label="采集周期">
          <el-input
            v-model="TestSettingObj.ParameterSetting.AcquisitionCycle"
            size="small"
          />
        </el-form-item>
      </el-row>

      <el-row>
        <el-checkbox
          v-model="TestSettingObj.ParameterSetting.RemoveMaxMinGetAverage"
        >
          去最大值,最小值求平均值
        </el-checkbox>
        <el-checkbox v-model="TestSettingObj.ParameterSetting.SumAverage">
          和值求平均
        </el-checkbox>
      </el-row>

      <el-row>
        <div>
          <p>转速换算公式</p>

          <el-radio
            v-model="TestSettingObj.FormulaSetting.SpeedConversionFormula"
            label="GB/t3216-2016"
          >
            GB/t3216-2016
          </el-radio>
          <el-radio
            v-model="TestSettingObj.FormulaSetting.SpeedConversionFormula"
            label="other"
          >
            其他
          </el-radio>
        </div>

        <!--         <div>
          Q1/Q2 =
          <input type="number" /> +
          <input type="number" /> n1/n2
          <br />H1/H2 =
          <input type="number" /> +
          <input type="number" /> n1/n2 +
          <input type="number" /> (n1/n2)^2
          <br />P1/P2 =
          <input type="number" /> +
          <input type="number" /> n1/n2 +
          <input type="number" /> (n1/n2)^2 +
          <input type="number" /> (n1/n2)^3
          <br />

          <br />
        </div>-->
      </el-row>
    </el-form>
  </div>
</template>
<script>
  // import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'TestSetting',
    data() {
      return {
        test: 'aaaa',
        TestSettingObj: {
          BasicSetting: {
            testPrecision: '1',
            dengji_test: '2U',
          },
          FormulaSetting: {
            SpeedConversionFormula: 'GB/t3216-2016',
          },
          ParameterSetting: {
            RemoveMaxMinGetAverage: false,
            SumAverage: false,
          },
          StabilitySetting: {
            FlowHeadEfficiency: 'GB/T3216-2016',
            Speed: 'GB/T3216-2016',
          },
          QualifiedConditionsSetting: {
            QualifiedConditions: 'GB/T3216-2016',
          },
          FluctuationSetting: {},
        },
        qConditions: 'GB/T3216-2016',
        toleranceList: {
          '1U': {
            tHf: 0.06,
            th_down: 0.0,
            tQz: 0.1,
            tq_down: 0.0,
            tp_up: 0.1,
            te_down: 0.0,
          },
          '1E': {
            tHf: 0.03,
            th_down: -0.03,
            tQz: 0.05,
            tq_down: -0.05,
            tp_up: 0.04,
            te_down: 0.0,
          },
          '1B': {
            tHf: 0.03,
            th_down: -0.03,
            tQz: 0.05,
            tq_down: -0.05,
            tp_up: 0.04,
            te_down: -0.03,
          },
          '2B': {
            tHf: 0.05,
            th_down: -0.05,
            tQz: 0.08,
            tq_down: -0.08,
            tp_up: 0.08,
            te_down: -0.05,
          },
          '2U': {
            tHf: 0.1,
            th_down: 0.0,
            tQz: 0.16,
            tq_down: 0.0,
            tp_up: 0.16,
            te_down: -0.05,
          },
          '3B': {
            tHf: 0.07,
            th_down: -0.07,
            tQz: 0.09,
            tq_down: -0.09,
            tp_up: 0.09,
            te_down: -0.07,
          },
        },
        curentConditonObj: {},
      }
    },
    computed: {
      taskid: function () {
        return this.$route.query.taskid
      },
      levelOptions: function () {
        var tempArr = []

        /*       switch (this.TestSettingObj.BasicSetting.testPrecision) {
        case "1":
          tempArr = ["1U", "1B", "1E"];
          break;
        case "2":
          tempArr = ["2U", "2B"];
          break;
        case "3":
          tempArr = ["3B"];
          break;
        default:
          break;
      }
 */
        return ['1U', '1B', '1E', '2U', '2B', '3B']
      },
      /*    curentConditonObj :function() {
      return this.toleranceList[this.TestSettingObj.BasicSetting.dengji_test];
    }, */
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    created() {},
    mounted() {
      this.curentConditonObj = this.toleranceList['2U']
      this.$baseEventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      this.$baseEventBus.$off('taskdialog')
    },
    methods: {
      toleranceChange(val) {
        this.curentConditonObj = JSON.parse(
          JSON.stringify(this.toleranceList[val])
        )
      },
      qConditionsChange(val) {
        if (val != 'other') {
          this.curentConditonObj = JSON.parse(
            JSON.stringify(
              this.toleranceList[this.TestSettingObj.BasicSetting.dengji_test]
            )
          )
        }
      },
      resetForm(data) {
        this.$refs['formRef'].resetFields()
        console.log('data ###  南方本业', data)
      },
      fillFormData(datas) {
        console.log(datas, 'datas')
        Object.assign(this.TestSettingObj, datas)
      },
      getFormData() {
        return {
          BasicSetting: {
            testPrecision: this.TestSettingObj.BasicSetting.testPrecision,
            dengji_test: this.TestSettingObj.BasicSetting.dengji_test,
            AcceptParam: this.curentConditonObj,
          },
          FormulaSetting: this.TestSettingObj.FormulaSetting,
          ParameterSetting: this.TestSettingObj.ParameterSetting,
          StabilitySetting: this.TestSettingObj.StabilitySetting,
          QualifiedConditionsSetting:
            this.TestSettingObj.QualifiedConditionsSetting,
        }
      },
    },
  }
</script>
<style lang="scss">
  .TestSetting .num-inp {
    width: 80px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  div .num-wrap {
    margin: 15px;
  }
  div .txt-label {
    display: inline-block;
    width: 70px;
    text-align: right;
  }
</style>
