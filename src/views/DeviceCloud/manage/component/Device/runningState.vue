<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-05-14 18:32:14
* @LastEditors: 18:32
* @LastEditTime: 2022-05-14 18:32:14
* @Description:
* @FilePath: src\views\DeviceCloud\manage\component\Device\runningState.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: runningState
-->
<template>
  <div class="runningState-container">
    <div class="runningState">
      <div v-loading="loading" style="overflow: scroll; height: 80vh">
        <div
          v-for="(value, key, index) in machinelist"
          :key="index"
          style="overflow: scroll; height: auto"
        >
          <h2>{{ key }}</h2>
          <el-row type="flex">
            <el-col
              v-for="(j, index) in value"
              :key="index"
              :lg="6"
              :md="6"
              :sm="8"
              :xl="4"
              :xs="12"
            >
              <a-card hoverable style="margin: 10px" :title="j.name">
                <template #extra>
                  <dgiot-icon
                    icon="exchange-line"
                    style="font-size: 24px; cursor: pointer"
                    @click.native="
                      j.module = j.module == 'card' ? 'table' : 'card'
                    "
                  />
                </template>
                <div v-if="j.module == 'table'">
                  <List border :header="j.name">
                    <ListItem v-for="v in Object.keys(j)" :key="v">
                      {{ v + ':' + j[v] }}
                    </ListItem>
                  </List>
                </div>
                <div v-if="j.module == 'card'" class="fixdescription">
                  <a-card-meta :description="(j.number + j.unit) | filterVal">
                    <template #avatar>
                      <a-avatar :src="j.imgurl" />
                    </template>
                  </a-card-meta>
                  <el-link style="margin-top: 10px" :underline="false">
                    {{ $translateTitle('equipment.updatetime') + ':' }}
                    {{ j.time }}
                  </el-link>
                </div>
              </a-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RunningState',
    components: {},
    filters: {
      filterVal(val) {
        if (val || val == 0) {
          return val
        } else {
          return '--'
        }
      },
    },
    props: {
      loading: {
        required: false,
        type: Boolean,
        default: () => false,
      },
      thirdtbKey: {
        required: false,
        type: Number,
        default: () => moment(new Date()).valueOf(),
      },
      machinelist: {
        required: false,
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        module: 'card',
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    destroyed() {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .runningState-container {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="scss">
  .fixdescription .ant-card-meta-description {
    font-size: 26px !important;
    color: #1e49c5 !important;
    text-align: center !important;
  }

  .el-link--inner {
    display: block;
    margin-top: 20px;
  }
</style>
