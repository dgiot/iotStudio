"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFormItemStore = exports.FormStore = void 0;
var tslib_1 = require("tslib");
var mobx_state_tree_1 = require("mobx-state-tree");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var service_1 = require("./service");
var formItem_1 = require("./formItem");
Object.defineProperty(exports, "IFormItemStore", { enumerable: true, get: function () { return formItem_1.IFormItemStore; } });
var errors_1 = require("../utils/errors");
var helper_1 = require("../utils/helper");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var flatten_1 = (0, tslib_1.__importDefault)(require("lodash/flatten"));
var tpl_1 = require("../utils/tpl");
exports.FormStore = service_1.ServiceStore.named('FormStore')
    .props({
    inited: false,
    validated: false,
    submited: false,
    submiting: false,
    savedData: mobx_state_tree_1.types.frozen(),
    // items: types.optional(types.array(types.late(() => FormItemStore)), []),
    canAccessSuperData: true,
    persistData: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.string, mobx_state_tree_1.types.boolean), ''),
    restError: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.string), []) // 没有映射到表达项上的 errors
})
    .views(function (self) {
    function getItems() {
        var formItems = [];
        // 查找孩子节点中是 formItem 的表单项
        var pool = self.children.concat();
        while (pool.length) {
            var current = pool.shift();
            if (current.storeType === formItem_1.FormItemStore.name) {
                formItems.push(current);
            }
            else {
                pool.push.apply(pool, current.children);
            }
        }
        return formItems;
    }
    return {
        get loading() {
            return self.saving || self.fetching;
        },
        get items() {
            return getItems();
        },
        get errors() {
            var errors = {};
            getItems().forEach(function (item) {
                if (!item.valid) {
                    errors[item.name] = Array.isArray(errors[item.name])
                        ? errors[item.name].concat(item.errors)
                        : item.errors.concat();
                }
            });
            return errors;
        },
        getValueByName: function (name, canAccessSuperData) {
            if (canAccessSuperData === void 0) { canAccessSuperData = self.canAccessSuperData; }
            return (0, helper_1.getVariable)(self.data, name, canAccessSuperData);
        },
        getPristineValueByName: function (name) {
            return (0, helper_1.getVariable)(self.pristine, name);
        },
        getItemById: function (id) {
            return getItems().find(function (item) { return item.itemId === id; });
        },
        getItemByName: function (name) {
            return getItems().find(function (item) { return item.name === name; });
        },
        getItemsByName: function (name) {
            return getItems().filter(function (item) { return item.name === name; });
        },
        get valid() {
            return (getItems().every(function (item) { return item.valid; }) &&
                (!self.restError || !self.restError.length));
        },
        get validating() {
            return getItems().some(function (item) { return item.validating; });
        },
        get isPristine() {
            return (0, isEqual_1.default)(self.pristine, self.data);
        },
        get modified() {
            if (self.savedData) {
                return self.savedData !== self.data;
            }
            return !this.isPristine;
        },
        get persistKey() {
            return location.pathname + "/" + self.path + "/" + (typeof self.persistData === 'string'
                ? (0, tpl_1.filter)(self.persistData, self.data)
                : self.persistData);
        }
    };
})
    .actions(function (self) {
    function setValues(values, tag, replace) {
        self.updateData(values, tag, replace);
        // 如果数据域中有数据变化，就都reset一下，去掉之前残留的验证消息
        self.items.forEach(function (item) { return item.reset(); });
        // 同步 options
        syncOptions();
    }
    function setValueByName(name, value, isPristine, force) {
        if (isPristine === void 0) { isPristine = false; }
        if (force === void 0) { force = false; }
        // 没有变化就不跑了。
        var origin = (0, helper_1.getVariable)(self.data, name, false);
        var prev = self.data;
        var data = (0, helper_1.cloneObject)(self.data);
        if (value !== origin) {
            if (prev.__prev) {
                // 基于之前的 __prev 改
                var prevData = (0, helper_1.cloneObject)(prev.__prev);
                (0, helper_1.setVariable)(prevData, name, origin);
                Object.defineProperty(data, '__prev', {
                    value: prevData,
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
            else {
                Object.defineProperty(data, '__prev', {
                    value: (0, tslib_1.__assign)({}, prev),
                    enumerable: false,
                    configurable: false,
                    writable: false
                });
            }
        }
        else if (!force) {
            return;
        }
        (0, helper_1.setVariable)(data, name, value);
        if (isPristine) {
            var pristine = (0, helper_1.cloneObject)(self.pristine);
            (0, helper_1.setVariable)(pristine, name, value);
            self.pristine = pristine;
        }
        if (!data.__pristine) {
            Object.defineProperty(data, '__pristine', {
                value: self.pristine,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        self.data = data;
        // 同步 options
        syncOptions();
    }
    function deleteValueByName(name) {
        var prev = self.data;
        var data = (0, helper_1.cloneObject)(self.data);
        if (prev.__prev) {
            // 基于之前的 __prev 改
            var prevData = (0, helper_1.cloneObject)(prev.__prev);
            (0, helper_1.setVariable)(prevData, name, (0, helper_1.getVariable)(prev, name));
            Object.defineProperty(data, '__prev', {
                value: prevData,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        else {
            Object.defineProperty(data, '__prev', {
                value: (0, tslib_1.__assign)({}, prev),
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
        (0, helper_1.deleteVariable)(data, name);
        self.data = data;
    }
    function trimValues() {
        var data = (0, helper_1.mapObject)(self.data, function (item) {
            return typeof item === 'string' ? item.trim() : item;
        });
        self.updateData(data);
    }
    var syncOptions = (0, debounce_1.default)(function () { return self.items.forEach(function (item) { return item.syncOptions(undefined, self.data); }); }, 250, {
        trailing: true,
        leading: false
    });
    function setRestError(errors) {
        self.restError.replace(errors);
    }
    function addRestError(msg) {
        var msgs = Array.isArray(msg) ? msg : [msg];
        msgs.forEach(function (msg) {
            self.restError.push(msg);
        });
    }
    function clearRestError() {
        setRestError([]);
    }
    var saveRemote = (0, mobx_state_tree_1.flow)(function saveRemote(api, data, options) {
        var ret, json, ret, e_1, result;
        var _a, _b, _c, _d;
        if (options === void 0) { options = {}; }
        return (0, tslib_1.__generator)(this, function (_e) {
            switch (_e.label) {
                case 0:
                    clearRestError();
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 10, , 11]);
                    options = (0, tslib_1.__assign)({ method: 'post' }, options);
                    if (!(options && options.beforeSend)) return [3 /*break*/, 4];
                    ret = options.beforeSend(data);
                    if (!(ret && ret.then)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ret];
                case 2:
                    ret = _e.sent();
                    _e.label = 3;
                case 3:
                    if (ret === false) {
                        return [2 /*return*/];
                    }
                    _e.label = 4;
                case 4:
                    self.markSaving(true);
                    return [4 /*yield*/, (0, mobx_state_tree_1.getEnv)(self).fetcher(api, data, options)];
                case 5:
                    json = _e.sent();
                    // 失败也同样修改数据，如果有数据的话。
                    if (!(0, helper_1.isEmpty)(json.data) || json.ok) {
                        self.updatedAt = Date.now();
                        setValues(json.data, json.ok
                            ? {
                                __saved: Date.now()
                            }
                            : undefined, !!api.replaceData);
                    }
                    if (!!json.ok) return [3 /*break*/, 6];
                    // 验证错误
                    if (json.status === 422 && json.errors) {
                        handleRemoteError(json.errors);
                        self.updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : self.__(options && options.errorMessage)) !== null && _b !== void 0 ? _b : self.__('Form.validateFailed'), true);
                    }
                    else {
                        self.updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : self.__(options && options.errorMessage), true);
                    }
                    throw new errors_1.ServerError(self.msg, json);
                case 6:
                    updateSavedData();
                    if (!(options && options.onSuccess)) return [3 /*break*/, 8];
                    ret = options.onSuccess(json);
                    if (!(ret && ret.then)) return [3 /*break*/, 8];
                    return [4 /*yield*/, ret];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    self.markSaving(false);
                    self.updateMessage((_d = json.msg) !== null && _d !== void 0 ? _d : self.__(options && options.successMessage));
                    self.msg &&
                        (0, mobx_state_tree_1.getEnv)(self).notify('success', self.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    return [2 /*return*/, json.data];
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _e.sent();
                    self.markSaving(false);
                    if (!(0, mobx_state_tree_1.isAlive)(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    if (e_1.type === 'ServerError') {
                        result = e_1.response;
                        (0, mobx_state_tree_1.getEnv)(self).notify('error', e_1.message, result.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: result.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        (0, mobx_state_tree_1.getEnv)(self).notify('error', e_1.message);
                    }
                    throw e_1;
                case 11: return [2 /*return*/];
            }
        });
    });
    function handleRemoteError(errors) {
        Object.keys(errors).forEach(function (key) {
            var item = self.getItemById(key);
            var items = self.getItemsByName(key);
            if (item) {
                item.setError(errors[key]);
                delete errors[key];
            }
            else if (items.length) {
                // 通过 name 直接找到的
                items.forEach(function (item) { return item.setError(errors[key], 'remote'); });
                delete errors[key];
            }
            else {
                // 尝试通过path寻找
                var items_1 = getItemsByPath(key);
                if (Array.isArray(items_1) && items_1.length) {
                    items_1.forEach(function (item) { return item.setError("" + errors[key]); });
                    delete errors[key];
                }
            }
        });
        // 没有映射上的error信息加在msg后显示出来
        !(0, helper_1.isEmpty)(errors) &&
            setRestError(Object.keys(errors).map(function (key) { return String(errors[key]); }));
    }
    var getItemsByPath = function (key) {
        var paths = (0, helper_1.keyToPath)(key);
        var len = paths.length;
        return paths.reduce(function (stores, path, idx) {
            if (Array.isArray(stores) && stores.every(function (s) { return s.getItemsByName; })) {
                var items = (0, flatten_1.default)(stores.map(function (s) { return s.getItemsByName(path); })).filter(function (i) { return i; });
                var subStores = items
                    .map(function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.getSubStore) === null || _a === void 0 ? void 0 : _a.call(item); })
                    .filter(function (i) { return i; });
                return subStores.length && idx < len - 1 ? subStores : items;
            }
            return null;
        }, [self]);
    };
    var submit = (0, mobx_state_tree_1.flow)(function submit(fn, hooks, failedMessage) {
        var valid, msg_1, env, diff, result;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    self.submited = true;
                    self.submiting = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 6]);
                    return [4 /*yield*/, validate(hooks)];
                case 2:
                    valid = _a.sent();
                    // 如果不是valid，而且有包含不是remote的报错的表单项时，不可提交
                    if ((!valid &&
                        self.items.some(function (item) {
                            return item.errorData.some(function (e) { return e.tag !== 'remote'; });
                        })) ||
                        self.restError.length) {
                        msg_1 = failedMessage !== null && failedMessage !== void 0 ? failedMessage : self.__('Form.validateFailed');
                        env = (0, mobx_state_tree_1.getEnv)(self);
                        // 同时也列出所有表单项报错，方便在很长的表单中知道是哪个字段的问题
                        // 支持在env中配hideValidateFailedDetail来隐藏所有表单项报错
                        failedMessage == null &&
                            !env.hideValidateFailedDetail &&
                            self.items.forEach(function (item) {
                                item.errorData.forEach(function (errorData) {
                                    msg_1 = msg_1 + "\n" + errorData.msg;
                                });
                            });
                        msg_1 && env.notify('error', msg_1);
                        throw new Error(msg_1);
                    }
                    if (!fn) return [3 /*break*/, 4];
                    diff = (0, helper_1.difference)(self.data, self.pristine);
                    return [4 /*yield*/, fn((0, helper_1.createObject)((0, helper_1.createObject)(self.data.__super, {
                            diff: diff,
                            __diff: diff,
                            pristine: self.pristine
                        }), self.data))];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result !== null && result !== void 0 ? result : self.data];
                case 4: return [2 /*return*/, self.data];
                case 5:
                    self.submiting = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
    var validate = (0, mobx_state_tree_1.flow)(function validate(hooks, forceValidate) {
        var items, i, len, item, i, len;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    self.validated = true;
                    items = self.items.concat();
                    i = 0, len = items.length;
                    _a.label = 1;
                case 1:
                    if (!(i < len)) return [3 /*break*/, 4];
                    item = items[i];
                    if (!(!item.validated ||
                        item.unique ||
                        forceValidate ||
                        !!item.validateApi)) return [3 /*break*/, 3];
                    return [4 /*yield*/, item.validate(self.data)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(hooks && hooks.length)) return [3 /*break*/, 8];
                    i = 0, len = hooks.length;
                    _a.label = 5;
                case 5:
                    if (!(i < len)) return [3 /*break*/, 8];
                    return [4 /*yield*/, hooks[i]()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, self.valid];
            }
        });
    });
    var validateFields = (0, mobx_state_tree_1.flow)(function validateFields(fields) {
        var items, result, i, len, item, _a, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    items = self.items.concat();
                    result = [];
                    i = 0, len = items.length;
                    _c.label = 1;
                case 1:
                    if (!(i < len)) return [3 /*break*/, 4];
                    item = items[i];
                    if (!~fields.indexOf(item.name)) return [3 /*break*/, 3];
                    _b = (_a = result).push;
                    return [4 /*yield*/, item.validate(self.data)];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result.every(function (item) { return item; })];
            }
        });
    });
    function clearErrors() {
        var items = self.items.concat();
        items.forEach(function (item) { return item.reset(); });
    }
    function reset(cb, resetData) {
        if (resetData === void 0) { resetData = true; }
        if (resetData) {
            self.data = self.pristine;
        }
        // 值可能变了，重新验证一次。
        self.validated = false;
        self.submited = false;
        self.items.forEach(function (item) { return item.reset(); });
        cb && cb(self.data);
    }
    function clear(cb) {
        var toClear = {};
        self.items.forEach(function (item) {
            if (item.name && item.type !== 'hidden') {
                (0, helper_1.setVariable)(toClear, item.name, item.resetValue);
            }
        });
        setValues(toClear);
        self.validated = false;
        self.submited = false;
        self.items.forEach(function (item) { return item.reset(); });
        cb && cb(self.data);
    }
    function setCanAccessSuperData(value) {
        if (value === void 0) { value = true; }
        self.canAccessSuperData = value;
    }
    function setInited(value) {
        self.inited = value;
    }
    function setPersistData(value) {
        if (value === void 0) { value = ''; }
        self.persistData = value;
    }
    var setLocalPersistData = (0, debounce_1.default)(function () { return localStorage.setItem(self.persistKey, JSON.stringify(self.data)); }, 250, {
        trailing: true,
        leading: false
    });
    function getLocalPersistData() {
        var data = localStorage.getItem(self.persistKey);
        if (data) {
            self.updateData(JSON.parse(data));
        }
    }
    function clearLocalPersistData() {
        localStorage.removeItem(self.persistKey);
    }
    function updateSavedData() {
        self.savedData = self.data;
    }
    return {
        setInited: setInited,
        setValues: setValues,
        setValueByName: setValueByName,
        trimValues: trimValues,
        submit: submit,
        validate: validate,
        validateFields: validateFields,
        clearErrors: clearErrors,
        saveRemote: saveRemote,
        reset: reset,
        syncOptions: syncOptions,
        setCanAccessSuperData: setCanAccessSuperData,
        deleteValueByName: deleteValueByName,
        getLocalPersistData: getLocalPersistData,
        setLocalPersistData: setLocalPersistData,
        clearLocalPersistData: clearLocalPersistData,
        setPersistData: setPersistData,
        clear: clear,
        updateSavedData: updateSavedData,
        handleRemoteError: handleRemoteError,
        getItemsByPath: getItemsByPath,
        setRestError: setRestError,
        addRestError: addRestError,
        clearRestError: clearRestError,
        beforeDestroy: function () {
            syncOptions.cancel();
            setLocalPersistData.cancel();
        }
    };
});
//# sourceMappingURL=./store/form.js.map
