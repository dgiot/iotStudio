<template>
  <div class="dashboard-container" style="background: #1d1b1b">
    <div
      style="
        position: relative;
        top: 20px;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        background: rgb(29, 27, 27);
      "
    >
      <iframe
        v-show="dashboardrul != '' && dashboardrul"
        id="ifream"
        width="100%"
        height="800"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { setTimeout } from 'timers'
  // import adminDashboard from './admin'

  export default {
    name: 'Dashboard',
    data() {
      return {
        currentRole: 'adminDashboard',
        isshow: 0,
        childshow: 0,
        form: {
          date1: '',
          date2: '',
        },
        refresh: '',
        dashboardrul: 'http://47.105.106.54:3000/',
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
      this.getDashboard()
    },
    methods: {
      getDashboard() {
        if (process.env.NODE_ENV != 'development') {
          this.dashboardrul =
            location.protocol + '//' + location.hostname + ':3000'
        }
        var dashboard = document.getElementById('ifream')
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
<style></style>
