/**
 * @file LazyComponent
 * @description
 * @author fex
 */
import React from 'react';
export interface LazyComponentProps {
    component?: React.ReactType;
    getComponent?: () => Promise<React.ReactType>;
    placeholder?: React.ReactNode;
    unMountOnHidden?: boolean;
    childProps?: object;
    visiblilityProps?: object;
    [propName: string]: any;
}
export interface LazyComponentState {
    visible: boolean;
    component?: React.ReactType;
}
export default class LazyComponent extends React.Component<LazyComponentProps, LazyComponentState> {
    static defaultProps: {
        placeholder: JSX.Element;
        unMountOnHidden: boolean;
        partialVisibility: boolean;
    };
    mounted: boolean;
    constructor(props: LazyComponentProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleVisibleChange(visible: boolean): void;
    render(): {};
}
