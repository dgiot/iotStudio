<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :key="momentKey"
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
    data() {
      return {
        momentKey: moment(new Date()).format('X'),
      }
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
        this.pageSize = val
        const args = {
          skip: this.currentPage,
          limit: this.pageSize,
          count: '*',
          order: '-createdAt',
          keys: 'count(*)',
        }
        // this.momentKey = moment(new Date()).format('X')
        this.$emit('pagination', args)
        console.groupCollapsed(
          '%cpagination info',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(
          '%c%s',
          'color: green;font-size: 24px;',
          'handleSizeChange val:   ' + val + this.limit + this.currentPage
        )
        console.table(args)
        console.groupEnd()
      },
      handleCurrentChange(val) {
        // this.momentKey = moment(new Date()).format('X')
        this.currentPage = (val - 1) * this.pageSize
        const args = {
          skip: this.currentPage,
          limit: this.pageSize,
          count: '*',
          order: '-createdAt',
          keys: 'count(*)',
        }
        console.groupCollapsed(
          '%cpagination info',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(
          '%c%s',
          'color: green;font-size: 24px;',
          'handleCurrentChange val:   ' + val + this.limit + this.currentPage
        )
        console.table(args)
        console.groupEnd()
        this.$emit('pagination', args)
      },
    },
  }
</script>

<style>
  .pagination-container {
    /*padding: 32px 16px;*/
    width: 100%;
    overflow: auto; /* 超出部分滚动条 */
    background: #fff;
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
