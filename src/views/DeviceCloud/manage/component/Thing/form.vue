<!--
物模型表单组件
-->
<!--eslint-disable-->
<template>
  <div class="thing-form">
    <el-form
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="100px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item label="参数名称" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="标识符" prop="identifier">
        <el-input v-model="ruleForm.identifier"/>
      </el-form-item>
      <el-form-item label="数据类型" prop="dataType">
        <el-select v-model="ruleForm.dataType" style="width: 100%" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"/>
          <el-option label="区域二" value="beijing"/>
        </el-select>
      </el-form-item>
      <!--      int32 float double  都有取值（最大值最小值）范围和不长  -->
      <!--      enum 枚举类型 有key value-->
      <!--      bool类型只有开关 定义为0和1-->
      <!--      text为字节类型的数据长度-->
      <!--      date类型为时间格式 String类型的UTC时间戳（毫秒）-->
      <!--      struct格式为json对象，点击后不可在增加该类型-->
      <!--      array类型为数组格式-->


      <el-form-item label="读写类型">
        <el-radio-group v-model="ruleForm.resource" size="medium">
          <el-radio border label="读写"></el-radio>
          <el-radio border label="只读
"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单位" prop="region">
        <el-select v-model="ruleForm.region" style="width: 100%" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"/>
          <el-option label="区域二" value="beijing"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          立即创建
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'ThingForm',
    props: {
      ruleForm: {
        type: Object,
        require: true, // 必填
        default() {
          return {
            name: '11111',
            region: '1111111111111111111111111111111111111111111111',
            date1: '11111111111111111111',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: '',
          }
        },
      },
    },
    data() {
      return {
        rules: {
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
          date1: [
            {
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          date2: [
            {
              type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change',
            },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
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
