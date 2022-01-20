"use strict";
/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = exports.Tab = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var theme_1 = require("../theme");
var uncontrollable_1 = require("uncontrollable");
var icon_1 = require("../utils/icon");
var helper_1 = require("../utils/helper");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var transitionStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a);
var TabComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabComponent, _super);
    function TabComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.contentRef = function (ref) { return (_this.contentDom = ref); };
        return _this;
    }
    TabComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, mountOnEnter = _a.mountOnEnter, reload = _a.reload, unmountOnExit = _a.unmountOnExit, eventKey = _a.eventKey, activeKey = _a.activeKey, children = _a.children, className = _a.className;
        return (react_1.default.createElement(Transition_1.default, { in: activeKey === eventKey, mountOnEnter: mountOnEnter, unmountOnExit: typeof reload === 'boolean' ? reload : unmountOnExit, timeout: 500 }, function (status) {
            if (status === Transition_1.ENTERING) {
                _this.contentDom.offsetWidth;
            }
            return (react_1.default.createElement("div", { ref: _this.contentRef, className: cx(transitionStyles[status], activeKey === eventKey ? 'is-active' : '', 'Tabs-pane', className) }, children));
        }));
    };
    return TabComponent;
}(react_1.default.PureComponent));
exports.Tab = (0, theme_1.themeable)(TabComponent);
var Tabs = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tabs, _super);
    function Tabs(props) {
        var _this = _super.call(this, props) || this;
        _this.navMain = react_1.default.createRef();
        _this.scroll = false;
        _this.checkArrowStatus = (0, debounce_1.default)(function () {
            var _a = _this.navMain.current
                || {
                    scrollLeft: 0,
                    scrollWidth: 0,
                    clientWidth: 0
                }, scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
            var _b = _this.state, arrowRightDisabled = _b.arrowRightDisabled, arrowLeftDisabled = _b.arrowLeftDisabled;
            if (scrollLeft === 0 && !arrowLeftDisabled) {
                _this.setState({
                    arrowRightDisabled: false,
                    arrowLeftDisabled: true
                });
            }
            else if (scrollWidth === scrollLeft + clientWidth && !arrowRightDisabled) {
                _this.setState({
                    arrowRightDisabled: true,
                    arrowLeftDisabled: false
                });
            }
            else if (scrollLeft !== 0 && arrowLeftDisabled) {
                _this.setState({
                    arrowLeftDisabled: false
                });
            }
            else if (scrollWidth !== scrollLeft + clientWidth && arrowRightDisabled) {
                _this.setState({
                    arrowRightDisabled: false
                });
            }
        }, 100, {
            trailing: true,
            leading: false
        });
        _this.state = {
            isOverflow: false,
            arrowLeftDisabled: false,
            arrowRightDisabled: false,
        };
        return _this;
    }
    Tabs.prototype.componentDidMount = function () {
        var _a;
        this.computedWidth();
        if (this.navMain) {
            (_a = this.navMain.current) === null || _a === void 0 ? void 0 : _a.addEventListener('wheel', this.handleWheel, { passive: false });
            this.checkArrowStatus();
        }
    };
    Tabs.prototype.componentDidUpdate = function () {
        // 判断是否是由滚动触发的数据更新，如果是则不需要再次判断容器与内容的关系
        if (!this.scroll) {
            this.computedWidth();
        }
        this.scroll = false;
    };
    Tabs.prototype.componentWillUnmount = function () {
        this.checkArrowStatus.cancel();
    };
    /**
     * 处理内容与容器之间的位置关系
     */
    Tabs.prototype.computedWidth = function () {
        var _a = this.props, dMode = _a.mode, tabsMode = _a.tabsMode, scrollable = _a.scrollable;
        var mode = tabsMode || dMode;
        if (!scrollable || mode === 'vertical') {
            return;
        }
        var navMainRef = this.navMain.current;
        var clientWidth = (navMainRef === null || navMainRef === void 0 ? void 0 : navMainRef.clientWidth) || 0;
        var scrollWidth = (navMainRef === null || navMainRef === void 0 ? void 0 : navMainRef.scrollWidth) || 0;
        var isOverflow = scrollWidth > clientWidth;
        // 内容超出容器长度标记溢出
        if (isOverflow !== this.state.isOverflow) {
            this.setState({ isOverflow: isOverflow });
        }
        if (isOverflow) {
            this.showSelected();
        }
    };
    /**
     * 保证选中的tab始终显示在可视区域
     */
    Tabs.prototype.showSelected = function (key) {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h = this.props, dMode = _h.mode, tabsMode = _h.tabsMode, scrollable = _h.scrollable;
        var isOverflow = this.state.isOverflow;
        var mode = tabsMode || dMode;
        if (!scrollable || mode === 'vertical' || !isOverflow) {
            return;
        }
        var _j = this.props, activeKey = _j.activeKey, children = _j.children;
        var currentKey = key !== undefined ? key : activeKey;
        var currentIndex = (_a = children) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return item.props.eventKey === currentKey; });
        var li = ((_c = (_b = this.navMain.current) === null || _b === void 0 ? void 0 : _b.children[0]) === null || _c === void 0 ? void 0 : _c.children) || [];
        var currentLi = li[currentIndex];
        var liOffsetLeft = (currentLi === null || currentLi === void 0 ? void 0 : currentLi.offsetLeft) - 20;
        var liClientWidth = currentLi === null || currentLi === void 0 ? void 0 : currentLi.clientWidth;
        var scrollLeft = ((_d = this.navMain.current) === null || _d === void 0 ? void 0 : _d.scrollLeft) || 0;
        var clientWidth = ((_e = this.navMain.current) === null || _e === void 0 ? void 0 : _e.clientWidth) || 0;
        // 左边被遮住了
        if (scrollLeft > liOffsetLeft) {
            (_f = this.navMain.current) === null || _f === void 0 ? void 0 : _f.scrollTo({
                left: liOffsetLeft,
                behavior: 'smooth'
            });
        }
        // 右边被遮住了
        if (liOffsetLeft + liClientWidth > scrollLeft + clientWidth) {
            (_g = this.navMain.current) === null || _g === void 0 ? void 0 : _g.scrollTo({
                left: liOffsetLeft + liClientWidth - clientWidth,
                behavior: 'smooth'
            });
        }
    };
    Tabs.prototype.handleSelect = function (key) {
        var _this = this;
        var onSelect = this.props.onSelect;
        this.showSelected(key);
        setTimeout(function () {
            _this.checkArrowStatus();
        }, 500);
        onSelect && onSelect(key);
    };
    Tabs.prototype.handleArrow = function (type) {
        var _a, _b, _c;
        var _d = this.navMain.current
            || {
                scrollLeft: 0,
                scrollWidth: 0,
                clientWidth: 0
            }, scrollLeft = _d.scrollLeft, scrollWidth = _d.scrollWidth, clientWidth = _d.clientWidth;
        if (type === 'left' && scrollLeft > 0) {
            (_a = this.navMain.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
            this.setState({
                arrowRightDisabled: false,
                arrowLeftDisabled: true
            });
        }
        else if (type === 'right' && scrollWidth > scrollLeft + clientWidth) {
            (_b = this.navMain.current) === null || _b === void 0 ? void 0 : _b.scrollTo({
                left: (_c = this.navMain.current) === null || _c === void 0 ? void 0 : _c.scrollWidth,
                behavior: 'smooth'
            });
            this.setState({
                arrowRightDisabled: true,
                arrowLeftDisabled: false
            });
        }
        this.scroll = true;
    };
    /**
     * 监听导航上的滚动事件
     */
    Tabs.prototype.handleWheel = function (e) {
        var _a, _b;
        var deltaY = e.deltaY, deltaX = e.deltaX;
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        // 当鼠标上下滚动时转换为左右滚动
        if (absY > absX) {
            (_a = this.navMain.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
                left: ((_b = this.navMain.current) === null || _b === void 0 ? void 0 : _b.scrollLeft) + deltaY
            });
            e.preventDefault();
        }
        this.checkArrowStatus();
        this.scroll = true;
    };
    Tabs.prototype.renderNav = function (child, index) {
        var _this = this;
        if (!child) {
            return;
        }
        var _a = this.props, cx = _a.classnames, activeKeyProp = _a.activeKey, mode = _a.mode;
        var _b = child.props, eventKey = _b.eventKey, disabled = _b.disabled, icon = _b.icon, iconPosition = _b.iconPosition, title = _b.title, toolbar = _b.toolbar, tabClassName = _b.tabClassName;
        var activeKey = activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;
        var iconElement = (0, icon_1.generateIcon)(cx, icon, 'Icon');
        return (react_1.default.createElement("li", { className: cx('Tabs-link', activeKey === eventKey ? 'is-active' : '', disabled ? 'is-disabled' : '', tabClassName), key: eventKey !== null && eventKey !== void 0 ? eventKey : index, onClick: function () { return (disabled ? '' : _this.handleSelect(eventKey)); } },
            react_1.default.createElement("a", null,
                icon ? (iconPosition === 'right' ? (react_1.default.createElement(react_1.default.Fragment, null,
                    title,
                    " ",
                    iconElement)) : (react_1.default.createElement(react_1.default.Fragment, null,
                    iconElement,
                    " ",
                    title))) : (title),
                react_1.default.isValidElement(toolbar) ? toolbar : null),
            mode === 'chrome' ? (react_1.default.createElement("div", { className: "chrome-tab-background" },
                react_1.default.createElement("svg", { viewBox: "0 0 124 124", className: "chrome-tab-background--right" },
                    react_1.default.createElement("path", { d: "M0,0 C0,68.483309 55.516691,124 124,124 L0,124 L0,-1 C0.00132103964,-0.667821298 0,-0.334064922 0,0 Z" })),
                react_1.default.createElement("svg", { viewBox: "0 0 124 124", className: "chrome-tab-background--left" },
                    react_1.default.createElement("path", { d: "M124,0 L124,125 L0,125 L0,125 C68.483309,125 124,69.483309 124,1 L123.992,0 L124,0 Z" })))) : null));
    };
    Tabs.prototype.renderTab = function (child, index) {
        if (!child) {
            return;
        }
        var _a = this.props, activeKeyProp = _a.activeKey, classnames = _a.classnames;
        var eventKey = child.props.eventKey;
        var activeKey = activeKeyProp === undefined && index === 0 ? eventKey : activeKeyProp;
        return react_1.default.cloneElement(child, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, child.props), { key: eventKey, classnames: classnames, activeKey: activeKey }));
    };
    Tabs.prototype.renderArrow = function (type) {
        var _this = this;
        var _a = this.props, dMode = _a.mode, tabsMode = _a.tabsMode;
        var mode = tabsMode || dMode;
        if (mode === 'vertical') {
            return;
        }
        var cx = this.props.classnames;
        var _b = this.state, isOverflow = _b.isOverflow, arrowLeftDisabled = _b.arrowLeftDisabled, arrowRightDisabled = _b.arrowRightDisabled;
        var disabled = type === 'left' ? arrowLeftDisabled : arrowRightDisabled;
        return (isOverflow
            ? (react_1.default.createElement("div", { onClick: function () { return _this.handleArrow(type); }, className: cx('Tabs-linksContainer-arrow', 'Tabs-linksContainer-arrow--' + type, disabled && 'Tabs-linksContainer-arrow--disabled') },
                react_1.default.createElement("i", { className: 'iconfont icon-arrow-' + type })))
            : null);
    };
    Tabs.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, cx = _b.classnames, contentClassName = _b.contentClassName, className = _b.className, dMode = _b.mode, tabsMode = _b.tabsMode, children = _b.children, additionBtns = _b.additionBtns, toolbar = _b.toolbar, linksClassName = _b.linksClassName, scrollable = _b.scrollable;
        var isOverflow = this.state.isOverflow;
        if (!Array.isArray(children)) {
            return null;
        }
        var mode = tabsMode || dMode;
        return (react_1.default.createElement("div", { className: cx("Tabs", (_a = {},
                _a["Tabs--" + mode] = mode,
                _a), className) },
            scrollable && !['vertical', 'chrome'].includes(mode) ?
                (react_1.default.createElement("div", { className: cx('Tabs-linksContainer', isOverflow && 'Tabs-linksContainer--overflow') },
                    this.renderArrow('left'),
                    react_1.default.createElement("div", { className: cx('Tabs-linksContainer-main'), ref: this.navMain },
                        react_1.default.createElement("ul", { className: cx('Tabs-links', linksClassName), role: "tablist" },
                            children.map(function (tab, index) { return _this.renderNav(tab, index); }),
                            additionBtns,
                            toolbar)),
                    this.renderArrow('right')))
                : (react_1.default.createElement("ul", { className: cx('Tabs-links', linksClassName), role: "tablist" },
                    children.map(function (tab, index) { return _this.renderNav(tab, index); }),
                    additionBtns,
                    toolbar)),
            react_1.default.createElement("div", { className: cx('Tabs-content', contentClassName) }, children.map(function (child, index) {
                return _this.renderTab(child, index);
            }))));
    };
    var _b;
    Tabs.defaultProps = {
        mode: '',
        contentClassName: ''
    };
    Tabs.Tab = exports.Tab;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof WheelEvent !== "undefined" && WheelEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Tabs.prototype, "handleWheel", null);
    return Tabs;
}(react_1.default.Component));
exports.Tabs = Tabs;
var ThemedTabs = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(Tabs, {
    activeKey: 'onSelect'
}));
exports.default = ThemedTabs;
//# sourceMappingURL=./components/Tabs.js.map
