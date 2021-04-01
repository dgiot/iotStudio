<template>
  <div class="callback-container" />
</template>

<script>
  import { callback } from '@/utils/social'

  export default {
    name: 'Callback',
    data() {
      return {
        loading: null,
      }
    },
    created() {
      this.loading = this.$baseLoading()
      callback()
      window.close()
    },
    beforeUnmount() {
      this.loading.close()
    },
  }
</script>
