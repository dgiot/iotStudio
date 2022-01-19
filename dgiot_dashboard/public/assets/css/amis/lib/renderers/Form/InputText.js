"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeNumberControlRenderer = exports.NativeTimeControlRenderer = exports.NativeDateControlRenderer = exports.UrlControlRenderer = exports.EmailControlRenderer = exports.PasswordControlRenderer = exports.TextControlRenderer = exports.mapItemIndex = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Options_1 = require("./Options");
var downshift_1 = (0, tslib_1.__importDefault)(require("downshift"));
var match_sorter_1 = require("match-sorter");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var tpl_1 = require("../../utils/tpl");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var icons_1 = require("../../components/icons");
var Input_1 = (0, tslib_1.__importDefault)(require("../../components/Input"));
var helper_1 = require("../../utils/helper");
var api_1 = require("../../utils/api");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var icon_1 = require("../../utils/icon");
var TextControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TextControl, _super);
    function TextControl(props) {
        var _this = _super.call(this, props) || this;
        var value = props.value;
        _this.state = {
            isOpen: false,
            inputValue: props.multiple || props.creatable === false
                ? ''
                : _this.valueToString(value),
            isFocused: false
        };
        _this.focus = _this.focus.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.inputRef = _this.inputRef.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleStateChange = _this.handleStateChange.bind(_this);
        _this.loadAutoComplete = (0, debounce_1.default)(_this.loadAutoComplete.bind(_this), 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    TextControl.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, formItem = _a.formItem, autoComplete = _a.autoComplete, addHook = _a.addHook, formInited = _a.formInited, data = _a.data, name = _a.name;
        if ((0, api_1.isEffectiveApi)(autoComplete, data) && formItem) {
            if (formInited) {
                formItem.loadOptions(autoComplete, (0, helper_1.createObject)(data, {
                    term: ''
                }));
            }
            else {
                this.unHook = addHook(function (data) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    return (0, tslib_1.__generator)(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, formItem.loadOptions(autoComplete, (0, helper_1.createObject)(data, {
                                    term: ''
                                }))];
                            case 1:
                                _a.sent();
                                if (formItem.value) {
                                    (0, helper_1.setVariable)(data, name, formItem.value);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, 'init');
            }
        }
    };
    TextControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                inputValue: props.multiple || props.creatable === false
                    ? ''
                    : this.valueToString(props.value)
            });
        }
    };
    TextControl.prototype.componentWillUnmount = function () {
        this.unHook && this.unHook();
    };
    TextControl.prototype.inputRef = function (ref) {
        this.input = ref;
    };
    TextControl.prototype.focus = function () {
        if (!this.input) {
            return;
        }
        this.input.focus();
        // 光标放到最后
        var len = this.input.value.length;
        len && this.input.setSelectionRange(len, len);
    };
    TextControl.prototype.clearValue = function () {
        var _this = this;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange(resetValue);
        this.setState({
            inputValue: resetValue
        }, function () {
            _this.focus();
            _this.loadAutoComplete();
        });
    };
    TextControl.prototype.removeItem = function (index) {
        var _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField;
        var newValue = selectedOptions.concat();
        newValue.splice(index, 1);
        onChange(joinValues
            ? newValue
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',')
            : extractValue
                ? newValue.map(function (item) { return item[valueField || 'value']; })
                : newValue);
    };
    TextControl.prototype.handleClick = function () {
        this.focus();
        this.setState({
            isOpen: true
        });
    };
    TextControl.prototype.handleFocus = function (e) {
        this.setState({
            isOpen: true,
            isFocused: true
        });
        this.props.onFocus && this.props.onFocus(e);
    };
    TextControl.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            isFocused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange(value.trim());
            }
        });
        onBlur && onBlur(e);
    };
    TextControl.prototype.handleInputChange = function (evt) {
        var _this = this;
        var value = evt.currentTarget.value;
        var _a = this.props, creatable = _a.creatable, multiple = _a.multiple, onChange = _a.onChange;
        this.setState({
            inputValue: value
        }, function () {
            if (creatable !== false && !multiple) {
                onChange === null || onChange === void 0 ? void 0 : onChange(value);
            }
            _this.loadAutoComplete();
        });
    };
    TextControl.prototype.handleKeyDown = function (evt) {
        var _a = this.props, selectedOptions = _a.selectedOptions, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, multiple = _a.multiple, valueField = _a.valueField, creatable = _a.creatable;
        if (selectedOptions.length && !this.state.inputValue && evt.keyCode === 8) {
            evt.preventDefault();
            var newValue = selectedOptions.concat();
            newValue.pop();
            onChange(joinValues
                ? newValue
                    .map(function (item) { return item[valueField || 'value']; })
                    .join(delimiter || ',')
                : extractValue
                    ? newValue.map(function (item) { return item[valueField || 'value']; })
                    : newValue);
            this.setState({
                inputValue: ''
            }, this.loadAutoComplete);
        }
        else if (evt.keyCode === 13 &&
            this.state.inputValue &&
            typeof this.highlightedIndex !== 'number') {
            evt.preventDefault();
            var value_1 = this.state.inputValue;
            if (multiple) {
                if (value_1 && !(0, find_1.default)(selectedOptions, function (item) { return item.value == value_1; })) {
                    var newValue = selectedOptions.concat();
                    newValue.push({
                        label: value_1,
                        value: value_1
                    });
                    onChange(joinValues
                        ? newValue
                            .map(function (item) { return item[valueField || 'value']; })
                            .join(delimiter || ',')
                        : extractValue
                            ? newValue.map(function (item) { return item[valueField || 'value']; })
                            : newValue);
                }
            }
            else {
                onChange(value_1);
            }
            if (creatable === false || multiple) {
                this.setState({
                    inputValue: '',
                    isOpen: false
                }, this.loadAutoComplete);
            }
        }
        else if (evt.keyCode === 13 &&
            this.state.isOpen &&
            typeof this.highlightedIndex !== 'number') {
            this.setState({
                isOpen: false
            });
        }
    };
    TextControl.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, multiple = _a.multiple, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, selectedOptions = _a.selectedOptions, valueField = _a.valueField, creatable = _a.creatable;
        if (multiple) {
            var newValue = selectedOptions.concat();
            newValue.push({
                label: value,
                value: value
            });
            onChange(joinValues
                ? newValue
                    .map(function (item) { return item[valueField || 'value']; })
                    .join(delimiter || ',')
                : extractValue
                    ? newValue.map(function (item) { return item[valueField || 'value']; })
                    : newValue);
        }
        else {
            onChange(value);
        }
        if (multiple || creatable === false) {
            this.setState({
                inputValue: ''
            }, this.loadAutoComplete);
        }
    };
    TextControl.prototype.handleStateChange = function (changes) {
        var creatable = this.props.creatable;
        var multiple = this.props.multiple || this.props.multi;
        switch (changes.type) {
            case downshift_1.default.stateChangeTypes.itemMouseEnter:
                this.setState({
                    isOpen: true
                });
                break;
            case downshift_1.default.stateChangeTypes.changeInput:
                this.setState({
                    isOpen: true
                });
                break;
            default:
                var state = {};
                if (typeof changes.isOpen !== 'undefined') {
                    state.isOpen = changes.isOpen;
                }
                if (typeof changes.highlightedIndex !== 'undefined') {
                    this.highlightedIndex = changes.highlightedIndex;
                }
                // 输入框清空
                if (!multiple &&
                    creatable === false &&
                    this.state.isOpen &&
                    changes.isOpen === false) {
                    state.inputValue = '';
                }
                this.setState(state);
                break;
        }
    };
    TextControl.prototype.handleNormalInputChange = function (e) {
        var onChange = this.props.onChange;
        var value = e.currentTarget.value;
        onChange(value);
    };
    TextControl.prototype.loadAutoComplete = function () {
        var _a = this.props, formItem = _a.formItem, autoComplete = _a.autoComplete, data = _a.data, multiple = _a.multiple, selectedOptions = _a.selectedOptions;
        if ((0, api_1.isEffectiveApi)(autoComplete, data) && formItem) {
            formItem.loadOptions(autoComplete, (0, helper_1.createObject)(data, {
                term: this.state.inputValue || '' // (multiple ? '' : selectedOptions[selectedOptions.length - 1]?.value)
            }), {
                extendsOptions: true
            });
        }
    };
    TextControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    TextControl.prototype.valueToString = function (value) {
        return typeof value === 'undefined' || value === null
            ? ''
            : typeof value === 'string'
                ? value
                : JSON.stringify(value);
    };
    TextControl.prototype.renderSugestMode = function () {
        var _this = this;
        var _a;
        var _b = this.props, className = _b.className, inputOnly = _b.inputOnly, value = _b.value, placeholder = _b.placeholder, cx = _b.classnames, disabled = _b.disabled, name = _b.name, loading = _b.loading, clearable = _b.clearable, options = _b.options, selectedOptions = _b.selectedOptions, autoComplete = _b.autoComplete, labelField = _b.labelField, valueField = _b.valueField, multiple = _b.multiple, creatable = _b.creatable, borderMode = _b.borderMode, __ = _b.translate;
        var type = (_a = this.props.type) === null || _a === void 0 ? void 0 : _a.replace(/^(?:native|input)\-/, '');
        return (react_1.default.createElement(downshift_1.default, { isOpen: this.state.isOpen && !disabled, inputValue: this.state.inputValue, onChange: this.handleChange, onStateChange: this.handleStateChange, selectedItem: selectedOptions.map(function (item) { return item[valueField || 'value']; }) }, function (_a) {
            var _b;
            var getInputProps = _a.getInputProps, getItemProps = _a.getItemProps, isOpen = _a.isOpen, inputValue = _a.inputValue, selectedItem = _a.selectedItem, highlightedIndex = _a.highlightedIndex;
            var filtedOptions = inputValue && isOpen && !autoComplete
                ? (0, match_sorter_1.matchSorter)(options, inputValue, {
                    keys: [labelField || 'label', valueField || 'value']
                })
                : options;
            var indices = isOpen
                ? mapItemIndex(filtedOptions, selectedItem)
                : {};
            filtedOptions = filtedOptions.filter(function (option) { return !~selectedItem.indexOf(option.value); });
            return (react_1.default.createElement("div", { className: cx("TextControl-input TextControl-input--withAC", inputOnly ? className : '', (_b = {
                        'is-opened': isOpen,
                        'TextControl-input--multiple': multiple
                    },
                    _b["TextControl-input--border" + (0, helper_1.ucFirst)(borderMode)] = borderMode,
                    _b)), onClick: _this.handleClick },
                react_1.default.createElement(react_1.default.Fragment, null,
                    placeholder &&
                        !selectedOptions.length &&
                        !_this.state.inputValue &&
                        !_this.state.isFocused ? (react_1.default.createElement("div", { className: cx('TextControl-placeholder') }, placeholder)) : null,
                    selectedOptions.map(function (item, index) {
                        return multiple ? (react_1.default.createElement("div", { className: cx('TextControl-value'), key: index },
                            react_1.default.createElement("span", { className: cx('TextControl-valueIcon'), onClick: _this.removeItem.bind(_this, index) }, "\u00D7"),
                            react_1.default.createElement("span", { className: cx('TextControl-valueLabel') }, "" + item[labelField || 'label']))) : (inputValue && isOpen) || creatable !== false ? null : (react_1.default.createElement("div", { className: cx('TextControl-value'), key: index }, item.label));
                    }),
                    react_1.default.createElement(Input_1.default, (0, tslib_1.__assign)({}, getInputProps({
                        name: name,
                        ref: _this.inputRef,
                        disabled: disabled,
                        type: type,
                        onFocus: _this.handleFocus,
                        onBlur: _this.handleBlur,
                        onChange: _this.handleInputChange,
                        onKeyDown: _this.handleKeyDown
                    }), { autoComplete: "off", size: 10 }))),
                clearable && !disabled && value ? (react_1.default.createElement("a", { onClick: _this.clearValue, className: cx('TextControl-clear') },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
                loading ? (react_1.default.createElement(Spinner_1.default, { show: true, icon: "reload", spinnerClassName: cx('TextControl-spinner') })) : null,
                isOpen && filtedOptions.length ? (react_1.default.createElement("div", { className: cx('TextControl-sugs') }, filtedOptions.map(function (option) {
                    return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, getItemProps({
                        item: option.value,
                        disabled: option.disabled,
                        className: cx("TextControl-sugItem", {
                            'is-highlight': highlightedIndex === indices[option.value],
                            'is-disabled': option.disabled
                        })
                    }), { key: option.value }),
                        react_1.default.createElement("span", null,
                            option.disabled
                                ? option.label
                                : (0, Options_1.highlight)(option.label, inputValue),
                            option.tip)));
                }))) : null));
        }));
    };
    TextControl.prototype.renderNormal = function () {
        var _a;
        var _b;
        var _c = this.props, ns = _c.classPrefix, cx = _c.classnames, className = _c.className, inputOnly = _c.inputOnly, value = _c.value, placeholder = _c.placeholder, onChange = _c.onChange, disabled = _c.disabled, readOnly = _c.readOnly, max = _c.max, min = _c.min, step = _c.step, clearable = _c.clearable, name = _c.name, borderMode = _c.borderMode, prefix = _c.prefix, suffix = _c.suffix, data = _c.data, showCounter = _c.showCounter, maxLength = _c.maxLength;
        var type = (_b = this.props.type) === null || _b === void 0 ? void 0 : _b.replace(/^(?:native|input)\-/, '');
        return (react_1.default.createElement("div", { className: cx('TextControl-input', (_a = {},
                _a["TextControl-input--border" + (0, helper_1.ucFirst)(borderMode)] = borderMode,
                _a), inputOnly ? className : '') },
            prefix ? (react_1.default.createElement("span", { className: cx('TextControl-inputPrefix') }, (0, tpl_1.filter)(prefix, data))) : null,
            react_1.default.createElement("input", { name: name, placeholder: placeholder, ref: this.inputRef, disabled: disabled, readOnly: readOnly, type: type, onFocus: this.handleFocus, onBlur: this.handleBlur, max: max, min: min, autoComplete: "off", size: 10, step: step, onChange: this.handleNormalInputChange, value: this.valueToString(value) }),
            clearable && !disabled && value ? (react_1.default.createElement("a", { onClick: this.clearValue, className: ns + "TextControl-clear" },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null,
            showCounter ? (react_1.default.createElement("span", { className: cx('TextControl-counter') }, "" + (typeof value === 'undefined' || value === null
                ? ''
                : typeof value === 'string'
                    ? value
                    : JSON.stringify(value)).length + (typeof maxLength === 'number' && maxLength ? "/" + maxLength : ''))) : null,
            suffix ? (react_1.default.createElement("span", { className: cx('TextControl-inputSuffix') }, (0, tpl_1.filter)(suffix, data))) : null));
    };
    TextControl.prototype.render = function () {
        var _a;
        var _b = this.props, cx = _b.classnames, className = _b.className, ns = _b.classPrefix, options = _b.options, source = _b.source, autoComplete = _b.autoComplete, addOnRaw = _b.addOn, render = _b.render, data = _b.data, disabled = _b.disabled, inputOnly = _b.inputOnly;
        var addOn = typeof addOnRaw === 'string'
            ? {
                label: addOnRaw,
                type: 'plain'
            }
            : addOnRaw;
        var input = autoComplete !== false && (source || options.length || autoComplete)
            ? this.renderSugestMode()
            : this.renderNormal();
        var iconElement = (0, icon_1.generateIcon)(cx, addOn === null || addOn === void 0 ? void 0 : addOn.icon, 'Icon');
        var addOnDom = addOn ? (addOn.actionType ||
            ~['button', 'submit', 'reset', 'action'].indexOf(addOn.type) ? (react_1.default.createElement("div", { className: cx(ns + "TextControl-button", addOn.className) }, render('addOn', addOn, {
            disabled: disabled
        }))) : (react_1.default.createElement("div", { className: cx(ns + "TextControl-addOn", addOn.className) },
            addOn.label ? (0, tpl_1.filter)(addOn.label, data) : null,
            iconElement))) : null;
        if (inputOnly) {
            return input;
        }
        return (react_1.default.createElement("div", { className: cx(className, ns + "TextControl", (_a = {},
                _a[ns + "TextControl--withAddOn"] = !!addOnDom,
                _a['is-focused'] = this.state.isFocused,
                _a['is-disabled'] = disabled,
                _a)) },
            addOn && addOn.position === 'left' ? addOnDom : null,
            input,
            addOn && addOn.position !== 'left' ? addOnDom : null));
    };
    var _a;
    TextControl.defaultProps = {
        resetValue: '',
        labelField: 'label',
        valueField: 'value',
        placeholder: '',
        allowInputText: true,
        trimContents: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TextControl.prototype, "handleNormalInputChange", null);
    return TextControl;
}(react_1.default.PureComponent));
exports.default = TextControl;
function mapItemIndex(items, values, valueField) {
    if (valueField === void 0) { valueField = 'value'; }
    return items
        .filter(function (item) { return values.indexOf(item[valueField || 'value']) === -1; })
        .reduce(function (prev, next, i) {
        prev[next[valueField || 'value']] = i;
        return prev;
    }, {});
}
exports.mapItemIndex = mapItemIndex;
var TextControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TextControlRenderer, _super);
    function TextControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'input-text'
        })
    ], TextControlRenderer);
    return TextControlRenderer;
}(TextControl));
exports.TextControlRenderer = TextControlRenderer;
var PasswordControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PasswordControlRenderer, _super);
    function PasswordControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PasswordControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'input-password'
        })
    ], PasswordControlRenderer);
    return PasswordControlRenderer;
}(TextControl));
exports.PasswordControlRenderer = PasswordControlRenderer;
var EmailControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(EmailControlRenderer, _super);
    function EmailControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'input-email',
            validations: 'isEmail'
        })
    ], EmailControlRenderer);
    return EmailControlRenderer;
}(TextControl));
exports.EmailControlRenderer = EmailControlRenderer;
var UrlControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UrlControlRenderer, _super);
    function UrlControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UrlControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'input-url',
            validations: 'isUrl'
        })
    ], UrlControlRenderer);
    return UrlControlRenderer;
}(TextControl));
exports.UrlControlRenderer = UrlControlRenderer;
var NativeDateControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NativeDateControlRenderer, _super);
    function NativeDateControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeDateControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'native-date'
        })
    ], NativeDateControlRenderer);
    return NativeDateControlRenderer;
}(TextControl));
exports.NativeDateControlRenderer = NativeDateControlRenderer;
var NativeTimeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NativeTimeControlRenderer, _super);
    function NativeTimeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeTimeControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'native-time'
        })
    ], NativeTimeControlRenderer);
    return NativeTimeControlRenderer;
}(TextControl));
exports.NativeTimeControlRenderer = NativeTimeControlRenderer;
var NativeNumberControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NativeNumberControlRenderer, _super);
    function NativeNumberControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeNumberControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'native-number'
        })
    ], NativeNumberControlRenderer);
    return NativeNumberControlRenderer;
}(TextControl));
exports.NativeNumberControlRenderer = NativeNumberControlRenderer;
//# sourceMappingURL=./renderers/Form/InputText.js.map
