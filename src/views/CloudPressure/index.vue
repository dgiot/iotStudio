<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-05-12 18:02:23
* @LastEditors: 18:02
* @LastEditTime: 2022-05-12 18:02:23
* @Description:
* @FilePath: src\views\CloudPressure\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<!-- eslint-disable  -->
<template>
  <div
    ref="pressure-table"
    class="pressure-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <el-dialog :visible.sync="showAddress" append-to-body width="60%">
      <div class="list">
        <baidu-map
          class="map"
          :center="{
            lat: Number(taskform.location && taskform.location.longitude),
            lng: Number(taskform.location && taskform.location.latitude),
          }"
          :zoom="15"
          :scroll-wheel-zoom="true"
          @click="getClickInfo"
        >
          <bm-marker
            :position="{
              lat: Number(taskform.location && taskform.location.longitude),
              lng: Number(taskform.location && taskform.location.latitude),
            }"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
            -
            <bm-label
              :content="`
                当前位置${taskform.location && taskform.location.addressText}
            `"
              :label-style="{ color: 'red', fontSize: '12px' }"
            />
          </bm-marker>
          <bm-circle
            :center="{
              lat: Number(taskform.location && taskform.location.longitude),
              lng: Number(taskform.location && taskform.location.latitude),
            }"
            :radius="taskform.location && taskform.location.radius"
            stroke-color="blue"
            :stroke-opacity="0.5"
            :stroke-weight="2"
            :editing="true"
            @lineupdate="updateCirclePath"
          ></bm-circle>

          <bm-navigation
            class="navigation"
            anchor="BMAP_ANCHOR_TOP_RIGHT"
          ></bm-navigation>
          <bm-overview-map
            class="overview"
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :is-open="true"
          ></bm-overview-map>
          <bm-geolocation
            class="geolocation"
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :show-address-bar="true"
            :auto-location="true"
          ></bm-geolocation>
          <!-- <bm-panorama :offset="{ width: 80, height: 8 }"></bm-panorama> -->

          <bm-map-type
            :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
            anchor="BMAP_ANCHOR_TOP_LEFT"
          ></bm-map-type>
        </baidu-map>
        <el-divider><i class="el-icon-map-location"></i></el-divider>
        <p>
          当前选择的地址是
          {{ taskform.location && taskform.location.addressText }}
        </p>
        <p>半径范围{{ taskform.location && taskform.location.radius }}</p>
        <p>
          地理经纬度逆解析{{
            (taskform.location && taskform.location.latitude) +
            ',' +
            (taskform.location && taskform.location.longitude)
          }}
        </p>
      </div>
    </el-dialog>
    <div class="dialog">
      <el-dialog title="添加压测任务" append-to-body :visible.sync="addVisible">
        <el-form :model="form">
          <el-row style="width: 96%; margin: 0 2% 0 0">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="名称" prop="name">
                <el-input
                  v-model="addDate.name"
                  autocomplete="off"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="备注信息">
                <el-input
                  v-model="addDate.remarks"
                  autocomplete="off"
                  placeholder="请输入备注信息"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="addDate.startTime"
                  type="datetime"
                  placeholder="请选择开始时间"
                  value-format="timestamp"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="addDate.endTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  value-format="timestamp"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="压测服务器">
                <el-select
                  v-model="addDate.server"
                  style="width: 100%"
                  placeholder="请选择压测服务器"
                >
                  <el-option
                    v-for="(item, index) in serveObj"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.name"
                    :data-index="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="版本号">
                <el-select
                  v-model="addDate.version"
                  style="width: 100%"
                  placeholder="请选择压测版本号"
                >
                  <el-option
                    v-for="(item, index) in versionObj"
                    :key="item && item.objectId"
                    :label="item && item.name"
                    :value="item && item.name"
                    :data-index="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="压测指标">
                <el-select
                  v-model="addDate.version"
                  style="width: 100%"
                  placeholder="请选择压测指标"
                >
                  <el-option
                    v-for="(item, index) in bechObj"
                    :key="item && item.objectId"
                    :label="item && item.name"
                    :value="item && item.name"
                    :data-index="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="压测目标">
                <el-select
                  v-model="addDate.version"
                  style="width: 100%"
                  placeholder="请选择压测目标"
                >
                  <el-option
                    v-for="(item, index) in bechIndex"
                    :key="item && item.objectId"
                    :label="item && item.name"
                    :value="item && item.name"
                    :data-index="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="地址位置">
                <el-input
                  v-model="addDate.addressText"
                  placeholder="请选择地理位置信息"
                >
                  <template slot="append">
                    <el-button
                      class="el-icon-map-location"
                      @click="showAddress = true"
                    >
                      选择地理位置
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="是否运行删除">
                <el-radio-group v-model="addDate.isTemp">
                  <el-radio border :label="true">允许</el-radio>
                  <el-radio border :label="false">不允许</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendDate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="draw">
      <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        :visible="commandInfo.dialog"
        :width="960"
        @close="onClose"
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
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
        </div>
      </a-drawer>
    </div>
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
            <el-input v-model="queryForm.name" placeholder="请输入压测任务名" />
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
              @click="addVisible = true"
            >
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>

    <a-tabs v-model="activeKey">
      <a-tab-pane key="task" tab="新增任务">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :border="border"
          :data="list"
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

          <el-table-column align="center" fixed="right" label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="handleClick(row, 'setting')">
                查看配置
              </el-button>
              <el-button type="text" @click="handleClick(row, 'edit')">
                修改配置
              </el-button>
              <el-button
                type="text"
                @click="
                  handleClick(row, row.isEnable == false ? 'start' : 'stop')
                "
              >
                {{ row.isEnable == false ? '启动压测' : '停止压测' }}
              </el-button>
              <el-button type="text" @click="handleClick(row, 'clone')">
                克隆任务
              </el-button>
              <el-button type="text" @click="handleClick(row, 'delete')">
                删除任务
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../public/assets/images/platform/assets/empty_images/data_empty.png')
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
      </a-tab-pane>
      <a-tab-pane key="report" tab="任务报告">
        <dgiot-empty />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { queryDevice, getDevice, delDevice, postDevice } from '@/api/Device'
  import { queryView } from '@/api/View'

  export default {
    name: 'Pressure',
    components: {},
    props: {},
    data() {
      return {
        addDate: {
          name: '',
          version: '',
          remarks: '',
          server: '',
          startTime: '',
          endTime: '',
          addressText: '',
          isTemp: false,
        },
        taskform: {},
        formLabelWidth: '50%',
        addVisible: false,
        showAddress: false,
        commandInfo: {
          dialog: false,
          data: {},
        },
        activeName: '0',
        form: {},
        activeKey: 'task',
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(1),
        stripe: true,
        lineHeight: 'medium',
        checkList: ['压测任务', '开始时间', '结束时间', '压测任务状态'],
        columns: [
          {
            label: '压测任务',
            width: 'auto',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '开始时间',
            width: '200',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: '结束时间',
            width: '200',
            prop: 'updatedAt',
            sortable: true,
          },
          {
            label: '压测任务状态',
            width: '200',
            prop: 'isEnable',
            sortable: true,
          },
        ],
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          skip: 0,
          limit: 10,
          name: '',
          search: '',
          type: 'name',
        },
        versionObj: [],
        serveObj: [],
        bechObj: [],
        bechIndex: [],
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
    mounted() {
      this.fetchData()
    },
    created() {
      this.fetchData()
    },
    destroyed() {},
    methods: {
      async sendDate() {
        console.log(this.addDate)
        //api
        let res = await postDevice(this.addDate)
        console.log(this.addDate)
        //   if (res.data.code>=200 && res.data.code <300) {
        //     this.$message({
        //       type: 'success',
        //       message: '添加成功',
        //       showClose: true,
        //     })
        //     this.dialogFormVisible = false
        //   } else {
        //     this.$message({
        //       type: 'success',
        //       message: `添加失败，${res.data.message}`,
        //       showClose: true,
        //     })
        //   }
      },
      handleAdd() {
        this.addVisible = true
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      async command(row) {
        localStorage.setItem('parse_objectid', row.objectId)
        const { results = [] } = await queryView({
          where: {
            class: 'Product',
            type: 'amis',
            key: row.product.objectId,
          },
        })
        if (_.isEmpty(results)) {
          localStorage.removeItem('parse_objectid')
          this.$message.info('暂未配置下发控制表单')
          return false
        } else {
          this.commandInfo.dialog = true
          this.commandInfo.data = results
        }
      },
      onClose() {
        this.commandInfo.data = []
        this.commandInfo.dialog = !this.commandInfo.dialog
        localStorage.removeItem('parse_objectid')
      },
      handleClick(col, type) {
        this.taskform = col
        switch (type) {
          case 'setting':
            this.command(col)
            break
          case 'edit':
            this.$message({
              type: 'success',
              message: '你的弹出框修改事件',
              showClose: true,
            })
            break
          case 'start':
            this.$message({
              type: 'success',
              message: '启动任务请求',
              showClose: true,
            })
            break
          case 'stop':
            this.$message({
              type: 'success',
              message: '停止任务请求',
              showClose: true,
            })
            break
          case 'clone':
            this.$message({
              type: 'success',
              message: '克隆任务请求',
              showClose: true,
            })
            break
          case 'delete':
            this.handleDelete(row)
            break
        }
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(row.objectId)
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
          await this.fetchData()
        })
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
        this.queryForm.limit = 10
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {},
        }
        this.queryForm.name
          ? (params.where.name = { $regex: this.queryForm.name })
          : ''
        const { count = 0, results = [] } = await queryDevice(params)
        results.forEach((i) => {
          i.createdAt = this.$moment(i.createdAt).format('YYYY-MM-DD HH:mm:ss')
          i.updatedAt = this.$moment(i.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.list = results
        this.total = count
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 0px !important;
  }

  .index-container {
    width: 100%;
    heigth: 100%;
  }
</style>
