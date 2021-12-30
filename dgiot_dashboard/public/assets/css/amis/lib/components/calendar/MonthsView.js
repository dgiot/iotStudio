"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMonthsView = void 0;
var tslib_1 = require("tslib");
// @ts-ignore
var MonthsView_1 = (0, tslib_1.__importDefault)(require("react-datetime/src/MonthsView"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var CustomMonthsView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomMonthsView, _super);
    function CustomMonthsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderMonth = function (props, month) {
            var localMoment = _this.props.viewDate;
            var monthStr = localMoment
                .localeData()
                .monthsShort(localMoment.month(month));
            var strLength = 3;
            // Because some months are up to 5 characters long, we want to
            // use a fixed string length for consistency
            var monthStrFixedLength = monthStr.substring(0, strLength);
            return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                react_1.default.createElement("span", null, monthStrFixedLength)));
        };
        return _this;
    }
    CustomMonthsView.prototype.render = function () {
        var __ = this.props.translate;
        var showYearHead = !/^mm$/i.test(this.props.inputFormat || '');
        var canClick = /yy/i.test(this.props.inputFormat || '');
        return (react_1.default.createElement("div", { className: "rdtMonths" },
            showYearHead && (react_1.default.createElement("table", null,
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: "rdtPrev", onClick: this.props.subtractTime(1, 'years') }, "\u00AB"),
                        canClick ? (react_1.default.createElement("th", { className: "rdtSwitch", onClick: this.props.showView('years') }, this.props.viewDate.format(__('dateformat.year')))) : (react_1.default.createElement("th", { className: "rdtSwitch" }, this.props.viewDate.format(__('dateformat.year')))),
                        react_1.default.createElement("th", { className: "rdtNext", onClick: this.props.addTime(1, 'years') }, "\u00BB"))))),
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, this.renderMonths()))));
    };
    return CustomMonthsView;
}(MonthsView_1.default));
exports.CustomMonthsView = CustomMonthsView;
exports.default = (0, locale_1.localeable)(CustomMonthsView);
//# sourceMappingURL=./components/calendar/MonthsView.js.map
