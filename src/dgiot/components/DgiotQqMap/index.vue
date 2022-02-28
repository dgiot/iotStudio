<template>
  <dgiot-qq-map-select-point
    :mapcenter="centerLatLng"
    :oldmarker="oldMarker"
    :toolbar="toolbar"
    :zoom="zoom"
    @mapclick="pointChange"
  />
</template>

<script>
  import DgiotQqMapSelectPoint from './components/DgiotQqMapSelectPoint'

  export default {
    name: 'DgiotQqMap',
    components: {
      DgiotQqMapSelectPoint,
    },
    props: {
      list: {
        type: Object,
        default: function () {
          return {
            address: null,
            longitude: null,
            latitude: null,
            toolbar: false,
            zoom: 9,
          }
        },
      },
    },
    data: function () {
      return {
        pointName: '郑州',
        qqmap: null,
        toolbar: false,
        centerLatLng: '34.759666,113.648071',
        oldMarker: '34.759666,113.648071',
        newMarker: null,
        zoom: 9,
      }
    },
    watch: {
      list(val, a) {
        this.toolbar = val.toolbar
        this.zoom = val.zoom
        this.centerLatLng = '' + val.latitude + ',' + val.longitude
        this.oldMarker = '' + val.latitude + ',' + val.longitude
      },
    },
    created() {
      this.centerLatLng =
        this.list.latitude > 0
          ? '' + this.list.latitude + ',' + this.list.longitude
          : '34.759666,113.648071'
      this.oldMarker =
        this.list.latitude > 0
          ? '' + this.list.latitude + ',' + this.list.longitude
          : '34.759666,113.648071'
      console.log(this.list, '34.759666,113.648071')
    },
    methods: {
      // mapMsg
      pointChange(ev) {
        if (ev) {
          this.$dgiotBus.$emit(`qqMapClcik`, ev)
        }
      },
    },
  }
</script>
