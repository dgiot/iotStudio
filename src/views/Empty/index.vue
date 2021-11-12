<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
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
            <el-input v-model="queryForm.title" placeholder="标题" />
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
              icon="el-icon-plus"
              type="primary"
              @click.native="handleAdd"
            >
              添加
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete"
            >
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <div class="stripe-panel">
          <el-checkbox v-model="stripe">斑马纹</el-checkbox>
        </div>
        <div class="border-panel">
          <el-checkbox v-model="border">边框（可拉伸列）</el-checkbox>
        </div>
        <el-button
          style="margin: 0 10px 10px 0 !important"
          type="primary"
          @click="clickFullScreen"
        >
          <vab-icon
            :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
          />
          表格全屏
        </el-button>
        <el-popover
          ref="popover"
          popper-class="custom-table-checkbox"
          trigger="hover"
        >
          <el-radio-group v-model="lineHeight">
            <el-radio label="medium">大</el-radio>
            <el-radio label="small">中</el-radio>
            <el-radio label="mini">小</el-radio>
          </el-radio-group>
          <template #reference>
            <el-button style="margin: 0 10px 10px 0 !important" type="primary">
              <vab-icon icon="line-height" />
              表格尺寸
            </el-button>
          </template>
        </el-popover>
        <el-popover popper-class="custom-table-checkbox" trigger="hover">
          <el-checkbox-group v-model="checkList">
            <vab-draggable :list="columns" v-bind="dragOptions">
              <div v-for="(item, index) in columns" :key="item + index">
                <vab-icon icon="drag-drop-line" />
                <el-checkbox
                  :disabled="item.disableCheck === true"
                  :label="item.label"
                >
                  {{ item.label }}
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
              可拖拽列设置
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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        sortable
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
        sortable
        :width="item.width"
      >
        <template #default="{ row }">
          <span v-if="item.label === '评级'">
            <el-rate v-model="row.rate" disabled />
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        sortable
        width="85"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../public/assets/images/platform/assets/empty_images/data_empty.png')
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
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/Empty/tableEdit'
  import VabDraggable from 'vuedraggable'

  export default {
    name: 'Empty',
    components: {
      TableEdit,
      VabDraggable,
    },
    data() {
      return {
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(1),
        stripe: false,
        lineHeight: 'medium',
        checkList: ['标题', '作者', '评级', '点击量', '时间'],
        columns: [
          {
            label: '标题',
            width: 'auto',
            prop: 'title',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '作者',
            width: 'auto',
            prop: 'author',
            sortable: true,
          },
          {
            label: '评级',
            width: '200',
            prop: 'rate',
            sortable: true,
          },
          {
            label: '点击量',
            width: 'auto',
            prop: 'pageViews',
            sortable: true,
          },
          {
            label: '时间',
            width: 'auto',
            prop: 'datetime',
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
    mounted() {},
    created() {
      this.fetchData()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
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
        this.listLoading = true
        const {
          data: { list, total },
        } = await getList(this.queryForm)
        this.list = list
        const imageList = []
        list.forEach((item) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
        this.total = total
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .Empty {
  }
</style>
