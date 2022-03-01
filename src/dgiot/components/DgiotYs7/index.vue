<template>
  <div class="ys7-container"></div>
</template>

<script>
  export default {
    name: 'DgiotYs7',
    props: {
      url: {
        required: true,
        type: String,
        default: 'ezopen://open.ys7.com/E19478865/1.live',
      },
      accessToken: {
        required: true,
        type: String,
        default:
          'at.b6wtb3mkaty1kgf94qv2etrt5k47piaj-8s1zenpnpq-1kv8g2v-biq7dcgr2',
      },
      width: {
        required: false,
        type: Number,
        default: 800,
      },
      height: {
        required: false,
        type: Number,
        default: 800,
      },
    },
    data() {
      return {
        player: {},
      }
    },
    created() {},
    mounted() {
      this.initYs7()
    },

    methods: {
      initYs7() {
        this.init(this.url, this.accessToken)
      },
      init(url, accessToken) {
        this.player = new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id: 'ys7-container',
          accessToken: accessToken,
          url: url, // 这里的url可以是直播地址.live  ，也可以是回放地址.rec 或 .cloud.rec
          template: 'simple', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          header: ['capturePicture', 'save', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
          plugin: ['talk'], // 加载插件，talk-对讲
          // 视频下方底部控件
          footer: ['talk', 'broadcast', 'hd', 'fullScreen'], // 如果template参数不为simple,该字段将被覆盖
          audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          openSoundCallBack: (data) => dgiotlog.log('开启声音回调', data),
          closeSoundCallBack: (data) => dgiotlog.log('关闭声音回调', data),
          startSaveCallBack: (data) => dgiotlog.log('开始录像回调', data),
          stopSaveCallBack: (data) => dgiotlog.log('录像回调', data),
          capturePictureCallBack: (data) => dgiotlog.log('截图成功回调', data),
          fullScreenCallBack: (data) => dgiotlog.log('全屏回调', data),
          getOSDTimeCallBack: (data) => dgiotlog.log('获取OSDTime回调', data),
          // width: this.width, //如果指定了width、height则以这里为准
          // height: this.height, //如果没指定宽高，则以容器video-container为准
        })
      },
      ys7player() {
        this.$message.success('播放')
        dgiotlog.log('ys7player')
        this.player.play()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .ys7-container {
    width: 100%;
    height: calc(100vh - 200px);
  }
</style>
