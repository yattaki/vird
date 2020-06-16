export declare function diff<T = {
    [key: string]: any;
}>(checkObject?: T, comparisonObjet?: T): { [K in keyof T]: [T[K] | undefined, T[K] | undefined]; };
