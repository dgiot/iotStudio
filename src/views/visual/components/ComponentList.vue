<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      :data-index="index"
      draggable
    >
      <span class="iconfont" :class="'icon-' + item.icon"></span>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
  import componentList from '@/views/visual/components/component-list' // 左侧列表数据

  export default {
    data() {
      return {
        componentList,
      }
    },
    methods: {
      handleDragStart(e) {
        e.dataTransfer.setData('index', e.target.dataset.index)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .component-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;

    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45%;
      padding: 2px 5px;
      margin-bottom: 10px;
      color: #333;
      text-align: center;
      cursor: grab;
      border: 1px solid #ddd;

      &:active {
        cursor: grabbing;
      }

      .iconfont {
        margin-right: 4px;
        font-size: 20px;
      }

      .icon-wenben,
      .icon-tupian {
        font-size: 18px;
      }
    }
  }
</style>
