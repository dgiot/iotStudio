<!--
* @Author: h7ml
* @Date: 2021-07-27 09:56:16
* @LastEditors:
* @LastEditTime: 2021-07-27 09:56:16
* @Description: device alert
* @FilePath: src\views\Maintenance\alert.vue
* @DocumentLink: https://prod.iotn2n.com/#/CloudOt/alarm
-->

<template>
  <div class="mycontainer">
    <div class="ticker-dialog">
      <el-dialog v-drag :append-to-body="true" :visible.sync="parserView">
        <ele-form
          v-model="alertConfig.config"
          :config="formConfig"
          pure
          :request-fn="handleSubmit"
          v-bind="alertConfig.config"
          @request-success="handleSuccess(alertConfig)"
        />
      </el-dialog>
      <el-dialog
        v-drag
        :append-to-body="true"
        :visible.sync="dynamicformView"
        width="50vh"
      >
        <el-form>
          <el-form-item label="产品名称" label-width="200">
            <span>{{ editRow.productname }}</span>
          </el-form-item>
          <el-form-item label="设备编号" label-width="200">
            <span>{{ devicename }}</span>
          </el-form-item>
        </el-form>
        <dgiot-amis :schema="amisData" :show-help="false" />
      </el-dialog>
    </div>
    <dgiot-query-form class="query-form">
      <dgiot-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="auto"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('alert.productname')">
            <el-select
              v-model="queryForm.productName"
              clearable
              :placeholder="$translateTitle('equipment.entername')"
            >
              <el-option
                v-for="(item, index) in _Product"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('alert.isprocess')">
            <el-select
              v-model="queryForm.isprocess"
              clearable
              :placeholder="$translateTitle('alert.isprocess')"
            >
              <el-option
                v-for="(item, index) in processAll"
                :key="index"
                :label="item.key"
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
              type="primary"
              @click.native="fetchData"
            >
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="!selectedList.length"
              icon="el-icon-delete"
              type="danger"
              @click="fetchDelete(selectedList)"
            >
              {{ $translateTitle('Maintenance.delete') }}
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
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
        :label="$translateTitle('alert.alert number')"
        prop="objectId"
        show-overflow-tooltip
        sortablesortable
        width="120"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('alert.productname')"
        prop="productname"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.devicenumber')"
        prop="devaddr"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.createdAt')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$translateTitle('alert.Alarm status')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          <el-tag
            effect="dark"
            :type="row.content.alertstatus ? 'danger' : 'success'"
          >
            {{
              row.content.alertstatus
                ? $translateTitle('alert.start')
                : $translateTitle('alert.stop')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('alert.Alarm handling')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          <el-link effect="dark" :type="row.status == 1 ? 'success' : 'info'">
            {{
              row.status == 1
                ? $translateTitle('Maintenance.Processed')
                : row.status == 0
                ? $translateTitle('Maintenance.Untreated')
                : $translateTitle('Maintenance.Distort')
            }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('alert.process')"
        prop="process"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.operating')"
        prop="name"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button size="mini" type="primary" @click="showdynamicform(row)">
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="primary"-->
          <!--            @click="showInfo(row.type, row.content, row.objectId)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.View') }}-->
          <!--          </el-button>-->
          <!--          <el-button v-show="row.status == 0" type="success">-->
          <!--            {{ $translateTitle('Maintenance.Dispatch') }}-->
          <!--          </el-button>-->
          <!--          <el-button v-show="row.status == 1" type="success">-->
          <!--            {{ $translateTitle('Maintenance.Evaluation') }}-->
          <!--          </el-button>-->
          <!--          <el-button v-show="row.status == 3" type="info">-->
          <!--            {{ $translateTitle('Maintenance.deal with') }}-->
          <!--          </el-button>-->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row.objectId)"
          >
            {{ $translateTitle('Maintenance.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <dgiot-empty />
      </template>
    </el-table>
    <!--    <DgiotPagination-->
    <!--      v-show="total"-->
    <!--      :limit.sync="queryForm.pageSize"-->
    <!--      :page.sync="queryForm.pageNo"-->
    <!--      :total="total"-->
    <!--      @pagination="fetchData"-->
    <!--    />-->
    <dgiot-parser-pagination
      :key="paginationKey + 'forensics'"
      ref="forensics"
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
  </div>
</template>

<script>
  import {
    delNotification,
    putNotification,
    queryNotification,
  } from '@/api/Notification'
  import { batch } from '@/api/Batch'
  import { getProduct } from '@/api/Product'
  import { mapGetters } from 'vuex'
  import { Promise } from 'q'
  import { getView } from '@/api/View'

  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        paginationKey: moment(new Date()).valueOf() + '',
        editRow: {},
        amisData: {},
        paginations: { layout: 'total, sizes, prev, pager, next, jumper' },
        queryPayload: {
          excludeKeys: 'dynamicform',
          include: '',
          order: '-createdAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        selectedList: [],
        isDisable: false,
        parserView: false,
        dynamicformView: false,
        formConfig: {},
        alertConfig: {},
        dynamicformInfo: {},
        alertId: '',
        step: 1,
        detail: {},
        deviceFlag: false,
        AllDevice: [],
        height: this.$baseTableHeight(0),
        dialogFormVisible: false,
        types: ['故障维修'],
        Device: [],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        formLabelWidth: '140px',
        process: '',
        status: '',
        devicename: '',
        rules: {
          product: [
            {
              required: true,
              message: '请选择活动区域',
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: '请选择活动区域',
              trigger: 'change',
            },
          ],
          type: [
            {
              required: true,
              message: '请选择活动资源',
              trigger: 'change',
            },
          ],
        },
        processAll: [
          {
            key: '未处理',
            value: 0,
          },
          {
            key: '已处理',
            value: 1,
          },
          {
            key: '误报',
            value: 2,
          },
        ],
        list: [],
        // aclObj: {},
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          productName: '',
          isprocess: '',
          number: '',
          product: '',
          type: '',
          searchDate: [],
          limit: 10,
          skip: 0,
          order: '-createdAt',
          keys: 'objectId',
        },
      }
    },
    computed: {
      ...mapGetters({
        _Product: 'user/_Product',
        objectId: 'user/objectId',
        role: 'acl/role',
        username: 'user/username',
        currentDepartment: 'user/currentDepartment',
      }),
    },

    created() {},
    mounted() {
      dgiotlogger.log(this._Product)
      console.log(JSON.stringify(this._Product))
      this.fetchData()
    },
    methods: {
      async paginationQuery(queryPayload) {
        this.queryPayload = queryPayload
      },
      fetchDelete(row) {
        let batchParams = []
        row.forEach((item) => {
          batchParams.push({
            method: 'DELETE',
            path: `/classes/Notification/${item.objectId}`,
            body: {},
          })
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
            setTimeout(() => {
              this.fetchData()
            }, 1500)
          }
        )
      },
      handleSubmit(data) {
        dgiotlog.log('data', data)
        // eslint-disable-next-line no-console
        return Promise.resolve()
      },
      /**
       *
       * @param
       * @returns
       */
      async handleSuccess(item) {
        const { table } = item
        const params = {
          public: true,
        }
        if (!table) return
        const loading = this.$baseColorfullLoading(3)
        try {
          const res = await this.$update_object(table, this.alertId, params)
          dgiotlog.log(res)
          loading.close()
          // this.$message.success(`${res}`)
        } catch (error) {
          dgiotlog.log(error)
          loading.close()
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
        this.$nextTick(() => {
          this.parserView = false
          this.fetchData()
        })
      },
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        dgiotlog.log(this.selectedList)
      },
      async submitAlert(alertId) {
        const Loading = this.$baseColorfullLoading(4)
        Loading.close()
        let alertParams = {
          process: this.process,
          status: Number(this.status),
        }
        try {
          const res = await putNotification(alertId, alertParams)
          dgiotlog.log(res)
          this.$message({
            showClose: true,
            duration: 2000,
            message: '处理成功',
            type: 'success',
          })
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage('处理失败', 'error', 'dgiot-hey-message-error')
        }
        this.fetchData()
        this.dynamicformView = false
      },
      async showdynamicform(row) {
        localStorage.setItem('parse_objectid', row.deviceid)
        localStorage.setItem('parse_notificationid', row.objectId)
        this.amisData = {}
        this.devicename = row.devaddr
        this.editRow = row
        this.dynamicformView = true
        const { data } = await getView(row.content._viewid)
        this.amisData = data
      },
      async showInfo(type, content, alertId) {
        const Loading = this.$baseColorfullLoading(4)
        dgiotlog.log(type, content)
        var [productId, profileId] = type.split('_')
        dgiotlog.log(productId, profileId)
        // 拿到Product 中的profile
        this.alertId = alertId
        try {
          const { config } = await getProduct(productId)
          Loading.close()
          const { parser = [], profile = [] } = config
          const _mergeProfile = [].concat(profile, parser)
          dgiotlog.log(_mergeProfile, '_mergeProfile')
          let _profileConfig = _mergeProfile.map((e) => {
            if (e.uid == profileId) {
              return e
            }
          })
          dgiotlog.log(_profileConfig, '_profileConfig')
          this.formConfig = _profileConfig[0].config
          this.alertConfig = _profileConfig[0]
          dgiotlog.log(this.formConfig, 'formConfig')
          // this.$message.success(`${res}`)
        } catch (error) {
          dgiotlog.log(error)
          Loading.close()
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
        this.formConfig = _.merge(content, this.formConfig)
        dgiotlog.log('_profileConfig', this.formConfig)
        this.$nextTick(() => {
          this.parserView = true
        })
      },
      async handleDelete(objectId) {
        const res = await delNotification(objectId)
        if (res == {}) {
          this.$message({
            showClose: true,
            duration: 2000,
            message:
              this.$translateTitle('Maintenance.delete') +
              this.$translateTitle('message.success'),
            type: 'success',
          })
        }
        this.fetchData()
      },
      async fetchData(args = {}) {
        this.paginationKey = moment(new Date()).valueOf() + ''
        if (!args.limit) {
          args = this.queryForm
        }

        this.listLoading = false
        const loading = this.$baseColorfullLoading(3)

        if (this.queryForm.productName) {
          this.queryPayload = {
            limit: args.limit,
            order: args.order,
            skip: args.skip,
            count: args.keys,
            // productid: this.queryForm.productName
            //   ? this.queryForm.productName
            //   : 'all',
            // isprocess: this.queryForm.isprocess,
            include: '',
            where: {
              'content._productid': {
                $regex: this.queryForm.productName,
              },
            },
          }
        } else {
          this.queryPayload = {
            limit: args.limit,
            order: args.order,
            skip: args.skip,
            count: 'objectId',
            // productid: this.queryForm.productName
            //   ? this.queryForm.productName
            //   : 'all',
            include: '',
            where: {},
          }
        }
        // this.queryForm.productName
        //   ? (this.queryPayload.where.content['_productid'] = )
        //   : 'all'

        // this.queryForm.isprocess
        //   ? (this.queryPayload.where['process'] = {
        //     $regex: this.queryForm.isprocess,
        //   })
        //   : ''
        if (this.queryForm.searchDate.length) {
          this.queryPayload.where['createdAt'] = {
            $gt: {
              __type: 'Date',
              iso: this.queryForm.searchDate[0] + 'T08:00:00.000Z',
            },
          }
          this.queryPayload.where['updatedAt'] = {
            $lt: {
              __type: 'Date',
              iso: this.queryForm.searchDate[1] + 'T08:00:00.000Z',
            },
          }
        }

        // {"createdAt":{"$lt":{"__type":"Date","iso":"2022-02-11T02:16:18.906Z"}},"updatedAt":{"$gt":{"__type":"Date","iso":"2022-02-18T02:16:18.906Z"}}}
        const { results = [], count = 0 } = await queryNotification(
          this.queryPayload
        )
        this.list = results
        this.total = count
        this.$refs['forensics'].ination.total = count
        loading.close()
        console.log(this.list, 'this.list')
      },
      async prodChange(e) {
        this.Device = []
        const params = {
          where: { product: e },
        }
        const { results } = await queryDevice(params)
        dgiotlog.log(results, '设备')
        this.Device = results
      },
      handleRemove(file) {
        this.form.photo.forEach((i, index) => {
          // dgiotlog.log(
          //   i,
          //   index,
          //   file.name,
          //   i.split('/')[`${i.split('/').length - 1}`]
          // )
          if (i.split('/')[`${i.split('/').length - 1}`] == file.name) {
            // delete this.form.photo[index]
            this.form.photo.splice(index, 1)
            // dgiotlog.log(this.form.photo, index)
          }
        })
        dgiotlog.log(this.form.photo)
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = (val - 1) * this.queryForm.limit
        this.fetchData()
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
