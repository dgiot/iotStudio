<template>
  <div class="editor-tool-bar">
    <div class="editor-toolbar-left">
      <ul>
        <li @click="handleSelect('undo')">
          <i class="fa fa-undo" title="撤销"></i>
        </li>
        <li @click="handleSelect('repeat')">
          <i class="fa fa-repeat" title="重做"></i>
        </li>
        <li class="disable">|</li>

        <!--         <li @click="handleSelect('random')"><i class="fa fa-random" title="跳转"></i></li>-->
        <li @click="handleSelect('number')">
          <i class="fa fa-outdent" title="行号"></i>
        </li>
        <li title="字体">
          <span
            @click="
              closeOpen()
              isOpenSize = true
            "
          >
            <i class="fa fa-font"></i>
            <i class="fa fa-caret-down"></i>
          </span>
          <ol v-if="isOpenSize" class="font-size-warp">
            <li
              v-for="(item, i) in fontSize"
              :key="'fs' + i"
              :class="{ active: size * 1 === item }"
              @click="handleFontSize(item)"
            >
              {{ item }}px
            </li>
          </ol>
        </li>
        <li title="主题">
          <span
            @click="
              closeOpen()
              isOpenTheme = true
            "
          >
            <i class="fa fa-magic"></i>
            <i class="fa fa-caret-down"></i>
          </span>
          <ol v-if="isOpenTheme" class="theme-warp">
            <li
              v-for="(item, i) in themeArr"
              :key="'th' + i"
              :class="{ active: theme === item.mark }"
              @click="handleSelectTheme(item)"
            >
              {{ item.name }}
            </li>
          </ol>
        </li>
        <li title="语言">
          <span
            @click="
              closeOpen()
              isOpenLanguage = true
            "
          >
            <i class="fa fa-language"></i>
            <i class="fa fa-caret-down"></i>
          </span>
          <ol v-if="isOpenLanguage" class="theme-warp">
            <li
              v-for="(item, i) in languageModal"
              :key="'th' + i"
              :class="{ active: language === item }"
              @click="handleSelectLanguage(item)"
            >
              {{ item }}
            </li>
          </ol>
        </li>
        <li @click="handleSelect('wrap')">
          <i class="fa fa-exchange" title="换行"></i>
        </li>
        <li class="disable">|</li>
        <li @click="handleSelect('format')">
          <i class="fa fa-wpforms" title="格式化"></i>
        </li>
        <li @click="handleSelect('trash')">
          <i class="fa fa-trash" title="删除"></i>
        </li>
        <li @click="handleSelect('search')">
          <i class="fa fa-search" title="搜索"></i>
        </li>
        <li @click="handleSelect('save')">
          <i class="fa fa-save" title="保存"></i>
        </li>
      </ul>
      <div
        v-if="isOpenSize || isOpenTheme || isOpenLanguage"
        class="meng-ban"
        @click="closeOpen"
      ></div>
    </div>
    <div class="editor-toolbar-rigth"></div>
  </div>
</template>

<script>
  export default {
    name: 'EditorToolbar',
    // eslint-disable-next-line
    props: ['options', 'language', 'languageModal', 'theme'],
    data() {
      return {
        isOpenSize: false,
        isOpenTheme: false,
        isOpenLanguage: false,
        size: 12,
        // theme: "",
        // language: "",
        fontSize: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
        themeArr: [
          // {
          //   name: "vs",
          //   mark: "vs",
          // },
          {
            name: 'vs-dark',
            mark: 'vs-dark',
          },
          {
            name: 'vs-light',
            mark: 'vs-light',
          },
          {
            name: 'hc-black',
            mark: 'hc-black',
          },
        ],
        // languageArr: [],  ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dart', 'dockerfile', 'ecl', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lexon', 'lua', 'm3', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'],
      }
    },
    created() {},
    mounted() {
      this.size = this.options.fontSize
      // eslint-disable-next-line vue/no-mutating-props
      this.theme = this.options.theme ?? 'vs-dark'
    },
    methods: {
      closeOpen() {
        this.isOpenSize = false
        this.isOpenTheme = false
        this.isOpenLanguage = false
      },
      handleSelect(mark) {
        this.$emit('on-click', { type: mark })
      },
      handleFontSize(size) {
        this.size = size
        this.$emit('on-click', { type: 'size', value: size })
        this.closeOpen()
      },
      handleSelectTheme(item) {
        /**
         * @todo 0.1.7解决 主题切换报错
         * @error Avoid mutating a prop directly since the value will be overwritten whenever
         */
        // this.theme = item.mark;
        this.$emit('on-click', { type: 'theme', value: item.mark })
        this.closeOpen()
      },
      handleSelectLanguage(value) {
        this.$emit('on-click', { type: 'language', value })
        this.closeOpen()
      },

      handleSearch(item) {
        // this.editor.trigger("anyString", "actions.find");
      },
    },
  }
</script>

<style scoped lang="scss">
  .editor-tool-bar {
    display: flex;
    justify-content: space-between;
    padding: 0px 14px;
    box-shadow: inset 0 -1px 0 0 #dce3e8;
    background-color: #efefef;
    height: 35px;
    ul {
      height: 100%;
      display: flex;
      align-items: center;
      > li {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 15px;
        cursor: pointer;
        position: relative;
        > i:hover {
          color: #fe7300;
        }
        > span {
          display: flex;
          align-items: center;
          justify-content: center;
          .fa-caret-down {
            margin-left: 5px;
          }
          &:hover {
            color: #fe7300;
          }
        }
        > ol {
          position: absolute;
          background: #fff;
          top: 20px;
          left: 0;
          z-index: 10;
          width: 130px;
          border: 1px solid #ebeef5;
          border-radius: 2px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
          > li {
            padding: 5px 20px;
            font-size: 13px;
            &:hover {
              // background: #fe720025;
              // color: #fe7300;
              background: rgba(238, 238, 238, 0.692);
            }
          }
        }
      }
    }
    .disable {
      color: #bfbfbf;
      font-weight: 300;
    }
    .meng-ban {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      // background: chocolate;
      z-index: 5;
    }
    .editor-toolbar-left {
      .font-size-warp {
        .active {
          background: rgba(238, 238, 238, 0.692);
        }
      }
      .theme-warp {
        .active {
          background: rgba(238, 238, 238, 0.692);
        }
      }
    }
  }
</style>
