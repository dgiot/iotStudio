<template>
  <div class="comprehensive-table-container">
    <dgiot-query-form>
      <dgiot-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="75px"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item label="产品名称">
            <el-select
              v-model="queryForm.product"
              clearable
              placeholder="请选择产品"
            >
              <el-option
                v-for="item in product"
                :key="item.objectId"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input
              v-model="queryForm.name"
              clearable
              placeholder="请输入设备名称"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="设备编号">
            <el-input
              v-model="queryForm.devaddr"
              clearable
              placeholder="请输入设备编号"
            />
          </el-form-item>
          <el-form-item v-show="!fold" label="设备状态">
            <el-select
              v-model="queryForm.status"
              clearable
              placeholder="请选择设备状态"
            >
              <el-option label="在线" value="ONLINE" />
              <el-option label="离线" value="OFFLINE" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="!fold" label="启用状态">
            <el-select
              v-model="queryForm.isEnable"
              clearable
              placeholder="请选择启用状态"
            >
              <el-option label="启用" value="true" />
              <el-option label="禁用" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="fold = !fold">
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <dgiot-icon
                class="dgiot-dropdown"
                :class="{ 'dgiot-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>

    <el-table ref="tableSort" v-loading="listLoading" border :data="list">
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        sortable
        width="60"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="设备名称"
        prop="name"
        show-overflow-tooltip
        sortable
        width="auto"
      />
      <el-table-column
        align="center"
        label="设备编号"
        prop="devaddr"
        show-overflow-tooltip
        sortable
        width="auto"
      />
      <el-table-column align="center" label="设备状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status == 'ONLINE' ? 'success' : 'warning'">
            {{ row.status == 'ONLINE' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="
          $translateTitle('developer.prohibit') +
          '/' +
          $translateTitle('developer.enable')
        "
        prop="isEnable"
        show-overflow-tooltip
        sortable
        width="200"
      >
        <template #default="{ row, $index }">
          <el-switch
            v-model="row.isEnable"
            @change="handelUpdate($event, row, $index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        show-overflow-tooltip
        sortable
        width="200"
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle('developer.operation')"
        width="auto"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            style="margin-left: 10px"
            type="primary"
            @click="deviceToDetail(row)"
          >
            {{ $translateTitle('product.details') }}
          </el-button>
          <el-button
            size="mini"
            style="text-align: center"
            type="warning"
            @click="editorDevice(row)"
          >
            {{ $translateTitle('concentrator.edit') }}
          </el-button>
          <el-button size="mini" type="info" @click="konvaDevice(row)">
            {{ $translateTitle('concentrator.konva') }}
          </el-button>
          <el-dropdown style="margin: 0 10px">
            <el-button
              size="mini"
              type="danger"
              @click="isFullscreen = !isFullscreen"
            >
              {{ $translateTitle('concentrator.more') }}
            </el-button>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-link
                  size="mini"
                  type="primary"
                  @click="showTree(row, row.objectId, row.Company)"
                >
                  {{ $translateTitle('equipment.move') }}
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link
                  size="mini"
                  type="warning"
                  @click="goLink('video', row.objectId)"
                >
                  {{ $translateTitle('concentrator.video') }}
                </el-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link
                  size="mini"
                  type="danger"
                  @click="handleDelete(row, 2)"
                >
                  {{ $translateTitle('developer.delete') }}
                </el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-image class="dgiot-data-empty" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import {
    addimeidevice,
    putDevice,
    querycompanyDevice,
    getDevice,
  } from '@/api/Device'
  import { doDelete, getList } from '@/api/Mock/table'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryProduct } from '@/api/Product'
  import { delDict } from '@/api/Dict'
  import { returnLogin } from '@/utils/utilwen'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    data() {
      return {
        product: [],
        fold: true,
        height: this.$baseTableHeight(0),
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          excludeKeys:
            'channel,children,config,thing,decoder,data,basedata,content',
          include: 'product',
          product: '',
          title: '',
          name: '',
          isEnable: '',
          devaddr: '',
          status: '',
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
        _tableDict: 'global/_tableDict',
        token: 'user/token',
        roleTree: 'user/roleTree',
        language: 'settings/language',
        _product: 'user/_Product',
        _role: 'acl/role',
        currentDepartment: 'user/currentDepartment',
      }),
    },
    beforeMount() {
      window.addEventListener('resize', this.handleHeight)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleHeight)
    },
    created() {
      this.fetchProduct()
      this.fetchData()
    },
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        changeTabsMeta: 'tabs/changeTabsMeta',
        set_tableDict: 'global/set_tableDict',
        set_tableParser: 'global/set_tableParser',
      }),
      /**
       * @Author: dgiot-fe
       * @Date: 2022-4-27 21:33:23
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handelUpdate(event, row, index) {
        var newData1 = {}
        var that = this
        for (var key in row) {
          newData1[key] = row[key]
        }
        newData1.isEnable = newData1.isEnable != true
        this.list[index] = newData1
        this.$confirm('是否修改此设备状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            await this.$update_object('Device', row.objectId, {
              isEnable: event,
            })
            this.$message({
              duration: 2000,
              showClose: true,
              type: 'info',
              message: '设备状态修改成功修改',
            })
            this.fetchData()
          })
          .catch(async () => {
            this.$message({
              duration: 2000,
              showClose: true,
              type: 'info',
              message: '已取消修改',
            })
            const newData = row
            newData.isEnable = newData.isEnable != true
            this.list[index] = newData
          })
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-27 20:45:36
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async fetchProduct() {
        try {
          const { results = [] } = await queryProduct({
            excludeKeys:
              'children,thing,decoder,topics,productSecret,desc,view,category,producttemplet',
          })
          this.product = results
        } catch (error) {
          console.log(error)
        }
      },
      // 设备详情
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            productid: row.product.objectId,
            ischildren: 'false',
          },
        })
      },
      // 组态
      konvaDevice(row) {
        this.$router.push({
          path: '/Topo',
          query: {
            productid: row.product.objectId,
            devaddr: row.devaddr,
            deviceid: row.objectId,
            type: 'device',
          },
        })
      },
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(2) - 47
        else this.height = this.$baseTableHeight(3) - 30
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {},
      handleDetail(row) {},
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
        this.listLoading = true
        const params = {
          excludeKeys: this.queryForm.excludeKeys,
          // include: this.queryForm.include,
          order: '-createdAt',
          count: 'objectId',
        }
        const { results: list = [], count: total = 0 } =
          await querycompanyDevice(params, this.token)
        this.list = list
        this.total = total
        this.listLoading = false
      },
    },
  }
</script>
