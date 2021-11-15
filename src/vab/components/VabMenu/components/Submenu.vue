<!--
 * @Author: h7ml
 * @Date: 2021-01-14 14:35:36
 * @LastEditTime: 2021-03-19 22:11:37
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\vab\components\VabMenu\components\Submenu.vue
 * @Description:
-->
<template>
  <el-submenu
    ref="subMenu"
    :index="itemOrMenu.path"
    :popper-append-to-body="false"
  >
    <template #title>
      <el-image
        v-if="itemOrMenu.meta.icon && itemOrMenu.meta.icon.includes('dgiot')"
        :alt="$FileServe"
        :src="$FileServe + itemOrMenu.meta.icon"
        style="float: left; width: 16px; height: 16px"
      >
        <img
          slot="error"
          :src="$FileServe + itemOrMenu.meta.icon"
          style="float: left; width: 16px; height: 16px"
          :title="$FileServe + itemOrMenu.meta.icon"
        />
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
    </template>
    <slot />
  </el-submenu>
</template>

<script>
  export default {
    name: 'SubMenu',
    props: {
      itemOrMenu: {
        type: Object,
        default() {
          return null
        },
      },
    },
    methods: {},
  }
</script>
