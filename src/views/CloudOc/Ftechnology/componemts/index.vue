<!--
* @Author: dgiot-fe
* @Date: 2022-04-21 17:52:41
* @LastEditors: h7ml
* @LastEditTime: 2022-04-21 17:52:41
* @Description:
* @FilePath: src\views\CloudOc\Ftechnology\componemts\index.vue
* @DocumentLink:
-->
<template>
  <div class="index-container">
    <div class="index-content">
      <el-descriptions
        border
        :column="5"
        direction="vertical"
        size="medium"
        :title="detail.data.title"
      >
        <el-descriptions-item label="工艺路径编号">
          {{ detail.data.code }}
          <DgiotQrcode
            :iconstyle="{
              type: 'qrcode',
              'font-size': '12px',
            }"
            :setting="{ text: detail.data.code, binarizeThreshold: 0.5 }"
          />
        </el-descriptions-item>
        <el-descriptions-item label="工艺路径名称">
          {{ detail.data.title }}
        </el-descriptions-item>
        <el-descriptions-item label="工艺路径描述">
          {{ detail.data.description }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ $moment(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ $moment(detail.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
        </el-descriptions-item>
        <template slot="extra">
          <el-button @click.native="busInfo('view', $route.query)">
            表单
          </el-button>
          <el-button
            type="primary"
            @click.native="busInfo('file', $route.query)"
          >
            归档
          </el-button>
          <el-button
            type="warning"
            @click.native="busInfo('release', $route.query)"
          >
            发布
          </el-button>
          <el-button
            type="danger"
            @click.native="busInfo('delete', $route.query)"
          >
            删除
          </el-button>
        </template>
      </el-descriptions>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in amis"
          :key="index"
          :label="item.title"
          :name="index"
        >
          <dgiot-amis :schema="item.data" :show-help="false" />
        </el-tab-pane>
      </el-tabs>
      <!--      <el-tabs v-model="activeName" @tab-click="handleClick">-->
      <!--        <el-tab-pane label="工序列表" name="first">-->
      <!--          <dgiot-query-form-left-panel>-->
      <!--            工艺路径工序-->
      <!--          </dgiot-query-form-left-panel>-->
      <!--          <dgiot-query-form>-->
      <!--            <dgiot-query-form-right-panel>-->
      <!--              <el-form-->
      <!--                ref="form"-->
      <!--                :inline="true"-->
      <!--                label-width="0"-->
      <!--                :model="queryForm"-->
      <!--                @submit.native.prevent-->
      <!--              >-->
      <!--                <el-form-item>-->
      <!--                  <el-input-->
      <!--                    v-model="queryForm.title"-->
      <!--                    placeholder="请输入工艺路径名称"-->
      <!--                  />-->
      <!--                </el-form-item>-->
      <!--                <el-form-item>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-search"-->
      <!--                    native-type="submit"-->
      <!--                    type="primary"-->
      <!--                    @click.native="handleQuery"-->
      <!--                  >-->
      <!--                    查询-->
      <!--                  </el-button>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-plus"-->
      <!--                    type="primary"-->
      <!--                    @click.native="ftechnology.dialogVisible = true"-->
      <!--                  >-->
      <!--                    添加工艺路径-->
      <!--                  </el-button>-->
      <!--                </el-form-item>-->
      <!--              </el-form>-->
      <!--            </dgiot-query-form-right-panel>-->
      <!--          </dgiot-query-form>-->
      <!--          <el-table-->
      <!--            ref="tableSort"-->
      <!--            v-loading="listLoading"-->
      <!--            :border="border"-->
      <!--            :data="list"-->
      <!--            :height="height"-->
      <!--            :size="lineHeight"-->
      <!--            :stripe="stripe"-->
      <!--            @selection-change="setSelectRows"-->
      <!--          >-->
      <!--            <el-table-column align="center" type="selection" width="55" />-->
      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="序号"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="95"-->
      <!--            >-->
      <!--              <template #default="{ $index }">-->
      <!--                {{ $index + 1 }}-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column-->
      <!--              v-for="(item, index) in finallyColumns"-->
      <!--              :key="index"-->
      <!--              align="center"-->
      <!--              :label="item.label"-->
      <!--              sortable-->
      <!--              :width="item.width"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <span v-if="item.label === '评级'">-->
      <!--                  <el-rate v-model="row.rate" disabled />-->
      <!--                </span>-->
      <!--                <span v-else>{{ row[item.prop] }}</span>-->
      <!--              </template>-->
      <!--            </el-table-column>-->

      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="操作"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="85"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <el-button type="text" @click="handleEdit(row)">编辑</el-button>-->
      <!--                <el-button type="text" @click="handleDelete(row)">-->
      <!--                  删除-->
      <!--                </el-button>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <template #empty>-->
      <!--              <el-empty />-->
      <!--            </template>-->
      <!--          </el-table>-->
      <!--          <el-pagination-->
      <!--            background-->
      <!--            :current-page="queryForm.pageNo"-->
      <!--            :layout="layout"-->
      <!--            :page-size="queryForm.pageSize"-->
      <!--            :total="total"-->
      <!--            @current-change="handleCurrentChange"-->
      <!--            @size-change="handleSizeChange"-->
      <!--          />-->
      <!--        </el-tab-pane>-->
      <!--        <el-tab-pane label="属性列表" name="second">-->
      <!--          <dgiot-query-form>-->
      <!--            <dgiot-query-form-left-panel>-->
      <!--              工艺路径属性-->
      <!--            </dgiot-query-form-left-panel>-->
      <!--            <dgiot-query-form-right-panel>-->
      <!--              <el-form-->
      <!--                ref="form"-->
      <!--                :inline="true"-->
      <!--                label-width="0"-->
      <!--                :model="queryForm"-->
      <!--                @submit.native.prevent-->
      <!--              >-->
      <!--                <el-form-item>-->
      <!--                  <el-input-->
      <!--                    v-model="queryForm.title"-->
      <!--                    placeholder="请输入工艺路径名称"-->
      <!--                  />-->
      <!--                </el-form-item>-->
      <!--                <el-form-item>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-search"-->
      <!--                    native-type="submit"-->
      <!--                    type="primary"-->
      <!--                    @click.native="handleQuery"-->
      <!--                  >-->
      <!--                    查询-->
      <!--                  </el-button>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-plus"-->
      <!--                    type="primary"-->
      <!--                    @click.native="ftechnology.dialogVisible = true"-->
      <!--                  >-->
      <!--                    添加工艺路径-->
      <!--                  </el-button>-->
      <!--                </el-form-item>-->
      <!--              </el-form>-->
      <!--            </dgiot-query-form-right-panel>-->
      <!--          </dgiot-query-form>-->
      <!--          <el-table-->
      <!--            ref="tableSort"-->
      <!--            v-loading="listLoading"-->
      <!--            :border="border"-->
      <!--            :data="list"-->
      <!--            :height="height"-->
      <!--            :size="lineHeight"-->
      <!--            :stripe="stripe"-->
      <!--            @selection-change="setSelectRows"-->
      <!--          >-->
      <!--            <el-table-column align="center" type="selection" width="55" />-->
      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="序号"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="95"-->
      <!--            >-->
      <!--              <template #default="{ $index }">-->
      <!--                {{ $index + 1 }}-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column-->
      <!--              v-for="(item, index) in finallyColumns"-->
      <!--              :key="index"-->
      <!--              align="center"-->
      <!--              :label="item.label"-->
      <!--              sortable-->
      <!--              :width="item.width"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <span v-if="item.label === '评级'">-->
      <!--                  <el-rate v-model="row.rate" disabled />-->
      <!--                </span>-->
      <!--                <span v-else>{{ row[item.prop] }}</span>-->
      <!--              </template>-->
      <!--            </el-table-column>-->

      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="操作"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="85"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <el-button type="text" @click="handleEdit(row)">编辑</el-button>-->
      <!--                <el-button type="text" @click="handleDelete(row)">-->
      <!--                  删除-->
      <!--                </el-button>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <template #empty>-->
      <!--              <el-empty />-->
      <!--            </template>-->
      <!--          </el-table>-->
      <!--          <el-pagination-->
      <!--            background-->
      <!--            :current-page="queryForm.pageNo"-->
      <!--            :layout="layout"-->
      <!--            :page-size="queryForm.pageSize"-->
      <!--            :total="total"-->
      <!--            @current-change="handleCurrentChange"-->
      <!--            @size-change="handleSizeChange"-->
      <!--          />-->
      <!--        </el-tab-pane>-->
      <!--        <el-tab-pane label="可执行产线" name="third">-->
      <!--          <dgiot-query-form>-->
      <!--            <dgiot-query-form-left-panel>-->
      <!--              可执行产线-->
      <!--            </dgiot-query-form-left-panel>-->
      <!--            <dgiot-query-form-right-panel>-->
      <!--              <el-form-->
      <!--                ref="form"-->
      <!--                :inline="true"-->
      <!--                label-width="0"-->
      <!--                :model="queryForm"-->
      <!--                @submit.native.prevent-->
      <!--              >-->
      <!--                <el-form-item>-->
      <!--                  <el-input-->
      <!--                    v-model="queryForm.title"-->
      <!--                    placeholder="请输入工艺路径名称"-->
      <!--                  />-->
      <!--                </el-form-item>-->
      <!--                <el-form-item>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-search"-->
      <!--                    native-type="submit"-->
      <!--                    type="primary"-->
      <!--                    @click.native="handleQuery"-->
      <!--                  >-->
      <!--                    查询-->
      <!--                  </el-button>-->
      <!--                  <el-button-->
      <!--                    icon="el-icon-plus"-->
      <!--                    type="primary"-->
      <!--                    @click.native="ftechnology.dialogVisible = true"-->
      <!--                  >-->
      <!--                    添加工艺路径-->
      <!--                  </el-button>-->
      <!--                </el-form-item>-->
      <!--              </el-form>-->
      <!--            </dgiot-query-form-right-panel>-->
      <!--          </dgiot-query-form>-->
      <!--          <el-table-->
      <!--            ref="tableSort"-->
      <!--            v-loading="listLoading"-->
      <!--            :border="border"-->
      <!--            :data="list"-->
      <!--            :height="height"-->
      <!--            :size="lineHeight"-->
      <!--            :stripe="stripe"-->
      <!--            @selection-change="setSelectRows"-->
      <!--          >-->
      <!--            <el-table-column align="center" type="selection" width="55" />-->
      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="序号"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="95"-->
      <!--            >-->
      <!--              <template #default="{ $index }">-->
      <!--                {{ $index + 1 }}-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column-->
      <!--              v-for="(item, index) in finallyColumns"-->
      <!--              :key="index"-->
      <!--              align="center"-->
      <!--              :label="item.label"-->
      <!--              sortable-->
      <!--              :width="item.width"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <span v-if="item.label === '评级'">-->
      <!--                  <el-rate v-model="row.rate" disabled />-->
      <!--                </span>-->
      <!--                <span v-else>{{ row[item.prop] }}</span>-->
      <!--              </template>-->
      <!--            </el-table-column>-->

      <!--            <el-table-column-->
      <!--              align="center"-->
      <!--              label="操作"-->
      <!--              show-overflow-tooltip-->
      <!--              sortable-->
      <!--              width="85"-->
      <!--            >-->
      <!--              <template #default="{ row }">-->
      <!--                <el-button type="text" @click="handleEdit(row)">编辑</el-button>-->
      <!--                <el-button type="text" @click="handleDelete(row)">-->
      <!--                  删除-->
      <!--                </el-button>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <template #empty>-->
      <!--              <el-empty />-->
      <!--            </template>-->
      <!--          </el-table>-->
      <!--          <el-pagination-->
      <!--            background-->
      <!--            :current-page="queryForm.pageNo"-->
      <!--            :layout="layout"-->
      <!--            :page-size="queryForm.pageSize"-->
      <!--            :total="total"-->
      <!--            @current-change="handleCurrentChange"-->
      <!--            @size-change="handleSizeChange"-->
      <!--          />-->
      <!--        </el-tab-pane>-->
      <!--      </el-tabs> -->
      <!--      改为配置低代码-->
    </div>
  </div>
</template>

<script>
  import { getDict, delDict } from '@/api/Dict'
  import { getList } from '@/api/Mock/table'
  import { queryView } from '@/api/View'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        amis: [],
        detail: {},
        activeName: 0,
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
      finallyColumns() {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    created() {
      this.queryDetails(this.$route.query.objectId)
      this.queryAmisDeatil(this.$route.query.objectId)
    },
    mounted() {
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
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 16:50:45
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async queryAmisDeatil(objectId) {
        const query = {
          where: {
            class: 'Ftechnology',
            type: 'amis',
            title: { $ne: null },
            key: objectId,
            objectId: { $ne: null },
          },
        }
        try {
          const { results = [] } = await queryView(query)
          this.amis = results
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
       * @Date: 2022-04-22 16:23:25
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async queryDetails(id) {
        try {
          this.detail = await getDict(id)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      setSelectRows(val) {
        this.selectRows = val
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
        this.imageList = []
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
        setTimeout(() => {
          this.listLoading = false
        }, 900)
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 10:59:24
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async busInfo(type, params) {
        console.log(type, params)
        switch (type) {
          case 'view':
            this.$router.push({
              path: `/design`,
              query: {
                type: 'amis',
                _class: 'Ftechnology',
                key: params.objectId,
              },
            })
            break
          case 'file':
            this.$message.success('归档成功')
            break
          case 'release':
            this.$message.success('发布成功')
            break
          case 'delete':
            // 二次删除确认
            await delDict(params.objectId)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.$router.go(-1)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除',
                })
              })
            break
          case 'edit':
            this.$message.success('编辑成功')
            break
          default:
            break
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 11:03:23
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handleClick(tab, event) {
        console.log(tab, event)
        try {
          this.fetchData()
          switch (tab.name) {
            case 'first':
              break
            case 'second':
              break
            case 'third':
              break
            case 'fourth':
              break
            default:
              break
          }
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;

    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
