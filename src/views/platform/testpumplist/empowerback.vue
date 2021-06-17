<template>
  <div class="empower">
    <el-steps :active="allactive" simple>
      <el-step title="填写认证信息" icon="el-icon-edit" />
      <el-step title="填写实验室基本信息" icon="el-icon-upload" />
      <el-step title="审核结果" icon="el-icon-picture" />
    </el-steps>

    <!--认证企业新增-->
    <div v-if="allactive == 1">
      <el-steps :active="active">
        <el-step
          title="认证企业新增"
          icon="el-icon-s-check"
          description="企业认证新增"
        />
        <!-- <el-step title="企业检测资质备案" icon="el-icon-s-promotion" description="企业检测资质备案"></el-step> -->
        <el-step title="预览提交" icon="el-icon-picture" />
      </el-steps>

      <div v-if="active == 1" class="empowerone">
        <el-card shadow="always">
          <el-form
            ref="formrules"
            :model="authenticationForm"
            :rules="formrules"
            label-width="140px"
          >
            <el-row>
              <!--左边表单-->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="企业名称" prop="businessname">
                    <el-input
                      v-model="authenticationForm.businessname"
                      placeholder="请填写企业名称"
                    />
                  </el-form-item>
                  <el-form-item label="企业简称">
                    <el-input
                      v-model="authenticationForm.abbrname"
                      placeholder="请填写企业简称"
                    />
                  </el-form-item>
                  <el-form-item label="法人代表名称" prop="corporname">
                    <el-input
                      v-model="authenticationForm.corporname"
                      placeholder="请输入法人姓名"
                    />
                  </el-form-item>
                  <el-form-item label="法人代表身份证" required>
                    <el-col :span="11">
                      <img
                        v-if="authenticationForm.frontimageUrl"
                        :src="authenticationForm.frontimageUrl"
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
                        v-show="authenticationForm.frontimageUrl == ''"
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
                        v-show="authenticationForm.frontimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          top: 150px;
                          left: 200px;
                          margin-left: 0;
                        "
                        @click="authenticationForm.frontimageUrl = ''"
                      >
                        删除
                      </el-button>
                    </el-col>
                    <el-col :span="2" class="line">-</el-col>
                    <el-col :span="11" style="position: relative">
                      <img
                        v-if="authenticationForm.contraryimageUrl"
                        :src="authenticationForm.contraryimageUrl"
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
                        v-show="authenticationForm.contraryimageUrl == ''"
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
                        v-show="authenticationForm.contraryimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          top: 150px;
                          left: 190px;
                          margin-left: 0;
                        "
                        @click="authenticationForm.contraryimageUrl = ''"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="注册地址" prop="addr">
                    <el-cascader
                      v-model="authenticationForm.addr"
                      :options="options"
                      size="large"
                      @change="handleModChange"
                    />
                  </el-form-item>
                  <el-form-item label="营业年限" prop="businessduration">
                    <el-select
                      v-model="authenticationForm.businessduration"
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
                      v-model="authenticationForm.registeredcapital"
                      placeholder="请填写注册资金"
                    >
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="企业描述">
                    <el-input
                      v-model="authenticationForm.businessdesc"
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
                      v-model="authenticationForm.englishname"
                      placeholder="请输入企业英文名称"
                    />
                  </el-form-item>
                  <el-form-item label="统一社会信用代码" prop="creditcode">
                    <el-input
                      v-model="authenticationForm.creditcode"
                      placeholder="请输入社会信用代码"
                    />
                  </el-form-item>
                  <el-form-item label="法人代表身份证号" prop="identity">
                    <el-input
                      v-model="authenticationForm.identity"
                      placeholder="请输入法人身份证号码（18位）"
                    />
                  </el-form-item>
                  <el-form-item label="企业营业执照" required>
                    <img
                      v-if="authenticationForm.businesslicense"
                      :src="authenticationForm.businesslicense"
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
                      v-show="authenticationForm.businesslicense == ''"
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
                      v-show="authenticationForm.businesslicense != ''"
                      size="small"
                      type="danger"
                      style="
                        position: absolute;
                        top: 150px;
                        left: 200px;
                        margin-left: 0;
                      "
                      @click="authenticationForm.businesslicense = ''"
                    >
                      删除
                    </el-button>
                  </el-form-item>
                  <el-form-item label="街道地址" prop="roadress">
                    <el-input
                      v-model="authenticationForm.roadress"
                      placeholder="请填写企业街道地址"
                    />
                  </el-form-item>
                  <el-form-item label="企业规模">
                    <el-select
                      v-model="authenticationForm.region"
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
                      v-model="authenticationForm.businessscope"
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
            <el-button
              type="primary"
              style="margin-top: 12px"
              @click="next('formrules')"
            >
              提交,下一步
            </el-button>
            <el-button type="info">取消</el-button>
          </div>
        </el-card>
      </div>

      <!-- 预览提交
      <div v-if="active==2" class="empowerthird">
        <el-divider>企业认证</el-divider>
        <el-form ref="formrules" :model="form" :rules="formrules" label-width="140px">
          <el-row>
       <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="企业名称" prop="businessname">
                  <el-input v-model="authenticationPreviewForm.businessname" placeholder="请填写企业名称" readonly/>
                </el-form-item>
                <el-form-item label="企业简称" prop="abbrname">
                  <el-input v-model="authenticationPreviewForm.abbrname" placeholder="请填写企业简称" readonly/>
                </el-form-item>
                <el-form-item label="法人代表名称" prop="corporname">
                  <el-input v-model="authenticationPreviewForm.corporname" placeholder="请输入法人姓名" readonly/>
                </el-form-item>
                <el-form-item label="法人代表身份证" required>
                  <el-col :span="11">
                              :on-success="handleAvatarSuccessFront"
                      :before-upload="beforeAvatarUpload"
                    <el-upload
                      :show-file-list="false"
                      class="avatar-uploader"
                      action="/iotapi/upload"
                    >
                      <img v-if="authenticationPreviewForm.frontimageUrl" :src="authenticationPreviewForm.frontimageUrl" class="avatar" >
                      <i v-else class="el-icon-plus avatar-uploader-icon"/>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >身份证正面</div>
                    </el-upload>
                  </el-col>
                  <el-col :span="2" class="line">-</el-col>
                  <el-col :span="11" style="position:relative">
                       :on-success="handleAvatarSuccessContrary"
                      :before-upload="beforeAvatarUpload"
                    <el-upload
                      :show-file-list="false"
                      class="avatar-uploader"
                      action="/iotapi/upload"
                    >
                      <img v-if="authenticationPreviewForm.contraryimageUrl" :src="authenticationPreviewForm.contraryimageUrl" class="avatar" >
                      <i v-else class="el-icon-plus avatar-uploader-icon"/>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >身份证正反面</div>
                    </el-upload>
                  </el-col>
                </el-form-item>
                <el-form-item label="注册地址" prop="addr">
                  <el-cascader
                    :options="options"
                    v-model="authenticationPreviewForm.addr"
                    size="large"
                    readonly
                    @change="handleModChange"
                  />
                </el-form-item>
                <el-form-item label="营业年限" prop="businessduration">
                  <el-select v-model="authenticationPreviewForm.businessduration" placeholder="请选择营业年限" readonly>
                    <el-option label="初创企业" value="1"/>
                    <el-option label="1-3年" value="2"/>
                    <el-option label="3-5年" value="3"/>
                    <el-option label="5-10年" value="4"/>
                    <el-option label="10年以上" value="5"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="注册资金" prop="registeredcapital">
                  <el-input v-model="authenticationPreviewForm.registeredcapital" placeholder="请填写注册资金" readonly/>
                </el-form-item>
                <el-form-item label="企业描述" prop="businessdesc">
                  <el-input
                    v-model="authenticationPreviewForm.businessdesc"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入企业描述信息"
                    maxlength="300"
                    show-word-limit
                    readonly
                  />
                </el-form-item>
              </div>
            </el-col>
            右边表单
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="企业英文名称" prop="englishname">
                  <el-input v-model="authenticationPreviewForm.englishname" placeholder="请输入企业英文名称" readonly/>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="creditcode">
                  <el-input v-model="authenticationPreviewForm.creditcode" placeholder="请输入社会信用代码" readonly/>
                </el-form-item>
                <el-form-item label="法人代表身份证号" prop="identity">
                  <el-input v-model="authenticationPreviewForm.identity" placeholder="请输入法人身份证号码（18位）" readonly/>
                </el-form-item>
                <el-form-item label="企业营业执照" required>
                          :on-success="handleAvatarSuccessBusiness"
                    :before-upload="beforeAvatarUpload"
                  <el-upload
                    :show-file-list="false"
                    class="avatar-uploader"
                    action="/iotapi/upload"
                  >
                    <img v-if="authenticationPreviewForm.businesslicense" :src="authenticationPreviewForm.businesslicense" class="avatar" >
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                    <div
                      class="el-upload__text"
                      style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                    >企业营业执照</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="街道地址" prop="roadress">
                  <el-input v-model="authenticationPreviewForm.roadress" placeholder="请填写企业街道地址" readonly/>
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-select v-model="authenticationPreviewForm.region" placeholder="请选择企业规模" readonly>
                    <el-option label="10人以下" value="1"/>
                    <el-option label="11-50人" value="2"/>
                    <el-option label="50-100人" value="3"/>
                    <el-option label="101-500人" value="4"/>
                    <el-option label="501-1000人" value="5"/>
                    <el-option label="1000人以上" value="6"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="经营范围" prop="businessscope">
                  <el-input
                    v-model="authenticationPreviewForm.businessscope"
                    :rows="4"
                    type="textarea"
                    placeholder="请输入企业经营范围信息"
                    maxlength="300"
                    readonly
                    show-word-limit
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" style="margin-top: 12px;" @click="addEmpower">提交审核</el-button>
          <el-button type="info" @click="goBack">返回上一步</el-button>
        </div>
      </div>
    </div>
      实验室认证 -->
      <div v-if="allactive == 2">
        <!-- <el-steps :active="laboratoryactive" simple>
          <el-step title="填写实验室信息" icon="el-icon-s-promotion"/>
          <el-step title="预览提交审核" icon="el-icon-upload"/>
        </el-steps> -->
        <div class="block" style="box-sizing: border-box; padding: 30px">
          <p
            style="
              height: 40px;
              padding-left: 20px;
              margin: 0;
              font-size: 20px;
              line-height: 40px;
              border: 1px solid #cccccc;
            "
          >
            企业实验室认证
          </p>
          <div class="blocktop" style="margin-top: 20px">
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
            >
              <el-button
                type="primary"
                size="small"
                style="float: right"
                @click="addTab(editableTabsValue)"
              >
                新增
              </el-button>
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                此组件会抛出resultes事件,把数据传递过来
                <LaboratoryForm @resultes="getLaboratory" />
              </el-tab-pane>
            </el-tabs>
            <div style="text-align: center">
              <el-row>
                <el-button type="primary" @click="previewLaboratory">
                  确定,预览
                </el-button>
                <el-button type="info">取消</el-button>
              </el-row>
            </div>
          </div>
        </div>
        <div v-if="laboratoryactive == 2">
          <el-tabs v-model="laboratoryFormvalue" type="card">
            <el-tab-pane
              v-for="(item, index) in laboratorylist"
              :key="item.laboratoryForm.name"
              :label="'实验室' + (index + 1)"
              :name="item.laboratoryForm.name"
            >
              <Preview
                :laboratory-form="item.laboratoryForm"
                :otherform="item.otherslist"
              />
            </el-tab-pane>
          </el-tabs>
          <div style="text-align: center">
            <el-row>
              <el-button type="primary" @click="allactive = 3">确定</el-button>
              <el-button type="info" @click="laboratoryactive = 1">
                返回上一步
              </el-button>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="allactive == 2">
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
          <p style="font-size: 25px; color: #409eff">正在审核中</p>
          <p style="font-size: 20px">审核员联系电话：17201202365</p>
          <p style="font-size: 14px; color: #cccccc">
            预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解
          </p>
          <p>
            <el-button type="primary" @click="cancelAdd">
              撤销审核
              <i class="el-icon-s-fold" />
            </el-button>
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
                      :before-upload="beforeAvatarUploadOther" -->

                    <el-upload
                      :show-file-list="false"
                      class="avatar-uploader"
                      action="/iotapi/upload"
                    >
                      <img
                        v-if="addotherform.imgsrc"
                        :src="addotherform.imgsrc"
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
  </div>
