<template>
  <div class="userinfo">
    <div class="dialog">
      <el-dialog width="100vh" height="500vh" :visible.sync="dialogVisible">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="no"
          :http-request="handleUpload"
          :limit="1"
        >
          <el-button size="small" type="success" class="el-icon-upload">
            点击上传图片
          </el-button>
        </el-upload>
      </el-dialog>
    </div>
    <div class="personal-center-container">
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xl="8" :xs="24">
          <el-card shadow="hover">
            <div class="personal-center-user-info">
              <el-avatar
                :size="100"
                :src="avatar"
                @click.native="uploadCkick('avatar')"
              />
              <ul class="personal-center-user-info-list">
                <li>
                  <vab-icon icon="user-2-line" />
                  {{ username }}
                </li>
                <li>
                  <vab-icon icon="user-3-line" />
                  {{ nick }}
                </li>
                <li>
                  <vab-icon icon="women-line" />
                  {{ userinfo.sex }}
                </li>
                <li>
                  <vab-icon icon="phone-line" />
                  {{ userinfo.phone }}
                </li>
                <li>
                  <vab-icon icon="file-text-line" />
                  {{ userinfo.description }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xl="16" :xs="24">
          <el-card shadow="hover">
            <el-tabs v-model="activeName">
              <el-tab-pane label="个人信息" name="first">
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form
                    ref="userinfo"
                    :rules="registerRules"
                    label-width="80px"
                    :model="userinfo"
                  >
                    <el-form-item label="姓名">
                      <el-input v-model="username" />
                    </el-form-item>
                    <el-form-item label="昵称">
                      <el-input v-model="nick" />
                    </el-form-item>
                    <!-- <el-form-item label="objectId">
                      <el-input v-model="userinfo.objectId" disabled />
                    </el-form-item> -->
                    <el-form-item label="性别">
                      <el-select v-model="userinfo.sex" style="width: 100%">
                        <el-option label="保密" value="保密" />
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="绑定手机" prop="phone">
                      <el-input v-model="userinfo.phone" />
                    </el-form-item>
                    <el-form-item label="个人简介">
                      <el-input
                        v-model="userinfo.description"
                        type="textarea"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">
                        保存
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="平台设置" name="second">
                <div class="personal-center-item">
                  <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                    <el-form
                      ref="companyinfo"
                      label-width="120px"
                      :model="companyinfo"
                    >
                      <el-form-item label="企业名称">
                        <el-input v-model="companyinfo.name">
                          <template slot="prepend">
                            <vab-icon
                              icon="community-fill"
                              style="color: #3492ed"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="企业logo">
                        <el-input v-model="companyinfo.logo">
                          <template slot="prepend">
                            <vab-icon
                              icon="remixicon-fill"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="uploadCkick('logo')"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="登录提示欢迎语">
                        <el-input v-model="companyinfo.title">
                          <template slot="prepend">
                            <vab-icon icon="text" style="color: #3492ed" />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="企业版权信息">
                        <el-input v-model="companyinfo.Copyright">
                          <template slot="prepend">
                            <vab-icon
                              icon="copyright-fill"
                              style="color: #3492ed"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="首页背景图">
                        <el-input v-model="companyinfo.backgroundimage">
                          <template slot="prepend">
                            <vab-icon
                              icon="bank-card-line"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="uploadCkick('backgroundimage')"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="onSubmit">
                          保存
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  var editor
  import { mapGetters, mapMutations } from 'vuex'
  import { isPhone, isUrl } from '@/utils/validate'
  import { UploadImg } from '@/api/File'
  import { putUser } from '@/api/User'
  export default {
    name: 'Userinfo',
    data() {
      const validatePhone = (rule, value, callback) => {
        if (value && !isPhone(value)) {
          callback(new Error(this.$translateTitle('请输入正确的手机号')))
        } else {
          callback()
        }
      }
      return {
        registerRules: {
          phone: [
            {
              required: false,
              trigger: 'blur',
              message: this.$translateTitle('请输入手机号'),
            },
            { validator: validatePhone, trigger: 'blur' },
          ],
        },
        filetype: '',
        objectId: '',
        dialogVisible: false,
        activeName: 'first',
        userinfo: {
          sex: '女',
          description: '',
        },
        username: '',
        nick: '',
        phone: '',
        companyinfo: {
          name: '',
          logo: '',
          title: '',
          Copyright: '',
          backgroundimage: '',
        },
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        token: 'user/token',
      }),
    },
    mounted() {
      this.queryUserInfo()
    },
    methods: {
      ...mapMutations({
        setAvatar: 'user/setAvatar',
        setlogo: 'user/setlogo',
        setBackgroundimage: 'user/setBackgroundimage',
        setname: 'user/setname',
        setcopyright: 'user/setCopyright',
      }),
      //上传操作调用的函数
      async handleUpload(file) {
        var formData = new FormData()
        formData.append('file', file.file)
        formData.append('output', 'json')
        formData.append(
          'filename',
          Mock.mock('@string') + this.objectId + this.filetype + '.jpg'
        )
        formData.append('path', 'group1')
        formData.append('auth_token', this.token) // 下面是
        const { url } = await UploadImg(formData)
        console.log(url)
        if (url) {
          this.dialogVisible = !this.dialogVisible
          switch (this.filetype) {
            case 'avatar':
              this.userinfo.avatar = url
              this.setAvatar(this.userinfo.avatar)
              break
            case 'logo':
              this.companyinfo.logo = url
              this.setlogo(this.companyinfo.logo)
              break
            case 'backgroundimage':
              this.companyinfo.backgroundimage = url
              this.setBackgroundimage(this.companyinfo.backgroundimage)
              break
            default:
              console.log('type', this.filetype)
              break
          }
          this.$nextTick(() => {
            this.$refs.upload.clearFiles()
          })
        }
      },
      async onSubmit() {
        this.setlogo(this.companyinfo.logo)
        this.setBackgroundimage(this.companyinfo.backgroundimage)
        this.setAvatar(this.userinfo.avatar)
        this.setname(this.companyinfo.name)
        this.setcopyright(this.companyinfo.Copyright)
        if (this.userinfo.phone.length != 0 && !isPhone(this.userinfo.phone)) {
          this.$refs['userinfo'].validateField('phone')
          return
        }
        if (
          this.companyinfo.logo.length != 0 &&
          !isUrl(this.companyinfo.logo)
        ) {
          this.$baseMessage(
            this.$translateTitle('logo链接地址非url类型'),
            'error',
            false,
            'vab-hey-message-error'
          )
          return
        }
        if (
          this.companyinfo.backgroundimage.length != 0 &&
          !isUrl(this.companyinfo.backgroundimage)
        ) {
          this.$baseMessage(
            this.$translateTitle('背景图链接地址非url类型'),
            'error',
            false,
            'vab-hey-message-error'
          )
          return
        }

        let pamams = {
          tag: { companyinfo: this.companyinfo, userinfo: this.userinfo },
          nick: this.nick,
          username: this.username,
          phone: this.userinfo.phone,
        }
        const res = await putUser(this.objectId, pamams)
        if (res)
          this.$baseMessage(
            this.$translateTitle('保存成功'),
            'success',
            false,
            'vab-hey-message-success'
          )
      },
      uploadCkick(type) {
        this.filetype = type
        this.dialogVisible = !this.dialogVisible
        // console.log(this.$refs['uploadBox'].$refs.upload.$refs['upload-inner'])
        // this.$refs['uploadBox'].$refs.upload.$refs[
        //   'upload-inner'
        // ].$refs.input.click()
      },

      async queryUserInfo() {
        const {
          username,
          nick,
          phone,
          objectId,
          tag = {
            companyinfo: {
              backgroundimage:
                'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/login_images/background.jpg',
              name: 'dg_iot',
              logo: 'http://www.iotn2n.com/favicon.ico?1558342112',
              title: '欢迎登录dgiot平台',
              Copyright:
                '© 2017-2021 数蛙科技 Corporation, All Rights Reserved',
            },
            userinfo: {},
          },
        } = await this.$get_object('_User', this.$route.params.userid)
        this.userinfo = tag.userinfo
        this.objectId = objectId
        this.username = username
        this.nick = nick
        this.phone = phone
        this.userinfo.phone = this.phone
        this.companyinfo = tag.companyinfo
        console.log('this.companyinfo', tag.companyinfo)
      },
    },
  }
</script>
<style lang="scss" scoped>
  $base: '.personal-center';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
    i {
      cursor: pointer;
    }
    #{$base}-user-info {
      padding: $base-padding;
      text-align: center;

      ::v-deep {
        .el-avatar {
          img {
            cursor: pointer;
          }
        }
      }

      &-full-name {
        margin-top: 15px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
      }

      &-description {
        margin-top: 8px;
      }

      &-follow {
        margin-top: 15px;
      }

      &-list {
        margin-top: 18px;
        line-height: 30px;
        text-align: left;
        list-style: none;

        h5 {
          margin: -20px 0 5px 0;
        }

        ::v-deep {
          .el-tag {
            margin-right: 10px !important;
          }

          .el-tag + .el-tag {
            margin-left: 0;
          }
        }
      }
    }

    #{$base}-item {
      display: flex;

      &-content {
        box-sizing: border-box;
        flex: 1;
        margin-left: $base-margin;

        &-second {
          margin-top: 8px;
        }
      }
    }
  }
  .userinfo {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
  }
</style>
