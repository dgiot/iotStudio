<template>
  <div class="BasicInfo">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="TableInfoObj"
      size="small"
      disabled
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="试验台位">
            <el-select v-model="TableInfoObj.taiwei">
              <el-option
                v-for="item in defaultObj.sytw"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="试验类型">
            <el-select v-model="TableInfoObj.leixing">
              <el-option
                v-for="item in defaultObj.sylx"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="功率测量">
            <el-select v-model="TableInfoObj.Wtest">
              <el-option
                v-for="item in defaultObj.glcl"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="进口扬程算法">
            <el-row>
              <el-col :span="18">
                <el-select v-model="TableInfoObj.jinkouyangchengsuanfa">
                  <el-option
                    v-for="item in defaultObj.jcycsf"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="4" :offset="2">
                <el-checkbox v-model="TableInfoObj.shifoujieyeweiji">
                  是否接液位计
                </el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="流量测量" label-width="120px">
            <el-input v-model="TableInfoObj.Qtest" class="ipw" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="扭矩测量" label-width="120px">
            <el-input v-model="TableInfoObj.niujuceliang" class="ipw" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="转速测量" label-width="120px">
            <el-input v-model="TableInfoObj.Ntest" class="ipw" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="进口压力测量" label-width="120px">
            <el-input v-model="TableInfoObj.inputPa" class="ipw" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出口压力测量" label-width="120px">
            <el-input v-model="TableInfoObj.outputPa" class="ipw" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="振动测量" label-width="120px">
            <el-input v-model="TableInfoObj.zhendongcl" class="ipw" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="温度测量" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-input v-model="TableInfoObj.temcl" class="ipw2" />
              </el-col>
              <el-col :span="4" :offset="2">
                <el-checkbox v-model="TableInfoObj.shifoujiewenduchuanganqi">
                  是否接温度传感器
                </el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="噪声测量" label-width="120px">
            <el-input v-model="TableInfoObj.zaoshengcl" class="ipw" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="大气压力测量" label-width="120px">
            <el-input v-model="TableInfoObj.airpresscl" class="ipw" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="液位测量" label-width="120px">
            <el-input v-model="TableInfoObj.yeweicl" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="振动测量类型" label-width="120px">
            <el-select
              v-model="TableInfoObj.zhendongceliangleixing"
              clearable
              class="ipw"
            >
              <el-option
                v-for="item in defaultObj.zdcl"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                class="ipw"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="进口测压处管径">
            <el-input v-model="TableInfoObj.jinkouceyaguanjing">
              <template slot="append">mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="出口测压处管径">
            <el-input v-model="TableInfoObj.chuouceyaguanjing">
              <template slot="append">mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="检测项目">
            <el-select
              v-model="TableInfoObj.jyxm"
              clearable
              style="width: 450px"
            >
              <el-option
                v-for="item in defaultObj.jcxm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="进口压力表至基准面距离">
                <el-input v-model="TableInfoObj.jinkouyalijuli">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出口压力表至基准面距离">
                <el-input v-model="TableInfoObj.chukouyalijuli">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="泵进口直径">
                <el-input v-model="TableInfoObj.bengjinkouzhijing">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="泵出口直径">
                <el-input v-model="TableInfoObj.bengchukouzhijing">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="叶轮外径/流道宽度">
                <el-input
                  v-model="TableInfoObj.yelunwajing"
                  style="width: 140px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="叶片角度">
                <el-input
                  v-model="TableInfoObj.yepianjiaodu"
                  style="width: 140px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="介质温度">
                <el-input v-model="TableInfoObj.wendu">
                  <template slot="append">℃</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="泵的安装高度">
                <el-input v-model="TableInfoObj.hg" style="width: 180px">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="进口管损">
                <el-input v-model="TableInfoObj.hi_k" style="width: 140px" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="出口管损">
                <el-input v-model="TableInfoObj.ho_k" style="width: 210px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="叶轮出口宽度">
                <el-input
                  v-model="TableInfoObj.yeluncaizhi"
                  style="width: 180px"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="叶轮材质">
                <el-input v-model="TableInfoObj.c4" style="width: 140px" />
              </el-form-item>

              <el-form-item label="大气压力">
                <el-input v-model="TableInfoObj.daqiyali" style="width: 232px">
                  <template slot="append">MPa</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'BasicInfo',
    data() {
      return {
        defaultObj: {
          zdcl: [
            {
              value: '振动速度有效值  Vrms  mm/s',
              label: '振动速度有效值  Vrms  mm/s',
            },
            {
              value: '振幅 μm',
              label: '振幅 μm',
            },
          ],
          sytw: [
            {
              value: '1',
              label: '1',
            },
            {
              value: '2',
              label: '2',
            },
            {
              value: '3',
              label: '3',
            },
            {
              value: '4',
              label: '4',
            },
            {
              value: '5',
              label: '5',
            },
            {
              value: '6',
              label: '6',
            },
          ],
          sylx: [
            {
              value: '型式试验',
              label: '型式试验',
            },
            {
              value: '性能试验',
              label: '性能试验',
            },
          ],
          glcl: [
            {
              value: '智能电表100/5',
              label: '智能电表100/5',
            },
            {
              value: '智能电表300/5',
              label: '智能电表300/5',
            },
            {
              value: '智能电表600/5',
              label: '智能电表600/5',
            },
            {
              value: '智能电表150/5',
              label: '智能电表150/5',
            },
            {
              value: '智能电表400/5',
              label: '智能电表400/5',
            },
            {
              value: '智能电表800/5',
              label: '智能电表800/5',
            },
            {
              value: '智能电表50/5',
              label: '智能电表50/5',
            },
            {
              value: '智能电表200/5',
              label: '智能电表200/5',
            },
            {
              value: '智能电表500/5',
              label: '智能电表500/5',
            },
            {
              value: '高压宽带功率分析仪',
              label: '高压宽带功率分析仪',
            },
            {
              value: '低压宽带功率分析仪',
              label: '低压宽带功率分析仪',
            },
            {
              value: 'JW-3型扭矩仪',
              label: 'JW-3型扭矩仪',
            },
            {
              value: 'High Voltage Broadband Bower Analyzer',
              label: 'High Voltage Broadband Bower Analyzer',
            },
            {
              value: 'Low Voltage Broadband Bower Analyzer',
              label: 'Low Voltage Broadband Bower Analyzer',
            },
            {
              value: 'Jw-3 Torque Mete',
              label: 'Jw-3 Torque Mete',
            },
          ],
          jcycsf: [
            {
              value: '进口压力算法',
              label: '进口压力算法',
            },
            {
              value: '液位算法',
              label: '液位算法',
            },
            {
              value: '进口扬程为0',
              label: '进口扬程为0',
            },
          ],
          jcxm: [
            {
              value: '流量、扬程、轴功率、效率',
              label: '流量、扬程、轴功率、效率',
            },
            {
              value: '流量、扬程、轴功率、效率、汽蚀',
              label: '流量、扬程、轴功率、效率、汽蚀',
            },
            {
              value: '流量、扬程、轴功率、效率、振动、噪声',
              label: '流量、扬程、轴功率、效率、振动、噪声',
            },
            {
              value:
                'Flow, Head, Shaft Power, Efficiency, NPSH, Vibration,Noise',
              label:
                'Flow, Head, Shaft Power, Efficiency, NPSH, Vibration,Noise',
            },
          ],
          gridData: [
            {
              centigrade: '0',
              Pa: '610.86',
              density: '999.8',
            },
            {
              centigrade: '1',
              Pa: '655.97',
              density: '999.88',
            },
            {
              centigrade: '2',
              Pa: '705',
              density: '999.92',
            },
            {
              centigrade: '3',
              Pa: '756.98',
              density: '999.96',
            },
            {
              centigrade: '4',
              Pa: '811.99',
              density: '1000',
            },
            {
              centigrade: '5',
              Pa: '870.83',
              density: '999.98',
            },
            {
              centigrade: '6',
              Pa: '933.6',
              density: '999.94',
            },
            {
              centigrade: '7',
              Pa: '999.3',
              density: '999.9',
            },
            {
              centigrade: '8',
              Pa: '1069.91',
              density: '999.84',
            },
            {
              centigrade: '9',
              Pa: '1145.42',
              density: '999.78',
            },
            {
              centigrade: '10',
              Pa: '1228.78',
              density: '999.7',
            },
            {
              centigrade: '11',
              Pa: '1313.12',
              density: '999.6',
            },
            {
              centigrade: '12',
              Pa: '1403.34',
              density: '999.48',
            },
            {
              centigrade: '13',
              Pa: '1498.37',
              density: '999.34',
            },
            {
              centigrade: '14',
              Pa: '1599.47',
              density: '999.2',
            },
            {
              centigrade: '15',
              Pa: '1706.37',
              density: '999',
            },
            {
              centigrade: '16',
              Pa: '1820.12',
              density: '998.88',
            },
            {
              centigrade: '17',
              Pa: '1934.76',
              density: '998.72',
            },
            {
              centigrade: '18',
              Pa: '2068.23',
              density: '998.54',
            },
            {
              centigrade: '19',
              Pa: '2201.6',
              density: '998.36',
            },
            {
              centigrade: '20',
              Pa: '2334.88',
              density: '998.2',
            },
            {
              centigrade: '21',
              Pa: '2481.98',
              density: '997.96',
            },
            {
              centigrade: '22',
              Pa: '2641.93',
              density: '997.74',
            },
            {
              centigrade: '23',
              Pa: '2815.5',
              density: '997.54',
            },
            {
              centigrade: '24',
              Pa: '2989',
              density: '997.32',
            },
            {
              centigrade: '25',
              Pa: '3175.41',
              density: '997.1',
            },
            {
              centigrade: '26',
              Pa: '3361.74',
              density: '996.84',
            },
            {
              centigrade: '27',
              Pa: '3562.68',
              density: '996.56',
            },
            {
              centigrade: '28',
              Pa: '3775.48',
              density: '996.3',
            },
            {
              centigrade: '29',
              Pa: '4003',
              density: '996',
            },
            {
              centigrade: '30',
              Pa: '4242.28',
              density: '995.7',
            },
            {
              centigrade: '31',
              Pa: '4496.37',
              density: '995.36',
            },
            {
              centigrade: '32',
              Pa: '4763.11',
              density: '995',
            },
            {
              centigrade: '33',
              Pa: '5029.86',
              density: '994.64',
            },
            {
              centigrade: '34',
              Pa: '5322.98',
              density: '994.26',
            },
            {
              centigrade: '35',
              Pa: '5630.02',
              density: '993.9',
            },
            {
              centigrade: '36',
              Pa: '5950.71',
              density: '993.54',
            },
            {
              centigrade: '37',
              Pa: '6284.13',
              density: '993.2',
            },
            {
              centigrade: '38',
              Pa: '6631.19',
              density: '992.8',
            },
            {
              centigrade: '39',
              Pa: '7004.93',
              density: '992.44',
            },
            {
              centigrade: '40',
              Pa: '7378.56',
              density: '992.2',
            },
            {
              centigrade: '41',
              Pa: '7791.42',
              density: '991.7',
            },
            {
              centigrade: '42',
              Pa: '8205.26',
              density: '991.32',
            },
            {
              centigrade: '43',
              Pa: '8645.59',
              density: '990.94',
            },
            {
              centigrade: '44',
              Pa: '9112.39',
              density: '990.54',
            },
            {
              centigrade: '45',
              Pa: '9592.82',
              density: '990.2',
            },
            {
              centigrade: '46',
              Pa: '10099.8',
              density: '989.74',
            },
            {
              centigrade: '47',
              Pa: '10129.3',
              density: '989.34',
            },
            {
              centigrade: '48',
              Pa: '11167.9',
              density: '988.97',
            },
            {
              centigrade: '49',
              Pa: '11741.6',
              density: '988.52',
            },
            {
              centigrade: '50',
              Pa: '12341.73',
              density: '988.1',
            },
          ],
        },
        TableInfoObj: {
          taiwei: '',
          leixing: '',
          Wtest: '',
          jinkouyangchengsuanfa: '',
          shifoujieyeweiji: false,
          Qtest: '',
          niujuceliang: '',
          Ntest: '',
          inputPa: '',
          outputPa: '',
          zhendongcl: '',
          temcl: '',
          shifoujiewenduchuanganqi: false,
          zaoshengcl: '',
          airpresscl: '',
          yeweicl: '',
          zhendongceliangleixing: '',
          jinkouceyaguanjing: '',
          chuouceyaguanjing: '',
          jyxm: '',
          jinkouyalijuli: '',
          chukouyalijuli: '',
          qihuayali: '',
          bengjinkouzhijing: '',
          bengchukouzhijing: '',
          shuidemidu: '',
          yelunwajing: '',
          yepianjiaodu: '',
          wendu: '',
          daqiyali: '',
          hg: '',
          hi_k: '',
          ho_k: '',
          yelunchukoukuandu: '',
          yeluncaizhi: '',
        },
      }

      /*         n: "", // 额度转速
        density: "", // 水密度(查表)
        g: "", // 重力加速度
        d1: "", // 进口测压处管径
        d2: "", // 出口测压处管径
        z1: "", // 进口压力表中心到基准面高度
        z2: "", // 出口压力表中心到基准面高度
        c1: "", // 进口扬程修正系数
        c2: "", // 出口扬程修正系数
        c3: "", // 进口扬程损失修正系数
        C4: "", // 进口扬程损失修正系数 */
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
      this.$basethis.$baseEventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      this.$basethis.$baseEventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['formRef'].resetFields()
        console.log('data ###  ', data)
      },
      fillFormData(datas) {
        Object.assign(this.TableInfoObj, datas)
      },
      handleCurrentChange(val) {
        this.TableInfoObj['qihuayali'] = val.Pa
        this.TableInfoObj['shuidemidu'] = val.density
      },
    },
  }
</script>
<style lang="scss">
  .ipw {
    width: 300px !important;
  }
  .ipw2 {
    width: 120px !important;
  }
</style>
