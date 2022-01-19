/// <reference types="react" />
import InputDateRange, { DateRangeControlSchema } from './InputDateRange';
/**
 * QuarterRange 季度范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-quarter-range
 */
export interface QuarterRangeControlSchema extends Omit<DateRangeControlSchema, 'type'> {
    type: 'input-quarter-range';
}
export default class QuarterRangeControl extends InputDateRange {
    render(): JSX.Element;
}
export declare class QuarterRangeControlRenderer extends QuarterRangeControl {
    static defaultProps: {
        format: string;
        joinValues: boolean;
        delimiter: string;
        timeFormat: string;
    };
}
