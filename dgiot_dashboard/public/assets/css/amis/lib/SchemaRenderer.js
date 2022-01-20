"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaRenderer = void 0;
var tslib_1 = require("tslib");
var difference_1 = (0, tslib_1.__importDefault)(require("lodash/difference"));
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("./components/LazyComponent"));
var factory_1 = require("./factory");
var Item_1 = require("./renderers/Form/Item");
var Root_1 = require("./Root");
var filter_schema_1 = (0, tslib_1.__importDefault)(require("./utils/filter-schema"));
var helper_1 = require("./utils/helper");
var SimpleMap_1 = require("./utils/SimpleMap");
var defaultOmitList = [
    'type',
    'name',
    '$ref',
    'className',
    'data',
    'children',
    'ref',
    'visible',
    'visibleOn',
    'hidden',
    'hiddenOn',
    'disabled',
    'disabledOn',
    'component',
    'detectField',
    'defaultValue',
    'defaultData',
    'required',
    'requiredOn',
    'syncSuperStore',
    'mode',
    'body'
];
var componentCache = new SimpleMap_1.SimpleMap();
var SchemaRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaRenderer, _super);
    function SchemaRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.rendererKey = '';
        _this.refFn = _this.refFn.bind(_this);
        _this.renderChild = _this.renderChild.bind(_this);
        _this.reRender = _this.reRender.bind(_this);
        _this.resolveRenderer(_this.props);
        return _this;
    }
    // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
    SchemaRenderer.prototype.shouldComponentUpdate = function (nextProps) {
        var props = this.props;
        var list = (0, difference_1.default)(Object.keys(nextProps), [
            'schema',
            'scope'
        ]);
        if ((0, difference_1.default)(Object.keys(props), ['schema', 'scope']).length !==
            list.length ||
            (0, helper_1.anyChanged)(list, this.props, nextProps)) {
            return true;
        }
        else {
            var list_1 = Object.keys(nextProps.schema);
            if (Object.keys(props.schema).length !== list_1.length ||
                (0, helper_1.anyChanged)(list_1, props.schema, nextProps.schema)) {
                return true;
            }
        }
        return false;
    };
    SchemaRenderer.prototype.resolveRenderer = function (props, force) {
        if (force === void 0) { force = false; }
        var schema = props.schema;
        var path = props.$path;
        if (schema && schema.$ref) {
            schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.resolveDefinitions(schema.$ref)), schema);
            path = path.replace(/(?!.*\/).*/, schema.type);
        }
        if ((schema === null || schema === void 0 ? void 0 : schema.type) &&
            (force ||
                !this.renderer ||
                this.rendererKey !== schema.type + "-" + schema.$$id)) {
            var rendererResolver = props.env.rendererResolver || factory_1.resolveRenderer;
            this.renderer = rendererResolver(path, schema, props);
            this.rendererKey = schema.type + "-" + schema.$$id;
        }
        else {
            // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
            // 至少自动支持了 valdiations, label, description 等逻辑。
            if (schema.children && !schema.component && schema.asFormItem) {
                schema.component = PlaceholderComponent;
                schema.renderChildren = schema.children;
                delete schema.children;
            }
            if (schema.component &&
                !schema.component.wrapedAsFormItem &&
                schema.asFormItem) {
                var cache = componentCache.get(schema.component);
                if (cache) {
                    schema.component = cache;
                }
                else {
                    var cache_1 = (0, Item_1.asFormItem)((0, tslib_1.__assign)({ strictMode: false }, schema.asFormItem))(schema.component);
                    componentCache.set(schema.component, cache_1);
                    cache_1.wrapedAsFormItem = true;
                    schema.component = cache_1;
                }
            }
        }
        return { path: path, schema: schema };
    };
    SchemaRenderer.prototype.getWrappedInstance = function () {
        return this.ref;
    };
    SchemaRenderer.prototype.refFn = function (ref) {
        this.ref = ref;
    };
    SchemaRenderer.prototype.renderChild = function (region, node, subProps) {
        if (subProps === void 0) { subProps = {}; }
        var _a = this.props, _ = _a.schema, __ = _a.$path, env = _a.env, rest = (0, tslib_1.__rest)(_a, ["schema", "$path", "env"]);
        var $path = this.resolveRenderer(this.props).path;
        var omitList = defaultOmitList.concat();
        if (this.renderer) {
            var Component = this.renderer.component;
            Component.propsList &&
                omitList.push.apply(omitList, Component.propsList);
        }
        return (0, Root_1.renderChild)("" + $path + (region ? "/" + region : ''), node || '', (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, omit_1.default)(rest, omitList)), subProps), { data: subProps.data || rest.data, env: env }));
    };
    SchemaRenderer.prototype.reRender = function () {
        this.resolveRenderer(this.props, true);
        this.forceUpdate();
    };
    SchemaRenderer.prototype.render = function () {
        var _this = this;
        var _a, _b;
        var _c = this.props, _ = _c.$path, __ = _c.schema, rest = (0, tslib_1.__rest)(_c, ["$path", "schema"]);
        if (__ == null) {
            return null;
        }
        var _d = this.resolveRenderer(this.props), $path = _d.path, schema = _d.schema;
        var theme = this.props.env.theme;
        if (Array.isArray(schema)) {
            return (0, Root_1.renderChildren)($path, schema, rest);
        }
        var detectData = schema &&
            (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
        var exprProps = detectData
            ? (0, filter_schema_1.default)(schema, detectData, undefined, rest)
            : {};
        if (exprProps &&
            (exprProps.hidden ||
                exprProps.visible === false ||
                schema.hidden ||
                schema.visible === false ||
                rest.hidden ||
                rest.visible === false)) {
            rest.invisible = true;
        }
        if (schema.children) {
            return rest.invisible
                ? null
                : react_1.default.isValidElement(schema.children)
                    ? schema.children
                    : schema.children((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), exprProps), { $path: $path, $schema: schema, render: this.renderChild, forwardedRef: this.refFn }));
        }
        else if (typeof schema.component === 'function') {
            var isSFC = !(schema.component.prototype instanceof react_1.default.Component);
            var defaultData_1 = schema.data, defaultValue_1 = schema.value, defaultActiveKey_1 = schema.activeKey, restSchema_1 = (0, tslib_1.__rest)(schema, ["data", "value", "activeKey"]);
            return rest.invisible
                ? null
                : react_1.default.createElement(schema.component, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), restSchema_1), exprProps), { defaultData: defaultData_1, defaultValue: defaultValue_1, defaultActiveKey: defaultActiveKey_1, $path: $path, $schema: schema, ref: isSFC ? undefined : this.refFn, forwardedRef: isSFC ? this.refFn : undefined, render: this.renderChild }));
        }
        else if (Object.keys(schema).length === 0) {
            return null;
        }
        else if (!this.renderer) {
            return rest.invisible ? null : (react_1.default.createElement(LazyComponent_1.default, (0, tslib_1.__assign)({}, rest, exprProps, { getComponent: function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    var result;
                    return (0, tslib_1.__generator)(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rest.env.loadRenderer(schema, $path, this.reRender)];
                            case 1:
                                result = _a.sent();
                                if (result && typeof result === 'function') {
                                    return [2 /*return*/, result];
                                }
                                else if (result && react_1.default.isValidElement(result)) {
                                    return [2 /*return*/, function () { return result; }];
                                }
                                this.reRender();
                                return [2 /*return*/, function () { return (0, factory_1.loadRenderer)(schema, $path); }];
                        }
                    });
                }); }, "$path": $path, "$schema": schema, retry: this.reRender })));
        }
        var renderer = this.renderer;
        schema = (0, factory_1.filterSchema)(schema, renderer, rest);
        var defaultData = schema.data, defaultValue = schema.value, defaultActiveKey = schema.activeKey, restSchema = (0, tslib_1.__rest)(schema, ["data", "value", "activeKey"]);
        var Component = renderer.component;
        // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
        // 而 visibleOn 和 hiddenOn 是无效的，
        // 这个本来就是个bug，但是已经被广泛使用了
        // 我只能继续实现这个bug了
        if (rest.invisible &&
            (exprProps.hidden ||
                exprProps.visible === false ||
                !renderer.isFormItem ||
                (schema.visible !== false && !schema.hidden))) {
            return null;
        }
        return (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, theme.getRendererConfig(renderer.name), restSchema, (0, helper_1.chainEvents)(rest, restSchema), exprProps, { defaultData: (_a = restSchema.defaultData) !== null && _a !== void 0 ? _a : defaultData, defaultValue: (_b = restSchema.defaultValue) !== null && _b !== void 0 ? _b : defaultValue, defaultActiveKey: defaultActiveKey, "$path": $path, "$schema": (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), exprProps), ref: this.refFn, render: this.renderChild })));
    };
    SchemaRenderer.displayName = 'Renderer';
    return SchemaRenderer;
}(react_1.default.Component));
exports.SchemaRenderer = SchemaRenderer;
var PlaceholderComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PlaceholderComponent, _super);
    function PlaceholderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaceholderComponent.prototype.render = function () {
        var _a = this.props, renderChildren = _a.renderChildren, rest = (0, tslib_1.__rest)(_a, ["renderChildren"]);
        if (typeof renderChildren === 'function') {
            return renderChildren(rest);
        }
        return null;
    };
    return PlaceholderComponent;
}(react_1.default.Component));
//# sourceMappingURL=./SchemaRenderer.js.map
