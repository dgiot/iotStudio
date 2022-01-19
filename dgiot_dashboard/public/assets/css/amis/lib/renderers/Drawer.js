"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Scoped_1 = require("../Scoped");
var factory_1 = require("../factory");
var Drawer_1 = (0, tslib_1.__importDefault)(require("../components/Drawer"));
var helper_1 = require("../utils/helper");
var mobx_1 = require("mobx");
var react_dom_1 = require("react-dom");
var modal_1 = require("../store/modal");
var tpl_1 = require("../utils/tpl");
var components_1 = require("../components");
var mobx_state_tree_1 = require("mobx-state-tree");
var Drawer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Drawer, _super);
    function Drawer(props) {
        var _this = _super.call(this, props) || this;
        _this.$$id = (0, helper_1.guid)();
        props.store.setEntered(!!props.show);
        _this.handleSelfClose = _this.handleSelfClose.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleDrawerConfirm = _this.handleDrawerConfirm.bind(_this);
        _this.handleDrawerClose = _this.handleDrawerClose.bind(_this);
        _this.handleDialogConfirm = _this.handleDialogConfirm.bind(_this);
        _this.handleDialogClose = _this.handleDialogClose.bind(_this);
        _this.handleChildFinished = _this.handleChildFinished.bind(_this);
        _this.resizeMouseDown = _this.resizeMouseDown.bind(_this);
        _this.bindResize = _this.bindResize.bind(_this);
        _this.removeResize = _this.removeResize.bind(_this);
        _this.handleEntered = _this.handleEntered.bind(_this);
        _this.handleExited = _this.handleExited.bind(_this);
        _this.handleFormInit = _this.handleFormInit.bind(_this);
        _this.handleFormChange = _this.handleFormChange.bind(_this);
        _this.handleFormSaved = _this.handleFormSaved.bind(_this);
        var store = props.store;
        _this.reaction = (0, mobx_1.reaction)(function () { return "" + store.loading + store.error; }, function () { return _this.forceUpdate(); });
        return _this;
    }
    // shouldComponentUpdate(nextProps:DrawerProps) {
    //     const props = this.props;
    //     if (props.show === nextProps.show && !nextProps.show) {
    //         return false;
    //     }
    //     return isObjectShallowModified(this.props, nextProps);
    // }
    Drawer.prototype.componentWillUnmount = function () {
        this.reaction && this.reaction();
    };
    Drawer.prototype.buildActions = function () {
        var _a = this.props, actions = _a.actions, confirm = _a.confirm, __ = _a.translate;
        if (typeof actions !== 'undefined') {
            return actions;
        }
        var ret = [];
        ret.push({
            type: 'button',
            actionType: 'close',
            label: __('cancel')
        });
        if (confirm) {
            ret.push({
                type: 'button',
                actionType: 'confirm',
                label: __('confirm'),
                primary: true
            });
        }
        return ret;
    };
    Drawer.prototype.handleSelfClose = function () {
        var _a = this.props, onClose = _a.onClose, store = _a.store;
        // 如果有子弹框，那么就先不隐藏自己
        if (store.dialogOpen !== false || store.drawerOpen !== false) {
            return;
        }
        // clear error
        store.updateMessage();
        onClose();
    };
    Drawer.prototype.handleAction = function (e, action, data) {
        var _a = this.props, onClose = _a.onClose, onAction = _a.onAction;
        if (action.actionType === 'close' || action.actionType === 'cancel') {
            onClose();
        }
        else if (onAction) {
            onAction(e, action, data);
        }
    };
    Drawer.prototype.handleDrawerConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.props.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var drawerAction = store.action;
        var drawer = drawerAction.drawer;
        if (drawer.onConfirm &&
            drawer.onConfirm.apply(drawer, (0, tslib_1.__spreadArray)([values, action], args, false)) === false) {
            return;
        }
        store.closeDrawer();
    };
    Drawer.prototype.handleDrawerClose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var store = this.props.store;
        var action = store.action;
        var drawer = action.drawer;
        if (drawer.onClose && drawer.onClose.apply(drawer, args) === false) {
            return;
        }
        store.closeDrawer();
    };
    Drawer.prototype.handleDialogConfirm = function (values, action) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var store = this.props.store;
        if (action.mergeData && values.length === 1 && values[0]) {
            store.updateData(values[0]);
        }
        var dialogAction = store.action;
        var dialog = dialogAction.dialog;
        if (dialog.onConfirm &&
            dialog.onConfirm.apply(dialog, (0, tslib_1.__spreadArray)([values, action], args, false)) === false) {
            return;
        }
        store.closeDialog();
    };
    Drawer.prototype.handleDialogClose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var store = this.props.store;
        var action = store.action;
        var dialog = action.dialog;
        if (dialog.onClose && dialog.onClose.apply(dialog, args) === false) {
            return;
        }
        store.closeDialog();
    };
    Drawer.prototype.handleChildFinished = function (value, action) {
        // 下面会覆盖
    };
    Drawer.prototype.handleFormInit = function (data) {
        var store = this.props.store;
        store.setFormData(data);
    };
    Drawer.prototype.handleFormChange = function (data, name) {
        var _a;
        var store = this.props.store;
        if (typeof name === 'string') {
            data = (_a = {},
                _a[name] = data,
                _a);
        }
        store.setFormData(data);
    };
    Drawer.prototype.handleFormSaved = function (data, response) {
        var store = this.props.store;
        store.setFormData((0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), response));
    };
    Drawer.prototype.handleEntered = function () {
        var _a = this.props, lazySchema = _a.lazySchema, store = _a.store;
        store.setEntered(true);
        if (typeof lazySchema === 'function') {
            store.setSchema(lazySchema(this.props));
        }
    };
    Drawer.prototype.handleExited = function () {
        var _a = this.props, lazySchema = _a.lazySchema, store = _a.store;
        if ((0, mobx_state_tree_1.isAlive)(store)) {
            store.reset();
            store.setEntered(false);
            if (typeof lazySchema === 'function') {
                store.setSchema('');
            }
        }
    };
    Drawer.prototype.getPopOverContainer = function () {
        return (0, react_dom_1.findDOMNode)(this).querySelector("." + this.props.classPrefix + "Drawer-content");
    };
    Drawer.prototype.renderBody = function (body, key) {
        var _this = this;
        var _a = this.props, render = _a.render, store = _a.store;
        if (Array.isArray(body)) {
            return body.map(function (body, key) { return _this.renderBody(body, key); });
        }
        var schema = body;
        var subProps = {
            key: key,
            disabled: store.loading,
            onAction: this.handleAction,
            onFinished: this.handleChildFinished,
            popOverContainer: this.getPopOverContainer,
            onChange: this.handleFormChange,
            onInit: this.handleFormInit,
            onSaved: this.handleFormSaved,
            syncLocation: false
        };
        if (schema.type === 'form') {
            schema = (0, tslib_1.__assign)({ mode: 'horizontal', wrapWithPanel: false, submitText: null }, schema);
        }
        return render("body" + (key ? "/" + key : ''), schema, subProps);
    };
    Drawer.prototype.renderFooter = function () {
        var _this = this;
        var actions = this.buildActions();
        if (!actions || !actions.length) {
            return null;
        }
        var _a = this.props, store = _a.store, render = _a.render, cx = _a.classnames, showErrorMsg = _a.showErrorMsg;
        return (react_1.default.createElement("div", { className: cx('Drawer-footer') },
            store.loading || store.error ? (react_1.default.createElement("div", { className: cx('Drawer-info') },
                react_1.default.createElement(components_1.Spinner, { size: "sm", key: "info", show: store.loading }),
                showErrorMsg && store.error ? (react_1.default.createElement("span", { className: cx('Drawer-error') }, store.msg)) : null)) : null,
            actions.map(function (action, key) {
                return render("action/" + key, action, {
                    onAction: _this.handleAction,
                    data: store.formData,
                    key: key,
                    disabled: action.disabled || store.loading
                });
            })));
    };
    Drawer.prototype.renderResizeCtrl = function () {
        var cx = this.props.classnames;
        return (react_1.default.createElement("div", { className: cx('Drawer-resizeCtrl'), onMouseDown: this.resizeMouseDown },
            react_1.default.createElement("div", { className: cx('Drawer-resizeIcon') }, "\u00B7\u00B7\u00B7")));
    };
    Drawer.prototype.resizeMouseDown = function (e) {
        var _a = this.props, position = _a.position, ns = _a.classPrefix, store = _a.store;
        this.drawer = (0, react_dom_1.findDOMNode)(this).querySelector("." + ns + "Drawer-content");
        var resizeCtrl = (0, react_dom_1.findDOMNode)(this).querySelector("." + ns + "Drawer-content ." + ns + "Drawer-resizeCtrl");
        var drawerWidth = getComputedStyle(this.drawer).width;
        var drawerHeight = getComputedStyle(this.drawer).height;
        store.setResizeCoord((position === 'left' &&
            e.clientX -
                resizeCtrl.offsetWidth -
                parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
            (position === 'right' &&
                document.body.offsetWidth -
                    e.clientX -
                    resizeCtrl.offsetWidth -
                    parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
            (position === 'top' &&
                e.clientY -
                    resizeCtrl.offsetHeight -
                    parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
            (position === 'bottom' &&
                document.body.offsetHeight -
                    e.clientY -
                    resizeCtrl.offsetHeight -
                    parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
            0);
        document.body.addEventListener('mousemove', this.bindResize);
        document.body.addEventListener('mouseup', this.removeResize);
    };
    Drawer.prototype.bindResize = function (e) {
        var _a = this.props, position = _a.position, store = _a.store;
        var maxWH = 'calc(100% - 50px)';
        var drawerStyle = this.drawer.style;
        var wh = (position === 'left' && e.clientX) ||
            (position === 'right' && document.body.offsetWidth - e.clientX) ||
            (position === 'top' && e.clientY) ||
            (position === 'bottom' && document.body.offsetHeight - e.clientY) ||
            0;
        wh = wh - store.resizeCoord + 'px';
        if (position === 'left' || position === 'right') {
            drawerStyle.maxWidth = maxWH;
            drawerStyle.width = wh;
        }
        if (position === 'top' || position === 'bottom') {
            drawerStyle.maxHeight = maxWH;
            drawerStyle.height = wh;
        }
    };
    Drawer.prototype.removeResize = function () {
        document.body.removeEventListener('mousemove', this.bindResize);
        document.body.removeEventListener('mouseup', this.removeResize);
    };
    Drawer.prototype.openFeedback = function (dialog, ctx) {
        var _this = this;
        return new Promise(function (resolve) {
            var store = _this.props.store;
            store.setCurrentAction({
                type: 'button',
                actionType: 'dialog',
                dialog: dialog
            });
            store.openDialog(ctx, undefined, function (confirmed) {
                resolve(confirmed);
            });
        });
    };
    Drawer.prototype.render = function () {
        var store = this.props.store;
        var _a = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), store.schema), className = _a.className, size = _a.size, closeOnEsc = _a.closeOnEsc, position = _a.position, title = _a.title, render = _a.render, header = _a.header, body = _a.body, bodyClassName = _a.bodyClassName, show = _a.show, wrapperComponent = _a.wrapperComponent, env = _a.env, resizable = _a.resizable, overlay = _a.overlay, closeOnOutside = _a.closeOnOutside, ns = _a.classPrefix, cx = _a.classnames, drawerContainer = _a.drawerContainer;
        var Container = wrapperComponent || Drawer_1.default;
        return (react_1.default.createElement(Container, { classPrefix: ns, className: className, size: size, onHide: this.handleSelfClose, disabled: store.loading, show: show, position: position, overlay: overlay, onEntered: this.handleEntered, onExited: this.handleExited, closeOnEsc: closeOnEsc, closeOnOutside: !store.drawerOpen && !store.dialogOpen && closeOnOutside, container: drawerContainer
                ? drawerContainer
                : env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined },
            react_1.default.createElement("div", { className: cx('Drawer-header') },
                title ? (react_1.default.createElement("div", { className: cx('Drawer-title') }, render('title', title, {
                    data: store.formData
                }))) : null,
                header
                    ? render('header', header, {
                        data: store.formData
                    })
                    : null),
            !store.entered ? (react_1.default.createElement("div", { className: cx('Drawer-body', bodyClassName) },
                react_1.default.createElement(components_1.Spinner, { overlay: true, show: true, size: "lg" }))) : body ? (react_1.default.createElement("div", { className: cx('Drawer-body', bodyClassName) }, this.renderBody(body, 'body'))) : null,
            this.renderFooter(),
            body
                ? render('dialog', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.action &&
                    store.action.dialog)), { type: 'dialog' }), {
                    key: 'dialog',
                    data: store.dialogData,
                    onConfirm: this.handleDialogConfirm,
                    onClose: this.handleDialogClose,
                    onAction: this.handleAction,
                    show: store.dialogOpen
                })
                : null,
            body
                ? render('drawer', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (store.action &&
                    store.action.drawer)), { type: 'drawer' }), {
                    key: 'drawer',
                    data: store.drawerData,
                    onConfirm: this.handleDrawerConfirm,
                    onClose: this.handleDrawerClose,
                    onAction: this.handleAction,
                    show: store.drawerOpen
                })
                : null,
            resizable ? this.renderResizeCtrl() : null));
    };
    Drawer.propsList = [
        'title',
        'size',
        'closeOnEsc',
        'closeOnOutside',
        'children',
        'bodyClassName',
        'confirm',
        'position',
        'onClose',
        'onConfirm',
        'show',
        'resizable',
        'overlay',
        'body',
        'popOverContainer',
        'showErrorMsg'
    ];
    Drawer.defaultProps = {
        title: '',
        bodyClassName: '',
        confirm: true,
        position: 'right',
        resizable: false,
        overlay: true,
        closeOnEsc: false,
        closeOnOutside: false,
        showErrorMsg: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Drawer.prototype, "getPopOverContainer", null);
    return Drawer;
}(react_1.default.Component));
exports.default = Drawer;
var DrawerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DrawerRenderer, _super);
    function DrawerRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    DrawerRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
        _super.prototype.componentWillUnmount.call(this);
    };
    DrawerRenderer.prototype.tryChildrenToHandle = function (action, ctx, rawAction) {
        var _this = this;
        var scoped = this.context;
        if (action.fromDialog) {
            return false;
        }
        var targets = [];
        var _a = this.props, onConfirm = _a.onConfirm, store = _a.store;
        if (action.target) {
            targets.push.apply(targets, action.target
                .split(',')
                .map(function (name) { return scoped.getComponentByName(name); })
                .filter(function (item) { return item && item.doAction; }));
        }
        if (!targets.length) {
            var components = scoped
                .getComponents()
                .filter(function (item) { return !~['drawer', 'dialog'].indexOf(item.props.type); });
            var pool = components.concat();
            while (pool.length) {
                var item = pool.pop();
                if (~['crud', 'form', 'wizard'].indexOf(item.props.type)) {
                    targets.push(item);
                    break;
                }
                else if (~['drawer', 'dialog'].indexOf(item.props.type)) {
                    continue;
                }
                else if (~['page', 'service'].indexOf(item.props.type)) {
                    pool.unshift.apply(pool, item.context.getComponents());
                }
            }
        }
        if (targets.length) {
            store.markBusying(true);
            store.updateMessage();
            Promise.all(targets.map(function (target) {
                return target.doAction((0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { from: _this.$$id }), ctx, true);
            }))
                .then(function (values) {
                if ((action.type === 'submit' ||
                    action.actionType === 'submit' ||
                    action.actionType === 'confirm') &&
                    action.close !== false) {
                    onConfirm && onConfirm(values, rawAction || action, ctx, targets);
                }
                else if (action.close) {
                    action.close === true
                        ? _this.handleSelfClose()
                        : _this.closeTarget(action.close);
                }
                store.markBusying(false);
            })
                .catch(function (reason) {
                store.updateMessage(reason.message, true);
                store.markBusying(false);
            });
            return true;
        }
        return false;
    };
    DrawerRenderer.prototype.handleAction = function (e, action, data, throwErrors, delegate) {
        var _this = this;
        if (throwErrors === void 0) { throwErrors = false; }
        var _a = this.props, onClose = _a.onClose, onAction = _a.onAction, store = _a.store, env = _a.env;
        if (action.from === this.$$id) {
            return onAction
                ? onAction(e, action, data, throwErrors, delegate || this.context)
                : false;
        }
        var scoped = this.context;
        if (action.actionType === 'close' || action.actionType === 'cancel') {
            store.setCurrentAction(action);
            onClose();
            action.close && this.closeTarget(action.close);
        }
        else if (action.actionType === 'confirm') {
            store.setCurrentAction(action);
            this.tryChildrenToHandle(action, data) || onClose();
        }
        else if (action.actionType === 'drawer') {
            store.setCurrentAction(action);
            store.openDrawer(data);
        }
        else if (action.actionType === 'dialog') {
            store.setCurrentAction(action);
            store.openDialog(data);
        }
        else if (action.actionType === 'reload') {
            store.setCurrentAction(action);
            action.target && scoped.reload(action.target, data);
            if (action.close) {
                this.handleSelfClose();
                this.closeTarget(action.close);
            }
        }
        else if (this.tryChildrenToHandle(action, data)) {
            // do nothing
        }
        else if (action.actionType === 'ajax') {
            store.setCurrentAction(action);
            store
                .saveRemote(action.api, data, {
                successMessage: action.messages && action.messages.success,
                errorMessage: action.messages && action.messages.failed
            })
                .then(function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var redirect;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(action.feedback && (0, helper_1.isVisible)(action.feedback, store.data))) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.openFeedback(action.feedback, store.data)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            redirect = action.redirect && (0, tpl_1.filter)(action.redirect, store.data);
                            redirect && env.jumpTo(redirect, action);
                            action.reload && this.reloadTarget(action.reload, store.data);
                            if (action.close) {
                                this.handleSelfClose();
                                this.closeTarget(action.close);
                            }
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function () { });
        }
        else if (onAction) {
            var ret = onAction(e, action, data, throwErrors, delegate || this.context);
            action.close &&
                (ret && ret.then
                    ? ret.then(this.handleSelfClose)
                    : setTimeout(this.handleSelfClose, 200));
        }
    };
    DrawerRenderer.prototype.handleChildFinished = function (value, action) {
        if ((action && action.from === this.$$id) || action.close === false) {
            return;
        }
        var scoped = this.context;
        var components = scoped
            .getComponents()
            .filter(function (item) { return !~['drawer', 'dialog'].indexOf(item.props.type); });
        var onConfirm = this.props.onConfirm;
        if (components.length === 1 &&
            (components[0].props.type === 'form' ||
                components[0].props.type === 'wizard')) {
            onConfirm([value], action, {}, components);
        }
    };
    DrawerRenderer.prototype.handleDialogConfirm = function (values, action) {
        var _a;
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        _super.prototype.handleDialogConfirm.apply(this, (0, tslib_1.__spreadArray)([values, action], rest, false));
        var scoped = this.context;
        var store = this.props.store;
        var dialogAction = store.action;
        var reload = (_a = action.reload) !== null && _a !== void 0 ? _a : dialogAction.reload;
        if (reload) {
            scoped.reload(reload, store.data);
        }
        else {
            // 没有设置，则自动让页面中 crud 刷新。
            scoped
                .getComponents()
                .filter(function (item) { return item.props.type === 'crud'; })
                .forEach(function (item) { return item.reload && item.reload(); });
        }
    };
    DrawerRenderer.prototype.handleDrawerConfirm = function (values, action) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        _super.prototype.handleDrawerConfirm.call(this, values, action);
        var scoped = this.context;
        var store = this.props.store;
        var drawerAction = store.action;
        // 稍等会，等动画结束。
        setTimeout(function () {
            if (drawerAction.reload) {
                scoped.reload(drawerAction.reload, store.data);
            }
            else if (action.reload) {
                scoped.reload(action.reload, store.data);
            }
            else {
                // 没有设置，则自动让页面中 crud 刷新。
                scoped
                    .getComponents()
                    .filter(function (item) { return item.props.type === 'crud'; })
                    .forEach(function (item) { return item.reload && item.reload(); });
            }
        }, 300);
    };
    DrawerRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    DrawerRenderer.prototype.closeTarget = function (target) {
        var scoped = this.context;
        scoped.close(target);
    };
    var _a;
    DrawerRenderer.contextType = Scoped_1.ScopedContext;
    DrawerRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'drawer',
            storeType: modal_1.ModalStore.name,
            storeExtendsData: false,
            isolateScope: true,
            shouldSyncSuperStore: function (store, props, prevProps) {
                return !!((store.drawerOpen || props.show) &&
                    (props.show !== prevProps.show ||
                        (0, helper_1.isObjectShallowModified)(prevProps.data, props.data)));
            }
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_a = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _a : Object])
    ], DrawerRenderer);
    return DrawerRenderer;
}(Drawer));
exports.DrawerRenderer = DrawerRenderer;
//# sourceMappingURL=./renderers/Drawer.js.map
