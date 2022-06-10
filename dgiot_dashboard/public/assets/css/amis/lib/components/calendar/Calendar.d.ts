/**
 * @file 基于 react-datetime 改造。
 */
import ReactDatePicker from 'react-datetime';
import React from 'react';
import moment from 'moment';
interface BaseDatePickerProps extends Omit<ReactDatePicker.DatetimepickerProps, 'viewMode'> {
    viewMode?: 'years' | 'months' | 'days' | 'time' | 'quarters';
    inputFormat?: string;
    onViewModeChange?: (type: string) => void;
    requiredConfirm?: boolean;
    onClose?: () => void;
    isEndDate?: boolean;
    minDate?: moment.Moment;
    renderDay?: (props: any, currentDate: moment.Moment, selectedDate: moment.Moment) => JSX.Element;
    renderQuarter?: (props: any, quartar: number, year?: number, date?: moment.Moment) => JSX.Element;
}
declare const _default: React.ComponentType<BaseDatePickerProps>;
export default _default;
