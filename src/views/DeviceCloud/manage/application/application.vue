<template>
  <div class="application dgiot-container">
    <div class="addApplication" />
    <div
      class="appcontent"
      style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <el-card
        v-for="(item, index) in appdata"
        :key="index"
        class="box-card"
        style="width: 80%; margin-bottom: 10px; border: 1px solid #cccccc"
      >
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <i class="iconfont icon-yingyong" style="color: #666666" />
              <p
                style="
                  display: inline-block;
                  margin-top: 50px;
                  margin-left: 50px;
                "
              >
                {{ item.name }}
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              class="grid-content bg-purple"
              style="display: inline-block; margin-top: 30px"
            >
              <dl>
                <dt>
                  <!-- App ID -->
                  {{ 'App ID' }}
                  <el-tooltip
                    :content="
                      $translateTitle(
                        'product.TheonlyapplicationIDintheSDKcallingprocess'
                      )
                    "
                    placement="bottom"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </dt>
                <dd>{{ item.objectId }}</dd>
                <dt>
                  <!-- App Secret -->
                  {{ 'App Secret' }}
                  <el-tooltip
                    :content="$translateTitle('product.aaab')"
                    placement="bottom"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </dt>
                <dd>
                  <span v-if="item.isshow == false">
                    ********************
                    <el-link
                      style="margin-left: 5px; cursor: pointer"
                      type="primary"
                      :underline="false"
                      @click="xianshi(item.objectId, true)"
                    >
                      {{ $translateTitle('product.display') }}
                    </el-link>
                  </span>
                  <span v-else>
                    <span v-copyText="item.tag.appconfig.secret">
                      {{ item.tag.appconfig.secret }}
                    </span>
                    <el-link
                      style="margin-left: 5px; cursor: pointer"
                      type="primary"
                      :underline="false"
                      @click="xianshi(item.objectId, false)"
                    >
                      {{ $translateTitle('product.hidden') }}
                    </el-link>
                  </span>
                </dd>
              </dl>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <p class="editor">
                <strong>
                  <!-- 操作: -->
                  {{ $translateTitle('task.Operation') + ':' }}
                </strong>
              </p>
              <p class="editor">
                <el-link type="primary" @click.native="updateapp(item)">
                  <!-- 修改应用 -->
                  {{ $translateTitle('developer.Modifyapplication') }}
                </el-link>
              </p>
              <!--              <p class="editor">-->
              <!--                <el-link type="primary" @click.native="nodeDeployment(item)">-->
              <!--                  &lt;!&ndash; 节点部署 &ndash;&gt;-->
              <!--                  {{ $translateTitle('developer.Nodedeployment') }}-->
              <!--                </el-link>-->
              <!--              </p>-->
              <!--              <p class="editor">-->
              <!--                <el-link-->
              <!--                  type="primary"-->
              <!--                  @click.native="applicationDeployment(item)"-->
              <!--                >-->
              <!--                  &lt;!&ndash; 应用部署 &ndash;&gt;-->
              <!--                  {{ $translateTitle('developer.Applicationdeployment') }}-->
              <!--                </el-link>-->
              <!--              </p>-->
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pagesize"
        :page-sizes="[1, 5, 10]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!--修改应用信息-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="
        $translateTitle('product.modify') +
        $translateTitle('product.Applicationinformation')
      "
      :visible.sync="update"
      width="55%"
    >
      <div class="block">
        <el-form ref="form1" label-width="170px" :model="form1" :rules="Rule">
          <el-form-item label="应用名称" prop="name">
            <span style="width: 80%">{{ form1.name }}</span>
          </el-form-item>
          <el-form-item label="App Secret">
            <el-input v-model="form1.secret" readonly style="width: 80%">
              <el-button
                slot="append"
                icon="el-icon-refresh-right"
                @click="handleClickRefresh"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('application.tokeneffectivetime')"
          >
            <el-input
              v-model="form1.expires"
              :placheholder="$translateTitle('product.enterapptime')"
              style="width: 80%"
              type="number"
            />
            <span style="margin-left: 5px">
              <!-- 秒 -->
              {{ $translateTitle('task.Seconds') }}
            </span>
          </el-form-item>
          <el-form-item :label="$translateTitle('developer.describe')">
            <el-input
              v-model="form1.desc"
              :autosize="{ minRows: 2 }"
              :placheholder="$translateTitle('product.enterapptime')"
              style="width: 80%"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="updatedDefine('form1')">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  const Base64 = require('js-base64').Base64
  import { putRole, queryRole } from '@/api/Role'

  export default {
    data() {
      const validatorUrl = (rule, value, callback) => {
        var regStr =
          /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
        if (value === '' || value === null) {
          callback(new Error('请输入url地址'))
        } else if (!regStr.test(value)) {
          callback(new Error('请输入正确的url地址'))
        } else {
          callback()
        }
      }
      return {
        url: '',
        total: 0,
        pagesize: 5,
        start: 0,
        update: false,
        form1: {},
        dialogVisible: false,
        form: {},
        Rule: {
          desc: [
            {
              required: true,
              message: '请输入应用名称',
              trigger: 'blur',
            },
            {
              validator: (rule, value, callback) => {
                if (value.length === 0) {
                  callback(new Error('应用名称不能为空'))
                } else {
                  callback()
                }
              },
            },
          ],
          file: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          topo: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          graphql: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
          rest: [
            {
              trigger: 'blur',
              validator: validatorUrl,
            },
          ],
        },
        appdata: [],
        objectid: '',
        selectapp: [],
        arr: [],
        loading: false,
      }
    },
    created() {},
    mounted() {
      this.getAppdetail(this.pagesize, this.start)

      dgiotlog.log('this.$route.query', this.$route.query)

      if (this.$route.query && this.$route.query.projectName) {
        this.dialogVisible = true
        this.form.desc = this.$route.query.projectName
      }
    },
    methods: {
      Define(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.submit()
          } else {
            dgiotlog.log('error submit!!')
            return false
          }
        })
      },
      submit() {
        this.loading = true
        var ranNum = Math.ceil(Math.random() * 25)
        var session = Base64.encode(
          String.fromCharCode(65 + ranNum) +
            Math.ceil(Math.random() * 10000000) +
            Number(new Date())
        )

        const formParam = {
          file: this.form.file,
          graphql: this.form.graphql,
          rest: this.form.rest,
          topo: this.form.topo,
          home: this.form.home,
        }
      },

      async getAppdetail(pagesize, start) {
        dgiotlog.log(pagesize, start)
        const params = {
          skip: start,
          limit: pagesize,
          count: 'objectid',
          keys: 'tag,name,desc',
          order: 'createdAt', // -updatedAt  updatedAt
        }
        const { count, results } = await queryRole(params)
        this.appdata = results
        this.appdata.map((item) => {
          // dgiotlog.log(item)
          console.log(item?.tag?.appconfig)
          if (item?.tag?.appconfig?.secret) {
            item.isshow = false
          } else {
            item.tag.appconfig = {}
            item.tag.appconfig.secret = '暂未配置'
            item.isshow = true
          }
        })
        this.total = count
      },
      handleClickRefresh() {
        this.randomSecret()
      },

      // 产生随机secrets
      randomSecret() {
        const ranNum = Math.ceil(Math.random() * 25)
        this.form1.secret = Base64.encode(
          String.fromCharCode(65 + ranNum) +
            Math.ceil(Math.random() * 10000000) +
            Number(new Date())
        )
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.getAppdetail(this.pagesize, this.start)
      },
      handleCurrentChange(val) {
        this.start = Number(val - 1) * Number(this.pagesize)
        this.getAppdetail(this.pagesize, this.start)
      },
      updateapp(item) {
        this.update = true
        this.$set(this.form1, 'objectId', item.objectId)
        this.$set(this.form1, 'name', item.name)
        this.$set(this.form1, 'secret', item.tag.appconfig.secret)
        this.$set(this.form1, 'expires', item.tag.appconfig.expires)
        this.$set(this.form1, 'desc', item.tag.appconfig.desc)
        this.$set(this.form1, 'tag', item.tag)
      },
      updatedDefine(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.updateObj(this.form1.objectId)
          } else {
            dgiotlog.log('error submit!!')
            return false
          }
        })
      },
      async updateObj(objectId) {
        this.form1.tag.appconfig.secret = this.form1.secret
        this.form1.tag.appconfig.expires = this.form1.expires
        this.form1.tag.appconfig.desc = this.form1.desc
        var tag = {
          tag: this.form1.tag,
        }
        await putRole(objectId, tag)
          .then((res) => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'success',
              message: '应用修改成功',
            })
            this.getAppdetail(10, 0)
            this.update = false
          })
          .catch((e) => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: 'error',
              message: '应用修改失败' + e.error,
            })
            dgiotlog.log(e)
          })
      },
      // 跳转新增
      nodeDeployment(row) {
        // dgiotlog.log(row)
        this.$router.push({
          path: '/roles/server_control',
          query: {
            appid: row.objectId,
            appsecret: row.tag.appconfig.secret,
          },
        })
      },
      applicationDeployment(row) {
        this.$router.push({
          path: '/applicationManagement/addApp',
          query: {
            actionType: 'add',
            title: '新增应用',
            appObjectId: row.objectId,
            desc: row.desc,
            name: row.name,
          },
        })
      },
      // 显示，隐藏
      xianshi(objectId, flag) {
        // dgiotlog.log(objectId)
        var obj
        for (var i = 0; i < this.appdata.length; i++) {
          if (this.appdata[i].objectId == objectId) {
            obj = this.appdata[i]
            this.appdata[i].isshow = flag
            this.$set(this.appdata, i, obj)
          }
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .application {
    box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    background: #ffffff;
  }
</style>
<style lang="scss" scoped>
  .application .el-dialog__body {
    padding: 20px;
    border-bottom: 1px solid #333333;
  }

  .application .el-dialog__header {
    border-bottom: 1px solid #333333;
  }

  .application .el-dialog__title {
    font-size: 20px;
    font-weight: 900;
  }

  .application .el-dialog {
    border-radius: 10px;
  }

  .application .grid-content {
    text-align: center;
  }

  .application .grid-content dl dt {
    float: left;
    width: 160px;
    overflow: hidden;
    clear: left;
    font-weight: 700;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .application .grid-content dl dd {
    margin-bottom: 1em;
    margin-left: 180px;
    text-align: left;
  }

  .application .grid-content .editor {
    margin: 13px 0;
    text-align: left;
  }

  .application .el-card__body {
    font-size: 14px;
  }

  .application {
    height: calc(100vh - #{$base-top-bar-height} * 3 - 25px);
  }

  .application .appcontent .isbutton .el-button {
    position: absolute;
    top: -45px;
    right: 10%;
  }
</style>
