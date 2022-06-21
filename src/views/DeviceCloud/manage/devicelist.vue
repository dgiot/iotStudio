<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-04-06 17:28:00
* @LastEditors: 17:28
* @LastEditTime: 2022-04-06 17:28:00
* @Description:
* @FilePath: src\views\DeviceCloud\manage\xinmahe.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: xinmahe
-->
<template>
  <div
    ref="custom-table"
    class="xinmahe-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <Modal
      v-model="topoFlag"
      footer-hide
      :query="routerInfo.query"
      width="1200"
      @on-cancel="closeModal"
    >
      <span slot="title" v-if="false"></span>
      <span slot="footer" v-if="false"></span>
      <topopreview v-if="topoFlag" ref="topo" />
    </Modal>
    <el-form
      ref="form"
      :inline="true"
      label-width="0"
      :model="queryForm"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="queryForm.search"
          class="input-with-select"
          placeholder="请输入查询参数"
        >
          <el-select
            v-model="queryForm.type"
            clearable
            placeholder="请选择查询类型"
            style="width: 160px"
            slot="prepend"
          >
            <el-option label="设备名称" value="name" />
            <el-option label="外壳编号" value="detail.assetNum" />
            <el-option label="主板编号" value="devaddr" />
          </el-select>
        </el-input>
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
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click.native="createDeviceDialog = true"
        >
          添加
        </el-button>
      </el-form-item>
    </el-form>
    <div class="dialog">
      <el-dialog
        :append-to-body="true"
        top="5vh"
        :visible.sync="popoverVisible"
        width="40vh"
      >
        <div class="deviceTree">
          <p style="text-align: center">
            {{ $translateTitle('developer.Company') }} :
            {{ deciceCompany }}
          </p>
          <el-tree
            :data="roleTree"
            default-expand-all
            :expand-on-click-node="false"
            node-key="index"
            :props="roleProps"
          >
            <!-- @node-click="handleNodeClick" -->
            <!-- eslint-disable-next-line -->
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span
                :class="{
                  selected: data.objectId == curDepartmentId,
                }"
                @click="transferAcl(data)"
              >
                {{ node.label }}
              </span>
            </div>
          </el-tree>
        </div>
      </el-dialog>
      <el-dialog
        append-to-body
        :before-close="handleClose"
        center
        top="5vh"
        :visible.sync="commandInfo.dialog"
        width="80%"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(item, index) in commandInfo.data"
            :key="index"
            :label="item.title"
            :name="index + ''"
          >
            <dgiot-amis :schema="item.data" :show-help="false" />
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog
        append-to-body
        center
        title="提示"
        :visible.sync="settingInfo.dialog"
        width="30%"
      >
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="settingInfo.dialog = false">取 消</el-button>
          <el-button type="primary" @click="settingInfo.dialog = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        append-to-body
        center
        title="提示"
        :visible.sync="statisticsInfo.dialog"
        width="30%"
      >
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="statisticsInfo.dialog = false">取 消</el-button>
          <el-button type="primary" @click="statisticsInfo.dialog = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        append-to-body
        center
        title="提示"
        :visible.sync="moveInfo.dialog"
        width="30%"
      >
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="moveInfo.dialog = false">取 消</el-button>
          <el-button type="primary" @click="moveInfo.dialog = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        append-to-body
        :before-close="handleClosedevice"
        class="map_dialog"
        title="安装位置"
        :visible.sync="dialog_device"
        width="50%"
      >
        <el-card>
          <dgiot-baidu-map
            ref="map"
            :bm-label="bmLabel"
            :label="mapLabel"
            :map-center="mapLabel.position"
            :nav-show="true"
            :scale-show="true"
            :scroll-wheel-zoom="true"
          />
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog_device = false">取 消</el-button>
          <el-button type="primary" @click="dialog_device = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        append-to-body
        title="添加设备"
        :visible.sync="createDeviceDialog"
        width="30%"
      >
        <el-form
          ref="deviceFormRules"
          label-position="left"
          label-width="100px"
          :model="deviceForm"
          :rules="deviceFormRules"
        >
          <el-form-item label="设备名称：" prop="name">
            <el-input v-model="deviceForm.name" />
          </el-form-item>
          <el-form-item label="外壳编号：" prop="detail.assetNum">
            <el-input v-model="deviceForm.detail.assetNum" />
          </el-form-item>
          <el-form-item label="主板编号：" prop="devaddr">
            <el-input v-model="deviceForm.devaddr" />
          </el-form-item>
          <el-form-item label="到期时间：" prop="detail.expirationTime">
            <el-date-picker
              v-model="deviceForm.detail.expirationTime"
              placeholder="选择日期："
              style="width: 100%"
              type="date"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item label="所属产品：" prop="productId">
            <el-select
              v-model="productId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in Product"
                :key="item.objectId"
                :label="item.name"
                :value="item.objectId"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; font-size: 13px; color: #8492a6">
                  {{ item.objectId }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属厂家：" prop="detail.factory">
            <el-input
              v-model="deviceForm.detail.factory"
              autocomplete="off"
              disabled
            />
          </el-form-item>
          <el-form-item label-width="0" style="text-align: center">
            <el-button type="primary" @click="onSubmit('deviceFormRules')">
              立即创建
            </el-button>
            <el-button @click.native="onCloseDialog('deviceFormRules')">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
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
        align="center"
        label="序号"
        show-overflow-tooltip
        width="55"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="item.label"
        :prop="item.label"
        sortable
      >
        <template #default="{ row }">
          <span v-if="typeof row[item.prop] == 'string'">
            {{ row[item.prop] }}
          </span>
          <span v-else v-text="getItems(item.prop, row.basedata, row)"></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="外壳编号"
        prop="detail.assetNum"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          {{ row.detail.assetNum }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="开关机状态"
        prop="isEnable"
        show-overflow-tooltip
        sortable
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="row.isEnable ? 'success' : 'danger'">
            {{ row.isEnable == true ? '开机' : '关机' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.state')"
        prop="status"
        show-overflow-tooltip
        sortable
        width="80"
      >
        <template #default="{ row }">
          <el-tag :type="row.status == 'ONLINE' ? 'success' : 'warning'">
            {{ row.status == 'ONLINE' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="添加时间"
        prop="createdAt"
        show-overflow-tooltip
        sortable
        width="120"
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD') || '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="到期时间"
        prop="detail.expirationTime"
        show-overflow-tooltip
        sortable
        width="120"
      >
        <template #default="{ row }">
          {{
            row.detail.expirationTime
              ? getTime(row.detail.expirationTime, row)
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="最后在线时间"
        prop="lastOnlineTime"
        show-overflow-tooltip
        sortable
        width="160"
      >
        <template #default="{ row }">
          {{ row.lastOnlineTime | dateUnix }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="安装位置"
        prop="createdAt"
        sortable
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.detail.address || scope.row.address"
            class="el-icon-location"
            type="text"
            @click="clickRow(scope.row.location, scope.row.name)"
          >
            {{ scope.row.detail.address || scope.row.address }}
          </el-button>

          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        show-overflow-tooltip
        width="380px"
      >
        <template #default="{ row }">
          <el-button size="mini" type="text" @click="konvaDevice(row)">
            实时数据
          </el-button>
          <el-button size="mini" type="text" @click="info(row)">
            设备信息
          </el-button>
          <el-button size="mini" type="text" @click="command(row)">
            控制
          </el-button>
          <el-button size="mini" type="text" @click="move(row)">迁移</el-button>
          <el-button size="mini" type="text" @click="deviceToDetail(row)">
            详情
          </el-button>
          <!--          <el-button plain size="mini" type="info" @click="handleDelete(row)">-->
          <!--            状态-->
          <!--          </el-button>-->
          <!--          <el-button plain size="mini" type="danger" @click="handleDelete(row)">-->
          <!--            删除-->
          <!--          </el-button>-->
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
      :current-page="queryForm.size"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryProduct } from '@/api/Product/index'
  import topopreview from '@/views/CloudFunction/topo/preview'
  import { mapGetters, mapMutations } from 'vuex'
  import { queryView } from '@/api/View'
  import {
    delDevice,
    getDevice,
    postDevice,
    putDevice,
    querycompanyDevice,
  } from '@/api/Device'

  export default {
    name: 'Xinmahe',
    components: {
      topopreview,
      TableEdit,
    },
    props: {},
    data() {
      const checkAevAddr = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('外壳编号不能为空'))
        }
        setTimeout(() => {
          if (value.length != 8) {
            callback(new Error('外壳编号必须为8位'))
          } else {
            callback()
          }
        }, 1000)
      }
      return {
        topoFlag: false,
        routerInfo: {},
        Product: [],
        productId: '',
        deviceInfo: {},
        roleProps: {
          children: 'children',
          label: 'name',
        },
        curDepartmentId: '',
        commandInfo: {
          dialog: false,
          data: {},
        },
        settingInfo: {
          dialog: false,
        },
        statisticsInfo: {
          dialog: false,
        },
        moveInfo: {
          dialog: false,
        },
        popoverVisible: false,
        deciceCompany: '',
        bmLabel: false,
        mapLabel: {
          content: '我爱北京天安门',
          style: {
            color: 'red',
            fontSize: '24px',
          },
          position: {
            lng: 116.404,
            lat: 39.915,
          },
          title: '我爱北京天安门',
        },
        map: null,
        activeName: '0',
        deviceFormRules: {
          name: [
            {
              required: true,
              message: '请输入设备名称',
              trigger: 'blur',
            },
          ],
          devaddr: [
            {
              required: true,
              message: '请输入设备编号',
              trigger: 'blur',
            },
          ],
          'detail.assetNum': [
            {
              required: true,
              validator: checkAevAddr,
              trigger: 'blur',
            },
          ],
          'detail.expirationTime': [
            {
              required: true,
              message: '请选择服务到期时间',
              trigger: 'blur',
            },
          ],
          'detail.factory': [
            {
              required: true,
              message: '请选择归属场景',
              trigger: 'blur',
            },
          ],
        },
        dialog_device: false,
        curentDeviceInfo: {},
        coordinate: {
          lng: 116.404,
          lat: 39.915,
        },
        deviceForm: {
          content: {
            devddrNum: moment().format('x'),
          },
          detail: {
            assetNum: '',
            expirationTime: moment().format('x'),
            factory: '',
          },
          name: '',
          isEnable: true,
          status: 'ONLINE',
          devaddr: '',
          basedata: {},
          route: {},
          product: { __type: 'Pointer', className: 'Product', objectId: '' },
        },
        product: '',
        createDeviceDialog: false,
        drawerAdd: false,
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 20,
        stripe: true,
        lineHeight: 'mini',
        checkList: [
          '设备名称',
          '外壳编号',
          // '开关机状态',
          // '通讯状态',
          // '到期时间',
          // '添加时间',
          '安装位置',
        ],
        columns: [
          {
            label: '设备名称',
            width: '160',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          // {
          //   label: '开关机状态',
          //   width: 'auto',
          //   prop: 'basedata.PowerState',
          //   sortable: true,
          // },
          // {
          //   label: '通讯状态',
          //   width: 'auto',
          //   prop: 'lasttime',
          //   sortable: true,
          // },
          // {
          //   label: '到期时间',
          //   width: 'auto',
          //   prop: 'basedata.expirationTime',
          //   sortable: true,
          // },
          // {
          //   label: '添加时间',
          //   width: 'auto',
          //   prop: 'createdAt',
          //   sortable: true,
          // },
          // {
          //   label: '数据更新时间',
          //   width: 'auto',
          //   prop: 'lasttime',
          //   sortable: true,
          // },
        ],
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          skip: 0,
          limit: 20,
          name: '',
          search: '',
          type: 'name',
        },
      }
    },
    computed: {
      ...mapGetters({
        currentDepartment: 'user/currentDepartment',
        roleTree: 'user/roleTree',
      }),
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
      this.getProduct()
      this.queryForm.search = this.$route.query.devicename
        ? this.$route.query.devicename
        : ''
      this.fetchData()
      // 设置默认归属厂家
      const aclKey1 = 'role' + ':' + this.currentDepartment.alias
      const aclObj = {}
      aclObj[aclKey1] = {
        read: true,
        write: true,
      }
      this.deviceForm.detail.factory = this.currentDepartment.alias
      this.deviceForm.ACL = aclObj
    },
    mounted() {},
    destroyed() {},
    methods: {
      ...mapMutations({
        setCurrentDepartment: 'user/setCurrentDepartment',
      }),
      toggleSwitch(row) {
        return new Promise((resolve) => {
          this.$Modal.confirm({
            title:
              row.isEnable == true
                ? '修改设备状态为关机'
                : '修改设备状态为开机',
            content: '您确认要手动操作设备开关机吗？',
            onOk: () => {
              resolve()
              row.isEnable = !row.isEnable
              this.switchTask(row)
            },
          })
        })
      },
      async switchTask(row) {
        await putDevice(row.objectId, { isEnable: row.isEnable })
        const message = row.isEnable == true ? '该设备已开机' : '该设备已关机'
        this.$message({
          type: 'success',
          message: message,
          showClose: true,
        })
      },
      // 新建设备
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-20 14:17:24
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async doPostDevice(params) {
        try {
          const { objectId = '', error = '' } = await postDevice(params)
          if (objectId) {
            this.fetchData()
            this.createDeviceDialog = false
          } else {
            this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'dgiot-hey-message-error'
            )
            throw new Error(error)
          }
        } catch (e) {
          // this.$baseMessage(
          //   this.$translateTitle('alert.Data request error') + `${e}`,
          //   'error',
          //   'dgiot-hey-message-error'
          // )
          throw new Error(e)
        }
      },
      async getProduct() {
        const { results = [] } = await queryProduct({})
        this.Product = results
        this.productId = results[0].objectId
        this.product = results[0].objectId
        this.deviceForm.product = {
          __type: 'Pointer',
          className: 'Product',
          objectId: this.productId,
        }
        console.log('deviceForm', this.deviceForm)
      },
      async print(row) {
        console.log(await getDevice(row.objectId))
        console.log(row, row.isEnable)
      },
      getTime(t, row) {
        return t
          ? moment(Number(t)).format('YYYY-MM-DD')
          : moment(Number(row.basedata.expirationTime) * 1000).format(
              'YYYY-MM-DD'
            )
      },
      handleMenuClick(e) {
        console.error(e)
      },
      // 设备详情
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/devicesDetailLite',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            productid: row.product.objectId,
            ischildren: 'false',
          },
        })
      },
      handleClosedevice() {
        this.fetchData(false)
        this.dialog_device = false
        this.coordinate = {
          lng: 116.404,
          lat: 39.915,
        }
      },
      // 迁移设备
      transferAcl(data) {
        const aclKey1 = 'role' + ':' + data.name
        const aclObj = {}
        console.log(this.deviceInfo)
        aclObj[aclKey1] = {
          read: true,
          write: true,
        }
        this.deviceInfo.detail.factory = data.depname
        const parmas = {
          ACL: aclObj,
          basedata: this.deviceInfo.basedata,
        }
        this.$confirm(
          this.$translateTitle(`确定要将设备迁移到` + data.name + '吗'),
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            await putDevice(this.deviceInfo.objectId, parmas).then((res) => {
              if (res.updatedAt) {
                this.popoverVisible = false
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'success',
                  message: this.$translateTitle(`迁移成功`),
                })
                // 迁移成功刷新界面
                this.fetchData()
              } else {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'success',
                  message: this.$translateTitle(`迁移成功`),
                })
              }
            })
          })
          .catch((e) => {
            dgiotlog.log(e)
          })
        dgiotlog.log(data.name)
      },
      timestampToTime(timestamp) {
        const date = new Date(timestamp * 1000)
        const Y = date.getFullYear() + '-'
        const M =
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        const D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          ' '
        const h =
          (date.getHours() + 1 <= 10
            ? '0' + date.getHours()
            : date.getHours()) + ':'
        const m =
          (date.getMinutes() + 1 <= 10
            ? '0' + date.getMinutes()
            : date.getMinutes()) + ':'
        const s =
          date.getSeconds() + 1 <= 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        return timestamp ? Y + M + D + h + m + s : ''
      },
      // 关闭弹出框清空数据
      handleClose() {
        this.coordinate = {
          lng: 116.404,
          lat: 39.915,
        }
        this.dialog_device = false
        this.commandInfo.dialog = false
        this.fetchData(false)
      },
      onCloseDialog(formName) {
        this.$refs[formName].resetFields()
        this.$refs[formName].clearValidate()
        this.createDeviceDialog = false
      },
      getItems(prop, basedata, row) {
        let str = basedata[prop.split('.')[1]]
        if (str && !_.isObject(str)) {
          return str
        } else if (row[prop]) {
          console.error('basicdata', row[prop])
          return row[prop]
        }
      },
      handler({ BMap, map }) {
        // this.center.lng = 120.2
        // this.center.lat = 30.26667
        // this.zoom = this.zoom
        this.map = map
        console.log(this.map)
      },
      // 点击查看
      clickRow(baidulocation, title) {
        // 经度 Lon 纬度 Lat
        const position = {
          lng: Number(baidulocation.longitude),
          lat: Number(baidulocation.latitude),
        }
        this.mapLabel = {
          content: title,
          style: {
            color: 'red',
            fontSize: '24px',
          },
          position: position,
          title: title,
        }
        this.bmLabel = true
        console.log(this.mapLabel)
        this.dialog_device = true
        // this.$refs['map'].baiduCenter = position
      },
      onSubmit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let params = this.deviceForm
            params.detail[this.deviceForm.devaddr] =
              this.deviceForm.detail.expirationTime
            params.detail.assetNum = this.deviceForm.detail.assetNum
            await this.doPostDevice(params)
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(row.objectId)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
          await this.fetchData()
        })
      },
      async info(row) {
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('product_objectid', row.product.objectId)
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: 'deviceInfo',
            key: row.product.objectId,
          },
        })
        if (_.isEmpty(results)) {
          this.$baseMessage(
            '暂未配置下发控制表单',
            'info',
            'dgiot-hey-message-error'
          )
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },
      async command(row) {
        localStorage.setItem('parse_objectid', row.objectId)
        localStorage.setItem('product_objectid', row.product.objectId)
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: { $in: ['amis', 'profile', 'content'] },
            key: row.product.objectId,
          },
        })
        if (_.isEmpty(results)) {
          this.$baseMessage(
            '暂未配置下发控制表单',
            'info',
            'dgiot-hey-message-error'
          )
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },
      setting(row) {
        this.settingInfo.dialog = true
        console.log(row)
      },
      async closeModal() {
        this.$router.go(-1)
        this.topoFlag = false
      },
      // 组态
      konvaDevice(row) {
        this.topoFlag = true
        this.$router.push({
          path: '/dashboard/device',
          query: {
            productid: row.product.objectId,
            devaddr: row.devaddr,
            deviceid: row.objectId,
            type: 'device',
          },
        })
      },
      move(row) {
        console.log(row)
        this.deviceInfo = row
        if (row.ACL) {
          for (var key in row.ACL) {
            this.deciceCompany = key.substr(5)
          }
        } else {
          this.deciceCompany = ''
        }
        this.popoverVisible = !this.popoverVisible
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.limit = 20
        this.fetchData()
      },
      async fetchData(listLoading = true) {
        console.log(this.queryForm.type, this.queryForm)
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {},
        }
        if (this.queryForm.type)
          params.where[this.queryForm.type] = this.queryForm.search.length
            ? { $regex: this.queryForm.search }
            : (params.where = {})
        console.info(params)
        this.listLoading = listLoading
        const { results, count } = await querycompanyDevice(params)
        results.forEach((i) => {
          if (_.isEmpty(i.detail)) i.detail = {}
          if (_.isEmpty(i.content)) i.content = {}
          if (_.isEmpty(i.profile)) i.profile = {}
        })
        this.list = results
        this.total = count
        this.listLoading = false
        // 订阅处理所有的设备
        await this.subAllDevice()
      },
      async subAllDevice() {
        await this.$subscribe('$dg/user/devicestate/#')
        this.$dgiotBus.$on('/$dg/user', (Msg) => {
          console.log('收到消息', Msg)
          const parseString = JSON.parse(Msg.payloadString)
          console.log('收到消息', parseString)
          if (parseString) {
            const topicsKeys = Object.keys(parseString)
            console.log(topicsKeys)
            topicsKeys.forEach((t) => {
              this.list.forEach((i) => {
                if (i.objectId == t) {
                  const mergeInfo = _.merge(i, parseString[t])
                  console.log(`更新设备${i.name}`, mergeInfo)
                }
              })
            })
          }
        })
      },
    },
  }
</script>
<style>
  .ivu-modal-body {
    padding: 0;
  }
  .el-main {
    padding: 0;
  }
</style>
<style lang="scss" scoped>
  .xinmahe-container {
    width: 100%;
    height: 100%;

    .ACTIVE,
    .ONLINE {
      color: green;
    }

    .OFFLINE,
    .UNACTIVE {
      color: red;
    }
  }
</style>
