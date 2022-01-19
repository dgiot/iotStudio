"use strict";
/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var icons_1 = require("./icons");
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a);
var Spinner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Spinner, _super);
    function Spinner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.div = react_1.default.createRef();
        _this.overlay = react_1.default.createRef();
        return _this;
    }
    Spinner.prototype.render = function () {
        var _this = this;
        var _a = this.props, show = _a.show, cx = _a.classnames, spinnerClassName = _a.spinnerClassName, mode = _a.mode, size = _a.size, overlay = _a.overlay, icon = _a.icon;
        return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: show, timeout: 350 }, function (status) {
            var _a;
            if (status === Transition_1.ENTERING) {
                // force reflow
                // 由于从 mount 进来到加上 in 这个 class 估计是时间太短，上次的样式还没应用进去，所以这里强制reflow一把。
                // 否则看不到动画。
                // this.div.current!.offsetWidth;
                _this.overlay.current && _this.overlay.current.offsetWidth;
            }
            return (react_1.default.createElement(react_1.default.Fragment, null,
                overlay ? (react_1.default.createElement("div", { ref: _this.overlay, className: cx("Spinner-overlay", fadeStyles[status]) })) : null,
                react_1.default.createElement("div", { ref: _this.div, className: cx("Spinner", spinnerClassName, fadeStyles[status], (_a = {},
                        _a["Spinner--" + mode] = mode,
                        _a["Spinner--overlay"] = overlay,
                        _a["Spinner--" + size] = size,
                        _a["Spinner--icon"] = icon,
                        _a)) }, icon ? react_1.default.createElement(icons_1.Icon, { icon: icon, className: "icon" }) : null)));
        }));
    };
    Spinner.defaultProps = {
        overlay: false,
        spinnerClassName: '',
        mode: '',
        size: '',
        show: true
    };
    return Spinner;
}(react_1.default.Component));
exports.Spinner = Spinner;
exports.default = (0, theme_1.themeable)(Spinner);
//# sourceMappingURL=./components/Spinner.js.map
