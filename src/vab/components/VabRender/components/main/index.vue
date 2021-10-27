<template>
  <div>
    <main-header />
    <main-content />
  </div>
</template>
<script>
  import MainHeader from './main-header'
  import MainContent from './main-content'

  export default {
    name: 'VabRenderMain',
    components: {
      MainHeader,
      MainContent,
    },
    inject: ['VabRender'],
    props: {
      loading: Boolean,
    },
    render() {
      const slots = this.VabRender.$scopedSlots
      const directives = [
        {
          name: 'loading',
          value: this.loading,
        },
      ]
      return (
        <div>
          {slots['main-header'] ? (
            slots['main-header']({ VabRender: this.VabRender })
          ) : (
            <main-header onSave={() => this.$emit('save')} />
          )}

          {slots['main-content'] ? (
            slots['main-content']({ VabRender: this.VabRender })
          ) : (
            <main-content {...{ directives }} />
          )}
        </div>
      )
    },
  }
</script>
