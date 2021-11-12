<template>
  <span v-if="theme.showSearch">
    <vab-icon
      icon="search-line"
      @click.native="openDialog"
    />
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        :model="queryForm"
        @submit.native.prevent
      >
        <el-form-item label-width="0">
          <el-autocomplete
            v-model="queryForm.searchWord"
            v-focus
            :fetch-suggestions="querySearchAsync"
            select-when-unmatched
            @select="handleSelect"
          >
            <template #prefix><vab-icon icon="search-line" /></template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getList } from '@/api/Search'

  export default {
    name: 'VabSearch',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input')
            .focus()
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        queryForm: {
          searchWord: '',
        },
        restaurants: [],
        state: '',
        timeout: null,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    created() {
      this.$nextTick(() => {
        if (this.theme.showSearch) this.loadAll()
      })
    },
    methods: {
      openDialog() {
        this.queryForm.searchWord = ''
        this.dialogVisible = true
      },
      async loadAll() {
        const { data } = await getList()
        this.restaurants = data
      },
      querySearchAsync(queryString, cb) {
        let restaurants = this.restaurants
        let results = queryString
          ? restaurants.filter(this.createStateFilter(queryString))
          : restaurants
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 500)
      },
      createStateFilter(queryString) {
        return (state) => state.value.includes(queryString.toLowerCase())
      },
      handleSelect(item) {
        if (item.url) {
          window.open(item.url)
        } else {
          window.open(`https://www.baidu.com/s?wd=${item.value}`)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-dialog {
      &__header {
        display: none;
        border: 0 !important;
      }

      &__body {
        padding: 0;
        border: 0 !important;
      }

      .el-form-item__content {
        position: relative;

        i {
          position: absolute;
          top: 14px;
          left: $base-margin/1.5;
        }

        .el-autocomplete {
          width: 100%;

          .el-input__inner {
            width: 100%;
            height: 60px;
            padding-left: $base-padding * 2.5;
            border: 0 !important;
          }
        }
      }
    }
  }
</style>
