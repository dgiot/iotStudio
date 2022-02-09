<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
    <input
      ref="uploader"
      accept="zip"
      style="display: none"
      type="file"
      @change="doUpload($event)"
    />
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :border="border"
      :data="list"
      :height="height"
      :size="lineHeight"
      :stripe="stripe"
    >
      <el-table-column
        align="center"
        label="className"
        prop="className"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        label="fields"
        show-overflow-tooltip
        sortable
      >
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
            <vab-json-editor
              v-if="row.fields"
              v-model="row.fields"
              lang="zh"
              :mode="'code'"
            />
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">fields</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button
            size="mini"
            type="success"
            @click="handleExport('export', row)"
          >
            {{ $translateTitle('product.export') }}
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleExport('import', row)"
          >
            {{ $translateTitle('product.import') }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-image
          class="vab-data-empty"
          :src="
            require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
          "
        />
      </template>
    </el-table>
  </div>
</template>

<script>
  import { getTable } from '@/api/Dba'
  import { ExportParse, ImportParse } from '@/api/Export'

  export default {
    name: 'Parse',
    components: {},
    data() {
      return {
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0) + 100,
        stripe: false,
        lineHeight: 'medium',
        list: [],
        listLoading: true,
        parseFile: '',
        parseClass: '',
      }
    },
    computed: {},
    mounted() {
      this.fetchData()
    },
    created() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      async handleExport(type, row) {
        const { className } = row
        this.parseClass = className
        if (type == 'export') {
          const loading = this.$baseColorfullLoading(2)
          try {
            const res = await ExportParse(this.parseClass, {})
            loading.close()
            this.$convertRes2Blob(res)
            // this.$message.success(`${res}`)
          } catch (error) {
            loading.close()
            this.$message.error(`${error}`)
          }
          loading.close()
        } else {
          this.$refs.uploader.click()
        }
        dgiotlog.log(type, row)
      },
      async doUpload(event) {
        this.parseFile = event.target.files[0]
        const loading = this.$baseColorfullLoading(3)
        try {
          const res = await ImportParse(this.parseClass, this.parseFile)
          loading.close()
          dgiotlog.log('eresresrror', res)
          this.$message.success(``)
        } catch (error) {
          loading.close()
          dgiotlog.log('error', error)
          this.$message.error(`${error}`)
        }
      },
      async fetchData() {
        this.listLoading = true
        const { results = [] } = await getTable()
        this.list = results
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
