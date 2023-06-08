<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:49
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:49
* @Description:
* @FilePath: src/views/CloudOc/Fassets/index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div class="index-container">
    <div
      ref="custom-table"
      class="custom-table-container"
      :class="{ 'dgiot-fullscreen': isFullscreen }"
    >
      <dgiot-query-form>
        <dgiot-query-form-left-panel>
          <el-form
            ref="form"
            :inline="true"
            label-width="0"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-input v-model="queryForm.title" placeholder="资产名称" />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                native-type="submit"
                type="primary"
                @click="handleQuery"
              >
                查询
              </el-button>
              <!--              <el-button-->
              <!--                icon="el-icon-plus"-->
              <!--                type="primary"-->
              <!--                @click.native="handleAdd"-->
              <!--              >-->
              <!--                添加-->
              <!--              </el-button>-->
            </el-form-item>
          </el-form>
        </dgiot-query-form-left-panel>
      </dgiot-query-form>

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :border="border"
        :data="list"
        :height="height"
        :size="lineHeight"
        :stripe="stripe"
        @selection-change="setSelectRows"
      >
        <el-table-column
          v-for="(item, index) in finallyColumns"
          :key="index"
          align="center"
          :label="item.label"
          sortable
          :width="item.width"
        >
          <template #default="{ row }">
            <span v-if="item.label === '评级'">
              <el-rate v-model="row.rate" disabled />
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          show-overflow-tooltip
          sortable
          width="85"
        >
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image
            class="dgiot-data-empty"
            :src="
              require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
            "
          />
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
      <div class="draw">
        <el-drawer
          append-to-body
          title="我是标题"
          :visible.sync="drawer"
          :with-header="false"
        >
          <el-form
            ref="form"
            label-position="top"
            label-width="80px"
            :model="sizeForm"
            :rules="rules"
            size="mini"
            status-icon
          >
            <el-form-item label="资产名称">
              <el-input v-model="sizeForm.name" />
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="sizeForm.date1"
                  placeholder="选择日期"
                  style="width: 100%"
                  type="date"
                />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  v-model="sizeForm.date2"
                  placeholder="选择时间"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="sizeForm.type">
                <el-checkbox-button label="美食/餐厅线上活动" name="type" />
                <el-checkbox-button label="地推活动" name="type" />
                <el-checkbox-button label="线下主题活动" name="type" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="sizeForm.resource" size="medium">
                <el-radio border label="线上品牌商赞助" />
                <el-radio border label="线下场地免费" />
              </el-radio-group>
            </el-form-item>
            <el-form-item size="large">
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryProduct } from '@/api/Product'

  export default {
    name: 'Index',
    components: { TableEdit },
    props: {},
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入资产名称', trigger: 'blur' },
            {
              min: 1,
              max: 20,
              message: '长度在 1 到 20 个字符',
              trigger: 'blur',
            },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          date1: [
            {
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          date2: [
            {
              type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change',
            },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
        },
        sizeForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        product: [],
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        drawer: false,
        height: this.$baseTableHeight(0),
        stripe: true,
        lineHeight: 'medium',
        checkList: [
          '资产编号',
          '资产名称',
          '资产类型',
          '颁发/认证机构',
          '资产状态',
        ],
        columns: [
          {
            label: '资产编号',
            width: 'auto',
            prop: 'author',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '资产名称',
            width: 'auto',
            prop: 'title',
            sortable: true,
          },
          {
            label: '资产类型',
            width: 'rate',
            prop: 'rate',
            sortable: true,
          },
          {
            label: '颁发/认证机构',
            width: 'auto',
            prop: 'description',
            sortable: true,
          },
          {
            label: '资产状态',
            width: 'auto',
            prop: 'status',
            sortable: true,
          },
        ],
        list: [],
        imageList: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {},
    created() {
      this.fetchData()
      this.fetchProduct()
    },
    mounted() {},
    destroyed() {},
    methods: {
      onSubmit() {
        console.log('submit!')
      },
      async fetchProduct() {
        try {
          const { results = [] } = await queryProduct({
            excludeKeys:
              'channel,children,category,config,thing,producttemplet,topics,decoder',
          })
          this.product = results
        } catch (e) {
          this.$baseMessage(e, 'error', 'dgiot-hey-message-error')
        }
      },
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 210
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.drawer = true
      },
      handleEdit(row) {
        this.drawer = false
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage(
              '未选中任何行',
              'error',
              'dgiot-hey-message-error'
            )
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.list = []
        // this.total = 0
        this.listLoading = true
        try {
          const {
            data: { list, total },
          } = await getList(this.queryForm)
          setTimeout(() => {
            this.list = list
            this.total = total
            this.listLoading = false
          }, 300)
        } catch (e) {
          console.error(e)
        }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
  }
</style>
