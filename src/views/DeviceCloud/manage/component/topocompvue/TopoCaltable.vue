<template>
  <div
    class="topoCaltable"
    :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
  >
    <div class="table_content">
      <div class="backround">
        <div class="toptitle">
          <div class="item">报警时间</div>
          <div class="item">设备编号</div>
          <div class="item">状态</div>
          <div class="item">产品名称</div>
        </div>
        <vue-seamless-scroll
          class="seamless-warp"
          :class-option="optionHover"
          :data="warnList"
        >
          <table cellpadding="0" cellspacing="0" class="table">
            <tr
              v-for="(item, index) in warnList"
              :key="index"
              class="table-item"
            >
              <td class="table-item-content">
                {{ $moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
              </td>
              <td class="table-item-content">{{ item.devaddr }}</td>
              <td class="table-item-content">
                <el-tag
                  v-if="item.content.alertstatus"
                  size="medium"
                  type="warning"
                >
                  告警产生
                </el-tag>
                <el-tag v-else size="medium" type="success">告警恢复</el-tag>
              </td>
              <td class="table-item-content">{{ item.productname }}</td>
            </tr>
          </table>
          <!-- <el-table
            :border="false"
            :cell-style="{ border: '0.2px solid #fff' }"
            :data="listData"
            :highlight-current-row="false"
            row-class-name="tableRowClassName"
            :show-header="status"
          >
            <el-table-column label="日期" prop="date" />
            <el-table-column label="设备" prop="device" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.test" size="medium">恢复正常</el-tag>
                <el-tag v-else size="medium" type="warning">发生报警</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="告警内容" prop="title" />
          </el-table> -->
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>

<script>
  // 原文链接：https://blog.csdn.net/weixin_55799355/article/details/124740977 自动滚动列表
  import { mapGetters } from 'vuex'
  import {
    delNotification,
    putNotification,
    queryNotification,
  } from '@/api/Notification'
  export default {
    name: 'TopoCaltable',
    props: {
      comp: {
        type: Object,
        default: () => ({
          type: 'line',
          width: 262,
          hieght: 72,
        }),
      },
    },
    data() {
      return {
        status: false,
        listData: [
          {
            device: '暂无',
            title: '暂无',
            date: '2017-12-16',
            test: 0,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备2',
            title: '无缝滚动第二',
            date: '2017-12-16',
            test: 1,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备3',
            title: '无缝滚动第三行无缝滚动第三行',
            date: '2017-12-16',
            test: 1,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备4',
            title: '无缝滚动',
            date: '2017-12-16',
            test: 0,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备5',
            title: '无缝滚动第五行无缝滚动第五行',
            date: '2017-12-16',
            test: 1,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备6',
            title: '无缝滚动第六行无缝滚动第六行',
            date: '2017-12-16',
            test: 1,
            test2: '测试2',
            test3: '测试3',
          },
          {
            device: '设备7',
            title: '无缝滚动第七行无缝滚动第七行',
            date: '2017-12-16',
            test: 0,
            test2: '测试2',
            test3: '测试3',
          },
        ],
        warnList: [],
        queryPayload: {
          limit: 10,
          order: '-createdAt',
          skip: 0,
          count: 'objectId',
        },
      }
    },
    computed: {
      ...mapGetters({
        _product_count: 'dashboard/_product_count',
        _dev_count: 'dashboard/_dev_count', //设备总数
        _dev_online_count: 'dashboard/_dev_online_count', //在线
        _dev_off_count: 'dashboard/_dev_off_count', //离线
      }),
      optionHover() {
        return {
          step: 0.5, // 数值越大速度滚动越快
          limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
        }
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData(args = {}) {
        const { results = [], count = 0 } = await queryNotification(
          this.queryPayload
        )
        console.log('告警列表', results)
        this.warnList = results
      },
    },
  }
</script>
<style lang="scss" scoped>
  .topoCaltable {
    position: relative;
    .table_content {
      // position: absolute;
      width: 96%;
      height: calc(100% - 40px);
      margin-top: 35px;
      margin-left: 2%;
      background-color: #363b41;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      overflow: hidden;
      ::v-deep .toptitle {
        background-color: #001833;
        width: 100%;
        display: flex;
        // background-color: gainsboro;
        // margin-bottom: 10px;
        border: 0.2px solid #fff;
        // background-color: transparent;
        // color: white;
      }
      .item {
        width: 25%;
        padding: 10px 0;
        // border-right: 2px solid gainsboro;
        text-align: center;
      }
      .backround {
        width: 100%;
        height: 100%;
        background-color: #001833;
      }
      .table {
        height: 100%;
        display: flex;
        // overflow-y: auto;
        flex-direction: column;
        border-left: 0.2px solid #ccc;
        border-bottom: 0.2px solid #ccc;
        border-right: 0.2px solid #ccc;
        .table-item:nth-child(2n) {
          background-color: #001833;
        }
        .table-item:nth-child(2n + 1) {
          background-color: #08223f;
        }
        .table-item {
          display: flex;
          justify-content: center;
          align-items: center;
          // border-bottom: 0.1px solid #ccc;
          border-top: 0.1px solid #ccc;
          width: 100%;
          // border-bottom: 0.2px solid #fff;
          .table-item-content {
            flex: 1;
            height: 100%;
            // border: 0.1px solid #fff;
            text-align: center;
            padding: 5px;
          }
        }
      }

      /* 表格内背景颜色 */
      ::v-deep .el-table .tableRowClassName:nth-child(2n + 1) {
        background-color: #08223f !important;
        // border: 0.1px solid #fff !important;
      }
      ::v-deep .el-table .tableRowClassName:nth-child(2n) {
        background-color: #001833 !important;
        // border: 0.1px solid #fff !important;
      }
      ::v-deep .el-table {
        border-collapse: collapse;
      }

      // ::v-deep .el-table th,
      // // ::v-deep .el-table tr,
      // ::v-deep .el-table td {
      //   border-collapse: collapse;
      //   color: #fff !important;
      //   // border: 0.2px solid #fff !important;
      //   // border-collapse: collapse !important;
      // }

      // 原文链接：https://blog.csdn.net/weixin_47769562/article/details/119945415
      .seamless-warp {
        overflow: hidden;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000;
        -moz-perspective: 1000;
        -ms-perspective: 1000;
        perspective: 1000; /* Other transform properties here */
      }

      // ::v-deep .el-table--enable-row-hover .el-table__body tr:hover {
      //   color: #000 !important;
      // }
      // ::v-deep .el-table .tableRowClassName:hover {
      //   color: #000 !important;
      // }
      ::v-deep .el-table .cell {
        text-align: center;
        color: #fff;
      }
    }
  }
</style>
