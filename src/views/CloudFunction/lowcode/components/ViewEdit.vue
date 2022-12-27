<template>
  <el-dialog
    append-to-body
    :visible.sync="dialogFormVisible"
    width="100vh"
    @close="close"
  >
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="绑定表单名" prop="class">
        <el-select
          v-model="form.class"
          allow-create
          clearable
          default-first-option
          :disabled="$route.query?.id?.length > 0"
          filterable
          style="width: 100%"
          @change="changeClass"
        >
          <el-option
            v-for="item in DbaTable"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">
              {{ item.value }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="绑定表单Id" prop="key">
        <el-select
          v-model="form.key"
          allow-create
          clearable
          default-first-option
          :disabled="$route.query?.id?.length > 0"
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
            <span style="float: right; font-size: 13px; color: #8492a6">
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
      <el-form-item :label="$translateTitle('home.language')">
        <el-select
          v-model="form.language"
          allow-create
          clearable
          default-first-option
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in lang"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item label="渲染框架" prop="flag">
        <el-select
          v-model="form.flag"
          allow-create
          clearable
          default-first-option
          filterable
          style="width: 100%"
          @change="changeFlag"
        >
          <el-option
            v-for="item in flags"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">
              {{ item.value }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考模板" prop="type">
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
            :key="item.label"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">
              {{ item.value }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
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
        lang: [
          { label: '中文简体', value: 'zh' },
          { label: 'english', value: 'en' },
          { label: '日本語', value: 'jp' },
        ],
        upKey: new Date().getMilliseconds(),
        DbaTable: [],
        flags: [
          {
            value: 'Amis',
            label: '动态表单',
          },
          {
            value: 'Konva',
            label: '工业组态',
          },
        ],
        Types: [
          // {
          //   value: 'amis',
          //   label: '低代码',
          // },
          // {
          //   value: 'notification',
          //   label: '告警联动',
          // },
          // {
          //   value: 'reportFrom',
          //   label: '报告表单',
          // },
          // {
          //   value: 'deviceInfo',
          //   label: '设备信息',
          // },
          // {
          //   value: 'amis_view',
          //   label: '低代码预览',
          // },
          // {
          //   value: 'topo',
          //   label: '组态',
          // },
          // {
          //   value: 'dashboard',
          //   label: '大屏',
          // },
          // {
          //   value: 'profile',
          //   label: '设备控制',
          // },
          // {
          //   value: 'content',
          //   label: '数据展示',
          // },
          // {
          //   value: 'pressureconfig',
          //   label: '压测配置',
          // },
          // {
          //   value: 'sms_template',
          //   label: '短信模板',
          // },
        ],
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
          flag: '',
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
      showEdit(row) {
        this.form = row
        this.dialogFormVisible = true
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-05-04 16:00:15
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async changeType(params) {
        // console.log(params)
        // if (params == 'topo') {
        //   this.form.flag = 'knova'
        // } else {
        //   this.form.flag = 'amis'
        // }
        this.codes = {}
        this.form.data = {}
        //  .toLowerCase()
        // const type = params.trim().replace(params[0], params[0].toUpperCase())
        try {
          const res = await getDlinkJson(this.form.flag, { subtype: params })
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
      async changeFlag(params) {
        console.log(params)
        const res = await getDlinkJson(params, { subtype: 'all' })
        console.log('列表', res)
        this.Types = res
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
            // // keys: 'objectId',
            // excludeKeys:
            //   'children,thing,decoder,topics,productSecret,view,category,producttemplet',
          }
          switch (_class) {
            case 'Notification':
              params.keys = 'objectId'
              break
            case 'Product':
              params.keys = 'objectId,name'
              break
            case 'Maintenance':
              params.keys = 'objectId,name'
              break
          }
          const { results = [] } = await this.$query_object(_class, params)
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
        // console.log(this.$refs.monacoCode.$refs.monacoEditor.editor.getValue())
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let role = JSON.parse(
              Base64.decode(localStorage.getItem('role'))
            )?.vuexinfo
            let ACL = {}
            role.forEach((item) => {
              ACL[`role:${item.name}`] = {
                read: true,
                write: true,
              }
            })
            const { title, type, key, flag } = this.form
            const params = {
              ACL: ACL,
              data: JSON.parse(
                this.$refs.monacoCode.$refs.monacoEditor.editor.getValue()
              ),
              language: this.form.language,
              class: this.form.class,
              title,
              type,
              key,
              flag,
            }
            // console.log('this.type', this.type)
            if (this.type == 'add') {
              if (params.type == 'Topo') {
                if (!params.key) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    message: '请绑定表单Id',
                    type: 'error',
                  })
                  return
                }
              }
              params.ACL['*'] = {
                read: true,
                write: false,
              }
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
