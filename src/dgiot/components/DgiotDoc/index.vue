<template>
  <dgiot-icon class="el-icon-notebook-2" @click.native="click" />
</template>

<script>
  export default {
    name: 'DgiotDoc',
    props: {
      url: {
        required: false,
        type: String,
        default: 'https://dgiot-web.vercel.app/',
      },
    },
    methods: {
      click() {
        window.open(this.url, '_blank')
      },
    },
  }
</script>
