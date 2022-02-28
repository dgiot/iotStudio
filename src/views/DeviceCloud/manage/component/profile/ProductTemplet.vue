<template>
  <a-drawer
    :append-to-body="true"
    class="parserTable"
    direction="rtl"
    :visible="dialogFormVisible"
    width="500"
    @close="close"
  >
    <dgiot-query-form v-show="false">
      <dgiot-query-form-top-panel>
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
      </dgiot-query-form-top-panel>
    </dgiot-query-form>
    <el-table
      border
      :cell-style="{ 'text-align': 'center' }"
      :data="tableData"
      :header-cell-style="{ 'text-align': 'center' }"
      :height="$baseTableHeight(0) + 180"
      size="mini"
      style="width: 100%"
    >
      <el-table-column label="objectId" prop="objectId" width="140" />
      <el-table-column
        :label="$translateTitle('developer.Templatename')"
        prop="name"
        width="180"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('developer.operation')"
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
    <dgiot-Pagination
      v-show="queryForm.total > 0"
      :limit.sync="queryForm.pageSize"
      :page.sync="queryForm.pageNo"
      :total="queryForm.total"
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
  import { delProductTemplet, queryProductTemplet } from '@/api/ProductTemplet'
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
          dgiotlog.log(e.name, '')
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
      //     dgiotlog.log(branchArr, 'branchArr')
      //     branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
      //     // father.parentid == 0 ? (father.parentid = '0') : ''
      //     return father.parentid == 0 // 返回第一层
      //   })
      // },
      selectType(e) {
        this.form.data = e
        dgiotlog.log(e)
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
          // dgiotlog.log(this.categoryListOptions, 'categoryListOptions')
          const { results, count = 0 } = await queryProductTemplet(params)
          loading.close()
          this.tableData = results
          this.queryForm.total = count
        } catch (error) {
          dgiotlog.log(error)
          this.$message.error(`${error}`)
        }
      },

      async queryProduct() {
        try {
          const loading = this.$baseColorfullLoading()
          // dgiotlog.log(this.categoryListOptions, 'categoryListOptions')
          const { results } = await queryProduct({
            keys: 'name',
            where: {},
          })
          loading.close()
          this.productData = results
        } catch (error) {
          dgiotlog.log(error)
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
          dgiotlog.log(res)
          // this.$message.success(`${res}`)
        } catch (error) {
          dgiotlog.log(error)
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
          dgiotlog.log(res)
          this.$message({
            showClose: true,
            message: this.$translateTitle('user.successfully deleted'),
            type: 'success',
          })
          this.Industry()
        } catch (error) {
          dgiotlog.log(error)
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
        dgiotlog.log(mark)
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
          dgiotlog.log('setparams', setparams)
          if (valid) {
            const { msg } =
              mark == 'edit'
                ? await putCategory(this.form.objectId, setparams)
                : await postCategory(setparams)
            this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
