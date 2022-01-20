/**
 * @file Overlay
 * @description
 * @author fex
 */
import React from 'react';
interface OverlayProps {
    placement?: string;
    show?: boolean;
    transition?: React.ReactType;
    containerPadding?: number;
    shouldUpdatePosition?: boolean;
    rootClose?: boolean;
    onHide?(props: any, ...args: any[]): any;
    container?: React.ReactNode | Function;
    target?: React.ReactNode | Function;
    watchTargetSizeChange?: boolean;
    onEnter?(node: HTMLElement): any;
    onEntering?(node: HTMLElement): any;
    onEntered?(node: HTMLElement): any;
    onExit?(node: HTMLElement): any;
    onExiting?(node: HTMLElement): any;
    onExited?(node: HTMLElement): any;
}
interface OverlayState {
    exited: boolean;
}
export default class Overlay extends React.Component<OverlayProps, OverlayState> {
    static defaultProps: {
        placement: string;
    };
    constructor(props: OverlayProps);
    position: any;
    positionRef: (position: any) => void;
    updatePosition(): void;
    componentDidUpdate(prevProps: OverlayProps): void;
    onHiddenListener(node: HTMLElement): void;
    render(): JSX.Element | null;
}
export {};
