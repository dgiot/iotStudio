<template>
  <div
    ref="container"
    class="container"
  >
    <div
      ref="content"
      class="content"
    ></div>
  </div>
</template>

<script>
  import { Circle, Layer, Rect, Stage } from 'konva'

  export default {
    name: 'BallGame',
    data() {
      return {
        width: 0,
        height: 0,
        state: null,
        layer: null,
        circle: null,
        radius: 20,
        centerX: 0,
        centerY: 0,
        speedX: Math.random() * 3,
        speedY: Math.random() * 3,
        speedStep: 0.01,
        maxSpeed: 20,
        rect: null,
        rectWidth: 100,
      }
    },
    mounted() {
      this.init()
      this.createCircle()
      this.createRect()
      this.update()
    },
    methods: {
      /**
       * @Author: 王林25
       * @Date: 2021-02-02 09:31:09
       * @Desc: 初始化
       */
      init() {
        let { width, height } = this.$refs.content.getBoundingClientRect()
        this.width = width
        this.height = height
        this.stage = new Stage({
          container: this.$refs.content,
          width: width,
          height: height,
        })
        this.layer = new Layer()
        this.stage.add(this.layer)
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 09:58:12
       * @Desc: 渲染小球
       */
      createCircle() {
        this.centerX = this.stage.width() / 2
        this.centerY = 100
        this.circle = new Circle({
          x: this.centerX,
          y: this.centerY,
          radius: this.radius,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
        })
        this.layer.add(this.circle)
        this.layer.draw()
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 10:30:22
       * @Desc: 渲染挡板
       */
      createRect() {
        this.rect = new Rect({
          x: (this.stage.width() - 100) / 2,
          y: this.height - 50,
          width: 100,
          height: 10,
          fill: 'green',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
          dragBoundFunc: function (pos) {
            return {
              x: pos.x,
              y: this.absolutePosition().y,
            }
          },
        })
        this.layer.add(this.rect)
        this.layer.draw()
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 10:01:32
       * @Desc: 小球运动
       */
      runCircle() {
        this.centerX += this.speedX
        this.centerY += this.speedY
        this.circle.x(this.centerX)
        this.circle.y(this.centerY)
        // 撞墙检测
        if (
          this.centerX + this.radius >= this.width ||
          this.centerX - this.radius <= 0
        ) {
          this.speedX = -this.speedX
        }
        if (this.centerY - this.radius <= 0) {
          this.speedY = -this.speedY
        }
        // 撞板检测
        this.collisionCheck()
        // 游戏结束检测
        if (this.centerY + this.radius >= this.height) {
          return this.gameOver()
        }
        // 加速度
        if (Math.abs(this.speedX) < this.maxSpeed) {
          this.speedX > 0
            ? (this.speedX += this.speedStep)
            : (this.speedX -= this.speedStep)
        }
        if (Math.abs(this.speedY) < this.maxSpeed) {
          this.speedY > 0
            ? (this.speedY += this.speedStep)
            : (this.speedY -= this.speedStep)
        }
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 11:17:24
       * @Desc: 小球和挡板的碰撞检测
       */
      collisionCheck() {
        let minx = 0
        let miny = 0
        let rectX = this.rect.x()
        let rectY = this.rect.y()
        let rectWidth = this.rect.width()
        let rectHeight = this.rect.height()
        if (this.centerX < rectX) {
          minx = rectX
        } else if (this.centerX > rectX + rectWidth) {
          minx = rectX + rectWidth
        } else {
          minx = this.centerX
        }
        if (this.centerY < rectY) {
          miny = rectY
        } else if (this.centerY > rectY + rectHeight) {
          miny = rectY + rectHeight
        } else {
          miny = this.centerY
        }
        if (
          this.getTwoPointDistance(minx, miny, this.centerX, this.centerY) <=
          this.radius
        ) {
          if (minx === rectX || minx === rectX + rectWidth) {
            this.speedX = -this.speedX
          }
          if (miny === rectY) {
            this.speedY = -this.speedY
          }
        }
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 10:44:59
       * @Desc: 游戏结束
       */
      gameOver() {
        alert('game over')
        this.speedX = Math.random() * 3
        this.speedY = Math.random() * 3
        this.speedStep = 0.01
        this.centerX = this.stage.width() / 2
        this.centerY = 100
        this.rect.x(this.stage.width() / 2)
        this.rect.y(this.height - 20)
        this.rect.draggable(false)
        this.rect.draggable(true)
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 10:06:59
       * @Desc: 刷新
       */
      update() {
        window.requestAnimationFrame(() => {
          this.runCircle()
          this.update()
          this.layer.draw()
        })
      },

      /**
       * @Author: 王林25
       * @Date: 2021-02-02 14:10:19
       * @Desc: 两点距离公式
       */
      getTwoPointDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      },
    },
  }
</script>

<style lang="scss">
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;

    .content {
      width: 800px;
      height: 100%;
      background-color: #f5f5f5;
    }
  }
</style>
