<template>
  <div class="language-json line-numbers-mode">
    <pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"hidden"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//是否显示在菜单中显示隐藏路由（默认值：false）</span>
  <span class="token property">"menuHidden"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//是否显示在菜单中显示隐藏一级路由（默认值：false，除分栏布局有效）</span>
  <span class="token property">"alwaysShow"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Demo"</span><span class="token punctuation">,</span> <span class="token comment">//首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）</span>
  <span class="token property">"meta"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"title"</span><span class="token punctuation">,</span> <span class="token comment">//菜单、面包屑、多标签页显示的名称</span>
    <span class="token property">"roles"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"admin"</span><span class="token punctuation">,</span> <span class="token string">"..."</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">//当config/settings.js中rolesControl配置开启时，用于控制角色（简写）</span>
    <span class="token property">"roles"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">//当config/settings.js中rolesControl配置开启时，用于控制角色（全写）</span>
      <span class="token property">"role"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"admin"</span><span class="token punctuation">,</span> <span class="token string">"..."</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"ability"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"READ"</span><span class="token punctuation">,</span> <span class="token string">"WRITE"</span><span class="token punctuation">,</span> <span class="token string">"DELETE"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">//ability: ["READ","WRITE"],</span>
      <span class="token property">"mode"</span><span class="token operator">:</span> <span class="token string">"allOf"</span> <span class="token comment">//allOf: 数组内所有角色都拥有，返回True oneOf: 数组内拥有任一角色，返回True(等价第1种数据) except: 不拥有数组内任一角色，返回True(取反)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"remixIcon"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token comment">//旧版remix图标</span>
    <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token comment">//新版</span>
    <span class="token property">"isCustomSvgIcon"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//旧版，是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）</span>
    <span class="token property">"isCustomSvg"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//新版，是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）</span>
    <span class="token property">"noKeepAlive"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//当前路由是否不缓存（默认值：false）</span>
    <span class="token property">"affix"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//当前路由是否固定多标签页（旧版）</span>
    <span class="token property">"noCLosable"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//当前路由是否可关闭多标签页，同上（新版）</span>
    <span class="token property">"badge"</span><span class="token operator">:</span> <span class="token string">"New"</span><span class="token punctuation">,</span> <span class="token comment">//badge小标签（只支持子级）</span>
    <span class="token property">"tabHidden"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//当前路由是否不显示多标签页</span>
    <span class="token property">"activeMenu"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token comment">//高亮指定菜单</span>
    <span class="token property">"dot"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//小圆点</span>
    <span class="token property">"dynamicNewTab"</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token comment">// 动态传参路由是否新开标签页</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"children"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre>
  </div>
</template>

<script>
  export default {
    name: 'MenuCollapse',
  }
</script>

<style scoped>
  /**
 * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
 * Based on https://github.com/chriskempson/tomorrow-theme
 * @author Rose Pritchard
 */

  code[class*='language-'],
  pre[class*='language-'] {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
    line-height: 1.5;
    color: #ccc;
    text-align: left;
    word-break: normal;
    word-wrap: normal;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    white-space: pre;
    background: none;
    word-spacing: normal;
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code[class*='language-'],
  pre[class*='language-'] {
    background: #2d2d2d;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    padding: 0.1em;
    white-space: normal;
    border-radius: 0.3em;
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #999;
  }

  .token.punctuation {
    color: #ccc;
  }

  .token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
    color: #e2777a;
  }

  .token.function-name {
    color: #6196cc;
  }

  .token.boolean,
  .token.number,
  .token.function {
    color: #f08d49;
  }

  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: #f8c555;
  }

  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: #cc99cd;
  }

  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
    color: #7ec699;
  }

  .token.operator,
  .token.entity,
  .token.url {
    color: #67cdcc;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.inserted {
    color: green;
  }
</style>
