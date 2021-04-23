<template>
  <div class="laboratory">
    <div class="blockcontent">
      <p
        style="
          border-bottom: 1px solid #cccccc;
          color: #409eff;
          font-size: 14px;
          height: 40px;
        "
      >
        实验室基本信息
      </p>
      <el-form
        ref="laboratoryForm"
        :model="laboratoryForm"
        :rules="laboratoryRule"
        label-width="120px"
        class="demo-ruleForm"
        size="small"
      >
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="实验室名称" prop="name">
                <el-input v-model="laboratoryForm.name" />
              </el-form-item>
              <el-form-item label="实验室级别" prop="level">
                <el-select
                  v-model="laboratoryForm.level"
                  placeholder="请选择实验室级别"
                >
                  <el-option label="国家级" value="1" />
                  <el-option label="省级" value="2" />
                  <el-option label="地市级" value="3" />
                  <el-option label="县(区)级" value="4" />
                  <el-option label="其他" value="5" />
                </el-select>
              </el-form-item>
              <el-form-item label="实验室地址">
                <el-input v-model="laboratoryForm.addr" />
              </el-form-item>
              <el-form-item label="建设起止日期">
                <el-col :span="11">
                  <el-form-item prop="buildstarttime" style="margin-bottom: 0">
                    <el-date-picker
                      v-model="laboratoryForm.buildstarttime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="buildendtime" style="margin-bottom: 0">
                    <el-date-picker
                      v-model="laboratoryForm.buildendtime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="实验室负责人" prop="leadingname">
                <el-input v-model="laboratoryForm.leadingname" />
              </el-form-item>
              <el-form-item label="实验室联系人" prop="linkname">
                <el-input v-model="laboratoryForm.linkname" />
              </el-form-item>
              <!-- <el-form-item label="实验室照片" required> -->
              <el-form-item label="实验室照片">
                <img
                  v-if="laboratoryForm.imgsrc"
                  :src="fileDomain + laboratoryForm.imgsrc"
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
                      top: -100px;
                      opacity: 0;
                      z-index: 5;
                      height: 100px;
                      width: 100px;
                      cursor: pointer;
                    "
                    @change="upload($event)"
                  />
                </form>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="主管单位" prop="unit">
                <el-input v-model="laboratoryForm.unit" />
              </el-form-item>
              <el-form-item label="实验室类别" prop="category">
                <el-select
                  v-model="laboratoryForm.category"
                  placeholder="请选择实验室类别"
                >
                  <el-option label="主实验室" value="1" />
                  <el-option label="辅助实验室" value="2" />
                  <el-option label="其他" value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="实验室面积">
                <el-input v-model="laboratoryForm.area">
                  <template slot="append">平方</template>
                </el-input>
              </el-form-item>
              <el-form-item label="最新投运时间">
                <el-date-picker
                  v-model="laboratoryForm.operationtime"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择最新投运时间"
                />
              </el-form-item>
              <!-- prop="leadingphone" -->
              <el-form-item label="负责人电话">
                <el-input v-model="laboratoryForm.leadingphone" />
              </el-form-item>
              <!-- prop="linkphone" -->
              <el-form-item label="联系人电话">
                <el-input v-model="laboratoryForm.linkphone" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <p
          style="
            border-bottom: 1px solid #cccccc;
            color: #409eff;
            font-size: 14px;
            height: 40px;
          "
        >
          实验室资质认证
        </p>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="实验室认证类型">
                <el-select
                  v-model="laboratoryForm.region"
                  placeholder="请选择实验室认证类型"
                >
                  <el-option label="CMA" value="CMA" />
                  <el-option label="CNAS" value="CNAS" />
                </el-select>
              </el-form-item>
              <el-form-item label="发证机关" prop="licencsIssuing">
                <el-input v-model="laboratoryForm.licencsIssuing" />
              </el-form-item>
              <el-form-item label="初次认可">
                <el-date-picker
                  v-model="laboratoryForm.initialRecognition"
                  type="datetime"
                  value-format="timestamp"
                  placeholder="选择初次认可时间"
                />
              </el-form-item>
              <el-form-item label="资质内容">
                <el-input
                  v-model="laboratoryForm.desc"
                  :rows="8"
                  type="textarea"
                  placeholder="请输入证书资质信息"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="证书编号" prop="credentialsname">
                <el-input v-model="laboratoryForm.credentialsname" />
              </el-form-item>
              <el-form-item required label="签发日期">
                <el-col :span="11">
                  <el-form-item prop="dateOfIssue" style="margin-bottom: 0">
                    <el-date-picker
                      v-model="laboratoryForm.dateOfIssue"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    prop="termOfValidity"
                    style="margin-bottom: 0"
                    label="有效期至"
                  >
                    <el-date-picker
                      v-model="laboratoryForm.termOfValidity"
                      placeholder="选择有效期"
                      style="width: 100%"
                      type="date"
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item prop="updatedDate" label="更新时间">
                <el-date-picker
                  v-model="laboratoryForm.updatedDate"
                  placeholder="选择时间"
                  type="date"
                  value-format="timestamp"
                />
              </el-form-item>
              <!-- <el-form-item label="证书电子文件" required> -->
              <el-form-item label="证书电子文件">
                <img
                  v-if="laboratoryForm.imgsrc1"
                  :src="fileDomain + laboratoryForm.imgsrc1"
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
                      top: -100px;
                      opacity: 0;
                      z-index: 5;
                      height: 100px;
                      width: 100px;
                      cursor: pointer;
                    "
                    @change="upload($event, 'other')"
                  />
                </form>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-form :inline="true" :model="otherForm" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <template slot="label">
                <span style="color: #409eff">其他资质(可选)</span>
              </template>
              <el-input
                v-model="otherForm.other"
                placeholder="请输入证书名称"
              />
            </el-form-item>
            <el-form-item v-show="otherForm.other != ''">
              <el-button type="primary" @click="addOther">确定</el-button>
            </el-form-item>
            <el-form-item v-show="otherForm.other != ''">
              <el-button type="primary" @click="otherForm.other = ''">
                取消
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <!-- <el-button type="primary" @click="addLaboratory('laboratoryForm')">确定,添加实验室</el-button> -->
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="其他资质添加" width="60%">
      <div class="dialogform">
        <el-form
          ref="addotherform"
          :model="addotherform"
          :rules="otheformrule"
          label-width="120px"
          class="demo-addotherform"
        >
          <el-row>
            <p
              style="
                border-bottom: 1px solid #cccccc;
                color: #409eff;
                font-size: 14px;
              "
            >
              其他证书
            </p>
            <!--证书认证上-->
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="证书编号" prop="name">
                  <el-input v-model="addotherform.name" />
                </el-form-item>
                <el-form-item label="签发日期" prop="dateOfIssue">
                  <el-date-picker
                    v-model="addotherform.dateOfIssue"
                    type="date"
                    placeholder="选择签发日期"
                    value-format="timestamp"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="初次认可" prop="initialRecognition">
                  <el-date-picker
                    v-model="addotherform.initialRecognition"
                    type="date"
                    placeholder="选择签发日期"
                    value-format="timestamp"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="资质内容">
                  <el-input
                    v-model="addotherform.desc"
                    :rows="8"
                    type="textarea"
                    placeholder="请输入证书资质信息"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="发证机关" prop="licencsIssuing">
                  <el-input v-model="addotherform.licencsIssuing" />
                </el-form-item>
                <el-form-item label="有效期至" prop="termOfValidity">
                  <el-date-picker
                    v-model="addotherform.termOfValidity"
                    type="date"
                    placeholder="选择有效期至"
                    value-format="timestamp"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="更新时间" prop="updatedDate">
                  <el-date-picker
                    v-model="addotherform.updatedDate"
                    type="date"
                    placeholder="选择签发更新时间"
                    value-format="timestamp"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="证书电子文件" required>
                  <img
                    v-if="addotherform.imgsrc"
                    :src="fileDomain + addotherform.imgsrc"
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
                        top: -100px;
                        opacity: 0;
                        z-index: 5;
                        height: 100px;
                        width: 100px;
                        cursor: pointer;
                      "
                      @change="upload($event, 'otherform')"
                    />
                  </form>
                  <div
                    class="el-upload__text"
                    style="
                      position: absolute;
                      top: 90px;
                      color: #8c939d;
                      left: 50px;
                    "
                  >
                    证书电子文件
                  </div>
                  <el-button
                    v-show="addotherform.imgsrc != ''"
                    size="small"
                    type="danger"
                    style="
                      position: absolute;
                      left: 200px;
                      top: 150px;
                      margin-left: 0;
                    "
                    @click="addotherform.imgsrc = ''"
                  >
                    删除
                  </el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateOther('addotherform')">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'LaboratoryForm',
    data() {
      const Registered = function (rule, value, callback) {
        var rules = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/

        if (!rules.test(value)) {
          callback(new Error('请填写实验室面积'))
        } else {
          callback()
        }
      }
      return {
        laboratoryForm: this.laboratoryInit(),
        otherslist: [],
        dialogVisible: false,
        isshowactive: 0,
        laboratoryRule: {
          name: [{ required: true, message: '请输入实验室', trigger: 'blur' }],
          unit: [
            { required: true, message: '请输入主管单位名称', trigger: 'blur' },
          ],
          leadingname: [
            { required: true, message: '请输入实验室负责人', trigger: 'blur' },
          ],
          linkname: [
            { required: true, message: '请输入实验室联系人', trigger: 'blur' },
          ],
          linkphone: [
            {
              required: true,
              message: '请输入实验室联系人手机号',
              trigger: 'blur',
            },
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
          area: [
            { required: true, message: '请输入实验室面积', trigger: 'blur' },
            { validator: Registered },
          ],
          leadingphone: [
            {
              required: true,
              message: '请输入实验室负责人手机号',
              trigger: 'blur',
            },
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
          level: [
            { required: true, message: '请选择实验室级别', trigger: 'change' },
          ],
          category: [
            { required: true, message: '请选择实验室类别', trigger: 'change' },
          ],
          addr: [
            { required: true, message: '请输入实验室名称', trigger: 'blur' },
          ],
          region: [
            {
              required: true,
              message: '请选择实验室认证类型',
              trigger: 'change',
            },
          ],
          date1: [
            {
              // type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          date2: [
            {
              // type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change',
            },
          ],
          buildstarttime: [
            {
              // type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          buildendtime: [
            {
              // type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          credentialsname: [
            {
              required: true,
              message: '请输入正确的证书编号!',
              trigger: 'blur',
            },
          ],
          licencsIssuing: [
            { required: true, message: '请输入发证机关', trigger: 'blur' },
          ],
          dateOfIssue: [
            {
              // type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          updatedDate: [
            {
              // type: 'date',
              required: true,
              message: '请选择更新时间',
              trigger: 'change',
            },
          ],
          initialRecognition: [
            {
              // type: 'date',
              required: true,
              message: '请选择初次认可时间',
              trigger: 'change',
            },
          ],
          termOfValidity: [
            {
              // type: 'date',
              required: true,
              message: '请选择有效期至',
              trigger: 'change',
            },
          ],
        },
        otherForm: {
          other: '',
        },
        addotherform: {
          name: '',
          dateOfIssue: '',
          updatedDate: '',
          initialRecognition: '',
          termOfValidity: '',
          licencsIssuing: '',
          imgsrc: '',
          desc: '',
        },
        otheformrule: {
          name: [
            { required: true, message: '请输入正确证书编号', trigger: 'blur' },
          ],
          licencsIssuing: [
            { required: true, message: '请输入发证机关', trigger: 'blur' },
          ],
          dateOfIssue: [
            {
              // type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          updatedDate: [
            {
              // type: 'date',
              required: true,
              message: '请选择更新时间',
              trigger: 'change',
            },
          ],
          initialRecognition: [
            {
              // type: 'date',
              required: true,
              message: '请选择初次认可时间',
              trigger: 'change',
            },
          ],
          termOfValidity: [
            {
              // type: 'date',
              required: true,
              message: '请选择有效期至',
              trigger: 'change',
            },
          ],
        },
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    mounted() {},
    methods: {
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
        formdata.append('auth_token', this.$Cookies.get('access_token_pump')) // 下面是要传递的参数
        // 此处必须设置为  multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
          },
        }
        this.$http
          .post(this.$Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              if (this.type == 'other') {
                this.laboratoryForm.imgsrc1 = res.body.src
              } else if (this.type == 'otherform') {
                this.addotherform.imgsrc = res.body.src
              } else {
                this.laboratoryForm.imgsrc = res.body.src
              }
            }
          })
          .catch((error) => {
            this.$message.error(error.bodyText)
          })
      },
      // 其他资质添加
      addOther() {
        if (this.otherForm.other == '') {
          this.$message.warning('请填写其他资质名称')
        } else {
          this.dialogVisible = true
        }
      },
      handleAvatarSuccessOther(response, file, fileList) {
        this.addotherform.imgsrc = response.path
        this.$message.success('上传成功')
      },
      // 增加实验室
      addLaboratory(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('添加成功')
            this.$emit('resultes', {
              laboratoryObj: this.laboratoryForm,
              otherslist: this.otherslist,
              isChecked: true,
            })
          } else {
            this.$message.error('有必填项未填写!')
            return false
          }
        })
      },
      getFormData() {
        return new Promise((resolve, reject) => {
          this.$refs['laboratoryForm'].validate((valid) => {
            if (valid) {
              resolve({
                laboratoryObj: this.laboratoryForm,
                otherslist: this.otherslist,
                isChecked: true,
              })
            } else {
              this.$message.error('有必填项未填写!')
              reject(null)
            }
          })
        })
      },
      // 初始化数据
      initData() {
        this.laboratoryForm = this.laboratoryInit()
      },
      laboratoryInit() {
        return {
          addr: '',
          area: '',
          desc: '',
          name: '',
          unit: '',
          level: '',
          imgsrc: '',
          region: '',
          credentialsname: '',
          imgsrc1: '',
          category: '1',
          linkname: '',
          linkphone: '',
          dateOfIssue: '',
          leadingname: '',
          updatedDate: '',
          buildendtime: '',
          leadingphone: '',
          lendingphone: '',
          operationtime: '',
          buildstarttime: '',
          licencsIssuing: '',
          termOfValidity: '',
          initialRecognition: '',
        }
      },
      fillData(laboratory) {
        console.log('laboratory ### ', laboratory)

        Object.assign(this.laboratoryForm, laboratory.laboratoryInfo)
      },
      updateOther(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addotherform.imgsrc == '') {
              this.$message.error('请上传资质照片')
              return
            }
            var obj = {
              title: this.otherForm.other,
              name: this.addotherform.name,
              dateOfIssue: this.addotherform.dateOfIssue,
              updatedDate: this.addotherform.updatedDate,
              initialRecognition: this.addotherform.initialRecognition,
              termOfValidity: this.addotherform.termOfValidity,
              licencsIssuing: this.addotherform.licencsIssuing,
              imgsrc: this.addotherform.imgsrc,
              desc: this.addotherform.desc,
            }
            this.otherslist.push(obj)
            this.$refs[formName].resetFields()
            this.addotherform.imgsrc = ''
            this.dialogVisible = false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .laboratory {
    width: 100%;
    height: 100%;
    padding: 20px 60px;
    box-sizing: border-box;
    background: #ffffff;
    ::v-deep .el-form-item--small {
      margin-bottom: 18px;
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-date-editor {
        width: 100%;
      }
    }
  }
</style>
<style>
  .empower .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .empower.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .empower .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #cccccc;
  }
  .empower .avatar {
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
</style>
