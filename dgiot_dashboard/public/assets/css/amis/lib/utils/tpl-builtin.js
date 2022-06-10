"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.dataMapping = exports.resolveMapping = exports.tokenize = exports.resolveVariableAndFilter = exports.isPureVariable = exports.resolveVariable = exports.pickValues = exports.getFilters = exports.registerFilter = exports.filters = exports.stripNumber = exports.parseDuration = exports.filterDate = exports.relativeValueRe = exports.formatDuration = exports.escapeHtml = exports.prettyBytes = void 0;
var tslib_1 = require("tslib");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var isPlainObject_1 = (0, tslib_1.__importDefault)(require("lodash/isPlainObject"));
var groupBy_1 = (0, tslib_1.__importDefault)(require("lodash/groupBy"));
var helper_1 = require("./helper");
var uniqBy_1 = (0, tslib_1.__importDefault)(require("lodash/uniqBy"));
var uniq_1 = (0, tslib_1.__importDefault)(require("lodash/uniq"));
var transform_1 = (0, tslib_1.__importDefault)(require("lodash/transform"));
var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
var prettyBytes = function (num) {
    if (!Number.isFinite(num)) {
        throw new TypeError("Expected a finite number, got " + typeof num + ": " + num);
    }
    var neg = num < 0;
    if (neg) {
        num = -num;
    }
    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }
    var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1);
    var numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
    var unit = UNITS[exponent];
    return (neg ? '-' : '') + numStr + ' ' + unit;
};
exports.prettyBytes = prettyBytes;
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};
var escapeHtml = function (str) {
    return String(str).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};
