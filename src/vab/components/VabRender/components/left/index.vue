<template>
  <div class="vab-render-left">
    <!-- 搜索 -->
    <div class="vab-render-header vab-render-comp-searcher">
      <el-input
        v-model.trim="keyword"
        clearable
        placeholder="请输入关键字查找组件"
      />
    </div>

    <!-- 组件列表 -->
    <perfect-scrollbar class="vab-render-scrollarea">
      <vue-draggable
        :clone="handleAddFormItem"
        :group="{ name: 'form', pull: 'clone', put: false }"
        :list="filteredComps"
        :sort="false"
        class="vab-render-comps"
        tag="ul"
      >
        <li
          v-for="item of filteredComps"
          :key="item.type"
          class="vab-render-comp"
          @click="handleDoubleClick(item)"
        >
          <div class="vab-render-comp-title">
            {{ item.type }}
          </div>
          <div>{{ item.label }}</div>
        </li>
      </vue-draggable>
    </perfect-scrollbar>
  </div>
</template>

<script>
  export default {
    name: 'VabRenderLeft',
    inject: ['VabRender'],
    data() {
      return {
        keyword: '',
      }
    },
    computed: {
      // 支持模糊搜索
      filteredComps() {
        const results = fuzzy.filter(this.keyword, this.VabRender.sortedComps, {
          extract: (comp) => comp.label + comp.type,
        })
        return results.map((el) => el.original)
      },
    },
    methods: {
      getFormItemByConfig({
        type,
        label,
      }) {
        const formItemData = this.VabRender.getFormItemByType(type)
        return {
          label,
          field: 'key_' + Date.now(),
          ...formItemData,
        }
      },
      // 双击添加表单
      handleDoubleClick(config) {
        const formItemData = this.getFormItemByConfig(config)
        this.VabRender.formItemList = [
          ...this.VabRender.formItemList,
          formItemData,
        ]
      },
      // 拖拽后新增表单项
      handleAddFormItem(config) {
        return this.getFormItemByConfig(config)
      },
    },
  }
</script>

<style lang="css">
  /* 搜索框 */
  .vab-render-comp-searcher {
    padding: 0 10px;
  }

  /* 组件列表 */
  .vab-render-comps {
    padding: 0;
    margin-top: 10px;
  }

  /* 单个组件 */
  .vab-render-comps .vab-render-comp {
    box-sizing: border-box;
    display: inline-block;
    width: 115px;
    padding: 6px 8px;
    margin: 5px;
    overflow: hidden;
    font-size: 12px;
    line-height: 1.5em;
    color: #606266;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: move;
    border: 1px solid #ebeef5;
    border-radius: 3px;
  }

  /* 组件标题 */
  .vab-render-comps .vab-render-comp-title {
    font-weight: bold;
    color: #222;
  }
</style>
