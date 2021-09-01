<template>
  <div class="maintenancePlanAdd">
    <div class="child-panel-title">
      <h2>图形标注</h2>
    </div>
    <div class="panel-body">
      <div class="demo">
        <canvas id="canvas" :width="width" :height="height"></canvas>
        <div class="draw-btn-group">
          <div
            :class="{ active: drawType == '' }"
            title="自由选择"
            @click="drawTypeChange('')"
          >
            <i class="draw-icon icon-mouse"></i>
          </div>
          <div
            :class="{ active: drawType == 'arrow' }"
            title="画箭头"
            @click="drawTypeChange('arrow')"
          >
            <i class="draw-icon icon-1"></i>
          </div>
          <div
            :class="{ active: drawType == 'text' }"
            title="文本输入框"
            @click="drawTypeChange('text')"
          >
            <i class="draw-icon icon-2"></i>
          </div>
          <div
            :class="{ active: drawType == 'ellipse' }"
            title="画圆"
            @click="drawTypeChange('ellipse')"
          >
            <i class="draw-icon icon-3"></i>
          </div>
          <div
            :class="{ active: drawType == 'rectangle' }"
            title="画矩形"
            @click="drawTypeChange('rectangle')"
          >
            <i class="draw-icon icon-4"></i>
          </div>
          <div
            :class="{ active: drawType == 'polygon' }"
            title="画多边形"
            @click="drawPolygon"
          >
            <i class="draw-icon icon-6"></i>
          </div>
          <div
            :class="{ active: drawType == 'pen' }"
            title="笔画"
            @click="drawTypeChange('pen')"
          >
            <i class="draw-icon icon-7"></i>
          </div>
          <div
            :class="{ active: drawType == 'pentagram' }"
            title="五角星"
            @click="drawTypeChange('pentagram')"
          >
            <i class="draw-icon icon-pentagram"></i>
          </div>
          <div title="从文件选择图片上传" @click="uploadImg">
            <i class="draw-icon icon-img"></i>
          </div>
          <div title="加载背景图" @click="loadExpImg">
            <i class="draw-icon icon-back"></i>
          </div>
          <div title="保存" @click="save">
            <i class="draw-icon icon-save"></i>
          </div>
        </div>
      </div>
    </div>
    <input
      id="imgInput"
      type="file"
      accept="image/*"
      @change="uploadImgChange"
    />
    <img id="img" :src="imgSrc" />
    <img
      id="expImg"
      src="https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/exp.jpg"
    />
  </div>
