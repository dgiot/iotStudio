<template>
  <!--  <div ref="container" v-loading="jwLoginFlag" class="login-container">-->
  <!--  <div-->
  <!--    v-loading="jwLoginFlag"-->
  <!--    element-loading-background="rgba(255,255,255, 0)"-->
  <!--    element-loading-spinner="el-icon-loading"-->
  <!--    element-loading-text="加载中"-->
  <!--    style="height: 100%; overflow: auto"-->
  <!--  ></div>-->
  <div id="loader-wrapper" style="">
    <!--    <div id="loader"></div>-->
    <div class="loader-section section-left"></div>
    <div class="loader-section section-right"></div>
    <div class="load_title" style="font-size: 16px !important">
      <img
        src="/assets/images/loading.gif"
        style="width: 120px; height: 120px"
      />
    </div>
  </div>
  <!--  </div>-->
</template>

<script>
  /**
   * @Author: dext7r
   * @Date: 2021-12-29 16:20:29
   * @LastEditors:
   * @param
   * @return {Promise<void>}
   * @Description:
   */
  import backgroundImage from '../../../../../public/assets/images/platform/assets/login_images/background.jpg'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { isPassword } from '@/utils/data/validate'
  import { SiteDefault } from '@/api/License'
  export default {
    name: 'JwtLogin',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      clearInterval(this.interval)
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
        interval: null,
        isShow: false,
        locationPath: location.href.split('/#')[0],
        info: {
          empty: this.$translateTitle('home.Username can not be empty'),
          than: this.$translateTitle('home.Password cannot be less than'),
          Bit: this.$translateTitle('home.Bit'),
        },
        backgroundImage: backgroundImage,
        nodeEnv: process.env.NODE_ENV,
        form: {
          username: 'dgiot_admin',
          password: 'dgiot_admin',
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
        objectId: 'user/objectId',
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
    beforeDestroy() {
      window.removeEventListener('message', this.iframeLogin)
    },
    async mounted() {
      await this.initShuwa()
      this.$nextTick(async () => {
        await this.defaultSet()
        await this.init()
      })
    },
    created() {
      this.goHome()
      if (this.$route.query.id_token) {
        this.jwtlogin(this.$route.query.id_token)
      }
      window.addEventListener('message', this.iframeLogin)
    },
    methods: {
      ...mapMutations({
        setTitle: 'settings/setTitle',
        setCopyright: 'acl/setCopyright',
        setDefault: 'acl/setDefault',
      }),
      /**
       * @Author: dext7r
       * @Date: 2021-12-28 20:30:01
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async iframeLogin(e) {
        // const vm = this
        try {
          const startIframe = {
            value: moment().format('YYYY:MM:DD  HH:mm:ss'),
            key: 'startIframe',
            action: 'save',
            type: 'cookie',
            time: moment().format('YYYY:MM:DD  HH:mm:ss'),
          }
          e.source.postMessage(startIframe, e.origin)
          const message = {
            value: moment().format('YYYY:MM:DD  HH:mm:ss'),
            key: 'pwaLogin',
            action: 'save',
            type: 'cookie',
            time: moment().format('YYYY:MM:DD  HH:mm:ss'),
          }
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dext7r
       * @Date: 2021-12-28 19:39:28
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async routeDgiot() {
        try {
          await setTimeout(() => {
            if (this.objectId) {
              // console.log('userid', this.objectId)
              // document.querySelector('.el-tree-node__content').click()
            }
          }, 1200)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dext7r
       * @Date: 2021-12-27 19:53:22
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async init() {
        try {
          Cookies.remove('startIframe')
          Cookies.remove('pwaLogin')
          // Cookies.remove('fileServer')
          this.$nextTick(async () => {
            if (window.name == 'dgiot_iframe') {
              Cookies.set(
                'startIframe',
                moment().format('YYYY:MM:DD HH:mm:ss'),
                {
                  expires: 60 * 1000 * 30,
                }
              )
              // await this.login({ username: 'feiiplat', password: 'feiiplat' })
            }
          })
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: h7ml
       * @Date: 2021-12-14 12:46:36
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async defaultSet() {
        console.log(`dgiot build time: ${dgiot.dateTime}`)
        console.log(`startIframe time: ${Cookies.get('startIframe')}`)
        this.backgroundImage = Cookies.get('startIframe')
          ? 'https://s2.loli.net/2021/12/15/ciVTb7w62rxQ3a9.jpg'
          : // 'https://s2.loli.net/2021/12/15/aJYcUGVixXhTML3.png'
            // 'https://s2.loli.net/2021/12/15/eapG6iDP1tOSVFl.jpg'
            this.backgroundimage
        const url =
          process.env.NODE_ENV === 'development'
            ? process.env.VUE_APP_URL
            : location.origin
        Cookies.set('fileServer', url, { expires: 60 * 1000 * 30 })
      },
      changeInfo(e) {
        this.$set(
          this.info,
          'empty',
          this.$translateTitle('home.Username can not be empty')
        )
        this.$set(
          this.info,
          'than',
          this.$translateTitle('home.Password cannot be less than')
        )
        this.$set(this.info, 'Bit', this.$translateTitle('home.Bit'))
        this.$forceUpdate()
      },
      forgotPwd() {
        this.$message(this.$translateTitle('home.Forgot password'))
      },
      ...mapActions({
        login: 'user/login',
        queryAll: 'user/queryAll',
        jwtlogin: 'user/jwtlogin',
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
        // if (window.name !== 'dgiot_iframe') Cookies.remove('id_token')
        // await this.getlicense()
        const Default = await SiteDefault()
        const { copyright, logo, objectId, title } = Default
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
            } finally {
              this.loading = false
            }
          } else {
            return false
          }
        })
      },
      /**
       * @Author: h7ml
       * @Date: 2021-12-14 11:46:23
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async goHome() {
        try {
          this.interval = setInterval(async () => {
            if (Cookies.get('handleRoute') != '') {
              await this.$router.push(this.handleRoute())
              await this.routeDgiot()
              clearInterval(this.interval)
              window.clearInterval(this.interval)
            }
          }, 1500)
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
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
