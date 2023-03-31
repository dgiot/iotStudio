<template>
  <div class="comprehensive-table-container">
    <div class="dialog">
      <el-dialog
        :append-to-body="true"
        :title="title"
        :visible.sync="showdeviceFlag"
        width="100vh"
      >
        <change-step ref="ChangeStep" :detail="detail" :step="step" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="showdeviceFlag = !showdeviceFlag">
            {{ $translateTitle('tagsView.close') }}
          </el-button>
          <el-button
            v-show="detail.status == 3 && objectid == detail.info.created"
            type="primary"
            @click="dispatch(detail)"
          >
            {{ $translateTitle('Maintenance.republish') }}
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        :append-to-body="true"
        :title="title"
        :visible.sync="dialogFormVisible"
        width="70vh"
      >
        <el-form
          ref="form"
          class="create-ticker"
          label-width="auto"
          :model="form"
          :rules="rules"
          size="medium "
        >
          <el-form-item
            :label="$translateTitle('equipment.Products')"
            prop="product"
          >
            <span v-if="viewticket">{{ form.info.productname }}</span>
            <el-select
              v-if="!viewticket"
              v-model="form.product"
              :placeholder="
                $translateTitle('Maintenance.Please choose the product')
              "
              style="width: 50%"
              @change="prodChange"
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
          <el-form-item
            :label="$translateTitle('Maintenance.Equipment name')"
            prop="info.device"
          >
            <span v-if="viewticket">{{ form.info.devicename }}</span>
            <el-select
              v-if="!viewticket"
              v-model="form.info.device"
              :disabled="!Device.length"
              :placeholder="
                Device.length == 0
                  ? $translateTitle('Maintenance.Please choose the product')
                  : $translateTitle('Maintenance.Please select a device')
              "
              style="width: 50%"
              @change="deviceChange"
            >
              <el-option
                v-for="(item, index) in Device"
                v-show="item.objectId"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.Ticket type')"
            prop="type"
          >
            <el-select
              v-model="form.type"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket type')"
              style="width: 50%"
            >
              <el-option
                v-for="(item, index) in tickettype"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.planstartdata')"
            prop="info.startdata"
          >
            <el-date-picker
              v-model="form.info.startdata"
              format="yyyy-MM-dd"
              :placeholder="$translateTitle('Maintenance.planstartdata')"
              style="width: 50%"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.planenddata')"
            prop="info.completiondata"
          >
            <el-date-picker
              v-model="form.info.completiondata"
              format="yyyy-MM-dd"
              :placeholder="$translateTitle('Maintenance.planenddata')"
              style="width: 50%"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.advance')"
            prop="info.advance"
          >
            <el-input-number v-model="form.info.advance" />
          </el-form-item>
          <!--          <el-form-item-->
          <!--            :label="$translateTitle('Maintenance.principal')"-->
          <!--            prop="info.principal"-->
          <!--          >-->
          <!--            <el-cascader-->
          <!--              v-model="form.info.principal"-->
          <!--              :options="user"-->
          <!--              :placeholder="$translateTitle('Maintenance.selectprincipal')"-->
          <!--              :show-all-levels="false"-->
          <!--              style="width: 50%"-->
          <!--              @change="handleChangeDepart"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item-->
          <!--            :label="$translateTitle('Maintenance.executor')"-->
          <!--            prop="info.executor"-->
          <!--          >-->
          <!--            <el-cascader-->
          <!--              v-model="form.info.executor"-->
          <!--              :options="user"-->
          <!--              :placeholder="$translateTitle('Maintenance.selectexecutor')"-->
          <!--              :show-all-levels="false"-->
          <!--              style="width: 50%"-->
          <!--              @change="handleChangeExecutor"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item
            :label="$translateTitle('Maintenance.Ticket description')"
          >
            <el-input v-model="form.info.description" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="submitForm('form')">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </div>
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
            <el-button
              icon="el-icon-circle-plus-outline"
              size="mini"
              type="primary"
              @click="pubticket()"
            >
              {{ $translateTitle('Maintenance.pub Ticket') }}
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
      <!--      @selection-change="changeBox"-->
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        class-name="isCheck"-->
      <!--        show-overflow-tooltip-->
      <!--        type="selection"-->
      <!--        width="55"-->
      <!--      />-->
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
        :label="$translateTitle('Maintenance.maintenance_personnel')"
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
        :label="$translateTitle('Maintenance.publisher')"
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
        :label="$translateTitle('Maintenance.operating')"
        width="260"
      >
        <template #default="{ row }">
          <el-button
            v-if="row.status == 3 && objectid == row.info.created"
            size="mini"
            type="danger"
            @click="republish(row)"
          >
            {{ $translateTitle('Maintenance.republish') }}
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="showInfo(row, true, false)"
          >
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <el-button
            v-if="objectid == row.info.created"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            {{ $translateTitle('Maintenance.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <dgiot-empty />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination> -->
    <!-- <dgiot-Pagination
      v-show="total > 0"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="total"
      @pagination="fetchData"
    /> -->
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
  import { roletree, getRoleuser, queryRoledepartment } from '@/api/Role'
  import { userTree } from '@/api/User'
  import { Roletree } from '@/api/Menu'
  export default {
    name: 'CreateTicket',
    components: {
      ChangeStep,
    },
    data() {
      return {
        ACL: {},
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
            advance: '1',
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
          'info.advance': [
            {
              required: true,
              message: '请输入提醒时间',
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
          limit: 10,
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
      handleCurrentChange(e) {
        console.log(e)
        this.queryForm.pageNo = e
        this.fetchData()
      },
      handleSizeChange(e) {
        console.log(e)
        this.queryForm.limit = e
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      handleChangeExecutor(value) {
        this.form.info.executor = value[value.length - 1]
        this.form.info.executorname = value[value.length - 1].label
      },
      handleChangeDepart(value) {
        this.form.info.principal = value[value.length - 1]
        this.form.info.principalname = value[value.length - 1].label
      },
      async getRoletree() {
        const res = await roletree()
        this.roleList = res.results
      },
      getistimeout(row) {
        let oldtime = new Date(row.info.completiondata).getTime()
        if (new Date() > oldtime && row.status != 2) {
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
            photo: [],
            startdata: '',
            completiondata: '',
            advance: 7,
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
        const res = await userTree()
        console.log('人员树', res)
        this.user = res.data.options
        // const { results } = await getRoleuser(params)
        // this.user = results
        // this.impuser = results
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
              // console.log('上传成功的回调', res.data.url, this.form.info.photo)
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
        let setAcl = this.ACL
        // setAcl[from.info.principal] = {
        //   read: true,
        //   write: true,
        // }
        // if (from.info.executorid) {
        //   setAcl[from.info.executorid] = {
        //     read: true,
        //     write: true,
        //   }
        // }

        // setAcl[this.objectid] = {
        //   read: true,
        //   write: true,
        // }
        const params = {
          number: moment(new Date()).unix() + '',
          type: from.type,
          status: 0,
          ACL: setAcl,
          product: {
            objectId: from.product,
            __type: 'Pointer',
            className: 'Product',
          },
          device: {
            objectId: from.info.device,
            __type: 'Pointer',
            className: 'Device',
          },
          user: {
            objectId: from.info.executorid,
            __type: 'Pointer',
            className: '_User',
          },
          // ACL: this.aclObj,
          info: {
            advance: from.info.advance,
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
            created: this.objectid,
            createdname: this.username,
            startdata: new Date(from.info.startdata).getTime(),
            completiondata: new Date(from.info.completiondata).getTime(),
            // principal: from.info.principal.objectId,
            // principalname: from.info.principalname,
            executorid: from.info.executorid,
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
      handleDelete(row) {
        let batchParams = []
        batchParams.push({
          method: 'DELETE',
          path: `/classes/Maintenance/${row.objectId}`,
          body: {},
        })
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
      async fetchData() {
        let args = this.queryForm
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: this.queryForm.limit,
          order: this.queryForm.order,
          skip: (this.queryForm.pageNo - 1) * this.queryForm.limit,
          count: 'objectId',
          where: {
            // 'info.created': this.objectid,
          },
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
        // console.log(e)
        this.Device.map((p) => {
          if (p.objectId == e) {
            console.log('device', p)
            this.ACL = p.ACL
            this.form.info.devicename = p.name
            this.form.info.executorname = p.maintenance_personnel.nick
            this.form.info.executorid = p.maintenance_personnel.userid
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
      //重新发布
      async dispatch(detail) {
        const { ACL, objectId, info } = detail
        const setAcl = {}
        // setAcl[info.principal] = {
        //   read: true,
        //   write: true,
        // }
        setAcl[info.executorid] = {
          read: true,
          write: true,
        }
        info.timeline.push({
          timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          h4: '重新发布工单',
          p: `${this.username}重新发布工单给${info.executorname}`,
        })
        const params = {
          status: 0,
          user: {
            objectId: info.executorid,
            __type: 'Pointer',
            className: '_User',
          },
          ACL: _.merge(setAcl, ACL),
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
