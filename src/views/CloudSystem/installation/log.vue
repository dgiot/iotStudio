<template>
  <div class="log log-container">
    <!--    <div class="left">-->
    <!--      <el-button-->
    <!--        type="primary"-->
    <!--        icon="el-icon-circle-plus-outline"-->
    <!--        size="small"-->
    <!--        @click="install"-->
    <!--      >-->
    <!--        {{ $translateTitle('node.join') }}-->
    <!--      </el-button>-->
    <!--    </div>-->

    <!--    <el-table-->
    <!--      :height="height"-->
    <!--      :data="tableData5.slice((start - 1) * length, start * length)"-->
    <!--      style="width: 100%; margin-top: 20px"-->
    <!--      border-->
    <!--    >-->
    <!--      <el-table-column :label="$translateTitle('node.nodename')" prop="name" />-->
    <!--      <el-table-column-->
    <!--        :label="'Erlang/' + $translateTitle('node.OTPversion')"-->
    <!--        prop="otp_release"-->
    <!--      />-->
    <!--      <el-table-column>-->
    <!--        <template slot="header">-->
    <!--          <span>-->
    <!--            {{ 'Erlang' + $translateTitle('node.process') }}-->
    <!--          </span>-->
    <!--          <p>used/avaliable</p>-->
    <!--        </template>-->
    <!--        <template #default="{ row }">-->
    <!--          <span>-->
    <!--            {{ row.process_used + '/' + row.process_available }}-->
    <!--          </span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="CPU">-->
    <!--        <template slot="header">-->
    <!--          <span>CPU</span>-->
    <!--          <p>1load/5load/15load</p>-->
    <!--        </template>-->
    <!--        <template #default="{ row }">-->
    <!--          <span>-->
    <!--            {{-->
    <!--              row.load1 + '/' + row.load5 + '/' + row.load15-->
    <!--            }}-->
    <!--          </span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column :label="$translateTitle('node.memory')">-->
    <!--        <template slot="header">-->
    <!--          <span>-->
    <!--            {{ $translateTitle('node.memory') }}-->
    <!--          </span>-->
    <!--          <p>used/total</p>-->
    <!--        </template>-->
    <!--        <template #default="{ row }">-->
    <!--          <span>-->
    <!--            {{ row.memory_used + '/' + row.memory_total }}-->
    <!--          </span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column-->
    <!--        :label="$translateTitle('node.Maximumnumberofhandles')"-->
    <!--        prop="max_fds"-->
    <!--      />-->
    <!--      <el-table-column-->
    <!--        :label="$translateTitle('node.state')"-->
    <!--        prop="node_status"-->
    <!--      />-->
    <!--      <el-table-column :label="$translateTitle('node.operation')">-->
    <!--        <template #default="{ row }">-->
    <!--          <el-button type="danger" size="small" @click="removeNode(row.">-->
    <!--            {{ $translateTitle('node.remove') }}-->
    <!--          </el-button>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <!--    <div class="block" style="margin-top: 30px">-->
    <!--      <el-pagination-->
    <!--        :page-sizes="[10, 25, 50, 100]"-->
    <!--        :page-size="length"-->
    <!--        :total="total"-->
    <!--        background-->
    <!--        layout="total, sizes, prev, pager, next, jumper"-->
    <!--        @size-change="handleSizeChange"-->
    <!--        @current-change="handleCurrentChange"-->
    <!--      />-->
    <!--    </div>-->
    <el-dialog
      :append-to-body="true"
      :before-close="handleClose"
      :title="$translateTitle('node.joincluster')"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ $translateTitle('node.nodename') }}</span>
      <el-input v-model="form.nodename" type="text" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="join">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getNode, joinNode } from '@/api/System/index'

  export default {
    data() {
      return {
        form: {
          nodename: '',
        },
        height: this.$baseTableHeight(0) - 25,
        tableData5: [],
        node: null,
        start: 1,
        length: 10,
        total: 0,
        draw: 1,
        search: '',
        dialogVisible: false,
        installtion: [],
        selsectinstall: [
          {
            value: 'info',
            label: 'info',
          },
          {
            value: 'error',
            label: 'error',
          },
          {
            value: 'warning',
            label: 'warning',
          },
          {
            value: 'debug',
            label: 'debug',
          },
          {
            value: 'mqtt',
            label: 'mqtt',
          },
          {
            value: 'kafka',
            label: 'kafka',
          },
          {
            value: 'alert',
            label: 'alert',
          },
          {
            value: 'critical',
            label: 'critical',
          },
          {
            value: 'emergency',
            label: 'emergency',
          },
          {
            value: 'notice',
            label: 'notice',
          },
        ],
      }
    },
    mounted() {
      this.Getinformation()
    },
    methods: {
      Getinformation() {
        getNode(this.start, this.lengt).then((response) => {
          if (response) {
            this.tableData5 = response.nodes
            this.total = response.nodes.length
          }
        })
      },
      handleSizeChange(val) {
        this.length = val
        this.start = 1
      },
      handleCurrentChange(val) {
        this.start = val
      },
      //   tableRowClassName({row, rowIndex}) {
      //     if(row.level=='error'){
      //          return 'error-row';
      //     }else if(row.level=='info'){
      //          return 'success-row';
      //     }else if(row.level=='debug'){
      //         return 'debug-row'
      //     }
      //     else{
      //         return 'warning-row';
      //     }
      //   },
      join() {
        joinNode('join', this.form.nodename)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '加入成功',
              })
              this.dialogVisible = false
              this.Getinformation()
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
      removeNode(row) {
        joinNode('leave', row.node)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: '移除成功',
              })
              this.Getinformation()
            }
          })
          .catch((error) => {
            this.$message(error.error)
          })
      },
      install() {
        this.dialogVisible = true
      },
      handleClose() {
        this.dialogVisible = false
      },
    },
  }
</script>
