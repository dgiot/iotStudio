<template>
  <div class="prescribedPoint">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->
    <el-form
      ref="prescribedPointForm"
      :inline="true"
      :model="prescribedPointForm"
      :rules="formRule"
      size="mini"
    >
      <el-row>
        <el-col :span="24">
          <div>
            <el-form-item label="测试点个数">
              <el-select
                v-model="prescribedPointForm.point"
                placeholder="请选择个数"
              >
                <el-option
                  v-for="i in 20"
                  :key="i"
                  :label="i"
                  :value="i"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-radio
                v-model="averagePoint"
                label="flow"
              >
                流量作为均分点
              </el-radio>

              <el-row>
                <el-form-item label="最小流量">
                  <el-input
                    v-model="prescribedPointForm.zuixiaoliuliang"
                    :disabled="averagePoint == 'lift'"
                    size="small"
                  />
                </el-form-item>

                <el-form-item label="最大流量">
                  <el-input
                    v-model="prescribedPointForm.zuidaliuliang"
                    :disabled="averagePoint == 'lift'"
                    size="small"
                  />
                </el-form-item>

                <!-- <el-button
                :disabled="averagePoint == 'lift' || !prescribedPointForm.point"
                type="primary"
                size="small"
                @click="average()"
              >流量均分</el-button> -->
              </el-row>
            </el-col>
            <el-col :span="12">
              <div>
                <el-radio
                  v-model="averagePoint"
                  label="lift"
                >
                  扬程作为均分点
                </el-radio>
              </div>

              <el-row>
                <el-form-item label="最小扬程">
                  <el-input
                    v-model="prescribedPointForm.zuixiaoyangcheng"
                    :disabled="averagePoint == 'flow'"
                    size="small"
                  />
                </el-form-item>

                <el-form-item label="最大扬程">
                  <el-input
                    v-model="prescribedPointForm.zuidayangcheng"
                    :disabled="averagePoint == 'flow'"
                    size="small"
                  />
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-divider>规定流量（小流量）</el-divider>

          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(小流量)：">
                <el-input
                  v-model="prescribedPointForm.edllxlll"
                  size="small"
                >
                  <template slot="append">
                    m/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input
                  v-model="prescribedPointForm.edllgdyc"
                  size="small"
                >
                  <template slot="append">
                    mm
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input
                  v-model="prescribedPointForm.edllzhougv1"
                  size="small"
                >
                  <template slot="append">
                    W
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input
                  v-model="prescribedPointForm.edllxiaolv1"
                  size="small"
                />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input
                  v-model="prescribedPointForm.edllqishi1"
                  size="small"
                >
                  <template slot="append">
                    M
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item label="额定转速：">
                <el-input
                  v-model="prescribedPointForm.edllzs"
                  size="small"
                >
                  <template slot="append">
                    m/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="轴承温升">
                <el-input
                  v-model="prescribedPointForm.edllzcws"
                  size="small"
                >
                  <template slot="append">
                    ℃
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="振动">
                <el-input
                  v-model="prescribedPointForm.edllzd"
                  size="small"
                >
                  <template slot="append">
                    mm/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="噪声">
                <el-input
                  v-model="prescribedPointForm.edllzsheng"
                  size="small"
                >
                  <template slot="append">
                    dB(A)
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>额定流量</el-divider>
          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(额定流量)： ">
                <el-input
                  v-model="prescribedPointForm.edllxlll2"
                  size="small"
                >
                  <template slot="append">
                    m/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input
                  v-model="prescribedPointForm.edllgdyc2"
                  size="small"
                >
                  <template slot="append">
                    mm
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input
                  v-model="prescribedPointForm.edllzhougv12"
                  size="small"
                >
                  <template slot="append">
                    W
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input
                  v-model="prescribedPointForm.edllxiaolv12"
                  size="small"
                />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input
                  v-model="prescribedPointForm.edllqishi12"
                  size="small"
                >
                  <template slot="append">
                    M
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="额定转速：">
                <el-input
                  v-model="prescribedPointForm.edllzs2"
                  size="small"
                >
                  <template slot="append">
                    m/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="轴承温升">
                <el-input
                  v-model="prescribedPointForm.edllzcws2"
                  size="small"
                >
                  <template slot="append">
                    ℃
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="振动">
                <el-input
                  v-model="prescribedPointForm.edllzd2"
                  size="small"
                >
                  <template slot="append">
                    mm/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="噪声">
                <el-input
                  v-model="prescribedPointForm.edllzsheng2"
                  size="small"
                >
                  <template slot="append">
                    dB(A)
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>规定流量（大流量）</el-divider>
          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(大流量)：">
                <el-input
                  v-model="prescribedPointForm.edllxlll3"
                  size="small"
                >
                  <template slot="append">
                    m/s
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input
                  v-model="prescribedPointForm.edllgdyc3"
                  size="small"
                >
                  <template slot="append">
                    mm
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input
                  v-model="prescribedPointForm.edllzhougv13"
                  size="small"
                >
                  <template slot="append">
                    W
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input
                  v-model="prescribedPointForm.edllxiaolv13"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input
                  v-model="prescribedPointForm.edllqishi13"
                  size="small"
                >
                  <template slot="append">
                    M
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="4">
          <el-form-item label="额定转速：">
            <el-input
              v-model="prescribedPointForm.edllzs3"
              size="small"
            >
              <template slot="append">
                m/s
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="轴承温升">
            <el-input
              v-model="prescribedPointForm.edllzcws3"
              size="small"
            >
              <template slot="append">
                ℃
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="振动">
            <el-input
              v-model="prescribedPointForm.edllzd3"
              size="small"
            >
              <template slot="append">
                mm/s
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="噪声">
            <el-input
              v-model="prescribedPointForm.edllzsheng3"
              size="small"
            >
              <template slot="append">
                dB(A)
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <!-- 均分点信息 -->

        <!-- <el-col :span="6">
          <h3 style="text-align:center;">均分点信息</h3>

          <el-table :data="pointDataArr" style="width: 100%">
            <el-table-column lable="序号" type="index"/>
            <el-table-column v-if="averagePoint == 'flow'" property="flow" label="Q(1/s)"/>
            <el-table-column v-if="averagePoint == 'lift'" property="lift" label="h(m)"/>
          </el-table>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'SouthPrescribedPoint',
    data() {
      return {
        prescribedPointForm: {
          edllxlll: '', // 额定流量,小流量
          edllgdyc: '', // 额定流量规定扬尘
          edllzhougv1: '', // 额定流量轴功率
          edllxiaolv1: '', // 额定流量效率
          edllqishi1: '', // 额定流量气蚀余量：
          edllzs: '', // 额定流量转速
          edllzcws: '', // 额定流量轴承温升
          edllzd: '', // 额定流量震动
          edllzsheng: '', // 额定流量噪声

          edllxlll2: '', // 额定流量,小流量
          edllgdyc2: '', // 额定流量规定扬尘
          edllzhougv12: '', // 额定流量轴功率
          edllxiaolv12: '', // 额定流量效率
          edllqishi12: '', // 额定流量气蚀余量：
          edllzs2: '', // 额定流量转速
          edllzcws2: '', // 额定流量轴承温升
          edllzd2: '', // 额定流量震动
          edllzsheng2: '', // 额定流量噪声

          edllxlll3: '', // 额定流量,小流量
          edllgdyc3: '', // 额定流量规定扬尘
          edllzhougv13: '', // 额定流量轴功率
          edllxiaolv13: '', // 额定流量效率
          edllqishi13: '', // 额定流量气蚀余量：
          edllzs3: '', // 额定流量转速
          edllzcws3: '', // 额定流量轴承温升
          edllzd3: '', // 额定流量震动
          edllzsheng3: '', // 额定流量噪声

          rpm: '',
          point: '',
          Q1: '',
          H1: '',
          zhougv1: '',
          xiaolv1: '',
          qishi1: '',
          Q2: '',
          H2: '',
          zhougv2: '',
          xiaolv2: '',
          qishi2: '',
          Q3: '',
          H3: '',
          zhougv3: '',
          xiaolv3: '',
          qishi3: '',
          glysG: '',
          glysRC: '',
          NpshG: '',
          NpRC: '',
          temzcG: '',
          tR: '',
          zhendongG: '',
          DJXL: '',
        },
        pointDataArr: [],
        formRule: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur',
            },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
        },
        averagePoint: 'flow',
      }
    },
    computed: {
      taskid: function () {
        return this.$route.query.taskid
      },
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    created() {},
    mounted() {
      this.$baseEventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      this.$baseEventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['prescribedPointForm'].resetFields()
        console.log('data ###  南方本业', data)
      },
      average() {
        var pointCount = this.prescribedPointForm.point

        switch (this.averagePoint) {
          // 流量
          case 'flow':
            var max = this.prescribedPointForm.zuidaliuliang
            var min = this.prescribedPointForm.zuixiaoliuliang

            break
          // 扬程
          case 'lift':
            var max = this.prescribedPointForm.zuidayangcheng
            var min = this.prescribedPointForm.zuixiaoyangcheng

            break
          default:
            break
        }

        this.pointDataArr = []

        // 不四舍五入 向下取整
        //  num = Math.floor(num * 100) / 100;

        var val2 = (max - min) / (pointCount - 1)

        for (let index = 1; index <= pointCount; index++) {
          this.pointDataArr[index - 1] = {}

          var tempVal = val2 * (index - 1) + parseFloat(min)

          this.pointDataArr[index - 1][this.averagePoint] =
            Math.floor(tempVal * 100) / 100
        }

        // console.log('this.pointDataArr',this.pointDataArr);
      },
      fillFormData(datas) {
        console.log('prescribedPointForm ### 南方泵业  ', datas)

        Object.assign(this.prescribedPointForm, datas)
      },
      getFormData() {
        // this.prescribedPointForm

        const dataObj = {
          point: this.prescribedPointForm.point,
          rpm: this.prescribedPointForm.rpm,

          Q1: this.prescribedPointForm.Q1,
          H1: this.prescribedPointForm.H1,
          zhougv1: this.prescribedPointForm.zhougv1,
          xiaolv1: this.prescribedPointForm.xiaolv1,
          qishi1: this.prescribedPointForm.qishi1,
          gddxl: this.prescribedPointForm.gddxl,
          Q2: this.prescribedPointForm.Q2,
          H2: this.prescribedPointForm.H2,
          zhougv2: this.prescribedPointForm.zhougv2,
          xiaolv2: this.prescribedPointForm.xiaolv2,
          qishi2: this.prescribedPointForm.qishi2,
          glysG: this.prescribedPointForm.glysG,
          glysRC: this.prescribedPointForm.glysRC,
          NpshG: this.prescribedPointForm.NpshG,
          NpRC: this.prescribedPointForm.NpRC,
          temzcG: this.prescribedPointForm.temzcG,
          tR: this.prescribedPointForm.tR,
          zhendongG: this.prescribedPointForm.zhendongG,
          DJXL: this.prescribedPointForm.DJXL,
          Q3: this.prescribedPointForm.Q3,
          H3: this.prescribedPointForm.H3,
          zhougv3: this.prescribedPointForm.zhougv3,
          xiaolv3: this.prescribedPointForm.xiaolv3,
          qishi3: this.prescribedPointForm.qishi3,

          pointDataArr: this.pointDataArr,
        }

        switch (this.averagePoint) {
          // 流量
          case 'flow':
            dataObj.zuidaliuliang = this.prescribedPointForm.zuidaliuliang
            dataObj.zuixiaoliuliang = this.prescribedPointForm.zuixiaoliuliang

            break
          // 扬程
          case 'lift':
            dataObj.zuidayangcheng = this.prescribedPointForm.zuidayangcheng
            dataObj.zuixiaoyangcheng = this.prescribedPointForm.zuixiaoyangcheng
            break
          default:
            break
        }
        return dataObj
      },
    },
  }
</script>
<style lang="scss"></style>
