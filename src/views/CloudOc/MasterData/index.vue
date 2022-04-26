<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:35
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:35
* @Description:
* @FilePath: src\views\CloudOc\MasterData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div
    ref="custom-table"
    class="index-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <div class="dialog">
      <el-dialog
        append-to-body
        :title="properties.types || '新增主数据: ' + properties.title"
        :visible.sync="formDialog"
        @close="closeDilog"
      >
        <div class="form">
          <el-form
            :key="properties.objectId"
            ref="form"
            label-width="80px"
            status-icon
          >
            <el-form-item
              v-for="(item, index) in properties.data.properties"
              :key="index"
              :label="item.prop.label"
              :rules="item.prop.rules"
            >
              <el-input v-model="item.propertyValue" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="submitForm('form')">
            {{ properties.types ? '修改' : '新增' }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <el-row>
      <el-col :span="4">
        主数据列表:
        <ul
          v-infinite-scroll="load"
          class="infinite-list"
          :infinite-scroll-distance="50"
          style="overflow: scroll; height: 75vh"
        >
          <el-row :gutter="24">
            <li
              v-for="i in list"
              :key="i.objectId"
              class="infinite-list-item"
              @click="queryItem(i)"
            >
              <el-col :span="18">
                <el-link
                  :type="
                    properties.objectId == i.objectId ? 'primary' : 'warning'
                  "
                >
                  {{ i.title }}
                </el-link>
              </el-col>
              <el-col :span="4">
                <el-button
                  class="el-icon-edit"
                  style="float: right"
                  type="text"
                  @click.native="
                    $router.push({
                      path: '/oc/MetaData/module',
                      query: {
                        objectId: i.objectId,
                        type: 'edit',
                      },
                    })
                  "
                />
              </el-col>
            </li>
          </el-row>
        </ul>
      </el-col>
      <el-col :span="20">
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
                <el-input v-model="queryForm.name" placeholder="元数据名称" />
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  native-type="submit"
                  type="primary"
                  @click="handleQuery"
                >
                  查询
                </el-button>
                <el-button
                  :disabled="!properties.objectId"
                  icon="el-icon-plus"
                  type="primary"
                  @click.native="showDiloog(properties)"
                >
                  新增主数据
                </el-button>
              </el-form-item>
            </el-form>
          </dgiot-query-form-left-panel>
          <dgiot-query-form-right-panel>
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
          v-loading="loading"
          :border="border"
          :data="MasterData"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中"
          :height="height"
          :size="lineHeight"
          :stripe="stripe"
          @selection-change="setSelectRows"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column
            align="center"
            label="序号"
            show-overflow-tooltip
            width="95"
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
            :prop="item.label"
            sortable
            :width="item.width"
          >
            <template #default="{ row }">
              <span>{{ row.data[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template #default="{ row, $index }">
              <el-button
                type="text"
                @click.native="editItem($index, row, MasterData)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                @click.native.prevent="handleDelete($index, row, MasterData)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
              "
            />
          </template>
        </el-table>
        <el-pagination
          v-show="MasterData.length"
          background
          :current-page="queryForm.size"
          :layout="layout"
          :page-size="queryForm.limit"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <el-empty
          v-show="!properties.data.properties"
          :image-size="height - 200"
        />
      </el-col>
    </el-row>

    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'
  import { queryDict, getDict, delDict, putDict, postDict } from '@/api/Dict'

  export default {
    name: 'Index',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        clickRow: {},
        MasterData: [],
        formDialog: false,
        loading: false,
        count: 0,
        properties: [],
        drawerAdd: false,
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 20,
        stripe: true,
        lineHeight: 'mini',
        columns: [],
        checkList: [],
        // checkList: ['propertyDesc'],
        // columns: [
        //   {
        //     label: 'propertyDesc',
        //     width: '160',
        //     prop: 'propertyDesc',
        //     sortable: true,
        //     disableCheck: true,
        //   },
        // ],
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          skip: 0,
          limit: 20,
          name: '',
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
      this.fetchData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      closeDilog() {
        delete this.properties.types
      },
      async submitForm(formName) {
        var data = {
          data: {},
        }
        this.properties.data.properties.forEach((item) => {
          data.data[item.propertyCode] = item.propertyValue
        })
        console.log(data)
        if (this.clickRow.objectId) {
          await putDict(this.clickRow.objectId, { data: data.data })
        } else {
          const res = await postDict({
            data: data.data,
            type: this.properties.objectId + 'metaData',
            class: 'metaData',
            title: this.properties.title,
            key: 'metaData:' + moment().format('x'),
            dict: {
              __type: 'Pointer',
              className: 'Dict',
              objectId: this.properties.objectId,
            },
          })
          this.total = this.total + 1
        }
        this.queryItem(this.clickItem, false)
        this.formDialog = false
      },
      load() {
        this.count += 2
      },
      async showDiloog(item) {
        if (item.data.properties) {
          await this.properties.data.properties.forEach((i) => {
            console.log(i)
            i.prop = {
              label: i.propertyDesc,
              prop: i.propertyCode,
              rules: {
                required: true,
                message: i.propertyDesc + '不能为空',
                trigger: 'blur',
              },
              data: {},
            }
            i[i.propertyCode] = ''
            i.propertyValue = ''
          })
          console.log(this.properties.data.properties)
          this.formDialog = true
        } else await this.$message.info('元数据暂无配置信息')
      },
      async queryItem(item, loading = true) {
        this.clickItem = item
        this.loading = loading
        this.checkList = []
        this.columns = []
        const properties = await getDict(item.objectId)
        const { results = [], count = 0 } = await queryDict({
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          where: {
            dict: item.objectId,
          },
        })
        console.log(results)
        this.total = count
        this.MasterData = results
        if (!_.isEmpty(properties.data.properties)) {
          properties.data.properties.forEach((i) => {
            i.prop = {
              label: i.propertyDesc,
              prop: i.propertyCode,
              rules: {
                required: true,
                message: i.propertyDesc + '不能为空',
                trigger: 'blur',
              },
              data: {},
            }
            i[i.propertyCode] = ''
            if (i.propertyDesc) {
              this.checkList.push(i.propertyDesc)
              this.columns.push({
                label: i.propertyDesc,
                width: 'auto',
                prop: i.propertyCode,
                sortable: true,
                disableCheck: true,
              })
            }
            i.propertyValue = ''
          })
        }
        this.properties = properties
        setTimeout(() => {
          this.loading = false
        }, 300)
      },
      onSubmit() {
        console.log('submit!')
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
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      editItem(index, row) {
        this.clickRow = row
        this.properties.data.properties.forEach((i) => {
          i.prop = {
            label: i.propertyDesc,
            prop: i.propertyCode,
            rules: {
              required: true,
              message: i.propertyDesc + '不能为空',
              trigger: 'blur',
            },
            data: {},
          }
          i[i.propertyCode] = ''
          i.propertyValue = row.data[i.propertyCode]
        })
        this.properties.types = '修改主数据'
        this.formDialog = true
      },
      handleDelete(index, row, MasterData) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDict(row.objectId)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
          MasterData.splice(index, 1)
          this.total = this.total - 1
        })
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.limit = 0
        this.queryForm.limit = 20
        this.fetchData()
      },
      async fetchData() {
        const params = {
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: '',
          where: {
            type: 'metaData',
            title: this.queryForm.name
              ? { $regex: this.queryForm.name }
              : { $ne: null },
          },
        }
        console.info(params)
        const { results } = await queryDict(params)
        this.list = results
        if (results.length > 0) {
          this.queryItem(results[0], false)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;

    .infinite-list .infinite-list-item {
      display: flex;
      align-items: center;
      justify-content: left;
      height: 30px;
      margin: 10px;
      color: #7dbcfc;
    }
  }
</style>
