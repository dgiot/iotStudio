<template>
  <div class="person_empower">
    <el-steps :active="active" simple>
      <el-step title="1填写个人基本信息" icon="el-icon-upload" />
      <el-step title="2正在审核" icon="el-icon-s-unfold" />
      <el-step title="3审核结果" icon="el-icon-s-check" />
    </el-steps>
    <div v-if="active == 1" class="empower1">
      <h3
        style="
          border: 1px solid #cccccc;
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
        "
      >
        个人资质认证
      </h3>
      <div class="empowerform">
        <el-form
          ref="powerform"
          :model="powerform"
          :rules="powerrules"
          label-width="120px"
        >
          <el-row>
            <!--左侧-->
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="powerform.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="powerform.birthday"
                  type="date"
                  placeholder="选择出生日期"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item label="毕业院校">
                <el-input
                  v-model="powerform.graduate_institutions"
                  placeholder="请输入毕业院校"
                />
              </el-form-item>
              <el-form-item label="身份证编号" prop="identity">
                <el-input
                  v-model="powerform.identity"
                  placeholder="请输入身份证编号"
                />
              </el-form-item>
              <el-form-item label="身份证正反面" required>
                <el-col :span="11">
                  <img
                    v-if="powerform.frontimageUrl"
                    :src="fileDomain + powerform.frontimageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                  <form
                    ref="uploadform"
                    method="POST"
                    enctype="multipart/form-data"
                    style="position: absolute"
                  >
                    <input
                      type="file"
                      style="
                        position: relative;
                        top: -200px;
                        opacity: 0;
                        z-index: 5;
                        height: 200px;
                        width: 200px;
                        cursor: pointer;
                      "
                      @change="upload($event, 'front')"
                    />
                  </form>
                  <div
                    v-show="powerform.frontimageUrl == ''"
                    class="el-upload__text"
                    style="
                      position: absolute;
                      top: 90px;
                      color: #8c939d;
                      left: 110px;
                    "
                  >
                    正面
                  </div>

                  <el-button
                    v-show="powerform.frontimageUrl != ''"
                    size="small"
                    type="danger"
                    style="
                      position: absolute;
                      left: 200px;
                      top: 150px;
                      margin-left: 0;
                    "
                    @click="powerform.frontimageUrl = ''"
                  >
                    删除
                  </el-button>
                </el-col>
                <el-col :span="2" class="line" />
                <el-col :span="11" style="position: relative">
                  <img
                    v-if="powerform.contraryimageUrl"
                    :src="fileDomain + powerform.contraryimageUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                  <form
                    ref="uploadform"
                    method="POST"
                    enctype="multipart/form-data"
                    style="position: absolute"
                  >
                    <input
                      type="file"
                      style="
                        position: relative;
                        top: -200px;
                        opacity: 0;
                        z-index: 5;
                        height: 200px;
                        width: 200px;
                        cursor: pointer;
                      "
                      @change="upload($event, 'contrary')"
                    />
                  </form>
                  <div
                    v-show="powerform.contraryimageUrl == ''"
                    class="el-upload__text"
                    style="
                      position: absolute;
                      top: 90px;
                      color: #8c939d;
                      left: 110px;
                    "
                  >
                    反面
                  </div>

                  <el-button
                    v-show="powerform.contraryimageUrl != ''"
                    size="small"
                    type="danger"
                    style="
                      position: absolute;
                      left: 190px;
                      top: 150px;
                      margin-left: 0;
                    "
                    @click="powerform.contraryimageUrl = ''"
                  >
                    删除
                  </el-button>
                </el-col>
              </el-form-item>
            </el-col>
            <!--右侧-->
            <el-col :span="12">
              <el-form-item label="企业职务" prop="job">
                <el-input v-model="powerform.job" />
              </el-form-item>
              <el-form-item label="最高学历">
                <el-select
                  v-model="powerform.education"
                  placeholder="请选择最高学历"
                >
                  <el-option
                    v-for="(item, index) in positional"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="主修专业">
                <el-input
                  v-model="powerform.professional"
                  placeholder="请输入主修专业"
                />
              </el-form-item>
              <el-form-item label="个人职称" prop="positional_titles">
                <el-input
                  v-model="powerform.positional_titles"
                  placeholder="请输入个人职称"
                />
              </el-form-item>

              <el-form-item label="职业资质" required>
                <img
                  v-if="powerform.joblicenseUrl"
                  :src="fileDomain + powerform.joblicenseUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <form
                  ref="uploadform"
                  method="POST"
                  enctype="multipart/form-data"
                  style="position: absolute"
                >
                  <input
                    type="file"
                    style="
                      position: relative;
                      top: -200px;
                      opacity: 0;
                      z-index: 5;
                      height: 200px;
                      width: 200px;
                      cursor: pointer;
                    "
                    @change="upload($event, 'joblicenseUrl')"
                  />
                </form>
                <div
                  v-show="powerform.joblicenseUrl == ''"
                  class="el-upload__text"
                  style="
                    position: absolute;
                    top: 90px;
                    color: #8c939d;
                    left: 120px;
                  "
                >
                  职业资质
                </div>
                <!-- </el-upload> -->
                <el-button
                  v-show="powerform.joblicenseUrl != ''"
                  size="small"
                  type="danger"
                  style="
                    position: absolute;
                    left: 200px;
                    top: 150px;
                    margin-left: 0;
                  "
                  @click="powerform.joblicenseUrl = ''"
                >
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="家庭地址">
                <el-cascader
                  v-model="powerform.addr"
                  :options="regionData"
                  size="large"
                />
              </el-form-item>
              <el-form-item label="相关工作年限" prop="working_seniority">
                <el-select
                  v-model="powerform.working_seniority"
                  placeholder="请选择工作年限"
                >
                  <el-option label="1年以内" value="1" />
                  <el-option label="1-3年" value="2" />
                  <el-option label="3-5年" value="3" />
                  <el-option label="5-10年" value="4" />
                  <el-option label="10年以上" value="5" />
                </el-select>
              </el-form-item>
              <el-form-item label="培训经历">
                <el-input
                  v-model="powerform.training_experience"
                  :rows="4"
                  type="textarea"
                  placeholder="请输入培训经历"
                  maxlength="300"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="powerform.start_time"
                  type="date"
                  placeholder="选择开始时间"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item label="联系方式" prop="userphone">
                <el-input
                  v-model.number="powerform.userphone"
                  placeholder="请输入联系方式"
                />
              </el-form-item>
              <el-form-item
                label="相关从业经历"
                prop="practitioners_experience"
              >
                <el-input
                  v-model="powerform.practitioners_experience"
                  :rows="4"
                  type="textarea"
                  placeholder="请输入个人水泵检测相关从业经历"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="activefirst">
        <el-button type="primary" @click="submitForm('powerform')">
          <span>{{ ['', '提交审核', '提交更新', '确定'][phase] }}</span>
        </el-button>
        <el-button
          ng-show="phase > 1"
          icon="el-icon-arrow-right
