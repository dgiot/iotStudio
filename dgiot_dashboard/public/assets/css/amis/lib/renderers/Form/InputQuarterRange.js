"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuarterRangeControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var InputDateRange_1 = (0, tslib_1.__importDefault)(require("./InputDateRange"));
var DateRangePicker_1 = (0, tslib_1.__importDefault)(require("../../components/DateRangePicker"));
var QuarterRangeControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QuarterRangeControl, _super);
    function QuarterRangeControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterRangeControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, defaultValue = _a.defaultValue, defaultData = _a.defaultData, minDate = _a.minDate, maxDate = _a.maxDate, minDuration = _a.minDuration, maxDuration = _a.maxDuration, data = _a.data, format = _a.format, rest = (0, tslib_1.__rest)(_a, ["className", "classPrefix", "defaultValue", "defaultData", "minDate", "maxDate", "minDuration", "maxDuration", "data", "format"]);
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "DateRangeControl", className) },
            react_1.default.createElement(DateRangePicker_1.default, (0, tslib_1.__assign)({ viewMode: "quarters", format: "YYYY-[Q]Q", inputFormat: "YYYY-[Q]Q", placeholder: "QuarterRange.placeholder", ranges: "thisquarter,prevquarter", classPrefix: ns, data: data }, rest, { minDate: minDate ? (0, tpl_builtin_1.filterDate)(minDate, data, format) : undefined, maxDate: maxDate ? (0, tpl_builtin_1.filterDate)(maxDate, data, format) : undefined, minDuration: minDuration ? (0, tpl_builtin_1.parseDuration)(minDuration) : undefined, maxDuration: maxDuration ? (0, tpl_builtin_1.parseDuration)(maxDuration) : undefined }))));
    };
    return QuarterRangeControl;
}(InputDateRange_1.default));
exports.default = QuarterRangeControl;
var QuarterRangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QuarterRangeControlRenderer, _super);
    function QuarterRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterRangeControlRenderer.defaultProps = {
        format: 'X',
        joinValues: true,
        delimiter: ',',
        timeFormat: ''
    };
    QuarterRangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-quarter-range'
        })
    ], QuarterRangeControlRenderer);
    return QuarterRangeControlRenderer;
}(QuarterRangeControl));
exports.QuarterRangeControlRenderer = QuarterRangeControlRenderer;
//# sourceMappingURL=./renderers/Form/InputQuarterRange.js.map