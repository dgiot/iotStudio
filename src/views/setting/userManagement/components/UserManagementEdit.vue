<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" type="password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" />
      </el-form-item>
      <el-form-item label="角色" prop="roles">
        <el-checkbox-group v-model="form.roles">
          <el-checkbox label="admin" />
          <el-checkbox label="editor" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          roles: [],
        },
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
          roles: [{ required: true, trigger: 'blur', message: '请选择角色' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success', false, 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
