<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="$FileServe + avatar" />
      <div class="user-name">
        <span class="hidden-xs-only">{{ username }}</span>
        <dgiot-icon
          class="dgiot-dropdown"
          :class="{ 'dgiot-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <dgiot-icon icon="user-line" />
          {{ $translateTitle('个人中心') }}
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <dgiot-icon icon="logout-circle-r-line" />
          {{ $translateTitle('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { toLoginRoute } from '@/utils/router/routes'
  export default {
    name: 'DgiotAvatar',
    data() {
      return {
        active: false,
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
        objectId: 'user/objectId',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
    },
    async created() {},
    mounted() {
      console.log('window.name\n', window.name)
      // document.getElementsByTagName('link')[0].href = this.avatar
    },
    methods: {
      ...mapActions({
        _logout: 'user/logout',
      }),
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'personalCenter':
            this.personalCenter()
            break
        }
      },
      handleVisibleChange(val) {
        this.active = val
      },
      personalCenter() {
        if (this.objectId) {
          this.$router.push(`/userinfo/${this.objectId}`)
        } else {
          this.$baseMessage(
            '获取用户id失败',
            'error',
            false,
            'dgiot-hey-message-error'
          )
        }
      },
      async logout() {
        await this._logout()
        await this.$router.push(toLoginRoute(this.$route))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
