<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="top-header">
        <div id="top-header">
          <dv-decoration-5 class="header-center-decoration" />
          <div class="center-title">二次供水监控平台</div>
        </div>
      </div>
      <div class="main-header">
        <!-- <div class="mh-left">技术支持:<a href="https://github.com/jiaming743/DataV">https://github.com/jiaming743/DataV</a></div> -->
        <div class="mh-middle"><dv-decoration-3 /></div>
        <!-- <div class="mh-right">车间MES动态</div> -->
      </div>

      <dv-border-box-1 class="main-container">
        <dv-border-box-8 class="left-chart-container">
          <!--          <div class="mh-middle">销售实时动态</div>-->
          <!-- <dv-decoration-2 style="width: 200px; height: 5px" /> -->
          <div
            v-infinite-scroll
            class="left-nowdata infinite-list-wrapper"
            style="overflow: auto"
          >
            <Left-Chart-2 />
            <Left-Chart-2 />
            <Left-Chart-2 />
            <Left-Chart-2 />
          </div>
          <Left-Chart-4 />
          <!-- <Left-Chart-1 /> -->
          <Left-Chart-3 />
        </dv-border-box-8>
        <!-- 中间内容 -->
        <div class="center-main-container">
          <dv-border-box-8 class="rmctc-chart-1">
            <div class="cmc_detail">
              <div class="detail_info">
                <div
                  v-for="(device, index) in deviceInfos"
                  :key="index"
                  class="info_item"
                >
                  {{ device.type }}:{{ device.value }}
                </div>
              </div>
              <div class="detail_img"></div>
            </div>
          </dv-border-box-8>

          <dv-border-box-8 class="rmctc-chart-3" :reverse="true">
            <!-- <div class="rmctc-chart-p"> -->
            <Center-Chart-1 :detail-info="lineDetails[0]" />
            <Center-Chart-1 :detail-info="lineDetails[1]" />
            <!-- </div> -->
          </dv-border-box-8>
        </div>

        <div class="right-chart-container">
          <div
            class="mh-right"
            style="
              text-align: center;
              position: absolute;
              top: -15px;
              left: 50%;
              transform: translateX(-50%);
            "
          >
            {{ gettime }}
          </div>

          <dv-border-box-8 class="rmctc-chart-1">
            <Right-Real-Update />
            <!-- <Right-Chart-1 /> -->
          </dv-border-box-8>

          <!-- <dv-border-box-3 class="rmctc-chart-2" :reverse="true">
            <Right-Chart-2 />
            <TopMiddleCmp />
          </dv-border-box-3> -->

          <dv-border-box-8 class="rmctc-chart-3" :reverse="true">
            <iframe
              allowfullscreen="true"
              border="0"
              frameborder="no"
              framespacing="0"
              scrolling="no"
              src="//player.bilibili.com/player.html?aid=761579635&bvid=BV1j64y147CP&cid=366040218&page=1"
              style="width: 100%; height: 500px; align: center; padding: 20px 0"
            ></iframe>
            <!-- <Right-Chart-4 /> -->
          </dv-border-box-8>
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
  import LeftChart1 from './LeftChart1'
  import LeftChart2 from './LeftChart2'
  import LeftChart3 from './LeftChart3'
  import LeftChart4 from './LeftChart4'

  import CenterCmp from './CenterCmp'
  import CenterChart1 from './CenterChart1'

  import RightChart1 from './RightChart1'
  import RightChart2 from './RightChart2'
  import RightChart3 from './RightChart3'
  import RightChart4 from './RightChart4'
  import RightRealUpdate from './RightRealUpdate'

  import BottomCharts from './BottomCharts'

  export default {
    name: 'DataView',
    components: {
      LeftChart1,
      LeftChart2,
      LeftChart3,
      LeftChart4,
      CenterCmp,
      CenterChart1,
      RightChart1,
      RightChart2,
      BottomCharts,
      RightChart3,
      RightChart4,
      RightRealUpdate,
    },
    data() {
      return {
        gettime: '',
        timer: '',
        deviceInfos: [
          {
            type: '出厂编号',
            value: 'LF2022118',
          },
          {
            type: '设备型号',
            value: 'LF-8563',
          },
          {
            type: '客户名称',
            value: 'XXXX有限公司',
          },
          {
            type: '生产日期',
            value: '2020年10月5号',
          },
          {
            type: '设备功率',
            value: '7.5kw',
          },
          {
            type: '安装位置',
            value: '台州市临海市东方大道105号',
          },
        ],
        lineDetails: [
          {
            lineColor: '#359ddd',
            yData: [0, 0, 0, 40, 30, 35, 26, 34],
            yName: '变频器频率',
            xData: [
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '23:00',
              '23:20',
              '23:50',
              '01:50',
            ],
          },
          {
            lineColor: '#8c0a8d',
            yData: [1.1, 1.0, 0.8, 0.9, 1.3, 1.1, 1.4, 1.2],
            yName: '出口压力',
            xData: [
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '23:00',
              '23:20',
              '23:50',
              '01:50',
            ],
          },
        ],
      }
    },
    mounted() {
      this.timer = setInterval(this.getCurrentTime, 1000)
    },
    beforeDestroy() {
      if (this.timer) {
        console.log('111111111')
        clearInterval(this.timer)
      }
    },
    methods: {
      getCurrentTime() {
        //获取当前时间并打印
        var _this = this
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1
        let dd = new Date().getDate()
        let hh = new Date().getHours()
        let mf =
          new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes()
        let ss =
          new Date().getSeconds() < 10
            ? '0' + new Date().getSeconds()
            : new Date().getSeconds()
        _this.gettime =
          yy + '/' + mm + '/' + dd + ' ' + hh + ':' + mf + ':' + ss
      },
    },
  }
