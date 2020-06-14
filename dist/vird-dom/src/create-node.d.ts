import { VirdNode, VirdNodeTypes, VirdNodeComment, VirdNodeText, VirdNodeFragment } from '../../vird/index';
export declare function createNode(node: Node, trim?: boolean): VirdNode;
export declare function createNode(type: VirdNodeTypes['text'], properties?: VirdNodeText['properties']): VirdNodeText;
export declare function createNode(type: VirdNodeTypes['comment'], properties?: VirdNodeComment['properties']): VirdNodeComment;
export declare function createNode(type: VirdNodeTypes['fragment'], children?: string | (string | VirdNode)[]): VirdNodeFragment;
export declare function createNode(type: string, children: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties: VirdNode['properties'], children?: string | (string | VirdNode)[]): VirdNode;
export declare function createNode(type: string, properties?: VirdNode['properties'] | string | (string | VirdNode)[], children?: string | (string | VirdNode)[]): VirdNode;
