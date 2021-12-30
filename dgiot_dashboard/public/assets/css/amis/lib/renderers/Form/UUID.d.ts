import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * UUID 功能性组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/uuid
 */
export interface UUIDControlSchema extends FormBaseControl {
    type: 'uuid';
    /**
     * 长度，默认 uuid 的长度是 36，如果不需要那么长，可以设置这个来缩短
     */
    length?: number;
}
export default class UUIDControl extends React.Component<FormControlProps, any> {
    constructor(props: FormControlProps);
    componentDidUpdate(props: FormControlProps): void;
    setValue(): void;
    render(): null;
}
export declare class UUIDControlRenderer extends UUIDControl {
}
