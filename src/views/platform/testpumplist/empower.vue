<template>
  <div class="empower">
    <el-steps :active="allactive" simple>
      <el-step title="填写认证信息" icon="el-icon-edit" />
      <el-step title="填写实验室信息" icon="el-icon-upload" />
      <el-step title="审核结果" icon="el-icon-picture" />
    </el-steps>

    <!--认证企业新增-->
    <div v-show="allactive == 1">
      <div class="empowerone">
        <el-card shadow="always">
          <el-form
            ref="formrules"
            :model="enterpriseForm"
            :rules="formrules"
            label-width="140px"
          >
            <el-row>
              <!--左边表单-->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="企业名称" prop="businessname">
                    <el-input
                      v-model="enterpriseForm.businessname"
                      placeholder="请填写企业名称"
                    />
                  </el-form-item>
                  <el-form-item label="企业简称">
                    <el-input
                      v-model="enterpriseForm.abbrname"
                      placeholder="请填写企业简称"
                    />
                  </el-form-item>
                  <el-form-item label="法人代表名称" prop="corporname">
                    <el-input
                      v-model="enterpriseForm.corporname"
                      placeholder="请输入法人姓名"
                    />
                  </el-form-item>
                  <el-form-item label="法人代表身份证" required>
                    <el-col :span="11">
                      <img
                        v-if="enterpriseForm.frontimageUrl"
                        :src="fileDomain + enterpriseForm.frontimageUrl"
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
                            z-index: 5;
                            width: 200px;
                            height: 200px;
                            cursor: pointer;
                            opacity: 0;
                          "
                          @change="upload($event, 'front')"
                        />
                      </form>
                      <div
                        v-show="enterpriseForm.frontimageUrl == ''"
                        class="el-upload__text"
                        style="
                          position: absolute;
                          top: 90px;
                          left: 110px;
                          color: #8c939d;
                        "
                      >
                        正面
                      </div>
                      <el-button
                        v-show="enterpriseForm.frontimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          top: 150px;
                          left: 200px;
                          margin-left: 0;
                        "
                        @click="enterpriseForm.frontimageUrl = ''"
                      >
                        删除
                      </el-button>
                    </el-col>
                    <el-col :span="2" class="line">-</el-col>
                    <el-col :span="11" style="position: relative">
                      <img
                        v-if="enterpriseForm.contraryimageUrl"
                        :src="fileDomain + enterpriseForm.contraryimageUrl"
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
                            z-index: 5;
                            width: 200px;
                            height: 200px;
                            cursor: pointer;
                            opacity: 0;
                          "
                          @change="upload($event, 'contrary')"
                        />
                      </form>
                      <div
                        v-show="enterpriseForm.contraryimageUrl == ''"
                        class="el-upload__text"
                        style="
                          position: absolute;
                          top: 90px;
                          left: 110px;
                          color: #8c939d;
                        "
                      >
                        反面
                      </div>
                      <!-- </el-upload> -->
                      <el-button
                        v-show="enterpriseForm.contraryimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          top: 150px;
                          left: 190px;
                          margin-left: 0;
                        "
                        @click="enterpriseForm.contraryimageUrl = ''"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="注册地址" prop="addr">
                    <el-cascader
                      v-model="enterpriseForm.addr"
                      :options="options"
                      size="large"
                      @change="handleModChange"
                    />
                  </el-form-item>
                  <el-form-item label="营业年限" prop="businessduration">
                    <el-select
                      v-model="enterpriseForm.businessduration"
                      placeholder="请选择营业年限"
                    >
                      <el-option label="初创企业" value="1" />
                      <el-option label="1-3年" value="2" />
                      <el-option label="3-5年" value="3" />
                      <el-option label="5-10年" value="4" />
                      <el-option label="10年以上" value="5" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="注册资金" prop="registeredcapital">
                    <el-input
                      v-model="enterpriseForm.registeredcapital"
                      placeholder="请填写注册资金"
                    >
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="企业描述">
                    <el-input
                      v-model="enterpriseForm.businessdesc"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入企业描述信息"
                      maxlength="300"
                      show-word-limit
                    />
                  </el-form-item>
                </div>
              </el-col>
              <!--右边表单-->
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="企业英文名称">
                    <el-input
                      v-model="enterpriseForm.englishname"
                      placeholder="请输入企业英文名称"
                    />
                  </el-form-item>
                  <!-- prop="creditcode" -->
                  <el-form-item label="统一社会信用代码">
                    <el-input
                      v-model="enterpriseForm.creditcode"
                      placeholder="请输入社会信用代码"
                    />
                  </el-form-item>
                  <!-- prop="identity" -->
                  <el-form-item label="法人代表身份证号">
                    <el-input
                      v-model="enterpriseForm.identity"
                      placeholder="请输入法人身份证号码（18位）"
                    />
                  </el-form-item>
                  <el-form-item label="企业营业执照" required>
                    <img
                      v-if="enterpriseForm.businesslicense"
                      :src="fileDomain + enterpriseForm.businesslicense"
                      class="avatar"
                    />
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                      style="width: 300px; height: 200px"
                    />
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
                          z-index: 5;
                          width: 200px;
                          height: 200px;
                          cursor: pointer;
                          opacity: 0;
                        "
                        @change="upload($event, 'business')"
                      />
                    </form>
                    <div
                      v-show="enterpriseForm.businesslicense == ''"
                      class="el-upload__text"
                      style="
                        position: absolute;
                        top: 90px;
                        left: 100px;
                        color: #8c939d;
                      "
                    >
                      企业营业执照
                    </div>
                    <el-button
                      v-show="enterpriseForm.businesslicense != ''"
                      size="small"
                      type="danger"
                      style="
                        position: absolute;
                        top: 150px;
                        left: 200px;
                        margin-left: 0;
                      "
                      @click="enterpriseForm.businesslicense = ''"
                    >
                      删除
                    </el-button>
                  </el-form-item>
                  <el-form-item label="街道地址" prop="roadress">
                    <el-input
                      v-model="enterpriseForm.roadress"
                      placeholder="请填写企业街道地址"
                    />
                  </el-form-item>
                  <el-form-item label="企业规模">
                    <el-select
                      v-model="enterpriseForm.region"
                      placeholder="请选择企业规模"
                    >
                      <el-option label="10人以下" value="1" />
                      <el-option label="11-50人" value="2" />
                      <el-option label="50-100人" value="3" />
                      <el-option label="101-500人" value="4" />
                      <el-option label="501-1000人" value="5" />
                      <el-option label="1000人以上" value="6" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="经营范围" prop="businessscope">
                    <el-input
                      v-model="enterpriseForm.businessscope"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入企业经营范围信息"
                      maxlength="300"
                      show-word-limit
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary" style="margin-top: 12px" @click="next(2)">
              下一步
            </el-button>
            <el-button type="info">取消</el-button>
          </div>
        </el-card>
      </div>
    </div>
    <!--实验室认证-->
    <div v-show="allactive == 2">
      <div class="block" style="box-sizing: border-box; padding: 30px">
        <div>企业实验室认证</div>

        <div class="blocktop">
          <!--           <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-button
              type="primary"
              size="small"
              style="float:right"
              @click="addTab(editableTabsValue)"
            >新增</el-button>
            <el-tab-pane
              v-for="(item) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <LaboratoryForm @resultes="getLaboratory" />
            </el-tab-pane>
          </el-tabs> -->

          <!-- 此组件会抛出resultes事件,把数据传递过来 -->
          <VablaboratoryForm ref="laboratoryForm" />
          <div style="text-align: center">
            <el-row>
              <el-button
                v-show="phase == 1"
                type="primary"
                @click="submitVerify"
              >
                提交审核
              </el-button>

              <el-button
                v-show="phase == 2"
                :disabled="currentRow.data && currentRow.data.verifyStatus == 1"
                type="primary"
                @click="submitVerifyUpdate"
              >
                提交更新
              </el-button>

              <el-button type="info" plain @click="allactive = 1">
                上一步
              </el-button>
              <el-button
                v-show="phase == 2"
                type="info"
                plain
                @click="allactive = 3"
              >
                审核结果
              </el-button>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-if="allactive == 3">
      <div
        class="block"
        style="padding: 30px; margin: 0 auto; text-align: center"
      >
        <el-image>
          <div slot="error" class="image-slot">
            <svg-icon
              icon-class="empowerexamine"
              style="width: 8rem; height: 8rem"
            />
          </div>
        </el-image>
        <p
          v-show="currentRow.data.verifyStatus == 0"
          style="font-size: 25px; color: #e6a23c"
        >
          未审核
        </p>
        <p
          v-show="currentRow.data.verifyStatus == 1"
          style="font-size: 25px; color: #67c23a"
        >
          审核通过
        </p>
        <p
          v-show="currentRow.data.verifyStatus == 2"
          style="font-size: 25px; color: #f56c6c"
        >
          审核不通过
        </p>

        <p
          v-show="currentRow.data.verifyStatus == 0"
          style="font-size: 14px; color: #cccccc"
        >
          预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解
        </p>
        <p>
          <el-button type="info" plain @click="allactive = 2">返回</el-button>

          <!--     <el-button type="primary" @click="cancelAdd">
            填写新的企业资质
            <i class="el-icon-s-fold" />
          </el-button> -->
        </p>
      </div>
    </div>
    <!--其他资质弹窗-->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="其他资质添加"
      width="60%"
    >
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
                font-size: 14px;
                color: #409eff;
                border-bottom: 1px solid #cccccc;
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
                  <!--   :on-success="handleAvatarSuccessOther"
                  :before-upload="beforeAvatarUploadOther"-->

                  <el-upload
                    :show-file-list="false"
                    class="avatar-uploader"
                    action="/iotapi/upload"
                  >
                    <img
                      v-if="addotherform.imgsrc"
                      :src="fileDomain + addotherform.imgsrc"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
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
                  <el-button
                    v-show="addotherform.imgsrc != ''"
                    size="small"
                    type="danger"
                    style="
                      position: absolute;
                      top: 150px;
                      left: 200px;
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOther('addotherform')">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { regionData } from 'element-china-area-data'
  var otherEmpowerlist = []
  export default {
    name: 'Empower',
    components: {},
    data() {
      const idrules = function (rule, value, callback) {
        var rules =
          /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
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
      const Englishname = function (rule, value, callback) {
        var rules = /^[a-zA-Z&.,\'\/\-\s]+$/g
        if (!rules.test(value)) {
          callback(new Error('请输入英文名称'))
        } else {
          callback()
        }
      }
      const CreditCode = function (rule, value, callback) {
        var rules = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/
        if (!rules.test(value)) {
          callback(new Error('请输入正确统一社会编码'))
        } else {
          if (value.length > 18) {
            callback(new Error('请输入18位统一社会编码'))
          } else {
            callback()
          }
        }
      }
      const Registered = function (rule, value, callback) {
        var rules =
          /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/

        if (!rules.test(value)) {
          callback(new Error('请填写公司注册资金,精确2位小数'))
        } else {
          callback()
        }
      }
      return {
        laboratoryactive: 1,
        editableTabsValue: '1',
        editableTabs: [
          {
            title: '实验室1',
            name: '1',
            content: '',
          },
        ],
        tabIndex: 1,

        allactive: 1,
        enterpriseForm: this.enterpriseInit(),
        options: regionData,
        formrules: {
          identity: [
            { required: true, message: '请输入正确身份证号', trigger: 'blur' },
            { validator: idrules, trigger: 'blur' },
          ],
          businessname: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
          ],
          abbrname: [
            { required: true, message: '请输入企业简称', trigger: 'blur' },
          ],
          corporname: [
            { required: true, message: '请输入法人姓名', trigger: 'blur' },
          ],
          englishname: [
            { required: true, message: '请输入企业英文名称', trigger: 'blur' },
            { validator: Englishname },
          ],
          creditcode: [
            {
              required: true,
              message: '请输入统一社会信用代码',
              trigger: 'blur',
            },
            { validator: CreditCode },
          ],
          addr: [
            {
              required: true,
              message: '请选择公司注册地址',
              trigger: 'change',
            },
          ],
          roadress: [
            { required: true, message: '请输入街道地址', trigger: 'blur' },
          ],
          registeredcapital: [
            {
              required: true,
              message: '请输入公司注册资金',
              trigger: 'blur',
            },
            { validator: Registered },
          ],
          businessduration: [
            {
              required: true,
              message: '请选择公司营业年限',
              trigger: 'change',
            },
          ],
          businessdesc: [
            { required: true, message: '请输入企业描述信息', trigger: 'blur' },
          ],
          businessscope: [
            { required: true, message: '请输入企业经营范围', trigger: 'blur' },
          ],
        },
        laboratoryBigDataObj: {
          laboratoryInfo: {},
        },
        ruleformrulecma: {
          cmaname: [
            { required: true, message: '请输入正确证书编号', trigger: 'blur' },
          ],
          cmadateOfIssue: [
            {
              type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          cmalicencsIssuing: [
            { required: true, message: '请输入发证机关', trigger: 'blur' },
          ],
          cmatermOfValidity: [
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
        ruleRules: {
          cnasname: [
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
        ruleRules2: {
          cmaname: [
            { required: true, message: '请输入正确证书编号', trigger: 'blur' },
          ],
          cmadateOfIssue: [
            {
              type: 'date',
              required: true,
              message: '选择签发日期',
              trigger: 'change',
            },
          ],
          cmalicencsIssuing: [
            { required: true, message: '请输入发证机关', trigger: 'blur' },
          ],
          cmatermOfValidity: [
            {
              type: 'date',
              required: true,
              message: '请选择有效期至',
              trigger: 'change',
            },
          ],
        },
        ruleRules1: {
          cnasname: [
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
        dialogVisible: false,
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
        previewother: {
          otherform: [],
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
        imgtype: '',
        currentRow: {},
        phase: 1,
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
    },
    mounted() {
      this.getCompanyAuthentication()
    },

    methods: {
      getCompanyAuthentication() {
        this.$axiosWen
          .get('/classes/Dict', {
            params: {
              where: {
                type: 'CompanyAuthentication',
              },
              order: '-updatedAt',
            },
          })
          .then((response) => {
            if (response && response.results && response.results.length > 0) {
              this.phase = 2
              this.fillData(response.results[0])
            }
          })
          .catch((error) => {
            console.log('Dict err', error)
          })
      },
      fillData(resData) {
        this.currentRow = resData
        console.log('resData ###', resData)

        /* laboratoryBigDataObj: {
        laboratoryInfo:{}
      } */

        Object.assign(
          this.enterpriseForm,
          resData['data']['CompanyAuthentication']
        )

        this.$refs['laboratoryForm'].fillData(resData['data']['Laboratory'])
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
        formdata.append('auth_token', this.$Cookies.get('access_token_pump')) // 下面是要传递的参数
        this.$http
          .post(this.$Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              if (this.imgtype == 'front') {
                this.enterpriseForm.frontimageUrl = res.body.src
              } else if (this.imgtype == 'contrary') {
                this.enterpriseForm.contraryimageUrl = res.body.src
              } else if (this.imgtype == 'business') {
                this.enterpriseForm.businesslicense = res.body.src
              }
            }
          })
          .catch((error) => {
            this.$message.error(error.bodyText)
          })
      },
      addTab(targetName) {
        const newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: '实验室' + this.tabIndex,
          name: newTabName,
          content: 'New Tab content',
        })
        this.editableTabsValue = newTabName
      },
      removeTab(targetName) {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }

        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      },
      next(id) {
        if (id == 2) {
          /*         this.$refs.formrules.validate(valid => {
          if (valid) {
            if (this.enterpriseForm.frontimageUrl == "") {
              this.$message.error("请上传身份证正面照");
              return;
            }
            if (this.enterpriseForm.contraryimageUrl == "") {
              this.$message.error("请上传身份证背面照");
              return;
            }
            if (this.enterpriseForm.businesslicense == "") {
              this.$message.error("请上传企业营业执照");
              return;
            }
            // this.authenticationPreviewForm = this.enterpriseForm;
          } else {
            this.$message.error("有必填项未填写");
            return false;
          } */
          this.allactive = 2

          // });
        } else {
          this.uploadFrom()
        }
      },
      handleClose() {
        this.dialogVisible = false
      },
      // 其他资质添加
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
            otherEmpowerlist.push(obj)
            this.$refs[formName].resetFields()
            this.addotherform.imgsrc = ''
            this.dialogVisible = false
          }
        })
      },
      // 确定
      addOther() {
        if (this.otherForm.other == '') {
          this.$message.warning('请填写其他资质名称')
        } else {
          this.dialogVisible = true
        }
      },
      handleModChange(value) {
        // 修改
        console.log(value)
      },
      cancelAdd() {
        this.initData()
        this.allactive = 1
      },
      // 初始化数据
      initData() {
        this.enterpriseForm = this.enterpriseInit()
      },
      enterpriseInit() {
        return {
          name: '',
          region: '',
          desc: '',
          identity: '',
          frontimageUrl: '', // 身份证正面照
          contraryimageUrl: '', // 身份证反面照
          businesslicense: '', // 企业营业执照
          businessname: '', // 公司名称
          abbrname: '', // 企业简称
          corporname: '', // 法人代表名称
          englishname: '', // 英文名称
          creditcode: '', // 统一社会信用代码
          addr: [], // 设备地址
          roadress: '', // 街道地址
          businessduration: '', // 营业年限
          businessdesc: '', // 企业描述
          businessscope: '', // 经营范围
          registeredcapital: '', // 注册资金
        }
      },
      submitVerify() {
        this.$refs['laboratoryForm'].getFormData().then((resData) => {
          if (resData && resData.laboratoryObj) {
            this.laboratoryBigDataObj.laboratoryInfo = resData.laboratoryObj
            this.uploadFrom()
          }
        })
      },
      submitVerifyUpdate() {
        this.$refs['laboratoryForm'].getFormData().then((resData) => {
          if (resData && resData.laboratoryObj) {
            this.laboratoryBigDataObj.laboratoryInfo = resData.laboratoryObj
            this.uploadFromUpdate()
          }
        })
      },
      uploadFromUpdate() {
        const enterpriseTempData = {
          CompanyAuthentication: this.enterpriseForm,
          Laboratory: this.laboratoryBigDataObj,
          verifyStatus: 0,
        }

        this.$axiosWen
          .put('classes/Dict/' + this.currentRow.objectId, {
            data: enterpriseTempData,
          })
          .then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '更新成功',
              })
              this.allactive = 3
            }
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: '更新失敗',
            })
          })
      },
      // 上传
      uploadFrom() {
        const roleName = this.$store.state.user.roles[0]['name']

        const userName = this.$store.state.user['name']

        if (!roleName) {
          this.$message({
            message: '未获取到角色名',
          })
          return
        }

        const aclKey = 'role' + ':' + roleName
        const aclObj = {}
        const enterpriseTempData = {
          CompanyAuthentication: this.enterpriseForm,
          Laboratory: this.laboratoryBigDataObj,
          verifyStatus: 0, // 0 未审核 1 审核通过 2 审核不通过
        }
        aclObj[aclKey] = { read: true, write: true }

        this.$axiosWen
          .post('classes/Dict', {
            ACL: aclObj,
            type: 'CompanyAuthentication',
            data: enterpriseTempData,
            key: userName,
          })
          .then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '提交成功',
              })
              this.allactive = 3
            }
          })
          .catch((e) => {
            this.$message({
              type: 'error',
              message: '提交失敗',
            })
          })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .empower {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px 60px;
    background: #ffffff;
    .empowerone {
      width: 100%;
      height: auto;
      .el-form {
        .el-col-12 {
          padding: 20px;
          @media screen and (max-width: 1300px) {
            width: 100%;
          }
          ::v-deep .el-select {
            width: 100%;
          }
          ::v-deep .el-cascader {
            width: 100%;
          }
        }
      }
    }
    .empowerthird {
      width: 100%;
      height: auto;
      .el-form {
        .el-col-12 {
          padding: 20px;
          @media screen and (max-width: 1300px) {
            width: 100%;
          }
          ::v-deep .el-select {
            width: 100%;
          }
          ::v-deep .el-cascader {
            width: 100%;
          }
        }
      }
    }
    .empowertwo {
      width: 100%;
      height: auto;
      .el-form {
        .el-col-12 {
          padding: 20px;

          @media screen and (max-width: 1300px) {
            width: 100%;
          }
          ::v-deep .el-select {
            width: 100%;
          }
          ::v-deep .el-cascader {
            width: 100%;
          }
        }
      }
    }
    ::v-deep .el-form-item--small {
      margin-bottom: 18px;
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-date-editor {
        width: 100%;
      }
    }
    //::v-deep  .el-form-item__label{
    //         background:pink;
    //       }
  }
</style>
<style>
  .empower .avatar-uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .empower.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .empower .avatar-uploader-icon {
    width: 250px;
    height: 178px;
    font-size: 28px;
    line-height: 178px;
    color: #8c939d;
    text-align: center;
    border: 1px solid #cccccc;
  }
  .empower .avatar {
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
  .empower .el-tabs__header {
    margin-top: 20px;
  }
</style>
