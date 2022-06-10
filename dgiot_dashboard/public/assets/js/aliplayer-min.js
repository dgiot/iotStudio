/*! Aliplayer - v2.9.7 - 2021-07-08 10.47.02 */
!function i(n, o, a) {
  function s(t, e) {
    if (!o[t]) {
      if (!n[t]) {
        var r = "function" == typeof require && require;
        if (!e && r) return r(t, !0);
        if (l) return l(t, !0);
        throw(r = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND", r;
      }
      r = o[t] = { exports: {} }, n[t][0].call(r.exports, function(e) {
        return s(n[t][1][e] || e);
      }, r, r.exports, i, n, o, a);
    }
    return o[t].exports;
  }

  for (var l = "function" == typeof require && require, e = 0; e < a.length; e++) s(a[e]);
  return s;
}({
  1: [function(e, t, r) {
    "use strict";
    const i = r;
    i.bignum = e("bn.js"), i.define = e("./asn1/api").define, i.base = e("./asn1/base"), i.constants = e("./asn1/constants"), i.decoders = e("./asn1/decoders"), i.encoders = e("./asn1/encoders");
  }, {
    "./asn1/api": 2,
    "./asn1/base": 4,
    "./asn1/constants": 8,
    "./asn1/decoders": 10,
    "./asn1/encoders": 13,
    "bn.js": 15
  }],
  2: [function(e, t, r) {
    "use strict";
    const i = e("./encoders"), n = e("./decoders"), o = e("inherits"), a = r;

    function s(e, t) {
      this.name = e, this.body = t, this.decoders = {}, this.encoders = {};
    }

    a.define = function(e, t) {
      return new s(e, t);
    }, s.prototype._createNamed = function(r) {
      const t = this.name;

      function e(e) {
        this._initNamed(e, t);
      }

      return o(e, r), e.prototype._initNamed = function(e, t) {
        r.call(this, e, t);
      }, new e(this);
    }, s.prototype._getDecoder = function(e) {
      return this.decoders.hasOwnProperty(e = e || "der") || (this.decoders[e] = this._createNamed(n[e])), this.decoders[e];
    }, s.prototype.decode = function(e, t, r) {
      return this._getDecoder(t).decode(e, r);
    }, s.prototype._getEncoder = function(e) {
      return this.encoders.hasOwnProperty(e = e || "der") || (this.encoders[e] = this._createNamed(i[e])), this.encoders[e];
    }, s.prototype.encode = function(e, t, r) {
      return this._getEncoder(t).encode(e, r);
    };
  }, { "./decoders": 10, "./encoders": 13, inherits: 142 }],
  3: [function(e, t, r) {
    "use strict";
    const i = e("inherits"), n = e("../base/reporter").Reporter, o = e("safer-buffer").Buffer;

    function a(e, t) {
      n.call(this, t), o.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer");
    }

    function s(e, t) {
      if (Array.isArray(e)) this.length = 0, this.value = e.map(function(e) {
        return s.isEncoderBuffer(e) || (e = new s(e, t)), this.length += e.length, e;
      }, this); else if ("number" == typeof e) {
        if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
        this.value = e, this.length = 1;
      } else if ("string" == typeof e) this.value = e, this.length = o.byteLength(e); else {
        if (!o.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
        this.value = e, this.length = e.length;
      }
    }

    i(a, n), (r.DecoderBuffer = a).isDecoderBuffer = function(e) {
      return e instanceof a || "object" == typeof e && o.isBuffer(e.base) && "DecoderBuffer" === e.constructor.name && "number" == typeof e.offset && "number" == typeof e.length && "function" == typeof e.save && "function" == typeof e.restore && "function" == typeof e.isEmpty && "function" == typeof e.readUInt8 && "function" == typeof e.skip && "function" == typeof e.raw;
    }, a.prototype.save = function() {
      return { offset: this.offset, reporter: n.prototype.save.call(this) };
    }, a.prototype.restore = function(e) {
      const t = new a(this.base);
      return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, n.prototype.restore.call(this, e.reporter), t;
    }, a.prototype.isEmpty = function() {
      return this.offset === this.length;
    }, a.prototype.readUInt8 = function(e) {
      return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
    }, a.prototype.skip = function(e, t) {
      if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
      const r = new a(this.base);
      return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r;
    }, a.prototype.raw = function(e) {
      return this.base.slice((e || this).offset, this.length);
    }, (r.EncoderBuffer = s).isEncoderBuffer = function(e) {
      return e instanceof s || "object" == typeof e && "EncoderBuffer" === e.constructor.name && "number" == typeof e.length && "function" == typeof e.join;
    }, s.prototype.join = function(t, r) {
      return t = t || o.alloc(this.length), r = r || 0, 0 === this.length || (Array.isArray(this.value) ? this.value.forEach(function(e) {
        e.join(t, r), r += e.length;
      }) : ("number" == typeof this.value ? t[r] = this.value : "string" == typeof this.value ? t.write(this.value, r) : o.isBuffer(this.value) && this.value.copy(t, r), r += this.length)), t;
    };
  }, { "../base/reporter": 6, inherits: 142, "safer-buffer": 188 }],
  4: [function(e, t, r) {
    "use strict";
    const i = r;
    i.Reporter = e("./reporter").Reporter, i.DecoderBuffer = e("./buffer").DecoderBuffer, i.EncoderBuffer = e("./buffer").EncoderBuffer, i.Node = e("./node");
  }, { "./buffer": 3, "./node": 5, "./reporter": 6 }],
  5: [function(e, t, r) {
    "use strict";
    const u = e("../base/reporter").Reporter, i = e("../base/buffer").EncoderBuffer,
      c = e("../base/buffer").DecoderBuffer, n = e("minimalistic-assert"),
      o = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"],
      a = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(o);

    function s(e, t, r) {
      const i = {};
      this._baseState = i, i.name = r, i.enc = e, i.parent = t || null, i.children = null, i.tag = null, i.args = null, i.reverseArgs = null, i.choice = null, i.optional = !1, i.any = !1, i.obj = !1, i.use = null, i.useDecoder = null, i.key = null, i["default"] = null, i.explicit = null, i.implicit = null, i.contains = null, i.parent || (i.children = [], this._wrap());
    }

    t.exports = s;
    const l = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
    s.prototype.clone = function() {
      const t = this._baseState, r = {};
      l.forEach(function(e) {
        r[e] = t[e];
      });
      const e = new this.constructor(r.parent);
      return e._baseState = r, e;
    }, s.prototype._wrap = function() {
      const r = this._baseState;
      a.forEach(function(t) {
        this[t] = function() {
          const e = new this.constructor(this);
          return r.children.push(e), e[t].apply(e, arguments);
        };
      }, this);
    }, s.prototype._init = function(e) {
      const t = this._baseState;
      n(null === t.parent), e.call(this), t.children = t.children.filter(function(e) {
        return e._baseState.parent === this;
      }, this), n.equal(t.children.length, 1, "Root node can have only one child");
    }, s.prototype._useArgs = function(e) {
      const t = this._baseState, r = e.filter(function(e) {
        return e instanceof this.constructor;
      }, this);
      e = e.filter(function(e) {
        return !(e instanceof this.constructor);
      }, this), 0 !== r.length && (n(null === t.children), t.children = r, r.forEach(function(e) {
        e._baseState.parent = this;
      }, this)), 0 !== e.length && (n(null === t.args), t.args = e, t.reverseArgs = e.map(function(r) {
        if ("object" != typeof r || r.constructor !== Object) return r;
        const i = {};
        return Object.keys(r).forEach(function(e) {
          e == (0 | e) && (e |= 0);
          var t = r[e];
          i[t] = e;
        }), i;
      }));
    }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function(t) {
      s.prototype[t] = function() {
        var e = this._baseState;
        throw new Error(t + " not implemented for encoding: " + e.enc);
      };
    }), o.forEach(function(r) {
      s.prototype[r] = function() {
        const e = this._baseState;
        var t = Array.prototype.slice.call(arguments);
        return n(null === e.tag), e.tag = r, this._useArgs(t), this;
      };
    }), s.prototype.use = function(e) {
      n(e);
      const t = this._baseState;
      return n(null === t.use), t.use = e, this;
    }, s.prototype.optional = function() {
      const e = this._baseState;
      return e.optional = !0, this;
    }, s.prototype.def = function(e) {
      const t = this._baseState;
      return n(null === t["default"]), t["default"] = e, t.optional = !0, this;
    }, s.prototype.explicit = function(e) {
      const t = this._baseState;
      return n(null === t.explicit && null === t.implicit), t.explicit = e, this;
    }, s.prototype.implicit = function(e) {
      const t = this._baseState;
      return n(null === t.explicit && null === t.implicit), t.implicit = e, this;
    }, s.prototype.obj = function() {
      const e = this._baseState;
      var t = Array.prototype.slice.call(arguments);
      return e.obj = !0, 0 !== t.length && this._useArgs(t), this;
    }, s.prototype.key = function(e) {
      const t = this._baseState;
      return n(null === t.key), t.key = e, this;
    }, s.prototype.any = function() {
      const e = this._baseState;
      return e.any = !0, this;
    }, s.prototype.choice = function(t) {
      const e = this._baseState;
      return n(null === e.choice), e.choice = t, this._useArgs(Object.keys(t).map(function(e) {
        return t[e];
      })), this;
    }, s.prototype.contains = function(e) {
      const t = this._baseState;
      return n(null === t.use), t.contains = e, this;
    }, s.prototype._decode = function(t, r) {
      const i = this._baseState;
      if (null === i.parent) return t.wrapResult(i.children[0]._decode(t, r));
      let n = i["default"], o = !0, e = null;
      if (null !== i.key && (e = t.enterKey(i.key)), i.optional) {
        let e = null;
        if (null !== i.explicit ? e = i.explicit : null !== i.implicit ? e = i.implicit : null !== i.tag && (e = i.tag), null !== e || i.any) {
          if (o = this._peekTag(t, e, i.any), t.isError(o)) return o;
        } else {
          var a = t.save();
          try {
            null === i.choice ? this._decodeGeneric(i.tag, t, r) : this._decodeChoice(t, r), o = !0;
          } catch (e) {
            o = !1;
          }
          t.restore(a);
        }
      }
      let s;
      if (i.obj && o && (s = t.enterObject()), o) {
        if (null !== i.explicit) {
          var l = this._decodeTag(t, i.explicit);
          if (t.isError(l)) return l;
          t = l;
        }
        a = t.offset;
        if (null === i.use && null === i.choice) {
          let e;
          i.any && (e = t.save());
          l = this._decodeTag(t, null !== i.implicit ? i.implicit : i.tag, i.any);
          if (t.isError(l)) return l;
          i.any ? n = t.raw(e) : t = l;
        }
        if (r && r.track && null !== i.tag && r.track(t.path(), a, t.length, "tagged"), r && r.track && null !== i.tag && r.track(t.path(), t.offset, t.length, "content"), i.any || (n = null === i.choice ? this._decodeGeneric(i.tag, t, r) : this._decodeChoice(t, r)), t.isError(n)) return n;
        i.any || null !== i.choice || null === i.children || i.children.forEach(function(e) {
          e._decode(t, r);
        }), !i.contains || "octstr" !== i.tag && "bitstr" !== i.tag || (a = new c(n), n = this._getUse(i.contains, t._reporterState.obj)._decode(a, r));
      }
      return i.obj && o && (n = t.leaveObject(s)), null === i.key || null === n && !0 !== o ? null !== e && t.exitKey(e) : t.leaveKey(e, i.key, n), n;
    }, s.prototype._decodeGeneric = function(e, t, r) {
      var i = this._baseState;
      return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, i.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && i.args ? this._decodeObjid(t, i.args[0], i.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, i.args && i.args[0], r) : null !== i.use ? this._getUse(i.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e);
    }, s.prototype._getUse = function(e, t) {
      const r = this._baseState;
      return r.useDecoder = this._use(e, t), n(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder;
    }, s.prototype._decodeChoice = function(n, o) {
      const a = this._baseState;
      let s = null, l = !1;
      return Object.keys(a.choice).some(function(e) {
        var t = n.save();
        const r = a.choice[e];
        try {
          var i = r._decode(n, o);
          if (n.isError(i)) return !1;
          s = { type: e, value: i }, l = !0;
        } catch (e) {
          return n.restore(t), !1;
        }
        return !0;
      }, this), l ? s : n.error("Choice not matched");
    }, s.prototype._createEncoderBuffer = function(e) {
      return new i(e, this.reporter);
    }, s.prototype._encode = function(e, t, r) {
      var i = this._baseState;
      if (null === i["default"] || i["default"] !== e) {
        e = this._encodeValue(e, t, r);
        if (void 0 !== e && !this._skipDefault(e, t, r)) return e;
      }
    }, s.prototype._encodeValue = function(r, i, e) {
      const t = this._baseState;
      if (null === t.parent) return t.children[0]._encode(r, i || new u);
      let n = null;
      if (this.reporter = i, t.optional && void 0 === r) {
        if (null === t["default"]) return;
        r = t["default"];
      }
      let o = null, a = !1;
      if (t.any) n = this._createEncoderBuffer(r); else if (t.choice) n = this._encodeChoice(r, i); else if (t.contains) o = this._getUse(t.contains, e)._encode(r, i), a = !0; else if (t.children) o = t.children.map(function(e) {
        if ("null_" === e._baseState.tag) return e._encode(null, i, r);
        if (null === e._baseState.key) return i.error("Child should have a key");
        var t = i.enterKey(e._baseState.key);
        if ("object" != typeof r) return i.error("Child expected, but input is not object");
        e = e._encode(r[e._baseState.key], i, r);
        return i.leaveKey(t), e;
      }, this).filter(function(e) {
        return e;
      }), o = this._createEncoderBuffer(o); else if ("seqof" === t.tag || "setof" === t.tag) {
        if (!t.args || 1 !== t.args.length) return i.error("Too many args for : " + t.tag);
        if (!Array.isArray(r)) return i.error("seqof/setof, but data is not Array");
        const l = this.clone();
        l._baseState.implicit = null, o = this._createEncoderBuffer(r.map(function(e) {
          var t = this._baseState;
          return this._getUse(t.args[0], r)._encode(e, i);
        }, l));
      } else null !== t.use ? n = this._getUse(t.use, e)._encode(r, i) : (o = this._encodePrimitive(t.tag, r), a = !0);
      var s;
      return t.any || null !== t.choice || (s = null !== t.implicit ? t.implicit : t.tag, e = null === t.implicit ? "universal" : "context", null === s ? null === t.use && i.error("Tag could be omitted only for .use()") : null === t.use && (n = this._encodeComposite(s, a, e, o))), null !== t.explicit && (n = this._encodeComposite(t.explicit, !1, "context", n)), n;
    }, s.prototype._encodeChoice = function(e, t) {
      var r = this._baseState;
      const i = r.choice[e.type];
      return i || n(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), i._encode(e.value, t);
    }, s.prototype._encodePrimitive = function(e, t) {
      var r = this._baseState;
      if (/str$/.test(e)) return this._encodeStr(t, e);
      if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
      if ("objid" === e) return this._encodeObjid(t, null, null);
      if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
      if ("null_" === e) return this._encodeNull();
      if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
      if ("bool" === e) return this._encodeBool(t);
      if ("objDesc" === e) return this._encodeStr(t, e);
      throw new Error("Unsupported tag: " + e);
    }, s.prototype._isNumstr = function(e) {
      return /^[0-9 ]*$/.test(e);
    }, s.prototype._isPrintstr = function(e) {
      return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(e);
    };
  }, { "../base/buffer": 3, "../base/reporter": 6, "minimalistic-assert": 148 }],
  6: [function(e, t, r) {
    "use strict";
    const i = e("inherits");

    function n(e) {
      this._reporterState = { obj: null, path: [], options: e || {}, errors: [] };
    }

    function o(e, t) {
      this.path = e, this.rethrow(t);
    }

    (r.Reporter = n).prototype.isError = function(e) {
      return e instanceof o;
    }, n.prototype.save = function() {
      var e = this._reporterState;
      return { obj: e.obj, pathLen: e.path.length };
    }, n.prototype.restore = function(e) {
      const t = this._reporterState;
      t.obj = e.obj, t.path = t.path.slice(0, e.pathLen);
    }, n.prototype.enterKey = function(e) {
      return this._reporterState.path.push(e);
    }, n.prototype.exitKey = function(e) {
      const t = this._reporterState;
      t.path = t.path.slice(0, e - 1);
    }, n.prototype.leaveKey = function(e, t, r) {
      const i = this._reporterState;
      this.exitKey(e), null !== i.obj && (i.obj[t] = r);
    }, n.prototype.path = function() {
      return this._reporterState.path.join("/");
    }, n.prototype.enterObject = function() {
      const e = this._reporterState;
      var t = e.obj;
      return e.obj = {}, t;
    }, n.prototype.leaveObject = function(e) {
      const t = this._reporterState;
      var r = t.obj;
      return t.obj = e, r;
    }, n.prototype.error = function(e) {
      let t;
      const r = this._reporterState;
      var i = e instanceof o;
      if (t = i ? e : new o(r.path.map(function(e) {
        return "[" + JSON.stringify(e) + "]";
      }).join(""), e.message || e, e.stack), !r.options.partial) throw t;
      return i || r.errors.push(t), t;
    }, n.prototype.wrapResult = function(e) {
      var t = this._reporterState;
      return t.options.partial ? { result: this.isError(e) ? null : e, errors: t.errors } : e;
    }, i(o, Error), o.prototype.rethrow = function(e) {
      if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, o), !this.stack) try {
        throw new Error(this.message);
      } catch (e) {
        this.stack = e.stack;
      }
      return this;
    };
  }, { inherits: 142 }],
  7: [function(e, t, r) {
    "use strict";

    function i(r) {
      const i = {};
      return Object.keys(r).forEach(function(e) {
        (0 | e) == e && (e |= 0);
        var t = r[e];
        i[t] = e;
      }), i;
    }

    r.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, r.tagClassByName = i(r.tagClass), r.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    }, r.tagByName = i(r.tag);
  }, {}],
  8: [function(e, t, r) {
    "use strict";
    const i = r;
    i._reverse = function(r) {
      const i = {};
      return Object.keys(r).forEach(function(e) {
        (0 | e) == e && (e |= 0);
        var t = r[e];
        i[t] = e;
      }), i;
    }, i.der = e("./der");
  }, { "./der": 7 }],
  9: [function(e, t, r) {
    "use strict";
    const i = e("inherits"), n = e("bn.js"), o = e("../base/buffer").DecoderBuffer, a = e("../base/node"),
      s = e("../constants/der");

    function l(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new u, this.tree._init(e.body);
    }

    function u(e) {
      a.call(this, "der", e);
    }

    function c(t, r) {
      let i = t.readUInt8(r);
      if (t.isError(i)) return i;
      var e = s.tagClass[i >> 6], n = 0 == (32 & i);
      if (31 == (31 & i)) {
        let e = i;
        for (i = 0; 128 == (128 & e);) {
          if (e = t.readUInt8(r), t.isError(e)) return e;
          i <<= 7, i |= 127 & e;
        }
      } else i &= 31;
      var o = s.tag[i];
      return { cls: e, primitive: n, tag: i, tagStr: o };
    }

    function h(t, e, r) {
      let i = t.readUInt8(r);
      if (t.isError(i)) return i;
      if (!e && 128 === i) return null;
      if (0 == (128 & i)) return i;
      var n = 127 & i;
      if (4 < n) return t.error("length octect is too long");
      for (let e = i = 0; e < n; e++) {
        i <<= 8;
        var o = t.readUInt8(r);
        if (t.isError(o)) return o;
        i |= o;
      }
      return i;
    }

    (t.exports = l).prototype.decode = function(e, t) {
      return o.isDecoderBuffer(e) || (e = new o(e, t)), this.tree._decode(e, t);
    }, i(u, a), u.prototype._peekTag = function(e, t, r) {
      if (e.isEmpty()) return !1;
      var i = e.save(), n = c(e, "Failed to peek tag: \"" + t + "\"");
      return e.isError(n) ? n : (e.restore(i), n.tag === t || n.tagStr === t || n.tagStr + "of" === t || r);
    }, u.prototype._decodeTag = function(e, t, r) {
      var i = c(e, "Failed to decode tag of \"" + t + "\"");
      if (e.isError(i)) return i;
      let n = h(e, i.primitive, "Failed to get length of \"" + t + "\"");
      if (e.isError(n)) return n;
      if (!r && i.tag !== t && i.tagStr !== t && i.tagStr + "of" !== t) return e.error("Failed to match tag: \"" + t + "\"");
      if (i.primitive || null !== n) return e.skip(n, "Failed to match body of: \"" + t + "\"");
      r = e.save(), i = this._skipUntilEnd(e, "Failed to skip indefinite length body: \"" + this.tag + "\"");
      return e.isError(i) ? i : (n = e.offset - r.offset, e.restore(r), e.skip(n, "Failed to match body of: \"" + t + "\""));
    }, u.prototype._skipUntilEnd = function(t, r) {
      for (; ;) {
        var i = c(t, r);
        if (t.isError(i)) return i;
        var n = h(t, i.primitive, r);
        if (t.isError(n)) return n;
        let e;
        if (e = i.primitive || null !== n ? t.skip(n) : this._skipUntilEnd(t, r), t.isError(e)) return e;
        if ("end" === i.tagStr) break;
      }
    }, u.prototype._decodeList = function(e, t, r, i) {
      const n = [];
      for (; !e.isEmpty();) {
        var o = this._peekTag(e, "end");
        if (e.isError(o)) return o;
        var a = r.decode(e, "der", i);
        if (e.isError(a) && o) break;
        n.push(a);
      }
      return n;
    }, u.prototype._decodeStr = function(e, t) {
      if ("bitstr" === t) {
        var r = e.readUInt8();
        return e.isError(r) ? r : { unused: r, data: e.raw() };
      }
      if ("bmpstr" === t) {
        const i = e.raw();
        if (i.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
        let t = "";
        for (let e = 0; e < i.length / 2; e++) t += String.fromCharCode(i.readUInt16BE(2 * e));
        return t;
      }
      if ("numstr" === t) {
        r = e.raw().toString("ascii");
        return this._isNumstr(r) ? r : e.error("Decoding of string type: numstr unsupported characters");
      }
      if ("octstr" === t) return e.raw();
      if ("objDesc" === t) return e.raw();
      if ("printstr" !== t) return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
      t = e.raw().toString("ascii");
      return this._isPrintstr(t) ? t : e.error("Decoding of string type: printstr unsupported characters");
    }, u.prototype._decodeObjid = function(e, t, r) {
      let i;
      const n = [];
      let o = 0, a = 0;
      for (; !e.isEmpty();) a = e.readUInt8(), o <<= 7, o |= 127 & a, 0 == (128 & a) && (n.push(o), o = 0);
      128 & a && n.push(o);
      const s = n[0] / 40 | 0, l = n[0] % 40;
      if (i = r ? n : [s, l].concat(n.slice(1)), t) {
        let e = t[i.join(" ")];
        void 0 === e && (e = t[i.join(".")]), void 0 !== e && (i = e);
      }
      return i;
    }, u.prototype._decodeTime = function(e, t) {
      const r = e.raw().toString();
      let i, n, o, a, s, l;
      if ("gentime" === t) i = 0 | r.slice(0, 4), n = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8), a = 0 | r.slice(8, 10), s = 0 | r.slice(10, 12), l = 0 | r.slice(12, 14); else {
        if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
        i = 0 | r.slice(0, 2), n = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), s = 0 | r.slice(8, 10), l = 0 | r.slice(10, 12), i = i < 70 ? 2e3 + i : 1900 + i;
      }
      return Date.UTC(i, n - 1, o, a, s, l, 0);
    }, u.prototype._decodeNull = function() {
      return null;
    }, u.prototype._decodeBool = function(e) {
      var t = e.readUInt8();
      return e.isError(t) ? t : 0 !== t;
    }, u.prototype._decodeInt = function(e, t) {
      e = e.raw();
      let r = new n(e);
      return t && (r = t[r.toString(10)] || r), r;
    }, u.prototype._use = function(e, t) {
      return (e = "function" == typeof e ? e(t) : e)._getDecoder("der").tree;
    };
  }, { "../base/buffer": 3, "../base/node": 5, "../constants/der": 7, "bn.js": 15, inherits: 142 }],
  10: [function(e, t, r) {
    "use strict";
    const i = r;
    i.der = e("./der"), i.pem = e("./pem");
  }, { "./der": 9, "./pem": 11 }],
  11: [function(e, t, r) {
    "use strict";
    const i = e("inherits"), u = e("safer-buffer").Buffer, c = e("./der");

    function n(e) {
      c.call(this, e), this.enc = "pem";
    }

    i(n, c), (t.exports = n).prototype.decode = function(e, t) {
      const r = e.toString().split(/[\r\n]+/g);
      var i = t.label.toUpperCase(), n = /^-----(BEGIN|END) ([^-]+)-----$/;
      let o = -1, a = -1;
      for (let e = 0; e < r.length; e++) {
        var s = r[e].match(n);
        if (null !== s && s[2] === i) {
          if (-1 !== o) {
            if ("END" !== s[1]) break;
            a = e;
            break;
          }
          if ("BEGIN" !== s[1]) break;
          o = e;
        }
      }
      if (-1 === o || -1 === a) throw new Error("PEM section not found for: " + i);
      const l = r.slice(o + 1, a).join("");
      l.replace(/[^a-z0-9+/=]+/gi, "");
      e = u.from(l, "base64");
      return c.prototype.decode.call(this, e, t);
    };
  }, { "./der": 9, inherits: 142, "safer-buffer": 188 }],
  12: [function(e, t, r) {
    "use strict";
    const i = e("inherits"), a = e("safer-buffer").Buffer, n = e("../base/node"), s = e("../constants/der");

    function o(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new l, this.tree._init(e.body);
    }

    function l(e) {
      n.call(this, "der", e);
    }

    function u(e) {
      return e < 10 ? "0" + e : e;
    }

    (t.exports = o).prototype.encode = function(e, t) {
      return this.tree._encode(e, t).join();
    }, i(l, n), l.prototype._encodeComposite = function(e, t, r, i) {
      r = function(e, t, r, i) {
        let n;
        "seqof" === e ? e = "seq" : "setof" === e && (e = "set");
        if (s.tagByName.hasOwnProperty(e)) n = s.tagByName[e]; else {
          if ("number" != typeof e || (0 | e) !== e) return i.error("Unknown tag: " + e);
          n = e;
        }
        if (31 <= n) return i.error("Multi-octet tag encoding unsupported");
        t || (n |= 32);
        return n |= s.tagClassByName[r || "universal"] << 6, n;
      }(e, t, r, this.reporter);
      if (i.length < 128) {
        const o = a.alloc(2);
        return o[0] = r, o[1] = i.length, this._createEncoderBuffer([o, i]);
      }
      let n = 1;
      for (let e = i.length; 256 <= e; e >>= 8) n++;
      const o = a.alloc(2 + n);
      o[0] = r, o[1] = 128 | n;
      for (let e = 1 + n, t = i.length; 0 < t; e--, t >>= 8) o[e] = 255 & t;
      return this._createEncoderBuffer([o, i]);
    }, l.prototype._encodeStr = function(t, e) {
      if ("bitstr" === e) return this._createEncoderBuffer([0 | t.unused, t.data]);
      if ("bmpstr" !== e) return "numstr" === e ? this._isNumstr(t) ? this._createEncoderBuffer(t) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === e ? this._isPrintstr(t) ? this._createEncoderBuffer(t) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(e) || "objDesc" === e ? this._createEncoderBuffer(t) : this.reporter.error("Encoding of string type: " + e + " unsupported");
      {
        const r = a.alloc(2 * t.length);
        for (let e = 0; e < t.length; e++) r.writeUInt16BE(t.charCodeAt(e), 2 * e);
        return this._createEncoderBuffer(r);
      }
    }, l.prototype._encodeObjid = function(r, e, t) {
      if ("string" == typeof r) {
        if (!e) return this.reporter.error("string objid given, but no values map found");
        if (!e.hasOwnProperty(r)) return this.reporter.error("objid not found in values map");
        r = e[r].split(/[\s.]+/g);
        for (let e = 0; e < r.length; e++) r[e] |= 0;
      } else if (Array.isArray(r)) {
        r = r.slice();
        for (let e = 0; e < r.length; e++) r[e] |= 0;
      }
      if (!Array.isArray(r)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(r));
      if (!t) {
        if (40 <= r[1]) return this.reporter.error("Second objid identifier OOB");
        r.splice(0, 2, 40 * r[0] + r[1]);
      }
      let i = 0;
      for (let t = 0; t < r.length; t++) {
        let e = r[t];
        for (i++; 128 <= e; e >>= 7) i++;
      }
      const n = a.alloc(i);
      let o = n.length - 1;
      for (let t = r.length - 1; 0 <= t; t--) {
        let e = r[t];
        for (n[o--] = 127 & e; 0 < (e >>= 7);) n[o--] = 128 | 127 & e;
      }
      return this._createEncoderBuffer(n);
    }, l.prototype._encodeTime = function(e, t) {
      let r;
      const i = new Date(e);
      return "gentime" === t ? r = [u(i.getUTCFullYear()), u(i.getUTCMonth() + 1), u(i.getUTCDate()), u(i.getUTCHours()), u(i.getUTCMinutes()), u(i.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [u(i.getUTCFullYear() % 100), u(i.getUTCMonth() + 1), u(i.getUTCDate()), u(i.getUTCHours()), u(i.getUTCMinutes()), u(i.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr");
    }, l.prototype._encodeNull = function() {
      return this._createEncoderBuffer("");
    }, l.prototype._encodeInt = function(t, e) {
      if ("string" == typeof t) {
        if (!e) return this.reporter.error("String int or enum given, but no values map");
        if (!e.hasOwnProperty(t)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(t));
        t = e[t];
      }
      if ("number" != typeof t && !a.isBuffer(t)) {
        const n = t.toArray();
        !t.sign && 128 & n[0] && n.unshift(0), t = a.from(n);
      }
      if (a.isBuffer(t)) {
        let e = t.length;
        0 === t.length && e++;
        const i = a.alloc(e);
        return t.copy(i), 0 === t.length && (i[0] = 0), this._createEncoderBuffer(i);
      }
      if (t < 128) return this._createEncoderBuffer(t);
      if (t < 256) return this._createEncoderBuffer([0, t]);
      let r = 1;
      for (let e = t; 256 <= e; e >>= 8) r++;
      const i = new Array(r);
      for (let e = i.length - 1; 0 <= e; e--) i[e] = 255 & t, t >>= 8;
      return 128 & i[0] && i.unshift(0), this._createEncoderBuffer(a.from(i));
    }, l.prototype._encodeBool = function(e) {
      return this._createEncoderBuffer(e ? 255 : 0);
    }, l.prototype._use = function(e, t) {
      return (e = "function" == typeof e ? e(t) : e)._getEncoder("der").tree;
    }, l.prototype._skipDefault = function(e, t, r) {
      const i = this._baseState;
      let n;
      if (null === i["default"]) return !1;
      var o = e.join();
      if (void 0 === i.defaultBuffer && (i.defaultBuffer = this._encodeValue(i["default"], t, r).join()), o.length !== i.defaultBuffer.length) return !1;
      for (n = 0; n < o.length; n++) if (o[n] !== i.defaultBuffer[n]) return !1;
      return !0;
    };
  }, { "../base/node": 5, "../constants/der": 7, inherits: 142, "safer-buffer": 188 }],
  13: [function(e, t, r) {
    "use strict";
    const i = r;
    i.der = e("./der"), i.pem = e("./pem");
  }, { "./der": 12, "./pem": 14 }],
  14: [function(e, t, r) {
    "use strict";
    const i = e("inherits"), o = e("./der");

    function n(e) {
      o.call(this, e), this.enc = "pem";
    }

    i(n, o), (t.exports = n).prototype.encode = function(e, t) {
      const r = o.prototype.encode.call(this, e), i = r.toString("base64"), n = ["-----BEGIN " + t.label + "-----"];
      for (let e = 0; e < i.length; e += 64) n.push(i.slice(e, e + 64));
      return n.push("-----END " + t.label + "-----"), n.join("\n");
    };
  }, { "./der": 12, inherits: 142 }],
  15: [function(T, e, t) {
    !function(e, t) {
      "use strict";

      function y(e, t) {
        if (!e) throw new Error(t || "Assertion failed");
      }

      function r(e, t) {
        e.super_ = t;

        function r() {
        }

        r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e;
      }

      function g(e, t, r) {
        if (g.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, (this.red = null) !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"));
      }

      var i;
      "object" == typeof e ? e.exports = g : t.BN = g, (g.BN = g).wordSize = 26;
      try {
        i = ("undefined" != typeof window && void 0 !== window.Buffer ? window : T("buffer")).Buffer;
      } catch (e) {
      }

      function n(e, t) {
        t = e.charCodeAt(t);
        return 65 <= t && t <= 70 ? t - 55 : 97 <= t && t <= 102 ? t - 87 : t - 48 & 15;
      }

      function s(e, t, r) {
        var i = n(e, r);
        return t <= r - 1 && (i |= n(e, r - 1) << 4), i;
      }

      function h(e, t, r, i) {
        for (var n = 0, o = Math.min(e.length, r), a = t; a < o; a++) {
          var s = e.charCodeAt(a) - 48;
          n *= i, n += 49 <= s ? s - 49 + 10 : 17 <= s ? s - 17 + 10 : s;
        }
        return n;
      }

      g.isBN = function(e) {
        return e instanceof g || null !== e && "object" == typeof e && e.constructor.wordSize === g.wordSize && Array.isArray(e.words);
      }, g.max = function(e, t) {
        return 0 < e.cmp(t) ? e : t;
      }, g.min = function(e, t) {
        return e.cmp(t) < 0 ? e : t;
      }, g.prototype._init = function(e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == typeof e) return this._initArray(e, t, r);
        y((t = "hex" === t ? 16 : t) === (0 | t) && 2 <= t && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && (i++, this.negative = 1), i < e.length && (16 === t ? this._parseHex(e, i, r) : (this._parseBase(e, t, i), "le" === r && this._initArray(this.toArray(), t, r)));
      }, g.prototype._initNumber = function(e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (y(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);
      }, g.prototype._initArray = function(e, t, r) {
        if (y("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
        for (var i, n, o = 0; o < this.length; o++) this.words[o] = 0;
        var a = 0;
        if ("be" === r) for (o = e.length - 1, i = 0; 0 <= o; o -= 3) n = e[o] | e[o - 1] << 8 | e[o - 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++); else if ("le" === r) for (i = o = 0; o < e.length; o += 3) n = e[o] | e[o + 1] << 8 | e[o + 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++);
        return this.strip();
      }, g.prototype._parseHex = function(e, t, r) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) this.words[i] = 0;
        var n, o = 0, a = 0;
        if ("be" === r) for (i = e.length - 1; t <= i; i -= 2) n = s(e, t, i) << o, this.words[a] |= 67108863 & n, 18 <= o ? (o -= 18, this.words[a += 1] |= n >>> 26) : o += 8; else for (i = (e.length - t) % 2 == 0 ? t + 1 : t; i < e.length; i += 2) n = s(e, t, i) << o, this.words[a] |= 67108863 & n, 18 <= o ? (o -= 18, this.words[a += 1] |= n >>> 26) : o += 8;
        this.strip();
      }, g.prototype._parseBase = function(e, t, r) {
        this.words = [0];
        for (var i = 0, n = this.length = 1; n <= 67108863; n *= t) i++;
        for (var n = n / t | 0, o = e.length - r, a = o % --i, s = Math.min(o, o - a) + r, l = 0, u = r; u < s; u += i) l = h(e, u, u + i, t), this.imuln(n), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        if (0 != a) {
          for (var c = 1, l = h(e, u, e.length, t), u = 0; u < a; u++) c *= t;
          this.imuln(c), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        }
        this.strip();
      }, g.prototype.copy = function(e) {
        e.words = new Array(this.length);
        for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
        e.length = this.length, e.negative = this.negative, e.red = this.red;
      }, g.prototype.clone = function() {
        var e = new g(null);
        return this.copy(e), e;
      }, g.prototype._expand = function(e) {
        for (; this.length < e;) this.words[this.length++] = 0;
        return this;
      }, g.prototype.strip = function() {
        for (; 1 < this.length && 0 === this.words[this.length - 1];) this.length--;
        return this._normSign();
      }, g.prototype._normSign = function() {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;
      }, g.prototype.inspect = function() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var d = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
        f = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

      function o(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var i = e.length + t.length | 0, i = (r.length = i) - 1 | 0,
          n = (a = (0 | e.words[0]) * (0 | t.words[0])) / 67108864 | 0;
        r.words[0] = 67108863 & a;
        for (var o = 1; o < i; o++) {
          for (var a, s = n >>> 26, l = 67108863 & n, u = Math.min(o, t.length - 1), c = Math.max(0, o - e.length + 1); c <= u; c++) s += (a = (0 | e.words[o - c | 0]) * (0 | t.words[c]) + l) / 67108864 | 0, l = 67108863 & a;
          r.words[o] = 0 | l, n = 0 | s;
        }
        return 0 !== n ? r.words[o] = 0 | n : r.length--, r.strip();
      }

      g.prototype.toString = function(e, t) {
        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          s = "";
          for (var r = 0, i = 0, n = 0; n < this.length; n++) {
            var o = this.words[n], a = (16777215 & (o << r | i)).toString(16),
              s = 0 !== (i = o >>> 24 - r & 16777215) || n !== this.length - 1 ? d[6 - a.length] + a + s : a + s;
            26 <= (r += 2) && (r -= 26, n--);
          }
          for (0 !== i && (s = i.toString(16) + s); s.length % t != 0;) s = "0" + s;
          return s = 0 !== this.negative ? "-" + s : s;
        }
        if (e === (0 | e) && 2 <= e && e <= 36) {
          var l = f[e], u = p[e];
          for (s = "", (c = this.clone()).negative = 0; !c.isZero();) {
            var c, h = c.modn(u).toString(e);
            s = (c = c.idivn(u)).isZero() ? h + s : d[l - h.length] + h + s;
          }
          for (this.isZero() && (s = "0" + s); s.length % t != 0;) s = "0" + s;
          return s = 0 !== this.negative ? "-" + s : s;
        }
        y(!1, "Base should be between 2 and 36");
      }, g.prototype.toNumber = function() {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && y(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e;
      }, g.prototype.toJSON = function() {
        return this.toString(16);
      }, g.prototype.toBuffer = function(e, t) {
        return y(void 0 !== i), this.toArrayLike(i, e, t);
      }, g.prototype.toArray = function(e, t) {
        return this.toArrayLike(Array, e, t);
      }, g.prototype.toArrayLike = function(e, t, r) {
        var i = this.byteLength(), n = r || Math.max(1, i);
        y(i <= n, "byte array longer than desired length"), y(0 < n, "Requested array length <= 0"), this.strip();
        var o, a, t = "le" === t, s = new e(n), l = this.clone();
        if (t) {
          for (a = 0; !l.isZero(); a++) o = l.andln(255), l.iushrn(8), s[a] = o;
          for (; a < n; a++) s[a] = 0;
        } else {
          for (a = 0; a < n - i; a++) s[a] = 0;
          for (a = 0; !l.isZero(); a++) o = l.andln(255), l.iushrn(8), s[n - a - 1] = o;
        }
        return s;
      }, Math.clz32 ? g.prototype._countBits = function(e) {
        return 32 - Math.clz32(e);
      } : g.prototype._countBits = function(e) {
        var t = e, e = 0;
        return 4096 <= t && (e += 13, t >>>= 13), 64 <= t && (e += 7, t >>>= 7), 8 <= t && (e += 4, t >>>= 4), 2 <= t && (e += 2, t >>>= 2), e + t;
      }, g.prototype._zeroBits = function(e) {
        if (0 === e) return 26;
        var t = e, e = 0;
        return 0 == (8191 & t) && (e += 13, t >>>= 13), 0 == (127 & t) && (e += 7, t >>>= 7), 0 == (15 & t) && (e += 4, t >>>= 4), 0 == (3 & t) && (e += 2, t >>>= 2), 0 == (1 & t) && e++, e;
      }, g.prototype.bitLength = function() {
        var e = this.words[this.length - 1], e = this._countBits(e);
        return 26 * (this.length - 1) + e;
      }, g.prototype.zeroBits = function() {
        if (this.isZero()) return 0;
        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);
          if (e += r, 26 !== r) break;
        }
        return e;
      }, g.prototype.byteLength = function() {
        return Math.ceil(this.bitLength() / 8);
      }, g.prototype.toTwos = function(e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
      }, g.prototype.fromTwos = function(e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
      }, g.prototype.isNeg = function() {
        return 0 !== this.negative;
      }, g.prototype.neg = function() {
        return this.clone().ineg();
      }, g.prototype.ineg = function() {
        return this.isZero() || (this.negative ^= 1), this;
      }, g.prototype.iuor = function(e) {
        for (; this.length < e.length;) this.words[this.length++] = 0;
        for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
        return this.strip();
      }, g.prototype.ior = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuor(e);
      }, g.prototype.or = function(e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
      }, g.prototype.uor = function(e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
      }, g.prototype.iuand = function(e) {
        for (var t = this.length > e.length ? e : this, r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
        return this.length = t.length, this.strip();
      }, g.prototype.iand = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuand(e);
      }, g.prototype.and = function(e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
      }, g.prototype.uand = function(e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
      }, g.prototype.iuxor = function(e) {
        for (var t, r = this.length > e.length ? (t = this, e) : (t = e, this), i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
        if (this !== t) for (; i < t.length; i++) this.words[i] = t.words[i];
        return this.length = t.length, this.strip();
      }, g.prototype.ixor = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuxor(e);
      }, g.prototype.xor = function(e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
      }, g.prototype.uxor = function(e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
      }, g.prototype.inotn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = 0 | Math.ceil(e / 26), e = e % 26;
        this._expand(t), 0 < e && t--;
        for (var r = 0; r < t; r++) this.words[r] = 67108863 & ~this.words[r];
        return 0 < e && (this.words[r] = ~this.words[r] & 67108863 >> 26 - e), this.strip();
      }, g.prototype.notn = function(e) {
        return this.clone().inotn(e);
      }, g.prototype.setn = function(e, t) {
        y("number" == typeof e && 0 <= e);
        var r = e / 26 | 0, e = e % 26;
        return this._expand(1 + r), this.words[r] = t ? this.words[r] | 1 << e : this.words[r] & ~(1 << e), this.strip();
      }, g.prototype.iadd = function(e) {
        var t, r;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        for (var i = this.length > e.length ? (r = this, e) : (r = e, this), n = 0, o = 0; o < i.length; o++) t = (0 | r.words[o]) + (0 | i.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        for (; 0 !== n && o < r.length; o++) t = (0 | r.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++; else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o];
        return this;
      }, g.prototype.add = function(e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
      }, g.prototype.isub = function(e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign();
        }
        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r, i = this.cmp(e);
        if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        for (var n = 0 < i ? (r = this, e) : (r = e, this), o = 0, a = 0; a < n.length; a++) o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        for (; 0 !== o && a < r.length; a++) o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) this.words[a] = r.words[a];
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this.strip();
      }, g.prototype.sub = function(e) {
        return this.clone().isub(e);
      };
      var a = function(e, t, r) {
        var i = e.words, n = t.words, o = r.words, a = 0 | i[0], s = 8191 & a, l = a >>> 13, u = 0 | i[1], c = 8191 & u,
          h = u >>> 13, d = 0 | i[2], f = 8191 & d, p = d >>> 13, y = 0 | i[3], g = 8191 & y, m = y >>> 13,
          b = 0 | i[4], _ = 8191 & b, v = b >>> 13, w = 0 | i[5], S = 8191 & w, E = w >>> 13, T = 0 | i[6],
          x = 8191 & T, M = T >>> 13, k = 0 | i[7], P = 8191 & k, C = k >>> 13, A = 0 | i[8], I = 8191 & A,
          R = A >>> 13, L = 0 | i[9], D = 8191 & L, B = L >>> 13, O = 0 | n[0], U = 8191 & O, N = O >>> 13,
          H = 0 | n[1], j = 8191 & H, F = H >>> 13, q = 0 | n[2], V = 8191 & q, z = q >>> 13, K = 0 | n[3],
          W = 8191 & K, X = K >>> 13, G = 0 | n[4], Y = 8191 & G, J = G >>> 13, Q = 0 | n[5], Z = 8191 & Q,
          $ = Q >>> 13, a = 0 | n[6], u = 8191 & a, d = a >>> 13, y = 0 | n[7], b = 8191 & y, w = y >>> 13,
          T = 0 | n[8], k = 8191 & T, A = T >>> 13, i = 0 | n[9], L = 8191 & i, O = i >>> 13;
        r.negative = e.negative ^ t.negative, r.length = 19;
        var K = (0 + Math.imul(s, U) | 0) + ((8191 & (q = (q = Math.imul(s, N)) + Math.imul(l, U) | 0)) << 13) | 0,
          ee = ((G = Math.imul(l, N)) + (q >>> 13) | 0) + (K >>> 26) | 0;
        K &= 67108863, H = Math.imul(c, U), q = (q = Math.imul(c, N)) + Math.imul(h, U) | 0, G = Math.imul(h, N);
        Q = (ee + (H + Math.imul(s, j) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, F) | 0) + Math.imul(l, j) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, F) | 0) + (q >>> 13) | 0) + (Q >>> 26) | 0, Q &= 67108863, H = Math.imul(f, U), q = (q = Math.imul(f, N)) + Math.imul(p, U) | 0, G = Math.imul(p, N), H = H + Math.imul(c, j) | 0, q = (q = q + Math.imul(c, F) | 0) + Math.imul(h, j) | 0, G = G + Math.imul(h, F) | 0;
        a = (ee + (H + Math.imul(s, V) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, z) | 0) + Math.imul(l, V) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, z) | 0) + (q >>> 13) | 0) + (a >>> 26) | 0, a &= 67108863, H = Math.imul(g, U), q = (q = Math.imul(g, N)) + Math.imul(m, U) | 0, G = Math.imul(m, N), H = H + Math.imul(f, j) | 0, q = (q = q + Math.imul(f, F) | 0) + Math.imul(p, j) | 0, G = G + Math.imul(p, F) | 0, H = H + Math.imul(c, V) | 0, q = (q = q + Math.imul(c, z) | 0) + Math.imul(h, V) | 0, G = G + Math.imul(h, z) | 0;
        y = (ee + (H + Math.imul(s, W) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, X) | 0) + Math.imul(l, W) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, X) | 0) + (q >>> 13) | 0) + (y >>> 26) | 0, y &= 67108863, H = Math.imul(_, U), q = (q = Math.imul(_, N)) + Math.imul(v, U) | 0, G = Math.imul(v, N), H = H + Math.imul(g, j) | 0, q = (q = q + Math.imul(g, F) | 0) + Math.imul(m, j) | 0, G = G + Math.imul(m, F) | 0, H = H + Math.imul(f, V) | 0, q = (q = q + Math.imul(f, z) | 0) + Math.imul(p, V) | 0, G = G + Math.imul(p, z) | 0, H = H + Math.imul(c, W) | 0, q = (q = q + Math.imul(c, X) | 0) + Math.imul(h, W) | 0, G = G + Math.imul(h, X) | 0;
        T = (ee + (H + Math.imul(s, Y) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, J) | 0) + Math.imul(l, Y) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, J) | 0) + (q >>> 13) | 0) + (T >>> 26) | 0, T &= 67108863, H = Math.imul(S, U), q = (q = Math.imul(S, N)) + Math.imul(E, U) | 0, G = Math.imul(E, N), H = H + Math.imul(_, j) | 0, q = (q = q + Math.imul(_, F) | 0) + Math.imul(v, j) | 0, G = G + Math.imul(v, F) | 0, H = H + Math.imul(g, V) | 0, q = (q = q + Math.imul(g, z) | 0) + Math.imul(m, V) | 0, G = G + Math.imul(m, z) | 0, H = H + Math.imul(f, W) | 0, q = (q = q + Math.imul(f, X) | 0) + Math.imul(p, W) | 0, G = G + Math.imul(p, X) | 0, H = H + Math.imul(c, Y) | 0, q = (q = q + Math.imul(c, J) | 0) + Math.imul(h, Y) | 0, G = G + Math.imul(h, J) | 0;
        n = (ee + (H + Math.imul(s, Z) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, $) | 0) + Math.imul(l, Z) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, $) | 0) + (q >>> 13) | 0) + (n >>> 26) | 0, n &= 67108863, H = Math.imul(x, U), q = (q = Math.imul(x, N)) + Math.imul(M, U) | 0, G = Math.imul(M, N), H = H + Math.imul(S, j) | 0, q = (q = q + Math.imul(S, F) | 0) + Math.imul(E, j) | 0, G = G + Math.imul(E, F) | 0, H = H + Math.imul(_, V) | 0, q = (q = q + Math.imul(_, z) | 0) + Math.imul(v, V) | 0, G = G + Math.imul(v, z) | 0, H = H + Math.imul(g, W) | 0, q = (q = q + Math.imul(g, X) | 0) + Math.imul(m, W) | 0, G = G + Math.imul(m, X) | 0, H = H + Math.imul(f, Y) | 0, q = (q = q + Math.imul(f, J) | 0) + Math.imul(p, Y) | 0, G = G + Math.imul(p, J) | 0, H = H + Math.imul(c, Z) | 0, q = (q = q + Math.imul(c, $) | 0) + Math.imul(h, Z) | 0, G = G + Math.imul(h, $) | 0;
        i = (ee + (H + Math.imul(s, u) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, d) | 0) + Math.imul(l, u) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, d) | 0) + (q >>> 13) | 0) + (i >>> 26) | 0, i &= 67108863, H = Math.imul(P, U), q = (q = Math.imul(P, N)) + Math.imul(C, U) | 0, G = Math.imul(C, N), H = H + Math.imul(x, j) | 0, q = (q = q + Math.imul(x, F) | 0) + Math.imul(M, j) | 0, G = G + Math.imul(M, F) | 0, H = H + Math.imul(S, V) | 0, q = (q = q + Math.imul(S, z) | 0) + Math.imul(E, V) | 0, G = G + Math.imul(E, z) | 0, H = H + Math.imul(_, W) | 0, q = (q = q + Math.imul(_, X) | 0) + Math.imul(v, W) | 0, G = G + Math.imul(v, X) | 0, H = H + Math.imul(g, Y) | 0, q = (q = q + Math.imul(g, J) | 0) + Math.imul(m, Y) | 0, G = G + Math.imul(m, J) | 0, H = H + Math.imul(f, Z) | 0, q = (q = q + Math.imul(f, $) | 0) + Math.imul(p, Z) | 0, G = G + Math.imul(p, $) | 0, H = H + Math.imul(c, u) | 0, q = (q = q + Math.imul(c, d) | 0) + Math.imul(h, u) | 0, G = G + Math.imul(h, d) | 0;
        e = (ee + (H + Math.imul(s, b) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, w) | 0) + Math.imul(l, b) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, w) | 0) + (q >>> 13) | 0) + (e >>> 26) | 0, e &= 67108863, H = Math.imul(I, U), q = (q = Math.imul(I, N)) + Math.imul(R, U) | 0, G = Math.imul(R, N), H = H + Math.imul(P, j) | 0, q = (q = q + Math.imul(P, F) | 0) + Math.imul(C, j) | 0, G = G + Math.imul(C, F) | 0, H = H + Math.imul(x, V) | 0, q = (q = q + Math.imul(x, z) | 0) + Math.imul(M, V) | 0, G = G + Math.imul(M, z) | 0, H = H + Math.imul(S, W) | 0, q = (q = q + Math.imul(S, X) | 0) + Math.imul(E, W) | 0, G = G + Math.imul(E, X) | 0, H = H + Math.imul(_, Y) | 0, q = (q = q + Math.imul(_, J) | 0) + Math.imul(v, Y) | 0, G = G + Math.imul(v, J) | 0, H = H + Math.imul(g, Z) | 0, q = (q = q + Math.imul(g, $) | 0) + Math.imul(m, Z) | 0, G = G + Math.imul(m, $) | 0, H = H + Math.imul(f, u) | 0, q = (q = q + Math.imul(f, d) | 0) + Math.imul(p, u) | 0, G = G + Math.imul(p, d) | 0, H = H + Math.imul(c, b) | 0, q = (q = q + Math.imul(c, w) | 0) + Math.imul(h, b) | 0, G = G + Math.imul(h, w) | 0;
        t = (ee + (H + Math.imul(s, k) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, A) | 0) + Math.imul(l, k) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, A) | 0) + (q >>> 13) | 0) + (t >>> 26) | 0, t &= 67108863, H = Math.imul(D, U), q = (q = Math.imul(D, N)) + Math.imul(B, U) | 0, G = Math.imul(B, N), H = H + Math.imul(I, j) | 0, q = (q = q + Math.imul(I, F) | 0) + Math.imul(R, j) | 0, G = G + Math.imul(R, F) | 0, H = H + Math.imul(P, V) | 0, q = (q = q + Math.imul(P, z) | 0) + Math.imul(C, V) | 0, G = G + Math.imul(C, z) | 0, H = H + Math.imul(x, W) | 0, q = (q = q + Math.imul(x, X) | 0) + Math.imul(M, W) | 0, G = G + Math.imul(M, X) | 0, H = H + Math.imul(S, Y) | 0, q = (q = q + Math.imul(S, J) | 0) + Math.imul(E, Y) | 0, G = G + Math.imul(E, J) | 0, H = H + Math.imul(_, Z) | 0, q = (q = q + Math.imul(_, $) | 0) + Math.imul(v, Z) | 0, G = G + Math.imul(v, $) | 0, H = H + Math.imul(g, u) | 0, q = (q = q + Math.imul(g, d) | 0) + Math.imul(m, u) | 0, G = G + Math.imul(m, d) | 0, H = H + Math.imul(f, b) | 0, q = (q = q + Math.imul(f, w) | 0) + Math.imul(p, b) | 0, G = G + Math.imul(p, w) | 0, H = H + Math.imul(c, k) | 0, q = (q = q + Math.imul(c, A) | 0) + Math.imul(h, k) | 0, G = G + Math.imul(h, A) | 0;
        s = (ee + (H + Math.imul(s, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, O) | 0) + Math.imul(l, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, O) | 0) + (q >>> 13) | 0) + (s >>> 26) | 0, s &= 67108863, H = Math.imul(D, j), q = (q = Math.imul(D, F)) + Math.imul(B, j) | 0, G = Math.imul(B, F), H = H + Math.imul(I, V) | 0, q = (q = q + Math.imul(I, z) | 0) + Math.imul(R, V) | 0, G = G + Math.imul(R, z) | 0, H = H + Math.imul(P, W) | 0, q = (q = q + Math.imul(P, X) | 0) + Math.imul(C, W) | 0, G = G + Math.imul(C, X) | 0, H = H + Math.imul(x, Y) | 0, q = (q = q + Math.imul(x, J) | 0) + Math.imul(M, Y) | 0, G = G + Math.imul(M, J) | 0, H = H + Math.imul(S, Z) | 0, q = (q = q + Math.imul(S, $) | 0) + Math.imul(E, Z) | 0, G = G + Math.imul(E, $) | 0, H = H + Math.imul(_, u) | 0, q = (q = q + Math.imul(_, d) | 0) + Math.imul(v, u) | 0, G = G + Math.imul(v, d) | 0, H = H + Math.imul(g, b) | 0, q = (q = q + Math.imul(g, w) | 0) + Math.imul(m, b) | 0, G = G + Math.imul(m, w) | 0, H = H + Math.imul(f, k) | 0, q = (q = q + Math.imul(f, A) | 0) + Math.imul(p, k) | 0, G = G + Math.imul(p, A) | 0;
        c = (ee + (H + Math.imul(c, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(c, O) | 0) + Math.imul(h, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(h, O) | 0) + (q >>> 13) | 0) + (c >>> 26) | 0, c &= 67108863, H = Math.imul(D, V), q = (q = Math.imul(D, z)) + Math.imul(B, V) | 0, G = Math.imul(B, z), H = H + Math.imul(I, W) | 0, q = (q = q + Math.imul(I, X) | 0) + Math.imul(R, W) | 0, G = G + Math.imul(R, X) | 0, H = H + Math.imul(P, Y) | 0, q = (q = q + Math.imul(P, J) | 0) + Math.imul(C, Y) | 0, G = G + Math.imul(C, J) | 0, H = H + Math.imul(x, Z) | 0, q = (q = q + Math.imul(x, $) | 0) + Math.imul(M, Z) | 0, G = G + Math.imul(M, $) | 0, H = H + Math.imul(S, u) | 0, q = (q = q + Math.imul(S, d) | 0) + Math.imul(E, u) | 0, G = G + Math.imul(E, d) | 0, H = H + Math.imul(_, b) | 0, q = (q = q + Math.imul(_, w) | 0) + Math.imul(v, b) | 0, G = G + Math.imul(v, w) | 0, H = H + Math.imul(g, k) | 0, q = (q = q + Math.imul(g, A) | 0) + Math.imul(m, k) | 0, G = G + Math.imul(m, A) | 0;
        f = (ee + (H + Math.imul(f, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(f, O) | 0) + Math.imul(p, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(p, O) | 0) + (q >>> 13) | 0) + (f >>> 26) | 0, f &= 67108863, H = Math.imul(D, W), q = (q = Math.imul(D, X)) + Math.imul(B, W) | 0, G = Math.imul(B, X), H = H + Math.imul(I, Y) | 0, q = (q = q + Math.imul(I, J) | 0) + Math.imul(R, Y) | 0, G = G + Math.imul(R, J) | 0, H = H + Math.imul(P, Z) | 0, q = (q = q + Math.imul(P, $) | 0) + Math.imul(C, Z) | 0, G = G + Math.imul(C, $) | 0, H = H + Math.imul(x, u) | 0, q = (q = q + Math.imul(x, d) | 0) + Math.imul(M, u) | 0, G = G + Math.imul(M, d) | 0, H = H + Math.imul(S, b) | 0, q = (q = q + Math.imul(S, w) | 0) + Math.imul(E, b) | 0, G = G + Math.imul(E, w) | 0, H = H + Math.imul(_, k) | 0, q = (q = q + Math.imul(_, A) | 0) + Math.imul(v, k) | 0, G = G + Math.imul(v, A) | 0;
        g = (ee + (H + Math.imul(g, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(g, O) | 0) + Math.imul(m, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(m, O) | 0) + (q >>> 13) | 0) + (g >>> 26) | 0, g &= 67108863, H = Math.imul(D, Y), q = (q = Math.imul(D, J)) + Math.imul(B, Y) | 0, G = Math.imul(B, J), H = H + Math.imul(I, Z) | 0, q = (q = q + Math.imul(I, $) | 0) + Math.imul(R, Z) | 0, G = G + Math.imul(R, $) | 0, H = H + Math.imul(P, u) | 0, q = (q = q + Math.imul(P, d) | 0) + Math.imul(C, u) | 0, G = G + Math.imul(C, d) | 0, H = H + Math.imul(x, b) | 0, q = (q = q + Math.imul(x, w) | 0) + Math.imul(M, b) | 0, G = G + Math.imul(M, w) | 0, H = H + Math.imul(S, k) | 0, q = (q = q + Math.imul(S, A) | 0) + Math.imul(E, k) | 0, G = G + Math.imul(E, A) | 0;
        _ = (ee + (H + Math.imul(_, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(_, O) | 0) + Math.imul(v, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(v, O) | 0) + (q >>> 13) | 0) + (_ >>> 26) | 0, _ &= 67108863, H = Math.imul(D, Z), q = (q = Math.imul(D, $)) + Math.imul(B, Z) | 0, G = Math.imul(B, $), H = H + Math.imul(I, u) | 0, q = (q = q + Math.imul(I, d) | 0) + Math.imul(R, u) | 0, G = G + Math.imul(R, d) | 0, H = H + Math.imul(P, b) | 0, q = (q = q + Math.imul(P, w) | 0) + Math.imul(C, b) | 0, G = G + Math.imul(C, w) | 0, H = H + Math.imul(x, k) | 0, q = (q = q + Math.imul(x, A) | 0) + Math.imul(M, k) | 0, G = G + Math.imul(M, A) | 0;
        S = (ee + (H + Math.imul(S, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(S, O) | 0) + Math.imul(E, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(E, O) | 0) + (q >>> 13) | 0) + (S >>> 26) | 0, S &= 67108863, H = Math.imul(D, u), q = (q = Math.imul(D, d)) + Math.imul(B, u) | 0, G = Math.imul(B, d), H = H + Math.imul(I, b) | 0, q = (q = q + Math.imul(I, w) | 0) + Math.imul(R, b) | 0, G = G + Math.imul(R, w) | 0, H = H + Math.imul(P, k) | 0, q = (q = q + Math.imul(P, A) | 0) + Math.imul(C, k) | 0, G = G + Math.imul(C, A) | 0;
        x = (ee + (H + Math.imul(x, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(x, O) | 0) + Math.imul(M, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(M, O) | 0) + (q >>> 13) | 0) + (x >>> 26) | 0, x &= 67108863, H = Math.imul(D, b), q = (q = Math.imul(D, w)) + Math.imul(B, b) | 0, G = Math.imul(B, w), H = H + Math.imul(I, k) | 0, q = (q = q + Math.imul(I, A) | 0) + Math.imul(R, k) | 0, G = G + Math.imul(R, A) | 0;
        P = (ee + (H + Math.imul(P, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(P, O) | 0) + Math.imul(C, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(C, O) | 0) + (q >>> 13) | 0) + (P >>> 26) | 0, P &= 67108863, H = Math.imul(D, k), q = (q = Math.imul(D, A)) + Math.imul(B, k) | 0, G = Math.imul(B, A);
        I = (ee + (H + Math.imul(I, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(I, O) | 0) + Math.imul(R, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(R, O) | 0) + (q >>> 13) | 0) + (I >>> 26) | 0, I &= 67108863;
        L = (ee + Math.imul(D, L) | 0) + ((8191 & (q = (q = Math.imul(D, O)) + Math.imul(B, L) | 0)) << 13) | 0;
        return ee = ((G = Math.imul(B, O)) + (q >>> 13) | 0) + (L >>> 26) | 0, L &= 67108863, o[0] = K, o[1] = Q, o[2] = a, o[3] = y, o[4] = T, o[5] = n, o[6] = i, o[7] = e, o[8] = t, o[9] = s, o[10] = c, o[11] = f, o[12] = g, o[13] = _, o[14] = S, o[15] = x, o[16] = P, o[17] = I, o[18] = L, 0 != ee && (o[19] = ee, r.length++), r;
      };

      function l(e, t, r) {
        return (new u).mulp(e, t, r);
      }

      function u(e, t) {
        this.x = e, this.y = t;
      }

      Math.imul || (a = o), g.prototype.mulTo = function(e, t) {
        var r = this.length + e.length,
          t = (10 === this.length && 10 === e.length ? a : r < 63 ? o : r < 1024 ? function(e, t, r) {
            r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
            for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
              for (var a = n, n = 0, s = 67108863 & i, l = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= l; u++) {
                var c = (0 | e.words[o - u]) * (0 | t.words[u]), h = 67108863 & c, s = 67108863 & (h = h + s | 0);
                n += (a = (a = a + (c / 67108864 | 0) | 0) + (h >>> 26) | 0) >>> 26, a &= 67108863;
              }
              r.words[o] = s, i = a, a = n;
            }
            return 0 !== i ? r.words[o] = i : r.length--, r.strip();
          } : l)(this, e, t);
        return t;
      }, u.prototype.makeRBT = function(e) {
        for (var t = new Array(e), r = g.prototype._countBits(e) - 1, i = 0; i < e; i++) t[i] = this.revBin(i, r, e);
        return t;
      }, u.prototype.revBin = function(e, t, r) {
        if (0 === e || e === r - 1) return e;
        for (var i = 0, n = 0; n < t; n++) i |= (1 & e) << t - n - 1, e >>= 1;
        return i;
      }, u.prototype.permute = function(e, t, r, i, n, o) {
        for (var a = 0; a < o; a++) i[a] = t[e[a]], n[a] = r[e[a]];
      }, u.prototype.transform = function(e, t, r, i, n, o) {
        this.permute(o, e, t, r, i, n);
        for (var a = 1; a < n; a <<= 1) for (var s = a << 1, l = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), c = 0; c < n; c += s) for (var h = l, d = u, f = 0; f < a; f++) {
          var p = r[c + f], y = i[c + f], g = r[c + f + a], m = h * g - d * (b = i[c + f + a]), b = h * b + d * g;
          r[c + f] = p + (g = m), i[c + f] = y + b, r[c + f + a] = p - g, i[c + f + a] = y - b, f !== s && (m = l * h - u * d, d = l * d + u * h, h = m);
        }
      }, u.prototype.guessLen13b = function(e, t) {
        for (var e = 1 & (i = 1 | Math.max(t, e)), r = 0, i = i / 2 | 0; i; i >>>= 1) r++;
        return 1 << r + 1 + e;
      }, u.prototype.conjugate = function(e, t, r) {
        if (!(r <= 1)) for (var i = 0; i < r / 2; i++) {
          var n = e[i];
          e[i] = e[r - i - 1], e[r - i - 1] = n, n = t[i], t[i] = -t[r - i - 1], t[r - i - 1] = -n;
        }
      }, u.prototype.normalize13b = function(e, t) {
        for (var r = 0, i = 0; i < t / 2; i++) {
          var n = 8192 * Math.round(e[2 * i + 1] / t) + Math.round(e[2 * i] / t) + r;
          e[i] = 67108863 & n, r = n < 67108864 ? 0 : n / 67108864 | 0;
        }
        return e;
      }, u.prototype.convert13b = function(e, t, r, i) {
        for (var n = 0, o = 0; o < t; o++) n += 0 | e[o], r[2 * o] = 8191 & n, r[2 * o + 1] = 8191 & (n >>>= 13), n >>>= 13;
        for (o = 2 * t; o < i; ++o) r[o] = 0;
        y(0 === n), y(0 == (-8192 & n));
      }, u.prototype.stub = function(e) {
        for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
        return t;
      }, u.prototype.mulp = function(e, t, r) {
        var i = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(i), o = this.stub(i), a = new Array(i),
          s = new Array(i), l = new Array(i), u = new Array(i), c = new Array(i), h = new Array(i), d = r.words;
        d.length = i, this.convert13b(e.words, e.length, a, i), this.convert13b(t.words, t.length, u, i), this.transform(a, o, s, l, i, n), this.transform(u, o, c, h, i, n);
        for (var f = 0; f < i; f++) {
          var p = s[f] * c[f] - l[f] * h[f];
          l[f] = s[f] * h[f] + l[f] * c[f], s[f] = p;
        }
        return this.conjugate(s, l, i), this.transform(s, l, d, o, i, n), this.conjugate(d, o, i), this.normalize13b(d, i), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip();
      }, g.prototype.mul = function(e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t);
      }, g.prototype.mulf = function(e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), l(this, e, t);
      }, g.prototype.imul = function(e) {
        return this.clone().mulTo(e, this);
      }, g.prototype.imuln = function(e) {
        y("number" == typeof e), y(e < 67108864);
        for (var t = 0, r = 0; r < this.length; r++) {
          var i = (0 | this.words[r]) * e, n = (67108863 & i) + (67108863 & t);
          t >>= 26, t += i / 67108864 | 0, t += n >>> 26, this.words[r] = 67108863 & n;
        }
        return 0 !== t && (this.words[r] = t, this.length++), this;
      }, g.prototype.muln = function(e) {
        return this.clone().imuln(e);
      }, g.prototype.sqr = function() {
        return this.mul(this);
      }, g.prototype.isqr = function() {
        return this.imul(this.clone());
      }, g.prototype.pow = function(e) {
        var t = function(e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
            var i = r % 26;
            t[r] = (e.words[r / 26 | 0] & 1 << i) >>> i;
          }
          return t;
        }(e);
        if (0 === t.length) return new g(1);
        for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
        if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
        return r;
      }, g.prototype.iushln = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 67108863 >>> 26 - t << 26 - t;
        if (0 != t) {
          for (var n = 0, o = 0; o < this.length; o++) {
            var a = this.words[o] & i, s = (0 | this.words[o]) - a << t;
            this.words[o] = s | n, n = a >>> 26 - t;
          }
          n && (this.words[o] = n, this.length++);
        }
        if (0 != r) {
          for (o = this.length - 1; 0 <= o; o--) this.words[o + r] = this.words[o];
          for (o = 0; o < r; o++) this.words[o] = 0;
          this.length += r;
        }
        return this.strip();
      }, g.prototype.ishln = function(e) {
        return y(0 === this.negative), this.iushln(e);
      }, g.prototype.iushrn = function(e, t, r) {
        y("number" == typeof e && 0 <= e);
        var i = t ? (t - t % 26) / 26 : 0, n = e % 26, o = Math.min((e - n) / 26, this.length),
          a = 67108863 ^ 67108863 >>> n << n, s = r;
        if (i -= o, i = Math.max(0, i), s) {
          for (var l = 0; l < o; l++) s.words[l] = this.words[l];
          s.length = o;
        }
        if (0 !== o) if (this.length > o) for (this.length -= o, l = 0; l < this.length; l++) this.words[l] = this.words[l + o]; else this.words[0] = 0, this.length = 1;
        for (var u = 0, l = this.length - 1; 0 <= l && (0 !== u || i <= l); l--) {
          var c = 0 | this.words[l];
          this.words[l] = u << 26 - n | c >>> n, u = c & a;
        }
        return s && 0 !== u && (s.words[s.length++] = u), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip();
      }, g.prototype.ishrn = function(e, t, r) {
        return y(0 === this.negative), this.iushrn(e, t, r);
      }, g.prototype.shln = function(e) {
        return this.clone().ishln(e);
      }, g.prototype.ushln = function(e) {
        return this.clone().iushln(e);
      }, g.prototype.shrn = function(e) {
        return this.clone().ishrn(e);
      }, g.prototype.ushrn = function(e) {
        return this.clone().iushrn(e);
      }, g.prototype.testn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, e = (e - t) / 26;
        return !(this.length <= e) && !!(this.words[e] & 1 << t);
      }, g.prototype.imaskn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, e = (e - t) / 26;
        return y(0 === this.negative, "imaskn works only with positive numbers"), this.length <= e ? this : (0 != t && e++, this.length = Math.min(e, this.length), 0 != t && (this.words[this.length - 1] &= 67108863 ^ 67108863 >>> t << t), this.strip());
      }, g.prototype.maskn = function(e) {
        return this.clone().imaskn(e);
      }, g.prototype.iaddn = function(e) {
        return y("number" == typeof e), y(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(e), this.negative = 1), this) : this._iaddn(e);
      }, g.prototype._iaddn = function(e) {
        this.words[0] += e;
        for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        return this.length = Math.max(this.length, t + 1), this;
      }, g.prototype.isubn = function(e) {
        if (y("number" == typeof e), y(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, --this.words[t + 1];
        return this.strip();
      }, g.prototype.addn = function(e) {
        return this.clone().iaddn(e);
      }, g.prototype.subn = function(e) {
        return this.clone().isubn(e);
      }, g.prototype.iabs = function() {
        return this.negative = 0, this;
      }, g.prototype.abs = function() {
        return this.clone().iabs();
      }, g.prototype._ishlnsubmul = function(e, t, r) {
        var i = e.length + r;
        this._expand(i);
        for (var n = 0, o = 0; o < e.length; o++) {
          var a = (0 | this.words[o + r]) + n, s = (0 | e.words[o]) * t,
            n = ((a -= 67108863 & s) >> 26) - (s / 67108864 | 0);
          this.words[o + r] = 67108863 & a;
        }
        for (; o < this.length - r; o++) n = (a = (0 | this.words[o + r]) + n) >> 26, this.words[o + r] = 67108863 & a;
        if (0 === n) return this.strip();
        for (y(-1 === n), o = n = 0; o < this.length; o++) n = (a = -(0 | this.words[o]) + n) >> 26, this.words[o] = 67108863 & a;
        return this.negative = 1, this.strip();
      }, g.prototype._wordDiv = function(e, t) {
        var r = this.length - e.length, i = this.clone(), n = e, o = 0 | n.words[n.length - 1];
        0 != (r = 26 - this._countBits(o)) && (n = n.ushln(r), i.iushln(r), o = 0 | n.words[n.length - 1]);
        var a, s = i.length - n.length;
        if ("mod" !== t) {
          (a = new g(null)).length = 1 + s, a.words = new Array(a.length);
          for (var l = 0; l < a.length; l++) a.words[l] = 0;
        }
        e = i.clone()._ishlnsubmul(n, 1, s);
        0 === e.negative && (i = e, a && (a.words[s] = 1));
        for (var u = s - 1; 0 <= u; u--) {
          var c = 67108864 * (0 | i.words[n.length + u]) + (0 | i.words[n.length + u - 1]),
            c = Math.min(c / o | 0, 67108863);
          for (i._ishlnsubmul(n, c, u); 0 !== i.negative;) c--, i.negative = 0, i._ishlnsubmul(n, 1, u), i.isZero() || (i.negative ^= 1);
          a && (a.words[u] = c);
        }
        return a && a.strip(), i.strip(), "div" !== t && 0 != r && i.iushrn(r), { div: a || null, mod: i };
      }, g.prototype.divmod = function(e, t, r) {
        return y(!e.isZero()), this.isZero() ? {
          div: new g(0),
          mod: new g(0)
        } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (i = o.div.neg()), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.iadd(e)), {
          div: i,
          mod: n
        }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), {
          div: i = "mod" !== t ? o.div.neg() : i,
          mod: o.mod
        }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.isub(e)), {
          div: o.div,
          mod: n
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new g(0),
          mod: this
        } : 1 === e.length ? "div" === t ? { div: this.divn(e.words[0]), mod: null } : "mod" === t ? {
          div: null,
          mod: new g(this.modn(e.words[0]))
        } : { div: this.divn(e.words[0]), mod: new g(this.modn(e.words[0])) } : this._wordDiv(e, t);
        var i, n, o;
      }, g.prototype.div = function(e) {
        return this.divmod(e, "div", !1).div;
      }, g.prototype.mod = function(e) {
        return this.divmod(e, "mod", !1).mod;
      }, g.prototype.umod = function(e) {
        return this.divmod(e, "mod", !0).mod;
      }, g.prototype.divRound = function(e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), e = e.andln(1), i = r.cmp(i);
        return i < 0 || 1 === e && 0 === i ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
      }, g.prototype.modn = function(e) {
        y(e <= 67108863);
        for (var t = (1 << 26) % e, r = 0, i = this.length - 1; 0 <= i; i--) r = (t * r + (0 | this.words[i])) % e;
        return r;
      }, g.prototype.idivn = function(e) {
        y(e <= 67108863);
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = (0 | this.words[r]) + 67108864 * t;
          this.words[r] = i / e | 0, t = i % e;
        }
        return this.strip();
      }, g.prototype.divn = function(e) {
        return this.clone().idivn(e);
      }, g.prototype.egcd = function(e) {
        y(0 === e.negative), y(!e.isZero());
        for (var t = this, r = e.clone(), t = 0 !== t.negative ? t.umod(e) : t.clone(), i = new g(1), n = new g(0), o = new g(0), a = new g(1), s = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++s;
        for (var l = r.clone(), u = t.clone(); !t.isZero();) {
          for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1) ;
          if (0 < c) for (t.iushrn(c); 0 < c--;) (i.isOdd() || n.isOdd()) && (i.iadd(l), n.isub(u)), i.iushrn(1), n.iushrn(1);
          for (var d = 0, f = 1; 0 == (r.words[0] & f) && d < 26; ++d, f <<= 1) ;
          if (0 < d) for (r.iushrn(d); 0 < d--;) (o.isOdd() || a.isOdd()) && (o.iadd(l), a.isub(u)), o.iushrn(1), a.iushrn(1);
          0 <= t.cmp(r) ? (t.isub(r), i.isub(o), n.isub(a)) : (r.isub(t), o.isub(i), a.isub(n));
        }
        return { a: o, b: a, gcd: r.iushln(s) };
      }, g.prototype._invmp = function(e) {
        y(0 === e.negative), y(!e.isZero());
        for (var t, r = this, i = e.clone(), r = 0 !== r.negative ? r.umod(e) : r.clone(), n = new g(1), o = new g(0), a = i.clone(); 0 < r.cmpn(1) && 0 < i.cmpn(1);) {
          for (var s = 0, l = 1; 0 == (r.words[0] & l) && s < 26; ++s, l <<= 1) ;
          if (0 < s) for (r.iushrn(s); 0 < s--;) n.isOdd() && n.iadd(a), n.iushrn(1);
          for (var u = 0, c = 1; 0 == (i.words[0] & c) && u < 26; ++u, c <<= 1) ;
          if (0 < u) for (i.iushrn(u); 0 < u--;) o.isOdd() && o.iadd(a), o.iushrn(1);
          0 <= r.cmp(i) ? (r.isub(i), n.isub(o)) : (i.isub(r), o.isub(n));
        }
        return (t = 0 === r.cmpn(1) ? n : o).cmpn(0) < 0 && t.iadd(e), t;
      }, g.prototype.gcd = function(e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(), r = e.clone();
        t.negative = 0;
        for (var i = r.negative = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1);
        for (; ;) {
          for (; t.isEven();) t.iushrn(1);
          for (; r.isEven();) r.iushrn(1);
          var n = t.cmp(r);
          if (n < 0) var o = t, t = r, r = o; else if (0 === n || 0 === r.cmpn(1)) break;
          t.isub(r);
        }
        return r.iushln(i);
      }, g.prototype.invm = function(e) {
        return this.egcd(e).a.umod(e);
      }, g.prototype.isEven = function() {
        return 0 == (1 & this.words[0]);
      }, g.prototype.isOdd = function() {
        return 1 == (1 & this.words[0]);
      }, g.prototype.andln = function(e) {
        return this.words[0] & e;
      }, g.prototype.bincn = function(e) {
        y("number" == typeof e);
        var t = e % 26, e = (e - t) / 26, t = 1 << t;
        if (this.length <= e) return this._expand(1 + e), this.words[e] |= t, this;
        for (var r = t, i = e; 0 !== r && i < this.length; i++) {
          var n = 0 | this.words[i], r = (n += r) >>> 26;
          n &= 67108863, this.words[i] = n;
        }
        return 0 !== r && (this.words[i] = r, this.length++), this;
      }, g.prototype.isZero = function() {
        return 1 === this.length && 0 === this.words[0];
      }, g.prototype.cmpn = function(e) {
        var t = e < 0;
        return 0 === this.negative || t ? 0 === this.negative && t ? 1 : (this.strip(), e = 1 < this.length ? 1 : (y((e = t ? -e : e) <= 67108863, "Number is too big"), (t = 0 | this.words[0]) === e ? 0 : t < e ? -1 : 1), 0 !== this.negative ? 0 | -e : e) : -1;
      }, g.prototype.cmp = function(e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        e = this.ucmp(e);
        return 0 !== this.negative ? 0 | -e : e;
      }, g.prototype.ucmp = function(e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = 0 | this.words[r], n = 0 | e.words[r];
          if (i != n) {
            i < n ? t = -1 : n < i && (t = 1);
            break;
          }
        }
        return t;
      }, g.prototype.gtn = function(e) {
        return 1 === this.cmpn(e);
      }, g.prototype.gt = function(e) {
        return 1 === this.cmp(e);
      }, g.prototype.gten = function(e) {
        return 0 <= this.cmpn(e);
      }, g.prototype.gte = function(e) {
        return 0 <= this.cmp(e);
      }, g.prototype.ltn = function(e) {
        return -1 === this.cmpn(e);
      }, g.prototype.lt = function(e) {
        return -1 === this.cmp(e);
      }, g.prototype.lten = function(e) {
        return this.cmpn(e) <= 0;
      }, g.prototype.lte = function(e) {
        return this.cmp(e) <= 0;
      }, g.prototype.eqn = function(e) {
        return 0 === this.cmpn(e);
      }, g.prototype.eq = function(e) {
        return 0 === this.cmp(e);
      }, g.red = function(e) {
        return new S(e);
      }, g.prototype.toRed = function(e) {
        return y(!this.red, "Already a number in reduction context"), y(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e);
      }, g.prototype.fromRed = function() {
        return y(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, g.prototype._forceRed = function(e) {
        return this.red = e, this;
      }, g.prototype.forceRed = function(e) {
        return y(!this.red, "Already a number in reduction context"), this._forceRed(e);
      }, g.prototype.redAdd = function(e) {
        return y(this.red, "redAdd works only with red numbers"), this.red.add(this, e);
      }, g.prototype.redIAdd = function(e) {
        return y(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);
      }, g.prototype.redSub = function(e) {
        return y(this.red, "redSub works only with red numbers"), this.red.sub(this, e);
      }, g.prototype.redISub = function(e) {
        return y(this.red, "redISub works only with red numbers"), this.red.isub(this, e);
      }, g.prototype.redShl = function(e) {
        return y(this.red, "redShl works only with red numbers"), this.red.shl(this, e);
      }, g.prototype.redMul = function(e) {
        return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e);
      }, g.prototype.redIMul = function(e) {
        return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e);
      }, g.prototype.redSqr = function() {
        return y(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, g.prototype.redISqr = function() {
        return y(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, g.prototype.redSqrt = function() {
        return y(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, g.prototype.redInvm = function() {
        return y(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, g.prototype.redNeg = function() {
        return y(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, g.prototype.redPow = function(e) {
        return y(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);
      };
      var c = { k256: null, p224: null, p192: null, p25519: null };

      function m(e, t) {
        this.name = e, this.p = new g(t, 16), this.n = this.p.bitLength(), this.k = new g(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }

      function b() {
        m.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
      }

      function _() {
        m.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
      }

      function v() {
        m.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
      }

      function w() {
        m.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
      }

      function S(e) {
        var t;
        "string" == typeof e ? (t = g._prime(e), this.m = t.p, this.prime = t) : (y(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null);
      }

      function E(e) {
        S.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new g(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }

      m.prototype._tmp = function() {
        var e = new g(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e;
      }, m.prototype.ireduce = function(e) {
        for (var t, r = e; this.split(r, this.tmp), (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()) > this.n;) ;
        e = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === e ? (r.words[0] = 0, r.length = 1) : 0 < e ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r;
      }, m.prototype.split = function(e, t) {
        e.iushrn(this.n, 0, t);
      }, m.prototype.imulK = function(e) {
        return e.imul(this.k);
      }, r(b, m), b.prototype.split = function(e, t) {
        for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var n = e.words[9];
        for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) {
          var o = 0 | e.words[i];
          e.words[i - 10] = (4194303 & o) << 4 | n >>> 22, n = o;
        }
        0 === (e.words[i - 10] = n >>>= 22) && 10 < e.length ? e.length -= 10 : e.length -= 9;
      }, b.prototype.imulK = function(e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 0 | e.words[r];
          t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0);
        }
        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e;
      }, r(_, m), r(v, m), r(w, m), w.prototype.imulK = function(e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
          i >>>= 26, e.words[r] = n, t = i;
        }
        return 0 !== t && (e.words[e.length++] = t), e;
      }, g._prime = function(e) {
        if (c[e]) return c[e];
        var t;
        if ("k256" === e) t = new b; else if ("p224" === e) t = new _; else if ("p192" === e) t = new v; else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new w;
        }
        return c[e] = t;
      }, S.prototype._verify1 = function(e) {
        y(0 === e.negative, "red works only with positives"), y(e.red, "red works only with red numbers");
      }, S.prototype._verify2 = function(e, t) {
        y(0 == (e.negative | t.negative), "red works only with positives"), y(e.red && e.red === t.red, "red works only with red numbers");
      }, S.prototype.imod = function(e) {
        return (this.prime ? this.prime.ireduce(e) : e.umod(this.m))._forceRed(this);
      }, S.prototype.neg = function(e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
      }, S.prototype.add = function(e, t) {
        this._verify2(e, t);
        t = e.add(t);
        return 0 <= t.cmp(this.m) && t.isub(this.m), t._forceRed(this);
      }, S.prototype.iadd = function(e, t) {
        this._verify2(e, t);
        t = e.iadd(t);
        return 0 <= t.cmp(this.m) && t.isub(this.m), t;
      }, S.prototype.sub = function(e, t) {
        this._verify2(e, t);
        t = e.sub(t);
        return t.cmpn(0) < 0 && t.iadd(this.m), t._forceRed(this);
      }, S.prototype.isub = function(e, t) {
        this._verify2(e, t);
        t = e.isub(t);
        return t.cmpn(0) < 0 && t.iadd(this.m), t;
      }, S.prototype.shl = function(e, t) {
        return this._verify1(e), this.imod(e.ushln(t));
      }, S.prototype.imul = function(e, t) {
        return this._verify2(e, t), this.imod(e.imul(t));
      }, S.prototype.mul = function(e, t) {
        return this._verify2(e, t), this.imod(e.mul(t));
      }, S.prototype.isqr = function(e) {
        return this.imul(e, e.clone());
      }, S.prototype.sqr = function(e) {
        return this.mul(e, e);
      }, S.prototype.sqrt = function(e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);
        if (y(t % 2 == 1), 3 === t) {
          t = this.m.add(new g(1)).iushrn(2);
          return this.pow(e, t);
        }
        for (var r = this.m.subn(1), i = 0; !r.isZero() && 0 === r.andln(1);) i++, r.iushrn(1);
        y(!r.isZero());
        for (var n = new g(1).toRed(this), o = n.redNeg(), a = this.m.subn(1).iushrn(1), s = new g(2 * (s = this.m.bitLength()) * s).toRed(this); 0 !== this.pow(s, a).cmp(o);) s.redIAdd(o);
        for (var l = this.pow(s, r), u = this.pow(e, r.addn(1).iushrn(1)), c = this.pow(e, r), h = i; 0 !== c.cmp(n);) {
          for (var d = c, f = 0; 0 !== d.cmp(n); f++) d = d.redSqr();
          y(f < h);
          var p = this.pow(l, new g(1).iushln(h - f - 1)), u = u.redMul(p), l = p.redSqr(), c = c.redMul(l), h = f;
        }
        return u;
      }, S.prototype.invm = function(e) {
        e = e._invmp(this.m);
        return 0 !== e.negative ? (e.negative = 0, this.imod(e).redNeg()) : this.imod(e);
      }, S.prototype.pow = function(e, t) {
        if (t.isZero()) return new g(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new g(1).toRed(this), r[1] = e;
        for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
        var n = r[0], o = 0, a = 0, s = t.bitLength() % 26;
        for (0 === s && (s = 26), i = t.length - 1; 0 <= i; i--) {
          for (var l = t.words[i], u = s - 1; 0 <= u; u--) {
            var c = l >> u & 1;
            n !== r[0] && (n = this.sqr(n)), 0 != c || 0 !== o ? (o <<= 1, o |= c, (4 === ++a || 0 === i && 0 === u) && (n = this.mul(n, r[o]), o = a = 0)) : a = 0;
          }
          s = 26;
        }
        return n;
      }, S.prototype.convertTo = function(e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t;
      }, S.prototype.convertFrom = function(e) {
        e = e.clone();
        return e.red = null, e;
      }, g.mont = function(e) {
        return new E(e);
      }, r(E, S), E.prototype.convertTo = function(e) {
        return this.imod(e.ushln(this.shift));
      }, E.prototype.convertFrom = function(e) {
        e = this.imod(e.mul(this.rinv));
        return e.red = null, e;
      }, E.prototype.imul = function(e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        e = e.imul(t), t = e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), e = e.isub(t).iushrn(this.shift), t = e;
        return 0 <= e.cmp(this.m) ? t = e.isub(this.m) : e.cmpn(0) < 0 && (t = e.iadd(this.m)), t._forceRed(this);
      }, E.prototype.mul = function(e, t) {
        if (e.isZero() || t.isZero()) return new g(0)._forceRed(this);
        e = e.mul(t), t = e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), e = e.isub(t).iushrn(this.shift), t = e;
        return 0 <= e.cmp(this.m) ? t = e.isub(this.m) : e.cmpn(0) < 0 && (t = e.iadd(this.m)), t._forceRed(this);
      }, E.prototype.invm = function(e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
      };
    }(void 0 === e || e, this);
  }, { buffer: 19 }],
  16: [function(e, t, r) {
    "use strict";
    r.byteLength = function(e) {
      var t = c(e), e = t[0], t = t[1];
      return 3 * (e + t) / 4 - t;
    }, r.toByteArray = function(e) {
      var t, r, i = c(e), n = i[0], i = i[1], o = new u(function(e, t) {
        return 3 * (e + t) / 4 - t;
      }(n, i)), a = 0, s = 0 < i ? n - 4 : n;
      for (r = 0; r < s; r += 4) t = l[e.charCodeAt(r)] << 18 | l[e.charCodeAt(r + 1)] << 12 | l[e.charCodeAt(r + 2)] << 6 | l[e.charCodeAt(r + 3)], o[a++] = t >> 16 & 255, o[a++] = t >> 8 & 255, o[a++] = 255 & t;
      2 === i && (t = l[e.charCodeAt(r)] << 2 | l[e.charCodeAt(r + 1)] >> 4, o[a++] = 255 & t);
      1 === i && (t = l[e.charCodeAt(r)] << 10 | l[e.charCodeAt(r + 1)] << 4 | l[e.charCodeAt(r + 2)] >> 2, o[a++] = t >> 8 & 255, o[a++] = 255 & t);
      return o;
    }, r.fromByteArray = function(e) {
      for (var t, r = e.length, i = r % 3, n = [], o = 0, a = r - i; o < a; o += 16383) n.push(function(e, t, r) {
        for (var i, n = [], o = t; o < r; o += 3) i = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), n.push(function(e) {
          return s[e >> 18 & 63] + s[e >> 12 & 63] + s[e >> 6 & 63] + s[63 & e];
        }(i));
        return n.join("");
      }(e, o, a < o + 16383 ? a : o + 16383));
      1 == i ? (t = e[r - 1], n.push(s[t >> 2] + s[t << 4 & 63] + "==")) : 2 == i && (t = (e[r - 2] << 8) + e[r - 1], n.push(s[t >> 10] + s[t >> 4 & 63] + s[t << 2 & 63] + "="));
      return n.join("");
    };
    for (var s = [], l = [], u = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = i.length; n < o; ++n) s[n] = i[n], l[i.charCodeAt(n)] = n;

    function c(e) {
      var t = e.length;
      if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
      e = e.indexOf("=");
      return [e = -1 === e ? t : e, e === t ? 0 : 4 - e % 4];
    }

    l["-".charCodeAt(0)] = 62, l["_".charCodeAt(0)] = 63;
  }, {}],
  17: [function(M, e, t) {
    !function(e, t) {
      "use strict";

      function y(e, t) {
        if (!e) throw new Error(t || "Assertion failed");
      }

      function r(e, t) {
        e.super_ = t;

        function r() {
        }

        r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e;
      }

      function g(e, t, r) {
        if (g.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, (this.red = null) !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"));
      }

      var i;
      "object" == typeof e ? e.exports = g : t.BN = g, (g.BN = g).wordSize = 26;
      try {
        i = ("undefined" != typeof window && void 0 !== window.Buffer ? window : M("buffer")).Buffer;
      } catch (e) {
      }

      function n(e, t) {
        t = e.charCodeAt(t);
        return 48 <= t && t <= 57 ? t - 48 : 65 <= t && t <= 70 ? t - 55 : 97 <= t && t <= 102 ? t - 87 : void y(!1, "Invalid character in " + e);
      }

      function s(e, t, r) {
        var i = n(e, r);
        return t <= r - 1 && (i |= n(e, r - 1) << 4), i;
      }

      function h(e, t, r, i) {
        for (var n = 0, o = 0, a = Math.min(e.length, r), s = t; s < a; s++) {
          var l = e.charCodeAt(s) - 48;
          n *= i, o = 49 <= l ? l - 49 + 10 : 17 <= l ? l - 17 + 10 : l, y(0 <= l && o < i, "Invalid character"), n += o;
        }
        return n;
      }

      function o(e, t) {
        e.words = t.words, e.length = t.length, e.negative = t.negative, e.red = t.red;
      }

      if (g.isBN = function(e) {
        return e instanceof g || null !== e && "object" == typeof e && e.constructor.wordSize === g.wordSize && Array.isArray(e.words);
      }, g.max = function(e, t) {
        return 0 < e.cmp(t) ? e : t;
      }, g.min = function(e, t) {
        return e.cmp(t) < 0 ? e : t;
      }, g.prototype._init = function(e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == typeof e) return this._initArray(e, t, r);
        y((t = "hex" === t ? 16 : t) === (0 | t) && 2 <= t && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && (i++, this.negative = 1), i < e.length && (16 === t ? this._parseHex(e, i, r) : (this._parseBase(e, t, i), "le" === r && this._initArray(this.toArray(), t, r)));
      }, g.prototype._initNumber = function(e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (y(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r);
      }, g.prototype._initArray = function(e, t, r) {
        if (y("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
        for (var i, n, o = 0; o < this.length; o++) this.words[o] = 0;
        var a = 0;
        if ("be" === r) for (o = e.length - 1, i = 0; 0 <= o; o -= 3) n = e[o] | e[o - 1] << 8 | e[o - 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++); else if ("le" === r) for (i = o = 0; o < e.length; o += 3) n = e[o] | e[o + 1] << 8 | e[o + 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++);
        return this._strip();
      }, g.prototype._parseHex = function(e, t, r) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) this.words[i] = 0;
        var n, o = 0, a = 0;
        if ("be" === r) for (i = e.length - 1; t <= i; i -= 2) n = s(e, t, i) << o, this.words[a] |= 67108863 & n, 18 <= o ? (o -= 18, this.words[a += 1] |= n >>> 26) : o += 8; else for (i = (e.length - t) % 2 == 0 ? t + 1 : t; i < e.length; i += 2) n = s(e, t, i) << o, this.words[a] |= 67108863 & n, 18 <= o ? (o -= 18, this.words[a += 1] |= n >>> 26) : o += 8;
        this._strip();
      }, g.prototype._parseBase = function(e, t, r) {
        this.words = [0];
        for (var i = 0, n = this.length = 1; n <= 67108863; n *= t) i++;
        for (var n = n / t | 0, o = e.length - r, a = o % --i, s = Math.min(o, o - a) + r, l = 0, u = r; u < s; u += i) l = h(e, u, u + i, t), this.imuln(n), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        if (0 != a) {
          for (var c = 1, l = h(e, u, e.length, t), u = 0; u < a; u++) c *= t;
          this.imuln(c), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        }
        this._strip();
      }, g.prototype.copy = function(e) {
        e.words = new Array(this.length);
        for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
        e.length = this.length, e.negative = this.negative, e.red = this.red;
      }, g.prototype._move = function(e) {
        o(e, this);
      }, g.prototype.clone = function() {
        var e = new g(null);
        return this.copy(e), e;
      }, g.prototype._expand = function(e) {
        for (; this.length < e;) this.words[this.length++] = 0;
        return this;
      }, g.prototype._strip = function() {
        for (; 1 < this.length && 0 === this.words[this.length - 1];) this.length--;
        return this._normSign();
      }, g.prototype._normSign = function() {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this;
      }, "undefined" != typeof Symbol && "function" == typeof Symbol["for"]) try {
        g.prototype[Symbol["for"]("nodejs.util.inspect.custom")] = a;
      } catch (e) {
        g.prototype.inspect = a;
      } else g.prototype.inspect = a;

      function a() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      }

      var d = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
        f = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
      g.prototype.toString = function(e, t) {
        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          s = "";
          for (var r = 0, i = 0, n = 0; n < this.length; n++) {
            var o = this.words[n], a = (16777215 & (o << r | i)).toString(16),
              s = 0 !== (i = o >>> 24 - r & 16777215) || n !== this.length - 1 ? d[6 - a.length] + a + s : a + s;
            26 <= (r += 2) && (r -= 26, n--);
          }
          for (0 !== i && (s = i.toString(16) + s); s.length % t != 0;) s = "0" + s;
          return s = 0 !== this.negative ? "-" + s : s;
        }
        if (e === (0 | e) && 2 <= e && e <= 36) {
          var l = f[e], u = p[e];
          for (s = "", (c = this.clone()).negative = 0; !c.isZero();) {
            var c, h = c.modrn(u).toString(e);
            s = (c = c.idivn(u)).isZero() ? h + s : d[l - h.length] + h + s;
          }
          for (this.isZero() && (s = "0" + s); s.length % t != 0;) s = "0" + s;
          return s = 0 !== this.negative ? "-" + s : s;
        }
        y(!1, "Base should be between 2 and 36");
      }, g.prototype.toNumber = function() {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && y(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e;
      }, g.prototype.toJSON = function() {
        return this.toString(16, 2);
      }, i && (g.prototype.toBuffer = function(e, t) {
        return this.toArrayLike(i, e, t);
      }), g.prototype.toArray = function(e, t) {
        return this.toArrayLike(Array, e, t);
      };

      function l(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var i = e.length + t.length | 0, i = (r.length = i) - 1 | 0,
          n = (a = (0 | e.words[0]) * (0 | t.words[0])) / 67108864 | 0;
        r.words[0] = 67108863 & a;
        for (var o = 1; o < i; o++) {
          for (var a, s = n >>> 26, l = 67108863 & n, u = Math.min(o, t.length - 1), c = Math.max(0, o - e.length + 1); c <= u; c++) s += (a = (0 | e.words[o - c | 0]) * (0 | t.words[c]) + l) / 67108864 | 0, l = 67108863 & a;
          r.words[o] = 0 | l, n = 0 | s;
        }
        return 0 !== n ? r.words[o] = 0 | n : r.length--, r._strip();
      }

      g.prototype.toArrayLike = function(e, t, r) {
        this._strip();
        var i = this.byteLength(), r = r || Math.max(1, i);
        y(i <= r, "byte array longer than desired length"), y(0 < r, "Requested array length <= 0");
        r = r, r = (e = e).allocUnsafe ? e.allocUnsafe(r) : new e(r);
        return this["_toArrayLike" + ("le" === t ? "LE" : "BE")](r, i), r;
      }, g.prototype._toArrayLikeLE = function(e, t) {
        for (var r = 0, i = 0, n = 0, o = 0; n < this.length; n++) {
          var a = this.words[n] << o | i;
          e[r++] = 255 & a, r < e.length && (e[r++] = a >> 8 & 255), r < e.length && (e[r++] = a >> 16 & 255), 6 === o ? (r < e.length && (e[r++] = a >> 24 & 255), o = i = 0) : (i = a >>> 24, o += 2);
        }
        if (r < e.length) for (e[r++] = i; r < e.length;) e[r++] = 0;
      }, g.prototype._toArrayLikeBE = function(e, t) {
        for (var r = e.length - 1, i = 0, n = 0, o = 0; n < this.length; n++) {
          var a = this.words[n] << o | i;
          e[r--] = 255 & a, 0 <= r && (e[r--] = a >> 8 & 255), 0 <= r && (e[r--] = a >> 16 & 255), 6 === o ? (0 <= r && (e[r--] = a >> 24 & 255), o = i = 0) : (i = a >>> 24, o += 2);
        }
        if (0 <= r) for (e[r--] = i; 0 <= r;) e[r--] = 0;
      }, Math.clz32 ? g.prototype._countBits = function(e) {
        return 32 - Math.clz32(e);
      } : g.prototype._countBits = function(e) {
        var t = e, e = 0;
        return 4096 <= t && (e += 13, t >>>= 13), 64 <= t && (e += 7, t >>>= 7), 8 <= t && (e += 4, t >>>= 4), 2 <= t && (e += 2, t >>>= 2), e + t;
      }, g.prototype._zeroBits = function(e) {
        if (0 === e) return 26;
        var t = e, e = 0;
        return 0 == (8191 & t) && (e += 13, t >>>= 13), 0 == (127 & t) && (e += 7, t >>>= 7), 0 == (15 & t) && (e += 4, t >>>= 4), 0 == (3 & t) && (e += 2, t >>>= 2), 0 == (1 & t) && e++, e;
      }, g.prototype.bitLength = function() {
        var e = this.words[this.length - 1], e = this._countBits(e);
        return 26 * (this.length - 1) + e;
      }, g.prototype.zeroBits = function() {
        if (this.isZero()) return 0;
        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);
          if (e += r, 26 !== r) break;
        }
        return e;
      }, g.prototype.byteLength = function() {
        return Math.ceil(this.bitLength() / 8);
      }, g.prototype.toTwos = function(e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
      }, g.prototype.fromTwos = function(e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
      }, g.prototype.isNeg = function() {
        return 0 !== this.negative;
      }, g.prototype.neg = function() {
        return this.clone().ineg();
      }, g.prototype.ineg = function() {
        return this.isZero() || (this.negative ^= 1), this;
      }, g.prototype.iuor = function(e) {
        for (; this.length < e.length;) this.words[this.length++] = 0;
        for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
        return this._strip();
      }, g.prototype.ior = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuor(e);
      }, g.prototype.or = function(e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
      }, g.prototype.uor = function(e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
      }, g.prototype.iuand = function(e) {
        for (var t = this.length > e.length ? e : this, r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
        return this.length = t.length, this._strip();
      }, g.prototype.iand = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuand(e);
      }, g.prototype.and = function(e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
      }, g.prototype.uand = function(e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
      }, g.prototype.iuxor = function(e) {
        for (var t, r = this.length > e.length ? (t = this, e) : (t = e, this), i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
        if (this !== t) for (; i < t.length; i++) this.words[i] = t.words[i];
        return this.length = t.length, this._strip();
      }, g.prototype.ixor = function(e) {
        return y(0 == (this.negative | e.negative)), this.iuxor(e);
      }, g.prototype.xor = function(e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
      }, g.prototype.uxor = function(e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
      }, g.prototype.inotn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = 0 | Math.ceil(e / 26), e = e % 26;
        this._expand(t), 0 < e && t--;
        for (var r = 0; r < t; r++) this.words[r] = 67108863 & ~this.words[r];
        return 0 < e && (this.words[r] = ~this.words[r] & 67108863 >> 26 - e), this._strip();
      }, g.prototype.notn = function(e) {
        return this.clone().inotn(e);
      }, g.prototype.setn = function(e, t) {
        y("number" == typeof e && 0 <= e);
        var r = e / 26 | 0, e = e % 26;
        return this._expand(1 + r), this.words[r] = t ? this.words[r] | 1 << e : this.words[r] & ~(1 << e), this._strip();
      }, g.prototype.iadd = function(e) {
        var t, r;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        for (var i = this.length > e.length ? (r = this, e) : (r = e, this), n = 0, o = 0; o < i.length; o++) t = (0 | r.words[o]) + (0 | i.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        for (; 0 !== n && o < r.length; o++) t = (0 | r.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++; else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o];
        return this;
      }, g.prototype.add = function(e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
      }, g.prototype.isub = function(e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign();
        }
        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r, i = this.cmp(e);
        if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        for (var n = 0 < i ? (r = this, e) : (r = e, this), o = 0, a = 0; a < n.length; a++) o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        for (; 0 !== o && a < r.length; a++) o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) this.words[a] = r.words[a];
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this._strip();
      }, g.prototype.sub = function(e) {
        return this.clone().isub(e);
      };
      var u = function(e, t, r) {
        var i = e.words, n = t.words, o = r.words, a = 0 | i[0], s = 8191 & a, l = a >>> 13, u = 0 | i[1], c = 8191 & u,
          h = u >>> 13, d = 0 | i[2], f = 8191 & d, p = d >>> 13, y = 0 | i[3], g = 8191 & y, m = y >>> 13,
          b = 0 | i[4], _ = 8191 & b, v = b >>> 13, w = 0 | i[5], S = 8191 & w, E = w >>> 13, T = 0 | i[6],
          x = 8191 & T, M = T >>> 13, k = 0 | i[7], P = 8191 & k, C = k >>> 13, A = 0 | i[8], I = 8191 & A,
          R = A >>> 13, L = 0 | i[9], D = 8191 & L, B = L >>> 13, O = 0 | n[0], U = 8191 & O, N = O >>> 13,
          H = 0 | n[1], j = 8191 & H, F = H >>> 13, q = 0 | n[2], V = 8191 & q, z = q >>> 13, K = 0 | n[3],
          W = 8191 & K, X = K >>> 13, G = 0 | n[4], Y = 8191 & G, J = G >>> 13, Q = 0 | n[5], Z = 8191 & Q,
          $ = Q >>> 13, a = 0 | n[6], u = 8191 & a, d = a >>> 13, y = 0 | n[7], b = 8191 & y, w = y >>> 13,
          T = 0 | n[8], k = 8191 & T, A = T >>> 13, i = 0 | n[9], L = 8191 & i, O = i >>> 13;
        r.negative = e.negative ^ t.negative, r.length = 19;
        var K = (0 + Math.imul(s, U) | 0) + ((8191 & (q = (q = Math.imul(s, N)) + Math.imul(l, U) | 0)) << 13) | 0,
          ee = ((G = Math.imul(l, N)) + (q >>> 13) | 0) + (K >>> 26) | 0;
        K &= 67108863, H = Math.imul(c, U), q = (q = Math.imul(c, N)) + Math.imul(h, U) | 0, G = Math.imul(h, N);
        Q = (ee + (H + Math.imul(s, j) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, F) | 0) + Math.imul(l, j) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, F) | 0) + (q >>> 13) | 0) + (Q >>> 26) | 0, Q &= 67108863, H = Math.imul(f, U), q = (q = Math.imul(f, N)) + Math.imul(p, U) | 0, G = Math.imul(p, N), H = H + Math.imul(c, j) | 0, q = (q = q + Math.imul(c, F) | 0) + Math.imul(h, j) | 0, G = G + Math.imul(h, F) | 0;
        a = (ee + (H + Math.imul(s, V) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, z) | 0) + Math.imul(l, V) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, z) | 0) + (q >>> 13) | 0) + (a >>> 26) | 0, a &= 67108863, H = Math.imul(g, U), q = (q = Math.imul(g, N)) + Math.imul(m, U) | 0, G = Math.imul(m, N), H = H + Math.imul(f, j) | 0, q = (q = q + Math.imul(f, F) | 0) + Math.imul(p, j) | 0, G = G + Math.imul(p, F) | 0, H = H + Math.imul(c, V) | 0, q = (q = q + Math.imul(c, z) | 0) + Math.imul(h, V) | 0, G = G + Math.imul(h, z) | 0;
        y = (ee + (H + Math.imul(s, W) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, X) | 0) + Math.imul(l, W) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, X) | 0) + (q >>> 13) | 0) + (y >>> 26) | 0, y &= 67108863, H = Math.imul(_, U), q = (q = Math.imul(_, N)) + Math.imul(v, U) | 0, G = Math.imul(v, N), H = H + Math.imul(g, j) | 0, q = (q = q + Math.imul(g, F) | 0) + Math.imul(m, j) | 0, G = G + Math.imul(m, F) | 0, H = H + Math.imul(f, V) | 0, q = (q = q + Math.imul(f, z) | 0) + Math.imul(p, V) | 0, G = G + Math.imul(p, z) | 0, H = H + Math.imul(c, W) | 0, q = (q = q + Math.imul(c, X) | 0) + Math.imul(h, W) | 0, G = G + Math.imul(h, X) | 0;
        T = (ee + (H + Math.imul(s, Y) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, J) | 0) + Math.imul(l, Y) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, J) | 0) + (q >>> 13) | 0) + (T >>> 26) | 0, T &= 67108863, H = Math.imul(S, U), q = (q = Math.imul(S, N)) + Math.imul(E, U) | 0, G = Math.imul(E, N), H = H + Math.imul(_, j) | 0, q = (q = q + Math.imul(_, F) | 0) + Math.imul(v, j) | 0, G = G + Math.imul(v, F) | 0, H = H + Math.imul(g, V) | 0, q = (q = q + Math.imul(g, z) | 0) + Math.imul(m, V) | 0, G = G + Math.imul(m, z) | 0, H = H + Math.imul(f, W) | 0, q = (q = q + Math.imul(f, X) | 0) + Math.imul(p, W) | 0, G = G + Math.imul(p, X) | 0, H = H + Math.imul(c, Y) | 0, q = (q = q + Math.imul(c, J) | 0) + Math.imul(h, Y) | 0, G = G + Math.imul(h, J) | 0;
        n = (ee + (H + Math.imul(s, Z) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, $) | 0) + Math.imul(l, Z) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, $) | 0) + (q >>> 13) | 0) + (n >>> 26) | 0, n &= 67108863, H = Math.imul(x, U), q = (q = Math.imul(x, N)) + Math.imul(M, U) | 0, G = Math.imul(M, N), H = H + Math.imul(S, j) | 0, q = (q = q + Math.imul(S, F) | 0) + Math.imul(E, j) | 0, G = G + Math.imul(E, F) | 0, H = H + Math.imul(_, V) | 0, q = (q = q + Math.imul(_, z) | 0) + Math.imul(v, V) | 0, G = G + Math.imul(v, z) | 0, H = H + Math.imul(g, W) | 0, q = (q = q + Math.imul(g, X) | 0) + Math.imul(m, W) | 0, G = G + Math.imul(m, X) | 0, H = H + Math.imul(f, Y) | 0, q = (q = q + Math.imul(f, J) | 0) + Math.imul(p, Y) | 0, G = G + Math.imul(p, J) | 0, H = H + Math.imul(c, Z) | 0, q = (q = q + Math.imul(c, $) | 0) + Math.imul(h, Z) | 0, G = G + Math.imul(h, $) | 0;
        i = (ee + (H + Math.imul(s, u) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, d) | 0) + Math.imul(l, u) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, d) | 0) + (q >>> 13) | 0) + (i >>> 26) | 0, i &= 67108863, H = Math.imul(P, U), q = (q = Math.imul(P, N)) + Math.imul(C, U) | 0, G = Math.imul(C, N), H = H + Math.imul(x, j) | 0, q = (q = q + Math.imul(x, F) | 0) + Math.imul(M, j) | 0, G = G + Math.imul(M, F) | 0, H = H + Math.imul(S, V) | 0, q = (q = q + Math.imul(S, z) | 0) + Math.imul(E, V) | 0, G = G + Math.imul(E, z) | 0, H = H + Math.imul(_, W) | 0, q = (q = q + Math.imul(_, X) | 0) + Math.imul(v, W) | 0, G = G + Math.imul(v, X) | 0, H = H + Math.imul(g, Y) | 0, q = (q = q + Math.imul(g, J) | 0) + Math.imul(m, Y) | 0, G = G + Math.imul(m, J) | 0, H = H + Math.imul(f, Z) | 0, q = (q = q + Math.imul(f, $) | 0) + Math.imul(p, Z) | 0, G = G + Math.imul(p, $) | 0, H = H + Math.imul(c, u) | 0, q = (q = q + Math.imul(c, d) | 0) + Math.imul(h, u) | 0, G = G + Math.imul(h, d) | 0;
        e = (ee + (H + Math.imul(s, b) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, w) | 0) + Math.imul(l, b) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, w) | 0) + (q >>> 13) | 0) + (e >>> 26) | 0, e &= 67108863, H = Math.imul(I, U), q = (q = Math.imul(I, N)) + Math.imul(R, U) | 0, G = Math.imul(R, N), H = H + Math.imul(P, j) | 0, q = (q = q + Math.imul(P, F) | 0) + Math.imul(C, j) | 0, G = G + Math.imul(C, F) | 0, H = H + Math.imul(x, V) | 0, q = (q = q + Math.imul(x, z) | 0) + Math.imul(M, V) | 0, G = G + Math.imul(M, z) | 0, H = H + Math.imul(S, W) | 0, q = (q = q + Math.imul(S, X) | 0) + Math.imul(E, W) | 0, G = G + Math.imul(E, X) | 0, H = H + Math.imul(_, Y) | 0, q = (q = q + Math.imul(_, J) | 0) + Math.imul(v, Y) | 0, G = G + Math.imul(v, J) | 0, H = H + Math.imul(g, Z) | 0, q = (q = q + Math.imul(g, $) | 0) + Math.imul(m, Z) | 0, G = G + Math.imul(m, $) | 0, H = H + Math.imul(f, u) | 0, q = (q = q + Math.imul(f, d) | 0) + Math.imul(p, u) | 0, G = G + Math.imul(p, d) | 0, H = H + Math.imul(c, b) | 0, q = (q = q + Math.imul(c, w) | 0) + Math.imul(h, b) | 0, G = G + Math.imul(h, w) | 0;
        t = (ee + (H + Math.imul(s, k) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, A) | 0) + Math.imul(l, k) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, A) | 0) + (q >>> 13) | 0) + (t >>> 26) | 0, t &= 67108863, H = Math.imul(D, U), q = (q = Math.imul(D, N)) + Math.imul(B, U) | 0, G = Math.imul(B, N), H = H + Math.imul(I, j) | 0, q = (q = q + Math.imul(I, F) | 0) + Math.imul(R, j) | 0, G = G + Math.imul(R, F) | 0, H = H + Math.imul(P, V) | 0, q = (q = q + Math.imul(P, z) | 0) + Math.imul(C, V) | 0, G = G + Math.imul(C, z) | 0, H = H + Math.imul(x, W) | 0, q = (q = q + Math.imul(x, X) | 0) + Math.imul(M, W) | 0, G = G + Math.imul(M, X) | 0, H = H + Math.imul(S, Y) | 0, q = (q = q + Math.imul(S, J) | 0) + Math.imul(E, Y) | 0, G = G + Math.imul(E, J) | 0, H = H + Math.imul(_, Z) | 0, q = (q = q + Math.imul(_, $) | 0) + Math.imul(v, Z) | 0, G = G + Math.imul(v, $) | 0, H = H + Math.imul(g, u) | 0, q = (q = q + Math.imul(g, d) | 0) + Math.imul(m, u) | 0, G = G + Math.imul(m, d) | 0, H = H + Math.imul(f, b) | 0, q = (q = q + Math.imul(f, w) | 0) + Math.imul(p, b) | 0, G = G + Math.imul(p, w) | 0, H = H + Math.imul(c, k) | 0, q = (q = q + Math.imul(c, A) | 0) + Math.imul(h, k) | 0, G = G + Math.imul(h, A) | 0;
        s = (ee + (H + Math.imul(s, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(s, O) | 0) + Math.imul(l, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(l, O) | 0) + (q >>> 13) | 0) + (s >>> 26) | 0, s &= 67108863, H = Math.imul(D, j), q = (q = Math.imul(D, F)) + Math.imul(B, j) | 0, G = Math.imul(B, F), H = H + Math.imul(I, V) | 0, q = (q = q + Math.imul(I, z) | 0) + Math.imul(R, V) | 0, G = G + Math.imul(R, z) | 0, H = H + Math.imul(P, W) | 0, q = (q = q + Math.imul(P, X) | 0) + Math.imul(C, W) | 0, G = G + Math.imul(C, X) | 0, H = H + Math.imul(x, Y) | 0, q = (q = q + Math.imul(x, J) | 0) + Math.imul(M, Y) | 0, G = G + Math.imul(M, J) | 0, H = H + Math.imul(S, Z) | 0, q = (q = q + Math.imul(S, $) | 0) + Math.imul(E, Z) | 0, G = G + Math.imul(E, $) | 0, H = H + Math.imul(_, u) | 0, q = (q = q + Math.imul(_, d) | 0) + Math.imul(v, u) | 0, G = G + Math.imul(v, d) | 0, H = H + Math.imul(g, b) | 0, q = (q = q + Math.imul(g, w) | 0) + Math.imul(m, b) | 0, G = G + Math.imul(m, w) | 0, H = H + Math.imul(f, k) | 0, q = (q = q + Math.imul(f, A) | 0) + Math.imul(p, k) | 0, G = G + Math.imul(p, A) | 0;
        c = (ee + (H + Math.imul(c, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(c, O) | 0) + Math.imul(h, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(h, O) | 0) + (q >>> 13) | 0) + (c >>> 26) | 0, c &= 67108863, H = Math.imul(D, V), q = (q = Math.imul(D, z)) + Math.imul(B, V) | 0, G = Math.imul(B, z), H = H + Math.imul(I, W) | 0, q = (q = q + Math.imul(I, X) | 0) + Math.imul(R, W) | 0, G = G + Math.imul(R, X) | 0, H = H + Math.imul(P, Y) | 0, q = (q = q + Math.imul(P, J) | 0) + Math.imul(C, Y) | 0, G = G + Math.imul(C, J) | 0, H = H + Math.imul(x, Z) | 0, q = (q = q + Math.imul(x, $) | 0) + Math.imul(M, Z) | 0, G = G + Math.imul(M, $) | 0, H = H + Math.imul(S, u) | 0, q = (q = q + Math.imul(S, d) | 0) + Math.imul(E, u) | 0, G = G + Math.imul(E, d) | 0, H = H + Math.imul(_, b) | 0, q = (q = q + Math.imul(_, w) | 0) + Math.imul(v, b) | 0, G = G + Math.imul(v, w) | 0, H = H + Math.imul(g, k) | 0, q = (q = q + Math.imul(g, A) | 0) + Math.imul(m, k) | 0, G = G + Math.imul(m, A) | 0;
        f = (ee + (H + Math.imul(f, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(f, O) | 0) + Math.imul(p, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(p, O) | 0) + (q >>> 13) | 0) + (f >>> 26) | 0, f &= 67108863, H = Math.imul(D, W), q = (q = Math.imul(D, X)) + Math.imul(B, W) | 0, G = Math.imul(B, X), H = H + Math.imul(I, Y) | 0, q = (q = q + Math.imul(I, J) | 0) + Math.imul(R, Y) | 0, G = G + Math.imul(R, J) | 0, H = H + Math.imul(P, Z) | 0, q = (q = q + Math.imul(P, $) | 0) + Math.imul(C, Z) | 0, G = G + Math.imul(C, $) | 0, H = H + Math.imul(x, u) | 0, q = (q = q + Math.imul(x, d) | 0) + Math.imul(M, u) | 0, G = G + Math.imul(M, d) | 0, H = H + Math.imul(S, b) | 0, q = (q = q + Math.imul(S, w) | 0) + Math.imul(E, b) | 0, G = G + Math.imul(E, w) | 0, H = H + Math.imul(_, k) | 0, q = (q = q + Math.imul(_, A) | 0) + Math.imul(v, k) | 0, G = G + Math.imul(v, A) | 0;
        g = (ee + (H + Math.imul(g, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(g, O) | 0) + Math.imul(m, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(m, O) | 0) + (q >>> 13) | 0) + (g >>> 26) | 0, g &= 67108863, H = Math.imul(D, Y), q = (q = Math.imul(D, J)) + Math.imul(B, Y) | 0, G = Math.imul(B, J), H = H + Math.imul(I, Z) | 0, q = (q = q + Math.imul(I, $) | 0) + Math.imul(R, Z) | 0, G = G + Math.imul(R, $) | 0, H = H + Math.imul(P, u) | 0, q = (q = q + Math.imul(P, d) | 0) + Math.imul(C, u) | 0, G = G + Math.imul(C, d) | 0, H = H + Math.imul(x, b) | 0, q = (q = q + Math.imul(x, w) | 0) + Math.imul(M, b) | 0, G = G + Math.imul(M, w) | 0, H = H + Math.imul(S, k) | 0, q = (q = q + Math.imul(S, A) | 0) + Math.imul(E, k) | 0, G = G + Math.imul(E, A) | 0;
        _ = (ee + (H + Math.imul(_, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(_, O) | 0) + Math.imul(v, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(v, O) | 0) + (q >>> 13) | 0) + (_ >>> 26) | 0, _ &= 67108863, H = Math.imul(D, Z), q = (q = Math.imul(D, $)) + Math.imul(B, Z) | 0, G = Math.imul(B, $), H = H + Math.imul(I, u) | 0, q = (q = q + Math.imul(I, d) | 0) + Math.imul(R, u) | 0, G = G + Math.imul(R, d) | 0, H = H + Math.imul(P, b) | 0, q = (q = q + Math.imul(P, w) | 0) + Math.imul(C, b) | 0, G = G + Math.imul(C, w) | 0, H = H + Math.imul(x, k) | 0, q = (q = q + Math.imul(x, A) | 0) + Math.imul(M, k) | 0, G = G + Math.imul(M, A) | 0;
        S = (ee + (H + Math.imul(S, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(S, O) | 0) + Math.imul(E, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(E, O) | 0) + (q >>> 13) | 0) + (S >>> 26) | 0, S &= 67108863, H = Math.imul(D, u), q = (q = Math.imul(D, d)) + Math.imul(B, u) | 0, G = Math.imul(B, d), H = H + Math.imul(I, b) | 0, q = (q = q + Math.imul(I, w) | 0) + Math.imul(R, b) | 0, G = G + Math.imul(R, w) | 0, H = H + Math.imul(P, k) | 0, q = (q = q + Math.imul(P, A) | 0) + Math.imul(C, k) | 0, G = G + Math.imul(C, A) | 0;
        x = (ee + (H + Math.imul(x, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(x, O) | 0) + Math.imul(M, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(M, O) | 0) + (q >>> 13) | 0) + (x >>> 26) | 0, x &= 67108863, H = Math.imul(D, b), q = (q = Math.imul(D, w)) + Math.imul(B, b) | 0, G = Math.imul(B, w), H = H + Math.imul(I, k) | 0, q = (q = q + Math.imul(I, A) | 0) + Math.imul(R, k) | 0, G = G + Math.imul(R, A) | 0;
        P = (ee + (H + Math.imul(P, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(P, O) | 0) + Math.imul(C, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(C, O) | 0) + (q >>> 13) | 0) + (P >>> 26) | 0, P &= 67108863, H = Math.imul(D, k), q = (q = Math.imul(D, A)) + Math.imul(B, k) | 0, G = Math.imul(B, A);
        I = (ee + (H + Math.imul(I, L) | 0) | 0) + ((8191 & (q = (q = q + Math.imul(I, O) | 0) + Math.imul(R, L) | 0)) << 13) | 0;
        ee = ((G = G + Math.imul(R, O) | 0) + (q >>> 13) | 0) + (I >>> 26) | 0, I &= 67108863;
        L = (ee + Math.imul(D, L) | 0) + ((8191 & (q = (q = Math.imul(D, O)) + Math.imul(B, L) | 0)) << 13) | 0;
        return ee = ((G = Math.imul(B, O)) + (q >>> 13) | 0) + (L >>> 26) | 0, L &= 67108863, o[0] = K, o[1] = Q, o[2] = a, o[3] = y, o[4] = T, o[5] = n, o[6] = i, o[7] = e, o[8] = t, o[9] = s, o[10] = c, o[11] = f, o[12] = g, o[13] = _, o[14] = S, o[15] = x, o[16] = P, o[17] = I, o[18] = L, 0 != ee && (o[19] = ee, r.length++), r;
      };

      function c(e, t, r) {
        r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
        for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
          for (var a = n, n = 0, s = 67108863 & i, l = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= l; u++) {
            var c = (0 | e.words[o - u]) * (0 | t.words[u]), h = 67108863 & c, s = 67108863 & (h = h + s | 0);
            n += (a = (a = a + (c / 67108864 | 0) | 0) + (h >>> 26) | 0) >>> 26, a &= 67108863;
          }
          r.words[o] = s, i = a, a = n;
        }
        return 0 !== i ? r.words[o] = i : r.length--, r._strip();
      }

      function m(e, t, r) {
        return c(e, t, r);
      }

      Math.imul || (u = l), g.prototype.mulTo = function(e, t) {
        var r = this.length + e.length,
          t = (10 === this.length && 10 === e.length ? u : r < 63 ? l : r < 1024 ? c : m)(this, e, t);
        return t;
      }, g.prototype.mul = function(e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t);
      }, g.prototype.mulf = function(e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), m(this, e, t);
      }, g.prototype.imul = function(e) {
        return this.clone().mulTo(e, this);
      }, g.prototype.imuln = function(e) {
        var t = e < 0;
        y("number" == typeof (e = t ? -e : e)), y(e < 67108864);
        for (var r = 0, i = 0; i < this.length; i++) {
          var n = (0 | this.words[i]) * e, o = (67108863 & n) + (67108863 & r);
          r >>= 26, r += n / 67108864 | 0, r += o >>> 26, this.words[i] = 67108863 & o;
        }
        return 0 !== r && (this.words[i] = r, this.length++), t ? this.ineg() : this;
      }, g.prototype.muln = function(e) {
        return this.clone().imuln(e);
      }, g.prototype.sqr = function() {
        return this.mul(this);
      }, g.prototype.isqr = function() {
        return this.imul(this.clone());
      }, g.prototype.pow = function(e) {
        var t = function(e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) t[r] = e.words[r / 26 | 0] >>> r % 26 & 1;
          return t;
        }(e);
        if (0 === t.length) return new g(1);
        for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
        if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
        return r;
      }, g.prototype.iushln = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 67108863 >>> 26 - t << 26 - t;
        if (0 != t) {
          for (var n = 0, o = 0; o < this.length; o++) {
            var a = this.words[o] & i, s = (0 | this.words[o]) - a << t;
            this.words[o] = s | n, n = a >>> 26 - t;
          }
          n && (this.words[o] = n, this.length++);
        }
        if (0 != r) {
          for (o = this.length - 1; 0 <= o; o--) this.words[o + r] = this.words[o];
          for (o = 0; o < r; o++) this.words[o] = 0;
          this.length += r;
        }
        return this._strip();
      }, g.prototype.ishln = function(e) {
        return y(0 === this.negative), this.iushln(e);
      }, g.prototype.iushrn = function(e, t, r) {
        y("number" == typeof e && 0 <= e);
        var i = t ? (t - t % 26) / 26 : 0, n = e % 26, o = Math.min((e - n) / 26, this.length),
          a = 67108863 ^ 67108863 >>> n << n, s = r;
        if (i -= o, i = Math.max(0, i), s) {
          for (var l = 0; l < o; l++) s.words[l] = this.words[l];
          s.length = o;
        }
        if (0 !== o) if (this.length > o) for (this.length -= o, l = 0; l < this.length; l++) this.words[l] = this.words[l + o]; else this.words[0] = 0, this.length = 1;
        for (var u = 0, l = this.length - 1; 0 <= l && (0 !== u || i <= l); l--) {
          var c = 0 | this.words[l];
          this.words[l] = u << 26 - n | c >>> n, u = c & a;
        }
        return s && 0 !== u && (s.words[s.length++] = u), 0 === this.length && (this.words[0] = 0, this.length = 1), this._strip();
      }, g.prototype.ishrn = function(e, t, r) {
        return y(0 === this.negative), this.iushrn(e, t, r);
      }, g.prototype.shln = function(e) {
        return this.clone().ishln(e);
      }, g.prototype.ushln = function(e) {
        return this.clone().iushln(e);
      }, g.prototype.shrn = function(e) {
        return this.clone().ishrn(e);
      }, g.prototype.ushrn = function(e) {
        return this.clone().iushrn(e);
      }, g.prototype.testn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, e = (e - t) / 26;
        return !(this.length <= e) && !!(this.words[e] & 1 << t);
      }, g.prototype.imaskn = function(e) {
        y("number" == typeof e && 0 <= e);
        var t = e % 26, e = (e - t) / 26;
        return y(0 === this.negative, "imaskn works only with positive numbers"), this.length <= e ? this : (0 != t && e++, this.length = Math.min(e, this.length), 0 != t && (this.words[this.length - 1] &= 67108863 ^ 67108863 >>> t << t), this._strip());
      }, g.prototype.maskn = function(e) {
        return this.clone().imaskn(e);
      }, g.prototype.iaddn = function(e) {
        return y("number" == typeof e), y(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) <= e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(e), this.negative = 1), this) : this._iaddn(e);
      }, g.prototype._iaddn = function(e) {
        this.words[0] += e;
        for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        return this.length = Math.max(this.length, t + 1), this;
      }, g.prototype.isubn = function(e) {
        if (y("number" == typeof e), y(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, --this.words[t + 1];
        return this._strip();
      }, g.prototype.addn = function(e) {
        return this.clone().iaddn(e);
      }, g.prototype.subn = function(e) {
        return this.clone().isubn(e);
      }, g.prototype.iabs = function() {
        return this.negative = 0, this;
      }, g.prototype.abs = function() {
        return this.clone().iabs();
      }, g.prototype._ishlnsubmul = function(e, t, r) {
        var i = e.length + r;
        this._expand(i);
        for (var n = 0, o = 0; o < e.length; o++) {
          var a = (0 | this.words[o + r]) + n, s = (0 | e.words[o]) * t,
            n = ((a -= 67108863 & s) >> 26) - (s / 67108864 | 0);
          this.words[o + r] = 67108863 & a;
        }
        for (; o < this.length - r; o++) n = (a = (0 | this.words[o + r]) + n) >> 26, this.words[o + r] = 67108863 & a;
        if (0 === n) return this._strip();
        for (y(-1 === n), o = n = 0; o < this.length; o++) n = (a = -(0 | this.words[o]) + n) >> 26, this.words[o] = 67108863 & a;
        return this.negative = 1, this._strip();
      }, g.prototype._wordDiv = function(e, t) {
        var r = this.length - e.length, i = this.clone(), n = e, o = 0 | n.words[n.length - 1];
        0 != (r = 26 - this._countBits(o)) && (n = n.ushln(r), i.iushln(r), o = 0 | n.words[n.length - 1]);
        var a, s = i.length - n.length;
        if ("mod" !== t) {
          (a = new g(null)).length = 1 + s, a.words = new Array(a.length);
          for (var l = 0; l < a.length; l++) a.words[l] = 0;
        }
        e = i.clone()._ishlnsubmul(n, 1, s);
        0 === e.negative && (i = e, a && (a.words[s] = 1));
        for (var u = s - 1; 0 <= u; u--) {
          var c = 67108864 * (0 | i.words[n.length + u]) + (0 | i.words[n.length + u - 1]),
            c = Math.min(c / o | 0, 67108863);
          for (i._ishlnsubmul(n, c, u); 0 !== i.negative;) c--, i.negative = 0, i._ishlnsubmul(n, 1, u), i.isZero() || (i.negative ^= 1);
          a && (a.words[u] = c);
        }
        return a && a._strip(), i._strip(), "div" !== t && 0 != r && i.iushrn(r), { div: a || null, mod: i };
      }, g.prototype.divmod = function(e, t, r) {
        return y(!e.isZero()), this.isZero() ? {
          div: new g(0),
          mod: new g(0)
        } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (i = o.div.neg()), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.iadd(e)), {
          div: i,
          mod: n
        }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), {
          div: i = "mod" !== t ? o.div.neg() : i,
          mod: o.mod
        }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.isub(e)), {
          div: o.div,
          mod: n
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new g(0),
          mod: this
        } : 1 === e.length ? "div" === t ? { div: this.divn(e.words[0]), mod: null } : "mod" === t ? {
          div: null,
          mod: new g(this.modrn(e.words[0]))
        } : { div: this.divn(e.words[0]), mod: new g(this.modrn(e.words[0])) } : this._wordDiv(e, t);
        var i, n, o;
      }, g.prototype.div = function(e) {
        return this.divmod(e, "div", !1).div;
      }, g.prototype.mod = function(e) {
        return this.divmod(e, "mod", !1).mod;
      }, g.prototype.umod = function(e) {
        return this.divmod(e, "mod", !0).mod;
      }, g.prototype.divRound = function(e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), e = e.andln(1), i = r.cmp(i);
        return i < 0 || 1 === e && 0 === i ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
      }, g.prototype.modrn = function(e) {
        var t = e < 0;
        y((e = t ? -e : e) <= 67108863);
        for (var r = (1 << 26) % e, i = 0, n = this.length - 1; 0 <= n; n--) i = (r * i + (0 | this.words[n])) % e;
        return t ? -i : i;
      }, g.prototype.modn = function(e) {
        return this.modrn(e);
      }, g.prototype.idivn = function(e) {
        var t = e < 0;
        y((e = t ? -e : e) <= 67108863);
        for (var r = 0, i = this.length - 1; 0 <= i; i--) {
          var n = (0 | this.words[i]) + 67108864 * r;
          this.words[i] = n / e | 0, r = n % e;
        }
        return this._strip(), t ? this.ineg() : this;
      }, g.prototype.divn = function(e) {
        return this.clone().idivn(e);
      }, g.prototype.egcd = function(e) {
        y(0 === e.negative), y(!e.isZero());
        for (var t = this, r = e.clone(), t = 0 !== t.negative ? t.umod(e) : t.clone(), i = new g(1), n = new g(0), o = new g(0), a = new g(1), s = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++s;
        for (var l = r.clone(), u = t.clone(); !t.isZero();) {
          for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1) ;
          if (0 < c) for (t.iushrn(c); 0 < c--;) (i.isOdd() || n.isOdd()) && (i.iadd(l), n.isub(u)), i.iushrn(1), n.iushrn(1);
          for (var d = 0, f = 1; 0 == (r.words[0] & f) && d < 26; ++d, f <<= 1) ;
          if (0 < d) for (r.iushrn(d); 0 < d--;) (o.isOdd() || a.isOdd()) && (o.iadd(l), a.isub(u)), o.iushrn(1), a.iushrn(1);
          0 <= t.cmp(r) ? (t.isub(r), i.isub(o), n.isub(a)) : (r.isub(t), o.isub(i), a.isub(n));
        }
        return { a: o, b: a, gcd: r.iushln(s) };
      }, g.prototype._invmp = function(e) {
        y(0 === e.negative), y(!e.isZero());
        for (var t, r = this, i = e.clone(), r = 0 !== r.negative ? r.umod(e) : r.clone(), n = new g(1), o = new g(0), a = i.clone(); 0 < r.cmpn(1) && 0 < i.cmpn(1);) {
          for (var s = 0, l = 1; 0 == (r.words[0] & l) && s < 26; ++s, l <<= 1) ;
          if (0 < s) for (r.iushrn(s); 0 < s--;) n.isOdd() && n.iadd(a), n.iushrn(1);
          for (var u = 0, c = 1; 0 == (i.words[0] & c) && u < 26; ++u, c <<= 1) ;
          if (0 < u) for (i.iushrn(u); 0 < u--;) o.isOdd() && o.iadd(a), o.iushrn(1);
          0 <= r.cmp(i) ? (r.isub(i), n.isub(o)) : (i.isub(r), o.isub(n));
        }
        return (t = 0 === r.cmpn(1) ? n : o).cmpn(0) < 0 && t.iadd(e), t;
      }, g.prototype.gcd = function(e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(), r = e.clone();
        t.negative = 0;
        for (var i = r.negative = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1);
        for (; ;) {
          for (; t.isEven();) t.iushrn(1);
          for (; r.isEven();) r.iushrn(1);
          var n = t.cmp(r);
          if (n < 0) var o = t, t = r, r = o; else if (0 === n || 0 === r.cmpn(1)) break;
          t.isub(r);
        }
        return r.iushln(i);
      }, g.prototype.invm = function(e) {
        return this.egcd(e).a.umod(e);
      }, g.prototype.isEven = function() {
        return 0 == (1 & this.words[0]);
      }, g.prototype.isOdd = function() {
        return 1 == (1 & this.words[0]);
      }, g.prototype.andln = function(e) {
        return this.words[0] & e;
      }, g.prototype.bincn = function(e) {
        y("number" == typeof e);
        var t = e % 26, e = (e - t) / 26, t = 1 << t;
        if (this.length <= e) return this._expand(1 + e), this.words[e] |= t, this;
        for (var r = t, i = e; 0 !== r && i < this.length; i++) {
          var n = 0 | this.words[i], r = (n += r) >>> 26;
          n &= 67108863, this.words[i] = n;
        }
        return 0 !== r && (this.words[i] = r, this.length++), this;
      }, g.prototype.isZero = function() {
        return 1 === this.length && 0 === this.words[0];
      }, g.prototype.cmpn = function(e) {
        var t = e < 0;
        return 0 === this.negative || t ? 0 === this.negative && t ? 1 : (this._strip(), e = 1 < this.length ? 1 : (y((e = t ? -e : e) <= 67108863, "Number is too big"), (t = 0 | this.words[0]) === e ? 0 : t < e ? -1 : 1), 0 !== this.negative ? 0 | -e : e) : -1;
      }, g.prototype.cmp = function(e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        e = this.ucmp(e);
        return 0 !== this.negative ? 0 | -e : e;
      }, g.prototype.ucmp = function(e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = 0 | this.words[r], n = 0 | e.words[r];
          if (i != n) {
            i < n ? t = -1 : n < i && (t = 1);
            break;
          }
        }
        return t;
      }, g.prototype.gtn = function(e) {
        return 1 === this.cmpn(e);
      }, g.prototype.gt = function(e) {
        return 1 === this.cmp(e);
      }, g.prototype.gten = function(e) {
        return 0 <= this.cmpn(e);
      }, g.prototype.gte = function(e) {
        return 0 <= this.cmp(e);
      }, g.prototype.ltn = function(e) {
        return -1 === this.cmpn(e);
      }, g.prototype.lt = function(e) {
        return -1 === this.cmp(e);
      }, g.prototype.lten = function(e) {
        return this.cmpn(e) <= 0;
      }, g.prototype.lte = function(e) {
        return this.cmp(e) <= 0;
      }, g.prototype.eqn = function(e) {
        return 0 === this.cmpn(e);
      }, g.prototype.eq = function(e) {
        return 0 === this.cmp(e);
      }, g.red = function(e) {
        return new T(e);
      }, g.prototype.toRed = function(e) {
        return y(!this.red, "Already a number in reduction context"), y(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e);
      }, g.prototype.fromRed = function() {
        return y(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, g.prototype._forceRed = function(e) {
        return this.red = e, this;
      }, g.prototype.forceRed = function(e) {
        return y(!this.red, "Already a number in reduction context"), this._forceRed(e);
      }, g.prototype.redAdd = function(e) {
        return y(this.red, "redAdd works only with red numbers"), this.red.add(this, e);
      }, g.prototype.redIAdd = function(e) {
        return y(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e);
      }, g.prototype.redSub = function(e) {
        return y(this.red, "redSub works only with red numbers"), this.red.sub(this, e);
      }, g.prototype.redISub = function(e) {
        return y(this.red, "redISub works only with red numbers"), this.red.isub(this, e);
      }, g.prototype.redShl = function(e) {
        return y(this.red, "redShl works only with red numbers"), this.red.shl(this, e);
      }, g.prototype.redMul = function(e) {
        return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e);
      }, g.prototype.redIMul = function(e) {
        return y(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e);
      }, g.prototype.redSqr = function() {
        return y(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, g.prototype.redISqr = function() {
        return y(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, g.prototype.redSqrt = function() {
        return y(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, g.prototype.redInvm = function() {
        return y(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, g.prototype.redNeg = function() {
        return y(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, g.prototype.redPow = function(e) {
        return y(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e);
      };
      var b = { k256: null, p224: null, p192: null, p25519: null };

      function _(e, t) {
        this.name = e, this.p = new g(t, 16), this.n = this.p.bitLength(), this.k = new g(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }

      function v() {
        _.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
      }

      function w() {
        _.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
      }

      function S() {
        _.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
      }

      function E() {
        _.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
      }

      function T(e) {
        var t;
        "string" == typeof e ? (t = g._prime(e), this.m = t.p, this.prime = t) : (y(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null);
      }

      function x(e) {
        T.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new g(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }

      _.prototype._tmp = function() {
        var e = new g(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e;
      }, _.prototype.ireduce = function(e) {
        for (var t, r = e; this.split(r, this.tmp), (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()) > this.n;) ;
        e = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === e ? (r.words[0] = 0, r.length = 1) : 0 < e ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r;
      }, _.prototype.split = function(e, t) {
        e.iushrn(this.n, 0, t);
      }, _.prototype.imulK = function(e) {
        return e.imul(this.k);
      }, r(v, _), v.prototype.split = function(e, t) {
        for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var n = e.words[9];
        for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) {
          var o = 0 | e.words[i];
          e.words[i - 10] = (4194303 & o) << 4 | n >>> 22, n = o;
        }
        0 === (e.words[i - 10] = n >>>= 22) && 10 < e.length ? e.length -= 10 : e.length -= 9;
      }, v.prototype.imulK = function(e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 0 | e.words[r];
          t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0);
        }
        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e;
      }, r(w, _), r(S, _), r(E, _), E.prototype.imulK = function(e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
          i >>>= 26, e.words[r] = n, t = i;
        }
        return 0 !== t && (e.words[e.length++] = t), e;
      }, g._prime = function(e) {
        if (b[e]) return b[e];
        var t;
        if ("k256" === e) t = new v; else if ("p224" === e) t = new w; else if ("p192" === e) t = new S; else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new E;
        }
        return b[e] = t;
      }, T.prototype._verify1 = function(e) {
        y(0 === e.negative, "red works only with positives"), y(e.red, "red works only with red numbers");
      }, T.prototype._verify2 = function(e, t) {
        y(0 == (e.negative | t.negative), "red works only with positives"), y(e.red && e.red === t.red, "red works only with red numbers");
      }, T.prototype.imod = function(e) {
        return this.prime ? this.prime.ireduce(e)._forceRed(this) : (o(e, e.umod(this.m)._forceRed(this)), e);
      }, T.prototype.neg = function(e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
      }, T.prototype.add = function(e, t) {
        this._verify2(e, t);
        t = e.add(t);
        return 0 <= t.cmp(this.m) && t.isub(this.m), t._forceRed(this);
      }, T.prototype.iadd = function(e, t) {
        this._verify2(e, t);
        t = e.iadd(t);
        return 0 <= t.cmp(this.m) && t.isub(this.m), t;
      }, T.prototype.sub = function(e, t) {
        this._verify2(e, t);
        t = e.sub(t);
        return t.cmpn(0) < 0 && t.iadd(this.m), t._forceRed(this);
      }, T.prototype.isub = function(e, t) {
        this._verify2(e, t);
        t = e.isub(t);
        return t.cmpn(0) < 0 && t.iadd(this.m), t;
      }, T.prototype.shl = function(e, t) {
        return this._verify1(e), this.imod(e.ushln(t));
      }, T.prototype.imul = function(e, t) {
        return this._verify2(e, t), this.imod(e.imul(t));
      }, T.prototype.mul = function(e, t) {
        return this._verify2(e, t), this.imod(e.mul(t));
      }, T.prototype.isqr = function(e) {
        return this.imul(e, e.clone());
      }, T.prototype.sqr = function(e) {
        return this.mul(e, e);
      }, T.prototype.sqrt = function(e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);
        if (y(t % 2 == 1), 3 === t) {
          t = this.m.add(new g(1)).iushrn(2);
          return this.pow(e, t);
        }
        for (var r = this.m.subn(1), i = 0; !r.isZero() && 0 === r.andln(1);) i++, r.iushrn(1);
        y(!r.isZero());
        for (var n = new g(1).toRed(this), o = n.redNeg(), a = this.m.subn(1).iushrn(1), s = new g(2 * (s = this.m.bitLength()) * s).toRed(this); 0 !== this.pow(s, a).cmp(o);) s.redIAdd(o);
        for (var l = this.pow(s, r), u = this.pow(e, r.addn(1).iushrn(1)), c = this.pow(e, r), h = i; 0 !== c.cmp(n);) {
          for (var d = c, f = 0; 0 !== d.cmp(n); f++) d = d.redSqr();
          y(f < h);
          var p = this.pow(l, new g(1).iushln(h - f - 1)), u = u.redMul(p), l = p.redSqr(), c = c.redMul(l), h = f;
        }
        return u;
      }, T.prototype.invm = function(e) {
        e = e._invmp(this.m);
        return 0 !== e.negative ? (e.negative = 0, this.imod(e).redNeg()) : this.imod(e);
      }, T.prototype.pow = function(e, t) {
        if (t.isZero()) return new g(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new g(1).toRed(this), r[1] = e;
        for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
        var n = r[0], o = 0, a = 0, s = t.bitLength() % 26;
        for (0 === s && (s = 26), i = t.length - 1; 0 <= i; i--) {
          for (var l = t.words[i], u = s - 1; 0 <= u; u--) {
            var c = l >> u & 1;
            n !== r[0] && (n = this.sqr(n)), 0 != c || 0 !== o ? (o <<= 1, o |= c, (4 === ++a || 0 === i && 0 === u) && (n = this.mul(n, r[o]), o = a = 0)) : a = 0;
          }
          s = 26;
        }
        return n;
      }, T.prototype.convertTo = function(e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t;
      }, T.prototype.convertFrom = function(e) {
        e = e.clone();
        return e.red = null, e;
      }, g.mont = function(e) {
        return new x(e);
      }, r(x, T), x.prototype.convertTo = function(e) {
        return this.imod(e.ushln(this.shift));
      }, x.prototype.convertFrom = function(e) {
        e = this.imod(e.mul(this.rinv));
        return e.red = null, e;
      }, x.prototype.imul = function(e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        e = e.imul(t), t = e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), e = e.isub(t).iushrn(this.shift), t = e;
        return 0 <= e.cmp(this.m) ? t = e.isub(this.m) : e.cmpn(0) < 0 && (t = e.iadd(this.m)), t._forceRed(this);
      }, x.prototype.mul = function(e, t) {
        if (e.isZero() || t.isZero()) return new g(0)._forceRed(this);
        e = e.mul(t), t = e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), e = e.isub(t).iushrn(this.shift), t = e;
        return 0 <= e.cmp(this.m) ? t = e.isub(this.m) : e.cmpn(0) < 0 && (t = e.iadd(this.m)), t._forceRed(this);
      }, x.prototype.invm = function(e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
      };
    }(void 0 === e || e, this);
  }, { buffer: 19 }],
  18: [function(e, t, r) {
    var i;

    function n(e) {
      this.rand = e;
    }

    if (t.exports = function(e) {
      return (i = i || new n(null)).generate(e);
    }, (t.exports.Rand = n).prototype.generate = function(e) {
      return this._rand(e);
    }, n.prototype._rand = function(e) {
      if (this.rand.getBytes) return this.rand.getBytes(e);
      for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
      return t;
    }, "object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function(e) {
      e = new Uint8Array(e);
      return self.crypto.getRandomValues(e), e;
    } : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function(e) {
      e = new Uint8Array(e);
      return self.msCrypto.getRandomValues(e), e;
    } : "object" == typeof window && (n.prototype._rand = function() {
      throw new Error("Not implemented yet");
    }); else try {
      var o = e("crypto");
      if ("function" != typeof o.randomBytes) throw new Error("Not supported");
      n.prototype._rand = function(e) {
        return o.randomBytes(e);
      };
    } catch (e) {
    }
  }, { crypto: 19 }],
  19: [function(e, t, r) {
  }, {}],
  20: [function(e, t, r) {
    var n = e("safe-buffer").Buffer;

    function i(e) {
      for (var t = (e = !n.isBuffer(e) ? n.from(e) : e).length / 4 | 0, r = new Array(t), i = 0; i < t; i++) r[i] = e.readUInt32BE(4 * i);
      return r;
    }

    function o(e) {
      for (; 0 < e.length; e++) e[0] = 0;
    }

    function a(e, t, r, i, n) {
      for (var o, a, s, l, u = r[0], c = r[1], h = r[2], d = r[3], f = e[0] ^ t[0], p = e[1] ^ t[1], y = e[2] ^ t[2], g = e[3] ^ t[3], m = 4, b = 1; b < n; b++) o = u[f >>> 24] ^ c[p >>> 16 & 255] ^ h[y >>> 8 & 255] ^ d[255 & g] ^ t[m++], a = u[p >>> 24] ^ c[y >>> 16 & 255] ^ h[g >>> 8 & 255] ^ d[255 & f] ^ t[m++], s = u[y >>> 24] ^ c[g >>> 16 & 255] ^ h[f >>> 8 & 255] ^ d[255 & p] ^ t[m++], l = u[g >>> 24] ^ c[f >>> 16 & 255] ^ h[p >>> 8 & 255] ^ d[255 & y] ^ t[m++], f = o, p = a, y = s, g = l;
      return o = (i[f >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[y >>> 8 & 255] << 8 | i[255 & g]) ^ t[m++], a = (i[p >>> 24] << 24 | i[y >>> 16 & 255] << 16 | i[g >>> 8 & 255] << 8 | i[255 & f]) ^ t[m++], s = (i[y >>> 24] << 24 | i[g >>> 16 & 255] << 16 | i[f >>> 8 & 255] << 8 | i[255 & p]) ^ t[m++], l = (i[g >>> 24] << 24 | i[f >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & y]) ^ t[m++], [o >>>= 0, a >>>= 0, s >>>= 0, l >>>= 0];
    }

    var h = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], d = function() {
      for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
      for (var r = [], i = [], n = [[], [], [], []], o = [[], [], [], []], a = 0, s = 0, l = 0; l < 256; ++l) {
        var u = s ^ s << 1 ^ s << 2 ^ s << 3 ^ s << 4;
        r[a] = u = u >>> 8 ^ 255 & u ^ 99;
        var c = e[i[u] = a], h = e[c], d = e[h], f = 257 * e[u] ^ 16843008 * u;
        n[0][a] = f << 24 | f >>> 8, n[1][a] = f << 16 | f >>> 16, n[2][a] = f << 8 | f >>> 24, n[3][a] = f, o[0][u] = (f = 16843009 * d ^ 65537 * h ^ 257 * c ^ 16843008 * a) << 24 | f >>> 8, o[1][u] = f << 16 | f >>> 16, o[2][u] = f << 8 | f >>> 24, o[3][u] = f, 0 === a ? a = s = 1 : (a = c ^ e[e[e[d ^ c]]], s ^= e[e[s]]);
      }
      return { SBOX: r, INV_SBOX: i, SUB_MIX: n, INV_SUB_MIX: o };
    }();

    function s(e) {
      this._key = i(e), this._reset();
    }

    s.blockSize = 16, s.keySize = 32, s.prototype.blockSize = s.blockSize, s.prototype.keySize = s.keySize, s.prototype._reset = function() {
      for (var e = this._key, t = e.length, r = t + 6, i = 4 * (r + 1), n = [], o = 0; o < t; o++) n[o] = e[o];
      for (o = t; o < i; o++) {
        var a = n[o - 1];
        o % t == 0 ? (a = d.SBOX[(a = a << 8 | a >>> 24) >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a], a ^= h[o / t | 0] << 24) : 6 < t && o % t == 4 && (a = d.SBOX[a >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a]), n[o] = n[o - t] ^ a;
      }
      for (var s = [], l = 0; l < i; l++) {
        var u = i - l, c = n[u - (l % 4 ? 0 : 4)];
        s[l] = l < 4 || u <= 4 ? c : d.INV_SUB_MIX[0][d.SBOX[c >>> 24]] ^ d.INV_SUB_MIX[1][d.SBOX[c >>> 16 & 255]] ^ d.INV_SUB_MIX[2][d.SBOX[c >>> 8 & 255]] ^ d.INV_SUB_MIX[3][d.SBOX[255 & c]];
      }
      this._nRounds = r, this._keySchedule = n, this._invKeySchedule = s;
    }, s.prototype.encryptBlockRaw = function(e) {
      return a(e = i(e), this._keySchedule, d.SUB_MIX, d.SBOX, this._nRounds);
    }, s.prototype.encryptBlock = function(e) {
      var t = this.encryptBlockRaw(e), e = n.allocUnsafe(16);
      return e.writeUInt32BE(t[0], 0), e.writeUInt32BE(t[1], 4), e.writeUInt32BE(t[2], 8), e.writeUInt32BE(t[3], 12), e;
    }, s.prototype.decryptBlock = function(e) {
      var t = (e = i(e))[1];
      e[1] = e[3], e[3] = t;
      t = a(e, this._invKeySchedule, d.INV_SUB_MIX, d.INV_SBOX, this._nRounds), e = n.allocUnsafe(16);
      return e.writeUInt32BE(t[0], 0), e.writeUInt32BE(t[3], 4), e.writeUInt32BE(t[2], 8), e.writeUInt32BE(t[1], 12), e;
    }, s.prototype.scrub = function() {
      o(this._keySchedule), o(this._invKeySchedule), o(this._key);
    }, t.exports.AES = s;
  }, { "safe-buffer": 187 }],
  21: [function(e, t, r) {
    var o = e("./aes"), a = e("safe-buffer").Buffer, s = e("cipher-base"), i = e("inherits"), l = e("./ghash"),
      n = e("buffer-xor"), u = e("./incr32");

    function c(e, t, r, i) {
      s.call(this);
      var n = a.alloc(4, 0);
      this._cipher = new o.AES(t);
      n = this._cipher.encryptBlock(n);
      this._ghash = new l(n), r = function(e, t, r) {
        if (12 === t.length) return e._finID = a.concat([t, a.from([0, 0, 0, 1])]), a.concat([t, a.from([0, 0, 0, 2])]);
        var i = new l(r), n = t.length, r = n % 16;
        return i.update(t), r && i.update(a.alloc(r = 16 - r, 0)), i.update(a.alloc(8, 0)), r = 8 * n, (n = a.alloc(8)).writeUIntBE(r, 0, 8), i.update(n), e._finID = i.state, e = a.from(e._finID), u(e), e;
      }(this, r, n), this._prev = a.from(r), this._cache = a.allocUnsafe(0), this._secCache = a.allocUnsafe(0), this._decrypt = i, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1;
    }

    i(c, s), c.prototype._update = function(e) {
      this._called || !this._alen || (t = 16 - this._alen % 16) < 16 && (t = a.alloc(t, 0), this._ghash.update(t)), this._called = !0;
      var t = this._mode.encrypt(this, e);
      return this._decrypt ? this._ghash.update(e) : this._ghash.update(t), this._len += e.length, t;
    }, c.prototype._final = function() {
      if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
      var e = n(this._ghash["final"](8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
      if (this._decrypt && function(e, t) {
        var r = 0;
        e.length !== t.length && r++;
        for (var i = Math.min(e.length, t.length), n = 0; n < i; ++n) r += e[n] ^ t[n];
        return r;
      }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
      this._authTag = e, this._cipher.scrub();
    }, c.prototype.getAuthTag = function() {
      if (this._decrypt || !a.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
      return this._authTag;
    }, c.prototype.setAuthTag = function(e) {
      if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
      this._authTag = e;
    }, c.prototype.setAAD = function(e) {
      if (this._called) throw new Error("Attempting to set AAD in unsupported state");
      this._ghash.update(e), this._alen += e.length;
    }, t.exports = c;
  }, {
    "./aes": 20,
    "./ghash": 25,
    "./incr32": 26,
    "buffer-xor": 63,
    "cipher-base": 65,
    inherits: 142,
    "safe-buffer": 187
  }],
  22: [function(e, t, r) {
    var i = e("./encrypter"), n = e("./decrypter"), o = e("./modes/list.json");
    r.createCipher = r.Cipher = i.createCipher, r.createCipheriv = r.Cipheriv = i.createCipheriv, r.createDecipher = r.Decipher = n.createDecipher, r.createDecipheriv = r.Decipheriv = n.createDecipheriv, r.listCiphers = r.getCiphers = function() {
      return Object.keys(o);
    };
  }, { "./decrypter": 23, "./encrypter": 24, "./modes/list.json": 34 }],
  23: [function(e, t, r) {
    var i = e("./authCipher"), n = e("safe-buffer").Buffer, o = e("./modes"), a = e("./streamCipher"),
      s = e("cipher-base"), l = e("./aes"), u = e("evp_bytestokey");

    function c(e, t, r) {
      s.call(this), this._cache = new h, this._last = void 0, this._cipher = new l.AES(t), this._prev = n.from(r), this._mode = e, this._autopadding = !0;
    }

    function h() {
      this.cache = n.allocUnsafe(0);
    }

    function d(e, t, r) {
      e = o[e.toLowerCase()];
      if (!e) throw new TypeError("invalid suite type");
      if ("string" == typeof r && (r = n.from(r)), "GCM" !== e.mode && r.length !== e.iv) throw new TypeError("invalid iv length " + r.length);
      if ((t = "string" == typeof t ? n.from(t) : t).length !== e.key / 8) throw new TypeError("invalid key length " + t.length);
      return "stream" === e.type ? new a(e.module, t, r, !0) : "auth" === e.type ? new i(e.module, t, r, !0) : new c(e.module, t, r);
    }

    e("inherits")(c, s), c.prototype._update = function(e) {
      var t;
      this._cache.add(e);
      for (var r = []; t = this._cache.get(this._autopadding);) t = this._mode.decrypt(this, t), r.push(t);
      return n.concat(r);
    }, c.prototype._final = function() {
      var e = this._cache.flush();
      if (this._autopadding) return function(e) {
        var t = e[15];
        if (t < 1 || 16 < t) throw new Error("unable to decrypt data");
        var r = -1;
        for (; ++r < t;) if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
        if (16 !== t) return e.slice(0, 16 - t);
      }(this._mode.decrypt(this, e));
      if (e) throw new Error("data not multiple of block length");
    }, c.prototype.setAutoPadding = function(e) {
      return this._autopadding = !!e, this;
    }, h.prototype.add = function(e) {
      this.cache = n.concat([this.cache, e]);
    }, h.prototype.get = function(e) {
      var t;
      if (e) {
        if (16 < this.cache.length) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
      } else if (16 <= this.cache.length) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
      return null;
    }, h.prototype.flush = function() {
      if (this.cache.length) return this.cache;
    }, r.createDecipher = function(e, t) {
      var r = o[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      return r = u(t, !1, r.key, r.iv), d(e, r.key, r.iv);
    }, r.createDecipheriv = d;
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 65,
    evp_bytestokey: 109,
    inherits: 142,
    "safe-buffer": 187
  }],
  24: [function(e, t, r) {
    var i = e("./modes"), n = e("./authCipher"), o = e("safe-buffer").Buffer, a = e("./streamCipher"),
      s = e("cipher-base"), l = e("./aes"), u = e("evp_bytestokey");

    function c(e, t, r) {
      s.call(this), this._cache = new d, this._cipher = new l.AES(t), this._prev = o.from(r), this._mode = e, this._autopadding = !0;
    }

    e("inherits")(c, s), c.prototype._update = function(e) {
      var t;
      this._cache.add(e);
      for (var r = []; t = this._cache.get();) t = this._mode.encrypt(this, t), r.push(t);
      return o.concat(r);
    };
    var h = o.alloc(16, 16);

    function d() {
      this.cache = o.allocUnsafe(0);
    }

    function f(e, t, r) {
      e = i[e.toLowerCase()];
      if (!e) throw new TypeError("invalid suite type");
      if ((t = "string" == typeof t ? o.from(t) : t).length !== e.key / 8) throw new TypeError("invalid key length " + t.length);
      if ("string" == typeof r && (r = o.from(r)), "GCM" !== e.mode && r.length !== e.iv) throw new TypeError("invalid iv length " + r.length);
      return new ("stream" === e.type ? a : "auth" === e.type ? n : c)(e.module, t, r);
    }

    c.prototype._final = function() {
      var e = this._cache.flush();
      if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e;
      if (!e.equals(h)) throw this._cipher.scrub(), new Error("data not multiple of block length");
    }, c.prototype.setAutoPadding = function(e) {
      return this._autopadding = !!e, this;
    }, d.prototype.add = function(e) {
      this.cache = o.concat([this.cache, e]);
    }, d.prototype.get = function() {
      if (15 < this.cache.length) {
        var e = this.cache.slice(0, 16);
        return this.cache = this.cache.slice(16), e;
      }
      return null;
    }, d.prototype.flush = function() {
      for (var e = 16 - this.cache.length, t = o.allocUnsafe(e), r = -1; ++r < e;) t.writeUInt8(e, r);
      return o.concat([this.cache, t]);
    }, r.createCipheriv = f, r.createCipher = function(e, t) {
      var r = i[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      return r = u(t, !1, r.key, r.iv), f(e, r.key, r.iv);
    };
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 65,
    evp_bytestokey: 109,
    inherits: 142,
    "safe-buffer": 187
  }],
  25: [function(e, t, r) {
    var i = e("safe-buffer").Buffer, n = i.alloc(16, 0);

    function a(e) {
      var t = i.allocUnsafe(16);
      return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t;
    }

    function o(e) {
      this.h = e, this.state = i.alloc(16, 0), this.cache = i.allocUnsafe(0);
    }

    o.prototype.ghash = function(e) {
      for (var t = -1; ++t < e.length;) this.state[t] ^= e[t];
      this._multiply();
    }, o.prototype._multiply = function() {
      for (var e, t, r, i = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], n = [0, 0, 0, 0], o = -1; ++o < 128;) {
        for (0 != (this.state[~~(o / 8)] & 1 << 7 - o % 8) && (n[0] ^= i[0], n[1] ^= i[1], n[2] ^= i[2], n[3] ^= i[3]), r = 0 != (1 & i[3]), t = 3; 0 < t; t--) i[t] = i[t] >>> 1 | (1 & i[t - 1]) << 31;
        i[0] = i[0] >>> 1, r && (i[0] = i[0] ^ 225 << 24);
      }
      this.state = a(n);
    }, o.prototype.update = function(e) {
      var t;
      for (this.cache = i.concat([this.cache, e]); 16 <= this.cache.length;) t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t);
    }, o.prototype["final"] = function(e, t) {
      return this.cache.length && this.ghash(i.concat([this.cache, n], 16)), this.ghash(a([0, e, 0, t])), this.state;
    }, t.exports = o;
  }, { "safe-buffer": 187 }],
  26: [function(e, t, r) {
    t.exports = function(e) {
      for (var t, r = e.length; r--;) {
        if (255 !== (t = e.readUInt8(r))) {
          t++, e.writeUInt8(t, r);
          break;
        }
        e.writeUInt8(0, r);
      }
    };
  }, {}],
  27: [function(e, t, r) {
    var i = e("buffer-xor");
    r.encrypt = function(e, t) {
      t = i(t, e._prev);
      return e._prev = e._cipher.encryptBlock(t), e._prev;
    }, r.decrypt = function(e, t) {
      var r = e._prev;
      e._prev = t;
      t = e._cipher.decryptBlock(t);
      return i(t, r);
    };
  }, { "buffer-xor": 63 }],
  28: [function(e, t, r) {
    var o = e("safe-buffer").Buffer, a = e("buffer-xor");

    function s(e, t, r) {
      var i = t.length, n = a(t, e._cache);
      return e._cache = e._cache.slice(i), e._prev = o.concat([e._prev, r ? t : n]), n;
    }

    r.encrypt = function(e, t, r) {
      for (var i, n = o.allocUnsafe(0); t.length;) {
        if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = o.allocUnsafe(0)), !(e._cache.length <= t.length)) {
          n = o.concat([n, s(e, t, r)]);
          break;
        }
        i = e._cache.length, n = o.concat([n, s(e, t.slice(0, i), r)]), t = t.slice(i);
      }
      return n;
    };
  }, { "buffer-xor": 63, "safe-buffer": 187 }],
  29: [function(e, t, r) {
    var s = e("safe-buffer").Buffer;

    function a(e, t, r) {
      for (var i, n, o = -1, a = 0; ++o < 8;) a += (128 & (n = e._cipher.encryptBlock(e._prev)[0] ^ (i = t & 1 << 7 - o ? 128 : 0))) >> o % 8, e._prev = function(e, t) {
        var r = e.length, i = -1, n = s.allocUnsafe(e.length);
        e = s.concat([e, s.from([t])]);
        for (; ++i < r;) n[i] = e[i] << 1 | e[i + 1] >> 7;
        return n;
      }(e._prev, r ? i : n);
      return a;
    }

    r.encrypt = function(e, t, r) {
      for (var i = t.length, n = s.allocUnsafe(i), o = -1; ++o < i;) n[o] = a(e, t[o], r);
      return n;
    };
  }, { "safe-buffer": 187 }],
  30: [function(e, t, r) {
    var c = e("safe-buffer").Buffer;
    r.encrypt = function(e, t, r) {
      for (var i, n, o, a, s = t.length, l = c.allocUnsafe(s), u = -1; ++u < s;) l[u] = (i = e, n = t[u], o = r, a = void 0, a = i._cipher.encryptBlock(i._prev)[0] ^ n, i._prev = c.concat([i._prev.slice(1), c.from([o ? n : a])]), a);
      return l;
    };
  }, { "safe-buffer": 187 }],
  31: [function(e, t, r) {
    var l = e("buffer-xor"), u = e("safe-buffer").Buffer, c = e("../incr32");
    r.encrypt = function(e, t) {
      var r = Math.ceil(t.length / 16), i = e._cache.length;
      e._cache = u.concat([e._cache, u.allocUnsafe(16 * r)]);
      for (var n = 0; n < r; n++) {
        var o = (a = void 0, a = (o = e)._cipher.encryptBlockRaw(o._prev), c(o._prev), a), a = i + 16 * n;
        e._cache.writeUInt32BE(o[0], a + 0), e._cache.writeUInt32BE(o[1], a + 4), e._cache.writeUInt32BE(o[2], a + 8), e._cache.writeUInt32BE(o[3], a + 12);
      }
      var s = e._cache.slice(0, t.length);
      return e._cache = e._cache.slice(t.length), l(t, s);
    };
  }, { "../incr32": 26, "buffer-xor": 63, "safe-buffer": 187 }],
  32: [function(e, t, r) {
    r.encrypt = function(e, t) {
      return e._cipher.encryptBlock(t);
    }, r.decrypt = function(e, t) {
      return e._cipher.decryptBlock(t);
    };
  }, {}],
  33: [function(e, t, r) {
    var i, n = {
      ECB: e("./ecb"),
      CBC: e("./cbc"),
      CFB: e("./cfb"),
      CFB8: e("./cfb8"),
      CFB1: e("./cfb1"),
      OFB: e("./ofb"),
      CTR: e("./ctr"),
      GCM: e("./ctr")
    }, o = e("./list.json");
    for (i in o) o[i].module = n[o[i].mode];
    t.exports = o;
  }, {
    "./cbc": 27,
    "./cfb": 28,
    "./cfb1": 29,
    "./cfb8": 30,
    "./ctr": 31,
    "./ecb": 32,
    "./list.json": 34,
    "./ofb": 35
  }],
  34: [function(e, t, r) {
    t.exports = {
      "aes-128-ecb": { cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block" },
      "aes-192-ecb": { cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block" },
      "aes-256-ecb": { cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block" },
      "aes-128-cbc": { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" },
      "aes-192-cbc": { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" },
      "aes-256-cbc": { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" },
      aes128: { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" },
      aes192: { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" },
      aes256: { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" },
      "aes-128-cfb": { cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream" },
      "aes-192-cfb": { cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream" },
      "aes-256-cfb": { cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream" },
      "aes-128-cfb8": { cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream" },
      "aes-192-cfb8": { cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream" },
      "aes-256-cfb8": { cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream" },
      "aes-128-cfb1": { cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream" },
      "aes-192-cfb1": { cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream" },
      "aes-256-cfb1": { cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream" },
      "aes-128-ofb": { cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream" },
      "aes-192-ofb": { cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream" },
      "aes-256-ofb": { cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream" },
      "aes-128-ctr": { cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream" },
      "aes-192-ctr": { cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream" },
      "aes-256-ctr": { cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream" },
      "aes-128-gcm": { cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth" },
      "aes-192-gcm": { cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth" },
      "aes-256-gcm": { cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth" }
    };
  }, {}],
  35: [function(e, t, r) {
    !function(o) {
      !function() {
        var n = e("buffer-xor");
        r.encrypt = function(e, t) {
          for (; e._cache.length < t.length;) e._cache = o.concat([e._cache, ((r = e)._prev = r._cipher.encryptBlock(r._prev), r._prev)]);
          var r, i = e._cache.slice(0, t.length);
          return e._cache = e._cache.slice(t.length), n(t, i);
        };
      }.call(this);
    }.call(this, e("buffer").Buffer);
  }, { buffer: 64, "buffer-xor": 63 }],
  36: [function(e, t, r) {
    var n = e("./aes"), o = e("safe-buffer").Buffer, a = e("cipher-base");

    function i(e, t, r, i) {
      a.call(this), this._cipher = new n.AES(t), this._prev = o.from(r), this._cache = o.allocUnsafe(0), this._secCache = o.allocUnsafe(0), this._decrypt = i, this._mode = e;
    }

    e("inherits")(i, a), i.prototype._update = function(e) {
      return this._mode.encrypt(this, e, this._decrypt);
    }, i.prototype._final = function() {
      this._cipher.scrub();
    }, t.exports = i;
  }, { "./aes": 20, "cipher-base": 65, inherits: 142, "safe-buffer": 187 }],
  37: [function(e, t, r) {
    var i = e("browserify-des"), n = e("browserify-aes/browser"), o = e("browserify-aes/modes"),
      a = e("browserify-des/modes"), s = e("evp_bytestokey");

    function l(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return n.createCipheriv(e, t, r);
      if (a[e]) return new i({ key: t, iv: r, mode: e });
      throw new TypeError("invalid suite type");
    }

    function u(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return n.createDecipheriv(e, t, r);
      if (a[e]) return new i({ key: t, iv: r, mode: e, decrypt: !0 });
      throw new TypeError("invalid suite type");
    }

    r.createCipher = r.Cipher = function(e, t) {
      var r;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, i = o[e].iv; else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, i = a[e].iv;
      }
      var i = s(t, !1, r, i);
      return l(e, i.key, i.iv);
    }, r.createCipheriv = r.Cipheriv = l, r.createDecipher = r.Decipher = function(e, t) {
      var r;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, i = o[e].iv; else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, i = a[e].iv;
      }
      var i = s(t, !1, r, i);
      return u(e, i.key, i.iv);
    }, r.createDecipheriv = r.Decipheriv = u, r.listCiphers = r.getCiphers = function() {
      return Object.keys(a).concat(n.getCiphers());
    };
  }, {
    "browserify-aes/browser": 22,
    "browserify-aes/modes": 33,
    "browserify-des": 38,
    "browserify-des/modes": 39,
    evp_bytestokey: 109
  }],
  38: [function(e, t, r) {
    var o = e("cipher-base"), i = e("des.js"), n = e("inherits"), a = e("safe-buffer").Buffer, s = {
      "des-ede3-cbc": i.CBC.instantiate(i.EDE),
      "des-ede3": i.EDE,
      "des-ede-cbc": i.CBC.instantiate(i.EDE),
      "des-ede": i.EDE,
      "des-cbc": i.CBC.instantiate(i.DES),
      "des-ecb": i.DES
    };

    function l(e) {
      o.call(this);
      var t = e.mode.toLowerCase(), r = s[t], i = e.decrypt ? "decrypt" : "encrypt", n = e.key;
      a.isBuffer(n) || (n = a.from(n)), "des-ede" !== t && "des-ede-cbc" !== t || (n = a.concat([n, n.slice(0, 8)]));
      e = e.iv;
      a.isBuffer(e) || (e = a.from(e)), this._des = r.create({ key: n, iv: e, type: i });
    }

    s.des = s["des-cbc"], s.des3 = s["des-ede3-cbc"], n(t.exports = l, o), l.prototype._update = function(e) {
      return a.from(this._des.update(e));
    }, l.prototype._final = function() {
      return a.from(this._des["final"]());
    };
  }, { "cipher-base": 65, "des.js": 80, inherits: 142, "safe-buffer": 187 }],
  39: [function(e, t, r) {
    r["des-ecb"] = { key: 8, iv: 0 }, r["des-cbc"] = r.des = { key: 8, iv: 8 }, r["des-ede3-cbc"] = r.des3 = {
      key: 24,
      iv: 8
    }, r["des-ede3"] = { key: 24, iv: 0 }, r["des-ede-cbc"] = { key: 16, iv: 8 }, r["des-ede"] = { key: 16, iv: 0 };
  }, {}],
  40: [function(t, r, e) {
    !function(c) {
      !function() {
        var l = t("bn.js"), i = t("randombytes");

        function u(e) {
          for (var t, r = e.modulus.byteLength(); 0 <= (t = new l(i(r))).cmp(e.modulus) || !t.umod(e.prime1) || !t.umod(e.prime2);) ;
          return t;
        }

        function e(e, t) {
          var r = {
              blinder: (a = u(s = t)).toRed(l.mont(s.modulus)).redPow(new l(s.publicExponent)).fromRed(),
              unblinder: a.invm(s.modulus)
            }, i = t.modulus.byteLength(), n = new l(e).mul(r.blinder).umod(t.modulus), o = n.toRed(l.mont(t.prime1)),
            a = n.toRed(l.mont(t.prime2)), s = t.coefficient, e = t.prime1, n = t.prime2,
            o = o.redPow(t.exponent1).fromRed(), a = a.redPow(t.exponent2).fromRed(),
            n = o.isub(a).imul(s).umod(e).imul(n);
          return a.iadd(n).imul(r.unblinder).umod(t.modulus).toArrayLike(c, "be", i);
        }

        e.getr = u, r.exports = e;
      }.call(this);
    }.call(this, t("buffer").Buffer);
  }, { "bn.js": 17, buffer: 64, randombytes: 170 }],
  41: [function(e, t, r) {
    t.exports = e("./browser/algorithms.json");
  }, { "./browser/algorithms.json": 42 }],
  42: [function(e, t, r) {
    t.exports = {
      sha224WithRSAEncryption: { sign: "rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" },
      "RSA-SHA224": { sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" },
      sha256WithRSAEncryption: { sign: "rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" },
      "RSA-SHA256": { sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" },
      sha384WithRSAEncryption: { sign: "rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" },
      "RSA-SHA384": { sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" },
      sha512WithRSAEncryption: { sign: "rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" },
      "RSA-SHA512": { sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" },
      "RSA-SHA1": { sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414" },
      "ecdsa-with-SHA1": { sign: "ecdsa", hash: "sha1", id: "" },
      sha256: { sign: "ecdsa", hash: "sha256", id: "" },
      sha224: { sign: "ecdsa", hash: "sha224", id: "" },
      sha384: { sign: "ecdsa", hash: "sha384", id: "" },
      sha512: { sign: "ecdsa", hash: "sha512", id: "" },
      "DSA-SHA": { sign: "dsa", hash: "sha1", id: "" },
      "DSA-SHA1": { sign: "dsa", hash: "sha1", id: "" },
      DSA: { sign: "dsa", hash: "sha1", id: "" },
      "DSA-WITH-SHA224": { sign: "dsa", hash: "sha224", id: "" },
      "DSA-SHA224": { sign: "dsa", hash: "sha224", id: "" },
      "DSA-WITH-SHA256": { sign: "dsa", hash: "sha256", id: "" },
      "DSA-SHA256": { sign: "dsa", hash: "sha256", id: "" },
      "DSA-WITH-SHA384": { sign: "dsa", hash: "sha384", id: "" },
      "DSA-SHA384": { sign: "dsa", hash: "sha384", id: "" },
      "DSA-WITH-SHA512": { sign: "dsa", hash: "sha512", id: "" },
      "DSA-SHA512": { sign: "dsa", hash: "sha512", id: "" },
      "DSA-RIPEMD160": { sign: "dsa", hash: "rmd160", id: "" },
      ripemd160WithRSA: { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" },
      "RSA-RIPEMD160": { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" },
      md5WithRSAEncryption: { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" },
      "RSA-MD5": { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" }
    };
  }, {}],
  43: [function(e, t, r) {
    t.exports = {
      "1.3.132.0.10": "secp256k1",
      "1.3.132.0.33": "p224",
      "1.2.840.10045.3.1.1": "p192",
      "1.2.840.10045.3.1.7": "p256",
      "1.3.132.0.34": "p384",
      "1.3.132.0.35": "p521"
    };
  }, {}],
  44: [function(e, t, r) {
    var i = e("safe-buffer").Buffer, n = e("create-hash"), o = e("readable-stream"), a = e("inherits"), s = e("./sign"),
      l = e("./verify"), u = e("./algorithms.json");

    function c(e) {
      o.Writable.call(this);
      e = u[e];
      if (!e) throw new Error("Unknown message digest");
      this._hashType = e.hash, this._hash = n(e.hash), this._tag = e.id, this._signType = e.sign;
    }

    function h(e) {
      o.Writable.call(this);
      e = u[e];
      if (!e) throw new Error("Unknown message digest");
      this._hash = n(e.hash), this._tag = e.id, this._signType = e.sign;
    }

    function d(e) {
      return new c(e);
    }

    function f(e) {
      return new h(e);
    }

    Object.keys(u).forEach(function(e) {
      u[e].id = i.from(u[e].id, "hex"), u[e.toLowerCase()] = u[e];
    }), a(c, o.Writable), c.prototype._write = function(e, t, r) {
      this._hash.update(e), r();
    }, c.prototype.update = function(e, t) {
      return "string" == typeof e && (e = i.from(e, t)), this._hash.update(e), this;
    }, c.prototype.sign = function(e, t) {
      this.end();
      var r = this._hash.digest(), e = s(r, e, this._hashType, this._signType, this._tag);
      return t ? e.toString(t) : e;
    }, a(h, o.Writable), h.prototype._write = function(e, t, r) {
      this._hash.update(e), r();
    }, h.prototype.update = function(e, t) {
      return "string" == typeof e && (e = i.from(e, t)), this._hash.update(e), this;
    }, h.prototype.verify = function(e, t, r) {
      "string" == typeof t && (t = i.from(t, r)), this.end();
      r = this._hash.digest();
      return l(t, r, e, this._signType, this._tag);
    }, t.exports = { Sign: d, Verify: f, createSign: d, createVerify: f };
  }, {
    "./algorithms.json": 42,
    "./sign": 45,
    "./verify": 46,
    "create-hash": 69,
    inherits: 142,
    "readable-stream": 61,
    "safe-buffer": 62
  }],
  45: [function(e, t, r) {
    var d = e("safe-buffer").Buffer, o = e("create-hmac"), l = e("browserify-rsa"), u = e("elliptic").ec,
      f = e("bn.js"), c = e("parse-asn1"), h = e("./curves.json");

    function p(e, t, r, i) {
      (e = d.from(e.toArray())).length < t.byteLength() && (n = d.alloc(t.byteLength() - e.length), e = d.concat([n, e]));
      var n = r.length, r = function(e, t) {
        e = (e = y(e, t)).mod(t);
        e = d.from(e.toArray());
        e.length < t.byteLength() && (t = d.alloc(t.byteLength() - e.length), e = d.concat([t, e]));
        return e;
      }(r, t);
      (t = d.alloc(n)).fill(1);
      n = d.alloc(n), n = o(i, n).update(t).update(d.from([0])).update(e).update(r).digest(), t = o(i, n).update(t).digest();
      return {
        k: n = o(i, n).update(t).update(d.from([1])).update(e).update(r).digest(),
        v: t = o(i, n).update(t).digest()
      };
    }

    function y(e, t) {
      var r = new f(e), t = (e.length << 3) - t.bitLength();
      return 0 < t && r.ishrn(t), r;
    }

    function g(e, t, r) {
      var i, n;
      do {
        for (i = d.alloc(0); 8 * i.length < e.bitLength();) t.v = o(r, t.k).update(t.v).digest(), i = d.concat([i, t.v]);
      } while (n = y(i, e), t.k = o(r, t.k).update(t.v).update(d.from([0])).digest(), t.v = o(r, t.k).update(t.v).digest(), -1 !== n.cmp(e));
      return n;
    }

    t.exports = function(e, t, r, i, n) {
      if ((t = c(t)).curve) {
        if ("ecdsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
        return function(e, t) {
          var r = h[t.curve.join(".")];
          if (!r) throw new Error("unknown curve " + t.curve.join("."));
          e = new u(r).keyFromPrivate(t.privateKey).sign(e);
          return d.from(e.toDER());
        }(e, t);
      }
      if ("dsa" === t.type) {
        if ("dsa" !== i) throw new Error("wrong private key type");
        return function(e, t, r) {
          var i, n = t.params.priv_key, o = t.params.p, a = t.params.q, s = t.params.g, l = new f(0),
            u = y(e, a).mod(a), c = !1, h = p(n, a, e, r);
          for (; !1 === c;) i = g(a, h, r), l = function(e, t, r, i) {
            return e.toRed(f.mont(r)).redPow(t).fromRed().mod(i);
          }(s, i, o, a), 0 === (c = i.invm(a).imul(u.add(n.mul(l))).mod(a)).cmpn(0) && (c = !1, l = new f(0));
          return function(e, t) {
            e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e));
            128 & t[0] && (t = [0].concat(t));
            var r = [48, e.length + t.length + 4, 2, e.length];
            return r = r.concat(e, [2, t.length], t), d.from(r);
          }(l, c);
        }(e, t, r);
      }
      if ("rsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
      e = d.concat([n, e]);
      for (var o = t.modulus.byteLength(), a = [0, 1]; e.length + a.length + 1 < o;) a.push(255);
      a.push(0);
      for (var s = -1; ++s < e.length;) a.push(e[s]);
      return l(a, t);
    }, t.exports.getKey = p, t.exports.makeKey = g;
  }, {
    "./curves.json": 43,
    "bn.js": 17,
    "browserify-rsa": 40,
    "create-hmac": 71,
    elliptic: 91,
    "parse-asn1": 154,
    "safe-buffer": 62
  }],
  46: [function(e, t, r) {
    var c = e("safe-buffer").Buffer, h = e("bn.js"), d = e("elliptic").ec, f = e("parse-asn1"), p = e("./curves.json");

    function y(e, t) {
      if (e.cmpn(0) <= 0) throw new Error("invalid sig");
      if (e.cmp(t) >= t) throw new Error("invalid sig");
    }

    t.exports = function(e, t, r, i, n) {
      if ("ec" === (r = f(r)).type) {
        if ("ecdsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong public key type");
        return function(e, t, r) {
          var i = p[r.data.algorithm.curve.join(".")];
          if (!i) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
          i = new d(i), r = r.data.subjectPrivateKey.data;
          return i.verify(t, e, r);
        }(e, t, r);
      }
      if ("dsa" === r.type) {
        if ("dsa" !== i) throw new Error("wrong public key type");
        return function(e, t, r) {
          var i = r.data.p, n = r.data.q, o = r.data.g, a = r.data.pub_key, s = f.signature.decode(e, "der"), r = s.s,
            e = s.r;
          y(r, n), y(e, n);
          s = h.mont(i), r = r.invm(n);
          return 0 === o.toRed(s).redPow(new h(t).mul(r).mod(n)).fromRed().mul(a.toRed(s).redPow(e.mul(r).mod(n)).fromRed()).mod(i).mod(n).cmp(e);
        }(e, t, r);
      }
      if ("rsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong public key type");
      t = c.concat([n, t]);
      for (var o = r.modulus.byteLength(), a = [1], s = 0; t.length + a.length + 2 < o;) a.push(255), s++;
      a.push(0);
      for (var l = -1; ++l < t.length;) a.push(t[l]);
      a = c.from(a), n = h.mont(r.modulus), e = (e = new h(e).toRed(n)).redPow(new h(r.publicExponent)), e = c.from(e.fromRed().toArray());
      var u = s < 8 ? 1 : 0, o = Math.min(e.length, a.length);
      for (e.length !== a.length && (u = 1), l = -1; ++l < o;) u |= e[l] ^ a[l];
      return 0 === u;
    };
  }, { "./curves.json": 43, "bn.js": 17, elliptic: 91, "parse-asn1": 154, "safe-buffer": 62 }],
  47: [function(e, t, r) {
    "use strict";
    var i = {};

    function n(e, n, t) {
      var r = function(i) {
        var e, t;

        function r(e, t, r) {
          return i.call(this, (e = e, t = t, r = r, "string" == typeof n ? n : n(e, t, r))) || this;
        }

        return t = i, (e = r).prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t, r;
      }(t = t || Error);
      r.prototype.name = t.name, r.prototype.code = e, i[e] = r;
    }

    function l(e, t) {
      if (Array.isArray(e)) {
        var r = e.length;
        return e = e.map(function(e) {
          return String(e);
        }), 2 < r ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
      }
      return "of ".concat(t, " ").concat(String(e));
    }

    n("ERR_INVALID_OPT_VALUE", function(e, t) {
      return "The value \"" + t + "\" is invalid for option \"" + e + "\"";
    }, TypeError), n("ERR_INVALID_ARG_TYPE", function(e, t, r) {
      var i, n, o, a, s;
      return "string" == typeof t && (a = "not ", t.substr(!o || o < 0 ? 0 : +o, a.length) === a) ? (i = "must not be", t = t.replace(/^not /, "")) : i = "must be", o = e, a = " argument", (void 0 === s || s > o.length) && (s = o.length), t = o.substring(s - a.length, s) === a ? "The ".concat(e, " ").concat(i, " ").concat(l(t, "type")) : (n = (n = "number" != typeof n ? 0 : n) + (s = ".").length > (a = e).length || -1 === a.indexOf(s, n) ? "argument" : "property", "The \"".concat(e, "\" ").concat(n, " ").concat(i, " ").concat(l(t, "type"))), t += ". Received type ".concat(typeof r);
    }, TypeError), n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), n("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
      return "The " + e + " method is not implemented";
    }), n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), n("ERR_STREAM_DESTROYED", function(e) {
      return "Cannot call " + e + " after a stream was destroyed";
    }), n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), n("ERR_STREAM_WRITE_AFTER_END", "write after end"), n("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), n("ERR_UNKNOWN_ENCODING", function(e) {
      return "Unknown encoding: " + e;
    }, TypeError), n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t.exports.codes = i;
  }, {}],
  48: [function(c, h, e) {
    !function(u) {
      !function() {
        "use strict";
        var e = Object.keys || function(e) {
          var t, r = [];
          for (t in e) r.push(t);
          return r;
        };
        h.exports = a;
        var t = c("./_stream_readable"), r = c("./_stream_writable");
        c("inherits")(a, t);
        for (var i = e(r.prototype), n = 0; n < i.length; n++) {
          var o = i[n];
          a.prototype[o] || (a.prototype[o] = r.prototype[o]);
        }

        function a(e) {
          if (!(this instanceof a)) return new a(e);
          t.call(this, e), r.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", s)));
        }

        function s() {
          this._writableState.ended || u.nextTick(l, this);
        }

        function l(e) {
          e.end();
        }

        Object.defineProperty(a.prototype, "writableHighWaterMark", {
          enumerable: !1, get: function() {
            return this._writableState.highWaterMark;
          }
        }), Object.defineProperty(a.prototype, "writableBuffer", {
          enumerable: !1, get: function() {
            return this._writableState && this._writableState.getBuffer();
          }
        }), Object.defineProperty(a.prototype, "writableLength", {
          enumerable: !1, get: function() {
            return this._writableState.length;
          }
        }), Object.defineProperty(a.prototype, "destroyed", {
          enumerable: !1, get: function() {
            return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
          }, set: function(e) {
            void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
          }
        });
      }.call(this);
    }.call(this, c("_process"));
  }, { "./_stream_readable": 50, "./_stream_writable": 52, _process: 162, inherits: 142 }],
  49: [function(e, t, r) {
    "use strict";
    t.exports = n;
    var i = e("./_stream_transform");

    function n(e) {
      if (!(this instanceof n)) return new n(e);
      i.call(this, e);
    }

    e("inherits")(n, i), n.prototype._transform = function(e, t, r) {
      r(null, e);
    };
  }, { "./_stream_transform": 51, inherits: 142 }],
  50: [function(H, j, e) {
    !function(U, N) {
      !function() {
        "use strict";
        var i;
        (j.exports = v).ReadableState = _;

        function p(e, t) {
          return e.listeners(t).length;
        }

        H("events").EventEmitter;
        var n = H("./internal/streams/stream"), c = H("buffer").Buffer, h = N.Uint8Array || function() {
        };
        var o, e, r, t = H("util"), y = t && t.debuglog ? t.debuglog("stream") : function() {
          }, a = H("./internal/streams/buffer_list"), s = H("./internal/streams/destroy"),
          l = H("./internal/streams/state").getHighWaterMark, t = H("../errors").codes, d = t.ERR_INVALID_ARG_TYPE,
          f = t.ERR_STREAM_PUSH_AFTER_EOF, u = t.ERR_METHOD_NOT_IMPLEMENTED, g = t.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
        H("inherits")(v, n);
        var m = s.errorOrDestroy, b = ["error", "close", "destroy", "pause", "resume"];

        function _(e, t, r) {
          i = i || H("./_stream_duplex"), "boolean" != typeof r && (r = t instanceof i), this.objectMode = !!(e = e || {}).objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode), this.highWaterMark = l(this, e, "readableHighWaterMark", r), this.buffer = new a, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (o = o || H("string_decoder/").StringDecoder, this.decoder = new o(e.encoding), this.encoding = e.encoding);
        }

        function v(e) {
          if (i = i || H("./_stream_duplex"), !(this instanceof v)) return new v(e);
          this._readableState = new _(e, this, this instanceof i), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), n.call(this);
        }

        function w(e, t, r, i, n) {
          y("readableAddChunk", t);
          var o, a, s, l, u = e._readableState;
          if (null === t) u.reading = !1, a = e, s = u, y("onEofChunk"), s.ended || (!s.decoder || (l = s.decoder.end()) && l.length && (s.buffer.push(l), s.length += s.objectMode ? 1 : l.length), s.ended = !0, s.sync ? x(a) : (s.needReadable = !1, s.emittedReadable || (s.emittedReadable = !0, M(a)))); else if (o = !n ? function(e, t) {
            var r;
            (function(e) {
              return c.isBuffer(e) || e instanceof h;
            })(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new d("chunk", ["string", "Buffer", "Uint8Array"], t));
            return r;
          }(u, t) : o) m(e, o); else if (u.objectMode || t && 0 < t.length) if ("string" == typeof t || u.objectMode || Object.getPrototypeOf(t) === c.prototype || (o = t, t = c.from(o)), i) u.endEmitted ? m(e, new g) : S(e, u, t, !0); else if (u.ended) m(e, new f); else {
            if (u.destroyed) return !1;
            u.reading = !1, u.decoder && !r ? (t = u.decoder.write(t), u.objectMode || 0 !== t.length ? S(e, u, t, !1) : k(e, u)) : S(e, u, t, !1);
          } else i || (u.reading = !1, k(e, u));
          return !u.ended && (u.length < u.highWaterMark || 0 === u.length);
        }

        function S(e, t, r, i) {
          t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && x(e)), k(e, t);
        }

        Object.defineProperty(v.prototype, "destroyed", {
          enumerable: !1, get: function() {
            return void 0 !== this._readableState && this._readableState.destroyed;
          }, set: function(e) {
            this._readableState && (this._readableState.destroyed = e);
          }
        }), v.prototype.destroy = s.destroy, v.prototype._undestroy = s.undestroy, v.prototype._destroy = function(e, t) {
          t(e);
        }, v.prototype.push = function(e, t) {
          var r, i = this._readableState;
          return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = c.from(e, t), t = ""), r = !0), w(this, e, t, !1, r);
        }, v.prototype.unshift = function(e) {
          return w(this, e, null, !0, !1);
        }, v.prototype.isPaused = function() {
          return !1 === this._readableState.flowing;
        }, v.prototype.setEncoding = function(e) {
          var t = new (o = o || H("string_decoder/").StringDecoder)(e);
          this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
          for (var r = this._readableState.buffer.head, i = ""; null !== r;) i += t.write(r.data), r = r.next;
          return this._readableState.buffer.clear(), "" !== i && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
        };
        var E = 1073741824;

        function T(e, t) {
          return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? (t.flowing && t.length ? t.buffer.head.data : t).length : (e > t.highWaterMark && (t.highWaterMark = (E <= (r = e) ? r = E : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
          var r;
        }

        function x(e) {
          var t = e._readableState;
          y("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (y("emitReadable", t.flowing), t.emittedReadable = !0, U.nextTick(M, e));
        }

        function M(e) {
          var t = e._readableState;
          y("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, R(e);
        }

        function k(e, t) {
          t.readingMore || (t.readingMore = !0, U.nextTick(P, e, t));
        }

        function P(e, t) {
          for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
            var r = t.length;
            if (y("maybeReadMore read 0"), e.read(0), r === t.length) break;
          }
          t.readingMore = !1;
        }

        function C(e) {
          var t = e._readableState;
          t.readableListening = 0 < e.listenerCount("readable"), t.resumeScheduled && !t.paused ? t.flowing = !0 : 0 < e.listenerCount("data") && e.resume();
        }

        function A(e) {
          y("readable nexttick read 0"), e.read(0);
        }

        function I(e, t) {
          y("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), R(e), t.flowing && !t.reading && e.read(0);
        }

        function R(e) {
          var t = e._readableState;
          for (y("flow", t.flowing); t.flowing && null !== e.read();) ;
        }

        function L(e, t) {
          return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r);
          var r;
        }

        function D(e) {
          var t = e._readableState;
          y("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, U.nextTick(B, t, e));
        }

        function B(e, t) {
          y("endReadableNT", e.endEmitted, e.length), e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"), !e.autoDestroy || (!(e = t._writableState) || e.autoDestroy && e.finished) && t.destroy());
        }

        function O(e, t) {
          for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
          return -1;
        }

        v.prototype.read = function(e) {
          y("read", e), e = parseInt(e, 10);
          var t = this._readableState, r = e;
          if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : 0 < t.length) || t.ended)) return y("read: emitReadable", t.length, t.ended), (0 === t.length && t.ended ? D : x)(this), null;
          if (0 === (e = T(e, t)) && t.ended) return 0 === t.length && D(this), null;
          var i = t.needReadable;
          return y("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && y("length less than watermark", i = !0), t.ended || t.reading ? y("reading or ended", i = !1) : i && (y("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = T(r, t))), null === (i = 0 < e ? L(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && D(this)), null !== i && this.emit("data", i), i;
        }, v.prototype._read = function(e) {
          m(this, new u("_read()"));
        }, v.prototype.pipe = function(r, e) {
          var i = this, n = this._readableState;
          switch (n.pipesCount) {
            case 0:
              n.pipes = r;
              break;
            case 1:
              n.pipes = [n.pipes, r];
              break;
            default:
              n.pipes.push(r);
          }
          n.pipesCount += 1, y("pipe count=%d opts=%j", n.pipesCount, e);
          e = (!e || !1 !== e.end) && r !== U.stdout && r !== U.stderr ? a : f;

          function o(e, t) {
            y("onunpipe"), e === i && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, y("cleanup"), r.removeListener("close", h), r.removeListener("finish", d), r.removeListener("drain", s), r.removeListener("error", c), r.removeListener("unpipe", o), i.removeListener("end", a), i.removeListener("end", f), i.removeListener("data", u), l = !0, !n.awaitDrain || r._writableState && !r._writableState.needDrain || s());
          }

          function a() {
            y("onend"), r.end();
          }

          n.endEmitted ? U.nextTick(e) : i.once("end", e), r.on("unpipe", o);
          var t, s = (t = i, function() {
            var e = t._readableState;
            y("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && p(t, "data") && (e.flowing = !0, R(t));
          });
          r.on("drain", s);
          var l = !1;

          function u(e) {
            y("ondata");
            e = r.write(e);
            y("dest.write", e), !1 === e && ((1 === n.pipesCount && n.pipes === r || 1 < n.pipesCount && -1 !== O(n.pipes, r)) && !l && (y("false write response, pause", n.awaitDrain), n.awaitDrain++), i.pause());
          }

          function c(e) {
            y("onerror", e), f(), r.removeListener("error", c), 0 === p(r, "error") && m(r, e);
          }

          function h() {
            r.removeListener("finish", d), f();
          }

          function d() {
            y("onfinish"), r.removeListener("close", h), f();
          }

          function f() {
            y("unpipe"), i.unpipe(r);
          }

          return i.on("data", u), function(e, t, r) {
            if ("function" == typeof e.prependListener) return e.prependListener(t, r);
            e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
          }(r, "error", c), r.once("close", h), r.once("finish", d), r.emit("pipe", i), n.flowing || (y("pipe resume"), i.resume()), r;
        }, v.prototype.unpipe = function(e) {
          var t = this._readableState, r = { hasUnpiped: !1 };
          if (0 === t.pipesCount) return this;
          if (1 === t.pipesCount) return e && e !== t.pipes || (e = e || t.pipes, t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
          if (!e) {
            var i = t.pipes, n = t.pipesCount;
            t.pipes = null, t.pipesCount = 0, t.flowing = !1;
            for (var o = 0; o < n; o++) i[o].emit("unpipe", this, { hasUnpiped: !1 });
            return this;
          }
          var a = O(t.pipes, e);
          return -1 === a || (t.pipes.splice(a, 1), --t.pipesCount, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this;
        }, v.prototype.addListener = v.prototype.on = function(e, t) {
          var r = n.prototype.on.call(this, e, t), t = this._readableState;
          return "data" === e ? (t.readableListening = 0 < this.listenerCount("readable"), !1 !== t.flowing && this.resume()) : "readable" === e && (t.endEmitted || t.readableListening || (t.readableListening = t.needReadable = !0, t.flowing = !1, t.emittedReadable = !1, y("on readable", t.length, t.reading), t.length ? x(this) : t.reading || U.nextTick(A, this))), r;
        }, v.prototype.removeListener = function(e, t) {
          t = n.prototype.removeListener.call(this, e, t);
          return "readable" === e && U.nextTick(C, this), t;
        }, v.prototype.removeAllListeners = function(e) {
          var t = n.prototype.removeAllListeners.apply(this, arguments);
          return "readable" !== e && void 0 !== e || U.nextTick(C, this), t;
        }, v.prototype.resume = function() {
          var e, t, r = this._readableState;
          return r.flowing || (y("resume"), r.flowing = !r.readableListening, e = this, (t = r).resumeScheduled || (t.resumeScheduled = !0, U.nextTick(I, e, t))), r.paused = !1, this;
        }, v.prototype.pause = function() {
          return y("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (y("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
        }, v.prototype.wrap = function(t) {
          var e, r = this, i = this._readableState, n = !1;
          for (e in t.on("end", function() {
            var e;
            y("wrapped end"), !i.decoder || i.ended || (e = i.decoder.end()) && e.length && r.push(e), r.push(null);
          }), t.on("data", function(e) {
            y("wrapped data"), i.decoder && (e = i.decoder.write(e)), i.objectMode && null == e || (i.objectMode || e && e.length) && (r.push(e) || (n = !0, t.pause()));
          }), t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function(e) {
            return function() {
              return t[e].apply(t, arguments);
            };
          }(e));
          for (var o = 0; o < b.length; o++) t.on(b[o], this.emit.bind(this, b[o]));
          return this._read = function(e) {
            y("wrapped _read", e), n && (n = !1, t.resume());
          }, this;
        }, "function" == typeof Symbol && (v.prototype[Symbol.asyncIterator] = function() {
          return (e = void 0 === e ? H("./internal/streams/async_iterator") : e)(this);
        }), Object.defineProperty(v.prototype, "readableHighWaterMark", {
          enumerable: !1, get: function() {
            return this._readableState.highWaterMark;
          }
        }), Object.defineProperty(v.prototype, "readableBuffer", {
          enumerable: !1, get: function() {
            return this._readableState && this._readableState.buffer;
          }
        }), Object.defineProperty(v.prototype, "readableFlowing", {
          enumerable: !1, get: function() {
            return this._readableState.flowing;
          }, set: function(e) {
            this._readableState && (this._readableState.flowing = e);
          }
        }), v._fromList = L, Object.defineProperty(v.prototype, "readableLength", {
          enumerable: !1, get: function() {
            return this._readableState.length;
          }
        }), "function" == typeof Symbol && (v.from = function(e, t) {
          return (r = void 0 === r ? H("./internal/streams/from") : r)(v, e, t);
        });
      }.call(this);
    }.call(this, H("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "../errors": 47,
    "./_stream_duplex": 48,
    "./internal/streams/async_iterator": 53,
    "./internal/streams/buffer_list": 54,
    "./internal/streams/destroy": 55,
    "./internal/streams/from": 57,
    "./internal/streams/state": 59,
    "./internal/streams/stream": 60,
    _process: 162,
    buffer: 64,
    events: 108,
    inherits: 142,
    "string_decoder/": 198,
    util: 19
  }],
  51: [function(e, t, r) {
    "use strict";
    t.exports = l;
    var t = e("../errors").codes, i = t.ERR_METHOD_NOT_IMPLEMENTED, n = t.ERR_MULTIPLE_CALLBACK,
      o = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, a = t.ERR_TRANSFORM_WITH_LENGTH_0, s = e("./_stream_duplex");

    function l(e) {
      if (!(this instanceof l)) return new l(e);
      s.call(this, e), this._transformState = {
        afterTransform: function(e, t) {
          var r = this._transformState;
          r.transforming = !1;
          var i = r.writecb;
          if (null === i) return this.emit("error", new n);
          r.writechunk = null, (r.writecb = null) != t && this.push(t), i(e), (e = this._readableState).reading = !1, (e.needReadable || e.length < e.highWaterMark) && this._read(e.highWaterMark);
        }.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", u);
    }

    function u() {
      var r = this;
      "function" != typeof this._flush || this._readableState.destroyed ? c(this, null, null) : this._flush(function(e, t) {
        c(r, e, t);
      });
    }

    function c(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new a;
      if (e._transformState.transforming) throw new o;
      return e.push(null);
    }

    e("inherits")(l, s), l.prototype.push = function(e, t) {
      return this._transformState.needTransform = !1, s.prototype.push.call(this, e, t);
    }, l.prototype._transform = function(e, t, r) {
      r(new i("_transform()"));
    }, l.prototype._write = function(e, t, r) {
      var i = this._transformState;
      i.writecb = r, i.writechunk = e, i.writeencoding = t, i.transforming || (t = this._readableState, (i.needTransform || t.needReadable || t.length < t.highWaterMark) && this._read(t.highWaterMark));
    }, l.prototype._read = function(e) {
      var t = this._transformState;
      null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform));
    }, l.prototype._destroy = function(e, t) {
      s.prototype._destroy.call(this, e, function(e) {
        t(e);
      });
    };
  }, { "../errors": 47, "./_stream_duplex": 48, inherits: 142 }],
  52: [function(A, I, e) {
    !function(P, C) {
      !function() {
        "use strict";

        function c(e) {
          var t = this;
          this.next = null, this.entry = null, this.finish = function() {
            !function(e, t, r) {
              var i = e.entry;
              e.entry = null;
              for (; i;) {
                var n = i.callback;
                t.pendingcb--, n(r), i = i.next;
              }
              t.corkedRequestsFree.next = e;
            }(t, e);
          };
        }

        var i;
        (I.exports = w).WritableState = v;
        var e = { deprecate: A("util-deprecate") }, r = A("./internal/streams/stream"), h = A("buffer").Buffer,
          d = C.Uint8Array || function() {
          };
        var n, t = A("./internal/streams/destroy"), o = A("./internal/streams/state").getHighWaterMark,
          a = A("../errors").codes, f = a.ERR_INVALID_ARG_TYPE, s = a.ERR_METHOD_NOT_IMPLEMENTED,
          l = a.ERR_MULTIPLE_CALLBACK, u = a.ERR_STREAM_CANNOT_PIPE, p = a.ERR_STREAM_DESTROYED,
          y = a.ERR_STREAM_NULL_VALUES, g = a.ERR_STREAM_WRITE_AFTER_END, m = a.ERR_UNKNOWN_ENCODING,
          b = t.errorOrDestroy;

        function _() {
        }

        function v(e, t, r) {
          i = i || A("./_stream_duplex"), "boolean" != typeof r && (r = t instanceof i), this.objectMode = !!(e = e || {}).objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode), this.highWaterMark = o(this, e, "writableHighWaterMark", r), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
          r = (this.destroyed = !1) === e.decodeStrings;
          this.decodeStrings = !r, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
            !function(e, t) {
              var r = e._writableState, i = r.sync, n = r.writecb;
              if ("function" != typeof n) throw new l;
              (function(e) {
                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
              })(r), t ? function(e, t, r, i, n) {
                --t.pendingcb, r ? (P.nextTick(n, i), P.nextTick(k, e, t), e._writableState.errorEmitted = !0, b(e, i)) : (n(i), e._writableState.errorEmitted = !0, b(e, i), k(e, t));
              }(e, r, i, t, n) : ((t = x(r) || e.destroyed) || r.corked || r.bufferProcessing || !r.bufferedRequest || T(e, r), i ? P.nextTick(E, e, r, t, n) : E(e, r, t, n));
            }(t, e);
          }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new c(this);
        }

        function w(e) {
          var t = this instanceof (i = i || A("./_stream_duplex"));
          if (!t && !n.call(w, this)) return new w(e);
          this._writableState = new v(e, this, t), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e["final"] && (this._final = e["final"])), r.call(this);
        }

        function S(e, t, r, i, n, o, a) {
          t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new p("write")) : r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
        }

        function E(e, t, r, i) {
          var n;
          r || (n = e, 0 === (r = t).length && r.needDrain && (r.needDrain = !1, n.emit("drain"))), t.pendingcb--, i(), k(e, t);
        }

        function T(e, t) {
          t.bufferProcessing = !0;
          var r = t.bufferedRequest;
          if (e._writev && r && r.next) {
            var i = t.bufferedRequestCount, n = new Array(i), i = t.corkedRequestsFree;
            i.entry = r;
            for (var o = 0, a = !0; r;) (n[o] = r).isBuf || (a = !1), r = r.next, o += 1;
            n.allBuffers = a, S(e, t, !0, t.length, n, "", i.finish), t.pendingcb++, t.lastBufferedRequest = null, i.next ? (t.corkedRequestsFree = i.next, i.next = null) : t.corkedRequestsFree = new c(t), t.bufferedRequestCount = 0;
          } else {
            for (; r;) {
              var s = r.chunk, l = r.encoding, u = r.callback;
              if (S(e, t, !1, t.objectMode ? 1 : s.length, s, l, u), r = r.next, t.bufferedRequestCount--, t.writing) break;
            }
            null === r && (t.lastBufferedRequest = null);
          }
          t.bufferedRequest = r, t.bufferProcessing = !1;
        }

        function x(e) {
          return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }

        function M(t, r) {
          t._final(function(e) {
            r.pendingcb--, e && b(t, e), r.prefinished = !0, t.emit("prefinish"), k(t, r);
          });
        }

        function k(e, t) {
          var r, i, n = x(t);
          return n && (r = e, (i = t).prefinished || i.finalCalled || ("function" != typeof r._final || i.destroyed ? (i.prefinished = !0, r.emit("prefinish")) : (i.pendingcb++, i.finalCalled = !0, P.nextTick(M, r, i))), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), !t.autoDestroy || (!(t = e._readableState) || t.autoDestroy && t.endEmitted) && e.destroy())), n;
        }

        A("inherits")(w, r), v.prototype.getBuffer = function() {
          for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
          return t;
        }, function() {
          try {
            Object.defineProperty(v.prototype, "buffer", {
              get: e.deprecate(function() {
                return this.getBuffer();
              }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
            });
          } catch (e) {
          }
        }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (n = Function.prototype[Symbol.hasInstance], Object.defineProperty(w, Symbol.hasInstance, {
          value: function(e) {
            return !!n.call(this, e) || this === w && (e && e._writableState instanceof v);
          }
        })) : n = function(e) {
          return e instanceof this;
        }, w.prototype.pipe = function() {
          b(this, new u);
        }, w.prototype.write = function(e, t, r) {
          var i, n, o, a, s, l, u = this._writableState, c = !1,
            i = !u.objectMode && (i = e, h.isBuffer(i) || i instanceof d);
          return i && !h.isBuffer(e) && (n = e, e = h.from(n)), "function" == typeof t && (r = t, t = null), t = i ? "buffer" : t || u.defaultEncoding, "function" != typeof r && (r = _), u.ending ? (a = this, s = r, l = new g, b(a, l), P.nextTick(s, l)) : !i && (n = this, a = u, s = r, null === (l = e) ? o = new y : "string" == typeof l || a.objectMode || (o = new f("chunk", ["string", "Buffer"], l)), o && (b(n, o), !void P.nextTick(s, o))) || (u.pendingcb++, c = function(e, t, r, i, n, o) {
            r || (l = function(e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = h.from(t, r));
              return t;
            }(t, i, n), i !== l && (r = !0, n = "buffer", i = l));
            var a = t.objectMode ? 1 : i.length;
            t.length += a;
            var s = t.length < t.highWaterMark;
            s || (t.needDrain = !0);
            {
              var l;
              t.writing || t.corked ? (l = t.lastBufferedRequest, t.lastBufferedRequest = {
                chunk: i,
                encoding: n,
                isBuf: r,
                callback: o,
                next: null
              }, l ? l.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1) : S(e, t, !1, a, i, n, o);
            }
            return s;
          }(this, u, i, e, t, r)), c;
        }, w.prototype.cork = function() {
          this._writableState.corked++;
        }, w.prototype.uncork = function() {
          var e = this._writableState;
          e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || T(this, e));
        }, w.prototype.setDefaultEncoding = function(e) {
          if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new m(e);
          return this._writableState.defaultEncoding = e, this;
        }, Object.defineProperty(w.prototype, "writableBuffer", {
          enumerable: !1, get: function() {
            return this._writableState && this._writableState.getBuffer();
          }
        }), Object.defineProperty(w.prototype, "writableHighWaterMark", {
          enumerable: !1, get: function() {
            return this._writableState.highWaterMark;
          }
        }), w.prototype._write = function(e, t, r) {
          r(new s("_write()"));
        }, w.prototype._writev = null, w.prototype.end = function(e, t, r) {
          var i = this._writableState;
          return "function" == typeof e ? (r = e, t = e = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function(e, t, r) {
            t.ending = !0, k(e, t), r && (t.finished ? P.nextTick(r) : e.once("finish", r));
            t.ended = !0, e.writable = !1;
          }(this, i, r), this;
        }, Object.defineProperty(w.prototype, "writableLength", {
          enumerable: !1, get: function() {
            return this._writableState.length;
          }
        }), Object.defineProperty(w.prototype, "destroyed", {
          enumerable: !1, get: function() {
            return void 0 !== this._writableState && this._writableState.destroyed;
          }, set: function(e) {
            this._writableState && (this._writableState.destroyed = e);
          }
        }), w.prototype.destroy = t.destroy, w.prototype._undestroy = t.undestroy, w.prototype._destroy = function(e, t) {
          t(e);
        };
      }.call(this);
    }.call(this, A("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "../errors": 47,
    "./_stream_duplex": 48,
    "./internal/streams/destroy": 55,
    "./internal/streams/state": 59,
    "./internal/streams/stream": 60,
    _process: 162,
    buffer: 64,
    inherits: 142,
    "util-deprecate": 201
  }],
  53: [function(i, g, e) {
    !function(y) {
      !function() {
        "use strict";
        var e;

        function r(e, t, r) {
          return t in e ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : e[t] = r, e;
        }

        var n = i("./end-of-stream"), o = Symbol("lastResolve"), a = Symbol("lastReject"), s = Symbol("error"),
          l = Symbol("ended"), u = Symbol("lastPromise"), c = Symbol("handlePromise"), h = Symbol("stream");

        function d(e, t) {
          return { value: e, done: t };
        }

        function f(e) {
          var t, r = e[o];
          null === r || null !== (t = e[h].read()) && (e[u] = null, e[o] = null, e[a] = null, r(d(t, !1)));
        }

        var t = Object.getPrototypeOf(function() {
        }), p = Object.setPrototypeOf((r(e = {
          get stream() {
            return this[h];
          }, next: function() {
            var r = this, e = this[s];
            if (null !== e) return Promise.reject(e);
            if (this[l]) return Promise.resolve(d(void 0, !0));
            if (this[h].destroyed) return new Promise(function(e, t) {
              y.nextTick(function() {
                r[s] ? t(r[s]) : e(d(void 0, !0));
              });
            });
            var t, i, n, e = this[u];
            if (e) t = new Promise((i = e, n = this, function(e, t) {
              i.then(function() {
                n[l] ? e(d(void 0, !0)) : n[c](e, t);
              }, t);
            })); else {
              e = this[h].read();
              if (null !== e) return Promise.resolve(d(e, !1));
              t = new Promise(this[c]);
            }
            return this[u] = t;
          }
        }, Symbol.asyncIterator, function() {
          return this;
        }), r(e, "return", function() {
          var e = this;
          return new Promise(function(t, r) {
            e[h].destroy(null, function(e) {
              e ? r(e) : t(d(void 0, !0));
            });
          });
        }), e), t);
        g.exports = function(e) {
          var t, i = Object.create(p, (r(t = {}, h, { value: e, writable: !0 }), r(t, o, {
            value: null,
            writable: !0
          }), r(t, a, { value: null, writable: !0 }), r(t, s, {
            value: null,
            writable: !0
          }), r(t, l, { value: e._readableState.endEmitted, writable: !0 }), r(t, c, {
            value: function(e, t) {
              var r = i[h].read();
              r ? (i[u] = null, i[o] = null, i[a] = null, e(d(r, !1))) : (i[o] = e, i[a] = t);
            }, writable: !0
          }), t));
          return i[u] = null, n(e, function(e) {
            if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
              var t = i[a];
              return null !== t && (i[u] = null, i[o] = null, i[a] = null, t(e)), void (i[s] = e);
            }
            e = i[o];
            null !== e && (i[u] = null, i[o] = null, e(d(void 0, !(i[a] = null)))), i[l] = !0;
          }), e.on("readable", function(e) {
            y.nextTick(f, e);
          }.bind(null, i)), i;
        };
      }.call(this);
    }.call(this, i("_process"));
  }, { "./end-of-stream": 56, _process: 162 }],
  54: [function(e, t, r) {
    "use strict";

    function o(t, e) {
      var r, i = Object.keys(t);
      return Object.getOwnPropertySymbols && (r = Object.getOwnPropertySymbols(t), e && (r = r.filter(function(e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })), i.push.apply(i, r)), i;
    }

    function n(i) {
      for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2 ? o(Object(n), !0).forEach(function(e) {
          var t, r;
          t = i, e = n[r = e], r in t ? Object.defineProperty(t, r, {
            value: e,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[r] = e;
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(n)) : o(Object(n)).forEach(function(e) {
          Object.defineProperty(i, e, Object.getOwnPropertyDescriptor(n, e));
        });
      }
      return i;
    }

    function a(e, t) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
      }
    }

    var s = e("buffer").Buffer, l = e("util").inspect, u = l && l.custom || "inspect";
    t.exports = function() {
      function e() {
        !function(e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
        }(this, e), this.head = null, this.tail = null, this.length = 0;
      }

      var t, r, i;
      return t = e, (r = [{
        key: "push", value: function(e) {
          e = { data: e, next: null };
          0 < this.length ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
        }
      }, {
        key: "unshift", value: function(e) {
          e = { data: e, next: this.head };
          0 === this.length && (this.tail = e), this.head = e, ++this.length;
        }
      }, {
        key: "shift", value: function() {
          if (0 !== this.length) {
            var e = this.head.data;
            return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
          }
        }
      }, {
        key: "clear", value: function() {
          this.head = this.tail = null, this.length = 0;
        }
      }, {
        key: "join", value: function(e) {
          if (0 === this.length) return "";
          for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
          return r;
        }
      }, {
        key: "concat", value: function(e) {
          if (0 === this.length) return s.alloc(0);
          for (var t, r, i, n = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o;) t = o.data, r = n, i = a, s.prototype.copy.call(t, r, i), a += o.data.length, o = o.next;
          return n;
        }
      }, {
        key: "consume", value: function(e, t) {
          var r;
          return e < this.head.data.length ? (r = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), r;
        }
      }, {
        key: "first", value: function() {
          return this.head.data;
        }
      }, {
        key: "_getString", value: function(e) {
          var t = this.head, r = 1, i = t.data;
          for (e -= i.length; t = t.next;) {
            var n = t.data, o = e > n.length ? n.length : e;
            if (o === n.length ? i += n : i += n.slice(0, e), 0 === (e -= o)) {
              o === n.length ? (++r, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t).data = n.slice(o);
              break;
            }
            ++r;
          }
          return this.length -= r, i;
        }
      }, {
        key: "_getBuffer", value: function(e) {
          var t = s.allocUnsafe(e), r = this.head, i = 1;
          for (r.data.copy(t), e -= r.data.length; r = r.next;) {
            var n = r.data, o = e > n.length ? n.length : e;
            if (n.copy(t, t.length - e, 0, o), 0 === (e -= o)) {
              o === n.length ? (++i, r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r).data = n.slice(o);
              break;
            }
            ++i;
          }
          return this.length -= i, t;
        }
      }, {
        key: u, value: function(e, t) {
          return l(this, n({}, t, { depth: 0, customInspect: !1 }));
        }
      }]) && a(t.prototype, r), i && a(t, i), e;
    }();
  }, { buffer: 64, util: 19 }],
  55: [function(e, t, r) {
    !function(l) {
      !function() {
        "use strict";

        function o(e, t) {
          s(e, t), a(e);
        }

        function a(e) {
          e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
        }

        function s(e, t) {
          e.emit("error", t);
        }

        t.exports = {
          destroy: function(e, t) {
            var r = this, i = this._readableState && this._readableState.destroyed,
              n = this._writableState && this._writableState.destroyed;
            return i || n ? t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, l.nextTick(s, this, e)) : l.nextTick(s, this, e)) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function(e) {
              !t && e ? r._writableState ? r._writableState.errorEmitted ? l.nextTick(a, r) : (r._writableState.errorEmitted = !0, l.nextTick(o, r, e)) : l.nextTick(o, r, e) : t ? (l.nextTick(a, r), t(e)) : l.nextTick(a, r);
            })), this;
          }, undestroy: function() {
            this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
          }, errorOrDestroy: function(e, t) {
            var r = e._readableState, i = e._writableState;
            r && r.autoDestroy || i && i.autoDestroy ? e.destroy(t) : e.emit("error", t);
          }
        };
      }.call(this);
    }.call(this, e("_process"));
  }, { _process: 162 }],
  56: [function(e, t, r) {
    "use strict";
    var m = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;

    function b() {
    }

    t.exports = function e(t, r, i) {
      if ("function" == typeof r) return e(t, null, r);
      var n, o;
      n = i || b, o = !1, i = function() {
        if (!o) {
          o = !0;
          for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
          n.apply(this, t);
        }
      };

      function a() {
        t.writable || y();
      }

      function s() {
        g = !(d = !1), f || i.call(t);
      }

      function l(e) {
        i.call(t, e);
      }

      function u() {
        var e;
        return d && !g ? (t._readableState && t._readableState.ended || (e = new m), i.call(t, e)) : f && !p ? (t._writableState && t._writableState.ended || (e = new m), i.call(t, e)) : void 0;
      }

      function c() {
        t.req.on("finish", y);
      }

      var h, d = (r = r || {}).readable || !1 !== r.readable && t.readable,
        f = r.writable || !1 !== r.writable && t.writable, p = t._writableState && t._writableState.finished,
        y = function() {
          p = !(f = !1), d || i.call(t);
        }, g = t._readableState && t._readableState.endEmitted;
      return (h = t).setHeader && "function" == typeof h.abort ? (t.on("complete", y), t.on("abort", u), t.req ? c() : t.on("request", c)) : f && !t._writableState && (t.on("end", a), t.on("close", a)), t.on("end", s), t.on("finish", y), !1 !== r.error && t.on("error", l), t.on("close", u), function() {
        t.removeListener("complete", y), t.removeListener("abort", u), t.removeListener("request", c), t.req && t.req.removeListener("finish", y), t.removeListener("end", a), t.removeListener("close", a), t.removeListener("finish", y), t.removeListener("end", s), t.removeListener("error", l), t.removeListener("close", u);
      };
    };
  }, { "../../../errors": 47 }],
  57: [function(e, t, r) {
    t.exports = function() {
      throw new Error("Readable.from is not available in the browser");
    };
  }, {}],
  58: [function(l, e, t) {
    "use strict";
    var u;
    var r = l("../../../errors").codes, s = r.ERR_MISSING_ARGS, c = r.ERR_STREAM_DESTROYED;

    function h(e) {
      if (e) throw e;
    }

    function d(r, e, t, i) {
      var n, o;
      n = i, o = !1;
      var a = !(i = function() {
        o || (o = !0, n.apply(void 0, arguments));
      });
      r.on("close", function() {
        a = !0;
      }), (u = void 0 === u ? l("./end-of-stream") : u)(r, { readable: e, writable: t }, function(e) {
        return e ? i(e) : (a = !0, void i());
      });
      var s = !1;
      return function(e) {
        var t;
        if (!a && !s) return s = !0, (t = r).setHeader && "function" == typeof t.abort ? r.abort() : "function" == typeof r.destroy ? r.destroy() : void i(e || new c("pipe"));
      };
    }

    function f(e) {
      e();
    }

    function p(e, t) {
      return e.pipe(t);
    }

    e.exports = function() {
      for (var e = arguments.length, i = new Array(e), t = 0; t < e; t++) i[t] = arguments[t];
      var r, n, o = !(r = i).length || "function" != typeof r[r.length - 1] ? h : r.pop();
      if ((i = Array.isArray(i[0]) ? i[0] : i).length < 2) throw new s("streams");
      var a = i.map(function(e, t) {
        var r = t < i.length - 1;
        return d(e, r, 0 < t, function(e) {
          n = n || e, e && a.forEach(f), r || (a.forEach(f), o(n));
        });
      });
      return i.reduce(p);
    };
  }, { "../../../errors": 47, "./end-of-stream": 56 }],
  59: [function(e, t, r) {
    "use strict";
    var a = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
    t.exports = {
      getHighWaterMark: function(e, t, r, i) {
        var n, o = (n = i, o = r, null != (t = t).highWaterMark ? t.highWaterMark : n ? t[o] : null);
        if (null == o) return e.objectMode ? 16 : 16384;
        if (!isFinite(o) || Math.floor(o) !== o || o < 0) throw new a(i ? r : "highWaterMark", o);
        return Math.floor(o);
      }
    };
  }, { "../../../errors": 47 }],
  60: [function(e, t, r) {
    t.exports = e("events").EventEmitter;
  }, { events: 108 }],
  61: [function(e, t, r) {
    (((r = t.exports = e("./lib/_stream_readable.js")).Stream = r).Readable = r).Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), r.finished = e("./lib/internal/streams/end-of-stream.js"), r.pipeline = e("./lib/internal/streams/pipeline.js");
  }, {
    "./lib/_stream_duplex.js": 48,
    "./lib/_stream_passthrough.js": 49,
    "./lib/_stream_readable.js": 50,
    "./lib/_stream_transform.js": 51,
    "./lib/_stream_writable.js": 52,
    "./lib/internal/streams/end-of-stream.js": 56,
    "./lib/internal/streams/pipeline.js": 58
  }],
  62: [function(e, t, r) {
    var i = e("buffer"), n = i.Buffer;

    function o(e, t) {
      for (var r in e) t[r] = e[r];
    }

    function a(e, t, r) {
      return n(e, t, r);
    }

    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = i : (o(i, r), r.Buffer = a), a.prototype = Object.create(n.prototype), o(n, a), a.from = function(e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return n(e, t, r);
    }, a.alloc = function(e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      e = n(e);
      return void 0 !== t ? "string" == typeof r ? e.fill(t, r) : e.fill(t) : e.fill(0), e;
    }, a.allocUnsafe = function(e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n(e);
    }, a.allocUnsafeSlow = function(e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i.SlowBuffer(e);
    };
  }, { buffer: 64 }],
  63: [function(e, t, r) {
    !function(o) {
      !function() {
        t.exports = function(e, t) {
          for (var r = Math.min(e.length, t.length), i = new o(r), n = 0; n < r; ++n) i[n] = e[n] ^ t[n];
          return i;
        };
      }.call(this);
    }.call(this, e("buffer").Buffer);
  }, { buffer: 64 }],
  64: [function(e, t, r) {
    "use strict";
    var s = e("base64-js"), o = e("ieee754");
    r.Buffer = h, r.SlowBuffer = function(e) {
      +e != e && (e = 0);
      return h.alloc(+e);
    }, r.INSPECT_MAX_BYTES = 50;
    var i = 2147483647;

    function n(e) {
      if (i < e) throw new RangeError("The value \"" + e + "\" is invalid for option \"size\"");
      e = new Uint8Array(e);
      return e.__proto__ = h.prototype, e;
    }

    function h(e, t, r) {
      if ("number" != typeof e) return a(e, t, r);
      if ("string" == typeof t) throw new TypeError("The \"string\" argument must be of type string. Received type number");
      return u(e);
    }

    function a(e, t, r) {
      if ("string" == typeof e) return function(e, t) {
        "string" == typeof t && "" !== t || (t = "utf8");
        if (!h.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
        var r = 0 | f(e, t), i = n(r), t = i.write(e, t);
        t !== r && (i = i.slice(0, t));
        return i;
      }(e, t);
      if (ArrayBuffer.isView(e)) return c(e);
      if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
      if (I(e, ArrayBuffer) || e && I(e.buffer, ArrayBuffer)) return function(e, t, r) {
        if (t < 0 || e.byteLength < t) throw new RangeError("\"offset\" is outside of buffer bounds");
        if (e.byteLength < t + (r || 0)) throw new RangeError("\"length\" is outside of buffer bounds");
        r = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
        return r.__proto__ = h.prototype, r;
      }(e, t, r);
      if ("number" == typeof e) throw new TypeError("The \"value\" argument must not be of type number. Received type number");
      var i = e.valueOf && e.valueOf();
      if (null != i && i !== e) return h.from(i, t, r);
      i = function(e) {
        if (h.isBuffer(e)) {
          var t = 0 | d(e.length), r = n(t);
          return 0 === r.length ? r : (e.copy(r, 0, 0, t), r);
        }
        if (void 0 !== e.length) return "number" != typeof e.length || R(e.length) ? n(0) : c(e);
        if ("Buffer" === e.type && Array.isArray(e.data)) return c(e.data);
      }(e);
      if (i) return i;
      if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return h.from(e[Symbol.toPrimitive]("string"), t, r);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
    }

    function l(e) {
      if ("number" != typeof e) throw new TypeError("\"size\" argument must be of type number");
      if (e < 0) throw new RangeError("The value \"" + e + "\" is invalid for option \"size\"");
    }

    function u(e) {
      return l(e), n(e < 0 ? 0 : 0 | d(e));
    }

    function c(e) {
      for (var t = e.length < 0 ? 0 : 0 | d(e.length), r = n(t), i = 0; i < t; i += 1) r[i] = 255 & e[i];
      return r;
    }

    function d(e) {
      if (i <= e) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
      return 0 | e;
    }

    function f(e, t) {
      if (h.isBuffer(e)) return e.length;
      if (ArrayBuffer.isView(e) || I(e, ArrayBuffer)) return e.byteLength;
      if ("string" != typeof e) throw new TypeError("The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type " + typeof e);
      var r = e.length, i = 2 < arguments.length && !0 === arguments[2];
      if (!i && 0 === r) return 0;
      for (var n = !1; ;) switch (t) {
        case"ascii":
        case"latin1":
        case"binary":
          return r;
        case"utf8":
        case"utf-8":
          return P(e).length;
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return 2 * r;
        case"hex":
          return r >>> 1;
        case"base64":
          return C(e).length;
        default:
          if (n) return i ? -1 : P(e).length;
          t = ("" + t).toLowerCase(), n = !0;
      }
    }

    function p(e, t, r) {
      var i, n, o, a = !1;
      if ((t = void 0 === t || t < 0 ? 0 : t) > this.length) return "";
      if ((r = void 0 === r || r > this.length ? this.length : r) <= 0) return "";
      if ((r >>>= 0) <= (t >>>= 0)) return "";
      for (e = e || "utf8"; ;) switch (e) {
        case"hex":
          return function(e, t, r) {
            var i = e.length;
            (!t || t < 0) && (t = 0);
            (!r || r < 0 || i < r) && (r = i);
            for (var n = "", o = t; o < r; ++o) n += function(e) {
              return e < 16 ? "0" + e.toString(16) : e.toString(16);
            }(e[o]);
            return n;
          }(this, t, r);
        case"utf8":
        case"utf-8":
          return v(this, t, r);
        case"ascii":
          return function(e, t, r) {
            var i = "";
            r = Math.min(e.length, r);
            for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]);
            return i;
          }(this, t, r);
        case"latin1":
        case"binary":
          return function(e, t, r) {
            var i = "";
            r = Math.min(e.length, r);
            for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]);
            return i;
          }(this, t, r);
        case"base64":
          return i = this, o = r, 0 === (n = t) && o === i.length ? s.fromByteArray(i) : s.fromByteArray(i.slice(n, o));
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return function(e, t, r) {
            for (var i = e.slice(t, r), n = "", o = 0; o < i.length; o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);
            return n;
          }(this, t, r);
        default:
          if (a) throw new TypeError("Unknown encoding: " + e);
          e = (e + "").toLowerCase(), a = !0;
      }
    }

    function y(e, t, r) {
      var i = e[t];
      e[t] = e[r], e[r] = i;
    }

    function g(e, t, r, i, n) {
      if (0 === e.length) return -1;
      if ("string" == typeof r ? (i = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), (r = (r = R(r = +r) ? n ? 0 : e.length - 1 : r) < 0 ? e.length + r : r) >= e.length) {
        if (n) return -1;
        r = e.length - 1;
      } else if (r < 0) {
        if (!n) return -1;
        r = 0;
      }
      if ("string" == typeof t && (t = h.from(t, i)), h.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, r, i, n);
      if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? (n ? Uint8Array.prototype.indexOf : Uint8Array.prototype.lastIndexOf).call(e, t, r) : m(e, [t], r, i, n);
      throw new TypeError("val must be string, number or Buffer");
    }

    function m(e, t, r, i, n) {
      var o = 1, a = e.length, s = t.length;
      if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
        if (e.length < 2 || t.length < 2) return -1;
        a /= o = 2, s /= 2, r /= 2;
      }

      function l(e, t) {
        return 1 === o ? e[t] : e.readUInt16BE(t * o);
      }

      if (n) for (var u = -1, c = r; c < a; c++) if (l(e, c) === l(t, -1 === u ? 0 : c - u)) {
        if (c - (u = -1 === u ? c : u) + 1 === s) return u * o;
      } else -1 !== u && (c -= c - u), u = -1; else for (c = r = a < r + s ? a - s : r; 0 <= c; c--) {
        for (var h = !0, d = 0; d < s; d++) if (l(e, c + d) !== l(t, d)) {
          h = !1;
          break;
        }
        if (h) return c;
      }
      return -1;
    }

    function b(e, t, r, i) {
      return A(function(e) {
        for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
        return t;
      }(t), e, r, i);
    }

    function _(e, t, r, i) {
      return A(function(e, t) {
        for (var r, i, n = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) i = e.charCodeAt(o), r = i >> 8, i = i % 256, n.push(i), n.push(r);
        return n;
      }(t, e.length - r), e, r, i);
    }

    function v(e, t, r) {
      r = Math.min(e.length, r);
      for (var i = [], n = t; n < r;) {
        var o, a, s, l, u = e[n], c = null, h = 239 < u ? 4 : 223 < u ? 3 : 191 < u ? 2 : 1;
        if (n + h <= r) switch (h) {
          case 1:
            u < 128 && (c = u);
            break;
          case 2:
            128 == (192 & (o = e[n + 1])) && 127 < (l = (31 & u) << 6 | 63 & o) && (c = l);
            break;
          case 3:
            o = e[n + 1], a = e[n + 2], 128 == (192 & o) && 128 == (192 & a) && 2047 < (l = (15 & u) << 12 | (63 & o) << 6 | 63 & a) && (l < 55296 || 57343 < l) && (c = l);
            break;
          case 4:
            o = e[n + 1], a = e[n + 2], s = e[n + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && 65535 < (l = (15 & u) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) && l < 1114112 && (c = l);
        }
        null === c ? (c = 65533, h = 1) : 65535 < c && (c -= 65536, i.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), i.push(c), n += h;
      }
      return function(e) {
        var t = e.length;
        if (t <= w) return String.fromCharCode.apply(String, e);
        var r = "", i = 0;
        for (; i < t;) r += String.fromCharCode.apply(String, e.slice(i, i += w));
        return r;
      }(i);
    }

    r.kMaxLength = i, (h.TYPED_ARRAY_SUPPORT = function() {
      try {
        var e = new Uint8Array(1);
        return e.__proto__ = {
          __proto__: Uint8Array.prototype, foo: function() {
            return 42;
          }
        }, 42 === e.foo();
      } catch (e) {
        return !1;
      }
    }()) || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(h.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (h.isBuffer(this)) return this.buffer;
      }
    }), Object.defineProperty(h.prototype, "offset", {
      enumerable: !0, get: function() {
        if (h.isBuffer(this)) return this.byteOffset;
      }
    }), "undefined" != typeof Symbol && null != Symbol.species && h[Symbol.species] === h && Object.defineProperty(h, Symbol.species, {
      value: null,
      configurable: !0,
      enumerable: !1,
      writable: !1
    }), h.poolSize = 8192, h.from = a, h.prototype.__proto__ = Uint8Array.prototype, h.__proto__ = Uint8Array, h.alloc = function(e, t, r) {
      return t = t, r = r, l(e = e), !(e <= 0) && void 0 !== t ? "string" == typeof r ? n(e).fill(t, r) : n(e).fill(t) : n(e);
    }, h.allocUnsafe = u, h.allocUnsafeSlow = u, h.isBuffer = function(e) {
      return null != e && !0 === e._isBuffer && e !== h.prototype;
    }, h.compare = function(e, t) {
      if (I(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), I(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(e) || !h.isBuffer(t)) throw new TypeError("The \"buf1\", \"buf2\" arguments must be one of type Buffer or Uint8Array");
      if (e === t) return 0;
      for (var r = e.length, i = t.length, n = 0, o = Math.min(r, i); n < o; ++n) if (e[n] !== t[n]) {
        r = e[n], i = t[n];
        break;
      }
      return r < i ? -1 : i < r ? 1 : 0;
    }, h.isEncoding = function(e) {
      switch (String(e).toLowerCase()) {
        case"hex":
        case"utf8":
        case"utf-8":
        case"ascii":
        case"latin1":
        case"binary":
        case"base64":
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return !0;
        default:
          return !1;
      }
    }, h.concat = function(e, t) {
      if (!Array.isArray(e)) throw new TypeError("\"list\" argument must be an Array of Buffers");
      if (0 === e.length) return h.alloc(0);
      if (void 0 === t) for (n = t = 0; n < e.length; ++n) t += e[n].length;
      for (var r = h.allocUnsafe(t), i = 0, n = 0; n < e.length; ++n) {
        var o = e[n];
        if (I(o, Uint8Array) && (o = h.from(o)), !h.isBuffer(o)) throw new TypeError("\"list\" argument must be an Array of Buffers");
        o.copy(r, i), i += o.length;
      }
      return r;
    }, h.byteLength = f, h.prototype._isBuffer = !0, h.prototype.swap16 = function() {
      var e = this.length;
      if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var t = 0; t < e; t += 2) y(this, t, t + 1);
      return this;
    }, h.prototype.swap32 = function() {
      var e = this.length;
      if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var t = 0; t < e; t += 4) y(this, t, t + 3), y(this, t + 1, t + 2);
      return this;
    }, h.prototype.swap64 = function() {
      var e = this.length;
      if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var t = 0; t < e; t += 8) y(this, t, t + 7), y(this, t + 1, t + 6), y(this, t + 2, t + 5), y(this, t + 3, t + 4);
      return this;
    }, h.prototype.toLocaleString = h.prototype.toString = function() {
      var e = this.length;
      return 0 === e ? "" : 0 === arguments.length ? v(this, 0, e) : p.apply(this, arguments);
    }, h.prototype.equals = function(e) {
      if (!h.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
      return this === e || 0 === h.compare(this, e);
    }, h.prototype.inspect = function() {
      var e = "", t = r.INSPECT_MAX_BYTES, e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
      return this.length > t && (e += " ... "), "<Buffer " + e + ">";
    }, h.prototype.compare = function(e, t, r, i, n) {
      if (I(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e)) throw new TypeError("The \"target\" argument must be one of type Buffer or Uint8Array. Received type " + typeof e);
      if (void 0 === r && (r = e ? e.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), (t = void 0 === t ? 0 : t) < 0 || r > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
      if (n <= i && r <= t) return 0;
      if (n <= i) return -1;
      if (r <= t) return 1;
      if (this === e) return 0;
      for (var o = (n >>>= 0) - (i >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = Math.min(o, a), l = this.slice(i, n), u = e.slice(t, r), c = 0; c < s; ++c) if (l[c] !== u[c]) {
        o = l[c], a = u[c];
        break;
      }
      return o < a ? -1 : a < o ? 1 : 0;
    }, h.prototype.includes = function(e, t, r) {
      return -1 !== this.indexOf(e, t, r);
    }, h.prototype.indexOf = function(e, t, r) {
      return g(this, e, t, r, !0);
    }, h.prototype.lastIndexOf = function(e, t, r) {
      return g(this, e, t, r, !1);
    }, h.prototype.write = function(e, t, r, i) {
      if (void 0 === t) i = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0; else {
        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0);
      }
      var n = this.length - t;
      if ((void 0 === r || n < r) && (r = n), 0 < e.length && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      i = i || "utf8";
      for (var o, a, s, l = !1; ;) switch (i) {
        case"hex":
          return function(e, t, r, i) {
            r = Number(r) || 0;
            var n = e.length - r;
            (!i || n < (i = Number(i))) && (i = n), (n = t.length) / 2 < i && (i = n / 2);
            for (var o = 0; o < i; ++o) {
              var a = parseInt(t.substr(2 * o, 2), 16);
              if (R(a)) return o;
              e[r + o] = a;
            }
            return o;
          }(this, e, t, r);
        case"utf8":
        case"utf-8":
          return a = t, s = r, A(P(e, (o = this).length - a), o, a, s);
        case"ascii":
          return b(this, e, t, r);
        case"latin1":
        case"binary":
          return b(this, e, t, r);
        case"base64":
          return o = this, a = t, s = r, A(C(e), o, a, s);
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return _(this, e, t, r);
        default:
          if (l) throw new TypeError("Unknown encoding: " + i);
          i = ("" + i).toLowerCase(), l = !0;
      }
    }, h.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    var w = 4096;

    function S(e, t, r) {
      if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
      if (r < e + t) throw new RangeError("Trying to access beyond buffer length");
    }

    function E(e, t, r, i, n, o) {
      if (!h.isBuffer(e)) throw new TypeError("\"buffer\" argument must be a Buffer instance");
      if (n < t || t < o) throw new RangeError("\"value\" argument is out of bounds");
      if (r + i > e.length) throw new RangeError("Index out of range");
    }

    function T(e, t, r, i) {
      if (r + i > e.length) throw new RangeError("Index out of range");
      if (r < 0) throw new RangeError("Index out of range");
    }

    function x(e, t, r, i, n) {
      return t = +t, r >>>= 0, n || T(e, 0, r, 4), o.write(e, t, r, i, 23, 4), r + 4;
    }

    function M(e, t, r, i, n) {
      return t = +t, r >>>= 0, n || T(e, 0, r, 8), o.write(e, t, r, i, 52, 8), r + 8;
    }

    h.prototype.slice = function(e, t) {
      var r = this.length;
      (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r);
      t = this.subarray(e, t = t < e ? e : t);
      return t.__proto__ = h.prototype, t;
    }, h.prototype.readUIntLE = function(e, t, r) {
      e >>>= 0, t >>>= 0, r || S(e, t, this.length);
      for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
      return i;
    }, h.prototype.readUIntBE = function(e, t, r) {
      e >>>= 0, t >>>= 0, r || S(e, t, this.length);
      for (var i = this[e + --t], n = 1; 0 < t && (n *= 256);) i += this[e + --t] * n;
      return i;
    }, h.prototype.readUInt8 = function(e, t) {
      return e >>>= 0, t || S(e, 1, this.length), this[e];
    }, h.prototype.readUInt16LE = function(e, t) {
      return e >>>= 0, t || S(e, 2, this.length), this[e] | this[e + 1] << 8;
    }, h.prototype.readUInt16BE = function(e, t) {
      return e >>>= 0, t || S(e, 2, this.length), this[e] << 8 | this[e + 1];
    }, h.prototype.readUInt32LE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
    }, h.prototype.readUInt32BE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
    }, h.prototype.readIntLE = function(e, t, r) {
      e >>>= 0, t >>>= 0, r || S(e, t, this.length);
      for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
      return (n *= 128) <= i && (i -= Math.pow(2, 8 * t)), i;
    }, h.prototype.readIntBE = function(e, t, r) {
      e >>>= 0, t >>>= 0, r || S(e, t, this.length);
      for (var i = t, n = 1, o = this[e + --i]; 0 < i && (n *= 256);) o += this[e + --i] * n;
      return (n *= 128) <= o && (o -= Math.pow(2, 8 * t)), o;
    }, h.prototype.readInt8 = function(e, t) {
      return e >>>= 0, t || S(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
    }, h.prototype.readInt16LE = function(e, t) {
      e >>>= 0, t || S(e, 2, this.length);
      e = this[e] | this[e + 1] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, h.prototype.readInt16BE = function(e, t) {
      e >>>= 0, t || S(e, 2, this.length);
      e = this[e + 1] | this[e] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, h.prototype.readInt32LE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
    }, h.prototype.readInt32BE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
    }, h.prototype.readFloatLE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), o.read(this, e, !0, 23, 4);
    }, h.prototype.readFloatBE = function(e, t) {
      return e >>>= 0, t || S(e, 4, this.length), o.read(this, e, !1, 23, 4);
    }, h.prototype.readDoubleLE = function(e, t) {
      return e >>>= 0, t || S(e, 8, this.length), o.read(this, e, !0, 52, 8);
    }, h.prototype.readDoubleBE = function(e, t) {
      return e >>>= 0, t || S(e, 8, this.length), o.read(this, e, !1, 52, 8);
    }, h.prototype.writeUIntLE = function(e, t, r, i) {
      e = +e, t >>>= 0, r >>>= 0, i || E(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
      var n = 1, o = 0;
      for (this[t] = 255 & e; ++o < r && (n *= 256);) this[t + o] = e / n & 255;
      return t + r;
    }, h.prototype.writeUIntBE = function(e, t, r, i) {
      e = +e, t >>>= 0, r >>>= 0, i || E(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
      var n = r - 1, o = 1;
      for (this[t + n] = 255 & e; 0 <= --n && (o *= 256);) this[t + n] = e / o & 255;
      return t + r;
    }, h.prototype.writeUInt8 = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
    }, h.prototype.writeUInt16LE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
    }, h.prototype.writeUInt16BE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
    }, h.prototype.writeUInt32LE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
    }, h.prototype.writeUInt32BE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
    }, h.prototype.writeIntLE = function(e, t, r, i) {
      e = +e, t >>>= 0, i || E(this, e, t, r, (i = Math.pow(2, 8 * r - 1)) - 1, -i);
      var n = 0, o = 1, a = 0;
      for (this[t] = 255 & e; ++n < r && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + n - 1] && (a = 1), this[t + n] = (e / o >> 0) - a & 255;
      return t + r;
    }, h.prototype.writeIntBE = function(e, t, r, i) {
      e = +e, t >>>= 0, i || E(this, e, t, r, (i = Math.pow(2, 8 * r - 1)) - 1, -i);
      var n = r - 1, o = 1, a = 0;
      for (this[t + n] = 255 & e; 0 <= --n && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + n + 1] && (a = 1), this[t + n] = (e / o >> 0) - a & 255;
      return t + r;
    }, h.prototype.writeInt8 = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 1, 127, -128), this[t] = 255 & (e = e < 0 ? 255 + e + 1 : e), t + 1;
    }, h.prototype.writeInt16LE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
    }, h.prototype.writeInt16BE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
    }, h.prototype.writeInt32LE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
    }, h.prototype.writeInt32BE = function(e, t, r) {
      return e = +e, t >>>= 0, r || E(this, e, t, 4, 2147483647, -2147483648), this[t] = (e = e < 0 ? 4294967295 + e + 1 : e) >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
    }, h.prototype.writeFloatLE = function(e, t, r) {
      return x(this, e, t, !0, r);
    }, h.prototype.writeFloatBE = function(e, t, r) {
      return x(this, e, t, !1, r);
    }, h.prototype.writeDoubleLE = function(e, t, r) {
      return M(this, e, t, !0, r);
    }, h.prototype.writeDoubleBE = function(e, t, r) {
      return M(this, e, t, !1, r);
    }, h.prototype.copy = function(e, t, r, i) {
      if (!h.isBuffer(e)) throw new TypeError("argument should be a Buffer");
      if (r = r || 0, i || 0 === i || (i = this.length), t >= e.length && (t = e.length), (i = 0 < i && i < r ? r : i) === r) return 0;
      if (0 === e.length || 0 === this.length) return 0;
      if ((t = t || 0) < 0) throw new RangeError("targetStart out of bounds");
      if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
      if (i < 0) throw new RangeError("sourceEnd out of bounds");
      i > this.length && (i = this.length);
      var n = (i = e.length - t < i - r ? e.length - t + r : i) - r;
      if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, i); else if (this === e && r < t && t < i) for (var o = n - 1; 0 <= o; --o) e[o + t] = this[o + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, i), t);
      return n;
    }, h.prototype.fill = function(e, t, r, i) {
      if ("string" == typeof e) {
        if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
        if ("string" == typeof i && !h.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
        var n;
        1 === e.length && (n = e.charCodeAt(0), ("utf8" === i && n < 128 || "latin1" === i) && (e = n));
      } else "number" == typeof e && (e &= 255);
      if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
      if (r <= t) return this;
      var o;
      if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, "number" == typeof (e = e || 0)) for (o = t; o < r; ++o) this[o] = e; else {
        var a = h.isBuffer(e) ? e : h.from(e, i), s = a.length;
        if (0 === s) throw new TypeError("The value \"" + e + "\" is invalid for argument \"value\"");
        for (o = 0; o < r - t; ++o) this[o + t] = a[o % s];
      }
      return this;
    };
    var k = /[^+/0-9A-Za-z-_]/g;

    function P(e, t) {
      var r;
      t = t || 1 / 0;
      for (var i = e.length, n = null, o = [], a = 0; a < i; ++a) {
        if (55295 < (r = e.charCodeAt(a)) && r < 57344) {
          if (!n) {
            if (56319 < r) {
              -1 < (t -= 3) && o.push(239, 191, 189);
              continue;
            }
            if (a + 1 === i) {
              -1 < (t -= 3) && o.push(239, 191, 189);
              continue;
            }
            n = r;
            continue;
          }
          if (r < 56320) {
            -1 < (t -= 3) && o.push(239, 191, 189), n = r;
            continue;
          }
          r = 65536 + (n - 55296 << 10 | r - 56320);
        } else n && -1 < (t -= 3) && o.push(239, 191, 189);
        if (n = null, r < 128) {
          if (--t < 0) break;
          o.push(r);
        } else if (r < 2048) {
          if ((t -= 2) < 0) break;
          o.push(r >> 6 | 192, 63 & r | 128);
        } else if (r < 65536) {
          if ((t -= 3) < 0) break;
          o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
        } else {
          if (!(r < 1114112)) throw new Error("Invalid code point");
          if ((t -= 4) < 0) break;
          o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
        }
      }
      return o;
    }

    function C(e) {
      return s.toByteArray(function(e) {
        if ((e = (e = e.split("=")[0]).trim().replace(k, "")).length < 2) return "";
        for (; e.length % 4 != 0;) e += "=";
        return e;
      }(e));
    }

    function A(e, t, r, i) {
      for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
      return n;
    }

    function I(e, t) {
      return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
    }

    function R(e) {
      return e != e;
    }
  }, { "base64-js": 16, ieee754: 141 }],
  65: [function(e, t, r) {
    var i = e("safe-buffer").Buffer, n = e("stream").Transform, o = e("string_decoder").StringDecoder;

    function a(e) {
      n.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this["final"] = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
    }

    e("inherits")(a, n), a.prototype.update = function(e, t, r) {
      "string" == typeof e && (e = i.from(e, t));
      e = this._update(e);
      return this.hashMode ? this : r ? this._toString(e, r) : e;
    }, a.prototype.setAutoPadding = function() {
    }, a.prototype.getAuthTag = function() {
      throw new Error("trying to get auth tag in unsupported state");
    }, a.prototype.setAuthTag = function() {
      throw new Error("trying to set auth tag in unsupported state");
    }, a.prototype.setAAD = function() {
      throw new Error("trying to set aad in unsupported state");
    }, a.prototype._transform = function(e, t, r) {
      var i;
      try {
        this.hashMode ? this._update(e) : this.push(this._update(e));
      } catch (e) {
        i = e;
      } finally {
        r(i);
      }
    }, a.prototype._flush = function(e) {
      var t;
      try {
        this.push(this.__final());
      } catch (e) {
        t = e;
      }
      e(t);
    }, a.prototype._finalOrDigest = function(e) {
      var t = this.__final() || i.alloc(0);
      return t = e ? this._toString(t, e, !0) : t;
    }, a.prototype._toString = function(e, t, r) {
      if (this._decoder || (this._decoder = new o(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings");
      e = this._decoder.write(e);
      return r && (e += this._decoder.end()), e;
    }, t.exports = a;
  }, { inherits: 142, "safe-buffer": 187, stream: 197, string_decoder: 198 }],
  66: [function(e, t, r) {
    !function(e) {
      !function() {
        function t(e) {
          return Object.prototype.toString.call(e);
        }

        r.isArray = function(e) {
          return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e);
        }, r.isBoolean = function(e) {
          return "boolean" == typeof e;
        }, r.isNull = function(e) {
          return null === e;
        }, r.isNullOrUndefined = function(e) {
          return null == e;
        }, r.isNumber = function(e) {
          return "number" == typeof e;
        }, r.isString = function(e) {
          return "string" == typeof e;
        }, r.isSymbol = function(e) {
          return "symbol" == typeof e;
        }, r.isUndefined = function(e) {
          return void 0 === e;
        }, r.isRegExp = function(e) {
          return "[object RegExp]" === t(e);
        }, r.isObject = function(e) {
          return "object" == typeof e && null !== e;
        }, r.isDate = function(e) {
          return "[object Date]" === t(e);
        }, r.isError = function(e) {
          return "[object Error]" === t(e) || e instanceof Error;
        }, r.isFunction = function(e) {
          return "function" == typeof e;
        }, r.isPrimitive = function(e) {
          return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e;
        }, r.isBuffer = e.isBuffer;
      }.call(this);
    }.call(this, { isBuffer: e("../../is-buffer/index.js") });
  }, { "../../is-buffer/index.js": 143 }],
  67: [function(e, s, t) {
    !function(a) {
      !function() {
        var t = e("elliptic"), r = e("bn.js");
        s.exports = function(e) {
          return new n(e);
        };
        var i = {
          secp256k1: { name: "secp256k1", byteLength: 32 },
          secp224r1: { name: "p224", byteLength: 28 },
          prime256v1: { name: "p256", byteLength: 32 },
          prime192v1: { name: "p192", byteLength: 24 },
          ed25519: { name: "ed25519", byteLength: 32 },
          secp384r1: { name: "p384", byteLength: 48 },
          secp521r1: { name: "p521", byteLength: 66 }
        };

        function n(e) {
          this.curveType = i[e], this.curveType || (this.curveType = { name: e }), this.curve = new t.ec(this.curveType.name), this.keys = void 0;
        }

        function o(e, t, r) {
          Array.isArray(e) || (e = e.toArray());
          e = new a(e);
          return r && e.length < r && ((r = new a(r - e.length)).fill(0), e = a.concat([r, e])), t ? e.toString(t) : e;
        }

        i.p224 = i.secp224r1, i.p256 = i.secp256r1 = i.prime256v1, i.p192 = i.secp192r1 = i.prime192v1, i.p384 = i.secp384r1, i.p521 = i.secp521r1, n.prototype.generateKeys = function(e, t) {
          return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t);
        }, n.prototype.computeSecret = function(e, t, r) {
          return t = t || "utf8", a.isBuffer(e) || (e = new a(e, t)), o(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), r, this.curveType.byteLength);
        }, n.prototype.getPublicKey = function(e, t) {
          var r = this.keys.getPublic("compressed" === t, !0);
          return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), o(r, e);
        }, n.prototype.getPrivateKey = function(e) {
          return o(this.keys.getPrivate(), e);
        }, n.prototype.setPublicKey = function(e, t) {
          return t = t || "utf8", a.isBuffer(e) || (e = new a(e, t)), this.keys._importPublic(e), this;
        }, n.prototype.setPrivateKey = function(e, t) {
          t = t || "utf8", a.isBuffer(e) || (e = new a(e, t));
          e = (e = new r(e)).toString(16);
          return this.keys = this.curve.genKeyPair(), this.keys._importPrivate(e), this;
        };
      }.call(this);
    }.call(this, e("buffer").Buffer);
  }, { "bn.js": 68, buffer: 64, elliptic: 91 }],
  68: [function(e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, { buffer: 19, dup: 15 }],
  69: [function(e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("md5.js"), o = e("ripemd160"), a = e("sha.js"), s = e("cipher-base");

    function l(e) {
      s.call(this, "digest"), this._hash = e;
    }

    i(l, s), l.prototype._update = function(e) {
      this._hash.update(e);
    }, l.prototype._final = function() {
      return this._hash.digest();
    }, t.exports = function(e) {
      return "md5" === (e = e.toLowerCase()) ? new n : "rmd160" === e || "ripemd160" === e ? new o : new l(a(e));
    };
  }, { "cipher-base": 65, inherits: 142, "md5.js": 145, ripemd160: 186, "sha.js": 190 }],
  70: [function(e, t, r) {
    var i = e("md5.js");
    t.exports = function(e) {
      return (new i).update(e).digest();
    };
  }, { "md5.js": 145 }],
  71: [function(e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("./legacy"), a = e("cipher-base"), s = e("safe-buffer").Buffer,
      o = e("create-hash/md5"), l = e("ripemd160"), u = e("sha.js"), c = s.alloc(128);

    function h(e, t) {
      a.call(this, "digest"), "string" == typeof t && (t = s.from(t));
      var r = "sha512" === e || "sha384" === e ? 128 : 64;
      this._alg = e, (this._key = t).length > r ? t = ("rmd160" === e ? new l : u(e)).update(t).digest() : t.length < r && (t = s.concat([t, c], r));
      for (var i = this._ipad = s.allocUnsafe(r), n = this._opad = s.allocUnsafe(r), o = 0; o < r; o++) i[o] = 54 ^ t[o], n[o] = 92 ^ t[o];
      this._hash = "rmd160" === e ? new l : u(e), this._hash.update(i);
    }

    i(h, a), h.prototype._update = function(e) {
      this._hash.update(e);
    }, h.prototype._final = function() {
      var e = this._hash.digest();
      return ("rmd160" === this._alg ? new l : u(this._alg)).update(this._opad).update(e).digest();
    }, t.exports = function(e, t) {
      return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new h("rmd160", t) : "md5" === e ? new n(o, t) : new h(e, t);
    };
  }, {
    "./legacy": 72,
    "cipher-base": 65,
    "create-hash/md5": 70,
    inherits: 142,
    ripemd160: 186,
    "safe-buffer": 187,
    "sha.js": 190
  }],
  72: [function(e, t, r) {
    "use strict";
    var i = e("inherits"), o = e("safe-buffer").Buffer, a = e("cipher-base"), s = o.alloc(128);

    function n(e, t) {
      a.call(this, "digest"), "string" == typeof t && (t = o.from(t)), this._alg = e, 64 < (this._key = t).length ? t = e(t) : t.length < 64 && (t = o.concat([t, s], 64));
      for (var r = this._ipad = o.allocUnsafe(64), i = this._opad = o.allocUnsafe(64), n = 0; n < 64; n++) r[n] = 54 ^ t[n], i[n] = 92 ^ t[n];
      this._hash = [r];
    }

    i(n, a), n.prototype._update = function(e) {
      this._hash.push(e);
    }, n.prototype._final = function() {
      var e = this._alg(o.concat(this._hash));
      return this._alg(o.concat([this._opad, e]));
    }, t.exports = n;
  }, { "cipher-base": 65, inherits: 142, "safe-buffer": 187 }],
  73: [function(e, t, r) {
    "use strict";
    r.randomBytes = r.rng = r.pseudoRandomBytes = r.prng = e("randombytes"), r.createHash = r.Hash = e("create-hash"), r.createHmac = r.Hmac = e("create-hmac");
    var i = e("browserify-sign/algos"), i = Object.keys(i),
      n = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(i);
    r.getHashes = function() {
      return n;
    };
    i = e("pbkdf2");
    r.pbkdf2 = i.pbkdf2, r.pbkdf2Sync = i.pbkdf2Sync;
    i = e("browserify-cipher");
    r.Cipher = i.Cipher, r.createCipher = i.createCipher, r.Cipheriv = i.Cipheriv, r.createCipheriv = i.createCipheriv, r.Decipher = i.Decipher, r.createDecipher = i.createDecipher, r.Decipheriv = i.Decipheriv, r.createDecipheriv = i.createDecipheriv, r.getCiphers = i.getCiphers, r.listCiphers = i.listCiphers;
    i = e("diffie-hellman");
    r.DiffieHellmanGroup = i.DiffieHellmanGroup, r.createDiffieHellmanGroup = i.createDiffieHellmanGroup, r.getDiffieHellman = i.getDiffieHellman, r.createDiffieHellman = i.createDiffieHellman, r.DiffieHellman = i.DiffieHellman;
    i = e("browserify-sign");
    r.createSign = i.createSign, r.Sign = i.Sign, r.createVerify = i.createVerify, r.Verify = i.Verify, r.createECDH = e("create-ecdh");
    i = e("public-encrypt");
    r.publicEncrypt = i.publicEncrypt, r.privateEncrypt = i.privateEncrypt, r.publicDecrypt = i.publicDecrypt, r.privateDecrypt = i.privateDecrypt;
    e = e("randomfill");
    r.randomFill = e.randomFill, r.randomFillSync = e.randomFillSync, r.createCredentials = function() {
      throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n"));
    }, r.constants = {
      DH_CHECK_P_NOT_SAFE_PRIME: 2,
      DH_CHECK_P_NOT_PRIME: 1,
      DH_UNABLE_TO_CHECK_GENERATOR: 4,
      DH_NOT_SUITABLE_GENERATOR: 8,
      NPN_ENABLED: 1,
      ALPN_ENABLED: 1,
      RSA_PKCS1_PADDING: 1,
      RSA_SSLV23_PADDING: 2,
      RSA_NO_PADDING: 3,
      RSA_PKCS1_OAEP_PADDING: 4,
      RSA_X931_PADDING: 5,
      RSA_PKCS1_PSS_PADDING: 6,
      POINT_CONVERSION_COMPRESSED: 2,
      POINT_CONVERSION_UNCOMPRESSED: 4,
      POINT_CONVERSION_HYBRID: 6
    };
  }, {
    "browserify-cipher": 37,
    "browserify-sign": 44,
    "browserify-sign/algos": 41,
    "create-ecdh": 67,
    "create-hash": 69,
    "create-hmac": 71,
    "diffie-hellman": 86,
    pbkdf2: 155,
    "public-encrypt": 163,
    randombytes: 170,
    randomfill: 171
  }],
  74: [function(y, r, i) {
    !function(p) {
      !function() {
        var e, t;
        e = this, t = function() {
          return function(u) {
            var i;
            if (!(i = !(i = !(i = "undefined" != typeof window && window.crypto ? window.crypto : i) && "undefined" != typeof window && window.msCrypto ? window.msCrypto : i) && void 0 !== p && p.crypto ? p.crypto : i) && "function" == typeof y) try {
              i = y("crypto");
            } catch (e) {
            }
            var r = Object.create || function(e) {
              return t.prototype = e, e = new t, t.prototype = null, e;
            };

            function t() {
            }

            var e = {}, n = e.lib = {}, o = n.Base = {
              extend: function(e) {
                var t = r(this);
                return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function() {
                  t.$super.init.apply(this, arguments);
                }), (t.init.prototype = t).$super = this, t;
              }, create: function() {
                var e = this.extend();
                return e.init.apply(e, arguments), e;
              }, init: function() {
              }, mixIn: function(e) {
                for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                e.hasOwnProperty("toString") && (this.toString = e.toString);
              }, clone: function() {
                return this.init.prototype.extend(this);
              }
            }, c = n.WordArray = o.extend({
              init: function(e, t) {
                e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length;
              }, toString: function(e) {
                return (e || s).stringify(this);
              }, concat: function(e) {
                var t = this.words, r = e.words, i = this.sigBytes, n = e.sigBytes;
                if (this.clamp(), i % 4) for (var o = 0; o < n; o++) {
                  var a = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                  t[i + o >>> 2] |= a << 24 - (i + o) % 4 * 8;
                } else for (o = 0; o < n; o += 4) t[i + o >>> 2] = r[o >>> 2];
                return this.sigBytes += n, this;
              }, clamp: function() {
                var e = this.words, t = this.sigBytes;
                e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8, e.length = u.ceil(t / 4);
              }, clone: function() {
                var e = o.clone.call(this);
                return e.words = this.words.slice(0), e;
              }, random: function(e) {
                for (var t = [], r = 0; r < e; r += 4) t.push(function() {
                  if (i) {
                    if ("function" == typeof i.getRandomValues) try {
                      return i.getRandomValues(new Uint32Array(1))[0];
                    } catch (e) {
                    }
                    if ("function" == typeof i.randomBytes) try {
                      return i.randomBytes(4).readInt32LE();
                    } catch (e) {
                    }
                  }
                  throw new Error("Native crypto module could not be used to get secure random number.");
                }());
                return new c.init(t, e);
              }
            }), a = e.enc = {}, s = a.Hex = {
              stringify: function(e) {
                for (var t = e.words, r = e.sigBytes, i = [], n = 0; n < r; n++) {
                  var o = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                  i.push((o >>> 4).toString(16)), i.push((15 & o).toString(16));
                }
                return i.join("");
              }, parse: function(e) {
                for (var t = e.length, r = [], i = 0; i < t; i += 2) r[i >>> 3] |= parseInt(e.substr(i, 2), 16) << 24 - i % 8 * 4;
                return new c.init(r, t / 2);
              }
            }, l = a.Latin1 = {
              stringify: function(e) {
                for (var t = e.words, r = e.sigBytes, i = [], n = 0; n < r; n++) {
                  var o = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                  i.push(String.fromCharCode(o));
                }
                return i.join("");
              }, parse: function(e) {
                for (var t = e.length, r = [], i = 0; i < t; i++) r[i >>> 2] |= (255 & e.charCodeAt(i)) << 24 - i % 4 * 8;
                return new c.init(r, t);
              }
            }, h = a.Utf8 = {
              stringify: function(e) {
                try {
                  return decodeURIComponent(escape(l.stringify(e)));
                } catch (e) {
                  throw new Error("Malformed UTF-8 data");
                }
              }, parse: function(e) {
                return l.parse(unescape(encodeURIComponent(e)));
              }
            }, d = n.BufferedBlockAlgorithm = o.extend({
              reset: function() {
                this._data = new c.init, this._nDataBytes = 0;
              }, _append: function(e) {
                "string" == typeof e && (e = h.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
              }, _process: function(e) {
                var t, r = this._data, i = r.words, n = r.sigBytes, o = this.blockSize, a = n / (4 * o),
                  s = (a = e ? u.ceil(a) : u.max((0 | a) - this._minBufferSize, 0)) * o, n = u.min(4 * s, n);
                if (s) {
                  for (var l = 0; l < s; l += o) this._doProcessBlock(i, l);
                  t = i.splice(0, s), r.sigBytes -= n;
                }
                return new c.init(t, n);
              }, clone: function() {
                var e = o.clone.call(this);
                return e._data = this._data.clone(), e;
              }, _minBufferSize: 0
            }), f = (n.Hasher = d.extend({
              cfg: o.extend(), init: function(e) {
                this.cfg = this.cfg.extend(e), this.reset();
              }, reset: function() {
                d.reset.call(this), this._doReset();
              }, update: function(e) {
                return this._append(e), this._process(), this;
              }, finalize: function(e) {
                return e && this._append(e), this._doFinalize();
              }, blockSize: 16, _createHelper: function(r) {
                return function(e, t) {
                  return new r.init(t).finalize(e);
                };
              }, _createHmacHelper: function(r) {
                return function(e, t) {
                  return new f.HMAC.init(r, t).finalize(e);
                };
              }
            }), e.algo = {});
            return e;
          }(Math);
        }, "object" == typeof i ? r.exports = i = t() : "function" == typeof define && define.amd ? define([], t) : e.CryptoJS = t();
      }.call(this);
    }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { crypto: 73 }],
  75: [function(e, t, r) {
    var i, n;
    i = this, n = function(e) {
      var l;
      return l = e.lib.WordArray, e.enc.Base64 = {
        stringify: function(e) {
          var t = e.words, r = e.sigBytes, i = this._map;
          e.clamp();
          for (var n = [], o = 0; o < r; o += 3) for (var a = (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (t[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | t[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, s = 0; s < 4 && o + .75 * s < r; s++) n.push(i.charAt(a >>> 6 * (3 - s) & 63));
          var l = i.charAt(64);
          if (l) for (; n.length % 4;) n.push(l);
          return n.join("");
        }, parse: function(e) {
          var t = e.length, r = this._map;
          if (!(i = this._reverseMap)) for (var i = this._reverseMap = [], n = 0; n < r.length; n++) i[r.charCodeAt(n)] = n;
          var o = r.charAt(64);
          return !o || -1 !== (o = e.indexOf(o)) && (t = o), function(e, t, r) {
            for (var i = [], n = 0, o = 0; o < t; o++) {
              var a, s;
              o % 4 && (a = r[e.charCodeAt(o - 1)] << o % 4 * 2, s = r[e.charCodeAt(o)] >>> 6 - o % 4 * 2, s = a | s, i[n >>> 2] |= s << 24 - n % 4 * 8, n++);
            }
            return l.create(i, n);
          }(e, t, i);
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      }, e.enc.Base64;
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS);
  }, { "crypto-js/core": 74 }],
  76: [function(e, t, r) {
    var i, n;
    i = this, n = function(e) {
      return e.enc.Utf8;
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS);
  }, { "crypto-js/core": 74 }],
  77: [function(e, t, r) {
    var i, n;
    i = this, n = function(e) {
      return e.HmacSHA1;
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core"), e("crypto-js/sha1"), e("crypto-js/hmac")) : "function" == typeof define && define.amd ? define(["crypto-js/core", "crypto-js/sha1", "crypto-js/hmac"], n) : n(i.CryptoJS);
  }, { "crypto-js/core": 74, "crypto-js/hmac": 78, "crypto-js/sha1": 79 }],
  78: [function(e, t, r) {
    var i, n;
    i = this, n = function(e) {
      var t, s;
      t = e.lib.Base, s = e.enc.Utf8, e.algo.HMAC = t.extend({
        init: function(e, t) {
          e = this._hasher = new e.init, "string" == typeof t && (t = s.parse(t));
          var r = e.blockSize, i = 4 * r;
          (t = t.sigBytes > i ? e.finalize(t) : t).clamp();
          for (var e = this._oKey = t.clone(), t = this._iKey = t.clone(), n = e.words, o = t.words, a = 0; a < r; a++) n[a] ^= 1549556828, o[a] ^= 909522486;
          e.sigBytes = t.sigBytes = i, this.reset();
        }, reset: function() {
          var e = this._hasher;
          e.reset(), e.update(this._iKey);
        }, update: function(e) {
          return this._hasher.update(e), this;
        }, finalize: function(e) {
          var t = this._hasher, e = t.finalize(e);
          return t.reset(), t.finalize(this._oKey.clone().concat(e));
        }
      });
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS);
  }, { "crypto-js/core": 74 }],
  79: [function(e, t, r) {
    var i, n;
    i = this, n = function(e) {
      var t, r, i, n, c;
      return r = (t = e).lib, i = r.WordArray, n = r.Hasher, r = t.algo, c = [], r = r.SHA1 = n.extend({
        _doReset: function() {
          this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
        }, _doProcessBlock: function(e, t) {
          for (var r = this._hash.words, i = r[0], n = r[1], o = r[2], a = r[3], s = r[4], l = 0; l < 80; l++) {
            l < 16 ? c[l] = 0 | e[t + l] : (u = c[l - 3] ^ c[l - 8] ^ c[l - 14] ^ c[l - 16], c[l] = u << 1 | u >>> 31);
            var u = (i << 5 | i >>> 27) + s + c[l];
            u += l < 20 ? 1518500249 + (n & o | ~n & a) : l < 40 ? 1859775393 + (n ^ o ^ a) : l < 60 ? (n & o | n & a | o & a) - 1894007588 : (n ^ o ^ a) - 899497514, s = a, a = o, o = n << 30 | n >>> 2, n = i, i = u;
          }
          r[0] = r[0] + i | 0, r[1] = r[1] + n | 0, r[2] = r[2] + o | 0, r[3] = r[3] + a | 0, r[4] = r[4] + s | 0;
        }, _doFinalize: function() {
          var e = this._data, t = e.words, r = 8 * this._nDataBytes, i = 8 * e.sigBytes;
          return t[i >>> 5] |= 128 << 24 - i % 32, t[14 + (64 + i >>> 9 << 4)] = Math.floor(r / 4294967296), t[15 + (64 + i >>> 9 << 4)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash;
        }, clone: function() {
          var e = n.clone.call(this);
          return e._hash = this._hash.clone(), e;
        }
      }), t.SHA1 = n._createHelper(r), t.HmacSHA1 = n._createHmacHelper(r), e.SHA1;
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS);
  }, { "crypto-js/core": 74 }],
  80: [function(e, t, r) {
    "use strict";
    r.utils = e("./des/utils"), r.Cipher = e("./des/cipher"), r.DES = e("./des/des"), r.CBC = e("./des/cbc"), r.EDE = e("./des/ede");
  }, { "./des/cbc": 81, "./des/cipher": 82, "./des/des": 83, "./des/ede": 84, "./des/utils": 85 }],
  81: [function(e, t, r) {
    "use strict";
    var i = e("minimalistic-assert"), o = e("inherits"), a = {};

    function n(e) {
      i.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8);
      for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t];
    }

    r.instantiate = function(t) {
      function r(e) {
        t.call(this, e), this._cbcInit();
      }

      o(r, t);
      for (var e = Object.keys(a), i = 0; i < e.length; i++) {
        var n = e[i];
        r.prototype[n] = a[n];
      }
      return r.create = function(e) {
        return new r(e);
      }, r;
    }, a._cbcInit = function() {
      var e = new n(this.options.iv);
      this._cbcState = e;
    }, a._update = function(e, t, r, i) {
      var n = this._cbcState, o = this.constructor.super_.prototype, a = n.iv;
      if ("encrypt" === this.type) {
        for (var s = 0; s < this.blockSize; s++) a[s] ^= e[t + s];
        o._update.call(this, a, 0, r, i);
        for (s = 0; s < this.blockSize; s++) a[s] = r[i + s];
      } else {
        o._update.call(this, e, t, r, i);
        for (s = 0; s < this.blockSize; s++) r[i + s] ^= a[s];
        for (s = 0; s < this.blockSize; s++) a[s] = e[t + s];
      }
    };
  }, { inherits: 142, "minimalistic-assert": 148 }],
  82: [function(e, t, r) {
    "use strict";
    var i = e("minimalistic-assert");

    function n(e) {
      this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0;
    }

    (t.exports = n).prototype._init = function() {
    }, n.prototype.update = function(e) {
      return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
    }, n.prototype._buffer = function(e, t) {
      for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), i = 0; i < r; i++) this.buffer[this.bufferOff + i] = e[t + i];
      return this.bufferOff += r, r;
    }, n.prototype._flushBuffer = function(e, t) {
      return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize;
    }, n.prototype._updateEncrypt = function(e) {
      var t = 0, r = 0, i = (this.bufferOff + e.length) / this.blockSize | 0, n = new Array(i * this.blockSize);
      0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r)));
      for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) this._update(e, t, n, r), r += this.blockSize;
      for (; t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
      return n;
    }, n.prototype._updateDecrypt = function(e) {
      for (var t = 0, r = 0, i = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); 0 < i; i--) t += this._buffer(e, t), r += this._flushBuffer(n, r);
      return t += this._buffer(e, t), n;
    }, n.prototype["final"] = function(e) {
      var t;
      return e && (t = this.update(e)), e = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(e) : e;
    }, n.prototype._pad = function(e, t) {
      if (0 === t) return !1;
      for (; t < e.length;) e[t++] = 0;
      return !0;
    }, n.prototype._finalEncrypt = function() {
      if (!this._pad(this.buffer, this.bufferOff)) return [];
      var e = new Array(this.blockSize);
      return this._update(this.buffer, 0, e, 0), e;
    }, n.prototype._unpad = function(e) {
      return e;
    }, n.prototype._finalDecrypt = function() {
      i.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
      var e = new Array(this.blockSize);
      return this._flushBuffer(e, 0), this._unpad(e);
    };
  }, { "minimalistic-assert": 148 }],
  83: [function(e, t, r) {
    "use strict";
    var a = e("minimalistic-assert"), i = e("inherits"), c = e("./utils"), n = e("./cipher");

    function o() {
      this.tmp = new Array(2), this.keys = null;
    }

    function s(e) {
      n.call(this, e);
      var t = new o;
      this._desState = t, this.deriveKeys(t, e.key);
    }

    i(s, n), (t.exports = s).create = function(e) {
      return new s(e);
    };
    var l = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    s.prototype.deriveKeys = function(e, t) {
      e.keys = new Array(32), a.equal(t.length, this.blockSize, "Invalid key length");
      var r = c.readUInt32BE(t, 0), i = c.readUInt32BE(t, 4);
      c.pc1(r, i, e.tmp, 0), r = e.tmp[0], i = e.tmp[1];
      for (var n = 0; n < e.keys.length; n += 2) {
        var o = l[n >>> 1], r = c.r28shl(r, o), i = c.r28shl(i, o);
        c.pc2(r, i, e.keys, n);
      }
    }, s.prototype._update = function(e, t, r, i) {
      var n = this._desState, o = c.readUInt32BE(e, t), t = c.readUInt32BE(e, t + 4);
      c.ip(o, t, n.tmp, 0), o = n.tmp[0], t = n.tmp[1], "encrypt" === this.type ? this._encrypt(n, o, t, n.tmp, 0) : this._decrypt(n, o, t, n.tmp, 0), o = n.tmp[0], t = n.tmp[1], c.writeUInt32BE(r, o, i), c.writeUInt32BE(r, t, i + 4);
    }, s.prototype._pad = function(e, t) {
      for (var r = e.length - t, i = t; i < e.length; i++) e[i] = r;
      return !0;
    }, s.prototype._unpad = function(e) {
      for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) a.equal(e[r], t);
      return e.slice(0, e.length - t);
    }, s.prototype._encrypt = function(e, t, r, i, n) {
      for (var o = t, a = r, s = 0; s < e.keys.length; s += 2) {
        var l = e.keys[s], u = e.keys[s + 1];
        c.expand(a, e.tmp, 0), l ^= e.tmp[0], u ^= e.tmp[1];
        l = c.substitute(l, u), u = a, a = (o ^ c.permute(l)) >>> 0, o = u;
      }
      c.rip(a, o, i, n);
    }, s.prototype._decrypt = function(e, t, r, i, n) {
      for (var o = r, a = t, s = e.keys.length - 2; 0 <= s; s -= 2) {
        var l = e.keys[s], u = e.keys[s + 1];
        c.expand(o, e.tmp, 0), l ^= e.tmp[0], u ^= e.tmp[1];
        l = c.substitute(l, u), u = o, o = (a ^ c.permute(l)) >>> 0, a = u;
      }
      c.rip(o, a, i, n);
    };
  }, { "./cipher": 82, "./utils": 85, inherits: 142, "minimalistic-assert": 148 }],
  84: [function(e, t, r) {
    "use strict";
    var n = e("minimalistic-assert"), i = e("inherits"), o = e("./cipher"), a = e("./des");

    function s(e, t) {
      n.equal(t.length, 24, "Invalid key length");
      var r = t.slice(0, 8), i = t.slice(8, 16), t = t.slice(16, 24);
      this.ciphers = "encrypt" === e ? [a.create({ type: "encrypt", key: r }), a.create({
        type: "decrypt",
        key: i
      }), a.create({ type: "encrypt", key: t })] : [a.create({ type: "decrypt", key: t }), a.create({
        type: "encrypt",
        key: i
      }), a.create({ type: "decrypt", key: r })];
    }

    function l(e) {
      o.call(this, e);
      e = new s(this.type, this.options.key);
      this._edeState = e;
    }

    i(l, o), (t.exports = l).create = function(e) {
      return new l(e);
    }, l.prototype._update = function(e, t, r, i) {
      var n = this._edeState;
      n.ciphers[0]._update(e, t, r, i), n.ciphers[1]._update(r, i, r, i), n.ciphers[2]._update(r, i, r, i);
    }, l.prototype._pad = a.prototype._pad, l.prototype._unpad = a.prototype._unpad;
  }, { "./cipher": 82, "./des": 83, inherits: 142, "minimalistic-assert": 148 }],
  85: [function(e, t, r) {
    "use strict";
    r.readUInt32BE = function(e, t) {
      return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
    }, r.writeUInt32BE = function(e, t, r) {
      e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t;
    }, r.ip = function(e, t, r, i) {
      for (var n = 0, o = 0, a = 6; 0 <= a; a -= 2) {
        for (var s = 0; s <= 24; s += 8) n <<= 1, n |= t >>> s + a & 1;
        for (s = 0; s <= 24; s += 8) n <<= 1, n |= e >>> s + a & 1;
      }
      for (a = 6; 0 <= a; a -= 2) {
        for (s = 1; s <= 25; s += 8) o <<= 1, o |= t >>> s + a & 1;
        for (s = 1; s <= 25; s += 8) o <<= 1, o |= e >>> s + a & 1;
      }
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0;
    }, r.rip = function(e, t, r, i) {
      for (var n = 0, o = 0, a = 0; a < 4; a++) for (var s = 24; 0 <= s; s -= 8) n <<= 1, n |= t >>> s + a & 1, n <<= 1, n |= e >>> s + a & 1;
      for (a = 4; a < 8; a++) for (s = 24; 0 <= s; s -= 8) o <<= 1, o |= t >>> s + a & 1, o <<= 1, o |= e >>> s + a & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0;
    }, r.pc1 = function(e, t, r, i) {
      for (var n = 0, o = 0, a = 7; 5 <= a; a--) {
        for (var s = 0; s <= 24; s += 8) n <<= 1, n |= t >> s + a & 1;
        for (s = 0; s <= 24; s += 8) n <<= 1, n |= e >> s + a & 1;
      }
      for (s = 0; s <= 24; s += 8) n <<= 1, n |= t >> s + a & 1;
      for (a = 1; a <= 3; a++) {
        for (s = 0; s <= 24; s += 8) o <<= 1, o |= t >> s + a & 1;
        for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1;
      }
      for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0;
    }, r.r28shl = function(e, t) {
      return e << t & 268435455 | e >>> 28 - t;
    };
    var l = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
    r.pc2 = function(e, t, r, i) {
      for (var n = 0, o = 0, a = l.length >>> 1, s = 0; s < a; s++) n <<= 1, n |= e >>> l[s] & 1;
      for (s = a; s < l.length; s++) o <<= 1, o |= t >>> l[s] & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0;
    }, r.expand = function(e, t, r) {
      for (var i = 0, n = 0, i = (1 & e) << 5 | e >>> 27, o = 23; 15 <= o; o -= 4) i <<= 6, i |= e >>> o & 63;
      for (o = 11; 3 <= o; o -= 4) n |= e >>> o & 63, n <<= 6;
      n |= (31 & e) << 1 | e >>> 31, t[r + 0] = i >>> 0, t[r + 1] = n >>> 0;
    };
    var n = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
    r.substitute = function(e, t) {
      for (var r = 0, i = 0; i < 4; i++) r <<= 4, r |= n[64 * i + (e >>> 18 - 6 * i & 63)];
      for (i = 0; i < 4; i++) r <<= 4, r |= n[256 + 64 * i + (t >>> 18 - 6 * i & 63)];
      return r >>> 0;
    };
    var i = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
    r.permute = function(e) {
      for (var t = 0, r = 0; r < i.length; r++) t <<= 1, t |= e >>> i[r] & 1;
      return t >>> 0;
    }, r.padSplit = function(e, t, r) {
      for (var i = e.toString(2); i.length < t;) i = "0" + i;
      for (var n = [], o = 0; o < t; o += r) n.push(i.slice(o, o + r));
      return n.join(" ");
    };
  }, {}],
  86: [function(e, t, i) {
    !function(l) {
      !function() {
        var o = e("./lib/generatePrime"), r = e("./lib/primes.json"), a = e("./lib/dh");
        var s = { binary: !0, hex: !0, base64: !0 };
        i.DiffieHellmanGroup = i.createDiffieHellmanGroup = i.getDiffieHellman = function(e) {
          var t = new l(r[e].prime, "hex"), e = new l(r[e].gen, "hex");
          return new a(t, e);
        }, i.createDiffieHellman = i.DiffieHellman = function e(t, r, i, n) {
          return l.isBuffer(r) || void 0 === s[r] ? e(t, "binary", r, i) : (r = r || "binary", n = n || "binary", i = i || new l([2]), l.isBuffer(i) || (i = new l(i, n)), "number" == typeof t ? new a(o(t, i), i, !0) : (l.isBuffer(t) || (t = new l(t, r)), new a(t, i, !0)));
        };
      }.call(this);
    }.call(this, e("buffer").Buffer);
  }, { "./lib/dh": 87, "./lib/generatePrime": 88, "./lib/primes.json": 89, buffer: 64 }],
  87: [function(y, g, e) {
    !function(p) {
      !function() {
        var i = y("bn.js"), o = new (y("miller-rabin")), a = new i(24), s = new i(11), l = new i(10), u = new i(3),
          c = new i(7), h = y("./generatePrime"), e = y("randombytes");

        function n(e, t) {
          return t = t || "utf8", p.isBuffer(e) || (e = new p(e, t)), this._pub = new i(e), this;
        }

        function d(e, t) {
          return t = t || "utf8", p.isBuffer(e) || (e = new p(e, t)), this._priv = new i(e), this;
        }

        g.exports = t;
        var f = {};

        function t(e, t, r) {
          this.setGenerator(t), this.__prime = new i(e), this._prime = i.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = n, this.setPrivateKey = d) : this._primeCode = 8;
        }

        function r(e, t) {
          e = new p(e.toArray());
          return t ? e.toString(t) : e;
        }

        Object.defineProperty(t.prototype, "verifyError", {
          enumerable: !0, get: function() {
            return "number" != typeof this._primeCode && (this._primeCode = function(e, t) {
              var r = t.toString("hex");
              if ((t = [r, e.toString(16)].join("_")) in f) return f[t];
              var i, n = 0;
              if (e.isEven() || !h.simpleSieve || !h.fermatTest(e) || !o.test(e)) return n += 1, f[t] = n += "02" === r || "05" === r ? 8 : 4;
              switch (o.test(e.shrn(1)) || (n += 2), r) {
                case"02":
                  e.mod(a).cmp(s) && (n += 8);
                  break;
                case"05":
                  (i = e.mod(l)).cmp(u) && i.cmp(c) && (n += 8);
                  break;
                default:
                  n += 4;
              }
              return f[t] = n;
            }(this.__prime, this.__gen)), this._primeCode;
          }
        }), t.prototype.generateKeys = function() {
          return this._priv || (this._priv = new i(e(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
        }, t.prototype.computeSecret = function(e) {
          var t = (e = (e = new i(e)).toRed(this._prime)).redPow(this._priv).fromRed(), e = new p(t.toArray()),
            t = this.getPrime();
          return e.length < t.length && ((t = new p(t.length - e.length)).fill(0), e = p.concat([t, e])), e;
        }, t.prototype.getPublicKey = function(e) {
          return r(this._pub, e);
        }, t.prototype.getPrivateKey = function(e) {
          return r(this._priv, e);
        }, t.prototype.getPrime = function(e) {
          return r(this.__prime, e);
        }, t.prototype.getGenerator = function(e) {
          return r(this._gen, e);
        }, t.prototype.setGenerator = function(e, t) {
          return t = t || "utf8", p.isBuffer(e) || (e = new p(e, t)), this.__gen = e, this._gen = new i(e), this;
        };
      }.call(this);
    }.call(this, y("buffer").Buffer);
  }, { "./generatePrime": 88, "bn.js": 90, buffer: 64, "miller-rabin": 146, randombytes: 170 }],
  88: [function(e, t, r) {
    var n = e("randombytes");
    (t.exports = i).simpleSieve = g, i.fermatTest = m;
    var o = e("bn.js"), a = new o(24), s = new (e("miller-rabin")), l = new o(1), u = new o(2), c = new o(5),
      h = (new o(16), new o(8), new o(10)), d = new o(3), f = (new o(7), new o(11)), p = new o(4),
      y = (new o(12), null);

    function g(e) {
      for (var t = function() {
        if (null !== y) return y;
        var e = [];
        e[0] = 2;
        for (var t = 1, r = 3; r < 1048576; r += 2) {
          for (var i = Math.ceil(Math.sqrt(r)), n = 0; n < t && e[n] <= i && r % e[n] != 0; n++) ;
          t !== n && e[n] <= i || (e[t++] = r);
        }
        return y = e;
      }(), r = 0; r < t.length; r++) if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
      return !0;
    }

    function m(e) {
      var t = o.mont(e);
      return 0 === u.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
    }

    function i(e, t) {
      if (e < 16) return new o(2 === t || 5 === t ? [140, 123] : [140, 39]);
      var r, i;
      for (t = new o(t); ;) {
        for (r = new o(n(Math.ceil(e / 8))); r.bitLength() > e;) r.ishrn(1);
        if (r.isEven() && r.iadd(l), r.testn(1) || r.iadd(u), t.cmp(u)) {
          if (!t.cmp(c)) for (; r.mod(h).cmp(d);) r.iadd(p);
        } else for (; r.mod(a).cmp(f);) r.iadd(p);
        if (g(i = r.shrn(1)) && g(r) && m(i) && m(r) && s.test(i) && s.test(r)) return r;
      }
    }
  }, { "bn.js": 90, "miller-rabin": 146, randombytes: 170 }],
  89: [function(e, t, r) {
    t.exports = {
      modp1: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
      },
      modp2: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
      },
      modp5: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
      },
      modp14: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
      },
      modp15: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
      },
      modp16: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
      },
      modp17: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
      },
      modp18: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
      }
    };
  }, {}],
  90: [function(e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, { buffer: 19, dup: 15 }],
  91: [function(e, t, r) {
    "use strict";
    r.version = e("../package.json").version, r.utils = e("./elliptic/utils"), r.rand = e("brorand"), r.curve = e("./elliptic/curve"), r.curves = e("./elliptic/curves"), r.ec = e("./elliptic/ec"), r.eddsa = e("./elliptic/eddsa");
  }, {
    "../package.json": 107,
    "./elliptic/curve": 94,
    "./elliptic/curves": 97,
    "./elliptic/ec": 98,
    "./elliptic/eddsa": 101,
    "./elliptic/utils": 105,
    brorand: 18
  }],
  92: [function(e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils"), x = n.getNAF, M = n.getJSF, h = n.assert;

    function o(e, t) {
      this.type = e, this.p = new i(t.p, 16), this.red = t.prime ? i.red(t.prime) : i.mont(this.p), this.zero = new i(0).toRed(this.red), this.one = new i(1).toRed(this.red), this.two = new i(2).toRed(this.red), this.n = t.n && new i(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
      t = this.n && this.p.div(this.n);
      !t || 0 < t.cmpn(100) ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
    }

    function a(e, t) {
      this.curve = e, this.type = t, this.precomputed = null;
    }

    (t.exports = o).prototype.point = function() {
      throw new Error("Not implemented");
    }, o.prototype.validate = function() {
      throw new Error("Not implemented");
    }, o.prototype._fixedNafMul = function(e, t) {
      h(e.precomputed);
      var r = e._getDoubles(), i = x(t, 1, this._bitLength), t = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
      t /= 3;
      for (var n = [], o = 0; o < i.length; o += r.step) {
        for (var a = 0, s = o + r.step - 1; o <= s; s--) a = (a << 1) + i[s];
        n.push(a);
      }
      for (var l = this.jpoint(null, null, null), u = this.jpoint(null, null, null), c = t; 0 < c; c--) {
        for (o = 0; o < n.length; o++) (a = n[o]) === c ? u = u.mixedAdd(r.points[o]) : a === -c && (u = u.mixedAdd(r.points[o].neg()));
        l = l.add(u);
      }
      return l.toP();
    }, o.prototype._wnafMul = function(e, t) {
      for (var r = e._getNAFPoints(4), i = r.wnd, n = r.points, o = x(t, i, this._bitLength), a = this.jpoint(null, null, null), s = o.length - 1; 0 <= s; s--) {
        for (var l = 0; 0 <= s && 0 === o[s]; s--) l++;
        if (0 <= s && l++, a = a.dblp(l), s < 0) break;
        var u = o[s];
        h(0 !== u), a = "affine" === e.type ? 0 < u ? a.mixedAdd(n[u - 1 >> 1]) : a.mixedAdd(n[-u - 1 >> 1].neg()) : 0 < u ? a.add(n[u - 1 >> 1]) : a.add(n[-u - 1 >> 1].neg());
      }
      return "affine" === e.type ? a.toP() : a;
    }, o.prototype._wnafMulAdd = function(e, t, r, i, n) {
      for (var o = this._wnafT1, a = this._wnafT2, s = this._wnafT3, l = 0, u = 0; u < i; u++) {
        var c, h = (c = t[u])._getNAFPoints(e);
        o[u] = h.wnd, a[u] = h.points;
      }
      for (u = i - 1; 1 <= u; u -= 2) {
        var d = u - 1, f = u;
        if (1 === o[d] && 1 === o[f]) {
          var p = [t[d], null, null, t[f]];
          0 === t[d].y.cmp(t[f].y) ? (p[1] = t[d].add(t[f]), p[2] = t[d].toJ().mixedAdd(t[f].neg())) : 0 === t[d].y.cmp(t[f].y.redNeg()) ? (p[1] = t[d].toJ().mixedAdd(t[f]), p[2] = t[d].add(t[f].neg())) : (p[1] = t[d].toJ().mixedAdd(t[f]), p[2] = t[d].toJ().mixedAdd(t[f].neg()));
          var y = [-3, -1, -5, -7, 0, 7, 5, 1, 3], g = M(r[d], r[f]), l = Math.max(g[0].length, l);
          for (s[d] = new Array(l), s[f] = new Array(l), E = 0; E < l; E++) {
            var m = 0 | g[0][E], b = 0 | g[1][E];
            s[d][E] = y[3 * (1 + m) + (1 + b)], s[f][E] = 0, a[d] = p;
          }
        } else s[d] = x(r[d], o[d], this._bitLength), s[f] = x(r[f], o[f], this._bitLength), l = Math.max(s[d].length, l), l = Math.max(s[f].length, l);
      }
      var _ = this.jpoint(null, null, null), v = this._wnafT4;
      for (u = l; 0 <= u; u--) {
        for (var w = 0; 0 <= u;) {
          for (var S = !0, E = 0; E < i; E++) v[E] = 0 | s[E][u], 0 !== v[E] && (S = !1);
          if (!S) break;
          w++, u--;
        }
        if (0 <= u && w++, _ = _.dblp(w), u < 0) break;
        for (E = 0; E < i; E++) {
          var T = v[E];
          0 !== T && (0 < T ? c = a[E][T - 1 >> 1] : T < 0 && (c = a[E][-T - 1 >> 1].neg()), _ = "affine" === c.type ? _.mixedAdd(c) : _.add(c));
        }
      }
      for (u = 0; u < i; u++) a[u] = null;
      return n ? _ : _.toP();
    }, (o.BasePoint = a).prototype.eq = function() {
      throw new Error("Not implemented");
    }, a.prototype.validate = function() {
      return this.curve.validate(this);
    }, o.prototype.decodePoint = function(e, t) {
      e = n.toArray(e, t);
      t = this.p.byteLength();
      if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * t) return 6 === e[0] ? h(e[e.length - 1] % 2 == 0) : 7 === e[0] && h(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + t), e.slice(1 + t, 1 + 2 * t));
      if ((2 === e[0] || 3 === e[0]) && e.length - 1 === t) return this.pointFromX(e.slice(1, 1 + t), 3 === e[0]);
      throw new Error("Unknown point format");
    }, a.prototype.encodeCompressed = function(e) {
      return this.encode(e, !0);
    }, a.prototype._encode = function(e) {
      var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t);
      return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t));
    }, a.prototype.encode = function(e, t) {
      return n.encode(this._encode(t), e);
    }, a.prototype.precompute = function(e) {
      if (this.precomputed) return this;
      var t = { doubles: null, naf: null, beta: null };
      return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this;
    }, a.prototype._hasDoubles = function(e) {
      if (!this.precomputed) return !1;
      var t = this.precomputed.doubles;
      return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
    }, a.prototype._getDoubles = function(e, t) {
      if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
      for (var r = [this], i = this, n = 0; n < t; n += e) {
        for (var o = 0; o < e; o++) i = i.dbl();
        r.push(i);
      }
      return { step: e, points: r };
    }, a.prototype._getNAFPoints = function(e) {
      if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
      for (var t = [this], r = (1 << e) - 1, i = 1 == r ? null : this.dbl(), n = 1; n < r; n++) t[n] = t[n - 1].add(i);
      return { wnd: e, points: t };
    }, a.prototype._getBeta = function() {
      return null;
    }, a.prototype.dblp = function(e) {
      for (var t = this, r = 0; r < e; r++) t = t.dbl();
      return t;
    };
  }, { "../utils": 105, "bn.js": 106 }],
  93: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), o = e("bn.js"), n = e("inherits"), a = e("./base"), s = i.assert;

    function l(e) {
      this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, a.call(this, "edwards", e), this.a = new o(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new o(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new o(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), s(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c);
    }

    function u(e, t, r, i, n) {
      a.BasePoint.call(this, e, "projective"), null === t && null === r && null === i ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new o(t, 16), this.y = new o(r, 16), this.z = i ? new o(i, 16) : this.curve.one, this.t = n && new o(n, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
    }

    n(l, a), (t.exports = l).prototype._mulA = function(e) {
      return this.mOneA ? e.redNeg() : this.a.redMul(e);
    }, l.prototype._mulC = function(e) {
      return this.oneC ? e : this.c.redMul(e);
    }, l.prototype.jpoint = function(e, t, r, i) {
      return this.point(e, t, r, i);
    }, l.prototype.pointFromX = function(e, t) {
      var r = (e = !(e = new o(e, 16)).red ? e.toRed(this.red) : e).redSqr(), i = this.c2.redSub(this.a.redMul(r)),
        r = this.one.redSub(this.c2.redMul(this.d).redMul(r)), i = i.redMul(r.redInvm()), r = i.redSqrt();
      if (0 !== r.redSqr().redSub(i).cmp(this.zero)) throw new Error("invalid point");
      i = r.fromRed().isOdd();
      return (t && !i || !t && i) && (r = r.redNeg()), this.point(e, r);
    }, l.prototype.pointFromY = function(e, t) {
      var r = (e = !(e = new o(e, 16)).red ? e.toRed(this.red) : e).redSqr(), i = r.redSub(this.c2),
        r = r.redMul(this.d).redMul(this.c2).redSub(this.a), i = i.redMul(r.redInvm());
      if (0 === i.cmp(this.zero)) {
        if (t) throw new Error("invalid point");
        return this.point(this.zero, e);
      }
      r = i.redSqrt();
      if (0 !== r.redSqr().redSub(i).cmp(this.zero)) throw new Error("invalid point");
      return r.fromRed().isOdd() !== t && (r = r.redNeg()), this.point(r, e);
    }, l.prototype.validate = function(e) {
      if (e.isInfinity()) return !0;
      e.normalize();
      var t = e.x.redSqr(), r = e.y.redSqr(), e = t.redMul(this.a).redAdd(r),
        r = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
      return 0 === e.cmp(r);
    }, n(u, a.BasePoint), l.prototype.pointFromJSON = function(e) {
      return u.fromJSON(this, e);
    }, l.prototype.point = function(e, t, r, i) {
      return new u(this, e, t, r, i);
    }, u.fromJSON = function(e, t) {
      return new u(e, t[0], t[1], t[2]);
    }, u.prototype.inspect = function() {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, u.prototype.isInfinity = function() {
      return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
    }, u.prototype._extDbl = function() {
      var e = this.x.redSqr(), t = this.y.redSqr(), r = (r = this.z.redSqr()).redIAdd(r), i = this.curve._mulA(e),
        n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), o = i.redAdd(t), e = o.redSub(r), r = i.redSub(t),
        i = n.redMul(e), t = o.redMul(r), r = n.redMul(r), o = e.redMul(o);
      return this.curve.point(i, t, o, r);
    }, u.prototype._projDbl = function() {
      var e, t, r, i, n, o, a = this.x.redAdd(this.y).redSqr(), s = this.x.redSqr(), l = this.y.redSqr();
      return o = this.curve.twisted ? (n = (i = this.curve._mulA(s)).redAdd(l), this.zOne ? (e = a.redSub(s).redSub(l).redMul(n.redSub(this.curve.two)), t = n.redMul(i.redSub(l)), n.redSqr().redSub(n).redSub(n)) : (r = this.z.redSqr(), o = n.redSub(r).redISub(r), e = a.redSub(s).redISub(l).redMul(o), t = n.redMul(i.redSub(l)), n.redMul(o))) : (i = s.redAdd(l), r = this.curve._mulC(this.z).redSqr(), o = i.redSub(r).redSub(r), e = this.curve._mulC(a.redISub(i)).redMul(o), t = this.curve._mulC(i).redMul(s.redISub(l)), i.redMul(o)), this.curve.point(e, t, o);
    }, u.prototype.dbl = function() {
      return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
    }, u.prototype._extAdd = function(e) {
      var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
        i = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), o = r.redSub(t),
        e = n.redSub(i), n = n.redAdd(i), i = r.redAdd(t), r = o.redMul(e), t = n.redMul(i), i = o.redMul(i),
        n = e.redMul(n);
      return this.curve.point(r, t, n, i);
    }, u.prototype._projAdd = function(e) {
      var t, r = this.z.redMul(e.z), i = r.redSqr(), n = this.x.redMul(e.x), o = this.y.redMul(e.y),
        a = this.curve.d.redMul(n).redMul(o), s = i.redSub(a), a = i.redAdd(a),
        e = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(n).redISub(o), e = r.redMul(s).redMul(e),
        a = this.curve.twisted ? (t = r.redMul(a).redMul(o.redSub(this.curve._mulA(n))), s.redMul(a)) : (t = r.redMul(a).redMul(o.redSub(n)), this.curve._mulC(s).redMul(a));
      return this.curve.point(e, t, a);
    }, u.prototype.add = function(e) {
      return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
    }, u.prototype.mul = function(e) {
      return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
    }, u.prototype.mulAdd = function(e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1);
    }, u.prototype.jmulAdd = function(e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0);
    }, u.prototype.normalize = function() {
      if (this.zOne) return this;
      var e = this.z.redInvm();
      return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this;
    }, u.prototype.neg = function() {
      return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
    }, u.prototype.getX = function() {
      return this.normalize(), this.x.fromRed();
    }, u.prototype.getY = function() {
      return this.normalize(), this.y.fromRed();
    }, u.prototype.eq = function(e) {
      return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
    }, u.prototype.eqXToP = function(e) {
      var t = e.toRed(this.curve.red).redMul(this.z);
      if (0 === this.x.cmp(t)) return !0;
      for (var r = e.clone(), i = this.curve.redN.redMul(this.z); ;) {
        if (r.iadd(this.curve.n), 0 <= r.cmp(this.curve.p)) return !1;
        if (t.redIAdd(i), 0 === this.x.cmp(t)) return !0;
      }
    }, u.prototype.toP = u.prototype.normalize, u.prototype.mixedAdd = u.prototype.add;
  }, { "../utils": 105, "./base": 92, "bn.js": 106, inherits: 142 }],
  94: [function(e, t, r) {
    "use strict";
    r.base = e("./base"), r["short"] = e("./short"), r.mont = e("./mont"), r.edwards = e("./edwards");
  }, { "./base": 92, "./edwards": 93, "./mont": 95, "./short": 96 }],
  95: [function(e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("inherits"), o = e("./base"), a = e("../utils");

    function s(e) {
      o.call(this, "mont", e), this.a = new i(e.a, 16).toRed(this.red), this.b = new i(e.b, 16).toRed(this.red), this.i4 = new i(4).toRed(this.red).redInvm(), this.two = new i(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }

    function l(e, t, r) {
      o.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new i(t, 16), this.z = new i(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
    }

    n(s, o), (t.exports = s).prototype.validate = function(e) {
      var t = e.normalize().x, e = t.redSqr(), t = e.redMul(t).redAdd(e.redMul(this.a)).redAdd(t);
      return 0 === t.redSqrt().redSqr().cmp(t);
    }, n(l, o.BasePoint), s.prototype.decodePoint = function(e, t) {
      return this.point(a.toArray(e, t), 1);
    }, s.prototype.point = function(e, t) {
      return new l(this, e, t);
    }, s.prototype.pointFromJSON = function(e) {
      return l.fromJSON(this, e);
    }, l.prototype.precompute = function() {
    }, l.prototype._encode = function() {
      return this.getX().toArray("be", this.curve.p.byteLength());
    }, l.fromJSON = function(e, t) {
      return new l(e, t[0], t[1] || e.one);
    }, l.prototype.inspect = function() {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    }, l.prototype.isInfinity = function() {
      return 0 === this.z.cmpn(0);
    }, l.prototype.dbl = function() {
      var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t), e = e.redMul(t),
        r = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
      return this.curve.point(e, r);
    }, l.prototype.add = function() {
      throw new Error("Not supported on Montgomery curve");
    }, l.prototype.diffAdd = function(e, t) {
      var r = this.x.redAdd(this.z), i = this.x.redSub(this.z), n = e.x.redAdd(e.z), r = e.x.redSub(e.z).redMul(r),
        n = n.redMul(i), i = t.z.redMul(r.redAdd(n).redSqr()), n = t.x.redMul(r.redISub(n).redSqr());
      return this.curve.point(i, n);
    }, l.prototype.mul = function(e) {
      for (var t = e.clone(), r = this, i = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
      for (var o = n.length - 1; 0 <= o; o--) 0 === n[o] ? (r = r.diffAdd(i, this), i = i.dbl()) : (i = r.diffAdd(i, this), r = r.dbl());
      return i;
    }, l.prototype.mulAdd = function() {
      throw new Error("Not supported on Montgomery curve");
    }, l.prototype.jumlAdd = function() {
      throw new Error("Not supported on Montgomery curve");
    }, l.prototype.eq = function(e) {
      return 0 === this.getX().cmp(e.getX());
    }, l.prototype.normalize = function() {
      return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
    }, l.prototype.getX = function() {
      return this.normalize(), this.x.fromRed();
    };
  }, { "../utils": 105, "./base": 92, "bn.js": 106, inherits: 142 }],
  96: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), _ = e("bn.js"), n = e("inherits"), o = e("./base"), a = i.assert;

    function s(e) {
      o.call(this, "short", e), this.a = new _(e.a, 16).toRed(this.red), this.b = new _(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
    }

    function l(e, t, r, i) {
      o.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new _(t, 16), this.y = new _(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
    }

    function u(e, t, r, i) {
      o.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === i ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new _(0)) : (this.x = new _(t, 16), this.y = new _(r, 16), this.z = new _(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
    }

    n(s, o), (t.exports = s).prototype._getEndomorphism = function(e) {
      var t, r, i;
      if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) return r = (e.beta ? new _(e.beta, 16) : r = (i = this._getEndoRoots(this.p))[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red), e.lambda ? t = new _(e.lambda, 16) : (i = this._getEndoRoots(this.n), 0 === this.g.mul(i[0]).x.cmp(this.g.x.redMul(r)) ? t = i[0] : (t = i[1], a(0 === this.g.mul(t).x.cmp(this.g.x.redMul(r))))), {
        beta: r,
        lambda: t,
        basis: e.basis ? e.basis.map(function(e) {
          return { a: new _(e.a, 16), b: new _(e.b, 16) };
        }) : this._getEndoBasis(t)
      };
    }, s.prototype._getEndoRoots = function(e) {
      var t = e === this.p ? this.red : _.mont(e), r = new _(2).toRed(t).redInvm(), e = r.redNeg(),
        r = new _(3).toRed(t).redNeg().redSqrt().redMul(r);
      return [e.redAdd(r).fromRed(), e.redSub(r).fromRed()];
    }, s.prototype._getEndoBasis = function(e) {
      for (var t, r, i, n, o, a = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), s = e, l = this.n.clone(), u = new _(1), c = new _(0), h = new _(0), d = new _(1), f = 0; 0 !== s.cmpn(0);) {
        var p = l.div(s), y = l.sub(p.mul(s)), g = h.sub(p.mul(u)), p = d.sub(p.mul(c));
        if (!i && y.cmp(a) < 0) t = o.neg(), r = u, i = y.neg(), n = g; else if (i && 2 == ++f) break;
        l = s, s = o = y, h = u, u = g, d = c, c = p;
      }
      var m = y.neg(), b = g, e = i.sqr().add(n.sqr());
      return 0 <= m.sqr().add(b.sqr()).cmp(e) && (m = t, b = r), i.negative && (i = i.neg(), n = n.neg()), m.negative && (m = m.neg(), b = b.neg()), [{
        a: i,
        b: n
      }, { a: m, b: b }];
    }, s.prototype._endoSplit = function(e) {
      var t = this.endo.basis, r = t[0], i = t[1], n = i.b.mul(e).divRound(this.n),
        o = r.b.neg().mul(e).divRound(this.n), a = n.mul(r.a), t = o.mul(i.a), r = n.mul(r.b), i = o.mul(i.b);
      return { k1: e.sub(a).sub(t), k2: r.add(i).neg() };
    }, s.prototype.pointFromX = function(e, t) {
      var r = (e = !(e = new _(e, 16)).red ? e.toRed(this.red) : e).redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
        i = r.redSqrt();
      if (0 !== i.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
      r = i.fromRed().isOdd();
      return (t && !r || !t && r) && (i = i.redNeg()), this.point(e, i);
    }, s.prototype.validate = function(e) {
      if (e.inf) return !0;
      var t = e.x, r = e.y, e = this.a.redMul(t), e = t.redSqr().redMul(t).redIAdd(e).redIAdd(this.b);
      return 0 === r.redSqr().redISub(e).cmpn(0);
    }, s.prototype._endoWnafMulAdd = function(e, t, r) {
      for (var i = this._endoWnafT1, n = this._endoWnafT2, o = 0; o < e.length; o++) {
        var a = this._endoSplit(t[o]), s = e[o], l = s._getBeta();
        a.k1.negative && (a.k1.ineg(), s = s.neg(!0)), a.k2.negative && (a.k2.ineg(), l = l.neg(!0)), i[2 * o] = s, i[2 * o + 1] = l, n[2 * o] = a.k1, n[2 * o + 1] = a.k2;
      }
      for (var r = this._wnafMulAdd(1, i, n, 2 * o, r), u = 0; u < 2 * o; u++) i[u] = null, n[u] = null;
      return r;
    }, n(l, o.BasePoint), s.prototype.point = function(e, t, r) {
      return new l(this, e, t, r);
    }, s.prototype.pointFromJSON = function(e, t) {
      return l.fromJSON(this, e, t);
    }, l.prototype._getBeta = function() {
      if (this.curve.endo) {
        var e = this.precomputed;
        if (e && e.beta) return e.beta;
        var t, r, i = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
        return e && (t = this.curve, r = function(e) {
          return t.point(e.x.redMul(t.endo.beta), e.y);
        }, (e.beta = i).precomputed = {
          beta: null,
          naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(r) },
          doubles: e.doubles && { step: e.doubles.step, points: e.doubles.points.map(r) }
        }), i;
      }
    }, l.prototype.toJSON = function() {
      return this.precomputed ? [this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1)
        }, naf: this.precomputed.naf && { wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1) }
      }] : [this.x, this.y];
    }, l.fromJSON = function(t, e, r) {
      "string" == typeof e && (e = JSON.parse(e));
      var i = t.point(e[0], e[1], r);
      if (!e[2]) return i;

      function n(e) {
        return t.point(e[0], e[1], r);
      }

      e = e[2];
      return i.precomputed = {
        beta: null,
        doubles: e.doubles && { step: e.doubles.step, points: [i].concat(e.doubles.points.map(n)) },
        naf: e.naf && { wnd: e.naf.wnd, points: [i].concat(e.naf.points.map(n)) }
      }, i;
    }, l.prototype.inspect = function() {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    }, l.prototype.isInfinity = function() {
      return this.inf;
    }, l.prototype.add = function(e) {
      if (this.inf) return e;
      if (e.inf) return this;
      if (this.eq(e)) return this.dbl();
      if (this.neg().eq(e)) return this.curve.point(null, null);
      if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
      var t = this.y.redSub(e.y),
        e = (t = 0 !== t.cmpn(0) ? t.redMul(this.x.redSub(e.x).redInvm()) : t).redSqr().redISub(this.x).redISub(e.x),
        t = t.redMul(this.x.redSub(e)).redISub(this.y);
      return this.curve.point(e, t);
    }, l.prototype.dbl = function() {
      if (this.inf) return this;
      var e = this.y.redAdd(this.y);
      if (0 === e.cmpn(0)) return this.curve.point(null, null);
      var t = this.curve.a, r = this.x.redSqr(), e = e.redInvm(), t = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(e),
        e = t.redSqr().redISub(this.x.redAdd(this.x)), t = t.redMul(this.x.redSub(e)).redISub(this.y);
      return this.curve.point(e, t);
    }, l.prototype.getX = function() {
      return this.x.fromRed();
    }, l.prototype.getY = function() {
      return this.y.fromRed();
    }, l.prototype.mul = function(e) {
      return e = new _(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e);
    }, l.prototype.mulAdd = function(e, t, r) {
      t = [this, t], r = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(t, r) : this.curve._wnafMulAdd(1, t, r, 2);
    }, l.prototype.jmulAdd = function(e, t, r) {
      t = [this, t], r = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(t, r, !0) : this.curve._wnafMulAdd(1, t, r, 2, !0);
    }, l.prototype.eq = function(e) {
      return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
    }, l.prototype.neg = function(e) {
      if (this.inf) return this;
      var t, r = this.curve.point(this.x, this.y.redNeg());
      return e && this.precomputed && (t = this.precomputed, e = function(e) {
        return e.neg();
      }, r.precomputed = {
        naf: t.naf && { wnd: t.naf.wnd, points: t.naf.points.map(e) },
        doubles: t.doubles && { step: t.doubles.step, points: t.doubles.points.map(e) }
      }), r;
    }, l.prototype.toJ = function() {
      return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
    }, n(u, o.BasePoint), s.prototype.jpoint = function(e, t, r) {
      return new u(this, e, t, r);
    }, u.prototype.toP = function() {
      if (this.isInfinity()) return this.curve.point(null, null);
      var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), e = this.y.redMul(t).redMul(e);
      return this.curve.point(r, e);
    }, u.prototype.neg = function() {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    }, u.prototype.add = function(e) {
      if (this.isInfinity()) return e;
      if (e.isInfinity()) return this;
      var t = e.z.redSqr(), r = this.z.redSqr(), i = this.x.redMul(t), n = e.x.redMul(r),
        o = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(r.redMul(this.z)), t = i.redSub(n), r = o.redSub(a);
      if (0 === t.cmpn(0)) return 0 !== r.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      n = t.redSqr(), a = n.redMul(t), i = i.redMul(n), n = r.redSqr().redIAdd(a).redISub(i).redISub(i), a = r.redMul(i.redISub(n)).redISub(o.redMul(a)), t = this.z.redMul(e.z).redMul(t);
      return this.curve.jpoint(n, a, t);
    }, u.prototype.mixedAdd = function(e) {
      if (this.isInfinity()) return e.toJ();
      if (e.isInfinity()) return this;
      var t = this.z.redSqr(), r = this.x, i = e.x.redMul(t), n = this.y, o = e.y.redMul(t).redMul(this.z),
        e = r.redSub(i), t = n.redSub(o);
      if (0 === e.cmpn(0)) return 0 !== t.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      i = e.redSqr(), o = i.redMul(e), r = r.redMul(i), i = t.redSqr().redIAdd(o).redISub(r).redISub(r), o = t.redMul(r.redISub(i)).redISub(n.redMul(o)), e = this.z.redMul(e);
      return this.curve.jpoint(i, o, e);
    }, u.prototype.dblp = function(e) {
      if (0 === e) return this;
      if (this.isInfinity()) return this;
      if (!e) return this.dbl();
      if (this.curve.zeroA || this.curve.threeA) {
        for (var t = this, r = 0; r < e; r++) t = t.dbl();
        return t;
      }
      var i = this.curve.a, n = this.curve.tinv, o = this.x, a = this.y, s = this.z, l = s.redSqr().redSqr(),
        u = a.redAdd(a);
      for (r = 0; r < e; r++) {
        var c = o.redSqr(), h = u.redSqr(), d = h.redSqr(), f = c.redAdd(c).redIAdd(c).redIAdd(i.redMul(l)),
          c = o.redMul(h), h = f.redSqr().redISub(c.redAdd(c)), c = c.redISub(h),
          f = (f = f.redMul(c)).redIAdd(f).redISub(d), c = u.redMul(s);
        r + 1 < e && (l = l.redMul(d)), o = h, s = c, u = f;
      }
      return this.curve.jpoint(o, u.redMul(n), s);
    }, u.prototype.dbl = function() {
      return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
    }, u.prototype._zeroDbl = function() {
      var e, t, r, i, n,
        o = this.zOne ? (r = this.x.redSqr(), e = (i = this.y.redSqr()).redSqr(), n = (n = this.x.redAdd(i).redSqr().redISub(r).redISub(e)).redIAdd(n), i = (t = r.redAdd(r).redIAdd(r)).redSqr().redISub(n).redISub(n), r = (r = (r = e.redIAdd(e)).redIAdd(r)).redIAdd(r), t = t.redMul(n.redISub(e = i)).redISub(r), this.y.redAdd(this.y)) : (n = this.x.redSqr(), o = (i = this.y.redSqr()).redSqr(), r = (r = this.x.redAdd(i).redSqr().redISub(n).redISub(o)).redIAdd(r), n = (i = n.redAdd(n).redIAdd(n)).redSqr(), o = (o = (o = o.redIAdd(o)).redIAdd(o)).redIAdd(o), e = n.redISub(r).redISub(r), t = i.redMul(r.redISub(e)).redISub(o), (o = this.y.redMul(this.z)).redIAdd(o));
      return this.curve.jpoint(e, t, o);
    }, u.prototype._threeDbl = function() {
      var e, t, r, i, n, o, a, s;
      return this.zOne ? (a = this.x.redSqr(), r = (e = this.y.redSqr()).redSqr(), o = (o = this.x.redAdd(e).redSqr().redISub(a).redISub(r)).redIAdd(o), t = i = (s = a.redAdd(a).redIAdd(a).redIAdd(this.curve.a)).redSqr().redISub(o).redISub(o), n = (n = (n = r.redIAdd(r)).redIAdd(n)).redIAdd(n), e = s.redMul(o.redISub(i)).redISub(n), a = this.y.redAdd(this.y)) : (r = this.z.redSqr(), s = this.y.redSqr(), o = this.x.redMul(s), i = (i = this.x.redSub(r).redMul(this.x.redAdd(r))).redAdd(i).redIAdd(i), o = (n = (n = o.redIAdd(o)).redIAdd(n)).redAdd(n), t = i.redSqr().redISub(o), a = this.y.redAdd(this.z).redSqr().redISub(s).redISub(r), s = (s = (s = (s = s.redSqr()).redIAdd(s)).redIAdd(s)).redIAdd(s), e = i.redMul(n.redISub(t)).redISub(s)), this.curve.jpoint(t, e, a);
    }, u.prototype._dbl = function() {
      var e = this.curve.a, t = this.x, r = this.y, i = this.z, n = i.redSqr().redSqr(), o = t.redSqr(), a = r.redSqr(),
        e = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(n)), n = t.redAdd(t), t = (n = n.redIAdd(n)).redMul(a),
        n = e.redSqr().redISub(t.redAdd(t)), t = t.redISub(n), a = a.redSqr();
      a = (a = (a = a.redIAdd(a)).redIAdd(a)).redIAdd(a);
      a = e.redMul(t).redISub(a), i = r.redAdd(r).redMul(i);
      return this.curve.jpoint(n, a, i);
    }, u.prototype.trpl = function() {
      if (!this.curve.zeroA) return this.dbl().add(this);
      var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), i = t.redSqr(), n = e.redAdd(e).redIAdd(e),
        o = n.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(i),
        e = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(o)).redSqr(), i = i.redIAdd(i);
      i = (i = (i = i.redIAdd(i)).redIAdd(i)).redIAdd(i);
      o = n.redIAdd(a).redSqr().redISub(o).redISub(e).redISub(i), t = t.redMul(o);
      t = (t = t.redIAdd(t)).redIAdd(t);
      t = this.x.redMul(e).redISub(t);
      t = (t = t.redIAdd(t)).redIAdd(t);
      o = this.y.redMul(o.redMul(i.redISub(o)).redISub(a.redMul(e)));
      o = (o = (o = o.redIAdd(o)).redIAdd(o)).redIAdd(o);
      e = this.z.redAdd(a).redSqr().redISub(r).redISub(e);
      return this.curve.jpoint(t, o, e);
    }, u.prototype.mul = function(e, t) {
      return e = new _(e, t), this.curve._wnafMul(this, e);
    }, u.prototype.eq = function(e) {
      if ("affine" === e.type) return this.eq(e.toJ());
      if (this === e) return !0;
      var t = this.z.redSqr(), r = e.z.redSqr();
      if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
      t = t.redMul(this.z), r = r.redMul(e.z);
      return 0 === this.y.redMul(r).redISub(e.y.redMul(t)).cmpn(0);
    }, u.prototype.eqXToP = function(e) {
      var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t);
      if (0 === this.x.cmp(r)) return !0;
      for (var i = e.clone(), n = this.curve.redN.redMul(t); ;) {
        if (i.iadd(this.curve.n), 0 <= i.cmp(this.curve.p)) return !1;
        if (r.redIAdd(n), 0 === this.x.cmp(r)) return !0;
      }
    }, u.prototype.inspect = function() {
      return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    }, u.prototype.isInfinity = function() {
      return 0 === this.z.cmpn(0);
    };
  }, { "../utils": 105, "./base": 92, "bn.js": 106, inherits: 142 }],
  97: [function(e, t, r) {
    "use strict";
    var i, n = r, r = e("hash.js"), o = e("./curve"), a = e("./utils").assert;

    function s(e) {
      "short" === e.type ? this.curve = new o["short"](e) : "edwards" === e.type ? this.curve = new o.edwards(e) : this.curve = new o.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, a(this.g.validate(), "Invalid curve"), a(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }

    function l(t, r) {
      Object.defineProperty(n, t, {
        configurable: !0, enumerable: !0, get: function() {
          var e = new s(r);
          return Object.defineProperty(n, t, { configurable: !0, enumerable: !0, value: e }), e;
        }
      });
    }

    n.PresetCurve = s, l("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: r.sha256,
      gRed: !1,
      g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
    }), l("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: r.sha256,
      gRed: !1,
      g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
    }), l("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: r.sha256,
      gRed: !1,
      g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
    }), l("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: r.sha384,
      gRed: !1,
      g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]
    }), l("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: r.sha512,
      gRed: !1,
      g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]
    }), l("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: r.sha256,
      gRed: !1,
      g: ["9"]
    }), l("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: r.sha256,
      gRed: !1,
      g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
    });
    try {
      i = e("./precomputed/secp256k1");
    } catch (e) {
      i = void 0;
    }
    l("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: r.sha256,
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [{
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      }, { a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15" }],
      gRed: !1,
      g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", i]
    });
  }, { "./curve": 94, "./precomputed/secp256k1": 104, "./utils": 105, "hash.js": 128 }],
  98: [function(e, t, r) {
    "use strict";
    var d = e("bn.js"), f = e("hmac-drbg"), i = e("../utils"), n = e("../curves"), o = e("brorand"), s = i.assert,
      a = e("./key"), p = e("./signature");

    function l(e) {
      if (!(this instanceof l)) return new l(e);
      "string" == typeof e && (s(Object.prototype.hasOwnProperty.call(n, e), "Unknown curve " + e), e = n[e]), e instanceof n.PresetCurve && (e = { curve: e }), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash;
    }

    (t.exports = l).prototype.keyPair = function(e) {
      return new a(this, e);
    }, l.prototype.keyFromPrivate = function(e, t) {
      return a.fromPrivate(this, e, t);
    }, l.prototype.keyFromPublic = function(e, t) {
      return a.fromPublic(this, e, t);
    }, l.prototype.genKeyPair = function(e) {
      for (var t = new f({
        hash: this.hash,
        pers: (e = e || {}).pers,
        persEnc: e.persEnc || "utf8",
        entropy: e.entropy || o(this.hash.hmacStrength),
        entropyEnc: e.entropy && e.entropyEnc || "utf8",
        nonce: this.n.toArray()
      }), r = this.n.byteLength(), i = this.n.sub(new d(2)); ;) {
        var n = new d(t.generate(r));
        if (!(0 < n.cmp(i))) return n.iaddn(1), this.keyFromPrivate(n);
      }
    }, l.prototype._truncateToN = function(e, t) {
      var r = 8 * e.byteLength() - this.n.bitLength();
      return 0 < r && (e = e.ushrn(r)), !t && 0 <= e.cmp(this.n) ? e.sub(this.n) : e;
    }, l.prototype.sign = function(e, t, r, i) {
      "object" == typeof r && (i = r, r = null), i = i || {}, t = this.keyFromPrivate(t, r), e = this._truncateToN(new d(e, 16));
      for (var n = this.n.byteLength(), r = t.getPrivate().toArray("be", n), n = e.toArray("be", n), o = new f({
        hash: this.hash,
        entropy: r,
        nonce: n,
        pers: i.pers,
        persEnc: i.persEnc || "utf8"
      }), a = this.n.sub(new d(1)), s = 0; ; s++) {
        var l = i.k ? i.k(s) : new d(o.generate(this.n.byteLength()));
        if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || 0 <= l.cmp(a))) {
          var u = this.g.mul(l);
          if (!u.isInfinity()) {
            var c = u.getX(), h = c.umod(this.n);
            if (0 !== h.cmpn(0)) {
              l = l.invm(this.n).mul(h.mul(t.getPrivate()).iadd(e));
              if (0 !== (l = l.umod(this.n)).cmpn(0)) {
                c = (u.getY().isOdd() ? 1 : 0) | (0 !== c.cmp(h) ? 2 : 0);
                return i.canonical && 0 < l.cmp(this.nh) && (l = this.n.sub(l), c ^= 1), new p({
                  r: h,
                  s: l,
                  recoveryParam: c
                });
              }
            }
          }
        }
      }
    }, l.prototype.verify = function(e, t, r, i) {
      e = this._truncateToN(new d(e, 16)), r = this.keyFromPublic(r, i);
      i = (t = new p(t, "hex")).r, t = t.s;
      if (i.cmpn(1) < 0 || 0 <= i.cmp(this.n)) return !1;
      if (t.cmpn(1) < 0 || 0 <= t.cmp(this.n)) return !1;
      var n, t = t.invm(this.n), e = t.mul(e).umod(this.n), t = t.mul(i).umod(this.n);
      return this.curve._maxwellTrick ? !(n = this.g.jmulAdd(e, r.getPublic(), t)).isInfinity() && n.eqXToP(i) : !(n = this.g.mulAdd(e, r.getPublic(), t)).isInfinity() && 0 === n.getX().umod(this.n).cmp(i);
    }, l.prototype.recoverPubKey = function(e, t, r, i) {
      s((3 & r) === r, "The recovery param is more than two bits"), t = new p(t, i);
      var n = this.n, o = new d(e), a = t.r, i = t.s, e = 1 & r, r = r >> 1;
      if (0 <= a.cmp(this.curve.p.umod(this.curve.n)) && r) throw new Error("Unable to find sencond key candinate");
      a = r ? this.curve.pointFromX(a.add(this.curve.n), e) : this.curve.pointFromX(a, e), t = t.r.invm(n), o = n.sub(o).mul(t).umod(n), n = i.mul(t).umod(n);
      return this.g.mulAdd(o, a, n);
    }, l.prototype.getKeyRecoveryParam = function(e, t, r, i) {
      if (null !== (t = new p(t, i)).recoveryParam) return t.recoveryParam;
      for (var n, o = 0; o < 4; o++) {
        try {
          n = this.recoverPubKey(e, t, o);
        } catch (e) {
          continue;
        }
        if (n.eq(r)) return o;
      }
      throw new Error("Unable to find valid recovery factor");
    };
  }, {
    "../curves": 97,
    "../utils": 105,
    "./key": 99,
    "./signature": 100,
    "bn.js": 106,
    brorand: 18,
    "hmac-drbg": 140
  }],
  99: [function(e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils").assert;

    function o(e, t) {
      this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc);
    }

    (t.exports = o).fromPublic = function(e, t, r) {
      return t instanceof o ? t : new o(e, { pub: t, pubEnc: r });
    }, o.fromPrivate = function(e, t, r) {
      return t instanceof o ? t : new o(e, { priv: t, privEnc: r });
    }, o.prototype.validate = function() {
      var e = this.getPublic();
      return e.isInfinity() ? {
        result: !1,
        reason: "Invalid public key"
      } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : {
        result: !1,
        reason: "Public key * N != O"
      } : { result: !1, reason: "Public key is not a point" };
    }, o.prototype.getPublic = function(e, t) {
      return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub;
    }, o.prototype.getPrivate = function(e) {
      return "hex" === e ? this.priv.toString(16, 2) : this.priv;
    }, o.prototype._importPrivate = function(e, t) {
      this.priv = new i(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n);
    }, o.prototype._importPublic = function(e, t) {
      if (e.x || e.y) return "mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e.x, e.y));
      this.pub = this.ec.curve.decodePoint(e, t);
    }, o.prototype.derive = function(e) {
      return e.validate() || n(e.validate(), "public point not validated"), e.mul(this.priv).getX();
    }, o.prototype.sign = function(e, t, r) {
      return this.ec.sign(e, this, t, r);
    }, o.prototype.verify = function(e, t) {
      return this.ec.verify(e, t, this);
    }, o.prototype.inspect = function() {
      return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
  }, { "../utils": 105, "bn.js": 106 }],
  100: [function(e, t, r) {
    "use strict";
    var n = e("bn.js"), o = e("../utils"), i = o.assert;

    function a(e, t) {
      if (e instanceof a) return e;
      this._importDER(e, t) || (i(e.r && e.s, "Signature without r or s"), this.r = new n(e.r, 16), this.s = new n(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam);
    }

    function s() {
      this.place = 0;
    }

    function l(e, t) {
      var r = e[t.place++];
      if (!(128 & r)) return r;
      var i = 15 & r;
      if (0 == i || 4 < i) return !1;
      for (var n = 0, o = 0, a = t.place; o < i; o++, a++) n <<= 8, n |= e[a], n >>>= 0;
      return !(n <= 127) && (t.place = a, n);
    }

    function u(e) {
      for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) t++;
      return 0 === t ? e : e.slice(t);
    }

    function c(e, t) {
      if (t < 128) e.push(t); else {
        var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
        for (e.push(128 | r); --r;) e.push(t >>> (r << 3) & 255);
        e.push(t);
      }
    }

    (t.exports = a).prototype._importDER = function(e, t) {
      e = o.toArray(e, t);
      var r = new s;
      if (48 !== e[r.place++]) return !1;
      var i = l(e, r);
      if (!1 === i) return !1;
      if (i + r.place !== e.length) return !1;
      if (2 !== e[r.place++]) return !1;
      t = l(e, r);
      if (!1 === t) return !1;
      i = e.slice(r.place, t + r.place);
      if (r.place += t, 2 !== e[r.place++]) return !1;
      t = l(e, r);
      if (!1 === t) return !1;
      if (e.length !== t + r.place) return !1;
      r = e.slice(r.place, t + r.place);
      if (0 === i[0]) {
        if (!(128 & i[1])) return !1;
        i = i.slice(1);
      }
      if (0 === r[0]) {
        if (!(128 & r[1])) return !1;
        r = r.slice(1);
      }
      return this.r = new n(i), this.s = new n(r), !(this.recoveryParam = null);
    }, a.prototype.toDER = function(e) {
      var t = this.r.toArray(), r = this.s.toArray();
      for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = u(t), r = u(r); !(r[0] || 128 & r[1]);) r = r.slice(1);
      var i = [2];
      c(i, t.length), (i = i.concat(t)).push(2), c(i, r.length);
      t = i.concat(r), i = [48];
      return c(i, t.length), i = i.concat(t), o.encode(i, e);
    };
  }, { "../utils": 105, "bn.js": 106 }],
  101: [function(e, t, r) {
    "use strict";
    var i = e("hash.js"), n = e("../curves"), o = e("../utils"), a = o.assert, s = o.parseBytes, l = e("./key"),
      u = e("./signature");

    function c(e) {
      if (a("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof c)) return new c(e);
      e = n[e].curve, this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = i.sha512;
    }

    (t.exports = c).prototype.sign = function(e, t) {
      e = s(e);
      var r = this.keyFromSecret(t), i = this.hashInt(r.messagePrefix(), e), n = this.g.mul(i), t = this.encodePoint(n),
        r = this.hashInt(t, r.pubBytes(), e).mul(r.priv()), r = i.add(r).umod(this.curve.n);
      return this.makeSignature({ R: n, S: r, Rencoded: t });
    }, c.prototype.verify = function(e, t, r) {
      e = s(e), t = this.makeSignature(t);
      var i = this.keyFromPublic(r), r = this.hashInt(t.Rencoded(), i.pubBytes(), e), e = this.g.mul(t.S());
      return t.R().add(i.pub().mul(r)).eq(e);
    }, c.prototype.hashInt = function() {
      for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
      return o.intFromLE(e.digest()).umod(this.curve.n);
    }, c.prototype.keyFromPublic = function(e) {
      return l.fromPublic(this, e);
    }, c.prototype.keyFromSecret = function(e) {
      return l.fromSecret(this, e);
    }, c.prototype.makeSignature = function(e) {
      return e instanceof u ? e : new u(this, e);
    }, c.prototype.encodePoint = function(e) {
      var t = e.getY().toArray("le", this.encodingLength);
      return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t;
    }, c.prototype.decodePoint = function(e) {
      var t = (e = o.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]), t = 0 != (128 & e[t]),
        r = o.intFromLE(r);
      return this.curve.pointFromY(r, t);
    }, c.prototype.encodeInt = function(e) {
      return e.toArray("le", this.encodingLength);
    }, c.prototype.decodeInt = function(e) {
      return o.intFromLE(e);
    }, c.prototype.isPoint = function(e) {
      return e instanceof this.pointClass;
    };
  }, { "../curves": 97, "../utils": 105, "./key": 102, "./signature": 103, "hash.js": 128 }],
  102: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = i.assert, o = i.parseBytes, e = i.cachedProperty;

    function a(e, t) {
      this.eddsa = e, this._secret = o(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub);
    }

    a.fromPublic = function(e, t) {
      return t instanceof a ? t : new a(e, { pub: t });
    }, a.fromSecret = function(e, t) {
      return t instanceof a ? t : new a(e, { secret: t });
    }, a.prototype.secret = function() {
      return this._secret;
    }, e(a, "pubBytes", function() {
      return this.eddsa.encodePoint(this.pub());
    }), e(a, "pub", function() {
      return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
    }), e(a, "privBytes", function() {
      var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, e = t.slice(0, e.encodingLength);
      return e[0] &= 248, e[r] &= 127, e[r] |= 64, e;
    }), e(a, "priv", function() {
      return this.eddsa.decodeInt(this.privBytes());
    }), e(a, "hash", function() {
      return this.eddsa.hash().update(this.secret()).digest();
    }), e(a, "messagePrefix", function() {
      return this.hash().slice(this.eddsa.encodingLength);
    }), a.prototype.sign = function(e) {
      return n(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
    }, a.prototype.verify = function(e, t) {
      return this.eddsa.verify(e, t, this);
    }, a.prototype.getSecret = function(e) {
      return n(this._secret, "KeyPair is public only"), i.encode(this.secret(), e);
    }, a.prototype.getPublic = function(e) {
      return i.encode(this.pubBytes(), e);
    }, t.exports = a;
  }, { "../utils": 105 }],
  103: [function(e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils"), o = n.assert, e = n.cachedProperty, a = n.parseBytes;

    function s(e, t) {
      this.eddsa = e, "object" != typeof t && (t = a(t)), Array.isArray(t) && (t = {
        R: t.slice(0, e.encodingLength),
        S: t.slice(e.encodingLength)
      }), o(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), t.S instanceof i && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
    }

    e(s, "S", function() {
      return this.eddsa.decodeInt(this.Sencoded());
    }), e(s, "R", function() {
      return this.eddsa.decodePoint(this.Rencoded());
    }), e(s, "Rencoded", function() {
      return this.eddsa.encodePoint(this.R());
    }), e(s, "Sencoded", function() {
      return this.eddsa.encodeInt(this.S());
    }), s.prototype.toBytes = function() {
      return this.Rencoded().concat(this.Sencoded());
    }, s.prototype.toHex = function() {
      return n.encode(this.toBytes(), "hex").toUpperCase();
    }, t.exports = s;
  }, { "../utils": 105, "bn.js": 106 }],
  104: [function(e, t, r) {
    t.exports = {
      doubles: {
        step: 4,
        points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]
      }, naf: {
        wnd: 7,
        points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]
      }
    };
  }, {}],
  105: [function(e, t, r) {
    "use strict";
    var i = r, n = e("bn.js"), r = e("minimalistic-assert"), e = e("minimalistic-crypto-utils");
    i.assert = r, i.toArray = e.toArray, i.zero2 = e.zero2, i.toHex = e.toHex, i.encode = e.encode, i.getNAF = function(e, t, r) {
      var i = new Array(Math.max(e.bitLength(), r) + 1);
      i.fill(0);
      for (var n = 1 << t + 1, o = e.clone(), a = 0; a < i.length; a++) {
        var s, l = o.andln(n - 1);
        o.isOdd() ? o.isubn(s = (n >> 1) - 1 < l ? (n >> 1) - l : l) : s = 0, i[a] = s, o.iushrn(1);
      }
      return i;
    }, i.getJSF = function(e, t) {
      var r = [[], []];
      e = e.clone(), t = t.clone();
      for (var i, n = 0, o = 0; 0 < e.cmpn(-n) || 0 < t.cmpn(-o);) {
        var a, s = e.andln(3) + n & 3, l = t.andln(3) + o & 3;
        3 === l && (l = -1), a = 0 == (1 & (s = 3 === s ? -1 : s)) ? 0 : 3 !== (i = e.andln(7) + n & 7) && 5 !== i || 2 !== l ? s : -s, r[0].push(a), l = 0 == (1 & l) ? 0 : 3 !== (i = t.andln(7) + o & 7) && 5 !== i || 2 !== s ? l : -l, r[1].push(l), 2 * n === a + 1 && (n = 1 - n), 2 * o === l + 1 && (o = 1 - o), e.iushrn(1), t.iushrn(1);
      }
      return r;
    }, i.cachedProperty = function(e, t, r) {
      var i = "_" + t;
      e.prototype[t] = function() {
        return void 0 !== this[i] ? this[i] : this[i] = r.call(this);
      };
    }, i.parseBytes = function(e) {
      return "string" == typeof e ? i.toArray(e, "hex") : e;
    }, i.intFromLE = function(e) {
      return new n(e, "hex", "le");
    };
  }, { "bn.js": 106, "minimalistic-assert": 148, "minimalistic-crypto-utils": 149 }],
  106: [function(e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, { buffer: 19, dup: 15 }],
  107: [function(e, t, r) {
    t.exports = {
      _from: "elliptic@^6.5.3",
      _id: "elliptic@6.5.4",
      _inBundle: !1,
      _integrity: "sha512-iLhC6ULemrljPZb+QutR5TQGB+pdW6KGD5RSegS+8sorOZT+rdQFbsQFJgvN3eRqNALqJer4oQ16YvJHlU8hzQ==",
      _location: "/elliptic",
      _phantomChildren: {},
      _requested: {
        type: "range",
        registry: !0,
        raw: "elliptic@^6.5.3",
        name: "elliptic",
        escapedName: "elliptic",
        rawSpec: "^6.5.3",
        saveSpec: null,
        fetchSpec: "^6.5.3"
      },
      _requiredBy: ["/browserify-sign", "/create-ecdh"],
      _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.5.4.tgz",
      _shasum: "da37cebd31e79a1367e941b592ed1fbebd58abbb",
      _spec: "elliptic@^6.5.3",
      _where: "/Users/youcheng/Documents/code/prismplayer/node_modules/browserify-sign",
      author: { name: "Fedor Indutny", email: "fedor@indutny.com" },
      bugs: { url: "https://github.com/indutny/elliptic/issues" },
      bundleDependencies: !1,
      dependencies: {
        "bn.js": "^4.11.9",
        brorand: "^1.1.0",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.1",
        inherits: "^2.0.4",
        "minimalistic-assert": "^1.0.1",
        "minimalistic-crypto-utils": "^1.0.1"
      },
      deprecated: !1,
      description: "EC cryptography",
      devDependencies: {
        brfs: "^2.0.2",
        coveralls: "^3.1.0",
        eslint: "^7.6.0",
        grunt: "^1.2.1",
        "grunt-browserify": "^5.3.0",
        "grunt-cli": "^1.3.2",
        "grunt-contrib-connect": "^3.0.0",
        "grunt-contrib-copy": "^1.0.0",
        "grunt-contrib-uglify": "^5.0.0",
        "grunt-mocha-istanbul": "^5.0.2",
        "grunt-saucelabs": "^9.0.1",
        istanbul: "^0.4.5",
        mocha: "^8.0.1"
      },
      files: ["lib"],
      homepage: "https://github.com/indutny/elliptic",
      keywords: ["EC", "Elliptic", "curve", "Cryptography"],
      license: "MIT",
      main: "lib/elliptic.js",
      name: "elliptic",
      repository: { type: "git", url: "git+ssh://git@github.com/indutny/elliptic.git" },
      scripts: {
        lint: "eslint lib test",
        "lint:fix": "npm run lint -- --fix",
        test: "npm run lint && npm run unit",
        unit: "istanbul test _mocha --reporter=spec test/index.js",
        version: "grunt dist && git add dist/"
      },
      version: "6.5.4"
    };
  }, {}],
  108: [function(e, t, r) {
    var s = Object.create || function(e) {
      function t() {
      }

      return t.prototype = e, new t;
    }, a = Object.keys || function(e) {
      var t, r = [];
      for (t in e) Object.prototype.hasOwnProperty.call(e, t) && r.push(t);
      return t;
    }, i = Function.prototype.bind || function(e) {
      var t = this;
      return function() {
        return t.apply(e, arguments);
      };
    };

    function n() {
      this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = s(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }

    ((t.exports = n).EventEmitter = n).prototype._events = void 0, n.prototype._maxListeners = void 0;
    var o, l = 10;
    try {
      var u = {};
      Object.defineProperty && Object.defineProperty(u, "x", { value: 0 }), o = 0 === u.x;
    } catch (e) {
      o = !1;
    }

    function c(e) {
      return void 0 === e._maxListeners ? n.defaultMaxListeners : e._maxListeners;
    }

    function h(e, t, r, i) {
      var n, o;
      if ("function" != typeof r) throw new TypeError("\"listener\" argument must be a function");
      return (n = e._events) ? (n.newListener && (e.emit("newListener", t, r.listener || r), n = e._events), o = n[t]) : (n = e._events = s(null), e._eventsCount = 0), o ? ("function" == typeof o ? o = n[t] = i ? [r, o] : [o, r] : i ? o.unshift(r) : o.push(r), o.warned || (i = c(e)) && 0 < i && o.length > i && (o.warned = !0, (i = new Error("Possible EventEmitter memory leak detected. " + o.length + " \"" + String(t) + "\" listeners added. Use emitter.setMaxListeners() to increase limit.")).name = "MaxListenersExceededWarning", i.emitter = e, i.type = t, i.count = o.length, "object" == typeof console && console.warn && console.warn("%s: %s", i.name, i.message))) : (o = n[t] = r, ++e._eventsCount), e;
    }

    function d() {
      if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
        case 0:
          return this.listener.call(this.target);
        case 1:
          return this.listener.call(this.target, arguments[0]);
        case 2:
          return this.listener.call(this.target, arguments[0], arguments[1]);
        case 3:
          return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
        default:
          for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
          this.listener.apply(this.target, e);
      }
    }

    function f(e, t, r) {
      e = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r }, t = i.call(d, e);
      return t.listener = r, e.wrapFn = t;
    }

    function p(e, t, r) {
      e = e._events;
      if (!e) return [];
      t = e[t];
      return t ? "function" == typeof t ? r ? [t.listener || t] : [t] : r ? function(e) {
        for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
        return t;
      }(t) : g(t, t.length) : [];
    }

    function y(e) {
      var t = this._events;
      if (t) {
        e = t[e];
        if ("function" == typeof e) return 1;
        if (e) return e.length;
      }
      return 0;
    }

    function g(e, t) {
      for (var r = new Array(t), i = 0; i < t; ++i) r[i] = e[i];
      return r;
    }

    o ? Object.defineProperty(n, "defaultMaxListeners", {
      enumerable: !0, get: function() {
        return l;
      }, set: function(e) {
        if ("number" != typeof e || e < 0 || e != e) throw new TypeError("\"defaultMaxListeners\" must be a positive number");
        l = e;
      }
    }) : n.defaultMaxListeners = l, n.prototype.setMaxListeners = function(e) {
      if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError("\"n\" argument must be a positive number");
      return this._maxListeners = e, this;
    }, n.prototype.getMaxListeners = function() {
      return c(this);
    }, n.prototype.emit = function(e) {
      var t, r, i, n, o = "error" === e, a = this._events;
      if (a) o = o && null == a.error; else if (!o) return !1;
      if (o) {
        if ((t = 1 < arguments.length ? arguments[1] : t) instanceof Error) throw t;
        o = new Error("Unhandled \"error\" event. (" + t + ")");
        throw o.context = t, o;
      }
      if (!(r = a[e])) return !1;
      var s, l = "function" == typeof r;
      switch (s = arguments.length) {
        case 1:
          !function(e, t, r) {
            if (t) e.call(r); else for (var i = e.length, n = g(e, i), o = 0; o < i; ++o) n[o].call(r);
          }(r, l, this);
          break;
        case 2:
          !function(e, t, r, i) {
            if (t) e.call(r, i); else for (var n = e.length, o = g(e, n), a = 0; a < n; ++a) o[a].call(r, i);
          }(r, l, this, arguments[1]);
          break;
        case 3:
          !function(e, t, r, i, n) {
            if (t) e.call(r, i, n); else for (var o = e.length, a = g(e, o), s = 0; s < o; ++s) a[s].call(r, i, n);
          }(r, l, this, arguments[1], arguments[2]);
          break;
        case 4:
          !function(e, t, r, i, n, o) {
            if (t) e.call(r, i, n, o); else for (var a = e.length, s = g(e, a), l = 0; l < a; ++l) s[l].call(r, i, n, o);
          }(r, l, this, arguments[1], arguments[2], arguments[3]);
          break;
        default:
          for (i = new Array(s - 1), n = 1; n < s; n++) i[n - 1] = arguments[n];
          !function(e, t, r, i) {
            if (t) e.apply(r, i); else for (var n = e.length, o = g(e, n), a = 0; a < n; ++a) o[a].apply(r, i);
          }(r, l, this, i);
      }
      return !0;
    }, n.prototype.on = n.prototype.addListener = function(e, t) {
      return h(this, e, t, !1);
    }, n.prototype.prependListener = function(e, t) {
      return h(this, e, t, !0);
    }, n.prototype.once = function(e, t) {
      if ("function" != typeof t) throw new TypeError("\"listener\" argument must be a function");
      return this.on(e, f(this, e, t)), this;
    }, n.prototype.prependOnceListener = function(e, t) {
      if ("function" != typeof t) throw new TypeError("\"listener\" argument must be a function");
      return this.prependListener(e, f(this, e, t)), this;
    }, n.prototype.removeListener = function(e, t) {
      var r, i, n, o, a;
      if ("function" != typeof t) throw new TypeError("\"listener\" argument must be a function");
      if (!(i = this._events)) return this;
      if (!(r = i[e])) return this;
      if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = s(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t)); else if ("function" != typeof r) {
        for (n = -1, o = r.length - 1; 0 <= o; o--) if (r[o] === t || r[o].listener === t) {
          a = r[o].listener, n = o;
          break;
        }
        if (n < 0) return this;
        0 === n ? r.shift() : function(e, t) {
          for (var r = t, i = r + 1, n = e.length; i < n; r += 1, i += 1) e[r] = e[i];
          e.pop();
        }(r, n), 1 === r.length && (i[e] = r[0]), i.removeListener && this.emit("removeListener", e, a || t);
      }
      return this;
    }, n.prototype.removeAllListeners = function(e) {
      var t, r = this._events;
      if (!r) return this;
      if (!r.removeListener) return 0 === arguments.length ? (this._events = s(null), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = s(null) : delete r[e]), this;
      if (0 === arguments.length) {
        for (var i, n = a(r), o = 0; o < n.length; ++o) "removeListener" !== (i = n[o]) && this.removeAllListeners(i);
        return this.removeAllListeners("removeListener"), this._events = s(null), this._eventsCount = 0, this;
      }
      if ("function" == typeof (t = r[e])) this.removeListener(e, t); else if (t) for (o = t.length - 1; 0 <= o; o--) this.removeListener(e, t[o]);
      return this;
    }, n.prototype.listeners = function(e) {
      return p(this, e, !0);
    }, n.prototype.rawListeners = function(e) {
      return p(this, e, !1);
    }, n.listenerCount = function(e, t) {
      return "function" == typeof e.listenerCount ? e.listenerCount(t) : y.call(e, t);
    }, n.prototype.listenerCount = y, n.prototype.eventNames = function() {
      return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : [];
    };
  }, {}],
  109: [function(e, t, r) {
    var h = e("safe-buffer").Buffer, d = e("md5.js");
    t.exports = function(e, t, r, i) {
      if (h.isBuffer(e) || (e = h.from(e, "binary")), t && 8 !== (t = !h.isBuffer(t) ? h.from(t, "binary") : t).length) throw new RangeError("salt should be Buffer with 8 byte length");
      for (var n = r / 8, o = h.alloc(n), a = h.alloc(i || 0), s = h.alloc(0); 0 < n || 0 < i;) {
        var l = new d;
        l.update(s), l.update(e), t && l.update(t);
        var u, s = l.digest(), c = 0;
        0 < n && (u = o.length - n, c = Math.min(n, s.length), s.copy(o, u, 0, c), n -= c), c < s.length && 0 < i && (l = a.length - i, u = Math.min(i, s.length - c), s.copy(a, l, c, c + u), i -= u);
      }
      return s.fill(0), { key: o, iv: a };
    };
  }, { "md5.js": 145, "safe-buffer": 187 }],
  110: [function(e, t, r) {
    !function() {
      "use strict";

      function a(n, e) {
        var t;
        if (e = e || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = e.touchBoundary || 10, this.layer = n, this.tapDelay = e.tapDelay || 200, this.tapTimeout = e.tapTimeout || 700, !a.notNeeded(n)) {
          for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], i = 0, o = r.length; i < o; i++) this[r[i]] = function(e, t) {
            return function() {
              return e.apply(t, arguments);
            };
          }(this[r[i]], this);
          s && (n.addEventListener("mouseover", this.onMouse, !0), n.addEventListener("mousedown", this.onMouse, !0), n.addEventListener("mouseup", this.onMouse, !0)), n.addEventListener("click", this.onClick, !0), n.addEventListener("touchstart", this.onTouchStart, !1), n.addEventListener("touchmove", this.onTouchMove, !1), n.addEventListener("touchend", this.onTouchEnd, !1), n.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (n.removeEventListener = function(e, t, r) {
            var i = Node.prototype.removeEventListener;
            "click" === e ? i.call(n, e, t.hijacked || t, r) : i.call(n, e, t, r);
          }, n.addEventListener = function(e, t, r) {
            var i = Node.prototype.addEventListener;
            "click" === e ? i.call(n, e, t.hijacked || (t.hijacked = function(e) {
              e.propagationStopped || t(e);
            }), r) : i.call(n, e, t, r);
          }), "function" == typeof n.onclick && (t = n.onclick, n.addEventListener("click", function(e) {
            t(e);
          }, !1), n.onclick = null);
        }
      }

      var e = 0 <= navigator.userAgent.indexOf("Windows Phone"), s = 0 < navigator.userAgent.indexOf("Android") && !e,
        l = /iP(ad|hone|od)/.test(navigator.userAgent) && !e, u = l && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        c = l && /OS [6-7]_\d/.test(navigator.userAgent), n = 0 < navigator.userAgent.indexOf("BB10");
      a.prototype.needsClick = function(e) {
        switch (e.nodeName.toLowerCase()) {
          case"button":
          case"select":
          case"textarea":
            if (e.disabled) return !0;
            break;
          case"input":
            if (l && "file" === e.type || e.disabled) return !0;
            break;
          case"label":
          case"iframe":
          case"video":
            return !0;
        }
        return /\bneedsclick\b/.test(e.className);
      }, a.prototype.needsFocus = function(e) {
        switch (e.nodeName.toLowerCase()) {
          case"textarea":
            return !0;
          case"select":
            return !s;
          case"input":
            switch (e.type) {
              case"button":
              case"checkbox":
              case"file":
              case"image":
              case"radio":
              case"submit":
                return !1;
            }
            return !e.disabled && !e.readOnly;
          default:
            return /\bneedsfocus\b/.test(e.className);
        }
      }, a.prototype.sendClick = function(e, t) {
        var r;
        document.activeElement && document.activeElement !== e && document.activeElement.blur(), r = t.changedTouches[0], (t = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(e), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), t.forwardedTouchEvent = !0, e.dispatchEvent(t);
      }, a.prototype.determineEventType = function(e) {
        return s && "select" === e.tagName.toLowerCase() ? "mousedown" : "click";
      }, a.prototype.focus = function(e) {
        var t;
        l && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus();
      }, a.prototype.updateScrollParent = function(e) {
        var t, r = e.fastClickScrollParent;
        if (!r || !r.contains(e)) {
          t = e;
          do {
            if (t.scrollHeight > t.offsetHeight) {
              e.fastClickScrollParent = r = t;
              break;
            }
          } while (t = t.parentElement);
        }
        r && (r.fastClickLastScrollTop = r.scrollTop);
      }, a.prototype.getTargetElementFromEventTarget = function(e) {
        return e.nodeType === Node.TEXT_NODE ? e.parentNode : e;
      }, a.prototype.onTouchStart = function(e) {
        var t, r, i;
        if (1 < e.targetTouches.length) return !0;
        if (t = this.getTargetElementFromEventTarget(e.target), r = e.targetTouches[0], l) {
          if ((i = window.getSelection()).rangeCount && !i.isCollapsed) return !0;
          if (!u) {
            if (r.identifier && r.identifier === this.lastTouchIdentifier) return e.preventDefault(), !1;
            this.lastTouchIdentifier = r.identifier, this.updateScrollParent(t);
          }
        }
        return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = r.pageX, this.touchStartY = r.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0;
      }, a.prototype.touchHasMoved = function(e) {
        var t = e.changedTouches[0], e = this.touchBoundary;
        return Math.abs(t.pageX - this.touchStartX) > e || Math.abs(t.pageY - this.touchStartY) > e;
      }, a.prototype.onTouchMove = function(e) {
        return this.trackingClick && (this.targetElement === this.getTargetElementFromEventTarget(e.target) && !this.touchHasMoved(e) || (this.trackingClick = !1, this.targetElement = null)), !0;
      }, a.prototype.findControl = function(e) {
        return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
      }, a.prototype.onTouchEnd = function(e) {
        var t, r, i, n, o = this.targetElement;
        if (!this.trackingClick) return !0;
        if (e.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0;
        if (e.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, t = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, c && (n = e.changedTouches[0], (o = document.elementFromPoint(n.pageX - window.pageXOffset, n.pageY - window.pageYOffset) || o).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (r = o.tagName.toLowerCase())) {
          if (n = this.findControl(o)) {
            if (this.focus(o), s) return !1;
            o = n;
          }
        } else if (this.needsFocus(o)) return 100 < e.timeStamp - t || l && window.top !== window && "input" === r ? this.targetElement = null : (this.focus(o), this.sendClick(o, e), l && "select" === r || (this.targetElement = null, e.preventDefault())), !1;
        return !(!l || u || !(i = o.fastClickScrollParent) || i.fastClickLastScrollTop === i.scrollTop) || (this.needsClick(o) || (e.preventDefault(), this.sendClick(o, e)), !1);
      }, a.prototype.onTouchCancel = function() {
        this.trackingClick = !1, this.targetElement = null;
      }, a.prototype.onMouse = function(e) {
        return !this.targetElement || (!!e.forwardedTouchEvent || (!e.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1))));
      }, a.prototype.onClick = function(e) {
        return this.trackingClick ? (this.targetElement = null, !(this.trackingClick = !1)) : "submit" === e.target.type && 0 === e.detail || ((e = this.onMouse(e)) || (this.targetElement = null), e);
      }, a.prototype.destroy = function() {
        var e = this.layer;
        s && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1);
      }, a.notNeeded = function(e) {
        var t, r, i;
        if (void 0 === window.ontouchstart) return !0;
        if (r = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
          if (!s) return !0;
          if (t = document.querySelector("meta[name=viewport]")) {
            if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
            if (31 < r && document.documentElement.scrollWidth <= window.outerWidth) return !0;
          }
        }
        if (n && 10 <= (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] && 3 <= i[2] && (t = document.querySelector("meta[name=viewport]"))) {
          if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
          if (document.documentElement.scrollWidth <= window.outerWidth) return !0;
        }
        return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction || (!!(27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (t = document.querySelector("meta[name=viewport]")) && (-1 !== t.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === e.style.touchAction || "manipulation" === e.style.touchAction));
      }, a.attach = function(e, t) {
        return new a(e, t);
      }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return a;
      }) : void 0 !== t && t.exports ? (t.exports = a.attach, t.exports.FastClick = a) : window.FastClick = a;
    }();
  }, {}],
  111: [function(e, t, r) {
    "use strict";
    var s = e("safe-buffer").Buffer, i = e("readable-stream").Transform;

    function n(e) {
      i.call(this), this._block = s.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
    }

    e("inherits")(n, i), n.prototype._transform = function(e, t, r) {
      var i = null;
      try {
        this.update(e, t);
      } catch (e) {
        i = e;
      }
      r(i);
    }, n.prototype._flush = function(e) {
      var t = null;
      try {
        this.push(this.digest());
      } catch (e) {
        t = e;
      }
      e(t);
    }, n.prototype.update = function(e, t) {
      if (!function(e, t) {
        if (!s.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
      }(e, "Data"), this._finalized) throw new Error("Digest already called");
      s.isBuffer(e) || (e = s.from(e, t));
      for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) {
        for (var n = this._blockOffset; n < this._blockSize;) r[n++] = e[i++];
        this._update(), this._blockOffset = 0;
      }
      for (; i < e.length;) r[this._blockOffset++] = e[i++];
      for (var o = 0, a = 8 * e.length; 0 < a; ++o) this._length[o] += a, 0 < (a = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * a);
      return this;
    }, n.prototype._update = function() {
      throw new Error("_update is not implemented");
    }, n.prototype.digest = function(e) {
      if (this._finalized) throw new Error("Digest already called");
      this._finalized = !0;
      var t = this._digest();
      void 0 !== e && (t = t.toString(e)), this._block.fill(0);
      for (var r = this._blockOffset = 0; r < 4; ++r) this._length[r] = 0;
      return t;
    }, n.prototype._digest = function() {
      throw new Error("_digest is not implemented");
    }, t.exports = n;
  }, { inherits: 142, "readable-stream": 126, "safe-buffer": 127 }],
  112: [function(e, t, r) {
    arguments[4][47][0].apply(r, arguments);
  }, { dup: 47 }],
  113: [function(e, t, r) {
    arguments[4][48][0].apply(r, arguments);
  }, { "./_stream_readable": 115, "./_stream_writable": 117, _process: 162, dup: 48, inherits: 142 }],
  114: [function(e, t, r) {
    arguments[4][49][0].apply(r, arguments);
  }, { "./_stream_transform": 116, dup: 49, inherits: 142 }],
  115: [function(e, t, r) {
    arguments[4][50][0].apply(r, arguments);
  }, {
    "../errors": 112,
    "./_stream_duplex": 113,
    "./internal/streams/async_iterator": 118,
    "./internal/streams/buffer_list": 119,
    "./internal/streams/destroy": 120,
    "./internal/streams/from": 122,
    "./internal/streams/state": 124,
    "./internal/streams/stream": 125,
    _process: 162,
    buffer: 64,
    dup: 50,
    events: 108,
    inherits: 142,
    "string_decoder/": 198,
    util: 19
  }],
  116: [function(e, t, r) {
    arguments[4][51][0].apply(r, arguments);
  }, { "../errors": 112, "./_stream_duplex": 113, dup: 51, inherits: 142 }],
  117: [function(e, t, r) {
    arguments[4][52][0].apply(r, arguments);
  }, {
    "../errors": 112,
    "./_stream_duplex": 113,
    "./internal/streams/destroy": 120,
    "./internal/streams/state": 124,
    "./internal/streams/stream": 125,
    _process: 162,
    buffer: 64,
    dup: 52,
    inherits: 142,
    "util-deprecate": 201
  }],
  118: [function(e, t, r) {
    arguments[4][53][0].apply(r, arguments);
  }, { "./end-of-stream": 121, _process: 162, dup: 53 }],
  119: [function(e, t, r) {
    arguments[4][54][0].apply(r, arguments);
  }, { buffer: 64, dup: 54, util: 19 }],
  120: [function(e, t, r) {
    arguments[4][55][0].apply(r, arguments);
  }, { _process: 162, dup: 55 }],
  121: [function(e, t, r) {
    arguments[4][56][0].apply(r, arguments);
  }, { "../../../errors": 112, dup: 56 }],
  122: [function(e, t, r) {
    arguments[4][57][0].apply(r, arguments);
  }, { dup: 57 }],
  123: [function(e, t, r) {
    arguments[4][58][0].apply(r, arguments);
  }, { "../../../errors": 112, "./end-of-stream": 121, dup: 58 }],
  124: [function(e, t, r) {
    arguments[4][59][0].apply(r, arguments);
  }, { "../../../errors": 112, dup: 59 }],
  125: [function(e, t, r) {
    arguments[4][60][0].apply(r, arguments);
  }, { dup: 60, events: 108 }],
  126: [function(e, t, r) {
    arguments[4][61][0].apply(r, arguments);
  }, {
    "./lib/_stream_duplex.js": 113,
    "./lib/_stream_passthrough.js": 114,
    "./lib/_stream_readable.js": 115,
    "./lib/_stream_transform.js": 116,
    "./lib/_stream_writable.js": 117,
    "./lib/internal/streams/end-of-stream.js": 121,
    "./lib/internal/streams/pipeline.js": 123,
    dup: 61
  }],
  127: [function(e, t, r) {
    arguments[4][62][0].apply(r, arguments);
  }, { buffer: 64, dup: 62 }],
  128: [function(e, t, r) {
    r.utils = e("./hash/utils"), r.common = e("./hash/common"), r.sha = e("./hash/sha"), r.ripemd = e("./hash/ripemd"), r.hmac = e("./hash/hmac"), r.sha1 = r.sha.sha1, r.sha256 = r.sha.sha256, r.sha224 = r.sha.sha224, r.sha384 = r.sha.sha384, r.sha512 = r.sha.sha512, r.ripemd160 = r.ripemd.ripemd160;
  }, { "./hash/common": 129, "./hash/hmac": 130, "./hash/ripemd": 131, "./hash/sha": 132, "./hash/utils": 139 }],
  129: [function(e, t, r) {
    "use strict";
    var i = e("./utils"), n = e("minimalistic-assert");

    function o() {
      this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
    }

    (r.BlockHash = o).prototype.update = function(e, t) {
      if (e = i.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
        t = (e = this.pending).length % this._delta8;
        this.pending = e.slice(e.length - t, e.length), 0 === this.pending.length && (this.pending = null), e = i.join32(e, 0, e.length - t, this.endian);
        for (var r = 0; r < e.length; r += this._delta32) this._update(e, r, r + this._delta32);
      }
      return this;
    }, o.prototype.digest = function(e) {
      return this.update(this._pad()), n(null === this.pending), this._digest(e);
    }, o.prototype._pad = function() {
      var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t, i = new Array(r + this.padLength);
      i[0] = 128;
      for (var n = 1; n < r; n++) i[n] = 0;
      if (e <<= 3, "big" === this.endian) {
        for (var o = 8; o < this.padLength; o++) i[n++] = 0;
        i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = e >>> 24 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 8 & 255, i[n++] = 255 & e;
      } else for (i[n++] = 255 & e, i[n++] = e >>> 8 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 24 & 255, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, o = 8; o < this.padLength; o++) i[n++] = 0;
      return i;
    };
  }, { "./utils": 139, "minimalistic-assert": 148 }],
  130: [function(e, t, r) {
    "use strict";
    var i = e("./utils"), n = e("minimalistic-assert");

    function o(e, t, r) {
      if (!(this instanceof o)) return new o(e, t, r);
      this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(i.toArray(t, r));
    }

    (t.exports = o).prototype._init = function(e) {
      e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), n(e.length <= this.blockSize);
      for (var t = e.length; t < this.blockSize; t++) e.push(0);
      for (t = 0; t < e.length; t++) e[t] ^= 54;
      for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++) e[t] ^= 106;
      this.outer = (new this.Hash).update(e);
    }, o.prototype.update = function(e, t) {
      return this.inner.update(e, t), this;
    }, o.prototype.digest = function(e) {
      return this.outer.update(this.inner.digest()), this.outer.digest(e);
    };
  }, { "./utils": 139, "minimalistic-assert": 148 }],
  131: [function(e, t, r) {
    "use strict";
    var i = e("./utils"), e = e("./common"), y = i.rotl32, g = i.sum32, m = i.sum32_3, b = i.sum32_4, n = e.BlockHash;

    function o() {
      if (!(this instanceof o)) return new o;
      n.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
    }

    function _(e, t, r, i) {
      return e <= 15 ? t ^ r ^ i : e <= 31 ? t & r | ~t & i : e <= 47 ? (t | ~r) ^ i : e <= 63 ? t & i | r & ~i : t ^ (r | ~i);
    }

    i.inherits(o, n), (r.ripemd160 = o).blockSize = 512, o.outSize = 160, o.hmacStrength = 192, o.padLength = 64, o.prototype._update = function(e, t) {
      for (var r, i = c = this.h[0], n = p = this.h[1], o = f = this.h[2], a = d = this.h[3], s = h = this.h[4], l = 0; l < 80; l++) var u = g(y(b(c, _(l, p, f, d), e[v[l] + t], (r = l) <= 15 ? 0 : r <= 31 ? 1518500249 : r <= 47 ? 1859775393 : r <= 63 ? 2400959708 : 2840853838), S[l]), h), c = h, h = d, d = y(f, 10), f = p, p = u, u = g(y(b(i, _(79 - l, n, o, a), e[w[l] + t], (r = l) <= 15 ? 1352829926 : r <= 31 ? 1548603684 : r <= 47 ? 1836072691 : r <= 63 ? 2053994217 : 0), E[l]), s), i = s, s = a, a = y(o, 10), o = n, n = u;
      u = m(this.h[1], f, a), this.h[1] = m(this.h[2], d, s), this.h[2] = m(this.h[3], h, i), this.h[3] = m(this.h[4], c, n), this.h[4] = m(this.h[0], p, o), this.h[0] = u;
    }, o.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h, "little") : i.split32(this.h, "little");
    };
    var v = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
      w = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
      S = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
      E = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
  }, { "./common": 129, "./utils": 139 }],
  132: [function(e, t, r) {
    "use strict";
    r.sha1 = e("./sha/1"), r.sha224 = e("./sha/224"), r.sha256 = e("./sha/256"), r.sha384 = e("./sha/384"), r.sha512 = e("./sha/512");
  }, { "./sha/1": 133, "./sha/224": 134, "./sha/256": 135, "./sha/384": 136, "./sha/512": 137 }],
  133: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), e = e("./common"), c = i.rotl32, h = i.sum32, d = i.sum32_5, f = e.ft_1,
      o = n.BlockHash, p = [1518500249, 1859775393, 2400959708, 3395469782];

    function a() {
      if (!(this instanceof a)) return new a;
      o.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80);
    }

    i.inherits(a, o), (t.exports = a).blockSize = 512, a.outSize = 160, a.hmacStrength = 80, a.padLength = 64, a.prototype._update = function(e, t) {
      for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
      for (; i < r.length; i++) r[i] = c(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
      for (var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], l = this.h[4], i = 0; i < r.length; i++) var u = ~~(i / 20), u = d(c(n, 5), f(u, o, a, s), l, r[i], p[u]), l = s, s = a, a = c(o, 30), o = n, n = u;
      this.h[0] = h(this.h[0], n), this.h[1] = h(this.h[1], o), this.h[2] = h(this.h[2], a), this.h[3] = h(this.h[3], s), this.h[4] = h(this.h[4], l);
    }, a.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
    };
  }, { "../common": 129, "../utils": 139, "./common": 138 }],
  134: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("./256");

    function o() {
      if (!(this instanceof o)) return new o;
      n.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428];
    }

    i.inherits(o, n), (t.exports = o).blockSize = 512, o.outSize = 224, o.hmacStrength = 192, o.padLength = 64, o.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h.slice(0, 7), "big") : i.split32(this.h.slice(0, 7), "big");
    };
  }, { "../utils": 139, "./256": 135 }],
  135: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), o = e("./common"), p = e("minimalistic-assert"), y = i.sum32,
      g = i.sum32_4, m = i.sum32_5, b = o.ch32, _ = o.maj32, v = o.s0_256, w = o.s1_256, S = o.g0_256, E = o.g1_256,
      a = n.BlockHash,
      s = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

    function l() {
      if (!(this instanceof l)) return new l;
      a.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = s, this.W = new Array(64);
    }

    i.inherits(l, a), (t.exports = l).blockSize = 512, l.outSize = 256, l.hmacStrength = 192, l.padLength = 64, l.prototype._update = function(e, t) {
      for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
      for (; i < r.length; i++) r[i] = g(E(r[i - 2]), r[i - 7], S(r[i - 15]), r[i - 16]);
      var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], l = this.h[4], u = this.h[5], c = this.h[6],
        h = this.h[7];
      for (p(this.k.length === r.length), i = 0; i < r.length; i++) var d = m(h, w(l), b(l, u, c), this.k[i], r[i]), f = y(v(n), _(n, o, a)), h = c, c = u, u = l, l = y(s, d), s = a, a = o, o = n, n = y(d, f);
      this.h[0] = y(this.h[0], n), this.h[1] = y(this.h[1], o), this.h[2] = y(this.h[2], a), this.h[3] = y(this.h[3], s), this.h[4] = y(this.h[4], l), this.h[5] = y(this.h[5], u), this.h[6] = y(this.h[6], c), this.h[7] = y(this.h[7], h);
    }, l.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
    };
  }, { "../common": 129, "../utils": 139, "./common": 138, "minimalistic-assert": 148 }],
  136: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("./512");

    function o() {
      if (!(this instanceof o)) return new o;
      n.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428];
    }

    i.inherits(o, n), (t.exports = o).blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, o.padLength = 128, o.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h.slice(0, 12), "big") : i.split32(this.h.slice(0, 12), "big");
    };
  }, { "../utils": 139, "./512": 137 }],
  137: [function(e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), I = e("minimalistic-assert"), R = i.rotr64_hi, L = i.rotr64_lo,
      d = i.shr64_hi, f = i.shr64_lo, D = i.sum64, B = i.sum64_hi, O = i.sum64_lo, p = i.sum64_4_hi, y = i.sum64_4_lo,
      U = i.sum64_5_hi, N = i.sum64_5_lo, o = n.BlockHash,
      a = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

    function s() {
      if (!(this instanceof s)) return new s;
      o.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = a, this.W = new Array(160);
    }

    i.inherits(s, o), (t.exports = s).blockSize = 1024, s.outSize = 512, s.hmacStrength = 192, s.padLength = 128, s.prototype._prepareBlock = function(e, t) {
      for (var r = this.W, i = 0; i < 32; i++) r[i] = e[t + i];
      for (; i < r.length; i += 2) {
        var n = function(e, t) {
          var r = R(e, t, 19), i = R(t, e, 29), t = d(e, t, 6), t = r ^ i ^ t;
          t < 0 && (t += 4294967296);
          return t;
        }(r[i - 4], r[i - 3]), o = function(e, t) {
          var r = L(e, t, 19), i = L(t, e, 29), t = f(e, t, 6), t = r ^ i ^ t;
          t < 0 && (t += 4294967296);
          return t;
        }(r[i - 4], r[i - 3]), a = r[i - 14], s = r[i - 13], l = function(e, t) {
          var r = R(e, t, 1), i = R(e, t, 8), t = d(e, t, 7), t = r ^ i ^ t;
          t < 0 && (t += 4294967296);
          return t;
        }(r[i - 30], r[i - 29]), u = function(e, t) {
          var r = L(e, t, 1), i = L(e, t, 8), t = f(e, t, 7), t = r ^ i ^ t;
          t < 0 && (t += 4294967296);
          return t;
        }(r[i - 30], r[i - 29]), c = r[i - 32], h = r[i - 31];
        r[i] = p(n, o, a, s, l, u, c, h), r[i + 1] = y(n, o, a, s, l, u, c, h);
      }
    }, s.prototype._update = function(e, t) {
      this._prepareBlock(e, t);
      var r = this.W, i = this.h[0], n = this.h[1], o = this.h[2], a = this.h[3], s = this.h[4], l = this.h[5],
        u = this.h[6], c = this.h[7], h = this.h[8], d = this.h[9], f = this.h[10], p = this.h[11], y = this.h[12],
        g = this.h[13], m = this.h[14], b = this.h[15];
      I(this.k.length === r.length);
      for (var _ = 0; _ < r.length; _ += 2) var v = m, w = b, S = function(e, t) {
        var r = R(e, t, 14), i = R(e, t, 18), e = R(t, e, 9), e = r ^ i ^ e;
        e < 0 && (e += 4294967296);
        return e;
      }(h, d), E = function(e, t) {
        var r = L(e, t, 14), i = L(e, t, 18), e = L(t, e, 9), e = r ^ i ^ e;
        e < 0 && (e += 4294967296);
        return e;
      }(h, d), T = function(e, t, r) {
        r = e & t ^ ~e & r;
        r < 0 && (r += 4294967296);
        return r;
      }(h, f, y), x = function(e, t, r) {
        r = e & t ^ ~e & r;
        r < 0 && (r += 4294967296);
        return r;
      }(d, p, g), M = this.k[_], k = this.k[_ + 1], P = r[_], C = r[_ + 1], A = U(v, w, S, E, T, x, M, k, P, C), P = N(v, w, S, E, T, x, M, k, P, C), v = function(e, t) {
        var r = R(e, t, 28), i = R(t, e, 2), e = R(t, e, 7), e = r ^ i ^ e;
        e < 0 && (e += 4294967296);
        return e;
      }(i, n), w = function(e, t) {
        var r = L(e, t, 28), i = L(t, e, 2), e = L(t, e, 7), e = r ^ i ^ e;
        e < 0 && (e += 4294967296);
        return e;
      }(i, n), S = function(e, t, r) {
        r = e & t ^ e & r ^ t & r;
        r < 0 && (r += 4294967296);
        return r;
      }(i, o, s), E = function(e, t, r) {
        r = e & t ^ e & r ^ t & r;
        r < 0 && (r += 4294967296);
        return r;
      }(n, a, l), C = B(v, w, S, E), E = O(v, w, S, E), m = y, b = g, y = f, g = p, f = h, p = d, h = B(u, c, A, P), d = O(c, c, A, P), u = s, c = l, s = o, l = a, o = i, a = n, i = B(A, P, C, E), n = O(A, P, C, E);
      D(this.h, 0, i, n), D(this.h, 2, o, a), D(this.h, 4, s, l), D(this.h, 6, u, c), D(this.h, 8, h, d), D(this.h, 10, f, p), D(this.h, 12, y, g), D(this.h, 14, m, b);
    }, s.prototype._digest = function(e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
    };
  }, { "../common": 129, "../utils": 139, "minimalistic-assert": 148 }],
  138: [function(e, t, r) {
    "use strict";
    var i = e("../utils").rotr32;

    function n(e, t, r) {
      return e & t ^ ~e & r;
    }

    function o(e, t, r) {
      return e & t ^ e & r ^ t & r;
    }

    function a(e, t, r) {
      return e ^ t ^ r;
    }

    r.ft_1 = function(e, t, r, i) {
      return 0 === e ? n(t, r, i) : 1 === e || 3 === e ? t ^ r ^ i : 2 === e ? o(t, r, i) : void 0;
    }, r.ch32 = n, r.maj32 = o, r.p32 = a, r.s0_256 = function(e) {
      return i(e, 2) ^ i(e, 13) ^ i(e, 22);
    }, r.s1_256 = function(e) {
      return i(e, 6) ^ i(e, 11) ^ i(e, 25);
    }, r.g0_256 = function(e) {
      return i(e, 7) ^ i(e, 18) ^ e >>> 3;
    }, r.g1_256 = function(e) {
      return i(e, 17) ^ i(e, 19) ^ e >>> 10;
    };
  }, { "../utils": 139 }],
  139: [function(e, t, r) {
    "use strict";
    var l = e("minimalistic-assert"), e = e("inherits");

    function o(e) {
      return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
    }

    function i(e) {
      return 1 === e.length ? "0" + e : e;
    }

    function a(e) {
      return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
    }

    r.inherits = e, r.toArray = function(e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r, i, n = [];
      if ("string" == typeof e) if (t) {
        if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), a = 0; a < e.length; a += 2) n.push(parseInt(e[a] + e[a + 1], 16));
      } else for (var o = 0, a = 0; a < e.length; a++) {
        var s = e.charCodeAt(a);
        s < 128 ? n[o++] = s : s < 2048 ? (n[o++] = s >> 6 | 192, n[o++] = 63 & s | 128) : (i = a, 55296 != (64512 & (r = e).charCodeAt(i)) || i < 0 || i + 1 >= r.length || 56320 != (64512 & r.charCodeAt(i + 1)) ? n[o++] = s >> 12 | 224 : (s = 65536 + ((1023 & s) << 10) + (1023 & e.charCodeAt(++a)), n[o++] = s >> 18 | 240, n[o++] = s >> 12 & 63 | 128), n[o++] = s >> 6 & 63 | 128, n[o++] = 63 & s | 128);
      } else for (a = 0; a < e.length; a++) n[a] = 0 | e[a];
      return n;
    }, r.toHex = function(e) {
      for (var t = "", r = 0; r < e.length; r++) t += i(e[r].toString(16));
      return t;
    }, r.htonl = o, r.toHex32 = function(e, t) {
      for (var r = "", i = 0; i < e.length; i++) {
        var n = e[i];
        r += a((n = "little" === t ? o(n) : n).toString(16));
      }
      return r;
    }, r.zero2 = i, r.zero8 = a, r.join32 = function(e, t, r, i) {
      l((r -= t) % 4 == 0);
      for (var n = new Array(r / 4), o = 0, a = t; o < n.length; o++, a += 4) {
        var s = "big" === i ? e[a] << 24 | e[a + 1] << 16 | e[a + 2] << 8 | e[a + 3] : e[a + 3] << 24 | e[a + 2] << 16 | e[a + 1] << 8 | e[a];
        n[o] = s >>> 0;
      }
      return n;
    }, r.split32 = function(e, t) {
      for (var r = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) {
        var o = e[i];
        "big" === t ? (r[n] = o >>> 24, r[n + 1] = o >>> 16 & 255, r[n + 2] = o >>> 8 & 255, r[n + 3] = 255 & o) : (r[n + 3] = o >>> 24, r[n + 2] = o >>> 16 & 255, r[n + 1] = o >>> 8 & 255, r[n] = 255 & o);
      }
      return r;
    }, r.rotr32 = function(e, t) {
      return e >>> t | e << 32 - t;
    }, r.rotl32 = function(e, t) {
      return e << t | e >>> 32 - t;
    }, r.sum32 = function(e, t) {
      return e + t >>> 0;
    }, r.sum32_3 = function(e, t, r) {
      return e + t + r >>> 0;
    }, r.sum32_4 = function(e, t, r, i) {
      return e + t + r + i >>> 0;
    }, r.sum32_5 = function(e, t, r, i, n) {
      return e + t + r + i + n >>> 0;
    }, r.sum64 = function(e, t, r, i) {
      var n = e[t], o = i + e[t + 1] >>> 0;
      e[t] = (o < i ? 1 : 0) + r + n >>> 0, e[t + 1] = o;
    }, r.sum64_hi = function(e, t, r, i) {
      return (t + i >>> 0 < t ? 1 : 0) + e + r >>> 0;
    }, r.sum64_lo = function(e, t, r, i) {
      return t + i >>> 0;
    }, r.sum64_4_hi = function(e, t, r, i, n, o, a, s) {
      var l = 0, u = t;
      return l += (u = u + i >>> 0) < t ? 1 : 0, l += (u = u + o >>> 0) < o ? 1 : 0, e + r + n + a + (l += (u = u + s >>> 0) < s ? 1 : 0) >>> 0;
    }, r.sum64_4_lo = function(e, t, r, i, n, o, a, s) {
      return t + i + o + s >>> 0;
    }, r.sum64_5_hi = function(e, t, r, i, n, o, a, s, l, u) {
      var c = 0, h = t;
      return c += (h = h + i >>> 0) < t ? 1 : 0, c += (h = h + o >>> 0) < o ? 1 : 0, c += (h = h + s >>> 0) < s ? 1 : 0, e + r + n + a + l + (c += (h = h + u >>> 0) < u ? 1 : 0) >>> 0;
    }, r.sum64_5_lo = function(e, t, r, i, n, o, a, s, l, u) {
      return t + i + o + s + u >>> 0;
    }, r.rotr64_hi = function(e, t, r) {
      return (t << 32 - r | e >>> r) >>> 0;
    }, r.rotr64_lo = function(e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0;
    }, r.shr64_hi = function(e, t, r) {
      return e >>> r;
    }, r.shr64_lo = function(e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0;
    };
  }, { inherits: 142, "minimalistic-assert": 148 }],
  140: [function(e, t, r) {
    "use strict";
    var i = e("hash.js"), o = e("minimalistic-crypto-utils"), n = e("minimalistic-assert");

    function a(e) {
      if (!(this instanceof a)) return new a(e);
      this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
      var t = o.toArray(e.entropy, e.entropyEnc || "hex"), r = o.toArray(e.nonce, e.nonceEnc || "hex"),
        e = o.toArray(e.pers, e.persEnc || "hex");
      n(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, e);
    }

    (t.exports = a).prototype._init = function(e, t, r) {
      r = e.concat(t).concat(r);
      this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
      for (var i = 0; i < this.V.length; i++) this.K[i] = 0, this.V[i] = 1;
      this._update(r), this._reseed = 1, this.reseedInterval = 281474976710656;
    }, a.prototype._hmac = function() {
      return new i.hmac(this.hash, this.K);
    }, a.prototype._update = function(e) {
      var t = this._hmac().update(this.V).update([0]);
      e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest());
    }, a.prototype.reseed = function(e, t, r, i) {
      "string" != typeof t && (i = r, r = t, t = null), e = o.toArray(e, t), r = o.toArray(r, i), n(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this._reseed = 1;
    }, a.prototype.generate = function(e, t, r, i) {
      if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
      "string" != typeof t && (i = r, r = t, t = null), r && (r = o.toArray(r, i || "hex"), this._update(r));
      for (var n = []; n.length < e;) this.V = this._hmac().update(this.V).digest(), n = n.concat(this.V);
      i = n.slice(0, e);
      return this._update(r), this._reseed++, o.encode(i, t);
    };
  }, { "hash.js": 128, "minimalistic-assert": 148, "minimalistic-crypto-utils": 149 }],
  141: [function(e, t, r) {
    r.read = function(e, t, r, i, n) {
      var o, a, s = 8 * n - i - 1, l = (1 << s) - 1, u = l >> 1, c = -7, h = r ? n - 1 : 0, d = r ? -1 : 1,
        r = e[t + h];
      for (h += d, o = r & (1 << -c) - 1, r >>= -c, c += s; 0 < c; o = 256 * o + e[t + h], h += d, c -= 8) ;
      for (a = o & (1 << -c) - 1, o >>= -c, c += i; 0 < c; a = 256 * a + e[t + h], h += d, c -= 8) ;
      if (0 === o) o = 1 - u; else {
        if (o === l) return a ? NaN : 1 / 0 * (r ? -1 : 1);
        a += Math.pow(2, i), o -= u;
      }
      return (r ? -1 : 1) * a * Math.pow(2, o - i);
    }, r.write = function(e, t, r, i, n, o) {
      var a, s, l = 8 * o - n - 1, u = (1 << l) - 1, c = u >> 1, h = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
        d = i ? 0 : o - 1, f = i ? 1 : -1, o = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
      for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), t * (i = Math.pow(2, -a)) < 1 && (a--, i *= 2), 2 <= (t += 1 <= a + c ? h / i : h * Math.pow(2, 1 - c)) * i && (a++, i /= 2), u <= a + c ? (s = 0, a = u) : 1 <= a + c ? (s = (t * i - 1) * Math.pow(2, n), a += c) : (s = t * Math.pow(2, c - 1) * Math.pow(2, n), a = 0)); 8 <= n; e[r + d] = 255 & s, d += f, s /= 256, n -= 8) ;
      for (a = a << n | s, l += n; 0 < l; e[r + d] = 255 & a, d += f, a /= 256, l -= 8) ;
      e[r + d - f] |= 128 * o;
    };
  }, {}],
  142: [function(e, t, r) {
    "function" == typeof Object.create ? t.exports = function(e, t) {
      t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : t.exports = function(e, t) {
      var r;
      t && (e.super_ = t, (r = function() {
      }).prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e);
    };
  }, {}],
  143: [function(e, t, r) {
    function i(e) {
      return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
    }

    t.exports = function(e) {
      return null != e && (i(e) || "function" == typeof (t = e).readFloatLE && "function" == typeof t.slice && i(t.slice(0, 0)) || !!e._isBuffer);
      var t;
    };
  }, {}],
  144: [function(e, t, r) {
    var i = {}.toString;
    t.exports = Array.isArray || function(e) {
      return "[object Array]" == i.call(e);
    };
  }, {}],
  145: [function(e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("hash-base"), o = e("safe-buffer").Buffer, a = new Array(16);

    function s() {
      n.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
    }

    function l(e, t) {
      return e << t | e >>> 32 - t;
    }

    function u(e, t, r, i, n, o, a) {
      return l(e + (t & r | ~t & i) + n + o | 0, a) + t | 0;
    }

    function c(e, t, r, i, n, o, a) {
      return l(e + (t & i | r & ~i) + n + o | 0, a) + t | 0;
    }

    function h(e, t, r, i, n, o, a) {
      return l(e + (t ^ r ^ i) + n + o | 0, a) + t | 0;
    }

    function d(e, t, r, i, n, o, a) {
      return l(e + (r ^ (t | ~i)) + n + o | 0, a) + t | 0;
    }

    i(s, n), s.prototype._update = function() {
      for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
      var r = u(r = this._a, o = this._b, n = this._c, i = this._d, e[0], 3614090360, 7),
        i = u(i, r, o, n, e[1], 3905402710, 12), n = u(n, i, r, o, e[2], 606105819, 17),
        o = u(o, n, i, r, e[3], 3250441966, 22);
      r = u(r, o, n, i, e[4], 4118548399, 7), i = u(i, r, o, n, e[5], 1200080426, 12), n = u(n, i, r, o, e[6], 2821735955, 17), o = u(o, n, i, r, e[7], 4249261313, 22), r = u(r, o, n, i, e[8], 1770035416, 7), i = u(i, r, o, n, e[9], 2336552879, 12), n = u(n, i, r, o, e[10], 4294925233, 17), o = u(o, n, i, r, e[11], 2304563134, 22), r = u(r, o, n, i, e[12], 1804603682, 7), i = u(i, r, o, n, e[13], 4254626195, 12), n = u(n, i, r, o, e[14], 2792965006, 17), r = c(r, o = u(o, n, i, r, e[15], 1236535329, 22), n, i, e[1], 4129170786, 5), i = c(i, r, o, n, e[6], 3225465664, 9), n = c(n, i, r, o, e[11], 643717713, 14), o = c(o, n, i, r, e[0], 3921069994, 20), r = c(r, o, n, i, e[5], 3593408605, 5), i = c(i, r, o, n, e[10], 38016083, 9), n = c(n, i, r, o, e[15], 3634488961, 14), o = c(o, n, i, r, e[4], 3889429448, 20), r = c(r, o, n, i, e[9], 568446438, 5), i = c(i, r, o, n, e[14], 3275163606, 9), n = c(n, i, r, o, e[3], 4107603335, 14), o = c(o, n, i, r, e[8], 1163531501, 20), r = c(r, o, n, i, e[13], 2850285829, 5), i = c(i, r, o, n, e[2], 4243563512, 9), n = c(n, i, r, o, e[7], 1735328473, 14), r = h(r, o = c(o, n, i, r, e[12], 2368359562, 20), n, i, e[5], 4294588738, 4), i = h(i, r, o, n, e[8], 2272392833, 11), n = h(n, i, r, o, e[11], 1839030562, 16), o = h(o, n, i, r, e[14], 4259657740, 23), r = h(r, o, n, i, e[1], 2763975236, 4), i = h(i, r, o, n, e[4], 1272893353, 11), n = h(n, i, r, o, e[7], 4139469664, 16), o = h(o, n, i, r, e[10], 3200236656, 23), r = h(r, o, n, i, e[13], 681279174, 4), i = h(i, r, o, n, e[0], 3936430074, 11), n = h(n, i, r, o, e[3], 3572445317, 16), o = h(o, n, i, r, e[6], 76029189, 23), r = h(r, o, n, i, e[9], 3654602809, 4), i = h(i, r, o, n, e[12], 3873151461, 11), n = h(n, i, r, o, e[15], 530742520, 16), r = d(r, o = h(o, n, i, r, e[2], 3299628645, 23), n, i, e[0], 4096336452, 6), i = d(i, r, o, n, e[7], 1126891415, 10), n = d(n, i, r, o, e[14], 2878612391, 15), o = d(o, n, i, r, e[5], 4237533241, 21), r = d(r, o, n, i, e[12], 1700485571, 6), i = d(i, r, o, n, e[3], 2399980690, 10), n = d(n, i, r, o, e[10], 4293915773, 15), o = d(o, n, i, r, e[1], 2240044497, 21), r = d(r, o, n, i, e[8], 1873313359, 6), i = d(i, r, o, n, e[15], 4264355552, 10), n = d(n, i, r, o, e[6], 2734768916, 15), o = d(o, n, i, r, e[13], 1309151649, 21), r = d(r, o, n, i, e[4], 4149444226, 6), i = d(i, r, o, n, e[11], 3174756917, 10), n = d(n, i, r, o, e[2], 718787259, 15), o = d(o, n, i, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + o | 0, this._c = this._c + n | 0, this._d = this._d + i | 0;
    }, s.prototype._digest = function() {
      this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = o.allocUnsafe(16);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e;
    }, t.exports = s;
  }, { "hash-base": 111, inherits: 142, "safe-buffer": 187 }],
  146: [function(e, t, r) {
    var f = e("bn.js"), i = e("brorand");

    function n(e) {
      this.rand = e || new i.Rand;
    }

    (t.exports = n).create = function(e) {
      return new n(e);
    }, n.prototype._randbelow = function(e) {
      var t = e.bitLength(), r = Math.ceil(t / 8);
      do {
        var i = new f(this.rand.generate(r));
      } while (0 <= i.cmp(e));
      return i;
    }, n.prototype._randrange = function(e, t) {
      t = t.sub(e);
      return e.add(this._randbelow(t));
    }, n.prototype.test = function(e, t, r) {
      var i = e.bitLength(), n = f.mont(e), o = new f(1).toRed(n);
      t = t || Math.max(1, i / 48 | 0);
      for (var a = e.subn(1), s = 0; !a.testn(s); s++) ;
      for (var l = e.shrn(s), u = a.toRed(n); 0 < t; t--) {
        var c = this._randrange(new f(2), a);
        r && r(c);
        var h = c.toRed(n).redPow(l);
        if (0 !== h.cmp(o) && 0 !== h.cmp(u)) {
          for (var d = 1; d < s; d++) {
            if (0 === (h = h.redSqr()).cmp(o)) return !1;
            if (0 === h.cmp(u)) break;
          }
          if (d === s) return !1;
        }
      }
      return !0;
    }, n.prototype.getDivisor = function(e, t) {
      var r = e.bitLength(), i = f.mont(e), n = new f(1).toRed(i);
      t = t || Math.max(1, r / 48 | 0);
      for (var o = e.subn(1), a = 0; !o.testn(a); a++) ;
      for (var s = e.shrn(a), l = o.toRed(i); 0 < t; t--) {
        var u = this._randrange(new f(2), o), c = e.gcd(u);
        if (0 !== c.cmpn(1)) return c;
        var h = u.toRed(i).redPow(s);
        if (0 !== h.cmp(n) && 0 !== h.cmp(l)) {
          for (var d = 1; d < a; d++) {
            if (0 === (h = h.redSqr()).cmp(n)) return h.fromRed().subn(1).gcd(e);
            if (0 === h.cmp(l)) break;
          }
          if (d === a) return (h = h.redSqr()).fromRed().subn(1).gcd(e);
        }
      }
      return !1;
    };
  }, { "bn.js": 147, brorand: 18 }],
  147: [function(e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, { buffer: 19, dup: 15 }],
  148: [function(e, t, r) {
    function i(e, t) {
      if (!e) throw new Error(t || "Assertion failed");
    }

    (t.exports = i).equal = function(e, t, r) {
      if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t);
    };
  }, {}],
  149: [function(e, t, r) {
    "use strict";

    function i(e) {
      return 1 === e.length ? "0" + e : e;
    }

    function n(e) {
      for (var t = "", r = 0; r < e.length; r++) t += i(e[r].toString(16));
      return t;
    }

    r.toArray = function(e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r = [];
      if ("string" != typeof e) {
        for (var i = 0; i < e.length; i++) r[i] = 0 | e[i];
        return r;
      }
      if ("hex" === t) {
        (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
        for (i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16));
      } else for (i = 0; i < e.length; i++) {
        var n = e.charCodeAt(i), o = n >> 8, n = 255 & n;
        o ? r.push(o, n) : r.push(n);
      }
      return r;
    }, r.zero2 = i, r.toHex = n, r.encode = function(e, t) {
      return "hex" === t ? n(e) : e;
    };
  }, {}],
  150: [function(e, t, r) {
    t.exports = {
      "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
      "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
      "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
      "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
      "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
      "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
      "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
      "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
      "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
      "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
      "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
      "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
    };
  }, {}],
  151: [function(e, t, r) {
    "use strict";
    var i = e("asn1.js");
    r.certificate = e("./certificate");
    e = i.define("RSAPrivateKey", function() {
      this.seq().obj(this.key("version")["int"](), this.key("modulus")["int"](), this.key("publicExponent")["int"](), this.key("privateExponent")["int"](), this.key("prime1")["int"](), this.key("prime2")["int"](), this.key("exponent1")["int"](), this.key("exponent2")["int"](), this.key("coefficient")["int"]());
    });
    r.RSAPrivateKey = e;
    e = i.define("RSAPublicKey", function() {
      this.seq().obj(this.key("modulus")["int"](), this.key("publicExponent")["int"]());
    });
    r.RSAPublicKey = e;
    e = i.define("SubjectPublicKeyInfo", function() {
      this.seq().obj(this.key("algorithm").use(n), this.key("subjectPublicKey").bitstr());
    });
    r.PublicKey = e;
    var n = i.define("AlgorithmIdentifier", function() {
      this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"]()).optional());
    }), e = i.define("PrivateKeyInfo", function() {
      this.seq().obj(this.key("version")["int"](), this.key("algorithm").use(n), this.key("subjectPrivateKey").octstr());
    });
    r.PrivateKey = e;
    e = i.define("EncryptedPrivateKeyInfo", function() {
      this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters")["int"]())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
    });
    r.EncryptedPrivateKey = e;
    e = i.define("DSAPrivateKey", function() {
      this.seq().obj(this.key("version")["int"](), this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"](), this.key("pub_key")["int"](), this.key("priv_key")["int"]());
    });
    r.DSAPrivateKey = e, r.DSAparam = i.define("DSAparam", function() {
      this["int"]();
    });
    e = i.define("ECPrivateKey", function() {
      this.seq().obj(this.key("version")["int"](), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(o), this.key("publicKey").optional().explicit(1).bitstr());
    });
    r.ECPrivateKey = e;
    var o = i.define("ECParameters", function() {
      this.choice({ namedCurve: this.objid() });
    });
    r.signature = i.define("signature", function() {
      this.seq().obj(this.key("r")["int"](), this.key("s")["int"]());
    });
  }, { "./certificate": 152, "asn1.js": 1 }],
  152: [function(e, t, r) {
    "use strict";
    var e = e("asn1.js"), i = e.define("Time", function() {
      this.choice({ utcTime: this.utctime(), generalTime: this.gentime() });
    }), n = e.define("AttributeTypeValue", function() {
      this.seq().obj(this.key("type").objid(), this.key("value").any());
    }), o = e.define("AlgorithmIdentifier", function() {
      this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional());
    }), a = e.define("SubjectPublicKeyInfo", function() {
      this.seq().obj(this.key("algorithm").use(o), this.key("subjectPublicKey").bitstr());
    }), s = e.define("RelativeDistinguishedName", function() {
      this.setof(n);
    }), l = e.define("RDNSequence", function() {
      this.seqof(s);
    }), u = e.define("Name", function() {
      this.choice({ rdnSequence: this.use(l) });
    }), c = e.define("Validity", function() {
      this.seq().obj(this.key("notBefore").use(i), this.key("notAfter").use(i));
    }), h = e.define("Extension", function() {
      this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
    }), d = e.define("TBSCertificate", function() {
      this.seq().obj(this.key("version").explicit(0)["int"]().optional(), this.key("serialNumber")["int"](), this.key("signature").use(o), this.key("issuer").use(u), this.key("validity").use(c), this.key("subject").use(u), this.key("subjectPublicKeyInfo").use(a), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(h).optional());
    }), e = e.define("X509Certificate", function() {
      this.seq().obj(this.key("tbsCertificate").use(d), this.key("signatureAlgorithm").use(o), this.key("signatureValue").bitstr());
    });
    t.exports = e;
  }, { "asn1.js": 1 }],
  153: [function(e, t, r) {
    var s = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m,
      l = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,
      u = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, c = e("evp_bytestokey"),
      h = e("browserify-aes"), d = e("safe-buffer").Buffer;
    t.exports = function(e, t) {
      var r, i, n, o = e.toString(), a = o.match(s);
      return n = a ? (r = "aes" + a[1], i = d.from(a[2], "hex"), e = d.from(a[3].replace(/[\r\n]/g, ""), "base64"), t = c(t, i.slice(0, 8), parseInt(a[1], 10)).key, a = [], i = h.createDecipheriv(r, t, i), a.push(i.update(e)), a.push(i["final"]()), d.concat(a)) : (n = o.match(u), d.from(n[2].replace(/[\r\n]/g, ""), "base64")), {
        tag: o.match(l)[1],
        data: n
      };
    };
  }, { "browserify-aes": 22, evp_bytestokey: 109, "safe-buffer": 187 }],
  154: [function(e, t, r) {
    var f = e("./asn1"), p = e("./aesid.json"), y = e("./fixProc"), g = e("browserify-aes"), m = e("pbkdf2"),
      b = e("safe-buffer").Buffer;

    function i(e) {
      var t;
      "object" != typeof e || b.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = b.from(e));
      var r, i, n, o, a, s, l, u, c, e = y(e, t), h = e.tag, d = e.data;
      switch (h) {
        case"CERTIFICATE":
          i = f.certificate.decode(d, "der").tbsCertificate.subjectPublicKeyInfo;
        case"PUBLIC KEY":
          switch (r = (i = i || f.PublicKey.decode(d, "der")).algorithm.algorithm.join(".")) {
            case"1.2.840.113549.1.1.1":
              return f.RSAPublicKey.decode(i.subjectPublicKey.data, "der");
            case"1.2.840.10045.2.1":
              return i.subjectPrivateKey = i.subjectPublicKey, { type: "ec", data: i };
            case"1.2.840.10040.4.1":
              return i.algorithm.params.pub_key = f.DSAparam.decode(i.subjectPublicKey.data, "der"), {
                type: "dsa",
                data: i.algorithm.params
              };
            default:
              throw new Error("unknown key id " + r);
          }
        case"ENCRYPTED PRIVATE KEY":
          d = f.EncryptedPrivateKey.decode(d, "der"), o = t, a = (n = d).algorithm.decrypt.kde.kdeparams.salt, s = parseInt(n.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), l = p[n.algorithm.decrypt.cipher.algo.join(".")], u = n.algorithm.decrypt.cipher.iv, c = n.subjectPrivateKey, n = parseInt(l.split("-")[1], 10) / 8, n = m.pbkdf2Sync(o, a, s, n, "sha1"), n = g.createDecipheriv(l, n, u), (u = []).push(n.update(c)), u.push(n["final"]()), d = b.concat(u);
        case"PRIVATE KEY":
          switch (r = (i = f.PrivateKey.decode(d, "der")).algorithm.algorithm.join(".")) {
            case"1.2.840.113549.1.1.1":
              return f.RSAPrivateKey.decode(i.subjectPrivateKey, "der");
            case"1.2.840.10045.2.1":
              return {
                curve: i.algorithm.curve,
                privateKey: f.ECPrivateKey.decode(i.subjectPrivateKey, "der").privateKey
              };
            case"1.2.840.10040.4.1":
              return i.algorithm.params.priv_key = f.DSAparam.decode(i.subjectPrivateKey, "der"), {
                type: "dsa",
                params: i.algorithm.params
              };
            default:
              throw new Error("unknown key id " + r);
          }
        case"RSA PUBLIC KEY":
          return f.RSAPublicKey.decode(d, "der");
        case"RSA PRIVATE KEY":
          return f.RSAPrivateKey.decode(d, "der");
        case"DSA PRIVATE KEY":
          return { type: "dsa", params: f.DSAPrivateKey.decode(d, "der") };
        case"EC PRIVATE KEY":
          return { curve: (d = f.ECPrivateKey.decode(d, "der")).parameters.value, privateKey: d.privateKey };
        default:
          throw new Error("unknown key type " + h);
      }
    }

    (t.exports = i).signature = f.signature;
  }, { "./aesid.json": 150, "./asn1": 151, "./fixProc": 153, "browserify-aes": 22, pbkdf2: 155, "safe-buffer": 187 }],
  155: [function(e, t, r) {
    r.pbkdf2 = e("./lib/async"), r.pbkdf2Sync = e("./lib/sync");
  }, { "./lib/async": 156, "./lib/sync": 159 }],
  156: [function(t, r, e) {
    !function(v) {
      !function() {
        var u, e, c = t("safe-buffer").Buffer, h = t("./precondition"), d = t("./default-encoding"), f = t("./sync"),
          p = t("./to-buffer"), y = v.crypto && v.crypto.subtle, g = {
            sha: "SHA-1",
            "sha-1": "SHA-1",
            sha1: "SHA-1",
            sha256: "SHA-256",
            "sha-256": "SHA-256",
            sha384: "SHA-384",
            "sha-384": "SHA-384",
            "sha-512": "SHA-512",
            sha512: "SHA-512"
          }, m = [];

        function b() {
          return e = e || (v.process && v.process.nextTick ? v.process.nextTick : v.queueMicrotask || v.setImmediate || v.setTimeout);
        }

        function _(e, t, r, i, n) {
          return y.importKey("raw", e, { name: "PBKDF2" }, !1, ["deriveBits"]).then(function(e) {
            return y.deriveBits({ name: "PBKDF2", salt: t, iterations: r, hash: { name: n } }, e, i << 3);
          }).then(function(e) {
            return c.from(e);
          });
        }

        r.exports = function(t, r, i, n, o, a) {
          "function" == typeof o && (a = o, o = void 0);
          var e, s, l = g[(o = o || "sha1").toLowerCase()];
          if (l && "function" == typeof v.Promise) {
            if (h(i, n), t = p(t, d, "Password"), r = p(r, d, "Salt"), "function" != typeof a) throw new Error("No callback provided to pbkdf2");
            e = function(e) {
              if (v.process && !v.process.browser) return Promise.resolve(!1);
              if (!y || !y.importKey || !y.deriveBits) return Promise.resolve(!1);
              if (void 0 !== m[e]) return m[e];
              var t = _(u = u || c.alloc(8), u, 10, 128, e).then(function() {
                return !0;
              })["catch"](function() {
                return !1;
              });
              return m[e] = t;
            }(l).then(function(e) {
              return e ? _(t, r, i, n, l) : f(t, r, i, n, o);
            }), s = a, e.then(function(e) {
              b()(function() {
                s(null, e);
              });
            }, function(e) {
              b()(function() {
                s(e);
              });
            });
          } else b()(function() {
            var e;
            try {
              e = f(t, r, i, n, o);
            } catch (e) {
              return a(e);
            }
            a(null, e);
          });
        };
      }.call(this);
    }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { "./default-encoding": 157, "./precondition": 158, "./sync": 159, "./to-buffer": 160, "safe-buffer": 187 }],
  157: [function(e, i, t) {
    !function(t, r) {
      !function() {
        var e;
        e = r.process && r.process.browser || !r.process || !r.process.version || 6 <= parseInt(t.version.split(".")[0].slice(1), 10) ? "utf-8" : "binary", i.exports = e;
      }.call(this);
    }.call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { _process: 162 }],
  158: [function(e, t, r) {
    var i = Math.pow(2, 30) - 1;
    t.exports = function(e, t) {
      if ("number" != typeof e) throw new TypeError("Iterations not a number");
      if (e < 0) throw new TypeError("Bad iterations");
      if ("number" != typeof t) throw new TypeError("Key length not a number");
      if (t < 0 || i < t || t != t) throw new TypeError("Bad key length");
    };
  }, {}],
  159: [function(e, t, r) {
    var u = e("create-hash/md5"), c = e("ripemd160"), h = e("sha.js"), g = e("safe-buffer").Buffer,
      m = e("./precondition"), b = e("./default-encoding"), _ = e("./to-buffer"), d = g.alloc(128),
      v = { md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, rmd160: 20, ripemd160: 20 };

    function w(e, t, r) {
      var i, n = "rmd160" === (i = e) || "ripemd160" === i ? function(e) {
        return (new c).update(e).digest();
      } : "md5" === i ? u : function(e) {
        return h(i).update(e).digest();
      }, o = "sha512" === e || "sha384" === e ? 128 : 64;
      t.length > o ? t = n(t) : t.length < o && (t = g.concat([t, d], o));
      for (var a = g.allocUnsafe(o + v[e]), s = g.allocUnsafe(o + v[e]), l = 0; l < o; l++) a[l] = 54 ^ t[l], s[l] = 92 ^ t[l];
      r = g.allocUnsafe(o + r + 4);
      a.copy(r, 0, 0, o), this.ipad1 = r, this.ipad2 = a, this.opad = s, this.alg = e, this.blocksize = o, this.hash = n, this.size = v[e];
    }

    w.prototype.run = function(e, t) {
      return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad);
    }, t.exports = function(e, t, r, i, n) {
      m(r, i);
      var o = new w(n = n || "sha1", e = _(e, b, "Password"), (t = _(t, b, "Salt")).length), a = g.allocUnsafe(i),
        s = g.allocUnsafe(t.length + 4);
      t.copy(s, 0, 0, t.length);
      for (var l = 0, u = v[n], c = Math.ceil(i / u), h = 1; h <= c; h++) {
        s.writeUInt32BE(h, t.length);
        for (var d = o.run(s, o.ipad1), f = d, p = 1; p < r; p++) for (var f = o.run(f, o.ipad2), y = 0; y < u; y++) d[y] ^= f[y];
        d.copy(a, l), l += u;
      }
      return a;
    };
  }, {
    "./default-encoding": 157,
    "./precondition": 158,
    "./to-buffer": 160,
    "create-hash/md5": 70,
    ripemd160: 186,
    "safe-buffer": 187,
    "sha.js": 190
  }],
  160: [function(e, t, r) {
    var i = e("safe-buffer").Buffer;
    t.exports = function(e, t, r) {
      if (i.isBuffer(e)) return e;
      if ("string" == typeof e) return i.from(e, t);
      if (ArrayBuffer.isView(e)) return i.from(e.buffer);
      throw new TypeError(r + " must be a string, a Buffer, a typed array or a DataView");
    };
  }, { "safe-buffer": 187 }],
  161: [function(e, t, r) {
    !function(s) {
      !function() {
        "use strict";
        void 0 === s || !s.version || 0 === s.version.indexOf("v0.") || 0 === s.version.indexOf("v1.") && 0 !== s.version.indexOf("v1.8.") ? t.exports = {
          nextTick: function(e, t, r, i) {
            if ("function" != typeof e) throw new TypeError("\"callback\" argument must be a function");
            var n, o, a = arguments.length;
            switch (a) {
              case 0:
              case 1:
                return s.nextTick(e);
              case 2:
                return s.nextTick(function() {
                  e.call(null, t);
                });
              case 3:
                return s.nextTick(function() {
                  e.call(null, t, r);
                });
              case 4:
                return s.nextTick(function() {
                  e.call(null, t, r, i);
                });
              default:
                for (n = new Array(a - 1), o = 0; o < n.length;) n[o++] = arguments[o];
                return s.nextTick(function() {
                  e.apply(null, n);
                });
            }
          }
        } : t.exports = s;
      }.call(this);
    }.call(this, e("_process"));
  }, { _process: 162 }],
  162: [function(e, t, r) {
    var i, n, t = t.exports = {};

    function o() {
      throw new Error("setTimeout has not been defined");
    }

    function a() {
      throw new Error("clearTimeout has not been defined");
    }

    function s(t) {
      if (i === setTimeout) return setTimeout(t, 0);
      if ((i === o || !i) && setTimeout) return i = setTimeout, setTimeout(t, 0);
      try {
        return i(t, 0);
      } catch (e) {
        try {
          return i.call(null, t, 0);
        } catch (e) {
          return i.call(this, t, 0);
        }
      }
    }

    !function() {
      try {
        i = "function" == typeof setTimeout ? setTimeout : o;
      } catch (e) {
        i = o;
      }
      try {
        n = "function" == typeof clearTimeout ? clearTimeout : a;
      } catch (e) {
        n = a;
      }
    }();
    var l, u = [], c = !1, h = -1;

    function d() {
      c && l && (c = !1, l.length ? u = l.concat(u) : h = -1, u.length && f());
    }

    function f() {
      if (!c) {
        var e = s(d);
        c = !0;
        for (var t = u.length; t;) {
          for (l = u, u = []; ++h < t;) l && l[h].run();
          h = -1, t = u.length;
        }
        l = null, c = !1, function(t) {
          if (n === clearTimeout) return clearTimeout(t);
          if ((n === a || !n) && clearTimeout) return n = clearTimeout, clearTimeout(t);
          try {
            n(t);
          } catch (e) {
            try {
              return n.call(null, t);
            } catch (e) {
              return n.call(this, t);
            }
          }
        }(e);
      }
    }

    function p(e, t) {
      this.fun = e, this.array = t;
    }

    function y() {
    }

    t.nextTick = function(e) {
      var t = new Array(arguments.length - 1);
      if (1 < arguments.length) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
      u.push(new p(e, t)), 1 !== u.length || c || s(f);
    }, p.prototype.run = function() {
      this.fun.apply(null, this.array);
    }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {}, t.on = y, t.addListener = y, t.once = y, t.off = y, t.removeListener = y, t.removeAllListeners = y, t.emit = y, t.prependListener = y, t.prependOnceListener = y, t.listeners = function(e) {
      return [];
    }, t.binding = function(e) {
      throw new Error("process.binding is not supported");
    }, t.cwd = function() {
      return "/";
    }, t.chdir = function(e) {
      throw new Error("process.chdir is not supported");
    }, t.umask = function() {
      return 0;
    };
  }, {}],
  163: [function(e, t, r) {
    r.publicEncrypt = e("./publicEncrypt"), r.privateDecrypt = e("./privateDecrypt"), r.privateEncrypt = function(e, t) {
      return r.publicEncrypt(e, t, !0);
    }, r.publicDecrypt = function(e, t) {
      return r.privateDecrypt(e, t, !0);
    };
  }, { "./privateDecrypt": 166, "./publicEncrypt": 167 }],
  164: [function(e, t, r) {
    var a = e("create-hash"), s = e("safe-buffer").Buffer;
    t.exports = function(e, t) {
      for (var r, i, n = s.alloc(0), o = 0; n.length < t;) r = o++, i = void 0, (i = s.allocUnsafe(4)).writeUInt32BE(r, 0), i = i, n = s.concat([n, a("sha1").update(e).update(i).digest()]);
      return n.slice(0, t);
    };
  }, { "create-hash": 69, "safe-buffer": 187 }],
  165: [function(e, t, r) {
    arguments[4][15][0].apply(r, arguments);
  }, { buffer: 19, dup: 15 }],
  166: [function(e, t, r) {
    var a = e("parse-asn1"), s = e("./mgf"), l = e("./xor"), u = e("bn.js"), c = e("browserify-rsa"),
      h = e("create-hash"), d = e("./withPublic"), f = e("safe-buffer").Buffer;
    t.exports = function(e, t, r) {
      var i = e.padding || (r ? 1 : 4), n = a(e), o = n.modulus.byteLength();
      if (t.length > o || 0 <= new u(t).cmp(n.modulus)) throw new Error("decryption error");
      e = r ? d(new u(t), n) : c(t, n), t = f.alloc(o - e.length);
      if (e = f.concat([t, e], o), 4 === i) return function(e, t) {
        var r = e.modulus.byteLength(), i = h("sha1").update(f.alloc(0)).digest(), n = i.length;
        if (0 !== t[0]) throw new Error("decryption error");
        var e = t.slice(1, n + 1), t = t.slice(n + 1), e = l(e, s(t, n)), o = l(t, s(e, r - n - 1));
        if (function(e, t) {
          e = f.from(e), t = f.from(t);
          var r = 0, i = e.length;
          e.length !== t.length && (r++, i = Math.min(e.length, t.length));
          var n = -1;
          for (; ++n < i;) r += e[n] ^ t[n];
          return r;
        }(i, o.slice(0, n))) throw new Error("decryption error");
        var a = n;
        for (; 0 === o[a];) a++;
        if (1 === o[a++]) return o.slice(a);
        throw new Error("decryption error");
      }(n, e);
      if (1 === i) return function(e, t) {
        var r = e.slice(0, 2), i = 2, n = 0;
        for (; 0 !== e[i++];) if (i >= e.length) {
          n++;
          break;
        }
        var o = e.slice(2, i - 1);
        ("0002" !== r.toString("hex") && !t || "0001" !== r.toString("hex") && t) && n++;
        o.length < 8 && n++;
        if (n) throw new Error("decryption error");
        return e.slice(i);
      }(e, r);
      if (3 === i) return e;
      throw new Error("unknown padding");
    };
  }, {
    "./mgf": 164,
    "./withPublic": 168,
    "./xor": 169,
    "bn.js": 165,
    "browserify-rsa": 40,
    "create-hash": 69,
    "parse-asn1": 154,
    "safe-buffer": 187
  }],
  167: [function(e, t, r) {
    var o = e("parse-asn1"), s = e("randombytes"), l = e("create-hash"), u = e("./mgf"), c = e("./xor"), h = e("bn.js"),
      a = e("./withPublic"), d = e("browserify-rsa"), f = e("safe-buffer").Buffer;
    t.exports = function(e, t, r) {
      var i, n = e.padding || (r ? 1 : 4), e = o(e);
      if (4 === n) i = function(e, t) {
        var r = e.modulus.byteLength(), i = t.length, n = l("sha1").update(f.alloc(0)).digest(), o = n.length,
          a = 2 * o;
        if (r - a - 2 < i) throw new Error("message too long");
        e = f.alloc(r - i - a - 2), i = r - o - 1, a = s(o), i = c(f.concat([n, e, f.alloc(1, 1), t], i), u(a, i)), o = c(a, u(i, o));
        return new h(f.concat([f.alloc(1), o, i], r));
      }(e, t); else if (1 === n) i = function(e, t, r) {
        var i = t.length, e = e.modulus.byteLength();
        if (e - 11 < i) throw new Error("message too long");
        i = r ? f.alloc(e - i - 3, 255) : function(e) {
          var t, r = f.allocUnsafe(e), i = 0, n = s(2 * e), o = 0;
          for (; i < e;) o === n.length && (n = s(2 * e), o = 0), (t = n[o++]) && (r[i++] = t);
          return r;
        }(e - i - 3);
        return new h(f.concat([f.from([0, r ? 1 : 2]), i, f.alloc(1), t], e));
      }(e, t, r); else {
        if (3 !== n) throw new Error("unknown padding");
        if (0 <= (i = new h(t)).cmp(e.modulus)) throw new Error("data too long for modulus");
      }
      return (r ? d : a)(i, e);
    };
  }, {
    "./mgf": 164,
    "./withPublic": 168,
    "./xor": 169,
    "bn.js": 165,
    "browserify-rsa": 40,
    "create-hash": 69,
    "parse-asn1": 154,
    randombytes: 170,
    "safe-buffer": 187
  }],
  168: [function(e, t, r) {
    var i = e("bn.js"), n = e("safe-buffer").Buffer;
    t.exports = function(e, t) {
      return n.from(e.toRed(i.mont(t.modulus)).redPow(new i(t.publicExponent)).fromRed().toArray());
    };
  }, { "bn.js": 165, "safe-buffer": 187 }],
  169: [function(e, t, r) {
    t.exports = function(e, t) {
      for (var r = e.length, i = -1; ++i < r;) e[i] ^= t[i];
      return e;
    };
  }, {}],
  170: [function(t, r, e) {
    !function(a, e) {
      !function() {
        "use strict";
        var n = t("safe-buffer").Buffer, o = e.crypto || e.msCrypto;
        o && o.getRandomValues ? r.exports = function(e, t) {
          if (4294967295 < e) throw new RangeError("requested too many random bytes");
          var r = n.allocUnsafe(e);
          if (0 < e) if (65536 < e) for (var i = 0; i < e; i += 65536) o.getRandomValues(r.slice(i, i + 65536)); else o.getRandomValues(r);
          return "function" != typeof t ? r : a.nextTick(function() {
            t(null, r);
          });
        } : r.exports = function() {
          throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
        };
      }.call(this);
    }.call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { _process: 162, "safe-buffer": 187 }],
  171: [function(r, e, f) {
    !function(h, d) {
      !function() {
        "use strict";

        function e() {
          throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
        }

        var t = r("safe-buffer"), o = r("randombytes"), n = t.Buffer, i = t.kMaxLength, a = d.crypto || d.msCrypto,
          s = Math.pow(2, 32) - 1;

        function l(e, t) {
          if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
          if (s < e || e < 0) throw new TypeError("offset must be a uint32");
          if (i < e || t < e) throw new RangeError("offset out of range");
        }

        function u(e, t, r) {
          if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
          if (s < e || e < 0) throw new TypeError("size must be a uint32");
          if (r < e + t || i < e) throw new RangeError("buffer too small");
        }

        function c(r, i, e, n) {
          if (h.browser) {
            var t = r.buffer, t = new Uint8Array(t, i, e);
            return a.getRandomValues(t), n ? void h.nextTick(function() {
              n(null, r);
            }) : r;
          }
          if (!n) return o(e).copy(r, i), r;
          o(e, function(e, t) {
            return e ? n(e) : (t.copy(r, i), void n(null, r));
          });
        }

        a && a.getRandomValues || !h.browser ? (f.randomFill = function(e, t, r, i) {
          if (!(n.isBuffer(e) || e instanceof d.Uint8Array)) throw new TypeError("\"buf\" argument must be a Buffer or Uint8Array");
          if ("function" == typeof t) i = t, t = 0, r = e.length; else if ("function" == typeof r) i = r, r = e.length - t; else if ("function" != typeof i) throw new TypeError("\"cb\" argument must be a function");
          return l(t, e.length), u(r, t, e.length), c(e, t, r, i);
        }, f.randomFillSync = function(e, t, r) {
          void 0 === t && (t = 0);
          if (!(n.isBuffer(e) || e instanceof d.Uint8Array)) throw new TypeError("\"buf\" argument must be a Buffer or Uint8Array");
          l(t, e.length), void 0 === r && (r = e.length - t);
          return u(r, t, e.length), c(e, t, r);
        }) : (f.randomFill = e, f.randomFillSync = e);
      }.call(this);
    }.call(this, r("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { _process: 162, randombytes: 170, "safe-buffer": 187 }],
  172: [function(e, t, r) {
    t.exports = e("./lib/_stream_duplex.js");
  }, { "./lib/_stream_duplex.js": 173 }],
  173: [function(e, t, r) {
    "use strict";
    var i = e("process-nextick-args"), n = Object.keys || function(e) {
      var t, r = [];
      for (t in e) r.push(t);
      return r;
    };
    t.exports = c;
    t = Object.create(e("core-util-is"));
    t.inherits = e("inherits");
    var o = e("./_stream_readable"), a = e("./_stream_writable");
    t.inherits(c, o);
    for (var s = n(a.prototype), l = 0; l < s.length; l++) {
      var u = s[l];
      c.prototype[u] || (c.prototype[u] = a.prototype[u]);
    }

    function c(e) {
      if (!(this instanceof c)) return new c(e);
      o.call(this, e), a.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", h);
    }

    function h() {
      this.allowHalfOpen || this._writableState.ended || i.nextTick(d, this);
    }

    function d(e) {
      e.end();
    }

    Object.defineProperty(c.prototype, "writableHighWaterMark", {
      enumerable: !1, get: function() {
        return this._writableState.highWaterMark;
      }
    }), Object.defineProperty(c.prototype, "destroyed", {
      get: function() {
        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
      }, set: function(e) {
        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
      }
    }), c.prototype._destroy = function(e, t) {
      this.push(null), this.end(), i.nextTick(t, e);
    };
  }, {
    "./_stream_readable": 175,
    "./_stream_writable": 177,
    "core-util-is": 66,
    inherits: 142,
    "process-nextick-args": 161
  }],
  174: [function(e, t, r) {
    "use strict";
    t.exports = n;
    var i = e("./_stream_transform"), t = Object.create(e("core-util-is"));

    function n(e) {
      if (!(this instanceof n)) return new n(e);
      i.call(this, e);
    }

    t.inherits = e("inherits"), t.inherits(n, i), n.prototype._transform = function(e, t, r) {
      r(null, e);
    };
  }, { "./_stream_transform": 176, "core-util-is": 66, inherits: 142 }],
  175: [function(R, L, e) {
    !function(A, I) {
      !function() {
        "use strict";
        var y = R("process-nextick-args");
        L.exports = n;
        var o, g = R("isarray");
        n.ReadableState = i;

        function m(e, t) {
          return e.listeners(t).length;
        }

        R("events").EventEmitter;
        var r = R("./internal/streams/stream"), c = R("safe-buffer").Buffer, h = I.Uint8Array || function() {
        };
        var e = Object.create(R("core-util-is"));
        e.inherits = R("inherits");
        var a, t = R("util"), b = void 0, b = t && t.debuglog ? t.debuglog("stream") : function() {
        }, s = R("./internal/streams/BufferList"), t = R("./internal/streams/destroy");
        e.inherits(n, r);
        var l = ["error", "close", "destroy", "pause", "resume"];

        function i(e, t) {
          var r = t instanceof (o = o || R("./_stream_duplex"));
          this.objectMode = !!(e = e || {}).objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
          var i = e.highWaterMark, n = e.readableHighWaterMark, t = this.objectMode ? 16 : 16384;
          this.highWaterMark = i || 0 === i ? i : r && (n || 0 === n) ? n : t, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new s, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (a = a || R("string_decoder/").StringDecoder, this.decoder = new a(e.encoding), this.encoding = e.encoding);
        }

        function n(e) {
          if (o = o || R("./_stream_duplex"), !(this instanceof n)) return new n(e);
          this._readableState = new i(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), r.call(this);
        }

        function u(e, t, r, i, n) {
          var o, a, s, l, u = e._readableState;
          return null === t ? (u.reading = !1, a = e, (s = u).ended || (!s.decoder || (l = s.decoder.end()) && l.length && (s.buffer.push(l), s.length += s.objectMode ? 1 : l.length), s.ended = !0, _(a))) : (o = !n ? function(e, t) {
            var r;
            (function(e) {
              return c.isBuffer(e) || e instanceof h;
            })(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
            return r;
          }(u, t) : o) ? e.emit("error", o) : u.objectMode || t && 0 < t.length ? ("string" == typeof t || u.objectMode || Object.getPrototypeOf(t) === c.prototype || (o = t, t = c.from(o)), i ? u.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : d(e, u, t, !0) : u.ended ? e.emit("error", new Error("stream.push() after EOF")) : (u.reading = !1, u.decoder && !r ? (t = u.decoder.write(t), u.objectMode || 0 !== t.length ? d(e, u, t, !1) : w(e, u)) : d(e, u, t, !1))) : i || (u.reading = !1), !(u = u).ended && (u.needReadable || u.length < u.highWaterMark || 0 === u.length);
        }

        function d(e, t, r, i) {
          t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && _(e)), w(e, t);
        }

        Object.defineProperty(n.prototype, "destroyed", {
          get: function() {
            return void 0 !== this._readableState && this._readableState.destroyed;
          }, set: function(e) {
            this._readableState && (this._readableState.destroyed = e);
          }
        }), n.prototype.destroy = t.destroy, n.prototype._undestroy = t.undestroy, n.prototype._destroy = function(e, t) {
          this.push(null), t(e);
        }, n.prototype.push = function(e, t) {
          var r, i = this._readableState;
          return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = c.from(e, t), t = ""), r = !0), u(this, e, t, !1, r);
        }, n.prototype.unshift = function(e) {
          return u(this, e, null, !0, !1);
        }, n.prototype.isPaused = function() {
          return !1 === this._readableState.flowing;
        }, n.prototype.setEncoding = function(e) {
          return a = a || R("string_decoder/").StringDecoder, this._readableState.decoder = new a(e), this._readableState.encoding = e, this;
        };
        var f = 8388608;

        function p(e, t) {
          return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? (t.flowing && t.length ? t.buffer.head.data : t).length : (e > t.highWaterMark && (t.highWaterMark = (f <= (r = e) ? r = f : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
          var r;
        }

        function _(e) {
          var t = e._readableState;
          t.needReadable = !1, t.emittedReadable || (b("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? y.nextTick(v, e) : v(e));
        }

        function v(e) {
          b("emit readable"), e.emit("readable"), x(e);
        }

        function w(e, t) {
          t.readingMore || (t.readingMore = !0, y.nextTick(S, e, t));
        }

        function S(e, t) {
          for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (b("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
          t.readingMore = !1;
        }

        function E(e) {
          b("readable nexttick read 0"), e.read(0);
        }

        function T(e, t) {
          t.reading || (b("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), x(e), t.flowing && !t.reading && e.read(0);
        }

        function x(e) {
          var t = e._readableState;
          for (b("flow", t.flowing); t.flowing && null !== e.read();) ;
        }

        function M(e, t) {
          return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function(e, t, r) {
            var i;
            e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : i = e === t.head.data.length ? t.shift() : (r ? function(e, t) {
              var r = t.head, i = 1, n = r.data;
              e -= n.length;
              for (; r = r.next;) {
                var o = r.data, a = e > o.length ? o.length : e;
                if (a === o.length ? n += o : n += o.slice(0, e), 0 === (e -= a)) {
                  a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r).data = o.slice(a);
                  break;
                }
                ++i;
              }
              return t.length -= i, n;
            } : function(e, t) {
              var r = c.allocUnsafe(e), i = t.head, n = 1;
              i.data.copy(r), e -= i.data.length;
              for (; i = i.next;) {
                var o = i.data, a = e > o.length ? o.length : e;
                if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
                  a === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i).data = o.slice(a);
                  break;
                }
                ++n;
              }
              return t.length -= n, r;
            })(e, t);
            return i;
          }(e, t.buffer, t.decoder), r);
          var r;
        }

        function k(e) {
          var t = e._readableState;
          if (0 < t.length) throw new Error("\"endReadable()\" called on non-empty stream");
          t.endEmitted || (t.ended = !0, y.nextTick(P, t, e));
        }

        function P(e, t) {
          e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
        }

        function C(e, t) {
          for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
          return -1;
        }

        n.prototype.read = function(e) {
          b("read", e), e = parseInt(e, 10);
          var t = this._readableState, r = e;
          if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return b("read: emitReadable", t.length, t.ended), (0 === t.length && t.ended ? k : _)(this), null;
          if (0 === (e = p(e, t)) && t.ended) return 0 === t.length && k(this), null;
          var i = t.needReadable;
          return b("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && b("length less than watermark", i = !0), t.ended || t.reading ? b("reading or ended", i = !1) : i && (b("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = p(r, t))), null === (i = 0 < e ? M(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && k(this)), null !== i && this.emit("data", i), i;
        }, n.prototype._read = function(e) {
          this.emit("error", new Error("_read() is not implemented"));
        }, n.prototype.pipe = function(r, e) {
          var i = this, n = this._readableState;
          switch (n.pipesCount) {
            case 0:
              n.pipes = r;
              break;
            case 1:
              n.pipes = [n.pipes, r];
              break;
            default:
              n.pipes.push(r);
          }
          n.pipesCount += 1, b("pipe count=%d opts=%j", n.pipesCount, e);
          e = (!e || !1 !== e.end) && r !== A.stdout && r !== A.stderr ? a : p;

          function o(e, t) {
            b("onunpipe"), e === i && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, b("cleanup"), r.removeListener("close", d), r.removeListener("finish", f), r.removeListener("drain", s), r.removeListener("error", h), r.removeListener("unpipe", o), i.removeListener("end", a), i.removeListener("end", p), i.removeListener("data", c), l = !0, !n.awaitDrain || r._writableState && !r._writableState.needDrain || s());
          }

          function a() {
            b("onend"), r.end();
          }

          n.endEmitted ? y.nextTick(e) : i.once("end", e), r.on("unpipe", o);
          var t, s = (t = i, function() {
            var e = t._readableState;
            b("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && m(t, "data") && (e.flowing = !0, x(t));
          });
          r.on("drain", s);
          var l = !1;
          var u = !1;

          function c(e) {
            b("ondata"), (u = !1) !== r.write(e) || u || ((1 === n.pipesCount && n.pipes === r || 1 < n.pipesCount && -1 !== C(n.pipes, r)) && !l && (b("false write response, pause", i._readableState.awaitDrain), i._readableState.awaitDrain++, u = !0), i.pause());
          }

          function h(e) {
            b("onerror", e), p(), r.removeListener("error", h), 0 === m(r, "error") && r.emit("error", e);
          }

          function d() {
            r.removeListener("finish", f), p();
          }

          function f() {
            b("onfinish"), r.removeListener("close", d), p();
          }

          function p() {
            b("unpipe"), i.unpipe(r);
          }

          return i.on("data", c), function(e, t, r) {
            if ("function" == typeof e.prependListener) return e.prependListener(t, r);
            e._events && e._events[t] ? g(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
          }(r, "error", h), r.once("close", d), r.once("finish", f), r.emit("pipe", i), n.flowing || (b("pipe resume"), i.resume()), r;
        }, n.prototype.unpipe = function(e) {
          var t = this._readableState, r = { hasUnpiped: !1 };
          if (0 === t.pipesCount) return this;
          if (1 === t.pipesCount) return e && e !== t.pipes || (e = e || t.pipes, t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
          if (!e) {
            var i = t.pipes, n = t.pipesCount;
            t.pipes = null, t.pipesCount = 0, t.flowing = !1;
            for (var o = 0; o < n; o++) i[o].emit("unpipe", this, r);
            return this;
          }
          var a = C(t.pipes, e);
          return -1 === a || (t.pipes.splice(a, 1), --t.pipesCount, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this;
        }, n.prototype.addListener = n.prototype.on = function(e, t) {
          t = r.prototype.on.call(this, e, t);
          return "data" === e ? !1 !== this._readableState.flowing && this.resume() : "readable" === e && ((e = this._readableState).endEmitted || e.readableListening || (e.readableListening = e.needReadable = !0, e.emittedReadable = !1, e.reading ? e.length && _(this) : y.nextTick(E, this))), t;
        }, n.prototype.resume = function() {
          var e, t = this._readableState;
          return t.flowing || (b("resume"), t.flowing = !0, e = this, (t = t).resumeScheduled || (t.resumeScheduled = !0, y.nextTick(T, e, t))), this;
        }, n.prototype.pause = function() {
          return b("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (b("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
        }, n.prototype.wrap = function(t) {
          var e, r = this, i = this._readableState, n = !1;
          for (e in t.on("end", function() {
            var e;
            b("wrapped end"), !i.decoder || i.ended || (e = i.decoder.end()) && e.length && r.push(e), r.push(null);
          }), t.on("data", function(e) {
            b("wrapped data"), i.decoder && (e = i.decoder.write(e)), i.objectMode && null == e || (i.objectMode || e && e.length) && (r.push(e) || (n = !0, t.pause()));
          }), t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function(e) {
            return function() {
              return t[e].apply(t, arguments);
            };
          }(e));
          for (var o = 0; o < l.length; o++) t.on(l[o], this.emit.bind(this, l[o]));
          return this._read = function(e) {
            b("wrapped _read", e), n && (n = !1, t.resume());
          }, this;
        }, Object.defineProperty(n.prototype, "readableHighWaterMark", {
          enumerable: !1, get: function() {
            return this._readableState.highWaterMark;
          }
        }), n._fromList = M;
      }.call(this);
    }.call(this, R("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {
    "./_stream_duplex": 173,
    "./internal/streams/BufferList": 178,
    "./internal/streams/destroy": 179,
    "./internal/streams/stream": 180,
    _process: 162,
    "core-util-is": 66,
    events: 108,
    inherits: 142,
    isarray: 144,
    "process-nextick-args": 161,
    "safe-buffer": 187,
    "string_decoder/": 181,
    util: 19
  }],
  176: [function(e, t, r) {
    "use strict";
    t.exports = n;
    var i = e("./_stream_duplex"), t = Object.create(e("core-util-is"));

    function n(e) {
      if (!(this instanceof n)) return new n(e);
      i.call(this, e), this._transformState = {
        afterTransform: function(e, t) {
          var r = this._transformState;
          r.transforming = !1;
          var i = r.writecb;
          if (!i) return this.emit("error", new Error("write callback called multiple times"));
          r.writechunk = null, (r.writecb = null) != t && this.push(t), i(e), (e = this._readableState).reading = !1, (e.needReadable || e.length < e.highWaterMark) && this._read(e.highWaterMark);
        }.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", o);
    }

    function o() {
      var r = this;
      "function" == typeof this._flush ? this._flush(function(e, t) {
        a(r, e, t);
      }) : a(this, null, null);
    }

    function a(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return e.push(null);
    }

    t.inherits = e("inherits"), t.inherits(n, i), n.prototype.push = function(e, t) {
      return this._transformState.needTransform = !1, i.prototype.push.call(this, e, t);
    }, n.prototype._transform = function(e, t, r) {
      throw new Error("_transform() is not implemented");
    }, n.prototype._write = function(e, t, r) {
      var i = this._transformState;
      i.writecb = r, i.writechunk = e, i.writeencoding = t, i.transforming || (t = this._readableState, (i.needTransform || t.needReadable || t.length < t.highWaterMark) && this._read(t.highWaterMark));
    }, n.prototype._read = function(e) {
      var t = this._transformState;
      null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
    }, n.prototype._destroy = function(e, t) {
      var r = this;
      i.prototype._destroy.call(this, e, function(e) {
        t(e), r.emit("close");
      });
    };
  }, { "./_stream_duplex": 173, "core-util-is": 66, inherits: 142 }],
  177: [function(E, T, e) {
    !function(v, w, S) {
      !function() {
        "use strict";
        var d = E("process-nextick-args");

        function c(e) {
          var t = this;
          this.next = null, this.entry = null, this.finish = function() {
            !function(e, t, r) {
              var i = e.entry;
              e.entry = null;
              for (; i;) {
                var n = i.callback;
                t.pendingcb--, n(r), i = i.next;
              }
              t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
            }(t, e);
          };
        }

        T.exports = l;
        var a, s = !v.browser && -1 < ["v0.10", "v0.9."].indexOf(v.version.slice(0, 5)) ? S : d.nextTick;
        l.WritableState = o;
        var e = Object.create(E("core-util-is"));
        e.inherits = E("inherits");
        var t = { deprecate: E("util-deprecate") }, r = E("./internal/streams/stream"), f = E("safe-buffer").Buffer,
          p = w.Uint8Array || function() {
          };
        var i, n = E("./internal/streams/destroy");

        function y() {
        }

        function o(e, o) {
          a = a || E("./_stream_duplex");
          var t = o instanceof a;
          this.objectMode = !!(e = e || {}).objectMode, t && (this.objectMode = this.objectMode || !!e.writableObjectMode);
          var r = e.highWaterMark, i = e.writableHighWaterMark, n = this.objectMode ? 16 : 16384;
          this.highWaterMark = r || 0 === r ? r : t && (i || 0 === i) ? i : n, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
          n = (this.destroyed = !1) === e.decodeStrings;
          this.decodeStrings = !n, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
            var t, r, i, n;
            r = e, i = (t = o)._writableState, n = i.sync, e = i.writecb, function(e) {
              e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
            }(i), r ? function(e, t, r, i, n) {
              --t.pendingcb, r ? (d.nextTick(n, i), d.nextTick(_, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.errorEmitted = !0, e.emit("error", i), _(e, t));
            }(t, i, n, r, e) : ((r = m(i)) || i.corked || i.bufferProcessing || !i.bufferedRequest || h(t, i), n ? s(u, t, i, r, e) : u(t, i, r, e));
          }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new c(this);
        }

        function l(e) {
          if (a = a || E("./_stream_duplex"), !(i.call(l, this) || this instanceof a)) return new l(e);
          this._writableState = new o(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e["final"] && (this._final = e["final"])), r.call(this);
        }

        function g(e, t, r, i, n, o, a) {
          t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
        }

        function u(e, t, r, i) {
          var n;
          r || (n = e, 0 === (r = t).length && r.needDrain && (r.needDrain = !1, n.emit("drain"))), t.pendingcb--, i(), _(e, t);
        }

        function h(e, t) {
          t.bufferProcessing = !0;
          var r = t.bufferedRequest;
          if (e._writev && r && r.next) {
            var i = t.bufferedRequestCount, n = new Array(i), i = t.corkedRequestsFree;
            i.entry = r;
            for (var o = 0, a = !0; r;) (n[o] = r).isBuf || (a = !1), r = r.next, o += 1;
            n.allBuffers = a, g(e, t, !0, t.length, n, "", i.finish), t.pendingcb++, t.lastBufferedRequest = null, i.next ? (t.corkedRequestsFree = i.next, i.next = null) : t.corkedRequestsFree = new c(t), t.bufferedRequestCount = 0;
          } else {
            for (; r;) {
              var s = r.chunk, l = r.encoding, u = r.callback;
              if (g(e, t, !1, t.objectMode ? 1 : s.length, s, l, u), r = r.next, t.bufferedRequestCount--, t.writing) break;
            }
            null === r && (t.lastBufferedRequest = null);
          }
          t.bufferedRequest = r, t.bufferProcessing = !1;
        }

        function m(e) {
          return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }

        function b(t, r) {
          t._final(function(e) {
            r.pendingcb--, e && t.emit("error", e), r.prefinished = !0, t.emit("prefinish"), _(t, r);
          });
        }

        function _(e, t) {
          var r, i, n = m(t);
          return n && (r = e, (i = t).prefinished || i.finalCalled || ("function" == typeof r._final ? (i.pendingcb++, i.finalCalled = !0, d.nextTick(b, r, i)) : (i.prefinished = !0, r.emit("prefinish"))), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), n;
        }

        e.inherits(l, r), o.prototype.getBuffer = function() {
          for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
          return t;
        }, function() {
          try {
            Object.defineProperty(o.prototype, "buffer", {
              get: t.deprecate(function() {
                return this.getBuffer();
              }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
            });
          } catch (e) {
          }
        }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (i = Function.prototype[Symbol.hasInstance], Object.defineProperty(l, Symbol.hasInstance, {
          value: function(e) {
            return !!i.call(this, e) || this === l && (e && e._writableState instanceof o);
          }
        })) : i = function(e) {
          return e instanceof this;
        }, l.prototype.pipe = function() {
          this.emit("error", new Error("Cannot pipe, not readable"));
        }, l.prototype.write = function(e, t, r) {
          var i, n, o, a, s, l, u = this._writableState, c = !1,
            h = !u.objectMode && (n = e, f.isBuffer(n) || n instanceof p);
          return h && !f.isBuffer(e) && (o = e, e = f.from(o)), "function" == typeof t && (r = t, t = null), t = h ? "buffer" : t || u.defaultEncoding, "function" != typeof r && (r = y), u.ended ? (a = this, s = r, l = new Error("write after end"), a.emit("error", l), d.nextTick(s, l)) : (h || (i = this, n = u, o = r, s = !(a = !0), null === (l = e) ? s = new TypeError("May not write null values to stream") : "string" == typeof l || void 0 === l || n.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (i.emit("error", s), d.nextTick(o, s), a = !1), a)) && (u.pendingcb++, c = function(e, t, r, i, n, o) {
            r || (l = function(e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = f.from(t, r));
              return t;
            }(t, i, n), i !== l && (r = !0, n = "buffer", i = l));
            var a = t.objectMode ? 1 : i.length;
            t.length += a;
            var s = t.length < t.highWaterMark;
            s || (t.needDrain = !0);
            {
              var l;
              t.writing || t.corked ? (l = t.lastBufferedRequest, t.lastBufferedRequest = {
                chunk: i,
                encoding: n,
                isBuf: r,
                callback: o,
                next: null
              }, l ? l.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1) : g(e, t, !1, a, i, n, o);
            }
            return s;
          }(this, u, h, e, t, r)), c;
        }, l.prototype.cork = function() {
          this._writableState.corked++;
        }, l.prototype.uncork = function() {
          var e = this._writableState;
          e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || h(this, e));
        }, l.prototype.setDefaultEncoding = function(e) {
          if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + e);
          return this._writableState.defaultEncoding = e, this;
        }, Object.defineProperty(l.prototype, "writableHighWaterMark", {
          enumerable: !1, get: function() {
            return this._writableState.highWaterMark;
          }
        }), l.prototype._write = function(e, t, r) {
          r(new Error("_write() is not implemented"));
        }, l.prototype._writev = null, l.prototype.end = function(e, t, r) {
          var i = this._writableState;
          "function" == typeof e ? (r = e, t = e = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || i.finished || function(e, t, r) {
            t.ending = !0, _(e, t), r && (t.finished ? d.nextTick(r) : e.once("finish", r));
            t.ended = !0, e.writable = !1;
          }(this, i, r);
        }, Object.defineProperty(l.prototype, "destroyed", {
          get: function() {
            return void 0 !== this._writableState && this._writableState.destroyed;
          }, set: function(e) {
            this._writableState && (this._writableState.destroyed = e);
          }
        }), l.prototype.destroy = n.destroy, l.prototype._undestroy = n.undestroy, l.prototype._destroy = function(e, t) {
          this.end(), t(e);
        };
      }.call(this);
    }.call(this, E("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, E("timers").setImmediate);
  }, {
    "./_stream_duplex": 173,
    "./internal/streams/destroy": 179,
    "./internal/streams/stream": 180,
    _process: 162,
    "core-util-is": 66,
    inherits: 142,
    "process-nextick-args": 161,
    "safe-buffer": 187,
    timers: 200,
    "util-deprecate": 201
  }],
  178: [function(e, t, r) {
    "use strict";
    var s = e("safe-buffer").Buffer, i = e("util");

    function n() {
      !function(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }(this, n), this.head = null, this.tail = null, this.length = 0;
    }

    t.exports = (n.prototype.push = function(e) {
      e = { data: e, next: null };
      0 < this.length ? this.tail.next = e : this.head = e, this.tail = e, ++this.length;
    }, n.prototype.unshift = function(e) {
      e = { data: e, next: this.head };
      0 === this.length && (this.tail = e), this.head = e, ++this.length;
    }, n.prototype.shift = function() {
      if (0 !== this.length) {
        var e = this.head.data;
        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
      }
    }, n.prototype.clear = function() {
      this.head = this.tail = null, this.length = 0;
    }, n.prototype.join = function(e) {
      if (0 === this.length) return "";
      for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
      return r;
    }, n.prototype.concat = function(e) {
      if (0 === this.length) return s.alloc(0);
      if (1 === this.length) return this.head.data;
      for (var t, r, i, n = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o;) t = o.data, r = n, i = a, t.copy(r, i), a += o.data.length, o = o.next;
      return n;
    }, n), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function() {
      var e = i.inspect({ length: this.length });
      return this.constructor.name + " " + e;
    });
  }, { "safe-buffer": 187, util: 19 }],
  179: [function(e, t, r) {
    "use strict";
    var o = e("process-nextick-args");

    function a(e, t) {
      e.emit("error", t);
    }

    t.exports = {
      destroy: function(e, t) {
        var r = this, i = this._readableState && this._readableState.destroyed,
          n = this._writableState && this._writableState.destroyed;
        return i || n ? t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || o.nextTick(a, this, e) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function(e) {
          !t && e ? (o.nextTick(a, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e);
        })), this;
      }, undestroy: function() {
        this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
      }
    };
  }, { "process-nextick-args": 161 }],
  180: [function(e, t, r) {
    arguments[4][60][0].apply(r, arguments);
  }, { dup: 60, events: 108 }],
  181: [function(e, t, r) {
    "use strict";
    var i = e("safe-buffer").Buffer, n = i.isEncoding || function(e) {
      switch ((e = "" + e) && e.toLowerCase()) {
        case"hex":
        case"utf8":
        case"utf-8":
        case"ascii":
        case"binary":
        case"base64":
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
        case"raw":
          return !0;
        default:
          return !1;
      }
    };

    function o(e) {
      var t = function(e) {
        if (!e) return "utf8";
        for (var t; ;) switch (e) {
          case"utf8":
          case"utf-8":
            return "utf8";
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            return "utf16le";
          case"latin1":
          case"binary":
            return "latin1";
          case"base64":
          case"ascii":
          case"hex":
            return e;
          default:
            if (t) return;
            e = ("" + e).toLowerCase(), t = !0;
        }
      }(e);
      if ("string" != typeof t && (i.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
      return t || e;
    }

    function a(e) {
      var t;
      switch (this.encoding = o(e), this.encoding) {
        case"utf16le":
          this.text = u, this.end = c, t = 4;
          break;
        case"utf8":
          this.fillLast = l, t = 4;
          break;
        case"base64":
          this.text = h, this.end = d, t = 3;
          break;
        default:
          return this.write = f, void (this.end = p);
      }
      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = i.allocUnsafe(t);
    }

    function s(e) {
      return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
    }

    function l(e) {
      var t, r, i = this.lastTotal - this.lastNeed,
        t = (t = this, 128 != (192 & (r = e)[0]) ? (t.lastNeed = 0, "\ufffd") : 1 < t.lastNeed && 1 < r.length ? 128 != (192 & r[1]) ? (t.lastNeed = 1, "\ufffd") : 2 < t.lastNeed && 2 < r.length && 128 != (192 & r[2]) ? (t.lastNeed = 2, "\ufffd") : void 0 : void 0);
      return void 0 !== t ? t : this.lastNeed <= e.length ? (e.copy(this.lastChar, i, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, i, 0, e.length), void (this.lastNeed -= e.length));
    }

    function u(e, t) {
      if ((e.length - t) % 2 != 0) return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
      var r = e.toString("utf16le", t);
      if (r) {
        t = r.charCodeAt(r.length - 1);
        if (55296 <= t && t <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
      }
      return r;
    }

    function c(e) {
      var t = e && e.length ? this.write(e) : "";
      if (this.lastNeed) {
        e = this.lastTotal - this.lastNeed;
        return t + this.lastChar.toString("utf16le", 0, e);
      }
      return t;
    }

    function h(e, t) {
      var r = (e.length - t) % 3;
      return 0 == r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 == r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
    }

    function d(e) {
      e = e && e.length ? this.write(e) : "";
      return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
    }

    function f(e) {
      return e.toString(this.encoding);
    }

    function p(e) {
      return e && e.length ? this.write(e) : "";
    }

    (r.StringDecoder = a).prototype.write = function(e) {
      if (0 === e.length) return "";
      var t, r;
      if (this.lastNeed) {
        if (void 0 === (t = this.fillLast(e))) return "";
        r = this.lastNeed, this.lastNeed = 0;
      } else r = 0;
      return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
    }, a.prototype.end = function(e) {
      e = e && e.length ? this.write(e) : "";
      return this.lastNeed ? e + "\ufffd" : e;
    }, a.prototype.text = function(e, t) {
      var r = function(e, t, r) {
        var i = t.length - 1;
        if (i < r) return 0;
        var n = s(t[i]);
        if (0 <= n) return 0 < n && (e.lastNeed = n - 1), n;
        if (--i < r || -2 === n) return 0;
        if (0 <= (n = s(t[i]))) return 0 < n && (e.lastNeed = n - 2), n;
        if (--i < r || -2 === n) return 0;
        if (0 <= (n = s(t[i]))) return 0 < n && (2 === n ? n = 0 : e.lastNeed = n - 3), n;
        return 0;
      }(this, e, t);
      if (!this.lastNeed) return e.toString("utf8", t);
      this.lastTotal = r;
      r = e.length - (r - this.lastNeed);
      return e.copy(this.lastChar, 0, r), e.toString("utf8", t, r);
    }, a.prototype.fillLast = function(e) {
      if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
    };
  }, { "safe-buffer": 187 }],
  182: [function(e, t, r) {
    t.exports = e("./readable").PassThrough;
  }, { "./readable": 183 }],
  183: [function(e, t, r) {
    (((r = t.exports = e("./lib/_stream_readable.js")).Stream = r).Readable = r).Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js");
  }, {
    "./lib/_stream_duplex.js": 173,
    "./lib/_stream_passthrough.js": 174,
    "./lib/_stream_readable.js": 175,
    "./lib/_stream_transform.js": 176,
    "./lib/_stream_writable.js": 177
  }],
  184: [function(e, t, r) {
    t.exports = e("./readable").Transform;
  }, { "./readable": 183 }],
  185: [function(e, t, r) {
    t.exports = e("./lib/_stream_writable.js");
  }, { "./lib/_stream_writable.js": 177 }],
  186: [function(e, t, r) {
    "use strict";
    var i = e("buffer").Buffer, n = e("inherits"), o = e("hash-base"), g = new Array(16),
      m = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
      b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
      _ = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
      v = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
      w = [0, 1518500249, 1859775393, 2400959708, 2840853838], S = [1352829926, 1548603684, 1836072691, 2053994217, 0];

    function a() {
      o.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
    }

    function E(e, t) {
      return e << t | e >>> 32 - t;
    }

    function T(e, t, r, i, n, o, a, s) {
      return E(e + (t ^ r ^ i) + o + a | 0, s) + n | 0;
    }

    function x(e, t, r, i, n, o, a, s) {
      return E(e + (t & r | ~t & i) + o + a | 0, s) + n | 0;
    }

    function M(e, t, r, i, n, o, a, s) {
      return E(e + ((t | ~r) ^ i) + o + a | 0, s) + n | 0;
    }

    function k(e, t, r, i, n, o, a, s) {
      return E(e + (t & i | r & ~i) + o + a | 0, s) + n | 0;
    }

    function P(e, t, r, i, n, o, a, s) {
      return E(e + (t ^ (r | ~i)) + o + a | 0, s) + n | 0;
    }

    n(a, o), a.prototype._update = function() {
      for (var e = g, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
      for (var r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, o = 0 | this._d, a = 0 | this._e, s = 0 | this._a, l = 0 | this._b, u = 0 | this._c, c = 0 | this._d, h = 0 | this._e, d = 0; d < 80; d += 1) var f, p = d < 16 ? (f = T(r, i, n, o, a, e[m[d]], w[0], _[d]), P(s, l, u, c, h, e[b[d]], S[0], v[d])) : d < 32 ? (f = x(r, i, n, o, a, e[m[d]], w[1], _[d]), k(s, l, u, c, h, e[b[d]], S[1], v[d])) : d < 48 ? (f = M(r, i, n, o, a, e[m[d]], w[2], _[d]), M(s, l, u, c, h, e[b[d]], S[2], v[d])) : d < 64 ? (f = k(r, i, n, o, a, e[m[d]], w[3], _[d]), x(s, l, u, c, h, e[b[d]], S[3], v[d])) : (f = P(r, i, n, o, a, e[m[d]], w[4], _[d]), T(s, l, u, c, h, e[b[d]], S[4], v[d])), r = a, a = o, o = E(n, 10), n = i, i = f, s = h, h = c, c = E(u, 10), u = l, l = p;
      var y = this._b + n + c | 0;
      this._b = this._c + o + h | 0, this._c = this._d + a + s | 0, this._d = this._e + r + l | 0, this._e = this._a + i + u | 0, this._a = y;
    }, a.prototype._digest = function() {
      this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = i.alloc ? i.alloc(20) : new i(20);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e;
    }, t.exports = a;
  }, { buffer: 64, "hash-base": 111, inherits: 142 }],
  187: [function(e, t, r) {
    var i = e("buffer"), n = i.Buffer;

    function o(e, t) {
      for (var r in e) t[r] = e[r];
    }

    function a(e, t, r) {
      return n(e, t, r);
    }

    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = i : (o(i, r), r.Buffer = a), o(n, a), a.from = function(e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return n(e, t, r);
    }, a.alloc = function(e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      e = n(e);
      return void 0 !== t ? "string" == typeof r ? e.fill(t, r) : e.fill(t) : e.fill(0), e;
    }, a.allocUnsafe = function(e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n(e);
    }, a.allocUnsafeSlow = function(e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i.SlowBuffer(e);
    };
  }, { buffer: 64 }],
  188: [function(a, s, e) {
    !function(o) {
      !function() {
        "use strict";
        var e, t = a("buffer"), i = t.Buffer, r = {};
        for (e in t) t.hasOwnProperty(e) && "SlowBuffer" !== e && "Buffer" !== e && (r[e] = t[e]);
        var n = r.Buffer = {};
        for (e in i) i.hasOwnProperty(e) && "allocUnsafe" !== e && "allocUnsafeSlow" !== e && (n[e] = i[e]);
        if (r.Buffer.prototype = i.prototype, n.from && n.from !== Uint8Array.from || (n.from = function(e, t, r) {
          if ("number" == typeof e) throw new TypeError("The \"value\" argument must not be of type number. Received type " + typeof e);
          if (e && void 0 === e.length) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
          return i(e, t, r);
        }), n.alloc || (n.alloc = function(e, t, r) {
          if ("number" != typeof e) throw new TypeError("The \"size\" argument must be of type number. Received type " + typeof e);
          if (e < 0 || 2 * (1 << 30) <= e) throw new RangeError("The value \"" + e + "\" is invalid for option \"size\"");
          e = i(e);
          return t && 0 !== t.length ? "string" == typeof r ? e.fill(t, r) : e.fill(t) : e.fill(0), e;
        }), !r.kStringMaxLength) try {
          r.kStringMaxLength = o.binding("buffer").kStringMaxLength;
        } catch (e) {
        }
        r.constants || (r.constants = { MAX_LENGTH: r.kMaxLength }, r.kStringMaxLength && (r.constants.MAX_STRING_LENGTH = r.kStringMaxLength)), s.exports = r;
      }.call(this);
    }.call(this, a("_process"));
  }, { _process: 162, buffer: 64 }],
  189: [function(e, t, r) {
    var c = e("safe-buffer").Buffer;

    function i(e, t) {
      this._block = c.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0;
    }

    i.prototype.update = function(e, t) {
      "string" == typeof e && (e = c.from(e, t = t || "utf8"));
      for (var r = this._block, i = this._blockSize, n = e.length, o = this._len, a = 0; a < n;) {
        for (var s = o % i, l = Math.min(n - a, i - s), u = 0; u < l; u++) r[s + u] = e[a + u];
        a += l, (o += l) % i == 0 && this._update(r);
      }
      return this._len += n, this;
    }, i.prototype.digest = function(e) {
      var t = this._len % this._blockSize;
      this._block[t] = 128, this._block.fill(0, 1 + t), t >= this._finalSize && (this._update(this._block), this._block.fill(0));
      t = 8 * this._len;
      t <= 4294967295 ? this._block.writeUInt32BE(t, this._blockSize - 4) : (this._block.writeUInt32BE((t - (r = (4294967295 & t) >>> 0)) / 4294967296, this._blockSize - 8), this._block.writeUInt32BE(r, this._blockSize - 4)), this._update(this._block);
      var r = this._hash();
      return e ? r.toString(e) : r;
    }, i.prototype._update = function() {
      throw new Error("_update must be implemented by subclass");
    }, t.exports = i;
  }, { "safe-buffer": 187 }],
  190: [function(e, t, r) {
    (r = t.exports = function(e) {
      e = e.toLowerCase();
      var t = r[e];
      if (!t) throw new Error(e + " is not supported (we accept pull requests)");
      return new t;
    }).sha = e("./sha"), r.sha1 = e("crypto-js/sha1"), r.sha224 = e("./sha224"), r.sha256 = e("./sha256"), r.sha384 = e("./sha384"), r.sha512 = e("./sha512");
  }, { "./sha": 191, "crypto-js/sha1": 192, "./sha224": 193, "./sha256": 194, "./sha384": 195, "./sha512": 196 }],
  191: [function(e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
      p = [1518500249, 1859775393, -1894007588, -899497514], a = new Array(80);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56);
    }

    i(s, n), s.prototype.init = function() {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    }, s.prototype._update = function(e) {
      for (var t = this._w, r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, o = 0 | this._d, a = 0 | this._e, s = 0; s < 16; ++s) t[s] = e.readInt32BE(4 * s);
      for (; s < 80; ++s) t[s] = t[s - 3] ^ t[s - 8] ^ t[s - 14] ^ t[s - 16];
      for (var l, u, c, h = 0; h < 80; ++h) var d = ~~(h / 20), f = 0 | ((c = r) << 5 | c >>> 27) + (l = i, u = n, f = o, 0 === (c = d) ? l & u | ~l & f : 2 === c ? l & u | l & f | u & f : l ^ u ^ f) + a + t[h] + p[d], a = o, o = n, n = (d = i) << 30 | d >>> 2, i = r, r = f;
      this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = n + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0;
    }, s.prototype._hash = function() {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, t.exports = s;
  }, { "./hash": 189, inherits: 142, "safe-buffer": 187 }],
  192: [function(e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
      y = [1518500249, 1859775393, -1894007588, -899497514], a = new Array(80);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56);
    }

    i(s, n), s.prototype.init = function() {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    }, s.prototype._update = function(e) {
      for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, s = 0 | this._e, l = 0; l < 16; ++l) r[l] = e.readInt32BE(4 * l);
      for (; l < 80; ++l) r[l] = (t = r[l - 3] ^ r[l - 8] ^ r[l - 14] ^ r[l - 16]) << 1 | t >>> 31;
      for (var u, c, h, d = 0; d < 80; ++d) var f = ~~(d / 20), p = 0 | ((h = i) << 5 | h >>> 27) + (u = n, c = o, p = a, 0 === (h = f) ? u & c | ~u & p : 2 === h ? u & c | u & p | c & p : u ^ c ^ p) + s + r[d] + y[f], s = a, a = o, o = (f = n) << 30 | f >>> 2, n = i, i = p;
      this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = s + this._e | 0;
    }, s.prototype._hash = function() {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e;
    }, t.exports = s;
  }, { "./hash": 189, inherits: 142, "safe-buffer": 187 }],
  193: [function(e, t, r) {
    var i = e("inherits"), n = e("./sha256"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(64);

    function l() {
      this.init(), this._w = s, o.call(this, 64, 56);
    }

    i(l, n), l.prototype.init = function() {
      return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
    }, l.prototype._hash = function() {
      var e = a.allocUnsafe(28);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e;
    }, t.exports = l;
  }, { "./hash": 189, "./sha256": 194, inherits: 142, "safe-buffer": 187 }],
  194: [function(e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
      g = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
      a = new Array(64);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56);
    }

    i(s, n), s.prototype.init = function() {
      return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
    }, s.prototype._update = function(e) {
      for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, s = 0 | this._e, l = 0 | this._f, u = 0 | this._g, c = 0 | this._h, h = 0; h < 16; ++h) r[h] = e.readInt32BE(4 * h);
      for (; h < 64; ++h) r[h] = 0 | (((t = r[h - 2]) >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10) + r[h - 7] + (((t = r[h - 15]) >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3) + r[h - 16];
      for (var d, f = 0; f < 64; ++f) var p = c + (((y = s) >>> 6 | y << 26) ^ (y >>> 11 | y << 21) ^ (y >>> 25 | y << 7)) + ((d = u) ^ s & (l ^ d)) + g[f] + r[f] | 0, y = 0 | (((y = i) >>> 2 | y << 30) ^ (y >>> 13 | y << 19) ^ (y >>> 22 | y << 10)) + ((d = i) & (y = n) | o & (d | y)), c = u, u = l, l = s, s = a + p | 0, a = o, o = n, n = i, i = p + y | 0;
      this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = s + this._e | 0, this._f = l + this._f | 0, this._g = u + this._g | 0, this._h = c + this._h | 0;
    }, s.prototype._hash = function() {
      var e = o.allocUnsafe(32);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e;
    }, t.exports = s;
  }, { "./hash": 189, inherits: 142, "safe-buffer": 187 }],
  195: [function(e, t, r) {
    var i = e("inherits"), n = e("./sha512"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(160);

    function l() {
      this.init(), this._w = s, o.call(this, 128, 112);
    }

    i(l, n), l.prototype.init = function() {
      return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
    }, l.prototype._hash = function() {
      var i = a.allocUnsafe(48);

      function e(e, t, r) {
        i.writeInt32BE(e, r), i.writeInt32BE(t, r + 4);
      }

      return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), i;
    }, t.exports = l;
  }, { "./hash": 189, "./sha512": 196, inherits: 142, "safe-buffer": 187 }],
  196: [function(e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
      H = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
      a = new Array(160);

    function s() {
      this.init(), this._w = a, n.call(this, 128, 112);
    }

    function j(e, t, r) {
      return r ^ e & (t ^ r);
    }

    function F(e, t, r) {
      return e & t | r & (e | t);
    }

    function q(e, t) {
      return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
    }

    function V(e, t) {
      return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
    }

    function z(e, t) {
      return e >>> 0 < t >>> 0 ? 1 : 0;
    }

    i(s, n), s.prototype.init = function() {
      return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
    }, s.prototype._update = function(e) {
      for (var t = this._w, r = 0 | this._ah, i = 0 | this._bh, n = 0 | this._ch, o = 0 | this._dh, a = 0 | this._eh, s = 0 | this._fh, l = 0 | this._gh, u = 0 | this._hh, c = 0 | this._al, h = 0 | this._bl, d = 0 | this._cl, f = 0 | this._dl, p = 0 | this._el, y = 0 | this._fl, g = 0 | this._gl, m = 0 | this._hl, b = 0; b < 32; b += 2) t[b] = e.readInt32BE(4 * b), t[b + 1] = e.readInt32BE(4 * b + 4);
      for (; b < 160; b += 2) {
        var _ = t[b - 30], v = t[b - 30 + 1], w = ((M = _) >>> 1 | (T = v) << 31) ^ (M >>> 8 | T << 24) ^ M >>> 7,
          S = ((E = v) >>> 1 | (x = _) << 31) ^ (E >>> 8 | x << 24) ^ (E >>> 7 | x << 25), _ = t[b - 4],
          v = t[b - 4 + 1], E = ((T = _) >>> 19 | (M = v) << 13) ^ (M >>> 29 | T << 3) ^ T >>> 6,
          T = ((x = v) >>> 19 | (M = _) << 13) ^ (M >>> 29 | x << 3) ^ (x >>> 6 | M << 26), v = t[b - 14],
          _ = t[b - 14 + 1], x = t[b - 32], M = t[b - 32 + 1], k = S + _ | 0, P = w + v + z(k, S) | 0;
        P = (P = P + E + z(k = k + T | 0, T) | 0) + x + z(k = k + M | 0, M) | 0, t[b] = P, t[b + 1] = k;
      }
      for (var C = 0; C < 160; C += 2) {
        P = t[C], k = t[C + 1];
        var A = F(r, i, n), I = F(c, h, d), R = q(r, c), L = q(c, r), D = V(a, p), B = V(p, a), O = H[C + 1],
          U = j(a, s, l), N = j(p, y, g), B = m + B | 0, D = u + D + z(B, m) | 0;
        D = (D = (D = D + U + z(B = B + N | 0, N) | 0) + H[C] + z(B = B + O | 0, O) | 0) + P + z(B = B + k | 0, k) | 0;
        I = L + I | 0, L = R + A + z(I, L) | 0, u = l, m = g, l = s, g = y, s = a, y = p, a = o + D + z(p = f + B | 0, f) | 0, o = n, f = d, n = i, d = h, i = r, h = c, r = D + L + z(c = B + I | 0, B) | 0;
      }
      this._al = this._al + c | 0, this._bl = this._bl + h | 0, this._cl = this._cl + d | 0, this._dl = this._dl + f | 0, this._el = this._el + p | 0, this._fl = this._fl + y | 0, this._gl = this._gl + g | 0, this._hl = this._hl + m | 0, this._ah = this._ah + r + z(this._al, c) | 0, this._bh = this._bh + i + z(this._bl, h) | 0, this._ch = this._ch + n + z(this._cl, d) | 0, this._dh = this._dh + o + z(this._dl, f) | 0, this._eh = this._eh + a + z(this._el, p) | 0, this._fh = this._fh + s + z(this._fl, y) | 0, this._gh = this._gh + l + z(this._gl, g) | 0, this._hh = this._hh + u + z(this._hl, m) | 0;
    }, s.prototype._hash = function() {
      var i = o.allocUnsafe(64);

      function e(e, t, r) {
        i.writeInt32BE(e, r), i.writeInt32BE(t, r + 4);
      }

      return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), i;
    }, t.exports = s;
  }, { "./hash": 189, inherits: 142, "safe-buffer": 187 }],
  197: [function(e, t, r) {
    t.exports = i;
    var c = e("events").EventEmitter;

    function i() {
      c.call(this);
    }

    e("inherits")(i, c), i.Readable = e("readable-stream/readable.js"), i.Writable = e("readable-stream/writable.js"), i.Duplex = e("readable-stream/duplex.js"), i.Transform = e("readable-stream/transform.js"), i.PassThrough = e("readable-stream/passthrough.js"), (i.Stream = i).prototype.pipe = function(t, e) {
      var r = this;

      function i(e) {
        t.writable && !1 === t.write(e) && r.pause && r.pause();
      }

      function n() {
        r.readable && r.resume && r.resume();
      }

      r.on("data", i), t.on("drain", n), t._isStdio || e && !1 === e.end || (r.on("end", a), r.on("close", s));
      var o = !1;

      function a() {
        o || (o = !0, t.end());
      }

      function s() {
        o || (o = !0, "function" == typeof t.destroy && t.destroy());
      }

      function l(e) {
        if (u(), 0 === c.listenerCount(this, "error")) throw e;
      }

      function u() {
        r.removeListener("data", i), t.removeListener("drain", n), r.removeListener("end", a), r.removeListener("close", s), r.removeListener("error", l), t.removeListener("error", l), r.removeListener("end", u), r.removeListener("close", u), t.removeListener("close", u);
      }

      return r.on("error", l), t.on("error", l), r.on("end", u), r.on("close", u), t.on("close", u), t.emit("pipe", r), t;
    };
  }, {
    events: 108,
    inherits: 142,
    "readable-stream/duplex.js": 172,
    "readable-stream/passthrough.js": 182,
    "readable-stream/readable.js": 183,
    "readable-stream/transform.js": 184,
    "readable-stream/writable.js": 185
  }],
  198: [function(e, t, r) {
    arguments[4][181][0].apply(r, arguments);
  }, { dup: 181, "safe-buffer": 199 }],
  199: [function(e, t, r) {
    arguments[4][62][0].apply(r, arguments);
  }, { buffer: 64, dup: 62 }],
  200: [function(l, e, u) {
    !function(r, s) {
      !function() {
        var i = l("process/browser.js").nextTick, e = Function.prototype.apply, n = Array.prototype.slice, o = {},
          a = 0;

        function t(e, t) {
          this._id = e, this._clearFn = t;
        }

        u.setTimeout = function() {
          return new t(e.call(setTimeout, window, arguments), clearTimeout);
        }, u.setInterval = function() {
          return new t(e.call(setInterval, window, arguments), clearInterval);
        }, u.clearTimeout = u.clearInterval = function(e) {
          e.close();
        }, t.prototype.unref = t.prototype.ref = function() {
        }, t.prototype.close = function() {
          this._clearFn.call(window, this._id);
        }, u.enroll = function(e, t) {
          clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
        }, u.unenroll = function(e) {
          clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
        }, u._unrefActive = u.active = function(e) {
          clearTimeout(e._idleTimeoutId);
          var t = e._idleTimeout;
          0 <= t && (e._idleTimeoutId = setTimeout(function() {
            e._onTimeout && e._onTimeout();
          }, t));
        }, u.setImmediate = "function" == typeof r ? r : function(e) {
          var t = a++, r = !(arguments.length < 2) && n.call(arguments, 1);
          return o[t] = !0, i(function() {
            o[t] && (r ? e.apply(null, r) : e.call(null), u.clearImmediate(t));
          }), t;
        }, u.clearImmediate = "function" == typeof s ? s : function(e) {
          delete o[e];
        };
      }.call(this);
    }.call(this, l("timers").setImmediate, l("timers").clearImmediate);
  }, { "process/browser.js": 162, timers: 200 }],
  201: [function(e, r, t) {
    !function(t) {
      !function() {
        function i(e) {
          try {
            if (!t.localStorage) return;
          } catch (e) {
            return;
          }
          e = t.localStorage[e];
          return null != e && "true" === String(e).toLowerCase();
        }

        r.exports = function(e, t) {
          if (i("noDeprecation")) return e;
          var r = !1;
          return function() {
            if (!r) {
              if (i("throwDeprecation")) throw new Error(t);
              i("traceDeprecation") ? console.trace(t) : console.warn(t), r = !0;
            }
            return e.apply(this, arguments);
          };
        };
      }.call(this);
    }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {}],
  202: [function(e, t, r) {
    var i = e("../ui/component"), n = (e("../lib/util"), e("../lib/dom")), o = e("../lib/event"),
      a = (e("../lib/ua"), e("../lang/index")), s = e("../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.className = t.className || "prism-auto-stream-selector", this.addClass(this.className);
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div><p class='tip-text'></p></div><div class='operators'><a class='prism-button prism-button-ok' type='button'>" + a.get("OK_Text") + "</a><a class='prism-button prism-button-cancel'  target='_blank'>" + a.get("Cancel_Text") + "</a></div>", e;
        }, bindEvent: function() {
          var i = this;
          i._player.on(s.Private.AutoStreamShow, function(e) {
            var t, r = document.querySelector("#" + i.getId() + " .tip-text");
            !i._player._getLowerQualityLevel || (t = i._player._getLowerQualityLevel()) && (i._switchUrl = t, r.innerText = a.get("Auto_Stream_Tip_Text").replace("$$", t.item.desc), n.css(i.el(), "display", "block"));
          }), i._player.on(s.Private.AutoStreamHide, function(e) {
            document.querySelector("#" + i.getId() + " .tip-text");
            n.css(i.el(), "display", "none");
          });
          var e = document.querySelector("#" + i.getId() + " .prism-button-ok");
          o.on(e, "click", function() {
            i._player._changeStream && i._switchUrl && i._player._changeStream(i._switchUrl.index, a.get("Quality_Change_Text")), n.css(i.el(), "display", "none");
          });
          e = document.querySelector("#" + i.getId() + " .prism-button-cancel");
          o.on(e, "click", function() {
            n.css(i.el(), "display", "none");
          });
        }
      });
    t.exports = e;
  }, {
    "../lang/index": 212,
    "../lib/dom": 219,
    "../lib/event": 220,
    "../lib/ua": 232,
    "../lib/util": 234,
    "../player/base/event/eventtype": 244,
    "../ui/component": 296
  }],
  203: [function(e, t, r) {
    var i = e("../ui/component"), a = e("../lib/dom"), n = e("../lib/event"), o = e("../lib/ua"),
      s = e("../lib/function"), l = (e("../lang/index"), e("../lib/util")), u = e("../config"),
      c = e("../lib/playerutil"), h = e("../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.className = t.className || "prism-liveshift-progress", this.addClass(this.className), this._liveshiftService = e._liveshiftService;
        }, createEl: function() {
          var e = i.prototype.createEl.call(this);
          return e.innerHTML = "<div class=\"prism-enable-liveshift\"><div class=\"prism-progress-loaded\"></div><div class=\"prism-progress-played\"></div><div class=\"prism-progress-cursor\"><img></img></div><p class=\"prism-progress-time\"></p><div class=\"prism-liveshift-seperator\">00:00:00</div></div><div class=\"prism-disable-liveshift\"></div>", e;
        }, bindEvent: function() {
          var t = this;
          this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"), this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"), this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"), this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"), this.controlNode = document.querySelector("#" + this._player._options.id + " .prism-controlbar"), this.seperatorNode = document.querySelector("#" + this.id() + " .prism-liveshift-seperator"), this.progressNode = document.querySelector("#" + this.id() + " .prism-enable-liveshift");
          var e = document.querySelector("#" + this.id() + " .prism-progress-cursor img"),
            r = "//" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png";
          u.domain ? -1 < u.domain.indexOf("localhost") && (r = "//" + u.domain + "/build/skins/default/img/dragcursor.png") : r = this._player && this._player._options && this._player._options.sdkDomain ? this._player._options.sdkDomain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png" : "de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png", e.src = r, n.on(this.cursorNode, "mousedown", function(e) {
            t._onMouseDown(e);
          }), n.on(this.cursorNode, "touchstart", function(e) {
            t._onMouseDown(e);
          }), n.on(this.progressNode, "mousemove", function(e) {
            t._progressMove(e);
          }), n.on(this.progressNode, "touchmove", function(e) {
            t._progressMove(e);
          }), n.on(this._el, "click", function(e) {
            t._onMouseClick(e);
          }), this._player.on(h.Private.HideProgress, function(e) {
            t._hideProgress(e);
          }), this._player.on(h.Private.CancelHideProgress, function(e) {
            t._cancelHideProgress(e);
          }), this._player.on(h.Private.ShowBar, function() {
            t._updateLayout();
          }), n.on(this.progressNode, h.Private.MouseOver, function(e) {
            t._onMouseOver(e);
          }), n.on(this.progressNode, h.Private.MouseOut, function(e) {
            t._onMouseOut(e);
          }), this.bindTimeupdate = s.bind(this, this._onTimeupdate), this._player.on(h.Player.TimeUpdate, this.bindTimeupdate), c.isLiveShift(this._player._options) && this._player.on(h.Player.Play, function() {
            t._liveshiftService.start(6e4, function(e) {
              e = { mediaId: t._player._options.vid || "", error_code: e.Code, error_msg: e.Message };
              t._player.logError(e), t._player.trigger(h.Player.Error, e);
            });
          }), this._player.on(h.Private.LiveShiftQueryCompleted, function() {
            t._updateSeperator(), t._updateLayout();
          }), this._player.on(h.Player.Pause, function() {
            t._liveshiftService.stop();
          }), o.IS_IPAD ? this.interval = setInterval(function() {
            t._onProgress();
          }, 500) : this._player.on(h.Video.Progress, function() {
            t._onProgress();
          });
        }, _updateSeperator: function() {
          this._liveshiftService.currentTimeDisplay && (this.seperatorNode.innerText = this._liveshiftService.currentTimeDisplay);
        }, _updateLayout: function() {
          var e = this.seperatorNode.offsetWidth, t = this.el().offsetWidth, r = t - e;
          0 != e && 0 != r && (a.css(this.progressNode, "width", 100 * (r - 10) / t + "%"), a.css(this.seperatorNode, "right", -1 * (e + 10) + "px"));
        }, _progressMove: function(e) {
          var t = this._getSeconds(e), e = this._liveshiftService.availableLiveShiftTime;
          this.timeNode.innerText = "-" + l.formatTime(e - t);
          t = e ? t / e : 0, e = 1 - this.timeNode.clientWidth / this.el().clientWidth;
          e < t && (t = e), this.timeNode && a.css(this.timeNode, "left", 100 * t + "%");
        }, _hideProgress: function(e) {
          n.off(this.cursorNode, "mousedown"), n.off(this.cursorNode, "touchstart");
        }, _cancelHideProgress: function(e) {
          var t = this;
          n.on(this.cursorNode, "mousedown", function(e) {
            t._onMouseDown(e);
          }), n.on(this.cursorNode, "touchstart", function(e) {
            t._onMouseDown(e);
          });
        }, _canSeekable: function(e) {
          var t = !0;
          return t = "function" == typeof this._player.canSeekable ? this._player.canSeekable(e) : t;
        }, _onMouseOver: function(e) {
          this._updateCursorPosition(this._getCurrentTime()), a.css(this.timeNode, "display", "block");
        }, _onMouseOut: function(e) {
          a.css(this.timeNode, "display", "none");
        }, _getSeconds: function(e) {
          for (var t = this.el().offsetLeft, r = this.el(); r = r.offsetParent;) {
            var i = a.getTranslateX(r);
            t += r.offsetLeft + i;
          }
          var n = (e.touches ? e.touches[0] : e).pageX, o = this.progressNode.offsetWidth,
            e = this._liveshiftService.availableLiveShiftTime;
          return sec = e ? (n - t) / o * e : 0, sec < 0 && (sec = 0), sec > e && (sec = e), sec;
        }, _onMouseClick: function(e) {
          var t = this, r = this._getSeconds(e), i = this._liveshiftService.availableLiveShiftTime - r;
          this._player.trigger(h.Private.SeekStart, { fromTime: this._getCurrentTime() });
          var n = this._liveshiftService.getSourceUrl(i), e = t._player._options.source,
            i = c.isHls(t._player._options.source);
          i && n == e ? t._player.seek(r) : t._player._loadByUrlInner(n, r, !0), t._player.trigger(h.Private.Play_Btn_Hide), t._liveshiftService.seekTime = r, t._player.trigger(h.Private.EndStart, { toTime: r }), t._updateCursorPosition(r), i && setTimeout(function() {
            t._player.play();
          });
        }, _onMouseDown: function(e) {
          var t = this;
          e.preventDefault(), this._player.trigger(h.Private.SeekStart, { fromTime: this._getCurrentTime() }), n.on(this.controlNode, "mousemove", function(e) {
            t._onMouseMove(e);
          }), n.on(this.controlNode, "touchmove", function(e) {
            t._onMouseMove(e);
          }), n.on(this.controlNode, "mouseup", function(e) {
            t._onMouseUp(e);
          }), n.on(this.controlNode, "touchend", function(e) {
            t._onMouseUp(e);
          });
        }, _onMouseUp: function(e) {
          e.preventDefault(), n.off(this.controlNode, "mousemove"), n.off(this.controlNode, "touchmove"), n.off(this._player.tag, "mouseup"), n.off(this._player.tag, "touchend"), n.off(this.controlNode, "mouseup"), n.off(this.controlNode, "touchend");
          e = this._liveshiftService.availableLiveShiftTime, e = this.playedNode.offsetWidth / this.el().offsetWidth * e;
          this._player.seek(e), this._player.trigger(h.Private.Play_Btn_Hide), this._liveshiftService.seekTime = e, this._player.trigger(h.Private.EndStart, { toTime: e });
        }, _onMouseMove: function(e) {
          e.preventDefault();
          e = this._getSeconds(e);
          this._updateProgressBar(this.playedNode, e), this._updateCursorPosition(e);
        }, _onTimeupdate: function(e) {
          this._updateProgressBar(this.playedNode, this._getCurrentTime()), this._updateCursorPosition(this._getCurrentTime()), this._player.trigger(h.Private.UpdateProgressBar, { time: this._getCurrentTime() });
        }, _getCurrentTime: function() {
          var e = this._liveshiftService.seekTime;
          return -1 == e && (e = 0), this._player.getCurrentTime() + e;
        }, _onProgress: function(e) {
          this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1));
        }, _updateProgressBar: function(e, t) {
          var r, i;
          1 != this._player._switchSourcing && (i = 0, -1 == this._liveshiftService.seekTime ? i = 1 : 1 < (i = (r = this._liveshiftService.availableLiveShiftTime) ? t / r : 0) && (this._liveshiftService.seekTime = -(i = 1)), this.liveShiftStartDisplay, e && a.css(e, "width", 100 * i + "%"));
        }, _updateCursorPosition: function(e) {
          var t, r, i, n;
          !this._player.el() || 1 == this._player._switchSourcing || 0 == e && 0 == this._player.tag.readyState || (r = 0, n = 1, i = this._player.el().clientWidth, -1 == this._liveshiftService.seekTime ? r = 1 : 1 < (r = (t = this._liveshiftService.availableLiveShiftTime) ? e / t : 0) && (this._liveshiftService.seekTime = -1), 0 != i && (n = 1 - (i = 18 / i), r -= i), this.cursorNode && (n < r ? (a.css(this.cursorNode, "right", "0px"), a.css(this.cursorNode, "left", "auto")) : (a.css(this.cursorNode, "right", "auto"), a.css(this.cursorNode, "left", 100 * r + "%"))));
        }
      });
    t.exports = e;
  }, {
    "../config": 205,
    "../lang/index": 212,
    "../lib/dom": 219,
    "../lib/event": 220,
    "../lib/function": 221,
    "../lib/playerutil": 230,
    "../lib/ua": 232,
    "../lib/util": 234,
    "../player/base/event/eventtype": 244,
    "../ui/component": 296
  }],
  204: [function(e, t, r) {
    var i = e("../ui/component"), n = e("../lib/util"), o = e("../player/base/event/eventtype"), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.className = t.className || "prism-live-time-display", this.addClass(this.className), this._liveshiftService = e._liveshiftService;
      }, createEl: function() {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = "<span class=\"current-time\">00:00</span> <span class=\"time-bound\">/</span> <span class=\"end-time\">00:00</span><span class=\"live-text\">Live: </span><span class=\"live-time\"></span>", e;
      }, bindEvent: function() {
        var i = this;
        this._player.on(o.Video.TimeUpdate, function() {
          var e, t = i._liveshiftService, r = document.querySelector("#" + i.id() + " .current-time");
          t.liveShiftStartDisplay && t.availableLiveShiftTime > t.seekTime && -1 != t.seekTime ? (e = i._liveshiftService.getBaseTime(), e = n.formatTime(e + i._player.getCurrentTime()), r.innerText = e) : t.currentTimeDisplay && (r.innerText = t.currentTimeDisplay);
        }), this._player.on(o.Private.LiveShiftQueryCompleted, function() {
          i.updateTime();
        });
      }, updateTime: function() {
        document.querySelector("#" + this.id() + " .end-time").innerText = this._liveshiftService.liveTimeRange.endDisplay, document.querySelector("#" + this.id() + " .live-time").innerText = this._liveshiftService.currentTimeDisplay;
      }
    });
    t.exports = e;
  }, { "../lib/util": 234, "../player/base/event/eventtype": 244, "../ui/component": 296 }],
  205: [function(e, t, r) {
    t.exports = {
      domain: "g.alicdn.com",
      flashVersion: "2.8.2",
      h5Version: "2.9.7",
      rtsVersion: "1.2.4",
      cityBrain: !0,
      logDuration: 10,
      logCount: 100,
      logReportTo: "https://videocloud.cn-hangzhou.log.aliyuncs.com/logstores/newplayer/track"
    };
  }, {}],
  206: [function(e, t, r) {
    e("./lang/index").load();
    var i = e("./player/adaptivePlayer"), n = e("./lib/componentutil"), o = e("./config"), e = function(e, t) {
      return i.create(e, t);
    };
    e.getVersion = function() {
      return o.h5Version;
    }, n.register(e);
    var a = window.Aliplayer = e;
    e.players = {}, "function" == typeof define && define.amd ? define([], function() {
      return a;
    }) : "object" == typeof r && "object" == typeof t && (t.exports = a), "undefined" != typeof Uint8Array && (Uint8Array.prototype.slice || Object.defineProperty(Uint8Array.prototype, "slice", { value: Array.prototype.slice }));
  }, { "./config": 205, "./lang/index": 212, "./lib/componentutil": 215, "./player/adaptivePlayer": 241 }],
  207: [function(e, t, r) {
    var i = e("../lib/oo"), n = e("../lang/index"), i = i.extend({
      init: function(e, t) {
        this._player = e, this._options = e.options();
      }
    });
    i.prototype.handle = function(e) {
      var t, r;
      this._options.autoPlayDelay && (t = (t = this._options.autoPlayDelayDisplayText) || n.get("AutoPlayDelayDisplayText").replace("$$", this._options.autoPlayDelay), this._player.trigger("info_show", t), this._player.trigger("h5_loading_hide"), this._player.trigger("play_btn_hide"), (r = this)._timeHandler = setTimeout(function() {
        r._player.trigger("info_hide"), r._options.autoPlayDelay = 0, e && e();
      }, 1e3 * this._options.autoPlayDelay), this._player.on("play", function() {
        o(r);
      }), this._player.on("pause", function() {
        o(r);
      }));
    }, i.prototype.dispose = function() {
      o(this), this._player = null;
    };
    var o = function(e) {
      e._timeHandler && (clearTimeout(e._timeHandler), e._timeHandler = null);
    };
    t.exports = i;
  }, { "../lang/index": 212, "../lib/oo": 228 }],
  208: [function(e, t, r) {
    var i = e("../lib/event"), n = e("../lib/data"), o = e("../player/base/event/eventtype"), a = n.guid(), n = {};

    function s(e) {
      var t = this._options.keyFastForwardStep, r = this._options.isLive;
      switch (e && e.keyCode) {
        case 39:
          if (r) return;
          e.preventDefault();
          var i = this.getDuration(), n = this.getCurrentTime() + t;
          this.seek(n = i < n ? i : n), l.call(this, n), u.call(this, n);
          break;
        case 37:
          if (r) return;
          e.preventDefault();
          n = this.getCurrentTime() - t;
          this.seek(n = n < 0 ? 0 : n), l.call(this, n), u.call(this, n);
          break;
        case 38:
          e.preventDefault(), this.getVolume() < 1 && 0 <= this.getVolume() && this.setVolume((this.getVolume() + .1).toFixed(1));
          break;
        case 40:
          e.preventDefault(), 0 < this.getVolume() && this.getVolume() <= 1 && this.setVolume((this.getVolume() - .1).toFixed(1));
          break;
        case 32:
          if (r) return;
          e.preventDefault(), this.tag.paused ? this.play(!0) : this.pause(!0);
      }
    }

    function l(e) {
      this.trigger(o.Private.UpdateProgress, { targetTime: e });
    }

    function u(e) {
      this.trigger(o.Private.UpdateCursorPosition, { targetTime: e });
    }

    n.init = function() {
      var e;
      this._options.keyShortCuts && ((e = s.bind(this)).guid = a, i.on(window.document, "keydown", e));
    }, n.dispose = function() {
      var e;
      this._options.keyShortCuts && ((e = s.bind(this)).guid = a, i.off(window.document, "keydown", e));
    }, t.exports = n;
  }, { "../lib/data": 218, "../lib/event": 220, "../player/base/event/eventtype": 244 }],
  209: [function(e, t, r) {
    t.exports = t.exports = {
      OD: "OD",
      FD: "360p",
      LD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Speed: "Speed",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "Normal",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Refresh_Text: "Refresh",
      Cancel: "Cancel",
      Mute: "Mute",
      Snapshot: "Snapshot",
      Detection_Text: "Diagnosis",
      Play_DateTime: "Time",
      Quality_Change_Fail_Switch_Text: "Cannot play, switch to ",
      Quality_Change_Text: "Switch to ",
      Quality_The_Url: "The url",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Error_Load_Abort_Text: "Data abort erro",
      Error_Network_Text: "Loading failed due to network error",
      Error_Decode_Text: "Decode error",
      Error_Server_Network_NotSupport_Text: "Network error or \xa0the format of video is unsupported",
      Error_Offline_Text: "The network is unreachable, please click Refresh",
      Error_Play_Text: "Error occured while playing",
      Error_Retry_Text: " Please close or refresh",
      Error_AuthKey_Text: "Authentication expired or the domain is not in white list",
      Error_H5_Not_Support_Text: "The format of video is not supported by\xa0h5 player\uff0cplease use flash player",
      Error_Not_Support_M3U8_Text: "The format of m3u8 is not supported by this explorer",
      Error_Not_Support_MP4_Text: "The format of mp4\xa0is not supported by this explorer",
      Error_Not_Support_encrypt_Text: "Play the encrypted video,please set encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "The url is empty",
      Error_Vod_Fetch_Urls_Text: "Error occured when fetch urls\uff0cplease close or refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Error_Playauth_Decode_Text: "PlayAuth parse failed",
      Error_Vid_Not_Same_Text: "Cannot renew url due to vid changed",
      Error_Playauth_Expired_Text: "Playauth expired, please close or refresh",
      Error_MTS_Fetch_Urls_Text: "Error occurred while requesting mst server",
      Error_Load_M3U8_Failed_Text: "The m3u8 file loaded failed,please make sure domain configuration https certificate or enable cors",
      Error_Load_M3U8_Timeout_Text: "Timeout error occored\xa0when the\xa0m3u8 file loaded",
      Error_M3U8_Decode_Text: "The m3u8 file decoded failed",
      Error_TX_Decode_Text: "Video decoded failed",
      Error_Waiting_Timeout_Text: "Buffering timeout,\xa0please close or refresh",
      Error_Invalidate_Source: "Video shoud be mp4\u3001mp3\u3001m3u8\u3001mpd or flv",
      Error_Empty_Source: "Video URL shouldn't be empty",
      Error_Vid_Empty_Source: "vid's video URL hasn't been fetched",
      Error_Fetch_NotStream: "The vid has no stream to play",
      Error_Not_Found: "Url is not found",
      Live_End: "Live has finished",
      Play_Before_Fullscreen: "Please play before fullscreen",
      Can_Not_Seekable: "Can not seek to this position",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Request_Block_Text: "This request is blocked, the video Url should be over https",
      Open_Html_By_File: "Html page should be on the server",
      Maybe_Cors_Error: "please make sure domain configuration https certificate or enable cors",
      Speed_Switch_To: "Speed switch to ",
      Curent_Volume: "Current volume:",
      Volume_Mute: "set to mute",
      Volume_UnMute: "set to unmute",
      ShiftLiveTime_Error: "Live start time should not be greater than over time",
      Error_Not_Support_Format_On_Mobile: "flv\u3001rmtp can't be supported on mobile\uff0cplease use m3u8",
      SessionId_Ticket_Invalid: "please assign value for sessionId and ticket properties",
      Http_Error: " An HTTP network request failed with an error, but not from the server.",
      Http_Timeout: "A network request timed out",
      DRM_License_Expired: "DRM license is expired, please refresh",
      Not_Support_DRM: "Browser doesn't support DRM",
      CC_Switch_To: "Subtitle switch to ",
      AudioTrack_Switch_To: "Audio tracks switch to ",
      Subtitle: "Subtitle/CC",
      AudioTrack: "Audio Track",
      Quality: "Quality",
      Auto: "Auto",
      Quality_Switch_To: "Quality switch to ",
      Fullscreen: "Full Screen",
      Setting: "Settings",
      Volume: "Volume",
      Play: "Play",
      Pause: "Pause",
      CloseSubtitle: "Close CC",
      OpenSubtitle: "Open CC",
      ExistFullScreen: "Exit Full Screen",
      Muted: "Muted",
      Retry: "Retry",
      SwitchToLive: "Return to live",
      iOSNotSupportVodEncription: "iOS desn't suport Vod's encription video",
      UseChromeForVodEncription: "This browser desn't suport Vod's encription video, please use latest Chrome",
      Http_Request_Error: "http request error",
      ERROR_PLAY_FAILED: "play faild error",
      Browser_Not_Support: "browser not support",
      Not_Support_Webrtc: "not support webrtc",
      Browser_Version_Too_Low: "browser version too low",
      Not_Support_H264: "not support h264",
      Create_Offer_Error: "create offer error",
      Play_Url_Error: "play url error",
      Subscribe_Nonthing: "subscribe nonthing",
      Html_Element_Error: "html element error",
      Html_Element_Not_Match: "html element not match"
    };
  }, {}],
  210: [function(e, t, r) {
    t.exports = t.exports = {
      OD: "OD",
      LD: "360p",
      FD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Forbidden_Text: "Internal information is strictly forbidden to outsider",
      Refresh: "Refresh",
      Diagnosis: "Diagnosis",
      Live_Finished: "Live has finished, thanks for watching",
      Play: "Play",
      Pause: "Pause",
      Snapshot: "Snapshot",
      Replay: "Replay",
      Live: "Live",
      Encrypt: "Encrypt",
      Sound: "Sound",
      Fullscreen: "Full Screen",
      Exist_Fullscreen: "Exit Full-screen",
      Resolution: "Resolution",
      Next: "Next Video",
      Brightness: "Brightness",
      Default: "Default",
      Contrast: "Contrast",
      Titles_Credits: "Titles\xa0and\xa0Credits",
      Skip_Titles: "Skip Titles",
      Skip_Credits: "Skip Credits",
      Not_Support_Out_Site: "The video is not supported for outside website, please watch it by TaoTV",
      Watch_Now: "Watch now",
      Network_Error: "Network is unreachable, please try to refresh",
      Video_Error: "Playing a video error,\xa0please try to refresh",
      Decode_Error: "Data decoding\xa0error",
      Live_Not_Start: "Live has not started, to be expected",
      Live_Loading: "Live information is loading,\xa0please try to refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Live_End: "Live has finished",
      Live_Abrot: "Signal aborted,\xa0please try to refresh",
      Corss_Domain_Error: "Please ensure your domain has obtained IPC license and combined CNAME, \r\n or to set\xa0\xa0cross-domain accessing available",
      Url_Timeout_Error: "The video url is timeout,\xa0please try to refresh",
      Connetction_Error: "Sorry\uff0cthe video cannot play because of connection error, please try to watch other videos",
      Fetch_MTS_Error: "Fetching video list failed, please ensure",
      Token_Expired_Error: "Requesting open api failed, please ensure token expired or not",
      Video_Lists_Empty_Error: "The video list is empty, please check the format of video",
      Encrypted_Failed_Error: "Fetching encrypted file failed, please check the permission of player",
      Fetch_Failed_Permission_Error: "Fetching video list failed, please check the permission of player",
      Invalidate_Param_Error: "No video url, please check the parameters",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Fetch_MTS_NOT_NotStream_Error: "The vid has no stream to play",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Open_Html_By_File: "Html page should be on the server",
      Cant_Use_Flash_On_Mobile: "Mobile doesn't support flash player\uff0cplease use h5 player",
      Flash_Not_Ready: "Flash Player plugin hasn't been installed <a href='https://www.flash.cn/' target='_blank'>install plugin</a>, or check if disable Flash plugin"
    };
  }, {}],
  211: [function(e, t, r) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Forbidden_Text: "\u5185\u90e8\u4fe1\u606f\uff0c\u4e25\u7981\u5916\u4f20",
      Refresh: "\u5237\u65b0",
      Diagnosis: "\u8bca\u65ad",
      Live_Finished: "\u76f4\u64ad\u5df2\u7ed3\u675f,\u8c22\u8c22\u89c2\u770b",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      Snapshot: "\u622a\u56fe",
      Replay: "\u91cd\u64ad",
      Live: "\u76f4\u64ad",
      Encrypt: "\u52a0\u5bc6",
      Sound: "\u58f0\u97f3",
      Fullscreen: "\u5168\u5c4f",
      Exist_Fullscreen: "\u9000\u51fa\u5168\u5c4f",
      Resolution: "\u6e05\u6670\u5ea6",
      Next: "\u4e0b\u4e00\u96c6",
      Brightness: "\u4eae\u5ea6",
      Default: "\u9ed8\u8ba4",
      Contrast: "\u5bf9\u6bd4\u5ea6",
      Titles_Credits: "\u7247\u5934\u7247\u5c3e",
      Skip_Titles: "\u8df3\u8fc7\u7247\u5934",
      Skip_Credits: "\u8df3\u8fc7\u7247\u5c3e",
      Not_Support_Out_Site: "\u8be5\u89c6\u9891\u6682\u4e0d\u652f\u6301\u7ad9\u5916\u64ad\u653e\uff0c\u8bf7\u5230\u6dd8TV\u89c2\u770b",
      Watch_Now: "\u7acb\u5373\u89c2\u770b",
      Network_Error: "\u7f51\u7edc\u65e0\u6cd5\u8fde\u63a5\uff0c\u8bf7\u5c1d\u8bd5\u68c0\u67e5\u7f51\u7edc\u540e\u5237\u65b0\u8bd5\u8bd5",
      Video_Error: "\u89c6\u9891\u64ad\u653e\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Decode_Error: "\u64ad\u653e\u6570\u636e\u89e3\u7801\u9519\u8bef",
      Live_Not_Start: "\u4eb2\uff0c\u76f4\u64ad\u8fd8\u672a\u5f00\u59cb\u54e6\uff0c\u656c\u8bf7\u671f\u5f85",
      Live_Loading: "\u76f4\u64ad\u4fe1\u606f\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Live_Abrot: "\u5f53\u524d\u76f4\u64ad\u4fe1\u53f7\u4e2d\u65ad\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Corss_Domain_Error: "\u8bf7\u786e\u8ba4\u60a8\u7684\u57df\u540d\u5df2\u5b8c\u6210\u5907\u6848\u548cCNAME\u7ed1\u5b9a\uff0c\r\n\u5e76\u5904\u4e8e\u542f\u7528\u72b6\u6001\uff0c\u6216\u8d44\u6e90\u5141\u8bb8\u8de8\u8d8a\u8bbf\u95ee",
      Url_Timeout_Error: "\u60a8\u6240\u89c2\u770b\u7684\u89c6\u9891\u5730\u5740\u8fde\u63a5\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Connetction_Error: "\u62b1\u6b49,\u8be5\u89c6\u9891\u7531\u4e8e\u8fde\u63a5\u9519\u8bef\u6682\u65f6\u4e0d\u80fd\u64ad\u653e,\u8bf7\u89c2\u770b\u5176\u5b83\u89c6\u9891",
      Fetch_MTS_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4",
      Token_Expired_Error: "\u8bf7\u6c42\u63a5\u53e3\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4Token\u662f\u5426\u8fc7\u671f",
      Video_Lists_Empty_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u4e3a\u7a7a\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6570\u636e\u4e0e\u683c\u5f0f",
      Encrypted_Failed_Error: "\u83b7\u53d6\u89c6\u9891\u52a0\u5bc6\u79d8\u94a5\u9519\u8bef\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Fetch_Failed_Permission_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Invalidate_Param_Error: "\u65e0\u8f93\u5165\u89c6\u9891\uff0c\u8bf7\u786e\u8ba4\u8f93\u5165\u53c2\u6570",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Fetch_MTS_NOT_NotStream_Error: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Cant_Use_Flash_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301Flash\u64ad\u653e\u5668\uff0c\u8bf7\u4f7f\u7528h5\u64ad\u653e\u5668",
      Flash_Not_Ready: "Flash Player\u63d2\u4ef6\u672a\u5b89\u88c5<a href='https://www.flash.cn/' target='_blank'>\u5b89\u88c5\u63d2\u4ef6</a>\uff0c\u5982\u679c\u5df2\u7ecf\u5b89\u88c5\u8bf7\u68c0\u67e5\u662f\u5426\u88ab\u7981\u7528"
    };
  }, {}],
  212: [function(o, e, t) {
    function n() {
      var e;
      return void 0 !== window[s] && window[s] || (e = (e = (navigator.language || navigator.browserLanguage).toLowerCase()) && -1 < e.indexOf("zh") ? "zh-cn" : "en-us", window[s] = e), window[s];
    }

    var r = o("../config"), a = o("../lib/storage"), s = (o("../lib/io"), "aliplayer_lang"), l = function(e, t) {
      var r = h(e), i = "", n = c(),
        i = "flash" == e ? "en-us" == n ? o("./flash/en-us") : "zh-cn" == n ? o("./flash/zh-cn") : t[n] : "en-us" == n ? o("./en-us") : "zh-cn" == n ? o("./zh-cn") : t[n];
      a.set(r, JSON.stringify(i)), u(e, i);
    }, u = function(e, t) {
      e = h(e);
      window[e] = t;
    }, c = function() {
      return n();
    }, h = function(e) {
      var t = c();
      return "aliplayer_lang_data_" + (e = e || "h5") + "_" + r.h5Version.replace(/\./g, "_") + "_" + t;
    };
    e.exports.setCurrentLanguage = function(e, t, r) {
      var i = window[s];
      if ("en-us" != (e = void 0 === e || !e ? n() : e) && "zh-cn" != e && (!r || r && !r[e])) throw new Error("There is not language resource for " + e + ", please specify the language resource by languageTexts property");
      window[s] = e, l(t, r), e != i && o("../lib/constants").updateByLanguage();
    }, e.exports.getCurrentLanguage = n, e.exports.getLanguageData = function(e, t) {
      e = h(e);
      return window[e];
    }, e.exports.load = l, e.exports.get = function(e, t) {
      t = h(t = t || "h5"), t = window[t];
      if (t) return t[e];
    };
  }, {
    "../config": 205,
    "../lib/constants": 216,
    "../lib/io": 225,
    "../lib/storage": 231,
    "./en-us": 209,
    "./flash/en-us": 210,
    "./flash/zh-cn": 211,
    "./zh-cn": 213
  }],
  213: [function(e, t, r) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Speed: "\u500d\u901f",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "\u6b63\u5e38",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Quality_Change_Fail_Switch_Text: "\u4e0d\u80fd\u64ad\u653e\uff0c\u5207\u6362\u4e3a",
      Quality_Change_Text: "\u6b63\u5728\u4e3a\u60a8\u5207\u6362\u5230 ",
      Quality_The_Url: "\u6b64\u5730\u5740",
      Refresh_Text: "\u5237\u65b0",
      Detection_Text: "\u8bca\u65ad",
      Cancel: "\u53d6\u6d88",
      Mute: "\u9759\u97f3",
      Snapshot: "\u622a\u56fe",
      Play_DateTime: "\u64ad\u653e\u65f6\u95f4",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Error_Load_Abort_Text: "\u83b7\u53d6\u6570\u636e\u8fc7\u7a0b\u88ab\u4e2d\u6b62",
      Error_Network_Text: "\u7f51\u7edc\u9519\u8bef\u52a0\u8f7d\u6570\u636e\u5931\u8d25",
      Error_Decode_Text: "\u89e3\u7801\u9519\u8bef",
      Error_Server_Network_NotSupport_Text: "\u670d\u52a1\u5668\u3001\u7f51\u7edc\u9519\u8bef\u6216\u683c\u5f0f\u4e0d\u652f\u6301",
      Error_Offline_Text: "\u7f51\u7edc\u4e0d\u53ef\u7528\uff0c\u8bf7\u786e\u5b9a",
      Error_Play_Text: "\u64ad\u653e\u51fa\u9519\u5566",
      Error_Retry_Text: "\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_AuthKey_Text: "\u53ef\u80fd\u9274\u6743\u8fc7\u671f\u3001\u57df\u540d\u4e0d\u5728\u767d\u540d\u5355\u6216\u8bf7\u6c42\u88ab\u62e6\u622a",
      Error_H5_Not_Support_Text: "h5\u4e0d\u652f\u6301\u6b64\u683c\u5f0f\uff0c\u8bf7\u4f7f\u7528flash\u64ad\u653e\u5668",
      Error_Not_Support_M3U8_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301m3u8\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_MP4_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301mp4\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_encrypt_Text: "\u64ad\u653e\u52a0\u5bc6\u89c6\u9891\uff0c\u8bf7\u8bbe\u7f6e\u5c5e\u6027encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "\u83b7\u53d6\u64ad\u653e\u5730\u5740\u4e3a\u7a7a",
      Error_Vod_Fetch_Urls_Text: "\u83b7\u53d6\u5730\u5740\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Playauth_Decode_Text: "playauth\u89e3\u6790\u9519\u8bef",
      Error_Vid_Not_Same_Text: "\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4",
      Error_Playauth_Expired_Text: "\u51ed\u8bc1\u5df2\u8fc7\u671f\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_MTS_Fetch_Urls_Text: "MTS\u83b7\u53d6\u53d6\u6570\u5931\u8d25",
      Error_Load_M3U8_Failed_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u5931\u8d25,\u8bf7\u786e\u8ba4\u57df\u540d\u662f\u5426\u914d\u7f6e\u4e86https\u8bc1\u4e66\u6216\u8005\u662f\u5426\u5f00\u542f\u4e86\u5141\u8bb8\u8de8\u57df\u8bbf\u95ee",
      Error_Load_M3U8_Timeout_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u8d85\u65f6",
      Error_M3U8_Decode_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u89e3\u6790\u5931\u8d25",
      Error_TX_Decode_Text: "\u89e3\u6790\u6570\u636e\u51fa\u9519",
      Error_Waiting_Timeout_Text: "\u7f13\u51b2\u6570\u636e\u8d85\u65f6\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Invalidate_Source: "\u64ad\u653e\u5730\u5740\u683c\u5f0f\u9700\u8981\u4e3amp4\u3001mp3\u3001m3u8\u3001mpd\u6216flv",
      Error_Empty_Source: "\u64ad\u653e\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a",
      Error_Vid_Empty_Source: "vid\u5bf9\u5e94\u7684\u89c6\u9891\u5730\u5740\u8fd8\u672a\u83b7\u53d6\u5230",
      Error_Fetch_NotStream: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Error_Not_Found: "\u64ad\u653e\u5730\u5740\u4e0d\u5b58\u5728",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Play_Before_Fullscreen: "\u64ad\u653e\u540e\u518d\u5168\u5c4f",
      Can_Not_Seekable: "\u4e0d\u80fdseek\u5230\u8fd9\u91cc",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Request_Block_Text: "\u6d4f\u89c8\u5668\u5b89\u5168\u7b56\u7565\u89c6\u9891\u5730\u5740\u4e0d\u80fd\u4e3ahttp\u534f\u8bae\uff0c\u4e0e\u7f51\u7ad9https\u534f\u8bae\u4e0d\u4e00\u81f4",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Maybe_Cors_Error: "\u8bf7\u786e\u8ba4\u57df\u540d\u662f\u5426\u914d\u7f6e\u4e86https\u8bc1\u4e66\u6216\u8005\u662f\u5426\u5f00\u542f\u4e86\u5141\u8bb8\u8de8\u57df\u8bbf\u95ee",
      Speed_Switch_To: "\u500d\u901f\u5207\u6362\u5230 ",
      Curent_Volume: "\u5f53\u524d\u97f3\u91cf\uff1a",
      Volume_Mute: "\u8bbe\u7f6e\u4e3a\u9759\u97f3",
      Volume_UnMute: "\u8bbe\u7f6e\u4e3a\u975e\u9759\u97f3",
      ShiftLiveTime_Error: "\u76f4\u64ad\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u76f4\u64ad\u7ed3\u675f\u65f6\u95f4",
      Error_Not_Support_Format_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301flv\u3001rmtp\u89c6\u9891\uff0c\u8bf7\u4f7f\u7528m3u8",
      SessionId_Ticket_Invalid: "DRM\u89c6\u9891\u64ad\u653e\uff0csessionId\u548cticket\u5c5e\u6027\u4e0d\u80fd\u4e3a\u7a7a",
      Http_Error: "Http\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25",
      Http_Timeout: "http\u8bf7\u6c42\u8d85\u65f6",
      DRM_License_Expired: "DRM license\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0",
      Not_Support_DRM: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301DRM\u89c6\u9891\u7684\u64ad\u653e\u6216\u672a\u53d7\u5230\u7528\u6237\u8bb8\u53ef",
      CC_Switch_To: "\u5b57\u5e55\u5207\u6362\u5230 ",
      AudioTrack_Switch_To: "\u97f3\u8f68\u5207\u6362\u5230 ",
      Subtitle: "\u5b57\u5e55",
      AudioTrack: "\u97f3\u8f68",
      Quality: "\u6e05\u6670\u5ea6",
      Auto: "\u81ea\u52a8",
      Quality_Switch_To: "\u6e05\u6670\u5ea6\u5207\u6362\u5230 ",
      Fullscreen: "\u5168\u5c4f",
      Setting: "\u8bbe\u7f6e",
      Volume: "\u97f3\u91cf",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      CloseSubtitle: "\u5173\u95ed\u5b57\u5e55",
      OpenSubtitle: "\u6253\u5f00\u5b57\u5e55",
      ExistFullScreen: "\u9000\u51fa\u5168\u5c4f",
      Muted: "\u9759\u97f3",
      Retry: "\u91cd\u8bd5",
      SwitchToLive: "\u8fd4\u56de\u76f4\u64ad",
      iOSNotSupportVodEncription: "iOS\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e",
      UseChromeForVodEncription: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e\uff0c\u8bf7\u4f7f\u7528\u6700\u65b0Chrome\u6d4f\u89c8\u5668",
      Http_Request_Error: "\u4fe1\u4ee4\u8bf7\u6c42\u5931\u8d25",
      ERROR_PLAY_FAILED: "\u64ad\u653e\u5931\u8d25",
      Browser_Not_Support: "\u4e0d\u652f\u6301\u6b64\u6d4f\u89c8\u5668",
      Not_Support_Webrtc: "\u4e0d\u652f\u6301webrtc",
      Browser_Version_Too_Low: "\u6d4f\u89c8\u5668\u7248\u672c\u8fc7\u4f4e",
      Not_Support_H264: "\u4e0d\u652f\u6301H264",
      Create_Offer_Error: "create offer\u5931\u8d25",
      Play_Url_Error: "\u64ad\u653eurl\u534f\u8bae\u9519\u8bef",
      Subscribe_Nonthing: "\u53c2\u6570\u8bbe\u7f6e\u9519\u8bef",
      Html_Element_Error: "\u4f20\u5165\u7684HtmlElement\u9519\u8bef",
      Html_Element_Not_Match: "\u8ba2\u9605\u7684\u5185\u5bb9\u548c\u4f20\u5165\u7684\u53c2\u6570\u4e0d\u5339\u914d"
    };
  }, {}],
  214: [function(e, t, r) {
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (window.Uint8Array) for (var c = new Uint8Array(256), i = 0; i < o.length; i++) c[o.charCodeAt(i)] = i;
    var l = function(e) {
      for (var t = "", r = 0; r < e.length; r += 16e3) {
        var i = e.subarray(r, r + 16e3);
        t += String.fromCharCode.apply(null, i);
      }
      return t;
    };
    unpackPlayReady = function(e) {
      e = function(e, t, r) {
        if (!e) return "";
        r || e.byteLength % 2 == 0 || console.log("Data has an incorrect length, must be even.");
        for (var i = e instanceof ArrayBuffer ? e : ((i = new Uint8Array(e.byteLength)).set(new Uint8Array(e)), i.buffer), n = Math.floor(e.byteLength / 2), o = new Uint16Array(n), a = new DataView(i), s = 0; s < n; s++) o[s] = a.getUint16(2 * s, t);
        return l(o);
      }(e, !0, !0);
      if (-1 != e.indexOf("PlayReadyKeyMessage")) {
        for (var e = (new DOMParser).parseFromString(e, "application/xml"), t = e.getElementsByTagName("HttpHeader"), r = {}, i = 0; i < t.length; ++i) {
          var n = t[i].querySelector("name"), o = t[i].querySelector("value");
          r[n.textContent] = o.textContent;
        }
        return { header: r, changange: e.querySelector("Challenge").textContent };
      }
      console.log("PlayReady request is already unwrapped.");
    }, t.exports = {
      decode: function(e) {
        var t, r, i, n, o = .75 * e.length, a = e.length, s = 0;
        "=" === e[e.length - 1] && (o--, "=" === e[e.length - 2] && o--);
        for (var o = new ArrayBuffer(o), l = new Uint8Array(o), u = 0; u < a; u += 4) t = c[e.charCodeAt(u)], r = c[e.charCodeAt(u + 1)], i = c[e.charCodeAt(u + 2)], n = c[e.charCodeAt(u + 3)], l[s++] = t << 2 | r >> 4, l[s++] = (15 & r) << 4 | i >> 2, l[s++] = (3 & i) << 6 | 63 & n;
        return o;
      }, encode: function(e) {
        for (var t = new Uint8Array(e), r = t.length, i = "", n = 0; n < r; n += 3) i += o[t[n] >> 2], i += o[(3 & t[n]) << 4 | t[n + 1] >> 4], i += o[(15 & t[n + 1]) << 2 | t[n + 2] >> 6], i += o[63 & t[n + 2]];
        return r % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : r % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i;
      }, unpackPlayReady: unpackPlayReady
    };
  }, {}],
  215: [function(e, t, r) {
    var i = e("./oo"), n = e("../player/base/event/eventtype");
    t.exports.stopPropagation = function(e) {
      window.event ? window.event.cancelBubble = !0 : e.stopPropagation();
    }, t.exports.register = function(e) {
      e.util = { stopPropagation: t.exports.stopPropagation }, e.Component = i.extend, e.EventType = n.Player;
    };
  }, { "../player/base/event/eventtype": 244, "./oo": 228 }],
  216: [function(e, t, r) {
    var i = e("../lang/index");
    t.exports.LOAD_START = "loadstart", t.exports.LOADED_METADATA = "loadedmetadata", t.exports.LOADED_DATA = "loadeddata", t.exports.PROGRESS = "progress", t.exports.CAN_PLAY = "canplay", t.exports.CAN_PLYA_THROUGH = "canplaythrough", t.exports.PLAY = "play", t.exports.PAUSE = "pause", t.exports.ENDED = "ended", t.exports.PLAYING = "playing", t.exports.WAITING = "waiting", t.exports.ERROR = "error", t.exports.SUSPEND = "suspend", t.exports.STALLED = "stalled", t.exports.AuthKeyExpiredEvent = "authkeyexpired", t.exports.DRMKeySystem = {
      4: "com.microsoft.playready",
      5: "com.widevine.alpha"
    }, t.exports.EncryptionType = {
      Private: 1,
      Standard: 2,
      ChinaDRM: 3,
      PlayReady: 4,
      Widevine: 5
    }, t.exports.VodEncryptionType = {
      AliyunVoDEncryption: 1,
      HLSEncryption: 2,
      Widevine: 5,
      "Widevine-FairPlay": 5
    }, t.exports.DRMType = {
      Widevine: "Widevine",
      PlayReady: "PlayReady"
    }, t.exports.ErrorCode = {
      InvalidParameter: 4001,
      AuthKeyExpired: 4002,
      InvalidSourceURL: 4003,
      NotFoundSourceURL: 4004,
      StartLoadData: 4005,
      LoadedMetadata: 4006,
      PlayingError: 4007,
      LoadingTimeout: 4008,
      RequestDataError: 4009,
      EncrptyVideoNotSupport: 4010,
      FormatNotSupport: 4011,
      PlayauthDecode: 4012,
      PlayDataDecode: 4013,
      NetworkUnavaiable: 4014,
      UserAbort: 4015,
      NetworkError: 4016,
      URLsIsEmpty: 4017,
      CrossDomain: 4027,
      OtherError: 4400,
      ServerAPIError: 4500,
      FlashNotInstalled: 4600,
      RequestHttpError: 4100,
      PlayFailedError: 4200,
      NotSupportWebRtc: 4110,
      BrowserNotSupport: 4111,
      BrowserVersionTooLow: 4112,
      NotSupportH264: 4113,
      CreateOfferError: 4114,
      AutoPLayFaild: 4115,
      PlayUrlError: 4116,
      SubscribeNonthing: 4117,
      HtmlElementError: 4118,
      HtmlElementNotMatch: 4119
    }, t.exports.AuthKeyExpired = 7200, t.exports.AuthKeyRefreshExpired = 7e3, t.exports.AuthInfoExpired = 100, t.exports.VideoErrorCode = {
      1: 4015,
      2: 4016,
      3: 4013,
      4: 4400
    }, t.exports.IconType = {
      FontClass: "fontclass",
      Symbol: "symbol",
      Sprite: "Sprite"
    }, t.exports.SelectedStreamLevel = "selectedStreamLevel", t.exports.SelectedCC = "selectedCC", t.exports.WidthMapToLevel = {
      0: "OD",
      640: "FD",
      960: "LD",
      1280: "SD",
      1920: "HD",
      2580: "2K",
      3840: "4K"
    };
    e = function() {
      t.exports.VideoErrorCodeText = {
        1: i.get("Error_Load_Abort_Text"),
        2: i.get("Error_Network_Text"),
        3: i.get("Error_Decode_Text"),
        4: i.get("Error_Server_Network_NotSupport_Text")
      }, t.exports.VideoLevels = {
        0: i.get("OD"),
        640: i.get("FD"),
        960: i.get("LD"),
        1280: i.get("SD"),
        1920: i.get("HD"),
        2580: i.get("2K"),
        3840: i.get("4K")
      }, t.exports.QualityLevels = {
        OD: i.get("OD"),
        LD: i.get("LD"),
        FD: i.get("FD"),
        SD: i.get("SD"),
        HD: i.get("HD"),
        "2K": i.get("2K"),
        "4K": i.get("4K"),
        XLD: i.get("XLD"),
        FHD: i.get("FHD"),
        SQ: i.get("SQ"),
        HQ: i.get("HQ")
      }, t.exports.SpeedLevels = [{ key: .5, text: i.get("Speed_05X_Text") }, {
        key: 1,
        text: i.get("Speed_1X_Text")
      }, { key: 1.25, text: i.get("Speed_125X_Text") }, { key: 1.5, text: i.get("Speed_15X_Text") }, {
        key: 2,
        text: i.get("Speed_2X_Text")
      }];
    };
    e(), t.exports.updateByLanguage = e;
  }, { "../lang/index": 212 }],
  217: [function(e, t, r) {
    t.exports.get = function(e) {
      for (var t = e + "", r = document.cookie.split(";"), i = 0; i < r.length; i++) {
        var n = r[i].trim();
        if (0 == n.indexOf(t)) return unescape(n.substring(t.length + 1, n.length));
      }
      return "";
    }, t.exports.set = function(e, t, r) {
      var i = new Date;
      i.setTime(i.getTime() + 24 * r * 60 * 60 * 1e3);
      i = "expires=" + i.toGMTString();
      document.cookie = e + "=" + escape(t) + "; " + i;
    };
  }, {}],
  218: [function(e, r, t) {
    var i = e("./object");
    r.exports.cache = {}, r.exports.guid = function(e, t) {
      var r, i, n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), o = [];
      if (t = t || n.length, e) for (r = 0; r < e; r++) o[r] = n[0 | Math.random() * t]; else for (o[8] = o[13] = o[18] = o[23] = "-", o[14] = "4", r = 0; r < 36; r++) o[r] || (i = 0 | 16 * Math.random(), o[r] = n[19 == r ? 3 & i | 8 : i]);
      return o.join("");
    }, r.exports.expando = "vdata" + (new Date).getTime(), r.exports.getData = function(e) {
      var t = e[r.exports.expando];
      return t || (t = e[r.exports.expando] = r.exports.guid(), r.exports.cache[t] = {}), r.exports.cache[t];
    }, r.exports.hasData = function(e) {
      var t = "";
      return !(!(t = e ? e[r.exports.expando] : t) || i.isEmpty(r.exports.cache[t]));
    }, r.exports.removeData = function(t) {
      var e = "";
      if (e = t ? t[r.exports.expando] : e) {
        delete r.exports.cache[e];
        try {
          delete t[r.exports.expando];
        } catch (e) {
          t.removeAttribute ? t.removeAttribute(r.exports.expando) : t[r.exports.expando] = null;
        }
      }
    };
  }, { "./object": 227 }],
  219: [function(e, l, t) {
    var i = e("./object");
    l.exports.el = function(e) {
      return document.getElementById(e);
    }, l.exports.createEl = function(e, t) {
      var r;
      return e = e || "div", t = t || {}, r = document.createElement(e), i.each(t, function(e, t) {
        -1 !== e.indexOf("aria-") || "role" == e ? r.setAttribute(e, t) : r[e] = t;
      }), r;
    }, l.exports.addClass = function(e, t) {
      -1 == (" " + e.className + " ").indexOf(" " + t + " ") && (e.className = "" === e.className ? t : e.className + " " + t);
    }, l.exports.removeClass = function(e, t) {
      var r, i;
      if (-1 != e.className.indexOf(t)) {
        for (i = (r = e.className.split(" ")).length - 1; 0 <= i; i--) r[i] === t && r.splice(i, 1);
        e.className = r.join(" ");
      }
    }, l.exports.hasClass = function(e, t) {
      return -1 != e.className.indexOf(t);
    }, l.exports.getClasses = function(e) {
      return e.className ? e.className.split(" ") : [];
    }, l.exports.getElementAttributes = function(e) {
      var t, r, i = {}, n = ",autoplay,controls,loop,muted,default,";
      if (e && e.attributes && 0 < e.attributes.length) for (var o, a = (o = e.attributes).length - 1; 0 <= a; a--) t = o[a].name, r = o[a].value, "boolean" != typeof e[t] && -1 === n.indexOf("," + t + ",") || (r = null !== r), i[t] = r;
      return i;
    }, l.exports.insertFirst = function(e, t) {
      t.firstChild ? t.insertBefore(e, t.firstChild) : t.appendChild(e);
    }, l.exports.blockTextSelection = function() {
      document.body.focus(), document.onselectstart = function() {
        return !1;
      };
    }, l.exports.unblockTextSelection = function() {
      document.onselectstart = function() {
        return !0;
      };
    }, l.exports.css = function(r, e, t) {
      return !(!r || !r.style) && (e && t ? (r.style[e] = t, !0) : t || "string" != typeof e ? !t && "object" == typeof e && (i.each(e, function(e, t) {
        r.style[e] = t;
      }), !0) : r.style[e]);
    }, l.exports.getTransformName = function(e) {
      for (var t = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"], r = t[0], i = 0, n = t.length; i < n; i++) if (void 0 !== e.style[t[i]]) {
        r = t[i];
        break;
      }
      return r;
    }, l.exports.getTransformEventName = function(e, t) {
      for (var r = ["", "Webkit", "Moz", "ms", "O"], i = t.toLowerCase(), n = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"], o = 0, a = n.length; o < a; o++) if (void 0 !== e.style[n[o]]) {
        0 != o && (i = r[o] + t);
        break;
      }
      return i;
    }, l.exports.addCssByStyle = function(e) {
      var t = document, r = t.createElement("style");
      r.setAttribute("type", "text/css"), r.styleSheet ? r.styleSheet.cssText = e : (i = t.createTextNode(e), r.appendChild(i));
      var i = t.getElementsByTagName("head");
      (i.length ? i[0] : t.documentElement).appendChild(r);
    }, l.exports.getTranslateX = function(e) {
      var t = 0;
      if (e) try {
        var r = window.getComputedStyle(e), i = l.exports.getTransformName(e), t = new WebKitCSSMatrix(r[i]).m41;
      } catch (e) {
        console.log(e);
      }
      return t;
    }, l.exports.getPointerPosition = function(e, t) {
      var r = {}, i = l.exports.findPosition(e), n = e.offsetWidth, o = e.offsetHeight, a = i.top, s = i.left,
        e = t.pageY, i = t.pageX;
      return t.changedTouches && (i = t.changedTouches[0].pageX, e = t.changedTouches[0].pageY), r.y = Math.max(0, Math.min(1, (a - e + o) / o)), r.x = Math.max(0, Math.min(1, (i - s) / n)), r;
    }, l.exports.findPosition = function(e) {
      var t;
      if (!(t = e.getBoundingClientRect && e.parentNode ? e.getBoundingClientRect() : t)) return { left: 0, top: 0 };
      var r = document.documentElement, i = document.body, n = r.clientLeft || i.clientLeft || 0,
        e = window.pageXOffset || i.scrollLeft, n = t.left + e - n, r = r.clientTop || i.clientTop || 0,
        i = window.pageYOffset || i.scrollTop, r = t.top + i - r;
      return { left: Math.round(n), top: Math.round(r) };
    };
  }, { "./object": 227 }],
  220: [function(e, l, t) {
    var u = e("./object"), c = e("./data"), r = e("./ua"), i = e("fastclick");

    function h(t, r, e, i) {
      u.each(e, function(e) {
        t(r, e, i);
      });
    }

    l.exports.on = function(o, e, t) {
      if (o) {
        if (u.isArray(e)) return h(l.exports.on, o, e, t);
        r.IS_MOBILE && "click" == e && i(o);
        var a = c.getData(o);
        a.handlers || (a.handlers = {}), a.handlers[e] || (a.handlers[e] = []), t.guid || (t.guid = c.guid()), a.handlers[e].push(t), a.dispatcher || (a.disabled = !1, a.dispatcher = function(e) {
          if (!a.disabled) {
            e = l.exports.fixEvent(e);
            var t = a.handlers[e.type];
            if (t) for (var r = t.slice(0), i = 0, n = r.length; i < n && !e.isImmediatePropagationStopped(); i++) r[i].call(o, e);
          }
        }), 1 == a.handlers[e].length && (o.addEventListener ? o.addEventListener(e, a.dispatcher, !1) : o.attachEvent && o.attachEvent("on" + e, a.dispatcher));
      }
    }, l.exports.off = function(t, e, r) {
      if (t && c.hasData(t)) {
        var i = c.getData(t);
        if (i.handlers) {
          if (u.isArray(e)) return h(l.exports.off, t, e, r);

          function n(e) {
            i.handlers[e] = [], l.exports.cleanUpEvents(t, e);
          }

          if (e) {
            var o = i.handlers[e];
            if (o) if (r) {
              if (r.guid) for (var a = 0; a < o.length; a++) o[a].guid === r.guid && o.splice(a--, 1);
              l.exports.cleanUpEvents(t, e);
            } else n(e);
          } else for (var s in i.handlers) n(s);
        }
      }
    }, l.exports.cleanUpEvents = function(e, t) {
      var r = c.getData(e);
      0 === r.handlers[t].length && (delete r.handlers[t], e.removeEventListener ? e.removeEventListener(t, r.dispatcher, !1) : e.detachEvent && e.detachEvent("on" + t, r.dispatcher)), u.isEmpty(r.handlers) && (delete r.handlers, delete r.dispatcher, delete r.disabled), u.isEmpty(r) && c.removeData(e);
    }, l.exports.fixEvent = function(e) {
      function t() {
        return !0;
      }

      function r() {
        return !1;
      }

      if (!e || !e.isPropagationStopped) {
        var i, n, o, a = e || window.event;
        for (i in e = {}, a) "layerX" !== i && "layerY" !== i && "keyboardEvent.keyLocation" !== i && ("returnValue" == i && a.preventDefault || (e[i] = a[i]));
        e.target || (e.target = e.srcElement || document), e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement, e.preventDefault = function() {
          a.preventDefault && a.preventDefault(), e.returnValue = !1, e.isDefaultPrevented = t, e.defaultPrevented = !0;
        }, e.isDefaultPrevented = r, e.defaultPrevented = !1, e.stopPropagation = function() {
          a.stopPropagation && a.stopPropagation(), e.cancelBubble = !0, e.isPropagationStopped = t;
        }, e.isPropagationStopped = r, e.stopImmediatePropagation = function() {
          a.stopImmediatePropagation && a.stopImmediatePropagation(), e.isImmediatePropagationStopped = t, e.stopPropagation();
        }, e.isImmediatePropagationStopped = r, null != e.clientX && (n = document.documentElement, o = document.body, e.pageX = e.clientX + (n && n.scrollLeft || o && o.scrollLeft || 0) - (n && n.clientLeft || o && o.clientLeft || 0), e.pageY = e.clientY + (n && n.scrollTop || o && o.scrollTop || 0) - (n && n.clientTop || o && o.clientTop || 0)), e.which = e.charCode || e.keyCode, null != e.button && (e.button = 1 & e.button ? 0 : 4 & e.button ? 1 : 2 & e.button ? 2 : 0);
      }
      return e;
    }, l.exports.trigger = function(e, t) {
      if (e) {
        var r, i = c.hasData(e) ? c.getData(e) : {}, n = e.parentNode || e.ownerDocument;
        return "string" == typeof t && (r = null, !e.paramData && 0 != e.paramData || (r = e.paramData, e.paramData = null, e.removeAttribute(r)), t = {
          type: t,
          target: e,
          paramData: r
        }), t = l.exports.fixEvent(t), i.dispatcher && i.dispatcher.call(e, t), n && !t.isPropagationStopped() && !1 !== t.bubbles ? l.exports.trigger(n, t) : n || t.defaultPrevented || (n = c.getData(t.target), t.target[t.type] && (n.disabled = !0, "function" == typeof t.target[t.type] && t.target[t.type](), n.disabled = !1)), !t.defaultPrevented;
      }
    }, l.exports.one = function(e, t, r) {
      if (e) {
        if (u.isArray(t)) return h(l.exports.one, e, t, r);
        var i = function() {
          l.exports.off(e, t, i), r.apply(this, arguments);
        };
        i.guid = r.guid = r.guid || c.guid(), l.exports.on(e, t, i);
      }
    };
  }, { "./data": 218, "./object": 227, "./ua": 232, fastclick: 110 }],
  221: [function(e, t, r) {
    var n = e("./data");
    t.exports.bind = function(e, t, r) {
      t.guid || (t.guid = n.guid());

      function i() {
        return t.apply(e, arguments);
      }

      return i.guid = r ? r + "_" + t.guid : t.guid, i;
    };
  }, { "./data": 218 }],
  222: [function(e, t, r) {
    var i = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/, o = /^([^\/;?#]*)(.*)$/,
      n = /(?:\/|^)\.(?=\/)/g, a = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g, s = {
        buildAbsoluteURL: function(e, t, r) {
          if (r = r || {}, e = e.trim(), !(t = t.trim())) {
            if (!r.alwaysNormalize) return e;
            var i = s.parseURL(e);
            if (!i) throw new Error("Error trying to parse base URL.");
            return i.path = s.normalizePath(i.path), s.buildURLFromParts(i);
          }
          i = s.parseURL(t);
          if (!i) throw new Error("Error trying to parse relative URL.");
          if (i.scheme) return r.alwaysNormalize ? (i.path = s.normalizePath(i.path), s.buildURLFromParts(i)) : t;
          t = s.parseURL(e);
          if (!t) throw new Error("Error trying to parse base URL.");
          !t.netLoc && t.path && "/" !== t.path[0] && (n = o.exec(t.path), t.netLoc = n[1], t.path = n[2]), t.netLoc && !t.path && (t.path = "/");
          var n, e = {
            scheme: t.scheme,
            netLoc: i.netLoc,
            path: null,
            params: i.params,
            query: i.query,
            fragment: i.fragment
          };
          return i.netLoc || (e.netLoc = t.netLoc, "/" !== i.path[0] && (i.path ? (n = (n = t.path).substring(0, n.lastIndexOf("/") + 1) + i.path, e.path = s.normalizePath(n)) : (e.path = t.path, i.params || (e.params = t.params, i.query || (e.query = t.query))))), null === e.path && (e.path = r.alwaysNormalize ? s.normalizePath(i.path) : i.path), s.buildURLFromParts(e);
        }, parseURL: function(e) {
          e = i.exec(e);
          return e ? {
            scheme: e[1] || "",
            netLoc: e[2] || "",
            path: e[3] || "",
            params: e[4] || "",
            query: e[5] || "",
            fragment: e[6] || ""
          } : null;
        }, normalizePath: function(e) {
          for (e = e.split("").reverse().join("").replace(n, ""); e.length !== (e = e.replace(a, "")).length;) ;
          return e.split("").reverse().join("");
        }, buildURLFromParts: function(e) {
          return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment;
        }
      };
    t.exports = s;
  }, {}],
  223: [function(e, t, r) {
    function i(e) {
      for (var t in e = "string" == typeof e ? this.parseAttrList(e) : e) e.hasOwnProperty(t) && (this[t] = e[t]);
    }

    var n = /^(\d+)x(\d+)$/, o = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g;
    i.prototype = {
      decimalInteger: function(e) {
        e = parseInt(this[e], 10);
        return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
      }, hexadecimalInteger: function(e) {
        if (this[e]) {
          for (var t = (1 & (t = (this[e] || "0x").slice(2)).length ? "0" : "") + t, r = new Uint8Array(t.length / 2), i = 0; i < t.length / 2; i++) r[i] = parseInt(t.slice(2 * i, 2 * i + 2), 16);
          return r;
        }
        return null;
      }, hexadecimalIntegerAsNumber: function(e) {
        e = parseInt(this[e], 16);
        return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
      }, decimalFloatingPoint: function(e) {
        return parseFloat(this[e]);
      }, enumeratedString: function(e) {
        return this[e];
      }, decimalResolution: function(e) {
        e = n.exec(this[e]);
        if (null !== e) return { width: parseInt(e[1], 10), height: parseInt(e[2], 10) };
      }, parseAttrList: function(e) {
        var t, r = {};
        for (o.lastIndex = 0; null !== (t = o.exec(e));) {
          var i = t[2];
          0 === i.indexOf("\"") && i.lastIndexOf("\"") === i.length - 1 && (i = i.slice(1, -1)), r[t[1]] = i;
        }
        return r;
      }
    }, t.exports = i;
  }, {}],
  224: [function(e, t, r) {
    function S() {
      this.method = null, this.key = null, this.iv = null, this._uri = null;
    }

    function E() {
      this._url = null, this._byteRange = null, this._decryptdata = null, this.tagList = [];
    }

    var T = e("./attrlist"), i = e("../io"), n = e("./URLToolkit"),
      u = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g, l = /#EXT-X-MEDIA:(.*)/g,
      x = new RegExp([/#EXTINF:(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)(\S+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""), "g"),
      M = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;
    E.prototype.getUrl = function() {
      return !this._url && this.relurl && (this._url = n.buildAbsoluteURL(this.baseurl, this.relurl, { alwaysNormalize: !0 })), this._url;
    }, E.prototype.Seturl = function(e) {
      this._url = e;
    }, E.prototype.getProgramDateTime = function() {
      return !this._programDateTime && this.rawProgramDateTime && (this._programDateTime = new Date(Date.parse(this.rawProgramDateTime))), this._programDateTime;
    }, E.prototype.GetbyteRange = function() {
      var e, t, r;
      return this._byteRange || (e = this._byteRange = [], this.rawByteRange && (1 === (t = this.rawByteRange.split("@", 2)).length ? (r = this.lastByteRangeEndOffset, e[0] = r || 0) : e[0] = parseInt(t[1]), e[1] = parseInt(t[0]) + e[0])), this._byteRange;
    }, E.prototype.getByteRangeStartOffset = function() {
      return this.byteRange[0];
    }, E.prototype.getByteRangeEndOffset = function() {
      return this.byteRange[1];
    };
    E.prototype.getDecryptdata = function() {
      return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)), this._decryptdata;
    };
    e = function() {
      this.loaders = {};
    };
    e.prototype = {
      parseMasterPlaylist: function(e, t) {
        var r = [];
        for (u.lastIndex = 0; null != (o = u.exec(e));) {
          var i = {}, n = i.attrs = new T(o[1]);
          i.url = this.resolve(o[2], t);
          var o = n.decimalResolution("RESOLUTION");
          if (o && (i.width = o.width, i.height = o.height), i.bitrate = n.decimalInteger("AVERAGE-BANDWIDTH") || n.decimalInteger("BANDWIDTH"), i.name = n.NAME, a = n.CODECS) for (var a = a.split(/[ ,]+/), s = 0; s < a.length; s++) {
            var l = a[s];
            -1 !== l.indexOf("avc1") ? i.videoCodec = this.avc1toavcoti(l) : -1 !== l.indexOf("hvc1") ? i.videoCodec = l : i.audioCodec = l;
          }
          r.push(i);
        }
        return r;
      }, parseMasterPlaylistMedia: function(e, t, r, i) {
        var n = [], o = 0;
        for (l.lastIndex = 0; null != (s = l.exec(e));) {
          var a = {}, s = new T(s[1]);
          s.TYPE === r && (a.groupId = s["GROUP-ID"], a.name = s.NAME, a.type = r, a["default"] = "YES" === s.DEFAULT, a.autoselect = "YES" === s.AUTOSELECT, a.forced = "YES" === s.FORCED, s.URI && (a.url = this.resolve(s.URI, t)), a.lang = s.LANGUAGE, a.name || (a.name = a.lang), i && (a.audioCodec = i), a.id = o++, n.push(a));
        }
        return n;
      }, avc1toavcoti: function(e) {
        var t, r = e.split(".");
        return 2 < r.length ? (t = r.shift() + ".", t += parseInt(r.shift()).toString(16), t += ("000" + parseInt(r.shift()).toString(16)).substr(-4)) : t = e, t;
      }, parseLevelPlaylist: function(e, t, r, i) {
        var n, o, a = 0, s = 0, l = { type: null, version: null, url: t, fragments: [], live: !0, startSN: 0 },
          u = new S, c = 0, h = null, d = new E;
        for (x.lastIndex = 0; null !== (n = x.exec(e));) {
          var f, p = n[1];
          if (p) {
            d.duration = parseFloat(p);
            var y = (" " + n[2]).slice(1);
            d.title = y || null, d.tagList.push(y ? ["INF", p, y] : ["INF", p]);
          } else if (n[3]) isNaN(d.duration) || (f = a++, d.type = i, d.start = s, d.levelkey = u, d.sn = f, d.level = r, d.cc = c, d.baseurl = t, d.relurl = (" " + n[3]).slice(1), l.fragments.push(d), s += (h = d).duration, d = new E); else if (n[4]) d.rawByteRange = (" " + n[4]).slice(1), !h || (f = h.byteRangeEndOffset) && (d.lastByteRangeEndOffset = f); else if (n[5]) d.rawProgramDateTime = (" " + n[5]).slice(1), d.tagList.push(["PROGRAM-DATE-TIME", d.rawProgramDateTime]), void 0 === l.programDateTime && (l.programDateTime = new Date(new Date(Date.parse(n[5])) - 1e3 * s)); else {
            for (n = n[0].match(M), o = 1; o < n.length && void 0 === n[o]; o++) ;
            var g = (" " + n[o + 1]).slice(1), m = (" " + n[o + 2]).slice(1);
            switch (n[o]) {
              case"#":
                d.tagList.push(m ? [g, m] : [g]);
                break;
              case"PLAYLIST-TYPE":
                l.type = g.toUpperCase();
                break;
              case"MEDIA-SEQUENCE":
                a = l.startSN = parseInt(g);
                break;
              case"TARGETDURATION":
                l.targetduration = parseFloat(g);
                break;
              case"VERSION":
                l.version = parseInt(g);
                break;
              case"EXTM3U":
                break;
              case"ENDLIST":
                l.live = !1;
                break;
              case"DIS":
                c++, d.tagList.push(["DIS"]);
                break;
              case"DISCONTINUITY-SEQ":
                c = parseInt(g);
                break;
              case"KEY":
                var b = new T(g), _ = b.enumeratedString("METHOD"), v = b.URI, b = b.hexadecimalInteger("IV");
                _ && (u = new S, v && 0 <= ["AES-128", "SAMPLE-AES"].indexOf(_) && (u.method = _, u.baseuri = t, u.reluri = v, u.key = null, u.iv = b));
                break;
              case"START":
                var w = new T(g).decimalFloatingPoint("TIME-OFFSET");
                isNaN(w) || (l.startTimeOffset = w);
                break;
              case"MAP":
                w = new T(g);
                d.relurl = w.URI, d.rawByteRange = w.BYTERANGE, d.baseurl = t, d.level = r, d.type = i, d.sn = "initSegment", l.initSegment = d, d = new E;
                break;
              default:
                console.log("line parsed but not handled: " + n);
            }
          }
        }
        return (d = h) && !d.relurl && (l.fragments.pop(), s -= d.duration), l.totalduration = s, l.averagetargetduration = s / l.fragments.length, l.endSN = a - 1, l;
      }, load: function(o, a) {
        var s = this;
        i.get(o, function(e) {
          var t, r, i, n = s.parseMasterPlaylist(e, o);
          n.length && (t = s.parseMasterPlaylistMedia(e, o, "AUDIO", n[0].audioCodec), r = s.parseMasterPlaylistMedia(e, o, "SUBTITLES"), t.length && (i = !1, t.forEach(function(e) {
            e.url || (i = !0);
          }), !1 === i && n[0].audioCodec && !n[0].attrs.AUDIO && (console.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"), t.unshift({
            type: "main",
            name: "main"
          })))), a({ levels: n, audioTracks: t, subtitles: r, url: o });
        }, function(e) {
          console.log(e);
        });
      }, resolve: function(e, t) {
        return n.buildAbsoluteURL(t, e, { alwaysNormalize: !0 });
      }
    }, t.exports = e;
  }, { "../io": 225, "./URLToolkit": 222, "./attrlist": 223 }],
  225: [function(e, s, t) {
    var f = e("./url");
    s.exports.get = function(e, t, r, i, n) {
      s.exports.ajax("GET", e, {}, t, r, i, n);
    }, s.exports.post = function(e, t, r, i, n, o) {
      var a = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Accept: "application/json" };
      s.exports.ajax("POST", e, t, r, i, n, o, a);
    }, s.exports.postWithHeader = function(e, t, r, i, n) {
      s.exports.ajax("POST", e, t, i, n, !0, !1, r);
    }, s.exports.ajax = function(e, t, r, i, n, o, a, s) {
      var l, u, c, h;
      n = n || function() {
      }, "undefined" == typeof XMLHttpRequest && (window.XMLHttpRequest = function() {
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {
        }
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {
        }
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
        }
        throw new Error("This browser does not support XMLHttpRequest.");
      }), u = new XMLHttpRequest, c = f.parseUrl(t), h = window.location, !(c.protocol + c.host !== h.protocol + h.host) || !window.XDomainRequest || "withCredentials" in u ? (l = "file:" == c.protocol || "file:" == h.protocol, u.onreadystatechange = function() {
        4 === u.readyState && (200 === u.status || l && 0 === u.status ? i : n)(u.responseText);
      }) : ((u = new window.XDomainRequest).onload = function() {
        i(u.responseText);
      }, u.onerror = n, u.onprogress = function() {
      }, u.ontimeout = n);
      try {
        if (void 0 === o && (o = !0), u.open(e, t, o), a && (u.withCredentials = !0), s) for (var d in s) s.hasOwnProperty(d) && u.setRequestHeader(d, s[d]);
      } catch (e) {
        return void n(e);
      }
      try {
        u.send(r);
      } catch (e) {
        n(e);
      }
    }, s.exports.jsonp = function(e, t, r) {
      var i = "jsonp_callback_" + Math.round(1e5 * Math.random()), n = document.createElement("script");
      e && (n.src = e + (0 <= e.indexOf("?") ? "&" : "?") + "callback=" + i + "&cb=" + i, n.onerror = function() {
        delete window[i], document.body.removeChild(n), r();
      }, n.onload = function() {
        setTimeout(function() {
          window[i] && (delete window[i], document.body.removeChild(n));
        }, 0);
      }, window[i] = function(e) {
        delete window[i], document.body.removeChild(n), t(e);
      }, document.body.appendChild(n));
    }, s.exports.loadJS = function(e, t) {
      var r = document.getElementsByTagName("HEAD").item(0), i = document.createElement("script");
      e && e.toLowerCase().indexOf("https://") < 0 && (e = document.URL.replace(/(\/[^\/]*?)$/i, "") + e), i.type = "text/javascript", i.src = e, i.onload = function() {
        t && t();
      }, r.appendChild(i);
    };
  }, { "./url": 233 }],
  226: [function(e, t, r) {
    var a = e("./dom");
    t.exports.render = function(e, t) {
      var r = t.align || (t.className ? "" : "tl"), i = t.x || 0, n = t.y || 0,
        o = i.indexOf && 0 < i.indexOf("%") ? "" : "px", t = n.indexOf && 0 < n.indexOf("%") ? "" : "px";
      "tl" === r ? a.css(e, {
        "float": "left",
        "margin-left": i + o,
        "margin-top": n + t
      }) : "tr" === r ? a.css(e, {
        "float": "right",
        "margin-right": i + o,
        "margin-top": n + t
      }) : "tlabs" === r ? a.css(e, {
        position: "absolute",
        left: i + o,
        top: n + t
      }) : "trabs" === r ? a.css(e, {
        position: "absolute",
        right: i + o,
        top: n + t
      }) : "blabs" === r ? a.css(e, {
        position: "absolute",
        left: i + o,
        bottom: n + t
      }) : "brabs" === r ? a.css(e, {
        position: "absolute",
        right: i + o,
        bottom: n + t
      }) : "cc" === r && a.addClass(e, "loading-center");
    };
  }, { "./dom": 219 }],
  227: [function(e, a, t) {
    var s = Object.prototype.hasOwnProperty;
    a.exports.create = Object.create || function(e) {
      function t() {
      }

      return t.prototype = e, new t;
    }, a.exports.isArray = function(e) {
      return "[object Array]" === Object.prototype.toString.call(arg);
    }, a.exports.isEmpty = function(e) {
      for (var t in e) if (null !== e[t]) return !1;
      return !0;
    }, a.exports.each = function(e, t, r) {
      if (a.exports.isArray(e)) for (var i = 0, n = e.length; i < n && !1 !== t.call(r || this, e[i], i); ++i) ; else for (var o in e) if (s.call(e, o) && !1 === t.call(r || this, o, e[o])) break;
      return e;
    }, a.exports.merge = function(e, t) {
      if (!t) return e;
      for (var r in t) s.call(t, r) && (e[r] = t[r]);
      return e;
    }, a.exports.deepMerge = function(e, t) {
      var r, i, n;
      for (r in e = a.exports.copy(e), t) s.call(t, r) && (i = e[r], n = t[r], a.exports.isPlain(i) && a.exports.isPlain(n) ? e[r] = a.exports.deepMerge(i, n) : e[r] = t[r]);
      return e;
    }, a.exports.copy = function(e) {
      return a.exports.merge({}, e);
    }, a.exports.isPlain = function(e) {
      return !!e && "object" == typeof e && "[object Object]" === e.toString() && e.constructor === Object;
    }, a.exports.isArray = Array.isArray || function(e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    }, a.exports.unescape = function(e) {
      return e.replace(/&([^;]+);/g, function(e, t) {
        return { amp: "&", lt: "<", gt: ">", quot: "\"", "#x27": "'", "#x60": "`" }[t.toLowerCase()] || e;
      });
    };
  }, {}],
  228: [function(e, t, r) {
    var n = e("./object"), o = function() {
    };
    (o = function() {
    }).extend = function(e) {
      var t, r, i = (e = e || {}).init || e.init || this.prototype.init || this.prototype.init || function() {
      };
      for (r in (((t = function() {
        i.apply(this, arguments);
      }).prototype = n.create(this.prototype)).constructor = t).extend = o.extend, t.create = o.create, e) e.hasOwnProperty(r) && (t.prototype[r] = e[r]);
      return t;
    }, o.create = function() {
      var e = n.create(this.prototype);
      return this.apply(e, arguments), e;
    }, t.exports = o;
  }, { "./object": 227 }],
  229: [function(e, p, t) {
    var y = e("./object"), r = e("../config"), i = e("./dom"), n = e("./cookie"), o = e("./constants"),
      a = e("../lang/index"), s = e("./ua"), g = e("../player/base/plugin/defaultemptycomponent"), m = {
        preload: !0,
        autoplay: !0,
        useNativeControls: !1,
        width: "100%",
        height: "300px",
        cover: "",
        from: "",
        trackLog: !0,
        logBatched: !0,
        isLive: !1,
        playsinline: !0,
        showBarTime: 5e3,
        rePlay: !1,
        liveRetry: 5,
        liveRetryInterval: 1,
        liveRetryStep: 0,
        keyShortCuts: !1,
        keyFastForwardStep: 10,
        isVBR: !1,
        vodRetry: 3,
        format: "",
        definition: "",
        defaultDefinition: "",
        loadDataTimeout: 20,
        waitingTimeout: 60,
        waitingBufferedTime: 3,
        delayLoadingShow: 1,
        controlBarForOver: !1,
        controlBarVisibility: "hover",
        enableSystemMenu: !1,
        qualitySort: "asc",
        x5_video_position: "normal",
        x5_type: "",
        x5_fullscreen: !1,
        x5_orientation: "landscape|portrait",
        x5LandscapeAsFullScreen: !0,
        autoPlayDelay: 0,
        autoPlayDelayDisplayText: "",
        useHlsPluginForSafari: !1,
        enableMSEForAndroid: !0,
        encryptType: 0,
        language: "zh-cn",
        languageTexts: {},
        mediaType: "video",
        outputType: "",
        playConfig: {},
        reAuthInfo: {},
        components: [],
        liveTimeShiftUrl: "",
        liveShiftSource: "",
        liveShiftTime: "",
        videoHeight: "100%",
        videoWidth: "100%",
        enableWorker: !0,
        authTimeout: "",
        enableMockFullscreen: !1,
        region: "cn-shanghai",
        debug: !1,
        progressMarkers: [],
        snapshotWatermark: {
          left: "500",
          top: "100",
          text: "",
          font: "16px \u5b8b\u4f53",
          fillColor: "#FFFFFF",
          strokeColor: "#FFFFFF"
        },
        liveStartTime: "",
        liveOverTime: "",
        enableStashBufferForFlv: !0,
        stashInitialSizeForFlv: 32,
        flvOption: {},
        hlsOption: { stopLoadAsPaused: !1 },
        hlsLoadingTimeOut: 2e4,
        useHlsPlugOnMobile: !0,
        nudgeMaxRetry: 5,
        tracks: [],
        recreatePlayer: function() {
        },
        diagnosisButtonVisible: !0,
        _native: !0,
        hlsUriToken: "",
        thumbnailUrl: "",
        skinRes: "//" + r.domain + "/de/prismplayer-flash/" + r.flashVersion + "/atlas/defaultSkin"
      };
    p.exports.defaultH5Layout = [{ name: "bigPlayButton", align: "blabs", x: 30, y: 80 }, {
      name: "H5Loading",
      align: "cc"
    }, { name: "errorDisplay", align: "tlabs", x: 0, y: 0 }, { name: "infoDisplay" }, {
      name: "tooltip",
      align: "blabs",
      x: 0,
      y: 50
    }, { name: "thumbnail" }, {
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{ name: "progress", align: "blabs", x: 0, y: 44 }, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 12
      }, { name: "timeDisplay", align: "tl", x: 10, y: 5 }, {
        name: "fullScreenButton",
        align: "tr",
        x: 10,
        y: 12
      }, { name: "subtitle", align: "tr", x: 15, y: 12 }, {
        name: "setting",
        align: "tr",
        x: 15,
        y: 12
      }, { name: "volume", align: "tr", x: 5, y: 10 }]
    }], p.exports.defaultAudioLayout = [{
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{ name: "progress", align: "blabs", x: 0, y: 44 }, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 12
      }, { name: "timeDisplay", align: "tl", x: 10, y: 5 }, { name: "volume", align: "tr", x: 5, y: 10 }]
    }], p.exports.defaultFlashLayout = [{ name: "bigPlayButton", align: "blabs", x: 30, y: 80 }, {
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{ name: "progress", align: "tlabs", x: 0, y: 0 }, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 26
      }, { name: "nextButton", align: "tl", x: 10, y: 26 }, {
        name: "timeDisplay",
        align: "tl",
        x: 10,
        y: 24
      }, { name: "fullScreenButton", align: "tr", x: 10, y: 25 }, {
        name: "streamButton",
        align: "tr",
        x: 10,
        y: 23
      }, { name: "volume", align: "tr", x: 10, y: 25 }]
    }, {
      name: "fullControlBar",
      align: "tlabs",
      x: 0,
      y: 0,
      children: [{ name: "fullTitle", align: "tl", x: 25, y: 6 }, {
        name: "fullNormalScreenButton",
        align: "tr",
        x: 24,
        y: 13
      }, { name: "fullTimeDisplay", align: "tr", x: 10, y: 12 }, { name: "fullZoom", align: "cc" }]
    }], p.exports.canPlayType = function(e) {
      var t = document.createElement("video");
      return t.canPlayType ? t.canPlayType(e) : "";
    }, p.exports.canPlayHls = function() {
      return "" != p.exports.canPlayType("application/x-mpegURL");
    }, p.exports.isUsedHlsPluginOnMobile = function(e) {
      return !!(s.IS_MOBILE && (s.IS_CHROME || s.IS_FIREFOX || s.IS_X5) && p.exports.isSupportHls());
    }, p.exports.isSafariUsedHlsPlugin = function(e) {
      return !!(s.os.pc && s.browser.safari && e);
    }, p.exports.hasUIComponent = function(e, t) {
      if (void 0 === e || !e || 0 == e.length) return !1;
      for (var r = 0, i = e.length; r < i; r++) {
        var n = e[r].name;
        if (n == t) return !0;
        if ("controlBar" == n) return p.exports.hasUIComponent(e[r].children, t);
      }
      return !1;
    }, p.exports.validateSource = function(e) {
      return !0;
    }, p.exports.supportH5Video = function() {
      return void 0 !== document.createElement("video").canPlayType;
    }, p.exports.createWrapper = function(e) {
      var t = e.id, t = "string" == typeof t ? (0 === t.indexOf("#") && (t = t.slice(1)), i.el(t)) : t;
      if (!t || !t.nodeName) throw new TypeError("\u6ca1\u6709\u4e3a\u64ad\u653e\u5668\u6307\u5b9a\u5bb9\u5668");
      return p.exports.adjustContainerLayout(t, e), t;
    }, p.exports.adjustContainerLayout = function(e, t) {
      t.width && !e.style.width && (e.style.width = t.width), t.height && !e.style.height && (e.style.height = t.height);
    }, p.exports.isSupportHls = function() {
      var e = window.MediaSource = window.MediaSource || window.WebKitMediaSource,
        t = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer,
        e = e && "function" == typeof e.isTypeSupported && e.isTypeSupported("video/mp4; codecs=\"avc1.42E01E,mp4a.40.2\""),
        t = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
      return e && t;
    }, p.exports.isSupportFlv = function() {
      return p.exports.isSupportHls();
    }, p.exports.isSupportMSE = function() {
      return !!window.Promise && !!window.Uint8Array && !!Array.prototype.forEach && p.exports.isSupportedMediaSource();
    }, p.exports.isSupportedMediaSource = function() {
      return !!window.MediaSource && !!MediaSource.isTypeSupported;
    }, p.exports.isSupportedDrm = function() {
      return !!(window.MediaKeys && window.navigator && window.navigator.requestMediaKeySystemAccess && window.MediaKeySystemAccess && window.MediaKeySystemAccess.prototype.getConfiguration) && p.exports.isSupportMSE();
    }, p.exports.isAudio = function(e) {
      return e && 0 < e.toLowerCase().indexOf(".mp3");
    }, p.exports.isLiveShift = function(e) {
      return e.isLive && e.liveStartTime && e.liveOverTime;
    }, p.exports.isHls = function(e) {
      return e && 0 < e.toLowerCase().indexOf(".m3u8");
    }, p.exports.isDash = function(e) {
      return e && 0 < e.toLowerCase().indexOf(".mpd");
    }, p.exports.isFlv = function(e) {
      return e && 0 < e.toLowerCase().indexOf(".flv");
    }, p.exports.isRTMP = function(e) {
      return e && -1 < e.toLowerCase().indexOf("rtmp:");
    }, p.exports.isRts = function(e) {
      return e && -1 < e.toLowerCase().indexOf("artc:");
    }, p.exports.checkSecuritSupport = function() {
      return p.exports.isSupportHls() ? "" : s.IS_IOS ? a.get("iOSNotSupportVodEncription") : a.get("UseChromeForVodEncription");
    }, p.exports.findSelectedStreamLevel = function(e, t) {
      var r = t;
      if (!r && !(r = n.get(o.SelectedStreamLevel))) return n.set(o.SelectedStreamLevel, e[0].definition, 365), 0;
      for (var i = 0; i < e.length; i++) if (e[i].definition == r) return i;
      return 0;
    }, p.exports.handleOption = function(e, t) {
      p.exports.isRts(e.source) && (e.isLive = !0);
      var r, i = y.merge(y.copy(m), e), n = [{ name: "fullScreenButton", align: "tr", x: 20, y: 12 }, {
        name: "subtitle",
        align: "tr",
        x: 15,
        y: 12
      }, { name: "setting", align: "tr", x: 15, y: 12 }, { name: "volume", align: "tr", x: 5, y: 10 }], o = !1;
      if (e.useFlashPrism || p.exports.isRTMP(e.source) ? (o = !0, n = [{
        name: "liveIco",
        align: "tlabs",
        x: 15,
        y: 25
      }, { name: "fullScreenButton", align: "tr", x: 10, y: 25 }, {
        name: "volume",
        align: "tr",
        x: 10,
        y: 25
      }]) : (r = p.exports.isLiveShift(i)) ? (n.push({
        name: "liveShiftProgress",
        align: "tlabs",
        x: 0,
        y: 0
      }), n.push({ name: "playButton", align: "tl", x: 15, y: 12 }), n.push({
        name: "liveDisplay",
        align: "tl",
        x: 15,
        y: 6
      })) : n.push({
        name: "liveDisplay",
        align: "tlabs",
        x: 15,
        y: 6
      }), e.isLive) if (void 0 === e.skinLayout && p.exports.isRts(e.source)) i.skinLayout = [{
        name: "errorDisplay",
        align: "tlabs",
        x: 0,
        y: 0
      }, { name: "infoDisplay" }, { name: "bigPlayButton", align: "blabs", x: 30, y: 80 }, {
        name: "tooltip",
        align: "blabs",
        x: 0,
        y: 56
      }, { name: "H5Loading", align: "cc" }, {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: [{ name: "fullScreenButton", align: "tr", x: 20, y: 12 }, {
          name: "volume",
          align: "tr",
          x: 5,
          y: 10
        }, { name: "liveDisplay", align: "tlabs", x: 15, y: 6 }]
      }]; else if (void 0 === e.skinLayout) i.skinLayout = [{
        name: "errorDisplay",
        align: "tlabs",
        x: 0,
        y: 0
      }, { name: "infoDisplay" }, { name: "bigPlayButton", align: "blabs", x: 30, y: 80 }, {
        name: "tooltip",
        align: "blabs",
        x: 0,
        y: 56
      }, { name: "H5Loading", align: "cc" }, {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: n
      }]; else if (0 != e.skinLayout) {
        for (var a = e.skinLayout.length, s = [], l = -1, u = 0; u < a; u++) if ("controlBar" == i.skinLayout[u].name) {
          for (var l = u, c = i.skinLayout[u].children.length, h = 0; h < c; h++) {
            var d, f = i.skinLayout[u].children[h].name;
            "liveDisplay" != f && "liveIco" != f && "fullScreenButton" != f && "volume" != f && "snapshot" != f && "setting" != f && "subtitle" != f && (!r || "progress" != f && "playButton" != f && "timeDisplay" != f) || (d = i.skinLayout[u].children[h], "progress" == f ? d.name = "liveShiftProgress" : "timeDisplay" == f ? d.name = "liveShiftTimeDisplay" : o && "liveDisplay" == f && (d.name = "liveIco"), s.push(d));
          }
          break;
        }
        -1 != l && (i.skinLayout[l].children = s);
      }
      return (void 0 === e.components || !e.components || y.isArray(e.components) && 0 == e.components.length) && "false" != e.components && (i.components = [g]), i;
    }, p.exports.getLiveHostByRegion = function(e) {
      var t = "live.aliyuncs.com";
      if (!e) return t;
      return -1 < ["ap-southeast-1", "eu-central-1"].indexOf(e) ? "live." + e + ".aliyuncs.com" : t;
    };
  }, {
    "../config": 205,
    "../lang/index": 212,
    "../player/base/plugin/defaultemptycomponent": 264,
    "./constants": 216,
    "./cookie": 217,
    "./dom": 219,
    "./object": 227,
    "./ua": 232
  }],
  230: [function(e, t, r) {
    arguments[4][229][0].apply(r, arguments);
  }, {
    "../config": 205,
    "../lang/index": 212,
    "../player/base/plugin/defaultemptycomponent": 264,
    "./constants": 216,
    "./cookie": 217,
    "./dom": 219,
    "./object": 227,
    "./ua": 232,
    dup: 229
  }],
  231: [function(e, t, r) {
    t.exports.set = function(t, r) {
      try {
        window.localStorage && localStorage.setItem(t, r);
      } catch (e) {
        window[t + "_localStorage"] = r;
      }
    }, t.exports.get = function(t) {
      try {
        if (window.localStorage) return localStorage.getItem(t);
      } catch (e) {
        return window[t + "_localStorage"];
      }
      return "";
    };
  }, {}],
  232: [function(e, x, t) {
    var r, i;
    if (x.exports.USER_AGENT = navigator.userAgent, x.exports.IS_IPHONE = /iPhone/i.test(x.exports.USER_AGENT), x.exports.IS_IPAD = /iPad/i.test(x.exports.USER_AGENT), x.exports.IS_IPOD = /iPod/i.test(x.exports.USER_AGENT), x.exports.IS_MAC = /mac/i.test(x.exports.USER_AGENT), x.exports.IS_EDGE = /Edge/i.test(x.exports.USER_AGENT), x.exports.IS_IE11 = /Trident\/7.0/i.test(x.exports.USER_AGENT), x.exports.IS_X5 = /qqbrowser/i.test(x.exports.USER_AGENT.toLowerCase()), x.exports.IS_CHROME = /Chrome/i.test(x.exports.USER_AGENT) && !x.exports.IS_EDGE && !x.exports.IS_X5, x.exports.IS_SAFARI = /Safari/i.test(x.exports.USER_AGENT) && !x.exports.IS_CHROME, x.exports.IS_FIREFOX = /Firefox/i.test(x.exports.USER_AGENT), document.all) try {
      var n = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      x.exports.HAS_FLASH = !!n;
    } catch (e) {
      x.exports.HAS_FLASH = !1;
    } else navigator.plugins && 0 < navigator.plugins.length ? (n = navigator.plugins["Shockwave Flash"], x.exports.HAS_FLASH = !!n) : x.exports.HAS_FLASH = !1;
    x.exports.IS_MAC_SAFARI = x.exports.IS_MAC && x.exports.IS_SAFARI && !x.exports.IS_CHROME && !x.exports.HAS_FLASH, x.exports.IS_IOS = x.exports.IS_IPHONE || x.exports.IS_IPAD || x.exports.IS_IPOD, x.exports.IOS_VERSION = function() {
      var e = x.exports.USER_AGENT.match(/OS (\d+)_/i);
      if (e && e[1]) return e[1];
    }(), x.exports.IS_ANDROID = /Android/i.test(x.exports.USER_AGENT), x.exports.ANDROID_VERSION = (r = x.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i)) ? (i = r[1] && parseFloat(r[1]), n = r[2] && parseFloat(r[2]), i && n ? parseFloat(r[1] + "." + r[2]) : i || null) : null, x.exports.IS_OLD_ANDROID = x.exports.IS_ANDROID && /webkit/i.test(x.exports.USER_AGENT) && x.exports.ANDROID_VERSION < 2.3, x.exports.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch), x.exports.IS_MOBILE = x.exports.IS_IOS || x.exports.IS_ANDROID, x.exports.IS_H5 = x.exports.IS_MOBILE || !x.exports.HAS_FLASH, x.exports.IS_PC = !x.exports.IS_MOBILE, x.exports.is_X5 = /micromessenger/i.test(x.exports.USER_AGENT) || /qqbrowser/i.test(x.exports.USER_AGENT), x.exports.getHost = function(e) {
      var t = "";
      if (void 0 === e || null == e || "" == e) return "";
      var r = e.indexOf("//"), i = e, t = i = -1 < r ? e.substring(r + 2) : i, i = i.split("/");
      return t = (i = (t = i && 0 < i.length ? i[0] : t).split(":")) && 0 < i.length ? i[0] : t;
    }, x.exports.dingTalk = function() {
      var e = x.exports.USER_AGENT.toLowerCase();
      return /dingtalk/i.test(e);
    }, x.exports.wechat = function() {
      var e = x.exports.USER_AGENT.toLowerCase();
      return /micromessenger/i.test(e);
    }, x.exports.inIFrame = function() {
      return self != top;
    }, x.exports.getReferer = function() {
      var t = document.referrer;
      if (x.exports.inIFrame()) try {
        t = top.document.referrer;
      } catch (e) {
        t = document.referrer;
      }
      return t;
    }, x.exports.getHref = function() {
      location.href;
      if (x.exports.inIFrame()) try {
        top.location.href;
      } catch (e) {
        location.href;
      }
      return location.href;
    }, i = x.exports, function(e, t) {
      var r = this.os = {}, i = this.browser = {}, n = e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        o = e.match(/(Android);?[\s\/]+([\d.]+)?/), a = !!e.match(/\(Macintosh\; Intel /),
        s = e.match(/(iPad).*OS\s([\d_]+)/), l = e.match(/(iPod)(.*OS\s([\d_]+))?/),
        u = !s && e.match(/(iPhone\sOS)\s([\d_]+)/), c = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        h = /Win\d{2}|Windows/.test(t), d = e.match(/Windows Phone ([\d.]+)/), f = c && e.match(/TouchPad/),
        p = e.match(/Kindle\/([\d.]+)/), y = e.match(/Silk\/([\d._]+)/), g = e.match(/(BlackBerry).*Version\/([\d.]+)/),
        m = e.match(/(BB10).*Version\/([\d.]+)/), b = e.match(/(RIM\sTablet\sOS)\s([\d.]+)/), _ = e.match(/PlayBook/),
        v = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/), w = e.match(/Firefox\/([\d.]+)/),
        S = e.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        E = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        T = !v && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        t = T || e.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
      (i.webkit = !!n) && (i.version = n[1]), o && (r.android = !0, r.version = o[2]), u && !l && (r.ios = r.iphone = !0, r.version = u[2].replace(/_/g, ".")), s && (r.ios = r.ipad = !0, r.version = s[2].replace(/_/g, ".")), l && (r.ios = r.ipod = !0, r.version = l[3] ? l[3].replace(/_/g, ".") : null), d && (r.wp = !0, r.version = d[1]), c && (r.webos = !0, r.version = c[2]), f && (r.touchpad = !0), g && (r.blackberry = !0, r.version = g[2]), m && (r.bb10 = !0, r.version = m[2]), b && (r.rimtabletos = !0, r.version = b[2]), _ && (i.playbook = !0), p && (r.kindle = !0, r.version = p[1]), y && (i.silk = !0, i.version = y[1]), !y && r.android && e.match(/Kindle Fire/) && (i.silk = !0), v && (i.chrome = !0, i.version = v[1]), w && (i.firefox = !0, i.version = w[1]), S && (r.firefoxos = !0, r.version = S[1]), E && (i.ie = !0, i.version = E[1]), t && (a || r.ios || h || o) && (i.safari = !0, r.ios || (i.version = t[1])), T && (i.webview = !0), !a || (T = e.match(/[\d]*_[\d]*_[\d]*/)) && 0 < T.length && T[0] && (r.version = T[0].replace(/_/g, ".")), r.tablet = !!(s || _ || o && !e.match(/Mobile/) || w && e.match(/Tablet/) || E && !e.match(/Phone/) && e.match(/Touch/)), r.phone = !(r.tablet || r.ipod || !(o || u || c || g || m || v && e.match(/Android/) || v && e.match(/CriOS\/([\d.]+)/) || w && e.match(/Mobile/) || E && e.match(/Touch/))), r.pc = !r.tablet && !r.phone, a ? r.name = "macOS" : h ? (r.name = "windows", r.version = function() {
        var e = navigator.userAgent, t = "";
        (-1 < e.indexOf("Windows NT 5.0") || -1 < e.indexOf("Windows 2000")) && (t = "2000");
        (-1 < e.indexOf("Windows NT 5.1") || -1 < e.indexOf("Windows XP")) && (t = "XP");
        (-1 < e.indexOf("Windows NT 5.2") || -1 < e.indexOf("Windows 2003")) && (t = "2003");
        (-1 < e.indexOf("Windows NT 6.0") || -1 < e.indexOf("Windows Vista")) && (t = "Vista");
        (-1 < e.indexOf("Windows NT 6.1") || -1 < e.indexOf("Windows 7")) && (t = "7");
        (-1 < e.indexOf("Windows NT 6.2") || -1 < e.indexOf("Windows 8")) && (t = "8");
        (-1 < e.indexOf("Windows NT 6.3") || -1 < e.indexOf("Windows 8.1")) && (t = "8.1");
        (-1 < e.indexOf("Windows NT 10") || -1 < e.indexOf("Windows 10")) && (t = "10");
        return t;
      }()) : r.name = function() {
        var e = navigator.userAgent, t = "other", r = x.exports.os;
        if (r.ios) return "iOS";
        if (r.android) return "android";
        if (-1 < e.indexOf("Baiduspider")) return "Baiduspider";
        if (-1 < e.indexOf("PlayStation")) return "PS4";
        r = "Win32" == navigator.platform || "Windows" == navigator.platform || -1 < e.indexOf("Windows"), e = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
        e && (t = "macOS");
        "X11" != navigator.platform || r || e || (t = "Unix");
        -1 < String(navigator.platform).indexOf("Linux") && (t = "Linux");
        if (r) return "windows";
        return t;
      }(), i.name = (r = navigator.userAgent.toLowerCase(), (i = x.exports.browser).firefox ? "Firefox" : i.ie ? /edge/.test(r) ? "Edge" : "IE" : /micromessenger/.test(r) ? "\u5fae\u4fe1\u5185\u7f6e\u6d4f\u89c8\u5668" : /qqbrowser/.test(r) ? "QQ\u6d4f\u89c8\u5668" : i.webview ? "webview" : i.chrome ? "Chrome" : i.safari ? "Safari" : /baiduspider/.test(r) ? "Baiduspider" : /ucweb/.test(r) || /UCBrowser/.test(r) ? "UC" : /opera/.test(r) ? "Opera" : /ucweb/.test(r) ? "UC" : /360se/.test(r) ? "360\u6d4f\u89c8\u5668" : /bidubrowser/.test(r) ? "\u767e\u5ea6\u6d4f\u89c8\u5668" : /metasr/.test(r) ? "\u641c\u72d7\u6d4f\u89c8\u5668" : /lbbrowser/.test(r) ? "\u730e\u8c79\u6d4f\u89c8\u5668" : /playstation/.test(r) ? "PS4\u6d4f\u89c8\u5668" : void 0);
    }.call(i, navigator.userAgent, navigator.platform);
  }, {}],
  233: [function(e, t, r) {
    var s = e("./dom");
    t.exports.getAbsoluteURL = function(e) {
      return e = !e.match(/^https?:\/\//) ? s.createEl("div", { innerHTML: "<a href=\"" + e + "\">x</a>" }).firstChild.href : e;
    }, t.exports.parseUrl = function(e) {
      var t, r = ["protocol", "hostname", "port", "pathname", "search", "hash", "host"],
        i = s.createEl("a", { href: e }), n = "" === i.host && "file:" !== i.protocol;
      n && ((t = s.createEl("div")).innerHTML = "<a href=\"" + e + "\"></a>", i = t.firstChild, t.setAttribute("style", "display:none; position:absolute;"), document.body.appendChild(t));
      for (var o = {}, a = 0; a < r.length; a++) o[r[a]] = i[r[a]];
      return o.segments = i.pathname.replace(/^\//, "").split("/"), n && document.body.removeChild(t), o;
    };
  }, { "./dom": 219 }],
  234: [function(e, r, t) {
    var i = e("./dom"), n = e("./ua"), o = e("./playerutil");
    r.exports.formatTime = function(e) {
      var t = Math.floor(e), r = Math.floor(t / 3600);
      return t %= 3600, e = Math.floor(t / 60), t = t % 60, !(r === 1 / 0 || isNaN(r) || e === 1 / 0 || isNaN(e) || t === 1 / 0 || isNaN(t)) && ("00" === (r = 10 <= r ? r : "0" + r) ? "" : r + ":") + (e = 10 <= e ? e : "0" + e) + ":" + (t = 10 <= t ? t : "0" + t);
    }, r.exports.extractTime = function(e) {
      if (e) {
        var t = parseInt(e.getHours()), r = parseInt(e.getMinutes()), e = parseInt(e.getSeconds());
        return ("00" === (t = 10 <= t ? t : "0" + t) ? "" : t + ":") + (r = 10 <= r ? r : "0" + r) + ":" + (e = 10 <= e ? e : "0" + e);
      }
      return "";
    }, r.exports.convertToTimestamp = function(e, t) {
      var r = "";
      return e && (t ? r = e.gettime() : (r = Date.parse(e), r /= 1e3)), r;
    }, r.exports.convertToDate = function(e, t) {
      var r = "";
      return e && (r = new Date).setTime(1e3 * e), r;
    }, r.exports.parseTime = function(e) {
      if (!e) return "00:00:00";
      var t = e.split(":"), r = 0, i = 0, e = 0;
      return 3 === t.length ? (r = t[0], i = t[1], e = t[2]) : 2 === t.length ? (i = t[0], e = t[1]) : 1 === t.length && (e = t[0]), 3600 * (r = parseInt(r, 10)) + 60 * (i = parseInt(i, 10)) + (e = Math.ceil(parseFloat(e)));
    }, r.exports.formatDate = function(e, t) {
      var r, i = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "H+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds()
      };
      for (r in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))), i) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[r] : ("00" + i[r]).substr(("" + i[r]).length)));
      return t;
    }, r.exports.sleep = function(e) {
      for (var t = Date.now(); Date.now() - t <= e;) ;
    }, r.exports.htmlEncodeAll = function(e) {
      return null == e ? "" : e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }, r.exports.toBinary = function(e) {
      if (!window.atob) return "";
      for (var t = atob(e), r = t.length, i = new Uint8Array(r), n = 0; n < r; n++) i[n] = t.charCodeAt(n);
      return i;
    }, r.exports.readyBinary = function(e) {
      for (var t = new Uint8Array(e), r = t.length, i = "", n = 0; n < r; n++) i += t[n];
      return i;
    }, r.exports.delayHide = function(e, t) {
      e && (void 0 === t && (t = 1e3), e.delayHanlder && clearTimeout(e.delayHanlder), e.delayHanlder = setTimeout(function() {
        i.css(e, "display", "none");
      }, t));
    }, r.exports.openInFile = function() {
      return -1 != window.location.protocol.toLowerCase().indexOf("file");
    }, r.exports.contentProtocolMixed = function(e) {
      return !!(n.os.pc && (o.isHls(e) && !n.browser.safari || o.isFlv(e)) && "https:" == window.location.protocol.toLowerCase() && e && -1 < e.toLowerCase().indexOf("http://"));
    }, r.exports.queryString = function(e) {
      var t, r, i;
      return 2 !== (e = (e = decodeURIComponent(e)).split("?")).length ? {} : (e = e[1], (t = e.split("&")) ? (r = {}, i = 0, $(t).each(function() {
        var e = t[i].split("=");
        2 === e.length && (r[e[0]] = e[1].replace(/\+/g, " ")), i++;
      }), r) : {});
    }, r.exports.log = function(e) {
      var t = window.location.href, t = r.exports.queryString(t);
      t && 1 == t.debug && console.log(e);
    };
  }, { "./dom": 219, "./playerutil": 230, "./ua": 232 }],
  235: [function(e, t, r) {
    function a(e) {
      for (var t = 5381, r = e.length; r;) t = 33 * t ^ e.charCodeAt(--r);
      return (t >>> 0).toString();
    }

    var s = e("./vttparse");
    t.exports = {
      parse: function(e, t, r) {
        var i, e = e.trim().replace(/\r\n|\n\r|\n|\r/g, "\n").split("\n"), n = [], o = new s;
        o.oncue = function(e) {
          e.id = a(e.startTime) + a(e.endTime) + a(e.text), e.text = decodeURIComponent(escape(e.text)), e.isBig = !1;
          var t = e.text.split("#xywh=");
          2 == t.length && (t = t[1].split(","), e.x = t[0], e.y = t[1], e.w = t[2], e.h = t[3], e.isBig = !0), 0 < e.endTime && n.push(e);
        }, o.onparsingerror = function(e) {
          i = e;
        }, o.onflush = function() {
          if (i && r) return r(i), void console.log(i);
          t(n);
        }, e.forEach(function(e) {
          o.parse(e + "\n");
        }), o.flush();
      }
    };
  }, { "./vttparse": 237 }],
  236: [function(e, t, r) {
    t.exports = function() {
      if ("undefined" != typeof window && window.VTTCue) return window.VTTCue;
      var v = { "": !0, lr: !0, rl: !0 }, t = { start: !0, middle: !0, end: !0, left: !0, right: !0 };

      function w(e) {
        return "string" == typeof e && (!!t[e.toLowerCase()] && e.toLowerCase());
      }

      function S(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r, i = arguments[t];
          for (r in i) e[r] = i[r];
        }
        return e;
      }

      function e(e, t, r) {
        var i = this, n = function() {
          if ("undefined" != typeof navigator) return /MSIE\s8\.0/.test(navigator.userAgent);
        }(), o = {};
        n ? i = document.createElement("custom") : o.enumerable = !0, i.hasBeenReset = !1;
        var a = "", s = !1, l = e, u = t, c = r, h = null, d = "", f = !0, p = "auto", y = "start", g = 50,
          m = "middle", b = 50, _ = "middle";
        if (Object.defineProperty(i, "id", S({}, o, {
          get: function() {
            return a;
          }, set: function(e) {
            a = "" + e;
          }
        })), Object.defineProperty(i, "pauseOnExit", S({}, o, {
          get: function() {
            return s;
          }, set: function(e) {
            s = !!e;
          }
        })), Object.defineProperty(i, "startTime", S({}, o, {
          get: function() {
            return l;
          }, set: function(e) {
            if ("number" != typeof e) throw new TypeError("Start time must be set to a number.");
            l = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "endTime", S({}, o, {
          get: function() {
            return u;
          }, set: function(e) {
            if ("number" != typeof e) throw new TypeError("End time must be set to a number.");
            u = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "text", S({}, o, {
          get: function() {
            return c;
          }, set: function(e) {
            c = "" + e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "region", S({}, o, {
          get: function() {
            return h;
          }, set: function(e) {
            h = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "vertical", S({}, o, {
          get: function() {
            return d;
          }, set: function(e) {
            e = "string" == typeof (e = e) && (!!v[e.toLowerCase()] && e.toLowerCase());
            if (!1 === e) throw new SyntaxError("An invalid or illegal string was specified.");
            d = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "snapToLines", S({}, o, {
          get: function() {
            return f;
          }, set: function(e) {
            f = !!e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "line", S({}, o, {
          get: function() {
            return p;
          }, set: function(e) {
            if ("number" != typeof e && "auto" !== e) throw new SyntaxError("An invalid number or illegal string was specified.");
            p = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "lineAlign", S({}, o, {
          get: function() {
            return y;
          }, set: function(e) {
            e = w(e);
            if (!e) throw new SyntaxError("An invalid or illegal string was specified.");
            y = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "position", S({}, o, {
          get: function() {
            return g;
          }, set: function(e) {
            if (e < 0 || 100 < e) throw new Error("Position must be between 0 and 100.");
            g = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "positionAlign", S({}, o, {
          get: function() {
            return m;
          }, set: function(e) {
            e = w(e);
            if (!e) throw new SyntaxError("An invalid or illegal string was specified.");
            m = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "size", S({}, o, {
          get: function() {
            return b;
          }, set: function(e) {
            if (e < 0 || 100 < e) throw new Error("Size must be between 0 and 100.");
            b = e, this.hasBeenReset = !0;
          }
        })), Object.defineProperty(i, "align", S({}, o, {
          get: function() {
            return _;
          }, set: function(e) {
            e = w(e);
            if (!e) throw new SyntaxError("An invalid or illegal string was specified.");
            _ = e, this.hasBeenReset = !0;
          }
        })), i.displayState = void 0, n) return i;
      }

      return e.prototype.getCueAsHTML = function() {
        return window.WebVTT.convertCueToDOMTree(window, this.text);
      }, e;
    }();
  }, {}],
  237: [function(e, t, r) {
    function i() {
      return {
        decode: function(e) {
          if (!e) return "";
          if ("string" != typeof e) throw new Error("Error - expected string data.");
          return decodeURIComponent(encodeURIComponent(e));
        }
      };
    }

    var s = e("./vttcue");

    function n() {
      this.window = window, this.state = "INITIAL", this.buffer = "", this.decoder = new i, this.regionList = [];
    }

    function u() {
      this.values = Object.create(null);
    }

    function c(e, t, r, i) {
      var n, o, a = i ? e.split(i) : [e];
      for (n in a) "string" == typeof a[n] && (2 === (o = a[n].split(r)).length && t(o[0], o[1]));
    }

    u.prototype = {
      set: function(e, t) {
        this.get(e) || "" === t || (this.values[e] = t);
      }, get: function(e, t, r) {
        return r ? this.has(e) ? this.values[e] : t[r] : this.has(e) ? this.values[e] : t;
      }, has: function(e) {
        return e in this.values;
      }, alt: function(e, t, r) {
        for (var i = 0; i < r.length; ++i) if (t === r[i]) {
          this.set(e, t);
          break;
        }
      }, integer: function(e, t) {
        /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10));
      }, percent: function(e, t) {
        return !!(t.match(/^([\d]{1,3})(\.[\d]*)?%$/) && 0 <= (t = parseFloat(t)) && t <= 100) && (this.set(e, t), !0);
      }
    };
    var h = new s(0, 0, 0), d = "middle" === h.align ? "middle" : "center";

    function l(i, e, o) {
      var t, r, a, n = i;

      function s() {
        var e, t,
          e = (t = (e = i).match(/^(\d+):(\d{2})(:\d{2})?(\.\d{3})?/)) ? (e = (e = t[4]) && e.replace(".", ""), t[3] ? r(t[1], t[2], t[3].replace(":", ""), e) : 59 < t[1] ? r(t[1], t[2], 0, e) : r(0, t[1], t[2], e)) : null;

        function r(e, t, r, i) {
          return 3600 * (0 | e) + 60 * (0 | t) + (0 | r) + (0 | i) / 1e3;
        }

        if (null === e) throw new Error("Malformed timestamp: " + n);
        return i = i.replace(/^[^\sa-zA-Z-]+/, ""), e;
      }

      function l() {
        i = i.replace(/^\s+/, "");
      }

      if (l(), e.startTime = s(), l(), "--\x3e" !== i.substr(0, 3)) throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + n);
      i = i.substr(3), l(), e.endTime = s(), l(), t = i, r = e, a = new u, c(t, function(e, t) {
        switch (e) {
          case"region":
            for (var r = o.length - 1; 0 <= r; r--) if (o[r].id === t) {
              a.set(e, o[r].region);
              break;
            }
            break;
          case"vertical":
            a.alt(e, t, ["rl", "lr"]);
            break;
          case"line":
            var i = t.split(","), n = i[0];
            a.integer(e, n), a.percent(e, n) && a.set("snapToLines", !1), a.alt(e, n, ["auto"]), 2 === i.length && a.alt("lineAlign", i[1], ["start", d, "end"]);
            break;
          case"position":
            i = t.split(","), a.percent(e, i[0]), 2 === i.length && a.alt("positionAlign", i[1], ["start", d, "end", "line-left", "line-right", "auto"]);
            break;
          case"size":
            a.percent(e, t);
            break;
          case"align":
            a.alt(e, t, ["start", d, "end", "left", "right"]);
        }
      }, /:/, /\s/), r.region = a.get("region", null), r.vertical = a.get("vertical", ""), "auto" === (t = a.get("line", "auto")) && -1 === h.line && (t = -1), r.line = t, r.lineAlign = a.get("lineAlign", "start"), r.snapToLines = a.get("snapToLines", !0), r.size = a.get("size", 100), r.align = a.get("align", d), "auto" === (t = a.get("position", "auto")) && 50 === h.position && (t = "start" === r.align || "left" === r.align ? 0 : "end" === r.align || "right" === r.align ? 100 : 50), r.position = t;
    }

    n.prototype = {
      parse: function(e) {
        var i = this;

        function t() {
          for (var e = 0, t = (t = i.buffer).replace(/<br(?: \/)?>/gi, "\n"); e < t.length && "\r" !== t[e] && "\n" !== t[e];) ++e;
          var r = t.substr(0, e);
          return "\r" === t[e] && ++e, "\n" === t[e] && ++e, i.buffer = t.substr(e), r;
        }

        e && (i.buffer += i.decoder.decode(e, { stream: !0 }));
        try {
          if ("INITIAL" === i.state) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            var r, n = (r = t()).match(/^WEBVTT([ \t].*)?$/);
            if (!n || !n[0]) throw new Error("Malformed WebVTT signature.");
            i.state = "HEADER";
          }
          for (var o = !1; i.buffer;) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            switch (o ? o = !1 : r = t(), i.state) {
              case"HEADER":
                /:/.test(r) ? c(r, function(e, t) {
                  "Region" === e && console.log("parse region", t);
                }, /:/) : r || (i.state = "ID");
                continue;
              case"NOTE":
                r || (i.state = "ID");
                continue;
              case"ID":
                if (/^NOTE($|[ \t])/.test(r)) {
                  i.state = "NOTE";
                  break;
                }
                if (!r) continue;
                if (i.cue = new s(0, 0, ""), i.state = "CUE", -1 === r.indexOf("--\x3e")) {
                  i.cue.id = r;
                  continue;
                }
              case"CUE":
                try {
                  l(r, i.cue, i.regionList);
                } catch (e) {
                  i.cue = null, i.state = "BADCUE";
                  continue;
                }
                i.state = "CUETEXT";
                continue;
              case"CUETEXT":
                var a = -1 !== r.indexOf("--\x3e");
                if (!r || a && (o = !0)) {
                  i.oncue && i.oncue(i.cue), i.cue = null, i.state = "ID";
                  continue;
                }
                i.cue.text && (i.cue.text += "\n"), i.cue.text += r;
                continue;
              case"BADCUE":
                r || (i.state = "ID");
                continue;
            }
          }
        } catch (e) {
          "CUETEXT" === i.state && i.cue && i.oncue && i.oncue(i.cue), i.cue = null, i.state = "INITIAL" === i.state ? "BADWEBVTT" : "BADCUE";
        }
        return this;
      }, flush: function() {
        try {
          if (this.buffer += this.decoder.decode(), !this.cue && "HEADER" !== this.state || (this.buffer += "\n\n", this.parse()), "INITIAL" === this.state) throw new Error("Malformed WebVTT signature.");
        } catch (e) {
          throw e;
        }
        return this.onflush && this.onflush(), this;
      }
    }, t.exports = n;
  }, { "./vttcue": 236 }],
  238: [function(e, t, r) {
    var n = e("../lib/io");
    e("../lib/storage");

    function i(e) {
      this._uploadDuration = e.logDuration || 5, this._uploadCount = e.logCount || 10, this._logReportTo = e.logReportTo, this._logs = [], this._retry = 0, this._disposed = !1, this._supportLocalStorage = !0;
      var t, r = this;
      window && (window.onbeforeunload = function(e) {
        0 < r._logs.length && (r._supportLocalStorage ? localStorage.setItem("__aliplayer_log_data", JSON.stringify(r._logs)) : (r._report(), function(e) {
          for (var t = (new Date).getTime(), r = t; r < t + e;) r = (new Date).getTime();
        }(500)));
      });
      try {
        localStorage ? (t = localStorage.getItem("__aliplayer_log_data"), localStorage.removeItem("__aliplayer_log_data"), t && (this._logs = JSON.parse(t))) : this._supportLocalStorage = !1;
      } catch (e) {
        this._supportLocalStorage = !1;
      }
      this._start();
    }

    i.prototype.add = function(e) {
      var t = this._logs.length;
      if (e.__time__ = Math.round(new Date / 1e3), 0 < t && "4001" == e.e) {
        t = this._logs[t - 1];
        if ("4001" == t.e && t.__time__ - e.__time__ < 5) return;
      }
      this._logs.push(e), (this._logs.length > this._uploadCount || "4001" == e.e || "2002" == e.e) && this._report();
    }, i.prototype.dispose = function() {
      this._report(), this._disposed = !0;
    }, i.prototype._start = function() {
      this._disposed = !1;
      this._retry = 0, this._report();
    }, i.prototype._report = function(t) {
      var e, r, i;
      this._tickHandler && (clearTimeout(this._tickHandler), this._tickHandler = null), 0 < (t = t || this._logs.splice(0, this._uploadCount)).length ? (i = {
        "Content-Type": "application/json;charset=UTF-8",
        "x-log-apiversion": "0.6.0",
        "x-log-bodyrawsize": (e = JSON.stringify({ __logs__: t, __source__: "" })).length
      }, n.postWithHeader((r = this)._logReportTo, e, i, function(e) {
        r._tick();
      }, function(e) {
        0 == r._retry ? (r._retry = 1, r._report(t)) : r._tick();
      })) : this._tick();
    }, i.prototype._tick = function() {
      var e;
      this._disposed || (this._retry = 0, (e = this)._logs.length > this._uploadCount ? e._report() : this._tickHandler = setTimeout(function() {
        e._report();
      }, 1e3 * this._uploadDuration));
    }, t.exports = i;
  }, { "../lib/io": 225, "../lib/storage": 231 }],
  239: [function(e, t, r) {
    var i = e("../lib/oo"), a = e("../lib/object"), f = e("../lib/data"), s = e("../lib/io"), p = e("../lib/ua"),
      y = e("../config"), n = e("../player/base/event/eventtype"), g = e("./util"), m = e("./log"), o = 0, l = {
        STARTFETCHDATA: 1003,
        COMPLETEFETCHDATA: 1004,
        PREPARE: 1101,
        PREPAREEND: 1102,
        STARTPLAY: 2e3,
        PLAY: 2001,
        STOP: 2002,
        PAUSE: 2003,
        SEEK: 2004,
        FULLSREEM: 2005,
        QUITFULLSCREEM: 2006,
        RESOLUTION: 2007,
        RESOLUTION_DONE: 2008,
        RECOVER: 2010,
        SEEK_END: 2011,
        FETCHEDIP: 2020,
        CDNDETECT: 2021,
        DETECT: 2022,
        UNDERLOAD: 3002,
        LOADED: 3001,
        HEARTBEAT: 9001,
        ERROR: 4001,
        ERRORRETRY: 4002,
        SNAPSHOT: 2027,
        ROTATE: 2028,
        IMAGE: 2029,
        THUMBNAILSTART: 2031,
        THUMBNAILCOMPLETE: 2032,
        CCSTART: 2033,
        CCCOMPLETE: 2034,
        AUDIOTRACKSTART: 2033,
        AUDIOTRACKCOMPLETE: 2034
      }, i = i.extend({
        init: function(e, t, r) {
          this.trackLog = r = void 0 === r ? !0 : r, this.player = e, this.requestId = "", this.sessionId = f.guid(), this.playId = 0, this.firstPlay = !0, this.osName = p.os.name, this.osVersion = p.os.version || "", this.exName = p.browser.name, this.exVersion = p.browser.version || "", this._logService = "", t.logBatched && (this._logService = new m(y));
          var i = this.player.getOptions(), n = t.from || "", o = (i.isLive, i.isLive ? "live" : "vod"), a = "pc";
          p.IS_IPAD ? a = "pad" : p.os.phone && (a = "phone");
          var s = this.encodeURL(p.getReferer()), l = p.getHref(), u = this.encodeURL(l), c = "";
          l && (c = p.getHost(l));
          var h = y.h5Version, d = g.getUuid(), r = i.source ? this.encodeURL(i.source) : "", e = p.getHost(i.source),
            t = i.userId ? i.userId + "" : "0", l = this.sessionId, i = (new Date).getTime();
          this._userNetInfo = { cdnIp: "", localIp: "" };
          this.opt = {
            APIVersion: "0.6.0",
            t: i,
            ll: "info",
            lv: "1.0",
            pd: "player",
            md: "saas_player",
            ui: "saas_player",
            sm: "play",
            os: this.osName,
            ov: this.osVersion,
            et: this.exName,
            ev: this.exVersion,
            uat: p.USER_AGENT,
            hn: "0.0.0.0",
            bi: n,
            ri: l,
            e: "0",
            args: "0",
            vt: o,
            tt: a,
            dm: "h5",
            av: h,
            uuid: d,
            vu: r,
            vd: e,
            ua: t,
            dn: "custom",
            cdn_ip: "0.0.0.0",
            app_n: c,
            r: s,
            pu: u
          }, this.bindEvent();
        }, updateVideoInfo: function(e) {
          e = e.from || "";
          this.opt.bi = e + "", this.updateSourceInfo();
        }, updateSourceInfo: function() {
          var e, t = this.player.getOptions();
          t && (e = t.source ? this.encodeURL(t.source) : "", t = p.getHost(t.source), this.opt.vu = e, this.opt.vd = t);
        }, replay: function() {
          this.reset(), this.player.trigger(n.Video.LoadStart), this.player.trigger(n.Video.LoadedMetadata), this.player.trigger(n.Video.LoadedData);
        }, bindEvent: function() {
          var t = this;
          this.player.on(n.Player.Init, function() {
            t._onPlayerInit();
          }), this.player.on(n.Video.LoadStart, function() {
            t._onPlayerloadstart();
          }), this.player.on(n.Video.LoadedMetadata, function() {
            t._onPlayerLoadMetadata();
          }), this.player.on(n.Video.LoadedData, function() {
            t._onPlayerLoaddata();
          }), this.player.on(n.Video.Play, function() {
            t._onPlayerPlay();
          }), this.player.on(n.Video.Playing, function() {
            t._onPlayerReady();
          }), this.player.on(n.Video.Ended, function() {
            t._onPlayerFinish();
          }), this.player.on(n.Video.Pause, function() {
            t._onPlayerPause();
          }), this.player.on(n.Private.SeekStart, function(e) {
            t._onPlayerSeekStart(e);
          }), this.player.on(n.Private.EndStart, function(e) {
            t._seekEndData = e.paramData;
          }), this.player.on(n.Player.Waiting, function() {
            t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._waitingDelayLoadingShowHandle = setTimeout(function() {
              t._onPlayerLoaded();
            }, 1e3 * t.player._options.delayLoadingShow);
          }), this.player.on(n.Video.CanPlayThrough, function() {
          }), this.player.on(n.Video.CanPlay, function() {
            t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._onPlayerUnderload(), t._onPlayerCanplay();
          }), this.player.on(n.Video.TimeUpdate, function() {
            t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._seekEndData && t.player._seeking && t._onPlayerSeekEnd();
          }), this.player.on(n.Player.Error, function() {
            t._onPlayerError();
          }), this.player.on(n.Player.RequestFullScreen, function() {
            t._onFullscreenChange(1);
          }), this.player.on(n.Player.CancelFullScreen, function() {
            t._onFullscreenChange(0);
          }), this.player.on(n.Private.PREPARE, function(e) {
            t._prepareTime = (new Date).getTime(), t._log("PREPARE", { dn: e.paramData });
          }), this.player.on(n.Player.Snapshoted, function() {
            t._log("SNAPSHOT");
          }), setInterval(function() {
            var e;
            t.player.getCurrentTime() && (e = Math.floor(1e3 * t.player.getCurrentTime()), t.player.paused() || 30 <= ++o && (t._log("HEARTBEAT", {
              vt: e,
              interval: 1e3 * o
            }), o = 0));
          }, 1e3);
        }, removeEvent: function() {
          this.player.off("init"), this.player.off("ready"), this.player.off("ended"), this.player.off("play"), this.player.off("pause"), this.player.off("seekStart"), this.player.off("seekEnd"), this.player.off("canplaythrough"), this.player.off("playing"), this.player.off("timeupdate"), this.player.off("error"), this.player.off("fullscreenchange"), this.player.off(n.Private.PREPARE), this._logService && this._logService.dispose();
        }, reset: function() {
          this.startTimePlay = 0, this.buffer_flag = 0, this.firstPlay = !1, this.playId = 0, this.loadstarted = 0, this._LoadedData = 0, this._canPlay = 0;
        }, encodeURL: function(e) {
          if (!e) return "";
          var t = this.player.getOptions();
          return t && !t.logBatched ? encodeURIComponent(e) : e;
        }, _onFullscreenChange: function(e) {
          e ? this._log("FULLSREEM", {}) : this._log("QUITFULLSCREEM", {});
        }, _onPlayerloadstart: function() {
          this.loadstartTime = (new Date).getTime(), this.playId = f.guid(), !this.loadstarted && this.player._isPreload() && (this.loadstarted = 1, this._log("STARTPLAY", { vt: (new Date).getTime() }));
        }, _onPlayerLoadMetadata: function() {
          this.loadMetaDataCost = (new Date).getTime() - this.loadstartTime;
        }, _onPlayerLoaddata: function() {
          var e, t;
          this._LoadedData || this.buffer_flag || (t = e = 0, this.player.tag && (e = this.player.tag.videoWidth, t = this.player.tag.videoHeight), this._log("PREPAREEND", {
            tc: (new Date).getTime() - this._prepareTime,
            cc: (new Date).getTime() - this.loadstartTime,
            md: this.loadMetaDataCost,
            mi: JSON.stringify({ type: "video", definition: e + "*" + t })
          })), this._LoadedData = 1;
        }, _onPlayerCanplay: function() {
          this._canPlay = 1, this._reportPlay();
        }, _onPlayerInit: function() {
          this.buffer_flag = 0, this.pause_flag = 0, this.startTimePlay = 0, this.loadstarted = 0, this._LoadedData = 0, this._canPlay = 0;
        }, _onPlayerReady: function() {
          this.startTimePlay || (this.startTimePlay = (new Date).getTime());
        }, _onPlayerFinish: function() {
          this._log("STOP", { vt: Math.floor(1e3 * this.player.getCurrentTime()) }), this.reset();
        }, _reportPlay: function() {
          return !(this.buffer_flag || !this._LoadedData || !this.playstartTime) && (this.first_play_time = (new Date).getTime(), this._log("PLAY", {
            dsm: "fix",
            tc: this.first_play_time - this.loadstartTime,
            fc: this.first_play_time - this.playstartTime
          }), this.buffer_flag = 1, !0);
        }, _onPlayerPlay: function() {
          this.playstartTime = (new Date).getTime(), 0 == this.playId && (this.playId = f.guid()), this.firstPlay || 0 != this.pause_flag || this.player._seeking || (this.sessionId = f.guid()), this.player._isPreload() || (this._log("STARTPLAY", { vt: (new Date).getTime() }), this.loadstartTime = (new Date).getTime()), this._canPlay && this._reportPlay() || this.buffer_flag && this.pause_flag && (this.pause_flag = 0, this.pauseEndTime = (new Date).getTime(), this._log("RECOVER", {
            vt: Math.floor(1e3 * this.player.getCurrentTime()),
            cost: this.pauseEndTime - this.pauseTime
          }));
        }, _onPlayerPause: function() {
          this.buffer_flag && this.startTimePlay && (this.player._seeking || (this.pause_flag = 1, this.pauseTime = (new Date).getTime(), this._log("PAUSE", { vt: Math.floor(1e3 * this.player.getCurrentTime()) })));
        }, _onPlayerSeekStart: function(e) {
          this.seekStartTime = e.paramData.fromTime, this.startTimePlay = 0, this.seekStartStamp = (new Date).getTime();
        }, _onPlayerSeekEnd: function() {
          this.seekEndStamp = (new Date).getTime(), this._log("SEEK", {
            drag_from_timestamp: Math.floor(1e3 * this.seekStartTime),
            drag_to_timestamp: Math.floor(1e3 * this._seekEndData.toTime)
          }), this._log("SEEK_END", {
            vt: Math.floor(1e3 * this.player.getCurrentTime()),
            cost: this.seekEndStamp - this.seekStartStamp
          }), this._seekEndData = null;
        }, _onPlayerLoaded: function() {
          var e;
          this.buffer_flag && this.startTimePlay && (this.stucking || this.player._seeking || (this.stuckStartTime = (new Date).getTime(), this.stuckStartTime - this.startTimePlay <= 1e3 || (this.stucking = !0, e = this._getbwEstimator(), this._log("UNDERLOAD", {
            vt: Math.floor(1e3 * this.player.getCurrentTime()),
            bw: e
          }), this.stuckStartTime = (new Date).getTime())));
        }, _onPlayerUnderload: function() {
          var e, t, r;
          !this.buffer_flag && this.player._options && this.player._options.autoplay || this.stucking && !this.player._seeking && (e = Math.floor(1e3 * this.player.getCurrentTime()), r = this.stuckStartTime || (new Date).getTime(), 0 < (t = Math.floor((new Date).getTime() - r)) && (r = this._getbwEstimator(), this._log("LOADED", {
            vt: e,
            cost: t,
            bw: r
          })), this.stucking = !1);
        }, _onPlayerHeartBeat: function() {
          var e, t;
          this.player._seeking || (e = Math.floor(1e3 * this.player.getCurrentTime()), (t = this).timer || (this.timer = setTimeout(function() {
            this.player._seeking || t._log("HEARTBEAT", { progress: e }), clearTimeout(t.timer), t.timer = null;
          }, 6e4)));
        }, _onPlayerError: function() {
          this.playId = 0, this._LoadedData = 1, this.buffer_flag || this._reportPlay();
        }, _getbwEstimator: function() {
          var e = NaN;
          try {
            e = this.player._getbwEstimator && this.player._getbwEstimator();
          } catch (e) {
          }
          return e;
        }, _log: function(e, t) {
          if (this.trackLog) {
            this.updateSourceInfo();
            var r = a.copy(this.opt);
            this.requestId = f.guid();
            var i = y.logReportTo;
            r.e = l[e] + "", r.ri = this.sessionId, r.t = (new Date).getTime() + "", r.cdn_ip = this._userNetInfo.cdnIp, r.hn = this._userNetInfo.localIp;
            e = this.player.getCurrentQuality();
            "" != e && (r.definition = e.definition);
            var n = [];
            a.each(t, function(e, t) {
              n.push(e + "=" + t);
            });
            var o, e = "", t = this.player.getOptions();
            t && t.vid && (e = t.vid), n.push("vid=" + e);
            try {
              Aliplayer && Aliplayer.__logCallback__ && (r.args = n, Aliplayer.__logCallback__(r));
            } catch (e) {
              console.log(e);
            }
            return n = n.join("&"), r.args = this.encodeURL(n = "" == n ? "0" : n), this._logService ? this._logService.add(r) : (o = [], a.each(r, function(e, t) {
              o.push(e + "=" + t);
            }), o = o.join("&"), s.jsonp(i + "?" + o, function() {
            }, function() {
            })), this.sessionId;
          }
        }
      });
    t.exports = i;
  }, {
    "../config": 205,
    "../lib/data": 218,
    "../lib/io": 225,
    "../lib/object": 227,
    "../lib/oo": 228,
    "../lib/ua": 232,
    "../player/base/event/eventtype": 244,
    "./log": 238,
    "./util": 240
  }],
  240: [function(e, t, r) {
    var i = e("../lib/cookie"), n = e("../lib/data"), o = e("../lib/ua");
    t.exports.getUuid = function() {
      var e = i.get("p_h5_u");
      return e || (e = n.guid(), i.set("p_h5_u", e, 730)), e;
    }, t.exports.getTerminalType = function() {
      var e = "pc";
      return o.IS_IPAD ? e = "pad" : o.IS_ANDROID ? e = "android" : o.IS_IOS && (e = "iphone"), e;
    }, t.exports.returnUTCDate = function(e) {
      var t = e.getUTCFullYear(), r = e.getUTCMonth(), i = e.getUTCDate(), n = e.getUTCHours(), o = e.getUTCMinutes(),
        a = e.getUTCSeconds(), e = e.getUTCMilliseconds();
      return Date.UTC(t, r, i, n, o, a, e);
    }, t.exports.getRfc822 = function(e) {
      return e.toUTCString().replace("UTC", "GMT");
    };
  }, { "../lib/cookie": 217, "../lib/data": 218, "../lib/ua": 232 }],
  241: [function(e, t, r) {
    var o = e("./base/player"), a = e("./flash/flashplayer"), s = e("./saas/mtsplayer"), l = e("./saas/vodplayer"),
      u = e("./audio/audioplayer"), c = e("./hls/hlsplayer"), h = e("./flv/flvplayer"), d = e("./rts/rtsplayer"),
      f = e("./drm/drmplayer"), p = e("../lib/ua"), y = e("../lib/playerutil"),
      g = (e("../lib/dom"), e("../lib/io"), e("../lang/index"));
    t.exports.create = function(e, t) {
      navigator && navigator.userAgent && -1 < navigator.userAgent.indexOf("Olympic_Android") && (e.useNativeControls = !0), e.readyCallback = t = "function" != typeof t ? function() {
      } : t, g.setCurrentLanguage(e.language, "h5", e.languageTexts);
      var r = y.handleOption(e), i = r.source, t = y.isAudio(i);
      t && (r.mediaType = "audio");
      var n, e = y.createWrapper(r);
      if (e.player) return e.player;
      if (t) n = new u(e, r); else if (y.isRts(i)) n = new d(e, r); else if (!r.useFlashPrism && y.isFlv(i) && y.isSupportFlv()) n = new h(e, r); else if (p.IS_MOBILE || !r.useFlashPrism && !y.isRTMP(i)) if (r.vid && !r.source) if (r.authInfo) n = new s(e, r); else {
        if (!(r.playauth || r.accessKeyId && r.accessKeySecret)) {
          t = "vid=" + r.vid + " playauth='', playauth property is required by VOD(\u89c6\u9891\u70b9\u64ad) as new Aliplayer.";
          throw new Error(t);
        }
        n = new l(e, r);
      } else y.isDash(i) && y.isSupportMSE() ? n = new f(e, r) : y.isHls(i) ? y.canPlayHls() ? n = new (y.isSupportHls() && (y.isUsedHlsPluginOnMobile() || y.isSafariUsedHlsPlugin(r.useHlsPluginForSafari)) ? r.isDrm ? f : c : r.isDrm ? f : o)(e, r) : y.isSupportHls() ? n = new (r.isDrm ? f : c)(e, r) : p.os.pc ? r.userH5Prism || r.useH5Prism || (n = new a(e, r)) : n = new o(e, r) : n = (p.os.pc, new o(e, r)); else n = new a(e, r);
      return n;
    };
  }, {
    "../lang/index": 212,
    "../lib/dom": 219,
    "../lib/io": 225,
    "../lib/playerutil": 230,
    "../lib/ua": 232,
    "./audio/audioplayer": 242,
    "./base/player": 263,
    "./drm/drmplayer": 270,
    "./flash/flashplayer": 271,
    "./flv/flvplayer": 273,
    "./hls/hlsplayer": 275,
    "./rts/rtsplayer": 277,
    "./saas/mtsplayer": 281,
    "./saas/vodplayer": 287
  }],
  242: [function(e, t, r) {
    var i = e("../base/player"), n = e("../../ui/component"), o = e("../../lib/dom"), a = e("../../lib/object"),
      s = e("../../lib/playerutil"), e = i.extend({
        init: function(e, t) {
          this._isAudio = !0, void 0 === t.skinLayout && (t.skinLayout = s.defaultAudioLayout), i.call(this, e, t);
        }
      });
    e.prototype.createEl = function() {
      "AUDIO" !== this.tag.tagName && (this._el = this.tag, this.tag = n.prototype.createEl.call(this, "audio"));
      var t = this._el, e = this.tag;
      e.player = this;
      var r = o.getElementAttributes(e);
      return a.each(r, function(e) {
        t.setAttribute(e, r[e]);
      }), this.setVideoAttrs(), e.parentNode && e.parentNode.insertBefore(t, e), o.insertFirst(e, t), t;
    }, t.exports = e;
  }, {
    "../../lib/dom": 219,
    "../../lib/object": 227,
    "../../lib/playerutil": 230,
    "../../ui/component": 296,
    "../base/player": 263
  }],
  243: [function(e, t, r) {
    var a = e("../../../lib/event"), s = e("./eventtype"), i = e("../eventHandler/video/index"),
      n = e("../eventHandler/player/index");
    t.exports.offAll = function(e) {
      var t, r, i, n = e.tag, o = e._el;
      for (t in s.Video) a.off(n, s.Video[t]);
      for (r in s.Player) a.off(o, s.Player[r]);
      for (i in s.Private) a.off(o, s.Private[i]);
    }, t.exports.onAll = function(e) {
      i.bind(e), n.bind(e);
    };
  }, {
    "../../../lib/event": 220,
    "../eventHandler/player/index": 248,
    "../eventHandler/video/index": 257,
    "./eventtype": 244
  }],
  244: [function(e, t, r) {
    t.exports = {
      Video: {
        TimeUpdate: "timeupdate",
        Play: "play",
        Playing: "playing",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        Suspend: "suspend",
        Stalled: "stalled",
        LoadStart: "loadstart",
        DurationChange: "durationchange",
        LoadedData: "loadeddata",
        LoadedMetadata: "loadedmetadata",
        Progress: "progress",
        CanPlayThrough: "canplaythrough",
        ContextMenu: "contextmenu",
        Seeking: "seeking",
        Seeked: "seeked",
        ManualEnded: "manualended"
      },
      Player: {
        TimeUpdate: "timeupdate",
        DurationChange: "durationchange",
        Init: "init",
        Ready: "ready",
        Play: "play",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        RequestFullScreen: "requestFullScreen",
        CancelFullScreen: "cancelFullScreen",
        Snapshoted: "snapshoted",
        Snapshoting: "snapshoting",
        OnM3u8Retry: "onM3u8Retry",
        LiveStreamStop: "liveStreamStop",
        AutoPlayPrevented: "autoPlayPrevented",
        AutoPlay: "autoplay",
        StartSeek: "startSeek",
        CompleteSeek: "completeSeek",
        TextTrackReady: "textTrackReady",
        AudioTrackReady: "audioTrackReady",
        AudioTrackUpdated: "audioTrackUpdated",
        LevelsLoaded: "levelsLoaded",
        AudioTrackSwitch: "audioTrackSwitch",
        AudioTrackSwitched: "audioTrackSwitched",
        LevelSwitch: "levelSwitch",
        LevelSwitched: "levelSwitched",
        MarkerDotOver: "markerDotOver",
        MarkerDotOut: "markerDotOut",
        DefaultBandWidth: "defaultbandwidth",
        ResolutionChange: "resolutionChange",
        SeiFrame: "seiFrame"
      },
      Private: {
        Play_Btn_Show: "play_btn_show",
        UiH5Ready: "uiH5Ready",
        Error_Hide: "error_hide",
        Error_Show: "error_show",
        Info_Show: "info_show",
        Info_Hide: "info_hide",
        H5_Loading_Show: "h5_loading_show",
        H5_Loading_Hide: "h5_loading_hide",
        HideProgress: "hideProgress",
        CancelHideProgress: "cancelHideProgress",
        UpdateProgress: "updateProgress",
        UpdateCursorPosition: "updateCursorPosition",
        Click: "click",
        MouseOver: "mouseover",
        MouseOut: "mouseout",
        MouseEnter: "mouseenter",
        MouseLeave: "mouseleave",
        TouchStart: "touchstart",
        TouchMove: "touchmove",
        TouchEnd: "touchend",
        HideBar: "hideBar",
        ShowBar: "showBar",
        ReadyState: "readyState",
        SourceLoaded: "sourceloaded",
        QualityChange: "qualitychange",
        Play_Btn_Hide: "play_btn_hide",
        Cover_Hide: "cover_hide",
        Cover_Show: "cover_show",
        SeekStart: "seekStart",
        EndStart: "endStart",
        UpdateProgressBar: "updateProgressBar",
        LifeCycleChanged: "lifeCycleChanged",
        Dispose: "dispose",
        Created: "created",
        Snapshot_Hide: "snapshot_hide",
        AutoStreamShow: "auto_stream_show",
        AutoStreamHide: "auto_stream_hide",
        VolumnChanged: "volumnchanged",
        LiveShiftQueryCompleted: "liveShiftQueryCompleted",
        StreamSelectorHide: "streamSelectorHide",
        SpeedSelectorHide: "speedSelectorHide",
        SettingShow: "settingShow",
        SettingHide: "settingHide",
        SelectorShow: "selectorShow",
        SelectorHide: "selectorHide",
        SettingListShow: "settingListShow",
        SettingListHide: "settingListHide",
        ThumbnailHide: "thumbnailHide",
        ThumbnailShow: "thumbnailShow",
        ThumbnailLoaded: "thumbnailLoaded",
        TooltipShow: "tooltipShow",
        TooltipHide: "tooltipHide",
        SelectorUpdateList: "selectorUpdateList",
        SelectorValueChange: "selectorValueChange",
        VolumeVisibilityChange: "volumeVisibilityChange",
        ChangeURL: "changeURL",
        UpdateToSettingList: "updateToSettingList",
        CCChanged: "CCChanged",
        CCStateChanged: "CCStateChanged",
        PlayClick: "click",
        ProgressMarkerLoaded: "progressMarkerLoaded",
        MarkerTextShow: "markerTextShow",
        MarkerTextHide: "markerTextHide",
        PREPARE: "prepare",
        ProgressMarkerChanged: "progressMarkerChanged"
      }
    };
  }, {}],
  245: [function(e, t, r) {
    e("../../event/eventtype");
    var i = e("../../../../lib/dom"), n = e("../../../../lib/ua");
    t.exports.handle = function() {
      n.IS_IOS || i.removeClass(this.el(), "prism-fullscreen");
    };
  }, { "../../../../lib/dom": 219, "../../../../lib/ua": 232, "../../event/eventtype": 244 }],
  246: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      var t = this;
      t.trigger(i.Player.CompleteSeek, e.paramData.toTime), t.one(i.Player.CanPlay, function() {
        t._enteredProgressMarker && t.pause();
      });
    };
  }, { "../../event/eventtype": 244 }],
  247: [function(e, t, r) {
    var i = e("../../event/eventtype"),
      n = (e("../../../../lib/constants"), e("../../../../lang/index"), e("../../../../monitor/util"));
    t.exports.handle = function(e) {
      var t = this, e = e.paramData;
      t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Cover_Hide), t.trigger(i.Private.Play_Btn_Hide), t.trigger(i.Private.SettingListHide), t.trigger(i.Private.SelectorHide), t.trigger(i.Private.VolumeVisibilityChange, ""), e = e || {}, t._monitor && (e.uuid = n.getUuid(), e.requestId = t._serverRequestId, e.cdnIp = t._monitor._userNetInfo.cdnIp, e.localIp = t._monitor._userNetInfo.localIp), t._isError = !0, t.trigger(i.Private.Error_Show, e), t.trigger(i.Private.LifeCycleChanged, {
        type: i.Player.Error,
        data: e
      });
    };
  }, {
    "../../../../lang/index": 212,
    "../../../../lib/constants": 216,
    "../../../../monitor/util": 240,
    "../../event/eventtype": 244
  }],
  248: [function(e, t, r) {
    var i = e("../../event/eventtype"), o = e("../../../../lib/event"), a = e("./lifecyclecommon"), n = {
        endStart: e("./endstart"),
        seekStart: e("./seekstart"),
        requestFullScreen: e("./requestfullscreen"),
        cancelFullScreen: e("./cancelfullscreen"),
        error: e("./error")
      },
      s = [i.Private.EndStart, i.Private.SeekStart, i.Player.RequestFullScreen, i.Player.CancelFullScreen, i.Player.Error, i.Player.Ready, i.Private.Dispose, i.Private.Created];
    t.exports.bind = function(e) {
      e.el();
      for (var t = 0; t < s.length; t++) {
        var r = s[t];
        "undefined" != n[r] && function(r, i, n) {
          var e = r.el();
          o.on(e, i, function(e) {
            var t = (n && n.handle ? n : a).handle;
            t.call(r, e, i);
          });
        }(e, r, n[r]);
      }
    };
  }, {
    "../../../../lib/event": 220,
    "../../event/eventtype": 244,
    "./cancelfullscreen": 245,
    "./endstart": 246,
    "./error": 247,
    "./lifecyclecommon": 249,
    "./requestfullscreen": 250,
    "./seekstart": 251
  }],
  249: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e, t) {
      this.trigger(i.Private.LifeCycleChanged, { type: t, data: e });
    };
  }, { "../../event/eventtype": 244 }],
  250: [function(e, t, r) {
    e("../../event/eventtype");
    var i = e("../../../../lib/dom"), n = e("../../../../lib/ua");
    t.exports.handle = function() {
      n.IS_IOS || i.addClass(this.el(), "prism-fullscreen");
    };
  }, { "../../../../lib/dom": 219, "../../../../lib/ua": 232, "../../event/eventtype": 244 }],
  251: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      this._seeking = !0, this.trigger(i.Player.StartSeek, e.paramData.fromTime);
    };
  }, { "../../event/eventtype": 244 }],
  252: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      var t = this;
      t._retrySwitchUrlCount = 0, t._liveRetryCount = 0, t._clearLiveErrorHandle();
      var r = (new Date).getTime() - t.readyTime;
      t._options.autoplay || t._options._autoplay || !t.paused() || (t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Play_Btn_Show)), t.trigger(i.Player.CanPlay, { loadtime: r });
    };
  }, { "../../event/eventtype": 244 }],
  253: [function(e, t, r) {
    var i = e("../../event/eventtype"), n = e("../../../../lib/dom"), o = e("../../../../lib/ua");
    t.exports.handle = function(e) {
      this._seeking = !1;
      var t = this.tag;
      "none" === t.style.display && o.IS_IOS && setTimeout(function() {
        n.css(t, "display", "block");
      }, 100), this.trigger(i.Video.CanPlayThrough);
    };
  }, { "../../../../lib/dom": 219, "../../../../lib/ua": 232, "../../event/eventtype": 244 }],
  254: [function(e, t, r) {
    t.exports.handle = function(e, t) {
      var r = "";
      e && e.paramData && (r = e.paramData), this.trigger(t, r);
    };
  }, {}],
  255: [function(e, t, r) {
    var i = e("../../event/eventtype");
    e("../../../../lang/index");
    t.exports.handle = function(e) {
      var t = this;
      t.waiting = !1, t._ended = !0, t._monitor && t._monitor._onPlayerInit(), t._options.rePlay ? (t.seek(0), t.tag.play()) : t._options.isLive && t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Play_Btn_Show), t.trigger(i.Player.Ended);
    };
  }, { "../../../../lang/index": 212, "../../event/eventtype": 244 }],
  256: [function(e, t, r) {
    var s = e("../../event/eventtype"),
      l = (e("../../../../lib/ua"), e("../../../../lib/playerutil"), e("../../../../lib/constants")),
      u = e("../../../../lang/index");
    t.exports.handle = function(e) {
      var t = this;
      if (t.waiting = !1, t._clearTimeout(), t.checkOnline()) {
        var r, i = "", n = e.target || e.srcElement, o = n.error.message, i = "";
        if (n.error.code && (r = n.error.code, i = l.VideoErrorCode[n.error.code], o = r + " || " + o), t._options.isLive) t._options.liveRetry > t._liveRetryCount ? t._reloadAndPlayForM3u8() : (t._liveRetryCount = 0, t.trigger(s.Player.LiveStreamStop), t._liveErrorHandle = setTimeout(function() {
          var e = {
            mediaId: "ISLIVE",
            error_code: i,
            error_msg: u.get("Error_Play_Text") + "\uff0c" + u.get("Error_Retry_Text")
          };
          t.logError(e), t.trigger("error", e);
        })); else if (!t._reloadForVod()) {
          var a = u.get("Error_Play_Text"), e = !1;
          if (r < 4) {
            if (3 == r && t._firstDecodeError) {
              n = t.getCurrentTime() + 1;
              return t._loadByUrlInner(t._options.source, n, !0), void (t._firstDecodeError = !1);
            }
            a = l.VideoErrorCodeText[r];
          } else t._eventState == l.SUSPEND ? (a = u.get("Error_Load_Abort_Text"), i = l.ErrorCode.RequestDataError) : t._eventState == l.LOAD_START ? (a = u.get("Error_Network_Text"), 0 < t._options.source.indexOf("auth_key") && (a = a + "\uff0c" + u.get("Error_AuthKey_Text")), i = l.ErrorCode.StartLoadData) : t._eventState == l.LOADED_METADATA && (a = u.get("Error_Play_Text"), i = l.ErrorCode.PlayingError);
          a = a + "\uff0c" + u.get("Error_Retry_Text"), 1 < t._urls.length && t._retrySwitchUrlCount < 3 && -1 == t._options.source.indexOf(".mpd") && (t.switchUrl(), e = !0);
          o = { mediaId: t._options.vid || "", error_code: i, error_msg: o };
          e || (t.logError(o), o.display_msg = a, t.trigger(s.Player.Error, o));
        }
      }
    };
  }, {
    "../../../../lang/index": 212,
    "../../../../lib/constants": 216,
    "../../../../lib/playerutil": 230,
    "../../../../lib/ua": 232,
    "../../event/eventtype": 244
  }],
  257: [function(e, t, r) {
    var n = e("../../../../lib/event"), o = e("../../event/eventtype"), i = {
      canplay: e("./canplay"),
      canplaythrough: e("./canplaythrough"),
      common: e("./common"),
      ended: e("./ended"),
      error: e("./error"),
      pause: e("./pause"),
      play: e("./play"),
      playing: e("./playing"),
      waiting: e("./waiting"),
      timeupdate: e("./timeupdate"),
      manualended: e("./ended")
    };
    t.exports.bind = function(e) {
      e.tag;
      for (var t in o.Video) {
        var r = o.Video[t];
        (function(t, r, i) {
          var e = t.tag;
          n.on(e, r, function(e) {
            i.handle.call(t, e, r), r != o.Video.Error && (r == o.Video.ManualEnded && (r = o.Video.Ended), t.trigger(o.Private.LifeCycleChanged, {
              type: r,
              data: e
            }));
          });
        })(e, r, void 0 !== i[r] ? i[r] : i.common);
      }
    };
  }, {
    "../../../../lib/event": 220,
    "../../event/eventtype": 244,
    "./canplay": 252,
    "./canplaythrough": 253,
    "./common": 254,
    "./ended": 255,
    "./error": 256,
    "./pause": 258,
    "./play": 259,
    "./playing": 260,
    "./timeupdate": 261,
    "./waiting": 262
  }],
  258: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      this._clearTimeout(), this.trigger(i.Private.AutoStreamHide), this.trigger(i.Player.Pause), this._isManualPause && (this.trigger(i.Private.Play_Btn_Show), this.trigger(i.Private.H5_Loading_Hide)), this.waiting = !1;
    };
  }, { "../../event/eventtype": 244 }],
  259: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      this.trigger(i.Private.Error_Hide), this.trigger(i.Private.Cover_Hide), this.trigger(i.Private.AutoStreamHide), this.waiting = !1, this.trigger(i.Player.Play);
    };
  }, { "../../event/eventtype": 244 }],
  260: [function(e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function(e) {
      var t = this;
      t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Cover_Hide), t.trigger(i.Private.Info_Hide), t.waiting = !1, t._ended = !1, t._liveRetryCount = 0, t._vodRetryCount = 0, t._seeking = !1, t._firstDecodeError = !0;
      var r = t.getCurrentTime();
      t._waitingReloadTime != r && (t._waitingTimeoutCount = 0), t._checkTimeoutHandle && (clearTimeout(t._checkTimeoutHandle), t._checkTimeoutHandle = null), t._waitingLoadedHandle && (clearTimeout(t._waitingLoadedHandle), t._waitingLoadedHandle = null), t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._waitingTimeoutHandle && (clearTimeout(t._waitingTimeoutHandle), t._waitingTimeoutHandle = null, t._ccService && t._options.isLive && (r = t._ccService.getCurrentSubtitle(), t._setDefaultCC = !0, r && t._ccService["switch"](r))), t.trigger(i.Private.AutoStreamHide), t.trigger(i.Player.Playing), t.trigger(i.Private.Play_Btn_Hide), t.trigger(i.Private.Error_Hide);
    };
  }, { "../../event/eventtype": 244 }],
  261: [function(e, t, r) {
    var n = e("../../event/eventtype"), o = e("../../../../lib/ua"), a = e("../../../../lib/event"),
      s = e("../../plugin/status");
    t.exports.handle = function(e) {
      var t = this;
      t.trigger(n.Player.TimeUpdate, e.timeStamp);
      var r = t.getCurrentTime();
      t.waiting && !t._TimeUpdateStamp && (t._TimeUpdateStamp = r), 0 != t.waiting && t._TimeUpdateStamp == r || (t.trigger(n.Private.H5_Loading_Hide), t.trigger(n.Private.AutoStreamHide), t._checkTimeoutHandle && clearTimeout(t._checkTimeoutHandle), t._waitingTimeoutHandle && clearTimeout(t._waitingTimeoutHandle), t._waitingLoadedHandle && clearTimeout(t._waitingLoadedHandle), t.waiting = !1), t._TimeUpdateStamp = r, t._options.isLive || (i = !1, (i = (e = t.getDuration()) < r && !t.paused() || e - r < .2 && 0 <= o.browser.version.indexOf("49.") && !t.paused() || t.exceedPreviewTime(r) ? !0 : i) && !t._ended && (t.pause(), a.trigger(t.tag, n.Video.ManualEnded)));
      var i, r = t._player.tag;
      t._options.isLive && r && (t._player.resolution && 0 < r.videoWidth && 0 < r.videoHeight && (0 < t._player.resolution.width || 0 < t._player.resolution.height) && (t._player.resolution.width !== r.videoWidth || t._player.resolution.height !== r.videoHeight) && (i = {
        oldResolution: {
          width: t._player.resolution.width,
          height: t._player.resolution.height
        }, newResolution: { width: r.videoWidth, height: r.videoHeight }
      }, t.trigger(n.Player.ResolutionChange, i)), t._player.resolution.width = 0 == r.videoWidth ? t._player.resolution.width : r.videoWidth, t._player.resolution.height = 0 == r.videoHeight ? t._player.resolution.height : r.videoHeight), t._playingSlientPause && (clearTimeout(t._playingSlientPause), t._playingSlientPause = null), t._playingSlientPause = setTimeout(function() {
        var e;
        t._status == s.playing && (e = t.getCurrentTime(), e = t._options.isLive ? 0 : e, t._loadByUrlInner(t._options.source, e, !0));
      }, 2e3);
    };
  }, {
    "../../../../lib/event": 220,
    "../../../../lib/ua": 232,
    "../../event/eventtype": 244,
    "../../plugin/status": 267
  }],
  262: [function(e, t, r) {
    var o = e("../../event/eventtype"), a = e("../../../../lib/constants"), s = e("../../../../lib/event"),
      l = e("../../../../lang/index");
    e("../../../../lib/ua");
    t.exports.handle = function(e) {
      var t = this;
      if (!t._options.isLive) {
        var r = this.getCurrentTime(), i = this.getDuration();
        if (0 < i && (i - r < .5 || i < r)) return t.pause(), t._ended = !0, void s.trigger(this.tag, o.Video.ManualEnded);
      }
      t.waiting = !0;

      function n() {
        t._checkTimeoutHandle && (clearTimeout(t._checkTimeoutHandle), t._checkTimeoutHandle = null), t._waitingTimeoutHandle && (clearTimeout(t._waitingTimeoutHandle), t._waitingTimeoutHandle = null), t._waitingLoadedHandle && (clearTimeout(t._waitingLoadedHandle), t._waitingLoadedHandle = null), t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null);
      }

      n(), t._waitingDelayLoadingShowHandle = setTimeout(function() {
        t.trigger(o.Private.H5_Loading_Show);
      }, 1e3 * t._options.delayLoadingShow), t._TimeUpdateStamp = null, t._checkTimeoutHandle = setTimeout(function() {
        t.trigger(o.Private.AutoStreamShow);
      }, 1e3 * t._options.loadDataTimeout), t.trigger(o.Player.Waiting), t._waitingTimeoutHandle = setTimeout(function() {
        var e;
        t.tag && t._options && (t.pause(), e = {
          mediaId: t._options.vid || "",
          error_code: a.ErrorCode.LoadingTimeout,
          error_msg: l.get("Error_Waiting_Timeout_Text")
        }, t.logError(e), t.trigger("error", e));
      }, 1e3 * t._options.waitingTimeout), t._waitingLoadedHandle = setTimeout(function() {
        var e = t.getCurrentTime();
        0 == t._waitingTimeoutCount && e != t._waitingReloadTime && (t._waitingTimeoutCount = 1, t._waitingReloadTime = e, e = t._options.isLive ? 0 : e, t._loadByUrlInner(t._options.source, e, !0));
      }, t._options.waitingTimeout / 2 * 1e3), t.on("error", function() {
        n();
      });
    };
  }, {
    "../../../../lang/index": 212,
    "../../../../lib/constants": 216,
    "../../../../lib/event": 220,
    "../../../../lib/ua": 232,
    "../../event/eventtype": 244
  }],
  263: [function(e, t, r) {
    var n = e("../../ui/component"), o = e("../../lib/object"), a = e("../../lib/dom"), s = e("../../lib/event"),
      l = (e("../../lib/io"), e("../../ui/exports")), u = e("../../monitor/monitor"), c = e("../../lib/ua"),
      h = e("../../lib/constants"), d = e("../../lib/util"), f = (e("../../config"), e("../../lib/playerutil")),
      p = e("./x5play"), y = e("../../lib/cookie"), g = e("../../lang/index"), m = e("../../feature/autoPlayDelay"),
      b = e("./event/eventmanager"), _ = e("../../ui/component/cover"), v = e("../../ui/component/play-animation"),
      w = e("../../commonui/autostreamselector"), S = e("./event/eventtype"), E = e("./plugin/lifecyclemanager"),
      T = e("../service/export"), x = e("../../ui/component/progressmarker"), M = e("../../feature/keyboardControl"),
      e = n.extend({
        init: function(e, t) {
          var r, i;
          this.tag = e, this.loaded = !1, this.played = !1, this.waiting = !1, this._urls = [], this._currentPlayIndex = 0, this._retrySwitchUrlCount = 0, this._isError = !1, this._isHls = !1, this._liveRetryCount = 0, this._vodRetryCount = 0, this._seeking = !1, this._serverRequestId = 0, this._waitingTimeoutCount = 0, this._waitingReloadTime = 0, this._created = !1, this._firstDecodeError = !0, this._enteredProgressMarker = !1, this._liveShiftSeekStartTime = 0, this._duration = 0, this.isMutiLevel = !1, this.__disposed = !1, this.resolution = {
            width: 0,
            height: 0
          }, void 0 === t.skinLayout && (t.skinLayout = f.defaultH5Layout), c.wechat() && c.IS_ANDROID && (t.autoplay = !1), n.call(this, this, t), this.addClass("prism-player"), t.plugins && o.each(t.plugins, function(e, t) {
            this[e](t);
          }, this), this._createService(), this.UI = {}, t.useNativeControls ? this.tag.setAttribute("controls", "controls") : (this.UI = l, 0 == t.errorDisplay && (this.UI.errorDisplay = void 0)), this.initChildren(), this._options.trackLog && (this._monitor = new u(this, {
            video_id: 0,
            album_id: 0,
            from: this._options.from,
            source: this._options.source,
            logBatched: this._options.logBatched
          }, this._options.trackLog)), b.onAll(this), this._lifeCycleManager = new E(this), this._overrideNativePlay(), !this._liveshiftService || this._liveshiftService.validate() ? (!this._options.extraInfo || (i = this._options.extraInfo).liveRetry && (this._options.liveRetry = i.liveRetry), this.on(S.Private.ReadyState, function() {
            this.trigger(S.Player.Ready);
          }), this._thumbnailService && this._options.thumbnailUrl && this._thumbnailService.get(this._options.thumbnailUrl), 0 < this._options.progressMarkers.length && this.trigger(S.Private.ProgressMarkerLoaded, this._options.progressMarkers), this._options.source && this._options._native && this._executeReadyCallback(), this._options.autoplay || this._options.preload ? this.trigger(S.Private.H5_Loading_Show) : this.trigger(S.Private.Play_Btn_Show), this._extraMultiSources(), this._options.source && (this.trigger(S.Private.PREPARE, "custom"), this._options.autoPlayDelay ? (this._autoPlayDelay = new m(this), (r = this)._autoPlayDelay.handle(function() {
            r.initPlay();
          })) : this.initPlay()), M.init.call(this)) : (i = {
            mediaId: this._options.vid || "",
            error_code: h.ErrorCode.InvalidParameter,
            error_msg: g.get("ShiftLiveTime_Error")
          }, this.trigger(S.Player.Error, i));
        }
      });
    e.prototype.isSupportMSE = function() {
      return f.isSupportMSE();
    }, e.prototype.initPlay = function(e) {
      this._initPlayBehavior(e, this._options.source);
    }, e.prototype.initChildren = function() {
      var e = this.options(), t = e.skinLayout;
      if (!1 !== t && !o.isArray(t)) throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
      !1 !== t && 0 !== t.length && (this.options({ children: t }), n.prototype.initChildren.call(this)), this.UI.cover = _, e.className = "", this.addChild("cover", e), this.UI.playanimation = v, this.addChild("playanimation", e), this.UI.autoStreamSelector = w, this.addChild("autoStreamSelector", e), this.UI.progressMarker = x, this.addChild("progressMarker", e), this.trigger(S.Private.UiH5Ready);
    }, e.prototype.createEl = function() {
      var e = !1;
      "VIDEO" !== this.tag.tagName ? (this._el = this.tag, this.tag = n.prototype.createEl.call(this, "video"), this._options.playsinline && (this.tag.setAttribute("webkit-playsinline", ""), this.tag.setAttribute("playsinline", ""), this.tag.setAttribute("x-webkit-airplay", ""), this.tag.setAttribute("x5-playsinline", ""))) : (e = !0, this._el = this.tag.parentNode);
      var t = this._el, r = this.tag;
      this._options.enableSystemMenu || (r.addEventListener ? r.addEventListener("contextmenu", function(e) {
        e.preventDefault();
      }, !1) : r.attachEvent("oncontextmenu", function() {
        window.event.returnValue = !1;
      })), r.player = this;
      var i = a.getElementAttributes(r);
      return o.each(i, function(e) {
        t.setAttribute(e, i[e]);
      }), this.setVideoAttrs(), e || (r.parentNode && r.parentNode.insertBefore(t, r), a.insertFirst(r, t)), t;
    }, e.prototype.setVideoAttrs = function() {
      var e = this._options.preload, t = this._options.autoplay;
      if (this.tag.style.width = this._options.videoWidth || "100%", this.tag.style.height = this._options.videoHeight || "100%", e && this.tag.setAttribute("preload", "preload"), t && !this._isEnabledAILabel() && this.tag.setAttribute("autoplay", "autoplay"), c.IS_IOS && this.tag.setAttribute("poster", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAMZJREFUeAHt0DEBAAAAwqD1T20LL4hAYcCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMDAc2CcpAABaODCqQAAAABJRU5ErkJggg=="), this._options.extraInfo) for (var r in this._options.extraInfo) this.tag.setAttribute(r, this._options.extraInfo[r]);
      p.adaptX5Play(this);
    }, e.prototype.checkOnline = function() {
      if (!this._options || this._options.debug) return !0;
      if (0 != navigator.onLine) return !0;
      var e = {
        mediaId: this._options.vid || "",
        error_code: h.ErrorCode.NetworkUnavaiable,
        error_msg: g.get("Error_Offline_Text")
      };
      return e.display_msg = g.get("Error_Offline_Text"), this.trigger(S.Player.Error, e), !1;
    }, e.prototype.id = function() {
      return this.el().id;
    }, e.prototype.renderUI = function() {
    }, e.prototype.switchUrl = function() {
      var e, t;
      0 != this._urls.length && (this._currentPlayIndex = this._currentPlayIndex + 1, this._urls.length <= this._currentPlayIndex && (this._currentPlayIndex = 0, this._retrySwitchUrlCount++), e = this._urls[this._currentPlayIndex], y.set(h.SelectedStreamLevel, e.definition, 365), this.trigger(S.Private.QualityChange, g.get("Quality_Change_Fail_Switch_Text")), t = this.getCurrentTime(), this._vodRetryCount = 0, this._originalSource = "", this._loadByUrlInner(e.Url, t, !0));
    }, e.prototype.setControls = function() {
      var e = this.options();
      e.useNativeControls ? this.tag.setAttribute("controls", "controls") : "object" == typeof e.controls && (e = this._initControlBar(e.controls), this.addChild(e));
    }, e.prototype._initControlBar = function(e) {
      return new ControlBar(this, e);
    }, e.prototype.getMetaData = function() {
      var t = this, r = this.tag;
      t._readyStateTimer && clearInterval(t._readyStateTimer), t._readyStateTimer = window.setInterval(function(e) {
        t.tag ? r && 0 < r.readyState && (t._duration = r.duration < 1 ? 0 : r.duration, t.trigger(S.Private.ReadyState), clearInterval(t._readyStateTimer)) : clearInterval(t._readyStateTimer);
      }, 100);
    }, e.prototype.getReadyTime = function() {
      return this.readyTime;
    }, e.prototype.readyState = function() {
      return this.tag.readyState;
    }, e.prototype.getError = function() {
      return this.tag.error;
    }, e.prototype.getRecentOccuredEvent = function() {
      return this._eventState;
    }, e.prototype.getSourceUrl = function() {
      return this._options ? this._options.source : "";
    }, e.prototype.getMonitorInfo = function() {
      return this._monitor ? this._monitor.opt : {};
    }, e.prototype.getCurrentQuality = function() {
      if (0 < this._urls.length) {
        var e = this._urls[this._currentPlayIndex];
        return { width: e.width, url: e.Url, definition: e.definition };
      }
      return "";
    }, e.prototype.getCurrentPDT = function() {
      if ((c.IS_SAFARI || c.IS_IOS) && this.tag) {
        var e = Date.parse(this.tag.getStartDate());
        return isNaN(e) ? 0 : e + 1e3 * this.getCurrentTime();
      }
    }, e.prototype.setSpeed = function(e) {
      this.tag && (this._originalPlaybackRate = e, this.tag.playbackRate = e);
    }, e.prototype.play = function(e) {
      return this.tag && (this.tag.ended || this._ended ? this.replay() : ((this._options.preload || this.loaded) && this.tag.src || this._initLoad(this._options.source), this.trigger(S.Private.Cover_Hide), this.tag.play())), this._isManualPlay = e || !1, this;
    }, e.prototype.replay = function() {
      return this._monitor && this._monitor.replay(), this.seek(0), this.tag.play(), this;
    }, e.prototype.pause = function(e) {
      return this.tag && this.tag.pause(), this._isManualPause = e || !1, this;
    }, e.prototype.stop = function() {
      return this.tag.setAttribute("src", null), this;
    }, e.prototype.paused = function() {
      if (this.tag) return !1 !== this.tag.paused;
    }, e.prototype.getDuration = function() {
      var e = 0;
      return e = this.tag ? this.isPreview() ? this._vodDuration || this.tag.duration : this._duration && this._duration != 1 / 0 ? this._duration : this.tag.duration : e;
    }, e.prototype.getDisplayDuration = function() {
      var e = 0;
      return e = this.tag ? this._vodDuration || this.getDuration() : e;
    }, e.prototype.getCurrentTime = function() {
      return this.tag ? this.tag.currentTime : 0;
    }, e.prototype.seek = function(e) {
      this._seeking = !0, e === this.tag.duration && e--;
      var t = this._originalPlaybackRate || this.tag.playbackRate;
      try {
        var r = this;
        this.tag.currentTime = e, setTimeout(function() {
          r.tag && (r.tag.playbackRate = t);
        });
      } catch (e) {
        console.log(e);
      }
      return this;
    }, e.prototype.firstNewUrlloadByUrl = function(e, t) {
      this._clearTimeout(), this._options.vid = 0, this._options.source = e, this._monitor && this._monitor.updateVideoInfo({
        video_id: 0,
        album_id: 0,
        source: e,
        from: this._options.from
      }), this.trigger(S.Private.ChangeURL), this.initPlay(), this._options.autoplay && this.trigger(S.Private.Cover_Hide), this._options.autoplay ? this.trigger(S.Player.Play) : this.trigger(S.Player.Pause), !(t = t || 0) && 0 != t || isNaN(t) || this.seek(t);
    }, e.prototype._loadByUrlInner = function(e, t, r) {
      this.loadByUrl(e, t, r, !0);
    }, e.prototype.loadByUrl = function(e, t, r, i) {
      this._urls = [], this._monitor && !i && this._monitor.reset(), this._isError = !1, this._duration = 0, this._clearTimeout(), this.trigger(S.Private.Error_Hide), this._options.source = e, this._monitor && this._monitor.updateVideoInfo({
        video_id: 0,
        album_id: 0,
        source: e,
        from: this._options.from
      }), i || (this.trigger(S.Private.ChangeURL), this._vodRetryCount = 0), this._options._autoplay = r, this.initPlay(r), (this._options.autoplay || r) && this.trigger(S.Private.Cover_Hide), this._options.autoplay || r ? this.trigger(S.Player.Play) : this.trigger(S.Player.Pause);
      var n = this;
      this._options.isLive || s.one(this.tag, S.Video.CanPlay, function(e) {
        !t && 0 != t || isNaN(t) || n.seek(t);
      });
    }, e.prototype.dispose = function() {
      this.__disposed = !0, this.trigger(S.Private.Dispose), this.tag.pause(), b.offAll(this), M.dispose.call(this), this._monitor && (this._monitor.removeEvent(), this._monitor = null), this._autoPlayDelay && this._autoPlayDelay.dispose(), this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null), this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle), this._waitingTimeoutHandle = null), this._playingSlientPause && (clearTimeout(this._playingSlientPause), this._playingSlientPause = null), this._waitingLoadedHandle && (clearTimeout(this._waitingLoadedHandle), this._waitingLoadedHandle = null), this._readyStateTimer && (clearInterval(this._readyStateTimer), this._readyStateTimer = null), this._vodRetryCountHandle && (clearTimeout(this._vodRetryCountHandle), this._vodRetryCountHandle = null), this._waitingDelayLoadingShowHandle && (clearTimeout(this._waitingDelayLoadingShowHandle), this._waitingDelayLoadingShowHandle = null), this._disposeService(), this._clearLiveErrorHandle(), this._el.innerHTML = "", this.destroy(), this.tag = null, this._options.recreatePlayer = null, this._options = null, this.isMutiLevel = !1;
    }, e.prototype.mute = function() {
      this._muteInner(), this._originalVolumn = this.tag.volume;
      var e = g.get("Volume_Mute");
      return this._player.trigger(S.Private.Info_Show, {
        text: e,
        duration: 1e3,
        align: "lb"
      }), this._setInnerVolume(0), this;
    }, e.prototype._muteInner = function() {
      this.tag.muted = !0, this.trigger(S.Private.VolumnChanged, -1);
    }, e.prototype.unMute = function() {
      this._unMuteInner();
      var e = g.get("Volume_UnMute");
      return this._player.trigger(S.Private.Info_Show, {
        text: e,
        duration: 1e3,
        align: "lb"
      }), this._setInnerVolume(this._originalVolumn || .5), this;
    }, e.prototype._unMuteInner = function() {
      this.tag.muted = !1, this.trigger(S.Private.VolumnChanged, -2);
    }, e.prototype.muted = function() {
      return this.tag.muted;
    }, e.prototype.getVolume = function() {
      return this.tag.volume;
    }, e.prototype.getOptions = function() {
      return this._options;
    }, e.prototype.setVolume = function(e, t) {
      0 != e ? this._unMuteInner() : 0 == e && this._muteInner(), this._setInnerVolume(e);
      e = g.get("Curent_Volume") + "<span>" + (100 * e).toFixed() + "%</span>";
      this._player.trigger(S.Private.Info_Show, { text: e, duration: 1e3, align: "lb" });
    }, e.prototype._setInnerVolume = function(e) {
      this.tag.volume = e, this.trigger(S.Private.VolumnChanged, e);
    }, e.prototype.hideProgress = function() {
      this.trigger(S.Private.HideProgress);
    }, e.prototype.cancelHideProgress = function() {
      this.trigger(S.Private.CancelHideProgress);
    }, e.prototype.setPlayerSize = function(e, t) {
      this._el && (this._el.style.width = e, this._el.style.height = t);
    }, e.prototype.getBuffered = function() {
      return this.tag.buffered;
    }, e.prototype.setRotate = function(e) {
      this.tag && (this._rotate = e, this._setTransform(), this.log("ROTATE", { rotation: e }));
    }, e.prototype.getRotate = function(e) {
      return void 0 === this._rotate ? 0 : this._rotate;
    }, e.prototype.setImage = function(e) {
      this.tag && (this._image = e, this._setTransform(), this.log("IMAGE", {
        mirror: "horizon" == e ? 2 : 1,
        text: e
      }));
    }, e.prototype.getImage = function() {
      return this._image;
    }, e.prototype.cancelImage = function() {
      this.tag && (this._image = "", this._setTransform(), this.log("IMAGE", { mirror: 0 }));
    }, e.prototype.setCover = function(e) {
      var t = document.querySelector("#" + this.id() + " .prism-cover");
      t && e && (t.style.backgroundImage = "url(" + e + ")", this._options.cover = e, this.trigger(S.Private.Cover_Show));
    }, e.prototype._setTransform = function() {
      this._transformProp || (this._transformProp = a.getTransformName(this.tag));
      var e = " translate(-50%, -50%)";
      this._rotate && (e += " rotate(" + this._rotate + "deg)"), this._image && ("vertical" == this._image ? e += " scaleY(-1)" : "horizon" == this._image && (e += " scaleX(-1)")), this.tag.style[this._transformProp] = e;
    }, e.prototype._startPlay = function() {
      this.tag.paused && this.tag.play();
    }, e.prototype._initPlayBehavior = function(e, t) {
      if (this._checkSupportVideoType()) return !1;
      if (f.validateSource(t)) return void 0 === e && (e = !1), this._created || (this._created = !0, this.trigger(S.Private.Created)), this.loaded || this.trigger(S.Player.Init), this._options.autoplay || this._options._autoplay || this._options.preload || e ? (this._options._preload = !0, this._initLoad(t), (this._options.autoplay || this._options._autoplay) && this._startPlay()) : this.trigger(S.Private.Play_Btn_Show), !0;
      t = { mediaId: this._options.vid || "", error_code: h.ErrorCode.InvalidSourceURL, error_msg: "InvalidSourceURL" };
      return t.display_msg = g.get("Error_Invalidate_Source"), this.trigger(S.Player.Error, t), !1;
    }, e.prototype._isPreload = function() {
      return this._options.autoplay || this._options.preload || this._options._preload;
    }, e.prototype._initLoad = function(e) {
      this.getMetaData(), e && (this._isPreload() && !c.IS_MOBILE ? this.trigger(S.Private.H5_Loading_Show) : (this.trigger(S.Private.H5_Loading_Hide), this.trigger(S.Private.Play_Btn_Show)), this.tag.setAttribute("src", e), this.loaded = !0);
    }, e.prototype._clearLiveErrorHandle = function() {
      this._liveErrorHandle && (clearTimeout(this._liveErrorHandle), this._liveErrorHandle = null);
    }, e.prototype._reloadAndPlayForM3u8 = function() {
      0 == this._liveRetryCount && this.trigger(S.Player.OnM3u8Retry);
      var e = this._options, e = e.liveRetryInterval + e.liveRetryStep * this._liveRetryCount;
      d.sleep(1e3 * e), this._liveRetryCount++, this.tag.load(this._options.source), this.tag.play();
    }, e.prototype._checkSupportVideoType = function() {
      if (!this.tag.canPlayType || !this._options.source || !c.IS_MOBILE) return "";
      var e = this._options.source, t = "";
      return 0 < e.indexOf("m3u8") ? "" != this.tag.canPlayType("application/x-mpegURL") || f.isSupportHls() || (t = g.get("Error_Not_Support_M3U8_Text")) : 0 < e.indexOf("mp4") ? "" == this.tag.canPlayType("video/mp4") && (t = g.get("Error_Not_Support_MP4_Text")) : (f.isRTMP(e) || f.isFlv(e)) && c.IS_MOBILE && (t = g.get("Error_Not_Support_Format_On_Mobile")), t && (e = {
        mediaId: this._options.vid || "",
        error_code: h.ErrorCode.FormatNotSupport,
        error_msg: t
      }, this.logError(e), e.display_msg = t, this.trigger(S.Player.Error, e)), t;
    }, e.prototype.getComponent = function(e) {
      return this._lifeCycleManager.getComponent(e);
    }, e.prototype.logError = function(e, t) {
      (e = e || {}).vt = this.getCurrentTime(), this._serverRequestId = this.log(t ? "ERRORRETRY" : "ERROR", e);
    }, e.prototype.log = function(e, t) {
      var r = 0, i = 0;
      if (this._monitor) return this._options && (r = this._options.vid || "0", i = this._options.from || "0"), this._monitor.updateVideoInfo({
        video_id: r,
        album_id: 0,
        source: this._options.source,
        from: i
      }), this._monitor._log(e, t);
    }, e.prototype.setSanpshotProperties = function(e, t, r) {
      if (this._snapshotMatric || (this._snapshotMatric = {}), this._snapshotMatric.width = e, this._snapshotMatric.height = t, 1 < r) throw new Error("rate doesn't allow more than 1");
      this._snapshotMatric.rate = r;
    }, e.prototype.getStatus = function() {
      return this._status || "init";
    }, e.prototype.enterProgressMarker = function() {
      this._enteredProgressMarker = !0;
    }, e.prototype.isInProgressMarker = function() {
      return this._enteredProgressMarker;
    }, e.prototype.exitProgressMarker = function() {
      this._enteredProgressMarker = !1;
    }, e.prototype.setProgressMarkers = function(e) {
      this.trigger(S.Private.ProgressMarkerChanged, e = e || []);
    }, e.prototype.getProgressMarkers = function() {
      return this._progressMarkerService ? this._progressMarkerService.progressMarkers : [];
    }, e.prototype.setPreviewTime = function(e) {
      this._options.playConfig || (this._options.playConfig = {}), this._options.playConfig.PreviewTime = e;
    }, e.prototype.getPreviewTime = function() {
      var e = 0;
      return e = this._options.playConfig ? this._options.playConfig.PreviewTime : e;
    }, e.prototype.exceedPreviewTime = function(e) {
      return this.isPreview() && e >= this._options.playConfig.PreviewTime;
    }, e.prototype.isPreview = function() {
      var e = this._options.playConfig.PreviewTime, t = this._vodDuration || this.tag.duration;
      return 0 < e && e < t;
    }, e.prototype._getSanpshotMatric = function() {
      return this._snapshotMatric || (this._snapshotMatric = {}), this._snapshotMatric;
    }, e.prototype._overrideNativePlay = function() {
      var r = this.tag.play, i = this;
      this.tag.play = function() {
        if (!i._options.source) {
          var e = {
            mediaId: i._options.vid || "",
            error_code: h.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return i._options.vid ? e.display_msg = g.get("Error_Vid_Empty_Source") : e.display_msg = g.get("Error_Empty_Source"), void i.trigger(S.Player.Error, e);
        }
        i.readyTime = (new Date).getTime();
        e = r.apply(i.tag);
        void 0 !== e && e.then(function() {
          i.trigger(S.Player.AutoPlay, !0);
        })["catch"](function(e) {
          !i.tag || !i.tag.paused || i._isError || i._options._autoplay || i._switchedLevel || (i.trigger(S.Private.Play_Btn_Show), i.trigger(S.Private.H5_Loading_Hide), i.trigger(S.Player.AutoPlayPrevented), i.trigger(S.Player.AutoPlay, !1), i._options.cover && i.trigger(S.Private.Cover_Show));
        });
        var t = i._originalPlaybackRate || i.tag.playbackRate;
        setTimeout(function() {
          i.tag && (i.tag.playbackRate = t);
        });
      };
    }, e.prototype._extraMultiSources = function() {
      var e = this._options.source;
      if (e && -1 < e.indexOf("{") && -1 < e.indexOf("}")) {
        var t = "";
        try {
          t = JSON.parse(e);
        } catch (e) {
          console.error(e), console.error("\u5730\u5740json\u4e32\u683c\u5f0f\u4e0d\u5bf9");
        }
        this.isMutiLevel = !0;
        var r, i = [];
        for (r in t) {
          var n = h.QualityLevels[r];
          i.push({ definition: r, Url: t[r], desc: n || r });
        }
        0 < i.length && (this._currentPlayIndex = f.findSelectedStreamLevel(i), e = i[this._currentPlayIndex], this._urls = i, this._options.source = e.Url, this.trigger(S.Private.SourceLoaded, e));
      }
    }, e.prototype._isEnabledAILabel = function() {
      return this._options.ai && this._options.ai.label;
    }, e.prototype._createService = function() {
      if (T) for (var e = T.length, t = 0; t < e; t++) {
        var r = T[t], i = r.condition;
        void 0 === i ? i = !0 : "function" == typeof i && (i = i.call(this)), i && (this[r.name] = new r.service(this));
      }
    }, e.prototype._disposeService = function() {
      if (T) for (var e = T.length, t = 0; t < e; t++) {
        var r = this[T[t].name];
        void 0 !== r && r.dispose && r.dispose();
      }
    }, e.prototype._executeReadyCallback = function() {
      try {
        this._options.autoplay || this._options.preload || (this.trigger(S.Private.H5_Loading_Hide), this.trigger(S.Private.Play_Btn_Show)), this._options.readyCallback(this);
      } catch (e) {
        console.log(e);
      }
    }, e.prototype._clearTimeout = function() {
      this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null), this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle), this._waitingTimeoutHandle = null), this._clearLiveErrorHandle();
    }, e.prototype._reloadForVod = function() {
      if (this._originalSource || (this._originalSource = this._options.source), this._vodRetryCount < this._options.vodRetry && navigator.onLine) {
        var e = this.getCurrentTime(), t = this._originalSource;
        t.indexOf("auth_key=") < 0 && (t = t && 0 < t.indexOf("?") ? t + "&_t=" + (new Date).valueOf() : t + "?_t=" + (new Date).valueOf()), this._vodRetryCountHandle && clearTimeout(this._vodRetryCountHandle);
        var r = this;
        return this._vodRetryCountHandle = setTimeout(function() {
          r._loadByUrlInner(t, e, !0);
        }, 100 * this._vodRetryCount), this._vodRetryCount = this._vodRetryCount + 1, !0;
      }
      return !1;
    }, e.prototype._checkEnoughBufferedForWaiting = function(e) {
      this.getCurrentTime(), this._options.waitingBufferedTime;
      var t = this.tag.buffered;
      for (i = 0; i < t.length; i++) t.start(i), t.end(i);
    }, t.exports = e;
  }, {
    "../../commonui/autostreamselector": 202,
    "../../config": 205,
    "../../feature/autoPlayDelay": 207,
    "../../feature/keyboardControl": 208,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/cookie": 217,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/io": 225,
    "../../lib/object": 227,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../monitor/monitor": 239,
    "../../ui/component": 296,
    "../../ui/component/cover": 300,
    "../../ui/component/play-animation": 306,
    "../../ui/component/progressmarker": 309,
    "../../ui/exports": 326,
    "../service/export": 290,
    "./event/eventmanager": 243,
    "./event/eventtype": 244,
    "./plugin/lifecyclemanager": 266,
    "./x5play": 268
  }],
  264: [function(e, t, r) {
    e = e("../../../lib/oo").extend({});
    t.exports = e;
  }, { "../../../lib/oo": 228 }],
  265: [function(e, t, r) {
    t.exports = {
      createEl: "createEl",
      created: "created",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      timeUpdate: "timeupdate",
      error: "error",
      ended: "ended",
      dispose: "dispose",
      markerDotOver: "markerDotOver",
      markerDotOut: "markerDotOut"
    };
  }, {}],
  266: [function(e, t, r) {
    var a = e("../../../lib/object"), l = e("../event/eventtype"), u = e("./lifecycle"), i = e("./status"),
      e = function(t) {
        (this._player = t)._status = "init", this.components = [];
        var e = t.getOptions().components;
        if (e && a.isArray(e) && 0 < e.length) for (var r = 0; r < e.length; r++) {
          var i = e[r];
          if (!i) return void console.log("The " + r + " custome component is " + i);
          if (constr = void 0 === i.type ? i : i.type, args = void 0 === i.args ? [] : i.args, name = void 0 === i.name ? "" : i.name, !constr) return void console.log(name + " compenent is " + constr);
          args = args && 0 < args.length ? [].concat.call([constr], args) : [];
          var n = new (Function.prototype.bind.apply(constr, args)), i = n[u.createEl];
          i && "function" == typeof i && i.call(n, t.el(), t), this.components.push({ name: name, obj: n });
        }
        var o = this;
        t.on(l.Private.LifeCycleChanged, function(e) {
          0 != o.components.length && s.call(o, t, e);
        });
      };
    e.prototype.getComponent = function(e) {
      var t = null, r = this.components.length;
      if (e) for (var i = 0; i < r; i++) if (this.components[i].name == e) {
        t = this.components[i].obj;
        break;
      }
      return t;
    };
    var s = function(e, t) {
      if (t) {
        var t = t.paramData, r = t.type, i = t.data;
        (t = r) != l.Video.LoadStart && t != l.Video.LoadedData && t != l.Video.LoadedMetadata || (r = u.loading), c(e, r);
        for (var n = this.components.length, o = 0; o < n; o++) {
          var a = this.components[o].obj, s = a[r];
          s && "function" == typeof s && s.call(a, e, i);
        }
        r == l.Private.Dispose && (this.components = []);
      }
    }, c = function(e, t) {
      void 0 !== i[t] && (t != i.pause || e._status != i.error && e._status != i.ended) && (e._status = t);
    };
    t.exports = e;
  }, { "../../../lib/object": 227, "../event/eventtype": 244, "./lifecycle": 265, "./status": 267 }],
  267: [function(e, t, r) {
    t.exports = {
      init: "init",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      error: "error",
      ended: "ended"
    };
  }, {}],
  268: [function(e, t, r) {
    function i(e, t) {
      var r = e.el().style.height, i = e.el().style.width;
      e.originalLayout = {
        container: { height: r, width: i },
        video: { width: e.tag.style.width, height: e.tag.style.height }
      };
      var n = document.body.clientHeight * (window.devicePixelRatio || 1) + "px", o = document.body.clientWidth + "px";
      width = t ? (height = n, o) : (height = r.indexOf("%") ? r : r + "px", i.indexOf("%") ? i : i + "px"), e.tag.style.width = o, e.tag.style.height = n, e.el().style.height = t ? n : height;
    }

    var n = e("../../lib/ua"), o = e("../../lib/dom");
    t.exports.isAndroidX5 = function() {
      return n.os.android && n.is_X5 || n.dingTalk();
    }, t.exports.adaptX5Play = function(r) {
      n.os.android && n.is_X5 && ("h5" == r._options.x5_type && (r.tag.setAttribute("x5-video-player-type", r._options.x5_type), window.onresize = function() {
        var e, t;
        i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), "landscape" == (e = r)._x5VideoOrientation && (e._originalTagWidth = e.tag.style.width, e._originalTagHeight = e.tag.style.height, (t = document.querySelector("#" + e.id() + " .prism-controlbar")) && parseFloat(t.offsetHeight), e.tag.style.height = "100%", e.tag.style.width = window.screen.width + "px");
      }, r.tag.addEventListener("x5videoenterfullscreen", function() {
        i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), r.trigger("x5requestFullScreen");
      }), r.tag.addEventListener("x5videoexitfullscreen", function() {
        var e, t;
        (e = r).originalLayout && (t = e.originalLayout, e.el().style.height = t.container.height, e.el().style.width = t.container.width, e.tag.style.width = t.video.width, e.tag.style.height = t.video.height), r.trigger("x5cancelFullScreen"), r.fullscreenService.getIsFullScreen() && r.fullscreenService.cancelFullScreen();
      }), r.on("requestFullScreen", function() {
        "top" == r._options.x5_video_position && o.removeClass(r.tag, "x5-top-left"), n.os.android && n.is_X5 && r._options.x5LandscapeAsFullScreen && (r.tag.setAttribute("x5-video-orientation", "landscape"), r._x5VideoOrientation = "landscape");
      }), r.on("cancelFullScreen", function() {
        "top" == r._options.x5_video_position && o.addClass(r.tag, "x5-top-left"), n.os.android && n.is_X5 && r._options.x5LandscapeAsFullScreen && (r.tag.setAttribute("x5-video-orientation", "portrait"), i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), r._x5VideoOrientation = "portrait");
      })), void 0 !== r._options.x5_fullscreen && r._options.x5_fullscreen && (r.tag.setAttribute("x5-video-player-fullscreen", r._options.x5_fullscreen), o.addClass(r.tag, "x5-full-screen")), "top" == r._options.x5_video_position && o.addClass(r.tag, "x5-top-left"), void 0 !== r._options.x5_orientation && r.tag.setAttribute("x5-video-orientation", r._options.x5_orientation));
    };
  }, { "../../lib/dom": 219, "../../lib/ua": 232 }],
  269: [function(e, t, r) {
    var u = e("../../lib/io"), c = e("../../config"), h = e("../../lib/constants"), d = e("../../lib/util"),
      f = e("../../lib/playerutil"), p = (e("../../lib/dom"), e("../../lang/index")), y = e("../base/event/eventtype"),
      g = e("../saas/drm"), m = e("../../lib/ua");
    t.exports.inject = function(e, t, r, i, o, n, a) {
      var s, l = i.source;
      !n && (n = l, e._drm || !f.isDash(n) && !f.isHls(n)) || (e._isDrm = !0, e._drm = null, e._isLoadedDrm = !1, e._isFairPlay = m.IS_MAC_SAFARI || m.IS_IOS, console.log("use FairPlay", e._isFairPlay), t.prototype._checkDrmReady = function() {
        if (null == e._drm && !e._isFairPlay) throw new Error("please invoke this method after ready event");
      }, t.prototype.play = function(e) {
        this._checkDrmReady(), this._isManualPlay = e || !1;
        return this.trigger(y.Private.Cover_Hide), this.tag.ended ? this.replay() : (this.getCurrentTime(), this.tag.paused && this.tag.play()), this;
      }, t.prototype.initPlay = function(e) {
        if (d.contentProtocolMixed(l)) {
          var t = {
            mediaId: this._options.vid || "",
            error_code: h.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = p.get("Request_Block_Text"), void this.trigger(y.Player.Error, t);
        }
        if (this._isFairPlay) return this.trigger(y.Private.H5_Loading_Show), void function(e, t) {
          this._isFairPlay && (g.loadCertificate(this), e && e(), this._executeReadyCallback());
        }.call(this, o, e);

        function r(n) {
          function t() {
            var e;
            n._drm = new shaka.Player(n.tag), s(n, n._drm), e = n._options.isLive ? "https://" + f.getLiveHostByRegion(n._options.region) : "https://vod." + n._options.region + ".aliyuncs.com", n._drm.configure({
              drm: {
                servers: {
                  "com.widevine.alpha": e,
                  "com.microsoft.playready": e
                }
              }
            }), n._drm.getNetworkingEngine().registerRequestFilter(function(t, r) {
              shaka.util.StringUtils;
              const i = shaka.util.Uint8ArrayUtils;
              if (t == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                t = i.toBase64(new Uint8Array(r.body));
                let e;
                e = n._options.isLive ? g.getRequestUrl(t, n) : g.postData(t, n), r.uris[0] = e.url, r.headers["content-type"] = "application/x-www-form-urlencoded", r.body = e.data;
              }
            }), n._drm.getNetworkingEngine().registerResponseFilter(function(e, t) {
              const r = shaka.util.StringUtils, i = shaka.util.Uint8ArrayUtils;
              e == shaka.net.NetworkingEngine.RequestType.LICENSE && (e = r.fromUTF8(t.data), e = JSON.parse(e), e = n._options.isLive ? e.Response.B64License : JSON.parse(e.License).b64License, t.data = i.fromBase64(e));
            }), n._drm.addEventListener("error", function(e) {
              console.log("errorMessage"), console.log(e.detail.code), console.log(e.detail);
            }), n._drm.load(n._options.source), o && o(n._drm), r && n._executeReadyCallback();
          }

          var r = !n._drm;
          n.destroy(function(e) {
            try {
              return void t();
            } catch (e) {
              console.log(e);
            }
          });
        }

        this._isLoadedDrm && "undefined" != typeof shaka ? r(this) : (this.trigger(y.Private.H5_Loading_Show), function(e) {
          var t = "aliplayer-drm-min.js", r = "",
            r = c.domain ? "https://" + c.domain + "/de/prismplayer/" + c.h5Version + "/drm/" + t : "/build/drm/" + t,
            i = this;
          u.loadJS(r, function() {
            shaka.polyfill.installAll(), e.apply(i);
          });
        }.call(this, function() {
          this._isLoadedDrm = !0, r(this);
        }));
      }, t.prototype.destroy = function(e) {
        var t;
        this._drm ? (t = this)._drm.destroy().then(function() {
          t._drm = null, "function" == typeof e && e(t);
        }) : "function" == typeof e && e(this);
      }, t.prototype.dispose = function() {
        r.dispose.call(this), this.destroy();
      }, t.prototype._getDRMEncryptItem = function() {
        var e = this._urls;
        if (e && 0 < e.length) {
          for (var t = e.length, r = 0; r < t; r++) {
            var i = e[r];
            if (i.Url == this._options.source && +i.encryption) return i;
          }
          return "";
        }
        return "";
      }, t.prototype._getItemBySource = function() {
        var e = this._urls;
        if (e && 0 < e.length) {
          for (var t = e.length, r = 0; r < t; r++) {
            var i = e[r];
            if (i.Url == this._options.source) return i;
          }
          return "";
        }
        return "";
      }, s = function(t, e) {
        e.addEventListener("error", function(e) {
          (function(t, r) {
            var i = "Error code:" + r.code + "message:" + r.message;
            console.log(i);
            var n = h.ErrorCode.OtherError, i = p.get("Error_Play_Text");
            r.code == shaka.util.Error.Code.EXPIRED ? (n = h.ErrorCode.AuthKeyExpired, i = p.get("DRM_License_Expired")) : r.code == shaka.util.Error.Code.HTTP_ERROR ? (n = h.ErrorCode.NetworkError, i = p.get("Http_Error")) : r.code == shaka.util.Error.Code.HTTP_ERROR ? (n = h.ErrorCode.LoadingTimeout, i = p.get("Http_Timeout")) : r.category == shaka.util.Error.NETWORK && (n = h.ErrorCode.NetworkError, i = p.get("Error_Network_Text"));
            !function() {
              var e;
              setTimeout(function() {
                t.trigger(y.Private.Play_Btn_Hide);
              }), t.checkOnline() && (e = {
                mediaId: t._options.vid || "",
                error_code: n,
                error_msg: r.message
              }, t.logError(e), e.display_msg = r.code + "|" + i, t.trigger(y.Player.Error, e));
            }();
          })(t, e.detail);
        });
      });
    };
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/dom": 219,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../base/event/eventtype": 244,
    "../saas/drm": 279
  }],
  270: [function(e, t, r) {
    var i = e("../base/player"), n = e("./drminjector"), o = i.extend({
      init: function(e, t) {
        n.inject(this, o, i.prototype, t, function(e) {
        }), t._native = !1, i.call(this, e, t);
      }
    });
    t.exports = o;
  }, { "../base/player": 263, "./drminjector": 269 }],
  271: [function(e, t, r) {
    var i = e("../../ui/component"), n = e("../../lib/data"), o = e("../../lib/ua"), a = e("../../lib/constants"),
      s = e("../../lib/dom"), l = e("../../lib/object"), u = e("../../config"), c = e("../../lang/index"),
      h = e("../../lib/playerutil"), d = e("../../lib/util"), f = e("../../ui/component/info-display"),
      p = e("../../ui/component/error-display"), y = e("../../feature/autoPlayDelay"),
      g = e("../../commonui/autostreamselector"), m = e("../base/event/eventtype"), b = e("../saas/ststoken"),
      e = i.extend({
        init: function(e, t) {
          var r;
          void 0 === t.skinLayout && (t.skinLayout = h.defaultFlashLayout), i.call(this, this, t), this._id = "prism-player-" + n.guid(), this.tag = e, this._el = this.tag, this._childrenUI = [p], this.initChildren(), this.id = this._id, window[this.id] = this, c.setCurrentLanguage(this._options.language, "flash", this._options.languageTexts), d.openInFile() ? (e = {
            mediaId: this._options.vid || "",
            error_code: a.ErrorCode.FormatNotSupport,
            error_msg: c.get("Open_Html_By_File", "flash")
          }, this.trigger(m.Private.Error_Show, e)) : o.IS_MOBILE ? this.trigger(m.Private.Error_Show, {
            mediaId: this._options.vid || "",
            error_code: a.ErrorCode.FormatNotSupport,
            error_msg: c.get("Cant_Use_Flash_On_Mobile", "flash")
          }) : (this._options.vid && this._options.accessKeyId && this._options.securityToken && this._options.accessKeySecret ? b.getPlayAuth((r = this)._options, function(e) {
            r._options.playauth = e, r._createPlayer();
          }, function(e) {
            var t = { mediaId: r._options.vid, error_code: e.Code, error_msg: e.Message };
            e.sri && (t.sri = e.sri), t.display_msg = e.display_msg, r.trigger(m.Private.Error_Show, t);
          }, "flash") : this._createPlayer(), this._status = "init");
        }, _createPlayer: function() {
          var e, t;
          this._options.autoPlayDelay ? (t = new y(this), e = this, t.handle(function() {
            e._options.autoplay = !0, e._initPlayer(), e._childrenUI = [f, g], e.initChildren();
          })) : (this._initPlayer(), this._childrenUI = [f, g], this.initChildren()), o.HAS_FLASH || (t = c.get("Flash_Not_Ready", "flash"), this.trigger(m.Private.Info_Show, {
            text: t,
            align: "tc",
            isBlack: !1
          }));
        }, _initPlayer: function() {
          var e = "//" + u.domain + "/de/prismplayer-flash/" + u.flashVersion + "/PrismPlayer.swf";
          this._options.playerSwfPath ? e = this._options.playerSwfPath : u.domain ? -1 < u.domain.indexOf("localhost") && (e = "//" + u.domain + "/build/flash//PrismPlayer.swf") : e = "de/prismplayer-flash/" + u.flashVersion + "/PrismPlayer.swf";
          var t = this._comboFlashVars(), r = this._options.wmode || "opaque";
          this.tag.innerHTML = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0\" width=\"100%\" height=\"100%\" id=\"" + this.id + "\"><param name=\"movie\" value=\"" + e + "\"><param name=\"quality\" value=\"High\"><param name=\"FlashVars\" value=\"" + t + "\"><param name=\"WMode\" value=\"" + r + "\"><param name=\"AllowScriptAccess\" value=\"always\"><param name=\"AllowFullScreen\" value=\"true\"><param name=\"AllowFullScreenInteractive\" value=\"true\"><embed name=\"" + this.id + "\" src=\"" + e + "\" quality=\"high\" pluginspage=\"//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\" width=\"100%\" height=\"100%\" AllowScriptAccess=\"always\" AllowFullScreen=\"true\" AllowFullScreenInteractive=\"true\" WMode=\"" + r + "\" FlashVars=\"" + t + "\"></embed></object>";
        }, _getPlayer: function(e) {
          return -1 != navigator.appName.indexOf("Microsoft") ? document.getElementById(e) : document[e];
        }, _getLowerQualityLevel: function() {
          var e = this._getVideoUrls();
          if (!e) return "";
          var t = e.Urls, e = e.index;
          return !(t && 0 == t.length || -1 == e) && 0 < e ? { item: t[e - 1], index: e - 1 } : "";
        }, _comboFlashVars: function() {
          var e = encodeURIComponent(o.getReferer()), t = o.getHref(), r = encodeURIComponent(t), i = "";
          t && (i = o.getHost(t));
          var t = this._options, i = {
            autoPlay: t.autoplay ? 1 : 0,
            isInner: 0,
            actRequest: 1,
            vid: t.vid,
            diagnosisButtonVisible: t.diagnosisButtonVisible ? 1 : 0,
            domain: t.domain || "//tv.taobao.com",
            statisticService: t.statisticService || u.logReportTo,
            videoInfoService: t.videoInfoService || "/player/json/getBaseVideoInfo.do",
            disablePing: t.trackLog ? 0 : 1,
            namespace: this.id,
            barMode: 0 != t.barMode ? 1 : 0,
            isLive: t.isLive ? 1 : 0,
            waterMark: t.waterMark,
            environment: t.environment,
            vurl: t.source ? encodeURIComponent(t.source) : "",
            plugins: t.plugins || "",
            snapShotShow: t.snapshot ? 1 : 0,
            accessId: t.accId || "",
            accessKey: t.accSecret || "",
            apiKey: t.apiKey || "",
            flashApiKey: t.flashApiKey || "",
            disableSeek: t.disableSeek ? 1 : 0,
            disableFullScreen: t.disableFullScreen ? 1 : 0,
            stsToken: t.stsToken || "",
            domainRegion: t.domainRegion || "",
            authInfo: t.authInfo ? encodeURIComponent(t.authInfo) : "",
            playDomain: t.playDomain || "",
            stretcherZoomType: t.stretcherZoomType || "",
            playauth: t.playauth ? t.playauth.replace(/\+/g, "%2B") : "",
            prismType: t.prismType || 0,
            formats: t.formats || "",
            notShowTips: t.notShowTips ? 1 : 0,
            showBarTime: t.showBarTime || 0,
            showBuffer: 0 == t.showBuffer ? 0 : 1,
            rePlay: t.rePlay ? 1 : 0,
            encryp: t.encryp || "",
            secret: t.secret || "",
            mediaType: "video",
            logInfo: {
              ud: o.getHost(t.source),
              os: o.os.name,
              ov: o.os.version || "",
              et: o.browser.name,
              ev: o.browser.version || "",
              uat: o.USER_AGENT,
              r: e,
              pu: r,
              app_n: i
            }
          }, n = [];
          return void 0 !== t.rtmpBufferTime && (i.rtmpBufferTime = t.rtmpBufferTime), t.cover && (i.cover = t.cover), t.extraInfo && (i.extraInfo = encodeURIComponent(JSON.stringify(t.extraInfo))), i.logInfo && (i.logInfo = encodeURIComponent(JSON.stringify(i.logInfo))), i.languageData = encodeURIComponent(JSON.stringify(c.getLanguageData("flash"))), i.language = c.getCurrentLanguage(), l.each(i, function(e, t) {
            n.push(e + "=" + t);
          }), n.join("&");
        }, initChildren: function() {
          for (var e = this._childrenUI.length, t = 0; t < e; t++) {
            var r = new this._childrenUI[t](this, this._options), i = r.el();
            i.id = r.id(), this.contentEl().appendChild(i), r.bindEvent();
          }
          var n = document.querySelector("#" + this._options.id + " .prism-info-display");
          s.css(n, "display", "none");
        }, flashReady: function() {
          this.flashPlayer = this._getPlayer(this.id), this._isReady = !0;
          var e = this._options.skinRes, t = this._options.skinLayout;
          if (!1 !== t && !l.isArray(t)) throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
          if ("string" != typeof e) throw new Error("PrismPlayer Error: skinRes should be string!");
          t = 0 != t && 0 !== t.length && {
            skinRes: e,
            skinLayout: t
          }, this.flashPlayer.setPlayerSkin(t), this.trigger("ready");
          var r = this;
          window.addEventListener("beforeunload", function() {
            try {
              r.flashPlayer.setPlayerCloseStatus();
            } catch (e) {
            }
          });
        }, jsReady: function() {
          return !0;
        }, snapshoted: function(e) {
          var t = d.toBinary(e), e = "data:image/jpeg;base64," + e;
          this.trigger("snapshoted", { time: this.getCurrentTime(), base64: e, binary: t });
        }, uiReady: function() {
          this._status = "ready", this.trigger("uiReady");
        }, loadedmetadata: function() {
          "ended" != this._status && (this._status = "loading", this.trigger("loadedmetadata"));
        }, onPlay: function() {
          this._status = "play", this.trigger("play"), this._clearTimeoutHandle(), this.trigger(m.Private.AutoStreamHide);
        }, onEnded: function() {
          this._clearTimeoutHandle(), this._status = "ended", this.trigger("ended");
        }, onPause: function() {
          this._status = "pause", this._clearTimeoutHandle(), this.trigger(m.Private.AutoStreamHide), this.trigger("pause");
        }, onBulletScreenReady: function() {
          this.trigger("bSReady");
        }, onBulletScreenMsgSend: function(e) {
          this.trigger("bSSendMsg", e);
        }, onVideoRender: function(e) {
          this._clearTimeoutHandle(), this.trigger("videoRender"), this.trigger("canplay", { loadtime: e });
        }, onVideoError: function(e) {
          this._clearTimeoutHandle(), this._status = "error", this.trigger("error", { errortype: e });
        }, onM3u8Retry: function() {
          this.trigger("m3u8Retry");
        }, hideBar: function() {
          this.trigger("hideBar");
        }, showBar: function() {
          this.trigger("showBar");
        }, liveStreamStop: function() {
          this.trigger("liveStreamStop");
        }, stsTokenExpired: function() {
          this._status = "error", this.trigger("stsTokenExpired");
        }, onVideoBuffer: function() {
          var e;
          "pause" != this._status && (this._status = "waiting", this.trigger("waiting"), this._clearTimeoutHandle(), (e = this)._checkTimeoutHandle = setTimeout(function() {
            e.trigger(m.Private.AutoStreamShow);
          }, 1e3 * this._options.loadDataTimeout), this._checkVideoStatus());
        }, startSeek: function(e) {
          this.trigger("startSeek", e);
        }, completeSeek: function(e) {
          this.trigger("completeSeek", e);
        }, _invoke: function() {
          var e = arguments[0], t = arguments;
          if (Array.prototype.shift.call(t), !this.flashPlayer) throw new Error("PrismPlayer Error: flash player is not ready\uff0cplease use api after ready event occured!");
          if ("function" != typeof this.flashPlayer[e]) throw new Error("PrismPlayer Error: function " + e + " is not found!");
          return this.flashPlayer[e].apply(this.flashPlayer, t);
        }, play: function() {
          this._invoke("playVideo");
        }, replay: function() {
          this._invoke("replayVideo");
        }, pause: function() {
          this._invoke("pauseVideo");
        }, stop: function() {
          this._invoke("stopVideo");
        }, seek: function(e) {
          this._invoke("seekVideo", e);
        }, getCurrentTime: function() {
          return this._invoke("getCurrentTime");
        }, getDuration: function() {
          return this._invoke("getDuration");
        }, getStatus: function() {
          return this._status;
        }, _getVideoUrls: function() {
          var e = this._invoke("getVideoUrls"), t = [];
          if (e && e.Urls) for (var r = 0; r < e.Urls.length; r++) {
            var i = e.Urls[r].value, n = i.desc.indexOf("_"), o = c.get(i.definition, "flash");
            i.desc = 0 < n ? o + "_" + i.height : o, t.push(i);
          }
          return { Urls: t, index: e.index };
        }, _getVideoStatus: function() {
          return this._invoke("getVideoStatus");
        }, _checkVideoStatus: function() {
          var t, r;
          this.flashPlayer && !this._checkVideoStatusHandler && (t = this, (r = function() {
            t._checkVideoStatusHandler = setTimeout(function() {
              var e = t._getVideoStatus();
              "playing" == e.videoStatus && "bufferFull" == e.bufferStatus ? (t._status = "playing", t._clearTimeoutHandle()) : "videoPlayOver" == e.videoStatus && (t._status = "ended", t._clearTimeoutHandle()), r();
            }, 500);
          })());
        }, _clearTimeoutHandle: function() {
          this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null);
        }, _changeStream: function(e) {
          return this._invoke("changeStream", e);
        }, mute: function() {
          this.setVolume(0);
        }, unMute: function() {
          this.setVolume(.5);
        }, getVolume: function() {
          return this._invoke("getVolume");
        }, setVolume: function(e) {
          this._invoke("setVolume", e);
        }, loadByVid: function(e) {
          this._invoke("loadByVid", e, !1);
        }, loadByUrl: function(e, t) {
          this._invoke("loadByUrl", e, t);
        }, dispose: function() {
          this._clearTimeoutHandle(), this._checkVideoStatusHandler && (clearTimeout(this._checkVideoStatusHandler), this._checkVideoStatusHandler = null), this._invoke("pauseVideo");
          var e = this;
          setTimeout(function() {
            e.off("completeSeek"), e.off("startSeek"), e.off("stsTokenExpired"), e.off("liveStreamStop"), e.off("showBar"), e.off("hideBar"), e.off("m3u8Retry"), e.off("error"), e.off("canplay"), e.off("pause"), e.off("ended"), e.off("play"), e.off("loadedmetadata"), e.off("snapshoted"), e.off("uiReady"), e.off("ready"), e.flashPlayer = null, e._el && (e._el.innerHTML = "");
          });
        }, showBSMsg: function(e) {
          this._invoke("showBSMsg", e);
        }, setToastEnabled: function(e) {
          this._invoke("setToastEnabled", e);
        }, setLoadingInvisible: function() {
          this._invoke("setLoadingInvisible");
        }, setPlayerSize: function(e, t) {
          this._el.style.width = e, this._el.style.height = t;
        }
      });
    t.exports = e;
  }, {
    "../../commonui/autostreamselector": 202,
    "../../config": 205,
    "../../feature/autoPlayDelay": 207,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/data": 218,
    "../../lib/dom": 219,
    "../../lib/object": 227,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../ui/component": 296,
    "../../ui/component/error-display": 301,
    "../../ui/component/info-display": 304,
    "../base/event/eventtype": 244,
    "../saas/ststoken": 284
  }],
  272: [function(e, t, r) {
    var a = e("../../lib/io"), u = e("../../config"), c = e("../../lib/constants"), h = e("../../lib/util"),
      d = e("../../lib/playerutil"), f = (e("../../lib/dom"), e("../../lib/ua")), p = e("../../lang/index"),
      y = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function(e, t, r, i, s, n) {
      var l, o = i.source;
      !n && (n = o, e._flv || !d.isFlv(n)) || (e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkFlvReady = function() {
        if (null == e._flv) throw new Error("please invoke this method after ready event");
      }, e._isFlv = !0, e._flv = null, e._isLoadedFlv = !1, e._originalUrl = "", t.prototype.play = function(e) {
        this._checkFlvReady(), this._isManualPlay = e || !1;
        return this.trigger(y.Private.Cover_Hide), this._options.isLive && e ? this._loadByUrlInner(this._options.source, 0, e) : this.tag.ended || this._ended ? this.replay() : (0 == this._seeking && (e = 0, this.tag.ended || this._ended || 0 == (e = this.getCurrentTime()) && (e = -1), -1 != e && this.seek(e)), this.tag.paused && (this._hasLoaded || (this.getMetaData(), this._flv.load()), this._flv.play())), this;
      }, t.prototype.seek = function(e) {
        this._checkFlvReady(), this._seeking = !0, e === this.tag.duration && e--;
        try {
          this._flv.currentTime = e;
        } catch (e) {
          console.log(e);
        }
        return this;
      }, t.prototype.pause = function(e) {
        return this._checkFlvReady(), this._isManualPause = e || !1, this._flv.pause(), this;
      }, t.prototype.getProgramDateTime = function() {
        if (this._checkFlvReady(), !this._metadata) return "";
        var e = this._flv.getFirstSample(), e = e && e.pts ? e.pts : 0;
        return console.log("\u63a8\u6d41\u65f6\u95f4\uff1a" + this._metadata.NtpTime), console.log("\u9996\u5e27PTS\uff1a" + e), this._metadata.NtpTime + e;
      }, t.prototype.initPlay = function(e) {
        if (f.browser.safari && this.trigger(y.Private.Snapshot_Hide), h.contentProtocolMixed(o)) {
          var t = {
            mediaId: this._options.vid || "",
            error_code: c.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = p.get("Request_Block_Text"), void this.trigger(y.Player.Error, t);
        }

        function r(t, e) {
          var r = !t._flv;
          t._destroyFlv();
          var i, n = t._options.isLive,
            o = { isLive: n, enableWorker: t._options.enableWorker, stashInitialSize: 2048 },
            a = { type: "flv", isLive: n, url: t._options.source };
          for (i in n ? (o.enableStashBuffer = t._options.enableStashBufferForFlv, stashInitialSize = t._options.stashInitialSizeForFlv, o.autoCleanupSourceBuffer = !1) : o.lazyLoadMaxDuration = 600, t._options.isLive && (t._options.flvFrameChasing && (o.flvFrameChasing = t._options.flvFrameChasing), t._options.chasingFirstParagraph && (o.chasingFirstParagraph = t._options.chasingFirstParagraph), t._options.chasingSecondParagraph && (o.chasingSecondParagraph = t._options.chasingSecondParagraph), t._options.chasingFirstSpeed && (o.chasingFirstSpeed = t._options.chasingFirstSpeed), t._options.chasingSecondSpeed && (o.chasingSecondSpeed = t._options.chasingSecondSpeed)), t._options.flvOption) "cors" == i || "hasAudio" == i || "withCredentials" == i || "hasVideo" == i || "type" == i ? a[i] = t._options.flvOption[i] : o[i] = t._options.flvOption[i];
          t._originalUrl = t._options.source, flvjs.LoggingControl.enableAll = t._options.debug, t._flv = flvjs.createPlayer(a, o), l(t, t._flv), t._flv.on(flvjs.Events.MEDIA_INFO, function(e) {
            t._metadata = e.metadata;
          }), t._flv.on(flvjs.Events.METADATA_ARRIVED, function(e) {
            e && e.dataContent && e.dataContent.length && t.trigger(y.Player.SeiFrame, e.dataContent);
          }), t._flv.attachMediaElement(t.tag), t._initPlayBehavior(e) && ((t._options.preload || t._options.autoplay) && (t._hasLoaded = !0, t._flv.load()), t._options.autoplay && !t.tag.paused && t._flv.play(), s && s(t._flv), r && (t._executeReadyCallback(), t._urls && 0 < t._urls.length && !t._options.defaultDefinition && (t._currentPlayIndex = d.findSelectedStreamLevel(t._urls), r = t._urls[t._currentPlayIndex], t._options.source = r.Url, t.trigger(y.Private.SourceLoaded, r))));
        }

        (that = this)._isLoadedFlv && "undefined" != typeof Hls ? setTimeout(function() {
          r(that, e);
        }, 1e3) : (this.trigger(y.Private.H5_Loading_Show), function(e, t) {
          var r = "aliplayer-flv-min.js", i = "",
            i = u.domain ? "https://" + u.domain + "/de/prismplayer/" + u.h5Version + "/flv/" + r : "/build/flv/" + r,
            n = this;
          a.loadJS(i, function() {
            e.apply(n);
          });
        }.call(that, function() {
          this._isLoadedFlv = !0, r(this, e);
        }, this._options.debug));
      }, t.prototype._destroyFlv = function() {
        try {
          this._flv && (this._flv.pause(), this._flv.destroy());
        } catch (e) {
          console.log(e);
        }
        this.loaded = !1, this._hasLoaded = !1, this._flv = null;
      }, t.prototype.dispose = function() {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyFlv(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.seek = this._superPt.seek, t.prototype.canSeekable = this._superPt.canSeekable));
      }, t.prototype.canSeekable = function(e) {
        var t = this._flv.mediaInfo;
        return !(!this._flv._isTimepointBuffered(e) && t && !t.hasKeyframesIndex);
      }, l = function(s, e) {
        var l = !1;
        e.on(flvjs.Events.ERROR, function(e, t, r) {
          var i = c.ErrorCode.OtherError, n = p.get("Error_Play_Text");
          t == flvjs.ErrorDetails.NETWORK_EXCEPTION ? !(a = s.getOptions().source) || 0 != a.toLowerCase().indexOf("http://") && 0 != a.toLowerCase().indexOf("https://") ? (i = c.ErrorCode.InvalidSourceURL, n = p.get("Error_Invalidate_Source_Widthout_Protocal"), l = !0) : n = navigator.onLine ? (i = c.ErrorCode.RequestDataError, p.get("Maybe_Cors_Error")) : (i = c.ErrorCode.NetworkError, p.get("Error_Network_Text")) : t == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID ? "404" == r.code ? (i = c.ErrorCode.NotFoundSourceURL, n = p.get("Error_Not_Found")) : "403" == r.code ? (i = c.ErrorCode.AuthKeyExpired, n = p.get("Error_AuthKey_Text"), l = !0) : (i = c.ErrorCode.NetworkError, n = p.get("Error_Network_Text")) : t == flvjs.ErrorDetails.NETWORK_TIMEOUT ? (i = c.ErrorCode.LoadingTimeout, n = p.get("Error_Waiting_Timeout_Text")) : t != flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED && t != flvjs.ErrorDetails.MEDIA_CODEC_UNSUPPORTED || (i = c.ErrorCode.FormatNotSupport, n = p.get("Error_H5_Not_Support_Text"), l = !0);
          var o, a = function() {
            var e;
            setTimeout(function() {
              s.trigger(y.Private.Play_Btn_Hide);
            }), s.checkOnline() && (e = {
              mediaId: s._options && s._options.vid ? s._options.vid : "",
              error_code: i,
              error_msg: r.msg
            }, s.logError(e), e.display_msg = n, u.cityBrain && (s.flv = null), s.trigger(y.Player.Error, e));
          };
          s._options && s._options.isLive && !l ? (o = s._options).liveRetry > s._liveRetryCount ? (0 == s._liveRetryCount && s.trigger(y.Player.OnM3u8Retry), t = o.liveRetryInterval + o.liveRetryStep * s._liveRetryCount, s._liveRetryCount++, setTimeout(function() {
            s._loadByUrlInner(o.source);
          }, 1e3 * t)) : (s._liveErrorHandle && clearTimeout(s._liveErrorHandle), s.trigger(y.Player.LiveStreamStop), s._liveErrorHandle = setTimeout(a, 500)) : s._reloadForVod() || a();
        });
      });
    };
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/dom": 219,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../base/event/eventtype": 244,
    "../base/player": 263
  }],
  273: [function(e, t, r) {
    var i = e("../base/player"), n = e("./flvinjector"), o = i.extend({
      init: function(e, t) {
        n.inject(this, o, i, t, function(e) {
        }), t._native = !1, i.call(this, e, t);
      }
    });
    t.exports = o;
  }, { "../base/player": 263, "./flvinjector": 272 }],
  274: [function(e, t, r) {
    var u = e("../../lib/io"), c = e("../../config"), h = e("../../lib/constants"), d = e("../../lib/util"),
      f = e("../../lib/playerutil"), p = (e("../../lib/dom"), e("../../lib/ua")), y = e("../../lang/index"),
      g = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function(e, t, r, i, o, n) {
      var a, s = i.source, l = i.useHlsPluginForSafari, i = i.useHlsPlugOnMobile;
      (o || n || (n = s, l = l, i = i, !e._hls && f.isHls(n) && (!f.canPlayHls() || f.isSafariUsedHlsPlugin(l) || i && f.isUsedHlsPluginOnMobile()))) && (e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkHlsReady = function() {
        if (null == e._hls) throw new Error("please invoke this method after ready event");
      }, e._isHls = !0, e._hls = null, e._isLoadedHls = !1, e._stopLoadAsPaused = !0, t.prototype.play = function(e) {
        this._checkHlsReady(), this._isManualPlay = e || !1;
        return this.trigger(g.Private.Cover_Hide), this._options.autoplay || this._options.preload || this._loadSourced || (this._loadSourced = !0, this._options._autoplay = !0, this._hls.loadSource(this._options.source)), this.tag.ended || this._ended ? this.replay() : this.tag.paused && (this.tag.play(), this._stopLoadAsPaused && (e = this.getCurrentTime(), this._hls.startLoad(e))), this;
      }, t.prototype.replay = function() {
        return this._monitor && this._monitor.replay(), this._hls.startLoad(0), this.tag.play(), this;
      }, t.prototype.pause = function(e) {
        return this.tag && (this._checkHlsReady(), this.tag.pause(), this._stopLoadAsPaused && this._hls.stopLoad()), this._isManualPause = e || !1, this;
      }, t.prototype.stop = function() {
        return this._checkHlsReady(), this.tag.setAttribute("src", null), this._hls.stopLoad(), this;
      }, t.prototype.seek = function(e) {
        this._checkHlsReady();
        try {
          this._superPt.seek.call(this, e), this.tag.paused && this._stopLoadAsPaused && this._hls.startLoad(e);
        } catch (e) {
          console.log(e);
        }
        return this;
      }, t.prototype.getProgramDateTime = function() {
        if (this._checkHlsReady(), -1 == this._hls.currentLevel) return "";
        var e = this._hls.currentLevel, e = this._hls.levels[e].details;
        if (e) {
          e = e.programDateTime;
          if (console.log("ProgramDateTime=" + e), e) return new Date(e).valueOf();
        }
        return 0;
      }, t.prototype.getCurrentPDT = function() {
        if (this._checkHlsReady(), -1 == this._hls.currentLevel) return "";
        var e = this._hls.streamController.fragPlaying || {}, t = e.pdt;
        if (!t) return 0;
        e = 1e3 * e.startPTS;
        return t + (1e3 * this.getCurrentTime() - e);
      }, t.prototype._reloadAndPlayForM3u8 = function() {
        0 == this._liveRetryCount && this.trigger(g.Player.OnM3u8Retry), this._liveRetryCount++;
      }, t.prototype._switchLevel = function(e) {
        this.trigger(g.Player.LevelSwitch);
        for (var t = this._hls.levels, r = !0, i = 0; i < t.length; i++) if (t[i].url == e) {
          r = !1, this._hls.currentLevel = i;
          break;
        }
        r && (this._hls.currentLevel = -1), this._switchedLevel = !0;
        var n = this;
        setTimeout(function() {
          n.trigger(g.Player.LevelSwitched), this._switchedLevel = !1;
        }, 1e3);
      }, t.prototype.initPlay = function(e) {
        if (d.contentProtocolMixed(s)) {
          var t = {
            mediaId: this._options.vid || "",
            error_code: h.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = y.get("Request_Block_Text"), void this.trigger(g.Player.Error, t);
        }

        function r(s, t) {
          var r = !s._hls;
          s._destroyHls();
          var e, i = {
            xhrSetup: function(e, t) {
              e.withCredentials = s._options.withCredentials || !1;
            }
          }, n = s._options.loadingTimeOut || s._options.hlsLoadingTimeOut;
          for (e in n && (i.manifestLoadingTimeOut = n, i.levelLoadingTimeOut = n, i.fragLoadingTimeOut = n), s._options.liveSyncDurationCount && (i.liveSyncDurationCount = s._options.liveSyncDurationCount), s._options.defaultBandwidth && (i.defaultBandwidth = s._options.defaultBandwidth), s._options.isLive && (s._options.hlsFrameChasing && (i.hlsFrameChasing = s._options.hlsFrameChasing), s._options.chasingFirstParagraph && (i.chasingFirstParagraph = s._options.chasingFirstParagraph), s._options.chasingSecondParagraph && (i.chasingSecondParagraph = s._options.chasingSecondParagraph), s._options.chasingFirstSpeed && (i.chasingFirstSpeed = s._options.chasingFirstSpeed), s._options.chasingSecondSpeed && (i.chasingSecondSpeed = s._options.chasingSecondSpeed)), s._options.nudgeMaxRetry && (i.nudgeMaxRetry = s._options.nudgeMaxRetry), s._options.maxMaxBufferLength && (i.maxMaxBufferLength = s._options.maxMaxBufferLength), s._options.maxBufferSize && (i.maxBufferSize = s._options.maxBufferSize), s._options.fragLoadingRetryDelay && (i.fragLoadingRetryDelay = s._options.fragLoadingRetryDelay), s._options.maxBufferLength && (i.maxBufferLength = s._options.maxBufferLength), s._options.hlsBandWidthUpCacheTime && (i.abrBandWidthUpCacheTime = s._options.hlsBandWidthUpCacheTime), s._options.seamlessHandover && (i.seamlessHandover = s._options.seamlessHandover), s._options.accessKeyId && (i.accessKeyId = s._options.accessKeyId), s._options.accessKeySecret && (i.accessKeySecret = s._options.accessKeySecret), s._options.securityToken && (i.securityToken = s._options.securityToken), s._options.app && (i.app = s._options.app), s._options.stream && (i.stream = s._options.stream), s._options.domain && (i.domain = s._options.domain), o && (i._sce_dlgtqredxx = o), i.enableWorker = s._options.enableWorker, i.debug = s._options.debug, s._stopLoadAsPaused = s._options.hlsOption.stopLoadAsPaused, s._options.hlsOption) i[e] = s._options.hlsOption[e];
          p.IS_IE11 && o && (i.enableWorker = !1), s._hls = new Hls(i), a(s, s._hls), s._setLevels(), s._loadSourced = !1, s._hls.attachMedia(s.tag), s._hls.on(Hls.Events.FRAG_PARSING_USERDATA, function(e, t) {
            t && t.dataContent && t.dataContent.length && s.trigger(g.Player.SeiFrame, t.dataContent);
          }), s._hls.on(Hls.Events.MEDIA_ATTACHED, function() {
            var e;
            s._hls.on(Hls.Events.MANIFEST_PARSED, function() {
              s._initPlayBehavior(t || s._loadSourced);
            }), s._hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function(e, t) {
              s.trigger(g.Player.AudioTrackUpdated, t);
            }), s._hls.on(Hls.Events.MANIFEST_LOADED, function(e, t) {
              s.trigger(g.Player.LevelsLoaded, t);
            }), s._hls.on(Hls.Events.LEVEL_SWITCHED, function(e, t) {
              if (s._qualityService) {
                for (var r = s._hls.levels[t.level].url, i = s._qualityService.levels, n = "", o = "", a = 0; a < i.length; a++) if (i[a].Url == r) {
                  o = i[a].desc, n = i[a].bitrate;
                  break;
                }
                (o || n) && s.trigger(g.Private.QualityChange, { levelSwitch: !0, url: r, bitrate: n, desc: o });
              }
            }), s._hls.on(Hls.Events.AUDIO_TRACK_SWITCH, function(e, t) {
              s.trigger(g.Player.AudioTrackSwitch, t), setTimeout(function() {
                s.trigger(g.Player.AudioTrackSwitched, t);
              }, 1e3);
            }), (s._options.autoplay || s._options.preload || t) && (s._loadSourced = !0, s._levels && 1 < s._levels.length ? (s.isMutiLevel || (s._hls.currentLevel = s._currentPlayIndex), s._hls.trigger(Hls.Events.MANIFEST_LOADING, {}), s._hls.trigger(Hls.Events.MANIFEST_LOADED, { levels: s._levels })) : s._hls.loadSource(s._options.source)), r && (s._executeReadyCallback(), s._urls && 0 < s._urls.length && !s._options.defaultDefinition && (s._currentPlayIndex = f.findSelectedStreamLevel(s._urls), e = s._urls[s._currentPlayIndex], s._options.source = e.Url, s.trigger(g.Private.SourceLoaded, e)));
          });
        }

        this._isLoadedHls && "undefined" != typeof Hls ? r(this, e) : (this.trigger(g.Private.H5_Loading_Show), function(e, t, r) {
          var i = "aliplayer-hls-min.js", n = "",
            n = c.domain ? "https://" + c.domain + "/de/prismplayer/" + c.h5Version + "/hls/" + i : "/build/hls/" + i,
            o = this;
          u.loadJS(n, function() {
            e.apply(o);
          });
        }.call(this, function() {
          this._isLoadedHls = !0, r(this, e);
        }, this._options.debug));
      }, t.prototype._getbwEstimator = function() {
        var e, t = NaN;
        return t = this._hls ? (e = this._hls.abrController._bwEstimator) ? e.getEstimate() : NaN : t;
      }, t.prototype._destroyHls = function() {
        this._hls && this._hls.destroy(), this._hls = null;
      }, t.prototype._setLevels = function() {
        if (!this._options.isLive) {
          for (var e = this._urls.length, t = [], r = 0; r < e; r++) {
            var i = this._urls[r];
            t.push({
              attrs: {},
              audioCodec: "mp4a.40.5",
              videoCodec: "avc1.42c01e",
              url: i.Url,
              width: i.width,
              height: i.height,
              bitrate: i.bitrate
            });
          }
          this._levels = t;
        }
      }, t.prototype.dispose = function() {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyHls(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.replay = this._superPt.replay, t.prototype.stop = this._superPt.stop, t.prototype.seek = this._superPt.seek, t.prototype.dispose = this._superPt.dispose));
      }, a = function(s, e) {
        e.on(Hls.Events.DEFAULT_BANDWIDTH, function(e, t) {
          s.trigger(g.Player.DefaultBandWidth, { width: t.width, height: t.height, bitrate: t.bitrate });
        }), e.on(Hls.Events.ERROR, function(e, t) {
          var r, i, n, o, a;
          !s._options || t.details == Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR || 1 == s._seeking || 0 == t.fatal && t.type != Hls.ErrorTypes.NETWORK_ERROR || (s._clearTimeout(), r = h.ErrorCode.LoadedMetadata, n = y.get("Error_Play_Text"), i = !1, t.details == Hls.ErrorDetails.MANIFEST_LOAD_ERROR ? (i = !0, t.networkDetails, n = t.response ? "404" == t.response.code ? (r = h.ErrorCode.NotFoundSourceURL, y.get("Error_Not_Found")) : "403" == t.response.code ? (r = h.ErrorCode.AuthKeyExpired, y.get("Error_AuthKey_Text")) : "0" == t.response.code && navigator.onLine ? (r = h.ErrorCode.RequestDataError, n + "\uff0c" + y.get("Maybe_Cors_Error")) : y.get("Error_Load_M3U8_Failed_Text") : y.get("Error_Load_M3U8_Failed_Text")) : t.details == Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ? (i = !0, n = y.get("Error_Load_M3U8_Timeout_Text")) : t.details == Hls.ErrorDetails.MANIFEST_PARSING_ERROR || t.details == Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR ? (i = !0, n = y.get("Error_M3U8_Decode_Text")) : t.type == Hls.ErrorTypes.NETWORK_ERROR ? (r = h.ErrorCode.NetworkError, n = y.get("Error_Network_Text")) : t.type != Hls.ErrorTypes.MUX_ERROR && t.type != Hls.ErrorTypes.MEDIA_ERROR || (r = h.ErrorCode.PlayDataDecode, n = y.get("Error_TX_Decode_Text")), n = n + "(" + t.details + ")", o = function() {
            var e;
            s.pause(), setTimeout(function() {
              s.trigger(g.Private.Play_Btn_Hide);
            }), s.checkOnline() && (e = {
              mediaId: s._options && s._options.vid ? s._options.vid : "",
              error_code: r,
              error_msg: t.details
            }, s.logError(e), e.display_msg = n, s.trigger(g.Player.Error, e));
          }, s._options && s._options.isLive ? (a = s._options).liveRetry > s._liveRetryCount ? (0 == s._liveRetryCount && s.trigger(g.Player.OnM3u8Retry), a = a.liveRetryInterval + a.liveRetryStep * s._liveRetryCount, s._liveRetryCount++, setTimeout(function() {
            i && s._loadByUrlInner(s._options.source, 0, !0);
          }, 1e3 * a)) : (s._liveErrorHandle && clearTimeout(s._liveErrorHandle), s.trigger(g.Player.LiveStreamStop), s._liveErrorHandle = setTimeout(o, 500)) : s._reloadForVod() || o());
        });
      });
    };
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/dom": 219,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../base/event/eventtype": 244,
    "../base/player": 263
  }],
  275: [function(e, t, r) {
    var i = e("../base/player"), n = e("./hlsinjector"), o = i.extend({
      init: function(e, t) {
        t._native = !1, n.inject(this, o, i, t), i.call(this, e, t);
      }
    });
    t.exports = o;
  }, { "../base/player": 263, "./hlsinjector": 274 }],
  276: [function(e, t, r) {
    var a = e("../../lib/io"), s = e("../../config"), u = e("../../lib/constants"),
      c = (e("../../lib/util"), e("../../lib/playerutil"), e("../../lib/dom"), e("../../lib/ua"), e("../../lang/index")),
      h = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function(e, t, r, i, n, o) {
      e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkRtsReady = function() {
        if (null == e._rts) throw new Error("please invoke this method after ready event");
      }, e._isRts = !0, e._rts = null, e._isLoadedRts = !1, e._originalUrl = "", t.prototype.play = function(e) {
        this._checkRtsReady(), this._isManualPlay = e || !1;
        return this.trigger(h.Private.Cover_Hide), this._options.autoplay || this._options.preload || this._loadSourced || (this._loadSourced = !0, this._options._autoplay = !0, this._rts.startLiveStream(this._options.source, this.tag)), this.tag.paused && (this.tag.play(), this._initPlayBehavior(!0)), this;
      }, t.prototype.seek = function(e) {
      }, t.prototype.setSpeed = function(e) {
      }, t.prototype.pause = function(e) {
        return this._checkRtsReady(), this.tag.pause(), this;
      }, t.prototype.stop = function() {
        return this._rts && this._rts.stopLiveStream(), this;
      }, t.prototype.dispose = function() {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyRts(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.stop = this._superPt.stop, t.prototype.dispose = this._superPt.dispose, t.prototype.seek = this._superPt.seek, t.prototype.setSpeed = this._superPt.setSpeed));
      }, t.prototype._destroyRts = function() {
        this._rts && this.stop(), this._rts = null;
      }, t.prototype._destroyRts = function() {
        this._rts && this.stop(), this._rts = null;
      }, t.prototype.initPlay = function(e) {
        function t(r, i) {
          var n = null, o = null, a = !r._rts;
          r._destroyRts();
          var e = r._options.customTag || "", t = r._options.trackLog || !1, s = r._options.playTimeOut || 5e3;
          r._originalUrl = r._options.source, r._rts = new AliRTS({
            customTag: e,
            trackLog: t,
            playConfig: { playTimeOut: s }
          }), r._rts.isSupport({ isReceiveVideo: !0 }).then(function(e) {
            console.log(e), l(r, r._rts), r._initPlayBehavior(i), r._rts.startLiveStream(r._options.source, r.tag).then(function() {
            })["catch"](function(e) {
              10202 == e.code ? (n = u.ErrorCode.PlayUrlError, o = c.get("Play_Url_Error")) : 10203 == e.code ? (n = u.ErrorCode.SubscribeNonthing, o = c.get("Subscribe_Nonthing")) : 10204 == e.code && (n = u.ErrorCode.HtmlElementError, o = c.get("Html_Element_Error"));
              e = { error_code: n, error_msg: o };
              null !== e.error_code && null !== e.error_msg && r.trigger(h.Player.Error, e);
            });
            var t = document.querySelector(".volume-icon");
            t && t.addEventListener("click", function(e) {
              r._rts.muteLiveStream(!1), t.setAttribute("class", "volume-icon");
            }), a && r._executeReadyCallback();
          })["catch"](function(e) {
            return 10011 == e.errorCode ? (n = u.ErrorCode.BrowserNotSupport, o = c.get("Browser_Not_Support")) : 10010 == e.errorCode && (n = u.ErrorCode.NotSupportWebRtc, o = c.get("Not_Support_Webrtc")), r.trigger(h.Player.Error, {
              error_code: n,
              error_msg: o
            }), !1;
          });
        }

        (that = this)._isLoadedRts ? t(this, e) : (this.trigger(h.Private.H5_Loading_Show), function(e, t) {
          var r = this._options.rtsVersion || s.rtsVersion, i = this;
          a.loadJS("https://g.alicdn.com/AliRTC/H5RTSSdk/" + r + "/aliyun-rts-sdk.js", function() {
            e.apply(i);
          });
        }.call(that, function() {
          this._isLoadedRts = !0, t(this, e);
        }, this._options.debug));
      };
      var l = function(i, e) {
        function n(e, t) {
          i.pause(), setTimeout(function() {
            i.trigger(h.Private.Play_Btn_Hide);
          }), i.checkOnline() && (i.logError(t = { error_code: e, error_msg: t }), i.trigger(h.Player.Error, t));
        }

        function o(e, t) {
          var r;
          i._options && i._options.isLive ? (r = i._options).liveRetry > i._liveRetryCount ? (0 == i._liveRetryCount && i.trigger(h.Player.OnM3u8Retry), r = r.liveRetryInterval + r.liveRetryStep * i._liveRetryCount, i._liveRetryCount++, setTimeout(function() {
            i._loadByUrlInner(i._options.source, 0, !0);
          }, 1e3 * r)) : (i._liveErrorHandle && clearTimeout(i._liveErrorHandle), i.trigger(h.Player.LiveStreamStop), i._liveErrorHandle = setTimeout(n(e, t), 500)) : i._reloadForVod() || n(e, t);
        }

        e.on("onError", function(e) {
          var t = null, r = null;
          10001 == e.errorCode ? (t = u.ErrorCode.RequestHttpError, r = c.get("Http_Request_Error"), o(t, r)) : 10010 == e.errorCode ? (t = u.ErrorCode.NotSupportWebRtc, r = c.get("Not_Support_Webrtc"), n(t, r)) : 10012 == e.errorCode ? (t = u.ErrorCode.BrowserVersionTooLow, r = c.get("Browser_Version_Too_Low"), n(t, r)) : 10013 == e.errorCode ? (t = u.ErrorCode.NotSupportH264, r = c.get("Not_Support_H264"), n(t, r)) : 10014 == e.errorCode ? (t = u.ErrorCode.CreateOfferError, r = c.get("Create_Offer_Error"), n(t, r)) : 10002 == e.errorCode && (t = u.ErrorCode.PlayFailedError, r = c.get("ERROR_PLAY_FAILED"), o(t, r));
        });
        var t = "canplay", r = "waiting", a = "playing", s = "media", l = !1;
        e.on("onPlayEvent", function(e) {
          e.event === t || e.event === r || e.event === a || e.event === s && e.data && (0 === e.data.audio.bytesReceivedPerSecond && 0 === e.data.video.bytesReceivedPerSecond ? 0 == e.data.audio.bytesReceivedPerSecond && 0 == e.data.video.bytesReceivedPerSecond && l && (errorCode = u.ErrorCode.PlayFailedError, errorMsg = c.get("ERROR_PLAY_FAILED"), o(errorCode, errorMsg), l = !1) : l = !0);
        });
      };
    };
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/dom": 219,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../base/event/eventtype": 244,
    "../base/player": 263
  }],
  277: [function(e, t, r) {
    var i = e("../base/player"), n = e("./rtsinjector"), o = i.extend({
      init: function(e, t) {
        t.isLive && (t._native = !1, n.inject(this, o, i, t), i.call(this, e, t));
      }
    });
    t.exports = o;
  }, { "../base/player": 263, "./rtsinjector": 276 }],
  278: [function(e, t, r) {
    var i = e("../../lib/constants"), e = e("../../lib/oo").extend({
      init: function(e) {
        this.player = e, this.tickhandle = null;
      }
    });
    e.prototype.tick = function(e, t) {
      var r = this;
      this.tickhandle = setTimeout(function() {
        r.player && r.player.trigger(i.AuthKeyExpiredEvent), t && t();
      }, 1e3 * e);
    }, e.prototype.clearTick = function(e) {
      this.tickhandle && clearTimeout(this.tickhandle);
    }, t.exports = e;
  }, { "../../lib/constants": 216, "../../lib/oo": 228 }],
  279: [function(e, t, r) {
    var o = e("../../lib/io"), l = (e("../../lib/ua"), e("../../lib/bufferbase64")), u = e("../../lib/constants"),
      c = e("./signature"), a = e("./util"), h = e("../../lib/url"), d = e("../../lib/playerutil"),
      s = e("../../lang/index"), f = function(e, t, r) {
        var i = c.randomUUID(), n = "https://mts." + e.domainRegion + ".aliyuncs.com/?", i = {
          AccessKeyId: e.accessId,
          Action: "GetLicense",
          MediaId: e.vid,
          LicenseUrl: n,
          data: e.data,
          SecurityToken: e.stsToken,
          Format: "JSON",
          Type: e.encryptionType,
          Version: "2014-06-18",
          SignatureMethod: "HMAC-SHA1",
          SignatureVersion: "1.0",
          SignatureNonce: i
        };
        e.header && (i.Header = e.header);
        e = n + ("Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(i, e.accessSecret, "POST"))), i = c.makeUTF8sort(i, "=", "&");
        o.post(e, i, function(e) {
          e ? (e = JSON.parse(e), t && (e = e.License, t(e))) : r && r(a.createError("MPS\u83b7\u53d6License\u5931\u8d25"));
        }, function(e) {
          if (r) {
            var t = { Code: "", Message: s.get("Error_MTS_Fetch_Urls_Text") };
            try {
              t = JSON.parse(e);
            } catch (e) {
            }
            r({ Code: u.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || "" });
          }
        });
      };

    function p(e) {
      window.console.error("A video playback error occurred");
    }

    function y(e) {
      window.console.error("The license request failed.");
    }

    function g(e) {
      window.console.error("A decryption key error was encountered");
    }

    function m(e) {
      window.console.log("Decryption key was added to session.");
    }

    function b(e, t, r) {
      r.addEventListener(e, function() {
        t(arguments[0]);
      }, !1);
    }

    t.exports.requestLicenseKey = function(e) {
      var s = e;
      return s._options.vid && (s.__vid = s._options.vid), function(e, t) {
        var r, i, n, o = s._options, a = s._getDRMEncryptItem();
        a && (r = {
          vid: s.__vid,
          accessId: o.accId,
          accessSecret: o.accSecret,
          stsToken: o.stsToken,
          domainRegion: o.domainRegion,
          authInfo: o.authInfo,
          encryptionType: a.encryptionType
        }, a.encryptionType == u.EncryptionType.Widevine ? r.data = l.encode(e.message) : a.encryptionType == u.EncryptionType.PlayReady && (i = l.unpackPlayReady(e.message), r.data = i.changange, i.header && (r.header = JSON.stringify(i.header))), console.log(r.data), i = s.__licenseKeys, n = s.__vid + a.Url, i && i[n], f(r, function(e) {
          s.__licenseKeys || (s.__licenseKeys = {}), 10 < r.data.length && (s.__licenseKeys[n] = e);
          e = l.decode(e);
          t(e);
        }, function(e) {
          e = { mediaId: s.__vid, error_code: e.Code, error_msg: e.Message };
          s.logError(e), s.trigger("error", e);
        }));
      };
    }, t.exports.loadCertificate = function(e) {
      var t = new XMLHttpRequest;
      t.addEventListener("load", function(e) {
        var t, r = this, e = e.target;
        try {
          t = this._options.isLive ? JSON.parse(e.response).Response.B64ServCert : JSON.parse(JSON.parse(e.response).DRMCertInfo).b64ServCert;
        } catch (e) {
          console.log(e);
        }
        var i = c.base64DecodeUint8Array(t);
        this.tag.addEventListener("webkitneedkey", function(e) {
          !function(e, t) {
            var r = e.target, i = e.initData, n = c.arrayToString(i).split("skd://")[1].split("?")[0],
              e = c.stringToArray(n);
            i = function(e, t, r) {
              "string" == typeof t && (t = stringToArray(t));
              var i = 0, n = new ArrayBuffer(e.byteLength + 4 + t.byteLength + 4 + r.byteLength), o = new DataView(n);
              new Uint8Array(n, 0, e.byteLength).set(e), i += e.byteLength, o.setUint32(i, t.byteLength, !0), i += 4;
              e = new Uint16Array(n, i, t.length);
              return e.set(t), i += e.byteLength, o.setUint32(i, r.byteLength, !0), i += 4, new Uint8Array(n, i, r.byteLength).set(r), new Uint8Array(n, 0, n.byteLength);
            }(i, e, t), r.webkitKeys || (function() {
              {
                if (!WebKitMediaKeys.isTypeSupported("com.apple.fps.1_0", "video/mp4")) throw"Key System not supported";
                keySystem = "com.apple.fps.1_0";
              }
            }(), r.webkitSetMediaKeys(new WebKitMediaKeys(keySystem)));
            if (!r.webkitKeys) throw"Could not create MediaKeys";
            i = r.webkitKeys.createSession("video/mp4", i);
            if (!i) throw"Could not create key session";
            i.contentId = n, b("webkitkeymessage", function(e) {
              var t = this, r = e.target, i = e.message, n = new XMLHttpRequest;
              e.sessionId;
              n.responseType = "text", n.session = r, n.addEventListener("load", function(e) {
                var t = e.target;
                e = this._options.isLive ? JSON.parse(t.response).Response.B64License : JSON.parse(JSON.parse(t.response).License).b64License;
                e = c.base64DecodeUint8Array(e), e = c.Uint8ArrayToString(e);
                "<ckc>" === e.substr(0, 5) && "</ckc>" === e.substr(-6) && (e = e.slice(5, -6));
                e = c.base64DecodeUint8Array(e);
                t.session.update(e);
              }.bind(this), !1), n.addEventListener("error", y, !1);
              var r = btoa("spc=" + c.base64EncodeUint8Array(i) + "&assetId=" + encodeURIComponent(r.contentId)), o = {
                Format: "JSON",
                SignatureMethod: "HMAC-SHA1",
                SignatureVersion: "1.0",
                Timestamp: c.ISODateString(new Date),
                SignatureNonce: c.randomUUID(),
                AccessKeyId: t._options.accessKeyId,
                SecurityToken: t._options.securityToken,
                CertId: t._options.certId
              };
              t._options.isLive ? (o.RegionId = t._options.region, o.Action = "DescribeDRMLicense", o.Version = "2016-11-01", o.CdmData = r, o.Type = "fairplay", o.Domain = h.parseUrl(t._options.source).hostname) : (o.region = t._options.region, o.Action = "GetDRMLicense", o.Version = "2017-03-21", o.VideoId = t._options.vid, o.CDMData = r, o.DRMType = "FairPlay");
              var a, s, r = "Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(o, t._options.accessKeySecret, "POST"));
              r = t._options.isLive ? "https://" + d.getLiveHostByRegion(t._options.region) + "/?" + r : "https://vod." + t._options.region + ".aliyuncs.com/?" + r;
              for (s in n.open("POST", r, !0), n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), o) {
                var l;
                o.hasOwnProperty(s) && (l = o[s], a = a ? a + "&" + c.AliyunEncodeURI(s) + "=" + c.AliyunEncodeURI(l) : c.AliyunEncodeURI(s) + "=" + c.AliyunEncodeURI(l));
              }
              n.send(a);
            }.bind(this), i), b("webkitkeyadded", m, i), b("webkitkeyerror", g, i);
          }.call(r, e, i);
        }, !1), this.tag.addEventListener("error", p, !1), this.tag.src = this._options.source;
      }.bind(e), !1), t.addEventListener("error", function(e) {
        window.console.error("Failed to retrieve the server certificate.");
      }.bind(e), !1);
      var r = {
        Format: "JSON",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        Timestamp: c.ISODateString(new Date),
        SignatureNonce: c.randomUUID(),
        AccessKeyId: e._options.accessKeyId,
        SecurityToken: e._options.securityToken,
        CertId: e._options.certId
      };
      e._options.isLive ? (r.RegionId = e._options.region, r.Action = "DescribeDRMCertificate", r.Version = "2016-11-01") : (r.region = e._options.region, r.Action = "GetDRMCertInfo", r.Version = "2017-03-21", r.VideoId = e._options.vid);
      var i, n, o, a = "Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(r, e._options.accessKeySecret, "POST")),
        a = e._options.isLive ? "https://" + d.getLiveHostByRegion(e._options.region) + "/?" + a : "https://vod." + e._options.region + ".aliyuncs.com/?" + a;
      for (i in t.open("POST", a, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), r) r.hasOwnProperty(i) && (n = r[i], o = o ? o + "&" + c.AliyunEncodeURI(i) + "=" + c.AliyunEncodeURI(n) : c.AliyunEncodeURI(i) + "=" + c.AliyunEncodeURI(n), console.log(n));
      t.send(o);
    }, t.exports.getRequestUrl = function(e, t) {
      var r = {
        AccessKeyId: t._options.accessKeyId,
        Format: "JSON",
        Version: "2016-11-01",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        Timestamp: c.ISODateString(new Date),
        SignatureNonce: c.randomUUID(),
        CertId: t._options.certId,
        SecurityToken: t._options.securityToken,
        RegionId: t._options.region,
        Action: "DescribeDRMLicense",
        Type: "widevine",
        CdmData: e,
        Domain: h.parseUrl(t._options.source).hostname
      }, e = "Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(r, t._options.accessKeySecret, "POST"));
      return {
        url: "https://" + d.getLiveHostByRegion(t._options.region) + "/?" + e,
        data: c.makeUTF8sort(r, "=", "&"),
        jsonData: c.makeUTF8sort(r, "=", "&", "json")
      };
    }, t.exports.postData = function(e, t) {
      var r = c.randomUUID(), r = {
        AccessKeyId: t._options.accessKeyId,
        VideoId: t._options.vid,
        Format: "JSON",
        Version: "2017-03-21",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        SignatureNonce: r,
        CertId: t._options.certId,
        SecurityToken: t._options.securityToken,
        region: t._options.region,
        Action: "GetDRMLicense",
        DRMType: "Widevine",
        CDMData: e
      }, e = "Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(r, t._options.accessKeySecret, "POST"));
      return {
        url: "https://vod." + t._options.region + ".aliyuncs.com/?" + e,
        data: c.makeUTF8sort(r, "=", "&"),
        jsonData: c.makeUTF8sort(r, "=", "&", "json")
      };
    };
  }, {
    "../../lang/index": 212,
    "../../lib/bufferbase64": 214,
    "../../lib/constants": 216,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../../lib/url": 233,
    "./signature": 283,
    "./util": 285
  }],
  280: [function(e, t, r) {
    var i = e("../../lib/io"), l = e("../../lib/constants"), s = e("./signature"), u = e("./util"),
      c = e("../../lang/index"), h = e("../../lib/ua");
    var d = function(e, r) {
      var t = "";
      e.sort(function(e, t) {
        e = parseInt(e.bitrate), t = parseInt(t.bitrate);
        return "desc" == r ? t < e ? -1 : e < t ? 1 : void 0 : e < t ? -1 : t < e ? 1 : void 0;
      });
      for (var i = e.length, n = 0; n < i; n++) {
        var o = e[n], a = l.QualityLevels[o.definition], s = "",
          s = void 0 === a ? o.bitrate : t == a ? a + o.bitrate : a;
        o.desc = s, t = a;
      }
    }, f = function(e, r) {
      var t = "";
      e.sort(function(e, t) {
        e = parseInt(e.width), t = parseInt(t.width);
        return "desc" == r ? t < e ? -1 : e < t ? 1 : void 0 : e < t ? -1 : t < e ? 1 : void 0;
      });
      for (var i = e.length, n = 0; n < i; n++) {
        var o = e[n], a = l.QualityLevels[o.definition], s = "", s = void 0 === a ? "" : t == a ? a + o.height : a;
        o.desc = s, t = a;
      }
    };
    t.exports.getDataByAuthInfo = function(e, n, o, a) {
      s.returnUTCDate(), s.randomUUID();
      var t = s.randomUUID(), t = {
        AccessKeyId: e.accessId,
        Action: "PlayInfo",
        MediaId: e.vid,
        Formats: e.format,
        AuthInfo: e.authInfo,
        AuthTimeout: e.authTimeout || l.AuthKeyExpired,
        IncludeSnapshotList: e.includeSnapshotList,
        Rand: e.rand,
        SecurityToken: e.stsToken,
        Format: "JSON",
        Version: "2014-06-18",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        Terminal: h.IS_CHROME ? "Chrome" : h.IS_EDGE ? "Edge" : h.IS_IE11 ? "IE" : h.IS_SAFARI ? "Safari" : h.IS_FIREFOX ? "Firefox" : "",
        SignatureNonce: t
      };
      e.hlsUriToken && (e.MtsHlsUriToken = e.hlsUriToken), e.playConfig && (t.PlayConfig = JSON.stringify(e.playConfig)), t = s.makeUTF8sort(t, "=", "&") + "&Signature=" + s.AliyunEncodeURI(s.makeChangeSiga(t, e.accessSecret)), t = "https://mts." + e.domainRegion + ".aliyuncs.com/?" + t, i.get(t, function(e) {
        var t, r, i;
        e ? (i = (t = JSON.parse(e)).PlayInfoList.PlayInfo, r = "", (e = t.SnapshotList ? t.SnapshotList.Snapshot : []) && 0 < e.length && (r = e[0].Url), i = function(e, t) {
          for (var r = [], i = [], n = [], o = [], a = e.length - 1; 0 <= a; a--) {
            var s = e[a];
            ("mp4" == s.format ? i : "mp3" == s.format ? n : "m3u8" == s.format ? r : o).push(s);
          }
          return 0 < n.length ? (d(n, t), n) : 0 < i.length ? (f(i, t), i) : 0 < r.length ? (f(r, t), r) : (f(o, t), o);
        }(i, n), o && o({
          requestId: t.RequestId,
          urls: i,
          thumbnailUrl: r
        })) : a && a(u.createError("MPS\u83b7\u53d6\u53d6\u6570\u5931\u8d25"));
      }, function(e) {
        if (a) {
          var t = { Code: "", Message: c.get("Error_MTS_Fetch_Urls_Text") };
          try {
            t = JSON.parse(e);
          } catch (e) {
          }
          a({ Code: l.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || "" });
        }
      });
    };
  }, {
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/io": 225,
    "../../lib/ua": 232,
    "./signature": 283,
    "./util": 285
  }],
  281: [function(e, t, r) {
    var i = e("./saasplayer"), n = (e("../../lib/constants"), e("./mts")), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.service = n, this.loadByMts();
      }
    });
    e.prototype.loadByMts = function(e) {
      var t = {
        vid: this._options.vid,
        accessId: this._options.accId,
        accessSecret: this._options.accSecret,
        stsToken: this._options.stsToken,
        domainRegion: this._options.domainRegion,
        authInfo: this._options.authInfo,
        format: this._options.format,
        includeSnapshotList: this._options.includeSnapshotList || !1,
        defaultDefinition: this._options.defaultDefinition,
        authTimeout: this._options.authTimeout,
        hlsUriToken: this._options.hlsUriToken,
        playConfig: this._options.playConfig
      };
      this.loadData(t, e);
    }, e.prototype.replayByVidAndAuthInfo = function(e, t, r, i, n, o) {
      this.trigger("error_hide"), this._options.source = "", this._isError = !1, this._duration = 0, this._options.cover = "", this._vodRetryCount = 0, this._clearTimeout(), this.reloadNewVideoInfo(e, t, r, i, n, o);
    }, e.prototype.reloadNewVideoInfo = function(e, t, r, i, n, o) {
      if (this.trigger("error_hide"), this._options.source = "", e && (this._options.vid = e, this._options.accId = t, this._options.accessSecret = r, this._options.stsToken = i, this._options.domainRegion = o, this._options.authInfo = n), !(this._options.vid && this._options.accId && this._options.accessSecret && this._options.stsToken && this._options.domainRegion && this._options.authInfo)) throw new Error("\u9700\u8981\u63d0\u4f9bvid\u3001accId\u3001accessSecret\u3001stsToken\u3001domainRegion\u548cauthInfo\u53c2\u6570");
      this.log("STARTFETCHDATA", JSON.stringify({ it: "mps", pa: { vid: e } })), this.loadByMts(!0);
    }, t.exports = e;
  }, { "../../lib/constants": 216, "./mts": 280, "./saasplayer": 282 }],
  282: [function(e, t, r) {
    var d = e("../base/player"), i = e("../audio/audioplayer"), o = (e("../../lib/event"), e("../../lib/io")),
      f = e("../../lib/constants"), n = e("./signature"), a = e("./authkeyexpiredhandle"), p = e("../hls/hlsinjector"),
      y = e("../flv/flvinjector"), g = e("../drm/drminjector"), m = (e("../../lib/cookie"), e("../../lang/index")),
      b = e("../../lib/ua"), s = e("../../config"), _ = e("../../lib/playerutil"), v = e("../base/event/eventtype"),
      w = d.extend({
        init: function(e, t) {
          this._authKeyExpiredHandle = new a(this), d.prototype._videoCreateEl || (d.prototype._videoCreateEl = d.prototype.createEl), "mp3" == t.format ? (t.height = "auto", t.mediaType = "audio", d.prototype.createEl = i.prototype.createEl, i.call(this, e, t), w.prototype.play = d.prototype.play, w.prototype.pause = d.prototype.pause, w.prototype.initPlay = d.prototype.initPlay, w.prototype.replay = d.prototype.replay, w.prototype.stop = d.prototype.stop, w.prototype.seek = d.prototype.seek) : (d.prototype.createEl = d.prototype._videoCreateEl, t._native = !1, d.call(this, e, t));
        }
      });
    w.prototype.loadData = function(e, t) {
      var r, i, n;
      "undefined" != typeof _sce_r_skjhfnck || "" != e.format && "m3u8" != e.format && 1 != this._options.encryptType ? this._loadData(e, t) : (r = "aliplayer-vod-min.js", i = "", i = s.domain ? "https://" + s.domain + "/de/prismplayer/" + s.h5Version + "/hls/" + r : "/build/hls/" + r, n = this, o.loadJS(i, function() {
        n._loadData(e, t);
      }));
    }, w.prototype._loadData = function(s, l) {
      var u, c = (new Date).getTime(), h = this;
      this._urls = [], this._currentPlayIndex = 0, this._retrySwitchUrlCount = 0, this._authKeyExpiredHandle.clearTick(), "" != s.format && "m3u8" != s.format || 1 != this._options.encryptType ? s.rand = n.randomUUID() : (u = _sce_r_skjhfnck(), s.rand = _sce_lgtcaygl(u)), this._options.thumbnailUrl && (s.thumbnailUrl = this._options.thumbnailUrl), this.trigger(v.Private.H5_Loading_Show), this.service.getDataByAuthInfo(s, this._options.qualitySort, function(e) {
        if (e.urls && 0 == e.urls.length) h._mtsError_message(h, {
          Code: f.ErrorCode.URLsIsEmpty,
          Message: m.get("Error_Vod_URL_Is_Empty_Text") + (s.format ? "(format:" + s.format + ")" : "")
        }, ""); else {
          h.log("COMPLETEFETCHDATA", {
            cost: (new Date).getTime() - c, mi: JSON.stringify(function(e) {
              for (var t = [], r = 0; r < e.length; r++) t.push({
                width: e[r].width,
                height: e[r].height,
                definition: e[r].definition,
                format: e[r].format,
                encryptionType: e[r].encryptionType,
                duration: e[r].duration
              });
              return t;
            }(e.urls))
          }), h._urls = e.urls, h._urls.sort(function(e, t) {
            return e.bitrate - t.bitrate;
          }), h._currentPlayIndex = _.findSelectedStreamLevel(h._urls, s.defaultDefinition);
          var t = (r = e.urls[h._currentPlayIndex]).Url;
          if (h._vodDuration = r.duration || 0, h._options.source = t, h.encType = "", h.trigger(v.Private.PREPARE, r.definition), h.UI.cover && e.coverUrl && !h._options.cover && h.setCover(e.coverUrl), _.isHls(t)) if (console.log("saasplayer data.playInfoAry ---"), console.log("saasplayer data.playInfoAry", e.playInfoAry), e && 0 < e.playInfoAry.length && "Widevine-FairPlay" == e.playInfoAry[0].EncryptType) g.inject(h, w, d.prototype, h._options); else {
            if (e.encryptUrlArr && 0 < e.encryptUrlArr.length) for (var r, i, n = [], o = 0; o < e.encryptUrlArr.length; ++o) (r = e.encryptUrlArr[o]).encryptionType === f.EncryptionType.Private && (i = _sce_dlgtqred(u, r.rand, r.plaintext), n.push({
              url: r.Url,
              secData: i
            })); else if (ecData = "", r.encryptionType == f.EncryptionType.Private) {
              h.encType = r.encryptionType;
              var a = _.checkSecuritSupport();
              if (a) return void h._mtsError_message(h, {
                Code: f.ErrorCode.EncrptyVideoNotSupport,
                Message: a,
                display_msg: a
              }, "");
              n = _sce_dlgtqred(u, r.rand, r.plaintext);
            }
            p.inject(h, w, d, h._options, n);
          } else _.isFlv(t) ? y.inject(h, w, d, h._options) : _.isDash(t) ? (console.log("isDash"), g.inject(h, w, d, h._options)) : h._player._executeReadyCallback();
          h._authKeyExpiredHandle.tick(f.AuthKeyRefreshExpired), h.trigger(v.Private.SourceLoaded, r), h.initPlay(l), h.trigger(v.Private.ChangeURL), e.thumbnailUrl && h._thumbnailService.get(e.thumbnailUrl);
          a = h._player._isFlv, t = -1 < h._player.getOptions().source.indexOf("mp4");
          1 == h._player.encType || a || t || (b.IS_IOS || b.IS_MAC_SAFARI || b.IS_X5 || b.IS_EDGE) && h._player._executeReadyCallback();
        }
      }, function(e) {
        h._mtsError_message(h, e, "");
      });
    }, w.prototype._changeStream = function(e, t) {
      this._urls.length > e && (this.loadByUrl(this._urls[e].Url, this.getCurrentTime()), this._currentPlayIndex = e, this.trigger(v.Private.QualityChange, t || m.get("Quality_Change_Fail_Switch_Text")));
    }, w.prototype._getLowerQualityLevel = function() {
      if (0 == this._urls.length || -1 == this._currentPlayIndex) return "";
      if ("asc" == this.options().qualitySort) {
        if (0 < this._currentPlayIndex) return {
          item: this._urls[this._currentPlayIndex - 1],
          index: this._currentPlayIndex - 1
        };
      } else if (this._currentPlayIndex < this._urls.length - 1) return {
        item: this._urls[this._currentPlayIndex + 1],
        index: this._currentPlayIndex + 1
      };
      return "";
    }, w.prototype._mtsError_message = function(e, t, r) {
      var i = e;
      i.trigger(v.Private.H5_Loading_Hide);
      var n = t.Code || "OTHER_ERR_CODE", o = t.Message || "OTHER_ERR_MSG",
        a = (f.ErrorCode.ServerAPIError, t.display_msg || "");
      -1 < o.indexOf("InvalidParameter.Rand") || -1 < o.indexOf("\"Rand\" is not valid.") ? (f.ErrorCode.EncrptyVideoNotSupport, a = m.get("Error_Not_Support_encrypt_Text")) : -1 < o.indexOf("SecurityToken.Expired") ? (f.ErrorCode.AuthKeyExpired, a = m.get("Error_Playauth_Expired_Text")) : -1 < o.indexOf("InvalidVideo.NoneStream") && (f.ErrorCode.URLsIsEmpty, a = m.get("Error_Fetch_NotStream") + "(" + i._options.format + "|" + i._options.definition + ")");
      e = i._options.vid || "0", i._options.from, n = { mediaId: e, error_code: n, error_msg: o };
      t.sri && (n.sri = t.sri), i.logError(n), n.display_msg = (a || m.get("Error_Vod_Fetch_Urls_Text")) + "</br>" + o, i.trigger("error", n), console.log("PrismPlayer Error: " + r + "! error_msg :" + o + ";");
    }, t.exports = w;
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/cookie": 217,
    "../../lib/event": 220,
    "../../lib/io": 225,
    "../../lib/playerutil": 230,
    "../../lib/ua": 232,
    "../audio/audioplayer": 242,
    "../base/event/eventtype": 244,
    "../base/player": 263,
    "../drm/drminjector": 269,
    "../flv/flvinjector": 272,
    "../hls/hlsinjector": 274,
    "./authkeyexpiredhandle": 278,
    "./signature": 283
  }],
  283: [function(e, c, t) {
    var n = e("crypto-js/hmac-sha1"), o = e("crypto-js/enc-base64"), r = e("crypto-js/enc-utf8");
    c.exports.randomUUID = function() {
      for (var e = [], t = "0123456789abcdef", r = 0; r < 36; r++) e[r] = t.substr(Math.floor(16 * Math.random()), 1);
      return e[14] = "4", e[19] = t.substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-", e.join("");
    }, c.exports.returnUTCDate = function() {
      var e = new Date, t = e.getUTCFullYear(), r = e.getUTCMonth(), i = e.getUTCDate(), n = e.getUTCHours(),
        o = e.getUTCMinutes(), a = e.getUTCSeconds(), e = e.getUTCMilliseconds();
      return Date.UTC(t, r, i, n, o, a, e);
    }, c.exports.AliyunEncodeURI = function(e) {
      e = encodeURIComponent(e);
      return e = (e = (e = e.replace("+", "%2B")).replace("*", "%2A")).replace("%7E", "~");
    }, c.exports.makesort = function(e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      var i = [];
      for (s in e) i.push(s);
      for (var n = i.sort(), o = "", a = n.length, s = 0; s < a; s++) "" == o ? o = n[s] + t + e[n[s]] : o += r + n[s] + t + e[n[s]];
      return o;
    }, c.exports.makeUTF8sort = function(e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      var i = [];
      for (s in e) i.push(s);
      for (var n = i.sort(), o = "", a = n.length, s = 0; s < a; s++) {
        var l = c.exports.AliyunEncodeURI(n[s]), u = c.exports.AliyunEncodeURI(e[n[s]]);
        "" == o ? o = l + t + u : o += r + l + t + u;
      }
      return o;
    }, c.exports.makeChangeSiga = function(e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      return o.stringify(n((r = r || "GET") + "&" + c.exports.AliyunEncodeURI("/") + "&" + c.exports.AliyunEncodeURI(c.exports.makeUTF8sort(e, "=", "&")), t + "&"));
    }, c.exports.ISODateString = function(e) {
      function t(e) {
        return e < 10 ? "0" + e : e;
      }

      return e.getUTCFullYear() + "-" + t(e.getUTCMonth() + 1) + "-" + t(e.getUTCDate()) + "T" + t(e.getUTCHours()) + ":" + t(e.getUTCMinutes()) + ":" + t(e.getUTCSeconds()) + "Z";
    }, c.exports.encPlayAuth = function(e) {
      if (!(e = r.stringify(o.parse(e)))) throw new Error("playuth\u53c2\u6570\u89e3\u6790\u4e3a\u7a7a");
      return JSON.parse(e);
    }, c.exports.encRsa = function() {
    }, c.exports.stringToArray = function(e) {
      for (var t = new ArrayBuffer(2 * e.length), r = new Uint16Array(t), i = 0, n = e.length; i < n; i++) r[i] = e.charCodeAt(i);
      return r;
    }, c.exports.Uint8ArrayToString = function(e) {
      for (var t = "", r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
      return t;
    }, c.exports.arrayToString = function(e) {
      e = new Uint16Array(e.buffer);
      return String.fromCharCode.apply(null, e);
    }, c.exports.base64DecodeUint8Array = function(e) {
      var t = window.atob(e), r = t.length, n = new Uint8Array(new ArrayBuffer(r));
      for (i = 0; i < r; i++) n[i] = t.charCodeAt(i);
      return n;
    }, c.exports.base64EncodeUint8Array = function(e) {
      for (var t, r, i, n, o, a, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", l = "", u = 0; u < e.length;) i = (a = e[u++]) >> 2, n = (3 & a) << 4 | (t = u < e.length ? e[u++] : Number.NaN) >> 4, o = (15 & t) << 2 | (r = u < e.length ? e[u++] : Number.NaN) >> 6, a = 63 & r, isNaN(t) ? o = a = 64 : isNaN(r) && (a = 64), l += s.charAt(i) + s.charAt(n) + s.charAt(o) + s.charAt(a);
      return l;
    };
  }, { "crypto-js/enc-base64": 75, "crypto-js/enc-utf8": 76, "crypto-js/hmac-sha1": 77 }],
  284: [function(e, t, r) {
    var o = e("../../lib/io"), a = e("../../lib/constants"), s = e("./signature"), l = e("./util"),
      u = e("../../lang/index");
    t.exports.getPlayAuth = function(e, t, r, i) {
      s.randomUUID();
      var n = s.randomUUID(), n = {
          AccessKeyId: e.accessKeyId,
          Action: "GetVideoPlayAuth",
          VideoId: e.vid,
          AuthTimeout: a.AuthInfoExpired,
          SecurityToken: e.securityToken,
          Format: "JSON",
          Version: "2017-03-21",
          SignatureMethod: "HMAC-SHA1",
          SignatureVersion: "1.0",
          SignatureNonce: n
        }, n = s.makeUTF8sort(n, "=", "&") + "&Signature=" + s.AliyunEncodeURI(s.makeChangeSiga(n, e.accessKeySecret)),
        n = "https://vod." + e.region + ".aliyuncs.com/?" + n;
      o.get(n, function(e) {
        e ? (e = JSON.parse(e), t && t(e.PlayAuth)) : r && r(l.createError("\u83b7\u53d6\u89c6\u9891\u64ad\u653e\u51ed\u8bc1\u5931\u8d25"));
      }, function(e) {
        if (r) {
          var t = { Code: "", Message: u.get("Fetch_Playauth_Error") };
          try {
            (t = JSON.parse(e)).Code;
          } catch (e) {
          }
          r({
            Code: a.ErrorCode.ServerAPIError,
            Message: t.Code + "|" + t.Message,
            sri: t.requestId,
            display_msg: u.get("Fetch_Playauth_Error", i)
          });
        }
      });
    };
  }, { "../../lang/index": 212, "../../lib/constants": 216, "../../lib/io": 225, "./signature": 283, "./util": 285 }],
  285: [function(e, t, r) {
    t.exports.createError = function(e, t) {
      return { requestId: "", code: t || "", message: e };
    };
  }, {}],
  286: [function(e, t, r) {
    var i = e("../../lib/io"), h = e("../../lib/constants"), n = e("./signature"), d = e("./util"),
      o = e("../../config"), a = e("../../lang/index");

    function f(e, t) {
      for (var r = [], i = [], n = [], o = [], a = e.length - 1; 0 <= a; a--) {
        var s = e[a],
          l = (l = void 0, (l = {}).width = (s = s).Width, l.height = s.Height, l.definition = s.Definition, l.Url = s.PlayURL, l.format = s.Format, l.desc = h.QualityLevels[l.definition], l.encryptionType = h.VodEncryptionType[s.EncryptType], l.plaintext = s.Plaintext, l.rand = s.Rand, l.encrypt = s.Encrypt, l.duration = s.Duration, l.bitrate = s.Bitrate, l);
        ("mp4" == l.format ? i : "mp3" == l.format ? n : "m3u8" == l.format ? r : o).push(l);
      }
      var u = [], u = 0 < n.length ? n : 0 < i.length ? i : 0 < r.length ? r : o;
      return "asc" == t && u.reverse(), u;
    }

    t.exports.getDataByAuthInfo = function(s, l, u, c) {
      n.randomUUID();
      var e = n.randomUUID(), e = {
        AccessKeyId: s.accessId,
        Action: "GetPlayInfo",
        VideoId: s.vid,
        Formats: s.format,
        AuthTimeout: s.authTimeout || h.AuthKeyExpired,
        Rand: s.rand,
        SecurityToken: s.stsToken,
        StreamType: s.mediaType,
        Format: "JSON",
        Version: "2017-03-21",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        SignatureNonce: e,
        PlayerVersion: o.h5Version,
        Channel: "HTML5"
      };
      "AUTO" === s.definition ? e.ResultType = "Multiple" : s.definition && (e.Definition = s.definition), s.authInfo && (e.AuthInfo = s.authInfo), s.outputType && (e.OutputType = s.outputType), s.playConfig && (e.PlayConfig = JSON.stringify(s.playConfig)), s.reAuthInfo && (e.ReAuthInfo = JSON.stringify(s.reAuthInfo)), e = n.makeUTF8sort(e, "=", "&") + "&Signature=" + n.AliyunEncodeURI(n.makeChangeSiga(e, s.accessSecret)), e = "https://vod." + s.domainRegion + ".aliyuncs.com/?" + e, i.get(e, function(e) {
        if (e) {
          var t = JSON.parse(e), r = "", e = t.VideoBase.ThumbnailList;
          e && e.Thumbnail && 0 < e.Thumbnail.length ? r = e.Thumbnail[0].URL : s.thumbnailUrl && (r = String(s.thumbnailUrl));
          for (var i = t.PlayInfoList.PlayInfo, n = [], o = [], a = i.length - 1; 0 <= a; --a) "AUTO" === i[a].Definition ? n = [i.splice(a, 1)[0]] : 1 === i[a].Encrypt && o.push(i[a]);
          e = null, o = 0 === n.length ? (e = f(i, l), []) : (e = f(n), f(o));
          e && u && u({
            requestId: t.RequestId,
            urls: e,
            encryptUrlArr: o,
            thumbnailUrl: r,
            coverUrl: t.VideoBase.CoverURL,
            playInfoAry: i
          });
        } else c && c(d.createError("\u70b9\u64ad\u670d\u52a1\u83b7\u53d6\u53d6\u6570\u5931\u8d25"));
      }, function(e) {
        if (c) {
          var t = { Code: "", Message: a.get("Error_Vod_Fetch_Urls_Text") };
          try {
            t = JSON.parse(e);
          } catch (e) {
          }
          c({ Code: h.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || "" });
        }
      });
    };
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/io": 225,
    "./signature": 283,
    "./util": 285
  }],
  287: [function(e, t, r) {
    var i = e("./saasplayer"), l = e("../../lib/constants"), n = e("./vod"), u = e("./signature"),
      e = (e("./authkeyexpiredhandle"), e("./ststoken"), i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.service = n, this.loadByVod();
        }
      }));
    e.prototype.loadByVod = function(e) {
      var t = "", r = "", i = "", n = "", o = "";
      if (this._options.accessKeyId && this._options.accessKeySecret) t = this._options.accessKeyId, r = this._options.accessKeySecret, i = this._options.securityToken, n = this._options.region, this.log("STARTFETCHDATA", JSON.stringify({
        it: "sts",
        pa: { vid: this._options.vid }
      })); else {
        try {
          var a = u.encPlayAuth(this._options.playauth), t = a.AccessKeyId, r = a.AccessKeySecret, i = a.SecurityToken,
            n = a.Region, o = a.AuthInfo;
        } catch (e) {
          var s = {
            Code: l.ErrorCode.PlayauthDecode,
            Message: "playauth decoded failed.",
            displayMessage: "playauth\u89e3\u6790\u9519\u8bef"
          };
          return void this._mtsError_message(this, s, this._options.playauth);
        }
        this._options.from = a.CustomerId || "", this.log("STARTFETCHDATA", JSON.stringify({
          it: "playAuth",
          pa: { vid: this._options.vid }
        }));
      }
      this._loadByVodBySTS(t, r, i, n, o, e);
    }, e.prototype.replayByVidAndPlayAuth = function(e, t) {
      this.trigger("error_hide"), this._options.source = "", this._options.vid = e, this._options.playauth = t, this._isError = !1, this._duration = 0, this._options.cover = "", this._vodRetryCount = 0, this._clearTimeout(), this.loadByVod(!0);
    }, e.prototype.updateSourcesByVidAndPlayAuth = function(e, t) {
      if (e == this._options.vid) {
        this._options.vid = e, this._options.playauth = t;
        try {
          var r = u.encPlayAuth(this._options.playauth);
        } catch (e) {
          return void console.log("playauth\u89e3\u6790\u9519\u8bef");
        }
        r = {
          vid: e,
          accessId: r.AccessKeyId,
          accessSecret: r.AccessKeySecret,
          stsToken: r.SecurityToken,
          domainRegion: r.Region,
          authInfo: r.AuthInfo,
          playDomain: r.PlayDomain,
          format: this._options.format,
          mediaType: this._options.mediaType
        };
        this._authKeyExpiredHandle.clearTick();
        var i = this;
        this.service.loadData(r, this._options.qualitySort, function(e) {
          i._serverRequestId = e.requestId, 0 != e.urls.length && (i._urls = e.urls), i._authKeyExpiredHandle.tick(l.AuthKeyRefreshExpired);
        }, function(e) {
          console.log(e);
        });
      } else console.log("\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4");
    }, e.prototype.reloaduserPlayInfoAndVidRequestMts = function(e, t) {
      this.replayByVidAndPlayAuth(e, t, accessSecret);
    }, e.prototype._loadByVodBySTS = function(e, t, r, i, n, o) {
      i = {
        vid: this._options.vid,
        accessId: e,
        accessSecret: t,
        stsToken: r,
        authInfo: n,
        domainRegion: i,
        format: this._options.format,
        mediaType: this._options.mediaType,
        definition: this._options.definition,
        defaultDefinition: this._options.defaultDefinition,
        authTimeout: this._options.authTimeout,
        outputType: this._options.outputType,
        playConfig: this._options.playConfig,
        reAuthInfo: this._options.reAuthInfo
      };
      this.loadData(i, o);
    }, t.exports = e;
  }, {
    "../../lib/constants": 216,
    "./authkeyexpiredhandle": 278,
    "./saasplayer": 282,
    "./signature": 283,
    "./ststoken": 284,
    "./vod": 286
  }],
  288: [function(e, t, r) {
    var i = e("../base/event/eventtype"), e = function(t) {
      this._player = t, this._video = t.tag;
      var r = this;
      this._isCreated = !1, this._canPlayTriggered = !1, this._defaultTrack = "", t.on(i.Private.ChangeURL, function() {
        r._isCreated = !1, r._canPlayTriggered = !1, r._defaultTrack = "";
      }), t.on(i.Player.CanPlay, function() {
        var e;
        r._player._drm || r._canPlayTriggered || ((e = r._getTracks()) && (r._isCreated = !0, t.trigger(i.Player.AudioTrackReady, e), r._notifyDefaultValue(e)), r._canPlayTriggered = !0);
      }), t.on(i.Player.AudioTrackUpdated, function(e) {
        r._isCreated || (e = r._getTracks(e.paramData.audioTracks)) && (r._isCreated = !0, t.trigger(i.Player.AudioTrackReady, e), r._notifyDefaultValue(e));
      });
    };
    e.prototype._notifyDefaultValue = function(e) {
      !this._defaultTrack && 0 < e.length && (this._defaultTrack = e[0]), this._defaultTrack && this._player.trigger(i.Private.SelectorUpdateList, {
        type: "audio",
        text: this._defaultTrack.text
      });
    }, e.prototype.support = function() {
      return !!this._video.audioTracks;
    }, e.prototype._getTracks = function(e) {
      if (!this.support() && !e) return null;
      for (var t = [], r = (e = this._video && this._video.audioTracks && (!e || e && 0 == e.length) ? this._video.audioTracks : e) ? e.length : 0, i = 0; i < r; i++) {
        var n = e[i], o = { value: n.id, text: n.label || n.name || n.language };
        (n["default"] || n.enabled) && (this._defaultTrack = o), t.push(o);
      }
      return t;
    }, e.prototype["switch"] = function(e) {
      if (this._player._hls) this._player._hls.audioTrack = +e; else for (var t = this._video.audioTracks ? this._video.audioTracks.length : 0, r = 0; r < t; r++) {
        var i = this._video.audioTracks[r];
        i.id == e ? i.enabled = !0 : i.enabled = !1;
      }
    }, e.prototype.dispose = function() {
      this._player = null;
    }, t.exports = e;
  }, { "../base/event/eventtype": 244 }],
  289: [function(e, t, r) {
    var i = e("../base/event/eventtype"), n = e("../../lib/dom"), o = e("../../lib/ua"), l = e("../../lib/cookie"),
      u = e("../../lib/constants"), e = function(e) {
        this._video = e.tag, this._player = e, this._isCreated = !1, this._backupCC = "", this.tracks = [], this._defaultTrack = "", this._currentValue = "";
        var t = this;
        e.on(i.Private.ChangeURL, function() {
          t._disabledTracks(), t._isCreated = !1, t._defaultTrack = "";
        }), e.on(i.Player.CanPlay, function() {
          t._player._drm || (t._isCreated || (t.tracks = t._getTracks(), e.trigger(i.Player.TextTrackReady, t.tracks)), t._isCreated && !t._player._setDefaultCC || !t._defaultTrack || (e.trigger(i.Private.SelectorUpdateList, {
            type: "cc",
            text: t._defaultTrack.text
          }), t["switch"](t._defaultTrack.value), t._player._setDefaultCC = !1, t._isCreated = !0));
        }), this._adaptiveCueStype(), e.on(i.Player.RequestFullScreen, function() {
          t._adaptiveCueStype();
        }), e.on(i.Player.CancelFullScreen, function() {
          t._adaptiveCueStype();
        });
      };
    e.prototype._adaptiveCueStype = function() {
      var e, t = -10;
      o.IS_SAFARI ? (t = -65, (e = this._player.fullscreenService) && e.getIsFullScreen() && (t = -95)) : o.IS_MOBILE && (t = -30), n.addCssByStyle("video::-webkit-media-text-track-container{transform: translateY(" + t + "px) !important;}");
    }, e.prototype.close = function() {
      for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) {
        var r = this._video.textTracks[t];
        "expired" != r.mode && ("showing" == r.mode && (this._backupCC = r), r.mode = "disabled");
      }
    }, e.prototype.open = function() {
      if (this.tracks && !(this.tracks.length < 2)) {
        var e = this._backupCC ? this._backupCC.language : "", t = this._backupCC ? this._backupCC.label : "";
        return e || (e = this.tracks[1].value, t = this.tracks[1].text), this["switch"](e), t;
      }
    }, e.prototype.getCurrentSubtitle = function() {
      return this._currentValue;
    }, e.prototype._getTracks = function() {
      if (this._player._drm) return [];
      var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
      this._defaultTrack = { value: "off", text: "Off" };
      for (var t = [this._defaultTrack], r = l.get(u.SelectedCC), i = "", n = !1, o = 0; o < e; o++) {
        var a, s = this._video.textTracks[o];
        "expired" != s.mode && "subtitles" == s.kind && (a = {
          value: s.language,
          text: s.label
        }, s["default"] && (this._defaultTrack = a, n = !0), a.value == r && (i = a), t.push(a));
      }
      return !n && i && (this._defaultTrack = i), t;
    }, e.prototype._disabledTracks = function() {
      for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) this._video.textTracks[t].mode = "expired";
    }, e.prototype["switch"] = function(e) {
      if (this.close(), "off" != e) {
        for (var t = this._video && this._video.textTracks ? this._video.textTracks.length : 0, r = 0; r < t; r++) {
          var i = this._video.textTracks[r];
          i.language === e && "expired" != i.mode && (this._video.textTracks[r].mode = "showing");
        }
        this._currentValue = e;
      } else this.close();
    }, e.prototype.dispose = function() {
      this._player = null;
    }, t.exports = e;
  }, {
    "../../lib/constants": 216,
    "../../lib/cookie": 217,
    "../../lib/dom": 219,
    "../../lib/ua": 232,
    "../base/event/eventtype": 244
  }],
  290: [function(e, t, r) {
    var i = e("../../lib/playerutil");
    t.exports = [{ service: e("./ccservice"), name: "_ccService", condition: !0 }, {
      service: e("./audiotrackservice"),
      name: "_audioTrackService"
    }, { service: e("./qualityservice"), name: "_qualityService" }, {
      service: e("./fullscreenservice"),
      name: "fullscreenService",
      condition: function() {
        return !0;
      }
    }, {
      service: e("./liveshiftservice"), name: "_liveshiftService", condition: function() {
        var e = this.options();
        return i.isLiveShift(e);
      }
    }, {
      service: e("./thumbnailservice"), name: "_thumbnailService", condition: function() {
        return !0;
      }
    }, {
      service: e("./progressmarkerservice"), name: "_progressMarkerService", condition: function() {
        return !0;
      }
    }];
  }, {
    "../../lib/playerutil": 230,
    "./audiotrackservice": 288,
    "./ccservice": 289,
    "./fullscreenservice": 291,
    "./liveshiftservice": 292,
    "./progressmarkerservice": 293,
    "./qualityservice": 294,
    "./thumbnailservice": 295
  }],
  291: [function(e, t, r) {
    var n = e("../../lib/ua"), o = e("../../lib/dom"), a = e("../../lib/event"), s = e("../base/event/eventtype"),
      i = e("../base/x5play"), l = e("../../lang/index"), u = function() {
        o.createEl("div");
        var e = {},
          t = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror", "fullScreen"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitfullScreen"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitIsFullScreen"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror", "mozFullScreen"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError", "MSFullScreen"]],
          r = !1;
        if (n.IS_IOS && (e.requestFn = "webkitEnterFullscreen", e.cancelFn = "webkitExitFullscreen", e.fullscreenElement = "webkitFullscreenElement", e.eventName = "webkitfullscreenchange", e.isFullScreen = "webkitDisplayingFullscreen", document[e.requestFn] && (r = !0)), !r) {
          for (var i = 0; i < 5; i++) if (t[i][1] in document) {
            e.requestFn = t[i][0], e.cancelFn = t[i][1], e.fullscreenElement = t[i][2], e.eventName = t[i][4], e.isFullScreen = t[i][6];
            break;
          }
          "requestFullscreen" in document ? e.requestFn = "requestFullscreen" : "webkitRequestFullscreen" in document ? e.requestFn = "webkitRequestFullscreen" : "webkitRequestFullScreen" in document ? e.requestFn = "webkitRequestFullScreen" : "webkitEnterFullscreen" in document ? e.requestFn = "webkitEnterFullscreen" : "mozRequestFullScreen" in document ? e.requestFn = "mozRequestFullScreen" : "msRequestFullscreen" in document && (e.requestFn = "msRequestFullscreen"), "fullscreenchange" in document ? e.eventName = "fullscreenchange" : "webkitfullscreenchange" in document || "webkitfullscreenchange" in document || "webkitfullscreenchange" in document ? e.eventName = "webkitfullscreenchange" : "mozfullscreenchange" in document ? e.eventName = "mozfullscreenchange" : "MSFullscreenChange" in document && (e.eventName = "MSFullscreenChange"), "fullScreen" in document ? e.isFullScreen = "fullScreen" : "webkitfullScreen" in document ? e.isFullScreen = "webkitfullScreen" : "webkitIsFullScreen" in document ? e.isFullScreen = "webkitIsFullScreen" : "webkitDisplayingFullscreen" in document ? e.isFullScreen = "webkitDisplayingFullscreen" : "mozFullScreen" in document ? e.isFullScreen = "mozFullScreen" : "mozfullScreen" in document ? e.isFullScreen = "mozfullScreen" : "MSFullScreen" in document && (e.isFullScreen = "MSFullScreen"), "fullscreenElement" in document ? e.fullscreenElement = "fullscreenElement" : "webkitFullscreenElement" in document ? e.fullscreenElement = "webkitFullscreenElement" : "webkitFullScreenElement" in document ? e.fullscreenElement = "webkitFullScreenElement" : "mozFullScreenElement" in document ? e.fullscreenElement = "mozFullScreenElement" : "msFullscreenElement" in document ? e.fullscreenElement = "msFullscreenElement" : "MSFullscreenElement" in document && (e.fullscreenElement = "MSFullscreenElement");
        }
        return e.requestFn ? e : null;
      }(), e = function(e) {
        this.isFullWindow = !1, this.isFullScreen = !1, this.isFullScreenChanged = !1, this._requestFullScreenTimer = null, this._cancelFullScreenTimer = null, this._player = e;
        var r = this, i = u;
        this._fullscreenChanged = function(e) {
          var t;
          null != r._player && (void 0 !== (t = document[i.isFullScreen]) ? r.isFullScreen = t : (t = document[i.fullscreenElement], r.isFullScreen = null != t), (r.isFullScreenChanged = !0) === r.isFullScreen ? r._player.trigger(s.Player.RequestFullScreen) : r._player.trigger(s.Player.CancelFullScreen));
        }, i && a.on(document, i.eventName, this._fullscreenChanged);
      };
    e.prototype.requestFullScreen = function() {
      if (!i.isAndroidX5() || !this._player.paused()) {
        var e = u, t = this._player.el(), r = this;
        if (n.IS_IOS) {
          t = this._player.tag;
          try {
            t[e.requestFn](), r._player.trigger(s.Player.RequestFullScreen);
          } catch (e) {
            console.log(e);
          }
          return this;
        }
        this.isFullScreen = !0, this.isFullScreenChanged = !1, this._requestFullScreenTimer = null, this._cancelFullScreenTimer || clearTimeout(this._cancelFullScreenTimer);
        r = this;
        if (e && !this._player._options.enableMockFullscreen) try {
          t[e.requestFn](), this._requestFullScreenTimer = setTimeout(function() {
            r.isFullScreenChanged || (c.apply(r), r._player.trigger(s.Player.RequestFullScreen)), r._requestFullScreenTimer = null;
          }, 1e3);
        } catch (e) {
          console.log(e);
        } else c.apply(r), this._player.trigger(s.Player.RequestFullScreen);
        return this._player;
      }
      this._player.trigger(s.Private.Info_Show, l.get("Play_Before_Fullscreen"));
    }, e.prototype.cancelFullScreen = function() {
      var e = u;
      this.isFullScreen = !1, this.isFullScreenChanged = !1, this._cancelFullScreenTimer = null, this._requestFullScreenTimer || clearTimeout(this._requestFullScreenTimer);
      var t = this;
      if (e && !this._player._options.enableMockFullscreen) {
        try {
          document[e.cancelFn]();
        } catch (e) {
          console.log(e);
        }
        t._cancelFullScreenTimer = setTimeout(function() {
          t.isFullScreenChanged || (h.apply(t), t._player.trigger(s.Player.CancelFullScreen)), t._cancelFullScreenTimer = null;
        }, 500), this._player.tag.paused || this._player.trigger(s.Player.Play);
      } else h.apply(t), this._player.trigger(s.Player.CancelFullScreen), this._player.tag.paused || this._player.trigger(s.Player.Play);
      return this._player;
    }, e.prototype.getIsFullScreen = function() {
      return this.isFullScreen;
    }, e.prototype.dispose = function() {
      this._player = null;
      u && a.off(document, u.eventName, this._fullscreenChanged);
    };
    var c = function() {
      this.isFullWindow = !0, this.docOrigOverflow = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", o.addClass(document.getElementsByTagName("body")[0], "prism-full-window");
    }, h = function() {
      this.isFullWindow = !1, document.documentElement.style.overflow = this.docOrigOverflow, o.removeClass(document.getElementsByTagName("body")[0], "prism-full-window");
    };
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/ua": 232,
    "../base/event/eventtype": 244,
    "../base/x5play": 268
  }],
  292: [function(e, t, r) {
    function n(e, t) {
      if (e && e) {
        var r = new Date(e), e = new Date(t), t = e.valueOf() / 1e3 - r.valueOf() / 1e3;
        return { start: r, end: e, endDisplay: i.extractTime(e), totalTime: t };
      }
    }

    function o(e, t) {
      t && (e.currentTimestamp = t, e.currentTime = i.convertToDate(t), e.currentTimeDisplay = i.extractTime(e.currentTime), e.liveShiftStart = e.liveTimeRange.start, e.liveShiftEnd = e.liveTimeRange.end, e.liveShiftStartDisplay = i.extractTime(e.liveShiftStart), e.liveShiftEndDisplay = i.extractTime(e.liveShiftEnd), e.availableLiveShiftTime = t - e.liveShiftStart.valueOf() / 1e3, e.timestampStart = i.convertToTimestamp(e.liveShiftStart), e.timestampEnd, i.convertToTimestamp(e.liveShiftEnd));
    }

    var a = e("../../lib/io"), i = e("../../lib/util"), s = e("../../lib/playerUtil"), l = e("../../lang/index"),
      u = (e("../flv/flvinjector"), e("../hls/hlsinjector")), c = e("../../lib/constants"),
      h = e("../base/event/eventtype"), e = (e("../../lib/url"), function(t) {
        this._player = t, this._isLiveShift = !1;

        function e() {
          var e = t._options.source;
          this._originalPlayUrl = e, this._liveShiftUrl = t._options.liveTimeShiftUrl, this.liveTimeRange = n(t._options.liveStartTime, t._options.liveOverTime), this.availableLiveShiftTime = 0, this.seekTime = -1;
        }

        var i = this;
        e.call(this), t.liveShiftSerivce = {
          setLiveTimeRange: function(e, t) {
            i.setLiveTimeRange(e, t);
          }, queryLiveShift: function(e, t, r) {
            i.queryLiveShift(e, t, r);
          }
        }, t.on(h.Private.ChangeURL, function() {
          e.call(i);
        });
      });
    e.prototype.validate = function() {
      return !(this.liveTimeRange.start >= this.liveTimeRange.end);
    }, e.prototype.switchToLive = function() {
      var e = this._player._options.recreatePlayer;
      e && this._isLiveShift && (this._player.dispose(), setTimeout(function() {
        e();
      }, 1e3), this._isLiveShift = !1);
    }, e.prototype.getBaseTime = function() {
      this.liveShiftStartDisplay;
      return -1 == this.seekTime ? i.parseTime(this.currentTimeDisplay) : i.parseTime(this.liveShiftStartDisplay) + this.seekTime;
    }, e.prototype.getSourceUrl = function(e, t) {
      var r = this._originalPlayUrl;
      return this.availableLiveShiftTime <= e ? r : (this._isLiveShift = !0, (e = parseInt(e)) <= 5 && (e = 5), r = -1 == (r = (r = this._switchLiveShiftPlayer(t)) && r.replace("lhs_offset_unix_s_0", "z")).indexOf("?") ? r + "?lhs_offset_unix_s_0=" + e : r + "&lhs_offset_unix_s_0=" + e);
    }, e.prototype._switchLiveShiftPlayer = function(e) {
      var t = this._originalPlayUrl, r = this._player._options.liveShiftSource, i = this._player._options.source;
      if (s.isHls(i)) t = i; else if (s.isFlv(t) && r && s.isHls(r)) {
        this._player._flv && this._player._destroyFlv();
        var n = this._player._superType, i = this._player._Type;
        return this._player._options._autoplay = !0, u.inject(this._player, i, n, this._player._options, "", !0), r;
      }
      return t;
    }, e.prototype.getTimeline = function(t, i) {
      if (this._player.trigger(h.Private.LiveShiftQueryCompleted), !this._liveShiftUrl) return o(this, (new Date).valueOf() / 1e3), void (t && t());
      var r = this;
      this.queryLiveShift(this._liveShiftUrl, function(e) {
        e ? 0 == (e = e).retCode ? (o(r, e.content.current), t && t()) : i({
          Code: c.ErrorCode.ServerAPIError,
          Message: e.retCode + "|" + e.description + "|" + e.content
        }) : console.log("\u83b7\u53d6\u76f4\u64ad\u65f6\u79fb\u6570\u636e\u5931\u8d25");
      }, function(e) {
        if (i && e) {
          var t = {};
          if (e) {
            if (-1 < e.indexOf("403 Forbidden")) t.Code = c.ErrorCode.AuthKeyExpired, t.Message = "Query liveshift failed:" + l.get("Error_AuthKey_Text"); else {
              var r, t = e;
              try {
                r = JSON.parse(e);
              } catch (e) {
              }
              r && (t.Code = c.ErrorCode.ServerAPIError, t.Message = r.retCode + "|" + r.description + "|" + r.content);
            }
            i(t);
          }
        }
      });
    }, e.prototype.start = function(e, t) {
      var r = this, i = function() {
        r._loopHandler = setTimeout(function() {
          r.getTimeline(function() {
          }, t), i();
        }, e);
      };
      r.getTimeline(function(e) {
        r._localLiveTimeHandler || r.tickLocalLiveTime();
      }, t), i();
    }, e.prototype.tickLocalLiveTime = function() {
      var e = this, t = function() {
        e._localLiveTimeHandler = setTimeout(function() {
          e.currentTimestamp++, o(e, e.currentTimestamp), e._player.trigger(h.Private.LiveShiftQueryCompleted), t();
        }, 1e3);
      };
      t();
    }, e.prototype.setLiveTimeRange = function(e, t) {
      e = e || this._player._options.liveStartTime, t = t || this._player._options.liveOverTime, this.liveTimeRange = n(e, t), o(this, this.currentTimestamp), this._player.trigger(h.Private.LiveShiftQueryCompleted);
    }, e.prototype.queryLiveShift = function(e, r, i) {
      a.get(e, function(e) {
        var t;
        e ? 0 == (t = JSON.parse(e)).retCode ? r && r(t) : i && i(t) : i && i(e);
      }, function(e) {
        i && i(e);
      });
    }, e.prototype.stop = function(e) {
      this._loopHandler && (clearTimeout(this._loopHandler), this._loopHandler = null);
    }, e.prototype.dispose = function() {
      this.stop(), this._localLiveTimeHandler && (clearTimeout(this._localLiveTimeHandler), this._localLiveTimeHandler = null), this._player = null;
    }, t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/io": 225,
    "../../lib/playerUtil": 229,
    "../../lib/url": 233,
    "../../lib/util": 234,
    "../base/event/eventtype": 244,
    "../flv/flvinjector": 272,
    "../hls/hlsinjector": 274
  }],
  293: [function(e, t, r) {
    var l = e("../base/event/eventtype"),
      u = (e("../../lang/index"), e("../../lib/hls/hlsparse"), e("../../lib/object"), e("../../lib/dom")),
      c = e("../../lib/event"), e = (e("../../lib/playerutil"), function(a) {
        this.progressMarkers = [], this._player = a;
        var s = this;
        a.on(l.Private.ProgressMarkerLoaded, function(e) {
          e = e.paramData;
          e && 0 < e.length && (s.progressMarkers = e);
        });

        function t() {
          var e = document.querySelector("#" + a.id() + " .prism-progress-marker");
          if (e) {
            e.innerHTML = "";
            var o = s._player.getDuration();
            if (0 < o) {
              for (var t = 0; t < s.progressMarkers.length; t++) {
                var r, i = s.progressMarkers[t];
                void 0 !== i.offset && "" !== i.offset && (r = document.createElement("div"), u.addClass(r, "prism-marker-dot"), i = s.progressMarkers[t].offset / o, r.style.left = 100 * i + "%", e.appendChild(r), i = function(e, t) {
                  return function() {
                    s._player.trigger(l.Private.MarkerTextShow, { left: e, progressMarker: t });
                  };
                }(i, s.progressMarkers[t]), c.on(r, "mouseover", i), c.on(r, "mouseout", function(e) {
                  s._player.trigger(l.Private.MarkerTextHide);
                }), c.on(r, "touchstart", i), c.on(r, "mousemove", function(e) {
                  e.preventDefault();
                }), c.on(r, "touchmove", function(e) {
                  e.preventDefault();
                }));
              }
              var n = document.querySelector("#" + s._player.id() + " .prism-progress-cursor");
              s._player.on(n, "click", function(e) {
                for (var t = s._player.getCurrentTime(), r = 0; r < s.progressMarkers.length; r++) {
                  var i, n = s.progressMarkers[r];
                  n && t - 1 < n.offset && n.offset < t + 1 && (i = n.offset / o * 100 + "%", s._player.trigger(l.Private.MarkerTextShow, {
                    left: i,
                    progressMarker: n
                  }));
                }
              });
            }
          }
        }

        a.on(l.Private.ProgressMarkerChanged, function(e) {
          e = e.paramData;
          e && 0 < e.length && (s.progressMarkers = e, t());
        }), a.on(l.Video.LoadedMetadata, t);
      });
    e.prototype.dispose = function() {
      this._player = null, this.progressMarkers = [];
    }, t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/hls/hlsparse": 224,
    "../../lib/object": 227,
    "../../lib/playerutil": 230,
    "../base/event/eventtype": 244
  }],
  294: [function(e, t, r) {
    var s = e("../base/event/eventtype"), l = e("../../lang/index"), i = e("../../lib/hls/hlsparse"),
      u = e("../../lib/object"), n = e("../../lib/playerutil"), e = function(o) {
        this.levels = [], this._player = o;
        var a = this;
        o.on(s.Player.LevelsLoaded, function(e) {
          if (0 < a.levels.length && (a.levels = []), (e = e.paramData) && e.levels) {
            for (var t, r = e.levels.length - 1; -1 < r; r--) {
              var i, n = e.levels[r];
              n.url && 0 < n.url.length && n.attrs && n.attrs.BANDWIDTH && (i = n.url, n = {
                Url: i = u.isArray(i) ? i[0] : i,
                desc: n.height || n.width,
                bitrate: n.bitrate,
                resolution: n.attrs.RESOLUTION,
                bandwidth: n.attrs.BANDWIDTH
              }, a.levels.push(n));
            }
            "AUTO" === o._options.definition && (o._urls = [], Object.assign(o._urls, this.levels)), 0 < a.levels.length && (t = "", this._player._options.isMoreBitrate && (t = l.get("Auto")), a.levels.push({
              Url: e.url,
              desc: t
            }), o.trigger(s.Private.SelectorUpdateList, { type: "quality", text: t }));
          }
        }), o.on(s.Video.LoadStart, function() {
          var e;
          o._options && (e = o._options.source, !o._hls && e && n.isHls(e) && a.loadLevels(e));
        });
      };
    (e.prototype = {
      loadLevels: function(e) {
        var t = new i, r = this;
        t.load(e, function(e) {
          r._player.trigger(s.Player.LevelsLoaded, e);
        });
      }
    }).dispose = function() {
      this._player = null;
    }, t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/hls/hlsparse": 224,
    "../../lib/object": 227,
    "../../lib/playerutil": 230,
    "../base/event/eventtype": 244
  }],
  295: [function(e, t, r) {
    var n = e("../../lib/io"), o = e("../../lib/url"), a = e("../../lib/vtt/thumbnailvtt"),
      s = e("../base/event/eventtype"), e = function(e) {
        this._player = e, this.cues = [], this.baseUrl = "";
        var t = this;
        e.on(s.Private.ChangeURL, function() {
          t.cues = [], t.baseUrl = "";
        });
      };
    (e.prototype = {
      get: function(e) {
        var t, r, i = this;
        this.baseUrl = (t = e, !(r = o.parseUrl(t)) || (r = r.segments) && 0 < r.length && (r = r[r.length - 1], baseUrl = t.replace(r, "")), baseUrl), n.get(e, function(e) {
          e && a.parse(e, function(e) {
            i.cues = e, i._player.trigger(s.Private.ThumbnailLoaded, e);
          });
        }, function(e) {
          console.log(e);
        });
      }, findAvailableCue: function(e) {
        for (var t = this.cues.length, r = 0; r < t; r++) {
          var i = this.cues[r];
          if (i.startTime <= e && e < i.endTime) return i;
        }
        return null;
      }, makeUrl: function(e) {
        return e = -1 == e.indexOf("://") ? this.baseUrl + e : e;
      }
    }).dispose = function() {
      this._player = null;
    }, t.exports = e;
  }, { "../../lib/io": 225, "../../lib/url": 233, "../../lib/vtt/thumbnailvtt": 235, "../base/event/eventtype": 244 }],
  296: [function(e, t, r) {
    var i = e("../lib/oo"), n = e("../lib/data"), o = e("../lib/object"), a = e("../lib/dom"), s = e("../lib/event"),
      l = e("../lib/function"), u = e("../lib/layout"),
      c = (e("../lib/constants"), e("../lib/util"), e("../player/base/event/eventtype")), e = e("./component/util"),
      i = i.extend({
        init: function(e, t) {
          var r = this;
          this._player = e, this._eventState = "", this._options = o.copy(t), this._el = this.createEl();
          var i = e.id;
          "function" == typeof e.id && (i = e.id()), this._id = i + "_component_" + n.guid(), this._children = [], this._childIndex = {}, t.className && this.addClass(t.className), this._player.on(c.Private.UiH5Ready, function() {
            r.renderUI(), r.syncUI(), r.bindEvent();
          });
        }
      });
    i.prototype.renderUI = function() {
      u.render(this.el(), this.options()), this.el().id = this.id();
    }, i.prototype.syncUI = function() {
    }, i.prototype.bindEvent = function() {
    }, i.prototype.createEl = function(e, t) {
      return a.createEl(e, t);
    }, i.prototype.options = function(e) {
      return void 0 === e ? this._options : this._options = o.merge(this._options, e);
    }, i.prototype.el = function() {
      return this._el;
    }, i.prototype._contentEl, i.prototype.player = function() {
      return this._player;
    }, i.prototype.contentEl = function() {
      return this._contentEl || this._el;
    }, i.prototype._id, i.prototype.id = function() {
      return this._id;
    }, i.prototype.getId = function() {
      return this._id;
    }, i.prototype.addChild = function(e, t) {
      var r;
      if ("string" == typeof e) {
        if (!this._player.UI[e]) return;
        r = new this._player.UI[e](this._player, t);
      } else r = e;
      return this._children.push(r), "function" == typeof r.id && (this._childIndex[r.id()] = r), "function" == typeof r.el && r.el() && ((e = r.el()).id = r.id(), this.contentEl().appendChild(e)), r;
    }, i.prototype.removeChild = function(e) {
      if (e && this._children) {
        for (var t, r = !1, i = this._children.length - 1; 0 <= i; i--) if (this._children[i] === e) {
          r = !0, this._children.splice(i, 1);
          break;
        }
        r && (this._childIndex[e.id] = null, (t = e.el()) && t.parentNode === this.contentEl() && this.contentEl().removeChild(e.el()));
      }
    }, i.prototype.initChildren = function() {
      var e, t, r = this, i = this.options().children;
      if (i) if (o.isArray(i)) for (var n = 0; n < i.length; n++) t = "string" == typeof (t = i[n]) ? (e = t, {}) : (e = t.name, t), r.addChild(e, t); else o.each(i, function(e, t) {
        !1 !== t && r.addChild(e, t);
      });
    }, i.prototype.on = function(e, t) {
      return s.on(this._el, e, l.bind(this, t)), this;
    }, i.prototype.off = function(e, t) {
      return s.off(this._el, e, t), this;
    }, i.prototype.one = function(e, t) {
      return s.one(this._el, e, l.bind(this, t)), this;
    }, i.prototype.trigger = function(e, t) {
      if (this._el) return !t && 0 != t || (this._el.paramData = t), this._eventState = e, s.trigger(this._el, e), this;
    }, i.prototype.off = function(e) {
      return s.off(this._el, e), this;
    }, i.prototype.addClass = function(e) {
      return a.addClass(this._el, e), this;
    }, i.prototype.removeClass = function(e) {
      return a.removeClass(this._el, e), this;
    }, i.prototype.show = function() {
      return this._el && (this._el.style.display = "block"), this;
    }, i.prototype.hide = function() {
      return this._el && (this._el.style.display = "none"), this;
    }, i.prototype.destroy = function() {
      if (this.trigger({
        type: "destroy",
        bubbles: !1
      }), this._children) for (var e = this._children.length - 1; 0 <= e; e--) this._children[e].destroy && this._children[e].destroy();
      "function" == typeof this.disposeUI && this.disposeUI(), this.children_ = null, this.childIndex_ = null, this.off(), this._el.parentNode && this._el.id != this._player.id() && this._el.parentNode.removeChild(this._el), n.removeData(this._el), this._el = null;
    }, i.prototype.registerControlBarTooltip = e.registerTooltipEvent, t.exports = i;
  }, {
    "../lib/constants": 216,
    "../lib/data": 218,
    "../lib/dom": 219,
    "../lib/event": 220,
    "../lib/function": 221,
    "../lib/layout": 226,
    "../lib/object": 227,
    "../lib/oo": 228,
    "../lib/util": 234,
    "../player/base/event/eventtype": 244,
    "./component/util": 323
  }],
  297: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
      a = e("../../player/base/event/eventtype"), s = e("../../player/base/plugin/status"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-big-play-btn");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class=\"outter\"></div>", e;
        }, bindEvent: function() {
          var t = this;
          this._player.on(a.Player.Play, function() {
            t.addClass("playing"), t.removeClass("pause"), t._hide();
          }), this._player.on(a.Player.Pause, function() {
            var e;
            t._player._switchSourcing || (t.removeClass("playing"), t.addClass("pause"), (e = t._player._status) != s.ended && e != s.error && e != s.playing && t._show());
          });
          var e = document.querySelector("#" + t.id() + " .outter");
          o.on(this.el(), "mouseover", function() {
            n.addClass(e, "big-playbtn-hover-animation");
          }), o.on(this.el(), "mouseout", function() {
            n.removeClass(e, "big-playbtn-hover-animation");
          }), this.on(a.Private.PlayClick, function() {
            var e;
            t._player.paused() ? (e = t._player.getCurrentTime(), (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0), t._player.play(!0)) : t._player.pause(!0);
          }), this._player.on(a.Private.Play_Btn_Show, function() {
            t._show();
          }), this._player.on(a.Private.Play_Btn_Hide, function() {
            t._hide();
          });
        }, _show: function() {
          n.css(this.el(), "display", "block");
        }, _hide: function() {
          n.css(this.el(), "display", "none");
        }
      });
    t.exports = e;
  }, {
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../player/base/event/eventtype": 244,
    "../../player/base/plugin/status": 267,
    "../component": 296
  }],
  298: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("./util"), a = e("../../lang/index"),
      s = e("../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          this.isOpened = !1, i.call(this, e, t), this.addClass("prism-cc-btn");
        }, createEl: function() {
          return i.prototype.createEl.call(this, "div");
        }, bindEvent: function() {
          var r = this;
          this.on("click", function() {
            n.addClass(r._el, "disabled");
            var e = "on", t = "";
            r.isOpened ? (r._player._ccService.close(), e = "off") : t = r._player._ccService.open(), r.isOpened = !r.isOpened, r._player.trigger(s.Private.CCStateChanged, {
              value: e,
              lang: t
            }), r.disabledHandler && clearTimeout(r.disabledHandler), r.disabledHandler = setTimeout(function() {
              n.removeClass(r._el, "disabled");
            }, 1e3), r._player.trigger(s.Private.MarkerTextHide);
          }), this._player.on(s.Private.CCChanged, function(e) {
            e = e.paramData;
            r.isOpened = "off" != e;
          }), o.registerTooltipEvent.call(this, this.el(), function() {
            return r.isOpened ? a.get("CloseSubtitle") : a.get("OpenSubtitle");
          });
        }, disposeUI: function() {
          this.disabledHandler && (clearTimeout(this.disabledHandler), this.disabledHandler = null);
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../player/base/event/eventtype": 244,
    "../component": 296,
    "./util": 323
  }],
  299: [function(e, t, r) {
    var i = e("../component"), o = e("../../player/base/event/eventtype"), a = e("../../lib/event"),
      s = e("../../lib/dom"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-controlbar"), this.initChildren(), this.onEvent();
        }, createEl: function() {
          var e = i.prototype.createEl.call(this);
          return e.innerHTML = "<div class=\"prism-controlbar-bg\"></div>", e;
        }, onEvent: function() {
          var r = this.player(), e = r.options(), i = this;
          a.on(this._el, "mouseover", function() {
            var e = document.querySelector("#" + i.id() + " .prism-progress-cursor");
            s.css(e, "display", "block");
          }), a.on(this._el, "mouseout", function(e) {
            var t = document.querySelector("#" + i.id() + " .prism-progress-cursor");
            s.css(t, "display", "none"), r.trigger(o.Private.ThumbnailHide);
          }), this.timer = null;
          var t, n = e.controlBarVisibility;
          "hover" == (n = 1 == e.controlBarForOver ? "hover" : n) ? (i.hide(), t = function() {
            i._hideHandler && clearTimeout(i._hideHandler), i._show(), r.fullscreenService.getIsFullScreen() && i._hide();
          }, r.on(o.Private.MouseOver, function() {
            t();
          }), a.on(this._player.tag, "click", function(e) {
            e && e.target == e.currentTarget && t();
          }), a.on(this._player.tag, "touchstart", function(e) {
            e && e.target == e.currentTarget && t();
          }), r.on(o.Private.MouseOut, function() {
            i._hideHandler = setTimeout(function() {
              i.hide(), r.trigger(o.Private.HideBar), r.trigger(o.Private.VolumeVisibilityChange, ""), r.trigger(o.Private.SettingListHide);
            });
          })) : "click" == n ? (r.on(o.Private.Click, function(e) {
            r._isError || (e.preventDefault(), e.stopPropagation(), i._show(), i._hide());
          }), r.on(o.Player.Ready, function() {
            i._hide();
          }), r.on(o.Private.TouchStart, function() {
            i._show();
          }), r.on(o.Private.TouchMove, function() {
            i._show();
          }), r.on(o.Private.TouchEnd, function() {
            i._hide();
          })) : "never" == n ? i._hide() : i._show();
        }, _show: function() {
          this.show(), this._player.trigger(o.Private.ShowBar), this.timer && (clearTimeout(this.timer), this.timer = null);
        }, _hide: function() {
          var e = this, t = this.player().options(), t = "never" == t.controlBarVisibility ? 0 : t.showBarTime;
          this.timer = setTimeout(function() {
            e.hide(), e._player.trigger(o.Private.HideBar), e._player.trigger(o.Private.VolumeVisibilityChange, ""), e._player.trigger(o.Private.SettingListHide);
          }, t);
        }, disposeUI: function() {
          this.timer && (clearTimeout(this.timer), this.timer = null), this._hideHandler && (clearTimeout(this._hideHandler), this._hideHandler = null);
        }
      });
    t.exports = e;
  }, { "../../lib/dom": 219, "../../lib/event": 220, "../../player/base/event/eventtype": 244, "../component": 296 }],
  300: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../player/base/event/eventtype"), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.addClass("prism-cover");
      }, createEl: function() {
        var e = i.prototype.createEl.call(this, "div"), t = this.options().cover;
        return t ? e.style.backgroundImage = "url(" + t + ")" : n.css(e, "display", "none"), e;
      }, _hide: function(e) {
        var t = document.querySelector("#" + this.id() + " .prism-cover");
        t && n.css(t, "display", "none");
      }, _show: function(e) {
        var t = document.querySelector("#" + this.id() + " .prism-cover");
        t && n.css(t, "display", "block");
      }, bindEvent: function() {
        this._player.on(o.Private.Cover_Show, this._show), this._player.on(o.Private.Cover_Hide, this._hide);
      }
    });
    t.exports = e;
  }, { "../../lib/dom": 219, "../../player/base/event/eventtype": 244, "../component": 296 }],
  301: [function(e, t, r) {
    var i = e("../component"), s = e("../../lib/util"), l = e("../../lib/dom"), n = e("../../lib/event"),
      o = e("../../lib/ua"), u = e("../../lang/index"), a = e("../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-ErrorMessage");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class='prism-error-content'><p></p></div><div class='prism-error-operation'><a class='prism-button prism-button-refresh'>" + u.get("Refresh_Text") + "</a><a class='prism-button prism-button-retry'  target='_blank'>" + u.get("Retry") + "</a><a class='prism-button prism-button-orange'  target='_blank'>" + u.get("Detection_Text") + "</a></div><div class='prism-detect-info prism-center'><p class='errorCode'><span class='info-label'>code\uff1a</span><span class='info-content'></span></p><p class='vid'><span class='info-label'>vid:</span><span class='info-content'></span></p><p class='uuid'><span class='info-label'>uuid:</span><span class='info-content'></span></p><p class='requestId'><span class='info-label'>requestId:</span><span class='info-content'></span></p><p class='dateTime'><span class='info-label'>" + u.get("Play_DateTime") + "\uff1a</span><span class='info-content'></span></p></div>", e;
        }, bindEvent: function() {
          var r = this;
          r._player.on(a.Private.Error_Show, function(e) {
            var t = null;
            r._player.getMonitorInfo && (t = r._player.getMonitorInfo()), r._show(e, t);
          }), r._player.on(a.Private.Error_Hide, function() {
            r._hide();
          });
          var e = document.querySelector("#" + r.id() + " .prism-button-refresh");
          n.on(e, "click", function() {
            location.reload(!0);
          }), o.IS_MOBILE && (e = document.querySelector("#" + r.id() + " .prism-detect-info"), l.addClass(e, "prism-width90"));
          e = document.querySelector("#" + r.id() + " .prism-button-retry");
          n.on(e, "click", function() {
            var e = r._player.getCurrentTime(), t = r._player._options.source;
            r._player._setDefaultCC = !0, r._player._loadByUrlInner(t, e, !0);
          });
        }, _show: function(e, t) {
          var r = e.paramData, i = "", n = "";
          r.mediaId && (i = r.mediaId);
          var o, a, e = document.querySelector("#" + this.id() + " .prism-button-orange");
          e && (t && this._player._options.diagnosisButtonVisible ? (t.vu ? n = decodeURIComponent(t.vu) : l.css(e, "display", "none"), t = "//player.alicdn.com/detection.html?from=h5&vid=" + i + "&source=" + (n ? encodeURIComponent(n) : "") + "&uuid=" + t.uuid + "&lang=" + u.getCurrentLanguage(), e && (e.href = t)) : l.css(e, "display", "none"), e = r.display_msg || r.error_msg, document.querySelector("#" + this.id() + " .prism-error-content p").innerHTML = e, document.querySelector("#" + this.id() + " .errorCode .info-content").innerText = r.error_code, e = document.querySelector("#" + this.id() + " .vid"), r.mediaId ? (l.css(e, "display", "block"), document.querySelector("#" + this.id() + " .vid .info-content").innerText = r.mediaId) : l.css(e, "display", "none"), r.uuid ? document.querySelector("#" + this.id() + " .uuid .info-content").innerText = r.uuid : (e = document.querySelector("#" + this.id() + " .uuid"), l.css(e, "display", "none")), r.requestId ? document.querySelector("#" + this.id() + " .requestId .info-content").innerText = r.requestId : (o = document.querySelector("#" + this.id() + " .requestId"), l.css(o, "display", "none")), document.querySelector("#" + this.id() + " .dateTime .info-content").innerText = s.formatDate(new Date, "yyyy-MM-dd HH:mm:ss"), o = document.querySelector("#" + this.id()), l.css(o, "display", "block"), (a = this).playHideHandler && clearTimeout(a.playHideHandler), a.playHideHandler = setTimeout(function() {
            a._player.trigger("play_btn_hide");
          }));
        }, _hide: function() {
          var e = document.querySelector("#" + this.id());
          l.css(e, "display", "none");
        }, disposeUI: function() {
          this.playHideHandler && (clearTimeout(this.playHideHandler), this.playHideHandler = null);
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296
  }],
  302: [function(e, t, r) {
    var i = e("../component"), n = e("../../player/base/event/eventtype"),
      o = (e("../../lib/event"), e("../../lib/ua")), a = e("../../lang/index"), s = e("./util"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-fullscreen-btn");
        }, bindEvent: function() {
          var e = this;
          this._player.on(n.Player.RequestFullScreen, function() {
            o.IS_IOS || e.addClass("fullscreen");
          }), this._player.on(n.Player.CancelFullScreen, function() {
            e.removeClass("fullscreen");
          }), s.registerTooltipEvent.call(this, this.el(), function() {
            return e._player.fullscreenService.getIsFullScreen() ? a.get("ExistFullScreen") : a.get("Fullscreen");
          }), this.on("click", function() {
            e._player.fullscreenService.getIsFullScreen() ? e._player.fullscreenService.cancelFullScreen() : e._player.fullscreenService.requestFullScreen(), e._player.trigger(n.Private.MarkerTextHide);
          });
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/event": 220,
    "../../lib/ua": 232,
    "../../player/base/event/eventtype": 244,
    "../component": 296,
    "./util": 323
  }],
  303: [function(e, t, r) {
    "use strict";
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../player/base/event/eventtype"), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.addClass("prism-hide");
      }, createEl: function() {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = "<div class=\"circle\"></div> <div class=\"circle1\"></div>", e;
      }, _loading_hide: function(e) {
        var t = document.querySelector("#" + this.id() + " .prism-loading");
        t && (n.removeClass(t, "prism-loading"), n.addClass(t, "prism-hide"));
      }, _loading_show: function(e) {
        var t = document.querySelector("#" + this.id() + " .prism-hide");
        t && (n.removeClass(t, "prism-hide"), n.addClass(t, "prism-loading"));
      }, bindEvent: function() {
        this._player.on(o.Private.H5_Loading_Show, this._loading_show), this._player.on(o.Private.H5_Loading_Hide, this._loading_hide);
      }
    });
    t.exports = e;
  }, { "../../lib/dom": 219, "../../player/base/event/eventtype": 244, "../component": 296 }],
  304: [function(e, t, r) {
    var i = e("../component"), n = (e("../../lib/util"), e("../../lib/dom")),
      o = (e("../../lib/event"), e("../../lib/ua"), e("../../lang/index"), e("../../player/base/event/eventtype")),
      e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-info-display");
        }, createEl: function() {
          return i.prototype.createEl.call(this, "p");
        }, bindEvent: function() {
          var r = this;
          r._player.on(o.Private.Info_Show, function(e) {
            var t = document.querySelector("#" + r.id()), e = e.paramData;
            e && (void 0 !== e.text && e.text ? (t.innerHTML = e.text, void 0 !== e.duration && e.duration && (r.handler && clearTimeout(r.handler), r.handler = setTimeout(function() {
              n.css(t, "display", "none");
            }, e.duration)), "lb" == e.align ? (n.addClass(t, "prism-info-left-bottom"), n.removeClass(t, "prism-info-top-center")) : "tc" == e.align ? (n.addClass(t, "prism-info-top-center"), n.removeClass(t, "prism-info-left-bottom")) : (n.removeClass(t, "prism-info-left-bottom"), n.removeClass(t, "prism-info-top-center")), e.isBlack ? n.addClass(t, "prism-info-black") : n.removeClass(t, "prism-info-black")) : t.innerHTML = e, n.css(t, "display", "block"));
          }), r._player.on(o.Private.Info_Hide, function(e) {
            var t = document.querySelector("#" + r.id());
            n.css(t, "display", "none");
          });
        }, disposeUI: function() {
          this.handler && (clearTimeout(this.handler), this.handler = null);
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296
  }],
  305: [function(e, t, r) {
    var i = e("../component"), n = e("./util"), o = (e("../../lib/util"), e("../../lib/dom")), a = e("../../lib/event"),
      s = e("../../lib/playerUtil"), l = e("../../lang/index"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-live-display");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "p");
          return e.innerText = "LIVE", s.isLiveShift(this._player._options) && o.addClass(e, "live-shift-display"), e;
        }, bindEvent: function() {
          var e = document.querySelector("#" + this.id()), t = this;
          s.isLiveShift(this._player._options) && (a.on(e, "click", function() {
            t._player._liveshiftService.switchToLive();
          }), n.registerTooltipEvent.call(this, this.el(), l.get("SwitchToLive")));
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/playerUtil": 229,
    "../../lib/util": 234,
    "../component": 296,
    "./util": 323
  }],
  306: [function(e, t, r) {
    var i = e("../component"), n = (e("../../lib/dom"), e("../../lib/event"), e("../../player/base/event/eventtype")),
      o = e("../../player/base/plugin/status"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-animation");
        }, bindEvent: function() {
          var t = this;
          this._player.on(n.Player.Play, function() {
            t._player._isManualPlay && (t.removeClass("prism-pause-animation"), t.addClass("prism-play-animation"), t.removeClass("play-apply-animation"), t.playHandler && clearTimeout(t.playHandler), t.playHandler = setTimeout(function() {
              t.addClass("play-apply-animation");
            }));
          }), this._player.on(n.Player.Pause, function() {
            var e = t._player._status;
            e != o.ended && e != o.error && t._player._isManualPause && (t.removeClass("prism-play-animation"), t.addClass("prism-pause-animation"), t.removeClass("play-apply-animation"), t.pauseHandler && clearTimeout(t.pauseHandler), t.pauseHandler = setTimeout(function() {
              t.addClass("play-apply-animation");
            }));
          });
        }, disposeUI: function() {
          this.playHandler && (clearTimeout(this.playHandler), this.playHandler = null), this.pauseHandler && (clearTimeout(this.pauseHandler), this.pauseHandler = null);
        }
      });
    t.exports = e;
  }, {
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../player/base/event/eventtype": 244,
    "../../player/base/plugin/status": 267,
    "../component": 296
  }],
  307: [function(e, t, r) {
    var i = e("../component"), n = e("../../player/base/event/eventtype"), o = e("./util"), a = e("../../lang/index"),
      e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-play-btn");
        }, bindEvent: function() {
          var t = this;
          this._player.on(n.Player.Play, function() {
            t.addClass("playing");
          }), this._player.on(n.Player.Pause, function() {
            t.removeClass("playing");
          }), this.on(n.Private.PlayClick, function() {
            var e;
            t._player.paused() ? (e = t._player.getCurrentTime(), (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0), t._player.play(!0), t.addClass("playing")) : (t._player.pause(!0), t.removeClass("playing")), t._player.trigger(n.Private.MarkerTextHide);
          }), o.registerTooltipEvent.call(this, this.el(), function() {
            return t._player.paused() ? a.get("Play") : a.get("Pause");
          });
        }
      });
    t.exports = e;
  }, { "../../lang/index": 212, "../../player/base/event/eventtype": 244, "../component": 296, "./util": 323 }],
  308: [function(e, t, r) {
    var i = e("../component"), o = e("../../lib/dom"), a = (e("../../lib/constants"), e("../../lib/event")),
      s = e("../../lib/ua"), l = e("../../lib/function"), n = e("../../lang/index"), u = e("../../config"),
      c = e("../../lib/util"), h = e("../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this._seekTime = -1, this.addClass("prism-progress");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this);
          return e.innerHTML = "<div class=\"prism-progress-loaded\"></div><div class=\"prism-progress-played\"></div><div class=\"prism-progress-marker\"></div><div class=\"prism-progress-cursor\"><img></img></div><p class=\"prism-progress-time\"></p>", e;
        }, bindEvent: function() {
          var t = this;
          this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"), this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"), this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"), this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"), this.timeNode = document.querySelector("#" + this._player._options.id + " .prism-progress-time"), this.thumbnailNode = document.querySelector(".prism-thumbnail");
          var r = document.querySelector("#" + this.id()),
            e = document.querySelector("#" + this.id() + " .prism-progress-cursor img"), i = "",
            i = u.domain ? "https://" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png" : "/build/skins/default/img/dragcursor.png";
          e.src = i, a.on(this.cursorNode, "mousedown", function(e) {
            t._onMouseDown(e);
          }), a.on(this.cursorNode, "touchstart", function(e) {
            t._onMouseDown(e);
          }), a.on(r, "mousemove", function(e) {
            t._progressMove(e);
          }), a.on(r, "touchmove", function(e) {
            t._progressMove(e);
          });

          function n(e) {
            t._progressDown = e;
          }

          a.on(r, "mousedown", function(e) {
            n(!0);
          }), a.on(r, "touchstart", function(e) {
            n(!0);
          }), a.on(r, "mouseup", function(e) {
            n(!1);
          }), a.on(r, "touchend", function(e) {
            n(!1);
          }), a.on(this._el, "click", function(e) {
            t._onMouseClick(e);
          }), this._player.on(h.Private.HideProgress, function(e) {
            t._hideProgress(e);
          }), this._player.on(h.Private.CancelHideProgress, function(e) {
            t._cancelHideProgress(e);
          }), a.on(r, h.Private.MouseOver, function(e) {
            t._onMouseOver(e);
          }), a.on(r, h.Private.MouseOut, function(e) {
            t._onMouseOut(e);
          }), a.on(this.controlNode, h.Private.MouseLeave, function(e) {
            t._offMouseUp();
          }), s.IS_PC ? (a.on(r, "mouseover", function() {
            o.addClass(r, "prism-progress-hover"), o.addClass(t.cursorNode, "cursor-hover");
          }), a.on(r, "mouseout", function(e) {
            o.removeClass(r, "prism-progress-hover"), o.removeClass(t.cursorNode, "cursor-hover"), t._progressDown = !1;
          })) : (o.addClass(r, "prism-progress-hover"), o.addClass(t.cursorNode, "cursor-hover")), this.bindTimeupdate = l.bind(this, this._onTimeupdate), this._player.on(h.Player.TimeUpdate, this.bindTimeupdate), s.IS_IPAD ? this.interval = setInterval(function() {
            t._onProgress();
          }, 500) : this._player.on(h.Video.Progress, function() {
            t._onProgress();
          }), this._player.on(h.Private.UpdateProgress, function(e) {
            t._updateProgressBar(t.playedNode, e.paramData.targetTime);
          }), this._player.on(h.Private.UpdateCursorPosition, function(e) {
            t._updateCursorPosition(e.paramData.targetTime);
          });
        }, _progressMove: function(e) {
          e.preventDefault();
          var t, r, i = this._getSeconds(e);
          i != 1 / 0 && (t = c.formatTime(i), r = this._getDistance(e), this.cursorNode && (this._player.trigger(h.Private.ThumbnailShow, {
            time: i,
            formatTime: t,
            left: r,
            progressWidth: this.el().offsetWidth
          }), this._progressDown && this._onMouseMove(e)));
        }, _hideProgress: function(e) {
          a.off(this.cursorNode, "mousedown"), a.off(this.cursorNode, "touchstart");
        }, _cancelHideProgress: function(e) {
          var t = this;
          a.on(this.cursorNode, "mousedown", function(e) {
            t._onMouseDown(e);
          }), a.on(this.cursorNode, "touchstart", function(e) {
            t._onMouseDown(e);
          });
        }, _canSeekable: function(e) {
          var t = !0;
          return t = "function" == typeof this._player.canSeekable ? this._player.canSeekable(e) : t;
        }, _onMouseOver: function(e) {
          this._cursorHideHandler && (clearTimeout(this._cursorHideHandler), this._cursorHideHandler = null), this._mouseInProgress || this._updateCursorPosition(this._player.getCurrentTime()), this._mouseInProgress = !0;
        }, _onMouseOut: function(e) {
          var t = this;
          this._cursorHideHandler && clearTimeout(this._cursorHideHandler), this._cursorHideHandler = setTimeout(function() {
            t._player.trigger(h.Private.ThumbnailHide), t._mouseInProgress = !1;
          });
        }, _getSeconds: function(e) {
          var t = this._getDistance(e), e = this.el().offsetWidth,
            e = this._player.getDuration() ? t / e * this._player.getDuration() : 0;
          return e = (e = e < 0 ? 0 : e) > this._player.getDuration() ? this._player.getDuration() : e;
        }, _getDistance: function(e) {
          for (var t = this.el().offsetLeft, r = this.el(); r = r.offsetParent;) {
            var i = o.getTranslateX(r);
            t += r.offsetLeft + i;
          }
          e = (e.touches ? e.touches[0] : e).pageX;
          return Math.abs(e - t);
        }, _onMouseClick: function(e) {
          var t = this, r = t._getSeconds(e);
          t._canSeekable(r) ? (t._player.exceedPreviewTime(r) && (r = t._player.getPreviewTime()), this._seekTime = r, t._updateProgressBar(this.playedNode, r), t._updateCursorPosition(r), this._mouseClickTimeHandle && clearTimeout(this._mouseClickTimeHandle), this._mouseClickTimeHandle = setTimeout(function() {
            t._player._seeking = !0, t._mouseDown && !s.IS_MOBILE || t._player.trigger(h.Private.SeekStart, { fromTime: t._player.getCurrentTime() }), t._player.seek(r), t._mouseDown = !1, t._player.trigger(h.Private.EndStart, { toTime: r }), t._mouseClickTimeHandle = null, t._inWaitingSeek = !1;
          }, 0), this._inWaitingSeek = !0) : t._player.trigger(h.Private.Info_Show, {
            text: n.get("Can_Not_Seekable"),
            duration: 2e3
          });
        }, _onMouseDown: function(e) {
          var t = this;
          e.preventDefault(), this._mouseDown = !0, this._player.trigger(h.Private.SeekStart, { fromTime: this._player.getCurrentTime() }), a.on(this.controlNode, "mousemove", function(e) {
            t._onMouseMove(e);
          }), a.on(this.controlNode, "touchmove", function(e) {
            t._onMouseMove(e);
          }), a.on(this.controlNode, "mouseup", function(e) {
            t._onControlBarMouseUp(e);
          }), a.on(this.controlNode, "touchend", function(e) {
            t._onControlBarMouseUp(e);
          });
          e = t._getSeconds(e);
          t._canSeekable(e) ? (t._player.exceedPreviewTime(e) && (e = t._player.getPreviewTime()), s.IS_MOBILE && this._player.trigger(h.Private.EndStart, { toTime: e })) : t._player.trigger(h.Private.Info_Show, {
            text: n.get("Can_Not_Seekable"),
            duration: 2e3
          });
        }, _onMouseUp: function(e) {
          this._onMouseUpIntern(e);
        }, _onControlBarMouseUp: function(e) {
          this._onMouseUpIntern(e);
        }, _onPlayerMouseUp: function(e) {
          this._onMouseUpIntern(e);
        }, _offMouseUp: function() {
          a.off(this.controlNode, "mousemove"), a.off(this.controlNode, "touchmove"), a.off(this.controlNode, "mouseup"), a.off(this.controlNode, "touchend");
        }, _onMouseUpIntern: function(e) {
          e.preventDefault(), this._offMouseUp();
          e = this.playedNode.offsetWidth / this.el().offsetWidth * this._player.getDuration(), this._player.getDuration();
          isNaN(e) || this._player.seek(e), this._player.trigger(h.Private.EndStart, { toTime: e }), this._mouseDown = !1;
        }, _onMouseMove: function(e) {
          e.preventDefault();
          e = this._getSeconds(e);
          this._player.exceedPreviewTime(e) && (e = this._player.getPreviewTime()), this._player.seek(e), this._updateProgressBar(this.playedNode, e), this._updateCursorPosition(e);
        }, _onTimeupdate: function(e) {
          var t = this._player.tag.currentSrc.split("."), r = !(!t || "mp4" !== t[t.length - 1]), t = !1;
          this.thumbnailNode && (this.thumbnailNode.style.display = "none"), r && (s.IS_MAC_SAFARI && (t = !0), s.IS_IOS && (t = !0), s.IS_IE11 && (t = !0)), "audio" == this._player._options.mediaType && s.IS_IOS && (this._player._seeking = !1), (this._inWaitingSeek || this._player._seeking && !s.IS_EDGE || this._progressDown) && !t || (this._updateProgressBar(this.playedNode, this._player.getCurrentTime()), this._updateCursorPosition(this._player.getCurrentTime()), this._player.trigger(h.Private.UpdateProgressBar, { time: this._player.getCurrentTime() }));
        }, _onProgress: function(e) {
          this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1));
        }, _updateProgressBar: function(e, t) {
          var r = this._player.getDuration();
          1 != this._player._switchSourcing && r && (-1 != this._seekTime && (this._player.getCurrentTime() >= this._seekTime || !this._player._seeking ? this._seekTime = -1 : t = this._seekTime), 1 < (r = t / r + .005) && (r = 1), e && o.css(e, "width", 100 * r + "%"));
        }, _updateCursorPosition: function(e) {
          var t, r, i, n = this._player.getDuration();
          1 != this._player._switchSourcing && n && (t = 1, i = 10 / (r = this._player.el().clientWidth), 0 != r && (t = 1 - i), i = (i = e / n - i) < 0 ? 0 : i, this.cursorNode && (t < i ? (o.css(this.cursorNode, "right", "0px"), o.css(this.cursorNode, "left", "auto")) : (o.css(this.cursorNode, "right", "auto"), o.css(this.cursorNode, "left", 100 * i + "%"))));
        }, disposeUI: function() {
          this.cursorNodeHandler && (clearTimeout(this.cursorNodeHandler), this.cursorNodeHandler = null), this._cursorHideHandler && (clearTimeout(this._cursorHideHandler), this._cursorHideHandler = null), this._mouseClickTimeHandle && (clearTimeout(this._mouseClickTimeHandle), this._mouseClickTimeHandle = null);
        }
      });
    t.exports = e;
  }, {
    "../../config": 205,
    "../../lang/index": 212,
    "../../lib/constants": 216,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/function": 221,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296
  }],
  309: [function(e, t, r) {
    var i = e("../component"), n = (e("../../lib/util"), e("../../lib/dom")), o = e("../../lib/event"),
      a = e("../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-marker-text");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<p></p>", e;
        }, bindEvent: function() {
          var i = this;
          i._player.on(a.Private.MarkerTextShow, function(e) {
            var t = e.paramData, r = a.Player.MarkerDotOver;
            i._player.trigger(r, e.paramData), t.progressMarker.isCustomized ? i._player.trigger(a.Private.LifeCycleChanged, {
              type: r,
              data: e.paramData
            }) : (i._thumbnailShowHanlde && (n.css(i.el(), "display", "none"), clearTimeout(i._thumbnailShowHanlde)), i._thumbnailShowHanlde = setTimeout(function() {
              var e;
              document.querySelector("#" + i.id() + " p").innerText = t.progressMarker.text || "", t && (n.css(i.el(), "display", "block"), e = i._player.el().offsetWidth, left = e * t.left, width = i.el().offsetWidth, left + width > e ? (n.css(i.el(), "right", "0px"), n.css(i.el(), "left", "auto")) : (left -= width / 2, left = left < 0 ? 0 : left, n.css(i.el(), "right", "auto"), n.css(i.el(), "left", left + "px")));
            }, 30));
          }), i._player.on(a.Private.MarkerTextHide, function(e) {
            i._player.trigger(a.Player.MarkerDotOut), i._player.trigger(a.Private.LifeCycleChanged, {
              type: a.Player.MarkerDotOut,
              data: ""
            }), i._thumbnailShowHanlde && clearTimeout(i._thumbnailShowHanlde), n.css(i.el(), "display", "none");
          }), o.on(i._player.tag, "click", function(e) {
            e && e.target == e.currentTarget && i._player.trigger(a.Private.MarkerTextHide);
          }), o.on(i._player.tag, "touchstart", function(e) {
            e && e.target == e.currentTarget && i._player.trigger(a.Private.MarkerTextHide);
          });
        }, disposeUI: function() {
          this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde), this._thumbnailShowHanlde = null);
        }
      });
    t.exports = e;
  }, {
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296
  }],
  310: [function(e, t, r) {
    var i = e("./selector"), s = e("../../../lib/object"), u = (e("../../../lib/util"), e("../../../lib/cookie")),
      l = e("../../../lib/dom"), c = (e("../../../lib/event"), e("../../../lib/constants")),
      h = e("../../../lang/index"), a = e("../../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          this.Name = h.get("Quality"), this.Type = "quality", this.Tooltip = h.get("Quality_Switch_To"), i.call(this, e, t), this._isMasterLevel = !1;
        }, showTip: function(e, t) {
          this._player.trigger(a.Private.Info_Show, { text: e, duration: t, align: "lb" });
        }, bindEvent: function() {
          this.bindCommonEvent();
          var o = this;
          this._player.on(a.Private.QualityChange, function(e) {
            var t, r, i, n = 0 < o._player._urls.length ? o._player._urls : o._player._qualityService.levels;
            data = e.paramData, data.levelSwitch ? (i = data.desc || data.bitrate, o._autoSWitchDesc = i, o._updateText(i)) : 0 < o._player._currentPlayIndex && (o._autoSWitchDesc = "", r = n[(t = o._player._currentPlayIndex) - 1].desc, i = n[t].desc, o.showTip(r + e.paramData + i, 1e3), o._player.trigger(a.Private.SelectorValueChange, n[t].Url));
          });
          var e = document.querySelector("#" + o.id() + " .selector-list");
          this._player.on(a.Player.LevelSwitch, function() {
            l.addClass(e, "disabled");
          }), this._player.on(a.Player.LevelSwitched, function() {
            l.removeClass(e, "disabled");
          });
        }, generateList: function(e) {
          var t = this._player._urls, n = this._player._currentPlayIndex, r = this._player._qualityService.levels;
          0 < r.length && (this._isMasterLevel = !0, this._player._options.isVBR && (n = (t = r).length - 1));
          var o, a = document.querySelector("#" + this.id() + " .selector-list");
          0 < t.length && (o = this, s.each(t, function(e, t) {
            var r, i;
            (e.desc || e.bitrate) && (r = l.createEl.call(this, "li", {
              key: e.Url,
              index: t,
              text: e.desc || e.bitrate
            }), i = l.createEl.call(this, "span", {
              key: e.Url,
              index: t,
              text: e.desc || e.bitrate
            }), t == n && (l.addClass(r, "current"), o._previousSelection = r), i.innerText = e.desc || e.bitrate, r.appendChild(i), a.appendChild(r));
          })), this._autoSWitchDesc && this._updateText(this._autoSWitchDesc);
        }, execute: function(e) {
          if (this._player._switchSourcing = !0, this._isMasterLevel) {
            for (var t = this._player._qualityService.levels, r = 0; r < t.length; r++) t[r].Url == e && t[r].desc != h.get("Auto") && this._updateText("");
            this._player._switchLevel ? this._player._switchLevel(e) : this._player._loadByUrlInner(e, this._player.getCurrentTime(), this._player._options.isLive);
          } else {
            for (var i, n, o = this._player._urls.length, a = this._player._currentPlayIndex, s = -1, r = 0; r < o; r++) if (this._player._urls[r].Url == e) {
              this._player._currentPlayIndex = r, u.set(c.SelectedStreamLevel, this._player._urls[s = r].definition, 365);
              break;
            }
            a != s && -1 < s ? (i = this._player.getCurrentTime(), this._previousCurrentTime ? "playing" != this._player._status && (i = this._previousCurrentTime) : this._previousCurrentTime = i, this._previousCurrentTime = i, n = this._player.autoplay || "pause" != this._player._status, this._player.autoplay || 0 != i || (n = !1), this._player._switchLevel && !this._player._options.isLive ? this._player._switchLevel(e) : this._player._loadByUrlInner(e, i, n)) : this._player._loadByUrlInner(e, i, n);
          }
          var l = this;
          setTimeout(function() {
            l._player._switchSourcing = !1;
          });
        }, _updateText: function(e) {
          var t = document.querySelector("#" + this.id() + " .selector-list .current"),
            r = document.querySelector("#" + this.id() + " .selector-list .current span"), i = h.get("Auto");
          r && r.innerText && -1 < r.innerText.indexOf(i) && (r.innerText = i += e ? "(" + e + ")" : "", t && (t.text = i));
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/constants": 216,
    "../../../lib/cookie": 217,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/object": 227,
    "../../../lib/util": 234,
    "../../../player/base/event/eventtype": 244,
    "./selector": 316
  }],
  311: [function(e, t, r) {
    var i = e("./selector"), a = e("../../../lib/object"),
      s = (e("../../../lib/util"), e("../../../lib/cookie"), e("../../../lib/dom")),
      n = (e("../../../lib/event"), e("./util"), e("../../../lang/index")),
      l = e("../../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          this.Name = n.get("AudioTrack"), this.Type = "audio", this.Tooltip = n.get("AudioTrack_Switch_To"), i.call(this, e, t);
        }, bindEvent: function() {
          this.bindCommonEvent();
          var n = this, o = document.querySelector("#" + n.id() + " .selector-list");
          document.querySelector("#" + n.id() + " .header");
          n._player.on(l.Private.ChangeURL, function() {
            n._hasGeneratedList = !1;
          }), this._player.on(l.Player.AudioTrackSwitch, function() {
            s.addClass(o, "disabled");
          }), this._player.on(l.Player.AudioTrackSwitched, function() {
            s.removeClass(o, "disabled");
          }), n._player.on(l.Player.AudioTrackReady, function(e) {
            n._hasGeneratedList || (n._clear(), (e = e.paramData) && (a.each(e, function(e, t) {
              var r = s.createEl.call(n, "li", { key: e.value, text: e.text }),
                i = s.createEl.call(n, "span", { key: e.value, text: e.text });
              i.innerText = e.text, r.appendChild(i), o.appendChild(r);
            }), n._hasGeneratedList = !0));
          });
        }, execute: function(e) {
          this._player._audioTrackService["switch"](e);
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/cookie": 217,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/object": 227,
    "../../../lib/util": 234,
    "../../../player/base/event/eventtype": 244,
    "./selector": 316,
    "./util": 318
  }],
  312: [function(e, t, r) {
    var i = e("../../component"), n = (e("../../../lib/dom"), e("../../../player/base/event/eventtype")),
      o = e("./list"), a = e("../../../lang/index"), s = e("../util"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass(t.className || "prism-setting-btn"), this._settingList = new o(e, t), e.addChild(this._settingList, t);
        }, createEl: function() {
          return i.prototype.createEl.call(this, "div");
        }, bindEvent: function() {
          var e = this;
          this.on("click", function() {
            e._settingList.isOpened ? e._player.trigger(n.Private.SettingListHide) : e._player.trigger(n.Private.SettingListShow), e._player.trigger(n.Private.SelectorHide), e._player.trigger(n.Private.MarkerTextHide), e._player.trigger(n.Private.VolumeVisibilityChange, "");
          }), s.registerTooltipEvent.call(this, this.el(), a.get("Setting"));
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/dom": 219,
    "../../../player/base/event/eventtype": 244,
    "../../component": 296,
    "../util": 323,
    "./list": 315
  }],
  313: [function(e, t, r) {
    var i = e("./selector"), s = e("../../../lib/object"), l = e("../../../lib/dom"),
      n = (e("../../../lib/event"), e("./util"), e("../../../lib/cookie")), o = e("../../../lib/constants"),
      a = e("../../../lang/index"), u = e("../../../player/base/event/eventtype"), e = i.extend({
        init: function(e, t) {
          this.Name = a.get("Subtitle"), this.Type = "cc", this.Tooltip = a.get("CC_Switch_To"), i.call(this, e, t);
        }, bindEvent: function() {
          this.bindCommonEvent();
          var r = this;
          this._player.on(u.Private.CCStateChanged, function(e) {
            var t = e.paramData.value, e = e.paramData.lang;
            "on" == t && e ? r._backCCText = e : "off" == t && "" == r._backCCText && (r._backCCText = r._previousSelection.text);
            e = "Off";
            "on" == t && (e = r._backCCText), r._player.trigger(u.Private.SelectorUpdateList, { type: "cc", text: e });
          });
        }, generateList: function(n) {
          var o = document.querySelector("#" + this.id() + " .selector-list"), e = this._player._ccService.tracks,
            a = this;
          s.each(e, function(e, t) {
            var r = l.createEl.call(this, "li", { key: e.value, text: e.text }),
              i = l.createEl.call(this, "span", { key: e.value, text: e.text });
            e.text == n && (l.addClass(r, "current"), a._previousSelection = r), i.innerText = e.text, r.appendChild(i), o.appendChild(r);
          });
        }, execute: function(e) {
          this._backCCText = "", n.set(o.SelectedCC, e, 365), this._player._ccService["switch"](e), this._player.trigger(u.Private.CCChanged, e);
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/constants": 216,
    "../../../lib/cookie": 217,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/object": 227,
    "../../../player/base/event/eventtype": 244,
    "./selector": 316,
    "./util": 318
  }],
  314: [function(e, t, r) {
    t.exports = { CC: e("./cc"), Speed: e("./speed"), Quality: e("./Quality"), Audio: e("./audio") };
  }, { "./Quality": 310, "./audio": 311, "./cc": 313, "./speed": 317 }],
  315: [function(e, t, r) {
    var o = e("../../component"), n = e("../../../lib/dom"), a = e("../../../lib/ua"), s = e("../../../lib/event"),
      l = e("../../../player/base/event/eventtype"), u = e("./export"), c = e("./util"), h = e("../../../lang/index"),
      e = o.extend({
        init: function(e, t) {
          for (var r in this.isOpened = !1, o.call(this, e, t), this.addClass(t.className || "prism-setting-list"), u) {
            var i = new u[r](e, t);
            e.addChild(i, t);
          }
        }, createEl: function() {
          var e = o.prototype.createEl.call(this, "div"),
            t = "<div class='prism-setting-item prism-setting-{type}' type={type}><div class='setting-content'><span class='setting-title'>{value}</span><span class='array'></span><span class='current-setting'></span></div></div>",
            r = t.replace(/{type}/g, "speed").replace("{value}", h.get("Speed")),
            i = t.replace(/{type}/g, "cc").replace("{value}", h.get("Subtitle")),
            n = t.replace(/{type}/g, "audio").replace("{value}", h.get("AudioTrack")),
            t = t.replace(/{type}/g, "quality").replace("{value}", h.get("Quality"));
          return e.innerHTML = r + i + n + t, e;
        }, bindEvent: function() {
          document.querySelector("#" + this.id() + " .prism-setting-speed .current-setting").innerText = h.get("Speed_1X_Text");

          function t() {
            i._player.trigger(l.Private.SettingListHide), i.isOpened = !1;
          }

          function r(e) {
            e && e.text && (document.querySelector("#" + i.id() + " .prism-setting-" + e.type + " .current-setting").innerText = e.text);
          }

          var i = this;
          this._player.on(l.Private.SettingListShow, function(e) {
            i.isOpened = !0;
            e = e.paramData;
            r(e), n.css(i.el(), "display", "block");
          }), this._player.on(l.Private.UpdateToSettingList, function(e) {
            e = e.paramData;
            r(e);
          }), this._player.on(l.Private.SelectorUpdateList, function(e) {
            e = e.paramData;
            r(e), i._player.trigger(l.Private.SelectorValueChange, e);
          }), this._player.on(l.Private.SettingListHide, function() {
            i.isOpened = !1, n.css(i.el(), "display", "none");
          }), s.on(this.el(), "click", function(e) {
            i._player.trigger(l.Private.SettingListHide);
            e = e.srcElement || e.target;
            (e = c.findItemElementForList(e)) && (e = e.getAttribute("type"), i._player.trigger(l.Private.SelectorShow, { type: e }));
          });
          var e = a.IS_MOBILE ? "touchleave" : "mouseleave";
          s.on(this.el(), e, function() {
            t();
          }), s.on(this._player.tag, "click", function(e) {
            e && e.target == e.currentTarget && t();
          }), s.on(this._player.tag, "touchstart", function(e) {
            e && e.target == e.currentTarget && t();
          }), this._player.on(l.Private.QualityChange, function(e) {
            var t, r = e.paramData;
            r.levelSwitch && (t = document.querySelector("#" + i.id() + " .prism-setting-quality .current-setting"), e = h.get("Auto"), -1 < t.innerText.indexOf(e) && (t.innerText = e + (r.desc ? "(" + r.desc + ")" : "")));
          });
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/ua": 232,
    "../../../player/base/event/eventtype": 244,
    "../../component": 296,
    "./export": 314,
    "./util": 318
  }],
  316: [function(e, t, r) {
    var i = e("../../component"), n = (e("../../../lib/object"), e("../../../lib/util"), e("../../../lib/ua")),
      a = (e("../../../lib/cookie"), e("../../../lib/dom")), s = e("../../../lib/event"), l = e("./util"),
      u = (e("../../../lang/index"), e("../../../player/base/event/eventtype")), e = i.extend({
        init: function(e, t) {
          this._hasGeneratedList = !1, this._previousSelection = null, this._backupSelector = "", i.call(this, e, t), this.className = t.className || "prism-" + this.Type + "-selector prism-setting-selector", this.addClass(this.className);
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class=\"header\"><div class=\"left-array\"></div><span>" + this.Name + "</span></div><ul class=\"selector-list\"></ul>", e;
        }, bindEvent: function() {
          this.bindCommonEvent();
        }, bindCommonEvent: function() {
          var o = this, e = document.querySelector("#" + o.id() + " .selector-list"),
            t = document.querySelector("#" + o.id() + " .header");
          this._player.on(u.Private.ChangeURL, function() {
            o._hasGeneratedList = !1;
          }), s.on(t, "click", function() {
            o._player.trigger(u.Private.SelectorHide), o._player.trigger(u.Private.SettingListShow, {
              type: o.Type,
              text: o._previousSelection ? o._previousSelection.text : ""
            });
          }), s.on(e, "click", function(e) {
            var t = e.srcElement || e.target, r = t.key, e = t.text;
            void 0 !== e && (o._previousSelection && a.removeClass(o._previousSelection, "current"), o._previousSelection = l.findliElementForSelector(t), a.addClass(o._previousSelection, "current"), o.execute && o.execute(r), e = o.Tooltip + "<span>" + e + "</span>", o._player.trigger(u.Private.Info_Show, {
              text: e,
              duration: 1e3,
              align: "lb"
            }));
          }), o._player.on(u.Private.SelectorHide, function() {
            r();
          }), o._player.on(u.Private.SelectorValueChange, function(e) {
            var t = e.paramData;
            if (t && t.type == o.Type) {
              var r = document.querySelectorAll("#" + o.id() + " .selector-list li");
              if (r) {
                var i = r.length;
                0 == i && (o._backupSelector = t.text);
                for (var n = 0; n < i; n++) if (r[n].text == t.text) {
                  o._previousSelection && a.removeClass(o._previousSelection, "current"), a.addClass(r[n], "current"), o._previousSelection = r[n];
                  break;
                }
              }
            }
          }), o._player.on(u.Private.SelectorShow, function(e) {
            (e = e.paramData).type == o.Type && (e = document.querySelector("#" + o._player.id() + " .prism-" + e.type + "-selector"), o._hasGeneratedList || (o._clear(), o.generateList(o._backupSelector), o._backupSelector = "", o._hasGeneratedList = !0), a.css(e, "display", "block"));
          });
          var r = function() {
            a.css(o.el(), "display", "none"), o._player.trigger(u.Private.UpdateToSettingList, {
              type: o.Type,
              text: o._previousSelection ? o._previousSelection.text : ""
            });
          }, e = n.IS_MOBILE ? "touchleave" : "mouseleave";
          s.on(this.el(), e, function() {
            r();
          }), s.on(this._player.tag, "click", function(e) {
            e && e.target == e.currentTarget && r();
          }), s.on(this._player.tag, "touchstart", function(e) {
            e && e.target == e.currentTarget && r();
          });
        }, setSelected: function(e) {
        }, generateList: function() {
        }, _clear: function() {
          document.querySelector("#" + this.id() + " .selector-list").innerHTML = "";
        }
      });
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/cookie": 217,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/object": 227,
    "../../../lib/ua": 232,
    "../../../lib/util": 234,
    "../../../player/base/event/eventtype": 244,
    "../../component": 296,
    "./util": 318
  }],
  317: [function(e, t, r) {
    var i = e("./selector"), a = e("../../../lib/object"),
      s = (e("../../../lib/util"), e("../../../lib/cookie"), e("../../../lib/dom")),
      l = (e("../../../lib/event"), e("./util"), e("../../../lib/constants")), u = e("../../../lang/index"),
      e = (e("../../../player/base/event/eventtype"), i.extend({
        init: function(e, t) {
          this.Name = u.get("Speed"), this.Type = "speed", this.Tooltip = u.get("Speed_Switch_To"), i.call(this, e, t);
        }, generateList: function() {
          var n = document.querySelector("#" + this.id() + " .selector-list"), e = l.SpeedLevels, o = this;
          a.each(e, function(e, t) {
            var r = s.createEl.call(this, "li", { key: e.key, text: e.text }),
              i = s.createEl.call(this, "span", { key: e.key, text: e.text });
            i.innerText = e.text, e.text == u.get("Speed_1X_Text") && (s.addClass(r, "current"), o._previousSelection = r), r.appendChild(i), n.appendChild(r);
          });
        }, execute: function(e) {
          this._player.setSpeed(e);
        }
      }));
    t.exports = e;
  }, {
    "../../../lang/index": 212,
    "../../../lib/constants": 216,
    "../../../lib/cookie": 217,
    "../../../lib/dom": 219,
    "../../../lib/event": 220,
    "../../../lib/object": 227,
    "../../../lib/util": 234,
    "../../../player/base/event/eventtype": 244,
    "./selector": 316,
    "./util": 318
  }],
  318: [function(e, r, t) {
    r.exports.findliElementForSelector = function(e) {
      if (!e || "li" == e.tagName.toLowerCase()) return e;
      e = e.parentElement;
      return e && "li" == e.tagName.toLowerCase() ? e : null;
    }, r.exports.findliElementByKey = function(e, t) {
      document.querySelectors(e);
      return null;
    }, r.exports.findItemElementForList = function(e) {
      if (!e || -1 < e.className.indexOf("prism-setting-item")) return e;
      var t = e.parentElement;
      return e = t ? r.exports.findItemElementForList(t) : e;
    };
  }, {}],
  319: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), u = e("../../lib/util"), o = e("../../lang/index"),
      c = e("../../player/base/event/eventtype"), a = e("./util"), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-snapshot-btn");
        }, createEl: function() {
          return i.prototype.createEl.call(this, "div");
        }, bindEvent: function() {
          var l = this;
          this._player.on(c.Private.Snapshot_Hide, function() {
            n.css(l._el, "display", "none");
          }), a.registerTooltipEvent.call(this, this.el(), o.get("Snapshot")), this.on("click", function() {
            l.trigger(c.Player.Snapshoting);
            var e = document.createElement("canvas"), t = l._player.tag, r = t.videoWidth, i = t.videoHeight,
              n = l._player._getSanpshotMatric();
            e.width = n.width || r, e.height = n.height || i;
            var o = l._player.getCurrentTime(), a = e.getContext("2d");
            a.save();
            var s = l._player.getImage();
            "vertical" == s ? (a.translate(0, e.height), a.scale(1, -1)) : "horizon" == s && (a.translate(e.width, 0), a.scale(-1, 1)), a.drawImage(t, 0, 0, r, i), a.restore(), h(a, l._player.getOptions());
            r = "", i = "";
            try {
              r = e.toDataURL("image/jpeg", n.rate || 1);
            } catch (e) {
              i = e;
            }
            a = "", e = "", n = "";
            r && (e = (a = r).substr(a.indexOf(",") + 1), n = u.toBinary(e)), l.trigger(c.Player.Snapshoted, {
              time: o,
              base64: a,
              binary: n,
              error: i
            });
          });
        }
      }), h = function(e, t) {
        t = t.snapshotWatermark;
        t && t.text && (e.font = t.font, t.fillColor && (e.fillStyle = t.fillColor, e.fillText(t.text, t.left, t.top)), t.strokeColor && (e.strokeStyle = t.strokeColor, e.strokeText(t.text, t.left, t.top)), e.stroke());
      };
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296,
    "./util": 323
  }],
  320: [function(e, t, r) {
    var i = e("../component"), s = (e("../../lib/util"), e("../../lib/dom")), n = e("../../lib/event"),
      o = (e("../../lib/ua"), e("../../lang/index"), e("../../player/base/event/eventtype")), e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-thumbnail");
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<img></img><span></span>", e;
        }, bindEvent: function() {
          var a = this;
          n.on(this._el, "mousemove", function(e) {
            e.preventDefault();
          }), n.on(this._el, "touchmove", function(e) {
            e.preventDefault();
          }), a._player.on(o.Private.ThumbnailLoaded, function(e) {
            var r, i, t = e.paramData;
            t && 0 < t.length && (e = a._player._thumbnailService.makeUrl(t[0].text), a._player.log("THUMBNAILSTART", { tu: encodeURIComponent(e) }), r = (new Date).getTime(), t[0].isBig ? (s.css(a.el(), "background", "url(" + e + ")"), s.css(a.el(), "width", t[0].w + "px"), s.css(a.el(), "height", t[0].h + "px"), a._player.log("THUMBNAILCOMPLETE", { ftt: (new Date).getTime() - r })) : ((i = document.querySelector("#" + a.id() + " img")).onload = function() {
              var e = i.width, t = i.height;
              s.css(a.el(), "width", e + "px"), s.css(a.el(), "height", t + "px"), a._player.log("THUMBNAILCOMPLETE", { ftt: (new Date).getTime() - r });
            }, i.src = e));
          }), a._player.on(o.Private.ThumbnailShow, function(o) {
            a._thumbnailShowHanlde && clearTimeout(a._thumbnailShowHanlde), a._thumbnailShowHanlde = setTimeout(function() {
              var e, t, r, i = document.querySelector("#" + a.id() + " span"), n = o.paramData;
              i.innerText = n.formatTime, n && ((e = a._player._thumbnailService.findAvailableCue(n.time)) ? e.isBig ? (r = a._player._thumbnailService.makeUrl(e.text), s.css(a.el(), "background", "url(" + r + ")"), e.w, e.h, t = -1 * e.x + "px " + -1 * e.y + "px", s.css(a.el(), "background-position", t)) : (t = document.querySelector("#" + a.id() + " img"), r = a._player._thumbnailService.makeUrl(e.text), t.src != r && (t.src = r)) : (s.css(a.el(), "border", "none"), s.css(i, "left", "0px")), s.css(a.el(), "display", "block"), r = 0, i = (e ? a.el() : i).offsetWidth, r = n.left + i > n.progressWidth ? n.left - i : (r = n.left - i / 2) < 0 ? 0 : r, s.css(a.el(), "left", r + "px"));
            }, 30);
          }), a._player.on(o.Private.ThumbnailHide, function(e) {
            a._thumbnailShowHanlde && clearTimeout(a._thumbnailShowHanlde), s.css(a.el(), "display", "none");
          });
        }, _createSamllThumbnail: function() {
        }, disposeUI: function() {
          this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde), this._thumbnailShowHanlde = null);
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../lib/ua": 232,
    "../../lib/util": 234,
    "../../player/base/event/eventtype": 244,
    "../component": 296
  }],
  321: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/util"), o = e("../../player/base/event/eventtype"), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.addClass("prism-time-display");
      }, createEl: function() {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = "<span class=\"current-time\">00:00</span> <span class=\"time-bound\">/</span> <span class=\"duration\">00:00</span>", e;
      }, bindEvent: function() {
        var t = this;
        this._player.on(o.Video.DurationChange, function() {
          var e = n.formatTime(t._player.getDisplayDuration());
          e ? (document.querySelector("#" + t.id() + " .time-bound").style.display = "inline", document.querySelector("#" + t.id() + " .duration").style.display = "inline", document.querySelector("#" + t.id() + " .duration").innerText = e) : (document.querySelector("#" + t.id() + " .duration").style.display = "none", document.querySelector("#" + t.id() + " .time-bound").style.display = "none");
        }), this._player.on(o.Video.TimeUpdate, function() {
          var e = t._player.getCurrentTime(), e = n.formatTime(e);
          document.querySelector("#" + t.id() + " .current-time") && (e ? (document.querySelector("#" + t.id() + " .current-time").style.display = "inline", document.querySelector("#" + t.id() + " .current-time").innerText = e) : document.querySelector("#" + t.id() + " .current-time").style.display = "none");
        });
      }
    });
    t.exports = e;
  }, { "../../lib/util": 234, "../../player/base/event/eventtype": 244, "../component": 296 }],
  322: [function(e, t, r) {
    var i = e("../component"), o = e("../../lib/dom"), a = e("../../player/base/event/eventtype"), e = i.extend({
      init: function(e, t) {
        i.call(this, e, t), this.addClass("prism-tooltip");
      }, createEl: function() {
        var e = i.prototype.createEl.call(this, "p");
        return e.innerText = "\u63d0\u793a\u4fe1\u606f", e;
      }, bindEvent: function() {
        var n = this;
        n._player.on(a.Private.TooltipShow, function(e) {
          var t = document.querySelector("#" + n.id()), r = e.paramData;
          t.innerText = r.text, o.css(t, "display", "block");
          var i = t.offsetWidth, e = document.querySelector("#" + n._player.id() + " .prism-controlbar");
          e && (e = e.offsetWidth, r.left + i > e ? o.css(t, "left", e - i + "px") : o.css(t, "left", r.left - (i - r.width) / 2 + "px"));
        }), n._player.on(a.Private.TooltipHide, function(e) {
          var t = document.querySelector("#" + n.id());
          o.css(t, "display", "none");
        });
      }
    });
    t.exports = e;
  }, { "../../lib/dom": 219, "../../player/base/event/eventtype": 244, "../component": 296 }],
  323: [function(e, t, r) {
    var i = e("../../lib/event"), s = e("../../player/base/event/eventtype");
    t.exports.registerTooltipEvent = function(e, n) {
      function o() {
        a._controlbarTooltipHandler && (clearTimeout(a._controlbarTooltipHandler), a._controlbarTooltipHandler = null);
      }

      var a = this;
      i.on(this.el(), "mouseover", function(e) {
        o(), a._controlbarTooltipHandler = setTimeout(function() {
          a._player.trigger(s.Private.TooltipHide);
        }, 4e3);
        var t = a.el().offsetLeft, r = a.el().offsetWidth, i = n;
        "function" == typeof i && (i = n.call(this)), a._player.trigger(s.Private.TooltipShow, {
          left: t,
          width: r,
          text: i
        });
      }), i.on(this.el(), "mouseout", function() {
        o(), a._player.trigger(s.Private.TooltipHide);
      });
    }, t.exports.throttle = function(r, i) {
      var n = Date.now();
      return function() {
        var e = arguments, t = Date.now();
        i <= t - n && (r(e), n = t);
      };
    };
  }, { "../../lib/event": 220, "../../player/base/event/eventtype": 244 }],
  324: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
      a = e("../../player/base/event/eventtype"), s = e("./util"), l = e("../../lang/index"), u = e("./volumecontrol"),
      e = i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-volume");
          var r = new u(e, t);
          e.addChild(r, t);
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class=\"volume-icon\"><div class=\"short-horizontal\"></div><div class=\"long-horizontal\"></div></div>", e;
        }, bindEvent: function() {
          var r = this;
          this.icon = document.querySelector("#" + r.id() + "  .volume-icon"), s.registerTooltipEvent.call(this, this.el(), function() {
            return r._player.muted() || 0 == r._player.getVolume() ? l.get("Muted") : l.get("Volume");
          }), o.on(this.icon, "click", function(e) {
            var t = r.el().offsetLeft;
            r._player.trigger(a.Private.SettingListHide), r._player.trigger(a.Private.SelectorHide), r._player.trigger(a.Private.VolumeVisibilityChange, t), r._player.trigger(a.Private.MarkerTextHide);
          });
          var e = document.querySelector("#" + r.id() + "  .long-horizontal"),
            t = document.querySelector("#" + r.id() + "  .short-horizontal");
          o.on(this.el(), "mouseover", function() {
            n.removeClass(e, "volume-hover-animation"), setTimeout(function() {
              n.addClass(e, "volume-hover-animation");
            }), setTimeout(function() {
              n.removeClass(e, "volume-hover-animation"), n.addClass(t, "volume-hover-animation"), setTimeout(function() {
                n.removeClass(t, "volume-hover-animation"), n.addClass(e, "volume-hover-animation");
              }, 300);
            }, 300);
          });
        }
      });
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../player/base/event/eventtype": 244,
    "../component": 296,
    "./util": 323,
    "./volumecontrol": 325
  }],
  325: [function(e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
      a = e("../../player/base/event/eventtype"), e = (e("./util"), e("../../lang/index"), i.extend({
        init: function(e, t) {
          i.call(this, e, t), this.addClass("prism-volume-control"), this._shown = !1;
        }, createEl: function() {
          var e = i.prototype.createEl.call(this, "div");
          return e.innerHTML = "<div class=\"volume-range\"><div class=\"volume-value\"></div><div class=\"volume-cursor\"></div></div>", e;
        }, bindEvent: function() {
          var r = this;
          this.icon = document.querySelector("#" + r._player.id() + "  .volume-icon"), this.control = document.querySelector("#" + r.id()), this.volumnValue = document.querySelector("#" + r.id() + "  .volume-value"), this.volumnRange = document.querySelector("#" + r.id() + "  .volume-range"), this.volumnCursor = document.querySelector("#" + r.id() + "  .volume-cursor"), this._player.on(a.Private.VolumeVisibilityChange, function(e) {
            var t = e.paramData;
            !r._shown && t ? (e = r._player.getVolume(), r._setVolumnUI(e), n.css(r.control, "display", "block"), t && n.css(r.control, "left", t - 5 + "px"), r._shown = !0) : (n.css(r.control, "display", "none"), r._shown = !1);
          }), o.on(this.volumnRange, "click", function(e) {
            e = n.getPointerPosition(r.volumnRange, e).y;
            e < 0 || 1 < e || (r._setVolumnUI(e = 1 < (e = e < 0 ? 0 : e) ? 1 : e), r._setMuteUI(e), r._player.setVolume(e));
          }), o.on(this._player.tag, "click", function(e) {
            e && e.target == e.currentTarget && n.css(r.control, "display", "none");
          }), o.on(this._player.tag, "touchstart", function(e) {
            e && e.target == e.currentTarget && n.css(r.control, "display", "none");
          }), o.on(this.volumnCursor, "mousedown", function(e) {
            r._onMouseDown(e);
          }), o.on(this.volumnCursor, "touchstart", function(e) {
            r._onMouseDown(e);
          }), this._player.on(a.Private.VolumnChanged, function(e) {
            e = e.paramData;
            -1 < e && r._setVolumnUI(e), r._setMuteUI(e);
          }), o.on(this.control, "mouseleave", function() {
            n.css(r.control, "display", "none"), r._shown = !1;
          }), o.on(this.control, "mouseover", function() {
            n.addClass(r.control, "hover");
          }), r._rangeBottom = r._getBottom();
        }, _getBottom: function() {
          if (window.getComputedStyle) {
            var e = window.getComputedStyle(this.volumnRange, null).getPropertyValue("bottom");
            return parseFloat(e);
          }
          return 26;
        }, _onMouseDown: function(e) {
          var t = this;
          e.preventDefault(), o.on(this.control, "mousemove", function(e) {
            t._onMouseMove(e);
          }), o.on(this.control, "touchmove", function(e) {
            t._onMouseMove(e);
          }), o.on(this._player.tag, "mouseup", function(e) {
            t._onMouseUp(e);
          }), o.on(this._player.tag, "touchend", function(e) {
            t._onMouseUp(e);
          }), o.on(this.control, "mouseup", function(e) {
            t._onMouseUp(e);
          }), o.on(this.control, "touchend", function(e) {
            t._onMouseUp(e);
          });
        }, _onMouseUp: function(e) {
          e.preventDefault(), this._offEvent(), this.volumnRange.offsetHeight && (e = (this.volumnValue.offsetHeight / this.volumnRange.offsetHeight).toFixed(2), this._player.setVolume(e), this._setMuteUI(e));
        }, _onMouseMove: function(e) {
          e.preventDefault();
          e = n.getPointerPosition(this.volumnRange, e).y;
          e < 0 || 1 < e || this._setVolumnUI(e = 1 < (e = e < 0 ? 0 : e) ? 1 : e);
        }, _getPosition: function(e) {
          for (var t = this.volumnRange, r = 0; t = t.offsetParent;) r += t.offsetTop;
          var i = this.volumnRange.offsetHeight, n = this.volumnCursor.offsetHeight,
            o = (e.touches ? e.touches[0] : e).pageY;
          return (i - ((o = i < o - r ? e.clientY : o) - r) + n) / (i = this.volumnRange.offsetHeight);
        }, _offEvent: function() {
          o.off(this._player.tag, "mouseup"), o.off(this._player.tag, "touchend"), o.off(this.control, "mousemove"), o.off(this.control, "touchmove"), o.off(this.control, "mouseup"), o.off(this.control, "touchend");
        }, _setMuteUI: function(e) {
          isNaN(e) || (0 == e || -1 == e ? n.addClass(this.icon, "mute") : n.removeClass(this.icon, "mute"));
        }, _setVolumnUI: function(e) {
          isNaN(e) || (n.css(this.volumnValue, "height", 100 * e + "%"), n.css(this.volumnCursor, "bottom", 100 * (e = 1 == e ? .99 : e) + "%"));
        }
      }));
    t.exports = e;
  }, {
    "../../lang/index": 212,
    "../../lib/dom": 219,
    "../../lib/event": 220,
    "../../player/base/event/eventtype": 244,
    "../component": 296,
    "./util": 323
  }],
  326: [function(e, t, r) {
    t.exports = {
      H5Loading: e("./component/h5-loading"),
      bigPlayButton: e("./component/big-play-button"),
      controlBar: e("./component/controlbar"),
      progress: e("./component/progress"),
      playButton: e("./component/play-button"),
      liveDisplay: e("./component/live-display"),
      timeDisplay: e("./component/time-display"),
      fullScreenButton: e("./component/fullscreen-button"),
      volume: e("./component/volume"),
      snapshot: e("./component/snapshot"),
      errorDisplay: e("./component/error-display"),
      infoDisplay: e("./component/info-display"),
      liveShiftProgress: e("../commonui/liveshiftprogress"),
      liveShiftTimeDisplay: e("../commonui/livetimedisplay"),
      setting: e("./component/setting/button"),
      subtitle: e("./component/cc-button"),
      thumbnail: e("./component/thumbnail"),
      tooltip: e("./component/tooltip")
    };
  }, {
    "../commonui/liveshiftprogress": 203,
    "../commonui/livetimedisplay": 204,
    "./component/big-play-button": 297,
    "./component/cc-button": 298,
    "./component/controlbar": 299,
    "./component/error-display": 301,
    "./component/fullscreen-button": 302,
    "./component/h5-loading": 303,
    "./component/info-display": 304,
    "./component/live-display": 305,
    "./component/play-button": 307,
    "./component/progress": 308,
    "./component/setting/button": 312,
    "./component/snapshot": 319,
    "./component/thumbnail": 320,
    "./component/time-display": 321,
    "./component/tooltip": 322,
    "./component/volume": 324
  }]
}, {},[206]);
