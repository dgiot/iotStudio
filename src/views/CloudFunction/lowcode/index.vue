<template>
  <div class="comprehensive-table-container">
    <dgiot-query-form>
      <dgiot-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="49px"
          :model="queryForm"
          size="mini"
        >
          <el-form-item
            :label="$translateTitle('product.Bind Table Name')"
            label-width="80px"
          >
            <el-select
              v-model="queryForm.class"
              allow-create
              clearable
              default-first-option
              :disabled="$route.query?.id?.length > 0"
              filterable
              size="mini"
              @change="changeClass"
            >
              <el-option
                v-for="item in DbaTable"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; font-size: 13px; color: #8492a6">
                  {{ item.value }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单Id" label-width="60px">
            <el-select
              v-model="queryForm.key"
              allow-create
              clearable
              default-first-option
              filterable
              size="mini"
              style="width: 100%"
              @change="fetchData()"
            >
              <el-option
                v-for="item in keys"
                :key="item.objectId"
                :label="item.objectId"
                :value="item.objectId"
              >
                <span style="float: left">{{ item.objectId }}</span>
                <span style="float: right; font-size: 13px; color: #8492a6">
                  <!--兼容所有表明的提示-->
                  {{
                    item.description ||
                    item.name ||
                    item.title ||
                    item.username ||
                    item.type
                  }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('product.title')">
            <el-input v-model="queryForm.title" />
          </el-form-item>
          <el-form-item label="渲染框架" label-width="80px">
            <el-select
              v-model="queryForm.flag"
              allow-create
              clearable
              default-first-option
              filterable
              style="width: 100%"
              @change="changeFlag"
            >
              <el-option
                v-for="item in flags"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; font-size: 13px; color: #8492a6">
                  {{ item.value }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('rule.Typetemplate')"
            label-width="80px"
          >
            <el-select
              v-model="queryForm.type"
              allow-create
              clearable
              default-first-option
              :disabled="viewForm.notification"
              filterable
              style="width: 100%"
              @change="fetchData()"
            >
              <el-option
                v-for="item in Types"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; font-size: 13px; color: #8492a6">
                  {{ item.value }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$translateTitle('home.language')">
            <el-select
              v-model="queryForm.language"
              allow-create
              clearable
              default-first-option
              filterable
              style="width: 100%"
              @change="fetchData()"
            >
              <el-option
                v-for="item in lang"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="id">
            <el-input v-model="queryForm.objectId" size="mini" />
          </el-form-item> -->
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd" />
            <el-button
              icon="el-icon-search"
              type="success"
              @click="fetchData()"
            />
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      border
      :data="list"
      :height="$baseTableHeight(0)"
    >
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        width="55"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="视图ID"
        prop="objectId"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('title')"
        align="center"
        :label="$translateTitle('product.title')"
        prop="title"
        show-overflow-tooltip
        width="200px"
      >
        <template #default="{ row }">
          <el-form :model="row">
            <el-form-item size="mini" style="margin-bottom: 0">
              <el-input
                v-if="row.isEdit"
                v-model="row.title"
                v-focus
                size="mini"
                @blur="blurEvent(row)"
                @focus="row.oldTitle = row.title"
              />
              <p
                v-else
                style="float: left; height: 8px; margin-left: 15px"
                v-html="row.title"
              />
              <i
                v-show="!row.isEdit"
                class="el-icon-edit"
                style="float: right; line-height: 26px; cursor: pointer"
                @click="row.isEdit = !row.isEdit"
              ></i>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="所属部门"
        prop="ACL"
        show-overflow-tooltip
        sortable
        width="auto"
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
        v-show="!queryForm.hiddenRow.includes('class')"
        align="center"
        :label="$translateTitle('product.Table Name')"
        prop="class"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        label="表名Id"
        prop="key"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('rule.Typetemplate')"
        prop="type"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('createdAt')"
        align="center"
        :label="$translateTitle('application.createtime')"
        prop="createdAt"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        label="渲染框架"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row, $index }">
          <Select v-model="row.flag" @on-change="switchflag(row)">
            <Option
              v-for="item in flags"
              :key="item.value"
              :placement="$index == 0 ? 'top-start' : 'bottom-start'"
              style="z-index: 999"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('home.language')"
        show-overflow-tooltip
        width="140"
      >
        <template #default="{ row, $index }">
          <Select v-model="row.language" @on-change="switchlanguage(row)">
            <Option
              v-for="item in lang"
              :key="item.value"
              :placement="$index == 0 ? 'top-start' : 'bottom-start'"
              style="z-index: 999"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('node.operation')"
        show-overflow-tooltip
        width="360"
      >
        <template #default="{ row }">
          <el-button
            v-show="type == 'menu' && row.objectId != bindRow.meta.viewid"
            type="default"
            @click="handleBindMenu(row)"
          >
            绑定
          </el-button>
          <el-button
            v-show="type == 'menu' && row.objectId == bindRow.meta.viewid"
            disabled
            type="info"
          >
            已绑定
          </el-button>
          <el-button
            v-show="queryForm.showRow"
            type="primary"
            @click="handleNotification(row)"
          >
            关联
          </el-button>
          <el-button
            v-show="type === 'role'"
            type="default"
            @click="handleRelation(row, setRowState(selectRow, row))"
          >
            {{ setRowState(selectRow, row) }}
          </el-button>
          <el-button type="primary" @click="handleLowCode(row)">
            {{ $translateTitle('application.preview') }}
          </el-button>

          <el-button type="success" @click="handleEdit(row)">
            {{ $translateTitle('product.Design') }}
          </el-button>
          <el-button
            type="warning"
            @click="showTree(row, row.objectId, row.ACL)"
          >
            {{ $translateTitle('product.transfer') }}
          </el-button>
          <!--          <el-button type="text" @click="handleEdit(row)">编辑</el-button>-->
          <el-button type="danger" @click="handleDelete(row)">
            {{ $translateTitle('task.Delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <dgiot-parser-pagination
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
    <view-edit ref="edit" @fetch-data="fetchData" />
    <lowcodeDesign ref="lowcodeDesign" @objectId="lowcodeId" />
  </div>
</template>
<script>
  import { getTable, getViews } from '@/api/Dba'
  import { mapMutations, mapGetters } from 'vuex'
  import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
  import { queryView, putView, postView, delView, getView } from '@/api/View'
  import { getDlinkJson } from '@/api/Dlink'
  import ViewEdit from './components/ViewEdit'

  const defaultQuery = {
    class: '',
    type: '',
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
  }
  export default {
    name: 'ComprehensiveTable',
    components: {
      ViewEdit,
      lowcodeDesign,
    },
    props: {
      classDisable: {
        required: false,
        type: Boolean,
        default: () => false,
      },
      type: {
        required: false,
        type: String,
        default: () => '',
      },
      viewForm: {
        required: false,
        type: Object,
        default: () => defaultQuery,
      },
      editRow: {
        required: false,
        type: Object,
        default: () => {},
      },
      selectRow: {
        required: false,
        type: Array,
        default: () => {},
      },
      bindRow: {
        required: false,
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        bindRow1: this.bindRow,
        lang: [
          { label: '中文简体', value: 'zh' },
          { label: 'english', value: 'en' },
          { label: '日本語', value: 'jp' },
        ],
        flags: [
          {
            value: 'Amis',
            label: '动态表单',
          },
          {
            value: 'Konva',
            label: '工业组态',
          },
        ],
        Types: [
          // {
          //   value: 'amis',
          //   label: '低代码',
          // },
          // {
          //   value: 'notification',
          //   label: '告警联动',
          // },
          // {
          //   value: 'reportFrom',
          //   label: '报告表单',
          // },
          // {
          //   value: 'deviceInfo',
          //   label: '设备信息',
          // },
          // {
          //   value: 'amis_view',
          //   label: '低代码预览',
          // },
          // {
          //   value: 'pressureconfig',
          //   label: '压测配置',
          // },
          // {
          //   value: 'topo',
          //   label: '组态',
          // },
          // {
          //   value: 'profile',
          //   label: '设备控制',
          // },
          // {
          //   value: 'content',
          //   label: '数据展示',
          // },
          // {
          //   value: 'sms_template',
          //   label: '短信模板',
          // },
        ],
        DbaTable: [],
        keys: [],
        lowcodeId: '',
        paginations: {
          // 每页显示个数选择器的选项设置
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          // 组件布局，子组件名用逗号分隔
          layout: 'total, sizes, prev, pager, next, jumper',
          // 是否为分页按钮添加背景色
          background: true,
          // 是否显示本控件
          hidden: false,
          // 是否使用小型分页样式
          small: false,
          // 每页显示条目个数，支持 .sync 修饰符
          pageSize: 10,
          // 总条目数
          total: 0,
          // 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
          pageCount: 0,
          // 页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数
          pagerCount: 7,
          // 当前页数，支持 .sync 修饰符
          currentPage: 1,
          // 每页显示个数选择器的下拉框类名
          popperClass: '',
          // 替代图标显示的上一页文字
          prevText: '',
          // 替代图标显示的下一页文字
          nextText: '',
          // 是否禁用
          disabled: false,
          // 只有一页时是否隐藏
          hideOnSinglePage: false,
        },
        queryPayload: {
          excludeKeys: 'data',
          include: '',
          order: '-updatedAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        queryForm: this.viewForm,
        list: [],
        imageList: [],
        listLoading: true,
        selectRows: '',
        changerow: {},
        popoverVisible: false,
        curDepartmentId: '',
        roleProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    computed: {
      ...mapGetters({
        // routes: 'routes/routes',
        // _tableDict: 'global/_tableDict',
        // token: 'user/token',
        roleTree: 'user/roleTree',
        // language: 'settings/language',
        // _product: 'user/_Product',
        // _role: 'acl/role',
        // currentDepartment: 'user/currentDepartment',
      }),
    },
    watch: {
      bindRow: {
        handler(newValue) {
          this.bindRow1 = newValue
        },
        deep: true,
      },
    },
    created() {
      this.setTreeFlag(false)
      this.fetchData()
      this.featchTable()
    },
    mounted() {
      if (this.$route.query.type == 'amis') {
        const { key, type, _class } = this.$route.query
        this.queryForm.key = key
        this.queryForm.type = type
        this.queryForm.class = _class
        this.queryForm.data = {
          type: 'page',
          initApi: {
            url: 'iotapi/classes/Device/parse_objectid',
            method: 'get',
            adaptor:
              'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.profile\r\n  }',
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
                  'return {\r\n    ...api,\r\n    data: {\r\n        profile:{ ...api.data}\r\n    }\r\n}',
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
        }
      }
      this.$dgiotBus.$off('saveLowCode')
      this.$dgiotBus.$on('saveLowCode', (params) => {
        this.saveLowCode(params.id, params.data)
      })
    },
    methods: {
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
        setTreeFlag: 'settings/setTreeFlag',
      }),
      handleBindMenu(row) {
        // console.log('row', row, this.bindRow)
        this.$emit('bindamismenu', row, this.bindRow)
      },
      // 迁移设备
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
          this.$translateTitle(`确定要将视图迁移到` + data.name + '吗'),
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
          await putView(this.changerow.objectId, parmas)
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
      showTree(row, objectId, acl) {
        this.changerow = row
        this.deciceCompany = acl
        this.popoverVisible = !this.popoverVisible
      },
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
      async changeFlag(params) {
        console.log(params)
        const res = await getDlinkJson(params, { subtype: 'all' })
        console.log('列表', res)
        this.Types = res
        this.fetchData()
      },
      async switchlanguage(v) {
        if (!v.language) {
          return false
        }
        await putView(v.objectId, { language: v.language })
        this.$message({
          type: 'success',
          message: '语言类型修改成功',
          showClose: true,
        })
      },
      async switchflag(v) {
        console.log(v)
        // return
        if (!v.flag) {
          return false
        }
        await putView(v.objectId, { flag: v.flag })
        this.$message({
          type: 'success',
          message: '修改成功',
          showClose: true,
        })
      },
      setRowState(role, col) {
        let text = '关联'
        if (_.isEmpty(role)) text = '关联'
        else {
          role.forEach((e) => {
            if (e.objectId == col.objectId) text = '解除关联'
          })
        }
        return text
      },
      handleRelation(row, type) {
        this.$emit('BusRole', { row, type })
        // 将这个id带给父组件,触发父组件的关联事件
      },
      async blurEvent(row) {
        row.isEdit = !row.isEdit
        if (row.title !== row.oldTitle) {
          await putView(row.objectId, {
            title: row.title,
          })
          this.$message({
            message: '标题修改成功',
            type: 'success',
            showClose: true,
            duration: 1500,
          })
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 13:05:02
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async changeClass(_class) {
        this.fetchData()
        if (!_class) return false
        try {
          console.log(_class)
          //  根据下拉的表,查到对应表数据
          const params = {
            order: '-updatedAt',
          }
          const { results = [] } = await this.$query_object(_class, params)
          console.log(results)
          this.keys = results
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 12:50:35
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async featchTable() {
        try {
          const res = await getViews()
          this.DbaTable = res
        } catch (error) {
          console.log(error)
        }
      },
      async handleNotification(rows) {
        await this.$baseEventBus.$emit('showNotificationSettings', rows)
      },
      handleAdd() {
        this.$refs['edit'].type = 'add'
        // 解决子组件修改影响父组件的显示问题
        this.$refs['edit'].DbaTable = this.DbaTable
        // this.$refs['edit'].row = this.queryForm
        this.$refs['edit'].dialogFormVisible = true
        this.$refs['edit'].showEdit(this.queryForm)
      },
      async handleEdit(row) {
        localStorage.setItem('parse_objectid', row.key)
        const loading = this.$baseLoading(1)
        const { data = {} } = await getView(row.objectId)
        if (row.flag == 'Konva') {
          console.log('跳转', row)
          // Topo?productid=3faa32ba66
          if (row.type == 'Dashboard') {
            this.$router.push({
              path: '/Topo',
              query: {
                viewid: row.objectId,
                dashboard: true,
                // productid: row.key || 'none',
              },
            })
          } else if (row.type.toLowerCase() == 'topo') {
            this.$router.push({
              path: '/Topo',
              query: {
                // viewid: row.objectId,
                // dashboard: true,
                productid: row.key,
              },
            })
          }
        } else {
          this.$router.push({
            path: `/design/editor/amis/`,
            query: {
              viewId: row.objectId,
              type: row.type,
            },
          })
        }
        loading.close()
        this.set_amisJson(data)
      },
      handleDelete(row) {
        console.log(row.data, row.objectId)
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const res = await delView(row.objectId)
            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
            this.fetchData()
          }
        )
      },
      async handleLowCode(row) {
        localStorage.setItem('parse_objectid', row.key)
        const loading = this.$baseColorfullLoading(1)
        loading.close()
        this.$dgiotBus.$emit('lowcodePreview', await getView(row.objectId))
      },
      async saveLowCode(lowcodeId, payload) {
        const loading = this.$baseColorfullLoading(1)
        const res = await putView(lowcodeId, payload)
        loading.close()
      },
      async paginationQuery(queryPayload) {
        this.queryPayload = queryPayload
      },
      async fetchData(params) {
        if (_.isEmpty(params)) params = this.queryPayload
        this.queryPayload.where = {}
        this.queryForm.class
          ? (this.queryPayload.where.class = { $regex: this.queryForm.class })
          : ''
        this.queryForm.type
          ? (this.queryPayload.where.type = { $regex: this.queryForm.type })
          : ''
        this.queryForm.title
          ? (this.queryPayload.where.title = { $regex: this.queryForm.title })
          : ''
        this.queryForm.key
          ? (this.queryPayload.where.key = { $regex: this.queryForm.key })
          : ''
        this.queryForm.flag
          ? (this.queryPayload.where.flag = { $regex: this.queryForm.flag })
          : ''
        this.queryForm.objectId
          ? (this.queryPayload.where.objectId = {
              $regex: this.queryForm.objectId,
            })
          : ''
        this.queryForm.language
          ? (this.queryPayload.where.language = {
              $regex: this.queryForm.language,
            })
          : ''
        const { count, order, excludeKeys, limit, skip, where } = params
        console.log(this.queryForm)
        this.listLoading = true
        const { results, count: total } = await queryView({
          count,
          order,
          excludeKeys,
          limit,
          skip,
          where,
        })
        if (results)
          results.forEach((item) => {
            item.isEdit = false
            item.oldTitle = item.title
            item.createdAt = moment(item.createdAt).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
        this.list = results
        this.$dgiotBus.$emit('lowcodeLen', total)
        this.paginations.total = total
        this.listLoading = false
      },
    },
  }
</script>
