<template>
  <div class="login-container">
    <div class="loginbanner">
      <el-form
        ref="ruleForm2"
        class="login-form"
        label-width="100px"
        :model="ruleForm2"
        :rules="rules2"
        status-icon
      >
        <div class="logo">
          <img alt="logo" :src="logosrc" style="width: 80px; height: 80px" />
          <p>{{ title }}</p>
        </div>

        <el-form-item prop="phone">
          <span class="svg-container">
            <dgiot-icon icon="user" />
          </span>
          <el-input
            v-model="ruleForm2.phone"
            auto-complete="on"
            clearable
            :maxlength="11"
            name="phone"
            placeholder="请输入手机号"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="password" required>
          <span class="svg-container">
            <dgiot-icon icon="password" />
          </span>
          <el-input
            v-model="ruleForm2.password"
            auto-complete="on"
            name="password"
            placeholder="请输入密码"
            :type="pwdType"
          />
          <span class="show-pwd" @click="showPwd">
            <dgiot-icon icon="eye" />
          </span>
        </el-form-item>

        <el-form-item prop="checkPass" required>
          <span class="svg-container">
            <dgiot-icon icon="password" />
          </span>
          <el-input
            v-model="ruleForm2.checkPass"
            auto-complete="on"
            placeholder="请再次输入密码"
            :type="pwdType"
          />
          <span class="show-pwd" @click="showPwd">
            <dgiot-icon icon="eye" />
          </span>
        </el-form-item>
        <el-form-item style="margin-top: 50px">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
            element-loading-spinner="el-icon-loading"
            element-loading-text="正在初始化环境,请稍后"
            style="width: 100%; letter-spacing: 10px"
            type="primary"
            @click="submitForm('ruleForm2')"
          >
            立即注册
          </el-button>
        </el-form-item>
        <div class="hasuser">
          <span
            style="font-size: 14px; color: #409eff; cursor: pointer"
            @click="login"
          >
            已有账号登陆
          </span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Cookies from 'js-cookie'

  const Base64 = require('js-base64').Base64
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/^\w{8,20}/.test(value)) {
            callback(new Error('密码长度为8-20位'))
          }
          callback()
        }
      }
      var validatecheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        fullscreenLoading: false,
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        logosrc: '',
        title: '',
        ruleForm2: {
          account: '',
          phone: '',
          username: '',
          password: '',
          email: '',
          checkPass: '',
          roles: '',
        },
        pwdType: 'password',
        protype: '',
        rules2: {
          account: [
            {
              required: true,
              message: '请输入账号',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 10,
              message: '长度在 1到 10 个字符',
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: true,
              message: '请输入手机号',
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
          password: [
            {
              validator: validatePass,
              trigger: 'blur',
              required: true,
            },
          ],
          checkPass: [
            {
              validator: validatecheckPass,
              trigger: 'blur',
              required: true,
            },
          ],
          username: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur',
            },
            {
              min: 2,
              max: 5,
              message: '姓名格式不正确',
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ],
          roles: [
            {
              required: true,
              message: '请选择平台',
              trigger: 'change',
            },
          ],
        },
      }
    },
    mounted() {
      this.protype = sessionStorage.getItem('roletype')
      this.title = sessionStorage.getItem('product_title')
      this.logosrc = sessionStorage.getItem('imgsrc')
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      login() {
        this.$router.push({
          path: '/login',
        })
      },
      submitForm(formName) {
        var MobileRegex = /^1[3-9]\d{9}$/
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var user = new Parse.User()
            user.set('username', this.ruleForm2.phone.toString())
            user.set('password', this.ruleForm2.password)
            if (MobileRegex.test(this.ruleForm2.phone)) {
              user.set('phone', this.ruleForm2.phone.toString())
            } else {
              user.set('phone', '')
            }
            this.fullscreenLoading = true
            user.set('productId', this.protype)
            const acl = new Parse.ACL()
            user
              .save()
              .then((resultes) => {
                dgiotlog.log(resultes.attributes.sessionToken)
                Cookies.set('sessionToken', resultes.attributes.sessionToken)
                this.$router.push({
                  path: '/phonelogin',
                  query: {
                    phone: Base64.encode(this.ruleForm2.phone),
                    action: 'register',
                  },
                })
                this.fullscreenLoading = false
              })
              .catch((error) => {
                if (error.code == 202) {
                  this.$message({
                    message: '用户名已存在',
                    type: 'error',
                  })
                } else {
                  this.$message({
                    message: error.message,
                    type: 'error',
                  })
                }
                this.fullscreenLoading = false
              })
          } else {
            this.$message({
              message: '信息错误',
              type: 'error',
            })
            return false
          }
        })
      },
      send() {
        const _this = this
        _this.sendMsgDisabled = true
        const interval = window.setInterval(function () {
          if (_this.time-- <= 0) {
            _this.time = 60
            _this.sendMsgDisabled = false
            window.clearInterval(interval)
          }
        }, 1000)
      },
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  $light_gray: rgba(0, 0, 0, 0.247058823529412);
  /* reset element-ui css */
  .login-container {
    height: 100%;
    background-size: cover;

    .loginbanner {
      box-sizing: border-box;
      padding: 16px;
      background: transparent;

      .hasuser {
        text-align: center;
      }

      .el-input {
        display: inline-block;
        width: 85%;
        height: 47px;

        input {
          height: 47px;
          padding: 12px 5px 12px 15px;
          color: $light_gray;
          background: transparent;
          border: 1px;
          border-radius: 0px;
          -webkit-appearance: none;

          &:-webkit-autofill {
            // -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: black !important;
          }
        }
      }

      .el-form-item {
        color: #454545;
        background: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
      }

      .logo {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;

        p {
          margin: 25px 0;
          font-size: 30px;
          font-weight: bold;
        }
      }
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $bg: rgba(45, 58, 75, 0.8);
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: $bg;

    .login-form {
      position: absolute;
      right: 5%;
      width: 520px;
      max-width: 100%;
      height: 550px;
      padding: 35px 35px 15px 35px;
      margin: 120px;
      background: #ffffff;
      border-radius: 5px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
        0px 1px 1px 0px rgba(0, 0, 0, 0.14),
        0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    }

    .login_bottom {
      position: absolute;
      right: 0;
      bottom: 20px;
      left: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 0 auto;
      font-size: 14px;
      color: #ffffff;
      text-align: center;

      img {
        width: 16px;
        height: 16px;
        margin: 0 2px;
        vertical-align: middle;
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: 14px;
      color: #fff;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      display: inline-block;
      width: 30px;
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
    }

    .title {
      margin: 0px auto 40px auto;
      font-size: 26px;
      font-weight: 400;
      font-weight: bold;
      color: $light_gray;
      text-align: center;
    }

    .show-pwd {
      position: absolute;
      top: 7px;
      right: 10px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
<style>
  .login-container .el-form-item__content {
    margin-left: 20px !important;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  .login-container .loginbanner .el-input input {
    color: black;
  }
</style>
