"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Container = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.renderBody = function () {
        var _a = this.props, children = _a.children, body = _a.body, render = _a.render, cx = _a.classnames, bodyClassName = _a.bodyClassName;
        return (react_1.default.createElement("div", { className: cx('Container-body', bodyClassName) }, children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body)
                : null));
    };
    Container.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, size = _a.size, cx = _a.classnames, style = _a.style;
        var Component = wrapperComponent || 'div';
        return (react_1.default.createElement(Component, { className: cx('Container', className), style: style }, this.renderBody()));
    };
    Container.propsList = ['body', 'className'];
    Container.defaultProps = {
        className: ''
    };
    return Container;
}(react_1.default.Component));
exports.default = Container;
var ContainerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ContainerRenderer, _super);
    function ContainerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainerRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'container'
        })
    ], ContainerRenderer);
    return ContainerRenderer;
}(Container));
exports.ContainerRenderer = ContainerRenderer;
//# sourceMappingURL=./renderers/Container.js.map