</template>
<script>
  export default {
    name: 'Fabric',
    data() {
      return {
        width: 1280,
        height: 720,
        rect: [],
        canvas: {},
        showMenu: false,
        x: '',
        y: '',
        mouseFrom: {},
        mouseTo: {},
        drawType: null, //当前绘制图像的种类
        canvasObjectIndex: 0,
        textbox: null,
        rectangleLabel: 'warning',
        drawWidth: 2, //笔触宽度
        color: '#E34F51', //画笔颜色
        drawingObject: null, //当前绘制对象
        moveCount: 1, //绘制移动计数器
        doDrawing: false, // 绘制状态
        //polygon 相关参数
        polygonMode: false,
        pointArray: [],
        lineArray: [],
        activeShape: false,
        activeLine: '',
        line: {},
        delectKlass: {},
        imgFile: {},
        imgSrc: '',
      }
    },
    watch: {
      drawType() {
        this.canvas.selection = !this.drawType
      },
      width() {
        this.canvas.setWidth(this.width)
      },
      height() {
        this.canvas.setHeight(this.height)
      },
    },
    mounted() {
      this.canvas = new fabric.Canvas('canvas', {
        // skipTargetFind: false, //当为真时，跳过目标检测。目标检测将返回始终未定义。点击选择将无效
        // selectable: false,  //为false时，不能选择对象进行修改
        // selection: false   // 是否可以多个对象为一组
      })
      this.canvas.selectionColor = 'rgba(0,0,0,0.05)'
      this.canvas.on('mouse:down', this.mousedown)
      this.canvas.on('mouse:move', this.mousemove)
      this.canvas.on('mouse:up', this.mouseup)
      document.onkeydown = (e) => {
        // 键盘 delect删除所选元素
        if (e.keyCode == 46) {
          this.deleteObj()
        }
        // ctrl+z 删除最近添加的元素
        if (e.keyCode == 90 && e.ctrlKey) {
          this.canvas.remove(
            this.canvas.getObjects()[this.canvas.getObjects().length - 1]
          )
        }
      }
      // var originalRender = fabric.Textbox.prototype._render;
      // fabric.Textbox.prototype._render = function(ctx) {
      //   originalRender.call(this, ctx);
      //   //Don't draw border if it is active(selected/ editing mode)
      //   if (this.active) return;
      //   if(this.showTextBoxBorder){
      //     var w = this.width,
      //       h = this.height,
      //       x = -this.width / 2,
      //       y = -this.height / 2;
      //     ctx.beginPath();
      //     ctx.moveTo(x, y);
      //     ctx.lineTo(x + w, y);
      //     ctx.lineTo(x + w, y + h);
      //     ctx.lineTo(x, y + h);
      //     ctx.lineTo(x, y);
      //     ctx.closePath();
      //     var stroke = ctx.strokeStyle;
      //     ctx.strokeStyle = this.textboxBorderColor;
      //     ctx.stroke();
      //     ctx.strokeStyle = stroke;
      //   }
      // }
      // fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');
    },
    methods: {
      // 保存当前画布为png图片
      save() {
        var canvas = document.getElementById('canvas')
        var imgData = canvas.toDataURL('png')
        imgData = imgData.replace('image/png', 'image/octet-stream')
        // 下载后的问题名，可自由指定
        var filename = 'drawingboard_' + new Date().getTime() + '.' + 'png'
        this.saveFile(imgData, filename)
      },
      saveFile(data, filename) {
        var save_link = document.createElement('a')
        save_link.href = data
        save_link.download = filename
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
        save_link.dispatchEvent(event)
      },
      uploadImg() {
        document.getElementById('imgInput').click()
      },
      // 从已渲染的DOM元素加载图片至canvas
      loadExpImg() {
        var imgElement = document.getElementById('expImg') //声明我们的图片
        var imgInstance = new fabric.Image(imgElement, {
          selectable: false,
          // zIndex:-99,
        })
        this.canvas.add(imgInstance)
      },
      // 从文件加载图片至canvas
      uploadImgChange() {
        // 获取文件
        var eleImportInput = document.getElementById('imgInput')
        this.imgFile = eleImportInput.files[0]
        var imgSrc = '',
          imgTitle = ''
        // 从reader中获取选择文件的src
        if (/\.(jpe?g|png|gif)$/i.test(this.imgFile.name)) {
          var reader = new FileReader()
          var _this = this
          reader.addEventListener(
            'load',
            function () {
              imgTitle = _this.imgFile.name
              _this.imgSrc = this.result
            },
            false
          )
          reader.readAsDataURL(this.imgFile)
        }
        var imgElement = document.getElementById('img') //声明我们的图片
        imgElement.onload = () => {
          this.width = imgElement.width
          this.height = imgElement.height
          var imgInstance = new fabric.Image(imgElement, {
            zIndex: -1,
            selectable: false,
          })
          this.canvas.add(imgInstance)
        }
      },
      // 开始绘制时，指定绘画种类
      drawTypeChange(e) {
        this.drawType = e
        this.canvas.skipTargetFind = !!e
        if (e == 'pen') {
          // isDrawingMode为true 才可以自由绘画
          this.canvas.isDrawingMode = true
        } else {
          this.canvas.isDrawingMode = false
        }
      },
      // 鼠标按下时触发
      mousedown(e) {
        // 记录鼠标按下时的坐标
        var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.mouseFrom.x = xy.x
        this.mouseFrom.y = xy.y
        this.doDrawing = true
        if (this.drawType == 'text') {
          this.drawing()
        }
        if (this.textbox) {
          this.textbox.enterEditing()
          this.textbox.hiddenTextarea.focus()
        }
        // 绘制多边形
        if (this.drawType == 'polygon') {
          this.canvas.skipTargetFind = false
          try {
            // 此段为判断是否闭合多边形，点击红点时闭合多边形
            if (this.pointArray.length > 1) {
              // e.target.id == this.pointArray[0].id 表示点击了初始红点
              if (e.target && e.target.id == this.pointArray[0].id) {
                this.generatePolygon()
              }
            }
            //未点击红点则继续作画
            if (this.polygonMode) {
              this.addPoint(e)
            }
          } catch (error) {
            console.log(error)
          }
        }
      },
      // 鼠标松开执行
      mouseup(e) {
        var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.mouseTo.x = xy.x
        this.mouseTo.y = xy.y
        this.drawingObject = null
        this.moveCount = 1
        if (this.drawType != 'polygon') {
          this.doDrawing = false
        }
      },
      //鼠标移动过程中已经完成了绘制
      mousemove(e) {
        if (this.moveCount % 2 && !this.doDrawing) {
          //减少绘制频率
          return
        }
        this.moveCount++
        var xy = e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.mouseTo.x = xy.x
        this.mouseTo.y = xy.y
        // 多边形与文字框特殊处理
        if (this.drawType != 'text' || this.drawType != 'polygon') {
          this.drawing(e)
        }
        if (this.drawType == 'polygon') {
          if (this.activeLine && this.activeLine.class == 'line') {
            var pointer = this.canvas.getPointer(e.e)
            this.activeLine.set({ x2: pointer.x, y2: pointer.y })
            var points = this.activeShape.get('points')
            points[this.pointArray.length] = {
              x: pointer.x,
              y: pointer.y,
              zIndex: 1,
            }
            this.activeShape.set({
              points: points,
            })
            this.canvas.renderAll()
          }
          this.canvas.renderAll()
        }
      },
      deleteObj() {
        this.canvas.getActiveObjects().map((item) => {
          this.canvas.remove(item)
        })
      },
      transformMouse(mouseX, mouseY) {
        return { x: mouseX / 1, y: mouseY / 1 }
      },
      // 绘制多边形开始，绘制多边形和其他图形不一样，需要单独处理
      drawPolygon() {
        this.drawType = 'polygon'
        this.polygonMode = true
        //这里画的多边形，由顶点与线组成
        this.pointArray = new Array() // 顶点集合
        this.lineArray = new Array() //线集合
        this.canvas.isDrawingMode = false
      },
      addPoint(e) {
        var random = Math.floor(Math.random() * 10000)
        var id = new Date().getTime() + random
        var circle = new fabric.Circle({
          radius: 5,
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 0.5,
          left: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
          top: (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
          selectable: false,
          hasBorders: false,
          hasControls: false,
          originX: 'center',
          originY: 'center',
          id: id,
          objectCaching: false,
        })
        if (this.pointArray.length == 0) {
          circle.set({
            fill: 'red',
          })
        }
        var points = [
          (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
          (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
          (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
          (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
        ]
        this.line = new fabric.Line(points, {
          strokeWidth: 2,
          fill: '#999999',
          stroke: '#999999',
          class: 'line',
          originX: 'center',
          originY: 'center',
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        })
        if (this.activeShape) {
          var pos = this.canvas.getPointer(e.e)
          var points = this.activeShape.get('points')
          points.push({
            x: pos.x,
            y: pos.y,
          })
          var polygon = new fabric.Polygon(points, {
            stroke: '#333333',
            strokeWidth: 1,
            fill: '#cccccc',
            opacity: 0.3,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false,
          })
          this.canvas.remove(this.activeShape)
          this.canvas.add(polygon)
          this.activeShape = polygon
          this.canvas.renderAll()
        } else {
          var polyPoint = [
            {
              x: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
              y: (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
            },
          ]
          var polygon = new fabric.Polygon(polyPoint, {
            stroke: '#333333',
            strokeWidth: 1,
            fill: '#cccccc',
            opacity: 0.3,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false,
          })
          this.activeShape = polygon
          this.canvas.add(polygon)
        }
        this.activeLine = this.line
        this.pointArray.push(circle)
        this.lineArray.push(this.line)
        this.canvas.add(this.line)
        this.canvas.add(circle)
      },
      generatePolygon() {
        var points = new Array()
        this.pointArray.map((point, index) => {
          points.push({
            x: point.left,
            y: point.top,
          })
          this.canvas.remove(point)
        })
        this.lineArray.map((line, index) => {
          this.canvas.remove(line)
        })
        this.canvas.remove(this.activeShape).remove(this.activeLine)
        var polygon = new fabric.Polygon(points, {
          stroke: this.color,
          strokeWidth: this.drawWidth,
          fill: 'rgba(255, 255, 255, 0)',
          opacity: 1,
          hasBorders: true,
          hasControls: false,
        })
        this.canvas.add(polygon)
        this.activeLine = null
        this.activeShape = null
        this.polygonMode = false
        this.doDrawing = false
        this.drawType = null
      },
      drawing(e) {
        if (this.drawingObject) {
          this.canvas.remove(this.drawingObject)
        }
        var canvasObject = null
        var left = this.mouseFrom.x,
          top = this.mouseFrom.y,
          mouseFrom = this.mouseFrom,
          mouseTo = this.mouseTo
        switch (this.drawType) {
          case 'arrow': //箭头
            var x1 = mouseFrom.x,
              x2 = mouseTo.x,
              y1 = mouseFrom.y,
              y2 = mouseTo.y
            var w = x2 - x1,
              h = y2 - y1,
              sh = Math.cos(Math.PI / 4) * 16
            var sin = h / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
            var cos = w / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
            var w1 = (16 * sin) / 4,
              h1 = (16 * cos) / 4,
              centerx = sh * cos,
              centery = sh * sin
            /**
             * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
             * w1 ，h1用于确定四个点
             */
            var path = ' M ' + x1 + ' ' + y1
            path += ' L ' + (x2 - centerx + w1) + ' ' + (y2 - centery - h1)
            path +=
              ' L ' + (x2 - centerx + w1 * 2) + ' ' + (y2 - centery - h1 * 2)
            path += ' L ' + x2 + ' ' + y2
            path +=
              ' L ' + (x2 - centerx - w1 * 2) + ' ' + (y2 - centery + h1 * 2)
            path += ' L ' + (x2 - centerx - w1) + ' ' + (y2 - centery + h1)
            path += ' Z'
            canvasObject = new fabric.Path(path, {
              stroke: this.color,
              fill: this.color,
              strokeWidth: this.drawWidth,
            })
            break
          case 'pentagram': //五角星
            var x1 = mouseFrom.x,
              x2 = mouseTo.x,
              y1 = mouseFrom.y,
              y2 = mouseTo.y
            /**
             * 实现思路  (x1,y1)表示鼠标起始的位置 (x2,y2)表示鼠标抬起的位置
             * r 表示五边形外圈圆的半径，这里建议自己画个图理解
             * 正五边形夹角为36度。计算出cos18°，sin18°备用
             */
            var w = Math.abs(x2 - x1),
              h = Math.abs(y2 - y1),
              r = Math.sqrt(w * w + h * h)
            var cos18 = Math.cos((18 * Math.PI) / 180)
            var sin18 = Math.sin((18 * Math.PI) / 180)
            /**
             * 算出对应五个点的坐标转化为路径
             */
            var point1 = [x1, y1 + r]
            var point2 = [x1 + 2 * r * sin18, y1 + r - 2 * r * cos18]
            var point3 = [x1 - r * cos18, y1 + r * sin18]
            var point4 = [x1 + r * cos18, y1 + r * sin18]
            var point5 = [x1 - 2 * r * sin18, y1 + r - 2 * r * cos18]
            var path = ' M ' + point1[0] + ' ' + point1[1]
            path += ' L ' + point2[0] + ' ' + point2[1]
            path += ' L ' + point3[0] + ' ' + point3[1]
            path += ' L ' + point4[0] + ' ' + point4[1]
            path += ' L ' + point5[0] + ' ' + point5[1]
            path += ' Z'
            canvasObject = new fabric.Path(path, {
              stroke: this.color,
              fill: this.color,
              strokeWidth: this.drawWidth,
              // angle:180,  //设置旋转角度
            })
            break
          case 'ellipse': //椭圆
            // 按shift时画正圆，只有在鼠标移动时才执行这个，所以按了shift但是没有拖动鼠标将不会画圆
            if (e.e.shiftKey) {
              mouseTo.x - left > mouseTo.y - top
                ? (mouseTo.y = top + mouseTo.x - left)
                : (mouseTo.x = left + mouseTo.y - top)
            }
            var radius =
              Math.sqrt(
                (mouseTo.x - left) * (mouseTo.x - left) +
                  (mouseTo.y - top) * (mouseTo.y - top)
              ) / 2
            canvasObject = new fabric.Ellipse({
              left: (mouseTo.x - left) / 2 + left,
              top: (mouseTo.y - top) / 2 + top,
              stroke: this.color,
              fill: 'rgba(255, 255, 255, 0)',
              originX: 'center',
              originY: 'center',
              rx: Math.abs(left - mouseTo.x) / 2,
              ry: Math.abs(top - mouseTo.y) / 2,
              strokeWidth: this.drawWidth,
            })
            break
          case 'rectangle': //长方形
            // 按shift时画正方型
            if (e.e.shiftKey) {
              mouseTo.x - left > mouseTo.y - top
                ? (mouseTo.y = top + mouseTo.x - left)
                : (mouseTo.x = left + mouseTo.y - top)
            }
            var path =
              'M ' +
              mouseFrom.x +
              ' ' +
              mouseFrom.y +
              ' L ' +
              mouseTo.x +
              ' ' +
              mouseFrom.y +
              ' L ' +
              mouseTo.x +
              ' ' +
              mouseTo.y +
              ' L ' +
              mouseFrom.x +
              ' ' +
              mouseTo.y +
              ' L ' +
              mouseFrom.x +
              ' ' +
              mouseFrom.y +
              ' z'
            canvasObject = new fabric.Path(path, {
              left: left,
              top: top,
              stroke: this.color,
              strokeWidth: this.drawWidth,
              fill: 'rgba(255, 255, 255, 0)',
              hasControls: false,
            })
            //也可以使用fabric.Rect
            break
          case 'text': //文本框
            this.textbox = new fabric.Textbox('', {
              left: mouseFrom.x,
              top: mouseFrom.y - 10,
              // width: 150,
              fontSize: 16,
              borderColor: this.color,
              fill: this.color,
              hasControls: false,
            })
            this.canvas.add(this.textbox)
            this.textbox.enterEditing()
            this.textbox.hiddenTextarea.focus()
            break
          default:
            break
        }
        if (canvasObject) {
          // canvasObject.index = getCanvasObjectIndex();\
          this.canvas.add(canvasObject) //.setActiveObject(canvasObject)
          this.drawingObject = canvasObject
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-container {
    flex-direction: column;
  }
  img,
  input {
    display: none;
  }
  .demo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  canvas {
    border: 1px dashed black;
  }
  .draw-btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // width: 1270px;
    margin-top: 10px;
    & > div {
      cursor: pointer;
      background: #fafafa;
      &:hover {
        background: #eee;
      }
      i {
        display: flex;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: 80%;
      }
      .icon-1 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/1.png');
      }
      .icon-pentagram {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/pentagram.png');
      }
      .icon-2 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/2.png');
      }
      .icon-3 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/3.png');
      }
      .icon-4 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/4.png');
        background-size: 75%;
      }
      .icon-5 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/5.png');
        background-size: 70%;
      }
      .icon-6 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/6.png');
      }
      .icon-7 {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/7.png');
        background-size: 80%;
      }
      .icon-del {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/del.png');
        background-size: 90%;
      }
      .icon-img {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/img.png');
        background-size: 80%;
      }
      .icon-back {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/back.png');
        background-size: 75%;
      }
      .icon-save {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/save.png');
        background-size: 80%;
      }
      .icon-mouse {
        background-image: url('https://cdn.jsdelivr.net/gh/Couy69/vue-fabric-drawingboard@master/src/assets/icons/draw/mouse.png');
        background-size: 60%;
      }
    }
    .active {
      background: #eee;
    }
  }
</style>
