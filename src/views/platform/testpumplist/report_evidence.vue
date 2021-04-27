<template>
  <div class="report_evidence">
    <Pumpdepartment
      style="
        flex-shrink: 0;
        width: 360px;
        height: 100vh;
        padding: 10px;
        overflow: scroll;
      "
      @pumpDetail="getPumpNode"
    />
    <div
      style="
        width: calc(100% - 360px);
        padding: 10px 20px 10px 20px;
        background: azure;
      "
    >
      <div class="righttop">
        <p style="font-size: 20px">
          <svg-icon icon-class="shenhe1" style="width: 2rem; height: 2rem" />
          审核总体概括
        </p>
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
      </div>
      <div>
        <p style="margin: 0 0 10px 0; font-size: 20px">
          <svg-icon icon-class="shenhe2" style="width: 2rem; height: 2rem" />
          审核列表管理
        </p>
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          size="small"
          label-width="100px"
        >
          <el-form-item label="审核状态">
            <el-select v-model="formInline.region" placeholder="审核状态">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请开始时间">
            <el-date-picker
              v-model="formInline.starttime"
              type="datetime"
              placeholder="请选择日期时间"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="formInline.endtime"
              type="datetime"
              placeholder="请选择日期时间"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="formInline.unit" placeholder="按企业名称查找" />
          </el-form-item>
          <el-form-item label="检测人员">
            <el-input
              v-model="formInline.people"
              placeholder="按检测人员查找"
            />
          </el-form-item>
          <el-form-item label="水泵类型">
            <el-input
              v-model="formInline.pumptype"
              placeholder="按水泵类型查找"
            />
          </el-form-item>
          <el-form-item label="取证实验编号">
            <el-input
              v-model="formInline.number"
              placeholder="按取证编号查找"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="onSubmit">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%; text-align: center">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column
          prop="date"
          label="检测取证编号"
          align="center"
          width="180"
        />
        <el-table-column
          prop="name"
          label="委托方"
          align="center"
          width="200"
        />
        <el-table-column
          prop="address"
          align="center"
          label="所属地址"
          width="200"
        />
        <el-table-column
          prop="name"
          label="委托人联系方式"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="水泵类型"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="水泵型号"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="检测单位"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="检测标准"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="检测实验室"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="检测台体"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="审核提交时间"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="审核状态"
          align="center"
          width="200"
        />
        <el-table-column
          prop="name"
          label="审核人员"
          align="center"
          width="200"
        />
        <el-table-column prop="name" label="备注" align="center" width="200" />
        <el-table-column
          prop="name"
          label="检测取证审核"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" size="small">
              <svg-icon
                icon-class="chakan"
                style="width: 1.5rem; height: 1.5rem"
              />
            </el-link>
            <el-link :underline="false" type="primary" size="small">
              <svg-icon
                icon-class="shenhe"
                style="width: 1.5rem; height: 1.5rem"
              />
            </el-link>
            <el-link :underline="false" type="primary" size="small">
              <svg-icon
                icon-class="chexiao"
                style="width: 1.5rem; height: 1.5rem"
              />
            </el-link>
            {{ scope }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        :total="400"
        style="margin-top: 20px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
  import Pumpdepartment from '@/components/resource/pumpdepartment'
  import { returnLogin } from '@/utils/return'
  import PanelGroup from './PanelGroup'
  export default {
    components: {
      Pumpdepartment,
      PanelGroup,
    },
    data() {
      return {
        formInline: {
          user: '',
          region: '',
          starttime: '',
          endtime: '',
          unit: '',
          people: '',
          pumptype: '',
          number: '',
        },
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
          },
        ],
      }
    },
    mounted() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .report_evidence {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    background: #ffffff;
    ::v-deep .el-form {
      .el-input {
        width: 200px;
      }
    }
  }
</style>
