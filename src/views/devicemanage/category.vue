<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.name" clearable />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              {{ $translateTitle('button.search') }}
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click.native="handleAdd"
            >
              {{ $translateTitle('button.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="categoryList"
      :default-sort="{ prop: 'order', order: 'ascending' }"
      :height="height"
      row-key="objectId"
      :size="lineHeight"
      :stripe="stripe"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.serialnumber')"
        prop="objectId"
        show-overflow-tooltip
        sortable
        width="280"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('product.name')"
        prop="name"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('developer.operation')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">
            {{ $translateTitle('button.edit') }}
          </el-button>
          <el-button type="text" @click="handleAddChild(row)">
            {{ $translateTitle('category.Add subcategory') }}
          </el-button>
          <el-button type="text" @click="handleDelete(row.objectId)">
            {{ $translateTitle('button.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <categoryEdit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import categoryEdit from './categoryEdit'
  import { queryCategory, delCategory } from '@/api/Category'
  import { post_tree } from '@/api/Data'
  export default {
    name: 'Empty',
    components: { categoryEdit },
    data() {
      return {
        infoData: 'Category',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) - 20,
        stripe: false,
        lineHeight: 'medium',
        categoryList: [],
        listLoading: true,
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          name: '',
          limt: 10,
          skip: 0,
          order: 'createdAt',
          keys: 'count(*)',
        },
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
    },
    mounted() {},
    created() {
      this.fetchData()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) this.height = this.$baseTableHeight(1) + 210
        else this.height = this.$baseTableHeight(1)
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit({ order: 0 }, 'top')
      },
      handleAddChild(row) {
        this.$refs['edit'].showEdit(row, 'child')
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row, 'edit')
      },
      handleDelete(CategoryId) {
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          this.$translateTitle('Maintenance.Delete reminder'),
          async () => {
            const res = await delCategory(CategoryId)
            console.log(res, 'res')
            if (_.isEmpty(res)) {
              this.$baseMessage(
                this.$translateTitle('user.successfully deleted'),
                'success',
                'vab-hey-message-success'
              )
              await this.fetchData()
            } else {
              this.$baseMessage(
                this.$translateTitle('user.error deleted') + res,
                'error',
                'vab-hey-message-error'
              )
            }
          }
        )
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        let name = this.queryForm.name.length
          ? '{ "$regex": "' + this.queryForm.name + '"}'
          : '{ "$ne": "null" }'
        this.listLoading = true
        let params = {
          class: 'Category',
          filter:
            '{"order": "createdAt","keys":["parent","name","level"],"where":{"level": {"$gte": 1}, "name":' +
            name +
            '}}',
          parent: 'parent',
        }
        console.log(params)
        const { results = [] } = await post_tree(params)
        this.categoryList = results
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .Empty {
  }
</style>
