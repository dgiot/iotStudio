"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainedCheckboxes = void 0;
var tslib_1 = require("tslib");
/**
 * 级联多选框，支持无限极。从左侧到右侧一层层点选。
 */
var Checkboxes_1 = require("./Checkboxes");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var helper_1 = require("../utils/helper");
var times_1 = (0, tslib_1.__importDefault)(require("lodash/times"));
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var locale_1 = require("../locale");
var ChainedCheckboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedCheckboxes, _super);
    function ChainedCheckboxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            selected: []
        };
        return _this;
    }
    ChainedCheckboxes.prototype.componentDidMount = function () {
        var defaultSelectedIndex = this.props.defaultSelectedIndex;
        if (defaultSelectedIndex !== undefined) {
            this.setState({
                selected: ["" + defaultSelectedIndex]
            });
        }
    };
    ChainedCheckboxes.prototype.selectOption = function (option, depth, id) {
        var onDeferLoad = this.props.onDeferLoad;
        var selected = this.state.selected.concat();
        selected.splice(depth, selected.length - depth);
        selected.push(id);
        this.setState({
            selected: selected
        }, option.defer && onDeferLoad ? function () { return onDeferLoad(option); } : undefined);
    };
    ChainedCheckboxes.prototype.renderOption = function (option, index, depth, id) {
        var _this = this;
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender;
        var valueArray = this.valueArray;
        if (Array.isArray(option.children) || option.defer) {
            return (react_1.default.createElement("div", { key: index, className: cx('ChainedCheckboxes-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : '', ~this.state.selected.indexOf(id) ? 'is-active' : ''), onClick: function () { return _this.selectOption(option, depth, id); } },
                react_1.default.createElement("div", { className: cx('ChainedCheckboxes-itemLabel') }, itemRender(option)),
                option.defer && option.loading ? react_1.default.createElement(Spinner_1.default, { size: "sm", show: true }) : null));
        }
        return (react_1.default.createElement("div", { key: index, className: cx('ChainedCheckboxes-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : ''), onClick: function () { return _this.toggleOption(option); } },
            react_1.default.createElement("div", { className: cx('ChainedCheckboxes-itemLabel') }, itemRender(option)),
            react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description })));
    };
    ChainedCheckboxes.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, itemRender = _a.itemRender, __ = _a.translate;
        this.valueArray = Checkboxes_1.BaseCheckboxes.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            var selected_1 = this.state.selected.concat();
            var depth = Math.min((0, helper_1.getTreeDepth)(options), 3);
            (0, times_1.default)(Math.max(depth - selected_1.length, 1), function () { return selected_1.push(null); });
            selected_1.reduce(function (_a, selected, depth) {
                var body = _a.body, options = _a.options, subTitle = _a.subTitle, indexes = _a.indexes, placeholder = _a.placeholder;
                var nextOptions = [];
                var nextSubTitle = '';
                var nextPlaceholder = '';
                var nextIndexes = indexes;
                body.push(react_1.default.createElement("div", { key: depth, className: cx('ChainedCheckboxes-col') },
                    subTitle ? (react_1.default.createElement("div", { className: cx('ChainedCheckboxes-subTitle') }, subTitle)) : null,
                    Array.isArray(options) && options.length ? (options.map(function (option, index) {
                        var id = indexes.concat(index).join('-');
                        if (id === selected) {
                            nextSubTitle = option.subTitle;
                            nextOptions = option.children;
                            nextIndexes = indexes.concat(index);
                            nextPlaceholder = option.placeholder;
                        }
                        return _this.renderOption(option, index, depth, id);
                    })) : (react_1.default.createElement("div", { className: cx('ChainedCheckboxes-placeholder') }, __(placeholder)))));
                return {
                    options: nextOptions,
                    subTitle: nextSubTitle,
                    placeholder: nextPlaceholder,
                    indexes: nextIndexes,
                    body: body
                };
            }, {
                options: options,
                body: body,
                indexes: [],
                placeholder: placeholder
            });
        }
        return (react_1.default.createElement("div", { className: cx('ChainedCheckboxes', className) }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('ChainedCheckboxes-placeholder') }, __(placeholder)))));
    };
    return ChainedCheckboxes;
}(Checkboxes_1.BaseCheckboxes));
exports.ChainedCheckboxes = ChainedCheckboxes;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ChainedCheckboxes, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/ChainedCheckboxes.js.map
