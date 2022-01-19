"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCheckboxes = void 0;
var tslib_1 = require("tslib");
var Checkboxes_1 = require("./Checkboxes");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var tpl_builtin_1 = require("../utils/tpl-builtin");
var locale_1 = require("../locale");
var TableCheckboxes = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableCheckboxes, _super);
    function TableCheckboxes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableCheckboxes.prototype.getColumns = function () {
        var columns = this.props.columns;
        if (!Array.isArray(columns) || !columns.length) {
            columns = [{ label: 'Label', name: 'label' }];
        }
        return columns;
    };
    TableCheckboxes.prototype.renderTHead = function () {
        var _a = this.props, options = _a.options, cx = _a.classnames, value = _a.value, disabled = _a.disabled, option2value = _a.option2value;
        var columns = this.getColumns();
        var valueArray = Checkboxes_1.BaseCheckboxes.value2array(value, options, option2value);
        var availableOptions = options.filter(function (option) { return !option.disabled; });
        var partialChecked = false;
        var allChecked = !!availableOptions.length;
        availableOptions.forEach(function (option) {
            var isIn = !!~valueArray.indexOf(option);
            if (isIn && !partialChecked) {
                partialChecked = true;
            }
            else if (!isIn && allChecked) {
                allChecked = false;
            }
        });
        return (react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null,
                Array.isArray(options) && options.length ? (react_1.default.createElement("th", { className: cx('Table-checkCell') },
                    react_1.default.createElement(Checkbox_1.default, { size: "sm", disabled: disabled, onChange: this.toggleAll, checked: partialChecked, partial: partialChecked && !allChecked }))) : null,
                columns.map(function (column, index) { return (react_1.default.createElement("th", { key: index }, column.label)); }))));
    };
    TableCheckboxes.prototype.renderTBody = function () {
        var _this = this;
        var _a = this.props, options = _a.options, placeholder = _a.placeholder, cx = _a.classnames, cellRender = _a.cellRender, value = _a.value, disabled = _a.disabled, option2value = _a.option2value, __ = _a.translate;
        var columns = this.getColumns();
        var valueArray = Checkboxes_1.BaseCheckboxes.value2array(value, options, option2value);
        return (react_1.default.createElement("tbody", null, Array.isArray(options) && options.length ? (options.map(function (option, rowIndex) {
            var checked = valueArray.indexOf(option) !== -1;
            return (react_1.default.createElement("tr", { key: rowIndex, onClick: function (e) { return e.defaultPrevented || _this.toggleOption(option); } },
                react_1.default.createElement("td", { className: cx('Table-checkCell') },
                    react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: checked, disabled: disabled })),
                columns.map(function (column, colIndex) { return (react_1.default.createElement("td", { key: colIndex }, cellRender(column, option, colIndex, rowIndex))); })));
        })) : (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", { colSpan: columns.length }, __(placeholder))))));
    };
    TableCheckboxes.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, option2value = _a.option2value, itemClassName = _a.itemClassName, itemRender = _a.itemRender;
        var valueArray = Checkboxes_1.BaseCheckboxes.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return (react_1.default.createElement("div", { key: key, className: cx('TableCheckboxes-item', itemClassName, option.className, disabled || option.disabled ? 'is-disabled' : ''), onClick: function () { return _this.toggleOption(option); } },
                react_1.default.createElement("div", { className: cx('TableCheckboxes-itemLabel') }, itemRender(option)),
                react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: !!~valueArray.indexOf(option), disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description }))); });
        }
        return (react_1.default.createElement("div", { className: cx('TableCheckboxes', className) },
            react_1.default.createElement("div", { className: cx('Table-content') },
                react_1.default.createElement("table", { className: cx('Table-table') },
                    this.renderTHead(),
                    this.renderTBody()))));
    };
    TableCheckboxes.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, Checkboxes_1.BaseCheckboxes.defaultProps), { cellRender: function (column, option, colIndex, rowIndex) { return react_1.default.createElement("span", null, (0, tpl_builtin_1.resolveVariable)(column.name, option)); } });
    return TableCheckboxes;
}(Checkboxes_1.BaseCheckboxes));
exports.TableCheckboxes = TableCheckboxes;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(TableCheckboxes, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/TableCheckboxes.js.map
