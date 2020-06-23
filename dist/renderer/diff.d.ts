declare type DiffObject<T extends {
    [key: string]: any;
}> = {
    [K in keyof T]?: [T[K] | undefined, T[K] | undefined];
};
export declare function diff<T = {
    [key: string]: any;
}>(checkObject?: T | undefined, comparisonObjet?: T | undefined): DiffObject<T>;
export {};
