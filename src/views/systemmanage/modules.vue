<!-- 组件说明 -->
<template>
  <div class="modules">
    <el-dialog
      :append-to-body="true"
      title="修改物模型"
      :visible.sync="edit_module"
      width="17%"
    >
      <el-form
        ref="editForm"
        class="demo-editForm"
        label-width="100px"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item
          label="产品名称"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="产品类型"
          prop="devType"
        >
          <el-input v-model="editForm.devType" />
        </el-form-item>
        <el-form-item
          label="所属分类"
          prop="category"
        >
          <el-cascader
            v-model="editForm.category"
            :options="categoryListOptions"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click.native="editPostForm('editForm')"
        >
          修改
        </el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :append-to-body="true"
      title="新增物模型"
      :visible.sync="add_module"
      width="17%"
    >
      <el-form
        ref="moduleForm"
        class="demo-moduleForm"
        label-width="100px"
        :model="moduleForm"
        :rules="rules"
      >
        <el-form-item
          label="产品名称"
          prop="name"
        >
          <el-input v-model="moduleForm.name" />
        </el-form-item>
        <el-form-item
          label="产品类型"
          prop="devType"
        >
          <el-input v-model="moduleForm.devType" />
        </el-form-item>
        <el-form-item
          label="所属分类"
          prop="category"
        >
          <el-cascader
            v-model="moduleForm.category"
            :options="categoryListOptions"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click.native="submitForm('moduleForm')"
        >
          立即创建
        </el-button>
        <el-button @click="resetForm('moduleForm')">重置</el-button>
      </span>
    </el-dialog>
    <header>
      <el-row :gutter="24">
        <el-col :span="20">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="add_module = true"
          >
            新增
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="searchText"
            placeholder="请输入产品名称"
            size="mini"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="mini"
              type="primary"
              @click="searchModule(searchText)"
            >
              搜索
            </el-button>
          </el-input>
        </el-col>
      </el-row>
    </header>
    <center>
      <el-table
        v-loading="pictLoading"
        :data="
          tableData.filter(
            (data) =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        element-loading-background="rgba(0, 0, 0, 0.5)"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据正在加载中"
        max-height="583"
        style="width: 100%; min-height: 583px"
      >
        <el-table-column
          label="objectId"
          prop="objectId"
        />
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            {{ scope.row.data.name }}
          </template>
        </el-table-column>
        <el-table-column label="产品类型">
          <template slot-scope="scope">
            {{ scope.row.data.devType }}
          </template>
        </el-table-column>
        <el-table-column
          label="key"
          prop="key"
        />
        <el-table-column label="所属分类">
          <template slot-scope="scope">
            {{ scope.row.data.category }}
          </template>
        </el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              placeholder="输入关键字搜索"
              size="mini"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, tableData)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </center>
    <footer>
      <el-pagination
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        :total="pageTotal"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </footer>
    Parse
  </div>
</template>

<script>
  import { delDict, getDictCount, postDict } from '@/api/Dict/index'
  import { queryProduct } from '@/api/Product/index'
  import { getHashClass } from '@/api/Hash/index'

  export default {
    name: 'Modules',
    components: {},
    data() {
      return {
        productObj: [],
        pictLoading: false,
        categoryListOptions: [],
        limit: 10,
        skip: 0,
        add_module: false,
        edit_module: false,
        searchText: '',
        hashkey: '',
        categoryList: [],
        infoData: '物模型管理',
        currentPage: 1,
        pageTotal: 0,
        tableData: [],
        search: '',
        editForm: {
          name: '物模型管理',
          devType: '物模型管理',
          category: '',
          type: 'Product',
        },
        moduleForm: {
          name: '物模型管理',
          devType: '物模型管理',
          category: '',
          type: 'Product',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入产品名称',
              trigger: 'blur',
            },
          ],
          devType: [
            {
              required: true,
              message: '请输入产品类型',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请选择模型所属分类',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    computed: {},
    mounted() {
      this.searchModule('')
      this.Industry()
    },
    beforeCreate() {}, // 生命周期 - 创建之前
    beforeMount() {}, // 生命周期 - 挂载之前
    beforeUpdate() {}, // 生命周期 - 更新之前
    updated() {}, // 生命周期 - 更新之后
    beforeDestroy() {}, // 生命周期 - 销毁之前
    destroyed() {}, // 生命周期 - 销毁完成
    activated() {},
    methods: {
      // 查询product
      async getProduct() {
        const { results } = await queryProduct()
        if (results) this.productObj = results
      },
      // 深度克隆
      treeData(paramData) {
        const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.id == child.parentid
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentid == 0 // 返回第一层
        })
      },
      // 查询样品
      Industry() {
        this.categoryList = []
        this.getProduct()
        const params = {
          limit: 10,
          where: {
            'data.key': 'category',
          },
        }
        this.$query_object('Dict', params)
          .then((res) => {
            if (res.results) {
              res.results.map((items) => {
                var obj = {}
                obj.value = items.type
                obj.label = items.data.CategoryName
                obj.id = items.data.Id
                obj.parentid = items.data.SuperId
                this.categoryList.push(obj)
              })
              // this.searchProduct();
              this.categoryListOptions = this.treeData(this.categoryList)
            }
          })
          .catch((error) => {
            console.log(error, 'error')
          })
      },
      async blackDict(hashkey, data, type) {
        const params = {
          data: data,
          key: hashkey,
          type: type,
        }
        const res = await postDict(params)
        if (res) {
          this.$message({
            type: 'success',
            message: '新建物模型成功',
          })
          this.add_module = false
          this.searchModule('')
        } else {
          this.$message({
            type: 'error',
            message: `新建物模型失败`,
          })
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const data = {
              category: this.moduleForm.category[0],
              devType: this.moduleForm.devType,
              name: this.moduleForm.name,
            }
            const { objectId, code } = await getHashClass('Product', data)
            if (code == 200) {
              this.blackDict(objectId, data, this.moduleForm.type)
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 搜索
      async searchModule(text) {
        this.pictLoading = true
        let params
        if (text.length) {
          params = {
            order: '-createdAt',
            count: 'objectId',
            limit: this.limit,
            skip: this.skip,
            where: {
              type: 'Module',
              key: {
                $regex: `${text}`,
              },
            },
          }
        } else {
          params = {
            order: '-createdAt',
            count: 'objectId',
            limit: this.limit,
            skip: this.skip,
            where: { type: 'Product' },
          }
        }
        const { results, count = 0 } = await getDictCount(params)
        this.pictLoading = false
        if (results) {
          this.tableData = results
          this.pageTotal = count
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.limit = val
        this.searchModule(this.searchText)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.skip = this.limit * (val - 1)
        this.searchModule(this.searchText)
      },
      handleEdit(index, row) {
        ;(this.edit_module = true), (this.editForm = row.data)
        console.log(index, row)
      },
      editPostForm(form) {
        console.log(form)
      },
      async handleDelete(index, row, rows) {
        const res = await delDict(row.objectId)
        if (res) {
          rows.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: `删除失败`,
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  /* @import url() */
  .modules {
    margin: 20px;

    footer {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
