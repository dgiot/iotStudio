<!--
 * @Author: h7ml
 * @Date: 2021-03-19 13:49:17
 * @LastEditTime: 2021-03-19 22:10:06
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\vab\components\VabMenu\components\MenuItem.vue
 * @Description:
-->
<template>
  <el-menu-item
    :index="itemOrMenu.path"
    @click.native="handleLink"
  >
    <el-image
      v-if="itemOrMenu.meta.icon && itemOrMenu.meta.icon.includes('dgiot')"
      :alt="$FileServe"
      :src="$FileServe + itemOrMenu.meta.icon"
      style="width:16px;height:16px"
    >
      <img
        slot="error"
        :src="$FileServe + itemOrMenu.meta.icon"
        :title="$FileServe + itemOrMenu.meta.icon"
        style="width:16px;height:16px"
      >
    </el-image>
    <vab-icon
      v-else
      :icon="itemOrMenu.meta.icon"
      :is-custom-svg="itemOrMenu.meta.isCustomSvg"
      :title="$translateTitle(`route.${itemOrMenu.meta.title}`)"
    />
    <span :title="$translateTitle(`route.${itemOrMenu.meta.title}`)">
      {{ $translateTitle(`route.${itemOrMenu.meta.title}`) }}
    </span>
    <el-tag
      v-if="itemOrMenu.meta && itemOrMenu.meta.badge"
      effect="dark"
      type="danger"
    >
      {{ itemOrMenu.meta.badge }}
    </el-tag>
    <span
      v-if="itemOrMenu.meta && itemOrMenu.meta.dot"
      class="vab-dot vab-dot-error"
    >
      <span />
    </span>
  </el-menu-item>
</template>

<script>
  import { isExternal } from '@/utils/validate'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'MenuItem',
    props: {
      itemOrMenu: {
        type: Object,
        default() {
          return null
        },
      },
    },
    computed: {
      ...mapGetters({
        device: 'settings/device',
      }),
    },
    methods: {
      ...mapActions({
        foldSideBar: 'settings/foldSideBar',
      }),
      handleLink() {
        const routePath = this.itemOrMenu.path
        const target = this.itemOrMenu.meta.target
        if (target === '_blank') {
          if (isExternal(routePath)) {
            window.open(routePath)
          } else if (this.$route.fullPath !== routePath) {
            window.open(routePath.href)
          }
        } else {
          if (isExternal(routePath)) {
            window.location.href = routePath
          } else if (this.$route.fullPath !== routePath) {
            if (this.device === 'mobile') this.foldSideBar()
            this.$router.push(routePath)
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-tag {
      float: right;
      height: 16px;
      padding-right: 4px;
      padding-left: 4px;
      margin-top: ($base-menu-item-height - 16) / 2;
      line-height: 16px;
      border: 0;
    }
  }

  .vab-dot {
    float: right;
    margin-top: ($base-menu-item-height - 6) / 2 + 1;
  }
</style>
