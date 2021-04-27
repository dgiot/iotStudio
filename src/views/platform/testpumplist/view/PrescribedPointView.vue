<template>
  <div class="prescribedPoint">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->
    <el-form ref="formRef" :inline="true" :model="prescribedPointForm" disabled>
      <el-row>
        <el-col :span="20">
          <div>
            <el-form-item label="测试点个数">
              <el-select v-model="prescribedPointForm.point">
                <el-option v-for="i in 20" :key="i" :label="i" :value="i" />
              </el-select>
            </el-form-item>
          </div>

          <div>
            <el-radio v-model="averagePoint" label="flow">
              流量作为均分点
            </el-radio>
          </div>

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

            <el-button
              :disabled="averagePoint == 'lift' || !prescribedPointForm.point"
              type="primary"
              size="small"
              @click="average()"
            >
              流量均分
            </el-button>
          </el-row>

          <div>
            <el-radio v-model="averagePoint" label="lift">
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

            <el-button
              :disabled="averagePoint == 'flow' || !prescribedPointForm.point"
              type="primary"
              size="small"
              @click="average()"
            >
              扬程均分
            </el-button>
          </el-row>

          <div>
            <el-form-item label="额定转速">
              <el-input v-model="prescribedPointForm.rpm" size="small">
                <template slot="append">(r/min)</template>
              </el-input>
            </el-form-item>
          </div>

          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(小流量)：">
                <el-input v-model="prescribedPointForm.Q1" size="small">
                  <template slot="append">m/s</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input v-model="prescribedPointForm.H1" size="small">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input v-model="prescribedPointForm.zhougv1" size="small">
                  <template slot="append">W</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input v-model="prescribedPointForm.xiaolv1" size="small" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input v-model="prescribedPointForm.qishi1" size="small">
                  <template slot="append">M</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(额定流量)： ">
                <el-input v-model="prescribedPointForm.Q2" size="small">
                  <template slot="append">m/s</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input v-model="prescribedPointForm.H2" size="small">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input v-model="prescribedPointForm.zhougv2" size="small">
                  <template slot="append">W</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input v-model="prescribedPointForm.xiaolv2" size="small" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input v-model="prescribedPointForm.qishi2" size="small">
                  <template slot="append">M</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <el-form-item label="规定流量(大流量)：">
                <el-input v-model="prescribedPointForm.Q3" size="small">
                  <template slot="append">m/s</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="规定扬程：">
                <el-input v-model="prescribedPointForm.H3" size="small">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="轴功率：">
                <el-input v-model="prescribedPointForm.zhougv3" size="small">
                  <template slot="append">W</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="效率：">
                <el-input v-model="prescribedPointForm.xiaolv3" size="small" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="气蚀余量：">
                <el-input v-model="prescribedPointForm.qishi3" size="small">
                  <template slot="append">M</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 均分点信息 -->

        <el-col :span="4">
          <h3 style="text-align: center">均分点信息</h3>

          <el-table :data="pointDataArr" style="width: 100%">
            <el-table-column lable="序号" type="index" />
            <el-table-column
              v-if="averagePoint == 'flow'"
              property="flow"
              label="Q(1/s)"
            />
            <el-table-column
              v-if="averagePoint == 'lift'"
              property="lift"
              label="h(m)"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import { eventBus } from '@/api/eventBus'

  export default {
    name: 'PrescribedPoint',
    data() {
      return {
        prescribedPointForm: {
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
        },
        pointDataArr: [],
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
      eventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      eventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['formRef'].resetFields()
        console.log('data ###  ', data)
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
        console.log('prescribedPointForm ###  ', datas)

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

          Q2: this.prescribedPointForm.Q2,
          H2: this.prescribedPointForm.H2,
          zhougv2: this.prescribedPointForm.zhougv2,
          xiaolv2: this.prescribedPointForm.xiaolv2,
          qishi2: this.prescribedPointForm.qishi2,
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
