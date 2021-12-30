"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TplRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../factory");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Alert2_1 = (0, tslib_1.__importDefault)(require("../components/Alert2"));
var TplRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TplRenderer, _super);
    function TplRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TplRenderer.prototype.render = function () {
        var _a = this.props, render = _a.render, body = _a.body, rest = (0, tslib_1.__rest)(_a, ["render", "body"]);
        return react_1.default.createElement(Alert2_1.default, (0, tslib_1.__assign)({}, rest), render('body', body));
    };
    TplRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'alert'
        })
    ], TplRenderer);
    return TplRenderer;
}(react_1.default.Component));
exports.TplRenderer = TplRenderer;
//# sourceMappingURL=./renderers/Alert.js.map
