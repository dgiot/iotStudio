import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import { Payload, ApiObject, ApiString } from '../../types';
import { FileRejection } from 'react-dropzone';
import { SchemaApi, SchemaClassName, SchemaTokenizeableString } from '../../Schema';
/**
 * File 文件上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/file
 */
export interface FileControlSchema extends FormBaseControl {
    /**
     * 指定为文件上传
     */
    type: 'input-file';
    /**
     * 上传文件按钮说明
     * @default 请选择文件
     */
    btnLabel?: string;
    /**
     * 默认只支持纯文本，要支持其他类型，请配置此属性。建议直接填写文件后缀
     * 如：.txt,.csv
     *
     * 多个类型用逗号隔开。
     *
     * @default text/plain
     */
    accept?: string;
    /**
     * 如果上传的文件比较小可以设置此选项来简单的把文件 base64 的值给 form 一起提交，目前不支持多选。
     */
    asBase64?: boolean;
    /**
     * 如果不希望 File 组件上传，可以配置 `asBlob` 或者 `asBase64`，采用这种方式后，组件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。
     */
    asBlob?: boolean;
    /**
     * 是否自动开始上传
     */
    autoUpload?: boolean;
    /**
     * 默认 `/api/upload/chunk` 想自己存储时才需要关注。
     */
    chunkApi?: SchemaApi;
    /**
     * 分块大小，默认为 5M.
     *
     * @default 5242880
     */
    chunkSize?: number;
    /**
     * 分割符
     */
    delimiter?: string;
    /**
     * 默认显示文件路径的时候会支持直接下载，
     * 可以支持加前缀如：`http://xx.dom/filename=` ，
     * 如果不希望这样，可以把当前配置项设置为 `false`。
     *
     * 1.1.6 版本开始将支持变量 ${xxx} 来自己拼凑个下载地址，并且支持配置成 post.
     */
    downloadUrl?: SchemaApi;
    /**
     * 默认 `file`, 如果你不想自己存储，则可以忽略此属性。
     * @default file
     */
    fileField?: string;
    /**
     * 默认 `/api/upload/finishChunkApi` 想自己存储时才需要关注。
     *
     * @default /api/upload/finishChunkApi
     */
    finishChunkApi?: SchemaApi;
    /**
     * 是否隐藏上传按钮
     */
    hideUploadButton?: boolean;
    /**
     * 最多的个数
     */
    maxLength?: number;
    /**
     * 默认没有限制，当设置后，文件大小大于此值将不允许上传。
     */
    maxSize?: number;
    /**
     * 默认 `/api/upload/file` 如果想自己存储，请设置此选项。
     *
     * @default /api/upload/file
     */
    receiver?: SchemaApi;
    /**
     * 默认 `/api/upload/startChunk` 想自己存储时才需要关注。
     *
     * @default /api/upload/startChunk
     */
    startChunkApi?: string;
    /**
     * 默认为 'auto' amis 所在服务器，限制了文件上传大小不得超出10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。
     */
    useChunk?: 'auto' | boolean;
    /**
     * 按钮 CSS 类名
     */
    btnClassName?: SchemaClassName;
    /**
     * 上传按钮 CSS 类名
     */
    btnUploadClassName?: SchemaClassName;
    /**
     * 是否为多选
     */
    multiple?: boolean;
    /**
     * 1. 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，
     * 否则，整个选项对象都会作为该表单项的值提交。
     * 2. 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，
     * 否则直接将以数组的形式提交值。
     */
    joinValues?: boolean;
    /**
     * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
     */
    extractValue?: boolean;
    /**
     * 清除时设置的值
     */
    resetValue?: any;
    /**
     * 上传后把其他字段同步到表单内部。
     */
    autoFill?: {
        [propName: string]: SchemaTokenizeableString;
    };
    /**
     * 接口返回的数据中，哪个用来当做值
     */
    valueField?: string;
    /**
     * 接口返回的数据中，哪个用来展示文件名
     */
    nameField?: string;
    /**
     * 接口返回的数据中哪个用来作为下载地址。
     */
    urlField?: string;
    /**
     * 按钮状态文案配置。
     */
    stateTextMap?: {
        init: string;
        pending: string;
        uploading: string;
        error: string;
        uploaded: string;
        ready: string;
    };
}
export interface FileProps extends FormControlProps, Omit<FileControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    stateTextMap: {
        init: string;
        pending: string;
        uploading: string;
        error: string;
        uploaded: string;
        ready: string;
    };
}
export interface FileX extends File {
    state?: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid' | 'ready';
    progress?: number;
    id?: any;
}
export interface FileValue {
    filename?: string;
    value?: any;
    name?: string;
    url?: string;
    state: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid' | 'ready';
    id?: any;
    [propName: string]: any;
}
export interface FileState {
    uploading: boolean;
    files: Array<FileX | FileValue>;
    error?: string | null;
}
export declare function getNameFromUrl(url: string): string;
export default class FileControl extends React.Component<FileProps, FileState> {
    static defaultProps: Partial<FileProps>;
    state: FileState;
    current: FileValue | FileX | null;
    resolve?: (value?: any) => void;
    emitValue: any;
    fileUploadCancelExecutors: Array<{
        file: any;
        executor: () => void;
    }>;
    static valueToFile(value: string | FileValue, props: FileProps, files?: Array<FileX | FileValue>): FileValue | undefined;
    dropzone: React.RefObject<any>;
    constructor(props: FileProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: FileProps): void;
    handleDrop(files: Array<FileX>): void;
    handleDropRejected(rejectedFiles: FileRejection[], evt: React.DragEvent<any>): void;
    handleClickFile(file: FileX | FileValue, e: React.MouseEvent): void;
    handleSelect(): void;
    startUpload(retry?: boolean): void;
    toggleUpload(e: React.MouseEvent<HTMLButtonElement>): void;
    stopUpload(): void;
    retry(): void;
    tick(): void;
    sendFile(file: FileX, cb: (error: null | string, file?: FileX, obj?: FileValue) => void, onProgress: (progress: number) => void): void;
    removeFile(file: FileX | FileValue, index: number): void;
    clearError(): void;
    onChange(changeImmediately?: boolean): void;
    syncAutoFill(): void;
    uploadFile(file: FileX, receiver: string, params: object, config: Partial<FileProps> | undefined, onProgress: (progress: number) => void): Promise<Payload>;
    uploadBigFile(file: FileX, receiver: string, params: object, config: Partial<FileProps> | undefined, onProgress: (progress: number) => void): Promise<Payload>;
    _send(file: FileX, api: ApiObject | ApiString, data?: any, options?: object, onProgress?: (progress: number) => void): Promise<Payload>;
    removeFileCanelExecutor(file: any, execute?: boolean): void;
    validate(): any;
    render(): JSX.Element;
}
export declare class FileControlRenderer extends FileControl {
}
