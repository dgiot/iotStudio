<template>
  <div class="menu-management-container">
    <el-alert
      :closable="false"
      title="演示环境仅做基础功能展示，若想实现不同角色的真实菜单配置，需将config/setting.config.js路由加载模式改为all模式，由后端全面接管路由渲染与角色权限控制"
      type="success"
    />
    <el-row>
      <el-col :lg="4" :md="8" :sm="24" :xl="4" :xs="24">
        <el-tree
          :data="data"
          :default-expanded-keys="['root']"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
              添加
            </el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          :data="list"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          border
          default-expand-all
          row-key="path"
        >
          <el-table-column
            align="center"
            label="标题"
            prop="meta.title"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="name"
            prop="name"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="路径"
            prop="path"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="是否隐藏"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>
                {{ row.hidden ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否一直显示当前节点"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>
                {{ row.alwaysShow ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="vue文件路径"
            prop="component"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="重定向"
            prop="redirect"
            show-overflow-tooltip
          />
          <el-table-column align="center" label="图标" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                <vab-icon v-if="row.meta.icon" :icon="row.meta.icon" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否固定"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.noClosable ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否无缓存"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.noKeepAlive ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="badge" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.badge }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            show-overflow-tooltip
            width="85"
          >
            <template #default="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/empty_images/data_empty.png"
              class="vab-data-empty"
            />
          </template>
        </el-table>
      </el-col>
    </el-row>
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getRouterList } from '@/api/User'
  import { doDelete, getTree } from '@/api/menuManagement'
  import Edit from './components/MenuManagementEdit'

  export default {
    name: 'MenuManagement',
    components: { Edit },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        list: [],
        listLoading: true,
      }
    },
    async created() {
      const roleData = await getTree()
      this.data = roleData.data
      await this.fetchData()
    },
    methods: {
      handleEdit(row) {
        if (row.path && row.component) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.path) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ paths: row.path })
            this.$baseMessage(msg, 'success', false, 'vab-hey-message-success')
            await this.fetchData()
          })
        }
      },
      async fetchData() {
        this.listLoading = true
        const { data } = await getList()
        this.list = data
        this.listLoading = false
      },
      handleNodeClick() {
        this.fetchData()
      },
    },
  }
</script>
