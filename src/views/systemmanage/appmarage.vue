<template>
  <div class="appmarage appmarage-container">
    <div class="header">
      <el-button
        size="small"
        type="primary"
        @click="checkupdateall"
      >
        {{ $translateTitle('plugins.checkupdate') }}
      </el-button>
    </div>
    <div
      class="block"
      style="margin-top: 10px"
    >
      <el-table
        :data="tableData.slice((start - 1) * length, start * length)"
        :height="height"
        style="width: 100%; text-align: center"
      >
        <el-table-column
          align="center"
          label="App"
        >
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.active == true ? 'green' : 'red' }"
            >
              {{ scope.row.app }}
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
              @change="changevalue"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.active == false"
              plain
              size="small"
              type="info"
              @click="startup(scope.row.app)"
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
              v-if="scope.row.active == true"
              plain
              size="small"
              type="info"
              @click="stopup(scope.row.app)"
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
              @click="checkupdate(scope.row.app)"
            >
              {{ $translateTitle('plugins.checkupdate') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="length"
        :page-sizes="[10, 25, 50, 100]"
        style="margin-top: 30px"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog
      :append-to-body="true"
      :before-close="handleClose"
      :title="$translateTitle('plugins.modulelist')"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <div>
        <el-table
          :data="tableData1.slice((start1 - 1) * length1, start1 * length1)"
          height="300"
          style="width: 100%; margin-top: 20px; text-align: center"
        >
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
            sortable
          />
        </el-table>
        <div class="block">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="length1"
            :page-sizes="[10, 25, 50, 100]"
            style="margin-top: 30px"
            :total="total1"
            @current-change="handleCurrentChange1"
            @size-change="handleSizeChange1"
          />
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          style="float: left"
          @click="dialogVisible = false"
        >
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button
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
    Getstart,
    Getstop,
    GetReload,
  } from '@/api/System/index'
  import Cookies from 'js-cookie'
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
              type: 'error',
              message: error.error,
            })
          })
      },
      handleClose() {
        this.dialogVisible = false
      },
      changevalue() {
        if (this.search == '') {
          this.tableData = table
        }
        this.tableData = this.tableData.filter(
          (data) =>
            !this.search ||
            data.app.toLowerCase().includes(this.search.toLowerCase())
        )
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
                message: '启动成功',
                type: 'success',
              })
              this.getInformation()
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      // 停止
      stopup(app) {
        Getstop(app)
          .then((response) => {
            if (response) {
              this.$message({
                message: '停止成功',
                type: 'success',
              })
              this.getInformation()
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      reupload() {
        if (this.app == '') {
          GetReload('all').then((response) => {
            if (response) {
              if (response.length == 0) {
                this.$message({
                  message: '当前无更新',
                  type: 'warning',
                })
              } else {
                this.$message({
                  message: '已更新模块' + response,
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
                  message: '当前无更新',
                  type: 'warning',
                })
              } else {
                this.$message({
                  message: '已更新模块' + response,
                  type: 'success',
                })
              }
              this.app == ''
            }
          })
        }
      },
    },
  }
</script>
