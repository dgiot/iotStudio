<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:43
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:43
* @Description:
* @FilePath: src\views\CloudOc\MetaData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div
    ref="custom-table"
    class="index-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <dgiot-query-form>
      <dgiot-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="元数据名称" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click.native="$router.push('/oc/MetaData/module')"
            >
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        width="95"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="元数据名称"
        prop="title"
        sortable
        width="auto"
      />
      <el-table-column
        align="center"
        label="多版本管理"
        prop="data.multiVersion"
        sortable
        width="auto"
      >
        <template #default="{ row }">
          <span>
            {{ row.data.multiVersion == '0' ? '是' : '否' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click.native="
              $router.push({
                path: '/oc/MetaData/module',
                query: {
                  objectId: row.objectId,
                  type: 'edit',
                },
              })
            "
          >
            编辑
          </el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="dgiot-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.size"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryDict, delDict } from '@/api/Dict'

  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        drawerAdd: false,
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 20,
        stripe: true,
        lineHeight: 'mini',
        checkList: ['元数据名称', '多版本管理', '描述'],
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          skip: 0,
          limit: 20,
          name: '',
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
    watch: {},
    created() {
      this.fetchData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      onSubmit() {
        console.log('submit!')
      },
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 210
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDict(row.objectId)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
          await this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.limit = 0
        this.queryForm.limit = 20
        this.fetchData()
      },
      async fetchData() {
        const params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: '',
          where: {
            parent: '0',
            type: 'metaData',
          },
        }
        this.queryForm.name
          ? (params.where.title = { $regex: this.queryForm.name })
          : ''
        console.info(params)
        this.listLoading = true
        const { results, count } = await queryDict(params)
        this.list = results
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
  }
</style>
