/**
 * @file RichText
 * @description
 * @author fex
 */
import React from 'react';
import 'froala-editor/js/plugins/align.min';
import 'froala-editor/js/plugins/colors.min';
import 'froala-editor/js/plugins/char_counter.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/draggable.min';
import 'froala-editor/js/plugins/entities.min';
import 'froala-editor/js/plugins/font_family.min';
import 'froala-editor/js/plugins/font_size.min';
import 'froala-editor/js/plugins/forms.min';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/help.min';
import 'froala-editor/js/plugins/image.min';
import 'froala-editor/js/plugins/inline_class.min';
import 'froala-editor/js/plugins/inline_style.min';
import 'froala-editor/js/plugins/line_breaker.min';
import 'froala-editor/js/plugins/line_height.min';
import 'froala-editor/js/plugins/link.min';
import 'froala-editor/js/plugins/lists.min';
import 'froala-editor/js/plugins/paragraph_format.min';
import 'froala-editor/js/plugins/paragraph_style.min';
import 'froala-editor/js/plugins/print.min';
import 'froala-editor/js/plugins/quick_insert.min';
import 'froala-editor/js/plugins/quote.min';
import 'froala-editor/js/plugins/save.min';
import 'froala-editor/js/plugins/special_characters.min';
import 'froala-editor/js/plugins/table.min';
import 'froala-editor/js/plugins/url.min';
import 'froala-editor/js/plugins/video.min';
import 'froala-editor/js/plugins/word_paste.min';
import 'froala-editor/js/languages/zh_cn.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
export interface FroalaEditorComponentProps {
    config: any;
    model: string;
    onModelChange: (value: string) => void;
}
export default class extends React.Component<any, any> {
    constructor(props: any);
    render(): JSX.Element;
}
