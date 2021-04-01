<template>
  <el-col :span="24">
    <el-card class="page-header" shadow="never">
      <el-avatar :src="avatar" class="page-header-avatar" />
      <div class="page-header-tip">
        <p class="page-header-tip-title">
          {{ handleTips() }}
        </p>
        <p class="page-header-tip-description">{{ description }}</p>
      </div>
      <div class="page-header-avatar-list">
        <vab-avatar-list :avatar-list="avatatList" />
        <p>participants</p>
      </div>
    </el-card>
  </el-col>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getList } from '@/api/description'
  import VabAvatarList from '@/extra/VabAvatarList'

  export default {
    components: { VabAvatarList },
    data() {
      return {
        description: '',
        avatatList: [
          {
            avatar: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
            username: 'good luck',
          },
          {
            avatar:
              'https://gitee.com/chu1204505056/image/raw/master/user/fwfmiao.gif',
            username: 'fwfmiao',
          },
          {
            avatar: 'https://i.gtimg.cn/club/item/face/img/3/15643_100.gif',
            username: '嘻嘻',
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleTips() {
        const hour = new Date().getHours()
        return hour < 8
          ? `早上好 ${this.username}，又是元气满满的一天。`
          : hour <= 11
          ? `上午好 ${this.username}，看到你我好开心。`
          : hour <= 13
          ? `中午好 ${this.username}，忙碌了一上午，记得吃午饭哦。`
          : hour < 18
          ? `下午好 ${this.username}，你一定有些累了，喝杯咖啡提提神。`
          : `晚上好 ${this.username}，愿你天黑有灯，下雨有伞。`
      },
      async fetchData() {
        const { data } = await getList()
        this.description = data.description
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page-header {
    min-height: 145px;
    transition: $base-transition;

    ::v-deep {
      * {
        transition: $base-transition;
      }

      .el-card__body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    &-avatar {
      width: 60px;
      height: 60px;
      margin-right: 20px;
      border-radius: 50%;
    }

    &-tip {
      flex: auto;
      width: calc(100% - 200px);
      min-width: 300px;

      &-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: bold;
        color: #3c4a54;
      }

      &-description {
        font-size: $base-font-size-default;
        color: #808695;
      }
    }

    &-avatar-list {
      flex: 1;
      min-width: 100px;
      margin-left: 20px;
      text-align: right;
      p {
        margin-right: 9px;
        line-height: 0px;
      }
    }
  }
</style>
