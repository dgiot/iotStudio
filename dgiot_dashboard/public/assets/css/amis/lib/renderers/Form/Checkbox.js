"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var CheckboxControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxControl, _super);
    function CheckboxControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxControl.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, trueValue = _a.trueValue, falseValue = _a.falseValue, option = _a.option, onChange = _a.onChange, disabled = _a.disabled, render = _a.render, ns = _a.classPrefix;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "CheckboxControl", className) },
            react_1.default.createElement(Checkbox_1.default, { inline: true, value: value || '', trueValue: trueValue, falseValue: falseValue, disabled: disabled, onChange: function (value) { return onChange(value); } }, option ? render('option', option) : null)));
    };
    CheckboxControl.defaultProps = {
        trueValue: true,
        falseValue: false
    };
    return CheckboxControl;
}(react_1.default.Component));
exports.default = CheckboxControl;
var CheckboxControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxControlRenderer, _super);
    function CheckboxControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'checkbox',
            sizeMutable: false
        })
    ], CheckboxControlRenderer);
    return CheckboxControlRenderer;
}(CheckboxControl));
exports.CheckboxControlRenderer = CheckboxControlRenderer;
//# sourceMappingURL=./renderers/Form/Checkbox.js.map
