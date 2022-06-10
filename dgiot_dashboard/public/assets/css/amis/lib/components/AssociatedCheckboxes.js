"use strict";
/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociatedCheckboxes = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Checkboxes_1 = require("./Checkboxes");
var Select_1 = require("./Select");
var helper_1 = require("../utils/helper");
var ListRadios_1 = (0, tslib_1.__importDefault)(require("./ListRadios"));
var theme_1 = require("../theme");
var uncontrollable_1 = require("uncontrollable");
var ListCheckboxes_1 = (0, tslib_1.__importDefault)(require("./ListCheckboxes"));
var TableCheckboxes_1 = (0, tslib_1.__importDefault)(require("./TableCheckboxes"));
var TreeCheckboxes_1 = (0, tslib_1.__importDefault)(require("./TreeCheckboxes"));
var ChainedCheckboxes_1 = (0, tslib_1.__importDefault)(require("./ChainedCheckboxes"));
var TreeRadios_1 = (0, tslib_1.__importDefault)(require("./TreeRadios"));
var icons_1 = require("./icons");
var locale_1 = require("../locale");
var AssociatedCheckboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AssociatedCheckboxes, _super);
    function AssociatedCheckboxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            leftValue: _this.props.leftDefaultValue
        };
        return _this;
    }
    AssociatedCheckboxes.prototype.componentDidMount = function () {
        var leftValue = this.state.leftValue;
        var _a = this.props, options = _a.options, onDeferLoad = _a.onDeferLoad;
        if (leftValue) {
            var selectdOption = ListRadios_1.default.resolveSelected(leftValue, options, function (option) { return option.ref; });
            if (selectdOption && onDeferLoad && selectdOption.defer) {
                onDeferLoad(selectdOption);
            }
        }
    };
    AssociatedCheckboxes.prototype.leftOption2Value = function (option) {
        return option.value;
    };
    AssociatedCheckboxes.prototype.handleLeftSelect = function (value) {
        var _a = this.props, options = _a.options, onDeferLoad = _a.onDeferLoad;
        this.setState({ leftValue: value });
        var selectdOption = ListRadios_1.default.resolveSelected(value, options, function (option) { return option.ref; });
        if (selectdOption && onDeferLoad && selectdOption.defer) {
            onDeferLoad(selectdOption);
        }
    };
    AssociatedCheckboxes.prototype.handleRetry = function (option) {
        var onDeferLoad = this.props.onDeferLoad;
        onDeferLoad === null || onDeferLoad === void 0 ? void 0 : onDeferLoad(option);
    };
    AssociatedCheckboxes.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, leftOptions = _a.leftOptions, options = _a.options, option2value = _a.option2value, rightMode = _a.rightMode, onChange = _a.onChange, columns = _a.columns, value = _a.value, disabled = _a.disabled, leftMode = _a.leftMode, cellRender = _a.cellRender;
        var selectdOption = ListRadios_1.default.resolveSelected(this.state.leftValue, options, function (option) { return option.ref; });
        var __ = this.props.translate;
        return (react_1.default.createElement("div", { className: cx('AssociatedCheckboxes', className) },
            react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-left') }, leftMode === 'tree' ? (react_1.default.createElement(TreeRadios_1.default, { option2value: this.leftOption2Value, options: leftOptions, value: this.state.leftValue, disabled: disabled, onChange: this.handleLeftSelect, showRadio: false })) : (react_1.default.createElement(ListRadios_1.default, { option2value: this.leftOption2Value, options: leftOptions, value: this.state.leftValue, disabled: disabled, onChange: this.handleLeftSelect, showRadio: false }))),
            react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-right') }, this.state.leftValue ? (selectdOption ? (selectdOption.defer && !selectdOption.loaded ? (react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-box') },
                react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-reload', selectdOption.loading ? 'is-spin' : 'is-clickable'), onClick: selectdOption.loading
                        ? undefined
                        : this.handleRetry.bind(this, selectdOption) },
                    react_1.default.createElement(icons_1.Icon, { icon: "reload", className: "icon" })),
                selectdOption.loading ? (react_1.default.createElement("p", null, __('loading'))) : (react_1.default.createElement("p", null, __('Transfer.refreshIcon'))))) : rightMode === 'table' ? (react_1.default.createElement(TableCheckboxes_1.default, { columns: columns, value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value, cellRender: cellRender })) : rightMode === 'tree' ? (react_1.default.createElement(TreeCheckboxes_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value })) : rightMode === 'chained' ? (react_1.default.createElement(ChainedCheckboxes_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value })) : (react_1.default.createElement(ListCheckboxes_1.default, { value: value, disabled: disabled, options: selectdOption.children || [], onChange: onChange, option2value: option2value }))) : (react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-box') }, __('Transfer.configError')))) : (react_1.default.createElement("div", { className: cx('AssociatedCheckboxes-box') }, __('Transfer.selectFromLeft'))))));
    };
    var _a, _b;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AssociatedCheckboxes.prototype, "leftOption2Value", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AssociatedCheckboxes.prototype, "handleLeftSelect", null);
    return AssociatedCheckboxes;
}(Checkboxes_1.BaseCheckboxes));
exports.AssociatedCheckboxes = AssociatedCheckboxes;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(AssociatedCheckboxes, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/AssociatedCheckboxes.js.map
