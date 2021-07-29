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
      <el-dialog width="100vh" :title="detail.name" :visible.sync="deviceFlag">
        <change-info
          :detail="detail"
          :step="step"
          :show-hard="ishard"
          :show-footer="isfooter"
        />
        <!--        <span slot="footer" class="dialog-footer">-->
        <!--          <el-button @click="deviceFlag = false">-->
        <!--            {{ $translateTitle('developer.cancel') }}-->
        <!--          </el-button>-->
        <!--          <el-button type="primary" @click="deviceFlag = false">-->
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
            <el-button icon="el-icon-search" type="primary" @click="fetchData">
              {{ $translateTitle('Maintenance.search') }}
            </el-button>
            <el-button
              icon="el-icon-folder-checked"
              type="primary"
              :disabled="!selectedList.length"
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
        show-overflow-tooltip
        class-name="isCheck"
        type="selection"
        width="55"
      />
      <el-table-column
        sortablesortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket number')"
        prop="number"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket type')"
        prop="type"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Ticket status')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getStatus(row.status) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.project')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.product && row.product.name ? row.product.name : '' }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Equipment name')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.device && row.device.name ? row.device.name : '' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        :label="$translateTitle('Maintenance.Initiator')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.user ? row.user.nick : '' }}
        </template>
      </el-table-column>
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
          <el-button size="mini" type="primary" @click="showInfo(row)">
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
    query_object,
    get_object,
    del_object,
    update_object,
    create_object,
  } from '@/api/shuwa_parse'
  import { exlout } from '@/api/File'
  import { queryDevice } from '@/api/Device'
  import ChangeInfo from '@/views/Maintenance/ChangeInfo'

  import { mapGetters, mapMutations } from 'vuex'
  import { UploadImg } from '@/api/File'
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
      changeBox(val) {
        this.selectedList = []
        val.forEach((item) => {
          this.selectedList.push(item)
        })
        console.log(this.selectedList)
      },
      async Export(row) {
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
      showInfo(row) {
        this.ishard = true
        this.isfooter = false
        let { status = 0 } = row
        console.log('row', row)
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
        const loading = this.$baseColorfullLoading()
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
          include: 'product,device,user',
          where: {
            number: this.queryForm.number.length
              ? { $regex: this.queryForm.number }
              : { $ne: null },
            product: this.queryForm.product.length
              ? this.queryForm.product
              : { $ne: null },
            type: this.queryForm.type.length
              ? { $regex: this.queryForm.type }
              : { $ne: null },
          },
        }
        if (this.queryForm.searchDate?.length) {
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
