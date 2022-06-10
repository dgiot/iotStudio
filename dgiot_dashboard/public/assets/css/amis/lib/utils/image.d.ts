/**
 * @file image 相关的工具
 * @param url
 */
/// <reference types="lodash" />
/**
 * 将 url 转成 dataurl
 * @param url
 */
export declare const toDataURL: ((url: string) => Promise<string>) & import("lodash").MemoizedFunction;
/**
 * 根据 url 获取图片尺寸
 * @param url
 */
export declare const getImageDimensions: ((url: string) => Promise<{
    width: number;
    height: number;
}>) & import("lodash").MemoizedFunction;
