<template>
  <div class="rolescontrol dgiot-container">
    <div class="search">
      <el-input
        v-model="search"
        clearable
        :placeholder="$translateTitle('concentrator.input')"
        style="width: 200px"
      />
      <el-button
        icon="el-icon-search"
        style="margin-left: 20px"
        type="primary"
        @click="getcontrolrole({ name: search })"
      >
        {{ $translateTitle('developer.search') }}
      </el-button>
      <el-button
        disabled
        icon="el-icon-plus"
        type="primary"
        @click="addcontrol"
      >
        {{ $translateTitle('developer.add') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      border
      :data="treeData"
      default-expand-all
      :height="tableHeight"
      row-key="objectId"
      size="mini"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        align="center"
        class-name="isCheck"
        show-overflow-tooltip
        type="index"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('equipment.name')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('product.alias')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>
            {{ row.alias }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('user.createdtime')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>{{ row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$translateTitle('task.Operation')"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="handleEdit(row)"
          >
            {{ $translateTitle('developer.edit') }}
          </el-button>
          <el-button
            disabled
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            {{ $translateTitle('developer.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <vab-Pagination
      v-show="count"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="count"
      @pagination="getcontrolrole"
    />
    <!--编辑权限弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('developer.edit')"
      :visible.sync="roleEdit"
      width="28%"
    >
      <el-form :model="form">
        <el-form-item
          :label="$translateTitle('user.name')"
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
            v-model="form.description"
            autocomplete="off"
            :rows="2"
            style="width: 300px"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="roleEdit = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click.native="updaterole"
        >
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getPermission,
    putPermission,
    queryPermission,
  } from '@/api/Permission/index'
  import { utc2beijing } from '@/utils'

  export default {
    components: {},
    data() {
      return {
        count: 0,
        queryForm: {
          number: '',
          product: '',
          type: '',
          searchDate: [],
          limit: 20,
          skip: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
        listLoading: false,
        formLabelWidth: '120px',
        roleEdit: false,
        tableHeight: this.$baseTableHeight(0),
        form: {
          name: '',
          alias: '',
          description: '',
        },
        search: '',
        defaultExpandAll: true,
        key: 1,
        permissionid: '',
        columns: [
          {
            label: 'Name',
            key: 'alias',
            expand: true,
            align: 'left',
          },
          {
            label: 'Alias',
            key: 'name',
            width: 200,
            align: 'center',
          },
          {
            label: 'Created time',
            key: 'scope',
          },
          {
            label: 'Operation',
            key: 'operation',
          },
        ],
        data: [],
      }
    },
    computed: {
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.data)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.objectId == child.parent
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parent == 0 // 返回第一层
        })
      },
    },
    mounted() {
      this.getcontrolrole({})
    },
    methods: {
      async handleEdit(row) {
        this.permissionid = row.objectId
        // console.log(row, this.permissionid)
        const resultes = await getPermission(row.objectId)
        // console.log("QueryP", resultes)
        this.form.name = resultes.name
        this.form.description = resultes.description
        this.form.alias = resultes.alias
        this.roleEdit = true
      },
      handleDelete(row) {},
      addcontrol() {},
      async getcontrolrole(args) {
        console.log(args)
        this.listLoading = true
        this.data = []
        const { results, count } = await queryPermission({
          count: '*',
          limit: args.limit ? args.limit : this.queryForm.limit,
          order: this.queryForm.order,
          skip: args.skip ? args.skip : this.queryForm.skip,
          where: {
            name: args.name ? { $regex: args.name } : { $ne: null },
          },
        })
        this.listLoading = false
        if (results) {
          results.map((items) => {
            var obj = {}
            obj.name = items.name
            obj.alias = items.alias
            obj.objectId = items.objectId
            obj.parent = items.parent.objectId
            obj.createtime = utc2beijing(items.createdAt)
            this.data.push(obj)
            this.count = count
          })
        } else {
          this.data = []
        }
      },
      async updaterole() {
        const res = await putPermission(this.permissionid, {
          alias: this.form.alias,
          description: this.form.description,
        })
        if (res) {
          this.$message({
            type: 'success',
            message: '更新成功',
          })
        }
        this.roleEdit = false
      },
    },
  }
</script>
<style scoped>
  .rolescontrol {
    box-sizing: border-box;
    width: 100%;
    background: #ffffff;
  }
</style>
