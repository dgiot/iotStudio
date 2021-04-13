;(function (e, t) {
  'object' === typeof exports && 'object' === typeof module
    ? (module.exports = t())
    : 'function' === typeof define && define.amd
    ? define([], t)
    : 'object' === typeof exports
    ? (exports['vab-icons'] = t())
    : (e['vab-icons'] = t())
})('undefined' !== typeof self ? self : this, function () {
  return (function (e) {
    var t = {}
    function n(r) {
      if (t[r]) return t[r].exports
      var o = (t[r] = { i: r, l: !1, exports: {} })
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r })
      }),
      (n.r = function (e) {
        'undefined' !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 })
      }),
      (n.t = function (e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e
        if (4 & t && 'object' === typeof e && e && e.__esModule) return e
        var r = Object.create(null)
        if (
          (n.r(r),
          Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function (t) {
                return e[t]
              }.bind(null, o)
            )
        return r
      }),
      (n.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e['default']
              }
            : function () {
                return e
              }
        return n.d(t, 'a', t), t
      }),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (n.p = ''),
      n((n.s = 'aed5'))
    )
  })({
    '1cdc': function (e, t, n) {
      'use strict'
      n('9c3c')
    },
    '79e4': function (e, t, n) {
      var r, o, i
      ;(function (n, c) {
        ;(o = []),
          (r = c),
          (i = 'function' === typeof r ? r.apply(t, o) : r),
          void 0 === i || (e.exports = i)
      })('undefined' !== typeof self && self, function () {
        function e() {
          var t = Object.getOwnPropertyDescriptor(document, 'currentScript')
          if (!t && 'currentScript' in document && document.currentScript)
            return document.currentScript
          if (t && t.get !== e && document.currentScript)
            return document.currentScript
          try {
            throw new Error()
          } catch (p) {
            var n,
              r,
              o,
              i = /.*at [^(]*\((.*):(.+):(.+)\)$/gi,
              c = /@([^@]*):(\d+):(\d+)\s*$/gi,
              s = i.exec(p.stack) || c.exec(p.stack),
              u = (s && s[1]) || !1,
              a = (s && s[2]) || !1,
              f = document.location.href.replace(document.location.hash, ''),
              d = document.getElementsByTagName('script')
            u === f &&
              ((n = document.documentElement.outerHTML),
              (r = new RegExp(
                '(?:[^\\n]+?\\n){0,' +
                  (a - 2) +
                  '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*',
                'i'
              )),
              (o = n.replace(r, '$1').trim()))
            for (var l = 0; l < d.length; l++) {
              if ('interactive' === d[l].readyState) return d[l]
              if (d[l].src === u) return d[l]
              if (u === f && d[l].innerHTML && d[l].innerHTML.trim() === o)
                return d[l]
            }
            return null
          }
        }
        return e
      })
    },
    '9c3c': function (e, t, n) {},
    adf1: function (e, t, n) {
      e.exports = n.p + 'img/remixicon.symbol.f09b1c74.svg'
    },
    aed5: function (e, t, n) {
      'use strict'
      if ((n.r(t), 'undefined' !== typeof window)) {
        var r = window.document.currentScript,
          o = n('79e4')
        ;(r = o()),
          'currentScript' in document ||
            Object.defineProperty(document, 'currentScript', { get: o })
        var i = r && r.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
        i && (n.p = i[1])
      }
      var c = function () {
          var e,
            t = this,
            n = t.$createElement,
            r = t._self._c || n
          return t.isExternal
            ? r(
                'img',
                t._g(
                  { staticClass: 'img-icon', attrs: { src: t.icon } },
                  t.$listeners
                )
              )
            : t.isCustomSvg
            ? r(
                'svg',
                t._g(
                  { class: t.svgClass, attrs: { 'aria-hidden': 'true' } },
                  t.$listeners
                ),
                [r('use', { attrs: { 'xlink:href': '#vab-icon-' + t.icon } })]
              )
            : t.isDefaultSvg
            ? r('svg', t._g({ staticClass: 'vab-icon' }, t.$listeners), [
                r('use', {
                  attrs: { 'xlink:href': t.remixIconPath + '#ri-' + t.icon },
                }),
              ])
            : r(
                'i',
                t._g(
                  {
                    class: ((e = {}), (e['ri-' + t.icon] = !0), e),
                    attrs: { 'aria-hidden': 'true' },
                  },
                  t.$listeners
                )
              )
        },
        s = []
      n('d52b')
      function u(e) {
        return /^(https?:|mailto:|tel:)/.test(e)
      }
      var a = {
          name: 'VabIcon',
          props: {
            icon: { type: String, required: !0 },
            isCustomSvg: { type: Boolean, default: !1 },
            isDefaultSvg: { type: Boolean, default: !1 },
            className: { type: String, default: '' },
          },
          data: function () {
            return { remixIconPath: n('adf1') }
          },
          computed: {
            isExternal: function () {
              return u(this.icon)
            },
            svgClass: function () {
              return this.className
                ? 'vab-icon '.concat(this.className)
                : 'vab-icon'
            },
          },
        },
        f = a
      n('1cdc')
      function d(e, t, n, r, o, i, c, s) {
        var u,
          a = 'function' === typeof e ? e.options : e
        if (
          (t && ((a.render = t), (a.staticRenderFns = n), (a._compiled = !0)),
          r && (a.functional = !0),
          i && (a._scopeId = 'data-v-' + i),
          c
            ? ((u = function (e) {
                ;(e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)),
                  e ||
                    'undefined' === typeof __VUE_SSR_CONTEXT__ ||
                    (e = __VUE_SSR_CONTEXT__),
                  o && o.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(c)
              }),
              (a._ssrRegister = u))
            : o &&
              (u = s
                ? function () {
                    o.call(
                      this,
                      (a.functional ? this.parent : this).$root.$options
                        .shadowRoot
                    )
                  }
                : o),
          u)
        )
          if (a.functional) {
            a._injectStyles = u
            var f = a.render
            a.render = function (e, t) {
              return u.call(t), f(e, t)
            }
          } else {
            var d = a.beforeCreate
            a.beforeCreate = d ? [].concat(d, u) : [u]
          }
        return { exports: e, options: a }
      }
      var l = d(f, c, s, !1, null, '79aac9d9', null),
        p = l.exports
      t['default'] = p
    },
    d52b: function (e, t, n) {},
  })['default']
})
