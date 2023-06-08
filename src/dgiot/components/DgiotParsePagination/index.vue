<template>
  <div class="pagination-container">
    <el-pagination
      :key="momentKey"
      :background="ination.background"
      :current-page.sync="ination.currentPage"
      :layout="ination.layout"
      :page-size.sync="ination.pageSize"
      :page-sizes="ination.pageSizes"
      :total="ination.total"
      v-bind="$attrs"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  const _queryPayload = {
    where: {
      // $lt	Less Than
      // $lte	Less Than Or Equal To
      // $gt	Greater Than
      // $gte	Greater Than Or Equal To
      // $ne	Not Equal To
      // $in	Contained In
      // $nin	Not Contained in
      // $exists	A value is set for the key
      // $select	This matches a value for a key in the result of a different query
      // $dontSelect	Requires that a key’s value not match a value for a key in the result of a different query
      // $all	Contains all of the given values
      // $regex	Requires that a key’s value match a regular expression
      // $text	Performs a full text search on indexed fields
    },
    // excludeKeys: '',
    include: '',
    order: '-updatedAt',
    limit: 10,
    skip: 0,
    count: 'objectId',
  }
  const _pagination = {
    // 每页显示个数选择器的选项设置
    pageSizes: [5, 10, 20, 50, 100, 200, 500],
    // 组件布局，子组件名用逗号分隔
    layout: 'total, sizes, prev, pager, next, jumper',
    // 是否为分页按钮添加背景色
    background: true,
    // 是否显示本控件
    hidden: false,
    // 是否使用小型分页样式
    small: false,
    // 每页显示条目个数，支持 .sync 修饰符
    pageSize: 10,
    // 总条目数
    total: 0,
    // 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
    pageCount: 0,
    // 页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数
    pagerCount: 7,
    // 当前页数，支持 .sync 修饰符
    currentPage: 1,
    // 每页显示个数选择器的下拉框类名
    popperClass: '',
    // 替代图标显示的上一页文字
    prevText: '',
    // 替代图标显示的下一页文字
    nextText: '',
    // 是否禁用
    disabled: false,
    // 只有一页时是否隐藏
    hideOnSinglePage: false,
  }
  export default {
    name: 'DgiotParserPagination',
    props: {
      /**
       * https://docs.parseplatform.org/rest/guide/#query-constraints
       * 查询条件
       Parameter	Use
       order	Specify a field to sort by
       limit	Limit the number of objects returned by the query
       skip	Use with limit to paginate through results
       keys	Restrict the fields returned by the query
       excludeKeys	Exclude specific fields from the returned query
       include	Use on Pointer columns to return the full object
       */
      // eslint-disable
      queryPayload: {
        type: Object,
        required: false,
        default: () => _queryPayload,
      },
      // eslint-disable
      /**
       * @description element pagination 分页组件参数
       * @doc-api https://element.eleme.cn/#/zh-CN/component/pagination#attributes
       */
      pagination: {
        type: Object,
        required: false,
        default: () => _pagination,
      },
    },
    data() {
      return {
        momentKey: moment(new Date()).format('X'),
      }
    },
    computed: {
      query: function () {
        return _.merge(_queryPayload, this.queryPayload)
      },
      ination: function () {
        return _.merge(_pagination, this.pagination)
      },
    },
    methods: {
      /**
       * @description 每页显示多少条
       * @param pagesize
       */
      handleSizeChange(pagesize) {
        console.log(this.$route)
        let query = this.query
        query.limit = pagesize
        this.$emit('paginationQuery', query)
        this.$emit('pagination', query)
      },
      handleCurrentChange(currentPage) {
        console.log(this.$route.path)
        let query = this.query
        query.skip = (currentPage - 1) * this.ination.pageSize
        this.$emit('paginationQuery', query)
        this.$emit('pagination', query)
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
