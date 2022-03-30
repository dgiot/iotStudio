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
  <div
    ref="custom-table"
    class="index-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <el-form
      ref="ruleForm"
      class="demo-ruleForm"
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
                    添加
                  </el-button>
                </el-form-item>
              </el-form>
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
              <el-button type="primary" @click="submitForm('ruleForm')">
                立即创建
              </el-button>
              <el-button
                style="margin: 0 10px 10px 0 !important"
                type="primary"
                @click="clickFullScreen"
              >
                <dgiot-icon
                  :icon="
                    isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'
                  "
                />
                表格全屏
              </el-button>
              <el-popover popper-class="custom-table-checkbox" trigger="hover">
                <el-checkbox-group v-model="checkList">
                  <vue-draggable :list="columns" v-bind="dragOptions">
                    <div v-for="(item, index) in columns" :key="item + index">
                      <dgiot-icon icon="drag-drop-line" />
                      <el-checkbox
                        :disabled="item.disableCheck === true"
                        :label="item.label"
                      >
                        {{ item.label }}
                      </el-checkbox>
                    </div>
                  </vue-draggable>
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
                <el-input v-else v-model="row[item.prop]" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="auto"
            >
              <template #default="{ row }">
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import {
    queryMetaData,
    getMetaData,
    delMetaData,
    putMetaData,
    postMetaData,
  } from '@/api/MetaData'
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'

  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        ruleForm: {
          name: '元数据名称',
          description: '元数据描述',
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
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur',
            },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          date1: [
            {
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          date2: [
            {
              type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change',
            },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
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
        listLoading: true,
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
      if (this.$route.query.objectId) this.fetchData(this.$route.query.objectId)
    },
    mounted() {},
    destroyed() {},
    methods: {
      ...mapActions({
        delVisitedRoute: 'tabs/delVisitedRoute',
        _logout: 'user/logout',
      }),
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const from = this[formName]
            delete from.objectId
            if (this.$route.query.objectId)
              await putMetaData(this.$route.query.objectId, from)
            else await postMetaData(from)
            this.$router.push('/oc/MetaData')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 210
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      async fetchData(objectId) {
        const ruleForm = await getMetaData(objectId)
        delete ruleForm.createdAt
        delete ruleForm.updatedAt
        this.ruleForm = ruleForm
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    heigth: 100%;
  }
</style>
