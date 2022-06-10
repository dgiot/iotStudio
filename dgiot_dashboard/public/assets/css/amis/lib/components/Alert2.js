"use strict";
/**
 * @file Alert2
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var Alert = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Alert, _super);
    function Alert(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.state = {
            show: true
        };
        return _this;
    }
    Alert.prototype.handleClick = function () {
        this.setState({
            show: false
        }, this.props.onClose);
    };
    Alert.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, level = _a.level, children = _a.children, showCloseButton = _a.showCloseButton;
        return this.state.show ? (react_1.default.createElement("div", { className: cx('Alert', level ? "Alert--" + level : '', className) },
            showCloseButton ? (react_1.default.createElement("button", { className: cx('Alert-close'), onClick: this.handleClick, type: "button" },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
            children)) : null;
    };
    Alert.defaultProps = {
        level: 'info',
        className: '',
        showCloseButton: false
    };
    Alert.propsList = [
        'level',
        'className',
        'showCloseButton',
        'onClose'
    ];
    return Alert;
}(react_1.default.Component));
exports.Alert = Alert;
exports.default = (0, theme_1.themeable)(Alert);
//# sourceMappingURL=./components/Alert2.js.map
