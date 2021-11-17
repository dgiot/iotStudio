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
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <i class="iconfont icon-yingyong" style="color: #666666" />
              <p>{{ item.name }}</p>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <dl>
                <dt>
                  <!-- App ID -->
                  {{ $translateTitle('product.appid') }}
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
                  {{ $translateTitle('product.appsecret') }}
                  <el-tooltip
                    :content="$translateTitle('product.aaab')"
                    placement="bottom"
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </dt>
                <dd v-if="item.isshow">
                  {{ item.tag.appconfig.secret }}
                </dd>
                <dd v-if="!item.isshow">
                  <i v-if="item.tag.appconfig.secret">
                    {{
                      item.tag.appconfig.secret.substr(0, 4) +
                      '********************' +
                      item.tag.appconfig.secret.substr(24)
                    }}
                    <el-button
                      round
                      size="samll"
                      style="position: absolute; top: 30px; margin-left: 10px"
                      @click="xianshi(item.objectId)"
                    >
                      <!-- 完整密钥 -->
                      {{ $translateTitle('product.fullkey') }}
                    </el-button>
                  </i>
                </dd>
                <dt>
                  <!-- 应用名称 -->
                  {{ $translateTitle('task.Applicationname') }}
                  <i class="el-icon-s-promotion" />
                </dt>
                <dd v-if="item.name">
                  {{ item.name }}
                </dd>
                <dd v-else>-</dd>
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
              <p class="editor">
                <el-link type="primary" @click.native="nodeDeployment(item)">
                  <!-- 节点部署 -->
                  {{ $translateTitle('developer.Nodedeployment') }}
                </el-link>
              </p>
              <p class="editor">
                <el-link
                  type="primary"
                  @click.native="applicationDeployment(item)"
                >
                  <!-- 应用部署 -->
                  {{ $translateTitle('developer.Applicationdeployment') }}
                </el-link>
              </p>
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

    <!--新建弹框-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="$translateTitle('developer.addapp')"
      :visible.sync="dialogVisible"
      width="55%"
    >
      <div
        v-loading="loading"
        class="block"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
      >
        <el-form ref="form" label-width="120px" :model="form" :rules="Rule">
          <!-- <el-form-item label="平台">
                <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                  <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
               </el-select>
          </el-form-item>-->
          <el-form-item
            :label="$translateTitle('application.applicationname')"
            prop="desc"
          >
            <el-input
              v-model="form.desc"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('application.applicationname')
              "
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('application.tokeneffectivetime')"
          >
            <el-input
              v-model="form.time"
              :placheholder="$translateTitle('product.enterapptime')"
              style="width: 80%"
              type="number"
            />
            <span style="margin-left: 5px">
              <!-- 秒 -->
              {{ $translateTitle('application.seconds') }}
            </span>
          </el-form-item>
          <el-form-item :label="$translateTitle('product.Wordpreviewserver')">
            <el-input
              v-model="form.wordpreview"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('product.Wordpreviewserver')
              "
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('product.Wordproductionserver')"
          >
            <el-input
              v-model="form.wordproduct"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('product.Wordproductionserver')
              "
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('application.fileresources')"
            prop="file"
          >
            <el-input
              v-model="form.file"
              :placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('application.Configurationresources')"
            prop="topo"
          >
            <el-input
              v-model="form.topo"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="Graphql API" prop="graphql">
            <el-input
              v-model="form.graphql"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="Restful API" prop="rest">
            <el-input
              v-model="form.rest"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="home">
            <el-input
              v-model="form.home"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('developer.path')
              "
              style="width: 80%"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          <!-- 取消 -->
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click.native="Define('form')">
          <!-- 确定 -->
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>

    <!--修改应用信息-->
    <!-- <el-dialog
  :append-to-body="true"
      :visible.sync="update"
      :close-on-click-modal="false"
      title="修改应用信息"
      width="55%"
    > -->
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
          <!-- <el-form-item label="应用名称" prop="desc">
            <el-input v-model="form1.desc" style="width:80%" />
          </el-form-item> -->
          <el-form-item :label="$translateTitle('application.Accesskey')">
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
              v-model="form1.time"
              :placheholder="$translateTitle('product.enterapptime')"
              style="width: 80%"
              type="number"
            />
            <span style="margin-left: 5px">
              <!-- 秒 -->
              {{ $translateTitle('task.Seconds') }}
            </span>
          </el-form-item>
          <el-form-item :label="$translateTitle('product.Wordpreviewserver')">
            <el-input
              v-model="form1.wordpreview"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('product.Wordpreviewserver')
              "
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item
            :label="$translateTitle('product.Wordproductionserver')"
          >
            <el-input
              v-model="form1.wordproduct"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('product.Wordproductionserver')
              "
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('application.fileresources')"
            prop="file"
          >
            <el-input
              v-model="form1.file"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item
            :label="$translateTitle('application.Configurationresources')"
            prop="topo"
          >
            <el-input
              v-model="form1.topo"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="Graphql API" prop="graphql">
            <el-input
              v-model="form1.graphql"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="Restful API" prop="rest">
            <el-input
              v-model="form1.rest"
              placheholder="$translateTitle('product.enter1') + url"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item label="home">
            <el-input
              v-model="form1.home"
              :placheholder="
                $translateTitle('product.enter1') +
                $translateTitle('developer.path')
              "
              style="width: 80%"
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
        total: 0,
        pagesize: 10,
        start: 0,
        update: false,
        form1: {
          name: '',
          product: '',
          time: '',
          file: '',
          graphql: '',
          rest: '',
          topo: '',
          secret: '',
          desc: '',
          home: '',
          wordpreview: 'http://pump.iotn2n.com:8012',
          wordproduct: 'http://pump.iotn2n.com',
        },
        dialogVisible: false,
        form: {
          name: '',
          product: '',
          time: '18000',
          file: 'http://file.iotn2n.com/shapes/upload',
          graphql: 'http://cad.iotn2n.com:5080/graphql',
          rest: 'http://cad.iotn2n.com:5080/iotapi',
          topo: 'http://shapes.iotn2n.com/',
          secret: '',
          home: 'D:/shuwa/shuwa_data_center',
          wordpreview: 'http://pump.iotn2n.com:8012',
          wordproduct: 'http://pump.iotn2n.com/',
        },
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
    //   watch:{
    //      appdata:{
    //          handler(newVal) {
    //          console.log(newVal)
    //       },
    //       deep:true
    //      }

    //   },
    mounted() {
      this.getAppdetail(this.pagesize, this.start)

      console.log('this.$route.query', this.$route.query)

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
            console.log('error submit!!')
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
        console.log(pagesize, start)
        const params = {
          skip: start,
          limit: pagesize,
          keys: 'tag,name,desc,count(*)',
          order: 'updatedAt', // -updatedAt  updatedAt
        }
        queryRole(params)
          .then((res) => {
            this.appdata = res.results
            this.appdata.map((item) => {
              // console.log(item)
              if (item.tag.appconfig.secret) {
                item.isshow = false
              }
            })
            this.total = res.count
            // console.log(this.appdata, "appdata");
          })
          .catch((e) => {
            console.log(e)
          })
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
        this.form1.objectId = item.objectId
        this.form1.time = item.tag.appconfig.expires
        this.form1.file = item.tag.appconfig.file
        this.form1.rest = item.tag.appconfig.rest
        this.form1.topo = item.tag.appconfig.topo
        this.form1.graphql = item.tag.appconfig.graphql
        this.form1.home = item.tag.appconfig.home

        this.form1.secret = item.tag.appconfig.secret
        this.form1.desc = item.tag.appconfig.desc
      },
      updatedDefine(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.updateObj(this.form1.objectId)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async updateObj(objectId) {
        const formParam = {
          expires: this.form1.time,
          file: this.form1.file,
          graphql: this.form1.graphql,
          rest: this.form1.rest,
          topo: this.form1.topo,
          home: this.form1.home,
          secret: this.form1.secret,
          wordpreview: this.form1.home,
          wordproduct: this.form1.secret,
        }
        var tag = {
          appconfig: {},
        }
        tag.appconfig = formParam
        // console.log(tag.appconfig);
        await putRole(objectId, tag)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '应用修改成功',
            })
            this.getAppdetail(10, 0)
            this.update = false
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: '应用修改失败' + e.error,
            })
            console.log(e)
          })
      },
      // 跳转新增
      nodeDeployment(row) {
        // console.log(row)
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
      xianshi(objectId) {
        // console.log(objectId)
        var obj
        for (var i = 0; i < this.appdata.length; i++) {
          if (this.appdata[i].objectId == objectId) {
            obj = this.appdata[i]
            this.appdata[i].isshow = true
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
