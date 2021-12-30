import React from 'react';
interface MarkdownProps {
    content: string;
}
export default class Markdown extends React.Component<MarkdownProps> {
    dom: any;
    constructor(props: MarkdownProps);
    htmlRef(dom: any): void;
    componentDidUpdate(nextProps: MarkdownProps): void;
    _render(): void;
    render(): JSX.Element;
}
export {};
