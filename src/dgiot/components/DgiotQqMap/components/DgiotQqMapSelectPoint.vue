<template>
  <div>
    <div v-show="toolbar" style="overflow: hidden">
      <section>
        <!--工具条-->
        <el-col class="toolbar" :span="24" style="padding-bottom: 0px">
          <el-form :inline="true">
            <el-form-item>
              <el-input
                v-model="inputVal"
                placeholder="城市名称"
                style="width: 300px"
                @keyup.native="inputChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">获取地理位置</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-input v-model="latlngCurrent" placeholder="坐标值" style="width: 246px;"></el-input>
            </el-form-item> -->
          </el-form>
        </el-col>
      </section>
    </div>
    <div class="mapWrap">
      <div id="qqmapCont" class="qqmap" />
      <div class="lngTips" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DgiotQqMapSelectPoint',
    props: {
      toolbar: {
        type: Boolean,
        default: false,
      },
      mapcenter: {
        type: String,
        default: '34.759666,113.648071',
      },
      oldmarker: {
        type: String,
        default: '34.759666,113.648071',
      },
      inputDefault: {
        type: String,
        default: '',
      },
      zoom: {
        type: Number,
        default: 9,
      },
    },
    data: function () {
      return {
        mapAddress: null,
        qqmap: '',
        premarker: '',
        marker: '',
        inputVal: '',
        latlngCurrent: '',
        enevt: {
          mousemove: true,
          mouseout: true,
        },
      }
    },
    watch: {
      oldmarker(newVal, oldVal) {
        if (newVal) {
          console.log(typeof newVal)
          this.latlngCurrent = newVal
          this.qqmap && this.createMarker()
        }
      },
      inputDefault(newVal, oldVal) {
        console.log('默认地址变成：', newVal)
        this.inputVal = newVal
      },
    },
    mounted() {
      const that = this
      this.inputVal = this.inputDefault
      if (this.oldmarker) {
        this.latlngCurrent = this.oldmarker || this.mapcenter
      }
      if (typeof qq === 'object') {
        that.createMap()
      } else {
        this.loadQQmap()
      }
      window.onMapFileLoad = function () {
        console.log('qqmap加载完成')
        that.createMap()
      }
    },
    methods: {
      loadQQmap() {
        const script = document.createElement('script')
        // 设置标签的type属性
        script.type = 'text/javascript'
        // 设置标签的链接地址
        script.src =
          'https://map.qq.com/api/js?v=2.exp&key=4VQBZ-ZGO3G-VGSQE-ILN4G-LWFUK-5WB7H&libraries=drawing,geometry,autocomplete,convertor&callback=onMapFileLoad'
        // 添加标签到dom
        document.body.appendChild(script)
      },
      search() {
        const that = this
        // 调用地址解析类
        const geocoder = new qq.maps.Geocoder({
          complete: function (result) {
            that.qqmap.setCenter(result.detail.location)
            that.qqmap.setZoom(this.zoom)
            return result
          },
        })
        const address = this.inputVal
        // 通过getLocation();方法获取位置信息值
        console.log('搜索地址：', address)
        geocoder.getLocation(address)
      },
      inputChange() {
        this.$emit('addr', this.inputVal) // 地图点击坐标 传递给父组件
      },
      createMap() {
        const that = this
        this.qqmap = new qq.maps.Map(document.getElementById('qqmapCont'), {
          center: new qq.maps.LatLng(
            that.mapcenter.split(',')[0],
            that.mapcenter.split(',')[1]
          ), // 地图的中心地理坐标。
          zoom: 12, // 地图的中心地理坐标。
        })
        setTimeout(() => {
          this.createMarker()
          this.bindMapEvent()
        }, 500)
      },
      createMarker() {
        const that = this
        if (that.premarker) {
          that.premarker.setMap(null)
        }
        if (this.oldmarker) {
          console.log('编辑模式：', this.oldmarker)
          that.qqmap.setCenter(
            new qq.maps.LatLng(
              that.oldmarker.split(',')[0],
              that.oldmarker.split(',')[1]
            )
          )
          that.premarker = new qq.maps.Marker({
            position: new qq.maps.LatLng(
              that.oldmarker.split(',')[0],
              that.oldmarker.split(',')[1]
            ),
            map: that.qqmap,
          })
        } else {
          // 获取城市列表接口设置中心点
          const citylocation = new qq.maps.CityService({
            complete: function (result) {
              that.qqmap.setCenter(result.detail.latLng)
            },
          })
          // 调用searchLocalCity();方法
          citylocation.searchLocalCity()
        }
      },
      bindMapEvent() {
        const that = this
        var infoWin = new qq.maps.InfoWindow({
          map: that.qqmap,
        }) //此处是点击地图后生成的地标名称
        var geoder = new qq.maps.Geocoder({
          complete: function (result) {
            that.$emit('mapclick', result) // 地图点击坐标 传递给父组件
            that.mapAddress = result
            return result
          },
          error: (err) => {
            alert(err)
          },
        })
        // // 地图点击事件
        qq.maps.event.addListener(that.qqmap, 'click', function (event) {
          that.marker && that.marker.setMap(null)
          that.premarker && that.premarker.setMap(null)
          that.$emit('mapclick', event.latLng) // 地图点击坐标 传递给父组件
          that.latlngCurrent = event.latLng.lat + ',' + event.latLng.lng
          that.marker = new qq.maps.Marker({
            position: event.latLng,
            map: that.qqmap,
          })
          var latlng = new qq.maps.LatLng(
            event.latLng.getLat(),
            event.latLng.getLng()
          )
          geoder.getAddress(latlng)
          setTimeout(() => {
            console.error(that.mapAddress)
            infoWin.open()
            infoWin.setContent(
              '<div style="text-align:center;white-space:nowrap;">' +
                that.mapAddress.detail.address +
                '</div>'
            ) //这里是标记之处的样式
            infoWin.setPosition(event.latLng)
          }, 200)
        })
        // 地图鼠标滑动事件
        const $lngTipsBox = document.querySelector('.lngTips')
        const mapBoxWidth = window.getComputedStyle(
          document.querySelector('.mapWrap')
        ).width
        qq.maps.event.addListener(that.qqmap, 'mousemove', function (event) {
          $lngTipsBox.style.display = 'block'
          $lngTipsBox.style.top = event.pixel.y + 10 + 'px'
          $lngTipsBox.style.left = event.pixel.x + 15 + 'px'
          $lngTipsBox.innerText =
            '点击选择此坐标：' + event.latLng.lat + ',' + event.latLng.lng
        })
        // 鼠标离开
        qq.maps.event.addListener(that.qqmap, 'mouseout', function (event) {
          $lngTipsBox.style.display = 'none'
        })
      },
    },
  }
</script>

<style>
  .qqmap {
    width: 100%;
    height: 100%;
  }
  .mapWrap {
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: 15px;
    overflow: hidden;
  }
  .lngTips {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 123456;
    display: none;
    width: 255px;
    height: 40px;
    padding: 5px 7px;
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    background: #ffffff;
    border: #eeeeee 1px solid;
    border-radius: 5px;
    box-shadow: #eeeeee 1px 1px 3px;
  }
</style>
