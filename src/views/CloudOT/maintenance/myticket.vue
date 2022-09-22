<template>
  <div class="comprehensive-table-container">
    <div class="dialog">
      <el-dialog
        :append-to-body="true"
        :title="title"
        :visible.sync="showdeviceFlag"
        width="100vh"
      >
        <Change-Step ref="ChangeStep" :detail="detail" :step="step" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="showdeviceFlag = !showdeviceFlag">
            {{ $translateTitle('tagsView.close') }}
          </el-button>
          <el-button
            v-if="detail.status == 0"
            plain
            type="warning"
            @click="backChange(detail)"
          >
            {{ $translateTitle('Maintenance.back') }}
          </el-button>
          <el-button
            v-if="detail.status == 0"
            plain
            type="primary"
            @click="receiveChange(detail)"
          >
            {{ $translateTitle('Maintenance.receive') }}
          </el-button>
          <el-button
            v-if="detail.status == 1"
            type="primary"
            @click="dealwithChange(detail)"
          >
            {{ $translateTitle('Maintenance.deal with') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
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
          <el-form-item :label="$translateTitle('Maintenance.Ticket number')">
            <el-input
              v-model.trim="queryForm.number"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('equipment.Products')">
            <el-select
              v-model="queryForm.product"
              clearable
              :placeholder="$translateTitle('equipment.Products')"
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
                v-for="(item, index) in tickettype"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.Ticket status')">
            <el-select
              v-model="queryForm.status"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket status')"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in status"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.times')">
            <el-date-picker
              v-model="queryForm.searchDate"
              :end-placeholder="$translateTitle('Maintenance.end time')"
              format="yyyy-MM-dd"
              :start-placeholder="$translateTitle('Maintenance.start time')"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              size="mini"
              type="primary"
              @click="fetchData"
            >
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      border
      :data="list"
      stripe
    >
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="number"
        width="120"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.Products')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.info && row.info.productname ? row.info.productname : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.info && row.info.devicename ? row.info.devicename : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.executor')"
      >
        <template #default="{ row }">
          {{ row.info && row.info.executorname ? row.info.executorname : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        width="100"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        width="100"
      >
        <template #default="{ row }">
          {{ getStatus(row.status, row) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.planstartdata')"
        sortable
      >
        <template #default="{ row }">
          {{ $moment(row.info.startdata).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.planenddata')"
        sortable
      >
        <template #default="{ row }">
          {{ $moment(row.info.completiondata).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
      >
        <template #default="{ row }">
          {{ row.info && row.info.createdname ? row.info.createdname : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('cloudTest.Creation time')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.istimeout')"
        width="100"
      >
        <template #default="{ row }">
          <span v-html="getistimeout(row)"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$translateTitle('Maintenance.operating')"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            v-if="row.status == 0 && username == row.info.executorname"
            plain
            size="mini"
            type="primary"
            @click="receive(row)"
          >
            {{ $translateTitle('Maintenance.receive') }}
          </el-button>
          <el-button
            v-if="row.status == 1 && username == row.info.executorname"
            size="mini"
            type="primary"
            @click="dealwith(row)"
          >
            {{ $translateTitle('Maintenance.deal with') }}
          </el-button>
          <el-button
            v-else
            size="mini"
            type="primary"
            @click="showInfo(row, true, false)"
          >
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <dgiot-empty />
      </template>
    </el-table>
    <dgiot-Pagination
      v-show="total > 0"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="total"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
  import { create_object, query_object, update_object } from '@/api/Parse'
  import { batch } from '@/api/Batch'
  import { queryDevice } from '@/api/Device'
  import { usertree } from '@/api/User'
  import { mapGetters, mapMutations } from 'vuex'
  import ChangeStep from '@/views/CloudOT/maintenance/ChangeStep'
  import { exlout, UploadImg } from '@/api/File'
  import { getRoleuser, queryRoledepartment } from '@/api/Role'
  import { Roletree } from '@/api/Menu'

  export default {
    name: 'CreateTicket',
    components: {
      ChangeStep,
    },
    data() {
      return {
        tickettype: [
          {
            label: '巡检',
            value: '巡检',
          },
          {
            label: '抢修',
            value: '抢修',
          },
          {
            label: '故障',
            value: '故障',
          },
        ],
        showdeviceFlag: false,
        created: 0,
        Assigned: 0,
        loading: false,
        user: [],
        viewticket: false,
        form: {
          name: '',
          product: '',
          device: '',
          type: '',
          info: {
            startdata: '',
            completiondata: '',
          },
        },
        title: '',
        dialogFormVisible: false,
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
            {
              required: true,
              message: '请选择所属项目',
              trigger: 'change',
            },
          ],
          'info.device': [
            {
              required: true,
              message: '请选择设备',
              trigger: 'change',
            },
          ],
          type: [
            {
              required: true,
              message: '请输入工单类型',
              trigger: 'change',
            },
          ],
          'info.startdata': [
            {
              required: true,
              message: '请选择开始时间',
              trigger: 'change',
            },
          ],
          'info.completiondata': [
            {
              required: true,
              message: '请选择要求完成时间',
              trigger: 'change',
            },
          ],
          'info.principal': [
            {
              required: true,
              message: '请选择负责人',
              trigger: 'change',
            },
          ],
          'info.executor': [
            {
              required: true,
              message: '请选择执行人',
              trigger: 'change',
            },
          ],
        },
        list: [],
        // aclObj: {},
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        status: [
          {
            label: '待接收',
            value: 0,
          },
          {
            label: '处理中',
            value: 1,
          },
          {
            label: '已处理',
            value: 2,
          },
        ],
        queryForm: {
          devicename: '',
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
        objectid: 'user/objectId',
        role: 'acl/role',
        username: 'user/username',
        currentDepartment: 'user/currentDepartment',
      }),
      _deviceStep: {
        get() {
          return this.$store.state.global._deviceStep
        },
        set(v) {
          this.set_deviceStep(v)
        },
      },
    },
    watch: {
      _deviceStep: function (e) {
        if (e == -1) this.fetchData()
      },
    },
    created() {},
    mounted() {
      this.fetchData()
    },
    methods: {
      getistimeout(row) {
        let oldtime = new Date(row.info.completiondata).getTime()
        if (new Date() > oldtime && row.status != 2) {
          return `<span><font color="#FF0000"> 超时 </font></span>`
        } else {
          return `<span><font color="#0000FF"> 未超时 </font></span>`
        }
      },
      async roleuser() {
        let params = {
          where: {
            objectId: this.currentDepartment.objectId,
          },
          include: true,
          limit: 10,
        }
        const { results } = await getRoleuser(params)
        this.user = results
      },
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        dgiotlog.log(this.selectedList)
      },
      ...mapMutations({
        set_deviceStep: 'global/set_deviceStep',
      }),
      getStatus(type = 0) {
        // type == 0 ? '' : ''
        switch (type) {
          case 0:
            return this.$translateTitle('Maintenance.To be assigned')
            break
          case 1:
            return this.$translateTitle('Maintenance.processing')
            break
          case 2:
            return this.$translateTitle('Maintenance.processed')
            break
          case 3:
            return this.$translateTitle('Maintenance.returned')
            break
          default:
            return type
        }
      },
      showInfo(row, ishard = false, isfooter = true) {
        this.title = this.$translateTitle('Maintenance.view Ticket')
        this.detail = {}
        this.showdeviceFlag = false
        this.ishard = ishard
        this.isfooter = isfooter
        let { status = 0 } = row
        this.detail = row
        this.step = status + 1
        this.set_deviceStep(status)
        this.showdeviceFlag = true
      },
      receive(row) {
        this.title = this.$translateTitle('Maintenance.receive Ticket')
        this.detail = {}
        this.showdeviceFlag = false
        this.ishard = true
        this.isfooter = false
        let { status = 0 } = row
        this.detail = row
        this.step = status + 1
        this.set_deviceStep(status)
        this.showdeviceFlag = true
      },
      dealwith(row) {
        this.title = this.$translateTitle('Maintenance.dealwith Ticket')
        this.detail = {}
        this.showdeviceFlag = false
        this.ishard = true
        this.isfooter = false
        let { status = 0 } = row
        this.detail = row
        this.step = status + 1
        this.set_deviceStep(status)
        this.showdeviceFlag = true
      },
      async fetchData(args = {}) {
        if (!args.limit) {
          args = this.queryForm
        }
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          count: 'objectId',
          where: {
            user: this.objectid,
            status: {
              $lt: 3,
            },
          },
        }
        if (String(this.queryForm.status + '').length > 0) {
          params.where['status'] = this.queryForm.status
        }
        this.queryForm.number
          ? (params.where.number = { $regex: this.queryForm.number })
          : ''
        this.queryForm.product
          ? (params.where['product'] = this.queryForm.product)
          : ''
        this.queryForm.type
          ? (params.where.type = { $regex: this.queryForm.type })
          : ''
        if (this.queryForm.searchDate?.length) {
          params.where['info.startdata'] = {
            $gt: new Date(this.queryForm.searchDate[0]).getTime(),
          }
          params.where['info.completiondata'] = {
            $lt: new Date(this.queryForm.searchDate[1]).getTime(),
          }
        }
        await query_object('Maintenance', params)
          .then((res) => {
            const { results = [], count = 0 } = res
            this.list = results
            this.total = count
            loading.close()
          })
          .catch((e) => {
            this.$baseMessage(e, 'error', 'dgiot-hey-message-error')
            loading.close()
          })
      },
      async backChange(detail) {
        const { objectId, info } = detail
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '已回退',
          p: `${this.username} 回退了流程`,
        })
        const params = {
          status: 3,
          info: info,
        }
        const res = await update_object('Maintenance', objectId, params)
        if (res.updatedAt) {
          this.set_deviceStep(-1)
        }
        this.showdeviceFlag = false
      },
      //接收
      async receiveChange(detail) {
        const { objectId, info } = detail
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '已接收',
          p: `${this.username} 接收了工单`,
        })
        const params = {
          status: 1,
          info: info,
        }
        const res = await update_object('Maintenance', objectId, params)
        if (res.updatedAt) {
          this.set_deviceStep(-1)
        }
        this.showdeviceFlag = false
      },
      //处理
      async dealwithChange(detail) {
        const { objectId, info } = detail
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '已处理',
          p: `${this.username} 处理了工单`,
        })
        const params = {
          status: 2,
          info: info,
        }
        const res = await update_object('Maintenance', objectId, params)
        if (res.updatedAt) {
          this.set_deviceStep(-1)
        }
        this.showdeviceFlag = false
      },
    },
  }
</script>
<style lang="scss" scoped></style>
