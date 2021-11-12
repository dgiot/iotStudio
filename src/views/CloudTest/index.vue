<!--
* @Author: h7ml
* @Date: 2021-11-08 17:14:44
* @LastEditors: h7ml
* @LastEditTime: 2021-11-08 17:14:44
* @Description: 云检测
* @FilePath: src\views\TaskList\index.vue
* @DocumentLink:
-->
<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  ></div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'
  import TableEdit from '@/views/Empty/tableEdit'
  import VabDraggable from 'vuedraggable'
  export default {
    name: 'Index',
    components: {
      VabDraggable,
      TableEdit,
    },
    data() {
      return {
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
    created() {
      this.fetchData()
    },
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