</script>

<style lang="scss" scoped>
  #data-view {
    width: 100%;
    height: 100%;
    background-color: #030409;
    color: #fff;
    margin: 0;
    #dv-full-screen-container {
      background-image: url('./img/bg.png');
      background-size: 100% 100%;
      box-shadow: 0 0 3px blue;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .main-header {
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .mh-left {
        font-size: 16px;
        color: rgb(1, 134, 187);

        a:visited {
          color: rgb(1, 134, 187);
        }
      }

      .mh-middle {
        padding-left: 20px;
        font-size: 25px;
      }
      .mh-right {
        position: absolute;
        // padding-left: 20px;
        font-size: 25px;
      }
      .mh-right {
        width: 550px;
      }
      .mh-left {
        width: 450px;
      }
    }

    .main-container {
      height: calc(100vh - 100px);

      .border-box-content {
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        // flex-wrap: wrap;
      }
    }

    .left-chart-container {
      width: 25%;
      height: 100%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .left-nowdata {
        display: flex;
        flex-wrap: wrap;
        height: 35%;
      }
      .border-box-content {
        flex-direction: column;
      }
    }

    .center-main-container {
      width: 50%;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .cmc_detail {
        display: flex;
        flex-direction: column;
        .detail_info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .info_item {
            width: 33%;
            padding: 4px 0;
            font-size: 10px;
            color: #fff;
          }
        }
        .detail_img {
          background-image: url('./img/example.png');
          background-size: 100% 100%;
          width: 100%;
          height: 100%;
        }
      }
      .rmctc-chart-3 {
        display: flex;
        flex-direction: column;
        .border-box-content {
          flex-wrap: wrap;
        }
      }
    }

    .right-chart-container {
      position: relative;
      width: 30%;
      padding-right: 5px;
      box-sizing: border-box;
      .border-box-content {
        flex-direction: column;
      }
    }

    .rmc-top-container {
      height: 65%;
      display: flex;
    }

    .rmctc-left-container {
      width: 65%;
    }

    .rmctc-right-container {
      width: 28%;
      padding-right: 5px;
      box-sizing: border-box;

      display: flex;
      .border-box-content {
        flex-direction: column;
      }
    }

    .rmc-bottom-container {
      height: 35%;
    }

    .rmctc-chart-1,
    .rmctc-chart-2 {
      height: 45%;
    }
    .rmctc-chart-3 {
      height: 50%;
      margin-top: 4%;
    }

    .top-header {
      position: absolute;
      width: 100%;
      height: 20%;
    }
    #top-header {
      position: relative;
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      flex-shrink: 0;

      .header-center-decoration {
        width: 40%;
        height: 60px;
        margin-top: 30px;
      }

      .center-title {
        position: absolute;
        font-size: 30px;
        font-weight: bold;
        left: 50%;
        top: 15px;
        transform: translateX(-50%);
      }
    }
  }
</style>
