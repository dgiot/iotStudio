<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-06-30 11:35:32
* @LastEditors: 11:35
* @LastEditTime: 2022-06-30 11:35:32
* @Description: 不断点击勾选框，在未选中、半选、已选中三种状态之间切换
* @FilePath: src\dgiot\components\DgiotThreeCheckbox\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <span class="stateCheckBox">
    <el-checkbox
      v-model="check"
      :disabled="data.disabled"
      :indeterminate="mid"
      @change="change"
    >
      <span
        class="label"
        :class="[check ? 'active' : '', data.disabled ? 'disabled' : '']"
      >
        {{ data.label }}
      </span>
    </el-checkbox>
  </span>
</template>

<script>
  export default {
    name: 'DgiotThreeCheckbox',
    components: {},
    model: {
      prop: 'value',
      event: 'input',
    },
    props: {
      value: {
        type: [Number, String, Boolean],
        default: 0,
        required: true,
      },
      data: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        check: false,
        mid: false,
        num: 0,
      }
    },
    computed: {},
    watch: {
      num() {
        this.$emit('input', this.num)
      },
    },
    mounted() {
      this.loadState(this.value)
    },
    methods: {
      // 初始化状态
      loadState(num) {
        this.num = Number(num)
        this.chooseState(this.num)
      },
      // 改变状态
      chooseState(num) {
        this.check = num == 2 ? true : false
        this.mid = num == 1 ? true : false
      },
      // 点击多选框
      change() {
        this.num++
        this.num > 2 ? (this.num = 0) : ''
        this.chooseState(this.num)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .stateCheckBox {
    margin-right: 30px;
    .label {
      color: #606266;
    }
    .active {
      color: #409eff;
    }
    .disabled {
      color: #c0c4cc;
    }
  }
</style>
