<template>
  <div class="iframe-container">
    <iframe frameborder="0" :src="url" />
  </div>
</template>

<script>
  export default {
    name: 'Swagger',
    data() {
      return {
        url:
          process.env.NODE_ENV == 'development'
            ? process.env.VUE_APP_URL + '/dgiot_swagger/'
            : location.origin + '/dgiot_swagger/',
      }
    },
  }
</script>

<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>
