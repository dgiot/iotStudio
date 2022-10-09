<template>
  <div class="topoCaltable" :style="{ width: '100%', height: '100%' }">
    <div class="table_content">
      <div class="backround">
        <div class="toptitle">
          <div class="item">设备名称</div>
          <div class="item">设备地址</div>
          <div class="item">安装位置</div>
          <div class="item">状态</div>
          <div class="item">最后更新时间</div>
        </div>
        <vue-seamless-scroll
          class="seamless-warp"
          :class-option="optionHover"
          :data="deviceList"
        >
          <table cellpadding="0" cellspacing="0" class="table">
            <tr
              v-for="(item, index) in deviceList"
              :key="index"
              class="table-item"
            >
              <td class="table-item-content">{{ item.name }}</td>
              <td class="table-item-content">{{ item.devaddr }}</td>
              <td class="table-item-content">{{ item.address }}</td>
              <td class="table-item-content">
                <el-tag
                  v-if="item.status == 'OFFLINE'"
                  size="medium"
                  type="warning"
                >
                  离线
                </el-tag>
                <el-tag v-else size="medium" type="success">在线</el-tag>
              </td>

              <td class="table-item-content">
                {{ $moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
              </td>
            </tr>
          </table>
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>

<script>
  // 原文链接：https://blog.csdn.net/weixin_55799355/article/details/124740977 自动滚动列表
  import { mapGetters } from 'vuex'
  import {
    putDevice,
    querycompanyDevice,
    postDevice,
    delDevice,
  } from '@/api/Device'
  export default {
    name: 'ScreenDevice',
    props: {
      comp: {
        type: Object,
        default: () => ({
          type: 'line',
          width: 400,
          hieght: 72,
        }),
      },
    },
    data() {
      return {
        status: false,
        listData: [],
        warnList: [],
        deviceList: [],
        queryForm: {
          devicename: '',
          statusFlag: false,
          status: '',
          number: '',
          product: '',
          type: '',
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limt: 10,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
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
          limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
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
      async fetchData() {
        // this.listLoading = true
        let params = {
          skip: 0,
          limit: 10,
          // excludeKeys: this.queryForm.excludeKeys,
          // include: this.queryForm.include,
          order: '-createdAt',
          count: 'objectId',
          where: {},
        }
        // this.queryForm.product
        //   ? (params.where.product = this.queryForm.product)
        //   : ''
        // this.queryForm.search
        //   ? (params.where[this.queryForm.type] = {
        //       $regex: this.queryForm.search,
        //     })
        //   : ''
        // this.queryForm.status
        //   ? (params.where.status = this.queryForm.status)
        //   : ''
        // this.queryForm.isEnable
        //   ? (params.where.isEnable = this.queryForm.isEnable)
        //   : ''
        const { results: list = [], count: total = 0 } =
          await querycompanyDevice(params, this.token)
        list.forEach((item) => {
          item.address = item.address == '' ? '---' : item.address
          item.detail = item?.detail ? item.detail : {}
          item.detail.address =
            item?.detail && item?.detail?.address ? item.detail.address : '---'
          item.isEdit = false
          item.oldName = item.name
        })
        this.deviceList = list
        this.total = total
        this.listLoading = false
        // 订阅处理所有的设备
        // await this.subAllDevice()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .topoCaltable {
    position: relative;
    width: 100%;
    height: 100%;
    .table_content {
      // position: absolute;
      width: 96%;
      height: calc(100% - 40px);
      margin-top: 35px;
      margin-left: 2%;
      background-color: #0b2266;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      overflow: hidden;
      ::v-deep .toptitle {
        background-color: #071753;
        width: 100%;
        display: flex;
        // background-color: gainsboro;
        // margin-bottom: 10px;
        border: 0.2px solid #fff;
        // background-color: transparent;
        // color: white;
      }
      .item {
        // width: 25%;
        flex: 1;
        padding: 15px 0;
        // border-right: 2px solid gainsboro;
        text-align: center;
      }
      .backround {
        width: 100%;
        height: 100%;
        // background-color: #001833;
      }
      .table {
        height: 100%;
        display: flex;
        // overflow-y: scroll;
        flex-direction: column;

        // border-left: 0.2px solid #ccc;
        // border-bottom: 0.2px solid #ccc;
        // border-right: 0.2px solid #ccc;
        .table-item:nth-child(2n) {
          background-color: #0b1b57;
        }
        .table-item:nth-child(2n + 1) {
          background-color: #071753;
        }
        .table-item {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          // border-bottom: 0.1px solid #ccc;
          // border-top: 0.1px solid #ccc;
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

      ::v-deep .el-table .tableRowClassName:nth-child(2n) {
        background-color: #001833 !important;
        // border: 0.1px solid #fff !important;
      }
      ::v-deep .el-table .tableRowClassName:nth-child(2n + 1) {
        background-color: #08223f !important;
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
        height: 100%;
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
