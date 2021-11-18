<!--eslint-disable-->
<template>
  <div>
    <div class='vab-render-right-link'>
      <el-link :href='url' target='_blank' type='primary'>
        点击查看 {{ title }}
      </el-link>
      &nbsp;
    </div>
    <div class='vab-render-right-search'>
      <el-input
        v-model.trim='keyword'
        clearable
        placeholder='输入关键字搜索属性'
        @input="$emit('input', $event)"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VabRenderRightAttrsHeader',
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
  .vab-render-right-link {
    padding-left: 10px;
    margin-bottom: 10px;
    margin-left: 24px;
    font-size: 14px;
    color: #666;
    text-align: center;
    border-left: 3px solid #eee;
  }

  .vab-render-right-search {
    box-sizing: border-box;
    padding: 20px;
  }
</style>
