"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsTransfer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var Tabs_1 = tslib_1.__importStar(require("./Tabs"));
var SearchBox_1 = (0, tslib_1.__importDefault)(require("./SearchBox"));
var TableCheckboxes_1 = (0, tslib_1.__importDefault)(require("./TableCheckboxes"));
var TreeCheckboxes_1 = (0, tslib_1.__importDefault)(require("./TreeCheckboxes"));
var ChainedCheckboxes_1 = (0, tslib_1.__importDefault)(require("./ChainedCheckboxes"));
var ListCheckboxes_1 = (0, tslib_1.__importDefault)(require("./ListCheckboxes"));
var Transfer_1 = (0, tslib_1.__importDefault)(require("./Transfer"));
var theme_1 = require("../theme");
var AssociatedCheckboxes_1 = (0, tslib_1.__importDefault)(require("./AssociatedCheckboxes"));
var locale_1 = require("../locale");
var TabsTransfer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TabsTransfer, _super);
    function TabsTransfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsTransfer.prototype.renderSearchResult = function (searchResult) {
        var _a = this.props, searchResultMode = _a.searchResultMode, noResultsText = _a.noResultsText, searchResultColumns = _a.searchResultColumns, cx = _a.classnames, value = _a.value, disabled = _a.disabled, onChange = _a.onChange, option2value = _a.option2value, cellRender = _a.cellRender;
        var options = searchResult || [];
        var mode = searchResultMode;
        return mode === 'table' ? (react_1.default.createElement(TableCheckboxes_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), columns: searchResultColumns, options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value, cellRender: cellRender })) : mode === 'tree' ? (react_1.default.createElement(TreeCheckboxes_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value })) : mode === 'chained' ? (react_1.default.createElement(ChainedCheckboxes_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value })) : (react_1.default.createElement(ListCheckboxes_1.default, { placeholder: noResultsText, className: cx('Transfer-checkboxes'), options: options, value: value, disabled: disabled, onChange: onChange, option2value: option2value }));
    };
    TabsTransfer.prototype.renderSelect = function (_a) {
        var onSearch = _a.onSearch, onSearchCancel = _a.onSearchCancel, searchResult = _a.searchResult;
        var _b = this.props, options = _b.options, placeholder = _b.placeholder, cx = _b.classnames, value = _b.value, disabled = _b.disabled, onChange = _b.onChange, searchable = _b.onSearch, option2value = _b.option2value, onDeferLoad = _b.onDeferLoad, cellRender = _b.cellRender, __ = _b.translate;
        if (!Array.isArray(options) || !options.length) {
            return (react_1.default.createElement("div", { className: cx('TabsTransfer-placeholder') }, __(placeholder || 'placeholder.noOption')));
        }
        return (react_1.default.createElement(Tabs_1.default, { mode: "card", className: cx('Transfer-tabs'), activeKey: searchResult !== null ? 0 : undefined, toolbar: searchable ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("span", { className: cx('TabsTransfer-tabsMid') }),
                react_1.default.createElement(SearchBox_1.default, { onSearch: onSearch, onCancel: onSearchCancel }))) : null }, searchResult !== null
            ? [
                react_1.default.createElement(Tabs_1.Tab, { title: __('searchResult'), key: 0, eventKey: 0 }, this.renderSearchResult(searchResult))
            ]
            : options.map(function (option, index) { return (react_1.default.createElement(Tabs_1.Tab, { eventKey: index, key: index, title: option.label || option.title }, option.selectMode === 'table' ? (react_1.default.createElement(TableCheckboxes_1.default, { className: cx('Transfer-checkboxes'), columns: option.columns, options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, cellRender: cellRender })) : option.selectMode === 'tree' ? (react_1.default.createElement(TreeCheckboxes_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad })) : option.selectMode === 'chained' ? (react_1.default.createElement(ChainedCheckboxes_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, defaultSelectedIndex: option.defaultSelectedIndex })) : option.selectMode === 'associated' ? (react_1.default.createElement(AssociatedCheckboxes_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad, leftMode: option.leftMode, leftOptions: option.leftOptions, leftDefaultValue: option.leftDefaultValue })) : (react_1.default.createElement(ListCheckboxes_1.default, { className: cx('Transfer-checkboxes'), options: option.children || [], value: value, disabled: disabled, onChange: onChange, option2value: option2value, onDeferLoad: onDeferLoad })))); })));
    };
    TabsTransfer.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames;
        return (react_1.default.createElement(Transfer_1.default, (0, tslib_1.__assign)({}, this.props, { statistics: false, className: cx('TabsTransfer', className), selectRender: this.renderSelect })));
    };
    TabsTransfer.defaultProps = {
        itemRender: function (option) { return react_1.default.createElement("span", null, option.label); }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TabsTransfer.prototype, "renderSelect", null);
    return TabsTransfer;
}(react_1.default.Component));
exports.TabsTransfer = TabsTransfer;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(TabsTransfer));
//# sourceMappingURL=./components/TabsTransfer.js.map
