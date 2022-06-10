"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckboxes = void 0;
var tslib_1 = require("tslib");
var Checkboxes_1 = require("./Checkboxes");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var locale_1 = require("../locale");
var ListCheckboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListCheckboxes, _super);
    function ListCheckboxes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListCheckboxes.prototype.renderOption = function (option, index) {
        var _this = this;
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender;
        var valueArray = this.valueArray;
        if (Array.isArray(option.children)) {
            return (react_1.default.createElement("div", { key: index, className: cx('ListCheckboxes-group', option.className) },
                react_1.default.createElement("div", { className: cx('ListCheckboxes-itemLabel') }, itemRender(option)),
                react_1.default.createElement("div", { className: cx('ListCheckboxes-items', option.className) }, option.children.map(function (child, index) {
                    return _this.renderOption(child, index);
                }))));
        }
        return (react_1.default.createElement("div", { key: index, className: cx('ListCheckboxes-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : ''), onClick: function () { return _this.toggleOption(option); } },
            react_1.default.createElement("div", { className: cx('ListCheckboxes-itemLabel') }, itemRender(option)),
            react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description })));
    };
    ListCheckboxes.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value;
        var __ = this.props.translate;
        this.valueArray = Checkboxes_1.BaseCheckboxes.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return _this.renderOption(option, key); });
        }
        return (react_1.default.createElement("div", { className: cx('ListCheckboxes', className) }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('ListCheckboxes-placeholder') }, __(placeholder)))));
    };
    return ListCheckboxes;
}(Checkboxes_1.BaseCheckboxes));
exports.ListCheckboxes = ListCheckboxes;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ListCheckboxes, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/ListCheckboxes.js.map
