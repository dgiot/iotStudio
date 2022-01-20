"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeControlRenderer = exports.formatValue = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var isNumber_1 = (0, tslib_1.__importDefault)(require("lodash/isNumber"));
var isObject_1 = (0, tslib_1.__importDefault)(require("lodash/isObject"));
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var Item_1 = require("./Item");
var Range_1 = (0, tslib_1.__importDefault)(require("../../components/Range"));
var icons_1 = require("../../components/icons");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
function formatValue(value, props) {
    if (props.multiple) {
        if (typeof value === 'string') {
            var _a = value
                .split(props.delimiter || ',')
                .map(function (v) { return Number(v); }), minValue = _a[0], maxValue = _a[1];
            return {
                min: (props.min && minValue < props.min && props.min) ||
                    minValue ||
                    props.min,
                max: (props.max && maxValue > props.max && props.max) ||
                    maxValue ||
                    props.max
            };
        }
        else if (typeof value === 'object') {
            return {
                min: (props.min && value.min < props.min && props.min) ||
                    value.min ||
                    props.min,
                max: (props.max && value.max > props.max && props.max) ||
                    value.max ||
                    props.max
            };
        }
    }
    return value !== null && value !== void 0 ? value : props.min;
}
exports.formatValue = formatValue;
var RangeControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RangeControl, _super);
    function RangeControl(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, propsValue = _a.value, multiple = _a.multiple, delimiter = _a.delimiter, min = _a.min, max = _a.max;
        var value = formatValue(propsValue, {
            multiple: multiple,
            delimiter: delimiter,
            min: min,
            max: max
        });
        _this.state = {
            value: value,
            minValue: (0, isObject_1.default)(value) ? value.min : min,
            maxValue: (0, isObject_1.default)(value) ? value.max : max
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleEnd = _this.handleEnd.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.midLabelRef = _this.midLabelRef.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.handleMinInputBlur = _this.handleMinInputBlur.bind(_this);
        _this.handleMaxInputBlur = _this.handleMaxInputBlur.bind(_this);
        _this.handleMinInputChange = _this.handleMinInputChange.bind(_this);
        _this.handleMaxInputChange = _this.handleMaxInputChange.bind(_this);
        return _this;
    }
    RangeControl.prototype.componentDidMount = function () {
        this.updateStyle();
    };
    RangeControl.prototype.componentDidUpdate = function (prevProps) {
        var value = prevProps.value;
        var _a = this.props, nextPropsValue = _a.value, multiple = _a.multiple, delimiter = _a.delimiter, min = _a.min, max = _a.max;
        if (value !== nextPropsValue) {
            var value_1 = formatValue(nextPropsValue, {
                multiple: multiple,
                delimiter: delimiter,
                min: min,
                max: max
            });
            this.setState({
                value: value_1,
                minValue: (0, isObject_1.default)(value_1) ? value_1.min : min,
                maxValue: (0, isObject_1.default)(value_1) ? value_1.max : max
            });
        }
        if (prevProps.showInput !== this.props.showInput) {
            this.updateStyle();
        }
    };
    RangeControl.prototype.updateStyle = function () {
        var _a = this.props, showInput = _a.showInput, ns = _a.classPrefix, max = _a.max, min = _a.min;
        var offsetWidth = this.midLabel.offsetWidth;
        var midValue = parseFloat(((max + min - 0.000001) / 2).toFixed(this.getStepPrecision()));
        var left = 100 * ((midValue - min) / (max - min)) + "%";
        this.midLabel.style.left = left;
    };
    RangeControl.prototype.midLabelRef = function (ref) {
        this.midLabel = ref;
    };
    RangeControl.prototype.handleChange = function (value) {
        this.setState({
            value: (0, tpl_builtin_1.stripNumber)(value),
            minValue: value.min,
            maxValue: value.max
        });
    };
    RangeControl.prototype.clearValue = function () {
        var _a = this.props, multiple = _a.multiple, joinValues = _a.joinValues, delimiter = _a.delimiter, min = _a.min, max = _a.max, onChange = _a.onChange;
        if (multiple) {
            this.setState({
                value: {
                    min: min,
                    max: max
                },
                minValue: min,
                maxValue: max
            }, function () {
                return onChange(joinValues
                    ? [min, max].join(delimiter || ',')
                    : {
                        min: min,
                        max: max
                    });
            });
        }
        else {
            this.setState({
                value: min
            }, function () { return onChange(min); });
        }
    };
    RangeControl.prototype.handleEnd = function (value) {
        var _a = this.props, multiple = _a.multiple, joinValues = _a.joinValues, delimiter = _a.delimiter;
        var endValue = value;
        if (multiple) {
            endValue = joinValues
                ? [value.min, value.max].join(delimiter || ',')
                : {
                    min: value.min,
                    max: value.max
                };
        }
        else {
            endValue = (0, tpl_builtin_1.stripNumber)(value);
        }
        var onChange = this.props.onChange;
        this.setState({
            value: value
        }, function () { return onChange(endValue); });
    };
    RangeControl.prototype.getStepPrecision = function () {
        var _a;
        var step = this.props.step;
        return typeof step !== 'number' || step >= 1 || step < 0
            ? 0
            : (_a = step.toString().split('.')[1]) === null || _a === void 0 ? void 0 : _a.length;
    };
    RangeControl.prototype.getValue = function (value, type) {
        var _a = this.props, max = _a.max, min = _a.min, step = _a.step;
        var stateValue = this.state.value;
        if (value === '' ||
            value === '-' ||
            new RegExp('^[-]?\\d+[.]{1}[0]{0,' + this.getStepPrecision() + '}$').test(value)) {
            return value;
        }
        value = Math.round(parseFloat(value) / step) * step;
        value =
            step < 1 ? parseFloat(value.toFixed(this.getStepPrecision())) : ~~value;
        switch (type) {
            case 'min': {
                if ((0, isObject_1.default)(stateValue) && (0, isNumber_1.default)(stateValue.max)) {
                    if (value >= stateValue.max && min <= stateValue.max - step) {
                        return stateValue.max - step;
                    }
                    if (value < stateValue.max - step) {
                        return value;
                    }
                }
                return min;
            }
            case 'max':
                return (0, isObject_1.default)(stateValue) && (0, isNumber_1.default)(stateValue.min)
                    ? (value > max && max) ||
                        (value <= stateValue.min && stateValue.min + step) ||
                        value
                    : max;
            default:
                return (value < min && min) || (value > max && max) || value;
        }
    };
    RangeControl.prototype.handleInputChange = function (evt) {
        var _this = this;
        var value = this.getValue(evt.target.value);
        this.setState({
            value: value
        }, function () { return _this.props.onChange(value); });
    };
    RangeControl.prototype.handleMinInputBlur = function (evt) {
        var _this = this;
        var _a = this.props, joinValues = _a.joinValues, delimiter = _a.delimiter;
        var minValue = this.getValue(evt.target.value, 'min');
        var value = this.state.value;
        (0, isObject_1.default)(value)
            ? this.setState({
                value: {
                    min: minValue,
                    max: value.max
                },
                minValue: minValue
            }, function () {
                return _this.props.onChange(joinValues
                    ? [minValue, value.max].join(delimiter || ',')
                    : {
                        min: minValue,
                        max: value.max
                    });
            })
            : null;
    };
    RangeControl.prototype.handleMaxInputBlur = function (evt) {
        var _this = this;
        var _a = this.props, joinValues = _a.joinValues, delimiter = _a.delimiter;
        var maxValue = this.getValue(evt.target.value, 'max');
        var value = this.state.value;
        if ((0, isObject_1.default)(value)) {
            this.setState({
                value: {
                    min: value.min,
                    max: maxValue
                },
                maxValue: maxValue
            }, function () {
                return _this.props.onChange(joinValues
                    ? [value.min, maxValue].join(delimiter || ',')
                    : {
                        min: value.min,
                        max: maxValue
                    });
            });
        }
    };
    RangeControl.prototype.handleMinInputChange = function (evt) {
        this.setState({
            minValue: evt.target.value
        });
    };
    RangeControl.prototype.handleMaxInputChange = function (evt) {
        this.setState({
            maxValue: evt.target.value
        });
    };
    RangeControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, max = _a.max, min = _a.min, step = _a.step, unit = _a.unit, clearable = _a.clearable, name = _a.name, disabled = _a.disabled, className = _a.className, showInput = _a.showInput, multiple = _a.multiple, cx = _a.classnames, ns = _a.classPrefix;
        var midValue = ((max + min - 0.000001) / 2).toFixed(this.getStepPrecision());
        return (react_1.default.createElement("div", { className: cx('RangeControl', {
                'RangeControl--withInput': showInput,
                'RangeControl--clearable': clearable,
                'is-multiple': multiple
            }, className) },
            react_1.default.createElement(Range_1.default, { classPrefix: ns, value: this.state.value, disabled: disabled, onChange: this.handleChange, onChangeComplete: this.handleEnd, max: max, min: min, step: step, formatLabel: function (value) { return value + unit; }, multiple: multiple }),
            react_1.default.createElement("span", { className: cx('InputRange-label InputRange-label--mid'), ref: this.midLabelRef },
                react_1.default.createElement("span", { className: cx('InputRange-labelContainer') },
                    midValue,
                    unit)),
            showInput ? (multiple && (0, isObject_1.default)(this.state.value) ? (react_1.default.createElement("div", { className: cx('InputRange-input is-multiple') },
                react_1.default.createElement("input", { className: this.state.value.min !== min ? 'is-active' : '', type: "text", name: name, value: this.state.minValue, disabled: disabled, onChange: this.handleMinInputChange, onBlur: this.handleMinInputBlur }),
                react_1.default.createElement("span", { className: cx('InputRange-input-separator') }, " - "),
                react_1.default.createElement("input", { className: this.state.value.max !== max ? 'is-active' : '', type: "text", name: name, value: this.state.maxValue, disabled: disabled, onChange: this.handleMaxInputChange, onBlur: this.handleMaxInputBlur }))) : (react_1.default.createElement("div", { className: cx('InputRange-input') },
                react_1.default.createElement("input", { className: this.state.value !== min ? 'is-active' : '', type: "text", name: name, value: !(0, isObject_1.default)(this.state.value) ? this.state.value : 0, disabled: disabled, onChange: this.handleInputChange })))) : null,
            clearable && !disabled && showInput ? (react_1.default.createElement("a", { onClick: function () { return _this.clearValue(); }, className: cx('InputRange-clear', {
                    'is-active': multiple
                        ? (0, isEqual_1.default)(this.state.value, { min: min, max: max })
                        : this.state.value !== min
                }) },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null));
    };
    RangeControl.defaultProps = {
        max: 100,
        min: 0,
        step: 1,
        unit: '',
        clearable: true,
        disabled: false,
        showInput: false,
        multiple: false,
        joinValues: true,
        delimiter: ','
    };
    return RangeControl;
}(react_1.default.PureComponent));
exports.default = RangeControl;
var RangeControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RangeControlRenderer, _super);
    function RangeControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangeControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-range'
        })
    ], RangeControlRenderer);
    return RangeControlRenderer;
}(RangeControl));
exports.RangeControlRenderer = RangeControlRenderer;
//# sourceMappingURL=./renderers/Form/InputRange.js.map
