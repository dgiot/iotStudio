<template>
  <div class="roles dgiot-container">
    <el-row :gutter="24">
      <el-col :span="13" :xs="8">
        <div class="rightTable">
          <div class="search">
            <dgiot-query-form v-show="currentDepartment.depname">
              <dgiot-query-form-top-panel>
                <el-form :inline="true" label-width="100px" :model="queryForm">
                  <el-form-item :label="$translateTitle('user.rolename')">
                    <el-input
                      v-model="search"
                      clearable
                      :placeholder="$translateTitle('user.rolename')"
                      size="mini"
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button
                      icon="el-icon-search"
                      size="mini"
                      style="margin-left: 20px"
                      type="primary"
                      @click="getRolesList(0)"
                    >
                      {{ $translateTitle('developer.search') }}
                    </el-button>
                    <!-- icon="el-icon-plus" -->
                    <!--           <el-button type="primary" size="mini" @click="add">
              {{
               $translateTitle("developer.add")
              }}
            </el-button>-->
                    <!-- icon="el-icon-search" -->
                    <el-button
                      size="mini"
                      type="primary"
                      @click.native="getRolesList()"
                    >
                      <!-- 所有角色 -->
                      {{ $translateTitle('product.allroles') }}
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click.native="setDialogRole(currentDepartment)"
                    >
                      {{ $translateTitle('user.new group') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </dgiot-query-form-top-panel>
            </dgiot-query-form>
          </div>
          <div class="tableroles" style="margin-top: 20px">
            <el-table
              :data="roleList"
              :height="tableHeight"
              highlight-current-row
              :row-class-name="tableRowClassName"
              :row-style="selectedHighlight"
              size="small"
              style="width: 100%; text-align: center"
              @row-click="getDetailmenu"
            >
              <el-table-column
                align="center"
                :label="$translateTitle('user.rolename')"
                prop="name"
                show-overflow-tooltip
                sortable
                width="200"
              />
              <!--         <el-table-column :label=" $translateTitle('developer.describe')" align="center">
                <template #default="{ row }">
                  <span>{{ row.desc }}</span>
                </template>
              </el-table-column>-->
              <el-table-column
                align="center"
                :label="$translateTitle('user.Remarks')"
                prop="alias"
                show-overflow-tooltip
                sortable
                width="180"
              />
              <el-table-column
                align="center"
                label="ID"
                prop="objectId"
                show-overflow-tooltip
                sortable
                width="100"
              />
              <el-table-column
                align="center"
                :label="$translateTitle('developer.operation')"
                width="auto"
              >
                <template #default="{ row }">
                  <!-- <el-button size="mini" type="primary" @click.native="handleEdit(row)">分配权限</el-button> -->
                  <!-- <el-button size="mini" type="success" @click.native="addmenu(row)">分配菜单</el-button> -->
                  <!-- <el-button size="mini" type="primary" >增加用户</el-button> -->

                  <el-dropdown
                    :disabled="row.disabled"
                    size="mini"
                    split-button
                    style="margin-right: 5px"
                    type="primary"
                    @click="exportRolerole(row)"
                  >
                    <span class="el-dropdown-link">
                      <!-- 修改 -->
                      {{ $translateTitle('product.Update Acl') }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        icon="el-icon-document"
                        @click.native="exportRoletemp(row)"
                      >
                        <!-- 保存模板 -->
                        {{ $translateTitle('product.savetemplate') }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item icon="el-icon-document" @click.native="handleEditrole(row)" >编辑</el-dropdown-item> -->
                      <el-dropdown-item
                        :disabled="row.objectId === currentDepartment.objectId"
                        icon="el-icon-delete"
                        size="mini"
                        @click.native="handleDelete(row)"
                      >
                        <!-- 删除 -->
                        {{ $translateTitle('task.Delete') }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item @click.native="taskDetail(row.objectId,row.test_bed.id)">详情</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button
                    size="mini"
                    type="success"
                    @click.native="dynamicForm(row)"
                  >
                    <span class="el-dropdown-link">
                      <!-- 低代码 -->
                      {{ $translateTitle('product.dynamic form') }}
                    </span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="rightPagination">
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11" :xs="16">
        <!--菜单-->
        <div class="rolefooter">
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
            <div class="rolecontrol">
              <div style="margin-top: 5px; text-align: center">
                <!--                <el-button-->
                <!--                  size="mini"-->
                <!--                  type="primary"-->
                <!--                  @click="expand('permissionTree', 'isExpand')"-->
                <!--                >-->
                <!--                  <span v-if="!isExpand">-->
                <!--                    {{ $translateTitle('button.Unfold') }}-->
                <!--                  </span>-->
                <!--                  <span v-else>{{ $translateTitle('button.fold') }}</span>-->
                <!--                </el-button>-->
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
                <!--                <el-button-->
                <!--                  size="mini"-->
                <!--                  type="primary"-->
                <!--                  @click="checkNot('permissionTree')"-->
                <!--                >-->
                <!--                  {{ $translateTitle('button.unselect all') }}-->
                <!--                </el-button>-->
              </div>
              <el-tree
                :key="hashKey"
                ref="permissionTree"
                accordion
                check-on-click-node
                :data="permissionTreeData"
                :default-checked-keys="rolePermissonList"
                :default-expand-all="isExpand"
                default-props
                :expand-on-click-node="false"
                node-key="objectId"
                show-checkbox
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
                <span>
                  <i
                    class="el-icon-circle-plus-outline"
                    :title="$translateTitle('product.addrole')"
                    @click="setDialogRole(data)"
                  />
                </span>
              </el-tree>
            </div>
          </div>
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
            <div class="menucontrol" style="margin-top: 0px">
              <el-tree
                :key="hashKey"
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
        </div>
      </el-col>
    </el-row>
    <el-drawer
      v-drawerDrag
      append-to-body
      size="80%"
      :visible.sync="dynamicform.visible"
    >
      <dgiot-views
        ref="dgiotView"
        :class-disable="true"
        :edit-row="editRow"
        :select-row="selectRow"
        :type="'role'"
        :view-form="viewForm"
        @BusRole="BusRole"
      />
    </el-drawer>

    <a-modal
      :footer="null"
      :title="$translateTitle('product.addrole')"
      :visible="centerDialogRole"
      @cancel="closeDialogRole"
    >
      <addroles
        :key="$moment().unix()"
        ref="addRoleRef"
        :dept-data="deptData"
      />
    </a-modal>

    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('developer.add')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        ref="multipleTable"
        :data="tableDataroles"
        :height="tableHeight"
        style="width: 100%; text-align: center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" :label="$translateTitle('user.name')">
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$translateTitle('user.Remarks')"
        >
          <template #default="{ row }">
            <span>{{ row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="ID">
          <template #default="{ row }">
            <span>{{ row.objectId }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="addacl">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>

    <!--编辑权限弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('developer.edit')"
      :visible.sync="roleEdit"
    >
      <el-form :model="form">
        <el-form-item
          :label="$translateTitle('user.rolename')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            disabled
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('user.Remarks')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.alias"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('developer.describe')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.desc"
            autocomplete="off"
            :rows="2"
            style="width: 300px"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleEdit = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="updaterole">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    delRole,
    queryRole,
    queryRoledepartment,
    roleMenu,
    saveRole,
    saveRoletemp,
  } from '@/api/Role/index'
  import { mapGetters, mapMutations } from 'vuex'
  import addroles from '@/views/MultiTenant/roles/list/addroles'
  import dgiotViews from '@/views/CloudFunction/lowcode'
  import { postRelation, delRelation, queryRelation } from '@/api/Relation'

  export default {
    name: 'Role',
    data() {
      return {
        selectRow: [],
        editRow: {},
        viewForm: {
          showRow: false,
          class: 'Product',
          type: 'amis',
          // key: this.$route.query.id,
          key: '',
          title: '',
          disabled: true,
          data: {
            type: 'page',
            initApi: {
              url: 'iotapi/classes/Device/parse_objectid',
              method: 'get',
              adaptor:
                'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
              headers: {
                store: 'localStorage',
                dgiotReplace: 'parse_objectid',
              },
              dataType: 'json',
            },
            body: [
              {
                type: 'form',
                api: {
                  method: 'put',
                  url: 'iotapi/classes/Device/parse_objectid',
                  headers: {
                    store: 'localStorage',
                    dgiotReplace: 'parse_objectid',
                  },
                  dataType: 'json',
                  requestAdaptor:
                    'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
                },
                body: [
                  {
                    type: 'input-text',
                    label: '设备名称',
                    name: 'name',
                  },
                ],
              },
            ],
          },
          hiddenRow: ['class', 'key', 'createdAt'],
        },
        dynamicform: {
          visible: false,
          activeName: '0',
          data: [],
        },
        hashKey: '',
        tableHeight: this.$baseTableHeight(2),
        isExpand: false,
        menuExpand: false,
        curDepartmentId: '',
        formLabelWidth: '120px',
        roleEdit: false,
        form: {
          name: '',
          alias: '',
          desc: '',
        },
        data: [],
        dialogVisible: false,
        multipleSelection: [],
        search: '',
        total: 0,
        pagesize: 10,
        start: 0,
        roleList: [],
        tableDataroles: [],
        centerDialogVisible: false,
        editroleid: '',
        currentSelectIndex: null,
        roleProps: {
          children: 'children',
          label: 'name',
        },
        treeDataValue: '',
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
          workGroupName: '',
          workGroupTreeShow: false,
          access_token: '',
        },
        checkMenus: [], // 选中菜单
        checkRoles: [], // 选中权限
        dataMenus: [],
        menusTreeloading: false,
        permissionTreeloading: false,
        roleMenuList: [],
        dataPermissions: [],
        rolePermissonList: [],
        loadingService: {},
        roleItem: [],
        centerDialogRole: false,
        deptData: {},
      }
    },
    computed: {
      ...mapGetters({
        currentDepartment: 'user/currentDepartment',
        roleTree: 'user/roleTree',
        Menu: 'user/Menu',
        Permission: 'user/Permission',
      }),
      permissionTreeData() {
        const cloneData = JSON.parse(JSON.stringify(this.dataPermissions))
        return cloneData.filter((father) => {
          /* eslint-disable */
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parentId
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentId == 0 // 返回第一层
          /* eslint-disable */
        })
      },
      menuTreeData() {
        const cloneData = JSON.parse(JSON.stringify(this.dataMenus))

        const res = cloneData.filter((father) => {
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
        return res
      },
    },
    components: {
      addroles,
      dgiotViews,
    },
    mounted() {
      this.getRoleschema()
      this.getMenu()
      this.getRolesList()
      this.$dgiotBus.$on('dialogHide', () => {
        this.centerDialogRole = false
        this.getMenu()
      })
    },

    methods: {
      async BusRole({ row, type }) {
        const destId = this.editRow.objectId
        const srcId = row.objectId
        console.log(this.editRow)
        console.log(row.objectId)
        const params = {
          destClass: '_Role',
          destField: 'views',
          destId: destId,
          srcClass: 'View',
          srcId: srcId,
        }
        const res =
          type == '关联'
            ? await postRelation(params)
            : await delRelation(params)
        this.$message({
          showClose: true,
          type: 'success',
          message: type + '成功',
          duration: 2000,
        })
        await this.querySelectRow(this.editRow)
      },
      async querySelectRow(row) {
        const params = {
          destClass: '_Role',
          destId: row.objectId,
          srcClass: 'View',
          destField: 'views',
        }
        const { results = [] } = await queryRelation(params)
        // 只要viewid
        this.selectRow = _.drop(results, 'objectId')
      },
      async dynamicForm(form) {
        await this.querySelectRow(form)
        console.log(this.selectRow)
        this.editRow = form
        // 查找view类型id为当前角色id的
        console.log(form)
        // this.viewForm.key = form.objectId
        this.dynamicform.visible = true
        this.$nextTick(() => {
          this.$refs.dgiotView.fetchData()
          console.log(this.$refs.dgiotView)
        })
      },
      expand(tree, isExpand) {
        // 展开/折叠
        this[isExpand] = !this[isExpand]
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          'tree',
          tree,
          this.$refs[tree],
          isExpand
        )
        const nodes = this.$refs[tree].store._getAllNodes()
        dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue', nodes)
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
      ...mapMutations({}),
      change(e) {
        dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue', e)
        if (e) {
          $('.el-tree').css({
            height: '300px',
            display: 'block',
            'overflow-x': 'auto',
          })
        }
      },
      getMenu() {
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          'this.Menu',
          this.Menu
        )
        this.menusTreeloading = true
        this.data = []
        this.dataMenus = []
        if (this.Menu) {
          const results = this.Menu
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
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            'this.dataMenus',
            this.dataMenus
          )
          this.handleNodeClick(this.roleTree[0])
        }
        this.menusTreeloading = false
      },
      diguiquchu(datas, arr, v, needdelarr) {
        // 递归找出半选中的数据
        arr.map((item) => {
          //dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue',item.key, v, "----------");
          if (item.key == v && item.children.length > 0) {
            // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
            needdelarr.push(v)
            this.diguiquchu(datas, item.children, v, needdelarr)
          } else if (item.key != v && item.children.length > 0) {
            this.diguiquchu(datas, item.children, v, needdelarr)
          }
        })
      },
      add() {
        this.$router.push({
          path: 'roles/editroles',
          query: {
            insert: 0,
          },
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //给role添加acl权限
      addacl() {
        this.$get_object('_Role', this.objectId).then((object) => {})
      },
      //关闭菜单弹窗
      handleClose() {
        this.dialogVisible = false
      },
      //删除角色
      async handleDelete(row) {
        const params = {
          name: row.name,
        }
        const { users } = await queryRoledepartment(params)
        if (users.length > 0) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '请先删除该角色下的用户',
          })
          return
        } else {
          this.$confirm(
            this.$translateTitle(
              'user.This operation will permanently delete this role, do you want to continue?'
            ),
            this.$translateTitle('user.prompt'),
            {
              confirmButtonText: this.$translateTitle('developer.determine'),
              cancelButtonText: this.$translateTitle('developer.cancel'),
              type: 'warning',
            }
          )
            .then(() => {
              this.delConfirm(row.objectId)
            })
            .catch(() => {})
        }
      },
      // 二次确认删除
      async delConfirm(objectId) {
        let res = await delRole(objectId)
        if (res) {
          this.$message({
            showClose: true,
            duration: 2000,
            message: `${this.$translateTitle('user.successfully deleted')}`,
            type: 'success',
          })
          this.getRolesList()
          this.$dgiotBus.$emit('asyncTreeData')
          this.getMenu()
        }
      },
      //增加菜单
      addmenu(row) {
        //dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue',row)
        this.rolename = row.attributes.name

        // this.dialogVisible = true;
        this.getMenu()
        this.$dgiotBus.$emit('asyncTreeData')
      },
      tableRowClassName({ row, rowIndex }) {
        //把每一行的索引放进row

        row.index = rowIndex
      },
      selectedHighlight({ row, rowIndex }) {
        if (this.currentSelectIndex === rowIndex) {
          return {
            // "background-color": "#409EFF",
            color: '#409EFF',
            'font-weight': 'bold',
            // border: "5px solid black"
          }
        }
      },
      async getDetailmenu(row, column, event, cell) {
        console.log(row)
        this.editRow = row
        this.roleList.forEach((roles) => {
          roles.disabled = true
        })
        row.disabled = false
        if (column && column.label == '操作') {
          return
        }

        this.loadingService = this.$loading({
          lock: true,
          text: this.$translateTitle('developer.Data is loading') + '...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.6)',
        })

        this.currentSelectIndex = row.index
        const { menus, rules, roles, users, objectId } = await roleMenu(
          row.name
        )
        this.roleItem = {
          menus: menus,
          rules: rules,
          users: users,
          roles: roles,
          objectId: objectId,
        }
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          ' this.roleItem',
          this.roleItem
        )
        this.loadingService.close()
        if (menus && rules) {
          this.checkMenus = menus
          this.checkRoles = rules
          this.hashKey = row.objectId
          this.roleMenuList = []
          this.rolePermissonList = []

          this.Menu.map((items) => {
            this.checkMenus.map((mentItem) => {
              if (items.name == mentItem.name)
                // this.roleMenuList.push(items.objectId)
                this.$nextTick(() => {
                  this.$refs.menusTree.setChecked(items.objectId, true, false)
                })
            })
          })
          this.Permission.map((items) => {
            this.checkRoles.map((mentItem) => {
              if (items.name === mentItem.name)
                this.$nextTick(() => {
                  this.$refs.permissionTree.setChecked(
                    items.objectId,
                    true,
                    false
                  )
                })
            })
          })
          // this.$refs.menusTree.setCheckedKeys([]);
          // this.$refs.permissionTree.setCheckedKeys([]);
          //
          // this.doSetChecked(this.roleMenuList, this.rolePermissonList)
        } else {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '获取角色菜单失败',
          })
        }
      },
      doSetChecked(checkMenus, checkRoles) {
        //dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue',"this.Menu", this.Menu)
        //dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue',"this.checkMenus", this.checkMenus)
        //dgiotlog.log('src/views/MultiTenant/roles/list/roles.vue',"this.roleMenuList", this.roleMenuList)
        // set ###
        // this.$refs.menusTree.setCheckedKeys(this.roleMenuList)

        checkMenus.forEach((value) => {
          console.error(this.roleMenuList)
          this.$refs.menusTree.setChecked(value, true, false)
        })
        // set ###
        // this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList)
        checkRoles.forEach((value) => {
          this.$refs.permissionTree.setChecked(value, true, false)
        })
      },

      //初始化权限列表
      async getRolesList(start, dataR) {
        if (start == 0) {
          this.start = 0
        }
        // fix https://gitee.com/dgiiot/dgiot/issues/I4TRI7
        let where = {}
        this.search ? (where.name = { $regex: this.search }) : ''
        if (dataR && dataR.name != 'admin') {
          where.objectId = dataR.objectId
        }
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })
        let params = {
          skip: this.start,
          limit: this.pagesize,
          order: '-createdAt',
          keys: 'name,objectId,alias',
          include: 'views',
          excludeKeys: 'menus,rules,users,roles',
          where: where,
          count: 'objectId',
        }
        let { results, count } = await queryRole(params)
        results.forEach((role) => {
          role.disable = true
        })
        if (results) {
          loading.close()
          this.roleList = results
          this.total = count
        }
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.getRolesList()
      },
      handleCurrentChange(val) {
        this.start = Number(val - 1) * Number(this.pagesize)
        this.getRolesList()
      },
      handleCheckChange(data, checked) {
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          data,
          checked
        )
      },
      // 获取权限
      getRoleschema() {
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          'this.Permission',
          this.Permission
        )
        this.permissionTreeloading = true
        this.dataPermissions = []
        if (this.Permission) {
          const results = this.Permission
          results.map((items) => {
            var obj = {}
            obj.label = items.alias
            obj.alias = items.name
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.dataPermissions.push(obj)
          })
        }
        this.permissionTreeloading = false
      },
      getCheckedKeys(data, keys, key) {
        var res = []
        recursion(data, false)
        return res

        // arr -> 树形总数据
        // keys -> getCheckedKeys获取到的选中key值
        // isChild -> 用来判断是否是子节点
        function recursion(arr, isChild) {
          var aCheck = []
          for (var i = 0; i < arr.length; i++) {
            var obj = arr[i]
            aCheck[i] = false

            if (obj.children) {
              aCheck[i] = recursion(obj.children, true) ? true : aCheck[i]
              if (aCheck[i]) {
                res.push(obj)
              }
            }

            for (var j = 0; j < keys.length; j++) {
              if (obj[key] == keys[j]) {
                aCheck[i] = true
                if (res.indexOf(obj[key]) == -1) {
                  res.push(obj)
                }
                break
              }
            }
          }
          if (isChild) {
            return aCheck.indexOf(true) != -1
          }
        }
      },
      // 修改角色权限
      async exportRolerole(row) {
        let checkmenu = []
        let selectMenu = this.getCheckedKeys(
          this.menuTreeData,
          this.$refs.menusTree.getCheckedKeys(),
          'objectId'
        ) // 选中子级时选中父级
        // let selectMenu = this.$refs.menusTree.getCheckedNodes()  // 只选中子级
        let usersList = []
        let rolesList = []
        let checkrole = []
        let selectRermission = this.$refs.permissionTree.getCheckedNodes()
        let rolesData = this.roleItem.roles
        let usersData = this.roleItem.users

        if (!usersData || !rolesData) {
          this.$baseMessage(
            `${this.$translateTitle(
              'user.The correct role permissions and menus are not selected'
            )}`,
            'error',
            'dgiot-hey-message-error'
          )
          return false
        }
        usersData.forEach((item) => {
          usersList.push(item.username)
        })
        rolesData.forEach((item) => {
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            'lodash',
            _.assign(...rolesData)
          )
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            'item',
            item
          )
          rolesList.push(item.name)
        })
        if (selectMenu && selectRermission) {
          selectMenu.forEach((item) => {
            checkmenu.push(item.label)
          })
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            'selectMenu',
            checkmenu
          )
          selectRermission.forEach((item) => {
            checkrole.push(item.alias)
          })
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            'selectRermission',
            checkrole
          )
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            row,
            'row',
            row
          )
          dgiotlog.log(
            'src/views/MultiTenant/roles/list/roles.vue',
            _.uniq(checkrole)
          )
          if (_.uniq(checkrole).length == 0 || _.uniq(checkmenu) == 0) {
            this.$message.warning(
              `${this.$translateTitle(
                'user.It is forbidden to set permissions/menus to empty'
              )}`
            )
            return false
          }
          // lodash uniq 去重，否则则报错 https://blog.csdn.net/qq_38519358/article/details/103330249
          await saveRole({
            objectId: this.roleItem.objectId,
            rules: _.uniq(checkrole),
            menus: _.uniq(checkmenu),
          })
            .then((res) => {
              if (res) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: `${this.$translateTitle(
                    'user.Role information updated successfully'
                  )}`,
                  type: 'success',
                })
              } else {
                this.$baseMessage(
                  `${this.$translateTitle(
                    'user.Role information updated failed'
                  )}`,
                  'error',
                  'dgiot-hey-message-error'
                )
              }
            })
            .catch((e) => {
              this.$baseMessage(
                `${this.$translateTitle(
                  'user.Role information updated successfully'
                )}` + `${e}`,
                'error',
                'dgiot-hey-message-error'
              )
            })
        } else {
          this.$baseMessage(
            `${this.$translateTitle(
              'user.Please select the menu list and permission list'
            )}`,
            'info',
            'dgiot-hey-message-error'
          )
        }
      },
      // 保存模板
      async exportRoletemp(row) {
        const res = await saveRoletemp(row.name)
        if (res) {
          this.$message({
            showClose: true,
            duration: 2000,
            message: `${this.$translateTitle(
              'user.Save the template successfully'
            )}`,
            type: 'success',
          })
        }
      },
      updaterole() {
        const params = {
          alias: this.form.alias,
          desc: this.form.desc,
        }
        this.$update_object(this.editroleid, params).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: `${this.$translateTitle('user.update completed')}`,
            type: 'success',
          })
          this.roleEdit = false
          this.getRolesList()
        })
      },
      handleNodeClick(data) {
        this.treeDataValue = data.label
        this.queryForm.workGroupName = data.label
        $('.workGroup').css({
          height: '0px',
          display: 'none',
          'overflow-x': 'auto',
        })
        $('.el-select-dropdown').css({ display: 'none' })
        this.curDepartmentId = data.objectId

        // 清除选中的角色

        this.currentSelectIndex = null
        this.getRolesList(0, data)
        // 清除菜单树

        // this.dataMenus = []
      },
      // 添加子节点
      appendChildTree(data) {
        dgiotlog.log(
          'src/views/MultiTenant/roles/list/roles.vue',
          data,
          '添加子节点'
        )
      },
      // renderContent(h, { node, data, store }) {
      //   return (
      //     <span class="custom-tree-node">
      //       <span>{node.label}</span>
      //       <span>
      //         <el-button
      //           size="mini"
      //           type="text"
      //           on-click={() => this.appendChildTree(data)}
      //         >
      //           <i class="el-icon-plus" />
      //         </el-button>
      //       </span>
      //     </span>
      //   )
      // },
      // 显示弹窗
      setDialogRole(data) {
        this.deptData = data
        // this.$store.commit("set_DeptObj", data);
        // this.$dgiotBus.$emit("set_DeptObj", data)
        this.centerDialogRole = true
        // this.$nextTick(() => {
        //   this.$refs['addRoleRef'].getData(data)
        // })
      },
      closeDialogRole() {
        this.centerDialogRole = false
      },
    },
  }
</script>
<style lang="scss" scoped>
  .roles {
    background: #ffffff;

    .top span {
      width: 100px;
      margin: 0 auto;
      text-align: center;
    }

    ::v-deep .el-table__body tr.current-row > td {
      color: #f19944;
      background-color: #fdf3ea;
    }

    .rightTable {
      max-height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
      overflow-x: hidden;
      overflow-y: scroll;

      .search {
        text-align: center;
      }

      .rightPagination {
        margin: 10px;
        text-align: center;
      }
    }
  }

  .rolefooter {
    display: flex;
    width: 100%;
    height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
    //height: auto;
    margin-top: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .footerleft,
  .footerright {
    box-sizing: border-box;
    width: 45%;
    height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
    padding: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    border: 1px solid #cccccc;
  }

  .footerright {
    margin-left: 5%;
  }

  .rolefooter .top {
    height: 50px;
    border-bottom: 1px solid #cccccc;
  }

  .rolefooter .top span {
    float: left;
    line-height: 50px;
  }

  .rolefooter .top button {
    float: right;
  }
</style>
<style lang="scss">
  .roles .search .el-input {
    width: 200px;
  }

  .leftTree {
    height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
    overflow-x: hidden;
    overflow-y: scroll;

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
