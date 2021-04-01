<template>
  <div class="appmarage">
    <div class="header">
      <el-button type="primary" size="small" @click="checkupdateall">
        {{ $translateTitle('plugins.checkupdate') }}
      </el-button>
    </div>
    <div class="block" style="margin-top: 10px">
      <el-table
        :data="tableData.slice((start - 1) * length, start * length)"
        style="width: 100%; text-align: center"
      >
        <el-table-column label="App" align="center">
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.active == true ? 'green' : 'red' }"
            >
              {{ scope.row.app }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('plugins.version')"
          prop="version"
          align="center"
          sortable
        />
        <el-table-column
          :label="$translateTitle('developer.describe')"
          prop="desc"
          align="center"
          sortable
        />
        <el-table-column
          :label="$translateTitle('developer.operation')"
          align="right"
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
              type="info"
              size="small"
              plain
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
              type="info"
              size="small"
              plain
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
              type="info"
              size="small"
              plain
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
        :page-sizes="[10, 25, 50, 100]"
        :page-size="length"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 30px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="$translateTitle('plugins.modulelist')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="40%"
    >
      <div>
        <el-table
          :data="tableData1.slice((start1 - 1) * length1, start1 * length1)"
          height="300"
          style="width: 100%; margin-top: 20px; text-align: center"
        >
          <el-table-column
            :label="$translateTitle('plugins.modulename')"
            prop="path"
            sortable
            align="center"
          />
          <el-table-column
            :label="$translateTitle('plugins.ischange')"
            prop="is_changed"
            sortable
            align="center"
          />
        </el-table>
        <div class="block">
          <el-pagination
            :page-sizes="[10, 25, 50, 100]"
            :page-size="length1"
            :total="total1"
            background
            layout="total, sizes, prev, pager, next, jumper"
            style="margin-top: 30px"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="float: left" @click="dialogVisible = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button style="float: right" type="primary" @click="reupload">
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
<style scoped>
  .appmarage {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
  }
</style>
<style>
  .appmarage .el-dialog__footer {
    padding-bottom: 50px;
  }
  .appmarage .el-table th.is-leaf {
    padding: 5px 0;
  }
</style>
