export declare function HocStoreFactory(renderer: {
    storeType: string;
    extendsData?: boolean | ((props: any) => boolean);
    shouldSyncSuperStore?: (store: any, props: any, prevProps: any) => boolean | undefined;
}): any;
