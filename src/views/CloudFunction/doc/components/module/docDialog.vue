<template>
  <div class="doc-dialog">
    <el-dialog
      :key="key"
      append-to-body
      :title="
        form.type == 'add'
          ? $translateTitle('article.New category')
          : $translateTitle('article.edit category')
      "
      :visible.sync="dialogFormVisible"
      width="400px"
      @close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item
          :label="$translateTitle('article.name')"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-show="form.parent.objectId.includes('0')"
          :label="$translateTitle('article.category')"
          :label-width="formLabelWidth"
          prop="category"
        >
          <el-input v-model="form.category" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-show="form.parent.objectId.includes('0')"
          :label="$translateTitle('article.Icon')"
          :label-width="formLabelWidth"
          prop="ico"
        >
          <el-input v-model="form.ico" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('article.order')"
          :label-width="formLabelWidth"
          prop="order"
        >
          <el-input-number
            v-model="form.order"
            autocomplete="off"
            :min="0"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          v-show="false"
          :label="$translateTitle('article.parent')"
          :label-width="formLabelWidth"
          prop="parent.objectId"
        >
          <el-input v-model="form.parent.objectId" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $translateTitle('button.cancel') }}
        </el-button>
        <el-button
          v-if="form.type == 'add'"
          type="primary"
          @click="$parent.createDoc('form', form, form.type)"
        >
          {{ $translateTitle('button.create') }}
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="$parent.editDoc('form', form, form.type)"
        >
          {{ $translateTitle('button.modify') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'DocDialog',
    data() {
      return {
        key: moment(new Date()).valueOf(),
        dialogFormVisible: false,
        form: {
          type: '',
          name: '',
          parent: {
            objectId: '0',
            __type: 'Pointer',
            className: 'Article',
          },
          data: '',
          order: 0,
          category: '',
          Icon: '',
          desc: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入文档名',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 15,
              message: '长度在 1 到 15 个字符',
              trigger: 'blur',
            },
          ],
          category: [
            {
              required: true,
              message: '请输入类别',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 15,
              message: '长度在 1 到 15 个字符',
              trigger: 'blur',
            },
          ],
          ico: [],
          order: [
            {
              required: true,
              type: 'number',
              message: '请选择排序',
              trigger: 'blur',
            },
          ],
          'parent.objectId': [
            {
              required: true,
              type: 'string',
              message: '请输入父及',
              trigger: 'blur',
            },
          ],
        },
        formLabelWidth: '60px',
      }
    },
    computed: {},
    mounted() {},
    created() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      handleClose(done) {
        console.log(done)
        this.$refs.form.resetFields()
        this.form = {
          type: '',
          name: '',
          parent: {
            objectId: '0',
            __type: 'Pointer',
            className: 'Article',
          },
          data: '',
          order: 0,
          category: '',
          Icon: '',
          desc: '',
        }
      },
    },
  }
</script>
