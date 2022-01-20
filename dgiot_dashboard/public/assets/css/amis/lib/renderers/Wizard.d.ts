import React from 'react';
import { IScopedContext } from '../Scoped';
import { RendererProps } from '../factory';
import { IServiceStore } from '../store/service';
import { Action } from '../types';
import { BaseSchema, SchemaApi, SchemaClassName, SchemaExpression, SchemaName, SchemaReload } from '../Schema';
import { FormSchema } from './Form';
import { ActionSchema } from './Action';
export declare type WizardStepSchema = Omit<FormSchema, 'type'> & {
    /**
     * 当前步骤用来保存数据的 api。
     */
    api?: SchemaApi;
    asyncApi?: SchemaApi;
    /**
     * 当前步骤用来获取初始数据的 api
     */
    initApi?: SchemaApi;
    /**
     * 是否可直接跳转到该步骤，一般编辑模式需要可直接跳转查看。
     */
    jumpable?: boolean;
    /**
     * 通过 JS 表达式来配置当前步骤可否被直接跳转到。
     */
    jumpableOn?: SchemaExpression;
    /**
     * Step 标题
     */
    title?: string;
    label?: string;
    /**
     * 每一步可以单独配置按钮。如果不配置wizard会自动生成。
     */
    actions?: Array<ActionSchema>;
    /**
     * 保存完后，可以指定跳转地址，支持相对路径和组内绝对路径，同时可以通过 $xxx 使用变量
     */
    redirect?: string;
    reload?: SchemaReload;
    /**
     * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
     */
    target?: string;
};
/**
 * 表单向导
 * 文档：https://baidu.gitee.io/amis/docs/components/wizard
 */
export interface WizardSchema extends BaseSchema {
    /**
     * 指定为表单向导
     */
    type: 'wizard';
    /**
     * 配置按钮 className
     */
    actionClassName?: SchemaClassName;
    /**
     * 完成按钮的文字描述
     */
    actionFinishLabel?: string;
    /**
     * 下一步按钮的文字描述
     */
    actionNextLabel?: string;
    /**
     * 下一步并且保存按钮的文字描述
     */
    actionNextSaveLabel?: string;
    /**
     * 上一步按钮的文字描述
     */
    actionPrevLabel?: string;
    /**
     * Wizard 用来保存数据的 api。
     * [详情](https://baidu.github.io/amis/docs/api#wizard)
     */
    api?: SchemaApi;
    /**
     * 是否合并后再提交
     */
    bulkSubmit?: boolean;
    /**
     * Wizard 用来获取初始数据的 api。
     */
    initApi?: SchemaApi;
    /**
     * 展示模式
     *
     * @default vertical
     */
    mode?: 'vertical' | 'horizontal';
    name?: SchemaName;
    /**
     * 是否为只读模式。
     */
    readOnly?: boolean;
    /**
     * 保存完后，可以指定跳转地址，支持相对路径和组内绝对路径，同时可以通过 $xxx 使用变量
     */
    redirect?: string;
    reload?: SchemaReload;
    /**
     * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
     */
    target?: string;
    /**
     * 是否将底部按钮固定在底部。
     */
    affixFooter?: boolean | 'always';
    steps: Array<WizardStepSchema>;
    startStep?: string;
}
export interface WizardProps extends RendererProps, Omit<WizardSchema, 'className'> {
    store: IServiceStore;
    onFinished: (values: object, action: any) => any;
}
export interface WizardState {
    currentStep: number;
    completeStep: number;
}
export default class Wizard extends React.Component<WizardProps, WizardState> {
    static defaultProps: Partial<WizardProps>;
    static propsList: Array<string>;
    dom: any;
    form: any;
    asyncCancel: () => void;
    parentNode?: any;
    unSensor: Function;
    affixDom: React.RefObject<HTMLDivElement>;
    footerDom: React.RefObject<HTMLDivElement>;
    initalValues: {
        [propName: string]: any;
    };
    state: {
        currentStep: number;
        completeStep: number;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: WizardProps): void;
    componentWillUnmount(): void;
    affixDetect(): void;
    gotoStep(index: number): void;
    formRef(ref: any): void;
    submitToTarget(target: string, values: object): void;
    reloadTarget(target: string, data: any): void;
    reload(subPath?: string, query?: any, ctx?: any): void;
    receive(values: object): void;
    domRef(ref: any): void;
    getPopOverContainer(): any;
    checkSubmit(): void;
    handleAction(e: React.UIEvent<any> | void, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): void | Promise<void>;
    handleQuery(query: any): void;
    openFeedback(dialog: any, ctx: any): Promise<unknown>;
    handleChange(values: object): void;
    handleInit(values: any): void;
    handleReset(values: any): void;
    handleSubmit(values: object, action: Action): boolean;
    handleDialogConfirm(values: object[], action: Action, targets: Array<any>): void;
    handleDialogClose(): void;
    renderSteps(): JSX.Element;
    renderActions(): JSX.Element | null;
    renderFooter(): JSX.Element | null;
    renderWizard(): JSX.Element;
    render(): JSX.Element;
}
export declare class WizardRenderer extends Wizard {
    static contextType: React.Context<IScopedContext>;
    constructor(props: WizardProps, context: IScopedContext);
    componentWillUnmount(): void;
    doAction(action: Action, data: object, throwErrors?: boolean): void | Promise<void>;
    submitToTarget(target: string, values: object): void;
    reloadTarget(target: string, data: any): void;
    handleDialogConfirm(values: object[], action: Action, targets: Array<any>): void;
}
