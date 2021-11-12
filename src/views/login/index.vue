<template>
  <div
    ref="container"
    :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
    class="login-container"
  >
    <el-row>
      <el-col
        :lg="14"
        :md="11"
        :sm="24"
        :xl="14"
        :xs="24"
      >
        <div style="color: transparent">
          占位符
        </div>
      </el-col>
      <el-col
        :lg="9"
        :md="12"
        :sm="24"
        :xl="9"
        :xs="24"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          label-position="left"
        >
          <div
            v-if="Default.title"
            class="title-tips"
          >
            {{ $translateTitle('home.login') }}
          </div>
          <el-form-item
            prop="username"
            style="margin-top: 40px"
          >
            <el-input
              v-focus
              v-model.trim="form.username"
              :placeholder="$translateTitle('home.Please enter user name')"
              tabindex="1"
              type="text"
            >
              <template #prefix>
                <vab-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="$translateTitle('home.Please enter the password')"
              :type="passwordType"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            >
              <!--              <el-link-->
              <!--                v-if="!form.password.length"-->
              <!--                slot="append"-->
              <!--                type="primary"-->
              <!--                @click="forgotPwd()"-->
              <!--              >-->
              <!--                {{ $translateTitle('home.Forgot password') }}-->
              <!--              </el-link>-->
              <template #prefix>
                <vab-icon
                  v-if="form.password.length"
                  icon="lock-line"
                />
              </template>

              <template
                v-if="passwordType === 'password' && form.password.length"
                #suffix
              >
                <vab-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click.native="handlePassword"
                />
              </template>
              <template
                v-else
                #suffix
              >
                <vab-icon
                  v-if="form.password.length"
                  class="show-password"
                  icon="eye-line"
                  @click.native="handlePassword"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="sbMc">
              <el-button
                slot="append"
                :loading="loading"
                class="login-btn"
                type="primary"
                @click.native="handleLogin"
              >
                {{ $translateTitle('home.login') }}
              </el-button>
            </el-input>
          </el-form-item>

          <span>
            <router-link
              v-show="false"
              style="float: left"
              to="/register"
            >
              <div style="margin-top: 20px">
                {{ $translateTitle('home.registered') }}
              </div>
            </router-link>
            <vab-language
              style="float: right; margin-top: 20px; cursor: pointer"
            />
          </span>
        </el-form>
      </el-col>
      <!--      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">-->
      <!--        <div style="color: transparent">占位符</div>-->
      <!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>
  import backgroundImage from '../../../public/assets/images/platform/assets/login_images/background.jpg'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { isPassword } from '@/utils/validate'
  import { SiteDefault } from '@/api/License'

  export default {
    name: 'Login',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input')
            .focus()
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if ('' === value) {
          callback(new Error(this.info.empty))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        let pwdlength = 4
        if (!isPassword(value, pwdlength)) {
          callback(new Error(this.info.than + pwdlength + this.info.Bit))
        } else {
          callback()
        }
      }
      return {
        locationPath: location.href.split('/#')[0],
        info: {
          empty: this.$translateTitle('home.Username can not be empty'),
          than: this.$translateTitle('home.Password cannot be less than'),
          Bit: this.$translateTitle('home.Bit'),
        },
        backgroundImage: backgroundImage,
        nodeEnv: process.env.NODE_ENV,
        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
      }
    },
    computed: {
      ...mapGetters({
        language: 'settings/language',
        Default: 'acl/Default',
        license: 'acl/license',
        logo: 'user/logo',
        backgroundimage: 'user/backgroundimage',
      }),
    },
    watch: {
      language: {
        handler(e) {
          this.changeInfo(e)
          this.$nextTick(() => {
            this.$refs.form.resetFields()
          })
        },
        deep: true,
        immediate: true,
      },
      'Default.background': {
        handler(e) {
          console.log(e)
          this.backgroundImage = e
        },
        immediate: true,
      },

      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    mounted() {
      this.initShuwa()
    },
    methods: {
      ...mapMutations({
        setTitle: 'settings/setTitle',
        setCopyright: 'acl/setCopyright',
        setDefault: 'acl/setDefault',
      }),
      changeInfo(e) {
        this.$set(
          this.info,
          'empty',
          this.$translateTitle('home.Username can not be empty'),
        )
        this.$set(
          this.info,
          'than',
          this.$translateTitle('home.Password cannot be less than'),
        )
        this.$set(this.info, 'Bit', this.$translateTitle('home.Bit'))
        this.$forceUpdate()
        console.log(this.info)
      },
      forgotPwd() {
        this.$message(this.$translateTitle('home.Forgot password'))
      },
      ...mapActions({
        login: 'user/login',
        queryAll: 'user/queryAll',
        // getlicense: 'user/getlicense',
        // getDefault: 'user/getDefault',
      }),
      getCategory(key) {
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
      },
      async initShuwa() {
        console.log(process.env.cdnUrl, 'process.env')
        console.log(`VUE_APP_URL is ${process.env.VUE_APP_URL}`)
        console.log(`NODE_ENV is ${process.env.NODE_ENV}`)
        if (this.backgroundimage) {
          this.backgroundImage = this.backgroundimage
        }
        // await this.getlicense()
        const Default = await SiteDefault()
        const {
          copyright,
          logo,
          objectId,
          title,
        } = Default
        this.setDefault(Default)
        this.setTitle(title)
        this.setCopyright(copyright)
      },
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleRoute() {
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
      handleLogin() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              this.loading = true
              await this.login(this.form)
              await this.$router.push(this.handleRoute())
              // 批量查询写在登录后面,优化登录速度
              await this.queryAll()
            } finally {
              this.loading = false
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    // background: url('') center center fixed no-repeat;
    background-size: cover;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 4.5vh;
    margin: calc((100vh - 475px) / 2) 5vw 5vw;
    overflow: hidden;
    background: #fff;
    //background: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/login_images/login_form.png');
    background-size: 100% 100%;
    border: 8px solid #3cb2fb;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: $base-color-white;
    }

    .title-tips {
      margin: 0 auto;
      font-size: 26px;
      font-weight: 400;
      color: #096dd9;
      text-align: center;
    }

    .sbMc {
      ::v-deep {
        .el-input__inner {
          display: none;
        }

        .el-input-group__append {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
        }
      }
    }

    .login-btn {
      display: inherit;
      width: 100%;
      height: 50px;
      margin: 0 auto;
      margin-top: 5px;
      text-align: center;
      border: 0;

      &:hover {
        opacity: 0.9;
      }

      .forget-passwordword {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-password {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    i {
      position: absolute;
      top: 8px;
      left: 5px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      right: 25px;
      left: -35px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          padding-left: 35px;
          font-size: $base-font-size-default;
          line-height: 58px;
          background: #f6f4fc;
          border: 1px solid #3cb2fb;
        }
      }
    }
  }
</style>
