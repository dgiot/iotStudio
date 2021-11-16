<template>
  <Vab-amis :key="amisKey" :schema="amisJson" />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'AmisDemo',
    data() {
      return {
        amisKey: moment(new Date()).format('X'),
      }
    },
    computed: {
      ...mapGetters({
        amisJson: 'amis/amisJson',
      }),
    },
    watch: {
      amisJson: {
        handler(val) {
          console.log(val)
          this.amisKey = moment(new Date()).format('X')
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>
