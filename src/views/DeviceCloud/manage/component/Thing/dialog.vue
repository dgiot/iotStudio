<!--
物模型事件弹窗组件
-->
<template>
  <div class="thing-dialog">
    <el-dialog
      :before-close="handleClose(done)"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'ThingDialog',
    data() {
      return {
        dialogVisible: false,
        done: false,
      }
    },
    methods: {
      handleClose(done) {
        this.dialogVisible = false
        done()
      },
    },
  }
</script>
<style></style>
