<!--
 * @Author: h7ml
 * @Date: 2021-01-14 14:35:36
 * @LastEditTime: 2021-03-19 22:11:37
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\vab\components\VabMenu\components\Submenu.vue
 * @Description:
-->
<template>
  <el-submenu
    ref="subMenu"
    :index="itemOrMenu.path"
    :popper-append-to-body="false"
  >
    <template #title>
      <vab-icon
        v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
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
    name: 'Submenu',
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
