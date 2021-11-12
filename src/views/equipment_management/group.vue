<template>
  <div class="group">
    <el-container>
      <el-container>
        <el-main>
          <div class="main">
            <el-drawer
              :visible.sync="drawer"
              direction="ltr"
            >
              <div
                v-if="showTree"
                class="tree"
              >
                搜索 :
                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                  style="width: 80%"
                />

                <el-tree
                  ref="tree"
                  :allow-drag="allowDrag"
                  :allow-drop="allowDrop"
                  :data="treeData"
                  :filter-node-method="filterNode"
                  :props="defaultProps"
                  class="treeitems"
                  default-expand-all
                  draggable
                  node-key="id"
                  @node-drop="handleDrop"
                >
                  <span
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                  >
                    <span v-if="data.roles.seen == true">
                      <el-input
                        v-model="editLabel"
                        style="width: 80%"
                      />
                    </span>
                    <span
                      v-else
                      style="color: #409eff"
                    >{{ node.label }}</span>
                    <span
                      v-if="data.roles.seen == false"
                      style="margin-left: 5px"
                    >
                      <i
                        class="el-icon-plus"
                        style="color: #67c23a"
                        title="新增"
                        @click.stop="append(data)"
                      />
                      <i
                        class="el-icon-delete"
                        style="color: red"
                        title="删除"
                        @click.stop="deletes(data)"
                      />
                      <i
                        class="el-icon-edit"
                        style="color: #909399"
                        title="编辑"
                        @click.stop="rename(data)"
                      />
                    </span>
                    <span v-else>
                      <i
                        slot="suffix"
                        class="el-icon-check"
                        title="保存"
                        @click.stop="savename(data)"
                      />
                    </span>
                  </span>
                </el-tree>
              </div>
            </el-drawer>
            <el-tabs
              v-model="activeName"
              style="display: none"
              @tab-click="goTo"
            >
              <el-tab-pane
                v-for="item in tabsNav"
                :key="item.url"
                :label="item.label"
                :name="item.url"
              />
            </el-tabs>
            <router-view />
          </div>
          <div class="setting">
            <i
              :class="[drawer ? 'el-icon-s-fold' : 'el-icon-s-unfold']"
              @click="toggleTree()"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      :append-to-body="true"
      :visible="centerDialogRole"
      center
      title="添加角色"
      width="35%"
      @close="closeDialogRole"
    >
      <addroles ref="addRoleRef" />
    </el-dialog>
  </div>
</template>

