<template>
  <div class="BasicInfo">
    <!-- 每个组件都只有一个form,因此表单的ref属性 不需要修改 -->

    <el-form
      ref="formRef"
      :inline="true"
      :rules="formRule"
      :model="BasicInfoObj"
      size="small"
      label-width="68px"
    >
      <el-row :gutter="24">
        <el-col :span="4">
          <el-form-item label="产品名称">
            <el-select
              v-model="BasicInfoObj.chanpinName"
              filterable
              allow-create
              default-first-option
              clearable
              style="width: 100px"
              placeholder="请选择"
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
        <el-col :span="4" class="ep0">
          <el-form-item label="水泵型号">
            <el-input
              v-model="BasicInfoObj.chanpinxh"
              style="width: 127px"
              class="eipt"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="出厂编号">
            <el-input v-model="BasicInfoObj.chuchangbh" class="eipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="报告编号">
            <el-input v-model="BasicInfoObj.bianhao" class="eipt" />
          </el-form-item>
        </el-col>
        <el-col :span="8" class="ep0">
          <el-form-item label="大气压">
            <el-input
              v-model="BasicInfoObj.daqiya"
              style="width: 200px"
              class="eipt"
            >
              <template slot="append">标准大气压</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="height: 50px; line-height: 50px">
        <el-col :span="2">
          <span>主要检测设备</span>
        </el-col>
        <el-col :span="22">
          <el-tag
            v-for="tag in BasicInfoObj.dynamicTags"
            :key="tag"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            添加
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="4" class="ep0">
          <el-form-item label="气温">
            <el-input
              v-model="BasicInfoObj.qiwen"
              style="width: 127px"
              class="eipt"
            >
              <template slot="append">℃</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="水温">
            <el-input v-model="BasicInfoObj.shuiwen" class="eipt">
              <template slot="append">℃</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="湿度">
            <el-input v-model="BasicInfoObj.shidu" class="eipt">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="样品等级">
            <el-input v-model="BasicInfoObj.yangpindengji" class="eipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="BasicInfoObj.shengchangData"
              style="width: 140px; font-size: 12px"
              type="date"
              format="yyyy年MM月dd日"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="检测地点">
            <el-select
              v-model="BasicInfoObj.jianyandidian"
              filterable
              allow-create
              default-first-option
              clearable
              style="width: 300px"
              placeholder="请选择"
            >
              <el-option
                label="台州新华泵业制造有限公司"
                value="台州新华泵业制造有限公司"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="检测人员">
            <el-input
              v-model="BasicInfoObj.jianceren"
              style="width: 127px"
              class="eipt"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="批准人">
            <el-input v-model="BasicInfoObj.pizhunren" class="eipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="审核人">
            <el-input v-model="BasicInfoObj.shenheren" class="eipt" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="ep0">
          <el-form-item label="检验性质">
            <el-input v-model="BasicInfoObj.jianyanxingzhi" class="eipt" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="送样单位">
            <el-select
              v-model="BasicInfoObj.songyangdanwei"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option
                label="台州新华泵业制造有限公司"
                value="台州新华泵业制造有限公司"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检验项目">
            <el-input v-model="BasicInfoObj.jianyanxiangmu" placeholder />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话">
            <el-input v-model="BasicInfoObj.lianxidh" placeholder />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产单位">
            <el-select
              v-model="BasicInfoObj.shengchanN"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option
                label="台州新华泵业制造有限公司"
                value="台州新华泵业制造有限公司"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址">
            <el-select
              v-model="BasicInfoObj.scdwAdrr"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option label="温岭市大溪镇" value="温岭市大溪镇" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="委托单位">
            <el-select
              v-model="BasicInfoObj.weituodanwei"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option
                label="台州新华泵业制造有限公司"
                value="台州新华泵业制造有限公司"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址">
            <el-select
              v-model="BasicInfoObj.wtdwAdrr"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option label="温岭市大溪镇" value="温岭市大溪镇" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="受检单位">
                       <el-select
              filterable
              allow-create
              default-first-option
              clearable v-model="BasicInfoObj.shoujianN" placeholder class="ep50">
              <el-option label="利欧集团湖南泵业有限公司" value="shanghai"/>
              <el-option label="LEO Group PUMP (HUNAN) CO , LTD" value="beijing"/>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col
          :span="24"
          style="height: 70px; line-height: 70px; margin-bottom: 16px"
        >
          <el-row>
            <el-col :span="2">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  检验依据类型,例如
                  <br />
                  JB/T 6878-2006
                  <br />
                  GB/T 3216-2016
                  <br />
                  GB/T 29531-2013
                  <br />
                  GB/T 29529-2013
                </div>

                <span class="el-icon-question">检验依据</span>
              </el-tooltip>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="BasicInfoObj.jianyanyiju"
                :rows="2"
                type="textarea"
              />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签发日期">
            <el-date-picker
              v-model="BasicInfoObj.qianfaData"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="批准人">
            <el-input v-model="BasicInfoObj.pizun" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审核人">
            <el-input v-model="BasicInfoObj.shenhe" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="编制人">
            <el-input v-model="BasicInfoObj.bianzhi" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抽样地点">
            <el-select
              v-model="BasicInfoObj.chouyangAddr"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder
              class="ep50"
            >
              <el-option
                label="台州新华泵业制造有限公司"
                value="台州新华泵业制造有限公司"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样基数" style="width: 100%">
            <el-input
              v-model="BasicInfoObj.chouyangjishu"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="抽样日期" style="width: 100%">
            <el-date-picker
              v-model="BasicInfoObj.chouyangData"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="抽样数量" style="width: 100%">
            <el-input v-model="BasicInfoObj.chouyangNum" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="到样日期" style="width: 100%">
            <el-date-picker
              v-model="BasicInfoObj.daoyangData"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检验日期" style="width: 100%">
            <el-date-picker
              v-model="BasicInfoObj.jianyanData"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品状况" style="width: 100%">
            <el-input v-model="BasicInfoObj.yangpinzhuangtai" />
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
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品编号">
            <el-input v-model="BasicInfoObj.yangpinbianhao" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="样品状况">
            <el-input v-model="BasicInfoObj.yangpinzhuangkuang" />
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
              type="date"
              format="yyyy 年 MM 月 dd 日"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送样人员">
            <el-input v-model="BasicInfoObj.songyangrenyuan" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="送样单位地址">
            <el-input v-model="BasicInfoObj.scdwAdrr"/>
          </el-form-item>
        </el-col> -->

        <el-col :span="6">
          <el-form-item label="送样日期">
            <el-date-picker
              v-model="BasicInfoObj.songyangDateTime"
              type="date"
              format="yyyy 年 MM 月 dd 日"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="验收等级" style="width: 100%; display: block">
            <el-input v-model="BasicInfoObj.yanshoudengji" />
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          style="height: 70px; line-height: 70px; margin-bottom: 16px"
        >
          <el-row>
            <el-col :span="2">
              <span>检验结论</span>
            </el-col>
            <el-col :span="22">
              <el-input
                v-model="BasicInfoObj.jiancejielun"
                :rows="2"
                type="textarea"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="beizhu1">
        <el-col :span="24">
          <el-form-item label="备注" style="width: 100%; display: block">
            <el-input
              v-model="BasicInfoObj.beizhu"
              :rows="2"
              :autosize="{ minRows: 1, maxRows: 1 }"
              type="textarea"
              placeholder="备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import { eventBus } from '@/api/eventBus'

  export default {
    name: 'SouthBasicInfo',
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
        inputVisible: false,
        inputValue: '',
        BasicInfoObj: {
          pizhunren: '', // 批准人
          jianceren: '', // 检验人
          shenheren: '', // 审核人
          wendu: '',
          daqiya: '', // 大气压
          yanshoudengji: '', // 验收等级
          pizun: '', // 批准人
          shenhe: '', // 审核人
          bianzhi: '', // 编制人
          qianfaData: '', // 签发日期
          jianyanyiju: '', // 检验依据
          jianyanData: '', // 检验日期+
          yangpinzhuangtai: '', // 样品状况
          daoyangData: '', // 到样日期
          chouyangNum: '', // 抽样数量
          chouyangAdrr: '厂成品库',
          chouyangData: '', // 抽样日期
          shengchangData: '', // 生产日期
          yangpinName: '',
          jianyanxingzhi: '委托校验', // 检验性质
          dynamicTags: [], // 主要检测设备
          chanpinName: '/', // 产品名称
          chanpinxh: '/', // 水泵型号
          chuchangbh: '/', // 出厂编号
          bianhao: '/', // 报告编号
          qiwen: '/', // 气温
          shuiwen: '', // 水温
          shidu: '', // 湿度
          yangpindengji: '', // 样品等级
          jianyandidian: '', // 检验地点
          chanpinbianhao: '/',
          songyangdanwei: '/', // 送样单位
          jianyanxiangmu: '', // 检验项目
          lianxidh: '', // 联系电话
          shengchanN: '/', // 生产单位
          scdwAdrr: '/', // 生产单位单位地址
          weituodanwei: '/', // 委托单位
          wtdwAdrr: '/', // 委托单位单位地址
          // shoujianN: '',
          jianyanbiaozhun: '/',
          chouyangAddr: '/', // 抽样地点
          chouyangjishu: '0', // 抽样基数
          guige: '/', // 电机规格
          xiaolv: '/', // 电机效率
          yangpinbianhao: '/', // 样品编号
          yangpinzhuangkuang: '', // 样品状况
          dengji: '/',
          shiyanName: '/', // 实验人员
          shiyanDateTime: '', // 实验日期
          songyangrenyuan: '', // 送样人员
          songyangDateTime: '', // 送样日期
          jiancejielun: '', // 检测结论
          beizhu: '/', // 备注
        },
        formRule: {
          name: [
            {
              required: true,
              message: '请输入活动名称',
              trigger: 'blur',
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur',
            },
          ],
          region: [
            {
              required: true,
              message: '请选择活动区域',
              trigger: 'change',
            },
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
      eventBus.$on('taskdialog', this.resetForm)
    },
    beforeDestroy() {
      eventBus.$off('taskdialog')
    },
    methods: {
      resetForm(data) {
        this.$refs['formRef'].resetFields()
        console.log('data ###  南方泵业', data)
      },
      fillFormData(datas) {
        console.log('datas', datas)
        Object.assign(this.BasicInfoObj, datas)
      },
      handleClose(tag) {
        this.BasicInfoObj.dynamicTags.splice(
          this.BasicInfoObj.dynamicTags.indexOf(tag),
          1
        )
      },

      showInput() {
        this.inputVisible = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.BasicInfoObj.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
    },
  }
</script>
<style lang="scss">
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

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
    margin: 0 !important;
    padding: 0 !important;
  }

  .eipt {
    width: 120px;
  }

  .ep50 {
    width: 555px !important;
  }
</style>
