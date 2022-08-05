<template>
  <i aria-hidden="true" class="icon" :class="'ri-' + icon"></i>
</template>

<script>
  export default {
    name: 'DgiotIcon',
    props: {
      icon: {
        type: String,
        default: '',
        // required: true,
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
