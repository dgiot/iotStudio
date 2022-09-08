<template>
  <div
    ref="container"
    class="login-container"
    :style="{
      backgroundImage: 'url(' + backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }"
  >
    <div v-show="bgShow" class="bg">
      <!-- 原文链接：https://blog.csdn.net/chengqige/article/details/122643867 -->
      <!-- https://res-mp.usr.cn/video/experience-video.mp4  http://www.dgiotcloud.cn/wp-content/uploads/2022090709555048.mp4-->
      <video
        autoplay
        class="bg_video"
        loop
        muted="muted"
        playsinline
        preload="auto"
        src="http://www.dgiotcloud.cn/wp-content/uploads/2022090710055845.mp4"
        tabindex="-1"
      ></video>
      <div class="bg_wrap">
        <div class="bg_top">
          <div class="btn_back" @click="handleIn">
            <div class="btn_back_in">官网</div>
          </div>
        </div>
        <div class="bg_content">
          <div v-infinite-scroll class="bg_content_left">
            <div
              v-for="(item, index) in typeList"
              :key="index"
              class="bg_content_left_item"
              :class="
                index == currentIndex
                  ? 'experience-left-hover'
                  : 'experience-left'
              "
              @click="handleChoose(item, index)"
            >
              <div>{{ item.name }}</div>
            </div>
          </div>
          <div v-infinite-scroll class="bg_content_right">
            <div
              v-for="(o, i) in progList"
              :key="i"
              class="bg_content_right_item"
              @click="handleChooseProgram(o)"
            >
              <img class="bg_content_right_item_img" :src="o.img" />
              <div class="bg_content_right_item_name">{{ o.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-row v-if="isShow">
      <div class="btn_back" @click="bgShow = true">返回</div>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="form"
          class="login-form"
          label-position="left"
          :model="form"
          :rules="rules"
        >
          <div v-if="Default.title" class="title-tips">
            {{ $translateTitle('home.login') }}
          </div>
          <el-form-item prop="username" style="margin-top: 40px">
            <el-input
              v-model.trim="form.username"
              v-focus
              :placeholder="$translateTitle('home.Please enter user name')"
              tabindex="1"
              type="text"
            >
              <template #prefix>
                <dgiot-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="$translateTitle('home.Please enter the password')"
              tabindex="2"
              :type="passwordType"
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
                <dgiot-icon v-if="form.password.length" icon="lock-line" />
              </template>

              <template
                v-if="passwordType === 'password' && form.password.length"
                #suffix
              >
                <dgiot-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click.native="handlePassword"
                />
              </template>
              <template v-else #suffix>
                <dgiot-icon
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
                class="login-btn"
                :loading="loading"
                type="primary"
                @click.native="handleLogin"
              >
                {{ $translateTitle('home.login') }}
              </el-button>
            </el-input>
          </el-form-item>

          <span>
            <router-link v-show="false" style="float: left" to="/register">
              <div style="margin-top: 20px">
                {{ $translateTitle('home.registered') }}
              </div>
            </router-link>
            <dgiot-language
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
  import { Roletree } from '@/api/Menu'

  export default {
    name: 'Login',
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
        bgShow: true,
        typeList: [
          {
            id: 0,
            name: '全部',
          },
          {
            id: 1,
            name: '设备运维',
          },
          {
            id: 2,
            name: '智慧园区',
          },
          {
            id: 3,
            name: '智慧工厂',
          },
          {
            id: 4,
            name: '智慧能源',
          },
          {
            id: 5,
            name: '智慧物流',
          },
          {
            id: 6,
            name: '边缘主机',
          },
          {
            id: 7,
            name: '云检测',
          },
          {
            id: 8,
            name: '云压测',
          },
        ],
        programList: [
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080511362579.jpg',
            name: '工业设备租赁一体化运维平台',
            type: 1,
            username: 'dgiot_admin',
            password: 'dgiot_admin',
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080512380157.png',
            name: '智慧园区/智慧场馆数字驾驶舱',
            type: 2,
            username: 'dgiot_dev',
            password: 'dgiot_dev',
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/202208221014537.png',
            name: '智慧监控-海康',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082210305987.png',
            name: '弱电动环-浦洛斯',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082210005721.png',
            name: '高配动环',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082210453148.png',
            name: '能耗电表-正泰',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082210453148.png',
            name: '能耗采集器-正泰',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082209463162.png',
            name: '智慧广播-sonbs',
            type: 2,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082608530468.jpg',
            name: '数字工厂MES系统',
            type: 3,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080910110444.png',
            name: '水泵远程检测平台',
            type: 3,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080910554595.png',
            name: '多型太阳能板远程管控和多屏运维系统',
            type: 4,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080511492543.png',
            name: '千万级Zetag物流标签压测',
            type: 5,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022082512160365.png',
            name: '边缘主机',
            type: 6,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080910155274.png',
            name: '水泵远程质量检测与质量对比系统',
            type: 7,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/202208051146353.png',
            name: 'dgiot云压测',
            type: 8,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080511413072.png',
            name: '三千万电表集抄压测',
            type: 8,
          },
          {
            img: 'https://www.dgiotcloud.cn/wp-content/uploads/2022080511492543.png',
            name: '千万级Zetag物流标签压测',
            type: 8,
          },
        ], //方案列表
        progList: [], //选中方案列表
        currentIndex: 0,
        interval: null,
        isShow: window.name == 'dgiot_iframe' ? false : true,
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
        objectId: 'user/objectId',
        backgroundimage: 'user/backgroundimage',
        currentDepartment: 'user/currentDepartment',
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
      this.progList = this.programList
      this.$removeToken()
      this.isShow = window.name == 'dgiot_iframe' ? false : true
      window.addEventListener('message', this.iframeLogin)
    },
    methods: {
      ...mapMutations({
        setTitle: 'settings/setTitle',
        setCopyright: 'acl/setCopyright',
        setDefault: 'acl/setDefault',
        setRoleTree: 'user/setRoleTree',
      }),
      handleIn() {
        window.open('https://www.dgiotcloud.cn/')
      },
      handleChooseProgram(o) {
        this.bgShow = false
        this.form = {
          username: o.username || '',
          password: o.password || '',
        }
      },
      handleChoose(item, index) {
        this.currentIndex = index
        let list = []
        if (item.id == 0) {
          this.progList = this.programList
        } else {
          this.programList.forEach((o) => {
            if (o.type == item.id) {
              list.push(o)
            }
          })
          this.progList = list
        }
      },
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
          // if (e.data.id_token) {
          //   if (_.isEmpty(Cookies.get('handleRoute'))) {
          //     this.jwtlogin(e.data.id_token)
          //     this.goHome()
          //   }
          //   console.log(
          //     `receive time: ${moment().format('YYYY:MM:DD HH:mm:ss')}`
          //   )
          //   console.groupCollapsed(
          //     '%c iframe message',
          //     'color:#009a61; font-size: 28px; font-weight: 300'
          //   )
          //   console.info('从' + e.origin + '收到消息： \n')
          //   console.log(e.data)
          //   e.source.postMessage(message, e.origin)
          //   console.groupEnd()
          //   Cookies.set('id_token', e.data.id_token, {
          //     expires: 60 * 1000 * 30,
          //   })
          //   console.info(
          //     `检测到页面存在 jwt token \n`,
          //     e.data.id_token,
          //     '\n采用jwt token 登录'
          //   )
          //   console.groupEnd()
          //   Cookies.set('handleRoute', 'true', { expires: 60 * 1000 * 30 })
          // }
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
              await this.login({ username: 'feiiplat', password: 'feiiplat' })
              await this.goHome()
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
        // getDefault: 'user/getDefault'
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
              await this.goHome()
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
              console.log('handleRoute 存在，跳转页面')
              const { results: Tree = [] } = await Roletree()
              this.setRoleTree(Tree)
              await this.$router.push(this.handleRoute())
              clearInterval(this.interval)
              window.clearInterval(this.interval)
            }
          }, 800)
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
    position: relative;
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
  .btn_back {
    width: 150px;
    height: 48px;
    position: absolute;
    right: 20px;
    padding: 4px;
    top: 48px;
    background: url('/assets/bg/experience-back.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    font-size: 20px;
    line-height: 48px;
    color: #caf2ff;
    font-weight: 600;
    cursor: pointer;
    box-sizing: border-box;
    // margin-top: 48px;
    // margin-left: 20px;
  }
  .btn_back_in {
    height: 40px;
    line-height: 40px;
    // margin: 4px;
    // border: 1px solid #ff0000;
  }
  // .btn_back_in:hover {
  //   background: linear-gradient(#2298b6 10%, #001531 21%, #001531 100%);
  //   // border-top: 2px solid #68d6fe;
  //   // box-shadow: 0 0 2px 2px #68d6fe;
  // }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // padding: 16px 16px 0 16px;
    background-image: url('/assets/bg/pageBg.png');
    background-size: cover;
    background-position: center center;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    .bg_video {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
    .bg_wrap {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
    }
    .bg_top {
      width: 100%;
      height: 100px;
      background-image: url('/assets/bg/head.png'); //https://account.usr.cn/2.0.0/static/img/experience-top-bg.f206364.png
      background-size: cover;
      background-position: center center;
      z-index: 100;
      // background-color: #ff0000;
    }
    .bg_content {
      flex: 1;
      display: flex;
      height: calc(100% - 100px);
      padding-top: 40px;
      padding-bottom: 40px;
      // background-color: #ff0000;
      .bg_content_left {
        width: 600px;
        height: 100%;
        padding-left: 60px;
        display: inline-block;
        vertical-align: top;
        overflow: auto;
        // background-color: #ff0000;
        .bg_content_left_item {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          display: inline-block;
          width: 420px;
          height: 72px;
          margin-bottom: 30px;
          font-weight: 500;
          font-size: 20px;
          text-align: center;
          line-height: 72px;
          color: #caf2ff;
          cursor: pointer;
        }
        .bg_content_left_item:hover {
          background: url('/assets/bg/experience-left-hover.png') no-repeat;
          background-size: 100% 100%;
        }
        .experience-left-hover {
          background: url('/assets/bg/experience-left-hover.png') no-repeat;
          background-size: 100% 100%;
        }
        .experience-left {
          background: url('/assets/bg/experience-left.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .bg_content_right {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        vertical-align: top;
        overflow: auto;
        .bg_content_right_item {
          width: 500px;
          height: 325px;
          display: inline-block;
          vertical-align: top;
          background: url('/assets/bg/experience-box-bg.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 50px;
          margin-bottom: 50px;
          text-align: center;
          padding-top: 25px;
          position: relative;
          cursor: pointer;
          .bg_content_right_item_img {
            width: 460px;
            height: 270px;
          }
          .bg_content_right_item_name {
            position: absolute;
            left: 20px;
            bottom: 22px;
            width: 460px;
            height: 35px;
            background: rgba(0, 0, 0, 0.7);
            text-align: left;
            font-size: 14px;
            color: #fff;
            letter-spacing: 0;
            font-weight: 600;
            line-height: 35px;
            padding-left: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
    // background-color: #ff0000;
  }
</style>
