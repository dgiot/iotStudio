"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownRenderer = exports.Markdown = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来渲染 Markdown
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("../components/LazyComponent"));
var helper_1 = require("../utils/helper");
function loadComponent() {
    return Promise.resolve().then(function () { return new Promise(function(resolve){require(['../components/Markdown'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (item) { return item.default; });
}
var Markdown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Markdown, _super);
    function Markdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Markdown.prototype.render = function () {
        var _a = this.props, className = _a.className, data = _a.data, cx = _a.classnames, name = _a.name;
        var content = (0, helper_1.getPropValue)(this.props) ||
            (name ? (0, tpl_builtin_1.resolveVariableAndFilter)(name, data, '| raw') : null);
        return (react_1.default.createElement("div", { className: cx('Markdown', className) },
            react_1.default.createElement(LazyComponent_1.default, { getComponent: loadComponent, content: content })));
    };
    return Markdown;
}(react_1.default.Component));
exports.Markdown = Markdown;
var MarkdownRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MarkdownRenderer, _super);
    function MarkdownRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarkdownRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'markdown'
        })
    ], MarkdownRenderer);
    return MarkdownRenderer;
}(Markdown));
exports.MarkdownRenderer = MarkdownRenderer;
//# sourceMappingURL=./renderers/Markdown.js.map
