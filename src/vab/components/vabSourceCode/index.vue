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
        default: 'https://github.com/dgiot/dgiot-dashboard',
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
    right: -11.5px;
    bottom: 145px;
    z-index: 9999;
    padding: 7px 15px;
    padding-right: 19px;
    font-size: 12px;
    font-weight: 700;
    line-height: 12px;
    color: #fff;
    cursor: pointer;
    user-select: none;
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid #000;
    border-radius: 4px;
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
