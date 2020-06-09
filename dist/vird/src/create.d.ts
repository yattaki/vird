import { VirdNode } from './vird-node';
export declare function createText(text: string): VirdNode;
export declare function createComment(comment: string): VirdNode;
export declare function createFragment(...children: VirdNode[]): VirdNode;
export declare function createNode(type: string, children: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode;
