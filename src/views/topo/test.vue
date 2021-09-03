<template class="test">
  <div class="test-container">
    <div class="test-container-header">
      <el-badge :value="12" class="item">
        <el-button size="small">评论</el-button>
      </el-badge>
      <el-badge :value="3" class="item">
        <el-button size="small">回复</el-button>
      </el-badge>
      <el-badge :value="1" class="item" type="primary">
        <el-button size="small">评论</el-button>
      </el-badge>
      <el-badge :value="2" class="item" type="warning">
        <el-button size="small">回复</el-button>
      </el-badge>

      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          点我查看
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            评论
            <el-badge class="mark" :value="12" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            回复
            <el-badge class="mark" :value="3" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="test-container-content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="province" label="省份" width="120" />
        <el-table-column prop="city" label="市区" width="120" />
        <el-table-column prop="address" label="地址" width="300" />
        <el-table-column prop="zip" label="邮编" width="120" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">
              查看
            </el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="test-container-footer">
      <el-radio-group v-model="size">
        <el-radio label="">默认</el-radio>
        <el-radio label="medium">中等</el-radio>
        <el-radio label="small">小型</el-radio>
        <el-radio label="mini">超小</el-radio>
      </el-radio-group>

      <el-descriptions
        class="margin-top"
        title="带边框列表"
        :column="3"
        :size="size"
        border
      >
        <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          18100000000
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            居住地
          </template>
          苏州市
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            备注
          </template>
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          江苏省苏州市吴中区吴中大道 1188 号
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions
        class="margin-top"
        title="无边框列表"
        :column="3"
        :size="size"
      >
        <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template>
        <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
        <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
        <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">
          江苏省苏州市吴中区吴中大道 1188 号
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
<script>
  const tableData = [
    {
      date: '2016-05-02',
      name: '王小虎',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1518 弄',
      zip: 200333,
    },
    {
      date: '2016-05-04',
      name: '王小虎',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1517 弄',
      zip: 200333,
    },
    {
      date: '2016-05-01',
      name: '王小虎',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1519 弄',
      zip: 200333,
    },
    {
      date: '2016-05-03',
      name: '王小虎',
      province: '上海',
      city: '普陀区',
      address: '上海市普陀区金沙江路 1516 弄',
      zip: 200333,
    },
  ]
  export default {
    name: 'Test',
    data() {
      return {
        tableData: Object.freeze(tableData),
        size: '',
      }
    },
    created() {
      this.createdEle('https://unpkg.com/element-ui@2.15.6/lib/index.js')
    },
    mounted() {},
    methods: {
      createdEle(url) {
        /**
         * @document https://www.jianshu.com/p/8c56fdeef38a
         * @param url
         * @param callback
         */
        function loadJS(url, callback) {
          let script = document.createElement('script'),
            fn = callback || function () {}
          script.type = 'text/javascript'
          //IE
          if (script.readyState) {
            script.onreadystatechange = function () {
              if (
                script.readyState == 'loaded' ||
                script.readyState == 'complete'
              ) {
                script.onreadystatechange = null
                fn()
              }
            }
          } else {
            //其他浏览器
            script.onload = () => {
              fn()
            }
            script.onerror = () => {
              console.log('加载错误')
              fn()
            }
          }
          script.src = url
          document.getElementsByTagName('head')[0].appendChild(script)
        }

        loadJS(url)
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import 'https://unpkg.com/element-ui@2.15.6/lib/theme-chalk/tab-pane.css';

  .test {
    &-container {
      &-header {
        .item {
          margin-top: 10px;
          margin-right: 40px;
        }
      }

      &-content {
      }

      &-footer {
      }
    }
  }
</style>
