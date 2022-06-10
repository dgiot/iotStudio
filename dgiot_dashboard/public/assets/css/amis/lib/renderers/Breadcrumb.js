"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbFieldRenderer = exports.BreadcrumbField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来展示面包屑导航
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var icon_1 = require("../utils/icon");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var BreadcrumbField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BreadcrumbField, _super);
    function BreadcrumbField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbField.prototype.render = function () {
        var _a = this.props, className = _a.className, itemClassName = _a.itemClassName, separatorClassName = _a.separatorClassName, cx = _a.classnames, items = _a.items, source = _a.source, data = _a.data, separator = _a.separator, render = _a.render;
        var crumbItems = items
            ? items
            : (0, tpl_builtin_1.resolveVariable)(source, data);
        var crumbs = crumbItems
            .map(function (item, index) { return (react_1.default.createElement("span", { className: cx('Breadcrumb-item', itemClassName), key: index },
            item.icon
                ? (0, icon_1.generateIcon)(cx, item.icon, 'Icon', 'Breadcrumb-icon')
                : null,
            item.href ? (react_1.default.createElement("a", { href: item.href }, (0, tpl_1.filter)(item.label, data))) : (render('label', (0, tpl_1.filter)(item.label, data))))); })
            .reduce(function (prev, curr, index) { return [
            prev,
            react_1.default.createElement("span", { className: cx('Breadcrumb-separator', separatorClassName), key: "separator-" + index }, separator),
            curr
        ]; });
        return react_1.default.createElement("div", { className: cx('Breadcrumb', className) }, crumbs);
    };
    BreadcrumbField.defaultProps = {
        className: '',
        itemClassName: '',
        separator: '/'
    };
    return BreadcrumbField;
}(react_1.default.Component));
exports.BreadcrumbField = BreadcrumbField;
var BreadcrumbFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BreadcrumbFieldRenderer, _super);
    function BreadcrumbFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreadcrumbFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'breadcrumb'
        })
    ], BreadcrumbFieldRenderer);
    return BreadcrumbFieldRenderer;
}(BreadcrumbField));
exports.BreadcrumbFieldRenderer = BreadcrumbFieldRenderer;
//# sourceMappingURL=./renderers/Breadcrumb.js.map
