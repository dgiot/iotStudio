"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRenderer = exports.Log = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var ansi_to_react_1 = (0, tslib_1.__importDefault)(require("ansi-to-react"));
var api_1 = require("../utils/api");
var Log = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Log, _super);
    function Log(props) {
        var _this = _super.call(this, props) || this;
        _this.isDone = false;
        _this.autoScroll = false;
        _this.state = {
            lastLine: '',
            logs: []
        };
        _this.logRef = react_1.default.createRef();
        _this.autoScroll = props.autoScroll || false;
        _this.pauseOrResumeScrolling = _this.pauseOrResumeScrolling.bind(_this);
        return _this;
    }
    Log.prototype.componentWillUnmount = function () {
        if (this.logRef && this.logRef.current) {
            this.logRef.current.removeEventListener('scroll', this.pauseOrResumeScrolling);
        }
    };
    Log.prototype.componentDidMount = function () {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.addEventListener('scroll', this.pauseOrResumeScrolling);
        }
        if (this.props.source) {
            this.loadLogs();
        }
    };
    Log.prototype.componentDidUpdate = function () {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
        }
    };
    // 如果向上滚动就停止自动滚动，除非滚到底部
    Log.prototype.pauseOrResumeScrolling = function () {
        if (this.logRef && this.logRef.current) {
            var _a = this.logRef.current, scrollHeight = _a.scrollHeight, scrollTop = _a.scrollTop, offsetHeight = _a.offsetHeight;
            this.autoScroll = scrollHeight - (scrollTop + offsetHeight) < 50;
        }
    };
    Log.prototype.loadLogs = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, source, data, env, __, encoding, api, res, body, reader, lastline, logs, _b, done, value, text, lines;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, source = _a.source, data = _a.data, env = _a.env, __ = _a.translate, encoding = _a.encoding;
                        api = (0, api_1.buildApi)(source, data);
                        return [4 /*yield*/, fetch(api.url)];
                    case 1:
                        res = _c.sent();
                        if (!(res.status === 200)) return [3 /*break*/, 6];
                        body = res.body;
                        if (!body) {
                            return [2 /*return*/];
                        }
                        reader = body.getReader();
                        lastline = '';
                        logs = [];
                        _c.label = 2;
                    case 2: return [4 /*yield*/, reader.read()];
                    case 3:
                        _b = _c.sent(), done = _b.done, value = _b.value;
                        if (value) {
                            text = new TextDecoder(encoding).decode(value, { stream: true });
                            lines = text.split('\n');
                            // 如果没有换行符就只更新最后一行
                            if (lines.length === 1) {
                                lastline += lines[0];
                                this.setState({
                                    lastLine: lastline
                                });
                            }
                            else {
                                // 将之前的数据补上
                                lines[0] = lastline + lines[0];
                                // 最后一个要么是空，要么是下一行的数据
                                lastline = lines.pop() || '';
                                logs = logs.concat(lines);
                                this.setState({
                                    logs: logs,
                                    lastLine: lastline
                                });
                            }
                        }
                        if (done) {
                            this.isDone = true;
                            return [2 /*return*/];
                        }
                        _c.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        env.notify('error', __('fetchFailed'));
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Log.prototype.render = function () {
        var _a = this.props, source = _a.source, className = _a.className, cx = _a.classnames, placeholder = _a.placeholder, height = _a.height, __ = _a.translate;
        var loading = __(placeholder);
        if (!source) {
            loading = __('Log.mustHaveSource');
        }
        var lines = this.state.logs.map(function (line, index) {
            return (react_1.default.createElement("div", { className: cx('Log-line'), key: index },
                react_1.default.createElement(ansi_to_react_1.default, { useClasses: true }, line)));
        });
        return (react_1.default.createElement("div", { ref: this.logRef, className: cx('Log', className), style: { height: height } },
            lines.length ? lines : loading,
            react_1.default.createElement("div", { className: cx('Log-line'), key: "last" },
                react_1.default.createElement("code", null, this.state.lastLine))));
    };
    Log.defaultProps = {
        height: 500,
        autoScroll: true,
        placeholder: 'loading',
        encoding: 'utf-8'
    };
    return Log;
}(react_1.default.Component));
exports.Log = Log;
var LogRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LogRenderer, _super);
    function LogRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'log'
        })
    ], LogRenderer);
    return LogRenderer;
}(Log));
exports.LogRenderer = LogRenderer;
//# sourceMappingURL=./renderers/Log.js.map
