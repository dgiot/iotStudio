<template>
  <div class="userinfo">
    <div class="userdetail">
      <h3>个人信息</h3>
      <ul>
        <li>
          用户姓名:
          <span>{{ userinfo.name }}</span>
        </li>
        <li>
          用户ID:
          <span>{{ userinfo.objectId }}</span>
        </li>
        <li>
          用户描述:
          <span>{{ userinfo.nick }}</span>
        </li>
        <!-- <li>
          操作权限:<span>{{ roles.join(",") }}</span>
        </li> -->
      </ul>
    </div>
  </div>
</template>
<script>
  var editor
  export default {
    name: 'Userinfo',
    data() {
      return {
        userid: '',
        userinfo: {
          name: '',
          nick: '',
          objectId: '',
          roles: '',
        },
        roles: [],
      }
    },
    mounted() {
      this.queryUserInfo()
    },
    methods: {
      async queryUserInfo() {
        const { username, nick, objectId, ACL } = await this.$get_object(
          '_User',
          this.$route.params.userid
        )
        this.userinfo = {
          name: username,
          nick: nick,
          objectId: objectId,
          roles: '',
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .userinfo {
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    .userdetail {
      height: 500px;
      width: 1000px;
      background: #f9fafc;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
      h3 {
        text-align: center;
      }
      ul {
        li {
          list-style: none;
          margin-top: 50px;
          color: 666;
          span {
            margin-left: 20px;
            color: #666;
          }
        }
      }
    }
  }
</style>
