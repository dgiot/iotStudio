"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDaysView = void 0;
var tslib_1 = require("tslib");
// @ts-ignore
var DaysView_1 = (0, tslib_1.__importDefault)(require("react-datetime/src/DaysView"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var locale_1 = require("../../locale");
var CustomDaysView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomDaysView, _super);
    function CustomDaysView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.updateSelectedDate = function (event) {
            // need confirm
            if (_this.props.requiredConfirm) {
                var viewDate = _this.props.viewDate.clone();
                var currentDate = _this.props.selectedDate || viewDate;
                var target = event.target;
                var modifier = 0;
                if (~target.className.indexOf('rdtNew')) {
                    modifier = 1;
                }
                if (~target.className.indexOf('rdtOld')) {
                    modifier = -1;
                }
                viewDate
                    .month(viewDate.month() + modifier)
                    .date(parseInt(target.getAttribute('data-value'), 10))
                    .hours(currentDate.hours())
                    .minutes(currentDate.minutes())
                    .seconds(currentDate.seconds())
                    .milliseconds(currentDate.milliseconds());
                _this.props.setDateTimeState({
                    viewDate: viewDate,
                    selectedDate: viewDate.clone()
                });
                return;
            }
            _this.props.updateSelectedDate(event, true);
        };
        _this.setTime = function (type, value) {
            var date = (_this.props.selectedDate || _this.props.viewDate).clone();
            date[type](value);
            _this.props.setDateTimeState({
                viewDate: date.clone(),
                selectedDate: date.clone()
            });
            if (!_this.props.requiredConfirm) {
                _this.props.onChange(date);
            }
        };
        _this.confirm = function () {
            var _a, _b;
            var date = (_this.props.selectedDate || _this.props.viewDate).clone();
            // 如果 minDate 是可用的，且比当前日期晚，则用 minDate
            if (((_a = _this.props.minDate) === null || _a === void 0 ? void 0 : _a.isValid()) && ((_b = _this.props.minDate) === null || _b === void 0 ? void 0 : _b.isAfter(date))) {
                date = _this.props.minDate.clone();
            }
            _this.props.setDateTimeState({
                selectedDate: date
            });
            _this.props.onChange(date);
            _this.props.onClose && _this.props.onClose();
        };
        _this.cancel = function () {
            _this.props.onClose && _this.props.onClose();
        };
        _this.renderDay = function (props, currentDate) {
            return react_1.default.createElement("td", (0, tslib_1.__assign)({}, props), currentDate.date());
        };
        _this.renderTimes = function () {
            var _a = _this.props, timeFormat = _a.timeFormat, selectedDate = _a.selectedDate, viewDate = _a.viewDate, isEndDate = _a.isEndDate, cx = _a.classnames;
            var date = selectedDate || (isEndDate ? viewDate.endOf('day') : viewDate);
            var inputs = [];
            timeFormat.split(':').forEach(function (format, i) {
                var type = /h/i.test(format)
                    ? 'hours'
                    : /m/.test(format)
                        ? 'minutes'
                        : /s/.test(format)
                            ? 'seconds'
                            : '';
                if (type) {
                    var min_1 = 0;
                    var max_1 = type === 'hours' ? 23 : 59;
                    var hours = _this.computedTimeOptions(24);
                    var times = _this.computedTimeOptions(60);
                    var options_1 = type === 'hours' ? hours : times;
                    var formatMap_1 = {
                        hours: 'HH',
                        minutes: 'mm',
                        seconds: 'ss'
                    };
                    inputs.push(react_1.default.createElement(downshift_1.default, { key: i + 'input', inputValue: date.format(formatMap_1[type]) }, function (_a) {
                        var isOpen = _a.isOpen, getInputProps = _a.getInputProps, openMenu = _a.openMenu, closeMenu = _a.closeMenu;
                        var inputProps = getInputProps({
                            onFocus: function () { return openMenu(); },
                            onChange: function (e) {
                                return _this.setTime(type, Math.max(min_1, Math.min(parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) || 0, max_1)));
                            }
                        });
                        return (react_1.default.createElement("div", { className: cx('CalendarInputWrapper') },
                            react_1.default.createElement("input", (0, tslib_1.__assign)({ type: "text", value: date.format(formatMap_1[type]), className: cx('CalendarInput'), min: min_1, max: max_1 }, inputProps)),
                            isOpen ? (react_1.default.createElement("div", { className: cx('CalendarInput-sugs') }, options_1.map(function (option) {
                                return (react_1.default.createElement("div", { key: option.value, className: cx('CalendarInput-sugsItem', {
                                        'is-highlight': option.value === date.format(formatMap_1[type])
                                    }), onClick: function () {
                                        _this.setTime(type, parseInt(option.value, 10));
                                        closeMenu();
                                    } }, option.value));
                            }))) : null));
                    }));
                    inputs.push(react_1.default.createElement("span", { key: i + 'divider' }, ":"));
                }
            });
            inputs.length && inputs.pop();
            return react_1.default.createElement("div", null, inputs);
        };
        _this.renderFooter = function () {
            if (!_this.props.timeFormat && !_this.props.requiredConfirm) {
                return null;
            }
            var _a = _this.props, __ = _a.translate, cx = _a.classnames;
            return (react_1.default.createElement("tfoot", { key: "tf" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 7 },
                        _this.props.timeFormat ? _this.renderTimes() : null,
                        _this.props.requiredConfirm ? (react_1.default.createElement("div", { key: "button", className: "rdtActions" },
                            react_1.default.createElement("a", { className: cx('Button', 'Button--default'), onClick: _this.cancel }, __('cancel')),
                            react_1.default.createElement("a", { className: cx('Button', 'Button--primary', 'm-l-sm'), onClick: _this.confirm }, __('confirm')))) : null))));
        };
        return _this;
    }
    CustomDaysView.prototype.computedTimeOptions = function (total) {
        var times = [];
        for (var t = 0; t < total; t++) {
            var label = t < 10 ? "0" + t : "" + t;
            times.push({ label: label, value: label });
        }
        return times;
    };
    CustomDaysView.prototype.render = function () {
        var footer = this.renderFooter();
        var date = this.props.viewDate;
        var locale = date.localeData();
        var __ = this.props.translate;
        var tableChildren = [
            react_1.default.createElement("thead", { key: "th" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { colSpan: 7 },
                        react_1.default.createElement("div", { className: "rdtHeader" },
                            react_1.default.createElement("a", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'years') }, "\u00AB"),
                            react_1.default.createElement("a", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'months') }, "\u2039"),
                            react_1.default.createElement("div", { className: "rdtCenter" },
                                react_1.default.createElement("a", { className: "rdtSwitch", onClick: this.props.showView('years') }, date.format(__('dateformat.year'))),
                                react_1.default.createElement("a", { className: "rdtSwitch", onClick: this.props.showView('months') }, date.format(__('MMM')))),
                            react_1.default.createElement("a", { className: "rdtNext", onClick: this.props.addTime(1, 'months') }, "\u203A"),
                            react_1.default.createElement("a", { className: "rdtNext", onClick: this.props.addTime(1, 'years') }, "\u00BB")))),
                react_1.default.createElement("tr", null, this.getDaysOfWeek(locale).map(function (day, index) { return (react_1.default.createElement("th", { key: day + index, className: "dow" }, day)); }))),
            react_1.default.createElement("tbody", { key: "tb" }, this.renderDays())
        ];
        footer && tableChildren.push(footer);
        return (react_1.default.createElement("div", { className: "rdtDays" },
            react_1.default.createElement("table", null, tableChildren)));
    };
    return CustomDaysView;
}(DaysView_1.default));
exports.CustomDaysView = CustomDaysView;
exports.default = (0, locale_1.localeable)(CustomDaysView);
//# sourceMappingURL=./components/calendar/DaysView.js.map
