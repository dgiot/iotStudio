import React from 'react';
import { FormControlProps, FormBaseControl } from './Item';
/**
 * Rating
 * 文档：https://baidu.gitee.io/amis/docs/components/form/rating
 */
export interface RatingControlSchema extends FormBaseControl {
    type: 'input-rating';
    /**
     * 分数
     */
    count?: number;
    /**
     * 允许半颗星
     */
    half?: boolean;
    /**
     * 是否允许再次点击后清除
     */
    allowClear?: boolean;
}
export interface RatingProps extends FormControlProps {
    value: number;
    count: number;
    half: boolean;
    readOnly: boolean;
}
export default class RatingControl extends React.Component<RatingProps, any> {
    static defaultProps: Partial<RatingProps>;
    render(): JSX.Element;
}
export declare class RatingControlRenderer extends RatingControl {
}
