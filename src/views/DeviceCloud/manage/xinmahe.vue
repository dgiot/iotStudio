<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-04-06 17:28:00
* @LastEditors: 17:28
* @LastEditTime: 2022-04-06 17:28:00
* @Description:
* @FilePath: src\views\DeviceCloud\manage\xinmahe.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: xinmahe
-->
<template>
  <div
    ref="custom-table"
    class="xinmahe-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <el-form
      ref="form"
      :inline="true"
      label-width="0"
      :model="queryForm"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="queryForm.search"
          class="input-with-select"
          placeholder="请输入查询参数"
        >
          <el-select
            v-model="queryForm.type"
            clearable
            placeholder="请选择查询类型"
            style="width: 160px"
            slot="prepend"
          >
            <el-option label="设备名称" value="name" />
            <el-option label="外壳编号" value="basedata.basicdata.partAddr" />
            <el-option label="主板编号" value="devaddr" />
          </el-select>
        </el-input>
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
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="item.label"
        :prop="item.label"
        sortable
        :width="item.width"
      >
        <template #default="{ row }">
          <span v-if="typeof row[item.prop] == 'string'">
            {{ row[item.prop] }}
          </span>
          <span
            v-else
            v-text="getItems(item.prop, row.basedata, row.basedata.basicdata)"
          ></span>
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
  import { getProduct, queryProduct } from '@/api/Product/index'
  import {
    addimeidevice,
    putDevice,
    querycompanyDevice,
    getDevice,
  } from '@/api/Device'

  export default {
    name: 'Xinmahe',
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
        checkList: [
          '设备名称',
          '外壳编号',
          '开关机状态',
          '通讯状态',
          '到期时间',
          '添加时间',
          '设备地址',
        ],
        columns: [
          {
            label: '设备名称',
            width: '160',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '外壳编号',
            width: '120',
            prop: 'basedata.basicdata.partAddr',
            sortable: true,
          },
          {
            label: '开关机状态',
            width: 'auto',
            prop: 'basedata.PowerState',
            sortable: true,
          },
          {
            label: '通讯状态',
            width: 'auto',
            prop: 'basedata',
            sortable: true,
          },
          {
            label: '到期时间',
            width: 'auto',
            prop: 'basedata.expirationTime',
            sortable: true,
          },
          {
            label: '添加时间',
            width: 'auto',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: '设备地址',
            width: 'auto',
            prop: 'basedata.basicdata.baiduaddr',
            sortable: true,
          },
          {
            label: '数据更新时间',
            width: 'auto',
            prop: 'lasttime',
            sortable: true,
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
          search: '',
          type: 'name',
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
      getItems(prop, basedata, basicdata) {
        let str = basedata[prop.split('.')[1]]
        console.log(prop, basedata, basicdata, str)
        if (typeof str == 'string') {
          return str || basicdata[prop.split('.')[2]]
        } else {
          return '暂无'
        }
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
        this.queryForm.limit = 20
        this.fetchData()
      },
      async fetchData() {
        console.log(this.queryForm.type, this.queryForm)
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {
            product: '0765bee775',
          },
        }
        if (this.queryForm.type)
          params.where[this.queryForm.type] = this.queryForm.search.length
            ? { $regex: this.queryForm.search }
            : { $ne: '！' }
        console.info(params)
        this.listLoading = true
        const { results, count } = await querycompanyDevice(params)
        this.list = results
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .xinmahe-container {
    width: 100%;
    heigth: 100%;
  }
</style>
