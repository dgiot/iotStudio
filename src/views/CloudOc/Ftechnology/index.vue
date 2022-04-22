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
    <div class="ftechnology">
      <div class="dlalog">
        <dgiot-dialog
          :show.sync="ftechnology.dialogVisible"
          :title="ftechnology.type == 'add' ? '新增工艺路径' : '修改工艺路径'"
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
            <el-form-item label="工艺路径logo">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
              >
                <img
                  v-if="ftechnology.form.img"
                  class="avatar"
                  :src="ftechnology.form.img"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="ftechnology.dialogVisible = false">
              取 消
            </el-button>
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
                <el-image
                  fit="scale-down"
                  :preview-src-list="[o.img]"
                  :src="o.img"
                  style="width: 100px; height: 100px"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="right">
                <el-descriptions :column="1" size="medium">
                  <el-descriptions-item label="编码" :title="o.code">
                    {{ o.code }}
                  </el-descriptions-item>
                  <el-descriptions-item label="描述" :title="o.description">
                    {{ o.description }}
                  </el-descriptions-item>
                  <el-descriptions-item label="更新时间" :title="o.datetime">
                    {{ o.datetime }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
            <div slot="header" class="clearfix">
              <span
                style="
                  font-size: 14px;
                  color: #333;
                  line-height: 22px;
                  font-weight: 700;
                "
              >
                {{ o.title }}
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
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
  import { doDelete, getList, doEdit } from '@/api/Mock/table'

  export default {
    name: 'Index',
    components: {},
    props: {},
    data() {
      return {
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
          dialogVisible: false,
          form: {
            title: '',
            description: '',
            code: '',
          },
        },
        list: [],
        loadingConfig: false,
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        currentDate: new Date().toLocaleString(),
      }
    },
    computed: {},
    watch: {},
    created() {
      this.fetechData()
    },
    mounted() {},
    destroyed() {},
    methods: {
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-22 15:43:20
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      editItem(params) {
        this.ftechnology.dialogVisible = true
        this.ftechnology.form = params
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
          const { msg } = await doDelete({ ids: objectId })
          list.splice(index, 1)
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
        })
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetechData()
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetechData()
      },
      beforeAvatarUpload(file) {
        var extension = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/jpg',
          'image/webp',
          'image/svg+xml',
          'image/tiff',
          'image/x-icon',
        ]
        const isJPG = extension.includes(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$baseMessage(
            '上传图片格式不正确!',
            'error',
            'dgiot-hey-message-error'
          )
        }
        if (!isLt2M) {
          this.$baseMessage(
            '上传头像图片大小不能超过 2MB!',
            'error',
            'dgiot-hey-message-error'
          )
        }
        return isJPG && isLt2M
      },
      handleAvatarSuccess(res, file) {
        this.ftechnology.form.img = URL.createObjectURL(file.raw)
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
            this.ftechnology.form.datetime = moment(moment.now()).format(
              'YYYY:MM:DD  HH:mm:ss'
            )
            console.log(this.ftechnology.form, formName)
            this.list.unshift(this.ftechnology.form)
          } catch (error) {
            console.log(error)
            this.$baseMessage(
              this.$translateTitle('alert.Data request error') + `${error}`,
              'error',
              'dgiot-hey-message-error'
            )
          }
        } else {
          const { msg } = await doEdit(
            this.ftechnology.form.objectId,
            this.ftechnology.form
          )
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
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
        this.list = []
        try {
          const {
            data: { list, total },
          } = await getList(this.queryForm)
          this.list = list
          this.total = total
          console.log(list)
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
        }, 1000)
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
        this.queryForm.pageNo = 1
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
            margin: 5px 0 0 0;
            display: flex;
            justify-content: space-between;

            .left {
              text-align: center;
              flex: 1;
            }

            .right {
              flex: 3;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin-left: 10px;
            }
          }
        }

        .time {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .image {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
</style>
