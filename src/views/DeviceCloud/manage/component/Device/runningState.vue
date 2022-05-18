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
          style="height: 250px"
        >
          <!--              <el-card :body-style="{ padding: '0px' }" shadow="never">-->
          <!--                <div style="padding: 14px">-->
          <!--                  <span style="font-size: 30px">{{ key }}</span>-->
          <!--                  <ul-->
          <!--                    v-if="value.length"-->
          <!--                    style="display: flex; flex-wrap: wrap"-->
          <!--                  >-->
          <!--                    <li-->
          <!--                      v-for="(item, index) in value"-->
          <!--                      :key="index"-->
          <!--                      class="updatedtable"-->
          <!--                    >-->
          <!--                      <div style="height: 70px">-->
          <!--                        <span style="font-size: 16px">{{ item.name }}</span>-->
          <!--                        <span-->
          <!--                          style="-->
          <!--                            float: right;-->
          <!--                            margin-top: 10px;-->
          <!--                            margin-right: 15px;-->
          <!--                          "-->
          <!--                        >-->
          <!--                          <el-image-->
          <!--                            :src="item.imgurl"-->
          <!--                            style="width: 60px; height: 60px"-->
          <!--                          >-->
          <!--                            <div-->
          <!--                              slot="error"-->
          <!--                              class="image-slot"-->
          <!--                              style="width: 60px; height: 60px"-->
          <!--                            >-->
          <!--                              <i class="el-icon-picture-outline"></i>-->
          <!--                            </div>-->
          <!--                          </el-image>-->
          <!--                        </span>-->
          <!--                      </div>-->
          <!--                      <div class="stla">-->
          <!--                        <span :title="item.number | filterVal">-->
          <!--                          {{ item.number | filterVal }}-->
          <!--                        </span>-->
          <!--                        <span v-if="item.unit" :title="item.unit">-->
          <!--                          {{ item.unit }}-->
          <!--                        </span>-->
          <!--                      </div>-->
          <!--                      <div class="ta">-->
          <!--                        <span class="fontSize">-->
          <!--                          {{ $translateTitle('equipment.updatetime') + ':' }}-->
          <!--                        </span>-->
          <!--                        <span class="fontSize" @click="print(machinelist)">-->
          <!--                          {{ item.time }}-->
          <!--                        </span>-->
          <!--                      </div>-->
          <!--                    </li>-->
          <!--                  </ul>-->
          <!--                </div>-->
          <!--              </el-card>-->
          <h3>{{ key }}</h3>
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
                <div v-if="j.module == 'card'">
                  <a-card-meta
                    :description="(j.number + j.unit) | filterVal"
                    :title="j.name"
                  >
                    <template #avatar>
                      <a-avatar :src="j.imgurl" />
                    </template>
                  </a-card-meta>
                  <!--                  <el-tag>{{ j.number | filterVal }} {{ j.unit }}</el-tag>-->
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
  .ant-card-meta-description {
    font-size: 26px;
    color: #1e49c5;
  }
</style>
