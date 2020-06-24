declare type DiffObject<T extends {
    [key: string]: any;
}> = {
    [K in keyof T]?: [T[K] | undefined, T[K] | undefined];
};
/**
 * The diff () function gets the diff of an object.
 * @param checkObject An object to compare the differences.
 * @param comparisonObjet An object to compare.
 */
export declare function diff<T = {
    [key: string]: any;
}>(checkObject?: T | undefined, comparisonObjet?: T | undefined): DiffObject<T>;
export {};
