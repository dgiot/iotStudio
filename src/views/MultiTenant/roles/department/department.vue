<template>
  <div class="department department-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-table
          border
          :data="roletempList"
          highlight-current-row
          :row-class-name="tableRowClassName"
          :row-style="selectedHighlight"
          size="small"
          @row-click="getDetailmenu"
        >
          <el-table-column align="center" :label="$translateTitle('user.name')">
            <template #default="{ row }">
              <span>{{ row.data.name }}</span>
              <span>( {{ row.key }} )</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="$translateTitle('developer.operation')"
            width="180"
          >
            <template #default="{ row, $index }">
              <el-button
                size="small"
                type="primary"
                @click.stop="exportRoletemp(row)"
              >
                <!-- 更新模版 -->
                {{ $translateTitle('equipment.Updatetemplate') }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="handleDelete($index, row.objectId, roletempList)"
              >
                <!-- 删除 -->
                {{ $translateTitle('task.Delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="14">
        <el-col :span="12">
          <!--权限 -->
          <div class="footerleft">
            <p class="top">
              <span class="svg-container">
                <dgiot-icon icon="role_group" />
              </span>
              <span>
                <!-- 分配权限 -->
                {{ $translateTitle('user.assignroles1') }}
              </span>
            </p>
            <div style="margin-top: 5px; text-align: center">
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                type="primary"-->
              <!--                @click="expand('permissionTree', 'isExpand')"-->
              <!--              >-->
              <!--                <span v-if="!isExpand">-->
              <!--                  {{ $translateTitle('button.Unfold') }}-->
              <!--                </span>-->
              <!--                <span v-else>{{ $translateTitle('button.fold') }}</span>-->
              <!--              </el-button>-->
              <el-button
                size="mini"
                type="primary"
                @click="checkAll('permissionTree', 'permissionTreeData')"
              >
                {{ $translateTitle('button.select all') }}
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="inverse('permissionTree', 'permissionTreeData')"
              >
                {{ $translateTitle('button.Reverse election') }}
              </el-button>
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                type="primary"-->
              <!--                @click="checkNot('permissionTree')"-->
              <!--              >-->
              <!--                {{ $translateTitle('button.unselect all') }}-->
              <!--              </el-button>-->
            </div>
            <div class="rolecontrol">
              <el-tree
                ref="permissionTree"
                accordion
                check-on-click-node
                :data="permissionTreeData"
                :default-checked-keys="rolePermissonList"
                :default-expand-all="isExpand"
                default-props
                :expand-on-click-node="false"
                node-key="name"
                show-checkbox
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <!--菜单-->
          <div class="footerright">
            <p class="top">
              <span class="svg-container">
                <dgiot-icon icon="menu_group" />
              </span>
              <span>
                <!-- 菜单分配 -->
                {{ $translateTitle('user.assignmenu') }}
              </span>
            </p>
            <div style="margin-top: 5px; text-align: center">
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                type="primary"-->
              <!--                @click="expand('menusTree', 'menuExpand')"-->
              <!--              >-->
              <!--                <span v-if="!menuExpand">-->
              <!--                  {{ $translateTitle('button.Unfold') }}-->
              <!--                </span>-->
              <!--                <span v-else>{{ $translateTitle('button.fold') }}</span>-->
              <!--              </el-button>-->
              <el-button
                size="mini"
                type="primary"
                @click="checkAll('menusTree', 'menuTreeData')"
              >
                {{ $translateTitle('button.select all') }}
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="inverse('menusTree', 'menuTreeData')"
              >
                {{ $translateTitle('button.Reverse election') }}
              </el-button>
              <!--              <el-button-->
              <!--                size="mini"-->
              <!--                type="primary"-->
              <!--                @click="checkNot('menusTree')"-->
              <!--              >-->
              <!--                {{ $translateTitle('button.unselect all') }}-->
              <!--              </el-button>-->
            </div>
            <div class="menucontrol">
              <el-tree
                ref="menusTree"
                accordion
                check-on-click-node
                :data="menuTreeData"
                :default-checked-keys="roleMenuList"
                :default-expand-all="menuExpand"
                default-props
                :expand-on-click-node="false"
                node-key="objectId"
                show-checkbox
              >
                <!-- eslint-disable-next-line -->
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  {{ data.title ? data.title : node.label }}
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
      </el-col>
      <el-col v-show="false" :span="8">
        <div class="footerleft2">
          <p class="top">
            <span class="svg-container">
              <dgiot-icon icon="role_group" />
            </span>
          </p>
        </div>
        <div class="tags">
          <el-form ref="form" label-width="170px" :model="form" :rules="Rule">
            <!-- <el-form-item label="平台">
                    <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                      <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
                   </el-select>
              </el-form-item>-->
            <el-form-item :label="$translateTitle('application.Accesskey')">
              <el-input v-model="form.secret" readonly style="width: 80%">
                <el-button
                  slot="append"
                  icon="el-icon-refresh-right"
                  @click="handleClickRefresh"
                />
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$translateTitle('application.tokeneffectivetime')"
            >
              <el-input
                v-model="form.expires"
                :placheholder="$translateTitle('product.enterapptime')"
                style="width: 80%"
                type="number"
              />
              <span style="margin-left: 5px">
                <!-- 秒 -->
                {{ $translateTitle('task.Seconds') }}
              </span>
            </el-form-item>
            <el-form-item :label="$translateTitle('product.Wordpreviewserver')">
              <el-input
                v-model="form.wordpreview"
                :placheholder="
                  $translateTitle('product.enter1') +
                  $translateTitle('product.Wordpreviewserver')
                "
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('product.Wordproductionserver')"
            >
              <el-input
                v-model="form.wordproduct"
                :placheholder="
                  $translateTitle('product.enter1') +
                  $translateTitle('product.Wordproductionserver')
                "
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item
              :label="$translateTitle('application.fileresources')"
              prop="file"
            >
              <el-input
                v-model="form.file"
                :placheholder="$translateTitle('product.enter1') + 'url'"
                style="width: 80%"
              />
            </el-form-item>

            <el-form-item
              :label="$translateTitle('application.Configurationresources')"
              prop="topo"
            >
              <el-input
                v-model="form.topo"
                :placheholder="$translateTitle('product.enter1') + 'url'"
                style="width: 80%"
              />
            </el-form-item>

            <el-form-item label="Graphql API" prop="graphql">
              <el-input
                v-model="form.graphql"
                :placheholder="$translateTitle('product.enter1') + 'url'"
                style="width: 80%"
              />
            </el-form-item>

            <el-form-item label="Restful API" prop="rest">
              <el-input
                v-model="form.rest"
                :placheholder="$translateTitle('product.enter1') + 'url'"
                style="width: 80%"
              />
            </el-form-item>

            <el-form-item label="home">
              <el-input
                v-model="form.home"
                :placheholder="
                  $translateTitle('product.enter1') +
                  $translateTitle('developer.path')
                "
                style="width: 80%"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { delDict, putDict, queryDict } from '@/api/Dict/index'
  import { queryPermission } from '@/api/Permission/index'
  import { queryMenu } from '@/api/Menu/index'

  // const Base64 = require('js-base64').Base64
  export default {
    name: 'Department',
    components: {},
    data() {
      const validatorUrl = (rule, value, callback) => {
        var regStr =
          /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
        if (value === '' || value === null) {
          callback(new Error('请输入url地址'))
        } else if (!regStr.test(value)) {
          callback(new Error('请输入正确的url地址'))
        } else {
          callback()
        }
      }
      return {
        Rule: {
          desc: [
            {
              required: true,
              message: '请输入应用名称',
              trigger: 'blur',
            },
            {
              validator: (rule, value, callback) => {
                if (value.length === 0) {
                  callback(new Error('应用名称不能为空'))
                } else {
                  callback()
                }
              },
            },
          ],
          file: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          topo: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          graphql: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          rest: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
        },
        form: {
          file: 'http://127.0.0.1:1250/shapes/upload',
          rest: 'http://prod.iotn2n.com/iotapi',
          topo: 'http://127.0.0.1:1350/',
          expires: 18000,
          wordpreview: 'http://pump.iotn2n.com:8012',
          wordproduct: 'http://pump.iotn2n.com/',
          graphql: 'http://prod.iotn2n.com/graphql',
          secret: 'RTc3MDk4MTgxNjAzMTc1MTUxMDY0',
          home: 'E:/shuwa/4.1.0/shuwa_data_center/datacenter/file/files',
        },
        isExpand: false,
        menuExpand: false,
        roletempList: [],
        dataMenus: [],
        roleMenuList: [],
        dataPermissions: [],
        rolePermissonList: [],
      }
    },
    computed: {
      permissionTreeData() {
        return this.dataPermissions.filter((father) => {
          const branchArr = []

          this.dataPermissions.forEach((child) => {
            if (father.objectId == child.parentId) {
              branchArr.push(child)
            }
          })

          /*     let branchArr = this.dataPermissions.filter( (child) => {
          return father.objectId == child.parentId
          }
      ); */

          // 如果存在子级，则给父级添加一个children，并赋值
          if (branchArr.length > 0) {
            father.children = branchArr
          }
          return father.parentId == 0
        })
      },

      menuTreeData() {
        const cloneData = JSON.parse(JSON.stringify(this.dataMenus))
        return cloneData.filter((father) => {
          father.title =
            father.meta && father.meta.title ? father.meta.title : ''
          /* eslint-disable */
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parentId
          )
          branchArr.length > 0 ? (father.children = branchArr) : ''
          return father.parentId == 0
          /* eslint-disable */
        })
      },
    },
    mounted() {
      this.gettable()
      this.getMenu()
      this.getRoleschema()

      /* this.$dgiotBus.$on("dialogHide", () => {
      this.centerDialogRole = false;
    }); */
    },

    methods: {
      expand(tree, isExpand) {
        // 展开/折叠
        this[isExpand] = !this[isExpand]
        dgiotlog.log('tree', tree, this.$refs[tree], isExpand)
        const nodes = this.$refs[tree].store._getAllNodes()
        dgiotlog.log(nodes)
        // 或者方法二
        // const nodes = this.$refs.tree.store.nodesMap
        for (let i in nodes) {
          nodes[i].expanded = this[isExpand]
        }
      },
      checkAll(tree, data) {
        // 全选
        this.$refs[tree].setCheckedNodes(this[data])
      },
      inverse(tree, data) {
        let res = this.$refs[tree]
        let nodes = res.getCheckedNodes(true, true)
        this.batchSelect(this[data], res, true, nodes)
      },
      checkNot(tree) {
        // 全不选
        this.$refs[tree].setCheckedKeys([])
      },
      // 全选处理方法
      batchSelect(nodes, refs, flag, seleteds) {
        if (typeof nodes != 'undefined') {
          nodes.forEach((element) => {
            refs.setChecked(element, flag, true)
          })
        }
        if (typeof seleteds != 'undefined') {
          seleteds.forEach((node) => {
            refs.setChecked(node, !flag, true)
          })
        }
      },
      handleClickRefresh() {
        const ranNum = Math.ceil(Math.random() * 25)
        this.form.secret = Base64.encode(
          String.fromCharCode(65 + ranNum) +
            Math.ceil(Math.random() * 10000000) +
            Number(new Date())
        )
      },
      async getMenu() {
        this.data = []
        this.dataMenus = []
        const { results } = await queryMenu({})
        if (results) {
          this.menuListRes = results
          results.map((items) => {
            var obj = {}
            obj.label = items.name
            obj.meta = items.meta
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.data.push(obj)
            this.dataMenus.push(obj)
          })
        }
      },
      async gettable() {
        const { results } = await queryDict({
          where: {
            type: 'roletemp',
          },
        })
        if (results) this.roletempList = results
      },
      // 获取权限
      async getRoleschema() {
        this.dataPermissions = []
        const { results } = await queryPermission({})
        if (results) {
          this.permissionListRes = results
          results.map((items) => {
            var obj = {}
            obj.label = items.alias
            obj.name = items.name
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.dataPermissions.push(obj)
          })
        }
      },
      tableRowClassName({ row, rowIndex }) {
        // 把每一行的索引放进row

        row.index = rowIndex
      },
      selectedHighlight({ row, rowIndex }) {
        if (this.currentSelectIndex === rowIndex) {
          return {
            color: '#409EFF',
            'font-weight': 'bold',
          }
        }
      },
      getDetailmenu(row, column, event, cell) {
        if (row.data.tag && row.data.tag.appconfig) {
          this.form = row.data.tag.appconfig
        } else {
          this.handleClickRefresh()
        }
        if (column && column.label == '操作') {
          return
        }
        this.currentSelectIndex = row.index

        this.doSetChecked(row.data.menus, row.data.rules)
      },
      doSetChecked(allMenus, allPermissions) {
        this.roleMenuList = []
        this.rolePermissonList = []

        // const tempMenuList = []
        const tempPermissonList = []

        this.menuListRes.map((items) => {
          allMenus.map((mentItem) => {
            if (items.name == mentItem) {
              this.roleMenuList.push(items.objectId)
            }
          })
        })

        // set ###
        this.$refs.menusTree.setCheckedKeys(this.roleMenuList)

        this.permissionListRes.map((items) => {
          allPermissions.map((mentItem) => {
            if (items.name == mentItem) {
              tempPermissonList.push(items.name)
            }
          })
        })

        this.rolePermissonList = [...new Set(tempPermissonList)]

        // set ###
        this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList)
      },
      // 删除模板
      async handleDelete(index, objectId, data) {
        const res = await delDict(objectId)
        if (res) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'success',
            message: '删除成功',
          }),
            data.splice(index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败',
          })
        }
      },
      // 保存模板
      exportRoletemp(row) {
        this.$confirm('确定要更新吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const checkrole = []
            const checkmenu = []
            const selectMenu = this.$refs.menusTree.getCheckedNodes()
            const selectRermission = this.$refs.permissionTree.getCheckedNodes()

            if (
              selectMenu &&
              selectRermission &&
              selectMenu.length > 0 &&
              selectRermission.length > 0
            ) {
              selectMenu.forEach((item) => {
                checkmenu.push(item.label)
              })
              selectRermission.forEach((item) => {
                checkrole.push(item.name)
              })
            } else {
              this.$message({
                mesaage: '数据为空',
                showClose: true,
                duration: 2000,
              })
              return
            }

            var newData = row.data
            if (!row.data.tag) {
              newData.tag = {}
            }
            newData['tag'].appconfig = this.form
            newData.menus = checkmenu
            newData.rules = checkrole

            const loading = this.$loading({
              background: 'rgba(0, 0, 0, 0.5)',
            })
            const res = await putDict(row.objectId, {
              data: newData,
            })
            if (res) {
              loading.close()
              if (res) {
                this.$message({
                  message: '更新成功',
                  showClose: true,
                  duration: 2000,
                })
              }
            } else {
              loading.close()
              this.$message({ message: '更新失败' })
            }
          })
          .catch((e) => {
            dgiotlog.log(e)
          })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .department {
    margin: auto;
    margin-top: 20px;
  }
</style>
<style lang="scss">
  .roles .search .el-input {
    width: 200px;
  }

  .top {
    margin: 0 auto;
    text-align: center;
  }

  .leftTree,
  .footerleft,
  .footerright {
    height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
    overflow-x: hidden;
    overflow-y: scroll;
    border: 1px solid #cccccc;

    span.selected {
      font-weight: bold;
      color: #409eff;
    }

    .el-tree-node {
      margin-top: 5px;
    }

    .custom-tree-node .el-icon-circle-plus-outline:hover {
      color: #409eff;
    }
  }
</style>
