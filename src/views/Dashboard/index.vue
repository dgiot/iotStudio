<template>
  <div class="dashboard-container">
    <div class="main">
      <!--      <a-tabs class="tabs" default-active-key="iframe">-->
      <!--        <a-tab-pane key="iframe" :tab="$translateTitle('leftbar.monitor')">-->
      <!--          -->
      <!--        </a-tab-pane>-->
      <!--                <a-tab-pane-->
      <!--                  key="chart"-->
      <!--                  force-render-->
      <!--                  :tab="$translateTitle('equipment.chart')"-->
      <!--                >-->
      <!--                  <empty />-->
      <!--                </a-tab-pane>-->
      <!--      </a-tabs>-->
      <iframe
        v-show="dashboardrul != '' && dashboardrul"
        id="iframe"
        class="iframe"
        frameborder="0"
        height="780"
        width="100%"
      />
    </div>
  </div>
</template>

<script>
  import empty from '@/views/DeviceCloud/empty'

  export default {
    name: 'Dashboard',
    components: {
      empty,
    },
    data() {
      return {
        currentRole: 'admindashboard',
        isshow: 0,
        childshow: 0,
        form: {
          date1: '',
          date2: '',
        },
        refresh: '',
        dashboardrul: 'http://192.168.1.122:3000/',
        timerefesh: {
          val1: '15s',
          val2: '30s',
          val3: '60s',
        },
        categoryIndex: 0,
      }
    },
    computed: {},
    mounted() {
      this.getdashboard()
    },
    methods: {
      getdashboard() {
        if (process.env.NODE_ENV != 'development') {
          this.dashboardrul =
            location.protocol + '//' + location.hostname + ':3000'
        }
        var dashboard = document.getElementById('iframe')
        dashboard.setAttribute('src', this.dashboardrul)
        // if (
        //   sessionStorage.getItem('dashboard') != '' &&
        //   sessionStorage.getItem('dashboard') != 'undefined'
        // ) {
        //   this.dashboardrul = sessionStorage.getItem('dashboard')
        //   dashboard.setAttribute('src', this.dashboardrul)
        // } else {
        //   this.dashboardrul = false
        // }
      },
      selectval(val, index) {
        var test = /(refresh=[^&]+)/
        this.dashboardrul = this.dashboardrul.replace(test, 'refresh=' + val)
        this.categoryIndex = index
      },
    },
  }
</script>
<style lang="scss" scope>
  .dashboard-container {
    main {
      position: relative;
      top: 20px;
      height: 100vh;
      margin: 0 auto;
      text-align: center;
      //background: rgb(29, 27, 27);
    }
  }
</style>
