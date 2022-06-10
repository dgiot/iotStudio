"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTimeView = void 0;
var tslib_1 = require("tslib");
// @ts-ignore
var TimeView_1 = (0, tslib_1.__importDefault)(require("react-datetime/src/TimeView"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var icons_1 = require("../icons");
var CustomTimeView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomTimeView, _super);
    function CustomTimeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padValues = {
            hours: 2,
            minutes: 2,
            seconds: 2,
            milliseconds: 3
        };
        _this.renderDayPart = function () {
            var _a = _this.props, __ = _a.translate, cx = _a.classnames;
            return (react_1.default.createElement("div", { key: "dayPart", className: cx('CalendarCounter CalendarCounter--daypart') },
                react_1.default.createElement("span", { key: "up", className: cx('CalendarCounter-btn CalendarCounter-btn--up'), onClick: _this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: _this.disableContextMenu },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" })),
                react_1.default.createElement("div", { className: cx('CalendarCounter-value'), key: _this.state.daypart }, __(_this.state.daypart)),
                react_1.default.createElement("span", { key: "down", className: cx('CalendarCounter-btn CalendarCounter-btn--down'), onClick: _this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: _this.disableContextMenu },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" }))));
        };
        _this.renderCounter = function (type) {
            var cx = _this.props.classnames;
            if (type !== 'daypart') {
                var value = _this.state[type];
                if (type === 'hours' &&
                    _this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                    value = ((value - 1) % 12) + 1;
                    if (value === 0) {
                        value = 12;
                    }
                }
                var _a = _this.timeConstraints[type], min_1 = _a.min, max_1 = _a.max, step = _a.step;
                return (react_1.default.createElement("div", { key: type, className: cx('CalendarCounter') },
                    react_1.default.createElement("span", { key: "up", className: cx('CalendarCounter-btn CalendarCounter-btn--up'), onMouseDown: _this.onStartClicking('increase', type), onContextMenu: _this.disableContextMenu },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" })),
                    react_1.default.createElement("div", { key: "c", className: cx('CalendarCounter-value') },
                        react_1.default.createElement("input", { type: "text", value: _this.pad(type, value), className: cx('CalendarInput'), min: min_1, max: max_1, step: step, onChange: function (e) {
                                return _this.props.setTime(type, Math.max(min_1, Math.min(parseInt(e.currentTarget.value.replace(/\D/g, ''), 10) ||
                                    0, max_1)));
                            } })),
                    react_1.default.createElement("span", { key: "do", className: cx('CalendarCounter-btn CalendarCounter-btn--down'), onMouseDown: _this.onStartClicking('decrease', type), onContextMenu: _this.disableContextMenu },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold" }))));
            }
            return null;
        };
        return _this;
    }
    CustomTimeView.prototype.render = function () {
        var _this = this;
        var counters = [];
        var cx = this.props.classnames;
        this.state.counters.forEach(function (c) {
            if (counters.length) {
                counters.push(react_1.default.createElement("div", { key: "sep" + counters.length, className: cx('CalendarCounter-sep') }, ":"));
            }
            counters.push(_this.renderCounter(c));
        });
        if (this.state.daypart !== false) {
            counters.push(this.renderDayPart());
        }
        if (this.state.counters.length === 3 &&
            this.props.timeFormat.indexOf('S') !== -1) {
            counters.push(react_1.default.createElement("div", { className: cx('CalendarCounter-sep'), key: "sep5" }, ":"));
            counters.push(react_1.default.createElement("div", { className: cx('CalendarCounter CalendarCounter--milli') },
                react_1.default.createElement("input", { value: this.state.milliseconds, type: "text", onChange: this.updateMilli })));
        }
        return react_1.default.createElement("div", { className: cx('CalendarTime') }, counters);
    };
    return CustomTimeView;
}(TimeView_1.default));
exports.CustomTimeView = CustomTimeView;
exports.default = (0, locale_1.localeable)(CustomTimeView);
//# sourceMappingURL=./components/calendar/TimeView.js.map
