declare const db: {
    [propName: string]: any;
};
export declare const province: Array<number>;
export declare const city: {
    [propName: number]: Array<number>;
};
export declare const district: {
    [propName: number]: {
        [propName: number]: Array<number>;
    } | Array<number>;
};
export default db;
