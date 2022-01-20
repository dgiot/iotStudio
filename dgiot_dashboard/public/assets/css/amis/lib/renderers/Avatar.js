"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarFieldRenderer = exports.AvatarField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来展示用户头像
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Badge_1 = require("../components/Badge");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var AvatarField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AvatarField, _super);
    function AvatarField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AvatarField.prototype.render = function () {
        var _a = this.props, className = _a.className, _b = _a.icon, icon = _b === void 0 ? 'fa fa-user' : _b, text = _a.text, src = _a.src, _c = _a.fit, fit = _c === void 0 ? 'cover' : _c, data = _a.data, _d = _a.shape, shape = _d === void 0 ? 'circle' : _d, _e = _a.size, size = _e === void 0 ? 40 : _e, style = _a.style, cx = _a.classnames, props = _a.props;
        var sizeStyle = {
            height: size,
            width: size,
            lineHeight: size + 'px'
        };
        if ((0, tpl_builtin_1.isPureVariable)(text)) {
            text = (0, tpl_builtin_1.resolveVariable)(text, data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(src)) {
            src = (0, tpl_builtin_1.resolveVariable)(src, data);
        }
        if ((0, tpl_builtin_1.isPureVariable)(icon)) {
            icon = (0, tpl_builtin_1.resolveVariable)(icon, data);
        }
        var avatar = react_1.default.createElement("i", { className: icon });
        if (text) {
            if (text.length > 2) {
                text = text.substring(0, 2).toUpperCase();
            }
            avatar = react_1.default.createElement("span", null, text);
        }
        if (src) {
            avatar = react_1.default.createElement("img", { src: src, style: { objectFit: fit } });
        }
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({ className: cx('Avatar', className, "Avatar--" + shape), style: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, sizeStyle), style) }, props), avatar));
    };
    return AvatarField;
}(react_1.default.Component));
exports.AvatarField = AvatarField;
var AvatarFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AvatarFieldRenderer, _super);
    function AvatarFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AvatarFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'avatar'
        }),
        Badge_1.withBadge
    ], AvatarFieldRenderer);
    return AvatarFieldRenderer;
}(AvatarField));
exports.AvatarFieldRenderer = AvatarFieldRenderer;
//# sourceMappingURL=./renderers/Avatar.js.map
