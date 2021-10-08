<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row :gutter="32">
      <el-col :lg="12" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :lg="12" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <span>台区用电量排名</span>
          <el-button-group style="float: right">
            <el-button type="primary" @click.native="daydata">日</el-button>
            <el-button type="primary">月</el-button>
            <el-button type="primary">年</el-button>
          </el-button-group>
          <Circularchart />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-button type="info">日用电量</el-button>
          <el-button type="info">月用电量</el-button>
          <bar-chart/>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <scatter-chart :chart-data="scatterChartData"/>
    </el-row> -->
  </div>
</template>

<script>
  // import GithubCorner from '@/components/GithubCorner'
  import LineChart from './components/LineChart'
  // import TransactionTable from './components/TransactionTable'
  import Circularchart from './components/Circularchart'
  // import BoxCard from './components/BoxCard'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145],
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130],
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130],
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130],
    },
  }
  const scatterChartData = [
    [
      [28604, 77, 17096869, 'Australia', 1990],
      [31163, 77.4, 27662440, 'Canada', 1990],
      [1516, 68, 1154605773, 'China', 1990],
      [13670, 74.7, 10582082, 'Cuba', 1990],
      [28599, 75, 4986705, 'Finland', 1990],
      [29476, 77.1, 56943299, 'France', 1990],
      [31476, 75.4, 78958237, 'Germany', 1990],
      [28666, 78.1, 254830, 'Iceland', 1990],
      [1777, 57.7, 870601776, 'India', 1990],
      [29550, 79.1, 122249285, 'Japan', 1990],
      [2076, 67.9, 20194354, 'North Korea', 1990],
      [12087, 72, 42972254, 'South Korea', 1990],
      [24021, 75.4, 3397534, 'New Zealand', 1990],
      [43296, 76.8, 4240375, 'Norway', 1990],
      [10088, 70.8, 38195258, 'Poland', 1990],
      [19349, 69.6, 147568552, 'Russia', 1990],
      [10670, 67.3, 53994605, 'Turkey', 1990],
      [26424, 75.7, 57110117, 'United Kingdom', 1990],
      [37062, 75.4, 252847810, 'United States', 1990],
    ],
    [
      [44056, 81.8, 23968973, 'Australia', 2015],
      [43294, 81.7, 35939927, 'Canada', 2015],
      [13334, 76.9, 1376048943, 'China', 2015],
      [21291, 78.5, 11389562, 'Cuba', 2015],
      [38923, 80.8, 5503457, 'Finland', 2015],
      [37599, 81.9, 64395345, 'France', 2015],
      [44053, 81.1, 80688545, 'Germany', 2015],
      [42182, 82.8, 329425, 'Iceland', 2015],
      [5903, 66.8, 1311050527, 'India', 2015],
      [36162, 83.5, 126573481, 'Japan', 2015],
      [1390, 71.4, 25155317, 'North Korea', 2015],
      [34644, 80.7, 50293439, 'South Korea', 2015],
      [34186, 80.6, 4528526, 'New Zealand', 2015],
      [64304, 81.6, 5210967, 'Norway', 2015],
      [24787, 77.3, 38611794, 'Poland', 2015],
      [23038, 73.13, 143456918, 'Russia', 2015],
      [19360, 76.5, 78665830, 'Turkey', 2015],
      [38225, 81.4, 64715810, 'United Kingdom', 2015],
      [53354, 79.1, 321773631, 'United States', 2015],
    ],
  ]

  export default {
    name: 'DashboardAdmin',
    components: {
      LineChart,
      Circularchart,
    },
    data() {
      return {
        lineChartData: lineChartData.newVisitis,
        scatterChartData: scatterChartData,
      }
    },
    methods: {
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      daydata() {},
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      padding: 16px 16px 0;
      margin-bottom: 32px;
      background: #fff;
    }
  }
</style>
