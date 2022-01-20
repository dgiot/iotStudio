"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthRangeControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
require("moment/locale/zh-cn");
var DateRangePicker_1 = require("../../components/DateRangePicker");
var MonthRangePicker_1 = (0, tslib_1.__importDefault)(require("../../components/MonthRangePicker"));
var MonthRangeControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MonthRangeControl, _super);
    function MonthRangeControl(props) {
        var _this = _super.call(this, props) || this;
        var defaultValue = props.defaultValue, setPrinstineValue = props.setPrinstineValue, delimiter = props.delimiter, format = props.format, data = props.data, value = props.value, joinValues = props.joinValues, utc = props.utc;
        if (defaultValue && value === defaultValue) {
            var arr = typeof defaultValue === 'string'
                ? defaultValue.split(delimiter)
                : defaultValue;
            setPrinstineValue(DateRangePicker_1.DateRangePicker.formatValue({
                startDate: (0, tpl_builtin_1.filterDate)(arr[0], data, format),
                endDate: (0, tpl_builtin_1.filterDate)(arr[1], data, format)
            }, format, joinValues, delimiter, utc));
        }
        return _this;
    }
    MonthRangeControl.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, defaultValue = _a.defaultValue, delimiter = _a.delimiter, joinValues = _a.joinValues, setPrinstineValue = _a.setPrinstineValue, data = _a.data, utc = _a.utc, format = _a.format;
        if (prevProps.defaultValue !== defaultValue) {
            var arr = typeof defaultValue === 'string'
                ? defaultValue.split(delimiter)
                : defaultValue;
            setPrinstineValue(arr
                ? DateRangePicker_1.DateRangePicker.formatValue({
                    startDate: (0, tpl_builtin_1.filterDate)(arr[0], data, format),
                    endDate: (0, tpl_builtin_1.filterDate)(arr[1], data, format)
                }, format, joinValues, delimiter, utc)
                : undefined);
        }
    };
    MonthRangeControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, defaultValue = _a.defaultValue, defaultData = _a.defaultData, minDate = _a.minDate, maxDate = _a.maxDate, minDuration = _a.minDuration, maxDuration = _a.maxDuration, data = _a.data, format = _a.format, rest = (0, tslib_1.__rest)(_a, ["className", "classPrefix", "defaultValue", "defaultData", "minDate", "maxDate", "minDuration", "maxDuration", "data", "format"]);
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "DateRangeControl", className) },
            react_1.default.createElement(MonthRangePicker_1.default, (0, tslib_1.__assign)({}, rest, { classPrefix: ns, data: data, format: format, minDate: minDate ? (0, tpl_builtin_1.filterDate)(minDate, data, format) : undefined, maxDate: maxDate ? (0, tpl_builtin_1.filterDate)(maxDate, data, format) : undefined, minDuration: minDuration ? (0, tpl_builtin_1.parseDuration)(minDuration) : undefined, maxDuration: maxDuration ? (0, tpl_builtin_1.parseDuration)(maxDuration) : undefined }))));
    };
    MonthRangeControl.defaultProps = {
        format: 'X',
        joinValues: true,
        delimiter: ','
    };
    return MonthRangeControl;
}(react_1.default.Component));
exports.default = MonthRangeControl;
var MonthRangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MonthRangeControlRenderer, _super);
    function MonthRangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthRangeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, MonthRangeControl.defaultProps), { timeFormat: '' });
    MonthRangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-month-range'
        })
    ], MonthRangeControlRenderer);
    return MonthRangeControlRenderer;
}(MonthRangeControl));
exports.MonthRangeControlRenderer = MonthRangeControlRenderer;
//# sourceMappingURL=./renderers/Form/InputMonthRange.js.map
