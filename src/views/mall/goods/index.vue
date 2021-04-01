<template>
  <div class="goods-container">
    <el-alert
      :closable="false"
      show-icon
      title="物料商城物料由第三方提供，vue-admin-beautiful作者不提供技术支持，不对物料质量负责，每一位开发者都可以联系作者提供优质的第三方物料，经过审核后可上线物料市场。"
      type="success"
    />
    <vab-query-form>
      <vab-query-form-right-panel :span="24">
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :lg="8"
        :md="8"
        :sm="8"
        :xl="6"
        :xs="24"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="hover"
          @click.native="handleBuy"
        >
          <div class="goods-card-body">
            <div class="goods-tag-group">
              <el-tag hit>{{ item.company }}</el-tag>
            </div>
            <div class="goods-image-group">
              <div class="goods-image">
                <vab-icon v-if="item.icon" :icon="item.icon" />
                <el-image
                  v-if="item.image || item.svg"
                  :class="{ isSvg: item.svg }"
                  :src="item.image || item.svg"
                />
              </div>
            </div>
            <div class="goods-title">{{ item.title }}</div>
            <div class="goods-price">
              <el-tag hit type="warning">{{ item.price }}</el-tag>
              <el-tag v-for="label in item.label" :key="label" hit>
                {{ label }}
              </el-tag>
            </div>
            <div class="goods-detail">
              <a
                :href="item.url + '?hmsr=dgiot&hmpl=&hmcu=&hmkw=&hmci='"
                target="_blank"
              >
                <el-button type="text">查看详情</el-button>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/goods'

  export default {
    name: 'Goods',
    components: {},
    data() {
      return {
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
        },
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleBuy() {},
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        this.total = totalCount
      },
    },
  }
</script>

<style lang="scss" scoped>
  .goods-container {
    .goods-card-body {
      position: relative;
      padding: $base-padding;
      cursor: pointer;

      .goods-tag-group {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 9;
        padding: $base-padding * 1.5;
      }

      .goods-image-group {
        height: 200px;
        overflow: hidden;
        background: linear-gradient(to right, #0f2027, #203a43, #2c5364);

        .goods-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 200px;

          .isSvg {
            padding: 100px;
          }

          i {
            font-size: 100px;
            color: $base-color-white;
          }

          transition: all ease-in-out 0.3s;

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .goods-title {
        margin: $base-margin 0 8px 0;
        overflow: hidden;
        font-size: 16px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .goods-price {
        margin: 15px 0 0;
        overflow: hidden;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;

        s {
          color: #c5c8ce;
        }
      }

      .goods-detail {
        float: right;
        margin-bottom: $base-margin - 9px;
      }
    }
  }
</style>
