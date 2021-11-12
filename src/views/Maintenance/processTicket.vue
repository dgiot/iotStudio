<!--
* @Author: h7ml
* @Date: 2021-07-02 10:29:31
* @LastEditors: h7ml
* @LastEditTime: 2021-07-02 10:29:31
* @Description:
* @FilePath: src\views\Maintenance\myticket.vue
-->
<template>
  <div class="mycontainer">
    <div class="ticker-dialog">
      <div class="home_dialog">
        <el-dialog
          :append-to-body="true"
          :title="detail.name"
          :visible.sync="showdeviceFlag"
          width="100vh"
        >
          <change-step
            ref="ChangeStep"
            :detail="detail"
            :show-footer="isfooter"
            :show-hard="ishard"
            :step="step"
          />
          <span slot="footer" class="dialog-footer">
            <el-button v-show="detail.status == 0" @click="set_deviceStep(0)">
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

            <el-button size="mini" type="primary" @click.native="dealwith()">
              {{ $translateTitle('Maintenance.deal with') }}
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
          :append-to-body="true"
          :title="$translateTitle('Maintenance.create Ticket')"
          :visible.sync="dialogFormVisible"
          width="90vh"
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
              :label="$translateTitle('Maintenance.project')"
              prop="product"
            >
              <el-select
                v-model="form.product"
                :placeholder="
                  $translateTitle('Maintenance.Please choose the product')
                "
                style="width: 100%"
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
              prop="name"
            >
              <el-select
                v-model="form.name"
                :disabled="!Device.length"
                :placeholder="
                  Device.length == 0
                    ? $translateTitle('Maintenance.Please choose the product')
                    : $translateTitle('Maintenance.Please select a device')
                "
                style="width: 100%"
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
              <el-input v-model="form.type" />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('Maintenance.Ticket description')"
            >
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
            <el-form-item :label="$translateTitle('Maintenance.photo')">
              <el-upload
                action="#"
                :auto-upload="true"
                :http-request="myUpload"
                list-type="picture-card"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div v-for="(item, index) in form.photo" :key="index">
                  <img
                    alt=""
                    class="el-upload-list__item-thumbnail"
                    :src="item.url"
                  />
                </div>
              </el-upload>
              <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
                <img alt="" :src="dialogImageUrl" width="100%" />
              </el-dialog>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="submitForm('form')">
              {{ $translateTitle('Maintenance.Create now') }}
            </el-button>
            <el-button @click="resetForm('form')">
              {{ $translateTitle('Maintenance.Reset') }}
            </el-button>
          </div>
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
          <el-form-item :label="$translateTitle('Maintenance.number')">
            <el-input
              v-model.trim="queryForm.number"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('Maintenance.projects')">
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

          <el-form-item :label="$translateTitle('Maintenance.type')">
            <el-input
              v-model="queryForm.type"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket type')"
            />
          </el-form-item>
          <!--          <el-form-item label="账号">-->
          <!--            <el-input-->
          <!--              v-model.trim="queryForm.account"-->
          <!--              clearable-->
          <!--              placeholder="请输入账号"-->
          <!--            />-->
          <!--          </el-form-item>-->
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
              :disabled="!selectedList.length"
              icon="el-icon-s-promotion"
              size="mini"
              type="primary"
              @click="batchExport(selectedList)"
            >
              {{ $translateTitle('Maintenance.Export') }}
            </el-button>
            <!--            <el-button-->
            <!--              icon="el-icon-user"-->
            <!--              type="info"-->
            <!--              disabled-->
            <!--              :size="created % 2 == 0 ? 'small' : 'medium'"-->
            <!--              @click="handleCreated('created')"-->
            <!--            >-->
            <!--              {{ $translateTitle('Maintenance.I created') }}-->
            <!--            </el-button>-->
            <!--            <el-button-->
            <!--              icon="el-icon-user-solid"-->
            <!--              type="success"-->
            <!--              :size="Assigned % 2 == 0 ? 'mini' : 'small'"-->
            <!--              @click="handleCreated('Assigned')"-->
            <!--            >-->
            <!--              {{ $translateTitle('Maintenance.Assigned to me') }}-->
            <!--            </el-button>-->
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      border
      :data="list"
      :height="height"
      stripe
      @selection-change="changeBox"
    >
      <el-table-column
        align="center"
        class-name="isCheck"
        show-overflow-tooltip
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="number"
        show-overflow-tooltip
        sortable
        width="120"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ getStatus(row.status, row) }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.project')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ row.info && row.info.productname ? row.info.productname : '' }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ row.info && row.info.devicename ? row.info.devicename : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ row.info && row.info.createdname ? row.info.createdname : '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.the starting time')"
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
        width="220"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="showInfo(row, true, false)"
          >
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <!--          <el-button-->
          <!--            v-show="row.status == 0"-->
          <!--            size="mini"-->
          <!--            type="success"-->
          <!--            @click="showInfo(row)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.Dispatch') }}-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            v-show="row.status == 1"-->
          <!--            size="mini"-->
          <!--            type="success"-->
          <!--            @click="showInfo(row)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.deal with') }}-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            v-show="row.status == 2"-->
          <!--            size="mini"-->
          <!--            type="info"-->
          <!--            @click="showInfo(row)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.Evaluation') }}-->
          <!--          </el-button>-->
          <el-button size="mini" type="info" @click="showInfo(row, true, true)">
            {{ $translateTitle('Maintenance.deal with') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <vab-empty />
      </template>
    </el-table>
    <vab-Pagination
      v-show="total > 0"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="total"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
  import { create_object, query_object, update_object } from '@/api/shuwa_parse'
  import { batch } from '@/api/Batch'
  import { queryDevice } from '@/api/Device'
  import { mapGetters, mapMutations } from 'vuex'
  import ChangeStep from '@/views/Maintenance/ChangeStep'
  import { exlout, UploadImg } from '@/api/File'

  export default {
    name: 'ProcessTicket',
    components: {
      ChangeStep,
    },
    data() {
      return {
        showdeviceFlag: false,
        created: 0,
        Assigned: 0,
        form: {
          receiveuseid: '',
          productname: '',
          devicename: '',
          createdname: '',
          receiveusername: '',
          receiveuserphone: '',
          name: '',
          product: '',
          type: '',
          description: '',
          photo: [],
          objectId: '',
        },
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
          name: [
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
        },
        list: [],
        // aclObj: {},
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        status: [
          {
            key: 0,
            text: 'Maintenance.To be assigned',
          },
          {
            key: 1,
            text: 'Maintenance.Assigned',
          },
          {
            key: 2,
            text: 'Maintenance.Processed',
          },
          {
            key: 3,
            text: 'Maintenance.Statement',
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
      }),
      _deviceStep: {
        get() {
          console.log(
            'this.$store.state.global._deviceStep',
            this.$store.state.global._deviceStep
          )
          return this.$store.state.global._deviceStep
        },
        set(v) {
          console.log(
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
      _deviceStep: function (e) {
        console.log(e)
        if (e == -1) {
          this.fetchData()
          this.showdeviceFlag = false
        }
        // if (e == false) {
        //   this.fetchData()
        // }
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
      // this.fetchData()
      this.handleCreated('created')
    },
    methods: {
      myUpload(content) {
        console.log('e', content.file)
        let config = {
          headers: {
            proxy: true, // 是否开启代理
            produrl: '/', // 开启代理后的真实上传路径
            devurl: 'iotapi/',
          },
        }
        UploadImg(content.file, config)
          .then((res) => {
            if (res.data.url) {
              this.form.photo.push(res.data.url)
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
            console.log('error submit!!')
            return false
          }
        })
      },
      async createdTicket(from) {
        const setAcl = {}
        // setAcl['*'] = {
        //   read: true,
        //   write: true,
        // }
        setAcl[this.objectid] = {
          read: true,
          write: true,
        }
        const params = {
          number: moment(new Date()).unix() + '',
          type: from.type,
          // status: 0,
          // product: {
          //   objectId: from.product,
          //   __type: 'Pointer',
          //   className: 'Product',
          // },

          // user: {
          //   objectId: this.objectId,
          //   __type: 'Pointer',
          //   className: '_User',
          // },
          // ACL: this.aclObj,
          ACL: _.merge(setAcl, this.aclObj),
          info: {
            photo: from.photo,
            timeline: [
              {
                timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                h4: '生成工单',
                p: `${this.username}新建工单`,
              },
            ],
            description: from.description,
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            productid: from.product,
            productname: from.productname,
            devicename: from.devicename,
            deviceid: from.name,
            createdname: this.username,
            receiveusername: from.receiveusername,
            receiveuseid: from.receiveuseid,
            receiveuserphone: from.receiveuserphone,
          },
          device: {
            objectId: from.name,
            __type: 'Pointer',
            className: 'Device',
          },
        }
        const loading = this.$baseColorfullLoading()
        const res = await create_object('Maintenance', params)
        loading.close()
        console.log('res', res)
        this.fetchData()
        this.dialogFormVisible = false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        console.log(this.selectedList)
      },
      ...mapMutations({
        set_deviceStep: 'global/set_deviceStep',
      }),
      handleFold() {
        this.fold = !this.fold
        this.handleHeight()
      },
      /**
       *
       * @param row
       * @return {Promise<void>}
       */
      async batchExport(row) {
        console.log(row)
        try {
          const params = {
            results: [],
          }
          params['results'] = row
          const res = await exlout(params)
          this.$convertRes2Blob(res)
          this.$message.success(this.$translateTitle('node.export success'))
        } catch (error) {
          console.log(error)
          this.$message.error(
            this.$translateTitle('node.export error') + `${error}`
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
        if (this.fold) {
          this.height = this.$baseTableHeight(0) - 20
        } else {
          this.height = this.$baseTableHeight(0) - 30
        }
      },
      getStatus(type) {
        return this.$translateTitle('Maintenance.Assigned')
        // // type == 0 ? '' : ''
        // switch (type) {
        //   case 0:
        //     return this.$translateTitle('Maintenance.To be assigned')
        //     break
        //   case 1:
        //     return this.$translateTitle('Maintenance.Assigned')
        //     break
        //   case 2:
        //     return this.$translateTitle('Maintenance.Processed')
        //     break
        //   case 3:
        //     return this.$translateTitle('Maintenance.Statement')
        //     break
        //   default:
        //     return type
        //     console.log('other', type)
        // }
      },
      showInfo(row, ishard = false, isfooter = true) {
        this.showdeviceFlag = false
        console.log('row', row.status)
        this.ishard = ishard
        this.isfooter = isfooter
        let { status = 0 } = row
        this.detail = row
        this.step = status + 1
        this.set_deviceStep(status)
        this.showdeviceFlag = true
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
      handleCreated(type) {
        type == 'created' ? this.created++ : this.Assigned++
        this.fetchData()
      },
      async fetchData(args = {}) {
        console.log(this.created % 2, this.created, 'this.created')
        if (!args.limit) {
          args = this.queryForm
        }
        console.log(this.queryForm, 'queryForm', args)
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          where: {
            'info.receiveuseid':
              this.Assigned % 2 == 0 ? { $ne: '99' } : this.objectid,
            // 'info.createdname': this.username,
            number: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: null },
            status: 1,
            'info.productid': this.queryForm.product.length
              ? this.queryForm.product
              : { $ne: '99' },
            type: this.queryForm.type.length
              ? { $regex: this.queryForm.type }
              : { $ne: null },
          },
        }
        if (this.queryForm.searchDate?.length) {
          params.where['createdAt'] = {
            $gt: {
              __type: 'Date',
              iso: this.queryForm.searchDate[0],
            },
          }
          params.where['updatedAt'] = {
            $lt: {
              __type: 'Date',
              iso: this.queryForm.searchDate[1],
            },
          }
        }
        await query_object('Maintenance', params)
          .then((res) => {
            console.log(res, 'res')
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
            this.$message.error(`${e}`)
            loading.close()
          })
        console.log(this.list, 'this.list')
      },
      async prodChange(e) {
        console.log(e)
        this.Device = []
        this._Product.map((p) => {
          if (p.objectId == e) {
            this.form.productname = p.name
          }
        })
        this.form.name = ''
        const params = {
          where: { product: e },
        }
        const { results } = await queryDevice(params)
        console.log(results, '设备')
        this.Device = results
      },
      deviceChange(e) {
        this.Device.map((p) => {
          if (p.objectId == e) {
            this.form.devicename = p.name
          }
        })
        console.log(this.form.productname, this.form.devicename)
      },
      dispatch() {
        this.$refs.ChangeStep.$refs.step1.dispatchUser()
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
          this.set_deviceStep(-1)
          this.showdeviceFlag = false
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
          this.set_deviceStep(-1)
          this.showdeviceFlag = false
        }
      },
      dealwith() {
        this.$refs.ChangeStep.$refs.step2.dispatchUser()
      },
      check() {
        this.$refs.ChangeStep.$refs.step3.dispatchUser()
      },
    },
  }
</script>
<style lang="scss" scoped>
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
