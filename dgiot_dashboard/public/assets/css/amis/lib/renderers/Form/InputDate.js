"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearControlRenderer = exports.QuarterControlRenderer = exports.MonthControlRenderer = exports.TimeControlRenderer = exports.DatetimeControlRenderer = exports.DateControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
require("moment/locale/zh-cn");
var DatePicker_1 = (0, tslib_1.__importDefault)(require("../../components/DatePicker"));
var DateControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateControl, _super);
    function DateControl(props) {
        var _this = _super.call(this, props) || this;
        var minDate = props.minDate, maxDate = props.maxDate, value = props.value, defaultValue = props.defaultValue, setPrinstineValue = props.setPrinstineValue, data = props.data, format = props.format, utc = props.utc;
        if (defaultValue && value === defaultValue) {
            var date = (0, tpl_builtin_1.filterDate)(defaultValue, data, format);
            setPrinstineValue((utc ? moment_1.default.utc(date) : date).format(format));
        }
        _this.state = {
            minDate: minDate ? (0, tpl_builtin_1.filterDate)(minDate, data, format) : undefined,
            maxDate: maxDate ? (0, tpl_builtin_1.filterDate)(maxDate, data, format) : undefined
        };
        return _this;
    }
    DateControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.defaultValue !== props.defaultValue) {
            var date = (0, tpl_builtin_1.filterDate)(props.defaultValue, props.data, props.format);
            props.setPrinstineValue((props.utc ? moment_1.default.utc(date) : date).format(props.format));
        }
        if (prevProps.minDate !== props.minDate ||
            prevProps.maxDate !== props.maxDate ||
            prevProps.data !== props.data) {
            this.setState({
                minDate: props.minDate
                    ? (0, tpl_builtin_1.filterDate)(props.minDate, props.data, this.props.format)
                    : undefined,
                maxDate: props.maxDate
                    ? (0, tpl_builtin_1.filterDate)(props.maxDate, props.data, this.props.format)
                    : undefined
            });
        }
    };
    DateControl.prototype.render = function () {
        var _a = this.props, className = _a.className, defaultValue = _a.defaultValue, defaultData = _a.defaultData, cx = _a.classnames, minDate = _a.minDate, maxDate = _a.maxDate, type = _a.type, format = _a.format, timeFormat = _a.timeFormat, valueFormat = _a.valueFormat, rest = (0, tslib_1.__rest)(_a, ["className", "defaultValue", "defaultData", "classnames", "minDate", "maxDate", "type", "format", "timeFormat", "valueFormat"]);
        if (type === 'time' && timeFormat) {
            format = timeFormat;
        }
        return (react_1.default.createElement("div", { className: cx("DateControl", className) },
            react_1.default.createElement(DatePicker_1.default, (0, tslib_1.__assign)({}, rest, { timeFormat: timeFormat, format: valueFormat || format }, this.state, { classnames: cx }))));
    };
    DateControl.defaultProps = {
        format: 'X',
        viewMode: 'days',
        inputFormat: 'YYYY-MM-DD',
        timeConstraints: {
            minutes: {
                step: 1
            }
        },
        clearable: true
    };
    return DateControl;
}(react_1.default.PureComponent));
exports.default = DateControl;
var DateControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateControlRenderer, _super);
    function DateControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Date.placeholder', dateFormat: 'YYYY-MM-DD', timeFormat: '', strictMode: false });
    DateControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-date',
            weight: -150
        })
    ], DateControlRenderer);
    return DateControlRenderer;
}(DateControl));
exports.DateControlRenderer = DateControlRenderer;
var DatetimeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DatetimeControlRenderer, _super);
    function DatetimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DatetimeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'DateTime.placeholder', inputFormat: 'YYYY-MM-DD HH:mm:ss', dateFormat: 'LL', timeFormat: 'HH:mm:ss', closeOnSelect: false, strictMode: false });
    DatetimeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-datetime'
        })
    ], DatetimeControlRenderer);
    return DatetimeControlRenderer;
}(DateControl));
exports.DatetimeControlRenderer = DatetimeControlRenderer;
var TimeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TimeControlRenderer, _super);
    function TimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Time.placeholder', inputFormat: 'HH:mm', dateFormat: '', timeFormat: 'HH:mm', viewMode: 'time', closeOnSelect: false });
    TimeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-time'
        })
    ], TimeControlRenderer);
    return TimeControlRenderer;
}(DateControl));
exports.TimeControlRenderer = TimeControlRenderer;
var MonthControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MonthControlRenderer, _super);
    function MonthControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Month.placeholder', inputFormat: 'YYYY-MM', dateFormat: 'MM', timeFormat: '', viewMode: 'months', closeOnSelect: true });
    MonthControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-month'
        })
    ], MonthControlRenderer);
    return MonthControlRenderer;
}(DateControl));
exports.MonthControlRenderer = MonthControlRenderer;
var QuarterControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(QuarterControlRenderer, _super);
    function QuarterControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuarterControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Quarter.placeholder', inputFormat: 'YYYY [Q]Q', dateFormat: 'YYYY [Q]Q', timeFormat: '', viewMode: 'quarters', closeOnSelect: true });
    QuarterControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-quarter'
        })
    ], QuarterControlRenderer);
    return QuarterControlRenderer;
}(DateControl));
exports.QuarterControlRenderer = QuarterControlRenderer;
var YearControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(YearControlRenderer, _super);
    function YearControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YearControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, DateControl.defaultProps), { placeholder: 'Year.placeholder', inputFormat: 'YYYY', dateFormat: 'YYYY', timeFormat: '', viewMode: 'years', closeOnSelect: true });
    YearControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-year'
        })
    ], YearControlRenderer);
    return YearControlRenderer;
}(DateControl));
exports.YearControlRenderer = YearControlRenderer;
//# sourceMappingURL=./renderers/Form/InputDate.js.map
