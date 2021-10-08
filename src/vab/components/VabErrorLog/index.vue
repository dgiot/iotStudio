<template>
  <div v-if="errorLogs.length > 0">
    <el-badge
      :value="errorLogs.length"
      @click.native="dialogTableVisible = true"
    >
      <vab-icon icon="bug-line" />
    </el-badge>

    <el-dialog
      :append-to-body="true"
      title="dgiot-dashboard异常捕获(温馨提示：错误必须解决)"
      :visible.sync="dialogTableVisible"
      width="70%"
    >
      <el-table border :data="errorLogs">
        <el-table-column label="报错路由">
          <template #default="{ row }">
            <a :href="row.url" target="_blank">
              <el-tag type="success">{{ row.url }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="错误信息">
          <template #default="{ row }">
            <el-tag type="danger">{{ decodeUnicode(row.err.message) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误详情" width="120">
          <template #default="{ row }">
            <el-popover placement="top-start" trigger="hover">
              {{ row.err.stack }}
              <template #reference>
                <el-button>查看</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380">
          <template #default="{ row }">
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="item.url + decodeUnicode(row.err.message)"
              target="_blank"
            >
              <el-button type="primary">
                {{ item.title }}
              </el-button>
            </a>
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
