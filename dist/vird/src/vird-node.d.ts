import { VirdNodeTypes } from './vird-node-types';
declare const VirdNodeUniqueSymbol: unique symbol;
export interface VirdNode {
    type: string;
    properties: {
        [key: string]: string;
    };
    children: VirdNode[];
    [VirdNodeUniqueSymbol]: never;
}
export interface VirdNodeText extends VirdNode {
    type: VirdNodeTypes['text'];
    properties: {
        textContent: string;
    };
    children: never[];
}
export interface VirdNodeComment extends VirdNode {
    type: VirdNodeTypes['comment'];
    properties: {
        textContent: string;
    };
    children: never[];
}
export interface VirdNodeFragment extends VirdNode {
    type: VirdNodeTypes['fragment'];
    properties: {};
    children: VirdNode[];
}
export {};
