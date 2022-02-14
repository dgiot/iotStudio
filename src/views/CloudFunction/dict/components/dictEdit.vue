<template>
  <el-dialog
    append-to-body
    :title="title"
    :visible.sync="dialogFormVisible"
    width="100vh"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="表名" prop="class">
        <el-input v-model="form.class" readonly />
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input v-model="form.key" readonly />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          allow-create
          default-first-option
          filterable
          :placeholder="$translateTitle('rule.Type')"
          style="width: 100%"
        >
          <el-option
            v-for="item in dicttype"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$translateTitle('product.title')" prop="title">
        <!--        <el-input v-model="form.title" />-->
        <el-select
          v-model="form.title"
          allow-create
          default-first-option
          filterable
          placeholder="请选择"
          size="mini"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in titleOption"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$translateTitle('task.data')" prop="data">
        <div style="height: 30vh; overflow: auto">
          <vab-monaco-plus
            ref="monacoCode"
            :codes="codes"
            :lang="'json'"
            :read-only="false"
            :theme="'vs-dark'"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">
        {{ $translateTitle('button.determine') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { postDict, putDict } from '@/api/Dict'

  export default {
    name: 'DictEdit',
    data() {
      return {
        activeName: 'first',
        amisKey: moment(new Date()).format('X'),
        type: '',
        codes: '',
        dictId: '',
        form: {
          title: '',
          author: '',
        },
        dicttype: ['dict', 'word', 'rule', 'datav'],
        titleOption: ['worddict', 'ruledict'],
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {},
    watch: {
      'form.data': {
        handler(val) {
          this.codes = JSON.stringify(val, null, 4)
        },
        immediate: true,
        deep: true,
      },
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = row
        }
        this.dialogFormVisible = true
      },
      close() {
        // this.$refs['form'].resetFields()
        // this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { title, type, key } = this.form
            const params = {
              data: JSON.parse(
                this.$refs.monacoCode.$refs.monacoEditor.editor.getValue()
              ),
              class: this.form.class,
              title,
              type,
              key,
            }
            if (this.type == 'add') {
              const res = await postDict(params)
              this.$message.success(
                `${this.$translateTitle('user.Save the template successfully')}`
              )
            } else {
              const { msg } = await putDict(this.dictId, params)
              this.$message.success(
                `${this.$translateTitle('user.Save the template successfully')}`
              )
            }
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
