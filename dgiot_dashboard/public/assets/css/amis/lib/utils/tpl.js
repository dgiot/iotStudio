"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalJS = exports.setCustomEvalJs = exports.evalExpression = exports.setCustomEvalExpression = exports.filter = exports.registerTplEnginer = void 0;
var tslib_1 = require("tslib");
var tpl_builtin_1 = require("./tpl-builtin");
var tpl_lodash_1 = require("./tpl-lodash");
var enginers = {};
function registerTplEnginer(name, enginer) {
    enginers[name] = enginer;
}
exports.registerTplEnginer = registerTplEnginer;
function filter(tpl, data) {
    if (data === void 0) { data = {}; }
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    if (!tpl || typeof tpl !== 'string') {
        return '';
    }
    var keys = Object.keys(enginers);
    for (var i = 0, len = keys.length; i < len; i++) {
        var enginer = enginers[keys[i]];
        if (enginer.test(tpl)) {
            return enginer.compile.apply(enginer, (0, tslib_1.__spreadArray)([tpl, data], rest, false));
        }
        else if (enginer.removeEscapeToken) {
            tpl = enginer.removeEscapeToken(tpl);
        }
    }
    return tpl;
}
exports.filter = filter;
// 缓存一下提升性能
var EVAL_CACHE = {};
var customEvalExpressionFn;
function setCustomEvalExpression(fn) {
    customEvalExpressionFn = fn;
}
exports.setCustomEvalExpression = setCustomEvalExpression;
// 几乎所有的 visibleOn requiredOn 都是通过这个方法判断出来结果，很粗暴也存在风险，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalExpression 来替换。
function evalExpression(expression, data) {
    if (typeof customEvalExpressionFn === 'function') {
        return customEvalExpressionFn(expression, data);
    }
    if (!expression || typeof expression !== 'string') {
        return false;
    }
    /* jshint evil:true */
    try {
        var debug = false;
        var idx = expression.indexOf('debugger');
        if (~idx) {
            debug = true;
            expression = expression.replace(/debugger;?/, '');
        }
        var fn = void 0;
        if (expression in EVAL_CACHE) {
            fn = EVAL_CACHE[expression];
        }
        else {
            fn = new Function('data', 'utils', "with(data) {" + (debug ? 'debugger;' : '') + "return !!(" + expression + ");}");
            EVAL_CACHE[expression] = fn;
        }
        data = data || {};
        return fn.call(data, data, (0, tpl_builtin_1.getFilters)());
    }
    catch (e) {
        console.warn(expression, e);
        return false;
    }
}
exports.evalExpression = evalExpression;
var customEvalJsFn;
function setCustomEvalJs(fn) {
    customEvalJsFn = fn;
}
exports.setCustomEvalJs = setCustomEvalJs;
// 这个主要用在 formula 里面，用来动态的改变某个值。也很粗暴，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalJs 来替换。
function evalJS(js, data) {
    if (typeof customEvalJsFn === 'function') {
        return customEvalJsFn(js, data);
    }
    /* jshint evil:true */
    try {
        var fn = new Function('data', 'utils', "with(data) {" + (/^\s*return\b/.test(js) ? '' : 'return ') + js + ";}");
        data = data || {};
        return fn.call(data, data, (0, tpl_builtin_1.getFilters)());
    }
    catch (e) {
        console.warn(js, e);
        return null;
    }
}
exports.evalJS = evalJS;
[tpl_builtin_1.register, tpl_lodash_1.register].forEach(function (fn) {
    var info = fn();
    registerTplEnginer(info.name, {
        test: info.test,
        compile: info.compile,
        removeEscapeToken: info.removeEscapeToken
    });
});
//# sourceMappingURL=./utils/tpl.js.map
