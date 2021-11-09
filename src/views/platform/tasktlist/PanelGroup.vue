<template>
  <el-row
    class="panel-group"
    :gutter="40"
  >
    <el-col
      class="card-panel-col"
      :lg="5"
      :sm="8"
      :xs="8"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('newVisitis')"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
            class-name="card-panel-icon"
            icon-class="shnehe"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            审核总数量
          </div>
          <count-to
            class="card-panel-num"
            :duration="2600"
            :end-val="102400"
            :start-val="0"
          />
        </div>
      </div>
    </el-col>
    <el-col
      class="card-panel-col"
      :lg="5"
      :sm="8"
      :xs="8"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('messages')"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon
            class-name="card-panel-icon"
            icon-class="message"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已审核数量
          </div>
          <count-to
            class="card-panel-num"
            :duration="3000"
            :end-val="81212"
            :start-val="0"
          />
        </div>
      </div>
    </el-col>
    <el-col
      class="card-panel-col"
      :lg="5"
      :sm="8"
      :xs="8"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('purchases')"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon
            class-name="card-panel-icon"
            icon-class="money"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            审核通过数量
          </div>
          <count-to
            class="card-panel-num"
            :duration="3200"
            :end-val="9280"
            :start-val="0"
          />
        </div>
      </div>
    </el-col>
    <el-col
      class="card-panel-col"
      :lg="5"
      :sm="8"
      :xs="8"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('shoppings')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon
            class-name="card-panel-icon"
            icon-class="shopping"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            审核未通过数量
          </div>
          <count-to
            class="card-panel-num"
            :duration="3600"
            :end-val="13600"
            :start-val="0"
          />
        </div>
      </div>
    </el-col>
    <el-col
      class="card-panel-col"
      :lg="5"
      :sm="8"
      :xs="8"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('shoppings')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon
            class-name="card-panel-icon"
            icon-class="shopping"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            待审核数量
          </div>
          <count-to
            class="card-panel-num"
            :duration="3600"
            :end-val="13600"
            :start-val="0"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      position: relative;
      height: 80px;
      overflow: hidden;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      background: #fff;
      border-color: rgba(0, 0, 0, 0.05);
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3;
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3;
      }
      .card-panel-icon-wrapper {
        float: left;
        padding: 16px;
        margin: 14px 0 0 14px;
        border-radius: 6px;
        transition: all 0.38s ease-out;
      }
      .card-panel-icon {
        float: left;
        font-size: 24px;
      }
      .card-panel-description {
        float: right;
        margin: 13px;
        margin-left: 0px;
        font-weight: bold;
        .card-panel-text {
          margin-bottom: 12px;
          font-size: 16px;
          line-height: 18px;
          color: rgba(0, 0, 0, 1);
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
    ::v-deep .el-col-lg-5 {
      width: 20%;
    }
    @media only screen and (max-width: 1300px) {
      .el-col-lg-5 {
        width: 50%;
      }
    }
  }
</style>
