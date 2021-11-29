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
  <div class="role-tree">
    <h4 v-show="currentDepartment.depname" class="role-tree-header">
      {{ $translateTitle('product.Current department') }}
      {{ currentDepartment.depname }}
    </h4>
    <el-input
      v-if="showFilter"
      v-model="filterText"
      :placeholder="$translateTitle('concentrator.input')"
    />
    <el-tree
      :key="treeKey + updateKey"
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
  import { Roletree } from '@/api/Menu'
  import { mapGetters, mapMutations } from 'vuex'
  import { departmentToken } from '@/api/Role'

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
      tree: {
        type: Array,
        required: false,
        default: () => {},
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
        default: 'objectId',
      },
      // 是否高亮当前选中节点，默认值是 false。
      highlight: {
        type: Boolean,
        required: false,
        default: true,
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
        updateKey: 1,
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
        treeFlag: 'settings/treeFlag',
        currentDepartment: 'user/currentDepartment',
        treeKey: 'user/treeKey',
      }),
      roleTree: {
        get: function () {
          return this.$store.state.user.roleTree
        },
        set: function (v) {
          return this.setRoleTree(v)
        },
      },
    },
    watch: {},
    created() {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentDepartment.objectId)
      })
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentDepartment.objectId)
      })
      // this.$dgiotBus.$off('asyncTreeData')
      this.$dgiotBus.$on('asyncTreeData', () => {
        console.error('asyncTreeData')
        this.asyncTreeData()
      })
      this.updateKey++
      console.log(this.roleTree)
    },
    methods: {
      ...mapMutations({
        setTreeKey: 'user/setTreeKey',
        setRoleTree: 'user/setRoleTree',
        setDepartmentToken: 'user/setDepartmentToken',
        setCurrentDepartment: 'user/setCurrentDepartment',
      }),
      async asyncTreeData() {
        const { results } = await Roletree()
        console.error(results, 'results')
        this.setRoleTree(results)
        // this.$dgiotBus.$emit('reload-router-view')
        this.updateKey++
      },
      /**
       * @Author: h7ml
       * @Date: 2021-11-18 11:49:59
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handleNodeClick(data, checked) {
        try {
          const loading = this.$baseLoading()
          this.setCurrentDepartment(data)
          const { access_token: sessionToken, expires_in } =
            await departmentToken(data.name)
          console.log(`部门：${data.name}\ntoken为${sessionToken}`)
          // Cookies.set('departmentToken', access_token, {
          //   expires: new Date(new Date().getTime() + expires_in),
          // })
          loading.close()
          this.setDepartmentToken({ sessionToken, expires_in })
          // this._setToken(access_token)
          this.$dgiotBus.$emit('reload-router-view')
          console.groupCollapsed(
            '%ctree handleNodeClick',
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.log(data)
          console.log(checked)
          console.groupEnd()
          this.$baseNotify(
            this.$translateTitle('message.Department has been switched to') +
              data.depname,
            this.$translateTitle('message.Tips'),
            'success',
            '',
            5000
          )
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      handleCheckClick(data, checked) {
        console.groupCollapsed(
          '%ctree handleCheckClick',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(data, checked, 'handleCheckClick')
        console.log(data)
        console.log(checked)
        console.groupEnd()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.includes(value)
      },
    },
  }
</script>

<style lang="scss">
  /* 点击后的当前节点的样式 */
  .el-tree-node.is-current > .el-tree-node__content {
    color: rgb(64, 158, 255);
    background: rgb(48, 65, 86);
  }
  ///* 点击后的当前节点的子节点的背景颜色 */
  //.el-tree > .el-tree-node.is-current {
  //  background: #1f2d3d;
  //}
  /* 鼠标悬浮的当前节点  */
  .el-tree-node__content:hover {
    background: #baf !important;
  }
  .role-tree {
    &-header {
      margin: 10px 0;
    }
    overflow: auto;
    .role-tree-select {
      margin-top: 12px;
      overflow: auto;
    }
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
