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
        v-show="flagType == 'child'"
        :label="$translateTitle('category.sort')"
        prop="order"
      >
        <el-input-number v-model="form.order" :min="0" style="width: 100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">
        {{ $translateTitle('category.cancel') }}
      </el-button>
      <el-button type="primary" @click.native="save(form.mark)">
        {{ $translateTitle('category.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
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
          level: 0,
        },
        rules: {},
        title: '',
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
      }
    },
    methods: {
      showEdit(row, type) {
        console.log('row', row)
        console.log('type', type)
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
                level: row.level,
                order: Number(moment(new Date()).valueOf()),
              })
            : {
                objectId: row.objectId,
                mark: type,
                data: {},
                name: '',
                order: 0,
                level: 0,
              }
        console.log('this.form', this.form)
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
        var params = {
          name: this.form.name,
          data: this.form.data,
          order: this.form.order,
        }
        const setparams =
          mark == 'top'
            ? _.merge(params, {
                ACL: _.merge(setAcl, this.aclObj),
                parent: {
                  objectId: 'a60a85475a',
                  __type: 'Pointer',
                  className: 'Category',
                },
                level: 1,
              })
            : mark == 'child'
            ? _.merge(params, {
                ACL: _.merge(setAcl, this.aclObj),
                parent: {
                  objectId: this.form.objectId,
                  __type: 'Pointer',
                  className: 'Category',
                },
                level: 2,
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
