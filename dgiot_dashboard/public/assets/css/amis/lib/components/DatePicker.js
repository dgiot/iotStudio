"use strict";
/**
 * @file DatePicker
 * @description 时间选择器组件
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var moment_1 = (0, tslib_1.__importDefault)(require("moment"));
require("moment/locale/zh-cn");
var icons_1 = require("./icons");
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var theme_1 = require("../theme");
var Calendar_1 = (0, tslib_1.__importDefault)(require("./calendar/Calendar"));
require("react-datetime/css/react-datetime.css");
var locale_1 = require("../locale");
var helper_1 = require("../utils/helper");
var availableShortcuts = {
    now: {
        label: 'Date.now',
        date: function (now) {
            return now;
        }
    },
    today: {
        label: 'Date.today',
        date: function (now) {
            return now.startOf('day');
        }
    },
    yesterday: {
        label: 'Date.yesterday',
        date: function (now) {
            return now.add(-1, 'days').startOf('day');
        }
    },
    thisweek: {
        label: 'Date.monday',
        date: function (now) {
            return now.startOf('week').startOf('day');
        }
    },
    thismonth: {
        label: 'Date.startOfMonth',
        date: function (now) {
            return now.startOf('month');
        }
    },
    prevmonth: {
        label: 'Date.startOfLastMonth',
        date: function (now) {
            return now.startOf('month').add(-1, 'month');
        }
    },
    prevquarter: {
        label: 'Date.startOfLastQuarter',
        date: function (now) {
            return now.startOf('quarter').add(-1, 'quarter');
        }
    },
    thisquarter: {
        label: 'Date.startOfQuarter',
        date: function (now) {
            return now.startOf('quarter');
        }
    },
    tomorrow: {
        label: 'Date.tomorrow',
        date: function (now) {
            return now.add(1, 'days').startOf('day');
        }
    },
    endofthisweek: {
        label: 'Date.endOfWeek',
        date: function (now) {
            return now.endOf('week');
        }
    },
    endofthismonth: {
        label: 'Date.endOfMonth',
        date: function (now) {
            return now.endOf('month');
        }
    },
    endoflastmonth: {
        label: 'Date.endOfLastMonth',
        date: function (now) {
            return now.add(-1, 'month').endOf('month');
        }
    }
};
var advancedShortcuts = [
    {
        regexp: /^(\d+)hoursago$/,
        resolve: function (__, _, hours) {
            return {
                label: __('Date.hoursago', { hours: hours }),
                date: function (now) {
                    return now.subtract(hours, 'hours');
                }
            };
        }
    },
    {
        regexp: /^(\d+)hourslater$/,
        resolve: function (__, _, hours) {
            return {
                label: __('Date.hourslater', { hours: hours }),
                date: function (now) {
                    return now.add(hours, 'hours');
                }
            };
        }
    },
    {
        regexp: /^(\d+)daysago$/,
        resolve: function (__, _, days) {
            return {
                label: __('Date.daysago', { days: days }),
                date: function (now) {
                    return now.subtract(days, 'days');
                }
            };
        }
    },
    {
        regexp: /^(\d+)dayslater$/,
        resolve: function (__, _, days) {
            return {
                label: __('Date.dayslater', { days: days }),
                date: function (now) {
                    return now.add(days, 'days');
                }
            };
        }
    },
    {
        regexp: /^(\d+)weeksago$/,
        resolve: function (__, _, weeks) {
            return {
                label: __('Date.weeksago', { weeks: weeks }),
                date: function (now) {
                    return now.subtract(weeks, 'weeks');
                }
            };
        }
    },
    {
        regexp: /^(\d+)weekslater$/,
        resolve: function (__, _, weeks) {
            return {
                label: __('Date.weekslater', { weeks: weeks }),
                date: function (now) {
                    return now.add(weeks, 'weeks');
                }
            };
        }
    },
    {
        regexp: /^(\d+)monthsago$/,
        resolve: function (__, _, months) {
            return {
                label: __('Date.monthsago', { months: months }),
                date: function (now) {
                    return now.subtract(months, 'months');
                }
            };
        }
    },
    {
        regexp: /^(\d+)monthslater$/,
        resolve: function (__, _, months) {
            return {
                label: __('Date.monthslater', { months: months }),
                date: function (now) {
                    return now.add(months, 'months');
                }
            };
        }
    },
    {
        regexp: /^(\d+)quartersago$/,
        resolve: function (__, _, quarters) {
            return {
                label: __('Date.quartersago', { quarters: quarters }),
                date: function (now) {
                    return now.subtract(quarters, 'quarters');
                }
            };
        }
    },
    {
        regexp: /^(\d+)quarterslater$/,
        resolve: function (__, _, quarters) {
            return {
                label: __('Date.quarterslater', { quarters: quarters }),
                date: function (now) {
                    return now.add(quarters, 'quarters');
                }
            };
        }
    }
];
function normalizeValue(value, format) {
    if (!value || value === '0') {
        return undefined;
    }
    var v = (0, moment_1.default)(value, format, true);
    return v.isValid() ? v : undefined;
}
var DatePicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DatePicker, _super);
    function DatePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            isFocused: false,
            value: normalizeValue(_this.props.value, _this.props.format)
        };
        _this.domRef = function (ref) {
            _this.dom = ref;
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.selectRannge = _this.selectRannge.bind(_this);
        _this.checkIsValidDate = _this.checkIsValidDate.bind(_this);
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.getParent = _this.getParent.bind(_this);
        _this.getTarget = _this.getTarget.bind(_this);
        _this.handlePopOverClick = _this.handlePopOverClick.bind(_this);
        _this.renderShortCuts = _this.renderShortCuts.bind(_this);
        return _this;
    }
    DatePicker.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                value: normalizeValue(props.value, props.format)
            });
        }
    };
    DatePicker.prototype.focus = function () {
        if (!this.dom) {
            return;
        }
        this.dom.focus();
    };
    DatePicker.prototype.handleFocus = function () {
        this.setState({
            isFocused: true
        });
    };
    DatePicker.prototype.handleBlur = function () {
        this.setState({
            isFocused: false
        });
    };
    DatePicker.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleClick();
            e.preventDefault();
        }
    };
    DatePicker.prototype.handleClick = function () {
        this.state.isOpened ? this.close() : this.open();
    };
    DatePicker.prototype.handlePopOverClick = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    DatePicker.prototype.open = function (fn) {
        this.props.disabled ||
            this.setState({
                isOpened: true
            }, fn);
    };
    DatePicker.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    DatePicker.prototype.clearValue = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var onChange = this.props.onChange;
        onChange('');
    };
    DatePicker.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, format = _a.format, minDate = _a.minDate, maxDate = _a.maxDate, dateFormat = _a.dateFormat, timeFormat = _a.timeFormat, closeOnSelect = _a.closeOnSelect, utc = _a.utc, viewMode = _a.viewMode;
        if (!moment_1.default.isMoment(value)) {
            return;
        }
        if (minDate && value && value.isBefore(minDate, 'second')) {
            value = minDate;
        }
        else if (maxDate && value && value.isAfter(maxDate, 'second')) {
            value = maxDate;
        }
        onChange(utc ? moment_1.default.utc(value).format(format) : value.format(format));
        if (closeOnSelect && dateFormat && !timeFormat) {
            this.close();
        }
    };
    DatePicker.prototype.selectRannge = function (item) {
        var closeOnSelect = this.props.closeOnSelect;
        var now = (0, moment_1.default)();
        this.handleChange(item.date(now));
        closeOnSelect && this.close();
    };
    DatePicker.prototype.checkIsValidDate = function (currentDate) {
        var _a = this.props, minDate = _a.minDate, maxDate = _a.maxDate;
        if (minDate && currentDate.isBefore(minDate, 'day')) {
            return false;
        }
        else if (maxDate && currentDate.isAfter(maxDate, 'day')) {
            return false;
        }
        return true;
    };
    DatePicker.prototype.getTarget = function () {
        return this.dom;
    };
    DatePicker.prototype.getParent = function () {
        return this.dom;
    };
    DatePicker.prototype.getAvailableShortcuts = function (key) {
        if (availableShortcuts[key]) {
            return availableShortcuts[key];
        }
        var __ = this.props.translate;
        for (var i = 0, len = advancedShortcuts.length; i < len; i++) {
            var item = advancedShortcuts[i];
            var m = item.regexp.exec(key);
            if (m) {
                return item.resolve.apply(item, (0, tslib_1.__spreadArray)([__], m, true));
            }
        }
        return null;
    };
    DatePicker.prototype.renderShortCuts = function (shortcuts) {
        var _this = this;
        if (!shortcuts) {
            return null;
        }
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames;
        var shortcutArr;
        if (typeof shortcuts === 'string') {
            shortcutArr = shortcuts.split(',');
        }
        else {
            shortcutArr = shortcuts;
        }
        var __ = this.props.translate;
        return (react_1.default.createElement("ul", { className: cx("DatePicker-shortcuts") }, shortcutArr.map(function (item) {
            if (!item) {
                return null;
            }
            var shortcut = {};
            if (typeof item === 'string') {
                shortcut = _this.getAvailableShortcuts(item);
                shortcut.key = item;
            }
            else if (item.date) {
                shortcut = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { date: function () { return item.date; } });
            }
            return (react_1.default.createElement("li", { className: cx("DatePicker-shortcut"), onClick: function () { return _this.selectRannge(shortcut); }, key: shortcut.key || shortcut.label },
                react_1.default.createElement("a", null, __(shortcut.label))));
        })));
    };
    DatePicker.prototype.render = function () {
        var _a;
        var _b = this.props, ns = _b.classPrefix, cx = _b.classnames, className = _b.className, popoverClassName = _b.popoverClassName, value = _b.value, placeholder = _b.placeholder, disabled = _b.disabled, inputFormat = _b.inputFormat, dateFormat = _b.dateFormat, timeFormat = _b.timeFormat, viewMode = _b.viewMode, timeConstraints = _b.timeConstraints, popOverContainer = _b.popOverContainer, clearable = _b.clearable, shortcuts = _b.shortcuts, utc = _b.utc, overlayPlacement = _b.overlayPlacement, locale = _b.locale, format = _b.format, borderMode = _b.borderMode, embed = _b.embed, minDate = _b.minDate;
        var __ = this.props.translate;
        var isOpened = this.state.isOpened;
        var date = this.state.value;
        if (embed) {
            return (react_1.default.createElement("div", { className: cx("DateCalendar", {
                    'is-disabled': disabled
                }, className) },
                react_1.default.createElement(Calendar_1.default, { value: date, onChange: this.handleChange, requiredConfirm: false, dateFormat: dateFormat, timeFormat: timeFormat, isValidDate: this.checkIsValidDate, viewMode: viewMode, timeConstraints: timeConstraints, input: false, onClose: this.close, locale: locale, minDate: minDate })));
        }
        return (react_1.default.createElement("div", { tabIndex: 0, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, className: cx("DatePicker", (_a = {
                    'is-disabled': disabled,
                    'is-focused': this.state.isFocused
                },
                _a["DatePicker--border" + (0, helper_1.ucFirst)(borderMode)] = borderMode,
                _a), className), ref: this.domRef, onClick: this.handleClick },
            date ? (react_1.default.createElement("span", { className: cx("DatePicker-value") }, date.format(inputFormat))) : (react_1.default.createElement("span", { className: cx("DatePicker-placeholder") }, __(placeholder))),
            clearable && !disabled && normalizeValue(value, format) ? (react_1.default.createElement("a", { className: cx("DatePicker-clear"), onClick: this.clearValue },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
            react_1.default.createElement("a", { className: cx("DatePicker-toggler") },
                react_1.default.createElement(icons_1.Icon, { icon: "calendar", className: "icon" })),
            isOpened ? (react_1.default.createElement(Overlay_1.default, { target: this.getTarget, container: popOverContainer || this.getParent, rootClose: false, placement: overlayPlacement, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: cx("DatePicker-popover", popoverClassName), onHide: this.close, overlay: true, onClick: this.handlePopOverClick },
                    this.renderShortCuts(shortcuts),
                    react_1.default.createElement(Calendar_1.default, { value: date, onChange: this.handleChange, requiredConfirm: !!(dateFormat && timeFormat), dateFormat: dateFormat, inputFormat: inputFormat, timeFormat: timeFormat, isValidDate: this.checkIsValidDate, viewMode: viewMode, timeConstraints: timeConstraints, input: false, onClose: this.close, locale: locale, minDate: minDate })))) : null));
    };
    DatePicker.defaultProps = {
        viewMode: 'days',
        shortcuts: '',
        closeOnSelect: true,
        overlayPlacement: 'auto'
    };
    return DatePicker;
}(react_1.default.Component));
exports.DatePicker = DatePicker;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(DatePicker));
//# sourceMappingURL=./components/DatePicker.js.map
