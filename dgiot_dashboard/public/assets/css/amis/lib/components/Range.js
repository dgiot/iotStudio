"use strict";
/**
 * @file Range
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_input_range_1 = (0, tslib_1.__importDefault)(require("react-input-range"));
var uncontrollable_1 = require("uncontrollable");
var theme_1 = require("../theme");
var Range = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Range, _super);
    function Range() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Range.prototype.render = function () {
        var _a = this.props, min = _a.min, max = _a.max, value = _a.value, className = _a.className, ns = _a.classPrefix, multiple = _a.multiple;
        var classNames = {
            activeTrack: multiple
                ? ns + "InputRange-track is-active"
                : ns + "InputRange-track",
            disabledInputRange: ns + "InputRange is-disabled",
            inputRange: ns + "InputRange",
            labelContainer: ns + "InputRange-labelContainer",
            maxLabel: ns + "InputRange-label " + ns + "InputRange-label--max",
            minLabel: ns + "InputRange-label " + ns + "InputRange-label--min",
            slider: ns + "InputRange-slider",
            sliderContainer: ns + "InputRange-sliderContainer",
            track: ns + "InputRange-track " + ns + "InputRange-track--background",
            valueLabel: ns + "InputRange-label " + ns + "InputRange-label--value"
        };
        return (react_1.default.createElement(react_input_range_1.default, (0, tslib_1.__assign)({}, this.props, { classNames: classNames, minValue: min, maxValue: max, value: value })));
    };
    Range.defaultProps = {
        min: 1,
        max: 100
    };
    return Range;
}(react_1.default.Component));
exports.Range = Range;
exports.default = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(Range, {
    value: 'onChange'
}));
//# sourceMappingURL=./components/Range.js.map
