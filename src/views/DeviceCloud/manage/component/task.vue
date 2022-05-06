<!-- Language: vue -->
<!-- Path: src/views/DeviceCloud/manage/component/task.vue -->
<template>
  <div class="task-con-container">{{ productid }}</div>
</template>
<script>
  import { getProduct } from '@/api/Product'
  import { getDevice } from '@/api/Device'

  export default {
    name: 'Task',
    // 设备任务子设备传参,暂定设备id && 产品id
    props: {
      productid: {
        type: String,
        required: true,
      },
      deviceid: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        task: {
          device: {},
          product: {},
        },
      }
    },
    mounted() {
      // this.featchData()
    },
    methods: {
      async featchData() {
        this.task.device = await getDevice(this.deviceid)
        this.task.product = await getProduct(this.productid)
      },
    },
  }
</script>
