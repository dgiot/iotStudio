<template>
  <div
    :class="{
      ['logo-container-' + theme.layout]: true,
    }"
    class="logo-container"
  >
    <router-link to="/">
      <span class="logo">
        <!-- 使用内置svg示例 -->
        <!-- <vab-icon v-if="logo" :icon="logo" is-default-svg /> -->
        <!-- 使用自定义svg示例 -->
        <vab-icon v-if="logo" :icon="logo" is-custom-svg />
      </span>
      <span
        :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
        class="title"
      >
        {{ title }}
      </span>
    </router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabLogo',
    computed: {
      ...mapGetters({
        logo: 'settings/logo',
        title: 'settings/title',
        theme: 'settings/theme',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: transparent;
  }

  @mixin logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    color: $base-title-color;
    vertical-align: middle;
  }

  @mixin title {
    display: inline-block;
    margin-left: 5px;
    overflow: hidden;
    font-size: 20px;
    line-height: 55px;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container {
    &-horizontal,
    &-common {
      @include container;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
      }
    }

    &-vertical,
    &-column,
    &-comprehensive {
      @include container;

      height: $base-logo-height;
      line-height: $base-logo-height;
      text-align: center;

      .logo {
        svg,
        img {
          @include logo;
        }
      }

      .title {
        @include title;
        max-width: $base-left-menu-width - 60;
      }
    }

    &-column {
      background: $base-column-second-menu-background !important;

      .logo {
        position: fixed;
        top: 0;
        display: block;
        width: $base-left-menu-width-min;
        height: $base-logo-height;
        margin: 0;
        background: $base-column-first-menu-background;
      }

      .title {
        padding-right: 15px;
        padding-left: 15px;
        margin-left: $base-left-menu-width-min !important;
        color: $base-color-black !important;
        background: $base-column-second-menu-background !important;
        @include title;
      }
    }
  }
</style>
