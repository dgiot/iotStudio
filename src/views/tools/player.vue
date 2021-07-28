<template>
  <div class="player-container">
    <el-row :gutter="24">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-row v-show="!$route.query.url" :gutter="24">
          <el-col :span="23">
            <el-input
              v-model="flvsrc"
              :disabled="$route.query.url"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-select
                slot="append"
                v-model="type"
                :disabled="$route.query.type"
                style="width: 200px"
                placeholder="请选择視頻流格式"
                @change="changeType"
              >
                <el-option
                  v-for="item in videoType"
                  :key="item.type"
                  :label="item.type"
                  :value="item.type"
                />
              </el-select>
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" plain @click="Play()">播放</el-button>
          </el-col>
        </el-row>
        <el-card shadow="hover" class="player_card">
          <vab-player
            ref="vabPlayer"
            :autoplay="mp4Play"
            :source="flvsrc"
            :type="type"
            :width="width"
            :height="height"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    data() {
      return {
        height: this.$baseTableHeight(0),
        type: this.$route.query ? this.$route.query.type : 'mp4',
        width: 1600,
        flvsrc: this.$route.query
          ? this.$route.query.url
          : 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        mp4Play: false,
        videoType: [
          {
            type: 'mp4',
            url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
          },
          {
            type: 'flv',
            url: 'https://rtmp01open.ys7.com:9188/v3/openlive/C45644828_1_2.flv?expire=1656812988&id=333182878081585152&t=9d9c1b3187ff62633be8573281bff2ae7318ae200908c388bb6c092f54f29c52&ev=100',
          },
          // {
          //   type: 'video/mp4',
          //   url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
          // },
          // { type: 'rtmp/flv', url: 'rtmp://58.200.131.2:1935/livetv/btv4' },
          // {
          //   type: 'application/x-mpegURL',
          //   url: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8',
          // },
        ],
      }
    },
    computed: {},
    mounted() {
      if (this.$route.query.type && this.$route.query.url) {
        setTimeout(() => {
          this.mp4Play = true
        }, 1500)
      }
    },
    methods: {
      // https://github.com/wangdaodao/vue-flv-player/blob/main/README-zh.md
      // https://github.com/bilibili/flv.js/blob/master/docs/api.md
      changeType(e) {
        // this.mp4Play = false
        let res = this.videoType.filter((i) => {
          if (i.type == e) return i
        })
        // this.width = Number(
        //   document.getElementsByTagName('section')[0].offsetWidth
        // )
        console.log(e, res[0].url)
        this.flvsrc = res[0].url
        // setTimeout(() => {
        //   this.mp4Play = true
        // }, 1500)
      },
      Play() {
        this.$refs.vabPlayer.createVideo()
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
