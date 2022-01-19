/// <reference types="node" />
import React from 'react';
import { RendererProps } from '../factory';
import { BaseSchema, SchemaCollection, SchemaName } from '../Schema';
/**
 * Carousel 轮播图渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/carousel
 */
export interface CarouselSchema extends BaseSchema {
    /**
     * 指定为轮播图类型
     */
    type: 'carousel';
    /**
     * 是否自动播放
     */
    auto?: boolean;
    /**
     * 轮播间隔时间
     */
    interval?: number;
    /**
     * 动画时长
     */
    duration?: number;
    /**
     * 设置宽度
     */
    width?: number;
    /**
     * 设置高度
     */
    height?: number;
    controlsTheme?: 'light' | 'dark';
    /**
     * 占位
     */
    placeholder?: string;
    /**
     * 配置控件内容
     */
    controls?: Array<'dots' | 'arrows'>;
    /**
     * 动画类型
     */
    animation?: 'fade' | 'slide';
    /**
     * 配置单条呈现模板
     */
    itemSchema?: SchemaCollection;
    name?: SchemaName;
    /**
     * 预览图模式
     */
    thumbMode?: 'contain' | 'cover';
    /**
     * 配置固定值
     */
    options?: Array<any>;
}
export interface CarouselProps extends RendererProps, Omit<CarouselSchema, 'className'> {
    value?: any;
}
export interface CarouselState {
    current: number;
    options: any[];
    nextAnimation: string;
}
export declare class Carousel extends React.Component<CarouselProps, CarouselState> {
    wrapperRef: React.RefObject<HTMLDivElement>;
    intervalTimeout: NodeJS.Timer | number;
    durationTimeout: NodeJS.Timer | number;
    static defaultProps: Pick<CarouselProps, 'auto' | 'interval' | 'duration' | 'controlsTheme' | 'animation' | 'controls' | 'placeholder'>;
    state: {
        current: number;
        options: any;
        nextAnimation: string;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: CarouselProps): void;
    componentWillUnmount(): void;
    prepareAutoSlide(): void;
    autoSlide(rel?: string): void;
    transitFramesTowards(direction: string, nextAnimation: string): void;
    getFrameId(pos?: string): number;
    next(): void;
    prev(): void;
    clearAutoTimeout(): void;
    renderDots(): JSX.Element;
    renderArrows(): JSX.Element;
    handleMouseEnter(): void;
    handleMouseLeave(): void;
    render(): JSX.Element;
}
export declare class CarouselRenderer extends Carousel {
}
