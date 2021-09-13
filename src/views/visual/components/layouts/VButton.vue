<template>
  <button class="v-button">{{ propValue }}</button>
</template>

<script>
  export default {
    props: {
      propValue: {
        type: String,
        default: '',
        required: false,
      },
      element: {
        type: Object,
        required: false,
        default: () => {},
      },
    },
  }
</script>

<style lang="scss" scoped>
  .v-button {
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    color: #606266;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    outline: 0;
    transition: 0.1s;
    -webkit-appearance: none;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      color: #3a8ee6;
      background-color: #ecf5ff;
    }
  }
</style>
