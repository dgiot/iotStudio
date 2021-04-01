<template>
  <div class="error-container">
    <div class="error-content">
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="pic-error">
            <el-image
              src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/error_images/404.png"
              class="pic-error-parent"
            />
            <el-image
              src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/error_images/cloud.png"
              class="pic-error-child left"
            />
          </div>
        </el-col>

        <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
          <div class="bullshit">
            <div class="bullshit-oops">{{ oops }}</div>
            <div class="bullshit-headline">{{ headline }}</div>
            <div class="bullshit-info">{{ info }}</div>
            <router-link class="bullshit-return-home" to="/">
              {{ jumpTime }}s&nbsp;{{ btn }}
            </router-link>
            <el-button
              type="primary"
              size="medium"
              style="margin-left: 20px"
              round
              @click="logout"
            >
              {{ $translateTitle('退出登录') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { toLoginRoute } from '@/utils/routes'

  export default {
    name: 'Page404',
    beforeRouteLeave(to, from, next) {
      this.delVisitedRoute(this.$route.path)
      clearInterval(this.timer)
      next()
    },
    data() {
      return {
        jumpTime: 5,
        oops: '抱歉!',
        headline: '当前页面不存在...',
        info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
        btn: '返回首页',
        timer: 0,
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabs/visitedRoutes',
        objectId: 'user/objectId',
      }),
    },
    mounted() {
      this.timeChange()
    },
    methods: {
      ...mapActions({
        delVisitedRoute: 'tabs/delVisitedRoute',
        _logout: 'user/logout',
      }),
      timeChange() {
        this.timer = setInterval(() => {
          if (this.jumpTime) {
            this.jumpTime--
          } else {
            this.delVisitedRoute(this.$route.path)
            this.$router.push('/')
            clearInterval(this.timer)
          }
        }, 1000)
      },
      async logout() {
        await this._logout()
        await this.$router.push(toLoginRoute(this.$route.path))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .error-container {
    position: relative;
    min-height: 100vh;

    .error-content {
      position: absolute;
      top: 55%;
      left: 50%;
      width: 40vw;
      height: 400px;
      transform: translate(-50%, -50%);

      .pic-error {
        position: relative;
        float: left;
        width: 100%;
        overflow: hidden;

        &-parent {
          width: 100%;
        }

        &-child {
          position: absolute;

          &.left {
            top: 17px;
            left: 220px;
            width: 80px;
            opacity: 0;
            animation-name: cloudLeft;
            animation-duration: 2s;
            animation-timing-function: linear;
            animation-delay: 1s;
            animation-fill-mode: forwards;
          }

          @keyframes cloudLeft {
            0% {
              top: 17px;
              left: 220px;
              opacity: 0;
            }

            20% {
              top: 33px;
              left: 188px;
              opacity: 1;
            }

            80% {
              top: 81px;
              left: 92px;
              opacity: 1;
            }

            100% {
              top: 97px;
              left: 60px;
              opacity: 0;
            }
          }
        }
      }

      .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden;

        &-oops {
          margin-bottom: 20px;
          font-size: 32px;
          font-weight: bold;
          line-height: 40px;
          color: $base-color-blue;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &-headline {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
          color: #222;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.1s;
          animation-fill-mode: forwards;
        }

        &-info {
          margin-bottom: 30px;
          font-size: 13px;
          line-height: 21px;
          color: $base-color-gray;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.2s;
          animation-fill-mode: forwards;
        }

        &-return-home {
          display: block;
          float: left;
          width: 110px;
          height: 36px;
          font-size: 14px;
          line-height: 36px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          background: $base-color-blue;
          border-radius: 100px;
          opacity: 0;
          animation-name: slideUp;
          animation-duration: 0.5s;
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    }
  }
</style>
