import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Hidden 隐藏域。功能性组件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/hidden
 */
export interface HiddenControlSchema extends FormBaseControl {
    type: 'hidden';
}
export default class HiddenControl extends React.Component<FormControlProps, any> {
    render(): null;
}
export declare class HiddenControlRenderer extends HiddenControl {
}
