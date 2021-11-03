<!--
* @Author: h7ml
* @Date: 2021-11-02 19:55:00
* @LastEditors: h7ml
* @LastEditTime: 2021-11-02 19:55:00
* @Description: 物模型取证组件
* @FilePath: src\views\topo\components\TopoEvidence.vue
* @document https://fonts.google.com/icons?selected=Material+Icons
* @api https://github.com/material-components/material-web/tree/ae060177fac6ab2d7987a49ff9f34f0de2c335af/packages/icon-button
* @DocumentLink:
-->
<template>
  <div class="TopoEvidence">
    <div class="TopoEvidence-content">
      <div
        class="TopoEvidence-content-icons"
        v-for="(item, index) in materialIcons"
        :key="index"
      >
        <i
          v-dragBox
          draggable
          @click="evidenceHandle(item,index)"
          class="material-icons"
        >
          {{ item.icon }}
        </i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
  export default {
    name: 'TopoEvidence',
    components: {},
    directives: {
      dragBox: function (el) {
        let dragBox = el //获取当前元素
        dragBox.onclick=(e)=>{
          console.log(e,'点击的节点')
        }
        dragBox.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft
          let disY = e.clientY - dragBox.offsetTop
          dragBox.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX
            let top = e.clientY - disY
            //移动当前元素
            dragBox.style.left = left + 'px'
            dragBox.style.top = top + 'px'
            // console.error(dragBox,'dragBox')
          }
          dragBox.onmouseup = (e) => {
            // //鼠标弹起来的时候不再移动
            // dragBox.onmousemove = null
            // dragBox.onmousedown = null
            // //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            // dragBox.onmouseup = null
          }
        }
      },
    },
    data() {
      return {
        coordinate: {
          client: {},
          elePosition: {},
        },
        materialIcons: [
          {
            icon: 'timeline',
            path: 'M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z',
          },
          {
            icon: 'live_tv',
            path: 'M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z',
          },
          {
            icon: 'personal_video',
            path: 'M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z',
          },
          {
            icon: 'volume_up',
            path: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
          },
          {
            icon: 'image',
            path: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
          },
          {
            icon: 'archive',
            path: 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z',
          },
        ],
      }
    },
    methods: {
      ...mapMutations({
        createdEvidence: 'topo/createdEvidence',
      }),
      evidenceHandle(icon,index) {
        this.createdEvidence(
          _.merge(
            icon,
            {
              index:index,
              productid: this.$route.query.productid
            }
          )
        )
      },
    },
  }
</script>
<style>
  .material-icons {
    font-size: 48px !important;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .TopoEvidence {
    width: 100%;
    height: 100%;
    &--content {
      width: 100%;
      height: 100%;
      .material-icons {
        font-size: 48px !important;
      }
    }
  }
</style>
