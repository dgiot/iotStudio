"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCell = exports.TableRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var factory_1 = require("../../factory");
var forEach_1 = (0, tslib_1.__importDefault)(require("lodash/forEach"));
var tpl_1 = require("../../utils/tpl");
var DropDownButton_1 = (0, tslib_1.__importDefault)(require("../DropDownButton"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var Button_1 = (0, tslib_1.__importDefault)(require("../../components/Button"));
var table_1 = require("../../store/table");
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var resize_sensor_1 = require("../../utils/resize-sensor");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var icons_1 = require("../../components/icons");
var TableCell_1 = require("./TableCell");
Object.defineProperty(exports, "TableCell", { enumerable: true, get: function () { return TableCell_1.TableCell; } });
var HeadCellFilterDropdown_1 = require("./HeadCellFilterDropdown");
var HeadCellSearchDropdown_1 = require("./HeadCellSearchDropdown");
var TableContent_1 = require("./TableContent");
var image_1 = require("../../utils/image");
var TableBody_1 = require("./TableBody");
var mobx_state_tree_1 = require("mobx-state-tree");
/**
 * 将 url 转成绝对地址
 */
var getAbsoluteUrl = (function () {
    var link;
    return function (url) {
        if (!link)
            link = document.createElement('a');
        link.href = url;
        return link.href;
    };
})();
var Table = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Table, _super);
    function Table(props) {
        var _this = _super.call(this, props) || this;
        _this.lastScrollLeft = -1;
        _this.totalWidth = 0;
        _this.totalHeight = 0;
        _this.outterWidth = 0;
        _this.outterHeight = 0;
        _this.widths = {};
        _this.widths2 = {};
        _this.heights = {};
        _this.renderedToolbars = [];
        _this.subForms = {};
        _this.handleOutterScroll = _this.handleOutterScroll.bind(_this);
        _this.affixDetect = _this.affixDetect.bind(_this);
        _this.updateTableInfoLazy = (0, debounce_1.default)(_this.updateTableInfo.bind(_this), 250, {
            trailing: true,
            leading: true
        });
        _this.tableRef = _this.tableRef.bind(_this);
        _this.affixedTableRef = _this.affixedTableRef.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.handleCheckAll = _this.handleCheckAll.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleSaveOrder = _this.handleSaveOrder.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.renderCell = _this.renderCell.bind(_this);
        _this.renderHeadCell = _this.renderHeadCell.bind(_this);
        _this.renderToolbar = _this.renderToolbar.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
        _this.subFormRef = _this.subFormRef.bind(_this);
        var store = props.store, columns = props.columns, selectable = props.selectable, columnsTogglable = props.columnsTogglable, draggable = props.draggable, orderBy = props.orderBy, orderDir = props.orderDir, multiple = props.multiple, footable = props.footable, primaryField = props.primaryField, itemCheckableOn = props.itemCheckableOn, itemDraggableOn = props.itemDraggableOn, hideCheckToggler = props.hideCheckToggler, combineFromIndex = props.combineFromIndex, expandConfig = props.expandConfig, formItem = props.formItem, keepItemSelectionOnPageChange = props.keepItemSelectionOnPageChange, maxKeepItemSelectionLength = props.maxKeepItemSelectionLength;
        var combineNum = props.combineNum;
        if (typeof combineNum === 'string') {
            combineNum = parseInt((0, tpl_builtin_1.resolveVariableAndFilter)(combineNum, props.data, '| raw'), 10);
        }
        store.update({
            selectable: selectable,
            draggable: draggable,
            columns: columns,
            columnsTogglable: columnsTogglable,
            orderBy: orderBy,
            orderDir: orderDir,
            multiple: multiple,
            footable: footable,
            expandConfig: expandConfig,
            primaryField: primaryField,
            itemCheckableOn: itemCheckableOn,
            itemDraggableOn: itemDraggableOn,
            hideCheckToggler: hideCheckToggler,
            combineNum: combineNum,
            combineFromIndex: combineFromIndex,
            keepItemSelectionOnPageChange: keepItemSelectionOnPageChange,
            maxKeepItemSelectionLength: maxKeepItemSelectionLength
        });
        formItem && (0, mobx_state_tree_1.isAlive)(formItem) && formItem.setSubStore(store);
        Table.syncRows(store, _this.props, undefined) && _this.syncSelected();
        return _this;
    }
    Table.syncRows = function (store, props, prevProps) {
        var source = props.source;
        var value = props.value || props.items;
        var rows = [];
        var updateRows = false;
        if (Array.isArray(value) &&
            (!prevProps || (prevProps.value || prevProps.items) !== value)) {
            updateRows = true;
            rows = value;
        }
        else if (typeof source === 'string') {
            var resolved = (0, tpl_builtin_1.resolveVariableAndFilter)(source, props.data, '| raw');
            var prev = prevProps
                ? (0, tpl_builtin_1.resolveVariableAndFilter)(source, prevProps.data, '| raw')
                : null;
            if (prev && prev === resolved) {
                updateRows = false;
            }
            else if (Array.isArray(resolved)) {
                updateRows = true;
                rows = resolved;
            }
        }
        updateRows && store.initRows(rows, props.getEntryId, props.reUseRow);
        typeof props.selected !== 'undefined' &&
            store.updateSelected(props.selected, props.valueField);
        return updateRows;
    };
    Table.prototype.componentDidMount = function () {
        var parent = (0, helper_1.getScrollParent)((0, react_dom_1.findDOMNode)(this));
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        this.updateTableInfo();
        var dom = (0, react_dom_1.findDOMNode)(this);
        if (dom.closest('.modal-body')) {
            return;
        }
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
    };
    Table.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if ((0, helper_1.anyChanged)([
            'selectable',
            'columnsTogglable',
            'draggable',
            'orderBy',
            'orderDir',
            'multiple',
            'footable',
            'primaryField',
            'itemCheckableOn',
            'itemDraggableOn',
            'hideCheckToggler',
            'combineNum',
            'combineFromIndex',
            'expandConfig'
        ], prevProps, props)) {
            var combineNum = props.combineNum;
            if (typeof combineNum === 'string') {
                combineNum = parseInt((0, tpl_builtin_1.resolveVariableAndFilter)(combineNum, props.data, '| raw'), 10);
            }
            store.update({
                selectable: props.selectable,
                columnsTogglable: props.columnsTogglable,
                draggable: props.draggable,
                orderBy: props.orderBy,
                orderDir: props.orderDir,
                multiple: props.multiple,
                primaryField: props.primaryField,
                footable: props.footable,
                itemCheckableOn: props.itemCheckableOn,
                itemDraggableOn: props.itemDraggableOn,
                hideCheckToggler: props.hideCheckToggler,
                combineNum: combineNum,
                combineFromIndex: props.combineFromIndex,
                expandConfig: props.expandConfig
            });
        }
        if (prevProps.columns !== props.columns) {
            store.update({
                columns: props.columns
            });
        }
        if ((0, helper_1.anyChanged)(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && (0, tpl_builtin_1.isPureVariable)(props.source))))) {
            Table.syncRows(store, props, prevProps) && this.syncSelected();
        }
        else if ((0, helper_1.isArrayChildrenModified)(prevProps.selected, props.selected)) {
            store.updateSelected(props.selected || [], props.valueField);
            this.syncSelected();
        }
        this.updateTableInfoLazy();
    };
    Table.prototype.componentWillUnmount = function () {
        var formItem = this.props.formItem;
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
        this.updateTableInfoLazy.cancel();
        this.unSensor && this.unSensor();
        formItem && (0, mobx_state_tree_1.isAlive)(formItem) && formItem.setSubStore(null);
    };
    Table.prototype.subFormRef = function (form, x, y) {
        var quickEditFormRef = this.props.quickEditFormRef;
        quickEditFormRef && quickEditFormRef(form, x, y);
        this.subForms[x + "-" + y] = form;
        form && this.props.store.addForm(form.props.store, y);
    };
    Table.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // todo
        onAction(e, action, ctx);
    };
    Table.prototype.handleCheck = function (item, value, shift) {
        var store = this.props.store;
        if (shift) {
            store.toggleShift(item);
        }
        else {
            item.toggle();
        }
        this.syncSelected();
    };
    Table.prototype.handleCheckAll = function () {
        var store = this.props.store;
        store.toggleAll();
        this.syncSelected();
    };
    Table.prototype.handleQuickChange = function (item, values, saveImmediately, savePristine, resetOnFailed) {
        if (!(0, mobx_state_tree_1.isAlive)(item)) {
            return;
        }
        var _a = this.props, onSave = _a.onSave, onPristineChange = _a.onPristineChange, propsSaveImmediately = _a.saveImmediately, primaryField = _a.primaryField;
        item.change(values, savePristine);
        // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
        item.modified && this.syncSelected();
        if (savePristine) {
            onPristineChange === null || onPristineChange === void 0 ? void 0 : onPristineChange(item.data, item.path);
            return;
        }
        else if (!saveImmediately && !propsSaveImmediately) {
            return;
        }
        if (saveImmediately && saveImmediately.api) {
            this.props.onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api
            }, values);
            return;
        }
        if (!onSave) {
            return;
        }
        onSave(item.data, (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]), item.path, undefined, item.pristine, resetOnFailed);
    };
    Table.prototype.handleSave = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, store, onSave, primaryField, subForms, result, rows, rowIndexes, diff, unModifiedRows;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, store = _a.store, onSave = _a.onSave, primaryField = _a.primaryField;
                        if (!onSave || !store.modifiedRows.length) {
                            return [2 /*return*/];
                        }
                        subForms = [];
                        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms.push(_this.subForms[key]); });
                        if (!subForms.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(subForms.map(function (item) { return item.validate(); }))];
                    case 1:
                        result = _b.sent();
                        if (~result.indexOf(false)) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        rows = store.modifiedRows.map(function (item) { return item.data; });
                        rowIndexes = store.modifiedRows.map(function (item) { return item.path; });
                        diff = store.modifiedRows.map(function (item) {
                            return (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]);
                        });
                        unModifiedRows = store.rows
                            .filter(function (item) { return !item.modified; })
                            .map(function (item) { return item.data; });
                        onSave(rows, diff, rowIndexes, unModifiedRows, store.modifiedRows.map(function (item) { return item.pristine; }));
                        return [2 /*return*/];
                }
            });
        });
    };
    Table.prototype.handleSaveOrder = function () {
        var _a = this.props, store = _a.store, onSaveOrder = _a.onSaveOrder;
        if (!onSaveOrder || !store.movedRows.length) {
            return;
        }
        onSaveOrder(store.movedRows.map(function (item) { return item.data; }), store.rows.map(function (item) { return item.getDataWithModifiedChilden(); }));
    };
    Table.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(store.selectedRows.map(function (item) { return item.data; }), store.unSelectedRows.map(function (item) { return item.data; }));
    };
    Table.prototype.reset = function () {
        var _this = this;
        var store = this.props.store;
        store.reset();
        var subForms = [];
        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms.push(_this.subForms[key]); });
        subForms.forEach(function (item) { return item.clearErrors(); });
    };
    Table.prototype.bulkUpdate = function (value, items) {
        var _a = this.props, store = _a.store, primaryField = _a.primaryField;
        if (primaryField && value.ids) {
            var ids_1 = value.ids.split(',');
            var rows = store.rows.filter(function (item) {
                return (0, find_1.default)(ids_1, function (id) { return id && id == item.data[primaryField]; });
            });
            var newValue_1 = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), { ids: undefined });
            rows.forEach(function (row) { return row.change(newValue_1); });
        }
        else {
            var rows = store.rows.filter(function (item) { return ~items.indexOf(item.pristine); });
            rows.forEach(function (row) { return row.change(value); });
        }
    };
    Table.prototype.getSelected = function () {
        var store = this.props.store;
        return store.selectedRows.map(function (item) { return item.data; });
    };
    Table.prototype.affixDetect = function () {
        var _a, _b, _c, _d;
        if (!this.props.affixHeader || !this.table) {
            return;
        }
        var ns = this.props.classPrefix;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var clip = this.table.getBoundingClientRect();
        var offsetY = (_b = (_a = this.props.affixOffsetTop) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
        var headingHeight = ((_c = dom.querySelector("." + ns + "Table-heading")) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().height) || 0;
        var headerHeight = ((_d = dom.querySelector("." + ns + "Table-headToolbar")) === null || _d === void 0 ? void 0 : _d.getBoundingClientRect().height) || 0;
        var affixed = clip.top - headerHeight - headingHeight < offsetY &&
            clip.top + clip.height - 40 > offsetY;
        var affixedDom = dom.querySelector("." + ns + "Table-fixedTop");
        affixedDom.style.cssText += "top: " + offsetY + "px;width: " + this.table.parentNode.offsetWidth + "px";
        affixed
            ? affixedDom.classList.add('in')
            : affixedDom.classList.remove('in');
        // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
    };
    Table.prototype.updateTableInfo = function () {
        if (!this.table) {
            return;
        }
        var table = this.table;
        var outter = table.parentNode;
        var affixHeader = this.props.affixHeader;
        var ns = this.props.classPrefix;
        // 完成宽高都没有变化就直接跳过了。
        // if (this.totalWidth === table.scrollWidth && this.totalHeight === table.scrollHeight) {
        //     return;
        // }
        this.totalWidth = table.scrollWidth;
        this.totalHeight = table.scrollHeight;
        this.outterWidth = outter.offsetWidth;
        this.outterHeight = outter.offsetHeight;
        var widths = (this.widths = {});
        var widths2 = (this.widths2 = {});
        var heights = (this.heights = {});
        heights.header = table
            .querySelector('thead>tr:last-child')
            .getBoundingClientRect().height;
        heights.header2 = table
            .querySelector('thead>tr:first-child')
            .getBoundingClientRect().height;
        (0, forEach_1.default)(table.querySelectorAll('thead>tr:last-child>th'), function (item) {
            widths[item.getAttribute('data-index')] =
                item.getBoundingClientRect().width;
        });
        (0, forEach_1.default)(table.querySelectorAll('thead>tr:first-child>th'), function (item) {
            widths2[item.getAttribute('data-index')] =
                item.getBoundingClientRect().width;
        });
        (0, forEach_1.default)(table.querySelectorAll('tbody>tr>*:last-child'), function (item, index) {
            return (heights[index] = item.getBoundingClientRect().height);
        });
        // 让 react 去更新非常慢，还是手动更新吧。
        var dom = (0, react_dom_1.findDOMNode)(this);
        (0, forEach_1.default)(
        // 折叠 footTable 不需要改变
        dom.querySelectorAll("." + ns + "Table-fixedTop table, ." + ns + "Table-fixedLeft>table, ." + ns + "Table-fixedRight>table"), function (table) {
            var totalWidth = 0;
            var totalWidth2 = 0;
            (0, forEach_1.default)(table.querySelectorAll('thead>tr:last-child>th'), function (item) {
                var width = widths[item.getAttribute('data-index')];
                item.style.cssText += "width: " + width + "px; height: " + heights.header + "px";
                totalWidth += width;
            });
            (0, forEach_1.default)(table.querySelectorAll('thead>tr:first-child>th'), function (item) {
                var width = widths2[item.getAttribute('data-index')];
                item.style.cssText += "width: " + width + "px; height: " + heights.header2 + "px";
                totalWidth2 += width;
            });
            (0, forEach_1.default)(table.querySelectorAll('colgroup>col'), function (item) {
                var width = widths[item.getAttribute('data-index')];
                item.setAttribute('width', "" + width);
            });
            (0, forEach_1.default)(table.querySelectorAll('tbody>tr'), function (item, index) {
                item.style.cssText += "height: " + heights[index] + "px";
            });
            table.style.cssText += "width: " + Math.max(totalWidth, totalWidth2) + "px;table-layout: auto;";
        });
        if (affixHeader) {
            dom.querySelector("." + ns + "Table-fixedTop>." + ns + "Table-wrapper").style.cssText += "width: " + this.outterWidth + "px";
        }
        this.lastScrollLeft = -1;
        this.handleOutterScroll();
    };
    Table.prototype.handleOutterScroll = function () {
        var outter = this.table.parentNode;
        var scrollLeft = outter.scrollLeft;
        if (scrollLeft === this.lastScrollLeft) {
            return;
        }
        this.lastScrollLeft = scrollLeft;
        var leading = scrollLeft === 0;
        var trailing = Math.ceil(scrollLeft) + this.outterWidth >= this.totalWidth;
        // console.log(scrollLeft, store.outterWidth, store.totalWidth, (scrollLeft + store.outterWidth) === store.totalWidth);
        // store.setLeading(leading);
        // store.setTrailing(trailing);
        var ns = this.props.classPrefix;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var fixedLeft = dom.querySelectorAll("." + ns + "Table-fixedLeft");
        if (fixedLeft && fixedLeft.length) {
            for (var i = 0, len = fixedLeft.length; i < len; i++) {
                var node = fixedLeft[i];
                leading ? node.classList.remove('in') : node.classList.add('in');
            }
        }
        var fixedRight = dom.querySelectorAll("." + ns + "Table-fixedRight");
        if (fixedRight && fixedRight.length) {
            for (var i = 0, len = fixedRight.length; i < len; i++) {
                var node = fixedRight[i];
                trailing ? node.classList.remove('in') : node.classList.add('in');
            }
        }
        var table = this.affixedTable;
        if (table) {
            table.style.cssText += "transform: translateX(-" + scrollLeft + "px)";
        }
    };
    Table.prototype.tableRef = function (ref) {
        this.table = ref;
        if (ref) {
            this.unSensor = (0, resize_sensor_1.resizeSensor)(ref.parentNode, this.updateTableInfoLazy);
        }
        else {
            this.unSensor && this.unSensor();
            delete this.unSensor;
        }
    };
    Table.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    Table.prototype.affixedTableRef = function (ref) {
        this.affixedTable = ref;
    };
    Table.prototype.initDragging = function () {
        var store = this.props.store;
        var ns = this.props.classPrefix;
        this.sortable = new sortablejs_1.default(this.table.querySelector('tbody'), {
            group: 'table',
            animation: 150,
            handle: "." + ns + "Table-dragCell",
            ghostClass: 'is-dragging',
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                store.exchange(e.oldIndex, e.newIndex);
            }
        });
    };
    Table.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    Table.prototype.getPopOverContainer = function () {
        return (0, react_dom_1.findDOMNode)(this);
    };
    Table.prototype.handleMouseMove = function (e) {
        var tr = e.target.closest('tr[data-index]');
        if (!tr) {
            return;
        }
        var _a = this.props, store = _a.store, affixColumns = _a.affixColumns, itemActions = _a.itemActions;
        if ((affixColumns === false ||
            (store.leftFixedColumns.length === 0 &&
                store.rightFixedColumns.length === 0)) &&
            (!itemActions || !itemActions.filter(function (item) { return !item.hiddenOnHover; }).length)) {
            return;
        }
        var index = parseInt(tr.getAttribute('data-index'), 10);
        if (store.hoverIndex === index) {
            return;
        }
        store.rows.forEach(function (item, key) { return item.setIsHover(index === key); });
    };
    Table.prototype.handleMouseLeave = function () {
        var store = this.props.store;
        if (~store.hoverIndex) {
            store.rows[store.hoverIndex].setIsHover(false);
        }
    };
    Table.prototype.handleDragStart = function (e) {
        var store = this.props.store;
        var target = e.currentTarget;
        var tr = (this.draggingTr = target.closest('tr'));
        var id = tr.getAttribute('data-id');
        var tbody = tr.parentNode;
        this.originIndex = Array.prototype.indexOf.call(tbody.childNodes, tr);
        tr.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.setDragImage(tr, 0, 0);
        var item = store.getRowById(id);
        store.collapseAllAtDepth(item.depth);
        var siblings = store.rows;
        if (item.parentId) {
            var parent = store.getRowById(item.parentId);
            siblings = parent.children;
        }
        siblings = siblings.filter(function (sibling) { return sibling !== item; });
        tbody.addEventListener('dragover', this.handleDragOver);
        tbody.addEventListener('drop', this.handleDrop);
        this.draggingSibling = siblings.map(function (item) {
            var tr = tbody.querySelector("tr[data-id=\"" + item.id + "\"]");
            tr.classList.add('is-drop-allowed');
            return tr;
        });
        tr.addEventListener('dragend', this.handleDragEnd);
    };
    Table.prototype.handleDragOver = function (e) {
        if (!e.target) {
            return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        var overTr = e.target.closest('tr');
        if (!overTr ||
            !~overTr.className.indexOf('is-drop-allowed') ||
            overTr === this.draggingTr) {
            return;
        }
        var tbody = overTr.parentElement;
        var dRect = this.draggingTr.getBoundingClientRect();
        var tRect = overTr.getBoundingClientRect();
        var ratio = dRect.top < tRect.top ? 0.1 : 0.9;
        var next = (e.clientY - tRect.top) / (tRect.bottom - tRect.top) > ratio;
        tbody.insertBefore(this.draggingTr, (next && overTr.nextSibling) || overTr);
    };
    Table.prototype.handleDrop = function () {
        var store = this.props.store;
        var tr = this.draggingTr;
        var tbody = tr.parentElement;
        var index = Array.prototype.indexOf.call(tbody.childNodes, tr);
        var item = store.getRowById(tr.getAttribute('data-id'));
        // destroy
        this.handleDragEnd();
        store.exchange(this.originIndex, index, item);
    };
    Table.prototype.handleDragEnd = function () {
        var tr = this.draggingTr;
        var tbody = tr.parentElement;
        var index = Array.prototype.indexOf.call(tbody.childNodes, tr);
        tbody.insertBefore(tr, tbody.childNodes[index < this.originIndex ? this.originIndex + 1 : this.originIndex]);
        tr.classList.remove('is-dragging');
        tr.removeEventListener('dragend', this.handleDragEnd);
        tbody.removeEventListener('dragover', this.handleDragOver);
        tbody.removeEventListener('drop', this.handleDrop);
        this.draggingSibling.forEach(function (item) {
            return item.classList.remove('is-drop-allowed');
        });
    };
    Table.prototype.handleImageEnlarge = function (info, target) {
        var onImageEnlarge = this.props.onImageEnlarge;
        // 如果已经是多张了，直接跳过
        if (Array.isArray(info.list)) {
            return onImageEnlarge && onImageEnlarge(info, target);
        }
        // 从列表中收集所有图片，然后作为一个图片集合派送出去。
        var store = this.props.store;
        var column = store.columns[target.colIndex].pristine;
        var index = target.rowIndex;
        var list = [];
        store.rows.forEach(function (row, i) {
            var src = (0, tpl_builtin_1.resolveVariable)(column.name, row.data);
            if (!src) {
                if (i < target.rowIndex) {
                    index--;
                }
                return;
            }
            list.push({
                src: src,
                originalSrc: column.originalSrc
                    ? (0, tpl_1.filter)(column.originalSrc, row.data)
                    : src,
                title: column.enlargeTitle
                    ? (0, tpl_1.filter)(column.enlargeTitle, row.data)
                    : column.title
                        ? (0, tpl_1.filter)(column.title, row.data)
                        : undefined,
                caption: column.enlargeCaption
                    ? (0, tpl_1.filter)(column.enlargeCaption, row.data)
                    : column.caption
                        ? (0, tpl_1.filter)(column.caption, row.data)
                        : undefined
            });
        });
        if (list.length > 1) {
            onImageEnlarge &&
                onImageEnlarge((0, tslib_1.__assign)((0, tslib_1.__assign)({}, info), { list: list, index: index }), target);
        }
        else {
            onImageEnlarge && onImageEnlarge(info, target);
        }
    };
    // 开始列宽度调整
    Table.prototype.handleColResizeMouseDown = function (e) {
        this.lineStartX = e.clientX;
        var currentTarget = e.currentTarget;
        this.resizeLine = currentTarget;
        this.resizeLineLeft = parseInt(getComputedStyle(this.resizeLine).getPropertyValue('left'), 10);
        this.targetTh = this.resizeLine.parentElement;
        this.targetThWidth = this.targetTh.getBoundingClientRect().width;
        document.addEventListener('mousemove', this.handleColResizeMouseMove);
        document.addEventListener('mouseup', this.handleColResizeMouseUp);
    };
    // 垂直线拖拽移动
    Table.prototype.handleColResizeMouseMove = function (e) {
        var moveX = e.clientX - this.lineStartX;
        this.resizeLine.style.left = this.resizeLineLeft + moveX + 'px';
        this.targetTh.style.width = this.targetThWidth + moveX + 'px';
    };
    // 垂直线拖拽结束
    Table.prototype.handleColResizeMouseUp = function (e) {
        document.removeEventListener('mousemove', this.handleColResizeMouseMove);
        document.removeEventListener('mouseup', this.handleColResizeMouseUp);
    };
    Table.prototype.renderHeading = function () {
        var _a = this.props, title = _a.title, store = _a.store, hideQuickSaveBtn = _a.hideQuickSaveBtn, data = _a.data, cx = _a.classnames, saveImmediately = _a.saveImmediately, headingClassName = _a.headingClassName, quickSaveApi = _a.quickSaveApi, __ = _a.translate;
        if (title ||
            (quickSaveApi &&
                !saveImmediately &&
                store.modified &&
                !hideQuickSaveBtn) ||
            store.moved) {
            return (react_1.default.createElement("div", { className: cx('Table-heading', headingClassName), key: "heading" }, !saveImmediately && store.modified && !hideQuickSaveBtn ? (react_1.default.createElement("span", null,
                __('Table.modified', {
                    modified: store.modified
                }),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSave },
                    react_1.default.createElement(icons_1.Icon, { icon: "check", className: "icon m-r-xs" }),
                    __('Form.submit')),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon m-r-xs" }),
                    __('Table.discard')))) : store.moved ? (react_1.default.createElement("span", null,
                __('Table.moved', {
                    moved: store.moved
                }),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSaveOrder },
                    react_1.default.createElement(icons_1.Icon, { icon: "check", className: "icon m-r-xs" }),
                    __('Form.submit')),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon m-r-xs" }),
                    __('Table.discard')))) : title ? ((0, tpl_1.filter)(title, data)) : ('')));
        }
        return null;
    };
    Table.prototype.renderHeadCell = function (column, props) {
        var _a = this.props, store = _a.store, query = _a.query, onQuery = _a.onQuery, multiple = _a.multiple, env = _a.env, render = _a.render, ns = _a.classPrefix, resizable = _a.resizable, cx = _a.classnames;
        if (column.type === '__checkme') {
            return (react_1.default.createElement("th", (0, tslib_1.__assign)({}, props, { className: cx(column.pristine.className) }), store.rows.length && multiple ? (react_1.default.createElement(Checkbox_1.default, { classPrefix: ns, partial: !store.allChecked, checked: store.someChecked, disabled: store.disabledHeadCheckbox, onChange: this.handleCheckAll })) : ('\u00A0')));
        }
        else if (column.type === '__dragme') {
            return react_1.default.createElement("th", (0, tslib_1.__assign)({}, props, { className: cx(column.pristine.className) }));
        }
        else if (column.type === '__expandme') {
            return (react_1.default.createElement("th", (0, tslib_1.__assign)({}, props, { className: cx(column.pristine.className) }), (store.footable &&
                (store.footable.expandAll === false || store.footable.accordion)) ||
                (store.expandConfig &&
                    (store.expandConfig.expandAll === false ||
                        store.expandConfig.accordion)) ? null : (react_1.default.createElement("a", { className: cx('Table-expandBtn', store.allExpanded ? 'is-active' : ''), 
                // data-tooltip="展开/收起全部"
                // data-position="top"
                onClick: store.toggleExpandAll },
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" })))));
        }
        var affix = null;
        if (column.searchable && column.name) {
            affix = (react_1.default.createElement(HeadCellSearchDropdown_1.HeadCellSearchDropDown, (0, tslib_1.__assign)({}, this.props, { onQuery: onQuery, name: column.name, searchable: column.searchable, sortable: column.sortable, type: column.type, data: query, orderBy: store.orderBy, orderDir: store.orderDir, popOverContainer: this.getPopOverContainer })));
        }
        else if (column.sortable && column.name) {
            affix = (react_1.default.createElement("span", { className: cx('TableCell-sortBtn'), onClick: function () {
                    if (column.name === store.orderBy) {
                        if (store.orderDir === 'desc') {
                            // 降序之后取消排序
                            store.setOrderByInfo('', 'asc');
                        }
                        else {
                            // 升序之后降序
                            store.setOrderByInfo(column.name, 'desc');
                        }
                    }
                    else {
                        store.setOrderByInfo(column.name, 'asc');
                    }
                    onQuery &&
                        onQuery({
                            orderBy: store.orderBy,
                            orderDir: store.orderDir
                        });
                } },
                react_1.default.createElement("i", { className: cx('TableCell-sortBtn--down', store.orderBy === column.name && store.orderDir === 'desc'
                        ? 'is-active'
                        : '') },
                    react_1.default.createElement(icons_1.Icon, { icon: "sort-desc", className: "icon" })),
                react_1.default.createElement("i", { className: cx('TableCell-sortBtn--up', store.orderBy === column.name && store.orderDir === 'asc'
                        ? 'is-active'
                        : '') },
                    react_1.default.createElement(icons_1.Icon, { icon: "sort-asc", className: "icon" })),
                react_1.default.createElement("i", { className: cx('TableCell-sortBtn--default', store.orderBy === column.name ? '' : 'is-active') },
                    react_1.default.createElement(icons_1.Icon, { icon: "sort-default", className: "icon" }))));
        }
        else if (column.filterable && column.name) {
            affix = (react_1.default.createElement(HeadCellFilterDropdown_1.HeadCellFilterDropDown, (0, tslib_1.__assign)({}, this.props, { onQuery: onQuery, name: column.name, type: column.type, data: query, filterable: column.filterable, popOverContainer: this.getPopOverContainer })));
        }
        if (column.pristine.width) {
            props.style = props.style || {};
            props.style.width = column.pristine.width;
        }
        if (column.pristine.align) {
            props.style = props.style || {};
            props.style.textAlign = column.pristine.align;
        }
        var resizeLine = (react_1.default.createElement("div", { className: cx('Table-content-colDragLine'), key: "resize-" + column.index, onMouseDown: this.handleColResizeMouseDown }));
        return (react_1.default.createElement("th", (0, tslib_1.__assign)({}, props, { className: cx(props ? props.className : '', {
                'TableCell--sortable': column.sortable,
                'TableCell--searchable': column.searchable,
                'TableCell--filterable': column.filterable,
                'Table-operationCell': column.type === 'operation'
            }) }),
            react_1.default.createElement("div", { className: cx(ns + "TableCell--title", column.pristine.className, column.pristine.labelClassName) },
                column.label ? render('tpl', column.label) : null,
                column.remark
                    ? render('remark', {
                        type: 'remark',
                        tooltip: column.remark,
                        container: env && env.getModalContainer
                            ? env.getModalContainer
                            : undefined
                    })
                    : null),
            affix,
            resizable === false ? null : resizeLine));
    };
    Table.prototype.renderCell = function (region, column, item, props, ignoreDrag) {
        if (ignoreDrag === void 0) { ignoreDrag = false; }
        var _a = this.props, render = _a.render, store = _a.store, multiple = _a.multiple, ns = _a.classPrefix, cx = _a.classnames, checkOnItemClick = _a.checkOnItemClick, popOverContainer = _a.popOverContainer, canAccessSuperData = _a.canAccessSuperData;
        if (column.name && item.rowSpans[column.name] === 0) {
            return null;
        }
        if (column.type === '__checkme') {
            return (react_1.default.createElement("td", { key: props.key, className: cx(column.pristine.className) },
                react_1.default.createElement(Checkbox_1.default, { classPrefix: ns, type: multiple ? 'checkbox' : 'radio', checked: item.checked, disabled: item.checkdisable, onChange: checkOnItemClick ? helper_1.noop : this.handleCheck.bind(this, item) })));
        }
        else if (column.type === '__dragme') {
            return (react_1.default.createElement("td", { key: props.key, className: cx(column.pristine.className) }, item.draggable ? react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }) : null));
        }
        else if (column.type === '__expandme') {
            return (react_1.default.createElement("td", { key: props.key, className: cx(column.pristine.className) },
                item.depth > 2
                    ? Array.from({ length: item.depth - 2 }).map(function (_, index) { return (react_1.default.createElement("i", { key: index, className: cx('Table-divider-' + (index + 1)) })); })
                    : null,
                item.expandable ? (react_1.default.createElement("a", { className: cx('Table-expandBtn', item.expanded ? 'is-active' : ''), 
                    // data-tooltip="展开/收起"
                    // data-position="top"
                    onClick: item.toggleExpanded },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" }))) : null));
        }
        var prefix = null;
        if (!ignoreDrag &&
            column.isPrimary &&
            store.isNested &&
            store.draggable &&
            item.draggable) {
            prefix = (react_1.default.createElement("a", { draggable: true, onDragStart: this.handleDragStart, className: cx('Table-dragBtn') },
                react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" })));
        }
        var subProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), { btnDisabled: store.dragging, data: item.locals, value: column.name
                ? (0, tpl_builtin_1.resolveVariable)(column.name, canAccessSuperData ? item.locals : item.data)
                : column.value, popOverContainer: popOverContainer || this.getPopOverContainer, rowSpan: item.rowSpans[column.name], quickEditFormRef: this.subFormRef, prefix: prefix, onImageEnlarge: this.handleImageEnlarge, canAccessSuperData: canAccessSuperData });
        delete subProps.label;
        return render(region, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column.pristine), { column: column.pristine, type: 'cell' }), subProps);
    };
    Table.prototype.renderAffixHeader = function (tableClassName) {
        var _this = this;
        var _a = this.props, store = _a.store, affixHeader = _a.affixHeader, render = _a.render, cx = _a.classnames;
        var hideHeader = store.filteredColumns.every(function (column) { return !column.label; });
        var columnsGroup = store.columnGroup;
        return affixHeader ? (react_1.default.createElement("div", { className: cx('Table-fixedTop', {
                'is-fakeHide': hideHeader
            }) },
            this.renderHeader(false),
            this.renderHeading(),
            react_1.default.createElement("div", { className: cx('Table-fixedLeft') }, store.leftFixedColumns.length
                ? this.renderFixedColumns(store.rows, store.leftFixedColumns, true, tableClassName)
                : null),
            react_1.default.createElement("div", { className: cx('Table-fixedRight') }, store.rightFixedColumns.length
                ? this.renderFixedColumns(store.rows, store.rightFixedColumns, true, tableClassName)
                : null),
            react_1.default.createElement("div", { className: cx('Table-wrapper') },
                react_1.default.createElement("table", { ref: this.affixedTableRef, className: tableClassName },
                    react_1.default.createElement("colgroup", null, store.filteredColumns.map(function (column) { return (react_1.default.createElement("col", { key: column.index, "data-index": column.index })); })),
                    react_1.default.createElement("thead", null,
                        columnsGroup.length ? (react_1.default.createElement("tr", null, columnsGroup.map(function (item, index) { return (react_1.default.createElement("th", { key: index, "data-index": item.index, colSpan: item.colSpan, rowSpan: item.rowSpan }, item.label ? render('tpl', item.label) : null)); }))) : null,
                        react_1.default.createElement("tr", null, store.filteredColumns.map(function (column) {
                            var _a;
                            return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                                ? null
                                : _this.renderHeadCell(column, {
                                    'key': column.index,
                                    'data-index': column.index
                                });
                        }))))))) : null;
    };
    Table.prototype.renderFixedColumns = function (rows, columns, headerOnly, tableClassName) {
        var _this = this;
        if (headerOnly === void 0) { headerOnly = false; }
        if (tableClassName === void 0) { tableClassName = ''; }
        var _a = this.props, placeholder = _a.placeholder, store = _a.store, cx = _a.classnames, render = _a.render, data = _a.data, translate = _a.translate, locale = _a.locale, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, rowClassNameExpr = _a.rowClassNameExpr, rowClassName = _a.rowClassName, itemAction = _a.itemAction;
        var hideHeader = store.filteredColumns.every(function (column) { return !column.label; });
        var columnsGroup = store.columnGroup;
        return (react_1.default.createElement("table", { className: cx('Table-table', store.combineNum > 0 ? 'Table-table--withCombine' : '', tableClassName) },
            react_1.default.createElement("thead", null,
                columnsGroup.length ? (react_1.default.createElement("tr", null, columnsGroup.map(function (item, index) {
                    var renderColumns = columns.filter(function (a) { return ~item.has.indexOf(a); });
                    return renderColumns.length ? (react_1.default.createElement("th", { key: index, "data-index": item.index, colSpan: renderColumns.length, rowSpan: item.rowSpan }, item.label)) : null;
                }))) : null,
                react_1.default.createElement("tr", { className: hideHeader ? 'fake-hide' : '' }, columns.map(function (column) {
                    var _a;
                    return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                        ? null
                        : _this.renderHeadCell(column, {
                            'key': column.index,
                            'data-index': column.index
                        });
                }))),
            headerOnly ? null : !rows.length ? (react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", { className: cx('Table-placeholder') },
                    react_1.default.createElement("td", { colSpan: columns.length }, render('placeholder', translate(placeholder || 'placeholder.noData')))))) : (react_1.default.createElement(TableBody_1.TableBody, { tableClassName: cx(store.combineNum > 0 ? 'Table-table--withCombine' : '', tableClassName), itemAction: itemAction, classnames: cx, render: render, renderCell: this.renderCell, onCheck: this.handleCheck, onQuickChange: store.dragging ? undefined : this.handleQuickChange, footable: store.footable, ignoreFootableContent: true, footableColumns: store.footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: this.handleAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, columns: columns, rows: rows, locale: locale, translate: translate, rowsProps: {
                    regionPrefix: 'fixed/',
                    renderCell: function (region, column, item, props) { return _this.renderCell(region, column, item, props, true); }
                } }))));
    };
    Table.prototype.renderToolbar = function (toolbar) {
        var type = toolbar.type || toolbar;
        if (type === 'columns-toggler') {
            this.renderedToolbars.push(type);
            return this.renderColumnsToggler(toolbar);
        }
        else if (type === 'drag-toggler') {
            this.renderedToolbars.push(type);
            return this.renderDragToggler();
        }
        else if (type === 'export-excel') {
            this.renderedToolbars.push(type);
            return this.renderExportExcel(toolbar);
        }
        return void 0;
    };
    Table.prototype.renderColumnsToggler = function (config) {
        var _a = this.props, className = _a.className, store = _a.store, ns = _a.classPrefix, cx = _a.classnames, rest = (0, tslib_1.__rest)(_a, ["className", "store", "classPrefix", "classnames"]);
        var __ = rest.translate;
        var env = rest.env;
        var render = this.props.render;
        if (!store.columnsTogglable) {
            return null;
        }
        return (react_1.default.createElement(DropDownButton_1.default, (0, tslib_1.__assign)({}, rest, { tooltip: __('Table.columnsVisibility'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, align: config ? config.align : 'left', isActived: store.hasColumnHidden(), classnames: cx, classPrefix: ns, key: "columns-toggable", size: "sm", label: react_1.default.createElement(icons_1.Icon, { icon: "columns", className: "icon m-r-none" }) }), store.toggableColumns.map(function (column) { return (react_1.default.createElement("li", { className: cx('DropDown-menuItem'), key: column.index, onClick: column.toggleToggle },
            react_1.default.createElement(Checkbox_1.default, { size: "sm", classPrefix: ns, checked: column.toggled }, column.label ? render('tpl', column.label) : null))); })));
    };
    Table.prototype.renderDragToggler = function () {
        var _a = this.props, store = _a.store, env = _a.env, draggable = _a.draggable, ns = _a.classPrefix, __ = _a.translate;
        if (!draggable || store.isNested) {
            return null;
        }
        return (react_1.default.createElement(Button_1.default, { disabled: !!store.modified, classPrefix: ns, key: "dragging-toggle", tooltip: __('Table.startSort'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, size: "sm", active: store.dragging, onClick: function (e) {
                e.preventDefault();
                store.toggleDragging();
                store.dragging && store.clear();
            }, iconOnly: true },
            react_1.default.createElement(icons_1.Icon, { icon: "exchange", className: "icon" })));
    };
    Table.prototype.renderExportExcel = function (toolbar) {
        var _this = this;
        var _a = this.props, store = _a.store, env = _a.env, ns = _a.classPrefix, cx = _a.classnames, __ = _a.translate, columns = _a.columns, data = _a.data;
        if (!columns) {
            return null;
        }
        return (react_1.default.createElement(Button_1.default, { classPrefix: ns, onClick: function () {
                Promise.resolve().then(function () { return new Promise(function(resolve){require(['exceljs'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (ExcelJS) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    var rows, tmpStore, filename, res, workbook, worksheet, filteredColumns, firstRowLabels, firstRow, remoteMappingCache, rowIndex, _i, rows_1, row, sheetRow, columIndex, _a, filteredColumns_1, column, name, value, type, imageData, imageDimensions, imageWidth, imageHeight, imageMaxSize, imageMatch, imageExt, imageId, linkURL, e_1, linkURL, map, source, sourceValue, mapKey, res, viewValue, buffer, blob;
                    var _b, _c;
                    return (0, tslib_1.__generator)(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                rows = [];
                                filename = 'data';
                                if (!(typeof toolbar === 'object' && toolbar.api)) return [3 /*break*/, 2];
                                return [4 /*yield*/, env.fetcher(toolbar.api, data)];
                            case 1:
                                res = _d.sent();
                                if (!res.data) {
                                    env.notify('warning', __('placeholder.noData'));
                                    return [2 /*return*/];
                                }
                                if (Array.isArray(res.data)) {
                                    rows = res.data;
                                }
                                else {
                                    rows = res.data.rows || res.data.items;
                                }
                                // 因为很多方法是 store 里的，所以需要构建 store 来处理
                                tmpStore = table_1.TableStore.create((0, mobx_state_tree_1.getSnapshot)(store));
                                tmpStore.initRows(rows);
                                rows = tmpStore.rows;
                                return [3 /*break*/, 3];
                            case 2:
                                rows = store.rows;
                                _d.label = 3;
                            case 3:
                                if (typeof toolbar === 'object' && toolbar.filename) {
                                    filename = (0, tpl_1.filter)(toolbar.filename, data, '| raw');
                                }
                                if (rows.length === 0) {
                                    env.notify('warning', __('placeholder.noData'));
                                    return [2 /*return*/];
                                }
                                workbook = new ExcelJS.Workbook();
                                worksheet = workbook.addWorksheet('sheet', {
                                    properties: { defaultColWidth: 15 }
                                });
                                worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
                                filteredColumns = toolbar.columns
                                    ? columns.filter(function (column) {
                                        var filterColumnsNames = toolbar.columns;
                                        if (filterColumnsNames.indexOf(column.name) !== -1) {
                                            return true;
                                        }
                                        return false;
                                    })
                                    : columns;
                                firstRowLabels = filteredColumns.map(function (column) {
                                    return column.label;
                                });
                                firstRow = worksheet.getRow(1);
                                firstRow.values = firstRowLabels;
                                worksheet.autoFilter = {
                                    from: {
                                        row: 1,
                                        column: 1
                                    },
                                    to: {
                                        row: 1,
                                        column: firstRowLabels.length
                                    }
                                };
                                remoteMappingCache = {};
                                rowIndex = 1;
                                _i = 0, rows_1 = rows;
                                _d.label = 4;
                            case 4:
                                if (!(_i < rows_1.length)) return [3 /*break*/, 19];
                                row = rows_1[_i];
                                rowIndex += 1;
                                sheetRow = worksheet.getRow(rowIndex);
                                columIndex = 0;
                                _a = 0, filteredColumns_1 = filteredColumns;
                                _d.label = 5;
                            case 5:
                                if (!(_a < filteredColumns_1.length)) return [3 /*break*/, 18];
                                column = filteredColumns_1[_a];
                                columIndex += 1;
                                name = column.name;
                                value = (0, helper_1.getVariable)(row.data, name);
                                if (typeof value === 'undefined' &&
                                    !column.tpl) {
                                    return [3 /*break*/, 17];
                                }
                                // 处理合并单元格
                                if (name in row.rowSpans) {
                                    if (row.rowSpans[name] === 0) {
                                        return [3 /*break*/, 17];
                                    }
                                    else {
                                        // start row, start column, end row, end column
                                        worksheet.mergeCells(rowIndex, columIndex, rowIndex + row.rowSpans[name] - 1, columIndex);
                                    }
                                }
                                type = column.type || 'plain';
                                if (!(type === 'image' && value)) return [3 /*break*/, 11];
                                _d.label = 6;
                            case 6:
                                _d.trys.push([6, 9, , 10]);
                                return [4 /*yield*/, (0, image_1.toDataURL)(value)];
                            case 7:
                                imageData = _d.sent();
                                return [4 /*yield*/, (0, image_1.getImageDimensions)(imageData)];
                            case 8:
                                imageDimensions = _d.sent();
                                imageWidth = imageDimensions.width;
                                imageHeight = imageDimensions.height;
                                imageMaxSize = 100;
                                if (imageWidth > imageHeight) {
                                    if (imageWidth > imageMaxSize) {
                                        imageHeight = (imageMaxSize * imageHeight) / imageWidth;
                                        imageWidth = imageMaxSize;
                                    }
                                }
                                else {
                                    if (imageHeight > imageMaxSize) {
                                        imageWidth = (imageMaxSize * imageWidth) / imageHeight;
                                        imageHeight = imageMaxSize;
                                    }
                                }
                                imageMatch = imageData.match(/data:image\/(.*);/);
                                imageExt = 'png';
                                if (imageMatch) {
                                    imageExt = imageMatch[1];
                                }
                                // 目前 excel 只支持这些格式，所以其它格式直接输出 url
                                if (imageExt != 'png' &&
                                    imageExt != 'jpeg' &&
                                    imageExt != 'gif') {
                                    sheetRow.getCell(columIndex).value = value;
                                    return [3 /*break*/, 17];
                                }
                                imageId = workbook.addImage({
                                    base64: imageData,
                                    extension: imageExt
                                });
                                linkURL = getAbsoluteUrl(value);
                                worksheet.addImage(imageId, {
                                    // 这里坐标位置是从 0 开始的，所以要减一
                                    tl: { col: columIndex - 1, row: rowIndex - 1 },
                                    ext: {
                                        width: imageWidth,
                                        height: imageHeight
                                    },
                                    hyperlinks: {
                                        tooltip: linkURL
                                    }
                                });
                                return [3 /*break*/, 10];
                            case 9:
                                e_1 = _d.sent();
                                console.warn(e_1.stack);
                                return [3 /*break*/, 10];
                            case 10: return [3 /*break*/, 17];
                            case 11:
                                if (!(type == 'link')) return [3 /*break*/, 12];
                                linkURL = getAbsoluteUrl(value);
                                sheetRow.getCell(columIndex).value = {
                                    text: value,
                                    hyperlink: linkURL
                                };
                                return [3 /*break*/, 17];
                            case 12:
                                if (!(type === 'mapping')) return [3 /*break*/, 16];
                                map = column.map;
                                source = column.source;
                                if (!source) return [3 /*break*/, 15];
                                sourceValue = source;
                                if ((0, tpl_builtin_1.isPureVariable)(source)) {
                                    sourceValue = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw');
                                }
                                mapKey = JSON.stringify(source);
                                if (!(mapKey in remoteMappingCache)) return [3 /*break*/, 13];
                                map = remoteMappingCache[mapKey];
                                return [3 /*break*/, 15];
                            case 13: return [4 /*yield*/, env.fetcher(sourceValue, data)];
                            case 14:
                                res = _d.sent();
                                if (res.data) {
                                    remoteMappingCache[mapKey] = res.data;
                                    map = res.data;
                                }
                                _d.label = 15;
                            case 15:
                                if (typeof value !== 'undefined' &&
                                    map &&
                                    ((_b = map[value]) !== null && _b !== void 0 ? _b : map['*'])) {
                                    viewValue = (_c = map[value]) !== null && _c !== void 0 ? _c : (value === true && map['1']
                                        ? map['1']
                                        : value === false && map['0']
                                            ? map['0']
                                            : map['*']);
                                    sheetRow.getCell(columIndex).value =
                                        (0, helper_1.removeHTMLTag)(viewValue);
                                }
                                else {
                                    sheetRow.getCell(columIndex).value = (0, helper_1.removeHTMLTag)(value);
                                }
                                return [3 /*break*/, 17];
                            case 16:
                                if (column.tpl) {
                                    sheetRow.getCell(columIndex).value = (0, helper_1.removeHTMLTag)((0, tpl_1.filter)(column.tpl, row.data));
                                }
                                else {
                                    sheetRow.getCell(columIndex).value = value;
                                }
                                _d.label = 17;
                            case 17:
                                _a++;
                                return [3 /*break*/, 5];
                            case 18:
                                _i++;
                                return [3 /*break*/, 4];
                            case 19: return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                            case 20:
                                buffer = _d.sent();
                                if (buffer) {
                                    blob = new Blob([buffer], {
                                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                    });
                                    saveAs(blob, filename + '.xlsx');
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            }, size: "sm" }, toolbar.label || __('CRUD.exportExcel')));
    };
    Table.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store, cx = _a.classnames, data = _a.data;
        actions = Array.isArray(actions) ? actions.concat() : [];
        if (store.toggable &&
            region === 'header' &&
            !~this.renderedToolbars.indexOf('columns-toggler')) {
            actions.push({
                type: 'button',
                children: this.renderColumnsToggler()
            });
        }
        if (store.draggable &&
            !store.isNested &&
            region === 'header' &&
            store.rows.length > 1 &&
            !~this.renderedToolbars.indexOf('drag-toggler')) {
            actions.push({
                type: 'button',
                children: this.renderDragToggler()
            });
        }
        return Array.isArray(actions) && actions.length ? (react_1.default.createElement("div", { className: cx('Table-actions') }, actions.map(function (action, key) {
            return render("action/" + key, (0, tslib_1.__assign)({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging,
                data: store.getData(data)
            });
        }))) : null;
    };
    Table.prototype.renderHeader = function (editable) {
        var _a = this.props, header = _a.header, headerClassName = _a.headerClassName, toolbarClassName = _a.toolbarClassName, headerToolbarClassName = _a.headerToolbarClassName, headerToolbarRender = _a.headerToolbarRender, render = _a.render, showHeader = _a.showHeader, store = _a.store, cx = _a.classnames, data = _a.data, __ = _a.translate;
        if (showHeader === false) {
            return null;
        }
        var otherProps = {};
        // editable === false && (otherProps.$$editable = false);
        var child = headerToolbarRender
            ? headerToolbarRender((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), { selectedItems: store.selectedRows.map(function (item) { return item.data; }), items: store.rows.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedRows.map(function (item) { return item.data; }) }), otherProps), this.renderToolbar)
            : null;
        var actions = this.renderActions('header');
        var toolbarNode = actions || child || store.dragging ? (react_1.default.createElement("div", { className: cx('Table-toolbar Table-headToolbar', toolbarClassName, headerToolbarClassName), key: "header-toolbar" },
            actions,
            child,
            store.dragging ? (react_1.default.createElement("div", { className: cx('Table-dragTip'), ref: this.dragTipRef }, __('Table.dragTip'))) : null)) : null;
        var headerNode = header && (!Array.isArray(header) || header.length) ? (react_1.default.createElement("div", { className: cx('Table-header', headerClassName), key: "header" }, render('header', header, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (editable === false ? otherProps : null)), { data: store.getData(data) })))) : null;
        return headerNode && toolbarNode
            ? [headerNode, toolbarNode]
            : headerNode || toolbarNode || null;
    };
    Table.prototype.renderFooter = function () {
        var _a = this.props, footer = _a.footer, toolbarClassName = _a.toolbarClassName, footerToolbarClassName = _a.footerToolbarClassName, footerClassName = _a.footerClassName, footerToolbarRender = _a.footerToolbarRender, render = _a.render, showFooter = _a.showFooter, store = _a.store, data = _a.data, cx = _a.classnames;
        if (showFooter === false) {
            return null;
        }
        var child = footerToolbarRender
            ? footerToolbarRender((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), { selectedItems: store.selectedRows.map(function (item) { return item.data; }), items: store.rows.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('footer');
        var toolbarNode = actions || child ? (react_1.default.createElement("div", { className: cx('Table-toolbar Table-footToolbar', toolbarClassName, footerToolbarClassName), key: "footer-toolbar" },
            actions,
            child)) : null;
        var footerNode = footer && (!Array.isArray(footer) || footer.length) ? (react_1.default.createElement("div", { className: cx('Table-footer', footerClassName), key: "footer" }, render('footer', footer, {
            data: store.getData(data)
        }))) : null;
        return footerNode && toolbarNode
            ? [toolbarNode, footerNode]
            : footerNode || toolbarNode || null;
    };
    Table.prototype.renderItemActions = function () {
        var _a = this.props, itemActions = _a.itemActions, render = _a.render, store = _a.store, cx = _a.classnames;
        var finalActions = Array.isArray(itemActions)
            ? itemActions.filter(function (action) { return !action.hiddenOnHover; })
            : [];
        if (!finalActions.length) {
            return null;
        }
        var rowIndex = store.hoverIndex;
        var heights = this.heights;
        var height = 40;
        var top = 0;
        if (heights && heights[rowIndex]) {
            height = heights[rowIndex];
            top += heights.header;
            for (var i = rowIndex - 1; i >= 0; i--) {
                top += heights[i];
            }
        }
        return (react_1.default.createElement("div", { className: cx('Table-itemActions-wrap'), style: {
                top: top,
                height: height
            } },
            react_1.default.createElement("div", { className: cx('Table-itemActions') }, finalActions.map(function (action, index) {
                return render("itemAction/" + index, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { isMenuItem: true }), {
                    key: index,
                    item: store.rows[rowIndex],
                    data: store.rows[rowIndex].locals,
                    rowIndex: rowIndex
                });
            }))));
    };
    Table.prototype.renderTableContent = function () {
        var _a = this.props, cx = _a.classnames, tableClassName = _a.tableClassName, store = _a.store, placeholder = _a.placeholder, render = _a.render, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, rowClassNameExpr = _a.rowClassNameExpr, rowClassName = _a.rowClassName, prefixRow = _a.prefixRow, locale = _a.locale, affixRow = _a.affixRow, translate = _a.translate, itemAction = _a.itemAction;
        // 理论上来说 store.rows 应该也行啊
        // 不过目前看来只有这样写它才会重新更新视图
        store.rows.length;
        return (react_1.default.createElement(TableContent_1.TableContent, { tableClassName: cx(store.combineNum > 0 ? 'Table-table--withCombine' : '', tableClassName), itemAction: itemAction, classnames: cx, columns: store.filteredColumns, columnsGroup: store.columnGroup, rows: store.rows, placeholder: placeholder, render: render, onMouseMove: this.handleMouseMove, onScroll: this.handleOutterScroll, tableRef: this.tableRef, renderHeadCell: this.renderHeadCell, renderCell: this.renderCell, onCheck: this.handleCheck, onQuickChange: store.dragging ? undefined : this.handleQuickChange, footable: store.footable, footableColumns: store.footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: this.handleAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, data: store.data, prefixRow: prefixRow, affixRow: affixRow, locale: locale, translate: translate }));
    };
    Table.prototype.render = function () {
        var _a = this.props, className = _a.className, store = _a.store, cx = _a.classnames, affixColumns = _a.affixColumns;
        this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
        var heading = this.renderHeading();
        var header = this.renderHeader();
        var footer = this.renderFooter();
        var tableClassName = cx('Table-table', store.combineNum > 0 ? 'Table-table--withCombine' : '', this.props.tableClassName);
        return (react_1.default.createElement("div", { className: cx('Table', className, {
                'Table--unsaved': !!store.modified || !!store.moved
            }) },
            header,
            heading,
            react_1.default.createElement("div", { className: cx('Table-contentWrap'), onMouseLeave: this.handleMouseLeave },
                react_1.default.createElement("div", { className: cx('Table-fixedLeft'), onMouseMove: this.handleMouseMove }, affixColumns !== false && store.leftFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.leftFixedColumns, false, tableClassName)
                    : null),
                react_1.default.createElement("div", { className: cx('Table-fixedRight'), onMouseMove: this.handleMouseMove }, affixColumns !== false && store.rightFixedColumns.length
                    ? this.renderFixedColumns(store.rows, store.rightFixedColumns, false, tableClassName)
                    : null),
                this.renderTableContent(),
                ~store.hoverIndex ? this.renderItemActions() : null),
            this.renderAffixHeader(tableClassName),
            footer));
    };
    var _a, _b, _c, _d;
    Table.propsList = [
        'header',
        'headerToolbarRender',
        'footer',
        'footerToolbarRender',
        'footable',
        'expandConfig',
        'placeholder',
        'tableClassName',
        'headingClassName',
        'source',
        'selectable',
        'columnsTogglable',
        'affixHeader',
        'affixColumns',
        'headerClassName',
        'footerClassName',
        'selected',
        'multiple',
        'primaryField',
        'hideQuickSaveBtn',
        'itemCheckableOn',
        'itemDraggableOn',
        'checkOnItemClick',
        'hideCheckToggler',
        'itemAction',
        'itemActions',
        'combineNum',
        'combineFromIndex',
        'items',
        'columns',
        'valueField',
        'saveImmediately',
        'rowClassName',
        'rowClassNameExpr',
        'popOverContainer',
        'headerToolbarClassName',
        'toolbarClassName',
        'footerToolbarClassName'
    ];
    Table.defaultProps = {
        className: '',
        placeholder: 'placeholder.noData',
        tableClassName: '',
        source: '$items',
        selectable: false,
        columnsTogglable: 'auto',
        affixHeader: true,
        headerClassName: '',
        footerClassName: '',
        toolbarClassName: '',
        headerToolbarClassName: '',
        footerToolbarClassName: '',
        primaryField: 'id',
        itemCheckableOn: '',
        itemDraggableOn: '',
        hideCheckToggler: false,
        canAccessSuperData: false,
        resizable: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.DragEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleDragStart", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleDragOver", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleDrop", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleDragEnd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleImageEnlarge", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseMove", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof MouseEvent !== "undefined" && MouseEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Table.prototype, "handleColResizeMouseUp", null);
    return Table;
}(react_1.default.Component));
exports.default = Table;
var TableRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableRenderer, _super);
    function TableRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'table',
            storeType: table_1.TableStore.name,
            name: 'table'
        })
    ], TableRenderer);
    return TableRenderer;
}(Table));
exports.TableRenderer = TableRenderer;
//# sourceMappingURL=./renderers/Table/index.js.map
