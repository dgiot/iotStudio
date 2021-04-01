<template>
  <div class="personal-center-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <el-card shadow="hover">
          <div class="personal-center-user-info">
            <el-avatar :size="100" :src="avatar" @click.native="openDialog" />
            <div class="personal-center-user-info-full-name">
              {{ form.fullName }}
            </div>
            <div class="personal-center-user-info-description">
              {{ form.description }}
            </div>
            <div class="personal-center-user-info-follow">
              <a href="https://github.com/chuzhixin" target="_blank">
                <el-button round type="primary">
                  <vab-icon icon="group-line" />
                  Follow me
                </el-button>
              </a>
            </div>

            <ul class="personal-center-user-info-list">
              <li>
                <vab-icon icon="user-3-line" />
                前端小白白
              </li>
              <li>
                <vab-icon icon="magic-line" />
                1992/8/11
              </li>
              <li>
                <vab-icon icon="women-line" />
                女
              </li>
              <li>
                <vab-icon icon="community-line" />
                VAB集团 - PRO事业群 - 菜鸟技术部
              </li>
              <li>
                <vab-icon icon="map-pin-2-line" />
                中国 • 汉东省 • 京州市
              </li>
              <li>
                <vab-icon icon="code-s-slash-line" />
                JavaScript、HTML、CSS、Vue、Node
              </li>
              <li>
                <el-divider />
                <h5>个性标签</h5>
                <el-tag size="small">腹黑</el-tag>
                <el-tag size="small">怕麻烦</el-tag>
                <el-tag size="small">小仙女</el-tag>
                <el-tag size="small">仙气飘飘</el-tag>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <el-card shadow="hover">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
              <el-col :lg="12" :md="16" :sm="24" :xl="12" :xs="24">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="姓名">
                    <el-input v-model="form.fullName" />
                  </el-form-item>
                  <el-form-item label="昵称">
                    <el-input v-model="form.nickname" />
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="form.sex" style="width: 100%">
                      <el-option :value="0" label="保密" />
                      <el-option :value="1" label="男" />
                      <el-option :value="2" label="女" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="个人简介">
                    <el-input v-model="form.description" type="textarea" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="账号绑定" name="second">
              <div class="personal-center-item">
                <vab-icon icon="qq-line" style="color: #3492ed" />
                <div class="personal-center-item-content">
                  <div>绑定QQ</div>
                  <div class="personal-center-item-content-second">
                    1204505056
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
              <div class="personal-center-item">
                <vab-icon icon="wechat-line" style="color: #4daf29" />
                <div class="personal-center-item-content">
                  <div>绑定微信</div>
                  <div class="personal-center-item-content-second">
                    当前未绑定绑定微信账号
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
              <div class="personal-center-item">
                <vab-icon icon="alipay-line" style="color: #1476fe" />
                <div class="personal-center-item-content">
                  <div>绑定支付宝</div>
                  <div class="personal-center-item-content-second">
                    当前未绑定绑定支付宝账号
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
              <div class="personal-center-item">
                <vab-icon icon="weibo-line" style="color: #ffd440" />
                <div class="personal-center-item-content">
                  <div>绑定微博</div>
                  <div class="personal-center-item-content-second">
                    当前未绑定绑定微博账号
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
              <div class="personal-center-item">
                <vab-icon icon="github-line" />
                <div class="personal-center-item-content">
                  <div>绑定Github</div>
                  <div class="personal-center-item-content-second">
                    当前未绑定绑定Github账号
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
              <div class="personal-center-item">
                <vab-icon icon="paypal-line" style="color: #012e85" />
                <div class="personal-center-item-content">
                  <div>绑定Paypal</div>
                  <div class="personal-center-item-content-second">
                    当前未绑定绑定Paypal账号
                  </div>
                </div>
                <el-link type="primary">更换绑定</el-link>
              </div>
              <el-divider />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <vab-cropper ref="vabCropper" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VabCropper from '@/extra/VabCropper'

  export default {
    name: 'PersonalCenter',
    components: { VabCropper },
    data() {
      return {
        activeName: 'second',
        form: {
          fullName: '楚芝馨',
          nickname: 'good luck',
          sex: 2,
          description: '富在术数，不在劳身；利在势居，不在力耕。',
        },
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
      }),
    },
    methods: {
      onSubmit() {
        this.$baseMessage(
          '模拟保存成功',
          'success',
          false,
          'vab-hey-message-success'
        )
      },
      openDialog() {
        this.$refs['vabCropper'].dialogVisible = true
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.personal-center';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;

    #{$base}-user-info {
      padding: $base-padding;
      text-align: center;

      ::v-deep {
        .el-avatar {
          img {
            cursor: pointer;
          }
        }
      }

      &-full-name {
        margin-top: 15px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
      }

      &-description {
        margin-top: 8px;
      }

      &-follow {
        margin-top: 15px;
      }

      &-list {
        margin-top: 18px;
        line-height: 30px;
        text-align: left;
        list-style: none;

        h5 {
          margin: -20px 0 5px 0;
        }

        ::v-deep {
          .el-tag {
            margin-right: 10px !important;
          }

          .el-tag + .el-tag {
            margin-left: 0;
          }
        }
      }
    }

    #{$base}-item {
      display: flex;

      i {
        font-size: 40px;
      }

      &-content {
        box-sizing: border-box;
        flex: 1;
        margin-left: $base-margin;

        &-second {
          margin-top: 8px;
        }
      }
    }
  }
</style>
