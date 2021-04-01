<template>
  <v-stage :config="Config.stage">
    <v-layer ref="layer">
      <!-- 背景组 -->
      <v-group :config="Config.group">
        <v-rect :config="Config.rect" />
        <v-text :config="Config.text" />
      </v-group>
      <!-- 遮罩层组 -->
      <v-group :config="Config.group">
        <v-rect ref="coverRect" :config="Config.coverRect" />
        <v-text v-if="success" ref="coverText" :config="Config.coverText" />
      </v-group>
      <!-- 滑块组 -->
      <v-group
        ref="moveGroup"
        :config="Config.moveGroup"
        @mouseover="moveGroupMouseOver"
        @mouseout="moveGroupMouseOut"
        @mousedown="moveGroupMouseDown"
        @mouseup="moveGroupStop"
      >
        <v-rect ref="moveRect" :config="Config.moveRect" />
        <!-- 验证成功组 -->
        <v-group v-if="success" :config="Config.group">
          <v-circle ref="succCircle" :config="Config.succCircle" />
          <v-line :config="Config.succLine" />
        </v-group>
        <v-group v-else :config="Config.moveGroup_l">
          <v-line :config="Config.moveLine1" />
          <v-line :config="Config.moveLine2" />
        </v-group>
      </v-group>
    </v-layer>
  </v-stage>
</template>
<script>
  /*
   *  captchaConfig    // 属性   {width：330, height: 36} 组件的宽高
   *  eventCaptcha     // 验证成功的回调
   */
  let _$mouseDown = false // 鼠标是否在滑块组中按下，因为和html没有绑定，所以没有放在data中，并以_$开头
  export default {
    props: {
      captchaConfig: {
        type: Object,
        default: () => ({
          width: 330, // 宽度
          height: 36, // 高度
        }),
      },
    },
    data() {
      const { width, height } = this.captchaConfig
      let Config = {
        stage: {
          width: width,
          height: height,
        },
        group: {
          x: 0,
          y: 0,
        },
        rect: {
          width: width,
          height: height,
          fill: '#e8e8e8',
        },
        text: {
          x: 0,
          y: 0,
          width: width,
          height: height,
          text: '请按住滑块，拖动到最右边',
          fontSize: 14,
          fontFamily: '微软雅黑',
          align: 'center',
          lineHeight: parseFloat(height / 14),
        },
        //滑块组
        moveGroup: {
          draggable: true,
        },
        moveRect: {
          x: 0.5,
          y: 0.5,
          width: height - 1,
          height: height - 1,
          fill: '#fff',
          stroke: '#8d92a1',
          strokeWidth: 1,
        },
        moveGroup_l: {
          x: height / 3,
          y: height / 3,
        },
        moveLine1: {
          x: 0,
          y: 0,
          points: [0, 0, height / 6, height / 6, 0, height / 3],
          stroke: '#8d92a1',
          strokeWidth: 1,
          lineCap: 'round',
          lineJoin: 'round',
        },
        moveLine2: {
          x: height / 6,
          y: 0,
          points: [0, 0, height / 6, height / 6, 0, height / 3],
          stroke: '#8d92a1',
          strokeWidth: 1,
          lineCap: 'round',
          lineJoin: 'round',
        },
        //创建遮罩层组
        coverRect: {
          width: height / 2,
          height: height,
          fill: '#8d92a1',
          opacity: 0.8,
        },
        coverText: {
          x: 0,
          y: 0,
          width: width - height,
          height: height,
          align: 'center',
          text: '验证成功',
          fontSize: 14,
          fontFamily: '微软雅黑',
          fontStyle: 'bold',
          fill: '#fff',
          lineHeight: parseFloat(height / 14),
        },
        //验证成功组
        succCircle: {
          x: height / 2,
          y: height / 2,
          radius: height / 4,
          fill: '#8d92a1',
        },
        succLine: {
          points: [
            height / 2 - height / 4 / 2,
            height / 2,
            height / 2 - height / 4 / 8,
            height / 2 + height / 4 / 2,
            height / 2 + height / 4 / 2,
            height / 2 - height / 4 / 2,
          ],
          stroke: '#fff',
          strokeWidth: 1,
          lineCap: 'round',
          lineJoin: 'round',
        },
      }
      return {
        Config,
        success: 0, // 标记是否验证成功 0 失败 1 成功
      }
    },
    mounted() {
      // 给document绑定鼠标抬起事件
      document.addEventListener('mouseup', this.moveGroupStop)
      // 在组件注销的时候取消绑定
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('mouseup', this.moveGroupStop)
      })
      // 给滑块组绑定拖拽监听
      this.$refs.moveGroup.getNode().dragBoundFunc((pos) => {
        const { width, height } = this.captchaConfig
        let moveGroup = this.$refs.moveGroup.getNode()
        let moveRect = this.$refs.moveRect.getNode()
        let coverRect = this.$refs.coverRect.getNode()

        let moveX = moveGroup.getAttrs().x ? moveGroup.getAttrs().x : 0
        coverRect.width(moveX + height / 2)
        if (pos.x >= width - height) {
          if (this.success == 0) {
            this.success = 1
            this.$emit('eventCaptcha')
          }
          coverRect.opacity(1)
        }
        if (this.success == 0) {
          if (pos.x < 0) {
            return {
              x: 0,
              y: moveGroup.getAbsolutePosition().y,
            }
          } else if (pos.x > width - height) {
            return {
              x: width - height,
              y: moveGroup.getAbsolutePosition().y,
            }
          } else {
            return {
              x: pos.x,
              y: moveGroup.getAbsolutePosition().y,
            }
          }
        } else {
          return {
            x: width - height,
            y: moveGroup.getAbsolutePosition().y,
          }
        }
      })
    },
    methods: {
      // 鼠标进入滑块组
      moveGroupMouseOver() {
        document.body.style.cursor = 'pointer'
      },
      // 鼠标移出滑块组
      moveGroupMouseOut() {
        document.body.style.cursor = 'default'
      },
      // 鼠标按下
      moveGroupMouseDown() {
        _$mouseDown = true // 只有在滑块组点击鼠标才被视作要点击滑动验证
      },
      // 鼠标抬起
      moveGroupStop(e) {
        if (!_$mouseDown) return
        _$mouseDown = false
        document.body.style.cursor = 'default' // 鼠标恢复指针状态
        if (this.success == 0) {
          this.$refs.moveGroup.getNode().to({
            x: 0,
            duration: 0.3,
          })
          this.$refs.coverRect.getNode().to({
            width: this.captchaConfig.height / 2,
            duration: 0.3,
          })
        }
      },
    },
  }
</script>
