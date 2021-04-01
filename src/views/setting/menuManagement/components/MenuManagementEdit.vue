<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="60%"
    @close="close"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="vue文件路径" prop="component">
        <el-input v-model="form.component" />
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="form.redirect" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.meta.title" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-popover
          popper-class="icon-selector-popper"
          trigger="hover"
          width="292"
        >
          <template #reference>
            <el-input v-model="form.meta.icon" />
          </template>
          <vab-icon-selector @handle-icon="handleIcon" />
        </el-popover>
      </el-form-item>
      <el-form-item label="badge" prop="badge">
        <el-input v-model="form.meta.badge" />
      </el-form-item>
      <el-form-item label="隐藏" prop="hidden">
        <el-switch v-model="form.hidden" />
      </el-form-item>
      <el-form-item label="始终显示当前节点" prop="alwaysShow">
        <el-switch v-model="form.alwaysShow" />
      </el-form-item>
      <el-form-item label="自定义svg图标" prop="isCustomSvg">
        <el-switch v-model="form.meta.isCustomSvg" />
      </el-form-item>
      <el-form-item label="固定" prop="noClosable">
        <el-switch v-model="form.meta.noClosable" />
      </el-form-item>
      <el-form-item label="无缓存" prop="noKeepAlive">
        <el-switch v-model="form.meta.noKeepAlive" />
      </el-form-item>
      <el-form-item label="不显示当前标签页" prop="tabHidden">
        <el-switch v-model="form.meta.tabHidden" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VabIconSelector from '@/extra/VabIconSelector'
  import { doEdit } from '@/api/menuManagement'

  export default {
    name: 'MenuManagementEdit',
    components: { VabIconSelector },
    data() {
      return {
        form: {
          meta: {
            icon: '',
          },
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入name' }],
          path: [{ required: true, trigger: 'blur', message: '请输入path' }],
          component: [
            { required: true, trigger: 'blur', message: '请输入component' },
          ],
          'meta.title': [
            { required: true, trigger: 'blur', message: '请输入标题' },
          ],
          'meta.icon': [
            { required: true, trigger: 'blur', message: '请选择图标' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      handleIcon(item) {
        this.form.meta.icon = item
      },
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