exports.escapeHtml = escapeHtml;
function formatDuration(value) {
    var unit = ['秒', '分', '时', '天', '月', '季', '年'];
    var steps = [1, 60, 3600, 86400, 2592000, 7776000, 31104000];
    var len = steps.length;
    var parts = [];
    while (len--) {
        if (steps[len] && value >= steps[len]) {
            parts.push(Math.floor(value / steps[len]) + unit[len]);
            value %= steps[len];
        }
        else if (len === 0 && value) {
            parts.push((value.toFixed ? value.toFixed(2) : '0') + unit[0]);
        }
    }
    return parts.join('');
}
exports.formatDuration = formatDuration;
function makeSorter(key, method, order) {
    return function (a, b) {
        if (!a || !b) {
            return 0;
        }
        var va = (0, exports.resolveVariable)(key, a);
        var vb = (0, exports.resolveVariable)(key, b);
        var result = 0;
        if (method === 'numerical') {
            result = (parseFloat(va) || 0) - (parseFloat(vb) || 0);
        }
        else {
            result = String(va).localeCompare(String(vb));
        }
        return result * (order === 'desc' ? -1 : 1);
    };
}
var timeUnitMap = {
    year: 'Y',
    month: 'M',
    week: 'w',
    weekday: 'W',
    day: 'd',
    hour: 'h',
    minute: 'm',
    min: 'm',
    second: 's',
    millisecond: 'ms'
};
exports.relativeValueRe = /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;
var filterDate = function (value, data, format, utc) {
    if (data === void 0) { data = {}; }
    if (format === void 0) { format = 'X'; }
    if (utc === void 0) { utc = false; }
    var m, mm = utc ? moment_1.default.utc : moment_1.default;
    if (typeof value === 'string') {
        value = value.trim();
    }
    value = (0, exports.tokenize)(value, data);
    if (value && typeof value === 'string' && (m = exports.relativeValueRe.exec(value))) {
        var date = new Date();
        var step = parseInt(m[3], 10);
        var from = m[1]
            ? (0, exports.filterDate)(m[1], data, format, utc)
            : mm(/(minute|min|hour|second)s?/.test(m[4])
                ? [
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds()
                ]
                : [date.getFullYear(), date.getMonth(), date.getDate()]);
        return m[2] === '-'
            ? from.subtract(step, timeUnitMap[m[4]])
            : from.add(step, timeUnitMap[m[4]]);
        //   return from[m[2] === '-' ? 'subtract' : 'add'](step, mapping[m[4]] || m[4]);
    }
    else if (value === 'now') {
        return mm();
    }
    else if (value === 'today') {
        var date = new Date();
        return mm([date.getFullYear(), date.getMonth(), date.getDate()]);
    }
    else {
        return mm(value, format);
    }
};
exports.filterDate = filterDate;
function parseDuration(str) {
    var matches = /^((?:\-|\+)?(?:\d*\.)?\d+)(minute|min|hour|day|week|month|quarter|year|weekday|second|millisecond)s?$/.exec(str);
    if (matches) {
        var duration = moment_1.default.duration(parseFloat(matches[1]), matches[2]);
        if (moment_1.default.isDuration(duration)) {
            return duration;
        }
    }
    return;
}
exports.parseDuration = parseDuration;
// 主要用于解决 0.1+0.2 结果的精度问题导致太长
function stripNumber(number) {
    if (typeof number === 'number') {
        return parseFloat(number.toPrecision(12));
    }
    else {
        return number;
    }
}
exports.stripNumber = stripNumber;
exports.filters = {
    map: function (input, fn) {
        var arg = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            arg[_i - 2] = arguments[_i];
        }
        return Array.isArray(input) && exports.filters[fn]
            ? input.map(function (item) { return exports.filters[fn].apply(exports.filters, (0, tslib_1.__spreadArray)([item], arg, false)); })
            : input;
    },
    html: function (input) { return (0, exports.escapeHtml)(input); },
    json: function (input, tabSize) {
        if (tabSize === void 0) { tabSize = 2; }
        return tabSize
            ? JSON.stringify(input, null, parseInt(tabSize, 10))
            : JSON.stringify(input);
    },
    toJson: function (input) {
        var ret;
        try {
            ret = JSON.parse(input);
        }
        catch (e) {
            ret = null;
        }
        return ret;
    },
    toInt: function (input) { return (typeof input === 'string' ? parseInt(input, 10) : input); },
    toFloat: function (input) { return (typeof input === 'string' ? parseFloat(input) : input); },
    raw: function (input) { return input; },
    now: function () { return new Date(); },
    toDate: function (input, inputFormat) {
        if (inputFormat === void 0) { inputFormat = ''; }
        var data = (0, moment_1.default)(input, inputFormat);
        data.add();
        return data.isValid() ? data.toDate() : undefined;
    },
    fromNow: function (input, inputFormat) {
        if (inputFormat === void 0) { inputFormat = ''; }
        return (0, moment_1.default)(input, inputFormat).fromNow();
    },
    dateModify: function (input, modifier, amount, unit) {
        if (modifier === void 0) { modifier = 'add'; }
        if (amount === void 0) { amount = 0; }
        if (unit === void 0) { unit = 'days'; }
        if (!(input instanceof Date)) {
            input = new Date();
        }
        if (modifier === 'endOf' || modifier === 'startOf') {
            return (0, moment_1.default)(input)[modifier === 'endOf' ? 'endOf' : 'startOf'](amount || 'day')
                .toDate();
        }
        return (0, moment_1.default)(input)[modifier === 'add' ? 'add' : 'subtract'](parseInt(amount, 10) || 0, unit)
            .toDate();
    },
    date: function (input, format, inputFormat) {
        if (format === void 0) { format = 'LLL'; }
        if (inputFormat === void 0) { inputFormat = 'X'; }
        return (0, moment_1.default)(input, inputFormat).format(format);
    },
    number: function (input) {
        var parts = String(input).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    },
    trim: function (input) { return (typeof input === 'string' ? input.trim() : input); },
    percent: function (input, decimals) {
        if (decimals === void 0) { decimals = 0; }
        input = parseFloat(input) || 0;
        decimals = parseInt(decimals, 10) || 0;
        var whole = input * 100;
        var multiplier = Math.pow(10, decimals);
        return ((Math.round(whole * multiplier) / multiplier).toFixed(decimals) + '%');
    },
    duration: function (input) { return (input ? formatDuration(input) : input); },
    bytes: function (input) { return (input ? (0, exports.prettyBytes)(parseFloat(input)) : input); },
    round: function (input, decimals) {
        var _a;
        if (decimals === void 0) { decimals = 2; }
        if (isNaN(input)) {
            return 0;
        }
        decimals = (_a = parseInt(decimals, 10)) !== null && _a !== void 0 ? _a : 2;
        var multiplier = Math.pow(10, decimals);
        return (Math.round(input * multiplier) / multiplier).toFixed(decimals);
    },
    truncate: function (input, length, end) {
        if (typeof input !== 'string') {
            return input;
        }
        end = end || '...';
        if (length == null) {
            return input;
        }
        length = parseInt(length, 10) || 200;
        return input.substring(0, length) + (input.length > length ? end : '');
    },
    url_encode: function (input) { return encodeURIComponent(input); },
    url_decode: function (input) { return decodeURIComponent(input); },
    default: function (input, defaultValue, strict) {
        var _a;
        if (strict === void 0) { strict = false; }
        return (_a = (strict ? input : input ? input : undefined)) !== null && _a !== void 0 ? _a : (function () {
            try {
                if (defaultValue === 'undefined') {
                    return undefined;
                }
                return JSON.parse(defaultValue);
            }
            catch (e) {
                return defaultValue;
            }
        })();
    },
    join: function (input, glue) { return (input && input.join ? input.join(glue) : input); },
    split: function (input, delimiter) {
        if (delimiter === void 0) { delimiter = ','; }
        return typeof input === 'string' ? input.split(delimiter) : input;
    },
    sortBy: function (input, key, method, order) {
        if (method === void 0) { method = 'alpha'; }
        return Array.isArray(input) ? input.sort(makeSorter(key, method, order)) : input;
    },
    objectToArray: function (input, label, value) {
        if (label === void 0) { label = 'label'; }
        if (value === void 0) { value = 'value'; }
        return (0, transform_1.default)(input, function (result, v, k) {
            var _a;
            (result || (result = [])).push((_a = {},
                _a[label] = v,
                _a[value] = k,
                _a));
        }, []);
    },
    unique: function (input, key) {
        return Array.isArray(input) ? (key ? (0, uniqBy_1.default)(input, key) : (0, uniq_1.default)(input)) : input;
    },
    topAndOther: function (input, len, labelField, restLabel) {
        if (len === void 0) { len = 10; }
        if (labelField === void 0) { labelField = 'name'; }
        if (restLabel === void 0) { restLabel = '其他'; }
        if (Array.isArray(input) && len) {
            var grouped_1 = (0, groupBy_1.default)(input, function (item) {
                var index = input.indexOf(item) + 1;
                return index >= len ? len : index;
            });
            return Object.keys(grouped_1).map(function (key, index) {
                var group = grouped_1[key];
                var obj = group.reduce(function (obj, item) {
                    Object.keys(item).forEach(function (key) {
                        if (!obj.hasOwnProperty(key) || key === 'labelField') {
                            obj[key] = item[key];
                        }
                        else if (typeof item[key] === 'number' &&
                            typeof obj[key] === 'number') {
                            obj[key] += item[key];
                        }
                        else if (typeof item[key] === 'string' &&
                            /^(?:\-|\.)\d/.test(item[key]) &&
                            typeof obj[key] === 'number') {
                            obj[key] += parseFloat(item[key]) || 0;
                        }
                        else if (typeof item[key] === 'string' &&
                            typeof obj[key] === 'string') {
                            obj[key] += ", " + item[key];
                        }
                        else {
                            obj[key] = item[key];
                        }
                    });
                    return obj;
                }, {});
                if (index === len - 1) {
                    obj[labelField] = restLabel || '其他';
                }
                return obj;
            });
        }
        return input;
    },
    first: function (input) { return input && input[0]; },
    nth: function (input, nth) {
        if (nth === void 0) { nth = 0; }
        return input && input[nth];
    },
    last: function (input) { return input && (input.length ? input[input.length - 1] : null); },
    minus: function (input, step) {
        if (step === void 0) { step = 1; }
        return stripNumber((parseInt(input, 10) || 0) - parseInt(step, 10));
    },
    plus: function (input, step) {
        if (step === void 0) { step = 1; }
        return stripNumber((parseInt(input, 10) || 0) + parseInt(step, 10));
    },
    count: function (input) {
        return Array.isArray(input) || typeof input === 'string' ? input.length : 0;
    },
    sum: function (input, field) {
        if (!Array.isArray(input)) {
            return input;
        }
        var restult = input.reduce(function (sum, item) {
            return sum + (parseFloat(field ? pickValues(field, item) : item) || 0);
        }, 0);
        return stripNumber(restult);
    },
    abs: function (input) { return (typeof input === 'number' ? Math.abs(input) : input); },
    pick: function (input, path) {
        if (path === void 0) { path = '&'; }
        return Array.isArray(input) && !/^\d+$/.test(path)
            ? input.map(function (item, index) {
                return pickValues(path, (0, helper_1.createObject)({ index: index }, item));
            })
            : pickValues(path, input);
    },
    pick_if_exist: function (input, path) {
        if (path === void 0) { path = '&'; }
        return Array.isArray(input)
            ? input.map(function (item) { return (0, exports.resolveVariable)(path, item) || item; })
            : (0, exports.resolveVariable)(path, input) || input;
    },
    str2date: function (input, inputFormat, outputFormat) {
        if (inputFormat === void 0) { inputFormat = 'X'; }
        if (outputFormat === void 0) { outputFormat = 'X'; }
        return input
            ? (0, exports.filterDate)(input, this, inputFormat).format(outputFormat)
            : '';
    },
    asArray: function (input) { return (Array.isArray(input) ? input : input ? [input] : input); },
    concat: function (input) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return Array.isArray(input)
            ? input.concat.apply(input, args.map(function (arg) { return getStrOrVariable(arg, _this); })) : input;
    },
    filter: function (input, keys, expOrDirective, arg1) {
        if (!Array.isArray(input) || !keys || !expOrDirective) {
            return input;
        }
        var directive = expOrDirective;
        var fn = function () { return true; };
        if (directive === 'isTrue') {
            fn = function (value) { return !!value; };
        }
        else if (directive === 'isFalse') {
            fn = function (value) { return !value; };
        }
        else if (directive === 'isExists') {
            fn = function (value) { return typeof value !== 'undefined'; };
        }
        else if (directive === 'equals' || directive === 'equal') {
            arg1 = arg1 ? getStrOrVariable(arg1, this) : '';
            fn = function (value) { return arg1 == value; };
        }
        else if (directive === 'isIn') {
            var list_1 = arg1 ? getStrOrVariable(arg1, this) : [];
            list_1 = str2array(list_1);
            list_1 = Array.isArray(list_1) ? list_1 : list_1 ? [list_1] : [];
            fn = function (value) { return (list_1.length ? !!~list_1.indexOf(value) : true); };
        }
        else if (directive === 'notIn') {
            var list_2 = arg1 ? getStrOrVariable(arg1, this) : [];
            list_2 = str2array(list_2);
            list_2 = Array.isArray(list_2) ? list_2 : list_2 ? [list_2] : [];
            fn = function (value) { return !~list_2.indexOf(value); };
        }
        else {
            if (directive !== 'match') {
                directive = 'match';
                arg1 = expOrDirective;
            }
            arg1 = arg1 ? getStrOrVariable(arg1, this) : '';
            // 比对的值是空时直接返回。
            if (!arg1) {
                return input;
            }
            var reg_1 = (0, helper_1.string2regExp)("" + arg1, false);
            fn = function (value) { return reg_1.test(String(value)); };
        }
        // 判断keys是否为*
        var isAsterisk = /\s*\*\s*/.test(keys);
        keys = keys.split(/\s*,\s*/);
        return input.filter(function (item) {
            // 当keys为*时从item中获取key
            return (isAsterisk ? Object.keys(item) : keys).some(function (key) {
                return fn((0, exports.resolveVariable)(key, item), key, item);
            });
        });
    },
    base64Encode: function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(('0x' + p1));
        }));
    },
    base64Decode: function (str) {
        return decodeURIComponent(atob(str)
            .split('')
            .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
            .join(''));
    },
    lowerCase: function (input) {
        return input && typeof input === 'string' ? input.toLowerCase() : input;
    },
    upperCase: function (input) {
        return input && typeof input === 'string' ? input.toUpperCase() : input;
    },
    isTrue: function (input, trueValue, falseValue) {
        return getConditionValue(input, !!input, trueValue, falseValue, this);
    },
    isFalse: function (input, trueValue, falseValue) {
        return getConditionValue(input, !input, trueValue, falseValue, this);
    },
    isMatch: function (input, matchArg, trueValue, falseValue) {
        matchArg = getStrOrVariable(matchArg, this);
        return getConditionValue(input, matchArg && (0, helper_1.string2regExp)("" + matchArg, false).test(String(input)), trueValue, falseValue, this);
    },
    notMatch: function (input, matchArg, trueValue, falseValue) {
        matchArg = getStrOrVariable(matchArg, this);
        return getConditionValue(input, matchArg && !(0, helper_1.string2regExp)("" + matchArg, false).test(String(input)), trueValue, falseValue, this);
    },
    isEquals: function (input, equalsValue, trueValue, falseValue) {
        equalsValue = /^\d+$/.test(equalsValue)
            ? parseInt(equalsValue, 10)
            : getStrOrVariable(equalsValue, this);
        return getConditionValue(input, input === equalsValue, trueValue, falseValue, this);
    },
    notEquals: function (input, equalsValue, trueValue, falseValue) {
        equalsValue = /^\d+$/.test(equalsValue)
            ? parseInt(equalsValue, 10)
            : getStrOrVariable(equalsValue, this);
        return getConditionValue(input, input !== equalsValue, trueValue, falseValue, this);
    }
};
/**
 * 如果当前传入字符为：'xxx'或者"xxx"，则返回字符xxx
 * 否则去数据域中，获取变量xxx
 *
 * @param value 传入字符
 * @param data 数据域
 */
