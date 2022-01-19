"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePosition = exports.ownerDocument = exports.getContainer = exports.props2BsPropsHoc = exports.props2BsProps = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = (0, tslib_1.__importDefault)(require("react-dom"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var offset_1 = (0, tslib_1.__importDefault)(require("./offset"));
var position_1 = (0, tslib_1.__importDefault)(require("./position"));
var bsMapping = {
    level: 'bsStyle',
    classPrefix: 'bsClass',
    size: 'bsSize'
};
/**
 * 主要目的是希望在是用 bootstrap 组件的时候不需要带 bs 前缀。
 *
 * @param {Object} rawProps 原始属性对象。
 * @return {Object}
 */
var props2BsProps = function (rawProps) {
    var props = {};
    Object.keys(rawProps).forEach(function (key) { return (props[bsMapping[key] || key] = rawProps[key]); });
    return props;
};
exports.props2BsProps = props2BsProps;
/**
 * props2BsProps 的 hoc 版本
 *
 * @param {*} ComposedComponent 组合组件
 * @return {Component}
 */
var props2BsPropsHoc = function (ComposedComponent) {
    var BsComponent = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(BsComponent, _super);
        function BsComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BsComponent.prototype.render = function () {
            return react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, (0, exports.props2BsProps)(this.props)));
        };
        return BsComponent;
    }(react_1.default.Component));
    (0, hoist_non_react_statics_1.default)(BsComponent, ComposedComponent);
    return BsComponent;
};
exports.props2BsPropsHoc = props2BsPropsHoc;
function getContainer(container, defaultContainer) {
    container = typeof container === 'function' ? container() : container;
    return react_dom_1.default.findDOMNode(container) || defaultContainer;
}
exports.getContainer = getContainer;
function ownerDocument(componentOrElement) {
    var _a;
    return (((_a = react_dom_1.default.findDOMNode(componentOrElement)) === null || _a === void 0 ? void 0 : _a.ownerDocument) ||
        document);
}
exports.ownerDocument = ownerDocument;
function getContainerDimensions(containerNode) {
    var _a;
    var width, height, scroll;
    if (containerNode.tagName === 'BODY') {
        width = window.innerWidth;
        height = window.innerHeight;
        scroll =
            ownerDocument(containerNode).documentElement.scrollTop ||
                (containerNode === null || containerNode === void 0 ? void 0 : containerNode.scrollTop);
    }
    else {
        (_a = (0, offset_1.default)(containerNode), width = _a.width, height = _a.height);
        scroll = containerNode.scrollTop;
    }
    return { width: width, height: height, scroll: scroll };
}
function getTopDelta(top, overlayHeight, container, padding) {
    var containerDimensions = getContainerDimensions(container);
    var containerScroll = containerDimensions.scroll;
    var containerHeight = containerDimensions.height;
    var topEdgeOffset = top - padding - containerScroll;
    var bottomEdgeOffset = top + padding - containerScroll + overlayHeight;
    if (topEdgeOffset < 0) {
        return -topEdgeOffset;
    }
    else if (bottomEdgeOffset > containerHeight) {
        return containerHeight - bottomEdgeOffset;
    }
    else {
        return 0;
    }
}
function getLeftDelta(left, overlayWidth, container, padding) {
    var containerDimensions = getContainerDimensions(container);
    var containerWidth = containerDimensions.width;
    var leftEdgeOffset = left - padding;
    var rightEdgeOffset = left + padding + overlayWidth;
    if (leftEdgeOffset < 0) {
        return -leftEdgeOffset;
    }
    else if (rightEdgeOffset > containerWidth) {
        return containerWidth - rightEdgeOffset;
    }
    return 0;
}
function calculatePosition(placement, overlayNode, target, container, padding) {
    if (padding === void 0) { padding = 0; }
    var childOffset = container.tagName === 'BODY'
        ? (0, offset_1.default)(target)
        : (0, position_1.default)(target, container);
    var _a = (0, offset_1.default)(overlayNode), overlayHeight = _a.height, overlayWidth = _a.width;
    var clip = container.getBoundingClientRect();
    var clip2 = overlayNode.getBoundingClientRect();
    var scaleX = overlayNode.offsetWidth
        ? clip2.width / overlayNode.offsetWidth
        : 1;
    var scaleY = overlayNode.offsetHeight
        ? clip2.height / overlayNode.offsetHeight
        : 1;
    // auto 尝试四个方向对齐。
    placement =
        placement === 'auto'
            ? 'left-bottom-left-top right-bottom-right-top left-top-left-bottom right-top-right-bottom left-bottom-left-top'
            : placement;
    var positionLeft = 0, positionTop = 0, arrowOffsetLeft = '', arrowOffsetTop = '', activePlacement = placement;
    if (~placement.indexOf('-')) {
        var tests = placement.split(/\s+/);
        while (tests.length) {
            var current = (activePlacement = tests.shift());
            var _b = current.split('-'), atX = _b[0], atY = _b[1], myX = _b[2], myY = _b[3];
            myX = myX || atX;
            myY = myY || atY;
            positionLeft =
                atX === 'left'
                    ? childOffset.left
                    : atX === 'right'
                        ? childOffset.left + childOffset.width
                        : childOffset.left + childOffset.width / 2;
            positionTop =
                atY === 'top'
                    ? childOffset.top
                    : atY === 'bottom'
                        ? childOffset.top + childOffset.height
                        : childOffset.top + childOffset.height / 2;
            positionLeft -=
                myX === 'left' ? 0 : myX === 'right' ? overlayWidth : overlayWidth / 2;
            positionTop -=
                myY === 'top'
                    ? 0
                    : myY === 'bottom'
                        ? overlayHeight
                        : overlayHeight / 2;
            // 如果还有其他可选项，则做位置判断，是否在可视区域，不完全在则继续看其他定位情况。
            if (tests.length) {
                var transformed = {
                    x: clip.x + positionLeft / scaleX,
                    y: clip.y + positionTop / scaleY,
                    width: overlayWidth,
                    height: overlayHeight
                };
                if (transformed.x > 0 &&
                    transformed.x + transformed.width < window.innerWidth &&
                    transformed.y > 0 &&
                    transformed.y + transformed.height < window.innerHeight) {
                    break;
                }
            }
        }
        // todo arrow 位置支持
    }
    else if (placement === 'left' || placement === 'right') {
        // atX = placement;
        // atY = myY = 'center';
        // myX = placement === 'left' ? 'right' : 'left';
        if (placement === 'left') {
            positionLeft = childOffset.left - overlayWidth;
        }
        else {
            positionLeft = childOffset.left + childOffset.width;
        }
        positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
        var topDelta = getTopDelta(positionTop, overlayHeight, container, padding);
        positionTop += topDelta;
        arrowOffsetTop = 50 * (1 - (2 * topDelta) / overlayHeight) + '%';
    }
    else if (placement === 'top' || placement === 'bottom') {
        // atY = placement;
        // atX = myX = 'center';
        // myY = placement === 'top' ? 'bottom': 'top';
        if (placement === 'top') {
            positionTop = childOffset.top - overlayHeight;
        }
        else {
            positionTop = childOffset.top + childOffset.height;
        }
        positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
        var leftDelta = getLeftDelta(positionLeft, overlayWidth, container, padding);
        positionLeft += leftDelta;
        arrowOffsetLeft = 50 * (1 - (2 * leftDelta) / overlayHeight) + '%';
    }
    else if (placement === 'center') {
        // atX = atY = myX = myY = 'center';
        positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
        positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
        arrowOffsetLeft = arrowOffsetTop = void 0;
    }
    else {
        throw new Error("calcOverlayPosition(): No such placement of \"" + placement + "\" found.");
    }
    return {
        positionLeft: positionLeft / scaleX,
        positionTop: positionTop / scaleY,
        arrowOffsetLeft: arrowOffsetLeft / scaleX,
        arrowOffsetTop: arrowOffsetTop / scaleY,
        activePlacement: activePlacement
    };
}
exports.calculatePosition = calculatePosition;
//# sourceMappingURL=./utils/dom.js.map
