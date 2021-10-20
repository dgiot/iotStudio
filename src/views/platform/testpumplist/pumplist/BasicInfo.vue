<template>
  <div class="BasicInfo">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->

    <el-form
      ref="formRef"
      :inline="true"
      label-width="68px"
      :model="BasicInfoObj"
      :rules="formRule"
      size="small"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="产品名称">
            <el-select
              v-model="BasicInfoObj.name"
              clearable
              placeholder="请选择"
              style="width: 300px"
            >
              <el-option
                v-for="item in defaultObj.productOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          class="ep0"
          :span="4"
        >
          <el-form-item label="水泵型号">
            <el-input
              v-model="BasicInfoObj.xinghao"
              class="eipt"
              style="width: 127px"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="ep0"
          :span="4"
        >
          <el-form-item label="出厂编号">
            <el-input
              v-model="BasicInfoObj.chuchangbianhao"
              class="eipt"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="ep0"
          :span="4"
        >
          <el-form-item label="试验编号">
            <el-input
              v-model="BasicInfoObj.bianhao"
              class="eipt"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="ep0"
          :span="4"
        >
          <el-form-item label="产品编号">
            <el-input
              v-model="BasicInfoObj.chanpinbianhao"
              class="eipt"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="送样单位">
            <el-select
              v-model="BasicInfoObj.songyangN"
              class="ep50"
              placeholder
            >
              <el-option
                label="利欧集团湖南泵业有限公司"
                value="shanghai"
              />
              <el-option
                label="LEO Group PUMP (HUNAN) CO , LTD"
                value="beijing"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址">
            <el-select
              v-model="BasicInfoObj.jingxiaoAddr"
              class="ep50"
              placeholder
            >
              <el-option
                label="湖南湘潭九华示范区"
                value="湖南湘潭九华示范区"
              />
              <el-option
                label
                value="Jiuhua Demonstration Area, Xiangtan, Hunan"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产单位">
            <el-select
              v-model="BasicInfoObj.shengchanN"
              class="ep50"
              placeholder
            >
              <el-option
                label="利欧集团湖南泵业有限公司"
                value="shanghai"
              />
              <el-option
                label="LEO Group PUMP (HUNAN) CO , LTD"
                value="beijing"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址">
            <el-select
              v-model="BasicInfoObj.shengchanAddr"
              class="ep50"
              placeholder
            >
              <el-option
                label="湖南湘潭九华示范区"
                value="湖南湘潭九华示范区"
              />
              <el-option
                label
                value="Jiuhua Demonstration Area, Xiangtan, Hunan"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="委托单位">
            <el-select
              v-model="BasicInfoObj.weituo"
              class="ep50"
              placeholder
            >
              <el-option
                label="利欧集团湖南泵业有限公司"
                value="shanghai"
              />
              <el-option
                label="LEO Group PUMP (HUNAN) CO , LTD"
                value="beijing"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址">
            <el-select
              v-model="BasicInfoObj.weituoAddr"
              class="ep50"
              placeholder
            >
              <el-option
                label="湖南湘潭九华示范区"
                value="湖南湘潭九华示范区"
              />
              <el-option
                label
                value="Jiuhua Demonstration Area, Xiangtan, Hunan"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="受检单位">
            <el-select v-model="BasicInfoObj.shoujianN" placeholder class="ep50">
              <el-option label="利欧集团湖南泵业有限公司" value="shanghai"/>
              <el-option label="LEO Group PUMP (HUNAN) CO , LTD" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="检验依据">
            <el-select
              v-model="BasicInfoObj.jianyanbiaozhun"
              class="ep50"
              placeholder
            >
              <el-option
                label="湖南湘潭九华示范区"
                value="湖南湘潭九华示范区"
              />
              <el-option
                label
                value="Jiuhua Demonstration Area, Xiangtan, Hunan"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抽样地点">
            <el-select
              v-model="BasicInfoObj.chouyangAddr"
              class="ep50"
              placeholder
            >
              <el-option
                label="利欧集团湖南泵业有限公司"
                value="shanghai"
              />
              <el-option
                label="LEO Group PUMP (HUNAN) CO , LTD"
                value="beijing"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽样基数">
            <el-input
              v-model="BasicInfoObj.chouyangjishu"
              class="ep50"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="beizhu">
        <el-col :span="6">
          <el-form-item label="电机规格">
            <el-input v-model="BasicInfoObj.guige" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电机效率">
            <el-input v-model="BasicInfoObj.xiaolv">
              <template slot="append">
                %
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品台数">
            <el-input v-model="BasicInfoObj.taishu" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品状态">
            <el-input v-model="BasicInfoObj.dengji" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="beizhu">
        <el-col :span="6">
          <el-form-item label="试验人员">
            <el-input v-model="BasicInfoObj.shiyanName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="试验日期">
            <el-date-picker
              v-model="BasicInfoObj.shiyanDateTime"
              format="yyyy 年 MM 月 dd 日"
              type="date"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送样人员">
            <el-input v-model="BasicInfoObj.songyangN" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="送样单位地址">
            <el-input v-model="BasicInfoObj.shengchanAddr"/>
          </el-form-item>
        </el-col> -->

        <el-col :span="6">
          <el-form-item label="送样日期">
            <el-date-picker
              v-model="BasicInfoObj.songyangDateTime"
              format="yyyy 年 MM 月 dd 日"
              type="date"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="beizhu1">
        <el-col :span="24">
          <el-form-item
            label="备注"
            style="display: block; width: 100%"
          >
            <el-input
              v-model="BasicInfoObj.beizhu"
              :autosize="{ minRows: 1, maxRows: 1 }"
              placeholder="备注"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
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
        test: 'aaaa',
        defaultObj: {
          productOpt: [
            {
              value: '中开泵',
              label: '中开泵',
            },
            {
              value: '多级泵',
              label: '多级泵',
            },
            {
              value: '斜流泵',
              label: '斜流泵',
            },
            {
              value: '长轴泵',
              label: '长轴泵',
            },
            {
              value: '渣浆泵',
              label: '渣浆泵',
            },
            {
              value: '中开多级泵',
              label: '中开多级泵',
            },
            {
              value: '液下多级泵',
              label: '液下多级泵',
            },
            {
              value: '离心泵',
              label: '离心泵',
            },
            {
              value: '多级离心泵',
              label: '多级离心泵',
            },
            {
              value: '输油管线泵',
              label: '输油管线泵',
            },
            {
              value: '立式多级泵',
              label: '立式多级泵',
            },
            {
              value: '潜水泵',
              label: '潜水泵',
            },
            {
              value: '轴流泵',
              label: '轴流泵',
            },
            {
              value: '中开泵 Axially split pump',
              label: '中开泵 Axially split pump',
            },
            {
              value: '多级泵 Multistage pump',
              label: '多级泵 Multistage pump',
            },
            {
              value: '斜流泵 Diagonal flow pump',
              label: '斜流泵 Diagonal flow pump',
            },
            {
              value: '立式长轴泵 Vertical long shaft pump',
              label: '立式长轴泵 Vertical long shaft pump',
            },
            {
              value: '脱硫泵 Desulphurization pump',
              label: '脱硫泵 Desulphurization pump',
            },
            {
              value: '渣浆泵 Slurry pump',
              label: '渣浆泵 Slurry pump',
            },
            {
              value: '中开多级泵 Intermediate stage pump',
              label: '中开多级泵 Intermediate stage pump',
            },
            {
              value: '液下多级泵 Lower level pump',
              label: '液下多级泵 Lower level pump',
            },
            {
              value: '离心泵 Centrifugal pump',
              label: '离心泵 Centrifugal pump',
            },
            {
              value: '多级离心泵 Multistage centrifugal pump',
              label: '多级离心泵 Multistage centrifugal pump',
            },
            {
              value: '输油管线泵 Pipline pump',
              label: '输油管线泵 Pipline pump',
            },
            {
              value: '立式多级泵 Vertical multistage pump',
              label: '立式多级泵 Vertical multistage pump',
            },
            {
              value: '潜水泵 Immersible pump',
              label: '潜水泵 Immersible pump',
            },
            {
              value: '轴流泵 Axial flow pump',
              label: '轴流泵 Axial flow pump',
            },
            {
              value: '混流泵 Mixed-flow pump',
              label: '混流泵 Mixed-flow pump',
            },
          ],
        },
        BasicInfoObj: {
          name: '/',
          xinghao: '/',
          chuchangbianhao: '/',
          bianhao: '/',
          chanpinbianhao: '/',
          songyangN: '/',
          jingxiaoAddr: '/',
          shengchanN: '/',
          shengchanAddr: '/',
          weituo: '/',
          weituoAddr: '/',
          // shoujianN: '',
          jianyanbiaozhun: '/',
          chouyangAddr: '/',
          chouyangjishu: '0',
          guige: '/',
          xiaolv: '/',
          taishu: '/',
          dengji: '/',
          shiyanName: '/',
          shiyanDateTime: '',
          songyangN: '/',
          shengchanAddr: '/',
          songyangDateTime: '',
          beizhu: '/',
        },
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
      this.$baseEventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      this.$baseEventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['formRef'].resetFields()
        console.log('data ###  ', data)
      },
      fillFormData(datas) {
        Object.assign(this.BasicInfoObj, datas)
      },
    },
  }
</script>
<style lang="scss">
  .BasicInfo {
    .el-textarea__inner {
      resize: none !important;
    }

    .beizhu1 .el-form-item__content {
      width: calc(100% - 95px) !important;
    }

    .beizhu .el-form-item {
      width: calc(100% - 15px) !important;
    }

    .beizhu .el-form-item .el-form-item__content {
      width: calc(100% - 80px) !important;
    }

    .el-input__inner {
      padding: 15px !important;
    }
    .el-date-editor .el-input__inner {
      padding-left: 30px !important;
    }
  }
  .ep0 {
    padding: 0 !important;
    margin: 0 !important;
  }

  .eipt {
    width: 120px;
  }

  .ep50 {
    width: 555px !important;
  }
</style>