</template>
<script>
  import { regionData, CodeToText } from 'element-china-area-data'
  // import Parse from 'parse'
  import { returnLogin } from '@/utils/return'
  import LaboratoryForm from '@/components/laboratoryForm'
  import Cookies from 'js-cookie'
  import Preview from '@/components/laboratoryForm/preview'
  var otherEmpowerlist = []
  export default {
    components: {
      LaboratoryForm,
      Preview,
    },
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
        laboratoryFormvalue: '1',
        editableTabs: [
          {
            title: '实验室1',
            name: '1',
            content: '',
          },
        ],
        tabIndex: 1,
        allactive: 1,
        active: 1,
        authenticationForm: {
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
        },
        authenticationPreviewForm: {
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
          addr: '', // 设备地址
          roadress: '', // 街道地址
          businessduration: '', // 营业年限
          businessdesc: '', // 企业描述
          businessscope: '', // 经营范围
          registeredcapital: '', // 注册资金
        },
        // formrules1: {
        //   identity: [
        //     { required: true, message: '请输入正确身份证号', trigger: 'blur' },
        //     { validator: idrules, trigger: 'blur' }
        //   ],
        //   businessname: [
        //     { required: true, message: '请输入企业名称', trigger: 'blur' }
        //   ],
        //   abbrname: [
        //     { required: true, message: '请输入企业简称', trigger: 'blur' }
        //   ],
        //   corporname: [
        //     { required: true, message: '请输入法人姓名', trigger: 'blur' }
        //   ],
        //   englishname: [
        //     { required: true, message: '请输入企业英文名称', trigger: 'blur' },
        //     { validator: Englishname }
        //   ],
        //   creditcode: [
        //     {
        //       required: true,
        //       message: '请输入统一社会信用代码',
        //       trigger: 'blur'
        //     },
        //     { validator: CreditCode }
        //   ],
        //   addr: [
        //     { required: true, message: '请选择公司注册地址', trigger: 'change' }
        //   ],
        //   roadress: [
        //     { required: true, message: '请输入街道地址', trigger: 'blur' }
        //   ],
        //   registeredcapital: [
        //     {
        //       required: true,
        //       message: '请输入公司注册资金',
        //       trigger: 'blur'
        //     },
        //     { validator: Registered }
        //   ],
        //   businessduration: [
        //     { required: true, message: '请选择公司营业年限', trigger: 'change' }
        //   ],
        //   businessdesc: [
        //     { required: true, message: '请输入企业描述信息', trigger: 'blur' }
        //   ],
        //   businessscope: [
        //     { required: true, message: '请输入企业经营范围', trigger: 'blur' }
        //   ]
        // },
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
        // 资质认证
        ruleForm: {
          cnasname: '',
          dateOfIssue: '',
          updatedDate: '',
          initialRecognition: '',
          termOfValidity: '',
          licencsIssuing: '',
          cnasimgsrc: '',
          cnasdesc: '',
        },
        ruleformcma: {
          cmaname: '',
          cmadateOfIssue: '',
          cmalicencsIssuing: '',
          cmatermOfValidity: '',
          cmaimgsrc: '',
          cmadesc: '',
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
        ruleForm1: {
          cnasname: '',
          dateOfIssue: '',
          updatedDate: '',
          initialRecognition: '',
          termOfValidity: '',
          licencsIssuing: '',
          cnasimgsrc: '',
          cnasdesc: '',
        },
        ruleForm2: {
          cmaname: '',
          cmadateOfIssue: '',
          cmalicencsIssuing: '',
          cmatermOfValidity: '',
          cmaimgsrc: '',
          cmadesc: '',
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
        ewpowerid: '',
        laboratorylist: [],
        imgtype: '',
      }
    },
    mounted() {
      // this.originData()
    },
    methods: {
      upload(event, type) {
        this.imgtype = type
        if (event) {
          var file = event.target.files[0] // name: "dangqi1.png" || type: "image/png"
          var name = file.name
          var testmsg = event.target.files[0].type
          var type = file.type.split('/')[0]
          var extension =
            testmsg === 'image/jpeg' ||
            testmsg === 'image/JPEG' ||
            testmsg === 'image/png' ||
            testmsg === 'image/PNG' ||
            testmsg === 'image/bpm' ||
            testmsg === 'image/BPM'
          if (!extension) {
            // 将图片img转化为base64
            this.$message({
              message: '请上传图片',
              type: 'error',
            })
            return false // 必须加上return false; 才能阻止
          } else {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            var that = this
            reader.onloadend = function () {
              var dataURL = reader.result
              var blob = that.dataURItoBlob(dataURL)
              that.uploadFile(blob, name) // 执行上传接口
            }
          }
        }
      },
      dataURItoBlob(dataURI) {
        // base64 解码
        var byteString = atob(dataURI.split(',')[1])
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: mimeString })
      },
      uploadFile(imgUrl, name) {
        var formdata = new FormData()
        formdata.append('file', imgUrl, name)
        formdata.append('output', 'json')
        formdata.append('path', Cookies.get('appids'))
        formdata.append('scene', Cookies.get('appids'))
        formdata.append('auth_token', Cookies.get('access_token_pump')) // 下面是要传递的参数
        // 此处必须设置为  multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
          },
        }
        this.$http
          .post(Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              if (this.imgtype == 'front') {
                this.authenticationForm.frontimageUrl = res.body.url
              } else if (this.imgtype == 'contrary') {
                this.authenticationForm.contraryimageUrl = res.body.url
              } else if (this.imgtype == 'business') {
                this.authenticationForm.businesslicense = res.body.url
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
      // 标签页点击事件
      tagGoIndex(index) {
        this.isshowactive = index
      },
      // 实验室认证
      addTag() {
        this.dynamicTags.push('实验室')
      },
      // 初始化事件判断是否有填写
      originData() {
        var Authentication = Parse.Object.extend('Authentication')
        var authentication = new Parse.Query(Authentication)
        authentication.find().then(
          (response) => {
            console.log(response)
            if (response.length > 0) {
              if (response[0].attributes.empower) {
                this.authenticationForm.name =
                  response[0].attributes.empower.name
                this.authenticationForm.region =
                  response[0].attributes.empower.region
                ;(this.authenticationForm.desc =
                  response[0].attributes.empower.desc),
                  (this.authenticationForm.identity =
                    response[0].attributes.empower.identity)
                this.authenticationForm.frontimageUrl =
                  response[0].attributes.empower.frontimageUrl // 身份证正面照
                this.authenticationForm.contraryimageUrl =
                  response[0].attributes.empower.contraryimageUrl // 身份证反面照
                this.authenticationForm.businesslicense =
                  response[0].attributes.empower.businesslicense // 企业营业执照
                this.authenticationForm.businessname =
                  response[0].attributes.empower.businessname // 公司名称
                this.authenticationForm.abbrname =
                  response[0].attributes.empower.abbrname // 企业简称
                this.authenticationForm.corporname =
                  response[0].attributes.empower.corporname // 法人代表名称
                this.authenticationForm.englishname =
                  response[0].attributes.empower.englishname // 英文名称
                this.authenticationForm.creditcode =
                  response[0].attributes.empower.creditcode // 统一社会信用代码
                this.authenticationForm.addr =
                  response[0].attributes.empower.addr // 设备地址
                this.authenticationForm.roadress =
                  response[0].attributes.empower.roadress // 街道地址
                this.authenticationForm.businessduration =
                  response[0].attributes.empower.businessduration // 营业年限
                this.authenticationForm.businessdesc =
                  response[0].attributes.empower.businessdesc // 企业描述
                this.authenticationForm.businessscope =
                  response[0].attributes.empower.businessscope // 经营范围
                this.authenticationForm.registeredcapital =
                  response[0].attributes.empower.registeredcapital // 注册资金
                this.ewpowerid = response[0].id
              }
              if (response[0].attributes.cnas) {
                ;(this.ruleForm.cnasname =
                  response[0].attributes.cnas.cnasname),
                  (this.ruleForm.dateOfIssue =
                    response[0].attributes.cnas.dateOfIssue),
                  (this.ruleForm.updatedDate =
                    response[0].attributes.cnas.updatedDate),
                  (this.ruleForm.initialRecognition =
                    response[0].attributes.cnas.initialRecognition),
                  (this.ruleForm.termOfValidity =
                    response[0].attributes.cnas.termOfValidity),
                  (this.ruleForm.licencsIssuing =
                    response[0].attributes.cnas.licencsIssuing)
                this.ruleForm.cnasimgsrc =
                  response[0].attributes.cnas.cnasimgsrc
                this.ruleForm.cnasdesc = response[0].attributes.cnas.cnasdesc
              }
              if (response[0].attributes.cma) {
                ;(this.ruleformcma.cmaname =
                  response[0].attributes.cma.cmaname),
                  (this.ruleformcma.cmadateOfIssue =
                    response[0].attributes.cma.cmadateOfIssue),
                  (this.ruleformcma.cmalicencsIssuing =
                    response[0].attributes.cma.cmalicencsIssuing),
                  (this.ruleformcma.cmatermOfValidity =
                    response[0].attributes.cma.cmatermOfValidity),
                  (this.ruleformcma.cmaimgsrc =
                    response[0].attributes.cma.cmaimgsrc),
                  (this.ruleformcma.cmadesc =
                    response[0].attributes.cma.cmadesc)
              }
              if (response[0].attributes.other) {
                otherEmpowerlist = response[0].attributes.other
              }
            }
          },
          (error) => {
            returnLogin(error)
          }
        )
      },
      // 第一个确定
      next(formName) {
        this.active++
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.authenticationForm.frontimageUrl == '') {
              this.$message.error('请上传身份证正面照')
              return
            }
            if (this.authenticationForm.contraryimageUrl == '') {
              this.$message.error('请上传身份证背面照')
              return
            }
            if (this.authenticationForm.businesslicense == '') {
              this.$message.error('请上传企业营业执照')
              return
            }
            // var userid = Parse.User.current().id
            // var Authentication = Parse.Object.extend('Authentication')
            // var authentication = new Authentication()
            // if (this.empowerid != '') {
            //   authentication.id = this.ewpowerid
            // }
            // var acl = new Parse.ACL()
            console.log(this.ewpowerid)
            const empower = {
              name: this.authenticationForm.name,
              region: this.authenticationForm.region,
              desc: this.authenticationForm.desc,
              identity: this.authenticationForm.identity,
              frontimageUrl: this.authenticationForm.frontimageUrl, // 身份证正面照
              contraryimageUrl: this.authenticationForm.contraryimageUrl, // 身份证反面照
              businesslicense: this.authenticationForm.businesslicense, // 企业营业执照
              businessname: this.authenticationForm.businessname, // 公司名称
              abbrname: this.authenticationForm.abbrname, // 企业简称
              corporname: this.authenticationForm.corporname, // 法人代表名称
              englishname: this.authenticationForm.englishname, // 英文名称
              creditcode: this.authenticationForm.creditcode, // 统一社会信用代码
              addr: this.authenticationForm.addr, // 设备地址
              roadress: this.authenticationForm.roadress, // 街道地址
              businessduration: this.authenticationForm.businessduration, // 营业年限
              businessdesc: this.authenticationForm.businessdesc, // 企业描述
              businessscope: this.authenticationForm.businessscope, // 经营范围
              registeredcapital: this.authenticationForm.registeredcapital, // 注册资金
            }
            console.log(empower)
            // acl.setRoleWriteAccess('Auditor', true)
            // acl.setRoleReadAccess('Auditor', true)
            // acl.setRoleWriteAccess('Labadmin', true)
            // acl.setRoleReadAccess('Labadmin', true)
            // acl.setRoleWriteAccess('Inspector', true)
            // acl.setRoleReadAccess('Inspector', true)
            // acl.setReadAccess(userid, true)
            // acl.setWriteAccess(userid, true)
            // authentication.set('ACL', acl)
            // authentication.save().then(resultes => {
            //   if (resultes) {
            //     this.$message.success('企业认证成功')
            //     this.active++
            //     this.authenticationPreviewForm = this.authenticationForm
            //     if (this.ewpowerid == '') {
            //       var Authentication = Parse.Object.extend('Authentication')
            //       var authentication = new Parse.Query(Authentication)
            //       authentication.find().then(response => {
            //         this.ewpowerid = response[0].id
            //       })
            //     }
            //   }
            // }, error => {
            //   returnLogin(error)
            // })
          } else {
            this.$message.error('有必填项未填写')
            return false
          }
        })
      },
      beforeAvatarUpload1(file) {
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
      beforeAvatarUpload2(file) {
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
      handleClose() {
        this.dialogVisible = false
      },
      nextTo(formName1, formName2) {
        var valid1
        var valid2
        this.$refs[formName1].validate((valid) => {
          if (valid) {
            valid1 = true
          }
        })
        this.$refs[formName2].validate((valid) => {
          if (valid) {
            valid2 = true
          }
        })
        valid1 = true
        valid2 = true
        if (valid1 || valid2) {
          if (valid1) {
            if (this.ruleForm.cnasimgsrc == '') {
              this.$message.error('请上传CNAS证件照片')
              return
            }
          }
          if (valid2) {
            if (this.ruleformcma.cmaimgsrc == '') {
              this.$message.error('请上传CMA证件照片')
              return
            }
          }
          var Authentication = Parse.Object.extend('Authentication')
          var authentication = new Authentication()
          authentication.id = this.ewpowerid
          authentication.set('cnas', {
            cnasname: this.ruleForm.cnasname,
            dateOfIssue: this.ruleForm.dateOfIssue,
            updatedDate: this.ruleForm.updatedDate,
            initialRecognition: this.ruleForm.initialRecognition,
            termOfValidity: this.ruleForm.termOfValidity,
            licencsIssuing: this.ruleForm.licencsIssuing,
            cnasimgsrc: this.ruleForm.cnasimgsrc,
            cnasdesc: this.ruleForm.cnasdesc,
          })
          authentication.set('cma', {
            cmaname: this.ruleformcma.cmaname,
            cmadateOfIssue: this.ruleformcma.cmadateOfIssue,
            cmalicencsIssuing: this.ruleformcma.cmalicencsIssuing,
            cmatermOfValidity: this.ruleformcma.cmatermOfValidity,
            cmaimgsrc: this.ruleformcma.cmaimgsrc,
            cmadesc: this.ruleformcma.cmadesc,
          })
          authentication.set('status', 'Pending')
          authentication.save().then(
            (response) => {
              if (response) {
                this.$message.success('添加成功')
                this.active++
                this.authenticationPreviewForm = this.authenticationForm
                this.ruleForm1 = this.ruleForm
                this.ruleForm2 = this.ruleformcma
                this.previewother.otherform = otherEmpowerlist
              }
            },
            (error) => {
              returnLogin(error)
            }
          )
        }
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
      goBack() {
        if (this.active > 1 && this.active <= 3) {
          this.active--
        }
      },
      handleModChange(value) {
        // 修改
        console.log(value)
      },
      // 提交审核
      addEmpower() {
        console.log(this.authenticationForm, this.ruleForm, this.ruleformcma)
        this.authenticationPreviewForm = this.authenticationForm
        this.ruleForm1 = this.ruleForm
        this.ruleForm2 = this.ruleformcma
        var Authentication = Parse.Object.extend('Authentication')
        var authentication = new Authentication()
        authentication.id = this.ewpowerid
        authentication.set('other', otherEmpowerlist)
        authentication.save().then((resultes) => {
          if (resultes) {
            this.$message.success('提交成功')
            this.allactive++
          }
        })
      },
      cancelAdd() {
        this.allactive = 1
        this.active = 1
      },
      getLaboratory(value) {
        this.laboratorylist.push(value)
      },
      previewLaboratory() {
        if (this.laboratorylist.length == 0) {
          this.$message.error('请至少提交一个实验室认证')
          return
        }
        this.laboratoryFormvalue = this.laboratorylist[0].laboratoryForm.name
        this.laboratoryactive = 2
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
