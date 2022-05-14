<!--eslint-disable-->
<template>
  <div class="editdevices">
    <div>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane
          :label="$translateTitle('equipment.deviceinformation')"
          name="first"
        >
          <info :devicedetail="deviceInfo" />
          <el-card>
            <dgiot-baidu-map
              ref="map"
              :bmLabel="bmLabel"
              :label="mapLabel"
              :navShow="true"
              :scaleShow="true"
              :mapCenter="mapLabel.position"
            />
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          :label="$translateTitle('equipment.realTime data')"
          name="first1"
        >
          <running-state :loading="loading" :thirdtbKey="thirdtbKey" :machinelist="machinelist"/>
        </el-tab-pane>
        <!-- 历史数据 -->
        <el-tab-pane
          :label="$translateTitle('equipment.historical data')"
          name="third"
        >
          <div
            v-loading="loading"
            style="box-sizing: border-box; padding: 10px; background: #ffffff"
          >
            <!-- <h4>设备信息</h4> -->
            <div class="chartsinfo">
              <div
                :style="{ height: Device == 'desktop' ? '50px' : '240px' }"
                class="queryHeader"
              >
                <dgiot-query-form-top-panel>
                  <el-form
                    :inline="true"
                    :label-width="Device == 'desktop' ? '80px' : '70px'"
                    :model="queryForm"
                    @submit.native.prevent
                  >
                    <el-form-item
                      :label="$translateTitle('developer.startTime')"
                    >
                      <el-date-picker
                        v-model="params.startTime"
                        :picker-options="pickerOptionsDay"
                        :placeholder="$translateTitle('developer.startTime')"
                        align="right"
                        size="mini"
                        style="width: 83%"
                        type="datetime"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.EndTime')">
                      <el-date-picker
                        v-model="params.endTime"
                        :clearable="false"
                        :picker-options="pickerOptionsDay"
                        :placeholder="$translateTitle('developer.EndTime')"
                        align="right"
                        size="mini"
                        style="width: 83%"
                        type="datetime"
                      />
                    </el-form-item>
                    <el-form-item :label="$translateTitle('developer.type')">
                      <el-select
                        v-model="params.style"
                        placeholder="请选择"
                        size="mini"
                        style="width: 90px"
                        @change="toggleChart"
                      >
                        <el-option
                          v-for="(item, index) in chartType"
                          :key="index"
                          :disabled="disabledChart.indexOf(item.type) != -1"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      :label="$translateTitle('developer.interval')"
                    >
                      <el-input-number
                        v-model="params.number"
                        :min="1"
                        placeholder="请输入内容"
                        size="mini"
                        style="width: 100px"
                      />
                      <el-select
                        v-model="params.interval"
                        placeholder="请选择"
                        size="mini"
                        style="width: 70px"
                      >
                        <el-option
                          v-for="(item, index) in interval"
                          :key="index"
                          :label="item.name"
                          :value="item.type"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      :label="$translateTitle('developer.function')"
                    >
                      <el-select
                        v-model="params._function"
                        placeholder="请选择"
                        size="mini"
                        style="width: 100px"
                      >
                        <el-option
                          v-for="(item, index) in functionarr"
                          :key="index"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                      <el-button
                        :disabled="queryFlag"
                        icon="el-icon-search"
                        size="mini"
                        type="primary"
                        @click="queryChart"
                      >
                        {{ $translateTitle('developer.search') }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </dgiot-query-form-top-panel>
              </div>
              <div :key="chartKey" class="chartsmain">
                <dgiotChart
                  ref="charts"
                  :after-config="afterConfig"
                  :data="chartData"
                  :data-empty="dataEmpty"
                  :data-zoom="chartDataZoom"
                  :extend="chartExtend"
                  :set-option-opts="false"
                  :settings="chartSettings"
                  :toolbox="toolbox"
                  :type="params.style"
                />
              </div>
              <div class="chartOther">
                <el-row :gutter="20">
                  <el-col
                    v-for="(item, index) in chartData.child"
                    v-show="item.columns[1] != '日期'"
                    :key="index"
                    :md="md"
                    :sm="sm"
                    :xl="xl"
                    :xs="xs"
                  >
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>{{ item.columns[1] }} : {{ item.unit }}</span>

                        <el-button-group
                          style="float: right; padding: 3px 0"
                          type="text"
                        >
                          <el-button icon="el-icon-warning-outline" />
                          <el-button
                            icon="el-icon-full-screen"
                            @click="toggleCardRow(index, xs, sm, md, xl)"
                          />
                        </el-button-group>
                      </div>

                      <dgiotChart
                        ref="charts"
                        :after-config="afterConfig"
                        :data="chartData.child[index]"
                        :data-empty="dataEmpty"
                        :data-zoom="chartDataZoom"
                        :extend="chartExtend"
                        :legend-visible="false"
                        :set-option-opts="false"
                        :settings="chartSettings"
                        :toolbox="toolbox"
                        :type="params.style"
                        height="300px"
                      />
                    </el-card>
                  </el-col>
                  <el-col v-show="!chartData.child" :span="24">
                    <dgiot-empty />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <!-- <div class="jiange" style="width:100%;height:20px;background:#f4f4f4">
          </div>-->
          <div
            class="twofirsttable"
            style="
              box-sizing: border-box;
              padding: 10px;
              margin-top: 20px;
              background: #ffffff;
            "
          ></div>
        </el-tab-pane>

        <!--         <el-tab-pane label="事件管理" name="fixth">事件管理</el-tab-pane>
                <el-tab-pane label="服务调用" name="sixth">服务调用</el-tab-pane>
                <el-tab-pane label="设备影子" name="seventh">设备影子</el-tab-pane>
        <el-tab-pane label="日志服务" name="eighth">日志服务</el-tab-pane>-->
        <!--        <el-tab-pane :label="$translateTitle('route.在线调试')" name="ninth" />-->
      </el-tabs>
    </div>
  </div>
</template>
<!--eslint-disable-->
<script src="./js/devicesDetailLite.js"></script>
<style lang="scss" scoped>
  ::v-deep {
    .el-tabs__header {
      margin: 0;
    }

    .el-icon-time {
      display: none;
    }

    .el-date-editor--datetime {
      input {
        padding: 0 10px;
      }
    }

    .el-card {
      overflow: hidden;
      color: #303133;
      background-color: #f4f4f4 !important;
      border: 0px solid #ebeef5;
      border-radius: 0px;
      transition: 0.3s;
    }
  }

  .chartsinfo {
    margin-top: 15px;

    .chartsmain {
      margin: 30px 0;
    }
  }

  .editdevices {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 20px;
  }

  .editdevices .OFFLINE {
    color: red;
  }

  .editdevices .ACTIVE,
  .editdevices .ONLINE {
    color: green;
  }

  .mailtable .cloumn {
    font-weight: bold;
    color: #74777a;
    text-align: left;
    background: #fafafc;
    border-right: 1px solid #ebecec;
    border-bottom: 1px solid #ebecec;
  }

  .thirdtb {
    //width: 100vh;
    height: 76vh;
    background: #f4f4f4;
  }

  .editdevices .updatedtable {
    box-sizing: border-box;
    width: 280px;
    height: 180px;
    /* letter-spacing: 1px; */
    padding-left: 20px;
    margin: 20px 20px 0 0;
    font-size: 50px;
    line-height: 40px;
    list-style: none;
    border: 1px solid #c0c4cc;
    /* text-align: center; */
    border-radius: 5px;
    box-shadow: 10px 10px 10px 5px #f4f4f4;
  }

  .editdevices .buttonactive {
    color: white;
    background-color: #409eff;
  }

  .mailtable td {
    box-sizing: border-box;
    padding: 12px;
    font-size: 14px;
    color: #74777a;
    text-align: left;
    border: 1px solid #ebecec;
  }

  .childrendevices {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    padding: 10px;
    background: white;
  }
</style>
<style lang="scss">
  @media screen and(max-width: 600px) {
    .editdevices {
      .el-tabs__item {
        height: 50px;
        margin: 0;
        margin-top: 5px;
        font-family: auto;
        font-size: 12px;
        line-height: 50px;
      }
    }

    .el-tabs {
      width: 560px;
      font-size: 12px;
    }
    .mailtable {
      tr {
        .cloumn {
          font-size: 12px;
        }
      }

      td {
        width: 70px;
        padding: 1px;
        font-size: 10px;
      }
    }
  }

  @media screen and(min-width: 601px) {
    .editdevices .el-tabs__item {
      height: 50px;
      margin: 0;
      margin-top: 20px;
      font-family: auto;
      font-size: 16px;
      line-height: 50px;
    }
  }

  .editdevices .el-tabs__content {
    box-sizing: border-box;
    padding: 20px;
    background: #f4f4f4;
  }

  .editdevices .childrendevices .el-form-item:last-child {
    float: right;
  }

  .editdevices .childdialog .el-form-item__content {
    clear: both;
  }

  .editdevices .childdialog .el-form-item__content .el-select {
    width: 100%;
  }

  .fontSize {
    font-size: 12px;
    color: #666666;
  }

  .editdevices .svg-icon {
    width: 3rem;
    height: 3rem;
    margin-top: 5px;
  }

  .stla {
    overflow: hidden;
    font-family: fantasy;
    font-size: 25px;
    color: #666666;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ht7 {
    height: 70px;
  }
</style>
