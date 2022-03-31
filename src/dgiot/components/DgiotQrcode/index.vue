<!--
* @Author: h7ml
* @Date: 2021-11-09 17:34:04
* @LastEditors: h7ml
* @LastEditTime: 2021-11-09 17:34:04
* @Description:
* @FilePath: src\dgiot\components\DgiotAmis\index.vue
* @DocumentLink:
-->
<template>
  <a-popover trigger="hover">
    <template slot="content">
      <a-card hoverable style="width: 240px">
        <a-button
          slot="extra"
          icon="download"
          shape="circle"
          type="primary"
          @click.native="down"
        />
        <vue-qr
          slot="cover"
          :auto-color="setting.autoColor"
          :bg-src="setting.bgSrc"
          :bgcale="setting.bgcale"
          :binarize="setting.binarize"
          :binarize-threshold="setting.binarizeThreshold"
          :callback="callback"
          :color-dark="setting.colorDark"
          :dot-scale="setting.dotScale"
          :logo-src="setting.logoSrc"
          :size="setting.size"
          :text="setting.text"
        />
        <a-card-meta :title="setting.text" />
      </a-card>
    </template>
    <a-icon :style="iconstyle" :type="iconstyle.type" />
  </a-popover>
</template>

<script>
  // https://www.itxst.com/qrcodejs/fmmvyaer.html
  import VueQr from 'vue-qr'

  export default {
    name: 'DgiotQrcode',
    components: {
      VueQr,
    },
    props: {
      iconstyle: {
        type: Object,
        required: false,
        default: function () {
          return {
            type: 'qrcode',
            'font-size': '22px',
          }
        },
      },
      setting: {
        type: Object,
        required: false,
        default: function () {
          return {
            //二维码内容
            text: 'http://www.iotn2n.com',
            //logo图标
            logoSrc:
              'http://dev.iotn2n.com/dgiot_file/user/profile/4d867367b4_userinfo_avatar.jpg?timestamp=iotn2n',
            //autoColor未false,二维码数据点的颜色
            colorDark: '#007bff',
            //二维码数据点的速率比，默认未0.35
            dotScale: 0.3,
            //背景图的速率比
            bgcale: 0.8,
            //二维码背景图
            bgSrc:
              'http://dev.iotn2n.com/dgiot_file/user/profile/4d867367b4_userinfo_avatar.jpg?timestamp=iotn2n',
            //二维码数据点的颜色是否自动生成颜色
            autoColor: true,
            //二值化
            binarize: false,
            //二值化值
            binarizeThreshold: 130,
          }
        },
      },
    },
    data() {
      return {
        dataUrl: '',
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        }
      },
    },
    methods: {
      BrowseFolder(dataUrl) {
        const eventPayload = {
          content: dataUrl,
          fileName: this.setting.text + '.png',
          imageType: 'png',
        }
        console.log(eventPayload)
        const content = eventPayload.content
        const imageType = eventPayload.imageType
        const fileName = eventPayload.fileName
        if (content) {
          // 接口返回的数据部分
          // 解析图片
          // 因接口直接返回了base64代码部分，所以不需要截取，如果含"data:image/png;base64," 则需要自己做截取处理
          const raw = window.atob(content)
          const rawLength = raw.length
          const uInt8Array = new Uint8Array(rawLength)
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i)
          }
          const blob = new Blob([uInt8Array], { type: 'image/' + imageType })
          //保存图片
          const aLink = document.createElement('a')
          const evt = document.createEvent('HTMLEvents')
          evt.initEvent('click', true, true)
          aLink.download = fileName
          aLink.href = URL.createObjectURL(blob)
          aLink.click()
        } else {
          console.log('没有base64代码')
        }
      },
      down() {
        this.BrowseFolder(this.dataUrl.replace('data:image/png;base64,', ''))
      },
      callback(dataUrl) {
        this.dataUrl = dataUrl
      },
    },
  }
</script>
