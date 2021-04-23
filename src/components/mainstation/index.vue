import { lang } from
'../../../../www/common/AdminLTE-2.4.2/bower_components/moment/moment';
<template>
  <div class="mainstation">
    <div>
      <el-row :gutter="32">
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position: relative">
            <span
              style="
                margin-top: -20px;
                margin-left: 10px;
                position: fixed;
                top: -5;
                left: 10;
                background: white;
              "
            >
              终端信息
            </span>
            <div class="outmain">
              <label for>终端编码：</label>
              <el-input
                v-model="msg.bianma"
                type="text"
                style="display: inline-block; width: 200px"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position: relative">
            <span
              style="
                margin-top: -20px;
                margin-left: 10px;
                position: fixed;
                top: -5;
                left: 10;
                background: white;
              "
            >
              系统时间：
            </span>
            <div class="outmain">
              <el-input
                v-model="readtime"
                type="text"
                style="display: inline-block; width: 300px"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple" style="position: relative">
            <span
              style="
                margin-top: -20px;
                margin-left: 10px;
                position: fixed;
                top: -5;
                left: 10;
                background: white;
              "
            >
              等待应答反馈时间/秒
            </span>
            <div class="outmain">
              <el-input
                v-model="msg.time"
                type="number"
                style="display: inline-block; width: 200px"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <el-button @click="chuandi">sss</el-button> -->
  </div>
</template>
<script>
  export default {
    name: 'Mainstation',
    data() {
      return {
        msg: {
          bianma: '',
          time: '',
        },
        readtime: '',
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(function () {
        // setInterval(this.nowtime, 1000);
        this.nowtime
        // this.getinformation()
      })
    },
    methods: {
      nowtime() {
        var timestamp3 = Date.parse(new Date())
        var date = new Date(timestamp3)
        var Y = date.getFullYear() + '年'
        var M =
          (date.getMonth() + 1 <= 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '月'
        var D =
          (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) +
          '日  '
        var h =
          (date.getHours() + 1 <= 10
            ? '0' + date.getHours()
            : date.getHours()) + ':'
        var m =
          (date.getMinutes() + 1 <= 10
            ? '0' + date.getMinutes()
            : date.getMinutes()) + ':'
        var s =
          date.getSeconds() + 1 <= 10
            ? '0' + date.getSeconds()
            : date.getSeconds()
        this.readtime = Y + M + D + h + m + s
        this.$emit('handback', this.msg)
      },
      getinformation() {},
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    height: 60px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<style>
  .mainstation .el-input__inner {
    background: #cccccc;
    color: black;
  }
  .mainstation {
    padding-bottom: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #cccccc;
  }
</style>
