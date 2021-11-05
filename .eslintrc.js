module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'linebreak-style': [0, 'error', 'windows'],
    // "max-len" : ["error", {code : 3000}],
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-v-html': 'off',
    'vue/attributes-order': 0,
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    // Vue.js风格指南(https://cn.vuejs.org/v2/style-guide/)
    // Vue组件排序
    'vue/order-in-components': [
      'warn',
      {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          ['provide', 'inject'],
          'ROUTER_GUARDS',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'emits',
          'setup',
          'fetch',
          'asyncData',
          'data',
          'head',
          'computed',
          'watch',
          'watchQuery',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      },
    ],
    // Vue属性排序
    // 'vue/attributes-order': [
    //   'warn',
    //   {
    //     order: [
    //       'DEFINITION',
    //       'LIST_RENDERING',
    //       'CONDITIONALS',
    //       'RENDER_MODIFIERS',
    //       'GLOBAL',
    //       'UNIQUE',
    //       'TWO_WAY_BINDING',
    //       'OTHER_DIRECTIVES',
    //       'OTHER_ATTR',
    //       'EVENTS',
    //       'CONTENT',
    //     ],
    //     alphabetical: false, //字母顺序
    //   },
    // ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
