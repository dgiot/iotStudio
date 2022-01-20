"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file 基于 react-datetime 改造。
 */
var react_datetime_1 = (0, tslib_1.__importDefault)(require("react-datetime"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var CalendarContainer_1 = (0, tslib_1.__importDefault)(require("./CalendarContainer"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var theme_1 = require("../../theme");
var BaseDatePicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseDatePicker, _super);
    function BaseDatePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.getUpdateOn = function (formats) {
            if (formats.date.match(/[lLD]/)) {
                return 'days';
            }
            else if (formats.date.indexOf('M') !== -1) {
                return 'months';
            }
            else if (formats.date.indexOf('Q') !== -1) {
                return 'quarters';
            }
            else if (formats.date.indexOf('Y') !== -1) {
                return 'years';
            }
            return 'days';
        };
        _this.getComponentProps = (function (origin) {
            return function () {
                var props = origin.call(_this);
                props.setDateTimeState = _this.setState.bind(_this);
                [
                    'inputFormat',
                    'onChange',
                    'onClose',
                    'requiredConfirm',
                    'classPrefix',
                    'prevIcon',
                    'nextIcon',
                    'isEndDate',
                    'classnames',
                    'minDate'
                ].forEach(function (key) { return (props[key] = _this.props[key]); });
                return props;
            };
        })(_this.getComponentProps);
        _this.setDate = function (type) {
            // todo 没看懂这个是啥意思，好像没啥用
            var currentShould = _this.props.viewMode === 'months' &&
                !/^mm$/i.test(_this.props.inputFormat || '');
            var nextViews = {
                month: currentShould ? 'months' : 'days',
                year: currentShould ? 'months' : 'days',
                quarters: ''
            };
            if (_this.props.viewMode === 'quarters') {
                nextViews.year = 'quarters';
            }
            return function (e) {
                var _a, _b;
                _this.setState({
                    viewDate: _this.state.viewDate
                        .clone()[type](parseInt(e.target.closest('td').getAttribute('data-value'), 10))
                        .startOf(type),
                    currentView: nextViews[type]
                });
                (_b = (_a = _this.props).onViewModeChange) === null || _b === void 0 ? void 0 : _b.call(_a, nextViews[type]);
            };
        };
        _this.updateSelectedDate = function (e, close) {
            var that = _this;
            var target = e.currentTarget, modifier = 0, viewDate = _this.state.viewDate, currentDate = _this.state.selectedDate || viewDate, date;
            if (target.className.indexOf('rdtDay') !== -1) {
                if (target.className.indexOf('rdtNew') !== -1)
                    modifier = 1;
                else if (target.className.indexOf('rdtOld') !== -1)
                    modifier = -1;
                date = viewDate
                    .clone()
                    .month(viewDate.month() + modifier)
                    .date(parseInt(target.getAttribute('data-value'), 10));
            }
            else if (target.className.indexOf('rdtMonth') !== -1) {
                date = viewDate
                    .clone()
                    .month(parseInt(target.getAttribute('data-value'), 10))
                    .date(currentDate.date());
            }
            else if (target.className.indexOf('rdtQuarter') !== -1) {
                date = viewDate
                    .clone()
                    .quarter(parseInt(target.getAttribute('data-value'), 10))
                    .startOf('quarter')
                    .date(currentDate.date());
            }
            else if (target.className.indexOf('rdtYear') !== -1) {
                date = viewDate
                    .clone()
                    .month(currentDate.month())
                    .date(currentDate.date())
                    .year(parseInt(target.getAttribute('data-value'), 10));
            }
            date
                .hours(currentDate.hours())
                .minutes(currentDate.minutes())
                .seconds(currentDate.seconds())
                .milliseconds(currentDate.milliseconds());
            if (!_this.props.value) {
                var open = !(_this.props.closeOnSelect && close);
                if (!open) {
                    that.props.onBlur(date);
                }
                _this.setState({
                    selectedDate: date,
                    viewDate: date.clone().startOf('month'),
                    inputValue: date.format(_this.state.inputFormat),
                    open: open
                });
            }
            else {
                if (_this.props.closeOnSelect && close) {
                    that.closeCalendar();
                }
            }
            that.props.onChange(date);
        };
        var state = _this.getStateFromProps(_this.props);
        if (state.open === undefined) {
            state.open = !_this.props.input;
        }
        state.currentView = _this.props.dateFormat
            ? _this.props.viewMode || state.updateOn || 'days'
            : 'time';
        _this.state = state;
        return _this;
    }
    BaseDatePicker.prototype.render = function () {
        var _a;
        var Component = CalendarContainer_1.default;
        var viewProps = this.getComponentProps();
        if (this.props.viewMode === 'quarters') {
            _a = [
                'quarters',
                this.props.renderQuarter
            ], viewProps.updateOn = _a[0], viewProps.renderQuarter = _a[1];
        }
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)('rdt rdtStatic rdtOpen', this.props.className) },
            react_1.default.createElement("div", { key: "dt", className: "rdtPicker" },
                react_1.default.createElement(Component, { view: this.state.currentView, viewProps: viewProps }))));
    };
    BaseDatePicker.propTypes = {};
    return BaseDatePicker;
}(react_datetime_1.default));
var Calendar = (0, theme_1.themeable)(BaseDatePicker);
exports.default = Calendar;
//# sourceMappingURL=./components/calendar/Calendar.js.map
