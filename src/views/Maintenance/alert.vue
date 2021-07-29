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
      <el-dialog v-drag :visible.sync="parserView">
        <ele-form
          v-model="alertConfig.config"
          v-bind="alertConfig.config"
          :request-fn="handleSubmit"
          :config="formConfig"
          pure
          @request-success="handleSuccess(alertConfig)"
        />
      </el-dialog>
    </div>
    <vab-query-form class="query-form">
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="auto"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('alert.alert number')">
            <el-input
              v-model.trim="queryForm.number"
              clearable
              :placeholder="$translateTitle('Maintenance.Ticket number')"
            />
          </el-form-item>

          <!--          <el-form-item label="账号">-->
          <!--            <el-input-->
          <!--              v-model.trim="queryForm.account"-->
          <!--              clearable-->
          <!--              placeholder="请输入账号"-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item :label="$translateTitle('alert.the starting time')">
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
            <el-button icon="el-icon-search" type="primary" @click="fetchData">
              {{ $translateTitle('Maintenance.search') }}
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
        show-overflow-tooltip
        class-name="isCheck"
        type="selection"
        width="55"
      />

      <el-table-column
        sortablesortable
        align="center"
        :label="$translateTitle('alert.alert number')"
        prop="objectId"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('equipment.createdAt')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('alert.Alarm status')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag
            :type="row.content.alertstatus ? 'danger' : 'success'"
            effect="dark"
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
        sortable
        align="center"
        :label="$translateTitle('alert.Alarm handling')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-link :type="row.public ? 'success' : 'info'" effect="dark">
            {{
              row.public
                ? $translateTitle('Maintenance.Processed')
                : $translateTitle('Maintenance.Untreated')
            }}
          </el-link>
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
            @click="showInfo(row.type, row.content, row.objectId)"
          >
            {{ $translateTitle('Maintenance.View') }}
          </el-button>
          <!--          <el-button v-show="row.status == 0" type="success">-->
          <!--            {{ $translateTitle('Maintenance.Dispatch') }}-->
          <!--          </el-button>-->
          <!--          <el-button v-show="row.status == 1" type="success">-->
          <!--            {{ $translateTitle('Maintenance.Evaluation') }}-->
          <!--          </el-button>-->
          <!--          <el-button v-show="row.status == 3" type="info">-->
          <!--            {{ $translateTitle('Maintenance.deal with') }}-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            v-show="row.status != 3"-->
          <!--            type="danger"-->
          <!--            @click="handleDelete(row.objectId)"-->
          <!--          >-->
          <!--            {{ $translateTitle('Maintenance.delete') }}-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
      <template #empty>
        <vab-empty />
      </template>
    </el-table>
    <VabPagination
      v-show="total"
      :total="total"
      :page.sync="queryForm.pageNo"
      :limit.sync="queryForm.pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
  import {
    queryNotification,
    getNotification,
    delNotification,
  } from '@/api/Notification'
  import { getProduct } from '@/api/Product'
  import { mapGetters, mapMutations } from 'vuex'
  import { Promise } from 'q'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        selectedList: [],
        parserView: false,
        formConfig: {},
        alertConfig: {},
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
        queryForm: {
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

    created() {
      console.log(this._Product, '_Product')
      console.log('role', this.role)

      console.log('this.height', this.height)
    },
    mounted() {
      this.fetchData()
    },
    methods: {
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
      getStatus(type = 0) {
        // type == 0 ? '' : ''
        switch (type) {
          case 0:
            return '待分配'
            break
          case 1:
            return '已分配'
            break
          case 2:
            return '已处理'
            break
          case 3:
            return '已结单'
            break
          default:
            return type
            console.log('other', type)
        }
      },
      // async handleDelete(objectId) {
      //   const res = await del_object('Maintenance', objectId)
      //   this.$message.success('删除成功')
      //   this.fetchData()
      // },
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
          include: '',
          where: {
            objectId: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: null },
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
