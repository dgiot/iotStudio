"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Collapse_1 = require("../components/Collapse");
var helper_1 = require("../utils/helper");
var Collapse = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Collapse, _super);
    function Collapse(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            collapsed: false
        };
        _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
        _this.state.collapsed = !!props.collapsed;
        return _this;
    }
    Collapse.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.collapsed !== props.collapsed) {
            this.setState({
                collapsed: !!props.collapsed
            });
        }
    };
    Collapse.prototype.toggleCollapsed = function (e) {
        if ((0, helper_1.isClickOnInput)(e)) {
            return;
        }
        this.props.collapsable !== false &&
            this.setState({
                collapsed: !this.state.collapsed
            });
    };
    Collapse.prototype.render = function () {
        var _a;
        var _b = this.props, ns = _b.classPrefix, cx = _b.classnames, size = _b.size, WrapperComponent = _b.wrapperComponent, HeadingComponent = _b.headingComponent, className = _b.className, headingClassName = _b.headingClassName, children = _b.children, titlePosition = _b.titlePosition, title = _b.title, collapseTitle = _b.collapseTitle, body = _b.body, bodyClassName = _b.bodyClassName, render = _b.render, collapsable = _b.collapsable, __ = _b.translate, mountOnEnter = _b.mountOnEnter, unmountOnExit = _b.unmountOnExit;
        // 默认给个 title，不然没法点
        var finalTitle = this.state.collapsed ? title : collapseTitle || title;
        var dom = [
            finalTitle ? (react_1.default.createElement(HeadingComponent, { key: "title", onClick: this.toggleCollapsed, className: cx("Collapse-header", headingClassName) },
                render('heading', finalTitle),
                collapsable && react_1.default.createElement("span", { className: cx('Collapse-arrow') }))) : null,
            react_1.default.createElement(Collapse_1.Collapse, { show: collapsable ? !this.state.collapsed : true, classnames: cx, classPrefix: ns, key: "body", mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit },
                react_1.default.createElement("div", { className: cx("Collapse-body", bodyClassName) }, children
                    ? typeof children === 'function'
                        ? children(this.props)
                        : children
                    : body
                        ? render('body', body)
                        : null))
        ];
        if (titlePosition === 'bottom') {
            dom.reverse();
        }
        return (react_1.default.createElement(WrapperComponent, { className: cx("Collapse", (_a = {
                    'is-collapsed': this.state.collapsed
                },
                _a["Collapse--" + size] = size,
                _a['Collapse--collapsable'] = collapsable,
                _a['Collapse--title-bottom'] = titlePosition === 'bottom',
                _a), className) }, dom));
    };
    Collapse.propsList = [
        'wrapperComponent',
        'headingComponent',
        'bodyClassName',
        'collapsed',
        'headingClassName',
        'title',
        'mountOnEnter',
        'unmountOnExit'
    ];
    Collapse.defaultProps = {
        titlePosition: 'top',
        wrapperComponent: 'div',
        headingComponent: 'h4',
        className: '',
        headingClassName: '',
        bodyClassName: '',
        collapsable: true
    };
    return Collapse;
}(react_1.default.Component));
exports.default = Collapse;
var CollapseRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CollapseRenderer, _super);
    function CollapseRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapseRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'collapse'
        })
    ], CollapseRenderer);
    return CollapseRenderer;
}(Collapse));
exports.CollapseRenderer = CollapseRenderer;
//# sourceMappingURL=./renderers/Collapse.js.map
