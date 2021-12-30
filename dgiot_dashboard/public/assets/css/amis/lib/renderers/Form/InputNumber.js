"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var tpl_1 = require("../../utils/tpl");
var NumberInput_1 = (0, tslib_1.__importDefault)(require("../../components/NumberInput"));
var Select_1 = tslib_1.__importStar(require("../../components/Select"));
var NumberControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NumberControl, _super);
    function NumberControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleChangeUnit = _this.handleChangeUnit.bind(_this);
        var unit = _this.getUnit();
        var unitOptions = (0, Select_1.normalizeOptions)(props.unitOptions);
        _this.state = { unit: unit, unitOptions: unitOptions };
        return _this;
    }
    // 解析出单位
    NumberControl.prototype.getUnit = function () {
        var props = this.props;
        if (props.unitOptions && props.unitOptions.length) {
            var optionValues = (0, Select_1.normalizeOptions)(props.unitOptions).map(function (option) { return option.value; });
            // 如果有值就解析出来作为单位
            if (props.value && typeof props.value === 'string') {
                var unit = optionValues[0];
                // 先找长的字符，这样如果有 ab 和 b 两种后缀相同的也能识别
                optionValues.sort(function (a, b) { return b.length - a.length; });
                for (var _i = 0, optionValues_1 = optionValues; _i < optionValues_1.length; _i++) {
                    var optionValue = optionValues_1[_i];
                    if (props.value.endsWith(optionValue)) {
                        unit = optionValue;
                        break;
                    }
                }
                return unit;
            }
            else {
                // 没有值就使用第一个单位
                return optionValues[0];
            }
        }
        return undefined;
    };
    NumberControl.prototype.handleChange = function (inputValue) {
        var _a = this.props, ns = _a.classPrefix, onChange = _a.onChange, resetValue = _a.resetValue, unitOptions = _a.unitOptions;
        if (inputValue && typeof inputValue !== 'number') {
            return;
        }
        if (inputValue !== null && unitOptions && this.state.unit) {
            inputValue = inputValue + this.state.unit;
        }
        onChange(inputValue === null ? resetValue !== null && resetValue !== void 0 ? resetValue : null : inputValue);
    };
    NumberControl.prototype.filterNum = function (value) {
        if (typeof value !== 'number') {
            value = (0, tpl_1.filter)(value, this.props.data);
            value = /^[-]?\d+/.test(value) ? +value : undefined;
        }
        return value;
    };
    // 单位选项的变更
    NumberControl.prototype.handleChangeUnit = function (option) {
        var _this = this;
        var value = this.props.value;
        var prevUnitValue = this.state.unit;
        this.setState({ unit: option.value }, function () {
            if (value) {
                value = value.replace(prevUnitValue, '');
                _this.props.onChange(value + _this.state.unit);
            }
        });
    };
    NumberControl.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.value !== prevProps.value) {
            var unit = this.getUnit();
            this.setState({ unit: unit });
        }
        if (this.props.unitOptions !== prevProps.unitOptions) {
            this.setState({ unitOptions: (0, Select_1.normalizeOptions)(this.props.unitOptions) });
        }
    };
    NumberControl.prototype.render = function () {
        var _a;
        var _b;
        var _c = this.props, className = _c.className, ns = _c.classPrefix, value = _c.value, step = _c.step, precision = _c.precision, max = _c.max, min = _c.min, disabled = _c.disabled, placeholder = _c.placeholder, showSteps = _c.showSteps, borderMode = _c.borderMode, suffix = _c.suffix, prefix = _c.prefix, kilobitSeparator = _c.kilobitSeparator, unitOptions = _c.unitOptions, readOnly = _c.readOnly;
        var precisionProps = {};
        var finalPrecision = this.filterNum(precision);
        if (typeof finalPrecision === 'number') {
            precisionProps.precision = finalPrecision;
        }
        var unit = (_b = this.state) === null || _b === void 0 ? void 0 : _b.unit;
        // 数据格式化
        var formatter = function (value) {
            // 增加千分分隔
            if (kilobitSeparator && value) {
                value = (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            return (prefix ? prefix : '') + value + (suffix ? suffix : '');
        };
        // 将数字还原
        var parser = function (value) {
            if (value) {
                prefix && (value = value.replace(prefix, ''));
                suffix && (value = value.replace(suffix, ''));
                kilobitSeparator && (value = value.replace(/,/g, ''));
            }
            return value;
        };
        var finalValue = unit && value && typeof value === 'string'
            ? value.replace(unit, '')
            : value;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "NumberControl", (_a = {},
                _a[ns + "NumberControl--withUnit"] = unitOptions,
                _a), className) },
            react_1.default.createElement(NumberInput_1.default, { value: finalValue, step: step, max: this.filterNum(max), min: this.filterNum(min), formatter: formatter, parser: parser, onChange: this.handleChange, disabled: disabled, placeholder: placeholder, precision: finalPrecision, showSteps: showSteps, borderMode: borderMode, readOnly: readOnly }),
            unitOptions ? (react_1.default.createElement(Select_1.default, { value: unit, clearable: false, options: this.state.unitOptions || [], onChange: this.handleChangeUnit })) : null));
    };
    NumberControl.defaultProps = {
        step: 1,
        resetValue: ''
    };
    return NumberControl;
}(react_1.default.Component));
exports.default = NumberControl;
var NumberControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NumberControlRenderer, _super);
    function NumberControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberControlRenderer.defaultProps = (0, tslib_1.__assign)({ validations: 'isNumeric' }, NumberControl.defaultProps);
    NumberControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-number'
        })
    ], NumberControlRenderer);
    return NumberControlRenderer;
}(NumberControl));
exports.NumberControlRenderer = NumberControlRenderer;
//# sourceMappingURL=./renderers/Form/InputNumber.js.map
