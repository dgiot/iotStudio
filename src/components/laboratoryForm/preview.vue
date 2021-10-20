<template>
  <div class="laboratory">
    <div class="blockcontent">
      <p
        style="
          height: 40px;
          font-size: 14px;
          color: #409eff;
          border-bottom: 1px solid #cccccc;
        "
      >
        实验室基本信息
      </p>
      <el-form
        ref="laboratoryForm"
        class="demo-ruleForm"
        label-width="120px"
        :model="laboratoryForm"
        :rules="laboratoryRule"
        size="small"
      >
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item
                label="实验室名称"
                prop="name"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.name"
                />
              </el-form-item>
              <el-form-item
                label="实验室级别"
                prop="level"
              >
                <el-select
                  placeholder="请选择实验室级别"
                  readonly
                  :value="laboratoryForm.level"
                >
                  <el-option
                    label="国家级"
                    value="1"
                  />
                  <el-option
                    label="省级"
                    value="2"
                  />
                  <el-option
                    label="地市级"
                    value="3"
                  />
                  <el-option
                    label="县(区)级"
                    value="4"
                  />
                  <el-option
                    label="其他"
                    value="5"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="实验室地址"
                prop="addr"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.addr"
                />
              </el-form-item>
              <el-form-item
                label="建设起止日期"
                required
              >
                <el-col :span="11">
                  <el-form-item
                    prop="buildstarttime"
                    style="margin-bottom: 0"
                  >
                    <el-date-picker
                      placeholder="选择日期"
                      readonly
                      style="width: 100%"
                      type="date"
                      :value="laboratoryForm.buildstarttime"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  class="line"
                  :span="2"
                >
                  -
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    prop="buildendtime"
                    style="margin-bottom: 0"
                  >
                    <el-date-picker
                      placeholder="选择日期"
                      readonly
                      style="width: 100%"
                      type="date"
                      :value="laboratoryForm.buildendtime"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item
                label="实验室负责人"
                prop="leadingname"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.leadingname"
                />
              </el-form-item>
              <el-form-item
                label="实验室联系人"
                prop="linkname"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.linkname"
                />
              </el-form-item>
              <el-form-item
                label="实验室照片"
                required
              >
                <el-upload
                  action="/iotapi/upload"
                  :before-upload="beforeAvatarlaboratory"
                  class="avatar-uploader"
                  :on-success="handleAvatarlaboratory"
                  :show-file-list="false"
                >
                  <img
                    v-if="laboratoryForm.imgsrc"
                    class="avatar"
                    :src="fileDomain + laboratoryForm.imgsrc"
                  />
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item
                label="主管单位"
                prop="unit"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.unit"
                />
              </el-form-item>
              <el-form-item
                label="实验室类别"
                prop="category"
              >
                <el-select
                  placeholder="请选择实验室类别"
                  readonly
                  :value="laboratoryForm.category"
                >
                  <el-option
                    label="主实验室"
                    value="1"
                  />
                  <el-option
                    label="辅助实验室"
                    value="2"
                  />
                  <el-option
                    label="其他"
                    value="3"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="实验室面积"
                prop="area"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.area"
                >
                  <template slot="append">
                    平方
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="最新投运时间">
                <el-date-picker
                  placeholder="选择最新投运时间"
                  readonly
                  type="datetime"
                  :value="laboratoryForm.operationtime"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item
                label="负责人电话"
                prop="leadingphone"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.leadingphone"
                />
              </el-form-item>
              <el-form-item
                label="联系人电话"
                prop="linkphone"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.linkphone"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <p
          style="
            height: 40px;
            font-size: 14px;
            color: #409eff;
            border-bottom: 1px solid #cccccc;
          "
        >
          实验室资质认证
        </p>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="实验室认证类型">
                <el-select
                  placeholder="请选择实验室认证类型"
                  readonly
                  :value="laboratoryForm.region"
                >
                  <el-option
                    label="CMA"
                    value="CMA"
                  />
                  <el-option
                    label="CNAS"
                    value="CNAS"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="发证机关"
                prop="licencsIssuing"
                readonly
              >
                <el-input :value="laboratoryForm.licencsIssuing" />
              </el-form-item>
              <el-form-item label="初次认可">
                <el-date-picker
                  placeholder="选择初次认可时间"
                  readonly
                  type="datetime"
                  :value="laboratoryForm.initialRecognition"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item label="资质内容">
                <el-input
                  placeholder="请输入证书资质信息"
                  readonly
                  :rows="8"
                  type="textarea"
                  :value="laboratoryForm.desc"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item
                label="证书编号"
                prop="credentialsname"
              >
                <el-input
                  readonly
                  :value="laboratoryForm.credentialsname"
                />
              </el-form-item>
              <el-form-item
                label="签发日期"
                required
              >
                <el-col :span="11">
                  <el-form-item
                    prop="dateOfIssue"
                    style="margin-bottom: 0"
                  >
                    <el-date-picker
                      placeholder="选择日期"
                      readonly
                      style="width: 100%"
                      type="date"
                      :value="laboratoryForm.dateOfIssue"
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="有效期至"
                    prop="termOfValidity"
                    style="margin-bottom: 0"
                  >
                    <el-date-picker
                      placeholder="选择有效期"
                      readonly
                      style="width: 100%"
                      type="date"
                      :value="laboratoryForm.termOfValidity"
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item
                label="更新时间"
                prop="updatedDate"
              >
                <el-date-picker
                  placeholder="选择时间"
                  readonly
                  type="date"
                  :value="laboratoryForm.updatedDate"
                  value-format="timestamp"
                />
              </el-form-item>
              <el-form-item
                label="证书电子文件"
                required
              >
                <el-upload
                  action="/iotapi/upload"
                  :before-upload="beforeAvatarlaboratory"
                  class="avatar-uploader"
                  :on-success="handleAvatarlaboratory"
                  :show-file-list="false"
                >
                  <img
                    v-if="laboratoryForm.imgsrc1"
                    class="avatar"
                    :src="fileDomain + laboratoryForm.imgsrc1"
                  />
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row
      v-for="(item, index) in otherform"
      :key="index"
      :value="item"
    >
      <el-form
        ref="addotherform"
        class="demo-addotherform"
        label-width="120px"
        :model="item"
      >
        <p
          style="
            font-size: 14px;
            color: #409eff;
            border-bottom: 1px solid #cccccc;
          "
        >
          {{ item.title }}
        </p>
        <!--证书认证上-->
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="证书编号">
              <el-input
                v-model="item.name"
                readonly
              />
            </el-form-item>
            <el-form-item label="签发日期">
              <el-date-picker
                v-model="item.dateOfIssue"
                placeholder="选择签发日期"
                readonly
                style="width: 100%"
                type="date"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item label="初次认可">
              <el-date-picker
                v-model="item.initialRecognition"
                placeholder="选择签发日期"
                readonly
                style="width: 100%"
                type="date"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item label="资质内容">
              <el-input
                v-model="item.desc"
                placeholder="请输入证书资质信息"
                readonly
                :rows="8"
                type="textarea"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="发证机关">
              <el-input v-model="item.licencsIssuing" />
            </el-form-item>
            <el-form-item label="有效期至">
              <el-date-picker
                v-model="item.termOfValidity"
                placeholder="选择有效期至"
                readonly
                style="width: 100%"
                type="date"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item label="更新时间">
              <el-date-picker
                v-model="item.updatedDate"
                placeholder="选择签发更新时间"
                readonly
                style="width: 100%"
                type="date"
                value-format="timestamp"
              />
            </el-form-item>
            <el-form-item
              label="证书电子文件"
              required
            >
              <el-upload
                action="/iotapi/upload"
                class="avatar-uploader"
                :show-file-list="false"
              >
                <img
                  v-if="item.imgsrc"
                  class="avatar"
                  :src="fileDomain + item.imgsrc"
                />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
                <div
                  class="el-upload__text"
                  style="
                    position: absolute;
                    top: 90px;
                    left: 50px;
                    color: #8c939d;
                  "
                >
                  证书电子文件
                </div>
              </el-upload>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  // eslint-disable
  import { returnLogin } from '@/utils/utilwen'
  // import Parse from 'parse'
  export default {
    name: 'Preview',
    props: {
      laboratoryForm: {
        type: Object,
        default: () => ({
          name: '',
          region: '',
          imgsrc: '',
          desc: '',
          level: '',
          addr: '',
          buildstarttime: '',
          buildendtime: '',
          leadingname: '',
          linkname: '',
          lendingphone: '',
          linkphone: '',
          unit: '',
          category: '',
          area: '',
          dateOfIssue: '',
          updatedDate: '',
          initialRecognition: '',
          termOfValidity: '',
          licencsIssuing: '',
          imgsrc1: '',
        }),
      },
      otherform: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      const Registered = function (rule, value, callback) {
        var rules =
          /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/

        if (!rules.test(value)) {
          callback(new Error('请填写实验室面积'))
        } else {
          callback()
        }
      }
      return {
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
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          date2: [
            {
              type: 'date',
              required: true,
              message: '请选择时间',
              trigger: 'change',
            },
          ],
          buildstarttime: [
            {
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          buildendtime: [
            {
              type: 'date',
              required: true,
              message: '请选择日期',
              trigger: 'change',
            },
          ],
          credentialsname: [
            { required: true, message: '请输入正确证书编号', trigger: 'blur' },
          ],
          licencsIssuing: [
            { required: true, message: '请输入发证机关', trigger: 'blur' },
          ],
          dateOfIssue: [
            {
              type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          updatedDate: [
            {
              type: 'date',
              required: true,
              message: '请选择更新时间',
              trigger: 'change',
            },
          ],
          initialRecognition: [
            {
              type: 'date',
              required: true,
              message: '请选择初次认可时间',
              trigger: 'change',
            },
          ],
          termOfValidity: [
            {
              type: 'date',
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
              type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          updatedDate: [
            {
              type: 'date',
              required: true,
              message: '请选择更新时间',
              trigger: 'change',
            },
          ],
          initialRecognition: [
            {
              type: 'date',
              required: true,
              message: '请选择初次认可时间',
              trigger: 'change',
            },
          ],
          termOfValidity: [
            {
              type: 'date',
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
      beforeAvatarlaboratory(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        var extension =
          testmsg === 'jpg' ||
          testmsg === 'JPG' ||
          testmsg === 'png' ||
          testmsg === 'PNG' ||
          testmsg === 'bpm' ||
          testmsg === 'BPM'
        const isLt50M = file.size / 1024 / 1024 < 10
        if (!extension) {
          this.$message({
            message: '上传图片只能是jpg / png / bpm格式!',
            type: 'error',
          })
          return false // 必须加上return false; 才能阻止
        }
        if (!isLt50M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'error',
          })
          return false
        }
        return extension || isLt50M
      },
      handleAvatarlaboratory(response, file, fileList) {
        /* eslint-disable */
        this.laboratoryForm.imgsrc = response.path
        this.$message.success('上传成功')
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
      beforeAvatarUploadOther(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        var extension =
          testmsg === 'jpg' ||
          testmsg === 'JPG' ||
          testmsg === 'png' ||
          testmsg === 'PNG' ||
          testmsg === 'bpm' ||
          testmsg === 'BPM'
        const isLt50M = file.size / 1024 / 1024 < 10
        if (!extension) {
          this.$message({
            message: '上传图片只能是jpg / png / bpm格式!',
            type: 'error',
          })
          return false // 必须加上return false; 才能阻止
        }
        console.log(file)
        if (!isLt50M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'error',
          })
          return false
        }
        return extension || isLt50M
      },
      // 增加实验室
    },
  }
</script>

<style lang="scss" scoped>
  .laboratory {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px 60px;
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
  .laboratory .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .laboratory.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .laboratory .avatar-uploader-icon {
    width: 250px;
    height: 178px;
    font-size: 28px;
    line-height: 178px;
    color: #8c939d;
    text-align: center;
  }
  .laboratory .avatar {
    display: block;
    width: 250px;
    height: 178px;
  }
  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    font-size: 30px;
    color: #909399;
    background: #f5f7fa;
  }
</style>