"
          @click="active = 2"
        >
          下一步
        </el-button>
      </div>
    </div>
    <div v-if="active == 2" class="empower2">
      <div
        class="block"
        style="margin: 0 auto; text-align: center; padding: 30px"
      >
        <el-image>
          <div slot="error" class="image-slot">
            <svg-icon
              icon-class="empowerexamine"
              style="width: 8rem; height: 8rem"
            />
          </div>
        </el-image>
        <p style="font-size: 25px; color: #409eff">
          <span>
            {{
              ['未审核', '审核通过', '审核不通过'][currentRow.data.verifyStatus]
            }}
          </span>
        </p>
        <p style="color: #cccccc; font-size: 14px">
          预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解
        </p>
        <p>
          <el-button @click="active = 1">
            <i class="el-icon-arrow-left" />
            上一步
          </el-button>

          <!--  <el-button type="primary" @click="cancelAdd">
            撤销审核
          </el-button> -->
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import { regionData } from 'element-china-area-data'

  export default {
    data() {
      const idrules = function (rule, value, callback) {
        var rules = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
        if (!rules.test(value)) {
          if (value.length != 18) {
            callback(new Error('请输入18位身份证号'))
          } else {
            callback(new Error('需要输入正确身份证号码'))
          }
        } else {
          callback()
        }
      }
      return {
        active: 1,
        phase: 1,
        currentRow: {},
        powerform: {
          name: '',
          birthday: '',
          job: '', //企业职务
          professional: '', // 主修专业
          education: '', // 学历
          positional_titles: '', // 个人职称
          identity: '', // 身份证编号
          graduate_institutions: '', // 毕业院校
          contraryimageUrl: '', // 身份证反面
          frontimageUrl: '', // 身份证正面
          joblicenseUrl: '', // 职务资质
          addr: [], // 家庭住址
          working_seniority: '', // 相关工作年限
          training_experience: '', // 培训经历
          start_time: '', // 开始时间
          practitioners_experience: '', // 从业经历
          userphone: '', // 联系方式
          verifyStatus: 0, // 0 未审核 1 审核通过 2 审核不通过
        },
        positional: ['大学专科', '大学本科', '硕士研究生', '博士研究生'],
        powerrules: {
          name: [
            { required: true, message: '请输入个人姓名', trigger: 'blur' },
          ],
          identity: [
            { required: true, message: '请输入正确身份证号', trigger: 'blur' },
            { validator: idrules, trigger: 'blur' },
          ],
          birthday: [
            {
              type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          job: [{ required: true, message: '请输入企业职务', trigger: 'blur' }],
          positional_titles: [
            { required: true, message: '请输入个人职称', trigger: 'blur' },
          ],
          working_seniority: [
            {
              required: true,
              message: '请选择相关工作年限',
              trigger: 'change',
            },
          ],
          practitioners_experience: [
            {
              required: true,
              message: '请输入相关工作经历',
              trigger: 'change',
            },
          ],
          professional: [
            { required: true, message: '请输入主修专业', trigger: 'blur' },
          ],
          userphone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            {
              validator: function (rule, value, callback) {
                var MobileRegex = /^1[3-9]\d{9}$/
                if (!MobileRegex.test(value)) {
                  callback(new Error('手机号码格式不正确！'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
        },
        regionData: regionData,
        imgtype: '',
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    mounted() {
      this.getPersonAuthtication()
    },
    methods: {
      getPersonAuthtication() {
        let userName = this.$store.state.user['name']
        var where = {}

        where['basedata.userName'] = userName

        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .get('/classes/Dict', {
            params: {
              where: {
                type: 'PersonAuthtication',
              },
              order: '-updatedAt',
            },
          })
          .then((response) => {
            loading.close()
            if (response && response.results && response.results.length > 0) {
              this.phase = 2
              this.fillData(response.results[0])
            }
          })
          .catch((error) => {
            loading.close()
            console.log('Dict err', error)
          })
      },
      fillData(resData) {
        this.currentRow = resData
        console.log('resData ###', resData)

        Object.assign(this.powerform, resData['data'])

        // this.powerform = resData['data']
      },
      upload(event, type) {
        if (event) {
          var file = event.target.files[0] // name: "dangqi1.png" || type: "image/png"
          var name = file.name
          var filetype = event.target.files[0].type

          this.imgtype = type

          this.uploadFile(file, name) // 执行上传接口
        }
      },
      uploadFile(file, name) {
        var formdata = new FormData()
        formdata.append('file', file)
        formdata.append('output', 'json')

        formdata.append('path', this.$Cookies.get('appids'))
        formdata.append('scene', this.$Cookies.get('appids'))
        formdata.append('auth_token', this.$Cookies.get('sessionTokenPump')) // 下面是要传递的参数

        // 此处必须设置为  multipart/form-data

        this.$http
          .post(this.$Cookies.get('fileserver'), formdata, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            if (res) {
              if (this.imgtype == 'front') {
                this.powerform.frontimageUrl = res.body.src
              } else if (this.imgtype == 'contrary') {
                this.powerform.contraryimageUrl = res.body.src
              } else if (this.imgtype == 'joblicenseUrl') {
                this.powerform.joblicenseUrl = res.body.src
              }
            }
          })
          .catch((error) => {
            this.$message.error(error.bodyText)
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.powerform.frontimageUrl == '') {
              this.$message.error('请上传身份证正面照')
              return
            }
            if (this.powerform.contraryimageUrl == '') {
              this.$message.error('请上传身份证贝面照')
              return
            }
            if (this.powerform.joblicenseUrl == '') {
              this.$message.error('请上传资质资历图片')
              return
            }

            const roleName = this.$store.state.user.roles[0]['name']

            const userName = this.$store.state.user['name']

            if (!roleName) {
              this.$message({
                message: '未获取到角色名',
              })
              return
            }

            if (this.phase == 1) {
              const aclKey = 'role' + ':' + roleName
              const aclObj = {}

              aclObj[aclKey] = { read: true, write: true }

              this.$axiosWen
                .post('classes/Dict', {
                  ACL: aclObj,
                  type: 'PersonAuthtication',
                  data: this.powerform,
                  key: userName,
                })
                .then((res) => {
                  if (res) {
                    this.$message({
                      type: 'success',
                      message: '提交成功',
                    })
                    this.active = 2
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: '添加失败',
                  })
                })
            } else {
              this.$axiosWen
                .put('classes/Dict/' + this.currentRow.objectId, {
                  data: this.powerform,
                })
                .then((res) => {
                  if (res) {
                    this.$message({
                      type: 'success',
                      message: '更新成功',
                    })
                    this.active = 2
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: '更新失败',
                  })
                })
            }
          } else {
            this.$message.error('有必填项未填写')
            return false
          }
        })
      },
      cancelAdd() {
        this.active = 1
      },
    },
  }
</script>
<style lang="scss" scoped>
  .person_empower {
    width: 100%;
    height: 100%;
    padding: 20px 60px;
    box-sizing: border-box;
    background: #ffffff;
    .empower1 {
      .el-form {
        .el-col-12 {
          padding: 20px;
          @media screen and (max-width: 1100px) {
            width: 100%;
          }
          ::v-deep .el-select {
            width: 100%;
          }
          ::v-deep .el-cascader {
            width: 100%;
          }
        }
        ::v-deep .el-select {
          width: 100%;
        }
        ::v-deep .el-date-editor {
          width: 100%;
        }
      }
      .activefirst {
        text-align: center;
      }
    }
  }
</style>
<style>
  .person_empower .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .person_empower.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .person_empower .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #cccccc;
  }
  .person_empower .avatar {
    width: 250px;
    height: 178px;
    display: block;
  }
  .image-slot {
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 250px;
    background: #f5f7fa;
    color: #909399;
  }
  .person_empower .el-tabs__header {
    margin-top: 20px;
  }
</style>
