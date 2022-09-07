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
      <div class="dialog">
        <dgiot-dialog
          :show.sync="dialog.processes.visible"
          @beforeClose="handleClose"
        >
          <el-form
            ref="processes"
            class="demo-ruleForm"
            label-width="100px"
            :model="dialog.processes.form"
            :rules="processes"
          >
            <el-form-item label="工序名称" prop="title">
              <el-input v-model="dialog.processes.form.title" />
            </el-form-item>
            <el-form-item label="工序编码" prop="type">
              <el-input v-model="dialog.processes.form.type" />
            </el-form-item>
            <el-form-item label="工序描述" prop="key">
              <el-input v-model="dialog.processes.form.key" type="textarea" />
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center">
              <el-button
                v-if="dialog.isAdd == true"
                type="primary"
                @click="submitForm('processes', 'processes', 'submit')"
              >
                立即创建
              </el-button>
              <el-button
                v-if="dialog.isAdd === false"
                type="primary"
                @click="submitForm('processes', 'processes', 'edit')"
              >
                修改
              </el-button>
              <el-button @click="resetForm('processes', 'processes')">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </dgiot-dialog>
        <dgiot-dialog
          :show.sync="dialog.properties.visible"
          @beforeClose="handleClose"
        >
          <el-form
            ref="properties"
            class="demo-ruleForm"
            label-width="160px"
            :model="dialog.properties.form"
            :rules="properties"
          >
            <el-form-item label="工艺路径属性名称" prop="title">
              <el-input v-model="dialog.properties.form.title" />
            </el-form-item>
            <el-form-item label="工艺路径属性标识" prop="type">
              <el-input v-model="dialog.properties.form.type" />
            </el-form-item>
            <el-form-item label="工艺路径属性值" prop="key">
              <el-input v-model="dialog.properties.form.key" type="textarea" />
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center">
              <el-button
                v-if="dialog.isAdd == true"
                type="primary"
                @click="submitForm('properties', 'properties', 'submit')"
              >
                立即创建
              </el-button>
              <el-button
                v-if="dialog.isAdd === false"
                type="primary"
                @click="submitForm('properties', 'properties', 'edit')"
              >
                修改
              </el-button>
              <el-button @click="resetForm('properties', 'properties')">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </dgiot-dialog>
        <!--        <dgiot-dialog   @beforeClose="handleClose" :show.sync="dialog.processes.visible">-->
        <!--          <el-form-->
        <!--            ref="ruleForm"-->
        <!--            class="demo-ruleForm"-->
        <!--            label-width="100px"-->
        <!--            :model="dialog.processes.form"-->
        <!--            :rules="rules"-->
        <!--          >-->
        <!--            <el-form-item label="工序名称" prop="name">-->
        <!--              <el-input v-model="dialog.processes.form.name" />-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label="工序编码" prop="code">-->
        <!--              <el-input v-model="dialog.processes.form.code" />-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label="工序描述" prop="name">-->
        <!--              <el-input-->
        <!--                v-model="dialog.processes.form.description"-->
        <!--                type="textarea"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label-width="0" style="text-align: center">-->
        <!--              <el-button-->
        <!--                type="primary"-->
        <!--                @click="submitForm('ruleForm', 'processes')"-->
        <!--              >-->
        <!--                立即创建-->
        <!--              </el-button>-->
        <!--              <el-button @click="resetForm('ruleForm', 'processes')">-->
        <!--                重置-->
        <!--              </el-button>-->
        <!--            </el-form-item>-->
        <!--          </el-form>-->
        <!--        </dgiot-dialog>-->
      </div>
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
          <!--          <el-button-->
          <!--            type="warning"-->
          <!--            @click.native="busInfo('release', $route.query)"-->
          <!--          >-->
          <!--            发布-->
          <!--          </el-button>-->
          <el-button
            type="danger"
            @click.native="busInfo('delete', $route.query)"
          >
            删除
          </el-button>
        </template>
      </el-descriptions>
      <!--      <el-tabs v-model="activeName">-->
      <!--        <el-tab-pane-->
      <!--          v-for="(item, index) in amis"-->
      <!--          :key="index"-->
      <!--          :label="item.title"-->
      <!--          :name="index"-->
      <!--        >-->
      <!--          <dgiot-amis :schema="item.data" :show-help="false" />-->
      <!--        </el-tab-pane>-->
      <!--      </el-tabs>-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="工序列表" name="first">
          <dgiot-query-form>
            <dgiot-query-form-left-panel>
              工艺路径工序
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
              <el-form
                ref="form"
                :inline="true"
                label-width="0"
                :model="queryForm"
                @submit.native.prevent
              >
                <el-form-item>
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
                  <el-button
                    icon="el-icon-plus"
                    type="primary"
                    @click.native="dialog.processes.visible = true"
                  >
                    新增工序
                  </el-button>
                </el-form-item>
              </el-form>
            </dgiot-query-form-right-panel>
          </dgiot-query-form>
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :border="border"
            :data="amis.processes"
            :height="height"
            :size="lineHeight"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              label="工序名称"
              prop="title"
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              label="工序编码"
              prop="type"
              sortable
              width="auto"
            />
            <!--            <el-table-column-->
            <!--              align="center"-->
            <!--              label="工序状态"-->
            <!--              prop="status"-->
            <!--              sortable-->
            <!--              width="auto"-->
            <!--            />-->
            <el-table-column
              align="center"
              label="工序描述"
              prop="key"
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              label="操作"
              show-overflow-tooltip
              sortable
              width="auto"
            >
              <template #default="{ row, $index }">
                <el-button
                  type="text"
                  @click="handleEdit(row, $index, amis.processes, 'processes')"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="
                    handleDelete(row, $index, amis.processes, 'processes')
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty />
            </template>
          </el-table>
          <!--          <el-pagination-->
          <!--            background-->
          <!--            :current-page="queryForm.pageNo"-->
          <!--            :layout="layout"-->
          <!--            :page-size="queryForm.pageSize"-->
          <!--            :total="total"-->
          <!--            @current-change="handleCurrentChange"-->
          <!--            @size-change="handleSizeChange"-->
          <!--          />-->
        </el-tab-pane>
        <el-tab-pane label="属性列表" name="second">
          <dgiot-query-form>
            <dgiot-query-form-left-panel>
              工艺路径属性
            </dgiot-query-form-left-panel>
            <dgiot-query-form-right-panel>
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
                    placeholder="请输入工艺路径名称"
                  />
                </el-form-item>
                <el-form-item>
                  <!--                  <el-button-->
                  <!--                    icon="el-icon-search"-->
                  <!--                    native-type="submit"-->
                  <!--                    type="primary"-->
                  <!--                    @click.native="handleQuery"-->
                  <!--                  >-->
                  <!--                    查询-->
                  <!--                  </el-button>-->
                  <el-button
                    icon="el-icon-plus"
                    type="primary"
                    @click.native="dialog.properties.visible = true"
                  >
                    新增属性
                  </el-button>
                </el-form-item>
              </el-form>
            </dgiot-query-form-right-panel>
          </dgiot-query-form>
          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :border="border"
            :data="amis.properties"
            :height="height"
            :size="lineHeight"
            :stripe="stripe"
          >
            <el-table-column
              align="center"
              label="属性名称"
              prop="title"
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              label="属性标识"
              prop="key"
              sortable
              width="auto"
            />
            <el-table-column
              align="center"
              label="属性值"
              prop="key"
              sortable
              width="auto"
            />
            <!--            <el-table-column-->
            <!--              align="center"-->
            <!--              label="工序状态"-->
            <!--              prop="status"-->
            <!--              sortable-->
            <!--              width="auto"-->
            <!--            />-->

            <el-table-column
              align="center"
              label="操作"
              show-overflow-tooltip
              sortable
              width="85"
            >
              <template #default="{ row, $index }">
                <el-button
                  type="text"
                  @click="
                    handleEdit(row, $index, amis.properties, 'properties')
                  "
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="
                    handleDelete(row, $index, amis.properties, 'properties')
                  "
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty />
            </template>
          </el-table>
          <!--          <el-pagination-->
          <!--            background-->
          <!--            :current-page="queryForm.pageNo"-->
          <!--            :layout="layout"-->
          <!--            :page-size="queryForm.pageSize"-->
          <!--            :total="total"-->
          <!--            @current-change="handleCurrentChange"-->
          <!--            @size-change="handleSizeChange"-->
          <!--          />-->
        </el-tab-pane>
        <!--        <el-tab-pane label="可执行产线" name="third">-->
        <!--          &lt;!&ndash;          <dgiot-query-form>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <dgiot-query-form-left-panel>&ndash;&gt;-->
        <!--          &lt;!&ndash;              可执行产线&ndash;&gt;-->
        <!--          &lt;!&ndash;            </dgiot-query-form-left-panel>&ndash;&gt;-->
        <!--          &lt;!&ndash;            <dgiot-query-form-right-panel>&ndash;&gt;-->
        <!--          &lt;!&ndash;              <el-form&ndash;&gt;-->
        <!--          &lt;!&ndash;                ref="form"&ndash;&gt;-->
        <!--          &lt;!&ndash;                :inline="true"&ndash;&gt;-->
        <!--          &lt;!&ndash;                label-width="0"&ndash;&gt;-->
        <!--          &lt;!&ndash;                :model="queryForm"&ndash;&gt;-->
        <!--          &lt;!&ndash;                @submit.native.prevent&ndash;&gt;-->
        <!--          &lt;!&ndash;              >&ndash;&gt;-->
        <!--          &lt;!&ndash;                <el-form-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <el-input&ndash;&gt;-->
        <!--          &lt;!&ndash;                    v-model="queryForm.title"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    placeholder="请输入工艺路径名称"&ndash;&gt;-->
        <!--          &lt;!&ndash;                  />&ndash;&gt;-->
        <!--          &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;                <el-form-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <el-button&ndash;&gt;-->
        <!--          &lt;!&ndash;                    icon="el-icon-search"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    native-type="submit"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    type="primary"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    @click.native="handleQuery"&ndash;&gt;-->
        <!--          &lt;!&ndash;                  >&ndash;&gt;-->
        <!--          &lt;!&ndash;                    查询&ndash;&gt;-->
        <!--          &lt;!&ndash;                  </el-button>&ndash;&gt;-->
        <!--          &lt;!&ndash;                  <el-button&ndash;&gt;-->
        <!--          &lt;!&ndash;                    icon="el-icon-plus"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    type="primary"&ndash;&gt;-->
        <!--          &lt;!&ndash;                    @click.native="ftechnology.dialogVisible = true"&ndash;&gt;-->
        <!--          &lt;!&ndash;                  >&ndash;&gt;-->
        <!--          &lt;!&ndash;                    添加工艺路径&ndash;&gt;-->
        <!--          &lt;!&ndash;                  </el-button>&ndash;&gt;-->
        <!--          &lt;!&ndash;                </el-form-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;              </el-form>&ndash;&gt;-->
        <!--          &lt;!&ndash;            </dgiot-query-form-right-panel>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </dgiot-query-form>&ndash;&gt;-->
        <!--          <el-table-->
        <!--            ref="tableSort"-->
        <!--            v-loading="listLoading"-->
        <!--            :border="border"-->
        <!--            :data="detail.data.production"-->
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
        <!--          &lt;!&ndash;          <el-pagination&ndash;&gt;-->
        <!--          &lt;!&ndash;            background&ndash;&gt;-->
        <!--          &lt;!&ndash;            :current-page="queryForm.pageNo"&ndash;&gt;-->
        <!--          &lt;!&ndash;            :layout="layout"&ndash;&gt;-->
        <!--          &lt;!&ndash;            :page-size="queryForm.pageSize"&ndash;&gt;-->
        <!--          &lt;!&ndash;            :total="total"&ndash;&gt;-->
        <!--          &lt;!&ndash;            @current-change="handleCurrentChange"&ndash;&gt;-->
        <!--          &lt;!&ndash;            @size-change="handleSizeChange"&ndash;&gt;-->
        <!--          &lt;!&ndash;          />&ndash;&gt;-->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { getDict, delDict, putDict, postDict, queryDict } from '@/api/Dict'
  import { getList } from '@/api/Mock/table'
  import { queryView } from '@/api/View'
  import { delDevice } from '@/api/Device'

  export default {
    name: 'Index',
    components: {},
    data() {
      return {
        amis: {
          processes: [],
          properties: [],
        },
        detail: {},
        activeName: 'first',
        properties: {
          title: [
            {
              required: true,
              message: '请输入工艺路径属性名称',
              trigger: 'blur',
            },
          ],
          type: [
            {
              required: true,
              message: '请输入工艺路径属性标识',
              trigger: 'blur',
            },
          ],

          key: [
            {
              required: true,
              message: '请输入工艺路径属性值',
              trigger: 'blur',
            },
            {
              min: 0,
              max: 50,
              message: '长度在 0 到 50 个字符',
              trigger: 'blur',
            },
          ],
        },
        processes: {
          name: [
            { required: true, message: '请输入工序名称', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入工序编码', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入工序名称', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请输入工序编码', trigger: 'blur' },
          ],
          key: [
            { required: false, message: '请输入工序描述', trigger: 'blur' },
            {
              min: 0,
              max: 50,
              message: '长度在 5 到 50 个字符',
              trigger: 'blur',
            },
          ],
        },
        dialog: {
          editRow: {},
          isAdd: true,
          properties: {
            visible: false,
            form: {
              name: '',
              code: '',
              value: '',
            },
          },
          processes: {
            visible: false,
            form: {
              name: '',
              code: '',
              description: '',
            },
          },
          production: {
            visible: false,
            form: {
              name: '',
              code: '',
              description: '',
            },
          },
        },
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
      submitForm(formName, type, module) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // this.detail.data[formName].push(this.dialog[type].form)
            const childDict = {
              // name: this.dialog[type].form.name,
              // code: this.dialog[type].form.code,
              // description: this.dialog[type].form.description,
              // classe: '',
              title: this.dialog[type].form.title,
              data: {},
              type: this.dialog[type].form.type,
              class: type,
              key: this.dialog[type].form.key,
              parent: {
                __type: 'Pointer',
                className: 'Dict',
                objectId: this.$route.query.objectId,
              },
            }
            if (module == 'submit') await postDict(childDict)
            else await putDict(this.editRow.row.objectId, childDict)
            this.dialog[type].visible = false
            this.queryAmisDeatil(this.$route.query.objectId)
            this.resetForm(formName)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-28 20:47:14
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      handleEdit(row, index, list, type) {
        this.dialog[type].form = row
        this.dialog[type].visible = true
        this.dialog.isAdd = false
        this.editRow = { row, index, list, type }
      },
      handleClose() {
        this.dialog = {
          editRow: {},
          isAdd: true,
          properties: {
            visible: false,
            form: {
              name: '',
              code: '',
              value: '',
            },
          },
          processes: {
            visible: false,
            form: {
              name: '',
              code: '',
              description: '',
            },
          },
          production: {
            visible: false,
            form: {
              name: '',
              code: '',
              description: '',
            },
          },
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-28 20:47:40
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      handleDelete(row, index, list, type) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          list.splice(index, 1)
          await delDict(row.objectId)
          this.$baseMessage(
            this.$translateTitle('Maintenance.successfully deleted'),
            'success',
            'dgiot-hey-message-success'
          )
        })
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 16:50:45
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async queryAmisDeatil(objectId) {
        const queryprocesses = {
          where: {
            parent: objectId,
            class: 'processes',
          },
        }
        const queryproperties = {
          where: {
            parent: objectId,
            class: 'properties',
          },
        }
        try {
          const { results: processes = [] } = await queryDict(queryprocesses)
          const { results: properties = [] } = await queryDict(queryproperties)
          this.amis.processes = processes
          this.amis.properties = properties
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
          _.merge(this.detail, {
            data: { processes: [], properties: [], production: [] },
          })
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
            this.$baseMessage(
              '归档成功',
              'success',
              'dgiot-hey-message-success'
            )
            break
          case 'release':
            this.$baseMessage(
              '发布成功',
              'success',
              'dgiot-hey-message-success'
            )
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
                  showClose: true,
                  duration: 2000,
                  type: 'success',
                  message: '删除成功!',
                })
                this.$router.go(-1)
              })
              .catch(() => {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: 'info',
                  message: '已取消删除',
                })
              })
            break
          case 'edit':
            this.$baseMessage(
              '编辑成功',
              'success',
              'dgiot-hey-message-success'
            )
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
