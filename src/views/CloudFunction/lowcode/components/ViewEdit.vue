<template>
  <el-dialog
    append-to-body
    :visible.sync="dialogFormVisible"
    width="100vh"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="表名" prop="class">
        <el-select
          v-model="form.class"
          allow-create
          clearable
          default-first-option
          filterable
          style="width: 100%"
          @change="changeClass"
        >
          <el-option
            v-for="item in DbaTable"
            :key="item.className"
            :label="item.className"
            :value="item.className"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          allow-create
          clearable
          default-first-option
          filterable
          style="width: 100%"
          @change="changeType"
        >
          <el-option
            v-for="item in Types"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-select
          v-model="form.key"
          allow-create
          clearable
          default-first-option
          filterable
          size="mini"
          style="width: 100%"
        >
          <el-option
            v-for="item in keys"
            :key="item.objectId"
            :label="item.objectId"
            :value="item.objectId"
          >
            <span style="float: left">{{ item.objectId }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{
                item.description ||
                item.name ||
                item.title ||
                item.username ||
                item.type
              }}
            </span>
          </el-option>
        </el-select>
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
      <!--              <dgiot-monaco-plus-->
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
          <dgiot-monaco-plus
            :key="upKey"
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
  import { getDlinkJson } from '@/api/Dlink'

  export default {
    name: 'TableEdit',
    data() {
      return {
        upKey: new Date().getMilliseconds(),
        DbaTable: [],
        Types: ['amis', 'topo', 'notification'],
        keys: [],
        activeName: 'first',
        amisKey: moment(new Date()).format('X'),
        type: '',
        codes: '{}',
        viewId: '',
        form: {
          class: 'Product',
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
          this.upKey = new Date().getMilliseconds()
        },
        immediate: true,
        deep: true,
      },
    },
    created() {
      this.changeClass('Product')
    },
    methods: {
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      /**
       * @Author: dgiot-fe
       * @Date: 2022-05-04 16:00:15
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async changeType(params) {
        this.codes = {}
        this.form.data = {}
        const type = params
          .trim()
          .toLowerCase()
          .replace(params[0], params[0].toUpperCase())
        try {
          const res = await getDlinkJson(type)
          this.form.data = res || {}
          this.codes = JSON.stringify(this.form.data, null, 4)
          this.upKey = new Date().getMilliseconds()
          this.$refs['monacoCode'].setValue(this.codes)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 13:05:02
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async changeClass(_class) {
        if (!_class) return false
        try {
          console.log(_class)
          //  根据下拉的表,查到对应表数据
          const params = {
            order: '-updatedAt',
          }
          const { results = [] } = await this.$query_object(_class, params)
          console.log(results)
          this.keys = results
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
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
              this.$message({
                showClose: true,
                duration: 2000,
                message: `${this.$translateTitle(
                  'user.Save the template successfully'
                )}`,
                type: 'success',
              })
            } else {
              const { msg } = await putView(this.viewId, params)
              this.$message({
                showClose: true,
                duration: 2000,
                message: `${this.$translateTitle(
                  'user.Save the template successfully'
                )}`,
                type: 'success',
              })
            }
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
