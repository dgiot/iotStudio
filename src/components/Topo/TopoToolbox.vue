<template>
  <div class="topo-toolbox">
    <div highlight separator class="full-height">
      <template v-for="(group, index1) in toolbox">
        <div :key="index1" :icon="group.icon" :label="group.title">
          <div class="toolbox-group">
            <template v-for="(value, index) in group.items">
              <div
                :key="index"
                class="toolbox-item"
                draggable="true"
                @dragstart="onDragstart($event, value)"
              >
                <!-- 判断是不是字体图标 -->
                <template v-if="value.isFontIcon === true">
                  <div class="toolbox-item-icon">
                    <i :class="value.icon"></i>
                  </div>
                  <div class="toolbox-item-text">{{ value.text }}</div>
                </template>
                <!-- 阿里巴巴矢量图标 -->
                <template v-else-if="value.isFontIcon === 1">
                  <div class="item-icon">
                    <i class="icon iconfont" :class="value.icon"></i>
                  </div>
                  <div class="toolbox-item-text">{{ value.text }}</div>
                </template>
                <template v-else>
                  <div class="toolbox-item-icon">
                    <img
                      class="topo-dom"
                      :src="value.icon"
                      style="width: 40px; height: 40px"
                    />
                  </div>
                  <div class="toolbox-item-text">{{ value.text }}</div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import jsonBase from './data-toolbox/base.json'
  import jsonChart from './data-toolbox/chart.json'
  import jsonOffice from './data-toolbox/office.json'
  import jsonSvg from './data-toolbox/svg.json'
  import jsonSvgDianli from './data-toolbox/svg-dianli.json'
  export default {
    name: 'TopoToolbox',
    data() {
      return {
        toolbox: [],
        selectedIndex: -1,
      }
    },
    mounted() {
      this.toolbox = []
      this.toolbox.push(jsonBase)
      this.toolbox.push(jsonChart)
      this.toolbox.push(jsonOffice)
      this.toolbox.push(jsonSvg)
      //this.toolbox.push(jsonSvgDianli);
    },
    methods: {
      onDragstart(event, info) {
        var infoJson = JSON.stringify(info.info)
        event.dataTransfer.setData('my-info', infoJson)
      },
    },
  }
</script>

<style lang="scss">
  .topo-toolbox {
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    border: #ccc solid 1px;

    .toolbox-group {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      justify-content: flex-start;

      .toolbox-item {
        width: 70px;
        padding: 5px;
        margin: 10px 5px;
        color: #777;
        border: transparent solid 1px;
        &.base {
          width: 64px;
        }
        .toolbox-item-icon {
          text-align: center;
        }

        .toolbox-item-text {
          margin-top: 10px;
          text-align: center;
        }
      }

      .toolbox-item:hover {
        color: #3388ff;
        cursor: pointer;
        background: #ccc;
        border: #ccc solid 1px;
        border-radius: 6px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .item-icon {
    height: 30px;
    .iconfont {
      margin-left: 14px;
      font-size: 30px;
    }
  }
</style>
