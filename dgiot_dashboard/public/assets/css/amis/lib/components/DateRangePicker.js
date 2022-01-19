"use strict";
/**
 * @file DateRangePicker
 * @description 自定义日期范围时间选择器组件
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangePicker = exports.availableRanges = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
var react_dom_1 = require("react-dom");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var icons_1 = require("./icons");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var Calendar_1 = (0, tslib_1.__importDefault)(require("./calendar/Calendar"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var locale_1 = require("../locale");
exports.availableRanges = {
    'today': {
        label: 'Date.today',
        startDate: function (now) {
            return now.startOf('day');
        },
        endDate: function (now) {
            return now;
        }
    },
    'yesterday': {
        label: 'Date.yesterday',
        startDate: function (now) {
            return now.add(-1, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    '1dayago': {
        label: 'DateRange.1dayago',
        startDate: function (now) {
            return now.add(-1, 'days');
        },
        endDate: function (now) {
            return now;
        }
    },
    '7daysago': {
        label: 'DateRange.7daysago',
        startDate: function (now) {
            return now.add(-7, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    '30daysago': {
        label: 'DateRange.30daysago',
        startDate: function (now) {
            return now.add(-30, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    '90daysago': {
        label: 'DateRange.90daysago',
        startDate: function (now) {
            return now.add(-90, 'days').startOf('day');
        },
        endDate: function (now) {
            return now.add(-1, 'days').endOf('day');
        }
    },
    'prevweek': {
        label: 'DateRange.lastWeek',
        startDate: function (now) {
            return now.startOf('week').add(-1, 'weeks');
        },
        endDate: function (now) {
            return now.startOf('week').add(-1, 'days').endOf('day');
        }
    },
    'thisweek': {
        label: 'DateRange.thisWeek',
        startDate: function (now) {
            return now.startOf('week');
        },
        endDate: function (now) {
            return now.endOf('week');
        }
    },
    'thismonth': {
        label: 'DateRange.thisMonth',
        startDate: function (now) {
            return now.startOf('month');
        },
        endDate: function (now) {
            return now.endOf('month');
        }
    },
    'thisquarter': {
        label: 'DateRange.thisQuarter',
        startDate: function (now) {
            return now.startOf('quarter');
        },
        endDate: function (now) {
            return now.endOf('quarter');
        }
    },
    'prevmonth': {
        label: 'DateRange.lastMonth',
        startDate: function (now) {
            return now.startOf('month').add(-1, 'month');
        },
        endDate: function (now) {
            return now.startOf('month').add(-1, 'day').endOf('day');
        }
    },
    'prevquarter': {
        label: 'DateRange.lastQuarter',
        startDate: function (now) {
            return now.startOf('quarter').add(-1, 'quarter');
        },
        endDate: function (now) {
            return now.startOf('quarter').add(-1, 'day').endOf('day');
        }
    },
    'thisyear': {
        label: 'DateRange.thisYear',
        startDate: function (now) {
            return now.startOf('year');
        },
        endDate: function (now) {
            return now.endOf('year');
        }
    },
    'lastYear': {
        label: 'DateRange.lastYear',
        startDate: function (now) {
            return now.startOf('year').add(-1, 'year');
        },
        endDate: function (now) {
            return now.endOf('year').add(-1, 'year').endOf('day');
        }
    }
};
var DateRangePicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DateRangePicker, _super);
    function DateRangePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.nextMonth = (0, moment_1.default)().add(1, 'months');
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleStartChange = _this.handleStartChange.bind(_this);
        _this.handleEndChange = _this.handleEndChange.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.checkStartIsValidDate = _this.checkStartIsValidDate.bind(_this);
        _this.checkEndIsValidDate = _this.checkEndIsValidDate.bind(_this);
        _this.confirm = _this.confirm.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.dom = react_1.default.createRef();
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.handlePopOverClick = _this.handlePopOverClick.bind(_this);
        _this.renderDay = _this.renderDay.bind(_this);
        _this.renderQuarter = _this.renderQuarter.bind(_this);
        var _a = _this.props, format = _a.format, joinValues = _a.joinValues, delimiter = _a.delimiter, value = _a.value;
        _this.state = (0, tslib_1.__assign)({ isOpened: false, isFocused: false }, DateRangePicker.unFormatValue(value, format, joinValues, delimiter));
        return _this;
    }
    DateRangePicker.formatValue = function (newValue, format, joinValues, delimiter, utc) {
        if (utc === void 0) { utc = false; }
        newValue = [
            (utc ? moment_1.default.utc(newValue.startDate) : newValue.startDate).format(format),
            (utc ? moment_1.default.utc(newValue.endDate) : newValue.endDate).format(format)
        ];
        if (joinValues) {
            newValue = newValue.join(delimiter);
        }
        return newValue;
    };
    DateRangePicker.unFormatValue = function (value, format, joinValues, delimiter) {
        if (!value) {
            return {
                startDate: undefined,
                endDate: undefined
            };
        }
        if (joinValues && typeof value === 'string') {
            value = value.split(delimiter);
        }
        return {
            startDate: value[0] ? (0, moment_1.default)(value[0], format) : undefined,
            endDate: value[1] ? (0, moment_1.default)(value[1], format) : undefined
        };
    };
    DateRangePicker.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var value = props.value, format = props.format, joinValues = props.joinValues, delimiter = props.delimiter;
        if (prevProps.value !== value) {
            this.setState((0, tslib_1.__assign)({}, DateRangePicker.unFormatValue(value, format, joinValues, delimiter)));
        }
    };
    DateRangePicker.prototype.focus = function () {
        if (!this.dom.current || this.props.disabled) {
            return;
        }
        this.dom.current.focus();
    };
    DateRangePicker.prototype.blur = function () {
        if (!this.dom.current || this.props.disabled) {
            return;
        }
        this.dom.current.blur();
    };
    DateRangePicker.prototype.handleFocus = function () {
        this.setState({
            isFocused: true
        });
    };
    DateRangePicker.prototype.handleBlur = function () {
        this.setState({
            isFocused: false
        });
    };
    DateRangePicker.prototype.open = function () {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true
        });
    };
    DateRangePicker.prototype.close = function () {
        this.setState({
            isOpened: false
        }, this.blur);
    };
    DateRangePicker.prototype.handleClick = function () {
        this.state.isOpened ? this.close() : this.open();
    };
    DateRangePicker.prototype.handlePopOverClick = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    DateRangePicker.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleClick();
            e.preventDefault();
        }
    };
    DateRangePicker.prototype.confirm = function () {
        if (!this.state.startDate || !this.state.endDate) {
            return;
        }
        else if (this.state.startDate.isAfter(this.state.endDate)) {
            return;
        }
        this.props.onChange(DateRangePicker.formatValue({
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }, this.props.format, this.props.joinValues, this.props.delimiter, this.props.utc));
        this.close();
    };
    DateRangePicker.prototype.filterDate = function (date, originValue, timeFormat, type) {
        if (type === void 0) { type = 'start'; }
        var value = date.clone();
        // 没有初始值
        if (!originValue) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('day');
        }
        else if (typeof timeFormat === 'string' && /ss/.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('second');
        }
        else if (typeof timeFormat === 'string' && /mm/.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('minute');
        }
        else if (typeof timeFormat === 'string' && /HH/i.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('hour');
        }
        else if (typeof timeFormat === 'string' && /Q/i.test(timeFormat)) {
            value = value[type === 'start' ? 'startOf' : 'endOf']('quarter');
        }
        else {
            value = value[type === 'start' ? 'startOf' : 'endOf']('day');
        }
        return value;
    };
    DateRangePicker.prototype.handleStartChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, timeFormat = _a.timeFormat, minDuration = _a.minDuration, maxDuration = _a.maxDuration, minDate = _a.minDate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate;
        if (startDate &&
            !endDate &&
            newValue.isSameOrAfter(startDate) &&
            (!minDuration || newValue.isAfter(startDate.clone().add(minDuration))) &&
            (!maxDuration || newValue.isBefore(startDate.clone().add(maxDuration)))) {
            return this.setState({
                endDate: this.filterDate(newValue, endDate, timeFormat, 'end')
            }, function () {
                embed && _this.confirm();
            });
        }
        if (minDate && newValue && newValue.isBefore(minDate, 'second')) {
            newValue = minDate;
        }
        this.setState({
            startDate: this.filterDate(newValue, startDate || minDate, timeFormat, 'start')
        }, function () {
            embed && _this.confirm();
        });
    };
    DateRangePicker.prototype.handleEndChange = function (newValue) {
        var _this = this;
        var _a = this.props, embed = _a.embed, timeFormat = _a.timeFormat, minDuration = _a.minDuration, maxDuration = _a.maxDuration, maxDate = _a.maxDate;
        var _b = this.state, startDate = _b.startDate, endDate = _b.endDate;
        if (endDate &&
            !startDate &&
            newValue.isSameOrBefore(endDate) &&
            (!minDuration ||
                newValue.isBefore(endDate.clone().subtract(minDuration))) &&
            (!maxDuration || newValue.isAfter(endDate.clone().subtract(maxDuration)))) {
            return this.setState({
                startDate: this.filterDate(newValue, startDate, timeFormat, 'start')
            }, function () {
                embed && _this.confirm();
            });
        }
        if (maxDate && newValue && newValue.isAfter(maxDate, 'second')) {
            newValue = maxDate;
        }
        this.setState({
            endDate: this.filterDate(newValue, endDate || maxDate, timeFormat, 'end')
        }, function () {
            embed && _this.confirm();
        });
    };
    DateRangePicker.prototype.selectRannge = function (range) {
        var _a = this.props, closeOnSelect = _a.closeOnSelect, minDate = _a.minDate, maxDate = _a.maxDate;
        var now = (0, moment_1.default)();
        this.setState({
            startDate: minDate && minDate.isValid()
                ? moment_1.default.max(range.startDate(now.clone()), minDate)
                : range.startDate(now.clone()),
            endDate: maxDate && maxDate.isValid()
                ? moment_1.default.min(maxDate, range.endDate(now.clone()))
                : range.endDate(now.clone())
        }, closeOnSelect ? this.confirm : helper_1.noop);
    };
    DateRangePicker.prototype.renderRanges = function (ranges) {
        var _this = this;
        if (!ranges) {
            return null;
        }
        var ns = this.props.classPrefix;
        var rangeArr;
        if (typeof ranges === 'string') {
            rangeArr = ranges.split(',');
        }
        else {
            rangeArr = ranges;
        }
        var __ = this.props.translate;
        return (react_1.default.createElement("ul", { className: ns + "DateRangePicker-rangers" }, rangeArr.map(function (item) {
            if (!item) {
                return null;
            }
            var range = {};
            if (typeof item === 'string') {
                range = exports.availableRanges[item];
                range.key = item;
            }
            else if (item.startDate &&
                item.endDate) {
                range = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { startDate: function () { return item.startDate; }, endDate: function () { return item.endDate; } });
            }
            return (react_1.default.createElement("li", { className: ns + "DateRangePicker-ranger", onClick: function () { return _this.selectRannge(range); }, key: range.key || range.label },
                react_1.default.createElement("a", null, __(range.label))));
        })));
    };
    DateRangePicker.prototype.clearValue = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        onChange(resetValue);
    };
    DateRangePicker.prototype.checkStartIsValidDate = function (currentDate) {
        var _a = this.state, endDate = _a.endDate, startDate = _a.startDate;
        var _b = this.props, minDate = _b.minDate, maxDate = _b.maxDate, minDuration = _b.minDuration, maxDuration = _b.maxDuration, viewMode = _b.viewMode;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        maxDate =
            maxDate && endDate
                ? maxDate.isBefore(endDate)
                    ? maxDate
                    : endDate
                : maxDate || endDate;
        if (minDate && currentDate.isBefore(minDate, precision)) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, precision)) {
            return false;
        }
        else if (
        // 如果配置了 minDuration 那么 EndDate - minDuration 之后的天数也不能选
        endDate &&
            minDuration &&
            currentDate.isAfter(endDate.clone().subtract(minDuration))) {
            return false;
        }
        else if (endDate &&
            maxDuration &&
            currentDate.isBefore(endDate.clone().subtract(maxDuration))) {
            return false;
        }
        return true;
    };
    DateRangePicker.prototype.checkEndIsValidDate = function (currentDate) {
        var startDate = this.state.startDate;
        var _a = this.props, minDate = _a.minDate, maxDate = _a.maxDate, minDuration = _a.minDuration, maxDuration = _a.maxDuration, viewMode = _a.viewMode;
        var precision = viewMode === 'time' ? 'hours' : viewMode || 'day';
        minDate =
            minDate && startDate
                ? minDate.isAfter(startDate)
                    ? minDate
                    : startDate
                : minDate || startDate;
        if (minDate && currentDate.isBefore(minDate, precision)) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, precision)) {
            return false;
        }
        else if (startDate &&
            minDuration &&
            currentDate.isBefore(startDate.clone().add(minDuration))) {
            return false;
        }
        else if (startDate &&
            maxDuration &&
            currentDate.isAfter(startDate.clone().add(maxDuration))) {
            return false;
        }
        return true;
    };
    DateRangePicker.prototype.renderDay = function (props, currentDate) {
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'day', '[]')) {
            props.className += ' rdtBetween';
        }
        return react_1.default.createElement("td", (0, tslib_1.__assign)({}, props), currentDate.date());
    };
    DateRangePicker.prototype.renderQuarter = function (props, quarter, year) {
        var currentDate = (0, moment_1.default)().year(year).quarter(quarter);
        var _a = this.state, startDate = _a.startDate, endDate = _a.endDate;
        if (startDate &&
            endDate &&
            currentDate.isBetween(startDate, endDate, 'quarter', '[]')) {
            props.className += ' rdtBetween';
        }
        return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
            react_1.default.createElement("span", null,
                "Q",
                quarter)));
    };
    DateRangePicker.prototype.renderCalendar = function () {
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, dateFormat = _a.dateFormat, timeFormat = _a.timeFormat, inputFormat = _a.inputFormat, ranges = _a.ranges, locale = _a.locale, embed = _a.embed, _b = _a.viewMode, viewMode = _b === void 0 ? 'days' : _b;
        var __ = this.props.translate;
        var _c = this.state, startDate = _c.startDate, endDate = _c.endDate;
        return (react_1.default.createElement("div", { className: ns + "DateRangePicker-wrap" },
            this.renderRanges(ranges),
            react_1.default.createElement(Calendar_1.default, { className: ns + "DateRangePicker-start", value: startDate, onChange: this.handleStartChange, requiredConfirm: false, dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: timeFormat, isValidDate: this.checkStartIsValidDate, viewMode: viewMode, input: false, onClose: this.close, renderDay: this.renderDay, renderQuarter: this.renderQuarter, locale: locale }),
            react_1.default.createElement(Calendar_1.default, { className: ns + "DateRangePicker-end", value: endDate, onChange: this.handleEndChange, requiredConfirm: false, dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: timeFormat, viewDate: this.nextMonth, isEndDate: true, isValidDate: this.checkEndIsValidDate, viewMode: viewMode, input: false, onClose: this.close, renderDay: this.renderDay, renderQuarter: this.renderQuarter, locale: locale }),
            embed ? null : (react_1.default.createElement("div", { key: "button", className: ns + "DateRangePicker-actions" },
                react_1.default.createElement("a", { className: cx('Button', 'Button--default'), onClick: this.close }, __('cancel')),
                react_1.default.createElement("a", { className: cx('Button', 'Button--primary', 'm-l-sm', {
                        'is-disabled': !this.state.startDate || !this.state.endDate
                    }), onClick: this.confirm }, __('confirm'))))));
    };
    DateRangePicker.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, className = _b.className, popoverClassName = _b.popoverClassName, ns = _b.classPrefix, value = _b.value, placeholder = _b.placeholder, popOverContainer = _b.popOverContainer, inputFormat = _b.inputFormat, format = _b.format, joinValues = _b.joinValues, delimiter = _b.delimiter, clearable = _b.clearable, disabled = _b.disabled, embed = _b.embed, overlayPlacement = _b.overlayPlacement, borderMode = _b.borderMode;
        var _c = this.state, isOpened = _c.isOpened, isFocused = _c.isFocused;
        var selectedDate = DateRangePicker.unFormatValue(value, format, joinValues, delimiter);
        var startViewValue = selectedDate.startDate
            ? selectedDate.startDate.format(inputFormat)
            : '';
        var endViewValue = selectedDate.endDate
            ? selectedDate.endDate.format(inputFormat)
            : '';
        var arr = [];
        startViewValue && arr.push(startViewValue);
        endViewValue && arr.push(endViewValue);
        var __ = this.props.translate;
        if (embed) {
            return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "DateRangeCalendar", {
                    'is-disabled': disabled
                }, className) }, this.renderCalendar()));
        }
        return (react_1.default.createElement("div", { tabIndex: 0, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, className: (0, classnames_1.default)(ns + "DateRangePicker", (_a = {
                    'is-disabled': disabled,
                    'is-focused': isFocused
                },
                _a[ns + "DateRangePicker--border" + (0, helper_1.ucFirst)(borderMode)] = borderMode,
                _a), className), ref: this.dom, onClick: this.handleClick },
            arr.length ? (react_1.default.createElement("span", { className: ns + "DateRangePicker-value" }, arr.join(__('DateRange.valueConcat')))) : (react_1.default.createElement("span", { className: ns + "DateRangePicker-placeholder" }, __(placeholder))),
            clearable && !disabled && value ? (react_1.default.createElement("a", { className: ns + "DateRangePicker-clear", onClick: this.clearValue },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
            react_1.default.createElement("a", { className: ns + "DateRangePicker-toggler" },
                react_1.default.createElement(icons_1.Icon, { icon: "calendar", className: "icon" })),
            isOpened ? (react_1.default.createElement(Overlay_1.default, { target: function () { return _this.dom.current; }, onHide: this.close, container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), rootClose: false, placement: overlayPlacement, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: (0, classnames_1.default)(ns + "DateRangePicker-popover", popoverClassName), onHide: this.close, onClick: this.handlePopOverClick, overlay: true }, this.renderCalendar()))) : null));
    };
    DateRangePicker.defaultProps = {
        placeholder: 'DateRange.placeholder',
        format: 'X',
        inputFormat: 'YYYY-MM-DD',
        joinValues: true,
        clearable: true,
        delimiter: ',',
        ranges: 'yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter',
        resetValue: '',
        closeOnSelect: true,
        overlayPlacement: 'auto'
    };
    return DateRangePicker;
}(react_1.default.Component));
exports.DateRangePicker = DateRangePicker;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(DateRangePicker));
//# sourceMappingURL=./components/DateRangePicker.js.map
