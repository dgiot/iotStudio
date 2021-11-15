<!--
* @Author: h7ml
* @Date: 2021-11-12 15:12:19
* @LastEditors:
* @LastEditTime: 2021-11-12 15:12:19
* @Description: 角色树组件
* @FilePath: src\vab\components\VabRoleTree\index.vue
* @DocumentLink:
-->
<template>
  <div :key="treeKey" class="role-tree">
    <el-input
      v-if="showFilter"
      v-model="filterText"
      :placeholder="$translateTitle('concentrator.input')"
    />
    <el-tree
      ref="tree"
      class="role-tree-select"
      :data="roleTree"
      :default-checked-keys="keys"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="expandedKeys"
      :filter-node-method="filterNode"
      :highlight-current="highlight"
      :lazy="lazy"
      :node-key="nodekey"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :style="{ 'max-height': maxHeight + 'px' }"
      @check-change="handleCheckClick"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabRoleTree',
    components: {},
    /**
     * @document https://element.eleme.cn/#/zh-CN/component/tree#attributes
     * @description VabPropTree
     */
    props: {
      // 是否懒加载子节点，需与 load 方法结合使用
      lazy: {
        type: Boolean,
        required: false,
        default: false,
      },
      // three组件样式长度
      maxHeight: {
        type: Number,
        required: false,
        default: 500,
      },
      // 默认勾选的节点的 key 的数组
      keys: {
        type: Array,
        required: false,
        default: () => [],
      },
      checkedKeys: {
        type: Array,
        required: false,
        default: () => [],
      },
      expandedKeys: {
        type: Array,
        required: false,
        default: () => [],
      },
      // 是否重置滚动条
      resetScroll: {
        type: Boolean,
        default: false,
      },
      // 是否开启筛选
      showFilter: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 是否需要父级id
      hasParent: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 节点是否可被选择
      showCheckbox: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      nodekey: {
        type: String,
        required: false,
        default: 'id',
      },
      // 是否高亮当前选中节点，默认值是 false。
      highlight: {
        type: Boolean,
        required: false,
        default: false,
      },
      // 是否默认展开所有节点
      defaultExpandAll: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    data() {
      return {
        // 在需要对节点进行过滤时，调用 Tree 实例的filter方法，参数为关键字。
        filterText: '',
        // 角色树展开信息
        defaultProps: {
          children: 'children',
          label: 'label',
        },
      }
    },
    computed: {
      ...mapGetters({
        // 角色树信息数据
        roleTree: 'user/roleTree',
        treeKey: 'user/treeKey',
      }),
    },
    created() {},
    mounted() {
      console.groupCollapsed(
        '%ctree components',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.table(this.roleTree)
      console.groupEnd()
    },
    methods: {
      handleNodeClick(data, checked) {
        console.log(data, checked)
      },
      handleCheckClick(data, checked) {
        console.log(data, checked)
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.includes(value)
      },
    },
  }
</script>

<style lang="scss">
  .role-tree {
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #fff;
    }

    .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
</style>
<style lang="scss">
  .role-tree {
    padding: 10px 0;
    overflow: auto;

    .role-tree-select {
      margin-top: 12px;
      overflow: auto;
    }
  }
</style>
