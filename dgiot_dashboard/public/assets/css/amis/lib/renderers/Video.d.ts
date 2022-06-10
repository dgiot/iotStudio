/**
 * @file video
 * @author fex
 */
import React from 'react';
import { RendererProps } from '../factory';
import 'video-react/dist/video-react.css';
import { BaseSchema, SchemaClassName, SchemaUrlPath } from '../Schema';
/**
 * 视频播放器
 * 文档：https://baidu.gitee.io/amis/docs/components/video
 */
export interface VideoSchema extends BaseSchema {
    /**
     * 指定为视频类型
     */
    type: 'video';
    /**
     * 是否自动播放
     */
    autoPlay?: boolean;
    /**
     * 如果显示切帧，通过此配置项可以控制每行显示多少帧
     */
    columnsCount?: number;
    /**
     * 设置后，可以显示切帧.点击帧的时候会将视频跳到对应时间。
     *
     * frames: {
     *  '01:22': 'http://domain/xxx.jpg'
     * }
     */
    frames?: {
        [propName: string]: string;
    };
    /**
     * 配置帧列表容器className
     */
    framesClassName?: SchemaClassName;
    /**
     * 如果是实时的，请标记一下
     */
    isLive?: boolean;
    /**
     * 点击帧画面时是否跳转视频对应的点
     *
     * @default true
     */
    jumpFrame?: boolean;
    /**
     * 是否初始静音
     */
    muted?: boolean;
    /**
     * 配置播放器 className
     */
    playerClassName?: SchemaClassName;
    /**
     * 视频封面地址
     */
    poster?: SchemaUrlPath;
    /**
     * 是否将视频和封面分开显示
     */
    splitPoster?: boolean;
    /**
     * 视频播放地址
     */
    src?: SchemaUrlPath;
    /**
     * 视频类型如： video/x-flv
     */
    videoType?: string;
    /**
     * 视频比率
     */
    aspectRatio?: 'auto' | '4:3' | '16:9';
    /**
     * 视频速率
     */
    rates?: Array<number>;
    /**
     * 跳转到帧时，往前多少秒。
     */
    jumpBufferDuration?: number;
}
export interface FlvSourceProps {
    src?: string;
    type?: string;
    video?: any;
    config?: object;
    manager?: any;
    isLive?: boolean;
    autoPlay?: boolean;
    actions?: any;
    order?: number;
    setError: (error: string) => void;
}
export declare class FlvSource extends React.Component<FlvSourceProps, any> {
    mpegtsPlayer: any;
    loaded: boolean;
    timer: any;
    unsubscribe: any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: FlvSourceProps): void;
    componentWillUnmount(): void;
    initFlv({ video, manager, src, isLive, config, actions, setError, autoPlay }: any): void;
    render(): JSX.Element;
}
export interface HlsSourceProps {
    src?: string;
    type?: string;
    video?: any;
    config?: object;
    manager?: any;
    isLive?: boolean;
    autoPlay?: boolean;
    actions?: any;
    order?: number;
}
export declare class HlsSource extends React.Component<HlsSourceProps, any> {
    hls: any;
    loaded: boolean;
    unsubscribe: any;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: HlsSourceProps): void;
    initHls({ video, manager, src, autoPlay, actions }: any): void;
    render(): JSX.Element;
}
export interface VideoProps extends RendererProps, Omit<VideoSchema, 'className'> {
    columnsCount: number;
}
export interface VideoState {
    posterInfo?: any;
    videoState?: any;
    error?: string;
}
export default class Video extends React.Component<VideoProps, VideoState> {
    static defaultProps: {
        columnsCount: number;
        isLive: boolean;
        jumpFrame: boolean;
        aspectRatio: string;
    };
    frameDom: any;
    cursorDom: any;
    player: any;
    times: Array<number>;
    currentIndex: number;
    constructor(props: VideoProps);
    onImageLoaded(e: Event): void;
    frameRef(dom: any): void;
    cursorRef(dom: any): void;
    playerRef(player: any): void;
    moveCursorToIndex(index: number): void;
    jumpToIndex(index: number): void;
    onClick(e: Event): void;
    setError(error?: string): void;
    renderFrames(): JSX.Element | null;
    renderPlayer(): JSX.Element;
    renderPosterAndPlayer(): JSX.Element;
    render(): JSX.Element;
}
export declare class VideoRenderer extends Video {
}
