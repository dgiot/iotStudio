<template>
  <div>
    <baidu-map
      :ak="ak"
      :center="baiduCenter"
      class="baidu_map"
      :scroll-wheel-zoom="scrollWheelZoom"
      :style="{ height: mapHeight, width: mapWidth }"
      :zoom="sizeZoom"
    >
      <bm-control v-if="controlShow">
        <bm-panorama
          v-if="panoramaShow"
          anchor="BMAP_ANCHOR_TOP_LEFT"
          :offset="panoramaOffset"
        />
        <bm-overview-map v-if="overviewShow" :is-open="isOpen" />
        <bm-scale v-if="scaleShow" :offset="scaleOffset" />
        <bm-city-list v-if="cityShow" :offset="cityOffset" />
        <bm-map-type
          v-if="maptypeShow"
          anchor="BMAP_ANCHOR_TOP_LEFT"
          :map-types="mapTypes"
          :offset="mapTypesOffset"
        />
      </bm-control>
      <bm-marker
        v-for="(item, index) in markerLocation"
        v-show="markerLocation.length || markerShow"
        :key="index"
        animation="BMAP_ANIMATION_BOUNCE"
        :content="item.name"
        :dragging="item.true"
        :position="{
          lng: item.longitude,
          lat: item.latitude,
        }"
      >
        <bm-label
          v-if="labelShow"
          :content="item.name"
          :label-style="labelStyle"
          :offset="bmlabelOffset"
        />
      </bm-marker>
      <bm-driving
        v-if="drivingShow"
        :auto-viewport="autoViewport"
        end="drivingEnd"
        :panel="false"
        :start="drivingStart"
        @searchcomplete="_handleSearchComplete"
      />
      <bml-lushu
        v-if="lushuShow"
        :icon="icon"
        :path="lushupath"
        :play="lushuplay"
        :rotation="rotation"
        @stop="_reset"
      />
      <bml-heatmap
        v-if="heatmapShow"
        :data="heatmapData"
        :max="heatmapMax"
        :radius="heatmapRadius"
      />
      <bml-marker-clusterer
        v-if="markerClustererShow"
        :average-center="averageCenter"
      >
        <bm-marker
          v-for="marker of markers"
          :key="marker"
          :position="{ lng: marker.lng, lat: marker.lat }"
        />
      </bml-marker-clusterer>
      <bml-curve-line
        v-if="curveShow"
        :editing="editing"
        :points="linepoints"
        @lineupdate="_updatepoints"
      />
      <bm-view v-if="viewShow" class="map" />
      <bm-walking
        v-if="walkingShow"
        :auto-viewport="walkingViewPort"
        end="walkingEnd"
        location="walkingLocation"
        :start="walkingStart"
      />
      <bm-transit
        v-if="transitShow"
        :auto-viewport="transitViewport"
        :end="transitEnd"
        :location="busLocation"
        :start="transitStart"
      />
      <bm-bus
        v-if="busShow"
        :auto-viewport="busViewport"
        :keyword="busKeyword"
        :location="busLocation"
      />
      <bm-traffic v-if="trafficShow" :predict-date="trafficDate" />
      <bm-tile
        v-if="tileShow"
        :is-transparent-png="true"
        tile-url-template="//developer.baidu.com/map/jsdemo/demo/tiles/{Z}/tile{X}_{Y}.png"
      />
      <bm-polyline
        v-if="polylineShow"
        :editing="editing"
        :path="polylinePath"
        :stroke-color="strokeColor"
        :stroke-opacity="strokeOpacity"
        :stroke-weight="strokeWeight"
        @lineupdate="_updatePolylinePath"
      />
      <bm-polygon
        v-if="polygonShow"
        :editing="true"
        :path="polygonPath"
        :stroke-color="polygonStrokeColor"
        :stroke-opacity="polygonStrokeOpacity"
        :stroke-weight="polygonStrokeWeight"
        @lineupdate="_updatePolygonPath"
      />
      <bm-circle
        v-if="circleShow"
        :center="circlePathCenter"
        :editing="true"
        :radius="circlePathRadius"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
        @lineupdate="_updateCirclePath"
      />
      <bm-ground v-if="groundShow" :bounds="bounds" :image-u-r-l="imageURL" />
      <bm-info-window
        v-if="windowShow"
        :position="infoWindowPosition"
        :show="infoWindowShow"
        :title="infoWindowTitle"
        @close="_infoWindowClose"
        @open="_infoWindowOpen"
      >
        <p v-if="textShow" v-text="infoWindowContents"></p>
        <button @click="_infoWindowclear">Clear</button>
      </bm-info-window>
      <!--      <bm-overlay-->
      <!--        v-if="overlayShow"-->
      <!--        pane="labelPane"-->
      <!--        :class="{ sample: true, active }"-->
      <!--        @draw="_draw"-->
      <!--        @mouseover.native="active = true"-->
      <!--        @mouseleave.native="active = false"-->
      <!--      >-->
      <!--        <div>{{ activeText }}</div>-->
      <!--      </bm-overlay>-->
      <bm-point-collection
        v-if="collectionShow"
        color="red"
        :points="collectionPoints"
        shape="BMAP_POINT_SHAPE_STAR"
        size="BMAP_POINT_SIZE_SMALL"
        @click.native="_clickHandler"
      />
      <bm-local-search
        v-if="searchShow"
        :auto-viewport="true"
        :keyword="searchKeyword"
        :location="searchLocation"
      />
      <bm-boundary
        v-if="boundaryShow"
        :name="boundaryName"
        stroke-color="blue"
        :stroke-weight="2"
      />

      <bm-navigation v-if="navShow" anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <bm-geolocation
        v-if="geoShow"
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :auto-location="true"
        :show-address-bar="true"
      />
      <bm-copyright
        v-if="copyrightShow"
        anchor="BMAP_ANCHOR_TOP_RIGHT"
        :copyright="[
          {
            id: 1,
            content: 'Copyright Message',
            bounds: { ne: { lng: 110, lat: 40 }, sw: { lng: 0, lat: 0 } },
          },
          { id: 2, content: '<a>杭州数蛙科技有限公司</a>' },
        ]"
      />
    </baidu-map>
  </div>
