/**
 * @file 代码高亮
 */
import React from 'react';
import { BaseSchema } from '../Schema';
import { RendererProps } from '../factory';
export interface Token {
    /**
     * token 的正则
     */
    regex: string;
    /**
     * 正则的 flag
     */
    regexFlags?: string;
    /**
     * token 名称
     */
    name: string;
    /**
     * 文字颜色
     */
    color?: string;
    /**
     * 背景色，不过不知道为何没效果
     */
    background?: string;
    /**
     * 文字样式
     */
    fontStyle?: string;
}
export interface CustomLang {
    /**
     * 语言名字
     */
    name: string;
    /**
     * token
     */
    tokens: Token[];
}
/**
 * 代码高亮组件
 * 文档：https://baidu.gitee.io/amis/docs/components/code
 */
export interface CodeSchema extends BaseSchema {
    type: 'code';
    /**
     * 语言类型
     */
    language?: 'bat' | 'c' | 'coffeescript' | 'cpp' | 'csharp' | 'css' | 'dockerfile' | 'fsharp' | 'go' | 'handlebars' | 'html' | 'ini' | 'java' | 'javascript' | 'json' | 'less' | 'lua' | 'markdown' | 'msdax' | 'objective-c' | 'php' | 'plaintext' | 'postiats' | 'powershell' | 'pug' | 'python' | 'r' | 'razor' | 'ruby' | 'sb' | 'scss' | 'shell' | 'sol' | 'sql' | 'swift' | 'typescript' | 'vb' | 'xml' | 'yaml' | string;
    editorTheme?: string;
    /**
     * tab 大小
     */
    tabSize?: number;
    /**
     * 自定义语言
     */
    customLang?: CustomLang;
}
export interface CodeProps extends RendererProps, Omit<CodeSchema, 'type' | 'className'> {
}
export default class Code extends React.Component<CodeProps> {
    static defaultProps: Partial<CodeProps>;
    monaco: any;
    toDispose: Array<Function>;
    codeRef: React.RefObject<HTMLElement>;
    customLang: CustomLang;
    sourceCode: string;
    constructor(props: CodeProps);
    componentDidMount(): void;
    componentDidUpdate(preProps: CodeProps): void;
    handleMonaco(monaco: any): void;
    registTheme(): string | null;
    render(): JSX.Element;
}
export declare class CodeRenderer extends Code {
}
