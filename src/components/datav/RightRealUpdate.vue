<template>
  <div class="right_real_update">
    <div class="update_title">实时数据</div>
    <div
      v-infinite-scroll
      class="update_content infinite-list-wrapper"
      style="overflow: auto"
    >
      <div v-for="(item, index) in nowData" :key="index" class="content_item">
        <div class="item_title">
          {{ item.title }}
        </div>
        <div class="item_value">
          {{ item.data }}
        </div>
      </div>
    </div>
    <div class="update_bottom">
      <div v-for="(item, index) in types" :key="index" class="bottom_btn">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightRealUpdate',
    data() {
      return {
        nowData: [
          {
            title: '运行频率',
            data: '40.0',
          },
          {
            title: '水箱液位(cm)',
            data: '3.8',
          },
          {
            title: '出口压力(MPa)',
            data: '0.0',
          },
          {
            title: '进口压力(MPa)',
            data: '1.0',
          },
          {
            title: 'AB相电压(V)',
            data: '380.8',
          },
          {
            title: 'BC相电压(V)',
            data: '379.8',
          },
          {
            title: 'CA相电压(V)',
            data: '381.8',
          },
          {
            title: '限时流量(m3/h)',
            data: '35.300',
          },
          {
            title: '1#水泵电流',
            data: '12.0',
          },
          {
            title: '2#水泵电流',
            data: '12.0',
          },
          {
            title: '3#水泵电流',
            data: '12.0',
          },
          {
            title: '变频状态',
            data: 'OFF',
          },
          {
            title: '1#水泵电流',
            data: '12.0',
          },
          {
            title: '2#水泵电流',
            data: '12.0',
          },
          {
            title: '3#水泵电流',
            data: '12.0',
          },
          {
            title: '变频状态',
            data: 'OFF',
          },
        ],
        types: [
          {
            id: 1,
            title: '历史数据',
          },
          {
            id: 2,
            title: '历史曲线',
          },
          {
            id: 3,
            title: '报警记录',
          },
          {
            id: 4,
            title: '联系我们',
          },
        ],
      }
    },
  }
</script>
<style lang="scss" scoped>
  .right_real_update {
    display: flex;
    flex-direction: column;
    width: 96%;
    margin: 0 auto;
    height: 100%;
    .update_title {
      width: 100%;
      margin: 4px auto;
      line-height: 30px;
      text-align: center;
      font-weight: 600;
      color: #fff;
      background-color: #0a598b;
      border-radius: 2px;
    }
    .update_content {
      width: 100%;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      .content_item {
        display: flex;
        flex-direction: column;
        width: 24%;
        height: 60px;
        margin-left: 1%;
        margin-top: 1%;
        background-color: #0a598b;
        border-radius: 2px;
        .item_title {
          flex: 1;
          line-height: 20px;
          text-align: center;
          color: #fff;
          font-size: 10px;
        }
        .item_value {
          flex: 2;
          padding: 10px 0;
          text-align: center;
          color: #56c8f4;
          font-weight: 600;
        }
      }
    }
    .update_bottom {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      .bottom_btn {
        width: 22%;
        line-height: 30px;
        text-align: center;
        border-radius: 20px;
        color: #3c4373;
        font-weight: 600;
        background: linear-gradient(
          178deg,
          #fff,
          #b9bbaf 30%,
          #53515c 90%,
          #fed
        );
      }
    }
  }
</style>