</template>

<script>
  import {
    BaiduMap,
    BmBoundary,
    BmBus,
    BmCircle,
    BmCityList,
    BmControl,
    BmCopyright,
    BmDriving,
    BmGeolocation,
    BmGround,
    BmLabel,
    BmlCurveLine,
    BmlHeatmap,
    BmlLushu,
    BmlMarkerClusterer,
    BmLocalSearch,
    BmMapType,
    BmMarker,
    BmNavigation,
    BmOverviewMap,
    BmPanorama,
    BmPointCollection,
    BmPolygon,
    BmPolyline,
    BmScale,
    BmTile,
    BmTraffic,
    BmTransit,
    BmView,
    BmWalking,
  } from 'vue-baidu-map'

  export default {
    name: 'VabBaiduMap',
    components: {
      BmScale,
      BmMapType,
      BmOverviewMap,
      BmPanorama,
      BmControl,
      BmLabel,
      BaiduMap,
      BmNavigation,
      BmGeolocation,
      BmCityList,
      BmMarker,
      BmCopyright,
      BmlMarkerClusterer,
      BmlLushu,
      BmlHeatmap,
      BmlCurveLine,
      BmWalking,
      BmView,
      BmTransit,
      BmTraffic,
      BmTile,
      BmPolyline,
      BmPolygon,
      BmPointCollection,
      // BmOverlay,
      BmLocalSearch,
      BmGround,
      BmDriving,
      BmCircle,
      BmBus,
      BmBoundary,
    },
    props: {
      controlShow: {
        type: Boolean,
        default: true,
      },
      panoramaShow: {
        type: Boolean,
        default: false,
      },
      overviewShow: {
        type: Boolean,
        default: false,
      },
      scaleShow: {
        type: Boolean,
        default: false,
      },
      cityShow: {
        type: Boolean,
        default: false,
      },
      maptypeShow: {
        type: Boolean,
        default: false,
      },
      markerShow: {
        type: Boolean,
        default: false,
      },
      labelShow: {
        type: Boolean,
        default: false,
      },
      lushuShow: {
        type: Boolean,
        default: false,
      },
      heatmapShow: {
        type: Boolean,
        default: false,
      },
      curveShow: {
        type: Boolean,
        default: false,
      },
      viewShow: {
        type: Boolean,
        default: false,
      },
      walkingShow: {
        type: Boolean,
        default: false,
      },
      transitShow: {
        type: Boolean,
        default: false,
      },
      markerClustererShow: {
        type: Boolean,
        default: false,
      },
      busShow: {
        type: Boolean,
        default: false,
      },
      trafficShow: {
        type: Boolean,
        default: false,
      },
      tileShow: {
        type: Boolean,
        default: false,
      },
      polylineShow: {
        type: Boolean,
        default: false,
      },
      polygonShow: {
        type: Boolean,
        default: false,
      },
      circleShow: {
        type: Boolean,
        default: false,
      },
      groundShow: {
        type: Boolean,
        default: false,
      },
      windowShow: {
        type: Boolean,
        default: false,
      },
      textShow: {
        type: Boolean,
        default: false,
      },
      overlayShow: {
        type: Boolean,
        default: false,
      },
      collectionShow: {
        type: Boolean,
        default: false,
      },
      searchShow: {
        type: Boolean,
        default: false,
      },
      boundaryShow: {
        type: Boolean,
        default: false,
      },
      navShow: {
        type: Boolean,
        default: false,
      },
      geoShow: {
        type: Boolean,
        default: false,
      },
      copyrightShow: {
        type: Boolean,
        default: true,
      },
      drivingShow: {
        type: Boolean,
        default: false,
      },
      ak: {
        type: String,
        default: 'fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG',
      },
      mapHeight: {
        type: String,
        default: '',
      },
      mapWidth: {
        type: String,
        default: '',
      },
      scrollWheelZoom: {
        type: Boolean,
        default: false,
      },
      center: {
        type: Object,
        default: () => {
          116.404
          39.915
        },
      },
      sizeZoom: {
        type: Number,
        default: 15,
      },
      panoramaOffset: {
        type: Object,
        default: () => {
          0
          0
        },
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
      cityOffset: {
        type: Object,
        default: () => {
          0
          0
        },
      },
      scaleOffset: {
        type: Object,
        default: () => {
          0
          0
        },
      },
      mapTypes: {
        type: Array,
        default: () => ['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP'],
      },
      mapTypesOffset: {
        type: Object,
        default: () => {
          0
          0
        },
      },
      markerLocation: {
        type: Array,
        default: () => [],
      },
      bmlabelOffset: {
        type: Object,
        default: () => {
          0
          0
        },
      },
      labelStyle: {
        type: Object,
        default: () => {
          'red'
          '12px'
        },
      },
      drivingStart: {
        type: String,
        default: '天安门',
      },
      drivingEnd: {
        type: String,
        default: '杭州',
      },
      infoWindowContents: {
        type: String,
        default: '杭州',
      },
      autoViewport: {
        type: Boolean,
        default: false,
      },
      path: {
        type: Array,
        default: () => [],
      },
      icon: {
        type: Array,
        default: () => {
          'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png'
          {
            52
            26
          }
          {
            {
              27
              13
            }
          }
        },
      },
      play: {
        type: Boolean,
        default: true,
      },
      rotation: {
        type: Boolean,
        default: true,
      },
      reset: {
        type: Boolean,
        default: true,
      },
      heatmapData: {
        type: Array,
        default: () => [],
      },
      heatmapMax: {
        type: Number,
        default: 100,
      },
      heatmapRadius: {
        type: Number,
        default: 20,
      },
      averageCenter: {
        type: Boolean,
        default: true,
      },
      markers: {
        type: Array,
        default: () => [],
      },
      points: {
        type: Array,
        default: () => [],
      },
      editing: {
        type: Boolean,
        default: false,
      },
      walkingStart: {
        type: String,
        default: '北京天安门',
      },
      walkingEnd: {
        type: String,
        default: '北京邮电大学',
      },
      walkingViewPort: {
        type: Boolean,
        default: true,
      },
      walkingLocation: {
        type: String,
        default: '北京',
      },
      transitStart: {
        type: String,
        default: '北京天安门',
      },
      transitEnd: {
        type: String,
        default: '北京邮电大学西门',
      },
      transitViewport: {
        type: Boolean,
        default: true,
      },

      busViewport: {
        type: Boolean,
        default: true,
      },
      busLocation: {
        type: String,
        default: '北京',
      },
      trafficDate: {
        type: Object,
        default: () => {
          7
          12
        },
      },
      strokeColor: {
        type: String,
        default: 'blue',
      },
      strokeOpacity: {
        type: Number,
        default: 0.5,
      },
      strokeWeight: {
        type: Number,
        default: 2,
      },
      busKeyword: {
        type: Number,
        default: 331,
      },
      linePath: {
        type: Array,
        default: () => [
          {
            lng: 116.404,
            lat: 39.915,
          },
          {
            lng: 116.405,
            lat: 39.92,
          },
          {
            lng: 116.423493,
            lat: 39.907445,
          },
        ],
      },
      gonPath: {
        type: Array,
        default: () => [
          {
            lng: 116.412732,
            lat: 39.911707,
          },
          {
            lng: 116.39455,
            lat: 39.910932,
          },
          {
            lng: 116.403461,
            lat: 39.921336,
          },
        ],
      },
      polygonStrokeColor: {
        type: String,
        default: 'blue',
      },
      polygonStrokeOpacity: {
        type: Number,
        default: 0.5,
      },
      polygonStrokeWeight: {
        type: Number,
        default: 2,
      },
      circlePath: {
        type: Object,
        default: () => {
          {
            116.404
            39.915
          }
          500
        },
      },
      circleCenter: {
        type: Object,
        default: () => {
          116.404
          39.915
        },
      },
      mapCenter: {
        type: Array,
        default: () => {
          116.404
          39.915
        },
      },
      circleRadius: {
        type: Number,
        default: 500,
      },
      bounds: {
        type: Object,
        default: () => {
          {
            110
            40
          }
          {
            0
            0
          }
        },
      },
      imageURL: {
        type: String,
        default: 'http://dafrok.github.io/vue-baidu-map/favicon.png',
      },
      infoWindowPosition: {
        type: Object,
        default: () => {
          116.404
          39.915
        },
      },
      infoWindowTitle: {
        type: String,
        default: 'infoWindow.contents',
      },
      infoWindowIsShow: {
        type: Boolean,
        default: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      activeText: {
        type: String,
        default: '',
      },
      collectionPoints: {
        type: Array,
        default: () => [],
      },
      searchKeyword: {
        type: String,
        default: '百度',
      },
      searchLocation: {
        type: String,
        default: '北京',
      },
      boundaryName: {
        type: String,
        default: '北京市海淀区',
      },
    },
    data() {
      return {
        lushuplay: this.play,
        lushupath: this.path,
        linepoints: this.points,
        polylinePath: this.linePath,
        polygonPath: this.gonPath,
        circlePathCenter: this.circleCenter,
        circlePathRadius: this.circleRadius,
        infoWindowShow: this.infoWindowIsShow,
        active: this.isActive,
        baiduCenter: this.mapCenter
          ? this.mapCenter
          : {
              lng: 116.404,
              lat: 39.915,
            },
      }
    },
    mounted() {
      // let _this = this
      // _this.lushuplay = _this.play
      // _this.lushupath = _this.path
      // _this.linepoints = _this.points
      // _this.polylinePath = _this.linePath
    },
    methods: {
      _handleSearchComplete(e) {
        console.log(e, 'handleSearchComplete')
        this.lushupath = res.getPlan(0).getRoute(0).getPath()
      },
      _reset() {
        this.lushuplay = false
      },
      _updatepoints(e) {
        console.log(e)
        this.linepoints = e.target.cornerPoints
      },
      _updatePolylinePath(e) {
        console.log(e)
        this.polylinePath = e.target.getPath()
      },
      _updatePolygonPath(e) {
        this.polygonPath = e.target.getPath()
      },
      _updateCirclePath(e) {
        this.circlePathCenter = e.target.getCenter()
        this.circlePathRadius = e.target.getRadius()
      },
      _infoWindowClose(e) {
        this.infoWindowShow = false
      },
      _infoWindowOpen(e) {
        this.infoWindowShow = true
      },
      _infoWindowclear() {
        this.contents = ''
      },
      draw({ el, BMap, map }) {
        const pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915))
        el.style.left = pixel.x - 60 + 'px'
        el.style.top = pixel.y - 20 + 'px'
      },
      _clickHandler(e) {
        alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .baidu_map {
    height: 500px;

    .sample {
      position: absolute;
      width: 120px;
      height: 40px;
      padding: 10px;
      overflow: hidden;
      line-height: 40px;
      color: #fff;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 5px #000;
    }

    .sample.active {
      color: #fff;
      background: rgba(0, 0, 0, 0.75);
    }
  }
</style>
