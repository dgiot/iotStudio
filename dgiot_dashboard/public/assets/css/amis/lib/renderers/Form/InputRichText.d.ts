import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * RichText
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-rich-text
 */
export interface RichTextControlSchema extends FormBaseControl {
    type: 'input-rich-text';
    vendor?: 'froala' | 'tinymce';
    receiver?: string;
    videoReceiver?: string;
    /**
     * 边框模式，全边框，还是半边框，或者没边框。
     */
    borderMode?: 'full' | 'half' | 'none';
    options?: any;
}
export interface RichTextProps extends FormControlProps {
    options?: any;
    vendor?: 'froala' | 'tinymce';
}
export default class RichTextControl extends React.Component<RichTextProps, any> {
    static defaultProps: Partial<RichTextProps>;
    state: {
        focused: boolean;
    };
    config: any;
    constructor(props: RichTextProps);
    handleFocus(): void;
    handleBlur(): void;
    handleChange(value: any, submitOnChange?: boolean, changeImmediately?: boolean): void;
    render(): JSX.Element;
}
export declare class RichTextControlRenderer extends RichTextControl {
}
