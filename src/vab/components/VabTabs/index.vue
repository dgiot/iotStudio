<template>
  <div class="vab-tabs">
    <vab-fold v-if="layout === 'common'" />
    <el-tabs
      v-model="tabActive"
      class="vab-tabs-content"
      :class="{
        ['vab-tabs-content-' + theme.tabsBarStyle]: true,
      }"
      type="card"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :closable="!isNoClosable(item)"
        :name="item.path"
      >
        <span
          slot="label"
          style="display: inline-block"
          @contextmenu.prevent="openMenu($event, item)"
        >
          <template v-if="theme.showTabsBarIcon">
            <el-image
              v-if="item.meta.icon && item.meta.icon.includes('dgiot')"
              :alt="$FileServe"
              :src="$FileServe + item.meta.icon"
              style="width: 16px; height: 16px"
            >
              <img
                slot="error"
                :src="$FileServe + item.meta.icon"
                style="width: 16px; height: 16px"
                :title="$FileServe + item.meta.icon"
              />
            </el-image>
            <vab-icon
              v-else-if="!item.meta.icon.includes('dgiot')"
              :icon="item.meta.icon"
              :is-custom-svg="item.meta.isCustomSvg"
            />
            <!--  如果没有图标那么取第二级的图标 -->
            <vab-icon v-else :icon="item.parentIcon" />
          </template>
          <span>{{ $translateTitle(`route.${item.meta.title}`) }}</span>
        </span>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
      <span class="vab-tabs-more" :class="{ 'vab-tabs-more-active': active }">
        <span class="vab-tabs-more-icon">
          <i class="box box-t"></i>
          <i class="box box-b"></i>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="closeOthersTabs">
            <vab-icon icon="close-line" />
            <span>
              {{ $translateTitle('关闭其他') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeLeftTabs">
            <vab-icon icon="arrow-left-line" />
            <span>
              {{ $translateTitle('关闭左侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeRightTabs">
            <vab-icon icon="arrow-right-line" />
            <span>
              {{ $translateTitle('关闭右侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAllTabs">
            <vab-icon icon="close-line" />
            <span>
              {{ $translateTitle('关闭全部') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul
      v-if="visible"
      class="contextmenu el-dropdown-menu el-dropdown-menu--small"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': visitedRoutes.length === 1 }"
        @click="closeOthersTabs"
      >
        <vab-icon icon="close-line" />
        <span>{{ $translateTitle('关闭其他') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': !visitedRoutes.indexOf(hoverRoute) }"
        @click="closeLeftTabs"
      >
        <vab-icon icon="arrow-left-line" />
        <span>{{ $translateTitle('关闭左侧') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{
          'is-disabled':
            visitedRoutes.indexOf(hoverRoute) === visitedRoutes.length - 1,
        }"
        @click="closeRightTabs"
      >
        <vab-icon icon="arrow-right-line" />
        <span>{{ $translateTitle('关闭右侧') }}</span>
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTabs">
        <vab-icon icon="close-line" />
        <span>{{ $translateTitle('关闭全部') }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { handleActivePath } from '@/utils/routes'

  export default {
    name: 'VabTabs',
    props: {
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        tabActive: '',
        active: false,
        visible: false,
        top: 0,
        left: 0,
        hoverRoute: null,
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabs/visitedRoutes',
        routes: 'routes/routes',
        theme: 'settings/theme',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.$nextTick(() => {
            this.addTabs(route)
          })
        },
        immediate: true,
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      },
    },
    created() {
      this.initNoClosableTabs(this.routes)
    },
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        delVisitedRoute: 'tabs/delVisitedRoute',
        delOthersVisitedRoutes: 'tabs/delOthersVisitedRoutes',
        delLeftVisitedRoutes: 'tabs/delLeftVisitedRoutes',
        delRightVisitedRoutes: 'tabs/delRightVisitedRoutes',
        delAllVisitedRoutes: 'tabs/delAllVisitedRoutes',
      }),
      handleTabClick(tab) {
        if (!this.isActive(tab.name)) {
          this.$router.push(this.visitedRoutes[tab.index])
        }
      },
      handleVisibleChange(val) {
        this.active = val
      },
      initNoClosableTabs(routes) {
        routes.forEach((route) => {
          if (route.meta && route.meta.noClosable) this.addTabs(route, true)
          if (route.children) this.initNoClosableTabs(route.children)
        })
      },
      /**
       * 添加标签页
       * @param tag route
       * @param init 是否是从router获取路由
       * @returns {Promise<void>}
       */
      async addTabs(tag, init = false) {
        let parentIcon = ''
        if (tag.matched && tag.matched.length > 1) {
          parentIcon = tag.matched[1].meta.icon
        }
        if (tag.name && tag.meta && tag.meta.tabHidden !== true) {
          const path = handleActivePath(tag, true)
          await this.addVisitedRoute({
            path: path,
            query: tag.query,
            params: tag.params,
            name: tag.name,
            matched: init ? [tag.name] : tag.matched.map((item) => item.name),
            parentIcon,
            meta: { ...tag.meta },
          })
          this.tabActive = path
        }
      },
      /**
       * 根据原生路径删除标签中的标签
       * @param rawPath 原生路径
       * @returns {Promise<void>}
       */
      async handleTabRemove(rawPath) {
        await this.delVisitedRoute(rawPath)
        if (this.isActive(rawPath)) this.toLastTab()
      },
      handleCommand(command) {
        switch (command) {
          case 'closeOthersTabs':
            this.closeOthersTabs()
            break
          case 'closeLeftTabs':
            this.closeLeftTabs()
            break
          case 'closeRightTabs':
            this.closeRightTabs()
            break
          case 'closeAllTabs':
            this.closeAllTabs()
            break
        }
      },
      /**
       * 删除其他标签页
       * @returns {Promise<void>}
       */
      async closeOthersTabs() {
        if (this.hoverRoute) {
          await this.$router.push(this.hoverRoute)
          await this.delOthersVisitedRoutes(this.hoverRoute.path)
        } else {
          await this.delOthersVisitedRoutes(handleActivePath(this.$route, true))
        }
        await this.closeMenu()
      },
      /**
       * 删除左侧标签页
       * @returns {Promise<void>}
       */
      async closeLeftTabs() {
        if (this.hoverRoute) {
          await this.$router.push(this.hoverRoute)
          await this.delLeftVisitedRoutes(this.hoverRoute.path)
        } else {
          await this.delLeftVisitedRoutes(handleActivePath(this.$route, true))
        }
        await this.closeMenu()
      },
      /**
       * 删除右侧标签页
       * @returns {Promise<void>}
       */
      async closeRightTabs() {
        if (this.hoverRoute) {
          await this.$router.push(this.hoverRoute)
          await this.delRightVisitedRoutes(this.hoverRoute.path)
        } else {
          await this.delRightVisitedRoutes(handleActivePath(this.$route, true))
        }
        await this.closeMenu()
      },
      /**
       * 删除所有标签页
       * @returns {Promise<void>}
       */
      async closeAllTabs() {
        await this.delAllVisitedRoutes()
        this.toLastTab()
        await this.closeMenu()
      },
      /**
       * 跳转最后一个标签页
       */
      toLastTab() {
        const latestView = this.visitedRoutes.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView)
        } else {
          this.$router.push('/')
        }
      },
      isActive(path) {
        return path === handleActivePath(this.$route, true)
      },
      isNoClosable(tag) {
        return tag.meta && tag.meta.noClosable
      },
      openMenu(e, item) {
        const offsetLeft = this.$el.getBoundingClientRect().left
        const offsetWidth = this.$el.offsetWidth
        const maxLeft = Math.round(offsetWidth)
        const left = Math.round(e.clientX - offsetLeft)
        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }
        this.top = Math.round(e.clientY - 80)
        this.hoverRoute = item
        this.hoverRoute.fullPath = item.path
        this.visible = true
      },
      closeMenu() {
        this.visible = false
        this.hoverRoute = null
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-tabs {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    min-height: $base-tabs-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;
    background: $base-color-white;
    border-top: 1px solid #f6f6f6;

    ::v-deep {
      .fold-unfold {
        margin-right: $base-margin;
      }

      [class*='ri'] {
        margin-right: 3px;
      }
    }

    &-content {
      width: calc(100% - 40px);

      &-card {
        height: $base-tag-item-height;

        ::v-deep {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height;
            line-height: $base-tag-item-height;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              box-sizing: border-box;
              height: $base-tag-item-height;
              margin-right: 5px;
              line-height: $base-tag-item-height;
              border: 1px solid $base-border-color;
              border-radius: $base-border-radius;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

              &.is-active {
                color: $base-color-blue;
                background: mix($base-color-white, $base-color-blue, 90%);
                border: 1px solid $base-color-blue;
                outline: none;
              }

              &:hover {
                border: 1px solid $base-color-blue;
              }
            }
          }
        }
      }

      &-smart {
        height: $base-tag-item-height;

        ::v-deep {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height;
            line-height: $base-tag-item-height;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              height: $base-tag-item-height;
              margin-right: 5px;
              line-height: $base-tag-item-height;
              border: 0;
              outline: none;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

              &.is-active {
                background: mix($base-color-white, $base-color-blue, 90%);
                outline: none;

                &:after {
                  width: 100%;
                  transition: $base-transition;
                }
              }

              &:after {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                content: '';
                background-color: $base-color-blue;
                transition: $base-transition;
              }

              &:hover {
                background: mix($base-color-white, $base-color-blue, 90%);

                &:after {
                  width: 100%;
                  transition: $base-transition;
                }
              }
            }
          }
        }
      }

      &-smooth {
        height: $base-tag-item-height + 4;

        ::v-deep {
          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            height: $base-tag-item-height + 4;
            line-height: $base-tag-item-height + 4;
          }

          .el-tabs__header {
            border-bottom: 0;

            .el-tabs__nav {
              border: 0;
            }

            .el-tabs__item {
              height: $base-tag-item-height + 4;
              padding: 0 30px 0 30px;
              margin-top: ($base-tabs-height - $base-tag-item-height - 4)/2;
              margin-right: -18px;
              line-height: $base-tag-item-height + 4;
              text-align: center;
              border: 0;
              outline: none;
              transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

              &.is-active {
                padding: 0 30px 0 30px;
                color: $base-color-blue;
                background: mix($base-color-white, $base-color-blue, 90%);
                outline: none;
                mask: url('https://i.loli.net/2021/03/18/8wcQdYyPSxrgzvl.png');
                mask-size: 100% 100%;

                &:hover {
                  padding: 0 30px 0 30px;
                  color: $base-color-blue;
                  background: mix($base-color-white, $base-color-blue, 90%);
                  mask: url('https://i.loli.net/2021/03/18/8wcQdYyPSxrgzvl.png');
                  mask-size: 100% 100%;
                }
              }

              &:hover {
                padding: 0 30px 0 30px;
                color: $base-color-black;
                background: #dee1e6;
                mask: url('https://i.loli.net/2021/03/18/8wcQdYyPSxrgzvl.png');
                mask-size: 100% 100%;
              }
            }
          }
        }
      }
    }

    .contextmenu {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }

    &-more {
      position: relative;

      &-active,
      &:hover {
        &:after {
          position: absolute;
          bottom: -1px;
          left: 0;
          height: 0;
          content: '';
        }

        .vab-tabs-more-icon {
          transform: rotate(90deg);

          .box-t {
            &:before {
              transform: rotate(45deg);
            }
          }

          .box:before,
          .box:after {
            background: $base-color-blue;
          }
        }
      }

      &-icon {
        display: inline-block;
        color: #9a9a9a;
        cursor: pointer;
        transition: transform 0.3s ease-out;

        .box {
          position: relative;
          display: block;
          width: 14px;
          height: 8px;

          &:before {
            position: absolute;
            top: 0;
            left: 0px;
            width: 6px;
            height: 6px;
            content: '';
            background: #9a9a9a;
          }

          &:after {
            position: absolute;
            top: 0;
            left: 8px;
            width: 6px;
            height: 6px;
            content: '';
            background: #9a9a9a;
          }
        }

        .box-t {
          &:before {
            transition: transform 0.3s ease-out 0.3s;
          }
        }
      }
    }
  }
</style>
