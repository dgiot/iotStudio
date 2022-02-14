<template>
  <el-drawer
    append-to-body
    custom-class="vab-drawer"
    direction="rtl"
    size="280px"
    :title="$translateTitle('主题配置')"
    :visible.sync="drawerVisible"
  >
    <el-scrollbar class="theme-scrollbar">
      <div class="el-drawer__body">
        <el-form ref="form" label-position="left" :model="theme">
          <el-divider content-position="left">
            <dgiot-icon icon="settings-3-line" />
            {{ $translateTitle('常用设置') }}
          </el-divider>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ $translateTitle('布局') }}
                <el-tooltip
                  :content="
                    $translateTitle(
                      '布局配置仅在电脑视窗下生效，手机视窗时将默认锁定为纵向布局'
                    )
                  "
                  effect="dark"
                  placement="top"
                >
                  <dgiot-icon icon="question-line" />
                </el-tooltip>
              </label>
            </template>
            <el-select
              v-model="theme.layout"
              :disabled="device === 'mobile'"
              @click.native="setLayout(theme.layout)"
            >
              <el-option
                key="column"
                :label="$translateTitle('分栏')"
                value="column"
              />
              <el-option
                key="comprehensive"
                :label="$translateTitle('综合')"
                value="comprehensive"
              />
              <el-option
                key="vertical"
                :label="$translateTitle('纵向')"
                value="vertical"
              />
              <el-option
                key="horizontal"
                :label="$translateTitle('横向')"
                value="horizontal"
              />
              <el-option
                key="common"
                :label="$translateTitle('常规')"
                value="common"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('主题')">
            <el-select v-model="theme.themeName" @change="setTheme">
              <el-option
                key="default"
                :label="$translateTitle('默认')"
                value="default"
              />
              <el-option
                key="asian"
                :label="$translateTitle('亚运')"
                value="asian"
              />
              <el-option
                key="green"
                :label="$translateTitle('绿荫')"
                value="green"
              />
              <el-option
                key="white"
                :label="$translateTitle('纯白')"
                value="white"
              />

              <el-option
                key="blue-black"
                :label="$translateTitle('蓝黑')"
                value="blue-black"
              />
              <el-option
                key="blue-white"
                :label="$translateTitle('蓝白')"
                value="blue-white"
              />
              <el-option
                key="green-black"
                :label="$translateTitle('绿黑')"
                value="green-black"
              />
              <el-option
                key="green-white"
                :label="$translateTitle('绿白')"
                value="green-white"
              />
              <!-- 红黑、红白主题完成群文档任务免费获取 -->
              <el-option
                key="red-black"
                :label="$translateTitle('红黑')"
                value="red-black"
              />
              <el-option
                key="red-white"
                :label="$translateTitle('红白')"
                value="red-white"
              />
              <el-option
                key="ocean"
                :label="$translateTitle('渐变')"
                value="ocean"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('侧边栏图片切换')">
            <el-switch v-model="theme.pictureSwitch" @change="togglePic" />
          </el-form-item>
          <el-form-item :label="$translateTitle('标签')">
            <el-switch v-model="theme.showTabs" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ $translateTitle('标签图标') }}
                <el-tooltip
                  :content="$translateTitle('标签开启时生效')"
                  effect="dark"
                  placement="top"
                >
                  <dgiot-icon icon="question-line" />
                </el-tooltip>
              </label>
            </template>
            <el-switch
              v-model="theme.showTabsBarIcon"
              :disabled="!theme.showTabs"
            />
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ $translateTitle('标签风格') }}
                <el-tooltip
                  :content="$translateTitle('标签开启时生效')"
                  effect="dark"
                  placement="top"
                >
                  <dgiot-icon icon="question-line" />
                </el-tooltip>
              </label>
            </template>
            <el-select v-model="theme.tabsBarStyle" :disabled="!theme.showTabs">
              <el-option
                key="card"
                :label="$translateTitle('卡片')"
                value="card"
              />
              <el-option
                key="smart"
                :label="$translateTitle('灵动')"
                value="smart"
              />
              <el-option
                key="smooth"
                :label="$translateTitle('圆滑')"
                value="smooth"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label>
              <label class="el-form-item__label">
                {{ $translateTitle('分栏风格') }}
                <el-tooltip
                  :content="$translateTitle('分栏布局时生效')"
                  effect="dark"
                  placement="top"
                >
                  <dgiot-icon icon="question-line" />
                </el-tooltip>
              </label>
            </template>
            <el-select
              v-model="theme.columnStyle"
              :disabled="theme.layout !== 'column'"
            >
              <el-option
                key="vertical"
                :label="$translateTitle('纵向')"
                value="vertical"
              />
              <el-option
                key="horizontal"
                :label="$translateTitle('横向')"
                value="horizontal"
              />
              <el-option
                key="card"
                :label="$translateTitle('卡片')"
                value="card"
              />
            </el-select>
          </el-form-item>
          <el-divider content-position="left" style="margin-top: 20px">
            <dgiot-icon icon="settings-3-line" />
            {{ $translateTitle('其它设置') }}
          </el-divider>
          <el-form-item :label="$translateTitle('头部固定')">
            <el-switch
              v-model="theme.fixedHeader"
              :disabled="theme.layout === 'common'"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('国际化')">
            <el-switch v-model="theme.showLanguage" />
          </el-form-item>
          <el-form-item :label="$translateTitle('进度条')">
            <el-switch v-model="theme.showProgressBar" />
          </el-form-item>
          <el-form-item :label="$translateTitle('刷新')">
            <el-switch v-model="theme.showRefresh" />
          </el-form-item>
          <el-form-item :label="$translateTitle('搜索')">
            <el-switch v-model="theme.showSearch" />
          </el-form-item>
          <el-form-item :label="$translateTitle('通知')">
            <el-switch v-model="theme.showNotice" />
          </el-form-item>
          <el-form-item :label="$translateTitle('全屏')">
            <el-switch v-model="theme.showFullScreen" />
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="el-drawer__footer">
      <el-button type="primary" @click.native="handleSaveTheme(theme)">
        {{ $translateTitle('保存') }}
      </el-button>
      <el-button @click.native="setDefaultTheme">
        {{ $translateTitle('恢复默认') }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { putUser } from '@/api/User'

  export default {
    name: 'VabThemeDrawer',
    data() {
      return {
        drawerVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        pictureSwitch: 'settings/pictureSwitch',
        theme: 'settings/theme',
        device: 'settings/device',
        _pcimg: 'dashboard/_pcimg',
        _mimg: 'dashboard/_mimg',
        objectId: 'user/objectId',
        tag: 'settings/tag',
      }),
    },
    watch: {
      theme: {
        handler(theme) {
          const { showTabs = false, themeName } = theme
          console.log(theme, showTabs, 'theme')
          if (themeName == 'asian') {
            $('.vab-tabs').css('border', '0')
            $('.vab-tabs').css('background-color', '#282c34')
          } else
            $('.vab-tabs').css('background-color', 'calc(100vh - 60px * 1)')
          if (showTabs) {
            $('section').css('section', '#282c34')
          }
        },
        deep: true,
        immediate: true,
      },
    },
    created() {
      this.$dgiotBus.$on('theme', () => {
        this.handleOpenTheme()
      })
      this.$dgiotBus.$on('random-theme', () => {
        this.randomTheme()
      })
      this.setTheme()
    },
    mounted() {},
    methods: {
      ...mapActions({
        saveTheme: 'settings/saveTheme',
        setTag: 'settings/setTag',
        resetTheme: 'settings/resetTheme',
        togglePicture: 'settings/togglePicture',
        setLayout: 'settings/setLayout',
      }),
      togglePic(e) {
        this.togglePicture(e)
      },
      handleOpenTheme() {
        this.drawerVisible = true
      },
      async setDefaultTheme() {
        await this.resetTheme()
        this.drawerVisible = false
      },
      async handleSaveTheme(theme) {
        this.setTag(_.merge(this.tag, { theme: theme }))
        const params = {
          tag: this.tag,
        }
        await putUser(this.objectId, params)
          .then((res) => {
            dgiotlog.log(res)
            this.$message.success(
              this.$translateTitle(
                'title.Theme configuration saved successfully'
              )
            )
          })
          .catch((e) => {
            dgiotlog.log(e)
            this.$message.success(
              this.$translateTitle(
                'title.Theme configuration saved error' + e.error
              )
            )
          })
        await this.saveTheme(theme)
        this.drawerVisible = false
      },
      async randomTheme() {
        const loading = this.$baseColorfullLoading(0)
        // 随机换肤重置移除主题，防止代码更新影响样式
        await this.resetTheme()
        const themeNameArray = [
          'default',
          'asian',
          'green',
          'white',
          'blue-black',
          'blue-white',
          'green-black',
          'green-white',
          'red-black',
          'red-white',
          'ocean',
        ]
        this.theme.themeName = _.sample(
          _.pull(themeNameArray, [this.theme.themeName])
        )
        const columnStyleArray = ['vertical', 'horizontal', 'card']
        this.theme.columnStyle = _.sample(
          _.pull(columnStyleArray, [this.theme.columnStyle])
        )
        const tabsBarStyleArray = ['card', 'smart', 'smooth']
        this.theme.tabsBarStyle = _.sample(
          _.pull(tabsBarStyleArray, [this.theme.tabsBarStyle])
        )
        const showTabsBarIconArray = [true, false]
        this.theme.showTabsBarIcon = _.sample(
          _.pull(showTabsBarIconArray, [this.theme.showTabsBarIcon])
        )
        if (this.device === 'desktop') {
          const layoutArray = [
            'column',
            'comprehensive',
            'vertical',
            'horizontal',
            'common',
          ]
          this.theme.layout = _.sample(_.pull(layoutArray, [this.theme.layout]))
        } else {
          this.theme.layout = 'vertical'
        }
        await this.setTheme()
        await this.saveTheme(this.theme)
        setTimeout(() => {
          loading.close()
        }, 1000)
      },
      setTheme() {
        document.getElementsByTagName(
          'body'
        )[0].className = `vab-theme-${this.theme.themeName}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .theme-scrollbar {
    height: calc(100vh - 118px) !important;
    overflow: hidden;
  }
</style>
<style lang="scss">
  .vab-drawer {
    .el-drawer__header {
      margin-bottom: $base-margin;
    }

    .el-drawer__body {
      padding: 0 $base-padding/2 $base-padding/2 $base-padding/2;

      .el-divider--horizontal {
        margin: 28px 0 28px 0;
      }

      .el-form-item {
        display: flex;
        align-items: center;

        .el-form-item__label {
          flex: 1 1;
        }

        .el-form-item__content {
          flex: 0 0 auto;
        }
      }

      .el-form-item--small.el-form-item {
        .el-input__inner {
          width: 115px;
        }
      }
    }

    .el-drawer__footer {
      padding: $base-padding/2;
      border-top: 1px solid $base-border-color;
    }
  }
</style>
