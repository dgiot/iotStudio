<template>
  <div id="addApp">
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/roles/applicationManagement' }">
          {{ $translateTitle('application.applicationmanagement') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ actionType == 'update' ? '编辑应用' : '新增应用' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        plain
        size="small"
        type="primary"
        @click="handleClickBack"
      >
        {{ $translateTitle('application.return') }}
      </el-button>
    </div>

    <div class="form">
      <div class="title">
        <p style="color: #f00">
          {{ '*' + $translateTitle('application.mustfillin') }}
        </p>
      </div>

      <el-form
        ref="form"
        label-width="180px"
        :model="form"
      >
        <!-- 工程名称 -->
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                label="工程单位"
                prop="department"
                :rules="[{ required: true, message: '工程单位不能为空' }]"
              >
                <el-input
                  v-model="form.department"
                  placeholder="工程单位"
                />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('application.applicationname')"
                prop="name"
                :rules="[{ required: true, message: '工程名称不能为空' }]"
              >
                <el-input
                  v-model="form.name"
                  :placeholder="$translateTitle('application.applicationname')"
                  readonly
                />
              </el-form-item>
              <!-- 工程链接 -->
              <el-form-item
                :label="$translateTitle('application.applicationlink')"
                prop="productIdentifier"
                :rules="[{ required: true, message: '工程链接不能为空' }]"
              >
                <!--         <el-input v-model="form.productIdentifier" placeholder="例：vcon" class="link">
                  <template slot="prepend">{{host}}</template>
                </el-input>
                -->
                <el-select
                  v-model="form.productIdentifier"
                  disabled
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in applicationList"
                    :key="item.id"
                    :label="host + item.desc"
                    :value="item.desc"
                  />
                </el-select>
              </el-form-item>
              <!-- 所属行业 -->
              <el-form-item
                :label="$translateTitle('application.industrytype')"
                prop="category"
                :rules="[
                  {
                    required: true,
                    message: '请选择所属行业',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-cascader
                  ref="category"
                  v-model="form.category"
                  clearable
                  :options="treeData"
                  :placeholder="$translateTitle('application.industrytype')"
                />
              </el-form-item>

              <el-form-item
                label="所属应用"
                :rules="[
                  {
                    required: true,
                    message: '请选择所属应用',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="form.relationApp"
                  placeholder="请选择所属应用"
                >
                  <template slot="append">
                    <i
                      :class="[
                        showTree ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                      ]"
                      style="cursor: pointer"
                      @click="showTree = !showTree"
                    />
                  </template>
                </el-input>
                <div v-if="showTree">
                  <el-tree
                    :data="allApps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                  />
                </div>
              </el-form-item>
              <!-- 所属应用(角色) app -->
              <!-- <el-form-item
                :label=" $translateTitle('application.applicationtype')"
                :rules="[
                  { required: true, message: '请选择所属应用',trigger: 'blur'},
                ]"
              >
                <el-input v-model="form.relationApp" :disabled="true"/>
              <!-
                  <el-option
                    v-for="item in applicationList"
                    :key="item.id"
                    :label="item.attributes.name"
                    :value="item.attributes.name"
                  ></el-option>
              -->

              <!-- </el-form-item>  -->
              <!--工程产品、-->
              <!-- <el-form-item label="工程产品">
                <el-select v-model="form.product" multiple placeholder="请选择">
                  <el-option
                    v-for="(item,index) in productlist"
                    :key="index"
                    :label="item.attributes.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>-->

              <!-- 工程描述 -->
              <el-form-item
                :label="$translateTitle('application.applicationdescription')"
              >
                <el-input
                  v-model="form.desc"
                  maxlength="300"
                  :placeholder="
                    $translateTitle('application.applicationdescription')
                  "
                  :rows="4"
                  show-word-limit
                  type="textarea"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!-- 工程图片 -->
              <el-form-item
                :label="$translateTitle('application.applicationpictures')"
              >
                <el-upload
                  ref="upload"
                  action="/upload"
                  :auto-upload="false"
                  class="upload-demo"
                  :file-list="form.fileList"
                  :limit="1"
                  list-type="picture"
                  :on-success="handleSuccess"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                  >
                    {{ $translateTitle('application.selectfile') }}
                  </el-button>
                  <el-button
                    size="small"
                    style="margin-left: 10px"
                    type="success"
                    @click="submitUpload"
                  >
                    {{ $translateTitle('application.uploadtoserver') }}
                  </el-button>

                  <span v-show="form.img != ''">
                    {{ $translateTitle('developer.path') }}:{{ form.img }}
                  </span>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    {{
                      $translateTitle(
                        'application.onlyJPG/PNGfilescanbeuploadedandnomorethan500kb'
                      )
                    }}
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="背景图片">
                <el-upload
                  ref="upload1"
                  action="/upload"
                  :auto-upload="false"
                  class="upload-demo"
                  :file-list="form.fileList1"
                  :limit="1"
                  list-type="picture"
                  :on-success="handleSuccess1"
                >
                  <el-button
                    slot="trigger"
                    size="small"
                    type="primary"
                  >
                    {{ $translateTitle('application.selectfile') }}
                  </el-button>
                  <el-button
                    size="small"
                    style="margin-left: 10px"
                    type="success"
                    @click="submitUpload1"
                  >
                    {{ $translateTitle('application.uploadtoserver') }}
                  </el-button>

                  <span v-show="form.img1 != ''">
                    {{ $translateTitle('developer.path') }}:{{ form.img1 }}
                  </span>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    {{
                      $translateTitle(
                        'application.onlyJPG/PNGfilescanbeuploadedandnomorethan500kb'
                      )
                    }}
                  </div>
                </el-upload>
              </el-form-item>

              <!-- 版权信息 -->
              <el-form-item
                :label="$translateTitle('application.copyrightinformation')"
              >
                <el-input
                  v-model="form.copyright"
                  maxlength="300"
                  :placeholder="
                    $translateTitle('application.copyrightinformation')
                  "
                  :rows="3"
                  show-word-limit
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                :label="$translateTitle('application.monitoringpanel')"
              >
                <el-input
                  v-model="form.dashboard"
                  :placeholder="$translateTitle('application.monitoringpanel')"
                >
                  <template slot="prepend">
                    http://
                  </template>
                  <el-button
                    slot="append"
                    style="
                      color: #ffffff;
                      background: #409eff;
                      border-radius: 1px 1px 1px 0;
                    "
                    type="primary"
                    @click="open12"
                  >
                    {{ $translateTitle('application.preview') }}
                  </el-button>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!-- 分割 -->
        <el-divider>
          <b>{{ $translateTitle('application.applicationconfiguration') }}</b>
        </el-divider>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                :label="$translateTitle('application.applicationaccessscale')"
                prop="scale"
                :rules="[
                  {
                    required: true,
                    message: '请选择工程接入规模',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model.number="form.scale"
                  clearable
                >
                  <el-option
                    v-for="item in form.scaleDate"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <!-- Token有效时间 -->
              <!-- <el-form-item :label=" $translateTitle('application.tokeneffectivetime')">
                <el-input
                  controls-position="left"
                  v-model.number="form.time"
                  type="number"
                  :min="1"
                  :placheholder=" $translateTitle('application.tokeneffectivetime')"
                >
                  <template slot="append">{{ $translateTitle('application.seconds')}}</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="App Secret">
                <el-input v-model="form.secret">
                  <el-button slot="append" icon="el-icon-refresh-right" @click="handleClickRefresh"></el-button>
                </el-input>
              </el-form-item>-->
            </div>
          </el-col>
        </el-row>
        <!-- 工程接入规模 -->

        <!-- App Secret -->
      </el-form>
      <div class="btns">
        <el-button
          v-show="actionType == 'add'"
          type="primary"
          @click="handleClickSubmit"
        >
          {{ $translateTitle('application.submission') }}
        </el-button>
        <el-button
          v-show="actionType == 'update'"
          type="primary"
          @click="handleClickUpdate"
        >
          更新
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { queryDict } from '@/api/Dict/index'
  import { handleZero } from '@/utils/index'
  import { app_count } from '@/api/Platform/index'
  import { postProduct, putProduct } from '@/api/Product/index'
  import { postRelation } from '@/api/Relation/index'
  export default {
    data() {
      return {
        imageUrl: false,
        host: window.location.origin + '/lot/',
        applicationList: [], // 所属行业
        // 表单
        form: {
          name: '', // 工程名称
          options: [], // 所属行业
          category: [], // 中文所属行业
          relationApp: '', //
          number: '', // 工程编号
          code: '', // 工程授权码
          scale: '', // 工程接入规模
          dashboard: '',
          product: [],
          department: '', // 工程单位
          scaleDate: [
            { id: 0, value: 100, label: '100' },
            { id: 1, value: 1000, label: '1000' },
            { id: 2, value: 10000, label: '1万' },
            { id: 3, value: 100000, label: '10万' },
            { id: 4, value: 1000000, label: '100万' },
            { id: 5, value: 10000000, label: '1000万' },
            { id: 6, value: 100000000, label: '1亿' },
          ],
          productIdentifier: '', // 工程链接
          fileList: [], // 上传列表，
          fileList1: [], // 上传列表
          img: '', // 上传图片路径
          img1: '', // 背景图片
          copyright: '', // 版权信息
          desc: '', // 工程描述
          time: 7200, // Token有效时间
          secret: '', // App Secret
        },
        sessionToken: '',
        file: '',
        actionType: '',
        relationAppObjectId: '',
        // 页面内容，传值变化
        content: {
          title: '',
          objectId: '',
        },
        // 参数
        argu: {},
        Notification: '',
        showTree: false,
        allApps: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        productlist: [], // 产品合级
      }
    },
    computed: {
      ...mapGetters({
        roleTree: 'user/roleTree',
      }),
      treeData() {
        const cloneData = JSON.parse(JSON.stringify(this.form.options)) // 对源数据深度克隆
        return cloneData.filter((father) => {
          const branchArr = cloneData.filter(
            (child) => father.id == child.parentid
          ) // 返回每一项的子级数组
          branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
          return father.parentid == 0 // 返回第一层
        })
      },
      applicationData() {
        return []
      },
    },
    created() {
      this.Industry()
      this.randomSecret()
      this.getProductList()
      // this.sessionToken = sessionStorage.getItem("token");
    },
    mounted() {
      this.initData()
    },
    beforeDestroy() {
      if (this.Notification) {
        this.Notification.close()
      }
    },
    methods: {
      // 刷新secret
      handleClickRefresh() {
        this.randomSecret()
      },
      onApplicationchange(val) {},
      getProductList(relAppid) {
        this.$query_object('Product', {}).then((res) => {
          if (res.results) {
            this.productlist = res.results
          }
        })
      },
      // 产生随机secrets
      randomSecret() {
        const ranNum = Math.ceil(Math.random() * 25)
        this.form.secret = Base64.encode(
          String.fromCharCode(65 + ranNum) +
            Math.ceil(Math.random() * 10000000) +
            Number(new Date())
        )
      },
      // 判断页面
      async initData() {
        this.argu = this.$route.query
        this.content.title = this.argu.title
        this.actionType = this.argu.actionType
        const { results } = await app_count({ limit: 100, where: {} })
        if (results) {
          this.applicationList = results
          // 从工程管理列表,的修改按钮 跳转过来的
          if (this.actionType == 'update') {
            this.form.name = this.argu.name
            this.form.scale = Number(handleZero(this.argu.scale))
            this.form.secret = this.argu.secret
            this.form.productIdentifier = this.argu.productIdentifier
            this.content.objectId = this.argu.objectId
            this.form.department = this.argu.userUnit
            this.form.desc = this.argu.desc
            this.form.copyright = this.argu.copyright

            if (this.argu.category) {
              this.form.category = this.argu.category.split('/')
            }
            if (this.argu.dashboard) {
              this.form.dashboard = this.argu.dashboard.substr(7)
            } else {
              this.form.dashboard = ''
            }

            if (this.argu.logo != '') {
              this.form.img = this.argu.logo
              this.form.fileList.push({
                name: 'logo.png',
                url: this.argu.logo,
              })
            }
            if (this.argu.background != '') {
              this.form.img1 = this.argu.background
              this.form.fileList1.push({
                name: 'background.png',
                url: this.argu.background,
              })
            }

            this.form.relationApp = this.argu.name
          } else {
            // 从应用管理的应用部署跳转过来的
            this.relationAppObjectId = this.$route.query.appObjectId

            this.form.relationApp = this.$route.query.name
            this.form.productIdentifier = this.$route.query.desc
            this.form.name = this.$route.query.desc
          }
        }
      },
      // 返回
      handleClickBack() {
        this.$router.push({ path: '/roles/applicationManagement' })
      },
      // 上传图片
      submitUpload() {
        this.$refs.upload.submit()
      },
      // 改变文件
      handleChangeFile(e) {
        const file = e.target.files[0]
        const type = file.name.substr(-3)
        if (file.size / 1024 > 500) {
          this.$message('上传图片大小不能超过500KB!')
        } else if (type != 'png' && type != 'jpg') {
          this.$message('上传图片格式不正确，必须是png或jpg格式！')
        } else {
          this.file = file
        }
      },
      // 上传成功
      handleSuccess(response, file, fileList) {
        this.form.img = response.path
        this.$message({
          message: '上传成功！',
          type: 'success',
        })
        // document.getElementsByClassName('el-upload-list__item .is-success')[0].setAttribute('display','block')
        document
          .getElementsByClassName('el-icon-close')[0]
          .setAttribute('display', 'none')
      },

      // 上传失败
      handleError(err, file, fileList) {
        this.$message({
          message: '上传失败！',
          type: 'error',
        })
      },
      // 判断是否可以提交
      isSubmit() {
        if (
          this.form.name == '' ||
          this.form.scale == '' ||
          this.form.productIdentifier == ''
        ) {
          this.$message('有必填项没有填写，无法提交！')
          return false
        } else {
          return true
        }
      },
      handleSuccess1(response, file, fileList) {
        this.form.img1 = response.path
        this.$message({
          message: '上传成功！',
          type: 'success',
        })
        // document.getElementsByClassName('el-upload-list__item .is-success')[0].setAttribute('display','block')
        document
          .getElementsByClassName('el-icon-close')[0]
          .setAttribute('display', 'none')
      },
      submitUpload1() {
        this.$refs.upload1.submit()
      },
      // 新增
      async handleClickSubmit() {
        if (!this.isSubmit()) {
          return
        }
        const aclKey = 'role' + ':' + this.form.relationApp
        var setAcl = {}
        setAcl[aclKey] = {
          read: true,
          write: true,
        }
        var params = {
          ACL: setAcl,
          title: this.form.name,
          category: this.form.category.join('/'),
          scale: this.form.scale,
          productIdentifier: this.form.productIdentifier,
          copyright: this.form.copyright,
          desc: this.form.desc,
          logo: this.form.img,
          background: this.form.img1,
          userUnit: this.form.department,
          dashboard: '',
        }
        if (this.form.dashboard != '') {
          params.dashboard = 'http://' + this.form.dashboard
        } else {
          params.dashboard = ''
        }
        const { objectId } = await postProduct(params)
        if (objectId) {
          this.addRelation(res.objectId, this.relationAppObjectId)
        }
      },
      async addRelation(destObjectId, sourceObjectId) {
        const res = await postRelation({
          destClass: 'Project',
          destId: destObjectId,
          destField: 'app',
          srcClass: 'App',
          srcId: sourceObjectId,
        })
        if (res) {
          this.$message({
            message: '添加部署成功！',
            type: 'success',
          })
          this.$router.push({ path: '/roles/projectManagement' })
        } else {
          this.$message('部署失敗')
        }
      },
      // 修改
      async handleClickUpdate() {
        if (!this.isSubmit()) {
          return
        }
        const aclKey = 'role' + ':' + this.form.relationApp
        var setAcl = {}
        setAcl[aclKey] = {
          read: true,
          write: true,
        }
        var params = {
          ACL: setAcl,
          title: this.form.name,
          category: this.form.category.join('/'),
          scale: this.form.scale,
          productIdentifier: this.form.productIdentifier,
          copyright: this.form.copyright,
          desc: this.form.desc,
          logo: this.form.img,
          background: this.form.img1,
          userUnit: this.form.department,
          dashboard: '',
        }
        if (this.form.dashboard != '') {
          params.dashboard = 'http://' + this.form.dashboard
        } else {
          params.dashboard = ''
        }
        const res = await putProduct(this.argu.objectId, params)
        if (res) {
          this.$message({
            message: '修改成功！',
            type: 'success',
          })
          this.$router.push({ path: '/roles/projectManagement' })
        }
      },
      handleNodeClick(data) {
        this.showTree = !this.showTree
        this.addchannel.applicationtText = data.name
      },
      // 获取行业信息
      async Industry() {
        this.allApps = this.roleTree
        this.form.options = []
        const res = await queryDict({
          limit: 1000,
          where: { 'data.key': 'category' },
        })
        if (res) {
          const response = res.results
          response.map((items) => {
            var obj = {}
            obj.value = items.data.CategoryName
            obj.label = items.data.CategoryName
            obj.id = items.data.Id
            obj.parentid = items.data.SuperId
            this.form.options.push(obj)
          })
        }
      },
      open12() {
        this.Notification = this.$notify({
          title: '面板预览',
          dangerouslyUseHTMLString: true,
          duration: 0,
          type: 'success',
          message: `<div><iframe
                src='http://${this.form.dashboard}'
                width="1000"
                height="400"
                frameborder="0"
      ></iframe></div>`,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #addApp {
    width: 100%;
    padding: 20px;
    margin: 0 auto;
    .head {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    .form {
      padding: 10px 30px;
      border: 3px solid #f7f7f7;
      .title {
        margin: 10px 0;
        text-align: right;
      }
      .el-form {
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-between;
        .el-col-12 {
          padding: 20px;
          @media screen and (max-width: 1100px) {
            width: 100%;
          }
        }
        .el-form-item {
          ::v-deep .el-slider__marks-text {
            width: 30px;
            margin-top: 5px;
          }
          ::v-deep .el-cascader {
            width: 100%;
          }
          ::v-deep .el-select {
            width: 100%;
          }
          ::v-deep .el-input-number {
            width: 100%;
          }
        }
      }
    }
    .btns {
      margin-top: 40px;
      text-align: center;
    }
  }
</style>
<style>
  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: none;
  }
  .el-upload-list__item .el-icon-close {
    display: block;
  }
  .el-notification {
    width: 1000px;
  }
</style>
