"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeRadios = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var helper_1 = require("../utils/helper");
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var ListRadios_1 = require("./ListRadios");
var locale_1 = require("../locale");
var icons_1 = require("./icons");
var TreeRadios = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TreeRadios, _super);
    function TreeRadios() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            expanded: []
        };
        return _this;
    }
    TreeRadios.prototype.componentDidMount = function () {
        this.syncExpanded();
    };
    TreeRadios.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (!this.state.expanded.length &&
            (props.expand !== prevProps.expand || props.options !== prevProps.options)) {
            this.syncExpanded();
        }
    };
    TreeRadios.prototype.syncExpanded = function () {
        var options = this.props.options;
        var mode = this.props.expand;
        var expanded = [];
        if (!Array.isArray(options)) {
            return;
        }
        if (mode === 'first' || mode === 'root') {
            options.every(function (option, index) {
                if (Array.isArray(option.children)) {
                    expanded.push("" + index);
                    return mode === 'root';
                }
                return true;
            });
        }
        else if (mode === 'all') {
            (0, helper_1.everyTree)(options, function (option, index, level, paths, indexes) {
                if (Array.isArray(option.children)) {
                    expanded.push("" + indexes.concat(index).join('-'));
                }
                return true;
            });
        }
        this.setState({ expanded: expanded });
    };
    TreeRadios.prototype.toggleCollapsed = function (option, index) {
        var onDeferLoad = this.props.onDeferLoad;
        var expanded = this.state.expanded.concat();
        var idx = expanded.indexOf(index);
        if (~idx) {
            expanded.splice(idx, 1);
        }
        else {
            expanded.push(index);
        }
        this.setState({
            expanded: expanded
        }, option.defer && onDeferLoad ? function () { return onDeferLoad(option); } : undefined);
    };
    TreeRadios.prototype.renderItem = function (option, index, indexes) {
        var _this = this;
        if (indexes === void 0) { indexes = []; }
        var _a = this.props, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, showRadio = _a.showRadio;
        var id = indexes.join('-');
        var hasChildren = Array.isArray(option.children) && option.children.length;
        var checked = option === this.selected;
        var expaned = !!~this.state.expanded.indexOf(id);
        return (react_1.default.createElement("div", { key: index, className: cx('TreeRadios-item', disabled || option.disabled || (option.defer && option.loading)
                ? 'is-disabled'
                : '', expaned ? 'is-expanded' : '', checked ? 'is-active' : '') },
            react_1.default.createElement("div", { className: cx('TreeRadios-itemInner', itemClassName, option.className, checked ? 'is-active' : ''), onClick: function () { return _this.toggleOption(option); } },
                hasChildren || option.defer ? (react_1.default.createElement("a", { onClick: function (e) {
                        e.stopPropagation();
                        _this.toggleCollapsed(option, id);
                    }, className: cx('Table-expandBtn', expaned ? 'is-active' : '') },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" }))) : null,
                react_1.default.createElement("div", { className: cx('TreeRadios-itemLabel') }, itemRender(option)),
                option.defer && option.loading ? react_1.default.createElement(Spinner_1.default, { show: true, size: "sm" }) : null,
                (!option.defer || option.loaded) &&
                    option.value !== undefined &&
                    showRadio !== false ? (react_1.default.createElement(Checkbox_1.default, { type: "radio", size: "sm", checked: checked, disabled: disabled || option.disabled })) : null),
            hasChildren ? (react_1.default.createElement("div", { className: cx('TreeRadios-sublist') }, option.children.map(function (option, key) {
                return _this.renderItem(option, key, indexes.concat(key));
            }))) : null));
    };
    TreeRadios.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, __ = _a.translate;
        this.selected = ListRadios_1.BaseRadios.resolveSelected(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return _this.renderItem(option, key, [key]); });
        }
        return (react_1.default.createElement("div", { className: cx('TreeRadios', className) }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('TreeRadios-placeholder') }, __(placeholder)))));
    };
    TreeRadios.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ListRadios_1.BaseRadios.defaultProps), { expand: 'first' });
    return TreeRadios;
}(ListRadios_1.BaseRadios));
exports.TreeRadios = TreeRadios;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(TreeRadios, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/TreeRadios.js.map
