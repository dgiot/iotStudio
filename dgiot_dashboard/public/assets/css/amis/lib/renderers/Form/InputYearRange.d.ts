/// <reference types="react" />
import InputDateRange, { DateRangeControlSchema } from './InputDateRange';
/**
 * YearRange 年份范围控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-year-range
 */
export interface YearRangeControlSchema extends Omit<DateRangeControlSchema, 'type'> {
    type: 'input-year-range';
}
export default class YearRangeControl extends InputDateRange {
    render(): JSX.Element;
}
export declare class YearRangeControlRenderer extends YearRangeControl {
    static defaultProps: {
        format: string;
        joinValues: boolean;
        delimiter: string;
        timeFormat: string;
        inputFormat: string;
        dateFormat: string;
    };
}
