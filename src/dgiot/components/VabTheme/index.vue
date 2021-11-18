<template>
  <span v-if="theme.showTheme">
    <dgiot-icon icon="brush-2-line" @click.native="handleOpenTheme" />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabTheme',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      handleOpenTheme() {
        this.$baseEventBus.$emit('theme')
      },
    },
  }
</script>
