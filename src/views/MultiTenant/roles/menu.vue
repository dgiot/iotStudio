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
          <el-table-column
            align="center"
            fixed
            :label="$translateTitle('product.title')"
            width="200"
          >
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
          />
          <el-table-column
            align="center"
            :label="$translateTitle('developer.path')"
            prop="url"
            show-overflow-tooltip
            width="220"
          />
          <el-table-column
            align="center"
            :label="$translateTitle('menu.sort')"
            prop="orderBy"
            sortable
          />
          <el-table-column
            align="center"
            :label="'vue ' + $translateTitle('developer.filepath')"
            show-overflow-tooltip
            width="400"
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
            width="200"
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
            :width="200"
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
          <el-table-column
            align="center"
            fixed="right"
            :label="$translateTitle('developer.operation')"
            width="220px"
          >
            <template #default="{ row }">
              <el-button
                icon="el-icon-plus"
                size="mini"
                :title="$translateTitle('menu.childrenmenu')"
                type="primary"
                @click="handleEdit(row, 'addChildMenu')"
              />
              <el-button
                icon="el-icon-edit"
                size="mini"
                :title="$translateTitle('developer.edit')"
                type="success"
                @click="handleEdit(row, 'editMenu')"
              />
              <el-button
                icon="el-icon-delete"
                size="mini"
                :title="$translateTitle('developer.delete') + row.meta.title"
                type="danger"
                @click="handleDelete(row)"
              />
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
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import Edit from './components/MenuManagementEdit'
  import { utc2beijing } from '@/utils'
  import { queryMenu } from '@/api/Menu/index'
  import { ExportParse, ImportParse } from '@/api/Export'

  export default {
    name: 'TreeTableDemo',
    components: { Edit },
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
      }
    },
    computed: {
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.data))
        var Tree = [] // 对源数据深度克隆
        Tree = cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parent
          ) // 返回每一项的子级数组
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
    mounted() {
      this.fetchData()
      this.originmenuurl = []
      this.getoriginmenu(this.$router.options.routes)
      this.getRole()
    },
    methods: {
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
          this.$message.error(`${error}`)
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
            this.$message.error(`${error}`)
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
              this.fetchData()
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
      async fetchData() {
        this.data = []
        this.listLoading = true
        const { results } = await queryMenu({})
        results.map((item) => {
          var obj = {}
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
          } = items
          var obj = {}
          obj.name = name
          obj.meta = meta
          obj.objectId = objectId
          obj.icon = icon
          obj.parent = parent.objectId
          obj.createtime = utc2beijing(createdAt)
          obj.orderBy = orderBy
          obj.url = url

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
