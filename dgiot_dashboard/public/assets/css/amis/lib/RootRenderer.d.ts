import React from 'react';
import { RootProps } from './Root';
import { IScopedContext } from './Scoped';
import { IRootStore } from './store/root';
import { Action } from './types';
export interface RootRendererProps extends RootProps {
    location?: any;
}
export declare class RootRenderer extends React.Component<RootRendererProps> {
    store: IRootStore;
    static contextType: React.Context<IScopedContext>;
    constructor(props: RootRendererProps);
    componentDidUpdate(prevProps: RootRendererProps): void;
    componentDidCatch(error: any, errorInfo: any): void;
    componentWillUnmount(): void;
    handleAction(e: React.UIEvent<any> | void, action: Action, ctx: object, throwErrors?: boolean, delegate?: IScopedContext): void;
    handleDialogConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDialogClose(): void;
    handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>): void;
    handleDrawerClose(): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    reloadTarget(scoped: IScopedContext, target: string, data?: any): void;
    render(): JSX.Element;
}
