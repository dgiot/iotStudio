<template>
  <div
    class="wrapper"
    :title="$translateTitle('Logs.Source code') + link"
    @click="showSourceCode"
  >
    <vab-icon icon="code-box-line" />
    {{ $translateTitle('Logs.Source code') }}
  </div>
</template>

<script>
  export default {
    name: 'VabSourceCode',
    props: {
      link: {
        required: false,
        type: String,
        default: 'https://github.com/dgiot/dgiot_dashboard',
      },
    },
    methods: {
      showSourceCode() {
        window.open(this.link)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    position: fixed;
    font-weight: 700;
    z-index: 9999;
    color: #fff;
    bottom: 145px;
    right: -11.5px;
    cursor: pointer;
    padding: 7px 15px;
    padding-right: 19px;
    font-size: 12px;
    line-height: 12px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    user-select: none;
    border: 1px solid #000;
    opacity: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &:hover {
      right: -4px;
      background-color: rgba(0, 0, 0, 0.9);
    }
    i {
      margin-right: 3px;
      font-size: 12px;
    }
  }
</style>
