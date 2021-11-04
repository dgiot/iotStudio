<template>
  <AMisRenderer :schema="schema" />
</template>

<script>
  import AMisRenderer from '@/views/amis/components/AMisRenderer'
  export default {
    name: 'AmisDemo',
    components: {
      AMisRenderer,
    },
    data() {
      return {
        schema: {
          type: 'app',
          brandName: 'dgiot-amis',
          logo: '/assets/images/logo/logo.png',
          header: {
            type: 'tpl',
            inline: false,
            className: 'w-full',
            tpl: '<div class="flex justify-between"><div>顶部区域左侧</div><div>顶部区域右侧</div></div>',
          },
          api: '/assets/pages/site.json',
        },
      }
    },
  }
</script>
