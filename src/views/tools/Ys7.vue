<template>
  <div class="player-container">
    <el-row :gutter="24">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <vab-query-form class="page-header">
          <vab-query-form-top-panel :span="24">
            <el-form
              ref="form"
              :inline="true"
              label-width="50px"
              :model="queryForm"
              size="mini"
              @submit.native.prevent
            >
              <el-form-item label="token">
                <el-input
                  v-model="token"
                  style="width: 500px"
                  placeholder="token"
                />
              </el-form-item>
              <el-form-item label="url">
                <el-input
                  v-model="url"
                  style="width: 400px"
                  placeholder="url"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-video-play"
                  native-type="submit"
                  type="primary"
                  @click="ys7player()"
                />
              </el-form-item>
            </el-form>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-card shadow="hover" class="player_card">
          <vab-ys7
            id="ys7-container"
            ref="ys7"
            :url="url"
            :access-token="token"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Ys7',
    data() {
      return {
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        list: [],
        url: 'ezopen://open.ys7.com/E19478865/1.live',
        token:
          'at.b6wtb3mkaty1kgf94qv2etrt5k47piaj-8s1zenpnpq-1kv8g2v-biq7dcgr2',
      }
    },
    computed: {},
    created() {},
    mounted() {
      // this.ys7player()
    },
    methods: {
      ys7player() {
        this.$nextTick(() => {
          this.$refs.ys7.ys7player()
        })
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
    .player_card {
      width: 100%;
      height: 100%;
      #video-container {
        width: 100%;
        height: calc(100vh - 200px);
      }
    }
  }
</style>
