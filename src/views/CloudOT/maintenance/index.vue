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
            <!--            <el-button-->
            <!--              :disabled="!selectedList.length"-->
            <!--              icon="el-icon-s-promotion"-->
            <!--              size="mini"-->
            <!--              type="primary"-->
            <!--              @click="batchExport(selectedList)"-->
            <!--            >-->
            <!--              {{ $translateTitle('Maintenance.Export') }}-->
            <!--            </el-button>-->
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
        fixed="right"
        :label="$translateTitle('Maintenance.operating')"
        width="160"
      >
        <template #default="{ row }">
          <el-button
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
  import ChangeStep from '../maintenance/ChangeStep'
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
            label: '已回退',
            value: 3,
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
          dgiotlog.log(
            'this.$store.state.global._deviceStep',
            this.$store.state.global._deviceStep
          )
          return this.$store.state.global._deviceStep
        },
        set(v) {
          dgiotlog.log(
            'this.$store.state.global._deviceStep',
            this.$store.state.global._deviceStep,
            v
          )
          this.set_deviceStep(v)
        },
      },
      aclObj() {
        let aclObj = {}
        this.role.map((e) => {
          dgiotlog.log(e.name, '')
          aclObj[`${'role' + ':' + e.name}`] = {
            read: true,
            write: true,
          }
        })
        return aclObj
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
      getistimeout(completiondata) {
        let oldtime = new Date(completiondata).getTime()
        if (new Date() > oldtime) {
          return `<span><font color="#FF0000"> 超时 </font></span>`
        } else {
          return `<span><font color="#0000FF"> 未超时 </font></span>`
        }
      },
      pubticket() {
        //初始化的时候重置表单，清空效验规则
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
        this.form = {
          name: '',
          product: '',
          device: '',
          type: '',
          info: {
            startdata: '',
            completiondata: '',
          },
        }
        this.viewticket = false
        this.roleuser()
        this.title = this.$translateTitle('Maintenance.create Ticket')
        this.dialogFormVisible = true
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
      myUpload(content) {
        const file = content.file
        let extension = file.name.substring(file.name.lastIndexOf('.') + 1)

        const params = {
          file: file,
          // scene: 'ticket',
          path: 'ticket',
          filename: 'ticket' + `${moment().format('x')}.${extension}`,
        }
        dgiotlog.log('extension', params)
        UploadImg(params)
          .then((res) => {
            if (res.data.url) {
              this.form.info.photo.push(res.data.url)
              console.log('上传成功的回调', res.data.url, this.form.photo)
            } else {
              console.log('no up url ', res)
            }
          })
          .catch((e) => {
            console.log('出错了', e)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createdTicket(this.form)
          } else {
            return false
          }
        })
      },
      async createdTicket(from) {
        const setAcl = {}
        setAcl[from.principal] = {
          read: true,
          write: true,
        }
        setAcl[from.executor] = {
          read: true,
          write: true,
        }
        setAcl[this.objectid] = {
          read: true,
          write: true,
        }
        setAcl[`${'role' + ':' + this.currentDepartment.name}`] = {
          read: true,
          write: true,
        }
        const params = {
          number: moment(new Date()).unix() + '',
          type: from.type,
          status: 0,
          ACL: _.merge(setAcl, this.aclObj),
          product: {
            objectId: from.product,
            __type: 'Pointer',
            className: 'Product',
          },
          device: {
            objectId: from.device,
            __type: 'Pointer',
            className: 'Device',
          },
          user: {
            objectId: this.objectId,
            __type: 'Pointer',
            className: '_User',
          },
          // ACL: this.aclObj,
          info: {
            photo: from.info.photo,
            timeline: [
              {
                timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                h4: '发布工单',
                p: `${this.username}创建工单发布给${from.info.executorname}`,
              },
            ],
            description: from.info.description,
            productname: from.info.productname,
            devicename: from.info.devicename,
            createdname: this.username,
            startdata: new Date(from.info.startdata).getTime(),
            completiondata: new Date(from.info.completiondata).getTime(),
            principal: from.info.principal,
            principalname: from.info.principalname,
            executor: from.info.executor,
            executorname: from.info.executorname,
          },
        }
        const loading = this.$baseColorfullLoading()
        const res = await create_object('Maintenance', params)
        this.set_deviceStep(-1)
        loading.close()
        this.fetchData()
        this.dialogFormVisible = false
      },
      resetForm(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
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
      /**
       *
       * @param row
       * @return {Promise<void>}
       */
      async batchExport(row) {
        dgiotlog.log(row)
        try {
          const params = {
            results: [],
          }
          params['results'] = row
          const res = await exlout(params)
          this.$convertRes2Blob(res)
          this.$message({
            showClose: true,
            duration: 2000,
            message: this.$translateTitle('node.export success'),
            type: 'success',
          })
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('node.export error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
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
              'dgiot-hey-message-success'
            )
            this.fetchData()
          }
        )
      },
      getStatus(type = 0) {
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
      republish(row) {
        this.title = this.$translateTitle('Maintenance.republish')
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
        dgiotlog.log(this.created % 2, this.created, 'this.created')
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
          where: {},
        }
        if (String(this.queryForm.status + '').length > 0) {
          params.where['status'] = this.queryForm.status
        }
        if (isNaN(params.where['status'])) {
          delete params.where['status']
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
            dgiotlog.log(res, 'res')
            const { results = [], count = 0 } = res
            this.list = results
            this.list.forEach((e) => {
              e._user = '暂无'
              if (e.ACL) {
                for (var key in e.ACL) {
                  e._user = key.substr(0)
                }
              }
            })
            this.total = count
            loading.close()
          })
          .catch((e) => {
            this.$baseMessage(e, 'error', 'dgiot-hey-message-error')
            loading.close()
          })
        dgiotlog.log(this.list, 'this.list')
      },
      async prodChange(e) {
        this.Device = []
        this._Product.map((p) => {
          if (p.objectId == e) {
            this.form.info.productname = p.name
          }
        })
        this.form.name = ''
        const params = {
          where: { product: e },
        }
        const { results } = await queryDevice(params)
        this.Device = results
      },
      deviceChange(e) {
        console.log('e', e)
        this.Device.map((p) => {
          if (p.objectId == e) {
            this.form.info.devicename = p.name
          }
        })
      },
      principalChange(e) {
        this.user.map((p) => {
          if (p.objectId == e) {
            this.form.info.principalname = p.nick
          }
        })
      },
      executorChange(e) {
        this.user.map((p) => {
          if (p.objectId == e) {
            this.form.info.executorname = p.nick
          }
        })
      },
      async dispatch(from) {
        const { ACL, objectId, info } = from
        const setAcl = {}
        setAcl[info.principal] = {
          read: true,
          write: true,
        }
        setAcl[info.executor] = {
          read: true,
          write: true,
        }
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '重新发布工单',
          p: `${this.username}重新发布工单给${from.info.executorname}`,
        })
        const params = {
          status: 0,
          ACL: _.merge(setAcl, ACL),
          info: info,
        }
        const loading = this.$baseColorfullLoading()
        const res = await update_object('Maintenance', from.objectId, params)
        this.set_deviceStep(-1)
        loading.close()
        this.fetchData()
        this.showdeviceFlag = false
      },
    },
  }
</script>
<style lang="scss" scoped></style>
