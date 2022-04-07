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
            <el-option label="外壳编号" value="basedata.basicdata.partAddr" />
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
        center
        title="设备参数控制"
        :visible.sync="commandInfo.dialog"
        width="50%"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="(item, index) in commandInfo.data"
            :key="index"
            :label="item.title"
            :name="index"
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
        :before-close="handleClose"
        class="map_dialog"
        title="设备位置"
        :visible.sync="dialog_device"
        width="60%"
      >
        <el-card>
          <dgiot-baidu-map
            ref="map"
            :bm-label="bmLabel"
            :label="mapLabel"
            :map-center="mapLabel.position"
            :nav-show="true"
            :scale-show="true"
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
            <el-input v-model="deviceForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="外壳编号：" prop="devaddr">
            <el-input v-model="deviceForm.devaddr" autocomplete="off" />
          </el-form-item>
          <el-form-item label="主板编号：" prop="basedata.basicdata.partAddr">
            <el-input
              v-model="deviceForm.basedata.basicdata.partAddr"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="到期时间：" prop="basedata.expirationTime">
            <el-date-picker
              v-model="deviceForm.basedata.expirationTime"
              placeholder="选择日期："
              style="width: 100%"
              type="date"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item label="归属厂家：" prop="basedata.factory">
            <el-input
              v-model="deviceForm.basedata.factory"
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
      <el-table-column align="center" type="selection" width="55" />
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
        v-for="(item, index) in finallyColumns"
        :key="index"
        align="center"
        :label="item.label"
        :prop="item.label"
        sortable
        :width="item.width"
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
        label="开关机状态"
        prop="basedata.PowerState"
        show-overflow-tooltip
        sortable
        width="120"
      >
        <template #default="{ row }">
          <el-link
            effect="dark"
            :type="row.basedata.PowerState == 1 ? 'success' : 'info'"
          >
            {{ row.basedata.PowerState == 1 ? '开机' : '关机' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="添加时间"
        prop="createdAt"
        show-overflow-tooltip
        sortable
        width="180"
      >
        <template #default="{ row }">
          {{ $moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') || '' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="到期时间"
        prop="basedata.expirationTime"
        show-overflow-tooltip
        sortable
        width="100"
      >
        <template #default="{ row }">
          <!--          <span v-html="timestampToTime(row.basedata.expirationTime)" />-->
          {{
            row.basedata.expirationTime
              ? $moment(new Date(row.basedata.expirationTime * 1000)).format(
                  'YYYY-MM-DD'
                )
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="设备地址"
        prop="createdAt"
        sortable
        width="auto"
      >
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.basedata.basicdata &&
              scope.row.basedata.basicdata.baiduaddr &&
              scope.row.basedata.basicdata.baiduaddr.formatted_address
            "
            class="el-icon-location"
            type="text"
            @click="
              clickRow(scope.row.basedata.basicdata.baiduaddr, scope.row.name)
            "
          >
            {{ scope.row.basedata.basicdata.baiduaddr.formatted_address }}
          </el-button>

          <span v-else>暂未上报设备地址</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作"
        show-overflow-tooltip
        width="320px"
      >
        <template #default="{ row }">
          <el-dropdown>
            <el-button
              plain
              size="mini"
              style="margin-right: 10px"
              type="success"
            >
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" @click="command(row)">控制</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click="move(row)">迁移</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            plain
            size="mini"
            type="primary"
            @click="deviceToDetail(row)"
          >
            详情
          </el-button>
          <!--          <el-button plain size="mini" type="info" @click="handleDelete(row)">-->
          <!--            状态-->
          <!--          </el-button>-->
          <el-button plain size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
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
  import { getProduct, queryProduct } from '@/api/Product/index'
  import { getStatistics } from '@/api/Python'
  import { mapGetters, mapMutations } from 'vuex'
  import { queryView } from '@/api/View'
  import {
    addimeidevice,
    putDevice,
    querycompanyDevice,
    postDevice,
    getDevice,
    delDevice,
  } from '@/api/Device'

  export default {
    name: 'Xinmahe',
    components: {
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
          'basedata.basicdata.partAddr': [
            {
              required: true,
              validator: checkAevAddr,
              trigger: 'blur',
            },
          ],
          'basedata.expirationTime': [
            {
              required: true,
              message: '请选择服务到期时间',
              trigger: 'blur',
            },
          ],
          'basedata.factory': [
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
          name: '',
          isEnable: true,
          status: 'OFFLINE',
          devaddr: '',
          basedata: {
            expirationTime: moment().format('x'),
            factory: '',
            basicdata: {
              devddrNum: moment().format('x'),
              GPS: { Lon: 120.455, Lat: 31.555 },
              partAddr: '',
              SerialNo: '',
              SumLayer: '',
              RatedFreq: '',
              RatedLoad: '',
              MDSerialNo: '',
              RatedPower: '',
              SelfAdjust: '',
              SIMSerialNo: '',
              SelfLearned: '',
              CtrlSerialNo: '',
              LearnedLayer: '',
              WeightFactor: '',
              MDSoftVersion: '',
              CtrSoftVersion: '',
              mapAddressText: '',
              ProtocolVersion: '',
              PowerOnCtrl: 0,
              PubFreq: 20,
              PubCtrl: 1,
              ParaGet: 0,
              FOTA: 0,
            },
          },
          route: {},
          product: { __type: 'Pointer', className: 'Product', objectId: '' },
        },
        product: '0765bee775',
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
          '设备地址',
        ],
        columns: [
          {
            label: '设备名称',
            width: '160',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '外壳编号',
            width: '120',
            prop: 'basedata.basicdata.partAddr',
            sortable: true,
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
      this.fetchData()
      // 设置默认归属厂家
      const aclKey1 = 'role' + ':' + this.currentDepartment.alias
      const aclObj = {}
      aclObj[aclKey1] = {
        read: true,
        write: true,
      }
      this.deviceForm.basedata.factory = this.currentDepartment.alias
      this.deviceForm.ACL = aclObj
      this.deviceForm.product = {
        __type: 'Pointer',
        className: 'Product',
        objectId: this.productId,
      }
      console.log('deviceForm', this.deviceForm)
    },
    mounted() {},
    destroyed() {},
    methods: {
      ...mapMutations({
        setCurrentDepartment: 'user/setCurrentDepartment',
      }),
      handleMenuClick(e) {
        console.error(e)
      },
      // 设备详情
      deviceToDetail(row) {
        this.$router.push({
          path: '/roles/editdevices',
          query: {
            deviceid: row.objectId,
            nodeType: row.nodeType,
            productid: row.product.objectId,
            ischildren: 'false',
          },
        })
      },
      // 迁移设备
      transferAcl(data) {
        const aclKey1 = 'role' + ':' + data.name
        const aclObj = {}
        aclObj[aclKey1] = {
          read: true,
          write: true,
        }
        this.deviceInfo.detail['factory'] = data.depname
        const parmas = {
          ACL: aclObj,
          detail: this.deviceInfo.detail,
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
                  type: 'success',
                  message: this.$translateTitle(`迁移成功`),
                })
              } else {
                this.$message({
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
        } else if (!_.isEmpty(basedata.basicdata)) {
          const st = prop.split('.')[2]
          return basedata?.basicdata[st] ? basedata.basicdata[st] : '暂无'
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
          lng: Number(baidulocation.location.lng),
          lat: Number(baidulocation.location.lat),
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
        this.dialog_device = true
        // this.$refs['map'].baiduCenter = position
        this.bmLabel = true
      },
      onSubmit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let params = this.deviceForm
            params.basedata[this.deviceForm.devaddr] =
              this.deviceForm.basedata.expirationTime
            console.error(params)
            return false
            const res = await postDevice(params)
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
      async command(row) {
        localStorage.removeItem('parse_objectid')
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: 'amis',
            title: { $ne: null },
            key: row.product.objectId,
            objectId: { $ne: null },
          },
        })
        if (_.isEmpty(results)) {
          this.$message.info('暂未配置下发控制表单')
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
          localStorage.setItem('parse_objectid', row.objectId)
        }
      },
      setting(row) {
        this.settingInfo.dialog = true
        console.log(row)
      },
      async statistics(row) {
        const params = {
          productid: '389a16cda1',
          devaddr: 'BasicInformation_22100027',
          timeint: 30,
        }
        // const params = {
        //   productid: row.product.objectId,
        //   devaddr: row.devaddr,
        // }
        try {
          const { results = '' } = await getStatistics(params)
          console.log(results)
          this.statisticsInfo.dialog = true
          console.log(row)
        } catch (e) {
          console.log(e)
          this.$message.error('查询新马赫运行统计时间出错' + e)
        }
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
      async fetchData() {
        console.log(this.queryForm.type, this.queryForm)
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {
            product: this.product,
          },
        }
        if (this.queryForm.type)
          params.where[this.queryForm.type] = this.queryForm.search.length
            ? { $regex: this.queryForm.search }
            : { $ne: '！' }
        console.info(params)
        this.listLoading = true
        const { results, count } = await querycompanyDevice(params)
        this.list = results
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .xinmahe-container {
    width: 100%;
    heigth: 100%;
  }
</style>
