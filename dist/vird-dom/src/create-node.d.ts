import { VirdNode } from '../../vird/index';
export declare function createNode(node: Node, trim?: boolean): VirdNode;
export declare function createNode(type: string, children: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode;
