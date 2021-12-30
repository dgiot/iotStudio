/**
 * @file 这个 Input 与系统默认的 input 不同的地方在于，
 * 中文输入过程中不会触发 onChange 事件。对于 autoComplete
 * 功能很有必要。
 */
import React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    forwardedRef: React.Ref<HTMLInputElement>;
}
export interface InputState {
    value: any;
}
declare const _default: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: any;
}>;
export default _default;
