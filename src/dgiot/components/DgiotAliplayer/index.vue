<template>
  <div ref="DgiotAliplayer" class="DgiotAliplayer">
    <template v-if="!isShowMultiple && show">
      <vue-aliplayer-v2
        ref="VueAliplayerV2"
        :options="options"
        :source="source"
      />
    </template>
    <div v-if="isShowMultiple && show" class="show-multiple">
      <template v-for="x in 5">
        <vue-aliplayer-v2
          :key="x"
          ref="VueAliplayerV2"
          class="multiple-player"
          :options="options"
          :source="source"
        />
      </template>
    </div>
    <p v-if="!show" class="remove-text">播放器已销毁!</p>
    <div v-if="!show" class="player-btns">
      <template v-if="!isShowMultiple && show">
        <span @click="play()">播放</span>
        <span @click="pause()">暂停</span>
        <span @click="replay()">重播</span>
        <span @click="getCurrentTime()">播放时刻</span>
        <span @click="getStatus()">获取播放器状态</span>
      </template>
      <span @click="show = !show">{{ show ? '销毁' : '重载' }}</span>
      <span @click="options.isLive = !options.isLive">
        {{ options.isLive ? '切换普通模式' : '切换直播模式' }}
      </span>
      <span @click="showMultiple()">
        {{ isShowMultiple ? '显示1个播放器' : '显示多个播放器' }}
      </span>
    </div>
    <!--    <div class="source-box">-->
    <!--      <span class="source-label">选择播放源(支持动态切换):</span>-->
    <!--      <select id="source" v-model="source" name="source">-->
    <!--        <option value="//player.alicdn.com/video/aliyunmedia.mp4">mp4</option>-->
    <!--        <option value="//yunqivedio.alicdn.com/user-upload/nXPDX8AASx.mp4">-->
    <!--          mp4-->
    <!--        </option>-->
    <!--        <option-->
    <!--          value="https://open.ys7.com/v3/openlive/C45644828_1_1.m3u8?expire=1661675042&id=353575811863003136&t=f5922b46144b0f7f93f8957afe40d42b1f46860bd35788160e34794b9667f34b&ev=100"-->
    <!--        >-->
    <!--          m3u8-->
    <!--        </option>-->
    <!--        <option value="//ivi.bupt.edu.cn/hls/cctv1.m3u8">m3u8</option>-->
    <!--      </select>-->
    <!--    </div>-->
    <!--    <div class="source-box">-->
    <!--      <span class="source-label">输入播放源(支持动态切换):</span>-->
    <!--      <input v-model="source" class="source-input" type="text" />-->
    <!--    </div>-->
  </div>
</template>

