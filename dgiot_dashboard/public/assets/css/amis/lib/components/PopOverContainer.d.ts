import React from 'react';
export interface PopOverContainerProps {
    children: (props: {
        onClick: (e: React.MouseEvent) => void;
        isOpened: boolean;
        ref: any;
    }) => JSX.Element;
    popOverRender: (props: {
        onClose: () => void;
    }) => JSX.Element;
    popOverContainer?: any;
    popOverClassName?: string;
}
export interface PopOverContainerState {
    isOpened: boolean;
}
export declare class PopOverContainer extends React.Component<PopOverContainerProps, PopOverContainerState> {
    state: PopOverContainerState;
    target: any;
    targetRef(target: any): void;
    handleClick(): void;
    close(): void;
    getTarget(): any;
    getParent(): any;
    render(): JSX.Element;
}
export default PopOverContainer;
