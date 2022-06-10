"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRender = exports.BaseTransferRenderer = void 0;
var tslib_1 = require("tslib");
var Options_1 = require("./Options");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transfer_1 = (0, tslib_1.__importDefault)(require("../../components/Transfer"));
var Options_2 = require("./Options");
var helper_1 = require("../../utils/helper");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var Select_1 = require("../../components/Select");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var BaseTransferRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaseTransferRenderer, _super);
    function BaseTransferRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseTransferRenderer.prototype.handleChange = function (value) {
        var _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, valueField = _a.valueField, extractValue = _a.extractValue, options = _a.options, setOptions = _a.setOptions;
        var newValue = value;
        var newOptions = options.concat();
        if (Array.isArray(value)) {
            if (joinValues || extractValue) {
                newValue = value.map(function (item) {
                    var resolved = (0, helper_1.findTree)(options, (0, Select_1.optionValueCompare)(item[valueField || 'value'], valueField || 'value'));
                    if (!resolved) {
                        newOptions.push(item);
                    }
                    return item[valueField || 'value'];
                });
            }
            if (joinValues) {
                newValue = newValue.join(delimiter || ',');
            }
        }
        newOptions.length > options.length && setOptions(newOptions, true);
        onChange(newValue);
    };
    BaseTransferRenderer.prototype.option2value = function (option) {
        return option;
    };
    BaseTransferRenderer.prototype.handleSearch = function (term, cancelExecutor) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, searchApi, options, labelField, valueField, env, data, payload, result, e_1, regexp_1;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, searchApi = _a.searchApi, options = _a.options, labelField = _a.labelField, valueField = _a.valueField, env = _a.env, data = _a.data;
                        if (!searchApi) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, env.fetcher(searchApi, (0, helper_1.createObject)(data, { term: term }), {
                                cancelExecutor: cancelExecutor
                            })];
                    case 2:
                        payload = _b.sent();
                        if (!payload.ok) {
                            throw new Error(payload.msg || '搜索请求异常');
                        }
                        result = payload.data.options || payload.data.items || payload.data;
                        if (!Array.isArray(result)) {
                            throw new Error('CRUD.invalidArray');
                        }
                        return [2 /*return*/, result.map(function (item) {
                                var resolved = null;
                                var value = item[valueField || 'value'];
                                // 只有 value 值有意义的时候，再去找；否则直接返回
                                if (Array.isArray(options) && value !== null && value !== undefined) {
                                    resolved = (0, find_1.default)(options, (0, Select_1.optionValueCompare)(value, valueField));
                                }
                                return resolved || item;
                            })];
                    case 3:
                        e_1 = _b.sent();
                        if (!env.isCancel(e_1)) {
                            env.notify('error', e_1.message);
                        }
                        return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (term) {
                            regexp_1 = (0, helper_1.string2regExp)(term);
                            return [2 /*return*/, (0, helper_1.filterTree)(options, function (option) {
                                    return !!((Array.isArray(option.children) && option.children.length) ||
                                        regexp_1.test(option[labelField || 'label']) ||
                                        regexp_1.test(option[valueField || 'value']));
                                }, 0, true)];
                        }
                        else {
                            return [2 /*return*/, options];
                        }
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BaseTransferRenderer.prototype.renderCell = function (column, option, colIndex, rowIndex) {
        var _a = this.props, render = _a.render, data = _a.data;
        return render("cell/" + colIndex + "/" + rowIndex, (0, tslib_1.__assign)({ type: 'text' }, column), {
            value: (0, tpl_builtin_1.resolveVariable)(column.name, option),
            data: (0, helper_1.createObject)(data, option)
        });
    };
    BaseTransferRenderer.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options, selectedOptions = _a.selectedOptions, showArrow = _a.showArrow, sortable = _a.sortable, selectMode = _a.selectMode, columns = _a.columns, loading = _a.loading, searchable = _a.searchable, searchResultMode = _a.searchResultMode, searchResultColumns = _a.searchResultColumns, deferLoad = _a.deferLoad, leftOptions = _a.leftOptions, leftMode = _a.leftMode, rightMode = _a.rightMode, disabled = _a.disabled, selectTitle = _a.selectTitle, resultTitle = _a.resultTitle, optionItemRender = _a.optionItemRender, resultItemRender = _a.resultItemRender;
        return (react_1.default.createElement("div", { className: cx('TransferControl', className) },
            react_1.default.createElement(Transfer_1.default, { value: selectedOptions, options: options, disabled: disabled, onChange: this.handleChange, option2value: this.option2value, sortable: sortable, showArrow: showArrow, selectMode: selectMode, searchResultMode: searchResultMode, searchResultColumns: searchResultColumns, columns: columns, onSearch: searchable ? this.handleSearch : undefined, onDeferLoad: deferLoad, leftOptions: leftOptions, leftMode: leftMode, rightMode: rightMode, cellRender: this.renderCell, selectTitle: selectTitle, resultTitle: resultTitle, optionItemRender: optionItemRender, resultItemRender: resultItemRender }),
            react_1.default.createElement(Spinner_1.default, { overlay: true, key: "info", show: loading })));
    };
    var _a, _b, _c, _d;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Options_2.Option !== "undefined" && Options_2.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "option2value", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, typeof (_c = typeof Function !== "undefined" && Function) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaseTransferRenderer.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_d = typeof Options_2.Option !== "undefined" && Options_2.Option) === "function" ? _d : Object, Number, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaseTransferRenderer.prototype, "renderCell", null);
    return BaseTransferRenderer;
}(react_1.default.Component));
exports.BaseTransferRenderer = BaseTransferRenderer;
// ts 3.9 里面非得这样才不报错，鬼知道为何。
var TransferRender = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TransferRender, _super);
    function TransferRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TransferRender;
}(BaseTransferRenderer));
exports.TransferRender = TransferRender;
exports.default = (0, Options_1.OptionsControl)({
    type: 'transfer'
})(TransferRender);
//# sourceMappingURL=./renderers/Form/Transfer.js.map
