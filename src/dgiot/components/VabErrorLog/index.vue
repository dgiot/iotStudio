<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      :value="errorLogs.length"
      @click.native="dialogTableVisible = true"
    >
      <dgiot-icon icon="bug-line" />
    </el-badge>

    <el-dialog
      :append-to-body="true"
      title="dgiot-dashboard异常捕获(温馨提示：错误必须解决)"
      :visible.sync="dialogTableVisible"
      width="70%"
    >
      <el-table border :data="errorLogs">
        <el-table-column
          align="center"
          label="报错路由"
          show-overflow-tooltip
          width="auto"
        >
          <template #default="{ row }">
            <a :href="row.url" target="_blank">
              <el-tag type="success">{{ row.url }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="错误信息"
          show-overflow-tooltip
          width="auto"
        >
          <template #default="{ row }">
            <el-tag type="danger">
              {{ decodeUnicode(row.err.message) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="错误详情" show-overflow-tooltip>
          <template #default="{ row }">
            <el-popover placement="top-start" trigger="click">
              {{ row.err.stack }}
              <template #reference>
                <el-button>查看</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="auto">
          <template #default="{ row }">
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="item.url + decodeUnicode(row.err.message)"
              target="_blank"
            >
              <el-button type="text">
                {{ item.title }}
              </el-button>
            </a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="issues反馈" width="auto">
          <template #default="{ row }">
            <el-button type="primary" @click="issues('github', row)">
              github
            </el-button>
            <el-button type="primary" @click="issues('gitee', row)">
              gitee
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click.native="dialogTableVisible = false">取 消</el-button>
        <el-button type="danger" @click.native="clearAll">暂不显示</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { abbreviation, title } from '@/config'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'VabErrorLog',
    data() {
      return {
        isShow: window.name != 'dgiot_iframe',
        dialogTableVisible: false,
        title,
        abbreviation,
        searchList: [
          {
            title: '百度搜索',
            url: 'https://www.baidu.com/baidu?wd=',
          },
          {
            title: '谷歌搜索',
            url: 'https://www.google.com/search?q=',
          },
          {
            title: 'Magi搜索',
            url: 'https://magi.com/search?q=',
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        errorLogs: 'errorLog/errorLogs',
      }),
    },
    methods: {
      ...mapActions({
        clearErrorLog: 'errorLog/clearErrorLog',
      }),
      /**
       * @Author: h7ml
       * @Date: 2021-12-15 20:17:40
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async issues(type, params) {
        const title = `%5BBug%20Report%5D%20${params.err.message}`
        try {
          type === 'github'
            ? window.open(
                `https://github.com/dgiot/dgiot/issues/new?assignees=h7ml&labels=bug&template=bug-report.md&title=${title}`
              )
            : window.open(
                `https://gitee.com/dgiiot/dgiot/issues/new?issue%5Bassignee_id%5D=0&issue%5Bmilestone_id%5D=0&assignees=h7ml&labels=bug&title=${title}`
              )
        } catch (error) {
          console.log(error)
        }
      },
      clearAll() {
        this.dialogTableVisible = false
        this.clearErrorLog()
      },
      decodeUnicode(str) {
        str = str.replace(/\\/g, '%')
        str = unescape(str)
        str = str.replace(/%/g, '\\')
        str = str.replace(/\\/g, '')
        return str
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-badge {
      .el-button {
        display: flex;
        align-items: center;
        justify-items: center;
        height: 28px;
      }
    }
  }
</style>
