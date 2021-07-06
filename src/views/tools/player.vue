<template>
  <div class="player-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-input
          v-model="flvsrc"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-video-play"
            @click="vabPlayerMp4(flvsrc)"
          />
        </el-input>
        <el-card shadow="hover">
          <template #header>flv视频播放</template>
          <vue-flv-player
            ref="myPlayer"
            :autoplay="mp4Play"
            :controls="true"
            :muted="true"
            :source="flvsrc"
            type="hls"
          />
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-input
          v-model="mp4src"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-video-play"
            @click="vabPlayerFlv(mp4src)"
          />
        </el-input>
        <el-card shadow="hover">
          <template #header>Hls推流、m3u8播放</template>
          <vue-flv-player
            controls
            :autoplay="flvPlay"
            :muted="true"
            :source="mp4src"
            type="mp4"
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
        flvPlay: false,
        mp4Play: false,
        flvsrc: 'http://resource.wangdaodao.com/test.flv',
        mp4src: 'http://vjs.zencdn.net/v/oceans.mp4',
      }
    },
    created() {},
    methods: {
      // https://github.com/wangdaodao/vue-flv-player/blob/main/README-zh.md
      // https://github.com/bilibili/flv.js/blob/master/docs/api.md
      vabPlayerFlv(url) {
        this.flvPlay = true
        console.log(url, this.$refs['vabPlayerHls'])
      },
      vabPlayerMp4(url) {
        this.mp4Play = true
        console.log(url, this.$refs['vabPlayerMp4'])
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.player';
  #{$base}-container {
    margin-top: 20px;
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
