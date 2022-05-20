<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-05-12 18:02:23
* @LastEditors: 18:02
* @LastEditTime: 2022-05-12 18:02:23
* @Description:
* @FilePath: src\views\CloudPressure\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div
    ref="pressure-table"
    class="pressure-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <div class="modal">
      <Modal
        v-model="draw.settings.visibility"
        :closable="false"
        fullscreen
        :title="draw.row.name"
      >
        <div>
          <Tabs size="small">
            <TabPane
              v-for="(item, index) in draw.settings.data"
              :key="index"
              :label="item.title"
              :name="item.title"
            >
              <dgiot-amis :schema="item.data" :show-help="false" />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </div>
    <div class="draw">
      <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        title=""
        :visible="draw.form.visibility"
        :width="720"
        @close="onClose"
      >
        <Tabs size="small">
          <TabPane
            v-for="(item, index) in draw.settings.data"
            :key="index"
            :label="item.title"
            :name="item.title"
          >
            <dgiot-amis :schema="item.data" :show-help="false" />
          </TabPane>
        </Tabs>
      </a-drawer>
    </div>
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
            <el-input v-model="queryForm.name" placeholder="请输入压测任务名" />
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
              @click.native="handleView('_', 'reportFrom')"
            >
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>

    <a-tabs v-model="activeKey">
      <a-tab-pane key="task" tab="压测列表">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :border="border"
          :data="list"
          :size="lineHeight"
          :stripe="stripe"
        >
          <el-table-column
            align="center"
            label="序号"
            show-overflow-tooltip
            sortable
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
            sortable
            :width="item.width"
          >
            <template #default="{ row }">
              <span v-if="item.label === '评级'">
                <el-rate v-model="row.rate" disabled />
              </span>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="压测状态"
            width="120"
          >
            <template #default="{ row }">
              <el-tag dark :type="row.isEnable == false ? 'info' : ''">
                {{ row.isEnable == false ? '未压测' : '压测中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="handleClick(row, 'setting')">
                查看配置
              </el-button>
              <el-button type="text" @click="handleClick(row, 'task')">
                压测配置
              </el-button>
              <el-button type="text" @click="handleClick(row, 'clone')">
                克隆任务
              </el-button>
              <el-button type="text" @click="handleClick(row, 'delete')">
                删除任务
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../public/assets/images/platform/assets/empty_images/data_empty.png')
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
      </a-tab-pane>
      <!--      <a-tab-pane key="report" tab="任务报告">-->
      <!--        <dgiot-empty />-->
      <!--      </a-tab-pane>-->
    </a-tabs>
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import {
    queryDevice,
    getDevice,
    delDevice,
    postDevice,
    putDevice,
  } from '@/api/Device'
  import { queryProduct } from '@/api/Product'
  import { queryProductTemplet } from '@/api/ProductTemplet'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryView } from '@/api/View'

  export default {
    name: 'Pressure',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        taskData: {},
        product: '',
        form: {
          name: '',
          url: '',
          owner: '',
          type: '',
          approver: '',
          dateTime: '',
          description: '',
        },
        rules: {
          name: [{ required: true, message: 'Please enter user name' }],
          url: [{ required: true, message: 'please enter url' }],
          owner: [{ required: true, message: 'Please select an owner' }],
          type: [{ required: true, message: 'Please choose the type' }],
          approver: [{ required: true, message: 'Please choose the approver' }],
          dateTime: [
            {
              required: true,
              message: 'Please choose the dateTime',
              type: 'object',
            },
          ],
          description: [
            { required: true, message: 'Please enter url description' },
          ],
        },
        draw: {
          row: {},
          settings: {
            data: [],
            visibility: false,
          },
          form: {
            visibility: false,
          },
        },
        activeKey: 'task',
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(1),
        stripe: true,
        lineHeight: 'medium',
        checkList: ['压测任务', '开始时间', '结束时间', '压测任务状态'],
        columns: [
          {
            label: '压测任务',
            width: 'auto',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '开始时间',
            width: '200',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: '结束时间',
            width: '200',
            prop: 'updatedAt',
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
          limit: 10,
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
    async mounted() {
      await this.queryZetaProduct()
    },
    destroyed() {},
    methods: {
      async queryZetaProduct() {
        const { results = [] } = await queryProductTemplet({
          where: { name: 'zeta压测报告' },
        })
        results?.[0]?.objectId ? (this.product = results?.[0]?.objectId) : ''
        this.product ? this.fetchData() : ''
      },
      async handleView(col, type) {
        col.objectId
          ? localStorage.setItem('parse_objectid', col.objectId)
          : localStorage.removeItem('parse_objectid')
        let params = {
          where: {
            class: 'Product',
            type: type,
          },
        }
        // col?.product?.objectId ? (params.where[key] = col.product.objectId) : ''
        const { results = [] } = await queryView(params)
        if (_.isEmpty(results)) {
          this.$message({
            type: 'info',
            message: `暂未配置${type}表单`,
            showClose: true,
          })
          return false
        } else {
          this.draw.settings.data = results
          col === '_'
            ? (this.draw.form.visibility = true)
            : (this.draw.settings.visibility = true)
        }
      },
      async handleClone(device) {
        this.$message({
          type: 'success',
          message: '克隆任务成功',
          showClose: true,
        })
        // 刪除掉一下参数去克隆
        delete device.createdAt
        delete device.updatedAt
        delete device.objectId
        device.isEnable = false
        device.devaddr = md5('Device' + Math.round(new Date()) + '').substring(
          0,
          10
        )
        device.name = 'clone_' + device.name
        await postDevice(device)
        await this.fetchData()
      },
      async onClose() {
        this.draw.form.visibility = false
        await this.fetchData()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      async handleClick(col, type) {
        this.draw.row = col
        localStorage.setItem('parse_objectid', col.objectId)
        switch (type) {
          case 'setting':
            await this.handleView(col, 'profile')
            break
          case 'task':
            await this.handleView(col, 'content')
            break
          case 'clone':
            await this.handleClone(this.draw.row)
            break
          case 'delete':
            this.handleDelete(col)
            break
        }
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(row.objectId)
          this.$baseMessage(
            '任务删除成功',
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
        this.queryForm.limit = 10
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {
            product: this.product,
          },
        }
        this.queryForm.name
          ? (params.where.name = { $regex: this.queryForm.name })
          : ''
        const { count = 0, results = [] } = await queryDevice(params)
        results.forEach((i) => {
          i.createdAt = this.$moment(i.createdAt).format('YYYY-MM-DD HH:mm:ss')
          i.updatedAt = this.$moment(i.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.list = results
        this.total = count
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 0px !important;
  }

  .full-modal {
    height: 100vh !important;

    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }

  .index-container {
    width: 100%;
    heigth: 100%;
  }
</style>
