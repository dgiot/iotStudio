<template>
  <div
    ref="custom-table"
    class="custom-table-container"
    :class="{ 'vab-fullscreen': isFullscreen }"
  >
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
        sortable
        show-overflow-tooltip
        label="className"
        prop="className"
      />
      <el-table-column
        align="center"
        sortable
        show-overflow-tooltip
        label="fields"
      >
        <template #default="{ row }">
          <el-popover trigger="hover" placement="top">
            <vab-json-editor
              v-if="row.fields"
              v-model="row.fields"
              :mode="'code'"
              lang="zh"
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
            tsize="mini"
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
          src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/empty_images/data_empty.png"
        />
      </template>
    </el-table>
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/Mock/table'
  import { getTable } from '@/api/Dba'
  export default {
    name: 'Parse',
    components: {},
    data() {
      return {
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(0),
        stripe: false,
        lineHeight: 'medium',
        list: [],
        listLoading: true,
      }
    },
    computed: {},
    mounted() {},
    created() {
      this.fetchData()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      handleExport(type, row) {
        console.log(type, row)
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
