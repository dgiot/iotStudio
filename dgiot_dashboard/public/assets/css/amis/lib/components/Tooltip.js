"use strict";
/**
 * @file Tooltip
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Tooltip = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, ns = _a.classPrefix, className = _a.className, title = _a.title, children = _a.children, arrowProps = _a.arrowProps, style = _a.style, placement = _a.placement, arrowOffsetLeft = _a.arrowOffsetLeft, arrowOffsetTop = _a.arrowOffsetTop, positionLeft = _a.positionLeft, positionTop = _a.positionTop, cx = _a.classnames, activePlacement = _a.activePlacement, rest = (0, tslib_1.__rest)(_a, ["classPrefix", "className", "title", "children", "arrowProps", "style", "placement", "arrowOffsetLeft", "arrowOffsetTop", "positionLeft", "positionTop", "classnames", "activePlacement"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx("Tooltip", activePlacement ? "Tooltip--" + activePlacement : '', className), style: style, role: "tooltip" }),
            react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx("Tooltip-arrow") }, arrowProps)),
            title ? react_1.default.createElement("div", { className: cx('Tooltip-title') }, title) : null,
            react_1.default.createElement("div", { className: cx('Tooltip-body') }, children)));
    };
    Tooltip.defaultProps = {
        className: ''
    };
    return Tooltip;
}(react_1.default.Component));
exports.Tooltip = Tooltip;
exports.default = (0, theme_1.themeable)(Tooltip);
//# sourceMappingURL=./components/Tooltip.js.map
