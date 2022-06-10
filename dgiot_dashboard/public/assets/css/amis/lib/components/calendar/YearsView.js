"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomYearsView = void 0;
var tslib_1 = require("tslib");
// @ts-ignore
var YearsView_1 = (0, tslib_1.__importDefault)(require("react-datetime/src/YearsView"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var CustomYearsView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CustomYearsView, _super);
    function CustomYearsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderYear = function (props, year) {
            return (react_1.default.createElement("td", (0, tslib_1.__assign)({}, props),
                react_1.default.createElement("span", null, year)));
        };
        return _this;
    }
    CustomYearsView.prototype.render = function () {
        var year = this.props.viewDate.year();
        year = year - (year % 10);
        var __ = this.props.translate;
        return (react_1.default.createElement("div", { className: "rdtYears" },
            react_1.default.createElement("table", null,
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: "rdtPrev", onClick: this.props.subtractTime(10, 'years') }, "\u00AB"),
                        react_1.default.createElement("th", { className: "rdtSwitch" }, __('year-to-year', { from: year, to: year + 9 })),
                        react_1.default.createElement("th", { className: "rdtNext", onClick: this.props.addTime(10, 'years') }, "\u00BB")))),
            react_1.default.createElement("table", null,
                react_1.default.createElement("tbody", null, this.renderYears(year)))));
    };
    return CustomYearsView;
}(YearsView_1.default));
exports.CustomYearsView = CustomYearsView;
exports.default = (0, locale_1.localeable)(CustomYearsView);
//# sourceMappingURL=./components/calendar/YearsView.js.map
