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
                        :src="fileDomain + authenticationForm.frontimageUrl"
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
                        v-show="authenticationForm.frontimageUrl == ''"
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
                        v-show="authenticationForm.frontimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          left: 200px;
                          top: 150px;
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
                        :src="fileDomain + authenticationForm.contraryimageUrl"
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
                        v-show="authenticationForm.contraryimageUrl == ''"
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
                      <!-- </el-upload> -->
                      <el-button
                        v-show="authenticationForm.contraryimageUrl != ''"
                        size="small"
                        type="danger"
                        style="
                          position: absolute;
                          left: 190px;
                          top: 150px;
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
                      :src="fileDomain + authenticationForm.businesslicense"
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
                          opacity: 0;
                          z-index: 5;
                          height: 200px;
                          width: 200px;
                          cursor: pointer;
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
                        color: #8c939d;
                        left: 100px;
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
                        left: 200px;
                        top: 150px;
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
            <el-button type="primary" style="margin-top: 12px" @click="next(2)">
              提交,下一步
            </el-button>
            <el-button type="info">取消</el-button>
          </div>
        </el-card>
      </div>

      <!--预览提交-->
      <div v-if="active == 2" class="empowerthird">
        <el-divider>企业认证</el-divider>
        <el-form
          ref="authenticationPreviewFormRef"
          :model="authenticationPreviewForm"
          :rules="formrules"
          label-width="140px"
        >
          <el-row>
            <!--左边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="企业名称" prop="businessname">
                  <el-input
                    v-model="authenticationPreviewForm.businessname"
                    placeholder="请填写企业名称"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="企业简称" prop="abbrname">
                  <el-input
                    v-model="authenticationPreviewForm.abbrname"
                    placeholder="请填写企业简称"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="法人代表名称" prop="corporname">
                  <el-input
                    v-model="authenticationPreviewForm.corporname"
                    placeholder="请输入法人姓名"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="法人代表身份证" required>
                  <el-col :span="11">
                    <!--           :on-success="handleAvatarSuccessFront"
                    :before-upload="beforeAvatarUpload"-->

                    <el-upload
                      :show-file-list="false"
                      class="avatar-uploader"
                      action="/iotapi/upload"
                    >
                      <img
                        v-if="authenticationPreviewForm.frontimageUrl"
                        :src="
                          fileDomain + authenticationPreviewForm.frontimageUrl
                        "
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                      <div
                        class="el-upload__text"
                        style="
                          position: absolute;
                          top: 90px;
                          color: #8c939d;
                          left: 80px;
                        "
                      >
                        身份证正面
                      </div>
                    </el-upload>
                  </el-col>
                  <el-col :span="2" class="line">-</el-col>
                  <el-col :span="11" style="position: relative">
                    <!--    :on-success="handleAvatarSuccessContrary"
                    :before-upload="beforeAvatarUpload"-->
                    <el-upload
                      :show-file-list="false"
                      class="avatar-uploader"
                      action="/iotapi/upload"
                    >
                      <img
                        v-if="authenticationPreviewForm.contraryimageUrl"
                        :src="
                          fileDomain +
                          authenticationPreviewForm.contraryimageUrl
                        "
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                      <div
                        class="el-upload__text"
                        style="
                          position: absolute;
                          top: 90px;
                          color: #8c939d;
                          left: 80px;
                        "
                      >
                        身份证正反面
                      </div>
                    </el-upload>
                  </el-col>
                </el-form-item>
                <el-form-item label="注册地址" prop="addr">
                  <el-cascader
                    v-model="authenticationPreviewForm.addr"
                    :options="options"
                    size="large"
                    readonly
                    @change="handleModChange"
                  />
                </el-form-item>
                <el-form-item label="营业年限" prop="businessduration">
                  <el-select
                    v-model="authenticationPreviewForm.businessduration"
                    placeholder="请选择营业年限"
                    readonly
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
                    v-model="authenticationPreviewForm.registeredcapital"
                    placeholder="请填写注册资金"
                    readonly
                  />
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
            <!--右边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="企业英文名称" prop="englishname">
                  <el-input
                    v-model="authenticationPreviewForm.englishname"
                    placeholder="请输入企业英文名称"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="creditcode">
                  <el-input
                    v-model="authenticationPreviewForm.creditcode"
                    placeholder="请输入社会信用代码"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="法人代表身份证号" prop="identity">
                  <el-input
                    v-model="authenticationPreviewForm.identity"
                    placeholder="请输入法人身份证号码（18位）"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="企业营业执照" required>
                  <!--         :on-success="handleAvatarSuccessBusiness"
                  :before-upload="beforeAvatarUpload"-->

                  <el-upload
                    :show-file-list="false"
                    class="avatar-uploader"
                    action="/iotapi/upload"
                  >
                    <img
                      v-if="authenticationPreviewForm.businesslicense"
                      :src="
                        fileDomain + authenticationPreviewForm.businesslicense
                      "
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                    <div
                      class="el-upload__text"
                      style="
                        position: absolute;
                        top: 90px;
                        color: #8c939d;
                        left: 80px;
                      "
                    >
                      企业营业执照
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="街道地址" prop="roadress">
                  <el-input
                    v-model="authenticationPreviewForm.roadress"
                    placeholder="请填写企业街道地址"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-select
                    v-model="authenticationPreviewForm.region"
                    placeholder="请选择企业规模"
                    readonly
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

        <div style="text-align: center">
          <el-button
            type="primary"
            style="margin-top: 12px"
            @click="addEmpower"
          >
            提交审核
          </el-button>
          <el-button type="info" @click="goBack">返回上一步</el-button>
        </div>
      </div>
    </div>
    <!--实验室认证-->
    <div v-if="allactive == 2">
      <el-steps :active="laboratoryactive" simple>
        <el-step title="填写实验室信息" icon="el-icon-s-promotion" />
        <el-step title="预览提交审核" icon="el-icon-upload" />
      </el-steps>
      <div
        v-if="laboratoryactive == 1"
        class="block"
        style="padding: 30px; box-sizing: border-box"
      >
        <p
          style="
            border: 1px solid #cccccc;
            font-size: 20px;
            height: 40px;
            line-height: 40px;
            margin: 0;
            padding-left: 20px;
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
              <!-- 此组件会抛出resultes事件,把数据传递过来 -->
              <LaboratoryForm @resultes="getLaboratory" />
            </el-tab-pane>
          </el-tabs>
          <div style="text-align: center">
            <el-row>
              <el-button type="primary" @click="previewLaboratory">
                确定,预览
              </el-button>
              <el-button type="info">取消</el-button>
              <el-button type="info" @click="allactive = 1">上一步</el-button>
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
            <el-button type="primary" @click="next(3)">确定</el-button>
            <el-button type="info" @click="laboratoryactive = 1">
              返回上一步
            </el-button>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="allactive == 3">
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
        <p style="font-size: 25px; color: #409eff">正在审核中</p>
        <p style="font-size: 20px">审核员联系电话：17201202365</p>
        <p style="color: #cccccc; font-size: 14px">
          预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解
        </p>
        <p>
          <el-button type="primary" @click="cancelAdd">
            填写新的企业资质
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
                        color: #8c939d;
                        left: 50px;
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
        var rules = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/

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
          addr: [], // 设备地址
          roadress: '', // 街道地址
          businessduration: '', // 营业年限
          businessdesc: '', // 企业描述
          businessscope: '', // 经营范围
          registeredcapital: '', // 注册资金
        },
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
        ewpowerid: '',
        laboratorylist: [],
        imgtype: '',
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
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
        this.$http
          .post(Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              if (this.imgtype == 'front') {
                this.authenticationForm.frontimageUrl = res.body.src
              } else if (this.imgtype == 'contrary') {
                this.authenticationForm.contraryimageUrl = res.body.src
              } else if (this.imgtype == 'business') {
                this.authenticationForm.businesslicense = res.body.src
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
      next(id) {
        this.active = id
        this.allactive = id
        if (id == 2) {
          this.$refs.formrules.validate((valid) => {
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
              this.authenticationPreviewForm = this.authenticationForm
            } else {
              this.$message.error('有必填项未填写')
              return false
            }
          })
        } else {
          this.uploadFrom()
        }
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
        this.authenticationPreviewForm = this.authenticationForm
        this.$message.success('提交成功')
        this.allactive++
      },
      cancelAdd() {
        this.initData()
        this.allactive = 1
        this.active = 1
      },
      // 初始化数据
      initData() {
        this.authenticationForm = {
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
        this.authenticationPreviewForm = {
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
        }
      },
      getLaboratory(value) {
        this.laboratorylist.push(value)
        console.log(value, '子组件中的值')
      },
      previewLaboratory() {
        if (this.laboratorylist.length == 0) {
          this.$message.error('请至少提交一个实验室认证')
          return
        }
        this.laboratoryFormvalue = this.laboratorylist[0].laboratoryForm.name
        this.laboratoryactive = 2
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
        this.ruleForm.laboratorylist = this.laboratorylist
        const EnterpriseData = {
          authenticationForm: this.authenticationPreviewForm,
          ruleForm: this.ruleForm,
        }
        aclObj[aclKey] = { read: true, write: true }
        this.$axiosWen
          .post('classes/Dict', {
            ACL: aclObj,
            type: 'Enterprise-qualification',
            data: EnterpriseData,
            key: userName,
          })
          .then((res) => {
            console.log(res)
            if (res) {
              this.$message({
                type: 'success',
                message: '提交成功',
              })
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
    width: 100%;
    height: 100%;
    padding: 20px 60px;
    box-sizing: border-box;
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
    border: 1px solid #cccccc;
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
  .empower .el-tabs__header {
    margin-top: 20px;
  }
</style>
