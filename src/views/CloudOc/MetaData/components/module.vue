<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-3-30 16:47:54
* @LastEditors: 16:47
* @LastEditTime: 2022-3-30 16:47:54
* @Description:
* @FilePath: src/views/CloudOc/MetaData/components/module.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: module
-->
<template>
  <div ref="custom-table" class="index-container">
    <el-form
      ref="ruleForm"
      class="demo-ruleForm"
      :class="{ 'dgiot-fullscreen': isFullscreen }"
      label-position="top"
      label-width="160px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item label="元数据名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          :readonly="$route.query.type == 'edit'"
        />
      </el-form-item>
      <el-form-item label="多版本管理" prop="multiVersion">
        <el-radio-group v-model="ruleForm.multiVersion">
          <el-radio :label="1">需要</el-radio>
          <el-radio :label="0">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="元数据描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" />
      </el-form-item>
      <el-form-item label="唯一标识定义层级关系" prop="prefixNested">
        <el-radio v-model="ruleForm.prefixNested" :label="true">需要</el-radio>
        <el-radio v-model="ruleForm.prefixNested" :label="false">
          不需要
        </el-radio>
      </el-form-item>
      <el-form-item label="数据字典" prop="properties" type="primary">
        <el-card>
          <dgiot-query-form>
            <dgiot-query-form-left-panel>
              <el-form
                ref="form"
                :inline="true"
                label-width="0"
                :model="queryForm"
                @submit.native.prevent
              >
                <el-form-item>
                  <el-button
                    icon="el-icon-plus"
                    type="primary"
                    @click.native="
                      ruleForm.properties.push({
                        propertyDesc: '',
                        propertyCode: '',
                        propertyType: '',
                        isNull: false,
                        display: true,
                        isUnique: false,
                        array: false,
                        defaultValue: '',
                        propertyLimit: {},
                        propertyIndex: 0,
                        queryCondition: false,
                      })
                    "
                  >
                    添加数据
                  </el-button>
                </el-form-item>
              </el-form>
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
              <el-button
                class="el-icon-edit"
                :type="$route.query.type !== 'edit' ? 'primary' : 'info'"
                @click="submitForm('ruleForm')"
              >
                {{ $route.query.type !== 'edit' ? '立即创建' : '修改' }}
              </el-button>
              <el-popover popper-class="custom-table-checkbox" trigger="hover">
                <el-checkbox-group v-model="checkList">
                  <dgiot-draggable :list="columns" />
                </el-checkbox-group>
                <template #reference>
                  <el-button
                    icon="el-icon-setting"
                    style="margin: 0 0 10px 0 !important"
                    type="primary"
                  >
                    可拖拽列设置
                  </el-button>
                </template>
              </el-popover>
            </dgiot-query-form-right-panel>
          </dgiot-query-form>
          <el-table
            ref="tableSort"
            :border="border"
            :data="ruleForm.properties"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              label="序号"
              show-overflow-tooltip
              sortable
              width="auto"
            >
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in finallyColumns"
              :key="index"
              align="center"
              :label="item.label"
              sortable
              :width="item.width"
            >
              <template #default="{ row }">
                <el-switch
                  v-if="$loadsh.isBoolean(row[item.prop])"
                  v-model="row[item.prop]"
                />
                <el-select
                  v-else-if="item.prop === 'propertyType'"
                  v-model="row[item.prop]"
                  allow-create
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dataTypes"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <el-input v-else v-model="row[item.prop]" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="auto"
            >
              <template #default="{ row, $index }">
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button
                  type="text"
                  @click.native.prevent="
                    handleDelete($index, ruleForm.properties)
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
    </el-form>
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { getDict, delDict, putDict, postDict } from '@/api/Dict'
  import TableEdit from './tableEdit'
  import { getDlinkJson } from '@/api/Dlink'

  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {
      dataTypes: {
        type: Array,
        required: false,
        default() {
          return [
            'int32',
            'float',
            'double',
            'enum',
            'bool',
            'text',
            'date',
            'struct',
            'array',
          ]
        },
      },
    },
    data() {
      return {
        ruleForm: {
          name: '',
          description: '',
          multiVersion: 1,
          properties: [
            {
              propertyDesc: '',
              propertyCode: '',
              propertyType: '',
              isNull: false,
              display: true,
              isUnique: false,
              array: false,
              defaultValue: '',
              propertyLimit: {},
              propertyIndex: 0,
              queryCondition: false,
            },
          ],
          prefixNested: false,
        },
        rules: {
          name: [
            { required: true, message: '请输入元数据名称', trigger: 'blur' },
            {
              min: 1,
              max: 32,
              message: '长度在 1 到 32 个字符',
              trigger: 'blur',
            },
          ],
          multiVersion: [
            { required: true, message: '请选择多版本管理', trigger: 'change' },
          ],
          description: [
            { required: false, message: '请输入元数据描述', trigger: 'blur' },
          ],
          prefixNested: [
            {
              required: true,
              message: '请选择是否需要唯一标识定义层级关系',
              trigger: 'change',
            },
          ],
        },
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 20,
        stripe: true,
        lineHeight: 'mini',
        checkList: [
          '属性名称',
          '属性类型',
          '属性标识',
          '唯一标识',
          '是否必填',
          '显示属性',
          '查询属性',
          '多值',
        ],
        columns: [
          {
            label: '属性名称',
            width: 'auto',
            prop: 'propertyDesc',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '属性类型',
            width: 'auto',
            prop: 'propertyType',
            sortable: true,
          },
          {
            label: '属性标识',
            width: '200',
            prop: 'propertyCode',
            sortable: true,
          },
          {
            label: '唯一标识',
            width: 'auto',
            prop: 'isUnique',
            sortable: true,
          },
          {
            label: '显示属性',
            width: 'auto',
            prop: 'display',
            sortable: true,
          },
          {
            label: '是否必填',
            width: 'auto',
            prop: 'isNull',
            sortable: true,
          },
          {
            label: '多值',
            width: 'auto',
            prop: 'array',
            sortable: true,
          },
        ],
        list: [],
        imageList: [],
        listLoading: this.$route.query.objectId ? true : false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {},
    created() {
      this.featUnit()
      if (this.$route.query.objectId) this.fetchData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      ...mapActions({
        delVisitedRoute: 'tabs/delVisitedRoute',
      }),
      async featUnit() {
        const { UnifyUnitSpecsDTO = [] } = await getDlinkJson('Unit')
        console.info(UnifyUnitSpecsDTO)
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const from = this[formName]
            const postParams = {
              data: from,
              type: 'metaData',
              class: 'metaData',
              title: this.ruleForm.name,
              key: this.ruleForm.name,
            }
            delete postParams.data.objectId
            if (this.$route.query.objectId)
              await putDict(this.$route.query.objectId, postParams)
            else await postDict(postParams)
            // this.$router.push('/oc/MetaData')
            this.$router.go(-1)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async fetchData() {
        const objectId = this.$route.query.objectId
        document.title = document.title.replace('新建', '修改')
        const loading = this.$baseColorfullLoading(2)
        const ruleForm = await getDict(objectId)
        loading.close()
        delete ruleForm.createdAt
        delete ruleForm.updatedAt
        this.ruleForm = ruleForm.data
      },
      async handleDelete(index, rows) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          rows.splice(index, 1)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
        })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;
  }
</style>
