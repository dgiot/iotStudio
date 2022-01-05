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
        <dv-border-box-7 class="left-chart-container">
          <!--          <div class="mh-middle">销售实时动态</div>-->
          <dv-decoration-2 style="width: 200px; height: 5px" />
          <Left-Chart-2 />
          <Left-Chart-1 />
          <Left-Chart-3 />
        </dv-border-box-7>

        <div class="center-main-container">
          <dv-border-box-7>
            <!-- <Center-Cmp /> -->
          </dv-border-box-7>
        </div>

        <div class="right-chart-container">
          <div class="mh-right">车间MES动态</div>
          <dv-border-box-3 class="rmctc-chart-1">
            <Right-Chart-1 />
          </dv-border-box-3>

          <dv-border-box-3 class="rmctc-chart-2" :reverse="true">
            <Right-Chart-2 />
            <!-- <TopMiddleCmp /> -->
          </dv-border-box-3>

          <dv-border-box-3 class="rmctc-chart-3" :reverse="true">
            <Right-Chart-3 />
            <Right-Chart-4 />
          </dv-border-box-3>
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
  import LeftChart1 from './LeftChart1'
  import LeftChart2 from './LeftChart2'
  import LeftChart3 from './LeftChart3'

  import CenterCmp from './CenterCmp'

  import RightChart1 from './RightChart1'
  import RightChart2 from './RightChart2'
  import RightChart3 from './RightChart3'
  import RightChart4 from './RightChart4'

  import BottomCharts from './BottomCharts'

  export default {
    name: 'DataView',
    components: {
      LeftChart1,
      LeftChart2,
      LeftChart3,
      CenterCmp,
      RightChart1,
      RightChart2,
      BottomCharts,
      RightChart3,
      RightChart4,
    },
    data() {
      return {}
    },
  }
</script>

<style lang="scss">
  #data-view {
    width: 100%;
    height: 100%;
    background-color: #030409;
    color: #fff;
    #dv-full-screen-container {
      background-image: url('./img/bg.png');
      background-size: 100% 100%;
      box-shadow: 0 0 3px blue;
      display: flex;
      flex-direction: column;
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
        padding-left: 20px;
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
      height: calc(~'100% - 80px');

      .border-box-content {
        padding: 20px;
        box-sizing: border-box;
        display: flex;
      }
    }

    .left-chart-container {
      width: 22%;
      padding-left: 10px;
      box-sizing: border-box;

      .border-box-content {
        flex-direction: column;
      }
    }

    .center-main-container {
      width: 50%;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
    }

    .right-chart-container {
      width: 28%;
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
      height: 30%;
    }
    .rmctc-chart-3 {
      height: 40%;
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
