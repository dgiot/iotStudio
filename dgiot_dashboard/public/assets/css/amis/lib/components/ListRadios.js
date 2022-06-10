"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRadios = exports.BaseRadios = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var Select_1 = require("./Select");
var helper_1 = require("../utils/helper");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var locale_1 = require("../locale");
var BaseRadios = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseRadios, _super);
    function BaseRadios() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseRadios.resolveSelected = function (value, options, option2value) {
        if (option2value === void 0) { option2value = function (option) { return option; }; }
        return (0, helper_1.findTree)(options, function (option) { return (0, isEqual_1.default)(option2value(option), value); });
    };
    BaseRadios.prototype.toggleOption = function (option) {
        var _a = this.props, onChange = _a.onChange, clearable = _a.clearable, value = _a.value, options = _a.options, option2value = _a.option2value;
        var newValue = option;
        if (clearable) {
            var prevSelected = BaseRadios.resolveSelected(value, options, option2value);
            if (prevSelected) {
                newValue = null;
            }
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue && option2value ? option2value(newValue) : newValue);
    };
    BaseRadios.prototype.renderOption = function (option, index) {
        var _this = this;
        var _a = this.props, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, showRadio = _a.showRadio;
        var selected = this.selected;
        if (Array.isArray(option.children)) {
            return (react_1.default.createElement("div", { key: index, className: cx('ListRadios-group', option.className) },
                react_1.default.createElement("div", { className: cx('ListRadios-itemLabel') }, itemRender(option)),
                react_1.default.createElement("div", { className: cx('ListRadios-items', option.className) }, option.children.map(function (child, index) {
                    return _this.renderOption(child, index);
                }))));
        }
        return (react_1.default.createElement("div", { key: index, className: cx('ListRadios-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : '', selected === option ? 'is-active' : ''), onClick: function () { return _this.toggleOption(option); } },
            react_1.default.createElement("div", { className: cx('ListRadios-itemLabel') }, itemRender(option)),
            showRadio !== false ? (react_1.default.createElement(Checkbox_1.default, { type: "radio", size: "sm", checked: selected === option, disabled: disabled || option.disabled })) : null));
    };
    BaseRadios.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, onClick = _a.onClick;
        var __ = this.props.translate;
        this.selected = BaseRadios.resolveSelected(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return _this.renderOption(option, key); });
        }
        return (react_1.default.createElement("div", { className: cx('ListRadios', className), onClick: onClick }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('ListRadios-placeholder') }, __(placeholder)))));
    };
    var _a;
    BaseRadios.defaultProps = {
        placeholder: 'placeholder.noOption',
        itemRender: function (option) { return react_1.default.createElement("span", null, option.label); }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseRadios.prototype, "toggleOption", null);
    return BaseRadios;
}(react_1.default.Component));
exports.BaseRadios = BaseRadios;
var ListRadios = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListRadios, _super);
    function ListRadios() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListRadios;
}(BaseRadios));
exports.ListRadios = ListRadios;
var themedListRadios = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ListRadios, {
    value: 'onChange'
})));
themedListRadios.resolveSelected = BaseRadios.resolveSelected;
exports.default = themedListRadios;
//# sourceMappingURL=./components/ListRadios.js.map
