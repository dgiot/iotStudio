"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultBox = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var icons_1 = require("./icons");
var Input_1 = (0, tslib_1.__importDefault)(require("./Input"));
var helper_1 = require("../utils/helper");
var locale_1 = require("../locale");
var ResultBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ResultBox, _super);
    function ResultBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isFocused: false
        };
        _this.inputRef = react_1.default.createRef();
        return _this;
    }
    ResultBox.prototype.focus = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    ResultBox.prototype.blur = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
    };
    ResultBox.prototype.clearValue = function (e) {
        e.preventDefault();
        var onResultChange = this.props.onResultChange;
        onResultChange && onResultChange([]);
    };
    ResultBox.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        onFocus && onFocus(e);
        this.setState({
            isFocused: true
        });
    };
    ResultBox.prototype.handleBlur = function (e) {
        var onBlur = this.props.onBlur;
        onBlur && onBlur(e);
        this.setState({
            isFocused: false
        });
    };
    ResultBox.prototype.removeItem = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var _a = this.props, result = _a.result, onResultChange = _a.onResultChange;
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var newResult = Array.isArray(result) ? result.concat() : [];
        newResult.splice(index, 1);
        onResultChange && onResultChange(newResult);
    };
    ResultBox.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        onChange === null || onChange === void 0 ? void 0 : onChange(e.currentTarget.value);
    };
    ResultBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, cx = _a.classnames, classPrefix = _a.classPrefix, clearable = _a.clearable, disabled = _a.disabled, hasError = _a.hasError, result = _a.result, value = _a.value, placeholder = _a.placeholder, children = _a.children, itemRender = _a.itemRender, allowInput = _a.allowInput, inputPlaceholder = _a.inputPlaceholder, onResultChange = _a.onResultChange, onChange = _a.onChange, onResultClick = _a.onResultClick, __ = _a.translate, locale = _a.locale, onKeyPress = _a.onKeyPress, onFocus = _a.onFocus, onBlur = _a.onBlur, rest = (0, tslib_1.__rest)(_a, ["className", "classnames", "classPrefix", "clearable", "disabled", "hasError", "result", "value", "placeholder", "children", "itemRender", "allowInput", "inputPlaceholder", "onResultChange", "onChange", "onResultClick", "translate", "locale", "onKeyPress", "onFocus", "onBlur"]);
        var isFocused = this.state.isFocused;
        return (react_1.default.createElement("div", { className: cx('ResultBox', className, isFocused ? 'is-focused' : '', disabled ? 'is-disabled' : '', hasError ? 'is-error' : '', onResultClick ? 'is-clickable' : ''), onClick: onResultClick, tabIndex: !allowInput && !disabled && onFocus ? 0 : -1, onKeyPress: allowInput ? undefined : onKeyPress, onFocus: allowInput ? undefined : onFocus, onBlur: allowInput ? undefined : onBlur },
            Array.isArray(result) && result.length ? (result.map(function (item, index) { return (react_1.default.createElement("div", { className: cx('ResultBox-value'), key: index },
                react_1.default.createElement("span", { className: cx('ResultBox-valueLabel') }, itemRender(item)),
                !disabled ? (react_1.default.createElement("a", { "data-index": index, onClick: _this.removeItem },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)); })) : result && !Array.isArray(result) ? (react_1.default.createElement("span", { className: cx('ResultBox-singleValue') }, result)) : allowInput && !disabled ? null : (react_1.default.createElement("span", { className: cx('ResultBox-placeholder') }, __(placeholder || 'placeholder.noData'))),
            allowInput && !disabled ? (react_1.default.createElement(Input_1.default, (0, tslib_1.__assign)({}, rest, { onKeyPress: onKeyPress, ref: this.inputRef, value: value || '', onChange: this.handleChange, placeholder: __(Array.isArray(result) && result.length
                    ? inputPlaceholder
                    : placeholder), onFocus: this.handleFocus, onBlur: this.handleBlur }))) : null,
            children,
            clearable &&
                !disabled &&
                (Array.isArray(result) ? result.length : result) ? (react_1.default.createElement("a", { onClick: this.clearValue, className: cx('ResultBox-clear') },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null));
    };
    var _a, _b, _c;
    ResultBox.defaultProps = {
        clearable: false,
        placeholder: 'placeholder.noData',
        inputPlaceholder: 'placeholder.enter',
        itemRender: function (option) { return (react_1.default.createElement("span", null, "" + (option.scopeLabel || '') + option.label)); }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "clearValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "removeItem", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultBox.prototype, "handleChange", null);
    return ResultBox;
}(react_1.default.Component));
exports.ResultBox = ResultBox;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ResultBox, {
    value: 'onChange',
    result: 'onResultChange'
})));
//# sourceMappingURL=./components/ResultBox.js.map
