<template>
  <a-drawer
    :append-to-body="true"
    width="500"
    direction="rtl"
    :visible="dialogFormVisible"
    class="parserTable"
    @close="close"
  >
    <vab-query-form v-show="false">
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="80px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('alert.productname')">
            <el-select
              v-model="queryForm.productId"
              clearable
              :placeholder="
                $translateTitle('alert.please enter') +
                $translateTitle('alert.product name')
              "
              @clear="Industry"
            >
              <el-option
                v-for="item in productData"
                :key="item.objectId"
                :label="item.name"
                :value="item.objectId"
                @click.native="Industry(item)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="Industry"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-table
      :height="$baseTableHeight(0) + 180"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      :data="tableData"
      border
      size="mini"
      style="width: 100%"
    >
      <el-table-column prop="objectId" label="objectId" width="140" />
      <el-table-column
        prop="name"
        :label="$translateTitle('developer.Templatename')"
        width="180"
      />
      <el-table-column
        :label="$translateTitle('developer.operation')"
        align="center"
      >
        <template #default="{ row }">
          <!--          <el-button size="mini" type="success" @click.native="updateTemplate(row)">-->
          <!--            {{ $translateTitle('product.Update template') }}-->
          <!--          </el-button>-->
          <el-button
            size="mini"
            type="danger"
            @click="toDeleteATemplate(row.objectId)"
          >
            {{ $translateTitle('product.Delete template') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <vab-Pagination
      v-show="queryForm.total > 0"
      :total="queryForm.total"
      :page.sync="queryForm.pageNo"
      :limit.sync="queryForm.pageSize"
      @pagination="Industry"
    />
    <template #footer>
      <el-button @click="close">
        {{ $translateTitle('category.cancel') }}
      </el-button>
      <el-button type="primary" @click.native="save(form.mark)">
        {{ $translateTitle('category.submit') }}
      </el-button>
    </template>
  </a-drawer>
</template>

<script>
  import { queryProductTemplet, delProductTemplet } from '@/api/ProductTemplet'
  import { queryProduct } from '@/api/Product'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ProductTemplet',
    data() {
      return {
        form: {},
        dialogFormVisible: false,
        tableData: [],
        productData: [],
        queryForm: {
          productId: '',
          productFlag: false,
          pageNo: 1,
          pageSize: 20,
          searchDate: [],
          limt: 10,
          skip: 0,
          total: 0,
          order: '-createdAt',
          keys: 'count(*)',
        },
      }
    },
    computed: {
      ...mapGetters({
        role: 'acl/role',
        username: 'user/username',
      }),
      aclObj() {
        let aclObj = {}
        this.role.map((e) => {
          console.log(e.name, '')
          aclObj[`${'role' + ':' + e.name}`] = {
            read: true,
            write: true,
          }
        })
        return aclObj
      },
    },
    created() {},
    mounted() {},
    methods: {
      // treeData(paramData) {
      //   const cloneData = JSON.parse(JSON.stringify(paramData)) // 对源数据深度克隆
      //   return cloneData.filter((father) => {
      //     const branchArr = cloneData.filter(
      //       (child) => father.id == child.parentid
      //     ) // 返回每一项的子级数组
      //     console.log(branchArr, 'branchArr')
      //     branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
      //     // father.parentid == 0 ? (father.parentid = '0') : ''
      //     return father.parentid == 0 // 返回第一层
      //   })
      // },
      selectType(e) {
        this.form.data = e
        console.log(e)
      },
      categoryChange(item) {},
      async Industry(args = {}) {
        if (!args.limit) {
          args = this.queryForm
        }
        let params = {
          limit: args.limit,
          order: args.order,
          skip: args.skip,
          keys: args.keys,
        }
        try {
          const loading = this.$baseColorfullLoading()
          // console.log(this.categoryListOptions, 'categoryListOptions')
          const { results, count = 0 } = await queryProductTemplet(params)
          loading.close()
          this.tableData = results
          this.queryForm.total = count
        } catch (error) {
          console.log(error)
          this.$message.error(`${error}`)
        }
      },

      async queryProduct() {
        try {
          const loading = this.$baseColorfullLoading()
          // console.log(this.categoryListOptions, 'categoryListOptions')
          const { results } = await queryProduct({
            keys: 'name',
            where: {},
          })
          loading.close()
          this.productData = results
        } catch (error) {
          console.log(error)
        }
      },
      /**
       *
       * @param
       * @returns
       */
      async updateTemplate(params) {
        try {
          const res = await api(params)
          console.log(res)
          // this.$message.success(`${res}`)
        } catch (error) {
          console.log(error)
        }
      },
      /**
       *
       * @param
       * @returns
       */
      async toDeleteATemplate(templateId) {
        try {
          const loading = this.$baseColorfullLoading()
          const res = await delProductTemplet(templateId)
          loading.close()
          console.log(res)
          this.$message.success(
            this.$translateTitle('user.successfully deleted')
          )
          this.Industry()
        } catch (error) {
          console.log(error)
          this.$message.error(
            this.$translateTitle('user.error deleted') + `${error}`
          )
        }
      },
      showEdit(objectId) {
        this.queryProduct()
        if (objectId) this.queryForm.productId = objectId
        this.queryForm.productFlag = true
        this.Industry()
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
      },
      save(mark) {
        console.log(mark)
        const setAcl = {}
        setAcl['*'] = {
          read: true,
        }
        setAcl[this.objectid] = {
          read: true,
          write: true,
        }
        var params = {
          name: this.form.name,
          type: this.form.type,
          data: this.form.data,
          order: this.form.order,
        }
        const setparams =
          mark == 'top'
            ? _.merge(params, {
                ACL: _.merge(setAcl, this.aclObj),
                parent: {
                  objectId: '0',
                  __type: 'Pointer',
                  className: 'Category',
                },
              })
            : mark == 'child'
            ? _.merge(params, {
                ACL: _.merge(setAcl, this.aclObj),
                parent: {
                  objectId: this.form.objectId,
                  __type: 'Pointer',
                  className: 'Category',
                },
              })
            : params
        this.$refs['form'].validate(async (valid) => {
          console.log('setparams', setparams)
          if (valid) {
            const { msg } =
              mark == 'edit'
                ? await putCategory(this.form.objectId, setparams)
                : await postCategory(setparams)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
