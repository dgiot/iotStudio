<template>
  <div class="TypeTest">
    <el-row>
      <el-col :span="10">
        <el-row>
          <el-col :span="6">当前规定点信息</el-col>

          <el-col :span="18">
            <!--       <table class="table_default1">
    <tr>
      <th>序号</th>
      <th v-for="key in orderBy" >
        {{tableTh[key].title}}
      </th>
    </tr>
    <tr v-for="(tr,i) in dataList">
      <td>{{i+1}}</td>
      <td v-for="key in orderBy" v-bind:align="tableTh[key].align">
        {{tr[key]}}
      </td>
    </tr>
            </table>-->

            <table class="pre-point">
              <tr>
                <th>Q(l/s)</th>
                <th>H(m)</th>
                <th>rpm(r/min)</th>
                <th>pa(kW)</th>
                <th>Eff(%)</th>
                <th>NPSH(m)</th>
              </tr>
              <tr>
                <td v-for="(val, index) in 6" :key="index">{{ val }}</td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <div class="box-2"></div>
      </el-col>

      <el-col :span="14">
        <div class="type-test-right-box">
          <el-row :gutter="24">
            <el-col :span="19">
              <table class="pre-point">
                <tr>
                  <th>流量(1/s)</th>
                  <th>进口压力(KPa)</th>
                  <th>进口扬程(m)</th>
                  <th>出口压力(KPa)</th>
                  <th>出口扬程(m)</th>
                  <th>总扬程(m)</th>
                  <th>功率 (kw)</th>
                  <th>转速(m)</th>
                  <th>电流(A)</th>
                  <th>电压(V)</th>
                </tr>
                <tr>
                  <td v-for="(val, index) in 10" :key="index">{{ val }}</td>
                </tr>
              </table>
            </el-col>
            <el-col :span="5">
              <table class="pre-point">
                <tr>
                  <th>流量(l/s)</th>
                  <th>扬程(m)</th>
                  <th>功率(kw)</th>
                  <th>效率(%)</th>
                </tr>
                <tr>
                  <td>{{ '' }}</td>
                  <td>{{ '' }}</td>
                  <td>{{ '' }}</td>
                  <td>{{ '' }}</td>
                </tr>
              </table>
            </el-col>
          </el-row>
        </div>

        <div class="type-test-rb-box">
          <el-button plain type="primary" size="small">类比</el-button>
          <el-button plain type="primary" size="small">曲线</el-button>
          <el-button plain type="primary" size="small">开始</el-button>
          <el-button plain type="primary" size="small">停止</el-button>
          <el-button plain type="primary" size="small">测试结果</el-button>
          <el-button plain type="primary" size="small">汽蚀测试</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'TypeTest',
    data() {
      return {
        dataList: [1, 2, 3, 4, 5, 6],
      }
    },
    computed: {
      taskid: function () {
        return this.$route.query.taskid
      },
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
      ...mapState({
        currentTask: (state) => state.deviceData.currentTask,
      }),
    },
    created() {
      this.$baseEventBus.$on('typeTestDialog', this.init)
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.$baseEventBus.$off('typeTestDialog')
    },
    methods: {
      init() {
        console.log('init')
      },
    },
  }
</script>
<style lang="scss">
  table.pre-point {
    border-collapse: collapse;

    th,
    td {
      padding: 8px;
      text-align: center;
      border: 1px solid #ccc;
    }
  }
  div.box-2 {
    height: 400px;
    background: #ddd;
  }
  .type-test-right-box {
    height: 400px;
    margin-top: 80px;
  }
  .type-test-rb-box {
    padding: 20px;
    margin-top: 10px;
  }
</style>
