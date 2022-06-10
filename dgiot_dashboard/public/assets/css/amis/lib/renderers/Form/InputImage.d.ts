import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
import 'cropperjs/dist/cropper.css';
import { FileRejection } from 'react-dropzone';
import 'blueimp-canvastoblob';
import { Payload } from '../../types';
import { ImageThumbProps } from '../Image';
import { TranslateFn } from '../../locale';
import { SchemaApi, SchemaClassName, SchemaTokenizeableString, SchemaUrlPath } from '../../Schema';
/**
 * Image 图片上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/image
 */
export interface ImageControlSchema extends FormBaseControl {
    /**
     * 指定为图片上传控件
     */
    type: 'input-image';
    /**
     * 默认展示图片的链接
     */
    src?: SchemaUrlPath;
    /**
     * 默认展示图片的类名
     */
    imageClassName?: string;
    /**
     * 配置接收的图片类型
     *
     * 建议直接填写文件后缀
     * 如：.txt,.csv
     *
     * 多个类型用逗号隔开。
     */
    accept?: string;
    /**
     * 默认都是通过用户选择图片后上传返回图片地址，如果开启此选项，则可以允许用户图片地址。
     */
    allowInput?: boolean;
    /**
     * 是否自动开始上传
     */
    autoUpload?: boolean;
    /**
     * 选择图片按钮的 CSS 类名
     */
    btnClassName?: SchemaClassName;
    /**
     * 上传按钮的 CSS 类名
     */
    btnUploadClassName?: SchemaClassName;
    /**
     * @deprecated
     */
    compress?: boolean;
    /**
     * @deprecated
     */
    compressOptions?: {
        maxHeight?: number;
        maxWidth?: number;
    };
    crop?: boolean | {
        /**
         * 默认 `1` 即 `1:1`
         *
         * 留空将不限制
         */
        aspectRatio?: number;
        guides?: boolean;
        dragMode?: string;
        viewMode?: number;
        rotatable?: boolean;
        scalable?: boolean;
    };
    /**
     * 裁剪后的图片类型
     */
    cropFormat?: string;
    /**
     * 裁剪后的质量
     */
    cropQuality?: number;
    /**
     * 是否允许二次裁剪。
     */
    reCropable?: boolean;
    /**
     * 是否隐藏上传按钮
     */
    hideUploadButton?: boolean;
    /**
     * 限制图片大小，超出不让上传。
     */
    limit?: {
        /**
         * 比率不对时的提示文字
         */
        aspectRatioLabel?: string;
        /**
         * 限制比率
         */
        aspectRatio?: number;
        /**
         * 限制图片高度
         */
        height?: number;
        /**
         *  限制图片宽度
         */
        width?: number;
        /**
         * 限制图片最大高度
         */
        maxHeight?: number;
        /**
         * 限制图片最大宽度
         */
        maxWidth?: number;
        /**
         * 限制图片最小高度
         */
        minHeight?: number;
        /**
         *  限制图片最小宽度
         */
        minWidth?: number;
    };
    /**
     * 最多的个数
     */
    maxLength?: number;
    /**
     * 默认没有限制，当设置后，文件大小大于此值将不允许上传。
     */
    maxSize?: number;
    /**
     * 默认 `/api/upload` 如果想自己存储，请设置此选项。
     */
    receiver?: SchemaApi;
    /**
     * 默认为 false, 开启后，允许用户输入压缩选项。
     *
     * @deprecated
     */
    showCompressOptions?: boolean;
    /**
     * 是否为多选
     */
    multiple?: boolean;
    /**
     * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
     * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
     */
    joinValues?: boolean;
    /**
     * 分割符
     */
    delimiter?: string;
    /**
     * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
     */
    extractValue?: boolean;
    /**
     * 清除时设置的值
     */
    resetValue?: any;
    /**
     * 缩路图展示模式
     */
    thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
    /**
     * 缩路图展示比率。
     */
    thumbRatio?: '1:1' | '4:3' | '16:9';
    /**
     * 上传后把其他字段同步到表单内部。
     */
    autoFill?: {
        [propName: string]: SchemaTokenizeableString;
    };
    /**
     * 默认占位图图片地址
     */
    frameImage?: SchemaUrlPath;
    /**
     * 是否开启固定尺寸
     */
    fixedSize?: boolean;
    /**
     * 固定尺寸的 CSS类名
     */
    fixedSizeClassName?: SchemaClassName;
}
export interface ImageProps extends FormControlProps, Omit<ImageControlSchema, 'type' | 'className' | 'descriptionClassName' | 'inputClassName'> {
    onImageEnlarge?: (info: Pick<ImageThumbProps, 'src' | 'originalSrc' | 'title' | 'caption'> & {
        index?: number;
        list?: Array<Pick<ImageThumbProps, 'src' | 'originalSrc' | 'title' | 'caption'>>;
    }) => void;
}
export interface ImageState {
    uploading: boolean;
    locked: boolean;
    lockedReason?: string;
    files: Array<FileValue | FileX>;
    crop?: any;
    error?: string;
    cropFile?: FileValue;
    submitOnChange?: boolean;
    frameImageWidth?: number;
}
export interface FileValue {
    value?: any;
    state: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
    url?: string;
    error?: string;
    info?: {
        width: number;
        height: number;
        len?: number;
    };
    [propName: string]: any;
}
export interface FileX extends File {
    id?: string | number;
    preview?: string;
    state?: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
    progress?: number;
    [propName: string]: any;
}
export default class ImageControl extends React.Component<ImageProps, ImageState> {
    static defaultProps: {
        limit: undefined;
        accept: string;
        receiver: string;
        hideUploadButton: boolean;
        placeholder: string;
        joinValues: boolean;
        extractValue: boolean;
        delimiter: string;
        autoUpload: boolean;
        multiple: boolean;
    };
    static formatFileSize(size: number | string, units?: string[]): string;
    static valueToFile(value: string | object, props?: ImageProps): FileValue | undefined;
    static sizeInfo(width: number | undefined, height: number | undefined, __: TranslateFn): string;
    state: ImageState;
    files: Array<FileValue | FileX>;
    fileUploadCancelExecutors: Array<{
        file: any;
        executor: () => void;
    }>;
    cropper: Cropper;
    dropzone: React.RefObject<any>;
    frameImageRef: React.RefObject<any>;
    current: FileValue | FileX | null;
    resolve?: (value?: any) => void;
    emitValue: any;
    unmounted: boolean;
    constructor(props: ImageProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ImageProps): void;
    componentWillUnmount(): void;
    buildCrop(props: ImageProps): false | {
        /**
         * 默认 `1` 即 `1:1`
         *
         * 留空将不限制
         */
        aspectRatio?: number | undefined;
        guides?: boolean | undefined;
        dragMode?: string | undefined;
        viewMode?: number | undefined;
        rotatable?: boolean | undefined;
        scalable?: boolean | undefined;
    } | null | undefined;
    handleDropRejected(rejectedFiles: FileRejection[], evt: React.DragEvent<any>): void;
    startUpload(retry?: boolean): void;
    toggleUpload(): void;
    stopUpload(): void;
    tick(): void;
    removeFile(file: FileValue, index: number): void;
    previewImage(file: FileX, index: number, e: React.MouseEvent<any>): void;
    editImage(index: number): void;
    onChange(changeImmediately?: boolean): void;
    syncAutoFill(): void;
    handleSelect(): void;
    handleRetry(index: number): void;
    handleDrop(files: Array<FileX>): void;
    handlePaste(e: React.ClipboardEvent<any>): void;
    handleCrop(): void;
    cancelCrop(): void;
    rotatableCrop(): void;
    addFiles(files: Array<FileX>): void;
    sendFile(file: FileX, cb: (error: null | string, file: FileX, obj?: FileValue) => void, onProgress: (progress: number) => void): void;
    _upload(file: Blob, cb: (error: null | string, file: Blob, obj?: FileValue) => void, onProgress: (progress: number) => void): void;
    _send(file: Blob, receiver: string, params: object, onProgress: (progress: number) => void): Promise<Payload>;
    removeFileCanelExecutor(file: any, execute?: boolean): void;
    handleClick(): void;
    handleImageLoaded(index: number, e: React.UIEvent<any>): void;
    handleFrameImageLoaded(e: React.UIEvent<any>): void;
    validate(): any;
    render(): JSX.Element;
}
export declare class ImageControlRenderer extends ImageControl {
}
