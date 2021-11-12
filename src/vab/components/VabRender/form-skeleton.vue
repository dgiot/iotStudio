<template>
  <div class="form-skeleton">
    <div v-for="item of 4" :key="item" class="form-skeleton-item">
      <div class="form-skeleton-label skeleton-animation">xxx</div>
      <div class="form-skeleton-component skeleton-animation"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FormSkeleton',
    data() {
      return {}
    },
    mounted() {},
    methods: {},
  }
</script>

<style>
  .form-skeleton {
    margin-bottom: 20px;
  }

  .form-skeleton-item {
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 20px;
  }

  .form-skeleton-label {
    width: 50px;
    padding-right: 12px;
    line-height: 40px;
    color: #606266;
    text-align: right;
  }

  @keyframes skeletonLoading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }

  .form-skeleton-component {
    flex: 1;
    height: 40px;
    background: linear-gradient(90deg, #eeeeee 25%, #cccccc 37%, #eeeeee 63%);
    background-size: 400% 100%;
    border-radius: 5px;
    animation: skeletonLoading 1.4s ease infinite;
  }
</style>
