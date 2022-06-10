export declare class SimpleMap<V = any, K = any> {
    private readonly list;
    has(key: K): boolean;
    set(key: K, value: V): void;
    get(key: K): V | null;
    delete(key: K): void;
    dispose(): void;
}
