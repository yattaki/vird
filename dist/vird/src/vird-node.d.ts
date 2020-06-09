export interface VirdNode {
    type: string;
    readonly properties: {
        [key: string]: string;
    };
    readonly children: VirdNode[];
}
