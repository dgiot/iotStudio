<!--
* @Author: h7ml
* @Date: 2021-11-08 17:17:08
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:17:08
* @Description: 报告模板
* @FilePath: src\views\CloudTest\report\index.vue
* @DocumentLink:
-->
<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <div class="components">
      <add-dialog :show.sync="activePopShow">
        <span>你好</span>
        <div slot="title">
          这是title
        </div>
        <div slot="footer">
          这是底部
        </div>
      </add-dialog>
    </div>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              v-model="queryForm.title"
              :placeholder="
                $translateTitle('cloudTest.Please enter the query content')
              "
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              {{ $translateTitle('cloudTest.search') }}
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
            >
              {{ $translateTitle('cloudTest.add') }}
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete($event)"
            >
              {{ $translateTitle('cloudTest.delete') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="stripe-panel">
          <el-checkbox v-model="stripe">
            {{ $translateTitle('cloudTest.Zebra pattern') }}
          </el-checkbox>
        </div>
        <div class="border-panel">
          <el-checkbox v-model="border">
            {{ $translateTitle('cloudTest.frame') }}
          </el-checkbox>
        </div>
        <el-button
          style="margin: 0 10px 10px 0 !important"
          type="primary"
          @click="clickFullScreen"
        >
          <vab-icon
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          {{ $translateTitle('cloudTest.full screen') }}
        </el-button>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">
              {{ $translateTitle('cloudTest.medium') }}
            </el-radio>
            <el-radio label="small">
              {{ $translateTitle('cloudTest.small') }}
            </el-radio>
            <el-radio label="mini">
              {{ $translateTitle('cloudTest.mini') }}
            </el-radio>
          </el-radio-group>
          <template #reference>
            <el-button
              style="margin: 0 10px 10px 0 !important"
              type="primary"
            >
              <vab-icon icon="line-height" />
              {{ $translateTitle('cloudTest.size') }}
            </el-button>
          </template>
        </el-popover>
        <el-popover
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-checkbox-group v-model="checkList">
            <vab-draggable
              v-bind="dragOptions"
              :list="columns"
            >
              <div
                v-for="(item, index) in columns"
                :key="item + index"
              >
                <vab-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ $translateTitle(`cloudTest.${item.label}`) }}
                </el-checkbox>
              </div>
            </vab-draggable>
          </el-checkbox-group>
          <template #reference>
            <el-button
              icon="el-icon-setting"
              style="margin: 0 0 10px 0 !important"
              type="primary"
            >
              {{ $translateTitle('cloudTest.Draggable column') }}
            </el-button>
          </template>
        </el-popover>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
      @selection-change="setSelectRows"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('cloudTest.number')"
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
        :label="$translateTitle(`cloudTest.${item.label}`)"
        :prop="item.prop"
        :sortable="item.sortable"
        :width="item.width"
      />

      <el-table-column
        align="center"
        :label="$translateTitle(`cloudTest.operate`)"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button
            type="success"
            @click="handleEdit(row)"
          >
            {{ $translateTitle(`cloudTest.edit`) }}
          </el-button>
          <el-button
            type="warning"
            @click="handleDelete(row)"
          >
            {{ $translateTitle(`cloudTest.delete`) }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <table-edit
      ref="edit"
      @fetch-data="fetchData"
    />
  </div>
</template>

<script>
  import addDialog from '@/views/CloudTest/Report/components/addDialog'
  import { batch } from '@/api/Batch/index'
  import { queryProduct, delProduct, postProduct } from '@/api/Product'
  import { fileUpload, deleteFile } from '@/api/Proxy'
  import { getDictCount } from '@/api/Dict'
  import { cereteReport, postReportFile, putReportFile } from '@/api/Platform'
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/Empty/tableEdit'
  import VabDraggable from 'vuedraggable'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Index',
    components: {
      VabDraggable,
      TableEdit,
      addDialog,
    },
    data() {
      return {
        activePopShow: false,
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) - 40,
        stripe: false,
        lineHeight: 'medium',
        checkList: [
          'objectId',
          'Template name',
          'Category',
          'Trade Names',
          'Creation time',
        ],
        columns: [
          {
            label: 'objectId',
            width: 'auto',
            prop: 'objectId',
            sortable: true,
            disableCheck: true,
          },
          {
            label: 'Template name',
            width: 'auto',
            prop: 'name',
            sortable: true,
          },
          {
            label: 'Category',
            width: 'auto',
            prop: 'category',
            sortable: true,
          },
          {
            label: 'Trade Names',
            width: 'auto',
            prop: 'devType',
            sortable: true,
          },
          {
            label: 'Creation time',
            width: 'auto',
            prop: 'createdAt',
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
          pagesize: 10,
          start: 0,
        },
      }
    },
    computed: {
      ...mapGetters({
        language: 'settings/language',
      }),
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
    watch: {
      language: {
        deep: true,
        limit: true,
        handler(val) {
          console.error(val)
        },
      },
    },
    created() {
      this.fetchData()
    },
    methods: {
      clickFullScreen() {
        this.isFullscreen = !this.isFullscreen
        this.handleHeight()
      },
      handleHeight() {
        if (this.isFullscreen) this.height = this.$baseTableHeight(1) + 210
        else this.height = this.$baseTableHeight(1)
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        const params = {
          skip: this.queryForm.start,
          limit: this.queryForm.pagesize,
          count: '1',
          where: {
            // 'config.temp.identifier': 'inspectionReportTemp',
            // desc: '0',
            // category: 'Evidence',
            // nodeType: 1,
          },
          order: '-updatedAt', // -updatedAt  updatedAt
        }
        this.listLoading = true
        const { count = 0, results = [] } = await queryProduct(params)
        results.forEach((item) => {
          item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.list = results
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .custom-table-container {
    ::v-deep {
      i {
        cursor: pointer;
      }
    }

    .stripe-panel,
    .border-panel {
      margin: 0 10px $base-margin/2 10px !important;
    }
  }
</style>
<style lang="scss">
  .custom-table-checkbox {
    [class*='ri'] {
      vertical-align: -2.5px;
      cursor: pointer;
    }

    .el-checkbox {
      margin: 5px 0 5px 8px;
    }
  }
</style>
