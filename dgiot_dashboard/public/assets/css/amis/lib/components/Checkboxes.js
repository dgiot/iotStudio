"use strict";
/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkboxes = exports.BaseCheckboxes = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var locale_1 = require("../locale");
var BaseCheckboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseCheckboxes, _super);
    function BaseCheckboxes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseCheckboxes.value2array = function (value, options, option2value) {
        if (option2value === void 0) { option2value = function (option) { return option; }; }
        if (value === void 0) {
            return [];
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        return value.map(function (value) {
            var option = (0, helper_1.findTree)(options, function (option) {
                return (0, isEqual_1.default)(option2value(option), value);
            });
            return option || value;
        });
    };
    BaseCheckboxes.prototype.toggleOption = function (option) {
        var _a = this.props, value = _a.value, onChange = _a.onChange, option2value = _a.option2value, options = _a.options, disabled = _a.disabled;
        if (disabled || option.disabled) {
            return;
        }
        var valueArray = BaseCheckboxes.value2array(value, options, option2value);
        var idx = valueArray.indexOf(option);
        if (~idx) {
            valueArray.splice(idx, 1);
        }
        else {
            valueArray.push(option);
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        onChange && onChange(newValue);
    };
    BaseCheckboxes.prototype.toggleAll = function () {
        var _a = this.props, value = _a.value, onChange = _a.onChange, option2value = _a.option2value, options = _a.options;
        var valueArray = [];
        if (!Array.isArray(value) || !value.length) {
            valueArray = options.filter(function (option) { return !option.disabled; });
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        onChange && onChange(newValue);
    };
    BaseCheckboxes.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, inline = _a.inline, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, option2value = _a.option2value, itemClassName = _a.itemClassName, itemRender = _a.itemRender;
        var __ = this.props.translate;
        var valueArray = BaseCheckboxes.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return (react_1.default.createElement(Checkbox_1.default, { className: cx(itemClassName, option.className), key: key, onChange: function () { return _this.toggleOption(option); }, checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description }, itemRender(option))); });
        }
        return (react_1.default.createElement("div", { className: cx('Checkboxes', className, inline ? 'Checkboxes--inline' : '') }, body && body.length ? body : react_1.default.createElement("div", null, __(placeholder))));
    };
    BaseCheckboxes.defaultProps = {
        placeholder: 'placeholder.noOption',
        itemRender: function (option) { return react_1.default.createElement("span", null, option.label); }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseCheckboxes.prototype, "toggleAll", null);
    return BaseCheckboxes;
}(react_1.default.Component));
exports.BaseCheckboxes = BaseCheckboxes;
var Checkboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Checkboxes, _super);
    function Checkboxes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Checkboxes;
}(BaseCheckboxes));
exports.Checkboxes = Checkboxes;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(Checkboxes, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/Checkboxes.js.map
