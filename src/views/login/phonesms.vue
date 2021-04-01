<template>
  <div class="login-container">
    <div class="loginbanner">
      <el-form
        ref="ruleForm2"
        :model="ruleForm2"
        :rules="rules2"
        status-icon
        label-width="100px"
        class="login-form"
      >
        <div class="logo">
          <img :src="logosrc" alt="logo" style="width: 80px; height: 80px" />
          <p>{{ title }}</p>
        </div>

        <!-- <el-input v-model="ruleForm2.diqu" type="text"></el-input> -->
        <el-form-item style="border-radius: 0" prop="phone">
          <span class="svg-container">
            <el-select
              v-model="ruleForm2.value"
              placeholder="请选择手机区域"
              style="border: 0"
            >
              <el-option
                v-for="item in ruleForm2.diqu"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </span>
          <el-input
            ref="phonerole"
            v-model="ruleForm2.phone"
            :maxlength="11"
            name="phone"
            type="text"
            auto-complete="on"
            placeholder="请输入手机号"
            style="width: 250px"
          />
        </el-form-item>
        <div
          class="yzm"
          style="height: 50px; margin-bottom: 20px; margin-left: 20px"
        >
          <span class="svg-container" style="float: left; width: 25%">
            <el-input
              v-model="phonesms"
              type="text"
              disabled
              style="
                width: 100%;
                border: 1px solid #cccccc;
                border-right: 0px;
                border-radius: 5px;
                border-radius: 0;
              "
            />
          </span>
          <el-input
            v-model.number="code"
            type="text"
            placeholder="请输入验证码"
            class="yzm"
            style="
              float: left;
              width: 50%;
              border: 1px solid #cccccc;
              border-radius: 0;
            "
          />
          <el-button
            :disabled="sendMsgDisabled"
            style="
              float: right;
              width: 25%;
              height: 47px;
              padding: 12px 15px 12px 15px;
              border-radius: 0;
            "
            type="primary"
            @click="send"
          >
            <span v-if="sendMsgDisabled">{{ time + '秒后获取' }}</span>
            <span v-if="!sendMsgDisabled">发送验证码</span>
          </el-button>
        </div>
        <el-form-item style="margin-top: 50px">
          <el-button
            type="primary"
            style="width: 100%; letter-spacing: 10px"
            @click="submitForm('ruleForm2')"
          >
            确 定
          </el-button>
        </el-form-item>
        <div class="hasuser">
          <span
            style="font-size: 14px; color: #409eff; cursor: pointer"
            @click="login"
          >
            账号密码登陆
          </span>

          <span
            style="
              float: right;
              font-size: 14px;
              color: #777777;
              cursor: pointer;
            "
            @click="skip"
          >
            进入
          </span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  const Base64 = require('js-base64').Base64
  import { Phonelogin, Verify } from '@/api/User/index'
  import Cookies from 'js-cookie'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (!/^\w{6,10}$/.test(value)) {
            callback(new Error('密码格式不正确'))
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
        phonesms: '手机验证码',
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        code: '',
        actions: '',
        routes: [],
        logosrc: '',
        title: '',
        ruleForm2: {
          account: '',
          phone: '',
          username: '',
          password: '',
          email: '',
          checkPass: '',
          diqu: [],
          value: '+86/中国',
          time: 0,
        },
        origin: [
          '+86/中国',
          '+886/中国台湾',
          '+852/中国香港',
          '+91/India',
          '+244/Angola',
          '+54/Argentina',
          '+1/American Samoa',
          '+880/Bangladesh',
          '+56/Chile',
          '+855/Cambodia',
          '+20/Egypt',
          '+33/France',
          '+49/Germany',
          '+62/Indonesia',
          '+353/Ireland',
          '+972/Israel',
          '+39/Italy',
          '+81/Japan',
          '+60/Malaysia',
          '+63/Philippines',
          '+92/Pakistan',
          '+82/South Korea',
          '+46/Sweden',
          '+65/Singapore',
          '+27/South Africa',
          '+66/Thailand',
          '+971/United Arab Emirates',
          '+44/United Kingdom',
          '+1/United States',
          '+84/Vietnam',
          '+967/Yemen',
          '+260/Zambia',
        ],
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            {
              min: 1,
              max: 10,
              message: '长度在 1到 10 个字符',
              trigger: 'blur',
            },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              validator: function (rule, value, callback) {
                var MobileRegex = /^1[34578]\d{9}$/
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
            { validator: validatePass, trigger: 'blur', required: true },
          ],
          checkPass: [
            { validator: validatecheckPass, trigger: 'blur', required: true },
          ],
          username: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '姓名格式不正确', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ],
        },
        phonetoken: '',
      }
    },
    mounted() {
      var MobileRegex = /^1[34578]\d{9}$/
      if (
        this.$route.query.phone &&
        MobileRegex.test(Base64.decode(this.$route.query.phone))
      ) {
        this.ruleForm2.phone = Base64.decode(this.$route.query.phone)

        this.$refs['phonerole'].$refs.input.disabled = true
      } else {
      }
      this.ruleForm2.diqu = []
      this.actions = this.$route.query.action
      this.origin.map((items) => {
        this.ruleForm2.diqu.push({
          label: items,
          value: items.toString(),
        })
      })
      this.title = sessionStorage.getItem('product_title')
      this.logosrc = sessionStorage.getItem('imgsrc')
      this.phonetoken = Cookies.get('sessionToken')
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
        var MobileRegex = /^1[34578]\d{9}$/
        var _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid && MobileRegex.test(_this.ruleForm2.phone)) {
            Verify(_this.actions, _this.ruleForm2.phone, _this.code)
              .then((result) => {})
              .catch((error) => {
                _this.$message(error)
              })
          } else {
            _this.$message({
              message: '信息错误',
              type: 'error',
            })
            return false
          }
        })
      },
      send() {
        var MobileRegex = /^1[34578]\d{9}$/
        const _this = this
        if (MobileRegex.test(_this.ruleForm2.phone)) {
          _this.sendMsgDisabled = true
          Phonelogin(
            _this.ruleForm2.phone,
            encodeURIComponent(_this.ruleForm2.value)
          )
            .then((res) => {
              this.$message({
                message: '发送成功',
                type: 'success',
              })
              this.time = res.expire
            })
            .catch((error) => {
              this.$message(error)
            })
          const interval = window.setInterval(function () {
            if (_this.time-- <= 0) {
              _this.time = this.time * 60
              _this.sendMsgDisabled = false
              window.clearInterval(interval)
            }
          }, 1000)
        } else {
          this.$message({
            message: '请输入正确的手机号',
            type: 'warning',
          })
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss">
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

<style rel="stylesheet/scss" lang="scss" scoped>
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
      height: 500px;
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
      width: 150px;
      color: black;
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
  }
  .login-container .loginbanner .el-input input {
    color: black;
  }
  .login-container .svg-container[data-v-53cb85aa] {
    padding: 0px;
  }
</style>
