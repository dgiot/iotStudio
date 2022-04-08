<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:35
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:35
* @Description:
* @FilePath: src\views\CloudOc\MasterData\index.vue
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
    <el-row>
      <el-col :span="4">
        <a-list :data-source="list" item-layout="horizontal">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <a slot="title" @click="queryItem(item)">
                {{ item.name }}
              </a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </el-col>
      <el-col :span="20">
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
          <dgiot-query-form-right-panel>
            <el-button
              style="margin: 0 10px 10px 0 !important"
              type="primary"
              @click="clickFullScreen"
            >
              <dgiot-icon
                :icon="
                  isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'
                "
              />
              表格全屏
            </el-button>
            <el-popover popper-class="custom-table-checkbox" trigger="hover">
              <el-checkbox-group v-model="checkList">
                <dgiot-draggable :list="columns" />
              </el-checkbox-group>
              <template #reference>
                <el-button
                  icon="el-icon-setting"
                  style="margin: 0 0 10px 0 !important"
                  type="primary"
                >
                  可拖拽列设置
                </el-button>
              </template>
            </el-popover>
          </dgiot-query-form-right-panel>
        </dgiot-query-form>

        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :border="border"
          :data="properties"
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
            v-for="(item, index) in finallyColumns"
            :key="index"
            align="center"
            :label="item.label"
            :prop="item.label"
            sortable
            :width="item.width"
          >
            <template #default="{ row }">
              <span v-if="item.prop !== 'multiVersion'">
                {{ row[item.prop] }}
              </span>
              <span v-else>{{ item }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
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
      </el-col>
    </el-row>

    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import {
    queryMetaData,
    getMetaData,
    delMetaData,
    putMetaData,
  } from '@/api/MetaData'

  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        properties: [],
        drawerAdd: false,
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 20,
        stripe: true,
        lineHeight: 'mini',
        checkList: ['propertyDesc'],
        columns: [
          {
            label: 'propertyDesc',
            width: '160',
            prop: 'propertyDesc',
            sortable: true,
            disableCheck: true,
          },
        ],
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
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {},
    created() {
      this.fetchData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      async queryItem(item) {
        const loading = this.$baseColorfullLoading(3)
        const { properties = [] } = await getMetaData(item.objectId)
        loading.close()
        dgiotlog.log(properties)
        this.properties = properties
      },
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
          await delMetaData(row.objectId)
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
          excludeKeys: 'properties',
          where: {
            name: this.queryForm.name
              ? { $regex: this.queryForm.name }
              : { $ne: null },
          },
        }
        console.info(params)
        this.listLoading = true
        const { results, count } = await queryMetaData(params)
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
    heigth: 100%;
  }
</style>
