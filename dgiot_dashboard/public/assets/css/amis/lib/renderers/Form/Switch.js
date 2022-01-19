"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var Switch_1 = (0, tslib_1.__importDefault)(require("../../components/Switch"));
var SwitchControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SwitchControl, _super);
    function SwitchControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, cx = _a.classnames, value = _a.value, trueValue = _a.trueValue, falseValue = _a.falseValue, onText = _a.onText, offText = _a.offText, option = _a.option, onChange = _a.onChange, disabled = _a.disabled, optionAtLeft = _a.optionAtLeft;
        return (react_1.default.createElement("div", { className: cx("SwitchControl", className) },
            optionAtLeft ? (react_1.default.createElement("span", { className: cx('Switch-option') }, option)) : null,
            react_1.default.createElement(Switch_1.default, { classPrefix: ns, value: value, trueValue: trueValue, falseValue: falseValue, onText: onText, offText: offText, disabled: disabled, onChange: onChange }),
            optionAtLeft ? null : (react_1.default.createElement("span", { className: cx('Switch-option') }, option))));
    };
    SwitchControl.defaultProps = {
        trueValue: true,
        falseValue: false,
        optionAtLeft: false
    };
    return SwitchControl;
}(react_1.default.Component));
exports.default = SwitchControl;
var SwitchControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SwitchControlRenderer, _super);
    function SwitchControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'switch',
            sizeMutable: false
        })
    ], SwitchControlRenderer);
    return SwitchControlRenderer;
}(SwitchControl));
exports.SwitchControlRenderer = SwitchControlRenderer;
//# sourceMappingURL=./renderers/Form/Switch.js.map
