"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressFieldRenderer = exports.ProgressField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var ProgressField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ProgressField, _super);
    function ProgressField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressField.prototype.autoClassName = function (value) {
        var map = this.props.map;
        var index = Math.floor((value * map.length) / 100);
        index = Math.max(0, Math.min(map.length - 1, index));
        return map[index];
    };
    ProgressField.prototype.render = function () {
        var _a = this.props, className = _a.className, placeholder = _a.placeholder, progressClassName = _a.progressClassName, progressBarClassName = _a.progressBarClassName, map = _a.map, stripe = _a.stripe, animate = _a.animate, showLabel = _a.showLabel, cx = _a.classnames;
        var value = (0, helper_1.getPropValue)(this.props);
        var viewValue = (react_1.default.createElement("span", { className: "text-muted" }, placeholder));
        if (/^\d*\.?\d+$/.test(value)) {
            value = parseFloat(value);
        }
        if (typeof value === 'number') {
            viewValue = [
                react_1.default.createElement("div", { key: "progress", className: cx('Progress', progressClassName) },
                    react_1.default.createElement("div", { className: cx('Progress-bar', progressBarClassName || this.autoClassName(value), { 'Progress-bar--stripe': stripe }, { 'Progress-bar--animate': animate }), title: value + "%", style: {
                            width: value + "%"
                        } })),
                showLabel ? react_1.default.createElement("div", { key: "value" },
                    value,
                    "%") : null
            ];
        }
        return react_1.default.createElement("span", { className: cx('ProgressField', className) }, viewValue);
    };
    ProgressField.defaultProps = {
        placeholder: '-',
        progressClassName: '',
        progressBarClassName: '',
        map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
        showLabel: true,
        stripe: false,
        animate: false
    };
    return ProgressField;
}(react_1.default.Component));
exports.ProgressField = ProgressField;
var ProgressFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ProgressFieldRenderer, _super);
    function ProgressFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'progress'
        })
    ], ProgressFieldRenderer);
    return ProgressFieldRenderer;
}(ProgressField));
exports.ProgressFieldRenderer = ProgressFieldRenderer;
//# sourceMappingURL=./renderers/Progress.js.map
