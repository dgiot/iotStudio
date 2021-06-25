<template>
  <div class="runData">
    <div v-if="devicedetail.data" class="devicedetail">
      <el-row>
        <el-col
          v-for="(item, index) in devicedetail.data"
          :key="index"
          :span="6"
          :offset="2"
        >
          <el-card :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <span>{{ item.name }}</span>
              <el-button style="float: right; padding: 3px 0" type="text">
                {{ item.unit }}
              </el-button>
            </div>
            <img :src="item.imgurl" class="image" />
            <div style="padding: 14px">
              <div class="bottom clearfix">
                <time class="time">{{ item.time }}</time>
                <el-button type="text" class="button">
                  {{ item.number }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <vab-empty v-else />
  </div>
</template>
<script>
  export default {
    name: 'DeviceState',
    props: {
      devicedetail: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    created() {},
  }
</script>
<style scoped lang="scss">
  .runData {
    height: 80vh;
    overflow-y: auto;
    .devicedetail {
      width: 100%;
      height: 100%;

      .runData_row {
        width: 100%;
        .runData_col {
          font-size: 18px;
        }
      }
    }
  }
</style>
