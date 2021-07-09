<!--
* @Author: vivi
* @Date: 2021-07-02 10:29:31
* @LastEditors: vivi
* @LastEditTime: 2021-07-02 10:29:31
* @Description:
* @FilePath: src\views\Maintenance\myticket.vue
-->
<template>
  <div class="mycontainer">
    <div class="ticker-dialog">
      <div class="home_dialog">
        <el-dialog
          width="100vh"
          :title="detail.name"
          :visible.sync="_deviceFlag"
        >
          <change-info
            ref="changeinfo"
            :detail="detail"
            :step="step"
            :show-footer="isfooter"
            :show-hard="ishard"
          />
          <span slot="footer" class="dialog-footer">
            <el-button
              v-show="detail.status == 0"
              @click="set_deviceFlag(false)"
            >
              {{ $translateTitle('developer.cancel') }}
            </el-button>
            <el-button
              v-show="detail.status == 0 && isfooter"
              type="primary"
              @click="dispatch()"
            >
              {{ $translateTitle('Maintenance.Dispatch') }}
            </el-button>
            <el-button v-show="detail.status == 1" @click="backChange(detail)">
              {{ $translateTitle('Maintenance.back') }}
            </el-button>

            <el-button
              v-show="detail.status == 2 && isfooter"
              type="primary"
              @click="Reassign(detail)"
            >
              {{ $translateTitle('Maintenance.Reassign') }}
            </el-button>
            <el-button
              v-show="detail.status == 2 && isfooter"
              type="primary"
              @click="check()"
            >
              {{ $translateTitle('Maintenance.check') }}
            </el-button>

            <el-button
              v-show="detail.status == 1 && isfooter"
              type="primary"
              @click="dealwith()"
            >
              {{ $translateTitle('Maintenance.deal with') }}
            </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <vab-query-form class="query-form">
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="auto"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('Maintenance.Ticket number')">
            <el-input
              v-model.trim="queryForm.number"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.project')">
            <el-select
              v-model="queryForm.product"
              clearable
              :placeholder="$translateTitle('Maintenance.project')"
            >
              <el-option
                v-for="(item, index) in _Product"
                v-show="item.objectId != 0"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="$translateTitle('Maintenance.Ticket type')">
            <el-select
              v-model="queryForm.type"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket type')"
            >
              <el-option
                v-for="item in types"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="账号">-->
          <!--            <el-input-->
          <!--              v-model.trim="queryForm.account"-->
          <!--              clearable-->
          <!--              placeholder="请输入账号"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item
            :label="$translateTitle('Maintenance.the starting time')"
          >
            <el-date-picker
              v-model="queryForm.searchDate"
              :end-placeholder="$translateTitle('Maintenance.end time')"
              format="yyyy-MM-dd"
              :start-placeholder="$translateTitle('Maintenance.start time')"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.Ticket status')">
            <el-select
              v-model="queryForm.status"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket status')"
            >
              <el-option
                v-for="item in status"
                :key="item.key"
                :label="$translateTitle(item.text)"
                :value="item.key"
              />
            </el-select>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="handleFold">
              <span v-if="fold">
                {{ $translateTitle('Maintenance.Unfold') }}
              </span>
              <span v-else>{{ $translateTitle('Maintenance.merge') }}</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
          </el-form-item>

          <el-form-item v-show="!fold">
            <el-button
              icon="el-icon-s-promotion"
              type="primary"
              :disabled="!selectedList.length"
              @click="batchExport(selectedList)"
            >
              {{ $translateTitle('Maintenance.Export') }}
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              :disabled="!selectedList.length"
              @click="handleDelete(selectedList, 1)"
            >
              {{ $translateTitle('Maintenance.batch deletion') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :height="height"
      :data="list"
      stripe
      border
      @selection-change="changeBox"
    >
      <el-table-column
        align="center"
        show-overflow-tooltip
        class-name="isCheck"
        type="selection"
        width="55"
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="objectId"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getStatus(row.status, row) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.project')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getProductName(row.product.objectId, row) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getDeviceName(row.device.objectId, row) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
        prop="user"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.the starting time')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.operating')"
        prop="name"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="showInfo(row, true, false)"
          >
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <el-button
            v-show="row.status == 0"
            type="success"
            @click="showInfo(row)"
          >
            {{ $translateTitle('Maintenance.Dispatch') }}
          </el-button>
          <el-button
            v-show="row.status == 1"
            type="success"
            @click="showInfo(row)"
          >
            {{ $translateTitle('Maintenance.deal with') }}
          </el-button>
          <el-button
            v-show="row.status == 2"
            type="info"
            @click="showInfo(row)"
          >
            {{ $translateTitle('Maintenance.Evaluation') }}
          </el-button>
          <!--          <el-button-->
          <!--            v-show="row.status == 3"-->
          <!--            type="info"-->
          <!--            @click="showInfo(row, 3)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.deal with') }}-->
          <!--          </el-button>-->
          <el-button
            v-show="row.status != 3"
            type="danger"
            @click="handleDelete(row, 2)"
          >
            {{ $translateTitle('Maintenance.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <vab-empty />
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
  </div>
</template>

<script>
  import { query_object, update_object } from '@/api/shuwa_parse'
  import { batch } from '@/api/Batch'
  import { queryDevice } from '@/api/Device'
  import { mapGetters, mapMutations } from 'vuex'
  import ChangeInfo from '@/views/Maintenance/ChangeInfo'
  export default {
    name: 'MyWork',
    components: {
      ChangeInfo,
    },
    data() {
      return {
        fold: false,
        step: 1,
        ishard: false,
        height: this.$baseTableHeight(0) - 30,
        isfooter: true,
        detail: {},
        AllDevice: [],
        selectedList: [],
        types: ['故障维修'],
        Device: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        formLabelWidth: '140px',
        rules: {
          product: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          type: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
        },
        list: [],
        // aclObj: {},
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        status: [
          { key: 0, text: 'Maintenance.To be assigned' },
          { key: 1, text: 'Maintenance.Assigned' },
          { key: 2, text: 'Maintenance.Processed' },
          { key: 3, text: 'Maintenance.Statement' },
        ],
        queryForm: {
          statusFlag: false,
          status: '',
          number: '',
          product: '',
          type: '',
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limt: 10,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
      }
    },
    computed: {
      ...mapGetters({
        _Product: 'user/_Product',
        objectId: 'user/objectId',
        role: 'acl/role',
        username: 'user/username',
      }),
      _deviceFlag: {
        get() {
          console.log(
            'this.$store.state.global._deviceFlag',
            this.$store.state.global._deviceFlag
          )
          return this.$store.state.global._deviceFlag
        },
        set(v) {
          console.log(
            'this.$store.state.global._deviceFlag',
            this.$store.state.global._deviceFlag,
            v
          )
          this.set_deviceFlag(v)
        },
      },
      aclObj() {
        let aclObj = {}
        this.role.map((e) => {
          console.log(e.name, '')
          aclObj[`${'role' + ':' + e.name}`] = {
            read: true,
            write: true,
          }
        })
        return aclObj
      },
    },
    watch: {
      _deviceFlag: function (e) {
        console.log(e)
        if (e == false) {
          this.fetchData()
        }
      },
      'queryForm.status': function (e) {
        console.log(e)
        if (e != '') {
          this.queryForm.statusFlag = true
        } else {
          this.queryForm.statusFlag = false
        }
      },
    },
    created() {
      console.log(this._Product, '_Product')
      console.log('role', this.role)

      console.log('this.aclObj', this.aclObj)
    },
    mounted() {
      this.fetchData()
      this.fetchDevice()
    },
    methods: {
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        console.log(this.selectedList)
      },
      ...mapMutations({
        set_deviceFlag: 'global/set_deviceFlag',
      }),
      handleFold() {
        this.fold = !this.fold
        this.handleHeight()
      },
      batchExport(row) {
        this.$message.success('导出excel')
      },
      handleDelete(row, type) {
        let batchParams = []

        if (type == 2) {
          batchParams.push({
            method: 'DELETE',
            path: `/classes/Maintenance/${row.objectId}`,
            body: {},
          })
        } else {
          row.forEach((item) => {
            batchParams.push({
              method: 'DELETE',
              path: `/classes/Maintenance/${item.objectId}`,
              body: {},
            })
          })
        }
        console.log(batchParams, 'batchParams')
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const res = await batch(batchParams)
            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'vab-hey-message-success'
            )
            setTimeout(() => {
              this.fetchData()
            }, 1500)
          }
        )
      },
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(0) - 47
        else this.height = this.$baseTableHeight(0) - 30
      },
      async fetchDevice() {
        const { results = [] } = await queryDevice({})
        this.AllDevice = results
      },
      getProductName(_objectId, row) {
        let _product = _objectId
        this._Product.some((i) => {
          if (i.objectId == _objectId) {
            _product = i.name
            row._product = i.name
          }
        })
        return _product
      },
      getStatus(type = 0) {
        // type == 0 ? '' : ''
        switch (type) {
          case 0:
            return this.$translateTitle('Maintenance.To be assigned')
            break
          case 1:
            return this.$translateTitle('Maintenance.Assigned')
            break
          case 2:
            return this.$translateTitle('Maintenance.Processed')
            break
          case 3:
            return this.$translateTitle('Maintenance.Statement')
            break
          default:
            return type
            console.log('other', type)
        }
      },
      showInfo(row, ishard = false, isfooter = true) {
        this.ishard = ishard
        this.isfooter = isfooter
        let { status = 0 } = row
        this.detail = row
        this.step = status + 1
        this.set_deviceFlag(true)
        // switch (step) {
        //   case -1:
        //     alert(-1)
        //     break
        //   case 0:
        //     alert(0)
        //     break
        //   case 1:
        //     alert(1)
        //     break
        //   case 2:
        //     alert(2)
        //     break
        // }
      },
      // async handleDelete(objectId) {
      //   const res = await del_object('Maintenance', objectId)
      //   // console.log('res', res)
      //   this.$message.success('删除成功')
      //   this.fetchData()
      // },
      getDeviceName(_objectId, row) {
        let _device = _objectId
        this.AllDevice.some((i) => {
          if (i.objectId == _objectId) {
            _device = i.name
            row._device = i.name
          }
        })
        return _device
      },

      async fetchData() {
        console.log(this.queryForm, 'queryForm')
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: this.queryForm.limit,
          order: this.queryForm.order,
          skip: this.queryForm.skip,
          keys: this.queryForm.keys,
          where: {
            number: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: '' },
            status: this.queryForm.statusFlag
              ? this.queryForm.status
              : { $ne: 9 },
            product: this.queryForm.product.length
              ? this.queryForm.product
              : { $ne: '' },
            type: this.queryForm.type.length
              ? this.queryForm.type
              : { $ne: '' },
          },
        }
        if (this.queryForm.searchDate.length) {
          params.where['createdAt'] = {
            $gt: { __type: 'Date', iso: this.queryForm.searchDate[0] },
          }
          params.where['updatedAt'] = {
            $lt: { __type: 'Date', iso: this.queryForm.searchDate[1] },
          }
        }
        await query_object('Maintenance', params)
          .then((res) => {
            console.log(res, 'res')
            const { results = [], count = 0 } = res
            this.list = results
            this.list.forEach((e) => {
              e.user = '暂无'
              if (e.ACL) {
                for (var key in e.ACL) {
                  e.user = key.substr(5)
                }
              }
            })
            this.total = count
            loading.close()
          })
          .catch((e) => {
            this.$message.error(`${e}`)
            loading.close()
          })
        console.log(this.list, 'this.list')
      },
      async prodChange(e) {
        this.Device = []
        const params = {
          where: { product: e },
        }
        const { results } = await queryDevice(params)
        console.log(results, '设备')
        this.Device = results
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      dispatch() {
        this.$refs.changeinfo.$refs.step1.dispatchUser()
        // console.log()
      },
      async backChange(detail) {
        const { objectId, info } = detail
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '已回退',
          p: `${this.username} 回退了流程`,
        })

        const params = {
          status: 0,
          info: info,
        }
        console.log(objectId, params)
        const res = await update_object('Maintenance', objectId, params)
        if (res.updatedAt) {
          this.set_deviceFlag(false)
        }
      },
      async Reassign(detail) {
        const { objectId, info } = detail
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '已改派',
          p: `${this.username} 改派了工单`,
        })

        const params = {
          status: 0,
          info: info,
        }
        console.log(objectId, params)
        const res = await update_object('Maintenance', objectId, params)
        if (res.updatedAt) {
          this.set_deviceFlag(false)
        }
      },
      dealwith() {
        this.$refs.changeinfo.$refs.step2.dispatchUser()
      },
      check() {
        this.$refs.changeinfo.$refs.step3.dispatchUser()
      },
    },
  }
</script>
<style scoped lang="scss">
  .mycontainer {
    .ticker-dialog {
      .create-ticker {
        ::v-deep .el-select {
          width: 100%;
        }
      }
    }
    .query-form {
      margin-top: 10px;
      ::v-deep {
        .el-form-item__label-wrap {
          margin-left: 10px;
        }
        .dialog-footer {
          text-align: center;
        }
      }
    }
  }
</style>
