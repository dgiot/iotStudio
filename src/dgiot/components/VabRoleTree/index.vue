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
    {{ depname }}
    <el-input
      v-if="showFilter"
      v-model="filterText"
      :placeholder="$translateTitle('concentrator.input')"
    />
    <el-tree
      ref="tree"
      class="role-tree-select"
      :data="treeData"
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
  import { mapGetters, mapMutations } from 'vuex'
  import { departmentToken } from '@/api/Role'
  import moment from 'moment'

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
        default: () => this.roleTree,
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
        depname: '',
        treeKey: moment().format('x'),
        treeData: [],
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
        roleTree: 'user/roleTree',
        currentDepartment: 'user/currentDepartment',
      }),
    },
    watch: {
      treeFlag: {
        handler(val) {
          this.treeData = JSON.parse(localStorage.getItem('roleTree'))
          this.treeKey = moment().format('x')
          this.depname = JSON.parse(this.currentDepartment).depname
        },
      },
    },
    created() {},
    mounted() {
      this.treeData = JSON.parse(localStorage.getItem('roleTree'))
      this.treeKey = moment().format('x')
      this.depname = JSON.parse(this.currentDepartment).depname
      console.groupCollapsed(
        '%ctree components',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.groupEnd()
    },
    methods: {
      ...mapMutations({
        setDepartmentToken: 'user/setDepartmentToken',
        setCurrentDepartment: 'user/setCurrentDepartment',
      }),
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
          const { access_token, expires_in } = await departmentToken(data.name)
          Cookies.set('departmentToken', access_token, {
            expires: new Date(new Date().getTime() + expires_in),
          })
          loading.close()
          this.setDepartmentToken(access_token)
          this.setCurrentDepartment(JSON.stringify(data))
          // this._setToken(access_token)
          console.groupCollapsed(
            '%ctree handleNodeClick',
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          this.treeKey = moment().format('x')
          this.depname = data.depname
          setTimeout(() => {
            this.$baseEventBus.$emit('reload-router-view')
          }, 800)
          console.log(data)
          console.log(checked)
          console.groupEnd()
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
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
    overflow: auto;
    .role-tree-select {
      margin-top: 12px;
      overflow: auto;
    }
  }
</style>
