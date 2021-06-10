<template>
  <div class="dashboard-container" style="background: #1d1b1b">
    <div
      v-show="dashboardrul != '' && dashboardrul"
      class="variable"
      style="
        position: relative;
        top: 20px;
        box-sizing: border-box;
        padding-left: 20px;
        text-align: left;
      "
    >
      <el-button-group>
        <el-button
          :class="{ active: categoryIndex == 1 }"
          type="info"
          size="mini"
          @click="selectval(timerefesh.val1, 1)"
        >
          {{ timerefesh.val1 }}
        </el-button>
        <el-button
          :class="{ active: categoryIndex == 2 }"
          type="info"
          size="mini"
          @click="selectval(timerefesh.val2, 2)"
        >
          {{ timerefesh.val2 }}
        </el-button>
        <el-button
          :class="{ active: categoryIndex == 3 }"
          type="info"
          size="mini"
          @click="selectval(timerefesh.val3, 3)"
        >
          {{ timerefesh.val3 }}
        </el-button>
      </el-button-group>
    </div>
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
        dashboardrul: '',
        timerefesh: {
          val1: '15s',
          val2: '30s',
          val3: '60s',
        },
        categoryIndex: 0,
      }
    },
    computed: {
      ...mapGetters(['roles']),
    },
    mounted() {
      this.getDashboard()
    },
    methods: {
      getDashboard() {
        var dashboard = document.getElementById('ifream')

        if (
          sessionStorage.getItem('dashboard') != '' &&
          sessionStorage.getItem('dashboard') != 'undefined'
        ) {
          this.dashboardrul = sessionStorage.getItem('dashboard')
          dashboard.setAttribute('src', this.dashboardrul)
        } else {
          this.dashboardrul = false
        }
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
