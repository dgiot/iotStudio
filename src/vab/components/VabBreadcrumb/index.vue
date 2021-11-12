<template>
  <el-breadcrumb
    class="vab-breadcrumb"
    separator=">"
  >
    <el-breadcrumb-item
      v-for="(item, index) in levelList"
      :key="index"
    >
      <a @click.prevent="handleLink(item.redirect)">
        <vab-icon
          v-if="item.meta && item.meta.icon"
          :icon="item.meta.icon"
        />
        {{ $translateTitle(`route.${item.meta.title}`) }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'VabBreadcrumb',
    data() {
      return {
        levelList: [],
      }
    },
    watch: {
      $route: {
        handler() {
          this.levelList = this.getBreadcrumb()
        },
        immediate: true,
      },
    },
    methods: {
      getBreadcrumb() {
        return this.$route.matched.filter(
          (item) =>
            item.meta && this.$translateTitle(`route.${item.meta.title}`),
        )
      },
      handleLink(redirect) {
        this.$router.push(redirect)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-breadcrumb {
    height: $base-nav-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-height;

    ::v-deep {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          a {
            font-weight: normal;
            color: #515a6e;
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
