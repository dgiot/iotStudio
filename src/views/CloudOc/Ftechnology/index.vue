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
          title="新增工艺路径"
        >
          <el-form
            ref="ftechnology"
            class="demo-ruleForm"
            label-width="110px"
            :model="ftechnology"
            :rules="rules"
            status-icon
          >
            <el-form-item label="工艺路径名称" prop="ftechnology.form.title">
              <el-input
                v-model="ftechnology.form.title"
                autocomplete="off"
                placeholder="请输入工艺路径名称"
              />
            </el-form-item>
            <el-form-item label="工艺路径编码" prop="ftechnology.form.code">
              <el-input
                v-model="ftechnology.form.code"
                autocomplete="off"
                placeholder="请输入工艺路径编码"
              />
            </el-form-item>
            <el-form-item
              label="工艺路径描述"
              prop="ftechnology.form.description"
            >
              <el-input
                v-model="ftechnology.form.description"
                autocomplete="off"
                placeholder="不超过500个字符"
                :rows="2"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="ftechnology.dialogVisible = false">
              取 消
            </el-button>
            <el-button type="primary" @click.native="submitForm('ftechnology')">
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
              <el-input v-model="queryForm.title" placeholder="标题" />
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
        <dgiot-query-form-right-panel>2</dgiot-query-form-right-panel>
      </dgiot-query-form>
      <el-row
        v-loading="loadingConfig"
        class="box-card"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
      >
        <el-col
          v-for="(o, index) in list"
          :key="index"
          :lg="4"
          :md="8"
          :sm="12"
          :xl="4"
          :xs="24"
        >
          <el-card class="card" shadow="hover">
            <el-row>
              <el-col :span="12">
                <el-image
                  :preview-src-list="[o.img]"
                  :src="o.img"
                  style="width: 100px; height: 100px"
                />
              </el-col>
              <el-col :span="12">
                <h3>{{ o.title }}</h3>
                <p class="time">编码: {{ o.code }}</p>
              </el-col>
            </el-row>

            <div style="padding: 14px">
              <p class="time">更新时间: {{ o.datetime }}</p>
              <p class="time">描述: {{ o.description }}</p>
              <div class="bottom clearfix">
                <el-button
                  @click.native="
                    $router.push('/oc/Ftechnology/detail/' + o.objectId)
                  "
                >
                  查看
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'

  export default {
    name: 'Index',
    components: {},
    props: {},
    data() {
      return {
        rules: {
          'ftechnology.form.title': [
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
          'ftechnology.form.code': [
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
          'ftechnology.form.description': [
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
       * @Date: 2022-04-21 17:47:28
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async submitForm(formName) {
        this.loadingConfig = true
        try {
          this.ftechnology.form.datetime = moment(moment.now()).format(
            'YYYY:MM:DD  HH:mm:ss'
          )
          this.ftechnology.form.img = 'https://img.xjh.me/random_img.php'
          console.log(this.ftechnology.form, formName)
          this.list.unshift(this.ftechnology.form)
          // this.$refs.ftechnology.validate((valid) => {
          //   if (valid) {
          //     alert('submit!')
          //   } else {
          //     console.log('error submit!!')
          //     return false
          //   }
          // })
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
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
        try {
          const {
            data: { list, total },
          } = await getList(this.queryForm)
          this.list = list
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
        width: 100%;
        height: 80vh;

        .card {
          margin: 20px;
        }

        .image {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
</style>
