"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorControlRenderer = exports.ColorPicker = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
exports.ColorPicker = react_1.default.lazy(function () { return Promise.resolve().then(function () { return new Promise(function(resolve){require(['../../components/ColorPicker'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }); });
var ColorControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColorControl, _super);
    function ColorControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            open: false
        };
        return _this;
    }
    ColorControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, value = _a.value, rest = (0, tslib_1.__rest)(_a, ["className", "classPrefix", "value"]);
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "ColorControl", className) },
            react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement("div", null, "...") },
                react_1.default.createElement(exports.ColorPicker, (0, tslib_1.__assign)({ classPrefix: ns }, rest, { value: value || '' })))));
    };
    ColorControl.defaultProps = {
        format: 'hex',
        clearable: true
    };
    return ColorControl;
}(react_1.default.PureComponent));
exports.default = ColorControl;
var ColorControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColorControlRenderer, _super);
    function ColorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-color'
        })
    ], ColorControlRenderer);
    return ColorControlRenderer;
}(ColorControl));
exports.ColorControlRenderer = ColorControlRenderer;
//# sourceMappingURL=./renderers/Form/InputColor.js.map