function getStrOrVariable(value, data) {
    return /^('|")(.*)\1$/.test(value)
        ? RegExp.$2
        : /^-?\d+$/.test(value)
            ? parseInt(value, 10)
            : /^(-?\d+)\.\d+?$/.test(value)
                ? parseFloat(value)
                : /^\[.*\]$/.test(value)
                    ? value
                        .substring(1, value.length - 1)
                        .split(/\s*,\s*/)
                        .filter(function (item) { return item; })
                    : /,/.test(value)
                        ? value.split(/\s*,\s*/).filter(function (item) { return item; })
                        : (0, exports.resolveVariable)(value, data);
}
function str2array(list) {
    if (list && typeof list === 'string') {
        if (/^\[.*\]$/.test(list)) {
            return list
                .substring(1, list.length - 1)
                .split(/\s*,\s*/)
                .filter(function (item) { return item; });
        }
        else {
            return list.split(/\s*,\s*/).filter(function (item) { return item; });
        }
    }
    return list;
}
function getConditionValue(input, isTrue, trueValue, falseValue, data) {
    return isTrue || (!isTrue && falseValue)
        ? getStrOrVariable(isTrue ? trueValue : falseValue, data)
        : input;
}
function registerFilter(name, fn) {
    exports.filters[name] = fn;
}
exports.registerFilter = registerFilter;
function getFilters() {
    return exports.filters;
}
exports.getFilters = getFilters;
function pickValues(names, data) {
    var _a;
    var arr;
    if (!names || ((arr = names.split(',')) && arr.length < 2)) {
        var idx = names.indexOf('~');
        if (~idx) {
            var key = names.substring(0, idx);
            var target = names.substring(idx + 1);
            return _a = {},
                _a[key] = (0, exports.resolveVariable)(target, data),
                _a;
        }
        return (0, exports.resolveVariable)(names, data);
    }
    var ret = {};
    arr.forEach(function (name) {
        var idx = name.indexOf('~');
        var target = name;
        if (~idx) {
            target = name.substring(idx + 1);
            name = name.substring(0, idx);
        }
        (0, helper_1.setVariable)(ret, name, (0, exports.resolveVariable)(target, data));
    });
    return ret;
}
exports.pickValues = pickValues;
function objectGet(data, path) {
    if (typeof data[path] !== 'undefined') {
        return data[path];
    }
    var parts = (0, helper_1.keyToPath)(path.replace(/^{|}$/g, ''));
    return parts.reduce(function (data, path) {
        if (((0, helper_1.isObject)(data) || Array.isArray(data)) && path in data) {
            return data[path];
        }
        return undefined;
    }, data);
}
function parseJson(str, defaultValue) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return defaultValue;
    }
}
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return undefined;
}
var resolveVariable = function (path, data) {
    if (data === void 0) { data = {}; }
    if (!path || !data || typeof path !== 'string') {
        return undefined;
    }
    var _a = path.split(':'), ns = _a[0], varname = _a[1];
    if (!varname && ns) {
        varname = ns;
        ns = '';
    }
    if (ns === 'window') {
        data = window;
    }
    else if (ns === 'ls' || ns === 'ss') {
        var parts = (0, helper_1.keyToPath)(varname.replace(/^{|}$/g, ''));
        var key = parts.shift();
        var raw = ns === 'ss' ? sessionStorage.getItem(key) : localStorage.getItem(key);
        if (typeof raw === 'string') {
            var data_1 = parseJson(raw, raw);
            if ((0, helper_1.isObject)(data_1) && parts.length) {
                return objectGet(data_1, parts.join('.'));
            }
            return data_1;
        }
        return undefined;
    }
    else if (ns === 'cookie') {
        var key = varname.replace(/^{|}$/g, '').trim();
        return getCookie(key);
    }
    if (varname === '$$') {
        return data;
    }
    else if (varname[0] === '$') {
        varname = path.substring(1);
    }
    else if (varname === '&') {
        return data;
    }
    return objectGet(data, varname);
};
exports.resolveVariable = resolveVariable;
function isPureVariable(path) {
    return typeof path === 'string'
        ? /^\$(?:((?:\w+\:)?[a-z0-9_.][a-z0-9_.\[\]]*)|{[^}{]+})$/i.test(path)
        : false;
}
exports.isPureVariable = isPureVariable;
var resolveVariableAndFilter = function (path, data, defaultFilter, fallbackValue) {
    if (data === void 0) { data = {}; }
    if (defaultFilter === void 0) { defaultFilter = '| html'; }
    if (fallbackValue === void 0) { fallbackValue = function (value) { return value; }; }
    if (!path) {
        return undefined;
    }
    var m = /^(\\)?\$(?:((?:\w+\:)?[a-z0-9_.][a-z0-9_.\[\]]*)|{([\s\S]+)})$/i.exec(path);
    if (!m) {
        return undefined;
    }
    var _ = m[0], escape = m[1], key = m[2], key2 = m[3];
    // 如果是转义如： `\$abc` => `$abc`
    if (escape) {
        return _.substring(1);
    }
    var finalKey = key || key2;
    // 先只支持一层吧
    finalKey = finalKey.replace(/(\\|\\\$)?\$(?:([a-zA-Z0-9_.][a-zA-Z0-9_.\[\]]*)|{([^}{]+)})/g, function (_, escape) {
        return escape
            ? _.substring(1)
            : (0, exports.resolveVariableAndFilter)(_, data, defaultFilter);
    });
    // 默认 html 转义
    if (!~finalKey.indexOf('|')) {
        finalKey += defaultFilter;
    }
    var paths = finalKey.split(/\s*\|\s*/g);
    var originalKey = finalKey;
    finalKey = paths.shift();
    var ret = (0, exports.resolveVariable)(finalKey, data);
    var prevConInputChanged = false; // 前一个类三元过滤器生效，则跳过后续类三元过滤器
    return ret == null &&
        !~originalKey.indexOf('default') &&
        !~originalKey.indexOf('now')
        ? fallbackValue(ret)
        : paths.reduce(function (input, filter) {
            var _a, _b;
            var params = filter
                .replace(/([^\\])\\([\:\\])/g, function (_, affix, content) {
                return affix + "__" + (content === ':' ? 'colon' : 'slash') + "__";
            })
                .split(':')
                .map(function (item) {
                return item.replace(/__(slash|colon)__/g, function (_, type) {
                    return type === 'colon' ? ':' : '\\';
                });
            });
            var key = params.shift();
            if (~[
                'isTrue',
                'isFalse',
                'isMatch',
                'isEquals',
                'notMatch',
                'notEquals'
            ].indexOf(key)) {
                if (prevConInputChanged) {
                    return input;
                }
                else {
                    var result = (_a = exports.filters[key]).call.apply(_a, (0, tslib_1.__spreadArray)([data, input], params, false));
                    prevConInputChanged = result !== input;
                    return result;
                }
            }
            else {
                // 后面再遇到非类三元filter就重置了吧，不影响再后面的其他三元filter
                prevConInputChanged = false;
            }
            return (_b = (exports.filters[key] || exports.filters.raw)).call.apply(_b, (0, tslib_1.__spreadArray)([data, input], params, false));
        }, ret);
};
exports.resolveVariableAndFilter = resolveVariableAndFilter;
var tokenize = function (str, data, defaultFilter) {
    if (defaultFilter === void 0) { defaultFilter = '| html'; }
    if (!str || typeof str !== 'string') {
        return str;
    }
    return str.replace(/(\\)?\$(?:((?:\w+\:)?[a-z0-9_\.][a-z0-9_\.\[\]]*|&|\$)|{([^}{]+?)})/gi, function (_, escape, key1, key2, index, source) {
        var _a;
        if (!escape && key1 === '$') {
            var prefix = source[index - 1];
            return prefix === '='
                ? encodeURIComponent(JSON.stringify(data))
                : (0, helper_1.qsstringify)(data);
        }
        return escape
            ? _.substring(1)
            : (_a = (0, exports.resolveVariableAndFilter)(_, data, defaultFilter)) !== null && _a !== void 0 ? _a : '';
    });
};
exports.tokenize = tokenize;
function resolveMapping(value, data, defaultFilter) {
    if (defaultFilter === void 0) { defaultFilter = '| raw'; }
    return typeof value === 'string' && isPureVariable(value)
        ? (0, exports.resolveVariableAndFilter)(value, data, defaultFilter, function () { return ''; })
        : typeof value === 'string' && ~value.indexOf('$')
            ? (0, exports.tokenize)(value, data, defaultFilter)
            : value;
}
exports.resolveMapping = resolveMapping;
function dataMapping(to, from, ignoreFunction) {
    if (from === void 0) { from = {}; }
    if (ignoreFunction === void 0) { ignoreFunction = false; }
    if (Array.isArray(to)) {
        return to.map(function (item) { return dataMapping(item, from, ignoreFunction); });
    }
    else if (typeof to === 'string') {
        return resolveMapping(to, from);
    }
    else if (!(0, isPlainObject_1.default)(to)) {
        return to;
    }
    var ret = {};
    Object.keys(to).forEach(function (key) {
        var value = to[key];
        var keys;
        if (typeof ignoreFunction === 'function' && ignoreFunction(key, value)) {
            // 如果被ignore，不做数据映射处理。
            (0, helper_1.setVariable)(ret, key, value);
        }
        else if (key === '&' && value === '$$') {
            ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), from);
        }
        else if (key === '&') {
            var v = (0, isPlainObject_1.default)(value) &&
                (keys = Object.keys(value)) &&
                keys.length === 1 &&
                from[keys[0].substring(1)] &&
                Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)].map(function (raw) {
                    return dataMapping(value[keys[0]], (0, helper_1.createObject)(from, raw), ignoreFunction);
                })
                : resolveMapping(value, from);
            if (Array.isArray(v) || typeof v === 'string') {
                ret = v;
            }
            else if (typeof v === 'function') {
                ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), v(from));
            }
            else {
                ret = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), v);
            }
        }
        else if (value === '$$') {
            (0, helper_1.setVariable)(ret, key, from);
        }
        else if (value && value[0] === '$') {
            var v = resolveMapping(value, from);
            (0, helper_1.setVariable)(ret, key, v);
            if (v === '__undefined') {
                (0, helper_1.deleteVariable)(ret, key);
            }
        }
        else if ((0, isPlainObject_1.default)(value) &&
            (keys = Object.keys(value)) &&
            keys.length === 1 &&
            keys[0][0] === '$' &&
            (0, isPlainObject_1.default)(value[keys[0]])) {
            // from[keys[0].substring(1)] &&
            // Array.isArray(from[keys[0].substring(1)])
            // 支持只取数组中的部分值这个需求
            // 如:
            // data: {
            //   items: {
            //     '$rows': {
            //        id: '$id',
            //        forum_id: '$forum_id'
            //      }
            //   }
            // }
            var arr = Array.isArray(from[keys[0].substring(1)])
                ? from[keys[0].substring(1)]
                : [];
            var mapping_1 = value[keys[0]];
            ret[key] = arr.map(function (raw) {
                return dataMapping(mapping_1, (0, helper_1.createObject)(from, raw), ignoreFunction);
            });
        }
        else if ((0, isPlainObject_1.default)(value)) {
            (0, helper_1.setVariable)(ret, key, dataMapping(value, from, ignoreFunction));
        }
        else if (Array.isArray(value)) {
            (0, helper_1.setVariable)(ret, key, value.map(function (value) {
                return (0, isPlainObject_1.default)(value)
                    ? dataMapping(value, from, ignoreFunction)
                    : resolveMapping(value, from);
            }));
        }
        else if (typeof value == 'string' && ~value.indexOf('$')) {
            (0, helper_1.setVariable)(ret, key, resolveMapping(value, from));
        }
        else if (typeof value === 'function' && ignoreFunction !== true) {
            (0, helper_1.setVariable)(ret, key, value(from));
        }
        else {
            (0, helper_1.setVariable)(ret, key, value);
            if (value === '__undefined') {
                (0, helper_1.deleteVariable)(ret, key);
            }
        }
    });
    return ret;
}
exports.dataMapping = dataMapping;
function matchSynatax(str) {
    var from = 0;
    while (true) {
        var idx = str.indexOf('$', from);
        if (~idx) {
            var nextToken = str[idx + 1];
            // 如果没有下一个字符，或者下一个字符是引号或者空格
            // 这个一般不是取值用法
            if (!nextToken || ~['"', "'", ' '].indexOf(nextToken)) {
                from = idx + 1;
                continue;
            }
            // 如果上个字符是转义也不是取值用法
            var prevToken = str[idx - 1];
            if (prevToken && prevToken === '\\') {
                from = idx + 1;
                continue;
            }
            return true;
        }
        else {
            break;
        }
    }
    return false;
}
function register() {
    return {
        name: 'builtin',
        test: function (str) { return typeof str === 'string' && matchSynatax(str); },
        removeEscapeToken: function (str) {
            return typeof str === 'string' ? str.replace(/\\\$/g, '$') : str;
        },
        compile: function (str, data, defaultFilter) {
            if (defaultFilter === void 0) { defaultFilter = '| html'; }
            return (0, exports.tokenize)(str, data, defaultFilter);
        }
    };
}
exports.register = register;
//# sourceMappingURL=./utils/tpl-builtin.js.map
