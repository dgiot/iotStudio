<template>
  <i
    :class="'ri-' + icon"
    aria-hidden="true"
    class="icon"
  ></i>
</template>

<script>
  export default {
    name: 'VabIcon',
    props: {
      icon: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style lang="scss">
  .icon {
    font-size: 16px;
    vertical-align: -1px;
  }
</style>