<script>
  import { delRole, putRole, roletree } from '@/api/Role/index.js'
  import { addGroup } from '@/api/Group/index.js'
  import addroles from '@/views/roles/rolelist/addroles'

  export default {
    name: 'Group',
    components: { addroles },
    data() {
      return {
        drawer: false,
        tabsNav: [
          {
            label: '统计预览',
            url: 'platform',
          },
          {
            label: '虚拟分组',
            url: 'devproduct',
          },
          {
            label: '通道列表',
            url: 'resourcechannel',
          },
          {
            label: '设备列表',
            url: 'devicelist',
          },
          {
            label: '产品列表',
            url: 'productlist',
          },
          {
            label: '规则列表',
            url: 'engine',
          },
        ],
        numberValidateForm: {
          name: '',
        },
        centerDialogRole: false,
        editLabel: '',
        filterText: '',
        addForm: {
          seen: false,
          date: '',
          name: '',
          address: '',
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'alias',
          isLeaf: 'leaf',
        },
        showTree: true,
      }
    },
    computed: {
      activeName: {
        get: function () {
          if (this.$route.path.replace('/dashboard/', '') != '') {
            return this.$route.path.replace('/dashboard/', '')
          } else {
            return 'platform'
          }
        },
        set: function () {
        },
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
    },
    mounted() {
      this.$baseEventBus.$on('dialogHide', () => {
        this.centerDialogRole = false
        this.getTree()
      })
      this.getTree()
    },
    methods: {
      // 页面跳转
      goTo(tab) {
        this.$router.push({
          path: '/dashboard/' + tab.name,
        })
      },
      // toggleTree
      toggleTree() {
        this.drawer = !this.drawer
      },
      // 获取角色树
      getTree() {
        function deepClone(originObject) {
          var deepObject = Array.isArray(originObject) ? [] : {}
          if (originObject && typeof originObject === 'object') {
            for (var key in originObject) {
              if (originObject.roles) {
                originObject.roles.seen = false
              }
              // 如果子属性为引用数据类型，递归复制
              if (originObject.hasOwnProperty(key)) {
                if (
                  originObject[key] &&
                  typeof originObject[key] === 'object'
                ) {
                  deepObject[key] = deepClone(originObject[key])
                } else {
                  deepObject[key] = originObject[key]
                }
              }
            }
          }
          return deepObject
        }

        roletree()
          .then((res) => {
            this.treeData = deepClone(res.results)
            console.log(this.treeData)
          })
          .catch((e) => {
            console.log(e)
            this.treeData = []
          })
      },
      // 新建虚拟分组
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addGroup(this.numberValidateForm.name)
              .then((res) => {
                this.$message({
                  message: '新建设备分组成功',
                  type: 'success',
                })
              })
              .catch((e) => {
                this.$message({
                  message: '新建设备分组失败' + e.computed,
                  type: 'error',
                })
              })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      append(data) {
        this.centerDialogRole = true
        this.$nextTick(() => {
          this.$refs['addRoleRef'].getData(data)
        })
      },
      closeDialogRole() {
        this.centerDialogRole = false
        this.getTree()
      },
      deletes(data) {
        this.$confirm('此操作将永久删除该节点,包括其子节点', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            delRole(data.objectId)
              .then((res) => {
                this.getTree()
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
              })
              .catch((e) => {
                this.$message({
                  type: 'error',
                  message: '删除失败' + e.error,
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      rename(data) {
        this.editLabel = data.alias
        data.roles.seen = true
      },
      savename(data) {
        if (data.alias != this.editLabel) {
          putRole(data.objectId, this.editLabel)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '编辑成功',
              })
              data.alias = this.editLabel
            })
            .catch((e) => {
              console.log(e)
            })
        }
        data.roles.seen = false
      },
      allowDrop(draggingNode, dropNode, type) {
        if (draggingNode.level === dropNode.level) {
          if (draggingNode.data.parentId === dropNode.data.parentId) {
            return type === 'prev' || type === 'next'
          }
        } else {
          // 不同级不允许拖拽
          return false
        }
      },
      // 拖拽==>判断节点能否被拖拽
      allowDrag(draggingNode) {
        return draggingNode.level !== 1
      },
      // 拖拽成功完成时触发的事件，在这里可以将节点拖拽后的顺序返给后端

      handleDrop(node, data, type, event) {
        const arr = []
        // data为拖拽后节点信息，找到它的父级，在从父级找子集
        const child = data.parent.childNodes
        for (var key in child) {
          arr.push({
            id: child[key].data.id,
          })
        }
        // 转为JSON字符串发请求带走信息
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
    },
  }
</script>

<style lang="scss" scoped>
  .group {
    position: relative;
    display: flex;
    margin: 20px;

    .custom-tree-node {
      width: 100%;

      .el-input {
        width: 60%;
      }

      i {
        margin-left: 5px;
      }
    }

    ::v-deep {
      .el-drawer__body {
        margin: 30px;
        background: #fff !important;
      }

      .el-tree-node__content {
        height: 30px;
      }

      .el-drawer {
        /* z-index: 999;
      width: 30% !important; */
      }

      @media screen and (max-width: 960px) {
        .el-drawer {
          z-index: 999;
          width: 70% !important;
        }
      }

      .is-leaf {
        /* display: none; */
      }

      /* .el-tree-node__content{
      padding-left: 8px;
    } */
      .setting {
        position: absolute;
        top: 0;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
      }

      .el-header,
      .el-footer {
        background-color: #fff;
      }

      .el-main {
        background-color: #fff;
      }
    }

    .tree {
      padding: 0;
      margin: 0;
      overflow: hidden;
      font-size: 14px;
      /* 左侧固定200px */
    }

    .main {
      flex: 1;
    }
  }
</style>
