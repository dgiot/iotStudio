<template>
  <div class="menu dgiot-container">
    <el-row>
      <el-col :lg="24" :md="24" :sm="2244" :xl="24" :xs="24">
        <dgiot-query-form>
          <dgiot-query-form-top-panel :span="12">
            <div class="search">
              <el-button
                icon="el-icon-s-tools"
                size="mini"
                type="primary"
                @click="toggleExpandAll(isdefaultExpandAll)"
              >
                <!-- 展开/收起菜单 -->
                {{ $translateTitle('product.Expandcollapsemenu') }}
              </el-button>
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="info"
                @click="handleEdit({}, 'one')"
              >
                <!-- 新增一级菜单 -->
                {{ $translateTitle('product.Newfirstlevelmenu') }}
              </el-button>
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="success"
                @click="centerUploadBox('Importmenu')"
              >
                <!-- 导入菜单 -->
                {{ $translateTitle('product.Importmenu') }}
              </el-button>
              <el-button
                icon="el-icon-upload"
                size="mini"
                type="warning"
                @click="centerUploadBox('Export')"
              >
                <!-- 导出菜单 -->
                {{ $translateTitle('product.Export menu') }}
              </el-button>
              <el-button size="mini" type="primary" @click="fetchData">
                刷新
              </el-button>
              <input
                v-show="false"
                id="fileExport"
                ref="inputer"
                type="file"
                value="上传菜单"
                @change="handleFileChange"
              />
              <!-- <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">新增一级菜单</el-button> -->
            </div>
          </dgiot-query-form-top-panel>
        </dgiot-query-form>
        <el-table
          v-if="refreshTable"
          v-loading="listLoading"
          border
          :data="treeData"
          :default-expand-all="isdefaultExpandAll"
          :default-sort="{ prop: 'order', order: 'ascending' }"
          :height="tableHeight"
          row-key="objectId"
          size="mini"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column align="center" fixed label="标题" width="200">
            <template #default="{ row }">
              <span>
                {{ row.meta.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('user.name')"
            prop="name"
            width="auto"
          />
          <el-table-column
            align="center"
            label="所属部门"
            prop="ACL"
            show-overflow-tooltip
            sortable
            :width="160"
          >
            <template #default="{ row }">
              <el-tag
                v-for="(item, index) in getAcl(row.ACL)"
                :key="index"
                effect="plain"
                :type="item"
              >
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.path')"
            prop="url"
            show-overflow-tooltip
            width="200"
          />
          <el-table-column
            align="center"
            :label="$translateTitle('menu.sort')"
            prop="orderBy"
            sortable
            width="80"
          />
          <el-table-column
            align="center"
            :label="'vue ' + $translateTitle('developer.filepath')"
            show-overflow-tooltip
            width="350"
          >
            <template #default="{ row }">
              <span>
                {{ row.meta.component.replace('src', '@').replace('.vue', '') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('developer.redirect')"
            show-overflow-tooltip
            width="180"
          >
            <template #default="{ row }">
              <span>
                {{ row.meta.redirect }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$translateTitle('task.Advancedconfiguration')"
            show-overflow-tooltip
            :width="100"
          >
            <template #default="{ row }">
              <el-popover placement="top" trigger="hover">
                <p>
                  <!-- 是否隐藏： -->
                  {{ $translateTitle('product.Hideornot') + ':' }}
                  <el-tag
                    :title="$translateTitle('product.Hideornot')"
                    type="success"
                  >
                    {{
                      row.meta.hidden
                        ? $translateTitle('product.yes')
                        : $translateTitle('product.no')
                    }}
                  </el-tag>
                </p>
                <p>
                  <!-- 当前路由是否可关闭多标签页： -->
                  {{
                    $translateTitle(
                      'product.Whetherthecurrentroutecanclosemultipletabs'
                    ) + ':'
                  }}
                  <el-tag
                    v-if="row.meta"
                    :title="
                      $translateTitle(
                        'product.Whetherthecurrentroutecanclosemultipletabs'
                      )
                    "
                    type="info"
                  >
                    {{
                      row.meta.noClosable
                        ? $translateTitle('product.yes')
                        : $translateTitle('product.no')
                    }}
                  </el-tag>
                </p>
                <p>
                  <!-- 是否无缓存： -->
                  {{ $translateTitle('product.Nocache') + ':' }}
                  <el-tag
                    v-if="row.meta"
                    :title="$translateTitle('product.Nocache')"
                  >
                    {{
                      row.meta.noKeepAlive
                        ? $translateTitle('product.yes')
                        : $translateTitle('product.no')
                    }}
                  </el-tag>
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">
                    <dgiot-icon v-if="row.meta.icon" :icon="row.meta.icon" />
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="低代码" width="200">
            <template #default="{ row }">
              <el-button
                v-if="row.meta.isAmis == true"
                size="mini"
                title="绑定低代码表单"
                type="primary"
                @click="dynamicForm(row)"
              >
                绑定
              </el-button>
              <el-button
                v-if="row.meta.isAmis == true && row.meta.viewid"
                type="info"
                @click="handleLowCode(row)"
              >
                {{ $translateTitle('application.preview') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            :label="$translateTitle('developer.operation')"
            width="auto"
          >
            <template #default="{ row }">
              <el-button
                size="mini"
                :title="$translateTitle('menu.childrenmenu')"
                type="primary"
                @click="handleEdit(row, 'addChildMenu')"
              >
                添加
              </el-button>
              <el-button
                size="mini"
                :title="$translateTitle('developer.edit')"
                type="success"
                @click="handleEdit(row, 'editMenu')"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                :title="$translateTitle('developer.delete') + row.meta.title"
                type="danger"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
              <el-button
                size="mini"
                :title="$translateTitle('developer.delete') + row.meta.title"
                type="warning"
                @click="showTree(row, row.objectId, row.ACL)"
              >
                迁移
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
              "
            />
          </template>
        </el-table>
      </el-col>
    </el-row>
    <!-- 迁移 -->
    <el-dialog
      :append-to-body="true"
      top="5vh"
      :visible.sync="popoverVisible"
      width="40vh"
    >
      <div class="deviceTree">
        <p style="text-align: center; font-size: 18px">迁移:</p>
        <el-tree
          accordion
          :data="roleTree"
          :expand-on-click-node="false"
          node-key="index"
          :props="roleProps"
        >
          <!-- @node-click="handleNodeClick" -->
          <!-- eslint-disable-next-line -->
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <span
              :class="{
                selected: data.objectId == curDepartmentId,
              }"
              @click="transferAcl(data)"
            >
              {{ node.label }}
            </span>
          </div>
        </el-tree>
      </div>
    </el-dialog>
    <!-- 绑定 -->
    <el-drawer
      v-drawerDrag
      append-to-body
      size="90%"
      :visible.sync="bindvisible"
    >
      <dgiot-views
        ref="dgiotView"
        :bind-row="editRow"
        :class-disable="true"
        :type="'menu'"
        :view-form="viewForm"
        @BusRole="BusRole"
        @bindamismenu="bindAmisMenu"
      />
    </el-drawer>
    <edit ref="edit" :viewlist="ViewList" @fetch-data="fetchData" />
    <lowcodeDesign ref="lowcodeDesign" @objectId="lowcodeId" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Edit from './components/MenuManagementEdit'
  import { utc2beijing } from '@/utils'
  import { queryMenu, putMenu } from '@/api/Menu/index'
  import { ExportParse, ImportParse } from '@/api/Export'
  import { queryView, getView } from '@/api/View'
  import dgiotViews from '@/views/CloudFunction/lowcode'
  import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
  export default {
    name: 'TreeTableDemo',
    components: { Edit, dgiotViews, lowcodeDesign },
    data() {
      return {
        tableHeight: this.$baseTableHeight(0) + 46,
        refreshTable: 'false',
        isdefaultExpandAll: false,
        MenuForm: {
          name: '',
          url: '',
          // switch:false,
          roles: [],
          number: '',
          fathername: [],
        },
        list: [],
        listLoading: true,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        props: {
          value: 'objectId',
          label: 'name',
          children: 'children',
        },
        options: [],
        formLabelWidth: '120px',
        defaultExpandAll: true,
        showCheckbox: true,
        key: 1,
        columns: [
          {
            label: 'Menu name',
            key: 'name',
            expand: true,
            align: 'left',
          },
          {
            label: 'Menu path',
            key: 'url',
            width: 200,
            expand: true,
            align: 'center',
          },
          {
            label: 'Navigation',
            key: 'showtopmenu',
            expand: true,
            align: 'center',
          },
          {
            label: 'Index',
            key: 'number',
            expand: true,
            width: 100,
          },
          {
            label: 'Icon',
            key: 'icon',
            expand: true,
            width: 100,
          },
          {
            label: 'Created Time',
            key: 'createtime',
            align: 'center',
          },
          {
            label: 'Operation',
            key: 'operation',
            width: 400,
          },
        ],
        search: '',
        dialogVisible: false,
        tableData: [],
        form: {
          name: '',
          resource: '菜单',
          topname: '',
          menuroad: '',
          iconfont: '',
          number: '',
        },
        parent: '',
        current: '',
        parentmenu: [
          {
            id: '0',
            attributes: {
              name: '顶级菜单',
            },
          },
        ],
        originacl: [],
        menuid: '',
        originmenuurl: [],
        isaddmenu: true,
        file: '',
        inputDOM: '',
        size: '',
        formData: '',
        ViewList: [],
        changerow: {},
        popoverVisible: false,
        curDepartmentId: '',
        roleProps: {
          children: 'children',
          label: 'name',
        },
        bindvisible: false,
        editRow: {},
        viewForm: {
          class: '',
          flag: 'Amis',
          type: 'Amis',
          title: '',
          key: '',
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
          disabled: false,
          hiddenRow: [],
        },
        lowcodeId: '',
      }
    },

    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
      }),
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.data))
        var Tree = [] // 对源数据深度克隆
        Tree = cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parent
          ) // 返回每一项的子级数组
          // console.log('branchArr', branchArr)
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          father.parent == 0 ? (father.parent = '0') : ''
          return father.parent == 0 // 返回第一层
        })
        return Tree
        // return [
        //   {
        //     name: '一级菜单',
        //     objectId: '0',
        //     children: Tree,
        //   },
        // ]
      },
    },
    watch: {
      showCheckbox(val) {
        if (val) {
          this.columns.unshift({
            label: 'Checkbox',
            checkbox: true,
          })
        } else {
          this.columns.shift()
        }
        this.reset()
      },
    },
    async mounted() {
      let param = {
        count: 'objectId',
        order: 'createdAt',
        excludeKeys: 'data',
        skip: 0,
        where: {
          flag: { $regex: 'Amis' },
          type: {
            $regex: 'Amis',
          },
        },
      }
      let ViewList = await queryView(param)
      console.log('screenViewList', ViewList)
      this.ViewList = ViewList.results
      this.fetchData()
      this.originmenuurl = []
      this.getoriginmenu(this.$router.options.routes)
      this.getRole()
    },
    methods: {
      async handleLowCode(row) {
        localStorage.setItem('parse_objectid', row.meta.viewid)
        const loading = this.$baseColorfullLoading(1)
        loading.close()
        this.$dgiotBus.$emit('lowcodePreview', await getView(row.meta.viewid))
      },
      async bindAmisMenu(amisrow, menurow) {
        console.log(amisrow, menurow)
        menurow.meta.viewid = amisrow.objectId
        menurow.url = `/amis/View/${amisrow.objectId}`
        menurow.meta.component = `@/views/CloudOc/AmisPage/index`
        menurow.meta.isAmis = true
        const loading = this.$baseColorfullLoading(1)

        // return
        let params = JSON.parse(JSON.stringify(menurow))
        delete params.createtime
        delete params.objectId
        delete params.ACL
        delete params.parent
        // console.log('menurow', menurow, 'amisrow', params)
        // return
        await putMenu(menurow.objectId, params)
        console.log('修改行', params, menurow)
        this.editRow = menurow
        loading.close()
        this.$message({
          showClose: true,
          type: 'success',
          message: '绑定成功',
        })
      },
      BusRole() {},
      async dynamicForm(form) {
        // console.log(form)
        // await this.querySelectRow(form)
        // console.log(this.selectRow)
        this.editRow = form
        // 查找view类型id为当前角色id的
        console.log(form)
        // this.viewForm.key = form.objectId
        this.bindvisible = true
        this.$nextTick(() => {
          this.$refs.dgiotView.fetchData()
          console.log(this.$refs.dgiotView)
        })
      },
      // 获取部门
      getAcl(ACL) {
        let name = []
        for (let a in ACL) {
          if (a == '*') {
            delete ACL[a]
          } else if (a.split(':')[1]) {
            name.push(a.split(':')[1])
          }
        }
        return name
      },
      // 迁移菜单
      transferAcl(data) {
        const aclKey1 = 'role' + ':' + data.name
        const aclObj = {}
        aclObj[aclKey1] = {
          read: true,
          write: true,
        }
        const parmas = {
          ACL: aclObj,
        }
        this.$confirm(
          this.$translateTitle(`确定要将该菜单迁移到` + data.name + '吗'),
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(async () => {
          console.log(
            'this.changerow.objectId, parmas',
            this.changerow.objectId,
            parmas
          )
          // return
          await putMenu(this.changerow.objectId, parmas)
          this.$message({
            showClose: true,
            type: 'success',
            message: this.$translateTitle(`迁移成功`),
          })
          this.popoverVisible = false
          this.fetchData()
        })
        dgiotlog.log(data.name)
      },
      // 弹出迁移弹窗
      showTree(row, objectId, acl) {
        this.changerow = row
        this.deciceCompany = acl
        this.popoverVisible = !this.popoverVisible
      },
      toggleExpandAll(flag) {
        this.refreshTable = false
        this.isdefaultExpandAll = !flag
        this.$nextTick(() => {
          this.refreshTable = true
        })
      },
      handleNodeClick() {
        this.fetchData()
      },
      SelectTopmenu(val) {
        dgiotlog.log(val)
      },
      getoriginmenu(menu) {
        menu.map((items) => {
          if (!items.hidden && items.path) {
            if (items.path != '/') {
              var obj = {}
              obj.path = items.path
              obj.name = items.name
              this.originmenuurl.push(obj)
            }
            if (items.children) {
              this.getoriginmenu(items.children)
            }
          }
        })
      },
      // 调用input file
      centerUploadBox(type) {
        if (type == 'Importmenu') {
          this.$refs.inputer.click()
        } else {
          this.exportMenu()
        }
      },
      async exportMenu() {
        const loading = this.$baseColorfullLoading(2)
        try {
          const res = await ExportParse('Menu', {})
          dgiotlog.log(res, 'res')
          loading.close()
          this.$convertRes2Blob(res)
          // this.$message.success(`${res}`)
        } catch (error) {
          loading.close()
          this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
        }
        loading.close()
      },
      // 真正的文件上传
      async handleFileChange(e) {
        this.inputDOM = this.$refs.inputer
        if (!/\.zip$/.test(this.inputDOM.files[0].name)) {
          this.$message({
            showClose: true,
            duration: 2000,
            type: 'warning',
            message: '仅支持zip文件',
          })
          return false
        } else {
          this.file = this.inputDOM.files[0] // 通过DOM取文件数据
          const loading = this.$baseColorfullLoading(3)
          try {
            const res = await ImportParse('Menu', this.file)
            loading.close()
            dgiotlog.log('eresresrror', res)
            this.$message({
              type: 'success',
              message: '菜单导入成功',
              showClose: true,
            })
            setTimeout(() => {
              this.file = ''
              this.inputDOM = ''
              this.size = ''
              this.formData = ''
              this.fetchData()
            }, 1500)
          } catch (error) {
            loading.close()
            this.$message({
              type: 'error',
              message: '菜单导入失败' + error,
            })
            dgiotlog.log('error', error)
            this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
          }
          loading.close()
        }
      },

      reset() {
        ++this.key
      },
      click(scope) {
        const row = scope
        const message = Object.keys(row)
          .map((i) => {
            return `<p>${i}: ${row[i]}</p>`
          })
          .join('')
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: message,
          type: 'success',
        })
      },
      getParent(data2, nodeId2, arrRes) {
        data2.map((items) => {
          if (items.objectId == nodeId2) {
            arrRes.push(items.objectId)
            this.getParent(data2, items.parent, arrRes)
          } else if (items.parent == 0 && items.objectId == nodeId2) {
            arrRes.push(items.objectId)
          }
        })
        if (arrRes.length >= 1 && arrRes[0] != 0) {
          arrRes.unshift('0')
        }
        //  dgiotlog.log(arrRes)
        return arrRes
      },
      // 删除菜单
      handleDelete(row) {
        if (!row.children) {
          this.$del_object('Menu', row.objectId).then((res) => {
            if (res.error) {
              this.$message({
                type: 'error',
                message: '删除失败!',
              })
            } else {
              this.$message({
                showClose: true,
                duration: 2000,
                type: 'success',
                message: '删除成功!',
              })
              this.data.forEach((item, index) => {
                if (row.objectId == item.objectId) {
                  this.data.splice(index, 1)
                }
              })
              // this.fetchData()
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请先删除此菜单中的子菜单!',
          })
        }
      },
      searchvalue() {},
      handleClose() {
        this.dialogVisible = false
      },
      handleEdit(row, type) {
        this.$refs['edit'].showEdit(row, type)
      },
      // handleDelete(row) {
      //   if (row.path) {
      //     this.$baseConfirm('你确定要删除当前项吗', null, async () => {
      //       const { msg } = await doDelete({ paths: row.path })
      //       this.$baseMessage(msg, 'success', false, 'dgiot-hey-message-success')
      //       await this.fetchData()
      //     })
      //   }
      // },
      async fetchData(type = '') {
        // if (type == 'edit') {
        //   return
        // } else
        if (type && type.objectId) {
          type.createtime = utc2beijing(type.createdAt)
          delete type.createdAt
          type.parent = type.parent.objectId
          console.log('添加', type)
          this.data.push(type)
          return
        }
        this.data = []
        this.listLoading = true
        const { results } = await queryMenu({})
        results.map((item) => {
          var obj = {}
          obj.ACL = item.ACL
          obj.objectId = item.objectId
          obj.alias = item.alias
          obj.name = item.name
          this.options.push(obj)
        })
        results.map((items) => {
          const {
            meta = {},
            name,
            objectId,
            icon,
            parent,
            createdAt,
            orderBy,
            url,
            ACL,
          } = items
          var obj = {}
          obj.ACL = ACL
          obj.name = name
          obj.meta = meta
          obj.objectId = objectId
          obj.icon = icon
          obj.parent = parent.objectId
          obj.createtime = utc2beijing(createdAt)
          obj.orderBy = orderBy
          obj.url = url
          console.log('obj111111', obj)
          this.data.push(obj)
        })

        this.listLoading = false
      },
    },
  }
</script>

<style scoped>
  .menu {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    background: #ffffff;
  }

  .option-item {
    display: inline-block;
    margin-right: 15px;
  }

  .menu .search .el-input {
    width: 200px;
  }

  .menu .el-cascader .el-input {
    width: 300px;
  }
</style>
