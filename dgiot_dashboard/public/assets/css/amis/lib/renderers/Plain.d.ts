import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaTpl } from '../Schema';
/**
 * Plain 纯文本渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/plain
 */
export interface PlainSchema extends BaseSchema {
    /**
     * 指定为模板渲染器。
     *
     * 文档：https://baidu.gitee.io/amis/docs/concepts/template
     */
    type: 'plain' | 'text';
    tpl?: SchemaTpl;
    text?: SchemaTpl;
    /**
     * 是否内联显示？
     */
    inline?: boolean;
    /**
     * 占位符
     * @deprecated -
     */
    placeholder?: string;
}
export interface PlainProps extends RendererProps, Omit<PlainSchema, 'type' | 'className'> {
    wrapperComponent?: any;
}
export declare class Plain extends React.Component<PlainProps, object> {
    static defaultProps: Partial<PlainProps>;
    render(): JSX.Element;
}
export declare class PlainRenderer extends Plain {
}
