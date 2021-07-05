<template>
  <div v-if="show" class="player-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-input
          v-model="mp4Config.url"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-video-play"
            @click="vabPlayerMp4(mp4Config.url)"
          />
        </el-input>
        <el-card shadow="hover">
          <template #header>常规视频播放(可配置弹幕)</template>
          <vab-player-mp4
            :config="mp4Config"
            @player="$vabPlayerMp4 = $event"
          />
          <el-form :inline="true" :model="form" style="margin-top: 20px">
            <el-form-item label="弹幕">
              <el-input v-model="form.danmu" placeholder="弹幕" />
            </el-form-item>
            <el-form-item>
              <el-button @click="onSubmit">发射弹幕</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-input
          v-model="hlsConfig.url"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-video-play"
            @click="vabPlayerHls(hlsConfig.url)"
          />
        </el-input>
        <el-card shadow="hover">
          <template #header>Hls推流、m3u8播放(可配置弹幕)</template>
          <vab-player-hls
            :config="hlsConfig"
            @player="$vabPlayerHls = $event"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { VabPlayerHls, VabPlayerMp4 } from '@/extra/VabPlayer.js'
  import { uuid } from '@/utils'
  export default {
    name: 'Player',
    components: {
      VabPlayerMp4,
      VabPlayerHls,
    },
    data() {
      return {
        show: false,
        form: {
          danmu: '数蛙科技',
        },
        mp4Config: {
          id: 'mse1',
          url: 'https://cdn.jsdelivr.net/gh/chuzhixin/videos@master/video.mp4',
          volume: 0.6,
          autoplay: true,
          fluid: true,
          screenShot: false,
          pip: false,
          danmu: {
            comments: [
              {
                duration: 15000,
                id: uuid(),
                start: 3000,
                txt: '数蛙科技',
                mode: 'scroll',
                style: {
                  color: '#fff',
                  fontSize: '14px',
                  border: 'solid 1px #ff9500',
                  borderRadius: '2px',
                  padding: '2px 11px',
                  backgroundColor: '#ff9500',
                },
              },
            ],
            area: {
              start: 0,
              end: 1,
            },
          },
        },
        $vabPlayerMp4: null,
        hlsConfig: {
          id: 'mse2',
          url: 'https://cdn.jsdelivr.net/gh/chuzhixin/videos@master/video.m3u8',
          volume: 0.6,
          autoplay: false,
          fluid: true,
          pip: false,
          screenShot: false,
        },
        $vabPlayerHls: null,
      }
    },
    created() {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    methods: {
      // http://v2.h5player.bytedance.com/api/#play
      vabPlayerHls(url) {
        this.$vabPlayerHls.reload()
      },
      vabPlayerMp4(url) {
        this.$vabPlayerMp4.reload()
      },
      onSubmit() {
        this.$vabPlayerMp4.danmu.sendComment({
          duration: 15000,
          id: uuid(),
          start: this.$vabPlayerMp4.cumulateTime * 1100,
          txt: this.form.danmu,
          mode: 'scroll',
          style: {
            marginTop: '20px',
            color: '#fff',
            fontSize: '14px',
            border: 'solid 1px #ff9500',
            borderRadius: '2px',
            padding: '2px 11px',
            backgroundColor: '#ff9500',
            zIndex: '9999',
          },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.player';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
