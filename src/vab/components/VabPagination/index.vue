<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'VabPagination',
    props: {
      total: {
        required: true,
        type: Number,
      },
      page: {
        type: Number,
        default: 1,
      },
      limit: {
        type: Number,
        default: 10,
      },
      pageSizes: {
        type: Array,
        default() {
          return [5, 10, 20, 50, 100, 200, 500]
        },
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper',
      },
      background: {
        type: Boolean,
        default: true,
      },
      autoScroll: {
        type: Boolean,
        default: true,
      },
      hidden: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      currentPage: {
        get() {
          return this.page
        },
        set(val) {
          this.$emit('update:page', val)
        },
      },
      pageSize: {
        get() {
          return this.limit
        },
        set(val) {
          this.$emit('update:limit', val)
        },
      },
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('pagination', {
          skip: this.currentPage,
          limit: val,
          count: '*',
          order: '-createdAt',
          keys: 'count(*)',
        })
      },
      handleCurrentChange(val) {
        this.$emit('pagination', {
          skip: (val - 1) * this.currentPage,
          limit: this.pageSize,
          count: '*',
          order: '-createdAt',
          keys: 'count(*)',
        })
      },
    },
  }
</script>

<style>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
