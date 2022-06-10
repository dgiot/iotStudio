"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationRenderer = exports.Navigation = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var factory_1 = require("../factory");
var filter_schema_1 = (0, tslib_1.__importDefault)(require("../utils/filter-schema"));
var tpl_1 = require("../utils/tpl");
var helper_1 = require("../utils/helper");
var Scoped_1 = require("../Scoped");
var theme_1 = require("../theme");
var icons_1 = require("../components/icons");
var icon_1 = require("../utils/icon");
var WithRemoteConfig_1 = require("../components/WithRemoteConfig");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../components/Spinner"));
var cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
var api_1 = require("../utils/api");
var Badge_1 = require("../components/Badge");
var Navigation = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Navigation, _super);
    function Navigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sortable = [];
        return _this;
    }
    Navigation.prototype.handleClick = function (link) {
        var _a, _b;
        (_b = (_a = this.props).onSelect) === null || _b === void 0 ? void 0 : _b.call(_a, link);
    };
    Navigation.prototype.toggleLink = function (target) {
        var _a, _b;
        (_b = (_a = this.props).onToggle) === null || _b === void 0 ? void 0 : _b.call(_a, target);
    };
    Navigation.prototype.dragRefFn = function (ref) {
        var draggable = this.props.draggable;
        if (ref && draggable) {
            this.id = (0, helper_1.guid)();
            this.initDragging(ref);
        }
    };
    Navigation.prototype.initDragging = function (ref) {
        var _this = this;
        var ns = this.props.classPrefix;
        this.sortable.push(new sortablejs_1.default(ref, {
            group: "nav-" + this.id,
            animation: 150,
            handle: "." + ns + "Nav-itemDrager",
            ghostClass: ns + "Nav-item--dragging",
            onEnd: function (e) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var id, parentNode, links, parent, _a, saveOrderApi, env;
                return (0, tslib_1.__generator)(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // 没有移动
                            if (e.newIndex === e.oldIndex) {
                                return [2 /*return*/];
                            }
                            id = e.item.getAttribute('data-id');
                            parentNode = e.to;
                            if (e.newIndex < e.oldIndex &&
                                e.oldIndex < parentNode.childNodes.length - 1) {
                                parentNode.insertBefore(e.item, parentNode.childNodes[e.oldIndex + 1]);
                            }
                            else if (e.oldIndex < parentNode.childNodes.length - 1) {
                                parentNode.insertBefore(e.item, parentNode.childNodes[e.oldIndex]);
                            }
                            else {
                                parentNode.appendChild(e.item);
                            }
                            links = (0, cloneDeep_1.default)(this.props.links);
                            parent = links;
                            (0, helper_1.someTree)(links, function (item, key, level, paths) {
                                if (item.id === id) {
                                    var len = paths.length - 1;
                                    parent = (~len ? paths[len].children : links);
                                    return true;
                                }
                                return false;
                            });
                            parent.splice(e.newIndex, 0, parent.splice(e.oldIndex, 1)[0]);
                            _a = this.props, saveOrderApi = _a.saveOrderApi, env = _a.env;
                            if (!(saveOrderApi && (0, api_1.isEffectiveApi)(saveOrderApi))) return [3 /*break*/, 2];
                            return [4 /*yield*/, env.fetcher(saveOrderApi, { data: links }, { method: 'post' })];
                        case 1:
                            _b.sent();
                            this.props.reload();
                            return [3 /*break*/, 3];
                        case 2:
                            console.warn('请配置saveOrderApi');
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        }));
    };
    Navigation.prototype.renderItem = function (link, index, depth) {
        var _this = this;
        var _a;
        if (depth === void 0) { depth = 1; }
        if (link.hidden === true || link.visible === false) {
            return null;
        }
        var isActive = !!link.active;
        var _b = this.props, disabled = _b.disabled, togglerClassName = _b.togglerClassName, cx = _b.classnames, indentSize = _b.indentSize, render = _b.render, itemActions = _b.itemActions, draggable = _b.draggable, links = _b.links, defaultBadge = _b.badge;
        var hasSub = (link.defer && !link.loaded) || (link.children && link.children.length);
        var id = (0, helper_1.guid)();
        link.id = id;
        var badge = defaultBadge ? Object.assign(defaultBadge, link.badge) : link.badge;
        return (react_1.default.createElement("li", { key: index, className: cx('Nav-item', link.className, {
                'is-disabled': disabled || link.disabled || link.loading,
                'is-active': isActive,
                'is-unfolded': link.unfolded,
                'has-sub': hasSub
            }), "data-id": id },
            react_1.default.createElement(Badge_1.Badge, { classnames: cx, badge: badge, data: link },
                react_1.default.createElement("a", { onClick: this.handleClick.bind(this, link), style: { paddingLeft: depth * ((_a = parseInt(indentSize, 10)) !== null && _a !== void 0 ? _a : 24) } },
                    !disabled && draggable && links && links.length > 1 ? (react_1.default.createElement("div", { className: cx('Nav-itemDrager') },
                        react_1.default.createElement("a", { key: "drag", "data-position": "bottom" },
                            react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" })))) : null,
                    link.loading ? (react_1.default.createElement(Spinner_1.default, { size: "sm", show: true, icon: "reload", spinnerClassName: cx('Nav-spinner') })) : hasSub ? (react_1.default.createElement("span", { onClick: function () { return _this.toggleLink(link); }, className: cx('Nav-itemToggler', togglerClassName) },
                        react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null,
                    (0, icon_1.generateIcon)(cx, link.icon, 'Nav-itemIcon'),
                    link.label && (typeof link.label === 'string'
                        ? link.label
                        : render('inline', link.label))),
                // 更多操作
                itemActions
                    ? react_1.default.createElement("div", { className: cx('Nav-item-atcions') }, render('inline', itemActions, { data: link })) : null,
                Array.isArray(link.children) && link.children.length ? (react_1.default.createElement("ul", { className: cx('Nav-subItems'), ref: this.dragRefFn }, link.children.map(function (link, index) {
                    return _this.renderItem(link, index, depth + 1);
                }))) : null)));
    };
    Navigation.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, stacked = _a.stacked, cx = _a.classnames, links = _a.links, loading = _a.loading;
        return (react_1.default.createElement("ul", { className: cx('Nav', className, stacked ? 'Nav--stacked' : 'Nav--tabs'), ref: this.dragRefFn },
            Array.isArray(links)
                ? links.map(function (item, index) { return _this.renderItem(item, index); })
                : null,
            react_1.default.createElement(Spinner_1.default, { show: !!loading, overlay: true, icon: "reload" })));
    };
    Navigation.defaultProps = {
        indentSize: 24
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "toggleLink", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "dragRefFn", null);
    return Navigation;
}(react_1.default.Component));
exports.Navigation = Navigation;
var ThemedNavigation = (0, theme_1.themeable)(Navigation);
var ConditionBuilderWithRemoteOptions = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (config, props) {
        var links = Array.isArray(config)
            ? config
            : config.links || config.options || config.items || config.rows;
        if (!Array.isArray(links)) {
            throw new Error('payload.data.options is not array.');
        }
        return links;
    },
    afterLoad: function (response, config, props) {
        if (response.value && !(0, helper_1.someTree)(config, function (item) { return item.active; })) {
            var env = props.env;
            env.jumpTo((0, tpl_1.filter)(response.value, props.data));
        }
    },
    normalizeConfig: function (links, origin, props, motivation) {
        if (Array.isArray(links) && motivation !== 'toggle') {
            var data_1 = props.data, env_1 = props.env, unfoldedField_1 = props.unfoldedField, foldedField_1 = props.foldedField;
            links = (0, helper_1.mapTree)(links, function (link) {
                var item = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, link), (0, filter_schema_1.default)(link, data_1)), { active: (motivation !== 'location-change' && link.active) ||
                        (link.activeOn
                            ? (0, tpl_1.evalExpression)(link.activeOn, data_1)
                            : !!(link.hasOwnProperty('to') &&
                                env_1 &&
                                env_1.isCurrentUrl((0, tpl_1.filter)(link.to, data_1)))) });
                item.unfolded =
                    (0, helper_1.isUnfolded)(item, { unfoldedField: unfoldedField_1, foldedField: foldedField_1 }) ||
                        (link.children && link.children.some(function (link) { return !!link.active; }));
                return item;
            }, 1, true);
        }
        return links;
    },
    beforeDeferLoad: function (item, indexes, links) {
        return (0, helper_1.spliceTree)(links, indexes, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { loading: true }));
    },
    afterDeferLoad: function (item, indexes, ret, links) {
        var newItem = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { loading: false, loaded: true, error: ret.ok ? undefined : ret.msg });
        var children = Array.isArray(ret.data)
            ? ret.data
            : ret.data.links || ret.data.options || ret.data.items || ret.data.rows;
        if (Array.isArray(children)) {
            newItem.children = children.concat();
            newItem.unfolded = true;
        }
        return (0, helper_1.spliceTree)(links, indexes, 1, newItem);
    }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleLink = _this.toggleLink.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        return _this;
    }
    class_1.prototype.componentDidMount = function () {
        if (Array.isArray(this.props.links)) {
            this.props.updateConfig(this.props.links, 'mount');
        }
    };
    class_1.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.location !== prevProps.location) {
            this.props.updateConfig(this.props.config, 'location-change');
        }
        else if (this.props.links !== prevProps.links) {
            this.props.updateConfig(this.props.links, 'update');
        }
    };
    class_1.prototype.toggleLink = function (target) {
        var _a = this.props, config = _a.config, updateConfig = _a.updateConfig, deferLoad = _a.deferLoad;
        if (target.defer && !target.loaded) {
            deferLoad(target);
        }
        else {
            updateConfig((0, helper_1.mapTree)(config, function (link) {
                return target === link
                    ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, link), { unfolded: !link.unfolded }) : link;
            }), 'toggle');
        }
    };
    class_1.prototype.handleSelect = function (link) {
        var _a = this.props, onSelect = _a.onSelect, env = _a.env, data = _a.data;
        if (onSelect && onSelect(link) === false) {
            return;
        }
        if (!link.to &&
            ((link.children && link.children.length) ||
                (link.defer && !link.loaded))) {
            this.toggleLink(link);
            return;
        }
        env === null || env === void 0 ? void 0 : env.jumpTo((0, tpl_1.filter)(link.to, data), link);
    };
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config, deferLoad = _a.deferLoad, updateConfig = _a.updateConfig, rest = (0, tslib_1.__rest)(_a, ["loading", "config", "deferLoad", "updateConfig"]);
        return (react_1.default.createElement(ThemedNavigation, (0, tslib_1.__assign)({}, rest, { loading: loading, links: config || rest.links || [], disabled: loading, onSelect: this.handleSelect, onToggle: this.toggleLink })));
    };
    return class_1;
}(react_1.default.Component)));
exports.default = ThemedNavigation;
var NavigationRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NavigationRenderer, _super);
    function NavigationRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        _this.remoteRef = undefined;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    NavigationRenderer.prototype.remoteConfigRef = function (ref) {
        this.remoteRef = ref;
    };
    NavigationRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    NavigationRenderer.prototype.reload = function (target, query, values) {
        var _a;
        if (query) {
            return this.receive(query);
        }
        var _b = this.props, data = _b.data, env = _b.env, source = _b.source, __ = _b.translate;
        var finalData = values ? (0, helper_1.createObject)(data, values) : data;
        (_a = this.remoteRef) === null || _a === void 0 ? void 0 : _a.loadConfig(finalData);
    };
    NavigationRenderer.prototype.receive = function (values) {
        this.reload(undefined, undefined, values);
    };
    NavigationRenderer.prototype.render = function () {
        var rest = (0, tslib_1.__rest)(this.props, []);
        return (react_1.default.createElement(ConditionBuilderWithRemoteOptions, (0, tslib_1.__assign)({}, rest, { reload: this.reload, remoteConfigRef: this.remoteConfigRef })));
    };
    var _a, _b;
    NavigationRenderer.contextType = Scoped_1.ScopedContext;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "remoteConfigRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "reload", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "receive", null);
    NavigationRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:nav|navigation)$/,
            name: 'nav'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof factory_1.RendererProps !== "undefined" && factory_1.RendererProps) === "function" ? _a : Object, typeof (_b = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _b : Object])
    ], NavigationRenderer);
    return NavigationRenderer;
}(react_1.default.Component));
exports.NavigationRenderer = NavigationRenderer;
//# sourceMappingURL=./renderers/Nav.js.map
