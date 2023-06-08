<template>
  <div class="appmarage appmarage-container">
    <div class="header">
      <el-button size="small" type="primary" @click="checkupdateall">
        插件升级
      </el-button>
      <el-button size="small" type="primary" @click="updateallFiled">
        数据库升级
      </el-button>
    </div>
    <div class="block" style="margin-top: 10px">
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search || data.app.toLowerCase().includes(search.toLowerCase())
          )
        "
        :height="height"
        style="width: 100%; text-align: center"
      >
        <el-table-column align="center" label="App">
          <template #default="{ row }">
            <span :style="{ color: row.active == true ? 'green' : 'red' }">
              {{ row.app }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('plugins.version')"
          prop="version"
          sortable
        />
        <el-table-column
          align="center"
          :label="$translateTitle('developer.describe')"
          prop="desc"
          sortable
        />
        <el-table-column
          align="right"
          :label="$translateTitle('developer.operation')"
        >
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              :placeholder="$translateTitle('plugins.enterappsearch')"
              size="mini"
            />
          </template>
          <template #default="{ row }">
            <el-button
              v-if="row.active == false"
              plain
              size="small"
              type="info"
              @click="startup(row.app)"
            >
              <div
                style="
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  margin-right: 10px;
                  background: #00cc33;
                  border-radius: 50%;
                "
              />
              {{ $translateTitle('plugins.start') }}
            </el-button>
            <el-button
              v-if="row.active == true"
              plain
              size="small"
              type="info"
              @click="stopup(row.app)"
            >
              <div
                style="
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  margin-right: 10px;
                  background: #a94442;
                  border-radius: 50%;
                "
              />
              {{ $translateTitle('plugins.stop') }}
            </el-button>
            <el-button
              plain
              size="small"
              type="info"
              @click="checkupdate(row.app)"
            >
              {{ $translateTitle('plugins.checkupdate') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    fix https://gitee.com/dgiiot/dgiot/issues/I4TRSB-->
    <div class="block">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="length"
        :page-sizes="[10, 25, 50, 100]"
        style="margin-top: 30px"
        :total="
          search.length
            ? tableData.filter(
                (data) =>
                  !search ||
                  data.app.toLowerCase().includes(search.toLowerCase())
              ).length
            : total
        "
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog
      :append-to-body="true"
      :before-close="handleClose"
      :title="$translateTitle('plugins.modulelist')"
      :visible.sync="dialogVisible"
    >
      <div>
        <el-table
          :data="tableData1.slice((start1 - 1) * length1, start1 * length1)"
          height="300"
          style="width: 100%; margin-top: 20px; text-align: center"
        >
          <el-table-column
            align="center"
            label="插件名称"
            prop="app"
            sortable
          />
          <el-table-column
            align="center"
            :label="$translateTitle('plugins.modulename')"
            prop="path"
            sortable
          />
          <el-table-column
            align="center"
            label="插件版本"
            prop="version"
            sortable
          />
          <el-table-column
            align="center"
            :label="$translateTitle('plugins.modulename')"
            prop="path"
            sortable
          />
          <el-table-column
            align="center"
            :label="$translateTitle('plugins.ischange')"
            prop="is_changed"
            show-overflow-tooltip
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <el-tag
                :effect="row.is_changed ? 'plain' : 'dark'"
                :type="row.is_changed ? '' : 'info'"
              >
                {{ row.is_changed }}
                <!-- {{ row.is_changed ? '已修改' : '未修改' }} -->
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="length1"
          :page-sizes="[10, 25, 50, 100]"
          :total="total1"
          @current-change="handleCurrentChange1"
          @size-change="handleSizeChange1"
        />
      </div>
      <span slot="footer" style="display: block; padding: 0 0 20px 0">
        <el-button
          size="mini"
          style="float: left"
          @click="dialogVisible = false"
        >
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button
          size="mini"
          style="float: right"
          type="primary"
          @click.native="reupload"
        >
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    Getapp,
    Getmodule,
    GetReload,
    Getstart,
    Getstop,
    updateall,
  } from '@/api/System/index'

  var table = []
  var table1 = []
  export default {
    data() {
      return {
        height: this.$baseTableHeight(0) - 15,
        tableData: [],
        total: 0,
        start: 1,
        length: 10,
        node: null,
        dialogVisible: false,
        start1: 1,
        length1: 10,
        total1: 0,
        tableData1: [],
        app: '',
        version: '',
        searchvalue: '',
        search: '',
      }
    },
    computed: {},
    mounted() {
      this.getInformation()
    },
    methods: {
      handleSizeChange(val) {
        this.start = 1
        this.length = val
      },
      handleCurrentChange(val) {
        this.start = val
      },
      // 检查更新
      handleSizeChange1(val) {
        this.start1 = 1
        this.length1 = val
      },
      handleCurrentChange1(val) {
        this.start1 = val
      },
      getInformation() {
        // 初始化数据
        Getapp(this.node, this.start, this.length)
          .then((response) => {
            if (response) {
              this.tableData = response.apps
              table = response.apps
              this.total = response.recordsTotal
            }
          })
          .catch((error) => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'error',
              message: error.error,
            })
          })
      },
      handleClose() {
        this.dialogVisible = false
      },
      changedialog() {
        if (this.searchvalue == '') {
          this.tableData1 = table1
        }
        this.tableData1 = tableData1.filter(
          (data) =>
            !this.searchvalue ||
            data.path.toLowerCase().includes(searchvalue.toLowerCase())
        )
      },
      checkupdate(app) {
        // 点击检查更新数据
        this.tableData1 = []
        this.searchvalue = ''
        this.dialogVisible = true
        ;(this.app = app), (this.total1 = 0)
        Getmodule(app).then((res) => {
          if (res) {
            res.map((item) => {
              if (item.is_changed == false) {
                item.is_changed = 'false'
              } else {
                item.is_changed = 'true'
              }
            })
            this.tableData1 = res
            table1 = res
            this.total1 = res.length
          }
        })
      },
      checkupdateall() {
        this.searchvalue = ''
        this.dialogVisible = true
        this.tableData1 = []
        this.total1 = 0
        this.app = ''
        Getmodule('changed').then((res) => {
          if (res) {
            res.map((item) => {
              if (item.is_changed == false) {
                item.is_changed = 'false'
              } else {
                item.is_changed = 'true'
              }
            })
            this.tableData1 = res
            table1 = res
            this.total1 = res.length
          }
        })
      },
      // 启动
      startup(app) {
        Getstart(app)
          .then((response) => {
            if (response) {
              this.$message({
                showClose: true,
                duration: 2000,
                message: '启动成功',
                type: 'success',
              })
              this.getInformation()
            }
          })
          .catch((error) => {
            dgiotlog.log(error)
          })
      },
      // 停止
      stopup(app) {
        Getstop(app)
          .then((response) => {
            if (response) {
              this.$message({
                showClose: true,
                duration: 2000,
                message: '停止成功',
                type: 'success',
              })
              this.getInformation()
            }
          })
          .catch((error) => {
            dgiotlog.log(error)
          })
      },
      async updateallFiled() {
        const { msg = '数据库升级成功' } = await updateall()
        this.$message({
          showClose: true,
          duration: 2000,
          message: msg,
          type: 'success',
        })
      },
      reupload() {
        if (this.app == '') {
          GetReload('all').then((response) => {
            console.log('module', response)
            if (response) {
              if (response.length == 0) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '当前无更新',
                  type: 'warning',
                })
              } else {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '已更新模块',
                  type: 'success',
                })
              }
            }
          })
        } else {
          GetReload(this.app).then((response) => {
            if (response) {
              if (response.length == 0) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '当前无更新',
                  type: 'warning',
                })
              } else {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '已更新模块',
                  type: 'success',
                })
              }
              this.app == ''
            }
          })
        }
        setTimeout(() => {
          this.dialogVisible = false
        }, 3000)
      },
    },
  }
</script>
