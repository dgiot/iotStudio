<template>
  <div>
    <div class="amap-page-container">
      <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
      <el-amap
        :center="mapCenter"
        :map-style="mapStyle"
        :zoom="15"
        class="amap-demo"
        resize-enable
        vid="amapDemo"
      >
        <el-amap-marker
          v-for="(marker, i) in markers"
          :key="i"
          :position="marker"
        />
      </el-amap>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VabAMap',
    data: function () {
      return {
        markers: [
          // [121.59996, 31.197646],
          // [121.40018, 31.197622],
          // [121.69991, 31.207649]
        ],
        searchOption: {
          city: '武汉',
          citylimit: true,
        },
        mapCenter: [121.59996, 31.197646],
        mapStyle: 'amap://styles/dark',
      }
    },
    mounted() {
      VueAMap.initAMapApiLoader({
        // 高德key
        key: 'd7bb98e7185300250dd5f918c12f484b',
        // 插件集合 （插件按需引入）
        plugin: ['AMap.Geolocation'],
      })
    },
    methods: {
      onSearchResult(pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach((poi) => {
            let {
              lng,
              lat,
            } = poi
            lngSum += lng
            latSum += lat
            this.markers.push([poi.lng, poi.lat])
          })
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length,
          }
          this.mapCenter = [center.lng, center.lat]
        }
      },
    },
  }
</script>

<style>
  .amap-demo {
    width: 100%;
    height: 100%;
  }

  .search-box {
    position: absolute !important;
    top: 10px;
    left: 20px;
  }

  .amap-page-container {
    position: relative;
    width: 100%;
    height: 600px;
  }
</style>
