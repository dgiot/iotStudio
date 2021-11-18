<template>
  <div>
    <dgiot-icon icon="node-tree" @click.native="setTree(!tree)" />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'VabRoleSwitch',
    data() {
      return {
        drawer: false,
        direction: 'rtl',
      }
    },
    computed: {
      ...mapGetters({
        tree: 'settings/tree',
      }),
    },
    created() {},
    methods: {
      ...mapActions({
        setTree: 'settings/setTree',
      }),
    },
  }
</script>
