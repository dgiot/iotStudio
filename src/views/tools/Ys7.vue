<template>
  <div class="player-container">
    <el-row :gutter="24">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card class="player_card" shadow="hover">
          <div id="video-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Ys7',
    data() {
      return {}
    },
    computed: {},
    created() {},
    mounted() {
      this.initYs7()
    },
    methods: {
      initYs7() {
        axios
          .get('https://hotel.coboriel.com/api_screen')
          .then((res) => {
            const { data } = res
            console.log(data)

            // // https://hotel.coboriel.com/api_screen
            if (data.data.data.accessToken && data.data.data.look_url) {
              this.$message(`初始化${data.data.data.village_name}`)
              this.init(data.data.data.look_url[0], data.data.data.accessToken)
            }
          })
          .catch((e) => {
            console.log('e', e)
          })
      },
      init(url, accessToken) {
        player = new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id: 'video-container',
          accessToken: accessToken,
          url: url, // 这里的url可以是直播地址.live  ，也可以是回放地址.rec 或 .cloud.rec
          template: 'simple', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          //header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
          //plugin: ['talk'],                       // 加载插件，talk-对讲
          // 视频下方底部控件
          // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
          // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          // openSoundCallBack: data => console.log("开启声音回调", data),
          // closeSoundCallBack: data => console.log("关闭声音回调", data),
          // startSaveCallBack: data => console.log("开始录像回调", data),
          // stopSaveCallBack: data => console.log("录像回调", data),
          // capturePictureCallBack: data => console.log("截图成功回调", data),
          // fullScreenCallBack: data => console.log("全屏回调", data),
          // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
          width: 600, //如果指定了width、height则以这里为准
          height: 400, //如果没指定宽高，则以容器video-container为准
        })
        setTimeout(() => {
          console.log(player)
          player.play()
        }, 2000)
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.player';
  #{$base}-container {
    padding: 0 !important;
    margin-top: 20px;
    background: $base-color-background !important;
    .player_card {
      width: 100%;
      height: 100%;
    }
  }
</style>
