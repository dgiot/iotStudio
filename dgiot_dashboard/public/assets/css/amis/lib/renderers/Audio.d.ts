import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaUrlPath } from '../Schema';
/**
 * Audio 音频渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/audio
 */
export interface AudioSchema extends BaseSchema {
    /**
     * 指定为音频播放器
     */
    type: 'audio';
    /**
     * 是否是内联模式
     */
    inline?: boolean;
    /**
     * "视频播放地址, 支持 $ 取变量。
     */
    src?: SchemaUrlPath;
    /**
     * 是否循环播放
     */
    loop?: boolean;
    /**
     * 是否自动播放
     */
    autoPlay?: boolean;
    /**
     * 配置可选播放倍速
     */
    rates?: Array<number>;
    /**
     * 可以配置控制器
     */
    controls?: Array<'rates' | 'play' | 'time' | 'process' | 'volume'>;
}
export interface AudioProps extends RendererProps, Omit<AudioSchema, 'className'> {
}
export interface AudioState {
    src?: string;
    isReady?: boolean;
    muted?: boolean;
    playing?: boolean;
    played: number;
    seeking?: boolean;
    volume: number;
    prevVolume: number;
    loaded?: number;
    playbackRate: number;
    showHandlePlaybackRate: boolean;
    showHandleVolume: boolean;
}
export declare class Audio extends React.Component<AudioProps, AudioState> {
    audio: HTMLMediaElement;
    progressTimeout: ReturnType<typeof setTimeout>;
    durationTimeout: ReturnType<typeof setTimeout>;
    static defaultProps: Pick<AudioProps, 'inline' | 'autoPlay' | 'playbackRate' | 'loop' | 'rates' | 'progressInterval' | 'controls'>;
    state: AudioState;
    componentWillUnmount(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: AudioProps): void;
    progress(): void;
    audioRef(audio: HTMLMediaElement): void;
    load(): void;
    handlePlaybackRate(rate: number): void;
    handleMute(): void;
    handlePlaying(): void;
    getCurrentTime(): string;
    getDuration(): string | number;
    onDurationCheck(): void;
    onSeekChange(e: any): void;
    onSeekMouseDown(): void;
    onSeekMouseUp(e: any): void;
    setVolume(e: any): void;
    formatTime(seconds: number): string;
    pad(string: number): string;
    toggleHandlePlaybackRate(): void;
    toggleHandleVolume(type: boolean): void;
    renderRates(): JSX.Element | null;
    renderPlay(): JSX.Element;
    renderTime(): JSX.Element;
    renderProcess(): JSX.Element;
    renderVolume(): JSX.Element;
    render(): JSX.Element;
}
export declare class AudioRenderer extends Audio {
}
