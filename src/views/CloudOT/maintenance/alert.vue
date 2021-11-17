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
          <el-form-item label="设备名称" label-width="200">
            <span>{{ devicename }}</span>
          </el-form-item>
        </el-form>
        <el-form
          v-for="item in dynamicformInfo"
          :key="item.key"
          ref="dynamicformInfo"
        >
          <el-form-item :label="item.key">
            <el-link type="success">
              {{ item.value }}
            </el-link>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-form>
            <el-form-item :label="$translateTitle('alert.Alarm status')">
              <el-radio v-model="status" label="1">已处理</el-radio>
              <el-radio v-model="status" label="2">误报</el-radio>
            </el-form-item>
            <el-form-item
              :label="$translateTitle('alert.Alarm handling')"
              label-width="200"
            >
              <el-input v-model="process" type="textarea" />
            </el-form-item>
          </el-form>
          <el-button @click="dynamicformView = false">
            {{ $translateTitle('button.cancel') }}
          </el-button>
          <el-button type="primary" @click.native="submitAlert(alertId)">
            {{ $translateTitle('button.submit') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
    <vab-query-form class="query-form">
      <vab-query-form-top-panel>
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
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      :height="height"
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
        :label="$translateTitle('alert.devicename')"
        prop="devicename"
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
          <el-tag effect="dark" :type="row.alertstatus ? 'danger' : 'success'">
            {{
              row.alertstatus
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
          <el-button
            size="mini"
            type="primary"
            @click="
              showdynamicform(
                row.objectId,
                row.Public,
                row.dynamicform,
                row.process,
                row.status,
                row.devicename
              )
            "
          >
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
        <vab-empty />
      </template>
    </el-table>
    <VabPagination
      v-show="total"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="total"
      @pagination="fetchData"
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

  export default {
    name: 'Index',
    components: {},
    data() {
      return {
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
          limit: 20,
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
    },

    created() {},
    mounted() {
      this.fetchData()
    },
    methods: {
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
              'vab-hey-message-success'
            )
            setTimeout(() => {
              this.fetchData()
            }, 1500)
          }
        )
      },
      handleSubmit(data) {
        console.log('data', data)
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
          console.log(res)
          loading.close()
          // this.$message.success(`${res}`)
        } catch (error) {
          console.log(error)
          loading.close()
          this.$message.error(`${error}`)
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
        console.log(this.selectedList)
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
          console.log(res)
          this.$message.success('处理成功')
        } catch (error) {
          console.log(error)
          this.$message.error('处理失败')
        }
        this.fetchData()
        this.dynamicformView = false
      },
      showdynamicform(alertId, flag, dynamicform, process, status, devicename) {
        this.alertId = alertId
        this.isDisable = flag
        this.process = process
        this.status = String(status)
        this.devicename = devicename
        let dFrom = []
        console.log(dynamicform)
        for (let d in dynamicform) {
          for (let j in dynamicform[d]) {
            console.log(j, dynamicform[d][j])
            let arr = {
              key: j,
              value: dynamicform[d][j],
            }
            dFrom.push(arr)
          }
        }
        this.dynamicformInfo = dFrom
        console.log(this.dynamicformInfo)
        this.dynamicformView = true
      },
      async showInfo(type, content, alertId) {
        const Loading = this.$baseColorfullLoading(4)
        console.log(type, content)
        var [productId, profileId] = type.split('_')
        console.log(productId, profileId)
        // 拿到Product 中的profile
        this.alertId = alertId
        try {
          const { config } = await getProduct(productId)
          Loading.close()
          const { parser = [], profile = [] } = config
          const _mergeProfile = [].concat(profile, parser)
          console.log(_mergeProfile, '_mergeProfile')
          let _profileConfig = _mergeProfile.map((e) => {
            if (e.uid == profileId) {
              return e
            }
          })
          console.log(_profileConfig, '_profileConfig')
          this.formConfig = _profileConfig[0].config
          this.alertConfig = _profileConfig[0]
          console.log(this.formConfig, 'formConfig')
          // this.$message.success(`${res}`)
        } catch (error) {
          console.log(error)
          Loading.close()
          this.$message.error(`${error}`)
        }
        this.formConfig = _.merge(content, this.formConfig)
        console.log('_profileConfig', this.formConfig)
        this.$nextTick(() => {
          this.parserView = true
        })
      },
      async handleDelete(objectId) {
        const res = await delNotification(objectId)
        if (res == {}) {
          this.$message.success(
            this.$translateTitle('Maintenance.delete') +
              $translateTitle('message.success')
          )
        }
        this.fetchData()
      },
      async fetchData(args = {}) {
        if (!args.limit) {
          args = this.queryForm
        }
        console.log(this.queryForm, 'queryForm', args)
        this.listLoading = false
        const loading = this.$baseColorfullLoading(3)
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          productid: this.queryForm.productName
            ? this.queryForm.productName
            : 'all',
          isprocess: this.queryForm.isprocess,
          include: '',
          where: {
            objectId: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: null },
          },
        }
        if (this.queryForm.searchDate.length) {
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
        await queryNotification(params)
          .then((res) => {
            console.log(res, 'res')
            const { results = [], count = 0 } = res
            this.list = results
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
      handleRemove(file) {
        this.form.photo.forEach((i, index) => {
          // console.log(
          //   i,
          //   index,
          //   file.name,
          //   i.split('/')[`${i.split('/').length - 1}`]
          // )
          if (i.split('/')[`${i.split('/').length - 1}`] == file.name) {
            // delete this.form.photo[index]
            this.form.photo.splice(index, 1)
            // console.log(this.form.photo, index)
          }
        })
        console.log(this.form.photo)
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