<script>
  /**
   * @document https://github.com/langyuxiansheng/vue-aliplayer-v2#31-%E9%85%8D%E7%BD%AE%E9%A1%B9-options-%E5%B1%9E%E6%80%A7
   */
  const VueAliplayerV2 = window['vue-aliplayer-v2'].default
  Vue.use(VueAliplayerV2, {
    cssLink:
      'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css',
    // scriptSrc: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js',
  })
  // dgiotlog.log('VueAliplayerV2', VueAliplayerV2)
  // import VueAliplayerV2 from 'vue-aliplayer-v2'
  export default {
    name: 'DgiotAliplayer',
    components: { VueAliplayerV2 },
    props: {
      // https://github.com/wangdaodao/hrm-player#attributes
      /**
       * @param {*} source 视频地址
       */
      playsource: {
        required: false,
        type: String,
        default: 'http://resource.wangdaodao.com/402670506.mp4',
      },
      /**
       * @param {*} autoplay 是否自动播放
       */
      autoplay: {
        required: false,
        type: Boolean,
        default: false,
      },
      /**
       * @param {*} width 宽度
       */
      width: {
        required: false,
        type: String,
        default: '100%',
      },
      /**
       * @param {*} height 高度
       */
      height: {
        required: false,
        type: String,
        default: '100%',
      },
      /**
       * @param {*} type 流类型   video/mp4/rtmp/flv/application/x-mpegURL
       */
      type: {
        required: false,
        type: String,
        default: 'flv',
      },
      /**
       * @param {*} fluid 播放器是否按比例缩放以适应其容器，为true时，height不起作用
       */
      fluid: {
        required: false,
        type: Boolean,
        default: false,
      },
      /**
       * @param {*} controls 是否显示控件
       */
      controls: {
        required: false,
        type: Boolean,
        default: true,
      },
      /**
       * @param {*} preload 预加载 auto/metadata/none
       */
      preload: {
        required: false,
        type: String,
        default: 'auto',
      },
      /**
       * @param {*} preload 高级设置会覆盖上面设置
       */
      playOptions: {
        required: false,
        type: Object,
        default: () => {
          return { isLive: true }
        },
      },
      // https://github.com/wangdaodao/vue-flv-player#attributes
      /**
       * @param {*} type poster 视频封面
       */
      poster: {
        required: false,
        type: String,
        default: '',
      },
      /**
       * @param {*} type muted 是否静音
       */
      muted: {
        required: false,
        type: Boolean,
        default: false,
      },
      /**
       * @param {*} mediaDataSource 高级媒体数据源设置
       */
      mediaDataSource: {
        required: false,
        type: Object,
        default: () => {},
      },
      /**
       * @param {*} config 高级设置会覆盖上面设置
       */
      config: {
        required: false,
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        // options: {
        //   // source:'//player.alicdn.com/video/aliyunmedia.mp4',
        //   isLive: true, //切换为直播流的时候必填
        //   // format: 'm3u8'  //切换为直播流的时候必填
        // },
        // source: '//player.alicdn.com/video/aliyunmedia.mp4',
        source: this.playsource,
        options: _.merge(this.playOptions, {
          width: this.width,
          height: this.height,
          format: this.type,
          isLive: true,
        }),
        show: true,
        isShowMultiple: false,
      }
    },
    mounted() {
      // this.source = this.playsource
      // this.options = _.merge(this.playOptions, {
      //   width: this.width,
      //   height: this.height,
      //   format: this.type,
      //   isLive: true,
      // })
      // this.$nextTick(() => {
      //   this.play()
      // })
    },
    methods: {
      play() {
        this.$refs.VueAliplayerV2.play()
      },

      pause() {
        this.$refs.VueAliplayerV2.pause()
      },

      replay() {
        this.$refs.VueAliplayerV2.replay()
      },

      getCurrentTime() {
        // this.$refs.VueAliplayerV2.getCurrentTime();
        // this.source = 'http://ivi.bupt.edu.cn/hls/cctv1.m3u8'
      },

      getStatus() {
        const status = this.$refs.VueAliplayerV2.getStatus()
        dgiotlog.log(`getStatus:`, status)
        alert(`getStatus:${status}`)
      },

      showMultiple() {
        this.isShowMultiple = !this.isShowMultiple
      },
    },
  }
</script>

<style lang="scss" scoped>
  * {
    padding: 0;
    margin: 0;
  }

  .remove-text {
    padding: 20px;
    font-size: 24px;
    text-align: center;
  }

  .show-multiple {
    display: flex;

    .multiple-player {
      width: calc(100% / 4);
      margin: 20px;
    }
  }

  .player-btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;

    span {
      display: inline-block;
      width: 150px;
      height: 40px;
      padding: 5px 10px;
      margin: 0 auto;
      margin: 5px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      background: #e1e1e1;
      border: 1px solid #eee;
      border-radius: 10px;
    }
  }

  .source-box {
    padding: 5px 10px;
    margin-bottom: 20px;

    .source-label {
      display: block;
      margin-right: 20px;
      font-size: 16px;
    }

    #source {
      margin-top: 10px;
    }

    .source-input {
      width: 80%;
      padding: 5px 10px;
      margin-top: 10px;
      border: 1px solid #ccc;
    }
  }
</style>
