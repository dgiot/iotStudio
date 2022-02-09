<template>
  <el-dialog
    append-to-body
    :visible.sync="dialogFormVisible"
    width="100vh"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="表名" prop="class">
        <el-input v-model="form.class" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input v-model.trim="form.key" />
      </el-form-item>
      <el-form-item :label="$translateTitle('product.title')" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <!--      <el-form-item :label="$translateTitle('task.data')" prop="data">-->
      <!--        <el-tabs-->
      <!--          v-model="activeName"-->
      <!--          @tab-click="-->
      <!--            set_amisJson(JSON.parse($refs.monacoCode.monacoEditor.getValue()))-->
      <!--          "-->
      <!--        >-->
      <!--          <el-tab-pane :label="$translateTitle('product.Design')" name="first">-->
      <!--            <div style="height: 30vh; overflow: auto">-->
      <!--              <vab-monaco-plus-->
      <!--                ref="monacoCode"-->
      <!--                :codes="codes"-->
      <!--                :language="'json'"-->
      <!--                :read-only="false"-->
      <!--                :theme="'vs-dark'"-->
      <!--              />-->
      <!--            </div>-->
      <!--          </el-tab-pane>-->
      <!--          <el-tab-pane-->
      <!--            :label="$translateTitle('application.preview')"-->
      <!--            name="code"-->
      <!--          >-->
      <!--            <dgiot-amis :schema="amisJson" />-->
      <!--          </el-tab-pane>-->
      <!--        </el-tabs>-->
      <!--      </el-form-item>-->
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
  import { putView, postView } from '@/api/View'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'TableEdit',
    data() {
      return {
        activeName: 'first',
        amisKey: moment(new Date()).format('X'),
        type: '',
        codes: '',
        viewId: '',
        form: {
          title: '',
          author: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
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
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      showEdit(row) {
        this.form = row
        this.dialogFormVisible = true
      },
      close() {
        // this.$refs['form'].resetFields()
        // this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        console.log(this.$refs.monacoCode.$refs.monacoEditor.editor.getValue())
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
              const res = await postView(params)
              this.$message.success(
                `${this.$translateTitle('user.Save the template successfully')}`
              )
            } else {
              const { msg } = await putView(this.viewId, params)
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
