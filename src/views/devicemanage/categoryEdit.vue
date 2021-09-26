<template>
  <el-dialog
    :append-to-body="true"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="300px"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item :label="$translateTitle('category.name')" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item
        v-show="flagType != 'child'"
        :label="$translateTitle('category.type')"
        prop="type"
      >
        <el-select v-model="form.type">
          <el-option
            v-for="item in categoryList"
            :key="item.objectId"
            :label="item.data.CategoryName"
            :value="item.data.CategoryName"
            @click.native="selectType(item)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="flagType == 'child'"
        :label="$translateTitle('category.sort')"
        prop="order"
      >
        <el-input-number v-model="form.order" style="width: 100%" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">
        {{ $translateTitle('category.cancel') }}
      </el-button>
      <el-button type="primary" @click="save(form.mark)">
        {{ $translateTitle('category.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { uuid } from '@/utils'
  import { putCategory, postCategory } from '@/api/Category'
  import { mapGetters } from 'vuex'
  export default {
    name: 'TableEdit',
    data() {
      return {
        flagType: 'father',
        form: {
          data: {},
          name: '',
          order: 0,
          type: '',
        },
        rules: {},
        title: '',
        categoryList: [],
        categoryListOptions: [],
        dialogFormVisible: false,
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
    mounted() {
      this.rules = {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: this.$translateTitle(
              'category.Please enter the category name'
            ),
          },
        ],
        order: [
          {
            required: true,
            trigger: 'blur',
            message: this.$translateTitle('category.Please enter the sort'),
          },
        ],
        type: [
          {
            required: true,
            trigger: 'blur',
            message: this.$translateTitle('category.Please choose the type'),
          },
        ],
      }
      this.Industry()
    },
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
      async Industry() {
        const params = {
          limit: 100,
          where: {
            'data.key': 'category',
          },
        }
        const { results } = await this.$query_object('Dict', params)
        results.map((items) => {
          var obj = {}
          obj.key = items.key
          obj.objectId = items.objectId
          obj.type = items.type
          obj.data = items.data
          this.categoryList.push(obj)
        })
        // this.categoryList = results
        console.log(this.categoryList, 'categoryList')
        // this.searchProduct();
        // this.categoryListOptions = this.treeData(this.categoryList)
        // console.log(this.categoryListOptions, 'categoryListOptions')
      },
      showEdit(row, type) {
        this.flagType = type
        this.title =
          this.flagType == 'top'
            ? this.$translateTitle('category.New top category')
            : type == 'child'
            ? this.$translateTitle('category.Add subcategory')
            : this.$translateTitle('category.Modify category')
        this.form =
          this.flagType != 'child'
            ? _.merge({ mark: type }, row)
            : this.flagType == 'top'
            ? _.merge(this.$options.data().form, {
                mark: type,
                objectId: row.objectId,
                type: row.type,
                order: Number(moment(new Date()).valueOf()),
              })
            : ''
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
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
