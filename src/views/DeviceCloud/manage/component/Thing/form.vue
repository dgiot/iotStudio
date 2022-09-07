<!--
物模型表单组件
-->
<!--eslint-disable-->
<template>
  <div class="thing-form">
    <el-form
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="80px"
      :model="ruleForm"
      :rules="rules"
      size="mini"
    >
      <el-form-item label="参数名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="标识符" prop="identifier">
        <el-input v-model="ruleForm.identifier" />
      </el-form-item>
      <el-form-item label="数据类型" prop="dataType">
        <el-select
          v-model="ruleForm.dataType"
          style="width: 100%"
          placeholder="请选择数据类型"
        >
          <el-option
            v-for="item in dataTypes"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--      int32 float double  都有取值（最大值最小值）范围和步长  -->
      <!--      enum 枚举类型 有key value-->
      <!--      bool类型只有开关 定义为0和1-->
      <!--      text为字节类型的数据长度-->
      <!--      date类型为时间格式 String类型的UTC时间戳（毫秒）-->
      <!--      struct格式为json对象，点击后不可在增加该类型-->
      <!--      array类型为数组格式-->

      <el-row
        v-if="['int32', 'float', 'double'].indexOf(ruleForm.dataType) != -1"
      >
        <el-col :span="12">
          <el-form-item label="取值范围（最小值)" prop="min">
            <el-input
              v-model="ruleForm.min"
              placeholder="取值范围（最小值)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="取值范围（最大值)" prop="max">
            <el-input
              v-model="ruleForm.max"
              placeholder="取值范围（最大值)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="步长" prop="step">
            <el-input v-model="ruleForm.step" placeholder="步长"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="单位" prop="unit">
        <el-select
          v-model="ruleForm.unit"
          filterable
          placeholder="请选择单位"
          style="width: 100%"
        >
          <el-option
            v-for="item in dlinkUnit"
            :key="item.Symbol"
            :label="item.Name"
            :value="item.Symbol"
          >
            <span style="float: left">{{ item.Name }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">
              {{ item.Symbol }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="读写类型" prop="isread">
        <el-radio-group v-model="ruleForm.isread" size="medium">
          <el-radio border label="rw">读写</el-radio>
          <el-radio border label="r">只读</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm', eventType)">
          {{ eventType == 'add' ? '立即创建' : '修改' }}
        </el-button>
        <!--        <el-button v-show="eventType=='add'" @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'ThingForm',
    props: {
      eventType: {
        type: String,
        require: true, // 必填
        default() {
          return 'add'
        },
      },
      formType: {
        type: String,
        require: true, // 必填
        default() {
          return 'input'
        },
      },
      thingType: {
        type: String,
        require: true, // 必填
        default() {
          return 'events'
        },
      },
      ruleForm: {
        type: Object,
        require: true, // 必填
        default() {
          return {
            name: '',
            unit: '/',
            isread: 'rw',
            dataType: 'int32',
            identifier: '',
            min: '',
            max: '',
            step: '',
          }
        },
      },
      dlinkUnit: {
        type: Array,
        require: true, // 必填
        default() {
          return [
            {
              Symbol: 'ml/min',
              Name: '滴速',
            },
          ]
        },
      },
      dataTypes: {
        type: Array,
        require: false, // 必填
        default() {
          return [
            'int32',
            'float',
            'double',
            'enum',
            'bool',
            'text',
            'date',
            'struct',
            'array',
          ]
        },
      },
    },
    data() {
      const checkMin = (rule, value, callback) => {
        console.log(
          /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test(
            parseFloat(value)
          ),
          parseFloat(value),
          value,
          this.ruleForm.max
        )
        if (value === '') {
          return callback(new Error('最小值不能为空'))
        } else if (
          !/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test(
            parseFloat(value)
          )
        ) {
          callback(new Error('请填写正确的取值范围'))
        } else if (
          parseFloat(value) < -2147483648 ||
          parseFloat(value) > 2147483647
        ) {
          callback(new Error('取值范围：-2147483648 ~ 2147483647'))
        } else if (parseFloat(value) >= this.ruleForm.max) {
          callback(new Error('最大值不能小于最小值'))
        } else {
          callback()
        }
      }

      const checkMAX = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('最大值不能为空'))
        } else if (
          !/^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/.test(
            parseFloat(value)
          )
        ) {
          callback(new Error('请填写正确的取值范围'))
        } else if (
          parseFloat(value) < -2147483648 ||
          parseFloat(value) > 2147483647
        ) {
          callback(new Error('取值范围：-2147483648 ~ 2147483647'))
        } else {
          callback()
        }
      }
      const checkStep = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('步长不能为空'))
        } else if (parseFloat(value) <= 0) {
          callback(new Error('步长应大于0'))
        } else if (!/^(0|[1-9][0-9]*)$/.test(parseFloat(value))) {
          callback(new Error('请填写正确的步长'))
        } else if (parseFloat(value) > 2147483647) {
          callback(new Error('步长不能大于 2147483647'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          name: [
            {
              min: 1,
              max: 30,
              required: true,
              message: '请输入参数名称（1-30个字符）',
              trigger: 'blur',
            },
            {
              message:
                '支持中文、字母、数字、短划线，必须以中文、英文或数字开头\n',
              trigger: 'blur',
              pattern: /[0-9a-zA-Z\xa0-\xff_]*$/,
            },
          ],
          identifier: [
            {
              min: 1,
              max: 50,
              required: true,
              message: '请输入标识符（1-50个字符）',
              trigger: 'blur',
            },
            {
              message: '支持大小写字母、数字和下划线、不超过 50 个字符。\n',
              trigger: 'blur',
              pattern:
                /^[\u4e00-\u9fa5-a-zA-Z0-9][\u4e00-\u9fa5-a-zA-Z0-9\\-_.\\]*$/,
            },
          ],
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' },
          ],
          isread: [
            { required: true, message: '请选择读写类型', trigger: 'change' },
          ],
          unit: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
          min: [
            {
              required: true,
              trigger: 'blur',
              validator: checkMin,
            },
          ],
          max: [
            {
              required: true,
              trigger: 'blur',
              validator: checkMAX,
            },
          ],
          step: [
            {
              required: true,
              trigger: 'blur',
              validator: checkStep,
            },
          ],
        },
        checkMin: checkMin,
      }
    },
    methods: {
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 子组件中调用父组件的方法
            if (type == 'add') {
              this.$emit('OutputParameters', this.ruleForm, this.thingType)
            } else {
              this.$emit('editParameters', this.ruleForm, this.thingType)
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
    },
  }
</script>
<style></style>
