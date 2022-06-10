"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var helper_1 = require("../utils/helper");
var findIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findIndex"));
var Tabs_1 = require("../components/Tabs");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var api_1 = require("../utils/api");
var Tabs = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tabs, _super);
    function Tabs(props) {
        var _this = _super.call(this, props) || this;
        var location = props.location || window.location;
        var tabs = props.tabs;
        var activeKey = 0;
        if (typeof props.activeKey !== 'undefined') {
            activeKey = props.activeKey;
        }
        else if (location && Array.isArray(tabs)) {
            var hash_1 = location.hash.substring(1);
            var tab = (0, find_1.default)(tabs, function (tab) { return tab.hash === hash_1; });
            if (tab) {
                activeKey = tab.hash;
            }
            else if (props.defaultActiveKey) {
                activeKey = (0, tpl_builtin_1.tokenize)(props.defaultActiveKey, props.data);
            }
            activeKey = activeKey || (tabs[0] && tabs[0].hash) || 0;
        }
        _this.state = {
            prevKey: undefined,
            activeKey: (_this.activeKey = activeKey)
        };
        return _this;
    }
    Tabs.prototype.componentDidMount = function () {
        var _a, _b;
        this.autoJumpToNeighbour(this.activeKey);
        var _c = this.props, name = _c.name, value = _c.value, onChange = _c.onChange, source = _c.source, tabs = _c.tabs, data = _c.data;
        // 如果没有配置 name ，说明不需要同步表单值
        if (!name ||
            typeof onChange !== 'function' ||
            // 如果关联某个变量数据，则不启用
            source) {
            return;
        }
        value = value !== null && value !== void 0 ? value : (0, helper_1.getVariable)(data, name);
        //  如果有值，切到对应的 tab
        if (value && Array.isArray(tabs)) {
            var key = this.resolveKeyByValue(value);
            key !== undefined && this.handleSelect(key);
        }
        else {
            var tab = this.resolveTabByKey(this.activeKey);
            if (tab && value !== ((_a = tab.value) !== null && _a !== void 0 ? _a : tab.title)) {
                onChange((_b = tab.value) !== null && _b !== void 0 ? _b : tab.title, name);
            }
        }
    };
    Tabs.prototype.componentDidUpdate = function (preProps, prevState) {
        var _a, _b, _c;
        var props = this.props;
        if (props.location && props.location.hash !== preProps.location.hash) {
            var hash_2 = props.location.hash.substring(1);
            if (!hash_2) {
                return;
            }
            var tab = (0, find_1.default)(props.tabs, function (tab) { return tab.hash === hash_2; });
            if (tab && tab.hash && tab.hash !== this.state.activeKey) {
                this.setState({
                    activeKey: (this.activeKey = tab.hash),
                    prevKey: this.state.activeKey
                });
            }
        }
        else if (Array.isArray(props.tabs) &&
            Array.isArray(preProps.tabs) &&
            JSON.stringify(props.tabs.map(function (item) { return item.hash; })) !==
                JSON.stringify(preProps.tabs.map(function (item) { return item.hash; }))) {
            var activeKey_1 = this.state.activeKey;
            var location = props.location;
            var tab = null;
            if (location && Array.isArray(props.tabs)) {
                var hash_3 = location.hash.substring(1);
                tab = (0, find_1.default)(props.tabs, function (tab) { return tab.hash === hash_3; });
            }
            if (tab) {
                activeKey_1 = tab.hash;
            }
            else if (!props.tabs ||
                !props.tabs.some(function (item, index) {
                    return item.hash ? item.hash === activeKey_1 : index === activeKey_1;
                })) {
                activeKey_1 = (props.tabs && props.tabs[0] && props.tabs[0].hash) || 0;
            }
            this.setState({
                prevKey: undefined,
                activeKey: (this.activeKey = activeKey_1)
            });
        }
        this.autoJumpToNeighbour(this.activeKey);
        var _d = this.props, name = _d.name, value = _d.value, onChange = _d.onChange, source = _d.source, data = _d.data;
        // 如果没有配置 name ，说明不需要同步表单值
        if (!name ||
            typeof onChange !== 'function' ||
            // 如果关联某个变量数据，则不启用
            source) {
            return;
        }
        var key;
        value = value !== null && value !== void 0 ? value : (0, helper_1.getVariable)(data, name);
        var prevValue = (_a = preProps.value) !== null && _a !== void 0 ? _a : (0, helper_1.getVariable)(preProps.data, preProps.name);
        if (value !== prevValue &&
            (key = this.resolveKeyByValue(value)) !== undefined &&
            key !== this.activeKey) {
            this.handleSelect(key);
        }
        else if (this.activeKey !== prevState.activeKey) {
            var tab = this.resolveTabByKey(this.activeKey);
            if (tab && value !== ((_b = tab.value) !== null && _b !== void 0 ? _b : tab.title)) {
                onChange((_c = tab.value) !== null && _c !== void 0 ? _c : tab.title, name);
            }
        }
    };
    Tabs.prototype.resolveTabByKey = function (key) {
        var tabs = this.props.tabs;
        if (!Array.isArray(tabs)) {
            return;
        }
        return (0, find_1.default)(tabs, function (tab, index) {
            return tab.hash ? tab.hash === key : index === key;
        });
    };
    Tabs.prototype.resolveKeyByValue = function (value) {
        var tabs = this.props.tabs;
        if (!Array.isArray(tabs)) {
            return;
        }
        var tab = (0, find_1.default)(tabs, function (tab) { var _a; return ((_a = tab.value) !== null && _a !== void 0 ? _a : tab.title) === value; });
        return tab && tab.hash ? tab.hash : tabs.indexOf(tab);
    };
    Tabs.prototype.autoJumpToNeighbour = function (key) {
        var _a = this.props, tabs = _a.tabs, data = _a.data;
        if (!Array.isArray(tabs)) {
            return;
        }
        // 当前 tab 可能不可见，所以需要自动切到一个可见的 tab, 向前找，找一圈
        var tabIndex = (0, findIndex_1.default)(tabs, function (tab, index) {
            return tab.hash ? tab.hash === key : index === key;
        });
        if (tabs[tabIndex] && !(0, helper_1.isVisible)(tabs[tabIndex], this.props.data)) {
            var len = tabs.length;
            var i = tabIndex - 1 + len;
            var tries = len - 1;
            while (tries--) {
                var index = i-- % len;
                if ((0, helper_1.isVisible)(tabs[index], data)) {
                    var activeKey = tabs[index].hash || index;
                    this.setState({
                        activeKey: (this.activeKey = activeKey)
                    });
                    break;
                }
            }
        }
    };
    Tabs.prototype.handleSelect = function (key) {
        var _a = this.props, env = _a.env, onSelect = _a.onSelect;
        // 是 hash，需要更新到地址栏
        if (typeof key === 'string' && env) {
            env.updateLocation("#" + key);
        }
        else if (typeof this.state.activeKey === 'string' && env) {
            env.updateLocation("#");
        }
        this.setState({
            activeKey: (this.activeKey = key),
            prevKey: this.state.activeKey
        });
        if (typeof onSelect === 'string') {
            var selectFunc = (0, api_1.str2AsyncFunction)(onSelect, 'key', 'props');
            selectFunc && selectFunc(key, this.props);
        }
        else if (typeof onSelect === 'function') {
            onSelect(key, this.props);
        }
    };
    Tabs.prototype.switchTo = function (index) {
        var tabs = this.props.tabs;
        Array.isArray(tabs) &&
            tabs[index] &&
            this.setState({
                activeKey: (this.activeKey = tabs[index].hash || index)
            });
    };
    Tabs.prototype.currentIndex = function () {
        var _this = this;
        var tabs = this.props.tabs;
        return Array.isArray(tabs)
            ? (0, findIndex_1.default)(tabs, function (tab, index) {
                return tab.hash
                    ? tab.hash === _this.state.activeKey
                    : index === _this.state.activeKey;
            })
            : -1;
    };
    Tabs.prototype.renderToolbar = function () {
        var _a = this.props, toolbar = _a.toolbar, render = _a.render, cx = _a.classnames, toolbarClassName = _a.toolbarClassName;
        return toolbar ? (react_1.default.createElement("div", { className: cx("Tabs-toolbar", toolbarClassName) }, render('toolbar', toolbar))) : null;
    };
    Tabs.prototype.renderTabs = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, ns = _a.classPrefix, contentClassName = _a.contentClassName, linksClassName = _a.linksClassName, tabRender = _a.tabRender, className = _a.className, render = _a.render, data = _a.data, dMode = _a.mode, tabsMode = _a.tabsMode, unmountOnExit = _a.unmountOnExit, source = _a.source, formStore = _a.formStore, formMode = _a.formMode, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal, scrollable = _a.scrollable;
        var mode = tabsMode || dMode;
        var arr = (0, tpl_builtin_1.resolveVariable)(source, data);
        var mountOnEnter = this.props.mountOnEnter;
        // 如果在form下面，其他tabs默认需要渲染出来
        // 否则在其他 tab 下面的必填项检测不到
        if (formStore) {
            mountOnEnter = false;
        }
        var tabs = this.props.tabs;
        if (!tabs) {
            return null;
        }
        tabs = Array.isArray(tabs) ? tabs : [tabs];
        var children = [];
        if (Array.isArray(arr)) {
            arr.forEach(function (value, index) {
                var ctx = (0, helper_1.createObject)(data, (0, helper_1.isObject)(value) ? (0, tslib_1.__assign)({ index: index }, value) : { item: value, index: index });
                children.push.apply(children, tabs.map(function (tab, tabIndex) {
                    var _a;
                    return (0, helper_1.isVisible)(tab, ctx) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, ctx), disabled: (0, helper_1.isDisabled)(tab, ctx), key: "" + (index * 1000 + tabIndex), eventKey: index * 1000 + tabIndex, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                            ? tab.reload
                            : typeof tab.unmountOnExit === 'boolean'
                                ? tab.unmountOnExit
                                : unmountOnExit }), render("item/" + index + "/" + tabIndex, ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body, {
                        data: ctx,
                        formMode: tab.mode || subFormMode || formMode,
                        formHorizontal: tab.horizontal || subFormHorizontal || formHorizontal
                    }))) : null;
                }));
            });
        }
        else {
            children = tabs.map(function (tab, index) {
                var _a;
                return (0, helper_1.isVisible)(tab, data) ? (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, tab, { title: (0, tpl_1.filter)(tab.title, data), disabled: (0, helper_1.isDisabled)(tab, data), key: index, eventKey: tab.hash || index, mountOnEnter: mountOnEnter, unmountOnExit: typeof tab.reload === 'boolean'
                        ? tab.reload
                        : typeof tab.unmountOnExit === 'boolean'
                            ? tab.unmountOnExit
                            : unmountOnExit }), _this.renderTab
                    ? _this.renderTab(tab, _this.props, index)
                    : tabRender
                        ? tabRender(tab, _this.props, index)
                        : render("tab/" + index, ((_a = tab) === null || _a === void 0 ? void 0 : _a.type) ? tab : tab.tab || tab.body, {
                            formMode: tab.mode || subFormMode || formMode,
                            formHorizontal: tab.horizontal || subFormHorizontal || formHorizontal
                        }))) : null;
            });
        }
        return (react_1.default.createElement(Tabs_1.Tabs, { classPrefix: ns, classnames: cx, mode: mode, className: className, contentClassName: contentClassName, linksClassName: linksClassName, onSelect: this.handleSelect, activeKey: this.state.activeKey, toolbar: this.renderToolbar(), scrollable: scrollable }, children));
    };
    Tabs.prototype.render = function () {
        return this.renderTabs();
    };
    Tabs.defaultProps = {
        className: '',
        mode: '',
        mountOnEnter: true,
        unmountOnExit: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "autoJumpToNeighbour", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "handleSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "switchTo", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Number)
    ], Tabs.prototype, "currentIndex", null);
    return Tabs;
}(react_1.default.Component));
exports.default = Tabs;
var TabsRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsRenderer, _super);
    function TabsRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'tabs'
        })
    ], TabsRenderer);
    return TabsRenderer;
}(Tabs));
exports.TabsRenderer = TabsRenderer;
//# sourceMappingURL=./renderers/Tabs.js.map
