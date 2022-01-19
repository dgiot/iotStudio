"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkFieldRenderer = exports.LinkField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var Badge_1 = require("../components/Badge");
var LinkField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LinkField, _super);
    function LinkField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkField.prototype.render = function () {
        var _a = this.props, className = _a.className, body = _a.body, href = _a.href, cx = _a.classnames, blank = _a.blank, htmlTarget = _a.htmlTarget, data = _a.data, render = _a.render, __ = _a.translate, title = _a.title;
        var value = (0, helper_1.getPropValue)(this.props);
        var finnalHref = href ? (0, tpl_1.filter)(href, data, '| raw') : '';
        return (react_1.default.createElement("a", { href: finnalHref || value, target: htmlTarget || (blank ? '_blank' : '_self'), className: cx('Link', className), title: title }, body ? render('body', body) : finnalHref || value || __('link')));
    };
    LinkField.defaultProps = {
        className: '',
        blank: false
    };
    return LinkField;
}(react_1.default.Component));
exports.LinkField = LinkField;
var LinkFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LinkFieldRenderer, _super);
    function LinkFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'link'
        })
        // @ts-ignore 类型没搞定
        ,
        Badge_1.withBadge
    ], LinkFieldRenderer);
    return LinkFieldRenderer;
}(LinkField));
exports.LinkFieldRenderer = LinkFieldRenderer;
//# sourceMappingURL=./renderers/Link.js.map
