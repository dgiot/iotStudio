"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var icons_1 = require("../components/icons");
var Pagination = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Pagination, _super);
    function Pagination() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            pageNum: String(_this.props.activePage) || ''
        };
        return _this;
    }
    Pagination.prototype.componentDidUpdate = function (prevProps) {
        var props = prevProps;
        if (prevProps.activePage !== props.activePage) {
            this.setState({
                pageNum: String(props.activePage) || ''
            });
        }
    };
    Pagination.prototype.renderSimple = function () {
        var _a = this.props, activePage = _a.activePage, hasNext = _a.hasNext, onPageChange = _a.onPageChange, cx = _a.classnames;
        return (react_1.default.createElement("ul", { className: cx('Pagination', 'Pagination--sm') },
            react_1.default.createElement("li", { className: cx({
                    'is-disabled': activePage < 2
                }), onClick: activePage < 2
                    ? function (e) { return e.preventDefault(); }
                    : function () { return onPageChange(activePage - 1); } },
                react_1.default.createElement("a", null,
                    react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }))),
            react_1.default.createElement("li", { className: cx({
                    'is-disabled': !hasNext
                }), onClick: !hasNext
                    ? function (e) { return e.preventDefault(); }
                    : function () { return onPageChange(activePage + 1); } },
                react_1.default.createElement("a", null,
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" })))));
    };
    Pagination.prototype.handlePageChange = function (e) {
        var lastPage = this.props.lastPage;
        var value = e.currentTarget.value;
        if (/^\d+$/.test(value) && parseInt(value, 10) > lastPage) {
            value = String(lastPage);
        }
        this.setState({ pageNum: value });
    };
    Pagination.prototype.renderNormal = function () {
        var _a = this.props, activePage = _a.activePage, lastPage = _a.lastPage, maxButtons = _a.maxButtons, onPageChange = _a.onPageChange, cx = _a.classnames, showPageInput = _a.showPageInput, className = _a.className, __ = _a.translate;
        var pageNum = this.state.pageNum;
        var pageButtons = [];
        var startPage;
        var endPage;
        if (activePage < (maxButtons - 1) / 2 + 2) {
            maxButtons = activePage + (maxButtons - 1) / 2;
        }
        if (lastPage - activePage < (maxButtons - 1) / 2 + 2) {
            maxButtons = lastPage - activePage + (maxButtons - 1) / 2 + 1;
        }
        if (maxButtons && maxButtons < lastPage) {
            startPage = Math.max(Math.min(activePage - Math.floor(maxButtons / 2), lastPage - maxButtons + 1), 1);
            endPage = startPage + maxButtons - 1;
        }
        else {
            startPage = 1;
            endPage = lastPage;
        }
        var _loop_1 = function (page) {
            pageButtons.push(react_1.default.createElement("li", { onClick: function () { return onPageChange(page); }, key: page, className: cx({
                    'is-active': page === activePage
                }) },
                react_1.default.createElement("a", { role: "button" }, page)));
        };
        for (var page = startPage; page <= endPage; ++page) {
            _loop_1(page);
        }
        if (startPage > 1) {
            if (startPage > 2) {
                pageButtons.unshift(react_1.default.createElement("li", { onClick: function () { return onPageChange(startPage - 1); }, key: "prev-ellipsis" },
                    react_1.default.createElement("a", { role: "button" }, "...")));
            }
            pageButtons.unshift(react_1.default.createElement("li", { onClick: function () { return onPageChange(1); }, key: 1, className: cx({
                    'is-active': 1 === activePage
                }) },
                react_1.default.createElement("a", { role: "button" }, 1)));
        }
        if (endPage < lastPage) {
            if (lastPage - endPage > 1) {
                pageButtons.push(react_1.default.createElement("li", { className: cx('Pagination-ellipsis'), onClick: function () { return onPageChange(endPage + 1); }, key: "next-ellipsis" },
                    react_1.default.createElement("a", { role: "button" },
                        react_1.default.createElement("span", null, "..."))));
            }
            pageButtons.push(react_1.default.createElement("li", { onClick: function () { return onPageChange(lastPage); }, key: lastPage, className: cx({
                    'is-active': lastPage === activePage
                }) },
                react_1.default.createElement("a", { role: "button" }, lastPage)));
        }
        pageButtons.unshift(react_1.default.createElement("li", { className: cx('Pagination-prev', {
                'is-disabled': activePage === 1
            }), onClick: activePage === 1
                ? function (e) { return e.preventDefault(); }
                : function () { return onPageChange(activePage - 1); }, key: "prev" },
            react_1.default.createElement("span", null,
                react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }))));
        pageButtons.push(react_1.default.createElement("li", { className: cx('Pagination-next', {
                'is-disabled': activePage === lastPage
            }), onClick: activePage === lastPage
                ? function (e) { return e.preventDefault(); }
                : function () { return onPageChange(activePage + 1); }, key: "next" },
            react_1.default.createElement("span", null,
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))));
        return (react_1.default.createElement("div", { className: cx('Pagination-wrap', className) },
            react_1.default.createElement("ul", { className: cx('Pagination', 'Pagination--sm') }, pageButtons),
            showPageInput === true || lastPage > 9 ? (react_1.default.createElement("div", { className: cx('Pagination-inputGroup'), key: "toPage" },
                __('CRUD.paginationGoText'),
                react_1.default.createElement("input", { type: "text", onChange: this.handlePageChange, onFocus: function (e) { return e.currentTarget.select(); }, onKeyUp: function (e) {
                        return e.keyCode == 13 &&
                            onPageChange(parseInt(e.currentTarget.value, 10));
                    }, value: pageNum }),
                __('CRUD.paginationPageText'))) : null));
    };
    Pagination.prototype.render = function () {
        var mode = this.props.mode;
        return mode === 'simple' ? this.renderSimple() : this.renderNormal();
    };
    var _a;
    Pagination.defaultProps = {
        activePage: 1,
        lastPage: 1,
        maxButtons: 5,
        mode: 'normal',
        hasNext: false,
        showPageInput: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Pagination.prototype, "handlePageChange", null);
    return Pagination;
}(react_1.default.Component));
exports.default = Pagination;
var PaginationRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PaginationRenderer, _super);
    function PaginationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaginationRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:pagination|pager)$/,
            name: 'pagination'
        })
    ], PaginationRenderer);
    return PaginationRenderer;
}(Pagination));
exports.PaginationRenderer = PaginationRenderer;
//# sourceMappingURL=./renderers/Pagination.js.map
