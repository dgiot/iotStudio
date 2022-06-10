import React from 'react';
/**
 * 主要目的是希望在是用 bootstrap 组件的时候不需要带 bs 前缀。
 *
 * @param {Object} rawProps 原始属性对象。
 * @return {Object}
 */
export declare const props2BsProps: (rawProps: {
    [propName: string]: any;
}) => {
    [propName: string]: any;
};
/**
 * props2BsProps 的 hoc 版本
 *
 * @param {*} ComposedComponent 组合组件
 * @return {Component}
 */
export declare const props2BsPropsHoc: (ComposedComponent: React.ComponentType<any>) => React.ComponentType<any>;
export declare function getContainer(container: any, defaultContainer: any): any;
export declare function ownerDocument(componentOrElement: any): Document;
export declare function calculatePosition(placement: any, overlayNode: any, target: HTMLElement, container: any, padding?: any): {
    positionLeft: number;
    positionTop: number;
    arrowOffsetLeft: number;
    arrowOffsetTop: number;
    activePlacement: string;
};
