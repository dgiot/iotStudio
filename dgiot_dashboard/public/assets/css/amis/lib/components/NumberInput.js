"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberInput = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
// @ts-ignore
var rc_input_number_1 = (0, tslib_1.__importDefault)(require("rc-input-number"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var NumberInput = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NumberInput, _super);
    function NumberInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberInput.prototype.handleChange = function (value) {
        var _a = this.props, min = _a.min, max = _a.max, onChange = _a.onChange;
        if (typeof value === 'number') {
            if (typeof min === 'number') {
                value = Math.max(value, min);
            }
            if (typeof max === 'number') {
                value = Math.min(value, max);
            }
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    NumberInput.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, cx = _b.classnames, value = _b.value, step = _b.step, precision = _b.precision, max = _b.max, min = _b.min, disabled = _b.disabled, placeholder = _b.placeholder, onChange = _b.onChange, showSteps = _b.showSteps, formatter = _b.formatter, parser = _b.parser, borderMode = _b.borderMode, readOnly = _b.readOnly;
        var precisionProps = {};
        if (typeof precision === 'number') {
            precisionProps.precision = precision;
        }
        return (react_1.default.createElement(rc_input_number_1.default, (0, tslib_1.__assign)({ className: cx(className, showSteps === false ? 'no-steps' : '', (_a = {},
                _a["Number--border" + (0, helper_1.ucFirst)(borderMode)] = borderMode,
                _a)), readOnly: readOnly, prefixCls: ns + "Number", value: value, step: step, max: max, min: min, formatter: formatter, parser: parser, onChange: this.handleChange, disabled: disabled, placeholder: placeholder }, precisionProps)));
    };
    NumberInput.defaultProps = {
        step: 1,
        readOnly: false,
        borderMode: 'full'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NumberInput.prototype, "handleChange", null);
    return NumberInput;
}(react_1.default.Component));
exports.NumberInput = NumberInput;
exports.default = (0, theme_1.themeable)(NumberInput);
//# sourceMappingURL=./components/NumberInput.js.map
