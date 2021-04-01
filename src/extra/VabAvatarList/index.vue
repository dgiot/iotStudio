<template>
  <div class="vab-avatar-list">
    <el-tooltip
      v-for="(item, index) in avatarList"
      :key="index"
      :content="item.username"
      effect="dark"
      placement="top-start"
    >
      <el-avatar :src="item.avatar" />
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'VabAvatarList',
    props: {
      avatarList: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-avatar-list {
    ::v-deep {
      .el-avatar {
        display: inline-block;
        margin-left: -15px;
        cursor: pointer;
        border: 3px solid $base-color-white;
      }
    }
  }
</style>
