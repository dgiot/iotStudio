<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-30 09:37:57
* @LastEditors: 9:37
* @LastEditTime: 2022-03-30 09:37:57
* @Description:
* @FilePath: src\views\CloudOc\Ftechnology\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div class="index-container">
    <dgiot-input
      ref="uploadFinish"
      :params="inputParams"
      @fileInfo="fileInfo"
      @files="files"
    />
    <div class="ftechnology">
      <div class="dlalog">
        <dgiot-dialog
          :key="ftechnology.type"
          :show.sync="ftechnology.dialogVisible"
          :title="ftechnology.type == 'add' ? '新增工艺路径' : '修改工艺路径'"
          @beforeClose="handleClose"
        >
          <el-form
            ref="ftechnology"
            class="demo-ruleForm"
            label-width="110px"
            :model="ftechnology"
            :rules="rules"
            status-icon
          >
            <el-form-item label="工艺路径名称" prop="form.title">
              <el-input
                v-model="ftechnology.form.title"
                autocomplete="off"
                placeholder="请输入工艺路径名称"
              />
            </el-form-item>
            <el-form-item label="工艺路径编码" prop="form.code">
              <el-input
                v-model="ftechnology.form.code"
                autocomplete="off"
                placeholder="请输入工艺路径编码"
              />
            </el-form-item>
            <el-form-item label="工艺路径描述" prop="form.description">
              <el-input
                v-model="ftechnology.form.description"
                autocomplete="off"
                placeholder="不超过500个字符"
                :rows="2"
                type="textarea"
              />
            </el-form-item>
            <el-form-item :key="ftechnology.form.img" label="工艺路径logo">
              <el-avatar
                :key="imgKey"
                :size="100"
                :src="$FileServe + ftechnology.form.img"
                @click.native="uploadCkick('userinfo.avatar')"
              >
                <div
                  v-if="!ftechnology.form.img"
                  :key="ftechnology.form.img"
                  slot="error"
                  class="el-icon-plus avatar-uploader-icon"
                  @click="uploadCkick('userinfo.avatar')"
                ></div>
              </el-avatar>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取 消</el-button>
            <el-button
              type="primary"
              @click.native="submitForm('ftechnology', ftechnology.type)"
            >
              确 定
            </el-button>
          </div>
        </dgiot-dialog>
      </div>
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
              <el-input
                v-model="queryForm.title"
                placeholder="请输入工艺路径名称"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                native-type="submit"
                type="primary"
                @click.native="handleQuery"
              >
                查询
              </el-button>
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click.native="ftechnology.dialogVisible = true"
              >
                添加工艺路径
              </el-button>
            </el-form-item>
          </el-form>
        </dgiot-query-form-left-panel>
      </dgiot-query-form>
      <el-empty v-show="total === 0" :image-size="$baseTableHeight(0) - 160" />
      <el-row
        v-loading="loadingConfig"
        class="box-card"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
        :gutter="20"
      >
        <el-col
          v-for="(o, index) in list"
          :key="index"
          :lg="6"
          :md="8"
          :sm="12"
          :xl="6"
          :xs="24"
        >
          <el-card class="card" shadow="hover">
            <div class="box">
              <div class="left">
                <el-avatar
                  :key="imgKey"
                  :src="$FileServe + o.data.img"
                  style="width: 100px; height: 100px"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-avatar>
              </div>
              <div class="right">
                <el-descriptions
                  :column="1"
                  size="medium"
                  :title="o.data.title"
                >
                  <el-descriptions-item label="编码" :title="o.data.code">
                    {{ o.data.code }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    label="描述"
                    :title="o.data.description"
                  >
                    {{ o.data.description }}
                  </el-descriptions-item>
                  <el-descriptions-item label="更新时间" :title="o.updatedAt">
                    {{ $moment(o.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div slot="header" class="clearfix">
              <span
                style="
                  font-size: 14px;
                  font-weight: 700;
                  line-height: 22px;
                  color: #333;
                "
              >
                {{ o.data.title }}
              </span>
              <div style="float: right">
                <el-button
                  size="mini"
                  type="primary"
                  @click.native="
                    $router.push({
                      path: '/oc/Ftechnology/detail',
                      query: {
                        objectId: o.objectId,
                      },
                    })
                  "
                >
                  查看
                </el-button>
                <el-button
                  size="mini"
                  type="warning"
                  @click.native="editItem(o)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.native="deleteItem(o.objectId, index, list)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        background
        :current-page="queryForm.size"
        :layout="layout"
        :page-size="queryForm.limit"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
  // import { doDelete, getList, doEdit } from '@/api/Mock/table'
  import { queryDict, delDict, putDict, postDict } from '@/api/Dict'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Index',
    components: {},
    props: {},
    data() {
      return {
        imgKey: moment().format('x'),
        inputParams: {},
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        rules: {
          'form.title': [
            {
              required: true,
              message: '请输入工艺路径名称',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 15,
              message: '长度在 1 到 15 个字符',
              trigger: 'blur',
            },
          ],
          'form.code': [
            {
              required: true,
              message: '请输入工艺路径编码',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 15,
              message: '长度在 1 到 15 个字符',
              trigger: 'blur',
            },
          ],
          'form.description': [
            {
              required: false,
              message: '请输入工艺路径描述',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 500,
              message: '长度在 1 到 500 个字符',
              trigger: 'blur',
            },
          ],
        },
        ftechnology: {
          type: 'add',
          objectId: '',
          dialogVisible: false,
          form: {
            title: '',
            description: '',
            code: '',
          },
        },
        list: [],
        loadingConfig: false,
        upNodeType: '',
        queryForm: {
          title: '',
          skip: 0,
          limit: 8,
          name: '',
          search: '',
        },
        currentDate: new Date().toLocaleString(),
      }
    },
    computed: {
      ...mapGetters({
        ObjectId: 'user/objectId',
      }),
    },
    watch: {},
    created() {
      this.fetechData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      uploadCkick(type) {
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
        this.inputParams = {
          file: '',
          scene: 'app',
          path: 'user/Ftechnology/',
          filename: `${this.ObjectId}_Ftechnology_${this.upNodeType.replace(
            '.',
            '_'
          )}.${type}`,
        }
      },
      fileInfo(file) {
        console.log(file)
        this.$baseMessage(
          '上传成功',
          `${file.name} 上传成功，请点击确定按钮，查看图片`,
          'success',
          false,
          'dgiot-hey-message-success'
        )
        this.imgKey = moment().format('x')
        this.ftechnology.form.img = file.path + '?' + new Date().getTime()
      },
      files(file, type) {
        this.inputParams.filename = `${this.ObjectId}_${this.upNodeType.replace(
          '.',
          '_'
        )}.${type}`
        this.inputParams.file = file
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 15:43:20
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      editItem(params) {
        this.ftechnology.objectId = params.objectId
        this.ftechnology.dialogVisible = true
        this.ftechnology.form = params.data
        this.ftechnology.type = 'edit'
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 15:34:21
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async deleteItem(objectId, index, list) {
        this.$baseConfirm('你确定要删除选中项吗', null, async () => {
          await delDict(objectId)
          list.splice(index, 1)
          this.$baseMessage('删除成功', 'success', 'dgiot-hey-message-success')
        })
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetechData()
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetechData()
      },
      handleClose() {
        this.ftechnology.type = 'add'
        this.ftechnology.objectId = ''
        this.ftechnology.dialogVisible = false
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 17:47:28
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async submitForm(formName, type) {
        this.loadingConfig = true
        if (type === 'add') {
          try {
            const { error } = await postDict({
              type: 'technology',
              data: this.ftechnology.form,
              class: 'technology',
              key: this.ftechnology.form.code,
            })
            if (error) {
              this.$baseMessage(error, 'error', 'dgiot-hey-message-error')
              this.loadingConfig = false
              return
            }
            this.fetechData()
          } catch (error) {
            console.log(error)
            this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'dgiot-hey-message-error'
            )
          }
        } else {
          await putDict(this.ftechnology.objectId, {
            data: this.ftechnology.form,
          })
          this.$baseMessage(
            '数据更新成功',
            'success',
            'dgiot-hey-message-success'
          )
        }
        this.ftechnology.dialogVisible = false
        setTimeout(() => {
          this.loadingConfig = false
        }, 1200)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 16:45:53
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async fetechData(params) {
        this.loadingConfig = true
        // this.list = []
        // this.queryForm
        const queryForm = {
          where: {
            type: 'technology',
          },
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
        }
        try {
          const { results = [], count } = await queryDict(queryForm)
          this.list = results
          this.total = count
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
        setTimeout(() => {
          this.loadingConfig = false
        }, 100)
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 16:42:38
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async handleQuery() {
        this.loadingConfig = true
        this.queryForm.limit = 8
        await this.fetechData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .index-container {
    width: 100%;
    height: 100%;

    .ftechnology {
      width: 100%;
      height: 100%;

      .box-card {
        .card {
          margin: 10px;

          .box {
            display: flex;
            justify-content: space-between;
            margin: 5px 0 0 0;

            .left {
              flex: 1;
              text-align: center;
            }

            .right {
              flex: 3;
              margin-left: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .time {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .image {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
</style>
