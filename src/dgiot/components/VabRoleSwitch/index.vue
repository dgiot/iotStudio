<template>
  <div>
    <dgiot-icon icon="node-tree" @click.native="switchTree(treeFlag)" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

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
        roleTree: 'user/roleTree',
        treeFlag: 'settings/treeFlag',
      }),
    },
    created() {},
    methods: {
      ...mapActions({
        setTreeFlag: 'settings/setTreeFlag',
      }),
      switchTree(flag) {
        localStorage.setItem('roleTree', JSON.stringify(this.roleTree))
        this.setTreeFlag(!flag)
      },
    },
  }
</script>
