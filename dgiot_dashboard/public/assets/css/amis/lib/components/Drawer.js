"use strict";
/**
 * @file Drawer
 * @description
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var Portal_1 = (0, tslib_1.__importDefault)(require("react-overlays/Portal"));
var icons_1 = require("./icons");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var ModalManager_1 = require("./ModalManager");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a);
var Drawer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Drawer, _super);
    function Drawer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isRootClosed = false;
        _this.contentRef = function (ref) { return (_this.contentDom = ref); };
        _this.handleEnter = function () {
            document.body.classList.add("is-modalOpened");
            if (window.innerWidth - document.documentElement.clientWidth > 0 ||
                document.body.scrollHeight > document.body.clientHeight) {
                var scrollbarWidth = (0, helper_1.getScrollbarWidth)();
                if (scrollbarWidth) {
                    document.body.style.width = "calc(100% - " + scrollbarWidth + "px)";
                }
            }
        };
        _this.handleEntered = function () {
            var onEntered = _this.props.onEntered;
            onEntered && onEntered();
        };
        _this.handleExited = function () {
            var _a, _b;
            var onExited = _this.props.onExited;
            document.activeElement && ((_b = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur) === null || _b === void 0 ? void 0 : _b.call(_a));
            onExited && onExited();
            setTimeout(function () {
                if (!document.querySelector('.amis-dialog-widget')) {
                    document.body.classList.remove("is-modalOpened");
                    document.body.style.width = '';
                }
            }, 200);
        };
        _this.modalRef = function (ref) {
            _this.modalDom = ref;
            if (ref) {
                (0, ModalManager_1.addModal)(_this);
                ref.classList.add(_this.props.classPrefix + "Modal--" + (0, ModalManager_1.current)() + "th");
            }
            else {
                (0, ModalManager_1.removeModal)(_this);
            }
        };
        return _this;
    }
    Drawer.prototype.componentDidMount = function () {
        if (this.props.show) {
            this.handleEntered();
        }
        document.body.addEventListener('click', this.handleRootClickCapture, true);
        document.body.addEventListener('click', this.handleRootClick);
    };
    Drawer.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        // jest 里面没有触发 entered 导致后续的逻辑错误，
        // 所以直接 300 ms 后触发
        if (typeof jest !== 'undefined' &&
            prevProps.show !== this.props.show &&
            this.props.show) {
            setTimeout(function () {
                _this.handleEntered();
            }, 300);
        }
    };
    Drawer.prototype.componentWillUnmount = function () {
        if (this.props.show) {
            this.handleExited();
        }
        document.body.removeEventListener('click', this.handleRootClick);
        document.body.removeEventListener('click', this.handleRootClickCapture, true);
    };
    Drawer.prototype.handleRootClickCapture = function (e) {
        var target = e.target;
        var _a = this.props, closeOnOutside = _a.closeOnOutside, ns = _a.classPrefix;
        var isLeftButton = (e.button === 1 && window.event !== null) || e.button === 0;
        this.isRootClosed = !!(isLeftButton &&
            closeOnOutside &&
            target &&
            this.modalDom &&
            ((!this.modalDom.contains(target) && !target.closest('[role=dialog]')) ||
                (target.matches("." + ns + "Drawer-overlay") &&
                    target.parentElement === this.modalDom))); // 干脆过滤掉来自弹框里面的点击
    };
    Drawer.prototype.handleRootClick = function (e) {
        var onHide = this.props.onHide;
        this.isRootClosed && !e.defaultPrevented && onHide(e);
    };
    Drawer.prototype.render = function () {
        var _this = this;
        var _a = this.props, ns = _a.classPrefix, className = _a.className, children = _a.children, container = _a.container, show = _a.show, position = _a.position, size = _a.size, onHide = _a.onHide, disabled = _a.disabled, overlay = _a.overlay, bodyClassName = _a.bodyClassName;
        return (react_1.default.createElement(Portal_1.default, { container: container },
            react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: show, timeout: 500, onEnter: this.handleEnter, onExited: this.handleExited, onEntered: this.handleEntered }, function (status) {
                var _a;
                if (status === Transition_1.ENTERING) {
                    // force reflow
                    // 由于从 mount 进来到加上 in 这个 class 估计是时间太短，上次的样式还没应用进去，所以这里强制reflow一把。
                    // 否则看不到动画。
                    _this.contentDom.offsetWidth;
                }
                return (react_1.default.createElement("div", { ref: _this.modalRef, role: "dialog", className: (0, classnames_1.default)("amis-dialog-widget " + ns + "Drawer", (_a = {},
                        _a[ns + "Drawer--" + position] = position,
                        _a[ns + "Drawer--" + size] = size,
                        _a[ns + "Drawer--noOverlay"] = !overlay,
                        _a), className) },
                    overlay ? (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "Drawer-overlay", fadeStyles[status]) })) : null,
                    react_1.default.createElement("div", { ref: _this.contentRef, className: (0, classnames_1.default)(ns + "Drawer-content", bodyClassName, fadeStyles[status]) },
                        react_1.default.createElement("a", { onClick: disabled ? undefined : onHide, className: ns + "Drawer-close" },
                            react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" })),
                        status === Transition_1.EXITED ? null : children)));
            })));
    };
    var _b, _c;
    Drawer.defaultProps = {
        container: document.body,
        position: 'left',
        size: 'md',
        overlay: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Drawer.prototype, "handleRootClickCapture", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Drawer.prototype, "handleRootClick", null);
    return Drawer;
}(react_1.default.Component));
exports.Drawer = Drawer;
exports.default = (0, theme_1.themeable)(Drawer);
//# sourceMappingURL=./components/Drawer.js.map
