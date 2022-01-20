"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainedSelectControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Options_1 = require("./Options");
var Select_1 = (0, tslib_1.__importDefault)(require("../../components/Select"));
var api_1 = require("../../utils/api");
var ChainedSelectControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedSelectControl, _super);
    function ChainedSelectControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            stack: []
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.loadMore = _this.loadMore.bind(_this);
        return _this;
    }
    ChainedSelectControl.prototype.componentDidMount = function () {
        var _a, _b;
        var formInited = this.props.formInited;
        formInited || !this.props.addHook
            ? this.loadMore()
            : (_b = (_a = this.props).addHook) === null || _b === void 0 ? void 0 : _b.call(_a, this.loadMore, 'init');
    };
    ChainedSelectControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.options !== props.options) {
            this.setState({
                stack: []
            });
        }
        else if (props.formInited && props.value !== prevProps.value) {
            this.loadMore();
        }
    };
    ChainedSelectControl.prototype.loadMore = function () {
        var _this = this;
        var _a = this.props, value = _a.value, delimiter = _a.delimiter, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, source = _a.source, data = _a.data, env = _a.env;
        var arr = Array.isArray(value)
            ? value.concat()
            : value && typeof value === 'string'
                ? value.split(delimiter || ',')
                : [];
        var idx = 0;
        var len = this.state.stack.length;
        while (idx < len &&
            arr[idx] &&
            this.state.stack[idx].parentId ==
                (joinValues || extractValue ? arr[idx] : arr[idx].value)) {
            idx++;
        }
        if (!arr[idx] || !env || !(0, api_1.isEffectiveApi)(source, data)) {
            return;
        }
        var parentId = joinValues || extractValue ? arr[idx] : arr[idx].value;
        var stack = this.state.stack.concat();
        stack.splice(idx, stack.length - idx);
        stack.push({
            parentId: parentId,
            loading: true,
            options: []
        });
        this.setState({
            stack: stack
        }, function () {
            env
                .fetcher(source, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { value: arr, level: idx + 1, parentId: parentId, parent: arr[idx] }))
                .then(function (ret) {
                // todo 没有检测 response.ok
                var stack = _this.state.stack.concat();
                var remoteValue = ret.data ? ret.data.value : undefined;
                var options = (ret.data && ret.data.options) || ret.data;
                stack.splice(idx, stack.length - idx);
                if (typeof remoteValue !== 'undefined') {
                    arr.splice(idx + 1, value.length - idx - 1);
                    arr.push(remoteValue);
                    onChange(joinValues ? arr.join(delimiter || ',') : arr);
                }
                stack.push({
                    options: options,
                    parentId: parentId,
                    loading: false,
                    visible: !!options
                });
                _this.setState({
                    stack: stack
                }, _this.loadMore);
            })
                .catch(function (e) {
                env.notify('error', e.message);
            });
        });
    };
    ChainedSelectControl.prototype.handleChange = function (index, currentValue) {
        var _a = this.props, value = _a.value, delimiter = _a.delimiter, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue;
        var arr = Array.isArray(value)
            ? value.concat()
            : value && typeof value === 'string'
                ? value.split(delimiter || ',')
                : [];
        arr.splice(index, arr.length - index);
        arr.push(joinValues ? currentValue.value : currentValue);
        onChange(joinValues
            ? arr.join(delimiter || ',')
            : extractValue
                ? arr.map(function (item) { return item.value || item; })
                : arr);
    };
    ChainedSelectControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    ChainedSelectControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, options = _a.options, ns = _a.classPrefix, className = _a.className, inline = _a.inline, loading = _a.loading, value = _a.value, delimiter = _a.delimiter, joinValues = _a.joinValues, extractValue = _a.extractValue, multiple = _a.multiple, rest = (0, tslib_1.__rest)(_a, ["options", "classPrefix", "className", "inline", "loading", "value", "delimiter", "joinValues", "extractValue", "multiple"]);
        var arr = Array.isArray(value)
            ? value.concat()
            : value && typeof value === 'string'
                ? value.split(delimiter || ',')
                : [];
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(ns + "ChainedSelectControl", className) },
            react_1.default.createElement(Select_1.default, (0, tslib_1.__assign)({}, rest, { classPrefix: ns, key: "base", options: options, value: arr[0], onChange: this.handleChange.bind(this, 0), loading: loading, inline: true })),
            this.state.stack.map(function (_a, index) {
                var options = _a.options, loading = _a.loading, visible = _a.visible;
                return visible === false ? null : (react_1.default.createElement(Select_1.default, (0, tslib_1.__assign)({}, rest, { classPrefix: ns, key: "x-" + (index + 1), options: options, value: arr[index + 1], onChange: _this.handleChange.bind(_this, index + 1), loading: loading, inline: true })));
            })));
    };
    ChainedSelectControl.defaultProps = {
        clearable: false,
        searchable: false,
        multiple: true
    };
    return ChainedSelectControl;
}(react_1.default.Component));
exports.default = ChainedSelectControl;
var ChainedSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedSelectControlRenderer, _super);
    function ChainedSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainedSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'chained-select',
            sizeMutable: false
        })
    ], ChainedSelectControlRenderer);
    return ChainedSelectControlRenderer;
}(ChainedSelectControl));
exports.ChainedSelectControlRenderer = ChainedSelectControlRenderer;
//# sourceMappingURL=./renderers/Form/ChainedSelect.js.map
