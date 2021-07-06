<template>
  <div ref="flvPlayer" class="player">
    <vue-flv-player
      v-if="type == 'mp4' || type == 'flv'"
      :width="width"
      :height="height"
      :autoplay="autoplay"
      :controls="controls"
      :muted="muted"
      :source="source"
      :type="type"
    />
    <hrm-player
      v-else-if="
        type == 'video/mp4' ||
        type == 'rtmp/flv' ||
        type == 'application/x-mpegURL'
      "
      ref="hrmPlayer"
      :width="width"
      :height="height"
      :autoplay="autoplay"
      :controls="controls"
      :muted="muted"
      :source="source"
      :type="type"
    />
    <span v-else>...</span>
  </div>
</template>

<script>
  export default {
    name: 'VabPlayer',
    props: {
      // https://github.com/wangdaodao/hrm-player#attributes
      /**
       * @param {*} source 视频地址
       */
      source: {
        required: true,
        type: String,
        default: '',
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
        type: Number,
        default: 800,
      },
      /**
       * @param {*} height 高度
       */
      height: {
        required: false,
        type: Number,
        default: 600,
      },
      /**
       * @param {*} type 流类型   video/mp4/rtmp/flv/application/x-mpegURL
       */
      type: {
        required: false,
        type: String,
        default: 'application/x-mpegURL',
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
      options: {
        required: false,
        type: Object,
        default: () => {},
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
      return {}
    },
    mounted() {},
    methods: {},
  }
</script>

<style scoped></style>
