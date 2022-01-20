"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KVControlRenderer = exports.ComboControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var Item_1 = require("./Item");
var combo_1 = require("../../store/combo");
var Tabs_1 = tslib_1.__importStar(require("../../components/Tabs"));
var helper_1 = require("../../utils/helper");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var tpl_1 = require("../../utils/tpl");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var Select_1 = (0, tslib_1.__importDefault)(require("../../components/Select"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var api_1 = require("../../utils/api");
var components_1 = require("../../components");
var memoize_1 = (0, tslib_1.__importDefault)(require("lodash/memoize"));
var icons_1 = require("../../components/icons");
var mobx_state_tree_1 = require("mobx-state-tree");
function pickVars(vars, fields) {
    return fields.reduce(function (data, key) {
        data[key] = (0, tpl_builtin_1.resolveVariable)(key, vars);
        return data;
    }, {});
}
var ComboControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ComboControl, _super);
    function ComboControl(props) {
        var _this = _super.call(this, props) || this;
        _this.subForms = [];
        _this.subFormDefaultValues = [];
        _this.keys = [];
        _this.toDispose = [];
        _this.id = (0, helper_1.guid)();
        _this.refsMap = {};
        _this.makeFormRef = (0, memoize_1.default)(function (index) { return function (ref) { return _this.formRef(ref, index); }; });
        _this.memoizedFormatValue = (0, memoize_1.default)(function (strictMode, syncFields, value, index, data) {
            return (0, helper_1.createObject)((0, helper_1.extendObject)(data, (0, tslib_1.__assign)({ index: index, __index: index }, data)), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), (Array.isArray(syncFields) ? pickVars(data, syncFields) : null)));
        }, function (strictMode, syncFields, value, index, data) {
            return Array.isArray(syncFields)
                ? JSON.stringify([value, index, data, pickVars(data, syncFields)])
                : strictMode
                    ? JSON.stringify([value, index])
                    : JSON.stringify([value, index, data]);
        });
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSingleFormChange = _this.handleSingleFormChange.bind(_this);
        _this.handleSingleFormInit = _this.handleSingleFormInit.bind(_this);
        _this.handleFormInit = _this.handleFormInit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.addItem = _this.addItem.bind(_this);
        _this.removeItem = _this.removeItem.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.flush = _this.flush.bind(_this);
        _this.handleComboTypeChange = _this.handleComboTypeChange.bind(_this);
        _this.defaultValue = (0, tslib_1.__assign)({}, props.scaffold);
        var store = props.store, value = props.value, multiple = props.multiple, minLength = props.minLength, maxLength = props.maxLength, formItem = props.formItem, addHook = props.addHook;
        store.config({
            multiple: multiple,
            minLength: minLength,
            maxLength: maxLength,
            length: _this.getValueAsArray(props).length
        });
        formItem && (0, mobx_state_tree_1.isAlive)(formItem) && formItem.setSubStore(store);
        addHook && _this.toDispose.push(addHook(_this.flush, 'flush'));
        return _this;
    }
    ComboControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if ((0, helper_1.anyChanged)(['minLength', 'maxLength', 'value'], prevProps, props)) {
            var store = props.store, minLength = props.minLength, maxLength = props.maxLength, multiple = props.multiple;
            var values_1 = this.getValueAsArray(props);
            store.config({
                multiple: multiple,
                minLength: minLength,
                maxLength: maxLength,
                length: values_1.length
            });
            if (store.activeKey >= values_1.length) {
                store.setActiveKey(Math.max(0, values_1.length - 1));
            }
            // combo 进来了新的值，且这次 form 初始化时带来的新值变化，但是之前的值已经 onInit 过了
            // 所以，之前 onInit 设置进去的初始值是过时了的。这个时候修复一下。
            if (props.value !== prevProps.value &&
                !prevProps.formInited &&
                this.subFormDefaultValues.length) {
                this.subFormDefaultValues = this.subFormDefaultValues.map(function (item, index) {
                    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { values: values_1[index] });
                });
            }
        }
    };
    ComboControl.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        var formItem = this.props.formItem;
        formItem && (0, mobx_state_tree_1.isAlive)(formItem) && formItem.setSubStore(null);
        this.toDispose.forEach(function (fn) { return fn(); });
        this.toDispose = [];
        (_b = (_a = this.memoizedFormatValue.cache).clear) === null || _b === void 0 ? void 0 : _b.call(_a);
        (_d = (_c = this.makeFormRef.cache).clear) === null || _d === void 0 ? void 0 : _d.call(_c);
    };
    ComboControl.prototype.getValueAsArray = function (props) {
        if (props === void 0) { props = this.props; }
        var flat = props.flat, joinValues = props.joinValues, delimiter = props.delimiter;
        var value = props.value;
        if (joinValues && flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        else if (!Array.isArray(value)) {
            value = [];
        }
        else {
            value = value.concat();
        }
        return value;
    };
    ComboControl.prototype.addItemWith = function (condition) {
        var _a = this.props, flat = _a.flat, joinValues = _a.joinValues, delimiter = _a.delimiter, scaffold = _a.scaffold, disabled = _a.disabled, submitOnChange = _a.submitOnChange;
        if (disabled) {
            return;
        }
        var value = this.getValueAsArray();
        value.push(flat
            ? condition.scaffold || scaffold || ''
            : (0, tslib_1.__assign)({}, (condition.scaffold || scaffold)));
        this.keys.push((0, helper_1.guid)());
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        this.props.onChange(value, submitOnChange, true);
    };
    ComboControl.prototype.addItem = function () {
        var _a = this.props, flat = _a.flat, joinValues = _a.joinValues, delimiter = _a.delimiter, scaffold = _a.scaffold, disabled = _a.disabled, submitOnChange = _a.submitOnChange;
        if (disabled) {
            return;
        }
        var value = this.getValueAsArray();
        value.push(flat
            ? scaffold || ''
            : (0, tslib_1.__assign)({}, scaffold));
        this.keys.push((0, helper_1.guid)());
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        this.props.onChange(value, submitOnChange, true);
    };
    ComboControl.prototype.removeItem = function (key) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, flat, joinValues, delimiter, disabled, deleteApi, deleteConfirmText, data, env, __, value, ctx, confirmed, result;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, flat = _a.flat, joinValues = _a.joinValues, delimiter = _a.delimiter, disabled = _a.disabled, deleteApi = _a.deleteApi, deleteConfirmText = _a.deleteConfirmText, data = _a.data, env = _a.env, __ = _a.translate;
                        if (disabled) {
                            return [2 /*return*/];
                        }
                        value = this.getValueAsArray();
                        ctx = (0, helper_1.createObject)(data, value[key]);
                        if (!(0, api_1.isEffectiveApi)(deleteApi, ctx)) return [3 /*break*/, 3];
                        return [4 /*yield*/, env.confirm(deleteConfirmText ? (0, tpl_1.filter)(deleteConfirmText, ctx) : __('deleteConfirm'))];
                    case 1:
                        confirmed = _b.sent();
                        if (!confirmed) {
                            // 如果不确认，则跳过！
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, env.fetcher(deleteApi, ctx)];
                    case 2:
                        result = _b.sent();
                        if (!result.ok) {
                            env.notify('error', __('deleteFailed'));
                            return [2 /*return*/];
                        }
                        _b.label = 3;
                    case 3:
                        value.splice(key, 1);
                        this.keys.splice(key, 1);
                        if (flat && joinValues) {
                            value = value.join(delimiter || ',');
                        }
                        this.props.onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    ComboControl.prototype.handleChange = function (values, diff, _a) {
        var index = _a.index;
        var _b = this.props, flat = _b.flat, store = _b.store, joinValues = _b.joinValues, delimiter = _b.delimiter, disabled = _b.disabled, submitOnChange = _b.submitOnChange;
        if (disabled) {
            return;
        }
        var value = this.getValueAsArray();
        value[index] = flat ? values.flat : (0, tslib_1.__assign)({}, values);
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        this.props.onChange(value, submitOnChange, true);
        store.forms.forEach(function (form) {
            return (0, mobx_state_tree_1.isAlive)(form) &&
                form.items.forEach(function (item) { return item.unique && item.syncOptions(undefined, form.data); });
        });
    };
    ComboControl.prototype.handleSingleFormChange = function (values) {
        this.props.onChange((0, tslib_1.__assign)({}, values), this.props.submitOnChange, true);
    };
    ComboControl.prototype.handleFormInit = function (values, _a) {
        var index = _a.index;
        var _b = this.props, syncDefaultValue = _b.syncDefaultValue, flat = _b.flat, joinValues = _b.joinValues, delimiter = _b.delimiter, formInited = _b.formInited, onChange = _b.onChange, submitOnChange = _b.submitOnChange, setPrinstineValue = _b.setPrinstineValue;
        this.subFormDefaultValues.push({
            index: index,
            values: values,
            setted: false
        });
        if (syncDefaultValue === false ||
            this.subFormDefaultValues.length !== this.subForms.length) {
            return;
        }
        var value = this.getValueAsArray();
        var isModified = false;
        this.subFormDefaultValues = this.subFormDefaultValues.map(function (_a) {
            var index = _a.index, values = _a.values, setted = _a.setted;
            var newValue = flat ? values.flat : (0, tslib_1.__assign)({}, values);
            if (!setted && (0, helper_1.isObjectShallowModified)(value[index], newValue)) {
                value[index] = flat ? values.flat : (0, tslib_1.__assign)({}, values);
                isModified = true;
            }
            return {
                index: index,
                values: values,
                setted: true
            };
        });
        if (!isModified) {
            return;
        }
        if (flat && joinValues) {
            value = value.join(delimiter || ',');
        }
        formInited
            ? onChange(value, submitOnChange, true)
            : setPrinstineValue(value);
    };
    ComboControl.prototype.handleSingleFormInit = function (values) {
        var _a = this.props, syncDefaultValue = _a.syncDefaultValue, setPrinstineValue = _a.setPrinstineValue, value = _a.value, nullable = _a.nullable;
        if (syncDefaultValue !== false &&
            !nullable &&
            (0, helper_1.isObjectShallowModified)(value, values) &&
            setPrinstineValue) {
            setPrinstineValue((0, tslib_1.__assign)({}, values));
        }
    };
    ComboControl.prototype.handleAction = function (action) {
        var onAction = this.props.onAction;
        if (action.actionType === 'delete') {
            action.index !== void 0 && this.removeItem(action.index);
            return;
        }
        onAction && onAction.apply(null, arguments);
    };
    ComboControl.prototype.validate = function () {
        var _a = this.props, value = _a.value, minLength = _a.minLength, maxLength = _a.maxLength, messages = _a.messages, nullable = _a.nullable, __ = _a.translate;
        if (minLength && (!Array.isArray(value) || value.length < minLength)) {
            return __((messages && messages.minLengthValidateFailed) || 'Combo.minLength', { minLength: minLength });
        }
        else if (maxLength && Array.isArray(value) && value.length > maxLength) {
            return __((messages && messages.maxLengthValidateFailed) || 'Combo.maxLength', { maxLength: maxLength });
        }
        else if (this.subForms.length && (!nullable || value)) {
            return Promise.all(this.subForms.map(function (item) { return item.validate(); })).then(function (values) {
                if (~values.indexOf(false)) {
                    return __((messages && messages.validateFailed) || 'validateFailed');
                }
                return;
            });
        }
    };
    ComboControl.prototype.flush = function () {
        this.subForms.forEach(function (form) { return form.flush(); });
    };
    ComboControl.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    ComboControl.prototype.initDragging = function () {
        var _this = this;
        var ns = this.props.classPrefix;
        var submitOnChange = this.props.submitOnChange;
        var dom = (0, react_dom_1.findDOMNode)(this);
        this.sortable = new sortablejs_1.default(dom.querySelector("." + ns + "Combo-items"), {
            group: "combo-" + this.id,
            animation: 150,
            handle: "." + ns + "Combo-itemDrager",
            ghostClass: ns + "Combo-item--dragging",
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                // 换回来
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                var value = _this.props.value;
                if (!Array.isArray(value)) {
                    return;
                }
                var newValue = value.concat();
                newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
                _this.keys.splice(e.newIndex, 0, _this.keys.splice(e.oldIndex, 1)[0]);
                _this.props.onChange(newValue, submitOnChange, true);
            }
        });
    };
    ComboControl.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    ComboControl.prototype.formRef = function (ref, index) {
        if (index === void 0) { index = 0; }
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.subForms[index] = ref;
            this.refsMap[index] = ref;
        }
        else {
            var form_1 = this.refsMap[index];
            this.subForms = this.subForms.filter(function (item) { return item !== form_1; });
            this.subFormDefaultValues = this.subFormDefaultValues.filter(function (_a) {
                var dIndex = _a.index;
                return dIndex !== index;
            });
            delete this.refsMap[index];
        }
    };
    ComboControl.prototype.formatValue = function (value, index) {
        if (index === void 0) { index = -1; }
        var _a = this.props, flat = _a.flat, data = _a.data, strictMode = _a.strictMode, syncFields = _a.syncFields;
        if (flat) {
            value = {
                flat: value
            };
        }
        value = value || this.defaultValue;
        return this.memoizedFormatValue(strictMode !== false, syncFields, value, index, data);
    };
    ComboControl.prototype.pickCondition = function (value) {
        var conditions = this.props.conditions;
        return (0, find_1.default)(conditions, function (item) { return item.test && (0, tpl_1.evalExpression)(item.test, value); });
    };
    ComboControl.prototype.handleComboTypeChange = function (index, selection) {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, value = _a.value, flat = _a.flat, submitOnChange = _a.submitOnChange;
        var conditions = this.props
            .conditions;
        var condition = (0, find_1.default)(conditions, function (item) { return item.label === selection.label; });
        if (!condition) {
            return;
        }
        if (multiple) {
            var newValue = this.getValueAsArray();
            newValue.splice(index, 1, (0, tslib_1.__assign)({}, (0, tpl_builtin_1.dataMapping)(condition.scaffold || {}, newValue[index])));
            // todo 支持 flat
            onChange(newValue, submitOnChange, true);
        }
        else {
            onChange((0, tslib_1.__assign)({}, (0, tpl_builtin_1.dataMapping)(condition.scaffold || {}, value)), submitOnChange, true);
        }
    };
    ComboControl.prototype.handleTabSelect = function (key) {
        var store = this.props.store;
        store.setActiveKey(key);
    };
    ComboControl.prototype.setNull = function (e) {
        e.preventDefault();
        var onChange = this.props.onChange;
        onChange(null);
        Array.isArray(this.subForms) &&
            this.subForms.forEach(function (subForm) {
                subForm.clearErrors();
            });
    };
    ComboControl.prototype.renderPlaceholder = function () {
        var _a = this.props, placeholder = _a.placeholder, __ = _a.translate;
        return (react_1.default.createElement("span", { className: "text-muted" }, __(placeholder || 'placeholder.noData')));
    };
    ComboControl.prototype.renderTabsMode = function () {
        var _this = this;
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, tabsStyle = _a.tabsStyle, formClassName = _a.formClassName, render = _a.render, disabled = _a.disabled, store = _a.store, flat = _a.flat, subFormMode = _a.subFormMode, addButtonText = _a.addButtonText, addable = _a.addable, removable = _a.removable, typeSwitchable = _a.typeSwitchable, itemRemovableOn = _a.itemRemovableOn, delimiter = _a.delimiter, canAccessSuperData = _a.canAccessSuperData, addIcon = _a.addIcon, deleteIcon = _a.deleteIcon, tabsLabelTpl = _a.tabsLabelTpl, conditions = _a.conditions, changeImmediately = _a.changeImmediately, __ = _a.translate;
        var items = this.props.items;
        var value = this.props.value;
        if (flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        var finnalRemovable = store.removable !== false && // minLength ?
            !disabled && // 控件自身是否禁用
            removable !== false; // 是否可以删除
        if (!Array.isArray(value)) {
            return this.renderPlaceholder();
        }
        // todo 支持拖拽排序。
        return (react_1.default.createElement(Tabs_1.default, { className: 'ComboTabs', mode: tabsStyle, activeKey: store.activeKey, onSelect: this.handleTabSelect, additionBtns: !disabled ? (react_1.default.createElement("li", { className: cx("Tabs-link ComboTabs-addLink") }, store.addable && addable !== false ? (Array.isArray(conditions) && conditions.length ? (render('add-button', {
                type: 'dropdown-button',
                icon: addIcon ? (react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" })) : (''),
                label: __(addButtonText || 'Combo.add'),
                level: 'info',
                size: 'sm',
                closeOnClick: true
            }, {
                buttons: conditions.map(function (item) { return ({
                    label: item.label,
                    onClick: function (e) {
                        _this.addItemWith(item);
                        return false;
                    }
                }); })
            })) : (react_1.default.createElement("a", { onClick: this.addItem, "data-position": "left", "data-tooltip": __('Combo.add') },
                addIcon ? react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }) : null,
                react_1.default.createElement("span", null, __(addButtonText || 'Combo.add'))))) : null)) : null }, value.map(function (value, index) {
            var data = _this.formatValue(value, index);
            var condition = null;
            var toolbar = undefined;
            if (finnalRemovable && // 表达式判断单条是否可删除
                (!itemRemovableOn ||
                    (0, tpl_1.evalExpression)(itemRemovableOn, value) !== false)) {
                toolbar = (react_1.default.createElement("div", { onClick: _this.removeItem.bind(_this, index), key: "remove", className: cx("Combo-tab-delBtn " + (!store.removable ? 'is-disabled' : '')), "data-tooltip": __('delete'), "data-position": "bottom" }, deleteIcon ? (react_1.default.createElement("i", { className: deleteIcon })) : (react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))));
            }
            if (Array.isArray(conditions) && conditions.length) {
                condition = _this.pickCondition(data);
                items = condition ? condition.items : undefined;
            }
            var finnalControls = flat && items
                ? [
                    (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (items && items[0])), { name: 'flat' })
                ]
                : items;
            var hasUnique = Array.isArray(finnalControls) &&
                finnalControls.some(function (item) { return item.unique; });
            return (react_1.default.createElement(Tabs_1.Tab, { title: (0, tpl_1.filter)(tabsLabelTpl ||
                    __('{{index}}', { index: data.index + 1 }), data), key: _this.keys[index] || (_this.keys[index] = (0, helper_1.guid)()), toolbar: toolbar, eventKey: index, 
                // 不能按需渲染，因为 unique 会失效。
                mountOnEnter: !hasUnique, unmountOnExit: false },
                condition && typeSwitchable !== false ? (react_1.default.createElement("div", { className: cx('Combo-itemTag') },
                    react_1.default.createElement("label", null, __('Combo.type')),
                    react_1.default.createElement(Select_1.default, { onChange: _this.handleComboTypeChange.bind(_this, index), options: conditions.map(function (item) { return ({
                            label: item.label,
                            value: item.label
                        }); }), value: condition.label, clearable: false }))) : null,
                react_1.default.createElement("div", { className: cx("Combo-itemInner") }, finnalControls ? (render("multiple/" + index, {
                    type: 'form',
                    body: finnalControls,
                    wrapperComponent: 'div',
                    wrapWithPanel: false,
                    mode: subFormMode,
                    className: cx("Combo-form", formClassName)
                }, {
                    index: index,
                    disabled: disabled,
                    data: data,
                    onChange: _this.handleChange,
                    onInit: _this.handleFormInit,
                    onAction: _this.handleAction,
                    ref: _this.makeFormRef(index),
                    canAccessSuperData: canAccessSuperData,
                    lazyChange: changeImmediately ? false : true,
                    formLazyChange: false,
                    value: undefined,
                    formItemValue: undefined,
                    formStore: undefined
                })) : (react_1.default.createElement(components_1.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData'))))));
        })));
    };
    ComboControl.prototype.renderMultipe = function () {
        var _this = this;
        if (this.props.tabsMode) {
            return this.renderTabsMode();
        }
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, formClassName = _a.formClassName, render = _a.render, multiLine = _a.multiLine, addButtonClassName = _a.addButtonClassName, disabled = _a.disabled, store = _a.store, flat = _a.flat, subFormMode = _a.subFormMode, draggable = _a.draggable, draggableTip = _a.draggableTip, addButtonText = _a.addButtonText, addable = _a.addable, removable = _a.removable, typeSwitchable = _a.typeSwitchable, itemRemovableOn = _a.itemRemovableOn, delimiter = _a.delimiter, canAccessSuperData = _a.canAccessSuperData, addIcon = _a.addIcon, dragIcon = _a.dragIcon, deleteIcon = _a.deleteIcon, noBorder = _a.noBorder, conditions = _a.conditions, lazyLoad = _a.lazyLoad, changeImmediately = _a.changeImmediately, placeholder = _a.placeholder, __ = _a.translate;
        var items = this.props.items;
        var value = this.props.value;
        if (flat && typeof value === 'string') {
            value = value.split(delimiter || ',');
        }
        var finnalRemovable = store.removable !== false && // minLength ?
            !disabled && // 控件自身是否禁用
            removable !== false; // 是否可以删除
        return (react_1.default.createElement("div", { className: cx("Combo Combo--multi", multiLine ? "Combo--ver" : "Combo--hor", noBorder ? "Combo--noBorder" : '', disabled ? 'is-disabled' : '', !disabled && draggable && Array.isArray(value) && value.length > 1
                ? 'is-draggable'
                : '') },
            react_1.default.createElement("div", { className: cx("Combo-items") }, Array.isArray(value) && value.length ? (value.map(function (value, index, thelist) {
                var delBtn = null;
                if (finnalRemovable && // 表达式判断单条是否可删除
                    (!itemRemovableOn ||
                        (0, tpl_1.evalExpression)(itemRemovableOn, value) !== false)) {
                    delBtn = (react_1.default.createElement("a", { onClick: _this.removeItem.bind(_this, index), key: "remove", className: cx("Combo-delBtn " + (!store.removable ? 'is-disabled' : '')), "data-tooltip": __('delete'), "data-position": "bottom" }, deleteIcon ? (react_1.default.createElement("i", { className: deleteIcon })) : (react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))));
                }
                var data = _this.formatValue(value, index);
                var condition = null;
                if (Array.isArray(conditions) && conditions.length) {
                    condition = _this.pickCondition(data);
                    items = condition ? condition.items : undefined;
                }
                var finnalControls = flat && items
                    ? [
                        (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (items && items[0])), { name: 'flat' })
                    ]
                    : items;
                return (react_1.default.createElement("div", { className: cx("Combo-item"), key: _this.keys[index] || (_this.keys[index] = (0, helper_1.guid)()) },
                    !disabled && draggable && thelist.length > 1 ? (react_1.default.createElement("div", { className: cx('Combo-itemDrager') },
                        react_1.default.createElement("a", { key: "drag", "data-tooltip": __('Combo.dragDropSort'), "data-position": "bottom" }, dragIcon ? (react_1.default.createElement("i", { className: dragIcon })) : (react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))))) : null,
                    condition && typeSwitchable !== false ? (react_1.default.createElement("div", { className: cx('Combo-itemTag') },
                        react_1.default.createElement("label", null, __('Combo.type')),
                        react_1.default.createElement(Select_1.default, { onChange: _this.handleComboTypeChange.bind(_this, index), options: conditions.map(function (item) { return ({
                                label: item.label,
                                value: item.label
                            }); }), value: condition.label, clearable: false }))) : null,
                    react_1.default.createElement("div", { className: cx("Combo-itemInner") }, finnalControls ? (render("multiple/" + index, {
                        type: 'form',
                        body: finnalControls,
                        wrapperComponent: 'div',
                        wrapWithPanel: false,
                        mode: multiLine ? subFormMode : 'row',
                        className: cx("Combo-form", formClassName)
                    }, {
                        index: index,
                        disabled: disabled,
                        data: data,
                        onChange: _this.handleChange,
                        onInit: _this.handleFormInit,
                        onAction: _this.handleAction,
                        ref: _this.makeFormRef(index),
                        lazyChange: changeImmediately ? false : true,
                        formLazyChange: false,
                        lazyLoad: lazyLoad,
                        canAccessSuperData: canAccessSuperData,
                        value: undefined,
                        formItemValue: undefined,
                        formStore: undefined
                    })) : (react_1.default.createElement(components_1.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData')))),
                    delBtn));
            })) : placeholder ? (react_1.default.createElement("div", { className: cx("Combo-placeholder") }, __(placeholder))) : null),
            !disabled ? (react_1.default.createElement("div", { className: cx("Combo-toolbar") },
                store.addable && addable !== false ? (Array.isArray(conditions) && conditions.length ? (render('add-button', {
                    type: 'dropdown-button',
                    label: __(addButtonText || 'Combo.add'),
                    level: 'info',
                    size: 'sm',
                    closeOnClick: true
                }, {
                    buttons: conditions.map(function (item) { return ({
                        label: item.label,
                        onClick: function (e) {
                            _this.addItemWith(item);
                            return false;
                        }
                    }); })
                })) : (react_1.default.createElement("button", { type: "button", onClick: this.addItem, className: cx("Button Combo-addBtn", addButtonClassName), "data-tooltip": __('Combo.add') },
                    addIcon ? react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }) : null,
                    react_1.default.createElement("span", null, __(addButtonText || 'Combo.add'))))) : null,
                draggable ? (react_1.default.createElement("span", { className: cx("Combo-dragableTip"), ref: this.dragTipRef }, Array.isArray(value) && value.length > 1
                    ? __(draggableTip)
                    : '')) : null)) : null));
    };
    ComboControl.prototype.renderSingle = function () {
        var _a = this.props, conditions = _a.conditions, cx = _a.classnames, render = _a.render, value = _a.value, multiLine = _a.multiLine, formClassName = _a.formClassName, canAccessSuperData = _a.canAccessSuperData, noBorder = _a.noBorder, disabled = _a.disabled, typeSwitchable = _a.typeSwitchable, nullable = _a.nullable, __ = _a.translate;
        var items = this.props.items;
        var data = (0, helper_1.isObject)(value) ? this.formatValue(value) : this.defaultValue;
        var condition = null;
        if (Array.isArray(conditions) && conditions.length) {
            condition = this.pickCondition(data);
            items = condition ? condition.items : undefined;
        }
        return (react_1.default.createElement("div", { className: cx("Combo Combo--single", multiLine ? "Combo--ver" : "Combo--hor", noBorder ? "Combo--noBorder" : '', disabled ? 'is-disabled' : '') },
            react_1.default.createElement("div", { className: cx("Combo-item") },
                condition && typeSwitchable !== false ? (react_1.default.createElement("div", { className: cx('Combo-itemTag') },
                    react_1.default.createElement("label", null, __('Combo.type')),
                    react_1.default.createElement(Select_1.default, { onChange: this.handleComboTypeChange.bind(this, 0), options: conditions.map(function (item) { return ({
                            label: item.label,
                            value: item.label
                        }); }), value: condition.label, clearable: false }))) : null,
                react_1.default.createElement("div", { className: cx("Combo-itemInner") }, items ? (render('single', {
                    type: 'form',
                    body: items,
                    wrapperComponent: 'div',
                    wrapWithPanel: false,
                    mode: multiLine ? 'normal' : 'row',
                    className: cx("Combo-form", formClassName)
                }, {
                    disabled: disabled,
                    data: data,
                    onChange: this.handleSingleFormChange,
                    ref: this.makeFormRef(0),
                    onInit: this.handleSingleFormInit,
                    canAccessSuperData: canAccessSuperData,
                    formStore: undefined
                })) : (react_1.default.createElement(components_1.Alert2, { level: "warning", className: "m-b-none" }, __('Combo.invalidData'))))),
            value && nullable ? (react_1.default.createElement("a", { className: cx('Combo-setNullBtn'), href: "#", onClick: this.setNull }, __('clear'))) : null));
    };
    ComboControl.prototype.render = function () {
        var _a = this.props, formInited = _a.formInited, multiple = _a.multiple, className = _a.className, ns = _a.classPrefix, cx = _a.classnames, disabled = _a.disabled;
        return formInited || typeof formInited === 'undefined' ? (react_1.default.createElement("div", { className: cx("ComboControl", className) }, multiple ? this.renderMultipe() : this.renderSingle())) : null;
    };
    var _a;
    ComboControl.defaultProps = {
        minLength: 0,
        maxLength: 0,
        multiple: false,
        multiLine: false,
        addButtonClassName: '',
        formClassName: '',
        subFormMode: 'normal',
        draggableTip: '',
        addButtonText: 'Combo.add',
        canAccessSuperData: false,
        addIcon: true,
        dragIcon: '',
        deleteIcon: '',
        tabsMode: false,
        tabsStyle: '',
        placeholder: 'placeholder.empty'
    };
    ComboControl.propsList = [
        'minLength',
        'maxLength',
        'multiple',
        'multiLine',
        'addButtonClassName',
        'subFormMode',
        'draggableTip',
        'addButtonText',
        'draggable',
        'scaffold',
        'canAccessSuperData',
        'addIcon',
        'dragIcon',
        'deleteIcon',
        'noBorder',
        'conditions',
        'tabsMode',
        'tabsStyle',
        'lazyLoad',
        'changeImmediately',
        'strictMode',
        'items',
        'conditions',
        'messages',
        'formStore'
    ];
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ComboControl.prototype, "handleTabSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ComboControl.prototype, "setNull", null);
    return ComboControl;
}(react_1.default.Component));
exports.default = ComboControl;
var ComboControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ComboControlRenderer, _super);
    function ComboControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComboControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'combo',
            storeType: combo_1.ComboStore.name,
            extendsData: false
        })
    ], ComboControlRenderer);
    return ComboControlRenderer;
}(ComboControl));
exports.ComboControlRenderer = ComboControlRenderer;
var KVControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(KVControlRenderer, _super);
    function KVControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KVControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-kv',
            storeType: combo_1.ComboStore.name,
            extendsData: false
        })
    ], KVControlRenderer);
    return KVControlRenderer;
}(ComboControl));
exports.KVControlRenderer = KVControlRenderer;
//# sourceMappingURL=./renderers/Form/Combo.js.map
