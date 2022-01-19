"use strict";
/**
 * @file 用于在移动端或不同语言环境下使用不同配置
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var factory_1 = require("./factory");
var isMobile = ((_b = (_a = window).matchMedia) === null || _b === void 0 ? void 0 : _b.call(_a, '(max-width: 768px)').matches)
    ? true
    : false;
(0, factory_1.addSchemaFilter)(function (schema, renderer, props) {
    if (schema && schema.mobile && isMobile) {
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), schema.mobile);
    }
    if ((props === null || props === void 0 ? void 0 : props.locale) && schema[props.locale]) {
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), schema[props.locale]);
    }
    return schema;
});
//# sourceMappingURL=./envOverwrite.js.map
