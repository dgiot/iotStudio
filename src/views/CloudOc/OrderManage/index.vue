<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:43
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:43
* @Description:
* @FilePath: src\views\CloudOc\MetaData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div ref="custom-table" class="index-container">
    <dgiot-query-form style="width: 100%; margin-left: 60px">
      <!-- <dgiot-query-form-left-panel> -->
      <el-form
        ref="form"
        :inline="true"
        :model="queryForm"
        @submit.native.prevent
      >
        <el-form-item label="产品名称">
          <el-select
            v-model="queryForm.product"
            clearable
            placeholder="请选择产品"
            @change="handleQuery()"
          >
            <el-option
              v-for="item in product"
              :key="item.objectId + 'j'"
              :label="item.name"
              :value="item.objectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input
            v-model="queryForm.name"
            clearable
            placeholder="请输入单据编号"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="queryForm.realstatus"
            clearable
            placeholder="请选择状态"
            @change="handleQuery"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value + 'j'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select
            v-model="queryForm.way"
            clearable
            placeholder="请选择排序方式"
            @change="handleQuery"
          >
            <el-option
              v-for="item in wayList"
              :key="item.value + 'j'"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        </el-form-item>
      </el-form>
      <!-- </dgiot-query-form-left-panel> -->
    </dgiot-query-form>

    <el-table
      v-if="isPC"
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      class="order_table"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
      @selection-change="setSelectRows"
    >
      <!-- <el-table-column align="center" type="selection" width="55" /> -->
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        width="95"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="单据编号"
        prop="name"
        width="140"
      />
      <el-table-column
        align="center"
        label="单据类型"
        prop="devaddr"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        label="单据日期"
        prop="content.baseInfo.Document_date"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column align="center" label="物料表" width="100">
        <template #default="{ row }">
          <el-button size="mini" type="info" @click="handleDetail(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="单据状态"
        prop="content.baseInfo.Documents_state"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        label="产品类型"
        prop="content.baseInfo.Product_type"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="原料清单" width="100">
        <template #default="{ row }">
          <el-button size="mini" type="info" @click="handleMaterial(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="单位"
        prop="content.baseInfo.Unit"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="车间"
        prop="content.baseInfo.Material_List[0].Production_workshop"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="工单状态"
        prop="detail.realstatus"
        show-overflow-tooltip
        width="100"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.detail.realstatus == 1"
            effect="dark"
            type="danger"
          >
            待开始
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 2"
            effect="dark"
            type="warning"
          >
            加工中
          </el-tag>
          <el-tag v-else-if="scope.row.detail.realstatus == 3" effect="dark">
            待首检
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 4"
            effect="dark"
            type="success"
          >
            首检完成
          </el-tag>
          <el-tag v-else-if="scope.row.detail.realstatus == 5" effect="dark">
            待尾检
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 6"
            effect="dark"
            type="success"
          >
            尾检完成
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 7"
            effect="dark"
            type="warning"
          >
            待入库
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 8"
            effect="dark"
            type="success"
          >
            已入库
          </el-tag>
          <el-tag v-else-if="scope.row.detail.realstatus == 9" effect="dark">
            已出库
          </el-tag>
          <el-tag
            v-else-if="scope.row.detail.realstatus == 10"
            effect="dark"
            type="info"
          >
            暂停中
          </el-tag>
          <el-tag v-else effect="dark" type="info">未派发</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="开始时间"
        prop="detail.taskstart"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{
            row.detail.taskstart
              ? $moment.unix(row.detail.taskstart).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="结束时间"
        prop="detail.taskend"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{
            row.detail.taskend
              ? $moment.unix(row.detail.taskend).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template #default="{ row }">
          <el-button size="mini" type="primary" @click="handleOperation(row)">
            操作
          </el-button>
          <!-- <el-button type="text" @click="handleDelete(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="order_cards">
      <el-card v-for="(item, index) in list" :key="index" class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleOperation(item)"
          >
            操作
          </el-button>
        </div>
        <div class="text_item">
          <div style="font-size: 12px">
            开始时间:
            {{
              item.detail.taskstart
                ? $moment
                    .unix(item.detail.taskstart)
                    .format('YYYY-MM-DD HH:mm:ss')
                : ''
            }}
          </div>
          <div style="font-size: 12px">
            结束时间:
            {{
              item.detail.taskend
                ? $moment
                    .unix(item.detail.taskend)
                    .format('YYYY-MM-DD HH:mm:ss')
                : ''
            }}
          </div>
          <div style="padding: 10px">
            <el-tag
              v-if="item.detail.realstatus == 0"
              effect="dark"
              type="info"
            >
              未派发
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 1"
              effect="dark"
              type="danger"
            >
              待开始
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 2"
              effect="dark"
              type="warning"
            >
              加工中
            </el-tag>
            <el-tag v-else-if="item.detail.realstatus == 3" effect="dark">
              待首检
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 4"
              effect="dark"
              type="success"
            >
              首检完成
            </el-tag>
            <el-tag v-else-if="item.detail.realstatus == 5" effect="dark">
              待尾检
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 6"
              effect="dark"
              type="success"
            >
              尾检完成
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 7"
              effect="dark"
              type="warning"
            >
              待入库
            </el-tag>
            <el-tag
              v-else-if="item.detail.realstatus == 8"
              effect="dark"
              type="success"
            >
              已入库
            </el-tag>
            <el-tag v-else-if="item.detail.realstatus == 9" effect="dark">
              已出库
            </el-tag>
            <el-tag v-else effect="dark" type="info">暂停中</el-tag>
          </div>
          <div class="text_item_btn">
            <div @click="handleDetail(item)">物料表</div>
            <div @click="handleMaterial(item)">原料清单</div>
          </div>
        </div>
      </el-card>
    </div>
    <el-pagination
      background
      :current-page="pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
    <!-- 物料列表弹窗 -->
    <el-dialog
      append-to-body
      :before-close="handleCloseDetailWl"
      center
      top="5vh"
      :visible.sync="wldialog"
      width="70%"
    >
      <el-table
        ref="tableSort"
        :border="border"
        :data="wlList"
        :height="height"
        :size="lineHeight"
        :stripe="stripe"
      >
        <!-- <el-table-column align="center" type="selection" width="55" /> -->
        <el-table-column
          align="center"
          label="序号"
          show-overflow-tooltip
          sortable
          width="95"
        >
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="物料名称"
          prop="DeviceName"
          show-overflow-tooltip
          sortable
          width="300"
        />
        <el-table-column
          align="center"
          label="规格型号"
          prop="Specifications"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          align="center"
          label="订单数量"
          prop="Number"
          show-overflow-tooltip
          sortable
          width="140"
        />
        <el-table-column
          align="center"
          label="生产车间"
          prop="Production_workshop"
          show-overflow-tooltip
          sortable
          width="140"
        />
        <el-table-column
          align="center"
          label="物料编码"
          prop="Material_code"
          show-overflow-tooltip
          sortable
          width="140"
        />
      </el-table>
    </el-dialog>
    <!-- 原料列表弹窗 -->
    <el-dialog
      append-to-body
      :before-close="handleCloseDetailYl"
      center
      top="5vh"
      :visible.sync="yldialog"
      width="70%"
    >
      <el-table
        ref="tableSort"
        :border="border"
        :data="ylList"
        :height="height"
        :size="lineHeight"
        :stripe="stripe"
      >
        <el-table-column
          align="center"
          label="序号"
          show-overflow-tooltip
          sortable
          width="95"
        >
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="原料名称"
          prop="material_name"
          show-overflow-tooltip
          sortable
          width="300"
        />
        <el-table-column
          align="center"
          label="原料型号"
          prop="material_spec"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          align="center"
          label="总数量"
          prop="material_total"
          show-overflow-tooltip
          sortable
          width="140"
        />
        <el-table-column
          align="center"
          label="生产车间"
          prop="Production_workshop"
          show-overflow-tooltip
          sortable
          width="160"
        />
        <el-table-column
          align="center"
          label="编码"
          prop="Subitem_BOM_number"
          show-overflow-tooltip
          sortable
          width="140"
        />
        <el-table-column
          align="center"
          label="单位"
          prop="material_unit"
          show-overflow-tooltip
          sortable
          width="140"
        />
      </el-table>
    </el-dialog>
    <!-- 低代码表单渲染 
    append-to-body
      :before-close="handleCloseAmis"
      center
      class="dialog_wrap"
      custom-class="dialog_index"
      top="5vh"
      :visible.sync="commandInfo.dialog"
    -->
    <div v-show="commandInfo.dialog" class="dialog_wrap">
      <div class="dialog_wrap_item">
        <div
          style="
            display: flex;
            flex-direction: row-reverse;
            font-size: 20px;
            cursor: pointer;
            padding: 10px 4px 10px 4px;
          "
        >
          <span @click="handleCloseAmis">✖</span>
        </div>
        <el-tabs v-model="activeName" class="dialog_wrap_item_content">
          <el-tab-pane
            v-for="(item, index) in commandInfo.data"
            :key="index + 'i'"
            :label="item.title"
            lazy="true"
            :name="index + ''"
          >
            <dgiot-amis
              modal-append-to-body
              :schema="item.data"
              :show-help="false"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { putView, queryView } from '@/api/View'
  import { queryRelation } from '@/api/Relation'
  import { queryMaterial } from '@/api/MetaData'
  import { getProduct, queryProduct } from '@/api/Product'
  import {
    putDevice,
    querycompanyDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) - 40,
        stripe: true,
        lineHeight: 'mini',
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        pageNo: 1,
        statusList: [
          {
            label: '未派发',
            value: 0,
          },
          {
            label: '待开始',
            value: 1,
          },
          {
            label: '加工中',
            value: 2,
          },
          {
            label: '待首检',
            value: 3,
          },
          {
            label: '首检完成',
            value: 4,
          },
          {
            label: '待尾检',
            value: 5,
          },
          {
            label: '尾检完成',
            value: 6,
          },
          {
            label: '待入库',
            value: 7,
          },
          {
            label: '已入库',
            value: 8,
          },
          {
            label: '已出库',
            value: 9,
          },
          {
            label: '暂停中',
            value: 10,
          },
        ],
        queryForm: {
          skip: 0,
          limit: 10,
          name: '',
          excludeKeys: '',
          pageNo: 1,
          way: '-updatedAt',
        },
        wayList: [
          {
            label: '创建时间',
            value: '-createdAt',
          },
          {
            label: '更新时间',
            value: '-updatedAt',
          },
        ],
        wlList: [],
        wldialog: false,
        ylList: [],
        yldialog: false,
        commandInfo: {
          dialog: false,
        },
        activeName: '0',
        product: [],
        isPC: true,
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
      this.isPC = this.$ispc()
      this.fetchProduct()
      this.fetchData()
      // console.log('是否是pc端', this.$ispc())
    },
    mounted() {},
    destroyed() {},
    methods: {
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-27 20:45:36
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async fetchProduct() {
        try {
          const { results = [] } = await queryProduct({
            excludeKeys:
              'children,thing,decoder,topics,productSecret,desc,view,category,producttemplet',
          })
          this.product = results
        } catch (error) {}
      },
      handleCloseAmis() {
        this.coordinate = {
          lng: 116.404,
          lat: 39.915,
        }
        this.dialog_device = false
        this.commandInfo.dialog = false
        this.fetchData(false)
      },
      handleCloseDetailYl() {
        this.yldialog = false
      },
      async handleMaterial(row) {
        console.log(row)
        let params = {
          objectId: row.objectId,
        }
        const { data: list = [] } = await queryMaterial(params)
        console.log('原料清单', list)
        this.ylList = list
        this.yldialog = true
      },
      handleCloseDetailWl() {
        this.wldialog = false
      },
      //查看物料表
      handleDetail(row) {
        console.log(row)
        this.wlList = row.content?.baseInfo?.Material_List || []
        this.wldialog = true
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
      // handleAdd() {
      //   this.$refs['edit'].showEdit()
      // },
      // handleEdit(row) {
      //   this.$refs['edit'].showEdit(row)
      // },
      async handleOperation(row) {
        let destId =
          JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
            ?.objectId || ''
        let name =
          JSON.parse(Base64.decode(localStorage.getItem('username')))
            ?.vuexinfo || ''
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('parse_name', name)
        localStorage.setItem('parse_productid', row.product.objectId)
        const { results = [] } = await queryRelation({
          destClass: '_Role',
          destId: destId,
          destField: 'views',
          srcClass: 'View',
        })
        if (_.isEmpty(results)) {
          this.$baseMessage('暂未配置amis', 'info', 'dgiot-hey-message-error')
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },

      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg } = await doDelete({ ids: row.id })
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
          await this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      async handleQuery() {
        this.pageNo = 1
        this.queryForm.limit = 10
        this.queryForm.skip = 0
        // this.paginationKey = moment(new Date()).valueOf() + ''
        await this.fetchData()
      },
      async fetchData() {
        console.log(this.queryForm)
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          excludeKeys: this.queryForm.excludeKeys || '',
          // include: this.queryForm.include,
          order: this.queryForm.way,
          count: 'objectId',
          where: {
            state: 9,
          }, //product: '21efa507f6'
        }
        this.queryForm.name
          ? (params.where.name = {
              $regex: this.queryForm.name,
            })
          : ''
        if (String(this.queryForm.realstatus + '').length > 0) {
          params.where['detail.realstatus'] = this.queryForm.realstatus
        }
        this.queryForm.product
          ? (params.where.product = this.queryForm.product)
          : ''
        this.queryForm.search
          ? (params.where[this.queryForm.type] = {
              $regex: this.queryForm.search,
            })
          : ''
        this.queryForm.status
          ? (params.where.status = this.queryForm.status)
          : ''
        this.queryForm.isEnable
          ? (params.where.isEnable = this.queryForm.isEnable)
          : ''
        const { results: list = [], count: total = 0 } =
          await querycompanyDevice(params, this.token)
        list.forEach((item) => {
          item.address = item.address == '' ? '---' : item.address
          item.detail = item?.detail ? item.detail : {}
          item.detail.address =
            item?.detail && item?.detail?.address ? item.detail.address : '---'
          item.isEdit = false
          item.oldName = item.name
        })
        this.list = list
        this.total = total
        this.listLoading = false
        // 订阅处理所有的设备
        // await this.subAllDevice()
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
    .dialog_wrap {
      z-index: 10;
      position: fixed;
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%;
      background-color: rgba(77, 66, 65, 0.6);
      .dialog_wrap_item {
        position: absolute;
        top: 12%;
        left: 10%;
        width: 80%;
        height: 85%;
        // height: 60%;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        z-index: 999;
        .dialog_wrap_item_content {
          height: 100%;
          overflow: scroll;
        }
      }
    }
    .dialog_index {
      position: absolute;
      z-index: inherit;
    }
    .order_table {
      width: 90%;
      margin: 10px auto;
    }
    .order_cards {
      display: flex;
      flex-wrap: wrap;
      .box-card {
        width: 200px;
        margin-left: 20px;
        margin-bottom: 10px;
        .clearfix:before,
        .clearfix:after {
          display: table;
          content: '';
        }
        .clearfix:after {
          clear: both;
        }
        .text_item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .text_item_btn {
            display: flex;
            color: #1890ff;
            justify-content: space-around;
            div {
              flex: 1;
              padding: 5px 10px;
              text-align: center;
            }
            div:nth-child(1) {
              color: #fff;
              background-color: #1890ff;
            }
            div:nth-child(2) {
              margin-left: 4px;
              color: #fff;
              background-color: #1890ff;
            }
          }
        }
      }
    }
  }
</style>
