<template>
  <div class="asian">
    <div class="main-container">
      <dv-border-box-13 class="main-container-left">
        设备状态
        <dv-scroll-board
          :config="boardconfig"
          style="width: calc(100% - 0); height: 30%"
        />
        告警数据
        <dv-scroll-ranking-board
          :config="rankingconfig"
          style="width: calc(100% - 0); height: 40%"
        />
        监控数据
        <dv-capsule-chart
          :config="capsuleconfig"
          style="width: calc(100% - 0); height: 30%"
        />
      </dv-border-box-13>

      <dv-border-box-13 class="main-container-center">
        <dv-flyline-chart
          :config="chartconfig"
          style="width: 100%; height: 100%"
        />
      </dv-border-box-13>

      <dv-border-box-13 class="main-container-right">
        人流数据
        <dv-charts :option="options" />
      </dv-border-box-13>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Asian',
    props: {
      description: {
        required: false,
        type: String,
        default: '暂无数据',
      },
      width: {
        required: false,
        type: String,
        default: '100',
      },
      height: {
        required: false,
        type: String,
        default: '100',
      },
      image: {
        required: false,
        type: String,
        default: '',
      },
      imageStyle: {
        required: false,
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        capsuleconfig: {
          data: [
            {
              name: '南阳',
              value: 167,
            },
            {
              name: '周口',
              value: 123,
            },
            {
              name: '漯河',
              value: 98,
            },
            {
              name: '郑州',
              value: 75,
            },
            {
              name: '西峡',
              value: 66,
            },
          ],
          colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
          unit: '单位',
          showValue: true,
        },
        rankingconfig: {
          data: [
            {
              name: '周口',
              value: 55,
            },
            {
              name: '南阳',
              value: 120,
            },
            {
              name: '西峡',
              value: 78,
            },
            {
              name: '驻马店',
              value: 66,
            },
            {
              name: '新乡',
              value: 80,
            },
            {
              name: '信阳',
              value: 45,
            },
            {
              name: '漯河',
              value: 29,
            },
          ],
        },
        boardconfig: {
          header: ['列1', '列2', '列3'],
          data: [
            ['行1列1', '行1列2', '行1列3'],
            ['行2列1', '行2列2', '行2列3'],
            ['行3列1', '行3列2', '行3列3'],
            ['行4列1', '行4列2', '行4列3'],
            ['行5列1', '行5列2', '行5列3'],
            ['行6列1', '行6列2', '行6列3'],
            ['行7列1', '行7列2', '行7列3'],
            ['行8列1', '行8列2', '行8列3'],
            ['行9列1', '行9列2', '行9列3'],
            ['行10列1', '行10列2', '行10列3'],
            ['行1列1', '行1列2', '行1列3'],
            ['行2列1', '行2列2', '行2列3'],
            ['行3列1', '行3列2', '行3列3'],
            ['行4列1', '行4列2', '行4列3'],
            ['行5列1', '行5列2', '行5列3'],
            ['行6列1', '行6列2', '行6列3'],
            ['行7列1', '行7列2', '行7列3'],
            ['行8列1', '行8列2', '行8列3'],
            ['行9列1', '行9列2', '行9列3'],
            ['行10列1', '行10列2', '行10列3'],
            ['行1列1', '行1列2', '行1列3'],
            ['行2列1', '行2列2', '行2列3'],
            ['行3列1', '行3列2', '行3列3'],
            ['行4列1', '行4列2', '行4列3'],
            ['行5列1', '行5列2', '行5列3'],
            ['行6列1', '行6列2', '行6列3'],
            ['行7列1', '行7列2', '行7列3'],
            ['行8列1', '行8列2', '行8列3'],
            ['行9列1', '行9列2', '行9列3'],
            ['行10列1', '行10列2', '行10列3'],
          ],
          index: true,
          columnWidth: [50],
          align: ['center'],
        },
        chartconfig: {
          centerPoint: [0.48, 0.35],
          points: [
            {
              position: [0.52, 0.235],
              text: '新乡',
            },
            {
              position: [0.43, 0.29],
              text: '焦作',
            },
            {
              position: [0.59, 0.35],
              text: '开封',
            },
            {
              position: [0.53, 0.47],
              text: '许昌',
            },
            {
              position: [0.45, 0.54],
              text: '平顶山',
            },
            {
              position: [0.36, 0.38],
              text: '洛阳',
            },
            {
              position: [0.62, 0.55],
              text: '周口',
            },
            {
              position: [0.56, 0.56],
              text: '漯河',
            },
            {
              position: [0.37, 0.66],
              text: '南阳',
            },
            {
              position: [0.55, 0.81],
              text: '信阳',
            },
            {
              position: [0.55, 0.67],
              text: '驻马店',
            },
            {
              position: [0.37, 0.29],
              text: '济源',
            },
            {
              position: [0.2, 0.36],
              text: '三门峡',
            },
            {
              position: [0.76, 0.41],
              text: '商丘',
            },
            {
              position: [0.59, 0.18],
              text: '鹤壁',
            },
            {
              position: [0.68, 0.17],
              text: '濮阳',
            },
            {
              position: [0.59, 0.1],
              text: '安阳',
            },
          ],
          k: 0.5,
          // bgImgUrl: 'http://datav.jiaminghi.com/img/flylineChart/map.jpg',
          centerPointImg: {
            url: 'http://datav.jiaminghi.com/img/flylineChart/mapCenterPoint.png',
          },
          pointsImg: {
            url: 'http://datav.jiaminghi.com/img/flylineChart/mapPoint.png',
          },
        },
        options: {
          title: {
            text: '设备',
            style: {
              fill: '#fff',
            },
          },
          series: [
            {
              type: 'gauge',
              data: [{ name: 'itemA', value: 55 }],
              center: ['50%', '55%'],
              axisLabel: {
                formatter: '{value}%',
                style: {
                  fill: '#fff',
                },
              },
              axisTick: {
                style: {
                  stroke: '#fff',
                },
              },
              animationCurve: 'easeInOutBack',
            },
          ],
        },
        config: {
          data: [
            {
              name: '产品系列1',
              value: 167,
            },
            {
              name: '产品系列2',
              value: 67,
            },
            {
              name: '产品3',
              value: 123,
            },
            {
              name: '产品4',
              value: 55,
            },
            {
              name: '其他',
              value: 98,
            },
          ],
          colors: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          unit: '件',
        },
      }
    },
    computed: {
      ...mapGetters({
        objectId: 'user/objectId',
      }),
    },
    created() {
      this.setTreeFlag(false)
    },
    mounted() {
      this.setTreeFlag(false)
    },
    methods: {
      ...mapMutations({
        setTreeFlag: 'settings/setTreeFlag',
      }),
    },
  }
</script>

<style scoped lang="scss">
  .asian {
    width: 100%;
    height: 100%;
    margin: 0 0px;
    .main-container {
      background-image: url('../../../public/assets/images/Asian/5138162066c98d21b4467e3ad7bbb04.jpg');
      background-repeat: repeat;
      background-size: 100% 100%;
      display: flex;
      background-color: skyblue;
      opacity: 0.9;
      height: 100%;
      &-left,
      &-right {
        flex: 1;
      }
      &-center {
        flex: 3;
      }
    }
  }
</style>
