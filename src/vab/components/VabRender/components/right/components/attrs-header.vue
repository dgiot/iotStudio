<!--eslint-disable-->
<template>
  <div>
    <div class="f-render-right-link">
      <el-link type="primary" target="_blank" :href="url">
        点击查看 {{ title }}
      </el-link>
      &nbsp;
      <span style="vertical-align: middle">属性详细解释</span>
    </div>
    <div class="f-render-right-search">
      <el-input
        v-model.trim="keyword"
        clearable
        placeholder="输入关键字搜索属性"
        @input="$emit('input', $event)"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AttrsHeader',
    props: {
      url: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        keyword: '',
      }
    },
  }
</script>

<style>
  .f-render-right-link {
    padding-left: 10px;
    margin-bottom: 10px;
    margin-left: 24px;
    font-size: 14px;
    color: #666;
    border-left: 3px solid #eee;
  }
  .f-render-right-search {
    box-sizing: border-box;
    padding: 20px;
  }
</style>
