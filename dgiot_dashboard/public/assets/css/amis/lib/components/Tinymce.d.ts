import React from 'react';
import 'tinymce/icons/default/index';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/template';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import { LocaleProps } from '../locale';
interface TinymceEditorProps extends LocaleProps {
    model: string;
    onModelChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    disabled?: boolean;
    config?: any;
    outputFormat?: 'html' | 'text';
    receiver?: string;
}
export default class TinymceEditor extends React.Component<TinymceEditorProps> {
    static defaultProps: {
        outputFormat: string;
    };
    config?: any;
    editor?: any;
    currentContent?: string;
    elementRef: React.RefObject<HTMLTextAreaElement>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: TinymceEditorProps): void;
    componentWillUnmount(): void;
    initEditor(e: any, editor: any): void;
    render(): JSX.Element;
}
export {};
