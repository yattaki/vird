export declare const diff: <T = {
    [key: string]: any;
}>(checkObject?: T | undefined, comparisonObjet?: T | undefined) => { [K in keyof T]: [T[K] | undefined, T[K] | undefined]; };
