<template>
  <div ref="slider" class="slider">
    <div class="process" :style="{ width }"></div>
    <div ref="trunk" class="thunk" :style="{ left }">
      <div class="block"></div>
      <div class="tips">
        <span>{{ scale * 100 }}</span>
        <i class="fas fa-caret-down"></i>
      </div>
    </div>
  </div>
</template>
<script>
  /*
   * min 进度条最小值
   * max 进度条最大值
   * v-model 对当前值进行双向绑定实时显示拖拽进度
   * */
  export default {
    name: 'VabSlider',
    props: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      value: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        slider: null, //滚动条DOM元素
        thunk: null, //拖拽DOM元素
        per: this.value, //当前值
      }
    },
    computed: {
      // 设置一个百分比，提供计算slider进度宽度和trunk的left值
      // 对应公式为 当前值-最小值/最大值-最小值 = slider进度width / slider总width
      // trunk left = slider进度width + trunk宽度/2
      scale() {
        return (this.per - this.min) / (this.max - this.min)
      },
      width() {
        if (this.slider) {
          return this.slider.offsetWidth * this.scale + 'px'
        } else {
          return 0 + 'px'
        }
      },
      left() {
        if (this.slider) {
          return (
            this.slider.offsetWidth * this.scale -
            this.thunk.offsetWidth / 2 +
            'px'
          )
        } else {
          return 0 + 'px'
        }
      },
    },
    //渲染到页面的时候
    mounted() {
      this.slider = this.$refs.slider
      this.thunk = this.$refs.trunk
      var _this = this
      this.thunk.onmousedown = function (e) {
        var width = parseInt(_this.width)
        var disX = e.clientX
        document.onmousemove = function (e) {
          // value, left, width
          // 当value变化的时候，会通过计算属性修改left，width

          // 拖拽的时候获取的新width
          var newWidth = e.clientX - disX + width
          // 拖拽的时候得到新的百分比
          var scale = newWidth / _this.slider.offsetWidth
          _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min)
          _this.per = Math.max(_this.per, _this.min)
          _this.per = Math.min(_this.per, _this.max)
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
        return false
      }
    },
  }
</script>
<style scoped>
  .box {
    width: 80%;
    margin: 100px auto 0;
  }

  .clear:after {
    display: block;
    clear: both;
    content: '';
  }

  .slider {
    position: relative;
    width: 300px;
    height: 10px;
    margin: 20px 0;
    line-height: 10px;
    cursor: pointer;
    background: #e4e7ed;
    border-radius: 5px;
  }

  .slider .process {
    position: absolute;
    top: 0;
    left: 0;
    width: 112px;
    height: 10px;
    background: #409eff;
    border-radius: 5px;
  }

  .slider .thunk {
    position: absolute;
    top: -7px;
    left: 100px;
    width: 20px;
    height: 20px;
  }

  .slider .block {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 1);
    border: 2px solid #409eff;
    border-radius: 50%;
    transition: 0.2s all;
  }

  .slider .tips {
    position: absolute;
    bottom: 30px;
    left: -7px;
    min-width: 15px;
    height: 24px;
    padding: 4px 8px;
    color: #fff;
    text-align: center;
    background: #000;
    border-radius: 5px;
  }

  .slider .tips i {
    position: absolute;
    bottom: -9px;
    left: 50%;
    margin-left: -5px;
    font-size: 16px;
    color: #000;
  }

  .slider .block:hover {
    opacity: 0.6;
    transform: scale(1.1);
  }
</style>
