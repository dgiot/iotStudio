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
      <el-dialog
        :append-to-body="true"
        :title="detail.name"
        :visible.sync="deviceFlag"
        width="100vh"
      >
        <change-info
          :detail="detail"
          :show-footer="isfooter"
          :show-hard="ishard"
          :step="step"
        />
        <!--        <span slot="footer" class="dialog-footer">-->
        <!--          <el-button @click="deviceFlag = false">-->
        <!--            {{ $translateTitle('developer.cancel') }}-->
        <!--          </el-button>-->
        <!--          <el-button type="primary" @click.native="deviceFlag = false">-->
        <!--            {{ $translateTitle('developer.determine') }}-->
        <!--          </el-button>-->
        <!--        </span>-->
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
            <el-input
              v-model="queryForm.type"
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
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click.native="fetchData"
            >
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
            <el-button
              :disabled="!selectedList.length"
              icon="el-icon-folder-checked"
              type="primary"
              @click="Export(selectedList)"
            >
              {{ $translateTitle('Maintenance.Export') }}
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
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="number"
        show-overflow-tooltip
        sortablesortable
        width="120"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        show-overflow-tooltip
        sortable
        width="140"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ getStatus(row.status) }}
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
        :label="$translateTitle('Maintenance.operating')"
        prop="name"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button size="mini" type="primary" @click.native="showInfo(row)">
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
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="total"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
  import { query_object } from '@/api/Parse'
  import { exlout } from '@/api/File'
  import { queryDevice } from '@/api/Device'
  import ChangeInfo from '@/views/CloudOT/maintenance/ChangeInfo'

  import { mapGetters } from 'vuex'

  export default {
    name: 'Index',
    components: {
      ChangeInfo,
    },
    data() {
      return {
        selectedList: [],
        ishard: true,
        isfooter: false,
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
        currentDepartment: 'user/currentDepartment',
      }),
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

    created() {
      dgiotlog.log(this._Product, '_Product')
      dgiotlog.log('role', this.role)

      dgiotlog.log('this.height', this.height)
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        dgiotlog.log(this.selectedList)
      },
      async Export(row) {
        dgiotlog.log(row)
        try {
          const params = {
            results: [],
          }
          params['results'] = row
          const res = await exlout(params)
          this.$convertRes2Blob(res)
          this.$message.success(this.$translateTitle('node.export success'))
        } catch (error) {
          dgiotlog.log(error)
          this.$message.error(
            this.$translateTitle('node.export error') + `${error}`
          )
        }
      },
      showInfo(row) {
        this.ishard = true
        this.isfooter = false
        let { status = 0 } = row
        dgiotlog.log('row', row)
        this.detail = row
        this.step = status + 1
        this.deviceFlag = true
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
            dgiotlog.log('other', type)
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
        dgiotlog.log(this.queryForm, 'queryForm', args)
        this.listLoading = false
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          where: {
            number: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: null },
            'info.productid': this.queryForm.product.length
              ? this.queryForm.product
              : { $ne: '98' },
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
            dgiotlog.log(res, 'res')
            const { results = [], count = 0 } = res
            this.list = results
            this.list.forEach((e) => {
              e._user = '暂无'
              if (e.ACL) {
                for (var key in e.ACL) {
                  e._user = key.substr(5)
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
        dgiotlog.log(this.list, 'this.list')
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
