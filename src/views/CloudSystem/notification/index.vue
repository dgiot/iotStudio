<!--
* @Author: h7ml
* @Date: 2021-11-17 11:13:23
* @LastEditors: h7ml
* @LastEditTime: 2021-11-17 11:13:23
* @Description:
* @FilePath: src\views\CloudSystem\index.vue
* @DocumentLink:
-->
<template>
  <div class="CloudSystem-container">
    <el-tabs ref="_tabs" v-model="activeName">
      <!--短信配置-->
      <el-tab-pane
        :label="$translateTitle('system.smsconfiguration')"
        name="first"
      >
        <div style="text-align: center">
          <el-form ref="form" class="demo-form" label-width="100px">
            <el-form-item label="AppID">
              <el-input
                v-model="configurationInfo.sms.appid"
                placeholder="请输入AppID"
              />
            </el-form-item>
            <el-form-item label="AppKey">
              <el-input
                v-model="configurationInfo.sms.appkey"
                placeholder="请输入AppKey"
              />
            </el-form-item>
            <el-form-item label="签名">
              <el-input
                v-model="configurationInfo.sms.sign"
                placeholder="请输入签名"
              />
            </el-form-item>
            <el-button type="primary" @click="save(configurationInfo)">
              保存
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>
      <!--邮件配置-->
      <el-tab-pane
        :label="$translateTitle('system.mailconfiguration')"
        name="second"
      >
        <div style="text-align: center">
          <el-form ref="form" class="demo-form" label-width="100px">
            <el-form-item label="邮箱账号">
              <el-input
                v-model="configurationInfo.mail.username"
                placeholder="请输入邮箱账号"
              />
            </el-form-item>
            <el-form-item label="邮箱授权码">
              <el-input
                v-model="configurationInfo.mail.password"
                placeholder="请输入邮箱授权码"
              />
            </el-form-item>
            <el-form-item label="SMTP">
              <el-input
                v-model="configurationInfo.mail.smtp"
                placeholder="请输入SMTP"
              />
            </el-form-item>
            <el-button type="primary" @click="save(configurationInfo)">
              保存
            </el-button>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { postconfiguration, getconfiguration } from '@/api/Notification'

  export default {
    name: 'CloudSystem',
    components: {},
    data() {
      return {
        activeName: 'first',
        configurationInfo: {},
        infoData: 'CloudSystem',
      }
    },
    computed: {},
    mounted() {
      this.smsconfiguration()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      smsconfiguration() {
        getconfiguration().then((res) => {
          this.configurationInfo = res.data
        })
      },
      save(configurationInfo) {
        postconfiguration({ data: configurationInfo })
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .CloudSystem-container {
    width: 100%;
    height: 100%;
    &-container {
      width: 100%;
      height: 100%;
    }
  }
</style>
